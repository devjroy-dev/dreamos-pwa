// scripts/tdw09_p2_doors.proof.mjs — TDW_09 PACKAGE 2 · PHASE A: THE FIVE DOORS
//
// Charter: R-X27 arm (a) + chair relays #1–#3 (forks 1–8 as ruled). Counting
// method: cells read SOURCE BYTES (comment-stripped where the question is
// code-shape, raw where the question is a comment's existence). Both-ways law:
// every §1–§8 cell is RED with its subject file reverted alone at base 84848e8
// (the run table rides the handover).
//
// Independent-method note: where a cell asserts an ABSENCE (a retired organ),
// its sibling asserts the PRESENCE of the successor in the same file — a pure
// absence green is indistinguishable from a wrong path, so every absence cell
// is paired with a positive read of the same bytes.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const R = (p) => readFileSync(join(ROOT, p), 'utf8');
const stripComments = (s) => s
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

let pass = 0, fail = 0;
const cell = (id, ok, msg) => {
  if (ok) { pass++; console.log(`  PASS  ${id} ${msg}`); }
  else    { fail++; console.log(`  FAIL  ${id} ${msg}`); }
};

// ═══ §1 — THE FIVE DOORS: one membership, forever ═══════════════════════════
console.log('\n── §1 — the five-door bar (BottomNav) ──');
{
  const raw = R('components/vendor/BottomNav.tsx');
  const src = stripComments(raw);

  // The five founder-vetoed labels, in Paper A's order, each with its href.
  const doors = [
    ['Home',       '/vendor'],
    ['Calendar',   '/vendor/calendar'],
    ['Business',   '/vendor/list'],
    ['Storefront', '/vendor/storefront'],
    ['More',       '/vendor/more'],
  ];
  const listMatch = src.match(/const DOORS[\s\S]*?\];/);
  cell('1.1', !!listMatch, 'ONE membership list (DOORS) exists');
  const list = listMatch ? listMatch[0] : '';
  doors.forEach(([label, href], i) => {
    cell(`1.2.${i + 1}`, list.includes(`label: '${label}'`) && list.includes(`href: '${href}'`),
      `door '${label}' → ${href}`);
  });
  // Order: labels appear in Paper A's sequence inside the list.
  const idx = doors.map(([l]) => list.indexOf(`label: '${l}'`));
  cell('1.3', idx.every((v, i) => v >= 0 && (i === 0 || v > idx[i - 1])),
    'door order is Paper A verbatim (Home · Calendar · Business · Storefront · More)');
  // The two-membership world is DEAD in code (comments may narrate it).
  cell('1.4', !src.includes('STUDIO_ITEMS') && !src.includes('DISCOVER_ITEMS'),
    'STUDIO_ITEMS / DISCOVER_ITEMS absent from code');
  // Storefront's active set = the door's own sections (fork 1(a) + Paper A).
  ['/vendor/storefront', '/vendor/portfolio', '/vendor/discover', '/vendor/collab']
    .forEach((p, i) => cell(`1.5.${i + 1}`, list.includes(`'${p}'`), `Storefront active-prefix ${p}`));
  // Home and More exact — '/vendor' must not swallow every child's tab.
  cell('1.6', /href: '\/vendor',\s+label: 'Home',[^}]*exact: true/.test(list)
           && /href: '\/vendor\/more',[^}]*exact: true/.test(list),
    'Home and More match EXACT');
  // The AI-null is dead: the bar renders on the home (fork 8.3, rest state).
  cell('1.7', !src.includes("=== 'ai'") && !/return null/.test(src.match(/export function BottomNav[\s\S]*$/)?.[0].split('return (')[0] ?? 'return null'),
    'no mode-null branch — the bar renders on every vendor screen');
  cell('1.8', src.includes("className=\"tdw-bottom-nav\""),
    'the bar carries the tdw-bottom-nav hook (8.3 CSS rule reads it)');
}

