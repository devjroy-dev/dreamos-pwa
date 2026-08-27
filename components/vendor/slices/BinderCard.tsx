// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock’s screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
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
import { INK_DEEP } from '@/lib/vendor/theme';
import { useRouter } from 'next/navigation';
import type { CabinetBinder, BinderEditFields } from '@/lib/vendor/api/vendor';
import { editBinder } from '@/lib/vendor/api/vendor';
import { WishboneSheet } from './WishboneSheet'; // TDW_04 A1: the chips' tap target
import { SwipeRow } from './SwipeRow'; // TDW_04 A2: clients swipes (Ask Victor / Call)
import { hideBinder, unarchiveBinder } from '@/lib/vendor/api/vendor'; // TDW_04 A2: the honest undo pair
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
    fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink,
    outline: 'none', caretColor: A.interactive,
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
        <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>{binder.client ?? 'Unnamed'}</div>
        <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: -6 }}>
          Money is edited in chat — the witnessed door. Everything else lives here.
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
            border: '0.5px solid var(--atelier-label)',
            cursor: dirty && !saving ? 'pointer' : 'default',
            fontFamily: F.label, fontWeight: 400, fontSize: 10, color: INK_DEEP,
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
  onToast: (msg: string, kind?: 'success' | 'error', opts?: { action?: { label: string; onAction: () => void }; durationMs?: number }) => void; // TDW_04 A2: undo rides through
  /** R1(b), CE-ruled: display-only — the typed plane also knows this person.
      Reads, never writes; absence means "no phone match", never "no twin". */
  crossLead?: { state: string };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [wishboneOpen, setWishboneOpen] = useState(false); // TDW_04 A1: the chips wake
  const [hideConfirm, setHideConfirm] = useState(false);   // TDW_04 A2: hide w/ real-door undo

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
    // F-04.9 (founder-ruled 2026-07-15): tell_victor grammar — mid-sentence,
    // completable, NEVER a question. No primer ends in a question mark; a
    // question invites an answer, a stem invites the fact.
    const primer = `About ${binder.client ?? 'this binder'}: `;
    router.push(`/vendor?draft=${encodeURIComponent(primer)}`);
  }

  // TDW_04 A2 — the approved swipe table, clients row: right = Ask Victor
  // (prefill-not-fire), left = Call (only when a phone stands). Both
  // non-destructive; no confirm needed.
  const swipeRight = { label: 'Ask in chat', onTrigger: askVictor }; // A4 copy law: persona-free chrome
  const swipeLeft = binder.phone ? { label: 'Call', onTrigger: () => { window.location.href = `tel:${binder.phone}`; } } : undefined;

  // TDW_04 A2 — Hide: the clients destructive action (TDW_03 residue: "/hide
  // door ready"). Commits IMMEDIATELY and wires UNDO to the REAL /unarchive
  // door — the one place the undo toast rides an honest reversal door rather
  // than deferred fire.
  async function hide() {
    setHideConfirm(false); setOpen(false);
    const res = await hideBinder(binder.id);
    if (!res.ok) { onToast(res.error || 'Could not hide.', 'error'); return; }
    onChanged();
    onToast(`${binder.client ?? 'Binder'} hidden.`, 'success', {
      action: { label: 'Undo', onAction: async () => { const r = await unarchiveBinder(binder.id); if (r.ok) { onChanged(); onToast('Restored.', 'success'); } else onToast(r.error || 'Could not restore.', 'error'); } },
      durationMs: 30000,
    });
  }

  return (
    <div style={{ borderBottom: '0.5px solid var(--atelier-card-border)' }}>
      <SwipeRow right={swipeRight} left={swipeLeft}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} style={{
        width: '100%', display: 'block', textAlign: 'left',
        padding: '16px 22px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
      }}>
        {/* Line 1 — the name */}
        <div style={{
          fontFamily: F.script, fontWeight: 500, fontSize: 20, color: A.ink,
          letterSpacing: '0.005em', lineHeight: 1.15,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{binder.client ?? 'Unnamed'}</div>

        {/* Line 2 — THE money story */}
        {hasMoney && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: A.ink }}>
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
                  <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, letterSpacing: '0.04em' }}>{fmtINR(recv)} in</span>
                  <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, letterSpacing: '0.04em' }}>{pend > 0 ? `${fmtINR(pend)} due` : 'settled'}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* R1(b) cross-plane whisper — the postcard from 16's spine */}
        {crossLead && (
          // TDW_04 A3 (L-3): the whisper becomes a door — tap jumps to the twin's
          // canonical slice. Still reads-only; nothing is linked or merged (16's
          // spine still owns the real join).
          <a href="/vendor/list/leads" onClick={e => e.stopPropagation()} style={{
            display: 'inline-block', textDecoration: 'none',
            fontFamily: F.label, fontWeight: 300, fontSize: 9,
            color: A.interactiveWarm, letterSpacing: '0.08em', textTransform: 'uppercase',
            marginTop: 6,
          }}>Also a lead · {cap(crossLead.state)} ›</a>
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
            <span style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>
              {touched}
            </span>
          )}
        </div>

        {/* Missing-cell chips — render truth; taps AWAKE (TDW_04 A1, the P3
            charter landing). Tap → WishboneSheet: inline through the POST /edit
            door for client/phone/date; `amount` routes to Victor only (the
            witnessed-door law — donna_edit refuses money by design). */}
        {chips.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}
            onClick={e => { e.stopPropagation(); setWishboneOpen(true); }}>
            {chips.map(c => (
              <span key={c} role="button" style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute,
                letterSpacing: '0.06em',
                border: '0.5px solid var(--atelier-ink-dim)', borderRadius: 2,
                padding: '3px 8px', cursor: 'pointer',
              }}>+ {c}</span>
            ))}
            {overflow > 0 && (
              <span style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute,
                letterSpacing: '0.06em', padding: '3px 2px',
              }}>+{overflow} more</span>
            )}
          </div>
        )}
      </button>
      </SwipeRow>

      {/* Expand — the story timeline + actions */}
      {open && (
        <div style={{ padding: '0 22px 16px' }}>
          {timeline.length > 0 ? (
            <div style={{ borderLeft: '0.5px solid rgba(201,168,76,0.35)', paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {timeline.map((line, i) => (
                <div key={i} style={{
                  fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.inkSoft, lineHeight: 1.55,
                }}>{line}</div>
              ))}
            </div>
          ) : (
            <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>
              No story yet — it grows as you talk in chat.
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button type="button" onClick={askVictor} className="atelier-fab" style={{
              flex: 1, padding: '11px 14px', borderRadius: 2, cursor: 'pointer',
              border: '0.5px solid var(--atelier-label)',
              fontFamily: F.label, fontWeight: 400, fontSize: 9, color: INK_DEEP,
              letterSpacing: '0.32em', textTransform: 'uppercase',
            }}>Ask in chat</button>
            <button type="button" onClick={() => setEditOpen(true)} style={{
              flex: 1, padding: '11px 14px', background: 'transparent',
              border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2, cursor: 'pointer',
              fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.interactiveWarm,
              letterSpacing: '0.32em', textTransform: 'uppercase',
            }}>Edit</button>
            {!hideConfirm ? (
              <button type="button" onClick={() => setHideConfirm(true)} style={{
                padding: '11px 14px', background: 'transparent',
                border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 300, fontSize: 9, color: 'var(--atelier-ink-mute, #8a8578)',
                letterSpacing: '0.32em', textTransform: 'uppercase',
              }}>Hide</button>
            ) : (
              <button type="button" onClick={() => { void hide(); }} style={{
                padding: '11px 14px', background: 'transparent',
                border: '0.5px solid rgba(224,112,112,0.5)', borderRadius: 2, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 400, fontSize: 9, color: 'var(--role-critical)',
                letterSpacing: '0.32em', textTransform: 'uppercase',
              }}>Sure?</button>
            )}
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

      {/* TDW_04 A1 — the wishbone, binder plane. Same door the EditSheet uses
          (one door, both callers); saves refetch via onChanged (the F2 bus). */}
      {wishboneOpen && (
        <WishboneSheet
          missing={missing}
          personLabel={binder.client ?? 'this binder'}
          onComplete={async (cell, value) => {
            // Only client/phone/date reach inline completion (amount is
            // victorOnly in the sheet) — all three are BinderEditFields keys.
            const fields: BinderEditFields = { [cell]: value };
            const res = await editBinder(binder.id, fields);
            if (!res.ok) return res.error || 'Could not file it — try again.';
            onToast('Filed.', 'success'); // F-04.5 (CE-ruled): human words at the boundary — the door's raw reply (record UUID aboard) stays in the ledger, not the toast
            onChanged();
            return null;
          }}
          onDone={() => setWishboneOpen(false)}
        />
      )}
    </div>
  );
}
