'use client';
// app/vendor/(shell)/exchange/page.tsx
// CE-42 · SEAT R7 · 4c-3a — G5.3 THE INFLUENCER EXCHANGE, THE SHELL (R-42.14).
//
// ── WHAT THIS IS ─────────────────────────────────────────────────────────────
// The exchange's whole glass, built to the vetoed frames X1–X7 (docs/mocks/
// exchange-mock.html), with NO backend: the rows are lib/mocks/exchange.ts fixtures
// and EVERY act toasts COPY.launchingSoon (the estate's one byte for an act that
// cannot run yet, R-42.12). 4c-3b lands the plane and the arms behind these same
// controls — the control inventory here IS the real feature's, by charter.
//
// ── 4c-3b-1p · WHAT THIS SITTING ADDED ───────────────────────────────────────
// The creator's seat (Y1/Y2) and ONE FLAG. `EXCHANGE_PREVIEW` (lib/worklist/
// exchange.ts) is the only branch between the fixture and the doors: true → every
// row is a mock and every act toasts; false → the client in lib/vendor/api/
// exchange.ts is called and the acts are real. IT IS FALSE FROM 4c-3b-1p-r: the
// doors landed at dream-os 50781af and the acts are live. The control inventory does not
// change across the flip, which is the point of shipping it flag-on.
// THE DOOR DECIDES THE ROLE (shape ruling, 2026-09-10): a content_creator with the
// opt-in opens on her inbox and never sees the browse list — she is not a sender.
//
// ── THE RULINGS IT DRAWS ─────────────────────────────────────────────────────
//   S1 the banner is static — the switchboard row is `pending` (0149:87).
//   S2 audience fit, never follower bands: sorted by audience-city match to the
//      filter, then engagement; the follower count is a fact on the line, never a key.
//   S3 the reach card: by city · age · gender; never follower identities; fixture tiles.
//   S4 the offer is a TYPED pair — the eleven's labels + a note; Post · Reel · Story +
//      a count; dates. NO money field, ever (master §7). b76 asserts the absence.
//   S5 vendor side only; the influencer's seat waits on the account ruling.
//   S6 badge only. Withdraw on `sent` only (R-40.107's precedent).
//   §5 an influencer is a vendor of category content_creator (ruling comment (ii)).
//
// Tokens only (R-42.6); rungs only (R-38.4); dates full-month (R-42.13, via
// collabFormat.fmtDate — one home).
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { WlToast } from '@/components/worklist/WlToast';
import { useToast } from '@/hooks/vendor/useToast';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Sheet, SHEET_CSS } from '@/components/worklist/StudioSheets';
import { COPY } from '@/lib/solutions/copy';
import { EXCHANGE, EXCHANGE_PREVIEW, PREVIEW_ROLE_PARAM, fitLine, requestLine, subLine } from '@/lib/worklist/exchange';
import {
  EXCHANGE_INFLUENCERS, EXCHANGE_REQUESTS, EXCHANGE_INBOX, FIXTURE_ROLE,
  type ExchangeInfluencer,
} from '@/lib/mocks/exchange';
import {
  fetchExchangeHome, fetchCreators, fetchMyRequests, fetchInbox,
  sendRequest, withdrawRequest, completeRequest, acceptRequest, declineRequest,
  type ExchangeRole, type RequestRow, type RequestState, type AskKind, type CreatorRow,
  type SendRequestBody,
} from '@/lib/vendor/api/exchange';
import { CITIES } from '@/lib/vendor/cityMatch';
import { labelFor, CAT_LABEL } from '@/lib/frost/categoryLabels';
import { fmtDate } from '@/lib/vendor/collabFormat';

export default function ExchangePage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <ExchangeRoom />;
}

// ── THE ROLE GATE ────────────────────────────────────────────────────────────
// One read decides which glass mounts. Under the flag it is the fixture (with the
// preview param); live it is GET /api/v2/vendor/exchange. NOTHING IS DRAWN UNTIL
// IT HAS ANSWERED — mounting the sender's browse list for a creator and swapping
// it a moment later would show her a room she is not in (F-40.209's lesson, one
// surface over: a control drawn from a default asserts a fact it has not read).
function ExchangeRoom() {
  const params = useSearchParams();
  const [role, setRole] = useState<ExchangeRole | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    if (EXCHANGE_PREVIEW) {
      const asked = params.get(PREVIEW_ROLE_PARAM);
      setRole(asked === 'creator' ? 'creator' : asked === 'sender' ? 'sender' : FIXTURE_ROLE);
      return () => { live = false; };
    }
    fetchExchangeHome()
      .then(h => { if (live) { if (h && h.ok) setRole(h.role); else setFailed(true); } })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [params]);

  // A door that did not answer is not a sender. The room says so and stops, rather
  // than guessing a role and drawing someone else's glass.
  if (failed) return <WorklistShell title={EXCHANGE.rowLabel}><p className="xc-none xc-pad">{EXCHANGE.emptyList}</p><style>{XC_CSS}</style></WorklistShell>;
  if (!role)  return <div style={{ flex: 1 }} aria-busy="true" />;
  return role === 'creator' ? <InboxScreen /> : <ExchangeScreen />;
}

