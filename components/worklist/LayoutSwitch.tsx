'use client';
// components/worklist/LayoutSwitch.tsx · DESIGN-1 · THE LAYOUT SWITCH, at the shell's root (lib/worklist/layoutSwitch.ts).
// Mounted once in each shell layout with the tree it serves. It asks /me which layout this vendor has; when the answer is
// a layout and differs from the cookie, it writes the cookie; when it also differs from the tree on screen, it reloads
// once so middleware.ts serves the other tree. An /me without the field (an older server, a mock) changes nothing.
import { useEffect } from 'react';
import { getJson } from '@/lib/vendor/api/_base';
import { LAYOUT_COOKIE, asLayout, type Layout } from '@/lib/worklist/layoutSwitch';

const RELOADED = 'tdw_layout_reloaded';

export function LayoutSwitch({ tree }: { tree: Layout }) {
  useEffect(() => {
    let live = true;
    getJson<{ ok?: boolean; vendor?: { layout?: unknown } }>('/api/v2/vendor/me').then((r) => {
      const want = asLayout(r && r.vendor && r.vendor.layout);
      if (!live || !want) return;
      const have = asLayout((document.cookie.match(new RegExp('(?:^|; )' + LAYOUT_COOKIE + '=([^;]*)')) || [])[1]);
      if (have !== want) document.cookie = `${LAYOUT_COOKIE}=${want}; path=/; max-age=31536000; samesite=lax`;
      if (want !== tree) {
        // once per tab: a middleware that did not serve the other tree must not become a reload loop
        try { if (sessionStorage.getItem(RELOADED) === want) return; sessionStorage.setItem(RELOADED, want); } catch (_e) { return; }
        window.location.reload();
      } else {
        try { sessionStorage.removeItem(RELOADED); } catch (_e) { /* fine */ }
      }
    }).catch(() => { /* an unread /me changes nothing */ });
    return () => { live = false; };
  }, [tree]);
  return null;
}
