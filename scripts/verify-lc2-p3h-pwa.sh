#!/usr/bin/env bash
# scripts/verify-lc2-p3h-pwa.sh — TDW CE-43 · LC-2 packet 3h (dreamos-pwa) · the founder's ONE verify command.
#
#   bash scripts/verify-lc2-p3h-pwa.sh
#
# WHAT IT RUNS, IN ORDER, EACH JUDGED BY EXIT CODE (R-40.85); it stops at the first failure:
#   1  npx --no-install tsc --noEmit                      the whole tree
#   2  b82, b80, b81 and tdw37_hygiene_false_success (b82 reads the sibling ../dream-os font and refuses without it)
#   3  rm -rf .next, then npx --no-install next build     the founder's gate (R-40.66)
#   4  bash scripts/run-floor.sh --delivery scripts/floor-manifest-lc2-p3h-pwa.txt --check
# R-38.21: one command for the founder, so the order lives here. No shell options are set.
cd "$(dirname "$0")/.." || exit 1

say() { echo "── $1"; }

say "1/4 tsc --noEmit"
npx --no-install tsc --noEmit
rc=$?
if [ "$rc" -ne 0 ]; then echo "VERIFY RED at step 1 (tsc, exit $rc)"; exit 1; fi
echo "tsc clean"

say "2/4 benches"
for b in scripts/b82_lc2_p3_booking_bench.js scripts/b80_lc2_p1_shell_bench.js scripts/b81_lc2_p2_room_bench.js scripts/tdw37_hygiene_false_success.proof.mjs; do
  n=$(basename "$b")
  node "$b" > "/tmp/verify_pwa_$n.txt" 2>&1
  rc=$?
  tail -n 3 "/tmp/verify_pwa_$n.txt"
  if [ "$rc" -ne 0 ]; then
    echo "VERIFY RED at step 2 ($n, exit $rc). Its failing lines:"
    grep -E "FAIL|RED" "/tmp/verify_pwa_$n.txt"
    exit 1
  fi
done

say "3/4 next build (cold)"
rm -rf .next
npx --no-install next build > /tmp/verify_pwa_next.txt 2>&1
rc=$?
tail -n 15 /tmp/verify_pwa_next.txt
if [ "$rc" -ne 0 ]; then echo "VERIFY RED at step 3 (next build, exit $rc)"; exit 1; fi

say "4/4 the floor, declared dirt"
bash scripts/run-floor.sh --delivery scripts/floor-manifest-lc2-p3h-pwa.txt --check
rc=$?
if [ "$rc" -ne 0 ]; then echo "VERIFY RED at step 4 (floor, exit $rc)"; exit 1; fi

echo "VERIFY GREEN"
exit 0
