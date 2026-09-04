#!/usr/bin/env bash
# F-38.52 — compile the mode bridge's proof against the REAL lib/worklist/mode.ts and run
# it in plain node (the pwa has no test runner). noEmitOnError is ON in the config: a type
# error stops the run rather than slipping past it. Exit code is the verdict.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"
OUT="$(mktemp -d)"
node_modules/.bin/tsc -p scripts/modeBridge.proof.tsconfig.json --outDir "$OUT"
node "$OUT/scripts/modeBridge.proof.js"
