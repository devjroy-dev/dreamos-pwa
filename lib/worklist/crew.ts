'use client';
// lib/worklist/crew.ts — DESIGN-1 · STAGE 2 · THE CREW, WHEREVER AN EVENT SHOWS.
//
// docs/review/REPORT.md §2 (e) and finding E6: the first question on a shoot day is "who is coming", and the
// crew lived only in the Calendar's day sheet, behind a Crew button, one event at a time. The bands door
// (GET /api/v2/vendor/bands/:vendorId?from&to) already carries every function's crew with its confirmation,
// so this is ONE read for a window, shared by Home, the Events rows and the Calendar. No new door, no write.
//
// THE WORDS. First names, in the order the wire gives them; a member who has not answered says so, and a
// member who declined says so. A function nobody is on says "No crew yet", which the surfaces draw in the
// critical ink (REPORT.md: "No crew yet" in red). Words, not glyphs: a tick and a clock are not in Inter,
// and a glyph in a fallback face is the one thing the stage's face rule forbids.
import { useEffect, useState } from 'react';
import { fetchBands } from '@/lib/vendor/api/vendor';
import type { BandCrew, BandFunction } from '@/lib/vendor/types/vendor';

export const CREW_WORDS = {
  none:     'No crew yet',
  pending:  'not replied yet',
  declined: 'declined',
} as const;

export function firstName(name: string): string {
  return (name || '').trim().split(/\s+/)[0] || name;
}

/** "Rhea, Arjun (not replied yet)" — or null when nobody is on it (the caller draws CREW_WORDS.none). */
export function crewWords(crew: readonly BandCrew[] | undefined | null): string | null {
  if (!crew || crew.length === 0) return null;
  return crew.map((c) => firstName(c.name) + (c.confirmation === 'pending' ? ` (${CREW_WORDS.pending})`
    : c.confirmation === 'declined' ? ` (${CREW_WORDS.declined})` : '')).join(', ');
}

/** A function as the surfaces read it: the band's own fields and the booking it belongs to. */
export type CrewFunction = BandFunction & { binder: string | null };

export interface CrewReading {
  /** event id -> its crew (an empty array is a function with nobody on it). */
  byEvent: Map<string, BandCrew[]>;
  /** every function in the window, earliest first. */
  functions: CrewFunction[];
  loaded: boolean;
}

const EMPTY: CrewReading = { byEvent: new Map(), functions: [], loaded: false };

export function useCrew(vendorId: string | null | undefined, from: string, to: string): CrewReading {
  const [reading, setReading] = useState<CrewReading>(EMPTY);
  useEffect(() => {
    if (!vendorId) return;
    let live = true;
    fetchBands(vendorId, from, to).then((r) => {
      if (!live || !r || !('bands' in r) || !r.ok) { if (live) setReading({ ...EMPTY, loaded: true }); return; }
      const functions: CrewFunction[] = [
        ...(r.bands ?? []).flatMap((b) => (b.functions ?? []).map((f) => ({ ...f, binder: b.title }))),
        ...(r.loose ?? []).map((f) => ({ ...f, binder: null })),
      ].sort((a, b) => (a.date + (a.event_time ?? '')).localeCompare(b.date + (b.event_time ?? '')));
      const byEvent = new Map<string, BandCrew[]>();
      for (const f of functions) byEvent.set(f.event_id, f.crew ?? []);
      setReading({ byEvent, functions, loaded: true });
    }).catch(() => { if (live) setReading({ ...EMPTY, loaded: true }); });
    return () => { live = false; };
  }, [vendorId, from, to]);
  return reading;
}
