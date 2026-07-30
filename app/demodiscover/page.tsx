'use client';
export const dynamic = 'force-dynamic';

// app/demodiscover/page.tsx
// demodiscover.thedreamwedding.in — exact Frost Discover replica.
// Always fetches demo vendors only (GET /api/v2/demo/discover).
// No auth. No Muse save. No Circle. No Sanctuary nav.
// All gestures work: up/down vendors, left/right photos, blind swipe, double-tap heart.
// Filter sheet opens with all sections — Apply is cosmetic (resets to show all demo vendors).

import React, { useCallback, useEffect, useRef, useState, Suspense } from 'react';
// TDW_07 P4b · F-07.16 — the estate's one money donor. Locked register: Rs 1,50,000.
import { formatRs } from '@/lib/vendor/format';
import { MessageCircle, Lock, Users, SlidersHorizontal, X } from 'lucide-react';

const BACKEND = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';

// ── Types ────────────────────────────────────────────────────────────────────
interface DemoVendor {
  id: string;
  name: string | null;
  category: string | null;
  city: string | null;
  routing_handle: string | null;
  starting_price: number | null;
  photos: string[];
  vibe_tags: string[];
  about: string | null;
  enquire_link: string | null;
}

// ── Fetch ────────────────────────────────────────────────────────────────────
async function fetchDemoFeed(): Promise<DemoVendor[]> {
  try {
    const res  = await fetch(`${BACKEND}/api/v2/demo/discover`);
    const data = await res.json();
    if (!data.ok) return [];
    return (data.vendors || []).map((v: DemoVendor) => ({
      ...v,
      photos: Array.isArray(v.photos) ? v.photos : [],
      vibe_tags: Array.isArray(v.vibe_tags) ? v.vibe_tags : [],
    }));
  } catch { return []; }
}

// ── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES   = ['Venues','Photographers','Makeup Artists','Designers','Jewellery','Choreographers','Content Creators','DJ & Music','Event Managers','Bridal Wellness'];
const CITIES       = ['Delhi NCR','Mumbai','Bangalore','Chennai','Hyderabad','Kolkata','Jaipur','Pune','Udaipur','Goa'];
const VIBE_OPTIONS = ['Candid','Traditional','Luxury','Cinematic','Boho','Festive','Minimalist','Royal','Destination','Contemporary'];
const BUDGET_OPTIONS = [
  { label:'Under Rs 1L',  value:'100000'  },
  { label:'Rs 1L – 3L',  value:'300000'  },
  { label:'Rs 3L – 5L',  value:'500000'  },
  { label:'Rs 5L – 10L', value:'1000000' },
  { label:'Rs 10L+',     value:''        },
];
const MODE_OPTIONS = ['Couture','Spotlight','Featured','Look Book'];

const SWIPE_THRESHOLD       = 45;
const SWIPE_VELOCITY        = 0.3;
const TAP_MAX_MOVE          = 10;
const TAP_MAX_TIME          = 250;
const DOUBLE_TAP_MS         = 280;
const OVERLAY_DISMISS       = 80;

const haptic = (ms: number) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(ms); } catch {}
  }
};

// ── Glass tokens — exact from real discover ──────────────────────────────────
const GLASS = {
  sheet: {
    background:           'rgba(12,10,9,0.55)',
    backdropFilter:       'blur(28px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
    borderTop:            '0.5px solid rgba(255,255,255,0.12)',
  },
  scrim:      { background: 'rgba(0,0,0,0.25)' },
  pill: {
    background:           'rgba(12,10,9,0.32)',
    backdropFilter:       'blur(18px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
    border:               '0.5px solid rgba(201,168,76,0.22)',
  },
  pillActive: {
    background:           'rgba(201,168,76,0.18)',
    backdropFilter:       'blur(18px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
    border:               '0.5px solid rgba(201,168,76,0.55)',
  },
} as const;

// ── Filter state ─────────────────────────────────────────────────────────────
interface FilterState { category:string|null; city:string|null; vibes:string[]; budget:string|null; mode:string|null; }
const EMPTY_FILTERS: FilterState = { category:null, city:null, vibes:[], budget:null, mode:null };

