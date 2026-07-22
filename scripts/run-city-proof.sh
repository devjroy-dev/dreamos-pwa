#!/usr/bin/env bash
# TDW_04.5 P4 D2 — compile the city ladder proof standalone and run in plain node.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"
OUT="$(mktemp -d)"
node_modules/.bin/tsc scripts/cityMatch.proof.ts \
  --outDir "$OUT" --module commonjs --target es2020 \
  --moduleResolution node --esModuleInterop --skipLibCheck >/dev/null
node "$OUT/scripts/cityMatch.proof.js"
