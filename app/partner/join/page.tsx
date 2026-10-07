'use client';
// app/partner/join/page.tsx · CE-47 · PTN-A1 app · "Partner with The Dream Wedding": who is signing up, then the estate's own
// sign-in (phone, name, a WhatsApp code; F-44.271), then the organisation. "Just me" opens the "Launching soon" screen
// until Collab Hub's join path (/collab/join, CLB-2) is live. ?signin=1 opens sign-in for a partner who has an account.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PartnerShell } from '@/components/partner/PartnerShell';
import { OrgForm } from '@/components/partner/OrgForm';
import { partnerApi, setPartnerToken } from '@/lib/partner/api';
import { W } from '@/lib/partner/words';

type Step = 'who' | 'soon' | 'phone' | 'code' | 'org';

export default function PartnerJoin() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('who');
  const [signin, setSignin] = useState(false);
  const [phone, setPhone] = useState('+91');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [askName, setAskName] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { const q = new URLSearchParams(location.search); if (q.get('signin') === '1') { setSignin(true); setStep('phone'); } else if (q.get('me') === '1') setStep('soon'); }, []);

  const send = async () => {
    setErr(null);
    const p = phone.replace(/[^0-9+]/g, '');
    if (!signin && !name.trim()) { setErr('Write your name.'); return; }
    setBusy(true); const r = await partnerApi.sendCode(p); setBusy(false);
    if (!r.ok) { setErr(r.error); return; }
    setPhone(p); setStep('code');
  };
  const verify = async () => {
    setErr(null); setBusy(true);
    const r = await partnerApi.verify(phone, otp.trim(), name.trim() || undefined); setBusy(false);
    if (!r.ok) { if (r.code === 'name_required') { setAskName(true); setErr('Write your name.'); } else setErr(r.error); return; }
    setPartnerToken(r.token);
    if (r.has_org) router.replace('/partner'); else setStep('org');
  };

  return (
    <PartnerShell>
      {step === 'who' ? (
        <section className="sol-surface" data-step="who">
          <p className="sol-eyebrow">{W.partnerWith}</p>
          <h1 className="sol-heading">{W.whoTitle}</h1>
          <p className="sol-empty">{W.whoLede}</p>
          <div className="px-choice">
            <button type="button" className="px-opt" onClick={() => setStep('phone')}><span className="sol-rowlabel">{W.orgChoice}</span><span className="sol-rowdesc">{W.orgChoiceSub}</span></button>
            <button type="button" className="px-opt" data-just-me="" onClick={() => setStep('soon')}><span className="sol-rowlabel">{W.meChoice}</span><span className="sol-rowdesc">{W.meChoiceSub}</span></button>
          </div>
          <p className="sol-note">{W.whoNext}</p>
          <p className="sol-note">{W.signInLine} <button type="button" className="px-link" onClick={() => { setSignin(true); setStep('phone'); }}>{W.signIn}</button></p>
        </section>
      ) : step === 'soon' ? (
        <section className="sol-surface" data-step="soon">
          <p className="sol-eyebrow">Collab Hub</p>
          <h1 className="sol-heading">{W.soonTitle}</h1>
          <p className="sol-empty">{W.soonLine}</p>
          <div className="sol-actions"><button type="button" className="sol-btn" onClick={() => setStep('who')}>{W.back}</button></div>
        </section>
      ) : step === 'phone' ? (
        <section className="sol-surface" data-step="phone">
          <p className="sol-eyebrow">{W.partnerWith}</p>
          <h1 className="sol-heading">{signin ? W.signIn : W.orgChoice}</h1>
          {!signin ? <label className="px-field"><span className="px-label">{W.yourName}</span><input className="px-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label> : null}
          <label className="px-field"><span className="px-label">{W.phone}</span><input className="px-input" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" /><span className="px-hint">{W.phoneHint}</span></label>
          {err ? <p className="sol-err">{err}</p> : null}
          <div className="sol-actions"><button type="button" className="sol-btn sol-btn--fill" disabled={busy} onClick={() => { void send(); }}>{W.sendCode}</button><button type="button" className="sol-btn" onClick={() => { setErr(null); setStep('who'); }}>{W.back}</button></div>
        </section>
      ) : step === 'code' ? (
        <section className="sol-surface" data-step="code">
          <p className="sol-eyebrow">{phone}</p>
          <h1 className="sol-heading">{W.code}</h1>
          <label className="px-field"><input className="px-input" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" aria-label={W.code} /></label>
          {askName ? <label className="px-field"><span className="px-label">{W.yourName}</span><input className="px-input" value={name} onChange={(e) => setName(e.target.value)} /></label> : null}
          {err ? <p className="sol-err">{err}</p> : null}
          <div className="sol-actions"><button type="button" className="sol-btn sol-btn--fill" disabled={busy || otp.length !== 6} onClick={() => { void verify(); }}>{W.verify}</button><button type="button" className="sol-btn" onClick={() => { void send(); }}>{W.newCode}</button></div>
        </section>
      ) : (
        <section className="sol-surface" data-step="org">
          <h1 className="sol-heading">{W.orgTitle}</h1>
          <p className="sol-empty">{W.orgLede}</p>
          <div style={{ height: 16 }} />
          <OrgForm submitLabel={W.saveOrg} onSubmit={async (b) => { const r = await partnerApi.createOrg(b); if (!r.ok) return r.error; router.replace('/partner'); return null; }} />
        </section>
      )}
    </PartnerShell>
  );
}