// ── Accordion ────────────────────────────────────────────────────────────────
function AccordionSection({ label, hasValue, children }: { label:string; hasValue:boolean; children:React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:'0.5px solid rgba(255,255,255,0.08)' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', background:'none', border:'none', cursor:'pointer', touchAction:'manipulation' }}>
        <span style={{ fontFamily:"'Jost',sans-serif", fontSize:9, fontWeight:300, letterSpacing:'0.28em', textTransform:'uppercase' as const, color: hasValue ? 'rgba(201,168,76,0.9)' : 'rgba(248,247,245,0.45)' }}>
          {label}{hasValue ? ' ·' : ''}
        </span>
        <span style={{ color:'rgba(248,247,245,0.35)', fontSize:14, transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition:'transform 200ms ease', display:'inline-block', fontFamily:"'Jost',sans-serif" }}>›</span>
      </button>
      {open && <div style={{ padding:'0 24px 20px' }}>{children}</div>}
    </div>
  );
}

// ── Filter sheet — opens fully, Apply is cosmetic ────────────────────────────
function FilterSheet({ visible, onClose, isBlind }: { visible:boolean; onClose:()=>void; isBlind:boolean; }) {
  const [local, setLocal] = useState<FilterState>(EMPTY_FILTERS);
  if (!visible) return null;
  const pill = (active:boolean) => ({
    padding:'7px 14px', borderRadius:20,
    border: active ? '0.5px solid rgba(201,168,76,0.75)' : '0.5px solid rgba(255,255,255,0.15)',
    background: active ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.06)',
    fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:300, letterSpacing:'0.12em',
    color: active ? 'rgba(201,168,76,0.95)' : 'rgba(248,247,245,0.65)',
    cursor:'pointer', whiteSpace:'nowrap' as const, touchAction:'manipulation' as const,
  });
  return (
    <div style={{ position:'fixed', inset:0, zIndex:50 }} onClick={onClose}>
      <div style={{ position:'absolute', inset:0, ...GLASS.scrim, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, ...GLASS.sheet, borderRadius:'20px 20px 0 0', paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 24px)', maxHeight:'85vh', overflowY:'auto', scrollbarWidth:'none' as const }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'rgba(255,255,255,0.2)' }} />
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 24px 4px' }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:300, color:'#F8F7F5', letterSpacing:'-0.01em' }}>{isBlind ? 'Category' : 'Filters'}</span>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(248,247,245,0.4)', padding:4 }}><X size={18} strokeWidth={1.5} /></button>
        </div>
        <AccordionSection label="Category" hasValue={!!local.category}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {CATEGORIES.map(c => <button key={c} style={pill(local.category===c)} onClick={() => setLocal(f => ({ ...f, category: f.category===c ? null : c }))}>{c}</button>)}
          </div>
        </AccordionSection>
        {!isBlind && (<>
          <AccordionSection label="Mode" hasValue={!!local.mode}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {MODE_OPTIONS.map(m => <button key={m} style={pill(local.mode===m)} onClick={() => setLocal(f => ({ ...f, mode: f.mode===m ? null : m }))}>{m}</button>)}
            </div>
          </AccordionSection>
          <AccordionSection label="City" hasValue={!!local.city}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {CITIES.map(c => <button key={c} style={pill(local.city===c)} onClick={() => setLocal(f => ({ ...f, city: f.city===c ? null : c }))}>{c}</button>)}
            </div>
          </AccordionSection>
          <AccordionSection label="Vibe" hasValue={local.vibes.length>0}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {VIBE_OPTIONS.map(v => <button key={v} style={pill(local.vibes.includes(v))} onClick={() => setLocal(f => ({ ...f, vibes: f.vibes.includes(v) ? f.vibes.filter(x=>x!==v) : [...f.vibes,v] }))}>{v}</button>)}
            </div>
          </AccordionSection>
          <AccordionSection label="Budget" hasValue={!!local.budget}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {BUDGET_OPTIONS.map(b => <button key={b.label} style={pill(local.budget===b.value)} onClick={() => setLocal(f => ({ ...f, budget: f.budget===b.value ? null : b.value }))}>{b.label}</button>)}
            </div>
          </AccordionSection>
        </>)}
        <div style={{ display:'flex', gap:12, padding:'24px 24px 0' }}>
          <button onClick={() => { setLocal(EMPTY_FILTERS); onClose(); }} style={{ flex:1, padding:'13px 0', background:'transparent', border:'0.5px solid rgba(255,255,255,0.2)', borderRadius:10, fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:300, letterSpacing:'0.18em', textTransform:'uppercase' as const, color:'rgba(248,247,245,0.45)', cursor:'pointer', touchAction:'manipulation' as const }}>Clear</button>
          <button onClick={onClose} style={{ flex:2, padding:'13px 0', background:'#C9A84C', border:'none', borderRadius:10, fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:300, letterSpacing:'0.18em', textTransform:'uppercase' as const, color:'#0C0A09', cursor:'pointer', touchAction:'manipulation' as const }}>Apply</button>
        </div>
      </div>
    </div>
  );
}

