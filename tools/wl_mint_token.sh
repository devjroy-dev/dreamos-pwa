#!/usr/bin/env bash
# tools/wl_mint_token.sh — THE RENDER ARM'S FIXTURE, MADE REAL.
#
#   source tools/wl_mint_token.sh          # then: node tools/wl_render.cjs <base-url>
#
# ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
# The render arm ran on a SYNTHETIC session for its whole life: a seeded token
# that was not a real one, so every authenticated fetch failed closed. That was
# stated honestly at the top of every run — and it meant the arm could only ever
# speak about chrome. Worse, it made the product LOG THE FIXTURE OUT (F-38.8:
# /me answers 401, lib/vendor/api/_base.ts:103-124 refreshes once, fails, and
# calls clearAndRedirect), and the arm spent four cures building machinery to
# survive a logout that a real token simply does not cause.
#
# A fixture that cannot survive the product's own behaviour is a fixture that
# measures nothing after its first action. This mints a real one.
#
# ── FAIL-CLOSED, AND WHAT THAT MEANS HERE ───────────────────────────────────
# It refuses every phone but the standing test vendor, 9888294440 (founder's
# ruling, 2026-07-29). It is not a general-purpose login helper and must never
# become one: an arm that can authenticate as anybody is an arm that can take
# screenshots of somebody's leads.
#
# THE TOKEN NEVER TOUCHES DISK AND NEVER TOUCHES A COMMAND LINE.
#   · not argv — a token in argv is in `ps`, in the shell history of whoever
#     retyped it, and in every CI log that echoes its own command
#   · not a file in the tree — a dotfile with a bearer token in it survives the
#     sitting, gets `git add -A`'d by someone in a hurry, and is why the estate
#     forbids `git add -A` in the first place
#   · the PIN is read with `read -rs`, so it is never echoed and never in argv
# It is exported into THE CALLER'S ENVIRONMENT and nowhere else, which is why
# this script must be SOURCED. Executed, its export would die with the subshell
# and the arm would run synthetic while the founder believed it had not — a
# silent downgrade, which is the one failure this file exists to prevent.
set -u

# ── SOURCED-ONLY, ASSERTED RATHER THAN DOCUMENTED ───────────────────────────
# `${BASH_SOURCE[0]}` is this file's path always; `$0` is this file's path only
# when it was EXECUTED. They differ exactly when the script was sourced.
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  echo "wl_mint_token: REFUSED — this script must be SOURCED, not executed." >&2
  echo "  an executed export dies with the subshell and the arm would run" >&2
  echo "  SYNTHETIC while you believed it had a real token." >&2
  echo "  run:  source tools/wl_mint_token.sh" >&2
  exit 2
fi

# The standing test vendor. One home for the number; the refusal below reads it.
WL_MINT_PHONE='+919888294440'
WL_MINT_BASE="${WL_RENDER_API_BASE:-https://dream-os-production.up.railway.app}"

# ── THE REFUSAL, BEFORE ANYTHING IS TYPED ───────────────────────────────────
# An optional argument exists ONLY so that passing the wrong number is a refusal
# rather than a silent success against a phone nobody looked at. There is no
# argument that widens this script.
if [ "$#" -gt 0 ] && [ "$1" != "$WL_MINT_PHONE" ] && [ "$1" != "9888294440" ]; then
  echo "wl_mint_token: REFUSED — this fixture mints for 9888294440 only." >&2
  echo "  asked for: $1" >&2
  unset WL_MINT_PHONE WL_MINT_BASE
  return 2
fi

printf 'wl_mint_token · %s · %s\n' "$WL_MINT_PHONE" "$WL_MINT_BASE"
printf 'PIN (not echoed): '
# -r so a backslash is a character and not an escape; -s so it never reaches the
# terminal, the scrollback, or a shoulder.
read -rs WL_MINT_PIN
printf '\n'

if ! printf '%s' "$WL_MINT_PIN" | grep -Eq '^[0-9]{4}$'; then
  # Matched against the server's own PIN_RE (dream-os src/api/vendor/auth.js:36)
  # so a typo is refused here rather than spending an attempt against the
  # five-try lockout on the founder's own test account.
  echo "wl_mint_token: REFUSED — the PIN is four digits (dream-os auth.js PIN_RE)." >&2
  unset WL_MINT_PIN WL_MINT_PHONE WL_MINT_BASE
  return 2
fi

# The body is built on stdin, never in argv. `--data @-` is the whole reason.
WL_MINT_BODY=$(printf '{"phone":"%s","pin":"%s"}' "$WL_MINT_PHONE" "$WL_MINT_PIN")
WL_MINT_RES=$(printf '%s' "$WL_MINT_BODY" \
  | curl -s -X POST "$WL_MINT_BASE/api/v2/vendor/auth/pin-login" \
         -H 'Content-Type: application/json' --data @- )
unset WL_MINT_PIN WL_MINT_BODY

# node, not sed: the response is JSON and a regex over JSON is a second parser
# that disagrees with the first one on the day it matters.
WL_MINT_TOKEN=$(printf '%s' "$WL_MINT_RES" | node -e '
  let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
    try { const j = JSON.parse(s); if (j && j.ok && j.access_token) process.stdout.write(j.access_token); }
    catch { /* prints nothing; the caller treats empty as a refusal */ }
  });')

if [ -z "$WL_MINT_TOKEN" ]; then
  echo "wl_mint_token: REFUSED — no access_token." >&2
  # The server's own error is shown because the useful ones are specific:
  # pin_invalid carries attempts_remaining, pin_locked carries locked_until.
  printf '  server said: %s\n' "$WL_MINT_RES" >&2
  unset WL_MINT_RES WL_MINT_TOKEN WL_MINT_PHONE WL_MINT_BASE
  return 1
fi

export WL_RENDER_TOKEN="$WL_MINT_TOKEN"
unset WL_MINT_RES WL_MINT_TOKEN WL_MINT_PHONE WL_MINT_BASE
echo "wl_mint_token: WL_RENDER_TOKEN exported into this shell. It is not on disk."
echo "  next: node tools/wl_render.cjs <base-url>   (expect: fixture: REAL)"
echo "  to drop it:  unset WL_RENDER_TOKEN"
