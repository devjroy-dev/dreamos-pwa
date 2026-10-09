'use client';
// v2/app/vendor/(shell)/off-season-shop/page.tsx · CE-47 · OFF-A2 · THE OFF-SEASON SHOP ROOM (Business Solutions, Get paid).
// The approved pictures (TDW_CE47_OFF_PICTURES 2 to 5, both themes): Items · Orders · Vouchers on the room's rail, "+ New item"
// in the room head, an Asked order opening its sheet with Mark paid, a code checked and redeemed once. Built only from the
// new layout's own pieces (WorklistShell, RoomRows, RoomHeadAdd, Sheet, FilterRail) and its tokens; no colour of its own.
// The doors are OFF-A1's (dream-os). While flag.off_shop is shut the room says Coming soon and asks nothing else.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { RoomHeadAdd } from '@/v2/components/worklist/PageHelp';
import { Sheet, SHEET_CSS } from '@/v2/components/worklist/StudioSheets';
import { FilterRail } from '@/v2/components/vendor/slices/FilterRail';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { fetchPortfolio } from '@/lib/vendor/api/vendor';
import { W, shopApi, itemBody, dateWords, type Item, type Order, type Kind } from '@/v2/lib/shop/shop';
import { RoomBody } from '@/components/worklist/RoomBody';   // C29 (CE-47 option a): the one home of the slice inset, as the sibling rooms

const CSS = `.pr2-swrow{min-height:56px}.pr2-line{margin:0;padding:0 16px 12px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.wl button.pr2-sw[data-tap44]{position:relative;width:52px;height:32px!important;min-height:0!important;border-radius:999px;border:1px solid var(--atelier-card-border);background:var(--atelier-card-bg);padding:0}
.pr2-sw span{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:var(--atelier-ink-mute);transition:left .15s}
.wl button.pr2-sw.on[data-tap44]{background:var(--role-primary);border-color:var(--role-primary)}.pr2-sw.on span{left:23px;background:var(--role-on-primary)}
.pr2-sw::after{content:'';position:absolute;inset:-6px -4px}.pr2-sw:disabled{opacity:.5}
.os-thumb{width:44px;height:44px;border-radius:8px;object-fit:cover;display:block;background:var(--atelier-card-border)}
.os-rail{margin:0 0 4px}
.os-card{border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);padding:16px;display:flex;flex-direction:column;gap:8px}
.os-big{font:var(--wl-t2);color:var(--atelier-ink);margin:0}.os-line{font:var(--wl-t4);color:var(--atelier-ink-mute);margin:0}
.os-err{font:var(--wl-t4);color:var(--role-danger, var(--atelier-ink));margin:0}
.os-brow{display:flex;gap:8px;margin-top:4px;flex-wrap:wrap}.os-brow>*{flex:1 1 auto}
.os-kinds{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.os-kind{border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);padding:14px 12px;text-align:left;color:var(--atelier-ink);font:var(--wl-tb);display:flex;flex-direction:column;gap:4px}
.os-kind[aria-pressed=true]{border-color:var(--atelier-accent-text)}
.os-kind small{font:var(--wl-t5);color:var(--atelier-ink-mute);letter-spacing:0;text-transform:none}
.os-code{display:flex;gap:8px}.os-code .wl-fi{text-transform:uppercase;letter-spacing:.12em}
.os-pics{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.os-pics button{padding:0;border:2px solid transparent;border-radius:8px;background:none;aspect-ratio:1}
.os-pics button[aria-pressed=true]{border-color:var(--atelier-accent-text)}.os-pics img{width:100%;height:100%;object-fit:cover;border-radius:6px;display:block}
.os-pick{display:flex;gap:12px;align-items:center}.os-pick img{width:64px;height:64px;border-radius:8px;object-fit:cover}
.os-inc{display:flex;gap:8px}.os-chk{display:flex;gap:10px;align-items:center;font:var(--wl-t3);color:var(--atelier-ink)}`;

function Sw({ on, label, onTap, disabled }: { on: boolean; label: string; onTap: () => void; disabled?: boolean }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} data-tap44="" disabled={disabled} className={`pr2-sw${on ? ' on' : ''}`} onClick={onTap}><span /></button>;
}
const Thumb = ({ src }: { src: string | null }) => (src ? <img className="os-thumb" src={src} alt="" /> : <span className="os-thumb" />);
const todayIst = () => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);

export default function OffSeasonShopPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <ShopRoom vendorId={session.id} studio={session.name || ''} />;
}

