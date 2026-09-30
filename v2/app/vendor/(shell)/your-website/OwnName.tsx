"use client";
// app/vendor/(shell)/your-website/OwnName.tsx
// TDW · CE-46 · WEB-1 cut 3 (b147) · "YOUR OWN NAME": HER DOMAIN, IN THE YOUR WEBSITE ROOM.
//
// THE STATES (the chair's accepted list, 28 September): S1 idle · S2 results ·
// S3 the registrant sheet · S4 paying · S5 registering · S6 setting up · S7 live ·
// S8 error. EVERY ACTION HAS THREE FORMS (R-46.14):
//   LOCKED       her tier is below Signature (R-46.9): one plain line, itself the tap to Billing (R-43.16)
//   COMING SOON  her tier allows it and the work cannot run yet: the button in place, "Coming soon", disabled
//   LIVE         the button does its work
// "Cannot run" is READ, never assumed, from three signals, any one sufficient:
//   (a) the website row's gate is closed (GET /solutions → website.live false),
//   (b) GET /domain answers the pre-cut-2 shape (no `pricePaise` key: cut 2 not landed),
//   (c) a write door answers 503 at the tap.
// When all three clear, the same buttons are live. No new cut opens them.
// Nothing here computes a price: the door's pricePaise is the only figure shown.

