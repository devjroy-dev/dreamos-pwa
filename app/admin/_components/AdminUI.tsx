'use client';
// app/admin/_components/AdminUI.tsx
// TDW Control Room — Editorial design system.
// Every page imports only from here. Change here, changes everywhere.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode, DragEvent as ReactDragEvent } from 'react';

const EASE = 'cubic-bezier(0.22,1,0.36,1)';

// ── Design tokens ─────────────────────────────────────────────────────────────
export const T = {
  // Backgrounds — deep navy chrome
  bg:           '#0A0F18',
  surface:      '#0F1622',
  card:         'rgba(255,255,255,0.055)',
  cardHover:    'rgba(255,255,255,0.09)',
  sheet:        '#0F1622',

  // Borders — neutral hairlines; oxblood reserved for focus
  border:       'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.18)',
  borderFocus:  'rgba(196,64,88,0.55)',

  // Colour — oxblood spark. Key name kept as `gold` so no page/call-site needs editing.
  gold:         '#C44058',
  goldDim:      'rgba(196,64,88,0.70)',
  goldSoft:     'rgba(196,64,88,0.18)',

  // Text — warm ivory (pairs with navy + oxblood)
  ink:          '#F0EAE0',
  soft:         'rgba(240,234,224,0.62)',
  muted:        'rgba(240,234,224,0.42)',
  dim:          'rgba(240,234,224,0.22)',

  // Semantic — danger nudged orange so the red Deny chip never reads as oxblood
  danger:       '#E0574E',
  dangerSoft:   'rgba(224,87,78,0.15)',
  success:      '#4EC994',
  successSoft:  'rgba(78,201,148,0.15)',
  warning:      '#D4A017',

  // Fonts
  ff: {
    display: '"Cormorant Garamond", serif',
    body:    '"DM Sans", sans-serif',
    label:   '"Jost", sans-serif',
  },
};

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, sub, action }: {
  title: string; sub?: string; action?: ReactNode;
}) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32, gap:16 }}>
      <div>
        <h1 style={{ fontFamily:T.ff.body, fontWeight:700, fontSize:27, color:T.ink, lineHeight:1.1, margin:0, letterSpacing:'-0.015em' }}>{title}</h1>
        {sub && (
          <p style={{ fontFamily:T.ff.label, fontWeight:600, fontSize:10, color:T.goldDim, letterSpacing:'0.14em', textTransform:'uppercase', marginTop:9, marginBottom:0 }}>{sub}</p>
        )}
      </div>
      {action && <div style={{ flexShrink:0, marginTop:4 }}>{action}</div>}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, accent }: {
  label: string; value: string | number; sub?: string; accent?: boolean;
}) {
  return (
    <div style={{ background:T.card, border:`0.5px solid ${accent ? T.borderStrong : T.border}`, borderRadius:14, padding:'20px 22px', position:'relative', overflow:'hidden' }}>
      {accent && <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:`linear-gradient(to right, ${T.gold}, transparent)` }} />}
      <div style={{ fontFamily:T.ff.label, fontWeight:600, fontSize:10, color:T.soft, letterSpacing:'0.13em', textTransform:'uppercase', marginBottom:12 }}>{label}</div>
      <div style={{ fontFamily:T.ff.body, fontWeight:700, fontSize:38, color:accent ? T.gold : T.ink, lineHeight:1, letterSpacing:'-0.03em' }}>{value}</div>
      {sub && <div style={{ fontFamily:T.ff.body, fontWeight:400, fontSize:12, color:T.muted, marginTop:9 }}>{sub}</div>}
    </div>
  );
}

