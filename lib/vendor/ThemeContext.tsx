'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DARK, LIGHT, FLAIR, type ThemeTokens } from './theme';

const ThemeCtx = createContext<ThemeTokens>(DARK);
const KEY = 'dreamai_theme';

// Apply CSS custom properties directly to <html> so they cascade into every component.
function applyCSSVars(t: ThemeTokens, pin?: 'dark' | 'light' | 'flair') {
  const r = document.documentElement.style;

  // Base theme vars — flip with theme
  r.setProperty('--atelier-ink',          t.ink);
  r.setProperty('--atelier-ink-soft',     t.inkSoft);
  r.setProperty('--atelier-ink-mute',     t.inkMute);
  r.setProperty('--atelier-ink-dim',      t.inkDim);
  // TDW_09 F-09.15b: the fade token reaches the var-based component consts
  // (BottomNav's NavTab, the calendar's previous-month cells) which cannot call
  // useT(). Additive — nothing read this name before.
  r.setProperty('--atelier-ink-fade',     t.inkFade);
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
  r.setProperty('--atelier-overlay-bg',   t.overlay);
  // TDW_08 P3 — the page colour, exposed as a var so a surface can CLAIM it instead of
  // inheriting `--bg-primary` by accident. Additive: nothing read this before.
  r.setProperty('--atelier-page-bg', t.pageBg);

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
export function ThemeProvider({ children, pinned }: { children: ReactNode; pinned?: 'dark' | 'light' | 'flair' }) {
  const initial = pinned === 'flair' ? FLAIR : pinned === 'light' ? LIGHT : DARK;
  const [tokens, setTokens] = useState<ThemeTokens>(initial);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light' | 'flair'>(pinned ?? 'dark');

  function applyTheme(theme: 'dark' | 'light' | 'flair') {
    const t = theme === 'flair' ? FLAIR : theme === 'light' ? LIGHT : DARK;
    setTokens(t);
    setCurrentTheme(theme);
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.classList.toggle('theme-flair', theme === 'flair');
    // Apply base vars first
    applyCSSVars(t, pinned);
  }

  useEffect(() => {
    // TDW_08 P3 · G-6 — a PINNED provider never touches storage. The read and the
    // listener are both inside this guard, so a pinned tree has no path to either.
    if (pinned) { applyTheme(pinned); return; }

    // Read stored preference
    try {
      const stored = localStorage.getItem(KEY) as 'dark' | 'light' | 'flair' | null;
      applyTheme(stored === 'light' ? 'light' : stored === 'flair' ? 'flair' : 'dark');
    } catch { applyTheme('dark'); }

    // Cross-tab sync
    const storageHandler = (e: StorageEvent) => {
      if (e.key === KEY) applyTheme((e.newValue as 'dark' | 'light' | 'flair') ?? 'dark');
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
      const isFlair = html.classList.contains('theme-flair');
      // TDW_08 P3 · G-6 — THE PIN WINS OVER THE CLASS. The demo tree shares a document
      // with the real app's <html> classes; if a class flip could move a pinned tree the
      // pin would only hold until the first navigation, which is not a pin.
      const theme = pinned ?? (isFlair ? 'flair' : isLight ? 'light' : 'dark');
      const t = theme === 'flair' ? FLAIR : theme === 'light' ? LIGHT : DARK;
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
