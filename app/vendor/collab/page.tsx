'use client';
// /wedding/collab — Vendor-to-vendor requirement board · Atelier rebuild
// Logic, API calls, validation untouched. Only visual chrome rewritten:
// squared corners, brass borders, Italiana titles, Cormorant italic
// detail lines, atelier-fab buttons, atelier sheet for the post form.

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { getJson, postJson, patchJson } from '@/lib/vendor/api/_base';
import { fetchRoster, addRosterEntry, bridgeRosterEntry, RosterEntry } from '@/lib/vendor/api/roster';
import { mintCrewIdentity, MINT_ACTION_LABEL, MINT_DONE_LABEL } from '@/lib/vendor/rosterMint';
// D2 — the option list, its alias map and the match ladder have ONE home.
import { CITIES, matchCity } from '@/lib/vendor/cityMatch';

const A = {
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassLine: 'rgba(201,168,76,0.18)',
  green:     '#7FBE85',
  red:       '#E07B5C',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
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

function fmtDate(iso: string): string {
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}
function fmtBudget(amount?: number, period?: string): string {
  if (!amount) return 'Budget TBD';
  const f = amount >= 100000 ? `Rs ${(amount / 100000).toFixed(1)}L` : `Rs ${amount.toLocaleString('en-IN')}`;
  if (period === 'per_day')   return `${f}/day`;
  if (period === 'per_shoot') return `${f}/shoot`;
  return f;
}
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs  = Math.floor(diff / 3600000);
  if (hrs < 1)  return 'Just now';
  if (hrs < 24) return `${hrs}hr ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function fmtType(t: string): string {
  return t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const REQUIREMENT_TYPES = [
  'photography','videography','makeup','mehendi','decor','catering',
  'venue','music_dj','music_live','choreography','planning','transport',
  'invitations','jewellery','attire','other',
];
const EVENT_TYPES     = ['wedding','pre_wedding','engagement','editorial','brand_shoot','portrait','other'];
const PAYMENT_PERIODS = ['per_day','per_shoot','total','tbd'];
type Tab = 'opportunities' | 'my_posts' | 'roster';

export default function CollabPage() {
  const { session, loading: sl } = useVendorSession();
  const router = useRouter();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <CollabScreen vendorId={session.id} vendorName={session.name} tier={session.tier} />;
}

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

function CollabScreen({ vendorId, vendorName, tier }: { vendorId: string; vendorName: string | null; tier: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefill = readPrefill(searchParams);

  const [tab,      setTab]      = useState<Tab>('opportunities');
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

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Header vendorName={vendorName} />

      {/* Page header — calling-card style intro */}
      <div style={{ padding: '20px 22px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass, marginBottom: 8 }}>
              Discover · Collab
            </div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 30, color: 'var(--atelier-ink)', lineHeight: 1.1, letterSpacing: '-0.005em' }}>
              Your industry,<br />your people.
            </div>
          </div>
          <button type="button" onClick={() => setShowForm(true)} className="atelier-fab" style={{
            padding: '8px 14px', borderRadius: 2, cursor: 'pointer',
            border: '0.5px solid #E0BC6E',
            fontFamily: F.label, fontWeight: 400, fontSize: 9, color: '#1A120E',
            letterSpacing: '0.32em', textTransform: 'uppercase',
            flexShrink: 0, marginTop: 8,
          }}>+ Post</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 22px', marginBottom: 4 }}>
        {(['opportunities', 'my_posts', 'roster'] as Tab[]).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)} style={{
            flex: 1, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: F.label, fontWeight: tab === t ? 400 : 300, fontSize: 9,
            color: tab === t ? A.brassWarm : A.inkMute,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            borderBottom: tab === t ? `0.5px solid ${A.brass}` : '0.5px solid rgba(201,168,76,0.10)',
            transition: `all 200ms ${EASE}`,
          }}>{t === 'opportunities' ? 'Opportunities' : t === 'my_posts' ? 'My Posts' : 'Roster'}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '18px 22px 100px' }}>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: A.inkMute }}>Loading…</div>
        ) : tab === 'opportunities' ? (
          <OpportunitiesTab feed={feed} onRespond={respond} />
        ) : tab === 'my_posts' ? (
          <MyPostsTab
            posts={myPosts}
            onMarkFilled={markFilled}
            onViewResponses={id => router.push(`/vendor/collab/${id}/responses`)}
          />
        ) : (
          <RosterTab roster={roster} onAdded={loadRoster} />
        )}
      </div>

      {showForm && (
        <PostCollabForm
          vendorTier={tier}
          prefill={prefill}
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
        <div style={{ fontFamily: F.display, fontSize: 28, color: 'var(--atelier-accent-text)', marginBottom: 16 }}>✦</div>
        <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 24, color: 'var(--atelier-ink)', lineHeight: 1.2, marginBottom: 8 }}>Quiet for now.</div>
        <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.inkMute, lineHeight: 1.55 }}>
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
        <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.inkSoft, lineHeight: 1.5 }}>
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
      <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 24, color: 'var(--atelier-ink)', lineHeight: 1.15, marginBottom: 6 }}>
        {fmtType(itemsOf(post)[0]?.requirement_type ?? post.requirement_type)} needed
      </div>
      {itemsOf(post).length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {itemsOf(post).slice(1).map((it, n) => (
            <span key={it.id ?? n} style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.brassWarm,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              border: `0.5px solid rgba(201,168,76,0.28)`, borderRadius: 2, padding: '3px 8px',
            }}>{it.requirement_type.replace(/_/g, ' ')}</span>
          ))}
        </div>
      )}
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.inkSoft, marginBottom: 12, lineHeight: 1.4 }}>
        {post.city} · {fmtDate(post.event_date)} · {fmtBudget(post.budget_inr, post.payment_period)}
      </div>

      {post.details && (
        <div style={{ fontFamily: F.script, fontWeight: 400, fontSize: 14, color: A.ink, lineHeight: 1.6, marginBottom: 14, letterSpacing: '0.005em' }}>
          {post.details}
        </div>
      )}

      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute, marginBottom: 16 }}>
        Posted by a {post.poster_category} · {timeAgo(post.posted_ago ?? '')}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => handle('interested')} disabled={working}
          className="atelier-fab" style={{
            flex: 2, padding: '11px 0', borderRadius: 2,
            border: '0.5px solid #E0BC6E', cursor: working ? 'default' : 'pointer',
            fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
            letterSpacing: '0.32em', textTransform: 'uppercase',
            opacity: working ? 0.6 : 1,
          }}>Interested</button>
        <button type="button" onClick={() => handle('passed')} disabled={working} style={{
          flex: 1, padding: '11px 0', background: 'transparent',
          border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2,
          cursor: working ? 'default' : 'pointer',
          fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.brassWarm,
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
        <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 24, color: 'var(--atelier-ink)', lineHeight: 1.2, marginBottom: 8 }}>
          Nothing posted yet.
        </div>
        <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.inkMute, lineHeight: 1.55 }}>
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
        return (
          <div key={post.id} className="atelier-card" style={{ padding: '18px 20px', opacity: open ? 1 : 0.55 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 4 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, marginBottom: 6 }}>
                  My Post
                </div>
                <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 22, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>
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

            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkSoft, marginBottom: 12 }}>
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
                      border: `0.5px solid ${done ? 'var(--atelier-sheet-border)' : 'rgba(201,168,76,0.28)'}`,
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
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute, marginBottom: 12 }}>
                Your roster sees this first. Open to everyone in 12 hours.
              </div>
            )}
            {open && !inFirstLook(post) && post.first_look_until && (
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute, marginBottom: 12 }}>
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
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkSoft, marginBottom: 12 }}>
                {itemsOf(post).every(i => !!i.filled_by_response_id)
                  ? 'All filled. This post is closed.'
                  : 'This post is closed.'}
              </div>
            )}

            {(post.interested_count ?? 0) > 0 && (
              <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 14, color: A.brassWarm, marginBottom: 12 }}>
                {post.interested_count} interested
              </div>
            )}

            {open && (
              <div style={{ display: 'flex', gap: 8 }}>
                {(post.interested_count ?? 0) > 0 && (
                  <button type="button" onClick={() => onViewResponses(post.id)} style={{
                    flex: 2, padding: '10px 0',
                    background: 'rgba(201,168,76,0.10)',
                    border: '0.5px solid rgba(201,168,76,0.4)', borderRadius: 2, cursor: 'pointer',
                    fontFamily: F.label, fontWeight: 400, fontSize: 10, color: A.brassWarm,
                    letterSpacing: '0.32em', textTransform: 'uppercase',
                  }}>View Responses</button>
                )}
                <button type="button" onClick={() => onMarkFilled(post.id)} style={{
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
          fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.brassWarm,
          letterSpacing: '0.32em', textTransform: 'uppercase',
        }}>Add someone</button>
      </div>

      {roster.length === 0 ? (
        <div style={{ padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 24, color: 'var(--atelier-ink)', lineHeight: 1.2, marginBottom: 8 }}>
            No one on your roster yet.
          </div>
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.inkMute, lineHeight: 1.55 }}>
            Vendors you connect with here are added automatically.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {roster.map(r => (
            <div key={r.id} className="atelier-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 17, color: A.ink, lineHeight: 1.2 }}>{r.name}</div>
                <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute, marginTop: 2 }}>
                  {[r.category ? fmtType(r.category) : null, r.phone].filter(Boolean).join(' · ')}
                </div>
              </div>
              {r.source === 'collab_accepted' && (
                <span style={{
                  fontFamily: F.label, fontWeight: 400, fontSize: 8, color: A.brass,
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                  border: `0.5px solid rgba(201,168,76,0.4)`, borderRadius: 2, padding: '3px 8px', flexShrink: 0,
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
                  color: r.bridged ? A.inkMute : A.brassWarm,
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                  opacity: r.bridged ? 0.45 : (minting === r.id ? 0.6 : 1),
                }}>{r.bridged ? MINT_DONE_LABEL : (minting === r.id ? 'Adding…' : MINT_ACTION_LABEL)}</button>
            </div>
          ))}
          {outcome && (
            <div style={{
              fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13,
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
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 26, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>Add someone</div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: A.brassWarm, fontFamily: F.display, fontSize: 24, lineHeight: 1, cursor: 'pointer', padding: 4 }}>×</button>
        </div>
        <div style={{ padding: '0 24px' }}>
          <Label>Name</Label>
          <input value={name} onChange={e => setName(e.target.value)} style={{ ...inputStyle, marginBottom: 18 }} />
          <Label>Phone</Label>
          <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" style={{ ...inputStyle, marginBottom: 18 }} />
          <Label>Category</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
            {REQUIREMENT_TYPES.map(t => (
              <Pill key={t} active={category === t} onClick={() => setCategory(category === t ? '' : t)}>
                {t.replace(/_/g, ' ')}
              </Pill>
            ))}
          </div>
          {error && <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.red, marginBottom: 14 }}>{error}</div>}
          <button type="button" onClick={submit} disabled={saving} className="atelier-fab" style={{
            width: '100%', padding: '14px 0', borderRadius: 2, border: '0.5px solid #E0BC6E',
            cursor: saving ? 'default' : 'pointer', fontFamily: F.label, fontWeight: 400, fontSize: 10,
            color: '#1A120E', letterSpacing: '0.5em', textTransform: 'uppercase', opacity: saving ? 0.6 : 1,
          }}>{saving ? 'Saving…' : 'Add to roster'}</button>
        </div>
      </div>
    </div>
  );
}

// ── Post form sheet ─────────────────────────────────────────────
function PostCollabForm({ vendorTier, prefill, onClose, onSuccess }: {
  vendorTier: string;
  prefill: Prefill;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const canPost = ['signature', 'prestige', 'trial'].includes(vendorTier);

  // 1–8 requirements per post (spec §P4.1). Always at least one row, so the
  // form has one shape whether the vendor needs a florist or a whole crew.
  // The prefill seeds items[0] only — the gap pip knows about one gap.
  const [items, setItems] = useState<{ requirement_type: string; note: string }[]>(
    [{ requirement_type: prefill.type, note: '' }]
  );
  const [form, setForm] = useState({
    requirement_type: '', event_date: prefill.date, city: prefill.city,
    budget_inr: '', payment_period: 'per_shoot',
    event_type: '', details: '', open_to_other_cities: false,
  });

  function setItem(i: number, patch: Partial<{ requirement_type: string; note: string }>) {
    setItems(prev => prev.map((it, n) => (n === i ? { ...it, ...patch } : it)));
  }
  function addItem()      { setItems(prev => (prev.length >= 8 ? prev : [...prev, { requirement_type: '', note: '' }])); }
  function removeItem(i: number) { setItems(prev => (prev.length <= 1 ? prev : prev.filter((_, n) => n !== i))); }
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    if (!canPost) return;
    const chosen = items.filter(i => i.requirement_type);
    if (chosen.length === 0 || !form.event_date || !form.city) {
      setError('Please fill in what you need, the date, and the city.'); return;
    }
    // F10(b)'s two in-sheet refusals — REFUSED HERE, IN WORDS, never by a
    // disabled button the vendor can't interpret. The server refuses a past
    // date too; this one exists so the vendor is told why before a round trip.
    if (new Date(form.event_date) < new Date(new Date().toDateString())) {
      setError('This date has passed. Collab posts need a future date.'); return;
    }
    if (!form.city.trim()) {
      setError('Add a city to your profile before posting.'); return;
    }
    setSubmitting(true); setError('');
    try {
      const payload: Record<string, unknown> = {
        items: items
          .filter(i => i.requirement_type)
          .map(i => ({ requirement_type: i.requirement_type, note: i.note || undefined })),
        event_date:           form.event_date,
        city:                 form.city,
        open_to_other_cities: form.open_to_other_cities,
        payment_period:       form.payment_period || undefined,
        event_type:           form.event_type     || undefined,
        details:              form.details         || undefined,
      };
      if (form.budget_inr) payload.budget_inr = parseInt(form.budget_inr);

      const data = await postJson<{ ok: boolean; error?: string; message?: string }>(
        '/api/v2/vendor/collab', payload
      );

      if (data.ok) onSuccess();
      else if (data.error === 'upgrade_required') setError('Upgrade to Signature to post collab requirements.');
      // F-04.110's second half: the server's refusal sentence travels in
      // `error` (src/lib/response.js's envelope), not `message`. Reading only
      // `message` swallowed every real sentence into the generic fallback —
      // the founder's screenshot showed "Something went wrong. Try again."
      // where a specific, actionable refusal had been written and shipped.
      else setError(data.message || data.error || 'Something went wrong. Try again.');
    } catch { setError('Something went wrong. Try again.'); }
    finally { setSubmitting(false); }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'var(--atelier-overlay)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div style={{
        width: '100%', maxHeight: '92dvh', overflowY: 'auto',
        background: 'var(--atelier-sheet-bg)',
        backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        borderTop: '0.5px solid var(--atelier-sheet-border)',
        padding: '0 0 calc(32px + env(safe-area-inset-bottom))',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
        </div>

        <div style={{ padding: '0 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, marginBottom: 6 }}>
              New Requirement
            </div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 26, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>
              Post a requirement
            </div>
          </div>
          <button type="button" onClick={onClose} style={{
            background: 'none', border: 'none', color: A.brassWarm,
            fontFamily: F.display, fontSize: 24, lineHeight: 1, cursor: 'pointer', padding: 4, flexShrink: 0,
          }}>×</button>
        </div>

        <div style={{ padding: '0 24px' }}>
          {!canPost ? (
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: A.inkSoft, lineHeight: 1.6 }}>
                Upgrade to Signature to post collab requirements.<br />
                You can still browse and respond to others&rsquo; posts.
              </div>
            </div>
          ) : (
            <>
              <Label>What you need</Label>
              {items.map((item, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  {items.length > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute }}>
                        {i + 1} of {items.length}
                      </span>
                      <button type="button" onClick={() => removeItem(i)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                        fontFamily: F.display, fontSize: 18, lineHeight: 1, color: A.brassWarm,
                      }}>×</button>
                    </div>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {REQUIREMENT_TYPES.map(type => (
                      <Pill key={type} active={item.requirement_type === type}
                        onClick={() => setItem(i, { requirement_type: item.requirement_type === type ? '' : type })}>
                        {type.replace(/_/g, ' ')}
                      </Pill>
                    ))}
                  </div>
                </div>
              ))}
              {items.length < 8 && (
                <button type="button" onClick={addItem} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', marginBottom: 22,
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.brassWarm,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Add another</button>
              )}
              {items.length >= 8 && <div style={{ marginBottom: 22 }} />}

              {/* First look — stated before the post exists, not discovered
                  afterwards. The window is server-owned; this line describes it. */}
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkMute, lineHeight: 1.55, marginBottom: 22 }}>
                Your roster sees this first. Open to everyone in 12 hours.
              </div>

              <Label>Date needed</Label>
              <input type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)}
                style={{ ...inputStyle, marginBottom: 22 }} />

              <Label>City</Label>
              <select value={form.city} onChange={e => set('city', e.target.value)}
                style={{ ...inputStyle, marginBottom: 10, appearance: 'none' }}>
                <option value="">Select city</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.open_to_other_cities}
                  onChange={e => set('open_to_other_cities', e.target.checked)}
                  style={{ accentColor: A.brass, width: 16, height: 16 }} />
                <span style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkSoft }}>
                  Also open to vendors who travel
                </span>
              </label>

              <Label>Budget offered (optional)</Label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
                <input type="number" placeholder="Rs" value={form.budget_inr}
                  onChange={e => set('budget_inr', e.target.value)}
                  style={{ ...inputStyle, flex: 2 }} />
                <select value={form.payment_period} onChange={e => set('payment_period', e.target.value)}
                  style={{ ...inputStyle, flex: 1, appearance: 'none' }}>
                  {PAYMENT_PERIODS.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
                </select>
              </div>

              <Label>Event type (optional)</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
                {EVENT_TYPES.map(type => (
                  <Pill key={type} active={form.event_type === type}
                    onClick={() => set('event_type', form.event_type === type ? '' : type)}>
                    {type.replace(/_/g, ' ')}
                  </Pill>
                ))}
              </div>

              <Label>Details (optional · {200 - form.details.length} left)</Label>
              <textarea value={form.details}
                onChange={e => set('details', e.target.value.slice(0, 200))}
                placeholder="Describe what you're looking for…"
                rows={3}
                style={{ ...inputStyle, resize: 'none', marginBottom: 22 }} />

              {error && (
                <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.red, marginBottom: 14 }}>{error}</div>
              )}

              <button type="button" onClick={handleSubmit} disabled={submitting} className="atelier-fab" style={{
                width: '100%', padding: '14px 0', borderRadius: 2,
                border: '0.5px solid #E0BC6E', cursor: submitting ? 'default' : 'pointer',
                fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
                letterSpacing: '0.5em', textTransform: 'uppercase',
                opacity: submitting ? 0.6 : 1,
              }}>{submitting ? 'Posting…' : 'Post'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Shared sub-components ───────────────────────────────────────
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
      background: active ? 'rgba(201,168,76,0.18)' : 'transparent',
      border: `0.5px solid ${active ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.22)'}`,
      fontFamily: F.label, fontWeight: 300, fontSize: 9,
      color: active ? A.brassWarm : A.inkMute,
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
  fontSize: 14, fontWeight: 300, outline: 'none', colorScheme: 'dark',
  caretColor: A.brass,
};
