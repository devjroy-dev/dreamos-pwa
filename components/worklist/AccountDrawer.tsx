"use client";
// components/worklist/AccountDrawer.tsx — THE DRAWER. ONE DEFINITION, TWO MOUNTS.
//
// ══ WHY THIS FILE EXISTS ════════════════════════════════════════════════════
//
// Founder, on his second walk: 「why is setting not uniform across all in the avatar? is it
// so hard to check?」 — and the answer is that it was never a checking problem. It was two
// definitions.
//
// the /vendor tree rendered the shell's drawer, written to R-38.6's register. The fourteen carried
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
// Settings and Billing point at `/vendor/settings` and `/vendor/billing`, not at the `/vendor` routes
// they used to. So a vendor who opens the coin in a carried room lands in the NEW chrome,
// and the drawer stops being a way to stay in the old one.
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { COPY } from '@/lib/worklist/copy';
import { waNumberFor } from '@/lib/waNumbers';
import { typeCss } from '@/lib/worklist/theme';
import { useSignOut } from '@/components/worklist/SignOutSheet';

import { useReportIssue } from '@/components/worklist/ReportIssueSheet';
export const DRAWER_SCOPE = 'tdw-drawer';

// ── F-38.20 · THE ACKNOWLEDGEMENT NEEDS A FRAME TO EXIST IN ─────────────────
//
// Founder: 「theres no interaction when i click anything on the setting. like the dimming
// or pushing of a button. it just vanishes into the action that its for. it feels like
// woosh its gone.」
//
// F-38.14 raised the press fill from 1.12:1 to 1.51:1 and it did not help, because the
// contrast was only half the problem and the smaller half. THE STATE WAS NEVER ON SCREEN
// LONG ENOUGH TO BE SEEN. A row's handler fired and closed the drawer in the SAME FRAME:
// `:active` ends at mouse-up, the parent unmounts on the same event, and the vendor's
// acknowledgement had nowhere to happen. Measuring a colour nobody ever sees is measuring
// the wrong thing — which is the fourth time this sitting I have improved an assertion
// about a control instead of the control.
//
// THE CURE IS TIME, NOT COLOUR, AND IT DOES NOT DELAY THE ACTION. The row paints its
// pressed state immediately and holds it; the DISMISSAL is what waits a beat. Navigation
// and mode changes fire exactly as before — a Link still navigates on its own click — so
// nothing gets slower. What changes is that the menu leaves as a visible consequence of the
// tap instead of disappearing simultaneously with it.
const BEAT_MS = 170;

function Row({ label, href, onAct, current, danger, mode, pressed, onPress }: {
  label: string; href?: string; onAct: () => void;
  current?: boolean; danger?: boolean; mode?: boolean;
  pressed: boolean; onPress: () => void;
}) {
  // `held` is a CLASS, not a reliance on the active pseudo-class, because that state ends
  // at pointer release and this one has to outlive the gesture that started it.
  const cls = 'wl-drow' + (danger ? ' danger' : '') + (mode ? ' mode' : '') + (pressed ? ' held' : '');
  const fire = () => { onPress(); onAct(); };
  if (href) {
    // Navigation is the anchor's own, unchanged and unprefixed by any timer: R-38.2's
    // prefetch and its instant route are untouched. Only the drawer's dismissal waits.
    return (
      <Link href={href} role="menuitem" className={cls} onClick={fire}>
        <span className="wl-dlabel">{label}</span>
      </Link>
    );
  }
  return (
    <button type="button" role="menuitem" className={cls}
            aria-current={current ? 'true' : undefined} onClick={fire}>
      <span className="wl-dlabel">{label}</span>
    </button>
  );
}

/**
 * The four sections, in order. CE-38 relay #3 ITEM 3, arm (b).
 *
 * `mode` and `onPickMode` are optional in spirit: the carried rooms drive their theme
 * through the old ThemeContext and pass their own pair, while the shell drives
 * `data-wl-mode`. The ROWS are the same either way — what differs is only which authority
 * the tap reaches, and that is the caller's business rather than this file's.
 */
