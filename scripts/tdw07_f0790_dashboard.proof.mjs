#!/usr/bin/env node
// scripts/tdw07_f0790_dashboard.proof.mjs
// F-07.90 at the DASHBOARD — six tiles that turned failures into confident zeros.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
let pass=0, fail=0;
const ok=(n,c)=>{ if(c){pass++;console.log(`  PASS  ${n}`);} else {fail++;console.log(`  FAIL  ${n}`);} };
const sec=t=>console.log(`\n${t}`);
function strip(src){let o='',i=0,q=null,ln=false,bl=false;
  while(i<src.length){const c=src[i],n=src[i+1];
    if(ln){if(c==='\n'){ln=false;o+=c;}i++;continue;}
    if(bl){if(c==='*'&&n==='/'){bl=false;i+=2;}else i++;continue;}
    if(q){o+=c;if(c==='\\'){o+=src[i+1]||'';i+=2;continue;}if(c===q)q=null;i++;continue;}
    if(c==="'"||c==='"'||c==='`'){q=c;o+=c;i++;continue;}
    if(c==='/'&&n==='/'){ln=true;i+=2;continue;}
    if(c==='/'&&n==='*'){bl=true;i+=2;continue;}
    o+=c;i++;}
  return o;}

const P = 'app/admin/page.tsx';
const raw = read(P), src = strip(raw);
const ARMS = ['vendors','couples','pending_photos','pending_discover','unused_invites','new_requests'];

sec('§0 · CANARY');
{
  ok('§0.1 comment prose is removed', !src.includes('quiet Tuesday'));
  ok('§0.2 CANARY: the component survives stripping', /export default function AdminDashboard/.test(src));
  ok('§0.3 VACUITY TWIN: the stripper is not a no-op', src.length < raw.length);
}

sec('§1 · NO ARM INVENTS AN EMPTY COLLECTION ANY MORE');
{
  ok('§1.1 zero `.catch(() => ({ ... }))` empty-payload arms survive in code',
     !/\.catch\(\(\)\s*=>\s*\(\{/.test(src));
  ok(`§1.2 CANARY: the retired shape IS still quoted in the cure comment (F-06.85)`,
     /\.catch\(\(\) => \(\{ requests: \[\] \}\)\)/.test(raw));
  ok('§1.3 every arm now fails to a SENTINEL', (src.match(/\.catch\(\(\)\s*=>\s*FAILED\)/g) || []).length === 6);
  ok('§1.4 the sentinel is a Symbol — indistinguishable from no real payload',
     /const FAILED = Symbol\(/.test(src));
  ok('§1.5 the raw fetch arm now CHECKS res.ok — a 401 body is not a payload',
     /if \(!r\.ok\) throw new Error/.test(src));
}

sec('§2 · A FAILED ARM RENDERS UNKNOWN, NEVER ZERO');
for (const a of ARMS) {
  ok(`§2.${a}.a the stat is null on failure, never 0`,
     new RegExp(`${a}:\\s*failed\\(\\w\\)\\s*\\?\\s*null`).test(src));
  ok(`§2.${a}.b its tile renders UNKNOWN_VALUE when null`,
     new RegExp(`value=\\{stats\\.${a} \\?\\? UNKNOWN_VALUE\\}`).test(src));
  ok(`§2.${a}.c its sub-label says so, rather than keeping a confident caption`,
     new RegExp(`stats\\.${a} === null \\? UNKNOWN_SUB`).test(src));
}

sec('§3 · ZERO SURVIVES AS AN HONEST ANSWER (non-vacuity of the cure)');
{
  ok('§3.1 a SUCCESSFUL empty list still yields 0, not UNKNOWN', /\?\?\s*0\)/.test(src));
  ok('§3.2 the distinction is stated in-file, not left to a reader to infer',
     /`0` is an ANSWER/.test(raw) || /is an ANSWER/.test(raw));
  ok('§3.3 F-06.85: the cure names F-07.91, the mechanism that made the lie visible',
     /F-07\.91/.test(raw));
}

sec('§4 · COPY — the two new bytes are named and flagged');
{
  ok('§4.1 exactly one UNKNOWN_VALUE constant', (raw.match(/const UNKNOWN_VALUE = /g)||[]).length === 1);
  ok('§4.2 exactly one UNKNOWN_SUB constant',   (raw.match(/const UNKNOWN_SUB   = /g)||[]).length === 1);
  ok('§4.3 marked VETO PENDING in-file', /VETO PENDING/.test(raw));
  ok('§4.4 neither string is inlined in the JSX', !/sub="Could not load"/.test(src));
  ok('§4.5 the six frozen tile labels are unchanged',
     ['Makers','Dreamers','Photo Queue','Discover Queue','Open Invites','New Requests']
       .every(l => raw.includes(`label="${l}"`)));
}

console.log(`\n════════  ${pass} passed, ${fail} failed  ════════`);
process.exit(fail === 0 ? 0 : 1);
