// scripts/lib/profileCoreRender.tsx
//
// TDW_19 P2-A §3-2 · THE RENDER HARNESS FOR `tdw19_p2a_profile_core.proof.mjs`.
//
// ── WHY IT LIVES IN `scripts/lib/` AND NOT AS A `.proof.ts` ─────────────────
// The estate's TypeScript benches are `scripts/X.proof.ts` + a
// `scripts/run-X-proof.sh` wrapper, and `run-floor.sh:169-200` guards that
// pairing in BOTH directions. This harness renders JSX, so it must be a `.tsx`
// — and a `.tsx` walks into that guard: the ORPHANED check greps
// `scripts/[A-Za-z0-9_]*\.proof\.ts` out of the wrapper, which matches the
// `…proof.ts` PREFIX of `…proof.tsx`, then tests `-f` on a path that does not
// exist and STOPS THE WHOLE FLOOR at exit 1. Derived by reading the guard, not
// by running into it.
//
// So the driver is a bare-runnable `scripts/tdw19_p2a_profile_core.proof.mjs`
// — caught by the floor's `scripts/*.mjs` glob, exit code as verdict, the
// estate's floor-method — and this file is its subject. `scripts/lib/` is not
// reached by any floor glob (verified: `ls scripts/*.mjs scripts/*.js` returns
// nothing under it), which is why `mutateCopy.mjs` and `stripComments.mjs`
// already live here.
//
// ── WHAT IT DOES ───────────────────────────────────────────────────────────
// Renders a `VendorProfileView` module to static markup over a fixture table,
// and prints one JSON object of `{fixtureName: markup}`. The driver runs this
// TWICE — once against the pinned pre-extraction bytes, once against the tree —
// and diffs the two objects. Neither run knows the other exists.
//
// The module under test arrives by path on argv, NOT by import literal, because
// the pre-extraction copy is written to a temp file by the driver. A harness
// that could only see the tree could never prove the extraction changed nothing.

import { renderToStaticMarkup } from 'react-dom/server';
import type { DiscoverVendor } from '@/lib/types/discover';

// ── THE FIXTURE TABLE ───────────────────────────────────────────────────────
// Every branch in the component, and every prop shape its three RENDERING
// mounts actually pass — derived from the mounts, not invented:
//
//   components/frost/blooms/discover.tsx:229  mode='live',    isBlind passed through
//   app/vendor/discover/preview/page.tsx:275  mode='preview', isBlind={false}
//   app/demo/vendor/[handle]/page.tsx:399     mode='preview', isBlind={false}
//
// `isBlind` is the only prop that changes what RENDERS (the component's own
// header: "`mode` changes NOTHING about what renders"), so it gets both values
// against every content shape rather than once.

const BASE: DiscoverVendor = {
  id: 'fx-1',
  name: 'Dev Roy Photography',
  category: 'photography',
  city: 'Delhi',
  routing_handle: 'DEV440',
  starting_price: 60000,
  photos: [],
  vibe_tags: ['warm', 'candid'],
  about: 'We photograph North Indian weddings the way they actually happen.',
  enquire_link: 'https://wa.me/911234567890?text=TDW-DEV440',
  is_demo: false,
  instagram_handle: 'devroy',
  featured: true,
};

type Fixture = { name: string; vendor: DiscoverVendor; mode: 'live' | 'preview'; isBlind: boolean };

