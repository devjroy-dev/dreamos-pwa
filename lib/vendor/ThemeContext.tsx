'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DARK, LIGHT, FLAIR, type ThemeTokens } from './theme';

const ThemeCtx = createContext<ThemeTokens>(DARK);
const KEY = 'dreamai_theme';

// Apply CSS custom properties directly to <html> so they cascade into every component.
function applyCSSVars(t: ThemeTokens) {
  const r = document.documentElement.style;

  // Base theme vars — flip with theme
  r.setProperty('--atelier-ink',          t.ink);
  r.setProperty('--atelier-ink-soft',     t.inkSoft);
  r.setProperty('--atelier-ink-mute',     t.inkMute);
  r.setProperty('--atelier-ink-dim',      t.inkDim);
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
  // Set body bg directly — prevents one-frame dark flash on swipe
  const __bg = t.isLight ? '#F5F2EE' : (t.pageBg === '#090d17' ? '#090d17' : '');
  document.documentElement.style.background = __bg;
  document.body.style.background = __bg;
}



export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<ThemeTokens>(DARK);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light' | 'flair'>('dark');

  function applyTheme(theme: 'dark' | 'light' | 'flair') {
    const t = theme === 'flair' ? FLAIR : theme === 'light' ? LIGHT : DARK;
    setTokens(t);
    setCurrentTheme(theme);
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.classList.toggle('theme-flair', theme === 'flair');
    // Apply base vars first
    applyCSSVars(t);
  }

  useEffect(() => {
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
  }, []);

  // Watch for class changes on <html>:
  // 1. theme-light toggle (from user preference)
  // 2. room-discover toggle (from swipe/navigation) — re-apply correct vars
  useEffect(() => {
    const obs = new MutationObserver(() => {
      const html = document.documentElement;
      const isLight = html.classList.contains('theme-light');
      const isFlair = html.classList.contains('theme-flair');
      const t = isFlair ? FLAIR : isLight ? LIGHT : DARK;
      setTokens(t);
      setCurrentTheme(isFlair ? 'flair' : isLight ? 'light' : 'dark');
      applyCSSVars(t);
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => obs.disconnect();
  }, []);

  return <ThemeCtx.Provider value={tokens}>{children}</ThemeCtx.Provider>;
}

// useT() returns current theme tokens.
export function useT(): ThemeTokens {
  return useContext(ThemeCtx);
}
