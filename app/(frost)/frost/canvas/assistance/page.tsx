'use client';
// app/(frost)/frost/canvas/assistance/page.tsx — BLOCK 20 · CONCIERGE s1 · THE SHEET.
//
// One sheet (R-41.2): date · city · area · the categories with a `Rs` each · the
// look · Send. After Send, S2 (§6.3 as drawn, #30–#31 struck). Every string is
// the veto sheet's number (docs/mocks/TDW_20_CONCIERGE/TDW_20_VETO_SHEET.md,
// founder-ruled 2026-09-08 under R-41.33); an edited comma is a fresh veto.
//
// Tokens: the couple lane is pinned to Wine Night (lib/frost/tokens.ts:194);
// the values below are the sanctuary's own (sanctuary/page.tsx:788–:794) and
// settings.tsx:33–:40, transcribed, not renegotiated. Money is typed as digits
// and shown as `Rs X,XX,XXX` through formatRs (the one money home, c-41.2).
//
// Pre-fill (R-41.25): date and city come from her profile for DISPLAY; the door
// coalesces them server-side only where the sheet left them blank, and nothing
// here writes back to couples. The couple never sees a queue (roadmap §7).

import React, { useEffect, useMemo, useState } from 'react';
import CanvasShell from '../../../../../components/frost/CanvasShell';
import { formatRs } from '@/lib/vendor/format';
import { apiGet } from '@/lib/frost-api/_base';
import { ASSIST_ROWS, submitAssistanceRequest, fetchMyAssistance, type AssistCategory, type AssistMineItem } from '@/lib/frost-api/assistance';
import { markAssistRequested } from '@/lib/frost/assistPopup';
import { waNumberFor } from '@/lib/waNumbers';

// ── the vetoed bytes, one home each ─────────────────────────────────────────
const S = {
  title:      'Your wedding assistant',                                   // #7
  lede:       'One sheet. We do the rest.',                               // #8
  date:       'Wedding date',                                             // #9
  fromProfile:'from your profile',                                        // #10
  cityArea:   'City · area',                                              // #11
  areaPh:     'Area, if you know it',                                     // #12
  need:       'What you need, and roughly how much for each',            // #13 (ruled)
  rsPh:       'Rs',                                                       // #15
  look:       'The look',                                                 // #16
  lookPh:     'Colours, style, anything you\u2019ve saved in your Muse',  // #17 (ruled)
  send:       'Send',                                                     // #18
  fine:       'We share your request only with the vendors we choose for you.', // #19
  validation: 'Pick at least one and tell us roughly how much.',         // #20 (ruled)
  failure:    'That didn\u2019t send. Try once more, or message us on WhatsApp.', // #21
  sentLede:   'Sent. We\u2019re on it.',                                  // #22
  sentTitle:  'We\u2019ll message you on WhatsApp as we find each vendor.', // #23
  foundSoFar: 'Found so far',                                             // #25 (KEPT)
  onTdw:      'On TDW \u2192',                                            // #27 (KEPT)
  notOnTdw:   'Not on TDW yet',                                           // #29 (KEPT)
  outsiderRow: (cat: string) => `A ${cat.toLowerCase()} vendor we\u2019re bringing on`, // #28 (KEPT), the trade in her words
  changeIt:   'Need to change something? Message us on WhatsApp.',       // #32
  messageTdw: 'Message The Dream Wedding',                                // #33
};

// The WhatsApp link is the settings room's own (settings.tsx:23): waNumberFor('bride').
const TDW_WA_LINK = `https://wa.me/${waNumberFor('bride')}?text=Hi`;

// Wine Night, transcribed
const bg      = 'radial-gradient(ellipse 80% 45% at 80% 0%,rgba(196,133,106,.12) 0%,transparent 52%),linear-gradient(160deg,#1A0A0E 0%,#120608 40%,#0C0404 100%)';
const ink     = '#F5E5DC';
const inkSoft = 'rgba(245,229,220,.72)';
const inkMute = 'rgba(196,133,106,.50)';
const line    = 'rgba(196,133,106,.14)';
const rowBg   = 'rgba(196,133,106,.05)';
const rowBdr  = 'rgba(196,133,106,.12)';
const accent  = '#C4856A';

const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: inkMute };
const serif: React.CSSProperties = { fontFamily: "'Fraunces',serif", fontStyle: 'italic', fontWeight: 300, fontFeatureSettings: '"opsz" 9' };
const field: React.CSSProperties = { background: rowBg, border: `1px solid ${rowBdr}`, borderRadius: 6, padding: '11px 13px', fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: ink, outline: 'none', width: '100%' };

function digitsOnly(s: string): string { return s.replace(/\D/g, '').slice(0, 9); }

type Row = { category: AssistCategory; label: string; on: boolean; rs: string };

