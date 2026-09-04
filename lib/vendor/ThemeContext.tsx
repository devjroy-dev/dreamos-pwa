'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DARK, LIGHT, type ThemeTokens } from './theme';

import { readShellModeCookie } from '@/lib/worklist/mode';
const ThemeCtx = createContext<ThemeTokens>(DARK);
const KEY = 'dreamai_theme';

// Apply CSS custom properties directly to <html> so they cascade into every component.
// ── F-38.3 (AMENDED, CE-38 S3) · THE PIN ARM RECORDS EVERY DOCUMENT WRITE ───
//
// A pinned provider writes to `<html>` and `<body>` — nodes outside React's tree — so
// nothing unmounts those writes when the provider goes. The Ask sheet closed and the
// document kept its background; the shell then navigated and the ground was still the
// mode the sheet had pinned. An inline style on the document element beats any stamp a
// scoped shell can put on `.wl`, which is why the theme cookie could not have cured this
// on its own.
//
// THE TEARDOWN IS DERIVED, NOT TRANSCRIBED. `written` is filled by the WRITER, so the
// clear-set is whatever was actually set on this pass. A hand-kept list of twenty-five
// property names beside twenty-five `setProperty` calls is two homes for one set, and the
// second home is the one that stops agreeing the day a token is added — the exact disease
// this estate keeps filing. Add a var below and the teardown picks it up for free.
//
// F-38.3's RADIUS IS REDUCED, NOT CLOSED: the pin still writes the document ground. It no
// longer LEAVES it behind. The full cure is F-38.50 — `ChatThread` and `InputBar` moved off
// `useT()` onto CSS variables, after which no `/w` surface needs this provider at all.
// Twenty-five `T.*` reads across two files with the context defaulting to `DARK`, so
// dropping the provider today would render those two silently dark inside Chalk rather
// than loudly wrong. Chartered separately for that reason.
export type PinWrites = { props: string[]; colorScheme: string; htmlBg: string; bodyBg: string; hadLight: boolean };

function applyCSSVars(t: ThemeTokens, pin?: 'dark' | 'light'): string[] {
  const style = document.documentElement.style;
  const written: string[] = [];
  // The facade keeps all twenty-five call sites below byte-identical. They read as they
  // always did; the recording is the only thing that changed.
  const r = { setProperty: (n: string, v: string) => { written.push(n); style.setProperty(n, v); } };

  // Base theme vars — flip with theme
  r.setProperty('--atelier-ink',          t.ink);
  r.setProperty('--atelier-ink-soft',     t.inkSoft);
  r.setProperty('--atelier-ink-mute',     t.inkMute);
  r.setProperty('--atelier-ink-dim',      t.inkDim);
  // TDW_09 F-09.15b: the fade token reaches the var-based component consts
  // (BottomNav's NavTab, the calendar's previous-month cells) which cannot call
  // useT(). Additive — nothing read this name before.
  r.setProperty('--atelier-ink-fade',     t.inkFade);
  // TDW_09 F-09.28 — a role nothing publishes is a role nothing can read.
  r.setProperty('--role-positive',        t.positive);
  r.setProperty('--role-caution',         t.caution);
  r.setProperty('--role-critical',        t.critical);
  r.setProperty('--role-metal',           t.metal);
  r.setProperty('--role-scrim',           t.scrim);
  r.setProperty('--role-sheet',           t.sheet);
  r.setProperty('--atelier-label',        t.label);
  r.setProperty('--atelier-accent-text',  t.accentText);
  r.setProperty('--atelier-header-bg',    t.headerBg);
  r.setProperty('--atelier-sheet-top',    t.sheetTop);
  r.setProperty('--atelier-sheet-bot',    t.sheetBot);
  r.setProperty('--atelier-sheet-border', t.sheetBorder);
  r.setProperty('--atelier-input-bg',     t.inputBg);
  r.setProperty('--atelier-input-border', t.inputBorder);
  r.setProperty('--atelier-card-border',  t.cardBorder);
  r.setProperty('--atelier-row-hover',    t.rowHover);
  // TDW_09 R-S1-AMENDED — `sectionBg` was authored in theme.ts from the start and
  // never published, so every surface that wanted a faint inset panel reached for a
  // hardcoded white tint instead. A role nothing publishes is a role nothing can
  // read (F-09.28's own sentence). Additive: nothing read this name before.
  r.setProperty('--atelier-section-bg',   t.sectionBg);
  r.setProperty('--atelier-overlay-bg',   t.overlay);
  // TDW_08 P3 — the page colour, exposed as a var so a surface can CLAIM it instead of
  // inheriting `--bg-primary` by accident. Additive: nothing read this before.
  r.setProperty('--atelier-page-bg', t.pageBg);
  // TDW_09 MICRO-2 · R-M4(c) — --atelier-bg was READ by two surfaces and PUBLISHED
  // by none, so both took their literal fallback on every frame of every theme.
  // Same owner as --atelier-page-bg; the two names are aliases and move together.
  // DISCLOSED BEHAVIOUR CHANGE, outside this sitting's radius: SwipeRow.tsx wrote
  // var(--atelier-bg, transparent) and has therefore always rendered TRANSPARENT.
  // It now renders the page colour — which is what an opaque swipe row is for, and
  // why R-M4 ruled the declaration rather than the deletion of the read.
  r.setProperty('--atelier-bg', t.pageBg);

  // ── TDW_09 F-09.39 · R-T5 — COLOR-SCHEME IS A ROLE, NOT A CONSTANT ──────────
  // `color-scheme` governs every surface the browser paints and we do not: the
  // <select> option list, the date and time pickers, scrollbars, the caret,
  // autofill. Seventeen surfaces declared it `dark` unconditionally and the root
  // declared nothing, so on Editorial Paper a tapped dropdown opened a dark OS
  // picker over a cream sheet — founder-walk-convicted 2026-08-06.
  //
  // It is this block's own species in a fourth costume: not a hardcoded colour
  // but a hardcoded STATEMENT ABOUT colour, one layer above the paint — which is
  // exactly why an rgba-parsing census could not see it, by construction.
  //
  // On iOS Safari this reaches the native wheel picker, so the defect is worse on
  // a real handset than in device emulation, where only the popup's size misleads.
  document.documentElement.style.colorScheme = t.isLight ? 'light' : 'dark';

  // Set body bg directly — prevents one-frame dark flash on swipe
  //
  // ── TDW_08 P3 · WHY `pin` HAD TO REACH THIS LINE ────────────────────────────
  // The original expression paints a body background for LIGHT and for FLAIR and for
  // NOTHING ELSE: on DARK, `pageBg` is '#1F1612', the '#090d17' test fails, and `__bg`
  // becomes '' — which CLEARS the body background and lets `--bg-primary` (#0B0F1A,
  // globals.css:124, navy) show through. That was invisible in the real app, whose rooms
  // sit on their own surfaces, and invisible to the theme pin, which flipped the TOKENS
  // correctly and never owned the page.
  //
  // The result on the demo lane was warm brass type on a navy page, one tap from a
  // landing that is warm end to end. A pinned tree must own its page colour, or the pin
  // only holds for text.
  const __bg = pin ? t.pageBg
                   : (t.isLight ? '#F5F2EE' : (t.pageBg === '#090d17' ? '#090d17' : ''));
  document.documentElement.style.background = __bg;
  document.body.style.background = __bg;
  return written;
}

