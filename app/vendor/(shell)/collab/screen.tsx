'use client';
// app/vendor/collab/screen.tsx — THE COLLAB BODY, ONE MODULE, TWO TREES.
//
// ── M-FINISH S2 · §4-4 BATCH ③ · THE LAST CROSSING ────────────────────────
// Split out of `app/vendor/collab/page.tsx` so `/vendor/collab` and the surviving
// `/vendor/collab` fallback render the SAME module rather than two copies of one screen
// (R-38.12). Logic, API calls, validation and every sheet are untouched; what moved is the
// route wrapper and the chrome that belonged to it.
//
// ── `<Header/>` LEFT WITH THE ROUTE, AND `vendorName` LEFT WITH IT ─────────
// The masthead was mounted here and took `vendorName` for no other purpose. Both are gone
// from this module: the fallback route owns and imports the old chrome, the shell route
// mounts none, and a conditional would not have emptied the shell's chunk of it — S2 paid
// to learn that.
//
// ── THE PAGE HEADER ROW STAYS; ITS LABEL STACK DOES NOT ───────────────────
// TDS's §4-4 precedent, and for the same reason: an ACTION rides on this row (「+ Post」), so
// the row survives in both trees and a spacer takes over the label's `flex: 1` so the
// control does not move under the thumb. The eyebrow and the display title are a SECOND
// NAME for the room — the shell already prints 「Collab」 above them — so they retire in the
// shell and stay on the fallback, where nothing else names this surface. Team's
// `SectionLabel` shape, one room over.

// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock’s screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
// /wedding/collab — Vendor-to-vendor requirement board · Atelier rebuild
// Logic, API calls, validation untouched. Only visual chrome rewritten:
// squared corners, brass borders, Italiana titles, Cormorant italic
// detail lines, atelier-fab buttons, atelier sheet for the post form.

import { useEffect, useState } from 'react';
import { INK_DEEP } from '@/lib/vendor/theme';
import { useRouter, useSearchParams } from 'next/navigation';
import { getJson, postJson, patchJson } from '@/lib/vendor/api/_base';
import { fetchRoster, addRosterEntry, bridgeRosterEntry, RosterEntry } from '@/lib/vendor/api/roster';
import { mintCrewIdentity, MINT_ACTION_LABEL, MINT_DONE_LABEL } from '@/lib/vendor/rosterMint';
import { canViewResponses, cardIsTappable } from '@/lib/vendor/postAccess';
// D2 — the option list, its alias map and the match ladder have ONE home.
import { matchCity } from '@/lib/vendor/cityMatch';
// CE-42 4c-1: the post's words moved to one home the shoot board also reads, and the
// composer moved to one exported form (kind prop). F-42.184: the requirement list is
// the server's eleven, read off GET /requirement-types, labelled by the founder-signed map.
import { fmtDate, fmtBudget, fmtType, postedBy } from '@/lib/vendor/collabFormat';
import { CollabPostForm } from '@/components/vendor/CollabPostForm';
import { labelFor } from '@/lib/frost/categoryLabels';
import { API } from '@/lib/solutions/routes';

