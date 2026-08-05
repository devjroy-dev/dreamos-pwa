'use client';

// app/wedding/calendar/page.tsx — Atelier rebuild
//
// Visual language: Italiana display + Cormorant italic + Jost micro-labels.
// Same data, same hooks, same logic. Only the surface changes.

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useEventsData, useEventsWindow } from '@/hooks/vendor/useVendorData';
import { useHotDates } from '@/hooks/vendor/useHotDates';
import type { VendorEvent } from '@/lib/vendor/types/vendor';
import { Header } from '@/components/vendor/Header';
import { CalendarBlockSheet } from '@/components/vendor/CalendarBlockSheet';
import { CalendarDaySheet } from '@/components/vendor/CalendarDaySheet';
import { CalendarCrewSheet } from '@/components/vendor/CalendarCrewSheet';
import { CalendarBands } from '@/components/vendor/CalendarBands';   // TDW_04.5 P2 — the band view
import { AddSheet } from '@/components/vendor/AddSheet';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchAvailability, fetchHotDates } from '@/lib/vendor/api/vendor';
import type { AvailabilityBlock, HotDate, DayEvent, BandFunction, BandsResponse } from '@/lib/vendor/types/vendor';
import { fetchBands } from '@/lib/vendor/api/vendor';

// ── Atelier tokens ──────────────────────────────────────────────
const A = {
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassDeep: 'var(--role-metal)',
  brassLine: 'rgba(201,168,76,0.18)',
  brassSoft: 'rgba(201,168,76,0.28)',
  terracotta:'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['S','M','T','W','T','F','S'];

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function fmtShort(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (!m) return s;
  return `${parseInt(m[3])} ${MONTHS_SHORT[parseInt(m[2])-1]}`;
}
function splitDay(s: string): { day: string; month: string } {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (!m) return { day: s, month: '' };
  return { day: String(parseInt(m[3])), month: MONTHS_SHORT[parseInt(m[2])-1] };
}

export default function CalendarPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <CalendarScreen vendorId={session.id} vendorName={session.name ?? null} />;
}

