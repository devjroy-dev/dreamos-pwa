"use client";
// v2/app/vendor/(shell)/brands/screen.tsx · CE-47 · PRO · P3 · the Brand collaborations room, as approved in pictures 1 and
// 2: her media kit (its link in a CopyBox, R-46.17), this week's pitch count, brands that fit her, and her pitches with
// where each one stands. "+ New pitch" opens the list of brands. A brand opens to the pitch TDW wrote for her and the ways
// to send it; TDW never sends a pitch itself. She taps I sent it, and TDW counts it (3 a day, 10 a week, one brand once
// in 30 days). ASCI's line shows from the moment she agrees to work with a brand. TDW takes nothing.
// R-47.1: every sentence here is simple, formal and complete, with one idea in it. A sentence that names a button says
// "Tap <button>".
import { useCallback, useEffect, useState } from 'react';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { RoomHeadAdd } from '@/v2/components/worklist/PageHelp';
import { CopyBox } from '@/v2/components/worklist/CopyBox';
import { dayInWords } from '@/v2/lib/worklist/dayInWords';
import { istTodayISO } from '@/lib/vendor/istDay';
import { errOf } from '@/v2/lib/vendor/api/papers';
import { fetchBrands, fetchBrand, sentPitch, movePitch, saveKit, toneOf, type BrandsRoom, type BrandPage, type Pitch, type Channel, type Kit } from '@/v2/lib/vendor/api/brands';

const OPEN_WORD: Record<Channel, string> = { instagram: 'Open Instagram', email: 'Open email', form: 'Open the form' };
const enIn = (n: number) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
export const NO_FEE_LINE = 'TDW takes no fee from any collaboration. None of the links here pays TDW.';
/** What her kit shows, in one or two sentences, from what TDW knows. */
export function kitLine(k: Kit): string {
  const parts = ['your best photos'];
  if (k.weddings != null && k.weddings > 0) parts.push(`your ${enIn(k.weddings)} verified ${k.weddings === 1 ? 'wedding' : 'weddings'}`);
  if (k.followers != null) parts.push(`your ${enIn(k.followers)} Instagram followers`);
  const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
  return `Your kit shows ${list}. It updates by itself.`;
}
type Note = { text: string; kind: 'success' | 'error' } | null;

