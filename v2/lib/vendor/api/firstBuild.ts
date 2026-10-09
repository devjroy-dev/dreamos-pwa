// v2/lib/vendor/api/firstBuild.ts · CE-47 · FE-9 · THE TWO-MINUTE START, PACKAGE 1 · the app's half of WEB-4's doors.
// dream-os src/api/vendor/firstBuild.js (cut 19 r2, 68b6568), mounted at /api/v2/vendor/first-build, her session:
//   POST /                 -> { ok, build_id }            one at a time: a second POST returns the same id
//   GET  /:build_id        -> { ok, state, steps, site_ready }
//   GET  /latest           -> { ok, build: { build_id, state, steps, site_ready } | null }
// Every line a step shows is the SERVER's (`line`); the app adds only a step's plain name while it waits or runs.
// e-275: the poll waits on the build's own state, every 2 seconds, and stops at done or failed or after 3 minutes.
import { getJson, postJson } from '@/lib/vendor/api/_base';

export type BuildState = 'running' | 'done' | 'failed';
export type StepState = 'waiting' | 'running' | 'done' | 'skipped' | 'failed';
export type StepKey = 'photos' | 'website' | 'packages' | 'storefront' | 'eliza';
export interface BuildOpen { line: string; plan: string }
export interface BuildStep { key: StepKey; state: StepState; line: string | null; counts: Record<string, number | boolean> | null; opens?: BuildOpen[] | null }
export interface Build { build_id: string; state: BuildState; steps: BuildStep[]; site_ready: boolean; website_can_fill?: boolean }
type Err = { ok: false; error?: string };

export const POLL_MS = 2000;
export const POLL_LIMIT_MS = 3 * 60 * 1000;

export function startFirstBuild(): Promise<{ ok: true; build_id: string; already?: boolean } | Err> {
  return postJson('/api/v2/vendor/first-build', {});
}
/** WEB-4's contract (server train 13): the website step alone, again, in her latest build, so the website draft uses the
 *  photos in her portfolio. Offered only while GET /latest says website_can_fill (TDW's untouched draft, and at least one
 *  photo). 200 -> follow build_id as today (already: a build was running; nothing new started). 409 or 400 -> `error`,
 *  shown as it is (WEBSITE_HERS, NO_PHOTOS, NO_BUILD, STEP_UNKNOWN). */
export function fillWebsite(): Promise<{ ok: true; build_id: string; already?: boolean } | (Err & { code?: string })> {
  return postJson('/api/v2/vendor/first-build', { step: 'website' });
}
/** S2 (package 2, WEB-4 cut 20): the Instagram connect that returns her to set-up. The server allows one return value,
 *  'start'; the callback then sends her to /vendor/onboarding?ig=<connected|cancelled|failed&reason=…>. The URL is minted
 *  BEFORE she taps and S2's control is a real <a href> (F-07.22: no await between her finger and the navigation). */
export function mintIgStart(): Promise<{ ok: true; authorize_url: string } | Err> {
  return getJson('/api/v2/vendor/ig/authorize?return=start');
}
export async function readFirstBuild(id: string): Promise<Build | null> {
  const r = await getJson<({ ok: true } & Omit<Build, 'build_id'>) | Err>(`/api/v2/vendor/first-build/${encodeURIComponent(id)}`);
  return r && r.ok ? { build_id: id, state: r.state, steps: r.steps, site_ready: r.site_ready } : null;
}
export async function latestFirstBuild(): Promise<Build | null | undefined> {
  const r = await getJson<{ ok: true; build: Build | null } | Err>('/api/v2/vendor/first-build/latest');
  return r && r.ok ? r.build : undefined;   // undefined: the read failed (say nothing); null: she has no build
}

/** Follow one build until it ends or the limit passes. `onBuild` hears every read; the promise settles with how it ended.
 *  A read that fails is retried on the next beat (still bounded). `stop()` ends it at once (the screen left). */
export function followBuild(id: string, onBuild: (b: Build) => void, now: () => number = Date.now) {
  let stopped = false; let timer: ReturnType<typeof setTimeout> | null = null;
  const started = now();
  const done = new Promise<'ended' | 'too_long' | 'stopped'>((resolve) => {
    const beat = async () => {
      if (stopped) return resolve('stopped');
      let b: Build | null = null;
      try { b = await readFirstBuild(id); } catch { b = null; }
      if (stopped) return resolve('stopped');
      if (b) { onBuild(b); if (b.state !== 'running') return resolve('ended'); }
      if (now() - started >= POLL_LIMIT_MS) return resolve('too_long');
      timer = setTimeout(beat, POLL_MS);
    };
    void beat();
  });
  return { done, stop: () => { stopped = true; if (timer) clearTimeout(timer); } };
}

// ── the other doors the flow uses (each the room's own; no new door) ─────────────────────────────────────────────────
export type ElizaState = 'on' | 'off' | 'waiting';
export async function readWaEliza(): Promise<ElizaState | null> {
  const r = await getJson<{ ok: true; state: ElizaState } | Err>('/api/v2/vendor/solutions/whatsapp-eliza');
  return r && r.ok ? r.state : null;
}
export function switchWaEliza(on: boolean): Promise<{ ok: boolean; state?: ElizaState; error?: string }> {
  return postJson('/api/v2/vendor/solutions/whatsapp-eliza/switch', { on });
}
export function setSiteStyle(style: string): Promise<{ ok: boolean; error?: string }> {
  return patchSite('/settings', { style });
}
export function patchSiteSettings(patch: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  return patchSite('/settings', patch);
}
export function publishSite(): Promise<{ ok: boolean; error?: string }> {
  return postJson('/api/v2/vendor/solutions/site/publish', {});
}
import { patchJson } from '@/lib/vendor/api/_base';
function patchSite(path: string, body: unknown): Promise<{ ok: boolean; error?: string }> {
  return patchJson(`/api/v2/vendor/solutions/site${path}`, body);
}

// ── the Home card's "already checked" note: per phone, by build ───────────────────────────────────────────────────────
const SEEN_KEY = 'tdw_first_build_checked';
export function markBuildChecked(id: string) { try { localStorage.setItem(SEEN_KEY, id); } catch { /* storage refused: the card simply stays */ } }
export function buildChecked(id: string): boolean { try { return localStorage.getItem(SEEN_KEY) === id; } catch { return false; } }
