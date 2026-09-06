#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/tdw14_d5_welcome.proof.mjs
// TDW_14 · D-5 · C-8 — THE WELCOME: the join screen's words, the success step
// that finally exists, and the member key.
//
//   node scripts/tdw14_d5_welcome.proof.mjs
//
// ── WHAT D-5 IS ────────────────────────────────────────────────────────────
// Three pieces, and the cells are grouped by them: the MANIFEST (§4/§5), the
// SUCCESS STEP (§2/§3), and the WELCOME COPY (§1). Everything else below is a
// guard on something D-5 was told NOT to do — §6 the dead fallbacks that had to
// die rather than be frozen, §7 the hex that had to die inside the radius, §8
// the slides call the founder ruled untouchable, §9 the refused-exception block
// the success step had to be inserted AROUND rather than through.
//
// ── WHY §8 AND §9 ARE HERE AT ALL ──────────────────────────────────────────
// They assert ABSENCES OF CHANGE, which is the class of claim a delivery is
// least able to make about itself. §8 in particular guards a founder ruling
// (「skip it」, 2026-08-14): the dressing is out of D-5's scope, F-14.18 stays
// open whole for Row 13, and a future seat tidying this file must meet a cell
// rather than a comment.
//
// ── R-33.3 · AN ABSENCE CELL'S RADIUS EQUALS ITS CLAIM ─────────────────────
// §6 and §7 are comment-stripped and bounded to the one file each names. §7 in
// particular counts what RENDERS, never what a comment mentions — the labelled
// no-token ground at the fallback background is a deliberate survivor and is
// named here so the cell cannot over-convict it.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const raw  = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const sha  = (s) => crypto.createHash('sha256').update(s).digest('hex');
const exists = (p) => fs.existsSync(path.join(ROOT, p));

// Line comments stripped BEFORE block comments, per the estate's law.
const code = (p) => raw(p)
  .split('\n').filter(l => !l.trim().startsWith('//')).join('\n')
  .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');

const JOIN     = 'app/circle/join/[token]/page.tsx';
const LAYOUT   = 'app/coplanner/layout.tsx';
const MANIFEST = 'app/coplanner/manifest/route.ts';

let pass = 0, fail = 0;
const ok = (label, cond, why) => {
  if (cond) { pass++; console.log(`  ok   ${label}`); }
  else      { fail++; console.log(`  RED  ${label}${why ? ' — ' + why : ''}`); }
};
const sec = (t) => console.log(`\n${t}`);

const J = code(JOIN);

// ═══════════════════════════════════════════════════════════════════════════
sec('§1 · THE WELCOME COPY — frozen at the character (founder, 2026-08-14)');

const FROZEN_CLIENT = [
  ['\u2460 one moment',        'One moment.'],
  ['\u2461 C-8\u2019s ruled line',  'invited you to her wedding circle'],
  ['\u2462 phone sub-line',    'Enter your phone number.'],
  ['\u2464 send code',         "'Send code'"],
  ['\u2465 sending',           "'Sending…'"],
  ['\u2466 code sent',         'We sent you a code.'],
  ['\u2467 ON WHATSAPP',       'On WhatsApp, to +91'],
  ['\u246a pin sub-line',      'use this each time you open the circle'],
  ['\u246b setting up',        'Setting up your circle…'],
  ['\u246d ten digits',        "That doesn’t look like a 10-digit number."],
  ['\u246e unreachable invite', "We couldn’t reach the invite. Check your connection and try again."],
  ['\u246f generic toast',     "'Something went wrong. Try again.'"],
];
FROZEN_CLIENT.forEach(([label, byte]) =>
  ok(`§1 ${label} frozen`, J.includes(byte), 'the ratified byte is not in the source'));

// \u2461's shape, not just its words: C-8's line must survive the invitee-name
// append rather than be replaced by it.
ok('§1.13 \u2461 appends the invitee\u2019s name by comma, C-8\u2019s line intact',
  /invited you to her wedding circle\{inviteeName \? `, \$\{inviteeName\}` : ''\}\./.test(J));

