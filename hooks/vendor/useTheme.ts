// hooks/useTheme.ts
// Single source of truth for theme preference: dark / light / flair.
// Reads/writes localStorage key 'dreamai_theme'.
// Applies 'theme-light' / 'theme-flair' classes to <html> on change.
// ThemeContext's MutationObserver watches those classes and repaints the
// --atelier-* vars, so this hook only owns the class + persistence.

import { useCallback, useEffect, useState } from 'react';

const KEY = 'dreamai_theme';

export type Theme = 'dark' | 'light' | 'flair';

function applyClasses(t: Theme) {
  const html = document.documentElement;
  html.classList.toggle('theme-light', t === 'light');
  html.classList.toggle('theme-flair', t === 'flair');
}

export function useTheme(): [Theme, () => void, (t: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>('dark');

  // On mount — read persisted preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) as Theme | null;
      const initial: Theme = stored === 'light' ? 'light' : stored === 'flair' ? 'flair' : 'dark';
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

  // Cycle dark → light → flair → dark (kept for any toggle-style callers).
  const toggle = useCallback(() => {
    setThemeState(prev => {
      const order: Theme[] = ['dark', 'light', 'flair'];
      const next = order[(order.indexOf(prev) + 1) % order.length];
      applyClasses(next);
      try { localStorage.setItem(KEY, next); } catch { /* silent */ }
      return next;
    });
  }, []);

  return [theme, toggle, setTheme];
}
