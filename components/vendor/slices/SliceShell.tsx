// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock’s screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// components/vendor/slices/SliceShell.tsx — TDW_03 P1
// Two exports:
//   SliceShell  — pure screen chrome: masthead slot + search + list + FAB
//                 (+ FilterRail mount point and skeleton states at P4/P5).
//   SliceScreen — the shared state assembly the five slice modules
//                 parameterize (data hook, row mapper, delete route).
// The SliceScreen state machine is the monofile's, moved VERBATIM: same
// state atoms, same effects, same fetch bodies. The per-slice conditionals
// for the invoice schedule and lead thread stay here verbatim in commit 1;
// P2/P4/P5 will migrate them into their modules as those phases rebuild them.
// Zero behavior change is the P1 contract.

// `usePathname` LEFT WITH THE HOOK. It was read by exactly one thing — `useInShell`'s body
// — and once that moved, the specifier was dead. Derived, not assumed: zero call sites
// remain in this file. An unused import is not tidiness debt; it is a named binding the
// next reader wires something to (the `vendorName` finding at §4-2, same shape).
import { useRouter } from 'next/navigation';
import { INK_DEEP } from '@/lib/vendor/theme';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useInShell } from '@/hooks/vendor/useInShell';
import { Fab } from '@/components/worklist/Fab';
import { useLastSlice, type ListSlice, type DoorSlice } from '@/hooks/vendor/useLastSlice';
import { API_BASE, getAuthHeader } from '@/lib/vendor/api/_base';
import { AddSheet } from '@/components/vendor/AddSheet';
import { Toast } from '@/components/vendor/Toast';
// ── M-FINISH S2 · CE-38 relay #2 arm (c), REACHING THE LIST FAMILY ──────────
// `Toast` reads five values off `useT()` as JAVASCRIPT, not as CSS variables, so inside the
// shell — where no ThemeProvider mounts and none may (F-38.3) — it falls to
// createContext(DARK)'s default and paints Espresso-dark on a Chalk page, in both modes,
// forever. It does not throw, which is exactly why it would have shipped: the room renders,
// the toast is simply the wrong colour, and only a capture with a toast ON SCREEN would
// have caught it. D-38.1 is the doctrine — observe at the moment the defect is visible.
// The pair is chosen by the SAME derivation that chooses everything else here, so there is
// one fact about which tree we are in and one place it is read.
import { WlToast } from '@/components/worklist/WlToast';
import { roomHref } from '@/lib/worklist/rooms';
// THE TWO PDF SENTENCES AND THE INVOICE ROW'S VERB LIVE IN THE REGISTER, NOT
// HERE (CE-39 2c-Studio, ruling 4). Both PDF bytes were spelled inline in this
// file, at the two call sites below; `Mark paid` was spelled twice more, once
// for the swipe and once for the bulk bar. One home, four readers.
import { COPY } from '@/lib/worklist/copy';
import { useToast } from '@/hooks/vendor/useToast';
import type { ToastKind } from '@/hooks/vendor/useToast';
import { fetchLeadDetail, fetchSchedule, createSchedule, markMilestonePaid, fetchInvoicePdf, updateLead, deleteLead, patchLeadState, recordPayment, updateEvent, cancelEvent, deleteExpense } from '@/lib/vendor/api/vendor';
import { SwipeRow, type SwipeSide } from './SwipeRow'; // TDW_04 A2: the P4 gesture engine
import { Masthead } from './Masthead'; // TDW_04 A3: P5's card
import { FilterRail, type FilterChip } from './FilterRail'; // TDW_04 A4: P4's rail
import { useCabinetData } from '@/hooks/vendor/useVendorData'; // TDW_04 A3: binder truth for money mastheads
import { deriveMoney, deriveClients, derivePipeline, deriveExpensesThisMonth, deriveEventsThisWeek } from '@/lib/vendor/derive'; // TDW_04 A3: THE derivation
import { BulkBar, type BulkAction } from './BulkBar';   // TDW_04 A2: select mode
import { queueUndoable, flushAllPending, UNDO_WINDOW_MS } from '@/lib/vendor/undo'; // TDW_04 A2: F2's cure · A4: F-04.14 ruled
import { WishboneSheet } from './WishboneSheet'; // TDW_04 A1: leads-plane wishbone (own module per tenancy law)
import { invalidateSlice } from '@/lib/vendor/cache/invalidate';
import type { ScheduleMilestone } from '@/lib/vendor/types/vendor';
import { ConversationThread } from '@/components/vendor/ConversationThread';
import type { ConversationMessage } from '@/lib/vendor/types/vendor';
import { A, F, LABELS, WaIcon, SliceRow, cap, type Row } from './SliceRow';

// TDW_04 A1 (L-1, ST-1) — the lane declarations, house voice, LOCKED wording:
// Leads "Enquiries pipeline"; Clients/Invoices/Expenses "From your binders";
// Events "Your calendar". The cabinet's own line lives in Cabinet.tsx.
// TDW_04 A3 (L-3/ST-2): what each chip-bearing list cannot see, in its own
// words. Leads/invoices match by phone (phone-asymmetric twins stay invisible —
// Exhibit A's flagship pair among them); events match by the binder the row
// itself names (an event that names none wears no chip). Silence about a
// blindness is the lie this block exists to kill.
const CHIP_BLINDNESS: Partial<Record<ListSlice, string>> = {
  leads:    'Some entries may also exist as binders — phones connect them.',
  invoices: 'Some entries may also exist as enquiries — phones connect them.',
  events:   'Some dates may also sit in a binder — the entry has to name it.',
};

const LANE_LINE: Record<ListSlice, string> = {
  leads:    'Enquiries pipeline',
  clients:  'From your binders',
  invoices: 'From your binders',
  expenses: 'From your binders',
  events:   'Your calendar',
};
import { DetailSheet } from './DetailSheet';

// Payment schedule endpoint lands with Step 10 (artifact hands). Off until then,
// so opening an invoice doesn't fire a 404 against a route that isn't built yet.
const SCHEDULE_ENABLED: boolean = false;

// ── The Slice Door · CE addendum 2026-07-14 (F1 successor) ──────
// The five slices as chips, canonical order, directly under the brass label.
// Active state derives from the route param (never local state). Tap writes
// the last-slice key through the EXISTING hook's write path, then navigates —
// a real route change (the P1 remount nuance is a live path now; P4 judges it
// per the standing ruling). Counts slot reserved — TDW_09 may add.
const DOOR_ORDER: DoorSlice[] = ['leads', 'clients', 'invoices', 'expenses', 'events', 'notes'];

// ── M-FINISH S2 · §4-3 · `useInShell` MOVED OUT OF THIS FILE, AND ONLY MOVED ──
// It was DEFINED here at §4-1 because the list family was the only caller. Storefront,
// Portfolio and Couture cross at §4-3 and each needs the same predicate; none of them is in
// this family, and a named import from this module reaches `SliceShell`, `SliceDoor` and
// `DetailSheet` behind it. Its one home is `hooks/vendor/useInShell.ts` now — main-side, so
// both trees may read it and neither inverts D-2 — and this file IMPORTS it like every
// other caller rather than keeping a re-export beside it. A re-export would be a second
// name for one thing, which is the disease one directory over.
//
// The reasoning that used to sit here travelled WITH the code and is not summarised: a
// comment that paraphrases a decision living elsewhere is the next stale comment (F-38.29).

