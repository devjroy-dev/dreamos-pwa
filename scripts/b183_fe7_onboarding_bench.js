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
const OBP = 'v2/app/vendor/(legacy)/onboarding/page.tsx';
async function form(g) {
  const p = await K.open(g, '/vendor/onboarding', { wait: '.ob-in', scen: { ob: true } });
  const r = { ws: await K.words(p, '.ob-in'),
    need: await p.evaluate(() => { const els = [...document.querySelectorAll('.ob-need')]; const probe = document.createElement('span'); probe.style.color = 'var(--role-caution)'; document.querySelector('.ob2').appendChild(probe); const want = getComputedStyle(probe).color; probe.remove(); return { n: els.length, allCaution: els.length > 0 && els.every((e) => getComputedStyle(e).color === want) }; }),
    title: await p.evaluate(() => { const h = document.querySelector('.ob-h'); const cs = getComputedStyle(h); return { style: cs.fontStyle, family: cs.fontFamily }; }),
    go: await p.evaluate(() => { const b = document.querySelector('.ob-go'); return b ? b.textContent.trim() : null; }) };
  await p.close(); return r;
}
async function done(g) {
  const p = await K.open(g, '/vendor/onboarding', { wait: '.ob-in', scen: { ob: true, obDone: true } });
  await p.evaluate(() => { const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; const f = document.querySelectorAll('.ob-f'); set.call(f[0], 'Kavya Rao'); f[0].dispatchEvent(new Event('input', { bubbles: true })); });
  await K.tap(p, '@.ob-go');   // e-275: tap settles
  const r = { ws: await K.words(p, '.ob-in'), copy: await p.evaluate(() => !!document.querySelector('.ob-in [data-copybox], .ob-in .cb-box, .ob-in button')) };
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
    ok(['Set up your studio', 'Two minutes. Clients use this to reach you.', 'Your name', 'What you do', 'Your starting price, in Rs', 'Where you work', 'Instagram handle'].every((w) => F.ws.includes(w)), '2.1 the title, the line and the labels');
    ok(F.need.n >= 4 && F.need.allCaution, '2.2 "Still needed" beside each missing field, in role-caution', JSON.stringify(F.need));
    ok(F.title.style === 'normal' && !/Cormorant/i.test(F.title.family), '2.3 the title in the app\'s sans, not italic', JSON.stringify(F.title));
    ok(F.go === 'Get started', '2.4 "Get started", no arrow', F.go);
    sec('3 DONE');
    const D = await done(g);
    ok(['You’re all set, Kavya.', 'Share your TDW link. Clients message you there.', 'Your TDW link', 'Copy', 'Open your studio'].every((w) => D.ws.includes(w)), '3.1 the done screen\'s words, the link\'s label and Copy', D.ws.join(' | ').slice(0, 200));
    ok(D.ws.some((w) => /thedreamwedding\.in\/v\/kavyarao/.test(w)) && !D.ws.some((w) => /\bPA\b|→/.test(w)), '3.2 the link shown whole in its box; no "PA", no arrow');
  },
  mutations: [
    { name: 'M1 a hex colour planted in the page\'s CSS', rel: OBP, from: '.ob-chip.on{background:var(--role-primary);', to: '.ob-chip.on{background:#4DBBA4;', cell: async () => !/#[0-9a-fA-F]{3,8}\b/.test(K.code(OBP)) },
    { name: 'M2 the arrow back on "Get started"', rel: OBP, from: "go: 'Get started',", to: "go: 'Get started \\u2192',", glass: true, cell: async (g) => (await form(g)).go === 'Get started' },
  ],
});
