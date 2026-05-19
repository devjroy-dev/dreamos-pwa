// lib/mocks/vendor.ts
// ─────────────────────────────────────────────────────────────────────────────
// Mock data for vendor PWA, shaped exactly to lib/types/vendor.ts.
//
// SHAPE FIDELITY: every mock conforms to its TypeScript interface — Drift is
// a compile error, not a runtime surprise. When flipping to real backend,
// screens see the same shape, never break.
//
// PERSONA: "Aanya Studio" — Delhi-based luxury wedding photographer.
// Tier: signature. Founding cohort: true. Wedding-busy month (Nov 2026).
//
// AMOUNT CONVENTION: rupees as integers (e.g. 350000 = ₹3,50,000).
// Matches dream-os contract: "rupees as integers" — line 66 of API_CONTRACTS.md.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  VendorMeResponse, VendorTodayResponse, VendorLeadsResponse,
  VendorClientsResponse, VendorClientDetailResponse,
  VendorInvoicesResponse, VendorExpensesResponse, VendorEventsResponse,
  VendorContextResponse,
} from '../types/vendor';

// ─── Stable seed values ─────────────────────────────────────────────────────
const VENDOR_ID  = '11111111-1111-1111-1111-111111111111';
const USER_ID    = '22222222-2222-2222-2222-222222222222';
const TODAY      = '2026-11-15';     // mock "today" — Nov 2026, wedding season peak
const SEVEN_DAYS = '2026-11-22';

// ─── /vendor/me ─────────────────────────────────────────────────────────────
export const MOCK_VENDOR_ME: VendorMeResponse = {
  ok: true,
  vendor: {
    id:                VENDOR_ID,
    name:              'Aanya Mehta',
    business_name:     'Aanya Studio',
    category:          'photography',
    city:              'Delhi',
    handle:            'AANYA550',
    upi_id:            'aanya@okhdfc',
    gstin:             null,
    open_to_travel:    true,
    tier:              'signature',
    founding_cohort:   true,
    aesthetic_tags:    null,
    rate_min:          null,
    rate_max:          null,
    discover_preview:  false,
  },
};

// ─── /vendor/today ──────────────────────────────────────────────────────────
export const MOCK_VENDOR_TODAY: VendorTodayResponse = {
  ok: true,
  vendor: {
    name:     'Aanya Mehta',
    category: 'photography',
    city:     'Delhi',
  },
  needs_attention: {
    overdue_invoices: [
      {
        id:          '33333333-3333-3333-3333-333333333301',
        client_name: 'Priya & Rohan',
        amount_owed: 175000,
        due_date:    '2026-11-08',
      },
      {
        id:          '33333333-3333-3333-3333-333333333302',
        client_name: 'Tanvi Sharma',
        amount_owed: 80000,
        due_date:    '2026-11-12',
      },
    ],
    new_leads: [
      {
        id:           '44444444-4444-4444-4444-444444444401',
        name:         'Ishika Verma',
        wedding_date: '2027-02-14',
        budget_total: 350000,
        created_at:   '2026-11-15T08:42:00+05:30',
      },
      {
        id:           '44444444-4444-4444-4444-444444444402',
        name:         null,
        wedding_date: null,
        budget_total: null,
        created_at:   '2026-11-15T11:20:00+05:30',
      },
    ],
    events_today: [
      {
        id:         '55555555-5555-5555-5555-555555555501',
        title:      'Engagement shoot — Anaya & Vihaan',
        kind:       'shoot',
        event_time: '16:00:00',
      },
    ],
  },
  this_week: [
    {
      id:         '55555555-5555-5555-5555-555555555502',
      title:      'Mehndi — Priya & Rohan',
      kind:       'ceremony',
      event_date: '2026-11-17',
      event_time: '11:00:00',
    },
    {
      id:         '55555555-5555-5555-5555-555555555503',
      title:      'Wedding — Priya & Rohan',
      kind:       'ceremony',
      event_date: '2026-11-19',
      event_time: '19:00:00',
    },
    {
      id:         '55555555-5555-5555-5555-555555555504',
      title:      'Recce — Sahiba & Aarav venue',
      kind:       'recce',
      event_date: '2026-11-21',
      event_time: '15:00:00',
    },
  ],
  money_snapshot: {
    total_outstanding:  385000,
    unpaid_count:       2,
    advance_paid_count: 4,
  },
  open_leads_count: 7,
};

