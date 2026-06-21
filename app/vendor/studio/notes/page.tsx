'use client';
// /vendor/studio/notes — Notes to Self. The owner's scratchpad.
// Raw thoughts the owner jots (via the "just do it" toggle on the chat bar) land here.
// This is the owner's own hand: he creates them, searches them, deletes them. The agents
// never write here. Dedicated, searchable, newest-first. Not prestige-gated.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchNotes, createNote, deleteNote, type OwnerNote } from '@/lib/vendor/api/vendor';

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

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch { return ''; }
}

export default function NotesPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1, background: 'transparent' }} />;
  return <NotesScreen vendorName={session.name ?? null} />;
}

function NotesScreen({ vendorName }: { vendorName: string | null }) {
  const { toast, show } = useToast();
  const router = useRouter();
  const [notes, setNotes]     = useState<OwnerNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState('');
  const [selected, setSelected] = useState<OwnerNote | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft]     = useState('');
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    fetchNotes().then(r => {
      if (r.ok) setNotes((r as { notes: OwnerNote[] }).notes);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = query.trim()
    ? notes.filter(n => n.body.toLowerCase().includes(query.trim().toLowerCase()))
    : notes;

  async function doCreate() {
    const body = draft.trim();
    if (!body || saving) return;
    setSaving(true);
    const res = await createNote(body);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); }
    else {
      show('Noted', 'success');
      setNotes(prev => [(res as { note: OwnerNote }).note, ...prev]);
      setAddOpen(false); setDraft('');
    }
    setSaving(false);
  }

  async function doDelete(note: OwnerNote) {
    setSaving(true);
    const res = await deleteNote(note.id);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); }
    else { show('Deleted', 'success'); setNotes(prev => prev.filter(n => n.id !== note.id)); setSelected(null); }
    setSaving(false);
  }

  const canSave = draft.trim().length > 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent', position: 'relative' }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      {/* Search */}
      <div style={{ padding: '14px 24px 10px', flexShrink: 0 }}>
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search your notes"
          style={{ ...inputStyle, borderRadius: 999, fontFamily: F.body }}
        />
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: F.label, fontSize: 10, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', gap: 8 }}>
          <span style={{ fontFamily: F.display, fontWeight: 300, fontStyle: 'italic', fontSize: 20, color: D.cream }}>
            {query.trim() ? 'Nothing matches' : 'No notes yet'}
          </span>
          {!query.trim() && (
            <span style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.muted, lineHeight: 1.6, maxWidth: 260 }}>
              Anything you jot to yourself lands here — a thought to pick up later, kept just for you.
            </span>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(note => (
            <div key={note.id} onClick={() => setSelected(note)} style={{
              padding: '16px 24px', borderBottom: `1px solid ${D.border}`, cursor: 'pointer',
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: F.body, fontWeight: 300, fontSize: 15, color: D.cream, lineHeight: 1.5,
                  overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>{note.body}</div>
              </div>
              <span style={{ fontFamily: F.label, fontSize: 9, color: D.muted, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0, paddingTop: 3 }}>{fmtDate(note.created_at)}</span>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button type="button" onClick={() => setAddOpen(true)} aria-label="New note" style={{
        position: 'fixed', bottom: 32, right: 24, width: 52, height: 52,
        borderRadius: '50%', backgroundColor: 'var(--atelier-accent-text)', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
        boxShadow: '0 4px 20px var(--atelier-overlay-bg)',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>

      {/* Detail sheet */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: D.card, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '16px 16px 0 0', padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: D.cream, margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selected.body}</p>
            <span style={{ fontFamily: F.label, fontSize: 9, color: D.muted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{fmtDate(selected.created_at)}</span>
            <button type="button" onClick={() => router.push('/vendor?draft=' + encodeURIComponent(selected.body))} style={{
              padding: '12px 0', backgroundColor: D.gold, border: 'none', borderRadius: 8,
              cursor: 'pointer', fontFamily: F.label, fontWeight: 400, fontSize: 10,
              color: '#111', letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>Send to Chat</button>
            <button type="button" onClick={() => doDelete(selected)} disabled={saving} style={{
              padding: '12px 0', backgroundColor: 'transparent', border: `0.5px solid ${D.red}`, borderRadius: 8,
              cursor: saving ? 'default' : 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10,
              color: D.red, letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>Delete</button>
          </div>
        </div>
      )}

      {/* Create sheet */}
      {addOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => setAddOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: D.card, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '16px 16px 0 0', padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.cream }}>Note to Self</div>
            <textarea
              value={draft} onChange={e => setDraft(e.target.value)} autoFocus rows={4}
              placeholder="Jot it down — just for you"
              style={{ ...inputStyle, resize: 'none', minHeight: 96, lineHeight: 1.5 }}
            />
            <button type="button" onClick={doCreate} disabled={!canSave || saving} style={{
              padding: '13px 0', backgroundColor: canSave && !saving ? D.gold : 'var(--atelier-input-border)',
              border: 'none', borderRadius: 8, cursor: canSave && !saving ? 'pointer' : 'not-allowed',
              fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#111', letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>{saving ? 'Saving…' : 'Save Note'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
