'use client';
import { useEffect, useState } from 'react';
import {
  API, CREAM, GOLD, MUTED, HAIRLINE, FROST_PANEL,
  FONT_DISPLAY, FONT_BODY, FONT_EYEBROW,
  useCircleSession, brideId, brideName, memberName, circleAuthHeaders, circleRefused } from './CircleSessionContext';
import { waNumberFor } from '../../lib/waNumbers';
import { ASSIGN_TRAY_HEAD } from '../../lib/circle/assignCopy';
import { daysUntilIst } from '@/lib/frost/tokens';   // R-35.23 · the one day-boundary home

// ── TDW_14 · D-4b ③ · THE MEMBER'S TRAY ──────────────────────────────────────
//
// IT LANDS ON THIS PAGE AND NOT ON A TAB OF ITS OWN, and the placement is
// DERIVED rather than chosen. `scripts/tdw07_f0772_circle.proof.mjs` §14.3 pins
// the tab bar at EXACTLY FOUR TABS as the rendered-control ruling of F-07.115's
// retirement; a fifth tab reddens it, and widening a sealed inventory to fit
// one's own feature is mechanically identical to silencing it.
//
// The same bench's §2.1 decided the file. `COPLANNER_CALLERS` there is a
// HAND-WRITTEN list of the six co-planner files whose lane calls must carry
// `circleAuthHeaders()` — so a NEW file under app/coplanner/ would carry the
// credential check nowhere and escape the census in silence. Landing the tray in
// a file already on that list keeps it inside the guard. (The fragility itself
// is F-13.12, minted at this sitting and shelved: a census by hand where a walk
// belongs. Used here as a constraint, not cured here.)
//
// Ⓕ NO EMPTY RENDER. When she holds nothing the section does not render at all —
// no heading over an empty box, no "Nothing yet." A tray that announces its own
// emptiness tells her she has been passed over. This is deliberately the
// OPPOSITE of POLL_EMPTY one surface over: a poll's empty state sits beside the
// affordance that fills it, and a member cannot assign herself anything.
//
// SHE READS HER OWN ITEMS AND WRITES ONLY STATE. The door is D-4a's Class B
// pair; her payload carries no vendor, no money, no lead BY CONSTRUCTION at the
// server's projection, never by a CSS opinion here. And she may mark done or
// un-done and may NOT cancel — cancelling is a decision about the wedding, not
// about the doing — which is why this screen sends only 'done' and 'upcoming'.
interface AssignedItem {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  kind: string;
  state: string;
  notes: string | null;
}

interface FeedEvent {
  id: string;
  event_type: string;
  payload?: { member_name?: string; subject?: string; vendor_name?: string } | null;
  created_at: string;
}

interface CoupleProfile {
  wedding_date?: string | null;
  bride_name?: string | null;
  groom_name?: string | null;
}

