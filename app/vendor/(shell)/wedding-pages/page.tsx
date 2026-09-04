"use client";
// app/vendor/(shell)/wedding-pages/page.tsx
// BLOCK 19 · G1.1 — THE WEDDING PAGES ROOM.
//
// ═══════════════════════════════════════════════════════════════════════════
// IT IS A ROOM REACHED FROM A HUB, NOT A TILE
// ═══════════════════════════════════════════════════════════════════════════
// R-G11.12: the address lives in `lib/solutions/routes.ts` on the not-a-room
// precedent, `ROOM_COUNT_EXPECTED` stays 19, and the tile grid gains nothing.
// The vendor arrives from Business Solutions' first row.
//
// ── THE IDIOM IS THE LEADS CARD, AND NOT BY PREFERENCE ─────────────────────
// The ratified `W2-room` frame draws the same two-line card, the same whole-row
// target, the same section headers with a count. NOTHING ON THIS ROOM IS MONEY,
// so no `.wl-rfig` appears anywhere — the money register has no business here
// and a figure class borrowed from a money surface would drag one in.
//
// ── EVERY BYTE IS RATIFIED, NONE IS AUTHORED HERE ──────────────────────────
// Strings come from `lib/worklist/weddingPages.ts`, transcribed from the mock's
// W2/W3 frames. This file writes no user-facing text of its own; a word typed
// into a component is a word the founder's pass never saw.
//
// ── THE PUBLISH CONTROL IS ABSENT, NEVER GREYED (s-G11.2) ──────────────────
// The mock sitting's own correction: a refusal drawn as a control that looks
// tappable is worse than no control. On a draft whose couple has not consented,
// `Publish this page` DOES NOT RENDER and the waiting line stands alone.

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { getJson, postJson } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { WP, ROLE_OPTIONS } from '@/lib/worklist/weddingPages';

type Wedding = {
  id: string; slug: string; title: string; venue: string | null; city: string | null;
  delivered_at: string | null; couple_consent: boolean; visibility: string;
};
type Credit = {
  id: string; role: string; name: string | null; phone: string | null;
  status: string; claim_url: string;
};
type EventRow = { id: string; title: string; event_date: string };

export default function WeddingPagesPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <WeddingPagesScreen />;
}

function WeddingPagesScreen() {
  const [rows, setRows] = useState<Wedding[] | null>(null);
  const [sheet, setSheet] = useState<'none' | 'create' | 'credits'>('none');
  const [active, setActive] = useState<Wedding | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await getJson<{ ok: boolean; weddings: Wedding[] }>(API.weddings());
      setRows(r.weddings || []);
    } catch { setRows([]); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  // Published and draft are two sections, as the frame draws them. A page with
  // `visibility='published'` but no consent is still PUBLISHED here — it is the
  // vendor's own act, and the room tells her separately what it is waiting on.
  // Hiding it under Draft would make her publish twice.
  const published = (rows ?? []).filter((w) => w.visibility === 'published');
  const drafts    = (rows ?? []).filter((w) => w.visibility !== 'published');

  return (
    <WorklistShell title={WP.roomTitle}>
      {rows === null ? <div style={{ flex: 1 }} aria-busy="true" /> : null}

      {rows !== null && rows.length === 0 ? (
        // TWO LINES AND NO CONTROL. The FAB is already the way in, and a second
        // button here would be a second home for one action.
        <div className="wp-empty">
          <span className="wp-eh">{WP.emptyHead}</span>
          <span className="wp-ep">{WP.emptyBody}</span>
        </div>
      ) : null}

      {rows !== null && rows.length > 0 ? (
        <div className="wp-room">
          {published.length ? (
            <Section label={WP.sectionPublished} count={published.length}>
              {published.map((w) => <Row key={w.id} w={w} onOpen={() => { setActive(w); setSheet('credits'); }} />)}
            </Section>
          ) : null}
          {drafts.length ? (
            <Section label={WP.sectionDraft} count={drafts.length}>
              {drafts.map((w) => <Row key={w.id} w={w} onOpen={() => { setActive(w); setSheet('credits'); }} />)}
            </Section>
          ) : null}
        </div>
      ) : null}

      <button type="button" className="wl-fab" aria-label={WP.fabLabel} onClick={() => setSheet('create')}>+</button>

      {sheet === 'create' ? (
        <CreateSheet onClose={() => setSheet('none')} onSaved={() => { setSheet('none'); void load(); }} />
      ) : null}
      {sheet === 'credits' && active ? (
        <CreditsSheet wedding={active} onClose={() => setSheet('none')} onChanged={() => { void load(); }} />
      ) : null}

      <WeddingPagesStyles />
    </WorklistShell>
  );
}

