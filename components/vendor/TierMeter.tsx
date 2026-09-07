'use client';
// TierMeter — TDW_02 P5. One hairline of truth above the input bar: the tier's
// turn meter. House law: quiet until it matters — invisible-feeling at 'ok',
// the count and one gold fill only; the Upgrade word appears at 'nearing';
// the line warms at 'capped'. Max ONE gold element. No modal, no toast, ever.
import React from 'react';

export interface TierMeta {
  tier: string;
  turns_used: number;
  turns_cap: number;
  state: 'ok' | 'nearing' | 'capped';
  upgrade?: { label: string; href: string };
}

export function TierMeter({ meta }: { meta: TierMeta | null }) {
  if (!meta || !meta.turns_cap) return null;
  const pct = Math.min(100, Math.round((meta.turns_used / meta.turns_cap) * 100));
  const capped = meta.state === 'capped';
  const nearing = meta.state === 'nearing';
  return (
    <div className="px-4 pb-1 select-none" aria-label={`Tier usage ${meta.turns_used} of ${meta.turns_cap}`}>
      <div className="flex items-center gap-2">
        <div className="relative h-px flex-1 overflow-visible" style={{ background: 'var(--atelier-card-border)' }}>
          <div
            className="absolute left-0 -top-px h-[3px] rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: capped ? 'var(--role-critical)' : 'var(--role-metal)' }}
          />
        </div>
        <span
          className="font-[Jost] text-[11px] tracking-wide tabular-nums"
          style={{ color: capped ? 'var(--role-critical)' : 'var(--atelier-ink-mute)' }}
        >
          {meta.turns_used}/{meta.turns_cap}
        </span>
        {(nearing || capped) && meta.upgrade && (
          <a
            href={meta.upgrade.href}
            className="font-[Jost] text-[11px] tracking-wide underline underline-offset-2"
            style={{ color: 'var(--atelier-ink-dim)' }}
          >
            {meta.upgrade.label}
          </a>
        )}
      </div>
    </div>
  );
}
