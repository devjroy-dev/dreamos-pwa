"use client";
// v2/app/vendor/(shell)/supplies/screen.tsx · CE-47 · PRO · P1 · Supplies as approved in pictures 3 (R2, ruled):
// one card per source, each labelled "From <source>", "Checked by TDW on <date>" and its fee; the connection finishes the
// job inside TDW (the founder's principle): "Join with your TDW certificate" makes or reuses her certificate and saves it
// for her; the GSTIN card shows her own GSTIN; "Write my requirement" drafts IndiaMART's post. P2: each card's bill loop
// opens Bills (add the bill here; P2-F3 (a), no WhatsApp), and Bills and Gear open their own views (bills.tsx, gear.tsx).
// "TDW takes no fee from these places. None of these links pays TDW."
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { Toast } from '@/v2/components/vendor/Toast';
import { CopyBox } from '@/v2/components/worklist/CopyBox'; // R-46.17: a text she copies sits in its own box
import { useToast } from '@/hooks/vendor/useToast';
import { dayInWords } from '@/v2/lib/worklist/dayInWords';
import { istPlusDaysISO } from '@/lib/vendor/istDay';
import { fetchAbout, fetchPapers, issuePaper, downloadPaper, errOf, type About, type Paper } from '@/v2/lib/vendor/api/papers';
import { sourcesFor, tradeOf, safeUrl, type Source } from '@/v2/lib/solutions/supplySources';
import { SP_CSS } from './style';
import { BillsView } from './bills';
import { GearView } from './gear';
import { fetchBills, type BillDraft } from '@/v2/lib/vendor/api/bills';

const TRADE_WORD = { makeup: 'makeup artists', photo: 'photographers', other: 'wedding professionals' } as const;

export function SuppliesScreen({ vendorId }: { vendorId: string }) {
  const { toast, show } = useToast();
  const [about, setAbout] = useState<About | null>(null);
  const [view, setView] = useState<{ v: 'list' } | { v: 'join'; key: string } | { v: 'req' } | { v: 'bills' } | { v: 'gear' }>({ v: 'list' });
  const [waiting, setWaiting] = useState<number | null>(null);
  useEffect(() => { void fetchAbout(vendorId).then((a) => { if (a.ok && (a as { about?: About }).about) setAbout((a as { about: About }).about); }); }, [vendorId]);
  useEffect(() => { if (view.v !== 'list') return; void fetchBills(vendorId).then((r) => setWaiting(r.ok ? ((r as { drafts: BillDraft[] }).drafts || []).length : null)); }, [vendorId, view.v]);
  const trade = tradeOf(about?.trade);
  const list = useMemo(() => sourcesFor(trade), [trade]);
  const src = view.v === 'join' ? list.find((s) => s.key === view.key) || null : null;

  if (src) return <Join vendorId={vendorId} src={src} about={about} onBack={() => setView({ v: 'list' })} show={show} toast={toast} />;
  if (view.v === 'req') return <Requirement city={about?.city || ''} onBack={() => setView({ v: 'list' })} toast={toast} />;
  if (view.v === 'bills') return <BillsView vendorId={vendorId} onBack={() => setView({ v: 'list' })} />;
  if (view.v === 'gear') return <GearView vendorId={vendorId} city={about?.city || ''} onBack={() => setView({ v: 'list' })} />;
  const prices = list.filter((s) => s.group === 'prices'), repairs = list.filter((s) => s.group === 'repairs');
  return (<Body>
    <p className="sp-lede">These are places where {TRADE_WORD[trade]} buy at professional prices. A bill for each purchase can go to Expenses in TDW.</p>
    <Head text="Where to buy" />
    {prices.map((s) => <Card key={s.key} s={s} about={about} onJoin={() => setView({ v: 'join', key: s.key })} onReq={() => setView({ v: 'req' })} onBills={() => setView({ v: 'bills' })} />)}
    {repairs.length ? (<><Head text="Repairs and backup" />{repairs.map((s) => <Card key={s.key} s={s} about={about} onJoin={() => setView({ v: 'join', key: s.key })} onReq={() => setView({ v: 'req' })} onBills={() => setView({ v: 'bills' })} />)}</>) : null}
    <p className="sp-lede" data-sp-nothing="">TDW takes no fee from these places. None of these links pays TDW.</p>
    <Head text="Bills and gear" />
    <Group>
      <div data-sp-bills=""><Row title="Bills" facts="Add a purchase bill. TDW reads the figures for you to check." chevron onClick={() => setView({ v: 'bills' })}
        pill={waiting ? { text: `${waiting} to add`, tone: 'warn' } : undefined} /></div>
      <div data-sp-gear=""><Row title="Gear" facts={`You can lend and borrow kit with vendors${about?.city ? ` in ${about.city}` : ''}.`} chevron onClick={() => setView({ v: 'gear' })} /></div>
    </Group>
    <Toast toast={toast} /><style>{FR_CSS + SP_CSS}</style>
  </Body>);
}

