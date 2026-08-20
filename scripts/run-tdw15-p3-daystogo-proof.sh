#!/usr/bin/env bash
# TDW_15 P3 ZIP2 — compile the day-boundary cure's proof standalone (the pwa has
# no test runner; the bands.proof.ts precedent, same harness) and run in plain
# node. Non-zero on any fail. noEmitOnError is ON in the config: a type error
# stops the run, never slips past it.
#
# The proof re-executes ITS OWN COMPILED FILE under four TZs for §4, so $OUT must
# survive the parent's lifetime — mktemp -d does, and the OS reaps it.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"
OUT="$(mktemp -d)"
node_modules/.bin/tsc -p scripts/tdw15_p3_daystogo.proof.tsconfig.json --outDir "$OUT"
node "$OUT/scripts/tdw15_p3_daystogo.proof.js"
