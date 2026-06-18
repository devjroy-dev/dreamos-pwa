#!/usr/bin/env python3
# Piece 0.2 — dreamos-pwa — drop the /register pre-call.
#
# send-otp now self-mints the account (dream-os Piece 0.2), so the phone screen
# no longer needs a separate /register call before sending the code. Removes the
# whole invite_phone -> /register block; the handler now goes straight to send-otp.
#
# Anchor-guarded + idempotent.

import os, sys
ROOT = os.getcwd()
TARGET = os.path.join(ROOT, "app", "(landing)", "page.tsx")

def expect():
    if not os.path.isfile(TARGET):
        print(f"ERROR: {TARGET} not found — run from dreamos-pwa root. Aborting."); sys.exit(1)

def main():
    expect()
    with open(TARGET, "r", encoding="utf-8") as f:
        src = f.read()

    # The /register pre-call block introduced in Piece 0 (post-Piece-0 state).
    REG_BLOCK = """    // Open signup: create the account (no invite code) before send-otp.
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
    }

"""
    REPLACEMENT = "    // Open signup: send-otp self-mints the account from the phone — no pre-call needed.\n\n"

    if "send-otp self-mints the account from the phone" in src:
        print("SKIP: /register pre-call already removed.")
    elif REG_BLOCK in src:
        src = src.replace(REG_BLOCK, REPLACEMENT, 1)
        print("OK: removed /register pre-call; phone screen calls send-otp directly.")
    else:
        # Fallback: maybe still on the original /invite/consume block (Piece 0 not applied here).
        print("SKIP: /register block anchor not found. If this tree still calls /invite/consume,")
        print("      apply Piece 0 first, or remove the pre-call block by hand so invite_phone goes straight to send-otp.")

    with open(TARGET, "w", encoding="utf-8") as f:
        f.write(src)
    print("\nPiece 0.2 (dreamos-pwa) written. Run `npx tsc --noEmit` before pushing.")

if __name__ == "__main__":
    main()
