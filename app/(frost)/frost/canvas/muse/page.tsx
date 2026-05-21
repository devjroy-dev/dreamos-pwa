'use client';

// app/(frost)/canvas/muse/page.tsx
// Muse canvas — wired to real backend. Zero design changes.

import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import CanvasShell from '../../../../../components/frost/CanvasShell';
import { useFrostMode } from '../../../layout';
import { MUSE_LOOKS, FF, SP, FR } from '../../../../../lib/frost/tokens';
import { fetchMuseSaves, deleteMuseSave, fetchSaveActivity } from '../../../../../lib/frost-api/muse';
import type { MuseSave, MuseActivity } from '../../../../../lib/types/discover';

type MuseCeremony = 'all' | 'haldi' | 'mehendi' | 'sangeet' | 'reception' | 'wedding';
type SourceFilter = 'all' | 'bride' | 'circle_member';

const CEREMONY_FILTERS: { label: string; value: MuseCeremony }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Haldi',     value: 'haldi'     },
  { label: 'Mehendi',   value: 'mehendi'   },
  { label: 'Sangeet',   value: 'sangeet'   },
  { label: 'Reception', value: 'reception' },
  { label: 'Wedding',   value: 'wedding'   },
];

const SOURCE_FILTERS: { label: string; value: SourceFilter }[] = [
  { label: 'All',    value: 'all'           },
  { label: 'Mine',   value: 'bride'         },
  { label: 'Circle', value: 'circle_member' },
];

