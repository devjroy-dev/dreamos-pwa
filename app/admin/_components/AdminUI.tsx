'use client';
// app/admin/_components/AdminUI.tsx
// Shared components for the admin portal.
// All design tokens live here — import from this file only.

import { useEffect, useRef, useState } from 'react';
import type { ReactNode, DragEvent as ReactDragEvent } from 'react';

// ── Design tokens ─────────────────────────────────────────────────────────────
export const T = {
  bg:           '#0A0908',
  card:         'rgba(255,255,255,0.04)',
  cardHover:    'rgba(255,255,255,0.07)',
  border:       'rgba(201,168,76,0.15)',
  borderStrong: 'rgba(201,168,76,0.3)',
  gold:         '#C9A84C',
  ink:          '#F5F0E8',
  soft:         'rgba(245,240,232,0.5)',
  muted:        'rgba(245,240,232,0.3)',
  danger:       '#E05C5C',
  success:      '#5CE0A0',
  ff: {
    display: '"Cormorant Garamond", serif',
    body:    '"DM Sans", sans-serif',
    label:   '"Jost", sans-serif',
  },
};

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
      <div>
        <h1 style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontWeight: 300, fontSize: 28, color: T.ink, lineHeight: 1.1, marginBottom: sub ? 4 : 0 }}>{title}</h1>
        {sub && <p style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 10, color: T.soft, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{sub}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, color: T.soft, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: T.ff.display, fontWeight: 300, fontSize: 32, color: T.gold, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: T.ff.body, fontWeight: 300, fontSize: 11, color: T.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

// ── GoldBtn ───────────────────────────────────────────────────────────────────
export function GoldBtn({ label, onClick, disabled, small }: { label: string; onClick: () => void; disabled?: boolean; small?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: disabled ? 'rgba(201,168,76,0.2)' : T.gold, border: 'none', borderRadius: 10, padding: small ? '10px 16px' : '14px 24px', fontFamily: T.ff.label, fontWeight: 300, fontSize: small ? 9 : 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: disabled ? 'rgba(201,168,76,0.5)' : '#0A0908', minHeight: 44, cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}>
      {label}
    </button>
  );
}

// ── GhostBtn ──────────────────────────────────────────────────────────────────
export function GhostBtn({ label, onClick, danger, small }: { label: string; onClick: () => void; danger?: boolean; small?: boolean }) {
  return (
    <button onClick={onClick} style={{ background: 'transparent', border: `0.5px solid ${danger ? T.danger : T.borderStrong}`, borderRadius: 10, padding: small ? '10px 16px' : '14px 24px', fontFamily: T.ff.label, fontWeight: 200, fontSize: small ? 9 : 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: danger ? T.danger : T.soft, minHeight: 44, whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
      {label}
    </button>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
export function Toast({ msg, onDone, error }: { msg: string; onDone: () => void; error?: boolean }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: 'fixed', bottom: 'calc(env(safe-area-inset-bottom,0px) + 24px)', left: '50%', transform: 'translateX(-50%)', background: error ? '#3A1A1A' : '#1A2A1A', border: `0.5px solid ${error ? T.danger : T.success}`, color: error ? T.danger : T.success, fontFamily: T.ff.label, fontSize: 11, fontWeight: 300, letterSpacing: '0.15em', padding: '12px 24px', borderRadius: 100, zIndex: 9999, whiteSpace: 'nowrap', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      {msg}
    </div>
  );
}

// ── FieldInput ────────────────────────────────────────────────────────────────
export function FieldInput({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, color: T.soft, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '12px 14px', fontFamily: T.ff.body, fontSize: 14, fontWeight: 300, color: T.ink, outline: 'none', minHeight: 44 }} />
    </div>
  );
}

// ── FieldSelect ───────────────────────────────────────────────────────────────
export function FieldSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, color: T.soft, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', background: '#141210', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '12px 14px', fontFamily: T.ff.body, fontSize: 14, fontWeight: 300, color: T.ink, outline: 'none', minHeight: 44, appearance: 'none' }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ── BottomSheet ───────────────────────────────────────────────────────────────
export function BottomSheet({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return (
    <>
      {visible && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, backdropFilter: 'blur(4px)' }} />}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 301, background: '#111009', border: `0.5px solid ${T.border}`, borderRadius: '20px 20px 0 0', padding: '0 0 calc(env(safe-area-inset-bottom,0px) + 24px)', transform: visible ? 'translateY(0)' : 'translateY(110%)', transition: 'transform 340ms cubic-bezier(0.22,1,0.36,1)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: T.border }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 24px 20px' }}>
          <span style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 22, fontWeight: 300, color: T.ink }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.soft, fontSize: 20, padding: 8, minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '0 24px' }}>{children}</div>
      </div>
    </>
  );
}

