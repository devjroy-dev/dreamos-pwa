#!/usr/bin/env python3
# Fix - tap-to-edit resolves INLINE (direct form write), never through the AI.
# A deliberate edit the owner taps is unambiguous; routing it through Myra let a
# stale chat subject win and edit the wrong record. Now: list + calendar tap-edit
# open the form (direct updateEvent etc.); the AI-primer EDIT injection is removed.
# (Add-via-chat and the chat-typed edit path are untouched — those stay.)
import base64, sys, os
def d(s): return base64.b64decode(s).decode("utf-8")
EDITS = [
    ("app/vendor/list/[slice]/page.tsx", "list: drop onEdit riddle line", "ICBmdW5jdGlvbiBvbkVkaXQocm93OiBSb3cpIHsgc2V0U2VsKG51bGwpOyByb3V0ZXIucHVzaChgL3dlZGRpbmc/YWlQcmltZXI9JHtlbmNvZGVVUklDb21wb25lbnQocm93LmFpUHJpbWVyKX1gKTsgfQo=", ""),
    ("app/vendor/list/[slice]/page.tsx", "list: drop setEditPrimer line", "ICAgIHNldEVkaXRQcmltZXIocm93LmFpUHJpbWVyKTsK", ""),
    ("app/vendor/list/[slice]/page.tsx", "list: remove riddle Edit button", "ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBvbkNsaWNrPXsoKSA9PiBzZWwgJiYgb25FZGl0KHNlbCl9IHN0eWxlPXt7CiAgICAgICAgICAgICAgICAgIGZsZXg6IDEsIHBhZGRpbmc6ICcxMnB4IDE2cHgnLCBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLAogICAgICAgICAgICAgICAgICBib3JkZXI6ICcwLjVweCBzb2xpZCB2YXIoLS1hdGVsaWVyLXNoZWV0LWJvcmRlciknLCBib3JkZXJSYWRpdXM6IDIsIGN1cnNvcjogJ3BvaW50ZXInLAogICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBGLmxhYmVsLCBmb250V2VpZ2h0OiAzMDAsIGZvbnRTaXplOiA5LCBjb2xvcjogQS5icmFzc1dhcm0sCiAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjMyZW0nLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywKICAgICAgICAgICAgICAgIH19PlZpYSBDaGF0PC9idXR0b24+", ""),
    ("app/vendor/list/[slice]/page.tsx", "list: drop editPrimer state", "ICBjb25zdCBbZWRpdFByaW1lciwgIHNldEVkaXRQcmltZXJdICA9IHVzZVN0YXRlPHN0cmluZz4oJycpOwo=", ""),
    ("app/vendor/list/[slice]/page.tsx", "list: AddSheet onClose without editPrimer", "ICAgICAgICBvbkNsb3NlPXsoKSA9PiB7IHNldEFkZE9wZW4oZmFsc2UpOyBzZXRFZGl0Um93KG51bGwpOyBzZXRFZGl0UHJpbWVyKCcnKTsgfX0K", "ICAgICAgICBvbkNsb3NlPXsoKSA9PiB7IHNldEFkZE9wZW4oZmFsc2UpOyBzZXRFZGl0Um93KG51bGwpOyB9fQo="),
    ("app/vendor/list/[slice]/page.tsx", "list: drop editPrimer prop", "ICAgICAgICBlZGl0UHJpbWVyPXtlZGl0UHJpbWVyfQo=", ""),
    ("components/vendor/AddSheet.tsx", "addsheet: drop editPrimer prop type", "ICAvKiogSXRlbS1zcGVjaWZpYyBjaGF0IHByaW1lciBmb3IgdGhlICJWaWEgY2hhdCIgYnV0dG9uIGluIGVkaXQgbW9kZSAqLwogIGVkaXRQcmltZXI/OiBzdHJpbmc7Cg==", ""),
    ("components/vendor/AddSheet.tsx", "addsheet: drop editPrimer param", "ZXhwb3J0IGZ1bmN0aW9uIEFkZFNoZWV0KHsgb3Blbiwgc2xpY2UsIG9uQ2xvc2UsIG9uVG9hc3QsIGV4aXN0aW5nLCBleGlzdGluZ0lkLCBlZGl0UHJpbWVyIH06IFByb3BzKSB7", "ZXhwb3J0IGZ1bmN0aW9uIEFkZFNoZWV0KHsgb3Blbiwgc2xpY2UsIG9uQ2xvc2UsIG9uVG9hc3QsIGV4aXN0aW5nLCBleGlzdGluZ0lkIH06IFByb3BzKSB7"),
    ("components/vendor/AddSheet.tsx", "addsheet: goToChat add-only (no edit primer)", "ICAgIGNvbnN0IHByaW1lciA9IGlzRWRpdCAmJiBlZGl0UHJpbWVyID8gZWRpdFByaW1lciA6IEFERF9QUklNRVJTW3NsaWNlXTsKICAgIHJvdXRlci5wdXNoKGAvd2VkZGluZz9haVByaW1lcj0ke2VuY29kZVVSSUNvbXBvbmVudChwcmltZXIpfWApOw==", "ICAgIHJvdXRlci5wdXNoKGAvd2VkZGluZz9haVByaW1lcj0ke2VuY29kZVVSSUNvbXBvbmVudChBRERfUFJJTUVSU1tzbGljZV0pfWApOw=="),
    ("app/vendor/calendar/page.tsx", "calendar: import AddSheet", "aW1wb3J0IHsgQ2FsZW5kYXJCbG9ja1NoZWV0IH0gZnJvbSAnQC9jb21wb25lbnRzL3ZlbmRvci9DYWxlbmRhckJsb2NrU2hlZXQnOw==", "aW1wb3J0IHsgQ2FsZW5kYXJCbG9ja1NoZWV0IH0gZnJvbSAnQC9jb21wb25lbnRzL3ZlbmRvci9DYWxlbmRhckJsb2NrU2hlZXQnOwppbXBvcnQgeyBBZGRTaGVldCB9IGZyb20gJ0AvY29tcG9uZW50cy92ZW5kb3IvQWRkU2hlZXQnOw=="),
    ("app/vendor/calendar/page.tsx", "calendar: edit form state", "ICBjb25zdCBbYmxvY2tTZWwsIHNldEJsb2NrU2VsXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpOw==", "ICBjb25zdCBbYmxvY2tTZWwsIHNldEJsb2NrU2VsXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpOwogIC8vIFRhcC10by1lZGl0IGEgY2FsZW5kYXIgZXZlbnQgb3BlbnMgdGhlIGZvcm0gKGRpcmVjdCB3cml0ZSksIG5ldmVyIHRoZSBBSS4KICBjb25zdCBbZWRpdFJvdywgc2V0RWRpdFJvd10gPSB1c2VTdGF0ZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGw+KG51bGwpOwogIGNvbnN0IFthZGRPcGVuLCBzZXRBZGRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTs="),
    ("app/vendor/calendar/page.tsx", "calendar: Edit opens form not AI", "ICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBvbkNsaWNrPXsoKSA9PiB7CiAgICAgICAgICAgICAgICAgICAgICAgIHNldFNlbChudWxsKTsKICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyLnB1c2goYC92ZW5kb3I/YWlQcmltZXI9JHtlbmNvZGVVUklDb21wb25lbnQoYFdoYXQgd291bGQgeW91IGxpa2UgdG8gY2hhbmdlIGFib3V0IHRoZSBldmVudCAiJHtldi50aXRsZX0iIG9uICR7Zm10U2hvcnQoZXYuZXZlbnRfZGF0ZSl9P2ApfWApOwogICAgICAgICAgICAgICAgICAgICAgfX0gc3R5bGU9e3s=", "ICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBvbkNsaWNrPXsoKSA9PiB7CiAgICAgICAgICAgICAgICAgICAgICAgIHNldFNlbChudWxsKTsKICAgICAgICAgICAgICAgICAgICAgICAgc2V0RWRpdFJvdyhldiBhcyB1bmtub3duIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KTsKICAgICAgICAgICAgICAgICAgICAgICAgc2V0QWRkT3Blbih0cnVlKTsKICAgICAgICAgICAgICAgICAgICAgIH19IHN0eWxlPXt7"),
    ("app/vendor/calendar/page.tsx", "calendar: mount AddSheet", "ICAgICAgPENhbGVuZGFyQmxvY2tTaGVldAogICAgICAgIG9wZW49eyEhYmxvY2tTZWx9CiAgICAgICAgZGF0ZUlzbz17YmxvY2tTZWx9CiAgICAgICAgZXhpc3RpbmdCbG9jaz17YmxvY2tTZWwgPyAoYmxvY2tNYXAuZ2V0KGJsb2NrU2VsKSA/PyBudWxsKSA6IG51bGx9CiAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0QmxvY2tTZWwobnVsbCl9CiAgICAgICAgb25Ub2FzdD17c2hvd1RvYXN0fQogICAgICAgIG9uUmVmcmVzaD17cmVmcmVzaEJsb2Nrc30KICAgICAgLz4=", "ICAgICAgPENhbGVuZGFyQmxvY2tTaGVldAogICAgICAgIG9wZW49eyEhYmxvY2tTZWx9CiAgICAgICAgZGF0ZUlzbz17YmxvY2tTZWx9CiAgICAgICAgZXhpc3RpbmdCbG9jaz17YmxvY2tTZWwgPyAoYmxvY2tNYXAuZ2V0KGJsb2NrU2VsKSA/PyBudWxsKSA6IG51bGx9CiAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0QmxvY2tTZWwobnVsbCl9CiAgICAgICAgb25Ub2FzdD17c2hvd1RvYXN0fQogICAgICAgIG9uUmVmcmVzaD17cmVmcmVzaEJsb2Nrc30KICAgICAgLz4KICAgICAgPEFkZFNoZWV0CiAgICAgICAgb3Blbj17YWRkT3Blbn0KICAgICAgICBzbGljZT0iZXZlbnRzIgogICAgICAgIGV4aXN0aW5nPXtlZGl0Um93fQogICAgICAgIGV4aXN0aW5nSWQ9e2VkaXRSb3c/LmlkIGFzIHN0cmluZyB8IHVuZGVmaW5lZH0KICAgICAgICBvbkNsb3NlPXsoKSA9PiB7IHNldEFkZE9wZW4oZmFsc2UpOyBzZXRFZGl0Um93KG51bGwpOyB9fQogICAgICAgIG9uVG9hc3Q9e3Nob3dUb2FzdH0KICAgICAgLz4="),
    ("app/demo/vendor/[handle]/list/[slice]/page.tsx", "demo: drop editPrimer state", "Y29uc3RbZWRpdFByaW1lcixzZXRFZGl0UHJpbWVyXT11c2VTdGF0ZSgnJyk7", ""),
    ("app/demo/vendor/[handle]/list/[slice]/page.tsx", "demo: AddSheet mount without editPrimer", "b25DbG9zZT17KCk9PntzZXRBZGRPcGVuKGZhbHNlKTtzZXRFZGl0Um93KG51bGwpO3NldEVkaXRQcmltZXIoJycpO319IG9uVG9hc3Q9eyhtc2c6c3RyaW5nLGtpbmQ/OlRvYXN0S2luZCk9PnNob3dUb2FzdChtc2csa2luZCl9IGV4aXN0aW5nPXtlZGl0Um93fSBleGlzdGluZ0lkPXtlZGl0Um93Py5pZCBhcyBzdHJpbmd8dW5kZWZpbmVkfSBlZGl0UHJpbWVyPXtlZGl0UHJpbWVyfS8+", "b25DbG9zZT17KCk9PntzZXRBZGRPcGVuKGZhbHNlKTtzZXRFZGl0Um93KG51bGwpO319IG9uVG9hc3Q9eyhtc2c6c3RyaW5nLGtpbmQ/OlRvYXN0S2luZCk9PnNob3dUb2FzdChtc2csa2luZCl9IGV4aXN0aW5nPXtlZGl0Um93fSBleGlzdGluZ0lkPXtlZGl0Um93Py5pZCBhcyBzdHJpbmd8dW5kZWZpbmVkfS8+"),
    ("app/demo/vendor/[handle]/list/[slice]/page.tsx", "demo: Edit Here without editPrimer", "b25DbGljaz17KCk9PntpZihzZWwpe3NldFNlbChudWxsKTtzZXRFZGl0UHJpbWVyKHNlbC5haVByaW1lcik7c2V0RWRpdFJvdyh7aWQ6c2VsLmlkfSk7c2V0QWRkT3Blbih0cnVlKTt9fX0=", "b25DbGljaz17KCk9PntpZihzZWwpe3NldFNlbChudWxsKTtzZXRFZGl0Um93KHtpZDpzZWwuaWR9KTtzZXRBZGRPcGVuKHRydWUpO319fQ=="),
    ("components/vendor/ListRow.tsx", "listrow: drop unused editPrimer prop", "ICBlZGl0UHJpbWVyOiBzdHJpbmc7Cg==", "")
]
applied = skipped = 0
for path, label, o_b64, n_b64 in EDITS:
    if not os.path.exists(path):
        print("SKIP  [%s] %s not found." % (label, path)); skipped += 1; continue
    text = open(path, encoding="utf-8").read()
    old, new = d(o_b64), d(n_b64)
    if old == new: continue
    # Idempotency: if the finished `new` block is already present, this edit is done.
    # (Crucial for ADDITIVE edits where `new` contains `old` — the old anchor still
    # exists after applying, so we must check `new` first and replace ONCE only.)
    if new and new in text:
        print("SKIP  [%s] already applied." % label); skipped += 1; continue
    c = text.count(old)
    if c == 1:
        open(path, "w", encoding="utf-8").write(text.replace(old, new, 1)); applied += 1; print("OK    [%s]" % label)
    elif c == 0: print("SKIP  [%s] anchor NOT FOUND." % label); skipped += 1
    else: print("SKIP  [%s] anchor x%d." % (label, c)); skipped += 1
