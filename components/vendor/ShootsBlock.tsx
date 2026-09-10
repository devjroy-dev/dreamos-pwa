'use client';
// components/vendor/ShootsBlock.tsx
// CE-42 · SEAT R7 · 4c-1 — G5.2 THE SHOOT BOARD, INSIDE REFERRALS & PARTNERS
// (R-42.8, ruling F). Frames S1-room / S1-empty, docs/mocks/shoot-board-mock.html.
//
// ── ONE GLASS PER ACT (ruling 3(ii)) ──────────────────────────────────────────
// It reads the Collab room's OWN doors through `?kind=shoot` — the server answers
// shoots here and never in Collab, so no act has two glasses. Interested / Pass are
// the Collab door's verbs (`POST /collab/:id/respond`); casting is the post's own
// interior (`/vendor/collab/[post_id]/responses` → Connect), reached by a row tap —
// the same tree-aware push the Collab room uses for its own rows.
//
// ── HER CRAFT IS INKED, AND IT IS WHAT SHE OFFERS FOR ───────────────────────
// `GET /api/v2/vendor/me` gives her category (the feed never names which item
// matched her). Interested sends `item_id` of the first open item in her craft —
// the respond door's own optional field (collab.js, tolerated since 0096) — so the
// poster sees WHICH role she offered for rather than inferring it at Connect.
//
// Words: the seven vetoed in lib/worklist/shoots.ts; every other byte is the Collab
// room's (`Interested`, `Pass`, the poster line, the date and type formats).
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getJson, postJson } from '@/lib/vendor/api/_base';
import { fetchMe } from '@/lib/vendor/api/vendor';
import { API } from '@/lib/solutions/routes';
import { labelFor } from '@/lib/frost/categoryLabels';
import { fmtDate, fmtType, postedBy } from '@/lib/vendor/collabFormat';
import { SHOOTS, castLine } from '@/lib/worklist/shoots';
import { CollabPostForm } from '@/components/vendor/CollabPostForm';

interface Item { id: string | null; requirement_type: string; note: string | null; filled_by_response_id: string | null }
interface Shoot {
  id: string; event_type: string | null; event_date: string; city: string; details: string | null;
  items: Item[]; poster_category?: string; posted_ago?: string;
}

