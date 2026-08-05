'use client';
// /wedding/studio/team — Team roster. Prestige-gated.
// List of members with role + phone. Gold FAB → add sheet. Tap row → edit/delete sheet.
// Save button disabled with message if fields invalid. No chat fallback.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { fetchMemberAssignments, MemberAssignment } from '@/lib/vendor/api/roster';
import { confirmationWord, confirmationTone, ASSIGNMENTS_ERROR_MSG } from '@/lib/vendor/assignmentWords';
import { slotWord, hhmm } from '@/lib/vendor/slotWords';
import { selectStyle } from '@/lib/vendor/controls';
import { Header } from '@/components/vendor/Header';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchTeam, addTeamMember, updateTeamMember, deleteTeamMember, rotateTeamMemberToken } from '@/lib/vendor/api/vendor';
import type { TeamMember } from '@/lib/vendor/types/vendor';

const D = {
  // TDW_09 F-09.28 — THE SPECIMEN THAT SHARPENED THE FINDING.
  // This was a hardcoded near-transparent white over a hardcoded black scrim, with
  // its ink read from `--atelier-ink`, which themes. On Espresso that composites to
  // #12100E and the form ink reads 15.33:1. On Editorial Paper the same two literals
  // composite to #504F4D while the ink flips DARK — form ink 2.30:1, labels 2.95:1,
  // the SAVE/REMOVE pair 2.62:1, and the member rows behind the veil 2.09:1, which
  // is what the founder's walk saw and read as a layout collision. Nothing was
  // colliding. Neither literal was individually wrong. The PAIR inverted.
  card: 'var(--role-sheet)',
  // TDW_09 F-09.34 — COLOUR ONLY, and renamed from `border` on purpose.
  // It used to hold the whole shorthand ('0.5px solid var(...)') while most
  // readers re-prefixed it, producing '0.5px solid 0.5px solid var(...)': a
  // declaration that parses, then becomes INVALID AT COMPUTED-VALUE TIME once
  // var() substitutes, so `border` computes to its initial value and NO EDGE
  // RENDERS AT ALL. 22 sites across 5 files. The rename is the guard: any
  // reader I failed to migrate is now a tsc error, not a silent missing border.
  borderCol: 'var(--atelier-card-border)', muted: 'var(--atelier-ink-mute)',
  cream: 'var(--atelier-ink)', gold: 'var(--atelier-accent-text)', red: 'var(--role-critical)',
};
const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
};

  // TDW_09 R-S2/R-S3 — the FIELD boundary, not the card hairline. `card-border`
  // is a panel edge (1.79:1 espresso / 1.40:1 paper); a control's edge has to
  // clear WCAG 1.4.11's 3:1 or the control is not identifiable as one. On paper
  // the fill cannot help — inputBg over the white sheet is 1.09:1 — so this edge
  // is the only thing that says `field`.
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', backgroundColor: 'var(--atelier-input-bg)',
  border: `0.5px solid var(--atelier-input-border)`, borderRadius: 8, color: D.cream,
  fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, outline: 'none', boxSizing: 'border-box',
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
          <p style={{ fontFamily: F.display, fontWeight: 300, fontSize: 25, lineHeight: 1.5, color: D.cream }}>Team</p>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: D.muted, lineHeight: 1.6 }}>Team Hub is available on the Prestige plan. Contact Swati to upgrade.</p>
          <button type="button" onClick={() => router.back()} style={{ marginTop: 16, padding: '11px 24px', backgroundColor: 'transparent', border: `0.5px solid ${D.borderCol}`, borderRadius: 999, cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Back</button>
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
  // The member's board, fetched when the sheet opens. Read-only.
  const [assignments, setAssignments]     = useState<MemberAssignment[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);
  // THREE states, not two. Loaded-and-empty and could-not-load are different
  // facts and the screen must not conflate them.
  const [assignError, setAssignError]     = useState(false);
  const [saving, setSaving]       = useState(false);
  // form fields
  const [name, setName]           = useState('');
  const [role, setRole]           = useState('');
  const [phone, setPhone]         = useState('');
  const [rate, setRate]           = useState('');
  const [notes, setNotes]         = useState('');
  // TDW_04.5 P3 — the crew-page actions live INSIDE the edit sheet (CE ruling F10(b)):
  // the row's only affordance is already "open the sheet", and adding a second one
  // would mint an interaction model this app does not otherwise have. Zero new gestures.
  const [confirmRotate, setConfirmRotate] = useState(false);

  useEffect(() => {
    fetchTeam().then(r => { if (r.ok) setMembers((r as { members: TeamMember[] }).members); })
      .finally(() => setLoading(false));
  }, []);

  function openAdd() {
    setName(''); setRole(''); setPhone(''); setRate(''); setNotes('');
    setConfirmRotate(false);
    setSheet('add');
  }
  // "2 Aug" — the crew page's own register, so the two surfaces read alike.
  function fmtAssignDate(iso: string): string {
    try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
    catch { return iso; }
  }

  function openEdit(m: TeamMember) {
    setSelected(m);
    setConfirmRotate(false);
    setName(m.name); setRole(m.role ?? ''); setPhone(m.phone ?? '');
    setRate(m.daily_rate_inr?.toString() ?? ''); setNotes(m.notes ?? '');
    setSheet('edit');
    // Fetched per-open rather than cached: the owner may have just assigned them
    // on another screen, and a stale board is worse than a moment's spinner.
    setAssignments([]); setAssignError(false); setAssignLoading(true);
    fetchMemberAssignments(m.id)
      .then(r => {
        // A non-ok body is a FAILURE, not an empty board. getJson does not throw
        // on a 404 — it returns the envelope — so the ok flag is the only thing
        // that distinguishes "none" from "could not tell".
        if (r && r.ok) setAssignments(r.assignments || []);
        else setAssignError(true);
      })
      .catch(() => setAssignError(true))
      .finally(() => setAssignLoading(false));
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

  // ── THE CREW PAGE, distribution half (spec §P3:66) ──────────────────────
  // The link is built from THIS APP'S OWN ORIGIN, never from API_BASE (CE ruling F6):
  // API_BASE points at the dream-os backend on Railway, and the crew page is a route
  // in this PWA. window.location.origin is correct in production, in preview builds and
  // locally, and needs no env var. Named consequence: on the demo subdomain the minted
  // link is visibly dead (middleware.ts:47 rewrites /crew/* to /demo/not-found there)
  // rather than quietly wrong.
  function crewUrl(m: TeamMember) {
    return `${window.location.origin}/crew/${m.page_token}`;
  }
  function sendPage(m: TeamMember) {
    const text  = `Your assignments with ${vendorName ?? 'us'}: ${crewUrl(m)}`;
    const digits = (m.phone || '').replace(/[^0-9]/g, '');
    // No phone on file -> open WhatsApp with the message and let the vendor pick the
    // contact, rather than refusing the action or inventing a number.
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }

  async function doRotate() {
    if (!selected || saving) return;
    setSaving(true);
    const res = await rotateTeamMemberToken(selected.id);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); }
    else {
      const updated = (res as { member: TeamMember }).member;
      show('New link created.', 'success');
      setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
      setSelected(updated);
      setConfirmRotate(false);
    }
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
          <p style={{ fontFamily: F.display, fontWeight: 300, fontSize: 20, lineHeight: 1.5, color: D.cream }}>No team members yet</p>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted }}>Tap + to add your crew</p>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {members.map((m, idx) => (
            <div key={m.id} onClick={() => openEdit(m)} style={{
              display: 'flex', alignItems: 'center', padding: '16px 24px', gap: 14, cursor: 'pointer',
              borderBottom: `1px solid ${D.borderCol}`,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-accent-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.gold }}>{m.name.charAt(0).toUpperCase()}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.body, fontWeight: 400, fontSize: 16, lineHeight: 1.5, color: D.cream }}>{m.name}</div>
                {m.role && <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>{m.role.replace(/_/g, ' ')}</div>}
                {m.phone && <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted, marginTop: 2 }}>{m.phone}</div>}
              </div>
              {m.daily_rate_inr && <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted }}>Rs {m.daily_rate_inr.toLocaleString('en-IN')} per event</span>}
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--role-scrim)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => setSheet(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: D.card, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '16px 16px 0 0', padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: 20, lineHeight: 1.5, color: D.cream, marginBottom: 4 }}>{sheet === 'add' ? 'Add Member' : 'Edit Member'}</div>

            <div><div style={labelStyle}>Name *</div><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Rohit Mehta" /></div>
            <div>
              <div style={labelStyle}>Role</div>
              <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle(inputStyle)}>
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
            <div><div style={labelStyle}>Rate per event (Rs)</div><input style={{ ...inputStyle }} type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="5000" /></div>
            <div><div style={labelStyle}>Notes</div><input style={inputStyle} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Available weekends only" /></div>

            {/* ── ASSIGNMENTS (TDW_04.5 P4, founder-chartered) ──────────────
                Clicking a member used to tell the owner nothing about what they
                were on — he had to walk the calendar and read the marks. The
                crew page already renders this exact set for the MEMBER; the
                owner now sees the same thing, from the SAME assembly.

                READ-ONLY, deliberately. Assignment happens in the booking
                pickers, through the events PATCH that routes to eventWrite. A
                second write path to the calendar from here is exactly what the
                one-writer law forbids. */}
            {sheet === 'edit' && selected && (
              <div style={{ borderTop: `0.5px solid ${D.borderCol}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={labelStyle}>Assignments</div>
                {assignLoading ? (
                  <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted }}>Loading…</div>
                ) : assignError ? (
                  <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.red }}>{ASSIGNMENTS_ERROR_MSG}</div>
                ) : assignments.length === 0 ? (
                  <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted }}>No assignments yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {assignments.map(a => (
                      <div key={a.event_id} style={{ borderLeft: `2px solid ${confirmationTone(a.confirmation)}`, paddingLeft: 12 }}>
                        <div style={{ fontFamily: F.body, fontWeight: 400, fontSize: 16, lineHeight: 1.5, color: D.cream }}>
                          {fmtAssignDate(a.date)}{slotWord(a.slot) ? ` · ${slotWord(a.slot)}` : ''}{hhmm(a.call_time) ? ` · ${hhmm(a.call_time)}` : ''}
                        </div>
                        <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.cream, marginTop: 2 }}>
                          {a.title}{a.wedding ? ` — ${a.wedding}` : ''}
                        </div>
                        <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: confirmationTone(a.confirmation), marginTop: 4 }}>
                          {confirmationWord(a.confirmation)}
                        </div>
                        {/* The note travels only on a decline in practice, but it
                            is rendered whenever it exists — a reason the member
                            took the trouble to write should not be swallowed. */}
                        {a.note && (
                          <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted, marginTop: 3, fontStyle: 'italic' }}>
                            {a.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {sheet === 'edit' && selected && (
              <div style={{ borderTop: `0.5px solid ${D.borderCol}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={labelStyle}>Crew page</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={() => sendPage(selected)} style={{ flex: 1, padding: '11px 0', backgroundColor: 'transparent', border: `0.5px solid ${D.borderCol}`, borderRadius: 8, cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: D.cream, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Send page</button>
                  <button type="button" onClick={() => setConfirmRotate(true)} disabled={saving} style={{ flex: 1, padding: '11px 0', backgroundColor: 'transparent', border: `0.5px solid ${D.borderCol}`, borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: saving ? 0.5 : 1 }}>Rotate link</button>
                </div>
                {/* Rotation is irreversible and immediate, so it is asked before it is
                    done — the warning is the whole reason the second tap exists. */}
                {confirmRotate && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted, margin: 0 }}>The old link stops working.</p>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="button" onClick={() => setConfirmRotate(false)} disabled={saving} style={{ flex: 1, padding: '10px 0', backgroundColor: 'transparent', border: `0.5px solid ${D.borderCol}`, borderRadius: 8, cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Cancel</button>
                      <button type="button" onClick={doRotate} disabled={saving} style={{ flex: 1, padding: '10px 0', backgroundColor: 'transparent', border: `0.5px solid ${D.red}`, borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: D.red, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: saving ? 0.5 : 1 }}>Rotate link</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!canSave && <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.red, margin: 0 }}>Name is required to save.</p>}

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {sheet === 'edit' && (
                <button type="button" onClick={doDelete} disabled={saving} style={{ flex: 1, padding: '13px 0', backgroundColor: 'transparent', border: `0.5px solid ${D.red}`, borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: D.red, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: saving ? 0.5 : 1 }}>Remove</button>
              )}
              <button type="button" onClick={sheet === 'add' ? doAdd : doEdit} disabled={!canSave || saving} style={{ flex: 2, padding: '13px 0', /* TDW_09 F-09.38 — a DISABLED FILL, not a boundary. `--atelier-input-border` is
                     the 3:1 control-edge role (R-S3); wearing it as a surface made
                     the dead SAVE read as a dusty slab whose colour meant nothing.
                     `section-bg` is the recessed-surface role and themes with it. */
                backgroundColor: canSave && !saving ? D.gold : 'var(--atelier-section-bg)', border: 'none', borderRadius: 8, cursor: canSave && !saving ? 'pointer' : 'not-allowed', fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#111', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
