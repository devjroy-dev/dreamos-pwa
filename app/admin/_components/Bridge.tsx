'use client';
// app/admin/_components/Bridge.tsx
// THE BRIDGE — TDW_10 P2, ruling A-3, CE-200.
//
// ── EVERY COLOUR HERE IS A ROLE ─────────────────────────────────────────────
// Zero hex literals. The P1 grep gate extends over this file and its sibling
// page.tsx (scripts/tdw10_p2_bridge.proof.mjs §1). The token set is
// app/admin/_components/tokens.css, loaded once by app/admin/layout.tsx.
//
// ── THE ONE RULE THIS SCREEN IS BUILT AROUND ────────────────────────────────
// A placeholder number on the founder's morning screen is a lie with a font.
// There are therefore THREE distinct renderings and they must never collapse
// into each other:
//
//   a real figure   — a number the server reconciled to rows
//   `—`             — the source FAILED. F-07.90's distinction: 0 is an answer,
//                     — is the absence of one, and collapsing the second into
//                     the first is what made a broken guard look like a quiet
//                     Tuesday for as long as it had been broken.
//   an honest state — the figure CANNOT exist yet. Renders as prose with its
//                     owner named, never as a number and never as a dash,
//                     because "0" and "—" both imply the figure is coming.
//
// ── MONEY ───────────────────────────────────────────────────────────────────
// Every rupee byte goes through lib/vendor/format.ts's `formatRs` — TDW_09
// R-U25's one money home. Rs X,XX,XXX, no glyph, no shorthand. The founder
// writes 「 999/- 」; that is his register and this is the product's.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { T } from './AdminUI';
import { formatRs } from '@/lib/vendor/format';
import { getBridge, DRILL, type BridgeResponse, type HonestState, type DrillTarget } from '@/lib/admin-api/bridge';

const AUTO_REFRESH_MS = 60_000;   // spec §P2
const PULL_THRESHOLD  = 72;       // px of overscroll before a pull commits

// ═══════════════════════════════════════════════════════════════════════════
// Primitives
// ═══════════════════════════════════════════════════════════════════════════

const EYEBROW: React.CSSProperties = {
  fontFamily: T.ff.label, fontWeight: 600, fontSize: 9.5,
  letterSpacing: '0.16em', textTransform: 'uppercase',
  color: 'var(--admin-ink-mute)',
};

/** The masthead figure. Cormorant for the number, Jost for the eyebrow — the
 *  spec's own pairing. `null` renders the dash; it is never coerced to 0. */
function Figure({
  label, value, sub, drill, tone, onDrill,
}: {
  label: string;
  value: number | null;
  sub?: string;
  drill?: DrillTarget;
  tone?: 'metal' | 'caution';
  onDrill?: (d: DrillTarget) => void;
}) {
  const dead   = value === null;
  const canTap = !!drill && !!drill.path && !!onDrill;
  const colour = dead ? 'var(--admin-ink-dim)'
               : tone === 'metal'   ? 'var(--admin-metal)'
               : tone === 'caution' ? 'var(--admin-caution)'
               : 'var(--admin-ink)';
  return (
    <div
      onClick={canTap ? () => onDrill!(drill!) : undefined}
      role={canTap ? 'button' : undefined}
      tabIndex={canTap ? 0 : undefined}
      onKeyDown={canTap ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDrill!(drill!); } } : undefined}
      aria-label={`${label}: ${dead ? 'could not load' : value}`}
      style={{
        background: 'var(--admin-card-bg)',
        border: '0.5px solid var(--admin-card-border)',
        borderRadius: 14, padding: '16px 18px',
        cursor: canTap ? 'pointer' : 'default',
        minHeight: 96, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}
    >
      <div style={EYEBROW}>{label}</div>
      <div style={{ fontFamily: T.ff.display, fontWeight: 500, fontSize: 40, lineHeight: 1, color: colour, letterSpacing: '-0.02em', marginTop: 10 }}>
        {dead ? '—' : value}
      </div>
      <div style={{ fontFamily: T.ff.body, fontWeight: 400, fontSize: 11, color: dead ? 'var(--admin-critical)' : 'var(--admin-ink-mute)', marginTop: 7 }}>
        {dead ? 'Could not load' : (sub || (canTap ? 'Tap to open' : '\u00A0'))}
      </div>
    </div>
  );
}

