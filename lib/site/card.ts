// lib/site/card.ts · WEB-5 · the public card as the styles renderer reads it.
// Names are WEB-4's (cut 3, accepted in shape by CE-47): the renderer never decides a price, a tier or a colour;
// it draws what arrives. Until cut 3 lands, the rig's stub door serves a fixture in this shape.
// Fields this file reads that cut 3 must carry are listed in the seat's notes to the chair.
export type Focal = { x: number; y: number };
export type Photo = { url: string; w?: number | null; h?: number | null; focal_portrait?: Focal | null; focal_landscape?: Focal | null; caption?: string | null; alt?: string | null };
export type Palette = { id: string; custom?: boolean; roles: Record<string, string>; extras?: Record<string, string> };
export type Section = { key: string; variant?: string | null; eyebrow?: string | null; heading?: string | null; body?: Record<string, unknown> | null };
export type CoverSlide = { photo: Photo | null; eyebrow?: string | null; headline?: string | null; emphasis?: string | null; button?: string | null; target?: { kind: 'look' | 'collection' | 'category' | 'section'; ref: string } | null };
export type Seo = { title?: string | null; description?: string | null; image?: string | null; canonical?: string | null };
export type Site = {
  v: 'classic' | 'styles'; style: string; site_name: string | null; monogram: string | null;
  palette: Palette; fonts: { id: string; display: string; text: string } | null;
  motion: 'calm' | 'lively' | 'cinematic'; corners: string; buttons: string; texture: string; cover_mode: 'slideshow' | 'still';
  cover?: CoverSlide[] | null; pages?: unknown;
  sections: Section[]; trade: { items: string; item: string; request: string };
  copy: Record<string, unknown>; credit: boolean; domain: string | null; seo?: Seo | null;
};
export type LookSummary = { slug: string; title: string; category?: string | null; year_label?: string | null; from_price?: string | null; is_new?: boolean; cover: Photo | null; photo_count?: number; has_video?: boolean; video_duration_s?: number | null;
  /** asked of WEB-4's next cut (CE-47): the second photograph; the fixture carries it until then. */ second?: Photo | null };
export type Collection = { slug: string; name: string; description?: string | null; cover: Photo | null; look_slugs: string[] };
export type Testimonial = { words?: string | null; name?: string | null; occasion?: string | null; place?: string | null; month?: string | null; video?: { url: string; duration_s?: number | null; title?: string | null; poster?: string | null } | null };
export type Faq = { question: string; answer: string };
export type Pkg = { name: string | null; description: string | null; total: number | null; items: { label: string | null; detail: string | null }[] };
export type SiteCard = {
  business_name: string | null; category: string | null; city: string | null; handle: string | null;
  enquire_link: string | null; date_check_enabled: boolean; starting_price: number | null; packages: Pkg[];
  meta?: { title: string | null; description: string | null } | null;
  site: Site; looks?: LookSummary[]; collections?: Collection[]; testimonials?: Testimonial[]; faq?: Faq[];
  eliza?: { live_booking?: string; own_voice?: string } | null; date_check_enabled_note?: never;
  instagram_handle?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';
export type Preview = { token: string; style?: string | null } | null;
/** ?preview=<token>&style=<id> as WEB-4's cut 5 reads them (her draft, or a style she is trying, for WEB-6's preview). */
export const previewQuery = (p: Preview): string => (p ? `?preview=${encodeURIComponent(p.token)}${p.style ? `&style=${encodeURIComponent(p.style)}` : ''}` : '');
/** Five minutes, the same as the classic page's revalidate; her preview is fetched uncached, every time. */
export async function fetchCard(code: string, preview: Preview = null): Promise<SiteCard | null> {
  try {
    const r = await fetch(`${API_BASE}/api/v2/public/vendor-card/${encodeURIComponent(code)}${previewQuery(preview)}`, preview ? { cache: 'no-store' } : { next: { revalidate: 300 } });
    if (!r.ok) return null;
    const j = await r.json();
    return j && j.ok && j.card ? (j.card as SiteCard) : null;
  } catch { return null; }
}
export const isStyles = (c: SiteCard | null): c is SiteCard => !!c && !!c.site && c.site.v === 'styles';
