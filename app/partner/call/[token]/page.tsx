'use client';
// app/partner/call/[token]/page.tsx · CE-47 · PTN-A2-1 app part 1 · THE CALL PAGE. A partner opens it from a call's email
// or WhatsApp message (the link the server builds: thedreamwedding.in/partner/call/<token>). No sign-in: the token is the
// key. Three things happen here: the partner reads the call, suggests people for it, and pauses or stops calls.
// - The server sends no phone and no email of anyone (A2-1 server); this page draws only what it is sent.
// - A dead, spent or wrong link reads one plain line; it is never an error page.
// - A link opened with ?do=stop or ?do=pause (the email's own links) NEVER acts on opening. Mail scanners open links on
//   their own, so the page shows the matching button and waits for a press.
// - A thin answer ({ ok: true } and nothing else) draws the plain "link does not work" line and throws nothing.
// Every line is the founder's rule R-47.1: a complete sentence, one idea, who does what (lib/partner/words.ts, CALL).
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PartnerShell } from '@/components/partner/PartnerShell';
import { ExtLink } from '@/components/partner/ExtLink';
import { partnerApi, type CallShape } from '@/lib/partner/api';
import { CALL } from '@/lib/partner/words';

type Loaded = { partner: string; call: CallShape; suggested: string[]; max: number };
type Row = { name: string; role: string; link: string };

export default function CallPage() {
  const { token } = useParams<{ token: string }>();
  const [ask, setAsk] = useState<string | null>(null);   // ?do=stop | ?do=pause, read as the join page reads ?signin=1
  useEffect(() => { try { setAsk(new URLSearchParams(location.search).get('do')); } catch { setAsk(null); } }, []);
  const t = String(token || '');
  const [d, setD] = useState<Loaded | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const load = useCallback(async () => {
    const r = await partnerApi.call(t);
    if (!r.ok) { setErr(r.error || CALL.noCall); return; }
    if (!r.call || typeof r.call !== 'object' || !r.call.vendor) { setErr(CALL.noCall); return; }
    setErr(null);
    setD({ partner: r.partner || '', call: r.call, suggested: Array.isArray(r.suggested) ? r.suggested : [], max: Number(r.max) > 0 ? Number(r.max) : 5 });
  }, [t]);
  useEffect(() => { void load(); }, [load]);

  if (err) return <PartnerShell><section className="sol-surface"><p className="sol-empty" data-call-dead="">{err}</p></section></PartnerShell>;
  if (!d) return <PartnerShell><div aria-busy="true" style={{ minHeight: 200 }} /></PartnerShell>;
  const c = d.call; const v = c.vendor;
  return (
    <PartnerShell>
      <section className="sol-surface" data-call-page="">
        <p className="sol-eyebrow">{CALL.eyebrow}</p>
        <h1 className="sol-heading">{CALL.needs(v.name, c.needs)}</h1>
        {v.trade ? <p className="sol-rowdesc">{CALL.trade(v.name, v.trade)}</p> : null}
        <p className="sol-rowdesc">{CALL.where(c.city, c.date_words)}</p>
        {c.pay_words ? <p className="sol-rowdesc">{CALL.pay(c.pay_words)}</p> : null}
        {c.note ? <><p className="sol-rowdesc">{CALL.note}</p><p className="sol-rowdesc" data-call-note="">{c.note}</p></> : null}
        {v.instagram_url ? <p className="sol-rowdesc">{CALL.insta} <ExtLink href={v.instagram_url}>@{v.instagram_handle}</ExtLink></p> : null}
        {d.suggested.length ? (
          <div className="px-card" data-call-suggested="">
            <p className="sol-rowdesc">{CALL.already}</p>
            {d.suggested.map((n, i) => <p key={i} className="sol-rowlabel">{n}</p>)}
          </div>
        ) : null}
        {c.open ? <SuggestForm token={t} call={c} max={d.max} onSent={load} /> : <p className="sol-empty" data-call-closed="">{CALL.closed}</p>}
        <p className="sol-note">{CALL.how(d.partner || 'your organisation')}</p>
        <p className="sol-note">{CALL.keeps}</p>
        <Fewer token={t} ask={ask === 'stop' || ask === 'pause' ? ask : null} />
      </section>
    </PartnerShell>
  );
}

