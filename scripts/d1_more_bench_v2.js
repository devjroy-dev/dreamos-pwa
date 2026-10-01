#!/usr/bin/env node
// scripts/d1_more_bench_v2.js · CE-47 · FE-5 · MORE, AS THE FOUNDER RULED IT AFTER HIS WALK (30 Sept 2026).
// The real new layout (next dev, mock session, the b123 fixtures through Claude Code's harness):
//   M1 the bar has six items, Today, Enquiries, Calendar, Clients, Money, More, each an icon over its word (the chair's
//      ruling on the bar), at least 8 between neighbouring words at 360;
//      no word truncated or wrapped; each item's tap area at least 44 tall and 44 wide; the Ask bar sits above the bar
//      (360 and 374, dark and light);
//   M2 the initials coin opens ONLY the account menu (Settings, Billing, sign out among it), never the rooms, and no
//      room link is in it;
//   M3 More's rendered rooms, in order, equal today's Rooms order read from the classic registry (the headline pair,
//      then every shelf, item for item); no "Pinned", no "Change pinned".
// --mutate: M1m the More item removed from the bar → M1 RED; restored byte for byte.
const path = require('path'); const fs = require('fs'); const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
process.env.PORT = process.env.PORT || '4163';
process.env.TDW_LAYOUT_DEFAULT = 'v2';
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const MUT = process.argv.includes('--mutate');
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; failed.push(name); console.log('  FAIL  ' + name + (info === undefined ? '' : '  [' + String(info).slice(0, 300) + ']')); } };
const J = (x) => JSON.stringify(x);

// the classic order, read from the classic registry's source (the one home), as the classic Rooms page draws it
// the registry is CODE: read with the estate's one comment stripper (scripts/lib/stripComments.mjs, F-07.74), so a
// comment that spells a room can never count as one
let stripComments = (s) => s;
function classicOrder() {
  const src = stripComments(fs.readFileSync(path.join(ROOT, 'lib/worklist/rooms.ts'), 'utf8'));
  const heads = [...src.matchAll(/\{ id: '([a-z-]+)',[^}]*headline: true[^}]*\}/g)].map((m) => m[1]);
  const shelves = src.slice(src.indexOf('export const SHELVES'), src.indexOf('] as const;', src.indexOf('export const SHELVES')));
  const items = [...shelves.matchAll(/\{ (room|row): '([a-z-]+)' \}/g)].map((m) => m[2]);
  return heads.concat(items);
}

async function launch(H) {
  const usable = (p) => { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } };
  let bin = usable(process.env.CHROME_BIN) ? process.env.CHROME_BIN : null;
  if (!bin) { try { const mod = await import(path.join(ROOT, 'node_modules/@sparticuz/chromium/build/index.js')); const c = mod.default || mod; const p = await c.executablePath(); if (usable(p)) bin = p; } catch (_e) { /* fallbacks */ } }
  if (!bin) return H.browser();
  const puppeteer = (await import(path.join(ROOT, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))).default;
  return puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
}

