// lib/frost/igLink.ts — TDW_07 P1 · D-3, the Instagram chip's mechanics. ONE HOME.
//
// The card and the detail overlay both render the chip; P6's editorial pass and P4's
// shared VendorProfileView will render it too. One home now means no second
// implementation later — the spec's own standing rule for the profile renderer,
// applied to the link that sits inside it.
//
// ── THE SHAPE, per D-3 ────────────────────────────────────────────────────────────
//   tap → instagram://user?username=X
//   300ms later, if we are still here → https://instagram.com/X in a NEW context
// The 300ms is the standard app-handoff probe: if the IG app takes the custom scheme,
// the page is backgrounded and the timer never runs its body (mobile browsers freeze
// timers on a backgrounded tab); if nothing claims the scheme, the timer fires and the
// web profile opens. There is no API that answers "is the app installed", so a probe
// is the only honest mechanism — and the fallback is a real page, never an error.
//
// ── SPEC §3's GUARDRAIL: "IG links never in-app-browser-jacked — system handoff" ───
// The web fallback opens with target `_blank` + `noopener,noreferrer`, which hands the
// URL to the system browser rather than rendering it inside our own chrome.
//
// ── NATIVE-IMPLICATIONS CLAUSE (spec §6) ──────────────────────────────────────────
// The two URL builders are PURE and framework-free — RN 1:1. Only openInstagram()
// touches the DOM, and its React Native twin is the same two lines against Linking.
// No browser storage is read or written here (spec §3, no localStorage).

/** The app deep link. Assumes a bare username (the server normalises; see below). */
export function igAppUrl(handle: string): string {
  return `instagram://user?username=${encodeURIComponent(handle)}`;
}

/** The web profile — the fallback, and a page that always exists. */
export function igWebUrl(handle: string): string {
  return `https://instagram.com/${encodeURIComponent(handle)}`;
}

/**
 * Defence in depth: the server already normalises `instagram_handle` (bare username,
 * no '@', no URL — src/api/couple/discover.js's normalizeIgHandle). This repeats the
 * strip on the client so a handle arriving from any other source — a cached response
 * from before P1, a demo fixture, a future caller — cannot build `@@name` or a
 * double-prefixed URL. Returns null when nothing usable remains, and the chip renders
 * on truth or not at all.
 */
export function normalizeIgHandle(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null;
  let h = raw.trim();
  if (h === '') return null;
  h = h.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '');
  h = h.replace(/^@+/, '');
  h = h.replace(/[/?#].*$/, '');
  h = h.trim();
  if (h === '') return null;
  if (!/^[A-Za-z0-9._]{1,30}$/.test(h)) return null;
  return h;
}

export const IG_FALLBACK_MS = 300;

/**
 * Tap handler. Web-only by design — the RN twin swaps these two calls for
 * Linking.openURL / Linking.canOpenURL and keeps every line above unchanged.
 * Never throws: a blocked popup or a refused scheme must not take a gesture surface
 * down with it.
 */
export function openInstagram(handle: string | null | undefined): void {
  const h = normalizeIgHandle(handle);
  if (!h) return;
  if (typeof window === 'undefined') return;

  // ── F-07.7 CURED · TDW_07 P6 — CURE (d), THE POINTER-COARSE SPLIT ──────────────────
  // THE DISEASE. The web fallback fires from inside a 300ms timer, which lands OUTSIDE
  // the tap's transient activation window. Browsers treat a window.open() with no live
  // user activation as a popup, so on some browsers the first tap produced a permission
  // prompt instead of a profile. Both legs worked; the papercut was the prompt.
  //
  // THE SPLIT. The probe only earns its timer where an Instagram app could plausibly
  // claim the scheme — a COARSE pointer, i.e. a finger. On a FINE pointer (a mouse: a
  // desktop browser, where no `instagram://` handler exists) the timer buys nothing and
  // costs the activation, so the web profile opens SYNCHRONOUSLY inside the tap's own
  // activation window and no popup heuristic ever fires.
  //
  // WHY `pointer: coarse` AND NOT A UA SNIFF: it asks the question we actually mean —
  // "is this a finger?" — and it is the property the platform exposes for it. A device
  // without matchMedia falls through to the probe, which is today's behaviour and the
  // safe direction: the worst case is the prompt that already exists, never a dead tap.
  const fine = typeof window.matchMedia === 'function' &&
               window.matchMedia('(pointer: fine)').matches;
  if (fine) {
    try { window.open(igWebUrl(h), '_blank', 'noopener,noreferrer'); }
    catch { /* popup blocked even inside activation — nothing further to attempt */ }
    return;
  }

  try {
    // The probe. A same-tab assignment is what lets the OS claim the scheme; opening
    // it in a new tab leaves an orphan blank tab behind on every platform.
    window.location.href = igAppUrl(h);
  } catch {
    /* a refused custom scheme is not an error worth surfacing — the fallback follows */
  }
  window.setTimeout(() => {
    try {
      if (typeof document !== 'undefined' && document.hidden) return;  // the app took it
      window.open(igWebUrl(h), '_blank', 'noopener,noreferrer');
    } catch {
      /* popup blocked — the app link above was still attempted; nothing to recover */
    }
  }, IG_FALLBACK_MS);
}
