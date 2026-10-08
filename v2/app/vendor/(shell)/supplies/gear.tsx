"use client";
// v2/app/vendor/(shell)/supplies/gear.tsx · CE-47 · PRO · P2 app · GEAR SHARING, inside Supplies.
// She lists kit she lends; vendors in her city ask for days; she accepts or declines. Until she accepts, each side
// sees only the other's business name and city; after, each sees the other's WhatsApp number, as a link (P2-F6).
// "Settle with <name> directly. TDW takes nothing." No payment link, no insurance line (P2-F5). Nothing goes on
// Calendar: a loan's days live here (P2-F4).
import { useCallback, useEffect, useState } from 'react';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { dayInWords } from '@/v2/lib/worklist/dayInWords';
import { istPlusDaysISO } from '@/lib/vendor/istDay';
import { fetchGear, listGear, withdrawGear, askGear, answerGear, waLink, type GearRoom, type GearItem, type GearRequest } from '@/v2/lib/vendor/api/gear';
import { errOf } from '@/v2/lib/vendor/api/papers';
import { SP_CSS } from './style';

type ShowFn = (msg: string, kind?: 'success' | 'error') => void;
// The chair's line on an accepted loan, both sides (7 October 2026; the founder may reword it).
export const DEPOSIT_LINE = 'Agree a deposit, and what happens if it is damaged or late, with each other before you hand it over.';
const STATE_WORD = { requested: 'Asked', accepted: 'Accepted', declined: 'Declined', cancelled: 'Cancelled' } as const;
const TONE = { requested: 'warn', accepted: 'ok', declined: 'plain', cancelled: 'plain' } as const;

export function GearView({ vendorId, city, onBack }: { vendorId: string; city: string; onBack: () => void }) {
  // No toast here: the shared toast sits at the middle of the screen and would cover a WhatsApp number or a button at
  // 374 wide (the chair's rule). What happened is said in one line under the view's heading instead.
  const [note, setNote] = useState<{ text: string; kind: 'success' | 'error' } | null>(null);
  const show = useCallback((text: string, kind: 'success' | 'error' = 'success') => setNote({ text, kind }), []);
  const [room, setRoom] = useState<GearRoom | null>(null);
  const [view, setView] = useState<{ v: 'room' } | { v: 'list' } | { v: 'ask'; item: GearItem }>({ v: 'room' });
  const load = useCallback(async () => { const r = await fetchGear(vendorId); if (r.ok) { const x = ((r as { room?: Partial<GearRoom> }).room || {}) as Partial<GearRoom>; const L = <T,>(v: T[] | undefined) => (Array.isArray(v) ? v : []); setRoom({ mine: L(x.mine), near: L(x.near), lent: L(x.lent), asked: L(x.asked) }); } else show(errOf(r), 'error'); }, [vendorId, show]);
  useEffect(() => { void load(); }, [load]);
  const answer = async (q: GearRequest, verb: 'accept' | 'decline' | 'cancel') => {
    const r = await answerGear(vendorId, q.id, verb);
    if (!r.ok) { show(errOf(r), 'error'); return; }
    show(verb === 'accept' ? 'Request accepted' : verb === 'decline' ? 'Request declined' : 'Cancelled', 'success'); void load();
  };
  const back = () => { setView({ v: 'room' }); void load(); };
  if (view.v === 'list') return <ListForm vendorId={vendorId} city={city} onBack={back} show={show} />;
  if (view.v === 'ask') return <AskForm vendorId={vendorId} item={view.item} onBack={back} show={show} />;
  const where = city || 'your city';
  return (<Body>
    <button type="button" className="sp-back" onClick={onBack}>{'‹'} Back to Supplies</button>
    <Head text="Gear" />
    {note ? <p className={`sp-status ${note.kind}`} role={note.kind === 'error' ? 'alert' : 'status'} data-sp-status="">{note.text}</p> : null}
    <p className="sp-lede">Lend kit to other TDW vendors in {where}, or borrow theirs. Money for a loan is settled between you; TDW takes nothing.</p>
    {room ? (<>
      <Head text="Asked of you" count={room.lent.length || undefined} />
      {room.lent.length ? room.lent.map((q) => <Loan key={q.id} q={q} onAnswer={answer} />) : <p className="sp-mute">No one has asked for your gear yet.</p>}
      <Head text="You asked" count={room.asked.length || undefined} />
      {room.asked.length ? room.asked.map((q) => <Loan key={q.id} q={q} onAnswer={answer} />) : <p className="sp-mute">You have not asked for any gear yet.</p>}
      <Head text={`Gear in ${where}`} count={room.near.length || undefined} />
      {room.near.length ? room.near.map((it) => (<div className="sp-card" key={it.id} data-gr-near={it.id}>
        <div className="sp-name">{it.item}</div>
        <div className="sp-txt">{it.owner ? it.owner.business_name : 'A TDW vendor'}{it.owner?.city ? `, ${it.owner.city}` : ''}</div>
        <div className="sp-mute">{it.price_line} · worth {it.value}</div>
        {it.note ? <div className="sp-mute">{it.note}</div> : null}
        <div className="sp-btns"><button type="button" className="sp-btn solid" data-gr-ask={it.id} onClick={() => setView({ v: 'ask', item: it })}>Ask for it</button></div>
      </div>)) : <p className="sp-mute">No gear is listed in {where} yet.</p>}
      <Head text="Your gear" count={room.mine.length || undefined} />
      {room.mine.length ? (<Group>{room.mine.map((it) => (<div key={it.id} data-gr-mine={it.id}><Row title={it.item} facts={`${it.price_line} · worth ${it.value} · ${it.city}`}
        pill={it.state === 'listed' ? { text: 'Listed', tone: 'ok' } : { text: 'Withdrawn', tone: 'plain' }} /></div>))}</Group>) : <p className="sp-mute">You have not listed any gear.</p>}
      <div className="sp-btns"><button type="button" className="sp-btn" data-gr-list="" onClick={() => setView({ v: 'list' })}>List an item</button>
        {room.mine.some((i) => i.state === 'listed') ? <WithdrawPicker vendorId={vendorId} items={room.mine.filter((i) => i.state === 'listed')} onDone={() => void load()} show={show} /> : null}</div>
    </>) : <p className="sp-mute">Loading…</p>}
    <p className="sp-lede" data-gr-nothing="">TDW takes nothing from a loan and holds no money. Days you lend stay here; nothing is added to your Calendar.</p>
    <style>{FR_CSS + SP_CSS + GR_CSS}</style>
  </Body>);
}

