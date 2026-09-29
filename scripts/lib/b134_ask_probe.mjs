// scripts/lib/b134_ask_probe.mjs · TDW CE-45 · FE-2 · the Ask TDW sheet cut · b134's browser arm.
// b123's method (puppeteer-core, a 374px touch viewport, the theme by the shell's cookie, every read answered
// from the stand-in, the service worker bypassed, the REAL faces registered after the room settles, A-45.9).
// The dock opens the sheet; one message is sent; the chat door is answered AS THE DOOR ANSWERS (ASK-1's
// recorded shape): after DELAY ms, ONE `text_delta` carrying the whole reply, then `done`. While it waits the
// probe samples the sheet (the typing dots on glass or not), and after it lands it measures the answer.
//
// usage: node scripts/lib/b134_ask_probe.mjs PORT MODE SHAPE DELAY_MS [SHOTDIR]
// Prints ONE line of JSON. A missing key reads as RED in the bench, never as green.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import puppeteer from '../../node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import { answer, VID } from './b123_fixtures.mjs';

const [PORT = '3981', MODE_ARG, SHAPE = 'plain', DELAY = '1500', SHOTDIR = ''] = process.argv.slice(2);
const MODE = MODE_ARG === 'light' ? 'light' : 'dark';

// ── ASK-1's SHAPES (26 Sept 2026, read from its code and its recorded live run) ────────────────────────────
// plain sentences; one item per line; at most one blank line between parts; "Rs 1,50,000" and "5 March 2028"
// copied from the tools; a hand-back line in straight quotes; a question back ending "?". Not removed by its
// code, so rendered safely if they come: numbered lines and emoji. Lists cap at 40 lines plus "and N more"
// (the longest realistic reply about 42 lines). The Advisor room's replies carry markdown. Failures arrive as
// the founder's glitch line (the door's own bytes, STAGE2_LINE_MUTATION) as the answer's text.
const LONG = Array.from({ length: 40 }, (_, i) => `Lead ${i + 1}, Rs 1,50,000, 5 March 2028`).join('\n') + '\nand 2 more';
export const REPLIES = {
  plain: 'You have three enquiries this week.\nAanya Kapoor asked about 5 March 2028.\nKabir Singh asked about Rs 1,50,000.',
  parts: 'Here is your day.\n\nTwo shoots are booked.\nOne invoice is due today.',
  quote: 'I can\'t send that from here. On WhatsApp, say "send the invoice to Aanya" and I will.',
  question: 'Which lead do you mean, Aanya Kapoor or Kabir Singh?',
  numbered: 'Your next dates:\n1. 5 March 2028\n2. 9 March 2028\n3. 14 March 2028',
  emoji: 'Done \u{1F44D} The shoot is on 5 March 2028.',
  long: LONG,
  longstring: 'Pay here: https://thedreamwedding.in/pay/aVeryLongUnbrokenTokenWithNoSpacesThatWouldRunOffAPhoneScreen0123456789abcdef',
  advisor: '# Your week\n**Two** shoots and [a note](https://example.com/n) for Aanya.\n\n| Package | Price |\n|---|---:|\n| Silver | Rs 1,50,000 |\n---\n> Keep the reply short.\n```\nnot code\n```',
  glitch: 'There was a small glitch, please try again or use the app screens for this action',
};
// the words each shape must show on glass once it lands (the renderer changes markup, never words)
export const MUST = {
  plain: ['You have three enquiries this week.', 'Kabir Singh asked about Rs 1,50,000.'],
  parts: ['Here is your day.', 'One invoice is due today.'],
  quote: ['"send the invoice to Aanya"'],
  question: ['Which lead do you mean, Aanya Kapoor or Kabir Singh?'],
  numbered: ['Your next dates:', '14 March 2028'],
  emoji: ['The shoot is on 5 March 2028.'],
  long: ['Lead 1, Rs 1,50,000, 5 March 2028', 'Lead 40, Rs 1,50,000, 5 March 2028', 'and 2 more'],
  longstring: ['Pay here:'],
  advisor: ['Your week', 'a note', 'Package \u00b7 Price', 'Silver \u00b7 Rs 1,50,000', 'Keep the reply short.'],
  glitch: ['There was a small glitch, please try again or use the app screens for this action'],
};

