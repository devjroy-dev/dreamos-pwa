#!/usr/bin/env python3
# Piece 4-D - advance-paid invoices show "Advance Paid", not "Unpaid".
# Fix: invoiceState derives from real figures (money in + balance owed = advance_paid);
# plus a distinct pill colour. Anchored + idempotent. Two files.
import base64, sys, os
def d(s): return base64.b64decode(s).decode("utf-8")
EDITS = [
    ("lib/vendor/api/vendor.ts", "invoiceState advance_paid fix", "ZnVuY3Rpb24gaW52b2ljZVN0YXRlKGI6IENhYmluZXRCaW5kZXIpOiBzdHJpbmcgewogIGNvbnN0IG93ZWQgPSBiLmFtb3VudF9wZW5kaW5nID8/IDA7CiAgY29uc3QgcGFpZCA9IGIuYW1vdW50X3JlY2VpdmVkID8/IDA7CiAgaWYgKG93ZWQgPiAwKSByZXR1cm4gJ3VucGFpZCc7CiAgaWYgKHBhaWQgPiAwKSByZXR1cm4gJ3BhaWQnOwogIHJldHVybiBiLnBheW1lbnRfc3RhdHVzID8/ICd1bnBhaWQnOwp9", "ZnVuY3Rpb24gaW52b2ljZVN0YXRlKGI6IENhYmluZXRCaW5kZXIpOiBzdHJpbmcgewogIGNvbnN0IG93ZWQgPSBiLmFtb3VudF9wZW5kaW5nID8/IDA7CiAgY29uc3QgcGFpZCA9IGIuYW1vdW50X3JlY2VpdmVkID8/IDA7CiAgLy8gRGVyaXZlIGZyb20gdGhlIHJlYWwgZmlndXJlcyBzbyB0aGUgcGlsbCBuZXZlciBjb250cmFkaWN0cyB0aGUgcGFpZC9vd2VkIHNob3duLgogIGlmIChwYWlkID4gMCB8fCBvd2VkID4gMCkgewogICAgaWYgKG93ZWQgPD0gMCkgcmV0dXJuICdwYWlkJzsgICAgICAgIC8vIG5vdGhpbmcgbGVmdCB0byBjb2xsZWN0CiAgICBpZiAocGFpZCA+IDApIHJldHVybiAnYWR2YW5jZV9wYWlkJzsgLy8gbW9uZXkgaW4sIGJhbGFuY2Ugc3RpbGwgb3dlZAogICAgcmV0dXJuICd1bnBhaWQnOyAgICAgICAgICAgICAgICAgICAgIC8vIG5vdGhpbmcgcmVjZWl2ZWQgeWV0CiAgfQogIC8vIE5vIHJlY2VpdmVkL3BlbmRpbmcgYnJlYWtkb3duIG9uIHRoaXMgYmluZGVyIOKAlCBmYWxsIGJhY2sgdG8gc3RvcmVkIHN0YXR1cy4KICByZXR1cm4gYi5wYXltZW50X3N0YXR1cyA/PyAndW5wYWlkJzsKfQ=="),
    ("app/vendor/list/[slice]/page.tsx", "advance_paid pill colour", "ICAgIGlmIChzID09PSAncGFpZCcpIHJldHVybiBBLmdyZWVuOwogICAgaWYgKHMgPT09ICd1bnBhaWQnKSByZXR1cm4gQS5icmFzc1dhcm07", "ICAgIGlmIChzID09PSAncGFpZCcpIHJldHVybiBBLmdyZWVuOwogICAgaWYgKHMgPT09ICdhZHZhbmNlX3BhaWQnKSByZXR1cm4gQS5icmFzczsKICAgIGlmIChzID09PSAndW5wYWlkJykgcmV0dXJuIEEuYnJhc3NXYXJtOw==")
]
applied = skipped = 0
for path, label, o_b64, n_b64 in EDITS:
    if not os.path.exists(path):
        print("SKIP  [%s] %s not found." % (label, path)); skipped += 1; continue
    text = open(path, encoding="utf-8").read()
    old, new = d(o_b64), d(n_b64)
    if new in text:
        print("SKIP  [%s] already applied." % label); skipped += 1; continue
    c = text.count(old)
    if c == 1:
        open(path, "w", encoding="utf-8").write(text.replace(old, new)); applied += 1; print("OK    [%s]" % label)
    elif c == 0: print("SKIP  [%s] anchor NOT FOUND." % label); skipped += 1
    else: print("SKIP  [%s] anchor x%d." % (label, c)); skipped += 1
vf = open("lib/vendor/api/vendor.ts", encoding="utf-8").read()
pf = open("app/vendor/list/[slice]/page.tsx", encoding="utf-8").read()
checks = [
  ("advance_paid derived",       "if (paid > 0) return 'advance_paid';" in vf),
  ("old buggy line gone",        "  if (owed > 0) return 'unpaid';\n  if (paid > 0) return 'paid';" not in vf),
  ("figures preferred over status","if (paid > 0 || owed > 0) {" in vf),
  ("advance_paid pill colour",   "if (s === 'advance_paid') return A.brass;" in pf),
]
print(chr(10) + "-- verification --")
allok = True
for n,p in checks: print("  %s %s" % ("PASS" if p else "FAIL", n)); allok = allok and p
print(chr(10) + "(%d applied, %d skipped)" % (applied, skipped))
print("ALL CHECKS PASSED" if allok else "SOME CHECKS FAILED")
sys.exit(0 if allok else 2)
