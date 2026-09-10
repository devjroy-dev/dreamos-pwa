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
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { WlToast } from '@/components/worklist/WlToast';
import { useToast } from '@/hooks/vendor/useToast';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Sheet, SHEET_CSS } from '@/components/worklist/StudioSheets';
import { COPY } from '@/lib/solutions/copy';
import { EXCHANGE, fitLine, requestLine, subLine } from '@/lib/worklist/exchange';
import { EXCHANGE_INFLUENCERS, EXCHANGE_REQUESTS, type ExchangeInfluencer } from '@/lib/mocks/exchange';
import { CITIES } from '@/lib/vendor/cityMatch';
import { labelFor, CAT_LABEL } from '@/lib/frost/categoryLabels';
import { fmtDate } from '@/lib/vendor/collabFormat';

export default function ExchangePage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <ExchangeScreen />;
}

function ExchangeScreen() {
  const { toast, show } = useToast();
  const soon = () => show(COPY.launchingSoon);
  const [city, setCity]   = useState<string>('Delhi NCR');
  const [craft, setCraft] = useState<string>('');
  const [open, setOpen]   = useState<ExchangeInfluencer | null>(null);
  const [offering, setOffering] = useState(false);

  // S2(b): audience-city match to the filter first, then engagement. The follower
  // count never enters this comparator.
  const list = useMemo(() => {
    const pct = (i: ExchangeInfluencer) => i.audience.cities.find(c => c.city === city)?.pct ?? 0;
    return [...EXCHANGE_INFLUENCERS]
      .filter(i => !craft || i.craft === craft)
      .sort((a, b) => pct(b) - pct(a) || b.engagement_pct - a.engagement_pct);
  }, [city, craft]);
  const byId = (id: string) => EXCHANGE_INFLUENCERS.find(i => i.id === id);

  return (
    <WorklistShell title={EXCHANGE.rowLabel}>
      <div className="xc-room">
        {open ? (
          <>
            <button type="button" className="xc-back" onClick={() => setOpen(null)}>{EXCHANGE.back}</button>
            <Card i={open} fitCity={city} />
            <div className="xc-sec">{EXCHANGE.audience}</div>
            <div className="xc-sub">{EXCHANGE.byCity}</div>
            <Bars rows={open.audience.cities.map(c => [c.city, c.pct])} />
            <div className="xc-sub">{EXCHANGE.byAge}</div>
            <Bars rows={open.audience.age.map(a => [a.band, a.pct])} />
            <div className="xc-sub">{EXCHANGE.byGender}</div>
            <Bars rows={open.audience.gender.map(g => [g.k, g.pct])} />
            <div className="xc-sec">{EXCHANGE.engagement}</div>
            <span className="xc-name">{open.engagement_pct}%</span>
            <div className="xc-sec">{EXCHANGE.posts}</div>
            <div className="xc-posts">{open.posts.map(p => <div key={p.id} className="xc-post">{p.kind}</div>)}</div>
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
            {list.length === 0 ? <p className="xc-none">{EXCHANGE.emptyList}</p>
              : list.map(i => <Card key={i.id} i={i} fitCity={city} onOpen={() => setOpen(i)} />)}

            <div className="xc-sec">{EXCHANGE.headMine}{EXCHANGE_REQUESTS.length ? <span>{EXCHANGE_REQUESTS.length}</span> : null}</div>
            {EXCHANGE_REQUESTS.length === 0 ? <p className="xc-none">{EXCHANGE.emptyMine}</p>
              : EXCHANGE_REQUESTS.map(r => (
                <div className="xc-card" key={r.id}>
                  <div className="xc-hd">
                    <span>
                      <span className="xc-name">{byId(r.influencer_id)?.name ?? '\u2014'}</span>
                      <span className="xc-line">{requestLine(labelFor(r.offer.craft), r.ask.count, r.ask.kind)} {'\u00B7'} {fmtDate(r.dates.from)} {'\u2013'} {fmtDate(r.dates.to)}</span>
                    </span>
                    <span className={'xc-state' + (r.state === 'accepted' ? ' ok' : r.state === 'sent' ? '' : ' no')}>{EXCHANGE.states[r.state]}</span>
                  </div>
                  {r.state === 'sent'     ? <button type="button" className="xc-ghost" onClick={soon}>{EXCHANGE.withdraw}</button> : null}
                  {r.state === 'accepted' ? <button type="button" className="xc-ghost" onClick={soon}>{EXCHANGE.complete}</button> : null}
                </div>
              ))}
          </>
        )}
      </div>

      {offering && open ? <OfferSheet i={open} onClose={() => setOffering(false)} onSend={() => { setOffering(false); soon(); }} /> : null}
      <WlToast toast={toast} />
      <style>{SHEET_CSS + XC_CSS}</style>
    </WorklistShell>
  );
}

function Card({ i, fitCity, onOpen }: { i: ExchangeInfluencer; fitCity: string; onOpen?: () => void }) {
  const pct = i.audience.cities.find(c => c.city === fitCity)?.pct ?? 0;
  const body = (
    <>
      <div className="xc-hd">
        <span><span className="xc-name">{i.name}</span><span className="xc-meta">{subLine(i.handle, i.city, i.followers)}</span></span>
        <span className={'xc-badge' + (i.verified ? '' : ' pend')}>{i.verified ? EXCHANGE.badgeOn : EXCHANGE.badgeOff}</span>
      </div>
      {onOpen ? <span className="xc-fit">{fitLine(pct, fitCity)} {'\u00B7'} {i.engagement_pct}% {EXCHANGE.engagement.toLowerCase()}</span> : null}
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

function OfferSheet({ i, onClose, onSend }: { i: ExchangeInfluencer; onClose: () => void; onSend: () => void }) {
  const [craft, setCraft] = useState('makeup');
  const [note, setNote]   = useState('');
  const [kind, setKind]   = useState<'Post' | 'Reel' | 'Story'>('Reel');
  const [count, setCount] = useState('2');
  const [from, setFrom]   = useState('');
  const [to, setTo]       = useState('');
  return (
    <Sheet title={EXCHANGE.sendReq} onClose={onClose}>
      <div className="wl-fld"><span className="wl-fl">{EXCHANGE.to}</span><div className="wl-fi">{i.name} {'\u00B7'} {i.handle}</div></div>
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
      <div className="wl-brow"><button type="button" className="wl-btn pri" onClick={onSend}>{EXCHANGE.send}</button></div>
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
.xc-posts{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.xc-post{aspect-ratio:1.4;background:var(--atelier-section-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;display:flex;align-items:flex-end;padding:6px;font:var(--wl-t5);color:var(--atelier-ink-fade)}
.xc-cta{margin-top:18px;display:flex}
.xc-none{font:var(--wl-t3);color:var(--atelier-ink-mute);margin:0}
.xc-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.xc-chip{font:var(--wl-t5);color:var(--atelier-ink-soft);background:transparent;border:.5px solid var(--atelier-card-border);border-radius:3px;padding:9px 10px;min-height:36px;cursor:pointer}
.xc-chip.on{color:var(--atelier-accent-text);border-color:var(--atelier-input-border)}
.xc-area{resize:none}
.xc-two3{display:grid;grid-template-columns:2fr 1fr;column-gap:10px;align-items:start}
.xc-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
`;
