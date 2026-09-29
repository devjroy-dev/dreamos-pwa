'use client';
import { RUNG_FONT as RUNG } from '@/lib/worklist/theme'; // CE-45 FE-2 TYPE_2: the app's own type, holding outside the shell (F7)
// components/vendor/NeedFirst.tsx — CE-43 · LC-2 · packet 3f · R-43.16, ONE PATTERN, ONE COMPONENT.
//
// R-43.16 (founder's rule, estate-wide): a refusal is a control and never a redirect. Wherever the
// vendor is told something is needed first (a package, a fee, a wedding date, a handover date, a
// field), the line that says so IS the control that adds it, on every surface, the same way. After
// the fix she is back where she was and acts herself. Nothing opens a different sheet in place of
// the one she asked for.
//
// So every "needs X first" line in the vendor shell renders through this component, and `onFix`
// is REQUIRED: a line with no way to fix it cannot be written. b82 §13 asserts that no such line
// renders without a handler.
//
// The look is the Packages room's dashed fee affordance (`.pkg-fee--unset`, C-43.16): the accent
// ink with a dashed underline. Tokens only (R-42.6). The words are the caller's vetted bytes; this
// component carries none of its own.
import type { CSSProperties } from 'react';

const needFirstStyle: CSSProperties = {
  font: RUNG.t3,
  display: 'inline-block',
  alignSelf: 'flex-start',
  textAlign: 'left',
  background: 'none',
  border: 'none',
  borderBottom: '1px dashed var(--atelier-accent-text)',
  borderRadius: 0,
  padding: '2px 0',
  margin: 0,
  minHeight: 32,
  cursor: 'pointer',
  color: 'var(--atelier-accent-text)',
};

export function NeedFirst({ text, onFix, testId }: {
  /** The vetted line that says what is needed. */
  text: string;
  /** The way to add it. Required, by design. */
  onFix: () => void;
  testId?: string;
}) {
  return (
    <button type="button" role="alert" data-lc2="need-first" data-need={testId} onClick={onFix} style={needFirstStyle}>
      {text}
    </button>
  );
}
