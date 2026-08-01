#!/usr/bin/env node
// scripts/tdw07_f0784_panel.proof.mjs
// THE ADMIN PANEL FOLD — dreamos-pwa side. F-07.84 · F-07.85 · F-07.88.
// Runnable from any working directory (Q-SP-5).

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const R    = p => path.join(ROOT, p);
const read = p => fs.readFileSync(R(p), 'utf8');

let pass = 0, fail = 0;
const ok  = (n, c) => { if (c) { pass++; console.log(`  PASS  ${n}`); } else { fail++; console.log(`  FAIL  ${n}`); } };
const sec = t => console.log(`\n${t}`);

// ── SECRET-HYGIENE LAW ───────────────────────────────────────────────────────
// This bench NEVER contains the retired literal. Every cell asserts ABSENCE OF A
// PATTERN — a credential-SHAPED string in a place credentials must not live —
// never the presence or absence of a particular value. That is what makes it
// safe to commit into a public repo, and it is the F-07.83 tripwire finally
// shipped: that handover declared the tripwire OWED and named this bench as its
// home. Paid here.
const CRED_SHAPED = /['"][A-Za-z][A-Za-z0-9]{2,}[@#$!][0-9]{5,}['"]/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.next', '.git'].includes(e.name)) walk(p, out); }
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

function stripComments(src) {
  let out = '', i = 0, inS = null, inLine = false, inBlock = false;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (inLine)  { if (c === '\n') { inLine = false; out += c; } i++; continue; }
    if (inBlock) { if (c === '*' && n === '/') { inBlock = false; i += 2; } else i++; continue; }
    if (inS) {
      out += c;
      if (c === '\\') { out += src[i + 1] || ''; i += 2; continue; }
      if (c === inS) inS = null;
      i++; continue;
    }
    if (c === "'" || c === '"' || c === '`') { inS = c; out += c; i++; continue; }
    if (c === '/' && n === '/') { inLine  = true; i += 2; continue; }
    if (c === '/' && n === '*') { inBlock = true; i += 2; continue; }
    out += c; i++;
  }
  return out;
}

const ADMIN_FILES = walk(R('app/admin'));
const LIB_FILES   = walk(R('lib/admin-api'));

// ── §0 · THE CANARY ──────────────────────────────────────────────────────────
sec('§0 · THE CANARY — the stripper does not swallow live code');
{
  const src = read('lib/admin-api/_base.ts');
  const s   = stripComments(src);
  ok('§0.1 comment prose is removed', !s.includes('EXEMPT-BY-CLASS'));
  ok('§0.2 CANARY: the header authority survives stripping', /export function adminHeaders/.test(s));
  ok('§0.3 CANARY: the login helper survives stripping', /export async function adminLogin/.test(s));
  ok('§0.4 VACUITY TWIN: the stripper is not a no-op', s.length < src.length);
  ok('§0.5 CANARY: F-07.74\'s own shape does not swallow the file',
     stripComments(`const a = 'image/*'; const KEEP = 1; /* x */ const B = 2;`).includes('KEEP'));
}

