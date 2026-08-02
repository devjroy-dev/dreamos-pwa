'use client';
import { useRouter } from 'next/navigation';
import {
  CREAM, GOLD, MUTED, HAIRLINE, FROST_PANEL,
  FONT_DISPLAY, FONT_BODY, FONT_EYEBROW,
  useCircleSession, brideName, memberName, clearCircleToken,
} from '../CircleSessionContext';

// ── F-07.121 · THE ROLE MAP MISSED THE ONLY ROLE MOST MEMBERS HAVE ──────────
//
// WHAT STOOD HERE, and what each key was worth:
//   Partner: 'Partner'          → the right word in the WRONG CASE. The estate
//                                 mints `partner`, lowercase, everywhere. Never
//                                 matched. Never rendered.
//   inner_circle: 'Inner Circle'→ the ONE key that could ever hit.
//   circle: 'Circle'            → not in the value-space at all. Dead on arrival.
//   (missing)                   → `family`, which is the DEFAULT every invite
//                                 takes (join.js:128/:300 `|| 'family'`), and
//                                 therefore the role most members actually hold.
// So the map was 1-of-3 on the lawful values, and `:19`'s `|| 'Circle'` fallback
// printed over the miss — silently, plausibly, and wrongly. Mehek's row is
// `family`; her screen read "Circle".
//
// THIS IS F-07.110'S TWIN. The identical dead value-space map was deleted from
// `threads/[threadId]/page.tsx` at CE-126 for the identical reason. A class with
// two instances earns a census, so both repos were swept: the ONLY other role
// map in the estate is `sanctuary/page.tsx:2522`, the BRIDE's own — and hers is
// CORRECT, keyed on all three lawful lowercase values and driven by the same
// three at `:2736`. The estate got this right once, one surface over, and the
// member's copy drifted. That contrast is the discriminating fact, exactly as
// `circle_activity`'s correct pair was at CE-126.
//
// THE VALUE-SPACE, DERIVED BY COMMAND — the database's own CHECK constraint,
// which is the only authority that cannot drift from what a row may hold:
//   docs/db/PUBLIC_SCHEMA.md:1094-1095
//   [CHECK] circle_members_role_check
//     CHECK ((role = ANY (ARRAY['partner'::text, 'family'::text, 'inner_circle'::text])))
// Corroborated at five independent sites, all agreeing, all lowercase:
// `invite_circle_member`'s own guard (0099_circle_invite_link_fix.sql:50),
// `join.js:128` and `:300`, `couple/circle.js:28`'s VALID_ROLES, and
// `brideEngine.js:1787`. Nothing was assumed from the shape of the old map.
//
// THE LABELS ARE NOT NEW BYTES. They are lifted VERBATIM from the bride's live,
// already-shipped map at `sanctuary/page.tsx:2522-2525` — so the member and the
// bride now read the same word for the same row, which is the point, and no
// unvetoed string reaches a screen.
//
// THE FALLBACK IS NOW HONEST. `|| 'Circle'` asserted a role; if the CHECK
// constraint ever grows a fourth value, printing a confident wrong label is
// worse than printing the raw one. It falls back to the value itself, which is
// ugly, true, and self-revealing.
const ROLE_LABEL: Record<string, string> = {
  partner:      'Partner · Fiancé',
  family:       'Family',
  inner_circle: 'Inner Circle',
};

export default function CoplannerSettings() {
  const session = useCircleSession();
  const router  = useRouter();
  const name    = memberName(session);
  const roleLbl = ROLE_LABEL[session.role] || session.role;

  const signOut = () => {
    if (typeof window === 'undefined') return;
    if (!window.confirm('Sign out of your Circle?')) return;
    try {
      localStorage.removeItem('circle_session');
      localStorage.removeItem('circle_last_path');
      // F-07.72 — a sign-out that left the credential behind would be a sign-out
      // in name only: the next visitor to this device would hold a valid,
      // 90-day, subject-bound token for a session the screen says is over.
      clearCircleToken();
    } catch {}
    router.replace('/');
  };

  return (
    <>
      <p style={{
        fontFamily: FONT_EYEBROW, fontWeight: 200, fontSize: 9,
        letterSpacing: '0.32em', textTransform: 'uppercase',
        color: GOLD, margin: '0 0 12px',
      }}>SETTINGS</p>

      <h1 style={{
        fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 300,
        fontSize: 32, lineHeight: 1.15, color: CREAM,
        margin: '0 0 28px',
      }}>You.</h1>

      <section style={{ ...FROST_PANEL, padding: 20, marginBottom: 20 }}>
        <Row label="NAME"  value={name} />
        <Row label="ROLE"  value={roleLbl} valueColor={GOLD} />
        <Row label="CIRCLE FOR" value={brideName(session)} last />
      </section>

      <section style={{ ...FROST_PANEL, padding: 20, marginBottom: 20 }}>
        <p style={{
          fontFamily: FONT_BODY, fontWeight: 300, fontSize: 12,
          color: MUTED, margin: '0 0 16px', lineHeight: 1.6,
        }}>
          Your name and role were set by {brideName(session)} when she invited you.
          Ask her to update them if anything looks off.
        </p>

        <button
          onClick={signOut}
          style={{
            width: '100%', height: 44,
            background: 'transparent',
            border: `0.5px solid ${HAIRLINE}`,
            borderRadius: 100,
            cursor: 'pointer',
            fontFamily: FONT_EYEBROW, fontWeight: 300, fontSize: 10,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            color: CREAM,
          }}>Sign out</button>
      </section>
    </>
  );
}

function Row({ label, value, valueColor, last }: {
  label: string; value: string; valueColor?: string; last?: boolean;
}) {
  return (
    <div style={{
      padding: '12px 0',
      borderBottom: last ? 'none' : `0.5px solid ${HAIRLINE}`,
    }}>
      <p style={{
        fontFamily: FONT_EYEBROW, fontWeight: 300, fontSize: 9,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: MUTED, margin: '0 0 4px',
      }}>{label}</p>
      <p style={{
        fontFamily: FONT_BODY, fontWeight: 400, fontSize: 15,
        color: valueColor || CREAM, margin: 0,
      }}>{value || '—'}</p>
    </div>
  );
}
