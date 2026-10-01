// docs/design/tools/harness.mjs · the redesign's browser harness, carried from docs/review/tools/harness.mjs on
// review/ux-simplification. Design tooling only; no production file reads it.
//
// The method is the repo's own benches' (scripts/b140_ce46_fe4_page_help_bench.js, scripts/b143_ads1_ads_page_bench.js):
// `next dev` with NEXT_PUBLIC_USE_MOCKS=true and NEXT_PUBLIC_API_BASE pointed at /__api on the same port, a demo
// vendor (the all-zero id) whose every read is answered by the bench fixtures in scripts/lib/b123_fixtures.mjs, the
// theme chosen by the shell's cookie (tdw_wl_mode), the service worker bypassed.
//
// On top of b123's rows this adds a Today feed and a few this-week events, so the day a vendor sees is not empty.
//
// Start the server first:
//   NEXT_PUBLIC_USE_MOCKS=true NEXT_PUBLIC_API_BASE=http://localhost:4100/__api npx next dev -p 4100
// (4100, not the benches' 3990, so a floor can run beside it.) The faces are the app's own, loaded by next/font;
// FONT_DIR is only for a machine that cannot reach Google Fonts.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from '../../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import * as F from '../../../scripts/lib/b123_fixtures.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '../../..');
export const PORT = +(process.env.PORT || 4100);
export const OUT = path.resolve(ROOT, process.env.OUT || 'docs/design');
const FONT_DIR = process.env.FONT_DIR || '';

const iso = (d) => d.toISOString().slice(0, 10);
const TODAY = new Date();
const plus = (n) => iso(new Date(TODAY.getTime() + n * 864e5));

// ── the review's extra rows (a busy Monday for a photographer) ──────────────────────────────
const crewRS = [{ member_id: 'tm-0001', name: 'Rhea Sharma', initials: 'RS', role: 'Second shooter', confirmation: 'confirmed', external: false }];
const crewAV = [{ member_id: 'tm-0002', name: 'Arjun Verma', initials: 'AV', role: 'Cinematographer', confirmation: 'pending', external: false }];
const EVENTS = { ok: true, total: 4, capped: false, events: [
  { id: 'ev-0101', title: 'Meera and Kunal Haldi', kind: 'shoot', event_date: plus(0), event_time: '10:00:00', state: 'upcoming', lead_id: null, notes: null, linked_binder_id: 'bind-0003' },
  { id: 'ev-0102', title: 'Meera and Kunal Sangeet', kind: 'shoot', event_date: plus(0), event_time: '19:00:00', state: 'upcoming', lead_id: null, notes: null, linked_binder_id: 'bind-0003' },
  { id: 'ev-0103', title: 'Recce at ITC Grand', kind: 'recce', event_date: plus(2), event_time: '11:00:00', state: 'upcoming', lead_id: null, notes: null, linked_binder_id: null },
  ...F.EVENTS.events,
] };
const BANDS = { ...F.BANDS, bands: [
  { binder_id: 'bind-0003', title: 'Meera and Kunal', span: { start: plus(0), end: plus(1) }, money: null, functions: [
    { event_id: 'ev-0101', date: plus(0), slot: 'morning', kind: 'shoot', title: 'Meera and Kunal Haldi', event_time: '10:00:00', crew: crewRS, gap: false },
    { event_id: 'ev-0102', date: plus(0), slot: 'evening', kind: 'shoot', title: 'Meera and Kunal Sangeet', event_time: '19:00:00', crew: [...crewRS, ...crewAV], gap: false },
    { event_id: 'ev-0104', date: plus(1), slot: 'evening', kind: 'shoot', title: 'Meera and Kunal Wedding', event_time: '20:00:00', crew: [], gap: true },
  ] },
  ...F.BANDS.bands,
], loose: [{ event_id: 'ev-0103', date: plus(2), slot: 'morning', kind: 'recce', title: 'Recce at ITC Grand', event_time: '11:00:00', crew: [], gap: false }, ...F.BANDS.loose] };
const CABINET = { ...F.CABINET, clients: [
  ...F.CABINET.clients,
  { ...F.CABINET.clients[0], id: 'bind-0003', client: 'Meera and Kunal', phone: '+919811100005', amount: 380000, amount_received: 190000, amount_pending: 190000, payment_status: 'partial', stage: 'booked', note: 'Haldi, Sangeet, Wedding. Delhi.', missing_cells: [] },
], counts: { ...F.CABINET.counts, clients: 3 } };
const TEAM = { ok: true, members: [...F.TEAM.members,
  { ...F.TEAM.members[0], id: 'tm-0002', name: 'Arjun Verma', role: 'Cinematographer', phone: '+919811100010', daily_rate_inr: 9000, page_token: 'tok-0002' }] };
