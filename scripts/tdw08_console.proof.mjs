#!/usr/bin/env node
// scripts/tdw08_console.proof.mjs — TDW_08 · THE CONSOLE SITTING (pwa arm)
//
// Runnable from ANY working directory (ROOT resolved from import.meta.url).
//
// EVERY §M CELL IS BOTH-WAYS: it mutates PRODUCTION SOURCE — never test setup —
// asserts the cell goes RED at the broken tree, restores the file, and asserts
// byte-identity. Every anchor is asserted to appear EXACTLY ONCE (CE-127).
//
// ── THE COMMENT-BLINDNESS LAW BINDS EVERY TEXTUAL CELL HERE ──────────────────
// This sitting's files carry long comment blocks that QUOTE the very bytes these
// cells assert absent — `translateY(10px)`, the old two-predicate expressions,
// `[onDone]`. Every textual cell strips comments FIRST and says so.
//
// ── WHAT THIS BENCH DOES NOT PROVE, NAMED (floor-method law) ─────────────────
//   · IT DOES NOT PROVE THE CONTAINING-BLOCK DEFECT. See §1's own note. There
//     is no browser and no layout engine in this container; arm (1) — a first
//     headless-Chromium dependency — was REFUSED for this sitting as a tooling
//     decision above a console sitting. §1 proves the byte-level PRECONDITION.
//   · IT DOES NOT PROVE THE EQUAL-VALUE BAIL IS CLOSED, because it is not.
//     FORK 2(D) is sited inside the shared component; the bail lives in each
//     page's own useState and no render occurs for the component to observe.
//     §2 proves the timer, not the bail. F-08.48 holds the rest.
//   · NO dream-os cells. The register gate, its siting, `invite_states` on the
//     wire and F-08.47's mechanism are benched at scripts/b08_console_bench.js
//     in the other repository, which this bench cannot see.
//   · NO device cell. iOS Safari, Android Chrome and the Instagram in-app
//     browser cannot be witnessed from this container.

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// TDW_09 F-09.30 · R-S5 arm (b) — A READER THAT REFUSES WITH A REASON.
// This harness crashed with a raw ENOENT stack because it read a file F-09.20 had
// retired. A bench that dies on its own read set tells you nothing about the tree
// it was guarding: the operator sees a stack trace and cannot tell a deleted
// fixture from a broken cure. The independent-method law's clause 1 applied to the
// harness itself — a check whose failure mode is an unnamed crash is not a check.
const read = (rel) => {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.error(`\nHARNESS REFUSED — read set is stale: ${rel} does not exist at ${ROOT}.`);
    console.error('A surface this bench guards has been retired. Amend the read set and the cells that stood on it,');
    console.error('with the count movement labelled — do not delete the cell silently.\n');
    process.exit(3); // F-39.47/F-39.55: a refusal exits 3 — named, never a FAIL, never in a base
  }
  return fs.readFileSync(abs, 'utf8');
};
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const code = (rel) => strip(read(rel));

const LAYOUT  = 'app/admin/layout.tsx';
const UI      = 'app/admin/_components/AdminUI.tsx';
const PAGE    = 'app/admin/demo/page.tsx';
// TDW_09 F-09.30 · R-S5 arm (a) — `app/admin/invite-requests/_list.tsx` LEFT THE
// READ SET. F-09.20 retired the screen; the two cells below that stood on it are
// removed rather than re-pointed, because there is no surviving surface carrying
// the second application they were written to guard.
const LANDING = 'app/demo/vendor/[handle]/page.tsx';

let pass = 0, fail = 0;
const H = (s) => console.log(`\n══ ${s} ══`);
function ok(name, cond, msg) {
  try { assert.ok(cond, msg || 'assertion failed'); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n        ${e.message}`); fail++; }
}

function mutate(rel, anchor, replacement, predicate, label) {
  const abs = path.join(ROOT, rel);
  const original = fs.readFileSync(abs, 'utf8');
  const hits = original.split(anchor).length - 1;
  assert.strictEqual(hits, 1,
    `anchor must appear EXACTLY ONCE in ${rel} (found ${hits}) — a bare anchor is a coin flip`);
  try {
    fs.writeFileSync(abs, original.replace(anchor, replacement), 'utf8');
    let red = false;
    try { predicate(); } catch { red = true; }
    assert.ok(red, `${label}: the cell stayed GREEN over broken production code — it proves nothing`);
  } finally {
    fs.writeFileSync(abs, original, 'utf8');
    assert.strictEqual(fs.readFileSync(abs, 'utf8'), original, `${rel} was NOT restored byte-identically`);
  }
}
function okMutate(name, rel, anchor, replacement, predicate, label) {
  try { mutate(rel, anchor, replacement, predicate, label); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n        ${e.message}`); fail++; }
}

