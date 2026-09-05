'use client';
// components/vendor/slices/ForwardSheet.tsx
// BLOCK 19 G5.1 — THE FORWARD SHEET. A booked vendor hands an enquiry she cannot
// take to a peer on her roster, with a note.
//
// ── THE FRAME IT IS BUILT TO ──────────────────────────────────────────────
// `docs/mocks/referrals-mock.html` @ `30828d7`, frames `R2-sheet`, `R2-picker`,
// `R2-refused`. Every string is transcribed in `lib/worklist/referrals.ts`;
// A1–F ratified as proposed (R-40.42), B8 ruled at relay 3.
//
// ── IT IS A SIBLING SHEET, NOT A NESTED ONE ───────────────────────────────
// `WishboneSheet` is the precedent and this mirrors its shell property for
// property: a fixed scrim at z-index 60, a fixed panel at 61, opened from the
// record and rendered beside it rather than inside it. The record sheet CLOSES
// when this opens — which is what the ratified frame draws, the leads list
// behind the scrim and one sheet in front of it, never two stacked.
//
// ── THE REFUSAL IS A STATE OF THIS SHEET, NOT A TOAST (R-G51.2) ───────────
// That is the ruling made visible. A toast disappears and takes the reason with
// it, leaving the vendor believing she forwarded something — the false-done
// F-40.84 exists to prevent. So the sheet STAYS OPEN, the send verb is gone, and
// the only way out is her own hand.
//
// ── THE SENTENCE IS THE FOUNDER'S, NOT THE DOOR'S ─────────────────────────
// dream-os returns a CODE plus an `error` string written for logs. Rendering
// that string would put an unvetoed byte on a vendor's screen. `refusalSentence`
// is the join, and it is exhaustive by type.

import { useEffect, useState } from 'react';
import { getJson } from '@/lib/vendor/api/_base';
import { API_BASE, getAuthHeader } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { RF, refusalSentence } from '@/lib/worklist/referrals';
import type { ReferralPeer, ForwardRefusalCode } from '@/lib/solutions/types';
import { A, F } from './SliceRow';

type Props = {
  leadId: string;
  personLabel: string;
  onDone: () => void;
  onForwarded: () => void;
};

