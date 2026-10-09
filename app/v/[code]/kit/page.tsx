// app/v/[code]/kit/page.tsx · CE-47 · PRO · P3 · HER MEDIA KIT (thedreamwedding.in/v/<code>/kit), public, for brands.
// It shows her name, trade and city, her approved photographs, the weddings TDW verified, her Instagram follower count
// as TDW last read it, client words she approved, and how a brand can reach her (the email she chose, and her
// Instagram). The door (dream-os src/api/public/kit.js) builds every field by name; nothing else reaches this page.
// This path is not one the styles switch rewrites (middleware.ts), so every vendor's kit is drawn here, in one look.
// Not listed by search engines: she shares the link with the brands she chooses.
// R-47.1: every sentence is simple, formal and complete, with one idea in it.
import type { Metadata } from 'next';
import { KitView } from './view';

const API = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';
export const revalidate = 300;
// The figures are drawn by the visitor's own browser (KitView), as the check page does; the server reads the kit only for
// the page's title.

type Kit = { name: string; trade: string; city: string | null; code: string; photos: { image_url: string; caption: string | null }[]; weddings: number | null;
  followers: number | null; followers_on: string | null; words: { body: string; author: string; place: string | null }[];
  contact: { email: string | null; email_link: string | null; instagram_url: string | null }; footer: string[] };

async function getKit(code: string): Promise<Kit | null> {
  try {
    const r = await fetch(`${API}/api/v2/public/kit/${encodeURIComponent(code)}`, { next: { revalidate: 300 } });
    if (!r.ok) return null;
    const j = await r.json();
    const k = (j && (j.data ? j.data.kit : j.kit)) as Kit | undefined;
    return k && typeof k.name === 'string' ? k : null;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params; const k = await getKit(decodeURIComponent(code));
  return { title: k ? `${k.name} · Media kit · The Dream Wedding` : 'Media kit · The Dream Wedding', robots: { index: false, follow: false } };
}

export default async function KitPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <KitView code={decodeURIComponent(code)} />;
}
