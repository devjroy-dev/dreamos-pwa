"use client";
// components/worklist/GetFoundCard.tsx · DESIGN-1 · STAGE 3 · THE GET FOUND CARD (lib/worklist/getFound.ts).
// Last on Home, after Money due: quiet, one at a time, and only when a read says a Get found room is not set up.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJson } from '@/lib/vendor/api/_base';
import { API } from '@/v2/lib/solutions/routes';
import { GET_FOUND, GET_FOUND_WORDS as W, notSetUp, pickCard, readHidden, hide, type GetFoundKey } from '@/v2/lib/worklist/getFound';

export function GetFoundCard() {
  const [k, setK] = useState<GetFoundKey | null>(null);
  useEffect(() => {
    let live = true;
    const soft = (p: string) => getJson<unknown>(p).catch(() => null);
    Promise.all([soft('/api/v2/vendor/me'), soft(API.googleReviews()), soft('/api/v2/vendor/ig/status')]).then(([me, rv, ig]) => {
      if (live) setK(pickCard(notSetUp(me, rv, ig), readHidden()));
    });
    return () => { live = false; };
  }, []);
  if (!k) return null;
  const c = GET_FOUND[k];
  return (
    <section className="wl-home-sec wl-gf" aria-label={W.eyebrow} data-get-found={k}>
      <style>{GF_CSS}</style>
      <div className="wl-gf-card">
        <p className="wl-gf-eyebrow">{W.eyebrow}</p>
        <p className="wl-gf-line">{c.line}</p>
        <div className="wl-gf-acts">
          <Link className="wl-gf-go" href={c.href}>{c.act}</Link>
          <button type="button" className="wl-gf-hide" onClick={() => { hide(k); setK(null); }}>{W.hide}</button>
        </div>
      </div>
    </section>
  );
}

const GF_CSS = `
.wl-gf-card{border:1px solid var(--atelier-card-border);border-radius:12px;padding:16px;background:var(--atelier-card-bg)}
.wl-gf-eyebrow{margin:0 0 4px;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.wl-gf-line{margin:0 0 12px;font:var(--wl-tb);color:var(--atelier-ink)}
.wl-gf-acts{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.wl-gf-go{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:12px;border:1px solid var(--atelier-accent-text);color:var(--atelier-accent-text);text-decoration:none;font:var(--wl-tb);touch-action:manipulation}
.wl-gf-go:active,.wl-gf-hide:active{background:var(--atelier-row-hover)}
.wl-gf-hide{min-height:44px;padding:0 16px;border:0;border-radius:12px;background:transparent;color:var(--atelier-ink-mute);font:var(--wl-tb);touch-action:manipulation}
.wl-gf-go:focus-visible,.wl-gf-hide:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
