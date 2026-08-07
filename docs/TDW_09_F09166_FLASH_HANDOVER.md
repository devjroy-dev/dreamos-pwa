# TDW_09 · F-09.166 — THE FICTIONAL-BRIDE FLASH
**Repo:** `dreamos-pwa` · 2 files · **applies on top of Rider 2's pwa ZIP**
**Founder walk, verbatim:** 「 every time the screen refreshes it shows hello priya 」

## Gates
`tsc` exit 0 · `tdw09_p2c` **52/52** · `tdw09_frost_parity` **75/75** (68 → 75) · seven mutations, all biting.

## The disease, at `sanctuary:4043-4048`
```js
const [days,     setDays]     = useState(176);
const [progress, setProgress] = useState(.38);
const [name,     setName]     = useState('Priya');
const [sinceYes, setSinceYes] = useState(47);
```
Fixture data for a bride who does not exist. Those are the exact figures in the founder's screenshot — 176 mornings, Hello Priya, ↑47 days. Every load, SSR frame and hydration alike, painted that stranger's masthead; the mount effect corrected it a frame later.

**Same class as the WINE-FLASH-FIX**, one commit before this arc: *"the E3 literal that painted one light frame dies."* A literal upstream of the real reader. **This arc did not cause it but did amplify it** — Fork 3 arm A put the numeral at `FT.numeral`, so a wrong figure that used to be 48px of glance is now 150px of the whole screen.

## NOT the same as F-05.38 — read past the cite
`sanctuary:4215-4234` already carries a cure for *"greeted as Priya, counting down to a stranger's wedding."* That is **F-05.38**, and it is a different mechanism: an ITP-wiped session blob, healed from server truth. **That cure could never have caught this one, because it runs inside an async effect and this paints before mount.** Same symptom, different disease. Filed separately rather than folded in.

## The cure is ABSENCE, not a better guess
A seed cannot be correct on a server that has no session to read, so **any** non-null seed is a fiction. All four go null and render nothing:
- The numeral **reserves its line box** (`minHeight`), so the empty frame does not shift the rail — F-09.111–.113's reserved-height primitive is the estate precedent.
- The **rail arc stays unconditional** (it is the track, and the track is always true); the **travelled arc and its dot** render only when position is known.
- The greeting renders **no sentence at all** until the name is known — not "Hello, ." and not a stranger's name.
- Four rail hints (`quiet`, `a page is waiting`, `Your timeline`, `Wednesday morning`) emptied: they asserted state before the server answered.
- **`getBrideName()`'s `return 'Priya'` fallback returns null.** That was the last reachable path to a stranger's name. **No word changed** — the greeting's null-guard decides whether the sentence exists.

## DISCLOSURE — "tsc 0" is NOT a null-safety witness in this repo
`tsconfig.json:13` sets `"strict": false`. I proved it: a `number|null` passed into `f(t:number)` compiles clean here. So `progress` flowing into `arcPoint(t:number)` raised **nothing**, and `1-null` would have quietly evaluated to `1`. Every guard in this delivery is **hand-derived and bench-asserted, not compiler-derived**, and the tsc line in my earlier verify blocks was weaker evidence than it looked for this class. Worth a chair ruling on whether `strict` should move; that is not this delivery's call.

## Mutations
| # | mutation | cell |
|---|---|---|
| Q-1 | the 176 seed returns | 8.1 RED |
| Q-2 | the Priya seed returns | 8.3 RED |
| Q-3 | the fallback returns Priya again | 8.3 RED |
| Q-4 | the arc draws before position is known | 8.4 RED |
| Q-5 | the numeral stops reserving its box | 8.5 RED |
| Q-6 | the greeting renders before the name | 8.6 RED |
| Q-7 | a hint asserts state before the server | 8.7 RED |

## Walk — two steps
1. Hard-refresh the sanctuary several times. **You should never see a number or a name that is not yours** — at worst a blank masthead for one tick.
2. Watch the rail while it settles. It should not jump.

Step 2 is the one to watch: reserved height is the difference between a clean settle and a visible shove.
