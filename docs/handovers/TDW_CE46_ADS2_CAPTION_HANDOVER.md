# TDW · CE-46 · ADS-2 · THE CAPTION BOX AND b143 HARDENED · dreamos-pwa · 29 September 2026

Base 98edc7e8 (built on 545251ee and carried; WEB-1 cut 3 landed between, none of its paths are these).

## The caption box (R-46.17, the founder's words through the chair)
On /vendor/posts, Cards: the caption sits in its own box, [data-caption-box], holding only the caption ([data-caption])
and its one control ([data-copy]). The control reads "Copy"; a tap writes exactly body.caption to the clipboard, and
only once the clipboard has taken it the control reads "Copied" for two seconds, then "Copy" again. If the clipboard
refuses, it stays "Copy" and the caption is on screen to select. "Caption", Download and Share stay outside the box;
"Copy caption" is retired (lib/worklist/posts.ts: copy 'Copy', copied 'Copied'; b74 C6 pins them).

## b143 hardened (the chair's rulings, 29 September 2026)
- THE STOP: one stop on every exit path (success, a red, a crash, SIGINT, SIGTERM, SIGHUP): the browser closed, then
  stopTree (scripts/lib/stop_tree.js) on chromium and on `next dev`, waited. 7.2 reads the process table: nothing of
  this run is left. The shared b126_dev_server.js is untouched (b126 uses it too).
- THE ROOM ON GLASS: open() reports whether its selector appeared and after how long. 1.0 waits up to 180 s for the
  Ads room with its state (the cold compile). An absent room is a named red and a clean stop, rc 1, never a TypeError.
  Every glass read guards for an absent element (null satisfies nothing; leaves() of an absent root is a red).
  M9 removes .ads-room: 1.0 reds under it.
- THE TALLY: a FAIL line is printed only where it is counted. Under a mutation a red cell prints "red under Mn" (its
  evidence). A crash under a mutation is its own counted FAIL, never that mutation's red. 9.1 checks printed FAILs
  against the count; 9.2 runs the self-test (B143_SELFTEST) in a child; M10 (ok() skips the count) and M11 (a crash
  counts as red) each run as a temp copy of the bench, removed after, and must red the self-test.
- 10.1 to 10.4, the caption box, both themes; M12 moves Copy out of the box.

## Proofs (ADS-2's container, 29 September 2026)
Cured whole: b143 100 pass, 0 fail, no FAIL line printed. Cured bench on the uncured page: exactly 10.1 to 10.4 red
in both themes (80/8). Today's b143 under M9: rc 2, TypeError at .includes (the founder's floor). Cured under M9: 1.0
a named red, rc 1, 7.1 and 7.2 pass. SIGTERM, SIGINT, SIGHUP with next and chromium up: rc 143, 130, 129, nothing
left. The server never up (port held): 0.1 red, rc 1, nothing left. A crash after the server is up: a named FAIL,
rc 1, 7.1 and 7.2 pass. The tree checked clean after every run.
