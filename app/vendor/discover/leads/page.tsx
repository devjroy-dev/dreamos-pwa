'use client';
// app/vendor/discover/leads/page.tsx — RETIRED. This is a redirect stub.
//
// ══════════════════════════════════════════════════════════════════════════════
// WHY THIS PAGE IS GONE, AND WHY THE ROUTE IS NOT (F-16.21 · R-35.36)
// ══════════════════════════════════════════════════════════════════════════════
// This was the storefront "value proof" dashboard. It filtered leads with
//     l.source === 'discover' || referrer matches handle
// and that predicate cannot be satisfied by the path most enquiries take:
// `createLead` DEDUPES on (vendor_id, phone) and returns the existing row
// untouched, so a bride enquiring from a number the vendor already knows
// produces no row carrying source 'discover'. Witnessed in production on
// 2026-08-21 — a real Discover enquiry landed, the vendor's WhatsApp alert
// fired, the alert's link pointed HERE, and this page rendered
// "No TDW leads yet." The estate announced something and then denied it.
//
// The founder ruled: consolidate — the storefront is profile and portfolio,
// not leads. THE TRUTH MOVED TO BUSINESS LEADS, which filters on nothing but
// vendor_id and deleted_at and therefore holds every lead however it arrived.
// It now carries the arrival date on every row and a TDW badge on the ones the
// TDW_16 engagements spine actually backs — read through the linkage, never off
// `leads.source`, which is the column that could never tell the truth here.
//
// THE ROUTE SURVIVES DELIBERATELY. Every enquiry alert already delivered
// carries this URL in some vendor's WhatsApp history, forever. Deleting the
// route outright would 404 a founding partner tapping last week's message —
// F-16.21's wound reopened by its own cure. So the page becomes a stub that
// forwards, and scripts/b07_p5_bench.js §12.3 pins that it still resolves while
// §12.4 pins that it never grows data logic again (two Leads dashboards drifting
// apart is what §12.3 was originally minted to prevent).

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RetiredDiscoverLeads() {
  const router = useRouter();
  useEffect(() => { router.replace('/vendor/list/leads'); }, [router]);
  return null;
}
