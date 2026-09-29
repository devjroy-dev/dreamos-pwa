'use client';
// components/worklist/AdsCard.tsx · CE-46 · ADS-1 · cut 1 · THE POSTS ROOM'S ONE ADS CARD (R-46.13 item 2).
// One sentence for the state (none yet, a step left, one running with today's reach, the last ad's result) and the tap
// into /vendor/posts/ads. Words: lib/worklist/ads.ts (card.*, new, with the chair). The thumbnail is a LABEL, square,
// centred on the picture's middle (R-46.13 item 3); the ad itself is only ever shown whole, on the Ads page.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getJson } from '@/lib/vendor/api/_base';
import { API, ADS_HREF } from '@/v2/lib/solutions/routes';
import { ADS, fill } from '@/v2/lib/worklist/ads';
import type { Door, AdRow } from '@/v2/lib/worklist/adsWire';

const STEP: Record<string, string> = { page: ADS.gaps.pageTap, link: ADS.gaps.linkTap, ad_account: ADS.gaps.accountTap };

export function AdsCard() {
  const router = useRouter();
  const [door, setDoor] = useState<Door | null>(null);
  const [ads, setAds] = useState<AdRow[]>([]);
  useEffect(() => {
    getJson<Door>(API.ads()).then((d) => {
      setDoor(d);
      if (d && d.open && d.connected) getJson<{ ok: boolean; ads?: AdRow[] }>(API.adsList()).then((r) => setAds(r && r.ads ? r.ads : []), () => { /* quiet */ });
    }, () => setDoor(null));
  }, []);
  // R-46.14: the card ALWAYS renders. Shut or unread, it says the section's first line and opens the page (which opens
  // with its real words and a "Coming soon" action); the same card is live when the flag opens, with no new cut.

  let line: string = ADS.card.none;
  const running = ads.find((a) => a.status === 'running');
  const last = ads.find((a) => a.status === 'ended' || a.status === 'paused');
  const g = door && door.gaps && door.gaps.gap;
  if (door && door.connected && g && STEP[g]) line = fill(ADS.card.gap, { step: STEP[g].toLowerCase() });
  else if (running) {
    const d = running.last_insights || []; const today = d.length ? d[d.length - 1].reach : 0;
    const name = running.settings && running.settings.post && running.settings.post.caption_line;
    line = name ? fill(ADS.card.running, { post: name, reach: today.toLocaleString('en-IN') }) : fill(ADS.card.runningNoName, { reach: today.toLocaleString('en-IN') });
  } else if (last) {
    const d = last.last_insights || [];
    line = fill(ADS.card.last, { reach: d.reduce((n, x) => n + x.reach, 0).toLocaleString('en-IN'), enquiries: d.reduce((n, x) => n + x.conversations, 0) });
  }
  const shown = running || last;
  const pic = shown && shown.settings && shown.settings.post ? shown.settings.post.url : null;
  return (
    <>
    <div className="pst-sec pst-secgap">{ADS.card.label}</div>
    <div className="pst-card">
      {pic ? (
        <div className="pst-best" style={{ marginTop: 0, marginBottom: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pst-thumb" src={pic} alt="" style={{ objectFit: 'cover', objectPosition: '50% 50%' }} />
          <div className="pst-who" data-ads-card-line>{line}</div>
        </div>
      ) : <p className="pst-state" style={{ marginBottom: 12 }} data-ads-card-line>{line}</p>}
      <button type="button" className="pst-btn pst-primary" onClick={() => router.push(ADS_HREF)}>{ADS.card.open}</button>
    </div>
    </>
  );
}
