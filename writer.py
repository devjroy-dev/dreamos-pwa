#!/usr/bin/env python3
# Piece 5-A.2 - make the blob visible. It renders INSIDE the streaming bubble while
# the AI message is streaming-but-empty (before the first word), then gives way to
# the reply. Removes the dead gate + now-unused import. 2 files, idempotent.
import base64, sys, os
def d(s): return base64.b64decode(s).decode("utf-8")
EDITS = [
    ("components/vendor/MessageBubble.tsx", "m_import", "aW1wb3J0IHsgdXNlVCB9IGZyb20gJ0AvbGliL3ZlbmRvci9UaGVtZUNvbnRleHQnOw==", "aW1wb3J0IHsgdXNlVCB9IGZyb20gJ0AvbGliL3ZlbmRvci9UaGVtZUNvbnRleHQnOwppbXBvcnQgeyBUeXBpbmdEb3RzIH0gZnJvbSAnLi9UeXBpbmdEb3RzJzs="),
    ("components/vendor/MessageBubble.tsx", "m_sig", "ZnVuY3Rpb24gQWlNZXNzYWdlVGV4dCh7IHRleHQsIFQsIEYgfTogeyB0ZXh0OiBzdHJpbmc7IFQ6IFJldHVyblR5cGU8dHlwZW9mIGltcG9ydCgnQC9saWIvdmVuZG9yL1RoZW1lQ29udGV4dCcpLnVzZVQ+OyBGOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0pIHs=", "ZnVuY3Rpb24gQWlNZXNzYWdlVGV4dCh7IHRleHQsIHN0cmVhbWluZywgVCwgRiB9OiB7IHRleHQ6IHN0cmluZzsgc3RyZWFtaW5nPzogYm9vbGVhbjsgVDogUmV0dXJuVHlwZTx0eXBlb2YgaW1wb3J0KCdAL2xpYi92ZW5kb3IvVGhlbWVDb250ZXh0JykudXNlVD47IEY6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSkgew=="),
    ("components/vendor/MessageBubble.tsx", "m_return", "ICByZXR1cm4gKAogICAgPD4KICAgICAgPHAgc3R5bGU9e3sKICAgICAgICBmb250RmFtaWx5OiBGLnNjcmlwdCwgZm9udFN0eWxlOiAnaXRhbGljJywgZm9udFdlaWdodDogNDAwLAogICAgICAgIGZvbnRTaXplOiAxOCwgY29sb3I6IFQuaW5rLCBsaW5lSGVpZ2h0OiAxLjQyLA==", "ICAvLyBCZWZvcmUgdGhlIGZpcnN0IHdvcmQgbGFuZHMsIHRoZSBibG9iIGJyZWF0aGVzIGluIHBsYWNlIG9mIHRoZSBlbXB0eSBsaW5lCiAgLy8gKHRoZSB3b3JraW5nIG1hcmspOyBpdCBnaXZlcyB3YXkgdG8gdGhlIHJlcGx5IGFzIHNvb24gYXMgdGV4dCBhcnJpdmVzLgogIGlmIChzdHJlYW1pbmcgJiYgIXRleHQpIHJldHVybiA8VHlwaW5nRG90cyAvPjsKCiAgcmV0dXJuICgKICAgIDw+CiAgICAgIDxwIHN0eWxlPXt7CiAgICAgICAgZm9udEZhbWlseTogRi5zY3JpcHQsIGZvbnRTdHlsZTogJ2l0YWxpYycsIGZvbnRXZWlnaHQ6IDQwMCwKICAgICAgICBmb250U2l6ZTogMTgsIGNvbG9yOiBULmluaywgbGluZUhlaWdodDogMS40Miw="),
    ("components/vendor/MessageBubble.tsx", "m_call", "ICAgICAgICAgIDxBaU1lc3NhZ2VUZXh0IHRleHQ9e21lc3NhZ2UudGV4dH0gVD17VH0gRj17Rn0gLz4=", "ICAgICAgICAgIDxBaU1lc3NhZ2VUZXh0IHRleHQ9e21lc3NhZ2UudGV4dH0gc3RyZWFtaW5nPXttZXNzYWdlLnN0cmVhbWluZ30gVD17VH0gRj17Rn0gLz4="),
    ("components/vendor/ChatThread.tsx", "c_dead", "ICAgICAgey8qIFR5cGluZyBpbmRpY2F0b3IgKi99CiAgICAgIHtsb2FkaW5nICYmICFtZXNzYWdlcy5zb21lKG0gPT4gbS5zdHJlYW1pbmcpICYmICgKICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6ICc4cHggMjJweCA4cHggMzhweCcsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+CiAgICAgICAgICA8VHlwaW5nRG90cyAvPgogICAgICAgIDwvZGl2PgogICAgICApfQo=", "ICAgICAgey8qIFRoZSB3b3JraW5nIGJsb2Igbm93IGxpdmVzIGluc2lkZSB0aGUgc3RyZWFtaW5nIGJ1YmJsZSAoaXQgc2hvd3Mgd2hpbGUKICAgICAgICAgIHRoZSBBSSBtZXNzYWdlIGlzIHN0cmVhbWluZyBidXQgc3RpbGwgZW1wdHkpLCBzbyBubyBzZXBhcmF0ZSBpbmRpY2F0b3IuICovfQo="),
    ("components/vendor/ChatThread.tsx", "c_import", "aW1wb3J0IHsgVHlwaW5nRG90cyB9IGZyb20gJy4vVHlwaW5nRG90cyc7Cg==", "")
]
applied = skipped = 0
for path, label, o_b64, n_b64 in EDITS:
    if not os.path.exists(path):
        print("SKIP  [%s] %s not found." % (label, path)); skipped += 1; continue
    text = open(path, encoding="utf-8").read()
    old, new = d(o_b64), d(n_b64)
    if old == new: continue
    if new and new in text:
        print("SKIP  [%s] already applied." % label); skipped += 1; continue
    c = text.count(old)
    if c == 1:
        open(path, "w", encoding="utf-8").write(text.replace(old, new)); applied += 1; print("OK    [%s]" % label)
    elif c == 0: print("SKIP  [%s] anchor NOT FOUND." % label); skipped += 1
    else: print("SKIP  [%s] anchor x%d." % (label, c)); skipped += 1
mf = open("components/vendor/MessageBubble.tsx", encoding="utf-8").read()
cf = open("components/vendor/ChatThread.tsx", encoding="utf-8").read()
checks = [
  ("MessageBubble imports blob",     "import { TypingDots } from './TypingDots';" in mf),
  ("AiMessageText takes streaming",  "streaming?: boolean;" in mf),
  ("blob when empty+streaming",      "if (streaming && !text) return <TypingDots />;" in mf),
  ("call passes streaming",          "streaming={message.streaming}" in mf),
  ("dead gate removed",              "loading && !messages.some(m => m.streaming)" not in cf),
  ("ChatThread no longer imports blob","import { TypingDots } from './TypingDots';" not in cf),
]
print(chr(10) + "-- verification --")
allok = True
for n,p in checks: print("  %s %s" % ("PASS" if p else "FAIL", n)); allok = allok and p
print(chr(10) + "(%d applied, %d skipped)" % (applied, skipped))
print("ALL CHECKS PASSED" if allok else "SOME CHECKS FAILED")
sys.exit(0 if allok else 2)
