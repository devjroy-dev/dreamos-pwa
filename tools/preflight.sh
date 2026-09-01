#!/usr/bin/env bash
# tools/preflight.sh — R-38.20b. THE §0 THAT CANNOT BE WRITTEN AS PROSE.
#
#   bash tools/preflight.sh
#
# ── WHY  ────────────────────────────────────────────────────────────────────
# Three sittings in a row opened with the words "sibling clone present" and none of them
# said WHICH TREE. Today the founder's pwa workspace was found holding a sibling 154 commits
# behind, which means every floor number this arc was derived against a dream-os from
# another month and nobody could tell, because "present" is a fact about a directory and the
# benches read a fact about a commit. F-38.34. `present` as prose is banned; this prints the
# tip.
#
# ── WHAT LIES, AND WHY IT LIES QUIETLY  ─────────────────────────────────────
# Two preconditions have each faked a finding in this arc, in opposite directions, and both
# wore the costume of a defect while being one command away from nothing:
#
#   · NO node_modules → the pwa floor reads EIGHT TOO MANY REDs. `scripts/run-bands-proof.sh`
#     shells straight to `node_modules/.bin/tsc`, so seven `run-*-proof` benches and `waDial`
#     refuse for want of a binary. Witnessed at S2 §0.
#   · A MISSING OR STALE SIBLING → three benches refuse or read the wrong tree:
#     `tdw09_p2b_vocab`, `tdw13_d6_parity_matrix`, `tdw15_p1_events`. Witnessed at S1 §7
#     (missing) and again in a worktree at S2/2 §1 (25 REDs where the named base was 22).
#
# The three names are RECORDED from those two witnessings, not re-derived on every run —
# said plainly rather than implied, because a list a reader assumes was derived is worse
# than one that admits it was remembered.
#
# NO STRICT MODE (R-38.21 (2), F-38.35). This file sets no shell options. It is executed
# rather than sourced and it still declines to set any, for the reason base_guard.sh gives.

say() { echo "$1"; }
line() { echo "------------------------------------------------------------"; }

# The two repos are siblings on disk. Derived from this file's own location rather than from
# a hard-coded /workspaces path, so it works in a codespace, a clone, or a container.
HERE=$(cd "$(dirname "$0")/.." && pwd)
PARENT=$(dirname "$HERE")

