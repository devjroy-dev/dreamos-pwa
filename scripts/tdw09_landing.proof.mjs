#!/usr/bin/env node
// scripts/tdw09_landing.proof.mjs — TDW_09 · O-1 — THE SINGLE LANDING CURE
//
// Runnable from ANY working directory (ROOT resolved from import.meta.url, never cwd).
//
// WHY THIS FILE EXISTS. `app/(landing)/page.tsx` is the estate's front door and it has
// had ZERO cells its whole life. Every other surface this block touched arrived with a
// bench already over it; the one screen every visitor sees first arrived with none. The
// floor's only "landing" bench (`tdw08_p3_landing.proof.mjs`) targets the DEMO tease
// landing and does not reference this file once — a name-match that read as coverage.
//
// EVERY §M CELL IS BOTH-WAYS: it mutates PRODUCTION SOURCE — never test setup — asserts
// the cell goes RED at the broken tree, restores the file, and asserts byte-identity.
// Every anchor is asserted to appear EXACTLY ONCE before the replace (CE-127).
//
// THE COMMENT-BLINDNESS LAW BINDS EVERY CELL HERE. This cure's whole method is deleting
// screens and then EXPLAINING in comments what was deleted and why — so a raw grep for
// `request_who` reds over a correctly cured tree, on the note recording its removal.
// That is the exact inversion of the disease. Every textual cell strips comments first.
//
// WHAT THIS BENCH DOES NOT ASSERT, named rather than silently absent (floor-method law):
//   · NO cell over rendered pixels or baseline geometry. R-X24's acceptance is the
//     founder's two re-shot photographs; a container with no browser and no fonts can
//     assert the RULE is applied (baseline · shared line-height · fixed glyph slot) and
//     nothing about where a baseline actually lands. The cells below assert the rule.
//   · NO cell over the OTP round trip, provisioning, or session minting. Those are
//     dream-os's and are proven there; this sitting moved zero backend bytes.
//   · NO device-matrix cell. iOS Safari / Android Chrome / the Instagram in-app browser
//     ride the founder's walk, declared.

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const strip = (s) => s
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')   // JSX comment blocks — this cure is full of them
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');
const code = (rel) => strip(read(rel));

let pass = 0, fail = 0;
const H = (s) => console.log(`\n══ ${s} ══`);
function ok(name, cond, msg) {
  try { assert.ok(cond, msg || 'assertion failed'); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n        ${e.message}`); fail++; }
}
function okMutate(name, rel, anchor, replacement, predicate, label) {
  try { mutate(rel, anchor, replacement, predicate, label); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n        ${e.message}`); fail++; }
}
function mutate(rel, anchor, replacement, predicate, label) {
  const abs = path.join(ROOT, rel);
  const original = fs.readFileSync(abs, 'utf8');
  const hits = original.split(anchor).length - 1;
  assert.strictEqual(hits, 1, `anchor must appear EXACTLY ONCE in ${rel} (found ${hits})`);
  try {
    fs.writeFileSync(abs, original.replace(anchor, replacement), 'utf8');
    let red = false;
    try { predicate(); } catch { red = true; }
    assert.ok(red, `${label}: stayed GREEN over broken production code — it proves nothing`);
  } finally {
    fs.writeFileSync(abs, original, 'utf8');
    assert.strictEqual(fs.readFileSync(abs, 'utf8'), original, `${rel} not restored byte-identically`);
  }
}

const LANDING = 'app/(landing)/page.tsx';
const LAYOUT  = 'app/layout.tsx';
const FEED    = 'app/(landing)/discover/DiscoverFeed.tsx';
const CENSUS  = 'scripts/tdw09_surface_census.mjs';
const L = code(LANDING);

// ═════════════════════════════════════════════════════════════════════════════
H('§0 · THE INSTRUMENT IS POINTED AT SOMETHING — no vacuous run');

ok('§0.1 the landing file was found and is substantial',
  L.length > 10000, `landing source is ${L.length} chars after stripping`);