import { useCallback, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { API_BASE, getAuthHeader } from '@/lib/vendor/api/_base';
import { CopyBox } from '@/v2/components/worklist/CopyBox';   // LANDING · R-46.17

export const OWN = Object.freeze({
  head: 'Your own name',
  sub: 'Get yourname.in and your page lives there. Registered in your name, not ours.',
  locked: 'Your own name is on Signature.',
  placeholder: 'yourname',
  search: 'Search',
  soon: 'Coming soon',
  soonLine: 'Coming soon. Your address above works today and always will.',
  taken: 'Taken',
  get: 'Get',
  perYear: 'a year',
  sheetHead: 'Registered in your name',
  fName: 'Full name', fEmail: 'Email', fPhone: 'Phone', fAddr: 'Address', fCity: 'City', fState: 'State', fPin: 'PIN',
  pay: 'Pay',
  payLine: 'You pay first. We register it as soon as the payment clears.',
  paying: 'Waiting for your payment.',
  openPay: 'Open the payment page',
  payingLine: 'Paid already? This updates by itself.',
  registering: (d: string) => `Registering ${d} in your name.`,
  settingUp: 'Setting up. Ten to forty minutes.',
  checkNow: 'Check now',
  live: (d: string) => `Live at ${d}`,
  liveLine: 'Your page lives here now. Your old address still works.',
  error: (d: string) => `We could not register ${d} yet. Your payment is safe. We will try again, and if it is not done within a day, you get a full refund.`, // S8, approved
  refunded: (d: string) => `${d} could not be registered. Your payment was refunded in full to the card you paid with.`, // approved
  none: 'No names came back. Try another word.',
});

// Re-derived at 423d67cd: lib/worklist/rooms.ts :241 — the Billing room is /vendor/billing (R-43.16's tap).
export const BILLING_HREF = '/vendor/billing';
const UP_TIERS = ['signature', 'prestige'];

type DomainStatus = {
  status: 'none' | 'searching' | 'paying' | 'registering' | 'wiring' | 'live' | 'expired' | 'error' | 'refund_due' | 'refunded';
  subdomain: string | null; domain: string | null; liveUrl: string | null;
  pricePaise?: number | null; paymentUrl?: string | null; lastError: string | null;
};
type Result = { domain: string; available: boolean; pricePaise: number | null };

export function rupees(paise: number): string {
  const n = Math.round(paise / 100); const s = String(n); const last3 = s.slice(-3); const rest = s.slice(0, -3);
  return 'Rs ' + (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' : '') + last3;
}

async function call(method: string, path: string, body?: unknown): Promise<{ status: number; json: any }> {
  try {
    const r = await fetch(`${API_BASE}${path}`, { method, headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: body ? JSON.stringify(body) : undefined });
    let json: any = null; try { json = await r.json(); } catch { /* a non-JSON answer is a closed door */ }
    return { status: r.status, json };
  } catch { return { status: 0, json: null }; }
}

// ── THE THREE FORMS, AS ONE PURE FUNCTION (b147 drives this whole) ─────────────
// The component renders exactly what this returns; nothing about "which form" is
// decided anywhere else. `soonAt` is the door that answered 503 at a tap.
export type Form = 'locked' | 'soon' | 'live';
export function formsFor(i: { tier: string | null; p2Live: boolean; cut2Landed: boolean; soonAt: null | 'order' | 'wire'; allUnpriced?: boolean }): { search: Form; pay: Form; wire: Form } {
  if (i.tier !== null && !UP_TIERS.includes(i.tier)) return { search: 'locked', pay: 'locked', wire: 'locked' };
  // THE FOURTH SIGNAL (the chair, 28 September): a search whose available names ALL came back without a
  // price means the registrar's price list is not being read yet; the search itself reads Coming soon.
  const can = i.p2Live && i.cut2Landed && !i.allUnpriced;
  return {
    search: can ? 'live' : 'soon',
    pay: can && i.soonAt !== 'order' ? 'live' : 'soon',
    wire: i.p2Live && i.soonAt !== 'wire' ? 'live' : 'soon',
  };
}
/** One search result's form: an available, priced name offers "Get"; an available name WITHOUT a price
 *  offers "Coming soon" (the fourth signal), never "Taken", which would be false; only a name the
 *  registrar calls taken reads "Taken". Prices arriving make the same row live with no new cut. */
export type RowForm = 'get' | 'soon' | 'taken';
export function rowFormFor(r: { available: boolean; pricePaise: number | null }): RowForm {
  if (!r.available) return 'taken';
  return typeof r.pricePaise === 'number' && r.pricePaise > 0 ? 'get' : 'soon';
}
/** True when the search found available names and not one of them carries a price. */
export function allUnpricedOf(results: Array<{ available: boolean; pricePaise: number | null }> | null): boolean {
  if (!results) return false;
  const avail = results.filter((r) => r.available);
  return avail.length > 0 && avail.every((r) => rowFormFor(r) === 'soon');
}

/** Which register each action's button wears. The address screen's one primary is Copy (screen.tsx :29);
 *  the registrant sheet is its own screen, so Pay is that sheet's one primary. */
export const REGISTER = Object.freeze({ search: 'second', payOpen: 'second', wire: 'second', liveCopy: 'second', pay: 'primary' } as const);

export default function OwnName({ p2Live, tier, prefill }: { p2Live: boolean; tier: string | null; prefill: { name?: string; address1?: string } }) {
  const [st, setSt] = useState<DomainStatus | null>(null);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Result[] | null>(null);
  const [sheet, setSheet] = useState<Result | null>(null);
  const [soonAt, setSoonAt] = useState<null | 'order' | 'wire'>(null);
  const [busy, setBusy] = useState(false);
  const [reg, setReg] = useState({ name: prefill.name || '', email: '', phone: '', address1: prefill.address1 || '', city: '', state: '', zipcode: '' });
  useEffect(() => { setReg((r) => ({ ...r, name: r.name || prefill.name || '', address1: r.address1 || prefill.address1 || '' })); }, [prefill.name, prefill.address1]);

  const load = useCallback(async () => {
    const r = await call('GET', '/api/v2/vendor/solutions/domain');
    if (r.status === 200 && r.json && r.json.domain) setSt(r.json.domain as DomainStatus);
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!st || !['paying', 'registering', 'wiring'].includes(st.status)) return; const t = setInterval(load, 15000); return () => clearInterval(t); }, [st, load]);

  const cut2Landed = !!st && Object.prototype.hasOwnProperty.call(st, 'pricePaise');
  const F = formsFor({ tier, p2Live, cut2Landed, soonAt, allUnpriced: allUnpricedOf(results) });
  const locked = F.search === 'locked';
  const canRun = F.search === 'live';

  async function search() {
    if (!canRun || busy || !q.trim()) return;
    setBusy(true);
    const r = await call('GET', `/api/v2/vendor/solutions/domain/search?q=${encodeURIComponent(q.trim())}`);
    setBusy(false);
    if (r.status === 200 && r.json && r.json.live === false) { setResults(null); return; }
    setResults(r.status === 200 && r.json ? (r.json.results as Result[]) : []);
  }
  async function order() {
    if (!sheet || busy) return;
    setBusy(true);
    const r = await call('POST', '/api/v2/vendor/solutions/domain/order', { domain: sheet.domain, registrant: reg });
    setBusy(false);
    if (r.status === 503) { setSoonAt('order'); return; }
    if (r.status === 200 && r.json && r.json.domain) { setSt(r.json.domain); setSheet(null); setResults(null); }
  }
  async function wire() {
    if (busy) return;
    setBusy(true);
    const r = await call('POST', '/api/v2/vendor/solutions/domain/wire');
    setBusy(false);
    if (r.status === 503) { setSoonAt('wire'); return; }
    if (r.status === 200 && r.json && r.json.domain) setSt(r.json.domain);
  }

  const soonBtn = (key: string, pri = false) => <button key={key} type="button" className={(pri ? 'wl-btn pri yw-pri ' : 'yw-second ') + 'on-soon'} disabled aria-disabled="true" data-own={key + '-soon'}>{OWN.soon}</button>;
  const s = st ? st.status : 'none';
  const d = st && st.domain ? st.domain : '';

  let body: ReactElement;
  if (locked) {
    body = <a className="on-locked" href={BILLING_HREF} data-own="locked">{OWN.locked}</a>;
  } else if (s === 'paying') {
    body = <div data-own="paying"><div className="on-state">{OWN.paying}</div>
      <div className="yw-acts">{st && st.paymentUrl ? <a className="yw-second" href={st.paymentUrl} data-own="pay-open">{OWN.openPay}</a> : soonBtn('pay-open')}</div>
      <div className="yw-fine">{OWN.payingLine}</div></div>;
  } else if (s === 'registering') {
    body = <div className="on-state" data-own="registering">{OWN.registering(d)}</div>;
  } else if (s === 'wiring') {
    body = <div data-own="wiring"><div className="on-state">{OWN.settingUp}</div>
      <div className="yw-acts">{F.wire !== 'live' ? soonBtn('wire') : <button type="button" className="yw-second" onClick={wire} data-own="wire">{OWN.checkNow}</button>}</div></div>;
  } else if (s === 'live') {
    // LANDING · R-46.17 (the new layout): her own name, given to copy, sits in its own box with Copy (CopyBox, as the
    // address on the screen above); what the clipboard receives is main's, https:// and the name. Open is main's.
    body = <div data-own="live"><CopyBox text={d} copyValue={'https://' + d} label="Copy" copied="Copied" textClassName="yw-big" /><div className="on-state">{OWN.live(d)}</div>
      <div className="yw-acts"><a className="yw-second" href={st && st.liveUrl ? st.liveUrl : '#'} target="_blank" rel="noopener noreferrer">Open</a></div>
      <div className="yw-fine">{OWN.liveLine}</div></div>;
  } else if (s === 'error' || s === 'refund_due') {
    // S8: tried again for a day by the backend; refund_due is the founder's task, and the line she reads is the same
    body = <div className="on-state on-err" data-own="error">{OWN.error(d)}</div>;
  } else if (s === 'refunded') {
    body = <div className="on-state" data-own="refunded">{OWN.refunded(d)}</div>;
  } else {
    body = <div data-own="idle">
      <div className="on-search"><input className="on-q" placeholder={OWN.placeholder} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') search(); }} aria-label={OWN.placeholder} />
        {canRun ? <button type="button" className="yw-second" onClick={search} data-own="search">{OWN.search}</button> : soonBtn('search')}</div>
      {!canRun && <div className="yw-fine" style={{ marginTop: 10 }} data-own="soon-line">{OWN.soonLine}</div>}
      {canRun && results && (results.length === 0 ? <div className="yw-fine">{OWN.none}</div> : <div className="on-results" data-own="results">{results.map((r) => (
        <div className="on-res" key={r.domain}><span className="on-dom">{r.domain}</span>
          {rowFormFor(r) === 'get' && r.pricePaise ? <><span className="on-price">{rupees(r.pricePaise)} {OWN.perYear}</span><button type="button" className="yw-second on-get" onClick={() => setSheet(r)} data-own="get">{OWN.get}</button></>
            : rowFormFor(r) === 'soon' ? soonBtn('get')
            : <span className="on-taken">{OWN.taken}</span>}</div>))}</div>)}
    </div>;
  }

  const f = (k: keyof typeof reg, label: string, type = 'text') => (
    <label className="on-f" key={k}><span>{label}</span><input className="yw-fi" type={type} value={reg[k]} onChange={(e) => setReg({ ...reg, [k]: e.target.value })} /></label>);
  const sheetEl = sheet && !locked && (
    <>
      <button type="button" className="yw-scrim" onClick={() => { setSheet(null); setSoonAt(null); }} aria-label="Close" />
      <div className="yw-sheet" role="dialog" aria-label={OWN.sheetHead} data-own="sheet">
        <div className="yw-shhead"><div className="yw-shtitle">{OWN.sheetHead}</div><button type="button" className="yw-shx" onClick={() => { setSheet(null); setSoonAt(null); }} aria-label="Close">{'\u00d7'}</button></div>
        <div className="on-dom on-sheetdom">{sheet.domain}</div>
        {f('name', OWN.fName)}{f('email', OWN.fEmail, 'email')}{f('phone', OWN.fPhone, 'tel')}{f('address1', OWN.fAddr)}
        <div className="on-row">{f('city', OWN.fCity)}{f('state', OWN.fState)}</div>{f('zipcode', OWN.fPin, 'tel')}
        <div className="yw-acts">{F.pay !== 'live' ? soonBtn('pay', true) : <button type="button" className="wl-btn pri yw-pri" onClick={order} data-own="pay">{`${OWN.pay} ${sheet.pricePaise ? rupees(sheet.pricePaise) : ''}`.trim()}</button>}</div>
        <div className="yw-fine">{OWN.payLine}</div>
      </div>
    </>
  );

  return (
    <div className="yw-sec" style={{ paddingBottom: 32 }} data-own-root="1">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="yw-sect">{OWN.head}</div>
      <div className="yw-note">{OWN.sub}</div>
      <div style={{ marginTop: 14 }}>{body}</div>
      {sheetEl}
    </div>
  );
}

const CSS = `
.on-search{display:flex;gap:8px;align-items:stretch}
.on-q{flex:1;min-width:0;background:var(--atelier-input-bg,transparent);border:.5px solid var(--atelier-input-border);border-radius:2px;padding:12px 14px;min-height:44px;font:var(--wl-t4);color:var(--atelier-ink)}
.on-search .yw-second{flex:0 0 auto;min-width:112px}
.on-soon:disabled,.on-soon[aria-disabled="true"]{opacity:1;cursor:not-allowed}
/* The room’s primary in sentence case, this room only (the chair, 28 September): the shell’s .wl-btn keeps its capitals elsewhere. */
[data-yw-room] .wl-btn{text-transform:none;letter-spacing:0}
.on-results{margin-top:14px;border-top:.5px solid var(--role-metal)}
.on-res{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:.5px solid var(--role-metal)}
.on-dom{flex:1;min-width:0;font:var(--wl-t4);color:var(--atelier-ink);overflow-wrap:anywhere}
.on-price{font:var(--wl-t5);color:var(--atelier-ink-mute);white-space:nowrap}
.on-taken{font:var(--wl-t5);color:var(--atelier-ink-mute)}
.on-get{flex:0 0 auto;min-width:64px}
.on-locked{display:block;font:var(--wl-t4);color:var(--atelier-accent-text);text-decoration:none;padding:12px 0;border-top:.5px solid var(--role-metal);border-bottom:.5px solid var(--role-metal)}
.on-state{font:var(--wl-t4);color:var(--atelier-ink);margin-top:6px}
.on-err{color:var(--atelier-ink)}
.on-f{display:block}
.on-f span{display:block;font:var(--wl-t5);color:var(--atelier-ink-mute);margin-bottom:4px}
.on-f .yw-fi{width:100%;box-sizing:border-box}
.on-sheetdom{font:var(--wl-t3,var(--wl-t4));margin-top:-4px}
.on-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
`;
