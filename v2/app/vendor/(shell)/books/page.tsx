"use client";
// app/w/books/page.tsx — BOOKS, THE NINETEENTH ROOM. ROAD STEP 2b · R-38.10.
//
// ── THE ONE ROOM BORN INSIDE THE SHELL ──────────────────────────────────────
// Every other room in `app/w/` CROSSED: it existed under `/vendor`, kept its
// body, and gained the shell's layout (R-38.11/R-38.12 — the body is imported,
// never copied, so two list screens never become two homes). This one has no
// fallback twin and never had one. There is nothing under `/vendor/books`, so
// nothing to import and nothing to keep in step.
//
// That is why `BooksBody` reads CSS VARIABLES ONLY and carries none of the
// thirty colour literals F-38.22 captures in the slice tree. A crossed room
// inherited those literals and they were priced rather than swept; a new room
// that acquired them would be adding to a declared debt on purpose.
//
// ── THE TYPED PLANE, ALONE ON THIS BRANCH ───────────────────────────────────
// `GET /api/v2/vendor/money/books/:vendorId` reads public.invoices ⋈
// public.payment_schedules and public.expenses. The Invoices and Expenses rooms
// two tiles to the left still read `engine.records`, where F-39.3 measured zero
// money for all 28 vendors. Both facts are true at once and the room does not
// try to reconcile them — 2c crosses those two, reads and writes together.
//
// ── ZERO VERBS ──────────────────────────────────────────────────────────────
// The body mounts no interactive control at all. The masthead, bottom nav and
// ask dock are the SHELL's, on every room, and are not this room's to own —
// which is the boundary the read-only cell asserts against: the Books module and
// its import graph, never the rendered tree.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { useState as useS, useEffect as useE } from 'react';
import { fetchBooks } from '@/v2/lib/vendor/api/vendor';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { RECORD_CSS, Facts } from '@/v2/components/worklist/RecordPage';
import { dayInWords } from '@/v2/lib/worklist/dayInWords';
import type { BooksResponse } from '@/lib/vendor/types/vendor';
import { COPY } from '@/v2/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';

export default function ShellBooksPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.booksTitle}>
      <RoomBody><BooksRoom vendorId={session.id} /></RoomBody>
    </WorklistShell>
  );
}

// CE-47 L4b (FE-7): Books as FE-6's approved frame (board 9): Total received and Outstanding, then Money movements as
// rows ("Received · <date>" or "Paid out · <date>", the amount at the right; no plus or minus signs, R-45.30). The same
// door as BooksBody (fetchBooks), which stays untouched for Team and StudioSheets. No Export CSV (the room has none).
const BKW = { received: 'Total received', outstanding: 'Outstanding', movements: 'Money movements', in: 'Received', out: 'Paid out',
  none: 'No money movements yet.', failed: 'We could not load your books just now.' } as const;
const Rs = (n: number | null | undefined) => `Rs ${Number(n ?? 0).toLocaleString('en-IN')}`;
function BooksRoom({ vendorId }: { vendorId: string }) {
  const [b, setB] = useS<BooksResponse | null>(null); const [bad, setBad] = useS(false);
  useE(() => { let live = true; fetchBooks(vendorId).then((r) => { if (!live) return; if (r && r.ok) setB(r); else setBad(true); }).catch(() => live && setBad(true)); return () => { live = false; }; }, [vendorId]);
  if (bad) return <Body><p className="fr-empty">{BKW.failed}</p><style>{FR_CSS}</style></Body>;
  if (!b) return <div aria-busy="true" />;
  const moves = (b.movements ?? []).slice().reverse();
  return (
    <Body>
      <Facts rows={[[BKW.received, Rs(b.received)], [BKW.outstanding, Rs(b.outstanding)]]} />
      <Head text={BKW.movements} />
      {moves.length === 0 ? <p className="fr-empty">{BKW.none}</p> : (
        <Group>{moves.map((m, i) => {
          const isIn = (m.credit ?? 0) > 0; const p = m.particular || {};
          const who = isIn ? (p.client_name || p.invoice_number || '\u2014') : (p.description || p.category || '\u2014');
          return <Row key={i} title={who} facts={`${isIn ? BKW.in : BKW.out} \u00b7 ${dayInWords(m.date)}`} value={Rs(isIn ? m.credit : m.debit)} />;
        })}</Group>
      )}
      <style>{FR_CSS + RECORD_CSS}</style>
    </Body>
  );
}
