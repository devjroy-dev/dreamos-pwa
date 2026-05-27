'use client';
import { useEffect, useState } from 'react';
import { PageHeader, StatCard, T } from './_components/AdminUI';
import { getVendors, getCouples, getInvites, getPhotoQueue, getDiscoverQueue } from '../../lib/admin-api/index';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ vendors: 0, couples: 0, pending_photos: 0, pending_discover: 0, unused_invites: 0, new_requests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ADMIN_PWD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';
    Promise.all([
      getVendors().catch(() => ({ vendors: [] })),
      getCouples().catch(() => ({ couples: [] })),
      getPhotoQueue({ state: 'pending' }).catch(() => ({ photos: [] })),
      getDiscoverQueue().catch(() => ({ requests: [] })),
      getInvites().catch(() => ({ invites: [] })),
      fetch(`${import.meta?.env?.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app'}/api/v2/admin/waitlist?status=new`,
        { headers: { 'x-admin-password': ADMIN_PWD } }).then(r=>r.json()).catch(()=>({ signups: [] })),
    ]).then(([v, c, p, d, i, w]) => {
      setStats({
        vendors:          (v as any).vendors?.length ?? 0,
        couples:          (c as any).couples?.length ?? 0,
        pending_photos:   (p as any).photos?.length ?? 0,
        pending_discover: (d as any).requests?.filter((r: any) => r.discover_request_state === 'under_review').length ?? 0,
        unused_invites:   (i as any).invites?.filter((x: any) => !x.consumed_at).length ?? 0,
        new_requests:     (w as any).signups?.length ?? 0,
      });
      setLoading(false);
    });
  }, []);

  const timeStr = new Date().toLocaleString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 9, color: T.soft, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: 4 }}>{timeStr}</p>
        <h1 style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontWeight: 300, fontSize: 34, color: T.ink, lineHeight: 1.1 }}>Control Room</h1>
        <div style={{ height: '0.5px', background: `linear-gradient(to right, ${T.gold}44, transparent)`, marginTop: 16 }} />
      </div>
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {[1,2,3,4,5].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 88 }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          <StatCard label="Makers" value={stats.vendors} sub="Total vendors" />
          <StatCard label="Dreamers" value={stats.couples} sub="Total couples" />
          <StatCard label="Photo Queue" value={stats.pending_photos} sub="Pending approval" />
          <StatCard label="Discover Queue" value={stats.pending_discover} sub="Under review" />
          <StatCard label="Open Invites" value={stats.unused_invites} sub="Unconsumed codes" />
          <a href="/admin/invite-requests" style={{textDecoration:'none',display:'contents'}}>
            <StatCard label="New Requests" value={stats.new_requests} sub="Awaiting review" />
          </a>
        </div>
      )}
      <div style={{ marginTop: 36, background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: 20 }}>
        <p style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, color: T.soft, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: 12 }}>Quick Links</p>
        {[['Generate Invites','/admin/invites'],['Upload Muse Pool','/admin/content/muse-pool'],['Upload Surprise Me','/admin/content/surprise-me'],['Approve Photos','/admin/approvals/photos'],['AI Caps','/admin/config']].map(([label,path]) => (
          <a key={path} href={path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `0.5px solid ${T.border}`, textDecoration: 'none', color: T.soft, fontFamily: T.ff.body, fontSize: 14, fontWeight: 300 }}>
            {label}<span style={{ color: T.gold }}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
