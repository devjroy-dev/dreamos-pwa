'use client';
import { useEffect, useState } from 'react';
import { PageHeader, StatCard, T } from './_components/AdminUI';
import { getVendors, getCouples, getPhotoQueue, getDiscoverQueue } from '../../lib/admin-api/index';

// ── F-07.90 CURED HERE TOO — SIX TILES THAT LIED ────────────────────────────
// EVERY ARM BELOW READ: `.catch(() => ({ requests: [] }))` and its five
// siblings. A failed call became an empty collection, an empty collection became
// a zero, and a zero became a confident stat tile on the founder's FIRST daily
// screen. 「 DISCOVER QUEUE · 0 · Under review 」 was not zero — it was a 401 the
// page threw away (F-07.91: `requireAuth` standing in front of `requireAdmin`
// on ten admin routes, so the queue was unreachable, not empty).
//
// A dashboard that cannot reach a queue must say so. Nothing here invents a
// number it does not have: a failed arm renders UNKNOWN, never 0. Zero remains
// available and honest — it means the server answered with nothing in the list.
//
// THE DISTINCTION THIS CURE RESTS ON: `0` is an ANSWER. `—` is the absence of
// one. Collapsing the second into the first is what made a broken guard look
// like a quiet Tuesday for as long as it has been broken.
//
// VETO PENDING: UNKNOWN_VALUE / UNKNOWN_SUB are the LE's DRAFT — the only new
// bytes of copy in this delivery.
const UNKNOWN_VALUE = '—';
const UNKNOWN_SUB   = 'Could not load';

// A unique sentinel. `null`/`undefined` would be indistinguishable from a real
// empty payload, which is the exact confusion this cure exists to end.
const FAILED = Symbol('admin-dashboard-arm-failed');
type Arm<T> = T | typeof FAILED;
const failed = (x: unknown): boolean => x === FAILED;

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    vendors: number | null; couples: number | null; pending_photos: number | null;
    pending_discover: number | null;
  }>({ vendors: 0, couples: 0, pending_photos: 0, pending_discover: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all<Arm<any>>([
      getVendors().catch(() => FAILED),
      getCouples().catch(() => FAILED),
      getPhotoQueue({ state: 'pending' }).catch(() => FAILED),
      getDiscoverQueue().catch(() => FAILED),
    ]).then(([v, c, p, d]) => {
      setStats({
        vendors:          failed(v) ? null : ((v as any).vendors?.length ?? 0),
        couples:          failed(c) ? null : ((c as any).couples?.length ?? 0),
        pending_photos:   failed(p) ? null : ((p as any).photos?.length ?? 0),
        pending_discover: failed(d) ? null : ((d as any).requests?.filter((r: any) => r.discover_request_state === 'under_review').length ?? 0),
      });
      setLoading(false);
    });
  }, []);

  const timeStr = new Date().toLocaleString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 10, color: T.soft, letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: 7 }}>{timeStr}</p>
        <h1 style={{ fontFamily: T.ff.body, fontWeight: 700, fontSize: 32, color: T.ink, lineHeight: 1.08, letterSpacing: '-0.02em' }}>Control Room</h1>
        <div style={{ height: '0.5px', background: `linear-gradient(to right, ${T.gold}44, transparent)`, marginTop: 16 }} />
      </div>
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {[1,2,3,4].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 88 }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          <StatCard label="Makers" value={stats.vendors ?? UNKNOWN_VALUE} sub={stats.vendors === null ? UNKNOWN_SUB : "Total vendors"} />
          <StatCard label="Dreamers" value={stats.couples ?? UNKNOWN_VALUE} sub={stats.couples === null ? UNKNOWN_SUB : "Total couples"} />
          <StatCard label="Photo Queue" value={stats.pending_photos ?? UNKNOWN_VALUE} sub={stats.pending_photos === null ? UNKNOWN_SUB : "Pending approval"} />
          <StatCard label="Discover Queue" value={stats.pending_discover ?? UNKNOWN_VALUE} sub={stats.pending_discover === null ? UNKNOWN_SUB : "Under review"} />
        </div>
      )}
      <div style={{ marginTop: 36, background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: 20 }}>
        <p style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 10, color: T.soft, letterSpacing: '0.13em', textTransform: 'uppercase' as const, marginBottom: 12 }}>Quick Links</p>
        {[['Upload Muse Pool','/admin/content/muse-pool'],['Upload Surprise Me','/admin/content/surprise-me'],['Approve Photos','/admin/approvals/photos'],['AI Caps','/admin/config']].map(([label,path]) => (
          <a key={path} href={path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `0.5px solid ${T.border}`, textDecoration: 'none', color: T.soft, fontFamily: T.ff.body, fontSize: 14, fontWeight: 300 }}>
            {label}<span style={{ color: T.gold }}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