type Tab = 'items' | 'orders' | 'vouchers';
function ShopRoom({ vendorId, studio }: { vendorId: string; studio: string }) {
  const [tab, setTab] = useState<Tab>('items');
  const [state, setState] = useState<{ open: boolean; items: Item[]; orders: Order[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [edit, setEdit] = useState<Partial<Item> | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const load = useCallback(async () => {
    const r = await shopApi.room();
    if (!r.ok) { setErr(W.readFail); return; }
    setErr(null); setState({ open: r.open === true, items: r.items || [], orders: r.orders || [] });
  }, []);
  useEffect(() => { void load(); }, [load]);
  const vouchers = useMemo(() => (state?.orders || []).filter((o) => o.voucher), [state]);
  const anyShown = (state?.items || []).some((i) => i.shown);
  const [bulk, setBulk] = useState(false);
  async function toggleAll() {
    if (!state) return; setBulk(true);
    const to = !anyShown;
    for (const i of state.items) if (i.shown !== to) await shopApi.update(i.id, itemBody({ ...i, shown: to }));
    setBulk(false); await load();
  }
  // Until the room's read answers, nothing she can tap is drawn: no "+ New item", no rail reading "Items · 0". Whether the
  // shop is open or shut is not known yet, and a control drawn now could be gone a moment later (b232 found this under load).
  if (!state && !err) return (<WorklistShell title={W.title}><RoomBody><Body><div aria-busy="true" style={{ minHeight: 120 }} /></Body></RoomBody><style>{FR_CSS}</style></WorklistShell>);
  if (state && !state.open) {
    return (<WorklistShell title={W.title}><RoomBody><Body><Group><Row title={W.soonTitle} facts={W.soonLine} pill={{ text: W.soon, tone: 'soon' }} /></Group></Body></RoomBody><style>{FR_CSS}</style><style>{CSS}</style></WorklistShell>);
  }
  const chips = [{ key: 'items', label: W.tabs.items, count: state?.items.length ?? 0 }, { key: 'orders', label: W.tabs.orders, count: state?.orders.length ?? 0 }, { key: 'vouchers', label: W.tabs.vouchers, count: vouchers.length }];
  const asked = (state?.orders || []).filter((o) => o.state === 'asked'); const paid = (state?.orders || []).filter((o) => o.state === 'paid'); const cancelled = (state?.orders || []).filter((o) => o.state === 'cancelled');
  const orderRow = (o: Order) => <Row key={o.id} title={o.buyer_name} value={o.amount_words}
    facts={[o.item_name, o.qty > 1 ? W.seats(o.qty) : null, o.wanted_date ? dateWords(o.wanted_date) : null, o.voucher ? W.codeIs(o.voucher.code) : null, o.state === 'asked' ? o.buyer_phone : dateWords(o.paid_at || o.created_at)].filter(Boolean).join(' · ')}
    pill={o.state === 'asked' ? { text: W.asked, tone: 'warn' } : o.state === 'paid' ? { text: W.paid, tone: 'ok' } : { text: W.cancelled, tone: 'plain' }} chevron onClick={() => setOrder(o)} />;
  return (
    <WorklistShell title={W.title}><RoomBody>
      <RoomHeadAdd addKey="off-season-shop" label={W.add} onAdd={() => setEdit({ kind: 'voucher', valid_months: 12, includes: [], shown: true })} />
      <Body>
        <div className="os-rail"><FilterRail slice="leads" chips={chips} active={tab} onSelect={(k: string | null) => { if (k) setTab(k as Tab); }}   /* the rail clears on a second tap; a room's tabs never go blank */ /></div>
        {err ? <p className="os-err" role="alert">{err}</p> : null}
        {state && tab === 'items' ? (<>
          {state.items.length ? <Group>{state.items.map((i) => <Row key={i.id} icon={<Thumb src={i.photo_url} />} title={i.name} value={i.price_words} facts={i.facts}
            pill={i.shown ? undefined : { text: W.hidden, tone: "soon" }} chevron onClick={() => setEdit(i)} />)}</Group> : <p className="fr-lede">{W.emptyItems}</p>}
          {state.items.length ? (<><Head text={W.onWebsite} /><Group><div>
            <div className="fr-row pr2-swrow"><span className="fr-t">{W.showShop}</span><span className="fr-aside"><Sw on={anyShown} label={W.showShop} onTap={toggleAll} disabled={bulk} /></span></div>
            <p className="pr2-line">{anyShown ? W.showLine : W.hiddenLine}</p></div></Group></>) : null}
        </>) : null}
        {state && tab === 'orders' ? (<>
          {asked.length ? (<><Head text={W.asked} count={asked.length} /><Group>{asked.map(orderRow)}</Group></>) : null}
          {paid.length ? (<><Head text={W.paid} count={paid.length} /><Group>{paid.map(orderRow)}</Group></>) : null}
          {cancelled.length ? (<><Head text={W.cancelled} count={cancelled.length} /><Group>{cancelled.map(orderRow)}</Group></>) : null}
          {!state.orders.length ? <p className="fr-lede">{W.emptyOrders}</p> : null}
          <Head text={W.linksHead} /><Group><Row title={W.linksTitle} facts={W.linksLine} pill={{ text: W.soon, tone: 'soon' }} /></Group>
        </>) : null}
        {state && tab === 'vouchers' ? <Vouchers orders={vouchers} reload={load} /> : null}
      </Body></RoomBody>
      {edit ? <ItemSheet vendorId={vendorId} item={edit} onClose={() => setEdit(null)} onSaved={async () => { setEdit(null); await load(); }} /> : null}
      {order ? <OrderSheet studio={studio} item={(state?.items || []).find((x) => x.id === order.item_id) || null} order={order} onClose={() => setOrder(null)} onDone={async () => { await load(); }} /> : null}
      <style>{FR_CSS}</style><style>{SHEET_CSS}</style><style>{CSS}</style>
    </WorklistShell>
  );
}

function Vouchers({ orders, reload }: { orders: Order[]; reload: () => Promise<void> }) {
  const [code, setCode] = useState(''); const [res, setRes] = useState<{ code: string; item_name: string | null; line: string; state: string } | null>(null);
  const [msg, setMsg] = useState<string | null>(null); const [ask, setAsk] = useState(false); const [note, setNote] = useState(''); const [busy, setBusy] = useState(false);
  const today = todayIst();
  async function check() { setBusy(true); setMsg(null); setAsk(false); const r = await shopApi.check(code); setBusy(false); if (r.ok && r.voucher) setRes(r.voucher); else { setRes(null); setMsg(r.error || W.failed); } }
  async function redeem() { if (!res) return; setBusy(true); const r = await shopApi.redeem(res.code, note); setBusy(false); setAsk(false); if (r.ok) { setRes({ ...res, state: 'redeemed' }); await reload(); } else setMsg(r.error || W.failed); }
  const open = orders.filter((o) => o.voucher && !o.voucher.redeemed_at); const used = orders.filter((o) => o.voucher && o.voucher.redeemed_at);
  return (<>
    <div className="os-card">
      <label className="wl-fld"><span className="wl-fl">{W.check}</span>
        <div className="os-code"><input className="wl-fi" value={code} onChange={(e) => setCode(e.target.value)} autoCapitalize="characters" inputMode="text" aria-label={W.check} />
          <button type="button" className="wl-btn pri" style={{ flex: 'none', padding: '0 16px' }} disabled={busy || !code.trim()} onClick={check}>{W.checkBtn}</button></div></label>
      {msg ? <p className="os-err" role="alert">{msg}</p> : null}
      {res ? (<><p className="os-big">{res.item_name}</p><p className="os-line">{res.line}</p>
        {res.state === 'valid' ? (ask ? (<><p className="os-line">{W.redeemAsk}</p>
          <label className="wl-fld"><span className="wl-fl">{W.redeemNote}</span><input className="wl-fi" value={note} maxLength={120} onChange={(e) => setNote(e.target.value)} /></label>
          <div className="os-brow"><button type="button" className="wl-btn gho" onClick={() => setAsk(false)}>{W.cancel}</button><button type="button" className="wl-btn pri" disabled={busy} onClick={redeem}>{W.redeemYes}</button></div></>)
          : <div className="os-brow"><button type="button" className="wl-btn pri" onClick={() => setAsk(true)}>{W.redeem}</button></div>)
          : <p className="os-line">{res.state === 'redeemed' ? W.redeemed : W.expired}</p>}</>) : null}
    </div>
    {!orders.length ? <p className="fr-lede">{W.emptyVouchers}</p> : null}
    {open.length ? (<><Head text={W.notUsed} count={open.length} /><Group>{open.map((o) => { const v = o.voucher!; const ended = v.valid_until < today;
      return <Row key={o.id} title={v.code} facts={`${o.item_name || ''} · ${o.buyer_name} · Valid until ${dateWords(v.valid_until)}`} pill={ended ? { text: W.expired, tone: 'plain' } : { text: W.valid, tone: 'ok' }} />; })}</Group></>) : null}
    {used.length ? (<><Head text={W.usedHead} count={used.length} /><Group>{used.map((o) => <Row key={o.id} title={o.voucher!.code} facts={`${o.item_name || ''} · ${o.buyer_name} · Redeemed ${dateWords(o.voucher!.redeemed_at)}`} pill={{ text: W.redeemed, tone: 'plain' }} />)}</Group></>) : null}
  </>);
}
function OrderSheet({ order, studio, item, onClose, onDone }: { order: Order; studio: string; item: Item | null; onClose: () => void; onDone: () => Promise<void> }) {
  const [ask, setAsk] = useState<'paid' | 'cancel' | null>(null); const [busy, setBusy] = useState(false); const [line, setLine] = useState<string | null>(null); const [o, setO] = useState(order);
  async function go(which: 'paid' | 'cancel') {
    setBusy(true); const r = which === 'paid' ? await shopApi.paid(o.id) : await shopApi.cancel(o.id); setBusy(false); setAsk(null);
    if (!r.ok) { setLine(r.error || W.failed); return; }
    const v = (r as { voucher?: Order['voucher'] }).voucher || null; const cl = (r as { calendar_line?: string | null }).calendar_line || null;
    setO({ ...o, state: which === 'paid' ? 'paid' : 'cancelled', voucher: v || o.voucher }); setLine(cl || (v ? W.codeIs(v.code) : null)); await onDone();
  }
  const wa = `https://wa.me/${o.buyer_phone.replace(/^\+/, '')}`;
  // G1: a paid voucher's code goes to the buyer in one tap (her WhatsApp opens with the words written); an online class or
  // online workshop's link the same way (R1 later: Google Meet with calendar sync).
  const online = !!item && (item.kind === 'class' || (item.kind === 'workshop' && item.online));
  const text = o.state !== 'paid' ? null
    : o.voucher ? W.codeMessage(o.buyer_name, o.item_name || '', studio, o.voucher.code, dateWords(o.voucher.valid_until))
    : online && item && item.class_link ? W.classMessage(o.buyer_name, o.item_name || '', studio, item.class_link) : null;
  const noLink = o.state === 'paid' && online && !(item && item.class_link);
  return (<Sheet title={W.orderTitle} onClose={onClose}>
    <p className="os-big">{o.buyer_name}</p>
    <p className="os-line">{[o.item_name, o.qty > 1 ? W.seats(o.qty) : null, o.wanted_date ? dateWords(o.wanted_date) : null, o.amount_words].filter(Boolean).join(' · ')}</p>
    <p className="os-line">{o.buyer_phone}</p>
    {line ? <p className="os-line" role="status">{line}</p> : null}
    <div className="os-brow"><a className="wl-btn gho" href={`tel:${o.buyer_phone}`}>{W.call}</a><a className="wl-btn gho" href={wa} target="_blank" rel="noopener noreferrer">{W.whatsapp}</a></div>
    {text ? <div className="os-brow"><a className="wl-btn pri" href={`${wa}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">{o.voucher ? W.sendCode : W.sendClassLinkReady}</a></div> : null}
    {noLink ? (<><p className="os-line">{W.noClassLink}</p><div className="os-brow"><a className="wl-btn pri" href={wa} target="_blank" rel="noopener noreferrer">{W.sendClassLink}</a></div></>) : null}
    {o.state === 'asked' ? (ask ? (<><p className="os-line">{ask === 'paid' ? W.markPaidAsk : W.cancelOrder + '?'}</p>
      <div className="wl-brow"><button type="button" className="wl-btn gho" onClick={() => setAsk(null)}>{W.cancel}</button><button type="button" className="wl-btn pri" disabled={busy} onClick={() => go(ask)}>{ask === 'paid' ? W.markPaidYes : W.cancelOrder}</button></div></>)
      : <div className="wl-brow"><button type="button" className="wl-btn gho" onClick={() => setAsk('cancel')}>{W.cancelOrder}</button><button type="button" className="wl-btn pri" onClick={() => setAsk('paid')}>{W.markPaid}</button></div>) : null}
  </Sheet>);
}

function ItemSheet({ vendorId, item, onClose, onSaved }: { vendorId: string; item: Partial<Item>; onClose: () => void; onSaved: () => Promise<void> }) {
  const [i, setI] = useState<Partial<Item>>(item); const isNew = !item.id;
  const [err, setErr] = useState<{ field?: string; error: string } | null>(null); const [busy, setBusy] = useState(false); const [ask, setAsk] = useState(false);
  const [pics, setPics] = useState<string[] | null>(null); const [picking, setPicking] = useState(false);
  const set = (p: Partial<Item>) => setI((x) => ({ ...x, ...p }));
  const startLocal = i.starts_at ? new Date(Date.parse(i.starts_at) + 330 * 60000).toISOString().slice(0, 16) : '';
  async function openPics() { setPicking(true); if (pics) return; const r = await fetchPortfolio(vendorId, 'approved'); const imgs = (r as { images?: { image_url: string }[] }).images || []; setPics(imgs.map((x) => x.image_url).filter((u) => /^https:\/\//.test(u))); }
  async function save() {
    setBusy(true); setErr(null);
    const r = isNew ? await shopApi.create(itemBody(i)) : await shopApi.update(i.id as string, itemBody(i)); setBusy(false);
    if (r.ok) await onSaved(); else setErr({ field: r.field, error: r.error || W.failed });
  }
  async function remove() { setBusy(true); const r = await shopApi.remove(i.id as string); setBusy(false); if (r.ok) await onSaved(); else setErr({ error: r.error || W.failed }); }
  const errFor = (f: string) => (err && err.field === f ? <p className="os-err" role="alert">{err.error}</p> : null);
  const kinds: Kind[] = ['voucher', 'workshop', 'class', 'booking'];
  const inc = i.includes || [];
  return (<Sheet title={isNew ? W.add : (i.name || W.title)} onClose={onClose}>
    {isNew ? (<><span className="wl-fl">{W.kindAsk}</span><div className="os-kinds">{kinds.map((k) => <button key={k} type="button" className="os-kind" aria-pressed={i.kind === k}
      onClick={() => set({ kind: k, valid_months: k === 'voucher' ? (i.valid_months || 12) : i.valid_months, occasion: k === 'booking' ? (i.occasion || 'engagement') : i.occasion })}>{W.kinds[k][0]}<small>{W.kinds[k][1]}</small></button>)}</div>{errFor('kind')}</>) : null}
    <label className="wl-fld"><span className="wl-fl">{W.f.name}</span><input className="wl-fi" value={i.name || ''} maxLength={60} onChange={(e) => set({ name: e.target.value })} /></label>{errFor('name')}
    <label className="wl-fld"><span className="wl-fl">{W.f.price}</span><input className="wl-fi wl-fnum" inputMode="numeric" value={i.price ? String(i.price) : ''} onChange={(e) => set({ price: Number(e.target.value.replace(/[^0-9]/g, '')) || 0 })} /></label>{errFor('price')}
    {i.kind === 'voucher' ? (<>
      <label className="wl-fld"><span className="wl-fl">{W.f.voucherFor}</span><input className="wl-fi" value={i.voucher_for || ''} maxLength={60} onChange={(e) => set({ voucher_for: e.target.value })} /></label>{errFor('voucher_for')}
      <label className="wl-fld"><span className="wl-fl">{W.f.validMonths}</span><input className="wl-fi wl-fnum" inputMode="numeric" value={i.valid_months ? String(i.valid_months) : ''} onChange={(e) => set({ valid_months: Number(e.target.value.replace(/[^0-9]/g, '')) || null })} /></label>{errFor('valid_months')}
    </>) : null}
    {i.kind === 'workshop' ? (<>
      <label className="wl-fld"><span className="wl-fl">{W.f.startsAt}</span><input className="wl-fi" type="datetime-local" value={startLocal} onChange={(e) => set({ starts_at: e.target.value ? new Date(Date.parse(`${e.target.value}:00+05:30`)).toISOString() : null })} /></label>{errFor('starts_at')}
      <label className="os-chk"><input type="checkbox" checked={i.online === true} onChange={(e) => set({ online: e.target.checked })} />{W.f.online}</label>
      {!i.online ? <label className="wl-fld"><span className="wl-fl">{W.f.place}</span><input className="wl-fi" value={i.place || ''} maxLength={80} onChange={(e) => set({ place: e.target.value })} /></label> : null}{errFor('place')}
      <label className="wl-fld"><span className="wl-fl">{W.f.seats}</span><input className="wl-fi wl-fnum" inputMode="numeric" value={i.seats_total ? String(i.seats_total) : ''} onChange={(e) => set({ seats_total: Number(e.target.value.replace(/[^0-9]/g, '')) || null })} /></label>{errFor('seats_total')}
    </>) : null}
    {i.kind === 'class' ? (<>
      <span className="wl-fl">{W.f.classDates}</span>
      {(i.class_dates || []).map((d, n) => <div className="os-inc" key={n}><input className="wl-fi" type="date" min={todayIst()} value={d} onChange={(e) => set({ class_dates: (i.class_dates || []).map((x, m) => (m === n ? e.target.value : x)).filter(Boolean) })} /></div>)}
      {(i.class_dates || []).length < 12 ? <button type="button" className="wl-btn gho" onClick={() => set({ class_dates: [...(i.class_dates || []), todayIst()] })}>{W.f.addDate}</button> : null}{errFor('class_dates')}
    </>) : null}
    {i.kind === 'booking' ? (<>
      <label className="wl-fld"><span className="wl-fl">{W.f.occasion}</span><select className="wl-fi" value={i.occasion || 'engagement'} onChange={(e) => set({ occasion: e.target.value as Item['occasion'] })}>{Object.entries(W.occasions).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>{errFor('occasion')}
      <label className="wl-fld"><span className="wl-fl">{W.f.hours}</span><input className="wl-fi wl-fnum" inputMode="numeric" value={i.hours ? String(i.hours) : ''} onChange={(e) => set({ hours: Number(e.target.value.replace(/[^0-9]/g, '')) || null })} /></label>{errFor('hours')}
      <label className="wl-fld"><span className="wl-fl">{W.f.leadDays}</span><input className="wl-fi wl-fnum" inputMode="numeric" value={String(i.lead_days ?? 0)} onChange={(e) => set({ lead_days: Number(e.target.value.replace(/[^0-9]/g, '')) || 0 })} /></label>{errFor('lead_days')}
    </>) : null}
    {i.kind === 'class' || (i.kind === 'workshop' && i.online) ? (<>
      <label className="wl-fld"><span className="wl-fl">{W.classLinkField}</span><input className="wl-fi" type="url" inputMode="url" value={i.class_link || ''} maxLength={508} onChange={(e) => set({ class_link: e.target.value })} /></label>
      <p className="os-line">{W.classLinkLine}</p>{errFor('class_link')}
      <Group><Row title={W.meetTitle} facts={W.meetLine} pill={{ text: W.soon, tone: 'soon' }} /></Group>
    </>) : null}
    <span className="wl-fl">{W.f.includes}</span>
    {inc.map((l, n) => <div className="os-inc" key={n}><input className="wl-fi" value={l} maxLength={80} onChange={(e) => set({ includes: inc.map((x, m) => (m === n ? e.target.value : x)) })} /></div>)}
    {inc.length < 6 ? <button type="button" className="wl-btn gho" onClick={() => set({ includes: [...inc, ''] })}>{W.f.addLine}</button> : null}{errFor('includes')}
    <span className="wl-fl">{W.f.picture}</span>
    <div className="os-pick">{i.photo_url ? <img src={i.photo_url} alt="" /> : null}<button type="button" className="wl-btn gho" onClick={openPics}>{i.photo_url ? W.f.changePicture : W.f.pickPicture}</button></div>
    {picking ? (pics && !pics.length ? <p className="os-line">{W.f.noPictures}</p> : <div className="os-pics">{(pics || []).slice(0, 24).map((u) => <button key={u} type="button" aria-pressed={i.photo_url === u} onClick={() => { set({ photo_url: u }); setPicking(false); }}><img src={u} alt="" /></button>)}</div>) : null}{errFor('photo_url')}
    <label className="os-chk"><input type="checkbox" checked={i.shown !== false} onChange={(e) => set({ shown: e.target.checked })} />{W.f.shown}</label>
    {err && !err.field ? <p className="os-err" role="alert">{err.error}</p> : null}
    {ask ? (<><p className="os-line">{W.removeAsk}</p><div className="wl-brow"><button type="button" className="wl-btn gho" onClick={() => setAsk(false)}>{W.cancel}</button><button type="button" className="wl-btn pri" disabled={busy} onClick={remove}>{W.removeYes}</button></div></>)
      : (<div className="wl-brow">{isNew ? null : <button type="button" className="wl-btn gho" onClick={() => setAsk(true)}>{W.remove}</button>}<button type="button" className="wl-btn pri" disabled={busy} onClick={save}>{busy ? W.saving : W.save}</button></div>)}
  </Sheet>);
}
