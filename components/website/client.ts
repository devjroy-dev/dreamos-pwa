// components/website/client.ts · CE-47 · WEB-6 · b172 · THE CUSTOMISER'S DOORS, AS LANDED.
//
// dream-os a0bfe02 (WEB-4 cuts 3 and 4), src/api/vendor/solutions/siteRoom.js, under /api/v2/vendor/solutions/site.
// Every answer is { ok: true, ...payload }. The tier never reaches this client: the room reads `resolved.can`.
// THE DRAFT (WEB-4 cut 5, CE-47's names): PATCH /settings, PUT /sections and PUT /pages write HER DRAFT; GET /room returns
// the draft as `stored` with `changes`, `is_live` and `preview` (a token for 30 minutes); POST /publish puts the draft on
// the website and POST /discard drops it. Looks, collections, faq, testimonials and the prices switch are not drafted and
// act at once. The preview frame loads her site with ?preview=<token>; a style card adds &style=<id>. The draft fields
// stay optional here, so the room also reads a server without them (no pending line, no Publish, the live page).
import { getJson, postJson, patchJson, deleteJson, API_BASE, getAuthHeader } from '@/lib/vendor/api/_base';

const BASE = '/api/v2/vendor/solutions/site';

export type Can = {
  styles: number; custom_palette: boolean; gradients: boolean; collections: boolean; journal: boolean;
  custom_sections: boolean; custom_pages: boolean; full_order: boolean; credit_removable: boolean;
  written_testimonials: boolean; video_testimonials: boolean; visitor_counts: boolean; visitor_sources: boolean;
  visitor_saves: boolean; own_domain: boolean; built_from_instagram: boolean;
  // WEB-4 cut 16: Basic holds one style; colour sets and font pairings are flags; each locked item names the plan that opens it
  palettes?: boolean; font_pairs?: boolean; opens?: Record<string, string>;
};
export type Section = { key: string; custom: boolean; allowed: boolean; shown: boolean; opens?: string | null; variant: string; eyebrow: string | null; heading: string | null; body: Record<string, unknown> };
export type Moved = { role: string; from: string; to: string; against: string; target: number; before: number; after: number };
export type Resolved = {
  v: 'classic' | 'styles'; can: Can; credit: boolean; site_name: string | null; monogram: string;
  style?: string; styles_open?: string[];
  palette?: { id: string; custom: boolean; roles: Record<string, string>; extras: Record<string, string>; moved: Moved[] } | null;
  font_pair?: { id: string; display: string; text: string; offered: string[] } | null;
  motion?: string; corners?: string; buttons?: string; texture?: string; cover_mode?: string;
  sections?: Section[]; trade?: { items: string; item: string; request: string };
};
export type StyleRow = { id: string; label: string; pairs: string[]; palettes: Array<{ id: string; label: string; swatch?: string[] }> };
export type Room = {
  stored: Record<string, unknown>;
  resolved: Resolved;
  styles: StyleRow[];
  finish: Record<string, { corners: string[]; buttons: string[]; textures: string[] }>;
  to_fix: { packages_below_starting_price: Array<{ id?: string; name?: string; total?: number } | string> };
  // WEB-4 cut 5: the draft
  changes?: { count: number; list: Array<{ area: 'settings' | 'sections' | 'pages' | string; line: string }>; published_at: string | null };   // each line drawn as sent; `area` is not drawn
  is_live?: boolean;
  // WEB-4 cut 16: her style clock (Basic enforces it): ISO days, the next day in words, and whether a change is refused now
  style_clock?: { last_changed_on: string | null; next_change_on: string | null; next_change_words: string | null; locked: boolean };
  preview?: { token: string; expires_at: string } | string | null;   // cut 5: previewLib.issue() gives { token, expires_at }
};
export type Photo = { id: string; url: string; review: 'shown' | 'held'; notice: string | null;   /* WEB-4 cut 30 (R-47.2): shown or held, with the server's notice; no reason any more */ caption: string | null; alt: string | null; position: number; focal_portrait: { x: number; y: number }; focal_landscape: { x: number; y: number } };
export type Look = { id: string; slug: string; title: string; status: 'draft' | 'published'; public_state: 'draft' | 'live' | 'waiting_for_photos'; category: string | null; included: string[] | null; from_price: string | null; package_id: string | null; credits: Array<{ role?: string; handle?: string; name?: string }> | null; photos: Photo[] };
export type Testimonial = { id: string; name: string | null; occasion: string | null; month: string | null; place: string | null; words: string; state: 'pending' | 'approved' | 'hidden'; from_client: boolean; to_delete: boolean };
export type Visitors = null | {
  days: number; visitors: number; views: number; daily: Array<{ day: string; visitors: number; views: number }>;
  top_look: { slug: string; title: string; views: number } | null;
  by_source: Record<string, number> | null;          // null below Signature: the plan's line, never a zero
  saved_looks: Array<{ slug: string; title: string; hearts: number }> | null;   // null below Prestige
};

