'use client';
import EnquirySheet from '@/components/frost/EnquirySheet';
import { API_BASE, getCoupleSession } from '@/lib/frost-api/_base';
import { vocabularyFor } from '@/lib/shared/tagVocabulary';
import { BUDGET_BANDS, bandLabelFor } from '@/lib/frost/budgetBands';

// sanctuary/page.tsx — V5 BLOOM ARCHITECTURE
// Every slice opens IN THIS PAGE. No router.push. No history stack.
// She taps a slice → it blooms up from position → fills screen.
// She swipes down or taps ← → contracts back to Sanctuary.
// Same URL. Same component. Sanctuary is always underneath.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFrostMode } from '../../../layout';
import { setFrostMode } from '../../../../../lib/frost/tokens';
import { EASE, FROST_COPY, FT, FS, FI, daysUntil, getCoupleIdForFrost } from '../../../../../lib/frost/tokens';
import { Send } from 'lucide-react';
import { streamBrideChat } from '../../../../../lib/frost-api/couple';
import { fetchCircle, inviteCircleMember, removeCircleMember, fetchMemberFeed, timeAgo, formatActivityLine, fetchEvents, fetchReceipts, deleteReceipt, fetchBookings, createBooking, updateBooking, deleteBooking, recordPayment, fetchProfile, saveProfile, fetchEnquiries, type CircleData, type CircleActivity, type CircleMember, type CoupleEvent, type CoupleReceipt, type CoupleBooking, type CoupleProfile, type CoupleEnquiry } from '../../../../../lib/frost/journey';
import { fetchMuseSaves, deleteMuseSave, uploadMuseImage, createMuseSaveFromUrl, fetchSaveActivity, saveVendorToMuse } from '../../../../../lib/frost-api/muse';
import { fetchDiscoverFeed, makeEnquireLink } from '../../../../../lib/frost-api/discover';
import type { DiscoverVendor } from '../../../../../lib/types/discover';
import type { MuseSave, MuseActivity } from '../../../../../lib/types/discover';
import { waNumberFor } from '@/lib/waNumbers';
// ── TDW_13 · D-4 · THE SIX EXTRACTED BLOOMS ───────────────────────────────────
// Six rooms left this file for components/frost/blooms/ under the verbatim
// relocation law. What stayed is the conductor: the rail, the bloom layer, the
// open/close choreography, and the rooms not yet moved. The blooms are imported,
// never re-declared — one home each.
import { ExpensesRoom } from '@/components/frost/blooms/expenses';
import { VendorsRoom }  from '@/components/frost/blooms/vendors';
import { SettingsRoom } from '@/components/frost/blooms/settings';
import { PeopleRoom }   from '@/components/frost/blooms/people';
import { EventsRoom }   from '@/components/frost/blooms/events';
import { MomentsRoom }  from '@/components/frost/blooms/moments';
// ── TDW_13 · D-5 · THE REMAINING BLOOMS ──────────────────────────────────────
// Five more rooms left the conductor. Discover travels with its filter sheet,
// its vendor panel and the beta gate in ONE file (FORK-γ): the gate exists to
// fence exactly one surface, and a standalone file for it is an invitation to
// mount it somewhere it was never ruled to guard.
//
// DREAM DOES NOT MOVE. It is the one room with no component — its messages,
// input, streaming and cancel are the page's own state — and it extracts last,
// in its own sitting, under ε1. If it still resists there, ε3 (Dream as the
// conductor's own room, recorded as design) remains open by ruling.
// BetaGate is exported from the discover bloom rather than given its own file:
// FORK-γ ruled co-residence with the only surface it gates. The conductor still
// mounts it, because the gate decision is the CONDUCTOR's — it is what decides
// whether the feed mounts at all, and moving that inside DiscoverRoom would make
// the room render itself and then refuse to, which is not what D-2 built.
import { DiscoverRoom, BetaGate } from '@/components/frost/blooms/discover';
import { MuseRoom }     from '@/components/frost/blooms/muse';
import { CircleRoom }   from '@/components/frost/blooms/circle';
import { PagesRoom }    from '@/components/frost/blooms/pages';
import { MeridianRoom } from '@/components/frost/blooms/meridian';
import { usePress } from '@/components/frost/_shared/usePress';
import { coupleAccessToken } from '@/components/frost/_shared/coupleAccessToken';
// ── TDW_07 P6 · THE FOLD UNDER F-D ────────────────────────────────────────────
// sanctuary's Discover room IS the couple Discover surface (F-07.43, founder's 「 F-D 」).
// /frost/canvas/discover is dead and its renderer, chip, eyebrow, dots, image variants and
// gesture mechanics arrive here through their SHARED homes — never as a second copy.
import VendorProfileView, { IgChip, FeaturedEyebrow } from '@/components/shared/VendorProfileView';
import ImageDots from '@/components/shared/ImageDots';
import { imgUrl, lqipUrl } from '@/lib/frost-api/img';
import {
  SWIPE_THRESHOLD, SWIPE_VELOCITY, TAP_MAX_MOVE, TAP_MAX_TIME, DOUBLE_TAP_MS,
  OVERLAY_DISMISS, haptic, usePhotoPager,
} from '@/lib/frost/photoPager';
// TDW_07 P4b · F-07.16 — the estate's one money donor. Locked register: Rs 1,50,000.
import { formatRs } from '@/lib/vendor/format';
// F-05.29 (CE-64 filed, CE-65 micro): the front-door guard below reads the
// cookie mirror the whole lane maintains, instead of localStorage alone.
// IMPORTED, NEVER MODIFIED — F-05.30 (the cross-lane fallback inside this
// function) is filed to the coordinated auth sitting and is not this micro's.
import { getAccessToken } from '../../../../../lib/frost-api/_base';

// ── Types ─────────────────────────────────────────────────────────────────────
type RoomKey = 'dream'|'circle'|'muse'|'discover'|'people'|'pages'|'moments'|'events'|'meridian'|'expenses'|'vendors'|'settings'|null;