function Section({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <>
      <div className="wp-sec">{label}<span>{count}</span></div>
      {children}
    </>
  );
}

function Row({ w, onOpen }: { w: Wedding; onOpen: () => void }) {
  const live = w.visibility === 'published' && w.couple_consent;
  return (
    <button type="button" className="wp-row" onClick={onOpen}>
      <span>
        <span className="wp-rprimary">{w.title}</span>
        <span className="wp-rdetail">{[w.venue, w.city].filter(Boolean).join(' \u00b7 ')}</span>
      </span>
      {/* THE STATE WORD IS THE TRUTH, NOT THE INTENT. A page the vendor
          published but the couple has not consented to reads as waiting, because
          that is what a guest opening the link would find. */}
      <span className={live ? 'wp-rstate live' : 'wp-rstate'}>
        {live ? WP.stateLive : (w.visibility === 'published' ? WP.stateWaiting : WP.stateNotPublished)}
      </span>
    </button>
  );
}

function CreateSheet({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [eventId, setEventId] = useState('');
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity]   = useState('');
  const [busy, setBusy]   = useState(false);
  const [err, setErr]     = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await getJson<{ ok: boolean; events: EventRow[] }>('/api/v2/vendor/events');
        // ── F-40.33 · SOFT-DELETED EVENTS NEVER REACH THE PICKER ─────────────
        // Derived from the fixture, not imagined: DEV440's `Blocked` event is
        // soft-deleted and STILL reads state='upcoming'. The door refuses one
        // too (belt and braces, both keyed on `deleted_at` rather than state) —
        // but a picker that OFFERS a deleted day and then 404s is a worse
        // surface than one that never offers it.
        setEvents((r.events || []).filter((e) => !(e as unknown as { deleted_at?: string }).deleted_at));
      } catch { setEvents([]); }
    })();
  }, []);

  async function save() {
    if (busy || !eventId || !title.trim()) return;
    setBusy(true); setErr(null);
    try {
      await postJson(API.weddings(), { event_id: eventId, title: title.trim(), venue, city });
      onSaved();
    } catch (e) {
      // NEVER A FALSE DONE. The sheet stays open and says so; it does not close
      // on a write it cannot confirm.
      // ⚠ ONLY THE DOOR'S OWN MESSAGE IS SHOWN. This sitting authored no failure
      // line for this sheet, because one is not in the ratified mock. On a
      // network error there is no message and none is invented — the sheet stays
      // open with the button live, which is the honest state and never a false
      // done. FILED: the create sheet has no authored failure line.
      setErr(e instanceof Error && e.message ? e.message : null);
      setBusy(false);
    }
  }

  return (
    <Sheet title={WP.createTitle} onClose={onClose}>
      <span className="wp-fl">{WP.fieldEvent}</span>
      <select className="wp-fi wp-pick" value={eventId} onChange={(e) => setEventId(e.target.value)}>
        {/* An EMPTY label, not a placeholder sentence. 「Choose an event」 was
            written and removed: it is not in the ratified mock. */}
        <option value="" />
        {/* ⚠ JSX TEXT IS NOT A JS STRING. A bare \u00b7 written as option text
            renders as six literal characters, and tsc cannot see it because it
            is perfectly valid text. The separator goes through an EXPRESSION so
            the escape is evaluated. (The first cut had both defects: the bare
            escape, and then this comment placed inside the arrow's return
            parens rather than in JSX children.) */}
        {(events ?? []).map((e) => (
          <option key={e.id} value={e.id}>{e.title}{' \u00b7 '}{e.event_date}</option>
        ))}
      </select>

      <span className="wp-fl">{WP.fieldTitle}</span>
      <input className="wp-fi" value={title} onChange={(e) => setTitle(e.target.value)} />

      {/* ⚠ THE ADDRESS IS SHOWN, NEVER AUTHORED — and it is NOT derived here.
          The slug rule has ONE home, `slugify` in dream-os's
          src/lib/vendor/weddings.js, and the create door applies it. A JS twin
          in this sheet would be a second rule that agrees until the day one of
          them is edited. So the field is rendered dimmed and empty of promise
          until the row comes back with its real slug. */}
      <span className="wp-fl">{WP.fieldAddress}</span>
      <div className="wp-fi wp-derived" />

      <span className="wp-fl">{WP.fieldVenue}</span>
      <input className="wp-fi" value={venue} onChange={(e) => setVenue(e.target.value)} />
      <span className="wp-fl">{WP.fieldCity}</span>
      <input className="wp-fi" value={city} onChange={(e) => setCity(e.target.value)} />

      {err ? <p className="wp-err">{err}</p> : null}
      <button type="button" className="wp-btn" disabled={busy || !eventId || !title.trim()} onClick={save}>{WP.save}</button>
    </Sheet>
  );
}

