'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE } from '../../../../lib/api';
// F-07.72 — the co-planner's token authority, imported rather than re-implemented.
// This page is the lane's SECOND mint point (`/circle/join/accept` now returns a
// signed session), and it already writes `circle_session` by string literal. A
// second local copy of the credential's storage rules is exactly the geometry
// F-07.70 spent a sitting removing from sanctuary; one authority, two callers.
import { setCircleToken, circleAuthHeaders } from '../../../coplanner/CircleSessionContext';
// D-5 — the restyle is tokens-only. These are the circle lane's vocabulary and
// they live in the file above; the local `const GOLD` this page carried was a
// second home for a colour that already had one. Imported on a SEPARATE line
// because the import above is pinned character-exact by
// `tdw07_f0772_circle.proof.mjs` §6.5 and extending it would redden that cell.
import { GOLD, INK, CREAM, MUTED, FONT_DISPLAY, FONT_BODY, FONT_EYEBROW }
  from '../../../coplanner/CircleSessionContext';


const EASE = 'cubic-bezier(0.22,1,0.36,1)';
// LABELLED, NOT CURED (R-33.3, chair's ruling at tranche 2): the glass and
// overlay alphas below have NO token in the circle vocabulary — that file
// exports INK/CREAM/GOLD/MUTED/HAIRLINE and no surface-alpha scale. Inventing
// one here would be a second token home, which is the geometry this delivery
// is removing. They stay as literals with this sentence attached.
const GLASS  = 'rgba(255,255,255,0.08)';
const SCRIM  = 'rgba(12,10,9,0.38)';
const EDGE   = 'rgba(255,255,255,0.1)';
const S: React.CSSProperties = { position: 'absolute', inset: 0 };

// ── F-14.22 · THE ERROR STEP'S GROUND ───────────────────────────────────────
// The error step had none. SCRIM above is the BOTTOM STRIP's ground, and the
// error step is the branch that REPLACES the strip (`step !== 'error'`), so it
// inherited nothing: two lines of type at zIndex 20 over a full-bleed cover
// photograph, a vignette that is transparent at 20% centre — exactly where this
// text sits — and one 0.18 wash. On a bright cover the sentence telling a member
// her invite is spent was unreadable.
//
// WHY A PANEL AND NOT A STRONGER SCRIM (adopted into R-33.9 at CE-33 §6):
// contrast against an unknown photograph is not benchable — a cell could only
// assert an alpha and call it legibility. Against a FIXED, OPAQUE ground it is
// arithmetic, and `tdw14_d5c_step9.proof.mjs` §2 computes it rather than
// trusting it. INK is the circle's own ground and is already imported, so this
// costs no token and no new raw hex inside f0772's radius.
const ERROR_PANEL: React.CSSProperties = {
  background: INK,
  border: `0.5px solid ${EDGE}`,
  borderRadius: 16,
  padding: '28px 24px',
  maxWidth: 340,
  width: '100%',
};

// D-5 — `success` is NEW. Before this delivery `/set-pin` pushed straight to
// /coplanner, so C-8's "join-success ends on Add to your home screen taught
// inline" had no surface to live on at all. It does now.
type Step = 'loading' | 'welcome' | 'phone' | 'otp' | 'pin' | 'success' | 'error';

// The install gesture differs by platform and there is no honest neutral
// wording — "add this to your home screen" tells an Android user to look for a
// Share sheet that isn't there. Ruled at the sheet (E5): iOS and Android each
// get their own byte, and an undetectable platform gets NO teaching line —
// arrival and CTA still render. Teaching a gesture you cannot detect is
// guessing, and the sheet records that silence as an expected-zero.
type Platform = 'ios' | 'android' | 'unknown';

const OTP_LEN = 6;

// ⑯ — one condition, one home. This byte stood at TWO call sites (the
// /accept catch and the /set-pin catch) as two identical literals; the sheet
// collapsed them the same way the server's nine were collapsed.
const TOAST_GENERIC = 'Something went wrong. Try again.';

