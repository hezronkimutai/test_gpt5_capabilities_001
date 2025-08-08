#!/usr/bin/env bash
set -euo pipefail

MEMO_FILE="$(cd "$(dirname "$0")"/.. && pwd)/docs/memory-bank.md"

cmd=${1:-}
shift || true

timestamp() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

append_entry() {
  local note="$1"
  local author="${GIT_AUTHOR_NAME:-${USERNAME:-${USER:-unknown}}}"
  { 
    echo ""
    echo "### $(timestamp) — ${author}"
    echo ""
    echo "- ${note}"
  } >>"$MEMO_FILE"
  echo "Added memory entry."
}

case "$cmd" in
  add)
    note=${1:-}
    if [ -z "$note" ]; then
      echo "Usage: $0 add \"your note\"" >&2
      exit 1
    fi
    append_entry "$note"
    ;;
  list)
    count=${1:-20}
    echo "Showing last ${count} memory lines from ${MEMO_FILE}:" >&2
    tail -n "$count" "$MEMO_FILE" || true
    ;;
  *)
    cat >&2 <<'USAGE'
Usage:
  memory.sh add "your note here"
  memory.sh list [lines]
USAGE
    exit 1
    ;;
esac
