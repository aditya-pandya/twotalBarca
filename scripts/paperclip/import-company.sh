#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DATA_DIR="$ROOT/.paperclip-runtime"
PACKAGE_DIR="$ROOT/paperclip/twotalbarca"
PAPERCLIP="$ROOT/scripts/paperclip/paperclip-cli.sh"
source "$ROOT/scripts/paperclip/api-base.sh"

if [[ ! -d "$PACKAGE_DIR" ]]; then
  echo "Missing company package: $PACKAGE_DIR" >&2
  exit 1
fi

export PAPERCLIP_TELEMETRY_DISABLED=1
export DO_NOT_TRACK=1

API_BASE="$(paperclip_resolve_api_base "$DATA_DIR")"
"$PAPERCLIP" company import "$PACKAGE_DIR" \
  --target new \
  --yes \
  --data-dir "$DATA_DIR" \
  --api-base "$API_BASE"
