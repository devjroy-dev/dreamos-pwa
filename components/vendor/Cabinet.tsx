'use client';
// components/vendor/Cabinet.tsx — Your Books · the Rising Ledger (ported from dreamai).
// Theme-aware: colour & feel follow the active theme (espresso / parchment / Flair navy-bone-ember)
// through .dd-cab --cab-* tokens. A brass "Your books" handle lifts a bottom sheet with three
// skins — Cards / Workbench / Accounts — over the same six slices. Read-only: it paints what
// Kriya kept; it never writes. Reads GET /api/v2/vendor/cabinet/:vendorId.

import { useEffect, useState } from 'react';
import {
  fetchCabinet,
  type CabinetResponse,
  type CabinetBinder,
  type CabinetEvent,
  type CabinetReminder,
} from '@/lib/vendor/api/vendor';
// TDW_03 P2: money math + tones now live in lib/vendor/cabinet.ts — one truth,
// two consumers (this Hub sheet + the Clients slice binder cards). Do not fork.
import { fmtINR, primaryAmount, moneyOf, BADGE, type MoneyState } from '@/lib/vendor/cabinet';
import { pendingOf } from '@/lib/vendor/derive'; // TDW_04 A4 (L-10): the money oracle

type Skin = 'workbench' | 'cards' | 'accounts';
const SKIN_KEY = 'dreamwedding_cabinet_skin';

// ── record union: a binder card, an event card, or a follow-up card ─────────
type BinderRec = { _t: 'binder' } & CabinetBinder;
type EventRec = {
  _t: 'event';
  id: string;
  title: string | null;
  kind: string | null;
  event_date: string | null;
  event_time: string | null;
  notes: string | null;
};
type FollowRec = {
  _t: 'follow';
  id: string;
  client: string | null;
  followup_on: string | null;
  followup_note: string | null;
};
type CabRec = BinderRec | EventRec | FollowRec;
type Column = { key: string; label: string; count: number; records: CabRec[] };

// (fmtINR / primaryAmount / MoneyState / moneyOf / BADGE moved to lib/vendor/cabinet.ts — TDW_03 P2)
function MoneyBadge({ state }: { state: MoneyState }) {
  if (!state) return null;
  const bd = BADGE[state];
  return (
    <span style={{
      fontSize: 9, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '1px 6px', borderRadius: 3, color: bd.color,
      border: `0.5px solid ${bd.color}`, opacity: 0.92, whiteSpace: 'nowrap', lineHeight: 1.4,
    }}>{bd.label}</span>
  );
}
// Money split line: "Rs X in · Rs Y due" — reused across skins.
function MoneySplit({ r }: { r: CabinetBinder }) {
  const { recv, pend } = moneyOf(r);
  if (recv <= 0 && pend <= 0) return null;
  return (
    <span style={{ fontSize: 16, lineHeight: 1.5, letterSpacing: '0.01em', opacity: 0.7, whiteSpace: 'nowrap' }}>
      {recv > 0 && <span>{fmtINR(recv)} in</span>}
      {recv > 0 && pend > 0 && <span style={{ opacity: 0.5 }}>{'  ·  '}</span>}
      {pend > 0 && <span>{fmtINR(pend)} due</span>}
    </span>
  );
}

// ── adapt the six slices into columns ───────────────────────────────────────
function toColumns(cab: CabinetResponse): Column[] {
  const binderRec = (b: CabinetBinder): BinderRec => ({ _t: 'binder', ...b });
  const eventRec = (e: CabinetEvent): EventRec => ({
    _t: 'event', id: e.id, title: e.title, kind: e.kind,
    event_date: e.event_date, event_time: e.event_time, notes: e.notes,
  });
  const reminderRec = (r: CabinetReminder): CabRec => {
    if (r.source === 'binder') {
      return {
        _t: 'follow', id: r.id, client: r.client ?? null,
        followup_on: r.followup_on ?? null, followup_note: r.followup_note ?? null,
      };
    }
    return {
      _t: 'event', id: r.id, title: r.title ?? null, kind: r.kind ?? null,
      event_date: r.event_date ?? null, event_time: r.event_time ?? null, notes: r.notes ?? null,
    };
  };

  const c = cab.counts;
  return [
    { key: 'clients',   label: 'Clients',   count: c?.clients   ?? cab.clients.length,   records: cab.clients.map(binderRec) },
    { key: 'leads',     label: 'Leads',     count: c?.leads     ?? cab.leads.length,     records: cab.leads.map(binderRec) },
    { key: 'booked',    label: 'On the calendar', count: c?.booked    ?? cab.booked.length,    records: cab.booked.map(eventRec) }, // TDW_04 A1 (L-1): "Booked" renamed to its truth — the column is the BOOKED_KINDS calendar whitelist, not booked clients
    { key: 'reminders', label: 'Reminders', count: c?.reminders ?? cab.reminders.length, records: cab.reminders.map(reminderRec) },
  ];
}

