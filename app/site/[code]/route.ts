// app/site/[code]/route.ts · WEB-5 · a styles vendor's site, drawn on the server as one document (CE-47 ruling B).
// Reached only by the proxy's rewrite (middleware.ts): /v/<code>, or her own address, for a vendor whose site kind is
// 'styles'. Every other vendor keeps today's classic page, byte for byte.
// A card that is not (or no longer) a styles card is sent back to the classic page with the proxy told to keep it
// there (?_tdw=classic); that is the at most five-minute edge after a plan change.
import { fetchCard, isStyles } from '@/lib/site/card';
import { siteDocument } from '@/lib/site/doc';
import { publicUrlFor } from '@/lib/public/vendorHost';
import { stripMetaPlaceholder } from '@/lib/public/metaPlaceholder';
import { respond } from '@/lib/site/respond';

const API = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';
const SITE_BASE = process.env.NEXT_PUBLIC_SITE_BASE ?? 'https://thedreamwedding.in';

export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code: raw } = await ctx.params; const code = stripMetaPlaceholder(decodeURIComponent(raw));
  const u = new URL(req.url); const pv = u.searchParams.get('preview'); const preview = !!pv; const pvq = pv ? { token: pv, style: u.searchParams.get('style') } : null;
  const card = await fetchCard(code, pvq);
  if (!isStyles(card)) return Response.redirect(new URL(`/v/${encodeURIComponent(code)}?_tdw=classic${pv ? `&preview=${encodeURIComponent(pv)}` : ''}`, u), 307);
  const fd = process.env.TDW_SITE_FONT_DISPLAY; const display = fd === 'optional' || fd === 'swap' ? fd : 'mixed';   // the founder's ruling (1 Oct): mixed
  const doc = await siteDocument(card, { code: card.handle || code, base: publicUrlFor(card.handle || code, SITE_BASE).replace(/\/+$/, ''), api: API, display, preview });
  if (!doc) return Response.redirect(new URL(`/v/${encodeURIComponent(code)}?_tdw=classic${pv ? `&preview=${encodeURIComponent(pv)}` : ''}`, u), 307);
  return respond(req, doc, preview);
}
