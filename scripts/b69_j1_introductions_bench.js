#!/usr/bin/env node
'use strict';
// scripts/b69_j1_introductions_bench.js
// CE-42 · 4a PACKET 3b · R9-J1 — THE INTRODUCTIONS ROOM'S BENCH (pwa half).
//
// ⚠ NUMBERED b69, DERIVED BY `ls` ACROSS BOTH REPOS AND NOT TAKEN ON A CHARTER'S
// WORD. The pwa ladder tails at `b61_f2_model_routes_panel.js`; dream-os tails at
// `b68_introductions_bench.js` — the arm's own bench, this packet's other half.
// b62 through b68 are all live in dream-os, so the first free rung across the
// estate is 69. b42's own header records the same check catching the same error.
//
// Every cell asserts a SURFACE or a BEHAVIOUR. None asserts a line number and
// none asserts where a constant lives.
//
// ═══ WHAT THIS BENCH CANNOT PROVE ════════════════════════════════════════════
// The walk. No cell here reaches Railway, Supabase or Meta: it reads the shipped
// source and the pure helpers. That a handset RECEIVES the page button, and that
// a row moves Sent -> Delivered, is the founder's card and nothing else. The
// behaviour half of the copy home rides in `b69_j1_introductions.proof.ts`,
// which IMPORTS the real module rather than copying it.
//
// THE MUTATION PASS (--mutate) edits PRODUCTION CODE, re-runs the cells in a
// child process and requires RED. A mutation that leaves the bench green is a
// cell that was never testing what its name claims.

const fs   = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const P    = (rel) => path.join(ROOT, rel);
const read = (rel) => fs.readFileSync(P(rel), 'utf8');
const has  = (rel) => fs.existsSync(P(rel));
/** Comments stripped before any prohibition is tested — a cell that cannot tell
 *  a rule from its violation is worse than no cell (b53's e-4, same class). */
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const SCREEN  = 'app/vendor/(shell)/introductions/page.tsx';
const COPY    = 'lib/worklist/introductions.ts';
const ROUTES  = 'lib/solutions/routes.ts';
const SOLCOPY = 'lib/solutions/copy.ts';
const HUB     = 'app/vendor/(shell)/support/page.tsx';
const B40     = 'scripts/b40_worklist_shell_bench.js';
const MOCK    = 'docs/mocks/j1-introductions-mock.html';

for (const rel of [SCREEN, COPY, ROUTES, SOLCOPY, HUB, B40, MOCK]) {
  if (!has(rel)) { console.log('REFUSED \u2014 ' + rel + ' is absent'); process.exit(3); }
}

let pass = 0, fail = 0;
const ok = (n, c, d) => {
  if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (d ? '  \u2192 ' + d : '')); }
};
const sec = (t) => console.log('\n' + t);