ok('§0.2 the comment strip WORKS — this cure explains its deletions in comments, and a '
 + 'raw grep would red on the explanation',
  /request_who/.test(read(LANDING)) && !/request_who/.test(L),
  'either the removal notes are gone, or the strip is not stripping — both make every cell below a lie');

// ═════════════════════════════════════════════════════════════════════════════
H('§1 · L-B · TWO DOORS, AND THE CEREMONY IS GONE (R-O3 · R-X10 arm (a))');

const SCREEN_UNION = L.slice(L.indexOf('type Screen ='), L.indexOf('type Role'));

ok('§1.1 the screen union declares EXACTLY SIX screens',
  (SCREEN_UNION.match(/\|\s*'[a-z_]+'/g) || []).length === 6,
  `union declares ${(SCREEN_UNION.match(/\|\s*'[a-z_]+'/g) || []).length}: ${SCREEN_UNION.match(/'[a-z_]+'/g)}`);

for (const dead of ['request_who', 'request_dreamer', 'request_maker', 'request_done', 'invite_code']) {
  ok(`§1.2 \`${dead}\` is gone from the machine entirely`,
    !new RegExp(dead).test(L), `${dead} still reachable in code`);
}

ok('§1.3 the two doors are present, byte-exact, founder-ratified (R-O11 #3)',
  /I&apos;m getting married/.test(read(LANDING)) && /I&apos;m a wedding vendor/.test(read(LANDING)));

ok('§1.4 the VENDOR door wears the gold fill and the couple door does not (R-O11 #3)',
  /background: '#C9A84C', border: 'none',[\s\S]{0,400}I&apos;m a wedding vendor/.test(read(LANDING)) &&
  /background: 'transparent',[\s\S]{0,400}I&apos;m getting married/.test(read(LANDING)),
  'the gold moved off the vendor door, or onto both');

ok('§1.5 the couple door leads with the PRODUCT — it starts the fold, it does not ask for a phone',
  /setRole\('Dreamer'\); startExploring\(\);/.test(L),
  'the couple door goes straight to a field — R-X7 and Fork 1(a) both say otherwise');

ok('§1.6 the vendor door goes straight to the join screen',
  /setRole\('Maker'\); setScreen\('join_phone'\);/.test(L));

ok('§1.7 the collapsed entry strip is REMOVED BY RULING — the panel opens expanded',
  !/entryExpanded/.test(L), 'the tap-to-expand state survived; five decisions are still five');

ok('§1.8 `Just exploring` is no longer a peer choice',
  !/Just exploring/.test(L));

ok('§1.9 THE CEREMONY WRITES NOTHING — waitlist/signup has zero callers on this surface',
  !/waitlist\/signup/.test(L),
  'the request-invite POST survived; the dream-os T3-3 tail is still gated');

// ═════════════════════════════════════════════════════════════════════════════
H('§2 · THE OPEN DOOR — an unrecognised number is admitted, never diverted');

ok('§2.1 the verify-otp path no longer diverts an unknown number into a request form',
  !/No account found\. Request an invite to join\./.test(read(LANDING)),
  'the divert toast survived — the ceremony still catches people the open path would admit');

ok('§2.2 the sign-in path no longer diverts either, and PROCEEDS instead',
  !/No account found — request an invite to join\./.test(read(LANDING)) &&
  /if \(!d\.ok \|\| !d\.exists\) \{ sendOtp\(phone\); return; \}/.test(L),
  'the returning path still turns an unrecognised number away');

ok('§2.3 a genuine provisioning failure is still reported AS a failure, not as exclusivity',
  /if \(!userId \|\| !roleId\) \{ showToast\('Could not complete sign-in\.'\); return; \}/.test(L),
  'a failed write is being reported as something other than a failed write');

// ═════════════════════════════════════════════════════════════════════════════
H('§3 · R-O4 · THE MACHINE STOPS CARRYING THE GATE\'S VOCABULARY');

