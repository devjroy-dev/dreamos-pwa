#!/usr/bin/env bash
# TDW_04.5 P5 micro — compile the dependency-free post-access gate + its proof
# standalone (the pwa has no test runner) and run in plain node.
# Exits non-zero on any failed assertion.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"
OUT="$(mktemp -d)"
node_modules/.bin/tsc scripts/postAccess.proof.ts \
  --outDir "$OUT" --module commonjs --target es2020 \
  --moduleResolution node --esModuleInterop --skipLibCheck >/dev/null
node "$OUT/scripts/postAccess.proof.js"