async function run(only) {
  const H = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
  let server = null, b = null, bpid = null; const out = { bar: {} };
  try {
    server = await dev.start(ROOT, +process.env.PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${process.env.PORT}/__api` });
    if (!(await server.up())) { out.error = 'the dev server did not come up'; return out; }
    b = await launch(H); bpid = b.process() && b.process().pid;
    for (const [vp, w] of [['android', 360], ['ios', 374]]) for (const mode of (only ? ['dark'] : ['dark', 'light'])) {
      const p = await H.open(b, '/vendor/today', { mode, layout: 'v2', vp, dpr: 1 });
      out.bar[`${w} ${mode}`] = await p.evaluate(() => {
        const nav = document.querySelector('nav.wl-nav'); if (!nav) return null;
        const items = Array.from(nav.querySelectorAll('a')).map((a) => { const r = a.getBoundingClientRect(); const t = a.querySelector('span') || a;
          // wrapped: the label's own text lays out on more than one line (its range has line boxes at two heights)
          const rg = document.createRange(); rg.selectNodeContents(t); const tops = new Set(Array.from(rg.getClientRects()).map((q) => Math.round(q.top)));
          return { text: a.innerText.replace(/\s+/g, ' ').trim(), w: Math.round(r.width), h: Math.round(r.height), icon: !!a.querySelector('svg'),
            clipped: t.scrollWidth > t.clientWidth + 1, wrapped: tops.size > 1 }; });
        const dock = document.querySelector('.wl-dock') || Array.from(document.querySelectorAll('input,textarea,button')).find((e) => /Ask TDW/.test(e.placeholder || '')) ;
        const dr = dock ? dock.getBoundingClientRect() : null; const nr = nav.getBoundingClientRect();
        // the gap between neighbours: from one word's right edge to the next word's left edge (the chair: at least 8 at 360)
        const words = Array.from(nav.querySelectorAll('a')).map((a) => { const t = a.querySelector('span') || a; const rg = document.createRange(); rg.selectNodeContents(t); return rg.getBoundingClientRect(); });
        const gaps = words.slice(1).map((w, i) => Math.round((w.left - words[i].right) * 10) / 10);
        return { items, askAbove: !!dr && dr.bottom <= nr.top + 1, gaps, minGap: Math.min(...gaps) };
      });
      await p.close();
    }
    // M2 and M3 at 374 dark
    const p = await H.open(b, '/vendor/today', { mode: 'dark', layout: 'v2', vp: 'ios', dpr: 1 });
    await p.click('[data-coin]').catch(() => {}); await new Promise((r) => setTimeout(r, 500));
    out.coin = await p.evaluate(() => { const m = document.querySelector('[data-account-menu]'); if (!m) return null;
      return { text: m.innerText, rooms: Array.from(m.querySelectorAll('a')).map((a) => a.getAttribute('href')), path: location.pathname }; });
    await p.close();
    const q = await H.open(b, '/vendor/more', { mode: 'dark', layout: 'v2', vp: 'ios', dpr: 1 });
    out.more = await q.evaluate(() => ({ keys: Array.from(document.querySelectorAll('[data-more]')).map((e) => e.getAttribute('data-more')), text: document.querySelector('main') ? document.querySelector('main').innerText : '' }));
    await q.close();
  } catch (e) { out.error = String((e && e.message) || e); }
  finally {
    if (b) { try { await b.close(); } catch (_e) { /* gone */ } }
    if (bpid) { try { stopTree(bpid); } catch (_e) { /* gone */ } }
    if (server) { try { stopTree(server.dev.pid); } catch (_e) { /* gone */ } try { await server.stop(); } catch (_e) { /* gone */ } }
  }
  return out;
}
const WANT = ['Today', 'Enquiries', 'Calendar', 'Clients', 'Money', 'More'];
function barOk(v) { return !!v && J(v.items.map((i) => i.text)) === J(WANT) && v.items.every((i) => i.icon && !i.clipped && !i.wrapped && i.h >= 44 && i.w >= 44) && v.askAbove && v.minGap >= 8; }
(async () => {
  ({ stripComments } = await import(path.join(ROOT, 'scripts/lib/stripComments.mjs')));
  console.log('d1 More (v2) · the founder\u2019s ruling after his walk');
  if (MUT) {
    const F = path.join(ROOT, 'v2/components/worklist/WorklistShell.tsx'); const before = fs.readFileSync(F);
    const restore = () => fs.writeFileSync(F, before); process.once('exit', restore);
    try { const t = before.toString(); const a = t.indexOf("        <Link href={MORE_HREF} className={'wl-seat wl-seatmore'"); const e = t.indexOf('</Link>', a);
      if (a < 0) ok(false, 'M1m the anchor is absent');
      else { fs.writeFileSync(F, t.slice(0, a) + t.slice(e + 7)); const o = await run(true); if (o.error) ok(false, 'M1m crashed', o.error); else ok(!barOk(o.bar['360 dark']), 'M1m the More item removed from the bar \u2192 M1 RED', J(o.bar['360 dark'] && o.bar['360 dark'].items.map((i) => i.text))); }
    } finally { restore(); ok(crypto.createHash('sha256').update(fs.readFileSync(F)).digest('hex') === crypto.createHash('sha256').update(before).digest('hex'), 'M0 WorklistShell.tsx restored byte for byte'); }
  } else {
    const o = await run(false);
    if (o.error) ok(false, '0.1 the pages came up', o.error);
    for (const k of ['360 dark', '374 dark']) console.log(`  READ  [${k}] gaps between words ${J(o.bar[k] && o.bar[k].gaps)}`);
    for (const k of ['360 dark', '360 light', '374 dark', '374 light']) ok(barOk(o.bar[k]), `M1 [${k}] six items, each an icon over its word, More last, nothing clipped or wrapped, at least 8 between neighbours, each at least 44 by 44, the Ask bar above`, J(o.bar[k]));
    ok(!!o.coin && /Settings/.test(o.coin.text) && /Billing/.test(o.coin.text) && /Sign out/i.test(o.coin.text) && o.coin.rooms.every((h) => !h || /\/vendor\/(settings|billing)/.test(h)) && o.coin.path === '/vendor/today',
      'M2 the coin opens only the account menu (Settings, Billing, sign out); no room in it; the page does not move', J(o.coin));
    const want = classicOrder();
    ok(!!o.more && J(o.more.keys) === J(want), 'M3 More draws today\u2019s Rooms order, room for room, from the classic registry', J({ drawn: o.more && o.more.keys, want }));
    ok(!!o.more && !/Pinned|Change pinned/.test(o.more.text), 'M3b no Pinned and no Change pinned on More', '');
    ok(!!o.more && !/\bcouples?\b/i.test(o.more.text), 'M3c no "couple" in a drawn byte of More', (o.more && (o.more.text.match(/[^\n]*couples?[^\n]*/gi) || []).join(' | ')) || '');
  }
  console.log(`\n${fail ? 'RED' : 'GREEN'} — d1 More (v2) ${pass}/${pass + fail}${fail ? '\n  ' + failed.join('\n  ') : ''}`);
  process.exit(fail ? 1 : 0);
})();
