# CE-41 · SEAT E → CHAIR · THE FOUNDER'S BRAND WALK, 2026-09-09

**Walked at `dreamos-pwa` `d274a07d03869b32d5f4a17c3c63b5086d0aa22a` (R-41.126 sealed), at 374 on the founder's own glass. Two findings, both against this seat's rider, both his eyes and not a cell.**

Screenshots in this folder:
- `walk-landing-374.png` — the landing hero, `thedreamwedding.in`
- `walk-vendor-support-374.png` — the vendor shell, `/vendor/support`
- `lockup-at-374.png` — the lockup drawn at three heights, true pixel size on a 374 strip (this seat's derivation, not a capture)

---

## F-A · THE LOCKUP IS A HORIZONTAL LOCKUP AND I SIZED IT BY HEIGHT

**Founder's words:** *"theres something wrong. the TDW and the wedding os should be on the same line."*

**What I did.** R-41.126 (c) said the wordmark becomes `lockup-for-dark-ground.png` *"at the same height"*. The type it replaced was Cormorant italic 20/1.15, so I set `height: 23` and preserved the row's baseline. That is what the spec asked for and it is the wrong instruction to have followed without checking the file.

**What the file actually is,** derived by command from `public/brand/lockup-for-dark-ground.png`:

| | |
|---|---|
| canvas | 2267 × 640 |
| ink box | x 69–2207, y 194–445 — **8.52 : 1** |
| content | the `TDW` monogram, a vertical rule, then `THE DREAM WEDDING` in spaced caps |
| the words' own cap height | 77px of the file's 640 |

It is a **horizontal lockup**, and a horizontal lockup's legibility is governed by its **width**, not its height. At `height: 23` it renders **158px wide** and the words' caps land at **7px** — under the shell's own 11px type floor (`TYPE_FLOORS.label`) by a third. That is the mush in `walk-landing-374.png`.

**What it would take to be legible, derived:**

| words at | lockup height | width at 374 |
|---|---|---|
| 11px (the shell's floor) | 36px | **247px** |
| 12px | 39px | 333px |
| 14px | 46px | **389px — wider than the phone** |

So on a 374 screen the horizontal lockup is legible only in a narrow band, and at the size that actually reads well it does not fit. `lockup-at-374.png` shows all three at true size; the chair can judge the band rather than take my word for the arithmetic.

**Three ways out. None is mine to choose — the family is the founder's cut.**

1. **The lockup at 36px, words at the 11px floor.** Fits (247 of 374). The header's brand mass roughly doubles, and the `The Wedding OS` line beneath then has a 247px-wide object above it, which is the crowding the founder is reacting to.
2. **A seal-only mark plus type.** The `TDW` monogram alone is 3:1 and reads at 28–32px in about 90px of width. The wordmark stays as type beside or beneath it. **This needs a file the family does not contain** — a monogram cut with its own margins — so it is a brand ask, not a code change.
3. **The founder's own instruction, literally:** `TDW` left, `THE WEDDING OS` right, one row. That is closest to option 2 and still needs the monogram file.

**Revert is one line** in either surface if the chair wants the type back while the family gains a monogram.

**The same arithmetic hits the cockpit masthead** (R-41.126 (d)), which I set to `height: 25` → 213px wide, words at 8px. It has not been walked yet and it is wrong for the same reason. Whatever is ruled for the landing applies there.

---

## F-B · THE VENDOR SHELL'S MASTHEAD IS THE LAST ONE STILL TYPE

**`walk-vendor-support-374.png`:** the vendor shell header reads `The Dream Wedding` / `BUSINESS SOLUTIONS BETA` in type. No lockup, no seal.

**This is not a defect against the rider** — R-41.126 named two surfaces, the landing header and the cockpit masthead, and the rider did both. It is a **gap in the ruling**: after the rider, the estate has a lockup on the landing, a lockup in the cockpit, and type in the room the vendor actually lives in. That is the surface Swati sees every day and the only masthead a paying vendor ever looks at.

It is also the shell seat's file, not this seat's — `components/worklist/WorklistShell.tsx` — so this seat does not touch it and files the gap instead.

Whatever F-A settles should settle this at the same time, because the vendor shell has **both arms** and would need the same dark/light decision the cockpit masthead is already carrying as this seat's flagged reading.

---

## WHAT IS NOT WRONG, SO THE CHAIR CAN SET IT ASIDE

- The icons. Every app icon and favicon is a gold seal on Graphite `#141516`, which is `GRAPHITE['page-bg']` exactly, so icon, splash and status bar agree by construction. `ce41_brand_family` is 15/0 at the pushed tree, and the PWA install walk (home-screen icon, Android splash, notification badge) is still open and unaffected by F-A.
- The wiring. Five manifests, the service worker, three apple-touch sizes and the favicon all point at `public/brand/` and every path exists on disk.
- `theme-color`, still derived from `GRAPHITE['page-bg']`.

## WHAT THIS SEAT GOT WRONG, PLAINLY

I read *"at the same height"* as an instruction and executed it. The file's aspect ratio was one command away and I did not run it before writing the `<img>` — I ran it only after the founder said the header looked weird. A picture that replaces type has to be checked against the type it replaces at the size it will actually render, and that check is not the spec's job, it is the seat's. Same class as c-41.65: a belief where a derivation was available.

**Derived at `d274a07`, 2026-09-09. STOP — the chair rules F-A; F-B is routed wherever the chair sends it.**