// ─── /vendor/leads ──────────────────────────────────────────────────────────
export const MOCK_VENDOR_LEADS: VendorLeadsResponse = {
  ok: true,
  total: 6,
  leads: [
    {
      id:           '44444444-4444-4444-4444-444444444401',
      name:         'Ishika Verma',
      wedding_date: '2027-02-14',
      wedding_city: 'Jaipur',
      budget_total: 350000,
      state:        'new',
      source:       'whatsapp',
      referrer:     null,
      raw_message:  'Hi, looking for photographer for my Feb wedding in Jaipur. Saw your work via @swati_makeup.',
      created_at:   '2026-11-15T08:42:00+05:30',
    },
    {
      id:           '44444444-4444-4444-4444-444444444402',
      name:         null,
      wedding_date: null,
      budget_total: null,
      state:        'new',
      wedding_city: null,
      source:       'instagram',
      referrer:     null,
      raw_message:  'Hi I saw your reel. Pricing pls',
      created_at:   '2026-11-15T11:20:00+05:30',
    },
    {
      id:           '44444444-4444-4444-4444-444444444403',
      name:         'Megha Kapoor',
      wedding_date: '2026-12-08',
      wedding_city: 'Delhi',
      budget_total: 280000,
      state:        'contacted',
      source:       'referral',
      referrer:     'Tanvi Sharma',
      raw_message:  null,
      created_at:   '2026-11-12T15:30:00+05:30',
    },
    {
      id:           '44444444-4444-4444-4444-444444444404',
      name:         'Sahiba & Aarav',
      wedding_date: '2027-01-22',
      wedding_city: 'Udaipur',
      budget_total: 500000,
      state:        'quoted',
      source:       'discover',
      referrer:     null,
      raw_message:  null,
      created_at:   '2026-11-10T10:00:00+05:30',
    },
    {
      id:           '44444444-4444-4444-4444-444444444405',
      name:         'Priya & Rohan',
      wedding_date: '2026-11-19',
      wedding_city: 'Delhi',
      budget_total: 450000,
      state:        'booked',
      source:       'instagram',
      referrer:     null,
      raw_message:  null,
      created_at:   '2026-09-01T12:00:00+05:30',
    },
    {
      id:           '44444444-4444-4444-4444-444444444406',
      name:         'Rhea Singh',
      wedding_date: '2026-12-15',
      wedding_city: 'Goa',
      budget_total: 200000,
      state:        'lost',
      source:       'whatsapp',
      referrer:     null,
      raw_message:  null,
      created_at:   '2026-10-22T09:15:00+05:30',
    },
  ],
};

// ─── /vendor/clients ────────────────────────────────────────────────────────
export const MOCK_VENDOR_CLIENTS: VendorClientsResponse = {
  ok: true,
  total: 5,
  clients: [
    {
      id:         '66666666-6666-6666-6666-666666666601',
      name:       'Priya & Rohan',
      phone:      '+919876543210',
      email:      'priya.rohan@example.com',
      notes:      'November wedding. Two-day shoot booked. Prefers candid over posed.',
      created_at: '2026-09-01T12:00:00+05:30',
    },
    {
      id:         '66666666-6666-6666-6666-666666666602',
      name:       'Tanvi Sharma',
      phone:      '+919812345678',
      email:      null,
      notes:      'Engagement shoot only. Possible referral source — sister getting married next year.',
      created_at: '2026-10-15T14:00:00+05:30',
    },
    {
      id:         '66666666-6666-6666-6666-666666666603',
      name:       'Anaya & Vihaan',
      phone:      '+919900112233',
      email:      'anaya.v@gmail.com',
      notes:      'Engagement shoot today (15 Nov). Wedding date TBD.',
      created_at: '2026-11-01T10:00:00+05:30',
    },
    {
      id:         '66666666-6666-6666-6666-666666666604',
      name:       'Sahiba Mehta',
      phone:      '+918765432100',
      email:      null,
      notes:      'Udaipur destination wedding Jan 2027. Travel + 4-day package.',
      created_at: '2026-10-08T11:30:00+05:30',
    },
    {
      id:         '66666666-6666-6666-6666-666666666605',
      name:       'Megha Kapoor',
      phone:      null,
      email:      'megha.k@gmail.com',
      notes:      'Referred by Tanvi. December wedding.',
      created_at: '2026-11-12T15:30:00+05:30',
    },
  ],
};

