#!/usr/bin/env node
'use strict';
// scripts/b183_fe7_onboarding_bench.js · TDW CE-47 · L4 (FE-7) · Onboarding, as approved (veto rows 54 to 59; C3:
// no "?" card, it sits outside the shell).
//
// §1 THE SOURCE: no literal colour in the page's code (R-42.6; the old #0B6B5A/#4DBBA4, #FFFFFF/#0A1A16 and
//    #0C0A09 gone); the theme's own scopeCss and typeCss on its scope; the link in a CopyBox (R-46.17); its words in
//    one table (OB), with no arrow and no "PA".
// §2 THE FORM on glass (374, dark): "Set up your studio", the line, the labels; "Still needed" beside each missing
//    field, drawn in role-caution; the title in the app's sans, not italic; "Get started" with no arrow.
// §3 DONE: "You're all set, Kavya.", the line, the link in its copy box with Copy, "Open your studio"; no "PA".
// §8 MUTATIONS: M1 a hex colour planted in the page's CSS (1.1 red); M2 the arrow back on "Get started" (2.4 red).
// §9 NOTHING LEFT. THE EXIT CODE IS THE VERDICT.  --no-mutate
const K = require('./lib/fe7_l4_kit.js');
// AMENDED BY LABEL · CE-47 FE-9 (6 Oct 2026, G3): the form moved, code and all, to the component the two-minute start
// renders as S5 at the same address; the source cells read it where it now lives.
const OBP = 'v2/components/start/DetailsForm.tsx';
// AMENDED BY LABEL · CE-47 FE-9 (7 Oct 2026, the chair's ruling, with ADS-2's read of the source): ADS-2's DEFECT,
// CURED BY FE-9. Three reads after K.open had no wait and no guard, so a page still settling under load threw (seen as
// cell 0.2, "the run did not crash": 2 of 20 on main's own page, 1 of 20 on the tree):
//   form(): document.querySelector('.ob2').appendChild(probe)  ·  getComputedStyle(document.querySelector('.ob-h'))
//   done(): set.call(document.querySelectorAll('.ob-f')[0], ...)
// and a fourth, found in the first 20 after the three were cured: K.words(p, '.ob-in') answers null when the form is not
// there, and the cells then threw on F.ws.includes / D.ws.some (1 of 20).
// Each now waits on the node it reads (K.waitFor, bounded at 8 s). A node still missing after its wait is a NAMED red
// in the cell that reads it ("gone after its wait: <selector>"), never a throw. No threshold moved; no cell added.
/** The named red: which node was still missing after its wait, and where the page was. */
const gone = async (p, sel) => `gone after its wait: ${sel} (at ${await p.evaluate(() => location.pathname).catch(() => '?')})`;
async function form(g) {
  const p = await K.open(g, '/vendor/onboarding', { wait: '.ob2 .ob-in', scen: { ob: true } });
  await K.waitFor(p, '.ob2 .ob-in');
  const ws = (await K.words(p, '.ob-in')) || [await gone(p, '.ob-in')];
  await K.waitFor(p, '.ob2');
  const need = await p.evaluate(() => { const host = document.querySelector('.ob2'); if (!host) return { n: -1, allCaution: false, gone: 'gone after its wait: .ob2' }; const els = [...document.querySelectorAll('.ob-need')]; const probe = document.createElement('span'); probe.style.color = 'var(--role-caution)'; host.appendChild(probe); const want = getComputedStyle(probe).color; probe.remove(); return { n: els.length, allCaution: els.length > 0 && els.every((e) => getComputedStyle(e).color === want) }; });
  await K.waitFor(p, '.ob-h');
  const title = await p.evaluate(() => { const h = document.querySelector('.ob-h'); if (!h) return { style: null, family: null, gone: 'gone after its wait: .ob-h' }; const cs = getComputedStyle(h); return { style: cs.fontStyle, family: cs.fontFamily }; });
  const go = await p.evaluate(() => { const b = document.querySelector('.ob-go'); return b ? b.textContent.trim() : null; });
  await p.close(); return { ws, need, title, go };
}
async function done(g) {
  const p = await K.open(g, '/vendor/onboarding', { wait: '.ob-in', scen: { ob: true, obDone: true } });
  await K.waitFor(p, '.ob-f');
  const typed = await p.evaluate(() => { const f = document.querySelectorAll('.ob-f'); if (!f[0]) return false; const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(f[0], 'Kavya Rao'); f[0].dispatchEvent(new Event('input', { bubbles: true })); return true; });
  if (!typed) { await p.close(); return { ws: ['gone after its wait: .ob-f'], copy: false }; }
  await K.tap(p, '@.ob-go');   // e-275: tap settles
  await K.waitFor(p, '.ob-in');
  const r = { ws: (await K.words(p, '.ob-in')) || [await gone(p, '.ob-in')], copy: await p.evaluate(() => !!document.querySelector('.ob-in [data-copybox], .ob-in .cb-box, .ob-in button')) };
  await p.close(); return r;
}

