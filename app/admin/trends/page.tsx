'use client';
// app/admin/trends/page.tsx · CE-47 · PRO · P3 app · More > Trend briefs. Every Monday at 01:10 am India time, TDW counts the
// week that ended and saves a draft brief for each trade and city with at least 10 enquiries to at least 3 vendors. The
// admin approves or withholds each draft before 9:00 am, and may add up to three news lines, each with its source.
// Vendors see an approved brief from Monday 9:00 am. Doors: dream-os /api/v2/admin/trends (PRO P3 server).
import { useCallback, useEffect, useState } from 'react';
import { adminGet, adminPost } from '@/lib/admin-api/_base';
import { PageHead, List, PersonRow, Pill, Sheet, SheetNote, ActionStrip, Empty, C, F, fullDate, clock } from '../_components/Kit';

type News = { line: string; source_url: string };
type Brief = { id: string; trade: string; city: string; week_start: string; state: 'draft' | 'approved' | 'withheld'; head: string; lines: string[]; note: string; news: News[]; shows_from: string; decided_by: string | null };
const STATE_WORD = { draft: 'Waiting for you', approved: 'Approved', withheld: 'Withheld' } as const;
const input = { width: '100%', minHeight: 44, padding: '0 12px', borderRadius: 12, border: `0.5px solid ${C.inputLine}`, background: C.input, font: F.t3, color: C.ink, boxSizing: 'border-box' as const };

export default function TrendsAdmin() {
  const [rows, setRows] = useState<Brief[] | null>(null);
  const [lastWeek, setLastWeek] = useState<string>('');
  const [open, setOpen] = useState<Brief | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const load = useCallback(async () => {
    try { const d = await adminGet<{ briefs: Brief[]; last_week: string }>('/api/v2/admin/trends/'); setRows(Array.isArray(d && d.briefs) ? d.briefs : []); setLastWeek(d && d.last_week ? d.last_week : ''); }
    catch (e) { setErr(e instanceof Error ? e.message : 'TDW could not read the briefs.'); setRows([]); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const pick = (b: Brief) => { setErr(null); setOpen(b); setNews(b.news && b.news.length ? b.news : [{ line: '', source_url: '' }]); };
  const decide = async (state: Brief['state']) => {
    if (!open) return; setErr(null);
    try { await adminPost(`/api/v2/admin/trends/${open.id}`, { state, news: news.filter((n) => n.line.trim() || n.source_url.trim()) }); setOpen(null); await load(); }
    catch (e) { setErr(e instanceof Error ? e.message : 'TDW could not save the brief.'); }
  };
  const makeNow = async () => {
    if (!lastWeek) return; setErr(null); setNote(null);
    try { const r = await adminPost<{ made: number; kept: number }>('/api/v2/admin/trends/make', { week_start: lastWeek }); setNote(`TDW counted the week of ${fullDate(lastWeek)}. It made ${r.made} ${r.made === 1 ? 'draft' : 'drafts'}.`); await load(); }
    catch (e) { setErr(e instanceof Error ? e.message : 'TDW could not count that week.'); }
  };
  return (
    <div>
      <PageHead title="Trend briefs" sub="Weekly briefs for the Trend room, approved before Monday 9:00 am" action={lastWeek ? <Pill onClick={() => { void makeNow(); }}>Count last week now</Pill> : undefined} />
      {note ? <p style={{ font: F.t4, color: C.ink, padding: '8px 14px' }}>{note}</p> : null}
      {err && !open ? <p style={{ font: F.t4, color: C.bad, padding: '8px 14px' }}>{err}</p> : null}
      {rows === null ? null : rows.length === 0 ? <Empty>There are no briefs yet. A brief is made only when at least 10 enquiries went to at least 3 vendors in a week.</Empty> : (
        <List>{rows.map((b, i) => (
          <PersonRow key={b.id} name={b.head} tag={STATE_WORD[b.state]} tagTone={b.state === 'approved' ? C.ok : b.state === 'withheld' ? C.bad : C.warn}
            line={`Vendors see it from ${fullDate(b.shows_from)} at ${clock(b.shows_from)}, if it is approved.`} onOpen={() => pick(b)} last={i === rows.length - 1} />))}</List>
      )}
      {open ? (
        <Sheet title={open.head} sub={STATE_WORD[open.state]} onClose={() => setOpen(null)}>
          {open.lines.map((l) => <SheetNote key={l}>{l}</SheetNote>)}
          <SheetNote>{open.note}</SheetNote>
          <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ font: F.t5, color: C.mute }}>News lines for the trade (up to three). Write each as one sentence with a full stop, and add its source.</div>
            {news.map((n, i) => (<div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input style={input} value={n.line} placeholder="A large beauty brand launched a foundation range in 40 shades." onChange={(e) => setNews(news.map((x, j) => (j === i ? { ...x, line: e.target.value } : x)))} />
              <input style={input} value={n.source_url} placeholder="https://" onChange={(e) => setNews(news.map((x, j) => (j === i ? { ...x, source_url: e.target.value } : x)))} />
            </div>))}
            {news.length < 3 ? <button type="button" onClick={() => setNews([...news, { line: '', source_url: '' }])} style={{ alignSelf: 'flex-start', minHeight: 44, background: 'transparent', border: 0, color: C.accent, font: F.t4 }}>Add another news line</button> : null}
          </div>
          {err ? <SheetNote tone={C.bad}>{err}</SheetNote> : null}
          <ActionStrip items={[{ label: 'Approve', primary: true, onClick: () => { void decide('approved'); } }, { label: 'Withhold', onClick: () => { void decide('withheld'); } },
            open.state !== 'draft' ? { label: 'Back to draft', onClick: () => { void decide('draft'); } } : null]} />
        </Sheet>
      ) : null}
    </div>
  );
}
