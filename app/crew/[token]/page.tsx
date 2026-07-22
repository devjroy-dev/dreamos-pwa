'use client';
// app/crew/[token]/page.tsx
// TDW_04.5 · P3 — THE CREW PAGE (founder ruling P-1: crew have NO logins).
//
// A public, capability-token page. The token in the URL is the whole credential —
// there is no session, no cookie, no header, nothing to remember and nothing to
// install. Spec §6: "the crew page intentionally stays web forever"; the native app
// links out to it. No gestures beyond tap.
//
// ── ROUTE ───────────────────────────────────────────────────────────────────
// `middleware.ts` does not rewrite this path on the main host: the demo-subdomain
// branches all return before the fall-through `NextResponse.next()` at :51, and the
// matcher at :55 excludes only _next/static, _next/image, favicon and api. Verified at
// e465760. NAMED BEHAVIOUR: on the `demo.` host this path DOES get swallowed to
// /demo/not-found (middleware.ts:47) — a link minted on the demo host is visibly dead
// rather than quietly wrong, which is the right failure and is why the link is built
// from `window.location.origin` (CE ruling F6) rather than from API_BASE, which points
// at the backend and never at this page.
//
// ── WHAT THIS PAGE MAY KNOW ─────────────────────────────────────────────────
// Exactly what GET /api/v2/crew/:token gives it, which is the security boundary made
// of shape: a member name, a vendor name, this member's own upcoming functions, and
// this member's own open tasks. No money, no phone, no other member, no client data
// beyond the wedding's name. If something you want to render is not on the wire, the
// answer is not to fetch it from somewhere else.
//
// ── HOUSE LAW ───────────────────────────────────────────────────────────────
// Cream field #F8F7F5 · ink #0C0A09 · Cormorant Garamond 300 display · Jost labels ·
// DM Sans body. ONE GOLD PER SCREEN (spec §3): the gold is spent on Confirm and
// nowhere else — the decline is terracotta #E07B5C, the same value CalendarBands.tsx:44
// paints a declined ring with, so the crew member and the vendor are looking at the
// same colour meaning the same thing. NO localStorage, NO sessionStorage: every piece
// of state here is React's and dies with the tab.
//
// ── COPY ────────────────────────────────────────────────────────────────────
// Every user-facing string on this page carries the founder's recorded veto (answered
// YES, 2026-07-22). The dead-link line is "This link isn't active." — the chair's
// correction to the proposed "…isn't active anymore.", because "anymore" would leak
// past-existence and break the byte-identical never-existed ≡ rotated law the backend
// is built to hold. Do not soften it back.

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_BASE } from '@/lib/api';
import { slotWord } from '@/lib/vendor/slotWords';
import type { CrewAssignment, CrewTask, CrewPageResponse } from '@/lib/vendor/types/vendor';

const C = {
  cream:      '#F8F7F5',
  ink:        '#0C0A09',
  muted:      'rgba(12,10,9,0.52)',
  faint:      'rgba(12,10,9,0.30)',
  rule:       'rgba(12,10,9,0.10)',
  card:       '#FFFFFF',
  gold:       '#C9A84C',
  terracotta: '#E07B5C',
};
const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** '2026-07-29' -> '29 Jul'. Raw and small; the estate's date-humanization pass is
 *  Block 09's (Ruling №8 parked it there), and this page does not front-run it. */