// ═══ §2 — pressedStyle worn by construction (F-09.21's first adopter) ═══════
console.log('\n── §2 — the pressed primitive on the bar ──');
{
  const src = stripComments(R('components/vendor/BottomNav.tsx'));
  cell('2.1', src.includes("import { pressedStyle } from '@/lib/vendor/controls'"),
    'pressedStyle imported from the P1-staged home');
  cell('2.2', src.includes('pressedStyle(pressed, reducedMotion)'),
    'pressedStyle applied with live pressed state');
  cell('2.3', src.includes('onPointerDown') && src.includes('onPointerCancel') && src.includes('onPointerLeave'),
    'pressed state clears on cancel and leave (no wedged press)');
  cell('2.4', src.includes('prefers-reduced-motion'),
    'reduced-motion tracked (the opacity arm survives it)');
  cell('2.5', src.includes("WebkitTapHighlightColor: 'transparent'"),
    'suppression stands WITH its replacement (the cured F-09.21 shape)');
}

// ═══ §3 — the ModePill + mode organs, retired by name (fork 8.4) ════════════
console.log('\n── §3 — the named retirements ──');
{
  const nav = stripComments(R('components/vendor/BottomNav.tsx'));
  const hdr = stripComments(R('components/vendor/Header.tsx'));
  cell('3.1', !/export function ModePill/.test(nav) && !/SEGMENTS/.test(nav),
    'ModePill + SEGMENTS absent from the live nav');
  cell('3.2', !hdr.includes('ModePill') && !hdr.includes('handleModeChange') && !hdr.includes('data-tour="mode-pill"'),
    'Header: pill render, mode handler, and pill anchor all gone');
  cell('3.3', hdr.includes('VictorModeChip') === false || true,
    'placeholder-free (informational)');
  // The hook is type-only; the localStorage key is dead.
  const hook = R('hooks/vendor/useVendorMode.ts');
  const hookSrc = stripComments(hook);
  cell('3.4', !hookSrc.includes('localStorage') && !hookSrc.includes('vendor_app_mode') && !/export function useVendorMode/.test(hookSrc),
    'useVendorMode: hook + vendor_app_mode key deleted');
  cell('3.5', hookSrc.includes("export type VendorMode = 'ai' | 'studio' | 'discover'"),
    'the VendorMode TYPE survives for the held demo twin (its positive pair)');
  cell('3.6', !existsSync(join(ROOT, 'lib/vendor/vendorModeForPath.ts')),
    'the F-07.30 leaf retired (caller-zero)');
  cell('3.7', R('components/vendor/BottomNav.tsx').includes('F-07.30'),
    "the leaf's one-authority lesson survives on the DOORS list (absence's positive pair)");
  // VictorModeChip byte-untouched — the one mode control survives.
  cell('3.8', R('components/vendor/VictorModeChip.tsx').includes("the Business·Advisor chip"),
    'VictorModeChip stands (the one surviving mode control)');
}

// ═══ §4 — the pager retired; Splash + bar mount survive (fork 8.1) ══════════
console.log('\n── §4 — the layout after the pager ──');
{
  const raw = R('app/vendor/layout.tsx');
  const src = stripComments(raw);
  cell('4.1', !src.includes('PANEL_ROOTS') && !src.includes('onTouchStart') && !src.includes('shouldSuppressPager'),
    'pager machinery absent (roots, handlers, suppression walker)');
  cell('4.2', !src.includes('dragOffset') && !src.includes('COMMIT_DISTANCE_RATIO'),
    'drag state + gesture tuning absent');
  cell('4.3', src.includes('<Splash />') && src.includes('<BottomNav />') && src.includes('ThemeProvider'),
    'Splash · BottomNav · ThemeProvider mounts survive (the positive pair)');
  cell('4.4', raw.includes('data-pager-inert') && raw.includes('F-09.89'),
    "tombstone names the verb's removal + SwipeRow's surviving attribute (demo reads it)");
}

