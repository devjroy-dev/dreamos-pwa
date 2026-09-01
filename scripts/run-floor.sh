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
# Usage:  bash scripts/run-floor.sh                            # print the red set
#         bash scripts/run-floor.sh --check                    # diff against the named base
#         bash scripts/run-floor.sh --delivery FILE [--check]  # [F-19.16] declared-dirt tree
#
# ── F-19.16 · THE PWA FLOOR COULD NOT MEASURE ANY DELIVERY TREE ──────────────
#
# `--delivery` is ported from `dream-os/scripts/run-floor.sh:129`, where it has
# worked since F-14.16. The finding it cures here is the same disease wearing a
# different coat, and the coat is worth naming because it is why this repo was
# said not to have the gap.
#
# `dream-os`'s RUNNER refuses a dirty tree. This runner never did — it only NOTEs
# dirt after the fact. The refusal in this repo lives in a BENCH:
# `scripts/tdw_f0774_vacuity_probe.mjs` writes to production source and restores
# it, so on a dirty tree it cannot prove the restore was clean and it stops. The
# effect at delivery time is identical either way: A DELIVERY TREE IS DIRTY BY
# DEFINITION, R-33.7 forbids the executor the commit that would clean it, and so
# the floor could not gate the one tree it exists to gate. Every pwa seat has
# been paying this, not only the one that filed it.
#
# THE DIFFERENCE `--delivery` DRAWS IS BETWEEN CONTAMINATION AND A DELIVERY, and
# a delivery's dirt is DECLARED. The manifest is the delivery's own file table,
# which its handover carries anyway, so nothing new has to be written to use it.
#
# THE DEFAULT IS UNCHANGED. No manifest, no new behaviour: the NOTE still fires
# and nothing refuses that did not refuse before. This is deliberate — a runner
# that started refusing dirty trees today would break every seat mid-sitting to
# cure a problem none of them asked about, and the ruled cure is an ADDITION.
#
# ── THE ENV CONTRACT, AND WHY THE RUNNER CANNOT CURE THIS ALONE ──────────────
#
# Porting the flag here is necessary and not sufficient: the bench refuses on its
# own, whatever the runner thinks. So `--delivery` exports the manifest's
# absolute path as `TDW_FLOOR_DELIVERY_MANIFEST` and the probe honours it at its
# own refusal site. ONE MANIFEST HOME (this file), ONE ENV NAME, one bench that
# reads it. A second bench that grows a clean-tree guard tomorrow joins by
# reading the same variable, and `NEEDS_CLEAN` below already finds such benches
# by derivation rather than by a list.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

# ── ARGUMENTS ────────────────────────────────────────────────────────────────
# Order-independent, because a caller who types `--check --delivery FILE` means
# the same thing as the reverse and should not be punished for it. This replaces
# the old positional `${1:-} = "--check"` test, which silently ignored a second
# argument and would have swallowed `--delivery` without a word.
CHECK=""
MANIFEST=""
while [ $# -gt 0 ]; do
  case "$1" in
    --check)    CHECK="yes"; shift ;;
    --delivery) MANIFEST="${2:-}"; shift 2 || { echo "STOP — --delivery needs a manifest path."; exit 1; } ;;
    *)          echo "STOP — unknown argument: $1"; exit 1 ;;
  esac
done

