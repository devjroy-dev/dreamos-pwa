"use client";
// v2/app/vendor/(shell)/papers/screen.tsx · CE-47 · PRO · P1 · the Business papers room, as approved in pictures 1 and 2:
// "+ New paper"; Make a paper (four kinds); Issued (valid or withdrawn, each with its check code). A paper opens to what
// it states, its check link, Download and Withdraw. Words plain and literal (R-45.30); dates in full months; "Rs 2,000".
import { useCallback, useEffect, useState } from 'react';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { RoomHeadAdd } from '@/v2/components/worklist/PageHelp';
import { Toast } from '@/v2/components/vendor/Toast';
import { CopyBox } from '@/v2/components/worklist/CopyBox'; // R-46.17: a text she copies sits in its own box
import { useToast } from '@/hooks/vendor/useToast';
import { dayInWords } from '@/v2/lib/worklist/dayInWords';
import { istTodayISO } from '@/lib/vendor/istDay';
import { fetchPapers, fetchAbout, issuePaper, withdrawPaper, downloadPaper, type Paper, type PaperKind, type Purpose, type About, errOf } from '@/v2/lib/vendor/api/papers';
import { fetchPortfolio } from '@/v2/lib/vendor/api/vendor';
import type { PortfolioImage } from '@/lib/vendor/types/vendor';

const KINDS: { kind: PaperKind; title: string; line: (a: About | null) => string }[] = [
  { kind: 'certificate', title: 'Professional certificate', line: (a) => a ? `It shows your name, trade, city and ${a.weddings_verified} verified ${a.weddings_verified === 1 ? 'wedding' : 'weddings'}.` : 'It shows your name, trade, city and verified weddings.' },
  { kind: 'id_card', title: 'Professional ID', line: () => 'It is a card with your photo, trade and city.' },
  { kind: 'statement', title: 'Business statement', line: () => 'It shows your bookings and income for a period, for a bank, a landlord or a visa office.' },
  { kind: 'ca_pack', title: 'Ready for your CA', line: () => 'It holds your invoices, expenses with GST and TDS, month by month, as a PDF and spreadsheets.' },
];
const PURPOSES: { v: Purpose; label: string }[] = [{ v: 'bank', label: 'A bank' }, { v: 'landlord', label: 'A landlord' }, { v: 'visa', label: 'A visa office' }, { v: 'other', label: 'Something else' }];
const firstOfFY = (today: string) => { const [y, m] = today.split('-').map(Number); return `${m >= 4 ? y : y - 1}-04-01`; };

export function PapersScreen({ vendorId }: { vendorId: string }) {
  const { toast, show } = useToast();
  const [papers, setPapers] = useState<Paper[] | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [view, setView] = useState<{ v: 'list' } | { v: 'new'; kind: PaperKind | null } | { v: 'paper'; id: string }>({ v: 'list' });
  const load = useCallback(async () => {
    const [p, a] = await Promise.all([fetchPapers(vendorId), fetchAbout(vendorId)]);
    if (p.ok) { setPapers((p as { papers?: Paper[] }).papers || []); setErr(null); } else { setErr(errOf(p, 'TDW could not read your papers just now.')); setPapers([]); }
    if (a.ok && (a as { about?: About }).about) setAbout((a as { about: About }).about);
  }, [vendorId]);
  useEffect(() => { void load(); }, [load]);
  const open = view.v === 'paper' ? (papers || []).find((p) => p.id === view.id) || null : null;

  if (view.v === 'new') return (<NewPaper vendorId={vendorId} about={about} kind={view.kind} onKind={(k) => setView({ v: 'new', kind: k })}
    onBack={() => setView(view.kind ? { v: 'new', kind: null } : { v: 'list' })}
    onIssued={(p) => { setPapers((xs) => [p, ...(xs || [])]); setView({ v: 'paper', id: p.id }); show('The paper is made.', 'success'); }} show={show} toast={toast} />);
  if (open) return (<PaperView vendorId={vendorId} paper={open} onBack={() => setView({ v: 'list' })} show={show} toast={toast}
    onWithdrawn={() => { setPapers((xs) => (xs || []).map((p) => (p.id === open.id ? { ...p, state: 'withdrawn', withdrawn_at: new Date().toISOString() } : p))); show('The paper is withdrawn.', 'success'); }} />);

  return (<>
    <RoomHeadAdd addKey="paper" label="New paper" onAdd={() => setView({ v: 'new', kind: null })} />
    <Body>
      <p className="pp-lede">TDW makes these papers from your records. Each paper has a check link that anyone can open.</p>
      <Head text="Make a paper" />
      <Group>{KINDS.map((k) => (<div key={k.kind} data-pp-kind={k.kind}><Row title={k.title} facts={k.line(about)} chevron onClick={() => setView({ v: 'new', kind: k.kind })} /></div>))}</Group>
      {err ? <p className="pp-err" role="alert">{err}</p> : null}
      {papers && papers.length ? (<>
        <Head text="Issued" count={papers.length} />
        <Group>{papers.map((p) => (<div key={p.id} data-pp-paper={p.check_code}><Row title={p.title}
          facts={`${p.period_from ? `${dayInWords(p.period_from)} to ${dayInWords(p.period_to)}. ` : ''}Issued ${dayInWords(p.issued_at)}. Check code ${p.check_code}`}
          pill={p.state === 'valid' ? { text: 'Valid', tone: 'ok' } : { text: 'Withdrawn', tone: 'soon' }} chevron onClick={() => setView({ v: 'paper', id: p.id })} /></div>))}</Group>
      </>) : null}
    </Body>
    <Toast toast={toast} /><style>{FR_CSS + PP_CSS}</style>
  </>);
}