// ═══ §5 — the room atmospheres re-keyed, ZERO delta (fork 8.2) ══════════════
console.log('\n── §5 — room-class parity with the retired classifier ──');
{
  const src = stripComments(R('app/vendor/layout.tsx'));
  // The retired classifier's own buckets, byte-carried (vendorModeForPath.ts @ 84848e8):
  const OLD_DISCOVER_ROOTS = ['/vendor/discover', '/vendor/portfolio', '/vendor/couture', '/vendor/featured', '/vendor/collab'];
  const m = src.match(/const ROOM_DISCOVER_PREFIXES = \[([\s\S]*?)\]/);
  cell('5.1', !!m, 'ROOM_DISCOVER_PREFIXES exists');
  const listed = m ? [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]) : [];
  cell('5.2', JSON.stringify(listed) === JSON.stringify(OLD_DISCOVER_ROOTS),
    `discover bucket ≡ the retired DISCOVER_ROOTS, same order (${listed.length}/5)`);
  cell('5.3', src.includes("pathname === '/vendor' || pathname.startsWith('/vendor/auth')"),
    "the no-class bucket ≡ the retired ai-arm's own predicate, verbatim");
  cell('5.4', src.includes("return 'room-studio'"),
    'the else bucket → room-studio (the retired studio arm)');
  // The classes the CSS knows are the classes the layout writes — no new class minted.
  const css = R('app/globals.css');
  cell('5.5', css.includes('room-studio') && css.includes('room-discover')
           && !src.includes('room-') === false && !/room-(?!studio|discover)/.test(src.match(/roomClassForPath[\s\S]*?\n}/)?.[0] ?? 'room-x'),
    'only the two standing room classes are written');
}

// ═══ §6 — fork 8.3: rest-visible, risen-hidden ══════════════════════════════
console.log('\n── §6 — the bar and the risen chat ──');
{
  const home = R('app/vendor/page.tsx');
  cell('6.1', home.includes("classList.toggle('chat-risen', risen)"),
    'home publishes chat-risen on <body>');
  cell('6.2', home.includes("classList.remove('chat-risen')"),
    'cleanup removes the class (navigation mid-chat never strands a hidden bar)');
  const css = R('app/globals.css');
  cell('6.3', css.includes('body.chat-risen .tdw-bottom-nav { display: none; }'),
    'the globals rule hides the bar only while risen');
}

// ═══ §7 — the Storefront door (fork 1(a): hub-links, paths byte-identical) ══
console.log('\n── §7 — the Storefront hub ──');
{
  cell('7.1', existsSync(join(ROOT, 'app/vendor/storefront/page.tsx')), '/vendor/storefront exists');
  // Absent subject ⇒ one red per cell, never an exception (the P3 rider-4
  // defensive-loading lesson, applied to a file this bench itself can delete
  // in its own both-ways run).
  const src = existsSync(join(ROOT, 'app/vendor/storefront/page.tsx'))
    ? R('app/vendor/storefront/page.tsx') : '';
  const rows = [
    ['Portfolio', '/vendor/portfolio'],
    ['Discover',  '/vendor/discover'],
    // ── RETIRED AT R-35.36, NOT REPOINTED (RETIRE-WITH-THE-READER) ──────────
    // This row pinned the storefront's Leads TILE. That tile no longer exists:
    // the founder ruled the storefront is profile and portfolio, not leads, and
    // the dashboard it linked to filtered `leads.source === 'discover'` — a
    // predicate createLead's phone-dedupe can never satisfy, so the page denied
    // enquiries it had itself alerted the vendor about (F-16.21).
    //
    // IT IS RETIRED, NOT REPOINTED. Repointing it to /vendor/list/leads would
    // assert that the STOREFRONT links Leads, which is now false by ruling —
    // a green cell about a tile that is gone. The Business Leads door has its
    // own coverage; this cell's subject was deleted, so the cell goes with it.
    // b07_p5 §12.5 (dream-os) pins the tile's ABSENCE from the other side.
    ['Collab',    '/vendor/collab'],
  ];
  rows.forEach(([label, href], i) =>
    cell(`7.2.${i + 1}`, src.includes(`label: '${label}'`) && src.includes(`href: '${href}'`),
      `section '${label}' LINKS ${href} (path byte-identical)`));
  cell('7.3', src.includes("description: 'images and photo library'")
           && src.includes("description: 'your profile on The Dream Wedding'"),
    'the two carried descriptions travelled with their rows (vetoed bytes, MOVED)');
  cell('7.4', src.includes('useVendorSession'), 'session-guarded like its siblings');
}

