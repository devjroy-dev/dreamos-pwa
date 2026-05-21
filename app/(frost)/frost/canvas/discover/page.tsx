'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFrostMode } from '../../../layout';
import { MessageCircle, Lock, Users, SlidersHorizontal, X } from 'lucide-react';
import { fetchDiscoverFeed, makeEnquireLink } from '../../../../../lib/frost-api/discover';
import { saveVendorToMuse } from '../../../../../lib/frost-api/muse';
import type { DiscoverVendor } from '../../../../../lib/types/discover';
import { MODES } from '../../../../../lib/frost/tokens';

// ── Category & tier constants ──────────────────────────────────────────────────

const ALL_CATEGORIES = [
  { id: 'venues',           label: 'Venues' },
  { id: 'photographers',    label: 'Photographers' },
  { id: 'mua',              label: 'Makeup Artists' },
  { id: 'designers',        label: 'Designers' },
  { id: 'jewellery',        label: 'Jewellery' },
  { id: 'choreographers',   label: 'Choreographers' },
  { id: 'content-creators', label: 'Content Creators' },
  { id: 'dj',               label: 'DJ & Music' },
  { id: 'event-managers',   label: 'Event Managers' },
  { id: 'bridal-wellness',  label: 'Bridal Wellness' },
] as const;

type CategoryId = typeof ALL_CATEGORIES[number]['id'];

const TIER_ORDER: Record<string, CategoryId[]> = {
  essential: ['venues','photographers','mua','designers','choreographers','dj','content-creators','jewellery','bridal-wellness','event-managers'],
  signature: ['venues','photographers','designers','mua','event-managers','choreographers','dj','content-creators','jewellery','bridal-wellness'],
  luxe:      ['event-managers','venues','photographers','designers','mua','choreographers','content-creators','dj','jewellery','bridal-wellness'],
};

const CITIES = ['Delhi NCR','Mumbai','Bangalore','Chennai','Hyderabad','Kolkata','Jaipur','Pune','Udaipur','Goa'];
const VIBE_OPTIONS = ['Candid','Traditional','Luxury','Cinematic','Boho','Festive','Minimalist','Royal','Destination','Contemporary'];
const BUDGET_OPTIONS = [
  { label: 'Under Rs 1L',   value: '100000' },
  { label: 'Rs 1L – 3L',   value: '300000' },
  { label: 'Rs 3L – 5L',   value: '500000' },
  { label: 'Rs 5L – 10L',  value: '1000000' },
  { label: 'Rs 10L+',      value: '' },
];

function getTierFromBudget(budget: number | null | undefined): string {
  if (!budget) return 'signature';
  if (budget < 500000)  return 'essential';
  if (budget < 2000000) return 'signature';
  return 'luxe';
}

function getTierGreeting(tier: string): string {
  if (tier === 'essential') return 'Handpicked for your celebration.';
  if (tier === 'luxe')      return 'An exquisite curation, just for you.';
  return 'Your vision, beautifully curated.';
}

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Filter sheet ───────────────────────────────────────────────────────────────

interface FilterState {
  city:   string | null;
  vibes:  string[];
  budget: string | null;
}