export function BrandsScreen({ vendorId }: { vendorId: string }) {
  // No toast: a toast at the middle of the screen would cover a button at 374 wide (the chair's rule). What happened is
  // said in one line under the heading instead.
  const [note, setNote] = useState<Note>(null);
  const show = useCallback((text: string, kind: 'success' | 'error' = 'success') => setNote({ text, kind }), []);
  const [room, setRoom] = useState<BrandsRoom | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [view, setView] = useState<{ v: 'room' } | { v: 'choose' } | { v: 'brand'; id: string } | { v: 'pitch'; id: string } | { v: 'kit' }>({ v: 'room' });
  const load = useCallback(async () => {
    const r = await fetchBrands(vendorId);
    if (r.ok) {
      const x = ((r as { room?: Partial<BrandsRoom> }).room || {}) as Partial<BrandsRoom>;
      const L = <T,>(v: T[] | undefined) => (Array.isArray(v) ? v : []);
      setRoom({ kit: x.kit || { url: null, contact_email: null, followers: null, followers_on: null, weddings: null }, counts: x.counts || { day: 0, week: 0, day_left: 3, week_left: 10, line: 'You have sent 0 of 10 pitches this week.', limits: '' },
        trade: x.trade || 'other', trade_word: x.trade_word || 'weddings', brands: L(x.brands), pitches: L(x.pitches) });
      setErr(null);
    } else { setErr(errOf(r, 'TDW could not read your brands just now. Please try again.')); setRoom({ kit: { url: null, contact_email: null, followers: null, followers_on: null, weddings: null }, counts: { day: 0, week: 0, day_left: 3, week_left: 10, line: '', limits: '' }, trade: 'other', trade_word: 'weddings', brands: [], pitches: [] }); }
  }, [vendorId]);
  useEffect(() => { void load(); }, [load]);
  const back = (text?: string) => { setView({ v: 'room' }); if (text) show(text, 'success'); void load(); };
  const status = note ? <p className={`br-status ${note.kind}`} role={note.kind === 'error' ? 'alert' : 'status'} data-br-status="">{note.text}</p> : null;

  if (view.v === 'brand') return <BrandView vendorId={vendorId} brandId={view.id} onBack={back} />;
  if (view.v === 'pitch') { const p = (room?.pitches || []).find((x) => x.id === view.id); if (p) return <PitchView vendorId={vendorId} pitch={p} onBack={back} />; }
  if (view.v === 'kit' && room) return <KitView vendorId={vendorId} kit={room.kit} onBack={back} />;

  const head = <RoomHeadAdd addKey="pitch" label="New pitch" onAdd={() => { setNote(null); setView({ v: 'choose' }); }} />;
  if (view.v === 'choose') return (<>{head}<Body>
    <button type="button" className="br-back" onClick={() => setView({ v: 'room' })}>{'‹'} Back to Brand collaborations</button>
    <Head text="Choose a brand" />
    <p className="br-mute">These brands work with your trade. Tap a brand to see the pitch TDW wrote for you.</p>
    <BrandList room={room} onOpen={(id) => setView({ v: 'brand', id })} />
    <style>{FR_CSS + BR_CSS}</style></Body></>);

  const r = room;
  return (<>{head}<Body>
    {status}
    <p className="br-lede">Pitch your work to brands that fit your trade. You send each pitch yourself. TDW keeps track of each pitch.</p>
    {err ? <p className="br-err" role="alert">{err}</p> : null}
    <div className="br-card" data-br-kit="">
      <div className="br-title">Your media kit</div>
      {r && r.kit.url ? (<>
        <CopyBox text={r.kit.url.replace(/^https?:\/\//, '')} copyValue={r.kit.url} label="Copy link" copied="Copied" marks={{ box: 'br-kitbox' }} />
        <p className="br-txt">{kitLine(r.kit)}</p>
        <div className="br-btns"><a className="br-btn" href={r.kit.url} target="_blank" rel="noopener noreferrer" data-br-kitopen="">Open</a>
          <button type="button" className="br-btn" data-br-kitset="" onClick={() => { setNote(null); setView({ v: 'kit' }); }}>Kit settings</button></div>
      </>) : <p className="br-mute">{r ? 'Your kit gets its address when your TDW page is ready.' : 'Reading your kit…'}</p>}
    </div>
    <Head text="Pitches this week" />
    <p className="br-txt" data-br-count="">{r ? r.counts.line : ''}</p>
    {r && r.counts.limits ? <p className="br-mute">{r.counts.limits}</p> : null}
    <Head text="Brands that fit you" />
    <BrandList room={r} onOpen={(id) => { setNote(null); setView({ v: 'brand', id }); }} />
    {r && r.pitches.length ? (<>
      <Head text="Your pitches" count={r.pitches.length} />
      <Group>{r.pitches.map((p) => (<div key={p.id} data-br-pitch={p.id}><Row title={p.brand} facts={p.line} pill={{ text: p.pill.text, tone: toneOf(p.pill.tone) }} chevron={p.next.length > 0 || !!p.asci} onClick={() => { setNote(null); setView({ v: 'pitch', id: p.id }); }} /></div>))}</Group>
    </>) : null}
    <p className="br-mute br-nofee" data-br-nofee="">{NO_FEE_LINE}</p>
    <style>{FR_CSS + BR_CSS}</style>
  </Body></>);
}

function BrandList({ room, onOpen }: { room: BrandsRoom | null; onOpen: (id: string) => void }) {
  if (!room) return <p className="br-mute">Reading the brand list{'…'}</p>;
  if (!room.brands.length) return <p className="br-mute" data-br-nobrands="">No brand on the list fits your trade yet. TDW adds brands to the list over time.</p>;
  return (<Group>{room.brands.map((b) => (<div key={b.id} data-br-brand={b.id}><Row title={b.name} facts={[b.works_with, b.reach].filter(Boolean).join(' ')} chevron onClick={() => onOpen(b.id)} /></div>))}</Group>);
}

function BrandView({ vendorId, brandId, onBack }: { vendorId: string; brandId: string; onBack: (text?: string) => void }) {
  const [b, setB] = useState<BrandPage | null>(null); const [err, setErr] = useState<string | null>(null); const [busy, setBusy] = useState<Channel | null>(null);
  useEffect(() => { void fetchBrand(vendorId, brandId).then((r) => { if (r.ok && (r as { brand?: BrandPage }).brand) setB((r as { brand: BrandPage }).brand); else setErr(errOf(r, 'TDW could not read this brand just now. Please try again.')); }); }, [vendorId, brandId]);
  const sent = async (ch: Channel) => {
    setBusy(ch); setErr(null); const r = await sentPitch(vendorId, brandId, ch); setBusy(null);
    if (r.ok) { const c = (r as { counts?: { line?: string } }).counts; onBack(`TDW counted your pitch to ${b ? b.name : 'the brand'}.${c && c.line ? ` ${c.line}` : ''}`); }
    else setErr(errOf(r));
  };
  return (<Body>
    <button type="button" className="br-back" onClick={() => onBack()}>{'‹'} Back to Brand collaborations</button>
    {!b ? (err ? <p className="br-err" role="alert">{err}</p> : <p className="br-mute">Reading the brand{'…'}</p>) : (<>
      <Head text={b.name} />
      <div className="br-card" data-br-page={b.id}>
        {b.looks_for ? (<><div className="br-label">What the brand looks for</div><p className="br-txt">{b.looks_for}</p></>) : null}
        {b.works_with ? <p className="br-txt">{b.works_with}</p> : null}
        <p className="br-txt">{b.reach}</p>
        <p className="br-mute">{b.checked_line}</p>
        <div className="br-links"><a className="br-link" href={b.website_url} target="_blank" rel="noopener noreferrer">Open the brand{'’'}s website</a>
          <a className="br-link" href={b.instagram_url} target="_blank" rel="noopener noreferrer">Open @{b.instagram_handle} on Instagram</a></div>
      </div>
      {b.last_pitch ? <p className="br-mute" data-br-last="">{b.last_pitch.line}</p> : null}
      <Head text="Your pitch" />
      <div className="br-card">
        <p className="br-mute">TDW wrote this pitch for you. You can change the words after you paste them.</p>
        <CopyBox text={b.pitch} label="Copy the pitch" copied="Copied" marks={{ box: 'br-pitchbox' }} textClassName="br-pitchtext" />
        {b.blocked ? <p className="br-err" role="alert" data-br-blocked="">{b.blocked}</p> : (<>
          {b.send.map((s) => (<div key={s.channel} className="br-send" data-br-send={s.channel}>
            <p className="br-txt">{s.step}</p>
            <div className="br-btns">
              {s.link ? <a className="br-btn" href={s.link} target={s.channel === 'email' ? undefined : '_blank'} rel="noopener noreferrer" data-br-open={s.channel}>{OPEN_WORD[s.channel]}</a> : null}
              <button type="button" className="br-btn solid" data-br-sent={s.channel} disabled={!!busy} onClick={() => void sent(s.channel)}>{busy === s.channel ? 'Saving…' : 'I sent it'}</button>
            </div>
          </div>))}
          <p className="br-mute">{b.sent_ask}</p>
        </>)}
        {err ? <p className="br-err" role="alert">{err}</p> : null}
      </div>
    </>)}
    <style>{FR_CSS + BR_CSS}</style>
  </Body>);
}

function PitchView({ vendorId, pitch, onBack }: { vendorId: string; pitch: Pitch; onBack: (text?: string) => void }) {
  const [p, setP] = useState<Pitch>(pitch); const [due, setDue] = useState<string>(pitch.post_due || ''); const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null);
  const today = istTodayISO();
  const go = async (body: { to?: Pitch['state']; post_due?: string }) => {
    setBusy(true); setErr(null); const r = await movePitch(vendorId, p.id, body); setBusy(false);
    if (r.ok && (r as { pitch?: Pitch }).pitch) setP((r as { pitch: Pitch }).pitch); else setErr(errOf(r));
  };
  const dueOpen = p.state === 'agreed' || p.state === 'kit_received';
  return (<Body>
    <button type="button" className="br-back" onClick={() => onBack()}>{'‹'} Back to Brand collaborations</button>
    <Head text={p.brand} />
    <div className="br-card" data-br-pitchview={p.id}>
      <div className="br-tags"><span className={`fr-pill ${toneOf(p.pill.tone)}`}>{p.pill.text}</span></div>
      <p className="br-txt" data-br-line="">{p.line}</p>
      {p.asci ? <p className="br-asci" data-br-asci="">{p.asci}</p> : null}
      {dueOpen ? (<div data-br-due="">
        <div className="br-label">Post due on</div>
        <input className="br-in" type="date" min={today} value={due} onChange={(e) => setDue(e.target.value)} />
        {due ? <p className="br-dw">{dayInWords(due)}</p> : null}
        <div className="br-btns"><button type="button" className="br-btn" data-br-savedue="" disabled={busy || !due} onClick={() => void go({ post_due: due })}>Save the date</button></div>
      </div>) : null}
      {p.next.length ? (<><div className="br-label">What happened next?</div>
        <div className="br-btns">{p.next.map((n) => (<button key={n.to} type="button" className="br-btn" data-br-next={n.to} disabled={busy} onClick={() => void go({ to: n.to })}>{n.label}</button>))}</div></>) : null}
      {err ? <p className="br-err" role="alert">{err}</p> : null}
    </div>
    <style>{FR_CSS + BR_CSS}</style>
  </Body>);
}

function KitView({ vendorId, kit, onBack }: { vendorId: string; kit: Kit; onBack: (text?: string) => void }) {
  const [email, setEmail] = useState(kit.contact_email || ''); const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null);
  const save = async () => { setBusy(true); setErr(null); const r = await saveKit(vendorId, email.trim()); setBusy(false); if (r.ok) onBack(email.trim() ? 'Your kit’s email address is saved.' : 'Your kit now shows no email address.'); else setErr(errOf(r)); };
  return (<Body>
    <button type="button" className="br-back" onClick={() => onBack()}>{'‹'} Back to Brand collaborations</button>
    <Head text="Kit settings" />
    <div className="br-card" data-br-kitview="">
      <p className="br-txt">Brands that open your kit can write to this email address. Leave it empty to show no email address.</p>
      <div className="br-label">Email for brands</div>
      <input className="br-in" type="email" inputMode="email" autoComplete="email" value={email} placeholder="hello@yourstudio.in" data-br-email="" onChange={(e) => setEmail(e.target.value)} />
      <p className="br-mute">Your kit also shows a button to message you on Instagram, when your Instagram handle is in Settings.</p>
      <div className="br-btns"><button type="button" className="br-btn solid" data-br-savekit="" disabled={busy} onClick={() => void save()}>{busy ? 'Saving…' : 'Save'}</button></div>
      {err ? <p className="br-err" role="alert">{err}</p> : null}
    </div>
    <style>{FR_CSS + BR_CSS}</style>
  </Body>);
}

