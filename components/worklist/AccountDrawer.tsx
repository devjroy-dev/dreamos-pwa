"use client";
// components/worklist/AccountDrawer.tsx — THE DRAWER. ONE DEFINITION, TWO MOUNTS.
//
// ══ WHY THIS FILE EXISTS ════════════════════════════════════════════════════
//
// Founder, on his second walk: 「why is setting not uniform across all in the avatar? is it
// so hard to check?」 — and the answer is that it was never a checking problem. It was two
// definitions.
//
// `/w/*` rendered the shell's drawer, written to R-38.6's register. The fourteen carried
// rooms render `app/vendor/layout.tsx` → `Header.tsx`, which hardcoded a SECOND drawer with
// its own rows, its own destinations, its own glyphs and subtitles, and its own register.
// Two menus behind one medallion in one app. This seat reported that as 「the interim's
// declared cost」 twice. **A vendor does not experience a declaration; he experiences two
// different menus.** The report was accurate and it was not a cure.
//
// AND IT WAS SHIPPING THREE RETIRED OR BANNED BYTES on those fourteen surfaces:
//   「DreamAi on WhatsApp」   — a persona name in chrome, banned by R-37.70/.78/.83
//   「Tips & Features」        — pointing at /vendor/more, which R-38.1 forbids
//   「The Dream Wedding」      — retired from the drawer at CE-38 relay #3 ITEM 3
// Every ruling that landed on the shell's drawer simply missed the other one, because the
// other one was somewhere nobody was looking.
//
// ══ WHY THIS IS ONE HOME AND NOT A THIRD ═══════════════════════════════════
//
// I argued against this once — that making the old drawer match would give the drawer's
// rows a second home. **That reasoning was wrong and it is worth writing down why.** It
// would be true of COPYING the rows into `Header.tsx`. It is the opposite of true here:
// two definitions collapse into one, and both mounts import it. The row set, the
// destinations, the section names and the order now exist exactly once, and a ruling that
// lands on this file lands on every surface in the estate at the same moment.
//
// ══ THE TOKENS TRAVEL WITH IT ══════════════════════════════════════════════
//
// The shell's type rungs are emitted onto `.wl` by `typeCss`, and this drawer also renders
// OUTSIDE `.wl` — inside the old vendor layout, where no rung variable exists. So it emits
// `typeCss` onto its OWN root class. That is why `typeCss` takes a selector: one home for
// the scale, any number of scopes. The colour tokens need no such help — `--atelier-*` and
// `--role-*` are defined in both trees already.
//
// ══ THE CARRIED MOUNT IS A DOOR INTO THE SHELL ═════════════════════════════
//
// Settings and Billing point at `/w/settings` and `/w/billing`, not at the `/vendor` routes
// they used to. So a vendor who opens the coin in a carried room lands in the NEW chrome,
// and the drawer stops being a way to stay in the old one.
import Link from 'next/link';
import { COPY } from '@/lib/worklist/copy';
import { waNumberFor } from '@/lib/waNumbers';
import { typeCss } from '@/lib/worklist/theme';

export const DRAWER_SCOPE = 'tdw-drawer';

function Row({ label, href, onClick, current, danger, mode, onGo }: {
  label: string; href?: string; onClick?: () => void;
  current?: boolean; danger?: boolean; mode?: boolean; onGo?: () => void;
}) {
  const cls = 'wl-drow' + (danger ? ' danger' : '') + (mode ? ' mode' : '');
  if (href) {
    return (
      <Link href={href} role="menuitem" className={cls} onClick={onGo}>
        <span className="wl-dlabel">{label}</span>
      </Link>
    );
  }
  return (
    <button type="button" role="menuitem" className={cls}
            aria-current={current ? 'true' : undefined} onClick={onClick}>
      <span className="wl-dlabel">{label}</span>
    </button>
  );
}

/**
 * The four sections, in order. CE-38 relay #3 ITEM 3, arm (b).
 *
 * `mode` and `onPickMode` are optional: the carried rooms drive their own theme through the
 * old ThemeContext and pass their own pair, while the shell drives `data-wl-mode`. The ROWS
 * are the same either way — what differs is only which authority the tap reaches, and that
 * is the caller's business rather than this file's.
 */
export function AccountDrawer({ mode, onPickMode, onSignOut, onClose }: {
  mode: 'dark' | 'light';
  onPickMode: (m: 'dark' | 'light') => void;
  onSignOut: () => void;
  onClose: () => void;
}) {
  return (
    <div className={DRAWER_SCOPE} role="menu">
      <style>{typeCss('.' + DRAWER_SCOPE) + DRAWER_CSS}</style>
      <div className="wl-dsec">{COPY.drawerAccount}</div>
      <Row label={COPY.settingsTitle} href="/w/settings" onGo={onClose} />
      <Row label={COPY.billingTitle} href="/w/billing" onGo={onClose} />
      <div className="wl-dsec">{COPY.drawerReachUs}</div>
      <Row label={COPY.roomsAskTitle} onClick={() => {
        onClose();
        window.open(`https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('Hi')}`, '_blank', 'noopener');
      }} />
      <div className="wl-dsec">{COPY.drawerDisplay}</div>
      <Row label={COPY.themeDarkName}  onClick={() => onPickMode('dark')}  current={mode === 'dark'} mode />
      <Row label={COPY.themeLightName} onClick={() => onPickMode('light')} current={mode === 'light'} mode />
      <div className="wl-dsec">{COPY.drawerActions}</div>
      <Row label={COPY.drawerSignOut} danger onClick={onSignOut} />
    </div>
  );
}

// ⚠ NO BACKTICKS BELOW THIS LINE, EVER. Everything after it is inside a JS template literal,
// so a backtick — including one written around a CSS selector while explaining that
// selector — ends the literal and fails the compile. This sitting paid for that four times
// in four files. Selectors in these comments are written in words, not in code marks.
//
// F-38.15: the separator sits on the SECTION EYEBROW, where the grouping actually changes,
// and never inside the Display pair — those two rows are one control in two states, and a
// hairline between them says two things about a radio pair.
// F-38.14: the press fill is measured, not asserted. 1.511:1 on Graphite, 1.251:1 on Chalk.
// F-38.16: the destructive row carries clearance from the label above it.
const DRAWER_CSS = `
.tdw-drawer{background:var(--atelier-sheet-bg);border:.5px solid var(--atelier-sheet-border);border-radius:3px;overflow:hidden;min-width:248px}
.tdw-drawer .wl-dsec{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);padding:14px 16px 10px}
.tdw-drawer .wl-dsec:not(:first-of-type){border-top:.5px solid var(--atelier-card-border)}
.tdw-drawer .wl-drow{display:flex;align-items:center;width:100%;min-height:52px;padding:8px 16px;background:none;border:none;cursor:pointer;text-align:left;text-decoration:none;touch-action:manipulation}
.tdw-drawer .wl-drow + .wl-drow{border-top:.5px solid var(--atelier-card-border)}
.tdw-drawer .wl-drow.mode + .wl-drow.mode{border-top:none}
.tdw-drawer .wl-drow.danger{margin-top:6px}
.tdw-drawer .wl-dlabel{font:var(--wl-t3);color:var(--atelier-ink)}
.tdw-drawer .wl-drow[aria-current="true"] .wl-dlabel{color:var(--atelier-accent-text)}
.tdw-drawer .wl-drow.danger .wl-dlabel{color:var(--role-critical)}
.tdw-drawer .wl-drow:active{background:var(--atelier-row-hover)}
.tdw-drawer .wl-drow:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
`;
