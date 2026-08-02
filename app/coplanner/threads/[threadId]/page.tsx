'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  API, CREAM, GOLD, INK, MUTED, HAIRLINE,
  FONT_DISPLAY, FONT_BODY, FONT_EYEBROW,
  useCircleSession, brideId, brideName, circleAuthHeaders, circleRefused } from '../../CircleSessionContext';

interface Message {
  id: string;
  body?: string | null;
  content?: string | null;
  // F-07.109 — REAL AS OF 0105. This field was declared here and compared at
  // :139 since this screen was written, and NO server response on this lane had
  // ever carried it: `undefined === session.user_id` is permanently false, so
  // every bubble took the stranger branch and the reader's own messages rendered
  // as somebody else's. The server now emits it from the column.
  sender_user_id?: string | null;
  sender_name?: string | null;
  sender_role?: string | null;
  actor_role?: string | null;
  created_at: string;
}

// ── F-07.110 · ROLE_LABEL IS DELETED, AND IT NEVER ONCE RENDERED ─────────────
// The map that stood here keyed on Partner / inner_circle / circle / co_planner /
// primary. The value that actually arrives in `actor_role` and `sender_role` is
// `sent_by`, whose entire minted space is couple / bride / circle_member — and,
// on live data, `agent` as well (F-07.112). ZERO overlap, in every direction, so
// `msgRoleLabel()` returned '' for every message ever displayed and the ` · Role`
// suffix has never appeared on a single bubble. F-07.89's family: the client
// believing in a value-space the server does not emit — value rather than field.
//
// Deleted rather than re-keyed, on the founder's word 「 NO TAG 」: re-keying it
// would start printing the role, which is precisely the thing this delivery
// exists to stop showing. On the founder's own rows that role reads `couple`
// over a circle member's own words.
function msgBody(m: Message): string {
  return (m.body || m.content || '') as string;
}