// ── GoldBtn ───────────────────────────────────────────────────────────────────
export function GoldBtn({ label, onClick, disabled, small }: {
  label: string; onClick: () => void; disabled?: boolean; small?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        background: disabled ? T.goldSoft : T.gold,
        border:'none', borderRadius:10,
        padding: small ? '9px 16px' : '13px 22px',
        fontFamily:T.ff.label, fontWeight:300,
        fontSize: small ? 9 : 10,
        letterSpacing:'0.2em', textTransform:'uppercase',
        color: disabled ? T.goldDim : T.ink,
        minHeight: small ? 38 : 44,
        cursor: disabled ? 'not-allowed' : 'pointer',
        whiteSpace:'nowrap',
        transform: pressed && !disabled ? 'scale(0.97)' : 'scale(1)',
        transition:`all 120ms ${EASE}`,
        boxShadow: pressed || disabled ? 'none' : '0 2px 12px rgba(196,64,88,0.22)',
      }}
    >
      {label}
    </button>
  );
}

// ── GhostBtn ──────────────────────────────────────────────────────────────────
export function GhostBtn({ label, onClick, danger, small, disabled }: {
  label: string; onClick: () => void; danger?: boolean; small?: boolean; disabled?: boolean;
}) {
  const [hov, setHov] = useState(false);
  const col = danger ? T.danger : T.soft;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? (danger ? T.dangerSoft : 'rgba(240,234,224,0.04)') : 'transparent',
        border:`0.5px solid ${danger ? (hov ? T.danger : 'rgba(217,88,88,0.4)') : T.borderStrong}`,
        borderRadius:10,
        padding: small ? '9px 16px' : '13px 22px',
        fontFamily:T.ff.label, fontWeight:200,
        fontSize: small ? 9 : 10,
        letterSpacing:'0.2em', textTransform:'uppercase',
        color: col, minHeight: small ? 38 : 44,
        whiteSpace:'nowrap', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition:`all 150ms ${EASE}`,
      }}
    >
      {label}
    </button>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
// ── ActionChip ────────────────────────────────────────────────────────────────
// One-tap on-card action. Replaces slide-up sheets for approve/deny/revoke.
export function ActionChip({ label, tone, onClick, disabled }: {
  label: string; tone: 'ok' | 'no' | 'neutral'; onClick: () => void; disabled?: boolean;
}) {
  const map = { ok: [T.success, T.successSoft], no: [T.danger, T.dangerSoft], neutral: [T.gold, T.goldSoft] } as const;
  const [c, bg] = map[tone];
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); if (!disabled) onClick(); }}
      disabled={disabled}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
      style={{
        flex: 1, background: disabled ? 'rgba(255,255,255,0.04)' : bg,
        border: `0.5px solid ${disabled ? T.border : c}`,
        color: disabled ? T.muted : c,
        fontFamily: T.ff.label, fontWeight: 600, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
        borderRadius: 9, minHeight: 44, cursor: disabled ? 'not-allowed' : 'pointer',
        transform: pressed && !disabled ? 'scale(0.97)' : 'scale(1)',
        transition: `all 120ms ${EASE}`,
      }}
    >{label}</button>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
export function Toast({ msg, onDone, error }: { msg: string; onDone: () => void; error?: boolean }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position:'fixed', bottom:'calc(env(safe-area-inset-bottom,0px) + 28px)',
      left:'50%', transform:'translateX(-50%)',
      background: error ? '#2A1010' : '#0F1F14',
      border:`0.5px solid ${error ? T.danger : T.success}`,
      color: error ? T.danger : T.success,
      fontFamily:T.ff.label, fontSize:11, fontWeight:300, letterSpacing:'0.14em',
      padding:'11px 22px', borderRadius:100, zIndex:9999,
      whiteSpace:'nowrap', boxShadow:'0 8px 40px rgba(0,0,0,0.6)',
      animation:`toastIn 240ms ${EASE} both`,
    }}>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
      {msg}
    </div>
  );
}

