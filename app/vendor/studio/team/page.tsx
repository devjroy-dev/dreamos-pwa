'use client';
// /wedding/studio/team — Team roster. Prestige-gated.
// List of members with role + phone. Gold FAB → add sheet. Tap row → edit/delete sheet.
// Save button disabled with message if fields invalid. No chat fallback.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchTeam, addTeamMember, updateTeamMember, deleteTeamMember } from '@/lib/vendor/api/vendor';
import type { TeamMember } from '@/lib/vendor/types/vendor';

const D = {
  card: 'rgba(255,255,255,0.035)',
  border: '0.5px solid var(--atelier-card-border)', muted: 'rgba(248,247,245,0.45)',
  cream: 'var(--atelier-ink)', gold: 'var(--atelier-accent-text)', red: '#E07070',
};
const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', backgroundColor: 'rgba(255,255,255,0.04)',
  border: `0.5px solid ${D.border}`, borderRadius: 8, color: D.cream,
  fontFamily: F.body, fontWeight: 300, fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  fontFamily: F.label, fontWeight: 300, fontSize: 9,
  color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6,
};

export default function TeamPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1, background: 'transparent' }} />;
  if (session.tier !== 'prestige') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent' }}>
        <Header vendorName={session.name ?? null} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', gap: 12 }}>
          <p style={{ fontFamily: F.display, fontWeight: 300, fontSize: 26, color: D.cream }}>Team</p>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.muted, lineHeight: 1.6 }}>Team Hub is available on the Prestige plan. Contact Swati to upgrade.</p>
          <button type="button" onClick={() => router.back()} style={{ marginTop: 16, padding: '11px 24px', backgroundColor: 'transparent', border: `0.5px solid ${D.border}`, borderRadius: 999, cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Back</button>
        </div>
      </div>
    );
  }
  return <TeamScreen vendorName={session.name ?? null} />;
}

function TeamScreen({ vendorName }: { vendorName: string | null }) {
  const { toast, show } = useToast();
  const [members, setMembers]     = useState<TeamMember[]>([]);
  const [loading, setLoading]     = useState(true);
  const [sheet, setSheet]         = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected]   = useState<TeamMember | null>(null);
  const [saving, setSaving]       = useState(false);
  // form fields
  const [name, setName]           = useState('');
  const [role, setRole]           = useState('');
  const [phone, setPhone]         = useState('');
  const [rate, setRate]           = useState('');
  const [notes, setNotes]         = useState('');

  useEffect(() => {
    fetchTeam().then(r => { if (r.ok) setMembers((r as { members: TeamMember[] }).members); })
      .finally(() => setLoading(false));
  }, []);

  function openAdd() {
    setName(''); setRole(''); setPhone(''); setRate(''); setNotes('');
    setSheet('add');
  }
  function openEdit(m: TeamMember) {
    setSelected(m);
    setName(m.name); setRole(m.role ?? ''); setPhone(m.phone ?? '');
    setRate(m.daily_rate_inr?.toString() ?? ''); setNotes(m.notes ?? '');
    setSheet('edit');
  }

  async function doAdd() {
    if (!name.trim() || saving) return;
    setSaving(true);
    const res = await addTeamMember({ name: name.trim(), role: role || undefined, phone: phone || undefined, daily_rate_inr: rate ? Number(rate) : undefined, notes: notes || undefined });
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); }
    else { show('Member added', 'success'); setMembers(prev => [...prev, (res as { member: TeamMember }).member]); setSheet(null); }
    setSaving(false);
  }

  async function doEdit() {
    if (!selected || !name.trim() || saving) return;
    setSaving(true);
    const res = await updateTeamMember(selected.id, { name: name.trim(), role: role || undefined, phone: phone || undefined, daily_rate_inr: rate ? Number(rate) : undefined, notes: notes || undefined });
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); }
    else { show('Updated', 'success'); setMembers(prev => prev.map(m => m.id === selected.id ? (res as { member: TeamMember }).member : m)); setSheet(null); }
    setSaving(false);
  }

  async function doDelete() {
    if (!selected || saving) return;
    setSaving(true);
    const res = await deleteTeamMember(selected.id);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); }
    else { show('Removed', 'success'); setMembers(prev => prev.filter(m => m.id !== selected.id)); setSheet(null); }
    setSaving(false);
  }

  const canSave = name.trim().length > 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent', position: 'relative' }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: F.label, fontSize: 10, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading</span>
        </div>
      ) : members.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 40 }}>
          <p style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.cream }}>No team members yet</p>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.muted }}>Tap + to add your crew</p>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {members.map((m, idx) => (
            <div key={m.id} onClick={() => openEdit(m)} style={{
              display: 'flex', alignItems: 'center', padding: '16px 24px', gap: 14, cursor: 'pointer',
              borderBottom: `1px solid ${D.border}`,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-accent-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 16, color: D.gold }}>{m.name.charAt(0).toUpperCase()}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.body, fontWeight: 400, fontSize: 15, color: D.cream }}>{m.name}</div>
                {m.role && <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>{m.role.replace(/_/g, ' ')}</div>}
                {m.phone && <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: D.muted, marginTop: 2 }}>{m.phone}</div>}
              </div>
              {m.daily_rate_inr && <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 11, color: D.muted }}>Rs {m.daily_rate_inr.toLocaleString('en-IN')}/day</span>}
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button type="button" onClick={openAdd} style={{
        position: 'fixed', bottom: 32, right: 24, width: 52, height: 52,
        borderRadius: '50%', backgroundColor: 'var(--atelier-accent-text)', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
        boxShadow: '0 4px 20px var(--atelier-overlay-bg)',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>

      {/* Sheet */}
      {sheet && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => setSheet(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: D.card, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '16px 16px 0 0', padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.cream, marginBottom: 4 }}>{sheet === 'add' ? 'Add Member' : 'Edit Member'}</div>

            <div><div style={labelStyle}>Name *</div><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Rohit Mehta" /></div>
            <div>
              <div style={labelStyle}>Role</div>
              <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="">No role</option>
                <option value="second_shooter">Second Shooter</option>
                <option value="assistant">Assistant</option>
                <option value="editor">Editor</option>
                <option value="runner">Runner</option>
                <option value="videographer">Videographer</option>
                <option value="makeup_artist">Makeup Artist</option>
                <option value="coordinator">Coordinator</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div><div style={labelStyle}>Phone</div><input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9000000000" /></div>
            <div><div style={labelStyle}>Day Rate (Rs)</div><input style={{ ...inputStyle }} type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="5000" /></div>
            <div><div style={labelStyle}>Notes</div><input style={inputStyle} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Available weekends only" /></div>

            {!canSave && <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: D.red, margin: 0 }}>Name is required to save.</p>}

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {sheet === 'edit' && (
                <button type="button" onClick={doDelete} disabled={saving} style={{ flex: 1, padding: '13px 0', backgroundColor: 'transparent', border: `0.5px solid ${D.red}`, borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: D.red, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: saving ? 0.5 : 1 }}>Remove</button>
              )}
              <button type="button" onClick={sheet === 'add' ? doAdd : doEdit} disabled={!canSave || saving} style={{ flex: 2, padding: '13px 0', backgroundColor: canSave && !saving ? D.gold : 'var(--atelier-input-border)', border: 'none', borderRadius: 8, cursor: canSave && !saving ? 'pointer' : 'not-allowed', fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#111', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
