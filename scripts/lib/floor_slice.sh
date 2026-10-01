#!/usr/bin/env bash
# scripts/lib/floor_slice.sh · CE-47 (the chair's ruling on the two-hour floor, 30 Sept 2026) · FE-6, L3 r2.
# Lives in scripts/lib/ so the floor's flat glob never collects it as a member (e-44.20).
#
# THE RULE. A bench's MUTATION slice proves the bench can redden. On the floor it runs only when the delivery touches
# that bench or one of its SUBJECT files; otherwise the floor runs its STATES slice only. A seat's own proof always
# runs both. With no --delivery, or on any doubt, the member runs WHOLE: the rule can only shorten a floor that names
# what it delivers. The verdict and the named base are untouched: the states slice's red or green is the member's.
#
# A bench opts in with three machine-readable lines (each once, at the top of the file):
#   // FLOOR-SUBJECTS: <repo-relative paths, space-separated>   the files whose change must re-prove the mutations
#   // FLOOR-STATES: env <VAR=value ...>                          how to run the states slice only
#   // FLOOR-WHOLE: args <arguments ...>                          what to add to run it whole (empty when the default is whole)
#
# Usage: floor_slice.sh <bench path> [<delivery manifest>]   prints ONE line:
#   plain                       the bench declares no subjects: run it exactly as before
#   whole <why>                 run it whole
#   states <why>                run its states slice only
set -f
b="$1"; m="${2:-}"
subj=$(sed -n 's|^// FLOOR-SUBJECTS: ||p' "$b" 2>/dev/null | head -n 1)
[ -z "$subj" ] && { echo "plain"; exit 0; }
if [ -z "$m" ] || [ ! -f "$m" ]; then echo "whole (no --delivery)"; exit 0; fi
if grep -qxF "$b" "$m"; then echo "whole (the delivery names the bench)"; exit 0; fi
for s in $subj; do
  if grep -qxF "$s" "$m"; then echo "whole (the delivery names $s)"; exit 0; fi
done
recipe=$(sed -n 's|^// FLOOR-STATES: ||p' "$b" | head -n 1)
[ -z "$recipe" ] && { echo "whole (no states recipe declared)"; exit 0; }
echo "states (no subject in the delivery)"
