"use client";
// components/worklist/CopyBox.tsx · DESIGN-1 · R-46.17: ANY TEXT GIVEN TO HER TO COPY OR FORWARD SITS IN ITS OWN BOX,
// with a Copy control, and nothing else inside; any explanation sits outside it. One home for that box, so every site
// that hands her a link or a caption draws the same shape (scripts/d1_copy_box_bench.mjs holds each site to it).
// It takes no children on purpose: there is no way to put a sentence inside.
import { useEffect, useRef, useState } from 'react';

export function CopyBox({ text, copyValue, label, copied, onCopied, textClassName }: {
  /** the text she is given, shown whole */
  text: string;
  /** what the clipboard receives when it is the full form of what is shown (an address shown without https://) */
  copyValue?: string;
  label: string;
  copied: string;
  onCopied?: () => void;
  textClassName?: string;
}) {
  const [done, setDone] = useState(false);
  const t = useRef<number | null>(null);
  useEffect(() => () => { if (t.current) window.clearTimeout(t.current); }, []);
  const copy = async () => {
    try { await navigator.clipboard.writeText(copyValue ?? text); } catch { return; /* the text stays selectable in the box */ }
    setDone(true); onCopied?.();
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setDone(false), 1800);
  };
  return (
    <div className="wl-copybox" data-copybox="">
      <style>{COPYBOX_CSS}</style>
      <span className={'wl-copytext' + (textClassName ? ' ' + textClassName : '')} data-copytext="">{text}</span>
      <button type="button" className="wl-copyctl" data-copyctl="" onClick={() => void copy()}>{done ? copied : label}</button>
    </div>
  );
}

const COPYBOX_CSS = `
.wl-copybox{display:flex;align-items:center;gap:8px;padding:8px 8px 8px 12px;border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);margin:0 0 12px}
.wl-copytext{font:var(--wl-tb);flex:1;min-width:0;overflow-wrap:anywhere;user-select:text;color:var(--atelier-ink)}
.wl-copyctl{flex:none;min-height:44px;min-width:64px;padding:0 12px;border-radius:12px;border:1px solid var(--atelier-input-border);background:transparent;color:var(--atelier-accent-text);font:var(--wl-tb);touch-action:manipulation}
.wl-copyctl:active{background:var(--atelier-row-hover)}
.wl-copyctl:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
