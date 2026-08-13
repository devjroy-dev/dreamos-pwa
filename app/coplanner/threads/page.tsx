'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  API, CREAM, GOLD, MUTED, HAIRLINE, FROST_PANEL,
  FONT_DISPLAY, FONT_BODY, FONT_EYEBROW,
  useCircleSession, brideId, brideName, circleAuthHeaders, circleRefused } from '../CircleSessionContext';
// TDW_14 D-3b — THE FROZEN BYTES COME FROM THE ONE HOME. This surface renders no
// poll string of its own; the bride's circle bloom imports the same module, so
// the founder's veto is enforced by a single file rather than by two files
// agreeing. `scripts/tdw14_d3b_polls.proof.mjs` reds if a literal appears here.
import { POLL_ASK, POLL_TAP_TO_CHOOSE, POLL_YOUR_CHOICE,
         pollTally, pollCloses, pollWinner, pollTie } from '../../../lib/circle/pollCopy';
// POLL_EMPTY (⑨) is deliberately NOT imported here. This strip renders only when
// polls exist — an empty-state byte on a screen whose subject is conversations
// would advertise a feature instead of serving one. ⑨'s home is the bride's
// circle bloom, where polls are the subject.

// Shape matches GET /api/v2/frost/circle/threads/:userId (backend ~15883).
// Backend sends: thread_id, kind ('dm'|'group'), label, last_message (object), last_active.
interface LastMessage {
  content?: string | null;
  sender_name?: string | null;
  sender_role?: string | null;
  created_at?: string | null;
}

interface Thread {
  thread_id?: string;
  kind?: string | null;
  label?: string | null;        // backend field — was incorrectly read as title/name
  last_message?: LastMessage | null; // object, not string
  last_active?: string | null;  // backend field — was incorrectly read as last_message_at
  [extra: string]: unknown;
}

// Shape matches GET /api/v2/frost/circle/polls/:brideId. The server computes the
// tallies and resolves `my_vote` for THIS viewer, so nothing below counts.
interface PollOption { id: string; label: string; image_url: string | null; votes: number; }
interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  total_votes: number;
  // ⑤ READS "{n} of {total} voted", so the denominator is THE CIRCLE, not the
  // votes — how many people could answer, against how many did. The D-3a payload
  // did not carry it (nothing had asked yet), and the frozen byte cannot be
  // rendered honestly without it; polls.js now serves it. See the handover: the
  // veto surfaced a gap in the sealed payload, and this is the field that closes it.
  eligible_count: number;
  my_vote: string | null;
  closes_at: string | null;
  closed: boolean;
}

// WHO WON, or WHETHER ANYBODY DID. A tie is not an edge case here: a poll may
// carry up to four options and every one can hold an equal count, which is why
// ⑧'s byte takes a LIST. A poll with zero votes has no winner and no tie — it
// simply closed, and neither line renders.
function outcome(p: Poll): string | null {
  if (!p.closed || p.total_votes === 0) return null;
  const top = Math.max(...p.options.map(o => o.votes));
  const leaders = p.options.filter(o => o.votes === top);
  return leaders.length === 1 ? pollWinner(leaders[0].label) : pollTie(leaders.map(o => o.label));
}

function closesLabel(iso: string | null): string | null {
  if (!iso) return null;                 // ⑥ renders ONLY on a non-null closes_at
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return pollCloses(d.toLocaleString(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }));
}

function threadId(t: Thread): string {
  return (t.thread_id || '') as string;
}

function threadLabel(t: Thread, fallbackBride: string): string {
  if (t.label) return t.label;                          // backend sends label directly
  const id = threadId(t);
  if (id.startsWith('dm:'))  return `Chat with ${fallbackBride}`;
  if (id.startsWith('grp:')) return 'Group';            // backend uses 'grp:' not 'group:'
  return 'Circle';
}