// ─── /vendor/clients/:clientId (detail) ─────────────────────────────────────
export const MOCK_VENDOR_CLIENT_DETAIL: VendorClientDetailResponse = {
  ok: true,
  client: {
    id:    '66666666-6666-6666-6666-666666666601',
    name:  'Priya & Rohan',
    phone: '+919876543210',
    email: 'priya.rohan@example.com',
    notes: 'November wedding. Two-day shoot booked. Prefers candid over posed.',
  },
  leads: [
    {
      id:           '44444444-4444-4444-4444-444444444405',
      wedding_date: '2026-11-19',
      state:        'booked',
      budget_total: 450000,
    },
  ],
  invoices: [
    {
      id:           '77777777-7777-7777-7777-777777777701',
      amount_total: 450000,
      amount_paid:  275000,
      state:        'advance_paid',
      due_date:     '2026-11-08',
    },
    {
      id:           '77777777-7777-7777-7777-777777777702',
      amount_total: 50000,
      amount_paid:  0,
      state:        'unpaid',
      due_date:     '2026-12-01',
    },
  ],
};

// ─── /vendor/invoices ───────────────────────────────────────────────────────
export const MOCK_VENDOR_INVOICES: VendorInvoicesResponse = {
  ok: true,
  total: 5,
  summary: {
    total_outstanding: 385000,
    total_collected:   720000,
  },
  invoices: [
    {
      id:             '77777777-7777-7777-7777-777777777701',
      invoice_number: 'TDW/AANYA550/05',
      client_name:    'Priya & Rohan',
      amount_total:   450000,
      amount_paid:    275000,
      amount_owed:    175000,
      state:          'advance_paid',
      due_date:       '2026-11-08',
      created_at:     '2026-09-01T12:30:00+05:30',
    },
    {
      id:             '77777777-7777-7777-7777-777777777702',
      invoice_number: 'TDW/AANYA550/06',
      client_name:    'Priya & Rohan',
      amount_total:   50000,
      amount_paid:    0,
      amount_owed:    50000,
      state:          'unpaid',
      due_date:       '2026-12-01',
      created_at:     '2026-11-01T09:00:00+05:30',
    },
    {
      id:             '77777777-7777-7777-7777-777777777703',
      invoice_number: 'TDW/AANYA550/07',
      client_name:    'Tanvi Sharma',
      amount_total:   80000,
      amount_paid:    0,
      amount_owed:    80000,
      state:          'unpaid',
      due_date:       '2026-11-12',
      created_at:     '2026-10-20T14:00:00+05:30',
    },
    {
      id:             '77777777-7777-7777-7777-777777777704',
      invoice_number: 'TDW/AANYA550/08',
      client_name:    'Anaya & Vihaan',
      amount_total:   65000,
      amount_paid:    32500,
      amount_owed:    32500,
      state:          'advance_paid',
      due_date:       '2026-11-30',
      created_at:     '2026-11-01T10:30:00+05:30',
    },
    {
      id:             '77777777-7777-7777-7777-777777777705',
      invoice_number: 'TDW/AANYA550/04',
      client_name:    'Sahiba Mehta',
      amount_total:   600000,
      amount_paid:    150000,
      amount_owed:    450000,
      state:          'advance_paid',
      due_date:       '2027-01-15',
      created_at:     '2026-10-08T12:00:00+05:30',
    },
  ],
};