const INVOICES = { ...F.INVOICES, invoices: [
  { id: 'inv-0003', invoice_number: 'TDW-0003', client_name: 'Meera and Kunal', client_phone: '+919811100005', amount_total: 380000, amount_paid: 190000, amount_owed: 190000, state: 'partial', due_date: plus(3), created_at: '2026-09-01T05:00:00.000Z', lead_package_id: null },
  { ...F.INVOICES.invoices[0], amount_total: 250000, amount_owed: 150000, amount_paid: 100000, state: 'partial' },
  F.INVOICES.invoices[1],
], summary: { total_outstanding: 340000, total_collected: 410000 } };
const WORKLIST = { ok: true, today: plus(0), has_any: true,
  needs_attention: {
    lead_unanswered: [{ id: 'lead-0001', name: 'Aanya Kapoor', wedding_date: '2027-02-14', wedding_city: 'Jaipur', budget_min: 1500000, budget_max: 2500000, state: 'new', created_at: new Date(TODAY.getTime() - 3 * 36e5).toISOString(), redacted: false }],
    invoice_due: [{ id: 'inv-0003', invoice_number: 'TDW-0003', client_name: 'Meera and Kunal', amount_total: 380000, amount_paid: 190000, amount_owed: 190000, due_date: plus(3), state: 'partial' }],
    events_today: EVENTS.events.slice(0, 2).map((e, i) => ({ id: e.id, title: e.title, event_date: e.event_date, event_time: e.event_time, kind: e.kind, slot: i ? 'evening' : 'morning', state: e.state })),
    contract_unsigned: [], team_tasks: [],
  },
  done_today: { invoice_paid: [], contract_signed: [], team_task_done: [] },
  counts: { lead_unanswered: 1, invoice_due: 1, events_today: 2, contract_unsigned: 0, team_tasks: 0 },
  truncated: { lead_unanswered: false, invoice_due: false, events_today: false, contract_unsigned: false, team_tasks: false },
};
const LEADS = { ...F.LEADS, leads: F.LEADS.leads.map((l) => l.id === 'lead-0001' ? { ...l, created_at: WORKLIST.needs_attention.lead_unanswered[0].created_at } : l) };
const pkg = (id, name, description, items, total, def) => ({ id, name, description, line_items: items, total, deposit_pct: 30, middle_pct: 40, middle_enabled: true,
  delivery_basis: 'days', delivery_days: 45, is_default: def, seeded_from: null, split: [], created_at: '2026-08-01T05:00:00.000Z', updated_at: '2026-08-01T05:00:00.000Z' });
const PACKAGES = { ok: true, packages: [
  pkg('pkg-1', 'Wedding day', 'One day, two shooters, 400 edited photos', [{ label: 'Photography, one day', detail: '' }, { label: 'Second shooter', detail: '' }], 150000, true),
  pkg('pkg-2', 'Full wedding', 'Three functions, film and album', [{ label: 'Photography, three functions', detail: '' }, { label: 'Wedding film', detail: '' }, { label: 'Album', detail: '' }], 380000, false),
] };

