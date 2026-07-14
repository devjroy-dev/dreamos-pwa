'use client';
// components/vendor/slices/BinderCard.tsx — TDW_03 P2 · the crown jewel
// One client's story as a card: name, THE money story, stage + last touch,
// missing-cell chips (render-only at P2 — tap wakes at P3's WishboneSheet,
// CE micro-ruling 1), and on tap the story timeline: the growing note parsed
// by its accumulation breaks (single-'\n' appends, verified), money-edit
// confessions verbatim among its lines. Actions: Ask Victor (prefill, never
// autoSend — standing grammar per CE micro-ruling 2) · Edit (the POST door;
// the note field APPENDS and is labelled as such).
// Full-width, hairline-bounded, NO card chrome/shadows. Masthead-adjacent
// numbers are ink — the received hairline is this screen's brass, within law.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CabinetBinder, BinderEditFields } from '@/lib/vendor/api/vendor';
import { editBinder } from '@/lib/vendor/api/vendor';
import {
  amountWordsAdjacent, fmtINR, moneyOf, noteTimeline, primaryAmount,
  relativeTouch, stageTone, type StageTone,
} from '@/lib/vendor/cabinet';
import { A, F, cap } from './SliceRow';

const TONE_COLOR: Record<StageTone, string> = {
  go:   '#3E8B4A',
  warm: 'var(--atelier-label)',
  cool: 'var(--atelier-ink-dim)',
};

const MAX_CHIPS = 3;

function EditSheet({ binder, onClose, onSaved, onFail }: {
  binder: CabinetBinder;
  onClose: () => void;
  onSaved: (message?: string) => void;
  onFail: (error: string) => void;
}) {
  const [fields, setFields] = useState<BinderEditFields>({});
  const [saving, setSaving] = useState(false);
  const set = (k: keyof BinderEditFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields(prev => ({ ...prev, [k]: e.target.value }));
  const dirty = Object.values(fields).some(v => (v ?? '').toString().trim() !== '');

  async function save() {
    if (!dirty || saving) return;
    setSaving(true);
    const patch: BinderEditFields = {};
    for (const [k, v] of Object.entries(fields)) {
      if ((v ?? '').toString().trim() !== '') (patch as Record<string, string>)[k] = (v as string).trim();
    }
    try {
      const res = await editBinder(binder.id, patch);
      if (res.ok) { onSaved(res.message); onClose(); }
      else onFail(res.error ?? 'The edit did not go through. Try again.');
    } catch {
      onFail('Network error. Try again.');
    }
    setSaving(false);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 11px', boxSizing: 'border-box',
    background: 'var(--atelier-input-bg)',
    border: '0.5px solid var(--atelier-card-border)', borderRadius: 2,
    fontFamily: F.body, fontWeight: 300, fontSize: 13, color: A.ink,
    outline: 'none', caretColor: A.brass,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute,
    letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 4, display: 'block',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--atelier-overlay)', zIndex: 60, display: 'flex', alignItems: 'flex-end' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%',
        background: 'var(--atelier-sheet-bg)',
        backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        borderTop: '0.5px solid var(--atelier-sheet-border)',
        padding: '20px 24px calc(24px + env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '85vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
        </div>
        <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>Edit Binder</div>
        <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 22, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>{binder.client ?? 'Unnamed'}</div>
        <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute, marginTop: -6 }}>
          Money is edited with Victor — the witnessed door. Everything else lives here.
        </div>

        <div><span style={labelStyle}>Client</span><input style={inputStyle} placeholder={binder.client ?? '—'} value={fields.client ?? ''} onChange={set('client')} /></div>
        <div><span style={labelStyle}>Date</span><input style={inputStyle} type="date" value={fields.date ?? ''} onChange={set('date')} /></div>
        <div><span style={labelStyle}>Phone</span><input style={inputStyle} placeholder={binder.phone ?? '—'} value={fields.phone ?? ''} onChange={set('phone')} /></div>
        <div><span style={labelStyle}>Stage</span><input style={inputStyle} placeholder={binder.stage ?? '—'} value={fields.stage ?? ''} onChange={set('stage')} /></div>
        <div>
          <span style={labelStyle}>Add to the story</span>
          <textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }}
            placeholder="A line added beneath what stands — the story grows."
            value={fields.note ?? ''} onChange={set('note')} />
        </div>

        <button type="button" onClick={save} disabled={!dirty || saving}
          className={dirty && !saving ? 'atelier-fab' : undefined}
          style={{
            padding: '14px 0', borderRadius: 2, marginTop: 4,
            border: '0.5px solid #E0BC6E',
            cursor: dirty && !saving ? 'pointer' : 'default',
            fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
            letterSpacing: '0.42em', textTransform: 'uppercase',
            background: !dirty || saving ? 'rgba(201,168,76,0.18)' : undefined,
            opacity: !dirty || saving ? 0.6 : 1,
          }}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </div>
  );
}

