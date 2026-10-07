'use client';
// components/partner/OrgForm.tsx · CE-47 · PTN-A1 app · the organisation's details (sign-up and Settings share it).
import { useState } from 'react';
import { W, KINDS } from '@/lib/partner/words';
import type { Org } from '@/lib/partner/api';

const CITIES = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Jaipur', 'Pune', 'Udaipur', 'Goa'];

export function OrgForm({ initial, submitLabel, onSubmit }: { initial?: Partial<Org>; submitLabel: string; onSubmit: (b: Record<string, unknown>) => Promise<string | null> }) {
  const [name, setName] = useState(initial?.name || '');
  const [kind, setKind] = useState(initial?.kind || '');
  const [insta, setInsta] = useState(initial?.instagram_handle || '');
  const [site, setSite] = useState(initial?.website || '');
  const [email, setEmail] = useState(initial?.calls_email || '');
  const [cities, setCities] = useState<string[]>(initial?.cities || []);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const toggle = (c: string) => setCities((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]));
  const go = async () => {
    setBusy(true); setErr(null);
    const e = await onSubmit({ name, kind, instagram_handle: insta, website: site || null, calls_email: email || null, cities });
    setBusy(false); if (e) setErr(e);
  };
  return (
    <div data-org-form="">
      <label className="px-field"><span className="px-label">{W.orgName}</span><input className="px-input" value={name} onChange={(e) => setName(e.target.value)} /></label>
      <div className="px-field"><span className="px-label">{W.kind}</span>
        <div className="px-chips">{KINDS.map((k) => <button key={k.key} type="button" className={kind === k.key ? 'px-chip on' : 'px-chip'} aria-pressed={kind === k.key} onClick={() => setKind(k.key)}>{k.label}</button>)}</div></div>
      <label className="px-field"><span className="px-label">{W.insta}</span><input className="px-input" value={insta} onChange={(e) => setInsta(e.target.value)} autoCapitalize="none" /><span className="px-hint">{W.instaHint}</span></label>
      <label className="px-field"><span className="px-label">{W.website}</span><input className="px-input" value={site} onChange={(e) => setSite(e.target.value)} autoCapitalize="none" inputMode="url" /><span className="px-hint">{W.websiteHint}</span></label>
      <label className="px-field"><span className="px-label">{W.callsEmail}</span><input className="px-input" value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" autoCapitalize="none" /></label>
      <div className="px-field"><span className="px-label">{W.cities}</span>
        <div className="px-chips">{CITIES.map((c) => <button key={c} type="button" className={cities.includes(c) ? 'px-chip on' : 'px-chip'} aria-pressed={cities.includes(c)} onClick={() => toggle(c)}>{c}</button>)}</div></div>
      {err ? <p className="sol-err">{err}</p> : null}
      <div className="sol-actions"><button type="button" className="sol-btn sol-btn--fill" disabled={busy} onClick={() => { void go(); }}>{submitLabel}</button></div>
    </div>
  );
}
