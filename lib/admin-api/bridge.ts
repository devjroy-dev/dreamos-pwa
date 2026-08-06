// lib/admin-api/bridge.ts
// The Bridge's data client — TDW_10 P2, ruling A-3, CE-200.
//
// Rides lib/admin-api/_base.ts's ONE header authority. No second fetch idiom is
// invented here; F-07.85's twenty-six hand-assembled header objects are exactly
// the disease that authority exists to prevent.
//
// ── THE TYPE THAT CARRIES THE WHOLE DOCTRINE ────────────────────────────────
// `number | null` is not laziness. Under F-07.90's distinction, `0` is an
// ANSWER and `null` is the absence of one, and the renderer must be able to
// tell them apart or a broken source reads as a quiet Tuesday. Every figure
// below is nullable for that reason and no other.
//
// `HonestState` is the second half: a figure that CANNOT exist yet, as opposed
// to one that failed to load. It carries its own label, its reason, its OWNER
// and its finding number — because an "unavailable" without an owner is a shrug,
// and a shrug does not get scheduled.

import { API_BASE, adminHeaders } from './_base';

/** A figure that cannot exist yet — distinct from one that failed to load. */
export interface HonestState {
  state: string;
  label: string;
  why: string;
  owner: string;
  finding: string;
}

/** ═══ TDW_10 THE BILLING SITTING · F-10.73's cure ═══════════════════════════
 *  RevenueLine USED TO extend HonestState, because until 0114 there were no
 *  money rows anywhere in the estate and the only truthful thing the endpoint
 *  could send was a label naming who owed the wiring.
 *
 *  0114 shipped, the signature-verified webhook became the sole writer, and the
 *  endpoint correctly stopped emitting `state/label/why/owner/finding` for this
 *  line. This interface did not follow, so `<Honest s={today.revenue}>` went on
 *  reading fields that no longer arrive: the eyebrow rendered `undefined`, the
 *  drawer button read "Why · undefined", and the Rs 2 the ledger truthfully held
 *  had no renderer at all. The founder's screen showed neither the old honest
 *  state nor the new true one — F-10.73, caught by his own re-read.
 *
 *  THE LAW THIS EARNS: an endpoint that retires an honest state must land in the
 *  SAME delivery as the surface that reads it. A backend-only "zero pwa bytes"
 *  radius is safe for ADDING a field and unsafe for REMOVING one, because the
 *  consumer's break is silent at compile time when the field is optional-shaped
 *  and invisible in a bench that never renders. */
export interface SubscriptionRevenue {
  today_inr: number | null;
  lifetime_inr: number | null;
  /** Every verified event today, counted or not — so a day of authorisations
   *  with no charge reads as "3 events · Rs 0" rather than as silence. */
  events_today: number | null;
  source: string;
  note: string;
}

export interface RevenueLine {
  state: string;
  label: string;
  subscriptions: SubscriptionRevenue;
  featured_fees: FeaturedFees;
}

/** Live at 0114. `halted` is written only from a verified subscription.halted
 *  event, which Razorpay sends only after its three retries are spent. */
export interface HaltedSubs {
  count: number | null;
  source: string;
}

export interface FeaturedFees {
  today_inr: number | null;
  lifetime_inr: number | null;
  source: string;
  note: string;
}

export interface SurfaceSpend { turns: number; inr: number }

export interface WaLine {
  turns: number | null;
  by_surface: Record<string, SurfaceSpend>;
  unattributed: SurfaceSpend;
  /** The split hit the server's row cap; the headline `turns` is still exact. */
  partial: boolean;
  excludes: string;
}

export interface BridgeToday {
  enquiries: number | null;
  new_leads: number | null;
  demo_claims: number | null;
  new_vendors: number | null;
  revenue: RevenueLine;
  trials: { active: number | null; expiring_3d: HonestState };
  wa: WaLine;
  downgrades: number | null;
  credit_state: HonestState;
}

export interface FunnelBucket {
  states: Record<string, number>;
  total: number;
  /** The bucket fetch hit the cap — the split under-reports and says so. */
  partial: boolean;
}

export interface BridgeFunnels {
  prospects: FunnelBucket;
  demo: FunnelBucket;
  claim_rate_7d: { invited: number | null; claimed: number | null; rate: number | null };
}

export interface BridgeQueue {
  approvals_pending: { count: number | null; oldest_hours: number | null; oldest_at: string | null };
  failed_turns: { count: number | null };
  takedowns_24h: { count: number | null };
  subscriptions_halted: HaltedSubs;
  templates_awaiting_verdict: {
    count: number;
    templates: { key: string; name: string; line: string; status: string }[];
    source: string;
    transport: string;
  };
}

export interface BridgeResponse {
  ok: boolean;
  generated_at: string;
  ist_date: string;
  window: { start: string; end: string };
  today: BridgeToday;
  funnels: BridgeFunnels;
  queue: BridgeQueue;
  took_ms: number;
  /** Named per-source failures. A partial answer is stated, never disguised as
   *  an empty one — the never-a-false-done law reaching the Bridge. */
  degraded?: string[];
}

/** ONE round trip. The whole screen is assembled server-side (spec §P2); a
 *  client that fanned out per-figure would be the dashboard-HALF F-07.95 names,
 *  rebuilt. */
export async function getBridge(signal?: AbortSignal): Promise<BridgeResponse> {
  const res = await fetch(`${API_BASE}/api/v2/admin/bridge`, {
    headers: adminHeaders(),
    signal,
    // The Bridge is a live instrument. A cached morning screen is a lie with a
    // timestamp on it.
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`bridge failed: ${res.status}`);
  return res.json();
}

// ═════════════════════════════════════════════════════════════════════════════
// THE DRILL MAP — every figure's owning surface, and the ones that have none
// ═════════════════════════════════════════════════════════════════════════════
// A-3's "no dead numbers" clause means every rendered figure tap-drills to the
// list it came from. It does NOT mean every figure gets a link: three of P2's
// sources have no admin screen at this tip (failed_turns, the template
// registry, the featured ledger), and inventing a path for them would ship a
// row that 404s — a dead number wearing a link's clothes, which is worse than
// an honest one that says where the screen isn't yet.
//
// `null` here therefore means "no owning surface EXISTS", and the renderer
// prints the reason. Every non-null path below is a LIVE disposition in
// adminNav.ts's ROUTE_MAP — asserted mechanically by the bench, not eyeballed,
// so a path that later retires cannot rot into a broken tap.

export interface DrillTarget {
  /** An existing LIVE admin route, or null when no screen owns this figure. */
  path: string | null;
  /** Printed when path is null. Names what is missing and whose build it is. */
  absent?: string;
}

export const DRILL: Record<string, DrillTarget> = {
  enquiries:    { path: '/admin/dreamers' },
  new_leads:    { path: '/admin/makers' },
  demo_claims:  { path: '/admin/demo' },
  new_vendors:  { path: '/admin/makers' },
  trials:       { path: '/admin/makers' },
  wa_turns:     { path: '/admin/conversations/vendors' },
  downgrades:   { path: '/admin/config' },
  featured_fees:{ path: null, absent: 'No featured ledger screen yet — /admin/featured is a phantom (F-07.95).' },
  prospects:    { path: '/admin/prospects' },
  demo_funnel:  { path: '/admin/demo' },
  approvals:    { path: '/admin/approvals/discover' },
  failed_turns: { path: null, absent: 'No failed-turns screen yet — P4 builds it into the health board.' },
  takedowns:    { path: '/admin/demo' },
  templates:    { path: null, absent: 'No templates screen yet — P4 builds the registry\u2019s runtime twin.' },
};