// ─── /vendor/expenses ───────────────────────────────────────────────────────
export const MOCK_VENDOR_EXPENSES: VendorExpensesResponse = {
  ok: true,
  total: 5,
  total_spent: 167500,
  expenses: [
    {
      id:           '88888888-8888-8888-8888-888888888801',
      description:  'Sony A7IV body — second camera',
      amount:       95000,
      category:     'equipment',
      expense_date: '2026-11-02',
      client_name:  null,
      created_at:   '2026-11-02T18:00:00+05:30',
    },
    {
      id:           '88888888-8888-8888-8888-888888888802',
      description:  'Assistant fee — Priya wedding day 1',
      amount:       12000,
      category:     'assistant',
      expense_date: '2026-11-19',
      client_name:  'Priya & Rohan',
      created_at:   '2026-11-19T22:00:00+05:30',
    },
    {
      id:           '88888888-8888-8888-8888-888888888803',
      description:  'Travel to Udaipur recce',
      amount:       28000,
      category:     'travel',
      expense_date: '2026-11-08',
      client_name:  'Sahiba Mehta',
      created_at:   '2026-11-08T20:00:00+05:30',
    },
    {
      id:           '88888888-8888-8888-8888-888888888804',
      description:  'Lightroom + Adobe CC annual',
      amount:       22500,
      category:     'software',
      expense_date: '2026-10-30',
      client_name:  null,
      created_at:   '2026-10-30T12:00:00+05:30',
    },
    {
      id:           '88888888-8888-8888-8888-888888888805',
      description:  'Catering — engagement shoot crew lunch',
      amount:       10000,
      category:     'food',
      expense_date: '2026-11-15',
      client_name:  'Anaya & Vihaan',
      created_at:   '2026-11-15T15:30:00+05:30',
    },
  ],
};

// ─── /vendor/events ─────────────────────────────────────────────────────────
export const MOCK_VENDOR_EVENTS: VendorEventsResponse = {
  ok: true,
  total: 6,
  events: [
    {
      id:         '55555555-5555-5555-5555-555555555501',
      title:      'Engagement shoot — Anaya & Vihaan',
      kind:       'shoot',
      event_date: '2026-11-15',
      event_time: '16:00:00',
      state:      'upcoming',
      lead_id:    null,
      notes:      'Lodhi Garden. Golden hour. Bring 85mm.',
    },
    {
      id:         '55555555-5555-5555-5555-555555555502',
      title:      'Mehndi — Priya & Rohan',
      kind:       'ceremony',
      event_date: '2026-11-17',
      event_time: '11:00:00',
      state:      'upcoming',
      lead_id:    '44444444-4444-4444-4444-444444444405',
      notes:      'Home function. Two photographers.',
    },
    {
      id:         '55555555-5555-5555-5555-555555555503',
      title:      'Wedding — Priya & Rohan',
      kind:       'ceremony',
      event_date: '2026-11-19',
      event_time: '19:00:00',
      state:      'upcoming',
      lead_id:    '44444444-4444-4444-4444-444444444405',
      notes:      'ITC Maurya. Full team. Cinematic deliverable.',
    },
    {
      id:         '55555555-5555-5555-5555-555555555504',
      title:      'Recce — Sahiba & Aarav venue',
      kind:       'recce',
      event_date: '2026-11-21',
      event_time: '15:00:00',
      state:      'upcoming',
      lead_id:    null,
      notes:      'Leela Palace Udaipur.',
    },
    {
      id:         '55555555-5555-5555-5555-555555555505',
      title:      'Call back Ishika',
      kind:       'reminder',
      event_date: '2026-11-16',
      event_time: null,
      state:      'upcoming',
      lead_id:    '44444444-4444-4444-4444-444444444401',
      notes:      null,
    },
    {
      id:         '55555555-5555-5555-5555-555555555506',
      title:      'Album review — Tanvi',
      kind:       'meeting',
      event_date: '2026-11-23',
      event_time: '14:00:00',
      state:      'upcoming',
      lead_id:    null,
      notes:      'Bring final cut + 3 cover options.',
    },
  ],
};