export default function CircleJoinPage() {
  const params   = useParams();
  const router   = useRouter();
  const token    = params?.token as string || '';

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slidesRef   = useRef<string[]>([]);
  const otpRefs     = useRef<(HTMLInputElement | null)[]>([]);
  const pinRefs     = useRef<(HTMLInputElement | null)[]>([]);

  const [slides, setSlides]       = useState<string[]>([]);
  const [cur, setCur]             = useState(0);
  const [step, setStep]           = useState<Step>('loading');
  const [brideName, setBrideName] = useState('');
  const [inviteeName, setInviteeName] = useState('');
  const [expanded, setExpanded]   = useState(false);
  const [phone, setPhone]         = useState('');
  const [otp, setOtp]             = useState(Array(OTP_LEN).fill(''));
  const [pin, setPin]             = useState(['', '', '', '']);
  const [userId, setUserId]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState('');
  const [errorMsg, setErrorMsg]   = useState('');
  // Computed in an effect, never at render: this is a client component but it
  // still server-renders, and reading `navigator` at render would mismatch on
  // hydration. 'unknown' is therefore also the pre-hydration state, which is
  // the correct one — it renders no teaching line.
  const [platform, setPlatform]   = useState<Platform>('unknown');

  useEffect(() => {
    const ua = typeof navigator === 'undefined' ? '' : (navigator.userAgent || '');
    if (/iPad|iPhone|iPod/.test(ua)) { setPlatform('ios'); return; }
    // iPadOS 13+ reports a Macintosh UA; the touch probe is what separates it
    // from a desktop Mac, which must stay 'unknown' and get no teaching line.
    if (/Macintosh/.test(ua) && typeof document !== 'undefined' && 'ontouchend' in document) {
      setPlatform('ios'); return;
    }
    if (/Android/.test(ua)) { setPlatform('android'); return; }
    setPlatform('unknown');
  }, []);

  useEffect(() => { slidesRef.current = slides; }, [slides]);

  // Start carousel
  const startCarousel = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() =>
      setCur(c => (c + 1) % Math.max(slidesRef.current.length, 1)), 4000);
  }, []);

  useEffect(() => {
    // Fetch cover photos — same catalogue as the main gate
    fetch(`${API_BASE}/api/v2/landing-slides`)
      .then(r => r.json())
      .then(d => { if (d.slides?.length) setSlides(d.slides.map((p: any) => p.image_url)); })
      .catch(() => {});
    startCarousel();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startCarousel]);

  // Validate token on mount
  useEffect(() => {
    if (!token) { setErrorMsg('Invalid invite link.'); setStep('error'); return; }
    fetch(`${API_BASE}/api/v2/circle/join/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setBrideName(d.data.bride_name);
          setInviteeName(d.data.invitee_name);
          setStep('welcome');
        } else {
          // E3 — the `|| '…'` fallback that stood here was dead copy: this door
          // always populates `error` (src/api/circle/join.js, one byte per
          // condition). Freezing text no member can read is machinery waiting
          // for a caller that never comes; it is deleted, not frozen.
          setErrorMsg(d.error);
          setStep('error');
        }
      })
      .catch(() => { setErrorMsg("We couldn’t reach the invite. Check your connection and try again."); setStep('error'); });   // ⑮
  }, [token]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const sendOtp = async () => {
    const bare = phone.replace(/\D/g, '').slice(-10);
    if (bare.length < 10) { showToast("That doesn’t look like a 10-digit number."); return; }   // ⑭
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/v2/circle/join/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, phone: bare }),
      });
      const d = await r.json();
      if (!d.success) { showToast(d.error); setLoading(false); return; }   // E3 — dead fallback deleted
      setStep('otp');
      setOtp(Array(OTP_LEN).fill(''));
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    // ⑯, third caller. RULED 2026-08-14 after the sheet had closed: this
    // catch is CLIENT-SIDE failure before the server ever speaks, which is
    // ⑯'s own class, so it takes ⑯'s frozen byte rather than minting a
    // tenth. Giving it ㉝'s warmer server sentence was refused on arithmetic
    // — that would twin one string across two repos, which is the duplicate the
    // one-home law exists to prevent, for a marginal gain on a rare blip.
    //
    // HOW IT WAS MISSED. 'Could not send code. Try again.' stood at TWO sites
    // in the pre-D-5 file: a dead `d.error ||` fallback and this live catch.
    // The copy inventory counted the string ONCE and folded both under the
    // dead-fallback line, so the live one never reached the veto sheet. The
    // one-condition-two-wordings disease D-5 cured server-side had survived
    // client-side, inside a census fold.
    } catch { showToast(TOAST_GENERIC); }
    setLoading(false);
  };

  const verifyOtp = async (code: string) => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/v2/circle/join/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, phone, otp: code }),
      });
      const d = await r.json();
      if (!d.success) { showToast(d.error); setLoading(false); return; }   // E3 — dead fallback deleted
      setUserId(d.data.user_id);
      // F-07.72 — /accept mints the lane's session. Held BEFORE the partial
      // session is written, so a member who joins and closes the tab mid-flow
      // still returns holding a credential.
      if (d.data.token) setCircleToken(d.data.token);
      // Save partial session
      localStorage.setItem('circle_session', JSON.stringify(d.data));
      if (d.data.pin_set) {
        // D-5 — a member whose circle already has its shared PIN skips the PIN
        // step, but she is still arriving for the FIRST time and still needs
        // the install taught. Both arms land on `success`; neither pushes.
        setStep('success');
      } else {
        setStep('pin');
        setPin(['', '', '', '']);
        setTimeout(() => pinRefs.current[0]?.focus(), 200);
      }
    } catch { showToast(TOAST_GENERIC); }
    setLoading(false);
  };

  const handleOtp = (i: number, v: string) => {
    const digit = v.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp]; next[i] = digit;
    setOtp(next);
    if (digit && i < OTP_LEN - 1) otpRefs.current[i + 1]?.focus();
    if (next.every(d => d) && next.join('').length === OTP_LEN) verifyOtp(next.join(''));
  };

  const setUserPin = async (pinStr: string) => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/v2/circle/join/set-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, pin: pinStr }),
      });
      const d = await r.json();
      if (!d.success) { showToast(d.error); setLoading(false); return; }   // E3 — dead fallback deleted
      // Fetch full session
      const sr = await fetch(`${API_BASE}/api/v2/circle/session/${userId}`, {
        headers: circleAuthHeaders(),
      });
      // FORK B DELIBERATELY DOES NOT APPLY HERE, and the reason is worth a line.
      // `circleRefused()` CLEARS the credential — correct on every screen that
      // reads a stale one, and wrong on this one, which is holding a token minted
      // ninety seconds ago at `/accept` (:124). A 401 at this point would mean
      // the mint and the guard disagree, not that her session went stale, and
      // throwing away a fresh credential would strand a brand-new member on a
      // sign-in screen she has no PIN for yet. It falls through to the toast.
      const sd = sr.status === 401 ? { success: false } : await sr.json();
      if (sd.success) localStorage.setItem('circle_session', JSON.stringify(sd.data));
      // D-5 — this line was `router.push('/coplanner')`. The success step is
      // inserted AROUND the refused-exception block above, never through it:
      // the 401 ternary, the absent `circleRefused`, and the reason-in-the-file
      // are `tdw07_f0772_circle.proof.mjs` §9.5's three needles and are
      // untouched. Only the destination moved.
      setStep('success');
    } catch { showToast(TOAST_GENERIC); }
    setLoading(false);
  };

  const handlePin = (i: number, v: string) => {
    const digit = v.replace(/[^0-9]/g, '').slice(-1);
    const next = [...pin]; next[i] = digit;
    setPin(next);
    if (digit && i < 3) pinRefs.current[i + 1]?.focus();
    if (next.every(d => d)) setUserPin(next.join(''));
  };

  // ── Shared styles ──────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 0',
    background: 'transparent', border: 'none',
    borderBottom: '0.5px solid rgba(248,247,245,0.25)',
    fontFamily: FONT_BODY, fontWeight: 300,
    fontSize: 16, color: CREAM, outline: 'none',
    letterSpacing: '0.02em',
  };

  const ctaStyle: React.CSSProperties = {
    width: '100%', height: 48, background: GOLD,
    border: 'none', borderRadius: 100, cursor: 'pointer',
    fontFamily: FONT_EYEBROW, fontSize: 9,
    fontWeight: 400, letterSpacing: '0.22em',
    textTransform: 'uppercase', color: INK,
    marginTop: 20, opacity: loading ? 0.6 : 1,
  };

  const otpBoxStyle = (filled: boolean): React.CSSProperties => ({
    width: 40, height: 48, textAlign: 'center',
    background: GLASS,
    border: `0.5px solid ${filled ? GOLD : 'rgba(248,247,245,0.2)'}`,
    borderRadius: 8, color: CREAM, fontSize: 20,
    fontFamily: FONT_DISPLAY, outline: 'none',
    transition: 'border-color 200ms',
  });

  const pinBoxStyle = (filled: boolean): React.CSSProperties => ({
    width: 52, height: 52, textAlign: 'center',
    background: GLASS,
    border: `0.5px solid ${filled ? GOLD : 'rgba(248,247,245,0.2)'}`,
    borderRadius: 10, color: CREAM, fontSize: 22,
    fontFamily: FONT_DISPLAY, outline: 'none',
  });

  return (
    <div style={{ ...S, overflow: 'hidden', background: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Jost:wght@200;300;400&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(248,247,245,0.3); }
        ::-webkit-scrollbar { display: none; }
        @keyframes breathe { 0%,100%{opacity:0.22} 50%{opacity:0.45} }
      `}</style>

      {/* Carousel — same cover photos as the main gate */}
      {slides.map((url, i) => (
        <div key={i} style={{
          ...S,
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: i === cur ? 1 : 0,
          transition: `opacity 3s ${EASE}`,
          willChange: 'opacity',
        }} />
      ))}
      {/* Fallback dark bg while photos load */}
      {/* LABELLED, NOT CURED: the pre-load fallback ground has no token — the
          circle vocabulary carries INK but no lighter ground beneath it, and
          minting one here would be a second token home. The slides call itself
          is UNTOUCHED by founder ruling (「skip it」, 2026-08-14): the dressing
          is out of D-5's scope and F-14.18 stays open whole for Row 13. */}
      {slides.length === 0 && <div style={{ ...S, background: '#1A1715' }} />}

      {/* Vignette */}
      <div style={{
        ...S, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 60%, transparent 20%, rgba(0,0,0,0.6) 100%)',
      }} />

      {/* Dark overlay */}
      <div style={{ ...S, zIndex: 3, background: 'rgba(12,10,9,0.18)', pointerEvents: 'none' }} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
          border: '0.5px solid rgba(255,255,255,0.2)',
          padding: '10px 20px', zIndex: 100,
          fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
          color: CREAM, whiteSpace: 'nowrap', borderRadius: 100,
        }}>{toast}</div>
      )}

      {/* Error state */}
      {step === 'error' && (
        <div style={{
          ...S, zIndex: 20, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 32,
        }}>
          <div style={ERROR_PANEL}>
            <p style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 26, color: CREAM, textAlign: 'center', marginBottom: 12 }}>
              Hmm.
            </p>
            <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, color: 'rgba(248,247,245,0.6)', textAlign: 'center', lineHeight: 1.6 }}>
              {errorMsg}
            </p>
          </div>
        </div>
      )}

      {/* Bottom strip — same pattern as gate screen */}
      {step !== 'error' && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>
          <div
            onClick={() => { if (!expanded && step === 'welcome') setExpanded(true); }}
            style={{
              background: SCRIM,
              backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
              borderTop: '0.5px solid rgba(255,255,255,0.1)',
              padding: expanded
                ? '20px 24px calc(env(safe-area-inset-bottom, 16px) + 28px)'
                : '14px 24px calc(env(safe-area-inset-bottom, 12px) + 16px)',
              transition: `padding 400ms ${EASE}`,
              cursor: (!expanded && step === 'welcome') ? 'pointer' : 'default',
            }}
          >
            {/* Brand row — always visible */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <p style={{
                  fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                  fontWeight: 300, fontSize: 20, color: CREAM,
                  margin: 0, lineHeight: 1.15,
                }}>The Dream Wedding</p>
                <p style={{
                  fontFamily: FONT_EYEBROW, fontWeight: 200, fontSize: 7,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                  color: GOLD, margin: '4px 0 0',
                }}>THE CURATED WEDDING OS</p>
              </div>
              {!expanded && step === 'welcome' && (
                <p style={{
                  fontFamily: FONT_EYEBROW, fontWeight: 200, fontSize: 8,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'rgba(248,247,245,0.28)', margin: 0,
                  animation: 'breathe 3s ease-in-out infinite',
                }}>tap</p>
              )}
            </div>

            {/* Loading state */}
            {step === 'loading' && (
              <div style={{ paddingTop: 16, height: 40, display: 'flex', alignItems: 'center' }}>
                <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13, color: MUTED, margin: 0 }}>
                  One moment.{/* ① */}
                </p>
              </div>
            )}

            {/* Expanded panel */}
            <div style={{
              // D-5 — the success step is the tallest panel this strip has ever
              // carried (arrival + teaching + CTA). The clamp was authored for the
              // PIN step and would crop the install lesson, which is the one byte
              // on this screen that has a job to do after she leaves.
              maxHeight: expanded ? (step === 'success' ? '460px' : '360px') : '0px',
              overflow: 'hidden',
              transition: `max-height 440ms ${EASE}`,
            }}>
              <div style={{ paddingTop: 20 }}>

                {/* Welcome + phone step */}
                {(step === 'welcome' || step === 'phone') && (
                  <>
                    <p style={{
                      fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                      fontWeight: 300, fontSize: 18, color: CREAM,
                      margin: '0 0 4px', lineHeight: 1.3,
                    }}>
                      {/* ② — C-8's ruled line kept intact; her name appended by comma,
                          the same shape byte ⑧ took for n-way ties at D-3. */}
                      {brideName} invited you to her wedding circle{inviteeName ? `, ${inviteeName}` : ''}.
                    </p>
                    <p style={{
                      fontFamily: FONT_BODY, fontWeight: 300,
                      fontSize: 12, color: MUTED,
                      margin: '0 0 20px',
                    }}>
                      Enter your phone number.{/* ③ */}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 16, color: CREAM }}>+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Phone number"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        style={{ ...inputStyle, flex: 1 }}
                        autoFocus
                      />
                    </div>
                    <button onClick={sendOtp} disabled={loading} style={ctaStyle}>
                      {loading ? 'Sending…' : 'Send code'}{/* ⑥ ⑤ */}
                    </button>
                  </>
                )}

                {/* OTP step */}
                {step === 'otp' && (
                  <>
                    <p style={{
                      fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                      fontWeight: 300, fontSize: 18, color: CREAM,
                      margin: '0 0 4px',
                    }}>
                      We sent you a code.{/* ⑦ */}
                    </p>
                    <p style={{
                      fontFamily: FONT_BODY, fontWeight: 300,
                      fontSize: 12, color: MUTED,
                      margin: '0 0 20px',
                    }}>
                      {/* ⑧ — it arrives on WhatsApp, not SMS. Saying so is the
                          difference between her finding the code and looking in
                          the wrong app. The walk witnesses this claim. */}
                      On WhatsApp, to +91 {phone.replace(/\D/g, '').slice(-10)}
                    </p>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      {otp.map((d, i) => (
                        <input
                          key={i}
                          ref={r => { otpRefs.current[i] = r; }}
                          type="tel"
                          maxLength={1}
                          value={d}
                          onChange={e => handleOtp(i, e.target.value)}
                          style={otpBoxStyle(!!d)}
                        />
                      ))}
                    </div>
                    {loading && (
                      <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 12, color: GOLD, textAlign: 'center', marginTop: 16 }}>
                        Verifying…
                      </p>
                    )}
                  </>
                )}

                {/* ── SUCCESS STEP · D-5 ─────────────────────────────────
                    C-8's last clause, finally with a surface. Bytes ⑰-⑴
                    frozen at the character 2026-08-14. The install lesson is
                    taught INLINE — no modal, nothing to dismiss, nothing that
                    begs. She can read it, ignore it, and still tap through. */}
                {step === 'success' && (
                  <>
                    <p style={{
                      fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                      fontWeight: 300, fontSize: 22, color: CREAM,
                      margin: '0 0 4px',
                    }}>
                      You&rsquo;re in.{/* ⑰ */}
                    </p>
                    <p style={{
                      fontFamily: FONT_BODY, fontWeight: 300,
                      fontSize: 13, color: MUTED, margin: '0 0 20px',
                    }}>
                      {/* ⑱ — the bride's name is already in state from
                          /validate; no fetch was added to say it. */}
                      Welcome to {brideName}&rsquo;s wedding circle.
                    </p>

                    {/* E5 — an undetectable platform gets NO teaching line. The
                        arrival above and the CTA below still render; only the
                        gesture we cannot name stays silent. */}
                    {platform !== 'unknown' && (
                      <div style={{
                        borderTop: `0.5px solid ${EDGE}`,
                        paddingTop: 16, marginBottom: 4,
                      }}>
                        <p style={{
                          fontFamily: FONT_EYEBROW, fontWeight: 200, fontSize: 8,
                          letterSpacing: '0.22em', textTransform: 'uppercase',
                          color: GOLD, margin: '0 0 8px',
                        }}>
                          KEEP IT CLOSE
                        </p>
                        <p style={{
                          fontFamily: FONT_BODY, fontWeight: 300,
                          fontSize: 13, color: CREAM, margin: 0, lineHeight: 1.55,
                        }}>
                          {platform === 'ios'
                            ? 'Tap Share, then Add to Home Screen — the circle opens like an app.'   /* ⑲ */
                            : 'Tap your browser menu, then Install — the circle opens like an app.'} {/* ⑳ */}
                        </p>
                      </div>
                    )}

                    <button onClick={() => router.push('/coplanner')} style={ctaStyle}>
                      Go to the circle{/* ⑴ */}
                    </button>
                  </>
                )}

                {/* PIN step */}
                {step === 'pin' && (
                  <>
                    <p style={{
                      fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                      fontWeight: 300, fontSize: 18, color: CREAM,
                      margin: '0 0 4px',
                    }}>
                      Set your PIN.
                    </p>
                    <p style={{
                      fontFamily: FONT_BODY, fontWeight: 300,
                      fontSize: 12, color: MUTED,
                      margin: '0 0 20px',
                    }}>
                      {/* ⑪ — "the app" half-taught an install that has not happened
                          yet; the success step below does that job properly. */}
                      You&rsquo;ll use this each time you open the circle.
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                      {pin.map((d, i) => (
                        <input
                          key={i}
                          ref={r => { pinRefs.current[i] = r; }}
                          type="password"
                          maxLength={1}
                          value={d}
                          onChange={e => handlePin(i, e.target.value)}
                          style={pinBoxStyle(!!d)}
                        />
                      ))}
                    </div>
                    {loading && (
                      <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 12, color: GOLD, textAlign: 'center', marginTop: 16 }}>
                        Setting up your circle…{/* ⑫ */}
                      </p>
                    )}
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