function dayMonth(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${parseInt(m[3], 10)} ${MONTHS[parseInt(m[2], 10) - 1]}`;
}
/** '18:30:00' -> '18:30'. Trimmed, never reformatted into a clock the estate doesn't keep. */
function hhmm(t: string | null) {
  if (!t) return null;
  const m = /^(\d{2}):(\d{2})/.exec(t);
  return m ? `${m[1]}:${m[2]}` : t;
}

const labelStyle: React.CSSProperties = {
  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: C.faint,
  letterSpacing: '0.22em', textTransform: 'uppercase',
};

export default function CrewPage() {
  const params = useParams();
  const token  = String(params?.token ?? '');

  const [state, setState] = useState<'loading' | 'ready' | 'dead' | 'throttled'>('loading');
  const [data,  setData]  = useState<CrewPageResponse | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/v2/crew/${encodeURIComponent(token)}`);
      if (r.status === 429) { setState('throttled'); return; }
      if (!r.ok) { setState('dead'); return; }
      const body = (await r.json()) as CrewPageResponse;
      // A 200 whose shape is wrong is treated as dead rather than half-rendered.
      if (!body || body.ok !== true || !body.member) { setState('dead'); return; }
      setData(body);
      setState('ready');
    } catch {
      // A network failure is NOT a dead link, and must not be dressed as one — the
      // member would rotate a perfectly good token over a lost signal.
      setState('throttled');
    }
  }, [token]);

  useEffect(() => { void load(); }, [load]);

  if (state === 'loading')   return <Shell><Centered><span style={labelStyle}>Loading</span></Centered></Shell>;
  // THE DEAD PAGE FAILS BLANK. No vendor name, no member name, no explanation of which
  // kind of dead it is — this is the client half of the backend's F2 law.
  if (state === 'dead')      return <Shell><Centered><Quiet>This link isn&rsquo;t active.</Quiet></Centered></Shell>;
  if (state === 'throttled') return <Shell><Centered><Quiet>Too many tries. Wait a minute.</Quiet></Centered></Shell>;
  if (!data)                 return <Shell><Centered><Quiet>This link isn&rsquo;t active.</Quiet></Centered></Shell>;

  return (
    <Shell>
      <div style={{ padding: '44px 22px 64px', maxWidth: 560, margin: '0 auto' }}>

        {/* The eyebrow is the vendor's name, verbatim — whose crew you are. */}
        {data.vendor.name && <div style={{ ...labelStyle, marginBottom: 10 }}>{data.vendor.name}</div>}
        <h1 style={{
          fontFamily: F.display, fontWeight: 300, fontStyle: 'italic', fontSize: 34,
          color: C.ink, margin: 0, lineHeight: 1.15,
        }}>{data.member.name}</h1>

        <Section title="Your dates" />
        {data.assignments.length === 0 ? (
          <Quiet>Nothing on your calendar yet.</Quiet>
        ) : data.assignments.map((a) => (
          <DayCard key={a.event_id} a={a} token={token} onSaved={load} />
        ))}

        <Section title="Your tasks" />
        {data.tasks.length === 0 ? (
          <Quiet>No tasks for you right now.</Quiet>
        ) : data.tasks.map((t) => (
          <TaskRow key={t.task_id} t={t} token={token} onSaved={load} />
        ))}
      </div>
    </Shell>
  );
}

/* ── the field ──────────────────────────────────────────────────────────── */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100dvh', background: C.cream, color: C.ink,
      display: 'flex', flexDirection: 'column',
    }}>{children}</div>
  );
}
function Centered({ children }: { children: React.ReactNode }) {
  return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>{children}</div>;
}
function Quiet({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: C.muted, margin: '4px 0 0', lineHeight: 1.6 }}>{children}</p>;
}
function Section({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '38px 0 14px' }}>
      <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 21, color: C.ink }}>{title}</span>
      <span style={{ flex: 1, height: 1, background: C.rule }} />
    </div>
  );
}