type R<T> = T & { ok?: boolean };
export const site = {
  room: () => getJson<R<{ room: Room }>>(`${BASE}/room`),
  settings: (body: Record<string, unknown>) => patchJson<R<{ saved: string[]; warning?: string | null }>>(`${BASE}/settings`, body),
  sections: (sections: Array<Pick<Section, 'key' | 'variant' | 'shown' | 'eyebrow' | 'heading' | 'body'> & { position: number }>) => request<R<{ saved: number }>>('PUT', `${BASE}/sections`, { sections }),
  publish: () => postJson<R<{ published_at: string; is_live: true }>>(`${BASE}/publish`, {}),
  discard: () => postJson<R<{ discarded: true }>>(`${BASE}/discard`, {}),
  looks: () => getJson<R<{ looks: Look[] }>>(`${BASE}/looks`),
  newLook: (title: string) => postJson<R<{ look: { id: string; slug: string } }>>(`${BASE}/looks`, { title }),
  saveLook: (id: string, body: Record<string, unknown>) => patchJson<R<{ saved: string[]; warning?: string | null }>>(`${BASE}/looks/${enc(id)}`, body),
  deleteLook: (id: string) => deleteJson<R<{ deleted: true }>>(`${BASE}/looks/${enc(id)}`),
  publishLook: (id: string, on: boolean) => postJson<R<{ public_state: string }>>(`${BASE}/looks/${enc(id)}/${on ? 'publish' : 'unpublish'}`, {}),
  photo: (id: string, pid: string, body: Record<string, unknown>) => patchJson<R<{ saved: string[] }>>(`${BASE}/looks/${enc(id)}/photos/${enc(pid)}`, body),
  removePhoto: (id: string, pid: string) => deleteJson<R<{ deleted: true }>>(`${BASE}/looks/${enc(id)}/photos/${enc(pid)}`),
  testimonials: () => getJson<R<{ testimonials: Testimonial[] }>>(`${BASE}/testimonials`),
  approve: (id: string) => postJson<R<{ state: string }>>(`${BASE}/testimonials/${enc(id)}/approve`, {}),
  hide: (id: string) => postJson<R<{ state: string }>>(`${BASE}/testimonials/${enc(id)}/hide`, {}),
  deleteTestimonial: (id: string) => deleteJson<R<{ deleted: true }>>(`${BASE}/testimonials/${enc(id)}`),
  request: (person_name: string) => postJson<R<{ link: string; copy_text: string; send: string }>>(`${BASE}/testimonials/requests`, { person_name }),
  visitors: (days: 7 | 28) => getJson<R<{ visitors: Visitors }>>(`${BASE}/visitors?days=${days}`),
  /** A fresh photo: the signed upload into her own look folder, then the add door (Google's safety check runs as it is added; R-47.2). */
  async upload(id: string, file: File) {
    const s = await postJson<R<{ upload_url: string; params: Record<string, string> }>>(`${BASE}/looks/${enc(id)}/photos/sign`, {});
    const fd = new FormData(); fd.append('file', file); for (const [k, v] of Object.entries(s.params || {})) fd.append(k, String(v));
    const up = await fetch(s.upload_url, { method: 'POST', body: fd });
    if (!up.ok) throw new Error('upload');
    const j = await up.json() as { secure_url: string; width?: number; height?: number };
    return postJson<R<{ photo: { id: string; review: string } }>>(`${BASE}/looks/${enc(id)}/photos`, { image_url: j.secure_url, width: j.width, height: j.height });
  },
};
const enc = encodeURIComponent;
async function request<T>(method: string, path: string, body: unknown): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, { method, headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(String(r.status));
  return r.json() as Promise<T>;
}

/** The preview token, whichever shape the room sends it in (a string, or { token, expires_at }). */
export function previewToken(p: Room['preview']): string | null {
  if (!p) return null; if (typeof p === 'string') return p; return typeof p.token === 'string' && p.token ? p.token : null;
}

/** The accent moved darker or lighter: relative luminance of the two colours (the gate keeps the hue). */
export function direction(m: Moved): 'darker' | 'lighter' {
  const lum = (h: string) => { const x = h.replace('#', ''); const c = [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  return lum(m.to) < lum(m.from) ? 'darker' : 'lighter';
}