/** A figure that cannot exist yet. Deliberately NOT a number and NOT a dash:
 *  both of those say "this will be here in a moment". This says who owns it. */
function Honest({ s, extra }: { s: HonestState; extra?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: 'var(--admin-card-bg)',
      border: '0.5px solid var(--admin-card-border)',
      borderLeft: '2px solid var(--admin-metal-line)',
      borderRadius: 14, padding: '16px 18px',
    }}>
      <div style={{ ...EYEBROW, color: 'var(--admin-metal-soft)' }}>{s.label}</div>
      {extra}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          background: 'none', border: 'none', padding: 0, marginTop: 10, cursor: 'pointer', textAlign: 'left',
          fontFamily: T.ff.body, fontWeight: 400, fontSize: 11, color: 'var(--admin-ink-soft)',
        }}
      >
        {open ? 'Hide why' : 'Why'} · {s.finding}
      </button>
      {open && (
        <div style={{ marginTop: 8, fontFamily: T.ff.body, fontWeight: 400, fontSize: 11.5, lineHeight: 1.55, color: 'var(--admin-ink-soft)' }}>
          {s.why}
          <div style={{ marginTop: 6, color: 'var(--admin-ink-mute)' }}>Owner: {s.owner}</div>
        </div>
      )}
    </div>
  );
}

/** A funnel stage bar. The width is the stage's share of the total — and when
 *  the total is 0 every bar is empty rather than each being 100% of nothing. */
function StageBar({ states, total, partial }: { states: Record<string, number>; total: number; partial: boolean }) {
  const entries = Object.entries(states).filter(([, n]) => n > 0);
  return (
    <div>
      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: 'var(--admin-ink-fade)' }}>
        {total > 0 && entries.map(([k, n], i) => (
          <div key={k} title={`${k}: ${n}`} style={{
            width: `${(n / total) * 100}%`,
            background: k === 'other' ? 'var(--admin-critical)' : (i % 2 ? 'var(--admin-metal-soft)' : 'var(--admin-metal)'),
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginTop: 11 }}>
        {entries.length === 0 && (
          <span style={{ fontFamily: T.ff.body, fontSize: 11, color: 'var(--admin-ink-mute)' }}>No rows yet</span>
        )}
        {entries.map(([k, n]) => (
          <span key={k} style={{ fontFamily: T.ff.body, fontSize: 11, color: k === 'other' ? 'var(--admin-critical)' : 'var(--admin-ink-soft)' }}>
            {k.replace(/_/g, ' ')} <strong style={{ color: 'var(--admin-ink)' }}>{n}</strong>
          </span>
        ))}
      </div>
      {partial && (
        // The truncation guard, surfaced. A split that under-reports and says
        // so is usable; one that under-reports silently is the disease.
        <div style={{ marginTop: 8, fontFamily: T.ff.body, fontSize: 10.5, color: 'var(--admin-caution)' }}>
          Partial — more rows than the server fetch cap. The total above is exact.
        </div>
      )}
    </div>
  );
}

/** A queue row. Deep-links into the OWNING domain when one exists; when none
 *  does, it says so rather than offering a tap that 404s. */
function QueueRow({
  label, count, note, drill, onDrill, urgent,
}: {
  label: string; count: number | null; note?: string;
  drill?: DrillTarget; onDrill?: (d: DrillTarget) => void; urgent?: boolean;
}) {
  const canTap = !!drill && !!drill.path && !!onDrill;
  return (
    <div
      onClick={canTap ? () => onDrill!(drill!) : undefined}
      role={canTap ? 'button' : undefined}
      tabIndex={canTap ? 0 : undefined}
      onKeyDown={canTap ? (e) => { if (e.key === 'Enter') onDrill!(drill!); } : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, minHeight: 56,
        padding: '12px 16px', borderBottom: '0.5px solid var(--admin-hairline)',
        cursor: canTap ? 'pointer' : 'default',
      }}
    >
      <div style={{
        fontFamily: T.ff.display, fontWeight: 500, fontSize: 26, lineHeight: 1, minWidth: 42,
        color: count === null ? 'var(--admin-ink-dim)' : (urgent && count > 0 ? 'var(--admin-critical)' : 'var(--admin-ink)'),
      }}>
        {count === null ? '—' : count}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.ff.body, fontWeight: 500, fontSize: 13, color: 'var(--admin-ink)' }}>{label}</div>
        {(note || (drill && !drill.path && drill.absent)) && (
          <div style={{ fontFamily: T.ff.body, fontWeight: 400, fontSize: 11, color: 'var(--admin-ink-mute)', marginTop: 3 }}>
            {note || drill!.absent}
          </div>
        )}
      </div>
      {canTap && <div style={{ fontFamily: T.ff.body, fontSize: 15, color: 'var(--admin-ink-dim)' }}>›</div>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 30 }}>
      <div style={{ ...EYEBROW, marginBottom: 12 }}>{title}</div>
      <div style={{ background: 'var(--admin-card-bg)', border: '0.5px solid var(--admin-card-border)', borderRadius: 14, padding: 18 }}>
        {children}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// The screen
