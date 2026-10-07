'use client';
// app/partner/page.tsx · CE-47 · PTN-A1 app · the partner area: tabs by what the partner gets (Calls for you, Your briefs,
// Your requirements) and Settings. In A1 the three work tabs say plainly that they start soon (R-46.14: visible, never
// dead); Settings works: the organisation, calls on or off, people, the partner page link, sign out.
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PartnerShell } from '@/components/partner/PartnerShell';
import { OrgForm } from '@/components/partner/OrgForm';
import { ExtLink } from '@/components/partner/ExtLink';
import { Mark } from '@/components/partner/Mark';
import { CopyBox } from '@/v2/components/worklist/CopyBox'; // R-46.17: the link she shares sits in its own box
import { partnerApi, partnerToken, setPartnerToken, type Org } from '@/lib/partner/api';
import { W } from '@/lib/partner/words';

type Me = { name: string | null; partner: Org | null; role: string | null; people: { name: string | null; phone: string | null; role: string }[] };

export default function PartnerArea() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [tab, setTab] = useState<string>('');
  const load = useCallback(async () => {
    if (!partnerToken()) { router.replace('/partner/join'); return; }
    const r = await partnerApi.me();
    if (!r.ok) { if (r.status === 401) { setPartnerToken(null); router.replace('/partner/join?signin=1'); return; } if (r.status === 403) { setBlocked(r.error); return; } setBlocked(r.error); return; }
    setMe(r); const w = (r.partner && r.partner.wants) || [];
    setTab((t) => t || (w.includes('calls') ? 'calls' : w.includes('briefs') ? 'briefs' : w.includes('requirements') ? 'requirements' : 'settings'));
  }, [router]);
  useEffect(() => { void load(); }, [load]);

  if (blocked) return <PartnerShell><section className="sol-surface"><p className="sol-err" data-partner-blocked="">{blocked}</p></section></PartnerShell>;
  if (!me) return <PartnerShell><div aria-busy="true" style={{ minHeight: 200 }} /></PartnerShell>;
  if (!me.partner) return (
    <PartnerShell><section className="sol-surface" data-step="org"><h1 className="sol-heading">{W.orgTitle}</h1><p className="sol-empty">{W.orgLede}</p><div style={{ height: 16 }} />
      <OrgForm submitLabel={W.saveOrg} onSubmit={async (b) => { const r = await partnerApi.createOrg(b); if (!r.ok) return r.error; await load(); return null; }} /></section></PartnerShell>);

  const o = me.partner;
  const wants = o.wants || [];
  const tabs = [...(wants.includes('calls') ? [['calls', W.callsTab]] : []), ...(wants.includes('briefs') ? [['briefs', W.briefsTab]] : []),
    ...(wants.includes('requirements') ? [['requirements', W.reqTab]] : []), ['settings', W.settingsTab]] as [string, string][];
  return (
    <PartnerShell>
      <section className="sol-surface" data-partner-area="">
        <p className="sol-eyebrow">{o.name} · {o.kind_words}</p>
        <h1 className="sol-heading">{(tabs.find((t) => t[0] === tab) || tabs[0])[1]}</h1>
        <Mark words={o.check_words} />
        <div className="px-seg" role="group">{tabs.map(([k, l]) => <button key={k} type="button" aria-pressed={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</div>
        {tab === 'calls' ? <><p className="sol-empty">{W.callsSoon}</p><p className="sol-note">{W.footCalls}</p></>
          : tab === 'briefs' ? <p className="sol-empty">{W.briefsSoon}</p>
          : tab === 'requirements' ? <p className="sol-empty">{W.reqSoon}</p>
          : <Settings me={me} reload={load} onSignOut={() => { setPartnerToken(null); router.replace('/partner/join?signin=1'); }} />}
      </section>
    </PartnerShell>
  );
}

function Settings({ me, reload, onSignOut }: { me: Me; reload: () => Promise<void>; onSignOut: () => void }) {
  const o = me.partner as Org;
  const [msg, setMsg] = useState<string | null>(null);
  const [pPhone, setPPhone] = useState('+91'); const [pName, setPName] = useState('');
  const [pErr, setPErr] = useState<string | null>(null);
  const setCalls = async (s: 'active' | 'paused') => { const r = await partnerApi.patchOrg({ send_state: s }); setMsg(r.ok ? W.saved : r.error); if (r.ok) await reload(); };
  return (
    <div data-settings="">
      <p className="sol-rowdesc"><ExtLink href={o.instagram_url}>@{o.instagram_handle}</ExtLink>{o.website_url ? <> · <ExtLink href={o.website_url}>{o.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</ExtLink></> : null}</p>
      {o.instagram_handle ? <><p className="sol-rowdesc">{W.pageLink}</p>
        <CopyBox text={`thedreamwedding.in/partner/p/${o.instagram_handle}`} copyValue={`https://thedreamwedding.in/partner/p/${o.instagram_handle}`} label={W.copy} copied={W.copied} />
        <p className="sol-rowdesc"><a href={`/partner/p/${o.instagram_handle}`} className="px-link">{W.pageOpen}</a></p></> : null}
      <h2 className="sol-heading" style={{ marginTop: 24 }}>{W.receive}</h2>
      <div className="px-chips">
        <button type="button" className={o.send_state === 'active' ? 'px-chip on' : 'px-chip'} aria-pressed={o.send_state === 'active'} onClick={() => { void setCalls('active'); }}>{W.getCalls}</button>
        <button type="button" className={o.send_state === 'paused' ? 'px-chip on' : 'px-chip'} aria-pressed={o.send_state === 'paused'} onClick={() => { void setCalls('paused'); }}>{W.stopCalls}</button>
      </div>
      {msg ? <p className="sol-note">{msg}</p> : null}
      <h2 className="sol-heading" style={{ marginTop: 24 }}>{W.orgTitle}</h2>
      <OrgForm initial={o} submitLabel="Save" onSubmit={async (b) => { const r = await partnerApi.patchOrg(b); if (!r.ok) return r.error; setMsg(W.saved); await reload(); return null; }} />
      <h2 className="sol-heading" style={{ marginTop: 24 }}>{W.people}</h2>
      {(me.people || []).map((p, i) => <div key={i} className="px-card"><span className="sol-rowlabel">{p.name || 'No name yet'}{p.role === 'owner' ? ' (owner)' : ''}</span><span className="sol-rowdesc">{p.phone}</span></div>)}
      {me.role === 'owner' ? (
        <div className="px-card">
          <label className="px-field"><span className="px-label">{W.yourName.replace('Your', 'Their')}</span><input className="px-input" value={pName} onChange={(e) => setPName(e.target.value)} /></label>
          <label className="px-field"><span className="px-label">{W.phone}</span><input className="px-input" value={pPhone} onChange={(e) => setPPhone(e.target.value)} inputMode="tel" /></label>
          <p className="sol-note">{W.addPersonLine}</p>
          {pErr ? <p className="sol-err">{pErr}</p> : null}
          <div className="sol-actions"><button type="button" className="sol-btn" onClick={async () => { const r = await partnerApi.addPerson(pPhone, pName); if (!r.ok) { setPErr(r.error); return; } setPErr(null); setPName(''); setPPhone('+91'); await reload(); }}>{W.addPerson}</button></div>
        </div>
      ) : <p className="sol-note">{W.ownerOnly}</p>}
      <div className="sol-actions"><button type="button" className="sol-btn" onClick={onSignOut}>{W.signOut}</button></div>
    </div>
  );
}
