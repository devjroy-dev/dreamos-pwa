'use client';
// hooks/useHotDates.ts
// Persists hot date marker visibility.
// Default ON — vendors see Vivah Muhurat markers by default.

import { useEffect, useState } from 'react';
import { getHotDatesVisible, setHotDatesVisible } from '@/lib/vendor/session';

export function useHotDates(): [boolean, (next: boolean) => void] {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(getHotDatesVisible());
  }, []);

  function toggle(next: boolean) {
    setVisible(next);
    setHotDatesVisible(next);
  }

  return [visible, toggle];
}
