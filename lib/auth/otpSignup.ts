// lib/auth/otpSignup.ts — CE-42 · SEAT D3 · /plan SITTING 1 · FORK B (ruled α)
//
// THE ESTATE'S ONE OTP SIGN-UP PATH, FOR BOTH ROLES. Extracted whole from
// `app/(landing)/page.tsx`, where it had been the landing page's private
// business since F-05.9 moved signup off the dead Supabase Phone-OTP.
//
// WHY IT LEFT THAT FILE. `/plan` (R-41.94) is a second door onto the same
// mint: a stranger arriving from a link, giving a phone and a name, receiving
// a code on WhatsApp. A second copy of `sendOtp`/`verifyOtp` would be a second
// home for the endpoint choice, the session shape, the cookie mirror and the
// post-verify destination — and the day one of them is corrected the other
// keeps the defect (one-home law). So the landing page and `/plan` call this.
//
// BOTH ROLES TRAVEL, NOT A "COUPLE HALF". `const isVendor = role === 'Maker'`
// is the first line of each function and it decides the endpoint, the session
// key and the destination. Splitting the couple arm out would have left the
// vendor arm alone on the landing page reading a shape this file owns.
// `/plan` never sets role to 'Maker'; the vendor arm is untouched by that
// caller and is touched by this extraction only.
//
// SHAPE: a hook taking the caller's state and returning the pair (chair-ruled
// at D3's read-first, arm (b)). The twelve names these two functions close over
// — role, country, phone, otp, screen, joinName, joinCategory, showToast,
// setScreen, router, plus the two storage helpers — threaded as twelve
// positional arguments through four call sites is exactly where the vendor
// lane breaks silently. One object, one shape, four call sites.
//
// NO REACT HOOK IS CALLED HERE and that is deliberate: the two closures are
// rebuilt on every render, which is byte-for-byte the lifecycle they had as
// `const` arrows inside the component. Wrapping them in `useCallback` would be
// a behaviour change wearing the costume of a tidy-up.

// iOS Safari (normal browsing, installed PWA, or ITP-restricted contexts) can
// throw on localStorage.setItem even when the network is fine. The login flow
// previously did raw setItem inside the same try/catch as the fetch, so a
// storage throw surfaced as a misleading "Could not connect" toast and aborted
// sign-in. These helpers isolate storage writes and mirror the session to a
// first-party cookie, which works in contexts where localStorage throws — so
// login completes regardless of localStorage state.
export const SESSION_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch { /* iOS storage blocked/quota — cookie fallback covers it */ }
}

export function mirrorSessionToCookie(isVendor: boolean, session: unknown): void {
  if (typeof document === 'undefined') return;
  try {
    const name = isVendor ? 'tdw_vendor_session' : 'tdw_couple_session';
    const val  = encodeURIComponent(JSON.stringify(session));
    document.cookie = `${name}=${val}; max-age=${SESSION_COOKIE_MAX_AGE}; path=/; SameSite=Lax; Secure`;
  } catch { /* ignore */ }
}

// ── THE SESSION WRITE IS ONE ACT, SO IT IS ONE FUNCTION (chair-ruled, B-3) ──
// These three lines stood twice in the landing page, identical: once at the end
// of `verifyOtp` and once on the returning-member path with a PIN already set.
// Extracting only `verifyOtp` would have put the two copies in two different
// FILES, which is the same defect with a harder seam. `handleSignIn` stays on
// the landing page and calls this; that is the one line this extraction writes
// into a function it does not otherwise move.
//
// Storage first, cookie second, in that order: the cookie is the fallback for
// the context where the storage write threw, and `safeSetItem` swallows its own
// throw, so the mirror must not be gated behind it.
export function persistSession(isVendor: boolean, session: unknown): void {
  const sessionKey = isVendor ? 'vendor_web_session' : 'couple_web_session';
  safeSetItem(sessionKey, JSON.stringify(session));
  safeSetItem(isVendor ? 'vendor_session' : 'couple_session', JSON.stringify(session));
  mirrorSessionToCookie(isVendor, session);
}

