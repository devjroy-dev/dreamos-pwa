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

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import type { ListSlice } from '@/hooks/vendor/useLastSlice';
import { Header } from '@/components/vendor/Header';
import { API_BASE, getAuthHeader } from '@/lib/vendor/api/_base';
import { AddSheet } from '@/components/vendor/AddSheet';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import type { ToastKind } from '@/hooks/vendor/useToast';
import { fetchLeadDetail, fetchSchedule, createSchedule, markMilestonePaid, fetchInvoicePdf } from '@/lib/vendor/api/vendor';
import type { ScheduleMilestone } from '@/lib/vendor/types/vendor';
import { ConversationThread } from '@/components/vendor/ConversationThread';
import type { ConversationMessage } from '@/lib/vendor/types/vendor';
import { A, F, LABELS, WaIcon, SliceRow, type Row } from './SliceRow';
import { DetailSheet } from './DetailSheet';

// Payment schedule endpoint lands with Step 10 (artifact hands). Off until then,
// so opening an invoice doesn't fire a 404 against a route that isn't built yet.
const SCHEDULE_ENABLED: boolean = false;

// ── SliceShell · pure chrome ─────────────────────────────────────
// Masthead slot (P5 fills it), search, list + empty state, FAB.
// Sheets/overlays/toast are passed through as children by SliceScreen.
interface SliceShellProps {
  slice: ListSlice;
  vendorName: string | null;
  onBack: () => void;
  query: string;
  setQuery: (q: string) => void;
  loading: boolean;
  error: string | null;
  rows: Row[];
  onSelect: (row: Row) => void;
  onAdd: () => void;
  children?: ReactNode;
}

export function SliceShell({ slice, vendorName, onBack, query, setQuery, loading, error, rows, onSelect, onAdd, children }: SliceShellProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
      <Header vendorName={vendorName} />

      {/* Sub-header: back + brass label — the P5 masthead replaces this */}
      <div style={{ padding: '12px 22px 8px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
        <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.brassWarm, fontFamily: F.display, fontSize: 22, lineHeight: 1 }}>‹</button>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>{LABELS[slice]}</span>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 22px 6px' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: F.display, fontSize: 14, color: A.inkMute, lineHeight: 1, pointerEvents: 'none' }}>⌕</span>
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
              fontFamily: F.body, fontWeight: 300, fontSize: 13, color: A.ink,
              outline: 'none', caretColor: A.brass,
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 110 }}>
        {!loading && !error && rows.length === 0 && (
          <div style={{
            padding: '40px 24px', textAlign: 'center',
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16,
            color: A.inkMute, lineHeight: 1.5,
          }}>
            {query
              ? <>Nothing matching <span style={{ color: A.brassWarm }}>&ldquo;{query}&rdquo;</span></>
              : <>Nothing here yet.<br/><span style={{ color: A.brassWarm }}>Tap the + to add one.</span></>}
          </div>
        )}
        {rows.map(row => <SliceRow key={row.id} row={row} slice={slice} onSelect={() => onSelect(row)} />)}
      </div>

      {/* Brass-key FAB */}
      <button type="button" onClick={onAdd} aria-label={`Add ${LABELS[slice].toLowerCase()}`}
        className="atelier-fab"
        style={{
          position: 'fixed', bottom: 'calc(82px + env(safe-area-inset-bottom))', right: 20, zIndex: 30,
          width: 46, height: 46, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: F.body, fontSize: 22, fontWeight: 400, lineHeight: 1,
          cursor: 'pointer', border: '0.5px solid #E0BC6E',
        }}>+</button>

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
      monofile's chat-redirect message for any future slice without a door. */
  deleteRequest: (sel: Row) => { url: string; method: string; body?: string } | 'unsupported';
}

