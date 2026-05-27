'use client';
// hooks/useJustDoIt.ts
// Persists Just Do It toggle in localStorage.
// Default true — tools fire inline without ActionCard.

import { useEffect, useState } from 'react';
import { getJustDoIt, setJustDoIt } from '@/lib/vendor/session';

export function useJustDoIt(): [boolean, (next: boolean) => void] {
  const [value, setValue] = useState(true);

  useEffect(() => {
    setValue(getJustDoIt());
  }, []);

  function update(next: boolean) {
    setValue(next);
    setJustDoIt(next);
  }

  return [value, update];
}
