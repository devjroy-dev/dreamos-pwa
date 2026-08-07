# TDW_09 · PACKAGE 4 · ZIP 2 — F-09.146's CURE (the Discover door opens the real room)

**Repo:** dreamos-pwa · **Base:** `de1abd8` · **Executor:** Opus LE under the twenty-fifth chair · 2026-08-07
**Scope:** the ruled cure ONLY, arm (d). Nothing else. The session banks on delivery.

---

## 1 · THE FOUR RULED LIMBS, EACH DISCHARGED

**(1) `explore/page.tsx` deletes whole.** The sketch, its false header naming an un-imported `photoPager`, and the two string-cells that certified it. The deletion cannot ride `cp -r`, so it is a **named `rm` in the apply block** per §7's disclosed-extension clause — the only delivery this desk has shipped that carries one.

**(2) The Discover door targets the real room.** `BRIDE_DOORS` gains a `room` field; Discover is now `route: '/frost/canvas/sanctuary', room: 'discover'`, and the tap pushes `/frost/canvas/sanctuary?room=discover`. Sanctuary gains **one guarded effect** beside `openRoom`:

```
const deepLinkRef = useRef<string|null>(null);
useEffect(()=>{
  const param = roomParam;
  if(!param) return;
  if(deepLinkRef.current === param) return;
  if(!BASE_SLICES.some(sl=>sl.key===param)) return;
  deepLinkRef.current = param;
  openRoom(param as RoomKey);
},[roomParam,openRoom]);
```

It calls the conductor's **front door** and edits nothing inside the choreography. The sanctuary diff is **41 lines added, 0 removed** — additive by construction, so F-1's frozen region is untouched by arithmetic rather than by assurance. F-09.142 cures in the same act: sanctuary has a deep link now.

**(3) The bench asserts behaviour.** §5.7 and §5.8 are **retired with their corpses named in-file**. §8 replaces them by cutting the effect body out of the shipped sanctuary source and **executing it** against stubs. No param → the conductor is never called. `room=discover` → `openRoom('discover')`. A hostile param → nothing. The same param twice → one call. Two of the ten mutations (M9, M10) bite that executed logic, not its shape.

**(4) Row 13 inherits the param.** The deck extraction moves the bloom; the door keeps pointing at `?room=discover` and the effect keeps calling `openRoom`. **Zero nav change** — the chat-idiom pattern, and it is recorded here so the seam survives the seat change.

---

## 2 · DEVIATIONS, DISCLOSED — the chair may strike either line

**D-1 — THE EFFECT FIRES ONCE PER PARAM ARRIVAL, NOT ONCE PER MOUNT.** The ruling says *「 once at mount 」*. Derived: tapping Discover **while already on Home** is a client-side push to the *same pathname*; React does not remount the page, so a `[]` effect never re-fires and the room never opens. A mount-only form works from four doors and silently fails from the fifth — the most-travelled one. The shipped form guards on a ref keyed to the param value, which gives the same protection the ruling wanted (she closes the room; it does not spring back — benched at §8.5) without the hole. **If the chair prefers the strict wording, the hole returns with it and should be filed rather than shipped silently.**

**D-2 — ONE SUSPENSE BOUNDARY ADDED TO THE FROST LAYOUT.** `useSearchParams` requires a Suspense ancestor or Next bails the whole route to client rendering at build. `FrostLayout` now returns `<Suspense fallback={null}><FrostShell>…</FrostShell></Suspense>`; all hooks moved to `FrostShell` unchanged. Seated **once**, so the bar, the layout and sanctuary's reader all sit inside it instead of each growing its own. This is scaffolding the ruling implies but does not name.

---

## 3 · PROOF

| Gate | Result |
|---|---|
| `tdw09_p4_bar` **cured** | **57/57** |
| `tdw09_p4_bar` **uncured** (`de1abd8`) | **47/57** — ten reds, every cure cell among them |
| Mutations | **10/10 bitten**; M9 and M10 bite the executed deep-link logic |
| `tsc --noEmit` | **0** |
| Sanctuary diff | **+41 / −0** — choreography diff-zero by arithmetic |
| Whole floor, uncured vs cured | **byte-stable** — only the new bench's own line differs |
| `f0774` | **32/34** here, **33/35** on the founder's tree (F-09.144), same two attributed reds |

---

## 4 · WHAT THIS CURE DOES NOT DO

- **F-09.145 stays OPEN.** The bar's reservation still reserves nothing on `position:fixed` shells, so the bar overlays the bottom 62px of every CanvasShell canvas. Untouched here on the chair's 「 this cure only 」. **It is the next seat's first item**, and it is the most likely cause of the founder's *「 where is the feed swipe 」* — the bar sitting on a bottom band.
- **The back-button complaint is unexplained.** The two console probes were never run. Cause unestablished; no number minted, because I will not file a finding I have not convicted.
- **Relay #6's Discover shape** (thumbnail grid → all images → swipe browse as alternate) is the fresh seat's charter with `F-09.147–.155`. Nothing here presumes it: the door opens the real room today, and that room is what row 13 extracts and what relay #6 reshapes.

---

## 5 · THE FOUNDER'S TWO-STEP WALK

1. Tap **Discover** from Home. → The **real** Discover deck opens — swipe photos, swipe vendors, the filter control, Enquire. The bar shows DISCOVER lit, not HOME.
2. Close the room, then tap **Discover** again. → It opens again. Close it and leave it closed → it stays closed.

If step 1 opens the deck, F-09.146 is cured at the only witness that counts.

---

## 6 · THE SESSION BANKS HERE

Four shape-proofs in one delivery is the estate's own drift tell and the chair called it correctly. Banked on the chair's terms: this cure, verified, and no continuation. The fresh seat inherits this handover, relay #5, relay #6, **F-09.145 open**, the unexplained back button, and range `.147+`.