// ═══════════════════════════════════════════════════════════════════════════

export default function Bridge() {
  const router = useRouter();
  const [data,    setData]    = useState<BridgeResponse | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pull,    setPull]    = useState(0);
  const touchY = useRef<number | null>(null);
  const inFlight = useRef(false);

  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const d = await getBridge();
      setData(d); setError(null);
    } catch (e) {
      // The WHOLE screen failed — distinct from one figure failing, which the
      // server reports per-source in `degraded`. Never a blank grid of zeros.
      setError(e instanceof Error ? e.message : 'Could not reach the Bridge');
    } finally {
      inFlight.current = false; setLoading(false); setPull(0);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const t = setInterval(load, AUTO_REFRESH_MS);
    return () => clearInterval(t);
  }, [load]);

  // Pull-to-refresh (A-4: the cockpit runs from a phone as a first-class
  // citizen). Only arms at true scroll-top so it cannot fight the page.
  useEffect(() => {
    const start = (e: TouchEvent) => {
      touchY.current = window.scrollY <= 0 ? e.touches[0].clientY : null;
    };
    const move = (e: TouchEvent) => {
      if (touchY.current === null) return;
      const dy = e.touches[0].clientY - touchY.current;
      if (dy > 0) setPull(Math.min(dy, PULL_THRESHOLD + 24));
    };
    const end = () => {
      if (pull >= PULL_THRESHOLD) load(); else setPull(0);
      touchY.current = null;
    };
    window.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove',  move,  { passive: true });
    window.addEventListener('touchend',   end);
    return () => {
      window.removeEventListener('touchstart', start);
      window.removeEventListener('touchmove',  move);
      window.removeEventListener('touchend',   end);
    };
  }, [pull, load]);

  const drill = useCallback((d: DrillTarget) => { if (d.path) router.push(d.path); }, [router]);

  if (loading && !data) {
    return <div style={{ fontFamily: T.ff.body, fontSize: 13, color: 'var(--admin-ink-mute)', padding: '40px 0' }}>Reading the day…</div>;
  }
  if (error && !data) {
    return (
      <div style={{ padding: '28px 0' }}>
        <div style={{ fontFamily: T.ff.body, fontSize: 14, color: 'var(--admin-critical)' }}>The Bridge could not be reached.</div>
        <div style={{ fontFamily: T.ff.body, fontSize: 12, color: 'var(--admin-ink-mute)', marginTop: 8 }}>{error}</div>
        <button onClick={load} style={{
          marginTop: 16, minHeight: 44, padding: '0 20px', cursor: 'pointer',
          background: 'var(--admin-metal-wash)', border: '0.5px solid var(--admin-metal-line)',
          borderRadius: 10, color: 'var(--admin-metal)', fontFamily: T.ff.label, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>Try again</button>
      </div>
    );
  }
  if (!data) return null;

  const { today, funnels, queue } = data;
  const surfaces = Object.entries(today.wa.by_surface).filter(([, s]) => s.turns > 0);
  const totalInr = Object.values(today.wa.by_surface).reduce((a, s) => a + s.inr, 0) + today.wa.unattributed.inr;

  return (
    <div>
      {pull > 0 && (
        <div style={{ height: pull, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--admin-ink-mute)' }}>
          {pull >= PULL_THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}
        </div>
      )}

      {data.degraded && data.degraded.length > 0 && (
        // Degrade BY NAME. An empty source and a broken one must never look
        // alike — search.js's rule, carried to the Bridge.
        <div style={{
          marginBottom: 18, padding: '11px 14px', borderRadius: 10,
          background: 'var(--admin-card-bg)', border: '0.5px solid var(--admin-critical)',
          fontFamily: T.ff.body, fontSize: 11.5, color: 'var(--admin-critical)',
        }}>
          These sources did not answer: {data.degraded.join(', ')}. Their figures show — , not zero.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
        <Figure label="Enquiries"   value={today.enquiries}   drill={DRILL.enquiries}   onDrill={drill} />
        <Figure label="New leads"   value={today.new_leads}   drill={DRILL.new_leads}   onDrill={drill} />
        <Figure label="Demo claims" value={today.demo_claims} drill={DRILL.demo_claims} onDrill={drill} />
        <Figure label="New vendors" value={today.new_vendors} drill={DRILL.new_vendors} onDrill={drill} tone="metal" />
        <Figure label="Trials"      value={today.trials.active} sub="Active on the trial tier" drill={DRILL.trials} onDrill={drill} />
        <Figure label="WA turns"    value={today.wa.turns} sub={formatRs(Math.round(totalInr * 100) / 100)} drill={DRILL.wa_turns} onDrill={drill} />
        <Figure label="Downgrades"  value={today.downgrades} sub="Provider fell back to Haiku" drill={DRILL.downgrades} onDrill={drill} tone={today.downgrades ? 'caution' : undefined} />
      </div>

      <Panel title="Revenue">
        {/* THE RULED SHAPE — two lines. The honest headline, and beneath it the
            one real ledger that exists at this tip. */}
        <Honest
          s={today.revenue}
          extra={
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '0.5px solid var(--admin-hairline)' }}>
              <div style={{ ...EYEBROW, fontSize: 9 }}>Featured slot fees · today</div>
              <div style={{ fontFamily: T.ff.display, fontWeight: 500, fontSize: 34, lineHeight: 1.05, color: 'var(--admin-ink)', marginTop: 6 }}>
                {today.revenue.featured_fees.today_inr === null ? '—' : formatRs(today.revenue.featured_fees.today_inr)}
              </div>
              <div style={{ fontFamily: T.ff.body, fontSize: 11, color: 'var(--admin-ink-mute)', marginTop: 6 }}>
                {today.revenue.featured_fees.lifetime_inr === null
                  ? 'Lifetime could not be read'
                  : `${formatRs(today.revenue.featured_fees.lifetime_inr)} lifetime`}
                {' · '}{DRILL.featured_fees.absent}
              </div>
            </div>
          }
        />
        <div style={{ marginTop: 12 }}>
          <Honest s={today.trials.expiring_3d} />
        </div>
      </Panel>

      <Panel title="Model spend by surface">
        {surfaces.length === 0 && (
          <div style={{ fontFamily: T.ff.body, fontSize: 12, color: 'var(--admin-ink-mute)' }}>No WhatsApp turns today.</div>
        )}
        {surfaces.map(([kind, s]) => (
          <div key={kind} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderBottom: '0.5px solid var(--admin-hairline)' }}>
            <span style={{ fontFamily: T.ff.body, fontSize: 12.5, color: 'var(--admin-ink-soft)' }}>{kind.replace(/_/g, ' ')}</span>
            <span style={{ fontFamily: T.ff.body, fontSize: 12.5, color: 'var(--admin-ink)' }}>{s.turns} · {formatRs(s.inr)}</span>
          </div>
        ))}
        {today.wa.unattributed.turns > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}>
            <span style={{ fontFamily: T.ff.body, fontSize: 12.5, color: 'var(--admin-caution)' }}>unattributed</span>
            <span style={{ fontFamily: T.ff.body, fontSize: 12.5, color: 'var(--admin-caution)' }}>
              {today.wa.unattributed.turns} · {formatRs(today.wa.unattributed.inr)}
            </span>
          </div>
        )}
        {today.wa.partial && (
          <div style={{ marginTop: 10, fontFamily: T.ff.body, fontSize: 10.5, color: 'var(--admin-caution)' }}>
            Partial split — more turns than the fetch cap. The headline count is exact.
          </div>
        )}
        <div style={{ marginTop: 10, fontFamily: T.ff.body, fontSize: 10.5, color: 'var(--admin-ink-mute)', lineHeight: 1.5 }}>
          {today.wa.excludes}
        </div>
      </Panel>

      <Panel title="Prospect machine">
        <StageBar states={funnels.prospects.states} total={funnels.prospects.total} partial={funnels.prospects.partial} />
      </Panel>

      <Panel title="Demo lifecycle">
        <StageBar states={funnels.demo.states} total={funnels.demo.total} partial={funnels.demo.partial} />
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '0.5px solid var(--admin-hairline)', fontFamily: T.ff.body, fontSize: 12, color: 'var(--admin-ink-soft)' }}>
          {/* A rate over zero invitations is not 0%. It is no rate at all. */}
          {funnels.claim_rate_7d.rate === null
            ? `7-day claim rate — no rate yet (${funnels.claim_rate_7d.invited ?? '—'} invited in the last 7 days)`
            : `7-day claim rate ${funnels.claim_rate_7d.rate}% · ${funnels.claim_rate_7d.claimed} of ${funnels.claim_rate_7d.invited} invited`}
        </div>
      </Panel>

      <section style={{ marginTop: 30 }}>
        <div style={{ ...EYEBROW, marginBottom: 12 }}>The queue</div>
        <div style={{ background: 'var(--admin-card-bg)', border: '0.5px solid var(--admin-card-border)', borderRadius: 14, overflow: 'hidden' }}>
          <QueueRow
            label="Discover approvals pending"
            count={queue.approvals_pending.count}
            note={queue.approvals_pending.oldest_hours === null ? undefined : `Oldest waiting ${queue.approvals_pending.oldest_hours}h`}
            drill={DRILL.approvals} onDrill={drill} urgent
          />
          <QueueRow label="Failed turns unreplayed" count={queue.failed_turns.count} drill={DRILL.failed_turns} onDrill={drill} urgent />
          <QueueRow label="Takedowns · last 24h" count={queue.takedowns_24h.count} drill={DRILL.takedowns} onDrill={drill} />
          <QueueRow
            label="Templates awaiting Meta verdict"
            count={queue.templates_awaiting_verdict.count}
            note={queue.templates_awaiting_verdict.templates.map(t => t.name).join(', ') || undefined}
            drill={DRILL.templates} onDrill={drill}
          />
          <div style={{ padding: '12px 16px' }}>
            <Honest s={queue.subscriptions_halted} />
          </div>
        </div>
      </section>

      <div style={{ marginTop: 22 }}>
        <Honest s={today.credit_state} />
      </div>

      <div style={{ marginTop: 24, fontFamily: T.ff.body, fontSize: 10.5, color: 'var(--admin-ink-mute)' }}>
        {data.ist_date} IST · assembled in {data.took_ms}ms · refreshes every 60s
      </div>
    </div>
  );
}
