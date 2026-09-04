# TDW_19 P2-A · HOTFIX S7 — HANDOVER

**Base:** `dreamos-pwa @ 70dd458` (branch `worklist`) · sibling `dream-os @ d8f20e8`, untouched.
**Charter:** CE-39 kickoff 2026-08-29, plus the CE-39 ruling on read-first (four rulings, veto YES)
and the CE-39 ruling on the mid-sitting bank.
**Role:** executor. Nothing pushed. The founder is the sole pusher.

---

## 1 · WHAT SHIPPED

Two findings cured, four filed, one seat correction disclosed.

- **F-19.43** — four `font:` shorthands on `/v/` carried `inherit`, which is a parse error inside a
  shorthand. The browser discarded each declaration whole and the elements inherited 14px/400 from
  `.pv`. Longhanded at all four sites.
- **F-19.p1** — `white-space:nowrap` on the colophon **struck** (CE-39 ruling 1). At 9px the line is
  flush to the column at 374 and still overflowed a 320px phone.
- **F-19.44** — every photograph now **displaces the hero** instead of opening in a new tab. Hidden
  radios, a stacked hero, `<label>` thumbnails, zero client JavaScript.
- **F-19.p2** — the strip renders **all** photographs, the hero's own included (CE-39 ruling 2, arm a),
  so the hero is returnable.
- **F-19.p3** — F-19.38's `min-width:0` cure and both focus rings moved onto the new flex item
  (CE-39 ruling 3), and the cells that guard them now derive that element from the markup.
- **F-19.p4** — new, found while building: `C33` was reading a roster of tag names and went RED on a
  correct page. Retired with its reader.
- **s-1** — seat correction, disclosed in band: the F-19.43 explanatory comment was first written
  *inside* the `<style>` template literal carrying twenty backticks. `bs_audit` C37 clause 1 caught it
  on the first run. Stripped. That is the second time prose has broken that literal and the second
  time this cell has paid for itself.

---

## 2 · WHAT MOVED (F-19.34)

| File | State | What changed |
|---|---|---|
| `app/v/[code]/page.tsx` | MODIFIED | four `font:` shorthands → longhands; `nowrap` struck; hero anchor and strip anchors removed; radios, hero stack and `<label>` thumbnails added; `rest` → `gallery`; `PublicStyles` takes `heroCount` |
| `lib/public/heroSelectRules.mjs` | **NEW** | the per-photograph index rules, generated; imported by both the page and the gate |
| `tools/bs_audit.mjs` | MODIFIED | **C40, C41, C42 added**; C33, C34, C37, C39 amended by label; `INCO` verdict added |
| `tools/pv_render.cjs` | MODIFIED | `§1.9` retired with its anchors; `§1.10/§1.10b` (R-a) and `§1.11–§1.11f` (R-b) added; collectors repointed |
| `docs/COPY_REGISTER_TDW19.md` | MODIFIED | two ADD rows, founder-vetoed 2026-08-29 |
| `docs/TDW_19_P2A_HOTFIX_S7_HANDOVER.md` | **NEW** | this file |

**Nothing else was touched.** No SQL. No migration. No root layout. No `/r/` source (C40 *reads* it;
it needed no change). No soul, lens, prompt or engine file — W-1 untouched. `dream-os` untouched.

### ⚠ THREE VISIBLE CHANGES THAT ARE THE CURE, NOT A DEFECT — for walk 5

F-19.43 is described as a colophon bug. Its cure retypes **three** elements, because all three were
inheriting the same wrong values from the same broken shorthand:

1. **Enquire button** — was rendering 14px weight 400; now renders **12px weight 500**, as declared
   since S5. Smaller and slightly bolder.
2. **Demo note** — was rendering 14px; now renders **11px**, as declared. Noticeably smaller, on demo
   cards only.
3. **The strip** — now opens with **the hero photograph's own thumbnail**, ringed in gold as the
   selected one. It was previously excluded. This is CE-39 ruling 2.

None of these is new copy and none is a regression. They are what the page said all along.

---

## 3 · PROOF

### The gate, re-derived on the exact tree in this ZIP

```
42 PASS · 0 FAIL · 0 INCO
```

39 cells at charter → 42. `node_modules` present, sibling `dream-os` present, both tips named in §0.

### Both-ways non-vacuity — every mutation on PRODUCTION SOURCE, never test setup

| Mutation | Reds |
|---|---|
| restore `font:400 9px/1.4 inherit` + `nowrap` at `.pv-colophon` | **C40, C41** |
| restore one `<a>` around a strip photograph | **C33, C37, C39** |
| delete `min-width:0` from `.pv-strip label` | **C33, C37** |
| drop the generated reduced-motion escape from the module | **C34** |

Tree restored to `42 PASS · 0 FAIL · 0 INCO` after each.

### `tsc --noEmit` — exit 0.

### The Next build — a DECLARED GAP, and it is not this delivery's

`npx next build` fails here with four `Failed to fetch <font> from Google Fonts` errors:
`fonts.googleapis.com` is denied at this container's egress and `app/layout.tsx` loads four Google
fonts. **Proven pre-existing** by stashing this work and rebuilding the untouched tree at `70dd458`:
identical four errors, same count. Neither run produced `Module not found` or `Can't resolve`, so
Turbopack resolved `@/lib/public/heroSelectRules.mjs`. That is a **resolution witness, not a green
build**, and it is stated as such. Vercel's own build on the branch alias is the settling witness and
it is the founder's card, step ①.

