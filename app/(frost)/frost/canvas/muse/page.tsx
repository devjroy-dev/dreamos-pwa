'use client';

// app/(frost)/canvas/muse/page.tsx
// Muse canvas — full-bleed image board with ceremony filter.
// Uses E1/E3 look tokens from MUSE_LOOKS.
// Ported from tdw-2/app/(frost)/canvas/muse.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import CanvasShell from '../../../../../components/frost/CanvasShell';
import { useFrostMode } from '../../../layout';
import { MUSE_LOOKS, FF, SP, FR, FROST_SURFACE, getCoupleIdForFrost } from '../../../../../lib/frost/tokens';

type MuseCeremony = 'all' | 'haldi' | 'mehendi' | 'sangeet' | 'reception' | 'wedding';

interface MuseSave {
  id: string;
  image_url: string;
  tags: string[];
  ceremony: string | null;
}

const FILTERS: { label: string; value: MuseCeremony }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Haldi',     value: 'haldi'     },
  { label: 'Mehendi',   value: 'mehendi'   },
  { label: 'Sangeet',   value: 'sangeet'   },
  { label: 'Reception', value: 'reception' },
  { label: 'Wedding',   value: 'wedding'   },
];

// Mock saves for demo
const MOCK_SAVES: MuseSave[] = [
  { id: 'ms-01', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&auto=format&fit=crop', tags: ['reception', 'lehenga'], ceremony: 'reception' },
  { id: 'ms-02', image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80&auto=format&fit=crop', tags: ['mehendi', 'floral'], ceremony: 'mehendi'  },
  { id: 'ms-03', image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80&auto=format&fit=crop', tags: ['wedding', 'portrait'], ceremony: 'wedding'  },
  { id: 'ms-04', image_url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80&auto=format&fit=crop', tags: ['sangeet', 'blue'], ceremony: 'sangeet'  },
  { id: 'ms-05', image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80&auto=format&fit=crop', tags: ['haldi', 'yellow'], ceremony: 'haldi'    },
  { id: 'ms-06', image_url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&q=80&auto=format&fit=crop', tags: ['wedding', 'jewellery'], ceremony: 'wedding' },
];

export default function CanvasMuse() {
  const { look } = useFrostMode();
  const tokens = MUSE_LOOKS[look];
  const [filter, setFilter] = useState<MuseCeremony>('all');
  const [saves, setSaves] = useState<MuseSave[]>(MOCK_SAVES);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = filter === 'all' ? saves : saves.filter(s => s.ceremony === filter);

  const handleDelete = (id: string) => {
    setSaves(prev => prev.filter(s => s.id !== id));
    setConfirmId(null);
  };

  return (
    <CanvasShell eyebrow="Muse">
      {/* Header */}
      <div style={{ padding: `${SP.xl}px ${SP.xxl}px ${SP.m}px` }}>
        <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 28, color: tokens.ink, marginBottom: 4 }}>
          Muse
        </div>
        <div style={{ fontFamily: FF.body, fontSize: 13, color: tokens.soft }}>
          {saves.length} saved
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, padding: `0 ${SP.xxl}px ${SP.m}px`, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {FILTERS.map(f => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                fontFamily: FF.label, fontSize: 9, fontWeight: 300,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '7px 14px', borderRadius: FR.pill, border: 'none',
                background: active ? tokens.brass : 'transparent',
                color:      active ? '#1B1612'   : tokens.soft,
                outline: active ? 'none' : `0.5px solid ${tokens.hairline}`,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >{f.label}</button>
          );
        })}
      </div>

      {/* Masonry grid */}
      <div style={{ padding: `0 ${SP.xxl}px`, columns: '2 auto', columnGap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ columnSpan: 'all', textAlign: 'center', padding: '48px 0', fontFamily: FF.display, fontStyle: 'italic', fontSize: 18, color: tokens.soft }}>
            No saves in this ceremony yet.
          </div>
        )}
        {filtered.map(save => (
          <div
            key={save.id}
            style={{ position: 'relative', marginBottom: 8, borderRadius: FR.md, overflow: 'hidden', breakInside: 'avoid', cursor: 'pointer', background: tokens.cardFill }}
            onClick={() => setConfirmId(prev => prev === save.id ? null : save.id)}
          >
            <img
              src={save.image_url}
              alt={save.tags[0] || 'muse'}
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
              loading="lazy"
            />
            {save.ceremony && save.ceremony !== 'all' && (
              <div style={{
                position: 'absolute', bottom: 6, left: 6,
                fontFamily: FF.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase',
                background: 'rgba(12,10,9,0.55)', color: 'rgba(245,240,232,0.9)',
                padding: '3px 7px', borderRadius: FR.pill, backdropFilter: 'blur(4px)',
              }}>{save.ceremony}</div>
            )}

            {/* Delete confirm overlay */}
            {confirmId === save.id && (
              <div
                style={{ position: 'absolute', inset: 0, background: 'rgba(12,10,9,0.72)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12 }}
                onClick={e => e.stopPropagation()}
              >
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
  );
}
