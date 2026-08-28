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

/** The one writer. The drawer toggle calls this and nothing else writes the mode. */
export function writeMode(mode: WlMode): void {
  if (typeof document === 'undefined') return;
  // One year. A display preference that expires is a vendor who finds his shell has
  // changed colour for no reason he can name.
  document.cookie = `${MODE_COOKIE}=${mode}; path=/; max-age=31536000; samesite=lax`;
  try { localStorage.setItem(MODE_LEGACY_KEY, mode); } catch { /* private mode — cookie holds */ }
}
