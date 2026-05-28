'use client';
// /wedding/studio/tasks — Task board. Prestige-gated.
// Mobile: tab-based (Open / In Progress / Done).
// Tap card → state advance sheet. Gold FAB → create task sheet.
// Save disabled with message if title empty.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchTasks, createTask, updateTask, deleteTask, fetchTeam } from '@/lib/vendor/api/vendor';
import type { TeamTask, TeamMember } from '@/lib/vendor/types/vendor';

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

const PRIORITY_COLOR: Record<string, string> = {
  low: 'rgba(248,247,245,0.3)', normal: D.muted, high: '#E0A870', urgent: D.red,
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

type TabState = 'open' | 'in_progress' | 'done';

export default function TasksPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1, background: 'transparent' }} />;
  if (session.tier !== 'prestige') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent' }}>
        <Header vendorName={session.name ?? null} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', gap: 12 }}>
          <p style={{ fontFamily: F.display, fontWeight: 300, fontSize: 26, color: D.cream }}>Tasks</p>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.muted, lineHeight: 1.6 }}>Team Hub is available on the Prestige plan. Contact Swati to upgrade.</p>
          <button type="button" onClick={() => router.back()} style={{ marginTop: 16, padding: '11px 24px', backgroundColor: 'transparent', border: `0.5px solid ${D.border}`, borderRadius: 999, cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Back</button>
        </div>
      </div>
    );
  }
  return <TasksScreen vendorName={session.name ?? null} />;
}