lp = open("app/vendor/list/[slice]/page.tsx", encoding="utf-8").read()
cp = open("app/vendor/calendar/page.tsx", encoding="utf-8").read()
asf= open("components/vendor/AddSheet.tsx", encoding="utf-8").read()
checks = [
  ("list onEdit riddle gone",   "router.push(`/wedding?aiPrimer=${encodeURIComponent(row.aiPrimer)}`)" not in lp),
  ("list onEditHere kept",      "function onEditHere(row: Row)" in lp),
  ("list editPrimer state gone","const [editPrimer," not in lp),
  ("calendar imports AddSheet", "import { AddSheet }" in cp),
  ("calendar edit opens form",  "setEditRow(ev as unknown" in cp),
  ("calendar edit riddle gone", "What would you like to change about the event" not in cp),
  ("calendar mounts AddSheet",  "<AddSheet" in cp and 'slice="events"' in cp),
  ("addsheet editPrimer gone",  "editPrimer" not in asf),
]
print(chr(10) + "-- verification --")
allok = True
for n,p in checks: print("  %s %s" % ("PASS" if p else "FAIL", n)); allok = allok and p
print(chr(10) + "(%d applied, %d skipped)" % (applied, skipped))
print("ALL CHECKS PASSED" if allok else "SOME CHECKS FAILED")
sys.exit(0 if allok else 2)
