#!/usr/bin/env bash
# scripts/run-floor.sh
#
# THE COMPLETE FLOOR — one home, so the enumeration stops being retyped.
#
# WHY THIS FILE EXISTS. Three times in one block a floor claim was smaller than
# the floor:
#
#   1. a four-bench chain from a succession note, presented as "the floor" —
#      it missed the regression D-2 had just shipped
#   2. a summary-line grep that only saw benches printing "N passed, M failed" —
#      half this estate prints "GREEN — name 44/44" instead, and three
#      pre-existing reds stayed invisible because of it
#   3. a `scripts/*.proof.mjs` glob that never ran the eight bare `.mjs`
#      scripts, the vacuity probe among them
#
# Same disease each time: an enumeration written by hand, believed to be
# complete. The cure is not a better glob, it is ONE glob with one home that
# every delivery calls instead of retyping.
#
# EXIT CODE IS THE VERDICT, never the printed text: benches in this estate use at
# least three report formats and only the exit code is shared by all of them.
#
# Usage:  bash scripts/run-floor.sh            # print the red set
#         bash scripts/run-floor.sh --check    # diff against the named base

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

# All three extensions, de-duplicated — *.mjs already contains *.proof.mjs, and
# without `sort -u` every proof bench would run twice and double its runtime.
ALL=$(ls scripts/*.proof.mjs scripts/*.mjs scripts/*.js 2>/dev/null | sort -u)

# ── F-14.24 · THE FOURTH INSTANCE, AND IT WAS IN THIS FILE ───────────────────
# The header above names three hand-written enumerations, each believed complete,
# each wrong. The line that names them was itself the fourth: the glob reaches
# `.proof.mjs`, `.mjs` and `.js` and therefore NEVER RAN THE SEVEN `.proof.ts`
# BENCHES — assignmentWords, bands, cityMatch, crewCommit, postAccess,
# rosterMint, settleWords. They are TypeScript, so plain `node` cannot run them;
# each has its own `run-*-proof.sh` wrapper that compiles and then runs, and the
# floor knew about none of them. Seven benches, invisible to the instrument whose
# whole purpose is that nothing is invisible to it.
#
# THE CURE IS THE SAME SHAPE AS THE HEADER'S OWN PRESCRIPTION: not a better list,
# but a DERIVATION. The wrappers are found by glob and each is verified to name a
# real `.proof.ts`, so a wrapper added tomorrow joins the floor by existing and a
# wrapper whose subject is deleted announces itself instead of passing silently.
#
# They run through `bash`, not `node`, and the loop below dispatches on extension
# for exactly that reason. Exit code remains the verdict, which is what makes two
# runners one floor.
WRAPPERS=""
for w in scripts/run-*-proof.sh; do
  [ -f "$w" ] || continue
  WRAPPERS="${WRAPPERS} ${w}"
done

# The derivation's own guard: every wrapper must name a `.proof.ts` that exists.
# A wrapper pointing at nothing would run, pass trivially, and report a bench
# that is not there — the hollow green this whole file exists to refuse.
ORPHANED=""
for w in $WRAPPERS; do
  subj=$(grep -o 'scripts/[A-Za-z0-9_]*\.proof\.ts' "$w" 2>/dev/null | head -1)
  if [ -z "$subj" ] || [ ! -f "$subj" ]; then
    ORPHANED="${ORPHANED} $(basename "$w")"
  fi
done
if [ -n "$ORPHANED" ]; then
  echo "STOP — wrapper(s) naming no live .proof.ts:${ORPHANED}"
  echo "A wrapper that runs nothing reports a bench that is not there."
  exit 1
fi

# And the counterpart: every `.proof.ts` must be reachable through a wrapper, or
# it is a bench nobody runs — F-14.24's disease stated from the other side.
UNREACHED=""
for t in scripts/*.proof.ts; do
  [ -f "$t" ] || continue
  grep -lq "$(basename "$t")" $WRAPPERS 2>/dev/null || \
    grep -l "$(basename "$t")" $WRAPPERS >/dev/null 2>&1 || UNREACHED="${UNREACHED} $(basename "$t")"
done
if [ -n "$UNREACHED" ]; then
  echo "STOP — .proof.ts with no wrapper, unreachable by the floor:${UNREACHED}"
  exit 1
fi

# ── ORDER IS LOAD-BEARING, and it cost a bounce to learn ─────────────────────
# Some benches REQUIRE a clean tree: they write to production source, run other
# benches against it, and restore — on a dirty tree they cannot prove the restore
# was clean, so they STOP rather than lie. tdw_f0774_vacuity_probe is one.
#
# Some other benches WRITE OUTPUT INTO THE TREE. tdw09_vendor_census.mjs and
# tdw09_p1_canon.proof.mjs both rewrite scripts/tdw09_vendor_census.json, and
# "tdw09" sorts before "tdw_", so in plain alphabetical order the census dirties
# the tree and the probe then refuses to run. That is not a probe failure — it is
# the probe being right about a tree it was handed.
#
# I chased this as a phantom: it reported RED once in my container, then went
# green on every retry, and I wrote it into the named base on that single
# observation before removing it again as unreproducible. Both were wrong. The
# retries only "passed" because I had committed the regenerated JSON, so the
# census rewrote identical bytes and dirtied nothing. On a clean checkout from
# origin — the founder's terminal — it reproduces every time.
#
# So: clean-tree-required benches run FIRST, and they are found by DERIVATION
# (grep for the guard) rather than by a hand-kept list, because a hand-kept list
# is how the next such bench gets missed.
NEEDS_CLEAN=$(grep -l 'git status --porcelain' $ALL 2>/dev/null | sort -u)
REST=$(comm -23 <(echo "$ALL" | tr ' ' '\n' | sort -u) <(echo "$NEEDS_CLEAN" | sort -u))

RED=""
for b in $NEEDS_CLEAN $REST $WRAPPERS; do
  [ -f "$b" ] || continue
  n=$(basename "$b" | sed 's/\.proof\.mjs$//; s/\.mjs$//; s/\.js$//; s/\.sh$//')
  # DISPATCH ON EXTENSION. The `.proof.ts` benches cannot be run by node — they
  # compile first — so their wrappers run through bash. Two invocations, one
  # verdict rule: the exit code, exactly as the header states.
  case "$b" in
    *.sh) bash "$b" >/dev/null 2>&1 || RED="${RED}RED: ${n}\n" ;;
    *)    node "$b" >/dev/null 2>&1 || RED="${RED}RED: ${n}\n" ;;
  esac
done

# ── THE FLOOR MUST NOT LEAVE FOOTPRINTS ──────────────────────────────────────
# Reported, never silently cleaned: a bench writing into the tree is a real
# defect and hiding it here would bury the thing that caused the bounce above.
DIRT=$(git status --porcelain 2>/dev/null)
if [ -n "$DIRT" ]; then
  echo "NOTE — the floor itself dirtied the tree. A bench is writing output into"
  echo "the repo; this is filed, not cured here (out of D-7's radius):"
  echo "$DIRT" | sed 's/^/  /'
fi
printf "%b" "$RED" | sort > /tmp/floor.txt
cat /tmp/floor.txt

if [ "${1:-}" = "--check" ]; then
  # THE NAMED BASE — pre-existing reds at dreamos-pwa 2916661, each verified on a
  # clean clone at that tip and untouched by block 13. A red that is not on this
  # list is this delivery's; a base red that VANISHES is also a delta and fails
  # the diff, because a bench that stops failing without a cure is a bench that
  # stopped looking.
  # NOTE, kept because a removed line teaches nothing: tdw_f0774_vacuity_probe
  # was briefly listed here. It appeared RED in the first run of this script and
  # I wrote it into the base on that single observation — the exact error this
  # file exists to end. It is GREEN standalone, GREEN in floor order, and GREEN
  # in every run since; the one red has not reproduced and has no derived cause.
  # It is NOT base. If it ever reds again, that is a finding, not a baseline.
  # ── BASE AMENDED, LABELLED — TDW_15 · P1 (CE-34, 2026-08-15) ───────────────
  # ONE LINE JOINS, AND IT IS NOT THIS DELIVERY'S RED. `run-assign-words-proof`
  # fails its "declined is terracotta" cell at the UNTOUCHED tip 6107ff3 —
  # verified on a pristine clone, standalone, before this delivery's files were
  # copied in. It appears here for the first time only because F-14.24's cure
  # made it RUNNABLE for the first time: the glob above reached .proof.mjs, .mjs
  # and .js, so the seven .proof.ts benches behind their wrappers had never once
  # been executed by this floor.
  #
  # So the base grows by one on the day the instrument stopped being blind, and
  # the honest reading is that this red is OLD and was merely unseen. It is
  # entered as BASE rather than cured because a UI sitting does not reach into a
  # crew-assignment colour token, and it is entered with its ground stated
  # rather than as a bare line — a base entry nobody can account for is how a
  # real regression gets absorbed.
  #
  # THE OTHER SIX .proof.ts BENCHES ARE GREEN, first run, no delta.
  printf 'RED: run-assign-words-proof\nRED: tdw08_p5_prospects_console\nRED: tdw10_p3_deck\nRED: tdw_auth_crossover\nRED: tdw_f0770_authority\nRED: tdw_f0774_stripper\n' | sort > /tmp/base.txt
  if diff /tmp/base.txt /tmp/floor.txt; then
    echo "FLOOR = NAMED BASE, no delta"
  else
    echo "FLOOR DELTA — the diff above is this delivery's to explain"
    exit 1
  fi
fi
