# P7.2 · ZIP 1b — THE RETIRED CELLS, QUOTED

Every cell retired in ZIP 1b, verbatim, with the bench it came from and why it left. The
ledger lives in the repo because a retirement whose assertion is only in a chat transcript is
a retirement nobody can audit. Chair ruling 2026-09-04 (file-grain retire-with-the-reader).

Base: `worklist` 039d005. Every "zero hits" below was derived by grep at that tip across
`app/vendor/(shell)` and `components/worklist`.

---

## `scripts/tdw09_home.proof.mjs` — FILE RETIRED (deleted)

**Subject:** `app/vendor/page.tsx`, the old Victor chat home, DELETED at the flip (R-39.24).
**Live-twin check:** `WaitingZone`, `WeekStrip`, `FirstRunExemplars`, `EnquiryCard`,
`QUICK_ACTIONS` — **zero hits**. The shell's Today room is a different surface with its own
b40 cells, not a twin; nothing was re-keyed onto it.
**Disposition:** 57 of 65 cells read the dead page (or `OnboardingOverlay.tsx`, deleted with
it) and retire here. The 8 live cells moved VERBATIM to `scripts/tdw09_home_live.proof.mjs`
(§6 ×4 on `useVendorData.ts`, §7 on the demo studio, §8 on `InputBar.tsx`, §10 ×2 on
`useChat.ts`), proven non-vacuous: renaming `useTodayData` reds 4 of 8.

**The 57, verbatim:**