// ── FieldInput ────────────────────────────────────────────────────────────────
export function FieldInput({ label, value, onChange, placeholder, type = 'text', hint }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:7 }}>
        <label style={{ fontFamily:T.ff.label, fontWeight:300, fontSize:8, color: focused ? T.goldDim : T.soft, letterSpacing:'0.26em', textTransform:'uppercase', transition:`color 200ms ${EASE}` }}>{label}</label>
        {hint && <span style={{ fontFamily:T.ff.body, fontSize:10, color:T.dim }}>{hint}</span>}
      </div>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width:'100%',
          background: focused ? 'rgba(196,64,88,0.04)' : 'rgba(255,255,255,0.03)',
          border:`0.5px solid ${focused ? T.borderFocus : T.border}`,
          borderRadius:9, padding:'12px 14px',
          fontFamily:T.ff.body, fontSize:14, fontWeight:300, color:T.ink,
          outline:'none', minHeight:46,
          transition:`all 200ms ${EASE}`,
          boxShadow: focused ? `0 0 0 3px rgba(196,64,88,0.07)` : 'none',
        }}
      />
    </div>
  );
}

// ── FieldSelect ───────────────────────────────────────────────────────────────
export function FieldSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:18, position:'relative' }}>
      <label style={{ display:'block', fontFamily:T.ff.label, fontWeight:300, fontSize:8, color: focused ? T.goldDim : T.soft, letterSpacing:'0.26em', textTransform:'uppercase', marginBottom:7, transition:`color 200ms ${EASE}` }}>{label}</label>
      <div style={{ position:'relative' }}>
        <select
          value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width:'100%',
            background: focused ? 'rgba(196,64,88,0.04)' : '#10171F',
            border:`0.5px solid ${focused ? T.borderFocus : T.border}`,
            borderRadius:9, padding:'12px 36px 12px 14px',
            fontFamily:T.ff.body, fontSize:14, fontWeight:300, color:T.ink,
            outline:'none', minHeight:46, appearance:'none',
            transition:`all 200ms ${EASE}`,
            boxShadow: focused ? `0 0 0 3px rgba(196,64,88,0.07)` : 'none',
            cursor:'pointer',
          }}
        >
          {options.map(o => <option key={o.value} value={o.value} style={{ background:'#10171F' }}>{o.label}</option>)}
        </select>
        {/* Custom chevron */}
        <span style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:T.goldDim, fontSize:11, fontFamily:T.ff.label }}>▾</span>
      </div>
    </div>
  );
}

// ── BottomSheet ───────────────────────────────────────────────────────────────
// Fully fixed. Scroll lock, drag-to-dismiss, correct z stacking, no content jump.
export function BottomSheet({ visible, onClose, title, children }: {
  visible: boolean; onClose: () => void; title: string; children: ReactNode;
}) {
  const sheetRef  = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);
  const [dragY,   setDragY]   = useState(0);
  const isDragging = useRef(false);

  // Body scroll lock
  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [visible]);

  // Drag to dismiss
  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientY;
    isDragging.current = true;
    setDragY(0);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dy = e.touches[0].clientY - dragStart.current;
    if (dy > 0) { e.preventDefault(); setDragY(dy); }
  };
  const onTouchEnd = () => {
    isDragging.current = false;
    if (dragY > 100) { setDragY(0); onClose(); }
    else setDragY(0);
  };

  const translateY = visible
    ? dragY > 0 ? `translateY(${dragY}px)` : 'translateY(0)'
    : 'translateY(105%)';

  const opacity = dragY > 0 ? Math.max(0, 1 - dragY / 300) : 1;

  return (
    <>
      <style>{`@keyframes sheetIn{from{transform:translateY(105%)}to{transform:translateY(0)}}`}</style>

      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0, zIndex:300,
          background:'rgba(0,0,0,0.72)',
          backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
          opacity: visible ? opacity : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: dragY > 0 ? 'none' : `opacity 300ms ${EASE}`,
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position:'fixed', bottom:0, left:0, right:0, zIndex:301,
          background:'linear-gradient(180deg, #161310 0%, #111009 100%)',
          border:`0.5px solid ${T.border}`,
          borderTop:`0.5px solid ${T.borderStrong}`,
          borderRadius:'20px 20px 0 0',
          maxHeight:'92vh', overflowY:'auto', overflowX:'hidden',
          scrollbarWidth:'none',
          transform: translateY,
          transition: isDragging.current ? 'none' : `transform 380ms ${EASE}`,
          paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 28px)',
          touchAction:'pan-y',
        }}
      >
        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', paddingTop:14, paddingBottom:4, flexShrink:0 }}>
          <div style={{ width:40, height:4, borderRadius:2, background:T.border }} />
        </div>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 24px 20px', borderBottom:`0.5px solid ${T.border}`, marginBottom:24 }}>
          <span style={{ fontFamily:T.ff.display, fontStyle:'italic', fontSize:24, fontWeight:300, color:T.ink, letterSpacing:'-0.01em' }}>{title}</span>
          <button
            onClick={onClose}
            style={{ background:'rgba(255,255,255,0.05)', border:`0.5px solid ${T.border}`, borderRadius:'50%', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:T.soft, fontSize:14, flexShrink:0, transition:`all 150ms ${EASE}` }}
          >✕</button>
        </div>

        {/* Content */}
        <div style={{ padding:'0 24px' }}>{children}</div>
      </div>
    </>
  );
}

