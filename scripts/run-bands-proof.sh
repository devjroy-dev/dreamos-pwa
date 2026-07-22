#!/usr/bin/env bash
# TDW_04.5 P2 — compile the band view's dependency-free logic seams + their proof
# standalone (the pwa has no test runner) and run in plain node. Non-zero on any fail.
# noEmitOnError is ON in the config: a type error stops the run, never slips past it.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"
OUT="$(mktemp -d)"
node_modules/.bin/tsc -p scripts/bands.proof.tsconfig.json --outDir "$OUT"
node "$OUT/scripts/bands.proof.js"
