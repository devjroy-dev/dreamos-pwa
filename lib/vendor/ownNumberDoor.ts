// lib/vendor/ownNumberDoor.ts · CE-45 · G6-1 · CUT ONE (FE_1).
// THE OWN-NUMBER DOOR'S WIRE, AS RULED (FK1, 2026-09-24), AND THE ONE DECISION
// THE ROOM MAKES FROM IT. Pure: no fetch, no window, so the rung can drive it.
//
// GET  /api/v2/vendor/solutions/number
//   { ok:true, open, reason, reason_text, launch, number }   fields beside `ok`,
//   never under a `data` key (payment-reminders/page.tsx's lesson, F-40.180's class).
// POST /api/v2/vendor/solutions/number/connect
//   body { code, event, waba_id, phone_number_id, business_id }
//   -> { ok:true, number } | { ok:false, reason, reason_text }
//
// ⚠ THE PWA HOLDS NO META CONSTANT. The app id, the configuration id and the
// Graph version arrive in `launch`, and only when the door says `open`. So the
// flag flip on the server is the whole switch, and a pwa build can never launch
// Meta's screen against a configuration nobody armed.
//
// ⚠ `launch.extras` IS AN ADDITION TO FK1's SHAPE, declared in FE_1's handover
// for the chair: per-way objects passed verbatim into FB.login's `extras`, so
// the shared way's Coexistence parameter (whose exact name the read-first could
// not witness, M5) is chosen on the SERVER, where it can change without a pwa
// cut. Absent, the launch uses Meta's documented default `{ setup: {} }` (M1).
//
// ⚠ A BODY THAT FAILS THIS CHECK IS A FAILED READ, and a failed read is DARK.
// 404 (the door not built yet), a network error, a 200 with the wrong shape:
// all three return null, and null renders the shell exactly as before.

export type OwnNumberStatus = 'pending' | 'active' | 'suspended' | 'migrated_out';
export type OwnNumberWay = 'shared' | 'moved';

export type OwnNumberLaunch = {
  app_id: string;
  config_id: string;
  graph_version: string;
  extras: { shared: Record<string, unknown> | null; moved: Record<string, unknown> | null };
};

export type OwnNumberLine = {
  status: OwnNumberStatus;
  display_number: string;
  way: OwnNumberWay;
  quality_rating: string | null;
};

export type OwnNumberDoor = {
  open: boolean;
  reason: string | null;
  reason_text: string | null;
  launch: OwnNumberLaunch | null;
  number: OwnNumberLine | null;
};

export type ConnectBody = {
  code: string;
  event: string | null;
  waba_id: string | null;
  phone_number_id: string | null;
  business_id: string | null;
};

const STATUSES: readonly string[] = ['pending', 'active', 'suspended', 'migrated_out'];
const WAYS: readonly string[] = ['shared', 'moved'];

const isObj = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);
const strOrNull = (x: unknown): string | null | undefined =>
  x === null || x === undefined ? null : typeof x === 'string' ? x : undefined;

function asLaunch(x: unknown): OwnNumberLaunch | null | undefined {
  if (x === null || x === undefined) return null;
  if (!isObj(x)) return undefined;
  const { app_id, config_id, graph_version } = x;
  if (typeof app_id !== 'string' || !/^\d{5,20}$/.test(app_id)) return undefined;
  if (typeof config_id !== 'string' || !/^\d{5,20}$/.test(config_id)) return undefined;
  if (typeof graph_version !== 'string' || !/^v\d{1,3}\.\d{1,2}$/.test(graph_version)) return undefined;
  const ex = x.extras;
  let shared: Record<string, unknown> | null = null;
  let moved: Record<string, unknown> | null = null;
  if (ex !== undefined && ex !== null) {
    if (!isObj(ex)) return undefined;
    if (ex.shared !== undefined && ex.shared !== null) { if (!isObj(ex.shared)) return undefined; shared = ex.shared; }
    if (ex.moved !== undefined && ex.moved !== null) { if (!isObj(ex.moved)) return undefined; moved = ex.moved; }
  }
  return { app_id, config_id, graph_version, extras: { shared, moved } };
}

export function asNumberLine(x: unknown): OwnNumberLine | null | undefined {
  if (x === null || x === undefined) return null;
  if (!isObj(x)) return undefined;
  const { status, display_number, way } = x;
  if (typeof status !== 'string' || !STATUSES.includes(status)) return undefined;
  if (typeof display_number !== 'string' || !/^\+?\d[\d ]{6,20}$/.test(display_number)) return undefined;
  if (typeof way !== 'string' || !WAYS.includes(way)) return undefined;
  const q = strOrNull(x.quality_rating);
  if (q === undefined) return undefined;
  return { status: status as OwnNumberStatus, display_number, way: way as OwnNumberWay, quality_rating: q };
}

/** The GET door's body, validated. Anything else is null: a failed read, dark. */
export function asDoor(x: unknown): OwnNumberDoor | null {
  if (!isObj(x) || x.ok !== true || typeof x.open !== 'boolean') return null;
  const reason = strOrNull(x.reason);
  const reason_text = strOrNull(x.reason_text);
  const launch = asLaunch(x.launch);
  const number = asNumberLine(x.number);
  if (reason === undefined || reason_text === undefined || launch === undefined || number === undefined) return null;
  // An open door with nothing to launch cannot open anything: a failed read, not an open one.
  if (x.open && !launch) return null;
  return { open: x.open, reason, reason_text, launch, number };
}

export type RoomMode = 'shell' | 'status' | 'flow';

/**
 * THE ONE DECISION. In order: no valid door -> shell; any owed byte -> shell;
 * a number on file -> its status; an open door -> the flow; else -> shell.
 * A door that is shut for her (the flag, or her tier's switch, FQ3) reads as the
 * shell, whose Connect already says "Launching soon." (ruling F-a (a)).
 */
export function roomMode(door: OwnNumberDoor | null, bytesReady: boolean): RoomMode {
  if (!door || !bytesReady) return 'shell';
  if (door.number) return 'status';
  if (door.open && door.launch) return 'flow';
  return 'shell';
}
