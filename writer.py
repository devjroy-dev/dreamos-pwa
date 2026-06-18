#!/usr/bin/env python3
# Piece 0 — dreamos-pwa — Open the entrance (invite gate removed, phone-OTP only).
#
# WHAT THIS DOES (frontend only; OTP screens untouched; bride entrance shares the same flow):
#   1. Entry "Join" button -> goes straight to phone (invite_phone), skipping the code screen.
#   2. The phone handler calls the new public POST /api/v2/register instead of /invite/consume
#      (drops the `code` field).
#   3. invite_phone back button -> returns to 'entry' (not the now-skipped code screen).
#
# The invite_code screen block and the /invite/validate call are LEFT IN PLACE but
# unreachable (dormant) — nothing else references them; deleting is unnecessary risk.
#
# All edits are anchor-guarded: if an anchor isn't found, the writer SKIPs and prints
# the manual change, never corrupts the file. Idempotent (skips already-applied edits).

import os, sys

ROOT = os.getcwd()
TARGET = os.path.join(ROOT, "app", "(landing)", "page.tsx")

def expect():
    if not os.path.isfile(TARGET):
        print(f"ERROR: {TARGET} not found — run from the dreamos-pwa repo root. Aborting.")
        sys.exit(1)

def apply(src, name, old, new):
    if new in src and old not in src:
        print(f"SKIP: '{name}' already applied.")
        return src, True
    cnt = src.count(old)
    if cnt == 0:
        print(f"SKIP: anchor for '{name}' NOT FOUND — apply by hand. Looked for:\n      {old.strip()[:90]}")
        return src, False
    if cnt > 1:
        print(f"SKIP: anchor for '{name}' is AMBIGUOUS ({cnt} matches) — apply by hand.")
        return src, False
    print(f"OK: applied '{name}'.")
    return src.replace(old, new, 1), True

def main():
    expect()
    with open(TARGET, "r", encoding="utf-8") as f:
        src = f.read()

    # ---- Edit 1: entry "Join" button -> phone instead of code ----
    src, _ = apply(
        src, "entry-join->invite_phone",
        "onClick={e => { e.stopPropagation(); setRole(null); setScreen('invite_code'); }}",
        "onClick={e => { e.stopPropagation(); setRole(null); setScreen('invite_phone'); }}",
    )

    # ---- Edit 2: phone handler calls /register (drop code), not /invite/consume ----
    OLD_CALL = """    // On invite path: call /invite/consume first so the users row exists before send-otp
    if (screen === 'invite_phone') {
      try {
        const cr = await fetch(`${API_BASE}/api/v2/invite/consume`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code:  inviteCode.trim(),
            kind:  isVendor ? 'maker' : 'dreamer',
            phone: e164,
            name:  inviteName.trim() || undefined,
          }),
        });
        const cd = await cr.json();
        if (!cd.ok) {
          showToast(cd.error || 'Could not verify invite. Try again.');
          return;
        }
        // ok — account confirmed/created, fall through to send OTP
      } catch { showToast('Could not connect. Try again.'); return; }
    }"""
    NEW_CALL = """    // Open signup: create the account (no invite code) before send-otp.
    if (screen === 'invite_phone') {
      try {
        const cr = await fetch(`${API_BASE}/api/v2/register`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind:  isVendor ? 'maker' : 'dreamer',
            phone: e164,
            name:  inviteName.trim() || undefined,
          }),
        });
        const cd = await cr.json();
        if (!cd.ok) {
          showToast(cd.error || 'Could not start sign-up. Try again.');
          return;
        }
        // ok — account created/confirmed, fall through to send OTP
      } catch { showToast('Could not connect. Try again.'); return; }
    }"""
    src, _ = apply(src, "consume->register", OLD_CALL, NEW_CALL)

    # ---- Edit 3: invite_phone back button -> 'entry' (code screen is now skipped) ----
    src, _ = apply(
        src, "invite_phone-back->entry",
        "<BackBtn onClick={() => setScreen('invite_code')} />",
        "<BackBtn onClick={() => setScreen('entry')} />",
    )

    with open(TARGET, "w", encoding="utf-8") as f:
        f.write(src)
    print("\nPiece 0 (dreamos-pwa) written. invite_code screen left dormant (unreachable).")
    print("Run `npx tsc --noEmit` before pushing.")

if __name__ == "__main__":
    main()
