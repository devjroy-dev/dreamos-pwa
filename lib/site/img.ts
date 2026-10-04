// lib/site/img.ts · WEB-5 · the site's one image file (charter item 3).
// Every photograph arrives as a Cloudinary url; the renderer sizes it by transform: 480, 960, 1600, 2200 wide,
// q_auto, f_auto (Cloudinary answers AVIF or WebP by the browser's Accept), her focal point as object-position.
// The low-quality placeholder is derived here from the same url (w_24, e_blur): for the first screen it is fetched
// on the server and inlined as a data url, so the cover's placeholder costs the phone no request.
// Mock mode: the rig's stub door answers the same path shape. Its host is accepted only when TDW_SITE_MOCK_IMG names it
// and NEVER on the live deploy (VERCEL_ENV production), where such a url is refused (R-46.16, the no-example cell).
// The rig runs production builds (next build, next start) because only they hydrate in the seat's container.
import type { Photo } from './card';

export const WIDTHS = [480, 960, 1600, 2200] as const;
const MARK = '/image/upload/';
const MOCK = process.env.VERCEL_ENV === 'production' ? '' : (process.env.TDW_SITE_MOCK_IMG || '');

export function sizable(url: string | null | undefined): boolean {
  if (typeof url !== 'string' || !url) return false;
  let u: URL; try { u = new URL(url); } catch { return false; }
  const okHost = u.protocol === 'https:' && u.hostname === 'res.cloudinary.com';
  const okMock = !!MOCK && u.host === MOCK && u.protocol === 'http:';
  return (okHost || okMock) && u.pathname.includes(MARK);
}
function chain(url: string, t: string): string {
  const i = url.indexOf(MARK); return url.slice(0, i + MARK.length) + t + '/' + url.slice(i + MARK.length);
}
/** An https photograph that is not Cloudinary's is sent at its original size (the chair's ruling, 30 Sept); any other
 *  url (http, data, a stub host outside mock mode) is refused and draws nothing. */
const plainHttps = (url: string | null | undefined): boolean => { try { return !!url && new URL(url).protocol === 'https:' && !sizable(url); } catch { return false; } };
/** The delivery url at a width; the original for a non-Cloudinary https photograph; '' for anything else. */
export const at = (url: string | null | undefined, w: number): string => sizable(url) ? chain(url as string, `c_limit,w_${w},q_auto,f_auto`) : plainHttps(url) ? (url as string) : '';
export const srcset = (url: string | null | undefined, ws: readonly number[] = WIDTHS): string => sizable(url) ? ws.map((w) => `${at(url, w)} ${w}w`).join(', ') : '';
export const lqUrl = (url: string | null | undefined): string => sizable(url) ? chain(url as string, 'w_24,e_blur:1000,q_auto,f_auto') : '';
/** Her focal point for the crop in use; the photograph's centre when none is set. */
export function pos(p: Photo | null | undefined, landscape = false): string {
  const f = (landscape ? p?.focal_landscape : p?.focal_portrait) || p?.focal_portrait || null;
  return f && Number.isFinite(f.x) && Number.isFinite(f.y) ? `${f.x}% ${f.y}%` : '50% 50%';
}
/** The 24 px placeholder inlined as a data url (first screen only). Falls back to the lq url on any failure. */
export async function lqData(url: string | null | undefined): Promise<string> {
  const u = lqUrl(url); if (!u) return '';
  try {
    const r = await fetch(u, { headers: { accept: 'image/webp,image/*' }, next: { revalidate: 86400 } });
    if (!r.ok) return u;
    const b = Buffer.from(await r.arrayBuffer()); const t = r.headers.get('content-type') || 'image/webp';
    return b.length && b.length < 4096 ? `data:${t};base64,${b.toString('base64')}` : u;
  } catch { return u; }
}
