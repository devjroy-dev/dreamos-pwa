#!/usr/bin/env python3
# Piece 4-E - console hygiene + clean badges. Title-case the invoice badge
# (ADVANCE_PAID -> "Advance Paid"); gate the /schedule fetch behind a flag so
# opening an invoice no longer 404s (schedule is Step 10). One file, anchored.
import base64, sys, os
PATH = "app/vendor/list/[slice]/page.tsx"
def d(s): return base64.b64decode(s).decode("utf-8")
EDITS = [
    ("cap + SCHEDULE flag", "ZnVuY3Rpb24gY2FwKHM6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcgewogIGlmICghcyB8fCBzID09PSAn4oCUJykgcmV0dXJuIHMgPz8gJ+KAlCc7CiAgcmV0dXJuIHMuc3BsaXQoL1tcc18tXSsvKS5tYXAodyA9PiB3LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdy5zbGljZSgxKSkuam9pbignICcpOwp9", "ZnVuY3Rpb24gY2FwKHM6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcgewogIGlmICghcyB8fCBzID09PSAn4oCUJykgcmV0dXJuIHMgPz8gJ+KAlCc7CiAgcmV0dXJuIHMuc3BsaXQoL1tcc18tXSsvKS5tYXAodyA9PiB3LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdy5zbGljZSgxKSkuam9pbignICcpOwp9CgovLyBQYXltZW50IHNjaGVkdWxlIGVuZHBvaW50IGxhbmRzIHdpdGggU3RlcCAxMCAoYXJ0aWZhY3QgaGFuZHMpLiBPZmYgdW50aWwgdGhlbiwKLy8gc28gb3BlbmluZyBhbiBpbnZvaWNlIGRvZXNuJ3QgZmlyZSBhIDQwNCBhZ2FpbnN0IGEgcm91dGUgdGhhdCBpc24ndCBidWlsdCB5ZXQuCmNvbnN0IFNDSEVEVUxFX0VOQUJMRUQ6IGJvb2xlYW4gPSBmYWxzZTs="),
    ("invoice badge title-case", "bWV0YTogaW52LmR1ZV9kYXRlP2BkdWUgJHtmbXREYXRlKGludi5kdWVfZGF0ZSl9YDp1bmRlZmluZWQsIGJhZGdlOiBpbnYuc3RhdGUsIGJhZGdlQWxlcnQ6", "bWV0YTogaW52LmR1ZV9kYXRlP2BkdWUgJHtmbXREYXRlKGludi5kdWVfZGF0ZSl9YDp1bmRlZmluZWQsIGJhZGdlOiBjYXAoaW52LnN0YXRlKSwgYmFkZ2VBbGVydDo="),
    ("gate schedule fetch (Step 10)", "ICAgIGlmIChzbGljZSA9PT0gJ2ludm9pY2VzJyAmJiBzZWwpIHsKICAgICAgc2V0U2NoZWR1bGUobnVsbCk7IHNldFNjaGVkdWxlTG9hZGluZyh0cnVlKTsKICAgICAgZmV0Y2hTY2hlZHVsZShzZWwuaWQpLnRoZW4ociA9PiB7", "ICAgIGlmIChzbGljZSA9PT0gJ2ludm9pY2VzJyAmJiBzZWwpIHsKICAgICAgaWYgKCFTQ0hFRFVMRV9FTkFCTEVEKSB7IHNldFNjaGVkdWxlKFtdKTsgcmV0dXJuOyB9CiAgICAgIHNldFNjaGVkdWxlKG51bGwpOyBzZXRTY2hlZHVsZUxvYWRpbmcodHJ1ZSk7CiAgICAgIGZldGNoU2NoZWR1bGUoc2VsLmlkKS50aGVuKHIgPT4gew==")
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
  ("SCHEDULE_ENABLED flag added",  "const SCHEDULE_ENABLED: boolean = false;" in text),
  ("invoice badge title-cased",    "badge: cap(inv.state)," in text),
  ("schedule fetch gated",         "if (!SCHEDULE_ENABLED) { setSchedule([]); return; }" in text),
  ("fetchSchedule still imported", "fetchSchedule" in text),
]
print(chr(10) + "-- verification --")
allok = True
for n,p in checks: print("  %s %s" % ("PASS" if p else "FAIL", n)); allok = allok and p
print(chr(10) + "(%d applied, %d skipped)" % (applied, skipped))
print("ALL CHECKS PASSED" if allok else "SOME CHECKS FAILED")
sys.exit(0 if allok else 2)
