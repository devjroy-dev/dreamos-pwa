// lib/site/respond.ts · WEB-5 · how every page of the styles site leaves the server: compressed by its own route
// (next start does not compress a route handler's body; measured: Couture's document 70 KB on the wire, 15 KB gzipped),
// five minutes at the edge, her preview never stored.
import { brotliCompressSync, gzipSync, constants as Z } from 'zlib';
export function respond(req: Request, doc: string, preview: boolean): Response {
  const ae = req.headers.get('accept-encoding') || '';
  const enc = /\bbr\b/.test(ae) ? 'br' : /\bgzip\b/.test(ae) ? 'gzip' : '';
  const body = enc === 'br' ? brotliCompressSync(Buffer.from(doc), { params: { [Z.BROTLI_PARAM_QUALITY]: 6 } }) : enc === 'gzip' ? gzipSync(Buffer.from(doc), { level: 6 }) : doc;
  return new Response(body as BodyInit, { status: 200, headers: {
    ...(enc ? { 'content-encoding': enc } : {}), vary: 'accept-encoding', 'content-type': 'text/html; charset=utf-8',
    'cache-control': preview ? 'no-store' : 'public, s-maxage=300, stale-while-revalidate=86400',
    'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin' } });
}