// The caller's state, structurally typed so this file imports nothing from the
// pages that call it. `setScreen` and `router.push` are narrower here than at
// either call site, which is the correct direction: this file may only send the
// caller to the screens and routes it names below.
export interface OtpSignupDeps {
  role: string | null;
  country: { dialCode: string };
  phone: string;
  otp: string[];
  screen: string;
  joinName: string;
  joinCategory: string;
  showToast: (m: string) => void;
  setScreen: (s: 'signin_otp' | 'join_otp') => void;
  router: { push: (href: string) => void };
  apiBase: string;
}

export interface OtpSignup {
  sendOtp: (phoneNum: string, nameArg?: string) => Promise<void>;
  verifyOtp: () => Promise<void>;
}

export function useOtpSignup(deps: OtpSignupDeps): OtpSignup {
  const {
    role, country, phone, otp, screen, joinName, joinCategory,
    showToast, setScreen, router, apiBase: API_BASE,
  } = deps;

  // ═══════════════════════════════════════════════════════════════════════════
  // F-05.89 [R-37.1] — THE NAME TRAVELS WITH THE SEND-CODE REQUEST
  // ═══════════════════════════════════════════════════════════════════════════
  // The join door has made the first name COMPULSORY since 89e03eb, and this
  // function then posted the phone ALONE — the typed name sat in component
  // state until `verifyOtp` reached /provision, which only runs after a
  // successful OTP. Every abandon in between minted a permanent NAMELESS row.
  // The founder's census of 2026-08-25 measured 31 of them. His word: "the
  // first name that's entered must not be discarded. it defeats the entire
  // purpose of getting their name altogether."
  //
  // THE NAME IS AN ARGUMENT, NOT READ STATE, AND THAT IS THE WHOLE OF R-37.15.
  // `joinName` is one `useState` on a component that renders EVERY screen, so
  // it survives every screen transition. This function has FOUR callers — the
  // join door's Send code, the two sign-in paths (an unrecognised number, and
  // a returning member with no PIN), and Resend — and if it read `joinName` off
  // state, a visitor who typed "Priya" at the join door, backed out to Sign in,
  // and entered A DIFFERENT NUMBER would ship "Priya" to the fresh mint of a
  // stranger's phone. Server-side never-clobber would then protect that error
  // permanently. The door that COLLECTED the name is the only door that spends
  // it; every other caller passes nothing, deliberately, and a bench cell
  // asserts the sign-in path ships no name.
  //
  // ⚠ THE CALLERS ARE NAMED BY ROLE AND CARRY NO LINE NUMBERS — F-42.61, ruled
  // and closed at D3. This comment used to cite four lines in the file it lived
  // in; every one of them had rotted, and now that the callers are in a
  // DIFFERENT file a line cite could not be true for longer than one edit.
  //
  // The server owns the coercion (textPresent + an 80-cap at both send-otp
  // doors) — this side sends what was typed and does not second-guess it.
  const sendOtp = async (phoneNum: string, nameArg?: string) => {
    const isVendor = role === 'Maker';
    const digits = phoneNum.replace(/\D/g, '');
    const e164 = country.dialCode + digits;

    // F-05.9: the backend delivers the OTP over Meta (WhatsApp) and self-mints
    // public.users + the role row — open signup, any number. The dead Supabase
    // Phone-OTP (Twilio) path is gone; the auth identity is created at verify time.
    const endpoint = isVendor
      ? `${API_BASE}/api/v2/vendor/auth/send-otp`
      : `${API_BASE}/api/v2/couple/auth/send-otp`;
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164, name: nameArg?.trim() || undefined }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || d.error) { showToast(d.error || 'Could not send code. Try again.'); return; }
      setScreen(screen === 'signin_phone' ? 'signin_otp' : 'join_otp');
    } catch { showToast('Could not send code. Try again.'); }
  };

  const verifyOtp = async () => {
    const isVendor = role === 'Maker';
    const digits = phone.replace(/\D/g, '');
    const e164 = country.dialCode + digits;
    try {
      // 1 — Backend verifies the Meta OTP, creates-or-heals the auth identity, and mints
      //     the session (F-05.9). Returns ids + tokens directly.
      const vRes = await fetch(`${API_BASE}/api/v2/${isVendor ? 'vendor' : 'couple'}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164, otp: otp.join(''), purpose: 'login' }),
      });
      const v = await vRes.json().catch(() => ({}));
      if (!vRes.ok || !v.ok || !v.access_token) { showToast(v.error || 'Incorrect code.'); return; }
      const accessToken  = v.access_token;
      const refreshToken = v.refresh_token;

      // 2 — Provision the vendor|couple row for this Supabase identity (idempotent;
      //     phone-fallback re-binds a legacy account). Returns ids + pin_set, no tokens.
      const provEndpoint = isVendor
        ? `${API_BASE}/api/v2/vendor/auth/provision`
        : `${API_BASE}/api/v2/couple/auth/provision`;
      const pRes = await fetch(provEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ phone: e164, name: joinName.trim() || undefined, category: isVendor ? (joinCategory || undefined) : undefined }),
      });
      const d = await pRes.json();
      if (!d.ok) { showToast(d.error || 'Could not complete sign-in.'); return; }

      const roleId = isVendor ? d.vendor_id : d.couple_id;
      const userId = d.user_id;
      const pinSet = !!d.pin_set;

      // R-X10 arm (a): there is no ceremony to divert into. Provision self-mints
      // `public.users` and the role row at verify time, so a number this estate has
      // never seen is admitted like any other. If ids are still missing the write
      // genuinely failed, and it is reported as the failure it is — never dressed as
      // an exclusivity gate. The byte below already exists on this screen's other
      // failure path; no new copy is minted here.
      if (!userId || !roleId) { showToast('Could not complete sign-in.'); return; }

      if (accessToken)  safeSetItem('access_token', accessToken);
      if (refreshToken) safeSetItem('refresh_token', refreshToken);

      const sessionData = {
        id: roleId, userId, vendorId: roleId,
        phone: e164,
        pin_set: pinSet,
        name: v.name || d.name || null,
        vendorName: v.name || d.name || null,
        category: v.category || d.category || null,
        tier: v.tier || d.tier || null,
        dreamer_type: d.dreamer_type || 'basic',
        access_token:  accessToken  || null,
        refresh_token: refreshToken || null,
        _v: 2,
      };
      persistSession(isVendor, sessionData);

      // ── F-OB.14 · ARM 3b [R-35.12] ──────────────────────────────────────────
      // `d.name` is the POST-WRITE witness that dream-os `/provision` began
      // returning on 2026-08-18 (src/api/couple/auth.js). Until it existed the
      // read was ALWAYS `undefined`, so `!d.name` was permanently true and this
      // whole line collapsed to `!isVendor && !pinSet` — the name half was dead
      // on arrival and had never once decided anything.
      //
      // WHY `||` AND NOT `&&`, which is the entire ruling. Two brides must reach
      // the form and the old shape caught only one of them:
      //   · PINLESS, any name — the term `!pinSet` alone. Preserved BYTE-EXACT,
      //     deliberately: today every pinless couple routes here, and swapping to
      //     `&& !d.name` would send a NAMED pinless bride to `/couple/pin`
      //     instead. That is a regression, and §8 SCOPE LAW ranks a regression
      //     worse than a missing feature.
      //   · PINNED AND NAMELESS — the term `!d.name`. This is the case F-OB.14
      //     was minted for: a returning bride from the nameless stock logs in,
      //     `!pinSet` is false, and under the old shape the expression
      //     short-circuited before her missing name was ever consulted. She went
      //     to pin-login and never met the form. Now she does.
      //
      // The budget half of `brideComplete` is deliberately NOT consulted here
      // [R-35.12]: a signup-door decision does not drag a second field into
      // itself when the frost guard (app/(frost)/layout.tsx) already owns the
      // whole verdict in-app.
      //
      // ⚠ THIS BRANCH IS WHAT MAKES FORK C(a) THE REAL PATH FOR /plan. A stranger
      // arriving from a public link has no PIN and no name, so `coupleNeedsOnboarding`
      // is true and she goes to `/couple/onboarding` — the `/couple/pin` arm below is
      // unreachable for her. Any card that promises OTP → pin → /frost is describing
      // a walk that does not exist.
      const coupleNeedsOnboarding = !isVendor && (!pinSet || !d.name);
      if (coupleNeedsOnboarding) {
        router.push('/couple/onboarding');
      } else if (isVendor) {
        router.push(pinSet ? '/vendor/pin-login' : '/vendor/pin');
      } else {
        router.push(pinSet ? '/couple/pin-login' : '/couple/pin');
      }
    } catch { showToast('Verification failed.'); }
  };

  return { sendOtp, verifyOtp };
}
