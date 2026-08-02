'use client';
// hooks/demo/useDemoVendorData.ts
// Demo equivalents of useVendorData hooks.
// Returns same LoadState<T> shape so real list pages can use them directly.
// Leads come from the demo backend. Everything else is static mock data.
// NO auth. NO session.

import { useEffect, useState } from 'react';
import { fetchDemoLeads } from '@/lib/demo/api';
import type { Client, Lead, Invoice, Expense, VendorEvent } from '@/lib/vendor/types/vendor';

interface LoadState<T> {
  data:    T | null;
  loading: boolean;
  error:   string | null;
  refresh: () => void;
}

function noop() {}

// ── Demo Leads — real seeded data from demo_leads table ─────────────────────
export function useDemoLeadsData(handle: string): LoadState<Lead[]> {
  const [data,    setData]    = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetchDemoLeads(handle)
      .then(res => {
        // ── TDW_08 P3 · F-08.34 · EVERY FIELD THE WIRE DOES NOT CARRY IS AN EXPLICIT
        //    CONSTANT WITH ITS REASON. NOT ONE PHANTOM READ SURVIVES. ────────────────
        // This mapper read `bride_phone`, `bride_wedding_date`, `bride_wedding_city`,
        // `state` and `raw_message` off a `DemoLead` that declared them and a wire that
        // has never sent them. Every one resolved `undefined`. The subtitle under every
        // bride's name on /discover/leads has been permanently empty since F-07.41's
        // mask landed, and no compiler could say so, because the TYPE was the lie.
        //
        // THE `as Lead` CAST IS GONE. It was the second silencer: even a corrected
        // `DemoLead` would have been asserted onward into `Lead`, leaving tsc gagged
        // about the TARGET shape too. Correcting one silencer and keeping the other
        // buys a compiler that agrees with you for the wrong reason.
        const shaped: Lead[] = res.leads.map((l): Lead => ({
          id:                l.id,
          name:              l.bride_name,
          // ABSENT BY CONSTRUCTION, not by omission. `bride_phone`/`bride_email`/
          // `bride_ig_handle` are excluded from MASKED_SELECT on the server, so they
          // never leave the database — G-4's "contact blurred" half. A demo lead has
          // no phone on any surface until the vendor claims.
          phone:             null,
          // The wire carries MONTH + YEAR (`wedding_when`), never an exact day: an
          // exact date plus a city plus a vendor is close to an identification.
          // `Lead.wedding_date` wants a date, so the month phrase cannot honestly go
          // here — it is rendered from the tease's own read, not through this shape.
          wedding_date:      null,
          // ── THE ONE-TOKEN CURE, FORCED BY THE TYPE ───────────────────────────────
          // This read `l.bride_wedding_city` against a wire that sends `wedding_city`.
          // tsc named the fix itself once the type stopped lying.
          wedding_city:      l.wedding_city,
          // COVERAGE-MAP LAW (F-04.33/38) — `budget_max` IS on the wire since `0108`
          // and is DELIBERATELY NOT MAPPED HERE. `Lead.budget_total` is a total; the
          // demo wire carries a band CEILING, and calling one the other would mint
          // F-08.28's disease (one name, two meanings) on a screen. The tease renders
          // the ceiling from its own read, labelled "Budget up to". Stated, not silent.
          budget_total:      null,
          // ── F-08.34 · A CONSTANT, STATED AS ONE (F-06.85) ────────────────────────
          // `demo_leads` has FIFTEEN columns after `0108` and NO `state` column, and
          // there is no mechanism anywhere to action or book a demo lead. So this is
          // not a fallback over a missing read — it is a CONSTANT, and the zeros the
          // two counters at discover/leads/page.tsx:15 and :17 render are structurally
          // TRUE today rather than fabricated.
          //
          // IT BECOMES FALSE THE DAY DEMO LEADS GAIN A LIFECYCLE. `scripts/
          // tdw08_p3_landing.proof.mjs` §F0834 reds if `demo_leads` acquires a state
          // column while this constant still stands. A witness over a gap is the
          // difference between a gap and a silence.
          state:             'new',
          source:            'discover',
          referrer:          null,
          // No `raw_message` column on `demo_leads` — F-07.42 convicted the server-side
          // read of this exact phantom; this was its client-side twin.
          raw_message:       null,
          created_at:        l.created_at,
        }));
        setData(shaped);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { if (handle) load(); }, [handle]);

  return { data, loading, error, refresh: load };
}

// ── Demo Clients — empty (no real clients in demo) ───────────────────────────
export function useDemoClientsData(): LoadState<Client[]> {
  return { data: [], loading: false, error: null, refresh: noop };
}

// ── Demo Invoices — empty ────────────────────────────────────────────────────
export function useDemoInvoicesData(): LoadState<Invoice[]> {
  return { data: [], loading: false, error: null, refresh: noop };
}

// ── Demo Expenses — empty ────────────────────────────────────────────────────
export function useDemoExpensesData(): LoadState<Expense[]> {
  return { data: [], loading: false, error: null, refresh: noop };
}

// ── Demo Events — mock calendar events ───────────────────────────────────────
function demoEvents(): VendorEvent[] {
  const today = new Date();
  function addDays(n: number) {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }
  return [
    { id: 'ev1', title: 'Bridal Trial — Meera Kapoor',          kind: 'trial',    event_date: addDays(1),  event_time: '11:00:00', state: 'upcoming', lead_id: null, notes: null },
    { id: 'ev2', title: 'Shoot — Riya & Dev (Palace Wedding)',   kind: 'shoot',    event_date: addDays(10), event_time: '06:00:00', state: 'upcoming', lead_id: null, notes: null },
    { id: 'ev3', title: 'Consultation — Ananya Sharma',          kind: 'call',     event_date: addDays(12), event_time: '15:00:00', state: 'upcoming', lead_id: null, notes: null },
    { id: 'ev4', title: 'Wedding Day — Mansi Gupta (Jaisalmer)', kind: 'ceremony', event_date: addDays(17), event_time: '05:00:00', state: 'upcoming', lead_id: null, notes: null },
    { id: 'ev5', title: 'Bridal Trial — Simran Oberoi',          kind: 'trial',    event_date: addDays(25), event_time: '12:00:00', state: 'upcoming', lead_id: null, notes: null },
  ];
}

export function useDemoEventsData(): LoadState<VendorEvent[]> {
  return { data: demoEvents(), loading: false, error: null, refresh: noop };
}