export function AccountDrawer({ mode, onPickMode, onClose, room }: {
  mode: 'dark' | 'light';
  onPickMode: (m: 'dark' | 'light') => void;
  onClose: () => void;
  /** The masthead's own title. Passed in rather than re-derived here, because the shell already
   *  holds it and a second derivation is a second answer (P7.2, the Report door's prefill). */
  room: string;
}) {
  const [held, setHeld] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  // ── CE-39 S2/6 §3 · THE CONFIRM LEFT THE DRAWER FOR THE ONE SHEET ─────────
  // `confirming` and the two-button row it gated are gone. The row opens the estate's one
  // sign-out sheet (components/worklist/SignOutSheet.tsx) — the same sheet Settings opens —
  // and the verb fires only from inside it. `onSignOut` LEFT THE PROPS with the row that
  // called it: a prop no caller's verb needs is a prop the next reader wires something to
  // (wire-or-delete-at-birth). Both mounts stop passing it in the same edit.
  const { ask, sheet, anchorRef } = useSignOut();
  const { ask: askReport, sheet: reportSheet } = useReportIssue(room);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  // THE ACTION IS IMMEDIATE. THE DISMISSAL IS WHAT WAITS. Every row runs its own effect on
  // the click it was given — a window opened here is opened from the gesture, not from a
  // timer, so no popup blocker sees it — and the menu then spends one beat visibly
  // acknowledging the tap before it leaves. Nothing about the app got slower; the vendor
  // simply stops being shown a result with no cause.
  // `dismiss: false` is for a row that OPENS something OVER the drawer rather than
  // leaving it — the sign-out sheet. It still paints its beat, because the vendor must see
  // that his tap registered; the menu stays where it is beneath the sheet, so a Cancel
  // returns him to exactly the row he pressed.
  function press(id: string, dismiss = true) {
    if (timer.current) return;          // one beat per opening; a second tap changes nothing
    setHeld(id);
    if (!dismiss) return;
    setLeaving(true);
    timer.current = setTimeout(onClose, BEAT_MS);
  }

  const row = (id: string, props: Omit<Parameters<typeof Row>[0], 'pressed' | 'onPress'>) => (
    <Row {...props} pressed={held === id} onPress={() => press(id)} />
  );

  return (
    <div className={DRAWER_SCOPE + (leaving ? ' is-leaving' : '')} role="menu" ref={anchorRef}>
      <style>{typeCss('.' + DRAWER_SCOPE) + DRAWER_CSS}</style>
      <div className="wl-dsec">{COPY.drawerAccount}</div>
      {row('settings', { label: COPY.settingsTitle, href: '/vendor/settings', onAct: () => {} })}
      {row('billing',  { label: COPY.billingTitle,  href: '/vendor/billing',  onAct: () => {} })}
      <div className="wl-dsec">{COPY.drawerReachUs}</div>
      {row('wa', { label: COPY.roomsAskTitle, onAct: () => {
        window.open(`https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('Hi')}`, '_blank', 'noopener');
      } })}
      {/* P7.2 · THE REPORT DOOR (S10). It sits under REACH US beside the WhatsApp row because
          both end in the same place — but this one arrives with the room and the build already
          written, which is the whole difference between a report and a message. The sheet is
          opened the way the sign-out sheet is: a hook that portals into this drawer's own mode
          host, so it inherits Graphite or Chalk from the tree it was opened in. */}
      {/* THE PRESS DOES NOT DISMISS, and that is load-bearing (F-P72.E, founder walk 2026-09-04).
          The sheet's state lives in this component, so a dismissing press unmounts the drawer
          BEAT_MS later and takes the sheet with it: the founder saw the drawer vanish and his
          tap land on the page underneath. The sign-out row has always pressed with
          `dismiss=false` for the same reason (see its Row below); a row that opens a sheet
          must keep its host alive. */}
      <Row label={COPY.reportRowTitle} onAct={askReport}
           pressed={held === 'report'} onPress={() => press('report', false)} />
      <div className="wl-dsec">{COPY.drawerDisplay}</div>
      {row('dark',  { label: COPY.themeDarkName,  onAct: () => onPickMode('dark'),  current: mode === 'dark',  mode: true })}
      {row('light', { label: COPY.themeLightName, onAct: () => onPickMode('light'), current: mode === 'light', mode: true })}
      <div className="wl-dsec">{COPY.drawerActions}</div>
      {/* ── CE-38 SEAL ① · SIGN OUT CONFIRMS — RESHAPED AT CE-39 S2/6 §3 ─────
          CE-38 ruled a two-button row INSIDE the drawer, no modal. It held for one door.
          Settings is the second door, one screen away, and a confirm that lives in this
          drawer's markup cannot be the confirm Settings mounts — so the two doors would
          have had two confirms, or one of them none (D-38.1 clause 3). The confirm is now
          ONE SHEET in one home and both doors open it; the reason CE-38 gave (F-38.16's
          mechanism: the destructive control is never where the thumb was already
          travelling) is kept by the sheet's own layout — Cancel first, Sign out second,
          both at the far end of the viewport from this row. The verb lives in
          SignOutSheet.tsx and nothing in this file calls it. */}
      <Row label={COPY.drawerSignOut} onAct={ask} danger
           pressed={held === 'signout'} onPress={() => press('signout', false)} />
      {sheet}
      {reportSheet}
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
.tdw-drawer .wl-drow:active,.tdw-drawer .wl-drow.held{background:var(--atelier-row-hover)}
/* F-38.20. The held row does not fade back out — it is still lit when the menu leaves, so
   the last thing the vendor sees is the row he chose. The transition is on the way IN only;
   a fade-out here would spend the beat undoing the acknowledgement it exists to give. */
.tdw-drawer .wl-drow{transition:background 90ms linear}
/* The menu enters and leaves as a consequence of the coin and of the row, rather than
   appearing and vanishing between frames. 170ms out matches the beat exactly, so the
   dismissal completes as the fade completes instead of cutting it off. */
.tdw-drawer{animation:tdwDrawerIn 130ms cubic-bezier(0.22,1,0.36,1) both;transform-origin:top right}
.tdw-drawer.is-leaving{animation:tdwDrawerOut 170ms cubic-bezier(0.4,0,1,1) both}
@keyframes tdwDrawerIn{from{opacity:0;transform:translateY(-6px) scale(.985)}to{opacity:1;transform:none}}
@keyframes tdwDrawerOut{from{opacity:1;transform:none}to{opacity:0;transform:translateY(-4px) scale(.99)}}
@media (prefers-reduced-motion:reduce){
  .tdw-drawer,.tdw-drawer.is-leaving{animation:none}
  .tdw-drawer .wl-drow{transition:none}
}
.tdw-drawer .wl-drow:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
`;
