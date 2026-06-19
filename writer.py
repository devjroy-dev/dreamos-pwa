#!/usr/bin/env python3
# Piece 5-C - Myra's prose renders properly. Ports dreamai's desk renderer
# (paragraphs + **bold**), adapted: list rendering + Rs amounts auto-emphasised in
# the theme accent. Hand-rolled, no dependency. Replaces the plain <p>{text}</p>.
import base64, sys, os
PATH = "components/vendor/MessageBubble.tsx"
def d(s): return base64.b64decode(s).decode("utf-8")
EDITS = [
    ("import ReactNode", "aW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7", "aW1wb3J0IHsgdXNlU3RhdGUsIHR5cGUgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnOw=="),
    ("insert prose renderer", "ZnVuY3Rpb24gQWlNZXNzYWdlVGV4dCh7IHRleHQsIHN0cmVhbWluZywgVCwgRiB9Og==", "Ly8g4pSA4pSAIE15cmEncyBwcm9zZSByZW5kZXJlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKLy8gUG9ydGVkIGZyb20gZHJlYW1haSdzIGRlc2sgcmVuZGVyZXIgKHBhcmFncmFwaHMgKyAqKmJvbGQqKiksIGFkYXB0ZWQgZm9yIE15cmE6Ci8vIGFkZHMgbGlzdCByZW5kZXJpbmcgYW5kIGF1dG8tZW1waGFzaXMgb2YgUnMgYW1vdW50cyBpbiB0aGUgdGhlbWUgYWNjZW50LgovLyBObyBkZXBlbmRlbmN5IOKAlCBhIHNtYWxsIGhhbmQtcm9sbGVkIGlubGluZSBwYXJzZXIsIGV4YWN0bHkgaG93IGRyZWFtYWkgZGlkIGl0Lgp0eXBlIFRvayA9IFJldHVyblR5cGU8dHlwZW9mIGltcG9ydCgnQC9saWIvdmVuZG9yL1RoZW1lQ29udGV4dCcpLnVzZVQ+OwoKLy8gSW5saW5lOiAqKmJvbGQqKiBzcGFucywgYW5kIGluc2lkZSBhbnkgcnVuLCBScyBhbW91bnRzIGdldCB0aGUgYWNjZW50IGNvbG91ci4KZnVuY3Rpb24gZW1waGFzaXplUnMoc2VnOiBzdHJpbmcsIFQ6IFRvaywgc2FsdDogc3RyaW5nKTogUmVhY3ROb2RlW10gewogIC8vIG1hdGNoZXM6IFJzIDEsMDAsMDAwICAvICBScyA3NTAwMCAgLyAgUnMgMi41NSBsYWtoICAvICBScyAxLjIgY3IKICBjb25zdCBwYXJ0cyA9IHNlZy5zcGxpdCgvKFJzXC4/XHM/W1xkLF0rKD86XC5cZCspPyg/OlxzPyg/Omxha2h8Y3J8Y3JvcmV8aykpPykvZ2kpOwogIHJldHVybiBwYXJ0cy5tYXAoKHAsIGkpID0+IHsKICAgIGlmICgvXlJzXC4/XHM/W1xkLF0vaS50ZXN0KHApKSB7CiAgICAgIHJldHVybiA8c3BhbiBrZXk9e2Ake3NhbHR9ciR7aX1gfSBzdHlsZT17eyBjb2xvcjogVC5hY2NlbnQsIGZvbnRTdHlsZTogJ25vcm1hbCcsIGZvbnRXZWlnaHQ6IDUwMCB9fT57cH08L3NwYW4+OwogICAgfQogICAgcmV0dXJuIDxzcGFuIGtleT17YCR7c2FsdH1uJHtpfWB9PntwfTwvc3Bhbj47CiAgfSk7Cn0KZnVuY3Rpb24gaW5saW5lTm9kZXModGV4dDogc3RyaW5nLCBUOiBUb2ssIHNhbHQ6IHN0cmluZyk6IFJlYWN0Tm9kZVtdIHsKICBjb25zdCBvdXQ6IFJlYWN0Tm9kZVtdID0gW107CiAgY29uc3QgcmUgPSAvXCpcKiguKz8pXCpcKi9nOwogIGxldCBsYXN0ID0gMDsgbGV0IG06IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7IGxldCBrID0gMDsKICB3aGlsZSAoKG0gPSByZS5leGVjKHRleHQpKSAhPT0gbnVsbCkgewogICAgaWYgKG0uaW5kZXggPiBsYXN0KSBvdXQucHVzaCg8c3BhbiBrZXk9e2Ake3NhbHR9dCR7aysrfWB9PntlbXBoYXNpemVScyh0ZXh0LnNsaWNlKGxhc3QsIG0uaW5kZXgpLCBULCBgJHtzYWx0fSR7a31gKX08L3NwYW4+KTsKICAgIG91dC5wdXNoKDxzdHJvbmcga2V5PXtgJHtzYWx0fWIke2srK31gfSBzdHlsZT17eyBmb250U3R5bGU6ICdub3JtYWwnLCBmb250V2VpZ2h0OiA2MDAgfX0+e2VtcGhhc2l6ZVJzKG1bMV0sIFQsIGAke3NhbHR9JHtrfWApfTwvc3Ryb25nPik7CiAgICBsYXN0ID0gcmUubGFzdEluZGV4OwogIH0KICBpZiAobGFzdCA8IHRleHQubGVuZ3RoKSBvdXQucHVzaCg8c3BhbiBrZXk9e2Ake3NhbHR9dCR7aysrfWB9PntlbXBoYXNpemVScyh0ZXh0LnNsaWNlKGxhc3QpLCBULCBgJHtzYWx0fSR7a31gKX08L3NwYW4+KTsKICByZXR1cm4gb3V0Owp9Ci8vIEJsb2NrOiBzcGxpdCBvbiBibGFuayBsaW5lczsgYSBydW4gb2YgJy0nLyfigKInIGxpbmVzIGJlY29tZXMgYSBidWxsZXRlZCBsaXN0LgpmdW5jdGlvbiByZW5kZXJQcm9zZSh0ZXh0OiBzdHJpbmcsIFQ6IFRvaywgRjogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFJlYWN0Tm9kZVtdIHsKICBjb25zdCBwU3R5bGUgPSB7CiAgICBmb250RmFtaWx5OiBGLnNjcmlwdCwgZm9udFN0eWxlOiAnaXRhbGljJyBhcyBjb25zdCwgZm9udFdlaWdodDogNDAwLAogICAgZm9udFNpemU6IDE4LCBjb2xvcjogVC5pbmssIGxpbmVIZWlnaHQ6IDEuNDIsIGxldHRlclNwYWNpbmc6ICcwLjAwNWVtJywKICAgIG1hcmdpbjogMCwgd2hpdGVTcGFjZTogJ3ByZS13cmFwJyBhcyBjb25zdCwKICB9OwogIGNvbnN0IGJsb2NrcyA9ICh0ZXh0IHx8ICcnKS5zcGxpdCgvXG5cbisvKTsKICBjb25zdCBvdXQ6IFJlYWN0Tm9kZVtdID0gW107CiAgYmxvY2tzLmZvckVhY2goKGJsb2NrLCBiaSkgPT4gewogICAgY29uc3QgbGluZXMgPSBibG9jay5zcGxpdCgnXG4nKTsKICAgIGNvbnN0IGlzTGlzdCA9IGxpbmVzLmxlbmd0aCA+IDAgJiYgbGluZXMuZXZlcnkoKGwpID0+IC9eXHMqWy3igKJdXHMrLy50ZXN0KGwpIHx8IGwudHJpbSgpID09PSAnJyk7CiAgICBpZiAoaXNMaXN0KSB7CiAgICAgIGNvbnN0IGl0ZW1zID0gbGluZXMuZmlsdGVyKChsKSA9PiAvXlxzKlst4oCiXVxzKy8udGVzdChsKSkubWFwKChsKSA9PiBsLnJlcGxhY2UoL15ccypbLeKAol1ccysvLCAnJykpOwogICAgICBvdXQucHVzaCgKICAgICAgICA8dWwga2V5PXtgdWwke2JpfWB9IHN0eWxlPXt7IC4uLnBTdHlsZSwgbWFyZ2luOiAwLCBwYWRkaW5nTGVmdDogMTgsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogNCB9fT4KICAgICAgICAgIHtpdGVtcy5tYXAoKGl0LCBpaSkgPT4gKAogICAgICAgICAgICA8bGkga2V5PXtgbGkke2JpfS0ke2lpfWB9IHN0eWxlPXt7IGxpc3RTdHlsZVR5cGU6ICdkaXNjJyB9fT57aW5saW5lTm9kZXMoaXQsIFQsIGAke2JpfS0ke2lpfS1gKX08L2xpPgogICAgICAgICAgKSl9CiAgICAgICAgPC91bD4KICAgICAgKTsKICAgIH0gZWxzZSB7CiAgICAgIG91dC5wdXNoKDxwIGtleT17YHAke2JpfWB9IHN0eWxlPXtwU3R5bGV9PntpbmxpbmVOb2RlcyhibG9jaywgVCwgYCR7Yml9LWApfTwvcD4pOwogICAgfQogIH0pOwogIHJldHVybiBvdXQ7Cn0KCmZ1bmN0aW9uIEFpTWVzc2FnZVRleHQoeyB0ZXh0LCBzdHJlYW1pbmcsIFQsIEYgfTo="),
    ("render prose not plain text", "ICByZXR1cm4gKAogICAgPD4KICAgICAgPHAgc3R5bGU9e3sKICAgICAgICBmb250RmFtaWx5OiBGLnNjcmlwdCwgZm9udFN0eWxlOiAnaXRhbGljJywgZm9udFdlaWdodDogNDAwLAogICAgICAgIGZvbnRTaXplOiAxOCwgY29sb3I6IFQuaW5rLCBsaW5lSGVpZ2h0OiAxLjQyLAogICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjAwNWVtJywgbWFyZ2luOiAwLCB3aGl0ZVNwYWNlOiAncHJlLXdyYXAnLAogICAgICB9fT57dGV4dH08L3A+", "ICByZXR1cm4gKAogICAgPD4KICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6IDggfX0+CiAgICAgICAge3JlbmRlclByb3NlKHRleHQsIFQsIEYpfQogICAgICA8L2Rpdj4=")
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
  ("ReactNode imported",      "type ReactNode } from 'react'" in text),
  ("renderProse defined",     "function renderProse(" in text),
  ("bold via <strong>",       "<strong key={`${salt}b" in text),
  ("list rendering",          "const isList =" in text and "<ul key=" in text),
  ("Rs auto-emphasis",        "function emphasizeRs(" in text and "color: T.accent" in text),
  ("renderer wired in",       "{renderProse(text, T, F)}" in text),
  ("plain <p>{text}</p> gone", ">{text}</p>" not in text),
]
print(chr(10) + "-- verification --")
allok = True
for n,p in checks: print("  %s %s" % ("PASS" if p else "FAIL", n)); allok = allok and p
print(chr(10) + "(%d applied, %d skipped)" % (applied, skipped))
print("ALL CHECKS PASSED" if allok else "SOME CHECKS FAILED")
sys.exit(0 if allok else 2)