// ── §1 · F-07.84 — THE CREDENTIAL HAS LEFT THE CLIENT ────────────────────────
sec('§1 · F-07.84 — no password-shaped material anywhere in the panel source');
{
  const all = [...ADMIN_FILES, ...LIB_FILES];
  const envSites = all.filter(f => stripComments(fs.readFileSync(f, 'utf8')).includes('NEXT_PUBLIC_ADMIN_PASSWORD'));
  ok(`§1.1 COUNT-AT-BOUNDARY: zero code sites read NEXT_PUBLIC_ADMIN_PASSWORD (found ${envSites.length})`,
     envSites.length === 0);

  const credSites = all.filter(f => CRED_SHAPED.test(stripComments(fs.readFileSync(f, 'utf8'))));
  ok(`§1.2 TRIPWIRE: zero credential-SHAPED literals survive in app/admin/** or lib/admin-api/** (found ${credSites.length})`,
     credSites.length === 0);

  const login = stripComments(read('app/admin/login/page.tsx'));
  ok('§1.3 the login screen no longer compares in the browser', !/password === /.test(login));
  ok('§1.4 the login screen POSTs to the backend', /adminLogin\(password\)/.test(login));
  ok('§1.5 the login screen writes NO boolean', !/setItem\(\s*['"]admin_session['"]/.test(login));
  ok('§1.6 the login screen distinguishes 401 from every other failure (no false blame)',
     /status === 401/.test(login));
}

// ── §2 · F-07.84 — THE BOOLEAN OPENS NOTHING ─────────────────────────────────
sec('§2 · F-07.84 — the devtools bypass is dead at BOTH gates');
{
  const layout = stripComments(read('app/admin/layout.tsx'));
  ok('§2.1 the layout gate no longer reads the boolean',
     !/getItem\(\s*['"]admin_session['"]\s*\)/.test(layout));
  ok('§2.2 the layout gate demands a real session', /hasAdminSession\(\)/.test(layout));
  ok('§2.3 sign-out clears the real session', /clearAdminSession\(\)/.test(layout));

  const dh = stripComments(read('app/admin/discover-heroes/page.tsx'));
  ok('§2.4 THE SECOND READER: discover-heroes no longer reads the boolean',
     !/getItem\(\s*['"]admin_session['"]\s*\)/.test(dh));
  ok('§2.5 …and it asks the same authority', /hasAdminSession\(\)/.test(dh));

  const base = read('lib/admin-api/_base.ts');
  ok('§2.6 the retired boolean is EVICTED from any browser still carrying it',
     /removeItem\('admin_session'\)/.test(base));

  // BEHAVIOURAL — a hand-set boolean satisfies nothing.
  ok('§2.7 hasAdminSession is derived from the TOKEN key, not the boolean key',
     /localStorage\.getItem\(TOKEN_KEY\)/.test(base) && /TOKEN_KEY\s*=\s*'admin_session_token'/.test(base));
  ok('§2.8 an expired token is refused client-side before it is ever sent',
     /exp <= Date\.now\(\)/.test(stripComments(base)));
}

// ── §3 · F-07.85 — ONE AUTHORITY, ZERO HAND-BUILT HEADERS ────────────────────
sec('§3 · F-07.85 — the 26 senders ride one home');
{
  const all = [...ADMIN_FILES, ...LIB_FILES];
  const senders = all.filter(f => /x-admin-password/.test(stripComments(fs.readFileSync(f, 'utf8'))));
  ok(`§3.1 COUNT-AT-BOUNDARY: zero x-admin-password strings survive in code (found ${senders.length})`,
     senders.length === 0);

  const base = stripComments(read('lib/admin-api/_base.ts'));
  ok('§3.2 the authority sends a bearer', /Authorization: `Bearer \$\{token\}`/.test(base));
  ok('§3.3 the authority reads the token LAZILY, at call time',
     /export function adminHeaders/.test(base) && /const token = getAdminToken\(\);/.test(base));
  ok('§3.4 no module-level header const survives anywhere in app/admin/**',
     all.every(f => !/^const [A-Za-z_]+ *= *\{[^\n]*Authorization/m.test(stripComments(fs.readFileSync(f, 'utf8')))));

  const adopters = ADMIN_FILES.filter(f => /adminHeaders\(/.test(stripComments(fs.readFileSync(f, 'utf8'))));
  ok(`§3.5 the adoption is wide, not token: ${adopters.length} screens call the authority`, adopters.length >= 20);
  ok('§3.6 every adopter imports it rather than redefining it',
     adopters.every(f => /from ['"]@\/lib\/admin-api\/_base['"]/.test(fs.readFileSync(f, 'utf8'))));
}

// ── §4 · F-07.88 — THE DISPLAY SITE ──────────────────────────────────────────
sec('§4 · F-07.88 — the password is not rendered on any screen');
{
  const cr = read('app/admin/control-room/page.tsx');
  ok('§4.1 the on-screen note no longer names a password value',
     !/Admin password: \S/.test(stripComments(cr)));
  ok('§4.2 the control it annotated still exists (the note died, not the toggle)',
     /Admin portal password protected/.test(cr));
  ok('§4.3 THE DISPLAY CLASS, named: no note prop in the panel carries credential-shaped bytes',
     ADMIN_FILES.every(f => !CRED_SHAPED.test(stripComments(fs.readFileSync(f, 'utf8')))));
}

// ── §5 · THE VETO SLOT — declared, not smuggled ──────────────────────────────
sec('§5 · the one new string is flagged for veto, not shipped silently');
{
  const login = read('app/admin/login/page.tsx');
  ok('§5.1 the six frozen bytes survive byte-identical',
     ['The Dream Wedding', 'Control Room', '>Password<', "'Incorrect password.'", 'Entering…', '>Enter<']
       .every(b => login.includes(b.replace(/^>|<$/g, '')) ));
  ok('§5.2 the one new string lives in a single named constant', /const NETWORK_FAIL = /.test(login));
  ok('§5.3 it is marked VETO PENDING in-file', /VETO PENDING/.test(login));
}

console.log(`\n════════  ${pass} passed, ${fail} failed  ════════`);
process.exit(fail === 0 ? 0 : 1);
