// app/c/[handle]/page.tsx · CE-47 · HUB-2 · THE COLLAB HUB PAGE ANYONE CAN OPEN (approved picture 4, 7 Oct 2026).
// thedreamwedding.in/c/<handle>, signed out, outside the vendor shell. It reads GET /api/v2/public/hub/:handle (HUB-1),
// which holds no phone, no email and no ids. Shows: the name, roles, city, Instagram and website as links, "Open to",
// up to 12 TDW-hosted photos, and the "Worked with" lines, every name a link to that person's page. Then the server's own
// closing line. No check label anywhere (CE-47, 7 Oct 2026: nothing stands behind one yet).
// A miss (no page, or a blocked partner's) renders one neutral sentence on the same ground, with no status code shown:
// app/v/[code]'s rule (F-19.19), copied rather than a framework 404.
// Not indexed by search engines until the founder rules on it: a person's page found by Google is his call, not ours.
import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { GRAPHITE, CHALK, prefixFor, typeCss, type TokenKey } from '@/v2/lib/worklist/theme';
import { labelFor } from '@/lib/frost/categoryLabels';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'block' });
const brand = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';

interface PubCard {
  handle: string; name: string; kind: string; roles: string[]; city: string | null; open_to_words: string[];
  instagram: { handle: string; url: string } | null; website: { url: string } | null; page_url: string; work: string[];
}
interface PubLine { shoot: string; city: string | null; month: string; from_call: boolean; with: { name: string; page_url: string }[] }
interface PubPage { page: PubCard; worked_with: PubLine[]; line: string }

const HANDLE = /^[a-z0-9._]{1,30}$/;
async function fetchPage(raw: string): Promise<PubPage | null> {
  const h = String(raw || '').trim().toLowerCase().replace(/^@/, '');
  if (!HANDLE.test(h)) return null;
  try {
    const res = await fetch(`${API_BASE}/api/v2/public/hub/${encodeURIComponent(h)}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const body = await res.json();
    return body && body.ok && body.page ? (body as PubPage) : null;
  } catch { return null; }
}

/** Links leave as https only, in a new tab, with no opener and no referrer. */
function out(url: string | null | undefined) {
  const u = String(url || '');
  return /^https:\/\/[^\s]+$/i.test(u) ? { href: u, target: '_blank' as const, rel: 'noopener noreferrer' } : null;
}
const siteWords = (u: string) => u.replace(/^https:\/\//i, '').replace(/\/$/, '');
const roleWords = (r: string) => labelFor(r);   // the eleven display labels, one home (the People tab reads the same)

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const p = await fetchPage(handle);
  return {
    title: p ? `${p.page.name} · Collab Hub · The Dream Wedding` : 'Collab Hub · The Dream Wedding',
    robots: { index: false, follow: false },
  };
}

const vars = (m: Record<TokenKey, string>) => (Object.keys(m) as TokenKey[]).map((k) => `${prefixFor(k)}:${m[k]};`).join('');
const PAGE_CSS = `
:root{--font-inter:${inter.style.fontFamily};--font-brand:${brand.style.fontFamily}}
.hubpub{${vars(CHALK)}}
@media (prefers-color-scheme: dark){.hubpub{${vars(GRAPHITE)}}}
${typeCss('.hubpub')}
.hubpub{min-height:100dvh;background:var(--atelier-page-bg);color:var(--atelier-ink);font:var(--wl-t3)}
.hubpub *{box-sizing:border-box}
.hp-hdr{padding:12px 16px;background:var(--atelier-header-bg);border-bottom:1px solid var(--atelier-card-border)}
.hp-house{font:500 1.0625rem/1.2 var(--font-brand), Georgia, serif;color:var(--atelier-ink);text-decoration:none}
.hp-lbl{display:block;font:var(--wl-t5);color:var(--atelier-label)}
.hp-wrap{max-width:640px;margin:0 auto;padding:12px 16px 32px}
.hp-name{margin:12px 0 4px;font:var(--wl-t1)}
.hp-facts{font:var(--wl-t4);color:var(--atelier-ink-dim)}
.hp-links{display:flex;flex-wrap:wrap;gap:4px 16px;margin:12px 0 8px;font:var(--wl-t4)}
.hubpub a{color:var(--atelier-accent-text);text-decoration:underline;text-underline-offset:3px}
.hubpub a:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.hp-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:12px 0}
.hp-tiles img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:8px;background:var(--atelier-card-bg);display:block}
.hp-h{margin:20px 0 8px;font:var(--wl-t2)}
.hp-card{background:var(--atelier-card-bg);border:1px solid var(--atelier-card-border);border-radius:12px;padding:14px 16px}
.hp-row{padding:12px 0;border-top:1px solid var(--atelier-card-border)}
.hp-row:first-child{border-top:0;padding-top:0}.hp-row:last-child{padding-bottom:0}
.hp-shoot{font:var(--wl-tn)}
.hp-note{margin:12px 0 0;font:var(--wl-t4);color:var(--atelier-ink-dim)}
`;

function Frame({ children }: { children: React.ReactNode }) {
  const home = out('https://thedreamwedding.in');
  return (
    <main className="hubpub" data-hub-public="">
      <style>{PAGE_CSS}</style>
      <header className="hp-hdr">
        {home && <a {...home} className="hp-house">The Dream Wedding</a>}
        <span className="hp-lbl">Collab Hub</span>
      </header>
      <div className="hp-wrap">{children}</div>
    </main>
  );
}

export default async function HubPublicPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const data = await fetchPage(handle);
  if (!data) return <Frame><p className="hp-note" data-hub-public-miss="">There is no Collab Hub page at this address.</p></Frame>;
  const { page: p, worked_with: lines, line } = data;
  const ig = p.instagram ? out(p.instagram.url) : null;
  const web = p.website ? out(p.website.url) : null;
  const n = new Set(lines.flatMap((l) => l.with.map((w) => w.page_url))).size;
  return (
    <Frame>
      <h1 className="hp-name">{p.name}</h1>
      <div className="hp-facts">{[p.roles.map(roleWords).join(', '), p.city].filter(Boolean).join(' · ')}</div>
      {(ig || web) && (
        <div className="hp-links">
          {ig && p.instagram && <a {...ig}>{`Instagram ${p.instagram.handle}`}</a>}
          {web && p.website && <a {...web}>{siteWords(p.website.url)}</a>}
        </div>)}
      {p.open_to_words.length > 0 && <div className="hp-facts">{`Open to: ${p.open_to_words.join(' · ')}`}</div>}
      {p.work.length > 0 && (
        <div className="hp-tiles">
          {p.work.filter((u) => /^https:\/\/res\.cloudinary\.com\//.test(u)).slice(0, 12).map((u) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={u} src={u} alt={`Work by ${p.name}`} loading="lazy" />))}
        </div>)}
      {lines.length > 0 && (
        <>
          <h2 className="hp-h">{`Worked with · ${n}`}</h2>
          <div className="hp-card">
            {lines.map((l, i) => (
              <div key={i} className="hp-row">
                <div className="hp-shoot">{[l.shoot, l.city, l.month].filter(Boolean).join(' · ')}</div>
                <div className="hp-facts">With{' '}
                  {l.with.map((w, j) => { const lp = out(w.page_url);
                    return <span key={w.page_url}>{j > 0 ? ', ' : ''}{lp ? <a {...lp}>{w.name}</a> : w.name}</span>; })}
                  {l.from_call ? ' · a call on TDW' : ''}
                </div>
              </div>))}
          </div>
        </>)}
      <p className="hp-note">{line}</p>
    </Frame>
  );
}
