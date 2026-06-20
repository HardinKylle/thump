#!/usr/bin/env bash
# ask.sh — drive one real Codex turn, visibly, in the current pane.
# Usage: ask.sh <prompt-file>
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROMPT_FILE="$1"
LOG="$ROOT/logs/conversation.log"
SESSION_FLAG="$ROOT/.turn_started"

bar() { printf '\n\033[1;36m%s\033[0m\n' "────────────────────────────────────────────────────────"; }

bar
printf '\033[1;33m▶ ORCHESTRATOR (Claude) → CODEX\033[0m\n'
cat "$PROMPT_FILE"
bar
printf '\033[1;32m◀ CODEX (gpt-5.5) is working...\033[0m\n\n'

{
  echo "### ORCHESTRATOR → CODEX  ($(date -u +%H:%M:%S))"
  cat "$PROMPT_FILE"; echo; echo "### CODEX:"
} >> "$LOG"

PROMPT="$(cat "$PROMPT_FILE")"
if [[ -f "$SESSION_FLAG" ]]; then
  codex exec resume --last \
    --dangerously-bypass-approvals-and-sandbox --skip-git-repo-check \
    "$PROMPT" 2>&1 | tee -a "$LOG"
else
  touch "$SESSION_FLAG"
  codex exec \
    --dangerously-bypass-approvals-and-sandbox --skip-git-repo-check \
    -C "$ROOT" "$PROMPT" 2>&1 | tee -a "$LOG"
fi

echo >> "$LOG"
bar
printf '\033[1;35m<<<TURN_DONE>>>\033[0m\n'