export function ShootsBlock() {
  const router = useRouter();
  const [open, setOpen]       = useState<Shoot[]>([]);
  const [mine, setMine]       = useState<Shoot[]>([]);
  const [craft, setCraft]     = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [busy, setBusy]       = useState<string | null>(null);

  const load = useCallback(async () => {
    const [f, m] = await Promise.all([
      getJson<{ ok: boolean; feed: Shoot[] }>(API.collabFeed('shoot')).catch(() => null),
      getJson<{ ok: boolean; posts: Shoot[] }>(API.collabMyPosts('shoot')).catch(() => null),
    ]);
    if (f?.ok) setOpen(f.feed);
    if (m?.ok) setMine(m.posts);
  }, []);
  useEffect(() => {
    void load();
    fetchMe().then(r => setCraft(r?.vendor?.category ?? null)).catch(() => { /* ink nothing rather than guess */ });
  }, [load]);

  async function respond(s: Shoot, action: 'interested' | 'passed') {
    setBusy(s.id);
    try {
      const mineItem = s.items.find(i => i.id && !i.filled_by_response_id && i.requirement_type === craft);
      await postJson(API.collabRespond(s.id), action === 'interested' && mineItem ? { action, item_id: mineItem.id } : { action });
      setOpen(prev => prev.filter(p => p.id !== s.id));   // the Collab room's own behaviour on respond
    } catch { /* silent, as the Collab card is */ }
    finally { setBusy(null); }
  }

  const detail = (s: Shoot) => [s.event_type ? fmtType(s.event_type) : null, fmtDate(s.event_date), s.city].filter(Boolean).join(' \u00B7 ');
  const roleText = (i: Item) => (i.note ? `${labelFor(i.requirement_type)} \u00B7 ${i.note}` : labelFor(i.requirement_type));

  return (
    <div className="sh-block">
      <div className="sh-head">
        <span className="sh-title">{SHOOTS.sectionTitle}</span>
        <button type="button" className="sh-act" onClick={() => setPosting(true)}>{SHOOTS.postAction}</button>
      </div>

      {open.length === 0 && mine.length === 0 ? (
        <p className="sh-none">{SHOOTS.none}</p>
      ) : null}

      {open.length > 0 ? (
        <>
          <div className="rf-sec">{SHOOTS.openToYou}<span>{open.length}</span></div>
          {open.map(s => (
            <div className="sh-card" key={s.id}>
              {s.details ? <span className="rf-rprimary">{s.details}</span> : null}
              <span className="sh-detail">{detail(s)}</span>
              <div className="sh-roles">
                {s.items.map((i, n) => (
                  <span key={i.id ?? n} className={'sh-role' + (craft && i.requirement_type === craft ? ' you' : '')}>{roleText(i)}</span>
                ))}
              </div>
              {s.poster_category ? <span className="sh-detail sh-by">{postedBy(s.poster_category, s.posted_ago ?? '')}</span> : null}
              <div className="sh-acts">
                <button type="button" className="sh-go" disabled={busy === s.id} onClick={() => void respond(s, 'interested')}>Interested</button>
                <button type="button" className="sh-ghost" disabled={busy === s.id} onClick={() => void respond(s, 'passed')}>Pass</button>
              </div>
            </div>
          ))}
        </>
      ) : null}

      {mine.length > 0 ? (
        <>
          <div className="rf-sec sh-gap">{SHOOTS.yourShoots}<span>{mine.length}</span></div>
          {mine.map(s => {
            const filled = s.items.filter(i => i.filled_by_response_id).length;
            return (
              <button type="button" className="rf-row" key={s.id}
                onClick={() => router.push(('/vendor/collab/') + s.id + '/responses')}>
                <span>
                  <span className="rf-rprimary">{s.details || detail(s)}</span>
                  {s.details ? <span className="sh-detail">{detail(s)}</span> : null}
                </span>
                <span className="rf-rstate">{castLine(filled, s.items.length)}</span>
              </button>
            );
          })}
        </>
      ) : null}

      {posting ? (
        <CollabPostForm kind="shoot" onClose={() => setPosting(false)}
          onSuccess={() => { setPosting(false); void load(); }} />
      ) : null}

      <style>{SHOOTS_CSS}</style>
    </div>
  );
}

// Tokens only (R-42.6). `.rf-sec`, `.rf-row`, `.rf-rprimary`, `.rf-rstate` are the room's
// own rules (referrals/page.tsx) and are read, not restated. `.sh-detail` exists because
// `.rf-rdetail` upper-cases, and a date or a vendor's note must not be shouted.
// NO BACKTICKS IN THIS BLOCK — it is a template literal.
const SHOOTS_CSS = `
.sh-block{margin-top:22px;padding-top:16px;border-top:.5px solid var(--atelier-card-border)}
.sh-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px}
.sh-title{font:var(--wl-t2);color:var(--atelier-ink)}
.sh-act{font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-accent-text);
        background:transparent;border:none;padding:10px 0;min-height:44px;cursor:pointer}
.sh-none{font:var(--wl-t3);color:var(--atelier-ink-mute);margin:0}
.sh-card{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;
         padding:13px 14px;margin-bottom:var(--wl-step)}
.sh-detail{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:3px;font-variant-numeric:lining-nums tabular-nums}
.sh-by{margin-top:10px}
.sh-roles{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.sh-role{font:var(--wl-t5);color:var(--atelier-ink-soft);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:5px 8px}
.sh-role.you{color:var(--atelier-accent-text);border-color:var(--atelier-input-border)}
.sh-acts{display:flex;gap:8px;margin-top:12px}
.sh-go,.sh-ghost{flex:1;min-height:44px;display:flex;align-items:center;justify-content:center;border-radius:3px;
                 font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;background:transparent;cursor:pointer}
.sh-go{border:.5px solid var(--atelier-input-border);color:var(--atelier-accent-text)}
.sh-ghost{border:.5px solid var(--atelier-card-border);color:var(--atelier-ink-mute)}
.sh-go:disabled,.sh-ghost:disabled{opacity:.5;cursor:not-allowed}
.sh-act:focus-visible,.sh-go:focus-visible,.sh-ghost:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.sh-gap{margin-top:14px}
`;
