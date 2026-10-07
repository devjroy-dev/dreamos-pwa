'use client';
// v2/components/vendor/hub/HubMine.tsx · CE-47 · HUB-2 · THE MINE TAB (HUB-1 design, as approved; no check label).
// Reads GET /api/v2/vendor/hub/mine. Four parts, in order:
//   My calls       her calls; a tap opens the call's responses (the room's existing interior); "Mark filled" on an open one
//   I applied      calls she said she is interested in, with the poster's name as a link to their page
//   Waiting for your yes   a credit someone gave her: Yes or No (POST /hub/credits/:id/yes|no). Nothing shows until yes.
//   Worked with    shoots both sides said yes to; every name is a link to that person's page
// "+ A shoot we did together" opens the sheet (ShootTogetherSheet). What used to be "My posts" lives here.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { patchJson } from '@/lib/vendor/api/_base';
import { fmtDate } from '@/lib/vendor/collabFormat';
import { HUB, arr, fetchMine, answerCredit, linkProps, type MineReply, type NameLink } from '@/v2/lib/vendor/hub';
import { HUB_CSS } from './HubPeople';
import { ShootTogetherSheet } from './ShootTogetherSheet';

export function HubMine({ reloadKey = 0, onChanged }: { reloadKey?: number; onChanged?: () => void }) {
  const router = useRouter();
  const [d, setD] = useState<MineReply | null>(null);
  const [sheet, setSheet] = useState(false);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const [tick, setTick] = useState(0);
  const load = () => { setTick((t) => t + 1); if (onChanged) onChanged(); };   // the tab's count re-reads too
  useEffect(() => {
    let live = true;
    fetchMine().then((r) => { if (live) setD(r && r.ok ? { ...r, my_calls: arr(r.my_calls), applied: arr(r.applied), waiting_for_your_yes: arr(r.waiting_for_your_yes), worked_with: arr(r.worked_with).map((l) => ({ ...l, with: arr(l.with) })) } : null); }).catch(() => { if (live) setD(null); });
    return () => { live = false; };
  }, [reloadKey, tick]);

  async function answer(id: string, yes: boolean) {
    if (busy) return; setBusy(id); setNote('');
    const r = await answerCredit(id, yes).catch(() => ({ ok: false, error: 'Could not save. Try again.' } as { ok: boolean; error?: string }));
    setBusy(null);
    if (!r.ok) { setNote(r.error || 'Could not save. Try again.'); return; }
    load();
  }
  async function markFilled(id: string) {
    if (busy) return; setBusy(id);
    try { await patchJson(`/api/v2/vendor/collab/${encodeURIComponent(id)}`, { state: 'filled' }); } catch { /* the list re-reads either way */ }
    setBusy(null); load();
  }

  if (!d) return <p className="hub-note">Loading…</p>;
  return (
    <div data-hub-mine="">
      <style>{HUB_CSS + MINE_CSS}</style>
      <h2 className="hub-h">{HUB.mine.myCalls(d.my_calls.length)}</h2>
      {d.my_calls.length === 0 ? <p className="hub-note">{HUB.mine.noCalls}</p> : (
        <div className="hub-card hub-list">
          {d.my_calls.map((c) => {
            const open = c.state === 'open';
            return (
              <div key={c.id} className="hub-row">
                <button type="button" className="hub-rowbtn" onClick={() => router.push('/vendor/collab/' + c.id + '/responses')}>
                  <span className="hub-name">{c.details || 'A call'}</span>
                  <span className="hub-facts">{[c.line, fmtDate(c.event_date), HUB.mine.interested(c.interested), c.picked ? HUB.mine.picked(c.picked) : null, open ? null : HUB.mine.closed].filter(Boolean).join(' · ')}</span>
                  <span className="hub-chev" aria-hidden="true">{'›'}</span>
                </button>
                {open && <button type="button" className="hub-btn q" disabled={busy === c.id} onClick={() => void markFilled(c.id)}>{HUB.mine.markFilled}</button>}
              </div>);
          })}
        </div>)}

      {d.applied.length > 0 && (<>
        <h2 className="hub-h">{HUB.mine.applied(d.applied.length)}</h2>
        <div className="hub-card hub-list">
          {d.applied.map((a) => (
            <div key={a.id} className="hub-row">
              <div className="hub-name">{a.call} <span className={'hub-pill' + (a.state === 'accepted' ? '' : ' grey')}>{a.words}</span></div>
              <div className="hub-facts">{a.from && <><Name n={a.from} />{' · '}</>}{[a.event_date ? fmtDate(a.event_date) : null, a.city].filter(Boolean).join(' · ')}</div>
            </div>))}
        </div></>)}

      {d.waiting_for_your_yes.length > 0 && (<>
        <h2 className="hub-h">{HUB.mine.yourYes(d.waiting_for_your_yes.length)}</h2>
        {d.waiting_for_your_yes.map((c) => (
          <article key={c.id} className="hub-card" data-hub-your-yes="">
            <p className="hub-note">{c.from ? <><Name n={c.from} />{' says you worked on this shoot:'}</> : 'Someone says you worked on this shoot:'}</p>
            <div className="hub-name">{c.shoot_words}</div>
            <p className="hub-small">{HUB.mine.yesNote}</p>
            <div className="hub-btns">
              <button type="button" className="hub-btn p" disabled={busy === c.id} onClick={() => void answer(c.id, true)}>{HUB.mine.yes}</button>
              <button type="button" className="hub-btn s" disabled={busy === c.id} onClick={() => void answer(c.id, false)}>{HUB.mine.no}</button>
            </div>
          </article>))}</>)}

      <h2 className="hub-h">{HUB.mine.worked(d.worked_with.length)}</h2>
      {d.worked_with.length === 0 ? <p className="hub-note">{HUB.mine.noWorked}</p> : (
        <div className="hub-card hub-list">
          {d.worked_with.map((l) => (
            <div key={l.key} className="hub-row">
              <div className="hub-name">{[l.shoot_name, l.city, l.month_words].filter(Boolean).join(' · ')}</div>
              <div className="hub-facts">{HUB.mine.with}{' '}{l.with.map((w, i) => <span key={(w.page_url || w.name) + i}>{i ? ', ' : ''}<Name n={w} /></span>)}
                {l.from_call ? ` · ${HUB.mine.fromCall}` : ''}</div>
            </div>))}
        </div>)}
      <div className="hub-btns">
        <button type="button" className="hub-btn s hub-wide" data-hub-shoot-open="" onClick={() => setSheet(true)}>{HUB.shoot.open}</button>
      </div>
      {note && <p className="hub-small bad" role="alert">{note}</p>}
      {sheet && <ShootTogetherSheet onClose={() => setSheet(false)} onSent={(line) => { setSheet(false); setNote(line || ''); load(); }} />}
    </div>
  );
}

/** A name that is a link to the person's page when there is one. */
function Name({ n }: { n: NameLink }) {
  const lp = linkProps(n.page_url);
  return lp ? <a {...lp} className="hub-inline">{n.name}</a> : <>{n.name}</>;
}

const MINE_CSS = `
.hub-h{margin:20px 0 8px;font:var(--wl-t2);color:var(--atelier-ink)}
.hub-list{padding:4px 16px}
.hub-row{padding:12px 0;border-top:1px solid var(--atelier-card-border)}
.hub-row:first-child{border-top:0}
.hub-rowbtn{position:relative;display:flex;flex-direction:column;align-items:flex-start;width:100%;min-height:48px;padding:0 24px 0 0;border:0;background:transparent;text-align:left;cursor:pointer;color:inherit}
.hub-chev{position:absolute;right:0;top:50%;transform:translateY(-50%);font:var(--wl-t2);color:var(--atelier-ink-mute)}
.hub-row .hub-btn.q{margin-top:8px}
.hub-inline{color:var(--atelier-accent-text);text-decoration:underline;text-underline-offset:3px}
.hub-wide{width:100%;margin-top:16px}
`;
