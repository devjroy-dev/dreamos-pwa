// lib/vendor/metaRoomDoor.ts · CE-45 · IGD-1 · CUT 1 · THE TWO DOORS THE ROOM READS, AND ITS DECISIONS. Pure: no fetch,
// no window, so rung b126 drives it. The doors are served by dream-os in cut 2a; until then each answers 404, and a
// failed read is DARK: the Instagram section and the quiet time do not render, and the room is G6's screen under its
// new name, exactly as before.
//
// GET  /api/v2/vendor/solutions/instagram
//   { ok:true, state, authorize_url }                      fields beside `ok` (F-40.180's class)
//   state: 'not_connected' | 'off' | 'on' | 'paused' | 'waiting'
//     not_connected  no Instagram connection carrying the messages permission
//     off            connected, not switched on
//     on             switched on and answering
//     paused         switched on, the connection has lapsed or the permission was withdrawn
//     waiting        switched on, the lane not yet open to her (Meta has not granted)
//   authorize_url    an https instagram.com authorize address minted by the server, or null
// POST /api/v2/vendor/solutions/instagram/switch   { on: boolean }  -> the same shape as GET
// GET  /api/v2/vendor/solutions/quiet              { ok:true, minutes }   minutes in 60 | 120 | 240 | 480
// POST /api/v2/vendor/solutions/quiet              { minutes }            -> the same shape
//
// THE PWA HOLDS NO INSTAGRAM CONSTANT: the authorize address arrives from the server, as G6's launch does.

export type IgState = 'not_connected' | 'off' | 'on' | 'paused' | 'waiting';
export type IgDoor = { state: IgState; authorize_url: string | null };
export type QuietDoor = { minutes: 60 | 120 | 240 | 480 };

const STATES: readonly string[] = ['not_connected', 'off', 'on', 'paused', 'waiting'];
const MINUTES: readonly number[] = [60, 120, 240, 480];

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** An authorize address is accepted only on https, on instagram.com or www.instagram.com; anything else reads as null. */
export function asAuthorizeUrl(v: unknown): string | null {
  if (typeof v !== 'string' || v.length > 4096) return null;
  try {
    const u = new URL(v);
    if (u.protocol !== 'https:') return null;
    if (u.hostname !== 'www.instagram.com' && u.hostname !== 'instagram.com') return null;
    if (u.username || u.password || u.port) return null;
    return u.toString();
  } catch {
    return null;
  }
}

/** The Instagram door. Any body that is not exactly the ruled shape is a failed read: null, never a throw. */
export function asIgDoor(body: unknown): IgDoor | null {
  if (!isObj(body) || body.ok !== true) return null;
  if (typeof body.state !== 'string' || !STATES.includes(body.state)) return null;
  const hasUrl = 'authorize_url' in body && body.authorize_url !== null && body.authorize_url !== undefined;
  const url = asAuthorizeUrl(body.authorize_url);
  if (hasUrl && url === null) return null;
  return { state: body.state as IgState, authorize_url: url };
}

/** The quiet-time door. Only the four ruled lengths are read. */
export function asQuietDoor(body: unknown): QuietDoor | null {
  if (!isObj(body) || body.ok !== true) return null;
  if (typeof body.minutes !== 'number' || !MINUTES.includes(body.minutes)) return null;
  return { minutes: body.minutes as QuietDoor['minutes'] };
}

/** What "Turn on" does once the door has answered the switch: go to Instagram to authorise, or draw the new state. */
export function afterTurnOn(door: IgDoor | null): { go: string } | { draw: IgDoor } | { fail: true } {
  if (!door) return { fail: true };
  if ((door.state === 'not_connected' || door.state === 'paused') && door.authorize_url) return { go: door.authorize_url };
  if (door.state === 'on' || door.state === 'waiting') return { draw: door };
  return { fail: true };
}
