'use client';

// app/(vendor)/vendor/leads/page.tsx
// LEADS — pipeline. State filter pills, list of leads, inline state changer.
//
// Data:    GET   /api/v2/vendor/leads/:vendorId?state=…
// Mutate:  PATCH /api/v2/vendor/leads/:leadId/state
// Types:   VendorLeadsResponse, Lead, LeadState

import { useEffect, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { fetchVendorLeads, patchVendorLeadState } from '../../../../lib/frost-api/vendor';
import type { Lead, LeadState, VendorLeadsResponse } from '../../../../lib/types/vendor';
import { ApiClientError } from '../../../../lib/types/common';
import {
  COLORS, FONTS, RADIUS, BORDER_THIN,
  fmtINRShort, fmtDate, fmtRelative,
} from '../../../../components/frost-vendor/tokens';
import {
  Card, Shimmer, EmptyState, StateBadge, PageError, PageHeader, useVendorIdGuard,
} from '../../../../components/frost-vendor/atoms';

type FilterValue = LeadState | 'all';

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'Active',    value: 'all'       }, // default = active pipeline (handled server-side)
  { label: 'New',       value: 'new'       },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Quoted',    value: 'quoted'    },
  { label: 'Booked',    value: 'booked'    },
  { label: 'Lost',      value: 'lost'      },
];

const ALLOWED_STATES: LeadState[] = ['new', 'contacted', 'quoted', 'booked', 'lost'];

export default function VendorLeadsPage() {
  const vendorId = useVendorIdGuard();
  const [filter, setFilter] = useState<FilterValue>('all');
  const [data, setData] = useState<VendorLeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [patching, setPatching] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true); setError(null);
    try {
      const res = await fetchVendorLeads(vendorId, { state: filter });
      setData(res);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, [vendorId, filter]);

  useEffect(() => { load(); }, [load]);

  if (!vendorId) return null;

  const handlePatch = async (leadId: string, newState: LeadState) => {
    setPatching(leadId);
    try {
      await patchVendorLeadState(leadId, { state: newState });
      // Optimistic local update
      setData(prev => prev ? {
        ...prev,
        leads: prev.leads.map(l => l.id === leadId ? { ...l, state: newState } : l),
      } : prev);
      setExpandedId(null);
    } catch (e) {
      console.error('[patchVendorLeadState]', e);
    } finally {
      setPatching(null);
    }
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        eyebrow="Pipeline"
        title="Leads"
        subtitle={data ? `${data.total} ${data.total === 1 ? 'enquiry' : 'enquiries'} in view` : undefined}
      />

      {/* Filter pills */}
      <div style={{
        display: 'flex', gap: 6, padding: '0 20px 12px',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
      }}>
        {FILTERS.map(f => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                fontFamily: FONTS.jost, fontSize: 10, fontWeight: 300,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '7px 14px', borderRadius: RADIUS.pill,
                background: active ? COLORS.dark : 'transparent',
                color:      active ? COLORS.bg : COLORS.muted,
                border: active ? 'none' : '0.5px solid ' + COLORS.border,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >{f.label}</button>
          );
        })}
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && !data && (
          <>
            <Shimmer height={90} /><Shimmer height={90} /><Shimmer height={90} />
          </>
        )}
        {error && <PageError message={error} onRetry={load} />}
        {data && data.leads.length === 0 && (
          <EmptyState title="No leads here yet." hint="When enquiries arrive, they'll land in this view." />
        )}
        {data && data.leads.map(lead => (
          <React.Fragment key={lead.id}><LeadRow
            lead={lead}
            expanded={expandedId === lead.id}
            patching={patching === lead.id}
            onToggle={() => setExpandedId(prev => prev === lead.id ? null : lead.id)}
            onSetState={(s) => handlePatch(lead.id, s)}
          /></React.Fragment>
        ))}
      </div>
    </div>
  );
}

function LeadRow({
  lead, expanded, patching, onToggle, onSetState,
}: {
  lead: Lead;
  expanded: boolean;
  patching: boolean;
  onToggle: () => void;
  onSetState: (s: LeadState) => void;
}) {
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div onClick={onToggle} style={{ padding: 16, cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <StateBadge state={lead.state} />
              <span style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.muted }}>
                {lead.source || 'whatsapp'}
              </span>
            </div>
            <div style={{ fontFamily: FONTS.cg300, fontSize: 18, color: COLORS.dark, marginBottom: 4 }}>
              {lead.name || 'Unnamed enquiry'}
            </div>
            <div style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted }}>
              {lead.wedding_date ? fmtDate(lead.wedding_date) : 'No date'}
              {lead.wedding_city ? ' · ' + lead.wedding_city : ''}
              {lead.budget_total ? ' · ' + fmtINRShort(lead.budget_total) : ''}
            </div>
          </div>
          <ChevronDown
            size={16} strokeWidth={1.5} color={COLORS.muted}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 200ms ease', marginTop: 4,
            }}
          />
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: BORDER_THIN, padding: 16, background: COLORS.warm }}>
          {lead.raw_message && (
            <div style={{
              fontFamily: FONTS.dm300, fontSize: 13, color: COLORS.dark,
              fontStyle: 'italic', lineHeight: 1.5,
              padding: 12, background: COLORS.card, border: BORDER_THIN,
              borderRadius: RADIUS.sm, marginBottom: 12,
            }}>
              &ldquo;{lead.raw_message}&rdquo;
            </div>
          )}
          {lead.referrer && (
            <div style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted, marginBottom: 12 }}>
              Referred by <span style={{ color: COLORS.dark }}>{lead.referrer}</span>
            </div>
          )}

          <div style={{
            fontFamily: FONTS.jost, fontSize: 9, fontWeight: 300,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: COLORS.muted, marginBottom: 8,
          }}>Move to</div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ALLOWED_STATES.filter(s => s !== lead.state).map(s => (
              <button
                key={s}
                disabled={patching}
                onClick={() => onSetState(s)}
                style={{
                  fontFamily: FONTS.jost, fontSize: 9, fontWeight: 400,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  padding: '6px 12px', borderRadius: RADIUS.pill,
                  background: COLORS.card, color: COLORS.dark,
                  border: BORDER_THIN, cursor: patching ? 'wait' : 'pointer',
                  opacity: patching ? 0.5 : 1,
                }}
              >{s}</button>
            ))}
          </div>

          <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted, marginTop: 12, textAlign: 'right' }}>
            Received {fmtRelative(lead.created_at)}
          </div>
        </div>
      )}
    </Card>
  );
}
