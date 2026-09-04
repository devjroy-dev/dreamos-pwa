// hooks/useTheme.ts
// Single source of truth for theme preference: dark / light. (TDW_09 R-U19 retired a third.)
// Reads/writes localStorage key 'dreamai_theme'.
// Applies the 'theme-light' class to <html> on change. TDW_09 R-U19: 'flair' retired.
// ThemeContext's MutationObserver watches those classes and repaints the
// --atelier-* vars, so this hook only owns the class + persistence.

import { useCallback, useEffect, useState } from 'react';
import { readShellModeCookie } from '@/lib/worklist/mode';

const KEY = 'dreamai_theme';

export type Theme = 'dark' | 'light';

function applyClasses(t: Theme) {
  const html = document.documentElement;
  html.classList.toggle('theme-light', t === 'light');
  html.classList.remove('theme-flair'); // TDW_09 R-U19: the retired class, swept off any live document
}

export function useTheme(): [Theme, () => void, (t: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>('dark');

  // On mount — read persisted preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) as Theme | 'flair' | null; // 'flair' readable for the R-U19 migration only
      // ── TDW_09 R-U19 · THE MIGRATION ─────────────────────────────────────
      // A vendor standing in the retired theme must land somewhere DESIGNED.
      // 'flair' was dark, so 'dark' is the honest neighbour — and the stored
      // value is REWRITTEN here so the fallback fires once rather than on every
      // launch for the rest of that device's life.
      if (stored === 'flair') { try { localStorage.setItem(KEY, 'dark'); } catch {} }
      // F-P72.A (P7.2): the shell's cookie, when it exists, outranks the lane key. Header
      // mounts after the page's data loads, so this effect used to run AFTER the (legacy)
      // layout had set the class from the shell's mode, and undid it. Read-only.
      const initial: Theme = readShellModeCookie() ?? (stored === 'light' ? 'light' : 'dark');
      setThemeState(initial);
      applyClasses(initial);
    } catch { /* localStorage blocked (private mode) — stay dark */ }
  }, []);

  // Pick a theme directly (used by the Display picker).
  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyClasses(next);
    try { localStorage.setItem(KEY, next); } catch { /* silent */ }
  }, []);

  // Cycle dark -> light -> dark (kept for any toggle-style callers). TDW_09 R-U19.
  const toggle = useCallback(() => {
    setThemeState(prev => {
      const order: Theme[] = ['dark', 'light'];
      const next = order[(order.indexOf(prev) + 1) % order.length];
      applyClasses(next);
      try { localStorage.setItem(KEY, next); } catch { /* silent */ }
      return next;
    });
  }, []);

  return [theme, toggle, setTheme];
}
