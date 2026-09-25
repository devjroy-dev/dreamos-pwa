'use client';
// components/solutions/MetaRoomSections.tsx · CE-45 · IGD-1 · CUT 1 · R-45.27.
// The room's second and third parts, drawn inside G6's one shell through OwnNumberFlow's `after` slot (S1, ruled):
// "Instagram messages" (C1 to C9, C13) and the quiet time (QT1, QT2). Each reads its own door and renders NOTHING
// when the door is absent or its body is wrong, so until cut 2a the room is G6's screen under its new name.
//
// THE CONTROL INVENTORY (protocol §10 part 4):
//   Instagram, not_connected   one control: Connect Instagram (C3) -> the consent step
//   Instagram, off             one control: Turn on (C6) -> the consent step
//   consent                    two controls: Turn on (C6) -> POST switch {on:true}, then Instagram's authorize page or the new
//                              state (afterTurnOn); Not now (C6) -> back, nothing sent
//   on, waiting                one control: Turn off (C13) -> POST switch {on:false}
//   paused                     the line IS the control (R-43.16): Instagram's authorize page
//   quiet time                 one select: the four lengths (QT2) -> POST quiet {minutes}
// No text node is typed here: every word is read from lib/worklist/metaRoom.ts. No persona name. No brand mark.
import { useCallback, useEffect, useRef, useState } from 'react';
import { getJson, postJson } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { COPY } from '@/lib/solutions/copy';
import { IG, QUIET, SECTIONS } from '@/lib/worklist/metaRoom';
import { afterTurnOn, asIgDoor, asQuietDoor } from '@/lib/vendor/metaRoomDoor';
import type { IgDoor, QuietDoor } from '@/lib/vendor/metaRoomDoor';

function IgMessagesSection() {
  const [door, setDoor] = useState<IgDoor | null>(null);
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState(false);
  const busy = useRef(false);

  const load = useCallback(async () => {
    try { setDoor(asIgDoor(await getJson<unknown>(API.instagram()))); } catch { setDoor(null); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const flip = async (on: boolean) => {
    if (busy.current) return;
    busy.current = true;
    setErr(false);
    try {
      const next = asIgDoor(await postJson<unknown>(API.instagramSwitch(), { on }));
      if (on) {
        const d = afterTurnOn(next);
        if ('go' in d) { window.location.assign(d.go); return; }
        if ('draw' in d) { setDoor(d.draw); setConsent(false); return; }
        setErr(true);
      } else if (next && next.state === 'off') {
        setDoor(next);
      } else {
        setErr(true);
      }
    } catch {
      setErr(true);
    } finally {
      busy.current = false;
    }
  };

  if (!door) return null;
  const s = door.state;
  return (
    <section className="sol-surface" data-meta-room="instagram" data-state={consent ? 'consent' : s}>
      <h2 className="sol-heading">{SECTIONS.instagram}</h2>
      {consent ? (
        <>
          <p className="sol-empty">{IG.consent}</p>
          <div className="sol-actions">
            <button type="button" className="sol-btn" onClick={() => { void flip(true); }}>{IG.turnOn}</button>
            <button type="button" className="sol-btn" onClick={() => setConsent(false)}>{IG.notNow}</button>
          </div>
        </>
      ) : s === 'not_connected' ? (
        <>
          <p className="sol-empty">{IG.lede}</p>
          <p className="sol-note">{IG.professional}</p>
          <div className="sol-actions">
            <button type="button" className="sol-btn" onClick={() => setConsent(true)}>{IG.connect}</button>
          </div>
        </>
      ) : s === 'off' ? (
        <>
          <p className="sol-empty">{IG.lede}</p>
          <div className="sol-actions">
            <button type="button" className="sol-btn" onClick={() => setConsent(true)}>{IG.turnOn}</button>
          </div>
        </>
      ) : s === 'paused' ? (
        <div className="sol-actions">
          <button type="button" className="sol-btn" disabled={!door.authorize_url}
            onClick={() => { if (door.authorize_url) window.location.assign(door.authorize_url); }}>{IG.paused}</button>
        </div>
      ) : (
        <>
          <p className="sol-empty">{s === 'on' ? IG.on : IG.waiting}</p>
          <div className="sol-actions">
            <button type="button" className="sol-btn" onClick={() => { void flip(false); }}>{IG.turnOff}</button>
          </div>
        </>
      )}
      {err && <p className="sol-err">{COPY.surfaceUnavailable}</p>}
    </section>
  );
}

function QuietTimeRow() {
  const [door, setDoor] = useState<QuietDoor | null>(null);
  const [err, setErr] = useState(false);
  const load = useCallback(async () => {
    try { setDoor(asQuietDoor(await getJson<unknown>(API.quiet()))); } catch { setDoor(null); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  if (!door) return null;
  const pick = async (minutes: number) => {
    setErr(false);
    try {
      const next = asQuietDoor(await postJson<unknown>(API.quiet(), { minutes }));
      if (next) setDoor(next); else setErr(true);
    } catch { setErr(true); }
  };
  return (
    <section className="sol-surface" data-meta-room="quiet" data-minutes={door.minutes}>
      <label className="sol-empty">
        {QUIET.line}{' '}
        <select value={door.minutes} onChange={(e) => { void pick(Number(e.target.value)); }}>
          {QUIET.options.map((o) => <option key={o.minutes} value={o.minutes}>{o.label}</option>)}
        </select>
      </label>
      {err && <p className="sol-err">{COPY.surfaceUnavailable}</p>}
    </section>
  );
}

/** The room's two added parts, in A5's order: Instagram, then the quiet time. */
export function MetaRoomSections() {
  return (
    <>
      <IgMessagesSection />
      <QuietTimeRow />
    </>
  );
}
