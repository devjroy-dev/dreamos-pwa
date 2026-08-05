'use client';
// components/vendor/AtelierForm.tsx — the Atelier form primitives, ONE HOME.
//
// TDW_07 P2 · PURE MOVE, no rewrite. These five were local to app/vendor/settings/page.tsx
// and TDW_07 P2's Discover Profile needs the identical grammar. Copying them would have
// been a second implementation of the estate's own form language — the class the spec's
// VendorProfileView singularity rule exists to prevent, one level down. Moved verbatim:
// the settings screen's rendered output is byte-unchanged, which is the 04.5 pure-move
// proof form (F11(c)'s studioShared precedent, same shape).
//
// A and F are exported because both screens derive every colour and face from them; the
// design system is locked (protocol §4) and neither screen may mint its own palette.

import React from 'react';

export const A = {
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: 'var(--role-metal)', brassWarm: 'var(--atelier-label)', red: 'var(--role-critical)',
} as const;
export const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script: 'var(--font-cormorant), Georgia, serif',
  body: 'var(--font-dm-sans), system-ui, sans-serif',
  label: 'var(--font-jost), system-ui, sans-serif',
} as const;

export function SCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass }}>{title}</span>
        <span style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.22)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

export function SField({ label, value, onChange, multiline, placeholder, inputMode }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  const base: React.CSSProperties = {
    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
    background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-card-border)', borderRadius: 2,
    fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink, outline: 'none',
    caretColor: A.brass, resize: 'none' as const, 
  };
  return (
    <div>
      <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={2} style={base} placeholder={placeholder} />
        : <input value={value} onChange={e => onChange(e.target.value)} style={base} placeholder={placeholder} inputMode={inputMode} />
      }
    </div>
  );
}

export function SToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: F.script, fontWeight: 400, fontSize: 16, lineHeight: 1.5, color: A.ink, letterSpacing: '0.005em' }}>{label}</span>
      <button type="button" onClick={() => onChange(!value)} style={{
        width: 44, height: 24, borderRadius: 999, border: '0.5px solid var(--atelier-input-border)',
        cursor: 'pointer', flexShrink: 0,
        background: value ? 'linear-gradient(180deg, var(--role-metal) 0%, var(--role-metal) 100%)' : 'var(--atelier-input-bg)',
        position: 'relative', transition: 'background 200ms',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: value ? 22 : 2, width: 18, height: 18, borderRadius: '50%',
          background: value ? 'var(--atelier-ink)' : 'var(--atelier-ink-mute)',
          transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}

export function SReadRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
      <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: A.ink, letterSpacing: '0.005em' }}>{value}</span>
    </div>
  );
}

export function SaveBtn({ dirty, loading, onSave }: { dirty: boolean; loading: boolean; onSave: () => void }) {
  if (!dirty && !loading) return null;
  return (
    <button type="button" onClick={onSave} disabled={loading || !dirty} className={dirty && !loading ? 'atelier-fab' : undefined} style={{
      alignSelf: 'flex-end', padding: '8px 16px', borderRadius: 2,
      border: '0.5px solid var(--atelier-label)',
      cursor: loading || !dirty ? 'default' : 'pointer',
      fontFamily: F.label, fontWeight: 400, fontSize: 9, color: '#1A120E',
      letterSpacing: '0.36em', textTransform: 'uppercase',
      background: !dirty || loading ? 'rgba(201,168,76,0.18)' : undefined,
      opacity: loading || !dirty ? 0.6 : 1,
    }}>{loading ? 'Saving…' : 'Save'}</button>
  );
}
