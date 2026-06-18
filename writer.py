#!/usr/bin/env python3
# Piece 1b (dreamos-pwa) — two explicit entry doors, fixing the role bug.
#
# THE BUG: the single "Create account" button ran setRole(null) before going to
# the phone screen, so kind fell through to 'dreamer' and every signup became a
# bride/couple account regardless of intent.
#
# THE FIX: replace it with TWO buttons that each SET the role, then go to phone:
#   "I'm a vendor"      -> setRole('Maker')   -> invite_phone  (kind=maker)
#   "Plan my wedding"   -> setRole('Dreamer') -> invite_phone  (kind=dreamer)
# No role-clearing. send-otp (Piece 0.2) self-mints the correct role row.
#
# Anchors against the POST-0.1 live state (single gold "Create account" button).
# Anchor-guarded + idempotent.

import os, sys
ROOT = os.getcwd()
TARGET = os.path.join(ROOT, "app", "(landing)", "page.tsx")

def expect():
    if not os.path.isfile(TARGET):
        print(f"ERROR: {TARGET} not found — run from dreamos-pwa root. Aborting."); sys.exit(1)

OLD_BTN = """                <button
                  onClick={e => { e.stopPropagation(); setRole(null); setScreen('invite_phone'); }}
                  style={{
                    width: '100%', height: 48, background: '#C9A84C', border: 'none',
                    borderRadius: 100, cursor: 'pointer', touchAction: 'manipulation',
                    fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 400,
                    letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0C0A09',
                  }}
                >Create account</button>"""

NEW_BTNS = """                <button
                  onClick={e => { e.stopPropagation(); setRole('Maker'); setScreen('invite_phone'); }}
                  style={{
                    width: '100%', height: 48, background: '#C9A84C', border: 'none',
                    borderRadius: 100, cursor: 'pointer', touchAction: 'manipulation',
                    fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 400,
                    letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0C0A09',
                  }}
                >I'm a vendor</button>

                <button
                  onClick={e => { e.stopPropagation(); setRole('Dreamer'); setScreen('invite_phone'); }}
                  style={{
                    width: '100%', height: 48, background: 'transparent',
                    border: '0.5px solid rgba(248,247,245,0.25)', borderRadius: 100,
                    cursor: 'pointer', touchAction: 'manipulation',
                    fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300,
                    letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F8F7F5',
                  }}
                >Plan my wedding</button>"""

def main():
    expect()
    s = open(TARGET, encoding="utf-8").read()
    if "I'm a vendor" in s and "Plan my wedding" in s:
        print("SKIP: two-button entry already applied.")
        return
    if OLD_BTN not in s:
        print("SKIP: 'Create account' button anchor not found (expected post-0.1 live state).")
        print("      Apply Piece 0/0.1 first, or replace the single Create-account button with two")
        print("      role-setting buttons by hand: setRole('Maker') and setRole('Dreamer').")
        return
    s = s.replace(OLD_BTN, NEW_BTNS, 1)
    open(TARGET, "w", encoding="utf-8").write(s)
    print("OK: entry now has two doors — \"I'm a vendor\" (Maker) and \"Plan my wedding\" (Dreamer).")
    print("\nPiece 1b (dreamos-pwa) written. Run `npx tsc --noEmit` before pushing.")

if __name__ == "__main__":
    main()
