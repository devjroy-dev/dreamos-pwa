// lib/demo/api.ts
// Demo vendor API client.
// ZERO AUTH. ZERO SESSION. ZERO localStorage.
// Every call is public. The ig_handle from the URL is the only identity.
// NEVER import lib/vendor/session, lib/vendor/api/_base, or hooks/vendor/*.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';

import type { DiscoverVendor as DiscoverVendorType } from '@/lib/types/discover';

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

// ── TDW_08 P3 · THIS TYPE WAS A LIE ABOUT ITS OWN WIRE, AND IT IS CORRECTED ──
// It declared TWELVE fields. THREE were true (`id`, `bride_name`, `created_at`), NINE
// were phantom, and THREE fields the route actually sends were undeclared. F-07.3's
// disease — a type behind its own contract — in the module that carries the demo lane.
//
// It compiled because the type is what made it compile: `hooks/demo/useDemoVendorData.ts`
// read `bride_phone`, `bride_wedding_date`, `bride_wedding_city`, `state` and
// `raw_message` off it, got `undefined` for every one, and `tsc` had no reason to object.
// The subtitle under every bride's name on the RETIRED `/discover/leads` dashboard
// (M-LEADS-TRUTH R-35.36 — now a redirect stub) was permanently empty
// since F-07.41's mask landed, and nobody could see it from the compiler.
//
// THESE SIX FIELDS ARE THE WIRE, derived at dream-os `97166b1` from
// `src/lib/demo/maskDemoLead.js`'s `maskDemoLead()`, which is the ONLY shape
// `GET /api/v2/demo/vendor/:handle/leads` returns (`src/api/demo/vendor.js`).
//
// `bride_phone`, `bride_email` and `bride_ig_handle` are ABSENT BY CONSTRUCTION on the
// server — they are excluded from `MASKED_SELECT`, so they never leave the database.
// That is G-4's "contact blurred" half, and it is why this type must not name them:
// a type that declares a secret invites a consumer to read one.
export interface DemoLead {
  id:           string;
  /** Masked: first name + surname initial — "Priya Sharma" → "Priya S." */
  bride_name:   string;
  /** Month + year, or NULL. NEVER the string 'upcoming' — that is the WhatsApp
   *  template's fallback and the server stopped handing it to web surfaces at P3.
   *  NULL means OMIT THE LINE. */
  wedding_when: string | null;
  /** NULL means OMIT THE LINE. Never "city not given". */
  wedding_city: string | null;
  /** The band's CEILING in whole rupees (`0108`). NULL on every lead captured before
   *  2026-08-03. NULL means OMIT THE LINE — never a blank, a dash, or a shimmer. */
  budget_max:   number | null;
  created_at:   string;
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

// ── TDW_08 P3 · F-08.30 · THE FOURTH DUPLICATE, NAMED WHERE IT LIVES ─────────
// This is a THIRD declaration of the shape `lib/types/discover.ts:4` already owns,
// and its only consumer is `fetchDemoDiscoverFeed` below — which has ZERO callers
// anywhere in the tree. The type and the orphan die in one act, and that act is not
// P3's: P3 imports the SHARED type for the mirror (see `DiscoverVendorType` above)
// rather than growing this one a second consumer. Named so its survival reads as a
// decision rather than an oversight.
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

// ── TDW_08 P3 · `card` ARRIVES BESIDE `vendor`, NOT INSTEAD OF IT ────────────
// `vendor` is byte-unchanged on the wire and three surfaces still read it by name
// (this landing's carousel, /discover, /portfolio). `card` is the couple-shaped
// `DiscoverVendor` that `components/shared/VendorProfileView` requires — produced by
// the SAME server function the couple feed calls (`src/lib/discover/shapeDemoRow.js`,
// dream-os `97166b1`), so the mirror is the couple's card by construction and not by
// a client-side copy that agrees today.
//
// `DemoVendor` is NOT a `DiscoverVendor` and never was: four required fields absent
// (`starting_price`, `vibe_tags`, `enquire_link`, `instagram_handle`), `photos` a
// different type, two renames. That is why the shim is the server's and not this
// file's — a second shaper on the client is exactly what P4b's parity law forbids.
export async function fetchDemoVendor(
  handle: string,
): Promise<{ ok: true; vendor: DemoVendor; card: DiscoverVendorType }> {
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
