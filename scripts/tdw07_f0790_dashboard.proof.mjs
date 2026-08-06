#!/usr/bin/env node
// scripts/tdw07_f0790_dashboard.proof.mjs
// F-07.90 at the DASHBOARD — RETIRED WITH ITS SUBJECT (F-10.31, TDW_10 P3).
//
// ═════════════════════════════════════════════════════════════════════════════
// THE RETIREMENT, AND WHY IT TOOK THREE SITTINGS TO LAND
// ═════════════════════════════════════════════════════════════════════════════
// This bench pinned `app/admin/page.tsx`'s SIX-TILE DASHBOARD and the four-arm
// client fan-out behind it. TDW_10 P2 replaced that page with the Bridge, so the
// subject of §1–§4 below stopped existing at pwa `33f7c1d`.
//
// P2's executor found the bench ALREADY RED at the pristine tree (28 passed, 9
// failed — P1's invite-room deletion had reddened `unused_invites` and
// `new_requests` and nobody had declared it), refused to re-aim a sealed
// instrument unilaterally, and proposed the disposition. CE-200 RATIFIED it:
// the §1/§2 anchors retire with their subject, the LAW they protect is
// re-asserted in its new home, and the anchors are recorded verbatim "in
// whatever ZIP performs the retirement."
//
// NOBODY PERFORMED IT. P2's own ZIP retired the subject and carried no
// retirement, so this instrument spent a whole phase pinning a screen that did
// not exist — a permanent red that trains the next executor to skip a bench.
// The standing lesson entered at CE-201 in the chair's words: A RATIFIED
// DISPOSITION SHIPS WITH A NAMED CARRIER OR IT HAS NOT BEEN RATIFIED. This ZIP
// is the named carrier.
//
// ═════════════════════════════════════════════════════════════════════════════
// WHERE THE LAW LIVES NOW — never-a-false-zero is not retired, only re-homed
// ═════════════════════════════════════════════════════════════════════════════
// `scripts/tdw10_p2_bridge.proof.mjs` §3 asserts the identical property on the
// surface that replaced this one: a failed arm renders a labelled honest state,
// never 0; the "Could not load" label; and the third rendering the old page had
// no need for — all mutation-proven at that bench's M2. The Bridge endpoint
// carries it server-side as well (`dream-os src/api/admin/bridge.js`).
//
// ═════════════════════════════════════════════════════════════════════════════
// THE RETIRED ANCHORS, VERBATIM — recorded per CE-200's ratification
// ═════════════════════════════════════════════════════════════════════════════
// A retirement that paraphrases what it retires leaves the next reader unable to
// judge whether the property really moved. These are the cells as they stood:
//
//   §1 · NO ARM INVENTS AN EMPTY COLLECTION ANY MORE
//     §1.1 zero `.catch(() => ({ ... }))` empty-payload arms survive in code
//          !/\.catch\(\(\)\s*=>\s*\(\{/.test(src)
//     §1.2 CANARY: the retired shape IS still quoted in the cure comment (F-06.85)
//          /\.catch\(\(\) => \(\{ requests: \[\] \}\)\)/.test(raw)
//     §1.3 every arm now fails to a SENTINEL
//          (src.match(/\.catch\(\(\)\s*=>\s*FAILED\)/g) || []).length === 6
//     §1.4 the sentinel is a Symbol — indistinguishable from no real payload
//          /const FAILED = Symbol\(/.test(src)
//     §1.5 the raw fetch arm now CHECKS res.ok — a 401 body is not a payload
//          /if \(!r\.ok\) throw new Error/.test(src)
//
//   §2 · A FAILED ARM RENDERS UNKNOWN, NEVER ZERO   (six arms × three cells)
//     ARMS = ['vendors','couples','pending_photos','pending_discover',
//             'unused_invites','new_requests']
//     §2.<arm>.a  `${arm}:\s*failed\(\w\)\s*\?\s*null`
//     §2.<arm>.b  `value=\{stats\.${arm} \?\? UNKNOWN_VALUE\}`
//     §2.<arm>.c  `stats\.${arm} === null \? UNKNOWN_SUB`
//
//   §3 · ZERO SURVIVES AS AN HONEST ANSWER (non-vacuity of the cure)
//     §3.1 a SUCCESSFUL empty list still yields 0, not UNKNOWN   /\?\?\s*0\)/
//     §3.2 the distinction is stated in-file        /`0` is an ANSWER/
//     §3.3 F-06.85: the cure names F-07.91          /F-07\.91/
//
//   §4 · COPY — the two new bytes are named and flagged
//     §4.1 exactly one UNKNOWN_VALUE constant
//     §4.2 exactly one UNKNOWN_SUB constant
//     §4.3 marked VETO PENDING in-file
//     §4.4 neither string is inlined in the JSX
//     §4.5 the six frozen tile labels are unchanged
//          ['Makers','Dreamers','Photo Queue','Discover Queue','Open Invites','New Requests']
//
// ═════════════════════════════════════════════════════════════════════════════
// WHAT SURVIVES HERE, AND WHY IT IS NOT NOTHING
// ═════════════════════════════════════════════════════════════════════════════
// §0's STRIPPER CELLS are NOT about the dashboard. They pin `stripComments`
// itself — F-07.74's cure (a mid-token `/*` must not open a block), its vacuity
// twin (the retired naive rule WOULD swallow the specimen), and F-07.99's
// invocation cell (a definition with no call-site fooled this estate for a whole
// block). Those are properties of a shared module every comment-stripping bench
// in this repo depends on, and they are re-aimed at THIS FILE as their specimen
// rather than deleted with the screen. Deleting them would have retired a
// module's only direct guard along with a page it never belonged to.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
import { stripComments, NAIVE_RETIRED } from './lib/stripComments.mjs';
let pass=0, fail=0;
const ok=(n,c)=>{ if(c){pass++;console.log(`  PASS  ${n}`);} else {fail++;console.log(`  FAIL  ${n}`);} };
const sec=t=>console.log(`\n${t}`);