function timeShort(d: string): string {
  const t = new Date(d).getTime();
  if (Number.isNaN(t)) return '';
  return new Date(d).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

export default function ThreadDetail() {
  const router    = useRouter();
  const params    = useParams();
  const session   = useCircleSession();
  const thread_id = decodeURIComponent((params?.threadId as string) || '');
  const bride_id  = brideId(session);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(true);
  const [composing, setComposing] = useState('');
  const [sending, setSending]   = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    try {
      const r = await fetch(
        `${API}/api/v2/frost/circle/threads/${bride_id}/${encodeURIComponent(thread_id)}/messages`,
        { headers: circleAuthHeaders() }
      );
      // FORK B — one home. A 401 signs her out through the lane's single
      // refusal path; anything else falls through to this screen's own state.
      if (circleRefused(r)) { setLoading(false); return; }
      const d = await r.json();
      if (d.success) setMessages((d.data || []) as Message[]);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!thread_id) return;
    load();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [bride_id, thread_id]);

  useEffect(() => {
    if (!loading) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  const send = async () => {
    const body = composing.trim();
    if (!body || sending) return;
    setSending(true);
    setComposing('');
    try {
      const sent = await fetch(`${API}/api/v2/frost/circle/messages`, {
        method: 'POST',
        headers: circleAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          userId: bride_id,
          thread_id,
          body,
          // F-07.107 — `sender_name: myName` was here and the server no longer
          // accepts it. The name is hydrated server-side from the owner row
          // (circle_members.invitee_name) and persisted; a client-supplied
          // identity is a forgeable address (F-07.56) and was never stored.
        }),
      });
      // FORK B — the send half. This response was DISCARDED before ZIP 2, which
      // was harmless while nothing refused; under enforcement a discarded 401 is
      // a message that vanishes with no error at all (F-07.117's shape). The
      // text is restored to the box so nothing she typed is lost behind a
      // sign-out.
      if (circleRefused(sent)) { setComposing(body); setSending(false); return; }
      await load();
    } catch {
      setComposing(body);
    }
    setSending(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button
          onClick={() => router.push('/coplanner/threads')}
          aria-label="Back"
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: MUTED, fontSize: 22, lineHeight: 1, padding: 0,
            fontFamily: FONT_BODY,
          }}>‹</button>
        <h1 style={{
          fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 300,
          fontSize: 22, color: CREAM, margin: 0,
        }}>
          {thread_id.startsWith('dm:') ? `Chat with ${brideName(session)}` : 'Thread'}
        </h1>
      </div>

      <div ref={scrollRef} style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: 12,
      }}>
        {loading && (
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: MUTED }}>Loading…</p>
        )}

        {!loading && messages.length === 0 && (
          <p style={{
            fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
            color: MUTED, lineHeight: 1.6, textAlign: 'center', marginTop: 32,
          }}>No messages yet. Say hello.</p>
        )}

        {!loading && messages.map(m => {
          // F-07.109 — UNCHANGED, and it is now TRUE AS WRITTEN. The cure put the
          // field on the wire rather than bending this line around its absence.
          // A pre-0105 row, or a send that carried no credential, has a null id:
          // the comparison is false, the bubble takes the stranger branch, and
          // that is exactly how it rendered before — no regression on history.
          const mine = m.sender_user_id === session.user_id;
          return (
            <div key={m.id} style={{
              display: 'flex',
              justifyContent: mine ? 'flex-end' : 'flex-start',
              marginBottom: 10,
            }}>
              <div style={{
                maxWidth: '78%',
                background: mine ? 'rgba(201,168,76,0.16)' : 'rgba(255,255,255,0.05)',
                border: `0.5px solid ${mine ? 'rgba(201,168,76,0.3)' : HAIRLINE}`,
                borderRadius: 14,
                padding: '10px 14px',
              }}>
                {/* F-07.107 · THE LABEL, THREE CASES AND NO FOURTH.
                    OWN → 「 You 」, the delivery's ONE new user-facing byte,
                      founder-vetoed and frozen, matching sanctuary:2625 which has
                      always said 「 You 」 on the bride's own bubbles.
                    NAMED → the hydrated name alone. No ` · Role` suffix: 「 NO TAG 」.
                    UNNAMED → NOTHING. Every row written before 0105 has no author
                      and none can be invented for it (history stays NULL, founder-
                      ruled). This falls back to no label rather than to the role,
                      because the role is the string this cure exists to remove —
                      and on live rows it reads `couple` over a member's own words,
                      or `agent` for Mira, who is not a person (F-07.112). An absent
                      label is the honest rendering of an absent author. */}
                {(mine || m.sender_name) && (
                  <p style={{
                    fontFamily: FONT_EYEBROW, fontWeight: 300, fontSize: 9,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: GOLD, margin: '0 0 4px',
                  }}>
                    {mine ? 'You' : m.sender_name}
                  </p>
                )}
                <p style={{
                  fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14,
                  color: CREAM, margin: 0, lineHeight: 1.5,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>{msgBody(m)}</p>
                <p style={{
                  fontFamily: FONT_BODY, fontWeight: 300, fontSize: 10,
                  color: MUTED, margin: '4px 0 0', textAlign: 'right',
                }}>{timeShort(m.created_at)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        display: 'flex', gap: 8, alignItems: 'center',
        padding: '12px 0 0',
        borderTop: `0.5px solid ${HAIRLINE}`,
      }}>
        <input
          type="text"
          placeholder="Write a message"
          aria-label="Type your message"
          value={composing}
          onChange={e => setComposing(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          disabled={sending}
          onFocus={(e) => { e.currentTarget.style.outline = `2px solid ${GOLD}`; e.currentTarget.style.outlineOffset = '2px'; }}
          onBlur={(e) => { e.currentTarget.style.outline = 'none'; }}
          style={{
            flex: 1, height: 44,
            background: 'rgba(255,255,255,0.05)',
            border: `0.5px solid ${HAIRLINE}`,
            borderRadius: 100,
            padding: '0 16px',
            fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14,
            color: CREAM, outline: 'none',
          }}
        />
        <button
          onClick={send}
          disabled={sending || !composing.trim()}
          style={{
            height: 44, padding: '0 18px',
            background: composing.trim() ? GOLD : 'rgba(255,255,255,0.05)',
            color: composing.trim() ? INK : MUTED,
            border: 'none', borderRadius: 100,
            cursor: sending || !composing.trim() ? 'default' : 'pointer',
            fontFamily: FONT_EYEBROW, fontWeight: 400, fontSize: 9,
            letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>{sending ? '…' : 'Send'}</button>
      </div>
    </div>
  );
}
