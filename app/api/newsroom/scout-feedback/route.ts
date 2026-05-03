import { appendScoutFeedbackEntry, loadScoutFeedbackState, resolveLocalNewsroomRootDir } from "@/lib/newsroom-io";

export const runtime = "nodejs";

function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function GET() {
  const rootDir = resolveLocalNewsroomRootDir();
  const state = await loadScoutFeedbackState(rootDir);
  return Response.json(state, {
    headers: {
      "cache-control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  if (!payload || typeof payload !== "object") {
    return errorResponse("Feedback payload must be an object");
  }

  try {
    const rootDir = resolveLocalNewsroomRootDir();
    const entry = await appendScoutFeedbackEntry(rootDir, payload as Parameters<typeof appendScoutFeedbackEntry>[1]);
    return Response.json({ entry }, { status: 201 });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to store scout feedback");
  }
}
