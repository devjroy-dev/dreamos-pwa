'use client';
// app/wedding/auth/handoff/page.tsx
// Legacy handoff page — kept as fallback only.
// New flow: GET /api/auth/set-session sets first-party cookies on navigation.
// This page handles any residual ?token= redirects from old thedreamwedding.in links.

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { setVendorSession } from '@/lib/vendor/session';

function HandoffInner() {
  const router  = useRouter();
  const params  = useSearchParams();

  useEffect(() => {
    // First try cookie (set by GET /api/auth/set-session on navigation)
    try {
      const cookieMatch = document.cookie.split('; ').find(r => r.startsWith('tdw_vendor_session='));
      if (cookieMatch) {
        const parsed = JSON.parse(decodeURIComponent(cookieMatch.split('=').slice(1).join('=')));
        if (parsed?.access_token) {
          setVendorSession(parsed); // writes cookies + localStorage (try-catch internally)
          router.replace('/vendor');
          return;
        }
      }
    } catch (_e) { /* fall through to URL param */ }

    // Fallback: URL param (old flow — may be stripped by ITP on iOS Safari)
    const token   = params.get('token')   ?? '';
    const refresh = params.get('refresh') ?? '';

    if (!token) {
      router.replace('/');
      return;
    }

    fetch(`https://dream-os-production.up.railway.app/api/v2/vendor/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (!data.ok || !data.vendor) { router.replace('/'); return; }
        const session = {
          id:             data.vendor.id,
          user_id:        data.vendor.user_id        ?? '',
          name:           data.vendor.name           ?? null,
          phone:          data.vendor.phone          ?? null,
          tier:           data.vendor.tier           ?? 'signature',
          routing_handle: data.vendor.routing_handle ?? null,
          access_token:   token,
          refresh_token:  refresh || token,
        };
        setVendorSession(session); // handles localStorage throw + always sets cookies
        router.replace('/vendor');
      })
      .catch(() => { router.replace('/'); });
  }, [params, router]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0C0A09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-jost, system-ui, sans-serif)', fontWeight: 200, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)' }}>
        DreamAi
      </div>
    </div>
  );
}

export default function HandoffPage() {
  return (
    <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#0C0A09' }} />}>
      <HandoffInner />
    </Suspense>
  );
}
