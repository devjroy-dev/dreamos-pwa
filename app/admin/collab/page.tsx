'use client';
// app/admin/collab/page.tsx · CE-47 · CLB-1 · THE ADMIN'S COLLAB CALLS (cures F-44.300: this page called a door
// nothing served, and read columns no table holds). Three tabs, ADM-1's kit, plain words:
//   Waiting   — calls going to TDW's own Instagram and Threads; Post or Do not post, one at a time.
//   Done      — the last 30 decided, with what happened ("Posted", "Not posted", Meta's reason).
//   Prospects — people not on TDW (name, craft, city, Instagram, Threads, where found, date added, opted out).
//               RULE 2: this list is never used to tag anyone; it decides which crafts and cities TDW posts for,
//               and the admin sends a call to a person herself with "Copy the call".
import { useEffect, useState } from 'react';
import { adminGet, adminPost, adminPatch } from '@/lib/admin-api/_base';
import { C, F, PageHead, Tabs, List, Empty, PersonRow, ActionStrip, Sheet, SheetRow, SheetNote, fullDate, when } from '../_components/Kit';

type Post = { id: string; requirement_type: string; event_date: string; city: string; event_type: string | null; details: string | null } | null;
type Share = { id: string; post_id: string; platform: 'instagram' | 'threads'; state: string; caption: string; hashtags: string[]; image_url: string | null; permalink: string | null; error: string | null; created_at: string; decided_at: string | null; post: Post; vendor_name: string | null };
type Prospect = { id: string; name: string; craft: string | null; city: string | null; instagram_handle: string | null; threads_handle: string | null; source: string | null; opted_out: boolean; created_at: string };

const W = {
  title: 'Collab calls',
  sub: 'Calls going to TDW\u2019s Instagram and Threads, and people to send them to',
  waiting: 'Waiting', done: 'Done', prospects: 'Prospects',
  where: (p: string) => (p === 'instagram' ? 'TDW Instagram' : 'TDW Threads'),
  post: 'Post', dont: 'Do not post', copy: 'Copy the call', copied: 'Copied',
  state: { approved: 'Posting now', published: 'Posted', rejected: 'Not posted', failed: 'Not posted yet' } as Record<string, string>,
  none: 'Nothing is waiting.', noneDone: 'Nothing decided yet.', noneP: 'No prospects yet.',
  add: 'Add a prospect', name: 'Name', craft: 'Craft', city: 'City', ig: 'Instagram', th: 'Threads', source: 'Where found', save: 'Save',
  optOut: 'Opted out', optIn: 'Not opted out', rule: 'This list is never used to tag anyone. Send a call to a person yourself.',
  open: 'Open the post', failed: 'Something went wrong. Try again.',
};

// THE FOUNDER'S RULE (CE-47, 6 October 2026): every Instagram or Threads handle is a link that opens the profile, never
// plain text. Handles are normalised to letters, digits, dot and underscore; the address is always https.
const handleOf = (h: string | null) => { const v = String(h || '').trim().replace(/^@+/, '').toLowerCase(); return /^[a-z0-9._]{1,30}$/.test(v) ? v : null; };
function ProfileLinks({ ig, th }: { ig: string | null; th: string | null }) {
  const i = handleOf(ig); const t = handleOf(th);
  if (!i && !t) return null;
  const st = { font: F.t4, color: C.accent, textDecoration: 'underline', textUnderlineOffset: 3, minHeight: 44, display: 'inline-flex', alignItems: 'center' } as const;
  return (
    <div style={{ display: 'flex', gap: 16, padding: '0 14px 4px', flexWrap: 'wrap' }} data-clb-profile-links="">
      {i && <a href={`https://www.instagram.com/${i}/`} target="_blank" rel="noopener noreferrer" style={st}>Instagram {i}</a>}
      {t && <a href={`https://www.threads.com/@${t}`} target="_blank" rel="noopener noreferrer" style={st}>Threads {t}</a>}
    </div>
  );
}

