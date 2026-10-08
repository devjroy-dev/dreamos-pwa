'use client';
// v2/components/vendor/hub/ShootTogetherSheet.tsx · CE-47 · HUB-2 · "A SHOOT WE DID TOGETHER" (approved picture 1).
// For a shoot that was not a call on TDW: name, city, month, and who worked on it. Each person gets a request
// (POST /api/v2/vendor/hub/credits); nothing shows on any page, and nobody joins anyone's people, until they say yes.
// The limit is the server's (20 in any 30 days); the sheet shows how many are left (GET /hub/mine shoot_requests_left)
// and shows the server's own refusal word for word. "Remove" is a quiet button; handles are links.
import { useEffect, useMemo, useState } from 'react';
import { getJson } from '@/lib/vendor/api/_base';
import { labelFor } from '@/lib/frost/categoryLabels';
import { HUB, HUB_API, arr, fetchPeople, sendShootRequests, linkProps, type HubPerson } from '@/v2/lib/vendor/hub';
import { HUB_CSS } from './HubPeople';

const thisMonth = () => { const d = new Date(Date.now() + 330 * 60000); return d.toISOString().slice(0, 7); };   // IST, as the server reads it

export function ShootTogetherSheet({ onClose, onSent }: { onClose: () => void; onSent: (line: string) => void }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [month, setMonth] = useState('');
  const [q, setQ] = useState('');
  const [everyone, setEveryone] = useState<HubPerson[]>([]);
  const [picked, setPicked] = useState<HubPerson[]>([]);
  const [left, setLeft] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchPeople({}).then((d) => { if (d.ok) setEveryone(arr(d.people)); }).catch(() => { /* search shows nothing */ });
    getJson<{ ok: boolean; shoot_requests_left?: number }>(HUB_API.mine())
      .then((d) => { if (d.ok && typeof d.shoot_requests_left === 'number') setLeft(d.shoot_requests_left); })
      .catch(() => { /* the line stays out; the server still refuses past the limit */ });
  }, []);

  const found = useMemo(() => {
    const s = q.trim().toLowerCase().replace(/^@/, '');
    if (s.length < 2) return [];
    return everyone.filter((p) => !picked.some((x) => x.id === p.id)
      && (p.name.toLowerCase().includes(s) || (p.instagram && p.instagram.handle.toLowerCase().includes(s)) || p.handle.includes(s))).slice(0, 6);
  }, [q, everyone, picked]);

  async function send() {
    if (sending) return;
    if (!name.trim() || !city.trim() || !month || !picked.length) { setError(HUB.shoot.needAll); return; }
    setSending(true); setError('');
    const r = await sendShootRequests({ shoot_name: name.trim(), city: city.trim(), month, people: picked.map((p) => p.id) })
      .catch(() => ({ ok: false, error: HUB.failed.send } as { ok: boolean; error?: string; line?: string }));
    setSending(false);
    if (!r.ok) { setError(r.error || HUB.failed.send); return; }
    onSent(r.line || '');
  }

  return (
    <div className="hub-scrim" role="dialog" aria-modal="true" aria-label={HUB.shoot.title} data-hub-shoot-sheet="">
      <style>{HUB_CSS + SHEET_CSS}</style>
      <div className="hub-sheet">
        <div className="hub-sheet-head">
          <h2 className="hub-sheet-title">{HUB.shoot.title}</h2>
          <button type="button" className="hub-x" aria-label={HUB.close} onClick={onClose}>{'✕'}</button>
        </div>
        <p className="hub-note">{HUB.shoot.note}</p>
        <label className="hub-field"><span>{HUB.shoot.name}</span>
          <input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} /></label>
        <label className="hub-field"><span>{HUB.shoot.city}</span>
          <input value={city} maxLength={60} onChange={(e) => setCity(e.target.value)} /></label>
        <label className="hub-field"><span>{HUB.shoot.month}</span>
          <input type="month" value={month} max={thisMonth()} onChange={(e) => setMonth(e.target.value)} /></label>
        <label className="hub-field"><span>{HUB.shoot.who}</span>
          <input value={q} placeholder={HUB.shoot.search} onChange={(e) => setQ(e.target.value)} /></label>
        {found.length > 0 && (
          <div className="hub-found" role="listbox" aria-label={HUB.shoot.who}>
            {found.map((p) => (
              <button key={p.id} type="button" role="option" aria-selected={false} className="hub-found-row"
                onClick={() => { setPicked((xs) => [...xs, p]); setQ(''); }}>
                <span className="hub-name">{p.name}</span>
                <span className="hub-facts">{[arr(p.roles).map((r) => labelFor(r)).join(', '), p.city].filter(Boolean).join(' · ')}</span>
              </button>))}
          </div>)}
        {picked.length > 0 && (
          <div className="hub-card hub-picked">
            {picked.map((p) => {
              const ig = p.instagram ? linkProps(p.instagram.url) : null;
              return (
                <div key={p.id} className="hub-pick">
                  <div>
                    <div className="hub-name">{p.name}</div>
                    <div className="hub-facts">{[arr(p.roles).map((r) => labelFor(r)).join(', '), p.city].filter(Boolean).join(' · ')}
                      {ig && p.instagram && <>{' · '}<a {...ig} className="hub-inline">{HUB.instagram(p.instagram.handle)}</a></>}</div>
                  </div>
                  <button type="button" className="hub-btn q" onClick={() => setPicked((xs) => xs.filter((x) => x.id !== p.id))}>{HUB.shoot.remove}</button>
                </div>);
            })}
          </div>)}
        {left !== null && <p className="hub-small" data-hub-left="">{HUB.shoot.left(left)}</p>}
        {error && <p className="hub-small bad" role="alert">{error}</p>}
        <button type="button" className="hub-btn p hub-wide" disabled={sending} data-hub-send="" onClick={() => void send()}>
          {sending ? HUB.shoot.sending : HUB.shoot.send(Math.max(1, picked.length))}</button>
      </div>
    </div>
  );
}

