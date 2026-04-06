#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DATA_DIR="$ROOT/.paperclip-runtime"
LOG_DIR="$DATA_DIR/logs"
PID_FILE="$DATA_DIR/paperclip.pid"
LOG_FILE="$LOG_DIR/server.log"
PAPERCLIP="$ROOT/scripts/paperclip/paperclip-cli.sh"
source "$ROOT/scripts/paperclip/api-base.sh"

mkdir -p "$LOG_DIR"

export PAPERCLIP_TELEMETRY_DISABLED=1
export DO_NOT_TRACK=1

if [[ ! -f "$DATA_DIR/instances/default/config.json" ]]; then
  echo "Initializing Paperclip config..."
  "$PAPERCLIP" onboard --yes --data-dir "$DATA_DIR"
fi

if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "Paperclip already appears to be running with pid $(cat "$PID_FILE")"
else
  echo "Starting Paperclip in the background..."
  nohup "$PAPERCLIP" run --data-dir "$DATA_DIR" >"$LOG_FILE" 2>&1 &
  echo $! >"$PID_FILE"
fi

echo "Waiting for Paperclip to accept company commands..."
for _ in {1..30}; do
  API_BASE="$(paperclip_resolve_api_base "$DATA_DIR")"
  if "$PAPERCLIP" company list --data-dir "$DATA_DIR" --api-base "$API_BASE" >/dev/null 2>&1; then
    break
  fi
  if ! kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "Paperclip exited during startup. Recent server log:" >&2
    tail -n 80 "$LOG_FILE" >&2 || true
    exit 1
  fi
  if grep -q "Paperclip server failed to start" "$LOG_FILE" 2>/dev/null; then
    echo "Paperclip failed during startup. Recent server log:" >&2
    tail -n 80 "$LOG_FILE" >&2 || true
    exit 1
  fi
  sleep 2
done

API_BASE="$(paperclip_resolve_api_base "$DATA_DIR")"
if ! "$PAPERCLIP" company list --data-dir "$DATA_DIR" --api-base "$API_BASE" >/dev/null 2>&1; then
  echo "Paperclip did not become ready in time. Recent server log:" >&2
  tail -n 80 "$LOG_FILE" >&2 || true
  exit 1
fi

"$PAPERCLIP" company import "$ROOT/paperclip/twotalbarca" \
  --target new \
  --yes \
  --data-dir "$DATA_DIR" \
  --api-base "$API_BASE"

"$PAPERCLIP" company list --data-dir "$DATA_DIR" --api-base "$API_BASE"