type ShowFn = (msg: string, kind?: 'success' | 'error') => void;
function Card({ s, about, onJoin, onReq, onBills }: { s: Source; about: About | null; onJoin: () => void; onReq: () => void; onBills: () => void }) {
  return (<div className="sp-card" data-sp-src={s.key}>
    <div className="sp-tags"><span className="sp-tag">From {s.from}</span><span className="sp-tag">Link checked on {s.checked}</span><span className="sp-tag">{s.fee}</span></div>
    <div className="sp-name">{s.name}</div>
    <div className="sp-txt">{s.what}</div>
    {s.joinWithCertificate ? (<><div className="sp-btns"><button type="button" className="sp-btn solid" data-sp-join={s.key} onClick={onJoin}>Join with your TDW certificate</button></div>
      <div className="sp-mute">The certificate is offered as proof of work. {s.from} decides who joins.</div></>) : null}
    {s.gstinCard ? (<>
      <div className="sp-label">Your GSTIN</div>
      {/* R-46.17: her GSTIN, which she copies into the seller's form, sits in its own box */}
      {about?.gstin ? <CopyBox text={about.gstin} label="Copy" copied="Copied" marks={{ box: 'sp-gstinbox', text: 'sp-gstin' }} /> : <div className="sp-txt" data-sp-gstin="">You have not added your GSTIN yet.</div>}
      <div className="sp-mute">{about?.gstin ? `${s.name} needs your GSTIN for business prices and GST bills.` : `${s.name} needs a GSTIN for business prices and GST bills. Add yours in Settings.`}</div>
      <div className="sp-btns"><a className="sp-btn" href={safeUrl(s.url)} target="_blank" rel="noopener noreferrer">Open {s.name}</a></div>
    </>) : null}
    {s.requirement ? (<><div className="sp-btns"><button type="button" className="sp-btn" data-sp-req="" onClick={onReq}>Write my requirement</button><a className="sp-btn" href={safeUrl(s.url)} target="_blank" rel="noopener noreferrer">Open {s.name}</a></div>
      <div className="sp-mute">Sellers send their quotes to your phone, not to TDW. Check the seller before you pay.</div></>) : null}
    {!s.gstinCard && !s.requirement ? <div className="sp-btns"><a className="sp-btn" href={safeUrl(s.url)} target="_blank" rel="noopener noreferrer">Open {s.name}</a></div> : null}
    <div className="sp-loop"><span>After you buy, tap Add a bill. The bill goes to Expenses with its GST after you check it.</span><button type="button" className="sp-btn" data-sp-addbill={s.key} onClick={onBills}>Add a bill</button></div>
  </div>);
}