// ─── /vendor/context ────────────────────────────────────────────────────────
export const MOCK_VENDOR_CONTEXT: VendorContextResponse = {
  ok: true,
  vendor: {
    name:     'Aanya Mehta',
    category: 'photography',
    city:     'Delhi',
    handle:   'AANYA550',
  },
  pending_invoices: [
    {
      client_name: 'Priya & Rohan',
      amount_owed: 175000,
      due_date:    '2026-11-08',
      overdue:     true,
    },
    {
      client_name: 'Tanvi Sharma',
      amount_owed: 80000,
      due_date:    '2026-11-12',
      overdue:     true,
    },
    {
      client_name: 'Anaya & Vihaan',
      amount_owed: 32500,
      due_date:    '2026-11-30',
      overdue:     false,
    },
  ],
  upcoming_events: [
    { title: 'Engagement shoot — Anaya & Vihaan', kind: 'shoot',    event_date: '2026-11-15', event_time: '16:00:00' },
    { title: 'Mehndi — Priya & Rohan',            kind: 'ceremony', event_date: '2026-11-17', event_time: '11:00:00' },
    { title: 'Wedding — Priya & Rohan',           kind: 'ceremony', event_date: '2026-11-19', event_time: '19:00:00' },
  ],
  new_leads: [
    { name: 'Ishika Verma', wedding_date: '2027-02-14', budget_total: 350000 },
    { name: null,           wedding_date: null,         budget_total: null   },
  ],
  recent_notes: [
    { content: 'Priya confirmed cinematic deliverable + 2 photographers for both days.' },
    { content: 'Sahiba Udaipur — venue agreed to 4 hours of access for recce.' },
    { content: 'Tanvi sister gets married next year — possible referral.' },
  ],
};

// ─── POST /vendor/chat (smart mock replies) ─────────────────────────────────
// Returns a reply that loosely matches the user's message intent + a plausible
// tool_calls list. This is purely for shell demo; the real engine is far more
// capable, but the shape is what matters for wiring.
export function MOCK_VENDOR_CHAT_REPLY(message: string): { reply: string; tool_calls: string[] } {
  const m = message.toLowerCase();

  if (/overdue|outstanding|unpaid|money owed/.test(m)) {
    return {
      reply: `You have 2 overdue invoices totalling ₹2,55,000. Priya & Rohan (₹1,75,000, 7 days overdue) and Tanvi Sharma (₹80,000, 3 days overdue). Want me to draft polite reminders?`,
      tool_calls: ['list_invoices', 'calc_overdue'],
    };
  }
  if (/lead|enquir|new client/.test(m)) {
    return {
      reply: `Two new leads today. Ishika Verma — Feb 2027 Jaipur wedding, ₹3.5L budget, came via Swati's reel. And one without details yet from Instagram. Want me to reply to Ishika with your rate card?`,
      tool_calls: ['list_leads', 'fetch_lead_context'],
    };
  }
  if (/today|schedule|event|shoot/.test(m)) {
    return {
      reply: `Today: engagement shoot at Lodhi Garden, 4 PM with Anaya & Vihaan. This week: Priya & Rohan's mehndi (17th) and wedding (19th), then Udaipur recce on the 21st. Pre-shoot reminder — they wanted 85mm prime.`,
      tool_calls: ['list_events', 'query_day'],
    };
  }
  if (/hot date|muhurat|auspicious|peak season/.test(m)) {
    return {
      reply: `Next 30 days has 8 muhurat dates including Nov 19 (which is already booked for Priya). Dec 8, 11, 14 and Jan 22 are still open in your calendar — those are typically high-demand. Want a full breakdown?`,
      tool_calls: ['hot_dates_context'],
    };
  }
  if (/spend|expense|cost/.test(m)) {
    return {
      reply: `This month you've spent ₹1,67,500. Biggest items: A7IV body (₹95,000) and Udaipur recce travel (₹28,000). Your software stack auto-renewed for ₹22,500.`,
      tool_calls: ['list_expenses'],
    };
  }

  return {
    reply: `I have your full picture — 7 open leads, ₹3,85,000 outstanding, 4 shoots this week. Ask me about leads, money, today's schedule, or anything client-specific.`,
    tool_calls: [],
  };
}
