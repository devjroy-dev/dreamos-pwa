'use client';

// app/(vendor)/vendor/money/page.tsx
// MONEY — invoices + expenses. Two tabs.
//
// Data:
//   GET /api/v2/vendor/invoices/:vendorId?state=…
//   GET /api/v2/vendor/expenses/:vendorId
// Types: VendorInvoicesResponse, VendorExpensesResponse

import { useEffect, useState, useCallback } from 'react';
import { fetchVendorInvoices, fetchVendorExpenses } from '../../../../lib/frost-api/vendor';
import type {
  VendorInvoicesResponse, VendorExpensesResponse, InvoiceState,
} from '../../../../lib/types/vendor';
import { ApiClientError } from '../../../../lib/types/common';
import {
  COLORS, FONTS, RADIUS, BORDER_THIN,
  fmtINR, fmtDate,
} from '../../../../components/frost-vendor/tokens';
import {
  Card, Shimmer, EmptyState, StateBadge, PageError, PageHeader, useVendorIdGuard,
} from '../../../../components/frost-vendor/atoms';

type Tab = 'invoices' | 'expenses';
type InvoiceFilter = InvoiceState | 'all';

const INV_FILTERS: { label: string; value: InvoiceFilter }[] = [
  { label: 'Open',          value: 'all'          },
  { label: 'Unpaid',        value: 'unpaid'       },
  { label: 'Advance paid',  value: 'advance_paid' },
  { label: 'Paid',          value: 'paid'         },
];

export default function VendorMoneyPage() {
  const vendorId = useVendorIdGuard();
  const [tab, setTab] = useState<Tab>('invoices');
  const [invFilter, setInvFilter] = useState<InvoiceFilter>('all');

  const [invoices, setInvoices] = useState<VendorInvoicesResponse | null>(null);
  const [expenses, setExpenses] = useState<VendorExpensesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true); setError(null);
    try {
      if (tab === 'invoices') {
        const r = await fetchVendorInvoices(vendorId, { state: invFilter });
        setInvoices(r);
      } else {
        const r = await fetchVendorExpenses(vendorId);
        setExpenses(r);
      }
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, [vendorId, tab, invFilter]);

  useEffect(() => { load(); }, [load]);

  if (!vendorId) return null;

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader eyebrow="Books" title="Money" />

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 0, padding: '0 20px',
        borderBottom: BORDER_THIN, marginBottom: 16,
      }}>
        {(['invoices', 'expenses'] as Tab[]).map(t => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                padding: '12px 0', position: 'relative',
                fontFamily: FONTS.jost, fontSize: 10, fontWeight: 300,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: active ? COLORS.dark : COLORS.muted,
              }}
            >
              {t === 'invoices' ? 'Invoices' : 'Expenses'}
              {active && (
                <span style={{
                  position: 'absolute', bottom: -1, left: 0, right: 0, height: 2,
                  background: COLORS.gold,
                }} />
              )}
            </button>
          );
        })}
      </div>

      {tab === 'invoices' && (
        <>
          {/* Summary */}
          {invoices && (
            <div style={{ padding: '0 20px 16px' }}>
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{
                      fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.2em',
                      textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6,
                    }}>Outstanding</div>
                    <div style={{ fontFamily: FONTS.cg300, fontSize: 28, color: COLORS.dark, lineHeight: 1 }}>
                      {fmtINR(invoices.summary.total_outstanding)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.2em',
                      textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6,
                    }}>Collected</div>
                    <div style={{ fontFamily: FONTS.cg300, fontSize: 20, color: COLORS.success, lineHeight: 1 }}>
                      {fmtINR(invoices.summary.total_collected)}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Filter */}
          <div style={{
            display: 'flex', gap: 6, padding: '0 20px 12px',
            overflowX: 'auto', WebkitOverflowScrolling: 'touch',
          }}>
            {INV_FILTERS.map(f => {
              const active = invFilter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setInvFilter(f.value)}
                  style={{
                    fontFamily: FONTS.jost, fontSize: 10, fontWeight: 300,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    padding: '7px 14px', borderRadius: RADIUS.pill,
                    background: active ? COLORS.dark : 'transparent',
                    color:      active ? COLORS.bg : COLORS.muted,
                    border: active ? 'none' : BORDER_THIN,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >{f.label}</button>
              );
            })}
          </div>

          {/* List */}
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading && !invoices && (<><Shimmer height={90} /><Shimmer height={90} /></>)}
            {error && <PageError message={error} onRetry={load} />}
            {invoices && invoices.invoices.length === 0 && (
              <EmptyState title="No invoices in this view." />
            )}
            {invoices && invoices.invoices.map(inv => (
              <Card key={inv.id} style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <StateBadge state={inv.state} />
                      <span style={{
                        fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.15em',
                        textTransform: 'uppercase', color: COLORS.muted,
                      }}>{inv.invoice_number}</span>
                    </div>
                    <div style={{ fontFamily: FONTS.cg300, fontSize: 16, color: COLORS.dark }}>{inv.client_name}</div>
                    <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
                      Due {inv.due_date ? fmtDate(inv.due_date) : '—'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: FONTS.cg300, fontSize: 18, color: COLORS.dark }}>{fmtINR(inv.amount_total)}</div>
                    {inv.amount_owed > 0 ? (
                      <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.danger, marginTop: 2 }}>
                        {fmtINR(inv.amount_owed)} owed
                      </div>
                    ) : (
                      <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.success, marginTop: 2 }}>
                        Settled
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {tab === 'expenses' && (
        <>
          {expenses && (
            <div style={{ padding: '0 20px 16px' }}>
              <Card>
                <div style={{
                  fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6,
                }}>Spent recently</div>
                <div style={{ fontFamily: FONTS.cg300, fontSize: 28, color: COLORS.dark, lineHeight: 1 }}>
                  {fmtINR(expenses.total_spent)}
                </div>
                <div style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted, marginTop: 4 }}>
                  {expenses.total} {expenses.total === 1 ? 'entry' : 'entries'}
                </div>
              </Card>
            </div>
          )}

          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading && !expenses && (<><Shimmer height={70} /><Shimmer height={70} /></>)}
            {error && <PageError message={error} onRetry={load} />}
            {expenses && expenses.expenses.length === 0 && (
              <EmptyState title="No expenses logged." hint="Track costs as you go." />
            )}
            {expenses && expenses.expenses.map(ex => (
              <Card key={ex.id} style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {ex.category && (
                      <div style={{
                        fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.15em',
                        textTransform: 'uppercase', color: COLORS.muted, marginBottom: 4,
                      }}>{ex.category}</div>
                    )}
                    <div style={{ fontFamily: FONTS.cg300, fontSize: 15, color: COLORS.dark }}>
                      {ex.description || 'Untitled expense'}
                    </div>
                    <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
                      {ex.expense_date ? fmtDate(ex.expense_date) : ''}
                      {ex.client_name ? ' · ' + ex.client_name : ''}
                    </div>
                  </div>
                  <div style={{ fontFamily: FONTS.cg300, fontSize: 18, color: COLORS.dark }}>
                    {fmtINR(ex.amount)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