function Loan({ q, onAnswer }: { q: GearRequest; onAnswer: (q: GearRequest, verb: 'accept' | 'decline' | 'cancel') => void }) {
  const [sure, setSure] = useState(false);
  const owner = q.side === 'owner';
  return (<div className="sp-card" data-gr-loan={q.id} data-gr-state={q.state}>
    <div className="gr-top"><span className="sp-name">{q.item || 'Gear'}</span><span className={`fr-pill ${TONE[q.state]}`}>{STATE_WORD[q.state]}</span></div>
    <div className="sp-txt">{owner ? 'Asked by ' : 'Lent by '}{q.other.business_name}{q.other.city ? `, ${q.other.city}` : ''}</div>
    <div className="sp-mute">{q.dates} · {q.price_line}</div>
    {q.note ? <div className="sp-mute">{q.note}</div> : null}
    {q.state === 'accepted' && q.other.whatsapp ? (<>
      <div className="sp-field"><span>WhatsApp</span><a className="sp-link" data-gr-wa="" href={waLink(q.other.whatsapp)} target="_blank" rel="noopener noreferrer">{q.other.whatsapp}</a></div>
      {q.settle ? <div className="sp-txt" data-gr-settle="">{q.settle}</div> : null}
      <div className="sp-mute" data-gr-deposit="">{DEPOSIT_LINE}</div>
    </>) : null}
    {q.state === 'requested' && owner ? (<div className="sp-btns"><button type="button" className="sp-btn solid" data-gr-accept={q.id} onClick={() => onAnswer(q, 'accept')}>Accept</button>
      <button type="button" className="sp-btn" data-gr-decline={q.id} onClick={() => onAnswer(q, 'decline')}>Decline</button></div>) : null}
    {(q.state === 'requested' && !owner) || q.state === 'accepted' ? (sure
      ? (<div className="sp-btns"><button type="button" className="sp-btn" data-gr-cancel={q.id} onClick={() => onAnswer(q, 'cancel')}>{owner ? 'Cancel the loan' : 'Cancel the request'}</button></div>)
      : (<div className="sp-btns"><button type="button" className="sp-btn" onClick={() => setSure(true)}>Cancel</button></div>)) : null}
    {q.state === 'requested' && owner ? <div className="sp-mute">Their WhatsApp number shows once you accept.</div> : null}
    {q.state === 'requested' && !owner ? <div className="sp-mute">Their WhatsApp number shows once they accept.</div> : null}
  </div>);
}

function WithdrawPicker({ vendorId, items, onDone, show }: { vendorId: string; items: GearItem[]; onDone: () => void; show: ShowFn }) {
  const [open, setOpen] = useState(false);
  if (!open) return <button type="button" className="sp-btn" data-gr-withdraw-open="" onClick={() => setOpen(true)}>Withdraw an item</button>;
  return (<div className="gr-pick">{items.map((it) => (<button key={it.id} type="button" className="sp-btn" data-gr-withdraw={it.id}
    onClick={async () => { const r = await withdrawGear(vendorId, it.id); if (!r.ok) { show(errOf(r), 'error'); return; } show(`${it.item} withdrawn`, 'success'); setOpen(false); onDone(); }}>Withdraw {it.item}</button>))}</div>);
}

const whole = (s: string) => { const t = s.replace(/[,\s]/g, ''); return /^\d+$/.test(t) ? Number(t) : NaN; };

