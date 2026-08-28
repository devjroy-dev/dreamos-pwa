// lib/worklist/mode.ts — ONE HOME for the shell's theme mode.
//
// ── F-38.41 · THE MODE HAD NO HOME, IT HAD A DEFAULT AND A LATE READ ────────
//
// The mode lived in `useState<'dark'|'light'>('dark')` inside `WorklistShell`, with
// localStorage read back in a `useEffect`. Two consequences, and the founder walked into
// both:
//
//   IT DID NOT SURVIVE NAVIGATION AS A FIRST FRAME. Every `/w` route renders its own
//   `<WorklistShell>`, so navigating unmounts one and mounts the next. The new mount
//   starts at the DEFAULT — Graphite — and the stored value arrives one effect later. A
//   vendor in Chalk paid a dark frame at every single hop.
//
//   AND THE GUARD COULD NOT KNOW IT AT ALL. `app/w/layout.tsx` renders before the shell
//   mounts, by construction, so its loading ground was pinned to the dark token LITERAL
//   `#141516` with a comment explaining that the mode was unknowable there. It was
//   unknowable because it was in localStorage, which no server and no first paint can
//   read.
//
// ── WHY A COOKIE AND NOT localStorage ───────────────────────────────────────
//
// The requirement is that every mount reads the mode BEFORE its first paint, and that
// includes the server's paint. localStorage cannot satisfy that: it has no server-side
// existence, so any localStorage-based cure is a re-timing of the flash rather than its
// removal. A cookie rides the request, so the server knows the mode before it emits a
// byte and the first frame the vendor ever sees is already correct.
//
// THE localStorage KEY IS STILL WRITTEN, FOR ONE RELEASE. A vendor whose mode is in
// localStorage today must not be reset to Graphite by this deploy; `readModeCookie` falls
// back to it on the client, and the write below keeps both in step. It retires by label
// next sitting — stated here so the migration is a dated step and not a permanent second
// home.
//
// SameSite=Lax and no Secure flag: this is a display preference, not a credential. Lax so
// it survives a link into the shell; no Secure so it works on a plain-http preview.

export const MODE_COOKIE = 'tdw_wl_mode';
/** The pre-cookie home. Read as a fallback, written in step, retiring next sitting. */
export const MODE_LEGACY_KEY = 'tdw_worklist_mode';

export type WlMode = 'dark' | 'light';

/** The only place a stray string becomes a mode. Anything else is Graphite. */
export function asMode(v: string | null | undefined): WlMode {
  return v === 'light' ? 'light' : 'dark';
}

/**
 * Client-side read, safe to call during render — which is the point. It is used in a lazy
 * `useState` initialiser so a client-side navigation paints the right mode on its FIRST
 * frame, without waiting for an effect.
 */
export function readModeClient(): WlMode {
  if (typeof document === 'undefined') return 'dark';
  const hit = document.cookie.split('; ').find((c) => c.startsWith(MODE_COOKIE + '='));
  if (hit) return asMode(decodeURIComponent(hit.slice(MODE_COOKIE.length + 1)));
  try { return asMode(localStorage.getItem(MODE_LEGACY_KEY)); } catch { return 'dark'; }
}