/* ── one day ────────────────────────────────────────────────────────────── */
function DayCard({ a, token, onSaved }: { a: CrewAssignment; token: string; onSaved: () => void }) {
  const [declining, setDeclining] = useState(false);
  const [note, setNote]           = useState('');
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const word = slotWord(a.slot);
  const time = hhmm(a.call_time);

  async function respond(status: 'confirmed' | 'declined', withNote?: string) {
    if (saving) return;
    setSaving(true); setError(null);
    try {
      const r = await fetch(`${API_BASE}/api/v2/crew/${encodeURIComponent(token)}/confirm`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ event_id: a.event_id, status, note: withNote || undefined }),
      });
      if (r.status === 429) { setError('Too many tries. Wait a minute.'); return; }
      if (!r.ok)            { setError('Could not save. Try again.'); return; }
      setDeclining(false); setNote('');
      onSaved();
    } catch {
      setError('Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      background: C.card, border: `0.5px solid ${C.rule}`, borderRadius: 10,
      padding: '16px 18px', marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 24, color: C.ink }}>{dayMonth(a.date)}</span>
        {word && <span style={labelStyle}>{word}</span>}
      </div>

      <div style={{ fontFamily: F.body, fontWeight: 400, fontSize: 15, color: C.ink, marginTop: 6 }}>{a.title}</div>
      {a.wedding && (
        <div style={{ fontFamily: F.display, fontWeight: 300, fontStyle: 'italic', fontSize: 15, color: C.muted, marginTop: 2 }}>{a.wedding}</div>
      )}
      {time && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={labelStyle}>Call time</span>
          <span style={{ fontFamily: F.body, fontWeight: 400, fontSize: 14, color: C.ink }}>{time}</span>
        </div>
      )}

      {/* State first, actions second — the answer already given is the headline. */}
      {a.confirmation === 'confirmed' && (
        <p style={{ fontFamily: F.body, fontWeight: 400, fontSize: 13, color: C.ink, margin: '14px 0 0' }}>You&rsquo;re confirmed.</p>
      )}
      {a.confirmation === 'declined' && (
        <p style={{ fontFamily: F.body, fontWeight: 400, fontSize: 13, color: C.terracotta, margin: '14px 0 0' }}>You said you can&rsquo;t make it.</p>
      )}
      {a.note && (
        <p style={{ fontFamily: F.display, fontWeight: 300, fontStyle: 'italic', fontSize: 14, color: C.muted, margin: '4px 0 0' }}>{a.note}</p>
      )}

      {declining ? (
        <div style={{ marginTop: 14 }}>
          <div style={{ ...labelStyle, marginBottom: 6 }}>Note (optional)</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything they should know?"
            rows={2}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '10px 12px',
              background: C.cream, border: `0.5px solid ${C.rule}`, borderRadius: 8,
              fontFamily: F.body, fontWeight: 300, fontSize: 14, color: C.ink,
              outline: 'none', resize: 'vertical',
            }}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <Btn onClick={() => { setDeclining(false); setNote(''); }} disabled={saving} tone="quiet">Back</Btn>
            <Btn onClick={() => respond('declined', note.trim())} disabled={saving} tone="terracotta">
              {saving ? 'Saving…' : "Can't make it"}
            </Btn>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {/* D4 (founder-caught at the P4 smoke) — "You're confirmed." was
              rendering above a live gold Confirm. A completed action must stop
              presenting itself as an action, so once confirmed this dims and
              takes no handler.

              CAN'T MAKE IT STAYS LIVE, DELIBERATELY. Someone who confirms and
              then can't come has to be able to say so; dimming both would trap
              them with no way to tell the vendor. The decline path is open in
              both directions, always.

              P3 RIDER, disclosed: this file is P3's surface (sealed CE-58), not
              P4's. Two-line change, founder-chartered, recorded as a rider
              rather than folded in silently. Zero new strings — the page
              already says "You're confirmed." above this row. */}
          <Btn onClick={a.confirmation === 'confirmed' ? () => {} : () => respond('confirmed')}
               disabled={saving || a.confirmation === 'confirmed'} tone="gold">Confirm</Btn>
          <Btn onClick={() => setDeclining(true)} disabled={saving} tone="quiet">Can&rsquo;t make it</Btn>
        </div>
      )}

      {error && <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: C.terracotta, margin: '10px 0 0' }}>{error}</p>}
    </div>
  );
}

/* ── one task ───────────────────────────────────────────────────────────── */
function TaskRow({ t, token, onSaved }: { t: CrewTask; token: string; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  async function done() {
    if (saving) return;
    setSaving(true); setError(null);
    try {
      const r = await fetch(`${API_BASE}/api/v2/crew/${encodeURIComponent(token)}/task`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ task_id: t.task_id, done: true }),
      });
      if (r.status === 429) { setError('Too many tries. Wait a minute.'); return; }
      if (!r.ok)            { setError('Could not save. Try again.'); return; }
      onSaved();
    } catch {
      setError('Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      background: C.card, border: `0.5px solid ${C.rule}`, borderRadius: 10,
      padding: '14px 18px', marginBottom: 10,
      display: 'flex', alignItems: 'flex-start', gap: 14,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.body, fontWeight: 400, fontSize: 15, color: C.ink }}>{t.title}</div>
        {t.description && (
          <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>{t.description}</div>
        )}
        {t.due_date && <div style={{ ...labelStyle, marginTop: 6 }}>{dayMonth(t.due_date)}</div>}
        {error && <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: C.terracotta, margin: '8px 0 0' }}>{error}</p>}
      </div>
      <Btn onClick={done} disabled={saving} tone="quiet">{saving ? 'Saving…' : 'Done'}</Btn>
    </div>
  );
}

/* ── one button ─────────────────────────────────────────────────────────── */
function Btn({
  children, onClick, disabled, tone,
}: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; tone: 'gold' | 'quiet' | 'terracotta';
}) {
  const base: React.CSSProperties = {
    padding: '11px 18px', borderRadius: 999, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: F.label, fontWeight: 400, fontSize: 10, letterSpacing: '0.2em',
    textTransform: 'uppercase', opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap',
  };
  // THE ONE GOLD. Spec §3 caps this screen at a single gold fill and it is spent here,
  // on the affirmative answer. Everything else is line-weight.
  const tones: Record<string, React.CSSProperties> = {
    gold:       { ...base, background: C.gold, border: 'none', color: C.ink },
    quiet:      { ...base, background: 'transparent', border: `0.5px solid ${C.rule}`, color: C.muted },
    terracotta: { ...base, background: 'transparent', border: `0.5px solid ${C.terracotta}`, color: C.terracotta },
  };
  return <button type="button" onClick={onClick} disabled={disabled} style={tones[tone]}>{children}</button>;
}
