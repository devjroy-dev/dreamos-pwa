"use client";
// v2/app/vendor/(shell)/trends/screen.tsx · CE-47 · PRO · P3 · the Trend room, as approved in pictures 1 and 2: the brief
// for her trade in her city for the last week (counts from enquiries across TDW; no client or vendor is named), what is
// new in her trade with its source, and the weeks before. A brief is made only when at least 10 enquiries went to at
// least 3 vendors that week; TDW approves it, and she sees it from Monday 9:00 am.
// R-47.1: every sentence is simple, formal and complete, with one idea in it.
import { useCallback, useEffect, useState } from 'react';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { errOf } from '@/v2/lib/vendor/api/papers';
import { fetchTrends, fetchWeek, type TrendsRoom, type Brief } from '@/v2/lib/vendor/api/trends';

export function TrendsScreen({ vendorId }: { vendorId: string }) {
  const [room, setRoom] = useState<TrendsRoom | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [week, setWeek] = useState<Brief | null>(null);
  const [weekErr, setWeekErr] = useState<string | null>(null);
  const load = useCallback(async () => {
    const r = await fetchTrends(vendorId);
    if (r.ok) {
      const x = ((r as { room?: Partial<TrendsRoom> }).room || {}) as Partial<TrendsRoom>;
      setRoom({ brief: x.brief || null, past: Array.isArray(x.past) ? x.past : [], made_line: x.made_line || 'TDW makes a new brief every Monday at 9:00 am.', empty: x.empty || null }); setErr(null);
    } else { setErr(errOf(r, 'TDW could not read the Trend room just now. Please try again.')); setRoom({ brief: null, past: [], made_line: 'TDW makes a new brief every Monday at 9:00 am.', empty: null }); }
  }, [vendorId]);
  useEffect(() => { void load(); }, [load]);
  const openWeek = async (id: string) => { setWeekErr(null); const r = await fetchWeek(vendorId, id); if (r.ok && (r as { brief?: Brief }).brief) setWeek((r as { brief: Brief }).brief); else setWeekErr(errOf(r)); };

  if (week) return (<Body>
    <button type="button" className="tr-back" onClick={() => setWeek(null)}>{'‹'} Back to the Trend room</button>
    <BriefView brief={week} />
    <style>{FR_CSS + TR_CSS}</style>
  </Body>);
  const b = room ? room.brief : null;
  return (<Body>
    {room && b ? <BriefView brief={b} made={room.made_line} /> : (<>
      <p className="tr-lede">{room ? room.made_line : ''}</p>
      {room && room.empty ? <p className="tr-txt" data-tr-empty="">{room.empty}</p> : null}
      {!room ? <p className="tr-mute">Reading the Trend room{'…'}</p> : null}
    </>)}
    {err ? <p className="tr-err" role="alert">{err}</p> : null}
    {weekErr ? <p className="tr-err" role="alert">{weekErr}</p> : null}
    {room && room.past.length ? (<>
      <Head text="Past weeks" />
      <Group>{room.past.map((p) => (<div key={p.id} data-tr-week={p.id}><Row title={p.title} chevron onClick={() => void openWeek(p.id)} /></div>))}</Group>
    </>) : null}
    <style>{FR_CSS + TR_CSS}</style>
  </Body>);
}

function BriefView({ brief, made }: { brief: Brief; made?: string }) {
  return (<>
    <p className="tr-lede" data-tr-head="">{brief.head}{made ? ` ${made}` : ''}</p>
    <Head text="What clients asked for" />
    <div className="tr-card" data-tr-brief={brief.id}>
      {brief.lines.map((l) => <p key={l} className="tr-txt">{l}</p>)}
      <p className="tr-mute" data-tr-note="">{brief.note}</p>
    </div>
    {brief.news.length ? (<>
      <Head text="New in your trade" />
      <div className="tr-card tr-news" data-tr-news="">{brief.news.map((n) => (<div key={n.source_url + n.line} className="tr-item">
        <p className="tr-txt">{n.line}</p>
        <a className="tr-link" href={n.source_url} target="_blank" rel="noopener noreferrer">Read it at the source</a>
      </div>))}</div>
    </>) : null}
  </>);
}

const TR_CSS = `
.tr-lede{margin:4px 0 4px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.tr-err{margin:12px 0 0;font:var(--wl-t4);color:var(--role-critical)}
.tr-back{align-self:flex-start;min-height:44px;padding:0;background:transparent;border:0;font:var(--wl-t4);color:var(--atelier-accent-text);touch-action:manipulation}
.tr-card{border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);padding:16px;display:flex;flex-direction:column;gap:10px}
.tr-txt{margin:0;font:var(--wl-t4);color:var(--atelier-ink)}
.tr-mute{margin:0;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.tr-news{gap:0;padding:0}
.tr-item{padding:14px 16px;display:flex;flex-direction:column;gap:6px}
.tr-item + .tr-item{border-top:1px solid var(--atelier-card-border)}
.tr-link{font:var(--wl-t4);color:var(--atelier-accent-text);min-height:32px;display:inline-flex;align-items:center}
`;
