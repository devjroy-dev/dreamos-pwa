'use client';
// components/solutions/IgPackageCards.tsx · CE-47 · CLB PART C · HER PACKAGES AS CARDS IN HER INSTAGRAM MESSAGES.
// The room "WhatsApp and Instagram" gains one section, drawn after "Instagram messages". It reads its own door
// (lib/vendor/igPackageCardsDoor.ts) and renders NOTHING when the door is absent or its body is wrong: until the feature
// is open to her (Meta's grant, or clb.testers before it) the server answers 404, and the room is as before.
//
// THE CONTROL INVENTORY:
//   on, full, failed, no_packages   Turn off (C13) -> POST { on:false }
//   off                             Turn on (C6)   -> POST { on:true }
//   failed                          also Try again -> GET again (the server puts "See packages" in place again)
//   no_packages                     also Add a package -> her packages room
//   not_connected                   none: the Instagram section above carries Connect Instagram
// The cards are a PREVIEW of what her client sees after tapping "See packages": nothing in a card is a control.
// No text node is typed here: the labels and the one failure line are lib/worklist/metaRoom.ts's, and each state's
// sentence is the server's.
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getJson, postJson } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { IG, IG_CARDS } from '@/lib/worklist/metaRoom';
import { roomHref } from '@/lib/worklist/rooms';
import { asCardsDoor, switchFor } from '@/lib/vendor/igPackageCardsDoor';
import type { CardsDoor } from '@/lib/vendor/igPackageCardsDoor';

export function IgPackageCards() {
  const [door, setDoor] = useState<CardsDoor | null>(null);
  const [err, setErr] = useState(false);
  const busy = useRef(false);

  const load = useCallback(async () => {
    try { setDoor(asCardsDoor(await getJson<unknown>(API.instagramPackageCards()))); } catch { setDoor(null); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const send = async (on: boolean | null) => {
    if (busy.current) return;
    busy.current = true;
    setErr(false);
    try {
      const next = asCardsDoor(on === null
        ? await getJson<unknown>(API.instagramPackageCards())
        : await postJson<unknown>(API.instagramPackageCards(), { on }));
      if (next) setDoor(next); else setErr(true);
    } catch {
      setErr(true);
    } finally {
      busy.current = false;
    }
  };

  if (!door) return null;
  const sw = switchFor(door.state);
  return (
    <section className="sol-surface" data-meta-room="package-cards" data-state={door.state}>
      <h2 className="sol-heading">{IG_CARDS.heading}</h2>
      <p className="sol-empty">{door.line}</p>
      {door.cards.length > 0 && (
        <ul className="pc-row" aria-label={IG_CARDS.preview} data-pc-cards={door.cards.length}>
          {door.cards.map((c, i) => (
            <li key={i} className="pc-card">
              {c.image_url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img className="pc-pic" src={c.image_url} alt="" loading="lazy" referrerPolicy="no-referrer" />
                : null}
              <div className="pc-body">
                <div className="pc-title">{c.title}</div>
                {c.subtitle && <div className="pc-sub">{c.subtitle}</div>}
              </div>
              {c.button && <div className="pc-btn" aria-hidden="true">{c.button}</div>}
            </li>
          ))}
        </ul>
      )}
      <div className="sol-actions">
        {door.state === 'no_packages' && <Link href={roomHref('packages')} className="sol-btn" data-pc-add="">{IG_CARDS.addPackage}</Link>}
        {door.state === 'failed' && <button type="button" className="sol-btn" onClick={() => { void send(null); }}>{IG_CARDS.retry}</button>}
        {sw === 'turn_off' && <button type="button" className="sol-btn" onClick={() => { void send(false); }}>{IG.turnOff}</button>}
        {sw === 'turn_on' && <button type="button" className="sol-btn" onClick={() => { void send(true); }}>{IG.turnOn}</button>}
      </div>
      {err && <p className="sol-err" role="alert">{IG_CARDS.notSaved}</p>}
      <style>{PC_CSS}</style>
    </section>
  );
}

// The cards as Instagram draws them: the picture on top (1.91 to 1), the name, the price line, then the button under a
// rule. One row that scrolls inside itself, so the page never scrolls sideways. Tokens and rungs only.
// ⚠ NO BACKTICKS BELOW THIS LINE: the CSS is a template literal.
const PC_CSS = `
.pc-row{display:flex;gap:10px;margin:16px 0 0;padding:0 0 6px;list-style:none;overflow-x:auto;scroll-snap-type:x mandatory;max-width:100%}
.pc-card{flex:0 0 220px;scroll-snap-align:start;display:flex;flex-direction:column;border:.5px solid var(--atelier-card-border);border-radius:14px;overflow:hidden;background:var(--atelier-card-bg)}
.pc-pic{display:block;width:100%;aspect-ratio:1.91/1;object-fit:cover;background:var(--atelier-row-hover)}
.pc-body{padding:10px 12px;flex:1 1 auto}
.pc-title{font:var(--wl-t4);font-weight:600;color:var(--atelier-ink);overflow-wrap:anywhere}
.pc-sub{font:var(--wl-t5);color:var(--atelier-ink-soft);margin:4px 0 0}
.pc-btn{border-top:.5px solid var(--atelier-card-border);padding:10px 12px;text-align:center;font:var(--wl-t4);color:var(--atelier-accent-text)}
`;