interface UIMsg {
  id: string; role:'user'|'assistant'; content:string; pending?:boolean; error?:boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const DEMO_WEDDING    = new Date('2026-11-19T00:00:00+05:30');
const DEMO_ENGAGEMENT = new Date('2026-04-11T00:00:00+05:30');

function getWeddingDate():Date{ try{const r=localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');if(r){const s=JSON.parse(r);if(s?.wedding_date)return new Date(s.wedding_date);}}catch{}return DEMO_WEDDING; }
function getEngagementDate():Date{ try{const r=localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');if(r){const s=JSON.parse(r);if(s?.engagement_date)return new Date(s.engagement_date);}}catch{}return DEMO_ENGAGEMENT; }
// F-09.166's last reachable Priya. This used to `return 'Priya'` when the session
// blob held no name — the fallback F-05.38 was written to make unreachable by
// HEALING the blob, but a heal that runs in an async effect cannot beat a render.
// Returning null instead means the greeting renders BLANK for the tick before the
// heal lands, rather than greeting her by a stranger's name. No word changed: the
// greeting's own null-guard decides whether the sentence exists at all.
function getBrideName():string|null{ try{const r=localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');if(r){const s=JSON.parse(r);const n=(s?.user_name||s?.bride_name||s?.name||'').trim().split(' ')[0];if(n)return n;}}catch{}return null; }

function daysSince(d:Date):number{const t=new Date();t.setHours(0,0,0,0);const e=new Date(d);e.setHours(0,0,0,0);return Math.max(0,Math.round((t.getTime()-e.getTime())/86400000));}
function arcProgress(d:number):number{return Math.max(0,Math.min(1,1-d/365));}
function arcPoint(t:number){const p0={x:18,y:92},p1={x:160,y:4},p2={x:302,y:92};const u=1-t;return{x:u*u*p0.x+2*u*t*p1.x+t*t*p2.x,y:u*u*p0.y+2*u*t*p1.y+t*t*p2.y};}
function arcPathTo(t:number):string{if(t<=0)return'M 18 92';const p0={x:18,y:92},p1={x:160,y:4},p2={x:302,y:92};const q0={x:p0.x+(p1.x-p0.x)*t,y:p0.y+(p1.y-p0.y)*t};const q1={x:p1.x+(p2.x-p1.x)*t,y:p1.y+(p2.y-p1.y)*t};const ep={x:q0.x+(q1.x-q0.x)*t,y:q0.y+(q1.y-q0.y)*t};return`M 18 92 Q ${q0.x.toFixed(1)} ${q0.y.toFixed(1)} ${ep.x.toFixed(1)} ${ep.y.toFixed(1)}`;}
const ONES=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
const TENS=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
function toW(n:number):string{if(n<20)return ONES[n]||String(n);const t=Math.floor(n/10),o=n%10;if(!o)return TENS[t];return`${TENS[t]}-${ONES[o].toLowerCase()}`;}
function bigW(n:number):string{if(n<100)return toW(n);const h=Math.floor(n/100),r=n%100;return ONES[h]+' hundred'+(r?' and '+toW(r).toLowerCase():'');}
function dW(n:number):string{if(n<100)return toW(n);if(n<1000)return bigW(n);return String(n);}
function prose(d:number):string{if(d===0)return'Today.';const w=dW(d);return`${w.charAt(0).toUpperCase()+w.slice(1)} mornings between I will and I do.`;}
function romanDate():string{const n=new Date(),R=['','i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii'];return`${String(n.getDate()).padStart(2,'0')} · ${R[n.getMonth()+1]} · ${String(n.getFullYear()).slice(-2)}`;}
function getDailyPoetry():string{const pool=FROST_COPY.idlePool;const d=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0).getTime())/86400000);return pool[d%pool.length];}
function uid(){return Math.random().toString(36).slice(2);}


// ── CHOREOGRAPHY CONSTANTS ────────────────────────────────────────────────────
// F-13.5's cure, taken BEFORE P2's FROZEN header rather than after, because a
// header over a diseased shape makes the disease permanent by law.
//
// The close is a two-part motion: CSS animates the bloom out, and JS tears the
// room down when the animation has finished. Those two durations MUST be the
// same number or the room either snaps away mid-slide or sits frozen at the
// bottom of the screen for the difference. They were the same number in three
// places, hand-synchronized, with nothing connecting them: the .bloom-exit rule
// here, closeRoom's teardown timer, and the popstate back-trap's own copy of
// that timer. Any one of them could be tuned alone and the other two would not
// know. That is the shape the extraction was about to freeze.
//
// The open side needs no constant: .bloom-enter's 380ms is the only occurrence
// of that number in the tree and the open path carries no JS timer, so there is
// nothing for it to fall out of step with. A constant for a single site would be
// churn dressed as hygiene.
const BLOOM_CLOSE_MS = 300;

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS=`
@keyframes gnB{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.006);}}
@keyframes numB{0%,100%{transform:scale(1);}50%{transform:scale(1.003);}}
@keyframes dC{0%,37%,100%{opacity:.42;}18%{opacity:1;}}
@keyframes dH{0%,37%,100%{opacity:.15;}18%{opacity:.58;}}
@keyframes dO{0%,37%,100%{opacity:.05;}18%{opacity:.22;}}
@keyframes cF{0%{opacity:.7}15%{opacity:1}28%{opacity:.85}45%{opacity:1}60%{opacity:.88}75%{opacity:1}88%{opacity:.72}100%{opacity:.7}}
@keyframes sIn{from{opacity:0;transform:translateY(3px);}to{opacity:1;transform:translateY(0);}}
@keyframes bloomIn{from{opacity:0;transform:translateY(100%);}to{opacity:1;transform:translateY(0);}}
@keyframes bloomOut{from{opacity:1;transform:translateY(0);}to{opacity:0;transform:translateY(100%);}}
@keyframes dpulse{0%,80%,100%{opacity:.35}40%{opacity:1}}
@keyframes dcursor{0%,100%{opacity:1}50%{opacity:0}}
.gn-a{animation:gnB 9s ease-in-out infinite;}
.num-a{animation:numB 7s ease-in-out infinite;}
.dc-a{animation:dC 4s ease-in-out infinite;}
.dh-a{animation:dH 4s ease-in-out infinite;}
.do-a{animation:dO 4s ease-in-out infinite;}
.cf-a{animation:cF 5s ease-in-out infinite;}
.si-a{animation:sIn 220ms cubic-bezier(0.22,1,0.36,1) forwards;}
.bloom-enter{animation:bloomIn 380ms cubic-bezier(0.22,1,0.36,1) forwards;}
.bloom-exit{animation:bloomOut ${BLOOM_CLOSE_MS}ms cubic-bezier(0.4,0,1,1) forwards;}
.d-cursor{animation:dcursor 1s ease-in-out infinite;}
.no-scroll::-webkit-scrollbar{display:none;}
.no-scroll{-ms-overflow-style:none;scrollbar-width:none;}
`;

// SLICES are now dynamic — hints updated from live data on mount.
// Base definitions — hints overridden by useSanctuaryHints() state.
const BASE_SLICES=[
  {key:'discover'as RoomKey, label:'Discover',     candle:false, premium:false},
  {key:'circle'  as RoomKey, label:'Circle',       candle:true,  premium:false},
  {key:'muse'    as RoomKey, label:'Muse',         candle:false, premium:false},
  {key:'people'  as RoomKey, label:'My People',    candle:false, premium:false},
  {key:'pages'   as RoomKey, label:'Pages',        candle:false, premium:false},
  {key:'moments' as RoomKey, label:'Moments',      candle:false, premium:false},
  {key:'events'  as RoomKey, label:'The Journey',  candle:false, premium:false},
  {key:'expenses'as RoomKey, label:'Expenses',     candle:false, premium:false},
  {key:'vendors' as RoomKey, label:'Vendors',      candle:false, premium:false},
  {key:'meridian'as RoomKey, label:'Meridian',     candle:false, premium:true},
  {key:'settings'as RoomKey, label:'Settings',     candle:false, premium:false},
];
// WhatsApp link — opens WA with prefilled Hi.
// F-05.24 (TDW_05 P4 closing micro): this read `const DREAMAI_WA_NUMBER =
// '14787788550'` — the DEAD Twilio sandbox number — and rendered it as a live
// <a href> at two places below. A bride tapping it reached a number that does not
// answer. It resolves through lib/waNumbers.ts now: the BRIDE lane, because this
// is a bride-facing surface. See that file for why it is a declared drift pair
// with dream-os's src/lib/waNumbers.js rather than an import.

const DREAM_PROMPTS=[
  'How many days until my wedding?',
  "What's on my calendar this week?",
  "Who's in my Circle?",
  'What have I saved to Muse?',
  'How much have I spent so far?',
];

// ── Root component ────────────────────────────────────────────────────────────















// ── Root component ────────────────────────────────────────────────────────────


export default function SanctuaryPage() {
  const { press, pressed } = usePress();
  const { homeMode, setHomeMode } = useFrostMode();
  const dark = homeMode === 'E1A';

  // ── F-09.166 · THE FICTIONAL-BRIDE FLASH (founder walk, 2026-08-07) ──────────
  // These four seeds were FIXTURE DATA FOR A BRIDE WHO DOES NOT EXIST: 176 days,
  // .38 along the arc, "Priya", 47 days since yes. Every load — SSR frame and
  // hydration — painted that stranger's masthead, and the mount effect below
  // (setDays/setProgress/setName/setSinceYes) corrected it a frame later. The
  // founder caught it on his own walk: 「 every time the screen refreshes it shows
  // hello priya 」.
  //
  // THIS IS THE SAME CLASS THE WINE-FLASH-FIX KILLED ONE COMMIT BEFORE THIS ARC
  // (0a102e1+1: "the E3 literal that painted one light frame dies") — a literal
  // upstream of the real reader, painting one wrong frame. Same disease, different
  // literal, and the atelier arc AMPLIFIED it rather than caused it: Fork 3 arm A
  // put the numeral at FT.numeral, so a wrong figure that used to be 48px of glance
  // is now 150px of the whole screen.
  //
  // THE CURE IS ABSENCE, NOT A BETTER GUESS. A seed cannot be correct on the server
  // — there is no session there to read — so any non-null seed is a fiction. null
  // renders NOTHING and the masthead reserves its own height (see the hero block),
  // so the first frame is empty for one tick rather than wrong for one tick. An
  // empty countdown tells her nothing; a countdown of 176 tells her something false.
  const [days,       setDays]       = useState<number|null>(null);
  const [progress,   setProgress]   = useState<number|null>(null);
  const [name,       setName]       = useState<string|null>(null);
  const [proseLine,  setProseLine]  = useState('');
  const [poetry,     setPoetry]     = useState('');
  const [sinceYes,   setSinceYes]   = useState<number|null>(null);
  // Live hints from backend — fetched on mount
  // F-09.166, second face: these three asserted a state before it was known
  // ("quiet" on a Circle that may be busy). Emptied for the same reason — the rail
  // hint is allowed to say nothing, and the hint map already tolerates ''.
  const [circleHint,  setCircleHint]  = useState('');
  const [museHint,    setMuseHint]    = useState('');
  const [peopleHint,  setPeopleHint]  = useState('');
  const [pagesHint,   setPagesHint]   = useState('');
  const [eventsHint,  setEventsHint]  = useState('');
  const [expensesHint,setExpensesHint]= useState('');
  const [vendorsHint, setVendorsHint] = useState('');
  const [weekday,    setWeekday]    = useState('');
  const [dateStamp,  setDateStamp]  = useState('');
  // F-07.70 · fork B2's byte needs somewhere to land. This page carried no toast of
  // its own — the four other toasts in this file belong to rooms, not to the shell.
  const [bounceToast, setBounceToast] = useState('');

  // Bloom state
  const [activeRoom, setActiveRoom]   = useState<RoomKey>(null);
  const [blooming,   setBlooming]     = useState(false);
  const [closing,    setClosing]      = useState(false);
  // TDW_13 · D-2 · the Discover beta gate's ONE piece of state (R-30.36).
  // Session-only and deliberately so: the ruling says the gate fires on EVERY
  // open, and no dismissal memory exists without a founder word. Nothing here
  // touches a storage API, so there is nothing to forget to clear.
  const [betaGateAcked, setBetaGateAcked] = useState(false);
  const touchStartY = useRef(0);
  const bloomRef    = useRef<HTMLDivElement>(null);

  // Block pull-to-refresh inside bloom rooms ONLY when:
  // 1. A room is open AND
  // 2. The touch target is not inside a scrollable child that has scroll room
  // This allows Muse/Dream/Circle content to scroll normally.
  useEffect(()=>{
    const el = bloomRef.current;
    if(!el || !activeRoom) return;
    let startY = 0;
    const onStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - startY;
      // Find the closest scrollable ancestor of the touch target
      let node = e.target as HTMLElement | null;
      while(node && node !== el) {
        const style = window.getComputedStyle(node);
        const overflow = style.overflowY;
        const canScroll = overflow === 'auto' || overflow === 'scroll';
        if(canScroll) {
          // If pulling down and already at top — block (no-op for PTR)
          if(dy > 0 && node.scrollTop <= 0) { e.preventDefault(); return; }
          // If pulling up and already at bottom — let it pass
          if(dy < 0 && node.scrollTop + node.clientHeight >= node.scrollHeight - 1) { return; }
          // Otherwise the child has scroll room — let it scroll
          return;
        }
        node = node.parentElement;
      }
      // No scrollable child found — block PTR when pulling down
      if(dy > 0) e.preventDefault();
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove',  onMove,  { passive: false });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove',  onMove);
    };
  }, [activeRoom]);

  // Dream Ai state
  const [msgs,    setMsgs]    = useState<UIMsg[]>([]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLTextAreaElement>(null);
  const cancelRef  = useRef<(()=>void)|null>(null);

  useEffect(()=>{
    // ── Auth guard — if no session, go to landing ──────────────────────────
    // F-05.29: this read was localStorage-only while lib/frost-api/_base.ts's
    // getAccessToken writes a tdw_couple_token cookie on EVERY token read, built
    // precisely so an iOS ITP wipe cannot strand a bride. It stranded her anyway:
    // seven days idle, valid credentials in the cookie, bounced to landing.
    //
    // ── F-07.70 · THE HEALING SENTENCE THAT STOPPED BEING TRUE ────────────────
    // WHAT STOOD HERE, and it was true when it was written: "getAccessToken
    // RESTORES the recovered token to localStorage, and this effect runs at mount
    // — so the ~20 later localStorage-only token reads in this file heal on their
    // own. That is what makes a two-line diff sufficient here rather than merely
    // small." F-07.65's cure made every clause of that false, and this amendment
    // is F-06.85's law firing exactly as designed: a soul sentence conditioned on
    // a mechanical fact must name the mechanism, so that the mechanism's next
    // sitting is forced to re-read the sentence. This sitting was.
    //
    // THE NEW MECHANISM, stated so the next reader inherits it:
    //   (a) THE RESTORE NO LONGER RUNS ON THE CASE THAT MATTERS. getAccessToken
    //       asserts the lane BEFORE any cookie work (_base.ts:214). On a crossed
    //       device the bare slot is non-empty — it holds the VENDOR's JWT — so the
    //       function returns null down the first branch and never reaches the
    //       restore. There is nothing to heal and nothing doing the healing.
    //   (b) THE TWELVE READS NO LONGER EXIST TO HEAL. Every token read in this
    //       file now goes through `coupleAccessToken()` (:57-90) and therefore
    //       through the authority. The premise of the old sentence — direct reads
    //       downstream, waiting to be rescued by a value in localStorage — has been
    //       deleted rather than repaired.
    //   (c) THIS GUARD IS NOW THE FRONT DOOR'S TRUTH, not a formality the later
    //       reads made redundant. Fork B2, CE-ruled: it refuses on the TOKEN,
    //       because a refused token with a surviving couple_session blob is exactly
    //       the crossover — she gets a room that loads and then fails every fetch
    //       inside it. A half-alive room is the silent wrong-self wearing a
    //       different coat, and F-05.30's reversal already ruled against it.
    //   (d) THE DEMO LANE IS SACRED AND IS WHY THIS IS NOT `if(!token)`.
    //       app/demo/bride/page.tsx writes NO bare access_token — her token lives
    //       inside the blob — so getAccessToken() returns null for every demo
    //       bride. Bouncing on the token alone would evict the entire demo lane.
    //       The blob's own `demo:true` is the exemption, and it is the blob's word
    //       about itself, not an inference about her.
    //   (e) giving the session leg its own cookie fallback would admit a TOKEN-LESS
    //       bride into a surface whose every fetch needs a Bearer. Unchanged.
    const token = getAccessToken();
    const session = localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');
    const isDemo = (() => { try { const s = JSON.parse(session||'{}'); return !!s?.demo; } catch { return false; } })();
    if(!token && !isDemo){
      // THE PARITY BYTE AT THE GUARD (founder-ruled, this site named and approved).
      // The frozen sentence, byte-identical to its four siblings. THE BOUNCE IS
      // DELAYED ON PURPOSE, and this is the executor's disclosed choice rather than
      // a ruled one: window.location.replace is a HARD navigation, so a toast shown
      // in the same tick is destroyed before it paints. A sentence nobody can read
      // is not an honest sign-in, it is the silent bounce with extra code. The delay
      // is the shortest that lets the byte land.
      setBounceToast('Session expired. Please sign in again.');
      setTimeout(()=>{ window.location.replace('/'); }, 1600);
      return;
    }

    // ── Onboarding guard — if onboarding not complete, go to onboarding ───
    // Check via API so we always have fresh state, not just cached session.
    // Non-fatal: if fetch fails, proceed to Sanctuary normally.
    // F-07.70: `isDemo` is derived once at the guard above and reused here — it was
    // the same question asked twice off two separate reads of the same blob.
    if(token && !isDemo) {
      fetch('https://dream-os-production.up.railway.app/api/v2/couple/me',{
        headers:{'Authorization':`Bearer ${token}`},
      })
      .then(r=>r.json())
      .then(async d=>{
        const c = d?.couple as Record<string, unknown> | undefined;
        // ── ARC OB · OB-P · THE ONBOARDING GUARD MOVED OUT ──────────────────
        // What stood here read `onboarding_state !== 'complete'` and replaced
        // the location. It is now in app/(frost)/layout.tsx, MOVED not
        // duplicated (F-1): this copy ran only on Sanctuary, and it trusted the
        // MARKER, which every bride onboarded before CE-32's micro carries
        // falsely over a row with no name and no budget (R-OB.8 — a flow
        // position is not a fact). The layout reads the server-computed
        // predicate verdict and covers every frost canvas.
        if(!c) return;

        // ── F-05.38 — HEAL THE SESSION BLOB FROM SERVER TRUTH ───────────────
        // getWeddingDate/getEngagementDate/getBrideName (:38-40) read
        // couple_session from localStorage ONLY and fall through to demo
        // constants. F-05.29's cure restores the TOKEN from the cookie mirror
        // but nothing restores the BLOB, so an ITP-wiped bride was let in and
        // greeted as "Priya", counting down to a stranger's wedding.
        //
        // Pattern COPIED, not invented: pin-login/page.tsx:103-118 already
        // enriches the session from /couple/me at sign-in, and :20-28 is the
        // write shape reproduced below (both localStorage keys + the
        // tdw_couple_session cookie at SameSite=Lax — deliberately Lax, which
        // is the session cookie's own convention; _base.ts's token cookie uses
        // None and is a different cookie with a different job).
        //
        // WHY THE SECOND FETCH, disclosed as a charter deviation: the ruled
        // cure said restore from THIS existing bare fetch. The bare route
        // (me.js:100-106) does NOT select users(name) — only the param route
        // (me.js:18-56) returns bride_name. So the bare response alone heals
        // the countdown and leaves "Priya" on screen, which is the finding's
        // own headline and this micro's own P1 evidence. The second call is
        // therefore CONDITIONAL: it fires only when the blob has no name at
        // all, i.e. only on a wiped session. A normal load makes zero extra
        // requests and, per the equality check below, zero writes and zero
        // re-renders.
        //
        // DECLARED AND UNHEALABLE: engagement_date has NO home in
        // public.couples (witnessed schema, grep-zero), so getEngagementDate
        // keeps DEMO_ENGAGEMENT permanently. Named, not silently left.
        let existing: Record<string, unknown> = {};
        try {
          const raw = localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');
          if(raw) existing = JSON.parse(raw) as Record<string, unknown>;
        } catch { /* wiped or blocked — treat as empty */ }

        let brideName = (existing.user_name||existing.bride_name||existing.name||null) as string|null;
        if(!brideName && c.id){
          try {
            const r2 = await fetch(`https://dream-os-production.up.railway.app/api/v2/couple/me/${c.id as string}`,{
              headers:{'Authorization':`Bearer ${token}`},
            });
            const d2 = await r2.json();
            brideName = (d2?.couple?.bride_name as string|undefined) || null;
          } catch { /* non-fatal — the countdown still heals without it */ }
        }

        // Server value wins, existing survives, nothing invented (pin-login's
        // merge shape). Only fields me.js actually witnessed are written.
        const healed: Record<string, unknown> = { ...existing };
        const put = (k:string, v:unknown) => { if(v!==null && v!==undefined) healed[k]=v; };
        put('id',               c.id);
        put('wedding_date',     c.wedding_date);
        put('wedding_city',     c.wedding_city);
        put('partner_name',     c.partner_name);
        put('budget_total',     c.budget_total);
        put('onboarding_state', c.onboarding_state);
        put('planning_state',   c.planning_state);
        if(brideName) healed.bride_name = brideName;

        // IDEMPOTENCE BY CONSTRUCTION — P3's property, not a promise:
        // an unchanged blob writes nothing and re-renders nothing.
        const after = JSON.stringify(healed);
        if(JSON.stringify(existing) === after) return;

        try {
          localStorage.setItem('couple_web_session', after);
          localStorage.setItem('couple_session',     after);
        } catch { /* iOS storage blocked — the cookie covers it */ }
        try {
          document.cookie = `tdw_couple_session=${encodeURIComponent(after)}; max-age=${7*24*60*60}; path=/; SameSite=Lax; Secure`;
        } catch { /* ignore */ }

        // The three helpers already ran SYNCHRONOUSLY below this fetch, off the
        // wiped blob — so healing the blob alone would leave "Priya" on screen
        // until some other state change forced a render. Re-derive here, and
        // only here, now that the blob is true.
        const w2 = getWeddingDate(), e2 = getEngagementDate(), days2 = daysUntil(w2);
        setDays(days2); setProgress(arcProgress(days2)); setName(getBrideName());
        setProseLine(prose(days2)); setSinceYes(daysSince(e2));
      })
      .catch(()=>{/* non-fatal */});
    }

    if(!document.getElementById('sv5')){const s=document.createElement('style');s.id='sv5';s.textContent=CSS;document.head.appendChild(s);}
    const w=getWeddingDate(),e=getEngagementDate(),d=daysUntil(w);
    setDays(d);setProgress(arcProgress(d));setName(getBrideName());
    setProseLine(prose(d));setPoetry(getDailyPoetry());setSinceYes(daysSince(e));
    const now=new Date();
    setWeekday(now.toLocaleDateString('en-IN',{weekday:'long'})+' morning');
    const DOM=['','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth','Seventeenth','Eighteenth','Nineteenth','Twentieth','Twenty-First','Twenty-Second','Twenty-Third','Twenty-Fourth','Twenty-Fifth','Twenty-Sixth','Twenty-Seventh','Twenty-Eighth','Twenty-Ninth','Thirtieth','Thirty-First'];
    setDateStamp(`${DOM[now.getDate()]||now.getDate()} of ${now.toLocaleDateString('en-IN',{month:'long'})} · ${now.getFullYear()}`);

    // ── Auto dark/light by time of day — RETIRED BY FOUNDER RULING ─────────
    // SINGLE THEME (2026-08-07, the chair's own hand): Wine Night always; the
    // clock died with the choice. Left alive it would setHomeMode('E3') by day
    // and flip `dark` false against tokens now pinned WINE at getV2Tokens — a
    // mixed-theme render. Mechanism named per F-06.85: getFrostMode() is the
    // pin; this block returns only if a second theme returns by ruling.

    // ── Live hints fetch ──────────────────────────────────────────────────
    const hintsToken = getAccessToken();
    const coupleId = getCoupleIdForFrost();
    const API = 'https://dream-os-production.up.railway.app';
    if(coupleId && hintsToken) {
      // Circle + people hints
      fetch(`${API}/api/v2/couple/circle/${coupleId}`,{headers:{Authorization:`Bearer ${hintsToken}`}})
        .then(r=>r.json()).then(d=>{
          const members = d?.members||[];
          const pending = d?.pending_invites||[];
          const activity = d?.activity||[];
          // Circle hint — last activity
          if(activity.length>0){
            const last = activity[0];
            const name = last.member_name||'Someone';
            const ago = last.created_at ? timeAgoShort(last.created_at) : '';
            const type = last.activity_type==='save_added'?'added a save':last.activity_type==='comment'?'left a comment':'was active';
            setCircleHint(`${name} ${type}${ago?' · '+ago:''}`);
          } else {
            setCircleHint('quiet');
          }
          // People hint
          const activeCount = members.filter((m:any)=>m.status==='active').length;
          const pendingCount = pending.length;
          if(activeCount>0||pendingCount>0){
            const parts=[];
            if(activeCount>0) parts.push(`${activeCount} active`);
            if(pendingCount>0) parts.push(`${pendingCount} invited`);
            setPeopleHint(parts.join(' · '));
          }
        }).catch(()=>{});

      // Muse hint
      fetch(`${API}/api/v2/couple/muse/${coupleId}?limit=1`,{headers:{Authorization:`Bearer ${hintsToken}`}})
        .then(r=>r.json()).then(d=>{
          const total = d?.total||0;
          if(total>0) setMuseHint(`${total} saved`);
        }).catch(()=>{});

      // Pages hint
      fetch(`${API}/api/v2/couple/pages/${coupleId}/preview`,{headers:{Authorization:`Bearer ${hintsToken}`}})
        .then(r=>r.json()).then(d=>{
          if(d?.preview) setPagesHint(d.preview + '…');
          else setPagesHint('a page is waiting');
        }).catch(()=>{});

      // Events hint
      fetch(`${API}/api/v2/couple/events/${coupleId}?state=upcoming`,{headers:{Authorization:`Bearer ${hintsToken}`}})
        .then(r=>r.json()).then(d=>{
          const evs = d?.events||[];
          if(evs.length>0) setEventsHint(`${evs.length} day${evs.length!==1?'s':''} ahead`);
          else setEventsHint('Your timeline');
        }).catch(()=>{});

      // Expenses + Vendors hint — single bookings fetch feeds both
      fetch(`${API}/api/v2/couple/bookings/${coupleId}`,{headers:{Authorization:`Bearer ${hintsToken}`}})
        .then(r=>r.json()).then(d=>{
          const books = d?.bookings||[];
          const paid = books.reduce((s:number,b:any)=>s+(b.amount_paid||0),0);
          if(paid>0){
            // TDW_07 P4b · F-07.16 — a THIRD local formatter this screen carried, found by
            // the register cell rather than by the executor's enumeration. Same register,
            // same donor. Three copies of one rule is exactly why the rule now has a home.
            const fmt = formatRs(paid);
            setExpensesHint(`${fmt} logged`);
          }
          if(books.length>0) setVendorsHint(`${books.length} confirmed`);
        }).catch(()=>{});
    }
  },[]);

function timeAgoShort(iso:string):string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff/60000);
  if(m<1)  return 'just now';
  if(m<60) return `${m}m ago`;
  const h = Math.floor(m/60);
  if(h<24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}

  // Scroll dream to bottom
  useEffect(()=>{ if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight; },[msgs]);
  useEffect(()=>{ if(!textRef.current)return;textRef.current.style.height='auto';textRef.current.style.height=Math.min(textRef.current.scrollHeight,120)+'px'; },[input]);
  useEffect(()=>()=>{cancelRef.current?.();},[]);

  // ╔══════════════════════════════════════════════════════════════════════════╗
  // ║  CHOREOGRAPHY — FROZEN (F-1)                                             ║
  // ╚══════════════════════════════════════════════════════════════════════════╝
  // Everything from here to the FREEZE ENDS marker is the bloom's open/close
  // motion. F-1 makes it sacred: it survives the extraction BYTE-IDENTICAL, and
  // any diff inside this fence in a later commit is a failed session unless a
  // chair lifts the freeze by name.
  //
  // It is frozen NOW rather than before the extraction because D-3 is what gave
  // it one shape worth freezing. Until then the close duration lived as a bare
  // 300 in three unconnected places (F-13.5) and the open triad was written twice
  // (F-13.6). A header over THAT shape would have made the fork permanent by law,
  // because the diff that fixed it would itself have been the failed session.
  // Cure first, fence second — always, and this fence is the reason why.
  //
  // FENCED: openRoom · closeRoom · BLOOM_CLOSE_MS's readers · the swipe-to-close
  // handlers · the popstate sentinel trap · the bloom-enter/bloom-exit class swap.
  // NOT FENCED: the rooms, which moved to components/frost/blooms/ in this same
  // delivery and carry no choreography of their own.
  // ── Bloom open / close ────────────────────────────────────────────────────
  const openRoom = useCallback((key:RoomKey)=>{
    setActiveRoom(key);
    setBlooming(true);
    setClosing(false);
  },[]);

  const closeRoom = useCallback(()=>{
    setClosing(true);
    setTimeout(()=>{
      setActiveRoom(null);
      setBlooming(false);
      setClosing(false);
    },BLOOM_CLOSE_MS);
  },[]);

  // TDW_13 · D-2 · THE GATE'S RE-ARM (R-30.36 — "fires every open").
  //
  // It clears on LEAVE, not on enter, and the difference is the whole cure.
  // Clearing on enter means the first render after activeRoom becomes 'discover'
  // still carries last visit's `true`, so the feed paints one ungated frame
  // before the effect corrects it — the same one-frame class as the E3 flash the
  // founder caught in layout.tsx. Clearing on exit leaves the flag already false
  // long before she can open the room again, so there is no frame to catch.
  //
  // It also hangs off `activeRoom` and nothing else. This room has TWO close
  // paths (closeRoom and the popstate back-trap) and a swipe handler above them;
  // re-arming inside any of those would be a third hand-synchronized site in a
  // file that already owes F-13.5 for the first two.
  useEffect(()=>{ if(activeRoom!=='discover') setBetaGateAcked(false); },[activeRoom]);

  // ── Listen for frost:open-dream — fired by Events "Ask DreamAi" button ────
  // Opens the Dream bloom and prefills the input with the suggested prompt.
  // ── Listen for frost:open-dream — fired by Events "Ask DreamAi" button ────
  // Opens the Dream bloom and prefills the input with the suggested prompt.
  //
  // F-13.6's cure. This listener used to set activeRoom, blooming and closing
  // itself — openRoom's exact three lines, copied. It was a SECOND open path,
  // and the extraction is about to move openRoom into the conductor: the rail's
  // call site would have travelled and this one would have stayed behind, still
  // driving state the conductor now owns, from a room that no longer knows it
  // exists. It calls openRoom now, so there is one way into a bloom.
  //
  // openRoom is in the dep array because it is the dependency, and it is stable
  // (useCallback with an empty list), so the listener still binds once.
  useEffect(()=>{
    const onOpenDream = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      const prompt = detail?.prompt;
      openRoom('dream');
      if(prompt && typeof prompt === 'string') {
        setInput(prompt);
      }
    };
    window.addEventListener('frost:open-dream', onOpenDream);
    return ()=>{ window.removeEventListener('frost:open-dream', onOpenDream); };
  },[openRoom]);

  // ── Back button trap (Android + iOS PWA) ─────────────────────────────────
  // Strategy: push a sentinel history entry on mount.
  // When popstate fires (back button): push another sentinel (stay on page)
  // AND close any open room. Two back presses = room closes then nothing.
  // The user can only leave via the task switcher — never via back.
  const activeRoomRef = React.useRef<RoomKey>(null);
  useEffect(()=>{ activeRoomRef.current = activeRoom; },[activeRoom]);

  useEffect(()=>{
    // Push TWO sentinels on mount — need to pop both before leaving
    // Using location.hash approach: browser stays on same URL, popstate fires reliably
    const url = window.location.pathname + window.location.search;
    window.history.pushState({tdw:'s',n:1}, '', url);
    window.history.pushState({tdw:'s',n:2}, '', url);

    const onPop = (e: PopStateEvent) => {
      // Always push a fresh sentinel to trap the back press
      window.history.pushState({tdw:'s',n:Date.now()}, '', url);
      // Close room if open
      if(activeRoomRef.current !== null){
        setClosing(true);
        setTimeout(()=>{ setActiveRoom(null); setBlooming(false); setClosing(false); },BLOOM_CLOSE_MS);
      }
    };

    window.addEventListener('popstate', onPop);
    return ()=>{ window.removeEventListener('popstate', onPop); };
  },[]);

  // ╔══════════════════════════════════════════════════════════════════════════╗
  // ║  FREEZE ENDS (F-1)                                                       ║
  // ╚══════════════════════════════════════════════════════════════════════════╝
  // Swipe down to close
  const touchStartX = useRef(0);
  const onTouchStart = useCallback((e:React.TouchEvent)=>{
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  },[]);
  const onTouchEnd = useCallback((e:React.TouchEvent)=>{
    // Discover owns its own swipe gestures — never dismiss via swipe-down.
    // Back via top bar ← or native OS back gesture (popstate).
    if(activeRoom === 'discover') return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const dx = Math.abs(e.changedTouches[0].clientX - touchStartX.current);
    // Only close if: clearly vertical (not horizontal), dragged down 120px+,
    // AND started in the top 100px pull-zone OR from a non-scrollable surface
    if(dy > 120 && dx < 60) {
      const target = e.target as HTMLElement;
      let node: HTMLElement | null = target;
      let inScrollable = false;
      const bloom = bloomRef.current;
      while(node && bloom && node !== bloom) {
        const s = window.getComputedStyle(node);
        if(s.overflowY === 'auto' || s.overflowY === 'scroll') {
          if(node.scrollTop > 4) { inScrollable = true; break; }
        }
        node = node.parentElement;
      }
      if(!inScrollable) closeRoom();
    }
  },[closeRoom, activeRoom]);

  // ── Dream Ai send ─────────────────────────────────────────────────────────
  const sendDream = useCallback((text:string)=>{
    const msg=text.trim();
    if(!msg||loading)return;
    setInput('');
    setMsgs(prev=>[...prev,{id:uid(),role:'user',content:msg}]);
    setLoading(true);
    const aiId=uid();
    setMsgs(prev=>[...prev,{id:aiId,role:'assistant',content:'',pending:true}]);
    const cancel=streamBrideChat(msg,
      (delta)=>setMsgs(prev=>prev.map(m=>m.id===aiId?{...m,content:m.content+delta,pending:false}:m)),
      ()=>{setMsgs(prev=>prev.map(m=>m.id===aiId?{...m,pending:false}:m));setLoading(false);cancelRef.current=null;},
      (err)=>{console.error(err);setMsgs(prev=>prev.map(m=>m.id===aiId?{...m,content:'Something went wrong. Try again.',error:true,pending:false}:m));setLoading(false);cancelRef.current=null;}
    );
    cancelRef.current=cancel;
  },[loading]);

  // ── Tokens ────────────────────────────────────────────────────────────────
  const bg = dark
    ? `radial-gradient(ellipse 110% 60% at 50% -8%,rgba(196,133,106,.18) 0%,transparent 58%),radial-gradient(ellipse 70% 50% at 85% 108%,rgba(55,10,20,.55) 0%,transparent 55%),linear-gradient(180deg,#14080C 0%,#100608 55%,#0C0405 100%)`
    : `radial-gradient(ellipse 110% 60% at 50% -8%,rgba(168,196,216,.32) 0%,transparent 58%),radial-gradient(ellipse 70% 50% at 85% 108%,rgba(170,160,145,.14) 0%,transparent 55%),linear-gradient(180deg,#F0EEE8 0%,#E8E5DE 55%,#DDD9D0 100%)`;

  const accent    = dark ? '#C4856A' : '#2A5F82';
  const signal    = dark ? '#6B9E8F' : '#8B6E52';
  const ink       = dark ? '#F5E5DC' : '#0A1628';
  const inkSoft   = dark ? 'rgba(245,229,220,.85)' : 'rgba(10,22,40,1.0)';
  const inkMute   = dark ? 'rgba(196,133,106,.42)'  : 'rgba(10,22,40,.60)';
  const line      = dark ? 'rgba(196,133,106,.10)'  : 'rgba(42,95,130,.14)';
  const lineStr   = dark ? 'rgba(196,133,106,.18)'  : 'rgba(42,95,130,.22)';
  const pillBg    = dark ? 'rgba(20,8,12,.55)'      : 'rgba(240,238,232,.75)';
  const pillBdr   = dark ? 'rgba(196,133,106,.30)'  : 'rgba(42,95,130,.35)';
  const pillTxt   = dark ? 'rgba(245,229,220,.85)'  : 'rgba(10,22,40,.85)';
  const topBandBg = dark ? 'rgba(20,8,12,.62)'      : 'rgba(240,238,232,.68)';
  // Bottom dark panel — covers slice zone, makes text legible
  // Comes higher now so Dream Ai row is always in the dark zone
  const botPanelBg= dark ? 'rgba(12,4,5,.50)'       : 'rgba(8,6,10,.82)';
  const sliceTxt  = dark ? '#F5E5DC'                 : '#FFFFFF';
  const hintTxt   = dark ? 'rgba(196,133,106,.55)'  : 'rgba(255,255,255,.55)';
  const ghostColor= dark ? '#3A0C18'                 : '#7AAAC8';
  const ghostOp   = dark ? 0.92                      : 0.70;

  // Room backgrounds — match the mode. Same house, different rooms.
  // Exception: Discover + Muse + Moments = always dark (photo galleries)
  const isPhotoRoom = activeRoom==='discover'||activeRoom==='muse'||activeRoom==='moments';

  const roomTopBg = isPhotoRoom
    ? 'rgba(8,6,10,.92)'
    : dark ? 'rgba(18,6,10,.88)' : 'rgba(238,240,246,.88)';

  const roomBg = isPhotoRoom
    ? 'linear-gradient(180deg,#080608 0%,#040406 100%)'
    : dark
      ? 'radial-gradient(ellipse 110% 55% at 50% -5%,rgba(196,133,106,.18) 0%,transparent 52%),radial-gradient(ellipse 70% 60% at 90% 110%,rgba(40,5,12,.80) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 5% 100%,rgba(60,8,20,.70) 0%,transparent 50%),linear-gradient(180deg,#1A0A0E 0%,#0E0506 40%,#080204 70%,#0C0408 100%)'
      : 'radial-gradient(ellipse 110% 50% at 60% -5%,rgba(74,122,155,.24) 0%,transparent 55%),radial-gradient(ellipse 70% 50% at 10% 110%,rgba(42,95,130,.16) 0%,transparent 55%),linear-gradient(160deg,#EEF0F6 0%,#E4E8F2 30%,#D8DEEC 60%,#CDD4E8 100%)'; // slate-tinted bone frosted

  const roomInk     = isPhotoRoom ? '#F0EDE8' : (dark ? '#F5E5DC' : '#0D1E35');
  const roomInkSoft = isPhotoRoom ? 'rgba(240,237,232,.70)' : (dark ? 'rgba(245,229,220,.78)' : 'rgba(13,30,53,.80)');
  const roomInkMute = isPhotoRoom ? 'rgba(200,180,160,.40)' : (dark ? 'rgba(196,133,106,.48)' : 'rgba(42,95,130,.55)');
  const roomLine    = isPhotoRoom ? 'rgba(196,133,106,.16)' : (dark ? 'rgba(196,133,106,.14)' : 'rgba(42,95,130,.16)');
  const aiBubbleBg  = dark ? 'rgba(196,133,106,.08)'  : 'rgba(42,95,130,.06)';
  const aiBubbleBdr = dark ? 'rgba(196,133,106,.18)'  : 'rgba(42,95,130,.16)';
  const composeBg   = dark ? 'rgba(12,4,5,.90)'       : 'rgba(240,238,232,.90)';
  const inputBg     = dark ? 'rgba(196,133,106,.06)'  : 'rgba(42,95,130,.05)';
  const inputBdr    = dark ? 'rgba(196,133,106,.22)'  : 'rgba(42,95,130,.20)';
  const chipBg      = dark ? 'rgba(196,133,106,.06)'  : 'rgba(42,95,130,.05)';
  const chipBdr     = dark ? 'rgba(196,133,106,.20)'  : 'rgba(42,95,130,.18)';

  // F-09.166: guarded BY HAND, because tsc cannot guard it — tsconfig.json:13 sets
  // "strict": false, so `number|null` flows into `arcPoint(t:number)` with zero
  // complaint and `1-null` quietly evaluates to 1. A green tsc is NOT a null-safety
  // witness in this repo, and the parity bench asserts the guard instead.
  const dot = progress===null ? null : arcPoint(progress);

  // ── SANCTUARY ─────────────────────────────────────────────────────────────
  return (
    <div style={{position:'fixed',inset:0,background:bg,display:'flex',flexDirection:'column',overflow:'hidden',userSelect:'none',WebkitUserSelect:'none' as any}}>

      {/* Grain */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,backgroundSize:'160px',opacity:dark?.45:.22}}/>

      {/* ── THE GHOST NUMERAL IS RETIRED (TDW_09 atelier, founder-approved Gate 1) ──
          This rendered {days} at 320px, blurred 8px, behind a hero that rendered the
          SAME {days} at 48px sharp. The same digits in two competing voices, and the
          reason the masthead had no dominant element. The countdown now speaks once,
          at type/numeral, in the hero below. `ghostColor` and `ghostOp` retire with
          it; the `gn-a` keyframe retires from CSS at its own site. */}

      {/* Upper frost band */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:120,background:topBandBg,backdropFilter:'blur(22px) saturate(1.1)',WebkitBackdropFilter:'blur(22px) saturate(1.1)',WebkitMaskImage:'linear-gradient(180deg,#000 55%,transparent 100%)',maskImage:'linear-gradient(180deg,#000 55%,transparent 100%)',pointerEvents:'none',zIndex:2}}/>