/** Undo exactly what `applyCSSVars` + `applyTheme`'s class toggle put on the document. */
function clearPinWrites(w: PinWrites) {
  const style = document.documentElement.style;
  for (const n of w.props) style.removeProperty(n);
  style.colorScheme = w.colorScheme;
  style.background = w.htmlBg;
  document.body.style.background = w.bodyBg;
  // `theme-light` is restored rather than removed. The class is not the pin's to own — the
  // vendor lane sets it too — so a teardown that always removed it would hand a light
  // vendor tree a dark document on the way out of a sheet.
  document.documentElement.classList.toggle('theme-light', w.hadLight);
}



// ── TDW_08 P3 · `pinned` · G-6 · ADDITIVE, EXISTING BEHAVIOUR SACRED ────────────
// Without `pinned` this provider behaves EXACTLY as before: reads the stored
// preference, listens for cross-tab changes, watches <html> for class flips. The real
// vendor app passes nothing and is untouched.
//
// WITH `pinned`, the provider is SEALED to one palette: no localStorage read, no
// storage listener, no preference of any kind. The demo lane passes `pinned="dark"`
// because G-6 forbids storage APIs on any vendor demo path and this provider reached
// one TRANSITIVELY — the demo tree contains no `localStorage` call, so a file-scoped
// census passes over it while a vendor's demo silently renders whatever palette the
// REAL app last stored. A vendor who had never opened the product could be shown one
// theme and a vendor who had could be shown another, on the same URL.
//
// The <html> class observer stays live even when pinned, but re-applies the PINNED
// tokens rather than the class's: the demo tree shares a document with the real app's
// classes, and the pin must win over them or it is not a pin.
export function ThemeProvider({ children, pinned }: { children: ReactNode; pinned?: 'dark' | 'light' }) {
  const initial = pinned === 'light' ? LIGHT : DARK;
  const [tokens, setTokens] = useState<ThemeTokens>(initial);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(pinned ?? 'dark');

  // The pinned path needs the written-property list back out of `applyTheme`, and the
  // unpinned path does not care. One function returning it to both is cheaper than two
  // that can disagree about what a theme application is.
  // ── E-1 · A PINNED PROVIDER NEVER TOUCHES THE DOCUMENT  [CE-39 2c, F-39.32] ──
  // IT READ: `return applyTheme(theme);` — the unpinned path, whole. So a pinned
  // mount toggled `html.theme-light` and wrote twenty-five CSS custom properties
  // onto `documentElement`, then snapshot-and-restored them on unmount.
  //
  // THAT TEARDOWN WAS NOT ENOUGH, and the founder's walk is why: `/w/billing`
  // rendered LIGHT, he visited `/vendor/billing`, and `/w/billing` then rendered
  // DARK — same route, same session, same commit. Two writers of one class on an
  // `<html>` Next never remounts. Restoring on unmount does not help while the
  // pinned tree is MOUNTED, which on a shell route is the whole time.
  //
  // WHAT A PINNED PROVIDER IS FOR, DERIVED RATHER THAN ASSUMED: `ChatThread`
  // (12 reads) and `InputBar` (13 reads) call `useT()`. That is CONTEXT, not
  // document. `setTokens` and `setCurrentTheme` below still run, so those
  // twenty-five reads are byte-identical and F-38.50 stays exactly where it was,
  // chartered separately and untouched by this cure.
  //
  // AND THE SHEET LOSES NOTHING BY THIS. `AiDock` renders `AskSheet` INLINE —
  // no portal — inside `WorklistShell`'s `<div className="wl" data-wl-mode>`
  // (shell :91, dock :134, close :155). Its CSS vars already resolve from the
  // shell's own `scopeCss`; the pin was writing a second copy of them onto
  // `<html>`, where the other lane could read them.
  //
  // The teardown is now a no-op by construction, and THAT is the cell: the
  // pinned arm performs ZERO documentElement mutations across mount and unmount.
  function applyThemePinned(theme: 'dark' | 'light'): string[] {
    const t = theme === 'light' ? LIGHT : DARK;
    setTokens(t);
    setCurrentTheme(theme);
    return [];
  }

  function applyTheme(theme: 'dark' | 'light'): string[] {
    const t = theme === 'light' ? LIGHT : DARK;
    setTokens(t);
    setCurrentTheme(theme);
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.classList.remove('theme-flair'); // TDW_09 R-U19: retired class swept
    // Apply base vars first
    return applyCSSVars(t, pinned);
  }

  useEffect(() => {
    // TDW_08 P3 · G-6 — a PINNED provider never touches storage. The read and the
    // listener are both inside this guard, so a pinned tree has no path to either.
    //
    // ── F-38.3 (AMENDED) · THE PIN ARM NOW HAS A TEARDOWN ────────────────────
    // The document state is snapshotted BEFORE the pin writes, and restored when the
    // pinned tree unmounts. Snapshot-and-restore rather than blanket-remove, because the
    // vendor lane writes the same properties and a pinned sheet is a GUEST on that
    // document: it must hand back what it found, not what it thinks the default is.
    if (pinned) {
      const style = document.documentElement.style;
      const before: PinWrites = {
        props: [],
        colorScheme: style.colorScheme,
        htmlBg: style.background,
        bodyBg: document.body.style.background,
        hadLight: document.documentElement.classList.contains('theme-light'),
      };
      before.props = applyThemePinned(pinned);
      return () => clearPinWrites(before);
    }

    // Read stored preference
    try {
      const stored = localStorage.getItem(KEY) as 'dark' | 'light' | 'flair' | null;
      // TDW_09 R-U19: the retired theme migrates to its honest neighbour and the
      // stored value is rewritten, so this branch fires once per device, not forever.
      if (stored === 'flair') { try { localStorage.setItem(KEY, 'dark'); } catch {} }
      // F-P72.A (P7.2): the shell's cookie, when it exists, outranks the lane key (read-only).
      applyTheme(readShellModeCookie() ?? (stored === 'light' ? 'light' : 'dark'));
    } catch { applyTheme(readShellModeCookie() ?? 'dark'); }

    // Cross-tab sync
    const storageHandler = (e: StorageEvent) => {
      if (e.key === KEY) applyTheme(e.newValue === 'light' ? 'light' : 'dark'); // TDW_09 R-U19
    };
    window.addEventListener('storage', storageHandler);
    return () => window.removeEventListener('storage', storageHandler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinned]);

  // Watch for class changes on <html>:
  // 1. theme-light toggle (from user preference)
  // 2. room-discover toggle (from swipe/navigation) — re-apply correct vars
  useEffect(() => {
    const obs = new MutationObserver(() => {
      const html = document.documentElement;
      const isLight = html.classList.contains('theme-light');

      // TDW_08 P3 · G-6 — THE PIN WINS OVER THE CLASS. The demo tree shares a document
      // with the real app's <html> classes; if a class flip could move a pinned tree the
      // pin would only hold until the first navigation, which is not a pin.
      const theme = pinned ?? (isLight ? 'light' : 'dark');
      const t = theme === 'light' ? LIGHT : DARK;
      setTokens(t);
      setCurrentTheme(theme);
      applyCSSVars(t, pinned);
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => obs.disconnect();
  }, [pinned]);

  return <ThemeCtx.Provider value={tokens}>{children}</ThemeCtx.Provider>;
}

// useT() returns current theme tokens.
export function useT(): ThemeTokens {
  return useContext(ThemeCtx);
}