// ── F-38.52 · THE INTERIM BRIDGE TO THE /vendor LANE ───────────────────────
//
// THE FOUNDER'S WALK, IN HIS WORDS: 「half the rooms dont match with the theme colr … for
// some the main room and interior specific room have same theme and for others they
// dont」. He was right, and it was not a bug in the mode — it was TWO THEME SYSTEMS.
//
// `lib/worklist/rooms.ts` still points SEVEN rooms at `/vendor` (Storefront, Portfolio,
// Couture, Team, Contracts, TDS, Collab) against eleven on `/w`. The two lanes share no
// key, no mechanism and no vocabulary:
//
//     /w        cookie `tdw_wl_mode`   -> `data-wl-mode` on the .wl scope
//     /vendor   localStorage `dreamai_theme` -> `html.theme-light` + JS tokens
//                 (app/vendor/layout.tsx:77, hooks/vendor/useTheme.ts:10,
//                  lib/vendor/ThemeContext.tsx:6)
//
// So the shell's coin wrote one key and seven rooms read the other. Not a race and not a
// second authority fighting a first — two independent systems never wired together. The
// vendor could flip Chalk all day and Storefront would not hear about it.
//
// ── THIS IS ONE WRITER, NOT A SECOND HOME ─────────────────────────────────
// `writeMode` is still the ONLY thing that writes the mode anywhere in the estate. It now
// writes two keys in one call. The reverse write deliberately does not exist: the old
// lane's own toggle is NOT taught to write the cookie, because one writer means one, and a
// bridge with traffic in both directions is two authorities wearing a bridge's name.
//
// ── THE MAPPING IS SEMANTIC, NOT PALETTE ──────────────────────────────────
// Chalk -> 'light', Graphite -> 'dark'. Cream is not Chalk and espresso is not Graphite —
// the two lanes render the same WORD in their own palettes, and that is the honest
// reading, because the word the vendor chose is 「light」 or 「dark」. Mapping Chalk to the
// old lane's dark on the grounds that cream ≠ Chalk would make one tap mean opposite
// things on two screens, which is a worse error than two palettes agreeing on a word.
//
//   RETIRES WHEN `INTERIM_VENDOR_ROOMS` IS EMPTY. Not on a date and not next sitting: on
//   the last crossing, when there is no room left that reads the other key. The condition
//   is derivable from the registry by command, so nothing has to remember it.
//
// ── RETIRED AT §4-4 BATCH ③. THE CONDITION FIRED AND THE WRITE IS GONE. ────
// Collab crossed, `INTERIM_VENDOR_ROOMS` is `[]`, and no room in the registry reads the
// other key any more. The bridge write is removed from `writeMode` below. The clause above
// is kept rather than deleted because it is the REASON this line existed and the reason it
// stopped existing; a retirement that erases its own condition leaves the next reader
// unable to tell a cure from a deletion.
//
// ⚠ THE CAVEAT, AND IT IS A REAL ONE THE FOUNDER SHOULD READ BEFORE HE WALKS. The `/vendor`
// FALLBACK ROUTES REMAIN ON DISK until Phase 7 retires `app/vendor/layout.tsx`. A vendor who
// reaches one by a raw URL, a stale bookmark or a service-worker cache renders under the old
// lane and that lane reads `dreamai_theme` — which now holds whatever it held at the last
// flip before this deploy, and stops tracking her choice from here on. NOTHING IN THE SHELL
// LINKS THERE: eighteen tiles, every cross-room leg and both fallback bases were derived at
// this cut. So the divergence is reachable only by leaving the product the way it is built,
// and it dies with the routes at Phase 7.
//
// THE KEY KEEPS ITS NAME AND ITS EXPORT because the old lane still READS it at three sites
// and the inverted bench still asserts that exactly nothing WRITES it. A constant deleted
// while its readers live is how a string comes back as a literal.
export const VENDOR_LANE_KEY = 'dreamai_theme';

/** The one writer. The drawer toggle calls this and nothing else writes the mode. */
export function writeMode(mode: WlMode): void {
  if (typeof document === 'undefined') return;
  // One year. A display preference that expires is a vendor who finds his shell has
  // changed colour for no reason he can name.
  document.cookie = `${MODE_COOKIE}=${mode}; path=/; max-age=31536000; samesite=lax`;
  try {
    localStorage.setItem(MODE_LEGACY_KEY, mode);
    // ── F-38.52's BRIDGE WRITE STOOD HERE AND RETIRED AT §4-4 BATCH ③ ────────
    // `localStorage.setItem(VENDOR_LANE_KEY, mode)` — removed on its own stated condition,
    // the last crossing, not on a date. The cookie is the one authority now and there is
    // nothing left for it to be kept in step with. The caveat about the surviving fallback
    // routes is written at the key's declaration above, where the key still lives.
  } catch { /* private mode — the cookie holds the /w lane and the legacy key is lost with it */ }
}