function FullBleedOverlay({
  save, activity, onClose,
}: {
  save: MuseSave;
  activity: MuseActivity[];
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0C0A09', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        {save.image_url ? (
          <img src={save.image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#1a1714', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: 'rgba(248,247,245,0.2)' }}>No image</span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />

        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 16px)', left: 16, zIndex: 55, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '0.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.9)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {save.vendor_name && (
          <div style={{ position: 'absolute', bottom: 80, left: 20, right: 20 }}>
            <p style={{ fontFamily: FF.display, fontSize: 22, fontWeight: 300, color: '#F8F7F5', margin: 0 }}>{save.vendor_name}</p>
          </div>
        )}
      </div>

      {activity.length > 0 && (
        <div
          onClick={() => setExpanded(e => !e)}
          style={{ background: 'rgba(12,10,9,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '0.5px solid rgba(255,255,255,0.08)', padding: expanded ? '20px 20px calc(env(safe-area-inset-bottom,0px) + 20px)' : '14px 20px calc(env(safe-area-inset-bottom,0px) + 14px)', cursor: 'pointer', transition: 'padding 240ms ease' }}
        >
          {!expanded ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C9A84C' }} />
              <span style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.6)' }}>
                {activity.length} circle interaction{activity.length !== 1 ? 's' : ''} \u00b7 tap to see
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.4)', marginBottom: 4 }}>Circle Activity</span>
              {activity.map(a => (
                <div key={a.id}>
                  <span style={{ fontFamily: FF.body, fontSize: 12, fontWeight: 400, color: 'rgba(248,247,245,0.8)' }}>{a.member_name}</span>
                  <span style={{ fontFamily: FF.body, fontSize: 12, fontWeight: 300, color: 'rgba(248,247,245,0.5)' }}>
                    {a.activity_type === 'comment' && a.content ? `: "${a.content}"` : ` ${a.activity_type.replace(/_/g, ' ')}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activity.length === 0 && (
        <div style={{ height: 'calc(env(safe-area-inset-bottom,0px) + 20px)' }} />
      )}
    </div>
  );
}

export default function CanvasMuse() {
  const { look } = useFrostMode();
  const tokens = MUSE_LOOKS[look];

  const [ceremonyFilter, setCeremonyFilter] = useState<MuseCeremony>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [saves, setSaves] = useState<MuseSave[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [selectedSave, setSelectedSave] = useState<MuseSave | null>(null);
  const [saveActivity, setSaveActivity] = useState<MuseActivity[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchMuseSaves({ saved_by: sourceFilter })
      .then(({ saves: s, total: t }) => { setSaves(s); setTotal(t); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sourceFilter]);

  const filtered = ceremonyFilter === 'all'
    ? saves
    : saves.filter(s => s.aesthetic_tags.includes(ceremonyFilter));

  const handleDelete = async (id: string) => {
    const ok = await deleteMuseSave(id);
    if (ok) setSaves(prev => prev.filter(s => s.id !== id));
    setConfirmId(null);
  };

  const openSave = async (save: MuseSave) => {
    setSelectedSave(save);
    setSaveActivity([]);
    if (save.circle_comment_count > 0) {
      const res = await fetchSaveActivity(save.id);
      if (res) setSaveActivity(res.activity);
    }
  };

  return (
    <>
      {selectedSave && (
        <FullBleedOverlay
          save={selectedSave}
          activity={saveActivity}
          onClose={() => { setSelectedSave(null); setSaveActivity([]); }}
        />
      )}

      <CanvasShell eyebrow="Muse">
        <div style={{ padding: `${SP.xl}px ${SP.xxl}px ${SP.m}px` }}>
          <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 28, color: tokens.ink, marginBottom: 4 }}>Muse</div>
          <div style={{ fontFamily: FF.body, fontSize: 13, color: tokens.soft }}>{loading ? 'Loading\u2026' : `${total} saved`}</div>
        </div>

        <div style={{ display: 'flex', gap: 6, padding: `0 ${SP.xxl}px ${SP.s}px`, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {SOURCE_FILTERS.map(f => {
            const active = sourceFilter === f.value;
            return (
              <button key={f.value} onClick={() => setSourceFilter(f.value)} style={{ fontFamily: FF.label, fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: FR.pill, border: 'none', background: active ? tokens.brass : 'transparent', color: active ? '#1B1612' : tokens.soft, outline: active ? 'none' : `0.5px solid ${tokens.hairline}`, cursor: 'pointer', whiteSpace: 'nowrap' }}>{f.label}</button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 6, padding: `0 ${SP.xxl}px ${SP.m}px`, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {CEREMONY_FILTERS.map(f => {
            const active = ceremonyFilter === f.value;
            return (
              <button key={f.value} onClick={() => setCeremonyFilter(f.value)} style={{ fontFamily: FF.label, fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: FR.pill, border: 'none', background: active ? tokens.brass : 'transparent', color: active ? '#1B1612' : tokens.soft, outline: active ? 'none' : `0.5px solid ${tokens.hairline}`, cursor: 'pointer', whiteSpace: 'nowrap' }}>{f.label}</button>
            );
          })}
        </div>

        <div style={{ padding: `0 ${SP.xxl}px`, columns: '2 auto', columnGap: 8 }}>
          {!loading && filtered.length === 0 && (
            <div style={{ columnSpan: 'all', textAlign: 'center', padding: '48px 0', fontFamily: FF.display, fontStyle: 'italic', fontSize: 18, color: tokens.soft }}>No saves here yet.</div>
          )}
          {filtered.map(save => (
            <div
              key={save.id}
              style={{ position: 'relative', marginBottom: 8, borderRadius: FR.md, overflow: 'hidden', breakInside: 'avoid', cursor: 'pointer', background: tokens.cardFill }}
              onClick={() => { if (confirmId === save.id) return; openSave(save); }}
            >
              {save.image_url ? (
                <img src={save.image_url} alt={save.vendor_name || 'muse'} style={{ width: '100%', display: 'block', objectFit: 'cover' }} loading="lazy" />
              ) : (
                <div style={{ width: '100%', aspectRatio: '3/4', background: tokens.cardFill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 11, color: tokens.soft }}>{save.vendor_name || '\u2014'}</span>
                </div>
              )}

              {save.vendor_name && (
                <div style={{ position: 'absolute', bottom: 6, left: 6, fontFamily: FF.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(12,10,9,0.55)', color: 'rgba(245,240,232,0.9)', padding: '3px 7px', borderRadius: FR.pill, backdropFilter: 'blur(4px)' }}>{save.vendor_name}</div>
              )}

              {save.circle_comment_count > 0 && (
                <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(201,168,76,0.85)', borderRadius: FR.pill, padding: '2px 6px', fontFamily: FF.label, fontSize: 7, color: '#1B1612', letterSpacing: '0.1em' }}>{save.circle_comment_count}</div>
              )}

              {save.saved_by_role === 'circle_member' && (
                <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(12,10,9,0.55)', backdropFilter: 'blur(4px)', borderRadius: FR.pill, padding: '3px 7px', fontFamily: FF.label, fontSize: 7, color: 'rgba(248,247,245,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Circle</div>
              )}

              {confirmId === save.id && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,10,9,0.72)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12 }} onClick={e => e.stopPropagation()}>
                  <Trash2 size={18} strokeWidth={1.5} color="rgba(245,240,232,0.8)" />
                  <div style={{ fontFamily: FF.body, fontSize: 12, color: 'rgba(245,240,232,0.8)', textAlign: 'center' }}>Remove?</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleDelete(save.id)} style={{ fontFamily: FF.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(184,69,62,0.8)', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: FR.pill, cursor: 'pointer' }}>Remove</button>
                    <button onClick={() => setConfirmId(null)} style={{ fontFamily: FF.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.12)', color: 'rgba(245,240,232,0.8)', border: 'none', padding: '5px 10px', borderRadius: FR.pill, cursor: 'pointer' }}>Keep</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CanvasShell>
    </>
  );
}