```js
 1. cell('1', 'WaitingZone defined',        has(HOME, 'function WaitingZone('));
 2. cell('1', 'WaitingZone rendered',       has(HOME, '<WaitingZone'));
 3. cell('1', 'WeekStrip defined',          has(HOME, 'function WeekStrip('));
 4. cell('1', 'WeekStrip rendered',         has(HOME, '<WeekStrip'));
 5. cell('1', 'FirstRunExemplars defined',  has(HOME, 'function FirstRunExemplars('));
 6. cell('1', 'FirstRunExemplars rendered', has(HOME, '<FirstRunExemplars'));
 7. cell('1', 'ceiling of three',           has(HOME, 'all.slice(0, 3)'));
 8. cell('2A', 'WaitingZone collapses on empty', /function WaitingZone[\s\S]{0,1400}?all\.length === 0\) return null;/.test(HOME || ''));
 9. cell('2A', 'WeekStrip collapses on empty', /function WeekStrip[\s\S]{0,600}?week\.length === 0\) return null;/.test(HOME || ''));
10. cell('2B', 'non-empty branch renders lines', has(HOME, 'shown.map('));
11. cell('2B', 'no all-clear card',  none(HOME_CODE, 'All clear') && none(HOME_CODE, 'all clear'), 'guard');
12. cell('2B', 'no nothing-waiting card', none(HOME_CODE, 'Nothing waiting') && none(HOME_CODE, "You're all caught up"), 'guard');
13. cell('3', 'retirement predicate is a named function', has(HOME, 'function isFirstRun('));
14. cell('3', 'predicate gates the render',   has(HOME, 'firstRun'));
15. cell('3', 'unknown is not empty', /function isFirstRun[\s\S]{0,400}?if \(!today\) return false;/.test(HOME || ''));
16. cell('3', 'retires on a lead',      /open_leads_count \?\? 0\) === 0/.test(HOME || ''));
17. cell('3', 'retires on money',       /money\.outstanding \?\? 0\) === 0/.test(HOME || ''));
18. cell('3', 'retires on a week',      /this_week\?\.length \?\? 0\) === 0/.test(HOME || ''));
19. cell('3', 'exemplars seed the input', has(HOME, 'onAct={act}'));
20. cell('3', 'seed reaches InputBar',    has(HOME, 'initialValue={seed || draft || undefined}'));
21. cell('4', 'owed cell formats through the canon', has(HOME, 'fmtRs(owed)'), 'guard');
22. cell('4', 'waiting money formats through the canon', has(HOME, 'fmtRs(inv.amount_owed)'));
23. cell('4', 'no rupee glyph',  none(HOME, '\u20B9'), 'guard');
24. cell('4', 'no L shorthand',  !/\bRs ?\d+(\.\d+)?L\b/.test(HOME || ''), 'guard');
25. cell('4', 'no k shorthand',  !/\bRs ?\d+(\.\d+)?[kK]\b/.test(HOME || ''), 'guard');
26. cell('4', 'no Cr shorthand', !/\bRs ?\d+(\.\d+)?Cr\b/.test(HOME || ''), 'guard');
27. cell('5', 'exactly one ChatThread mount', count(HOME, '<ChatThread') === 1, 'guard', `found ${count(HOME, '<ChatThread')}`);
28. cell('5', 'exactly one InputBar mount',   count(HOME, '<InputBar') === 1, 'guard', `found ${count(HOME, '<InputBar')}`);
29. cell('5', 'the rise exists',              has(HOME, 'const [risen, setRisen]'));
30. cell('5', 'the rise is dismissible',      has(HOME, 'setRisen(false)'));
31. cell('5', 'the raise touches no chat wire', has(HOME, 'onFocusCapture'));
32. cell('6', 'both readers on the engine count', count(HOME_CODE, 'today?.open_leads_count ?? 0') === 2, 'cure', `found ${count(HOME_CODE, 'today?.open_leads_count ?? 0')}, expected 2`);
33. cell('6', 'the capped legacy read is gone', none(HOME_CODE, 'context?.new_leads?.length'));
34. cell('6', 'never the capped display list',  none(HOME_CODE, 'new_leads.length'), 'guard');
35. cell('6', 'trigger two is at the caller',   has(HOME, 'todayRefreshRef.current()'));
36. cell('7', 'EnquiryCard has no definition', none(HOME_CODE, 'function EnquiryCard('));
37. cell('7', 'EnquiryCard has no mount',      none(HOME_CODE, '<EnquiryCard'), 'guard');
38. cell('7', 'QUICK_ACTIONS is gone',         none(HOME_CODE, 'const QUICK_ACTIONS'));
39. cell('8', 'Reply → (R-O19)',        has(HOME, "verb: 'Reply \u2192'"));
40. cell('8', 'Remind → (R-O21)',       has(HOME, "verb: 'Remind \u2192'"));
41. cell('8', 'Confirm → (R-O19)',      has(HOME, "verb: 'Confirm \u2192'"));
42. cell('8', 'overflow line (R-O19)',  has(HOME, '\u2026and ${extra} more \u2192'));
43. cell('8', 'Example, never Hint',    has(HOME, '>Example<') && none(HOME_CODE, '>Hint<'));
44. cell('8', 'exemplar one (R-O19)',   has(HOME, 'Hold 14 Dec for the Kapoor mehndi'));
45. cell('8', 'exemplar two (R-O19)',   has(HOME, "What's owed this month?"));
46. cell('8', 'welcome headline (R-O20)', has(ONBOARD, "headline: 'Ask anything.'") && none(ONBOARD, "'Ask DreamAi\\nanything.'"));
47. cell('9', 'ceiling moved to twenty', has(HOME, 'n <= 20 ? words[n]'));
48. cell('9', 'twelve spells',           has(HOME, "'Twelve'"));
49. cell('9', 'the old ceiling is gone', none(HOME_CODE, 'n <= 10 ? words[n]'));
50. cell('11', 'the strip declares its conditional', has(HOME, 'DECLARED CONDITIONAL'));
51. cell('11', 'it names the covenant site',        has(HOME, 'day.js:59'));
52. cell('12', 'the risen room is not an overlay', none(HOME_CODE, "position: 'absolute', inset: 0"), 'guard');
53. cell('12', 'no z-index war at the foot', none(HOME_CODE, 'zIndex: 41'), 'guard');
54. cell('12', 'the column has a grower at rest', /\{!risen && <div style=\{\{ flex: 1, minHeight: 0 \}\} \/>\}/.test(HOME_CODE || ''));
55. cell('12', 'the risen room grows to fill', /\{risen && \([\s\S]{0,200}?flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,/.test(HOME_CODE || ''));
56. cell('13', 'both halves of the greeting spell', none(HOME_CODE, '${owedCount} invoices remain'));
57. cell('13', 'the invoice half runs through spell()', has(HOME_CODE, 'spell(owedCount)'));
```