// ── THE CREATOR'S SEAT (Y1/Y2) ───────────────────────────────────────────────
// Accept and Decline on `sent` only; the other states read their label and carry
// no act. The sender's note is HERS to read and ours only to render.
function InboxScreen() {
  const { toast, show } = useToast();
  const [rows, setRows]   = useState<RequestRow[] | null>(EXCHANGE_PREVIEW ? inboxFromFixture() : null);
  const [busy, setBusy]   = useState<string | null>(null);

  useEffect(() => {
    if (EXCHANGE_PREVIEW) return;
    let live = true;
    fetchInbox().then(r => { if (live) setRows(r && r.ok ? r.requests : []); }).catch(() => { if (live) setRows([]); });
    return () => { live = false; };
  }, []);

  // ONE ACT PATH FOR BOTH VERBS, and it settles on the DOOR'S OWN ECHO rather than
  // on the state we hoped for — the peer switch's law (settings/page.tsx:77), which
  // matters more here: the door refuses a second Accept with NOT_IN_STATE, and a
  // room that had already painted `accepted` would be lying about a row it lost.
  const act = useCallback(async (id: string, verb: 'accept' | 'decline') => {
    if (EXCHANGE_PREVIEW) { show(COPY.launchingSoon); return; }
    if (busy) return;
    setBusy(id);
    try {
      const r = await (verb === 'accept' ? acceptRequest(id) : declineRequest(id));
      if (r && r.ok && r.request) {
        const next = r.request;
        setRows(prev => (prev ?? []).map(x => (x.id === next.id ? next : x)));
      } else if (r && r.error) {
        show(r.error);
      }
    } catch {
      /* the row stays as the door last said it was */
    } finally {
      setBusy(null);
    }
  }, [busy, show]);

  return (
    <WorklistShell title={EXCHANGE.rowLabel}>
      <div className="xc-room">
        <div className="xc-sec xc-first">{EXCHANGE.headInbox}{rows && rows.length ? <span>{rows.length}</span> : null}</div>
        {rows === null ? <div aria-busy="true" style={{ minHeight: 40 }} />
          : rows.length === 0 ? <p className="xc-none">{EXCHANGE.emptyMine}</p>
          : rows.map(r => (
            <div className="xc-card" key={r.id} style={{ opacity: busy === r.id ? 0.6 : 1 }}>
              <div className="xc-hd">
                <span>
                  <span className="xc-name">{r.counterpart_name}</span>
                  <span className="xc-line">{requestLine(labelFor(r.offer_kind), r.ask_count, r.ask_kind)} {'\u00B7'} {fmtDate(r.date_from)} {'\u2013'} {fmtDate(r.date_to)}</span>
                </span>
                <span className={stateClass(r.state)}>{EXCHANGE.states[r.state]}</span>
              </div>
              {r.offer_note ? <span className="xc-note">{r.offer_note}</span> : null}
              {r.state === 'sent' ? (
                <div className="xc-acts">
                  <button type="button" className="xc-go" disabled={busy === r.id} onClick={() => act(r.id, 'accept')}>{EXCHANGE.accept}</button>
                  <button type="button" className="xc-no" disabled={busy === r.id} onClick={() => act(r.id, 'decline')}>{EXCHANGE.decline}</button>
                </div>
              ) : null}
            </div>
          ))}
      </div>
      <WlToast toast={toast} />
      <style>{SHEET_CSS + XC_CSS}</style>
    </WorklistShell>
  );
}

/** The fixture in the DOOR'S shape, so the glass above never learns two row shapes. */
function inboxFromFixture(): RequestRow[] {
  return EXCHANGE_INBOX.map(r => ({
    id: r.id, counterpart_name: r.from_name, offer_kind: r.offer.craft, offer_note: r.offer.note,
    ask_kind: r.ask.kind.toLowerCase() as AskKind, ask_count: r.ask.count,
    date_from: r.dates.from, date_to: r.dates.to, state: r.state as RequestState,
  }));
}

