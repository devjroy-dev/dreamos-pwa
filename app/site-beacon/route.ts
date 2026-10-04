// app/site-beacon/route.ts · WEB-5 · the site's two beacons, sent to its own address (no cross-origin request, no
// preflight: a vendor's own address is not on dream-os's CORS list) and passed on to WEB-4's doors
// (POST /api/v2/public/site/visit and /site/heart) with the visitor's forwarded address and user agent, which is how the
// door counts a visitor once a day (dream-os trusts the proxy chain: index.js `trust proxy`). Nothing is kept here.
// Always 204, like the doors themselves: a page learns nothing from it.
const API = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';
const KINDS = new Set(['visit', 'heart']);
export async function POST(req: Request) {
  try {
    const text = (await req.text()).slice(0, 2000); const b = JSON.parse(text) as Record<string, unknown>;
    const kind = String(b.kind || ''); if (!KINDS.has(kind)) return new Response(null, { status: 204 });
    const { kind: _k, ...body } = b; void _k;
    const fwd = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '').split(',')[0].trim();
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 3000);
    await fetch(`${API}/api/v2/public/site/${kind}`, { method: 'POST', signal: ctl.signal, cache: 'no-store',
      headers: { 'content-type': 'application/json', 'user-agent': req.headers.get('user-agent') || '', ...(fwd ? { 'x-forwarded-for': fwd } : {}) },
      body: JSON.stringify(body) }).catch(() => undefined);
    clearTimeout(t);
  } catch { /* a beacon never fails loudly */ }
  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}
