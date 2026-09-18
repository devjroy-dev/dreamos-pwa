// scripts/lib/b83_room_probe.mjs — the real room for b83 §4 and §5 (C-43.18).
//
// R-44.10 and R-44.11 are rules about where the KEYBOARD is, and the only honest witness
// for that is `document.activeElement` in a live DOM. A cell that greps the source for an
// `autoFocus` attribute would pass while four programmatic `.focus()` calls still fired.
// So this drives a real headless Chromium against `next dev`, with the vendor doors mocked
// at the network layer, and reads the focused element off the page after each act.
//
// It prints ONE line of JSON. b83 parses it; a missing key reads as RED, never as green.
//
// IT LIVES IN scripts/lib/ ON PURPOSE (e-44.20). `run-floor.sh:186` collects benches with
// a FLAT glob — `ls scripts/*.proof.mjs scripts/*.mjs scripts/*.js` — which does not
// recurse. At scripts/ this helper was swept up as a bench of its own, and run bare it
// exits non-zero, so the founder's floor gained a forty-first red member. It is a helper
// the bench invokes, not a bench. scripts/lib/ is the runner's own existing exit and
// needed no edit to run-floor.sh.
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import fs from 'fs';

const PORT = process.argv[2] || '3987';
// ── THE BROWSER, RESOLVED IN THE FOUNDER'S ORDER (e-44.18) ──────────────────
// This resolver used to read ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
// CHROME_BIN] — the executor's own Playwright path FIRST. It was green here and RED on
// the founder's Codespace, which has no /opt/pw-browsers, for a reason that was never
// the app. A bench written against the executor's environment and never against his.
//
// The order now: CHROME_BIN if set and executable; then @sparticuz/chromium's
// executablePath(), which package.json pins at 149.0.0 and which the P3L handover
// records as the C-43.18 method; then the Playwright path LAST. No path of the
// executor's comes first. If none launches, the caller declares RED and names all three.
async function resolveBrowser() {
  const tried = [];
  const usable = (p) => {
    if (!p) return false;
    try { fs.accessSync(p, fs.constants.X_OK); return true; } catch { return false; }
  };
  const env = process.env.CHROME_BIN;
  tried.push(`CHROME_BIN=${env || '(unset)'}`);
  if (usable(env)) return { bin: env, how: 'CHROME_BIN', tried };
  try {
    const mod = await import('@sparticuz/chromium');
    const chromium = mod.default || mod;
    const p = await chromium.executablePath();
    tried.push(`@sparticuz/chromium executablePath()=${p || '(none)'}`);
    if (usable(p)) return { bin: p, how: '@sparticuz/chromium', tried };
  } catch (e) {
    tried.push(`@sparticuz/chromium threw: ${String(e && e.message).split('\n')[0]}`);
  }
  const pw = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  tried.push(`playwright=${pw}`);
  if (usable(pw)) return { bin: pw, how: 'playwright', tried };
  return { bin: null, how: null, tried };
}
const resolved = await resolveBrowser();
if (!resolved.bin) {
  console.log(JSON.stringify({ browser: null, tried: resolved.tried }));
  process.exit(0);
}
const BIN = resolved.bin;

const V = '00000000-0000-0000-0000-000000000000';
const LEAD = 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa';

// A lead missing three details, so the wishbone has somewhere to advance TO.
const lead = {
  id: LEAD, name: 'Probe Lead', phone: '+919888294440',
  wedding_date: null, wedding_date_precision: null, wedding_city: null,
  budget_total: null, budget_min: null, budget_max: null,
  state: 'new', source: 'direct', referrer: null, raw_message: null, notes: null,
  created_at: '2026-09-18T04:00:00.000Z',
  draft: { missing: ['wedding_date', 'wedding_city', 'budget_max'] },
};
const json = (o) => ({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });

