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

const FORM   = read('app/vendor/onboarding/page.tsx');
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
ok(/labelFor/.test(FORM) && /CAT_LABEL\[token\]\s*\|\|/.test(FORM)
   || 'no fallback — an unlabelled server token would render blank',
   '1.5 an UNLABELLED server token still renders (labels lag, options do not)');

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
  ok(FORM.includes(s) || `signed label 「 ${s} 」 is not at the byte`,
     `5.1 「 ${s} 」`);
}
ok(FORM.includes('Still needed'), '5.2 「 Still needed 」 at the byte');
ok(FORM.includes('Your starting price') && !FORM.includes('or leave blank'),
   '5.3 「 Your starting price 」 in, 「 or leave blank 」 dead');
ok(FORM.includes('Studio or business name') && !/placeholder="optional"/.test(FORM),
   '5.4 the 「 optional 」 placeholder is dead on a now-mandatory field');
ok(FORM.includes('Based in') && !FORM.includes('Based in *'),
   '5.5 the asterisk is dropped — a marker on one of six teaches that five are optional');

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

console.log('\n── 6b · the mandatory door wears no nav (founder V-1 catch) ──');
console.log('\n── 6b · the mandatory door wears no nav ──');
ok(/const chromeless = pathname\.startsWith\('\/vendor\/onboarding'\)/.test(LAYOUT)
   || 'no chromeless predicate',
   '6b.1 the onboarding path is marked chromeless');
ok(/\{!onLogin && !chromeless && <BottomNav \/>\}/.test(LAYOUT)
   || 'BottomNav still renders on the form',
   '6b.2 BottomNav does NOT render on the form — the submit button is reachable, and a mandatory door stops advertising five exits');
ok(!/onLogin\s*=\s*pathname[^;]*onboarding/.test(LAYOUT)
   || 'onboarding was folded into onLogin — the form is not a login screen',
   '6b.3 chromeless is its own predicate, never an onLogin widening');
// The predicates stay DISTINCT: onLogin still gates Splash, and folding
// onboarding into it would silently drag Splash along with the nav.
ok(/\{!onLogin && <Splash \/>\}/.test(LAYOUT)
   || 'Splash was accidentally re-gated',
   '6b.4 onLogin keeps its own meaning — Splash is untouched');

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
