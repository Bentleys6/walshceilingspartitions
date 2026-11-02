#!/usr/bin/env bash
# Claude Code hook (PreToolUse on Bash): before any `git push`, run the full site check.
# If it fails, the push is blocked and Claude is told why (exit code 2).
input="$(cat)"
cmd="$(printf '%s' "$input" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).tool_input?.command??"")}catch{}})')"
case "$cmd" in
  *"git push"*) ;;
  *) exit 0 ;;
esac
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
if [ ! -d node_modules ]; then
  bun install --frozen-lockfile >/dev/null 2>&1 || npm install --legacy-peer-deps --no-audit --no-fund --no-package-lock >/dev/null 2>&1
fi
if ! out="$(npm run check 2>&1)"; then
  echo "Push blocked: 'npm run check' failed (lint, type check, tests, build or security scan). Fix it, then push again." >&2
  printf '%s\n' "$out" | tail -40 >&2
  exit 2
fi
exit 0
