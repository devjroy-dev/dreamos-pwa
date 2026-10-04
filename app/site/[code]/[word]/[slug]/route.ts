// app/site/[code]/[word]/[slug]/route.ts · WEB-5 · a look's own page on a styles site (CE-46 Q4, Q6): its address is her
// trade word (looks, work, acts, events); any other of the four answers 308 to hers. A miss, or a card that is not a
// styles card, goes to the classic answer for her home.
import { fetchCard, isStyles } from '@/lib/site/card';
import { fetchLook } from '@/lib/site/look';
import { lookDocument } from '@/lib/site/doc';
import { respond } from '@/lib/site/respond';
import { publicUrlFor } from '@/lib/public/vendorHost';
import { stripMetaPlaceholder } from '@/lib/public/metaPlaceholder';

const API = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';
const SITE_BASE = process.env.NEXT_PUBLIC_SITE_BASE ?? 'https://thedreamwedding.in';

export async function GET(req: Request, ctx: { params: Promise<{ code: string; word: string; slug: string }> }) {
  const p = await ctx.params; const code = stripMetaPlaceholder(decodeURIComponent(p.code)); const slug = decodeURIComponent(p.slug);
  const u = new URL(req.url); const pv = u.searchParams.get('preview'); const preview = !!pv; const pvq = pv ? { token: pv, style: u.searchParams.get('style') } : null;
  const card = await fetchCard(code, pvq);
  if (!isStyles(card)) return Response.redirect(new URL(`/v/${encodeURIComponent(code)}?_tdw=classic${pv ? `&preview=${encodeURIComponent(pv)}` : ''}`, u), 307);
  const base = publicUrlFor(card.handle || code, SITE_BASE).replace(/\/+$/, ''); const word = card.site.trade.items.toLowerCase();
  const asked = p.word;
  if (asked === 'collections') return Response.redirect(base, 307);   // a collection's own page: not in this package (named in the note)
  if (asked !== word) return Response.redirect(`${base}/${word}/${encodeURIComponent(slug)}`, 308);
  const look = await fetchLook(card.handle || code, slug, pvq);
  if (!look) return Response.redirect(base, 307);
  const fd = process.env.TDW_SITE_FONT_DISPLAY; const display = fd === 'optional' || fd === 'swap' ? fd : 'mixed';   // the founder's ruling (1 Oct): mixed
  const doc = await lookDocument(card, look, { code: card.handle || code, base, api: API, display, preview, vendorHref: (h) => publicUrlFor(h, SITE_BASE) });
  if (!doc) return Response.redirect(base, 307);
  return respond(req, doc, preview);
}
