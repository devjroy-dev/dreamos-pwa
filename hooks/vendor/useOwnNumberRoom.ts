// hooks/vendor/useOwnNumberRoom.ts · CE-45 · G6-1 · CUT ONE (FE_1).
// Reads the own-number door once and says which screen the room draws.
// Starts DARK (door null -> 'shell'), so the first paint is the shell exactly as
// before and nothing flickers for a vendor whose door is shut or not yet built.
'use client';
import { useCallback, useEffect, useState } from 'react';
import { getJson } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { asDoor, roomMode } from '@/lib/vendor/ownNumberDoor';
import type { OwnNumberDoor, RoomMode } from '@/lib/vendor/ownNumberDoor';
import { flowBytesReady } from '@/lib/worklist/ownNumberFlow';

export type OwnNumberRoom = {
  mode: RoomMode;
  door: OwnNumberDoor | null;
  setDoor: (d: OwnNumberDoor | null) => void;
};

export function useOwnNumberRoom(): OwnNumberRoom {
  const [door, setDoor] = useState<OwnNumberDoor | null>(null);
  const load = useCallback(async () => {
    try {
      setDoor(asDoor(await getJson<unknown>(API.ownNumber())));
    } catch {
      setDoor(null);   // 404 until cut 2a, or any failure: dark
    }
  }, []);
  useEffect(() => { void load(); }, [load]);
  return { mode: roomMode(door, flowBytesReady()), door, setDoor };
}
