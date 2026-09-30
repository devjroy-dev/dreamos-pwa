#!/usr/bin/env bash
# DESIGN-1 · THE LAYOUT SWITCH: the v2 copy of run-roster-mint-proof.sh, for rosterMint_v2.proof.ts.
# TDW_04.5 P4 — compile the dependency-free roster mint logic + its proof standalone
# (the pwa has no test runner) and run in plain node. Exits non-zero on any failed assertion.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"
OUT="$(mktemp -d)"
node_modules/.bin/tsc scripts/rosterMint_v2.proof.ts \
  --outDir "$OUT" --module commonjs --target es2020 \
  --moduleResolution node --esModuleInterop --skipLibCheck >/dev/null
node "$OUT/scripts/rosterMint_v2.proof.js"
