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
        // Shape demo_leads to match Lead interface
        const shaped: Lead[] = res.leads.map(l => ({
          id:                l.id,
          name:              l.bride_name,
          phone:             l.bride_phone,
          wedding_date:      l.bride_wedding_date,
          wedding_city:      l.bride_wedding_city,
          budget_total:      null,
          state:             l.state || 'new',
          source:            'discover',
          referrer:          null,
          raw_message:       l.raw_message,
          created_at:        l.created_at,
        } as Lead));
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
