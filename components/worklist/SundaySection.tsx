"use client";

import { WlToast } from '@/components/worklist/WlToast';
import { useToast } from '@/hooks/vendor/useToast';
import { COPY } from '@/lib/solutions/copy';
import { PO } from '@/lib/worklist/posts';
import { SU, bestPostLine, weekLine, arrow, count } from '@/lib/worklist/sunday';
import type { Brief, Metric, SundayState } from '@/lib/worklist/sunday';
// components/worklist/SundaySection.tsx — 4b-3a · THE SUNDAY SECTION, every state from a brief.
// ITS OWN FILE because a Next.js page module may export only the page (the founder's
// `next build` refused a named export on page.tsx; tsc --noEmit did not see it).
// R-42.14 shell-first: this is the FINISHED chrome. 4b-3b replaces `state` and
// `brief` with the door's answer and flips SUNDAY_PREVIEW; nothing here moves
// except the data. Under PREVIEW every CTA toasts COPY.launchingSoon (one byte,
// the hub's home) and no door is called — b76 pins both. The eleven states are
// docs/mocks/sunday-brief-mock.html's frames, one each. Exported for b76.
export function SundaySection({ state, brief }: { state: SundayState; brief: Brief | null }) {
  const { toast, show } = useToast();
  const soon = () => { show(COPY.launchingSoon); };
  const cta = (label: string, primary = true) => (
    <button type="button" className={'pst-btn ' + (primary ? 'pst-primary' : 'pst-ghost') + ' pst-gap'} onClick={soon}>{label}</button>
  );
  const body = (() => {
    switch (state) {
      case 'pending':      return <div className="pst-card"><p className="pst-state">{PO.sundayPending}</p></div>;
      case 'connect':
      case 'notconnected': return <div className="pst-card"><p className="pst-state">{SU.connect}</p>{cta(SU.connectCta)}</div>;
      case 'expired':      return <div className="pst-card"><p className="pst-state">{SU.expired}</p>{cta(SU.connectCta)}</div>;
      case 'error':        return <div className="pst-card"><p className="pst-state">{COPY.surfaceUnavailable}</p>{cta(SU.checkAgain, false)}</div>;
      case 'share':        return brief ? (
        // S7 · the brief as a status card. 4b-3b renders it through the cards arm
        // (postCards' status layout, Cloudinary's pixels, Graphite always); this
        // preview stand-in follows the arm's tokens (seven-ink law, b59) and is
        // replaced whole by the rendered image.
        <div className="pst-card">
          <div className="pst-render pst-tall pst-sharecard">
            <div className="pst-sharetxt">
              <div className="pst-sharet">{SU.shareTitle}</div>
              <div className="pst-sharen">{SU.reach} {count(brief.reach.value)} \u00b7 {SU.newFollowers} {brief.new_followers ? count(brief.new_followers.value) : '\u2014'}<br />{SU.saves} {count(brief.saves.value)} \u00b7 {SU.shares} {count(brief.shares.value)}</div>
            </div>
          </div>
          {cta(PO.share)}{cta(PO.download, false)}
        </div>
      ) : null;
      default: break;
    }
    if (!brief) return <div className="pst-card"><p className="pst-state">{COPY.surfaceUnavailable}</p>{cta(SU.checkAgain, false)}</div>;
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
            <button type="button" className="pst-best" onClick={soon}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {brief.best_post?.photo_url ? <img className="pst-thumb" src={brief.best_post.photo_url} alt="" /> : <div className="pst-thumb" />}
              <span className="pst-who">{bestPostLine(brief.best_post!.saves, brief.best_post!.shares)}</span>
            </button>
          </div>
        ) : null}
        {state === 'stale' ? <div className="pst-card"><p className="pst-state">{SU.stale}</p>{cta(SU.checkAgain, false)}</div> : null}
        {hasPost && state !== 'stale' ? <div className="pst-card">{cta(SU.shareThis)}</div> : null}
      </>
    );
  })();
  return <><WlToast toast={toast} />{body}</>;
}

