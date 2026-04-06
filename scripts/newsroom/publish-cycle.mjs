import { buildPublishQueue, getRecordCollection } from "../../lib/newsroom.ts";
import { buildGeneratedSitePayload, loadNewsroomData, runWithLoggedMutation, writePublishQueue, writeRecordJson, writeReviewSummary } from "../../lib/newsroom-io.ts";

const rootDir = process.cwd();

const result = await runWithLoggedMutation(
  rootDir,
  "publish-cycle",
  async () => {
    const data = await loadNewsroomData(rootDir);
    const now = new Date().toISOString();
    const queue = buildPublishQueue(data, now);
    let published = 0;

    for (const entry of queue) {
      if (entry.status !== "scheduled" || Date.parse(entry.publishAt) > Date.parse(now)) {
        continue;
      }

      const collection = getRecordCollection(data, entry.recordKind);
      const record = collection.find((item) => item.id === entry.recordId);

      if (!record) {
        continue;
      }

      await writeRecordJson(rootDir, entry.recordKind === "article" ? "content/articles" : "content/dispatch", `${record.slug}.json`, {
        ...record,
        status: "published",
        publishedAt: now,
        updatedAt: now,
      });
      published += 1;
    }

    await writePublishQueue(rootDir, now);
    await writeReviewSummary(rootDir, now);
    await buildGeneratedSitePayload(rootDir, now);

    const refreshedData = await loadNewsroomData(rootDir);
    const refreshedQueue = buildPublishQueue(refreshedData, now);

    return { published, queueEntries: refreshedQueue.length };
  },
  (mutation) => mutation,
);

console.log(`Publish cycle complete. Published ${result.published} record(s).`);