export function SliceDoor({ active }: { active: DoorSlice }) {
  const router = useRouter();
  const inShell = useInShell();
  const [, setSlice] = useLastSlice();
  const rowRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // Active chip auto-scrolled into view on entry and on slice change.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [active]);

  return (
    <div ref={rowRef} style={{
      display: 'flex', gap: 4, padding: '0 var(--slice-inset, 22px) 6px',
      overflowX: 'auto', scrollbarWidth: 'none',
      borderBottom: '0.5px solid var(--atelier-card-border)',
    }}>
      {DOOR_ORDER.map(s => {
        const isActive = s === active;
        return (
          <button
            key={s}
            ref={isActive ? activeRef : undefined}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => { if (!isActive) { setSlice(s); router.push(inShell ? `/w/${s}` : `/vendor/list/${s}`); } }}
            style={{
              flexShrink: 0,
              background: 'transparent', border: 'none', cursor: 'pointer',
              minHeight: 24, padding: '8px 10px', // pads the 24px line to a 40px touch target
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
            {/* ── THE OBLIGATION theme.ts SHIPPED UNDER BAR, DISCHARGED AT ITS NAMED SITTING ──
                lib/worklist/theme.ts:28-31 recorded the inactive chip at 4.02:1 dark and
                3.01:1 light against a 4.5 bar, named THIS line as the cause (a hard-coded
                opacity 0.45, which no ink value can climb out of) and bound the cure BY
                LABEL to "the Phase 2 SliceDoor sitting". The list family crossing is that
                sitting, so it is discharged here rather than carried a third time.
                THE OPACITY IS GONE, NOT TUNED. Two ink tokens carry the two states, and
                both are MEASURED in theme.ts against the ground they sit on: ink-mute is
                4.98:1 dark and 6.79:1 light, ink is 15.74:1 and 17.82:1. An opacity over a
                token is a colour nobody measured; a token is a colour somebody did.
                It reads correctly on the /vendor fallback too, because both trees define
                these two variables — this is the one-home move, not a branch fork (D-2). */}
            <span style={{
              fontFamily: F.label, fontWeight: isActive ? 400 : 300, fontSize: 10,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: isActive ? 'var(--atelier-ink)' : 'var(--atelier-ink-mute)',
              transition: 'color 200ms ease',
            }}>
              {LABELS[s]}
              {/* counts slot reserved — TDW_09 may add */}
            </span>
            <span aria-hidden style={{
              display: 'block', width: '100%', height: 2, borderRadius: 1,
              background: isActive ? 'var(--atelier-accent-text)' : 'transparent',
              transition: 'background 200ms ease',
            }} />
          </button>
        );
      })}
    </div>
  );
}

// ── SliceShell · pure chrome ─────────────────────────────────────
// Masthead slot (P5 fills it), search, list + empty state, FAB.
// Sheets/overlays/toast are passed through as children by SliceScreen.
interface SliceShellProps {
  slice: ListSlice;
  /** THE BACK/LABEL ROW ONLY. Inside the shell the row does not render, so this is never
      called there — the shell's two nav seats are the way out and there is no chevron. */
  onBack: () => void;
  query: string;
  setQuery: (q: string) => void;
  loading: boolean;
  error: string | null;
  rows: Row[];
  onSelect: (row: Row) => void;
  onAdd: () => void;
  /** TDW_03 P2: when present, rendered INSTEAD of the default rows/empty-state
      block (the clients slice supplies binder cards + its own empty state).
      Other slices untouched. */
  renderList?: ReactNode;
  /** TDW_04 A2: per-row decorator (swipe + selection) — default plain SliceRow. */
  renderRow?: (row: Row) => ReactNode;
  /** TDW_04 A3: the P5 masthead, composed by the owner (it knows its figures). */
  masthead?: ReactNode;
  /** TDW_04 A4: the P4 FilterRail, rendered sticky under the search field. */
  filterRail?: ReactNode;
  /** TDW_04 A4: the sort caret, rendered at the masthead row's right. */
  sortControl?: ReactNode;
  children?: ReactNode;
}

// ══ M-FINISH S2 · R-38.11 · WHAT CROSSED HERE, AND WHAT DELIBERATELY DID NOT ══
//
// `vendorName` LEFT WITH THE MASTHEAD, exactly as it left SettingsScreen at S1
// (components/vendor/SettingsScreen.tsx:78). It existed to feed <Header>, and a prop that
// no longer feeds anything is a prop the next reader will wire something to. Both callers
// still hold the session; neither needs to hand it here.
//
// ⚠ `Header` IS NOT IMPORTED BY THIS FILE ANY MORE, AND THE DIFFERENCE FROM A CONDITIONAL
// IS THE WHOLE FINDING — S1 paid for it once already. Keeping `import { Header }` and
// writing `{chrome && <Header …/>}` renders correctly and STILL SHIPS the old masthead into
// every shell room's chunk, with its drawer, its /vendor rows and 「DreamAi on WhatsApp」
// (Header.tsx:355, banned by R-37.70/.78/.83). A conditional does not remove a module from
// a bundle; only not importing it does. `Header` mounts at the fallback ROUTE now
// (app/vendor/list/[slice]/page.tsx), which is the only place it is wanted.
//
// THE BODY DID NOT CROSS AND IS NOT REDESIGNED (R-38.12). Rows, sheets, mastheads and the
// filter rail keep their current layout. Two things about them are DECLARED GAPS rather
// than silent ones, and both are named in the handover and excluded from the render arm's
// tuple cell by name: the slice tree's thirty colour LITERALS (F-38.22) and its old type
// register. Neither is swept inside a structural crossing.
export function SliceShell({ slice, onBack, query, setQuery, loading, error, rows, onSelect, onAdd, renderList, renderRow, masthead, filterRail, sortControl, children }: SliceShellProps) {
  const inShell = useInShell();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
      {/* ── THE BACK/LABEL ROW IS THE OLD LAYOUT'S CHROME ────────────────────
          Inside the shell it would be the two-mastheads defect one level down from where
          R-38.1 removed it: WorklistShell already prints the room's word in its header and
          already owns the way out. There is no chevron in the shell by construction — the
          two nav seats are the way back, which is the same contract Billing and Settings
          crossed under at S1. On the /vendor fallback the row renders exactly as before. */}
      {!inShell && (
        <div style={{ padding: '12px var(--slice-inset, 22px) 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.interactiveWarm, fontFamily: F.display, fontSize: 20, lineHeight: 1 }}>‹</button>
          <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>{LABELS[slice]}</span>
        </div>
      )}
      {/* TDW_04 A1 (L-1, ST-1): the lane declaration — one provenance line under
          every record-surface title, house voice. No surface claims totality it
          doesn't have. */}
      <div style={{ padding: '0 var(--slice-inset, 22px) 2px', marginTop: -4 }}>
        <span style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>{LANE_LINE[slice]}</span>
      </div>

      {/* TDW_04 A3 (P5/ST-4): THE number — every figure from lib/vendor/derive.ts,
          the same function the hub Ledger reads. */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>{masthead}</div>
        {sortControl && <div style={{ padding: '14px var(--slice-inset, 22px) 0 0' }}>{sortControl}</div>}
      </div>

      {/* The Slice Door — the five slices, one thumb away (CE addendum) */}
      <SliceDoor active={slice} />

      {/* Search */}
      <div style={{ padding: '12px var(--slice-inset, 22px) 6px' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: F.display, fontSize: 16, color: A.inkMute, lineHeight: 1, pointerEvents: 'none' }}>⌕</span>
          <input
            type="text"
            placeholder={`Search ${LABELS[slice].toLowerCase()}…`}
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 32px', boxSizing: 'border-box',
              background: 'var(--atelier-input-bg)',
              border: '0.5px solid var(--atelier-card-border)',
              borderRadius: 2,
              fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink,
              outline: 'none', caretColor: A.interactive,
            }}
          />
        </div>
      </div>

      {/* TDW_04 A4: the P4 FilterRail — sticky chips under search */}
      {filterRail}

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 110 }}>
        {renderList ?? (
          <>
            {!loading && !error && rows.length === 0 && (
              <div style={{
                padding: '40px 24px', textAlign: 'center',
                fontFamily: F.script, fontWeight: 300, fontSize: 16,
                color: A.inkMute, lineHeight: 1.5,
              }}>
                {query
                  ? <>Nothing matching <span style={{ color: A.brassWarm }}>&ldquo;{query}&rdquo;</span></>
                  : <>Nothing here yet.<br/><span style={{ color: A.brassWarm }}>Tap the + to add one.</span></>}
              </div>
            )}
            {rows.map(row => renderRow ? <div key={row.id}>{renderRow(row)}</div> : <SliceRow key={row.id} row={row} slice={slice} onSelect={() => onSelect(row)} />)}

            {/* TDW_04 A3 (L-3, ST-2): each chip-bearing list discloses its
                blindness ONCE — the chip's absence is not evidence of absence.
                Said plainly, at the foot of the list, in the house voice. */}
            {!loading && !error && rows.length > 0 && CHIP_BLINDNESS[slice] && (
              <div style={{
                padding: '14px var(--slice-inset, 22px) 20px',
                fontFamily: F.script, fontWeight: 300, fontSize: 16,
                color: A.inkMute, lineHeight: 1.5,
              }}>{CHIP_BLINDNESS[slice]}</div>
            )}
          </>
        )}
      </div>

{/* ── CE-39 S2/6 · F-39.4 · THE SHELL ARM STOPPED DRAWING ITS OWN SEAT ──────
          This button carried its own geometry — 46px at right 20, bottom 120 inside the
          shell — and the 120 was DERIVED CORRECTLY (the dock's 8+44+8 over the nav's 52 =
          112.5, plus one step) and was still wrong, because Rooms' FAB had been MEASURED
          at 136 against the painted dock and the two numbers were never compared. A
          derivation and a measurement of the same thing, in two files, disagreeing by
          16px — which the founder read as the button jumping when he changed rooms.
          Ruled: Rooms is the reference and its seat is the only seat. The shell arm now
          draws through components/worklist/Fab.tsx and names no number at all.

          THE /vendor ARM IS UNTOUCHED, AND THAT IS THE RULING TOO. Its 82 clears the old
          BottomNav, `.wl-fab` does not exist outside the shell scope, and that tree dies
          whole at Phase 7. Two implementations, each with its reason at its site — the
          same shape the ask door took two hours ago. */}
      {inShell
        ? <Fab label={`Add ${LABELS[slice].toLowerCase()}`} onClick={onAdd} />
        : (
          <button type="button" onClick={onAdd} aria-label={`Add ${LABELS[slice].toLowerCase()}`}
            className="atelier-fab" data-tree="vendor"
            style={{
              // The old shell's BottomNav is 82 tall, which is where the 82 came from.
              position: 'fixed', bottom: 'calc(82px + env(safe-area-inset-bottom))', right: 20, zIndex: 30,
              width: 46, height: 46, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: F.body, fontSize: 20, fontWeight: 400, lineHeight: 1,
              cursor: 'pointer', border: '0.5px solid var(--atelier-label)',
            }}>+</button>
        )}

      {children}
    </div>
  );
}

