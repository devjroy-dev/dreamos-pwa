'use client';
// components/frost/FrostedSurface.tsx
// Universal frosted material. White cards are GONE from Frost.
// Every tile, row, button uses this.
// Ported from tdw-2/components/frost/FrostedSurface.tsx

import React from 'react';
import { useFrostMode } from '@/lib/frost/FrostCtx'; // R-36.11: the context left the layout
import { FROST_SURFACE, EASE } from '../../lib/frost/tokens';

type Mode = 'button' | 'composer' | 'panel';

export default function FrostedSurface({
  children, mode: surfaceMode = 'button', onPress,
  radius = 12, style, disabled = false,
}: {
  children: React.ReactNode;
  mode?: Mode;
  onPress?: () => void;
  radius?: number;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  const { look } = useFrostMode();
  const isComposer = surfaceMode === 'composer';
  const mat = isComposer ? FROST_SURFACE.composer : look === 'E1' ? FROST_SURFACE.buttonDark : FROST_SURFACE.button;

  return (
    <div
      onClick={disabled ? undefined : onPress}
      style={{
        ...mat,
        borderRadius: radius,
        cursor: onPress && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.5 : 1,
        transition: `opacity 180ms ${EASE}`,
        ...style,
      }}
    >{children}</div>
  );
}