// ── Glass overlay — vendor profile ────────────────────────────────────────────
function GlassOverlay({ vendor, visible, onClose, isBlind }: { vendor:DemoVendor; visible:boolean; onClose:()=>void; isBlind:boolean; }) {
  const dragStartY  = useRef(0);
  const [dragDelta, setDragDelta] = useState(0);
  const isDragging  = useRef(false);
  const [toast, setToast] = useState('');

  const onTouchStart = (e:React.TouchEvent) => { dragStartY.current=e.touches[0].clientY; isDragging.current=true; setDragDelta(0); };
  const onTouchMove  = (e:React.TouchEvent) => { if(!isDragging.current)return; const d=e.touches[0].clientY-dragStartY.current; if(d>0)setDragDelta(d); };
  const onTouchEnd   = () => { isDragging.current=false; if(dragDelta>OVERLAY_DISMISS){setDragDelta(0);onClose();}else setDragDelta(0); };

  const ty = dragDelta>0 ? `translateY(${dragDelta}px)` : 'translateY(0)';
  const op = dragDelta>0 ? Math.max(0.3, 1-dragDelta/200) : 1;

  function showToast(msg:string){setToast(msg);setTimeout(()=>setToast(''),2500);}

  const enquireLink = vendor.enquire_link || (vendor.routing_handle ? `https://wa.me/917982159047?text=TDW-${vendor.routing_handle}` : null);

  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:20, transform: visible ? ty : 'translateY(100%)', transition: isDragging.current ? 'none' : 'transform 340ms cubic-bezier(0.22,1,0.36,1)', opacity: visible ? op : 0, ...GLASS.sheet, borderRadius:'20px 20px 0 0', paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 24px)' }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 16px' }}>
        <div style={{ width:36, height:4, borderRadius:2, background:'rgba(255,255,255,0.2)' }} />
      </div>
      {toast && (
        <div style={{ position:'absolute', top:16, left:'50%', transform:'translateX(-50%)', ...GLASS.pill, borderRadius:20, padding:'6px 16px', fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:300, color:'rgba(248,247,245,0.8)', whiteSpace:'nowrap', zIndex:30 }}>{toast}</div>
      )}
      <div style={{ padding:'0 24px' }}>
        <p style={{ fontFamily:"'Jost',sans-serif", fontSize:9, fontWeight:300, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(248,247,245,0.5)', margin:'0 0 8px' }}>
          {vendor.category}&nbsp;·&nbsp;{vendor.city}
        </p>
        {!isBlind && (
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, color:'#F8F7F5', margin:'0 0 4px', letterSpacing:'-0.01em', lineHeight:1.1 }}>{vendor.name}</h2>
        )}
        {vendor.about && (
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:300, fontStyle:'italic', color:'rgba(248,247,245,0.7)', margin:'0 0 12px', lineHeight:1.5 }}>{vendor.about}</p>
        )}
        {/* TDW_07 P4b · F-07.16 — the register, on the demo-subdomain surface too. A demo
            card that priced in a different register from the live feed would teach the
            wrong number to exactly the audience the demo exists to convince. Copy ④. */}
        {!isBlind && vendor.starting_price != null && (
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:300, color:'rgba(248,247,245,0.55)', margin:'0 0 20px' }}>
            Starting at {formatRs(vendor.starting_price)}
          </p>
        )}
        {isBlind && vendor.vibe_tags.length>0 && (
          <p style={{ fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:300, letterSpacing:'0.15em', color:'rgba(248,247,245,0.55)', margin:'0 0 20px' }}>{vendor.vibe_tags.join(' · ')}</p>
        )}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={() => { if(enquireLink) window.open(enquireLink,'_blank'); }} style={{ width:'100%', padding:'14px 0', background:'rgba(248,247,245,0.92)', border:'none', borderRadius:10, fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:300, letterSpacing:'0.22em', textTransform:'uppercase', color:'#0C0A09', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, touchAction:'manipulation' }}>
            <MessageCircle size={14} strokeWidth={1.5} /> Enquire
          </button>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => showToast('Lock Date coming soon')} style={{ flex:1, padding:'12px 0', background:'rgba(255,255,255,0.1)', border:'0.5px solid rgba(255,255,255,0.15)', borderRadius:10, fontFamily:"'Jost',sans-serif", fontSize:9, fontWeight:300, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(248,247,245,0.6)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, touchAction:'manipulation' }}>
              <Lock size={12} strokeWidth={1.5} /> Lock Date
              <span style={{ fontSize:7, fontStyle:'italic', color:'rgba(248,247,245,0.3)', textTransform:'none', letterSpacing:0 }}>beta</span>
            </button>
            <button onClick={() => showToast('Sign in to add to your Circle')} style={{ flex:1, padding:'12px 0', background:'rgba(255,255,255,0.1)', border:'0.5px solid rgba(255,255,255,0.15)', borderRadius:10, fontFamily:"'Jost',sans-serif", fontSize:9, fontWeight:300, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(248,247,245,0.6)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, touchAction:'manipulation' }}>
              <Users size={12} strokeWidth={1.5} /> Circle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Image dots ────────────────────────────────────────────────────────────────
