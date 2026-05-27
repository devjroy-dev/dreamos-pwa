'use client';
// app/demo/[handle]/page.tsx
// Vendor demo landing page.
// URL: thedreamwedding.in/demo/:handle (e.g. /demo/makeupbyswatiroy)

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const BACKEND       = 'https://dream-os-production.up.railway.app';
const DEMO_UUID     = 'bbbbbbbb-1111-1111-1111-bbbbbbbbbbbb';
const DEMO_SESS_KEY = 'tdw_vendor_demo_session';
const GOLD          = '#C9A84C';
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Jost:wght@200;300;400&display=swap');`;

interface VendorPhoto { url: string; is_hero: boolean; }
interface DemoVendor {
  id: string; ig_handle: string; name: string;
  category: string; city: string;
  about: string | null; rate_display: string | null;
  photos: VendorPhoto[];
}

function categoryLabel(c: string) {
  return c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default function VendorDemoPage() {
  const params  = useParams<{ handle: string }>();
  const router  = useRouter();
  const handle  = params?.handle ?? '';

  const [vendor,   setVendor]   = useState<DemoVendor | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [slide,    setSlide]    = useState(0);
  const [entering, setEntering] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const [discoverIdx,  setDiscoverIdx]  = useState(0);
  const [toast,    setToast]    = useState('');
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    if (!handle) return;
    fetch(`${BACKEND}/api/v2/demo/vendor/${handle}`)
      .then(r => r.json())
      .then(d => {
        if (!d.ok) { setNotFound(true); setLoading(false); return; }
        setVendor(d.vendor);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [handle]);

  useEffect(() => {
    if (!vendor || vendor.photos.length < 2) return;
    const t = setInterval(() => setSlide(p => (p + 1) % vendor.photos.length), 4000);
    return () => clearInterval(t);
  }, [vendor]);

  function handleEnterStudio() {
    if (!vendor) return;
    setEntering(true);
    const demoSession = {
      id:          DEMO_UUID,
      vendorId:    DEMO_UUID,
      user_id:     DEMO_UUID,
      name:        vendor.name,
      phone:       null,
      tier:        'signature',
      category:    vendor.category,
      city:        vendor.city,
      ig_handle:   vendor.ig_handle,
      demo:        true,
      demo_handle: vendor.ig_handle,
      demo_photos: vendor.photos,
      _v:          2,
    };
    try { localStorage.setItem(DEMO_SESS_KEY, JSON.stringify(demoSession)); } catch {}
    setTimeout(() => { router.push('/vendor'); }, 80);
  }

  async function handleDeleteDemo() {
    if (!vendor || deleting) return;
    setDeleting(true);
    try {
      await fetch(`${BACKEND}/api/v2/demo/vendor/${handle}/delete-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ig_handle: vendor.ig_handle, name: vendor.name }),
      });
      showToast('Deletion request sent. We will remove your demo within 24 hours.');
    } catch { showToast('Could not send request. Please contact us directly.'); }
    setDeleting(false);
  }

  if (loading) return (
    <div style={{ background: '#0C0A09', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{FONTS}</style>
      <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Loading…</p>
    </div>
  );

  if (notFound) return (
    <div style={{ background: '#0C0A09', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <style>{FONTS}</style>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 24, color: 'rgba(255,255,255,0.5)' }}>Demo not found</p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>This demo link may have expired or been removed.</p>
    </div>
  );

  if (!vendor) return null;

  const allPhotos = vendor.photos;

  if (showDiscover) {
    const discPhoto = allPhotos[discoverIdx];
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#0C0A09', zIndex: 100 }}>
        <style>{FONTS}</style>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${discPhoto?.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />
        <button onClick={() => setShowDiscover(false)} style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 16px)', left: 16, background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 50, width: 40, height: 40, color: '#fff', fontSize: 20, cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 22px)', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
          {allPhotos.map((_, i) => (
            <div key={i} style={{ width: i === discoverIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === discoverIdx ? GOLD : 'rgba(255,255,255,0.4)', transition: 'width 0.3s' }} />
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 24px calc(env(safe-area-inset-bottom, 0px) + 32px)' }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>{categoryLabel(vendor.category)}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 28, color: '#F8F7F5', marginBottom: 2 }}>{vendor.name}</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 13, color: 'rgba(248,247,245,0.6)', marginBottom: 20 }}>{vendor.city}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {discoverIdx > 0 && (
              <button onClick={() => setDiscoverIdx(p => p - 1)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '14px', color: '#F8F7F5', fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>← Previous</button>
            )}
            {discoverIdx < allPhotos.length - 1 ? (
              <button onClick={() => setDiscoverIdx(p => p + 1)} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 12, padding: '14px', color: '#0A0908', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Next →</button>
            ) : (
              <button onClick={() => setShowDiscover(false)} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 12, padding: '14px', color: '#0A0908', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Enter Studio →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0C0A09', overflow: 'hidden' }}>
      <style>{FONTS}</style>

      {toast && (
        <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: 'rgba(201,168,76,0.12)', backdropFilter: 'blur(12px)', border: '0.5px solid rgba(201,168,76,0.3)', color: GOLD, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 13, padding: '10px 20px', borderRadius: 100, zIndex: 9999, whiteSpace: 'nowrap' }}>{toast}</div>
      )}

      {allPhotos.map((photo, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, backgroundImage: `url(${photo.url})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: i === slide ? 1 : 0, transition: 'opacity 1200ms ease' }} />
      ))}

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.75) 100%)' }} />

      <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 20px)', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>The Dream Wedding</p>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        <div style={{ background: 'rgba(12,10,9,0.4)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', borderTop: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '20px 20px 0 0', padding: '28px 24px calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>

          <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>{categoryLabel(vendor.category)} · {vendor.city}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 32, color: '#F8F7F5', lineHeight: 1.1, marginBottom: 6 }}>{vendor.name}</p>
          {vendor.about && <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 13, color: 'rgba(248,247,245,0.55)', marginBottom: 4, lineHeight: 1.5 }}>{vendor.about}</p>}
          {vendor.rate_display && <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: '0.15em', color: 'rgba(201,168,76,0.7)', marginBottom: 20 }}>{vendor.rate_display}</p>}
          {!vendor.about && !vendor.rate_display && <div style={{ marginBottom: 20 }} />}

          {allPhotos.length > 1 && (
            <div style={{ display: 'flex', gap: 5, marginBottom: 20, justifyContent: 'center' }}>
              {allPhotos.map((_, i) => (
                <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 16 : 5, height: 5, borderRadius: 3, background: i === slide ? GOLD : 'rgba(255,255,255,0.3)', transition: 'width 0.3s', cursor: 'pointer' }} />
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => { setShowDiscover(true); setDiscoverIdx(0); }} style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 14, padding: '16px', fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F8F7F5', cursor: 'pointer', minHeight: 52 }}>
              See how brides discover you
            </button>
            <button onClick={handleEnterStudio} disabled={entering} style={{ width: '100%', background: GOLD, border: 'none', borderRadius: 14, padding: '16px', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0A0908', cursor: entering ? 'not-allowed' : 'pointer', minHeight: 52, opacity: entering ? 0.7 : 1 }}>
              {entering ? 'Opening your studio…' : 'Enter your studio →'}
            </button>
            <button onClick={handleDeleteDemo} disabled={deleting} style={{ width: '100%', background: 'transparent', border: 'none', padding: '10px', fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}>
              {deleting ? 'Sending request…' : 'Delete this demo profile'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