---

## `scripts/tdw09_p2r1.proof.mjs` — FILE RETIRED (deleted)

**Subject:** F-09.91 arm (b), the books door and the room word. Three of its four subjects were
DELETED at the flip (R-39.24): `components/vendor/Cabinet.tsx`, `components/vendor/VictorModeChip.tsx`
and `app/vendor/page.tsx`.
**Live-twin check:** `cab-orn`, `cabEmber`, `tdw-open-books`, `VictorModeChip` — **zero hits**
across `app/vendor/(shell)` and `components/worklist`. The books door is a Rooms tile and a nav
seat now, not an event on a crest; the room word is the drawer's, not a chip's.
**Disposition:** 11 cells retire here; the 2 `app/globals.css` cells moved VERBATIM to
`scripts/tdw09_p2r1_live.proof.mjs` (chair ruling: the Cabinet/VictorModeChip cells retire, the
globals.css reads stay), proven non-vacuous — breaking `.dd-cab .cab-sheet{` reds 1.5.
**Evidence in history:** `git show 039d005:scripts/tdw09_p2r1.proof.mjs`.

**The 11, verbatim:**

```js
 1. cell('1.1', !/cab-orn/.test(cabSrc) && !/function lift\(/.test(cabSrc) && !/lifting/.test(cabSrc), 'the crest button + lift() + lifting state are gone from code');
 2. cell('1.2', cabSrc.includes("addEventListener('tdw-open-books'") && cabSrc.includes('removeEventListener'), 'Cabinet listens for tdw-open-books, with cleanup (the positive pair)');
 3. cell('1.3', cab.includes('F-09.91'), 'the tombstone names the finding');
 4. cell('1.6', homeSrc.includes("new CustomEvent('tdw-open-books')") && homeSrc.includes('aria-label="Open your books"'), 'the ledger strip dispatches the event and says what it opens');
 5. cell('1.7', homeSrc.includes('onKeyDown') && /role="button" tabIndex=\{0\}/.test(homeSrc), 'keyboard door too — Enter/Space open the books');
 6. cell('1.8', /onPointerDown=\{\(\) => setPressed\(true\)\}[\s\S]{0,400}pressedStyle\(pressed, reducedMotion\)/.test(homeSrc), 'the strip wears F-09.21 pressed (suppression with replacement)');
 7. cell('2.1', /onMode\?: \(m: VictorMode \| null\) => void/.test(chip) && /onMode\?\.\(mode\)/.test(chip), 'the chip publishes its room (optional, additive — one control, one truth)');
 8. cell('2.2', homeSrc.includes('onMode={setVictorRoom}') && homeSrc.indexOf('onMode={setVictorRoom}') > homeSrc.indexOf('{risen && (') && !/useVictorMode/.test(homeSrc), 'home mirrors the chip AT ITS NEW SEAT, never calls the hook twice');
 9. cell('2.3', !/fontStyle: 'italic'/.test(homeSrc.split("victorRoom === 'business'")[1]?.slice(0, 900) ?? "fontStyle: 'italic'") && /victorRoom === 'business'[\s\S]{0,200}T\.accent : A\.brassWarm/.test(homeSrc), "one register — Business brass, no italic arm survives at the masthead (founder arm (a))");
10. cell('2.4', /victorRoom === 'business' \? 'Business' : victorRoom === 'advisor' \? 'Advisor' : 'Chat'/.test(homeSrc), "Advisor in primary ink, unknown room falls back to the standing 'Chat' byte");
11. cell('2.5', home.includes("chip's vetoed pair"), 'the words are the chip\u2019s own vetoed pair — no new vocabulary, stated in-comment');
```