function stateClass(s: RequestState): string {
  return 'xc-state' + (s === 'accepted' ? ' ok' : s === 'sent' ? '' : ' no');
}

// ── THE SENDER'S SEAT (X2-X7), NOW SOURCED THROUGH THE FLAG ──────────────────
// One row shape on the glass either way: the fixtures are mapped INTO the door's
// shape below rather than the glass learning two of them (the flip must change
// where rows come from, never what they look like).
// No local widening any more: the card shows exactly what the door serves (F-42.208).
type CreatorView = CreatorRow;

function ExchangeScreen() {
  const { toast, show } = useToast();
  const [city, setCity]   = useState<string>('Delhi NCR');
  const [craft, setCraft] = useState<string>('');
  const [open, setOpen]   = useState<CreatorView | null>(null);
  const [offering, setOffering] = useState(false);
  const [busy, setBusy]   = useState<string | null>(null);

  const [creators, setCreators] = useState<CreatorView[] | null>(EXCHANGE_PREVIEW ? creatorsFromFixture() : null);
  const [mine, setMine]         = useState<RequestRow[] | null>(EXCHANGE_PREVIEW ? mineFromFixture() : null);

  // ⚠ THE FILTERS ARE THE DOOR'S ARGUMENTS WHEN THE DOOR EXISTS, and the preview's
  // own comparator when it does not — S2(b) either way: audience-city match first,
  // then engagement, and the follower count never enters the sort.
  useEffect(() => {
    if (EXCHANGE_PREVIEW) return;
    let live = true;
    fetchCreators({ city, craft: craft || undefined })
      .then(r => { if (live) setCreators(r && r.ok ? r.creators : []); })
      .catch(() => { if (live) setCreators([]); });
    return () => { live = false; };
  }, [city, craft]);

  useEffect(() => {
    if (EXCHANGE_PREVIEW) return;
    let live = true;
    fetchMyRequests()
      .then(r => { if (live) setMine(r && r.ok ? r.requests : []); })
      .catch(() => { if (live) setMine([]); });
    return () => { live = false; };
  }, []);

  const list = useMemo(() => {
    const rows = creators ?? [];
    if (!EXCHANGE_PREVIEW) return rows;          // the door sorted and filtered
    const pct = (c: CreatorView) => c.reach?.cities.find(x => x.city === city)?.pct ?? 0;
    return [...rows].sort((a, b) => pct(b) - pct(a) || (b.reach?.engagement_pct ?? 0) - (a.reach?.engagement_pct ?? 0));
  }, [creators, city]);

  // Withdraw (sent only) and Mark completed (accepted only). The verb is posted;
  // the STATE comes back from the door and nothing else writes it here.
  const move = useCallback(async (id: string, verb: 'withdraw' | 'complete') => {
    if (EXCHANGE_PREVIEW) { show(COPY.launchingSoon); return; }
    if (busy) return;
    setBusy(id);
    try {
      const r = await (verb === 'withdraw' ? withdrawRequest(id) : completeRequest(id));
      if (r && r.ok && r.request) {
        const next = r.request;
        setMine(prev => (prev ?? []).map(x => (x.id === next.id ? next : x)));
      } else if (r && r.error) {
        show(r.error);
      }
    } catch {
      /* the row stays as the door last said it was */
    } finally {
      setBusy(null);
    }
  }, [busy, show]);

  const send = useCallback(async (creatorId: string, body: SendRequestBody) => {
    setOffering(false);
    if (EXCHANGE_PREVIEW) { show(COPY.launchingSoon); return; }
    try {
      const r = await sendRequest(creatorId, body);
      if (r && r.ok && r.request) {
        const made = r.request;
        setMine(prev => [made, ...(prev ?? [])]);
        setOpen(null);
      } else if (r && r.error) {
        show(r.error);
      }
    } catch {
      /* nothing was sent; the sheet is closed and her requests are unchanged */
    }
  }, [show]);

  return (
    <WorklistShell title={EXCHANGE.rowLabel}>
      <div className="xc-room">
        {open ? (
          <>
            <button type="button" className="xc-back" onClick={() => setOpen(null)}>{EXCHANGE.back}</button>
            <Card c={open} fitCity={city} />
            {open.reach ? (
              <>
                <div className="xc-sec">{EXCHANGE.audience}</div>
                <div className="xc-sub">{EXCHANGE.byCity}</div>
                <Bars rows={open.reach.cities.map(c => [c.city, c.pct])} />
                <div className="xc-sub">{EXCHANGE.byAge}</div>
                <Bars rows={open.reach.age.map(a => [a.band, a.pct])} />
                <div className="xc-sub">{EXCHANGE.byGender}</div>
                <Bars rows={open.reach.gender.map(g => [g.k, g.pct])} />
                <div className="xc-sec">{EXCHANGE.engagement}</div>
                <span className="xc-name">{open.reach.engagement_pct}%</span>
              </>
            ) : null}
            {/* THE POST TILES ARE DROPPED (F-42.208, ruled 2026-09-10). The shell drew
                them from a fixture and no door serves them: R6's /posts/cards renders HER
                cards from HER wedding pages, which is a different read entirely. The card
                is audience, engagement and verified state. 4c-3b-2 lands recent posts
                beside the demographics reader, or nothing does. */}
            <div className="xc-cta"><button type="button" className="wl-btn pri" onClick={() => setOffering(true)}>{EXCHANGE.sendReq}</button></div>
          </>
        ) : (
          <>
            <p className="xc-banner">{EXCHANGE.banner}</p>
            <div className="xc-filters">
              <select className="xc-fi" aria-label={EXCHANGE.filterCity} value={city} onChange={e => setCity(e.target.value)}>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="xc-fi" aria-label={EXCHANGE.filterCraft} value={craft} onChange={e => setCraft(e.target.value)}>
                <option value="">{EXCHANGE.filterCraft}</option>
                {Object.keys(CAT_LABEL).map(t => <option key={t} value={t}>{labelFor(t)}</option>)}
              </select>
            </div>
            <div className="xc-sec xc-first">{EXCHANGE.headList}{list.length ? <span>{list.length}</span> : null}</div>
            {creators === null ? <div aria-busy="true" style={{ minHeight: 40 }} />
              : list.length === 0 ? <p className="xc-none">{EXCHANGE.emptyList}</p>
              : list.map(c => <Card key={c.id} c={c} fitCity={city} onOpen={() => setOpen(c)} />)}

            <div className="xc-sec">{EXCHANGE.headMine}{mine && mine.length ? <span>{mine.length}</span> : null}</div>
            {mine === null ? <div aria-busy="true" style={{ minHeight: 40 }} />
              : mine.length === 0 ? <p className="xc-none">{EXCHANGE.emptyMine}</p>
              : mine.map(r => (
                <div className="xc-card" key={r.id} style={{ opacity: busy === r.id ? 0.6 : 1 }}>
                  <div className="xc-hd">
                    <span>
                      <span className="xc-name">{r.counterpart_name}</span>
                      <span className="xc-line">{requestLine(labelFor(r.offer_kind), r.ask_count, r.ask_kind)} {'\u00B7'} {fmtDate(r.date_from)} {'\u2013'} {fmtDate(r.date_to)}</span>
                    </span>
                    <span className={stateClass(r.state)}>{EXCHANGE.states[r.state]}</span>
                  </div>
                  {r.state === 'sent'     ? <button type="button" className="xc-ghost" disabled={busy === r.id} onClick={() => move(r.id, 'withdraw')}>{EXCHANGE.withdraw}</button> : null}
                  {r.state === 'accepted' ? <button type="button" className="xc-ghost" disabled={busy === r.id} onClick={() => move(r.id, 'complete')}>{EXCHANGE.complete}</button> : null}
                </div>
              ))}
          </>
        )}
      </div>

      {offering && open ? <OfferSheet c={open} onClose={() => setOffering(false)} onSend={body => { void send(open.id, body); }} /> : null}
      <WlToast toast={toast} />
      <style>{SHEET_CSS + XC_CSS}</style>
    </WorklistShell>
  );
}

