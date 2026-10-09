"use client";
// app/v/[code]/kit/view.tsx · CE-47 · PRO · P3 · her media kit as the visitor's browser draws it, from the public kit door
// (dream-os src/api/public/kit.js), field by named field. Light and dark by the visitor's own setting. No sign-in.
// R-47.1: every sentence is simple, formal and complete, with one idea in it.
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/vendor/api/_base';

export type Kit = { name: string; trade: string; city: string | null; code: string; photos: { image_url: string; caption: string | null }[]; weddings: number | null;
  followers: number | null; followers_on: string | null; words: { body: string; author: string; place: string | null }[];
  contact: { email: string | null; email_link: string | null; instagram_url: string | null }; footer: string[] };
const enIn = (n: number) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
const https = (u: string | null | undefined) => (u && /^https:\/\//.test(u) ? u : null);

export function KitView({ code }: { code: string }) {
  const [s, setS] = useState<{ v: 'wait' } | { v: 'ok'; k: Kit } | { v: 'no'; error: string }>({ v: 'wait' });
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/v2/public/kit/${encodeURIComponent(code)}`);
        const j = await r.json().catch(() => null);
        if (!live) return;
        if (r.ok && j && j.kit && typeof j.kit.name === 'string') setS({ v: 'ok', k: j.kit as Kit });
        else setS({ v: 'no', error: (j && j.error) || 'This media kit is not available.' });
      } catch { if (live) setS({ v: 'no', error: 'TDW could not open this media kit just now. Please try again.' }); }
    })();
    return () => { live = false; };
  }, [code]);
  if (s.v !== 'ok') return (<main className="kt" data-kit={s.v}><div className="kt-in">
    <div className="kt-eyebrow">Media kit</div>
    {s.v === 'wait' ? <p className="kt-lede">Opening the media kit{'\u2026'}</p> : <p className="kt-lede" data-kit-none="">{s.error}</p>}
  </div><style>{KT_CSS}</style></main>);
  const k = s.k;
  const photos = (Array.isArray(k.photos) ? k.photos : []).filter((p) => https(p.image_url));
  const words = Array.isArray(k.words) ? k.words : [];
  const rows: [string, string][] = [['Trade', k.trade]];
  if (k.city) rows.push(['City', k.city]);
  if (k.weddings != null && k.weddings > 0) rows.push(['Weddings on TDW', `${enIn(k.weddings)}, verified by TDW`]);
  if (k.followers != null) rows.push(['Instagram followers', enIn(k.followers)]);
  const mail = k.contact && k.contact.email_link && /^mailto:/.test(k.contact.email_link) ? k.contact.email_link : null;
  const ig = k.contact ? https(k.contact.instagram_url) : null;
  return (
    <main className="kt" data-kit={k.code}>
      <a className="kt-back" href={`/v/${encodeURIComponent(k.code)}`}>{'‹'} Back</a>
      {photos[0] ? (/* eslint-disable-next-line @next/next/no-img-element */ <img className="kt-hero" src={photos[0].image_url} alt={photos[0].caption || `Work by ${k.name}`} />) : null}
      <div className="kt-in">
        <div className="kt-eyebrow">Media kit</div>
        <h1 className="kt-name">{k.name}</h1>
        <p className="kt-lede">This media kit is for brands. It shows the work of {k.name}, the figures TDW keeps and how to reach {k.name}. TDW updates the figures by itself.</p>
        <h2 className="kt-h">At a glance</h2>
        <dl className="kt-rows">{rows.map(([a, b]) => (<div key={a} className="kt-row"><dt>{a}</dt><dd>{b}</dd></div>))}</dl>
        {photos.length > 1 ? (<>
          <h2 className="kt-h">Work</h2>
          <div className="kt-grid">{photos.slice(1).map((p) => (/* eslint-disable-next-line @next/next/no-img-element */ <img key={p.image_url} src={p.image_url} alt={p.caption || `Work by ${k.name}`} loading="lazy" />))}</div>
        </>) : null}
        {words.length ? (<>
          <h2 className="kt-h">What clients say</h2>
          {words.map((w) => (<figure key={w.author + w.body.slice(0, 20)} className="kt-quote"><blockquote>{w.body}</blockquote><figcaption>{w.author}{w.place ? ` · ${w.place}` : ''}</figcaption></figure>))}
        </>) : null}
        {mail || ig ? (<div className="kt-ctas">
          {mail ? <a className="kt-cta solid" href={mail} data-kit-email="">Email about a collaboration</a> : null}
          {ig ? <a className="kt-cta" href={ig} target="_blank" rel="noopener noreferrer" data-kit-ig="">Message on Instagram</a> : null}
        </div>) : <p className="kt-foot">{k.name} has not added a way for brands to write yet.</p>}
        {(Array.isArray(k.footer) ? k.footer : []).map((f) => <p key={f} className="kt-foot" data-kit-foot="">{f}</p>)}
        <p className="kt-foot">This page is made by The Dream Wedding. TDW takes no fee from any collaboration.</p>
      </div>
      <style>{KT_CSS}</style>
    </main>
  );
}


const KT_CSS = `
.kt{--kt-bg:#faf9f7;--kt-ink:#141414;--kt-mute:#6b6b6b;--kt-line:#e2e0dc;background:var(--kt-bg);color:var(--kt-ink);min-height:100vh;max-width:640px;margin:0 auto;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;overflow-x:hidden}
@media (prefers-color-scheme: dark){.kt{--kt-bg:#141414;--kt-ink:#f3f1ed;--kt-mute:#a6a29b;--kt-line:#2f2d2a}}
.kt-back{display:inline-flex;align-items:center;min-height:56px;padding:0 20px;color:var(--kt-ink);text-decoration:none;letter-spacing:.12em;text-transform:uppercase;font-size:14px}
.kt-hero{display:block;width:100%;aspect-ratio:3/4;object-fit:cover}
.kt-in{padding:24px 20px 48px}
.kt-eyebrow{margin:0 0 8px;letter-spacing:.14em;text-transform:uppercase;font-size:13px;color:var(--kt-mute)}
.kt-name{margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:40px;line-height:1.1}
.kt-lede{margin:0 0 28px;font-size:17px;line-height:1.6;color:var(--kt-mute)}
.kt-h{margin:28px 0 8px;letter-spacing:.14em;text-transform:uppercase;font-size:13px;font-weight:500}
.kt-rows{margin:0}
.kt-row{display:flex;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid var(--kt-line);font-size:17px}
.kt-row dt{color:var(--kt-ink)}.kt-row dd{margin:0;text-align:right;font-weight:500}
.kt-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.kt-grid img{width:100%;aspect-ratio:3/4;object-fit:cover;display:block}
.kt-quote{margin:0 0 20px}
.kt-quote blockquote{margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:20px;line-height:1.45}
.kt-quote figcaption{letter-spacing:.1em;text-transform:uppercase;font-size:13px;color:var(--kt-mute)}
.kt-ctas{display:flex;flex-direction:column;gap:12px;margin:28px 0 20px}
.kt-cta{display:flex;align-items:center;justify-content:center;min-height:56px;border:1px solid var(--kt-ink);color:var(--kt-ink);text-decoration:none;font-size:17px}
.kt-cta.solid{background:var(--kt-ink);color:var(--kt-bg)}
.kt-foot{margin:0 0 8px;font-size:15px;line-height:1.6;color:var(--kt-mute)}
`;
