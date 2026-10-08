// lib/partner/api.ts · CE-47 · PTN-A1 app · the partner lane's client. Its own token key, never the vendor's or a Dreamer's.
// dream-os doors (PTN-A1 server): /api/v2/partner/*, /api/v2/public/partner/*.
const BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';
const KEY = 'tdw_partner_token';
export const partnerToken = (): string | null => { try { return localStorage.getItem(KEY); } catch { return null; } };
export const setPartnerToken = (t: string | null) => { try { if (t) localStorage.setItem(KEY, t); else localStorage.removeItem(KEY); } catch { /* private mode */ } };
// One shape (the app compiles with strict off, where a union does not narrow): read ok first; on ok=false only error,
// code and status are present.
export type Res<T> = { ok: boolean; error?: string; code?: string; status?: number } & T;
async function call<T>(path: string, init: RequestInit = {}, auth = true): Promise<Res<T>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const t = auth ? partnerToken() : null; if (t) headers.Authorization = `Bearer ${t}`;
  try {
    const r = await fetch(`${BASE}${path}`, { ...init, headers });
    const b = await r.json().catch(() => ({}));
    if (!r.ok || b.ok === false) return { ok: false, error: b.error || 'TDW could not finish this just now. Please try again.', code: b.code, status: r.status } as Res<T>;
    return { ...b, ok: true } as Res<T>;
  } catch { return { ok: false, error: 'TDW could not reach the internet just now. Please try again.', status: 0 } as Res<T>; }
}
const json = (b: unknown) => JSON.stringify(b);
export type Org = { id: string; name: string; kind: string; kind_words: string; instagram_handle: string; instagram_url: string | null;
  website: string | null; website_url: string | null; cities: string[]; wants: string[]; calls_email: string | null;
  send_state: 'active' | 'paused' | 'stopped'; check_state: 'unchecked' | 'checked' | 'blocked'; check_words: string | null; plan_state: string };
export type CallShape = { open: boolean; vendor: { name: string; trade: string; instagram_url: string | null; instagram_handle: string | null };
  needs: string; roles: { role: string; word: string; needed: number }[]; city: string; date_words: string; pay_words: string; note: string | null };
export const partnerApi = {
  sendCode: (phone: string) => call<object>('/api/v2/partner/auth/send-otp', { method: 'POST', body: json({ phone }) }, false),
  verify: (phone: string, otp: string, name?: string) => call<{ token: string; has_org: boolean }>('/api/v2/partner/auth/verify-otp', { method: 'POST', body: json({ phone, otp, name }) }, false),
  me: () => call<{ name: string | null; partner: Org | null; role: string | null; people: { name: string | null; phone: string | null; role: string }[] }>('/api/v2/partner/me'),
  createOrg: (b: Record<string, unknown>) => call<{ partner: Org }>('/api/v2/partner/org', { method: 'POST', body: json(b) }),
  patchOrg: (b: Record<string, unknown>) => call<{ partner: Org }>('/api/v2/partner/org', { method: 'PATCH', body: json(b) }),
  addPerson: (phone: string, name: string) => call<object>('/api/v2/partner/people', { method: 'POST', body: json({ phone, name }) }),
  publicPage: (handle: string) => call<{ partner: { name: string; kind_words: string; cities: string[]; instagram_handle: string; instagram_url: string | null; website_url: string | null; check_words: string | null; fee_line: string } }>(`/api/v2/public/partner/p/${encodeURIComponent(handle)}`, {}, false),
  // PTN-A2-1 app part 1: the call page. No sign-in; the token in the link is the key. The server sends no phone and no email.
  call: (token: string) => call<{ partner: string; call: CallShape; suggested: string[]; max: number }>(`/api/v2/public/partner/call/${encodeURIComponent(token)}`, {}, false),
  suggest: (token: string, people: { name: string; role?: string; link?: string }[], agreed: boolean) => call<{ line: string; people: { name: string; existed: boolean }[] }>(`/api/v2/public/partner/call/${encodeURIComponent(token)}/suggest`, { method: 'POST', body: json({ people, agreed }) }, false),
  stopOrPause: (token: string, what: 'stop' | 'pause') => call<{ line: string }>(`/api/v2/public/partner/call/${encodeURIComponent(token)}/${what}`, { method: 'POST', body: json({}) }, false),
  request: (token: string) => call<{ ended: boolean; line?: string; request?: { vendor: { name: string; trade: string; instagram_url: string | null; instagram_handle: string | null }; need: string; city: string; date_words: string; budget_words: string; pay_words: string; note: string | null; phone_line: string } }>(`/api/v2/public/partner/request/${encodeURIComponent(token)}`, {}, false),
};
