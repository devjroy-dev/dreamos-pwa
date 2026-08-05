'use client';
// components/vendor/NotesBody.tsx — TDW_06 P7d (item 4): the owner_notes body, ONE source of truth.
// The chrome-free notes surface (list · search · create · detail sheet · Send-to-Chat · delete).
// Rendered by BOTH the business-screen NOTES tab (app/vendor/list/[slice]/notes.tsx) and the
// studio door (app/vendor/studio/notes/page.tsx) — same reader (GET /api/v2/vendor/notes via
// fetchNotes), same render, so the two doors can never diverge. No Header here: each caller
// supplies its own chrome (the tab bar on the business screen; the studio hub's own frame).
//
// TAP-TO-VICTOR is the 128f882 signpost, unchanged: "Send to Chat" -> router.push('/vendor?draft='
// + encodeURIComponent(body)). The chat screen feeds ?draft= into InputBar initialValue (composer
// prefill, visible text, NO hidden injection) and clears the param. It lands in the CURRENT room
// at the CURRENT mode — this component neither knows nor changes victor_mode.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchNotes, createNote, deleteNote, type OwnerNote } from '@/lib/vendor/api/vendor';

const D = {
  border: '0.5px solid var(--atelier-card-border)', muted: 'var(--atelier-ink-mute)',
  cream: 'var(--atelier-ink)', red: 'var(--role-critical)',
};
const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', backgroundColor: 'var(--atelier-input-bg)',
  border: `0.5px solid ${D.border}`, borderRadius: 8, color: D.cream,
  fontFamily: F.body, fontWeight: 300, fontSize: 14, outline: 'none', boxSizing: 'border-box',
};

function fmtDate(iso: string): string {
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
  catch { return ''; }
}

export function NotesBody() {
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent', position: 'relative', minHeight: 0 }}>
      <Toast toast={toast} />

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
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(note => (
            // TDW_06 P7e: a paper card via the design system's own .atelier-card class, so it
            // wears each theme's card treatment (bg · border · lift · the per-theme inset
            // highlight) — dark, light and flair all correct, nothing hardcoded. The only
            // note-specific touches: a thin accent margin-rule down the left (the jotted
            // notebook cue) and compact padding + a 2-line clamp so more notes fit. Date kept,
            // quiet, in the corner — all colours are theme tokens.
            <div key={note.id} onClick={() => setSelected(note)} className="atelier-card" style={{
              borderLeft: '2px solid var(--atelier-accent-text)',
              padding: '10px 13px 11px 15px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <div style={{
                flex: 1, minWidth: 0,
                fontFamily: F.body, fontWeight: 300, fontSize: 13.5, color: 'var(--atelier-ink)', lineHeight: 1.45,
                overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>{note.body}</div>
              <span style={{
                fontFamily: F.label, fontSize: 8.5, color: 'var(--atelier-ink-mute)',
                letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0, paddingTop: 2, whiteSpace: 'nowrap',
              }}>{fmtDate(note.created_at)}</span>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button type="button" onClick={() => setAddOpen(true)} aria-label="New note" style={{
        position: 'fixed', bottom: 'calc(80px + env(safe-area-inset-bottom))', right: 24, width: 52, height: 52,
        borderRadius: '50%', backgroundColor: 'var(--atelier-accent-text)', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
        boxShadow: '0 4px 20px var(--atelier-overlay-bg)',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>

      {/* Detail sheet */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, display: 'flex', alignItems: 'flex-end', background: 'var(--atelier-overlay-bg)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', background: 'var(--atelier-sheet-top)',
            borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTop: '0.5px solid var(--atelier-card-border)',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
            padding: '0 0 calc(24px + env(safe-area-inset-bottom))',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--atelier-label)' }} />
            </div>
            <div style={{ padding: '14px 24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: D.cream, margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selected.body}</p>
              <span style={{ fontFamily: F.label, fontSize: 9, color: 'var(--atelier-accent-text)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>{fmtDate(selected.created_at)}</span>
              <button type="button" onClick={() => router.push('/vendor?draft=' + encodeURIComponent(selected.body))} style={{
                width: '100%', padding: '13px 0', background: 'var(--atelier-accent-text)', border: 'none', borderRadius: 999,
                cursor: 'pointer', fontFamily: F.label, fontWeight: 400, fontSize: 10,
                color: '#111111', letterSpacing: '0.3em', textTransform: 'uppercase',
              }}>Send to Chat</button>
              <button type="button" onClick={() => doDelete(selected)} disabled={saving} style={{
                width: '100%', padding: '13px 0',
                background: saving ? 'rgba(122,26,26,0.4)' : 'rgba(180,40,40,0.18)',
                border: '0.5px solid rgba(224,112,112,0.4)', borderRadius: 999,
                cursor: saving ? 'default' : 'pointer', fontFamily: F.label, fontWeight: 400, fontSize: 10,
                color: D.red, letterSpacing: '0.3em', textTransform: 'uppercase',
              }}>{saving ? 'Working…' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Create sheet */}
      {addOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, display: 'flex', alignItems: 'flex-end', background: 'var(--atelier-overlay-bg)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} onClick={() => setAddOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', background: 'var(--atelier-sheet-top)',
            borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTop: '0.5px solid var(--atelier-card-border)',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
            padding: '0 0 calc(24px + env(safe-area-inset-bottom))',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--atelier-label)' }} />
            </div>
            <div style={{ padding: '14px 24px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.cream }}>Note to Self</div>
              <textarea
                value={draft} onChange={e => setDraft(e.target.value)} autoFocus rows={4}
                placeholder="Jot it down — just for you"
                style={{ ...inputStyle, resize: 'none', minHeight: 96, lineHeight: 1.5 }}
              />
              <button type="button" onClick={doCreate} disabled={!canSave || saving} style={{
                width: '100%', padding: '13px 0',
                background: canSave && !saving ? 'var(--atelier-accent-text)' : 'var(--atelier-input-border)',
                border: 'none', borderRadius: 999, cursor: canSave && !saving ? 'pointer' : 'not-allowed',
                fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#111111', letterSpacing: '0.3em', textTransform: 'uppercase',
              }}>{saving ? 'Saving…' : 'Save Note'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