function ListForm({ vendorId, city, onBack, show }: { vendorId: string; city: string; onBack: () => void; show: ShowFn }) {
  const [item, setItem] = useState(''); const [worth, setWorth] = useState(''); const [price, setPrice] = useState(''); const [where, setWhere] = useState(city); const [note, setNote] = useState('');
  const [err, setErr] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  const save = async () => {
    const value_rs = whole(worth), price_per_day_rs = whole(price);
    if (Number.isNaN(value_rs) || Number.isNaN(price_per_day_rs)) { setErr('Type rupees in whole numbers.'); return; }
    setBusy(true); const r = await listGear(vendorId, { item: item.trim(), value_rs, price_per_day_rs, city: where.trim(), note: note.trim() || undefined }); setBusy(false);
    if (!r.ok) { setErr(errOf(r)); return; }
    show('Item listed', 'success'); onBack();
  };
  return (<Body>
    <button type="button" className="sp-back" onClick={onBack}>{'‹'} Back to Gear</button>
    <Head text="List an item to lend" />
    <div className="sp-card" data-gr-listform="">
      <div><div className="sp-label">Item</div><input className="sp-in" data-gr-item="" value={item} onChange={(e) => setItem(e.target.value)} placeholder="Sony 85mm f/1.4 GM lens" /></div>
      <div><div className="sp-label">What it is worth (Rs)</div><input className="sp-in" data-gr-worth="" inputMode="numeric" value={worth} onChange={(e) => setWorth(e.target.value)} placeholder="1,40,000" /></div>
      <div><div className="sp-label">Price per day (Rs)</div><input className="sp-in" data-gr-price="" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1,500" /><p className="sp-dw">Type 0 to lend it free.</p></div>
      <div><div className="sp-label">City</div><input className="sp-in" data-gr-city="" value={where} onChange={(e) => setWhere(e.target.value)} /></div>
      <div><div className="sp-label">Note (optional)</div><input className="sp-in" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Pick up from Lajpat Nagar. Comes with its case." /></div>
      {err ? <p className="bl-err" role="alert">{err}</p> : null}
      <div className="sp-btns"><button type="button" className="sp-btn solid" data-gr-save="" disabled={busy} onClick={save}>{busy ? 'Listing…' : 'List it'}</button></div>
      <p className="sp-mute">Vendors in {where || 'your city'} see the item, your business name and city. Your number shows only to a vendor whose request you accept.</p>
    </div>
    <style>{FR_CSS + SP_CSS + GR_CSS}</style>
  </Body>);
}

function AskForm({ vendorId, item, onBack, show }: { vendorId: string; item: GearItem; onBack: () => void; show: ShowFn }) {
  const [from, setFrom] = useState(istPlusDaysISO(7)); const [to, setTo] = useState(istPlusDaysISO(7)); const [note, setNote] = useState('');
  const [err, setErr] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  const send = async () => {
    setBusy(true); const r = await askGear(vendorId, item.id, { date_from: from, date_to: to, note: note.trim() || undefined }); setBusy(false);
    if (!r.ok) { setErr(errOf(r)); return; }
    show('Request sent', 'success'); onBack();
  };
  return (<Body>
    <button type="button" className="sp-back" onClick={onBack}>{'‹'} Back to Gear</button>
    <Head text={`Ask for ${item.item}`} />
    <div className="sp-card" data-gr-askform={item.id}>
      <div className="sp-txt">{item.owner ? item.owner.business_name : 'A TDW vendor'}{item.owner?.city ? `, ${item.owner.city}` : ''} · {item.price_line}</div>
      <div><div className="sp-label">First day</div><input className="sp-in" type="date" data-gr-from="" value={from} onChange={(e) => setFrom(e.target.value)} />{from ? <p className="sp-dw">{dayInWords(from)}</p> : null}</div>
      <div><div className="sp-label">Last day</div><input className="sp-in" type="date" data-gr-to="" value={to} onChange={(e) => setTo(e.target.value)} />{to ? <p className="sp-dw">{dayInWords(to)}</p> : null}</div>
      <div><div className="sp-label">Note (optional)</div><input className="sp-in" value={note} onChange={(e) => setNote(e.target.value)} placeholder="For a wedding shoot in Gurugram." /></div>
      {err ? <p className="bl-err" role="alert">{err}</p> : null}
      <div className="sp-btns"><button type="button" className="sp-btn solid" data-gr-send="" disabled={busy} onClick={send}>{busy ? 'Sending…' : 'Send request'}</button></div>
      <p className="sp-mute">The owner sees your business name and city. Your WhatsApp numbers are shared with each other only if the owner accepts.</p>
    </div>
    <style>{FR_CSS + SP_CSS + GR_CSS}</style>
  </Body>);
}

const GR_CSS = `
.gr-top{display:flex;justify-content:space-between;align-items:center;gap:10px}
.gr-pick{display:flex;flex-direction:column;gap:8px;width:100%}
.bl-err{margin:0;font:var(--wl-t4);color:var(--role-critical)}
`;
