// lib/demo/api.ts
// Demo vendor API client.
// ZERO AUTH. ZERO SESSION. ZERO localStorage.
// Every call is public. The ig_handle from the URL is the only identity.
// NEVER import lib/vendor/session, lib/vendor/api/_base, or hooks/vendor/*.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';

export interface DemoPhoto {
  url: string;
  is_hero?: boolean;
  cloudinary_id?: string;
}

export interface DemoVendor {
  id:             string;
  ig_handle:      string;
  display_name:   string;
  category:       string;
  city:           string;
  about:          string | null;
  rate_display:   string | null;
  photos:         DemoPhoto[];
  whatsapp_phone: string | null;
}

export interface DemoLead {
  id:                 string;
  demo_vendor_id:     string;
  demo_vendor_handle: string;
  bride_name:         string;
  bride_phone:        string;
  bride_ig_handle:    string | null;
  bride_wedding_date: string | null;
  bride_wedding_city: string | null;
  state:              string | null;
  raw_message:        string | null;
  otp_verified:       boolean;
  created_at:         string;
}

export interface DemoContext {
  vendor: {
    name:         string;
    category:     string;
    city:         string;
    about:        string | null;
    rate_display: string | null;
  };
  leads_summary: {
    total:  number;
    new:    number;
    booked: number;
    leads:  DemoLead[];
  };
  context_text: string;
}

export interface DiscoverVendor {
  id:             string;
  name:           string | null;
  category:       string | null;
  city:           string | null;
  routing_handle: string | null;
  starting_price: number | null;
  photos:         string[];
  vibe_tags:      string[];
  about:          string | null;
  enquire_link:   string | null;
}

async function publicGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method:  'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

export async function fetchDemoVendor(handle: string): Promise<{ ok: true; vendor: DemoVendor }> {
  return publicGet(`/api/v2/demo/vendor/${handle}`);
}

export async function fetchDemoLeads(handle: string): Promise<{ ok: true; leads: DemoLead[] }> {
  return publicGet(`/api/v2/demo/vendor/${handle}/leads`);
}

export async function fetchDemoContext(handle: string): Promise<{ ok: true } & DemoContext> {
  return publicGet(`/api/v2/demo/vendor/${handle}/context`);
}

// ── TDW_08 P1 · G-1 · THE OPEN BEACON (client half) ─────────────────────────
// Fire-and-forget. It is an ANALYTICS beacon: it stamps `opened_at` server-side
// and moves invited -> opened, and it mutates no clock (the first-open extension
// was retired by the founder on 2026-08-02).
//
// IT NEVER THROWS AND NEVER SURFACES. A landing page must not degrade because a
// telemetry write failed — the vendor came to see his studio, not our stamp. It
// is deliberately NOT routed through publicGet, whose contract is to throw on
// `ok:false`; that behaviour is right for a read the page renders and wrong for
// this. The 404 and 429 paths are swallowed here on purpose.
//
// THE PATH IS THE MOUNTED ONE. router.js mounts the demo router at
// `/api/v2/demo/vendor` — the spec's `/api/v2/demo/:handle/opened` is not a
// served route, and authoring against it would be a phantom call of F-07.95's
// class. This is the same prefix the claim POST already uses.
export async function pingDemoOpened(handle: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/v2/demo/vendor/${handle}/opened`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    '{}',
      keepalive: true,
    });
  } catch {
    /* deliberately silent — see above */
  }
}

export async function fetchDemoDiscoverFeed(): Promise<{
  ok: true; vendors: DiscoverVendor[]; page: number; has_more: boolean; total: number;
}> {
  return publicGet('/api/v2/demo/discover');
}

export interface StreamDonePayload {
  meta?: { tier: string; turns_used: number; turns_cap: number; state: 'ok' | 'nearing' | 'capped'; upgrade?: { label: string; href: string } }; // TDW_02 P5
  tool_calls: string[];
  refresh:    boolean;
}

export function streamDemoChat(
  handle:  string,
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  onDelta: (text: string) => void,
  onDone:  (result: StreamDonePayload) => void,
  onError: (msg: string) => void,
): () => void {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v2/demo/vendor/${handle}/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body:    JSON.stringify({ message, history }),
        signal:  controller.signal,
      });

      if (!res.ok || !res.body) { onError('Connection failed. Try again.'); return; }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') { onDone({ tool_calls: [], refresh: false }); return; }
          try {
            const evt = JSON.parse(raw);
            if (evt.type === 'text_delta') onDelta(evt.text);
            if (evt.type === 'done')       { onDone(evt); return; }
            if (evt.type === 'error')      { onError(evt.text || 'Error.'); return; }
          } catch { /* malformed SSE line — skip */ }
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') onError('Connection lost. Try again.');
    }
  })();

  return () => controller.abort();
}
