'use client';
// app/components/couple/AssistanceSheet.tsx — CE-42 · SEAT D3 · /plan SITTING 2 · FORK A (ruled a)
//
// THE ESTATE'S ONE ASSISTANCE SHEET, FOR BOTH DOORS. Extracted whole from
// `app/(frost)/frost/canvas/assistance/page.tsx`, where it had been the bride
// lane's private business since BLOCK 20 · CONCIERGE s1.
//
// WHY IT LEFT THAT FILE. `/plan` (R-41.94) is a second door onto the same sheet:
// a stranger arriving from a link, filling the same eleven rows, sending the same
// body to the same writer through a second mount. A second copy would be a second
// home for the vetoed bytes, the eleven rows, the validation and the sent card —
// and the day one of them is corrected the other keeps the defect (one-home law).
//
// WHAT THE CALLER SUPPLIES, AND WHY EACH ONE IS A PARAMETER RATHER THAN A FLAG:
//
//   palette   — every colour this component draws. The bride lane passes Wine
//               Night; `/plan` passes the public light ground. NOT a boolean:
//               a `dark ? A : B` inside would put two palettes in this file and
//               make it the authority on which lane gets which, which it is not.
//   chrome    — the wrapper. The bride lane passes CanvasShell; `/plan` passes a
//               plain centred column. ⚠ THIS FILE IMPORTS NEITHER CanvasShell NOR
//               FrostCtx, and that is the whole of Fork 5(a) — see the trap note.
//   signedIn  — governs the TWO READS only. False on `/plan`: no
//               `fetchMyAssistance`, no `/couple/me`, so a public page fires no
//               authed fetch and cannot produce a 401.
//   submit    — what Send does. The bride lane POSTs and returns 'sent'; `/plan`
//               captures the body, advances to its own phone screen and returns
//               'held', because at Send she holds no session and the door is
//               inside requireCoupleAuth. FORK 1(a), chair-ruled.
//   copy      — the four heading/lede slots. Q1 ruled P1 into #7's slot on
//               `/plan` only; the bride lane keeps 'Your wedding assistant'.
//
// ⚠ THE THREE TRAPS THIS EXTRACTION EXISTS TO DEFUSE (D2's note §4.2, all three
// re-derived at e81d703c and all three live):
//   1. CanvasShell calls useFrostMode(), whose context default is pinned E1A —
//      Wine Night, DARK — and that default is inert only while a provider wraps
//      every consumer. A page outside the (frost) group is the render that does
//      not reach the provider. Cured by construction: chrome is the caller's, so
//      neither the shell nor the context is imported here at all.
//   2. The colours were hardcoded Wine in this component's body. They are the
//      caller's now, every one of them.
//   3. CanvasShell renders Back to `backTo`, which the bride page passes as
//      /frost/canvas/sanctuary — a public stranger's first tap into the
//      authenticated shell. It cannot happen from a component that cannot name it.
//
// Money is typed as digits and shown as `Rs X,XX,XXX` through formatRs (the one
// money home, c-41.2). Pre-fill (R-41.25): on the bride lane date and city come
// from her profile for DISPLAY and nothing here writes back to couples; on
// `/plan` they come from the link's own query and draw no `from your profile`
// chip, because that chip is #10 and it belongs to a profile she does not have.

import React, { useEffect, useMemo, useState } from 'react';
import { formatRs } from '@/lib/vendor/format';
import { apiGet } from '@/lib/frost-api/_base';
import { ASSIST_ROWS, type AssistCategory, type AssistMineItem, type AssistRequestBody, fetchMyAssistance } from '@/lib/frost-api/assistance';
import { markAssistRequested } from '@/lib/frost/assistPopup';
import { waNumberFor } from '@/lib/waNumbers';

