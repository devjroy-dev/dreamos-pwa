#!/usr/bin/env node
// scripts/b161_second_bubble_bench.js · CE-47 · FE-5 · THE SECOND BUBBLE (ELZ-3's cut; b161, allocated by CE-47).
// The real Advisor chat in BOTH layouts (next dev, mock session, the b123 fixtures through Claude Code's harness), 374 x 812,
// the chat door answered here by the bench:
//   1.1 a turn with no message_break draws ONE bubble, exactly as today (a server without ELZ-4's layer C);
//   1.2 a message_break draws a SECOND bubble for the draft, and the draft has no leading blank line;
//   1.3 the guard replacing a two-part turn (intercept.replaced) folds it back into ONE bubble with the guard's words;
//   1.4 an error after the break leaves the first part as it arrived and shows the error in the second;
//   1.5 R-46.17: the draft (part 1, alone in its bubble) has its Copy, and Copy gives the draft alone;
//   2.1 a stored row whose history carries `replies` (two parts; layer C's wire) reloads as TWO bubbles, in order;
//   2.2 a stored row without `replies` reloads as ONE (a history route without layer C draws today's thread).
// --mutate (one layout, v2): M1 the client ignores message_break → 1.2 RED; M2 the history split removed → 2.1 RED;
// each file restored byte for byte (sha256) on every exit path. One stop for the server and Chromium (stop_tree.js).
const path = require('path'); const fs = require('fs'); const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
process.env.PORT = process.env.PORT || '4161';
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const MUT = process.argv.includes('--mutate');
const ONLY = (process.argv.find((a) => a.startsWith('--layouts=')) || '--layouts=v2,classic').split('=')[1].split(',');
let pass = 0, fail = 0; const failed = [];
const ok = (c, name, info) => { if (c) { pass++; console.log('  PASS  ' + name); } else { fail++; failed.push(name); console.log('  FAIL  ' + name + (info === undefined ? '' : '  [' + String(info).slice(0, 260) + ']')); } };
const sse = (evs) => evs.map((e) => `data: ${JSON.stringify(e)}\n\n`).join('') + 'data: [DONE]\n\n';
const DONE = { type: 'done', tool_calls: [], refresh: false };
const TURNS = {
  plain: sse([{ type: 'thinking' }, { type: 'text_delta', text: 'Hello there.' }, DONE]),
  // layer C's draft frame: part 1 the draft body alone (she copies it), part 2 the question
  split: sse([{ type: 'thinking' }, { type: 'text_delta', text: 'Hi Asha, your booking is confirmed.' }, { type: 'message_break' }, { type: 'text_delta', text: '\n\nSend this to Asha (+91 98111 00001)? Reply YES or NO.' }, DONE]),
  guard: sse([{ type: 'text_delta', text: 'Here is the message for Asha.' }, { type: 'message_break' }, { type: 'text_delta', text: '\n\nHi Asha, your booking is confirmed.' }, { ...DONE, intercept: { replaced: true, text: 'Let me check that first.' } }]),
  broken: sse([{ type: 'text_delta', text: 'Here is the message for Asha.' }, { type: 'message_break' }, { type: 'text_delta', text: '\n\nHi Asha' }, { type: 'error', message: 'Chat failed.' }]),
};
const HISTORY = { ok: true, messages: [
  { id: 'h1', role: 'user', text: 'Tell Asha we are free on the 22nd', at: '2026-09-30T05:00:00Z', room: 'advisor' },
  { id: 'h2', role: 'ai', text: 'Hi Asha, we are free on the 22nd.\n\nSend this to Asha (+91 98111 00001)? Reply YES or NO.', at: '2026-09-30T05:00:05Z', room: 'advisor', replies: ['Hi Asha, we are free on the 22nd.', 'Send this to Asha (+91 98111 00001)? Reply YES or NO.'] },
  { id: 'h3', role: 'user', text: 'Thanks', at: '2026-09-30T05:01:00Z', room: 'advisor' },
  { id: 'h4', role: 'ai', text: 'Anything else?', at: '2026-09-30T05:01:02Z', room: 'advisor' },
] };

