#!/usr/bin/env python3
# Piece 5-D.3 - muted-grey left spine on the operator's deliberation beats (the desk
# turn-grammar): the operator's work reads beneath a quiet recessive line, visually
# set apart from Myra's reply (which keeps its brass hairline, untouched). One file.
import base64, sys, os
PATH = "components/vendor/ChatThread.tsx"
def d(s): return base64.b64decode(s).decode("utf-8")
EDITS = [
    ("open spined column", "ICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMCAyMnB4IDlweCAzOHB4JywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAzIH19Pg==", "ICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMCAyMnB4IDlweCAzOHB4JyB9fT4KICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7CiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6IDMsCiAgICAgICAgICAgICAgICBwYWRkaW5nTGVmdDogMTIsCiAgICAgICAgICAgICAgICBib3JkZXJMZWZ0OiBgMnB4IHNvbGlkICR7VC5pc0xpZ2h0ID8gJ3JnYmEoMjYsMTUsOCwwLjE2KScgOiAncmdiYSgyMzMsMjI4LDIxNywwLjE2KSd9YCwKICAgICAgICAgICAgICB9fT4="),
    ("close spined column", "ICAgICAgICAgICAgICB9KX0KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICApfQogICAgICAgICAgey8qIENsYXJpZnkgY2hpcHM=", "ICAgICAgICAgICAgICB9KX0KICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICApfQogICAgICAgICAgey8qIENsYXJpZnkgY2hpcHM=")
]
if not os.path.exists(PATH):
    print("FATAL: %s not found." % PATH); sys.exit(1)
text = open(PATH, encoding="utf-8").read()
applied = skipped = 0
for label, o_b64, n_b64 in EDITS:
    old, new = d(o_b64), d(n_b64)
    if new in text:
        print("SKIP  [%s] already applied." % label); skipped += 1; continue
    c = text.count(old)
    if c == 1: text = text.replace(old, new); applied += 1; print("OK    [%s]" % label)
    elif c == 0: print("SKIP  [%s] anchor NOT FOUND." % label); skipped += 1
    else: print("SKIP  [%s] anchor x%d." % (label, c)); skipped += 1
open(PATH, "w", encoding="utf-8").write(text)
# balance check: the deliberation block must still have matched divs
opens = text.count("<div")
checks = [
  ("spine border added",     "borderLeft: `2px solid" in text),
  ("inner spined column",    "paddingLeft: 12," in text),
  ("Myra brass untouched",   "background: hairline" in open("components/vendor/MessageBubble.tsx").read()),
  ("close balanced",         "              </div>\n            </div>\n          )}\n          {/* Clarify chips" in text),
]
print(chr(10) + "-- verification --")
allok = True
for n,p in checks: print("  %s %s" % ("PASS" if p else "FAIL", n)); allok = allok and p
print(chr(10) + "(%d applied, %d skipped)" % (applied, skipped))
print("ALL CHECKS PASSED" if allok else "SOME CHECKS FAILED")
sys.exit(0 if allok else 2)