export function SliceScreen<T extends { id: string }>({ slice, vendorId, useData, toRows, deleteRequest }: SliceScreenProps<T>) {
  const router = useRouter();
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
  const { toast, show: showToast }   = useToast();
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
        showToast((res as { error?: string }).error ?? 'PDF not ready yet — try again in a moment.', 'error');
      }
    } catch {
      showToast('Could not fetch the PDF. Try again.', 'error');
    }
    setPdfBusy(false);
  }

  const rows = useMemo(() => {
    if (!query.trim()) return rawRows;
    const q = query.trim().toLowerCase();
    return rawRows.filter(r => r.primary.toLowerCase().includes(q)||(r.secondary??'').toLowerCase().includes(q)||(r.meta??'').toLowerCase().includes(q));
  }, [rawRows, query]);

  // Fetch lead detail when a lead row is selected
  useEffect(() => {
    if (slice !== 'leads' || !sel) { setLeadDetail(null); return; }
    setLoadingDetail(true);
    fetchLeadDetail(sel.id).then(res => {
      if (res.ok) setLeadDetail({ vendor_summary: res.vendor_summary, conversation: res.conversation });
    }).catch(() => {}).finally(() => setLoadingDetail(false));
  }, [sel, slice]);

  function onEditHere(row: Row) {
    setSel(null);
    let raw: Record<string,unknown> | null = null;
    raw = ((d.data ?? []).find(r => r.id === row.id) as unknown as Record<string,unknown>) ?? null;
    if (!raw) raw = { id: row.id };
    setEditRow(raw);
    setAddOpen(true);
  }
  function onAdd() { setEditRow(null); setAddOpen(true); }

  async function confirmDelete() {
    if (!sel || deleting) return;
    setDeleting(true);
    try {
      const req = deleteRequest(sel);
      if (req === 'unsupported') { setDeleteMsg("Can't delete from here yet. Use the chat."); setDeleting(false); return; }

      const res = await fetch(req.url, { method: req.method, headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: req.body });
      const data = await res.json().catch(() => ({ ok: false, error: 'Server error.' }));
      if (!res.ok || !data.ok) setDeleteMsg(data.error ?? 'Something went wrong. Try again.');
      else { setDeleteMsg(data.message ?? 'Done.'); setTimeout(() => { setSel(null); setConfirmDel(false); setDeleteMsg(null); }, 1200); }
    } catch { setDeleteMsg('Network error. Try again.'); }
    finally { setDeleting(false); }
  }

  // Per-slice detail extras — verbatim from the monofile; P2/P4/P5 migrate
  // these into their modules as those phases rebuild them.
  const detailExtra = (
    <>
      {/* Invoice payment schedule */}
      {slice === 'invoices' && sel && (
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: '0.5px solid var(--atelier-card-border)' }}>
          <button type="button" onClick={downloadInvoicePdf} disabled={pdfBusy}
            className={!pdfBusy ? 'atelier-fab' : undefined}
            style={{
              width: '100%', marginBottom: 8, padding: '11px 14px',
              background: pdfBusy ? 'rgba(201,168,76,0.18)' : undefined,
              border: '0.5px solid #E0BC6E', borderRadius: 3,
              cursor: pdfBusy ? 'default' : 'pointer', opacity: pdfBusy ? 0.6 : 1,
              fontFamily: F.label, fontWeight: 400, fontSize: 9, color: '#1A120E',
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
                    showToast(pdfRes.error ?? 'PDF not ready yet — record the advance first.', 'error');
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
                fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.brassWarm,
                letterSpacing: '0.28em', textTransform: 'uppercase',
              }}>Add</button>
            )}
          </div>
          {scheduleLoading && <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkMute }}>Fetching…</div>}
          {schedule && schedule.map(ms => (
            <div key={ms.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
              borderBottom: '0.5px solid rgba(201,168,76,0.10)',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 15, color: A.ink }}>{ms.milestone_label}</div>
                <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute, marginTop: 2 }}>
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
                  border: '0.5px solid #E0BC6E',
                  fontFamily: F.label, fontWeight: 400, fontSize: 8, color: '#1A120E',
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
            ? <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkMute }}>Fetching…</div>
            : leadDetail && <ConversationThread vendorSummary={leadDetail.vendor_summary} messages={leadDetail.conversation} />
          }
        </div>
      )}
    </>
  );

  // Per-slice footer extras — leads WhatsApp/Call row, verbatim
  const footerExtra = (
    <>
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
            <span style={{ fontFamily: F.display, fontSize: 14, color: A.brassWarm, lineHeight: 1 }}>☎</span>
            <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.brassWarm, letterSpacing: '0.32em', textTransform: 'uppercase' }}>Call</span>
          </a>
        </div>
      )}
    </>
  );

  return (
    <SliceShell
      slice={slice}
      vendorName={session?.name ?? null}
      onBack={() => router.back()}
      query={query}
      setQuery={setQuery}
      loading={loading}
      error={error}
      rows={rows}
      onSelect={(row) => { setSel(row); setConfirmDel(false); }}
      onAdd={onAdd}
    >
      <Toast toast={toast} />
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
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 22, color: 'var(--atelier-ink)', lineHeight: 1.15, marginBottom: 4 }}>Add Milestones</div>
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkMute, marginTop: -4, marginBottom: 4 }}>
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
                      fontFamily: F.body, fontWeight: 300, fontSize: 13, color: A.ink,
                      outline: 'none', caretColor: A.brass,
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
                      fontFamily: F.body, fontWeight: 300, fontSize: 13, color: A.ink,
                      outline: 'none', textAlign: 'right', caretColor: A.brass,
                    }}
                  />
                  <span style={{ fontFamily: F.label, fontSize: 10, color: A.inkMute, flexShrink: 0 }}>%</span>
                  {milestones.length > 2 && (
                    <button type="button" onClick={() => setMilestones(prev => prev.filter((_, i) => i !== idx))}
                      style={{ padding: '4px 6px', background: 'transparent', border: 'none', cursor: 'pointer', color: A.red, fontSize: 18, lineHeight: 1, flexShrink: 0 }}>×</button>
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
                    fontFamily: F.body, fontWeight: 300, fontSize: 12, color: A.inkSoft,
                    outline: 'none', colorScheme: 'dark', caretColor: A.brass,
                  }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <button type="button" onClick={() => setMilestones(prev => [...prev, { label: '', pct: '0', due_date: '' }])}
                style={{
                  padding: '6px 12px', background: 'transparent',
                  border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.brassWarm,
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
                    <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 12, color: A.red, marginTop: 2 }}>
                      {Math.abs(total - 100) > 0.01 ? `Percentages must sum to 100% (currently ${total}%)` : 'All milestones need a label'}
                    </div>
                  )}
                  <button type="button" onClick={doCreateSchedule} disabled={!canSave || scheduleSaving}
                    className={canSave && !scheduleSaving ? 'atelier-fab' : undefined}
                    style={{
                      padding: '14px 0', borderRadius: 2,
                      border: '0.5px solid #E0BC6E',
                      cursor: (canSave && !scheduleSaving) ? 'pointer' : 'default',
                      fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
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
    </SliceShell>
  );
}