### `pv_render` — every cell REFUSED-egress, and the arm said so itself

Run against the branch alias from this container:

```
STOP — the document served is not this estate's.
  body : "Host not in allowlist: dreamos-pwa-git-worklist-devjroy-devs-projects.vercel.app…"
  No verdict is taken.
```

F-19.37's identity gate fired and refused, which is the correct behaviour and is the evidence.
**R-a and R-b are written, shipped, and REFUSED — not omitted and not claimed.** They will run the
day egress opens or from a machine that can reach the deploy.

| Cell | Verdict this sitting |
|---|---|
| `§1.10` R-a colophon computes 9px | REFUSED-egress |
| `§1.10b` R-a no horizontal scroll at 374 | REFUSED-egress |
| `§1.11 … §1.11f` R-b tap displaces the hero | REFUSED-egress |
| all pre-existing `§1`/`§2`/`§3` cells | REFUSED-egress |

**A run of refusals is not green.** Nothing above is offered as a pass.

### C41 / C42 — the provable equivalent (CE-115), named FIXTURE-RENDER everywhere

Because the deploy is unreachable and this defect needs no network, `bs_audit` boots a real browser
over the page's **own verbatim stylesheet** plus the **real generated rules** from the same module
the page calls — nothing retyped.

- **C41** at **320 and 374**: colophon computes `9px`, CTA `12px/500`, demo note `11px`,
  `documentElement.scrollWidth <= innerWidth` at both. Printed: `320: colophon 9px, doc 320/320 ·
  374: colophon 9px, doc 374/374`.
- **C42**: real click on `label[for="pv-h1"]` → layer 2 shown, layer 1 hidden, ring on the selected
  thumbnail, **URL unchanged, history length unchanged, no new page**, and tapping thumbnail 1 brings
  the hero back.

**It proves what the CSS does. It proves nothing about images, arrival, the service worker, or what
the founder's glass shows.** Those stay the founder's card and `pv_render`'s job.

---

## 4 · FOUNDER CARD — six steps, on the branch alias

**URL:** `https://dreamos-pwa-git-worklist-devjroy-devs-projects.vercel.app/v/DEV440`

Open it, then open the browser console (Chrome on Android: connect to a desktop, or use Safari's
Web Inspector on iOS). Steps ①–③ are exact strings — paste each on its own and read the answer back.

**① — which build am I looking at?**

```
document.querySelector('meta[name="tdw-build"]').content
```

Expected: the commit hash of the push you are about to make. **If it is not, stop — everything below
is about a different page** (F-19.37, and it has cost this block four gate runs already).

**② — the colophon's real size**

```
getComputedStyle(document.querySelector('.pv-colophon')).fontSize
```

Expected: `"9px"`. It read `"14px"` before this cure.

**③ — does the page still slide sideways?**

```
document.documentElement.scrollWidth <= window.innerWidth
```

Expected: `true`. It was `508 <= 374` — false — before this cure.

**④ — the photographs.** Scroll to the strip under the gold rule. The **first** thumbnail is the big
picture at the top, and it has a thin gold ring. Tap the **second** thumbnail. The picture at the top
should change to it, the ring should move, **the address bar must not change and no new tab must
open**. Then tap the **first** thumbnail — the original picture should come back.

**⑤ — the address.** Tap `thedreamwedding.in` in the small grey line at the very bottom. It should
open the site.

**⑥ — the demo card.** Open `/v/makeupbyswatiroy`. It should render the card, and there should be no
review link on it.

**Six green = P2-A HOTFIX S7 sealed.** You perform; the evidence is mine to read.

---

## 5 · OPEN, AND WHAT THE NEXT SITTING PICKS UP

- **R-a and R-b are unwitnessed.** They ship REFUSED. First environment that can reach the deploy
  runs `node tools/pv_render.cjs <base-url>` and the results settle them.
- **F-19.p1 … F-19.p4 are placeholder ids.** The chair serializes at the seal; none of them is a
  chair number and none is in `FINDINGS_LOG` — this handover is not a CE-numbered entry.
- **The browser's own image viewer is gone.** CE-38's shape (1) gave every photograph pinch, rotate,
  save and share for zero bytes; the 2026-08-29 ruling supersedes it. §7d P2-B's swipe viewer is the
  successor and `lib/frost/photoPager.ts` is still named as the reuse. Recorded so the loss is on the
  record rather than discovered later.
- **All N hero layers are in the DOM at once**, `aria-hidden` and `alt=""`, so a screen reader is not
  read the whole set as the hero. The same photographs are announced once each, by name, on the
  radios in the strip — which is also the only place they can be selected. Stated as a known
  limitation of a CSS-only gallery, not as a finished a11y position.
- **`S7_RECOVERY.patch` ships beside this ZIP, outside `deploy/`.** It exists only for §11 emergency
  recovery — `git am` if the delivery is ever lost between here and origin. **It is not applied as
  part of this delivery and the apply chain does not touch it.**