// The b140 bench's doors for rooms that crash on a bare {ok:true}.
const DOORS = [
  [/^\/api\/v2\/vendor\/tds\/[^/]+\/summary$/, { ok: true, financial_year: '2026-27', total_gross: 0, total_tds: 0, total_net: 0, entry_count: 0, by_section: [] }],
  [/^\/api\/v2\/vendor\/tds\/[^/]+$/, { ok: true, entries: [], total: 0 }],
  [/^\/api\/v2\/vendor\/portfolio\/[^/]+$/, { ok: true, images: [], total: 0 }],
  [/^\/api\/v2\/vendor\/discover\/status$/, { ok: true, min_portfolio_images: 6, max_portfolio_images: 40, ig_import_enabled: false, discover_request_state: 'none' }],
  [/^\/api\/v2\/vendor\/ig\/status$/, { ok: true, ig_import_enabled: false, connected: false }],
  [/^\/api\/v2\/vendor\/referrals$/, { ok: true, sent_count: 0, received_count: 0, peers: [] }],
  [/^\/api\/v2\/vendor\/exchange$/, { ok: true, role: 'sender', opted_in: null }],
  [/^\/api\/v2\/vendor\/exchange\/creators$/, { ok: true, creators: [] }],
  [/^\/api\/v2\/vendor\/exchange\/(requests|inbox)$/, { ok: true, requests: [] }],
  [/^\/api\/v2\/vendor\/collab\/feed$/, { ok: true, feed: [], count: 0 }],
  [/^\/api\/v2\/vendor\/collab\/my-posts$/, { ok: true, posts: [] }],
  [/^\/api\/v2\/vendor\/collab\/[^/]+\/responses$/, { ok: true, responses: [] }],
  [/^\/api\/v2\/vendor\/collab\/requirement-types$/, { ok: true, requirement_types: [], shoot_event_types: [] }],
  [/^\/api\/v2\/vendor\/contracts$/, { ok: true, contracts: [], total: 0 }],
];
const EMPTY = { ok: true, items: [], posts: [], contracts: [], rows: [], sent: [], received: [], responses: [], list: [] };

