#!/usr/bin/env bash
# CE-42 4a/3b — compile the J1 copy home's proof standalone and run it in plain
# node, exactly as run-assign-words-proof.sh does for the confirmation vocabulary.
# The proof IMPORTS lib/worklist/introductions; nothing is re-implemented in it.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"
OUT="$(mktemp -d)"
node_modules/.bin/tsc scripts/b69_j1_introductions.proof.ts \
  --outDir "$OUT" --module commonjs --target es2020 \
  --moduleResolution node --esModuleInterop --skipLibCheck --strict >/dev/null
node "$OUT/scripts/b69_j1_introductions.proof.js"
