#!/usr/bin/env node
// scripts/tdw41_g34s2_pwa.proof.mjs — CE-41 · SEAT C · G3.4 s2, the pwa half.
//
// R-41.70 as ratified (item 11 struck): §A the row's controls and the relabel ·
// §B the edit sheet on PATCH /schedules/:milestoneId · §C remove the schedule ·
// §D the chip's three states on `sent_at`/`reminder_failed` · §E the shut gate in
// plain words from `reason_text`.
//
//   node scripts/tdw41_g34s2_pwa.proof.mjs            the cells
//   node scripts/tdw41_g34s2_pwa.proof.mjs --mutate   each mutation REDs its cell
//
// Textual cells read comment-stripped source (R-40.105): the founder's own
// screens showed a row wrapping over three lines, and a cell that matched a
// comment would have called that cured.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = process.env.G34_ROOT ? path.resolve(process.env.G34_ROOT) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const strip = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1 ');
const SHELL = 'components/vendor/slices/SliceShell.tsx';
const SHEET = 'components/vendor/slices/DetailSheet.tsx';
const API   = 'lib/vendor/api/vendor.ts';
const TYPES = 'lib/vendor/types/vendor.ts';
const COPY  = 'lib/worklist/copy.ts';

let pass = 0, fail = 0; const fails = [];
const sec = (t) => console.log(`\n${t}`);
const ok = (name, cond, why) => { if (cond) { pass++; console.log(`  ok   ${name}`); } else { fail++; fails.push(name); console.log(`  FAIL ${name}${why ? ' — ' + why : ''}`); } };

