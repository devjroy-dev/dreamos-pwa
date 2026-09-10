"use client";

import { useState } from 'react';
import { WlToast } from '@/components/worklist/WlToast';
import { useToast } from '@/hooks/vendor/useToast';
import { COPY } from '@/lib/solutions/copy';
import { PO } from '@/lib/worklist/posts';
import { SU, bestPostLine, weekLine, arrow, count } from '@/lib/worklist/sunday';
import type { Brief, Metric, SundayState, SundayActions } from '@/lib/worklist/sunday';
// components/worklist/SundaySection.tsx — 4b-3a · THE SUNDAY SECTION, every state from a brief.
// ITS OWN FILE because a Next.js page module may export only the page (the founder's
// `next build` refused a named export on page.tsx; tsc --noEmit did not see it).
// R-42.14 shell-first: this is the FINISHED chrome. 4b-3b (R-42.14's second
// half) hands `state` and `brief` from the door and `actions` for the controls;
// NOTHING HERE MOVED BUT THE DATA AND THE HANDLERS — the same classes, the same
// bytes, the same order (b76's inventory is the contract). Without `actions`
// (b76's own renders) every CTA still toasts COPY.launchingSoon. With them:
//   Connect Instagram → a real <a href> to the PRE-MINTED insights authorize
//     (portfolio/screen.tsx:470–540's law: no await between the finger and the
//     navigation, so iOS treats it as a link tap, not a script navigation);
//     until the mint returns, a tap re-mints — never a disabled button (F-19.20).
//   Check again → POST /sunday/refresh · Share this → the card state ·
//   Share / Download → the cards section's own share() and download() over the
//   signed brief card · the best-post row → its permalink in a new tab.
// The eleven states are docs/mocks/sunday-brief-mock.html's frames, one each.
export function SundaySection({ state, brief, actions }: { state: SundayState; brief: Brief | null; actions?: SundayActions }) {
  const { toast, show } = useToast();
  const soon = () => { show(COPY.launchingSoon); };
  const cta = (label: string, primary = true) => (
    <button type="button" className={'pst-btn ' + (primary ? 'pst-primary' : 'pst-ghost') + ' pst-gap'} onClick={soon}>{label}</button>
  );
  const btn = (label: string, primary: boolean, onClick: () => void) => (
    <button type="button" className={'pst-btn ' + (primary ? 'pst-primary' : 'pst-ghost') + ' pst-gap'} onClick={onClick}>{label}</button>
  );
  const connect = () => {
    if (!actions) return cta(SU.connectCta);
    // The pre-minted anchor. `href` absent only in the moments before the mint
    // returns; a tap then re-mints. Same class, same byte, same place.
    return actions.connectHref
      ? <a className="pst-btn pst-primary pst-gap" href={actions.connectHref}>{SU.connectCta}</a>
      : btn(SU.connectCta, true, actions.onConnectMint);
  };
  const checkAgain = () => (actions ? btn(SU.checkAgain, false, actions.onCheckAgain) : cta(SU.checkAgain, false));
  const [showCard, setShowCard] = useState(false);
  const body = (() => {
    switch (state) {
      case 'pending':      return <div className="pst-card"><p className="pst-state">{PO.sundayPending}</p></div>;
      case 'connect':
      case 'notconnected': return <div className="pst-card"><p className="pst-state">{SU.connect}</p>{connect()}</div>;
      case 'expired':      return <div className="pst-card"><p className="pst-state">{SU.expired}</p>{connect()}</div>;
      case 'error':        return <div className="pst-card"><p className="pst-state">{COPY.surfaceUnavailable}</p>{checkAgain()}</div>;
      default: break;
    }
    // S7 · Share this was tapped (4b-3b: the glass's own state over a live brief).
    if ((state === 'share' || (showCard && actions)) && brief) {
      const cardUrl = actions ? actions.shareCardUrl : null;
      return (
        // S7 · the brief as a status card. 4b-3b renders it through the cards arm
        // (postCards' status layout, Cloudinary's pixels, Graphite always); this
        // preview stand-in follows the arm's tokens (seven-ink law, b59) and is
        // replaced whole by the rendered image.
        <div className="pst-card">
          <div className="pst-render pst-tall pst-sharecard">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {cardUrl ? <img className="pst-render pst-tall" src={cardUrl} alt="" /> : (
              <div className="pst-sharetxt">
                <div className="pst-sharet">{SU.shareTitle}</div>
                <div className="pst-sharen">{SU.reach} {count(brief.reach.value)} \u00b7 {SU.newFollowers} {brief.new_followers ? count(brief.new_followers.value) : '\u2014'}<br />{SU.saves} {count(brief.saves.value)} \u00b7 {SU.shares} {count(brief.shares.value)}</div>
              </div>
            )}
          </div>
          {actions ? btn(PO.share, true, actions.onShare) : cta(PO.share)}{actions ? btn(PO.download, false, actions.onDownload) : cta(PO.download, false)}
        </div>
      );
    }
    if (!brief) return <div className="pst-card"><p className="pst-state">{COPY.surfaceUnavailable}</p>{checkAgain()}</div>;
    const tile = (label: string, m: Metric | null) => (
      <div className="pst-tile">
        <span className="pst-lbl pst-lbl0">{label}</span>
        {m ? <div className="pst-n">{count(m.value)}</div> : <div className="pst-note">{SU.under100}</div>}
        {m && (() => { const a = arrow(m); return a ? <div className={'pst-arrow pst-' + a.dir}>{a.text}</div> : null; })()}
      </div>
    );
    const empty = state === 'empty';
    const hasPost = !empty && !!brief.best_post;
    return (
      <>
        <div className="pst-week">{weekLine(brief.week_start, brief.week_end)}</div>
        <div className="pst-tiles">
          {tile(SU.reach, brief.reach)}
          {tile(SU.newFollowers, state === 'under100' ? null : brief.new_followers)}
          {tile(SU.saves, brief.saves)}
          {tile(SU.shares, brief.shares)}
          <div className="pst-tile pst-held">
            <span className="pst-lbl pst-lbl0">{SU.bestTime}<span className="pst-chip">{SU.held}</span></span>
            <div className="pst-n">{'\u2014'}</div>
          </div>
        </div>
        {empty ? <div className="pst-card"><p className="pst-state">{SU.emptyWeek}</p></div> : null}
        {hasPost ? (
          <div className="pst-card">
            <span className="pst-lbl pst-lbl0">{SU.bestPost}</span>
            {actions && brief.best_post?.permalink ? (
              <a className="pst-best" href={brief.best_post.permalink} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {brief.best_post?.photo_url ? <img className="pst-thumb" src={brief.best_post.photo_url} alt="" /> : <div className="pst-thumb" />}
                <span className="pst-who">{bestPostLine(brief.best_post!.saves, brief.best_post!.shares)}</span>
              </a>
            ) : (
              <button type="button" className="pst-best" onClick={soon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {brief.best_post?.photo_url ? <img className="pst-thumb" src={brief.best_post.photo_url} alt="" /> : <div className="pst-thumb" />}
                <span className="pst-who">{bestPostLine(brief.best_post!.saves, brief.best_post!.shares)}</span>
              </button>
            )}
          </div>
        ) : null}
        {state === 'stale' ? <div className="pst-card"><p className="pst-state">{SU.stale}</p>{checkAgain()}</div> : null}
        {hasPost && state !== 'stale' ? <div className="pst-card">{actions ? btn(SU.shareThis, true, () => setShowCard(true)) : cta(SU.shareThis)}</div> : null}
      </>
    );
  })();
  return <><WlToast toast={toast} />{body}</>;
}