const A = {
  // R-37.74 arm (iii): the interactive half of the old `brass`. Buttons, chips, carets
  // and active states read this; the wordmark, section headers and hairlines keep `brass`.
  interactive:     'var(--atelier-accent-text)',
  interactiveWarm: 'var(--atelier-accent-text)',
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  green:     'var(--role-positive)',
  red:       'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-dm-sans), system-ui, sans-serif' /* R-37.76 (3)+(7): Cormorant is RETIRED FROM PROSE. The rooms were setting body copy in Cormorant italic while the shell set it in DM Sans, and that — not size — is why they read as two font worlds. One family, one job. Cormorant's feature use survives where a surface deliberately calls for it. */,
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// TDW_04.5 P4 — a post is now a list of requirements. `items` ALWAYS arrives
// (a legacy post wraps to exactly one), so this client needs no legacy branch;
// `requirement_type` stays only as the back-compat mirror of items[0].
interface CollabItem {
  id:                    string | null;
  position:              number;
  requirement_type:      string;
  note:                  string | null;
  filled_by_response_id: string | null;
  wrapped:               boolean;
}

interface CollabPost {
  id:               string;
  requirement_type: string;
  items?:           CollabItem[];
  first_look_until?: string | null;
  event_date:       string;
  city:             string;
  budget_inr?:      number;
  payment_period?:  string;
  event_type?:      string;
  details?:         string;
  poster_category?: string;
  posted_ago?:      string;
  state?:           string;
  interested_count?: number;
  accepted_count?:   number;
  total_responses?:  number;
}

// fmtDate · fmtBudget · timeAgo · fmtType and the type lists MOVED to lib/vendor/collabFormat.ts
// (CE-42 4c-1) — one home, read by this room and the shoot board. fmtDate is now the
// full month with the year (R-42.13): the en-IN short form rendered `18 Sept 2026`.
// ── F-38.62 · THE TAB ORDER IS THE FOUNDER'S, AND IT IS NOT THIS TYPE'S ───
// Founder walk, 2026-08-29: 「my post should be first, opportunities be second — which means
// collab should open on my posts」. The union's spelling order is not a render order and never
// was; `TAB_ORDER` below is the one that reaches the screen, so a reader cannot mistake this
// declaration for the ruling.
type Tab = 'opportunities' | 'my_posts' | 'roster';

// THE RULED ORDER, ONE HOME. A control that moves under the thumb is a control that cannot be
// learned — R-37.22's reasoning, which is why the room grid is frozen and why this is a named
// constant rather than an array literal inside the render. `b40` C40 asserts it.
const TAB_ORDER: readonly Tab[] = ['my_posts', 'opportunities', 'roster'] as const;
// The landing tab, derived from the order rather than restated beside it: the vendor lands
// where the founder put the first pill, and a reorder cannot leave the two disagreeing.
const TAB_DEFAULT: Tab = TAB_ORDER[0];


// F10(b)'s prefill arrives in the URL, not in storage — browser storage is
// forbidden here and the gap pip lives on a different screen entirely. Query
// params also mean the composer opens prefilled on a hard refresh.
interface Prefill { open: boolean; date: string; city: string; type: string; }
function readPrefill(sp: URLSearchParams | null): Prefill {
  return {
    open: sp?.get('post') === '1',
    date: sp?.get('date') || '',
    city: matchCity(sp?.get('city') || ''),
    type: sp?.get('type') || '',
  };
}

export function CollabScreen({ vendorId, tier }: { vendorId: string; tier: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefill = readPrefill(searchParams);

  const [tab,      setTab]      = useState<Tab>(TAB_DEFAULT);
  const [feed,     setFeed]     = useState<CollabPost[]>([]);
  const [myPosts,  setMyPosts]  = useState<CollabPost[]>([]);
  const [roster,   setRoster]   = useState<RosterEntry[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(prefill.open);

  useEffect(() => {
    Promise.all([fetchFeed(), fetchMyPosts(), loadRoster()]).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadRoster() {
    try {
      const data = await fetchRoster();
      if (data.ok) setRoster(data.roster);
    } catch { /* silent — the tab renders its own empty state */ }
  }

  async function fetchFeed() {
    try {
      const data = await getJson<{ ok: boolean; feed: CollabPost[] }>('/api/v2/vendor/collab/feed');
      if (data.ok) setFeed(data.feed);
    } catch { /* silent */ }
  }
  async function fetchMyPosts() {
    try {
      const data = await getJson<{ ok: boolean; posts: CollabPost[] }>('/api/v2/vendor/collab/my-posts');
      if (data.ok) setMyPosts(data.posts);
    } catch { /* silent */ }
  }
  async function respond(postId: string, action: 'interested' | 'passed') {
    try {
      await postJson(`/api/v2/vendor/collab/${postId}/respond`, { action });
      setFeed(prev => prev.filter(p => p.id !== postId));
    } catch { /* silent */ }
  }
  async function markFilled(postId: string) {
    try {
      await patchJson(`/api/v2/vendor/collab/${postId}`, { state: 'filled' });
      fetchMyPosts();
    } catch { /* silent */ }
  }

  // ── THE SUB-ROUTE IS INTERIOR MOVEMENT, SO THE PUSH IS TREE-AWARE ────────
  // `SliceDoor`'s ruled shape (CE-38 relay, S2 ZIP bounce), and this is the case the rule
  // was written for: the responses thread is THIS ROOM'S OWN INTERIOR, not a different
  // room, so a vendor deep-linked into the old tree stays there and a vendor inside the
  // shell never leaves it. A literal here would have been F-38.1 surviving inside one
  // room's walls — a second layout, a second Splash and a second session resolve, one tap
  // from a crossed surface.
  //
  // IT DOES NOT ASK `roomHref`, and that is the same asymmetry the registry states at its
  // own site: the address book answers for ROOMS and returns the rooms directory on a miss.
  // A sub-route is not a room, so a literal pair is the honest answer here and the Door's
  // shape is the one to copy.
  const openResponses = (id: string) =>
    router.push(('/vendor/collab/') + id + '/responses');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* ── THE PAGE HEADER ROW · TDS's §4-4 PRECEDENT, TREE-AWARE ───────────────
          THE ROW STAYS IN BOTH TREES because 「+ Post」 rides on it, and a spacer takes over
          the label stack's `flex: 1` so the control does not move under the thumb.
          THE LABEL STACK IS A SECOND NAME FOR THE ROOM. The shell prints 「Collab」 in its
          own masthead directly above this; 「Discover · Collab」 and 「Your industry, your
          people.」 stacked beneath it is one room named twice, which is Team's `SectionLabel`
          finding one room over. It stays on the fallback, where nothing else names this
          surface at all. */}
      <div style={{ padding: '10px 22px 10px'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
          {<div style={{ flex: 1 }} />}
          <button type="button" onClick={() => setShowForm(true)} className="atelier-fab" style={{
            padding: '8px 14px', borderRadius: 2, cursor: 'pointer',
            border: '0.5px solid var(--atelier-label)',
            fontFamily: F.label, fontWeight: 400, fontSize: 9, color: INK_DEEP,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            flexShrink: 0, marginTop: 8,
          }}>+ Post</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 22px', marginBottom: 4 }}>
        {TAB_ORDER.map(t => (
          <button key={t} type="button" onClick={() => setTab(t)} style={{
            flex: 1, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: F.label, fontWeight: tab === t ? 400 : 300, fontSize: 9,
            color: tab === t ? A.interactiveWarm : A.inkMute,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            borderBottom: tab === t ? `0.5px solid ${A.interactive}` : '0.5px solid var(--atelier-card-border)',
            transition: `all 200ms ${EASE}`,
          }}>{t === 'opportunities' ? 'Opportunities' : t === 'my_posts' ? 'My Posts' : 'Roster'}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '18px 22px 100px' }}>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Loading…</div>
        ) : tab === 'opportunities' ? (
          <OpportunitiesTab feed={feed} onRespond={respond} />
        ) : tab === 'my_posts' ? (
          <MyPostsTab
            posts={myPosts}
            onMarkFilled={markFilled}
            onViewResponses={openResponses}
          />
        ) : (
          <RosterTab roster={roster} onAdded={loadRoster} />
        )}
      </div>

      {showForm && (
        <CollabPostForm
          kind="collab"
          prefill={{ date: prefill.date, city: prefill.city, type: prefill.type }}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchMyPosts(); setTab('my_posts'); }}
        />
      )}
    </div>
  );
}

// ── Opportunities ───────────────────────────────────────────────
function OpportunitiesTab({ feed, onRespond }: {
  feed: CollabPost[];
  onRespond: (id: string, action: 'interested' | 'passed') => void;
}) {
  if (feed.length === 0) {
    return (
      <div style={{ padding: '60px 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: F.display, fontSize: 25, lineHeight: 1.5, color: 'var(--atelier-accent-text)', marginBottom: 16 }}>✦</div>
        <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 25, color: 'var(--atelier-ink)', lineHeight: 1.2, marginBottom: 8 }}>Quiet for now.</div>
        <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.inkMute, lineHeight: 1.55 }}>
          No collab opportunities in your area today.<br />
          Post your own to put it out there.
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {feed.map(post => <OpportunityCard key={post.id} post={post} onRespond={onRespond} />)}
    </div>
  );
}

// A post ALWAYS has items — the server wraps legacy posts to one. This helper
// exists only so a stale cached response can't crash the card.
function itemsOf(post: CollabPost): CollabItem[] {
  return post.items && post.items.length > 0
    ? post.items
    : [{ id: null, position: 0, requirement_type: post.requirement_type, note: null, filled_by_response_id: null, wrapped: true }];
}

function inFirstLook(post: CollabPost): boolean {
  return !!post.first_look_until && new Date(post.first_look_until).getTime() > Date.now();
}

function OpportunityCard({ post, onRespond }: {
  post: CollabPost;
  onRespond: (id: string, action: 'interested' | 'passed') => void;
}) {
  const [responded, setResponded] = useState(false);
  const [working,   setWorking]   = useState(false);

  async function handle(action: 'interested' | 'passed') {
    if (working) return;
    setWorking(true);
    if (action === 'interested') setResponded(true);
    await onRespond(post.id, action);
    setWorking(false);
  }

  if (responded) {
    return (
      <div className="atelier-card" style={{ padding: '16px 18px', opacity: 0.6 }}>
        <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.inkSoft, lineHeight: 1.5 }}>
          You&rsquo;ve expressed interest. We&rsquo;ll let you know if they connect.
        </div>
      </div>
    );
  }

  return (
    <div className="atelier-card" style={{ padding: '18px 20px' }}>
      <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, marginBottom: 6 }}>
        Requirement
      </div>
      <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 25, color: 'var(--atelier-ink)', lineHeight: 1.15, marginBottom: 6 }}>
        {fmtType(itemsOf(post)[0]?.requirement_type ?? post.requirement_type)} needed
      </div>
      {itemsOf(post).length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {itemsOf(post).slice(1).map((it, n) => (
            <span key={it.id ?? n} style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.brassWarm,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              border: '0.5px solid var(--atelier-card-border)', borderRadius: 2, padding: '3px 8px',
            }}>{it.requirement_type.replace(/_/g, ' ')}</span>
          ))}
        </div>
      )}
      <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.inkSoft, marginBottom: 12, lineHeight: 1.4 }}>
        {post.city} · {fmtDate(post.event_date)} · {fmtBudget(post.budget_inr, post.payment_period)}
      </div>

      {post.details && (
        <div style={{ fontFamily: F.script, fontWeight: 400, fontSize: 16, color: A.ink, lineHeight: 1.6, marginBottom: 14, letterSpacing: '0.005em' }}>
          {post.details}
        </div>
      )}

      <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginBottom: 16 }}>
        {postedBy(post.poster_category, post.posted_ago ?? '')}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => handle('interested')} disabled={working}
          className="atelier-fab" style={{
            flex: 2, padding: '11px 0', borderRadius: 2,
            border: '0.5px solid var(--atelier-label)', cursor: working ? 'default' : 'pointer',
            fontFamily: F.label, fontWeight: 400, fontSize: 10, color: INK_DEEP,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            opacity: working ? 0.6 : 1,
          }}>Interested</button>
        <button type="button" onClick={() => handle('passed')} disabled={working} style={{
          flex: 1, padding: '11px 0', background: 'transparent',
          border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2,
          cursor: working ? 'default' : 'pointer',
          fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.interactiveWarm,
          letterSpacing: '0.32em', textTransform: 'uppercase',
        }}>Pass</button>
      </div>
    </div>
  );
}

