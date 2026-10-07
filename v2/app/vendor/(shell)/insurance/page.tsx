"use client";
// v2/app/vendor/(shell)/insurance/page.tsx — CE-47 · INS-A · THE INSURANCE ROOM (Business Solutions › Run the business).
// Replaces the hub cut's shell page at the same address; `insurance` leaves PREVIEW_KEYS in the same edit (routes.ts).
// The founder's rulings (4 and 6 October 2026): kinds of cover, never products; "Get a quote" with her cover brief, each
// insurer's own fee line, TDW takes nothing; her policies kept, every field confirmed by her, "Not checked by TDW"; the
// Insured switch; and the one statement row for step 2 ("Buy here" is NOT built: it waits on a partner agreement).
// Every rule is the server's (dream-os INS-A r3); every word is v2/lib/solutions/insurance.ts' INS.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useToast } from '@/hooks/vendor/useToast';
import { WlToast } from '@/v2/components/worklist/WlToast';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { RoomHeadAdd } from '@/v2/components/worklist/PageHelp';
import { Sheet, SHEET_CSS } from '@/v2/components/worklist/StudioSheets';
import { CopyBox } from '@/v2/components/worklist/CopyBox';
import { INS, KIND_CHOICES, insuranceRoom, kindsFor, quoteBrief, uploadUrl, readPolicy, savePolicy, deletePolicy, policyDocument, setShowMark,
  type Room, type Policy, type Kind, type Answers, type Destination } from '@/v2/lib/solutions/insurance';

export default function InsurancePage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <InsuranceRoom />;
}

// strictNullChecks is off in this estate, so { ok } does not narrow: the error is read through one helper.
const errOf = (r: unknown): string | undefined => (r as { error?: string }).error;

type Form = { insurer: string; kind: string; cover: string; ends: string; docPath: string | null; docMime: string | null };
const EMPTY: Form = { insurer: '', kind: '', cover: '', ends: '', docPath: null, docMime: null };
const ACCEPT = 'application/pdf,image/jpeg,image/png,image/webp,image/heic';

