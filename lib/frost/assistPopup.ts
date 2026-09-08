// lib/frost/assistPopup.ts — THE POPUP RULE (§6.1, founder-ruled 2026-09-08), pure.
//
// "Once per login, dismissable; never again after her first request, and never
// again after her second dismissal. She is asked, not nagged."
//
// The rule is a pure function over three facts so a bench can drive every branch
// without a DOM; the storage below is the thin reader/writer the sanctuary uses.
// UI presentation flags only — no business logic rides these keys (protocol §8);
// they are cleared with the couple's session on sign out.

export interface AssistPopupFacts {
  loginKey: string | null;      // identifies THIS login (derived from the access token); null = not signed in
  shownForLogin: string | null; // the loginKey the popup was last shown under
  dismissals: number;           // how many times she has tapped "Not now", ever
  requested: boolean;           // she has sent at least one request
}

export function shouldShowAssistPopup(f: AssistPopupFacts): boolean {
  if (!f.loginKey) return false;
  if (f.requested) return false;
  if (f.dismissals >= 2) return false;
  if (f.shownForLogin === f.loginKey) return false;
  return true;
}

export const ASSIST_POPUP_KEYS = {
  shownFor:   'assist_popup_shown_for',
  dismissals: 'assist_popup_dismissals',
  requested:  'assist_requested',
} as const;

function get(k: string): string | null { try { return typeof window === 'undefined' ? null : window.localStorage.getItem(k); } catch { return null; } }
function set(k: string, v: string): void { try { if (typeof window !== 'undefined') window.localStorage.setItem(k, v); } catch { /* ignore */ } }

// A login key that changes when the token changes and never stores the token.
export function loginKeyFromToken(token: string | null): string | null {
  if (!token) return null;
  let h = 0;
  for (let i = 0; i < token.length; i++) h = (h * 31 + token.charCodeAt(i)) | 0;
  return `l${(h >>> 0).toString(36)}`;
}

export function readAssistPopupFacts(token: string | null): AssistPopupFacts {
  return {
    loginKey:      loginKeyFromToken(token),
    shownForLogin: get(ASSIST_POPUP_KEYS.shownFor),
    dismissals:    parseInt(get(ASSIST_POPUP_KEYS.dismissals) || '0', 10) || 0,
    requested:     get(ASSIST_POPUP_KEYS.requested) === '1',
  };
}

export function markAssistPopupShown(loginKey: string): void { set(ASSIST_POPUP_KEYS.shownFor, loginKey); }
export function markAssistPopupDismissed(): void {
  const n = parseInt(get(ASSIST_POPUP_KEYS.dismissals) || '0', 10) || 0;
  set(ASSIST_POPUP_KEYS.dismissals, String(n + 1));
}
export function markAssistRequested(): void { set(ASSIST_POPUP_KEYS.requested, '1'); }