/** The fixtures in the DOOR'S shapes. Kept past the flip on purpose: they are the
 *  seed for the preview branches, which are the way back if a door misbehaves on
 *  the walk. Nothing reads them while EXCHANGE_PREVIEW is false. */
function creatorsFromFixture(): CreatorView[] {
  return EXCHANGE_INFLUENCERS.map(i => ({
    id: i.id, business_name: i.name, city: i.city, handle: i.handle,
    reach: {
      follower_count: i.followers, engagement_pct: i.engagement_pct, verified: i.verified,
      cities: i.audience.cities, age: i.audience.age, gender: i.audience.gender,
    },
  }));
}
function mineFromFixture(): RequestRow[] {
  const name = (id: string) => EXCHANGE_INFLUENCERS.find(i => i.id === id)?.name ?? '\u2014';
  return EXCHANGE_REQUESTS.map(r => ({
    id: r.id, counterpart_name: name(r.influencer_id), offer_kind: r.offer.craft, offer_note: r.offer.note,
    ask_kind: r.ask.kind.toLowerCase() as AskKind, ask_count: r.ask.count,
    date_from: r.dates.from, date_to: r.dates.to, state: r.state as RequestState,
  }));
}

function Card({ c, fitCity, onOpen }: { c: CreatorView; fitCity: string; onOpen?: () => void }) {
  const pct = c.reach?.cities.find(x => x.city === fitCity)?.pct ?? 0;
  const body = (
    <>
      <div className="xc-hd">
        <span>
          <span className="xc-name">{c.business_name}</span>
          <span className="xc-meta">{subLine(c.handle ?? '', c.city, c.reach?.follower_count ?? 0)}</span>
        </span>
        {/* S6 · the badge is the DOOR'S `verified`, never a date this room judged.
            No reach at all reads Pending — the honest word for "not measured". */}
        <span className={'xc-badge' + (c.reach?.verified ? '' : ' pend')}>{c.reach?.verified ? EXCHANGE.badgeOn : EXCHANGE.badgeOff}</span>
      </div>
      {onOpen ? <span className="xc-fit">{fitLine(pct, fitCity)} {'\u00B7'} {c.reach?.engagement_pct ?? 0}% {EXCHANGE.engagement.toLowerCase()}</span> : null}
    </>
  );
  return onOpen
    ? <button type="button" className="xc-card xc-tap" onClick={onOpen}>{body}</button>
    : <div className="xc-card">{body}</div>;
}