for (const gone of ["'invite_phone'", "'invite_otp'", 'inviteName', 'inviteCategory', 'inviteCode', 'inviteError']) {
  ok(`§3.1 \`${gone}\` is gone`, !L.includes(gone), `${gone} survived the rename`);
}
ok('§3.2 the renamed states are wired end to end',
  /'join_phone'/.test(L) && /'join_otp'/.test(L) && /joinName/.test(L) && /joinCategory/.test(L));

ok('§3.3 ZERO RENDERED BYTES MOVED WITH THE RENAME — greppable, per R-O4',
  /Welcome\. Let’s begin\./.test(read(LANDING)) &&
  /Enter your details\. We’ll send a code to your WhatsApp\./.test(read(LANDING)) &&
  /Check your messages\./.test(read(LANDING)) &&
  /Enter the 6-digit code we sent you\./.test(read(LANDING)) &&
  /Send code →/.test(read(LANDING)) && /Verify →/.test(read(LANDING)) &&
  /Resend code/.test(read(LANDING)) && /Welcome back\./.test(read(LANDING)),
  'a rendered byte changed under a rename that was ruled to move none');

// ═════════════════════════════════════════════════════════════════════════════
H('§4 · THE SIGN-IN ROLE TRAP IS STILL SHUT (R-O3, ruled with Fork 1)');

ok('§4.1 the role toggle SURVIVES on the sign-in screen',
  /\(\['Dreamer', 'Maker'\] as Role\[\]\)\.map/.test(L),
  'the toggle was removed — chrome Sign in reaches this screen with role null');

ok('§4.2 the `!role` guard survives on the sign-in submit',
  /onClick=\{handleSignIn\} disabled=\{phone\.length < country\.maxDigits \|\| !role\}/.test(L),
  'a null-role sign-in can now be submitted, and handleSignIn would treat it as a couple');

ok('§4.3 the trap this guards is real — handleSignIn still derives vendor-ness from role',
  /const isVendor = role === 'Maker';[\s\S]{0,600}auth\/pin-status/.test(L),
  'the derivation moved; re-read whether the guard above is still the right guard');

// ═════════════════════════════════════════════════════════════════════════════
H('§5 · R-O9 · THE ROLE-FROM-QUERY READ, AND ITS HONEST DEGRADATION');

ok('§5.1 the param is named `role` and is read from the query string',
  /new URLSearchParams\(window\.location\.search\)\.get\('role'\)/.test(L));

ok('§5.2 EXACTLY TWO values move anything — couple and vendor',
  /q === 'couple'/.test(L) && /q === 'vendor'/.test(L) &&
  (L.match(/q === '[a-z]+'/g) || []).length === 2,
  'a third branch appeared, or one of the two is gone');