// \u246f — ONE HOME. This byte stood at two identical call sites before D-5.
ok('§1.14 \u246f has one home and three callers, not three literals',
  /const TOAST_GENERIC =/.test(J) &&
  (J.match(/showToast\(TOAST_GENERIC\)/g) || []).length === 3 &&
  !/showToast\('Something went wrong\.'\)/.test(J));

// EXPECTED-ZEROS, stated so the record shows they were seen (E2).
ok('§1.15 E2 the house masthead is untouched',
  J.includes('The Dream Wedding') && J.includes('THE CURATED WEDDING OS'));

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · THE SUCCESS STEP — C-8\u2019s last clause finally has a surface');

ok('§2.1 the Step union gains its member',
  /type Step = [^;]*'success'[^;]*;/.test(J),
  'the union is unchanged; there is no success state to reach');

ok('§2.2 BOTH arrival arms land on it — neither pushes past the teaching',
  (J.match(/setStep\('success'\)/g) || []).length === 2 &&
  !/if \(d\.data\.pin_set\) \{\s*router\.push\('\/coplanner'\);/.test(J),
  'a member whose circle already has a PIN still skips the install lesson');

const FROZEN_SUCCESS = [
  ['\u2470 heading',   'You&rsquo;re in.'],
  ['\u2471 arrival',   'Welcome to {brideName}&rsquo;s wedding circle.'],
  ['\u2472 iOS',       'Tap Share, then Add to Home Screen — the circle opens like an app.'],
  ['\u2473 Android',   'Tap your browser menu, then Install — the circle opens like an app.'],
  ['\u3251 CTA',       'Go to the circle'],
];
FROZEN_SUCCESS.forEach(([label, byte]) =>
  ok(`§2 ${label} frozen`, J.includes(byte), 'the ratified byte is not in the source'));

// \u2471 rides data already in state. The kickoff asked for derive-before-adding
// and this cell holds that answer: exactly one network call fetches the name.
ok('§2.8 \u2471 adds no fetch — the bride\u2019s name is the validate response already in state',
  (J.match(/circle\/join\/validate/g) || []).length === 1 &&
  /Welcome to \{brideName\}/.test(J));

// The lesson is INLINE, never modal-begged (C-8's own word).
ok('§2.9 the teaching is inline — no modal, no dismissal, nothing to close',
  !/Modal|dialog|showInstallPrompt|beforeinstallprompt/i.test(J));

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · E5 — AN UNDETECTABLE PLATFORM IS TAUGHT NOTHING');

ok('§3.1 the teaching line is guarded on a KNOWN platform',
  /platform !== 'unknown' && \(/.test(J),
  'the install lesson renders where the gesture cannot be named — guessing');

ok('§3.2 \u2470 \u2471 \u3251 sit OUTSIDE that guard — arrival and CTA always render',
  (() => {
    const i = J.indexOf("platform !== 'unknown'");
    const g = J.indexOf('Go to the circle');
    const w = J.indexOf('Welcome to {brideName}');
    return i > 0 && w > 0 && w < i && g > i;
  })(),
  'the arrival or the CTA was swallowed by the platform guard');

ok('§3.3 platform is resolved in an effect, never at render',
  /useEffect\(\(\) => \{[\s\S]{0,600}?navigator\.userAgent/.test(J) &&
  /useState<Platform>\('unknown'\)/.test(J),
  'reading navigator at render mismatches on hydration; unknown must be the '
  + 'pre-hydration state so nothing is taught before we know');

ok('§3.4 iPadOS is not mistaken for a desktop Mac',
  /Macintosh/.test(J) && /ontouchend/.test(J));

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · THE MANIFEST — templated at serve time');

ok('§4.1 the route handler exists', exists(MANIFEST));
const M = exists(MANIFEST) ? code(MANIFEST) : '';

ok('§4.2 \u3252 name templates the bride\u2019s first name',
  /name:\s*first \? `\$\{first\}'s Wedding Circle` : FALLBACK_NAME/.test(M));
ok('§4.3 \u3253 short_name is what the home screen shows',
  /short_name: first \? `\$\{first\}'s Circle`\s*: FALLBACK_NAME/.test(M));
ok('§4.4 \u3254 description templates too',
  /description: first \? `Plan \$\{first\}'s wedding, together\.`/.test(M));
ok('§4.5 the fallback column is the ruled wording',
  /FALLBACK_NAME\s*=\s*'Wedding Circle'/.test(M) &&
  /FALLBACK_DESC\s*=\s*'Plan a wedding, together\.'/.test(M));
ok('§4.6 scope is /coplanner, not the house scope',
  /scope:\s*'\/coplanner'/.test(M) && /start_url:\s*'\/coplanner'/.test(M));

// \u3255 — BINDING. The estate's absent-identity sentinel is a SENTENCE; slicing
// a first name out of it puts "the's Wedding Circle" on a home screen.
ok('§4.7 \u3255 \u201cthe bride\u201d is detected as ABSENT identity, on the whole string',
  /ABSENT_SENTINEL\s*=\s*'the bride'/.test(M) &&
  /full\.toLowerCase\(\) === ABSENT_SENTINEL/.test(M));
ok('§4.8 \u3255 a pre-sliced article is refused too',
  /first\.toLowerCase\(\) === 'the'/.test(M));

// A BROKEN MANIFEST FETCH MUST NEVER BREAK INSTALL — there is no error arm.
ok('§4.9 the handler has one response shape and no failure arm',
  !/status:\s*[45]\d\d/.test(M) && !/throw /.test(M));

// THE SHARPEST EDGE IN THE RADIUS. `tdw07_f0766_orphan.proof.mjs` §5.4 pins the
// circle_session consumer set at exactly four files, comment-stripped. The
// handler stays out of that census entirely.
ok('§4.10 the handler NEVER names circle_session — the §5.4 set holds at four',
  !/circle_session/.test(M),
  'the consumer set has moved to five and f0766 §5.4 will redden');

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · THE LINK — minted by a lawful holder of the session');

const L = code(LAYOUT);
ok('§5.1 the coplanner layout links its own manifest',
  /<link rel="manifest" href=\{manifestHref\} \/>/.test(L));
ok('§5.2 identity rides the href, encoded',
  /\/coplanner\/manifest\?b=\$\{encodeURIComponent\(brideName\(session\)\)\}/.test(L));
ok('§5.3 the FULL name is passed — the handler owns \u3255, at one site',
  !/split\(/.test(L.split('manifestHref')[1] || ''),
  'the layout is slicing a first name; the sentinel check then reads "the"');
ok('§5.4 no session yields the house wording, not a broken href',
  /: '\/coplanner\/manifest'/.test(L));
ok('§5.5 the layout is still a lawful circle_session consumer',
  /const SESSION_KEY = 'circle_session'/.test(L));

// f1410's arithmetic ground — the FAB centres against this column.
ok('§5.6 the 480px content column is undisturbed',
  /maxWidth: 480, margin: '0 auto'/.test(L));

// ═══════════════════════════════════════════════════════════════════════════
sec('§6 · E3 — THE FOUR DEAD FALLBACKS ARE DELETED, NOT FROZEN');

// Freezing text no member can ever read is machinery waiting for a caller that
// never comes. The server always populates `error`.
// SEAT SELF-CATCH, and the cell is cut to say exactly what is true rather than
// what the sheet assumed. THREE of the four dead strings are simply gone. The
// fourth — 'Could not send code. Try again.' — stood at TWO sites in the
// pre-D-5 file: once as a `d.error ||` fallback (DEAD, and now deleted) and
// once as `sendOtp`'s network-failure catch (LIVE, and reachable whenever the
// door cannot be reached at all). The D-5 inventory conflated the two and
// counted the string once, so the live catch never reached the veto sheet and
// carries an UNRATIFIED byte. It is left standing rather than silently
// rewritten — the founder holds the copy veto and has not seen this line.
// §6.6 names it so it cannot hide inside a green.
const DEAD_FALLBACKS = [
  ['This invite link is invalid or has expired.', /d\.error \|\| 'This invite link is invalid or has expired\.'/],
  ['Could not send code. Try again.',             /d\.error \|\| 'Could not send code\. Try again\.'/],
  ['Verification failed.',                        /d\.error \|\| 'Verification failed\.'/],
  ['Could not set PIN.',                          /d\.error \|\| 'Could not set PIN\.'/],
];
DEAD_FALLBACKS.forEach(([label, re], i) =>
  ok(`§6.${i + 1} dead fallback gone: "${label}"`, !re.test(J)));
ok('§6.5 no `d.error ||` fallback survives on this surface',
  !/d\.error \|\|/.test(J));

// CURED, and the cell re-cut to prove the cure rather than to name the defect.
// The version of §6.6 that stood here asserted the DEFECT's presence, and when
// the fold landed it went RED with the message "either it was cured (re-cut
// this cell) or it drifted". That is the cell working: a bench guarding a known
// gap must notice the gap closing as loudly as it notices it widening.
//
// RULED 2026-08-14, after the sheet had closed: the catch is client-side
// failure BEFORE the server speaks — ⑯'s own class — so it takes ⑯'s
// already-approved byte and mints nothing. Giving it ㉝'s warmer server
// sentence was refused on arithmetic: that twins one string across two repos,
// the exact duplicate the one-home law exists to prevent, for a marginal gain
// on a rare network blip. ⑯ therefore has ONE home and THREE callers.
ok('§6.6 ⑯ absorbed the post-sheet miss — one home, three callers',
  (J.match(/showToast\(TOAST_GENERIC\)/g) || []).length === 3 &&
  !J.includes("showToast('Could not send code. Try again.')"),
  'the sendOtp catch is speaking its own wording again — the one-condition-'
  + 'two-wordings disease D-5 exists to cure, returning client-side')

// ═══════════════════════════════════════════════════════════════════════════
sec('§7 · TOKENS ONLY — the hex dies inside the radius');

ok('§7.1 the local GOLD is gone; the token is imported',
  !/const GOLD = '#C9A84C'/.test(J) &&
  /import \{ GOLD, INK, CREAM, MUTED, FONT_DISPLAY, FONT_BODY, FONT_EYEBROW \}/.test(J));

// The pinned import must survive VERBATIM — extending it would redden
// tdw07_f0772_circle §6.5, which is why the tokens arrive on their own line.
ok('§7.2 f0772 §6.5\u2019s pinned import line is untouched',
  J.includes("import { setCircleToken, circleAuthHeaders } from '../../../coplanner/CircleSessionContext';"));

// R-33.3 — counts what RENDERS. The one labelled survivor is named so the cell
// cannot over-convict it, and named EXPLICITLY so a second one cannot hide.
const RENDERED_HEX = (J.match(/#[0-9A-Fa-f]{6}/g) || []);
ok('§7.3 exactly one raw hex renders in the radius — the labelled no-token ground',
  RENDERED_HEX.length === 1 && RENDERED_HEX[0] === '#1A1715',
  `renders ${RENDERED_HEX.length}: ${RENDERED_HEX.join(', ')}`);

ok('§7.4 no font stack is retyped — the three FONT_ tokens are used',
  !/'Cormorant Garamond', serif/.test(J.replace(/@import[^;]+;/g, '')) &&
  /FONT_DISPLAY/.test(J) && /FONT_BODY/.test(J) && /FONT_EYEBROW/.test(J));

// ═══════════════════════════════════════════════════════════════════════════
sec('§8 · THE DRESSING IS OUT OF SCOPE — founder\u2019s \u300cskip it\u300d, 2026-08-14');

// F-14.18 stays OPEN WHOLE for Row 13's audience work. This cell guards a
// ruling, not a defect: the join screen keeps the unscoped catalogue on
// purpose, and a future seat "tidying" it must meet this rather than a comment.
ok('§8.1 the landing-slides call is untouched',
  /fetch\(`\$\{API_BASE\}\/api\/v2\/landing-slides`\)/.test(J));
ok('§8.2 no bride-collection asset home was minted here',
  !/BRIDE_SLIDES|brideCollection|FALLBACK_SLIDES/.test(J));

// ═══════════════════════════════════════════════════════════════════════════
sec('§9 · INSERTED AROUND THE REFUSED-EXCEPTION BLOCK, NEVER THROUGH IT');

// f0772 §9.5's three needles. The success step sits immediately after this
// block, which is exactly why it is worth a cell of our own.
ok('§9.1 no circleRefused on this page', !/circleRefused\(/.test(J));
ok('§9.2 the 401 ternary is intact', /sr\.status === 401 \? \{ success: false \}/.test(J));
ok('§9.3 the reason survives in the file', /mint and the guard disagree/.test(raw(JOIN)));
ok('§9.4 f0766 §3.2\u2019s four routes still drive the flow, in order',
  ['circle/join/validate', 'circle/join/send-otp', 'circle/join/accept', 'circle/join/set-pin']
    .every(r => J.includes(r)));
ok('§9.5 f0766 §3.4\u2019s circle_session write survives',
  /localStorage\.setItem\('circle_session'/.test(J));

// ═══════════════════════════════════════════════════════════════════════════
sec('§10 · BOTH WAYS — every claim above reddens on an uncured tree');

const MUTATIONS = [
  [JOIN, 'On WhatsApp, to +91', 'Sent to +91',
   '§1 \u2467 reverts to the pre-D-5 byte',
   (m) => m.includes('On WhatsApp, to +91')],
  [JOIN, "  const [platform, setPlatform]   = useState<Platform>('unknown');",
   "  const [platform, setPlatform]   = useState<Platform>('ios');",
   '§3.3 unknown stops being the pre-hydration state',
   (m) => /useState<Platform>\('unknown'\)/.test(m)],
  [MANIFEST, "const ABSENT_SENTINEL = 'the bride';",
   "const ABSENT_SENTINEL = '';",
   "§4.7 \u3255's sentinel is emptied — \"the's Wedding Circle\" becomes reachable",
   (m) => /ABSENT_SENTINEL\s*=\s*'the bride'/.test(m)],
  [LAYOUT, '<link rel="manifest" href={manifestHref} />',
   '<link rel="manifest" href="/manifest.json" />',
   '§5.1 the member key reverts to the house manifest',
   (m) => /<link rel="manifest" href=\{manifestHref\} \/>/.test(m)],
];

let proven = 0;
for (const [file, from, to, label, stillGreen] of MUTATIONS) {
  const original = raw(file);
  const originalSha = sha(original);
  const occurrences = original.split(from).length - 1;
  if (occurrences !== 1) {
    fail++;
    console.log(`  RED  §10 ${label} — target not unique on the final tree `
      + `(${occurrences}); R-33.4 refuses an ambiguous mutation`);
    continue;
  }
  try {
    fs.writeFileSync(path.join(ROOT, file), original.replace(from, to), 'utf8');
    if (stillGreen(code(file))) {
      fail++;
      console.log(`  RED  §10 ${label} — the cell stayed GREEN over the mutation; it is vacuous`);
    } else {
      proven++; pass++;
      console.log(`  ok   §10 ${label} — reddens on the uncured tree`);
    }
  } finally {
    fs.writeFileSync(path.join(ROOT, file), original, 'utf8');
    if (sha(raw(file)) !== originalSha) {
      console.log(`  RED  §10 RESTORE FAILED on ${file} — do not commit`);
      process.exit(1);
    }
  }
}
ok('§10.5 all four mutations proven non-vacuous', proven === 4, `${proven} of 4`);

// ═══════════════════════════════════════════════════════════════════════════
console.log(`\n${pass}/${pass + fail} cells green`);
process.exit(fail === 0 ? 0 : 1);