      {/* Bottom dark panel — raised higher so ALL slices are in dark zone */}
      <div style={{position:'absolute',top:'38%',left:0,right:0,bottom:0,background:botPanelBg,backdropFilter:'blur(20px) saturate(1.2)',WebkitBackdropFilter:'blur(20px) saturate(1.2)',WebkitMaskImage:'linear-gradient(180deg,transparent 0%,rgba(0,0,0,.7) 10%,#000 20%)',maskImage:'linear-gradient(180deg,transparent 0%,rgba(0,0,0,.7) 10%,#000 20%)',pointerEvents:'none',zIndex:4,transition:`top 480ms ${EASE}`}}/>

      {/* Arc */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:108,zIndex:6,pointerEvents:'none'}}>
        <svg viewBox="0 0 320 108" preserveAspectRatio="none" style={{width:'100%',height:'100%',overflow:'visible'}}>
          <path d="M 18 92 Q 160 4 302 92" stroke={dark?'rgba(196,133,106,.14)':'rgba(42,95,130,.20)'} strokeWidth="1" fill="none"/>
          {/* The rail arc above is UNCONDITIONAL — it is the track, and the track is
              always true. The travelled arc and its dot are the bride's POSITION,
              which is unknown until the effect lands, so they render only when it
              is known. Absence, not a guess at .38. */}
          {progress!==null&&dot&&<>
            <path d={arcPathTo(progress)} stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <circle cx={dot.x} cy={dot.y} r="18" fill="none" stroke={accent} strokeWidth=".5" className="do-a"/>
            <circle cx={dot.x} cy={dot.y} r="10" fill="none" stroke={accent} strokeWidth=".8" className="dh-a"/>
            <circle cx={dot.x} cy={dot.y} r="4.5" fill={accent} className="dc-a"/>
          </>}
          {/* I WILL — left endpoint label, sits below arc line */}
          <text x="18" y="107" textAnchor="start"
            fontFamily="'JetBrains Mono',monospace" fontSize="7.5" letterSpacing="2.5"
            fill={dark?'rgba(196,133,106,.45)':'rgba(42,80,130,.50)'}>I WILL</text>
          {/* I DO — right endpoint label, sits below arc line */}
          <text x="302" y="107" textAnchor="end"
            fontFamily="'JetBrains Mono',monospace" fontSize="7.5" letterSpacing="2.5"
            fill={dark?'rgba(196,133,106,.45)':'rgba(42,80,130,.50)'}>I DO</text>
        </svg>
      </div>

      {/* I WILL / I DO — rendered inside SVG below */}

      {/* Date stamp — floats top-right above the arc */}
      <div style={{position:'absolute',top:`calc(env(safe-area-inset-top,0px) + 8px)`,right:18,zIndex:9,pointerEvents:'none'}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',color:inkMute}}>{romanDate()}</span>
      </div>

      {/* Hero — top padding clears the arc (108px) + safe area */}
      {/* ── THE MASTHEAD, RECOMPOSED (TDW_09 atelier · Fork 3 arm A, founder-approved) ──
          NINE RUNS BECOME FOUR. What was here: weekday · greeting · rule · numeral ·
          unit · prose · dateStamp · since-yes · poetry — four families, six sizes, no
          dominant element. What is here now, in the mock's order:
            1. the numeral at FT.numeral, with its unit beneath   (the one loud voice)
            2. the greeting at FT.greeting
            3. the lead prose at FT.lead
            4. the signal line at FT.engravedSm
          NOTHING IS DELETED, and the two folds are named:
            · `weekday` folds into the signal line's tail — same value, one fewer run.
            · `dateStamp` folds out: it renders TODAY'S DATE, which `romanDate()` already
              carries top-right at :4471. Two elements, one fact; the roman one is drawn
              in the approved mock and this one is not.
          THE POETRY LINE: the approved masthead does not draw it — arm (c) of the
          read-first's veto slot, ruled by 「 the poetry pool AS DRAWN 」. FROST_COPY.idlePool
          is UNTOUCHED per that arm, which leaves it reader-less; filed F-09.164 rather
          than deleted, because deleting a founder-written pool is not a redesign's call.
          `getDailyPoetry()` and the `poetry` state stay wired to nothing by the same
          reasoning and travel in that finding. */}
      <div style={{position:'relative',zIndex:5,padding:`calc(env(safe-area-inset-top,0px) + 112px) ${FS.gutter}px ${FS.s2}px`,flexShrink:0}}>
        {/* minHeight reserves the numeral's line box so the empty first frame does
            not shift the rail beneath it — F-09.111–.113's reserved-height primitive
            is the estate precedent for this exact shape. */}
        <div className="num-a" style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontStyle:'normal',fontSize:FT.numeral,lineHeight:.78,letterSpacing:'-.055em',color:accent,fontFeatureSettings:'"opsz" 144',marginLeft:-6,minHeight:Math.round(FT.numeral*0.78)}}>{days}</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:FT.engraved,letterSpacing:FS.track,textTransform:'uppercase' as any,color:inkMute,marginTop:FS.s1}}>mornings to I do</div>
        <div style={{fontFamily:"'Italianno',cursive",fontSize:FT.greeting,lineHeight:.9,letterSpacing:'-.01em',color:ink,marginTop:FS.s3}}>
          {name===null?'\u00A0':<>Hello, <span style={{color:accent}}>{name}</span>.</>}
        </div>
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.lead,lineHeight:1.5,color:inkSoft,marginTop:FS.s2,maxWidth:'30ch',fontFeatureSettings:'"opsz" 9'}}>
          {proseLine.split(/(I will|I do)/g).map((p,i)=>p==='I will'||p==='I do'?<span key={i} style={{color:accent,fontWeight:400}}>{p}</span>:<span key={i}>{p}</span>)}
        </div>
        {sinceYes>0&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:FT.engravedSm,letterSpacing:FS.track,textTransform:'uppercase' as any,color:signal,marginTop:FS.s2}}>↑ {sinceYes} days since you said yes <span style={{color:inkMute}}>· {weekday}</span></div>}
      </div>

      {/* Slices — dynamic hints */}
      {(()=>{
        const hintMap:{[k:string]:string}={
          dream:'Tell me anything.',
          circle:circleHint,
          muse:museHint||'Your board',
          discover:'Your curated world',
          people:peopleHint||'Your circle',
          pages:pagesHint,
          moments:'Your story, in photos',
          events:eventsHint,
          expenses:expensesHint||'Track your spend',
          vendors:vendorsHint||'Your team',
          meridian:'Skin · mind · body',
          settings:'Your wedding, your way',
        };
        return(
        <div style={{position:'relative',zIndex:5,flex:1,display:'flex',flexDirection:'column',borderTop:`.5px solid ${lineStr}`,overflow:'hidden',minHeight:0}}>
          {BASE_SLICES.map((slice,idx)=>(
            <div key={slice.key} {...press(`slice:${slice.key}`)} onClick={()=>openRoom(slice.key)} className="si-a"
              style={{flex:1,minHeight:0,display:'flex',alignItems:'center',padding:`0 ${FS.gutter}px`,gap:FS.s1,borderBottom:`.5px solid ${line}`,cursor:'pointer',WebkitTapHighlightColor:'transparent',touchAction:'manipulation',background:'transparent',animationDelay:`${idx*16}ms`,...pressed(`slice:${slice.key}`)}}>
              {/* TDW_09 atelier · Fork 2 arm A: the rail RETYPES IN PLACE. Eleven rows,
                  same order, same flex:1 distribution, same doorways — only the label
                  rung, the hint tracking and the gutter move. Content-driven heights
                  were the other arm and were REFUSED: at eleven rows the rail would
                  scroll, and that is a behaviour change (L4). */}
              <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.room,lineHeight:1,flexShrink:0,color:sliceTxt,fontFeatureSettings:'"opsz" 9'}}>{slice.label}</span>
              {slice.candle&&<span className="cf-a" style={{width:5,height:5,borderRadius:'50%',background:signal,boxShadow:`0 0 7px ${signal}`,flexShrink:0}}/>}
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:hintTxt,marginLeft:'auto',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:160}}>{hintMap[slice.key as string]||''}</span>
              {(slice.key==='discover'||slice.key==='meridian')&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:hintTxt,flexShrink:0}}>→</span>}
            </div>
          ))}
        </div>
        );
      })()}

      {/* Dream Ai — bottom anchor slice. Smaller, centered, italicised. Opens in-app Dream bloom. */}
      <div onClick={()=>openRoom('dream')} {...press('slice:dream')}
        style={{position:'relative',zIndex:5,flexShrink:0,borderTop:`.5px solid ${lineStr}`,
          display:'flex',alignItems:'center',justifyContent:'center',
          padding:'12px 18px',paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 12px)',
          cursor:'pointer',WebkitTapHighlightColor:'transparent',touchAction:'manipulation',
          ...pressed('slice:dream')}}>
        <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,lineHeight:1,color:accent,fontFeatureSettings:'"opsz" 9',letterSpacing:'.01em'}}>
          Dream Ai
        </span>
      </div>

      {/* ════════════════════════════════════════════════════════
          BLOOM LAYER — renders ON TOP of Sanctuary
          Every room blooms up from the bottom, covering Sanctuary.
          Swipe down or tap ← to close.
          ════════════════════════════════════════════════════════ */}
      {activeRoom && (
        <div
          className={closing ? 'bloom-exit' : 'bloom-enter'}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          ref={bloomRef}
          style={{position:'absolute',inset:0,zIndex:100,display:'flex',flexDirection:'column',background:roomBg,overflow:'hidden'}}
        >
          {/* Room top bar */}
          <div style={{position:'relative',zIndex:10,background:roomTopBg,backdropFilter:'blur(22px) saturate(1.1)',WebkitBackdropFilter:'blur(22px) saturate(1.1)',borderBottom:`0.5px solid ${roomLine}`,paddingTop:'calc(env(safe-area-inset-top,0px) + 12px)',paddingBottom:12,paddingLeft:18,paddingRight:18,display:'flex',alignItems:'center',flexShrink:0}}>
            <button onClick={closeRoom} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,padding:0,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:roomInkMute}}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Sanctuary
            </button>
            <div style={{flex:1,textAlign:'center',fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.room,color:accent,fontFeatureSettings:'"opsz" 9'}}>
              {(()=>{
                const labels:{[k:string]:string}={expenses:'Expenses',vendors:'Vendors',settings:'Settings'};
                if(activeRoom&&labels[activeRoom]) return labels[activeRoom];
                return BASE_SLICES.find(s=>s.key===activeRoom)?.label||'';
              })()}
            </div>
            {activeRoom==='dream'&&<button onClick={()=>{cancelRef.current?.();setMsgs([]);setLoading(false);}} style={{background:'none',border:'none',cursor:'pointer',padding:0,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:roomInkMute}}>Clear</button>}
            {activeRoom!=='dream'&&<div style={{width:40}}/>}
          </div>

          {/* Room content */}
          <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',position:'relative'}}>
            {/* Bottom vignette — cinematic framing both modes */}
            {activeRoom!=='discover'&&activeRoom!=='muse'&&activeRoom!=='moments'&&(
              <div style={{position:'absolute',bottom:0,left:0,right:0,height:80,
                background:dark
                  ?'linear-gradient(transparent,rgba(12,4,5,.65))'
                  :'linear-gradient(transparent,rgba(8,10,18,.45))',
                pointerEvents:'none',zIndex:5}}/>
            )}

            {/* ── DREAM AI ── */}
            {activeRoom==='dream'&&<>
              <div ref={scrollRef} className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any,padding:`20px ${FS.gutter}px`}}>
                {msgs.length===0?(
                  <div style={{display:'flex',flexDirection:'column',gap:24,paddingTop:8}}>
                    <div>
                      <div style={{fontFamily:"'Italianno',cursive",fontSize:52,lineHeight:.95,color:roomInk,marginBottom:8}}>Tell me what's<br/>on your mind.</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:roomInkSoft,lineHeight:1.65,fontFeatureSettings:'"opsz" 9'}}>I know your timeline, vendors,<br/>Muse board, and Circle.</div>
                    </div>
                    <div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:roomInkMute,marginBottom:12}}>Try asking</div>
                      <div style={{display:'flex',flexDirection:'column',gap:8}}>
                        {DREAM_PROMPTS.map(p=>(
                          <button key={p} onClick={()=>sendDream(p)} style={{textAlign:'left',background:chipBg,border:`0.5px solid ${chipBdr}`,borderRadius:8,padding:'12px 14px',fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:roomInk,cursor:'pointer',fontFeatureSettings:'"opsz" 9'}}>"{p}"</button>
                        ))}
                      </div>
                    </div>
                  </div>
                ):(
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {msgs.map(m=>(
                      <div key={m.id} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                        {m.role==='user'?(
                          <div style={{maxWidth:'82%',background:accent,color:dark?'#1A0810':'#FFFFFF',padding:'10px 14px',borderRadius:'20px 20px 4px 20px',fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,lineHeight:1.55,fontFeatureSettings:'"opsz" 9',userSelect:'text' as any}}>{m.content}</div>
                        ):m.pending&&m.content===''?(
                          <div style={{background:aiBubbleBg,border:`0.5px solid ${aiBubbleBdr}`,padding:'10px 16px',borderRadius:'20px 20px 20px 4px',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)'}}>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:accent,animation:'dpulse 1.4s infinite ease-in-out'}}>✦ thinking</span>
                            {/* F-13.4's cure. A second, byte-identical dpulse keyframe stood
                                here inline. The CSS const already carries it and is appended to
                                document.head as #sv5 on mount, unconditionally, so this copy was
                                never doing work — it was only waiting for the extraction to carry
                                it into a bloom file and leave the OTHER consumer (the deck's rail
                                mark) reading the copy that stayed behind. Two homes, one
                                animation, and the first hand to tune either one forks them.
                                NOTE: this comment deliberately does not spell the keyframe's
                                at-rule, because the bench counts that token and the estate's
                                shared stripper leaks comments on this file (see the D-3
                                handover). A cell that can be fooled by prose about itself is
                                not a cell. */}
                          </div>
                        ):(
                          <div style={{maxWidth:'90%',background:aiBubbleBg,border:`0.5px solid ${aiBubbleBdr}`,padding:'12px 16px',borderRadius:'20px 20px 20px 4px',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,lineHeight:1.65,color:m.error?'#C4534A':roomInk,whiteSpace:'pre-wrap',fontFeatureSettings:'"opsz" 9',userSelect:'text' as any}}>
                            {m.content}
                            {m.pending&&<span className="d-cursor" style={{opacity:.5,color:accent}}>▌</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Compose */}
              <div style={{background:composeBg,backdropFilter:'blur(22px) saturate(1.1)',WebkitBackdropFilter:'blur(22px) saturate(1.1)',borderTop:`0.5px solid ${roomLine}`,padding:`12px 18px calc(12px + env(safe-area-inset-bottom,0px))`,flexShrink:0}}>
                <div style={{display:'flex',gap:10,alignItems:'flex-end',background:inputBg,border:`0.5px solid ${inputBdr}`,borderRadius:20,padding:'8px 10px 8px 16px'}}>
                  <textarea ref={textRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendDream(input);}}} placeholder="Tell DreamAi anything…" disabled={loading} rows={1}
                    style={{flex:1,background:'transparent',border:'none',outline:'none',color:roomInk,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,resize:'none',maxHeight:120,lineHeight:1.5,fontFeatureSettings:'"opsz" 9',userSelect:'text',WebkitUserSelect:'text' as any}}/>
                  <button onClick={()=>sendDream(input)} disabled={loading||!input.trim()}
                    style={{background:input.trim()&&!loading?accent:'rgba(128,128,128,.12)',color:input.trim()&&!loading?(dark?'#1A0810':'#FFFFFF'):roomInkMute,border:'none',borderRadius:'50%',width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',cursor:input.trim()&&!loading?'pointer':'default',transition:`background 200ms ${EASE}`,flexShrink:0}}>
                    <Send size={14} strokeWidth={1.5}/>
                  </button>
                </div>
              </div>
            </>}

            {/* ── EVENTS — timeline grouped by date ── */}
            {activeRoom==='events'&&(
              <EventsRoom
                dark={dark} accent={accent} signal={signal}
                roomInk={roomInk} roomInkSoft={roomInkSoft} roomInkMute={roomInkMute} roomLine={roomLine}
              />
            )}

            {/* ── DISCOVER — cinematic full-bleed feed, behind the beta gate ── */}
            {activeRoom==='discover'&&(betaGateAcked
              ? <DiscoverRoom dark={dark} accent={accent} signal={signal}/>
              : <BetaGate onAck={()=>setBetaGateAcked(true)}/>
            )}

            {/* ── MUSE — masonry board, always dark ── */}
            {activeRoom==='muse'&&(
              <MuseRoom dark={dark} accent={accent}/>
            )}

            {/* ── CIRCLE — activity feed + invite ── */}
            {activeRoom==='circle'&&(
              <CircleRoom
                dark={dark} accent={accent} signal={signal}
                roomInk={roomInk} roomInkSoft={roomInkSoft} roomInkMute={roomInkMute} roomLine={roomLine}
              />
            )}

            {/* ── PAGES — diary with feeling picker ── */}
            {activeRoom==='pages'&&(
              <PagesRoom
                dark={dark} accent={accent} signal={signal}
                roomInk={roomInk} roomInkSoft={roomInkSoft} roomInkMute={roomInkMute} roomLine={roomLine}
              />
            )}

            {/* ── PEOPLE ── */}
            {activeRoom==='people'&&(
              <PeopleRoom dark={dark} accent={accent} signal={signal}/>
            )}

            {/* ── MOMENTS — personal photo diary ── */}
            {activeRoom==='moments'&&(
              <MomentsRoom dark={dark} accent={accent}/>
            )}

            {/* ── MERIDIAN — personal concierge ── */}
            {activeRoom==='meridian'&&(
              <MeridianRoom dark={dark} accent={accent}/>
            )}

            {/* ── EXPENSES — already built ── */}
            {activeRoom==='expenses'&&(
              <ExpensesRoom dark={dark} accent={accent} signal={signal}/>
            )}

            {/* ── VENDORS — already built ── */}
            {activeRoom==='vendors'&&(
              <VendorsRoom dark={dark} accent={accent}/>
            )}

            {/* ── SETTINGS — already built ── */}
            {activeRoom==='settings'&&(
              <SettingsRoom dark={dark} accent={accent} signal={signal}/>
            )}

            {/* ── OTHER ROOMS — coming soon ── */}
            {activeRoom!==null&&!['dream','pages','circle','events','muse','discover','expenses','vendors','settings','people','moments','meridian'].includes(activeRoom)&&(
              <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,padding:32}}>
                <div style={{fontFamily:"'Italianno',cursive",fontSize:52,color:accent,lineHeight:1}}>
                  {BASE_SLICES.find(s=>s.key===activeRoom)?.label||activeRoom}
                </div>
                <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:roomInkSoft,textAlign:'center',lineHeight:1.65,fontFeatureSettings:'"opsz" 9'}}>
                  Coming soon.<br/>Swipe down to return.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* F-07.70 · fork B2's frozen byte. Render shape copied from the MomentsRoom
          toast in this same file rather than invented, so the shell speaks in the
          room's own voice on the way out. */}
      {bounceToast&&<div style={{position:'fixed',top:'calc(env(safe-area-inset-top,0px)+16px)',left:'50%',transform:'translateX(-50%)',background:'rgba(240,237,232,.95)',color:'#080608',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,padding:'8px 18px',borderRadius:20,zIndex:900,pointerEvents:'none',whiteSpace:'nowrap'}}>{bounceToast}</div>}
    </div>
  );
}