// ── UploadZone ────────────────────────────────────────────────────────────────
// Supports both file upload and URL paste.
export function UploadZone({ onFile, onUrl, loading, accept = 'image/*' }: {
  onFile: (file: File) => Promise<void>;
  onUrl:  (url: string) => Promise<void>;
  loading: boolean;
  accept?: string;
}) {
  const fileRef  = useRef<HTMLInputElement>(null);
  const [tab, setTab]     = useState<'file' | 'url'>('file');
  const [url, setUrl]     = useState('');
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: ReactDragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const tabBtn = (t: 'file' | 'url', lbl: string) => (
    <button onClick={() => setTab(t)} style={{ flex: 1, padding: '10px 0', background: tab === t ? 'rgba(201,168,76,0.12)' : 'transparent', border: `0.5px solid ${tab === t ? T.gold : T.border}`, borderRadius: 8, fontFamily: T.ff.label, fontSize: 9, fontWeight: 200, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: tab === t ? T.gold : T.soft, minHeight: 44 }}>{lbl}</button>
  );

  return (
    <div style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {tabBtn('file', 'From Device')}
        {tabBtn('url', 'From URL')}
      </div>

      {tab === 'file' ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{ border: `0.5px dashed ${dragging ? T.gold : T.borderStrong}`, borderRadius: 10, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: dragging ? 'rgba(201,168,76,0.06)' : 'transparent', transition: 'all 0.2s', minHeight: 120, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {loading ? (
            <div style={{ fontFamily: T.ff.label, fontSize: 10, color: T.gold, letterSpacing: '0.18em' }} className="shimmer">Uploading…</div>
          ) : (
            <>
              <div style={{ fontSize: 24, opacity: 0.5 }}>↑</div>
              <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft }}>Tap to choose or drag & drop</div>
              <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted, letterSpacing: '0.15em' }}>JPG · PNG · WEBP</div>
            </>
          )}
          <input ref={fileRef} type="file" accept={accept} style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '12px 14px', fontFamily: T.ff.body, fontSize: 13, color: T.ink, outline: 'none', minHeight: 44 }}
          />
          <GoldBtn label={loading ? '…' : 'Add'} onClick={() => { if (url.trim()) { onUrl(url.trim()); setUrl(''); } }} disabled={!url.trim() || loading} />
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
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', color: T.muted }}>
        <div style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 18, marginBottom: 8 }}>No images yet</div>
        <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.2em' }}>Upload above to get started</div>
      </div>
    );
  }

  return (
    <>
      {confirmId && (
        <div onClick={() => setConfirmId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111009', border: `0.5px solid ${T.border}`, borderRadius: 16, padding: 28, maxWidth: 320, width: '100%' }}>
            <div style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 20, color: T.ink, marginBottom: 8 }}>Delete image?</div>
            <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft, marginBottom: 24 }}>This also removes it from Cloudinary. Cannot be undone.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <GhostBtn label="Cancel" onClick={() => setConfirmId(null)} />
              <GhostBtn label="Delete" onClick={() => { onDelete(confirmId); setConfirmId(null); }} danger />
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: T.card, border: `0.5px solid ${item.active ? T.borderStrong : T.border}`, borderRadius: 12, overflow: 'hidden', opacity: item.active ? 1 : 0.5, transition: 'all 0.2s' }}>
            <div style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden', background: '#1A1614' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} loading="lazy" />
              {!item.active && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Inactive</span>
                </div>
              )}
            </div>
            {item.caption && (
              <div style={{ padding: '8px 10px 4px', fontFamily: T.ff.body, fontSize: 11, color: T.soft }}>{item.caption}</div>
            )}
            {item.extra && <div style={{ padding: '4px 10px' }}>{item.extra}</div>}
            <div style={{ display: 'flex', gap: 0, borderTop: `0.5px solid ${T.border}`, marginTop: 8 }}>
              <button onClick={() => onToggle(item.id, item.active)} style={{ flex: 1, padding: '12px 0', background: 'transparent', border: 'none', fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: item.active ? T.gold : T.soft, minHeight: 44, borderRight: `0.5px solid ${T.border}` }}>
                {item.active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => setConfirmId(item.id)} style={{ flex: 1, padding: '12px 0', background: 'transparent', border: 'none', fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: T.danger, minHeight: 44 }}>
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {[1,2,3,4].map(i => (
        <div key={i} className="shimmer" style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, aspectRatio: '3/4' }} />
      ))}
    </div>
  );
}

// ── SectionDivider ────────────────────────────────────────────────────────────
export function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 20px' }}>
      <div style={{ flex: 1, height: '0.5px', background: T.border }} />
      <span style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, color: T.soft, letterSpacing: '0.3em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: '0.5px', background: T.border }} />
    </div>
  );
}

// ── Counter pill ──────────────────────────────────────────────────────────────
export function Counter({ current, max }: { current: number; max: number }) {
  const pct  = (current / max) * 100;
  const full = current >= max;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: T.card, border: `0.5px solid ${full ? T.gold : T.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
      <div style={{ flex: 1, height: 3, background: T.border, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: full ? T.gold : 'rgba(201,168,76,0.5)', borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontFamily: T.ff.label, fontSize: 10, fontWeight: 200, color: full ? T.gold : T.soft, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{current} / {max}</span>
    </div>
  );
}