// ── R-35.23 · THE FOLD — one number across both planes (F-15.17) ─────────────
// A LOCAL `daysUntil` STOOD HERE and it carried the device-local basis the whole
// estate has now abandoned: it flattened both operands with `.setHours(0,0,0,0)`
// while the caller's `profile.wedding_date` arrived as a date-only string that
// ECMAScript had already parsed as UTC midnight. On an IST device it agreed with
// the bride's masthead by luck; west of Greenwich the target fell onto the
// previous local day and the two planes disagreed about the same wedding.
//
// THAT IS WHY THIS FOLDS RATHER THAN GETTING ITS OWN CURE. This is the CIRCLE
// MEMBER's surface. A mother and a bride reading different numbers off one
// wedding is the failure the ruling exists to prevent, and the fix is one home,
// not two correct copies. The semantic, the UTC-parse trap and the three
// simplifications that reinstate it are written out ONCE, at the import below.
//
// The null arm is PRESERVED, not widened: `daysUntilIst` returns null for an
// absent date exactly as the local copy did, and `days` is still `number | null`.
function timeAgo(d: string): string {
  const t = new Date(d).getTime();
  if (Number.isNaN(t)) return '';
  const diff = Math.floor((Date.now() - t) / 1000);
  if (diff < 60)     return 'Just now';
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ── F-07.115 · THE TIP'S NUMBER IS DERIVED, NEVER TYPED ─────────────────────
//
// The co-planner's Dream AI tab and page are RETIRED in this delivery. Circle
// members reach Mira on WhatsApp — they always could, and the founder ruled that
// is the intended shape. This tip is the whole of what replaces the surface, so
// the one thing it must never do is print a number that does not answer.
//
// THE DERIVATION, three homes that agree, all checked by command before a byte
// was written here:
//   1. db/migrations/0099_circle_invite_link_fix.sql:108 — the invite link the
//      member herself receives and taps to claim her seat:
//        wa_me_link := 'https://wa.me/917011788380?text=' || v_token
//      This is the strongest witness because it IS her own path in. Applied
//      2026-07-23, verified from pg_get_functiondef.
//   2. dream-os src/lib/waNumbers.js — BRIDE_WA_NUMBER, the canonical home.
//   3. lib/waNumbers.ts — this repo's declared drift TWIN of that home.
//
// AND THE RUNTIME PATH, so the tip is a claim about behaviour and not about a
// constant: her text lands on the BRIDE lane's Meta number
// (brideIndex.js /webhook/meta on BRIDE_PHONE_NUMBER_ID) → processBrideInbound
// → the phone match at brideInbound.js:166-170 → handleCircleMemberMessage →
// runCircleAgenticTurn at brideIndex.js:677. That last call is direct: the
// WhatsApp lane never touched the /dreamai HTTP doors this arc retires, which is
// why deleting them cannot break her.
//
// SO WE IMPORT `waNumberFor('bride')` RATHER THAN WRITE THE DIGITS. It reads
// NEXT_PUBLIC_TDW_WA_NUMBER_BRIDE first and falls back to the ruled constant, and
// the proof asserts that the DIGITS THIS SCREEN RENDERS equal what that function
// returns — so a config change reddens a cell instead of shipping a wrong number
// to a member. The staleness risk is the drift pair's own and is already declared
// in all three homes: change one, change the others; nothing will catch you.
//
// ── F-07.123 · WHAT THIS TIP MAY PROMISE, DERIVED FROM THE HANDLER ──────────
//
// THE FIRST CUT OF THIS TIP SAID: "she knows the wedding and can answer anything
// about it." It was wrong, it shipped, and the founder's own walk caught it the
// same hour — Mira answered his test member honestly: 「 I don't have access to
// the wedding date — that's between you 」. A tip that is the ONLY thing replacing
// a deleted surface sets the member's whole expectation of Mira, and the first
// thing she did with it produced a refusal.
//
// WHAT THE CIRCLE LANE ACTUALLY DOES, derived by command from the handler's own
// contract at `src/brideIndex.js:303-320`:
//   · media, or a Pinterest/Instagram link → `saveToMuse` with
//     `saved_by_role='circle_member'` — it lands on THE BRIDE'S BOARD
//   · text-only → a `circle_activity` comment on the bride's feed
//   · cap: five image/link saves per IST day
//   · `circleEngine`'s header: NO tools, no agentic capability beyond auto-save;
//     the model turn is a warm acknowledgment and nothing more
// Mira on this lane is a CONDUIT TO THE BRIDE'S BOARD, not a wedding-facts
// oracle. She holds no wedding data here by construction, so her refusal was the
// honest behaviour working and the copy was the defect.
//
// THE BYTES BELOW ARE THE CURE AND THEY ARE THE FOUNDER'S, vetoed 「 approved
// option B 」 with his own amendment 「 dont write the number 」. They promise the
// save and nothing else. ANY FUTURE EDIT TO THIS COPY RE-DERIVES THE HANDLER
// FIRST: this paragraph exists because a capability claim was written from the
// shape of the feature instead of from the code that implements it.
//
// ADJACENT, NAMED, NOT TAKEN: Mira never TELLS a member she can take ideas. That
// lives in `circleSystemPrompt.js`, a W-1 surface this delivery does not open.
// Until it is chartered, this screen is the only place she is told.

// F-07.122 — THE GAP, NAMED WHERE IT LIVES. Recognition keys on
// `circle_members.invitee_phone` (brideInbound.js:167) and that column is
// NULLABLE at the witness (docs/db/PUBLIC_SCHEMA.md:78). A member whose row
// carries no phone, or a phone not in E.164, will text this number and NOT be
// recognised. The tip ships UNCONDITIONAL by ruling because the fixture shows
// every active member carries one; F-07.122 is filed for the day one does not.
// If a gate is ever needed it is a DERIVED BOOLEAN on the session payload, never
// the phone value — CE-125's minimisation removed phone from that payload with
// zero readers, and re-adding it to power a convenience would reverse a privacy
// cure.

// ── THE NUMBER IS NO LONGER RENDERED, AND THAT MOVES THE RISK ───────────────
// Founder-ruled: the copy does not print the digits. `displayWaNumber`, which
// formatted them for the eye, is DELETED rather than left unused — a dead
// formatter is one screen change from being called again by somebody who assumes
// it was kept for a reason.
//
// THE CONSEQUENCE, NAMED. While the number was on screen a wrong one was
// VISIBLE: the founder's own thumb was the last guard. Now the number exists
// ONLY inside the `wa.me` href, where nothing human can see it — a member would
// tap, land in a chat with a stranger or a dead line, and never know why. So the
// cell that used to check the rendered digits (§14.10) is re-aimed at the HREF,
// and it is now the ONLY guard between a config change and a member texting the
// wrong number. That is a stricter obligation than before, not a looser one.

// The tray's date. A DATE-ONLY string ('YYYY-MM-DD') gets the midnight suffix
// before it is parsed: bare, some engines read it as UTC and a member east of
// Greenwich sees yesterday. `timeAgo` above takes full timestamps and is
// unaffected, which is why this is a second small formatter rather than a
// widening of that one.
function trayDate(d: string): string {
  const t = new Date(`${d}T00:00:00`);
  if (Number.isNaN(t.getTime())) return '';
  return t.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function eventLine(e: FeedEvent): string {
  const who   = e.payload?.member_name || 'Someone';
  const verb  = e.event_type.replace(/_/g, ' ');
  const what  = e.payload?.subject || e.payload?.vendor_name || '';
  return what ? `${who} ${verb} ${what}` : `${who} ${verb}`;
}

export default function CoplannerHome() {
  const session  = useCircleSession();
  const bride_id = brideId(session);
  const name     = memberName(session);

  const [profile, setProfile] = useState<CoupleProfile | null>(null);
  const [feed, setFeed]       = useState<FeedEvent[]>([]);
  const [mine, setMine]       = useState<AssignedItem[]>([]);
  const [marking, setMarking] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Ⓖ THE EXISTING STATE CONTROL. No new verb and no new byte: the item's own
  // state is the control, tapped to move between done and upcoming. A member who
  // finishes a thing can un-finish it; she cannot cancel it.
  const markState = async (id: string, state: 'done' | 'upcoming') => {
    if (marking) return;
    setMarking(id);
    try {
      const r = await fetch(`${API}/api/v2/frost/circle/assigned/${id}/state`, {
        method: 'PATCH',
        headers: circleAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ state }),
      });
      if (circleRefused(r)) return;
      const d = await r.json();
      // THE SERVER'S ROW WINS. It owns the three predicates that make this safe
      // — her couple, her seat, not deleted — so a 404 here means the item is
      // not hers and the screen must not pretend the tap landed.
      if (d?.success && d.data) setMine(prev => prev.map(m => (m.id === id ? d.data : m)));
    } catch { /* keep last known — a dropped packet is not a state change */ }
    finally { setMarking(null); }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [pr, fr, ar] = await Promise.all([
          fetch(`${API}/api/v2/couple/profile/${bride_id}`).then(r => r.json()).catch(() => null),
          // FORK B — one home. `circleRefused` returns true on a 401 (and has
          // already cleared the credential and fired the event); this screen
          // then falls through to its own empty state rather than rendering a
          // refusal as "no activity yet".
          fetch(`${API}/api/v2/frost/circle/feed/${bride_id}?limit=10`, { headers: circleAuthHeaders() })
            .then(r => (circleRefused(r) ? null : r.json())).catch(() => null),
          // FORK B, same shape. The bride reaches this door too and simply holds
          // nothing — she is not a circle_members row, so an empty list here is
          // correct and is not a refusal (D-4a's door says so in its own header).
          fetch(`${API}/api/v2/frost/circle/assigned/${bride_id}`, { headers: circleAuthHeaders() })
            .then(r => (circleRefused(r) ? null : r.json())).catch(() => null),
        ]);
        if (cancelled) return;
        if (pr?.success && pr.data) setProfile(pr.data as CoupleProfile);
        if (fr?.success) setFeed((fr.data || []) as FeedEvent[]);
        if (ar?.success) setMine((ar.data || []) as AssignedItem[]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [bride_id]);

  const days = daysUntilIst(profile?.wedding_date);

  return (
    <>
      <p style={{
        fontFamily: FONT_EYEBROW, fontWeight: 200, fontSize: 9,
        letterSpacing: '0.32em', textTransform: 'uppercase',
        color: GOLD, margin: '0 0 12px',
      }}>WELCOME{name ? `, ${name.toUpperCase()}` : ''}</p>

      <h1 style={{
        fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 300,
        fontSize: 36, lineHeight: 1.15, color: CREAM,
        margin: '0 0 6px',
      }}>{brideName(session)}&rsquo;s wedding</h1>

      <p style={{
        fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14,
        color: MUTED, margin: '0 0 32px',
      }}>
        {loading
          ? 'Loading…'
          : days != null
            ? `${days} day${days === 1 ? '' : 's'} to go`
            : 'Date to be announced'}
      </p>

      {/* ── F-07.115 · THE MIRA TIP ─────────────────────────────────────────
          FOUNDER-VETOED BYTES, frozen 「 all, mira 」 + 「 introduce Mira as
          (bride's name) PA 」. Four strings; the number inside the third is
          derived, see displayWaNumber above.

          PLACEMENT — ABOVE the activity panel, deliberately. Activity renders up
          to ten rows, so a tip beneath it sits below the fold on any busy
          wedding, and this tip is the only thing standing where a tab used to
          be. It is also not a feed item: "Mira is X's PA" is a standing fact
          about the wedding, and it belongs with the countdown rather than in the
          stream. ONE HOME — the settings screen is the obvious second site and
          is deliberately NOT taken; two homes for one sentence is the disease
          this estate keeps curing.

          PERSISTENT, not dismissible: a member who dismissed it would have no
          path back to the only address Mira answers on.

          CONTROL INVENTORY: this anchor was the FIRST interactive control this
          screen ever carried. AMENDED AT TDW_14 D-4b (CE-115's law: every
          control accounted KEPT, MOVED, REMOVED or ADDED) — the tray below adds
          the SECOND, one source site rendered once per item she holds. It writes
          state only, on a door scoped to her own seat. Everything else on this
          screen is still read-only. */}
      <section style={{ ...FROST_PANEL, padding: 20, marginBottom: 20 }}>
        <p style={{
          fontFamily: FONT_EYEBROW, fontWeight: 300, fontSize: 9,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: GOLD, margin: '0 0 10px',
        }}>MIRA</p>

        <p style={{
          fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 300,
          fontSize: 22, color: CREAM, margin: '0 0 8px',
        }}>Mira is {brideName(session)}&rsquo;s PA.</p>

        <p style={{
          fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
          color: MUTED, margin: '0 0 16px', lineHeight: 1.7,
        }}>
          Share ideas with {brideName(session)} through her. Message her on WhatsApp
          and it lands on {brideName(session)}&rsquo;s board.
        </p>

        <a
          href={`https://wa.me/${waNumberFor('bride')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', height: 44,
            background: 'transparent',
            border: `0.5px solid ${HAIRLINE}`,
            borderRadius: 100,
            textDecoration: 'none',
            fontFamily: FONT_EYEBROW, fontWeight: 300, fontSize: 10,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            color: CREAM,
          }}>Open WhatsApp</a>
      </section>

      {/* ── Ⓔ THE TRAY · Ⓕ NO EMPTY RENDER ────────────────────────────────
          The whole section is behind `mine.length > 0` — not a heading with an
          empty body, not a placeholder line. She sees this word only when the
          word is true.

          PLACEMENT: below the Mira tip, above Activity. The tip's own comment
          rules it ABOVE the activity panel and that stays true; her own items
          belong over the stream because they are the only thing on this screen
          she is being asked to do. */}
      {!loading && mine.length > 0 && (
        <section style={{ ...FROST_PANEL, padding: 20, marginBottom: 20 }}>
          <p style={{
            fontFamily: FONT_EYEBROW, fontWeight: 300, fontSize: 9,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: GOLD, margin: '0 0 14px',
          }}>{ASSIGN_TRAY_HEAD.toUpperCase()}</p>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {mine.map(m => (
              <li key={m.id} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '10px 0',
                borderBottom: `0.5px solid ${HAIRLINE}`,
              }}>
                <button
                  disabled={marking === m.id}
                  onClick={() => markState(m.id, m.state === 'done' ? 'upcoming' : 'done')}
                  style={{
                    width: 18, height: 18, marginTop: 2, flexShrink: 0,
                    borderRadius: '50%', padding: 0,
                    border: `1px solid ${m.state === 'done' ? GOLD : HAIRLINE}`,
                    background: m.state === 'done' ? GOLD : 'transparent',
                    cursor: marking === m.id ? 'default' : 'pointer',
                    opacity: marking === m.id ? 0.5 : 1,
                  }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
                    color: CREAM, margin: 0, lineHeight: 1.5,
                    textDecoration: m.state === 'done' ? 'line-through' : 'none',
                    opacity: m.state === 'done' ? 0.55 : 1,
                  }}>{m.title}</p>
                  <p style={{
                    fontFamily: FONT_BODY, fontWeight: 300, fontSize: 11,
                    color: MUTED, margin: '2px 0 0',
                  }}>{trayDate(m.event_date)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section style={{ ...FROST_PANEL, padding: 20, marginBottom: 20 }}>
        <p style={{
          fontFamily: FONT_EYEBROW, fontWeight: 300, fontSize: 9,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: MUTED, margin: '0 0 14px',
        }}>ACTIVITY</p>

        {loading && (
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: MUTED, margin: 0 }}>Loading…</p>
        )}

        {!loading && feed.length === 0 && (
          <p style={{
            fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
            color: MUTED, margin: 0, lineHeight: 1.6,
          }}>
            Quiet for now. When {brideName(session)} or someone in the Circle saves
            a vendor or posts a thought, it&rsquo;ll show up here.
          </p>
        )}

        {!loading && feed.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {feed.map(e => (
              <li key={e.id} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '10px 0',
                borderBottom: `0.5px solid ${HAIRLINE}`,
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: GOLD, flexShrink: 0, marginTop: 7,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
                    color: CREAM, margin: 0, lineHeight: 1.5,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{eventLine(e)}</p>
                  <p style={{
                    fontFamily: FONT_BODY, fontWeight: 300, fontSize: 11,
                    color: MUTED, margin: '2px 0 0',
                  }}>{timeAgo(e.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
