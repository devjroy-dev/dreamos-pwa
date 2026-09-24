// scripts/lib/b123_fixtures.mjs · TDW CE-45 · FE-2 · TYPE_1 · the stand-in's rows (e-108's cure).
// Lives in scripts/lib/ so run-floor.sh's flat glob never collects it; read by b123's probe.
//
// WHY THIS FILE EXISTS. FE-1's audit and FE-2's own read-first measured every list room EMPTY: the
// stand-in answered every read with {ok:true} and no rows (e-108), so the rows and the sheets the
// rooms open were never measured. These are the rows the rung measures instead.
//
// THE SHAPES ARE THE WIRE'S, NOT A TIDIER GUESS (C-44.3). Each read's envelope is the pwa's own
// declared contract at lib/vendor/types/vendor.ts (LeadsResponse :347, InvoicesResponse :470,
// ExpensesResponse :578, EventsResponse :689) and lib/vendor/api/vendor.ts (CabinetResponse :89,
// CabinetBinder :46). Money travels as JS numbers because the server makes it so: dream-os
// src/api/vendor/invoices.js :45 and :126 and money.js :298 and :459 wrap every amount in Number().
// Dates travel as the columns do: a DATE as 'YYYY-MM-DD', a timestamptz as an ISO instant.
//
// THE MONEY FIGURE IS THE LONGEST THE WIRE CAN CARRY IN A ROOM (F6's cell): the invoices summary
// carries Rs 9,99,99,99,999 outstanding, eleven digits, so "the whole figure fits at t1" is
// measured on the widest figure rather than a comfortable one.
export const VID = '00000000-0000-0000-0000-000000000000';

export const LEADS = {
  ok: true, total: 3,
  leads: [
    { id: 'lead-0001', name: 'Aanya Kapoor', phone: '+919811100001', wedding_city: 'Jaipur',
      wedding_date: '2027-02-14', wedding_date_precision: 'day', budget_total: 2500000, budget_min: 1500000,
      state: 'new', source: 'wedding_team', referrer: null, raw_message: null, notes: 'Two days, Sangeet first.',
      created_at: '2026-09-20T06:30:00.000Z', tdw: true, tdw_enquired_at: '2026-09-21T09:15:00.000Z',
      redacted: false, forwarded_to: null, forwarded_by: null,
      // TYPE_2: one draft gap, so the lead's sheet draws MissingChips (1b's modules are measured now)
      draft: { missing: ['budget_max'], complete_inline: { method: 'POST', path: '/api/v2/vendor/leads/lead-0001' }, tell_victor: { path: '/vendor', primer: 'About Aanya Kapoor: ' } } },
    { id: 'lead-0002', name: null, phone: '+919811100002', wedding_city: null,
      wedding_date: '2027-03-01', wedding_date_precision: 'month', budget_total: null, budget_min: 1000000,
      state: 'contacted', source: 'whatsapp', referrer: null, raw_message: null, notes: null,
      created_at: '2026-09-18T11:00:00.000Z', tdw: false, tdw_enquired_at: null,
      redacted: false, draft: null, forwarded_to: null, forwarded_by: null },
    { id: 'lead-0003', name: 'Rohan Mehta', phone: '+919811100003', wedding_city: 'Udaipur',
      wedding_date: '2026-12-12', wedding_date_precision: 'day', budget_total: 900000, budget_min: 500000,
      state: 'booked', source: 'peer_referral', referrer: null, raw_message: null, notes: null,
      created_at: '2026-08-02T04:45:00.000Z', tdw: false, tdw_enquired_at: null,
      redacted: false, draft: null, forwarded_to: null,
      forwarded_by: { peer_name: 'Studio Nine', note: 'A lovely couple, call after six.', told: null } },
  ],
};

const binder = (o) => ({
  amount: null, amount_received: null, amount_pending: null, payment_status: null, direction: null,
  date: null, stage: null, note: null, followup_on: null, followup_note: null, phone: null,
  booked_lead: false, created_at: '2026-09-01T05:00:00.000Z', updated_at: '2026-09-22T05:00:00.000Z',
  reason_for_action: null, doc_ref: null, repeat_every: null, missing_cells: [], ...o,
});
export const CABINET = {
  ok: true,
  vendor: { name: 'Probe', category: 'photography', city: 'Delhi', handle: 'probe' },
  clients: [
    binder({ id: 'bind-0001', client: 'Aanya Kapoor', phone: '+919811100001', amount: 250000,
      amount_received: 100000, amount_pending: 150000, payment_status: 'partial', direction: 'in',
      stage: 'booked', note: 'Sangeet and wedding, two days.', missing_cells: ['date'] }),
    binder({ id: 'bind-0002', client: 'Kabir Singh', phone: '+919811100004', stage: 'enquiry' }),
  ],
  leads: [], booked: [], reminders: [],
  counts: { clients: 2, leads: 0, booked: 0, reminders: 0 },
};