# `git status --porcelain` paths, one per line. Rename entries carry `old -> new`
# and BOTH sides are dirt a manifest must account for.
#
# ── §4-3 · `-uall` · A MANIFEST NAMES FILES, SO THE DIRT MUST BE FILES ──────
# Bare `--porcelain` COLLAPSES an untracked directory to one entry with a trailing slash:
# a delivery that adds `app/w/storefront/page.tsx` shows up as `app/w/storefront/`. The
# manifest above it is a FILE table by its own header — it is the delivery's own file list,
# which is the whole reason using it costs nothing — so the two could never match and the
# runner refused a correct delivery with "contamination", naming three directories that
# contain nothing but declared files.
#
# THE FAILURE POINTED AT THE TREE FOR A FAULT IN THE READER, which is F-38.44's shape and
# the second time this arc a comparison has been made against a corpus that was not what it
# claimed. The cure is on the READER side deliberately: the alternative was to teach every
# future manifest to declare directory forms beside file forms, which is a second spelling
# of one fact in every delivery from now on, and the first one to forget it gets this same
# refusal. `-uall` makes the enumeration mean what the manifest already means.
#
# It cannot loosen the check: `-uall` only ever EXPANDS a directory into the files it holds,
# so a path outside the manifest is still outside it. A delivery that adds an undeclared
# file inside a declared directory is now CAUGHT where the collapsed form hid it.
dirt_paths() {
  git status --porcelain -uall 2>/dev/null | while IFS= read -r line; do
    p="${line:3}"
    case "$p" in
      *" -> "*) echo "${p%% -> *}"; echo "${p##* -> }" ;;
      *)        echo "$p" ;;
    esac
  done | sed 's/^"//; s/"$//' | sort -u
}

DIRT=$(dirt_paths)

if [ -n "$MANIFEST" ]; then
  if [ ! -f "$MANIFEST" ]; then
    echo "STOP — manifest not found: ${MANIFEST}. Nothing was run."
    exit 1
  fi
  # Blank lines and `#` comments allowed, so the manifest can carry its own
  # reasons and be the same artefact the handover prints.
  DECLARED=$(sed 's/#.*//' "$MANIFEST" | sed 's/[[:space:]]*$//' | grep -v '^[[:space:]]*$' | sort -u)
  UNDECLARED=$(comm -23 <(echo "$DIRT") <(echo "$DECLARED"))
  if [ -n "$UNDECLARED" ]; then
    echo "STOP — dirt OUTSIDE the declared manifest. This is contamination, not a"
    echo "delivery, and the difference is the whole point of this mode."
    echo "$UNDECLARED" | sed 's/^/  /'
    exit 1
  fi
  # PRINTED INTO THE OUTPUT: a floor that quietly forgave something is not a
  # floor. Whoever reads this measurement reads what it tolerated.
  echo "[F-19.16] --delivery mode: $(echo "$DIRT" | grep -c . ) dirty path(s), all declared in ${MANIFEST}:" >&2
  echo "$DIRT" | sed 's/^/  declared: /' >&2
  echo "" >&2

  # CONTENTS ARE NOT TOLERATED, ONLY THE SET. A bench that corrupts a manifest
  # file would hide inside expected dirt; these hashes are what catch it.
  MANIFEST_SHA_BEFORE=$(echo "$DIRT" | while IFS= read -r p; do
    [ -f "$p" ] && sha256sum "$p" || echo "ABSENT  $p"
  done)

  # THE ENV CONTRACT. Absolute, because the benches below are spawned with this
  # repo as cwd but a caller may have passed a path relative to their own.
  TDW_FLOOR_DELIVERY_MANIFEST="$(cd "$(dirname "$MANIFEST")" && pwd)/$(basename "$MANIFEST")"
  export TDW_FLOOR_DELIVERY_MANIFEST
fi

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
if [ -z "$MANIFEST" ]; then
  POST=$(git status --porcelain 2>/dev/null)
  if [ -n "$POST" ]; then
    echo "NOTE — the floor itself dirtied the tree. A bench is writing output into"
    echo "the repo; this is filed, not cured here (out of D-7's radius):"
    echo "$POST" | sed 's/^/  /'
  fi
