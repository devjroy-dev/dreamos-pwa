'use client';
// app/wedding/collab/[post_id]/responses/page.tsx
// Interested vendors for a post the current vendor owns.
// Identity revealed — poster owns the post.

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { getJson, postJson } from '@/lib/vendor/api/_base';

const D = {
  bg:     '#0E0D0B',
  card:   'rgba(255,255,255,0.035)',
  border: '0.5px solid var(--atelier-card-border)',
  gold:   '#C9A84C',
  cream:  'rgba(245,240,232,0.85)',
  muted:  'rgba(245,240,232,0.40)',
};
const CARD: React.CSSProperties = {
  background:           D.card,
  backdropFilter:       'blur(32px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
  boxShadow:            'inset 0 1px 0 rgba(255,255,255,0.05)',
};
const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
};

interface VendorResponse {
  response_id:       string;
  state:             string;
  responded_at:      string;
  contact_shared_at: string | null;
  vendor: {
    id:             string;
    name:           string | null;
    category:       string;
    city:           string;
    open_to_travel: boolean;
    hero_photo:     string | null;
  };
}

export default function CollabResponsesPage() {
  const params  = useParams<{ post_id: string }>();
  const post_id = params?.post_id ?? '';
  const router  = useRouter();

  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/vendor/login'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1, background: D.bg }} aria-busy="true" />;

  return <ResponsesScreen post_id={post_id} vendorName={session.name} />;
}

function ResponsesScreen({ post_id, vendorName }: { post_id: string; vendorName: string | null }) {
  const router = useRouter();
  const [responses,   setResponses]   = useState<VendorResponse[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [connecting,  setConnecting]  = useState<string | null>(null);

  useEffect(() => { fetchResponses(); }, [post_id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchResponses() {
    try {
      const data = await getJson<{ ok: boolean; responses: VendorResponse[] }>(
        `/api/v2/vendor/collab/${post_id}/responses`
      );
      if (data.ok) setResponses(data.responses);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  async function handleConnect(responseId: string) {
    setConnecting(responseId);
    try {
      const data = await postJson<{ ok: boolean }>(
        `/api/v2/vendor/collab/${post_id}/connect/${responseId}`, {}
      );
      if (data.ok) fetchResponses();
    } catch { /* silent */ }
    finally { setConnecting(null); }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: D.bg }}>
      <Header vendorName={vendorName} />

      {/* Page header */}
      <div style={{ padding: '16px 20px 0', borderBottom: D.border }}>
        <button type="button" onClick={() => router.back()} style={{
          background: 'none', border: 'none', color: D.muted, fontSize: 20,
          cursor: 'pointer', padding: '0 0 12px', display: 'block',
        }}>←</button>
        <h1 style={{ fontFamily: F.display, fontWeight: 300, fontStyle: 'italic', fontSize: 26, color: D.cream, marginBottom: 6 }}>
          Interested vendors
        </h1>
        <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: D.muted, lineHeight: 1.6, paddingBottom: 16 }}>
          Their identity is revealed to you because you posted the requirement.
          Tap Connect to share contact details with both of you.
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: F.display, fontStyle: 'italic', fontSize: 18, color: D.muted }}>Loading…</p>
          </div>
        ) : responses.length === 0 ? (
          <div style={{ padding: '60px 16px', textAlign: 'center' }}>
            <p style={{ fontFamily: F.display, fontWeight: 300, fontStyle: 'italic', fontSize: 20, color: D.muted, lineHeight: 1.6 }}>
              No responses yet.
            </p>
          </div>
        ) : responses.map(r => (
          <div key={r.response_id} style={{
            ...CARD, borderRadius: 12,
            border: r.state === 'accepted' ? '0.5px solid var(--atelier-sheet-border)' : D.border,
            padding: '18px',
          }}>
            {/* Vendor info */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
              {r.vendor.hero_photo && (
                <img src={r.vendor.hero_photo} alt={r.vendor.name ?? 'vendor'}
                  style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0,
                    border: '0.5px solid var(--atelier-card-border)' }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: F.display, fontWeight: 300, fontSize: 20, color: D.cream, marginBottom: 3 }}>
                  {r.vendor.name || 'A vendor'}
                </p>
                <p style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.gold, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {r.vendor.category} · {r.vendor.city}
                  {r.vendor.open_to_travel && ' · Travels'}
                </p>
              </div>
            </div>

            {/* Action */}
            {r.state === 'accepted' ? (
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.gold, fontStyle: 'italic' }}>
                ✦ Connected — contact details shared with both of you.
              </p>
            ) : (
              <button type="button" onClick={() => handleConnect(r.response_id)}
                disabled={connecting === r.response_id} style={{
                  width: '100%', padding: '11px 0',
                  background: connecting === r.response_id ? 'rgba(201,168,76,0.4)' : D.gold,
                  border: 'none', borderRadius: 999,
                  fontFamily: F.label, fontWeight: 400, fontSize: 10,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: D.bg, cursor: connecting === r.response_id ? 'default' : 'pointer',
                }}>
                {connecting === r.response_id ? 'Connecting…' : 'Connect'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
