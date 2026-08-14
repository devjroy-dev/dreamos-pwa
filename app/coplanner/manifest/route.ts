// app/coplanner/manifest/route.ts — TDW_14 D-5 · C-8's member key.
//
// WHAT THIS IS. The coplanner's own web app manifest, served rather than
// stored, so the installed icon on a member's home screen reads
// "{Bride first name}'s Wedding Circle" instead of the estate's house name.
// The static half of this problem was already solved ground: `admin-manifest`
// and `couple-manifest` are per-scope files linked from their own layouts, and
// `app/admin/layout.tsx:382` is the linking shape this mirrors. The half that
// needed new machinery is the TEMPLATING, and that is all this file is.
//
// WHY A ROUTE HANDLER AND NOT A CLIENT-MINTED BLOB. Ruled by the chair at
// D-5's tranche 1: a manifest that exists only after JS has run is a manifest
// that breaks install and update semantics, and the browser's manifest fetch is
// the one request in the flow we do not control.
//
// WHY IDENTITY ARRIVES IN THE QUERY AND NOT IN A HEADER. That same browser
// fetch does not carry `circleAuthHeaders`, so this handler cannot authenticate
// and does not try. The bride's name is minted into the `href` by
// `app/coplanner/layout.tsx`, which is already a lawful holder of the session.
// That siting is also a bench constraint, not only a design one:
// `tdw07_f0766_orphan.proof.mjs` §5.4 pins the `circle_session` consumer set at
// exactly FOUR files by name, comment-stripped. This handler NEVER names that
// key — it reads a query parameter and nothing else — so the set holds at four.
//
// WHAT IS AND IS NOT SECRET HERE. A bride's first name is on every screen of
// the circle her members already stand inside. Nothing else crosses.
//
// A BROKEN MANIFEST FETCH MUST NEVER BREAK INSTALL. Every absent, malformed, or
// unrecognised identity falls through to the house wording. There is no error
// arm: this route has one response shape and always returns 200.

import { NextRequest, NextResponse } from 'next/server';

// ㉒㉓㉔'s fallback column, ruled at the sheet.
const FALLBACK_NAME  = 'Wedding Circle';
const FALLBACK_DESC  = 'Plan a wedding, together.';

// ㉕ — BINDING, and it is the reason this handler takes the FULL name rather
// than a first name already sliced by the caller. `src/api/circle/join.js`
// resolves `bride_name: couple?.users?.name || 'the bride'`, and the client's
// `brideName()` helper falls back to the same two words. That sentinel is a
// SENTENCE, not a name: slicing it for a first name yields "the", and the icon
// would read "the's Wedding Circle". Absent identity is detected on the whole
// string, here, once — so no caller can get it wrong.
const ABSENT_SENTINEL = 'the bride';

function firstNameOf(raw: string): string {
  const full = (raw || '').trim();
  if (!full) return '';
  if (full.toLowerCase() === ABSENT_SENTINEL) return '';
  const first = full.split(/\s+/)[0] || '';
  // A lone article is the sentinel arriving pre-sliced by some future caller.
  // Cheap to refuse, and the failure it prevents is on a home screen.
  if (!first || first.toLowerCase() === 'the') return '';
  return first;
}

export async function GET(req: NextRequest) {
  const first = firstNameOf(req.nextUrl.searchParams.get('b') || '');

  const manifest = {
    // ㉒ ㉓ ㉔ — frozen at the character, 2026-08-14.
    name:       first ? `${first}'s Wedding Circle` : FALLBACK_NAME,
    short_name: first ? `${first}'s Circle`         : FALLBACK_NAME,
    description: first ? `Plan ${first}'s wedding, together.` : FALLBACK_DESC,

    id:         'in.thedreamwedding.circle',
    start_url:  '/coplanner',
    scope:      '/coplanner',
    display:    'standalone',
    orientation: 'portrait',
    // The circle's ground, matching the coplanner shell's own INK. A browser
    // reads these before any stylesheet, so they cannot be `var()` — the same
    // exception `app/admin/layout.tsx` carries, for the same reason.
    background_color: '#0C0A09',
    theme_color:      '#0C0A09',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    prefer_related_applications: false,
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      // The name changes only when the bride renames herself; a short cache
      // keeps a reinstall honest without re-serving on every cold open.
      'Cache-Control': 'public, max-age=300',
    },
  });
}