// ── UploadZone ────────────────────────────────────────────────────────────────
export function UploadZone({ onFile, onUrl, loading, accept = 'image/*' }: {
  onFile: (file: File) => Promise<void>;
  onUrl:  (url: string) => Promise<void>;
  loading: boolean;
  accept?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab,      setTab]      = useState<'file'|'url'>('file');
  const [url,      setUrl]      = useState('');
  const [dragging, setDragging] = useState(false);
  const [urlFocus, setUrlFocus] = useState(false);

  const handleDrop = (e: ReactDragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <div style={{ background:T.card, border:`0.5px solid ${T.border}`, borderRadius:14, padding:20, marginBottom:24 }}>
      {/* Tab switcher */}
      <div style={{ display:'flex', gap:8, marginBottom:16, background:'rgba(255,255,255,0.03)', borderRadius:9, padding:3 }}>
        {(['file','url'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'9px 0', background: tab===t ? T.card : 'transparent', border: tab===t ? `0.5px solid ${T.border}` : 'none', borderRadius:7, fontFamily:T.ff.label, fontSize:9, fontWeight: tab===t ? 300 : 200, letterSpacing:'0.2em', textTransform:'uppercase', color: tab===t ? T.gold : T.muted, cursor:'pointer', minHeight:36, transition:`all 150ms ${EASE}` }}>
            {t === 'file' ? 'From Device' : 'From URL'}
          </button>
        ))}
      </div>

      {tab === 'file' ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{ border:`1px dashed ${dragging ? T.gold : T.borderStrong}`, borderRadius:11, padding:'32px 20px', textAlign:'center', cursor:'pointer', background: dragging ? T.goldSoft : 'transparent', transition:`all 200ms ${EASE}`, minHeight:120, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}
        >
          {loading ? (
            <div style={{ fontFamily:T.ff.label, fontSize:10, color:T.gold, letterSpacing:'0.2em' }} className="shimmer">Uploading…</div>
          ) : (
            <>
              <div style={{ fontSize:22, opacity:0.4, color:T.ink }}>↑</div>
              <div style={{ fontFamily:T.ff.body, fontSize:13, color:T.soft }}>Tap to choose or drag & drop</div>
              <div style={{ fontFamily:T.ff.label, fontSize:8, color:T.muted, letterSpacing:'0.18em' }}>JPG · PNG · WEBP</div>
            </>
          )}
          <input ref={fileRef} type="file" accept={accept} style={{ display:'none' }} onChange={e => { const f=e.target.files?.[0]; if(f)onFile(f); e.target.value=''; }} />
        </div>
      ) : (
        <div style={{ display:'flex', gap:10 }}>
          <input
            value={url} onChange={e => setUrl(e.target.value)}
            onFocus={() => setUrlFocus(true)}
            onBlur={() => setUrlFocus(false)}
            placeholder="https://res.cloudinary.com/…"
            style={{ flex:1, background: urlFocus ? 'rgba(196,64,88,0.04)' : 'rgba(255,255,255,0.03)', border:`0.5px solid ${urlFocus ? T.borderFocus : T.border}`, borderRadius:9, padding:'12px 14px', fontFamily:T.ff.body, fontSize:13, color:T.ink, outline:'none', minHeight:46, transition:`all 200ms ${EASE}` }}
          />
          <GoldBtn label={loading ? '…' : 'Add'} onClick={() => { if(url.trim()){onUrl(url.trim());setUrl('');} }} disabled={!url.trim()||loading} />
        </div>
      )}
    </div>
  );
}

