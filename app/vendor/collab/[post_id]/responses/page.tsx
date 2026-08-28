'use client';
// app/vendor/collab/[post_id]/responses/page.tsx — THE SURVIVING FALLBACK ROUTE.
//
// ── §4-4 BATCH ③ · THE INTERIOR CROSSED WITH ITS ROOM ─────────────────────
// The thread the vendor reaches from a crossed Collab is `/w/collab/[post_id]/responses`
// now. This route is not deleted and must not be: R-38.11's "nothing deletes" holds until
// Phase 7 retires `app/vendor/layout.tsx` with the whole old tree, and a vendor on a stale
// bookmark or a service-worker cache still lands here. The parent's own tree-aware push
// keeps her in whichever tree she started in.
//
// ── IT OWNS THE CHROME ────────────────────────────────────────────────────
// `<Header/>` is mounted HERE and imported HERE, and it appears in no file the shell's
// chunk can reach. A conditional does not remove a module from a bundle.
//
// ── THE MOUNT CENSUS HOLDS AT 1 FOR THIS PATH ─────────────────────────────
// Body and route were ONE file, so the mount moved WITHIN the crossing rather than out of
// it. TWO PATHS MOVE IN THIS CUT AND BOTH HOLD AT 1 — the census states both movements,
// which R-38.11 as amended asks for and which a number alone could not show.
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { ResponsesScreen } from '@/app/vendor/collab/[post_id]/responses/screen';

export default function CollabResponsesPage() {
  const params  = useParams<{ post_id: string }>();
  const post_id = params?.post_id ?? '';
  const router  = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Header vendorName={session.name ?? null} />
      <ResponsesScreen post_id={post_id} />
    </div>
  );
}
