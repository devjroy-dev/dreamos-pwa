// The Dream Wedding — Service Worker v7
// Strategy: Cache images only. Never cache pages or API. Always network-first for HTML/JS.
//
// ── TDW_07 P4b-FINAL · F-07.33 — THE 503s IN THIS FILE ARE MANUFACTURED HERE. ──────────
// A recurring `discover:1  Failed to load resource: the server responded with a status of
// 503 ()` was sighted twice on founder walks (P1, then the P4b preview walk), both times
// beside a Service-Worker update line, with DevTools "Preserve log" on.
//
// DERIVED, NOT GUESSED — what this file does:
//   Every `.catch()` below synthesises a Response. `fetch()` only REJECTS on a
//   network-layer failure (offline, DNS, connection reset, an SW terminated mid-flight);
//   an HTTP error status RESOLVES and passes through untouched. So a 503 logged by the
//   browser is EITHER a real upstream 503 that passed through, OR one of these synthetic
//   ones. From the page's side the two are indistinguishable, because to the page the
//   service worker IS the server. That ambiguity is the reason this finding stayed open.
//
// ONE CANDIDATE IS EXCLUDED BY DERIVATION: `discover:1` is the `/discover` PAGE DOCUMENT,
// which is a Next.js route served by Vercel (app/(landing)/discover). The Railway branch
// below keys on `railway.app`, `/api/` or `/admin` — a page document matches none of them,
// and Railway never serves that path. **A Railway cold start cannot produce this line.**
//
// THE REMAINING CANDIDATE, and why it fits: `install` calls `skipWaiting()` and `activate`
// purges EVERY cache then calls `clients.claim()`. So an updating worker takes over a live
// page and wipes the caches underneath it. Requests in flight across that handover can have
// their `fetch()` rejected, fall into a `.catch()`, find the cache just emptied, and get a
// synthetic 503 — self-inflicted, harmless, and looking exactly like an upstream outage.
// That matches both sightings sitting beside an SW-update line.
//
// NOT CLOSED — INSTRUMENTED. The above is a mechanism that FITS the evidence, and a fit is
// not a proof. Each synthetic response below now carries `X-TDW-SW-Synthetic` naming the
// branch that made it, so the NEXT sighting identifies itself: a header means this file
// produced it, no header means the 503 is real and upstream. The finding closes on that
// evidence rather than on this paragraph.

const CACHE_NAME = 'tdw-v6';
const IMAGE_CACHE = 'tdw-images-v6';

// ── TDW_19 P2-A · F-19.36 · THE PUBLIC ROUTES ARE NOT THIS WORKER'S ─────────
// `/v/<code>` and `/r/<code>` are the estate's public per-vendor addresses. A
// couple reaches them from a WhatsApp forward with no session and no reason to
// have this app installed — and until now one visit to the landing page was
// enough for this worker to claim them, because the registrar sat in the ROOT
// layout and `register('/sw.js')` with no `scope` defaults to the whole origin.
//
// THE STRUCTURAL CURE IS THE REGISTRAR MOVE, not this list: the registrar now
// mounts per authenticated shell (`/vendor`, `/w`, `/coplanner`, the frost
// deck), so a browser that has only ever seen public pages never registers at
// all. This list exists for the browsers ALREADY CLAIMED, who keep the
// origin-wide registration until this file's bytes change.
//
// ⚠ IT IS A BYPASS AND NOT AN UNREGISTER, AND THE CHOICE IS RULED (c-38.40).
// Calling `registration.unregister()` when a public route is opened would end
// the worker for the WHOLE ORIGIN on that browser — killing push and the image
// cache for a vendor whose only sin was tapping a friend's storefront link. The
// cure must not outcost the disease. Returning without `respondWith` makes this
// worker transparent on these paths: the browser fetches them natively, exactly
// as it would with no worker installed.
//
// F-19.36 also records what this worker was CLEARED of. It cannot serve a stale
// document by any path: navigations are network-first and no `cache.put` touches
// a navigation anywhere below, and `activate` purges every cache. The chair's
// hypothesis was that a cached pre-S4 page explained the founder's walk; reading
// this file refuted it. The bypass is not that cure — it is the scope cure.
const PUBLIC_PREFIXES = ['/v/', '/r/'];

