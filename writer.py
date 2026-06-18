#!/usr/bin/env python3
# Piece 0.1 — dreamos-pwa — put up the sign on the open door.
#
# Piece 0 opened the signup road (entry -> phone -> /register -> OTP) but the
# entry button still reads "I have an invite" and a now-pointless "Request an
# invite" button still shows. This:
#   1. Relabels the primary gold button "I have an invite" -> "Create account".
#      (Its onClick already routes to invite_phone after Piece 0.)
#   2. Removes the "Request an invite" button (waitlist is moot once signup is open).
#      The request_* screens stay in the file, just unreachable from entry.
#   3. Leaves "Sign in" untouched.
#
# Anchor-guarded + idempotent. If an anchor isn't found, it SKIPs with a manual note.

import os, sys

ROOT = os.getcwd()
TARGET = os.path.join(ROOT, "app", "(landing)", "page.tsx")

def expect():
    if not os.path.isfile(TARGET):
        print(f"ERROR: {TARGET} not found — run from dreamos-pwa repo root. Aborting.")
        sys.exit(1)

def apply(src, name, old, new):
    if new in src and old not in src:
        print(f"SKIP: '{name}' already applied.")
        return src
    c = src.count(old)
    if c == 0:
        print(f"SKIP: anchor for '{name}' NOT FOUND — apply by hand. Looked for:\n      {old.strip()[:100]}")
        return src
    if c > 1:
        print(f"SKIP: anchor for '{name}' AMBIGUOUS ({c}) — apply by hand.")
        return src
    print(f"OK: applied '{name}'.")
    return src.replace(old, new, 1)

def main():
    expect()
    with open(TARGET, "r", encoding="utf-8") as f:
        src = f.read()

    # 1. Relabel primary button text.
    src = apply(src, "relabel primary -> Create account",
                ">I have an invite</button>",
                ">Create account</button>")

    # 2. Remove the "Request an invite" button (whole element).
    REQUEST_BTN = """                <button
                  onClick={e => { e.stopPropagation(); setScreen('request_who'); }}
                  style={{
                    width: '100%', height: 48, background: 'transparent',
                    border: '0.5px solid rgba(248,247,245,0.25)', borderRadius: 100,
                    cursor: 'pointer', touchAction: 'manipulation',
                    fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300,
                    letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F8F7F5',
                  }}
                >Request an invite</button>

"""
    src = apply(src, "remove Request-an-invite button", REQUEST_BTN, "")

    with open(TARGET, "w", encoding="utf-8") as f:
        f.write(src)
    print("\nPiece 0.1 written. Entry is now: Create account · Sign in.")
    print("Run `npx tsc --noEmit` before pushing.")

if __name__ == "__main__":
    main()
