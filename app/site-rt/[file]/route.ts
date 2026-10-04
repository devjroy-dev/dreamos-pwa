// app/site-rt/[file]/route.ts · WEB-5 · the site's one script (lib/site/rt.gen.ts), content-addressed, cached a year.
import { RT_JS, RT_SHA } from '@/lib/site/rt.gen';
import { gzipSync } from 'zlib';
const GZ = gzipSync(Buffer.from(RT_JS), { level: 9 });
export async function GET(req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  if (file !== `${RT_SHA}.js`) return new Response('Not found', { status: 404 });
  const gz = /\bgzip\b/.test(req.headers.get('accept-encoding') || '');
  return new Response((gz ? GZ : RT_JS) as BodyInit, { headers: { ...(gz ? { 'content-encoding': 'gzip' } : {}), vary: 'accept-encoding', 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'public, max-age=31536000, immutable', 'x-content-type-options': 'nosniff' } });
}
