import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  assertTransitionAllowed,
  buildDashboardSummary,
  buildHealthcheckSummary,
  buildPrePublishChecks,
  buildPublishQueue,
  buildReviewSummary,
  compileNewsroomSitePayload,
  validateNewsroomData,
} from "@/lib/newsroom";
import { loadNewsroomData } from "@/lib/newsroom-io";

async function makeTempRepo() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "twotal-newsroom-"));
  const ignoredDirectories = new Set(["node_modules", ".git", ".next", ".next-local"]);

  await cp(process.cwd(), tempDir, {
    recursive: true,
    filter: (source) => {
      const relative = path.relative(process.cwd(), source);

      if (!relative) {
        return true;
      }

      return relative.split(path.sep).every((segment) => !ignoredDirectories.has(segment));
    },
  });
  return tempDir;
}

async function writeJson(filePath: string, value: unknown) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

describe("newsroom core", () => {
  it("validates the committed newsroom state without hard errors", async () => {
    const data = await loadNewsroomData(process.cwd());
    const issues = validateNewsroomData(data);
    const errors = issues.filter((issue) => issue.severity === "error");
    const publishedDispatchLinks = data.dispatch
      .filter((entry) => entry.status === "published")
      .flatMap((entry) => entry.items.map((item) => item.link));

    expect(errors).toHaveLength(0);
    expect(data.dispatch.filter((entry) => entry.status === "published").every((entry) => entry.items.length === 5)).toBe(true);
    expect(publishedDispatchLinks.every((link) => /^\/(article\/[a-z0-9-]+|brief|dispatch(?:\/[a-z0-9-]+)?|about)$/.test(link))).toBe(true);
  });

  it("compiles published newsroom records into a deterministic site payload", async () => {
    const data = await loadNewsroomData(process.cwd());
    const payload = compileNewsroomSitePayload(data, "2026-04-06T12:00:00.000Z");

    expect(payload.articles.map((entry) => entry.slug)).toEqual([
      "five-points-before-espanyol-and-madrid",
      "espanyol-between-the-legs",
      "territory-without-punch",
      "one-opponent-four-days-two-different-truths",
      "femen-bayern-pulse",
    ]);
    expect(payload.dispatchIssues.map((entry) => entry.slug)).toEqual(["weekly-dispatch-april-10-2026"]);
    expect(payload.frontPagePlan.heroArticleSlug).toBe("espanyol-between-the-legs");
    expect(payload.frontPagePlan.briefArticleSlugs).toEqual([
      "five-points-before-espanyol-and-madrid",
      "espanyol-between-the-legs",
      "territory-without-punch",
    ]);
    expect(payload.frontPagePlan.tickerArticleSlugs).toEqual([
      "espanyol-between-the-legs",
      "territory-without-punch",
      "one-opponent-four-days-two-different-truths",
    ]);
    expect(payload.frontPagePlan.isValid).toBe(true);
  });

  it("blocks planning dispatches and hidden-route links from publishable dispatch states", async () => {
    const data = await loadNewsroomData(process.cwd());
    const liveDispatch = data.dispatch.find((entry) => entry.slug === "week-in-blaugrana-1");
    const planningDispatch = data.dispatch.find((entry) => entry.slug === "week-in-blaugrana-14-planning");

    expect(liveDispatch).toBeDefined();
    expect(planningDispatch).toBeDefined();

    const hiddenRouteDispatch = {
      ...liveDispatch!,
      status: "scheduled" as const,
      items: liveDispatch!.items.map((item, index) => (index === 1 ? { ...item, link: "/analysis" } : item)),
    };
    const planningPublishDispatch = {
      ...planningDispatch!,
      status: "scheduled" as const,
    };

    const hiddenRouteChecks = buildPrePublishChecks({
      record: hiddenRouteDispatch,
      approvals: data.approvals,
      workflow: data.workflow,
      drafts: data.drafts,
      reviews: data.reviews,
      editorialCalendar: data.editorialCalendar,
    });
    const planningChecks = buildPrePublishChecks({
      record: planningPublishDispatch,
      approvals: data.approvals,
      workflow: data.workflow,
      drafts: data.drafts,
      reviews: data.reviews,
      editorialCalendar: data.editorialCalendar,
    });

    expect(hiddenRouteChecks.ok).toBe(false);
    expect(hiddenRouteChecks.diagnostics).toEqual(
      expect.arrayContaining([expect.stringMatching(/hidden route '\/analysis'/i)]),
    );
    expect(planningChecks.ok).toBe(false);
    expect(planningChecks.diagnostics).toEqual(
      expect.arrayContaining([expect.stringMatching(/planning issue/i)]),
    );
  });

  it("blocks unsafe transitions until approval coverage exists", async () => {
    const data = await loadNewsroomData(process.cwd());
    const record = data.articles.find((article) => article.slug === "montjuic-needs-a-louder-start");

    expect(record).toBeDefined();

    const unsafeRecord = {
      ...record!,
      status: "copy_review" as const,
      approvalIds: [],
    };

    expect(() =>
      assertTransitionAllowed({
        record: unsafeRecord,
        kind: "article",
        targetStatus: "approved",
        approvals: data.approvals,
        workflow: data.workflow,
      }),
    ).toThrow(/missing approvals|changes requested/i);
  });

  it("blocks weak scheduled content in pre-publish checks", async () => {
    const data = await loadNewsroomData(process.cwd());
    const article = data.articles.find((entry) => entry.slug === "montjuic-needs-a-louder-start");
    const dispatch = data.dispatch.find((entry) => entry.slug === "week-in-blaugrana-14-planning");

    expect(article).toBeDefined();
    expect(dispatch).toBeDefined();

    const weakArticle = {
      ...article!,
      headline: "TBD headline",
      dek: "TODO",
      excerpt: "Placeholder copy.",
      body: ["TODO intro paragraph.", "Short placeholder paragraph."],
    };
    const weakDispatch = {
      ...dispatch!,
      issueTitle: "TBD dispatch",
      editorsNote: "Placeholder note for later.",
      items: [
        {
          ...dispatch!.items[0],
          summary: "Too short.",
        },
        {
          ...dispatch!.items[1],
          summary: "Still too short.",
        },
      ],
    };

    const articleChecks = buildPrePublishChecks({
      record: weakArticle,
      approvals: data.approvals,
      workflow: data.workflow,
      drafts: data.drafts,
      reviews: data.reviews,
      editorialCalendar: data.editorialCalendar,
    });
    const dispatchChecks = buildPrePublishChecks({
      record: weakDispatch,
      approvals: data.approvals,
      workflow: data.workflow,
      drafts: data.drafts,
      reviews: data.reviews,
      editorialCalendar: data.editorialCalendar,
    });

    expect(articleChecks.ok).toBe(false);
    expect(articleChecks.diagnostics).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/quality/i),
        expect.stringMatching(/paragraphs|placeholder|headline|word/i),
      ]),
    );
    expect(dispatchChecks.ok).toBe(false);
    expect(dispatchChecks.diagnostics).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/quality/i),
        expect.stringMatching(/at least 5 items/i),
        expect.stringMatching(/editors note|items|summary|placeholder/i),
      ]),
    );
  });

  it("surfaces quality gate diagnostics in review summary blocked records", async () => {
    const data = await loadNewsroomData(process.cwd());
    const article = data.articles.find((entry) => entry.slug === "montjuic-needs-a-louder-start");

    expect(article).toBeDefined();

    const weakArticle = {
      ...article!,
      headline: "TBD headline",
      dek: "Short dek",
      excerpt: "Placeholder excerpt.",
      body: ["TODO intro paragraph.", "Short placeholder paragraph."],
      status: "scheduled" as const,
    };
    const mutatedData = {
      ...data,
      articles: data.articles.map((entry) => (entry.id === weakArticle.id ? weakArticle : entry)),
    };

    const reviewSummary = buildReviewSummary(mutatedData, "2026-04-06T12:00:00.000Z");
    const diagnostic = reviewSummary.pendingApprovals.find((entry) => entry.slug === weakArticle.slug);

    expect(reviewSummary.blockedRecords.map((entry) => entry.slug)).toContain(weakArticle.slug);
    expect(diagnostic?.diagnostics).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/quality/i),
        expect.stringMatching(/paragraphs|placeholder|word/i),
      ]),
    );
  });

  it("keeps the published briefing records clear of quality blockers", async () => {
    const data = await loadNewsroomData(process.cwd());
    const queue = buildPublishQueue(data, "2026-04-06T12:00:00.000Z");

    const montjuicEntry = queue.find((entry) => entry.slug === "montjuic-needs-a-louder-start");
    const dispatchEntry = queue.find((entry) => entry.slug === "week-in-blaugrana-1");

    expect(montjuicEntry).toBeUndefined();
    expect(dispatchEntry).toBeUndefined();
  });

  it("summarizes dashboard, review, queue, and health state from newsroom files", async () => {
    const data = await loadNewsroomData(process.cwd());
    const dashboard = buildDashboardSummary(data, "2026-04-06T12:00:00.000Z");
    const reviewSummary = buildReviewSummary(data, "2026-04-06T12:00:00.000Z");
    const queue = buildPublishQueue(data, "2026-04-06T12:00:00.000Z");
    const health = buildHealthcheckSummary(data, validateNewsroomData(data), "2026-04-06T12:00:00.000Z");

    expect(dashboard.counts.signals).toBeGreaterThan(0);
    expect(dashboard.counts.drafts).toBeGreaterThan(0);
    expect(Array.isArray(reviewSummary.pendingApprovals)).toBe(true);
    expect(queue).toHaveLength(6);
    expect(queue.every((entry) => entry.status === "published")).toBe(true);
    expect(health.healthy).toBe(true);
  });

  it("ingest prefers live scout signals and preserves scouting metadata over stale placeholders", async () => {
    const tempDir = await makeTempRepo();

    try {
      await writeJson(path.join(tempDir, "newsroom/generated/barca-live-source.json"), {
        schemaVersion: 1,
        generatedAt: "2026-04-09T18:10:00.000Z",
        sourceStatuses: [
          {
            source: "bird",
            ok: true,
            fetchedAt: "2026-04-09T18:08:00.000Z",
            itemCount: 3,
            detail: "Account search collected supporter-facing reaction posts.",
          },
        ],
        sources: [
          {
            schemaVersion: 1,
            id: "source-barca-live-scout",
            slug: "barca-live-scout",
            name: "Barca Live Scout",
            type: "watcher",
            enabled: true,
            cadence: "live",
            discoveryMode: "live",
            tags: ["barca", "live", "supporter"],
            pendingEvents: [
              {
                id: "madrid-without-cubarsi",
                headline: "Madrid without Cubarsi changes the second-leg plan",
                summary: "Supporter conversation and match context both center on how Barcelona reshape the back line for the return at the Metropolitano.",
                signalType: "match",
                eventAt: "2026-04-05T18:00:00.000Z",
                urgency: "high",
                tags: ["ucl", "atletico", "cubarsi", "second-leg"],
                priorityScore: 97,
                priorityReason: "Exact match consequence, selection fallout, and second-leg gravity all align with the editorial line.",
                assignmentTopic: "Atlético Madrid vs Barcelona second leg / Pau Cubarsi suspension",
                assignment: {
                  title: "Madrid without Cubarsi",
                  kind: "article",
                  owner: "editor-in-chief",
                  approver: "editor-in-chief",
                  deadline: "2026-04-09T23:00:00.000Z",
                  brief: "Frame the return leg around the exact defensive consequence of Cubarsi's suspension and the first goal swing.",
                  deliverables: ["Match-context analysis", "Selection consequences", "Supporter concern note"],
                },
              },
            ],
          },
        ],
      });

      execFileSync("npm", ["run", "newsroom:ingest"], { cwd: tempDir, stdio: "pipe" });

      const ingestionReport = JSON.parse(await readFile(path.join(tempDir, "newsroom/generated/ingestion-report.json"), "utf8"));
      const liveSignal = JSON.parse(
        await readFile(path.join(tempDir, "newsroom/generated/signals/barca-live-scout-madrid-without-cubarsi.json"), "utf8"),
      );

      expect(ingestionReport.activeSignals[0]).toBe("barca-live-scout-madrid-without-cubarsi");
      expect(liveSignal.priorityScore).toBe(97);
      expect(liveSignal.priorityReason).toMatch(/second-leg gravity/i);
      expect(liveSignal.assignmentTopic).toBe("Atlético Madrid vs Barcelona second leg / Pau Cubarsi suspension");
      expect(liveSignal.discoveryMode).toBe("live");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("ingest removes stale montjuic signals once the source is disabled", async () => {
    const tempDir = await makeTempRepo();

    try {
      const montjuicSourcePath = path.join(tempDir, "newsroom/sources/montjuic-arrival-pattern.json");
      const montjuicSource = JSON.parse(await readFile(montjuicSourcePath, "utf8"));
      await writeJson(montjuicSourcePath, {
        ...montjuicSource,
        enabled: false,
        status: "ignored",
      });

      execFileSync("npm", ["run", "newsroom:ingest"], { cwd: tempDir, stdio: "pipe" });

      await expect(readFile(path.join(tempDir, "newsroom/generated/signals/montjuic-arrival-pattern.json"), "utf8")).rejects.toThrow();

      const ingestionReport = JSON.parse(await readFile(path.join(tempDir, "newsroom/generated/ingestion-report.json"), "utf8"));
      expect(ingestionReport.activeSignals).not.toContain("montjuic-arrival-pattern");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it(
    "runs the newsroom pipeline scripts against a temp repo copy",
    async () => {
      const tempDir = await makeTempRepo();

      try {
        execFileSync("npm", ["run", "newsroom:ingest"], { cwd: tempDir, stdio: "pipe" });
        execFileSync("npm", ["run", "newsroom:trigger-cycle"], { cwd: tempDir, stdio: "pipe" });
        execFileSync("npm", ["run", "newsroom:generate-draft", "--", "--assignment", "assignment-montjuic-culture-column"], {
          cwd: tempDir,
          stdio: "pipe",
        });
        execFileSync("npm", ["run", "newsroom:request-approval", "--", "--kind", "article", "--slug", "montjuic-needs-a-louder-start"], {
          cwd: tempDir,
          stdio: "pipe",
        });
        execFileSync("npm", ["run", "newsroom:review-summary"], { cwd: tempDir, stdio: "pipe" });
        execFileSync("npm", ["run", "newsroom:publish-cycle"], { cwd: tempDir, stdio: "pipe" });
        execFileSync("npm", ["run", "newsroom:healthcheck"], { cwd: tempDir, stdio: "pipe" });

        const signal = JSON.parse(
          await readFile(path.join(tempDir, "newsroom/generated/signals/match-notes-watch-early-pressure-pattern.json"), "utf8"),
        );
        const reviewSummary = JSON.parse(await readFile(path.join(tempDir, "newsroom/generated/review-summary.json"), "utf8"));
        const draft = JSON.parse(await readFile(path.join(tempDir, "newsroom/drafts/montjuic-needs-a-louder-start-v1.json"), "utf8"));

        expect(signal.assignmentId).toBeDefined();
        expect(reviewSummary.pendingApprovals.length).toBeGreaterThan(0);
        expect(draft.recordId).toBe("article-montjuic-louder-start");
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    },
    20000,
  );
});