function ImageDots({ total, current }: { total:number; current:number }) {
  if (total<=1) return null;
  return (
    <div style={{ position:'fixed', top:'calc(env(safe-area-inset-top,0px) + 20px)', left:'50%', transform:'translateX(-50%)', display:'flex', gap:5, zIndex:24, pointerEvents:'none' }}>
      {Array.from({ length:Math.min(total,8) }).map((_,i) => (
        <div key={i} style={{ width:i===current?16:5, height:5, borderRadius:3, background:i===current?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.4)', transition:'all 240ms cubic-bezier(0.22,1,0.36,1)', boxShadow:'0 1px 3px rgba(0,0,0,0.3)' }} />
      ))}
    </div>
  );
}

// ── Top chrome ────────────────────────────────────────────────────────────────
function TopChrome({ onFilter, onToggleBlind, isBlind, hasFilters }: { onFilter:()=>void; onToggleBlind:()=>void; isBlind:boolean; hasFilters:boolean; }) {
  const top = 'calc(env(safe-area-inset-top,0px) + 14px)';
  const stopTouch = (e:React.TouchEvent) => e.stopPropagation();
  const pillBase: React.CSSProperties = { position:'fixed', top, zIndex:25, display:'flex', alignItems:'center', height:28, borderRadius:100, cursor:'pointer', touchAction:'manipulation', border:'none' };
  return (
    <>
      {/* TDW wordmark — left */}
      <div style={{ position:'fixed', top, left:14, zIndex:25, display:'flex', flexDirection:'column' }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontWeight:300, fontSize:13, color:'rgba(248,247,245,0.7)', lineHeight:1 }}>The Dream Wedding</span>
        <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:200, fontSize:6, letterSpacing:'0.32em', textTransform:'uppercase', color:'#C9A84C', marginTop:3 }}>Discover</span>
      </div>
      {/* Blind — right of centre */}
      <button onClick={onToggleBlind} onTouchStart={stopTouch} onTouchEnd={stopTouch} style={{ ...pillBase, right:50, padding:'0 10px', ...(isBlind ? GLASS.pillActive : GLASS.pill) }}>
        <span style={{ fontFamily:"'Jost',sans-serif", fontSize:8, fontWeight:300, letterSpacing:'0.22em', textTransform:'uppercase', color:isBlind?'rgba(201,168,76,0.95)':'rgba(248,247,245,0.6)', whiteSpace:'nowrap' }}>Blind</span>
      </button>
      {/* Filter — far right */}
      <button onClick={onFilter} onTouchStart={stopTouch} onTouchEnd={stopTouch} style={{ ...pillBase, right:14, width:28, justifyContent:'center', padding:0, ...(hasFilters ? GLASS.pillActive : GLASS.pill) } as React.CSSProperties}>
        <SlidersHorizontal size={13} strokeWidth={1.5} color={hasFilters?'rgba(201,168,76,0.9)':'rgba(255,255,255,0.8)'} />
      </button>
    </>
  );
}

