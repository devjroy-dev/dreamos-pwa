'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  API, INK, CREAM, GOLD, MUTED, HAIRLINE, FONT_EYEBROW, FONT_DISPLAY, FONT_BODY,
  CircleSession, CircleSessionContext,
  setCircleToken, circleAuthHeaders, circleRefused, CIRCLE_REFUSAL_EVENT,
  brideName } from './CircleSessionContext';
import TabBar from './TabBar';

const SESSION_KEY = 'circle_session';
const LAST_PATH_KEY = 'circle_last_path';

export default function CoplannerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const [session, setSession] = useState<CircleSession | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'no_session' | 'error'>('loading');
  // F-07.72 — set when the hydration refresh is REFUSED (401) rather than merely
  // failing. See `hydrate` below for why the two are not the same event.
  const [expired, setExpired] = useState(false);

  // Persist last path so a returning install lands where Mom left off.
  useEffect(() => {
    if (state !== 'ready' || !pathname) return;
    try { localStorage.setItem(LAST_PATH_KEY, pathname); } catch {}
  }, [pathname, state]);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      let cached: CircleSession | null = null;
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) cached = JSON.parse(raw) as CircleSession;
      } catch {}

      if (!cached || !cached.user_id) {
        if (!cancelled) setState('no_session');
        return;
      }

      if (!cancelled) {
        setSession(cached);
        setState('ready');
      }

      // Refresh the session in the background. Don't block the UI.
      // (This said 「 refresh permissions 」 until M-TRUST, 2026-08-14 retired
      // them; the refresh still matters — it is how a revoked member's session
      // dies — but permissions are not what it carries any more.)
      try {
        const r = await fetch(`${API}/api/v2/circle/session/${cached.user_id}`, {
          headers: circleAuthHeaders(),
        });
        // ── F-07.72 · A REFUSAL AND A NETWORK BLIP ARE NOT THE SAME EVENT ────
        // A 401 means the credential is gone or spent, and the only honest answer
        // is to ask for the PIN again. Anything else — a 500, a timeout, an
        // offline phone — keeps the cached session on screen exactly as this file
        // has always behaved, because signing someone out over a dropped packet
        // is a worse failure than showing her a slightly stale session.
        //
        // THIS BRANCH CANNOT FIRE IN THIS DELIVERY, BY CONSTRUCTION AND ON PURPOSE.
        // The lane enforces nothing yet: no circle door returns 401 at this tip.
        // It is wired now so the enforcement delivery is a SERVER change alone,
        // and so this path ships proven rather than written-and-first-run against
        // a live member — which is the shape F-07.72 exists to punish.
        // FORK B — this file no longer clears the credential itself. The four
        // lines that stood here are `circleRefused()` in
        // CircleSessionContext.tsx, so that EVERY screen on the lane can reach
        // the same sign-out instead of only this one fetch at only this one
        // moment. The listener below turns the event back into UI state.
        if (circleRefused(r)) {
          if (cancelled) return;
          return;
        }
        const d = await r.json();
        if (cancelled) return;
        if (d.success && d.data) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(d.data));
          setSession(d.data as CircleSession);
        }
      } catch {
        // Network blip — keep using cached session.
      }
    };

    hydrate();
    return () => { cancelled = true; };
  }, []);

  // ── FORK B · THE ONE LISTENER ───────────────────────────────────────────────
  // `circleRefused()` has already cleared the credential and the cached session
  // by the time this fires; all that is left is the UI half. It is a SEPARATE
  // effect from the hydration above on purpose: hydration runs once at mount,
  // and the whole point of this fork is that a refusal can arrive at any moment
  // afterwards, from any screen.
  useEffect(() => {
    const onRefused = () => { setSession(null); setExpired(true); setState('no_session'); };
    window.addEventListener(CIRCLE_REFUSAL_EVENT, onRefused);
    return () => window.removeEventListener(CIRCLE_REFUSAL_EVENT, onRefused);
  }, []);

  // ── D-5 · C-8's MEMBER KEY ────────────────────────────────────────────────
  // The manifest href carries the bride's name so the installed icon reads
  // "{Bride first name}'s Circle". This layout is the lawful place to mint it:
  // it already holds the session, and `app/coplanner/manifest/route.ts` — which
  // never names `circle_session` — reads only what arrives here.
  //
  // THE FULL NAME IS PASSED, NOT A SLICE. `brideName()` falls back to the two
  // words "the bride" when the couple has no name on file; slicing a first name
  // out of a sentinel is how an icon ends up reading "the's Wedding Circle".
  // The handler owns absent-identity detection (rule ㉕), at one site, on the
  // whole string. Before hydration `session` is null, the href carries no
  // parameter, and the manifest serves the house wording — which is the correct
  // thing for a browser that has fetched it before she has signed in.
  const manifestHref = session
    ? `/coplanner/manifest?b=${encodeURIComponent(brideName(session))}`
    : '/coplanner/manifest';

  return (
    <div style={{
      minHeight: '100vh',
      background: INK,
      color: CREAM,
      fontFamily: FONT_BODY,
    }}>
      {/* Per-scope manifest, mirroring `app/admin/layout.tsx`'s shape — the
          coplanner installs as its own app, named for her wedding. */}
      <head>
        <link rel="manifest" href={manifestHref} />
      </head>

      {state === 'loading' && (
        <FullScreenMessage title="" sub="Loading…" />
      )}

      {state === 'no_session' && (
        <CoplannerSignIn
          expired={expired}
          onSuccess={(s: CircleSession) => {
            localStorage.setItem(SESSION_KEY, JSON.stringify(s));
            setSession(s);
            setExpired(false);
            setState('ready');
          }}
        />
      )}

      {state === 'ready' && session && (
        <CircleSessionContext.Provider value={session}>
          <main style={{
            maxWidth: 480, margin: '0 auto',
            padding: '24px 20px 96px',
            minHeight: '100vh',
          }}>
            {children}
          </main>
          <TabBar />
        </CircleSessionContext.Provider>
      )}
    </div>
  );
}

