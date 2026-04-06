import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  assertTransitionAllowed,
  buildDashboardSummary,
  buildHealthcheckSummary,
  buildPublishQueue,
  buildReviewSummary,
  compileNewsroomSitePayload,
  validateNewsroomData,
} from "@/lib/newsroom";
import { loadNewsroomData } from "@/lib/newsroom-io";

async function makeTempRepo() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "twotal-newsroom-"));
  await cp(process.cwd(), tempDir, {
    recursive: true,
    filter: (source) => !source.includes(`${path.sep}node_modules${path.sep}`) && !source.endsWith(`${path.sep}node_modules`),
  });
  return tempDir;
}

describe("newsroom core", () => {
  it("validates the committed newsroom state without hard errors", async () => {
    const data = await loadNewsroomData(process.cwd());
    const issues = validateNewsroomData(data);
    const errors = issues.filter((issue) => issue.severity === "error");

    expect(errors).toHaveLength(0);
  });

  it("compiles published newsroom records into a deterministic site payload", async () => {
    const data = await loadNewsroomData(process.cwd());
    const payload = compileNewsroomSitePayload(data, "2026-04-06T12:00:00.000Z");

    expect(payload.articles.map((article) => article.slug)).toContain("rest-defense-is-learning-to-breathe");
    expect(payload.dispatchIssues[0]?.slug).toBe("week-in-blaugrana-13");
    expect(payload.frontPagePlan.heroArticleSlug).toBe("rest-defense-is-learning-to-breathe");
    expect(payload.frontPagePlan.featuredDispatchSlug).toBe("week-in-blaugrana-13");
    expect(payload.frontPagePlan.isValid).toBe(true);
  });

  it("blocks unsafe transitions until approval coverage exists", async () => {
    const data = await loadNewsroomData(process.cwd());
    const record = data.articles.find((article) => article.slug === "montjuic-needs-a-louder-start");

    expect(record).toBeDefined();

    expect(() =>
      assertTransitionAllowed({
        record: record!,
        kind: "article",
        targetStatus: "approved",
        approvals: data.approvals,
        workflow: data.workflow,
      }),
    ).toThrow(/changes requested|missing approvals/i);
  });

  it("summarizes dashboard, review, queue, and health state from newsroom files", async () => {
    const data = await loadNewsroomData(process.cwd());
    const dashboard = buildDashboardSummary(data, "2026-04-06T12:00:00.000Z");
    const reviewSummary = buildReviewSummary(data, "2026-04-06T12:00:00.000Z");
    const queue = buildPublishQueue(data, "2026-04-06T12:00:00.000Z");
    const health = buildHealthcheckSummary(data, validateNewsroomData(data), "2026-04-06T12:00:00.000Z");

    expect(dashboard.counts.signals).toBeGreaterThan(0);
    expect(dashboard.counts.drafts).toBeGreaterThan(0);
    expect(reviewSummary.pendingApprovals.map((item) => item.slug)).toContain("montjuic-needs-a-louder-start");
    expect(queue.some((entry) => entry.slug === "week-in-blaugrana-13")).toBe(true);
    expect(health.healthy).toBe(true);
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