---

## `scripts/tdw09_type.proof.mjs` — THREE MUTATION CELLS RETIRED (file stays)

**Subject:** `app/vendor/studio/team/page.tsx`, DELETED at the flip (R-39.24).
**§0.2 derivation at 039d005:** the replacement surface `components/worklist/StudioSheets.tsx`
(MemberSheet) carries **zero** `fontSize` literals — it types through the CSS rungs
(`var(--wl-t1)`, `.wl-fi`, `.wl-fl`). No site exists with the size tuple these cells mutate;
rewriting the fragments would mean inventing a literal on a token-driven surface. **F-39.83**
opens a fresh token-discipline bench in the rung vocabulary.

**Effect on the base:** the bench moves ERROR → RED. An earlier sweep had commented the path
out of `okMutate`'s argument list, shifting the arguments so a code fragment became the file
path and `readFileSync` threw (c-P72.10). Its three remaining failures (A.1, C.1, C.2) are the
base's own, unchanged.

**The three, verbatim:**

```js
await okMutate('§M.1 §A.1 reds when one body site is put back under the floor',
  // 'app/vendor/studio/team/page.tsx' — RETIRED from this read set at P7.2: the page was deleted with the old tree (the Studio Suite is the shell's Team room; StudioSheets.tsx is already in the set where it belongs)
  "fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, outline: 'none', boxSizing: 'border-box',",
  "fontFamily: F.body, fontWeight: 300, fontSize: 13, lineHeight: 1.5, outline: 'none', boxSizing: 'border-box',",
  async () => { const { m, c } = await read(); assert.strictEqual(c.body.filter(b => b.size < m.BODY_FLOOR).length, 0); },
  '§A.1');

await okMutate('§M.3 §C.2 reds when an ad-hoc size re-enters the tree',
  // 'app/vendor/studio/team/page.tsx' — RETIRED from this read set at P7.2: the page was deleted with the old tree (the Studio Suite is the shell's Team room; StudioSheets.tsx is already in the set where it belongs)
  "fontSize: 20, lineHeight: 1.5, color: D.cream, marginBottom: 4",
  "fontSize: 23, lineHeight: 1.5, color: D.cream, marginBottom: 4",
  async () => {
    const { m, c } = await read();
    const rungs = new Set([...m.RUNGS.register, ...m.RUNGS.body]);
    assert.strictEqual([...c.sizes.keys()].filter(s => !rungs.has(s)).length, 0);
  },
  '§C.2');


await okMutate('§M.4 §B.3 reds if the register drops below its own floor again',
  // 'app/vendor/studio/team/page.tsx' — RETIRED from this read set at P7.2: the page was deleted with the old tree (the Studio Suite is the shell's Team room; StudioSheets.tsx is already in the set where it belongs)
  "fontSize: 9,\n  color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6,",
  "fontSize: 7,\n  color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6,",
  async () => { const { m, c } = await read(); assert.strictEqual(c.engraved.filter(e => e.size < m.REGISTER_FLOOR).length, 0); },
  '§B.3');
```


---

## `scripts/tdw09_surface.proof.mjs` — §3–§7 RETIRED (file stays)

**Subject:** `app/vendor/studio/team/page.tsx`, the Edit Member sheet, DELETED at the flip.
**Live-twin check:** a twin EXISTS — `MemberSheet` in `components/worklist/StudioSheets.tsx`,
carrying all four token roles. But these assertions pin the old surface's **byte forms**, and
the shell sheet expresses the same discipline through CSS rungs with zero size literals:
re-pointing the read yields 31 failures, and loosening the regexes to pass would fit the bench
to the surface rather than prove anything. **F-39.83** opens a fresh token-discipline bench
written from the mock's tokens.
**§1–§2 and §8 stay**, on live subjects.

