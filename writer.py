#!/usr/bin/env python3
# Piece 5-B - the pair at work. streamChat catches the handoff/operator_action/
# operator_report beats; useChat collects them onto the turn; ChatThread shows them
# quietly beneath Myra's reply (answer first). 3 files, anchored, idempotent.
import base64, sys, os
def d(s): return base64.b64decode(s).decode("utf-8")
EDITS = [
    ("lib/vendor/api/vendor.ts", "v_donepayload", "ZXhwb3J0IHR5cGUgU3RyZWFtRG9uZVBheWxvYWQgPSB7CiAgdG9vbF9jYWxsczogc3RyaW5nW107CiAgcmVmcmVzaD86IGJvb2xlYW47CiAgY29udGFjdD86IENvbnRhY3RDYXJkOwogIGNsYXJpZnk/OiBDbGFyaWZ5UGF5bG9hZDsKICBzdWdnZXN0aW9ucz86IFN1Z2dlc3Rpb25zUGF5bG9hZDsKfTs=", "ZXhwb3J0IHR5cGUgU3RyZWFtRG9uZVBheWxvYWQgPSB7CiAgdG9vbF9jYWxsczogc3RyaW5nW107CiAgcmVmcmVzaD86IGJvb2xlYW47CiAgY29udGFjdD86IENvbnRhY3RDYXJkOwogIGNsYXJpZnk/OiBDbGFyaWZ5UGF5bG9hZDsKICBzdWdnZXN0aW9ucz86IFN1Z2dlc3Rpb25zUGF5bG9hZDsKfTsKCi8vIFRoZSBwYWlyLWF0LXdvcmsgYmVhdHMgdGhlIGZpcmV3YWxsIGVtaXRzIG9uIHRoZSB3aXJlICgzLUIpLiBNeXJhJ3MgcHJvc2UKLy8gcmlkZXMgYXMgdGV4dF9kZWx0YTsgdGhlc2UgdGhyZWUgZGVzY3JpYmUgd2hhdCBoZXIgb3BlcmF0b3IgZGlkIHVuZGVybmVhdGguCmV4cG9ydCB0eXBlIFN0cmVhbUJlYXQgPQogIHwgeyBraW5kOiAnaGFuZG9mZic7IG1lc3NhZ2U6IHN0cmluZyB9CiAgfCB7IGtpbmQ6ICdvcGVyYXRvcl9hY3Rpb24nOyBhY3Rpb246IHN0cmluZzsgZGV0YWlsOiBzdHJpbmcgfQogIHwgeyBraW5kOiAnb3BlcmF0b3JfcmVwb3J0JzsgbWVzc2FnZTogc3RyaW5nIH07"),
    ("lib/vendor/api/vendor.ts", "v_params", "ICBvbkRvbmU6IChyZXN1bHQ6IFN0cmVhbURvbmVQYXlsb2FkKSA9PiB2b2lkLAogIG9uRXJyb3I6IChtc2c6IHN0cmluZykgPT4gdm9pZCwKKTogKCkgPT4gdm9pZCB7", "ICBvbkRvbmU6IChyZXN1bHQ6IFN0cmVhbURvbmVQYXlsb2FkKSA9PiB2b2lkLAogIG9uRXJyb3I6IChtc2c6IHN0cmluZykgPT4gdm9pZCwKICBvbkJlYXQ/OiAoYmVhdDogU3RyZWFtQmVhdCkgPT4gdm9pZCwKKTogKCkgPT4gdm9pZCB7"),
    ("lib/vendor/api/vendor.ts", "v_parse", "ICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAndGV4dF9kZWx0YScgJiYgZXZlbnQudGV4dCkgewogICAgICAgICAgICBvbkRlbHRhKGV2ZW50LnRleHQpOwogICAgICAgICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAnZG9uZScpIHs=", "ICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAndGV4dF9kZWx0YScgJiYgZXZlbnQudGV4dCkgewogICAgICAgICAgICBvbkRlbHRhKGV2ZW50LnRleHQpOwogICAgICAgICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAnaGFuZG9mZicpIHsKICAgICAgICAgICAgb25CZWF0Py4oeyBraW5kOiAnaGFuZG9mZicsIG1lc3NhZ2U6IGV2ZW50Lm1lc3NhZ2UgPz8gJycgfSk7CiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdvcGVyYXRvcl9hY3Rpb24nKSB7CiAgICAgICAgICAgIG9uQmVhdD8uKHsga2luZDogJ29wZXJhdG9yX2FjdGlvbicsIGFjdGlvbjogZXZlbnQua2luZCA/PyAnJywgZGV0YWlsOiBldmVudC5kZXRhaWwgPz8gJycgfSk7CiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdvcGVyYXRvcl9yZXBvcnQnKSB7CiAgICAgICAgICAgIG9uQmVhdD8uKHsga2luZDogJ29wZXJhdG9yX3JlcG9ydCcsIG1lc3NhZ2U6IGV2ZW50Lm1lc3NhZ2UgPz8gJycgfSk7CiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdkb25lJykgew=="),
    ("hooks/vendor/useChat.ts", "u_import", "aW1wb3J0IHsgZmV0Y2hDb250ZXh0LCBmZXRjaENoYXRIaXN0b3J5LCBzdHJlYW1DaGF0IH0gZnJvbSAnQC9saWIvdmVuZG9yL2FwaS92ZW5kb3InOw==", "aW1wb3J0IHsgZmV0Y2hDb250ZXh0LCBmZXRjaENoYXRIaXN0b3J5LCBzdHJlYW1DaGF0LCB0eXBlIFN0cmVhbUJlYXQgfSBmcm9tICdAL2xpYi92ZW5kb3IvYXBpL3ZlbmRvcic7"),
    ("hooks/vendor/useChat.ts", "u_msgtype", "ICBzdHJlYW1pbmc/OiBib29sZWFuOyAgICAgICAgIC8vIHRydWUgd2hpbGUgU1NFIHN0cmVhbSBpcyBpbiBwcm9ncmVzcwp9", "ICBzdHJlYW1pbmc/OiBib29sZWFuOyAgICAgICAgIC8vIHRydWUgd2hpbGUgU1NFIHN0cmVhbSBpcyBpbiBwcm9ncmVzcwogIGRlbGliZXJhdGlvbj86IFN0cmVhbUJlYXRbXTsgLy8gNS1COiB0aGUgb3BlcmF0b3IncyB3b3JrIGJlbmVhdGggTXlyYSdzIHJlcGx5Cn0="),
    ("hooks/vendor/useChat.ts", "u_init", "c2V0TWVzc2FnZXMoKHByZXY6IENoYXRNZXNzYWdlW10pID0+IFsuLi5wcmV2LCB7IGlkOiBhaU1zZ0lkLCByb2xlOiAnYWknLCB0ZXh0OiAnJywgc3RyZWFtaW5nOiB0cnVlIH1dKTs=", "c2V0TWVzc2FnZXMoKHByZXY6IENoYXRNZXNzYWdlW10pID0+IFsuLi5wcmV2LCB7IGlkOiBhaU1zZ0lkLCByb2xlOiAnYWknLCB0ZXh0OiAnJywgc3RyZWFtaW5nOiB0cnVlLCBkZWxpYmVyYXRpb246IFtdIH1dKTs="),
    ("hooks/vendor/useChat.ts", "u_onerror", "ICAgICAgLy8gb25FcnJvcgogICAgICAoZXJyTXNnOiBzdHJpbmcpID0+IHsKICAgICAgICBzZXRNZXNzYWdlcygocHJldjogQ2hhdE1lc3NhZ2VbXSkgPT4gcHJldi5tYXAoKG06IENoYXRNZXNzYWdlKSA9PgogICAgICAgICAgbS5pZCA9PT0gYWlNc2dJZCA/IHsgLi4ubSwgdGV4dDogZXJyTXNnLCBzdHJlYW1pbmc6IGZhbHNlIH0gOiBtCiAgICAgICAgKSk7CiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7CiAgICAgICAgYWJvcnRSZWYuY3VycmVudCA9IG51bGw7CiAgICAgIH0sCiAgICApOw==", "ICAgICAgLy8gb25FcnJvcgogICAgICAoZXJyTXNnOiBzdHJpbmcpID0+IHsKICAgICAgICBzZXRNZXNzYWdlcygocHJldjogQ2hhdE1lc3NhZ2VbXSkgPT4gcHJldi5tYXAoKG06IENoYXRNZXNzYWdlKSA9PgogICAgICAgICAgbS5pZCA9PT0gYWlNc2dJZCA/IHsgLi4ubSwgdGV4dDogZXJyTXNnLCBzdHJlYW1pbmc6IGZhbHNlIH0gOiBtCiAgICAgICAgKSk7CiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7CiAgICAgICAgYWJvcnRSZWYuY3VycmVudCA9IG51bGw7CiAgICAgIH0sCgogICAgICAvLyBvbkJlYXQg4oCUIGNvbGxlY3QgdGhlIHBhaXItYXQtd29yayBiZWF0cyBvbnRvIHRoZSBzdHJlYW1pbmcgdHVybgogICAgICAoYmVhdDogU3RyZWFtQmVhdCkgPT4gewogICAgICAgIHNldE1lc3NhZ2VzKChwcmV2OiBDaGF0TWVzc2FnZVtdKSA9PiBwcmV2Lm1hcCgobTogQ2hhdE1lc3NhZ2UpID0+CiAgICAgICAgICBtLmlkID09PSBhaU1zZ0lkID8geyAuLi5tLCBkZWxpYmVyYXRpb246IFsuLi4obS5kZWxpYmVyYXRpb24gPz8gW10pLCBiZWF0XSB9IDogbQogICAgICAgICkpOwogICAgICB9LAogICAgKTs="),
    ("components/vendor/ChatThread.tsx", "c_bubble", "ICAgICAgICAgIDxNZXNzYWdlQnViYmxlIG1lc3NhZ2U9e219IC8+CiAgICAgICAgICB7LyogQ2xhcmlmeSBjaGlwcyDigJQgYnJhc3MgaW4gZGFyaywgb3hibG9vZCBpbiBsaWdodCAqL30=", "ICAgICAgICAgIDxNZXNzYWdlQnViYmxlIG1lc3NhZ2U9e219IC8+CgogICAgICAgICAgey8qIFRoZSBwYWlyIGF0IHdvcmsgKDUtQik6IE15cmEncyByZXBseSBpcyB0aGUgYnViYmxlIGFib3ZlOyBoZXIKICAgICAgICAgICAgICBvcGVyYXRvcidzIGRlbGliZXJhdGlvbiByZWFkcyBxdWlldGx5IGJlbmVhdGgg4oCUIGFuc3dlciBmaXJzdC4gKi99CiAgICAgICAgICB7bS5kZWxpYmVyYXRpb24gJiYgbS5kZWxpYmVyYXRpb24ubGVuZ3RoID4gMCAmJiAoCiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogJzAgMjJweCA5cHggMzhweCcsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogMyB9fT4KICAgICAgICAgICAgICB7bS5kZWxpYmVyYXRpb24ubWFwKChiZWF0LCBpKSA9PiB7CiAgICAgICAgICAgICAgICBjb25zdCBsaW5lID0KICAgICAgICAgICAgICAgICAgYmVhdC5raW5kID09PSAnaGFuZG9mZicgPyAnSGFuZGVkIHRvIHRoZSBvcGVyYXRvcicKICAgICAgICAgICAgICAgICAgOiBiZWF0LmtpbmQgPT09ICdvcGVyYXRvcl9hY3Rpb24nID8gYE9wZXJhdG9yIFx1MDBiNyAke2JlYXQuYWN0aW9ufSR7YmVhdC5kZXRhaWwgPyAnIFx1MjAxNCAnICsgYmVhdC5kZXRhaWwgOiAnJ31gCiAgICAgICAgICAgICAgICAgIDogYE9wZXJhdG9yIHJlcG9ydGVkIFx1MDBiNyAke2JlYXQubWVzc2FnZX1gOwogICAgICAgICAgICAgICAgcmV0dXJuICgKICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9IHN0eWxlPXt7CiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogRi5sYWJlbCwgZm9udFNpemU6IDExLCBmb250V2VpZ2h0OiAzMDAsIGxpbmVIZWlnaHQ6IDEuNSwKICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wMWVtJywKICAgICAgICAgICAgICAgICAgICBjb2xvcjogVC5pc0xpZ2h0ID8gJ3JnYmEoMjYsMTUsOCwwLjUpJyA6ICdyZ2JhKDIzMywyMjgsMjE3LDAuNDIpJywKICAgICAgICAgICAgICAgICAgfX0+e2xpbmV9PC9kaXY+CiAgICAgICAgICAgICAgICApOwogICAgICAgICAgICAgIH0pfQogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICl9CiAgICAgICAgICB7LyogQ2xhcmlmeSBjaGlwcyDigJQgYnJhc3MgaW4gZGFyaywgb3hibG9vZCBpbiBsaWdodCAqL30=")
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
uf = open("hooks/vendor/useChat.ts", encoding="utf-8").read()
cf = open("components/vendor/ChatThread.tsx", encoding="utf-8").read()
checks = [
  ("StreamBeat type exported",   "export type StreamBeat =" in vf),
  ("onBeat param added",         "onBeat?: (beat: StreamBeat) => void," in vf),
  ("handoff parsed",             "kind: 'handoff', message: event.message" in vf),
  ("operator_action parsed",     "kind: 'operator_action', action: event.kind" in vf),
  ("operator_report parsed",     "kind: 'operator_report', message: event.message" in vf),
  ("useChat imports StreamBeat", "type StreamBeat }" in uf),
  ("deliberation on message",    "deliberation?: StreamBeat[];" in uf),
  ("deliberation initialised",   "streaming: true, deliberation: [] }" in uf),
  ("onBeat collects beats",      "deliberation: [...(m.deliberation ?? []), beat]" in uf),
  ("trace rendered answer-first","m.deliberation && m.deliberation.length > 0" in cf),
]
print(chr(10) + "-- verification --")
allok = True
for n,p in checks: print("  %s %s" % ("PASS" if p else "FAIL", n)); allok = allok and p
print(chr(10) + "(%d applied, %d skipped)" % (applied, skipped))
print("ALL CHECKS PASSED" if allok else "SOME CHECKS FAILED")
sys.exit(0 if allok else 2)