/* ── Cards skin ──────────────────────────────────────────────────────────── */
function BinderCard({ r }: { r: BinderRec }) {
  const isMoney = r.amount != null || r.amount_received != null || r.amount_pending != null;
  const pending =
    r.amount_pending != null
      ? Math.max(r.amount_pending, 0)
      : Math.max((r.amount ?? 0) - (r.amount_received ?? 0), 0);
  return (
    <div className="dd-card">
      <div className="dd-card-top">
        <span className="dd-card-client">{r.client ?? 'Unnamed'}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MoneyBadge state={moneyOf(r).state} />
          {r.direction && (
            <span className={`dd-card-dir ${r.direction}`}>{r.direction === 'in' ? 'in' : 'out'}</span>
          )}
        </span>
      </div>
      {isMoney && (
        <div className="dd-card-money">
          <div className="dd-card-amt">{fmtINR(r.amount)}</div>
          <div className="dd-card-split">
            <span className="got">{fmtINR(r.amount_received)} in</span>
            {pending > 0 && <span className="owe">{fmtINR(pending)} due</span>}
          </div>
        </div>
      )}
      <div className="dd-card-rows">
        {r.stage && <div className="dd-card-row"><i>stage</i><b>{r.stage}</b></div>}
        {r.date && <div className="dd-card-row"><i>date</i><b>{r.date}</b></div>}
        {r.payment_status && <div className="dd-card-row"><i>status</i><b>{r.payment_status}</b></div>}
        {r.followup_on && <div className="dd-card-row"><i>follow-up</i><b>{r.followup_on}</b></div>}
        {r.phone && <div className="dd-card-row"><i>phone</i><b>{r.phone}</b></div>}
      </div>
      {r.note && <div className="dd-card-note">{r.note}</div>}
    </div>
  );
}

function EventCard({ r }: { r: EventRec }) {
  return (
    <div className="dd-card dd-card-event">
      <div className="dd-card-top">
        <span className="dd-card-client">{r.title ?? 'Untitled'}</span>
        {r.kind && <span className="dd-card-dir kind">{r.kind}</span>}
      </div>
      <div className="dd-card-rows">
        {r.event_date && <div className="dd-card-row"><i>date</i><b>{r.event_date}</b></div>}
        {r.event_time && <div className="dd-card-row"><i>time</i><b>{r.event_time}</b></div>}
      </div>
      {r.notes && <div className="dd-card-note">{r.notes}</div>}
    </div>
  );
}

function FollowCard({ r }: { r: FollowRec }) {
  return (
    <div className="dd-card dd-card-event">
      <div className="dd-card-top">
        <span className="dd-card-client">{r.client ?? 'Unnamed'}</span>
        <span className="dd-card-dir kind">follow-up</span>
      </div>
      <div className="dd-card-rows">
        {r.followup_on && <div className="dd-card-row"><i>on</i><b>{r.followup_on}</b></div>}
      </div>
      {r.followup_note && <div className="dd-card-note">{r.followup_note}</div>}
    </div>
  );
}

function RecordCard({ r }: { r: CabRec }) {
  if (r._t === 'binder') return <BinderCard r={r} />;
  if (r._t === 'event') return <EventCard r={r} />;
  return <FollowCard r={r} />;
}

function CardsSkin({ cols }: { cols: Column[] }) {
  return (
    <div className="cab-cardstack">
      {cols.map((col) => (
        <section key={col.key} className="cab-col">
          <div className="cab-col-head"><span>{col.label}</span><span className="cab-col-count">{col.count}</span></div>
          <div className="cab-cards">{col.records.map((r) => <RecordCard key={r.id} r={r} />)}</div>
        </section>
      ))}
    </div>
  );
}

