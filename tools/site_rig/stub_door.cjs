// WEB-5 rig: a stub of dream-os's public doors + the fixture photographs + mocked Google Fonts CSS.
// Never part of a Next build. Usage: node stub_door.cjs <port> <fixturesDir> <fontsrcDir>
const http = require('http'), fs = require('fs'), path = require('path');
const [port, FX, FS] = [+process.argv[2], process.argv[3], process.argv[4]];
const base = `http://127.0.0.1:${port}`;
const ph = (k, i, hero) => ({ url: `${base}/fx/${k}-960.webp`, caption: null, hero: !!hero, position: i });
const CARD = {
  business_name: 'Studio Ivara', category: 'makeup_artist', city: 'New Delhi', handle: 'fixture-studio', is_demo: false,
  enquiry_phone: null, about: 'Bridal makeup and hair for weddings across Delhi NCR. Soft skin, a defined eye and a lip chosen to sit with the jewellery.',
  starting_price: 45000, photos: [ph('green-necklace', 0, true), ph('tikka', 1), ph('pastel-saree', 2), ph('veil-hands', 3), ph('kaleere', 4), ph('kundan', 5)],
  enquire_link: 'https://wa.me/910000000000', seal: null, date_check_enabled: true, weddings: [],
  meta: { title: 'Studio Ivara · Makeup artist · New Delhi', description: 'Bridal makeup and hair for weddings across Delhi NCR.' },
  packages: [{ name: 'Bridal makeup and hair', description: null, total: 45000, items: [{ label: 'Trial session', detail: null }] }],
  site: { look: null, pages: [], credit: true, domain: null },
};
const FAM = { 'Inter': 'inter', 'Playfair Display': 'playfair-display', 'DM Sans': 'dm-sans', 'Fraunces': 'fraunces' };
function fontCss(q) {
  let out = '';
  for (const fam of [...q.matchAll(/family=([^&:]+)(?::([^&]+))?/g)]) {
    const name = decodeURIComponent(fam[1].replace(/\+/g, ' ')); const pkg = FAM[name]; if (!pkg) continue;
    const dir = path.join(FS, 'node_modules/@fontsource', pkg, 'files'); if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(f => /-latin-\d+-(normal|italic)\.woff2$/.test(f))) {
      const [, w, st] = f.match(/-latin-(\d+)-(normal|italic)\.woff2$/);
      out += `@font-face{font-family:'${name}';font-style:${st};font-weight:${w};font-display:swap;src:url(${base}/ff/${pkg}/${f}) format('woff2')}\n`;
    }
  }
  return out;
}
let KIND_HITS = 0; const BEACONS = []; const PREVIEWS = [];
http.createServer((req, res) => {
  const u = new URL(req.url, base);
  const m = u.pathname.match(/^\/api\/v2\/public\/vendor-card\/([^/]+)$/);
  const SC = require('./fixture_cards.cjs')(base);
  const lk = u.pathname.match(/^\/api\/v2\/public\/vendor-card\/([^/]+)\/look\/([^/]+)$/);
  if (lk) { const c = SC[lk[1]]; const i = c ? c.looks.findIndex((l) => l.slug === lk[2]) : -1; res.writeHead(i >= 0 ? 200 : 404, { 'content-type': 'application/json' });
    if (i < 0) return res.end(JSON.stringify({ ok: false }));
    const l = c.looks[i]; const cov = (c.site.cover || [])[i % Math.max(1, c.site.cover.length)];
    return res.end(JSON.stringify({ ok: true, look: { slug: l.slug, title: l.title, category: l.category, year_label: l.year_label, description: 'Soft-focus skin, a defined eye and a lip chosen to sit with the jewellery. Built to last from the pheras to the last photograph.',
      included: ['Makeup and hair for the bride', 'Draping and jewellery setting', 'Touch-ups until the pheras'], from_price: l.from_price, package: { name: 'Bridal makeup and hair' },
      credits: [{ role: 'outfit', name: 'Label Noor', handle: 'label-noor' }, { role: 'jewellery', name: 'Kundan House', handle: null }, { role: 'photograph', name: 'Frame and Field', handle: null }],
      videos: [], photos: [l.cover, l.second, cov && cov.photo].filter(Boolean), related: c.looks.filter((x) => x.slug !== l.slug).slice(0, 5),
      seo: { title: l.title, description: 'Soft-focus skin, a defined eye and a lip chosen to sit with the jewellery.', image: null } } })); }
  const kd = u.pathname.match(/^\/api\/v2\/public\/site-kind\/([^/]+)$/);
  if (kd) { KIND_HITS++; return setTimeout(() => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: true, v: SC[kd[1]] ? 'styles' : 'classic' })); }, +(process.env.KIND_DELAY || 0)); }
  if (u.pathname === '/_kind_hits') { res.writeHead(200); return res.end(String(KIND_HITS)); }
  if (/^\/api\/v2\/public\/site\/(visit|heart)$/.test(u.pathname)) { let b = ''; req.on('data', (d) => (b += d)); req.on('end', () => { BEACONS.push(u.pathname.split('/').pop() + ' ' + b); res.writeHead(204); res.end(); }); return; }
  if (u.pathname === '/_previews') { res.writeHead(200); return res.end(JSON.stringify(PREVIEWS)); }
  if (u.pathname === '/_beacons') { res.writeHead(200); return res.end(JSON.stringify(BEACONS)); }
  if (m && u.searchParams.get('preview')) PREVIEWS.push(m[1] + ' ' + u.search);
  if (m && SC[m[1]]) { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ ok: true, card: SC[m[1]] })); }
  if (m) { res.writeHead(m[1] === 'fixture-studio' ? 200 : 404, { 'content-type': 'application/json' }); return res.end(JSON.stringify(m[1] === 'fixture-studio' ? { ok: true, card: CARD } : { ok: false, error: 'Not found.' })); }
  const w = u.pathname.match(/^\/api\/v2\/public\/wedding\/([^/]+)\/([^/]+)$/);
  if (w) { const okw = w[1] === 'fixture-studio' && w[2] === 'aditi-and-rohan'; res.writeHead(okw ? 200 : 404, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(okw ? { ok: true, wedding: { slug: 'aditi-and-rohan', title: 'Aditi and Rohan', venue: 'The Oberoi Udaivilas', city: 'Udaipur', season: 'Winter 2026' },
      owner: { business_name: 'Studio Ivara', handle: 'fixture-studio', enquire_link: 'https://wa.me/910000000000' },
      roll: [{ role: 'makeup', label: 'Makeup', name: 'Studio Ivara', handle: 'fixture-studio', enquire_link: 'https://wa.me/910000000000' }, { role: 'photography', label: 'Photography', name: 'Frame and Field', handle: null, enquire_link: null }],
      team: [{ name: 'Studio Ivara', is_owner: true }], photos: ['pavilion', 'arch', 'staircase', 'sikh-couple'].map((k, i) => ({ url: `${base}/fx/${k}-960.webp`, position: i })) } : { ok: false, error: 'Not found.' })); }
  const av = u.pathname.match(/^\/api\/v2\/public\/availability\/([^/]+)\/(\d{4}-\d{2}-\d{2})$/);
  if (av) { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ ok: true, date: av[2], blocked: false, sold: false, any_held: av[2].endsWith('-14') })); }
  // Cloudinary-shaped fixture urls: /tdwfx/image/upload/<chain>/v1/site/<key>.jpg (the renderer's img.ts shape)
  const cl = u.pathname.match(/^\/tdwfx\/image\/upload\/([^/]+)\/v\d+\/site\/([a-z-]+)\.jpg$/);
  if (cl) { const meta = JSON.parse(fs.readFileSync(path.join(FX, 'fixtures.json'), 'utf8'))[cl[2]]; if (!meta) { res.writeHead(404); return res.end(); }
    if (/w_24,e_blur/.test(cl[1])) { const b = Buffer.from(meta.lq.split(',')[1], 'base64'); res.writeHead(200, { 'content-type': 'image/webp' }); return res.end(b); }
    const want = +((cl[1].match(/w_(\d+)/) || [])[1] || 960); const ws = meta.widths.slice().sort((a, b) => a - b);
    const w = ws.find((x) => x >= want) || ws[ws.length - 1];
    const avif = /image\/avif/.test(req.headers.accept || '') && (meta.formats[String(w)] || []).includes('avif');
    const webpOk = (meta.formats[String(w)] || []).includes('webp');
    const ext = avif || !webpOk ? 'avif' : 'webp';
    const f = path.join(FX, `${cl[2]}-${w}.${ext}`); res.writeHead(200, { 'content-type': 'image/' + ext, 'cache-control': 'public, max-age=31536000' }); return fs.createReadStream(f).pipe(res); }
  if (u.pathname.startsWith('/fx/')) { const p = path.join(FX, path.basename(u.pathname)); if (fs.existsSync(p)) { res.writeHead(200, { 'content-type': p.endsWith('.avif') ? 'image/avif' : 'image/webp' }); return fs.createReadStream(p).pipe(res); } }
  if (u.pathname === '/gfonts.css') { res.writeHead(200, { 'content-type': 'text/css', 'access-control-allow-origin': '*' }); return res.end(fontCss(u.searchParams.get('q') || '')); }
  if (u.pathname.startsWith('/ff/')) { const [, , pkg, f] = u.pathname.split('/'); const p = path.join(FS, 'node_modules/@fontsource', pkg, 'files', f); if (fs.existsSync(p)) { res.writeHead(200, { 'content-type': 'font/woff2', 'access-control-allow-origin': '*' }); return fs.createReadStream(p).pipe(res); } }
  res.writeHead(404); res.end('{}');
}).listen(port, '127.0.0.1', () => console.log('stub door on', port));