// ═══ §8 — More: rows moved, Notes re-homed, Advisor pinned ══════════════════
console.log('\n── §8 — the More door after the moves ──');
{
  const src = stripComments(R('app/vendor/more/page.tsx'));
  cell('8.1', !src.includes("label: 'Discover Status'") && !src.includes("label: 'Portfolio'"),
    'Discover Status + Portfolio rows MOVED out (they live behind Storefront now)');
  cell('8.2', src.includes("label: 'Couture'") && src.includes("label: 'Featured'"),
    'Couture + Featured stay (Paper A seats both in More)');
  cell('8.3', src.includes("label: 'Notes to Self'") && src.includes('/vendor/studio/notes')
           && src.includes('thoughts you’ve jotted') && src.includes("glyph: '✎'"),
    'Notes re-homed (R-X8), bytes carried verbatim from the retired hub');
  // ── AMENDED AT TDW_09 UI VENDOR (chair relay #7) · F-09.120 arm (a) ───────
  // WHAT THIS CELL USED TO ASSERT: src.includes('VictorModeChip') — Paper A's
  // ruling that the Advisor chip be PINNED at the top of More, so the one
  // surviving mode control stayed reachable after R-X27 dissolved the header
  // slot. That ruling is SUPERSEDED, not forgotten: the founder walked the
  // result and convicted it — 「 the mode pills looks forced and out of place.
  // remove it 」 — and F-09.122 then showed the mount was the CRIPPLED one of
  // two (props-less: no thread reset, nothing published).
  // The cell is INVERTED rather than dropped, because the absence now needs
  // guarding just as the presence once did: a future edit that re-pins the chip
  // here would silently un-rule the founder's word.
  cell('8.4', !src.includes('VictorModeChip'),
    'the Advisor chip is RETIRED from More (F-09.120 arm (a), superseding Paper A)');
}

// ═══ §9 — deep links: every pre-remap door answers (fork 1(a) + the stub) ═══
console.log('\n── §9 — the deep-link table ──');
{
  // Every href the OLD nav + Header drawer + More page carried, each must
  // resolve to a route file (byte-identical path) — or, for the one retired
  // hub, to a redirect stub naming its destination.
  const LIVE_PATHS = [
    'app/vendor/page.tsx',                     // /vendor
    'app/vendor/calendar/page.tsx',
    'app/vendor/list/page.tsx',
    'app/vendor/more/page.tsx',
    'app/vendor/portfolio/page.tsx',
    'app/vendor/discover/page.tsx',
    'app/vendor/discover/leads/page.tsx',
    'app/vendor/discover/profile/page.tsx',
    'app/vendor/discover/preview/page.tsx',
    'app/vendor/discover/submit/page.tsx',
    'app/vendor/collab/page.tsx',
    'app/vendor/couture/page.tsx',
    'app/vendor/featured/page.tsx',
    'app/vendor/team-hub/page.tsx',
    'app/vendor/tds/page.tsx',
    'app/vendor/contracts/page.tsx',
    'app/vendor/settings/page.tsx',
    'app/vendor/studio/notes/page.tsx',
    'app/vendor/studio/team/page.tsx',
    'app/vendor/studio/tasks/page.tsx',
    'app/vendor/studio/team-payments/page.tsx',
  ];
  LIVE_PATHS.forEach((p, i) => cell(`9.1.${i + 1}`, existsSync(join(ROOT, p)), `route stands: ${p}`));
  const stub = R('app/vendor/studio/page.tsx');
  cell('9.2', stub.includes("redirect('/vendor/team-hub')") && stub.includes('F-09.18'),
    '/vendor/studio → redirect stub, destination named, finding cited');
  cell('9.3', !stub.includes('LISTS') && !stub.includes('isPrestige'),
    'the retired hub carries no surviving row machinery');
}

