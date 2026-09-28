// scripts/b145_ce46_web1_subdomain_bench.js
// TDW · CE-46 · WEB-1 cut 1 · b145 — THE VENDOR'S SUBDOMAIN, THE SITEMAP CURE (F-44.146), THE ADDRESS CURE (F-44.239).
//
// §1 drives lib/public/vendorHost.ts WHOLE in node (transpiled with the tree's
//    own typescript, no build): every host and path the edge can meet, the
//    answer pinned. §2 pins middleware.ts to that function and to the demo
//    rules it keeps. §3 pins the sitemap's wedding address to the route on disk
//    (ls app/v/[code]/w). §4 pins the storefront editor to SITE_BASE. §5 are
//    the mutations: each cure reverted in memory must redden its own cell.
// No dev server, no browser: this rung is a floor member and runs anywhere.
// The measured overflow cell (the site's type at 360 and 374) lands with the
// site's first cut, where the pages it measures exist.
'use strict';
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const ROOT = path.join(__dirname, '..');
const P = (r) => path.join(ROOT, r);
const read = (r) => fs.readFileSync(P(r), 'utf8');
const { stripComments } = require('./lib/stripComments.cjs');
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 220) + ']'}`); } }
const sec = (t) => console.log(`\n§${t}`);
function loadTs(src) {
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} }; new Function('module', 'exports', 'require', js)(m, m.exports, require); return m.exports;
}
const ROOT_HOST = 'thedreamwedding.in';

sec('1  the decision, driven whole');
const H = loadTs(read('lib/public/vendorHost.ts'));
ok(H.rootOf('https://thedreamwedding.in') === 'thedreamwedding.in' && H.rootOf('http://localhost:4310/') === 'localhost:4310' && H.rootOf(undefined) === 'thedreamwedding.in', '1.1 rootOf strips scheme and path, keeps a port, defaults to the ruled root');
ok(H.vendorLabel('dev440.thedreamwedding.in', ROOT_HOST) === 'dev440' && H.vendorLabel('DEV440.thedreamwedding.in', ROOT_HOST) === 'dev440', '1.2 the label is the handle, lowercased (F-40.276)');
ok(['thedreamwedding.in', 'www.thedreamwedding.in', 'demo.thedreamwedding.in', 'demodreamer.thedreamwedding.in', 'demodiscover.thedreamwedding.in', 'demobride.thedreamwedding.in', 'a.b.thedreamwedding.in', 'dev440.example.com', '', null].every((h) => H.vendorLabel(h, ROOT_HOST) === null), '1.3 the apex, www, the four demo hosts, a two-label host, another domain, an empty host: none is a vendor host');
ok(H.vendorLabel('-bad.thedreamwedding.in', ROOT_HOST) === null && H.vendorLabel('ab_cd.thedreamwedding.in', ROOT_HOST) === null, '1.4 a label outside the handle shape is refused');
const d = (host, p, q) => H.decide(host, p, 'https://thedreamwedding.in', q);
ok(JSON.stringify(d('dev440.thedreamwedding.in', '/')) === JSON.stringify({ kind: 'rewrite', pathname: '/v/dev440', handle: 'dev440' }), '1.5 / rewrites to the storefront leaf');
ok(JSON.stringify(d('dev440.thedreamwedding.in', '/date', '?d=2026-12-05')) === JSON.stringify({ kind: 'rewrite', pathname: '/v/dev440/date', handle: 'dev440' }), '1.6 /date rewrites to the date check');
ok(JSON.stringify(d('dev440.thedreamwedding.in', '/w/riya-and-kabir')) === JSON.stringify({ kind: 'rewrite', pathname: '/v/dev440/w/riya-and-kabir', handle: 'dev440' }) && d('dev440.thedreamwedding.in', '/w/riya-and-kabir/').pathname === '/v/dev440/w/riya-and-kabir', '1.7 /w/<slug> rewrites to the wedding leaf, a trailing slash dropped');
ok(d('dev440.thedreamwedding.in', '/v/dev440') === null && d('dev440.thedreamwedding.in', '/v/other/w/x') === null, '1.8 an already-addressed /v/ leaf passes untouched');
ok(JSON.stringify(d('dev440.thedreamwedding.in', '/vendor/login', '?next=1')) === JSON.stringify({ kind: 'redirect', url: 'https://thedreamwedding.in/vendor/login?next=1', handle: 'dev440' }), '1.9 a signed-in surface on her address is a 302 to the apex, search carried');
ok(d('dev440.thedreamwedding.in', '/w/').kind === 'redirect' && d('dev440.thedreamwedding.in', '/w/a/b').kind === 'redirect', '1.10 /w/ bare and /w/a/b are not wedding leaves: to the apex');
ok(d('thedreamwedding.in', '/') === null && d('demo.thedreamwedding.in', '/vendor/x') === null, '1.11 the apex and the demo host get no decision from this function');
ok(H.decide('dev440.localhost:4310', '/vendor/x', 'http://localhost:4310').url === 'http://localhost:4310/vendor/x', '1.12 a local base redirects over http with its port');
ok(JSON.stringify([...H.RESERVED_LABELS]) === JSON.stringify(['www', 'demo', 'demodreamer', 'demodiscover', 'demobride']), '1.13 the reserved labels are exactly the apex\'s www and the four demo hosts middleware.ts owns');

sec('2  middleware.ts reads the function and keeps the demo rules');
const mw = stripComments(read('middleware.ts'));
ok(/import \{ decide \} from '@\/lib\/public\/vendorHost';/.test(mw), '2.1 the edge imports decide from lib/public/vendorHost');
ok(/const d = decide\(host, path, SITE_BASE, url\.search\);/.test(mw), '2.2 the decision is taken from the host, the path, SITE_BASE and the search');
ok(/if \(d && d\.kind === 'rewrite'\) \{ url\.pathname = d\.pathname; return NextResponse\.rewrite\(url\); \}/.test(mw), '2.3 a rewrite keeps the request URL and swaps its pathname');
ok(/if \(d && d\.kind === 'redirect'\) return NextResponse\.redirect\(d\.url, 302\);/.test(mw), '2.4 a redirect is a 302 to the apex');
ok(mw.indexOf("host.startsWith('demo.')") > 0 && mw.indexOf('const d = decide(') > mw.indexOf("url.pathname = '/demo/not-found'"), '2.5 the vendor rule sits AFTER the four demo rules, which are unchanged');
ok(/matcher: \['\/\(\(\?!_next\/static\|_next\/image\|favicon\.ico\|api\)\.\*\)'\]/.test(mw), '2.6 the matcher is unchanged: static, image, favicon and api never reach the rule');
ok(/const SITE_BASE = process\.env\.NEXT_PUBLIC_SITE_BASE \?\? 'https:\/\/thedreamwedding\.in';/.test(mw), '2.7 SITE_BASE has the one spelling the room and the sitemap use');

sec('3  the sitemap names the route on disk (F-44.146)');
const sm = stripComments(read('app/sitemap.ts'));
ok(fs.existsSync(P('app/v/[code]/w/[slug]/page.tsx')), '3.1 the wedding leaf is app/v/[code]/w/[slug]/page.tsx');
ok(/url: p\.slug \? `\$\{SITE_BASE\}\/v\/\$\{p\.handle\}\/w\/\$\{p\.slug\}` : `\$\{SITE_BASE\}\/v\/\$\{p\.handle\}`,/.test(sm), '3.2 the sitemap writes /v/<handle>/w/<slug> for a wedding and /v/<handle> for the card');
ok(!/\/v\/\$\{p\.handle\}\/\$\{p\.slug\}/.test(sm), '3.3 the address that never existed (/v/<handle>/<slug>) is gone');

sec('4  the storefront editor reads SITE_BASE (F-44.239)');
const sf = stripComments(read('app/vendor/(shell)/storefront/screen.tsx'));
ok(/const SITE_BASE = process\.env\.NEXT_PUBLIC_SITE_BASE \?\? 'https:\/\/thedreamwedding\.in';/.test(sf), '4.1 SITE_BASE declared once, the room\'s spelling');
ok(/href=\{`\$\{SITE_BASE\}\/v\/\$\{handle\.toLowerCase\(\)\}`\}/.test(sf), '4.2 the link is built from SITE_BASE');
ok(/`\$\{SITE_BASE\.replace\(\/\^https\?:\\\/\\\/\/, ''\)\}\/v\/\$\{handle\.toLowerCase\(\)\}`/.test(sf), '4.3 the visible address is SITE_BASE without its scheme, as the Your website room prints it');
ok(!/https:\/\/thedreamwedding\.in\/v\//.test(sf) && !/`thedreamwedding\.in\/v\//.test(sf), '4.4 no literal address remains in the editor');

