// lib/site/html.ts · WEB-5 · markup the way the approved prototypes write it, made safe.
// Every interpolation is escaped unless it is a Raw produced by this file; vendor text can never become markup.
export class Raw { constructor(readonly s: string) {} toString() { return this.s; } }
const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (v: unknown): string => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);
const part = (v: unknown): string => v instanceof Raw ? v.s : Array.isArray(v) ? v.map(part).join('') : v === null || v === undefined || v === false ? '' : esc(v);
export function html(strings: TemplateStringsArray, ...vals: unknown[]): Raw {
  let s = strings[0]; for (let i = 0; i < vals.length; i++) s += part(vals[i]) + strings[i + 1]; return new Raw(s);
}
export const raw = (s: string): Raw => new Raw(s);
/** A url for an attribute: only http(s), wa.me and in-page anchors survive. */
export const href = (u: string | null | undefined): string => { const s = String(u || ''); return /^(https?:\/\/|#|\/)/i.test(s) ? s : '#'; };