ok('§5.3 an unrecognised value DEGRADES TO THE PLAIN DOOR — no else, no throw, no default role',
  !/else\s*\{[\s\S]{0,120}setRole\(/.test(L.slice(L.indexOf("get('role')"), L.indexOf("get('role')") + 500)),
  'an unrecognised query value picks a role silently — R-O9 forbids exactly this');

ok('§5.4 the couple value enters the FOLD, not a field (R-X7 couple-first)',
  /q === 'couple'\) \{ setRole\('Dreamer'\); setScreen\('exploring'\); \}/.test(L));

// ═════════════════════════════════════════════════════════════════════════════
H('§6 · F-09.17 · THE FEED\'S EXIT LANDS SOMEWHERE REAL (R-O2)');

ok('§6.1 the dead route is gone from the feed',
  !/\/auth\/signup/.test(code(FEED)),
  'the nudge still navigates to a route that has never existed');

ok('§6.2 it now enters the landing with the couple door chosen',
  /window\.location\.href = "\/\?role=couple"/.test(code(FEED)));

ok('§6.3 THE TARGET RESOLVES — `app/auth` really does not exist, and `app/(landing)` does',
  !fs.existsSync(path.join(ROOT, 'app/auth')) &&
  fs.existsSync(path.join(ROOT, 'app/(landing)/page.tsx')),
  'the route topology changed under this cell; re-derive the target');

// ═════════════════════════════════════════════════════════════════════════════
H('§7 · R-O11 · THE FOUNDER\'S BYTES');

ok('§7.1 ONE positioning line, and it is his',
  /The Wedding OS/.test(read(LANDING)) &&
  !/THE CURATED WEDDING OS<\/p>/.test(read(LANDING)) &&
  !/India&apos;s First Wedding OS<\/p>/.test(read(LANDING)) &&
  !/India's First Wedding OS<\/p>/.test(read(LANDING)),
  'a retired positioning line is still rendered somewhere');

ok('§7.2 it reaches the THIRD home too — the document description meta',
  /description: 'The Wedding OS'/.test(code(LAYOUT)),
  'layout.tsx still describes the product with a retired line');

ok('§7.3 the tagline\'s RENDERED bytes are byte-identical — untouched by ruling',
  /Not just happily married\./.test(read(LANDING)) &&
  /Getting married\{' '\}/.test(read(LANDING)) &&
  />happily\.<\/span>/.test(read(LANDING)));

ok('§7.4 the zero-reader MOTTO const is deleted, and the rendered tagline did not go with it',
  !/const MOTTO/.test(read(LANDING)),
  'the dead const survived — two homes for a byte the founder owns');

ok('§7.5 the pitch line ships HIS byte, verbatim, capital C included',
  /Every vendor on TDW is Curated/.test(read(LANDING)),
  'the founder\'s own byte was normalised, re-punctuated, or replaced');

ok('§7.6 the invite question died with the ceremony',
  !/Interested in an invite/.test(read(LANDING)));

// ═════════════════════════════════════════════════════════════════════════════
H('§8 · THE DEATH ROSTER — 57 sites, and none of them survived');

// Roster-driven, not eyeballed: every distinct rendered byte the read-first listed as
// dying. A string that reappears on this surface reds here by name.
const ROSTER = [
  'Request an invite.', 'Enter your invite.', 'Your code unlocks access.', 'Invite code',
  'Select Dreamer or Maker and enter your code.', 'Invalid or expired code.',
  'Could not verify code. Try again.', 'Request invite', 'Request an Invite →',
  'Request Invite →', 'Planning a wedding', 'A wedding professional',
  'Your details.', 'Full name', 'Business / studio name', 'Your name or studio',
  '@yourhandle', 'Open IG →', 'Wedding date', 'Yes — I know the date',
  'Roughly — a season', 'Just browsing',
  'Helps us recommend Makers available around your dates.',
  'Tell us your speciality', 'e.g. Mehndi artist', 'Received.',
  'We verify every profile personally.', 'Made a mistake? Edit your details',
  'Details updated.', 'Could not submit. Try again.',
  'Jan – Mar', 'Apr – Jun', 'Jul – Sep', 'Oct – Jan',
  'Photographer', 'MUA', 'Jeweller', 'Decorator', 'Choreographer',
];
// BOUNDARY-AWARE, and this is not pedantry: the first run of this cell reported
// `Jeweller` surviving, because the SURVIVING craft chip reads `Jewellery` and a
// substring test cannot tell a dead label from a live one that contains it. A roster
// cell that reds on a healthy tree gets deleted by the next reader, which is how a
// roster stops guarding anything. Matched on word boundaries instead.
const survives = (s) => new RegExp(`(^|[^A-Za-z])${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-z]|$)`).test(code(LANDING));
const survivors = ROSTER.filter(survives);
ok('§8.1 ZERO roster strings survive in code',
  survivors.length === 0, `still rendered: ${survivors.join(' | ')}`);

ok('§8.2 the roster is non-empty and non-trivial — a zero-length roster would pass vacuously',
  ROSTER.length >= 35, `roster carries only ${ROSTER.length} entries`);

ok('§8.3 the THREE SHARED bytes live on, on the screens that kept them',
  /Are you a:/.test(read(LANDING)) && /Continue →/.test(read(LANDING)) &&
  /00000 00000/.test(read(LANDING)),
  'a byte shared with a surviving screen was deleted with the ceremony');

// ═════════════════════════════════════════════════════════════════════════════
H('§9 · R-O5 · THE R-X24 ROW RULE AT BOTH ACCEPTANCE SHOTS');

const rows = L.match(/alignItems: 'baseline', borderBottom/g) || [];
ok('§9.1 BOTH phone rows align on baseline, not centre',
  rows.length === 2, `found ${rows.length} baseline phone rows, expected 2`);

ok('§9.2 no phone row is left on centre alignment',
  !/alignItems: 'center', borderBottom/.test(L),
  'a country-code row still centres its line-boxes — the ~1px is still there');

ok('§9.3 the shared line-height reaches BOTH the dial code and the digits',
  (L.match(/lineHeight: ROW_LINE_HEIGHT/g) || []).length === 4,
  `expected 4 line-height applications (2 rows x dial code + input), found ${(L.match(/lineHeight: ROW_LINE_HEIGHT/g) || []).length}`);

ok('§9.4 the flag sits in a FIXED SQUARE SLOT, out of text alignment entirely',
  /function FlagSlot/.test(L) && (L.match(/<FlagSlot flag=\{country\.flag\} \/>/g) || []).length === 2 &&
  /width: 20, height: 20, flexShrink: 0/.test(L),
  'the flag still participates in text alignment, where no rule can reach its box');

ok('§9.5 the rule is applied INLINE — no canon primitive was minted under this charter (R-O5)',
  !fs.existsSync(path.join(ROOT, 'components/canon/Row.tsx')),
  'the canon Row primitive was minted here; its home is the canon sitting');

// ═════════════════════════════════════════════════════════════════════════════
H('§10 · R-O6 · THE HOLD IS DOCUMENTED IN THE FILES IT GOVERNS');

const DEMO = 'app/demo/vendor/[handle]/page.tsx';

ok('§10.1 the demo landing carries its hold decision, naming the PIN as the mechanism',
  /ThemeProvider pinned="dark"/.test(read(DEMO)) &&
  /THE MECHANISM THAT MAKES THIS SAFE/.test(read(DEMO)),
  'the demo landing has no decision comment — the reasoning lives only in a deletable array');

ok('§10.2 it names the TRIGGER that reopens it (F-06.85 shape)',
  /THE TRIGGER THAT REOPENS THIS/.test(read(DEMO)));

ok('§10.3 the landing carries its own, naming the ABSENT provider as its mechanism',
  /THE MECHANISM THAT GUARDS THEM/.test(read(LANDING)) &&
  /THE TRIGGER THAT REOPENS THIS/.test(read(LANDING)));

ok('§10.4 the landing\'s stated guard is TRUE — its route group really has no provider',
  // COMMENT-STRIPPED, and the first run of this cell proved why: the hold comment this
  // very sitting wrote into the landing NAMES `ThemeProvider` as the thing that is
  // absent, so a raw read reds on the sentence recording the absence. The disease's
  // exact inversion, caught by the bench on its own tree.
  !/ThemeProvider/.test(code('app/(landing)/layout.tsx')) && !/ThemeProvider/.test(code(LANDING)),
  'a ThemeProvider reached this group; the hold comment is now false and the sites are live defects');

ok('§10.5 the demo landing\'s literals were HELD, not migrated',
  /rgba\(248,247,245,0\.42\)/.test(read(DEMO)) && /rgba\(248,247,245,0\.2\)/.test(read(DEMO)),
  'the two founder-ratified ghost edges were migrated after all');

ok('§10.6 the census holds BOTH files and its lane now includes the landing',
  /'app\/demo\/vendor\/\[handle\]\/page\.tsx',/.test(read(CENSUS)) &&
  /'app\/\(landing\)\/page\.tsx',/.test(read(CENSUS)) &&
  /'app\/\(landing\)'/.test(read(CENSUS)),
  'the landing lane is invisible to the census again, or a hold was dropped');

// ═════════════════════════════════════════════════════════════════════════════
H('§11 · R-O7 · THE LANDING OWNS ITS BROWSER CHROME');

ok('§11.1 the pre-hydration script has a landing branch',
  /isLanding/.test(read(LAYOUT)) && /LANDING_BG='#0C0A09'/.test(read(LAYOUT)));

ok('§11.2 the branch matches the lane and nothing else',
  /path==='\/'\|\|path\.indexOf\('\/discover'\)===0\|\|path\.indexOf\('\/about'\)===0/.test(read(LAYOUT)));

ok('§11.3 the static default is UNTOUCHED — four other lanes inherit it',
  /<meta name="theme-color" content="#1E0A0E" \/>/.test(read(LAYOUT)),
  'the default moved; /demo, /circle, /crew and /privacy just changed chrome under a landing charter');

ok('§11.4 the value the landing claims is the surface it actually paints',
  /LANDING_BG='#0C0A09'/.test(read(LAYOUT)) && /background: '#0C0A09'/.test(L),
  'the chrome colour and the page colour disagree');

// ═════════════════════════════════════════════════════════════════════════════
H('§M · MUTATIONS OVER PRODUCTION SOURCE — RED AT THE BROKEN TREE, BOTH WAYS');

okMutate('§M.1 §1.5 reds if the couple door asks for a phone instead of showing work',
  LANDING, "setRole('Dreamer'); startExploring();", "setRole('Dreamer'); setScreen('join_phone');",
  () => assert.ok(/setRole\('Dreamer'\); startExploring\(\);/.test(code(LANDING))), '§1.5');

okMutate('§M.2 §1.4 reds if the gold moves off the vendor door',
  LANDING, "width: '100%', height: 48, background: '#C9A84C', border: 'none',",
  "width: '100%', height: 48, background: 'transparent', border: 'none',",
  () => assert.ok(/background: '#C9A84C', border: 'none',[\s\S]{0,400}I&apos;m a wedding vendor/.test(read(LANDING))), '§1.4');

okMutate('§M.3 §2.2 reds if the returning path turns an unknown number away again',
  LANDING, "if (!d.ok || !d.exists) { sendOtp(phone); return; }",
  "if (!d.ok || !d.exists) { return; }",
  () => assert.ok(/if \(!d\.ok \|\| !d\.exists\) \{ sendOtp\(phone\); return; \}/.test(code(LANDING))), '§2.2');

okMutate('§M.4 §4.2 reds if the null-role sign-in guard is dropped',
  LANDING, "onClick={handleSignIn} disabled={phone.length < country.maxDigits || !role}",
  "onClick={handleSignIn} disabled={phone.length < country.maxDigits}",
  () => assert.ok(/disabled=\{phone\.length < country\.maxDigits \|\| !role\}/.test(code(LANDING))), '§4.2');

okMutate('§M.5 §5.3 reds if an unrecognised query value starts picking a role',
  LANDING, "else if (q === 'vendor') { setRole('Maker'); setScreen('join_phone'); }",
  "else if (q === 'vendor') { setRole('Maker'); setScreen('join_phone'); }\n    else { setRole('Dreamer'); }",
  () => {
    const c = code(LANDING);
    const w = c.slice(c.indexOf("get('role')"), c.indexOf("get('role')") + 500);
    assert.ok(!/else\s*\{[\s\S]{0,120}setRole\(/.test(w));
  }, '§5.3');

okMutate('§M.6 §6.1 reds if the feed goes back to the route that does not exist',
  FEED, 'window.location.href = "/?role=couple";', 'window.location.href = "/auth/signup";',
  () => assert.ok(!/\/auth\/signup/.test(code(FEED))), '§6.1');

okMutate('§M.7 §7.1 reds if a retired positioning line comes back',
  LANDING, "}}>The Wedding OS</p>\n                </div>",
  "}}>THE CURATED WEDDING OS</p>\n                </div>",
  () => assert.ok(!/THE CURATED WEDDING OS<\/p>/.test(read(LANDING))), '§7.1');

okMutate('§M.8 §7.5 reds if the founder\'s pitch byte is "tidied"',
  LANDING, 'Every vendor on TDW is Curated', 'Every vendor on TDW is curated.',
  () => assert.ok(/Every vendor on TDW is Curated/.test(read(LANDING))), '§7.5');

okMutate('§M.9 §8.1 reds if a roster string reappears on the surface',
  LANDING, '>Resend code</button>', '>Resend code</button>{/*x*/}<span>Request an Invite →</span>',
  () => assert.ok(ROSTER.filter(s => code(LANDING).includes(s)).length === 0), '§8.1');

okMutate('§M.10 §9.2 reds if a phone row returns to centre alignment',
  LANDING, "<div style={{ display: 'flex', alignItems: 'baseline', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: 12 }}>\n                  <button onClick={() => setShowCountrySheet(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 10px 0 0', borderRight: '1px solid rgba(255,255,255,0.2)', marginRight: 10, display: 'flex', alignItems: 'baseline', gap: 6, touchAction: 'manipulation', whiteSpace: 'nowrap' }}>\n                    <FlagSlot flag={country.flag} />\n                    <span style={{ fontFamily: \"'DM Sans', sans-serif\", fontSize: 13, lineHeight: ROW_LINE_HEIGHT, color: 'rgba(248,247,245,0.5)' }}>{country.dialCode}</span>\n                  </button>\n                  <input value={phone} onChange={e => setPhone(e.target.value.replace(/\\D/g, '').slice(0, country.maxDigits))} type=\"tel\" maxLength={country.maxDigits} placeholder=\"00000 00000\" style={{ ...INPUT, borderBottom: 'none', marginBottom: 0, flex: 1, lineHeight: ROW_LINE_HEIGHT }} />\n                </div>\n                {role === 'Maker' && (",
  "<div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: 12 }}>\n                </div>\n                {role === 'Maker' && (",
  () => {
    const c = code(LANDING);
    assert.ok(!/alignItems: 'center', borderBottom/.test(c) && (c.match(/alignItems: 'baseline', borderBottom/g) || []).length === 2);
  }, '§9.2');

okMutate('§M.11 §10.4 reds if a ThemeProvider reaches the landing and the hold comment goes stale',
  'app/(landing)/layout.tsx', 'export default function LandingLayout',
  '// ThemeProvider\nexport default function LandingLayout',
  () => assert.ok(!/ThemeProvider/.test(read('app/(landing)/layout.tsx'))), '§10.4');

okMutate('§M.12 §10.5 reds if the held demo edges get migrated after all',
  'app/demo/vendor/[handle]/page.tsx', "border:'0.5px solid rgba(248,247,245,0.42)'",
  "border:'0.5px solid var(--atelier-input-border)'",
  () => assert.ok(/rgba\(248,247,245,0\.42\)/.test(read('app/demo/vendor/[handle]/page.tsx'))), '§10.5');

okMutate('§M.13 §11.3 reds if the static theme-color default is moved under this charter',
  LAYOUT, '<meta name="theme-color" content="#1E0A0E" />', '<meta name="theme-color" content="#0C0A09" />',
  () => assert.ok(/<meta name="theme-color" content="#1E0A0E" \/>/.test(read(LAYOUT))), '§11.3');

okMutate('§M.14 §1.9 reds if the ceremony\'s write comes back',
  LANDING, 'const showToast = (m: string)',
  "const _x = () => fetch(`${API_BASE}/api/v2/waitlist/signup`);\n  const showToast = (m: string)",
  () => assert.ok(!/waitlist\/signup/.test(code(LANDING))), '§1.9');

// ═════════════════════════════════════════════════════════════════════════════
console.log(`\n${fail === 0 ? 'GREEN' : 'RED'} — tdw09_landing ${pass}/${pass + fail}\n`);
process.exit(fail === 0 ? 0 : 1);