// Isolate the `fadeUp` keyframe body from the layout's CSS template literal.
function fadeUpBody(src) {
  const m = /@keyframes fadeUp\s*\{([\s\S]*?)\n\s{2}\}/.exec(strip(src));
  return m ? m[1] : null;
}

// ═════════════════════════════════════════════════════════════════════════════
H('§1 · F-08.42 LIMB 1 — FORK 1(e), THE CLASS CARRIES NO TRANSFORM');
//
// ── WHAT THIS SECTION PROVES, AND WHAT IT DOES NOT — READ BEFORE TRUSTING IT ─
// A containing block is a LAYOUT fact. This container has no browser and no
// layout engine, so NOTHING here witnesses that a `position:fixed` descendant
// resolves against the viewport. These cells prove the BYTE-LEVEL PRECONDITION
// of the defect: that the animation applied to the ancestor of {children}
// declares and retains no transform. That is a proxy and it is labelled one.
// THE LAYOUT CONSEQUENCE HAS EXACTLY ONE WITNESS AND IT IS THE FOUNDER'S WALK —
// a toast that appears where a toast belongs, on a scrolled surface, on his own
// device. A green here is not a cured screen and must never be reported as one.

{
  const body = fadeUpBody(read(LAYOUT));
  ok('§1.1 the fadeUp keyframe exists and is readable', body !== null);
  ok('§1.2 NO transform is declared in either frame — the cure itself',
    body !== null && !/transform/.test(body),
    'any transform here re-creates the containing block for 33 fixed descendants');
  ok('§1.3 the fade survives — this is (e), not (d): the entrance was not deleted',
    body !== null && /opacity:\s*0/.test(body) && /opacity:\s*1/.test(body));
}
ok('§1.4 the class still declares the animation with `both` — fill mode was NOT the cure',
  /\.fade-up\s*\{\s*animation:\s*fadeUp 300ms \$\{EASE\} both;\s*\}/.test(code(LAYOUT)),
  '(a) was dominated: dropping `both` leaves a 300ms window in which the trap is live');
ok('§1.5 the wrapper around {children} still carries the class — the application is untouched',
  /className="fade-up"/.test(code(LAYOUT)));

// THE SECOND APPLICATION. This is why the cure is sited on the CLASS: _list.tsx
// nests INSIDE the layout wrapper on two surfaces (makers, dreamers) and traps
// its own drawer and scrim by the NEARER ancestor. An arm sited on
// layout.tsx's application would have left these two broken.
// §1.6 and §1.7 REMOVED — LABELLED AMENDMENT (F-09.30, R-S5). NO PRIOR COUNT TO
// PRESERVE, and the reason is the finding: this harness CRASHED at 8066072 before
// it could print a total, so no baseline number for it exists anywhere in the
// record. Its first completing run is 55/55, and the two cells named here are the
// only ones removed. Stated this way rather than inventing a delta from a run that
// never finished.
// They asserted the SECOND application of `fade-up`, which lived on the retired
// invite-requests list. The surface is gone, so the assertion has no referent; a
// cell re-pointed at a different file would be a new claim wearing an old number.
// §1.8's census below carries the surviving truth and is re-aimed with it.
// TDW_09 F-09.30 — RE-AIMED WITH ITS SIBLINGS. Two applications became one when
// the invite-requests screen retired. The census still asserts the PROPERTY (how
// many surfaces carry the class), which is why it survives where §1.6/§1.7 could
// not: it never named the file.
ok('§1.8 exactly ONE application estate-wide — the census the cure was scoped to',
  (() => {
    const hits = [];
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== '.next') walk(p); continue; }
        if (!/\.tsx?$/.test(e.name)) continue;
        if (/className="fade-up"/.test(fs.readFileSync(p, 'utf8'))) hits.push(p);
      }
    };
    walk(path.join(ROOT, 'app'));
    return hits.length === 1;
  })());

