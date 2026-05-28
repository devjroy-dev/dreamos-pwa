'use client';
// /wedding/discover/leads — TDW Returns · Atelier rebuild
// Value proof dashboard — shows only leads from TDW channels (discover source
// or referrer matching vendor handle). All data logic preserved.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { fetchLeads, fetchMe } from '@/lib/vendor/api/vendor';

const A = {
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassLine: 'rgba(201,168,76,0.18)',
  red:       '#E07B5C',
  green:     '#7FBE85',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

type TdwLead = {
  id: string; name: string | null; wedding_city: string | null;
  wedding_date: string | null; budget_total: number | null;
  state: string; source: string | null; referrer: string | null;
  created_at: string;
};

function fmtBudget(n: number | null): string {
  if (!n) return '—';
  if (n >= 100000) return `Rs ${(n / 100000).toFixed(1)}L`;
  return `Rs ${(n / 1000).toFixed(0)}K`;
}
function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }); }
  catch { return iso; }
}
function stateLabel(s: string): { text: string; color: string } {
  switch (s) {
    case 'booked':    return { text: 'Booked',    color: A.brassWarm };
    case 'quoted':    return { text: 'Quoted',    color: '#9DBCC8' };
    case 'contacted': return { text: 'Contacted', color: A.inkMute };
    case 'lost':      return { text: 'Lost',      color: A.red };
    default:          return { text: 'New',       color: A.green };
  }
}

export default function TdwLeadsPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <TdwLeadsScreen vendorId={session.id} vendorName={session.name ?? null} />;
}

