#!/usr/bin/env bash
# scripts/lib/floor_reap.sh · TDW CE-45 · FE-2 · A-45.13 (F-44.160, closed at the runner).
#
# usage: bash scripts/lib/floor_reap.sh <member-name>      (run from the repo root, as run-floor.sh is)
#
# WHY. Next 16 refuses a second `next dev` in one project root. A bench that stops its server by signalling
# npx's process group alone lets next-server outlive it (witnessed: b87's server on :3989 held the root and
# refused b122's, F-44.160's third red). A rung can harden its own stop; it cannot be made to clean up after
# another. So the RUNNER does, after every member: any `next dev` (or a child of one) still running with the
# repo root as its working directory is stopped, the WHOLE process tree, waited on, and NAMED as a leak by
# the member that ran last. Nothing is hidden: every stop prints one LEAK line.
#
# WHAT COUNTS. A process whose working directory is this root AND whose command line is a next dev server
# (`next dev`, `next-server`, or a worker under `.next/`), found two ways and joined: by its command line
# (ps), and by any listening socket, tcp or tcp6 (ss), since Next listens on :: as well as 0.0.0.0. Other
# roots (a bench's base worktree) are never touched; a base worktree's server is its own bench's to stop.
# (The socket half is not witnessable in a sandbox without /proc/net/tcp6; the command-line half is, and
# names the port from `-p N` there.)
#
# OUTPUT. One line per leak: "LEAK: <member> left a next dev running in the root (pids …; ports …)".
# Nothing when there is none. Exit 0 always: a leak is NAMED, it does not change the member's verdict.
#
# ── A-46.6 (CE-46, ruled 28 Sept 2026; built by FE-4) · BEFORE THE FIRST MEMBER, ANY NEXT DEV ───────────────
# WEB-1's floor went red on b122 because a next dev left running from BEFORE the floor shared .next with the
# bench's own, and this reaper's pre-floor pass did not stop it. Read at the tree, two reasons, both cured here:
#  (1) it saw only servers whose working directory it could PROVE was this root, by /proc/<pid>/cwd, and the
#      founder's Mac has no /proc, so on the machine that runs the floor the pass could never match anything.
#      cwd_of now falls back to lsof (present on macOS), and the child walk no longer uses GNU ps's --ppid
#      (absent on macOS) but reads pid and ppid from `ps -A` and filters them itself;
#  (2) the ruling widens the pre-floor pass: called as "(before the floor)", it stops ANY next dev or
#      next-server, whatever its root, since a server started before the floor is nobody's member and the
#      floor must begin with none. It still finds servers BY PROGRAM NAME (node or next-server) and stops
#      them BY PID, never by a pattern (a shell whose line merely contains "next dev", this reaper's
#      ancestors: e-212's lesson), and it PRINTS WHAT IT KILLED on its one REAPED line: each server's pid, root and command. (The after-member
#      LEAK line keeps its sealed shape, b133 2.2 pins it to the character.)
#      After a member the pass stays this root only: a bench's base worktree server is its own bench's.
set -u
member="${1:-unknown}"
root="$(pwd -P)"
scope=root; [ "$member" = "(before the floor)" ] && scope=any

cwd_of() {
  local c; c=$(readlink "/proc/$1/cwd" 2>/dev/null || true)
  [ -n "$c" ] || c=$(lsof -a -p "$1" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1)
  printf '%s' "$c"
}
in_scope() { [ "$scope" = any ] || [ "$(cwd_of "$1")" = "$root" ]; }
is_next() { case "$1" in *"next dev"*|*next-server*|*"/.next/"*|*"/next/dist/"*) return 0 ;; *) return 1 ;; esac; }
# ONLY A NODE PROGRAM IS A SERVER. A shell whose command line merely CONTAINS "next dev" (the founder's own
# pasted block, a wrapper, this reaper's caller) is never a candidate: the first cut matched its own calling
# shell and stopped it. The program name must be node or next-server, and the reaper's own ancestors are
# excluded outright.
# e-217 (CE-46 FE-4, 28 Sept 2026, witnessed on the founder's Codespace): Node 24 on Linux names its main thread
# "MainThread", and ps's comm is the main thread's name, so a plain node process reads comm=MainThread there (a
# next-server that sets its title still reads next-server). The first cut admitted only node and next-server, so
# on Node 24 a server's parent `node .../next dev`, and b140 1.7's stand-in, were never candidates. MainThread is
# admitted ONLY when the process's executable is a node binary (/proc/<pid>/exe ends in /node); a shell never is.
is_server_prog() {
  case "$(ps -o comm= -p "$1" 2>/dev/null)" in
    node|next-server*|"next-server (v"*) return 0 ;;
    MainThread) case "$(readlink "/proc/$1/exe" 2>/dev/null)" in */node) return 0 ;; esac; return 1 ;;
    *) return 1 ;;
  esac
}
ancestors=" "; a=$$; while [ -n "$a" ] && [ "$a" != "0" ] && [ "$a" != "1" ]; do ancestors="$ancestors$a "; a=$(ps -o ppid= -p "$a" 2>/dev/null | tr -d ' '); done
ok_pid() { case "$ancestors" in *" $1 "*) return 1 ;; esac; is_server_prog "$1"; }