// ── Heart animation helpers ───────────────────────────────────────────────────
function spawnHeart() {
  if (typeof document==='undefined') return;
  const el = document.createElement('div');
  el.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);font-size:88px;z-index:9999;pointer-events:none;animation:heartPop 700ms cubic-bezier(0.22,1,0.36,1) forwards;color:#C9A84C;`;
  el.textContent = '♥';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 700);
  haptic(14);
}

function spawnLikeToast() {
  if (typeof document==='undefined') return;
  const existing = document.getElementById('demo-like-toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'demo-like-toast';
  el.style.cssText = `position:fixed;top:calc(env(safe-area-inset-top,0px)+52px);left:50%;transform:translateX(-50%);background:rgba(17,17,17,0.75);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:0.5px solid rgba(255,255,255,0.15);color:rgba(248,247,245,0.9);font-family:'Jost',sans-serif;font-size:10px;font-weight:300;letter-spacing:0.18em;text-transform:uppercase;padding:8px 18px;border-radius:20px;z-index:9998;pointer-events:none;white-space:nowrap;animation:toastSlideIn 250ms cubic-bezier(0.22,1,0.36,1) forwards;`;
  el.textContent = 'Liked ♥';
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transition='opacity 300ms ease'; }, 1800);
  setTimeout(() => el.remove(), 2200);
}

// ── Empty deck ────────────────────────────────────────────────────────────────
function EmptyDeck({ mode }: { mode:string }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'#0C0A09', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
      <span style={{ fontSize:48 }}>✦</span>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:300, fontStyle:'italic', color:'rgba(248,247,245,0.7)' }}>
        {mode==='blind' ? "You've seen them all." : "You've seen everyone."}
      </span>
      <span style={{ fontFamily:"'Jost',sans-serif", fontSize:9, fontWeight:300, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(248,247,245,0.35)' }}>Check back soon</span>
    </div>
  );
}

