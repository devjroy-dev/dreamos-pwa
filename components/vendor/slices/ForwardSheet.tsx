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
import type { ReferralPeer, PeerSearchResult, ForwardRefusalCode } from '@/lib/solutions/types';
import { A, F } from './SliceRow';

type Props = {
  leadId: string;
  personLabel: string;
  onDone: () => void;
  onForwarded: () => void;
};

export function ForwardSheet({ leadId, personLabel, onDone, onForwarded }: Props) {
  // ── R-40.104 · THE PICKER BECAME A SEARCH ──────────────────────────────
  // `peers: ReferralPeer[] | null` used to hold her whole roster, fetched once
  // on mount, because R-G51.1 made a linked roster edge the boundary of the
  // exchange. That boundary is repealed. What is held now is a RESULT: three
  // groups, already sorted and already pruned by the door.
  const [result, setResult]     = useState<PeerSearchResult | null>(null);
  const [q, setQ]               = useState('');
  const [chosen, setChosen]     = useState<ReferralPeer | null>(null);
  const [picking, setPicking]   = useState(false);
  const [note, setNote]         = useState('');
  const [sending, setSending]   = useState(false);
  // ⚠ THE REFUSAL IS ITS OWN STATE, SEPARATE FROM AN ERROR. A refusal is the
  // world being in a state that forbids the act; an error is the request
  // failing. They read differently to the vendor and they must not share a slot.
  const [refusal, setRefusal]   = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);

  // ⚠ DEBOUNCED, AND THE DELAY IS THE CLIENT'S HALF OF F5's BUDGET. The other
  // half is the door's: vendor-auth only, a two-character minimum and a server
  // cap the caller cannot raise. Neither half is sufficient alone — a debounce
  // without a server cap is a suggestion, and a server cap without a debounce is
  // a request per keystroke.
  //
  // ⚠ `alive` GUARDS THE SET, NOT THE FETCH. Responses can land out of order, so
  // without it a slow answer for "sw" could overwrite a fast one for "swati" and
  // the vendor would watch her own results go backwards.
  //
  // The empty query is NOT skipped: the door answers it with her roster alone —
  // the `Worked with` suggestions — which is the resting state of the sheet.
  useEffect(() => {
    let alive = true;
    const timer = setTimeout(() => {
      (async () => {
        try {
          const data = await getJson<PeerSearchResult>(API.referralPeers(q));
          if (alive) setResult({
            groups: data.groups ?? [],
            searching: data.searching === true,
            // The door's number, defaulted only if the door did not send one.
            min_query: typeof data.min_query === 'number' ? data.min_query : 2,
          });
        } catch {
          // An empty RESULT, never a null one: null means "not asked yet" and
          // would leave the sheet showing a loading state forever.
          if (alive) setResult({ groups: [], searching: q.trim().length >= 2, min_query: 2 });
        }
      })();
    }, q ? 220 : 0);
    return () => { alive = false; clearTimeout(timer); };
  }, [q]);

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

        {/* ── THE SEARCH · R-40.104 ─────────────────────────────────────────
            IT SHAPES THE CHOICE AND DOES NOT AUTHORISE IT. `forwardLead`
            re-derives the same three-clause predicate server-side before it
            writes — `status='active' AND discover_paused=false AND
            peer_discoverable=true` — because a client-side list has never been a
            permission. That was true of the roster picker and it is true of a
            search over every vendor on TDW.

            ⚠ NO PHONE KEY (c-40.45). Business name and routing handle only.

            ⚠ THE GROUPS ARE RENDERED AS GIVEN. The door sorts them, orders them
            and OMITS an empty one, so there is no length test here and no local
            sort. A surface that re-decided either would be a second home for a
            founder's ruling. */}
        {picking ? (
          <>
            <div style={{ ...label, letterSpacing: '0.42em', color: A.brass }}>{RF.pickerTitle}</div>

            {/* R-44.10 (founder, 2026-09-18, "yes."): the keyboard comes up only when she
                tapped something that NAMES the field, and never just because a sheet
                opened. This sheet opens on a Forward tap, which names no field, so its
                autoFocus is gone. Every remaining focus call in the vendor tree is driven
                by a tap or a refusal that names its own field, and those stay. */}
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={RF.searchPlaceholder}
              aria-label={RF.searchPlaceholder}
              style={{
                width: '100%', boxSizing: 'border-box', background: 'var(--atelier-input-bg)',
                border: '0.5px solid var(--atelier-input-border)', borderRadius: 3,
                padding: '10px 12px', margin: '10px 0 2px',
                fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.ink,
              }}
            />

            {(result?.groups ?? []).map((g) => (
              <div key={g.key}>
                {/* THE HEAD. It is drawn because the group EXISTS — the door
                    omits an empty one, so this never renders over nothing. */}
                <div style={{
                  ...label, letterSpacing: '0.08em', color: A.inkMute,
                  marginTop: 14, paddingTop: 10, borderTop: '0.5px solid var(--atelier-card-border)',
                }}>
                  {g.key === 'worked_with' ? RF.groupWorkedWith
                    : g.key === 'same_trade' ? RF.groupSameTrade
                    : RF.groupEveryone}
                </div>
                {g.peers.map((p) => (
                  <button key={p.id} type="button" onClick={() => { setChosen(p); setPicking(false); }} style={{
                    display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center',
                    background: 'transparent', border: 'none',
                    padding: '11px 0', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <span>
                      {/* HER NAME OR NOTHING — never an invented one. */}
                      <span style={{ display: 'block', fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.ink }}>{p.business_name || '\u2014'}</span>
                      {/* TRADE AND CITY. Two facts decide whether she is the
                          RIGHT peer for this enquiry, and both are already on her
                          public storefront card — which is the whole argument
                          R-40.107 rests on. Nothing else: no rating, no distance,
                          no count of forwards, and never a phone. */}
                      <span style={{ ...label, display: 'block', marginTop: 2 }}>
                        {[p.category, p.city].filter(Boolean).join(' \u00b7 ') || '\u2014'}
                      </span>
                    </span>
                    {chosen?.id === p.id ? <span style={{ color: 'var(--atelier-accent-text)', fontSize: 16 }}>{'\u2713'}</span> : null}
                  </button>
                ))}
              </div>
            ))}

            {/* ── THE HONEST LINE, AND NOTHING TO PRESS BENEATH IT ───────────
                Only once the door says it was actually SEARCHING — below the
                minimum it answered with her roster, and printing "no one matches"
                over a one-character query would be a lie about what was asked.

                ⚠ IT DOES NOT SAY THE PEER IS ABSENT FROM TDW. A vendor who has
                switched off peer discovery (R-40.107) must read identically from
                here, or the switch is defeated on the first search.

                B8 still stands: no way in from here. The invite is its own arc,
                and a control pointing at a door this sheet cannot open is worse
                than none. */}
            {result && result.searching && result.groups.length === 0 ? (
              <p style={{ fontFamily: F.script, fontWeight: 300, fontSize: 13, color: A.inkMute, lineHeight: 1.5, marginTop: 14 }}>
                {RF.searchNoMatch}
              </p>
            ) : null}
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
              {/* ⚠ ITS FALLBACK USED TO BE B8 — "Peers you've worked with appear
                  here." — shown when her roster was empty, because an empty
                  roster meant she could forward to nobody. R-40.104 makes that
                  false: with no roster at all she can still search every vendor
                  on TDW. So the control now says the same thing in both states,
                  which is what it always meant: choose a peer. */}
              <span>{chosen ? (chosen.business_name || '\u2014') : RF.pickerTitle}</span>
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