export function BinderCard({ binder, onChanged, onToast, crossLead }: {
  binder: CabinetBinder;
  onChanged: () => void;
  onToast: (msg: string, kind?: 'success' | 'error') => void;
  /** R1(b), CE-ruled: display-only — the typed plane also knows this person.
      Reads, never writes; absence means "no phone match", never "no twin". */
  crossLead?: { state: string };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { recv, pend } = moneyOf(binder);
  const amt = primaryAmount(binder);
  const hasMoney = amt != null || recv > 0 || pend > 0;
  const total = recv + pend;
  const recvPct = total > 0 ? Math.round((recv / total) * 100) : 0;
  const tone = stageTone(binder);
  const touched = relativeTouch(binder.updated_at ?? binder.created_at);
  const missing = binder.missing_cells ?? [];
  const chips = missing.slice(0, MAX_CHIPS);
  const overflow = missing.length - chips.length;
  const timeline = noteTimeline(binder.note);

  function askVictor() {
    // Prefill-not-fire (standing grammar, CE micro-ruling 2). The Hub's
    // prefill param is `draft` (ln 445/522 — composer initialValue);
    // `primer` without autoSend=1 is a no-op. Spec literal said `primer`;
    // code is truth — drift logged in the sitting handover.
    const primer = `What would you like to change about ${binder.client ?? 'this binder'}?`;
    router.push(`/vendor?draft=${encodeURIComponent(primer)}`);
  }

  return (
    <div style={{ borderBottom: '0.5px solid var(--atelier-card-border)' }}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} style={{
        width: '100%', display: 'block', textAlign: 'left',
        padding: '16px 22px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
      }}>
        {/* Line 1 — the name */}
        <div style={{
          fontFamily: F.script, fontWeight: 500, fontSize: 19, color: A.ink,
          letterSpacing: '0.005em', lineHeight: 1.15,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{binder.client ?? 'Unnamed'}</div>

        {/* Line 2 — THE money story */}
        {hasMoney && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: F.script, fontWeight: 500, fontSize: 15, color: A.ink }}>
                {amountWordsAdjacent(amt ?? total)}
              </span>
              {binder.direction && (
                <span aria-label={binder.direction === 'in' ? 'money in' : 'money out'} style={{
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.inkMute,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                }}>{binder.direction === 'in' ? '↓ in' : '↑ out'}</span>
              )}
            </div>
            {total > 0 && (
              <>
                <div aria-hidden style={{ display: 'flex', height: 2, borderRadius: 1, overflow: 'hidden', marginTop: 6 }}>
                  <span style={{ width: `${recvPct}%`, background: 'var(--atelier-accent-text)' }} />
                  <span style={{ width: `${100 - recvPct}%`, background: 'var(--atelier-ink-dim)', opacity: 0.35 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.inkMute, letterSpacing: '0.04em' }}>{fmtINR(recv)} in</span>
                  <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.inkMute, letterSpacing: '0.04em' }}>{pend > 0 ? `${fmtINR(pend)} due` : 'settled'}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* R1(b) cross-plane whisper — the postcard from 16's spine */}
        {crossLead && (
          <div style={{
            fontFamily: F.label, fontWeight: 300, fontSize: 9,
            color: A.inkMute, letterSpacing: '0.08em', textTransform: 'uppercase',
            marginTop: 6,
          }}>Also a lead · {cap(crossLead.state)}</div>
        )}

        {/* Line 3 — stage word (manifest tone) + last touch */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
          {binder.stage && (
            <span style={{
              fontFamily: F.label, fontWeight: 400, fontSize: 9, color: TONE_COLOR[tone],
              letterSpacing: '0.24em', textTransform: 'uppercase',
            }}>{cap(binder.stage)}</span>
          )}
          {touched && (
            <span style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute }}>
              {touched}
            </span>
          )}
        </div>

        {/* Missing-cell chips — render truth; tap wakes at P3 */}
        {chips.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {chips.map(c => (
              <span key={c} style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.inkMute,
                letterSpacing: '0.06em',
                border: '0.5px solid var(--atelier-ink-dim)', borderRadius: 2,
                padding: '3px 8px',
              }}>+ {c}</span>
            ))}
            {overflow > 0 && (
              <span style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.inkMute,
                letterSpacing: '0.06em', padding: '3px 2px',
              }}>+{overflow} more</span>
            )}
          </div>
        )}
      </button>

      {/* Expand — the story timeline + actions */}
      {open && (
        <div style={{ padding: '0 22px 16px' }}>
          {timeline.length > 0 ? (
            <div style={{ borderLeft: '0.5px solid rgba(201,168,76,0.35)', paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {timeline.map((line, i) => (
                <div key={i} style={{
                  fontFamily: F.script, fontWeight: 300, fontSize: 13.5, color: A.inkSoft, lineHeight: 1.55,
                }}>{line}</div>
              ))}
            </div>
          ) : (
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12.5, color: A.inkMute }}>
              No story yet — it grows as you and Victor talk.
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button type="button" onClick={askVictor} className="atelier-fab" style={{
              flex: 1, padding: '11px 14px', borderRadius: 2, cursor: 'pointer',
              border: '0.5px solid #E0BC6E',
              fontFamily: F.label, fontWeight: 400, fontSize: 9, color: '#1A120E',
              letterSpacing: '0.32em', textTransform: 'uppercase',
            }}>Ask Victor</button>
            <button type="button" onClick={() => setEditOpen(true)} style={{
              flex: 1, padding: '11px 14px', background: 'transparent',
              border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2, cursor: 'pointer',
              fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.brassWarm,
              letterSpacing: '0.32em', textTransform: 'uppercase',
            }}>Edit</button>
          </div>
        </div>
      )}

      {editOpen && (
        <EditSheet
          binder={binder}
          onClose={() => setEditOpen(false)}
          onSaved={(msg) => { onToast(msg ?? 'Filed.', 'success'); onChanged(); }}
          onFail={(err) => onToast(err, 'error')}
        />
      )}
    </div>
  );
}
