'use client';
// components/partner/Mark.tsx · CE-47 · PTN-A1 app r4 · THE PARTNER MARK (the founder's words, 7 Oct 2026: "Verified" /
// "Unverified"). The words come from the server (check_words), which sends them only while 'partners.check_label' is on.
// NULL, EMPTY OR MISSING: NOTHING IS DRAWN, not an empty tag (the chair, 7 Oct 2026). A tap on the mark opens what it means
// and what it does not, in two lines; a second tap closes them. A 44px target.
import { useState } from 'react';
import { W } from '@/lib/partner/words';

export function Mark({ words }: { words: string | null | undefined }) {
  const [open, setOpen] = useState(false);
  if (typeof words !== 'string' || !words.trim()) return null;
  return (
    <div data-partner-mark="">
      <button type="button" className="px-tag" aria-expanded={open} onClick={() => setOpen((o) => !o)} data-mark-tap=""
        style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, margin: 0, padding: 0, border: 0, background: 'none', cursor: 'pointer', textAlign: 'left' }}>
        {words}
      </button>
      {open ? (
        <div className="px-card" data-mark-means="">
          <p className="sol-rowdesc">{W.markMeans}</p>
          <p className="sol-rowdesc">{W.markNot}</p>
        </div>
      ) : null}
    </div>
  );
}
