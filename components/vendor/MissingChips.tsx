'use client';
import { RUNG_FONT as RUNG } from '@/lib/worklist/theme'; // CE-45 FE-2 TYPE_2: the app's own type, holding outside the shell (F7)
// components/vendor/MissingChips.tsx — CE-43 · LC-2 · packet 3g · ONE "Still missing" pattern.
//
// The lead detail's wishbone chips (TDW_04 A1), the booking sheet and the attach sheet show what is
// missing the same way: a row of `+ label` chips, each tappable to ITS OWN cell (F-43.108: a tapped
// chip never opens the first missing cell instead). `onPick` is required (R-43.16: a line that says
// something is needed is the way to add it). The look is the lead detail's existing chip, tokens only.
// `heading` shows the existing `Still missing — tap to complete:` line above the chips.
import type { CSSProperties } from 'react';

const chipStyle: CSSProperties = {
  font: RUNG.t4,
  color: 'var(--atelier-ink-mute)',
  border: '0.5px solid var(--atelier-ink-dim)',
  borderRadius: 2,
  padding: '3px 8px',
  background: 'transparent',
  cursor: 'pointer',
};
const headingStyle: CSSProperties = {
  font: RUNG.t3,
  color: 'var(--atelier-ink-mute)',
  marginBottom: 8,
};

export function MissingChips({ cells, onPick, heading = false, testId }: {
  cells: { key: string; label: string }[];
  onPick: (key: string) => void;
  heading?: boolean;
  testId?: string;
}) {
  if (cells.length === 0) return null;
  return (
    <div data-lc2="missing-chips" data-need={testId}>
      {heading && <div style={headingStyle}>Still missing — tap to complete:</div>}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {cells.map((c) => (
          <button key={c.key} type="button" data-cell={c.key} onClick={() => onPick(c.key)} style={chipStyle}>+ {c.label}</button>
        ))}
      </div>
    </div>
  );
}
