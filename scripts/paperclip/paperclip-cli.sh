#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TOOL_DIR="$ROOT/.paperclip-runtime/tooling"
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
PACKAGE_JSON="$TOOL_DIR/package.json"

if [[ "$NODE_MAJOR" -ge 25 ]]; then
  mkdir -p "$TOOL_DIR"

  cat > "$PACKAGE_JSON" <<'JSON'
{
  "name": "twotalbarca-paperclip-tooling",
  "private": true,
  "overrides": {
    "cssstyle": "4.6.0",
    "@asamuzakjp/css-color": "4.1.2"
  }
}
JSON

  if [[ ! -x "$TOOL_DIR/node_modules/node/bin/node" || ! -f "$TOOL_DIR/node_modules/paperclipai/dist/index.js" ]]; then
    echo "Installing repo-local Node 20 + Paperclip shim into $TOOL_DIR" >&2
    (
      cd "$TOOL_DIR"
      npm install --no-save node@20 paperclipai >/dev/null
    )
  fi

  exec "$TOOL_DIR/node_modules/node/bin/node" "$TOOL_DIR/node_modules/paperclipai/dist/index.js" "$@"
fi

exec npx --yes paperclipai "$@"
