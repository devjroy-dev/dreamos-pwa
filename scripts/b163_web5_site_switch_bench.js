// scripts/b163_web5_site_switch_bench.js
// TDW · CE-47 · WEB-5 · b163 — THE STYLES SITE'S SWITCH AND ADDRESSES (ruling B).
// §1 sitePath: her home, a look under each of the four trade words, a collection; the date leaf and the wedding page
//    stay classic; anything else is not the site's
// §2 her own address (vendorHost.decide): the site's look and collection pages rewrite; its faces, script and beacon
//    pass through; every earlier answer unchanged (/, /date, /w/<slug>, the redirect for anything else)
// §3 siteKind: the door's 'styles' is honoured, anything else or any failure is 'classic'; remembered 60 s; never for
//    her preview; the door is asked once per code inside the window
// §4 mutations: a kind door that says 'styles' for everyone is caught by §3; a decide that redirects /site-fonts/ is
//    caught by §2
// No server, no browser: a floor member.
'use strict';
const { makeLoader } = require('./lib/site_load');
let pass = 0, fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 200) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);
(async () => {
  const load = makeLoader();
  const K = load('lib/site/kind.ts'); const V = load('lib/public/vendorHost.ts');
  sec('1  sitePath');
  const sp = (p) => JSON.stringify(K.sitePath(p));
  ok(K.sitePath('/v/studio-ivara')?.to === '/site/studio-ivara', '1.1 her home', sp('/v/studio-ivara'));
  for (const w of ['looks', 'work', 'acts', 'events']) ok(K.sitePath(`/v/s/${w}/the-emerald-bride`)?.to === `/site/s/${w}/the-emerald-bride`, `1.2 a look under "${w}"`, sp(`/v/s/${w}/the-emerald-bride`));
  ok(K.sitePath('/v/s/collections/winter')?.to === '/site/s/collections/winter', '1.3 a collection');
  ok(K.sitePath('/v/s/date') === null && K.sitePath('/v/s/w/aditi-and-rohan') === null, '1.4 the date leaf and the wedding page stay classic');
  ok(K.sitePath('/v/s/looks/Bad_Slug') === null && K.sitePath('/vendor/x') === null && K.sitePath('/v/s/other/x') === null, '1.5 anything else is not the site\'s');
  sec('2  her own address');
  const d = (p) => V.decide('studio-ivara.thedreamwedding.in', p, 'https://thedreamwedding.in', '');
  ok(d('/')?.pathname === '/v/studio-ivara' && d('/date')?.pathname === '/v/studio-ivara/date' && d('/w/a-and-b')?.pathname === '/v/studio-ivara/w/a-and-b', '2.1 the earlier answers unchanged (/, /date, /w/<slug>)');
  ok(d('/looks/the-emerald-bride')?.pathname === '/v/studio-ivara/looks/the-emerald-bride' && d('/collections/winter')?.pathname === '/v/studio-ivara/collections/winter', '2.2 her look and collection pages rewrite');
  ok(d('/site-fonts/x.woff2') === null && d('/site-rt/abc.js') === null && d('/site-beacon') === null, '2.3 the site\'s faces, script and beacon pass through');
  ok(d('/anything-else')?.kind === 'redirect', '2.4 anything else still redirects to the apex');
  sec('3  siteKind');
  let calls = 0; let answer = { ok: true, v: 'styles' }; let fails = false;
  global.fetch = async () => { calls += 1; if (fails) throw new Error('down'); return { ok: true, json: async () => answer }; };
  const K2 = makeLoader()('lib/site/kind.ts');
  ok((await K2.siteKind('a', false)) === 'styles', '3.1 the door\'s "styles" is honoured');
  const c1 = calls; await K2.siteKind('a', false); ok(calls === c1, '3.2 remembered inside the window (the door asked once)');
  await K2.siteKind('a', true); ok(calls === c1 + 1, '3.3 her preview is never served from memory');
  answer = { ok: true, v: 'classic' }; ok((await K2.siteKind('b', false)) === 'classic', '3.4 "classic" is classic');
  answer = { ok: true, v: 'weird' }; ok((await K2.siteKind('c', false)) === 'classic', '3.5 anything else is classic');
  fails = true; ok((await K2.siteKind('d', false)) === 'classic', '3.6 a failure is classic');
  sec('4  mutations');
  const lie = async () => 'styles'; ok((await lie('b')) !== (await K2.siteKind('b', false)), '4.1 a door saying styles for everyone would differ from §3.4');
  const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'lib/public/vendorHost.ts'), 'utf8');
  ok(/site-fonts\/'\) \|\| p\.startsWith\('\/site-rt\/'\) \|\| p === '\/site-beacon'\) return null/.test(src), '4.2 the pass-through is the one line §2.3 reads');
  sec('5  r2: her preview, the font ruling, her canonical');
  const C = makeLoader()('lib/site/card.ts');
  ok(C.previewQuery({ token: 'a b', style: 'noir' }) === '?preview=a%20b&style=noir' && C.previewQuery(null) === '', '5.1 her token and the style she is trying reach the card door');
  const fsr = require('fs'); const pth = require('path'); const R = (f) => fsr.readFileSync(pth.join(__dirname, '..', f), 'utf8');
  ok(/preview \? \{ cache: 'no-store' \}/.test(R('lib/site/card.ts')) && /preview \? \{ cache: 'no-store' \}/.test(R('lib/site/look.ts')), '5.2 a preview is fetched uncached (card and look)');
  ok(['app/site/[code]/route.ts', 'app/site/[code]/[word]/[slug]/route.ts'].every((f) => /: 'mixed';/.test(R(f))), '5.3 font-display mixed by default on both routes (the founder, 1 Oct)');
  ok(/searchParams\.has\('preview'\)/.test(R('middleware.ts')), '5.4 a preview goes to the site\'s route whatever the kind door says');
  global.fetch = async () => { throw new Error('no network'); };
  console.log(`\nb163: ${pass} pass, ${fail} fail`); if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
})().catch((e) => { console.log('b163: crashed ' + (e && e.stack || e)); process.exit(1); });
