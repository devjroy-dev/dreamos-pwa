#!/usr/bin/env bash
# scripts/train.sh · CE-47 · ADS-2 · THE TRAIN (the chair's ruling of 3 Oct 2026): packages ready together land as ONE
# train on ONE check, pushed as separate commits, no shared paths.
#
# A SPEC file, one package per line, in landing order, fields split by '|':
#     <zip file>|<zip sha256>|<the manifest's path inside the ZIP's deploy/>|<the commit message, no quotes>
#   e.g. TDW_X_r1.zip|6d1a…|scripts/floor-manifest-x.txt|CE-47 X: what it does
#
#   bash scripts/train.sh apply  <spec>   check every ZIP's sha; refuse a package with no manifest, or a path in two
#                                         packages; unpack in order; mark added files intent-to-add; assert the dirty
#                                         set is exactly the union of the manifests (plain AND -uall). Prints the one
#                                         check to run:  run-floor.sh --affected <every manifest>
#   bash scripts/train.sh commit <spec>   one commit per package, in order, each staging exactly its own manifest's
#                                         paths and asserting that count with nothing else staged; then ONE push.
# Nothing here reads /tmp. Every refusal prints "STOP — nothing pushed; paste this output back" and exits 1.
set -u
MODE="${1:-}"; SPEC="${2:-}"
stop() { echo "STOP — $1"; echo "STOP — nothing pushed; paste this output back"; exit 1; }
[ "$MODE" = apply ] || [ "$MODE" = commit ] || stop "usage: bash scripts/train.sh apply|commit <spec>"
[ -f "$SPEC" ] || stop "spec not found: ${SPEC}"
grep -q '"name": "web"' package.json 2>/dev/null || stop "not the dreamos-pwa repo"
N=0; ZIPS=(); SHAS=(); MANS=(); MSGS=()
while IFS='|' read -r z s m c; do
  [ -z "${z// }" ] && continue; case "$z" in \#*) continue ;; esac
  [ -n "$s" ] && [ -n "$m" ] && [ -n "$c" ] || stop "spec line $((N+1)) needs zip|sha|manifest|message"
  case "$c" in *\"*|*\'*) stop "the commit message on line $((N+1)) holds a quote (e-263)" ;; esac
  ZIPS+=("$z"); SHAS+=("$s"); MANS+=("$m"); MSGS+=("$c"); N=$((N+1))
done < "$SPEC"
[ "$N" -ge 1 ] || stop "the spec names no package"
paths_of() { grep -v '^#' "$1" | sed 's/[[:space:]]*$//' | grep -v '^$'; }
# The train's own inputs (its ZIPs and its spec, where the founder drops them) are not the tree's dirt.
SPECREL=$(realpath --relative-to=. "$SPEC" 2>/dev/null || echo "$SPEC")
porc() { git status --porcelain ${1:-} | awk -v spec="$SPECREL" -v zips="$(printf '%s\n' "${ZIPS[@]}")" 'BEGIN{n=split(zips,z,"\n"); for(i=1;i<=n;i++) skip[z[i]]=1; skip[spec]=1} { p=substr($0,4); if (!(p in skip)) print }'; }

if [ "$MODE" = apply ]; then
  [ -z "$(porc)" ] || stop "the tree is not clean before the train: $(porc | head -3 | tr '\n' ' ')"
  W=$(mktemp -d "${HOME}/.train.XXXXXX"); trap 'rm -rf "$W"' EXIT
  : > "$W/all"
  for i in $(seq 0 $((N-1))); do
    z=${ZIPS[$i]}; [ -f "$z" ] || stop "ZIP not found: ${z}"
    echo "${SHAS[$i]}  ${z}" | sha256sum -c --quiet || stop "the ZIP's sha does not match: ${z}"
    mkdir -p "$W/p$i"; unzip -oq "$z" -d "$W/p$i" || stop "cannot unzip ${z}"
    [ -f "$W/p$i/deploy/${MANS[$i]}" ] || stop "${z} carries no manifest ${MANS[$i]} (a package needs its manifest)"
    paths_of "$W/p$i/deploy/${MANS[$i]}" > "$W/m$i"
    while IFS= read -r p; do [ -f "$W/p$i/deploy/$p" ] || stop "${z}: its manifest names ${p}, which the ZIP does not carry"; done < "$W/m$i"
    dup=$(sort "$W/m$i" | comm -12 - <(sort "$W/all")); [ -z "$dup" ] || stop "a path in two packages: $(echo $dup)"
    cat "$W/m$i" >> "$W/all"
  done
  for i in $(seq 0 $((N-1))); do cp -r "$W/p$i/deploy/." . ; rm -f "${ZIPS[$i]}"; echo "applied ${ZIPS[$i]} ($(wc -l < "$W/m$i") paths)"; done
  while IFS= read -r p; do git ls-files --error-unmatch -- "$p" >/dev/null 2>&1 || git add -N -- "$p"; done < "$W/all"
  want=$(sort -u "$W/all" | wc -l)
  got=$(porc | wc -l); gotu=$(porc -uall | wc -l)
  [ "$got" -eq "$want" ] && [ "$gotu" -eq "$want" ] || stop "dirty ${got} (plain) / ${gotu} (-uall), the manifests declare ${want}"
  extra=$(porc | sed 's/^...//' | sort | comm -23 - <(sort -u "$W/all")); [ -z "$extra" ] || stop "dirt outside the manifests: $(echo $extra)"
  echo "TRAIN APPLIED: ${N} package(s), ${want} paths (plain and -uall), every ZIP's sha matching, no shared path"
  echo "THE ONE CHECK:  bash scripts/run-floor.sh --affected$(for m in "${MANS[@]}"; do printf ' %s' "$m"; done) --check"
  exit 0
fi

# commit
for i in $(seq 0 $((N-1))); do
  m=${MANS[$i]}; [ -f "$m" ] || stop "manifest not in the tree: ${m}"
  cnt=$(paths_of "$m" | wc -l)
  paths_of "$m" | while IFS= read -r p; do git add -- "$p"; done
  st=$(git diff --cached --name-only | wc -l)
  [ "$st" -eq "$cnt" ] || stop "${m}: ${st} staged, its manifest declares ${cnt}"
  git commit -q -m "${MSGS[$i]}" || stop "commit failed for ${m}"
  echo "committed $(git log -1 --format='%h') ${MSGS[$i]:0:80}"
done
[ -z "$(porc)" ] || stop "dirt left after the last commit: $(porc | head -3 | tr '\n' ' ')"
git push -q origin HEAD:main || stop "the push failed; the commits are local only"
echo "TRAIN PUSHED: $(git log -1 --format='%h') over $(git log -1 --format='%h' HEAD~${N}), ${N} commit(s)"
