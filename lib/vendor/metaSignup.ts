// lib/vendor/metaSignup.ts · CE-45 · G6-1 · CUT ONE (FE_1).
// META'S EMBEDDED SIGNUP v4, ON HER TAP. Read on 2026-09-24 from
// developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/implementation
// (read-first (ii) M1) and .../onboarding-business-app-users (M5).
//
// ⚠ NOTHING HERE RUNS ON LOAD. `loadSdk` is called from the tap that opens
// Meta's screen and from nowhere else; the SDK script is injected once and the
// promise is reused, so a second tap while it loads does not load it twice.
//
// ⚠ THE LISTENER TRUSTS ONLY META. A window message counts only if its origin is
// https on facebook.com or a subdomain of it (a bare `endsWith('facebook.com')`
// would admit `evilfacebook.com`), and only if its JSON says
// `type: 'WA_EMBEDDED_SIGNUP'`. Everything else is ignored, never thrown.
//
// ⚠ THE CODE LIVES THIRTY SECONDS (c-45.27). `launchSignup` resolves the instant
// FB.login's callback carries it, with whatever session message has arrived by
// then; it does NOT wait for the message, which Meta sends in no guaranteed
// order. The server reads anything missing from Meta (read-first FK9). On the
// shared way the message carries `waba_id` only (c-45.28).

import type { OwnNumberLaunch, OwnNumberWay } from '@/lib/vendor/ownNumberDoor';

export type EsSession = {
  event: string | null;
  waba_id: string | null;
  phone_number_id: string | null;
  business_id: string | null;
  current_step: string | null;
  error_code: string | null;
  session_id: string | null;
};

export type EsResult =
  | { kind: 'code'; code: string; session: EsSession | null }
  | { kind: 'cancel'; session: EsSession | null };

const META_ORIGIN = /^https:\/\/([a-z0-9-]+\.)*facebook\.com$/;
const SDK_SRC = 'https://connect.facebook.net/en_US/sdk.js';
/** How long a closed popup waits for Meta's CANCEL message before reporting a stop. */
const CANCEL_GRACE_MS = 1500;
/** How long the SDK may take to arrive before the tap is reported as failed. */
const SDK_TIMEOUT_MS = 20000;

const s = (x: unknown): string | null => (typeof x === 'string' && x.length > 0 ? x : null);

/** Pure: one window message in, a session or null out. Never throws. */
export function parseEsMessage(origin: unknown, raw: unknown): EsSession | null {
  if (typeof origin !== 'string' || !META_ORIGIN.test(origin)) return null;
  let msg: unknown = raw;
  if (typeof raw === 'string') { try { msg = JSON.parse(raw); } catch { return null; } }
  if (typeof msg !== 'object' || msg === null) return null;
  const m = msg as Record<string, unknown>;
  if (m.type !== 'WA_EMBEDDED_SIGNUP') return null;
  const d = (typeof m.data === 'object' && m.data !== null ? m.data : {}) as Record<string, unknown>;
  return {
    event: s(m.event),
    waba_id: s(d.waba_id),
    phone_number_id: s(d.phone_number_id),
    business_id: s(d.business_id),
    current_step: s(d.current_step),
    error_code: s(d.error_code),
    session_id: s(d.session_id),
  };
}

type FbLoginResponse = { authResponse?: { code?: string } | null };
type FbSdk = {
  init: (o: Record<string, unknown>) => void;
  login: (cb: (r: FbLoginResponse) => void, o: Record<string, unknown>) => void;
};
type FbWindow = Window & { FB?: FbSdk; fbAsyncInit?: () => void };

let sdkPromise: Promise<FbSdk> | null = null;

/** Injects Meta's SDK once, on demand, and initialises it with the door's launch values. */
export function loadSdk(launch: OwnNumberLaunch): Promise<FbSdk> {
  if (sdkPromise) return sdkPromise;
  const w = window as FbWindow;
  sdkPromise = new Promise<FbSdk>((resolve, reject) => {
    const timer = setTimeout(() => { sdkPromise = null; reject(new Error('sdk timeout')); }, SDK_TIMEOUT_MS);
    const ready = () => {
      if (!w.FB) return;
      w.FB.init({ appId: launch.app_id, autoLogAppEvents: true, xfbml: false, version: launch.graph_version });
      clearTimeout(timer);
      resolve(w.FB);
    };
    if (w.FB) { ready(); return; }
    w.fbAsyncInit = ready;
    const tag = document.createElement('script');
    tag.src = SDK_SRC;
    tag.async = true;
    tag.defer = true;
    tag.crossOrigin = 'anonymous';
    tag.onerror = () => { clearTimeout(timer); sdkPromise = null; reject(new Error('sdk failed to load')); };
    document.body.appendChild(tag);
  });
  return sdkPromise;
}

/** Opens Meta's screen for the chosen way and resolves once, with the code or a stop. */
export async function launchSignup(launch: OwnNumberLaunch, way: OwnNumberWay): Promise<EsResult> {
  const fb = await loadSdk(launch);
  const extras = (way === 'shared' ? launch.extras.shared : launch.extras.moved) || { setup: {} };
  return new Promise<EsResult>((resolve) => {
    let latest: EsSession | null = null;
    let done = false;
    const onMessage = (ev: MessageEvent) => {
      const got = parseEsMessage(ev.origin, ev.data);
      if (got) latest = got;
    };
    const finish = (r: EsResult) => {
      if (done) return;
      done = true;
      window.removeEventListener('message', onMessage);
      resolve(r);
    };
    window.addEventListener('message', onMessage);
    fb.login((res) => {
      const code = res && res.authResponse && s(res.authResponse.code);
      if (code) { finish({ kind: 'code', code, session: latest }); return; }
      setTimeout(() => finish({ kind: 'cancel', session: latest }), CANCEL_GRACE_MS);
    }, {
      config_id: launch.config_id,
      response_type: 'code',
      override_default_response_type: true,
      extras,
    });
  });
}