// ── My Posts ────────────────────────────────────────────────────
function MyPostsTab({ posts, onMarkFilled, onViewResponses }: {
  posts: CollabPost[];
  onMarkFilled: (id: string) => void;
  onViewResponses: (id: string) => void;
}) {
  if (posts.length === 0) {
    return (
      <div style={{ padding: '60px 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 25, color: 'var(--atelier-ink)', lineHeight: 1.2, marginBottom: 8 }}>
          Nothing posted yet.
        </div>
        <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.inkMute, lineHeight: 1.55 }}>
          Tap <span style={{ color: A.brassWarm }}>+ Post</span> to find your second shooter,<br />
          hair stylist, or any collaborator.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {posts.map(post => {
        const open = post.state === 'open';
        const stateColor = open ? A.brassWarm : A.inkMute;
        // F-04.118(a): the card is its own way in. The button below can be
        // absent for good reasons (a post nobody answered), but a card that
        // HAS connections and offers no way to reach them is the app hiding
        // the vendor's own people from him.
        const tappable = cardIsTappable(post);
        return (
          <div key={post.id} className="atelier-card"
            onClick={tappable ? () => onViewResponses(post.id) : undefined}
            style={{ padding: '18px 20px', opacity: open ? 1 : 0.55, cursor: tappable ? 'pointer' : 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 4 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, marginBottom: 6 }}>
                  My Post
                </div>
                <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>
                  {fmtType(itemsOf(post)[0]?.requirement_type ?? post.requirement_type)} needed
                </div>
              </div>
              <span style={{
                fontFamily: F.label, fontWeight: 400, fontSize: 8, color: stateColor,
                letterSpacing: '0.32em', textTransform: 'uppercase',
                border: `0.5px solid ${stateColor}`, borderRadius: 2, padding: '4px 9px',
                flexShrink: 0,
              }}>{post.state?.toUpperCase()}</span>
            </div>

            <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkSoft, marginBottom: 12 }}>
              {post.city} · {fmtDate(post.event_date)} · {fmtBudget(post.budget_inr, post.payment_period)}
            </div>

            {/* Every requirement, and which of them are already spoken for. The
                filled state comes from the item's own filled_by_response_id —
                the same field the server's auto-close reads, so the screen and
                the state machine can never disagree. */}
            {itemsOf(post).length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {itemsOf(post).map((it, n) => {
                  const done = !!it.filled_by_response_id;
                  return (
                    <span key={it.id ?? n} style={{
                      fontFamily: F.label, fontWeight: 300, fontSize: 8,
                      color: done ? A.inkMute : A.brassWarm,
                      letterSpacing: '0.28em', textTransform: 'uppercase',
                      border: `0.5px solid ${done ? 'var(--atelier-sheet-border)' : 'var(--atelier-card-border)'}`,
                      borderRadius: 2, padding: '3px 8px',
                      textDecoration: done ? 'line-through' : 'none',
                    }}>{it.requirement_type.replace(/_/g, ' ')}</span>
                  );
                })}
              </div>
            )}

            {/* First look, and the auto-close. Both describe state the server
                owns; neither is computed twice. */}
            {open && inFirstLook(post) && (
              <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginBottom: 12 }}>
                Your roster sees this first. Open to everyone in 12 hours.
              </div>
            )}
            {open && !inFirstLook(post) && post.first_look_until && (
              <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginBottom: 12 }}>
                Open to everyone.
              </div>
            )}
            {/* D3 — each line tells only its own truth. "All filled" is the
                AUTO-CLOSE's sentence: it means every requirement found someone.
                A poster who taps Mark Filled closes the post without any item
                being filled, and borrowing the auto-close's words for that made
                the screen say something untrue. Derived client-side from data
                my-posts already sends — no new field, no second source. */}
            {post.state === 'filled' && (
              <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkSoft, marginBottom: 12 }}>
                {itemsOf(post).every(i => !!i.filled_by_response_id)
                  ? 'All filled. This post is closed.'
                  : 'This post is closed.'}
              </div>
            )}

            {(post.interested_count ?? 0) > 0 && (
              <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: A.brassWarm, marginBottom: 12 }}>
                {post.interested_count} interested
              </div>
            )}

            {/* F-04.118(a): the ACTION ROW's own gate stays on `open` — you do
                not mark a closed post filled again. But VIEW RESPONSES is not
                an action on the post, it is a look at the people, so it moved
                OUT of that gate and now keys on `canViewResponses` alone. */}
            {canViewResponses(post) && (
              <div style={{ display: 'flex', gap: 8, marginBottom: open ? 8 : 0 }}>
                <button type="button"
                  onClick={e => { e.stopPropagation(); onViewResponses(post.id); }}
                  style={{
                    flex: 1, padding: '10px 0',
                    background: 'transparent',
                    border: '0.5px solid var(--atelier-input-border)', borderRadius: 2, cursor: 'pointer',
                    fontFamily: F.label, fontWeight: 400, fontSize: 10, color: A.interactiveWarm,
                    letterSpacing: '0.32em', textTransform: 'uppercase',
                  }}>View Responses</button>
              </div>
            )}
            {open && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button"
                  onClick={e => { e.stopPropagation(); onMarkFilled(post.id); }}
                  style={{
                  flex: 1, padding: '10px 0',
                  background: 'transparent',
                  border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.inkSoft,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Mark Filled</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ── Roster ──────────────────────────────────────────────────────────────────
// TDW_04.5 P4 spec §P4.2. Two ways in: edges arrive on their own every time a
// collab connection is accepted, and a vendor can add someone by hand. The
// empty state says both, because a vendor who has never connected would
// otherwise think the tab was broken.
function RosterTab({ roster, onAdded }: { roster: RosterEntry[]; onAdded: () => void }) {
  const [adding, setAdding] = useState(false);
  // Per-row outcome. The logic lives in lib/vendor/rosterMint (framework-agnostic,
  // proof-driven); this is its UI shell — the crewCommit precedent.
  const [minting, setMinting] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<{ id: string; msg: string; kind: 'success' | 'error' } | null>(null);

  async function addToCrew(rosterId: string) {
    if (minting) return;
    setMinting(rosterId); setOutcome(null);
    await mintCrewIdentity(rosterId, {
      bridge:    bridgeRosterEntry,
      onResult:  (msg, kind) => setOutcome({ id: rosterId, msg, kind }),
      onRefresh: onAdded,
    });
    setMinting(null);
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button type="button" onClick={() => setAdding(true)} style={{
          padding: '8px 14px', background: 'transparent', borderRadius: 2,
          border: '0.5px solid var(--atelier-sheet-border)', cursor: 'pointer',
          fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.interactiveWarm,
          letterSpacing: '0.32em', textTransform: 'uppercase',
        }}>Add someone</button>
      </div>

      {roster.length === 0 ? (
        <div style={{ padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 25, color: 'var(--atelier-ink)', lineHeight: 1.2, marginBottom: 8 }}>
            No one on your roster yet.
          </div>
          <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.inkMute, lineHeight: 1.55 }}>
            Vendors you connect with here are added automatically.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {roster.map(r => (
            <div key={r.id} className="atelier-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, color: A.ink, lineHeight: 1.2 }}>{r.name}</div>
                <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 2 }}>
                  {[r.category ? fmtType(r.category) : null, r.phone].filter(Boolean).join(' · ')}
                </div>
              </div>
              {r.source === 'collab_accepted' && (
                <span style={{
                  fontFamily: F.label, fontWeight: 400, fontSize: 8, color: A.brass,
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                  border: '0.5px solid var(--atelier-card-border)', borderRadius: 2, padding: '3px 8px', flexShrink: 0,
                }}>Collab</span>
              )}
              {/* MINT ONLY. This gives the external an identity on your plane;
                  assignment happens in the booking pickers that already ship. */}
              {/* D1 — a done action stops offering itself. Once the identity
                  exists this is a STATE, not a control: label flipped, dimmed,
                  disabled, no handler. `bridged` is the server's answer (one
                  read for the page); the row never infers it. */}
              <button type="button"
                onClick={r.bridged ? undefined : () => void addToCrew(r.id)}
                disabled={!!r.bridged || minting === r.id}
                style={{
                  padding: '6px 11px', background: 'transparent', borderRadius: 2,
                  border: '0.5px solid var(--atelier-sheet-border)',
                  cursor: r.bridged || minting === r.id ? 'default' : 'pointer', flexShrink: 0,
                  fontFamily: F.label, fontWeight: 300, fontSize: 8,
                  color: r.bridged ? A.inkMute : A.interactiveWarm,
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                  opacity: r.bridged ? 0.45 : (minting === r.id ? 0.6 : 1),
                }}>{r.bridged ? MINT_DONE_LABEL : (minting === r.id ? 'Adding…' : MINT_ACTION_LABEL)}</button>
            </div>
          ))}
          {outcome && (
            <div style={{
              fontFamily: F.script, fontWeight: 300, fontSize: 16,
              color: outcome.kind === 'error' ? A.red : A.inkSoft, lineHeight: 1.5,
            }}>{outcome.msg}</div>
          )}
        </div>
      )}

      {adding && <AddToRosterSheet onClose={() => setAdding(false)} onAdded={() => { setAdding(false); onAdded(); }} />}
    </>
  );
}