export default function AdminCollabPage() {
  const [tab, setTab] = useState<'waiting' | 'done' | 'prospects'>('waiting');
  const [queue, setQueue] = useState<Share[] | null>(null);
  const [decided, setDecided] = useState<Share[]>([]);
  const [prospects, setProspects] = useState<Prospect[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', craft: '', city: '', instagram_handle: '', threads_handle: '', source: '' });

  const load = () => adminGet<{ queue: Share[]; decided: Share[] }>('/api/v2/admin/collab')
    .then(d => { setQueue(d.queue || []); setDecided(d.decided || []); }).catch(() => { setQueue([]); setNote(W.failed); });
  const loadP = () => adminGet<{ prospects: Prospect[] }>('/api/v2/admin/collab/prospects')
    .then(d => setProspects(d.prospects || [])).catch(() => { setProspects([]); setNote(W.failed); });
  useEffect(() => { load(); loadP(); }, []);

  async function decide(s: Share, how: 'approve' | 'reject') {
    setBusy(s.id + how); setNote('');
    try { await adminPost(`/api/v2/admin/collab/shares/${s.id}/${how}`, {}); await load(); } catch { setNote(W.failed); } finally { setBusy(null); }
  }
  async function copyCall(postId: string) {
    setBusy('copy' + postId);
    try { const d = await adminGet<{ text: string }>(`/api/v2/admin/collab/posts/${postId}/share-text`); await navigator.clipboard.writeText(d.text); setNote(W.copied); }
    catch { setNote(W.failed); } finally { setBusy(null); }
  }
  async function saveProspect() {
    if (!draft.name.trim()) return;
    setBusy('add');
    try { await adminPost('/api/v2/admin/collab/prospects', draft); setAdding(false); setDraft({ name: '', craft: '', city: '', instagram_handle: '', threads_handle: '', source: '' }); await loadP(); }
    catch { setNote(W.failed); } finally { setBusy(null); }
  }
  async function toggleOpt(p: Prospect) {
    setBusy(p.id);
    try { await adminPatch(`/api/v2/admin/collab/prospects/${p.id}`, { opted_out: !p.opted_out }); await loadP(); } catch { setNote(W.failed); } finally { setBusy(null); }
  }

  const callLine = (s: Share) => (s.post ? `${fullDate(s.post.event_date)} \u00B7 ${s.post.city}` : '');
  const input = (k: keyof typeof draft, label: string) => (
    <label key={k} style={{ display: 'block', padding: '8px 18px' }}>
      <span style={{ display: 'block', font: F.t5, color: C.mute, marginBottom: 4 }}>{label}</span>
      <input value={draft[k]} onChange={e => setDraft(d => ({ ...d, [k]: e.target.value }))}
             style={{ width: '100%', minHeight: 44, background: C.input, border: `0.5px solid ${C.inputLine}`, borderRadius: 10, padding: '0 12px', color: C.ink, font: F.t3 }} />
    </label>
  );

  return (
    <div data-clb-admin="">
      <PageHead title={W.title} sub={W.sub} action={tab === 'prospects' ? <button type="button" onClick={() => setAdding(true)} style={{ minHeight: 44, padding: '0 14px', borderRadius: 12, border: 'none', background: C.primary, color: C.onPrimary, font: F.t5, fontWeight: 600 }}>+ {W.add}</button> : undefined} />
      <Tabs value={tab} onChange={k => setTab(k as typeof tab)} items={[
        { key: 'waiting', label: W.waiting, n: queue ? queue.length : null },
        { key: 'done', label: W.done },
        { key: 'prospects', label: W.prospects, n: prospects ? prospects.length : null },
      ]} />
      {note && <p style={{ font: F.t4, color: C.soft, padding: '8px 2px' }}>{note}</p>}

      {tab === 'waiting' && (queue && queue.length === 0 ? <Empty>{W.none}</Empty> : (
        <List>
          {(queue || []).map((s, i) => (
            <PersonRow key={s.id} name={`${W.where(s.platform)} \u00B7 ${s.vendor_name || ''}`} line={callLine(s)} last={i === (queue || []).length - 1}>
              {s.image_url && <img src={s.image_url} alt="" style={{ display: 'block', width: 120, borderRadius: 10, margin: '0 14px 8px' }} />}
              <pre style={{ whiteSpace: 'pre-wrap', font: F.t4, color: C.soft, padding: '0 14px 10px', margin: 0 }}>{s.caption}</pre>
              <ActionStrip items={[
                { label: W.post, primary: true, busy: busy === s.id + 'approve', onClick: () => decide(s, 'approve') },
                { label: W.dont, busy: busy === s.id + 'reject', onClick: () => decide(s, 'reject') },
                { label: W.copy, busy: busy === 'copy' + s.post_id, onClick: () => copyCall(s.post_id) },
              ]} />
            </PersonRow>
          ))}
        </List>
      ))}

      {tab === 'done' && (decided.length === 0 ? <Empty>{W.noneDone}</Empty> : (
        <List>
          {decided.map((s, i) => (
            <PersonRow key={s.id} name={`${W.where(s.platform)} \u00B7 ${s.vendor_name || ''}`} tag={W.state[s.state] || s.state}
                       tagTone={s.state === 'published' ? C.ok : s.state === 'failed' ? C.warn : C.mute}
                       line={[callLine(s), s.error, s.decided_at ? when(s.decided_at) : ''].filter(Boolean).join(' \u00B7 ')} last={i === decided.length - 1}>
              <ActionStrip items={[
                s.permalink ? { label: W.open, href: s.permalink } : null,
                s.state === 'failed' ? { label: W.post, primary: true, busy: busy === s.id + 'approve', onClick: () => decide(s, 'approve') } : null,
                { label: W.copy, busy: busy === 'copy' + s.post_id, onClick: () => copyCall(s.post_id) },
              ]} />
            </PersonRow>
          ))}
        </List>
      ))}

      {tab === 'prospects' && (
        <>
          <p style={{ font: F.t4, color: C.mute, padding: '4px 2px 10px' }}>{W.rule}</p>
          {prospects && prospects.length === 0 ? <Empty>{W.noneP}</Empty> : (
            <List>
              {(prospects || []).map((p, i) => (
                <PersonRow key={p.id} name={p.name} tag={p.opted_out ? W.optOut : null} tagTone={C.warn}
                           line={[p.craft, p.city, p.source, fullDate(p.created_at)].filter(Boolean).join(' \u00B7 ')}
                           last={i === (prospects || []).length - 1}>
                  <ProfileLinks ig={p.instagram_handle} th={p.threads_handle} />
                  <ActionStrip items={[{ label: p.opted_out ? W.optIn : W.optOut, busy: busy === p.id, onClick: () => toggleOpt(p) }]} />
                </PersonRow>
              ))}
            </List>
          )}
        </>
      )}

      {adding && (
        <Sheet title={W.add} onClose={() => setAdding(false)}>
          {input('name', W.name)}{input('craft', W.craft)}{input('city', W.city)}{input('instagram_handle', W.ig)}{input('threads_handle', W.th)}{input('source', W.source)}
          <SheetNote>{W.rule}</SheetNote>
          <SheetRow label={W.save} busy={busy === 'add'} onClick={saveProspect} />
        </Sheet>
      )}
    </div>
  );
}