function TasksScreen({ vendorName }: { vendorName: string | null }) {
  const { toast, show } = useToast();
  const [tab, setTab]             = useState<TabState>('open');
  const [tasks, setTasks]         = useState<TeamTask[]>([]);
  const [members, setMembers]     = useState<TeamMember[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState<TeamTask | null>(null);
  const [addOpen, setAddOpen]     = useState(false);
  const [saving, setSaving]       = useState(false);
  // create form
  const [title, setTitle]           = useState('');
  const [desc, setDesc]             = useState('');
  const [assignedId, setAssignedId] = useState('');
  const [dueDate, setDueDate]       = useState('');
  const [priority, setPriority]     = useState('normal');

  useEffect(() => {
    Promise.all([
      fetchTasks({ state: 'all' }),
      fetchTeam(),
    ]).then(([tr, mr]) => {
      if (tr.ok) setTasks((tr as { tasks: TeamTask[] }).tasks);
      if (mr.ok) setMembers((mr as { members: TeamMember[] }).members);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = tasks.filter(t => t.state === tab);

  async function doCreate() {
    if (!title.trim() || saving) return;
    setSaving(true);
    const res = await createTask({ title: title.trim(), description: desc || undefined, assigned_to_member_id: assignedId || undefined, due_date: dueDate || undefined, priority });
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); }
    else { show('Task created', 'success'); setTasks(prev => [(res as { task: TeamTask }).task, ...prev]); setAddOpen(false); setTitle(''); setDesc(''); setAssignedId(''); setDueDate(''); setPriority('normal'); }
    setSaving(false);
  }

  async function doDeleteTask(task: TeamTask) {
    setSaving(true);
    const res = await deleteTask(task.id);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); }
    else { show('Task deleted', 'success'); setTasks(prev => prev.filter(t => t.id !== task.id)); setSelected(null); }
    setSaving(false);
  }

  async function advanceState(task: TeamTask, nextState: 'in_progress' | 'done' | 'cancelled') {
    setSaving(true);
    const res = await updateTask(task.id, { state: nextState });
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); }
    else { show('Updated', 'success'); setTasks(prev => prev.map(t => t.id === task.id ? (res as { task: TeamTask }).task : t)); setSelected(null); }
    setSaving(false);
  }

  const canCreate = title.trim().length > 0;

  const TAB_LABELS: { key: TabState; label: string }[] = [
    { key: 'open', label: 'Open' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent', position: 'relative' }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${D.border}`, flexShrink: 0 }}>
        {TAB_LABELS.map(t => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '14px 0', backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: F.label, fontWeight: tab === t.key ? 400 : 300, fontSize: 10,
            color: tab === t.key ? D.gold : D.muted,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            borderBottom: tab === t.key ? `1.5px solid ${D.gold}` : '1.5px solid transparent',
          }}>{t.label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: F.label, fontSize: 10, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.muted }}>No {tab.replace('_', ' ')} tasks</span>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(task => (
            <div key={task.id} onClick={() => setSelected(task)} style={{
              padding: '16px 24px', borderBottom: `1px solid ${D.border}`, cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F.body, fontWeight: 400, fontSize: 15, color: D.cream }}>{task.title}</div>
                  {task.description && <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: D.muted, marginTop: 3, lineHeight: 1.5 }}>{task.description}</div>}
                  <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                    {task.team_members && <span style={{ fontFamily: F.label, fontSize: 9, color: D.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{task.team_members.name}</span>}
                    {task.due_date && <span style={{ fontFamily: F.label, fontSize: 9, color: task.due_date < new Date().toISOString().slice(0,10) ? D.red : D.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Due {task.due_date}</span>}
                  </div>
                </div>
                <span style={{ fontFamily: F.label, fontSize: 8, color: PRIORITY_COLOR[task.priority], letterSpacing: '0.15em', textTransform: 'uppercase', flexShrink: 0, paddingTop: 2 }}>{task.priority}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button type="button" onClick={() => setAddOpen(true)} style={{
        position: 'fixed', bottom: 32, right: 24, width: 52, height: 52,
        borderRadius: '50%', backgroundColor: 'var(--atelier-accent-text)', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
        boxShadow: '0 4px 20px var(--atelier-overlay-bg)',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>

      {/* Task detail / advance sheet */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: D.card, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '16px 16px 0 0', padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.cream }}>{selected.title}</div>
            {selected.description && <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.muted, margin: 0, lineHeight: 1.5 }}>{selected.description}</p>}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              {selected.team_members && <span style={{ fontFamily: F.label, fontSize: 9, color: D.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{selected.team_members.name}</span>}
              {selected.due_date && <span style={{ fontFamily: F.label, fontSize: 9, color: D.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Due {selected.due_date}</span>}
              <span style={{ fontFamily: F.label, fontSize: 9, color: PRIORITY_COLOR[selected.priority], letterSpacing: '0.1em', textTransform: 'uppercase' }}>{selected.priority}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selected.state === 'open' && <button type="button" onClick={() => advanceState(selected, 'in_progress')} disabled={saving} style={{ flex: 1, padding: '12px 0', backgroundColor: 'transparent', border: '0.5px solid var(--atelier-accent-text)', borderRadius: 8, cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: 'var(--atelier-accent-text)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Start</button>}
              {(selected.state === 'open' || selected.state === 'in_progress') && <button type="button" onClick={() => advanceState(selected, 'done')} disabled={saving} style={{ flex: 1, padding: '12px 0', backgroundColor: 'var(--atelier-accent-text)', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#111', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Mark Done</button>}
              {selected.state !== 'cancelled' && selected.state !== 'done' && <button type="button" onClick={() => advanceState(selected, 'cancelled')} disabled={saving} style={{ flex: 1, padding: '12px 0', backgroundColor: 'transparent', border: `0.5px solid ${D.red}`, borderRadius: 8, cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: D.red, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Cancel</button>}
              {(selected.state === 'cancelled' || selected.state === 'done') && <button type="button" onClick={() => doDeleteTask(selected)} disabled={saving} style={{ flex: 1, padding: '12px 0', backgroundColor: 'transparent', border: `0.5px solid ${D.red}`, borderRadius: 8, cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: D.red, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Delete</button>}
            </div>
          </div>
        </div>
      )}

      {/* Create sheet */}
      {addOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => setAddOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: D.card, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '16px 16px 0 0', padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.cream }}>New Task</div>
            <div><div style={labelStyle}>Title *</div><input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Edit highlight reel" /></div>
            <div><div style={labelStyle}>Description</div><input style={inputStyle} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Optional details" /></div>
            <div>
              <div style={labelStyle}>Assign To</div>
              <select value={assignedId} onChange={e => setAssignedId(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="">Unassigned</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}{m.role ? ` — ${m.role.replace(/_/g,' ')}` : ''}</option>)}
              </select>
            </div>
            <div><div style={labelStyle}>Due Date</div><input style={inputStyle} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
            <div>
              <div style={labelStyle}>Priority</div>
              <select value={priority} onChange={e => setPriority(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            {!canCreate && <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: D.red, margin: 0 }}>Title is required to save.</p>}
            <button type="button" onClick={doCreate} disabled={!canCreate || saving} style={{ padding: '13px 0', backgroundColor: canCreate && !saving ? D.gold : 'var(--atelier-input-border)', border: 'none', borderRadius: 8, cursor: canCreate && !saving ? 'pointer' : 'not-allowed', fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#111', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {saving ? 'Saving…' : 'Create Task'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