// ── the vetoed bytes, one home each ─────────────────────────────────────────
// Every string is the veto sheet's number (docs/mocks/TDW_20_CONCIERGE/
// TDW_20_VETO_SHEET.md, founder-ruled 2026-09-08 under R-41.33); an edited comma
// is a fresh veto. F-42.137: `cityPh` and `budgetAria` were LITERALS on the glass
// at :207 and :217 and had no home in this map — the kickoff's census counted
// twenty bytes and the set is larger. They join it here rather than travel as
// loose strings into a second file.
export const SHEET_BYTES = {
  title:      'Your wedding assistant',                                   // #7
  lede:       'One sheet. We do the rest.',                               // #8
  date:       'Wedding date',                                             // #9
  fromProfile:'from your profile',                                        // #10
  cityArea:   'City · area',                                              // #11
  cityPh:     'City',                                                     // F-42.137, was a literal
  areaPh:     'Area, if you know it',                                     // #12
  need:       'What you need, and roughly how much for each',            // #13 (ruled)
  rsPh:       'Rs',                                                       // #15
  budgetAria: (label: string) => `${label} budget in rupees`,             // F-42.137, was a literal
  look:       'The look',                                                 // #16
  lookPh:     'Colours, style, anything you\u2019ve saved in your Muse',  // #17 (ruled)
  send:       'Send',                                                     // #18
  fine:       'We share your request only with the vendors we choose for you.', // #19
  validation: 'Pick at least one and tell us roughly how much.',         // #20 (ruled)
  // FORK 4(a), founder-vetoed at D3 s2. The guard is the SHEET'S and it runs only
  // where `requireCity` is set — `/plan` sets it, the bride lane does not, because
  // R-41.25's profile coalesce stands there and a signed-in bride who leaves the
  // field blank still files a request with a city on it. A stranger has no profile
  // to coalesce from, so her blank field files a cityless row, and F-42.58 says a
  // cityless request cannot be forwarded to an outsider: she would file into silence.
  needCity:   'Add your wedding city.',
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
export const TDW_WA_LINK = `https://wa.me/${waNumberFor('bride')}?text=Hi`;

export interface SheetPalette {
  bg:          string;
  ink:         string;
  inkSoft:     string;
  inkMute:     string;
  line:        string;
  rowBg:       string;
  rowBdr:      string;
  checkOn:     string;                 // the checkbox, filled
  refusalInk:  string;                 // #20, #21 and the city guard
  onTdwInk:    string;                 // #27's mark
  colorScheme: 'dark' | 'light';       // the native date control
  cta:         React.CSSProperties;    // Send
  ctaPress:    React.CSSProperties;    // Send, held down
  outlineBtn:  React.CSSProperties;    // #33
}

export interface SheetCopy {
  title:       string;   // S1 heading
  lede:        string;   // S1 lede
  sentHeading: string;   // the sent screen's heading
  sentLede:    string;   // the sent screen's lede; empty draws nothing
  sentCard:    string;   // the card's own line; empty gives the slot to the categories
}

export type SheetSubmitResult = 'sent' | 'held' | 'error';
export type SheetSubmit = (body: AssistRequestBody) => Promise<SheetSubmitResult>;

export interface AssistanceSheetProps {
  palette:      SheetPalette;
  copy:         SheetCopy;
  signedIn:     boolean;
  submit:       SheetSubmit;
  chrome:       (inner: React.ReactNode) => React.ReactNode;
  requireCity?: boolean;
  prefill?:     { city?: string; date?: string };
  // ⚠ INITIAL MEANS INITIAL — F-42.144, and it cost a walk. Both of these are read by
  // `useState` initialisers, which run ONCE PER INSTANCE. Handing a live component a
  // new value changes nothing and throws nothing; the screen simply keeps whatever it
  // was built with. A caller that needs a different one owes a fresh instance — a
  // `key` that changes with the screen is how `/plan` pays it.
  initialSent?: { categories: string[]; city: string; date: string } | null;
  // The sent screen's forward action, and it is OPTIONAL BY DESIGN. The bride lane
  // passes none: she is already inside the app and the sent state is where she stops,
  // so a Continue there would be a button to nowhere. `/plan` passes one because a
  // stranger has somewhere to be sent next and, until she taps it, this screen is the
  // only acknowledgement her request landed (Fork 2, amended at the walk).
  sentAction?: { label: string; onTap: () => void };
}

function digitsOnly(s: string): string { return s.replace(/\D/g, '').slice(0, 9); }

type Row = { category: AssistCategory; label: string; on: boolean; rs: string };

export default function AssistanceSheet({
  palette, copy, signedIn, submit, chrome,
  requireCity = false, prefill, initialSent = null, sentAction,
}: AssistanceSheetProps) {
  const S = SHEET_BYTES;
  const { bg, ink, inkSoft, inkMute, line, rowBg, rowBdr } = palette;

  const mono: React.CSSProperties  = { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: inkMute };
  const serif: React.CSSProperties = { fontFamily: "'Fraunces',serif", fontStyle: 'italic', fontWeight: 300, fontFeatureSettings: '"opsz" 9' };
  const field: React.CSSProperties = { background: rowBg, border: `1px solid ${rowBdr}`, borderRadius: 6, padding: '11px 13px', fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: ink, outline: 'none', width: '100%' };

  const [rows, setRows] = useState<Row[]>(ASSIST_ROWS.map(r => ({ ...r, on: false, rs: '' })));
  const [date, setDate] = useState(initialSent?.date || prefill?.date || '');
  const [city, setCity] = useState(initialSent?.city || prefill?.city || '');
  const [area, setArea] = useState('');
  const [brief, setBrief] = useState('');
  const [fromProfile, setFromProfile] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error' | 'invalid'>(initialSent ? 'sent' : 'idle');
  const [refusal, setRefusal] = useState<{ cats: boolean; city: boolean }>({ cats: false, city: false });
  const [pressed, setPressed] = useState(false);
  const [sent, setSent] = useState<{ categories: string[] } | null>(initialSent ? { categories: initialSent.categories } : null);
  const [mine, setMine] = useState<AssistMineItem[] | null>(null);   // F-41.29: what TDW has found so far
  // F-41.41 · draw S1 or S2 once, after the read. THERE IS NO READ WHEN SHE IS NOT
  // SIGNED IN, so the quiet frame would never lift on /plan — it settles at mount.
  const [settled, setSettled] = useState(!signedIn || !!initialSent);

  // F-41.29 · on mount, her latest request: when one exists the sheet opens on S2
  // with what she sent and what has been found, not on an empty form. Her words
  // (the look, date, city) come back from the request, never from this browser.
  useEffect(() => {
    if (!signedIn) return;
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
  }, [signedIn]);

  // Display pre-fill from her profile; the request holds its own copy (R-41.25).
  useEffect(() => {
    if (!signedIn) return;
    let live = true;
    apiGet<{ ok: boolean; couple?: { wedding_date?: string | null; wedding_city?: string | null } }>('/api/v2/couple/me')
      .then(d => {
        if (!live || !d?.couple) return;
        if (d.couple.wedding_date) { setDate(String(d.couple.wedding_date).slice(0, 10)); setFromProfile(true); }
        if (d.couple.wedding_city) setCity(d.couple.wedding_city);
      })
      .catch(() => { /* she types it */ });
    return () => { live = false; };
  }, [signedIn]);

  const chosen = useMemo(() => rows.filter(r => r.on), [rows]);
  const valid = chosen.length > 0 && chosen.every(r => r.rs.trim() !== '');

  // F-42.74's shape, carried: a refusal HOLDS until a field changes — it does not
  // flash past on a timer, and it does not survive the edit that answers it. EVERY
  // field clears it through this one wrapper, so no field can forget to.
  const touched = () => {
    if (refusal.cats || refusal.city) setRefusal({ cats: false, city: false });
    setState(s => (s === 'invalid' || s === 'error' ? 'idle' : s));
  };

  const toggle = (i: number) => { touched(); setRows(rs => rs.map((r, k) => k === i ? { ...r, on: !r.on } : r)); };
  const setRs = (i: number, v: string) => { touched(); setRows(rs => rs.map((r, k) => k === i ? { ...r, rs: digitsOnly(v), on: true } : r)); };

  async function send() {
    if (state === 'sending') return;
    const missingCity = requireCity && city.trim() === '';
    if (missingCity || !valid) { setRefusal({ cats: !valid, city: missingCity }); setState('invalid'); return; }
    setState('sending');
    try {
      const out = await submit({
        city: city || null, area: area || null, wedding_date: date || null, brief: brief || null,
        items: chosen.map(r => ({ category: r.category, budget_rs: r.rs ? parseInt(r.rs, 10) : null })),
      });
      if (out === 'sent') {
        markAssistRequested();
        setSent({ categories: chosen.map(r => r.label) });
        setState('sent');
      } else if (out === 'held') {
        // FORK 1(a): the caller took the body and owns what happens next. This
        // component draws nothing further and must NOT paint the sent card — she
        // has not sent anything yet. `/plan` unmounts this screen on the same tick.
        setState('idle');
      } else { setState('error'); }
    } catch { setState('error'); }
  }

  const whenWhere = `${date ? fmtDate(date) : ''}${date && city ? ', ' : ''}${city}`;
  const catsLine = sent ? `${sent.categories.join(' · ')}${whenWhere ? ` — ${whenWhere}.` : ''}` : '';

  return chrome(
    <div style={{ minHeight: '100%', background: bg, padding: '0 0 40px' }}>
      <div style={{ padding: '18px 20px 14px', borderBottom: `.5px solid ${line}` }}>
        <div style={{ fontFamily: "'Italianno',cursive", fontSize: 46, color: ink, lineHeight: 1, marginBottom: 4 }}>
          {!settled ? '' : state === 'sent' ? copy.sentHeading : copy.title}
        </div>
        {(() => {
          const l = !settled ? '' : state === 'sent' ? copy.sentLede : copy.lede;
          return l ? <div style={{ ...serif, fontSize: 16, color: inkSoft, lineHeight: 1.6 }}>{l}</div> : null;
        })()}
      </div>

      {!settled ? (
        // F-41.41 · the quiet frame: header only, no form, no card, until the read settles.
        <div aria-busy style={{ minHeight: 240 }} />
      ) : state === 'sent' && sent ? (
        // ── S2 · after Send (§6.3 as drawn; #30–#31 struck) ────────────────
        <div style={{ padding: '16px 20px' }}>
          <div style={{ background: rowBg, border: `1px solid ${rowBdr}`, borderRadius: 10, padding: '16px 16px 14px' }}>
            {/* When the caller gives the card no line of its own, the categories take
                the slot rather than sitting orphaned beneath an empty one. */}
            {copy.sentCard ? (
              <>
                <div style={{ ...serif, fontSize: 19, color: ink, lineHeight: 1.25 }}>{copy.sentCard}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: inkSoft, marginTop: 6, lineHeight: 1.5 }}>{catsLine}</div>
              </>
            ) : (
              <div style={{ ...serif, fontSize: 19, color: ink, lineHeight: 1.25 }}>{catsLine}</div>
            )}
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
                      <span style={{ ...mono, color: palette.onTdwInk }}>{S.onTdw}</span>
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
          {sentAction && (
            <div role="button" onClick={sentAction.onTap}
              onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
              style={{ ...palette.cta, ...(pressed ? palette.ctaPress : null) }}>
              {sentAction.label}
            </div>
          )}
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: inkMute, textAlign: 'center', marginTop: 22, lineHeight: 1.5 }}>{S.changeIt}</div>
          {(
            <a href={TDW_WA_LINK} target="_blank" rel="noreferrer" style={palette.outlineBtn}>{S.messageTdw}</a>
          )}
        </div>
      ) : (
        // ── S1 · the sheet ──────────────────────────────────────────────────
        <div style={{ padding: '4px 20px 0' }}>
          <div style={{ ...mono, margin: '14px 0 7px' }}>{S.date}</div>
          <div style={{ position: 'relative' }}>
            <input type="date" value={date} onChange={e => { touched(); setDate(e.target.value); setFromProfile(false); }} style={{ ...field, colorScheme: palette.colorScheme }} />
            {fromProfile && <span style={{ ...mono, position: 'absolute', right: 40, top: 14 }}>{S.fromProfile}</span>}
          </div>

          <div style={{ ...mono, margin: '14px 0 7px' }}>{S.cityArea}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={city} onChange={e => { touched(); setCity(e.target.value); }} placeholder={S.cityPh} style={field} />
            <input value={area} onChange={e => { touched(); setArea(e.target.value); }} placeholder={S.areaPh} style={field} />
          </div>
          {refusal.city && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: palette.refusalInk, marginTop: 8 }}>{S.needCity}</div>}

          <div style={{ ...mono, margin: '18px 0 4px' }}>{S.need}</div>
          {rows.map((r, i) => (
            <div key={r.category} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `.5px solid ${line}` }}>
              <div onClick={() => toggle(i)} role="checkbox" aria-checked={r.on} aria-label={r.label}
                style={{ width: 16, height: 16, borderRadius: 4, border: `1px solid ${r.on ? palette.checkOn : inkMute}`, background: r.on ? palette.checkOn : 'transparent', flexShrink: 0, cursor: 'pointer' }} />
              <span onClick={() => toggle(i)} style={{ ...serif, fontSize: 16, color: r.on ? ink : inkMute, flex: 1, cursor: 'pointer' }}>{r.label}</span>
              <input inputMode="numeric" value={r.rs ? formatRs(parseInt(r.rs, 10)) : ''} onChange={e => setRs(i, e.target.value)} placeholder={S.rsPh} aria-label={S.budgetAria(r.label)}
                style={{ ...field, width: 122, minWidth: 122, padding: '7px 9px', fontSize: 11, textAlign: r.rs ? 'right' : 'left', color: r.rs ? ink : inkMute }} />
            </div>
          ))}

          <div style={{ ...mono, margin: '18px 0 7px' }}>{S.look}</div>
          <textarea value={brief} onChange={e => { touched(); setBrief(e.target.value.slice(0, 2000)); }} placeholder={S.lookPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.55, minHeight: 74 }} />

          <div onClick={send} role="button" aria-disabled={state === 'sending'}
            onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
            style={{ ...palette.cta, ...(pressed ? palette.ctaPress : null), opacity: state === 'sending' ? .6 : 1 }}>
            {S.send}
          </div>
          {refusal.cats && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: palette.refusalInk, textAlign: 'center', marginTop: 10 }}>{S.validation}</div>}
          {state === 'error' && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: palette.refusalInk, textAlign: 'center', marginTop: 10 }}>{S.failure}</div>}
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: inkMute, textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>{S.fine}</div>
        </div>
      )}
    </div>
  );
}

// `14 February 2027` — en-GB long, no Intl abbreviation trap (paymentReminders.ts:98's lesson).
export function fmtDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
