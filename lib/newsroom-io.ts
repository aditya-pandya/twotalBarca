import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildDashboardSummary, compileNewsroomSitePayload, validateNewsroomData } from "./newsroom.ts";
import type {
  ApprovalRecord,
  ArticleRecord,
  AssignmentRecord,
  DispatchRecord,
  EditorialCalendarState,
  FrontPagePlan,
  NewsroomData,
  NewsroomGeneratedSitePayload,
  ValidationIssue,
  WorkflowConfig,
} from "./newsroom-types.ts";

export const NEWSROOM_ROOT = "newsroom";

type RelativeNewsroomPath =
  | "config/workflow.json"
  | "state/frontpage.json"
  | "state/editorial-calendar.json"
  | "generated/site-content.json";

function newsroomPath(rootDir: string, relativePath: string) {
  return path.join(rootDir, NEWSROOM_ROOT, relativePath);
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const contents = await readFile(filePath, "utf8");
  return JSON.parse(contents) as T;
}

async function readJsonDirectory<T>(directoryPath: string): Promise<T[]> {
  const entries = (await readdir(directoryPath)).filter((entry) => entry.endsWith(".json")).sort();
  return Promise.all(entries.map((entry) => readJsonFile<T>(path.join(directoryPath, entry))));
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => stableValue(entry));
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return Object.keys(record)
      .sort()
      .reduce<Record<string, unknown>>((accumulator, key) => {
        accumulator[key] = stableValue(record[key]);
        return accumulator;
      }, {});
  }

  return value;
}

export function stringifyStableJson(value: unknown) {
  return `${JSON.stringify(stableValue(value), null, 2)}\n`;
}

export async function loadNewsroomData(rootDir = process.cwd()): Promise<NewsroomData> {
  const workflow = await readJsonFile<WorkflowConfig>(newsroomPath(rootDir, "config/workflow.json"));
  const frontPage = await readJsonFile<FrontPagePlan>(newsroomPath(rootDir, "state/frontpage.json"));
  const editorialCalendar = await readJsonFile<EditorialCalendarState>(newsroomPath(rootDir, "state/editorial-calendar.json"));
  const articles = await readJsonDirectory<ArticleRecord>(newsroomPath(rootDir, "content/articles"));
  const dispatch = await readJsonDirectory<DispatchRecord>(newsroomPath(rootDir, "content/dispatch"));
  const assignments = await readJsonDirectory<AssignmentRecord>(newsroomPath(rootDir, "assignments"));
  const approvals = await readJsonDirectory<ApprovalRecord>(newsroomPath(rootDir, "approvals"));

  return {
    workflow,
    articles,
    dispatch,
    assignments,
    approvals,
    frontPage,
    editorialCalendar,
  };
}

export async function writeNewsroomJson(rootDir: string, relativePath: RelativeNewsroomPath, value: unknown) {
  const filePath = newsroomPath(rootDir, relativePath);
  await writeFile(filePath, stringifyStableJson(value), "utf8");
  return filePath;
}

export async function writeRecordJson(rootDir: string, relativeDirectory: string, filename: string, value: unknown) {
  const filePath = newsroomPath(rootDir, path.join(relativeDirectory, filename));
  await writeFile(filePath, stringifyStableJson(value), "utf8");
  return filePath;
}

export async function validateLoadedNewsroom(rootDir = process.cwd()): Promise<{ data: NewsroomData; issues: ValidationIssue[] }> {
  const data = await loadNewsroomData(rootDir);
  const issues = validateNewsroomData(data);
  return { data, issues };
}

export async function buildGeneratedSitePayload(rootDir = process.cwd()): Promise<{
  data: NewsroomData;
  issues: ValidationIssue[];
  payload: NewsroomGeneratedSitePayload;
  outputPath: string;
}> {
  const data = await loadNewsroomData(rootDir);
  const issues = validateNewsroomData(data);
  const payload = compileNewsroomSitePayload(data);
  const outputPath = await writeNewsroomJson(rootDir, "generated/site-content.json", payload);

  return {
    data,
    issues,
    payload,
    outputPath,
  };
}

export async function loadGeneratedSitePayload(rootDir = process.cwd()) {
  return readJsonFile<NewsroomGeneratedSitePayload>(newsroomPath(rootDir, "generated/site-content.json"));
}

export async function buildDashboard(rootDir = process.cwd()) {
  const data = await loadNewsroomData(rootDir);
  return buildDashboardSummary(data);
}
