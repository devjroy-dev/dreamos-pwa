// hooks/useTheme.ts
// Single source of truth for light/dark theme preference.
// Reads/writes localStorage key 'dreamai_theme'.
// Applies 'theme-light' class to <html> on change.

import { useCallback, useEffect, useState } from 'react';

const KEY = 'dreamai_theme';

export type Theme = 'dark' | 'light';

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>('dark');

  // On mount — read persisted preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) as Theme | null;
      const initial = stored === 'light' ? 'light' : 'dark';
      setTheme(initial);
      document.documentElement.classList.toggle('theme-light', initial === 'light');
    } catch { /* localStorage blocked (private mode) — stay dark */ }
  }, []);

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('theme-light', next === 'light');
      try { localStorage.setItem(KEY, next); } catch { /* silent */ }
      return next;
    });
  }, []);

  return [theme, toggle];
}