else
  # [F-19.16] Two questions in this mode, and the second is the one the NOTE
  # above could never ask: did the DIRTY SET grow (a bench touched a file nobody
  # declared), and did any DECLARED FILE'S CONTENTS move (a bench corrupted the
  # delivery itself, hiding inside dirt that was already expected)?
  #
  # THE SECOND QUESTION IS F-19.18's, ASKED FROM THE RUNNER. That finding is a
  # bench leaving a mutation in production source after being killed mid-run.
  # `mutateCopy` cures it at the bench, where it belongs; this asks the same
  # question from outside, because a cure at one site and a check from another is
  # how the estate proves a property instead of asserting it.
  POST_DIRT=$(dirt_paths)
  POST_UNDECLARED=$(comm -23 <(echo "$POST_DIRT") <(echo "$DECLARED"))
  if [ -n "$POST_UNDECLARED" ]; then
    echo ""
    echo "STOP — a bench dirtied a file OUTSIDE the manifest. It did not restore"
    echo "what it mutated, and this floor was measured over changed source."
    echo "$POST_UNDECLARED" | sed 's/^/  /'
    exit 1
  fi
  MANIFEST_SHA_AFTER=$(echo "$DIRT" | while IFS= read -r p; do
    [ -f "$p" ] && sha256sum "$p" || echo "ABSENT  $p"
  done)
  if [ "$MANIFEST_SHA_BEFORE" != "$MANIFEST_SHA_AFTER" ]; then
    echo ""
    echo "STOP — a DECLARED file's contents moved during the run. The manifest"
    echo "tolerates a dirty SET, never dirty CONTENTS: a bench corrupted the"
    echo "delivery and would have hidden inside dirt that was already expected."
    diff <(echo "$MANIFEST_SHA_BEFORE") <(echo "$MANIFEST_SHA_AFTER") | sed 's/^/  /'
    exit 1
  fi
  echo "[F-19.16] declared files unmoved — set and contents both verified." >&2
fi
printf "%b" "$RED" | sort > /tmp/floor.txt
cat /tmp/floor.txt

