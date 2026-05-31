'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GoldBtn, GhostBtn, Toast, FieldInput, FieldSelect, SectionDivider } from '../_components/AdminUI';
import { getInvites, getWaLinks, generateInvites, deleteInvite, type InviteCode } from '../../../lib/admin-api/index';

function fmt(d: string) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }); }

export default function InvitesPage() {
  const [invites, setInvites]   = useState<InviteCode[]>([]);
  const [waLinks, setWaLinks]   = useState<{ vendor: string; couple: string }>({ vendor: '', couple: '' });
  const [loading, setLoading]   = useState(true);
  const [showGen, setShowGen]   = useState(false);
  const [toast, setToast]       = useState('');
  const [toastErr, setToastErr] = useState(false);
  const [copied, setCopied]     = useState('');

  // Gen form state
  const [kind, setKind]           = useState('maker');
  const [tier, setTier]           = useState('signature');
  const [phone, setPhone]         = useState('');
  const [name, setName]           = useState('');
  const [notes, setNotes]         = useState('');
  const [count, setCount]         = useState('1');
  const [generating, setGenerating] = useState(false);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([getInvites(), getWaLinks()]).then(([inv, wa]) => {
      setInvites(inv.invites);
      setWaLinks({ vendor: (wa as any).vendor, couple: (wa as any).couple });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(label); setTimeout(() => setCopied(''), 2000); });
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await generateInvites({ kind, tier: tier || undefined, intended_phone: phone.trim() || undefined, name: name.trim() || undefined, notes: notes.trim() || undefined, count: phone.trim() ? 1 : parseInt(count) || 1 });
      setInvites(prev => [...(res as any).codes.map((c: InviteCode) => ({ ...c, created_at: new Date().toISOString(), consumed_at: null, consumed_by_phone: null, created_by: 'admin' })), ...prev]);
      showToast(`${(res as any).codes.length} code${(res as any).codes.length > 1 ? 's' : ''} generated.`);
      setShowGen(false); setPhone(''); setName(''); setNotes(''); setCount('1');
    } catch { showToast('Failed to generate.', true); }
    finally { setGenerating(false); }
  };

  const remove = async (code: string) => {
    try { await deleteInvite(code); setInvites(prev => prev.filter(i => i.code !== code)); showToast('Code deleted.'); }
    catch { showToast('Failed to delete.', true); }
  };

  const active   = invites.filter(i => !i.consumed_at);
  const consumed = invites.filter(i => i.consumed_at);

  return (
    <div>
      <PageHeader title="Invites" sub="WhatsApp links + web codes" action={<GoldBtn label={showGen ? 'Close' : 'Generate'} onClick={() => setShowGen(s => !s)} />} />

      {/* Generate form — inline, no sheet */}
      {showGen && (
        <div style={{ background: T.card, border: `0.5px solid ${T.borderStrong}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <p style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 10, color: T.gold, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 16 }}>Generate Codes</p>
          <FieldSelect label="Kind" value={kind} onChange={setKind} options={[{ value: 'maker', label: 'Maker (Vendor)' }, { value: 'dreamer', label: 'Dreamer (Couple)' }]} />
          <FieldSelect label="Tier" value={tier} onChange={setTier} options={[{ value: 'trial', label: 'Trial' }, { value: 'essential', label: 'Essential' }, { value: 'signature', label: 'Signature' }, { value: 'prestige', label: 'Prestige' }]} />
          <FieldInput label="Phone (required for web sign-in)" value={phone} onChange={setPhone} placeholder="+91…" />
          {phone.trim() && <FieldInput label="Name (required with phone)" value={name} onChange={setName} placeholder="Kavya Sharma" />}
          <FieldInput label="Notes (optional)" value={notes} onChange={setNotes} placeholder="VIP, founding cohort…" />
          {!phone && <FieldInput label="Count (max 50)" value={count} onChange={setCount} type="number" />}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <GhostBtn label="Cancel" onClick={() => setShowGen(false)} />
            <GoldBtn label={generating ? 'Generating…' : 'Generate'} onClick={generate} disabled={generating || (!!phone.trim() && !name.trim())} />
          </div>
        </div>
      )}

      {/* WA Links */}
      <div style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <p style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 10, color: T.soft, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 16 }}>WhatsApp Onboarding Links</p>
        <p style={{ fontFamily: T.ff.body, fontSize: 12, color: T.muted, marginBottom: 16, lineHeight: 1.5 }}>Share these numbers. When someone messages, the agent onboards them automatically. No invite code needed.</p>
        {[['Vendor (Maker)', waLinks.vendor], ['Couple (Dreamer)', waLinks.couple]].map(([label, link]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `0.5px solid ${T.border}` }}>
            <div>
              <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.ink, marginBottom: 2 }}>{label}</div>
              <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft }}>{link}</div>
            </div>
            <button onClick={() => copy(link, label)} style={{ background: copied === label ? T.goldSoft : 'rgba(255,255,255,0.05)', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '10px 16px', fontFamily: T.ff.label, fontWeight: 600, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: copied === label ? T.gold : T.soft, minHeight: 44, minWidth: 80 }}>
              {copied === label ? 'Copied!' : 'Copy'}
            </button>
          </div>
        ))}
      </div>

      {/* Active codes */}
      <SectionDivider label={`Active Codes (${active.length})`} />
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>{[1,2].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 10, height: 64 }} />)}</div>
      ) : active.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 16 }}>No active codes</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {active.map(inv => (
            <div key={inv.code} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: '"Courier New", monospace', fontSize: 16, color: T.gold, letterSpacing: '0.15em', marginBottom: 4 }}>{inv.code}</div>
                <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.soft, letterSpacing: '0.1em' }}>
                  {inv.kind.toUpperCase()} · {inv.tier || 'no tier'}{inv.intended_phone ? ` · ${inv.intended_phone}` : ''}{inv.notes ? ` · ${inv.notes}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => copy(inv.code, inv.code)} style={{ background: 'transparent', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: copied === inv.code ? T.gold : T.soft, minHeight: 44 }}>{copied === inv.code ? '✓' : 'Copy'}</button>
                <button onClick={() => remove(inv.code)} style={{ background: 'transparent', border: `0.5px solid ${T.dangerSoft}`, borderRadius: 8, padding: '10px 14px', fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: T.danger, minHeight: 44 }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {consumed.length > 0 && (
        <>
          <SectionDivider label={`Used (${consumed.length})`} />
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
            {consumed.slice(0, 10).map(inv => (
              <div key={inv.code} style={{ background: 'rgba(255,255,255,0.02)', border: `0.5px solid ${T.border}`, borderRadius: 10, padding: '12px 14px', opacity: 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: '"Courier New", monospace', fontSize: 13, color: T.soft }}>{inv.code}</span>
                  <span style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted }}>{fmt(inv.consumed_at!)}</span>
                </div>
                {inv.consumed_by_phone && <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted, marginTop: 2 }}>Used by {inv.consumed_by_phone}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
