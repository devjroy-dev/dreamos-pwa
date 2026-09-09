'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '../../../lib/api';
import { adminHeaders, API_BASE as _AB } from '@/lib/admin-api/_base';
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home


function fmtINR(n: number) { return formatRs(n); } // TDW_09 R-U25
function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000); const h = Math.floor(diff / 3600000);
  if (m < 1) return 'just now'; if (m < 60) return `${m}m ago`; if (h < 24) return `${h}h ago`;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function Shimmer({ h: height, w = '100%', br = 8 }: { h: number; w?: string | number; br?: number }) {
  return <div style={{ height, width: w, borderRadius: br, background: 'linear-gradient(90deg,var(--atelier-section-bg) 25%,var(--atelier-section-bg) 50%,var(--atelier-section-bg) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />;
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: 'var(--atelier-sheet-bg)', color: 'var(--atelier-page-bg)', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 300, padding: '10px 20px', borderRadius: 100, zIndex: 9999, whiteSpace: 'nowrap' }}>{msg}</div>;
}

interface Counter { total: number; today_delta?: number; delta?: number; }
interface Activity { type: string; emoji: string; text: string; at: string; id: string; }
interface Data {
  counters: { dreamers: Counter; makers: Counter; enquiries_today: Counter; muse_saves_today: Counter };
  activity: Activity[];
}

function CounterCard({ label, value, delta }: { label: string; value: number; delta?: number }) {
  return (
    <div style={{ background: 'var(--atelier-card-bg)', border: '1px solid transparent', borderRadius: 14, padding: '20px 20px 18px', flex: 1, minWidth: 0 }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: 'var(--atelier-ink)', margin: '0 0 4px', lineHeight: 1 }}>{value.toLocaleString('en-IN')}</p>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, fontWeight: 200, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--atelier-ink-mute)', margin: '0 0 8px' }}>{label}</p>
      {delta !== undefined && delta !== 0 && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 300, color: delta > 0 ? 'var(--role-positive)' : 'var(--role-critical)', margin: 0 }}>
          {delta > 0 ? '▲' : '▼'} {Math.abs(delta)} vs yesterday
        </p>
      )}
    </div>
  );
}

export default function CommandCentrePage() {
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [backfilling, setBackfilling] = useState(false);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/v3/admin/command-centre`, { headers: adminHeaders() });
      const d = await r.json();
      if (d.success) setData(d);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  async function backfill() {
    setBackfilling(true);
    try {
      const r = await fetch(`${API_BASE}/api/v3/admin/data/backfill-all`, { method: 'POST', headers: adminHeaders() });
      const d = await r.json();
      if (d.success) setToast(`✓ ${d.links_attempted} links backfilled across ${d.couples_processed} Dreamers`);
      else setToast('Backfill failed');
    } catch { setToast('Network error'); } finally { setBackfilling(false); }
  }

  function exportReport() {
    const c = data?.counters;
    if (!c) return;
    const csv = [
      ['Metric', 'Value', 'Delta'],
      ['Total Dreamers', c.dreamers.total, c.dreamers.today_delta || 0],
      ['Total Makers', c.makers.total, 0],
      ['Enquiries Today', c.enquiries_today.total, c.enquiries_today.delta || 0],
      ['Muse Saves Today', c.muse_saves_today.total, c.muse_saves_today.delta || 0],
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `tdw-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setToast('Report exported');
  }

  // R-41.121 — a colour map is the shape the property reader is blind to, so it is
  // found first rather than in a survivors sweep. These are INKS (a dot beside each
  // activity line), not grounds, so each maps to its role and none becomes a fill.
  const activityColor: Record<string, string> = {
    new_dreamer: 'var(--role-caution)', new_maker: 'var(--role-positive)',
    enquiry: 'var(--atelier-ink-soft)', muse_save: 'var(--role-metal)',
    flagged: 'var(--role-critical)',
  };

  return (
    <>
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, color: 'var(--atelier-ink-mute)', letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 4px' }}>Admin</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 32, color: 'var(--atelier-ink)', margin: 0 }}>Command Centre</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 300, color: 'var(--atelier-ink-mute)', margin: 0 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Counters */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
          {[1,2,3,4].map(i => <Shimmer key={i} h={90} br={14} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
          <CounterCard label="Total Dreamers" value={data?.counters.dreamers.total || 0} delta={data?.counters.dreamers.today_delta} />
          <CounterCard label="Total Makers" value={data?.counters.makers.total || 0} />
          <CounterCard label="Enquiries Today" value={data?.counters.enquiries_today.total || 0} delta={data?.counters.enquiries_today.delta} />
          <CounterCard label="Muse Saves Today" value={data?.counters.muse_saves_today.total || 0} delta={data?.counters.muse_saves_today.delta} />
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={backfill} disabled={backfilling} style={{ height: 36, padding: '0 16px', background: 'var(--atelier-sheet-bg)', color: 'var(--atelier-page-bg)', border: 'none', borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', opacity: backfilling ? 0.6 : 1, whiteSpace: 'nowrap' }}>
          {backfilling ? '⟳ Backfilling...' : '⟳ Backfill Entity Links'}
        </button>
        <button onClick={exportReport} style={{ height: 36, padding: '0 16px', background: 'transparent', color: 'var(--atelier-sheet-bg)', border: '1px solid transparent', borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          ↓ Export Today's Report
        </button>
        <button onClick={() => router.push('/admin/images')} style={{ height: 36, padding: '0 16px', background: 'transparent', color: 'var(--role-metal)', border: '1px solid var(--atelier-row-hover)', borderRadius: 8, fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          ⬡ Approve Images
        </button>
      </div>

      {/* Activity Feed */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 200, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--atelier-ink-mute)', margin: 0 }}>Activity — Last 24 Hours</p>
          <button onClick={load} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--role-metal)' }}>Refresh</button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4,5].map(i => <Shimmer key={i} h={44} br={10} />)}
          </div>
        ) : !data?.activity?.length ? (
          <div style={{ background: 'var(--atelier-card-bg)', border: '1px solid transparent', borderRadius: 12, padding: 32, textAlign: 'center' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, fontStyle: 'italic', color: 'var(--atelier-ink-mute)', margin: 0 }}>Quiet so far today.</p>
          </div>
        ) : (
          <div style={{ background: 'var(--atelier-card-bg)', border: '1px solid transparent', borderRadius: 12, overflow: 'hidden' }}>
            {data.activity.map((item, i) => (
              <div key={i} onClick={() => {
                if (item.type === 'new_dreamer') router.push(`/admin/dreamers/${item.id}`);
                else if (item.type === 'new_maker') router.push(`/admin/makers/${item.id}`);
                else if (item.type === 'flagged') router.push('/admin/messages');
              }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < data.activity.length - 1 ? '0.5px solid var(--atelier-card-border)' : 'none', cursor: 'pointer', transition: 'background 150ms' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--atelier-page-bg)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <span style={{ fontSize: 14, flexShrink: 0 }}>{item.emoji}</span>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, color: item.type === 'flagged' ? 'var(--role-critical)' : 'var(--atelier-ink)', margin: 0, flex: 1, lineHeight: 1.4 }}>{item.text}</p>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300, color: 'var(--atelier-ink-fade)', flexShrink: 0 }}>{timeAgo(item.at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
