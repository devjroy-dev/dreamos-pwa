#!/usr/bin/env python3
# Piece 5-A - the breathing blob. Rewrites TypingDots into dreamai's ember dot +
# Saturn ring, themed via useT (ember/oxblood/brass per room). One file, idempotent.
import base64, sys, os
PATH = "components/vendor/TypingDots.tsx"
def d(s): return base64.b64decode(s).decode("utf-8")
EDITS = [
    ("TypingDots -> breathing blob", "J3VzZSBjbGllbnQnOwovLyBUeXBpbmdEb3RzIOKAlCBBdGVsaWVyIHJlYnVpbGQKLy8gVGhyZWUgYnJhc3MgZG90cyB0aGF0IHB1bHNlIGdlbnRseSDigJQgbGlrZSBhIGZvdW50YWluIHBlbiB0YXAtdGFwLXRhcHBpbmcKLy8gb24gYSBzaGVldCBvZiBwYXBlciBiZWZvcmUgdGhlIG5leHQgc2VudGVuY2UuCgpleHBvcnQgZnVuY3Rpb24gVHlwaW5nRG90cygpIHsKICByZXR1cm4gKAogICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogNiwgYWxpZ25JdGVtczogJ2NlbnRlcicsIHBhZGRpbmc6ICc0cHggMnB4JyB9fT4KICAgICAge1swLCAxLCAyXS5tYXAoaSA9PiAoCiAgICAgICAgPHNwYW4KICAgICAgICAgIGtleT17aX0KICAgICAgICAgIHN0eWxlPXt7CiAgICAgICAgICAgIHdpZHRoOiA1LCBoZWlnaHQ6IDUsIGJvcmRlclJhZGl1czogJzUwJScsCiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNDOUE4NEMnLAogICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywKICAgICAgICAgICAgYW5pbWF0aW9uOiBgYXRlbGllclR5cGluZyAxLjRzIGVhc2UtaW4tb3V0ICR7aSAqIDAuMTh9cyBpbmZpbml0ZWAsCiAgICAgICAgICAgIG9wYWNpdHk6IDAuMzUsCiAgICAgICAgICB9fQogICAgICAgIC8+CiAgICAgICkpfQogICAgICA8c3R5bGU+e2AKICAgICAgICBAa2V5ZnJhbWVzIGF0ZWxpZXJUeXBpbmcgewogICAgICAgICAgMCUsIDEwMCUgeyBvcGFjaXR5OiAwLjI7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTsgfQogICAgICAgICAgNTAlIHsgb3BhY2l0eTogMC45NTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zcHgpOyB9CiAgICAgICAgfQogICAgICBgfTwvc3R5bGU+CiAgICA8L2Rpdj4KICApOwp9Cg==", "J3VzZSBjbGllbnQnOwovLyBUeXBpbmdEb3RzIOKAlCBNeXJhJ3MgInRoaW5raW5nIiBtYXJrIHdoaWxlIHNoZSBzdHJlYW1zLgovLyBQb3J0ZWQgZnJvbSBkcmVhbWFpJ3MgZG9vcjogYSBzaW5nbGUgYnJlYXRoaW5nIGVtYmVyIGRvdCB3aXRoIGEgdGhpbiwgdGlsdGVkCi8vIFNhdHVybiByaW5nLiBDb2xvdXIgZm9sbG93cyB0aGUgYWN0aXZlIHRoZW1lIChlbWJlciBpbiBGbGFpciwgb3hibG9vZCBpbiBsaWdodCwKLy8gYnJhc3MgaW4gZGFyayksIHNvIHRoZSBsaXZpbmcgbWFyayBzaXRzIHJpZ2h0IGluIGV2ZXJ5IHJvb20uCmltcG9ydCB7IHVzZVQgfSBmcm9tICdAL2xpYi92ZW5kb3IvVGhlbWVDb250ZXh0JzsKCmV4cG9ydCBmdW5jdGlvbiBUeXBpbmdEb3RzKCkgewogIGNvbnN0IFQgPSB1c2VUKCk7CiAgY29uc3QgZW1iZXIgPSBULmFjY2VudDsKICBjb25zdCBlbWJlclNvZnQgPSBULmJyYXNzU29mdDsKICByZXR1cm4gKAogICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBwYWRkaW5nOiAnNnB4IDJweCA2cHggNHB4JyB9fT4KICAgICAgPHNwYW4KICAgICAgICBzdHlsZT17ewogICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLAogICAgICAgICAgd2lkdGg6IDExLCBoZWlnaHQ6IDExLCBib3JkZXJSYWRpdXM6ICc1MCUnLAogICAgICAgICAgYmFja2dyb3VuZDogZW1iZXIsCiAgICAgICAgICBib3hTaGFkb3c6IGAwIDAgMTJweCAzcHggJHtlbWJlclNvZnR9YCwKICAgICAgICAgIGFuaW1hdGlvbjogJ3Rkd0Jsb2IgMi40cyBlYXNlLWluLW91dCBpbmZpbml0ZScsCiAgICAgICAgfX0KICAgICAgPgogICAgICAgIDxzcGFuCiAgICAgICAgICBzdHlsZT17ewogICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogJzUwJScsIHRvcDogJzUwJScsCiAgICAgICAgICAgIHdpZHRoOiAyNCwgaGVpZ2h0OiA5LAogICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTUwJSwtNTAlKSByb3RhdGUoLTE4ZGVnKScsCiAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke2VtYmVyU29mdH1gLCBib3JkZXJSYWRpdXM6ICc1MCUnLAogICAgICAgICAgICBvcGFjaXR5OiAwLjcsCiAgICAgICAgICAgIGFuaW1hdGlvbjogJ3Rkd1JpbmcgMi40cyBlYXNlLWluLW91dCBpbmZpbml0ZScsCiAgICAgICAgICB9fQogICAgICAgIC8+CiAgICAgIDwvc3Bhbj4KICAgICAgPHN0eWxlPntgCiAgICAgICAgQGtleWZyYW1lcyB0ZHdCbG9iIHsKICAgICAgICAgIDAlLCAxMDAlIHsgb3BhY2l0eTogLjY7IGJveC1zaGFkb3c6IDAgMCA5cHggMnB4ICR7ZW1iZXJTb2Z0fTsgdHJhbnNmb3JtOiBzY2FsZSguOTIpOyB9CiAgICAgICAgICA1MCUgICAgICB7IG9wYWNpdHk6IDE7ICBib3gtc2hhZG93OiAwIDAgMThweCA1cHggJHtlbWJlclNvZnR9OyB0cmFuc2Zvcm06IHNjYWxlKDEuMDgpOyB9CiAgICAgICAgfQogICAgICAgIEBrZXlmcmFtZXMgdGR3UmluZyB7CiAgICAgICAgICAwJSwgMTAwJSB7IG9wYWNpdHk6IC40NTsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwtNTAlKSByb3RhdGUoLTE4ZGVnKSBzY2FsZSguOTYpOyB9CiAgICAgICAgICA1MCUgICAgICB7IG9wYWNpdHk6IC44NTsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwtNTAlKSByb3RhdGUoLTE4ZGVnKSBzY2FsZSgxLjA1KTsgfQogICAgICAgIH0KICAgICAgYH08L3N0eWxlPgogICAgPC9kaXY+CiAgKTsKfQo=")
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
  ("blob dot + ring",        "tdwBlob" in text and "tdwRing" in text),
  ("themed via useT",        "const T = useT();" in text and "T.accent" in text and "T.brassSoft" in text),
  ("Saturn ring tilt",       "rotate(-18deg)" in text),
  ("old three-dots gone",    "atelierTyping" not in text),
  ("export name unchanged",  "export function TypingDots()" in text),
]
print(chr(10) + "-- verification --")
allok = True
for n,p in checks: print("  %s %s" % ("PASS" if p else "FAIL", n)); allok = allok and p
print(chr(10) + "(%d applied, %d skipped)" % (applied, skipped))
print("ALL CHECKS PASSED" if allok else "SOME CHECKS FAILED")
sys.exit(0 if allok else 2)
