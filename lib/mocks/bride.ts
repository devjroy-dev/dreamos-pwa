// lib/mocks/bride.ts
// ─────────────────────────────────────────────────────────────────────────────
// Mock data for bride PWA. Shaped exactly to lib/types/bride.ts.
//
// PERSONA: Priya Sharma — Delhi bride, wedding 19 Nov 2026 (from demo couple).
// Demo couple UUID: 97f3f358-1130-449d-bb65-2863d006c79a
// ─────────────────────────────────────────────────────────────────────────────

import type {
  CoupleMeResponse, CoupleTodayResponse, CoupleMuseResponse,
  CoupleCircleResponse, CoupleEventsResponse,
  CoupleBookingsResponse, CoupleReceiptsResponse,
} from '../types/bride';

const COUPLE_ID = '97f3f358-1130-449d-bb65-2863d006c79a';
const TODAY = '2026-11-15';

// ─── /couple/me ─────────────────────────────────────────────────────────────
export const MOCK_COUPLE_ME: CoupleMeResponse = {
  ok: true,
  couple: {
    id:           COUPLE_ID,
    name:         'Priya',
    partner_name: 'Rohan',
    wedding_date: '2026-11-19',
    wedding_city: 'Delhi',
    budget_total: 4500000,
    phone:        '+918757788550',
  },
};

