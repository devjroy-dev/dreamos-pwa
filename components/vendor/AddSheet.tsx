'use client';
// components/AddSheet.tsx
// Unified bottom-sheet add/edit form for all 5 slices.
// FAB taps open this; chat path preserved as secondary affordance inside.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ListSlice } from '@/hooks/vendor/useLastSlice';
import { invalidateSlice } from '@/lib/vendor/cache/invalidate';
import {
  createLead, createClient, createInvoice, createExpense, createEvent,
  updateLead, updateClient, updateInvoice, updateExpense, updateEvent,
} from '@/lib/vendor/api/vendor';
import type {
  CreateLeadRequest, CreateClientRequest, CreateInvoiceRequest,
  CreateExpenseRequest, CreateEventRequest,
  UpdateLeadRequest, UpdateClientRequest, UpdateInvoiceRequest,
  UpdateExpenseRequest, UpdateEventRequest,
  Lead, Client, Invoice, Expense, VendorEvent,
} from '@/lib/vendor/types/vendor';
import type { ToastKind } from '@/hooks/vendor/useToast';

const D = { bg: '#111111', card: 'var(--atelier-sheet-top)', border: 'var(--atelier-sheet-border)', muted: 'var(--atelier-ink-mute)', cream: 'var(--atelier-ink)', gold: 'var(--atelier-accent-text)', red: '#E07070' };
const F = { display: 'var(--font-cormorant), Georgia, serif', label: 'var(--font-jost), system-ui, sans-serif', body: 'var(--font-dm-sans), system-ui, sans-serif' };

type FieldType = 'text' | 'textarea' | 'phone' | 'date' | 'time' | 'currency' | 'select';

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

const EXPENSE_CATEGORIES: { label: string; value: string }[] = [
  { label: 'Travel', value: 'travel' }, { label: 'Equipment', value: 'equipment' },
  { label: 'Assistant', value: 'assistant' }, { label: 'Studio', value: 'studio' },
  { label: 'Marketing', value: 'marketing' }, { label: 'Software', value: 'software' },
  { label: 'Supplies', value: 'supplies' }, { label: 'Printing', value: 'printing' },
  { label: 'Commission', value: 'commission' }, { label: 'Food', value: 'food' },
  { label: 'Other', value: 'other' },
];

const EVENT_KINDS: { label: string; value: string }[] = [
  { label: 'Shoot', value: 'shoot' }, { label: 'Call', value: 'call' },
  { label: 'Meeting', value: 'meeting' }, { label: 'Task', value: 'task' },
  { label: 'Reminder', value: 'reminder' }, { label: 'Recce', value: 'recce' },
  { label: 'Fitting', value: 'fitting' }, { label: 'Trial', value: 'trial' },
  { label: 'Family', value: 'family' }, { label: 'Ceremony', value: 'ceremony' },
  { label: 'Social', value: 'social' }, { label: 'Other', value: 'other' },
];