export function ForwardSheet({ leadId, personLabel, onDone, onForwarded }: Props) {
  const [peers, setPeers]       = useState<ReferralPeer[] | null>(null);
  const [chosen, setChosen]     = useState<ReferralPeer | null>(null);
  const [picking, setPicking]   = useState(false);
  const [note, setNote]         = useState('');
  const [sending, setSending]   = useState(false);
  // ⚠ THE REFUSAL IS ITS OWN STATE, SEPARATE FROM AN ERROR. A refusal is the
  // world being in a state that forbids the act; an error is the request
  // failing. They read differently to the vendor and they must not share a slot.
  const [refusal, setRefusal]   = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getJson<{ peers: ReferralPeer[] }>(API.referralPeers());
        if (alive) setPeers(data.peers ?? []);
      } catch {
        if (alive) setPeers([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  async function send() {
    if (!chosen || sending) return;
    setSending(true); setRefusal(null); setError(null);
    try {
      const res = await fetch(`${API_BASE}${API.leadForward(leadId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ to_vendor_id: chosen.id, note: note.trim() || null }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) { onForwarded(); return; }
      // A 409 with a code is a REFUSAL; anything else is a failure.
      const code = (data.code ?? null) as ForwardRefusalCode | null;
      if (code) setRefusal(refusalSentence(code));
      else setError('That forward could not be sent. Try again.');
    } catch {
      setError('That forward could not be sent. Try again.');
    } finally {
      setSending(false);
    }
  }

  const label = { fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: A.inkMute };
  const panel: React.CSSProperties = {
    position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 61,
    background: 'var(--atelier-sheet-bg)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
    borderTop: '0.5px solid var(--atelier-sheet-border)', padding: '18px 22px 26px', maxHeight: '92%', overflowY: 'auto',
  };

  return (
    <>
      <div onClick={onDone} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'var(--atelier-overlay)' }} />
      <div style={panel}>

        {/* ── THE PICKER ────────────────────────────────────────────────────
            LINKED PEERS ONLY, and the door filters them — this list SHAPES the
            choice, it does not authorise it. `forwardLead` re-checks the roster
            edge server-side before it writes, because a client-side list is not
            a permission. */}
        {picking ? (
          <>
            <div style={{ ...label, letterSpacing: '0.42em', color: A.brass }}>{RF.pickerTitle}</div>
            {(peers ?? []).map((p) => (
              <button key={p.id} type="button" onClick={() => { setChosen(p); setPicking(false); }} style={{
                display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center',
                background: 'transparent', border: 'none', borderTop: '0.5px solid var(--atelier-card-border)',
                padding: '11px 0', cursor: 'pointer', textAlign: 'left',
              }}>
                <span>
                  {/* HER NAME OR NOTHING — never an invented one. */}
                  <span style={{ display: 'block', fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.ink }}>{p.business_name || '\u2014'}</span>
                  <span style={{ ...label, display: 'block', marginTop: 2 }}>{p.category || '\u2014'}</span>
                </span>
                {chosen?.id === p.id ? <span style={{ color: 'var(--atelier-accent-text)', fontSize: 16 }}>{'\u2713'}</span> : null}
              </button>
            ))}
            {/* B8, RULED: no way in from here. This line names no door because
                the roster is written elsewhere, and naming one this sheet cannot
                open is worse than naming none. */}
            <p style={{ fontFamily: F.script, fontWeight: 300, fontSize: 13, color: A.inkDim, lineHeight: 1.5, marginTop: 14 }}>
              {RF.pickerFooter}
            </p>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{ fontFamily: F.script, fontWeight: 300, fontSize: 24, color: A.ink }}>{RF.sheetTitle}</span>
              <button type="button" onClick={onDone} aria-label="Close" style={{ background: 'transparent', border: 'none', color: A.inkDim, fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>{'\u00d7'}</button>
            </div>

            {/* ── THE REFUSAL · R-G51.2 ─────────────────────────────────────
                Above the fields, because it is about the act she just attempted
                and not about the form. The send verb is REPLACED by Close: there
                is nothing to retry against this peer, and a live Forward button
                beneath a refusal invites her to press it again. */}
            {refusal ? (
              <div style={{ border: '0.5px solid var(--role-caution)', borderLeftWidth: 2, borderRadius: 3, padding: 12, marginBottom: 12 }}>
                <p style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.ink, lineHeight: 1.45, margin: 0 }}>{refusal}</p>
              </div>
            ) : null}
            {error ? (
              <p style={{ fontFamily: F.script, fontWeight: 300, fontSize: 13, color: A.inkMute, lineHeight: 1.5, marginBottom: 10 }}>{error}</p>
            ) : null}

            <span style={{ ...label, display: 'block', marginBottom: 5 }}>{RF.fieldPeer}</span>
            <button type="button" onClick={() => setPicking(true)} disabled={sending} style={{
              display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--atelier-input-bg)', border: `0.5px solid ${chosen ? 'var(--atelier-input-border)' : 'var(--atelier-card-border)'}`,
              borderRadius: 3, padding: '10px 12px', marginBottom: 12, cursor: 'pointer',
              fontFamily: F.script, fontWeight: 300, fontSize: 16, color: chosen ? A.ink : A.inkDim, textAlign: 'left',
            }}>
              <span>{chosen ? (chosen.business_name || '\u2014') : (peers && peers.length === 0 ? RF.pickerFooter : RF.pickerTitle)}</span>
              <span style={{ color: A.inkDim }}>{'\u25be'}</span>
            </button>

            {!refusal ? (
              <>
                <span style={{ ...label, display: 'block', marginBottom: 5 }}>{RF.fieldNote}</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={RF.notePlaceholder}
                  rows={3}
                  style={{
                    width: '100%', boxSizing: 'border-box', background: 'var(--atelier-input-bg)',
                    border: '0.5px solid var(--atelier-card-border)', borderRadius: 3, padding: '10px 12px',
                    fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.ink, lineHeight: 1.5,
                    marginBottom: 12, resize: 'none',
                  }}
                />
              </>
            ) : null}

            {refusal ? (
              <button type="button" onClick={onDone} style={{
                width: '100%', minHeight: 48, background: 'transparent',
                border: '0.5px solid var(--atelier-card-border)', borderRadius: 3, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 300, fontSize: 11, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: A.inkSoft,
              }}>{RF.refusalClose}</button>
            ) : (
              <>
                <button type="button" onClick={send} disabled={!chosen || sending} style={{
                  width: '100%', minHeight: 48, border: 'none', borderRadius: 3,
                  background: chosen && !sending ? 'var(--atelier-accent-text)' : 'var(--atelier-card-border)',
                  color: chosen && !sending ? 'var(--role-ink-deep)' : A.inkDim,
                  fontFamily: F.label, fontWeight: 300, fontSize: 11, letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: chosen && !sending ? 'pointer' : 'default',
                }}>{RF.sendVerb}</button>

                {/* B6 · R-G51.7 SAID OUT LOUD BEFORE SHE TAPS, NOT DISCOVERED
                    AFTER. She will otherwise assume TDW told the couple, and
                    find out it did not when the couple asks. */}
                <p style={{ fontFamily: F.script, fontWeight: 300, fontSize: 13, color: A.inkDim, lineHeight: 1.5, marginTop: 14 }}>
                  {RF.sheetStandingLine}
                </p>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