K.runBench({
  tag: 'b183', port: Number(process.env.B183_PORT || 4183), urls: ['/vendor/onboarding'],
  source(ok, sec) {
    sec('1 THE SOURCE');
    const c = K.code(OBP);
    ok(!/#[0-9a-fA-F]{3,8}\b/.test(c), '1.1 no literal colour in the page\'s code (R-42.6)', (c.match(/#[0-9a-fA-F]{3,8}\b/) || [])[0]);
    ok(/scopeCss\('\.ob2'\)/.test(c) && /typeCss\('\.ob2'\)/.test(c), '1.2 the theme\'s own scopeCss and typeCss on its scope');
    ok(/<CopyBox /.test(c), '1.3 the link in a CopyBox (R-46.17)');
    ok(/const OB = \{/.test(c) && !/\u2192|→/.test(c) && !/\bPA\b/.test(c), '1.4 its words in one table, with no arrow and no "PA"');
  },
  async glass(g, ok, sec) {
    sec('2 THE FORM');
    const F = await form(g);
    // AMENDED BY LABEL · CE-47 FE-9 (6 Oct 2026, RULING A): S5 is "Check your details", its sub line the chair's, and it
    // shows ONLY the boxes the server lists as missing (this scenario's: business name, craft, city, price, area; her
    // name is already on file, so its box is not drawn), each under today's label; the optional Instagram box is gone.
    // AMENDED BY LABEL · CE-47 FE-9 (8 Oct 2026, R-47.1, the founder's words): the seventh labelled amendment; S5's sub line.
    ok(['Check your details', 'TDW needs these details to set up your storefront.', 'Studio or business name', 'What you do', 'Based in', 'Your starting price, in Rs', 'Where you work'].every((w) => F.ws.includes(w)) && !F.ws.includes('Instagram handle') && !F.ws.includes('Your name'), '2.1 the title, the line and the labels of the missing boxes (ruling A)', JSON.stringify(F.ws));
    // AMENDED BY LABEL · RULING A: every box shown is a missing one, so no "Still needed" marker is drawn at all.
    ok(F.need.n === 0, '2.2 no "Still needed" marker: every box shown is a missing one (ruling A)', JSON.stringify(F.need));
    ok(F.title.style === 'normal' && !/Cormorant/i.test(F.title.family), '2.3 the title in the app\'s sans, not italic', JSON.stringify(F.title));
    // AMENDED BY LABEL · RULING A: the button is the flow's "Continue"; still no arrow.
    ok(F.go === 'Continue', '2.4 "Continue", no arrow (ruling A)', F.go);
    sec('3 DONE');
    const D = await done(g);
    ok(['You’re all set, Kavya.', 'Share your TDW link. Clients message you there.', 'Your TDW link', 'Copy', 'Open your studio'].every((w) => D.ws.includes(w)), '3.1 the done screen\'s words, the link\'s label and Copy', D.ws.join(' | ').slice(0, 200));
    ok(D.ws.some((w) => /thedreamwedding\.in\/v\/kavyarao/.test(w)) && !D.ws.some((w) => /\bPA\b|→/.test(w)), '3.2 the link shown whole in its box; no "PA", no arrow');
  },
  mutations: [
    { name: 'M1 a hex colour planted in the page\'s CSS', rel: OBP, from: '.ob-chip.on{background:var(--role-primary);', to: '.ob-chip.on{background:#4DBBA4;', cell: async () => !/#[0-9a-fA-F]{3,8}\b/.test(K.code(OBP)) },
    { name: 'M2 the arrow on "Continue" (amended by label, ruling A)', rel: OBP, from: "go: 'Continue',", to: "go: 'Continue \\u2192',", glass: true, cell: async (g) => (await form(g)).go === 'Continue' },
  ],
});