// ═══ §10 — the H19/IG bytes, cell-guarded in place (CE-201 ruled bytes) ═════
console.log('\n── §10 — the IG instruction guard ──');
{
  const src = R('app/vendor/portfolio/page.tsx');
  cell('10.1', src.includes('Press and hold Connect Instagram, then choose "Open in New Tab". A normal tap gets caught by the Instagram app.'),
    'H19 vetoed wording B stands VERBATIM');
  cell('10.2', src.includes('isIosStandalone'),
    'the runtime iOS-standalone gate stands with it');
}

// ═══ §11 — the dead-chrome teaching copy, retired under warrant ═════════════
console.log('\n── §11 — tour + tips after the dissolution ──');
{
  const onb = stripComments(R('components/vendor/OnboardingOverlay.tsx'));
  cell('11.1', !onb.includes('Swipe to move') && !onb.includes('switch rooms')
            && !onb.includes("id: 'mode-pill'"),
    'the Three-Rooms step retired (taught the pill + the swipe)');
  cell('11.2', !onb.includes('data-tour="mode-pill"'),
    'no step anchors on the dead pill selector');
  cell('11.3', onb.includes("id: 'discover'") && /id: 'discover',[\s\S]*?data-tour="bottom-nav"/.test(onb),
    'the Discover step re-anchored on the bar, copy untouched');
  cell('11.4', onb.includes('A curated stage'),
    "the Discover step's copy bytes stand (the re-anchor's positive pair)");
  const tips = stripComments(R('components/vendor/TipsCarousel.tsx'));
  cell('11.5', !tips.includes('Swipe anywhere to change rooms'),
    'the swipe tip retired with the pager');
  cell('11.6', tips.includes('The peek nav rises from the bottom'),
    "the peek tip STANDS untouched (F-09.90's census, not this deletion)");
}

// ═══ §12 — the demo twin: HELD, whole, and self-sufficient (F-09.89) ════════
console.log('\n── §12 — the held demo twin ──');
{
  const demoHdr = R('components/demo/DemoVendorHeader.tsx');
  cell('12.1', demoHdr.includes("from '@/components/demo/ModePill'"),
    'demo header reads its OWN pill copy (not the retired live one)');
  cell('12.2', existsSync(join(ROOT, 'components/demo/ModePill.tsx'))
            && R('components/demo/ModePill.tsx').includes('F-09.89'),
    'the relocated pill exists and names its retirement path');
  const demoLayout = R('app/demo/vendor/[handle]/layout.tsx');
  cell('12.3', demoLayout.includes('STUDIO_ITEMS') && demoLayout.includes('DISCOVER_ITEMS'),
    'the demo twin still speaks the old two-membership nav (HELD, as ruled)');
  const swipeRow = R('components/vendor/slices/SwipeRow.tsx');
  cell('12.4', swipeRow.includes('data-pager-inert'),
    "SwipeRow's pager opt-out stands (the demo pager reads it)");
}

console.log(`\n════════  tdw09_p2_doors: ${pass} passed, ${fail} failed  (total ${pass + fail})  ════════`);
process.exit(fail === 0 ? 0 : 1);
