'use strict';
// scripts/fe9_f44401_enquiry_session_bench.js · CE-47 · FE-9 · F-44.401, THE APP HALF.
// The Dreamer enquiry door (dream-os src/api/couple/enquire.js) trusted the BODY when no session came with the
// request: a posted couple_id named who she was and a posted name or phone rode along. Its only caller is
// components/frost/EnquirySheet.tsx. Now the sheet sends her couple-lane session as a Bearer header and nothing
// about who she is in the body; with no token it posts nothing and asks her to sign in. WEB-4's cut 18 (the server
// refusing an enquiry without a session) is held until this is live. Source only: no browser, no network, no timing.
//   1.1 the post to /api/v2/discover/enquire carries Authorization: Bearer <getAccessToken()>
//   1.2 the posted body names no couple_id, bride_name, bride_phone, name or phone
//   1.3 with no token the handler returns BEFORE the post, sets the sign-in line, and calls no onDone
//   1.4 the sign-in line and its link are on the sheet, in plain words
//   1.5 nothing else in the app posts to the Dreamer enquiry door
//   1.6 getAccessToken still refuses the vendor lane's token (the refusal this rests on)
// RED MUTATIONS (run by the seat, each restored by sha):
//   · put `couple_id:  coupleId,` back into the body                       -> 1.2
//   · drop the Authorization header                                       -> 1.1
//   · delete `if (!token) { setNeedsSignIn(true); return; }`              -> 1.3
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
let pass = 0; let fail = 0; const failed = [];
function ok(c, name, info) { if (c) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}${info === undefined ? '' : '  [' + String(info).slice(0, 300) + ']'}`); } }
const code = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');

const SHEET = 'components/frost/EnquirySheet.tsx';
const src = code(read(SHEET));
const sub = (() => { const i = src.indexOf('async function submit()'); return i < 0 ? '' : src.slice(i, src.indexOf('\n  return (', i)); })();
const at = sub.indexOf('fetch(`${API_BASE}/api/v2/discover/enquire`');
const call = at < 0 ? '' : sub.slice(at, sub.indexOf('});', at) + 3);
const body = (() => { const i = call.indexOf('JSON.stringify({'); return i < 0 ? '' : call.slice(i); })();

console.log('\n§1 the enquiry goes with her session, never with a name from the body');
ok(at >= 0 && /headers:\s*\{[^}]*Authorization:\s*`Bearer \$\{token\}`/.test(call) && /const token = getAccessToken\(\);/.test(sub)
   && /import \{[^}]*\bgetAccessToken\b[^}]*\} from '@\/lib\/frost-api\/_base'/.test(src),
   '1.1 the post carries Authorization: Bearer from getAccessToken()', call.slice(0, 200));
const named = ['couple_id', 'bride_name', 'bride_phone', 'name', 'phone'].filter((k) => new RegExp(`(^|[\\s{,])${k}\\s*:`).test(body));
ok(body !== '' && named.length === 0, '1.2 the body names no couple_id, bride_name, bride_phone, name or phone', named.join(' '));
const guard = sub.indexOf('if (!token) { setNeedsSignIn(true); return; }');
ok(guard >= 0 && at > guard && !/onDone\(/.test(sub.slice(0, at)), '1.3 with no token it returns before the post, sets the sign-in line, and calls no onDone');
ok(/const SIGN_IN_LINE\s*=\s*'Please sign in to send your enquiry\.';/.test(src) && /\{needsSignIn && \(/.test(src) && /\{SIGN_IN_LINE\}/.test(src) && /<a href="\/"[^>]*>\{SIGN_IN_WORD\}<\/a>/.test(src),
   '1.4 the sheet shows "Please sign in to send your enquiry." with a Sign in link');
const walk = (d) => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap((e) => {
  const p = `${d}/${e.name}`; if (e.isDirectory()) return e.name === 'node_modules' || e.name.startsWith('.') ? [] : walk(p);
  return /\.(tsx?|jsx?)$/.test(e.name) ? [p] : []; });
const callers = ['app', 'components', 'lib', 'v2'].filter((d) => fs.existsSync(path.join(ROOT, d))).flatMap(walk).filter((p) => /discover\/enquire/.test(code(read(p))));
ok(callers.length === 1 && callers[0] === SHEET, '1.5 the sheet is the only caller of the Dreamer enquiry door', callers.join(' '));
const base = code(read('lib/frost-api/_base.ts'));
ok(/export function getAccessToken\(\)[\s\S]{0,600}if \(fromStorage === vendorLaneToken\(\)\) return null;/.test(base), '1.6 getAccessToken refuses the vendor lane\u2019s token');

console.log(`\nfe9_f44401_enquiry_session: ${pass} pass, ${fail} fail`);
if (fail) { console.log('FAILED: ' + failed.join(' · ')); process.exit(1); }