sec('5  mutations: every cure reverted in memory reddens its own cell');
const mSm = sm.replace('/v/${p.handle}/w/${p.slug}', '/v/${p.handle}/${p.slug}');
ok(!/\/v\/\$\{p\.handle\}\/w\/\$\{p\.slug\}/.test(mSm) && /\/v\/\$\{p\.handle\}\/\$\{p\.slug\}/.test(mSm), '5.1 the sitemap reverted to the wrong address fails 3.2 and 3.3');
const mSf = sf.replace('href={`${SITE_BASE}/v/${handle.toLowerCase()}`}', 'href={`https://thedreamwedding.in/v/${handle.toLowerCase()}`}');
ok(/https:\/\/thedreamwedding\.in\/v\//.test(mSf), '5.2 the literal restored in the editor fails 4.2 and 4.4');
const mMw = mw.replace('const d = decide(host, path, SITE_BASE, url.search);', 'const d = null;');
ok(!/const d = decide\(/.test(mMw), '5.3 the edge with the decision removed fails 2.2');
const mH = loadTs(read('lib/public/vendorHost.ts').replace("'www', 'demo', 'demodreamer'", "'www', 'demodreamer'"));
ok(mH.vendorLabel('demo.thedreamwedding.in', ROOT_HOST) === 'demo', '5.4 with demo dropped from the reserved labels the demo host becomes a vendor: 1.3 would fail');
const mH2 = loadTs(read('lib/public/vendorHost.ts').replace("if (p === '/date') return { kind: 'rewrite', pathname: `/v/${handle}/date`, handle };", ''));
ok(mH2.decide('dev440.thedreamwedding.in', '/date', 'https://thedreamwedding.in').kind === 'redirect', '5.5 with the /date rule removed the date check leaves her address: 1.6 would fail');

console.log(`\nb145 ${pass} passed, ${fail} failed${fail ? ': ' + failed.join(' | ') : ''}`);
process.exit(fail ? 1 : 0);