// ── C1 · THE FIFTEEN, VERBATIM, IN ONE HOME ─────────────────────────────────
// The chair's veto sheet of 2026-09-10. Byte-for-byte and numbered as the sheet
// numbers them. A cell per byte would be fifteen cells saying one thing; the
// list is asserted as a set so a byte that is DELETED reddens as loudly as one
// that is reworded.
sec('C1 \u00b7 the fifteen vetoed bytes (chair, 2026-09-10)');
{
  const src = read(COPY);
  const FIFTEEN = [
    ['#1  title',      'Introductions'],
    ['#2  lede',       'Send your page to someone you met. It goes once, and only after you approve it.'],
    ['#3  number',     'Their number'],
    ['#4  name',       'Their name'],
    ['#5  where',      'Where you met'],
    ['#6  review',     'Review the message'],
    ['#7  eyebrow',    'They will receive'],
    ['#9  back',       'Back'],
    ['#10 section',    'Sent'],
    ['#12 chip',       'Sent'],
    ['#13 chip',       'Delivered'],
    ['#14 chip',       'Not delivered'],
    ['#15 empty',      'No introductions yet.'],
  ];
  for (const [label, byte] of FIFTEEN) {
    ok('the veto sheet\u2019s ' + label + ' is on file verbatim', src.includes("'" + byte + "'"), byte);
  }
  // #8 and #11 carry runtime values, so they are FUNCTIONS. Asserting the
  // template rather than the output is what makes them checkable at all — the
  // proof file drives the real functions on real arguments.
  ok('#8  is a function over the name, not a template a caller fills',
    /export function sendTo/.test(src) && /Send to \$\{/.test(src));
  ok('#11 is a function over place and date',
    /export function introMeta/.test(src) && /met at \$\{where\}/.test(src));
}

// ── C2 · THE SCREEN HOLDS NO BYTE OF ITS OWN ────────────────────────────────
// The whole point of C1's home. Fifteen strings in a copy file and a sixteenth
// typed into the JSX is how a veto sheet stops being the authority.
sec('C2 \u00b7 the screen reads the copy home and spells nothing');
{
  const src = strip(read(SCREEN));
  for (const [label, byte] of [
    ['the lede', 'Send your page to someone'],
    ['the empty state', 'No introductions yet'],
    ['the review button', 'Review the message'],
    ['the preview eyebrow', 'They will receive'],
  ]) {
    ok(label + ' is not typed into the screen', !src.includes(byte));
  }
  ok('every byte arrives through IN or a helper',
    /IN, BUTTON_LABEL, sendTo, introMeta, introSent, chipWord, pageLabel/.test(read(SCREEN)));
  ok('the title is PASSED to the shell, and no colour is named for it',
    /<WorklistShell title=\{IN\.title\}>/.test(src));
}

// ── C3 · NOT ONE REFUSAL IS RE-IMPLEMENTED ──────────────────────────────────
// THE LAW OF THIS PACKET. A missing slot, a second introduction to one number
// and a dark plane are the ARM'S answers, forwarded by the door on `body.error`.
// A local map of them would be a second home for a founder-vetoed byte in the
// other repo, and the day the estate rewords one the screen would keep printing
// the old sentence with total confidence.
sec('C3 \u00b7 the refusals are the door\u2019s, and the screen owns none');
{
  const src = strip(read(SCREEN));
  const both = strip(read(SCREEN)) + strip(read(COPY));
  ok('the refusal rendered is body.error, from the wire', /setRefusal\(body\?\.error \|\| null\)/.test(src));
  // Each of these is a real sentence living in dream-os `victorLines.js` or in
  // `cap.reason()`. Not one may appear on this side.
  for (const byte of [
    'Include the country code',
    'It goes at the top of the message',
    'I can\u2019t send this without it',
    'Introductions go once',
    'WhatsApp did not accept it',
    'is off on the switchboard',
  ]) {
    ok('no local copy of \u201c' + byte.slice(0, 28) + '\u2026\u201d', !both.includes(byte));
  }
  ok('no code is branched on to pick a sentence',
    !/code === ['"](missing_slot|already_introduced|dark|name_mismatch)['"]/.test(src));
  // The door's own comment ALLOWS an empty-field check and this screen declines
  // it: posting a blank returns INTRO_ASK_* , which are founder-vetoed asks
  // written for exactly that moment. A local `if (!phone)` would replace three
  // vetoed bytes with silence.
  ok('the form does not refuse an empty field on its own authority',
    !/if \(!phone|if \(!name|if \(!where|phone\.trim\(\) === ''/.test(src));
}

// ── C4 · THE PREVIEW IS THE DOOR'S SENTENCE ─────────────────────────────────
// F-41.123's whole lesson. `body_filled` is built by the arm from
// `TEMPLATES.introduction.body`, byte-for-byte the string Meta holds. A
// paraphrase on the glass is how a registry and a filing drift apart, and she is
// approving the words a stranger reads.
sec('C4 \u00b7 the preview renders body_filled and builds nothing');
{
  const src  = strip(read(SCREEN));
  const both = src + strip(read(COPY));
  ok('the preview body is staged.body_filled', /\{staged\.body_filled\}/.test(src));
  ok('the template body is nowhere on this side',
    !/I wanted to send you my work|Reply STOP and I will/.test(both));
  ok('the page address is the door\u2019s value, never rebuilt',
    !/thedreamwedding\.in/.test(both) && /pageLabel\(staged\.page_url\)/.test(src));
}

// ── C5 · E3 IS THE SERVER'S, AND THE POST FEEDS IT HONESTLY ─────────────────
// `approvalNames` compares the approval to ITS OWN row. Posting the staged row's
// name back would be the client answering its own question and the guard would
// pass by construction on every request, including a wrong one.
sec('C5 \u00b7 the send carries the name from the FIELD');
{
  const src = strip(read(SCREEN));
  const m = src.match(/API\.introductionSend\(staged\.id\)[\s\S]{0,120}?\}\)/);
  ok('the send posts recipient_name', !!m && /recipient_name:/.test(m[0]));
  ok('and it is the field, not the row\u2019s echo',
    !!m && /recipient_name:\s*name\s*,/.test(m[0]) && !/recipient_name:\s*staged\./.test(m[0]),
    m ? m[0].replace(/\s+/g, ' ').slice(0, 90) : 'send call not found');
  ok('no approvalNames twin lives on this side',
    !/approvalNames|includes\(who\)|toLowerCase\(\)\.includes/.test(src + strip(read(COPY))));
}

// ── C6 · THE FORM IS PRESENT AT EVERY ROW COUNT, AND #15 SITS ABOVE IT ──────
// Chair-ruled: `No introductions yet.` goes ABOVE the form under the Sent
// eyebrow and NEVER instead of it. A room whose empty state replaces its one
// control is a room that cannot be used until someone else uses it.
sec('C6 \u00b7 #15 above the form, never instead of it');
{
  const src = strip(read(SCREEN));
  const iEmpty = src.indexOf('{IN.empty}');
  const iForm  = src.indexOf('{IN.labelNumber}');
  const iSend  = src.indexOf('{IN.review}');
  ok('#15 is rendered', iEmpty > -1);
  ok('the form is rendered', iForm > -1 && iSend > -1);
  ok('#15 comes BEFORE the first field in source order', iEmpty > -1 && iForm > -1 && iEmpty < iForm,
    iEmpty + ' vs ' + iForm);
  // The form is OUTSIDE the empty branch — the guarantee that a room with rows
  // and a room with none both carry it.
  //
  // ⚠ SLICED, NOT PROXIMITY-MATCHED. The first cut of this cell asked whether
  // `{IN.labelNumber}` appeared within 400 characters of `isEmpty ?` and went
  // RED on correct code, because the branch and the form are NEIGHBOURS by
  // design — the ruling puts one directly above the other. A distance is not a
  // nesting, and a cell that confuses them reddens on the shape it exists to
  // require. This reads the branch's OWN extent.
  const bOpen  = src.indexOf('{isEmpty ? (');
  const bClose = bOpen > -1 ? src.indexOf(') : null}', bOpen) : -1;
  const branch = bOpen > -1 && bClose > -1 ? src.slice(bOpen, bClose) : '';
  ok('the empty branch is found at all', branch.length > 0);
  ok('the form is not inside the empty branch', !branch.includes('IN.labelNumber'));
  ok('the empty branch is keyed on the SENT rows, not on the raw list',
    /const sent = introSent\(/.test(src) && /const isEmpty = sent\.length === 0/.test(src));
}

// ── C7 · CORRECTION 1 — THE CONFIRM IS FULL WIDTH AND BACK IS ABOVE IT ──────
// The frame drew them two-up and `Send to Anita Verma` wrapped inside the button
// at 374. The GRAPHITE shot in docs/mocks is the witness.
sec('C7 \u00b7 the confirm row, corrected');
{
  // ⚠ STRIPPED FIRST. The cell below asserts an ABSENCE, and the source file's
  // own note says the two-up rule is gone — a cell reading the raw text finds
  // the rule's name in the sentence explaining its removal and reds on correct
  // code. Comment-blindness, third sighting on this arc; the ordering cells read
  // the same stripped text so their indices agree with it.
  const src = strip(read(SCREEN));
  const iBack = src.indexOf('{IN.back}');
  const iSend = src.indexOf('sendTo(staged.recipient_name)');
  ok('Back comes ABOVE the confirm in source order', iBack > -1 && iSend > -1 && iBack < iSend);
  ok('Back is a text link, not a second button face',
    /\.itr-back\{[^}]*background:transparent/.test(src) && /\.itr-back\{[^}]*border:none/.test(src));
  ok('the confirm is full width and clamped to one line',
    /\.itr-send\{[^}]*white-space:nowrap/.test(src)
    && /\.itr-send\{[^}]*text-overflow:ellipsis/.test(src)
    && /\.itr-btn\{width:100%/.test(src));
  ok('the frame\u2019s two-up row is NOT carried back in', !/\.itr-two\b/.test(src));
}

// ── C8 · R-42.6 / R-41.140 — EVERY COLOUR IS A TOKEN, AND THE ROLE PREFIX IS
// READ FROM theme.ts RATHER THAN FROM THE FRAME (F-42.113).
sec('C8 \u00b7 tokens only, and the role prefix is the emitter\u2019s, not the frame\u2019s');
{
  // Stripped for the same reason C7 is: this block's own comment NAMES the
  // wrong prefix in order to warn about it (F-42.113), and an unstripped read
  // would score the warning as the violation.
  const src = strip(read(SCREEN));
  const style = src.slice(src.indexOf('<style>{`'), src.indexOf('`}</style>'));
  ok('no hex literal in the room\u2019s stylesheet', !/#[0-9a-fA-F]{3,8}\b/.test(style));
  ok('no rgb()/rgba() literal either', !/rgba?\(/.test(style));
  const theme = read('lib/worklist/theme.ts');
  const roleKeys = (theme.match(/const ROLE_KEYS:[^=]*=\s*\[([\s\S]*?)\];/) || [])[1] || '';
  const roles = (roleKeys.match(/'([a-z-]+)'/g) || []).map((s) => s.slice(1, -1));
  ok('theme.ts declares the role keys', roles.length > 0, roles.join(','));
  // A ROLE key spelled with the --atelier- prefix resolves to NOTHING in the app.
  // This is the frame's own defect (F-42.113) and the cell exists so it cannot be
  // copied in from a mock by a later seat.
  const wrong = roles.filter((k) => style.includes('--atelier-' + k));
  ok('no role token wears the --atelier- prefix (F-42.113)', wrong.length === 0, wrong.join(','));
  // ⚠ AND THE CONVERSE, so the cell is not satisfied by a stylesheet that names
  // no role token at all.
  ok('the room does name role tokens, through --role-', /var\(--role-/.test(style));
}

// ── C9 · THE TENTH ROW, THE SIXTH CONSTANT, AND THE ONE LINE ────────────────
sec('C9 \u00b7 the hub row and its address');
{
  const sol = read(SOLCOPY);
  const rm  = sol.match(/ROOM_ROWS = \[([\s\S]*?)\] as const;/);
  const labels = rm ? [...rm[1].matchAll(/label: '([^']+)'/g)].map((x) => x[1]) : [];
  ok('ROOM_ROWS carries ten rows', labels.length === 10, String(labels.length));
  ok('Introductions is LAST, after Your own number',
    labels[9] === 'Introductions' && labels[8] === 'Your own number', labels.slice(8).join('|'));
  const routes = strip(read(ROUTES));
  ok('INTRODUCTIONS_HREF is declared in the not-a-room home',
    /export const INTRODUCTIONS_HREF = '\/vendor\/introductions'/.test(routes));
  ok('the API path is declared and is the mounted one',
    /export const INTRODUCTIONS_API_PATH = '\/api\/v2\/vendor\/introductions'/.test(routes));
  ok('the three addresses ride the API map',
    /introductions:\s*\(\) => INTRODUCTIONS_API_PATH/.test(routes)
    && /introductionSend:\s*\(id: string\) =>/.test(routes));
  const hub = strip(read(HUB));
  ok('the hub opens the row with ONE line and no ternary',
    /introductions: INTRODUCTIONS_HREF,/.test(hub)
    && !/r\.key === 'introductions' \?/.test(hub));
  ok('the room is not a registry room (no tile is minted)',
    !/'\/vendor\/introductions'/.test(strip(read('lib/worklist/rooms.ts'))));
}

// ── C10 · b40 C31 READS THE DECLARATION, IT DOES NOT CARRY A LITERAL ────────
// Two homes for one set is how that cell's own audit went stale once already.
sec('C10 \u00b7 the declared set tightens with the room');
{
  const b40 = read(B40);
  ok('C31 reads INTRODUCTIONS_HREF from routes.ts',
    /export const INTRODUCTIONS_HREF\\s\*=\\s\*'\(\[\^'\]\+\)'/.test(b40)
    || /INTRODUCTIONS_HREF\\s\*=/.test(b40));
  ok('and it does not hardcode the address',
    !/declared\.add\('\/vendor\/introductions'\)/.test(b40));
  ok('the API path is NOT added to the declared set',
    !/declared\.add\([^)]*INTRODUCTIONS_API/.test(b40));
}

// ── C11 · F-42.110 — THE BUTTON LABEL HAS EXACTLY ONE HOME ON THIS SIDE ──────
// `See my work` is `TEMPLATES.introduction.button.text` in dream-os and the 201
// does not carry it. This side needs a copy to draw the preview; the finding is
// that it is a copy, and the cell keeps it to one.
sec('C11 \u00b7 the template button label, one home (F-42.110)');
{
  const copy = read(COPY);
  const screen = read(SCREEN);
  ok('it is declared in the copy home', /export const BUTTON_LABEL = 'See my work'/.test(copy));
  // ⚠ NOT `includes("'See my work'")`. The first cut asked for the QUOTED form
  // and a mutation that typed the label as bare JSX text walked straight past
  // it — vacuous, caught by the mutation pass and not by reading. The byte is
  // what is forbidden here, in any wrapper.
  ok('the screen reads the constant, never the string', !strip(screen).includes('See my work'));
  ok('the finding is named at the declaration', /F-42\.110/.test(copy));
}

// ── C12 · THE FRAME IS BANKED (F-42.95) ─────────────────────────────────────
sec('C12 \u00b7 the ratified frame is on file');
{
  const mock = read(MOCK);
  ok('the frame carries its own id', /data-frame="J1-introductions"/.test(mock));
  ok('its stylesheet is emitted, not typed', /advisor_frame_emit\.mjs/.test(mock));
  ok('both arms are declared', /\.arm-dark/.test(mock) && /\.arm-light/.test(mock));
  ok('the two shots are banked beside it',
    has('docs/mocks/j1-introductions-mock__J1-introductions__dark__374.png')
    && has('docs/mocks/j1-introductions-mock__J1-introductions__light__374.png'));
}

// ── C13 · F-42.111 — A ROW WITH NO VETOED CHIP IS NOT DRAWN, AND IT IS SAID ──
sec('C13 \u00b7 the not-sent row, filed rather than papered');
{
  const copy = read(COPY);
  ok('chipWord answers null for a state with no vetoed byte',
    /return null;/.test(copy) && /export function chipWord/.test(copy));
  ok('introSent filters on the byte, not on the status',
    /chipWord\(r\.chip\) !== null/.test(copy) && !/r\.status ===/.test(copy));
  ok('the gap is named at the site', /F-42\.111/.test(copy));
}

if (process.argv.includes('--mutate')) {
  sec('MUTATIONS \u2014 each must turn the cells RED');
  const MUT = [
    // C5 — the one that matters most: a client that answers its own guard.
    [SCREEN, 'the send echoes the staged row\u2019s name back \u2014 E3 passes by construction',
      'recipient_name: name,\n      });',
      'recipient_name: staged.recipient_name,\n      });'],

    // C3 — a local sentence for one refusal. The classic second home.
    [SCREEN, 'a local byte answers the dark plane',
      'setRefusal(body?.error || null);\n      }\n    } catch {\n      setRefusal(null);\n    } finally {\n      setBusy(false);\n    }\n  }\n\n  async function onSend',
      'setRefusal(body?.code === \'dark\' ? \'Introductions are off on the switchboard\' : (body?.error || null));\n      }\n    } catch {\n      setRefusal(null);\n    } finally {\n      setBusy(false);\n    }\n  }\n\n  async function onSend'],

    // C4 — the preview paraphrases instead of rendering the door's bytes.
    [SCREEN, 'the preview builds the sentence locally',
      '<p className="itr-body">{staged.body_filled}</p>',
      '<p className="itr-body">Hi {staged.recipient_name}, I wanted to send you my work.</p>'],

    // C6 — the form is pulled INSIDE the empty branch, which is the ruling's own
    // violation: `never instead of the form`. A room whose only control appears
    // only when it has never been used cannot be used at all.
    //
    // ⚠ THE FIRST SPELLING OF THIS MUTATION WAS VACUOUS. It appended a comment
    // after the branch and left every cell green, which is a mutation that
    // edited the file and tested nothing — M22's class in dream-os, caught the
    // same way, by running it rather than by trusting the sed.
    [SCREEN, 'the form is pulled inside the empty branch',
      '<p className="itr-empty">{IN.empty}</p>\n          </>',
      '<p className="itr-empty">{IN.empty}</p>\n            <label className="itr-lbl">{IN.labelNumber}</label>\n          </>'],

    // C7 — correction 1 reverted: the confirm loses its clamp and wraps again.
    [SCREEN, 'the confirm loses its one-line clamp \u2014 the frame\u2019s own defect returns',
      '.itr-send{margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.itr-send{margin-top:4px}'],

    // C8 — a role token wearing the frame's wrong prefix (F-42.113's live shape).
    [SCREEN, 'a role colour is transcribed from the frame with the --atelier- prefix',
      'color:var(--role-critical)',
      'color:var(--atelier-critical)'],

    // C9 — the tenth row loses its ruled position.
    [SOLCOPY, 'the tenth row moves off the end of the list',
      "  { key: 'introductions', label: 'Introductions' },\n] as const;",
      "] as const;\nexport const INTRO_ROW = { key: 'introductions', label: 'Introductions' };"],

    // C9 — the address becomes a literal at the call site, out of its one home.
    [ROUTES, 'the room\u2019s address is retired from its declared home',
      "export const INTRODUCTIONS_HREF = '/vendor/introductions';",
      "export const INTRODUCTIONS_HREF_RETIRED = '/vendor/introductions';"],

    // C11 — a second spelling of the template's button label.
    [SCREEN, 'the button label is typed at the call site',
      '<div className="itr-btnchip">{BUTTON_LABEL}</div>',
      '<div className="itr-btnchip">See my work</div>'],

    // C13 — the filter reads status, so a staged row draws with no chip.
    [COPY, 'introSent filters on status rather than on the vetoed byte',
      'return (rows || []).filter((r) => chipWord(r.chip) !== null);',
      'return (rows || []).filter((r) => r.status !== \'staged\');'],
  ];
  for (const [rel, name, from, to] of MUT) {
    const abs = P(rel);
    const before = fs.readFileSync(abs);
    const txt = before.toString('utf8');
    if (!txt.includes(from)) { ok(name, false, 'mutation site absent \u2014 the code moved'); continue; }
    fs.writeFileSync(abs, txt.replace(from, to));
    const r = spawnSync(process.execPath, [__filename, '--cells-only'], { encoding: 'utf8' });
    fs.writeFileSync(abs, before);
    ok(name + ' \u2192 RED', r.status !== 0, 'exit ' + r.status);
    ok(name + ' \u2192 restored byte-for-byte', Buffer.compare(before, fs.readFileSync(abs)) === 0);
  }
}

console.log('\n' + (fail === 0 ? 'GREEN' : 'RED') + ' \u2014 b69 j1 introductions (pwa) ' +
  pass + '/' + (pass + fail));
process.exit(fail === 0 ? 0 : 1);