function FullScreenMessage({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 32,
    }}>
      {title && (
        <p style={{
          fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 300,
          fontSize: 28, color: CREAM, margin: '0 0 8px', textAlign: 'center',
        }}>{title}</p>
      )}
      <p style={{
        fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
        color: MUTED, textAlign: 'center', lineHeight: 1.6, maxWidth: 320,
      }}>{sub}</p>
      <span style={{ color: GOLD, fontSize: 1, opacity: 0 }}>·</span>
    </div>
  );
}

// ── F-07.104 CURED · THE RETURNING MEMBER'S SIGN-IN ──────────────────────────
// THE DISEASE. This screen opened by calling
//   GET /api/v2/auth/pin-status?phone=<10 digits>&role=couple
// and that call could never have worked, on FOUR independent counts, each
// derived at F-07.72's read-first against the tree:
//   1. VERB      — src/api/pin-status.js:51 is the only handler and it is POST.
//                  One mount, router.js:24. A GET returns 404.
//   2. FORMAT    — :49 demands E.164; this sent ten bare digits.
//   3. FIELDS    — the server answers `exists` / `user_id`; this read
//                  `d.found` / `d.userId`.
//   4. SEMANTICS — role:'couple' looks up a `couples` row by the MEMBER's
//                  users.id, and a circle member owns no couples row. Even a
//                  syntactically perfect call answers exists:false.
// So the "Welcome back." screen could only ever say it did not recognise her,
// and src/api/circle/verifyPin.js — the door this lane is named for — had no
// reachable caller in production. F-07.66's class one lane over: a page from a
// design the estate abandoned, wearing a working name.
//
// THE CURE IS A DELETION, NOT A CORRECTION. verifyPin.js:37 calls toE164 itself
// (src/lib/phone.js:26-31 — ten bare digits become +91…), so the pre-check was
// structurally moot and pin-status leaves this flow entirely rather than being
// repaired into it. Phone → PIN → verify-pin, which now returns the userId AND
// the lane's signed session in one call.
//
// CONTROL INVENTORY (CE-115, tabled at the read-first and ruled):
//   KEPT    — phone input · +91 label · Continue → · Enter-to-submit · the four
//             PIN inputs and their focus advance · THE AUTO-SUBMIT VERB (a
//             capability one layer above the inputs, CLAUSE 2) · "Auto-submits
//             when complete." · the three step captions · the step machine ·
//             the error slot · the post-verify session fetch.
//   CHANGED — Continue's handler (no fetch; it advances the step) · onSuccess
//             (writes the session AND the token) · the hydration refresh
//             (carries the token; tells a refusal from a blip).
//   REMOVED-BY-RULING — the pin-status fetch · the `userId` state, whose only
//             writer was that fetch; verify-pin returns the id now.
//   MOVED   — the two guard sentences. They were client-side strings fired after
//             the pre-check at the PHONE step. They are now the SERVER's words
//             at the PIN step (verifyPin.js's 404 and 403/400), founder-vetoed
//             and frozen at the byte. The error slot did not move; its SOURCES
//             did, and that is the whole of the user-visible difference.
function CoplannerSignIn({ expired, onSuccess }: {
  expired: boolean;
  onSuccess: (session: CircleSession) => void;
}) {
  const [step, setStep] = useState<'phone' | 'pin' | 'verifying'>('phone');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const submitPhone = () => {
    const bare = phone.replace(/\D/g, '').slice(-10);
    if (bare.length < 10) { setError('Enter a 10-digit phone number'); return; }
    setError('');
    setStep('pin');
    setPin(['', '', '', '']);
    setTimeout(() => pinRefs.current[0]?.focus(), 100);
  };

  const submitPin = async (pinStr: string) => {
    setError('');
    setStep('verifying');
    try {
      const vr = await fetch(`${API}/api/v2/auth/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, '').slice(-10),
          pin: pinStr,
        }),
      });
      const vd = await vr.json();
      if (!vd.success) {
        // The server's own sentence, verbatim — those bytes are the founder's,
        // frozen 2026-08-02. The fallback covers a transport-shaped failure that
        // carried no `error` field at all; it is never a paraphrase of a message
        // the server did send.
        setError('Something went wrong.');
        setStep('pin');
        setPin(['', '', '', '']);
        return;
      }

      // F-07.72 — hold the credential BEFORE the session fetch, so that fetch is
      // the first request in this lane's history to carry one.
      if (vd.token) setCircleToken(vd.token);

      const sr = await fetch(`${API}/api/v2/circle/session/${vd.userId}`, {
        headers: circleAuthHeaders(),
      });
      // A 401 HERE MEANS THE MINT AND THE GUARD DISAGREE — the door just issued
      // a token the door beside it will not take. It is not a stale credential
      // and it must not be reported as one, so it takes the generic sentence
      // below rather than the expired path.
      const sd = sr.status === 401 ? { success: false } : await sr.json();
      if (!sd.success) {
        setError("Couldn't load your Circle. Try again or use your invite link.");
        setStep('phone');
        return;
      }
      onSuccess(sd.data as CircleSession);
    } catch {
      setError('Sign in failed. Try again.');
      setStep('pin');
    }
  };

  const handlePinChange = (i: number, v: string) => {
    const digit = v.replace(/[^0-9]/g, '').slice(-1);
    const next = [...pin]; next[i] = digit;
    setPin(next);
    if (digit && i < 3) pinRefs.current[i + 1]?.focus();
    if (next.every(d => d)) submitPin(next.join(''));
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 32,
      background: INK, color: CREAM,
    }}>
      <div style={{ maxWidth: 360, width: '100%' }}>
        <p style={{
          fontFamily: FONT_EYEBROW, fontWeight: 200, fontSize: 9,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          color: GOLD, margin: '0 0 12px', textAlign: 'center',
        }}>YOUR CIRCLE</p>
        <p style={{
          fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 300,
          fontSize: 28, color: CREAM, margin: '0 0 8px', textAlign: 'center',
        }}>Welcome back.</p>
        <p style={{
          fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
          color: MUTED, margin: '0 0 32px', textAlign: 'center', lineHeight: 1.6,
        }}>
          {/* The founder's byte, frozen 2026-08-02. Shown in place of the step
              caption when a refused credential sent her back here: the reason
              she is looking at this screen is the most useful thing to say. */}
          {expired && step !== 'verifying'
            ? 'Your sign-in expired. Enter your PIN again.'
            : (<>
                {step === 'phone' && 'Enter your number to sign back in.'}
                {step === 'pin' && 'Enter your 4-digit PIN.'}
                {step === 'verifying' && 'One moment…'}
              </>)}
        </p>

        {step === 'phone' && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: `0.5px solid ${HAIRLINE}`, marginBottom: 20,
            }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: MUTED }}>+91</span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="00000 00000"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onKeyDown={e => { if (e.key === 'Enter') submitPhone(); }}
                style={{
                  flex: 1, padding: '12px 0',
                  background: 'transparent', border: 'none',
                  fontFamily: FONT_BODY, fontSize: 16, color: CREAM, outline: 'none',
                }}
              />
            </div>
            <button onClick={submitPhone} style={{
              width: '100%', height: 48, background: GOLD, color: INK,
              border: 'none', borderRadius: 100, cursor: 'pointer',
              fontFamily: FONT_EYEBROW, fontWeight: 400, fontSize: 9,
              letterSpacing: '0.22em', textTransform: 'uppercase',
            }}>Continue →</button>
          </>
        )}

        {step === 'pin' && (
          <>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
              {pin.map((d, i) => (
                <input
                  key={i}
                  ref={r => { pinRefs.current[i] = r; }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handlePinChange(i, e.target.value)}
                  style={{
                    width: 48, height: 56, textAlign: 'center',
                    background: 'transparent',
                    border: `0.5px solid ${d ? GOLD : HAIRLINE}`,
                    borderRadius: 8,
                    fontFamily: FONT_BODY, fontSize: 24, color: CREAM, outline: 'none',
                  }}
                />
              ))}
            </div>
            <p style={{
              fontFamily: FONT_BODY, fontWeight: 300, fontSize: 11,
              color: MUTED, textAlign: 'center', margin: 0,
            }}>Auto-submits when complete.</p>
          </>
        )}

        {step === 'verifying' && (
          <p style={{
            fontFamily: FONT_BODY, fontSize: 13, color: GOLD,
            textAlign: 'center', margin: '20px 0',
          }}>Working on it…</p>
        )}

        {error && (
          <p style={{
            fontFamily: FONT_BODY, fontWeight: 300, fontSize: 12,
            color: '#E07262', margin: '16px 0 0', textAlign: 'center',
            lineHeight: 1.5,
          }}>{error}</p>
        )}
      </div>
    </div>
  );
}
