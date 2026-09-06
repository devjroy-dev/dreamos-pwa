// scripts/obp_bride_form.proof.mjs
// ARC OB · charter OB-P · the bride form + the frost layout guard.
// Source-plane, comment-stripped (comment-blindness law: this diff's comments
// name every retired byte, so a raw-text absence check would be false).
import fs from 'node:fs';
let pass = 0, fail = 0; const F = [];
const ok = (v, l) => { if (v === true) { pass++; console.log(`  ok   ${l}`); return; }
  fail++; const w = typeof v === 'string' ? v : 'falsy'; F.push(`${l} — ${w}`); console.log(`  FAIL ${l}\n       ${w}`); };
function strip(raw){let o='',i=0;const n=raw.length;while(i<n){const c=raw[i],d=raw[i+1];
 if(c==='/'&&d==='/'){while(i<n&&raw[i]!=='\n')i++;continue;}
 if(c==='/'&&d==='*'){i+=2;while(i<n&&!(raw[i]==='*'&&raw[i+1]==='/'))i++;i+=2;continue;}
 if(c==='"'||c==="'"||c==='`'){const q=c;o+=raw[i++];while(i<n){if(raw[i]==='\\'){o+=raw[i]+(raw[i+1]||'');i+=2;continue;}o+=raw[i];if(raw[i]===q){i++;break;}i++;}continue;}
 o+=raw[i++];}return o;}
const read = p => strip(fs.readFileSync(p,'utf8'));
const FORM = read('app/(frost)/frost/canvas/onboarding/page.tsx');
const LAY  = read('app/(frost)/layout.tsx');
const SANC = read('app/(frost)/frost/canvas/sanctuary/page.tsx');
const ERR  = read('lib/types/common.ts');
const BASE = read('lib/frost-api/_base.ts');

console.log('\n── 1 · the two mandatory fields exist and are server-marked ──');
ok(FORM.includes('field="name"'),   '1.1 a control keyed on the interface key `name` exists');
ok(FORM.includes('field="budget"'), '1.2 a control keyed on the interface key `budget` exists');
ok(/body\.name\s*=\s*name\.trim\(\)/.test(FORM), '1.3 name is actually SENT (it never was before)');
ok(/missing\.includes\(field\)/.test(FORM), '1.4 the marker renders from the SERVER missing[]');
ok(FORM.includes('Still needed'), '1.5 「 Still needed 」 REUSED at the vendor sheet byte');

console.log('\n── 2 · the signed bytes, frozen ──');
ok(FORM.includes('text="Name"'), '2.1 「 Name 」 at the byte');
ok(FORM.includes('Wedding Budget (Approx).'), '2.2 「 Wedding Budget (Approx). 」 at the byte, trailing period included');
ok(FORM.includes('e.g. 30L, 1Cr, Rs 25,00,000'), '2.3 the resident budget placeholder is carried unchanged');
// BENCH DEFECT B-1, self-caught: this list held a REAL apostrophe where the
// source holds the JSX entity `&apos;`. The cell reddened on correct code — a
// cell that reddens on the right answer is broken, not strict.
// AMENDED — FOUNDER VETO-DELETE 2026-08-13. 「 And who's the lucky person? 」
// and 「 Their name 」 left this list because the control they belonged to is
// retired. RETIRE-WITH-THE-READER applied to a bench: the ruling that removes a
// byte owns the cell that pinned it. Their absence is now asserted at §8 — moved,
// not merely deleted, because a cell that stops checking is a cell that stops
// noticing.
for (const s of ['When is the big day?', 'Where are the functions taking place?',
                 'City or venue', 'Continue →', 'Saving…', 'Open my space →']) {
  ok(FORM.includes(s) || `resident byte 「 ${s} 」 was lost`, `2.4 resident 「 ${s} 」 carried`);
}

console.log('\n── 3 · R-OB.2 — no grace, no skip ──');
ok(!/Skip for now/.test(FORM), '3.1 the 「 Skip for now 」 button is REMOVED — a skippable door is not mandatory');
ok(!/skip anything you/.test(FORM), '3.2 the 「 skip anything you\'re not ready for 」 promise is REMOVED');
ok(!/Everything is optional/.test(FORM), '3.3 the 「 Everything is optional 」 clause is gone');
ok(FORM.includes('Tell us a little about your wedding.'), '3.4 the subhead keeps its TRUE half verbatim (a subtraction, not a new sentence)');