// ─── /couple/today ──────────────────────────────────────────────────────────
export const MOCK_COUPLE_TODAY: CoupleTodayResponse = {
  ok: true,
  couple: {
    name:             'Priya',
    wedding_date:     '2026-11-19',
    days_to_wedding:  4,
  },
  upcoming_events: [
    { id: 'ev-01', title: 'Mehndi',        kind: 'ceremony', event_date: '2026-11-17', event_time: '11:00:00' },
    { id: 'ev-02', title: 'Wedding',        kind: 'ceremony', event_date: '2026-11-19', event_time: '19:00:00' },
    { id: 'ev-03', title: 'Lehenga fitting', kind: 'fitting', event_date: '2026-11-16', event_time: '14:00:00' },
  ],
  recent_muse: [
    { id: 'ms-01', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/reception-lehenga-01.jpg', tags: ['reception', 'lehenga', 'red'] },
    { id: 'ms-02', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/mehendi-decor-01.jpg',     tags: ['mehendi', 'floral', 'yellow'] },
    { id: 'ms-03', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/bridal-jewellery-01.jpg',  tags: ['jewellery', 'kundan', 'gold'] },
  ],
  circle_activity: [
    { member_name: 'Ananya (Sister)',  action: 'saved a look to Muse',     created_at: '2026-11-15T09:30:00+05:30' },
    { member_name: 'Mrs Sharma (Mom)', action: 'commented on lehenga idea', created_at: '2026-11-14T21:00:00+05:30' },
  ],
  bookings_count: 6,
  muse_count:     47,
};

// ─── /couple/muse ────────────────────────────────────────────────────────────
export const MOCK_COUPLE_MUSE: CoupleMuseResponse = {
  ok: true,
  total: 12,
  saves: [
    { id: 'ms-01', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/reception-lehenga-01.jpg', cloudinary_public_id: 'muse/reception-lehenga-01', tags: ['reception', 'lehenga', 'red'],     source_url: null, ceremony: 'reception', created_at: '2026-11-14T18:00:00+05:30' },
    { id: 'ms-02', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/mehendi-decor-01.jpg',     cloudinary_public_id: 'muse/mehendi-decor-01',     tags: ['mehendi', 'floral', 'yellow'],   source_url: null, ceremony: 'mehendi',  created_at: '2026-11-13T15:00:00+05:30' },
    { id: 'ms-03', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/bridal-jewellery-01.jpg',  cloudinary_public_id: 'muse/bridal-jewellery-01',  tags: ['jewellery', 'kundan', 'gold'],  source_url: null, ceremony: 'wedding',  created_at: '2026-11-12T20:00:00+05:30' },
    { id: 'ms-04', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/sangeet-outfit-01.jpg',    cloudinary_public_id: 'muse/sangeet-outfit-01',    tags: ['sangeet', 'lehenga', 'blue'],   source_url: null, ceremony: 'sangeet',  created_at: '2026-11-11T12:00:00+05:30' },
    { id: 'ms-05', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/haldi-outfit-01.jpg',      cloudinary_public_id: 'muse/haldi-outfit-01',      tags: ['haldi', 'yellow', 'cotton'],    source_url: null, ceremony: 'haldi',    created_at: '2026-11-10T10:00:00+05:30' },
    { id: 'ms-06', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/bridal-makeup-01.jpg',     cloudinary_public_id: 'muse/bridal-makeup-01',     tags: ['makeup', 'bridal', 'glam'],     source_url: null, ceremony: 'wedding',  created_at: '2026-11-09T16:00:00+05:30' },
    { id: 'ms-07', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/reception-decor-01.jpg',   cloudinary_public_id: 'muse/reception-decor-01',   tags: ['reception', 'decor', 'floral'], source_url: null, ceremony: 'reception', created_at: '2026-11-08T14:00:00+05:30' },
    { id: 'ms-08', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/wedding-entry-01.jpg',     cloudinary_public_id: 'muse/wedding-entry-01',     tags: ['entry', 'doli', 'wedding'],     source_url: null, ceremony: 'wedding',  created_at: '2026-11-07T11:00:00+05:30' },
    { id: 'ms-09', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/mehndi-design-01.jpg',     cloudinary_public_id: 'muse/mehndi-design-01',     tags: ['mehndi', 'hands', 'intricate'], source_url: null, ceremony: 'mehendi',  created_at: '2026-11-06T19:00:00+05:30' },
    { id: 'ms-10', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/couple-portrait-01.jpg',   cloudinary_public_id: 'muse/couple-portrait-01',   tags: ['portrait', 'candid', 'golden'], source_url: null, ceremony: 'wedding',  created_at: '2026-11-05T17:00:00+05:30' },
    { id: 'ms-11', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/sangeet-decor-01.jpg',     cloudinary_public_id: 'muse/sangeet-decor-01',     tags: ['sangeet', 'lights', 'festive'], source_url: null, ceremony: 'sangeet',  created_at: '2026-11-04T13:00:00+05:30' },
    { id: 'ms-12', image_url: 'https://res.cloudinary.com/thedreamwedding/image/upload/v1/muse/kalire-01.jpg',            cloudinary_public_id: 'muse/kalire-01',            tags: ['kalire', 'jewellery', 'gold'],  source_url: null, ceremony: 'wedding',  created_at: '2026-11-03T10:00:00+05:30' },
  ],
};

// ─── /couple/circle ──────────────────────────────────────────────────────────
export const MOCK_COUPLE_CIRCLE: CoupleCircleResponse = {
  ok: true,
  members: [
    { id: 'cm-01', name: 'Ananya Sharma',  phone: '+919876500001', role: 'sister',      joined_at: '2026-10-01T10:00:00+05:30' },
    { id: 'cm-02', name: 'Mrs Sharma',     phone: '+919876500002', role: 'mother',      joined_at: '2026-10-01T10:05:00+05:30' },
    { id: 'cm-03', name: 'Riya Kapoor',    phone: '+919876500003', role: 'best friend', joined_at: '2026-10-05T14:00:00+05:30' },
    { id: 'cm-04', name: 'Rohan\'s Mom',   phone: '+919876500004', role: 'mother-in-law', joined_at: '2026-10-10T11:00:00+05:30' },
  ],
  activity: [
    { id: 'ca-01', member_name: 'Ananya Sharma',  action: 'saved a look to Muse',       content: 'Red lehenga for reception',     created_at: '2026-11-15T09:30:00+05:30' },
    { id: 'ca-02', member_name: 'Mrs Sharma',     action: 'commented on lehenga idea',  content: 'This is beautiful! Save this.', created_at: '2026-11-14T21:00:00+05:30' },
    { id: 'ca-03', member_name: 'Riya Kapoor',    action: 'joined the Circle',          content: null,                            created_at: '2026-10-05T14:00:00+05:30' },
  ],
};

// ─── /couple/events ──────────────────────────────────────────────────────────
export const MOCK_COUPLE_EVENTS: CoupleEventsResponse = {
  ok: true,
  events: [
    { id: 'ev-01', title: 'Mehndi',          kind: 'ceremony', event_date: '2026-11-17', event_time: '11:00:00', state: 'upcoming', notes: 'Home function. Full family.' },
    { id: 'ev-02', title: 'Wedding',          kind: 'ceremony', event_date: '2026-11-19', event_time: '19:00:00', state: 'upcoming', notes: 'ITC Maurya. Pheras at 10 PM.' },
    { id: 'ev-03', title: 'Lehenga fitting',  kind: 'fitting',  event_date: '2026-11-16', event_time: '14:00:00', state: 'upcoming', notes: 'Final fitting — bring heels.' },
    { id: 'ev-04', title: 'Makeup trial',     kind: 'trial',    event_date: '2026-11-13', event_time: '10:00:00', state: 'done',     notes: null },
    { id: 'ev-05', title: 'Sangeet',          kind: 'ceremony', event_date: '2026-11-18', event_time: '19:00:00', state: 'upcoming', notes: 'Rooftop venue.' },
    { id: 'ev-06', title: 'Haldi',            kind: 'ceremony', event_date: '2026-11-17', event_time: '08:00:00', state: 'upcoming', notes: 'Morning, home.' },
  ],
};

// ─── /couple/bookings ────────────────────────────────────────────────────────
export const MOCK_COUPLE_BOOKINGS: CoupleBookingsResponse = {
  ok: true,
  total_committed: 2800000,
  total_paid:      1350000,
  bookings: [
    { id: 'bk-01', vendor_name: 'Aanya Studio',     category: 'photography', amount_total: 450000,  amount_paid: 275000, state: 'confirmed', notes: 'Full day + candid',   booked_at: '2026-09-01T12:00:00+05:30' },
    { id: 'bk-02', vendor_name: 'Swati Roy MUA',     category: 'makeup',      amount_total: 180000,  amount_paid: 90000,  state: 'confirmed', notes: 'Bridal + family',    booked_at: '2026-09-15T10:00:00+05:30' },
    { id: 'bk-03', vendor_name: 'Bloom & Petals',    category: 'decor',       amount_total: 850000,  amount_paid: 425000, state: 'confirmed', notes: 'Mehendi + wedding',  booked_at: '2026-09-20T11:00:00+05:30' },
    { id: 'bk-04', vendor_name: 'Shivam Caterers',   category: 'catering',    amount_total: 900000,  amount_paid: 450000, state: 'confirmed', notes: '400 pax',            booked_at: '2026-10-01T09:00:00+05:30' },
    { id: 'bk-05', vendor_name: 'The Band Wale',     category: 'music',       amount_total: 250000,  amount_paid: 75000,  state: 'confirmed', notes: 'Sangeet + baraat',   booked_at: '2026-10-10T14:00:00+05:30' },
    { id: 'bk-06', vendor_name: 'Reel Makers',       category: 'videography', amount_total: 170000,  amount_paid: 35000,  state: 'pending',   notes: 'Cinematic reel',     booked_at: '2026-10-22T16:00:00+05:30' },
  ],
};

// ─── /couple/receipts ────────────────────────────────────────────────────────
export const MOCK_COUPLE_RECEIPTS: CoupleReceiptsResponse = {
  ok: true,
  total: 4,
  receipts: [
    { id: 'rc-01', label: 'Lehenga advance',    amount: 150000, image_url: null, vendor_name: 'Anita Dongre Studio', receipt_date: '2026-10-15', created_at: '2026-10-15T18:00:00+05:30' },
    { id: 'rc-02', label: 'Decor deposit',      amount: 425000, image_url: null, vendor_name: 'Bloom & Petals',      receipt_date: '2026-10-20', created_at: '2026-10-20T12:00:00+05:30' },
    { id: 'rc-03', label: 'Jewellery purchase', amount: 320000, image_url: null, vendor_name: 'GRT Jewellers',       receipt_date: '2026-11-01', created_at: '2026-11-01T15:00:00+05:30' },
    { id: 'rc-04', label: 'Catering advance',   amount: 450000, image_url: null, vendor_name: 'Shivam Caterers',     receipt_date: '2026-11-05', created_at: '2026-11-05T10:00:00+05:30' },
  ],
};

// ─── POST /couple/chat (smart mock replies) ──────────────────────────────────
export function MOCK_COUPLE_CHAT_REPLY(message: string): string {
  const m = message.toLowerCase();

  if (/today|schedule|what.*on|upcoming/.test(m))
    return `4 days to go, Priya! Today: lehenga fitting at 2 PM. Tomorrow: Mehndi at 11 AM at home. Haldi the morning after, then Sangeet in the evening, and the wedding on the 19th. You're all set.`;

  if (/muse|saved|look|inspo/.test(m))
    return `You have 47 saves across all ceremonies. Most are for the reception — 12 looks — and 9 for the wedding. Want me to pull up a specific ceremony?`;

  if (/book|vendor|who.*booked|confirmed/.test(m))
    return `6 vendors confirmed: Aanya Studio (photography), Swati Roy (makeup), Bloom & Petals (decor), Shivam Caterers, The Band Wale, and Reel Makers. Total committed: ₹28L. Paid so far: ₹13.5L.`;

  if (/budget|spend|money|paid|cost/.test(m))
    return `Total committed across all vendors: ₹28,00,000. You've paid ₹13,50,000 so far. Remaining: ₹14,50,000. Largest pending payment: Shivam Caterers (₹4,50,000 balance).`;

  if (/circle|ananya|riya|mom/.test(m))
    return `Your Circle has 4 members: Ananya (sister), your mom, Riya (best friend), and Rohan's mom. Ananya was active this morning — she saved a look to Muse.`;

  if (/days|how long|countdown|wedding date/.test(m))
    return `4 days to your wedding, Priya. The 19th of November at ITC Maurya. Pheras at 10 PM.`;

  return `I have everything — your timeline, vendors, muse board, Circle. What do you want to know?`;
}
