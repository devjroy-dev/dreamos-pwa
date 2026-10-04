#!/bin/sh
# stop the rig's own processes only: node processes running next or the stub door, and chromium binaries.
sel() { ps -eo pid=,comm=,args= | awk '($2=="node" || $2 ~ /^next/) && ($0 ~ /next|stub_door/) {print $1} $2 ~ /chrom/ {print $1}'; }
for p in $(sel); do kill "$p" 2>/dev/null; done; sleep 2
for p in $(sel); do kill -9 "$p" 2>/dev/null; done
sleep 1; left=$(sel | wc -l); echo "stop: done, left $left"