export default function AssistanceSheet() {
  const [rows, setRows] = useState<Row[]>(ASSIST_ROWS.map(r => ({ ...r, on: false, rs: '' })));
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [brief, setBrief] = useState('');
  const [fromProfile, setFromProfile] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error' | 'invalid'>('idle');
  const [sent, setSent] = useState<{ categories: string[] } | null>(null);
  const [mine, setMine] = useState<AssistMineItem[] | null>(null);   // F-41.29: what TDW has found so far
  const [settled, setSettled] = useState(false);                        // F-41.41: draw S1 or S2 once, after the read

  // F-41.29 · on mount, her latest request: when one exists the sheet opens on S2
  // with what she sent and what has been found, not on an empty form. Her words
  // (the look, date, city) come back from the request, never from this browser.
  useEffect(() => {
    let live = true;
    fetchMyAssistance()
      .then(d => {
        if (!live || !d?.request) return;
        const labels = d.items.map(i => ASSIST_ROWS.find(r => r.category === i.category)?.label || i.category);
        if (d.request.wedding_date) setDate(String(d.request.wedding_date).slice(0, 10));
        if (d.request.city) setCity(d.request.city);
        setMine(d.items);
        setSent({ categories: labels });
        setState('sent');
      })
      .catch(() => { /* no read door yet, or offline: the empty sheet is honest */ })
      .finally(() => { if (live) setSettled(true); });
    return () => { live = false; };
  }, []);

  // Display pre-fill from her profile; the request holds its own copy (R-41.25).
  useEffect(() => {
    let live = true;
    apiGet<{ ok: boolean; couple?: { wedding_date?: string | null; wedding_city?: string | null } }>('/api/v2/couple/me')
      .then(d => {
        if (!live || !d?.couple) return;
        if (d.couple.wedding_date) { setDate(String(d.couple.wedding_date).slice(0, 10)); setFromProfile(true); }
        if (d.couple.wedding_city) setCity(d.couple.wedding_city);
      })
      .catch(() => { /* she types it */ });
    return () => { live = false; };
  }, []);

  const chosen = useMemo(() => rows.filter(r => r.on), [rows]);
  const valid = chosen.length > 0 && chosen.every(r => r.rs.trim() !== '');

  const toggle = (i: number) => setRows(rs => rs.map((r, k) => k === i ? { ...r, on: !r.on } : r));
  const setRs = (i: number, v: string) => setRows(rs => rs.map((r, k) => k === i ? { ...r, rs: digitsOnly(v), on: true } : r));

  async function send() {
    if (state === 'sending') return;
    if (!valid) { setState('invalid'); return; }
    setState('sending');
    try {
      const out = await submitAssistanceRequest({
        city: city || null, area: area || null, wedding_date: date || null, brief: brief || null,
        items: chosen.map(r => ({ category: r.category, budget_rs: r.rs ? parseInt(r.rs, 10) : null })),
      });
      if (out && out.ok) {
        markAssistRequested();
        setSent({ categories: chosen.map(r => r.label) });
        setState('sent');
      } else { setState('error'); }
    } catch { setState('error'); }
  }

  const whenWhere = `${date ? fmtDate(date) : ''}${date && city ? ', ' : ''}${city}`;

  return (
    <CanvasShell eyebrow="Sanctuary" backTo="/frost/canvas/sanctuary">
      <div style={{ minHeight: '100%', background: bg, padding: '0 0 40px' }}>
        <div style={{ padding: '18px 20px 14px', borderBottom: `.5px solid ${line}` }}>
          <div style={{ fontFamily: "'Italianno',cursive", fontSize: 46, color: ink, lineHeight: 1, marginBottom: 4 }}>{S.title}</div>
          <div style={{ ...serif, fontSize: 16, color: inkSoft, lineHeight: 1.6 }}>{!settled ? '' : state === 'sent' ? S.sentLede : S.lede}</div>
        </div>

        {!settled ? (
          // F-41.41 · the quiet frame: header only, no form, no card, until the read settles.
          <div aria-busy style={{ minHeight: 240 }} />
        ) : state === 'sent' && sent ? (
          // ── S2 · after Send (§6.3 as drawn; #30–#31 struck) ────────────────
          <div style={{ padding: '16px 20px' }}>
            <div style={{ background: rowBg, border: `1px solid ${rowBdr}`, borderRadius: 10, padding: '16px 16px 14px' }}>
              <div style={{ ...serif, fontSize: 19, color: ink, lineHeight: 1.25 }}>{S.sentTitle}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: inkSoft, marginTop: 6, lineHeight: 1.5 }}>
                {sent.categories.join(' · ')}{whenWhere ? ` — ${whenWhere}.` : ''}
              </div>
            </div>
            {mine && mine.some(i => i.found.length > 0 || i.outsiders_asked > 0) && (
              <div style={{ marginTop: 22 }}>
                <div style={mono}>{S.foundSoFar}</div>
                {mine.map(i => (
                  <React.Fragment key={i.id}>
                    {i.found.map((f, k) => (
                      <a key={`${i.id}-${k}`} href={f.routing_handle ? `/v/${f.routing_handle}` : undefined}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `.5px solid ${line}`, textDecoration: 'none' }}>
                        <span>
                          <span style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: ink }}>{f.business_name || 'A vendor on The Dream Wedding'}</span>
                          <span style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: inkSoft }}>{ASSIST_ROWS.find(r => r.category === i.category)?.label || i.category}</span>
                        </span>
                        <span style={{ ...mono, color: '#6B9E8F' }}>{S.onTdw}</span>
                      </a>
                    ))}
                    {i.outsiders_asked > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `.5px solid ${line}` }}>
                        <span>
                          <span style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: ink }}>{S.outsiderRow(ASSIST_ROWS.find(r => r.category === i.category)?.label || i.category)}</span>
                          <span style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: inkSoft }}>{ASSIST_ROWS.find(r => r.category === i.category)?.label || i.category}</span>
                        </span>
                        <span style={mono}>{S.notOnTdw}</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: inkMute, textAlign: 'center', marginTop: 22, lineHeight: 1.5 }}>{S.changeIt}</div>
            {(
              <a href={TDW_WA_LINK} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: 10, border: `1px solid ${rowBdr}`, borderRadius: 999, padding: 14, textAlign: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: inkSoft, textDecoration: 'none' }}>{S.messageTdw}</a>
            )}
          </div>
        ) : (
          // ── S1 · the sheet ──────────────────────────────────────────────────
          <div style={{ padding: '4px 20px 0' }}>
            <div style={{ ...mono, margin: '14px 0 7px' }}>{S.date}</div>
            <div style={{ position: 'relative' }}>
              <input type="date" value={date} onChange={e => { setDate(e.target.value); setFromProfile(false); }} style={{ ...field, colorScheme: 'dark' }} />
              {fromProfile && <span style={{ ...mono, position: 'absolute', right: 40, top: 14 }}>{S.fromProfile}</span>}
            </div>

            <div style={{ ...mono, margin: '14px 0 7px' }}>{S.cityArea}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" style={field} />
              <input value={area} onChange={e => setArea(e.target.value)} placeholder={S.areaPh} style={field} />
            </div>

            <div style={{ ...mono, margin: '18px 0 4px' }}>{S.need}</div>
            {rows.map((r, i) => (
              <div key={r.category} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `.5px solid ${line}` }}>
                <div onClick={() => toggle(i)} role="checkbox" aria-checked={r.on} aria-label={r.label}
                  style={{ width: 16, height: 16, borderRadius: 4, border: `1px solid ${r.on ? accent : inkMute}`, background: r.on ? accent : 'transparent', flexShrink: 0, cursor: 'pointer' }} />
                <span onClick={() => toggle(i)} style={{ ...serif, fontSize: 16, color: r.on ? ink : inkMute, flex: 1, cursor: 'pointer' }}>{r.label}</span>
                <input inputMode="numeric" value={r.rs ? formatRs(parseInt(r.rs, 10)) : ''} onChange={e => setRs(i, e.target.value)} placeholder={S.rsPh} aria-label={`${r.label} budget in rupees`}
                  style={{ ...field, width: 122, minWidth: 122, padding: '7px 9px', fontSize: 11, textAlign: r.rs ? 'right' : 'left', color: r.rs ? ink : inkMute }} />
              </div>
            ))}

            <div style={{ ...mono, margin: '18px 0 7px' }}>{S.look}</div>
            <textarea value={brief} onChange={e => setBrief(e.target.value.slice(0, 2000))} placeholder={S.lookPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.55, minHeight: 74 }} />

            <div onClick={send} role="button" aria-disabled={state === 'sending'}
              style={{ marginTop: 18, background: accent, color: '#1E0A0E', borderRadius: 999, padding: 14, textAlign: 'center', fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', cursor: 'pointer', opacity: state === 'sending' ? .6 : 1 }}>
              {S.send}
            </div>
            {state === 'invalid' && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: accent, textAlign: 'center', marginTop: 10 }}>{S.validation}</div>}
            {state === 'error' && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: accent, textAlign: 'center', marginTop: 10 }}>{S.failure}</div>}
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: inkMute, textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>{S.fine}</div>
          </div>
        )}
      </div>
    </CanvasShell>
  );
}

// `14 February 2027` — en-GB long, no Intl abbreviation trap (paymentReminders.ts:98's lesson).
function fmtDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