// ── SliceScreen · shared state assembly ──────────────────────────
// The five modules parameterize this with their data hook, row mapper,
// and delete route. State machine verbatim from the monofile.
export interface SliceDataState<T> {
  data: T[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export interface SliceScreenProps<T extends { id: string }> {
  slice: ListSlice;
  vendorId: string;
  useData: (vendorId: string | null) => SliceDataState<T>;
  toRows: (data: T[]) => Row[];
  /** Delete/cancel request per the slice's route. 'unsupported' preserves the
      monofile's chat-redirect message for any future slice without a door.
      successMessage (optional) overrides the door's raw reply — some doors
      answer in tool-display prose with record ids aboard (founder-ruled polish). */
  deleteRequest: (sel: Row) => { url: string; method: string; body?: string; successMessage?: string } | 'unsupported';
}

export function SliceScreen<T extends { id: string }>({ slice, vendorId, useData, toRows, deleteRequest }: SliceScreenProps<T>) {
  const router = useRouter();
  // ONE DERIVATION, TWO READERS. `useInShell` was called inline for the toast alone; the
  // F-39.11 focus arm below needs the same fact, and calling the hook twice in one
  // component is two statements of one thing that a later edit can let disagree.
  const screenInShell = useInShell();
  const ToastView = screenInShell ? WlToast : Toast;
  const { session } = useVendorSession();
  const d = useData(vendorId);

  const rawRows = useMemo(() => toRows(d.data ?? []), [toRows, d.data]);

  const loading = d.loading;
  const error   = d.error;

  const [query, setQuery]     = useState('');
  const [sel, setSel]         = useState<Row|null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [deleteMsg,   setDeleteMsg]   = useState<string | null>(null);
  // Schedule state (invoice slice only)
  const [schedule,       setSchedule]       = useState<ScheduleMilestone[] | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleOpen,    setScheduleOpen]    = useState(false);
  const [milestones,      setMilestones]      = useState([{ label: 'Booking', pct: '30', due_date: '' }, { label: 'Shoot day', pct: '40', due_date: '' }, { label: 'Delivery', pct: '30', due_date: '' }]);
  const [scheduleSaving,  setScheduleSaving]  = useState(false);
  const [addOpen,     setAddOpen]     = useState(false);
  const [editRow,     setEditRow]     = useState<Record<string,unknown> | null>(null);
  const { toast, show: showToast, dismiss: dismissToast } = useToast();
  const [pdfBusy, setPdfBusy] = useState(false);
  const [leadDetail, setLeadDetail] = useState<{ vendor_summary: string | null; conversation: ConversationMessage[] } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  async function doCreateSchedule() {
    if (!sel || scheduleSaving) return;
    const total = milestones.reduce((s, m) => s + Number(m.pct || 0), 0);
    if (Math.abs(total - 100) > 0.01) return;
    setScheduleSaving(true);
    const res = await createSchedule(sel.id, milestones.map(m => ({
      label: m.label, pct: Number(m.pct), due_date: m.due_date || undefined,
    })));
    if (!res.ok) showToast((res as { error?: string }).error ?? 'Failed to create schedule', 'error');
    else { setSchedule((res as { schedule: ScheduleMilestone[] }).schedule); setScheduleOpen(false); }
    setScheduleSaving(false);
  }

  // Fetch schedule when an invoice row is selected
  useEffect(() => {
    if (slice === 'invoices' && sel) {
      if (!SCHEDULE_ENABLED) { setSchedule([]); return; }
      setSchedule(null); setScheduleLoading(true);
      fetchSchedule(sel.id).then(r => {
        if (r.ok) setSchedule((r as { schedule: ScheduleMilestone[] }).schedule);
        else setSchedule([]);
      }).catch(() => setSchedule([])).finally(() => setScheduleLoading(false));
    }
  }, [sel, slice]);

  async function downloadInvoicePdf() {
    if (!sel || pdfBusy) return;
    setPdfBusy(true);
    try {
      const res = await fetchInvoicePdf(sel.id);
      if (res.ok && (res as { pdf_url?: string }).pdf_url) {
        window.open((res as { pdf_url: string }).pdf_url, '_blank', 'noopener');
      } else {
        // ── F-2c.p10's CURE ────────────────────────────────────────────
        // WHAT THIS SAID: 「PDF not ready yet — try again in a moment.」 That
        // described WAITING when what happened was FAILING, and it invented a
        // state this door cannot report: `GET /:invoiceId/pdf` is SYNCHRONOUS
        // (`src/api/vendor/money.js` · the `GET /invoices/:vendorId/:invoiceId/pdf` arm's `okRes` — the MONEY plane, which is the door
        // `fetchInvoicePdf` actually composes; this comment named
        // `src/api/vendor/invoices.js:398` and that route is never called from
        // here, c-2c.s7) — it generates and returns a URL or
        // it errors. `pdf_pending` exists only on `POST /` at :249 and no reader
        // in this repo consumes it. So the sentence was the `??` fallback for an
        // ok-false carrying no error, telling the vendor to wait for something
        // that was never in flight. The founder's walk hit this door and the
        // retry succeeded: the door works, and only the sentence lied.
        showToast((res as { error?: string }).error ?? COPY.studioPdfFailed, 'error');
      }
    } catch {
      showToast('Could not fetch the PDF. Try again.', 'error');
    }
    setPdfBusy(false);
  }

  // TDW_04 A2 — interaction state: long-press select mode, optimistic hides
  // (deferred deletes), optimistic badge overrides (deferred state moves),
  // and the leads-only Mark-lost confirm (L-2's deliberate separate action).
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const selectMode = selected.size > 0;
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [badgeOverride, setBadgeOverride] = useState<Record<string, string>>({});
  const [bulkBusy, setBulkBusy] = useState(false);
  const [markLostConfirm, setMarkLostConfirm] = useState(false);
  // TDW_04 A4 (P4): FilterRail single-select + the masthead sort toggle.
  const [filterKey, setFilterKey] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<'recent' | 'amount' | 'date'>('recent');
  const [lostReason, setLostReason] = useState(''); // F-04.12: the optional reason, lands in notes
  const longPress = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideRow = (id: string) => setHiddenIds(s => new Set(s).add(id));
  const unhideRow = (id: string) => setHiddenIds(s => { const n = new Set(s); n.delete(id); return n; });
  const setBadge = (id: string, b: string | null) => setBadgeOverride(m => { const n = { ...m }; if (b == null) delete n[id]; else n[id] = b; return n; });

  // One undoable single-row mutation: optimistic apply now, write on the 30s
  // lapse, UNDO reverts (deferred-fire — see lib/vendor/undo.ts for why).
  function undoableMutation(opts: { apply: () => void; revert: () => void; commit: () => Promise<void>; toastMsg: string }) {
    opts.apply();
    const { undo } = queueUndoable({ slice, commit: opts.commit, revert: opts.revert });
    // TDW_04 A3.3 (CE meta-finding): an undo that just makes the toast vanish
    // leaves the vendor unable to tell whether his own undo landed — twice now
    // that ambiguity has cost a debugging session (Rahul Sharma's trail, and
    // F-04.14's report). The undo's outcome is now legible after the fact.
    showToast(opts.toastMsg, 'success', {
      action: { label: 'Undo', onAction: () => { undo(); showToast('Restored.', 'success'); } },
      durationMs: UNDO_WINDOW_MS,
    });
  }

  // ── TDW_04 A4 (P4): FilterRail chips per slice, counts from the raw rows ──
  // leads = state segments w/ counts · invoices = payment states · expenses =
  // month chips (last 6) · events = this week / later / done. Clients keeps the
  // cabinet's own grouping (its list isn't row-based; no rail there).
  const monthKey = (iso?: string | null) => (iso ?? '').slice(0, 7);
  const monthLabel = (k: string) => { const [y, m] = k.split('-'); return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }); };
  const filterChips: FilterChip[] = useMemo(() => {
    const count = (fn: (r: Row) => boolean) => rawRows.filter(fn).length;
    if (slice === 'leads') return ['new', 'contacted', 'quoted', 'booked', 'lost']
      .map(k => ({ key: k, label: k, count: count(r => (r.badge ?? '').toLowerCase() === k) }));
    if (slice === 'invoices') return ['overdue', 'unpaid', 'advance_paid', 'paid']
      .map(k => ({ key: k, label: k === 'advance_paid' ? 'part-paid' : k,
        count: k === 'overdue' ? count(r => !!r.badgeAlert) : count(r => (r.badge ?? '').toLowerCase().replace(' ', '_') === k) }));
    if (slice === 'expenses') {
      const keys = [...new Set(rawRows.map(r => monthKey(r.sortDate)).filter(Boolean))].sort().reverse().slice(0, 6);
      return keys.map(k => ({ key: k, label: monthLabel(k), count: count(r => monthKey(r.sortDate) === k) }));
    }
    if (slice === 'events') {
      const today = new Date().toISOString().slice(0, 10);
      const week = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
      return [
        { key: 'week', label: 'this week', count: count(r => (r.sortDate ?? '') >= today && (r.sortDate ?? '') <= week && (r.badge ?? '') === 'upcoming') },
        { key: 'later', label: 'later', count: count(r => (r.sortDate ?? '') > week && (r.badge ?? '') === 'upcoming') },
        { key: 'done', label: 'done', count: count(r => (r.badge ?? '') === 'done') },
      ];
    }
    return [];
  }, [slice, rawRows]);

  const passesFilter = (r: Row): boolean => {
    if (!filterKey) return true;
    if (slice === 'leads') return (r.badge ?? '').toLowerCase() === filterKey;
    if (slice === 'invoices') return filterKey === 'overdue' ? !!r.badgeAlert : (r.badge ?? '').toLowerCase().replace(' ', '_') === filterKey;
    if (slice === 'expenses') return monthKey(r.sortDate) === filterKey;
    if (slice === 'events') {
      const today = new Date().toISOString().slice(0, 10);
      const week = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
      if (filterKey === 'week') return (r.sortDate ?? '') >= today && (r.sortDate ?? '') <= week && (r.badge ?? '') === 'upcoming';
      if (filterKey === 'later') return (r.sortDate ?? '') > week && (r.badge ?? '') === 'upcoming';
      return (r.badge ?? '') === 'done';
    }
    return true;
  };

  const rows = useMemo(() => {
    // TDW_04 A2: optimistic layer — deferred deletes hide rows now; deferred
    // state moves override the badge now; UNDO reverts both (lib/vendor/undo).
    let out = rawRows.filter(r => !hiddenIds.has(r.id)).map(r => badgeOverride[r.id] ? { ...r, badge: badgeOverride[r.id], badgeAlert: badgeOverride[r.id] === 'lost' } : r);
    out = out.filter(passesFilter); // TDW_04 A4: the rail's single-select
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter(r => r.primary.toLowerCase().includes(q)||(r.secondary??'').toLowerCase().includes(q)||(r.meta??'').toLowerCase().includes(q));
    }
    // TDW_04 A4 (P4): sort toggle — recent (wire order) · amount · date.
    if (sortKey === 'amount') out = [...out].sort((a, b) => (b.payAmount ?? b.pipelineValue ?? 0) - (a.payAmount ?? a.pipelineValue ?? 0));
    else if (sortKey === 'date') out = [...out].sort((a, b) => (a.sortDate ?? '9999') < (b.sortDate ?? '9999') ? -1 : 1);
    return out;
  }, [rawRows, query, hiddenIds, badgeOverride, filterKey, sortKey, slice]);

  // TDW_04 A4 (F-04.14, CE-RATIFIED — returns ruled after the A3.2 revert):
  // slice→slice navigation REMOUNTS (A2's verdict), so the optimistic badge
  // reverted while its write sat in the 30s window — read as data loss.
  // Leaving the screen COMMITS what's pending: the undo window is a courtesy
  // for the moment you're looking at the row, not a vote to discard the write.
  useEffect(() => () => { flushAllPending(); }, []);

  // ── F-39.11 · `?lead=<id>` FOCUSES ONE ROW, INSIDE THE SHELL ONLY ──────────
  //
  // A Today card names a record; the room it lands in has to be able to show WHICH. There
  // was no way for a route to say that — this module reads no search param anywhere — so
  // the param is the smallest thing that closes it.
  //
  // ⚠ GATED ON `inShell`, AND THE FALLBACK IGNORES IT BY CONSTRUCTION. `/vendor/list/leads
  // ?lead=…` does nothing at all: the effect returns before it reads the param. That is
  // the ruling's shape and it is also the safe one — the /vendor tree is being retired at
  // Phase 7 and must not grow a behaviour that has to be retired with it.
  //
  // ⚠ IT OPENS THE SHEET — AND THE ARM IT REPLACES WAS THIS SEAT'S OWN ARGUMENT.
  //
  // The first cut focused and scrolled the row and stopped there, on the reasoning that a
  // sheet opening itself from an address is a surface the vendor did not ask for. THE
  // FOUNDER'S WALK CONVICTED IT IN ONE SENTENCE: 「essentially its a double tap to reach
  // whats alredy there」. She DID ask — she tapped a card carrying one lead's name. Landing
  // her in a list with that lead outlined answers a question she did not put and then asks
  // her to put it again. Against W-1 the card removed nothing: Rooms→Leads→row was three
  // taps and Today→card→row is three. Chair's F-39.11 arm withdrawn at c-39.25.
  //
  // ⚠ THE OTHER REFUSAL SURVIVES INTACT, AND IT IS THE ONE THAT MATTERS. `selected` is the
  // long-press BULK set; a URL must NEVER enter select-mode with a row ticked, because that
  // is a gesture's state entered without the gesture. `setSel` opens the record. The two
  // were refused together and only one of them was wrong.
  //
  // THE SCROLL STAYS. When the vendor closes the sheet she lands on the row she came for,
  // in view, rather than at the top of a list of eleven.
  //
  // IT RUNS WHEN THE ROWS DO. `rows` is the dependency because the element cannot be found
  // before the list paints, and a one-shot on mount would silently miss every time.
  const focusedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!screenInShell || slice !== 'leads') return;
    const want = new URLSearchParams(window.location.search).get('lead');
    if (!want || focusedRef.current === want) return;
    if (!rows.some((r) => r.id === want)) return;
    const el = document.querySelector<HTMLElement>(`[data-row-id="${CSS.escape(want)}"]`);
    if (!el) return;
    focusedRef.current = want;
    el.scrollIntoView({ block: 'center' });
    const row = rows.find((r) => r.id === want);
    if (row) setSel(row);
  }, [screenInShell, slice, rows]);

  // Fetch lead detail when a lead row is selected
  useEffect(() => {
    if (slice !== 'leads' || !sel) { setLeadDetail(null); return; }
    setLoadingDetail(true);
    fetchLeadDetail(sel.id).then(res => {
      if (res.ok) setLeadDetail({ vendor_summary: res.vendor_summary, conversation: res.conversation });
    }).catch(() => {}).finally(() => setLoadingDetail(false));
  }, [sel, slice]);

  // TDW_04 A1 — the leads-plane wishbone. DetailSheet's own P3 comment named
  // this injection; the sheet itself is a module (tenancy law: machinery
  // migrates out as phases rebuild it). Completion goes through updateLead —
  // the wire's complete_inline door, "one door, both callers" — and refetches
  // via the invalidation bus (the F2 lesson).
  const [wishboneRow, setWishboneRow] = useState<Row | null>(null);


  function onEditHere(row: Row) {
    setSel(null);
    let raw: Record<string,unknown> | null = null;
    raw = ((d.data ?? []).find(r => r.id === row.id) as unknown as Record<string,unknown>) ?? null;
    if (!raw) raw = { id: row.id };
    setEditRow(raw);
    setAddOpen(true);
  }
  function onAdd() { setEditRow(null); setAddOpen(true); }

  // TDW_04 A2 (F2's cure): the destructive confirm is now OPTIMISTIC — the row
  // hides at once, the sheet closes, and the write fires when the 30s undo
  // window lapses (deferred-fire; see lib/vendor/undo.ts). UNDO restores the
  // row and no write ever happens. On commit failure the bus refetch restores
  // truth and an error toast says so.
  function confirmDelete() {
    if (!sel || deleting) return;
    const row = sel;
    const req = deleteRequest(row);
    if (req === 'unsupported') { setDeleteMsg("Can't delete from here yet. Use the chat."); return; }
    setSel(null); setConfirmDel(false); setDeleteMsg(null);
    undoableMutation({
      apply:  () => hideRow(row.id),
      revert: () => unhideRow(row.id),
      commit: async () => {
        const res = await fetch(req.url, { method: req.method, headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: req.body });
        const data = await res.json().catch(() => ({ ok: false, error: 'Server error.' }));
        if (!res.ok || !data.ok) { unhideRow(row.id); showToast(data.error ?? 'Delete failed — the row is back.', 'error'); }
      },
      toastMsg: req.successMessage ?? 'Removed.',
    });
  }

  // TDW_04 A2 (L-2): Mark lost — the deliberate, SEPARATE action with its own
  // confirm. State move, not a delete; deferred-fire + undo like every mutation.
  // F-04.12 (founder-ruled 2026-07-15): UNGATED BUT CONFESSED. Any state may go
  // to lost — a booked client can walk at any stage and the vendor must be able
  // to say so. But a backwards-unusual leap (from booked/consult) gets one line
  // of confession in the confirm, plus an optional reason that lands in `notes`
  // through the door. No hard gate: the product warns, the vendor rules, the
  // record remembers.
  const BACKWARD_UNUSUAL = ['booked', 'consult'];
  const isBackwardUnusual = (badge?: string) => BACKWARD_UNUSUAL.includes((badge ?? '').toLowerCase());

  function markLost(row: Row) {
    setMarkLostConfirm(false);
    setSel(null);
    const prevBadge = row.badge ?? 'new';
    const reason = lostReason.trim();
    setLostReason('');
    undoableMutation({
      apply:  () => setBadge(row.id, 'lost'),
      revert: () => setBadge(row.id, null),
      commit: async () => {
        // The reason rides the door's own contract (PATCH /state takes `reason`
        // and lands it in the notes trail — verified at HEAD, leads.js).
        const res = await patchLeadState(row.id, 'lost', reason || undefined);
        setBadge(row.id, null); // bus refetch takes over as truth
        if (!('ok' in res) || !res.ok) showToast(`Could not mark ${row.primary} lost — still ${prevBadge}.`, 'error');
      },
      toastMsg: `${row.primary} marked lost.`,
    });
  }


  // ── TDW_04 A2: the approved swipe table per slice (TDW_03 P4, absorbed) ──
  // leads R: state→booked · leads L: Call if phone else Mark lost (confirm)
  // invoices R: mark fully paid (payments door) · L: cancel (existing confirm)
  // expenses R: repeat last (A4's AddSheet rebuild owns the prefill — deferred,
  //   logged) · L: delete (existing confirm)
  // events R: state→done · L: cancel (existing confirm)
  // Non-destructive moves are deferred-fire + undo; destructive gestures open
  // the standing confirm sheet (whose confirm is itself undoable now).
  function swipeSidesFor(row: Row): { right?: SwipeSide; left?: SwipeSide } {
    if (slice === 'leads') return {
      right: { label: 'Booked', onTrigger: () => undoableMutation({
        apply: () => setBadge(row.id, 'booked'), revert: () => setBadge(row.id, null),
        commit: async () => { const r = await patchLeadState(row.id, 'booked'); setBadge(row.id, null); if (!('ok' in r) || !r.ok) showToast(`Could not book ${row.primary}.`, 'error'); },
        toastMsg: `${row.primary} → booked.` }) },
      // ── R-37.22 · THE LEFT SIDE SUPPRESSES ON A REDACTED ROW ──────────────
      // THE INCIDENT THIS CLOSES, written down because it was live: Seat A′'s
      // recut withholds `phone` from a basic vendor's leads wire (R-36.13 — the
      // gate is the mode to connect). This ternary keyed on `row.phone`, so on
      // 0dc5a27's deploy every basic vendor's left swipe silently STOPPED being
      // `Call` and BECAME `Mark lost` — a different verb in a remembered
      // position, on the paid product, with no ruling behind it.
      //
      // GRADED HONESTLY, NOT DRAMATICALLY: it opened the standing confirm and
      // `Mark lost` is itself undoable, so nothing was destroyed silently. The
      // defect was the gesture changing identity underneath the vendor's thumb.
      //
      // THE RULING IS SUPPRESSION, NOT SUBSTITUTION. On a redacted row the left
      // side renders NOTHING. The two refused arms are worth keeping visible:
      // routing the gesture to the upsell was refused because A GESTURE MUST
      // NEVER OPEN A SALES SURFACE, and keeping `Mark lost` was refused because
      // per-tier gesture semantics is the muscle-memory trap itself. `Mark lost`
      // stays reachable through the detail sheet's own control, so nothing is
      // lost but the ambiguity.
      //
      // KEYED ON `redacted`, NEVER ON `!row.phone` (R-37.23). The wire's
      // positive statement is the signal; an absent phone cannot tell a
      // withheld number from a lead that never had one, and the second of those
      // is a perfectly ordinary row whose swipe should keep working.
      left: row.redacted
        ? undefined
        : row.phone
          ? { label: 'Call', onTrigger: () => { window.location.href = `tel:${row.phone}`; } }
          : { label: 'Mark lost', destructive: true, onTrigger: () => { setSel(row); setMarkLostConfirm(true); } },
    };
    if (slice === 'invoices') return {
      right: { label: COPY.studioMarkPaid, onTrigger: () => {
        const owed = row.payAmount ?? 0;
        if (owed <= 0) { showToast('Already settled.', 'success'); return; }
        undoableMutation({
          apply: () => setBadge(row.id, 'paid'), revert: () => setBadge(row.id, null),
          commit: async () => { const r = await recordPayment(row.id, { amount: owed }); setBadge(row.id, null); if (!('ok' in r) || !r.ok) showToast(`Payment on ${row.secondary ?? row.primary} failed.`, 'error'); },
          toastMsg: `${row.secondary ?? row.primary} marked fully paid.` });
      } },
      left: { label: 'Cancel', destructive: true, onTrigger: () => { setSel(row); setConfirmDel(true); } },
    };
    // ── R-37.43 §8.3 · THE RIGHT SIDE SUPPRESSES ON AN EXPENSE ROW ──────────
    // THE DISEASE, written down because it was live on the paid shell: the right
    // swipe was labelled `Repeat` and its entire body was
    // `showToast('Repeat-last lands with the AddSheet rebuild (A4).', 'success')`.
    // Zero writes behind it, ungated, on every tier. A vendor swiped a real
    // expense row, the gesture completed, and the estate answered in the SUCCESS
    // register — the same green the invoice row beside it uses when a payment
    // actually lands. §4's house law is one sentence: the UI confirms only what a
    // tool result or an API response proved. This confirmed nothing and said so
    // in the voice of proof.
    //
    // GRADED HONESTLY, NOT DRAMATICALLY: nothing was destroyed, no money moved,
    // no row changed — the toast was the entire effect. The defect is that the
    // vendor was told an act had occurred. A ledger surface that lies about a
    // small act is not believed about a large one, and that is the whole cost.
    //
    // THE CURE IS SUPPRESSION, NOT SUBSTITUTION — R-37.22's shape, reused because
    // this is the same class one gesture over. The right side renders NOTHING:
    // SwipeRow clamps `next = 0` when a side is absent, so the row does not
    // translate, no label reveals, and there is no handler to fire. The two
    // refused arms are kept visible: an HONEST toast ("Repeat lands later") was
    // refused because a gesture that answers is a gesture that did something, and
    // a different verb in the remembered position was refused as the
    // muscle-memory trap R-37.22 already named. No copy byte ships here — there
    // is no byte to veto because there is no surface.
    //
    // WHAT RETURNS WHEN A4 LANDS: `Repeat` comes back with the AddSheet rebuild
    // behind it, writing before it speaks. The gesture is not retired; it is held
    // until it has something true to say. Delete is untouched — the left side was
    // never part of this.
    if (slice === 'expenses') return {
      right: undefined,
      left: { label: 'Delete', destructive: true, onTrigger: () => { setSel(row); setConfirmDel(true); } },
    };
    if (slice === 'events') return {
      // TDW_04 A3 (F-04.8, CE-ratified): the state door now stands — A2 stubbed
      // this honest rather than inventing a route, and the rider shipped with
      // A3's mastheads. Mark-done is a real write again.
      right: { label: 'Done', onTrigger: () => undoableMutation({
        apply: () => setBadge(row.id, 'done'), revert: () => setBadge(row.id, null),
        commit: async () => { const r = await updateEvent(row.id, { state: 'done' }); setBadge(row.id, null); if (!('ok' in r) || !r.ok) showToast(`Could not mark ${row.primary} done.`, 'error'); },
        toastMsg: `${row.primary} → done.` }) },
      left: { label: 'Cancel', destructive: true, onTrigger: () => { setSel(row); setConfirmDel(true); } },
    };
    return {};
  }

  // Long-press (500ms) enters select mode; taps toggle while selecting.
  // The RELEASE of a long-press also synthesizes a click — which would toggle
  // the fresh selection straight back off. Suppress that one click.
  const longPressFired = useRef(false);
  function rowPressHandlers(row: Row) {
    return {
      onPointerDown: () => { longPress.current = setTimeout(() => { longPressFired.current = true; setSelected(s => new Set(s).add(row.id)); }, 500); },
      onPointerUp:   () => { if (longPress.current) clearTimeout(longPress.current); },
      onPointerMove: () => { if (longPress.current) clearTimeout(longPress.current); },
      onPointerCancel: () => { if (longPress.current) clearTimeout(longPress.current); },
      onClickCapture: (e: React.MouseEvent) => { if (longPressFired.current) { longPressFired.current = false; e.preventDefault(); e.stopPropagation(); } },
    };
  }
  function toggleSelected(row: Row) {
    setSelected(s => { const n = new Set(s); if (n.has(row.id)) n.delete(row.id); else n.add(row.id); return n; });
  }

  // ── TDW_04 A3 (P5/ST-4/L-4): THE mastheads ─────────────────────────────
  // Every figure rides lib/vendor/derive.ts — the same function the hub Ledger
  // reads, over the same rows. Invoices' "outstanding" here IS the hub's "Owed":
  // one derivation, two renderers, agreement by construction.
  const cabForMoney = useCabinetData(slice === 'invoices' || slice === 'clients' ? vendorId : null);
  const masthead = useMemo(() => {
    if (slice === 'invoices') {
      const m = deriveMoney(cabForMoney.data);
      return <Masthead eyebrow="Outstanding" value={m.outstanding} isMoney
        sub={m.owedCount === 0 ? 'from your binders · settled' : `from your binders · across ${m.owedCount} open`} />;
    }
    if (slice === 'clients') {
      const c = deriveClients(cabForMoney.data);
      return <Masthead eyebrow="Active engagements" value={c.count}
        sub={c.count === 1 ? 'from your binders · 1 client' : 'from your binders · client-stage binders'} />;
    }
    if (slice === 'leads') {
      const p = derivePipeline(rawRows.map(r => ({ state: r.badge, budget_total: r.pipelineValue })));
      return <Masthead eyebrow="Pipeline value" value={p.value} isMoney
        sub={p.count === 0 ? 'enquiries · nothing open' : `enquiries · across ${p.count} open`} />;
    }
    if (slice === 'expenses') {
      const e = deriveExpensesThisMonth(rawRows.map(r => ({ amount: r.pipelineValue, expense_date: r.sortDate })));
      return <Masthead eyebrow="This month" value={e.total} isMoney
        sub={e.count === 0 ? 'from your binders · nothing filed' : `from your binders · ${e.count} filed`} />;
    }
    if (slice === 'events') {
      const w = deriveEventsThisWeek(rawRows.map(r => ({ event_date: r.sortDate, state: r.badge?.toLowerCase() })));
      return <Masthead eyebrow="This week" value={w.count}
        sub={w.count === 0 ? 'your calendar · nothing booked' : w.count === 1 ? 'your calendar · 1 event' : 'your calendar · events ahead'} />;
    }
    return null;
  }, [slice, cabForMoney.data, rawRows]);

  // ── F-2c.p9 · MONEY'S PRIMARY VERB IS NOT GESTURE-ONLY ────────────────────
  // The founder's 2c walk: an invoice could only be settled by SWIPING it. A
  // gesture has no affordance — nothing on the row says it exists, nothing tells
  // a new vendor it is there, and a screen reader reaches none of it. So the
  // BUTTON IS ADDED AND THE SWIPE STAYS: both call the SAME handler, so there is
  // one write path and two ways to reach it, and neither can drift from the
  // other by being edited alone.
  //
  // ⚠ OUTSTANDING ROWS ONLY (card ⑥, founder-ruled at the mock). A settled row
  // carries no button. The swipe still reaches every row and still answers
  // 「Already settled.」 there — that byte survives as the GESTURE's answer,
  // because a gesture that lands on a settled row has to say something, while a
  // button that would say it does not need to exist. The veto sheet's §B6 note
  // said the opposite and the frame said this; the frame won (c-2c.s2, the
  // executor's, struck by his own hand).
  //
  // ⚠ NOT INSIDE `SwipeRow`. The button sits BELOW the swiping element, so a
  // press on it is never eaten by a horizontal drag and a drag never fires it.
  // It also renders outside select mode only: a bulk selection already offers
  // `Mark paid` on the bar and two live paths to one write on one screen is how
  // a vendor pays an invoice twice.
  const markPaidFor = (row: Row) => swipeSidesFor(row).right;
  const renderRow = (row: Row) => (
    <div {...rowPressHandlers(row)} style={{ position: 'relative' }}>
      {selectMode && (
        <span aria-hidden style={{
          position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
          width: 16, height: 16, borderRadius: '50%', border: '1px solid var(--atelier-accent-text)',
          background: selected.has(row.id) ? 'var(--atelier-accent-text)' : 'transparent',
        }} />
      )}
      <div style={selectMode ? { paddingLeft: 18 } : undefined}>
        <SwipeRow right={selectMode ? undefined : swipeSidesFor(row).right} left={selectMode ? undefined : swipeSidesFor(row).left}>
          <SliceRow row={row} slice={slice} onSelect={() => selectMode ? toggleSelected(row) : (setSel(row), setConfirmDel(false))} />
        </SwipeRow>
        {slice === 'invoices' && !selectMode && (row.payAmount ?? 0) > 0 && (
          <div style={{ padding: '0 var(--slice-inset, 22px) 12px' }}>
            {/* ⚠ INLINE, NOT A `wl-` CLASS, AND THAT IS THE WHOLE REASON THIS
                LOOKS UNLIKE `TeamTabs`' row button. `SliceShell` is mounted in
                BOTH trees — inside the shell at `/w/list/[slice]` and on
                `/vendor/list/[slice]` — and every `wl-` rule is emitted by
                `WorklistShell`'s SHELL_CSS, which the /vendor tree never mounts.
                A shell class here would paint an unstyled button on half its
                sites: the wl-plink disease, with money's primary verb on it.
                The `--atelier-*` roles below are global in both trees. */}
            <button type="button" onClick={() => markPaidFor(row)?.onTrigger()}
              style={{
                minHeight: 32, padding: '0 14px', borderRadius: 3, background: 'transparent',
                border: `0.5px solid ${A.interactive}`, color: A.interactive,
                fontFamily: F.label, fontWeight: 300, fontSize: 10,
                letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
              }}>
              {COPY.studioMarkPaid}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ── TDW_04 A2: bulk (P4-verbatim): sequential calls, per-row result,
  //    `n done · m failed (retry)` summary; retry re-runs the failures. Bulk
  //    commits immediately (the spec's own summary grammar), single-row
  //    mutations carry the undo window.
  const bulkActions: BulkAction[] =
    slice === 'leads'    ? [{ key: 'contacted', label: 'Mark contacted' }, { key: 'lose', label: 'Lose', destructive: true }]
    : slice === 'invoices' ? [{ key: 'paid', label: COPY.studioMarkPaid }]
    : slice === 'expenses' ? [{ key: 'delete', label: 'Delete', destructive: true }]
    : slice === 'events'   ? [{ key: 'done', label: 'Mark done' }] // TDW_04 A3: the door landed (F-04.8)
    : [];

  async function runBulk(key: string, ids?: string[]) {
    const targets = ids ?? Array.from(selected);
    if (!targets.length) return;
    setBulkBusy(true);
    const failed: string[] = [];
    for (const id of targets) {
      const row = rawRows.find(r => r.id === id);
      try {
        let ok = false;
        if (slice === 'leads' && key === 'contacted') { const r = await patchLeadState(id, 'contacted'); ok = 'ok' in r && r.ok; }
        else if (slice === 'leads' && key === 'lose') { const r = await patchLeadState(id, 'lost'); ok = 'ok' in r && r.ok; }
        else if (slice === 'invoices' && key === 'paid') { const owed = row?.payAmount ?? 0; if (owed <= 0) { ok = true; } else { const r = await recordPayment(id, { amount: owed }); ok = 'ok' in r && r.ok; } }
        else if (slice === 'expenses' && key === 'delete') { const r = await deleteExpense(id); ok = 'ok' in r && r.ok === true; }
        else if (slice === 'events' && key === 'done') { const r = await updateEvent(id, { state: 'done' }); ok = 'ok' in r && r.ok; }
        if (!ok) failed.push(id);
      } catch { failed.push(id); }
    }
    setBulkBusy(false);
    setSelected(new Set(failed));
    invalidateSlice(slice);
    const done = targets.length - failed.length;
    if (failed.length) showToast(`${done} done · ${failed.length} failed`, 'error', { action: { label: 'Retry', onAction: () => { void runBulk(key, failed); } }, durationMs: 8000 });
    else showToast(`${done} done.`, 'success');
  }

  // Per-slice detail extras — verbatim from the monofile; P2/P4/P5 migrate
  // these into their modules as those phases rebuild them.
  const detailExtra = (
    <>
      {/* TDW_04 A1 — the wishbone chips, leads plane. Render truth (the wire's
          missing set); tap opens the WishboneSheet. */}
      {slice === 'leads' && sel && (sel.draftMissing?.length ?? 0) > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginBottom: 8 }}>
            Still missing — tap to complete:
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {sel.draftMissing!.map(c => (
              <button key={c} type="button" onClick={() => setWishboneRow(sel)} style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute,
                letterSpacing: '0.06em', border: '0.5px solid var(--atelier-ink-dim)',
                borderRadius: 2, padding: '3px 8px', background: 'transparent', cursor: 'pointer',
              }}>+ {cap(c.replace(/_/g, ' '))}</button>
            ))}
          </div>
        </div>
      )}

      {/* Invoice payment schedule */}
      {slice === 'invoices' && sel && (
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: '0.5px solid var(--atelier-card-border)' }}>
          <button type="button" onClick={downloadInvoicePdf} disabled={pdfBusy}
            className={!pdfBusy ? 'atelier-fab' : undefined}
            style={{
              width: '100%', marginBottom: 8, padding: '11px 14px',
              background: pdfBusy ? 'rgba(201,168,76,0.18)' : undefined,
              border: '0.5px solid var(--atelier-label)', borderRadius: 3,
              cursor: pdfBusy ? 'default' : 'pointer', opacity: pdfBusy ? 0.6 : 1,
              fontFamily: F.label, fontWeight: 400, fontSize: 9, color: INK_DEEP,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
            {pdfBusy ? 'Fetching…' : '↓ Download PDF'}
          </button>

          {/* Send on WhatsApp — only shown when client has a phone number.
              Fetches the PDF URL, then opens wa.me pre-loaded with the
              client's number and the PDF link in the draft message. */}
          {sel.client_phone && (
            <button type="button"
              onClick={async () => {
                try {
                  const res = await fetchInvoicePdf(sel.id);
                  const pdfRes = res as { ok: boolean; pdf_url?: string; error?: string };
                  if (pdfRes.ok && pdfRes.pdf_url) {
                    const phone   = (sel.client_phone ?? '').replace(/\D/g, '');
                    const message = encodeURIComponent(`Hi ${sel.primary}, please find your booking confirmation for ${sel.secondary ?? 'your invoice'} here: ${pdfRes.pdf_url}`);
                    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener');
                  } else {
                    // UNCHANGED WORDING, REHOMED. A real precondition is not
                    // the same defect as an invented state — this sentence names
                    // something the vendor can actually do. It moves to the
                    // register for the one-home law alone.
                    showToast(pdfRes.error ?? COPY.studioPdfNoAdvance, 'error');
                  }
                } catch {
                  showToast('Could not fetch the PDF. Try again.', 'error');
                }
              }}
              style={{
                width: '100%', marginBottom: 16, padding: '11px 14px',
                background: 'transparent',
                border: '0.5px solid rgba(37,211,102,0.5)', borderRadius: 3,
                cursor: 'pointer',
                fontFamily: F.label, fontWeight: 400, fontSize: 9, color: '#25D366',
                letterSpacing: '0.28em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              ↗ Send on WhatsApp
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.brass, letterSpacing: '0.42em', textTransform: 'uppercase' }}>Payment Schedule</span>
            <span style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.22)' }} />
            {schedule && schedule.length === 0 && (
              <button type="button" onClick={() => setScheduleOpen(true)} style={{
                padding: '5px 10px', background: 'transparent',
                border: '0.5px solid rgba(201,168,76,0.5)', borderRadius: 2, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.interactiveWarm,
                letterSpacing: '0.28em', textTransform: 'uppercase',
              }}>Add</button>
            )}
          </div>
          {scheduleLoading && <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Fetching…</div>}
          {schedule && schedule.map(ms => (
            <div key={ms.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
              borderBottom: '0.5px solid rgba(201,168,76,0.10)',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: A.ink }}>{ms.milestone_label}</div>
                <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 2 }}>
                  Rs {ms.amount_due.toLocaleString('en-IN')} · {ms.pct}%{ms.due_date ? ` · ${ms.due_date}` : ''}
                </div>
              </div>
              <span style={{
                fontFamily: F.label, fontWeight: 400, fontSize: 8,
                color: ms.state === 'paid' ? A.green : ms.state === 'waived' ? A.inkMute : A.brassWarm,
                letterSpacing: '0.28em', textTransform: 'uppercase',
                border: `0.5px solid ${ms.state === 'paid' ? A.green : ms.state === 'waived' ? 'var(--atelier-ink-dim)' : 'rgba(224,188,110,0.5)'}`,
                borderRadius: 2, padding: '3px 8px', flexShrink: 0,
              }}>{ms.state}</span>
              {ms.state === 'pending' && (
                <button type="button" onClick={async () => {
                  setScheduleSaving(true);
                  const res = await markMilestonePaid(ms.id, ms.amount_due);
                  if (res.ok) setSchedule(prev => prev ? prev.map(m => m.id === ms.id ? (res as { milestone: ScheduleMilestone }).milestone : m) : prev);
                  setScheduleSaving(false);
                }} disabled={scheduleSaving} className="atelier-fab" style={{
                  padding: '5px 10px', borderRadius: 2, cursor: 'pointer',
                  border: '0.5px solid var(--atelier-label)',
                  fontFamily: F.label, fontWeight: 400, fontSize: 8, color: INK_DEEP,
                  letterSpacing: '0.28em', textTransform: 'uppercase', flexShrink: 0,
                }}>Paid</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lead vendor summary + conversation */}
      {slice === 'leads' && (leadDetail || loadingDetail) && (
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: '0.5px solid var(--atelier-card-border)' }}>
          {loadingDetail && !leadDetail
            ? <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Fetching…</div>
            : leadDetail && <ConversationThread vendorSummary={leadDetail.vendor_summary} messages={leadDetail.conversation} />
          }
        </div>
      )}
    </>
  );

  // Per-slice footer extras — leads WhatsApp/Call row, verbatim
  // TDW_04 A2 (L-2): the deliberate Mark-lost block for the leads detail sheet.
  const markLostBlock = slice === 'leads' && sel && sel.badge !== 'lost' ? (
    <div style={{ marginBottom: 10 }}>
      {!markLostConfirm ? (
        <button type="button" onClick={() => setMarkLostConfirm(true)} style={{
          width: '100%', padding: '11px 14px', background: 'transparent',
          border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2, cursor: 'pointer',
          fontFamily: F.label, fontWeight: 300, fontSize: 9, color: 'var(--atelier-ink-mute, #8a8578)',
          letterSpacing: '0.32em', textTransform: 'uppercase',
        }}>Mark lost</button>
      ) : (
        <div>
          {/* F-04.12's confession — one line, only when the leap is backwards-unusual */}
          {isBackwardUnusual(sel?.badge) && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.inkSoft, lineHeight: 1.5, marginBottom: 8 }}>
                This one&rsquo;s further along — marking lost will keep the record, state the reason?
              </div>
              <input
                type="text"
                value={lostReason}
                onChange={e => setLostReason(e.target.value)}
                placeholder="Optional — it lands in the notes"
                style={{
                  width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                  background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-card-border)',
                  borderRadius: 2, fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink,
                }}
              />
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => sel && markLost(sel)} style={{
            flex: 1, padding: '11px 14px', background: 'transparent',
            border: '0.5px solid rgba(224,112,112,0.5)', borderRadius: 2, cursor: 'pointer',
            fontFamily: F.label, fontWeight: 400, fontSize: 9, color: 'var(--role-critical)',
            letterSpacing: '0.32em', textTransform: 'uppercase',
          }}>Yes — mark {sel?.primary} lost</button>
          <button type="button" onClick={() => setMarkLostConfirm(false)} style={{
            padding: '11px 14px', background: 'transparent', border: '0.5px solid var(--atelier-sheet-border)',
            borderRadius: 2, cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 9,
            color: 'var(--atelier-ink-mute, #8a8578)', letterSpacing: '0.32em', textTransform: 'uppercase',
          }}>Keep</button>
          </div>
        </div>
      )}
    </div>
  ) : null;

  const footerExtra = (
    <>
      {!confirmDel && markLostBlock}
      {/* ── R-37.24 · THE CONNECT SLOT ────────────────────────────────────────
          Where the WhatsApp and Call buttons would sit, a basic vendor gets ONE
          affordance that says why they are not there and where to go.

          IT SITS HERE AND NOT ON THE LIST ROW, and the reason is a correction
          this seat had to make to its own committed handover: the list-row
          contact buttons at SliceRow are `slice === 'clients'` and have NEVER
          rendered for leads at any tier. Three documents said otherwise —
          NOTE 36 §3, this arc's kickoff, and the Seat A′ handover I wrote — all
          from one ungrounded grep. THIS footer is where lead contact actually
          lives, so this is where its absence gets explained. A slot on the list
          rows would be NEW chrome rather than a replacement, and R-37.24 refused
          it this sitting as wanting its own founder word.

          KEYED ON `sel?.redacted` (R-37.23) — the wire's positive statement.
          Not `!sel?.phone`: a lead that simply never had a number is not a
          withheld one, and telling that vendor to upgrade would be a lie.
          Payload-keyed in both directions, so a paying card is byte-identical.

          THE COPY IS THE FOUNDER'S, EXECUTED 2026-08-25, shipped character for
          character. The CTA ships on his silence per the kickoff's own term. */}
      {slice === 'leads' && sel?.redacted && !confirmDel && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 4 }}>
          <div style={{
            // 16px on F.script italic 300 is the row's OWN detail-line rung
            // (SliceRow's `detailLine`), which is also the T-1 body floor. The
            // first cut of this block shipped 15 and `tdw09_type` named it at
            // the byte — a tenth declared size against nine rungs, below the
            // floor. The census caught a sentence nobody would have squinted at.
            fontFamily: F.script, fontWeight: 300, fontSize: 16,
            lineHeight: 1.5, color: A.inkMute, letterSpacing: '0.01em', textAlign: 'center',
          }}>Upgrade to Essential tier or above to connect with your lead.</div>
          {/* ── R-38.1 CURE (S2 ZIP bounce) · THE TIER GATE WAS THE SIXTH OF NINE ──
              This CTA was a hardcoded `/vendor/billing`, and because `notes.tsx` imports
              `SliceDoor` from this very file, the whole module \u2014 tier gate included \u2014 is in
              all six crossed rooms' chunks. One literal, six failing pairs.
              It is not a door, which is exactly why R-38.11's SliceDoor re-point walked
              past it. Reachable is reachable (R-38.11 amended by label). `roomHref` asks
              the registry instead of spelling the answer, so when Billing moves again this
              link moves with it. */}
          <a href={roomHref('billing')} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '11px 0',
            background: 'var(--atelier-input-bg)',
            border: '0.5px solid var(--atelier-sheet-border)',
            borderRadius: 2, textDecoration: 'none',
          }}>
            <span style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.brassWarm,
              letterSpacing: '0.32em', textTransform: 'uppercase',
            }}>See plans</span>
          </a>
        </div>
      )}
      {slice === 'leads' && sel?.phone && !confirmDel && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
          <a href={`https://wa.me/${sel.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 0',
              background: 'rgba(127,190,133,0.08)',
              border: '0.5px solid rgba(127,190,133,0.42)',
              borderRadius: 2, textDecoration: 'none',
            }}>
            <WaIcon />
            <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.green, letterSpacing: '0.32em', textTransform: 'uppercase' }}>WhatsApp</span>
          </a>
          <a href={`tel:${sel.phone}`}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 0',
              background: 'var(--atelier-input-bg)',
              border: '0.5px solid var(--atelier-sheet-border)',
              borderRadius: 2, textDecoration: 'none',
            }}>
            <span style={{ fontFamily: F.display, fontSize: 16, color: A.brassWarm, lineHeight: 1 }}>☎</span>
            <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.brassWarm, letterSpacing: '0.32em', textTransform: 'uppercase' }}>Call</span>
          </a>
        </div>
      )}
    </>
  );

  return (
    <SliceShell
      slice={slice}
      onBack={() => router.back()}
      query={query}
      setQuery={setQuery}
      loading={loading}
      error={error}
      rows={rows}
      onSelect={(row) => { setSel(row); setConfirmDel(false); }}
      renderRow={renderRow}
      masthead={masthead}
      filterRail={<FilterRail slice={slice} chips={filterChips} active={filterKey} onSelect={setFilterKey} />}
      sortControl={filterChips.length > 0 || slice === 'clients' ? (
        <button type="button"
          onClick={() => setSortKey(k => k === 'recent' ? 'amount' : k === 'amount' ? 'date' : 'recent')}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
            fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: A.inkMute, whiteSpace: 'nowrap',
          }}>{sortKey} ⌄</button>
      ) : undefined}
      onAdd={onAdd}
    >
      <ToastView toast={toast} />
      <AddSheet
        open={addOpen}
        slice={slice}
        onClose={() => { setAddOpen(false); setEditRow(null); }}
        onToast={(msg: string, kind?: ToastKind) => showToast(msg, kind)}
        existing={editRow}
        existingId={editRow?.id as string | undefined}
      />

      {/* Schedule builder sheet */}
      {scheduleOpen && sel && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--atelier-overlay)', zIndex: 60, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setScheduleOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%',
            background: 'var(--atelier-sheet-bg)',
            backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderTop: '0.5px solid var(--atelier-sheet-border)',
            padding: '20px 24px calc(24px + env(safe-area-inset-bottom))',
            display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '85vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
            </div>
            <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>Payment Schedule</div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.15, marginBottom: 4 }}>Add Milestones</div>
            <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: -4, marginBottom: 4 }}>
              Must sum to 100%. Amounts computed from invoice total.
            </div>

            {milestones.map((ms, idx) => (
              <div key={idx} style={{
                padding: '12px 14px',
                background: 'var(--atelier-row-hover)',
                border: '0.5px solid var(--atelier-card-border)',
                borderRadius: 2,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    value={ms.label}
                    onChange={e => setMilestones(prev => prev.map((m, i) => i === idx ? { ...m, label: e.target.value } : m))}
                    placeholder="Booking"
                    style={{
                      flex: 2, padding: '8px 10px', boxSizing: 'border-box',
                      background: 'var(--atelier-input-bg)',
                      border: '0.5px solid var(--atelier-card-border)', borderRadius: 2,
                      fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink,
                      outline: 'none', caretColor: A.interactive,
                    }}
                  />
                  <input
                    type="number"
                    value={ms.pct}
                    onChange={e => setMilestones(prev => prev.map((m, i) => i === idx ? { ...m, pct: e.target.value } : m))}
                    placeholder="%"
                    style={{
                      flex: 1, padding: '8px 10px', boxSizing: 'border-box',
                      background: 'var(--atelier-input-bg)',
                      border: '0.5px solid var(--atelier-card-border)', borderRadius: 2,
                      fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink,
                      outline: 'none', textAlign: 'right', caretColor: A.interactive,
                    }}
                  />
                  <span style={{ fontFamily: F.label, fontSize: 16, lineHeight: 1.5, color: A.inkMute, flexShrink: 0 }}>%</span>
                  {milestones.length > 2 && (
                    <button type="button" onClick={() => setMilestones(prev => prev.filter((_, i) => i !== idx))}
                      style={{ padding: '4px 6px', background: 'transparent', border: 'none', cursor: 'pointer', color: A.red, fontSize: 16, lineHeight: 1, flexShrink: 0 }}>×</button>
                  )}
                </div>
                <input
                  type="date"
                  value={ms.due_date}
                  onChange={e => setMilestones(prev => prev.map((m, i) => i === idx ? { ...m, due_date: e.target.value } : m))}
                  style={{
                    width: '100%', padding: '8px 10px', boxSizing: 'border-box',
                    background: 'var(--atelier-input-bg)',
                    border: '0.5px solid var(--atelier-card-border)', borderRadius: 2,
                    fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkSoft,
                    outline: 'none', caretColor: A.interactive,
                  }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <button type="button" onClick={() => setMilestones(prev => [...prev, { label: '', pct: '0', due_date: '' }])}
                style={{
                  padding: '6px 12px', background: 'transparent',
                  border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.interactiveWarm,
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                }}>+ Add Row</button>
              <span style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 9,
                letterSpacing: '0.28em', textTransform: 'uppercase',
                color: Math.abs(milestones.reduce((s,m) => s + Number(m.pct||0), 0) - 100) < 0.01 ? A.green : A.red,
              }}>{milestones.reduce((s,m) => s + Number(m.pct||0), 0)}% of 100%</span>
            </div>

            {(() => {
              const total = milestones.reduce((s,m) => s + Number(m.pct||0), 0);
              const canSave = Math.abs(total - 100) < 0.01 && milestones.every(m => m.label.trim());
              return (
                <>
                  {!canSave && (
                    <div style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.red, marginTop: 2 }}>
                      {Math.abs(total - 100) > 0.01 ? `Percentages must sum to 100% (currently ${total}%)` : 'All milestones need a label'}
                    </div>
                  )}
                  <button type="button" onClick={doCreateSchedule} disabled={!canSave || scheduleSaving}
                    className={canSave && !scheduleSaving ? 'atelier-fab' : undefined}
                    style={{
                      padding: '14px 0', borderRadius: 2,
                      border: '0.5px solid var(--atelier-label)',
                      cursor: (canSave && !scheduleSaving) ? 'pointer' : 'default',
                      fontFamily: F.label, fontWeight: 400, fontSize: 10, color: INK_DEEP,
                      letterSpacing: '0.42em', textTransform: 'uppercase',
                      background: !canSave || scheduleSaving ? 'rgba(201,168,76,0.18)' : undefined,
                      opacity: !canSave || scheduleSaving ? 0.6 : 1,
                      marginTop: 4,
                    }}>{scheduleSaving ? 'Saving…' : 'Create Schedule'}</button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* TDW_04 A2: select-mode bar (long-press a row to enter) */}
      <BulkBar slice={slice} selectedCount={selected.size} actions={bulkActions} busy={bulkBusy}
        onAction={(k) => { void runBulk(k); }} onCancel={() => setSelected(new Set())} />

      <DetailSheet
        slice={slice}
        sel={sel}
        onClose={() => { setSel(null); setConfirmDel(false); }}
        onEditHere={onEditHere}
        confirmDel={confirmDel}
        setConfirmDel={setConfirmDel}
        deleting={deleting}
        deleteMsg={deleteMsg}
        setDeleteMsg={setDeleteMsg}
        confirmDelete={confirmDelete}
        detailExtra={detailExtra}
        footerExtra={footerExtra}
      />

      {/* TDW_04 A1 — the wishbone, leads plane. */}
      {wishboneRow && (
        <WishboneSheet
          missing={wishboneRow.draftMissing ?? []}
          personLabel={wishboneRow.primary}
          onComplete={async (cell, value) => {
            // Cells here ∈ LEAD_EXPECTED = name/phone/wedding_date/wedding_city/
            // budget_max — all UpdateLeadRequest keys; budget is numeric.
            const body: Record<string, string | number> = { [cell]: cell === 'budget_max' ? Number(value) : value };
            const res = await updateLead(wishboneRow.id, body);
            if (!res.ok) return ('error' in res && res.error) || 'Could not file it — try again.';
            invalidateSlice('leads');
            return null;
          }}
          onDone={() => { setWishboneRow(null); setSel(null); }}
        />
      )}
    </SliceShell>
  );
}
