import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { GET, POST } from "@/app/api/newsroom/scout-feedback/route";
import { appendScoutFeedbackEntry, loadScoutFeedbackState } from "@/lib/newsroom-io";

describe("scout feedback storage", () => {
  let tempDir: string;
  const originalRoot = process.env.TWOTALBARCA_NEWSROOM_ROOT;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "twotal-scout-feedback-"));
    process.env.TWOTALBARCA_NEWSROOM_ROOT = tempDir;
  });

  afterEach(async () => {
    if (originalRoot === undefined) {
      delete process.env.TWOTALBARCA_NEWSROOM_ROOT;
    } else {
      process.env.TWOTALBARCA_NEWSROOM_ROOT = originalRoot;
    }
    await rm(tempDir, { recursive: true, force: true });
  });

  it("stores and reloads operator feedback entries in newsroom/state", async () => {
    const entry = await appendScoutFeedbackEntry(tempDir, {
      targetType: "candidate",
      targetId: "espanyol-between-the-legs",
      targetLabel: "Espanyol between the legs is the real selection test",
      verdict: "promising",
      note: "Keep the derby framing, but prioritize concrete lineup consequences.",
    }, "2026-04-09T20:10:00.000Z");

    const state = await loadScoutFeedbackState(tempDir);
    const filePath = path.join(tempDir, "newsroom/state/scout-feedback.json");
    const rawState = JSON.parse(await readFile(filePath, "utf8"));

    expect(entry.createdAt).toBe("2026-04-09T20:10:00.000Z");
    expect(state.entries).toHaveLength(1);
    expect(state.entries[0]).toMatchObject({
      targetType: "candidate",
      targetId: "espanyol-between-the-legs",
      targetLabel: "Espanyol between the legs is the real selection test",
      verdict: "promising",
      note: "Keep the derby framing, but prioritize concrete lineup consequences.",
    });
    expect(rawState.entries[0].verdict).toBe("promising");
  });

  it("accepts valid feedback writes through the local route handler", async () => {
    const response = await POST(
      new Request("http://localhost/api/newsroom/scout-feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          targetType: "source-lane",
          targetId: "x:trusted-football-media",
          targetLabel: "Trusted football media X",
          verdict: "imagery-needed",
          note: "Good reporting lane, but keep capturing social preview images for review.",
        }),
      }),
    );

    const payload = await response.json();
    const listing = await GET();
    const listingPayload = await listing.json();

    expect(response.status).toBe(201);
    expect(payload.entry).toMatchObject({
      targetType: "source-lane",
      verdict: "imagery-needed",
      targetLabel: "Trusted football media X",
    });
    expect(listingPayload.entries[0]).toMatchObject({
      targetType: "source-lane",
      verdict: "imagery-needed",
      targetLabel: "Trusted football media X",
    });
  });
});
