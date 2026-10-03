#!/usr/bin/env node
'use strict';
// scripts/b202_fe8_enquiry_edit_bench.js · TDW CE-47 · FE-8 · the founder's walk of 1 Oct 2026:
// "where is the option to add wedding date etc or other details". An enquiry's page (the new layout) now has
// "Edit details", which opens the enquiry's own form in edit mode (AddSheet, the one PATCH /leads/:id door), and an
// enquiry with no wedding date offers "Add the wedding date" under Dates.
//   §1 source: the job, the words' one home, the sheet in edit mode, the need-a-date toasts open it
//   §2 glass (374 and 360, dark): the job is drawn and 44 tall; it opens "Edit enquiry" with the enquiry's own values;
//      saving a new wedding date sends PATCH /api/v2/vendor/leads/<id> with it; nothing scrolls sideways
//   §3 the stop: the whole tree, waited; nothing of this run is left (b143 7.2's shape)
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const PORT = 4111;
process.env.TDW_LAYOUT_DEFAULT = 'v2'; process.env.PORT = String(PORT); process.env.OUT = process.env.OUT || '/tmp/b202_shots';
const dev = require(path.join(ROOT, 'scripts/lib/b126_dev_server.js'));
const { stopTree } = require(path.join(ROOT, 'scripts/lib/stop_tree.js'));
const { stripComments } = require(path.join(ROOT, 'scripts/lib/stripComments.cjs'));
const code = (rel) => stripComments(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 400) + ']'}`); } }
const ROOT_REAL = (() => { try { return fs.realpathSync(ROOT); } catch (_e) { return ROOT; } })();
function leftovers() {
  const rows = String(spawnSync('ps', ['-eo', 'pid=,args='], { encoding: 'utf8' }).stdout || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const out = [];
  for (const row of rows) {
    const pid = Number(row.split(/\s+/)[0]); const args = row.slice(String(pid).length).trim();
    if (!pid || pid === process.pid) continue;
    if (/^(\S*node\S*\s+)?\S*(node_modules\/\.bin\/next dev|next-server|\.next\/dev\/build\/postcss\.js)/.test(args)) {
      let cwd = '?'; try { cwd = fs.readlinkSync(`/proc/${pid}/cwd`); } catch (_e) { /* no /proc */ }
      if (cwd === ROOT_REAL || args.includes(ROOT_REAL) || args.includes(ROOT)) out.push(`${pid} ${args.slice(0, 70)}`);
    }
  }
  return out;
}

(async () => {
  console.log('§1 source');
  const page = code('v2/components/vendor/records/EnquiryPage.tsx'); const rec = code('v2/lib/worklist/record.ts');
  ok(/editDetails: 'Edit details'/.test(rec) && /addWeddingDate: 'Add the wedding date'/.test(rec), '1.1 the two phrases live in v2/lib/worklist/record.ts');
  ok(/<button type="button" className="rp-job" data-enq-edit="" onClick=\{\(\) => setSheet\('edit'\)\}>\{RECORD\.editDetails\}<\/button>/.test(page), '1.2 Edit details is one of the page\'s jobs, for every state');
  ok(/\{!l\.wedding_date && l\.state !== 'booked' && <button type="button" className="rp-job" data-enq-date="" onClick=\{\(\) => setSheet\('edit'\)\}>\{RECORD\.addWeddingDate\}<\/button>\}/.test(page), '1.3 an enquiry with no wedding date offers "Add the wedding date" under Dates');
  ok(/<AddSheet open=\{sheet === 'edit'\} slice="leads" existing=\{[^}]+\} existingId=\{id\}/.test(page), '1.4 the sheet is the enquiry\'s own form in edit mode (existing and existingId)');
  ok((page.match(/onNeedWeddingDate=\{\(\) => \{ show\('Add the wedding date on the enquiry first\.', 'error'\); setSheet\('edit'\); \}\}/g) || []).length === 2, '1.5 "Add the wedding date on the enquiry first" now opens the form (Book and Attach package)');
  ok(!/[\u2014\u2013]/.test(rec.match(/editDetails:[^\n]*\n[^\n]*/)[0]), '1.6 no dash in the new words');

  console.log('§2 glass');
  let server = null; let b = null;
  try {
    const H = await import(path.join(ROOT, 'docs/design/tools/harness.mjs'));
    server = await dev.start(ROOT, PORT, { NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` });
    if (!(await server.up())) throw new Error('the dev server did not come up');
    b = await H.browser();
    for (const [vp, w] of [['ios', 374], ['android', 360]]) {
      const p = await H.open(b, '/vendor/leads/lead-0002', { mode: 'dark', vp, layout: 'v2', dpr: 1, settle: 1500 });
      const sent = [];
      p.on('request', (r) => { if (r.method() === 'PATCH' && r.url().includes('/__api/api/v2/vendor/leads/')) sent.push([r.url().split('/__api')[1], r.postData()]); });
      const job = await p.evaluate(() => { const e = document.querySelector('[data-enq-edit]'); if (!e) return null; const r = e.getBoundingClientRect(); return { text: e.textContent.trim(), h: Math.round(r.height), jobs: [...document.querySelectorAll('.rp-job')].map((x) => x.textContent.trim()) }; });
      ok(job && job.text === 'Edit details' && job.h >= 44 && job.jobs.includes('WhatsApp') && job.jobs.includes('Mark lost'), `2.1 [${w}] Edit details is drawn among the jobs, at least 44 tall`, JSON.stringify(job));
      await p.evaluate(() => document.querySelector('[data-enq-edit]').click()); await H.sleep(900);
      const sheet = await p.evaluate(() => { const d = [...document.querySelectorAll('input[type="date"]')].find((x) => x.offsetParent); const t = [...document.querySelectorAll('input[type="tel"]')].find((x) => x.offsetParent);
        const head = [...document.querySelectorAll('h1, h2, h3, [role="heading"]')].map((x) => x.textContent.trim()).find((x) => /^Edit /.test(x)) || null;
        return { head, date: d ? d.value : null, tel: t ? t.value : null, over: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
      ok(sheet.head === 'Edit enquiry' && /^\d{4}-\d{2}-\d{2}$/.test(sheet.date || '') && !!sheet.tel && sheet.over <= 0, `2.2 [${w}] it opens "Edit enquiry" with the enquiry's own wedding date and number, nothing scrolling sideways`, JSON.stringify(sheet));
      await p.evaluate(() => { const d = [...document.querySelectorAll('input[type="date"]')].find((x) => x.offsetParent); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(d, '2027-04-18'); d.dispatchEvent(new Event('input', { bubbles: true })); d.dispatchEvent(new Event('change', { bubbles: true }));
        const n = [...document.querySelectorAll('input[type="text"]')].find((x) => x.offsetParent && !x.value && !/Search/.test(x.placeholder || '')); if (n) { set.call(n, 'Bench Name'); n.dispatchEvent(new Event('input', { bubbles: true })); } });
      await H.sleep(300);
      await p.evaluate(() => { const s = [...document.querySelectorAll('button')].find((x) => x.offsetParent && /Save changes/.test(x.textContent)); if (s) s.click(); });
      await H.sleep(1200);
      const hit = sent.find(([u]) => u === '/api/v2/vendor/leads/lead-0002'); let body = {}; try { body = JSON.parse((hit && hit[1]) || '{}'); } catch (_e) { /* empty */ }
      ok(!!hit && body.wedding_date === '2027-04-18', `2.3 [${w}] Save changes sends PATCH /api/v2/vendor/leads/lead-0002 with the new wedding date`, JSON.stringify(sent).slice(0, 300));
      await p.close();
    }
  } catch (e) { ok(false, `2.x the glass run: ${String(e && e.message).split('\n')[0]}`); }
  finally {
    if (b) { try { await b.close(); } catch (_e) { /* gone */ } }
    if (server) { try { stopTree(server.dev.pid); } catch (_e) { /* gone */ } const st = await server.stop(); ok(st.portFree, '3.1 the dev server stopped, the port free'); }
    const left = leftovers();
    ok(left.length === 0, '3.2 nothing of this run is left: no next dev, next-server or postcss in this root', JSON.stringify(left));
  }
  console.log(`\nb202 · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
})().catch((e) => { console.log(`b202 CRASHED: ${(e && e.stack) || e}`); process.exit(1); });
