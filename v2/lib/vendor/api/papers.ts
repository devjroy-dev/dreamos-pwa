// v2/lib/vendor/api/papers.ts · CE-47 · PRO · P1 app · Business papers: her doors (dream-os src/api/vendor/papers.js)
// and the public check door (src/api/public/check.js). Screens import from here, never raw fetch.
import { getJson, postJson, API_BASE, getAuthHeader } from '@/lib/vendor/api/_base';

export type PaperKind = 'certificate' | 'id_card' | 'statement' | 'ca_pack';
export type Purpose = 'bank' | 'landlord' | 'visa' | 'other';
export type Paper = { id: string; kind: PaperKind; title: string; period_from: string | null; period_to: string | null; purpose: Purpose | null;
  issued_at: string; issued_on: string; withdrawn_at: string | null; state: 'valid' | 'withdrawn'; check_code: string; check_url: string; lines: [string, string][]; note: string };
export type About = { name: string; trade: string; city: string; weddings_verified: number; as_of: string; gstin: string | null };
export type ApiErr = { ok: false; error: string };
export type CheckPaper = { check_code: string; title: string; state: 'valid' | 'withdrawn'; name: string; issued_on: string; withdrawn_on?: string; purpose?: string | null; lines: [string, string][]; note: string; photo_url?: string | null };

export const fetchPapers = (vendorId: string): Promise<{ ok: true; papers: Paper[] } | ApiErr> => getJson(`/api/v2/vendor/papers/${vendorId}`);
export const fetchAbout = (vendorId: string): Promise<{ ok: true; about: About } | ApiErr> => getJson(`/api/v2/vendor/papers/${vendorId}/about`);
export const issuePaper = (vendorId: string, body: { kind: PaperKind; period_from?: string; period_to?: string; purpose?: Purpose; photo_url?: string }): Promise<{ ok: true; paper: Paper } | ApiErr> =>
  postJson(`/api/v2/vendor/papers/${vendorId}`, body);
export const withdrawPaper = (vendorId: string, id: string): Promise<{ ok: true; withdrawn: true } | ApiErr> => postJson(`/api/v2/vendor/papers/${vendorId}/${id}/withdraw`, {});

/** The PDF or the CA pack ZIP, saved through a blob: a new tab would carry no Authorization header (the TDS export's reason). */
export async function downloadPaper(vendorId: string, paper: Paper): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/v2/vendor/papers/${vendorId}/${paper.id}/file`, { headers: getAuthHeader() });
    if (!res.ok) return { ok: false, error: 'The file could not be made just now. Please try again.' };
    const name = (/filename="([^"]+)"/.exec(res.headers.get('content-disposition') || '') || [])[1] || `TDW_${paper.check_code}${paper.kind === 'ca_pack' ? '.zip' : '.pdf'}`;
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    return { ok: true };
  } catch { return { ok: false, error: 'The file could not be made just now. Please try again.' }; }
}

/** The public check, called FROM THE VISITOR'S BROWSER (never from the page's server): the door allows 60 tries an hour
 *  per address, and a server-side call would put every visitor behind one Vercel address (F-44.361). */
export async function fetchCheck(code: string): Promise<{ ok: true; paper: CheckPaper } | { ok: false; error: string; status: number }> {
  try {
    const res = await fetch(`${API_BASE}/api/v2/public/check/${encodeURIComponent(code)}`, { cache: 'no-store' });
    const j = await res.json().catch(() => null);
    if (res.ok && j && j.ok) return { ok: true, paper: j.paper as CheckPaper };
    return { ok: false, status: res.status, error: (j && j.error) || 'TDW could not check this code just now. Please try again.' };
  } catch { return { ok: false, status: 0, error: 'TDW could not check this code just now. Please try again.' }; }
}
/** The refusal's words from any answer (this project's TS does not narrow on `ok`). */
export const errOf = (r: unknown, fallback = 'Please try again.'): string => (r && typeof r === 'object' && 'error' in r && (r as { error?: unknown }).error ? String((r as { error: unknown }).error) : fallback);