async function run(layouts) {
  const H = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
  let server = null, b = null, bpid = null; const out = {};
  try {
    server = await dev.start(ROOT, +process.env.PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${process.env.PORT}/__api` });
    if (!(await server.up())) { out.error = 'the dev server did not come up'; return out; }
    b = await H.browser(); bpid = b.process() && b.process().pid;
    for (const layout of layouts) {
      const p = await b.newPage();
      await p.setViewport({ width: 374, height: 812, isMobile: true, hasTouch: true });
      await p.setCookie({ name: 'tdw_wl_mode', value: 'dark', domain: 'localhost', path: '/' }, { name: 'tdw_layout', value: layout, domain: 'localhost', path: '/' });
      await p.evaluateOnNewDocument(() => { window.__copied = []; const clip = { writeText: (t) => { window.__copied.push(t); return Promise.resolve(); } };
        try { Object.defineProperty(navigator, 'clipboard', { get: () => clip, configurable: true }); } catch (_e) { /* read-only */ } });
      const cdp = await p.createCDPSession(); await cdp.send('Network.enable'); await cdp.send('Network.setBypassServiceWorker', { bypass: true });
      let turn = 'plain'; let history = { ok: true, messages: [] };
      await p.setRequestInterception(true);
      p.on('request', (r) => {
        const u = r.url(); if (!u.includes('/__api/')) return r.continue();
        const rt = u.split('/__api')[1].split('?')[0];
        if (rt === '/api/v2/vendor/chat' && r.method() === 'POST') return r.respond({ status: 200, contentType: 'text/event-stream', body: TURNS[turn] });
        if (rt.startsWith('/api/v2/vendor/chat/history/')) return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(history) });
        return r.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(r.method() === 'GET' ? H.answer(rt) : { ok: true }) });
      });
      const bubbles = () => p.evaluate(() => Array.from(document.querySelectorAll('[data-bubble="ai"]')).map((e) => e.innerText.trim().replace(/^TDW\s*\n+/, '')));   // the sender's label is not the message
      const open = async () => { await p.goto(`http://localhost:${process.env.PORT}/vendor/advisor`, { waitUntil: 'domcontentloaded', timeout: 240000 });
        for (let i = 0; i < 400 && !(await p.evaluate(() => !!document.querySelector('textarea')).catch(() => false)); i++) await new Promise((res) => setTimeout(res, 300));
        await new Promise((res) => setTimeout(res, 1500)); };
      const ask = async (t, words) => { turn = t; const before = (await bubbles()).length;
        await p.focus('textarea'); await p.keyboard.type(words); await p.keyboard.press('Enter');
        await new Promise((res) => setTimeout(res, 2500)); const now = await bubbles(); return now.slice(before); };
      await open();
      const r = {};
      r.plain = await ask('plain', 'hi');
      r.split = await ask('split', 'tell asha it is confirmed');
      // R-46.17: the draft's own Copy (every AI bubble carries one), pressed on the draft's bubble
      r.copied = await p.evaluate(async (draft) => { window.__copied = []; const bs = Array.from(document.querySelectorAll('[data-bubble="ai"]'));
        const b = bs.find((e) => e.innerText.includes(draft)); const c = b && b.querySelector('button[aria-label="Copy message"]'); if (!c) return null; c.click();
        await new Promise((res) => setTimeout(res, 300)); return window.__copied[0] ?? null; }, 'Hi Asha, your booking is confirmed.');
      r.guard = await ask('guard', 'tell asha again');
      r.broken = await ask('broken', 'and once more');
      history = HISTORY; await open(); r.history = await bubbles();
      out[layout] = r;
      await p.close();
    }
  } catch (e) { out.error = String((e && e.message) || e); }
  finally {
    if (b) { try { await b.close(); } catch (_e) { /* gone */ } }
    if (bpid) { try { stopTree(bpid); } catch (_e) { /* gone */ } }
    if (server) { try { stopTree(server.dev.pid); } catch (_e) { /* gone */ } try { await server.stop(); } catch (_e) { /* gone */ } }
  }
  return out;
}
const J = (x) => JSON.stringify(x);
function cells(o, layout) {
  const r = o[layout] || {};
  return {
    '1.1': [J(r.plain) === J(['Hello there.']), `${layout} 1.1 no break: ONE bubble, as today`, J(r.plain)],
    '1.2': [J(r.split) === J(['Hi Asha, your booking is confirmed.', 'Send this to Asha (+91 98111 00001)? Reply YES or NO.']), `${layout} 1.2 a break: the draft alone in its own bubble, the question in the next, no leading blank line`, J(r.split)],
    '1.5': [r.copied === 'Hi Asha, your booking is confirmed.', `${layout} 1.5 R-46.17: the draft's bubble has its Copy, and Copy gives the draft alone`, J(r.copied)],
    '1.3': [J(r.guard) === J(['Let me check that first.']), `${layout} 1.3 the guard replaced a two-part turn: ONE bubble with the guard's words`, J(r.guard)],
    '1.4': [Array.isArray(r.broken) && r.broken.length === 2 && r.broken[0] === 'Here is the message for Asha.' && /Chat failed|went wrong|try again/i.test(r.broken[1]), `${layout} 1.4 an error after the break: the first part stays, the error shows in the second`, J(r.broken)],
    '2.1': [Array.isArray(r.history) && r.history[0] === 'Hi Asha, we are free on the 22nd.' && r.history[1] === 'Send this to Asha (+91 98111 00001)? Reply YES or NO.', `${layout} 2.1 a stored two-part row reloads as TWO bubbles`, J(r.history)],
    '2.2': [Array.isArray(r.history) && r.history.length === 3 && r.history[2] === 'Anything else?', `${layout} 2.2 a row without replies reloads as ONE (history without layer C draws today's thread)`, J(r.history)],
  };
}
(async () => {
  const { stripComments } = await import(path.join(ROOT, 'scripts/lib/stripComments.mjs'));
  console.log('b161 · the second bubble · both layouts');
  if (MUT) {
    const plant = [
      ['M1 the client ignores message_break → 1.2 RED', ['v2/lib/vendor/api/vendor.ts'], "            opts?.onBreak?.();\n", "\n", '1.2'],
      ['M2 the history split removed → 2.1 RED', ['v2/hooks/vendor/useChat.ts'], 'h.messages.flatMap(m => historyBubbles(m))', 'h.messages.flatMap(m => [m])', '2.1'],
    ];
    for (const [name, files, from, to, cell] of plant) {
      const keep = files.map((f) => [path.join(ROOT, f), fs.readFileSync(path.join(ROOT, f))]);
      const restore = () => keep.forEach(([f, b]) => fs.writeFileSync(f, b)); process.once('exit', restore);
      try {
        // the anchor must be CODE, never a comment: checked on the file with its comments stripped (scripts/lib/stripComments.mjs)
        let applied = true; for (const [f, b] of keep) { const t = b.toString(); if (!stripComments(t).includes(from.trim())) applied = false; else fs.writeFileSync(f, t.replace(from, to)); }
        if (!applied) { ok(false, name + ': the anchor is absent'); continue; }
        const o = await run(['v2']); if (o.error) { ok(false, name + ' crashed', o.error); continue; }
        ok(!cells(o, 'v2')[cell][0], name, J(o.v2 && o.v2[cell === '1.2' ? 'split' : 'history']));
      } finally { restore(); ok(keep.every(([f, b]) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex') === crypto.createHash('sha256').update(b).digest('hex')), name.split(' ')[0] + ' restored byte for byte'); }
    }
  } else {
    const o = await run(ONLY);
    if (o.error) ok(false, '0.1 the Advisor came up', o.error);
    for (const l of ONLY) for (const [, [c, n, i]] of Object.entries(cells(o, l))) ok(c, n, i);
  }
  console.log(`\n${fail ? 'RED' : 'GREEN'} — b161 second bubble ${pass}/${pass + fail}${fail ? '\n  ' + failed.join('\n  ') : ''}`);
  process.exit(fail ? 1 : 0);
})();