// ═════════════════════════════════════════════════════════════════════════════
H('§2 · F-08.42 LIMB 2 — FORK 2(D), THE TIMER STOPS OBEYING THE ARROW');

ok('§2.1 the effect no longer depends on `onDone` — the inline arrow cannot restart it',
  !/\}, \[onDone\]\);/.test(code(UI)),
  'a new arrow identity per render tore the timer down and re-armed it every render');
ok('§2.2 the timer is keyed on MESSAGE IDENTITY',
  /\}, \[msg, shown\]\);/.test(code(UI)));
ok('§2.3 `onDone` is read through a ref at fire time',
  /doneRef\.current\s*=\s*onDone;/.test(code(UI))
  && /setTimeout\(\(\) => doneRef\.current\(\), 3000\)/.test(code(UI)));
ok('§2.4 visibility is a PROP — an empty message renders nothing',
  /if \(!shown\) return null;/.test(code(UI)));
ok('§2.5 the three seconds are unchanged — this arm moved ownership, not duration',
  /3000/.test(code(UI)));
ok('§2.6 this sitting\'s own surface mounts it UNCONDITIONALLY (the ruled shape, live)',
  /<Toast msg=\{toast\} onDone=\{\(\) => setToast\(''\)\} error=\{toastErr\} \/>/.test(code(PAGE))
  && !/\{toast && <Toast/.test(code(PAGE)));

// ═════════════════════════════════════════════════════════════════════════════
H('§3 · F-08.45 + FORK 3 — ONE PREDICATE, AND ITS STATE TERM IS THE SERVER\'S');

ok('§3.1 there is exactly ONE predicate', (code(PAGE).match(/const canSend = /g) || []).length === 1);
ok('§3.2 it carries the linkage term the per-card button used to omit',
  /const canSend = \(v: DemoVendor\) =>[\s\S]{0,240}!v\.linkage_held_by/.test(code(PAGE)));
ok('§3.3 the batch filter applies it', /rows\.filter\(canSend\)/.test(code(PAGE)));
ok('§3.4 the per-card button is mounted THROUGH it', /\{canSend\(v\) && \(/.test(code(PAGE)));
ok('§3.5 NO hand-written invite subset survives on this surface',
  !/state === 'built' \|\| state === 'legacy'/.test(code(PAGE))
  && !/'built'\s*,\s*'legacy'|'legacy'\s*,\s*'built'/.test(code(PAGE)));
ok('§3.6 the subset comes off the wire', /invite_states/.test(code(PAGE))
  && /inviteStates\.includes\(v\.state\)/.test(code(PAGE)));
ok('§3.7 with the same absent-on-stale-deploy guard `states` already carried',
  /if \(Array\.isArray\(vRes\.invite_states\)\) setInviteStates\(vRes\.invite_states\);/.test(code(PAGE)));
ok('§3.8 an empty subset arms NOTHING — the safe direction to fail',
  /useState<string\[\]>\(\[\]\)/.test(code(PAGE)));
ok('§3.9 the column header gate reads the same source',
  /const canInvite = inviteStates\.includes\(state\);/.test(code(PAGE)));
// The badge and the border are UNCHANGED. The cure removes an armed control; it
// does not remove the explanation of why the control is absent.
ok('§3.10 the red border survives', /v\.linkage_held_by \? T\.danger : T\.border/.test(code(PAGE)));
ok('§3.11 the `linked to @X` badge survives', /linked to @\{v\.linkage_held_by\}/.test(code(PAGE)));

// ═════════════════════════════════════════════════════════════════════════════
H('§4 · V1 — THE REQUIRED-FIELD AFFORDANCE, FROZEN AT THE BYTE');

ok('§4.1 FieldSelect gained the hint slot FieldInput always had',
  /export function FieldSelect\(\{ label, value, onChange, options, hint \}/.test(code(UI)));
ok('§4.2 and it renders in FieldInput\'s geometry, not a second one',
  /\{hint && <span style=\{\{ fontFamily:T\.ff\.body, fontSize:10, color:T\.dim \}\}>\{hint\}<\/span>\}/
    .test(code(UI)));
ok('§4.3 exactly FOUR fields carry the mark — the four the pre-flight refuses on',
  (code(PAGE).match(/hint="Required"/g) || []).length === 4);
for (const [label, sym] of [
  ['IG Handle (becomes URL)', 'igHandle'], ['Display Name', 'dispName'],
  ['Category', 'category'], ['City', 'city'],
]) {
  ok(`§4.4 ${label} is marked`,
    new RegExp(`label="${label.replace(/[()]/g, '\\$&')}"[^\\n]*hint="Required"`).test(code(PAGE)));
  void sym;
}
ok('§4.5 the bytes are `Required` — frozen at the BYTE, not the shape',
  /hint="Required"/.test(code(PAGE)) && !/hint="Required \*"|hint="required"/.test(code(PAGE)));
ok('§4.6 V4 — the pre-flight line is BYTE-UNTOUCHED beside the new mark',
  code(PAGE).includes("showToast('Handle, name, category and city required.', true)"));
ok('§4.7 the Rate Display and About fields are NOT marked — they are not required',
  !/label="Rate Display"[^\n]*hint="Required"/.test(code(PAGE)));

// ═════════════════════════════════════════════════════════════════════════════
H('§5 · F-08.44 — THE SURFACE RENDERS THE SERVER\'S SENTENCE, NOT ITS KEY');

ok('§5.1 `detail` is rendered first so V2/V3 can reach the screen',
  /showToast\(d\.detail \|\| d\.error \|\| 'Failed\.', true\)/.test(code(PAGE)));
ok('§5.2 and the older refusals, which carry no `detail`, still render their own sentence',
  /d\.detail \|\| d\.error/.test(code(PAGE)));
ok('§5.3 this surface holds NO register predicate of its own — the rule is the route\'s',
  !/rate_register|about_register/.test(code(PAGE))
  && !/\\u20B9|K or L shorthand/.test(code(PAGE)));

// ═════════════════════════════════════════════════════════════════════════════
H('§6 · F-08.46 — THE TOAST GETS ITS OWN KEYFRAME');

ok('§6.1 a purpose-built keyframe exists', /@keyframes toastRise/.test(code(LANDING)));
{
  const m = /@keyframes toastRise \{([^}]*\}[^}]*)\}/.exec(code(LANDING));
  const body = m ? m[1] : '';
  ok('§6.2 it carries the centring transform in the FROM frame',
    /from\{[^}]*translateX\(-50%\)/.test(body));
  ok('§6.3 and in the TO frame — which is the one `both` retains',
    /to\{[^}]*translateX\(-50%\)/.test(body));
}
ok('§6.4 the toast applies it', /animation:`toastRise 240ms \$\{EASE\} both`/.test(code(LANDING)));
ok('§6.5 the toast no longer applies the generic keyframe',
  !/animation:`fadeUp 240ms/.test(code(LANDING)));
ok('§6.6 the inline centring transform is UNCHANGED — the keyframe moved, not the geometry',
  /position:'fixed', left:'50%', transform:'translateX\(-50%\)'/.test(code(LANDING)));
ok('§6.7 the lead cards keep `fadeUp` — they carry no inline transform to clobber',
  /animation:`fadeUp 500ms \$\{EASE\} \$\{120 \+ i \* 60\}ms both`/.test(code(LANDING)));
ok('§6.8 ZERO copy bytes — the vetoed lines live in VendorProfileView, not here',
  !/Couples tap this/.test(code(LANDING)));

// ═════════════════════════════════════════════════════════════════════════════
H('§M · THE MUTATIONS — RED AT THE UNCURED TREE, PRODUCTION SOURCE ONLY');

okMutate('§M.1 §1.2 reds at the UNCURED tree — the original keyframe restored', LAYOUT,
  '  @keyframes fadeUp {\n    from { opacity: 0; }\n    to   { opacity: 1; }\n  }',
  '  @keyframes fadeUp {\n    from { opacity: 0; transform: translateY(10px); }\n    to   { opacity: 1; transform: translateY(0); }\n  }',
  () => {
    const body = fadeUpBody(read(LAYOUT));
    assert.ok(body !== null && !/transform/.test(body));
  }, '§1.2');

okMutate('§M.2 §1.2 reds if only the `to` frame is cleaned — arm (b) is not arm (e)', LAYOUT,
  '    from { opacity: 0; }',
  '    from { opacity: 0; transform: translateY(10px); }',
  () => {
    const body = fadeUpBody(read(LAYOUT));
    assert.ok(body !== null && !/transform/.test(body));
  }, '§1.2');

okMutate('§M.3 §2.1 reds if the effect goes back to depending on the arrow', UI,
  '  }, [msg, shown]);', '  }, [onDone]);',
  () => assert.ok(!/\}, \[onDone\]\);/.test(code(UI)) && /\}, \[msg, shown\]\);/.test(code(UI))), '§2.1');

okMutate('§M.4 §2.4 reds if visibility stops being a prop', UI,
  '  if (!shown) return null;', '',
  () => assert.ok(/if \(!shown\) return null;/.test(code(UI))), '§2.4');

okMutate('§M.5 §3.4 reds if the card button leaves the predicate', PAGE,
  '{canSend(v) && (', "{(state === 'built' || state === 'legacy') && v.whatsapp_phone && (",
  () => assert.ok(/\{canSend\(v\) && \(/.test(code(PAGE))
    && !/state === 'built' \|\| state === 'legacy'/.test(code(PAGE))), '§3.4');

okMutate('§M.6 §3.2 reds if the linkage term is dropped from the one predicate', PAGE,
  '                  && !v.linkage_held_by\n', '\n',
  () => assert.ok(/const canSend = \(v: DemoVendor\) =>[\s\S]{0,240}!v\.linkage_held_by/.test(code(PAGE))), '§3.2');

okMutate('§M.7 §3.6 reds if the subset is re-typed on the surface', PAGE,
  '                  inviteStates.includes(v.state)', "                  ['built', 'legacy'].includes(v.state)",
  () => assert.ok(/inviteStates\.includes\(v\.state\)/.test(code(PAGE))
    && !/'built'\s*,\s*'legacy'/.test(code(PAGE))), '§3.6');

okMutate('§M.8 §4.3 reds if a required field loses its mark', PAGE,
  '<FieldSelect label="Category" value={category} onChange={setCategory} options={CATEGORIES} hint="Required" />',
  '<FieldSelect label="Category" value={category} onChange={setCategory} options={CATEGORIES} />',
  () => assert.strictEqual((code(PAGE).match(/hint="Required"/g) || []).length, 4), '§4.3');

okMutate('§M.9 §5.1 reds if the surface goes back to rendering the machine key', PAGE,
  "showToast(d.detail || d.error || 'Failed.', true)", "showToast(d.error || 'Failed.', true)",
  () => assert.ok(/showToast\(d\.detail \|\| d\.error \|\| 'Failed\.', true\)/.test(code(PAGE))), '§5.1');

okMutate('§M.10 §6.3 reds at the UNCURED tree — the generic keyframe on the toast', LANDING,
  'animation:`toastRise 240ms ${EASE} both`', 'animation:`fadeUp 240ms ${EASE} both`',
  () => assert.ok(/animation:`toastRise 240ms \$\{EASE\} both`/.test(code(LANDING))
    && !/animation:`fadeUp 240ms/.test(code(LANDING))), '§6.4');

okMutate('§M.11 §6.3 reds if the TO frame loses its centring — the exact F-08.46 shape', LANDING,
  'to{opacity:1;transform:translateX(-50%) translateY(0)} }',
  'to{opacity:1;transform:translateY(0)} }',
  () => {
    const m = /@keyframes toastRise \{([^}]*\}[^}]*)\}/.exec(code(LANDING));
    assert.ok(m && /to\{[^}]*translateX\(-50%\)/.test(m[1]));
  }, '§6.3');

// ═════════════════════════════════════════════════════════════════════════════
console.log(`\n${fail === 0 ? 'GREEN' : 'RED'} — tdw08_console ${pass}/${pass + fail}\n`);
process.exit(fail === 0 ? 0 : 1);