const SCHEMAS: Record<ListSlice, { title: string; editTitle: string; fields: FieldDef[]; submit: string }> = {
  leads: {
    title: 'New lead', editTitle: 'Edit lead',
    fields: [
      { key: 'name',         label: 'Name',         type: 'text',     required: true },
      { key: 'phone',        label: 'Phone',        type: 'phone' },
      { key: 'wedding_date', label: 'Wedding date', type: 'date' },
      { key: 'wedding_city', label: 'City',         type: 'text' },
      { key: 'budget_min',   label: 'Budget min',   type: 'currency' },
      { key: 'budget_max',   label: 'Budget max',   type: 'currency' },
      { key: 'notes',        label: 'Notes',        type: 'textarea' },
    ],
    submit: 'Add lead',
  },
  clients: {
    title: 'New client', editTitle: 'Edit client',
    fields: [
      { key: 'name',  label: 'Name',  type: 'text',  required: true },
      { key: 'phone', label: 'Phone', type: 'phone' },
      { key: 'email', label: 'Email', type: 'text',  placeholder: 'email@example.com' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
    submit: 'Add client',
  },
  invoices: {
    title: 'New invoice', editTitle: 'Edit invoice',
    fields: [
      { key: 'client_name',    label: 'Client name',    type: 'text',     required: true },
      { key: 'amount_total',   label: 'Total amount',   type: 'currency', required: true },
      { key: 'client_phone',   label: 'Client phone',   type: 'phone' },
      { key: 'description',    label: 'Description',    type: 'text' },
      { key: 'amount_advance', label: 'Advance paid',   type: 'currency' },
      { key: 'due_date',       label: 'Due date',       type: 'date' },
      { key: 'notes',          label: 'Notes',          type: 'textarea' },
    ],
    submit: 'Create invoice',
  },
  expenses: {
    title: 'Log expense', editTitle: 'Edit expense',
    fields: [
      { key: 'amount',       label: 'Amount',       type: 'currency', required: true },
      { key: 'category',     label: 'Category',     type: 'select',   required: true, options: EXPENSE_CATEGORIES },
      { key: 'description',  label: 'Description',  type: 'text' },
      { key: 'expense_date', label: 'Date',         type: 'date' },
      { key: 'client_name',  label: 'Client',       type: 'text' },
      { key: 'notes',        label: 'Notes',        type: 'textarea' },
    ],
    submit: 'Log expense',
  },
  events: {
    title: 'New event', editTitle: 'Edit event',
    fields: [
      { key: 'title',      label: 'Title',      type: 'text',   required: true },
      { key: 'event_date', label: 'Date',       type: 'date',   required: true },
      { key: 'kind',       label: 'Kind',       type: 'select', required: true, options: EVENT_KINDS },
      { key: 'event_time', label: 'Time',       type: 'time' },
      { key: 'notes',      label: 'Notes',      type: 'textarea' },
    ],
    submit: 'Add event',
  },
};

const ADD_PRIMERS: Record<ListSlice, string> = {
  clients:  'What are the details of the new client? Give me their name and phone number to start.',
  leads:    "Tell me about the new enquiry — paste it or describe it and I'll log it.",
  invoices: 'Give me the details for the invoice — client name, total amount, and any advance?',
  events:   "What's the event? Give me a title, date, and time if you have it.",
  expenses: 'What did you spend on? Give me the amount and what it was for.',
};

type ExistingRow = Lead | Client | Invoice | Expense | VendorEvent;

interface Props {
  open: boolean;
  slice: ListSlice;
  onClose: () => void;
  onToast: (message: string, kind?: ToastKind) => void;
  /** When provided: edit mode — pre-fill form with existing values (raw data object, not display Row) */
  existing?: Record<string,unknown> | null;
  existingId?: string;
  /** TDW_04 B6-S1 (R-B6-18, the +Booking hedge): CREATE-mode seed values — e.g.
   *  the day-popup's + prefilling event_date. Never flips the sheet into edit
   *  mode (that is existing + existingId's job); ignored when editing. */
  initialValues?: Record<string, string>;
  /** TDW_04 B6-S2 (item 6(b), F-04.37's CRUD-door class): when the vendor is
   *  typing a BLOCK into the events create form (title says so), the sheet
   *  offers the real mechanism instead of letting a fake block file as an
   *  engagement (ALLOWED_KINDS excludes 'blocked' by door policy — a "blocked"
   *  titled 'other' event would be a lie on the grid). Provided by pages that
   *  can open the block flow; when absent the offer routes via
   *  /vendor/calendar?block=<date>. */
  onBlockInstead?: (date: string) => void;
}

function normalisePhone(v: string): string {
  const digits = v.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return v.trim() || '';
}

// TDW_04 A4 (P5's AddSheet rebuild, draft-first): a create opens with ONLY the
// essential field(s); everything else lives behind "All details ↓". On success
// the sheet STAYS: the missing fields appear as chips beneath a hairline — fill
// any inline, or Done. Closing with gaps toasts "Filed — N details pending".
// The vendor files the moment they have a name; the form stops being a toll.
const ESSENTIAL: Record<ListSlice, string[]> = {
  leads:    ['name'],
  clients:  ['name'],
  invoices: ['client_name', 'amount_total'],
  expenses: ['amount'],
  // TDW_04 B6-S2 (R-B6-28, F-04.73's cure — "events cannot file on their
  // essential"): the door requires title + event_date + kind unconditionally
  // (eventWrite's own validation), so a collapsed create showing only Title
  // could never file — the vendor's first tap ended in the door's 400. The
  // ESSENTIAL set becomes the door's required set. The Kind choice is a
  // VISIBLE required select with no default — a server default or a silent
  // client 'other' is refused as a guess wearing a save (the ruling's words).
  // Where a path seeds the date (the day sheet's + Booking, the day-popup's +),
  // the Date field renders pre-filled and editable; hiding it when unseeded
  // would recreate F-04.73 at the list page, so it always renders.
  events:   ['title', 'event_date', 'kind'],
};

export function AddSheet({ open, slice, onClose, onToast, existing, existingId, initialValues, onBlockInstead }: Props) {
  const router = useRouter();
  const schema = SCHEMAS[slice];
  const isEdit = !!existing && !!existingId;

  const [values, setValues] = useState<Record<string, string>>({});
  // TDW_04 A4 draft-first state: phase 'form' (essential-or-all) → 'chips'
  // (created; gaps offered). Edit mode always shows the full form (unchanged).
  const [showAll, setShowAll] = useState(false);
  const [phase, setPhase] = useState<'form' | 'chips'>('form');
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [chipField, setChipField] = useState<string | null>(null);
  const [chipSaving, setChipSaving] = useState(false);
  const missingKeys = schema.fields.filter(f => !ESSENTIAL[slice].includes(f.key) && !values[f.key]?.trim()).map(f => f.key);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const isDirty = useRef(false);

  // Pre-fill: runs when sheet opens (open=true) OR when the existing record changes.
  // We pass existing directly in deps — it's a new object ref each time onEditHere runs,
  // which is exactly when we want this to fire.
  useEffect(() => {
    if (!open) {
      // Reset on close so next open starts clean
      setValues({});
      setErrors({});
      return;
    }
    setErrors({});
    setSubmitting(false);
    setShowAll(false);
    setPhase('form');
    setCreatedId(null);
    setChipField(null);
    isDirty.current = false;
    if (existing && Object.keys(existing).length > 1) {
      // existing has real data (more than just {id})
      const prefill: Record<string, string> = {};
      schema.fields.forEach(f => {
        const v = existing[f.key];
        if (v != null && v !== '') prefill[f.key] = String(v);
      });
      setValues(prefill);
    } else {
      // New record or fallback — set defaults only
      const defaults: Record<string, string> = {};
      if (slice === 'expenses') defaults.expense_date = new Date().toISOString().split('T')[0];
      // B6-S1 (R-B6-18): create-mode seeds ride on top of the defaults.
      if (initialValues) Object.assign(defaults, initialValues);
      setValues(defaults);
    }
  // existing is intentionally in deps — it's a new ref each time onEditHere fires
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, existing, initialValues]);

  function set(key: string, val: string) {
    isDirty.current = true;
    setValues(prev => ({ ...prev, [key]: val }));
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    // Draft-first: a create only gates on the fields the vendor can SEE
    // (essential set, or everything when expanded). Edit gates as before.
    const gate = isEdit || showAll ? schema.fields : schema.fields.filter(f => ESSENTIAL[slice].includes(f.key));
    for (const f of gate) {
      if ((f.required || ESSENTIAL[slice].includes(f.key)) && !values[f.key]?.trim()) errs[f.key] = 'Required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit() {
    if (!validate() || submitting) return;
    // Guard: existingId must be a real UUID in edit mode
    if (isEdit && (!existingId || existingId === 'undefined')) {
      onToast('Could not identify record — please try again.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      let result: { ok: boolean; error?: string } | undefined;

      if (slice === 'leads') {
        const body: CreateLeadRequest | UpdateLeadRequest = {
          name:         values.name?.trim(),
          phone:        normalisePhone(values.phone ?? '') || undefined,
          wedding_date: values.wedding_date || undefined,
          wedding_city: values.wedding_city?.trim() || undefined,
          budget_min:   values.budget_min ? Number(values.budget_min) : undefined,
          budget_max:   values.budget_max ? Number(values.budget_max) : undefined,
          notes:        values.notes?.trim() || undefined,
        };
        result = isEdit ? await updateLead(existingId!, body as UpdateLeadRequest) : await createLead(body as CreateLeadRequest);
      } else if (slice === 'clients') {
        const body: CreateClientRequest | UpdateClientRequest = {
          name:  values.name?.trim(),
          phone: normalisePhone(values.phone ?? '') || undefined,
          email: values.email?.trim() || undefined,
          notes: values.notes?.trim() || undefined,
        };
        result = isEdit
          ? await updateClient(existingId!, body as UpdateClientRequest)
          : await createClient(body as CreateClientRequest);
      } else if (slice === 'invoices') {
        const body: CreateInvoiceRequest | UpdateInvoiceRequest = {
          client_name:    values.client_name?.trim(),
          client_phone:   normalisePhone(values.client_phone ?? '') || undefined,
          description:    values.description?.trim() || undefined,
          amount_total:   Number(values.amount_total) || 0,
          amount_advance: values.amount_advance ? Number(values.amount_advance) : undefined,
          due_date:       values.due_date || undefined,
          notes:          values.notes?.trim() || undefined,
        };
        if (isEdit) {
          const r = await updateInvoice(existingId!, body as UpdateInvoiceRequest);
          if (!r.ok && (r as {error?:string;code?:string}).code === 'INVOICE_LOCKED') {
            onToast('Invoice has payments — cancel and re-issue to edit.', 'error');
            setSubmitting(false);
            return;
          }
          result = r;
        } else {
          result = await createInvoice(body as CreateInvoiceRequest);
        }
      } else if (slice === 'expenses') {
        const body: CreateExpenseRequest | UpdateExpenseRequest = {
          amount:       Number(values.amount) || 0,
          category:     (values.category as CreateExpenseRequest['category']) || undefined,
          description:  values.description?.trim() || undefined,
          expense_date: values.expense_date || undefined,
          client_name:  values.client_name?.trim() || undefined,
          notes:        values.notes?.trim() || undefined,
        };
        result = isEdit
          ? await updateExpense(existingId!, body as UpdateExpenseRequest)
          : await createExpense(body as CreateExpenseRequest);
      } else if (slice === 'events') {
        const body: CreateEventRequest | UpdateEventRequest = {
          title:      values.title?.trim(),
          event_date: values.event_date,
          event_time: values.event_time || undefined,
          kind:       (values.kind as CreateEventRequest['kind']) || undefined,
          notes:      values.notes?.trim() || undefined,
        };
        result = isEdit
          ? await updateEvent(existingId!, body as UpdateEventRequest)
          : await createEvent(body as CreateEventRequest);
      }

      if (!result?.ok) {
        onToast((result as { error?: string })?.error ?? 'Something went wrong.', 'error');
        return;
      }

      invalidateSlice(slice);
      if (isEdit) {
        onToast('Updated.', 'success');
        onClose();
      } else {
        // TDW_04 A4 draft-first: the sheet STAYS — the row already exists; the
        // gaps become chips. Fill any, or Done.
        const rec = result as unknown as { lead?: { id: string }; client?: { id: string }; invoice?: { id: string }; expense?: { id: string }; event?: { id: string } };
        const newId = rec.lead?.id ?? rec.client?.id ?? rec.invoice?.id ?? rec.expense?.id ?? rec.event?.id ?? null;
        setCreatedId(newId);
        setPhase('chips');
      }
    } catch {
      onToast('Network error. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function saveChip(key: string) {
    if (!createdId || chipSaving) return;
    const val = values[key]?.trim();
    if (!val) { setChipField(null); return; }
    setChipSaving(true);
    try {
      const body: Record<string, unknown> = { [key]: key === 'phone' ? normalisePhone(val) : val };
      let r: { ok: boolean; error?: string } | undefined;
      if (slice === 'leads') r = await updateLead(createdId, body as UpdateLeadRequest);
      else if (slice === 'clients') r = await updateClient(createdId, body as UpdateClientRequest);
      else if (slice === 'invoices') r = await updateInvoice(createdId, body as UpdateInvoiceRequest);
      else if (slice === 'expenses') r = await updateExpense(createdId, body as UpdateExpenseRequest);
      else r = await updateEvent(createdId, body as UpdateEventRequest);
      if (!r?.ok) { onToast(r?.error ?? 'Could not save that.', 'error'); return; }
      invalidateSlice(slice);
      setChipField(null);
    } catch { onToast('Network error. Try again.', 'error'); }
    finally { setChipSaving(false); }
  }

  function finishDraft() {
    const n = missingKeys.length;
    onToast(n === 0 ? 'Filed.' : n === 1 ? 'Filed — 1 detail pending' : `Filed — ${n} details pending`, 'success');
    onClose();
  }

  function goToChat() {
    onClose();
    router.push(`/wedding?aiPrimer=${encodeURIComponent(ADD_PRIMERS[slice])}`);
  }

  const gateFields = isEdit || showAll ? schema.fields : schema.fields.filter(f => ESSENTIAL[slice].includes(f.key));
  const requiredMet = gateFields.filter(f => f.required || ESSENTIAL[slice].includes(f.key)).every(f => values[f.key]?.trim());

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={() => { if (!submitting) onClose(); }}
          style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'var(--atelier-overlay)' }}
        />
      )}

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: D.card,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderTop: `1px solid ${D.border}`,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1)',
        maxHeight: '88dvh', display: 'flex', flexDirection: 'column',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'var(--atelier-ink-dim)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '6px 24px 12px', borderBottom: `1px solid ${D.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.cream, letterSpacing: '0.01em' }}>
            {isEdit ? schema.editTitle : schema.title}
          </h2>
          {!isEdit && (
            <button type="button" onClick={goToChat} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.gold, letterSpacing: '0.15em', textTransform: 'uppercase', flexShrink: 0 }}>
              Talk to DreamAi →
            </button>
          )}
        </div>

        {/* Fields */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* TDW_04 A4 draft-first: create shows the essential field(s); "All
              details ↓" reveals the rest; edit unchanged. In the chips phase
              only the tapped chip's field renders. */}
          {schema.fields
            .filter(f => {
              if (phase === 'chips') return f.key === chipField;
              if (isEdit || showAll) return true;
              return ESSENTIAL[slice].includes(f.key);
            })
            .map((f, idx) => (
            <div key={f.key}>
              <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 9, color: errors[f.key] ? D.red : D.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
                {f.label}{f.required && <span style={{ color: D.gold }}> *</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  value={values[f.key] ?? ''}
                  onChange={e => set(f.key, e.target.value)}
                  rows={3}
                  style={inputStyle(!!errors[f.key])}
                />
              ) : f.type === 'select' ? (
                <select
                  value={values[f.key] ?? ''}
                  onChange={e => set(f.key, e.target.value)}
                  style={{ ...inputStyle(!!errors[f.key]), appearance: 'none', WebkitAppearance: 'none' }}
                >
                  <option value="">Select…</option>
                  {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input
                  type={f.type === 'currency' ? 'number' : f.type === 'phone' ? 'tel' : f.type}
                  inputMode={f.type === 'currency' ? 'numeric' : undefined}
                  placeholder={f.type === 'currency' ? 'Rs' : f.placeholder}
                  value={values[f.key] ?? ''}
                  onChange={e => set(f.key, e.target.value)}
                  style={inputStyle(!!errors[f.key])}
                />
              )}
              {errors[f.key] && (
                <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 11, color: D.red, marginTop: 4 }}>{errors[f.key]}</p>
              )}
            </div>
          ))}

          {/* TDW_04 B6-S2 (item 6(b)): the Block offer. A vendor typing "block"
              into an event title is reaching for the block machinery through the
              wrong door — teach the right one, never coerce (F-04.37's class).
              Offered only in CREATE mode with a date to block. Copy on the
              veto-on-sight list. */}
          {!isEdit && phase === 'form' && slice === 'events'
            && /\bblock/i.test(values.title ?? '') && (values.event_date ?? '').trim() !== '' && (
            <button type="button" onClick={() => {
              const d = values.event_date.trim();
              onClose();
              if (onBlockInstead) onBlockInstead(d);
              else router.push(`/vendor/calendar?block=${d}`);
            }} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
              fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.gold,
              letterSpacing: '0.22em', textTransform: 'uppercase', textAlign: 'left',
            }}>Block this day instead →</button>
          )}

          {/* TDW_04 A4: "All details ↓" — the expander for control-minded vendors */}
          {!isEdit && phase === 'form' && (
            <button type="button" onClick={() => setShowAll(v => !v)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
              fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted,
              letterSpacing: '0.22em', textTransform: 'uppercase', textAlign: 'left',
            }}>{showAll ? 'Fewer details ↑' : 'All details ↓'}</button>
          )}

          {/* TDW_04 A4: the chips phase — filed; the gaps offered, never demanded */}
          {phase === 'chips' && (
            <div style={{ borderTop: `0.5px solid ${D.border}`, paddingTop: 14 }}>
              <div style={{ fontFamily: F.display, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: D.muted, marginBottom: 10 }}>
                Filed. Anything else while it&rsquo;s open?
              </div>
              {missingKeys.length > 0 && !chipField && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {missingKeys.map(k => {
                    const f = schema.fields.find(x => x.key === k)!;
                    return (
                      <button key={k} type="button" onClick={() => setChipField(k)} style={{
                        padding: '7px 12px', borderRadius: 999, cursor: 'pointer',
                        border: `0.5px solid ${D.border}`, background: 'transparent',
                        fontFamily: F.label, fontWeight: 300, fontSize: 9,
                        letterSpacing: '0.18em', textTransform: 'uppercase', color: D.gold,
                      }}>+ {f.label}</button>
                    );
                  })}
                </div>
              )}
              {chipField && (
                <button type="button" disabled={chipSaving} onClick={() => { void saveChip(chipField); }} style={{
                  marginTop: 8, padding: '9px 16px', borderRadius: 999, cursor: chipSaving ? 'default' : 'pointer',
                  border: 'none', background: D.gold, opacity: chipSaving ? 0.6 : 1,
                  fontFamily: F.label, fontWeight: 400, fontSize: 9, color: '#111',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                }}>{chipSaving ? 'Saving…' : 'Save detail'}</button>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={{ padding: '12px 24px 16px', borderTop: `1px solid ${D.border}` }}>
          <button
            type="button"
            onClick={phase === 'chips' ? finishDraft : submit}
            disabled={phase === 'chips' ? false : (submitting || !requiredMet)}
            style={{
              width: '100%', padding: '14px 0',
              backgroundColor: phase === 'chips' ? D.gold : submitting || !requiredMet ? 'var(--atelier-input-border)' : D.gold,
              border: 'none', borderRadius: 999, cursor: phase === 'chips' ? 'pointer' : submitting || !requiredMet ? 'default' : 'pointer',
              fontFamily: F.label, fontWeight: 400, fontSize: 10,
              color: '#111111', letterSpacing: '0.3em', textTransform: 'uppercase',
              transition: 'background-color 200ms',
            }}
          >
            {phase === 'chips' ? 'Done' : submitting ? 'Working…' : isEdit ? 'Save changes' : schema.submit}
          </button>
        </div>
      </div>
    </>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
    backgroundColor: 'var(--atelier-input-bg)',
    border: `0.5px solid ${hasError ? 'rgba(224,112,112,0.6)' : 'rgba(226,222,216,0.15)'}`,
    borderRadius: 10,
    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
    fontWeight: 300, fontSize: 14, color: 'var(--atelier-ink)',
    outline: 'none',
    colorScheme: 'dark',
  };
}