type ShowFn = (msg: string, kind?: 'success' | 'error') => void;
function NewPaper({ vendorId, about, kind, onKind, onBack, onIssued, show, toast }: { vendorId: string; about: About | null; kind: PaperKind | null; onKind: (k: PaperKind) => void; onBack: () => void; onIssued: (p: Paper) => void; show: ShowFn; toast: ReturnType<typeof useToast>['toast'] }) {
  const today = istTodayISO();
  const [from, setFrom] = useState(firstOfFY(today)); const [to, setTo] = useState(today); const [purpose, setPurpose] = useState<Purpose | null>(null);
  const [busy, setBusy] = useState(false); const [why, setWhy] = useState<string | null>(null);
  const k = KINDS.find((x) => x.kind === kind);
  // R3 (b): the ID's photo is one she picks here from her portfolio (refused pictures are not offered), kept on the paper.
  const [photos, setPhotos] = useState<PortfolioImage[] | null>(null); const [photo, setPhoto] = useState<string | null>(null);
  useEffect(() => { if (kind !== 'id_card' || photos) return; void fetchPortfolio(vendorId).then((r) => {
    const imgs = r.ok ? ((r as { images?: PortfolioImage[] }).images || []) : [];
    setPhotos(imgs.filter((i) => i.approval_state !== 'rejected' && /^https:\/\//.test(i.image_url)).slice(0, 24)); }); }, [kind, photos, vendorId]);
  const make = async () => {
    if (!kind) return; setBusy(true); setWhy(null);
    const body = kind === 'id_card' ? { kind, ...(photo ? { photo_url: photo } : {}) } : kind === 'certificate' ? { kind } : kind === 'statement' ? { kind, period_from: from, period_to: to, ...(purpose ? { purpose } : {}) } : { kind, period_from: from, period_to: to };
    const r = await issuePaper(vendorId, body); setBusy(false);
    if (r.ok) onIssued((r as { paper: Paper }).paper); else { setWhy(errOf(r)); show(errOf(r), 'error'); }
  };
  return (<Body>
    <button type="button" className="pp-back" onClick={onBack}>{'\u2039'} {kind ? 'Back' : 'Back to Business papers'}</button>
    {!k ? (<><Head text="Which paper?" /><Group>{KINDS.map((x) => (<div key={x.kind} data-pp-pick={x.kind}><Row title={x.title} facts={x.line(about)} chevron onClick={() => onKind(x.kind)} /></div>))}</Group></>) : (<>
      <Head text={k.title} />
      <div className="pp-card" data-pp-new={k.kind}>
        {k.kind === 'certificate' || k.kind === 'id_card' ? (<>
          <p className="pp-txt">The paper will state these details.</p>
          {about ? <Lines lines={[['Name', about.name], ['Trade', about.trade], ['City', about.city], ['Weddings on TDW', `${about.weddings_verified}, verified by TDW`]]} /> : <p className="pp-mute">Reading your records…</p>}
          <p className="pp-mute">Weddings are counted by TDW from bookings with an invoice and a payment recorded in TDW.</p>
          {k.kind === 'id_card' ? (<div data-pp-photos="">
            <div className="pp-label">Photo on the ID</div>
            {photos === null ? <p className="pp-mute">Reading your portfolio…</p> : photos.length === 0 ? <p className="pp-mute">To put your photo on the ID, add a photo of yourself to your portfolio. You can also make the ID without a photo.</p> : (
              <div className="pp-photos">{photos.map((im) => (<button key={im.id} type="button" data-pp-photo={im.id} aria-pressed={photo === im.image_url} className={`pp-ph${photo === im.image_url ? ' on' : ''}`} onClick={() => setPhoto(photo === im.image_url ? null : im.image_url)} aria-label={photo === im.image_url ? 'Chosen photo. Tap to remove.' : 'Use this photo'}>
                {/* eslint-disable-next-line @next/next/no-img-element */}<img src={im.image_url} alt="" loading="lazy" /></button>))}</div>)}
            <p className="pp-mute">{photo ? 'This photo will be on the ID.' : 'You have not chosen a photo. You can make the ID without one.'}</p>
          </div>) : null}
        </>) : (<>
          <div><div className="pp-label">First day</div><input className="pp-in" type="date" value={from} max={today} onChange={(e) => setFrom(e.target.value)} />{from ? <p className="pp-dw">{dayInWords(from)}</p> : null}</div>
          <div><div className="pp-label">Last day</div><input className="pp-in" type="date" value={to} max={today} onChange={(e) => setTo(e.target.value)} />{to ? <p className="pp-dw">{dayInWords(to)}</p> : null}</div>
          {k.kind === 'statement' ? (<div><div className="pp-label">Who is it for?</div><div className="pp-chips">{PURPOSES.map((p) => (
            <button key={p.v} type="button" data-pp-purpose={p.v} className={`pp-chip${purpose === p.v ? ' on' : ''}`} aria-pressed={purpose === p.v} onClick={() => setPurpose(p.v)}>{p.label}</button>))}</div></div>) : null}
          {k.kind === 'statement' ? <p className="pp-mute">The statement shows the invoices you raised in this period and what they came to. It also shows what you received on them. It says that TDW has not audited these figures.</p> : null}
          {k.kind === 'ca_pack' ? <p className="pp-mute">You get one file with a PDF and spreadsheets. It has your sales, purchases and TDS for each month, and a summary. GST input credit depends on your GST registration. Your CA confirms it.</p> : null}
        </>)}
        {why ? <p className="pp-err" role="alert">{why}</p> : null}
        <div className="pp-btns"><button type="button" className="pp-btn solid" data-pp-make="" disabled={busy} onClick={make}>{busy ? 'Making…' : `Make the ${k.kind === 'ca_pack' ? 'pack' : k.kind === 'id_card' ? 'ID' : k.kind === 'statement' ? 'statement' : 'certificate'}`}</button></div>
      </div>
    </>)}
    <Toast toast={toast} /><style>{FR_CSS + PP_CSS}</style>
  </Body>);
}

function Lines({ lines }: { lines: [string, string][] }) {
  return <div className="pp-lines">{lines.map(([k, v]) => (<div className="pp-field" key={k}><span>{k}</span><span>{v}</span></div>))}</div>;
}

function PaperView({ vendorId, paper, onBack, onWithdrawn, show, toast }: { vendorId: string; paper: Paper; onBack: () => void; onWithdrawn: () => void; show: ShowFn; toast: ReturnType<typeof useToast>['toast'] }) {
  const [confirm, setConfirm] = useState(false); const [busy, setBusy] = useState(false);
  const dl = async () => { setBusy(true); const r = await downloadPaper(vendorId, paper); setBusy(false); if (!r.ok) show(r.error || 'Please try again.', 'error'); };
  const wd = async () => { setBusy(true); const r = await withdrawPaper(vendorId, paper.id); setBusy(false); setConfirm(false); if (r.ok) onWithdrawn(); else show(errOf(r), 'error'); };
  const valid = paper.state === 'valid';
  return (<Body>
    <button type="button" className="pp-back" onClick={onBack}>{'\u2039'} Back to Business papers</button>
    <Head text={paper.title} />
    <div className="pp-card" data-pp-view={paper.check_code}>
      <div className="pp-tags"><span className={`fr-pill ${valid ? 'ok' : 'soon'}`}>{valid ? 'Valid' : 'Withdrawn'}</span><span className="pp-mute">Issued {dayInWords(paper.issued_at)}{paper.withdrawn_at ? `. Withdrawn ${dayInWords(paper.withdrawn_at)}` : ''}</span></div>
      <Lines lines={paper.lines} />
      <p className="pp-txt">{paper.note}</p>
      <div className="pp-label">Check link</div>
      {/* R-46.17: the link she copies sits in its own box (CopyBox); opening it is a separate link, outside the box */}
      <CopyBox text={paper.check_url.replace(/^https?:\/\//, '')} copyValue={paper.check_url} label="Copy" copied="Copied" marks={{ box: 'pp-checkbox' }} />
      <a className="pp-link" href={paper.check_url} target="_blank" rel="noopener noreferrer">Open the check page</a>
      <div className="pp-btns">
        <button type="button" className="pp-btn solid" data-pp-download="" disabled={busy} onClick={dl}>{paper.kind === 'ca_pack' ? 'Download the pack' : 'Download PDF'}</button>
      </div>
      {valid ? (confirm ? (<div className="pp-confirm" data-pp-confirm="">
        <p className="pp-txt">If you withdraw this paper, its check page will say that it no longer stands. You cannot undo this.</p>
        <div className="pp-btns"><button type="button" className="pp-btn danger" disabled={busy} onClick={wd}>Withdraw</button><button type="button" className="pp-btn" onClick={() => setConfirm(false)}>Keep it</button></div>
      </div>) : (<button type="button" className="pp-quiet" data-pp-withdraw="" onClick={() => setConfirm(true)}>Withdraw this paper</button>)) : null}
    </div>
    <Toast toast={toast} /><style>{FR_CSS + PP_CSS}</style>
  </Body>);
}

const PP_CSS = `
.pp-lede{margin:4px 0 4px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.pp-err{margin:12px 0 0;font:var(--wl-t4);color:var(--role-critical)}
.pp-back{align-self:flex-start;min-height:44px;padding:0;background:transparent;border:0;font:var(--wl-t4);color:var(--atelier-accent-text);touch-action:manipulation}
.pp-card{border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);padding:16px;display:flex;flex-direction:column;gap:10px}
.pp-txt{margin:0;font:var(--wl-t4);color:var(--atelier-ink)}
.pp-mute{margin:0;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.pp-label{font:var(--wl-t5);color:var(--atelier-ink-mute);margin:4px 0 6px}
.pp-in{width:100%;box-sizing:border-box;min-height:44px;padding:10px 14px;background:var(--atelier-input-bg);border:.5px solid var(--atelier-input-border);border-radius:12px;font:var(--wl-t4);color:var(--atelier-ink)}
.pp-dw{margin:6px 0 0;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.pp-chips{display:flex;flex-wrap:wrap;gap:8px}
.pp-chip{min-height:44px;padding:0 14px;border-radius:999px;border:1px solid var(--atelier-card-border);background:transparent;color:var(--atelier-ink);font:var(--wl-t4);touch-action:manipulation}
.pp-chip.on{background:var(--atelier-accent-text);border-color:var(--atelier-accent-text);color:var(--atelier-card-bg)} /* F-44.369: a chosen chip is filled */
.pp-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.pp-btn{min-height:44px;padding:0 16px;border-radius:12px;border:1px solid var(--atelier-accent-text);background:transparent;color:var(--atelier-accent-text);font:var(--wl-tb);touch-action:manipulation}
.pp-btn.solid{background:var(--atelier-accent-text);color:var(--atelier-card-bg)}
.pp-btn.danger{border-color:var(--role-critical);color:var(--role-critical)}
.pp-btn:disabled{opacity:.6}
.pp-quiet{align-self:flex-start;min-height:44px;padding:0;background:transparent;border:0;font:var(--wl-t4);color:var(--role-critical);touch-action:manipulation}
.pp-confirm{border-top:1px solid var(--atelier-card-border);padding-top:10px;display:flex;flex-direction:column;gap:8px}
.pp-tags{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.pp-lines{display:flex;flex-direction:column}
.pp-field{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--atelier-card-border);font:var(--wl-t4);color:var(--atelier-ink)}
.pp-field span:first-child{color:var(--atelier-ink-mute)}
.pp-field span:last-child{text-align:right;overflow-wrap:anywhere}
.pp-link{font:var(--wl-t4);color:var(--atelier-accent-text);overflow-wrap:anywhere}
.pp-photos{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.pp-ph{position:relative;aspect-ratio:3/4;padding:0;border:2px solid transparent;border-radius:10px;overflow:hidden;background:var(--atelier-input-bg);touch-action:manipulation}
.pp-ph img{width:100%;height:100%;object-fit:cover;display:block}
.pp-ph.on{border-color:var(--atelier-accent-text)}
`;