function Bars({ rows }: { rows: [string, number][] }) {
  return (
    <div className="xc-bars">
      {rows.map(([k, v]) => (
        <div className="xc-bar" key={k}><span>{k}</span><u><b style={{ width: `${v}%` }} /></u><span>{v}%</span></div>
      ))}
    </div>
  );
}

function OfferSheet({ c, onClose, onSend }: { c: CreatorView; onClose: () => void; onSend: (body: SendRequestBody) => void }) {
  const [craft, setCraft] = useState('makeup');
  const [note, setNote]   = useState('');
  const [kind, setKind]   = useState<'Post' | 'Reel' | 'Story'>('Reel');
  const [count, setCount] = useState('2');
  const [from, setFrom]   = useState('');
  const [to, setTo]       = useState('');
  // The sheet hands UP a typed body; it never posts. One writer for the send, and
  // it is the screen that owns the list the new row lands in.
  const submit = () => onSend({
    offer_kind: craft,
    offer_note: note,
    ask_kind: kind.toLowerCase() as AskKind,
    ask_count: Number(count) || 1,
    date_from: from,
    date_to: to,
  });
  return (
    <Sheet title={EXCHANGE.sendReq} onClose={onClose}>
      <div className="wl-fld"><span className="wl-fl">{EXCHANGE.to}</span><div className="wl-fi">{c.business_name}{c.handle ? ' \u00B7 ' + c.handle : ''}</div></div>
      <div className="wl-fld">
        <span className="wl-fl">{EXCHANGE.offer}</span>
        <div className="xc-chips">{Object.keys(CAT_LABEL).map(t => (
          <button key={t} type="button" className={'xc-chip' + (craft === t ? ' on' : '')} aria-pressed={craft === t} onClick={() => setCraft(t)}>{labelFor(t)}</button>
        ))}</div>
        <textarea className="wl-fi xc-area" rows={2} value={note} maxLength={200} aria-label={EXCHANGE.offer} onChange={e => setNote(e.target.value.slice(0, 200))} />
      </div>
      <div className="wl-fld">
        <span className="wl-fl">{EXCHANGE.ask}</span>
        <div className="xc-two3">
          <div className="xc-chips">{EXCHANGE.askKinds.map(k => (
            <button key={k} type="button" className={'xc-chip' + (kind === k ? ' on' : '')} aria-pressed={kind === k} onClick={() => setKind(k)}>{k}</button>
          ))}</div>
          <input className="wl-fi wl-fnum" type="number" min={1} value={count} aria-label={EXCHANGE.ask} onChange={e => setCount(e.target.value)} />
        </div>
      </div>
      <div className="xc-two">
        <label className="wl-fld"><span className="wl-fl">{EXCHANGE.from}</span><input className="wl-fi" type="date" value={from} onChange={e => setFrom(e.target.value)} /></label>
        <label className="wl-fld"><span className="wl-fl">{EXCHANGE.until}</span><input className="wl-fi" type="date" value={to} onChange={e => setTo(e.target.value)} /></label>
      </div>
      <div className="wl-brow"><button type="button" className="wl-btn pri" onClick={submit}>{EXCHANGE.send}</button></div>
    </Sheet>
  );
}

