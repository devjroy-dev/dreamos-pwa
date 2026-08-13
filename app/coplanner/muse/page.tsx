'use client';
import { useEffect, useState } from 'react';
import {
  API, CREAM, GOLD, INK, MUTED, HAIRLINE, FROST_PANEL,
  FONT_DISPLAY, FONT_BODY, FONT_EYEBROW,
  useCircleSession, brideId, brideName, circleAuthHeaders, circleRefused } from '../CircleSessionContext';
import AddMuseSheet from './AddMuseSheet';

interface MuseTile {
  id: string;
  image_url: string;
  function_tag?: string | null;
  note?: string | null;
  created_at?: string;
  saved_by_co_planner_id?: string | null;
  vendor_id?: string | null;
}

export default function CoplannerMuse() {
  const session  = useCircleSession();
  const bride_id = brideId(session);
  const canAdd   = session.permissions?.can_contribute_muse === true;

  const [tiles, setTiles]     = useState<MuseTile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const load = async () => {
    try {
      const r = await fetch(
        `${API}/api/v2/circle/muse/${bride_id}?memberUserId=${session.user_id}`,
          { headers: circleAuthHeaders() }
      );
      // FORK B — one home. A 401 signs her out through the lane's single
      // refusal path; anything else falls through to this screen's own state.
      if (circleRefused(r)) { setLoading(false); return; }
      const d = await r.json();
      if (d.success) setTiles((d.data || []) as MuseTile[]);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [bride_id, session.user_id]);

  return (
    <>
      <p style={{
        fontFamily: FONT_EYEBROW, fontWeight: 200, fontSize: 9,
        letterSpacing: '0.32em', textTransform: 'uppercase',
        color: GOLD, margin: '0 0 12px',
      }}>MUSE</p>

      <h1 style={{
        fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 300,
        fontSize: 32, lineHeight: 1.15, color: CREAM,
        margin: '0 0 6px',
      }}>{brideName(session)}&rsquo;s board</h1>

      <p style={{
        fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
        color: MUTED, margin: '0 0 24px', lineHeight: 1.6,
      }}>{canAdd
        ? 'Browse what she’s saving. Share something new with the + below.'
        : 'You can browse her board. Share new ideas by chatting with her.'}
      </p>

      {loading && (
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: MUTED }}>Loading…</p>
      )}

      {!loading && tiles.length === 0 && (
        <div style={{ ...FROST_PANEL, padding: 24, textAlign: 'center' }}>
          <p style={{
            fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
            color: MUTED, margin: 0, lineHeight: 1.6,
          }}>
            {brideName(session)} hasn&rsquo;t saved anything yet.
            {canAdd ? ' Add the first idea?' : ''}
          </p>
        </div>
      )}

      {!loading && tiles.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
        }}>
          {tiles.map(t => (
            <a
              key={t.id}
              href={t.image_url}
              target="_blank"
              rel="noreferrer noopener"
              style={{
                position: 'relative', display: 'block',
                aspectRatio: '3 / 4',
                borderRadius: 12, overflow: 'hidden',
                border: `0.5px solid ${HAIRLINE}`,
                background: 'rgba(255,255,255,0.04)',
                textDecoration: 'none',
              }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.image_url}
                alt={t.note || (t.function_tag ? `Muse inspiration · ${t.function_tag}` : 'Muse inspiration')}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </a>
          ))}
        </div>
      )}

      {canAdd && (
        <button
          onClick={() => setSheetOpen(true)}
          aria-label="Add to board"
          style={{
            position: 'fixed',
            // ── F-14.10 · THE FAB HUNG OFF THE RIGHT EDGE ON EVERY REAL PHONE ──
            // This read `calc(50vw - 240px + 20px)`: centre the button against
            // the 480px content column (layout.tsx:126 — `maxWidth: 480, margin:
            // '0 auto'`) and inset it 20px from that column's right edge. Correct
            // ONLY while the viewport is WIDER than the column.
            //
            // Below 440px the expression goes NEGATIVE and `position: fixed`
            // resolves it against the VIEWPORT, not the column, so the button
            // walks off the screen:
            //     1200px →  +380px   fine
            //      480px →   +20px   the boundary
            //      374px →   −33px   33px of a 56px button, clipped
            //      360px →   −40px   worse
            // Every handset the co-planner is used on sits under 440px, so the
            // add control has been partially off-screen on every real device
            // while looking correct in a desktop browser — which is why it
            // survived. Founder-caught on his own phone, 2026-08-14.
            //
            // `max()` clamps the floor: under 440px it pins to a plain 20px
            // gutter; at and above 480px it is BYTE-FOR-BYTE the old behaviour,
            // so no wide-viewport rendering moves. The column-centring is kept
            // rather than replaced because it is right for the case it was
            // written for — it was simply missing its lower bound.
            //
            // THIS IS THE TREE'S ONLY SITE USING THIS TRICK (grep: one hit), so
            // there is no sibling to copy and none to fix alongside it. A second
            // one appearing is a second bug, not a pattern.
            right: 'max(20px, calc(50vw - 240px + 20px))',
            // `bottom` is UNTOUCHED and was already right: the TabBar is fixed
            // to bottom:0 with `paddingBottom: env(safe-area-inset-bottom)`, and
            // 80px clears it. Named so the next reader knows it was checked, not
            // skipped.
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)',
            width: 56, height: 56, borderRadius: '50%',
            background: GOLD, color: INK,
            border: 'none', cursor: 'pointer',
            fontSize: 28, fontWeight: 300,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            zIndex: 40,
          }}>+</button>
      )}

      {sheetOpen && (
        <AddMuseSheet
          onClose={() => setSheetOpen(false)}
          onSaved={() => { setSheetOpen(false); load(); }}
        />
      )}
    </>
  );
}