# ⚠ A DETACHED HEAD MUST NOT BE COMPARED AGAINST THE DEFAULT BRANCH, and the first cut of
# this file did exactly that. `git rev-parse --abbrev-ref HEAD` returns the literal string
# `HEAD` when the checkout is detached, so `origin/$BR` became `origin/HEAD` — origin's
# DEFAULT branch — and the report showed an upstream and a behind-count belonging to a
# branch the tree was not on. It then printed CLEAR over a sixteen-file dirty tree.
#
# THIS FILE EXISTS BECAUSE "sibling present" was a comfortable sentence that was not a fact,
# and its first cut produced a comfortable NUMBER that was not a fact. Same disease, new
# coat, one command away from being caught — which is why it was.
report() {
  NAME="$1"; DIR="$2"; WANT_BR="$3"
  if [ ! -d "$DIR/.git" ]; then
    say "$NAME: NOT PRESENT at $DIR"
    return
  fi
  PKG=$(grep -m1 '"name"' "$DIR/package.json" 2>/dev/null | tr -d ' ",' | sed 's/name://')
  ORIGIN=$(git -C "$DIR" remote get-url origin 2>/dev/null)
  git -C "$DIR" fetch -q origin 2>/dev/null
  BR=$(git -C "$DIR" rev-parse --abbrev-ref HEAD 2>/dev/null)
  DETACHED="no"
  if [ "$BR" = "HEAD" ]; then DETACHED="YES"; BR="$WANT_BR"; fi
  HD=$(git -C "$DIR" rev-parse --short HEAD 2>/dev/null)
  UP=$(git -C "$DIR" rev-parse --short "origin/$BR" 2>/dev/null)
  BEHIND=$(git -C "$DIR" rev-list --count "HEAD..origin/$BR" 2>/dev/null)
  DIRT=$(git -C "$DIR" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  say "$NAME"
  say "  path      $DIR"
  say "  package   $PKG"
  say "  origin    $ORIGIN"
  say "  branch    $BR"
  if [ "$DETACHED" = "YES" ]; then
    say "  ⚠ DETACHED HEAD — the branch above is the EXPECTED one, not one this tree is on."
  fi
  say "  HEAD      $HD"
  say "  upstream  origin/$BR = $UP"
  say "  behind    ${BEHIND:-?}"
  say "  dirty     $DIRT file(s)"
  if [ -d "$DIR/node_modules" ]; then say "  node_modules  present"; else say "  node_modules  ABSENT"; fi
  # Exported for the verdict below. A report that prints a number and a verdict that does
  # not read it is two homes for one fact.
  eval "${NAME_VAR}_BEHIND=\${BEHIND:-0}"
  eval "${NAME_VAR}_DIRT=\$DIRT"
}

line
say "PREFLIGHT · $(date -u '+%Y-%m-%d %H:%M UTC')"
line
# The expected branch per repo. Passed in rather than guessed, because a detached checkout
# cannot tell you which branch it was cut from and a guess there is how the first cut
# reported a behind-count against the wrong branch.
PWA_BRANCH="${1:-worklist}"
NAME_VAR=PWA; report "dreamos-pwa" "$PARENT/dreamos-pwa" "$PWA_BRANCH"
line
NAME_VAR=OS;  report "dream-os" "$PARENT/dream-os" "main"
line

# ── THE VERDICT, AND IT NAMES THE BENCHES RATHER THAN SAYING "some" ─────────
WARN=0
if [ ! -d "$PARENT/dreamos-pwa/node_modules" ]; then
  say "⚠ pwa node_modules ABSENT — the pwa floor will read EIGHT TOO MANY REDs"
  say "  (seven run-*-proof benches and waDial refuse without node_modules/.bin/tsc)."
  say "  Run: npm ci   in $PARENT/dreamos-pwa  BEFORE any floor number is written down."
  WARN=1
fi
if [ ! -d "$PARENT/dream-os/.git" ]; then
  say "⚠ sibling dream-os MISSING — three pwa benches will refuse:"
  say "  tdw09_p2b_vocab · tdw13_d6_parity_matrix · tdw15_p1_events"
  WARN=1
else
  SB=$(git -C "$PARENT/dream-os" rev-list --count HEAD..origin/main 2>/dev/null)
  if [ "${SB:-0}" != "0" ]; then
    say "⚠ sibling dream-os is $SB commit(s) BEHIND origin/main."
    say "  It is a FLOOR PRECONDITION, not scenery: tdw09_p2b_vocab,"
    say "  tdw13_d6_parity_matrix and tdw15_p1_events read it. A floor derived"
    say "  against a stale sibling is a number about a different tree (F-38.34)."
    say "  Run: git -C $PARENT/dream-os reset --hard origin/main"
    WARN=1
  fi
fi
# ── THE WORKING REPO'S OWN STATE IS PART OF THE VERDICT ─────────────────────
# The first cut warned only about node_modules and the sibling, so it printed CLEAR over a
# tree that was one commit behind and sixteen files dirty. A preflight that clears a tree
# nobody could safely apply to is worse than none: it is a signature on a check that was
# never made.
if [ "${PWA_BEHIND:-0}" != "0" ]; then
  say "⚠ dreamos-pwa is ${PWA_BEHIND} commit(s) behind origin/${PWA_BRANCH} — re-derive the base (R-38.16)."
  WARN=1
fi
if [ "${PWA_DIRT:-0}" != "0" ]; then
  say "⚠ dreamos-pwa has ${PWA_DIRT} uncommitted file(s). A whole-file apply over these reverts them (F-38.25)."
  WARN=1
fi
if [ "${OS_DIRT:-0}" != "0" ]; then
  say "⚠ dream-os has ${OS_DIRT} uncommitted file(s)."
  WARN=1
fi
# ── F-39.44 · THE VERDICT WAS PRINTED AND THE EXIT CODE SAID GO ──────────────
# This file ended `exit 0`, unconditionally, under both branches below. So it
# printed "PREFLIGHT NOT CLEAR — resolve the lines above" and then handed the
# caller a zero, and under this estate's own floor-method law — THE EXIT CODE IS
# THE VERDICT, never the printed text, because our benches use at least three
# report formats and only the code is shared by all of them — every wrapper that
# gated on this instrument saw CLEAR forever.
#
# It is the class this file's own sitting was chartered to audit, standing in the
# gate instrument itself: an instrument CORRECT ABOUT ITS OWN SUBJECT (the four
# warnings above are all true and all printed) and WRONG ABOUT WHAT IT IS READ TO
# MEAN, with nothing above it asking the second question. Found at the B-1
# read-first while deriving preflight for that sitting's own first motion; the
# instrument auditing the instruments could not clear itself.
#
# WHY `exit "$WARN"` AND NOT `exit 1`. `WARN` is already the verdict — every site
# above sets it to 1 beside the `say` that explains why. Deriving the exit from it
# means a warning added tomorrow gates by existing, which is the same law
# `run-floor.sh` learnt three times: an enumeration written by hand is believed to
# be complete and is not. There is no second place to keep in step.
#
# BEHAVIOUR ON A CLEAN TREE IS UNCHANGED: WARN=0, exit 0, same words.
# THE TWO COPIES ARE FORKED BY DESIGN AND BEHAVIOURALLY IDENTICAL — this block is
# byte-identical in both repos and both benches assert that.
if [ "$WARN" = "0" ]; then
  say "PREFLIGHT CLEAR — both tips named above. Quote THESE in §0, not the word 'present'."
else
  say "PREFLIGHT NOT CLEAR — resolve the lines above before any number goes in a handover."
fi
line
exit "$WARN"
