#!/usr/bin/env bash
# run-tests.sh — the mechanical form of "run it, don't predict it".
#
# Invoked by the opt-in PostToolUse hook after Write/Edit. Runs the project's
# test command and, if it fails, pushes the real output back at Claude so red
# cannot go unnoticed until the next time someone remembers to look.
#
# Deliberately inert unless configured: the test command is project-specific
# and guessing it would be worse than doing nothing.
#
#   export XP_TEST_COMMAND="pytest -q"
#
# Exit codes: 0 = quiet (no command configured, or tests green)
#             2 = blocking error; stderr is fed back to Claude (tests red)

set -uo pipefail

if [[ -z "${XP_TEST_COMMAND:-}" ]]; then
  exit 0
fi

# Hook input arrives as JSON on stdin. Drain it so the writer never blocks.
cat >/dev/null 2>&1 || true

cd "${CLAUDE_PROJECT_DIR:-$PWD}" || exit 0

output=$(eval "$XP_TEST_COMMAND" 2>&1)
status=$?

if [[ $status -eq 0 ]]; then
  exit 0
fi

{
  echo "The test suite is RED after that edit. \`$XP_TEST_COMMAND\` exited $status."
  echo
  echo "--- test output ---"
  echo "$output" | tail -n 60
  echo "--- end test output ---"
  echo
  echo "A red build is the highest-priority work. Stop, read the failure above,"
  echo "and fix it or report it before writing anything else. Do not get to green"
  echo "by skipping, deleting, or weakening a test."
} >&2

exit 2
