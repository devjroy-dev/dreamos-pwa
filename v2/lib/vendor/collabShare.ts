// v2/lib/vendor/collabShare.ts · CE-47 · CLB-1 · COLLAB HUB v2 on the vendor's side: the words, the doors, the upload.
// Words are plain and literal (R-45.30); no "couple" or "bride"; full months come from the server's dates.
import { getJson, postJson } from '@/lib/vendor/api/_base';
import { COLLAB_API_PATH } from '@/v2/lib/solutions/routes';
// CLB-1's three doors live HERE, not in routes.ts's API table, so this package writes no shared file (app train 2:
// "no two packages write one file"). Same mount as the rest of the collab doors.
const DOORS = {
  shareGate: () => `${COLLAB_API_PATH}/share-gate`,
  referenceSign: () => `${COLLAB_API_PATH}/reference/sign`,
  shares: (postId: string) => `${COLLAB_API_PATH}/${encodeURIComponent(postId)}/shares`,
};

export type PayKind = 'paid' | 'unpaid' | 'credit_only';
export const PAY_KINDS: readonly { v: PayKind; l: string }[] = [
  { v: 'paid', l: 'Paid' }, { v: 'unpaid', l: 'Unpaid' }, { v: 'credit_only', l: 'Credit only' },
];
export const MAX_REFERENCES = 4;

export const CS = {
  pay: 'Pay',
  pictures: 'Reference pictures',
  addPicture: 'Add',
  removePicture: 'Remove picture',
  uploading: 'Adding picture\u2026',
  uploadFailed: 'That picture did not upload. Try again.',
  tick: 'Post on TDW\u2019s Instagram and Threads. TDW checks it first.',
  tickInstagramOnly: 'Post on TDW\u2019s Instagram. TDW checks it first.',
  tickThreadsOnly: 'Post on TDW\u2019s Threads. TDW checks it first.',
  needPicture: 'Add a picture to post on TDW\u2019s Instagram and Threads.',
  whereHead: 'Where it is posted',
  account: (account: string, platform: string) => `${account === 'house' ? 'TDW' : 'Your'} ${platform === 'instagram' ? 'Instagram' : 'Threads'}`,
  state: { queued: 'Waiting for TDW to check it', approved: 'Posting now', published: 'Posted', rejected: 'Not posted by TDW', failed: 'Not posted yet' } as Record<string, string>,
  pill: { queued: 'Waiting', approved: 'Posting', published: 'Live', rejected: 'Not posted', failed: 'Not posted' } as Record<string, string>,
  open: 'Open',
};

export type HouseGate = { instagram: boolean; threads: boolean };
export type Share = { id: string; account: 'house' | 'vendor'; platform: 'instagram' | 'threads'; state: string; hashtags: string[]; permalink: string | null; published_at: string | null };

export function tickLabel(g: HouseGate): string | null {
  if (g.instagram && g.threads) return CS.tick;
  if (g.instagram) return CS.tickInstagramOnly;
  if (g.threads) return CS.tickThreadsOnly;
  return null;
}

export async function fetchHouseGate(): Promise<HouseGate> {
  try {
    const d = await getJson<{ ok: boolean; house?: HouseGate }>(DOORS.shareGate());
    return d && d.ok && d.house ? { instagram: d.house.instagram === true, threads: d.house.threads === true } : { instagram: false, threads: false };
  } catch { return { instagram: false, threads: false }; }
}

export async function fetchShares(postId: string): Promise<Share[]> {
  try {
    const d = await getJson<{ ok: boolean; shares?: Share[] }>(DOORS.shares(postId));
    return d && d.ok && Array.isArray(d.shares) ? d.shares : [];
  } catch { return []; }
}

/** One reference picture: the signed upload into her own folder; returns Cloudinary's secure_url. */
export async function uploadReference(file: File): Promise<string> {
  const s = await postJson<{ ok: boolean; upload_url: string; params: Record<string, string> }>(DOORS.referenceSign(), {});
  if (!s || !s.ok || !s.upload_url) throw new Error('sign');
  const fd = new FormData(); fd.append('file', file); for (const [k, v] of Object.entries(s.params || {})) fd.append(k, String(v));
  const up = await fetch(s.upload_url, { method: 'POST', body: fd });
  if (!up.ok) throw new Error('upload');
  const j = await up.json() as { secure_url?: string };
  if (!j.secure_url) throw new Error('upload');
  return j.secure_url;
}
