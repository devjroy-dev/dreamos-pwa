// hooks/useVendorTheme.ts
// LOCKED — DreamAi is always dark. No theme switching.
// This file is kept as a stub to avoid import errors during transition.
// TODO: remove all imports of this file once Header.tsx is cleaned up.

export type VendorTheme = 'dark';
export const THEME_TOKENS = {};
export function useVendorTheme(): ['dark', () => void] {
  return ['dark', () => {}];
}
