// scripts/lib/lcv_p2_panel_probe.mjs · TDW CE-44 · LCV-1 · LC-Victor P2, the panel cut · the switchboard
// driven in a REAL headless Chromium against `next dev` (C-43.18). Run by
// scripts/b87_lcv_p2_panel_bench.js, which spawns next dev and passes PORT; never collected by
// run-floor.sh (scripts/lib/ is outside its flat glob).
//
// THE DOOR IS MOCKED AT THE NETWORK: /__api/api/v2/admin/model_routes serves three lanes:
//   pwa_vendor · signature  roles provider, donna, listener; primary Anthropic, listener split DeepSeek
//   pwa_vendor · advisor    roles provider, donna (the server serves no listener here)
//   wa_vendor · basic       roles provider, donna, listener AND an invented role, `oracle`
// A POST records its body and applies it, so the panel's reload after a pick reads the result.
//
// usage: node scripts/lib/lcv_p2_panel_probe.mjs PORT MODE [SHOT]   MODE = dark | light
// Prints ONE line of JSON: the rows on the glass before and after tapping the Listener's
// DeepSeek on the basic lane, the POST body, and the console warnings.
import fs from 'fs';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const PORT = process.argv[2] || '3988';
const MODE = process.argv[3] === 'light' ? 'light' : 'dark';
const SHOT = process.argv[4] || '';
const HAIKU = 'claude-haiku-4-5-20251001';

// THE BROWSER, the pwa's own order (b83_room_probe.mjs, e-44.18): CHROME_BIN if set and
// executable, then @sparticuz/chromium. Never the executor's own Playwright path first.
function usable(p) { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } }
async function resolveBin() {
  const tried = [];
  const env = process.env.CHROME_BIN;
  tried.push(`CHROME_BIN=${env || '(unset)'}`);
  if (usable(env)) return { bin: env, how: 'CHROME_BIN', tried };
  try {
    const mod = await import('@sparticuz/chromium');
    const chromium = mod.default || mod;
    const p = await chromium.executablePath();
    tried.push(`@sparticuz/chromium executablePath()=${p || '(none)'}`);
    if (usable(p)) return { bin: p, how: '@sparticuz/chromium', tried };
  } catch (e) { tried.push(`@sparticuz/chromium threw: ${String(e && e.message).split('\n')[0]}`); }
  return { bin: null, how: null, tried };
}

const lane = (key, surface, tier, roles, effective) => ({
  key, surface, tier, roles, reachable: true, unreachable_because: null, fallback_surface: null,
  has_row: true, live: effective, code_default: effective, effective, borrowed: false, differs: [],
  unknown_fields: [], outside_switchable: [], changed_by: null, changed_at: null, roles_changed: {},
  provenance: null, env: null, env_set: false, read_only_because: null, updated_at: null,
});
const state = {
  'model.pwa_vendor.signature': { provider: 'anthropic', model: HAIKU, listener_provider: 'deepseek', listener_model: 'deepseek-v4-flash' },
  'model.pwa_vendor.advisor': { provider: 'deepseek', model: 'deepseek-v4-flash' },
  'model.wa_vendor.basic': { provider: 'anthropic', model: HAIKU },
};
const LANES = () => [
  lane('model.wa_vendor.basic', 'wa_vendor', 'basic', ['provider', 'donna', 'listener', 'oracle'], state['model.wa_vendor.basic']),
  lane('model.pwa_vendor.signature', 'pwa_vendor', 'signature', ['provider', 'donna', 'listener'], state['model.pwa_vendor.signature']),
  lane('model.pwa_vendor.advisor', 'pwa_vendor', 'advisor', ['provider', 'donna'], state['model.pwa_vendor.advisor']),
];
const SWITCHABLE = { anthropic: HAIKU, deepseek: 'deepseek-v4-flash' };
const json = (o) => ({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });

const { bin, how, tried } = await resolveBin();
if (!bin) { console.log(JSON.stringify({ browser: null, tried })); process.exit(3); }
const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const out = { browser: how, mode: MODE, before: null, after: null, posts: [], warnings: [] };
try {
  const p = await b.newPage();
  await p.setViewport({ width: 1180, height: 900, deviceScaleFactor: 1 });
  p.on('console', (m) => { const t = m.text(); if (/\[switchboard\]/.test(t)) out.warnings.push(t); });
  await p.setCookie({ name: 'tdw_adm_mode', value: MODE, domain: 'localhost', path: '/' });
  await p.evaluateOnNewDocument(() => {
    localStorage.setItem('admin_session_token', 'probe-token');
    localStorage.setItem('admin_session_expires', String(Date.now() + 3600 * 1000));
  });
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0];
    if (route === '/api/v2/admin/model_routes' && r.method() === 'GET') {
      return r.respond(json({ lanes: LANES(), switchable: SWITCHABLE, roles: ['provider', 'donna', 'nudge', 'listener'], forced: null, cache_ms: 60000 }));
    }
    if (route.startsWith('/api/v2/admin/model_routes/') && r.method() === 'POST') {
      const key = decodeURIComponent(route.split('/').pop());
      const body = JSON.parse(r.postData() || '{}');
      out.posts.push({ key, ...body });
      const f = body.role === 'provider' ? ['provider', 'model'] : [`${body.role}_provider`, `${body.role}_model`];
      state[key] = { ...state[key], [f[0]]: body.provider, [f[1]]: SWITCHABLE[body.provider] };
      return r.respond(json({ key, role: body.role, seeded_from: 'row', created: false, value: state[key], updated_at: new Date().toISOString(), effective: state[key], forced: null }));
    }
    return r.respond(json({ ok: true, rows: [], templates: [], items: [], lanes: [] }));
  });
  // Every group on the glass, with the lane it sits in (the nearest ancestor whose first span is
  // a tier name) and the provider it shows pressed.
  const read = () => p.evaluate(() => {
    const tiers = ['Basic', 'Essential', 'Signature', 'Prestige', 'Advisor'];
    return [...document.querySelectorAll('[role="group"][aria-label]')].map((g) => {
      let n = g; let tier = null;
      for (let i = 0; i < 8 && n && !tier; i += 1) {
        n = n.parentElement;
        const s = n && [...n.querySelectorAll('span')].map((x) => x.textContent.trim()).find((t) => tiers.includes(t));
        if (s) tier = s;
      }
      const on = [...g.querySelectorAll('button[aria-pressed="true"]')].map((x) => x.textContent.trim());
      return { label: g.getAttribute('aria-label'), tier, shown: on[0] || null };
    }).filter((x) => /choose who answers/.test(x.label));
  });
  await p.goto(`http://localhost:${PORT}/admin/switchboard`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  for (let i = 0; i < 40; i += 1) { await new Promise((r) => setTimeout(r, 1000)); if ((await read()).length) break; }
  await new Promise((r) => setTimeout(r, 1500));
  out.before = await read();
  if (SHOT) {
    const el = await p.evaluateHandle(() => { const g = document.querySelector('[role="group"][aria-label]'); let n = g; while (n && n.tagName !== 'SECTION') n = n.parentElement; return n; });
    if (el && el.asElement()) await el.asElement().screenshot({ path: SHOT });
  }
  // The tap uses the SAME nearest-tier rule as read(): the Listener group whose NEAREST tier
  // heading is Basic (a listener following its primary), and it picks DeepSeek, so the glass
  // can only show DeepSeek afterwards by reading the listener's own field. Its heading is Basic (a far ancestor holds every lane's heading, so "any" is the wrong test).
  const tapped = await p.evaluate(() => {
    const tiers = ['Basic', 'Essential', 'Signature', 'Prestige', 'Advisor'];
    const tierOf = (g) => {
      let n = g;
      for (let i = 0; i < 8 && n; i += 1) {
        n = n.parentElement;
        const s = n && [...n.querySelectorAll('span')].map((x) => x.textContent.trim()).find((t) => tiers.includes(t));
        if (s) return s;
      }
      return null;
    };
    const g = [...document.querySelectorAll('[role="group"][aria-label]')]
      .find((x) => /^listener/i.test(x.getAttribute('aria-label')) && tierOf(x) === 'Basic');
    const btn = g && [...g.querySelectorAll('button')].find((x) => /deepseek/i.test(x.textContent));
    if (btn) { btn.click(); return true; }
    return false;
  });
  out.tapped = tapped;
  await new Promise((r) => setTimeout(r, 3000));
  out.after = await read();
} finally { await b.close(); }
console.log(JSON.stringify(out));