// ── ImageGrid ─────────────────────────────────────────────────────────────────
export type ImageGridItem = {
  id: string; image_url: string; caption?: string | null;
  active: boolean; display_order?: number; sort_order?: number;
  extra?: ReactNode;
};

export function ImageGrid({ items, onToggle, onDelete }: {
  items: ImageGridItem[];
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmId, setConfirmId] = useState<string|null>(null);

  if (items.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'52px 24px', color:T.muted }}>
        <div style={{ fontFamily:T.ff.display, fontStyle:'italic', fontSize:20, marginBottom:8, color:T.soft }}>No images yet</div>
        <div style={{ fontFamily:T.ff.label, fontSize:9, letterSpacing:'0.22em' }}>Upload above to get started</div>
      </div>
    );
  }

  return (
    <>
      {confirmId && (
        <div onClick={() => setConfirmId(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:24, backdropFilter:'blur(8px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'#161310', border:`0.5px solid ${T.border}`, borderRadius:18, padding:28, maxWidth:320, width:'100%' }}>
            <div style={{ fontFamily:T.ff.display, fontStyle:'italic', fontSize:22, color:T.ink, marginBottom:8 }}>Delete image?</div>
            <div style={{ fontFamily:T.ff.body, fontSize:13, color:T.soft, marginBottom:24, lineHeight:1.6 }}>This also removes it from Cloudinary. Cannot be undone.</div>
            <div style={{ display:'flex', gap:10 }}>
              <GhostBtn label="Cancel" onClick={() => setConfirmId(null)} />
              <GhostBtn label="Delete" onClick={() => { onDelete(confirmId); setConfirmId(null); }} danger />
            </div>
          </div>
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
        {items.map(item => (
          <div key={item.id} style={{ background:T.card, border:`0.5px solid ${item.active ? T.borderStrong : T.border}`, borderRadius:13, overflow:'hidden', opacity:item.active ? 1 : 0.45, transition:`all 200ms ${EASE}` }}>
            <div style={{ aspectRatio:'3/4', position:'relative', overflow:'hidden', background:'#1A1614' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} loading="lazy" />
              {!item.active && (
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontFamily:T.ff.label, fontSize:8, letterSpacing:'0.22em', color:'rgba(255,255,255,0.45)', textTransform:'uppercase' }}>Inactive</span>
                </div>
              )}
            </div>
            {item.caption && <div style={{ padding:'8px 10px 4px', fontFamily:T.ff.body, fontSize:11, color:T.soft }}>{item.caption}</div>}
            {item.extra && <div style={{ padding:'4px 10px' }}>{item.extra}</div>}
            <div style={{ display:'flex', borderTop:`0.5px solid ${T.border}` }}>
              <button onClick={() => onToggle(item.id, item.active)} style={{ flex:1, padding:'11px 0', background:'transparent', border:'none', borderRight:`0.5px solid ${T.border}`, fontFamily:T.ff.label, fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', color:item.active ? T.gold : T.soft, minHeight:42, cursor:'pointer', transition:`color 150ms ${EASE}` }}>
                {item.active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => setConfirmId(item.id)} style={{ flex:1, padding:'11px 0', background:'transparent', border:'none', fontFamily:T.ff.label, fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', color:T.danger, minHeight:42, cursor:'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── LoadingGrid ───────────────────────────────────────────────────────────────
export function LoadingGrid() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
      {[1,2,3,4].map(i => (
        <div key={i} className="shimmer" style={{ background:T.card, border:`0.5px solid ${T.border}`, borderRadius:13, aspectRatio:'3/4' }} />
      ))}
    </div>
  );
}

// ── SectionDivider ────────────────────────────────────────────────────────────
export function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, margin:'32px 0 22px' }}>
      <div style={{ flex:1, height:'0.5px', background:`linear-gradient(to right, transparent, ${T.border})` }} />
      <span style={{ fontFamily:T.ff.label, fontWeight:200, fontSize:8, color:T.goldDim, letterSpacing:'0.34em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{label}</span>
      <div style={{ flex:1, height:'0.5px', background:`linear-gradient(to left, transparent, ${T.border})` }} />
    </div>
  );
}

// ── Counter ───────────────────────────────────────────────────────────────────
export function Counter({ current, max }: { current: number; max: number }) {
  const pct  = Math.min(100, (current / max) * 100);
  const full = current >= max;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, background:T.card, border:`0.5px solid ${full ? T.gold : T.border}`, borderRadius:10, padding:'12px 16px', marginBottom:20 }}>
      <div style={{ flex:1, height:3, background:T.border, borderRadius:2, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background: full ? T.gold : 'rgba(196,64,88,0.45)', borderRadius:2, transition:`width 500ms ${EASE}` }} />
      </div>
      <span style={{ fontFamily:T.ff.label, fontSize:10, fontWeight:200, color: full ? T.gold : T.soft, letterSpacing:'0.12em', whiteSpace:'nowrap', flexShrink:0 }}>{current} / {max}</span>
    </div>
  );
}

// ── SearchBar ─────────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Search…' }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position:'relative', marginBottom:20 }}>
      <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:T.muted, fontSize:14, pointerEvents:'none' }}>⌕</span>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ width:'100%', background: focused ? 'rgba(196,64,88,0.04)' : 'rgba(255,255,255,0.03)', border:`0.5px solid ${focused ? T.borderFocus : T.border}`, borderRadius:10, padding:'11px 14px 11px 38px', fontFamily:T.ff.body, fontSize:14, fontWeight:300, color:T.ink, outline:'none', minHeight:44, transition:`all 200ms ${EASE}` }}
      />
      {value && (
        <button onClick={() => onChange('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:T.muted, fontSize:16, cursor:'pointer', padding:4 }}>×</button>
      )}
    </div>
  );
}

// ── FilterPills ───────────────────────────────────────────────────────────────
export function FilterPills({ options, value, onChange }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{ padding:'7px 14px', borderRadius:20, border:`0.5px solid ${value===o.value ? T.borderStrong : T.border}`, background: value===o.value ? T.goldSoft : 'transparent', fontFamily:T.ff.label, fontSize:9, fontWeight:300, letterSpacing:'0.14em', textTransform:'uppercase', color: value===o.value ? T.gold : T.soft, cursor:'pointer', transition:`all 150ms ${EASE}` }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────
// Standard list row with hover state — for makers, couples, etc.
export function Row({ children, onClick, danger }: {
  children: ReactNode; onClick?: () => void; danger?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: hov && onClick ? 'rgba(196,64,88,0.03)' : 'transparent', border:`0.5px solid ${danger ? 'rgba(217,88,88,0.2)' : T.border}`, borderRadius:12, padding:'14px 18px', marginBottom:8, cursor:onClick?'pointer':'default', transition:`all 150ms ${EASE}` }}
    >
      {children}
    </div>
  );
}
