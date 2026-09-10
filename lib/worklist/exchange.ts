// lib/worklist/exchange.ts
// CE-42 · SEAT R7 · 4c-3a — G5.3 THE INFLUENCER EXCHANGE, THE SHELL (R-42.14).
//
// EVERY STRING HERE WAS VETOED. `docs/mocks/exchange-mock.html`, frames X1–X7, vetoed
// by the chair 2026-09-10 with ONE byte changed: "her audience" → "their audience" (the
// estate's them/their rule — an influencer's gender is not ours to assume). One home;
// the screen, the row and the sheet read them. Words the estate already owns are read
// from where they live (COPY.launchingSoon, CHIPS.coming, the eleven's labels, `City`).
//
// NO MONEY WORD, NO MONEY FIELD, EVER — master §7: TDW never brokers payment between
// a vendor and an influencer. b76 asserts the absence.
export const EXCHANGE = {
  rowLabel:   'Influencer exchange',            // the row under Shoots AND the screen title — one string
  banner:     'Requests open once Instagram approves our access. You can look around.',
  filterCity: 'City',
  filterCraft:'Craft',
  headList:   'Influencers',
  headMine:   'Your requests',
  badgeOn:    'Verified via Instagram',
  badgeOff:   'Pending',
  back:       '\u2039 Influencers',
  audience:   'Audience',
  byCity:     'By city',
  byAge:      'By age',
  byGender:   'By gender',
  engagement: 'Engagement',
  posts:      'Recent posts',
  sendReq:    'Send request',
  to:         'To',
  offer:      'What you offer',
  ask:        'What you ask for',
  askKinds:   ['Post', 'Reel', 'Story'] as const,
  from:       'From',
  until:      'To',
  send:       'Send',
  withdraw:   'Withdraw',
  complete:   'Mark completed',
  states:     { sent: 'Sent', accepted: 'Accepted', declined: 'Declined', completed: 'Completed' } as const,
  emptyList:  'No influencers on The Dream Wedding yet.',
  emptyMine:  'No requests yet.',
  followers:  'followers',
} as const;

export type RequestState = keyof typeof EXCHANGE.states;

/** "{n}% of their audience is in {city}" — the audience-fit line (S2(b)). */
export function fitLine(pct: number, city: string): string {
  return `${pct}% of their audience is in ${city}`;
}

/** "{craft} for {n} {kind}s" — plural rule: 1 post / 2 reels. */
export function requestLine(craftLabel: string, count: number, kind: string): string {
  const k = kind.toLowerCase();
  return `${craftLabel} for ${count} ${count === 1 ? k : k + 's'}`;
}

/** "{handle} · {city} · {n} followers" — the card's sub-line; the count is a FACT, never a sort key. */
export function subLine(handle: string, city: string, followers: number): string {
  return `${handle} \u00B7 ${city} \u00B7 ${followers.toLocaleString('en-IN')} ${EXCHANGE.followers}`;
}
