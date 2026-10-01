"use client";
// RoomRows · CE-47 L4 (FE-7): the ONE shared row piece of the new layout, for FE-6's and FE-7's rooms.
//
//   <Body>                 a room's body inside .wl-main (one child, so the shell's gutter pads it once)
//   <Head text count?>     a section head: "Your peers · 3"
//   <Group>                one bordered card holding rows
//   <Row title facts? value? pill? chevron? icon? onClick? href?>   (href: the row is a link to that route)
//                          a row: title, then at most two lines of facts; value is a plain figure at the right
//                          (an amount), drawn before the pill; (clamped, and measured at 360 and 374
//                          by b177); a pill at the right; a chevron when the row opens something; a button
//                          only when it has onClick
//   <Pill text tone?>      tone: 'ok' | 'warn' | 'bad' | 'soon' | 'plain' (soon = R-46.14's "Coming soon")
//   FR_CSS                 the pieces' CSS; tokens only (card-bg, card-border, ink, ink-mute, accent-text,
//                          row-hover, role-positive, role-caution, role-critical). No colour of its own.
import type { ReactNode } from 'react';
import Link from 'next/link';

export type Tone = 'ok' | 'warn' | 'bad' | 'soon' | 'plain';
export function Pill({ text, tone = 'plain' }: { text: string; tone?: Tone }) {
  return <span className={'fr-pill ' + tone}>{text}</span>;
}
export function Group({ children }: { children: ReactNode }) { return <div className="fr-group">{children}</div>; }
export function Row({ title, facts, value, pill, onClick, chevron, icon, href }: {
  title: string; facts?: string; value?: string; href?: string; pill?: { text: string; tone?: Tone } | null; onClick?: () => void; chevron?: boolean; icon?: ReactNode;
}) {
  // The title and the pill share the first line; the facts run the full width beneath them, so a pill never narrows
  // the facts into a third line (b177, measured at 360 and 374).
  const inner = (
    <>
      {icon ? <span className="fr-icon" aria-hidden="true">{icon}</span> : null}
      <span className="fr-t">{title}</span>
      {pill || chevron || value ? (
        <span className="fr-aside">
          {value ? <span className="fr-v">{value}</span> : null}
          {pill ? <Pill text={pill.text} tone={pill.tone} /> : null}
          {chevron ? <span className="fr-chev" aria-hidden="true">{'\u203A'}</span> : null}
        </span>
      ) : null}
      {facts ? <span className="fr-f">{facts}</span> : null}
    </>
  );
  const cls = 'fr-row' + (icon ? ' fr-has-icon' : '');
  if (href) return <Link href={href} className={cls}>{inner}</Link>;   // a row that is a route: a real link
  return onClick ? <button type="button" className={cls} onClick={onClick}>{inner}</button> : <div className={cls}>{inner}</div>;
}
export function Head({ text, count }: { text: string; count?: number }) {
  return <h2 className="fr-h">{text}{count ? ` \u00B7 ${count}` : ''}</h2>;
}
export function Body({ children }: { children: ReactNode }) { return <div className="fr-room">{children}</div>; }
export const FR_CSS = `
.fr-room{display:flex;flex-direction:column;padding-bottom:32px;min-width:0}
.fr-lede{margin:0 0 16px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.fr-h{margin:24px 0 8px;font:var(--wl-t2);color:var(--atelier-ink)}
.fr-group{border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);overflow:hidden}
.fr-row{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:12px;row-gap:2px;align-items:center;width:100%;box-sizing:border-box;padding:12px 16px;background:transparent;border:0;border-radius:0;text-align:left;color:inherit;min-height:56px;touch-action:manipulation}
.fr-row.fr-has-icon{grid-template-columns:auto minmax(0,1fr) auto}
.fr-row .fr-t{grid-column:1}
.fr-row.fr-has-icon .fr-t{grid-column:2}
.fr-aside{grid-column:-2;display:flex;align-items:center;gap:8px}
.fr-row .fr-f{grid-column:1 / -1}
.fr-row.fr-has-icon .fr-f{grid-column:2 / -1}
.fr-row.fr-has-icon .fr-icon{grid-row:1 / span 2;align-self:center}
.fr-row + .fr-row{border-top:1px solid var(--atelier-card-border)}
a.fr-row{text-decoration:none;color:inherit}
button.fr-row:active,a.fr-row:active{background:var(--atelier-row-hover)}
.fr-t{font:var(--wl-tb);color:var(--atelier-ink);overflow-wrap:anywhere}
.fr-f{font:var(--wl-t4);color:var(--atelier-ink-mute);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.fr-pill{flex:none;font:var(--wl-t5);padding:4px 10px;border-radius:999px;border:1px solid var(--atelier-accent-text);color:var(--atelier-accent-text);white-space:nowrap}
.fr-pill.warn{border-color:var(--role-caution);color:var(--role-caution)}
.fr-pill.ok{border-color:var(--role-positive);color:var(--role-positive)}
.fr-pill.bad{border-color:var(--role-critical);color:var(--role-critical)}
.fr-pill.soon{border-color:var(--atelier-card-border);color:var(--atelier-ink-mute)}
.fr-icon{flex:none;display:flex;color:var(--atelier-accent-text)}
.fr-icon svg{width:22px;height:22px}
.fr-v{font:var(--wl-tb);color:var(--atelier-ink);white-space:nowrap}
.fr-chev{flex:none;font:var(--wl-t2);color:var(--atelier-ink-mute);line-height:1}
.fr-top{margin:0 0 8px}
button.rp-back{background:transparent;border:0;padding:0;align-self:flex-start}
.fr-empty{margin:0;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.fr-quiet{display:inline-flex;align-items:center;min-height:44px;padding:0;margin:8px 0 32px;background:transparent;border:0;font:var(--wl-tb);color:var(--role-critical);touch-action:manipulation}
`;