/* compact-skin field helpers (work across all three record kinds) */
function recName(r: CabRec): string {
  if (r._t === 'binder') return r.client ?? 'Unnamed';
  if (r._t === 'event') return r.title ?? 'Untitled';
  return r.client ?? 'Unnamed';
}
function recNote(r: CabRec): string | null {
  if (r._t === 'binder') return r.note ?? null;
  if (r._t === 'event') return r.notes ?? null;
  return r.followup_note ?? null;
}
function recMeta(r: CabRec): string {
  if (r._t === 'binder') return [r.stage, r.date].filter(Boolean).join('  ·  ');
  if (r._t === 'event') return [r.kind, r.event_date].filter(Boolean).join('  ·  ');
  return ['follow-up', r.followup_on].filter(Boolean).join('  ·  ');
}

/* ── Workbench skin (board / swimlanes) ──────────────────────────────────── */
function WorkbenchSkin({ cols }: { cols: Column[] }) {
  return (
    <div className="cab-wb">
      {cols.map((col) => (
        <div key={col.key} className="cab-wb-col">
          <div className="cab-wb-head"><span>{col.label}</span><span className="cab-wb-count">{col.count}</span></div>
          <div className="cab-wb-stack">
            {col.records.map((r) => {
              const amt = r._t === 'binder' ? primaryAmount(r) : null;
              const inDir = r._t === 'binder' && r.direction === 'in';
              const note = recNote(r);
              return (
                <div key={r.id} className="cab-wb-card">
                  <div className="cab-wb-name" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
                    <span>{recName(r)}</span>
                    {r._t === 'binder' && <MoneyBadge state={moneyOf(r).state} />}
                  </div>
                  {amt != null && <div className={`cab-wb-amt ${inDir ? 'in' : ''}`}>{fmtINR(amt)}</div>}
                  {r._t === 'binder' && <div className="cab-wb-meta"><MoneySplit r={r} /></div>}
                  {note && <div className="cab-wb-note">{note.split('.')[0]}.</div>}
                  <div className="cab-wb-meta">{recMeta(r)}</div>
                </div>
              );
            })}
            {col.records.length === 0 && <div className="cab-wb-empty">—</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Accounts skin (flat ruled register) ─────────────────────────────────── */
function AccountsSkin({ cols }: { cols: Column[] }) {
  const rows = cols.flatMap((c) => c.records.map((r) => ({ r, col: c.label })));
  return (
    <div className="cab-acc">
      <div className="cab-acc-margin" />
      {rows.map(({ r, col }) => {
        const amt = r._t === 'binder' ? primaryAmount(r) : null;
        const inDir = r._t === 'binder' && r.direction === 'in';
        const note = recNote(r);
        const tag = r._t === 'binder' && r.stage ? col + ' · ' + r.stage : col;
        return (
          <div key={r.id} className="cab-acc-row">
            <div className="cab-acc-l">
              <div className="cab-acc-name" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span>{recName(r)}</span>
                {r._t === 'binder' && <MoneyBadge state={moneyOf(r).state} />}
              </div>
              <div className="cab-acc-tag">{tag}{r._t === 'binder' ? <>{'  ·  '}<MoneySplit r={r} /></> : null}</div>
            </div>
            {note && <div className="cab-acc-note">{note}</div>}
            {amt != null && <div className={`cab-acc-amt ${inDir ? 'in' : ''}`}>{fmtINR(amt)}</div>}
          </div>
        );
      })}
    </div>
  );
}

export default function Cabinet({ vendorId }: { vendorId: string }) {
  const [open, setOpen] = useState(false);
  const [cols, setCols] = useState<Column[] | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [skin, setSkin] = useState<Skin>('cards');

  // restore persisted skin once (per-browser; the vendor's chosen view sticks)
  useEffect(() => {
    try {
      const s = localStorage.getItem(SKIN_KEY) as Skin | null;
      if (s === 'workbench' || s === 'cards' || s === 'accounts') setSkin(s);
    } catch { /* private mode — default cards */ }
  }, []);

  useEffect(() => {
    if (!open || !vendorId) return;
    let alive = true;
    setLoaded(false);
    fetchCabinet(vendorId)
      .then((c) => {
        if (!alive) return;
        if (c && c.ok) setCols(toColumns(c));
        setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, [open, vendorId]);

  function lift() {
    setLifting(true);
    setTimeout(() => setOpen(true), 160);
    setTimeout(() => setLifting(false), 640);
  }
  function chooseSkin(s: Skin) {
    setSkin(s);
    try { localStorage.setItem(SKIN_KEY, s); } catch { /* silent */ }
  }

  const filled = (cols ?? []).filter((c) => c.count > 0);
  const allCols = cols ?? [];

  // Money summary across every binder on file (clients + leads), each counted ONCE.
  const allBinders = (cols ?? [])
    .filter((c) => c.key === 'clients' || c.key === 'leads')
    .flatMap((c) => c.records)
    .filter((r): r is BinderRec => r._t === 'binder');
  const totalIn  = allBinders.reduce((s, r) => s + (r.amount_received ?? 0), 0);
  // TDW_04 A4 (L-10/ST-7 executed): the drawer's OUTSTANDING rides the canon —
  // derive.ts::pendingOf(), the ruled F-04.13 rule. This inline arithmetic was
  // the LAST independent money computation in the product (and, historical
  // credit: the one surface that was RIGHT while the slices undercounted —
  // its inference became the ruled rule). It dies anyway: right twice by two
  // rules is still two rules; one oracle, every renderer a consumer.
  const totalDue = allBinders.reduce((s, r) => s + pendingOf(r as unknown as Parameters<typeof pendingOf>[0]), 0);
  const showMoneyHead = totalIn > 0 || totalDue > 0;

  return (
    <div className="dd-cab">
      <button className={`cab-orn ${lifting ? 'lifting' : ''}`} aria-label="Open your books" onClick={lift}>
        <span className="cab-trail" />
        <svg viewBox="0 0 200 44" aria-hidden="true">
          <defs>
            <linearGradient id="cabFil" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--cab-accent)" stopOpacity="0" />
              <stop offset="0.5" stopColor="var(--cab-accent-warm)" stopOpacity="1" />
              <stop offset="1" stopColor="var(--cab-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="cab-crest-base" d="M34 26 Q100 22 166 26" />
          <path className="cab-crest" d="M34 26 Q100 22 166 26" stroke="url(#cabFil)" />
          <circle className="cab-core" cx="100" cy="23" r="2.6" />
        </svg>
        <span className="cab-cap">Your books</span>
      </button>

      <div className={`cab-sheet ${open ? 'open' : ''}`}>
        <button className="cab-grip" aria-label="Close" onClick={() => setOpen(false)}><span /></button>
        <div className="cab-head">
          {/* TDW_04 A1 (L-1, ST-1): the cabinet stops claiming totality it
              doesn't have — "Everything kept" dies; the lane declaration lands.
              (A4/L-10 later demotes this whole surface to a chat-adjacent glance.) */}
          <div className="cab-head-t"><small>Your books</small>Everything you&rsquo;ve filed — your working binders + calendar</div>
          <button className="cab-x" onClick={() => setOpen(false)}>Close</button>
        </div>

        {loaded && showMoneyHead && (
          <div style={{
            display: 'flex', gap: 22, padding: '8px 20px 12px',
            borderBottom: '0.5px solid var(--cab-rule, rgba(140,120,100,0.14))',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.45 }}>Received</span>
              <span style={{ fontSize: 16, lineHeight: 1.5, color: '#3E8B4A', letterSpacing: '0.01em' }}>{fmtINR(totalIn)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.45 }}>Outstanding</span>
              <span style={{ fontSize: 16, lineHeight: 1.5, color: '#C0563B', letterSpacing: '0.01em' }}>{fmtINR(totalDue)}</span>
            </div>
          </div>
        )}

        {loaded && filled.length > 0 && (
          <div className="cab-skins" role="tablist">
            {(['workbench', 'cards', 'accounts'] as Skin[]).map((s) => (
              <button key={s} className={`cab-skin ${skin === s ? 'on' : ''}`} onClick={() => chooseSkin(s)}>
                {s === 'workbench' ? 'Workbench' : s === 'cards' ? 'Cards' : 'Accounts'}
              </button>
            ))}
          </div>
        )}

        <div className="cab-body">
          {!loaded ? (
            <div className="cab-state">Opening your books…</div>
          ) : filled.length === 0 ? (
            <div className="cab-state">Nothing kept yet — tell Myra about a client, a payment, a date, and it lands here.</div>
          ) : skin === 'workbench' ? (
            <WorkbenchSkin cols={allCols} />
          ) : skin === 'accounts' ? (
            <AccountsSkin cols={filled} />
          ) : (
            <CardsSkin cols={filled} />
          )}
        </div>
      </div>
    </div>
  );
}
