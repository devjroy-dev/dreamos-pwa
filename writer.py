#!/usr/bin/env python3
# Piece 5-A.4 - replace the over-firing "Copy draft" with a small square copy icon
# on EVERY AI message (copies the full reply). Drops the isDraft/extractDraft guess.
import base64, sys, os
PATH = "components/vendor/MessageBubble.tsx"
def d(s): return base64.b64decode(s).decode("utf-8")
EDITS = [
    ("copy full text (drop draft derivation)", "ICBjb25zdCBbY29waWVkLCBzZXRDb3BpZWRdID0gdXNlU3RhdGUoZmFsc2UpOwogIGNvbnN0IGhhc0RyYWZ0ID0gaXNEcmFmdCh0ZXh0KTsKICBjb25zdCBkcmFmdFRleHQgPSBoYXNEcmFmdCA/IGV4dHJhY3REcmFmdCh0ZXh0KSA6ICcnOwoKICBmdW5jdGlvbiBjb3B5KCkgewogICAgdHJ5IHsKICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoZHJhZnRUZXh0IHx8IHRleHQpOw==", "ICBjb25zdCBbY29waWVkLCBzZXRDb3BpZWRdID0gdXNlU3RhdGUoZmFsc2UpOwoKICBmdW5jdGlvbiBjb3B5KCkgewogICAgdHJ5IHsKICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7"),
    ("draft button -> small square copy icon", "ICAgICAge2hhc0RyYWZ0ICYmICgKICAgICAgICA8YnV0dG9uCiAgICAgICAgICB0eXBlPSJidXR0b24iCiAgICAgICAgICBvbkNsaWNrPXtjb3B5fQogICAgICAgICAgc3R5bGU9e3sKICAgICAgICAgICAgbWFyZ2luVG9wOiAxMCwKICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiA2LAogICAgICAgICAgICBwYWRkaW5nOiAnNnB4IDEycHgnLAogICAgICAgICAgICBiYWNrZ3JvdW5kOiBjb3BpZWQKICAgICAgICAgICAgICA/IFQuaXNMaWdodCA/ICdyZ2JhKDEyMiw1Niw0MCwwLjEwKScgOiAncmdiYSgyMDEsMTY4LDc2LDAuMTIpJwogICAgICAgICAgICAgIDogJ3RyYW5zcGFyZW50JywKICAgICAgICAgICAgYm9yZGVyOiBgMC41cHggc29saWQgJHtULmlzTGlnaHQgPyAncmdiYSgxMjIsNTYsNDAsMC4yOCknIDogJ3JnYmEoMjAxLDE2OCw3NiwwLjMwKSd9YCwKICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA0LCBjdXJzb3I6ICdwb2ludGVyJywKICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtam9zdCksIHN5c3RlbS11aSwgc2Fucy1zZXJpZicsCiAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDMwMCwgZm9udFNpemU6IDksCiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjIyZW0nLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyBhcyBjb25zdCwKICAgICAgICAgICAgY29sb3I6IGNvcGllZAogICAgICAgICAgICAgID8gVC5pc0xpZ2h0ID8gVC5hY2NlbnQgOiAnI0M5QTg0QycKICAgICAgICAgICAgICA6IFQuaXNMaWdodCA/IFQuaW5rTXV0ZSA6ICdyZ2JhKDI0MCwyMzAsMjEwLDAuNTApJywKICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAyMDBtcycsCiAgICAgICAgICB9fQogICAgICAgID4KICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAxMCB9fT57Y29waWVkID8gJ+KckycgOiAn4o6YJ308L3NwYW4+CiAgICAgICAgICB7Y29waWVkID8gJ0NvcGllZCcgOiAnQ29weSBkcmFmdCd9CiAgICAgICAgPC9idXR0b24+CiAgICAgICl9", "ICAgICAgPGJ1dHRvbgogICAgICAgIHR5cGU9ImJ1dHRvbiIKICAgICAgICBvbkNsaWNrPXtjb3B5fQogICAgICAgIGFyaWEtbGFiZWw9e2NvcGllZCA/ICJDb3BpZWQiIDogIkNvcHkgbWVzc2FnZSJ9CiAgICAgICAgdGl0bGU9e2NvcGllZCA/ICJDb3BpZWQiIDogIkNvcHkifQogICAgICAgIHN0eWxlPXt7CiAgICAgICAgICBtYXJnaW5Ub3A6IDgsCiAgICAgICAgICB3aWR0aDogMjQsIGhlaWdodDogMjQsIHBhZGRpbmc6IDAsCiAgICAgICAgICBkaXNwbGF5OiAiaW5saW5lLWZsZXgiLCBhbGlnbkl0ZW1zOiAiY2VudGVyIiwganVzdGlmeUNvbnRlbnQ6ICJjZW50ZXIiLAogICAgICAgICAgYmFja2dyb3VuZDogInRyYW5zcGFyZW50IiwgYm9yZGVyOiAibm9uZSIsIGN1cnNvcjogInBvaW50ZXIiLAogICAgICAgICAgY29sb3I6IGNvcGllZAogICAgICAgICAgICA/IChULmlzTGlnaHQgPyBULmFjY2VudCA6ICIjQzlBODRDIikKICAgICAgICAgICAgOiAoVC5pc0xpZ2h0ID8gVC5pbmtNdXRlIDogInJnYmEoMjQwLDIzMCwyMTAsMC40NSkiKSwKICAgICAgICAgIHRyYW5zaXRpb246ICJjb2xvciAyMDBtcyIsCiAgICAgICAgfX0KICAgICAgPgogICAgICAgIHtjb3BpZWQgPyAoCiAgICAgICAgICA8c3ZnIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMyIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlV2lkdGg9IjIuMiIgc3Ryb2tlTGluZWNhcD0icm91bmQiIHN0cm9rZUxpbmVqb2luPSJyb3VuZCIgYXJpYS1oaWRkZW4+CiAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9IjIwIDYgOSAxNyA0IDEyIiAvPgogICAgICAgICAgPC9zdmc+CiAgICAgICAgKSA6ICgKICAgICAgICAgIDxzdmcgd2lkdGg9IjEzIiBoZWlnaHQ9IjEzIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2VXaWR0aD0iMS42IiBzdHJva2VMaW5lY2FwPSJyb3VuZCIgc3Ryb2tlTGluZWpvaW49InJvdW5kIiBhcmlhLWhpZGRlbj4KICAgICAgICAgICAgPHJlY3QgeD0iOSIgeT0iOSIgd2lkdGg9IjEzIiBoZWlnaHQ9IjEzIiByeD0iMiIgcnk9IjIiIC8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik01IDE1SDRhMiAyIDAgMCAxLTItMlY0YTIgMiAwIDAgMSAyLTJoOWEyIDIgMCAwIDEgMiAydjEiIC8+CiAgICAgICAgICA8L3N2Zz4KICAgICAgICApfQogICAgICA8L2J1dHRvbj4="),
    ("remove orphaned isDraft/extractDraft", "Ly8gRGV0ZWN0cyBpZiBhbiBBSSBtZXNzYWdlIGNvbnRhaW5zIGEgZHJhZnQgcmVwbHkg4oCUIHNob3dzIGNvcHkgYnV0dG9uIGlmIHNvCmZ1bmN0aW9uIGlzRHJhZnQodGV4dDogc3RyaW5nKTogYm9vbGVhbiB7CiAgY29uc3QgbG93ZXIgPSB0ZXh0LnRvTG93ZXJDYXNlKCk7CiAgLy8gQ29udGFpbnMgY29tbW9uIGRyYWZ0IGluZGljYXRvcnMKICBpZiAoKGxvd2VyLmluY2x1ZGVzKCdkZWFyICcpIHx8IGxvd2VyLmluY2x1ZGVzKCdoaSAnKSB8fCBsb3dlci5pbmNsdWRlcygnaGVsbG8gJykpICYmIHRleHQubGVuZ3RoID4gMTIwKSByZXR1cm4gdHJ1ZTsKICBpZiAobG93ZXIuaW5jbHVkZXMoJ2hlcmVcJ3MgYSBkcmFmdCcpIHx8IGxvd2VyLmluY2x1ZGVzKCdoZXJlIGlzIGEgZHJhZnQnKSB8fCBsb3dlci5pbmNsdWRlcygnZHJhZnQgcmVwbHknKSB8fCBsb3dlci5pbmNsdWRlcygnZHJhZnQ6JykpIHJldHVybiB0cnVlOwogIGlmIChsb3dlci5pbmNsdWRlcygnc3ViamVjdDonKSB8fCBsb3dlci5pbmNsdWRlcygnd2FybSByZWdhcmRzJykgfHwgbG93ZXIuaW5jbHVkZXMoJ2Jlc3QgcmVnYXJkcycpKSByZXR1cm4gdHJ1ZTsKICByZXR1cm4gZmFsc2U7Cn0KCi8vIEV4dHJhY3QganVzdCB0aGUgZHJhZnQgdGV4dCDigJQgcmVtb3ZlIHRoZSBBSSBwcmVhbWJsZSBiZWZvcmUgdGhlIGRyYWZ0CmZ1bmN0aW9uIGV4dHJhY3REcmFmdCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcgewogIC8vIENvbW1vbiBwcmVhbWJsZSBwYXR0ZXJucwogIGNvbnN0IHBhdHRlcm5zID0gWwogICAgL2hlcmVbJ1wncyBpc10rICg/OmEgfHRoZSApP2RyYWZ0Wzpcbl0rL2ksCiAgICAvZHJhZnRbOlxuXSsvaSwKICAgIC9yZXBseVs6XG5dKy9pLAogIF07CiAgZm9yIChjb25zdCBwIG9mIHBhdHRlcm5zKSB7CiAgICBjb25zdCBtYXRjaCA9IHRleHQubWF0Y2gocCk7CiAgICBpZiAobWF0Y2ggJiYgbWF0Y2guaW5kZXggIT09IHVuZGVmaW5lZCkgewogICAgICByZXR1cm4gdGV4dC5zbGljZShtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCkudHJpbSgpOwogICAgfQogIH0KICByZXR1cm4gdGV4dDsKfQ==", "Ly8gKERyYWZ0LWd1ZXNzaW5nIHJlbW92ZWQg4oCUIGEgcGxhaW4gQ29weSBub3cgbGl2ZXMgb24gZXZlcnkgQUkgbWVzc2FnZS4p")
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
  ("copies full text",        "navigator.clipboard.writeText(text);" in text),
  ("square copy icon present","<rect x=\"9\" y=\"9\"" in text),
  ("check-on-copied",         "<polyline points=\"20 6 9 17 4 12\"" in text),
  ("no hasDraft gate",        "hasDraft" not in text),
  ("isDraft removed",         "function isDraft(" not in text),
  ("extractDraft removed",    "function extractDraft(" not in text),
  ("no 'Copy draft' label",   "Copy draft" not in text),
]
print(chr(10) + "-- verification --")
allok = True
for n,p in checks: print("  %s %s" % ("PASS" if p else "FAIL", n)); allok = allok and p
print(chr(10) + "(%d applied, %d skipped)" % (applied, skipped))
print("ALL CHECKS PASSED" if allok else "SOME CHECKS FAILED")
sys.exit(0 if allok else 2)