function SuggestForm({ token, call, max, onSent }: { token: string; call: CallShape; max: number; onSent: () => Promise<void> }) {
  const roles = Array.isArray(call.roles) ? call.roles : [];
  const one = roles.length === 1 ? roles[0].role : '';
  const blank = (): Row => ({ name: '', role: one, link: '' });
  const [rows, setRows] = useState<Row[]>([blank()]);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (i: number, k: keyof Row, val: string) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: val } : r)));
  const send = async () => {
    setBusy(true); setMsg(null);
    const people = rows.filter((r) => r.name.trim()).map((r) => ({ name: r.name.trim(), ...(r.role ? { role: r.role } : {}), ...(r.link.trim() ? { link: r.link.trim() } : {}) }));
    const r = await partnerApi.suggest(token, people, agreed);
    setBusy(false);
    if (!r.ok) { setMsg({ ok: false, text: r.error || CALL.noCall }); return; }
    setMsg({ ok: true, text: r.line || '' }); setRows([blank()]); setAgreed(false);
    await onSent();
  };
  return (
    <div data-call-form="" style={{ marginTop: 16 }}>
      <h2 className="sol-heading">{CALL.formTitle}</h2>
      <p className="sol-rowdesc">{CALL.formLede(max)}</p>
      {rows.map((r, i) => (
        <div key={i} className="px-card" data-call-row={i}>
          <label className="px-field"><span className="px-label">{CALL.name}</span>
            <input className="px-input" value={r.name} onChange={(e) => set(i, 'name', e.target.value)} autoComplete="off" data-call-name="" /></label>
          {roles.length > 1 ? (
            <label className="px-field"><span className="px-label">{CALL.role}</span>
              <select className="px-input" value={r.role} onChange={(e) => set(i, 'role', e.target.value)} data-call-role="">
                <option value="">{CALL.role}</option>
                {roles.map((x) => <option key={x.role} value={x.role}>{x.word}</option>)}
              </select></label>
          ) : null}
          <label className="px-field"><span className="px-label">{CALL.link}</span>
            <input className="px-input" value={r.link} onChange={(e) => set(i, 'link', e.target.value)} inputMode="url" autoComplete="off" data-call-link="" />
            <span className="px-hint">{CALL.linkHint}</span></label>
          {rows.length > 1 ? <button type="button" className="px-link" onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}>{CALL.removeRow}</button> : null}
        </div>
      ))}
      {rows.length < max ? <div className="sol-actions"><button type="button" className="sol-btn" onClick={() => setRows((rs) => [...rs, blank()])} data-call-add="">{CALL.addRow}</button></div> : null}
      <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', minHeight: 44, margin: '8px 0 16px', cursor: 'pointer' }}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ width: 22, height: 22, flex: '0 0 auto', marginTop: 2 }} data-call-agree="" />
        <span className="sol-rowdesc">{CALL.agree}</span>
      </label>
      {msg ? <p className={msg.ok ? 'sol-note' : 'sol-err'} data-call-msg={msg.ok ? 'ok' : 'err'}>{msg.text}</p> : null}
      <div className="sol-actions"><button type="button" className="sol-btn sol-btn--fill" disabled={busy} onClick={() => { void send(); }} data-call-send="">{busy ? CALL.sending : CALL.send}</button></div>
    </div>
  );
}

function Fewer({ token, ask }: { token: string; ask: 'stop' | 'pause' | null }) {
  const [line, setLine] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const act = async (what: 'stop' | 'pause') => {
    setBusy(true);
    const r = await partnerApi.stopOrPause(token, what);
    setBusy(false);
    setLine(r.ok ? { ok: true, text: r.line || '' } : { ok: false, text: r.error || CALL.noCall });
  };
  return (
    <div className="px-card" data-call-fewer="" style={{ marginTop: 24 }} id="fewer">
      <h2 className="sol-heading">{CALL.fewerTitle}</h2>
      {ask === 'pause' ? <p className="sol-rowdesc" data-call-ask="pause">{CALL.confirmPause}</p> : ask === 'stop' ? <p className="sol-rowdesc" data-call-ask="stop">{CALL.confirmStop}</p> : <p className="sol-rowdesc">{CALL.fewerLede}</p>}
      {line ? <p className={line.ok ? 'sol-note' : 'sol-err'} data-call-fewer-msg={line.ok ? 'ok' : 'err'}>{line.text}</p> : (
        <div className="sol-actions">
          {ask !== 'stop' ? <button type="button" className={ask === 'pause' ? 'sol-btn sol-btn--fill' : 'sol-btn'} disabled={busy} onClick={() => { void act('pause'); }} data-call-pause="">{CALL.pause}</button> : null}
          {ask !== 'pause' ? <button type="button" className={ask === 'stop' ? 'sol-btn sol-btn--fill' : 'sol-btn'} disabled={busy} onClick={() => { void act('stop'); }} data-call-stop="">{CALL.stop}</button> : null}
        </div>
      )}
    </div>
  );
}
