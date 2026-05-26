'use client';

// app/(frost)/frost/canvas/muse/page.tsx
// Muse — Aubade-Nocturne skin. Data logic unchanged.

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { AUBADE, FF, EASE } from '../../../../../lib/frost/tokens';
import { fetchMuseSaves, deleteMuseSave, fetchSaveActivity, uploadMuseImage, createMuseSaveFromUrl } from '../../../../../lib/frost-api/muse';
import type { MuseSave, MuseActivity } from '../../../../../lib/types/discover';

type SourceFilter = 'all' | 'bride' | 'circle_member';
const SOURCE_FILTERS: { label: string; value: SourceFilter }[] = [
  { label: 'All',    value: 'all'           },
  { label: 'Mine',   value: 'bride'         },
  { label: 'Circle', value: 'circle_member' },
];

function FullBleedOverlay({ save, activity, onClose, onRemove }: {
  save: MuseSave; activity: MuseActivity[]; onClose: () => void; onRemove: (id: string) => void;
}) {
  const handleEnquire = () => { if (save.enquire_link) window.open(save.enquire_link, '_blank'); };
  const handleShare = async () => {
    if (!save.enquire_link) return;
    if (navigator.share) {
      try { await navigator.share({ title: `${save.vendor_name || 'Vendor'} — TDW`, url: save.enquire_link }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(save.enquire_link); } catch {}
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: AUBADE.paper, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Image */}
      {save.image_url && (
        <div style={{ width: '100%', aspectRatio: '3/4', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <img src={save.image_url} alt={save.vendor_name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 14px)', left: 18, background: 'rgba(10,9,11,0.55)', border: `1px solid ${AUBADE.line}`, borderRadius: 2, padding: '6px 14px', fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: AUBADE.aubade }}>←</span> Muse
          </button>
          <button onClick={() => onRemove(save.id)} style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 14px)', right: 18, background: 'rgba(10,9,11,0.55)', border: `1px solid rgba(239,100,100,0.22)`, borderRadius: 2, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Trash2 size={14} color="rgba(239,100,100,0.7)" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Details */}
      <div style={{ padding: '24px 22px 48px', flex: 1 }}>
        {save.vendor_name && (
          <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 26, color: AUBADE.ink, marginBottom: 6, letterSpacing: '-0.02em', fontFeatureSettings: '"opsz" 9' }}>{save.vendor_name}</div>
        )}
        {save.vendor_category && (
          <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 20 }}>{save.vendor_category}</div>
        )}
        {(save.aesthetic_tags || []).length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
            {(save.aesthetic_tags || []).map((tag: string) => (
              <span key={tag} style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute, padding: '4px 10px', border: `1px solid ${AUBADE.line}`, borderRadius: 2 }}>{tag}</span>
            ))}
          </div>
        )}

        {activity.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 14 }}>Circle notes</div>
            {activity.map(a => (
              <div key={a.id} style={{ paddingLeft: 12, borderLeft: `2px solid rgba(216,152,84,0.3)`, marginBottom: 14 }}>
                <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: AUBADE.inkSoft, lineHeight: 1.5, fontFeatureSettings: '"opsz" 9' }}>"{a.content}"</div>
                <div style={{ fontFamily: FF.mono, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: AUBADE.inkMute, marginTop: 4 }}>{a.member_name || 'You'}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleEnquire} style={{ flex: 1, padding: '13px 0', background: 'rgba(216,152,84,0.15)', border: `1px solid rgba(216,152,84,0.40)`, borderRadius: 2, fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.aubade, cursor: 'pointer' }}>
            Enquire
          </button>
          <button onClick={handleShare} style={{ flex: 1, padding: '13px 0', background: 'transparent', border: `1px solid ${AUBADE.line}`, borderRadius: 2, fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkSoft, cursor: 'pointer' }}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MusePage() {
  const router = useRouter();
  const [saves,        setSaves]        = useState<MuseSave[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [selected,     setSelected]     = useState<MuseSave | null>(null);
  const [activity,     setActivity]     = useState<MuseActivity[]>([]);
  const [toast,        setToast]        = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  const load = async () => {
    setLoading(true);
    try { const r = await fetchMuseSaves(); setSaves(r.saves || []); }
    catch { setSaves([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleOpen = async (save: MuseSave) => {
    setSelected(save);
    try { const r = await fetchSaveActivity(save.id); setActivity(r.activity || []); }
    catch { setActivity([]); }
  };

  const handleRemove = async (id: string) => {
    setSelected(null);
    try { await deleteMuseSave(id); showToast('Removed from Muse.'); await load(); }
    catch { showToast('Could not remove. Try again.'); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    showToast('Saving…');
    try {
      await uploadMuseImage(file);
      showToast('Added to Muse.');
      await load();
    } catch { showToast('Upload failed. Try again.'); }
    if (fileRef.current) fileRef.current.value = '';
  };

  const filtered = saves.filter(s => sourceFilter === 'all' ? true : s.saved_by_role === sourceFilter);

  return (
    <div style={{ position: 'fixed', inset: 0, background: `linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`, display: 'flex', flexDirection: 'column', userSelect: 'none', WebkitUserSelect: 'none' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top,0px) + 70px)', left: '50%', transform: 'translateX(-50%)', background: AUBADE.ink, color: AUBADE.paper, fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '8px 18px', borderRadius: 2, zIndex: 500, pointerEvents: 'none', whiteSpace: 'nowrap' }}>{toast}</div>
      )}

      {/* Overlay */}
      {selected && (
        <FullBleedOverlay
          save={selected}
          activity={activity}
          onClose={() => setSelected(null)}
          onRemove={handleRemove}
        />
      )}

      {/* Top bar */}
      <div style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 14px)', paddingBottom: 14, paddingLeft: 22, paddingRight: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${AUBADE.line}`, flexShrink: 0, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(10,9,11,0.60)' }}>
        <button onClick={() => router.push('/frost/canvas')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          <span style={{ color: AUBADE.aubade }}>←</span> Sanctuary
        </button>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: AUBADE.ink, fontFeatureSettings: '"opsz" 9' }}>Muse</div>
        <button onClick={() => { try { (window as any).__frostSurpriseMe?.(); } catch {} }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: AUBADE.aubade, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          ✦ Surprise Me
        </button>
      </div>

      {/* Source filter pills */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 22px', flexShrink: 0, borderBottom: `1px solid ${AUBADE.line}` }}>
        {SOURCE_FILTERS.map(f => (
          <button key={f.value} onClick={() => setSourceFilter(f.value)} style={{ padding: '5px 14px', borderRadius: 2, border: `1px solid ${sourceFilter === f.value ? 'rgba(216,152,84,0.55)' : AUBADE.line}`, background: sourceFilter === f.value ? 'rgba(216,152,84,0.12)' : 'transparent', fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: sourceFilter === f.value ? AUBADE.aubade : AUBADE.inkSoft, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
            {f.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute, display: 'flex', alignItems: 'center' }}>
          {filtered.length} saved
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 14px 40px' }}>
        {loading && (
          <div style={{ paddingTop: 80, textAlign: 'center', fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: AUBADE.inkMute }}>Loading…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ paddingTop: 80, textAlign: 'center' }}>
            <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: AUBADE.ink, marginBottom: 12, fontFeatureSettings: '"opsz" 9' }}>Your Muse is empty.</div>
            <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: AUBADE.inkSoft, lineHeight: 1.7, fontFeatureSettings: '"opsz" 9' }}>Double-tap any vendor in Discover to save.<br />Or upload an inspiration below.</div>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ columns: 2, columnGap: 8 }}>
            {filtered.map(save => (
              <div key={save.id} onClick={() => handleOpen(save)} style={{ breakInside: 'avoid', marginBottom: 8, borderRadius: 2, overflow: 'hidden', cursor: 'pointer', position: 'relative', border: `1px solid ${AUBADE.line}` }}>
                {save.image_url ? (
                  <img src={save.image_url} alt={save.vendor_name || ''} style={{ width: '100%', display: 'block', objectFit: 'cover' }} loading="lazy" />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '3/4', background: 'rgba(239,233,221,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: FF.mono, fontSize: 8, color: AUBADE.inkMute }}>No image</span>
                  </div>
                )}
                {save.vendor_name && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 8px', background: 'linear-gradient(transparent, rgba(3,3,5,0.75))', fontFamily: FF.mono, fontSize: 7.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(239,233,221,0.85)' }}>
                    {save.vendor_name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB — add photo */}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
      <button
        onClick={() => fileRef.current?.click()}
        style={{ position: 'fixed', bottom: 'calc(env(safe-area-inset-bottom,0px) + 24px)', right: 22, width: 48, height: 48, borderRadius: 2, background: 'rgba(216,152,84,0.18)', border: `1px solid rgba(216,152,84,0.45)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, WebkitTapHighlightColor: 'transparent' }}
      >
        <span style={{ fontSize: 22, color: AUBADE.aubade, lineHeight: 1 }}>+</span>
      </button>
    </div>
  );
}
