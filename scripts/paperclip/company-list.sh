#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DATA_DIR="$ROOT/.paperclip-runtime"
PAPERCLIP="$ROOT/scripts/paperclip/paperclip-cli.sh"
source "$ROOT/scripts/paperclip/api-base.sh"

export PAPERCLIP_TELEMETRY_DISABLED=1
export DO_NOT_TRACK=1

API_BASE="$(paperclip_resolve_api_base "$DATA_DIR")"
"$PAPERCLIP" company list --data-dir "$DATA_DIR" --api-base "$API_BASE"