function AddToRosterSheet({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [category, setCategory] = useState('');
  const [error, setError]       = useState('');
  const [saving, setSaving]     = useState(false);
  // F-42.184's other reader (ruling 4(b)): the roster's craft chips are the same
  // eleven off the same door, never a list typed here.
  const [crafts, setCrafts]     = useState<string[]>([]);
  useEffect(() => {
    getJson<{ ok: boolean; requirement_types: string[] }>(API.collabRequirementTypes())
      .then(d => { if (d.ok) setCrafts(d.requirement_types); })
      .catch(() => { /* the chips stay absent; category is optional on this sheet */ });
  }, []);

  async function submit() {
    if (!name.trim() || !phone.trim()) { setError('Name and phone are required.'); return; }
    setSaving(true); setError('');
    const res = await addRosterEntry({ name: name.trim(), phone: phone.trim(), category: category || undefined });
    setSaving(false);
    // The duplicate refusal is the SERVER's sentence, shown verbatim. The dedup
    // decision lives in one place and this screen does not re-derive it — a
    // client-side "is this already here" check would disagree with the server
    // the first time a phone was typed in a different format.
    if (res.ok) { onAdded(); return; }
    setError(res.message || 'Something went wrong. Try again.');
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--atelier-overlay)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', maxHeight: '92dvh', overflowY: 'auto', background: 'var(--atelier-sheet-bg)', backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)', borderTop: '0.5px solid var(--atelier-sheet-border)', padding: '0 0 calc(32px + env(safe-area-inset-bottom))' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
        </div>
        <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 25, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>Add someone</div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: A.interactiveWarm, fontFamily: F.display, fontSize: 25, lineHeight: 1, cursor: 'pointer', padding: 4 }}>×</button>
        </div>
        <div style={{ padding: '0 24px' }}>
          <Label>Name</Label>
          <input value={name} onChange={e => setName(e.target.value)} style={{ ...inputStyle, marginBottom: 18 }} />
          <Label>Phone</Label>
          <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" style={{ ...inputStyle, marginBottom: 18 }} />
          <Label>Category</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
            {crafts.map(t => (
              <Pill key={t} active={category === t} onClick={() => setCategory(category === t ? '' : t)}>
                {labelFor(t)}
              </Pill>
            ))}
          </div>
          {error && <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.red, marginBottom: 14 }}>{error}</div>}
          <button type="button" onClick={submit} disabled={saving} className="atelier-fab" style={{
            width: '100%', padding: '14px 0', borderRadius: 2, border: '0.5px solid var(--atelier-label)',
            cursor: saving ? 'default' : 'pointer', fontFamily: F.label, fontWeight: 400, fontSize: 10,
            color: INK_DEEP, letterSpacing: '0.5em', textTransform: 'uppercase', opacity: saving ? 0.6 : 1,
          }}>{saving ? 'Saving…' : 'Add to roster'}</button>
        </div>
      </div>
    </div>
  );
}

// ── Post form sheet ─────────────────────────────────────────────
// PostCollabForm RETIRED (CE-42 4c-1): the one composer is components/vendor/CollabPostForm.tsx.

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.inkMute, marginBottom: 10 }}>
      {children}
    </div>
  );
}

function Pill({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '7px 13px', borderRadius: 2, cursor: 'pointer',
      background: 'transparent',
      border: `0.5px solid ${active ? 'var(--atelier-input-border)' : 'var(--atelier-card-border)'}`,
      fontFamily: F.label, fontWeight: 300, fontSize: 9,
      color: active ? A.interactiveWarm : A.inkMute,
      letterSpacing: '0.28em', textTransform: 'uppercase',
      transition: `all 180ms ${EASE}`,
      WebkitTapHighlightColor: 'transparent',
    }}>{children}</button>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', boxSizing: 'border-box',
  background: 'var(--atelier-input-bg)',
  border: '0.5px solid var(--atelier-input-border)',
  borderRadius: 2, color: A.ink,
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
  fontSize: 16, lineHeight: 1.5, fontWeight: 300, outline: 'none', 
  caretColor: A.interactive,
};
