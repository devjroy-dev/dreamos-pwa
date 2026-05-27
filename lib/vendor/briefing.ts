// lib/briefing.ts
// Pure transforms on VendorContextResponse → snapshot strip counts + chip text.
// Context shape is from GET /api/v2/vendor/context/:vendorId.

import type { VendorContextResponse, PendingInvoice, UpcomingEvent } from './types/vendor';

// ── Snapshot strip text (collapsed panel) ────────────────────────────────
// Returns segments like ["3 invoices", "2 events", "1 new lead"]
// joined as "3 invoices · 2 events · 1 new lead" by the component.
// buildBriefing — fires as the first AI message when there's something urgent.
// Returns null when all clear — thread stays empty, vendor types first.
// Mirrors native dreamai.tsx briefing-effect block exactly.
export function buildBriefing(ctx: VendorContextResponse | null): string | null {
  if (!ctx) return null;
  const urgent: string[] = [];

  const overdue = (ctx.pending_invoices ?? []).filter((inv) => inv.overdue);
  if (overdue.length > 0)
    urgent.push(`${overdue.length} overdue invoice${overdue.length > 1 ? 's' : ''}`);

  const newLeads = ctx.new_leads ?? [];
  if (newLeads.length > 0)
    urgent.push(`${newLeads.length} new enquir${newLeads.length > 1 ? 'ies' : 'y'}`);

  const today = new Date().toISOString().slice(0, 10);
  const todayEvents = (ctx.upcoming_events ?? []).filter((ev) => ev.event_date === today);
  if (todayEvents.length > 0)
    urgent.push(`${todayEvents[0].title} today`);

  if (urgent.length === 0) return null;
  return `Good to see you. You have ${urgent.join(', ')}. How would you like to handle it?`;
}

export function getSnapshotStrip(ctx: VendorContextResponse | null): string {
  if (!ctx) return 'Loading snapshot…';
  const parts: string[] = [];
  const inv = ctx.pending_invoices?.length ?? 0;
  if (inv > 0) parts.push(`${inv} invoice${inv > 1 ? 's' : ''}`);
  const evts = ctx.upcoming_events?.length ?? 0;
  if (evts > 0) parts.push(`${evts} event${evts > 1 ? 's' : ''}`);
  const leads = ctx.new_leads?.length ?? 0;
  if (leads > 0) parts.push(`${leads} new lead${leads > 1 ? 's' : ''}`);
  return parts.length > 0 ? parts.join(' · ') : 'All clear';
}

// ── Suggestion chips ─────────────────────────────────────────────────────
const DEFAULT_CHIPS = [
  "Who owes me money?",
  "Any new enquiries?",
  "What's on my calendar today?",
  "What should I focus on now?",
];

export function getChips(ctx: VendorContextResponse | null): string[] {
  if (!ctx) return DEFAULT_CHIPS;
  const chips: string[] = [];
  const overdueCount = (ctx.pending_invoices ?? []).filter(i => i.overdue).length;
  const invCount = ctx.pending_invoices?.length ?? 0;
  chips.push(overdueCount > 0
    ? `Who owes me money? (${overdueCount} overdue)`
    : invCount > 0 ? `Who owes me money? (${invCount} pending)` : "Who owes me money?");
  const leadsCount = ctx.new_leads?.length ?? 0;
  chips.push(leadsCount > 0 ? `Any new enquiries? (${leadsCount} new)` : "Any new enquiries?");
  const nextEvent = ctx.upcoming_events?.[0];
  chips.push(nextEvent
    ? `Next: ${nextEvent.title} on ${nextEvent.event_date.slice(5)}`
    : "What's on my calendar?");
  chips.push("Draft a payment reminder");
  return chips;
}
