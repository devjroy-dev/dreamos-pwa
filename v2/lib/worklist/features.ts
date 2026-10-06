// CE-47 · ADS-2 · A VENDOR'S META FEATURE SWITCHES (the founder, 4 Oct 2026): every Meta-gated feature has her own
// On/Off switch now; before Meta approves, her On waits; the moment Meta approves it goes live by itself.
// The words are ruled verbatim. The door: GET and PUT /api/v2/vendor/features (dream-os, server train 1).
import { API_BASE, getAuthHeader, getJson, handleResponse } from '@/lib/vendor/api/_base';

export const FEATURES_API_PATH = '/api/v2/vendor/features';
export const FEATURE_WORDS = Object.freeze({
  on: 'On',
  off: 'Off',
  waiting: "Waiting for Meta's approval. It starts by itself when approved.",
  live: 'Live',
  heading: 'Meta features',   // the list's title in the WhatsApp and Instagram room (CE-47)
});
// The switches shown. The photo import has none until its room is rebuilt (CE-47 Q5); insights none (Q4).
export const SWITCHABLE = Object.freeze(['perm.instagram_business_manage_messages', 'flag.ads']);

export type MetaFeature = { key: string; feature: string; live: boolean; choice: 'on' | 'off' };

/** The line under a switch: "Live" once Meta has approved, else the waiting line. */
export function lineFor(f: Pick<MetaFeature, 'live'>): string {
  return f.live ? FEATURE_WORDS.live : FEATURE_WORDS.waiting;
}

export function shown(list: MetaFeature[], only?: string): MetaFeature[] {
  return list.filter((f) => SWITCHABLE.includes(f.key) && (!only || f.key === only));
}

export async function fetchFeatures(): Promise<MetaFeature[]> {
  const r = await getJson<{ ok: boolean; features?: MetaFeature[] }>(FEATURES_API_PATH);
  return (r && Array.isArray(r.features)) ? r.features : [];
}

export async function saveChoice(key: string, choice: 'on' | 'off'): Promise<void> {
  const res = await fetch(`${API_BASE}${FEATURES_API_PATH}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ key, choice }),
  });
  await handleResponse<{ ok: boolean }>(res);
}
