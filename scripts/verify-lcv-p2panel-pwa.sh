#!/usr/bin/env bash
# scripts/verify-lcv-p2panel-pwa.sh · TDW CE-44 · LCV-1 · LC-Victor P2, the panel cut, F-44.43 (dreamos-pwa) · the founder's ONE verify command.
#
#   bash scripts/verify-lcv-p2panel-pwa.sh
#
# WHAT IT RUNS, IN ORDER, EACH JUDGED BY EXIT CODE (R-40.85); it stops at the first failure:
#   1  npx --no-install tsc --noEmit                      the whole tree
#   2  b87, which SPAWNS `next dev` on port 3989 and drives the real switchboard in a headless
#      Chromium resolved through CHROME_BIN or @sparticuz/chromium (C-43.18), both themes, and a
#      mutation restoring the catch-all. Without a browser its room cells are DECLARED RED.
#   3  rm -rf .next, then npx --no-install next build     the founder's gate (R-40.66)
#   4  bash scripts/run-floor.sh --delivery scripts/floor-manifest-lcv-p2panel-pwa.txt --check
# R-38.21: one command for the founder, so the order lives here. No shell options are set.
cd "$(dirname "$0")/.." || exit 1

say() { echo "· $1"; }

say "1/4 tsc --noEmit"
npx --no-install tsc --noEmit
rc=$?
if [ "$rc" -ne 0 ]; then echo "VERIFY RED at step 1 (tsc, exit $rc)"; exit 1; fi
echo "tsc clean"

say "2/4 b87 (the real panel, both themes)"
node scripts/b87_lcv_p2_panel_bench.js > /tmp/verify_pwa_b87.txt 2>&1
rc=$?
tail -n 3 /tmp/verify_pwa_b87.txt
if [ "$rc" -ne 0 ]; then
  echo "VERIFY RED at step 2 (b87, exit $rc). Its failing lines:"
  grep -E "FAIL|CRASH" /tmp/verify_pwa_b87.txt
  exit 1
fi

say "3/4 next build (cold)"
rm -rf .next
npx --no-install next build > /tmp/verify_pwa_next.txt 2>&1
rc=$?
tail -n 15 /tmp/verify_pwa_next.txt
if [ "$rc" -ne 0 ]; then echo "VERIFY RED at step 3 (next build, exit $rc)"; exit 1; fi

say "4/4 the floor, declared dirt"
bash scripts/run-floor.sh --delivery scripts/floor-manifest-lcv-p2panel-pwa.txt --check
rc=$?
if [ "$rc" -ne 0 ]; then echo "VERIFY RED at step 4 (floor, exit $rc)"; exit 1; fi

echo "VERIFY GREEN"
exit 0
