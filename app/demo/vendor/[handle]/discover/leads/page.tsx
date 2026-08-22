'use client';
// app/demo/vendor/[handle]/discover/leads/page.tsx — RETIRED. Redirect stub.
//
// The demo shell mirrors the product (R-35.36). The product's storefront Leads
// dashboard is retired to a stub because its `source === 'discover'` filter
// could not see deduped enquiries (F-16.21); the demo's copy of that page had
// the same shape and goes the same way. The demo offers its own /business and
// /list routes, so the shell's Leads entry repoints there rather than vanishing.
//
// The route is kept, not deleted, for the same reason as the product's: a link
// that was ever shown to anyone must not become a 404.

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function RetiredDemoDiscoverLeads() {
  const router = useRouter();
  const params = useParams<{ handle: string }>();
  useEffect(() => {
    const handle = params?.handle;
    router.replace(handle ? `/demo/vendor/${handle}/business` : '/demo');
  }, [router, params]);
  return null;
}