const out = {};
const b = await puppeteer.launch({ executablePath: BIN, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const p = await b.newPage();
  await p.setViewport({ width: 374, height: 780, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', (r) => {
    const u = r.url();
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0];
    if (route === '/api/v2/vendor/me') return r.respond(json({ ok: true, vendor: { id: V, business_name: 'Probe', category: 'photography', tier: 'signature' } }));
    if (route === `/api/v2/vendor/leads/${V}`) return r.respond(json({ ok: true, leads: [lead], total: 1 }));
    if (route === `/api/v2/vendor/cabinet/${V}`) return r.respond(json({ ok: true, clients: [], prospects: [], archived: [] }));
    if (route === '/api/v2/vendor/packages') return r.respond(json({ ok: true, packages: [], seeding: { seeded: false, reason: 'probe' } }));
    // The detail door: without it the row navigates to an error screen and every tap
    // below searches a page with two buttons on it. (Named at CE-44: the probe's first
    // cut omitted this and read four false reds.)
    if (route === `/api/v2/vendor/leads/${LEAD}/detail`) {
      return r.respond(json({ ok: true, lead, vendor_summary: null, conversation: [], invoices: [], events: [] }));
    }
    if (route === `/api/v2/vendor/leads/${LEAD}/package`) return r.respond(json({ ok: true, lead_package: null }));
    // ForwardSheet fetches peers on mount (ForwardSheet.tsx:74). Unmocked, it renders its
    // panel late or empty, and a probe reading focus too early sees nothing.
    if (route.endsWith('/peers')) {
      return r.respond(json({ ok: true, groups: [{ title: 'Worked with', peers: [] }], searching: false, min_query: 2 }));
    }
    return r.respond(json({ ok: true }));
  });

  // Only a VISIBLE, non-inert element counts: the rooms keep closed sheets in the tree.
  const VIS = `(e)=>{const r=e.getBoundingClientRect();if(!(r.width>0&&r.height>0))return false;let n=e;while(n){if(n.nodeType===1&&(n.hasAttribute('inert')||n.getAttribute('aria-hidden')==='true'))return false;n=n.parentElement;}return true;}`;
  const tap = (needle) => p.evaluate((nd, v) => {
    const ok = eval(v);
    const els = [...document.querySelectorAll('button,[role="button"],a')];
    // Case-insensitive: at base the chip reads `+ Wedding Date` (F-44.3's own bug), and a
    // case-sensitive probe cannot reach the wishbone there to prove R-44.11 both ways.
    const want = nd.toLowerCase();
    const hit = els.find((e) => e.textContent && e.textContent.toLowerCase().includes(want) && ok(e));
    if (hit) { hit.click(); return true; }
    return false;
  }, needle, VIS);
  // The witness: is the keyboard up? i.e. is the focused element a text control?
  const onInput = () => p.evaluate(() => {
    const a = document.activeElement;
    if (!a) return false;
    const t = a.tagName.toLowerCase();
    return t === 'input' || t === 'textarea' || t === 'select' || a.isContentEditable === true;
  });
  const settle = (ms = 1200) => new Promise((r) => setTimeout(r, ms));

  await p.goto(`http://localhost:${PORT}/vendor/leads`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await settle(7000);

  // Open the room ONCE, up front: the lead's row, then its own opener. The missing-detail
  // chips and the Forward control both live behind it, and a probe that reaches for them
  // on the collapsed list reads four false reds. (Named at CE-44; the first cut did that.)
  await tap('Probe Lead'); await settle(2600);
  await tap('All details'); await settle(1600);
  out.controls = await p.evaluate(() => [...document.querySelectorAll('button,[role="button"]')]
    .filter((e) => e.getBoundingClientRect().width > 0).map((e) => e.textContent.trim().slice(0, 26)));

  // ── §4 · the forward sheet opens on a tap that names NO field ─────────────
  // The wishbone's save may collapse the row, so name it again — and if the opener is
  // not there either, the whole row closed and must be reopened first.
  // The control is gated at SliceShell.tsx:1506: slice 'leads', the lead selected, badge
  // not 'lost', not forwarded, and a phone present. Assert the BUTTON itself exists first,
  // so a tap that lands on some other "Forward" cannot read as the sheet opening (e-44.19).
  out.forwardButton = await p.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /forward to a peer/i.test(x.textContent || ''));
    return b ? { present: true, disabled: !!b.disabled, w: Math.round(b.getBoundingClientRect().width) } : { present: false };
  });
  const fwdOpened = await tap('Forward to a peer');
  await settle(1700);
  // THE SHEET, NOT THE CLICK. `tap` returning true only says a control matched and was
  // clicked; it says nothing about whether the sheet mounted. Read at base, that gap gave
  // a FALSE GREEN: no forward layer existed at all, so of course nothing was focused, and
  // §4.2 passed on an empty room. C-44.4 again, named here as e-44.19. The forward sheet
  // renders no SheetLayer — it is its own fixed panel at zIndex 61 (ForwardSheet.tsx:120)
  // with a search input — so its presence is asserted by that input existing.
  // The sheet's own search input, by its byte (referrals.ts:79 `searchPlaceholder`).
  // That is the sheet and nothing else, and it does not depend on reading a computed
  // z-index correctly.
  out.forwardSheetPresent = await p.evaluate(() => !!document.querySelector('input[placeholder="Search by name or handle"]'));
  out.forwardOpened = fwdOpened && out.forwardSheetPresent;
  out.forwardNoFocus = out.forwardOpened ? !(await onInput()) : false;
  out.fwdDiag = await p.evaluate(() => {
    const a = document.activeElement;
    const layers = [...document.querySelectorAll('[data-sheet-layer]')].map((l) => ({
      id: l.getAttribute('data-sheet-layer'), inert: l.hasAttribute('inert'),
      inputs: l.querySelectorAll('input').length,
    }));
    return { active: a ? a.tagName + '.' + (a.getAttribute('type') || '') : null, layers };
  });

  await p.keyboard.press('Escape'); await settle(1100);

  // The forward sheet is driven FIRST and closed before the wishbone opens: a sheet left
  // standing covers the row, and the wishbone's own advance leaves one open by design.
  // ── §5 · the wishbone: the named cell IS focused, the advance is NOT ───────
  // Escape closed the forward sheet AND collapsed the row with it, so the chips must be
  // reached for again rather than assumed still on screen.
  if (!(await tap('All details'))) { await tap('Probe Lead'); await settle(2400); await tap('All details'); }
  await settle(1600);
  const chip = await tap('+ Wedding date');
  await settle(1800);
  out.wishOpened = chip;
  out.wishOpenFocused = chip ? await onInput() : false;
  out.wishBox = await p.evaluate(() => {
    const box = document.querySelector('[data-sheet-layer="wishbone-sheet"]');
    if (!box) return 'NO BOX';
    return { buttons: [...box.querySelectorAll('button')].map((b) => b.textContent.trim().slice(0, 20)),
             inputs: [...box.querySelectorAll('input')].map((i) => i.type) };
  });
  if (chip) {
    // VIS, not a bare find: the Add-lead sheet sits in the tree with its own date input,
    // and an unfiltered find types into THAT while the wishbone stands untouched.
    // (Named at CE-44: the probe's first cut did exactly this and read a false red.)
    // SCOPED TO THE WISHBONE'S OWN CONTAINER. The Add-lead sheet is mounted with its own
    // date input and a non-zero rect, so neither a bare find nor a visibility filter can
    // tell the two apart. `testId="wishbone-sheet"` (WishboneSheet.tsx:141) can.
    await p.evaluate(() => {
      const box = document.querySelector('[data-sheet-layer="wishbone-sheet"]');
      const el = box ? [...box.querySelectorAll('input')].find((i) => i.type === 'date' || i.type === 'text') : null;
      if (el) {
        const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        set.call(el, el.type === 'date' ? '2027-03-14' : 'Delhi');
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await settle(800);
    // The wishbone's OWN Save, not whichever Save the page offers first.
    out.saved = await p.evaluate(() => {
      const box = document.querySelector('[data-sheet-layer="wishbone-sheet"]');
      // The wishbone commits with `File it`, not `Save`. Read off the room, not assumed.
      const b = box ? [...box.querySelectorAll('button')].find((x) => /file it/i.test(x.textContent || '')) : null;
      if (b) { b.click(); return true; }
      return false;
    });
    await settle(2000);
    out.afterSave = await p.evaluate(() => ({
      active: document.activeElement ? document.activeElement.tagName + '#' + (document.activeElement.id || '') + '.' + (document.activeElement.getAttribute('type') || '') : null,
      labels: [...document.querySelectorAll('label,h2,h3,p')].filter((e) => e.getBoundingClientRect().width > 0).map((e) => e.textContent.trim().slice(0, 30)).slice(0, 10),
      buttons: [...document.querySelectorAll('button')].filter((e) => e.getBoundingClientRect().width > 0).map((e) => e.textContent.trim().slice(0, 18)).slice(0, 10),
    }));
    out.wishAdvanceNoFocus = !(await onInput());
    // Her own tap on the field IS a naming tap, so it must land focus.
    await p.evaluate(() => {
      const box = document.querySelector('[data-sheet-layer="wishbone-sheet"]');
      const el = box ? box.querySelector('input,textarea,select') : null;
      if (el) el.focus();
    });
    await settle(700);
    out.wishTapFocuses = await onInput();
    await p.keyboard.press('Escape'); await settle(900);
  }

} finally {
  await b.close();
}
out.browser = resolved.how;
console.log(JSON.stringify(out));