function CalendarScreen({ vendorId, vendorName }: { vendorId: string; vendorName: string | null }) {
  const router = useRouter();
  const today  = useMemo(() => new Date(), []);
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  // B6-S2 (item 4): the DAY SHEET is the tap surface for every day — the old
  // `sel` popup's affordances (list, edit, cancel, the + prefill) all moved
  // into it, enriched per P5 (slots, chips, followups, muhurat, money due,
  // block toggles, Move with the inline verdict). One day, one surface.
  const [daySel, setDaySel] = useState<string | null>(null);
  const [hotOn, setHotOn] = useHotDates();
  const [blocks,   setBlocks]   = useState<AvailabilityBlock[]>([]);
  const [hotDates, setHotDates] = useState<HotDate[]>([]);
  const [blockSel, setBlockSel] = useState<string | null>(null);
  // Tap-to-edit a calendar event opens the form (direct write), never the AI.
  const [editRow, setEditRow] = useState<Record<string, unknown> | null>(null);
  const [crewEvent, setCrewEvent] = useState<DayEvent | null>(null);   // TDW_04.5 P1 #6 — the crew picker's target booking
  // TDW_04.5 P4 · F10(b): the picker's Post-to-Collab prefill needs the function's
  // DATE, which DayEvent does not carry. Both entry points already know it — the
  // band pip from fn.date, the day sheet from the day it is showing — so it is
  // handed down rather than re-derived inside the sheet.
  const [crewDate, setCrewDate] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  // ── TDW_04.5 P2 — THE MONTH · WEDDINGS TOGGLE ─────────────────────────────
  // IN-MEMORY ONLY, by spec §3 and §P2 both ("choice remembered per session
  // (in-memory, no storage APIs)"): plain React state. It survives month-nav and
  // every sheet, and it RESETS on a fresh load — the law witnessed by its own
  // amnesia, which is exactly what smoke step 2 checks.
  //
  // The DEFAULT is the server's to give (CE ruling F1(c)): `default_view` is computed
  // by normaliseCategory at src/api/vendor/bands.js, the same predicate's one home the
  // staffing-gap line asks. The client never re-decides who is a planner — which also
  // makes it immune to the real hazard the thumb-path derivation surfaced: sessions
  // minted before F-04.96 carry NO `category` at all, so any client-side test would
  // have silently floored every planner to Month.
  const [view, setView] = useState<'month' | 'weddings'>('month');
  const [viewSeeded, setViewSeeded] = useState(false);
  const [bandsRefresh, setBandsRefresh] = useState(0);
  // B6-S1 (R-B6-18's hedge): create-mode seed for the day-popup's + — the date,
  // prefilled. Cleared with the sheet.
  const [addSeed, setAddSeed] = useState<Record<string, string> | null>(null);
  const { toast, show: showToast } = useToast();

  const { data: events, refresh: refreshEvents } = useEventsData(vendorId);

  // ── TDW_04 B6-S1 — surfaces item 3, THE HORIZON CONTRACT (F-04.47's cure) ──
  // The GRID reads a deliberate window: the visible month ± one month, RE-FETCHED
  // on month-nav (before this, ‹/› moved React state over one stale 400-day fetch,
  // and HARD_CAP's .limit(200) silently truncated a busy studio). The RAIL below
  // stays on useEventsData's default horizon on purpose: "what's coming up" wants
  // the head of a date-asc sort, which truncation cannot touch — windowing it
  // would empty the rail for a season booked five months out.
  const win = useMemo(() => {
    const fy = month === 0 ? year - 1 : year;
    const fm = month === 0 ? 11 : month - 1;
    const ty = month === 11 ? year + 1 : year;
    const tm = month === 11 ? 0 : month + 1;
    return { from: iso(fy, fm, 1), to: iso(ty, tm, new Date(ty, tm + 1, 0).getDate()) };
  }, [year, month]);
  const { data: winData, refresh: refreshWindow } = useEventsWindow(vendorId, win.from, win.to);

  useEffect(() => {
    fetchAvailability(vendorId).then(res => { if (res.ok) setBlocks(res.blocks); }).catch(() => {});
    fetchHotDates().then(res => { if (res.ok) setHotDates(res.dates); }).catch(() => {});
  }, [vendorId]);

  function refreshBlocks() {
    fetchAvailability(vendorId).then(res => { if (res.ok) setBlocks(res.blocks); }).catch(() => {});
  }

  const hotSet = useMemo(() => new Set(hotDates.map(h => h.date)), [hotDates]);
  // B6-S2 (0078): a date can hold SEVERAL blocks (per-slot) — the map becomes
  // date -> block[]. The full hatch + dim is reserved for a FULL-DAY hold;
  // partial holds draw the dashed ring undimmed (the day still sells) — an
  // interim treatment, honest about "held" vs "gone", until the pips rider
  // (R-B6-19: heat-grid pips are post-S2 polish).
  const blockMap = useMemo(() => {
    const m = new Map<string, AvailabilityBlock[]>();
    for (const b of blocks) {
      const list = m.get(b.blocked_date) ?? [];
      list.push(b);
      m.set(b.blocked_date, list);
    }
    return m;
  }, [blocks]);

  const byDate = useMemo(() => {
    const map = new Map<string, VendorEvent[]>();
    // B6-S1: the grid's engagements come from the WINDOWED read (item 3).
    // RATIFY-OR-REVERT (named in the S1 census, F-04.36's exact shape): blocks are
    // excluded here. byDate feeds three surfaces — the day-cell engagement dot,
    // the day-popup list, and the BlockSheet's "on this day" list — and in all
    // three a block row was masquerading as an engagement (the dot lit on a
    // block-only day; the sheet listed the block beside itself). "Is this day
    // held" is blockMap's job (the hatch), fed by the blocks projection.
    for (const ev of winData?.events ?? []) {
      if (ev.kind === 'blocked') continue;
      const list = map.get(ev.event_date) ?? [];
      list.push(ev);
      map.set(ev.event_date, list);
    }
    return map;
  }, [winData]);

  const todayIso = iso(today.getFullYear(), today.getMonth(), today.getDate());

  // ── TDW_04 B1 SEAL RIDER — F-04.36 (CE-ruled 2026-07-15) ──────────────────
  // A BLOCK IS NOT AN ENGAGEMENT. Before B1, blocks lived in vendor_availability and
  // no events reader could see them. B1's convergence made them public.events rows,
  // so this filter — which never had a `kind` clause because it never needed one —
  // began listing them. Founder specimen 2026-07-15: "JUL 22 · BLOCKED · Out of town"
  // rendered under NEXT ENGAGEMENTS beside "JUL 19 · RECCE · Ananya - recce".
  // "Am I free that day" is the GRID's job (blockMap, the hatch). This rail answers
  // "what's coming up", and a day you've held is not a thing that's coming up.
  //
  // SCOPE: this is the ONE reader witnessed leaking. The general census — which of
  // the 57 public.events readers now see blocks, and which should — is B5's opening
  // item per the CE's split. Not attempted here.
  const nextThree = useMemo(() =>
    (events ?? [])
      .filter(e => e.event_date >= todayIso && e.state === 'upcoming' && e.kind !== 'blocked')
      .sort((a,b) => a.event_date < b.event_date ? -1 : 1)
      .slice(0, 3),
  [events, todayIso]);

  // Count this-month hot dates for the ribbon
  const hotThisMonth = useMemo(() => {
    const prefix = `${year}-${String(month+1).padStart(2,'0')}`;
    return hotDates.filter(h => h.date.startsWith(prefix)).length;
  }, [hotDates, year, month]);

  const firstDow    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const prevDays    = new Date(year, month, 0).getDate();

  function onAdd() {
    // The FAB's + keeps the chat primer (R-B6-18's ruling, unchanged). The
    // per-date variant retired with the popup: a date-anchored add now lives on
    // the day sheet's + Booking (mechanical, per the founder's priced gap).
    router.push(`/vendor?aiPrimer=${encodeURIComponent('What would you like me to add to the calendar? Give me a title, date, and time.')}`);
  }

  function refreshAll() { refreshEvents(); refreshWindow(); refreshBlocks(); setBandsRefresh(n => n + 1); }

  // TDW_04.5 P2: seed the opening view from the server's `default_view` — ONCE per
  // mount, and never again, so the vendor's own toggle is never overwritten by a
  // later re-fetch (a month-nav must not silently throw them back to Weddings).
  // Any failure leaves `view` at its 'month' initial value: the ruled fallback.
  useEffect(() => {
    if (viewSeeded) return;
    let live = true;
    fetchBands(vendorId, win.from, win.to)
      .then((r) => {
        if (!live) return;
        const d = r as BandsResponse;
        if (d && d.ok && d.default_view === 'weddings') setView('weddings');
      })
      .catch(() => { /* soft — Month stands, the ruled fallback */ })
      .finally(() => { if (live) setViewSeeded(true); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  // B6-S2 (item 6(b)): the AddSheet's "Block this day instead →" can arrive
  // from the LIST page via /vendor/calendar?block=YYYY-MM-DD — read once on
  // mount (window.location, no useSearchParams: keeps the page free of a
  // Suspense boundary and framework-agnostic per the native clause).
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get('block');
      if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) setBlockSel(q);
    } catch { /* no-op */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', position: 'relative' }}>

      <Header vendorName={vendorName} />

      {/* Scrollable body — calendar grid + engagements scroll together */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 110 }}>

      {/* ── TDW_04.5 P2 — the MONTH · WEDDINGS toggle (spec §P2: Jost, top-right) ──
          Two words, one hairline divider between them; the live one is brass, the
          other recedes. Same pill vocabulary as the Hot Dates toggle below, so the
          screen gains no second dialect. Copy founder-vetoed YES 2026-07-22. */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 22px 0' }}>
        <div role="group" aria-label="Calendar view" style={{
          display: 'flex', alignItems: 'center', gap: 9,
          border: `0.5px solid ${A.brassLine}`, borderRadius: 999, padding: '5px 12px',
        }}>
          {(['month', 'weddings'] as const).map((v, i) => (
            <span key={v} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              {i === 1 && <span style={{ width: '0.5px', height: 9, background: A.brassLine }} />}
              <button type="button" onClick={() => setView(v)} aria-pressed={view === v}
                style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 8,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                  color: view === v ? A.brassWarm : A.inkMute,
                }}>{v === 'month' ? 'Month' : 'Weddings'}</button>
            </span>
          ))}
        </div>
      </div>

      {/* ── Month spread — SHARED BY BOTH VIEWS (F-04.105) ────────────────────
          HOISTED ABOVE THE VIEW FORK, founder-caught at the P2 smoke: this header
          carries the ‹ › month navigation, and while it lived inside the month-only
          branch the band board was STRANDED on whatever month you left behind —
          reachable only by toggling to Month, navigating, and toggling back.
          `win` derives from this same month/year state (see the horizon contract
          above), so the board follows it with zero new wiring. ONE navigator, one
          home — a second prev/next inside CalendarBands would be a second control
          for one piece of state. The grid, weekday labels, hot-dates ribbon and the
          Next Engagements rail stay month-only (F5). ── */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        padding: '20px 22px 12px',
      }}>
        <button type="button"
          onClick={() => month === 0 ? (setYear(y=>y-1), setMonth(11)) : setMonth(m=>m-1)}
          aria-label="Previous month"
          style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-30%)',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--atelier-label)', fontFamily: F.display, fontSize: 26, lineHeight: 1,
          }}>‹</button>

        <div style={{
          fontFamily: F.label, fontWeight: 200, fontSize: 9,
          letterSpacing: '0.5em', textTransform: 'uppercase',
          color: 'var(--atelier-label)', marginBottom: 6,
        }}>Anno · {year}</div>
        <div style={{
          fontFamily: F.display, fontWeight: 400, fontSize: 46,
          color: 'var(--atelier-ink)', lineHeight: 1, letterSpacing: '0.02em',
        }}>{MONTHS[month]}</div>

        <button type="button"
          onClick={() => month === 11 ? (setYear(y=>y+1), setMonth(0)) : setMonth(m=>m+1)}
          aria-label="Next month"
          style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-30%)',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--atelier-label)', fontFamily: F.display, fontSize: 26, lineHeight: 1,
          }}>›</button>
      </div>

      {/* ── THE BAND BOARD (P2) — the toggle swaps the whole reading surface.
             F5 ruled HIDE: the Next Engagements rail returns with Month, because on
             this board the band IS the horizon. ── */}
      {view === 'weddings' && (
        <CalendarBands
          vendorId={vendorId}
          from={win.from}
          to={win.to}
          muhuratDates={hotOn ? hotSet : new Set<string>()}
          onOpenDay={(d) => { setBlockSel(null); setDaySel(d); }}
          onAssignCrew={(fn: BandFunction) => {
            // CE ruling F3: a gap pip opens the SHIPPED picker, byte-untouched. The
            // band's function carries everything CalendarCrewSheet's DayEvent contract
            // needs; the fields it does not use are honestly null rather than invented.
            setDaySel(null);
            setCrewDate(fn.date);
            setCrewEvent({
              id: fn.event_id,
              title: fn.title,
              kind: fn.kind,
              slot: fn.slot,
              event_time: fn.event_time,
              state: 'upcoming',
              notes: null,
              lead_id: null,
              linked_binder_id: null,
              binder_name: null,
              assigned_member_ids: fn.crew.map(c => c.member_id),
            });
          }}
          refreshKey={bandsRefresh}
        />
      )}

      {view === 'month' && (<>
      {/* The month spread that stood here is HOISTED above the view fork (F-04.105) —
          both surfaces share one navigator. Nothing was lost; one block moved up. */}

      {/* Brass divider with hot-dates toggle on the right */}
      <div style={{
        padding: '0 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div style={{ width: 34, height: '0.5px', background: A.brass, opacity: 0.9 }} />
        <button type="button" onClick={() => setHotOn(!hotOn)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'none', border: `0.5px solid ${hotOn ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.18)'}`,
            borderRadius: 999, padding: '5px 11px', cursor: 'pointer',
          }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: hotOn ? A.terracotta : 'rgba(240,230,210,0.2)',
            boxShadow: hotOn ? '0 0 6px rgba(224,123,92,0.6)' : 'none',
          }} />
          <span style={{
            fontFamily: F.label, fontWeight: 300, fontSize: 8,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            color: hotOn ? A.brassWarm : A.inkMute,
          }}>Hot Dates</span>
        </button>
      </div>

      {/* Hot dates ribbon — only when toggle on and there are any */}
      {hotOn && hotThisMonth > 0 && (
        <div className="atelier-hot-ribbon" style={{
          margin: '0 18px 14px',
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: A.terracotta,
            boxShadow: '0 0 8px rgba(224,123,92,0.6)',
            flexShrink: 0,
          }} />
          <div style={{
            flex: 1,
            fontFamily: F.script, fontStyle: 'italic',
            fontSize: 13, fontWeight: 400,
            color: 'var(--atelier-ink-soft)', letterSpacing: '0.01em',
          }}>
            {hotThisMonth === 1 ? 'One auspicious date this month — peak season approaches' : `${hotThisMonth === 2 ? 'Two' : hotThisMonth === 3 ? 'Three' : hotThisMonth} auspicious dates this month — peak season approaches`}
          </div>
          <div style={{ fontFamily: F.display, fontSize: 18, color: A.brassWarm }}>
            {hotThisMonth}
          </div>
        </div>
      )}

      {/* Weekday labels */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
        padding: '0 18px 8px',
        borderBottom: '0.5px solid var(--atelier-card-border)',
      }}>
        {DAYS.map((d, i) => (
          <div key={i} style={{
            textAlign: 'center', padding: '2px 0',
            fontFamily: F.label, fontWeight: 300, fontSize: 8,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'var(--atelier-label)',
          }}>{d}</div>
        ))}
      </div>

      {/* Month grid — fixed rows, no flex stretching */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
        padding: '6px 18px 12px',
      }}>
        {/* Previous-month fade cells */}
        {Array.from({ length: firstDow }).map((_,i) => (
          <div key={`p${i}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            // TDW_09 F-09.15b: was a bare cream literal — the espresso ink at
            // 18% alpha, unquoted here on purpose (the bench's ④ reads comments).
            // Espresso 1.63:1 (the intended fade); Editorial Paper 1.02:1 — these
            // numerals did not dim on the light theme, they vanished. Now themed,
            // held at the 3:1 UI bar in each set rather than the body bar, because
            // last month's dates are meant to recede.
            fontFamily: F.display, fontSize: 16, color: 'var(--atelier-ink-fade)',
          }}>{prevDays - firstDow + i + 1}</div>
        ))}

        {Array.from({ length: daysInMonth }).map((_,i) => {
          const d = i + 1;
          const dateIso = iso(year, month, d);
          const isToday   = dateIso === todayIso;
          const isSel     = dateIso === daySel;
          const evCount   = (byDate.get(dateIso) ?? []).length;
          const isHot     = hotSet.has(dateIso) && hotOn;
          const dayBlocks = blockMap.get(dateIso) ?? [];
          const isFullDayBlocked = dayBlocks.some(b => (b.slot ?? 'full_day') === 'full_day');
          const isBlocked = dayBlocks.length > 0;

          return (
            <button key={d} type="button"
              onClick={() => {
                // B6-S2 (item 4): every day tap opens THE DAY SHEET. The block
                // flow (reason picker / unblock) is reachable FROM it — one
                // surface for a day, per P5's own words ("Day sheet (tap a
                // day)"). Disclosed routing change: blocked/empty days used to
                // open the BlockSheet directly; nothing is lost, one hop moved.
                setBlockSel(null);
                setDaySel(prev => prev === dateIso ? null : dateIso);
              }}
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                aspectRatio: '1',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: F.display, fontWeight: 400, fontSize: 22,
                color: isToday ? '#1A120E' : (isSel ? '#1A120E' : A.ink),
                opacity: isFullDayBlocked ? 0.45 : 1,   // a partial hold still sells — no dim (interim until pips)
              }}>
              {/* Today brass coin (behind numeral) */}
              {isToday && (
                <span className="atelier-today-coin" style={{
                  position: 'absolute', inset: '20%', borderRadius: '50%', zIndex: 0,
                }} />
              )}
              {/* Selected (non-today) — cream pill */}
              {isSel && !isToday && (
                <span style={{
                  position: 'absolute', inset: '18%', borderRadius: '50%',
                  background: 'rgba(245,235,212,0.92)', zIndex: 0,
                }} />
              )}
              {/* Blocked indicator */}
              {isBlocked && (
                <span style={{
                  position: 'absolute', inset: '14%', borderRadius: '50%',
                  background: 'rgba(201,168,76,0.10)',
                  border: '0.5px dashed rgba(201,168,76,0.35)',
                  zIndex: 0,
                }} />
              )}
              {/* Numeral */}
              <span style={{ position: 'relative', zIndex: 1 }}>{d}</span>
              {/* Booking dot (brass) */}
              {evCount > 0 && !isToday && !isSel && (
                <span style={{
                  position: 'absolute', bottom: '14%', left: '50%', transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%',
                  background: A.brass,
                  zIndex: 1,
                }} />
              )}
              {/* Hot date dot (terracotta) */}
              {isHot && !isToday && !isSel && (
                <span style={{
                  position: 'absolute', top: '14%', right: '22%',
                  width: 4, height: 4, borderRadius: '50%',
                  background: A.terracotta,
                  boxShadow: '0 0 4px rgba(224,123,92,0.5)',
                  zIndex: 1,
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* B6-S1 (item 3): the cap's honest tell. Copy on the veto-on-sight list. */}
      {winData?.truncated && (
        <div style={{
          padding: '2px 22px 10px',
          fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
          fontSize: 12, color: A.inkMute,
        }}>Over 200 entries in this span — the furthest are not drawn.</div>
      )}

      {/* ── Next Engagements ──────────────────────────────────── */}
      <div style={{ padding: '0 22px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0 12px' }}>
          <div style={{
            fontFamily: F.label, fontWeight: 300, fontSize: 9,
            letterSpacing: '0.5em', textTransform: 'uppercase',
            color: A.brass,
          }}>Next Engagements</div>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--atelier-ink-dim)' }} />
          {nextThree.length > 0 && (
            <div style={{ fontFamily: F.display, fontSize: 18, color: A.brassWarm }}>
              {nextThree.length}
            </div>
          )}
        </div>

        {nextThree.length === 0 ? (
          <div style={{
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
            fontSize: 15, color: A.inkMute,
            padding: '4px 0 8px',
          }}>Nothing on the horizon.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {nextThree.map((ev, idx) => {
              const { day, month: mm } = splitDay(ev.event_date);
              return (
                <div key={ev.id} style={{
                  display: 'flex', alignItems: 'center', gap: 18,
                  padding: '14px 0',
                  borderBottom: idx < nextThree.length - 1 ? `0.5px solid rgba(201,168,76,0.12)` : 'none',
                }}>
                  <div style={{
                    flexShrink: 0, width: 56, textAlign: 'center',
                  }}>
                    <div style={{
                      fontFamily: F.label, fontWeight: 300, fontSize: 8,
                      letterSpacing: '0.36em', textTransform: 'uppercase',
                      color: 'var(--atelier-label)', marginBottom: 4,
                    }}>{mm}</div>
                    <div style={{
                      fontFamily: F.display, fontWeight: 400, fontSize: 44,
                      color: 'var(--atelier-ink)', lineHeight: 0.95, letterSpacing: '-0.01em',
                    }}>{day}</div>
                  </div>
                  <div style={{
                    flex: 1, minWidth: 0,
                    paddingLeft: 18,
                    borderLeft: '0.5px solid var(--atelier-card-border)',
                  }}>
                    <div style={{
                      fontFamily: F.label, fontWeight: 300, fontSize: 8,
                      letterSpacing: '0.34em', textTransform: 'uppercase',
                      color: 'var(--atelier-label)', marginBottom: 5,
                    }}>{ev.kind}{ev.event_time ? ` · ${ev.event_time.slice(0,5)}` : ''}</div>
                    <div style={{
                      fontFamily: F.display, fontWeight: 400, fontSize: 19,
                      color: 'var(--atelier-ink)', lineHeight: 1.2, letterSpacing: '0.005em',
                    }}>{ev.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>{/* end Next Engagements */}
      </>)}{/* end view === 'month' */}
      </div>{/* end scroll wrapper */}

      {/* Brass-key FAB */}
      <button type="button" onClick={onAdd} aria-label="Add event" className="atelier-fab" style={{
        position: 'fixed', bottom: 'calc(82px + env(safe-area-inset-bottom))', right: 20, zIndex: 30,
        width: 46, height: 46, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.body, fontSize: 22, fontWeight: 400, lineHeight: 1,
        cursor: 'pointer', border: '0.5px solid var(--atelier-label)',
      }}>+</button>

      {/* B6-S2: the Date popup RETIRED into the day sheet (item 4) — its list,
          Edit, Cancel, and + affordances all live there now, enriched per P5.
          Nothing lost; one surface per day. */}
      <Toast toast={toast} />
      {/* The full-day block flow (reason picker / unblock), reachable from the
          day sheet — existingBlock is the FULL-DAY hold specifically; slot
          blocks are the day sheet's toggles' business. */}
      <CalendarBlockSheet
        open={!!blockSel}
        dateIso={blockSel}
        existingBlock={blockSel ? ((blockMap.get(blockSel) ?? []).find(b => (b.slot ?? 'full_day') === 'full_day') ?? null) : null}
        onClose={() => setBlockSel(null)}
        onToast={showToast}
        onRefresh={() => { refreshBlocks(); refreshWindow(); }}
        events={blockSel ? (byDate.get(blockSel) ?? []) : []}
      />
      <CalendarDaySheet
        open={!!daySel}
        dateIso={daySel}
        vendorId={vendorId}
        muhuratLocal={!!daySel && hotSet.has(daySel) && hotOn}
        onClose={() => setDaySel(null)}
        onToast={showToast}
        onRefresh={refreshAll}
        onAddBooking={(d) => { setDaySel(null); setEditRow(null); setAddSeed({ event_date: d }); setAddOpen(true); }}
        onFullDayBlock={(d) => { setDaySel(null); setBlockSel(d); }}
        onEdit={(ev: DayEvent) => {
          setDaySel(null);
          setEditRow({ id: ev.id, title: ev.title, kind: ev.kind, event_date: daySel ?? '', event_time: ev.event_time ?? '', notes: ev.notes ?? '' });
          setAddOpen(true);
        }}
        onAssignCrew={(ev: DayEvent) => { setCrewDate(daySel); setDaySel(null); setCrewEvent(ev); }}
      />
      <CalendarCrewSheet
        open={!!crewEvent}
        event={crewEvent}
        eventDate={crewDate}
        onClose={() => { setCrewEvent(null); setCrewDate(null); }}
        onToast={showToast}
        onRefresh={refreshAll}
      />
      <AddSheet
        open={addOpen}
        slice="events"
        existing={editRow}
        existingId={editRow?.id as string | undefined}
        initialValues={addSeed ?? undefined}
        onClose={() => { setAddOpen(false); setEditRow(null); setAddSeed(null); }}
        onToast={showToast}
        onBlockInstead={(d) => { setAddOpen(false); setEditRow(null); setAddSeed(null); setBlockSel(d); }}
      />
    </div>
  );
}
