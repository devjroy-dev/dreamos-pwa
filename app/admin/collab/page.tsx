'use client';
import { useEffect, useState } from 'react';
import { API_BASE } from '../../../lib/api';
import { adminHeaders, API_BASE as _AB } from '@/lib/admin-api/_base';
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home


const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Jost:wght@200;300;400&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`;

type Post = { id: string; vendor_id: string; post_type: string; title: string; description: string; budget: number; city: string; status: string; is_flagged: boolean; created_at: string; vendors: { name: string } | null; };
type Filter = 'all' | 'open' | 'flagged' | 'closed';

export default function AdminCollabPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/v2/admin/collab`, { headers: adminHeaders() });
      const d = await r.json();
      setPosts(d.posts || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleFlag = async (id: string) => {
    await fetch(`${API_BASE}/api/v2/admin/collab/${id}/flag`, { method: 'PATCH', headers: adminHeaders() });
    setPosts(ps => ps.map(p => p.id === id ? { ...p, is_flagged: !p.is_flagged } : p));
    showToast('Flag updated.');
  };

  const close = async (id: string) => {
    if (!confirm('Close this collab post?')) return;
    await fetch(`${API_BASE}/api/v2/admin/collab/${id}/close`, { method: 'PATCH', headers: adminHeaders() });
    setPosts(ps => ps.map(p => p.id === id ? { ...p, status: 'closed' } : p));
    showToast('Post closed.');
  };

  const filtered = posts.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'flagged') return p.is_flagged;
    return p.status === filter;
  });

  const statusPill = (s: string) => {
    // ⊘-2, R-40.129 ① — the tinted ground dies. This was [ink, GROUND] pairs: a green
    // ink on a mint fill, a metal ink on a cream fill. A role is an ink and an edge and
    // never a fill, so the pill is transparent with the role on its edge and its label.
    //
    // A TUPLE IS WHY THIS ONE NEEDED A HAND. The rider's re-token reads the CSS property
    // before each literal to decide ground from ink; inside an array literal there is no
    // property to read, so it mapped the second slot as if it were an ink and produced
    // ink-on-ink. Caught by the survivors sweep, not by the pass — recorded because the
    // same shape (a colour pair in a data structure) exists in other rooms this seat has
    // not opened yet, and (iv) and (v) must look for it rather than trust the property
    // reader.
    const map: Record<string, string> = {
      open: 'var(--role-positive)',
      closed: 'var(--atelier-ink-mute)',
      filled: 'var(--role-metal)',
    };
    const color = map[s] || 'var(--atelier-ink-mute)';
    const bg = 'transparent';
    return <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color, background: bg, border: `0.5px solid ${color}`, padding: '3px 8px', borderRadius: 20 }}>{s}</span>;
  };

  return (
    <>
      <style>{fonts}</style>
      {toast && <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--atelier-sheet-bg)', color: 'var(--atelier-page-bg)', fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 13, padding: '10px 20px', borderRadius: 4, zIndex: 9999 }}>{toast}</div>}

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 9, color: 'var(--atelier-ink-soft)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 6 }}>Collab Hub</div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 28, color: 'var(--atelier-ink)' }}>Moderation</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['all', 'open', 'flagged', 'closed'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ border: `0.5px solid ${filter === f ? 'var(--role-metal)' : 'var(--atelier-card-border)'}`, background: filter === f ? 'var(--atelier-row-hover)' : 'transparent', color: filter === f ? 'var(--role-metal)' : 'var(--atelier-ink-soft)', fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20, cursor: 'pointer' }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3].map(i => <div key={i} style={{ height: 52, background: 'var(--atelier-card-bg)', borderRadius: 4, border: '1px solid transparent', backgroundImage: 'linear-gradient(90deg, var(--atelier-page-bg) 25%, var(--atelier-section-bg) 50%, var(--atelier-page-bg) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 13, color: 'var(--atelier-ink-soft)' }}>When Makers start collaborating, it will appear here.</div>
      ) : (
        <div style={{ background: 'var(--atelier-card-bg)', border: '1px solid transparent', borderRadius: 6, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ background: 'var(--atelier-page-bg)' }}>
                {['Maker', 'Type', 'Title', 'Budget', 'City', 'Status', 'Posted', 'Actions'].map(col => (
                  <th key={col} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 8, color: 'var(--atelier-ink-soft)', letterSpacing: '0.22em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <>
                  <tr key={p.id} style={{ borderTop: '1px solid var(--atelier-card-border)', background: p.is_flagged ? 'var(--atelier-row-hover)' : 'transparent', borderLeft: p.is_flagged ? '2px solid var(--role-critical)' : '2px solid transparent' }}>
                    <td style={{ padding: '11px 14px', fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: 13, color: 'var(--atelier-ink)' }}>{p.vendors?.name || '—'}</td>
                    <td style={{ padding: '11px 14px', fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 12, color: 'var(--atelier-ink-soft)', textTransform: 'capitalize' }}>{p.post_type || '—'}</td>
                    <td style={{ padding: '11px 14px', fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 12, color: 'var(--atelier-ink)', maxWidth: 160 }}>
                      <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} style={{ background: 'none', border: 'none', textAlign: 'left', fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 12, color: 'var(--atelier-ink)', cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: 3 }}>{p.title || '—'}</button>
                    </td>
                    <td style={{ padding: '11px 14px', fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 12, color: 'var(--atelier-ink-soft)' }}>{p.budget ? formatRs(p.budget) : '—'}</td>
                    <td style={{ padding: '11px 14px', fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 12, color: 'var(--atelier-ink-soft)' }}>{p.city || '—'}</td>
                    <td style={{ padding: '11px 14px' }}>{statusPill(p.status)}</td>
                    <td style={{ padding: '11px 14px', fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 11, color: 'var(--atelier-ink-soft)', whiteSpace: 'nowrap' }}>{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <button onClick={() => toggleFlag(p.id)} style={{ background: 'none', border: 'none', fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.is_flagged ? 'var(--role-critical)' : 'var(--atelier-ink-soft)', cursor: 'pointer' }}>{p.is_flagged ? 'Unflag' : 'Flag'}</button>
                        {p.status !== 'closed' && (
                          <button onClick={() => close(p.id)} style={{ background: 'none', border: 'none', fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--atelier-ink-soft)', cursor: 'pointer' }}>Close</button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === p.id && (
                    <tr style={{ borderTop: '1px solid var(--atelier-card-border)', background: 'var(--atelier-card-bg)' }}>
                      <td colSpan={8} style={{ padding: '12px 14px 16px', fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 12, color: 'var(--atelier-ink-soft)', lineHeight: 1.6 }}>
                        {p.description || 'No description provided.'}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