export const FIXTURES: Fixture[] = [
  { name: 'live/full',              vendor: BASE,                                              mode: 'live',    isBlind: false },
  { name: 'live/blind',             vendor: BASE,                                              mode: 'live',    isBlind: true  },
  { name: 'preview/full',           vendor: BASE,                                              mode: 'preview', isBlind: false },
  // The suppressed-price parity the fixture ledger names Swati Roy for: a
  // vendor who hid her rate renders NO price line at all (D-1).
  { name: 'live/price-hidden',      vendor: { ...BASE, starting_price: null },                 mode: 'live',    isBlind: false },
  { name: 'live/no-about',          vendor: { ...BASE, about: null },                          mode: 'live',    isBlind: false },
  { name: 'live/not-featured',      vendor: { ...BASE, featured: false },                      mode: 'live',    isBlind: false },
  { name: 'live/no-ig',             vendor: { ...BASE, instagram_handle: null },               mode: 'live',    isBlind: false },
  // A demo card as `shapeDemoRow` actually hands it over: F-07.54 nulls
  // `routing_handle` and `enquire_link` TOGETHER, so the demo studio's mount
  // cannot be given a live enquire target even by accident.
  { name: 'preview/demo-shape',     vendor: { ...BASE, is_demo: true, routing_handle: null, enquire_link: null, featured: false }, mode: 'preview', isBlind: false },
  { name: 'live/blind-no-tags',     vendor: { ...BASE, vibe_tags: [] },                        mode: 'live',    isBlind: true  },
  // Every optional absent at once — the shape a half-built vendor row produces.
  { name: 'live/bare',              vendor: { ...BASE, about: null, starting_price: null, instagram_handle: null, featured: false, vibe_tags: [] }, mode: 'live', isBlind: false },
];

async function main() {
  const modulePath = process.argv[2];
  const corePath   = process.argv[3];   // optional — absent on the pinned run
  if (!modulePath) { console.error('usage: profileCoreRender <compiled-VendorProfileView.js> [compiled-VendorProfileContent.js]'); process.exit(2); }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(modulePath);
  const View = mod.default;
  if (typeof View !== 'function') { console.error('module has no default export function'); process.exit(2); }

  const out: Record<string, string> = {};
  for (const f of FIXTURES) {
    // Handlers are supplied on the LIVE fixtures because the deck supplies them;
    // they never affect markup (they are `onClick` values) but a mount shape
    // that omitted them would be a fixture that does not match any real caller.
    out[f.name] = renderToStaticMarkup(
      <View
        vendor={f.vendor}
        mode={f.mode}
        isBlind={f.isBlind}
        enquireLink={f.mode === 'live' ? f.vendor.enquire_link : null}
        onEnquire={f.mode === 'live' ? () => {} : undefined}
        onCircleTap={f.mode === 'live' ? () => {} : undefined}
        onPreviewToast={f.mode === 'preview' ? () => {} : undefined}
      />,
    );
  }

  // THE NAMED EXPORTS ARE REPORTED, NOT ASSERTED HERE. The driver owns every
  // verdict; a harness that decided anything would be a second place a cell
  // could live. `app/(frost)/frost/canvas/sanctuary/page.tsx:62` imports these
  // two BY NAME and never renders the view itself — the fourth consumer.
  const exports_: Record<string, string> = {};
  for (const k of ['default', 'IgChip', 'FeaturedEyebrow']) exports_[k] = typeof mod[k];

  // ── THE SEAM, RENDERED TWICE (CE-38 relay: prove two palettes, not tokens) ──
  // A cell that only checks a palette is EXPORTED passes on a `palette` prop
  // nothing reads. The seam is a seam only if the same fields on two grounds
  // produce two different documents — so both are rendered here and the driver
  // diffs them. Absent on the pinned run, because the core does not exist there.
  let core: Record<string, string> | null = null;
  if (corePath) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cmod = require(corePath);
    const Content = cmod.default;
    const PALETTE = cmod.PROFILE_PALETTE;
    const fields = {
      name: BASE.name, category: BASE.category, city: BASE.city,
      about: BASE.about, startingPrice: BASE.starting_price, vibeTags: BASE.vibe_tags,
    };
    core = {
      onGlass: renderToStaticMarkup(<Content fields={fields} palette={PALETTE.onGlass} isBlind={false} />),
      onCream: renderToStaticMarkup(<Content fields={fields} palette={PALETTE.onCream} isBlind={false} />),
    };
  }

  process.stdout.write(JSON.stringify({ markup: out, exports: exports_, core }));
}

main();