**The 13 retired cells, verbatim:**

```js
H('§3 · THE SHEET READS ROLES, NOT LITERALS (F-09.32 as amended: a half-finished adoption)');

const NEAR_WHITE = /rgba\(\s*248\s*,\s*247\s*,\s*245/;
const WHITE_TINT = /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.0[0-9]+\s*\)/;
ok('§3.1 the Edit Member sheet carries ZERO near-white ink literals',
  !NEAR_WHITE.test(code(SHEET)));
ok('§3.2 the Edit Member sheet carries ZERO white-tint surface literals',
  !WHITE_TINT.test(code(SHEET)));
ok('§3.3 its field fill reads the input role',
  /backgroundColor: 'var\(--atelier-input-bg\)'/.test(code(SHEET)));
ok('§3.4 its field EDGE reads the 3:1 boundary role, not the panel hairline',
  /border: `0\.5px solid var\(--atelier-input-border\)`/.test(code(SHEET)),
  'card-border is a panel edge (1.79:1 / 1.40:1); a control edge is a different role');
ok('§3.5 its label reads the mute ink role',
  /muted: 'var\(--atelier-ink-mute\)'/.test(code(SHEET)));
ok('§3.6 the demo mirror stays identical to the real sheet on all four',
  /var\(--atelier-input-bg\)/.test(code(DEMO_SHEET)) &&
  /var\(--atelier-input-border\)/.test(code(DEMO_SHEET)) &&
  !NEAR_WHITE.test(code(DEMO_SHEET)) && !WHITE_TINT.test(code(DEMO_SHEET)));

// ═════════════════════════════════════════════════════════════════════════════
H('§4 · F-09.34 — NO DOUBLED SHORTHAND SURVIVES (a property, parsed, never a roster)');

function doubledSites(rel) {
  const s = read(rel);
  const out = [];
  // A const whose VALUE already opens with `<len> solid`, re-prefixed at a use.
  // Object-scoped: only names declared inside the same `const X = { … }` block
  // count, which is what keeps a colour-only `p.border` in a different object
  // from being reported — the false positive this sweep produced once and owned.
  for (const blk of s.matchAll(/const\s+([A-Za-z_]\w*)\s*=\s*\{([\s\S]*?)\n\};/g)) {
    const [, objName, body] = blk;
    for (const k of body.matchAll(/^\s*([A-Za-z_]\w*)\s*:\s*'[0-9.]+px solid /gm)) {
      const key = k[1];
      for (const u of s.matchAll(new RegExp(`[0-9.]+px solid \\$\\{${objName}\\.${key}\\}`, 'g'))) out.push(u[0]);
    }
  }
  return out;
}
const LANE_FILES = [];
(function walk(d) {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); }
    else if (/\.tsx?$/.test(e.name)) LANE_FILES.push(path.relative(ROOT, p));
  }
})(path.join(ROOT, 'app'));
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (/\.tsx?$/.test(e.name)) LANE_FILES.push(path.relative(ROOT, p));
  }
})(path.join(ROOT, 'components'));

const doubled = LANE_FILES.flatMap(f => doubledSites(f).map(d => `${f}: ${d}`));
if (doubled.length) doubled.forEach(d => console.log(`       ${d}`));
ok('§4.1 zero doubled border shorthands estate-wide — the edge renders or the cell reds',
  doubled.length === 0,
  `${doubled.length} site(s): a var() shorthand that doubles is INVALID AT COMPUTED-VALUE TIME and computes to none`);
ok('§4.2 the const was RENAMED, so any unmigrated reader is a tsc error and not an invisible border',
  /borderCol: 'var\(--atelier-card-border\)'/.test(code(SHEET)) && !/\bD\.border\b/.test(code(SHEET)));

// ═════════════════════════════════════════════════════════════════════════════
H('§5 · F-09.35 — ONE VALUE, BOTH HOMES');

{
  const cssRoot  = code(CSS).match(/:root[\s\S]*?--atelier-input-border:\s*([^;]+);/);
  const cssLight = code(CSS).match(/html\.theme-light\s*\{[\s\S]*?--atelier-input-border:\s*([^;]+);/);
  assert.ok(cssRoot && cssLight, 'globals.css lost one of its input-border homes');
  const sameDark  = cssRoot[1].trim()  === SETS.DARK.inputBorder;
  const sameLight = cssLight[1].trim() === SETS.LIGHT.inputBorder;
  console.log(`       theme.ts DARK  ${SETS.DARK.inputBorder}   globals :root        ${cssRoot[1].trim()}`);
  console.log(`       theme.ts LIGHT ${SETS.LIGHT.inputBorder}  globals theme-light  ${cssLight[1].trim()}`);
  ok('§5.1 the espresso boundary agrees across both homes', sameDark);
  ok('§5.2 the paper boundary agrees across both homes — the pre-mount frame renders what the owner holds',
    sameLight, 'F-09.35: these diverged (.22 vs .28) on the theme the walk convicted');
}
ok('§5.3 sectionBg is PUBLISHED — a role nothing publishes is a role nothing can read',
  /--atelier-section-bg/.test(code(CTX)));

// ═════════════════════════════════════════════════════════════════════════════
H('§6 · F-09.33 · R-S4 — THE DROPDOWN LOOKS LIKE ONE, AND STAYS NATIVE');

ok('§6.1 the Role field is still a native <select> — the OS picker was not replaced',
  /<select value=\{role\}/.test(code(SHEET)));
ok('§6.2 it carries the shared affordance rather than a bare appearance:none',
  /style=\{selectStyle\(inputStyle\)\}/.test(code(SHEET)) && !/appearance: 'none' \}\}>/.test(code(SHEET)));
// SOFT READ, on purpose. `lib/vendor/controls.ts` is a file this cure INTRODUCES,
// so at the uncured tree it is absent. Using the refusing reader here would abort
// the whole both-ways run at this line and hide the reds below it — a harness that
// stops early cannot show you it was red for the right reasons.
const CONTROLS_SRC = fs.existsSync(path.join(ROOT, 'lib/vendor/controls.ts'))
  ? read('lib/vendor/controls.ts') : '';
ok('§6.3 the affordance draws a chevron in currentColor — it inherits the field ink and themes for free',
  /stroke="currentColor"/.test(CONTROLS_SRC) && /backgroundImage/.test(CONTROLS_SRC));
ok('§6.4 and it reserves room for the glyph, so the longest option cannot run under it',
  /paddingRight: CHEVRON_BOX/.test(CONTROLS_SRC));
{
  const OPTIONS = ['No role', 'Second Shooter', 'Assistant', 'Editor', 'Runner',
                   'Videographer', 'Makeup Artist', 'Coordinator', 'Other'];
  ok('§6.5 all NINE option labels survive byte-identical — this sitting changes no user-facing string',
    OPTIONS.every(o => read(SHEET).includes(`>${o}</option>`)));
}

// ═════════════════════════════════════════════════════════════════════════════
H('§7 · CONTROL INVENTORY (CE-115/116) — EVERY CONTROL KEPT, NONE MOVED OR REMOVED');

{
  const s = read(SHEET);
  const CONTROLS = [
    ['Name input',        /placeholder="Rohit Mehta"/],
    ['Role select',       /<select value=\{role\}/],
    ['Phone input',       /placeholder="\+91 9000000000"/],
    ['Rate input',        /type="number" value=\{rate\}/],
    ['Notes input',       /placeholder="Available weekends only"/],
    ['Send page',         />Send page</],
    ['Rotate link',       /setConfirmRotate\(true\)/],
    ['Rotate cancel',     /setConfirmRotate\(false\)/],
    ['Rotate confirm',    /onClick=\{doRotate\}/],
    ['Remove',            /onClick=\{doDelete\}/],
    ['Save',              /doAdd : doEdit/],
    ['Scrim dismiss',     /onClick=\{\(\) => setSheet\(null\)\}/],
    ['FAB',               /onClick=\{openAdd\}/],
  ];
  CONTROLS.forEach(([n, re]) => ok(`§7 KEPT — ${n}`, re.test(s)));
  ok('§7.14 the Assignments block is still READ-ONLY — no second write path to the calendar',
    /READ-ONLY, deliberately/.test(read(SHEET)));
}

// ═════════════════════════════════════════════════════════════════════════════
```