function CreditsSheet(
  { wedding, onClose, onChanged }: { wedding: Wedding; onClose: () => void; onChanged: () => void },
) {
  const [credits, setCredits] = useState<Credit[] | null>(null);
  const [w, setW] = useState<Wedding>(wedding);
  const [role, setRole] = useState(ROLE_OPTIONS[0].key);
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await getJson<{ ok: boolean; wedding: Wedding; credits: Credit[] }>(API.wedding(wedding.id));
      setCredits(r.credits || []); setW(r.wedding);
    } catch { setCredits([]); }
  }, [wedding.id]);
  useEffect(() => { void load(); }, [load]);

  async function add() {
    if (busy || (!handle.trim() && !name.trim())) return;
    setBusy(true);
    try {
      await postJson(API.weddingCredits(wedding.id), {
        role, handle: handle.trim(), name: name.trim(),
        phone: /^[+0-9][0-9 ()-]{6,}$/.test(handle.trim()) ? handle.trim() : '',
      });
      setHandle(''); setName(''); await load(); onChanged();
    } catch { /* the row is not added; the fields keep what she typed */ }
    setBusy(false);
  }

  async function publish() {
    if (busy) return;
    setBusy(true);
    try { await postJson(API.weddingPublish(wedding.id), {}); await load(); onChanged(); }
    catch { /* nothing is claimed that was not confirmed */ }
    setBusy(false);
  }

  const live = w.visibility === 'published' && w.couple_consent;

  return (
    <Sheet title={WP.creditsTitle} onClose={onClose}>
      <span className="wp-fl">{WP.fieldRole}</span>
      <select className="wp-fi wp-pick" value={role} onChange={(e) => setRole(e.target.value)}>
        {ROLE_OPTIONS.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
      </select>
      <span className="wp-fl">{WP.fieldHandleOrNumber}</span>
      <input className="wp-fi" value={handle} onChange={(e) => setHandle(e.target.value)} />
      <span className="wp-fl">{WP.fieldName}</span>
      <input className="wp-fi" value={name} onChange={(e) => setName(e.target.value)} />
      <button type="button" className="wp-btn" disabled={busy} onClick={add}>{WP.add}</button>

      <div className="wp-clist">
        {(credits ?? []).map((c) => (
          <div className="wp-crow" key={c.id}>
            <span>
              <span className="wp-crole">{ROLE_OPTIONS.find((r) => r.key === c.role)?.label ?? c.role}</span>
              <span className="wp-cname">{c.name}</span>
            </span>
            {/* NO EDIT CONTROL ON ANOTHER VENDOR'S CREDIT — absent, not disabled.
                master §4 G1.1's own refusal, and s-G11.2's shape. */}
            <span className={c.status === 'claimed' ? 'wp-cstate on' : c.status === 'declined' ? 'wp-cstate no' : 'wp-cstate'}>
              {c.status === 'claimed' ? WP.stateClaimed : c.status === 'declined' ? WP.stateDeclined : WP.stateInvited}
            </span>
          </div>
        ))}
      </div>

      <div className="wp-pubrow">
        {live ? <div className="wp-live">{WP.pageIsLive}</div> : null}
        {/* THE THREE FOOT STATES, AND THE ABSENCES ARE THE RULING.
            live            -> #26 「This page is live.」
            published, no   -> #25 「Waiting on the couple's permission.」 ALONE;
              consent          the publish control is ABSENT, not greyed.
            draft           -> #24 「Publish this page」 */}
        {!live && w.visibility === 'published' ? <div className="wp-wait">{WP.waitingOnCouple}</div> : null}
        {!live && w.visibility !== 'published' ? (
          <button type="button" className="wp-btn" disabled={busy} onClick={publish}>{WP.publish}</button>
        ) : null}
      </div>
    </Sheet>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div className="wp-scrim" onClick={onClose} />
      <div className="wp-sheet" role="dialog" aria-label={title}>
        <div className="wp-shhead">
          <span className="wp-shtitle">{title}</span>
          {/* `aria-label="Close"` inline is the shell's own shipped idiom
              (components/worklist/AskSheet.tsx, three sites). It is an
              accessible name, not product copy, and it does not join a copy
              home where a bench would read it as a vetoed byte. */}
          <button type="button" className="wp-shx" aria-label="Close" onClick={onClose}>&times;</button>
        </div>
        {children}
      </div>
    </>
  );
}

