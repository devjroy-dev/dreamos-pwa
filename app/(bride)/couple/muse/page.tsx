'use client';

// app/(bride)/couple/muse/page.tsx
// MUSE BOARD — full image grid with ceremony filter. Tap image to delete.
// Data: GET /api/v2/couple/muse/:coupleId?ceremony=…
//       DELETE /api/v2/couple/muse/:saveId

import React, { useEffect, useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { fetchCoupleMuse, deleteMuseSave } from '../../../../lib/frost-api/couple';
import type { CoupleMuseResponse, MuseCeremony, MuseSave } from '../../../../lib/types/bride';
import { ApiClientError } from '../../../../lib/types/common';
import { COLORS, FONTS, RADIUS, BORDER_THIN, EASE } from '../../../../components/frost-bride/tokens';
import { Shimmer, EmptyState, PageError, PageHeader, useCoupleIdGuard } from '../../../../components/frost-bride/atoms';

type Filter = MuseCeremony;

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Haldi',     value: 'haldi'     },
  { label: 'Mehendi',   value: 'mehendi'   },
  { label: 'Sangeet',   value: 'sangeet'   },
  { label: 'Reception', value: 'reception' },
  { label: 'Wedding',   value: 'wedding'   },
];

export default function CoupleMUsePage() {
  const coupleId = useCoupleIdGuard();
  const [filter, setFilter] = useState<Filter>('all');
  const [data, setData] = useState<CoupleMuseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!coupleId) return;
    setLoading(true); setError(null);
    try { setData(await fetchCoupleMuse(coupleId, { ceremony: filter })); }
    catch (e) { setError(e instanceof ApiClientError ? e.message : 'Failed to load.'); }
    finally { setLoading(false); }
  }, [coupleId, filter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (saveId: string) => {
    setDeleting(saveId);
    try {
      await deleteMuseSave(saveId);
      setData(prev => prev ? { ...prev, saves: prev.saves.filter(s => s.id !== saveId), total: prev.total - 1 } : prev);
    } catch {}
    finally { setDeleting(null); setConfirmId(null); }
  };

  if (!coupleId) return null;

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        eyebrow="Inspiration"
        title="Muse"
        subtitle={data ? `${data.total} saved` : undefined}
      />

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, padding: '0 20px 12px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {FILTERS.map(f => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                fontFamily: FONTS.jost, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '7px 14px', borderRadius: RADIUS.pill, border: active ? 'none' : BORDER_THIN,
                background: active ? COLORS.dark : 'transparent',
                color:      active ? COLORS.bg   : COLORS.muted,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >{f.label}</button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ padding: '0 20px' }}>
        {loading && !data && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {[...Array(9)].map((_, i) => <Shimmer key={i} height={120} radius={RADIUS.md} />)}
          </div>
        )}
        {error && <PageError message={error} onRetry={load} />}
        {data && data.saves.length === 0 && (
          <EmptyState title="No saves yet." hint="Heart a look from the feed to build your board." />
        )}
        {data && data.saves.length > 0 && (
          <div style={{ columns: '2 auto', gap: 8 }}>
            {data.saves.map(save => (
              <React.Fragment key={save.id}>
                <MuseTile
                  save={save}
                  isDeleting={deleting === save.id}
                  confirmOpen={confirmId === save.id}
                  onTap={() => setConfirmId(prev => prev === save.id ? null : save.id)}
                  onDelete={() => handleDelete(save.id)}
                  onCancel={() => setConfirmId(null)}
                />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MuseTile({
  save, isDeleting, confirmOpen, onTap, onDelete, onCancel,
}: {
  save: MuseSave;
  isDeleting: boolean;
  confirmOpen: boolean;
  onTap: () => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      style={{
        position: 'relative', marginBottom: 8, borderRadius: RADIUS.md,
        overflow: 'hidden', breakInside: 'avoid',
        background: COLORS.warm, border: BORDER_THIN,
        cursor: 'pointer',
      }}
      onClick={onTap}
    >
      <img
        src={save.image_url}
        alt={save.tags[0] || 'muse'}
        style={{ width: '100%', display: 'block', objectFit: 'cover' }}
        loading="lazy"
        onError={e => { (e.target as HTMLImageElement).src = ''; }}
      />

      {/* Ceremony tag */}
      {save.ceremony && save.ceremony !== 'all' && (
        <div style={{
          position: 'absolute', bottom: 6, left: 6,
          fontFamily: FONTS.jost, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase',
          background: 'rgba(12,10,9,0.55)', color: COLORS.bg,
          padding: '3px 7px', borderRadius: RADIUS.pill, backdropFilter: 'blur(4px)',
        }}>{save.ceremony}</div>
      )}

      {/* Delete confirm overlay */}
      {confirmOpen && (
        <div
          style={{
            position: 'absolute', inset: 0, background: 'rgba(12,10,9,0.7)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 8, padding: 12,
          }}
          onClick={e => e.stopPropagation()}
        >
          <Trash2 size={20} strokeWidth={1.5} color={COLORS.bg} />
          <div style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.bg, textAlign: 'center' }}>Remove from Muse?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onDelete} disabled={isDeleting} style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', background: COLORS.danger, color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: RADIUS.pill, cursor: 'pointer', opacity: isDeleting ? 0.5 : 1 }}>
              {isDeleting ? '…' : 'Remove'}
            </button>
            <button onClick={onCancel} style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.15)', color: COLORS.bg, border: 'none', padding: '6px 12px', borderRadius: RADIUS.pill, cursor: 'pointer' }}>
              Keep
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
