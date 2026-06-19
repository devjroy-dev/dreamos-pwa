#!/usr/bin/env python3
# Piece 5-D.1 - auto-scroll follows Myra's reply as it streams. The streaming bubble
# grows by mutating the last message's text (messages.length is constant), so the old
# [messages.length] dep never re-fired mid-stream. Now keyed on the tail's text length
# too, and gated on "user is near the bottom" so reading history isn't interrupted.
import base64, sys, os
PATH = "components/vendor/ChatThread.tsx"
def d(s): return base64.b64decode(s).decode("utf-8")
EDITS = [
    ("scroll follows the stream", "ICAvLyBBdXRvLXNjcm9sbCB0byBib3R0b20gb24gbmV3IG1lc3NhZ2VzCiAgdXNlRWZmZWN0KCgpID0+IHsKICAgIGJvdHRvbVJlZi5jdXJyZW50Py5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJyB9KTsKICB9LCBbbWVzc2FnZXMubGVuZ3RoXSk7", "ICAvLyBUaGUgc3RyZWFtaW5nIHJlcGx5IGdyb3dzIGJ5IG11dGF0aW5nIHRoZSBMQVNUIG1lc3NhZ2UncyB0ZXh0IChjb3VudCBzdGF5cwogIC8vIGNvbnN0YW50KSwgc28gd2UgYWxzbyBrZXkgdGhlIHNjcm9sbCBvbiB0aGUgdGFpbCdzIGxlbmd0aC4gQW5kIHdlIG9ubHkgZm9sbG93CiAgLy8gd2hlbiB0aGUgdXNlciBpcyBhbHJlYWR5IG5lYXIgdGhlIGJvdHRvbSDigJQgaWYgdGhleSd2ZSBzY3JvbGxlZCB1cCB0byByZWFkCiAgLy8gaGlzdG9yeSwgd2UgbGVhdmUgdGhlbSBiZSByYXRoZXIgdGhhbiB5YW5raW5nIHRoZW0gYmFjayBkb3duIG1pZC1zdHJlYW0uCiAgY29uc3QgdGFpbCA9IG1lc3NhZ2VzW21lc3NhZ2VzLmxlbmd0aCAtIDFdOwogIGNvbnN0IHRhaWxMZW4gPSB0YWlsID8gdGFpbC50ZXh0Lmxlbmd0aCA6IDA7CiAgdXNlRWZmZWN0KCgpID0+IHsKICAgIGNvbnN0IGMgPSBjb250YWluZXJSZWYuY3VycmVudDsKICAgIGlmIChjKSB7CiAgICAgIGNvbnN0IG5lYXJCb3R0b20gPSBjLnNjcm9sbEhlaWdodCAtIGMuc2Nyb2xsVG9wIC0gYy5jbGllbnRIZWlnaHQgPCAxMjA7CiAgICAgIGlmICghbmVhckJvdHRvbSkgcmV0dXJuOyAgLy8gdXNlciBpcyByZWFkaW5nIGhpZ2hlciB1cCDigJQgZG9uJ3QgaW50ZXJydXB0CiAgICB9CiAgICBib3R0b21SZWYuY3VycmVudD8uc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogJ3Ntb290aCcgfSk7CiAgfSwgW21lc3NhZ2VzLmxlbmd0aCwgdGFpbExlbl0pOw==")
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
checks = [
  ("keyed on tail length",   "}, [messages.length, tailLen]);" in text),
  ("tail length computed",   "const tailLen = tail ? tail.text.length : 0;" in text),
  ("near-bottom gate",       "nearBottom = c.scrollHeight - c.scrollTop - c.clientHeight < 120" in text),
  ("old single-dep gone",    "}, [messages.length]);" not in text),
]
print(chr(10) + "-- verification --")
allok = True
for n,p in checks: print("  %s %s" % ("PASS" if p else "FAIL", n)); allok = allok and p
print(chr(10) + "(%d applied, %d skipped)" % (applied, skipped))
print("ALL CHECKS PASSED" if allok else "SOME CHECKS FAILED")
sys.exit(0 if allok else 2)