function Join({ vendorId, src, about, onBack, show, toast }: { vendorId: string; src: Source; about: About | null; onBack: () => void; show: ShowFn; toast: ReturnType<typeof useToast>['toast'] }) {
  const [cert, setCert] = useState<Paper | null>(null); const [busy, setBusy] = useState(false);
  const findCert = useCallback(async () => { const r = await fetchPapers(vendorId); if (r.ok) setCert(((r as { papers?: Paper[] }).papers || []).find((p) => p.kind === 'certificate' && p.state === 'valid') || null); }, [vendorId]);
  useEffect(() => { void findCert(); }, [findCert]);
  const save = async () => {
    setBusy(true);
    let c = cert;
    if (!c) { const r = await issuePaper(vendorId, { kind: 'certificate' }); if (!r.ok) { setBusy(false); show(errOf(r), 'error'); return; } c = (r as { paper: Paper }).paper; setCert(c); }
    const d = await downloadPaper(vendorId, c); setBusy(false);
    if (!d.ok) show(d.error || 'Please try again.', 'error'); else show('Your certificate is saved.', 'success');
  };
  return (<Body>
    <button type="button" className="sp-back" onClick={onBack}>{'\u2039'} Back to Supplies</button>
    <Head text={`Join ${src.name} with your TDW certificate`} />
    <div className="sp-card" data-sp-joinview={src.key}>
      <div className="sp-txt">{src.name} asks for proof that you work as a professional. Your TDW certificate shows your name, trade, city and {about ? `${about.weddings_verified} verified ${about.weddings_verified === 1 ? 'wedding' : 'weddings'}` : 'verified weddings'}. {src.from} can open its check link to see that it is real.</div>
      <div className="sp-field"><span>1</span><span className="sp-step">{cert ? 'Save your certificate as a PDF.' : 'Make your certificate and save it as a PDF.'}</span></div>
      <div className="sp-field"><span>2</span><span className="sp-step">Open {src.name} and tap Sign up.</span></div>
      <div className="sp-field"><span>3</span><span className="sp-step">Add the certificate where the form asks for proof of work.</span></div>
      <div className="sp-btns"><button type="button" className="sp-btn solid" data-sp-save="" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save certificate'}</button>
        <a className="sp-btn" href={safeUrl(src.url)} target="_blank" rel="noopener noreferrer">Open {src.name}</a></div>
      <div className="sp-mute">The certificate is offered as proof of work. {src.from} decides who joins.</div>
      {cert ? <div className="sp-mute" data-sp-check="">Check link: <a className="sp-link" href={safeUrl(cert.check_url)} target="_blank" rel="noopener noreferrer">{cert.check_url.replace(/^https?:\/\//, '')}</a></div> : null}
    </div>
    <Toast toast={toast} /><style>{FR_CSS + SP_CSS}</style>
  </Body>);
}

function Requirement({ city, onBack, toast }: { city: string; onBack: () => void; toast: ReturnType<typeof useToast>['toast'] }) {
  const [item, setItem] = useState(''); const [qty, setQty] = useState(''); const [where, setWhere] = useState(city); const [by, setBy] = useState(istPlusDaysISO(14));
  useEffect(() => { if (!where && city) setWhere(city); }, [city, where]);
  const draft = item.trim() && qty.trim() && where.trim() && by ? `I am looking for ${qty.trim()} ${item.trim()}, delivered to ${where.trim()} by ${dayInWords(by)}. Please send your price for each piece, with GST and delivery charges.` : '';
  return (<Body>
    <button type="button" className="sp-back" onClick={onBack}>{'\u2039'} Back to Supplies</button>
    <Head text="Your requirement for IndiaMART" />
    <div className="sp-card" data-sp-reqview="">
      <div><div className="sp-label">Item</div><input className="sp-in" data-sp-item="" value={item} onChange={(e) => setItem(e.target.value)} placeholder="Makeup sponges" /></div>
      <div><div className="sp-label">Quantity</div><input className="sp-in" data-sp-qty="" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="200" /></div>
      <div><div className="sp-label">City</div><input className="sp-in" value={where} onChange={(e) => setWhere(e.target.value)} /></div>
      <div><div className="sp-label">Needed by</div><input className="sp-in" type="date" value={by} onChange={(e) => setBy(e.target.value)} />{by ? <p className="sp-dw">{dayInWords(by)}</p> : null}</div>
      {/* R-46.17: the requirement she pastes into IndiaMART sits in its own box; the explanation stays outside it */}
      {draft ? <CopyBox text={draft} label="Copy" copied="Copied" marks={{ box: 'sp-draftbox', text: 'sp-draft' }} /> : <div className="sp-mute">Fill in the item, the quantity, the city and the date. TDW then writes the requirement for you.</div>}
      <div className="sp-btns"><a className="sp-btn" href="https://www.indiamart.com" target="_blank" rel="noopener noreferrer">Open IndiaMART</a></div>
      <div className="sp-mute">Sellers send their quotes to your phone, not to TDW. Check the seller before you pay.</div>
    </div>
    <Toast toast={toast} /><style>{FR_CSS + SP_CSS}</style>
  </Body>);
}