function leadPackage(leadId, inb) {
  const src = PACKAGES.packages.find((x) => x.id === inb.package_id) || PACKAGES.packages[1];
  const total = inb.total || src.total;
  return { id: 'lp-1', lead_id: leadId, package_id: src.id, snapshot: { name: src.name, description: src.description, line_items: src.line_items, deposit_pct: 30, middle_pct: 40, middle_enabled: true, delivery_basis: 'days', delivery_days: 45, source_package_id: src.id, source_seeded_from: null, tells: [] },
    total, schedule: [{ kind: 'deposit', pct: 30, amount: total * 0.3, due_on: plus(0) }, { kind: 'middle', pct: 40, amount: total * 0.4, due_on: '2027-01-14' }, { kind: 'final', pct: 30, amount: total * 0.3, due_on: '2027-02-14' }],
    delivery_on: '2027-03-31', quoted_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
}

export function answer(route) {
  const V = F.VID;
  if (route === '/api/v2/vendor/worklist/today') return WORKLIST;
  if (route === `/api/v2/vendor/events/${V}`) return EVENTS;
  if (route === `/api/v2/vendor/bands/${V}`) return BANDS;
  if (route === `/api/v2/vendor/cabinet/${V}`) return CABINET;
  // DESIGN-1 stage 5b: the typed roster (public.clients), for a found client; Meera's number is her binder's
  if (route === `/api/v2/vendor/clients/${V}`) return { ok: true, total: 1, clients: [{ id: 'client-meera', name: 'Meera and Kunal', phone: '+91 98111 00005', email: null, notes: null, created_at: '2026-09-01T05:00:00.000Z' }] };
  if (route === `/api/v2/vendor/leads/${V}`) return LEADS;
  if (route === `/api/v2/vendor/money/invoices/${V}`) return INVOICES;
  if (route === '/api/v2/vendor/studio/team') return TEAM;
  if (route === '/api/v2/vendor/packages') return PACKAGES;
  if (route === `/api/v2/vendor/chat/history/${V}`) return { ok: true, messages: [] };
  // DESIGN-1 stage 3: the search door's answer for "meera" (dream-os src/api/vendor/search.js), for the search shots
  if (route === '/api/v2/vendor/search') return { ok: true, q: 'meera', groups: [
    { kind: 'enquiries', total: 1, items: [{ id: 'lead-meera', title: 'Meera Kapoor', sub: '2026-12-14 \u00b7 Jaipur' }] },
    { kind: 'clients', total: 1, items: [{ id: 'client-meera', title: 'Meera & Arjun', sub: '98765 43210' }] },
    { kind: 'events', total: 2, items: [{ id: 'ev-1', title: 'Meera & Arjun sangeet', sub: '2026-12-13' }, { id: 'ev-2', title: 'Meera & Arjun wedding', sub: '2026-12-14' }] },
    { kind: 'notes', total: 1, items: [{ id: 'n-1', title: 'Call Meera about the album', sub: null }] },
  ] };
  const dm = route.match(/^\/api\/v2\/vendor\/day\/[^/]+\/(\d{4}-\d{2}-\d{2})$/);
  if (dm) { const d = dm[1]; const all = [...BANDS.bands.flatMap((b) => b.functions.map((f) => ({ ...f, binder_name: b.title, linked_binder_id: b.binder_id }))), ...BANDS.loose];
    const events = all.filter((f) => f.date === d).map((f) => ({ id: f.event_id, title: f.title, kind: f.kind, slot: f.slot, event_time: f.event_time, state: 'upcoming', notes: null, lead_id: null, linked_binder_id: f.linked_binder_id || null, binder_name: f.binder_name || null, assigned_member_ids: (f.crew || []).map((c) => c.member_id) }));
    const hot = F.HOT_DATES.dates.find((h) => h.date === d);
    return { ok: true, date: d, events, blocks: F.AVAILABILITY.blocks.filter((x) => x.blocked_date === d), hot: hot ? { note: hot.note, label: null } : null, milestones: [], followups: [] }; }
  const door = DOORS.find(([re]) => re.test(route));
  if (door) return door[1];
  const base = F.answer(route);
  return base && Object.keys(base).length === 1 && base.ok === true ? EMPTY : base;
}

function usable(p) { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } }
export async function browser() {
  let bin = process.env.CHROME_BIN;
  if (!usable(bin)) { for (const c of ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium']) if (usable(c)) { bin = c; break; } }
  // CE-47 FE-8 (the chair's ruling C): CHROME_BIN, then /opt/pw-browsers, then @sparticuz/chromium (the estate's browser, the one the
  // founder's Codespace has), as FE-7's kit and d1_ce46_rooms_render_v2 do. Without this last step a machine with neither of the
  // first two launches nothing ("An executablePath or channel must be specified").
  if (!usable(bin)) { try { const mod = await import('../../../node_modules/@sparticuz/chromium/build/index.js'); const c = mod.default || mod; const p = await c.executablePath(); if (usable(p)) bin = p; } catch (_e) { /* no browser found: launch says so */ } }
  return puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none', ...(process.env.CHROME_ARGS ? process.env.CHROME_ARGS.split(' ') : [])] });
}

// The real faces (the b123 method): DM Sans and Cormorant Garamond from @fontsource, under the names next/font gave them.
function faceCss(names) {
  if (!FONT_DIR) return '';
  const dirOf = (n) => fs.readdirSync(FONT_DIR).find((d) => d.startsWith('fontsource-' + n + '-') && !d.endsWith('.tgz'));
  const f = (dir, file) => path.join(FONT_DIR, dir, 'package/files', file);
  const face = (fam, file, w) => usable(file) ? `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;src:url(data:font/woff2;base64,${fs.readFileSync(file).toString('base64')}) format('woff2');}` : '';
  const dm = fs.readdirSync(FONT_DIR).find((d) => d.startsWith('fontsource-dm-sans') && !d.endsWith('.tgz'));
  const co = fs.readdirSync(FONT_DIR).find((d) => d.startsWith('fontsource-cormorant-garamond') && !d.endsWith('.tgz'));
  return [400, 500, 600].map((w) => face(names.dm, f(dm, `dm-sans-latin-${w}-normal.woff2`), w)).join('') +
    [500, 600].map((w) => face(names.co, f(co, `cormorant-garamond-latin-${w}-normal.woff2`), w)).join('') +
    // the proposed faces, under their own names (the prototype asks for them by name)
    [400, 500, 600].map((w) => face('Inter', f(dirOf('inter'), `inter-latin-${w}-normal.woff2`), w)).join('') +
    [400, 500, 600].map((w) => face('IBM Plex Sans', f(dirOf('ibm-plex-sans'), `ibm-plex-sans-latin-${w}-normal.woff2`), w)).join('') +
    [500, 600].map((w) => face('Cormorant Garamond', f(co, `cormorant-garamond-latin-${w}-normal.woff2`), w)).join('');
}

export const VIEWPORTS = { ios: { width: 374, height: 812 }, android: { width: 360, height: 800 }, desktop: { width: 1280, height: 800, desktop: true } };

/** Open a vendor route in a given theme and viewport; returns the page. Unanswered writes succeed quietly. */
export async function open(b, route, { mode = 'dark', vp = 'ios', wait = '.wl-main', settle = 1400, dpr = 2, layout = null } = {}) {
  const p = await b.newPage();
  const v = VIEWPORTS[vp];
  await p.setViewport({ width: v.width, height: v.height, isMobile: !v.desktop, hasTouch: !v.desktop, deviceScaleFactor: dpr });
  await p.setCookie({ name: 'tdw_wl_mode', value: mode, domain: 'localhost', path: '/' });
  // the landing's room table: one server, and the layout chosen per page by the switch's own cookie (middleware.ts)
  if (layout) await p.setCookie({ name: 'tdw_layout', value: layout, domain: 'localhost', path: '/' });
  // every "seen" key set, so first-run cards and help dots do not stand in front of the room
  await p.evaluateOnNewDocument(() => { try { const o = localStorage.setItem.bind(localStorage); window.__seenAll = true; Storage.prototype.getItem = new Proxy(Storage.prototype.getItem, { apply(t, s, a) { const r = Reflect.apply(t, s, a); if (r === null && /seen|first|onboard|intro/i.test(String(a[0]))) return '1'; return r; } }); void o; } catch (_e) { /* fine */ } });
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (!u.includes('/__api/')) return r.continue();
    const rt = u.split('/__api')[1].split('?')[0];
    let body = r.method() === 'GET' ? answer(rt) : { ok: true };
    // DESIGN-1 stage 4: the booking door's answer (what it wrote, for the Booked step and Undo), and on request a package
    // already attached (HARNESS_LP=1) so the Book sheet shows the plan and Change plan
    if (/^\/api\/v2\/vendor\/leads\/[^/]+\/promote$/.test(rt) && r.method() === 'POST') {
      let inb = {}; try { inb = JSON.parse(r.postData() || '{}'); } catch (_e) { /* empty */ }
      const fns = Array.isArray(inb.functions) ? inb.functions : [];
      body = { ok: true, promoted: { lead_id: rt.split('/')[5], binder_id: 'b-new', invoice_id: 'i-new', invoice_number: 'TDW/DEV440/12', adopted: false, opened: true, event: {},
        events: fns.map((f, i) => ({ id: `ev-${i + 1}`, date: f.date, created: true })), invoice_created: true, previous_state: 'new', total: inb.amount || (p.__lp ? p.__lp.total : 80000) } };
    }
    if (process.env.HARNESS_LP === '1' && r.method() === 'GET' && /^\/api\/v2\/vendor\/leads\/[^/]+\/package$/.test(rt) && !p.__lp) p.__lp = leadPackage(rt.split('/')[5], { package_id: PACKAGES.packages[1].id });
    if (/^\/api\/v2\/vendor\/leads\/[^/]+\/package$/.test(rt)) {
      if (r.method() !== 'GET') { let inb = {}; try { inb = JSON.parse(r.postData() || '{}'); } catch (_e) { /* empty */ } p.__lp = leadPackage(rt.split('/')[5], inb); body = { ok: true, lead_package: p.__lp }; }
      else if (p.__lp) body = { ok: true, lead_package: p.__lp };
    }
    return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  await p.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  for (let i = 0; i < 300; i += 1) { if (await p.evaluate((s) => !!document.querySelector(s), wait)) break; await sleep(300); }
  try {
    const names = await p.evaluate(() => { const cs = getComputedStyle(document.documentElement); const first = (v) => v.split(',')[0].trim().replace(/^["']|["']$/g, ''); return { dm: first(cs.getPropertyValue('--font-dm-sans')), co: first(cs.getPropertyValue('--font-cormorant')) }; });
    const css = faceCss(names); if (css && names.dm) await p.addStyleTag({ content: css });
    await p.evaluate(async () => { await document.fonts.ready; });
  } catch (_e) { /* fonts optional */ }
  await sleep(settle);
  return p;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Screenshot to a PNG under OUT, kept under 400 KB (retaken at DPR 1 if larger). */
export async function shot(p, rel, opts = {}) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await p.screenshot({ path: file, ...opts });
  if (fs.statSync(file).size > 400 * 1024) {
    const vp = p.viewport();
    await p.setViewport({ ...vp, deviceScaleFactor: 1 }); await sleep(250);
    await p.screenshot({ path: file, ...opts });
    await p.setViewport(vp); await sleep(150);
  }
  return rel;
}

/** Click the first element matching selector whose text matches re (or any, if re is null). */
export async function tap(p, sel, re = null) {
  const ok = await p.evaluate((s, src) => {
    const rx = src ? new RegExp(src, 'i') : null;
    const el = [...document.querySelectorAll(s)].find((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (!rx || rx.test((e.innerText || e.getAttribute('aria-label') || '').trim())); });
    if (!el) return false; el.scrollIntoView({ block: 'center' }); el.click(); return true;
  }, sel, re ? re.source : null);
  await sleep(900);
  return ok;
}
