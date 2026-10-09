// lib/vendor/igPackageCardsDoor.ts · CE-47 · CLB PART C · HER PACKAGES AS CARDS IN HER INSTAGRAM MESSAGES · THE DOOR.
// Pure: no fetch, no window, so the bench drives it. Served by dream-os (HUBC_SRV_1). When the feature is not open to
// her the server answers 404, and a failed read is DARK: the section does not render, and the room is as before.
//
// GET  /api/v2/vendor/solutions/instagram/package-cards
// POST /api/v2/vendor/solutions/instagram/package-cards   { on: boolean }   -> the same shape
//   { ok:true, state, line, cards:[{ title, subtitle, image_url, button }] }
//   state: 'on' | 'off' | 'full' | 'failed' | 'no_packages' | 'not_connected'
//     on             her switch is on and "See packages" is in her Instagram's conversation starters
//     off            she turned it off
//     full           on, but her Instagram already has 4 starters of her own (hers are never overwritten)
//     failed         on, but Instagram did not accept the starter
//     no_packages    on, and she has no packages yet
//     not_connected  her Instagram is not connected
//   line     the server's sentence for the state (R-47.1), shown word for word
//   cards    at most 10, in her order: title (the package name), subtitle ("From Rs <amount>", or null), image_url (https,
//            or null; the server sends only a picture the safety check has not held), button ("See details", or null)
//
// THE PWA HOLDS NO SENTENCE FOR THE STATES: the line arrives from the server.

export type CardsState = 'on' | 'off' | 'full' | 'failed' | 'no_packages' | 'not_connected';
export type PackageCard = { title: string; subtitle: string | null; image_url: string | null; button: string | null };
export type CardsDoor = { state: CardsState; line: string; cards: PackageCard[] };

const STATES: readonly string[] = ['on', 'off', 'full', 'failed', 'no_packages', 'not_connected'];
/** Meta's generic template: at most 10 cards, title and subtitle at most 80 characters. */
export const MAX_CARDS = 10;
const MAX_TEXT = 80;

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
const text = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.slice(0, MAX_TEXT) : null);

/** A picture is shown only from an https address; anything else is no picture (the card still shows). */
export function asPicture(v: unknown): string | null {
  if (typeof v !== 'string' || v.length > 4096) return null;
  try {
    const u = new URL(v);
    if (u.protocol !== 'https:' || u.username || u.password) return null;
    return u.toString();
  } catch {
    return null;
  }
}

/** One card, or null when it has no title. */
export function asCard(v: unknown): PackageCard | null {
  if (!isObj(v)) return null;
  const title = text(v.title);
  if (!title) return null;
  return { title, subtitle: text(v.subtitle), image_url: asPicture(v.image_url), button: text(v.button) };
}

/** The door. Any body that is not the ruled shape is a failed read: null, never a throw. */
export function asCardsDoor(body: unknown): CardsDoor | null {
  if (!isObj(body) || body.ok !== true) return null;
  if (typeof body.state !== 'string' || !STATES.includes(body.state)) return null;
  if (typeof body.line !== 'string' || !body.line.trim() || body.line.length > 400) return null;
  if (!Array.isArray(body.cards)) return null;
  const cards = body.cards.map(asCard).filter((c): c is PackageCard => c !== null).slice(0, MAX_CARDS);
  return { state: body.state as CardsState, line: body.line, cards };
}

/** The one switch the section shows: Turn off while her choice is on, Turn on while it is off, none before Instagram is connected. */
export function switchFor(state: CardsState): 'turn_off' | 'turn_on' | null {
  if (state === 'off') return 'turn_on';
  if (state === 'not_connected') return null;
  return 'turn_off';
}
