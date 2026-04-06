#!/usr/bin/env bash
set -euo pipefail

paperclip_resolve_api_base() {
  local data_dir="$1"
  local log_file="$data_dir/logs/server.log"
  local config_file="$data_dir/instances/default/config.json"

  if [[ -n "${PAPERCLIP_API_BASE:-}" ]]; then
    printf '%s\n' "$PAPERCLIP_API_BASE"
    return 0
  fi

  if [[ -f "$log_file" ]]; then
    local api_line
    api_line="$(python3 - <<'PY' "$log_file"
import re, sys
from pathlib import Path
text = Path(sys.argv[1]).read_text(errors='ignore')
text = re.sub(r'\x1b\[[0-9;]*m', '', text)
matches = re.findall(r'http://127\.0\.0\.1:(\d+)/api', text)
if matches:
    print(f'http://127.0.0.1:{matches[-1]}')
PY
)"
    if [[ -n "$api_line" ]]; then
      printf '%s\n' "$api_line"
      return 0
    fi
  fi

  if [[ -f "$config_file" ]]; then
    local port
    port="$(python3 - <<'PY' "$config_file"
import json, sys
from pathlib import Path
path = Path(sys.argv[1])
try:
    data = json.loads(path.read_text())
    print(data.get('server', {}).get('port', 3100))
except Exception:
    print(3100)
PY
)"
    printf 'http://127.0.0.1:%s\n' "$port"
    return 0
  fi

  printf 'http://127.0.0.1:3100\n'
}