// ── Main feed ─────────────────────────────────────────────────────────────────
function DiscoverFeed({ isBlind, onOpenFilter, onToggleBlind, hasFilters }: { isBlind:boolean; onOpenFilter:()=>void; onToggleBlind:()=>void; hasFilters:boolean; }) {
  const [vendors,        setVendors]        = useState<DemoVendor[]>([]);
  const [vendorIdx,      setVendorIdx]      = useState(0);
  const [imageIdx,       setImageIdx]       = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [dissolveKey,    setDissolveKey]    = useState(0);
  const [blindIdx,       setBlindIdx]       = useState(0);
  const [loading,        setLoading]        = useState(true);

  const touchStart  = useRef<{x:number;y:number;t:number}|null>(null);
  const tapTimer    = useRef<ReturnType<typeof setTimeout>|null>(null);
  const lastTapTime = useRef(0);
  const tapCount    = useRef(0);

  useEffect(() => {
    fetchDemoFeed().then(v => { setVendors(v); setLoading(false); });
  }, []);

  // Build blind queue — one entry per photo per vendor
  const blindQueue = React.useMemo(() => {
    const q: { vendorId:string; imageUrl:string; vendorObj:DemoVendor }[] = [];
    vendors.forEach(v => {
      if (v.photos.length===0) q.push({ vendorId:v.id, imageUrl:'', vendorObj:v });
      else v.photos.forEach(p => q.push({ vendorId:v.id, imageUrl:p, vendorObj:v }));
    });
    return q;
  }, [vendors]);

  const vendor = vendors[vendorIdx];

  const goNextVendor = useCallback(() => {
    if (vendorIdx>=vendors.length-1) return;
    setVendorIdx(i=>i+1); setImageIdx(0); setOverlayVisible(false); setDissolveKey(k=>k+1); haptic(5);
  }, [vendorIdx, vendors.length]);

  const goPrevVendor = useCallback(() => {
    if (vendorIdx<=0) return;
    setVendorIdx(i=>i-1); setImageIdx(0); setOverlayVisible(false); setDissolveKey(k=>k+1); haptic(5);
  }, [vendorIdx]);

  const nextImage = useCallback(() => {
    if (vendor && imageIdx<vendor.photos.length-1) { setImageIdx(i=>i+1); setDissolveKey(k=>k+1); haptic(4); }
  }, [imageIdx, vendor]);

  const prevImage = useCallback(() => {
    if (imageIdx>0) { setImageIdx(i=>i-1); setDissolveKey(k=>k+1); haptic(4); }
  }, [imageIdx]);

  const handleSingleTap = useCallback(() => {
    if (isBlind) return;
    setOverlayVisible(v => !v); haptic(4);
  }, [isBlind]);

  const handleDoubleTap = useCallback(() => {
    spawnHeart(); spawnLikeToast();
    if (isBlind) { setBlindIdx(i=>Math.min(i+1,blindQueue.length-1)); setDissolveKey(k=>k+1); haptic(5); }
  }, [isBlind, blindQueue.length]);

  const onTouchStart = (e:React.TouchEvent<HTMLDivElement>) => {
    const t=e.touches[0]; touchStart.current={x:t.clientX,y:t.clientY,t:Date.now()};
  };

  const onTouchEnd = (e:React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const start=touchStart.current; touchStart.current=null;
    const end=e.changedTouches[0];
    const dx=end.clientX-start.x; const dy=end.clientY-start.y; const dt=Date.now()-start.t;
    const absX=Math.abs(dx); const absY=Math.abs(dy);

    // Tap detection
    if (absX<TAP_MAX_MOVE && absY<TAP_MAX_MOVE && dt<TAP_MAX_TIME) {
      const now=Date.now(); const since=now-lastTapTime.current;
      if (since<DOUBLE_TAP_MS && tapCount.current>=1) {
        if (tapTimer.current) clearTimeout(tapTimer.current);
        tapCount.current=0; handleDoubleTap();
      } else {
        tapCount.current=1; lastTapTime.current=now;
        tapTimer.current=setTimeout(()=>{ if(tapCount.current===1)handleSingleTap(); tapCount.current=0; }, DOUBLE_TAP_MS);
      }
      return;
    }

    const velocity=Math.max(absX,absY)/Math.max(dt,1);
    if (Math.max(absX,absY)<=SWIPE_THRESHOLD && velocity<=SWIPE_VELOCITY) return;

    // Blind mode — swipe up to dismiss photo
    if (isBlind) {
      if (absY>absX && dy<-SWIPE_THRESHOLD) {
        setBlindIdx(i=>Math.min(i+1,blindQueue.length-1)); setDissolveKey(k=>k+1); haptic(5);
      }
      return;
    }

    // Overlay dismiss on drag down
    if (overlayVisible && absY>absX && dy>OVERLAY_DISMISS) { setOverlayVisible(false); return; }

    // Vertical = change vendor
    if (absY>absX) {
      if (dy<-SWIPE_THRESHOLD) goNextVendor();
      else if (dy>SWIPE_THRESHOLD) goPrevVendor();
    } else {
      // Horizontal = change photo
      if (dx<-SWIPE_THRESHOLD) nextImage();
      else if (dx>SWIPE_THRESHOLD) prevImage();
    }
  };

  if (loading) return (
    <div style={{ position:'fixed', inset:0, background:'#0C0A09', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(245,240,232,0.35)' }}>Loading</span>
    </div>
  );

  if (isBlind && blindQueue.length>0 && blindIdx>=blindQueue.length) return <EmptyDeck mode="blind" />;
  if (!vendor) return <EmptyDeck mode="discover" />;

  const photos      = vendor.photos.length>0 ? vendor.photos : [];
  const currentPhoto = photos[imageIdx] || null;
  const blindItem    = isBlind ? (blindQueue[blindIdx]||null) : null;
  const blindPhoto   = blindItem?.imageUrl||null;
  const displayPhoto = isBlind ? blindPhoto : currentPhoto;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Jost:wght@200;300;400&display=swap');
        @keyframes heartPop { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.3)} 45%{opacity:1;transform:translate(-50%,-50%) scale(1.15)} 70%{transform:translate(-50%,-50%) scale(0.95)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1)} }
        @keyframes dissolveIn { from{opacity:0} to{opacity:1} }
        @keyframes toastSlideIn { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
      `}</style>

      <div style={{ position:'fixed', inset:0, background:'#0C0A09', overflow:'hidden', touchAction:'none', userSelect:'none', WebkitUserSelect:'none' }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        {/* Photo */}
        <div key={dissolveKey} style={{ position:'absolute', inset:0, zIndex:1, animation:'dissolveIn 260ms cubic-bezier(0.22,1,0.36,1)' }}>
          {displayPhoto ? (
            <img src={displayPhoto} alt="" draggable={false} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', pointerEvents:'none' }} />
          ) : (
            <div style={{ position:'absolute', inset:0, background:'#1a1714', display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:'italic', color:'rgba(248,247,245,0.2)' }}>No photo yet</span>
            </div>
          )}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 18%, transparent 65%, rgba(0,0,0,0.4) 100%)', pointerEvents:'none' }} />
        </div>

        {/* Image dots */}
        {!isBlind && <ImageDots total={photos.length} current={imageIdx} />}

        {/* Top chrome */}
        <TopChrome onFilter={onOpenFilter} onToggleBlind={onToggleBlind} isBlind={isBlind} hasFilters={hasFilters} />

        {/* Hint */}
        {!isBlind && !overlayVisible && (
          <div style={{ position:'fixed', bottom:'calc(env(safe-area-inset-bottom,0px) + 28px)', left:0, right:0, display:'flex', justifyContent:'center', zIndex:10, pointerEvents:'none' }}>
            <span style={{ fontFamily:"'Jost',sans-serif", fontSize:9, fontWeight:200, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)' }}>
              Tap · Double-tap to like · Swipe to browse
            </span>
          </div>
        )}

        {/* Glass overlay */}
        {!isBlind && (
          <GlassOverlay vendor={vendor} visible={overlayVisible} onClose={()=>setOverlayVisible(false)} isBlind={isBlind} />
        )}
      </div>
    </>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
function DemoDiscoverInner() {
  const [isBlind,       setIsBlind]       = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [hasFilters,    setHasFilters]    = useState(false);

  return (
    <>
      <FilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        isBlind={isBlind}
      />
      <DiscoverFeed
        isBlind={isBlind}
        onOpenFilter={() => setFilterVisible(true)}
        onToggleBlind={() => setIsBlind(b => !b)}
        hasFilters={hasFilters}
      />
    </>
  );
}

export default function DemoDiscoverPage() {
  return (
    <Suspense fallback={
      <div style={{ position:'fixed', inset:0, background:'#0C0A09', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(245,240,232,0.35)' }}>Loading</span>
      </div>
    }>
      <DemoDiscoverInner />
    </Suspense>
  );
}