function run(root) {
  const R = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
  const shell = strip(R(SHELL)), sheet = strip(R(SHEET)), api = strip(R(API)), types = strip(R(TYPES)), copy = R(COPY);
  const rowBlock = shell.slice(shell.indexOf('schedule && schedule.map(ms =>'), shell.indexOf('{remindMs && sel &&'));

  sec('§A · the row is two lines, and it gains Edit (R-41.70 §A 1/3)');
  ok('the words are their own line, the controls their own',
    /milestone_label\}<\/div>/.test(rowBlock) && /marginTop: 8, flexWrap: 'wrap'/.test(rowBlock));
  ok('the amount line is not a flex sibling of the buttons any more',
    !/display: 'flex'[\s\S]{0,200}milestone_label/.test(rowBlock));
  ok('Edit sits on the row and opens the sheet with THAT milestone',
    /setEditMs\(ms\); setEditLabel\(ms\.milestone_label\)/.test(rowBlock) && /COPY\.studioMsEdit/.test(rowBlock));
  ok('a paid milestone has no Edit — a paid share is history',
    (rowBlock.match(/ms\.state === 'pending' &&/g) || []).length >= 3);
  ok('Remove schedule lives in the panel header, only when a schedule exists',
    /schedule && schedule\.length > 0 && !removeSchedule/.test(shell) && /COPY\.studioScheduleRemove/.test(shell));
  ok('R-41.70 §A 4: the invoice\'s own button names what it deletes',
    /slice === 'invoices' \? 'Delete invoice' : 'Delete'/.test(sheet));

  sec('§B · the edit sheet is the door\'s three fields (R-41.70 §B 5–10)');
  ok('the client wrapper PATCHes the milestone and sends only the three fields',
    /export function updateMilestone/.test(api) && /patchJson\(`\/api\/v2\/vendor\/schedules\/\$\{milestoneId\}`/.test(api)
    && /milestone_label\?: string; pct\?: number; due_date\?: string \| null/.test(api));
  ok('and it never sends amount_due — the door recomputes it', !/amount_due/.test(api.slice(api.indexOf('export function updateMilestone'), api.indexOf('export function deleteSchedule'))));
  ok('the sheet renders label · share · amount · due', ['studioMsLabel', 'studioMsShare', 'studioMsAmount', 'studioMsDue'].every(k => shell.includes(`COPY.${k}`)));
  ok('the amount is NOT computed on this side (no second home for one number)',
    !/amount_total/.test(shell) && /Recomputed on save/.test(shell));
  ok('Save patches only what changed, then RE-READS the door', (() => {
    if (!/if \(editLabel !== editMs\.milestone_label\)/.test(shell)) return false;
    const from = shell.indexOf('updateMilestone(editMs.id, patch)');
    const to = shell.indexOf('COPY.studioMsSaved');
    // BETWEEN the patch and its toast — a fetchSchedule anywhere else in the file
    // (the remind handler has one) must not satisfy this. F-40.209's law: the
    // door recomputes `amount_due`, so only the door knows the row after a save.
    return from > 0 && to > from && /await fetchSchedule\(sel\.id\)/.test(shell.slice(from, to));
  })());
  ok('a refusal prints the DOOR\'s sentence, not this surface\'s guess',
    /setEditErr\(res\.error \?\? COPY\.studioMsSaveFailed\)/.test(shell));
  ok('item 11 is struck: no per-milestone remove anywhere on the glass',
    !/Remove this milestone/i.test(R(SHELL)) && !/removeMilestone/.test(shell));

  sec('§C · remove the schedule (R-41.70 §C 12–14)');
  ok('the confirm names the client and counts what goes',
    /Remove the schedule for/.test(shell) && /milestones go/.test(shell));
  ok('and tells her what she keeps — the sent reminders (0139, R-G34.6)',
    /Reminders already sent stay in your record/.test(shell));
  ok('Keep and Remove, and Remove calls the door that existed since s1',
    /COPY\.studioScheduleKeep/.test(shell) && /deleteSchedule\(sel\.id\)/.test(shell));

  sec('§D · the chip\'s three states (R-41.70 §D 15–18, F-41.15)');
  ok('the wire carries sent_at and reminder_failed', /sent_at\?:\s+string \| null/.test(types) && /reminder_failed\?: boolean/.test(types));
  ok('"Reminder sent" is drawn from sent_at — a wamid — never from row-presence',
    /\{ms\.sent_at && \(/.test(rowBlock) && !/ms\.reminded_at &&/.test(rowBlock));
  ok('a failed attempt says so, in the caution ink', /!ms\.sent_at && ms\.reminder_failed/.test(rowBlock) && /COPY\.studioReminderDidntGo/.test(rowBlock));
  ok('and Remind comes back for it — 0152\'s partial UNIQUE frees the milestone',
    (() => {
      // The guard must be sent_at ALONE. A `!ms.reminder_failed` slipped into it
      // would hide the control from the one row that most needs it, and the
      // first cut of this cell matched the guard loosely enough to miss that.
      const m = rowBlock.match(/\{ms\.state === 'pending' && ([^&]*(?:&&[^&]*)*?)&& \(\s*<button type="button" onClick=\{\(\) => setRemindMs/);
      return !!m && m[1].trim() === '!ms.sent_at';
    })());
  ok('the row says the short form; the toast says the sentence',
    /studioReminderDidntGo:\s*"Didn't go"/.test(copy) && /studioReminderRetry:\s*"Reminder didn't go — try again\."/.test(copy)
    && /COPY\.studioReminderRetry/.test(shell));

  sec('§E · the shut gate in plain words (R-41.70 §E 19–20, F-41.17)');
  ok('the room prints reason_text, never the register key',
    /showToast\(res\.reason_text \?\? COPY\.studioReminderDark/.test(shell) && !/res\.reason \?\? COPY\.studioReminderDark/.test(shell));
  ok('no register grammar can reach the glass from this file',
    !/flag\.[a-z_]+/.test(shell));

  sec('§F · the copy is one home and carries no persona name');
  ok('every new string is in lib/worklist/copy.ts', ['studioMsEdit', 'studioMsSave', 'studioScheduleRemove', 'studioInvoiceDelete', 'studioReminderRetry'].every(k => copy.includes(k)));
  ok('no persona name on this surface', !/victor|harvey|donna|eliza/i.test(strip(R(SHELL))));
}

function mutate() {
  const MUT = [
    ['M1 the row collapses back to one flex line', SHELL, "marginTop: 8, flexWrap: 'wrap'", "marginTop: 0, flexWrap: 'nowrap'", 'the words are their own line'],
    ['M2 the chip reads row-presence again (F-41.15 returns)', SHELL, '{ms.sent_at && (', '{ms.reminded_at && (', '"Reminder sent" is drawn from sent_at'],
    ['M3 a failed row stops offering Remind', SHELL, "{ms.state === 'pending' && !ms.sent_at && (", "{ms.state === 'pending' && !ms.sent_at && !ms.reminder_failed && (", 'Remind comes back for it'],
    ['M4 the register key leaks to the toast (F-41.17 returns)', SHELL, 'showToast(res.reason_text ?? COPY.studioReminderDark', 'showToast(res.reason ?? COPY.studioReminderDark', 'the room prints reason_text'],
    ['M5 the sheet computes the amount itself', SHELL, "'Recomputed on save'", "`Rs ${Math.round((sel.amount_total ?? 0) * Number(editPct) / 100)}`", 'the amount is NOT computed on this side'],
    ['M6 Save stops re-reading the door', SHELL, 'const again = await fetchSchedule(sel.id);\n                  if ((again as { ok: boolean }).ok) setSchedule((again as { schedule: ScheduleMilestone[] }).schedule);\n                  showToast(COPY.studioMsSaved', 'showToast(COPY.studioMsSaved', 'Save patches only what changed'],
    ['M7 the wrapper starts sending amount_due', API, 'patch: { milestone_label?: string; pct?: number; due_date?: string | null },', 'patch: { milestone_label?: string; pct?: number; due_date?: string | null; amount_due?: number },', 'never sends amount_due'],
    ['M8 the invoice button forgets what it deletes', SHEET, "slice === 'invoices' ? 'Delete invoice' : 'Delete'", "'Delete'", 'names what it deletes'],
    ['M9 Remove schedule appears on an empty schedule', SHELL, 'schedule && schedule.length > 0 && !removeSchedule', 'schedule && !removeSchedule', 'only when a schedule exists'],
    ['M10 the confirm stops saying what she keeps', SHELL, 'Reminders already sent stay in your record.', 'This cannot be undone.', 'tells her what she keeps'],
  ];
  let bad = 0;
  for (const [id, file, from, to, frag] of MUT) {
    const scratch = fs.mkdtempSync('/tmp/g34m-');
    execSync(`cp -r ${ROOT}/components ${ROOT}/lib ${scratch}/`);
    const p = path.join(scratch, file); const s = fs.readFileSync(p, 'utf8');
    const n = s.split(from).length - 1;
    if (n !== 1) { console.log(`  ??     ${id} — target matched ${n} times`); bad++; fs.rmSync(scratch, { recursive: true, force: true }); continue; }
    fs.writeFileSync(p, s.replace(from, to));
    const out = []; const log = console.log; console.log = (l) => out.push(String(l));
    try { run(scratch); } catch (e) { out.push('CRASH ' + e.message); }
    console.log = log;
    const red = out.filter(l => l.startsWith('  FAIL') && l.includes(frag));
    if (red.length) console.log(`  RED-OK ${id} → ${red[0].trim().slice(0, 88)}`); else { console.log(`  HOLLOW ${id}`); bad++; }
    fs.rmSync(scratch, { recursive: true, force: true });
  }
  console.log(`\n${MUT.length - bad}/${MUT.length} mutations RED as named`);
  return bad;
}

if (process.argv.includes('--mutate')) {
  process.exit(mutate() ? 1 : 0);
} else {
  run(ROOT);
  console.log(`\n  tdw41_g34s2_pwa  ${pass}/${pass + fail}`);
  if (fail) console.log('  FAILED: ' + fails.join(' · '));
  process.exit(fail ? 1 : 0);
}
