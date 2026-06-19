#!/usr/bin/env python3
# Piece 5-A.3 - remove the auto-briefing. No templated "You have ... today" message
# injected on load; the thread seeds with real transcript only, Myra speaks when asked.
# One file, idempotent. (buildBriefing stays defined but unused — harmless.)
import base64, sys, os
PATH = "hooks/vendor/useChat.ts"
def d(s): return base64.b64decode(s).decode("utf-8")
EDITS = [
    ("hooks/vendor/useChat.ts", "drop buildBriefing import", "aW1wb3J0IHsgYnVpbGRCcmllZmluZyB9IGZyb20gJ0AvbGliL3ZlbmRvci9icmllZmluZyc7Cg==", ""),
    ("hooks/vendor/useChat.ts", "remove briefing injection", "ICAgICAgICBzZXRDb250ZXh0KGN0eCk7CiAgICAgICAgY29uc3QgYnJpZWZpbmcgPSBidWlsZEJyaWVmaW5nKGN0eCk7CgogICAgICAgIC8vIEZldGNoIHJlY2VudCB0cmFuc2NyaXB0IChiZXN0LWVmZm9ydDsgbmV2ZXIgYmxvY2tzIHRoZSBicmllZmluZykuCiAgICAgICAgbGV0IGhpc3Rvcnk6IENoYXRNZXNzYWdlW10gPSBbXTsKICAgICAgICB0cnkgewogICAgICAgICAgY29uc3QgaCA9IGF3YWl0IGZldGNoQ2hhdEhpc3RvcnkodmVuZG9ySWQsIDEwKTsKICAgICAgICAgIGlmICghY2FuY2VsbGVkICYmIGgub2sgJiYgQXJyYXkuaXNBcnJheShoLm1lc3NhZ2VzKSkgewogICAgICAgICAgICBoaXN0b3J5ID0gaC5tZXNzYWdlcy5tYXAobSA9PiAoeyBpZDogbS5pZCwgcm9sZTogbS5yb2xlLCB0ZXh0OiBtLnRleHQgfSkpOwogICAgICAgICAgfQogICAgICAgIH0gY2F0Y2gge30KICAgICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47CgogICAgICAgIHNldE1lc3NhZ2VzKChwcmV2OiBDaGF0TWVzc2FnZVtdKSA9PiB7CiAgICAgICAgICBpZiAocHJldi5sZW5ndGggPiAwKSByZXR1cm4gcHJldjsgIC8vIHVzZXIgYWxyZWFkeSBzdGFydGVkIHR5cGluZwogICAgICAgICAgY29uc3Qgc2VlZDogQ2hhdE1lc3NhZ2VbXSA9IFsuLi5oaXN0b3J5XTsKICAgICAgICAgIC8vIEFwcGVuZCB0aGUgYnJpZWZpbmcgb25seSBpZiBpdCBpc24ndCBhbHJlYWR5IHRoZSBsYXN0IHRoaW5nIHNhaWQuCiAgICAgICAgICBpZiAoYnJpZWZpbmcpIHsKICAgICAgICAgICAgY29uc3QgbGFzdFRleHQgPSBoaXN0b3J5Lmxlbmd0aCA/IGhpc3RvcnlbaGlzdG9yeS5sZW5ndGggLSAxXS50ZXh0IDogJyc7CiAgICAgICAgICAgIGlmIChsYXN0VGV4dCAhPT0gYnJpZWZpbmcpIHNlZWQucHVzaCh7IGlkOiAnYnJpZWZpbmcnLCByb2xlOiAnYWknLCB0ZXh0OiBicmllZmluZyB9KTsKICAgICAgICAgIH0KICAgICAgICAgIHJldHVybiBzZWVkOwogICAgICAgIH0pOw==", "ICAgICAgICBzZXRDb250ZXh0KGN0eCk7CgogICAgICAgIC8vIFNlZWQgdGhlIHRocmVhZCB3aXRoIHJlY2VudCB0cmFuc2NyaXB0IG9ubHkgKGJlc3QtZWZmb3J0KS4gTm8gYXV0by0KICAgICAgICAvLyBicmllZmluZyDigJQgTXlyYSBzcGVha3Mgd2hlbiB0aGUgb3duZXIgYXNrcywgbm90aGluZyBpbmplY3RlZCB1bnByb21wdGVkLgogICAgICAgIGxldCBoaXN0b3J5OiBDaGF0TWVzc2FnZVtdID0gW107CiAgICAgICAgdHJ5IHsKICAgICAgICAgIGNvbnN0IGggPSBhd2FpdCBmZXRjaENoYXRIaXN0b3J5KHZlbmRvcklkLCAxMCk7CiAgICAgICAgICBpZiAoIWNhbmNlbGxlZCAmJiBoLm9rICYmIEFycmF5LmlzQXJyYXkoaC5tZXNzYWdlcykpIHsKICAgICAgICAgICAgaGlzdG9yeSA9IGgubWVzc2FnZXMubWFwKG0gPT4gKHsgaWQ6IG0uaWQsIHJvbGU6IG0ucm9sZSwgdGV4dDogbS50ZXh0IH0pKTsKICAgICAgICAgIH0KICAgICAgICB9IGNhdGNoIHt9CiAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuOwoKICAgICAgICBzZXRNZXNzYWdlcygocHJldjogQ2hhdE1lc3NhZ2VbXSkgPT4gewogICAgICAgICAgaWYgKHByZXYubGVuZ3RoID4gMCkgcmV0dXJuIHByZXY7ICAvLyB1c2VyIGFscmVhZHkgc3RhcnRlZCB0eXBpbmcKICAgICAgICAgIHJldHVybiBbLi4uaGlzdG9yeV07CiAgICAgICAgfSk7")
]
if not os.path.exists(PATH):
    print("FATAL: %s not found." % PATH); sys.exit(1)
text = open(PATH, encoding="utf-8").read()
applied = skipped = 0
for path, label, o_b64, n_b64 in EDITS:
    old, new = d(o_b64), d(n_b64)
    if (new and new in text) or (not new and old not in text):
        print("SKIP  [%s] already applied." % label); skipped += 1; continue
    c = text.count(old)
    if c == 1: text = text.replace(old, new); applied += 1; print("OK    [%s]" % label)
    elif c == 0: print("SKIP  [%s] anchor NOT FOUND." % label); skipped += 1
    else: print("SKIP  [%s] anchor x%d." % (label, c)); skipped += 1
open(PATH, "w", encoding="utf-8").write(text)
checks = [
  ("buildBriefing no longer called", "buildBriefing(ctx)" not in text),
  ("briefing import gone",           "import { buildBriefing }" not in text),
  ("no briefing seed push",          "id: 'briefing'" not in text),
  ("history seeding retained",       "fetchChatHistory(vendorId, 10)" in text and "return [...history];" in text),
]
print(chr(10) + "-- verification --")
allok = True
for n,p in checks: print("  %s %s" % ("PASS" if p else "FAIL", n)); allok = allok and p
print(chr(10) + "(%d applied, %d skipped)" % (applied, skipped))
print("ALL CHECKS PASSED" if allok else "SOME CHECKS FAILED")
sys.exit(0 if allok else 2)