function WeddingPagesStyles() {
  return (
    <style>{`
.wp-room{padding-top:20px;padding-bottom:28px}
.wp-sec{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px;display:flex;justify-content:space-between}
.wp-sec+.wp-row{margin-bottom:var(--wl-step)}
.wp-row{display:grid;grid-template-columns:1fr auto;align-items:start;column-gap:12px;width:100%;text-align:left;
        background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;
        padding:13px 14px;margin-bottom:var(--wl-step);cursor:pointer;min-height:44px}
.wp-rprimary{font:var(--wl-t3);color:var(--atelier-ink);display:block}
.wp-rdetail{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:3px}
.wp-rstate{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);white-space:nowrap;padding-top:2px}
.wp-rstate.live{color:var(--atelier-accent-text)}
.wp-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding-bottom:80px}
.wp-eh{font:var(--wl-t2);color:var(--atelier-ink)}
.wp-ep{font:var(--wl-t3);color:var(--atelier-ink-mute);max-width:250px}
.wp-scrim{position:fixed;inset:0;background:var(--atelier-overlay);z-index:20}
.wp-sheet{position:fixed;left:0;right:0;bottom:0;z-index:21;border-radius:14px 14px 0 0;max-width:520px;margin:0 auto;
          background:linear-gradient(180deg,var(--atelier-sheet-top) 0%,var(--atelier-sheet-bot) 100%);
          border-top:.5px solid var(--atelier-sheet-border);padding:18px var(--wl-gutter) 22px;max-height:92%;overflow-y:auto}
.wp-shhead{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
.wp-shtitle{font:var(--wl-t1);color:var(--atelier-ink)}
.wp-shx{font:var(--wl-t2);color:var(--atelier-ink-fade);line-height:1;background:none;border:none;cursor:pointer;min-width:44px;min-height:44px}
.wp-fl{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);display:block;margin-bottom:5px}
.wp-fi{background:var(--atelier-input-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;
       padding:10px 12px;font:var(--wl-t3);color:var(--atelier-ink);margin-bottom:12px;width:100%;min-height:44px;display:block}
.wp-pick{border-color:var(--atelier-input-border)}
.wp-derived{color:var(--atelier-ink-mute)}
.wp-btn{width:100%;min-height:48px;display:flex;align-items:center;justify-content:center;
        background:var(--atelier-accent-text);color:var(--role-ink-deep);border:none;border-radius:3px;
        font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
.wp-btn[disabled]{opacity:.55}
.wp-err{font:var(--wl-t5);color:var(--role-critical);margin-bottom:10px}
.wp-clist{margin-top:14px}
.wp-crow{display:grid;grid-template-columns:1fr auto;align-items:center;column-gap:12px;
         border-top:.5px solid var(--atelier-card-border);padding:9px 0}
.wp-crole{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);display:block}
.wp-cname{font:var(--wl-t3);color:var(--atelier-ink);display:block;margin-top:2px}
.wp-cstate{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);white-space:nowrap}
.wp-cstate.on{color:var(--atelier-accent-text)}
.wp-cstate.no{color:var(--atelier-ink-fade)}
.wp-pubrow{border-top:.5px solid var(--atelier-card-border);margin-top:14px;padding-top:14px}
.wp-live{font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-accent-text);text-align:center;padding:6px 0}
.wp-wait{font:var(--wl-t5);color:var(--atelier-ink-fade);line-height:1.5;text-align:center;padding:6px 0}
    `}</style>
  );
}