function usable(p) { try { return !!p && fs.statSync(p).isFile(); } catch (_e) { return false; } }
async function resolveBin() {
  if (usable(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  try { const mod = await import('@sparticuz/chromium'); const c = mod.default || mod; const p = await c.executablePath(); if (usable(p)) return p; } catch (_e) { /* declared below */ }
  return null;
}
const bin = await resolveBin();
if (!bin) { console.log(JSON.stringify({ browser: null })); process.exit(3); }

const out = { mode: MODE, shape: SHAPE, delay: Number(DELAY), errors: [], samples: [] };
const b = await puppeteer.launch({ executablePath: bin, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const p = await b.newPage();
  await p.setViewport({ width: 374, height: 780, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  p.on('pageerror', (e) => out.errors.push(String(e && e.message).split('\n')[0]));
  await p.setCookie({ name: 'tdw_wl_mode', value: MODE, domain: 'localhost', path: '/' });
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setBypassServiceWorker', { bypass: true });
  await p.setRequestInterception(true);
  p.on('request', async (r) => {
    const u = r.url();
    if (!u.includes('/__api/')) return r.continue();
    const route = u.split('/__api')[1].split('?')[0];
    if (route === '/api/v2/vendor/chat' && r.method() === 'POST') {
      out.chatPosted = (out.chatPosted || 0) + 1;
      await new Promise((res) => setTimeout(res, Number(DELAY)));
      const body = `data: ${JSON.stringify({ type: 'text_delta', text: REPLIES[SHAPE] })}\n\ndata: ${JSON.stringify({ type: 'done', tool_calls: [] })}\n\n`;
      return r.respond({ status: 200, contentType: 'text/event-stream', body });
    }
    if (route === `/api/v2/vendor/chat/history/${VID}`) return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, messages: [] }) });
    return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(answer(route)) });
  });
  const settle = (ms) => new Promise((res) => setTimeout(res, ms));
  const waitFor = async (pred, ms = 90000) => { for (let i = 0; i < ms / 300; i += 1) { if (await p.evaluate(pred)) return true; await settle(300); } return false; };

  await p.goto(`http://localhost:${PORT}/vendor/leads`, { waitUntil: 'domcontentloaded', timeout: 180000 });
  out.loaded = await waitFor(() => !!document.querySelector('.wl-dockfield'), 150000);
  await settle(1500);
  // THE REAL FACES (A-45.9): b123's own method, B123_FONT_DIR or the npm-pack cache under the temp dir
  try {
    const names = await p.evaluate(() => { const cs = getComputedStyle(document.documentElement); const first = (v) => v.split(',')[0].trim().replace(/^["']|["']$/g, ''); return { dm: first(cs.getPropertyValue('--font-dm-sans')), co: first(cs.getPropertyValue('--font-cormorant')) }; });
    let dir = process.env.B123_FONT_DIR;
    const want = ['dm-sans-latin-400-normal.woff2', 'dm-sans-latin-500-normal.woff2', 'cormorant-garamond-latin-500-normal.woff2'];
    if (!dir) {
      const cache = path.join(os.tmpdir(), 'b123-fonts');
      if (!want.every((f) => fs.existsSync(path.join(cache, f)))) {
        try { fs.mkdirSync(cache, { recursive: true }); execSync('npm pack @fontsource/dm-sans@5 @fontsource/cormorant-garamond@5 --silent', { cwd: cache, stdio: 'ignore', timeout: 120000 });
          for (const t of fs.readdirSync(cache).filter((f) => f.endsWith('.tgz'))) execSync(`tar xzf ${t} package/files`, { cwd: cache, stdio: 'ignore' });
          for (const f of want) { const s = path.join(cache, 'package', 'files', f); if (fs.existsSync(s)) fs.copyFileSync(s, path.join(cache, f)); }
        } catch (e) { out.errors.push('faces: ' + String(e && e.message).split('\n')[0]); }
      }
      if (want.every((f) => fs.existsSync(path.join(cache, f)))) dir = cache;
    }
    if (dir && names.dm && names.co) {
      const face = (fam, file, w) => `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(dir, file)).toString('base64')}) format('woff2');}`;
      await p.addStyleTag({ content: [face(names.dm, want[0], 400), face(names.dm, want[1], 500), face(names.co, want[2], 500)].join('\n') });
    }
    await p.evaluate(async (n) => { try { await Promise.all([document.fonts.load(`400 14px "${n.dm}"`), document.fonts.load(`500 11px "${n.dm}"`)]); } catch (_e) { /* read below */ } await document.fonts.ready; }, names);
    out.realFaces = await p.evaluate((dm) => document.fonts.check(`500 11px "${dm}"`) && [...document.fonts].some((f) => f.family.replace(/["']/g, '') === dm && f.status === 'loaded'), names.dm);
    // DESIGN-1 · STAGE 1 (by label): the app's face is Inter, served by next/font; a tree on Inter measures its real
    // faces when Inter itself is loaded (the npm-pack path above stays for a tree still on DM Sans).
    const inter = await p.evaluate(async () => { try { await document.fonts.load('500 13px Inter'); } catch (_e) { /* reported below */ } await document.fonts.ready;
      return /inter/i.test(getComputedStyle(document.querySelector('.wl') || document.body).fontFamily) && [...document.fonts].some((f) => /inter/i.test(f.family) && f.status === 'loaded'); });
    if (inter) out.realFaces = true;
  } catch (e) { out.errors.push('faces: ' + String(e && e.message).split('\n')[0]); }

  // open the sheet from the dock, type, send
  out.opened = await p.evaluate(() => { const d = document.querySelector('.wl-dockfield'); if (!d) return false; d.click(); return true; });
  out.sheet = await waitFor(() => !!document.querySelector('.wl-askpanel textarea'), 20000);
  await p.type('.wl-askpanel textarea', 'What is on this week?');
  const t0 = Date.now();
  out.sent = await p.evaluate(() => { const bt = document.querySelector('.wl-askpanel button[aria-label="Send"]'); if (!bt || bt.disabled) return false; bt.click(); return true; });

  // THE WAIT, sampled on glass: the answer bubble is empty and the typing dots show until the one delta lands
  const lastAi = () => { const bodies = [...document.querySelectorAll('.wl-askbody [data-role="ai"], .wl-askbody .ai-bubble')]; return bodies.length ? bodies[bodies.length - 1] : null; };
  void lastAi;
  const DEADLINE = Number(DELAY) + 15000;
  let landed = false;
  while (Date.now() - t0 < DEADLINE) {
    const s = await p.evaluate((must) => {
      const body = document.querySelector('.wl-askbody'); const text = body ? body.innerText : '';
      const hasAnswer = must.every((m) => text.includes(m));
      // the dots: TypingDots draws small round spans that animate; read by geometry, not by a class name
      const dots = body ? [...body.querySelectorAll('span, div')].filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 2 && r.width < 12 && Math.abs(r.width - r.height) < 1.5 && parseFloat(cs.borderRadius) >= r.width / 2 - 0.5 && cs.animationName && cs.animationName !== 'none'; }).length : 0;
      return { hasAnswer, dots };
    }, MUST[SHAPE]);
    out.samples.push({ ms: Date.now() - t0, dots: s.dots, answer: s.hasAnswer });
    if (s.hasAnswer) { landed = true; break; }
    await settle(1000);
  }
  out.landed = landed; out.landedAt = landed ? out.samples[out.samples.length - 1].ms : null;
  await settle(800);
  out.measure = await p.evaluate(() => {
    const panel = document.querySelector('.wl-askpanel'); const body = document.querySelector('.wl-askbody');
    const pr = panel.getBoundingClientRect();
    const wider = [...panel.querySelectorAll('*')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > pr.right + 0.5 || r.left < pr.left - 0.5); }).map((e) => e.tagName.toLowerCase() + ':' + Math.round(e.getBoundingClientRect().right)).slice(0, 5);
    const glass = body.innerText;
    return {
      panelWidth: Math.round(pr.width), bodyScrollX: body.scrollWidth - body.clientWidth, wider,
      raw: ['**', '```', '](', '|', '---'].filter((sym) => glass.includes(sym)).concat(glass.split('\n').some((l) => /^\s*#{1,6}\s/.test(l)) ? ['#'] : []),
      note: panel.innerText.includes('TDW replies on WhatsApp'),
      // THE TYPE, by element (A-45.9): every visible text node in the panel, its computed rung facts
      type: (() => {
        const rows = []; const w = document.createTreeWalker(panel, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) {
          const t = w.currentNode; const txt = t.textContent.trim(); if (!txt) continue;
          const el = t.parentElement; const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
          const cs = getComputedStyle(el); const fam = cs.fontFamily.toLowerCase();
          rows.push({ txt: txt.slice(0, 40), size: parseFloat(cs.fontSize), f: /cormorant/.test(fam) ? 'cormorant' : /dm.?sans/.test(fam) ? 'dmsans' : fam.split(',')[0],
            weight: cs.fontWeight, italic: cs.fontStyle === 'italic', ls: cs.letterSpacing, tt: cs.textTransform,
            control: !!el.closest('button, a[href]') });
        }
        // DESIGN-1 · STAGE 1: the message box's face is read as the text rows read theirs (lower case), so Inter is 'inter' on both.
        const ta = panel.querySelector('textarea'); if (ta) { const cs = getComputedStyle(ta); rows.push({ txt: '(the message box)', size: parseFloat(cs.fontSize), f: /dm.?sans/i.test(cs.fontFamily) ? 'dmsans' : cs.fontFamily.toLowerCase().split(',')[0], weight: cs.fontWeight, italic: cs.fontStyle === 'italic', ls: cs.letterSpacing, tt: cs.textTransform, control: true }); }
        return rows;
      })(),
      lists: [...body.querySelectorAll('ul, ol')].length,
    };
  });
  if (SHOTDIR) { fs.mkdirSync(SHOTDIR, { recursive: true }); await p.screenshot({ path: path.join(SHOTDIR, `b134__${SHAPE}__${MODE}.png`) }); }
} catch (e) { out.errors.push('probe: ' + String(e && e.message).split('\n')[0]); }
finally { await b.close(); }
console.log(JSON.stringify(out));