export const INVOICES = {
  ok: true, total: 2,
  invoices: [
    { id: 'inv-0001', invoice_number: 'TDW-0001', client_name: 'Aanya Kapoor', client_phone: '+919811100001',
      amount_total: 9999999999, amount_paid: 0, amount_owed: 9999999999, state: 'unpaid',
      due_date: '2027-01-15', created_at: '2026-09-10T05:00:00.000Z', lead_package_id: null },
    { id: 'inv-0002', invoice_number: 'TDW-0002', client_name: 'Kabir Singh', client_phone: '+919811100004',
      amount_total: 120000, amount_paid: 120000, amount_owed: 0, state: 'paid',
      due_date: null, created_at: '2026-08-10T05:00:00.000Z', lead_package_id: null },
  ],
  summary: { total_outstanding: 9999999999, total_collected: 120000 },
};

export const SCHEDULE = {
  ok: true,
  schedule: [
    { id: 'ms-0001', invoice_id: 'inv-0001', milestone_label: 'Booking', pct: 30, amount_due: 2999999999,
      due_date: '2026-10-01', state: 'pending', sent_at: null, reminder_failed: false, paid_amount: null, paid_at: null },
    { id: 'ms-0002', invoice_id: 'inv-0001', milestone_label: 'Shoot day', pct: 70, amount_due: 7000000000,
      due_date: '2027-01-15', state: 'pending', sent_at: null, reminder_failed: false, paid_amount: null, paid_at: null },
  ],
};

export const EXPENSES = {
  ok: true, total: 2, total_spent: 46500,
  expenses: [
    { id: 'exp-0001', description: 'Drone rental', amount: 18000, category: 'equipment',
      expense_date: '2026-09-12', client_name: 'Aanya Kapoor', created_at: '2026-09-12T08:00:00.000Z' },
    { id: 'exp-0002', description: 'Travel to Jaipur', amount: 28500, category: 'travel',
      expense_date: '2026-09-03', client_name: null, created_at: '2026-09-03T08:00:00.000Z' },
  ],
};

export const EVENTS = {
  ok: true, total: 2, capped: false,
  events: [
    { id: 'ev-0001', title: 'Aanya Kapoor Sangeet', kind: 'shoot', event_date: '2027-02-13', event_time: '18:00:00',
      state: 'upcoming', lead_id: 'lead-0001', notes: null, linked_binder_id: 'bind-0001' },
    { id: 'ev-0002', title: 'Recce at Udaipur', kind: 'recce', event_date: '2026-11-20', event_time: null,
      state: 'upcoming', lead_id: null, notes: null, linked_binder_id: null },
  ],
};

export const NOTES = { ok: true, notes: [
  { id: 'note-0001', body: 'Call the Jaipur venue about the mandap timing.', binder_id: null, created_at: '2026-09-22T10:00:00.000Z' },
  { id: 'note-0002', body: 'Kabir wants the teaser within a week.', binder_id: 'bind-0002', created_at: '2026-09-19T07:30:00.000Z' },
] };

// TYPE_2: the lead's own conversation (ConversationMessage, lib/vendor/types/vendor.ts :411), so the
// thread and its stamps draw. The instants are fixed; the stamp derives its IST day the house's way.
export const LEAD_DETAIL = { ok: true, name: 'Aanya Kapoor', vendor_summary: 'Two-day wedding in Jaipur; asked for the Sangeet first.',
  conversation: [
    { direction: 'inbound', body: 'Hi, are you free on 14 Feb 2027 in Jaipur?', created_at: '2026-09-20T06:31:00.000Z', sent_by: 'lead' },
    { direction: 'outbound', body: 'Yes, that date is open. Shall I share the packages?', created_at: '2026-09-20T06:40:00.000Z', sent_by: 'vendor' },
    { direction: 'inbound', body: 'Please do, and the Sangeet too.', created_at: '2026-09-20T07:02:00.000Z', sent_by: 'lead' },
  ] };

export const ME = { ok: true, vendor: { id: VID, name: 'Probe', business_name: 'Probe Studio', category: 'photography',
  city: 'Delhi', handle: 'probe', upi_id: null, gstin: null } };

/** One route table, most specific first. The probe answers every other read {ok:true}, as b120's does. */
export function answer(route) {
  if (route === '/api/v2/vendor/leads/lead-0001/detail') return LEAD_DETAIL;
  if (/^\/api\/v2\/vendor\/leads\/[^/]+\/detail$/.test(route)) return { ok: false, error: 'not in the stand-in' };
  if (/^\/api\/v2\/vendor\/leads\/[^/]+\/package$/.test(route)) return { ok: true, lead_package: null };
  if (route === `/api/v2/vendor/leads/${VID}`) return LEADS;
  if (route === `/api/v2/vendor/cabinet/${VID}`) return CABINET;
  if (route === `/api/v2/vendor/money/invoices/${VID}`) return INVOICES;
  if (route === `/api/v2/vendor/money/expenses/${VID}`) return EXPENSES;
  if (route === `/api/v2/vendor/events/${VID}`) return EVENTS;
  // the paid invoice carries no schedule, so its sheet offers "Add" and the add-milestones sheet opens
  if (route === '/api/v2/vendor/invoices/inv-0002/schedule') return { ok: true, schedule: [] };
  if (/^\/api\/v2\/vendor\/invoices\/[^/]+\/schedule$/.test(route)) return SCHEDULE;
  if (route === '/api/v2/vendor/notes') return NOTES;
  if (route === '/api/v2/vendor/packages') return { ok: true, packages: [] };
  if (route === '/api/v2/vendor/me') return ME;
  return { ok: true };
}
