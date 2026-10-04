// lib/site/styles/index.ts · WEB-5 · the one engine's server half: which style draws, and what every style is given.
import { CSS as ENGINE_CSS } from './engine.css';
import { CSS as GALLERY_CSS } from './gallery.css';
import { CSS as COUTURE_CSS } from './couture.css';
import { couture } from './couture';
import { gallery } from './gallery';
import { CSS as NOIR_CSS } from './noir.css';
import { CSS as HERITAGE_CSS } from './heritage.css';
import { CSS as AURORA_CSS } from './aurora.css';
import { CSS as RIVIERA_CSS } from './riviera.css';
import { noir } from './noir';
import { heritage } from './heritage';
import { aurora } from './aurora';
import { riviera } from './riviera';
import type { SiteCard } from '../card';
import type { Raw } from '../html';

export type StyleCtx = {
  name: string; mono: string; trade: string; instagram: string | null; coverLq: string;
  dateHref: string; lookHref: (slug: string) => string; collectionHref: (slug: string) => string;
};
export type StyleDef = { id: string; header: (c: SiteCard, x: StyleCtx) => Raw; body: (c: SiteCard, x: StyleCtx) => Raw; over: string[]; vars?: (c: SiteCard) => Record<string, string>;
  drawer?: (nav: { label: string; href: string; eliza?: boolean }[], foot: { instagram?: string | null; whatsapp?: string | null; cities?: string | null }) => Raw };
export type StyleEntry = { def: StyleDef; css: string; firstScreen: string; ownBase?: boolean };

// FIRST SCREEN WITHOUT SCRIPT (charter item 3: "no script on the first screen that it does not need").
// The prototypes reveal the cover by adding a class from script after load (gallery.html STYLE.after: #eh1 at once,
// #bigh after 350 ms). On a server-drawn page the cover's end-state classes are in the HTML, and the SAME motion runs
// as a keyframe from first paint, with the prototype's own durations, easing and delay; nothing waits for script, and
// the photograph is never held at opacity 0. Reduced motion stops these like every other animation (engine.css).
const GALLERY_FIRST = `
#eh1.in .ln>span{animation:tdwRise calc(1.05s * var(--k)) var(--ease) both}
#bigh.hang.rv.in{animation-delay:.35s}
@keyframes tdwRise{from{transform:translateY(108%)}to{transform:none}}
@media (prefers-reduced-motion:reduce){#eh1.in .ln>span{animation:none}}`;

// Couture (couture.html :597-603 setCover(0,true), and CSS :96-104): the first slide 'on drift', the copy 'in'. The
// copy's lines, kicker and button rise by keyframe from first paint with the prototype's own timings (.ln 1s, kick .8s,
// button .8s after .45s); the story's timer, its segments and the later slides start with the runtime.
const COUTURE_FIRST = `
.copy.in .ln>span{animation:tdwRise calc(1s * var(--k)) var(--ease) both}
.copy.in .kick>span{animation:tdwRise calc(.8s * var(--k)) var(--ease) both}
.copy.in .btn{animation:tdwUp .8s var(--ease) .45s both}
@keyframes tdwRise{from{transform:translateY(110%)}to{transform:none}}
@keyframes tdwUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.copy.in .ln>span,.copy.in .kick>span,.copy.in .btn{animation:none}}`;

// The four others (their CSS :60-90 in each source): the cover's entrance classes (.go, .in) are in the HTML, and each
// transition they would have run is the same keyframe with the prototype's own duration, easing and delay.
const K = `@keyframes tdwRise{from{transform:translateY(108%)}to{transform:none}}@keyframes tdwFade{from{opacity:0}}@keyframes tdwUp{from{opacity:0;transform:translateY(12px)}}`;
const LINES = `h1.in .ln>span{animation:tdwRise calc(1.05s * var(--k)) var(--ease) both}`;
const RM = (sel: string) => `@media (prefers-reduced-motion:reduce){${sel}{animation:none!important}}`;
const NOIR_FIRST = `${K}
.cover.go .cc .caps{animation:tdwFade 1.4s ease .3s both}
.cover.go .ttl .c{animation:tdwLetter 1.1s var(--ease) both;animation-delay:calc(.5s + var(--i) * 55ms * var(--k))}
@keyframes tdwLetter{from{opacity:0;filter:blur(10px);transform:translateY(.12em)}}
.cover.go .rule{animation:tdwRule 1.8s var(--ease) 1.2s both}@keyframes tdwRule{from{width:0}}
.cover.go .cc .bg{animation:tdwFade 1s ease 1.4s both}
${RM('.cover.go .cc .caps,.cover.go .ttl .c,.cover.go .rule,.cover.go .cc .bg')}`;
const HERITAGE_FIRST = `${K}${LINES}
.cover.go .caps{animation:tdwFade 1.2s ease .2s both}
.cover.go .btn-v{animation:tdwUp .9s var(--ease) 1s both}
.cover.go .orn path,.cover.go .orn circle{animation:tdwDraw 2.2s var(--ease) both}@keyframes tdwDraw{from{stroke-dashoffset:300}}
#jmain.open{animation:tdwOpen calc(2s * var(--k)) cubic-bezier(.4,.1,.2,1) .3s both}@keyframes tdwOpen{from{--j:0%}to{--j:120%}}
${RM('.cover.go .caps,.cover.go .btn-v,.cover.go .orn path,.cover.go .orn circle,#jmain.open,h1.in .ln>span')}`;
const AURORA_FIRST = `${K}${LINES}
.cover.go .pill{animation:tdwUp .9s var(--ease) .2s both}
.cover.go .fl{animation:tdwFloat 1.6s var(--ease) both}.cover.go .fl.b{animation-delay:.25s}.cover.go .fl.c{animation-delay:.45s}
@keyframes tdwFloat{from{opacity:0;transform:translateY(40px) scale(.94)}}
${RM('.cover.go .pill,.cover.go .fl,h1.in .ln>span')}`;
const RIVIERA_FIRST = `${K}${LINES}
.cover.go .cc .caps{animation:tdwFade 2s ease .4s both}
.cover.go .btn-p{animation:tdwFade 1.6s ease 1.4s both}
.cover.go .stampc{animation:tdwStamp 1s cubic-bezier(.3,1.5,.5,1) 1.8s both}@keyframes tdwStamp{from{opacity:0;transform:rotate(-14deg) scale(1.3)}}
${RM('.cover.go .cc .caps,.cover.go .btn-p,.cover.go .stampc,h1.in .ln>span')}`;

export const STYLES: Record<string, StyleEntry> = {
  noir: { def: noir, css: NOIR_CSS, firstScreen: NOIR_FIRST },
  heritage: { def: heritage, css: HERITAGE_CSS, firstScreen: HERITAGE_FIRST },
  aurora: { def: aurora, css: AURORA_CSS, firstScreen: AURORA_FIRST },
  riviera: { def: riviera, css: RIVIERA_CSS, firstScreen: RIVIERA_FIRST },
  gallery: { def: gallery, css: GALLERY_CSS, firstScreen: GALLERY_FIRST },
  couture: { def: couture, css: COUTURE_CSS, firstScreen: COUTURE_FIRST, ownBase: true },
};
export const ENGINE = ENGINE_CSS;