function InsuranceRoom() {
  const { toast, show } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [view, setView] = useState<'home' | 'kinds' | 'quote'>('home');
  const [sheet, setSheet] = useState<null | 'ask' | 'add' | 'policy' | 'brief'>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [kinds, setKinds] = useState<Kind[]>([]);
  const [brief, setBrief] = useState<{ insurer: string; url: string; fee_line: string; text: string } | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    const r = await insuranceRoom();
    if (r.ok) setRoom(r); else show(errOf(r) || 'The room could not open. Try again.', 'error');
  }, [show]);
  useEffect(() => { void load(); }, [load]);

  async function ask() {
    setBusy(true);
    const r = await kindsFor(answers);
    setBusy(false);
    if (!r.ok) { show(errOf(r) || 'Try again.', 'error'); return; }
    setKinds(Array.isArray(r.kinds) ? r.kinds : []); setSheet(null); setView('kinds');
  }
  async function openBrief(d: Destination) {
    setBusy(true);
    const r = await quoteBrief(d.name, answers, kinds.map((k) => k.key));
    setBusy(false);
    if (!r.ok) { show(errOf(r) || 'Try again.', 'error'); return; }
    if (typeof r.text !== 'string' || typeof r.url !== 'string') { show('Try again.', 'error'); return; }
    setBrief(r); setSheet('brief');
  }
  async function pickFile(f: File | undefined) {
    if (!f) return;
    setBusy(true);
    const u = await uploadUrl(f.type);
    if (!u.ok) { setBusy(false); show(errOf(u) || 'Upload a PDF or a photo.', 'error'); return; }
    const put = await fetch(u.upload_url, { method: 'PUT', body: f, headers: { 'Content-Type': f.type } }).catch(() => null);
    if (!put || !put.ok) { setBusy(false); show('The upload did not finish. Try again.', 'error'); return; }
    const r = await readPolicy(u.path, f.type);
    setBusy(false);
    const p = r.ok && r.prefill ? r.prefill : { insurer: null, kind: null, cover_amount: null, ends_on: null };
    setForm({ insurer: p.insurer || '', kind: p.kind || '', cover: p.cover_amount ? String(p.cover_amount) : '', ends: p.ends_on || '', docPath: u.path, docMime: f.type });
  }
  async function save() {
    setBusy(true);
    const r = await savePolicy({ insurer: form.insurer, kind: form.kind, cover_amount: Number(form.cover.replace(/[^0-9]/g, '')), ends_on: form.ends,
      doc_path: form.docPath, doc_mime: form.docMime }, editing ? editing.id : undefined);
    setBusy(false);
    if (!r.ok) { show(errOf(r) || 'Try again.', 'error'); return; }
    setSheet(null); setForm(EMPTY); setEditing(null); void load();
  }
  async function remove(p: Policy) {
    setBusy(true); const r = await deletePolicy(p.id); setBusy(false);
    if (!r.ok) { show(errOf(r) || 'Try again.', 'error'); return; }
    setSheet(null); setEditing(null); void load();
  }
  async function openDoc(p: Policy) {
    const r = await policyDocument(p.id);
    if (r.ok && typeof r.url === 'string') window.open(r.url, '_blank', 'noopener'); else show(errOf(r) || 'Try again.', 'error');
  }
  async function flipMark() {
    if (!room) return;
    const r = await setShowMark(!markOn);
    if (r.ok) setRoom(r); else show(errOf(r) || 'Try again.', 'error');
  }

  // r2 (the chair, train 3's floor): a THIN answer never blanks the room. Every list the room draws is read tolerantly,
  // so an answer with ok and no lists (b140_v2's probe answers unknown doors exactly so) draws an empty room, not a throw.
  const policies = room && Array.isArray(room.policies) ? room.policies : [];
  const destinations = room && Array.isArray(room.destinations) ? room.destinations : [];
  const markOn = !!(room && room.show_mark === true);
  return (
    <WorklistShell title={INS.title}>
      {view === 'home' ? <RoomHeadAdd addKey="policy" label={INS.add} onAdd={() => { setEditing(null); setForm(EMPTY); setSheet('add'); }} /> : null}
      <Body>
        {view === 'home' ? (
          <div data-ins-view="home">
            <p className="fr-lede">{INS.lede}</p>
            {policies.length ? (<>
              <Head text={INS.policiesHead} count={policies.length} />
              <Group>{policies.map((p) => (
                <Row key={p.id} title={p.kind_title} facts={p.facts} pill={{ text: p.state_label, tone: p.state === 'in_date' ? 'ok' : p.state === 'renew_soon' ? 'warn' : 'bad' }}
                  onClick={() => { setEditing(p); setSheet('policy'); }} />))}</Group>
              <p className="ins-note" data-ins-not-checked="">{INS.notChecked}</p>
            </>) : null}
            <Head text={INS.markHead} />
            <Group><Row title={INS.markRow} facts={INS.markFacts} pill={{ text: markOn ? INS.on : INS.off, tone: markOn ? 'ok' : 'soon' }} onClick={flipMark} /></Group>
            <Head text={INS.findHead} />
            <Group>
              <Row title={INS.askRow} facts={INS.askFacts} chevron onClick={() => setSheet('ask')} />
              <Row title={INS.quoteRow} facts={INS.quoteFacts} chevron onClick={() => setView('quote')} />
            </Group>
          </div>
        ) : null}
        {view === 'kinds' ? (
          <div data-ins-view="kinds">
            <Group><Row title={INS.title} chevron onClick={() => setView('home')} /></Group>
            <Head text={INS.askRow} count={kinds.length} />
            <Group>{kinds.map((k) => <Row key={k.key} title={k.title} facts={k.example} />)}</Group>
            <p className="ins-note">{INS.kindsNote}</p>
            <Group><Row title={INS.quoteRow} facts={INS.quoteFacts} chevron onClick={() => setView('quote')} /></Group>
          </div>
        ) : null}
        {view === 'quote' ? (
          <div data-ins-view="quote">
            <Group><Row title={INS.title} chevron onClick={() => setView('home')} /></Group>
            <p className="fr-lede">{INS.quoteLede}</p>
            <Head text={INS.quoteRow} count={destinations.length} />
            <Group>{destinations.map((d) => <Row key={d.name} title={d.name} facts={d.label} chevron onClick={() => { if (!busy) void openBrief(d); }} />)}</Group>
            <p className="ins-note">{INS.quoteNote}</p>
            {/* CE-47 (6 October): a statement, not a control. It goes when a partner's entry becomes "Buy here". */}
            <Group><Row title={INS.buyHereComing} pill={{ text: INS.comingSoon, tone: 'soon' }} /></Group>
          </div>
        ) : null}
      </Body>
      {sheet === 'ask' ? (
        <Sheet title={INS.askRow} onClose={() => setSheet(null)}>
          <label className="wl-fld"><span className="wl-fl">Your work</span><input className="wl-fi" value={answers.trade || ''} onChange={(e) => setAnswers({ ...answers, trade: e.target.value })} /></label>
          <label className="wl-fld"><span className="wl-fl">Value of kit and equipment, in Rs</span><input className="wl-fi wl-fnum" inputMode="numeric" value={answers.gearValue ? String(answers.gearValue) : ''} onChange={(e) => setAnswers({ ...answers, gearValue: Number(e.target.value.replace(/[^0-9]/g, '')) || undefined })} /></label>
          <label className="wl-fld"><span className="wl-fl">Events in a year</span><input className="wl-fi wl-fnum" inputMode="numeric" value={answers.eventsPerYear ? String(answers.eventsPerYear) : ''} onChange={(e) => setAnswers({ ...answers, eventsPerYear: Number(e.target.value.replace(/[^0-9]/g, '')) || undefined })} /></label>
          <YesNo label="Work at venues" value={answers.worksAtVenues} onChange={(v) => setAnswers({ ...answers, worksAtVenues: v })} />
          <YesNo label="Hold client money before the event" value={answers.holdsClientMoney} onChange={(v) => setAnswers({ ...answers, holdsClientMoney: v })} />
          <button type="button" className="wl-btn pri" disabled={busy} onClick={ask}>Show kinds of cover</button>
        </Sheet>
      ) : null}
      {sheet === 'brief' && brief ? (
        <Sheet title={`${INS.quoteRow}: ${brief.insurer}`} onClose={() => setSheet(null)}>
          <p className="wl-shnote">{brief.fee_line}</p>
          <CopyBox text={brief.text} label={INS.copy} copied="Copied" />
          <div className="wl-brow"><button type="button" className="wl-btn gho" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(brief.text)}`, '_blank', 'noopener')}>{INS.sendWa}</button></div>
          <button type="button" className="wl-btn pri" onClick={() => window.open(brief.url, '_blank', 'noopener')}>{INS.openSite(brief.insurer)}</button>
        </Sheet>
      ) : null}
      {sheet === 'add' ? (
        <Sheet title={editing ? INS.replace : INS.add} onClose={() => { setSheet(null); setEditing(null); }}>
          <input ref={fileRef} type="file" accept={ACCEPT} style={{ display: 'none' }} onChange={(e) => void pickFile(e.target.files ? e.target.files[0] : undefined)} />
          <button type="button" className="wl-btn gho" disabled={busy} onClick={() => fileRef.current && fileRef.current.click()}>{form.docPath ? 'Document added' : 'Upload the policy (PDF or photo)'}</button>
          {form.docPath ? <p className="wl-shnote">{INS.readNote}</p> : null}
          <label className="wl-fld"><span className="wl-fl">Insurer</span><input className="wl-fi" value={form.insurer} onChange={(e) => setForm({ ...form, insurer: e.target.value })} /></label>
          <label className="wl-fld"><span className="wl-fl">Kind of cover</span>
            <select className="wl-fi" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              <option value="">Choose</option>{KIND_CHOICES.map((k) => <option key={k.key} value={k.key}>{k.title}</option>)}
            </select></label>
          <label className="wl-fld"><span className="wl-fl">Cover amount, in Rs</span><input className="wl-fi wl-fnum" inputMode="numeric" value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} /></label>
          <label className="wl-fld"><span className="wl-fl">Policy ends</span><input className="wl-fi" type="date" value={form.ends} onChange={(e) => setForm({ ...form, ends: e.target.value })} /></label>
          <button type="button" className="wl-btn pri" disabled={busy} onClick={save}>{INS.save}</button>
        </Sheet>
      ) : null}
      {sheet === 'policy' && editing ? (
        <Sheet title={editing.kind_title} onClose={() => { setSheet(null); setEditing(null); }}>
          <p className="wl-shnote">{editing.facts}. {INS.notChecked} A reminder comes on WhatsApp 30 days and 7 days before it ends.</p>
          <div className="wl-brow">
            {editing.has_document ? <button type="button" className="wl-btn gho" onClick={() => openDoc(editing)}>{INS.openDoc}</button> : null}
            <button type="button" className="wl-btn gho" onClick={() => { setForm({ insurer: editing.insurer, kind: editing.kind, cover: String(editing.cover_amount), ends: editing.ends_on, docPath: null, docMime: null }); setSheet('add'); }}>{INS.replace}</button>
          </div>
          <button type="button" className="wl-btn dan" disabled={busy} onClick={() => remove(editing)}>{INS.del}</button>
        </Sheet>
      ) : null}
      <WlToast toast={toast} />
      <style>{FR_CSS}</style>
      <style>{SHEET_CSS}</style>
      <style>{`.ins-note{margin:12px 0 16px;font:var(--wl-t5);color:var(--atelier-ink-mute);line-height:1.5}`}</style>
    </WorklistShell>
  );
}

function YesNo({ label, value, onChange }: { label: string; value: boolean | undefined; onChange: (v: boolean) => void }) {
  return (
    <div className="wl-fld"><span className="wl-fl">{label}</span>
      <div className="wl-brow">
        <button type="button" className={`wl-btn ${value === true ? 'pri' : 'gho'}`} onClick={() => onChange(true)}>Yes</button>
        <button type="button" className={`wl-btn ${value === false ? 'pri' : 'gho'}`} onClick={() => onChange(false)}>No</button>
      </div>
    </div>
  );
}