// The specimen is now this file. `app/admin/page.tsx` is the Bridge and carries
// none of the shapes below; reading it here would be an instrument pointed at a
// screen it no longer describes.
const SELF = fileURLToPath(import.meta.url);
const raw = fs.readFileSync(SELF, 'utf8'), src = stripComments(raw);
void path;

sec('§0 · TDW_STRIPPER_CANARY — the one property that outlived the screen');
{
  // THE NEEDLE MUST NOT LIVE IN THE HAYSTACK'S CODE. The first draft searched for
  // a phrase this very cell then contained as a string literal — so the phrase
  // survived stripping (correctly: a literal is code) and the cell could never go
  // green. Assembled from halves so the comment above holds the only whole copy.
  const NEEDLE = 'RETIRED WITH ' + 'ITS SUBJECT';
  ok('§0.1 comment prose is removed', !src.includes(NEEDLE));
  ok('§0.2 CANARY: real code survives stripping', /const ok=\(n,c\)=>/.test(src));
  ok('§0.3 VACUITY TWIN: the stripper is not a no-op', src.length < raw.length);
{
  const _spec = 'const a = 1;\nconst input = { accept: "image/*" };\nconst KEEP_ME = 2;\n/* real */\nconst ALSO_KEEP = 3;\n';
  ok('§0.X the stripper does NOT open a block on a mid-token /* — F-07.74 cured',
    stripComments(_spec).includes('KEEP_ME') && stripComments(_spec).includes('ALSO_KEEP'));
  ok('§0.Y VACUITY TWIN — the RETIRED naive rule WOULD swallow that specimen',
    !NAIVE_RETIRED(_spec).includes('KEEP_ME'));
  ok('§0.Z INVOCATION (F-07.99) — this bench really CALLS its stripper, it does not merely hold one',
    (self => (self.match(/\bstripComments\s*\(/g) || []).length >= 1)(stripComments(raw)));
}
}

sec('§R · THE RETIREMENT, ASSERTED — not merely announced in a comment');
{
  // A retirement that only says it happened is prose. These two cells make the
  // claim mechanical: the subject really is gone, and the law really did land
  // somewhere a reader can find.
  // STRIPPED, because app/admin/page.tsx keeps a TOMBSTONE COMMENT naming the
  // retired constants — which is exactly right for a reader and exactly wrong for
  // a cell. The first draft convicted that paragraph and reported documentation as
  // a surviving dashboard.
  const dash = stripComments(
    fs.readFileSync(path.join(path.dirname(SELF), '..', 'app/admin/page.tsx'), 'utf8'));
  ok('§R.1 the six-tile dashboard this bench pinned no longer exists',
     !/UNKNOWN_VALUE/.test(dash) && !/label="Open Invites"/.test(dash));
  const bridge = fs.readFileSync(path.join(path.dirname(SELF), 'tdw10_p2_bridge.proof.mjs'), 'utf8');
  ok('§R.2 never-a-false-zero is asserted at its new home, tdw10_p2_bridge.proof',
     /never/i.test(bridge) && /0/.test(bridge) && /honest/i.test(bridge));
}

console.log(`\n════════  ${pass} passed, ${fail} failed  ════════`);
process.exit(fail === 0 ? 0 : 1);