// ── Install: skip waiting immediately, no pre-caching of pages ───────────────
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// ── Activate: purge all old caches ───────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  // ── TDW P0-1 · R-36.7 — NON-GETs ARE NEVER INTERCEPTED. ────────────────────
  // WHY, from a founder-witnessed incident (2026-08-23): iOS/iPad vendors could
  // not upload portfolio photos — the direct Cloudinary POST died on the phone
  // (no asset, no vendor_portfolio row), while macOS succeeded through the same
  // SW-controlled session. A POST to cloudinary.com matched the image branch
  // below by HOSTNAME, and that branch is built for GETs only: the Cache API
  // cannot hold non-GETs — `cache.put()` REJECTS on a POST request — so routing
  // a POST through `respondWith` on that branch turns the upload into a network
  // error the page reads as a dead server. There is nothing to cache in a
  // non-GET anyway: every POST/PATCH/DELETE on this estate is a write, and a
  // write must reach its server or fail honestly — never be answered by a cache
  // or a synthetic response. So the browser handles all non-GETs natively; this
  // worker never sees them past this line.
  if (event.request.method !== 'GET') return;

  const { request } = event;
  const url = new URL(request.url);

  // Same-origin public routes: hands off, entirely. Checked before every other
  // branch so no later rule can claim them back, and scoped to this origin so a
  // third-party URL that happens to contain `/v/` is unaffected.
  if (url.origin === self.location.origin &&
      PUBLIC_PREFIXES.some((p) => url.pathname.startsWith(p))) {
    return;
  }

  // Always network-first, no caching: API, Railway backend, admin
  if (
    url.hostname.includes('railway.app') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin')
  ) {
    event.respondWith(
      // F-07.33 instrumentation — see the header. `api-or-railway` means the network call
      // to the backend REJECTED; it does not mean the backend returned 503.
      fetch(request).catch(() => new Response('', {
        status: 503, headers: { 'X-TDW-SW-Synthetic': 'api-or-railway' },
      }))
    );
    return;
  }

  // Always network-first, no caching: Next.js pages and JS bundles
  // These are content-hashed by Next.js — caching them causes stale bundle issues
  if (
    request.mode === 'navigate' ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.endsWith('.html')
  ) {
    event.respondWith(
      // F-07.33 instrumentation. THIS is the branch a page document such as `/discover`
      // falls into — `request.mode === 'navigate'`. If the next sighting carries this
      // header, the 503 was made here and no server was ever unhealthy.
      fetch(request).catch(() =>
        caches.match(request).then((cached) => cached || new Response('Offline', {
          status: 503, headers: { 'X-TDW-SW-Synthetic': 'navigate' },
        }))
      )
    );
    return;
  }

  // Cache-first: images only (Cloudinary, Unsplash, static image files)
  const isImage =
    url.hostname.includes('unsplash.com') ||
    url.hostname.includes('cloudinary.com') ||
    /\.(png|jpg|jpeg|webp|avif|gif|svg)(\?|$)/i.test(url.pathname);

  if (isImage) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => new Response('', { status: 404 }));
        })
      )
    );
    return;
  }

  // Everything else: network-first, no caching
  event.respondWith(
    // F-07.33 instrumentation — the catch-all branch (fonts, JSON, anything unclassified).
    fetch(request).catch(() =>
      caches.match(request).then((cached) => cached || new Response('', {
        status: 503, headers: { 'X-TDW-SW-Synthetic': 'other' },
      }))
    )
  );
});

// ── Push notifications ────────────────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { title: 'TDW', body: event.data.text() }; }
  const options = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: data.url || '/' },
    vibrate: [100, 50, 100],
    requireInteraction: data.requireInteraction || false,
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'The Dream Wedding', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