cands=""
# (1) by command line
while read -r pid args; do
  [ -n "$pid" ] || continue
  [ "$pid" = "$$" ] && continue
  if is_next "$args" && ok_pid "$pid" && in_scope "$pid"; then cands="$cands $pid"; fi
done < <(ps -eo pid=,args= 2>/dev/null)
# (2) by listening socket, tcp and tcp6 (ss prints both with -l -t; the owning pid is in users:(...pid=N...))
ports=""
if command -v ss >/dev/null 2>&1; then
  while read -r line; do
    pid=$(printf '%s' "$line" | sed -n 's/.*pid=\([0-9]*\).*/\1/p')
    port=$(printf '%s' "$line" | awk '{print $4}' | sed 's/.*://')
    [ -n "$pid" ] || continue
    if ok_pid "$pid" && in_scope "$pid" && is_next "$(ps -o args= -p "$pid" 2>/dev/null)"; then cands="$cands $pid"; ports="$ports $port"; fi
  done < <(ss -ltnpH 2>/dev/null)
fi
cands=$(printf '%s\n' $cands | sort -un | tr '\n' ' ')
[ -n "${cands// /}" ] || exit 0

# the whole tree of every candidate, found BEFORE any signal (a child reparents once its parent dies)
tree="$cands"
for _ in 1 2 3 4 5 6; do
  more=""
  for p in $tree; do more="$more $(ps -A -o pid=,ppid= 2>/dev/null | awk -v p="$p" '$2==p{print $1}')"; done
  tree=$(printf '%s\n' $tree $more | sort -un | tr '\n' ' ')
done
# the port from each candidate's own command line (`-p N`, `--port N`) as well: a sandbox that hides its
# sockets (no /proc/net/tcp6; ss sees nothing) still names the port this way
for p in $cands; do
  pa=$(ps -o args= -p "$p" 2>/dev/null | sed -n 's/.*\(-p\|--port\)[ =]\([0-9][0-9]*\).*/\2/p')
  [ -n "$pa" ] && ports="$ports $pa"
done
ports=$(printf '%s\n' $ports | sort -un | tr '\n' ' ')

# what is about to be stopped, read BEFORE the signal (A-46.6: the floor prints what it killed)
killed=""
for p in $cands; do killed="${killed} · KILLED pid $p in $(cwd_of "$p" || true): $(ps -o args= -p "$p" 2>/dev/null | cut -c1-100)"; done
kill -TERM $tree 2>/dev/null || true
for _ in $(seq 1 20); do
  alive=""; for p in $tree; do kill -0 "$p" 2>/dev/null && alive="$alive $p"; done
  [ -n "$alive" ] || break
  sleep 1
done
alive=""; for p in $tree; do kill -0 "$p" 2>/dev/null && alive="$alive $p"; done
[ -z "$alive" ] || { kill -KILL $alive 2>/dev/null || true; sleep 1; }

if [ "$scope" = any ]; then
  echo "REAPED (before the floor, A-46.6): a next dev was running before the first member (pids ${cands% }; ports ${ports:-unknown}); stopped, whole tree${killed}"
else
  echo "LEAK: ${member} left a next dev running in the root (pids ${cands% }; ports ${ports:-unknown}); stopped, whole tree"
fi
exit 0
