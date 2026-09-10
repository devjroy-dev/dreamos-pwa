// lib/mocks/exchange.ts
// CE-42 · 4c-3a — FIXTURE ROWS for the exchange SHELL. No door reads these (b76 C2
// asserts it); 4c-3b replaces them with the real plane. Every person is INVENTED and
// every handle carries the `.tdw` suffix so none can be a live Instagram account —
// the two-word forms were web-checked 2026-09-10 and `@aanya.m` WAS live, so the
// suffix is the rename the chair ordered, applied to all three.
// An influencer here is a vendor of category `content_creator` (ruling comment on
// F-42.177, (ii)); `craft` is that token.
export interface ExchangeInfluencer {
  id: string; name: string; handle: string; city: string; craft: 'content_creator';
  followers: number; verified: boolean; engagement_pct: number;
  audience: { cities: { city: string; pct: number }[]; age: { band: string; pct: number }[]; gender: { k: string; pct: number }[] };
  posts: { id: string; kind: 'Post' | 'Reel' }[];
}
export interface ExchangeRequest {
  id: string; influencer_id: string; offer: { craft: string; note: string };
  ask: { kind: 'Post' | 'Reel' | 'Story'; count: number }; dates: { from: string; to: string };
  state: 'sent' | 'accepted' | 'declined' | 'completed';
}
export const EXCHANGE_INFLUENCERS: readonly ExchangeInfluencer[] = [
  { id: 'inf-1', name: 'Aanya Mehra', handle: '@aanya.mehra.tdw', city: 'Delhi NCR', craft: 'content_creator', followers: 24600, verified: true, engagement_pct: 4.1,
    audience: { cities: [{ city: 'Delhi NCR', pct: 62 }, { city: 'Chandigarh', pct: 11 }, { city: 'Jaipur', pct: 8 }], age: [{ band: '18\u201324', pct: 31 }, { band: '25\u201334', pct: 49 }, { band: '35\u201344', pct: 14 }], gender: [{ k: 'Women', pct: 84 }, { k: 'Men', pct: 16 }] },
    posts: [{ id: 'p1', kind: 'Reel' }, { id: 'p2', kind: 'Post' }, { id: 'p3', kind: 'Post' }] },
  { id: 'inf-2', name: 'Ritika Sen', handle: '@ritika.frames.tdw', city: 'Delhi NCR', craft: 'content_creator', followers: 11200, verified: false, engagement_pct: 5.3,
    audience: { cities: [{ city: 'Delhi NCR', pct: 48 }, { city: 'Lucknow', pct: 17 }, { city: 'Mumbai', pct: 9 }], age: [{ band: '18\u201324', pct: 44 }, { band: '25\u201334', pct: 41 }, { band: '35\u201344', pct: 9 }], gender: [{ k: 'Women', pct: 71 }, { k: 'Men', pct: 29 }] },
    posts: [{ id: 'p4', kind: 'Post' }, { id: 'p5', kind: 'Reel' }, { id: 'p6', kind: 'Reel' }] },
  { id: 'inf-3', name: 'Meher Joshi', handle: '@meher.joshi.tdw', city: 'Jaipur', craft: 'content_creator', followers: 38900, verified: true, engagement_pct: 3.2,
    audience: { cities: [{ city: 'Jaipur', pct: 46 }, { city: 'Delhi NCR', pct: 21 }, { city: 'Udaipur', pct: 12 }], age: [{ band: '18\u201324', pct: 27 }, { band: '25\u201334', pct: 52 }, { band: '35\u201344', pct: 15 }], gender: [{ k: 'Women', pct: 88 }, { k: 'Men', pct: 12 }] },
    posts: [{ id: 'p7', kind: 'Reel' }, { id: 'p8', kind: 'Post' }, { id: 'p9', kind: 'Post' }] },
];
export const EXCHANGE_REQUESTS: readonly ExchangeRequest[] = [
  { id: 'req-1', influencer_id: 'inf-1', offer: { craft: 'makeup',      note: 'Bridal look for one styled shoot, trial included.' }, ask: { kind: 'Reel',  count: 2 }, dates: { from: '2026-10-18', to: '2026-11-18' }, state: 'sent' },
  { id: 'req-2', influencer_id: 'inf-2', offer: { craft: 'hairstylist', note: '' }, ask: { kind: 'Post',  count: 1 }, dates: { from: '2026-11-02', to: '2026-11-30' }, state: 'accepted' },
  { id: 'req-3', influencer_id: 'inf-3', offer: { craft: 'designer',    note: '' }, ask: { kind: 'Story', count: 3 }, dates: { from: '2026-09-04', to: '2026-09-20' }, state: 'declined' },
  { id: 'req-4', influencer_id: 'inf-1', offer: { craft: 'photography', note: '' }, ask: { kind: 'Reel',  count: 1 }, dates: { from: '2026-08-12', to: '2026-08-30' }, state: 'completed' },
];
