"use client";
// app/vendor/(shell)/your-website/page.tsx
// TDW · BLOCK 19 · G3.1 sitting 2 — YOUR WEBSITE & SEO, A PAGE OFF THE REGISTRY (R-40.132).
//
// The hub row `Your website & SEO` (solutions/copy.ts) opens WEBSITE_HREF
// (solutions/routes.ts) — this page. It is NOT a room in lib/worklist/rooms.ts:
// Storefront (sitting 1's room, restored byte for byte at 82612b3) keeps the
// tile, the pin and the count; this is the wedding-pages shape (R-G11.12), a
// shell page reached from the hub, with its own masthead byte (COPY.websiteTitle,
// R-40.122: the plain name inside; the sold word on the row that opens it).
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { YourWebsiteScreen } from './screen';

export default function YourWebsitePage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.websiteTitle}>
      <RoomBody><YourWebsiteScreen vendorId={session.id} /></RoomBody>
    </WorklistShell>
  );
}