const BR_CSS = `
.br-lede{margin:4px 0 12px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.br-status{margin:4px 0 8px;font:var(--wl-t4);color:var(--atelier-ink)}
.br-status.error{color:var(--role-critical)}
.br-err{margin:8px 0 0;font:var(--wl-t4);color:var(--role-critical)}
.br-back{align-self:flex-start;min-height:44px;padding:0;background:transparent;border:0;font:var(--wl-t4);color:var(--atelier-accent-text);touch-action:manipulation}
.br-card{border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);padding:16px;display:flex;flex-direction:column;gap:10px;min-width:0}
.br-title{font:var(--wl-t3);color:var(--atelier-ink)}
.br-txt{margin:0;font:var(--wl-t4);color:var(--atelier-ink)}
.br-mute{margin:0;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.br-nofee{margin-top:16px}
.br-label{font:var(--wl-t5);color:var(--atelier-ink-mute);margin:4px 0 2px}
.br-in{width:100%;box-sizing:border-box;min-height:44px;padding:10px 14px;background:var(--atelier-input-bg);border:.5px solid var(--atelier-input-border);border-radius:12px;font:var(--wl-t4);color:var(--atelier-ink)}
.br-dw{margin:6px 0 0;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.br-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:2px}
.br-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:12px;border:1px solid var(--atelier-accent-text);background:transparent;color:var(--atelier-accent-text);font:var(--wl-tb);text-decoration:none;touch-action:manipulation}
.br-btn.solid{background:var(--atelier-accent-text);color:var(--atelier-card-bg)}
.br-btn:disabled{opacity:.6}
.br-links{display:flex;flex-direction:column;gap:6px}
.br-link{font:var(--wl-t4);color:var(--atelier-accent-text);overflow-wrap:anywhere;min-height:32px;display:inline-flex;align-items:center}
.br-send{border-top:1px solid var(--atelier-card-border);padding-top:10px;display:flex;flex-direction:column;gap:6px}
.br-pitchtext{white-space:pre-wrap}
.br-asci{margin:0;padding:10px 12px;border:1px solid var(--role-caution);border-radius:10px;font:var(--wl-t4);color:var(--atelier-ink)}
.br-tags{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
`;
