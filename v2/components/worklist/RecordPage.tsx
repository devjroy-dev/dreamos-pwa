"use client";
// components/worklist/RecordPage.tsx · DESIGN-1 · STAGE 5a · THE RECORD PAGE'S PARTS (lib/worklist/record.ts). The enquiry
// and the client draw the same shape, top to bottom: the back link, the status (the name is the page's head, drawn by the
// shell with its "?"), the next action as one button, then Dates, Money, Notes and History, and last the small jobs.
// Tokens and rungs only. No sheet opens another sheet: each page holds at most one open.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { RECORD, dayOf, takeListScroll, type HistoryItem } from '@/v2/lib/worklist/record';

/** Back to the list: history back when the list opened this page (it saved its place), else the list itself. */
export function BackLink({ list, label }: { list: string; label: string }) {
  const router = useRouter();
  return (
    <Link href={list} className="rp-back" data-record-back=""
      onClick={(e) => {
        let fromList = false;
        try { fromList = sessionStorage.getItem(`tdw_list_scroll:${list}`) != null; } catch { /* fine */ }
        if (fromList && window.history.length > 1) { e.preventDefault(); router.back(); }
      }}>
      {'‹'} {RECORD.back(label)}
    </Link>
  );
}

export function Status({ text }: { text: string }) {
  return text ? <p className="rp-status" data-record-status="">{text}</p> : null;
}

export function NextButton({ label, onClick, href, external }: { label: string; onClick?: () => void; href?: string; external?: boolean }) {
  if (href) return <a className="rp-next" data-record-next="" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{label}</a>;
  return <button type="button" className="rp-next" data-record-next="" onClick={onClick}>{label}</button>;
}

export function Section({ head, id, children }: { head: string; id: string; children: ReactNode }) {
  return (
    <section className="rp-sec" data-record-section={id} aria-label={head}>
      <h2 className="rp-h">{head}</h2>
      {children}
    </section>
  );
}

export function Facts({ rows }: { rows: ReadonlyArray<[string, string | null | undefined]> }) {
  const shown = rows.filter(([, v]) => v);
  if (!shown.length) return <p className="rp-none">{RECORD.none}</p>;
  return (
    <dl className="rp-facts">
      {shown.map(([k, v]) => (<div key={k} className="rp-fact"><dt>{k}</dt><dd>{v}</dd></div>))}
    </dl>
  );
}

export function History({ items }: { items: readonly HistoryItem[] }) {
  if (!items.length) return <p className="rp-none">{RECORD.none}</p>;
  const who = (k: HistoryItem['kind']) => (k === 'in' ? RECORD.hFrom : k === 'out' ? RECORD.hTo : k === 'note' ? RECORD.hNote : '');
  return (
    <ol className="rp-hist">
      {items.map((h, i) => (
        <li key={i} data-history-kind={h.kind}>
          <span className="rp-when">{[dayOf(h.at), who(h.kind)].filter(Boolean).join(' · ')}</span>
          <span className="rp-what">{h.text}</span>
        </li>
      ))}
    </ol>
  );
}

export function Jobs({ children }: { children: ReactNode }) {
  return <div className="rp-jobs" data-record-jobs="">{children}</div>;
}

/** Put the list back where it stood when a record was opened from it (the shell calls this on a list's mount). */
export function restoreListScroll(list: string) {
  const y = takeListScroll(list);
  if (y == null || y <= 0) return;
  let tries = 0;
  const tick = () => {
    const m = document.querySelector('main.wl-main') as HTMLElement | null;
    if (m && m.scrollHeight - m.clientHeight >= y) { m.scrollTop = y; return; }
    if (++tries < 40) setTimeout(tick, 50); else if (m) m.scrollTop = y;
  };
  tick();
}

export const RECORD_CSS = `
.rp-page{display:flex;flex-direction:column;min-width:0}
.rp-back{display:inline-flex;align-items:center;min-height:44px;margin:0 0 4px;font:var(--wl-tb);color:var(--atelier-accent-text);text-decoration:none;touch-action:manipulation}
.rp-status{margin:0 0 16px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.rp-next{display:flex;align-items:center;justify-content:center;box-sizing:border-box;min-height:48px;border-radius:12px;border:0;background:var(--role-primary);color:var(--role-on-primary);font:var(--wl-tb);text-decoration:none;touch-action:manipulation;margin:0 0 8px}
.rp-next:active{opacity:.85}
.rp-next:focus-visible,.rp-back:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.rp-sec{padding-top:24px}
.rp-h{margin:0 0 8px;font:var(--wl-t2);color:var(--atelier-ink)}
.rp-none{margin:0;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.rp-facts{margin:0;border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg)}
.rp-fact{display:flex;justify-content:space-between;gap:12px;padding:12px 16px}
.rp-fact + .rp-fact{border-top:1px solid var(--atelier-card-border)}
.rp-fact dt{font:var(--wl-t4);color:var(--atelier-ink-mute)}
.rp-fact dd{margin:0;font:var(--wl-tb);color:var(--atelier-ink);text-align:right;overflow-wrap:anywhere}
.rp-notes{margin:0;font:var(--wl-tb);color:var(--atelier-ink);white-space:pre-wrap;overflow-wrap:anywhere}
.rp-hist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
.rp-hist li{display:flex;flex-direction:column;gap:4px;padding:12px 16px;border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg)}
.rp-when{font:var(--wl-t5);color:var(--atelier-ink-mute)}
.rp-what{font:var(--wl-tb);color:var(--atelier-ink);overflow-wrap:anywhere;white-space:pre-wrap}
.rp-jobs{display:flex;flex-wrap:wrap;gap:8px;padding:24px 0 32px}
.rp-job{min-height:44px;padding:0 16px;border-radius:12px;border:1px solid var(--atelier-card-border);background:transparent;color:var(--atelier-accent-text);font:var(--wl-tb);text-decoration:none;display:inline-flex;align-items:center;touch-action:manipulation}
.rp-job.warn{color:var(--role-critical);border-color:var(--role-critical)}
.rp-job:active{background:var(--atelier-row-hover)}
.rp-job:disabled{opacity:.6}
.rp-sched{margin-top:12px}
`;
