#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DATA_DIR="$ROOT/.paperclip-runtime"
PAPERCLIP="$ROOT/scripts/paperclip/paperclip-cli.sh"

mkdir -p "$DATA_DIR"

export PAPERCLIP_TELEMETRY_DISABLED=1
export DO_NOT_TRACK=1

if [[ ! -f "$DATA_DIR/instances/default/config.json" ]]; then
  echo "Initializing Paperclip config in: $DATA_DIR"
  "$PAPERCLIP" onboard --yes --data-dir "$DATA_DIR"
fi

echo "Starting Paperclip with data dir: $DATA_DIR"
exec "$PAPERCLIP" run --data-dir "$DATA_DIR"