if [ "$CHECK" = "yes" ]; then
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
  # ── BASE AMENDED, LABELLED — M-FINISH S2/5 · §4-4 BATCH ③ (CE-38 relay #2) ──
  # ONE LINE JOINS: `tdw_f0774_readers`, and it is NOT this delivery's regression.
  # It is a bench that ARRIVES RED BY RULING.
  #
  # `scripts/tdw_f0774_readers.proof.mjs` is the general guard F-38.60 §6 asked for:
  # a reader whose subject is CODE strips before it parses; a reader whose subject
  # is PROSE is declared. Derived over scripts/ + tools/ at this tip it finds 88
  # readers and names EIGHTEEN that read .ts/.tsx production source and match
  # tokens in it without stripping first — the class that let a comment convict a
  # correct tree at F-38.60 and let a cure walk away from its site at F-38.59.
  #
  # THE CHAIR REFUSED THE TWO GREEN OPTIONS AND THE REASONING BELONGS HERE, not
  # only in a handover: a declared-subset green is a bench made to pass wearing a
  # charter as a fig leaf, and deferral leaves the class unguarded for however many
  # sittings the design charter waits. 「The first thing an honest instrument does
  # on a diseased corpus is red.」
  #
  # THE FLOOR GAINS EXACTLY ONE LINE, NOT EIGHTEEN. The eighteen are the bench's
  # FINDINGS and are printed by it; the floor's unit is the bench. A reader who
  # expects eighteen entries here has mistaken a report for a set.
  #
  # WHAT RETIRES IT: the cure sitting, chartered at relay #2. `tools/wl_render.cjs`
  # is flagged FIRST among the fourteen live cures — a gate instrument in the
  # diseased set outranks the benches. The four already dark at base
  # (tdw09_palette · tdw09_theme_retire · tdw09_type · tdw13_d4_extraction) join
  # their existing findings. When they land, THIS LABEL COMES OUT and the bench
  # starts guarding instead of reporting.
  #
  # ⚠ A BASE ENTRY NOBODY CAN ACCOUNT FOR IS HOW A REAL REGRESSION GETS ABSORBED,
  # which is why this one carries its number, its ruling and its exit condition. If
  # this bench reds for any reason OTHER than the eighteen it names, that is a
  # finding and not this line.
  #
  # ── LABEL AMENDED — BENCH SITTING B-1 · THE INSTRUMENT AUDIT (CE-39, 2026-09-02) ──
  # NO LINE JOINS OR LEAVES. This paragraph exists because the sentence directly
  # above is a standing obligation and the bench now reds for a SECOND reason,
  # which that sentence would otherwise class as a finding against this entry.
  #
  # WHAT CHANGED, first: the eighteen are NINETEEN. Re-derived at `c3b4f51` on a
  # clean clone, `tdw_f0774_readers` §2.2 finds 19 un-stripped code-subject readers
  # over 91 readers in a 105-file corpus, where the label above recorded 18 over
  # 88. The set grew with the corpus; it is not a regression and nothing in it was
  # cured. The count is stated here so the next seat diffs against a number that
  # was actually measured rather than one inherited from a different tip.
  #
  # WHAT CHANGED, second, and this is the amendment's substance: §2.3 IS NEW, AND
  # IT REDS. F-39.41 — §2.2 tests the PRESENCE of stripping, and its `one-home`
  # shape tests a NAME (`/stripComments/`), so a reader stripping with
  # `NAIVE_RETIRED` imported from a path containing the word read as compliant.
  # `b40_worklist_shell_bench.js` did exactly that while F-39.39 was doing live
  # damage there, and never joined the debt list. §2.3 asks the identity question
  # the name-match could not: A READER THAT STRIPS, STRIPS THROUGH THE ONE HOME.
  #
  # It names THIRTY-SEVEN, in two tiers, and the first tier is why this could not
  # wait: FOUR readers define a PRIVATE FUNCTION NAMED `stripComments` whose body
  # is the retired naive rule — tdw09_p2_doors, tdw15_p3_moments, tdw15_p3_pulse,
  # tdw15_p3_daystogo. The remaining thirty-three hand-roll without an import.
  # Two declared exceptions stand, each argued at its own site and asserted live
  # by §2.3a. Ten dream-os shadows are FILED (F-39.45), not carried here.
  #
  # THE FLOOR GAINS NOTHING BY IT — this bench was already base, the floor's unit
  # is the bench, and thirty-seven findings are a REPORT and not a set. The exit
  # condition is unchanged in kind and now has two halves: this label comes out
  # when BOTH cure sittings land, the §2.2 one chartered at CE-38 relay #2 and the
  # §2.3 one owed by F-39.41. Until then, a red from §2.2 or §2.3 is THIS LINE; a
  # red from §1, §2.1, §2.3a, §2.3b, §2.3e-k or §3 is a finding and is not.
  printf 'RED: run-assign-words-proof\nRED: tdw07_p2_profile\nRED: tdw07_p3_portfolio\nRED: tdw07_p4b_body\nRED: tdw08_p3_landing\nRED: tdw08_p5_prospects_console\nRED: tdw09_p1_canon\nRED: tdw09_p2_doors\nRED: tdw09_p2c\nRED: tdw09_palette\nRED: tdw09_roles\nRED: tdw09_surface\nRED: tdw09_theme_retire\nRED: tdw09_type\nRED: tdw09_uivendor\nRED: tdw10_billing_tab\nRED: tdw10_p2_retint\nRED: tdw10_p3_deck\nRED: tdw13_d4_extraction\nRED: tdw_auth_crossover\nRED: tdw_f0770_authority\nRED: tdw_f0774_readers\nRED: tdw_f0774_stripper\n' | sort > /tmp/base.txt
  if diff /tmp/base.txt /tmp/floor.txt; then
    echo "FLOOR = NAMED BASE, no delta"
  else
    echo "FLOOR DELTA — the diff above is this delivery's to explain"
    exit 1
  fi
fi
