'use client';
// v2/components/vendor/hub/HubWork.tsx · CE-47 · HUB-2 · THE WORK TAB (HUB-1 design, as approved; no check label).
// Reads GET /api/v2/vendor/hub/work: open calls for her craft in her city, newest first ("All cities" widens the city,
// never the craft). Briefs from brands, planners' paid jobs and From Threads are not in yet; the tab says so in words
// rather than looking empty. "I am interested" uses the Collab room's own respond door. Handles and websites are links.
import { useEffect, useState } from 'react';
import { labelFor } from '@/lib/frost/categoryLabels';
import { fmtDate, fmtBudget } from '@/lib/vendor/collabFormat';
import { HUB, arr, fetchWork, sayInterested, linkProps, siteWords, type WorkItem } from '@/v2/lib/vendor/hub';
import { HUB_CSS } from './HubPeople';

export function HubWork() {
  const [all, setAll] = useState(false);
  const [items, setItems] = useState<WorkItem[] | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [notYet, setNotYet] = useState<string[]>([]);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<{ id: string; text: string } | null>(null);

  useEffect(() => {
    let live = true;
    fetchWork(all).then((d) => {
      if (!live) return;
      if (!d.ok) { setItems([]); return; }
      setItems(arr(d.items)); setRoles(arr(d.roles)); setCity(d.city || null); setNotYet(arr(d.not_yet));
    }).catch(() => { if (live) setItems([]); });
    return () => { live = false; };
  }, [all]);

  async function interested(id: string) {
    if (busy) return; setBusy(id); setErr(null);
    const r = await sayInterested(id).catch(() => ({ ok: false, error: 'Could not send. Try again.' } as { ok: boolean; error?: string }));
    setBusy(null);
    if (r.ok) setSent((s) => new Set(s).add(id)); else setErr({ id, text: r.error || 'Could not send. Try again.' });
  }

  const roleWords = roles.map((r) => labelFor(r).toLowerCase()).join(', ');
  return (
    <div data-hub-work="">
      <style>{HUB_CSS + WORK_CSS}</style>
      <p className="hub-note" data-hub-work-line="">{HUB.work.line(roleWords, city, all)}</p>
      <div className="hub-chips">
        <button type="button" className={'hub-chip' + (all ? ' on' : '')} aria-pressed={all} onClick={() => setAll((v) => !v)}>{HUB.work.allCities}</button>
      </div>
      {items === null ? <p className="hub-note">Loading…</p>
        : items.length === 0 ? <p className="hub-note">{HUB.work.empty}</p>
        : items.map((c) => {
          const ig = c.instagram ? linkProps(c.instagram.url) : null;
          const web = c.website ? linkProps(c.website.url) : null;
          const page = linkProps(c.page_url);
          const needs = arr(c.roles).map((r) => labelFor(r.role).toLowerCase() + (r.needed > 1 ? ` (${r.needed})` : '')).join(', ');
          const pay = HUB.work.pay(c.pay_kind, c.budget_inr ? fmtBudget(c.budget_inr) : null);
          return (
            <article key={c.id} className="hub-card" data-hub-call="">
              <div className="hub-eyebrow">{HUB.work.call}</div>
              <div className="hub-name">{HUB.work.needs(c.from, needs || 'someone')}</div>
              <div className="hub-facts">{[c.details, fmtDate(c.event_date), c.city, pay].filter(Boolean).join(' · ')}</div>
              {(ig || web || page) && (
                <div className="hub-links">
                  {page && <a {...page}>{c.from}</a>}
                  {ig && c.instagram && <a {...ig}>{HUB.instagram(c.instagram.handle)}</a>}
                  {web && c.website && <a {...web}>{siteWords(c.website.url)}</a>}
                </div>)}
              {sent.has(c.id)
                ? <p className="hub-small" role="status">{HUB.work.sent}</p>
                : <div className="hub-btns"><button type="button" className="hub-btn p" disabled={busy === c.id} onClick={() => void interested(c.id)}>{HUB.work.interested}</button></div>}
              {err && err.id === c.id && <p className="hub-small bad" role="alert">{err.text}</p>}
            </article>);
        })}
      {notYet.length > 0 && <p className="hub-small">{HUB.work.notYet(notYet)}</p>}
    </div>
  );
}

const WORK_CSS = `.hub-eyebrow{font:var(--wl-t5);color:var(--atelier-ink-mute);margin-bottom:4px}`;