// Tokens only. NO BACKTICKS IN THIS BLOCK — it is a template literal.
const XC_CSS = `
.xc-room{padding:0 var(--wl-gutter) 28px;display:flex;flex-direction:column}
.xc-banner{font:var(--wl-t3);color:var(--atelier-ink-soft);background:var(--atelier-section-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:12px 14px;margin:20px 0 16px}
.xc-filters{display:flex;gap:8px;margin-bottom:14px}
.xc-fi{flex:1;min-width:0;background:var(--atelier-input-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:9px 12px;font:var(--wl-t3);color:var(--atelier-ink);-webkit-appearance:none;appearance:none}
.xc-sec{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:18px 0 8px;display:flex;justify-content:space-between}
.xc-sec.xc-first{margin-top:0}
.xc-sub{font:var(--wl-t5);letter-spacing:.04em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:10px 0 6px}
.xc-card{display:block;width:100%;text-align:left;background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:13px 14px;margin-bottom:var(--wl-step);color:inherit}
.xc-tap{cursor:pointer}
.xc-tap:focus-visible,.xc-back:focus-visible,.xc-ghost:focus-visible,.xc-chip:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.xc-hd{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.xc-name{font:var(--wl-t3);color:var(--atelier-ink)}
.xc-meta{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:3px;font-variant-numeric:lining-nums tabular-nums}
.xc-badge{font:var(--wl-t5);letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;color:var(--atelier-accent-text)}
.xc-badge.pend{color:var(--atelier-ink-dim)}
.xc-fit{font:var(--wl-t5);color:var(--atelier-ink-soft);margin-top:8px;display:block}
.xc-line{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:3px}
.xc-state{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;color:var(--atelier-ink-mute)}
.xc-state.ok{color:var(--atelier-positive)}
.xc-state.no{color:var(--atelier-ink-dim)}
.xc-ghost{display:inline-flex;align-items:center;min-height:36px;padding:0 12px;margin-top:10px;background:transparent;border:.5px solid var(--atelier-card-border);border-radius:3px;font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);cursor:pointer}
.xc-back{align-self:flex-start;background:transparent;border:none;padding:14px 0 0;font:var(--wl-t4);color:var(--atelier-ink-mute);cursor:pointer}
.xc-bars{display:flex;flex-direction:column;gap:6px}
.xc-bar{display:grid;grid-template-columns:96px 1fr 40px;gap:8px;align-items:center;font:var(--wl-t5);color:var(--atelier-ink-soft)}
.xc-bar u{display:block;height:6px;background:var(--atelier-input-bg);border-radius:3px;overflow:hidden}
.xc-bar u b{display:block;height:100%;background:var(--atelier-accent-text)}
.xc-bar span:last-child{text-align:right;font-variant-numeric:lining-nums tabular-nums}
.xc-cta{margin-top:18px;display:flex}
.xc-none{font:var(--wl-t3);color:var(--atelier-ink-mute);margin:0}
.xc-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.xc-chip{font:var(--wl-t5);color:var(--atelier-ink-soft);background:transparent;border:.5px solid var(--atelier-card-border);border-radius:3px;padding:9px 10px;min-height:36px;cursor:pointer}
.xc-chip.on{color:var(--atelier-accent-text);border-color:var(--atelier-input-border)}
.xc-area{resize:none}
.xc-two3{display:grid;grid-template-columns:2fr 1fr;column-gap:10px;align-items:start}
.xc-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.xc-pad{padding:20px var(--wl-gutter)}
.xc-note{font:var(--wl-t3);color:var(--atelier-ink-soft);margin-top:8px;display:block}
.xc-acts{display:flex;gap:8px;margin-top:12px}
.xc-go,.xc-no{flex:1;min-height:40px;display:flex;align-items:center;justify-content:center;border-radius:3px;background:transparent;font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
.xc-go{border:.5px solid var(--atelier-input-border);color:var(--atelier-accent-text)}
.xc-no{border:.5px solid var(--atelier-card-border);color:var(--atelier-ink-mute)}
.xc-go:focus-visible,.xc-no:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