const SHEET_CSS = `
.hub-scrim{position:fixed;inset:0;z-index:100;background:var(--atelier-overlay);display:flex;align-items:flex-end}
.hub-sheet{width:100%;max-height:92dvh;overflow-y:auto;box-sizing:border-box;background:var(--atelier-sheet-bg);border-top:1px solid var(--atelier-sheet-border);border-radius:16px 16px 0 0;padding:20px 16px calc(24px + env(safe-area-inset-bottom))}
.hub-sheet-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.hub-sheet-title{margin:0;font:var(--wl-t2);color:var(--atelier-ink)}
.hub-x{min-width:44px;min-height:44px;border:0;background:transparent;color:var(--atelier-ink-dim);font:var(--wl-t2);cursor:pointer}
.hub-field{display:block;margin:12px 0}
.hub-field span{display:block;margin-bottom:6px;font:var(--wl-t5);color:var(--atelier-label)}
.hub-field input{width:100%;box-sizing:border-box;min-height:52px;padding:0 14px;border-radius:12px;border:1px solid var(--atelier-input-border);background:var(--atelier-input-bg);color:var(--atelier-ink);font:var(--wl-t3)}
.hub-found{border:1px solid var(--atelier-card-border);border-radius:12px;overflow:hidden}
.hub-found-row{display:flex;flex-direction:column;align-items:flex-start;width:100%;min-height:56px;padding:8px 14px;border:0;border-top:1px solid var(--atelier-card-border);background:var(--atelier-card-bg);text-align:left;cursor:pointer}
.hub-found-row:first-child{border-top:0}
.hub-picked{padding:4px 14px}
.hub-pick{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--atelier-card-border)}
.hub-pick:first-child{border-top:0}
.hub-inline{color:var(--atelier-accent-text);text-decoration:underline;text-underline-offset:3px}
.hub-wide{width:100%;margin-top:12px}
`;
