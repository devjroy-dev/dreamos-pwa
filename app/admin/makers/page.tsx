'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GoldBtn, GhostBtn, Toast, FieldInput, FieldSelect, BottomSheet, SectionDivider } from '../_components/AdminUI';
import { getVendors, patchVendorTier, patchVendorDiscover, patchVendorRevoke, type AdminVendor } from '../../../lib/admin-api/index';

const API_BASE  = process.env.NEXT_PUBLIC_API_BASE  || 'https://dream-os-production.up.railway.app';
const ADMIN_PWD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';
const WA_VENDOR = '917982159047';

const TIERS = ['trial','essential','signature','prestige'];
const CATEGORIES = ['photography','videography','makeup','decor','venue','planning','catering','mehendi','music','jewellery','attire','honeymoon','invitation','other'];

function fmt(d: string) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }); }

export default function MakersPage() {
  const [vendors, setVendors]     = useState<AdminVendor[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('all');
  const [toast, setToast]         = useState('');
  const [toastErr, setToastErr]   = useState(false);
  const [selected, setSelected]   = useState<AdminVendor | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  // Invite form
  const [invName, setInvName]     = useState('');
  const [invPhone, setInvPhone]   = useState('');
  const [invCat, setInvCat]       = useState('');
  const [invCity, setInvCity]     = useState('');
  const [invTier, setInvTier]     = useState('trial');
  const [inviting, setInviting]   = useState(false);
  const [inviteResult, setInviteResult] = useState<{ name: string; waLink: string } | null>(null);
  const [copied, setCopied]       = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getVendors().then(d => { setVendors(d.vendors); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const setTier = async (id: string, tier: string) => {
    try { await patchVendorTier(id, tier); setVendors(v => v.map(x => x.id === id ? { ...x, tier } : x)); showToast('Tier updated.'); }
    catch { showToast('Failed to update tier.', true); }
  };

  const toggleDiscover = async (v: AdminVendor) => {
    try { await patchVendorDiscover(v.id); setVendors(vs => vs.map(x => x.id === v.id ? { ...x, discover_eligible: !v.discover_eligible } : x)); showToast(v.discover_eligible ? 'Removed from Discover.' : 'Added to Discover.'); }
    catch { showToast('Failed.', true); }
  };

  const revoke = async (id: string) => {
    try { await patchVendorRevoke(id); setVendors(v => v.map(x => x.id === id ? { ...x, status: 'paused' } : x)); showToast('Access revoked.'); setSelected(null); }
    catch { showToast('Failed.', true); }
  };

  const deleteVendor = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/v2/admin/vendors/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PWD },
        body: JSON.stringify({ confirm: true }),
      });
      if (!res.ok) throw new Error('Failed');
      setVendors(v => v.filter(x => x.id !== id));
      showToast('Vendor deleted.');
      setSelected(null);
    } catch { showToast('Failed to delete.', true); }
  };

  const invite = async () => {
    if (!invName.trim() || !invPhone.trim()) return;
    setInviting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v2/admin/vendors/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PWD },
        body: JSON.stringify({
          business_name: invName.trim(),
          phone: invPhone.trim(),
          category: invCat || undefined,
          city: invCity.trim() || undefined,
          tier: invTier,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      const waLink = `https://wa.me/${WA_VENDOR}?text=Hi`;
      setInviteResult({ name: invName.trim(), waLink });
      load();
      setInvName(''); setInvPhone(''); setInvCat(''); setInvCity(''); setInvTier('signature');
    } catch (e: any) {
      showToast(e.message || 'Failed to invite.', true);
    } finally {
      setInviting(false);
    }
  };

  const copyInvite = () => {
    if (!inviteResult) return;
    const msg = `Hey ${inviteResult.name} — tap this link to get started with your chief of staff: ${inviteResult.waLink}`;
    navigator.clipboard.writeText(msg).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const filtered = vendors.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !search || v.name?.toLowerCase().includes(q) || v.phone?.includes(search);
    const matchFilter = filter === 'all' || v.tier === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <PageHeader
        title="Makers"
        sub={`${vendors.length} total vendors`}
        action={<GoldBtn label="+ Invite" onClick={() => { setShowInvite(true); setInviteResult(null); }} />}
      />

      <FieldInput label="Search" value={search} onChange={setSearch} placeholder="Name or phone…" />

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto' as const, paddingBottom: 4, scrollbarWidth: 'none' as const }}>
        {['all', ...TIERS].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 20, border: `0.5px solid ${filter === f ? T.gold : T.border}`, background: filter === f ? 'rgba(201,168,76,0.1)' : 'transparent', fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: filter === f ? T.gold : T.soft, minHeight: 36 }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {[1,2,3].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 72 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 18 }}>No vendors found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {filtered.map(v => (
            <div key={v.id} onClick={() => setSelected(v)} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', minHeight: 72 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 400, color: T.ink, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
                <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.1em' }}>{v.category || '—'} · {v.city || '—'} · {v.phone}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                <span style={{ fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: T.gold, background: 'rgba(201,168,76,0.1)', border: `0.5px solid rgba(201,168,76,0.3)`, borderRadius: 20, padding: '3px 10px' }}>{v.tier}</span>
                {v.discover_eligible && <span style={{ fontFamily: T.ff.label, fontSize: 7, color: T.success, letterSpacing: '0.1em' }}>● Discover</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manage vendor sheet */}
      <BottomSheet visible={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''}>
        {selected && (
          <div>
            <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.15em', marginBottom: 20 }}>{selected.phone} · Joined {fmt(selected.created_at)}</div>
            <div style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, color: T.soft, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 10 }}>Set Tier</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' as const }}>
              {TIERS.map(t => (
                <button key={t} onClick={() => { setTier(selected.id, t); setSelected(s => s ? { ...s, tier: t } : s); }} style={{ padding: '10px 18px', borderRadius: 20, border: `0.5px solid ${selected.tier === t ? T.gold : T.border}`, background: selected.tier === t ? 'rgba(201,168,76,0.1)' : 'transparent', fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: selected.tier === t ? T.gold : T.soft, minHeight: 44 }}>{t}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <GhostBtn label={selected.discover_eligible ? 'Remove from Discover' : 'Add to Discover'} onClick={() => { toggleDiscover(selected); setSelected(s => s ? { ...s, discover_eligible: !s.discover_eligible } : s); }} />
            </div>
            <GhostBtn label="Revoke Access" onClick={() => revoke(selected.id)} danger />
            <div style={{ height: 1, background: 'rgba(224,92,92,0.15)', margin: '16px 0' }} />
            <GhostBtn label="Delete Permanently" onClick={() => deleteVendor(selected.id)} danger />
            <p style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted, letterSpacing: '0.1em', marginTop: 8 }}>Deletes all vendor data — leads, invoices, events, portfolio. Cannot be undone.</p>
          </div>
        )}
      </BottomSheet>

      {/* Invite by phone sheet */}
      <BottomSheet visible={showInvite} onClose={() => { setShowInvite(false); setInviteResult(null); }} title="Invite a Maker">

        {inviteResult ? (
          /* ── Success state ── */
          <div>
            <div style={{ background: 'rgba(92,224,160,0.08)', border: `0.5px solid rgba(92,224,160,0.3)`, borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.success, marginBottom: 6 }}>✓ {inviteResult.name} has been invited.</div>
              <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.1em' }}>Vendor row created. Send them the link below.</div>
            </div>

            <div style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.soft, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 10 }}>Share with {inviteResult.name}</div>
              <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.ink, lineHeight: 1.7, marginBottom: 16 }}>
                Hey {inviteResult.name} — tap this link to get started with your chief of staff:<br />
                <span style={{ color: T.gold }}>{inviteResult.waLink}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={copyInvite}
                  style={{ flex: 1, background: copied ? 'rgba(92,224,160,0.1)' : T.card, border: `0.5px solid ${copied ? 'rgba(92,224,160,0.4)' : T.border}`, borderRadius: 10, padding: '12px 0', fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: copied ? T.success : T.soft, minHeight: 44 }}
                >
                  {copied ? '✓ Copied' : 'Copy Message'}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hey ${inviteResult.name} — tap this link to get started with your chief of staff: ${inviteResult.waLink}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ flex: 1, background: T.gold, border: 'none', borderRadius: 10, padding: '12px 0', fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#0A0908', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                >
                  Send via WA
                </a>
              </div>
            </div>

            <GhostBtn label="Invite Another" onClick={() => setInviteResult(null)} />
          </div>
        ) : (
          /* ── Form state ── */
          <div>
            <FieldInput label="Name" value={invName} onChange={setInvName} placeholder="Kavya Sharma" />
            <FieldInput label="WhatsApp Number" value={invPhone} onChange={setInvPhone} placeholder="+918757788550" />
            <FieldSelect
              label="Category (optional)"
              value={invCat}
              onChange={setInvCat}
              options={[{ value: '', label: 'Select category' }, ...CATEGORIES.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))]}
            />
            <FieldInput label="City (optional)" value={invCity} onChange={setInvCity} placeholder="Mumbai" />
            <FieldSelect
              label="Starting Tier"
              value={invTier}
              onChange={setInvTier}
              options={[{ value: 'trial', label: 'Trial' }, { value: 'essential', label: 'Essential' }, { value: 'signature', label: 'Signature (recommended)' }, { value: 'prestige', label: 'Prestige' }]}
            />
            <div style={{ paddingBottom: 12, marginTop: 4 }}>
              <GoldBtn
                label={inviting ? 'Creating…' : 'Create & Get Link'}
                onClick={invite}
                disabled={inviting || !invName.trim() || !invPhone.trim()}
              />
            </div>
          </div>
        )}
      </BottomSheet>

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
