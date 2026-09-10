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
// ═══ EXCHANGE_PREVIEW — ONE FLAG, ONE HOME, ONE BRANCH (SUNDAY_PREVIEW's idiom,
// lib/worklist/sunday.ts:8) ══════════════════════════════════════════════════
// While true: every row on this room comes from lib/mocks/exchange.ts, NO door is
// called, and every act toasts COPY.launchingSoon. 4c-3b-1s flips it to false in a
// one-line rider once the doors exist; that flip is the whole of the wiring, and
// b76 pins that this is the only branch. The client in lib/vendor/api/exchange.ts
// is compiled either way — a call shape that only type-checks on the day it is
// first used is a shape nobody has read.
//
// ⚠ FLIPPED FALSE at 4c-3b-1p-r (the rider), 2026-09-10. dream-os 50781af answered the
// contract: the ten doors exist, `b78` 22/22 with 21 both-ways mutations, and the shapes
// were compared field by field before this line moved. THE CONSTANT STAYS rather than
// being deleted with its branches — the fixture path is the way back if a door misbehaves
// on the walk, and one line is a cheaper revert than a re-cut. `b76` C2 pins that the
// branches are still there and that nothing is called outside them.
export const EXCHANGE_PREVIEW = false;

// Preview-only: `/vendor/exchange?as=creator` draws the inbox from the fixture so
// the creator's glass can be walked before a second test vendor exists. INERT when
// the flag is false — the door decides the role and this param is never read (b76 C9).
export const PREVIEW_ROLE_PARAM = 'as';

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
  // ⚠ NOT DRAWN THIS PACKET (F-42.208). The tiles are dropped from the reach card —
  // R6's /posts/cards renders HER cards from HER wedding pages, and a creator's recent
  // Instagram posts are a different read that does not exist. The byte is VETOED and
  // kept here for 4c-3b-2, which lands it beside the demographics reader.
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
  // `withdrawn` — VETOED 2026-09-10 (sheet №6). It was authored unvetoed and held off
  // glass by the flag until the founder ruled; the flag could not flip before it did.
  states:     { sent: 'Sent', accepted: 'Accepted', declined: 'Declined', withdrawn: 'Withdrawn', completed: 'Completed' } as const,
  headInbox:  'Requests to you',                // VETOED 2026-09-10 (sheet 1)
  accept:     'Accept',                         // VETOED (sheet 2)
  decline:    'Decline',                        // VETOED (sheet 3)
  optInLabel: 'Open to requests from vendors',  // VETOED (sheet 4) — the settings row
  optInLine:  'Vendors on The Dream Wedding can see your audience and send you a request.',  // VETOED (sheet 5)
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
