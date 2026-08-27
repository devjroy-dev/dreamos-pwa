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
  # ── BASE AMENDED, LABELLED — MICRO-WA-DIAL · CE-225 (2026-08-24) ───────────
  # `tdw13_d4_extraction` JOINS, and it is not this delivery's red. It fails
  # cell 2a — "every relocated line still exists, except the ten edited by
  # ruling" — reporting ten eaten, the first being `const VENDOR_CATEGORIES`.
  # It has been red since 8ebbe9e, which is pre-arc and inherited; CE-225
  # RECORDED the floor as seven and 33652aa's own commit message says "Floor 7,
  # unchanged" — but nobody amended this constant, so the runner has been
  # counting six while every chair counted seven.
  #
  # THE COST OF LEAVING IT: `--check` exits 1 at an UNTOUCHED tip. A seat that
  # cannot get a clean floor before it starts cannot tell its own delta from
  # its inheritance, which is the one question this instrument exists to
  # answer. That is not a cosmetic mismatch; it is the instrument lying at rest.
  #
  # Entered as BASE and not cured, with its ground stated rather than as a bare
  # line: a wa.me affordance on two admin rows does not reach a block-13
  # extraction census, and a base entry nobody can account for is how a real
  # regression gets absorbed. The read-first that caught it did not chase it —
  # the ten-eaten cause is still unexamined and is owed a sitting of its own.
  #
  # DESK LORE, banked here because it wasted a bounce: a `--depth 1` clone ALSO
  # reds `tdw15_p2_envelopes` and `tdw15_p3_pulse`. Both call `git show` on old
  # commits and both fail RATHER THAN PASS VACUOUSLY when the history is absent,
  # which is correct conduct. `git fetch --unshallow` clears both. They are not
  # base and must never be entered as base.
  # ── BASE AMENDED, LABELLED — M-WORKLIST P1 · ZIP 13 (CE-37, 2026-08-27) ────
  # FIFTEEN LINES JOIN, ON THIS BRANCH ONLY, AND NONE OF THEM IS THIS
  # DELIVERY'S RED. Derived on a pristine clone of `worklist` at 03a7759 before
  # any of ZIP 13's files existed: 24 red, base 7, extras 17, none vanished.
  #
  # tdw07_p2_profile · tdw07_p3_portfolio · tdw07_p4b_body · tdw08_p3_landing ·
  # tdw09_p1_canon · tdw09_p2_doors · tdw09_p2c · tdw09_palette · tdw09_roles ·
  # tdw09_surface · tdw09_theme_retire · tdw09_type · tdw09_uivendor ·
  # tdw10_billing_tab · tdw10_p2_retint
  #
  # THE GROUND, cited rather than asserted: every one of these asserts the
  # ESPRESSO-ERA design system — the palette literals, the type ladder, the role
  # bindings and the surface chrome that R-37.65 replaced on this branch when it
  # ruled Graphite & Signal at the token layer, both modes, 33 tokens. They fail
  # because the branch changed what they assert, by ruling. A bench that reds
  # because the estate moved under it is not a regression; it is a bench whose
  # subject was retired without it.
  #
  # WHY LABELLED AND NOT CURED: rewriting fifteen design-system benches is not a
  # gate-repair sitting's work, and rewriting them to the NEW palette would also
  # be wrong while `main` still runs the old one. MAIN REMAINS THEIR
  # JURISDICTION — they are correct there and must stay green there. Their final
  # disposition on this branch (retire-with-the-reader, or rewrite to Graphite at
  # cutover) is Phase 2 / cutover business and is owed a sitting of its own.
  #
  # WHY THE COUNT IS FIFTEEN AND NOT SEVENTEEN, since seventeen extras were
  # derived: `wl_audit` LEAVES the floor rather than joining the base — it moved
  # to `tools/` this ZIP per CE ruling F-5(a), because it is an instrument and
  # the glob below runs benches. It was never a bench and its red was the glob's
  # error, not the tree's. And `tdw_f0774_vacuity_probe` is DELIBERATELY ABSENT
  # from this block: see the standing note above — its red is a finding by
  # definition, its cause is now derived, and it is NOT branch divergence. It is
  # reported as an open STOP, not absorbed here. A base entry nobody can account
  # for is how a real regression gets absorbed; entering that one would have been
  # exactly that.
  printf 'RED: run-assign-words-proof\nRED: tdw07_p2_profile\nRED: tdw07_p3_portfolio\nRED: tdw07_p4b_body\nRED: tdw08_p3_landing\nRED: tdw08_p5_prospects_console\nRED: tdw09_p1_canon\nRED: tdw09_p2_doors\nRED: tdw09_p2c\nRED: tdw09_palette\nRED: tdw09_roles\nRED: tdw09_surface\nRED: tdw09_theme_retire\nRED: tdw09_type\nRED: tdw09_uivendor\nRED: tdw10_billing_tab\nRED: tdw10_p2_retint\nRED: tdw10_p3_deck\nRED: tdw13_d4_extraction\nRED: tdw_auth_crossover\nRED: tdw_f0770_authority\nRED: tdw_f0774_stripper\n' | sort > /tmp/base.txt
  if diff /tmp/base.txt /tmp/floor.txt; then
    echo "FLOOR = NAMED BASE, no delta"
  else
    echo "FLOOR DELTA — the diff above is this delivery's to explain"
    exit 1
  fi
fi
