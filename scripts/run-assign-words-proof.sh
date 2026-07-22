#!/usr/bin/env bash
# TDW_04.5 P4 P4 — compile the confirmation vocabulary proof standalone and run in plain node.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"
OUT="$(mktemp -d)"
node_modules/.bin/tsc scripts/assignmentWords.proof.ts \
  --outDir "$OUT" --module commonjs --target es2020 \
  --moduleResolution node --esModuleInterop --skipLibCheck >/dev/null
node "$OUT/scripts/assignmentWords.proof.js"
