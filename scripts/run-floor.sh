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
BENCHES=$(ls scripts/*.proof.mjs scripts/*.mjs scripts/*.js 2>/dev/null | sort -u)

RED=""
for b in $BENCHES; do
  n=$(basename "$b" | sed 's/\.proof\.mjs$//; s/\.mjs$//; s/\.js$//')
  node "$b" >/dev/null 2>&1 || RED="${RED}RED: ${n}\n"
done
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
  printf 'RED: tdw08_p5_prospects_console\nRED: tdw10_p3_deck\nRED: tdw_auth_crossover\nRED: tdw_f0770_authority\nRED: tdw_f0774_stripper\n' | sort > /tmp/base.txt
  if diff /tmp/base.txt /tmp/floor.txt; then
    echo "FLOOR = NAMED BASE, no delta"
  else
    echo "FLOOR DELTA — the diff above is this delivery's to explain"
    exit 1
  fi
fi
