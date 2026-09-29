"use client";
// app/w/page.tsx — THE BARE SHELL RESOLVES TO ROOMS (R-37.75).
//
// The manifest's start_url points straight at /w/rooms, so a home-screen launch never comes
// through here. This exists so that NO entry path disagrees with the manifest: a typed URL, a
// shared link, a stale bookmark, the service worker's own navigation fallback — all land on
// the grid. An app that opens on the directory from the icon and on the placeholder from a
// link is an app arguing with itself.
//
// WHY ROOMS AND NOT TODAY, recorded so the revisit has its reasoning: Today is a placeholder
// until Phases 3-4 land a real feed. Defaulting to the empty room over the working directory
// would be ceremony over usability. When the live brief ships, the default is re-tasted.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorklistIndex() {
  const router = useRouter();
  useEffect(() => { router.replace('/vendor/rooms'); }, [router]);
  return <div style={{ minHeight: '100dvh', background: 'var(--atelier-page-bg)' }} aria-busy="true" />;
}