console.log('\n── 4 · F-OB.11 — the one API home ──');
ok(!/const API = 'https:/.test(FORM), '4.1 the hardcoded API literal is gone');
ok(!/await fetch\(/.test(FORM), '4.2 no raw fetch survives in the page');
ok(/apiGet</.test(FORM) && /apiPost</.test(FORM), '4.3 the page routes through lib/frost-api/_base.ts');
ok(/body\?: unknown;/.test(ERR), '4.4 ApiClientError carries the refusal body — ADDITIVE, typed unknown');
ok(/reason\?: string, body\?: unknown/.test(ERR), '4.5 the body is the LAST ctor arg — existing call sites cannot notice');
ok(/refusalBody\?\.missing/.test(FORM), '4.6 the form narrows the body at the point of use, never asserting the server shape');

console.log('\n── 5 · server-truth: no local rules, no local sentences ──');
ok(!/A few details are still needed/.test(FORM), '5.1 the refusal sentence is not duplicated in the client');
ok(/setRefusal\(e\.message\)/.test(FORM), '5.2 the server\'s own sentence is what reaches the bride');
ok(!/if \(!name|budget && name|required/.test(FORM), '5.3 the client never decides completeness');

console.log('\n── 6 · the guard: MOVED, verdict-reading, loop-safe ──');
ok(/useBrideOnboardingGuard/.test(LAY), '6.1 the guard lives in the frost LAYOUT');
// BENCH DEFECT B-2, self-caught: this asserted sanctuary held NO mention of
// onboarding_state at all. Over-broad — a SECOND, unrelated reader lives at
// :4303, where F-05.38's session-healing block copies the marker into the
// session blob. That site was never the guard and the guard move never owned
// it; retiring it would be a different sitting's radius. The cell is narrowed
// to what the move actually claims: the REDIRECT is gone from this page.
ok(!/replace\('\/frost\/canvas\/onboarding'\)/.test(SANC)
   || 'sanctuary still redirects to the form — the guard was duplicated, not moved',
   '6.2 MOVED NOT DUPLICATED — sanctuary no longer redirects to the form');
ok(!/state\s*&&\s*state\s*!==\s*'complete'/.test(SANC)
   || 'the marker-branch survives in sanctuary',
   '6.2b the marker-branch that drove that redirect is gone');
ok(!/onboarding_state/.test(LAY), '6.3 R-OB.8 — the guard never reads the marker');
ok(/onboarding\?\.complete === false/.test(LAY), '6.4 only an EXPLICIT false redirects (fail open)');
ok(/startsWith\('\/frost\/canvas\/onboarding'\)/.test(LAY), '6.5 the form is exempt from its own guard — no loop');
ok(/isBrideDemoMode\(\)/.test(LAY), '6.6 demo is exempt through the ONE authority (F-05.39)');
ok(/getAccessToken\(\)/.test(LAY), '6.7 a signed-out visitor is not probed');

console.log('\n── 7 · the complete bride never sees the form ──');
ok(/onboarding\?\.complete\) \{ router\.replace\('\/frost'\)/.test(FORM),
   '7.1 an already-complete bride is bounced to /frost');

console.log('\n── 7b · the greeting reads the TYPED name, not a cached one ──');
ok(/const firstName = \(name\.trim\(\) \|\| getBrideName\(\)\)/.test(FORM)
   || 'the greeting is not derived from the typed name',
   '7b.1 the greeting prefers what she typed, cache only as fallback');
ok(!/setFirstName/.test(FORM) || 'firstName is still stored in state',
   '7b.2 it is DERIVED per render, never stored — stored is what let the two disagree');
// The founder-ruled bytes must not move while the SOURCE of the name changes.
ok(FORM.includes("`You’re all set, ${firstName}.`") && FORM.includes('"You’re all set."'),
   '7b.3 the done-screen bytes are unchanged, both arms');
ok(FORM.includes('`Hi ${firstName}.`') && FORM.includes("'Welcome.'"),
   '7b.4 the greeting bytes are unchanged, both arms');

console.log('\n── 8 · partner_name is RETIRED from this form (founder veto-delete) ──');
ok(!/And who/.test(FORM) || 'the partner-name label survives',
   '8.1 the label 「 And who\'s the lucky person? 」 is gone');
ok(!/Their name/.test(FORM) || 'the placeholder survives',
   '8.2 the placeholder 「 Their name 」 is gone');
ok(!/setPartnerName|partnerName/.test(FORM) || 'partner-name state survives',
   '8.3 no partner-name state remains — the control is REMOVED, not hidden');
ok(!/body\.partner_name/.test(FORM) || 'the form still sends partner_name',
   '8.4 the form no longer SENDS partner_name');
// THE COLUMN IS NOT THE CONTROL — DECLARED, NOT ASSERTED HERE.
// A first draft of this cell read ../dream-os/src/api/couple/onboarding.js to
// prove the endpoint still accepts partner_name. That is F-06.196's defect:
// this bench runs in the PWA plane, the sibling repo is NOT laid out beside it
// on the founder's machine, and the cell would have thrown there or — worse, in
// a tolerant variant — passed vacuously while proving nothing. A bench that
// silently changes what it measures depending on who runs it is not a bench.
//
// The claim stands and belongs to the OTHER plane's benches, where it already
// lives: b05_f0518_onboarding_bench §3.2 drives the real handler and asserts
// partner_name lands on couples. Recorded here so the next reader knows the
// retirement was scoped to this FORM and did not touch the column, its endpoint,
// or its other writers (PATCH /couple/me, the bride agent's save_wedding_detail).

console.log('\n══════════════════════════════════════════════');
console.log(`obp_bride_form: ${pass} passed, ${fail} failed`);
if (fail) { console.log('\nFAILURES:'); F.forEach(x => console.log(`  · ${x}`)); }
console.log(`VERDICT: ${fail === 0 ? 'GREEN' : 'RED'}`);
console.log('══════════════════════════════════════════════\n');
process.exit(fail === 0 ? 0 : 1);
