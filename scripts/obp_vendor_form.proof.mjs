// scripts/obp_vendor_form.proof.mjs
// ARC OB · charter OB-P · the vendor form + the moved layout guard.
// Source-plane cells: this tree has no DOM harness, so these assert the SHAPE of
// the shipped source, comment-stripped. Comment-blindness law: a claim that a
// string is ABSENT is false the moment the string appears in a comment
// explaining its absence — and this diff's comments name every retired token.
import fs from 'node:fs';

let pass = 0, fail = 0;
const F = [];
const ok = (v, label) => {
  if (v === true) { pass++; console.log(`  ok   ${label}`); return; }
  fail++; const why = typeof v === 'string' ? v : 'falsy';
  F.push(`${label} — ${why}`); console.log(`  FAIL ${label}\n       ${why}`);
};

function strip(raw) {
  let out = '', i = 0; const n = raw.length;
  while (i < n) {
    const c = raw[i], d = raw[i + 1];
    if (c === '/' && d === '/') { while (i < n && raw[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { i += 2; while (i < n && !(raw[i] === '*' && raw[i + 1] === '/')) i++; i += 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      const q = c; out += raw[i++];
      while (i < n) {
        if (raw[i] === '\\') { out += raw[i] + (raw[i + 1] || ''); i += 2; continue; }
        out += raw[i]; if (raw[i] === q) { i++; break; } i++;
      }
      continue;
    }
    out += raw[i++];
  }
  return out;
}
const read = (p) => strip(fs.readFileSync(p, 'utf8'));

const FORM   = read('app/vendor/(legacy)/onboarding/page.tsx');
/* ── ADDED, LABELLED — TDW_15 · P2 (R-34.52, CE-35, 2026-08-18) ─────────────
   `CAT_LABEL` and `labelFor` MOVED to `lib/frost/categoryLabels.ts` (R-34.33) so
   the bride's envelope picker could read the same founder-signed eleven without
   a second copy. Cells 1.5 and 5.1 asserted those bytes INSIDE `FORM`, so the
   move alone would have reddened them — and a cell that reds because a cure
   landed is F-15.12's disease, not a defect caught.

   THEY ARE AMENDED TO THE INVARIANT, NOT LOWERED. The property that mattered
   was never "the labels are in this file"; it was "an unlabelled server token
   still renders" and "the eleven signed bytes exist, unedited". Both are now
   asserted ACROSS THE SEAM: declared at the new home, imported by the page,
   rendered through `labelFor`. That is STRICTLY STRONGER than the originals,
   which could not tell a present map from a wired one.

   1.2 IS UNTOUCHED, PER RULING. Recorded honestly: after the move it asserts an
   absence that is trivially true, since `CAT_LABEL` is no longer in `FORM` at
   all. That weakening is real and is a later sitting's ruled edit, not this
   delivery's to take. */
const LABELS = read('lib/frost/categoryLabels.ts');
const LAYOUT = read('app/vendor/layout.tsx');
const PAGE   = read('app/vendor/page.tsx');

console.log('\n── 1 · the picker is SERVER-SOURCED, never a local list ──');
ok(/allowed\.map\(/.test(FORM) || 'the picker does not iterate allowed[]',
   '1.1 the picker renders by mapping the server\'s allowed[]');
ok(!/Object\.keys\(CAT_LABEL\)\.map|CAT_LABEL\)\.map/.test(FORM)
   || 'the picker iterates the LABEL MAP — a token the server adds would vanish',
   '1.2 the picker never iterates the label map (the drift-proof distinction)');
for (const dead of ['videography', 'mehendi', 'couture', 'invitations', "'venue'", "'catering'", "'music'", "'hair'"]) {
  ok(!FORM.includes(dead) || `the retired token ${dead} is still resident`,
     `1.3 F-OB.8 — the shadow taxonomy token ${dead} is GONE from the form`);
}
ok(!/const CATEGORIES\s*=/.test(FORM) || 'the 15-token shadow array is still declared',
   '1.4 F-OB.8 — the shadow CATEGORIES array is deleted, not re-pointed');
ok((/CAT_LABEL\[token\]\s*\|\|/.test(LABELS)
    && /export const labelFor/.test(LABELS)
    && /import \{[^}]*\blabelFor\b[^}]*\} from '@\/lib\/frost\/categoryLabels'/.test(FORM)
    && /\{labelFor\(token\)\}/.test(FORM))
   || 'the fallback is not declared at the new home, not imported here, or not rendered through',
   '1.5 an UNLABELLED server token still renders — declared at categoryLabels.ts, imported by the page, rendered through labelFor (R-34.52)');

console.log('\n── 2 · the six boxes, keyed on VENDOR_FIELDS ──');
for (const f of ['name', 'business_name', 'category', 'city', 'starting_price', 'service_area']) {
  ok(FORM.includes(`field="${f}"`) || `no control keyed on ${f}`,
     `2.1 a control exists for the interface key ${f}`);
}
ok(/missing\.includes\(field\)/.test(FORM) || 'the marker is not driven by missing[]',
   '2.2 the Still-needed marker renders from the SERVER\'s missing[], not a local emptiness rule');
ok(/rate_min:/.test(FORM) || 'starting price is not sent as rate_min',
   '2.3 starting price travels as rate_min (the number), not as stated_rate prose');

console.log('\n── 3 · server-truth: no local rules, no local sentences ──');
ok(!/City is required/.test(FORM) || 'the client-side completeness refusal survives',
   '3.1 the client no longer decides completeness');
ok(!/A few details are still needed/.test(FORM)
   || 'the server\'s refusal sentence is duplicated in the client',
   '3.2 the refusal sentence is RENDERED from the response, never copied here');
ok(/setRefusal\(res\.error/.test(FORM) || 'res.error is not rendered',
   '3.3 the server\'s own sentence is what reaches the vendor');
ok(!/open_to_travel/.test(FORM) || 'the STOP-WRITING column is still sent',
   '3.4 F-OB.12 — open_to_travel is gone from the body');
ok(!/setTravel|travel \?/.test(FORM) || 'the travel toggle control survives',
   '3.5 F-OB.12 — the travel toggle control is removed');

console.log('\n── 4 · service area · Set A, and the pair ──');
for (const t of ['pan_india', 'worldwide', 'select_cities']) {
  ok(FORM.includes(t) || `${t} missing`, `4.1 Set A token ${t} is offered`);
}
for (const l of ['Across India', 'Worldwide', 'Select cities']) {
  ok(FORM.includes(l) || `${l} missing`, `4.2 Set A label 「 ${l} 」 renders at the byte`);
}
ok(/service_cities = area === 'select_cities' \? cityList : null/.test(FORM)
   || 'service_cities is not null-unless-select_cities',
   '4.3 service_cities is NULL unless select_cities — 0122\'s pairing CHECK reads `is null`, and [] satisfies neither arm');
ok(/if \(area\) \{/.test(FORM) || 'the pair can travel half-sent',
   '4.4 area and cities travel as a PAIR or not at all');

console.log('\n── 5 · the eleven signed labels, byte-frozen ──');
const SIGNED = ['Event Planner', 'Designer', 'Photography & Videography', 'Make up Artist',
  'Hairstylist', 'Jewellery', 'Decor', 'Venue & Catering',
  'Performer (Anchor, DJ, Choreography)', 'Content Creator', 'Something else'];
for (const s of SIGNED) {
  ok(LABELS.includes(s) || `signed label 「 ${s} 」 is not at the byte in lib/frost/categoryLabels.ts`,
     `5.1 「 ${s} 」 byte-frozen at the new home (R-34.52)`);
}
/* 5.1a — the counterpart the move makes necessary. Eleven present bytes prove
   nothing if this page no longer reaches them: a label map declared and never
   imported renders an empty picker while every 5.1 cell stays green. */
ok(/import \{[^}]*\blabelFor\b[^}]*\} from '@\/lib\/frost\/categoryLabels'/.test(FORM)
   || 'the form does not import from the eleven\'s home — the bytes exist and nothing reads them',
   '5.1a the form is WIRED to that home, not merely coexisting with it');
/* 5.1b — control: the exemption is narrow. The labels really did LEAVE this
   file, so 5.1 is asserting across a seam rather than over a copy nobody
   deleted. A duplicate left behind is the exact failure a MOVE can hide. */
ok(!/const CAT_LABEL: Record<string, string> = \{/.test(FORM)
   || 'a second copy of the label map is still declared in the form',
   '5.1b the map is GONE from the form — a move, not a fork');
ok(FORM.includes('Still needed'), '5.2 「 Still needed 」 at the byte');
ok(FORM.includes('Your starting price') && !FORM.includes('or leave blank'),
   '5.3 「 Your starting price 」 in, 「 or leave blank 」 dead');
ok(FORM.includes('Studio or business name') && !/placeholder="optional"/.test(FORM),
   '5.4 the 「 optional 」 placeholder is dead on a now-mandatory field');
ok(!/Your clients tap this to reach your PA/.test(FORM)
   || 'the false helper line still renders',
   '5.6 the Instagram helper line is REMOVED — it named the wrong object and promised a link that only moves on a first run');
ok(FORM.includes('Instagram handle'),
   '5.7 the label survives — the field stays, only its false explanation went');
ok(FORM.includes('Based in') && !FORM.includes('Based in *'),
   '5.5 the asterisk is dropped — a marker on one of six teaches that five are optional');

console.log('\n── 5b · the attention token is theme-aware (F-09.3) ──');
ok(/const ATTN\s+= T\.caution;/.test(FORM) || 'no caution token',
   '5b.1 the attention colour is T.caution — theme-aware, 4.68:1 on light');
ok(!/color: BRASS/.test(FORM) || 'brass is still used as TEXT — 2.05:1 on Editorial Paper',
   '5b.2 F-09.3 — the brass mark is NEVER body text');
// NARROWED after the mutation run: this asserted `background: BRASS` and matched
// the DONE-SCREEN button, so mutating the FORM's submit fill left it green. A
// cell that passes because a different control happens to match is a cell about
// that other control. Both brass fills are now named.
ok(/background: submitting \? `color-mix\(in srgb, \$\{BRASS\} 40%, transparent\)` : BRASS/.test(FORM)
   || 'the submit button lost its brass fill',
   '5b.3 brass survives on the SUBMIT control — the one place it belongs');
ok((FORM.match(/background: BRASS,/g) || []).length >= 1
   || 'the done-screen button lost its brass fill',
   '5b.3b brass survives on the done-screen control');
ok(/color: ATTN/.test(FORM), '5b.4 the marker and the refusal both read from the attention token');

console.log('\n── 6 · the guard: MOVED, verdict-reading, loop-safe ──');
ok(/useOnboardingGuard/.test(LAYOUT) || 'no guard in the layout',
   '6.1 the guard lives in the vendor LAYOUT (covers every studio door)');
ok(!/onboarding_state/.test(PAGE) || 'the page still branches on the marker',
   '6.2 MOVED NOT DUPLICATED — app/vendor/page.tsx no longer reads onboarding_state');
ok(!/onboarding_state/.test(LAYOUT) || 'the layout guard reads the MARKER',
   '6.3 R-OB.8 — the guard never reads the marker');
ok(/onboarding\?\.complete === false/.test(LAYOUT)
   || 'the guard does not branch on an explicit false',
   '6.4 an ABSENT verdict does not redirect — only an explicit false does (fail open)');
ok(/startsWith\('\/vendor\/onboarding'\)/.test(LAYOUT) || 'no self-exemption',
   '6.5 the form itself is exempt from its own guard — no redirect loop');
ok(/getVendorSession\(\)\?\.access_token/.test(LAYOUT) || 'the guard fires without a session',
   '6.6 a signed-out visitor is not probed');
ok(!/circle|coplanner/.test(LAYOUT) || 'a circle branch was built where no shared path exists',
   '6.7 circle exemption stays STRUCTURAL — no role branch in this layout');

console.log('\n── 7 · the mount probe is safe by the endpoint\'s own ruling ──');
ok(/onboarding\?\.complete\) \{ router\.replace\('\/vendor'\)/.test(FORM)
   || 'a complete vendor is not bounced before the probe',
   '7.1 the probe is NEVER fired for a complete vendor (for her the POST would write)');
const probeIdx = FORM.indexOf("postJson<OnboardResp>('/api/v2/vendor/onboarding', {})");
const bounceIdx = FORM.indexOf("router.replace('/vendor')");
ok((probeIdx > 0 && bounceIdx > 0 && bounceIdx < probeIdx)
   || `ordering wrong: bounce@${bounceIdx} probe@${probeIdx}`,
   '7.2 the completeness bounce precedes the probe in source order');

console.log('\n══════════════════════════════════════════════');
console.log(`obp_vendor_form: ${pass} passed, ${fail} failed`);
if (fail) { console.log('\nFAILURES:'); F.forEach((x) => console.log(`  · ${x}`)); }
console.log(`VERDICT: ${fail === 0 ? 'GREEN' : 'RED'}`);
console.log('══════════════════════════════════════════════\n');
process.exit(fail === 0 ? 0 : 1);
