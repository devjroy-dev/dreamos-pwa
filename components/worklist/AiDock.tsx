"use client";
// components/worklist/AiDock.tsx — R-37.69's slim dock, above the nav, on every shell surface.
//
// IT IS NOT A THIRD CONTAINER, and R-37.64's own test is why: it does not help you choose
// where to go. It is a work surface. So it takes no nav seat and no room tile, and DreamAi
// stays a verb rather than a destination.
//
// \u26a0 THE CARRIED MOUNT IS NOT HERE, AND THE REASON IS A FINDING, NOT A SHORTCUT.
// ChatThread reads its colours from useT() (ThemeContext) — a React context of hard-coded
// hex from the OLD two-theme pair — not from var(--atelier-*). Mounting it inside this scope
// would render an Espresso-coloured thread inside a Graphite shell: R-37.65's "inherit
// through the existing theme variables" does not reach a component that never reads them.
// Curing that means teaching ThemeProvider to accept an override token set — an addition to
// a shared single home, which is a ruling, not a Phase 1 byte.
//
// So Phase 1 summons the chat door by the SAME interim pattern A-4 already rules for every
// room tile: the destination is real, reachable, and never a 404. The carried mount is bound
// by label to the ThemeContext ruling. Filed in the handover; not absorbed.
import { useRouter } from 'next/navigation';
import { COPY } from '@/lib/worklist/copy';

export function AiDock() {
  const router = useRouter();
  return (
    <>
      <button type="button" className="wl-dock" aria-label={COPY.dockAria}
              onClick={() => router.push('/vendor')}>
        <span className="wl-dockglyph" aria-hidden>&#9670;</span>
        <span className="wl-docktext">DreamAi</span>
      </button>
      <style>{DOCK_CSS}</style>
    </>
  );
}

const DOCK_CSS = `
/* R-37.73 ①: 44 was the floor, met exactly. 50 gives it air. ②: glyph 10 → 12. */
.wl-dock{flex-shrink:0;display:flex;align-items:center;gap:10px;width:100%;background:var(--atelier-section-bg);border:none;border-top:.5px solid var(--atelier-card-border);cursor:pointer;padding:14px 22px;min-height:50px;text-align:left}
.wl-dockglyph{color:var(--role-metal);font-size:12px;line-height:1}
.wl-docktext{font-family:'Jost',sans-serif;font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-accent-text)}
.wl-dock:active{background:var(--atelier-row-hover)}
.wl-dock:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
`;