function TdwLeadsScreen({ vendorId, vendorName }: { vendorId: string; vendorName: string | null }) {
  const router = useRouter();
  const [leads,   setLeads]   = useState<TdwLead[]>([]);
  const [handle,  setHandle]  = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchLeads(vendorId, 'all'),
      fetchMe(),
    ]).then(([leadsRes, meRes]) => {
      if (leadsRes.ok) setLeads(leadsRes.leads as TdwLead[]);
      if (meRes.ok) setHandle((meRes as { vendor: { handle: string } }).vendor?.handle ?? '');
    }).catch(() => {}).finally(() => setLoading(false));
  }, [vendorId]);

  const tdwLeads = leads.filter(l =>
    l.source === 'discover' ||
    (l.referrer && handle && l.referrer.toLowerCase().includes(handle.toLowerCase()))
  );

  const enquiries  = tdwLeads.length;
  const actioned   = tdwLeads.filter(l => l.state !== 'new').length;
  const saves      = '—';

  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const recent = tdwLeads.filter(l => l.created_at >= cutoff);
  const bookedRecent = recent.filter(l => l.state === 'booked').length;
  const budgets = recent.filter(l => l.budget_total).map(l => l.budget_total!);

  function insightText(): string {
    if (recent.length === 0) return 'No TDW enquiries in the last thirty days yet.';
    const budgetStr = budgets.length > 0
      ? `Most enquiries had budgets around ${fmtBudget(Math.min(...budgets))}–${fmtBudget(Math.max(...budgets))}.`
      : '';
    if (bookedRecent > 0) return `${recent.length} enquir${recent.length === 1 ? 'y' : 'ies'} from TDW in thirty days. ${bookedRecent} booked. ${budgetStr}`;
    return `${recent.length} enquir${recent.length === 1 ? 'y' : 'ies'} from TDW in the last thirty days. ${budgetStr}`;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Header vendorName={vendorName} />

      {/* Breadcrumb */}
      <div style={{
        padding: '12px 22px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '0.5px solid rgba(201,168,76,0.12)',
      }}>
        <button type="button" onClick={() => router.back()}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            color: A.brassWarm, fontFamily: F.display, fontSize: 22, lineHeight: 1,
          }}>‹</button>
        <span style={{
          fontFamily: F.label, fontWeight: 300, fontSize: 9,
          letterSpacing: '0.42em', textTransform: 'uppercase',
          color: A.brass,
        }}>Discover · Leads</span>
      </div>

      {/* Title block */}
      <div style={{ padding: '20px 24px 14px', textAlign: 'center' }}>
        <div style={{
          fontFamily: F.label, fontWeight: 200, fontSize: 9,
          letterSpacing: '0.5em', textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.7)', marginBottom: 10,
        }}>The Returns</div>
        <div style={{
          fontFamily: F.display, fontWeight: 400, fontSize: 32,
          color: 'var(--atelier-ink)', lineHeight: 1.1, letterSpacing: '0.005em',
        }}>Your TDW Returns</div>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
            fontSize: 15, color: A.inkMute,
          }}>Loading…</div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 22px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* ── Stats ledger — 3 cells with ◆ above ── */}
          <div style={{
            display: 'flex', alignItems: 'stretch',
            padding: '26px 8px 22px',
            borderTop: '0.5px solid rgba(201,168,76,0.28)',
            borderBottom: '0.5px solid rgba(201,168,76,0.28)',
            position: 'relative', marginTop: 6,
          }}>
            <div style={{
              position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
              background: 'linear-gradient(180deg, #1F1612 0%, #1F1612 60%, transparent 100%)',
              padding: '0 14px', height: 14, display: 'flex', alignItems: 'center',
              color: A.brass, fontSize: 9, letterSpacing: '0.3em',
            }}>◆</div>
            {[
              { label: 'Saves',     value: saves,     accent: false, color: 'var(--atelier-ink-dim)' },
              { label: 'Enquiries', value: String(enquiries), accent: enquiries > 0, color: enquiries > 0 ? 'var(--atelier-ink)' : 'var(--atelier-ink-dim)', divider: true },
              { label: 'Actioned',  value: String(actioned),  accent: actioned > 0,  color: actioned > 0 ? A.brassWarm : 'var(--atelier-ink-dim)', divider: true },
            ].map(({ label, value, color, divider }) => (
              <div key={label} style={{
                flex: 1, textAlign: 'center', padding: '0 4px', position: 'relative',
              }}>
                {divider && (
                  <span aria-hidden style={{
                    position: 'absolute', left: 0, top: '12%', bottom: '12%',
                    width: '0.5px', background: 'rgba(201,168,76,0.22)',
                  }} />
                )}
                <div style={{
                  fontFamily: F.display, fontWeight: 400, fontSize: 42,
                  lineHeight: 1, color: color, letterSpacing: '-0.01em',
                }}>{value}</div>
                <div style={{
                  fontFamily: F.label, fontWeight: 300, fontSize: 8,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.7)', marginTop: 12,
                }}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── Lead list — calling cards ── */}
          {tdwLeads.length === 0 ? (
            <div style={{
              padding: '32px 24px', textAlign: 'center',
              background: 'linear-gradient(180deg, rgba(245,235,212,0.06) 0%, rgba(245,235,212,0.03) 100%)',
              border: '0.5px solid rgba(201,168,76,0.3)',
              borderRadius: 4,
            }}>
              <div style={{
                fontFamily: F.display, fontWeight: 400, fontSize: 22,
                color: 'var(--atelier-ink)', marginBottom: 10, lineHeight: 1.2,
              }}>No TDW leads yet.</div>
              <div style={{
                fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                fontSize: 14, color: A.inkMute, lineHeight: 1.5,
              }}>
                When brides discover you on The Dream Wedding and enquire,<br />
                they&apos;ll appear here.
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{
                  fontFamily: F.label, fontWeight: 300, fontSize: 9,
                  letterSpacing: '0.42em', textTransform: 'uppercase',
                  color: A.brass,
                }}>Letters</span>
                <span style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.22)' }} />
                <span style={{
                  fontFamily: F.display, fontSize: 18, color: A.brassWarm,
                }}>{tdwLeads.length}</span>
              </div>
              {tdwLeads.map((lead, i) => {
                const st = stateLabel(lead.state);
                return (
                  <div key={lead.id} style={{
                    padding: '14px 4px',
                    display: 'flex', alignItems: 'flex-start', gap: 16,
                    borderBottom: i < tdwLeads.length - 1 ? '0.5px solid rgba(201,168,76,0.12)' : 'none',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: F.script, fontWeight: 500, fontSize: 19,
                        color: A.ink, marginBottom: 3, letterSpacing: '0.005em',
                      }}>{lead.name ?? 'Unknown bride'}</div>
                      <div style={{
                        fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                        fontSize: 13, color: A.inkMute, letterSpacing: '0.005em',
                      }}>
                        {[lead.wedding_city, fmtDate(lead.wedding_date), fmtBudget(lead.budget_total)]
                          .filter(v => v && v !== '—').join(' · ') || '—'}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: F.label, fontWeight: 400, fontSize: 8,
                      color: st.color, letterSpacing: '0.28em', textTransform: 'uppercase',
                      border: `0.5px solid ${st.color}`, borderRadius: 2,
                      padding: '4px 9px', flexShrink: 0,
                    }}>{st.text}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Insight whisper ── */}
          <div style={{
            position: 'relative',
            padding: '16px 18px 14px 22px',
            borderLeft: '0.5px solid rgba(201,168,76,0.4)',
            background: 'linear-gradient(90deg, rgba(201,168,76,0.04) 0%, transparent 100%)',
          }}>
            <div style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 8,
              letterSpacing: '0.42em', textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.7)', marginBottom: 8,
            }}>Last Thirty Days</div>
            <div style={{
              fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
              fontSize: 14, color: 'rgba(240,230,210,0.78)', lineHeight: 1.5,
              letterSpacing: '0.005em',
            }}>{insightText()}</div>
          </div>

        </div>
      )}
    </div>
  );
}