function FilterSheet({
  visible, onClose, filters, onApply,
  frostMode,
}: {
  visible:    boolean;
  onClose:    () => void;
  filters:    FilterState;
  onApply:    (f: FilterState) => void;
  frostMode:  string;
}) {
  const t = MODES[frostMode as 'E1A' | 'E3'] ?? MODES['E1A'];
  const isDark = frostMode === 'E1A';
  const [local, setLocal] = useState<FilterState>(filters);

  useEffect(() => { if (visible) setLocal(filters); }, [visible, filters]);

  if (!visible) return null;

  const pill = (active: boolean) => ({
    padding: '7px 14px',
    borderRadius: 20,
    border: `0.5px solid ${active ? t.brass : t.hairline}`,
    background: active ? (isDark ? 'rgba(191,160,77,0.15)' : 'rgba(191,160,77,0.12)') : 'transparent',
    fontFamily: "'Jost',sans-serif",
    fontSize: 10,
    fontWeight: 300,
    letterSpacing: '0.12em',
    color: active ? t.brass : t.soft,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    touchAction: 'manipulation' as const,
  });

  return (
    <div style={{ position:'fixed',inset:0,zIndex:50 }} onClick={onClose}>
      <div style={{ position:'absolute',inset:0,background:'rgba(0,0,0,0.45)',backdropFilter:'blur(4px)',WebkitBackdropFilter:'blur(4px)' }} />
      <div
        style={{ position:'absolute',bottom:0,left:0,right:0,background: isDark ? 'rgba(27,22,18,0.97)' : 'rgba(216,211,204,0.97)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderTop:`0.5px solid ${t.hairline}`,borderRadius:'20px 20px 0 0',paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 24px)',maxHeight:'85vh',overflowY:'auto',scrollbarWidth:'none' as const }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ display:'flex',justifyContent:'center',padding:'12px 0 8px' }}>
          <div style={{ width:36,height:4,borderRadius:2,background:t.hairlineStrong }} />
        </div>

        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 24px 20px' }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:300,color:t.ink,letterSpacing:'-0.01em' }}>Filters</span>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',color:t.soft,padding:4 }}><X size={18} strokeWidth={1.5} /></button>
        </div>

        <div style={{ padding:'0 24px',display:'flex',flexDirection:'column',gap:24 }}>

          {/* City */}
          <div>
            <p style={{ fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.2em',textTransform:'uppercase',color:t.soft,margin:'0 0 12px' }}>City</p>
            <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
              {CITIES.map(c => (
                <button key={c} style={pill(local.city === c)} onClick={() => setLocal(f => ({ ...f, city: f.city === c ? null : c }))}>{c}</button>
              ))}
            </div>
          </div>

          {/* Vibes */}
          <div>
            <p style={{ fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.2em',textTransform:'uppercase',color:t.soft,margin:'0 0 12px' }}>Vibe</p>
            <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
              {VIBE_OPTIONS.map(v => (
                <button key={v} style={pill(local.vibes.includes(v))} onClick={() => setLocal(f => ({ ...f, vibes: f.vibes.includes(v) ? f.vibes.filter(x=>x!==v) : [...f.vibes,v] }))}>{v}</button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <p style={{ fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.2em',textTransform:'uppercase',color:t.soft,margin:'0 0 12px' }}>Budget</p>
            <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
              {BUDGET_OPTIONS.map(b => (
                <button key={b.label} style={pill(local.budget === b.value)} onClick={() => setLocal(f => ({ ...f, budget: f.budget === b.value ? null : b.value }))}>{b.label}</button>
              ))}
            </div>
          </div>

        </div>

        {/* Actions */}
        <div style={{ display:'flex',gap:12,padding:'28px 24px 0' }}>
          <button
            onClick={() => { setLocal({ city:null,vibes:[],budget:null }); onApply({ city:null,vibes:[],budget:null }); onClose(); }}
            style={{ flex:1,padding:'13px 0',background:'transparent',border:`0.5px solid ${t.hairlineStrong}`,borderRadius:10,fontFamily:"'Jost',sans-serif",fontSize:10,fontWeight:300,letterSpacing:'0.18em',textTransform:'uppercase' as const,color:t.soft,cursor:'pointer',touchAction:'manipulation' as const }}
          >
            Clear
          </button>
          <button
            onClick={() => { onApply(local); onClose(); }}
            style={{ flex:2,padding:'13px 0',background:t.brass,border:'none',borderRadius:10,fontFamily:"'Jost',sans-serif",fontSize:10,fontWeight:300,letterSpacing:'0.18em',textTransform:'uppercase' as const,color:'#111111',cursor:'pointer',touchAction:'manipulation' as const }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Discover landing ───────────────────────────────────────────────────────────

function DiscoverLanding({
  onSelectCategory,
  onBrowseAll,
  onBlind,
  frostMode,
}: {
  onSelectCategory: (id: CategoryId) => void;
  onBrowseAll:      () => void;
  onBlind:          () => void;
  frostMode:        string;
}) {
  const router = useRouter();
  const t = MODES[frostMode as 'E1A' | 'E3'] ?? MODES['E1A'];
  const isDark = frostMode === 'E1A';

  const [bridgeName,  setBridgeName]  = useState<string | null>(null);
  const [daysLeft,    setDaysLeft]    = useState<number | null>(null);
  const [weddingInfo, setWeddingInfo] = useState<string | null>(null);
  const [tier,        setTier]        = useState('signature');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('couple_session');
      if (!raw) return;
      const session = JSON.parse(raw);
      if (session?.couple?.bride_name) setBridgeName(session.couple.bride_name);
      if (session?.couple?.wedding_date) {
        const wDate = new Date(session.couple.wedding_date);
        const diff  = Math.ceil((wDate.getTime() - Date.now()) / 86400000);
        if (diff > 0) setDaysLeft(diff);
        const month = wDate.toLocaleString('en-IN', { month: 'long' });
        const parts: string[] = [];
        if (session.couple.city) parts.push(session.couple.city);
        if (month)               parts.push(month);
        if (parts.length) setWeddingInfo(parts.join(' \u00b7 '));
      }
      const t2 = getTierFromBudget(session?.couple?.budget_total);
      setTier(t2);
    } catch {}
  }, []);

  const orderedCategories = React.useMemo(() => {
    const order = TIER_ORDER[tier] ?? TIER_ORDER.signature;
    return order.map(id => ALL_CATEGORIES.find(c => c.id === id)!).filter(Boolean);
  }, [tier]);

  const gold = '#C9A84C';

  const EXPLORE_ITEMS = [
    { id: 'inspired',  title: 'Get Inspired',  sub: 'Venues, decor, ideas'      },
    { id: 'lookbook',  title: 'Look Book',      sub: 'Designers, MUAs'           },
    { id: 'spotlight', title: 'Spotlight',      sub: 'Top vendors this month'    },
    { id: 'offers',    title: 'Special Offers', sub: 'Exclusive deals'           },
  ];

  return (
    <div className="frost-scroll" style={{ position:'fixed',inset:0,background:t.pagePaper,overflowY:'auto',WebkitOverflowScrolling:'touch' as const }}>

      {/* Back chevron */}
      <button
        onClick={() => router.push('/frost')}
        style={{ position:'fixed',top:'calc(env(safe-area-inset-top,0px) + 16px)',left:16,zIndex:25,width:36,height:36,borderRadius:'50%',background: isDark ? 'rgba(27,22,18,0.6)' : 'rgba(216,211,204,0.6)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',border:`0.5px solid ${t.hairline}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:t.ink,touchAction:'manipulation' as const }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div style={{ paddingTop:'calc(env(safe-area-inset-top,0px) + 72px)',paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 60px)' }}>

        {/* Header */}
        <div style={{ padding:'0 24px',marginBottom:6 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:300,color:t.ink,margin:'0 0 4px',lineHeight:1.15,letterSpacing:'-0.01em' }}>
            {getTimeGreeting()}{bridgeName ? `, ${bridgeName}` : ''}
          </p>
          {(daysLeft !== null || weddingInfo) && (
            <p style={{ fontFamily:"'Jost',sans-serif",fontSize:10,fontWeight:300,letterSpacing:'0.14em',color:t.soft,margin:0,textTransform:'uppercase' as const }}>
              {daysLeft !== null ? `${daysLeft} days` : ''}{daysLeft !== null && weddingInfo ? ' \u00b7 ' : ''}{weddingInfo ?? ''}
            </p>
          )}
        </div>

        {/* Tier greeting — italic serif centred with gold hairlines */}
        <div style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 24px 24px' }}>
          <div style={{ flex:1,height:'0.5px',background:'rgba(201,168,76,0.3)' }} />
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:300,fontStyle:'italic',color:t.soft,margin:0,whiteSpace:'nowrap' as const }}>
            {getTierGreeting(tier)}
          </p>
          <div style={{ flex:1,height:'0.5px',background:'rgba(201,168,76,0.3)' }} />
        </div>

        {/* Category pills — horizontal scroll, no emojis */}
        <div style={{ overflowX:'auto',WebkitOverflowScrolling:'touch' as const,paddingBottom:4,marginBottom:24,scrollbarWidth:'none' as const }}>
          <div style={{ display:'flex',gap:8,padding:'0 24px',width:'max-content' }}>
            {orderedCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{ flexShrink:0,padding:'9px 18px',borderRadius:50,border:`0.5px solid ${t.hairline}`,background:t.cardFill,fontFamily:"'Jost',sans-serif",fontSize:10,fontWeight:300,letterSpacing:'0.18em',textTransform:'uppercase' as const,color:t.ink,cursor:'pointer',touchAction:'manipulation' as const,whiteSpace:'nowrap' as const }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Discover Vendors — hero card */}
        <div style={{ padding:'0 24px',marginBottom:10 }}>
          <button
            onClick={onBrowseAll}
            style={{ width:'100%',display:'flex',alignItems:'center',gap:16,background: isDark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.06)',border:'0.5px solid rgba(201,168,76,0.3)',borderRadius:16,padding:'18px 20px',cursor:'pointer',touchAction:'manipulation' as const,textAlign:'left' as const }}
          >
            <div style={{ width:44,height:44,borderRadius:12,background:'rgba(201,168,76,0.12)',border:'0.5px solid rgba(201,168,76,0.25)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:300,color:t.ink,margin:'0 0 3px',letterSpacing:'0.01em' }}>Discover Vendors</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:300,color:t.soft,margin:0,lineHeight:1.4 }}>Swipe through India&apos;s finest wedding professionals</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4l4 4-4 4"/>
            </svg>
          </button>
        </div>

        {/* Editorial secondary cards — Couture + Destination */}
        <div style={{ padding:'0 24px',display:'flex',flexDirection:'column' as const,gap:8,marginBottom:28 }}>
          {[
            { id:'couture', title:'Couture', sub:"India\u2019s most distinguished wedding professionals", action: () => onSelectCategory('mua' as CategoryId), icon:(
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            )},
            { id:'destination', title:'Destination Weddings', sub:'Udaipur \u00b7 Goa \u00b7 Jaipur \u00b7 Mussoorie', action: onBrowseAll, icon:(
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            )},
          ].map(item => (
            <button
              key={item.id}
              onClick={item.action}
              style={{ width:'100%',display:'flex',alignItems:'center',gap:14,background:t.cardFill,border:`0.5px solid ${t.hairline}`,borderRadius:14,padding:'14px 16px',cursor:'pointer',touchAction:'manipulation' as const,textAlign:'left' as const }}
            >
              <div style={{ width:36,height:36,borderRadius:10,background: isDark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.08)',border:'0.5px solid rgba(201,168,76,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                {item.icon}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:300,color:t.ink,margin:'0 0 2px',letterSpacing:'0.01em' }}>{item.title}</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:300,color:t.soft,margin:0 }}>{item.sub}</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={t.soft} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4l4 4-4 4"/>
              </svg>
            </button>
          ))}
        </div>

        {/* E X P L O R E grid */}
        <div style={{ padding:'0 24px',marginBottom:24 }}>
          <p style={{ fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.4em',textTransform:'uppercase' as const,color:t.soft,textAlign:'center' as const,margin:'0 0 14px' }}>
            E X P L O R E
          </p>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
            {EXPLORE_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={onBrowseAll}
                style={{ background:t.cardFill,border:`0.5px solid ${t.hairline}`,borderRadius:14,padding:'16px 14px',textAlign:'left' as const,cursor:'pointer',touchAction:'manipulation' as const }}
              >
                <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontWeight:300,color:t.ink,margin:'0 0 4px',letterSpacing:'0.01em' }}>{item.title}</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:300,color:t.soft,margin:0,lineHeight:1.5 }}>{item.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Discover Blind — gold border, calls attention without being loud */}
        <div style={{ padding:'0 24px' }}>
          <button
            onClick={onBlind}
            style={{ width:'100%',padding:'13px 0',background:'transparent',border:`1px solid rgba(201,168,76,0.45)`,borderRadius:12,fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.28em',textTransform:'uppercase' as const,color:'rgba(201,168,76,0.7)',cursor:'pointer',touchAction:'manipulation' as const,boxShadow:'0 0 12px rgba(201,168,76,0.08)' }}
          >
            Discover Blind
          </button>
        </div>

      </div>
    </div>
  );
}

const haptic = (ms: number) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(ms); } catch {}
  }
};

const SWIPE_THRESHOLD = 45;
const SWIPE_VELOCITY  = 0.3;
const TAP_MAX_MOVE    = 10;
const TAP_MAX_TIME    = 250;
const DOUBLE_TAP_MS   = 280;
const OVERLAY_DISMISS = 80;

async function handleSaveToMuse(vendorId: string, imageUrl: string | null): Promise<boolean> {
  try {
    const result = await saveVendorToMuse(vendorId, imageUrl);
    return result.ok === true;
  } catch { return false; }
}

function spawnSaveToast(alreadySaved = false) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('muse-save-toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'muse-save-toast';
  el.style.cssText = `
    position:fixed;top:calc(env(safe-area-inset-top,0px) + 72px);
    left:50%;transform:translateX(-50%);
    background:rgba(17,17,17,0.75);
    backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
    border:0.5px solid rgba(255,255,255,0.15);
    color:rgba(248,247,245,0.9);
    font-family:'Jost',sans-serif;font-size:10px;font-weight:300;
    letter-spacing:0.18em;text-transform:uppercase;
    padding:8px 18px;border-radius:20px;
    z-index:9998;pointer-events:none;white-space:nowrap;
    animation:toastSlideIn 250ms cubic-bezier(0.22,1,0.36,1) forwards;
  `;
  el.textContent = alreadySaved ? 'Already in Muse' : 'Saved to Muse \u2665';
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 300ms ease'; }, 1800);
  setTimeout(() => el.remove(), 2200);
}

function spawnHeart() {
  if (typeof document === 'undefined') return;
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;top:50%;left:50%;
    transform:translate(-50%,-50%) scale(0);
    font-size:88px;z-index:9999;pointer-events:none;
    animation:heartPop 700ms cubic-bezier(0.22,1,0.36,1) forwards;
    color:#C9A84C;
  `;
  el.textContent = '\u2665';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 700);
  haptic(14);
}

function GlassOverlay({ vendor, visible, onClose, isBlind }: {
  vendor: DiscoverVendor; visible: boolean; onClose: () => void; isBlind: boolean;
}) {
  const dragStartY = useRef(0);
  const [dragDelta, setDragDelta] = useState(0);
  const isDragging = useRef(false);
  const [circleToast, setCircleToast] = useState(false);

  const onTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    isDragging.current = true;
    setDragDelta(0);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta > 0) setDragDelta(delta);
  };
  const onTouchEnd = () => {
    isDragging.current = false;
    if (dragDelta > OVERLAY_DISMISS) { setDragDelta(0); onClose(); }
    else setDragDelta(0);
  };

  const ty = dragDelta > 0 ? `translateY(${dragDelta}px)` : 'translateY(0)';
  const op = dragDelta > 0 ? Math.max(0.3, 1 - dragDelta / 200) : 1;

  const enquireLink = vendor.enquire_link ||
    (vendor.routing_handle ? makeEnquireLink(vendor.routing_handle) : null);

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 20,
      transform: visible ? ty : 'translateY(100%)',
      transition: isDragging.current ? 'none' : 'transform 340ms cubic-bezier(0.22,1,0.36,1)',
      opacity: visible ? op : 0,
      willChange: 'transform',
      background: 'rgba(12,10,9,0.82)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '0.5px solid rgba(255,255,255,0.08)',
      borderRadius: '20px 20px 0 0',
      paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 24px)',
    }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div style={{ display:'flex',justifyContent:'center',padding:'12px 0 16px' }}>
        <div style={{ width:36,height:4,borderRadius:2,background:'rgba(255,255,255,0.2)' }} />
      </div>

      {circleToast && (
        <div style={{ position:'absolute',top:16,left:'50%',transform:'translateX(-50%)',background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:20,padding:'6px 16px',fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:300,color:'rgba(248,247,245,0.8)',whiteSpace:'nowrap',zIndex:30 }}>
          Add someone to your Circle first — tap Circle in the menu
        </div>
      )}

      <div style={{ padding:'0 24px' }}>
        <p style={{ fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.22em',textTransform:'uppercase',color:'rgba(248,247,245,0.5)',margin:'0 0 8px' }}>
          {vendor.category}&nbsp;·&nbsp;{vendor.city}
        </p>

        {!isBlind && (
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:'#F8F7F5',margin:'0 0 4px',letterSpacing:'-0.01em',lineHeight:1.1 }}>
            {vendor.name}
          </h2>
        )}

        {vendor.about && (
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:300,fontStyle:'italic',color:'rgba(248,247,245,0.65)',margin:'0 0 12px',lineHeight:1.5 }}>
            {vendor.about}
          </p>
        )}

        {!isBlind && vendor.starting_price && (
          <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:300,color:'rgba(248,247,245,0.5)',margin:'0 0 20px' }}>
            {vendor.starting_price >= 100000
              ? `Rs ${(vendor.starting_price / 100000).toFixed(vendor.starting_price % 100000 === 0 ? 0 : 1)}L onwards`
              : `Rs ${(vendor.starting_price / 1000).toFixed(0)}K onwards`}
          </p>
        )}

        {isBlind && vendor.vibe_tags.length > 0 && (
          <p style={{ fontFamily:"'Jost',sans-serif",fontSize:10,fontWeight:300,letterSpacing:'0.15em',color:'rgba(248,247,245,0.55)',margin:'0 0 20px' }}>
            {vendor.vibe_tags.join(' · ')}
          </p>
        )}

        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (enquireLink) window.open(enquireLink, '_blank');
            }}
            style={{ width:'100%',padding:'14px 0',background:'rgba(248,247,245,0.9)',border:'none',borderRadius:10,fontFamily:"'Jost',sans-serif",fontSize:10,fontWeight:300,letterSpacing:'0.22em',textTransform:'uppercase',color:'#111111',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,touchAction:'manipulation' }}
          >
            <MessageCircle size={14} strokeWidth={1.5} />
            Enquire
          </button>

          <div style={{ display:'flex',gap:8 }}>
            <button
              disabled
              style={{ flex:1,padding:'12px 0',background:'rgba(255,255,255,0.12)',border:'0.5px solid rgba(255,255,255,0.18)',borderRadius:10,fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(248,247,245,0.7)',cursor:'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}
            >
              <Lock size={12} strokeWidth={1.5} />
              Lock Date
              <span style={{ fontSize:7,letterSpacing:'0.05em',textTransform:'none',fontStyle:'italic',color:'rgba(248,247,245,0.35)' }}>beta</span>
            </button>

            <button
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); setCircleToast(true); setTimeout(() => setCircleToast(false), 2500); }}
              style={{ flex:1,padding:'12px 0',background:'rgba(255,255,255,0.12)',border:'0.5px solid rgba(255,255,255,0.18)',borderRadius:10,fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(248,247,245,0.7)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,touchAction:'manipulation' }}
            >
              <Users size={12} strokeWidth={1.5} />
              Circle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageDots({ total, current }: { total: number; current: number }) {
  if (total <= 1) return null;
  return (
    <div style={{ position:'fixed',top:'calc(env(safe-area-inset-top,0px) + 20px)',left:'50%',transform:'translateX(-50%)',display:'flex',gap:5,zIndex:25,pointerEvents:'none' }}>
      {Array.from({ length: Math.min(total, 8) }).map((_, i) => (
        <div key={i} style={{ width: i === current ? 16 : 5,height:5,borderRadius:3,background: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',transition:'all 240ms cubic-bezier(0.22,1,0.36,1)',boxShadow:'0 1px 3px rgba(0,0,0,0.3)' }} />
      ))}
    </div>
  );
}

function BlindCentreToast({ hint }: { hint: 'dismiss'|null }) {
  if (!hint) return null;
  return (
    <div style={{ position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:30,pointerEvents:'none',animation:'heartPop 500ms cubic-bezier(0.22,1,0.36,1) forwards' }}>
      <span style={{ fontSize:72,lineHeight:1,color:'#C9A84C' }}>✕</span>
    </div>
  );
}

function EmptyDeck({ mode }: { mode: string }) {
  return (
    <div style={{ position:'fixed',inset:0,background:'#0C0A09',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12 }}>
      <span style={{ fontSize:48 }}>\u2726</span>
      <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:300,fontStyle:'italic',color:'rgba(248,247,245,0.7)' }}>
        {mode === 'blind' ? "You've seen them all." : "You've seen everyone."}
      </span>
      <span style={{ fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(248,247,245,0.35)' }}>
        Check back soon
      </span>
    </div>
  );
}

function DiscoveryFeedContent({
  initialCategory,
  initialBlind,
  filters,
  onBackToLanding,
  onOpenFilter,
}: {
  initialCategory: CategoryId | null;
  initialBlind:    boolean;
  filters:         FilterState;
  onBackToLanding: () => void;
  onOpenFilter:    () => void;
}) {
  const isBlind = initialBlind;

  const [vendors, setVendors] = useState<DiscoverVendor[]>([]);
  const [vendorIdx, setVendorIdx] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [dissolveKey, setDissolveKey] = useState(0);
  const [blindHint, setBlindHint] = useState<'dismiss'|null>(null);
  const [blindIdx, setBlindIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const currentPhotoRef = useRef<string | null>(null);
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapTime = useRef(0);
  const tapCount = useRef(0);

  useEffect(() => {
    setLoading(true);
    fetchDiscoverFeed({
      page:     0,
      category: initialCategory ?? undefined,
      city:     filters.city    ?? undefined,
      budget:   filters.budget  ?? undefined,
      vibes:    filters.vibes.length > 0 ? filters.vibes.join(',') : undefined,
    })
      .then(({ vendors: v, has_more }) => {
        setVendors(v);
        setHasMore(has_more);
        setVendorIdx(0);
        setImageIdx(0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [initialCategory, filters]);

  useEffect(() => {
    if (!hasMore) return;
    if (vendors.length === 0) return;
    if (vendorIdx < vendors.length - 3) return;
    const nextPage = currentPage + 1;
    fetchDiscoverFeed({
      page:     nextPage,
      category: initialCategory ?? undefined,
      city:     filters.city    ?? undefined,
      budget:   filters.budget  ?? undefined,
      vibes:    filters.vibes.length > 0 ? filters.vibes.join(',') : undefined,
    })
      .then(({ vendors: more, has_more }) => {
        if (more.length > 0) {
          setVendors(prev => [...prev, ...more]);
          setCurrentPage(nextPage);
          setHasMore(has_more);
        } else {
          setHasMore(false);
        }
      })
      .catch(() => {});
  }, [vendorIdx, vendors.length, hasMore, currentPage, initialCategory, filters]);

  // Blind queue: flat list of {vendorId, imageUrl} across all vendors x all photos
  const blindQueue = React.useMemo(() => {
    const q: { vendorId: string; imageUrl: string; vendorObj: DiscoverVendor }[] = [];
    vendors.forEach(v => {
      if (v.photos.length === 0) {
        q.push({ vendorId: v.id, imageUrl: '', vendorObj: v });
      } else {
        v.photos.forEach(p => q.push({ vendorId: v.id, imageUrl: p, vendorObj: v }));
      }
    });
    return q;
  }, [vendors]);

  const vendor = vendors[vendorIdx];
  // Preload next images silently — reduces perceived lag
  useEffect(() => {
    if (!vendor) return;
    const toPreload: string[] = [];
    for (let i = imageIdx + 1; i < Math.min(vendor.photos.length, imageIdx + 3); i++) {
      toPreload.push(vendor.photos[i]);
    }
    if (vendorIdx + 1 < vendors.length) {
      const next = vendors[vendorIdx + 1];
      if (next.photos[0]) toPreload.push(next.photos[0]);
    }
    toPreload.forEach(src => { const img = new Image(); img.src = src; });
  }, [vendorIdx, imageIdx, vendor, vendors]);

  const goNextVendor = useCallback((direction: 'left'|'right'|null = null) => {
    if (vendorIdx >= vendors.length - 1) return;
    if (direction) {
      setVendorIdx(i => i + 1);
      setImageIdx(0);
      setOverlayVisible(false);
      setDissolveKey(k => k + 1);
      haptic(5);
    } else {
      setVendorIdx(i => i + 1);
      setImageIdx(0);
      setOverlayVisible(false);
      setDissolveKey(k => k + 1);
      haptic(5);
    }
  }, [vendorIdx, vendors.length]);

  const goPrevVendor = useCallback(() => {
    if (vendorIdx <= 0) return;
    setVendorIdx(i => i - 1);
    setImageIdx(0);
    setOverlayVisible(false);
    setDissolveKey(k => k + 1);
    haptic(5);
  }, [vendorIdx]);

  const nextImage = useCallback(() => {
    if (vendor && imageIdx < vendor.photos.length - 1) {
      setImageIdx(i => i + 1); setDissolveKey(k => k + 1); haptic(4);
    }
  }, [imageIdx, vendor]);

  const prevImage = useCallback(() => {
    if (imageIdx > 0) { setImageIdx(i => i - 1); setDissolveKey(k => k + 1); haptic(4); }
  }, [imageIdx]);

  const handleSingleTap = useCallback(() => {
    if (isBlind) return;
    setOverlayVisible(v => !v);
    haptic(4);
  }, [isBlind]);

  const handleDoubleTap = useCallback(() => {
    if (isBlind) {
      const item = blindQueue[blindIdx];
      if (!item) return;
      spawnHeart();
      handleSaveToMuse(item.vendorId, item.imageUrl || null).then(ok => spawnSaveToast(!ok));
      return;
    }
    if (!vendor) return;
    spawnHeart();
    handleSaveToMuse(vendor.id, currentPhotoRef.current).then(ok => spawnSaveToast(!ok));
  }, [isBlind, vendor, blindQueue, blindIdx]);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const start = touchStart.current;
    touchStart.current = null;
    const end = e.changedTouches[0];
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    const dt = Date.now() - start.t;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX < TAP_MAX_MOVE && absY < TAP_MAX_MOVE && dt < TAP_MAX_TIME) {
      const now = Date.now();
      const since = now - lastTapTime.current;
      if (since < DOUBLE_TAP_MS && tapCount.current >= 1) {
        if (tapTimer.current) clearTimeout(tapTimer.current);
        tapCount.current = 0;
        handleDoubleTap();
      } else {
        tapCount.current = 1; lastTapTime.current = now;
        tapTimer.current = setTimeout(() => {
          if (tapCount.current === 1) handleSingleTap();
          tapCount.current = 0;
        }, DOUBLE_TAP_MS);
      }
      return;
    }

    const velocity = Math.max(absX, absY) / Math.max(dt, 1);
    const passed = Math.max(absX, absY) > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY;
    if (!passed) return;

    if (isBlind) {
      // Blind mode: swipe up → next photo in flat queue. No carousel, no left/right.
      if (absY > absX && dy < -SWIPE_THRESHOLD) {
        setBlindHint('dismiss');
        setTimeout(() => setBlindHint(null), 500);
        setBlindIdx(i => Math.min(i + 1, blindQueue.length - 1));
        setDissolveKey(k => k + 1);
        haptic(5);
      }
      return;
    }

    if (overlayVisible && absY > absX && dy > OVERLAY_DISMISS) {
      setOverlayVisible(false); return;
    }
    if (absY > absX) {
      if (dy < -SWIPE_THRESHOLD) goNextVendor(); else if (dy > SWIPE_THRESHOLD) goPrevVendor();
    } else {
      if (dx < -SWIPE_THRESHOLD) nextImage(); else if (dx > SWIPE_THRESHOLD) prevImage();
    }
  };

  if (loading) {
    return (
      <div style={{ position:'fixed',inset:0,background:'#0C0A09',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <span style={{ fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(245,240,232,0.35)' }}>Loading</span>
      </div>
    );
  }

  if (isBlind && blindQueue.length > 0 && blindIdx >= blindQueue.length) return <EmptyDeck mode={isBlind ? 'blind' : 'discover'} />;
  if (!vendor) return <EmptyDeck mode={isBlind ? 'blind' : 'discover'} />;

  const photos = vendor.photos.length > 0 ? vendor.photos : [];
  const currentPhoto = photos[imageIdx] || null;
  currentPhotoRef.current = currentPhoto;

  // In blind mode, use the flat queue
  const blindItem = isBlind ? (blindQueue[blindIdx] || null) : null;
  const blindPhoto = blindItem?.imageUrl || null;

  return (
    <>
      <style jsx global>{`
        @keyframes heartPop {
          0%   { opacity:0; transform:translate(-50%,-50%) scale(0.3); }
          45%  { opacity:1; transform:translate(-50%,-50%) scale(1.15); }
          70%  { transform:translate(-50%,-50%) scale(0.95); }
          100% { opacity:0; transform:translate(-50%,-50%) scale(1); }
        }
        @keyframes dissolveIn { from{opacity:0} to{opacity:1} }
        @keyframes slideInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastSlideIn { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>

      <div
        style={{ position:'fixed',inset:0,background:'#0C0A09',overflow:'hidden',touchAction:'none',userSelect:'none',WebkitUserSelect:'none' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          key={dissolveKey}
          style={{
            position:'absolute', inset:0,
            animation: 'dissolveIn 260ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {(isBlind ? blindPhoto : currentPhoto) ? (
            <img src={(isBlind ? blindPhoto : currentPhoto)!} alt="" draggable={false} style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',willChange:'opacity' }} />
          ) : (
            <div style={{ position:'absolute',inset:0,background:'#1a1714',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:'italic',color:'rgba(248,247,245,0.2)' }}>No photo yet</span>
            </div>
          )}
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 20%, transparent 65%, rgba(0,0,0,0.5) 100%)',pointerEvents:'none' }} />
        </div>

        {!isBlind && <ImageDots total={photos.length} current={imageIdx} />}

        <button
          onClick={onBackToLanding}
          style={{ position:'fixed',top:'calc(env(safe-area-inset-top,0px) + 16px)',left:16,zIndex:25,width:36,height:36,borderRadius:'50%',background:'rgba(0,0,0,0.35)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',border:'0.5px solid rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'rgba(255,255,255,0.9)',touchAction:'manipulation' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {!isBlind && (
          <button
            onClick={onOpenFilter}
            style={{ position:'fixed',top:'calc(env(safe-area-inset-top,0px) + 16px)',right:16,zIndex:25,width:36,height:36,borderRadius:'50%',background:'rgba(0,0,0,0.35)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',border:'0.5px solid rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'rgba(255,255,255,0.9)',touchAction:'manipulation' }}
          >
            <SlidersHorizontal size={15} strokeWidth={1.5} />
          </button>
        )}

        {isBlind && (
          <div style={{ position:'fixed',top:'calc(env(safe-area-inset-top,0px) + 20px)',right:16,zIndex:25,background:'rgba(0,0,0,0.45)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',border:'0.5px solid rgba(255,255,255,0.15)',borderRadius:20,padding:'5px 14px',fontFamily:"'Jost',sans-serif",fontSize:8,fontWeight:300,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.75)' }}>
            Blind
          </div>
        )}

        {isBlind && <BlindCentreToast hint={blindHint} />}

        {!isBlind && !overlayVisible && (
          <div style={{ position:'fixed',bottom:'calc(env(safe-area-inset-bottom,0px) + 28px)',left:0,right:0,display:'flex',justifyContent:'center',zIndex:10,pointerEvents:'none',animation:'slideInUp 400ms cubic-bezier(0.22,1,0.36,1)' }}>
            <span style={{ fontFamily:"'Jost',sans-serif",fontSize:9,fontWeight:200,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)' }}>
              Tap · Double-tap to save · Swipe to browse
            </span>
          </div>
        )}

        {!isBlind && (
          <GlassOverlay
            vendor={vendor}
            visible={overlayVisible}
            onClose={() => setOverlayVisible(false)}
            isBlind={isBlind}
          />
        )}
      </div>
    </>
  );
}

export default function DiscoveryFeed() {
  const { homeMode } = useFrostMode();
  const [discoverState, setDiscoverState]     = useState<'landing' | 'swipe'>('landing');
  const [activeCategory, setActiveCategory]   = useState<CategoryId | null>(null);
  const [isBlindMode,    setIsBlindMode]       = useState(false);
  const [filterVisible,  setFilterVisible]     = useState(false);
  const [filters,        setFilters]           = useState<FilterState>({ city: null, vibes: [], budget: null });
  const [appliedFilters, setAppliedFilters]    = useState<FilterState>({ city: null, vibes: [], budget: null });

  const handleSelectCategory = (id: CategoryId) => {
    setActiveCategory(id);
    setIsBlindMode(false);
    setDiscoverState('swipe');
  };

  const handleBrowseAll = () => {
    setActiveCategory(null);
    setIsBlindMode(false);
    setDiscoverState('swipe');
  };

  const handleBlind = () => {
    setActiveCategory(null);
    setIsBlindMode(true);
    setDiscoverState('swipe');
  };

  const handleBackToLanding = () => {
    setDiscoverState('landing');
    setActiveCategory(null);
    setIsBlindMode(false);
  };

  const handleApplyFilters = (f: FilterState) => {
    setAppliedFilters(f);
    setFilters(f);
  };

  if (discoverState === 'landing') {
    return (
      <DiscoverLanding
        onSelectCategory={handleSelectCategory}
        onBrowseAll={handleBrowseAll}
        onBlind={handleBlind}
        frostMode={homeMode}
      />
    );
  }

  return (
    <>
      <FilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        onApply={handleApplyFilters}
        frostMode={homeMode}
      />
      <Suspense fallback={
        <div style={{ position:'fixed',inset:0,background:'#0C0A09',display:'flex',alignItems:'center',justifyContent:'center' }}>
          <span style={{ fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(245,240,232,0.35)' }}>
            Loading
          </span>
        </div>
      }>
        <DiscoveryFeedContent
          initialCategory={activeCategory}
          initialBlind={isBlindMode}
          filters={appliedFilters}
          onBackToLanding={handleBackToLanding}
          onOpenFilter={() => setFilterVisible(true)}
        />
      </Suspense>
    </>
  );
}
