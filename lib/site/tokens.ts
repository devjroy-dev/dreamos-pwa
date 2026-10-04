// lib/site/tokens.ts · WEB-5 · the card's resolved colour roles to the CSS variables the approved styles read.
// The only mapping the renderer owns is NAMES (ground to --bg, muted to --mute, underscores to hyphens); every
// value comes from the card (WEB-4's registry and contrast gate, R-42.6). No colour is typed in this file.
import type { Palette } from './card';
const RENAME: Record<string, string> = { ground: 'bg', muted: 'mute' };
const SAFE = /^(#[0-9a-f]{3,8}|rgba?\([0-9.,\s%]+\)|(linear|radial|conic)-gradient\([#0-9a-z.,\s%()-]+\))$/i;
export function paletteVars(p: Palette | null | undefined): Record<string, string> {
  const v: Record<string, string> = {};
  for (const src of [p?.roles || {}, p?.extras || {}]) for (const [k, val] of Object.entries(src)) {
    if (typeof val !== 'string' || !SAFE.test(val.trim())) continue;   // a value the gate did not shape is never written
    v[`--${(RENAME[k] || k).replace(/_/g, '-')}`] = val.trim();
  }
  return v;
}
/** The prototypes key their palette blocks on html[data-pal=<name>]; the card's id is "<style>.<name>". */
export const palName = (p: Palette | null | undefined): string => String(p?.id || '').split('.').pop() || '';