### `tdw09_surface.proof.mjs` — the remaining SHEET readers (§8 and four mutations)

Retired for the same reason as §3–§7: their subject is the deleted Edit Member sheet. The money
register law they assert (R-U4) is NOT abandoned — it is asserted estate-wide by
`tdw09_money.proof.mjs` (re-keyed onto `Masthead.tsx` in this same ZIP) and by b40's register
cells.

```js
// --- §8 (money register on the deleted sheet)
H('§8 · THE MONEY REGISTER IS UNTOUCHED (standing law, R-U4)');

ok('§8.1 the field label is byte-exact and carries no glyph',
  read(SHEET).includes('Rate per event (Rs)'));
ok('§8.2 the row renders Rs with Indian grouping and no shorthand',
  /Rs \{m\.daily_rate_inr\.toLocaleString\('en-IN'\)\} per event/.test(read(SHEET)));
ok('§8.3 no rupee glyph and no k/L/Cr shorthand anywhere on the sheet',
  !/₹/.test(read(SHEET)) && !/Rs ?\d+(\.\d+)?[kLC]/.test(read(SHEET)));


// --- §M.3/M.4 (mutations over the deleted sheet)
okMutate('§M.3 §3.5 reds if the label goes back to the near-white literal',
  SHEET, "muted: 'var(--atelier-ink-mute)'", "muted: 'rgba(248,247,245,0.45)'",
  () => assert.ok(!NEAR_WHITE.test(code(SHEET))), '§3.1/§3.5');

// The anchor carries its padding prefix because the role is read TWICE on this
// surface — the field fill and the avatar circle — and an anchor that matches both
// is not an anchor. okMutate refuses on a non-unique anchor rather than mutating
// the first hit it finds, which is how this was caught.
okMutate('§M.4 §3.3 reds if the field fill goes back to the white tint',
  SHEET, "padding: '11px 14px', backgroundColor: 'var(--atelier-input-bg)'",
  "padding: '11px 14px', backgroundColor: 'rgba(255,255,255,0.04)'",
  () => assert.ok(!WHITE_TINT.test(code(SHEET))), '§3.2/§3.3');


// --- §M.5 (mutation over the deleted sheet)
okMutate('§M.5 §4.1 reds if the doubled shorthand is reintroduced',
  SHEET, "borderCol: 'var(--atelier-card-border)'", "borderCol: '0.5px solid var(--atelier-card-border)'",
  () => assert.strictEqual(doubledSites(SHEET).length, 0), '§4.1');


// --- §M.7/M.8 (mutations over the deleted sheet)
okMutate('§M.7 §6.2 reds if the select loses its affordance again',
  SHEET, 'style={selectStyle(inputStyle)}', "style={{ ...inputStyle, appearance: 'none' }}",
  () => assert.ok(/style=\{selectStyle\(inputStyle\)\}/.test(code(SHEET))), '§6.2');

okMutate('§M.8 §3.4 reds if the field edge is put back on the panel hairline',
  SHEET, 'border: `0.5px solid var(--atelier-input-border)`', 'border: `0.5px solid ${D.borderCol}`',
  () => assert.ok(/border: `0\.5px solid var\(--atelier-input-border\)`/.test(code(SHEET))), '§3.4');

```
