'use client';
export const dynamic = 'force-dynamic';

// app/demo/vendor/[handle]/page.tsx
// Demo vendor landing. One screen. Non-scrollable.
// Vendor's own photos carousel (2.5s auto-advance).
// Exact TDW frosted-entry-strip pattern — dark #0C0A09 base, warm espresso tones.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useParams, useRouter } from 'next/navigation';
import { fetchDemoVendor } from '@/lib/demo/api';
import type { DemoVendor, DemoPhoto } from '@/lib/demo/api';

const EASE = 'cubic-bezier(0.22,1,0.36,1)';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';

// Exact font stack from real app
const F = {
  display: "'Italiana', 'GFS Didot', Georgia, serif",
  script:  "'Cormorant Garamond', Georgia, serif",
  body:    "'DM Sans', system-ui, sans-serif",
  label:   "'Jost', system-ui, sans-serif",
};

export default function DemoLandingPage() {
  const params = useParams();
  const handle = typeof params.handle === 'string' ? params.handle : '';
  const router = useRouter();

  const [vendor,   setVendor]   = useState<DemoVendor | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [cur,      setCur]      = useState(0);
  const [entered,  setEntered]  = useState(false);
  const [reveal,   setReveal]   = useState(false);

  // Claim flow
  const [claimOpen,    setClaimOpen]    = useState(false);
  const [claimPhone,   setClaimPhone]   = useState('');
  const [claimSending, setClaimSending] = useState(false);
  // F-07.37: a failed claim now has somewhere true to land.
  const [claimError, setClaimError] = useState(false);
  const [claimDone,    setClaimDone]    = useState(false);

  const searchParams = useSearchParams();

  // Auto-open claim sheet if ?claim=1 (from header dropdown)
  useEffect(() => {
    if (searchParams?.get('claim') === '1') {
      setEntered(true);
      setClaimOpen(true);
    }
  }, [searchParams]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const photosRef   = useRef<string[]>([]);

  useEffect(() => {
    if (!handle) return;
    fetchDemoVendor(handle)
      .then(res => {
        setVendor(res.vendor);
        const urls = (res.vendor.photos ?? []).map((p: DemoPhoto) => p.url).filter(Boolean) as string[];
        photosRef.current = urls;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [handle]);

  const startCarousel = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCur(c => (c + 1) % Math.max(photosRef.current.length, 1));
    }, 2500);
  }, []);

  useEffect(() => {
    if (!loading && vendor) {
      startCarousel();
      const t = setTimeout(() => setReveal(true), 80);
      return () => clearTimeout(t);
    }
  }, [loading, vendor, startCarousel]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  async function handleClaim() {
    if (!claimPhone.trim() || claimSending) return;
    setClaimSending(true);
    // ── F-07.37 CURED · THE SCREEN HALF ───────────────────────────────────────
    // THIS BLOCK READ: `catch { /* silent — still show success */ }` followed by
    // an unconditional `setClaimDone(true)`. Both halves lied. The catch swallowed
    // network failure, and `res.ok` was never checked at all — so a 4xx/5xx
    // resolved normally and still ran the success screen. A vendor whose claim
    // never landed was shown "we'll be in touch" and then waited for a call that
    // could not come, because the row the founder's queue reads was never written.
    //
    // The server half shipped in this sitting's backend ZIP: the route now returns
    // 502 with `ok:false` instead of `ok:true` (src/api/demo/vendor.js). This is
    // the screen learning to believe it.
    //
    // P5 is why it matters now: demo_lead_alert's {{3}} points real, unregistered
    // vendors at this exact page. It is the first thing we ever say to them.
    try {
      const res = await fetch(`${API_BASE}/api/v2/demo/vendor/${handle}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: claimPhone.trim(), vendor_name: vendor?.display_name ?? handle }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || data?.ok === false) throw new Error(`claim refused: ${res.status}`);
      setClaimDone(true);
    } catch {
      setClaimError(true);
    }
    setClaimSending(false);
  }

  const photos = (vendor?.photos ?? []).map((p: DemoPhoto) => p.url).filter(Boolean) as string[];
  const hasPhotos = photos.length > 0;

  if (loading) return (
    <div style={{ position:'fixed', inset:0, background:'#0C0A09', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily:F.script, fontStyle:'italic', fontSize:18, color:'rgba(240,230,210,0.35)' }}>One moment…</div>
    </div>
  );

  if (!vendor) return (
    <div style={{ position:'fixed', inset:0, background:'#0C0A09', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
      <div style={{ fontFamily:F.display, fontSize:28, color:'rgba(240,230,210,0.9)' }}>Profile not found.</div>
      <div style={{ fontFamily:F.script, fontStyle:'italic', fontSize:16, color:'rgba(240,230,210,0.4)' }}>This demo link may have expired.</div>
    </div>
  );

  const vendorDisplayName = vendor.display_name || handle;

  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', background:'#0C0A09' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Italiana&family=Jost:wght@200;300;400&display=swap');
        @keyframes breathe { 0%,100%{opacity:0.25} 50%{opacity:0.55} }
        @keyframes hairlineIn { from{transform:scaleX(0);opacity:0} to{transform:scaleX(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        input::placeholder { color: rgba(240,230,210,0.3); }
      `}</style>

      {/* Carousel */}
      {hasPhotos ? photos.map((url, i) => (
        <div key={i} style={{ position:'absolute', inset:0, backgroundImage:`url(${url})`, backgroundSize:'cover', backgroundPosition:'center top', opacity: reveal ? (i === cur ? 1 : 0) : 0, transition:`opacity ${i === cur ? '1.8s' : '1.2s'} ${EASE}`, willChange:'opacity', zIndex:1, pointerEvents:'none' }} />
      )) : (
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.08) 0%, transparent 70%)', zIndex:1, pointerEvents:'none' }} />
      )}

      {/* Radial vignette — exact match to real app */}
      <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', background:'radial-gradient(ellipse at 50% 60%, transparent 20%, rgba(0,0,0,0.55) 100%)' }} />

      {/* Bottom gradient */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'52%', zIndex:3, pointerEvents:'none', background:'linear-gradient(to top, rgba(12,10,9,0.92) 0%, rgba(12,10,9,0.45) 55%, transparent 100%)' }} />

      {/* TDW wordmark — exact from real landing */}
      <div style={{ position:'absolute', top:'calc(env(safe-area-inset-top, 0px) + 22px)', left:22, zIndex:10, opacity: reveal ? 1 : 0, transition:`opacity 1.2s ${EASE} 0.3s` }}>
        <div style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:16, color:'rgba(248,247,245,0.72)', letterSpacing:'0.02em', lineHeight:1 }}>The Dream Wedding</div>
        <div style={{ fontFamily:F.label, fontWeight:200, fontSize:6, letterSpacing:'0.38em', textTransform:'uppercase', color:'#C9A84C', marginTop:5 }}>India&apos;s First Wedding OS</div>
      </div>

      {/* Slide dots */}
      {hasPhotos && photos.length > 1 && !entered && (
        <div style={{ position:'absolute', top:'calc(env(safe-area-inset-top, 0px) + 28px)', left:'50%', transform:'translateX(-50%)', display:'flex', gap:5, zIndex:10, opacity: reveal ? 1 : 0, transition:`opacity 1s ${EASE} 0.6s` }}>
          {photos.map((_, i) => (
            <div key={i} style={{ width: i === cur ? 18 : 4, height:4, borderRadius:2, background: i === cur ? '#C9A84C' : 'rgba(255,255,255,0.22)', transition:`width 400ms ${EASE}, background 400ms ${EASE}` }} />
          ))}
        </div>
      )}

      {/* Entry strip — exact pattern from real TDW landing */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:20, opacity: reveal ? 1 : 0, transition:`opacity 1.4s ${EASE} 0.5s` }}>
        <div
          onClick={() => !entered && setEntered(true)}
          style={{
            background: entered ? 'rgba(12,10,9,0.38)' : 'rgba(12,10,9,0.32)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: '0.5px solid rgba(255,255,255,0.10)',
            padding: entered
              ? '20px 24px calc(env(safe-area-inset-bottom, 16px) + 28px)'
              : '14px 24px calc(env(safe-area-inset-bottom, 12px) + 16px)',
            transition: `padding 400ms ${EASE}, background 400ms ${EASE}`,
            cursor: entered ? 'default' : 'pointer',
          }}
        >
          {/* Always-visible brand row — exact from real landing */}
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
            <div>
              {/* "We built this for you." — Cormorant italic, dim */}
              <div style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:14, color:'rgba(248,247,245,0.45)', letterSpacing:'0.02em', marginBottom:6, lineHeight:1 }}>
                We built this for you.
              </div>
              {/* Vendor name — Italiana, large. Exact from real landing */}
              <div style={{ fontFamily:F.display, fontWeight:400, fontSize:34, color:'rgba(248,247,245,0.96)', lineHeight:1.1, letterSpacing:'0.02em' }}>
                {vendorDisplayName}
              </div>
              {/* Category · City — Jost 200, brass */}
              {(vendor.category || vendor.city) && (
                <div style={{ fontFamily:F.label, fontWeight:200, fontSize:7, letterSpacing:'0.32em', textTransform:'uppercase', color:'#C9A84C', marginTop:4 }}>
                  {[vendor.category, vendor.city].filter(Boolean).join(' · ')}
                </div>
              )}
            </div>

            {/* Breathe hint — exact from real landing */}
            {!entered && (
              <div style={{ fontFamily:F.label, fontWeight:200, fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(248,247,245,0.28)', animation:'breathe 3s ease-in-out infinite', paddingBottom:4 }}>
                tap
              </div>
            )}
          </div>

          {/* Expanded content */}
          <div style={{ maxHeight: entered ? '300px' : '0px', overflow:'hidden', transition:`max-height 440ms ${EASE}` }}>
            <div style={{ paddingTop:20, display:'flex', flexDirection:'column', gap:10 }}>

              {/* Brass hairline with ◆ — exact from real app */}
              <div style={{ display:'flex', alignItems:'center', gap:12, animation: entered ? `hairlineIn 600ms ${EASE} 180ms both` : 'none' }}>
                <div style={{ flex:1, height:'0.5px', background:'linear-gradient(to right, rgba(201,168,76,0.6), rgba(201,168,76,0.12))' }} />
                <span style={{ fontFamily:F.display, fontSize:10, color:'#C9A84C', letterSpacing:'0.3em', lineHeight:1 }}>◆</span>
                <div style={{ flex:1, height:'0.5px', background:'linear-gradient(to left, rgba(201,168,76,0.6), rgba(201,168,76,0.12))' }} />
              </div>

              {/* "Your studio awaits." — Cormorant italic */}
              <div style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:18, color:'rgba(248,247,245,0.55)', textAlign:'center', letterSpacing:'0.01em', animation: entered ? `fadeUp 500ms ${EASE} 200ms both` : 'none' }}>
                Your studio awaits.
              </div>

              {/* Enter Your Studio — gold button, exact from real landing */}
              <button
                onClick={() => router.push(`/demo/vendor/${handle}/studio`)}
                style={{ width:'100%', height:48, background:'#C9A84C', border:'none', borderRadius:100, cursor:'pointer', fontFamily:F.label, fontSize:9, fontWeight:400, letterSpacing:'0.22em', textTransform:'uppercase', color:'#0C0A09', animation: entered ? `fadeUp 500ms ${EASE} 280ms both` : 'none', WebkitTapHighlightColor:'transparent' }}
              >
                Enter Your Studio
              </button>

              {/* Explore Discover — ghost, routes to demodiscover subdomain */}
              <button
                onClick={() => { window.location.href = `https://demodiscover.thedreamwedding.in`; }}
                style={{ width:'100%', height:44, background:'transparent', border:'0.5px solid rgba(248,247,245,0.2)', borderRadius:100, cursor:'pointer', fontFamily:F.label, fontSize:8, fontWeight:300, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(248,247,245,0.55)', animation: entered ? `fadeUp 500ms ${EASE} 350ms both` : 'none', WebkitTapHighlightColor:'transparent' }}
              >
                Explore Discover
              </button>

              {/* Claim Your Studio — text link */}
              <button
                onClick={e => { e.stopPropagation(); setClaimOpen(true); }}
                style={{ background:'none', border:'none', cursor:'pointer', fontFamily:F.label, fontWeight:200, fontSize:7, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(248,247,245,0.28)', textAlign:'center', padding:'4px 0', animation: entered ? `fadeUp 500ms ${EASE} 420ms both` : 'none' }}
              >
                Claim Your Studio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Claim sheet */}
      {claimOpen && (
        <>
          <div onClick={() => { setClaimOpen(false); setClaimDone(false); setClaimError(false); setClaimPhone(''); }} style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(12,10,9,0.5)' }} />
          <div onClick={e => e.stopPropagation()} style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:101, background:'rgba(12,10,9,0.88)', backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)', borderTop:'0.5px solid rgba(255,255,255,0.12)', borderRadius:'20px 20px 0 0', padding:`20px 24px calc(env(safe-area-inset-bottom, 16px) + 24px)` }}>
            {/* F-07.37 — THE FAILURE HAS A SCREEN. Ordered FIRST so a failed claim can
                never fall through into the welcome. The line is deliberately plain and
                actionable: it does not apologise, it does not blame the vendor, and it
                does not promise a follow-up we have no row to make. */}
            {claimError ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:26, color:'rgba(248,247,245,0.95)', marginBottom:12 }}>That didn&apos;t go through.</div>
                <div style={{ fontFamily:F.body, fontWeight:300, fontSize:14, color:'rgba(248,247,245,0.55)', lineHeight:1.7, marginBottom:20 }}>Something went wrong on our end. Please try again.</div>
                <button
                  onClick={() => { setClaimError(false); }}
                  style={{ padding:'12px 28px', background:'rgba(248,247,245,0.92)', border:'none', borderRadius:10, fontFamily:F.label, fontSize:10, fontWeight:300, letterSpacing:'0.22em', textTransform:'uppercase', color:'#0C0A09', cursor:'pointer' }}
                >Try again</button>
              </div>
            ) : claimDone ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:32, color:'rgba(248,247,245,0.95)', marginBottom:12 }}>Welcome to TDW.</div>
                <div style={{ fontFamily:F.body, fontWeight:300, fontSize:14, color:'rgba(248,247,245,0.55)', lineHeight:1.7 }}>Our team will reach out shortly.<br />We verify every profile personally.</div>
              </div>
            ) : (
              <>
                <div style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:22, color:'rgba(248,247,245,0.9)', marginBottom:4 }}>Claim Your Studio.</div>
                <div style={{ fontFamily:F.body, fontWeight:300, fontSize:13, color:'rgba(248,247,245,0.45)', marginBottom:20 }}>Enter your number. We&apos;ll reach out on WhatsApp.</div>
                <div style={{ display:'flex', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.2)', marginBottom:20 }}>
                  <span style={{ fontFamily:F.body, fontWeight:300, fontSize:13, color:'rgba(248,247,245,0.45)', paddingRight:12, borderRight:'1px solid rgba(255,255,255,0.15)', marginRight:12 }}>+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="00000 00000"
                    value={claimPhone}
                    onChange={e => setClaimPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{ flex:1, background:'transparent', border:'none', outline:'none', fontFamily:F.body, fontWeight:300, fontSize:15, color:'rgba(248,247,245,0.9)', padding:'8px 0' }}
                  />
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleClaim(); }}
                  disabled={claimPhone.length < 10 || claimSending}
                  style={{ width:'100%', height:52, background: claimPhone.length >= 10 && !claimSending ? '#C9A84C' : 'rgba(201,168,76,0.3)', border:'none', borderRadius:100, cursor: claimPhone.length >= 10 && !claimSending ? 'pointer' : 'default', fontFamily:F.label, fontSize:10, fontWeight:400, letterSpacing:'0.2em', textTransform:'uppercase', color: claimPhone.length >= 10 && !claimSending ? '#0C0A09' : 'rgba(12,10,9,0.4)' }}
                >
                  {claimSending ? 'Sending…' : 'Claim Studio →'}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