function timeAgo(d?: string | null): string {
  if (!d) return '';
  const t = new Date(d).getTime();
  if (Number.isNaN(t)) return '';
  const diff = Math.floor((Date.now() - t) / 1000);
  if (diff < 60)    return 'now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function CoplannerThreads() {
  const router  = useRouter();
  const session = useCircleSession();
  const bride_id = brideId(session);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [polls,   setPolls]   = useState<Poll[]>([]);
  const [voting,  setVoting]  = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch(`${API}/api/v2/frost/circle/threads/${bride_id}`, {
        headers: circleAuthHeaders(),
      });
      // FORK B — one home. A 401 signs her out through the lane's single
      // refusal path; anything else falls through to this screen's own state.
        if (circleRefused(r)) { if (!cancelled) setLoading(false); return; }
        const d = await r.json();
        if (!cancelled && d.success) setThreads((d.data || []) as Thread[]);
      } catch {}
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [bride_id]);

  // The polls strip. Its own read, on the same mount and the same refusal path
  // as the threads read above — a 401 signs her out through the lane's ONE home
  // (FORK B), anything else leaves the strip empty rather than shouting.
  const loadPolls = async () => {
    try {
      const r = await fetch(`${API}/api/v2/frost/circle/polls/${bride_id}`, {
        headers: circleAuthHeaders(),
      });
      if (circleRefused(r)) return;
      const d = await r.json();
      if (d.success) setPolls((d.data || []) as Poll[]);
    } catch { /* keep last known — a dropped packet is not a reason to blank her screen */ }
  };

  useEffect(() => { loadPolls(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [bride_id]);

  // A cast vote RE-READS rather than patching the count locally. The server owns
  // the tally and resolves `my_vote` per viewer; a screen that moved a number it
  // was not told about would be confidently wrong the moment two people voted at
  // once. `voting` disables the row it is on, so a double tap cannot race itself.
  const vote = async (pollId: string, optionId: string) => {
    if (voting) return;
    setVoting(pollId);
    try {
      const r = await fetch(`${API}/api/v2/frost/circle/polls/${encodeURIComponent(pollId)}/vote`, {
        method: 'POST',
        headers: circleAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ option_id: optionId }),
      });
      if (circleRefused(r)) return;
      await loadPolls();
    } catch { /* keep last known */ }
    finally { setVoting(null); }
  };

  const sorted = [...threads].sort((a, b) => {
    const aGroup = a.kind === 'group' ? 0 : 1;          // backend kind: 'group' | 'dm'
    const bGroup = b.kind === 'group' ? 0 : 1;
    if (aGroup !== bGroup) return aGroup - bGroup;
    const at = new Date((a.last_active as string) || 0).getTime();   // backend: last_active
    const bt = new Date((b.last_active as string) || 0).getTime();
    return bt - at;
  });

  return (
    <>
      <p style={{
        fontFamily: FONT_EYEBROW, fontWeight: 200, fontSize: 9,
        letterSpacing: '0.32em', textTransform: 'uppercase',
        color: GOLD, margin: '0 0 12px',
      }}>THREADS</p>

      <h1 style={{
        fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 300,
        fontSize: 32, lineHeight: 1.15, color: CREAM,
        margin: '0 0 24px',
      }}>Conversations.</h1>

      {/* ── THE POLLS STRIP ────────────────────────────────────────────────
          Above the conversations, because a poll is a thing waiting on HER and a
          thread is a thing that already happened. It renders only when polls
          exist: an empty strip on a screen whose subject is conversations would
          be advertising a feature instead of serving one. ⑨'s byte belongs to
          the poll surfaces proper, not to this strip's silence. */}
      {!loading && polls.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <p style={{
            fontFamily: FONT_EYEBROW, fontWeight: 200, fontSize: 9,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            color: GOLD, margin: '0 0 12px',
          }}>{POLL_ASK.toUpperCase()}</p>

          {polls.map(p => {
            const result = outcome(p);
            const closes = closesLabel(p.closes_at);
            return (
              <div key={p.id} style={{ ...FROST_PANEL, padding: 16, marginBottom: 12 }}>
                <p style={{
                  fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 300,
                  fontSize: 19, lineHeight: 1.3, color: CREAM, margin: '0 0 12px',
                }}>{p.question}</p>

                {p.options.map(o => {
                  const mine = p.my_vote === o.id;
                  return (
                    <button
                      key={o.id}
                      disabled={p.closed || voting === p.id}
                      onClick={() => vote(p.id, o.id)}
                      style={{
                        width: '100%', textAlign: 'left',
                        background: mine ? 'rgba(201,168,76,0.10)' : 'transparent',
                        border: `0.5px solid ${mine ? GOLD : HAIRLINE}`,
                        borderRadius: 8, padding: '10px 12px', marginBottom: 6,
                        cursor: p.closed ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                      }}>
                      <span style={{
                        fontFamily: FONT_BODY, fontWeight: 400, fontSize: 14,
                        color: CREAM, flex: 1,
                      }}>{o.label}</span>
                      <span style={{
                        fontFamily: FONT_BODY, fontWeight: 300, fontSize: 11,
                        color: mine ? GOLD : MUTED, flexShrink: 0,
                      }}>
                        {/* Before she answers, the affordance. After, whose choice
                            it is. THE COUNT IS ALWAYS SHOWN — "live tallies" is the
                            spec's own word and a poll is shared by creation, so
                            there is nothing here to withhold from anyone. */}
                        {mine ? POLL_YOUR_CHOICE : (p.closed ? '' : POLL_TAP_TO_CHOOSE)}
                        {o.votes > 0 ? ` · ${o.votes}` : ''}
                      </span>
                    </button>
                  );
                })}

                <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 11, color: MUTED }}>
                    {pollTally(p.total_votes, p.eligible_count)}
                  </span>
                  {closes && !p.closed && (
                    <span style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 11, color: MUTED }}>{closes}</span>
                  )}
                  {result && (
                    <span style={{ fontFamily: FONT_BODY, fontWeight: 400, fontSize: 11, color: GOLD }}>{result}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loading && (
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: MUTED }}>Loading…</p>
      )}

      {!loading && sorted.length === 0 && (
        <div style={{ ...FROST_PANEL, padding: 24, textAlign: 'center' }}>
          <p style={{
            fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
            color: MUTED, margin: 0, lineHeight: 1.6,
          }}>
            No threads yet. When {brideName(session)} starts a conversation
            with you, it&rsquo;ll show up here.
          </p>
        </div>
      )}

      {!loading && sorted.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {sorted.map(t => {
            const id      = threadId(t);
            const label   = threadLabel(t, brideName(session));
            const preview = t.last_message?.content || '';
            const stamp   = timeAgo(t.last_active);
            return (
              <li key={id}>
                <button
                  onClick={() => router.push(`/coplanner/threads/${encodeURIComponent(id)}`)}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: '14px 0',
                    borderBottom: `0.5px solid ${HAIRLINE}`,
                    color: CREAM,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                    <p style={{
                      fontFamily: FONT_BODY, fontWeight: 400, fontSize: 15,
                      color: CREAM, margin: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      flex: 1,
                    }}>{label}</p>
                    {stamp && (
                      <span style={{
                        fontFamily: FONT_BODY, fontWeight: 300, fontSize: 11,
                        color: MUTED, flexShrink: 0,
                      }}>{stamp}</span>
                    )}
                  </div>
                  {preview && (
                    <p style={{
                      fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
                      color: MUTED, margin: '4px 0 0',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{preview}</p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
