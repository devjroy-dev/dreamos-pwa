'use client';
// DiscoverRoom — the cinematic feed, its filter sheet, its vendor panel, and the beta gate.
//
// TDW_13 · D-5 · VERBATIM RELOCATION, the same law D-4 ran under. This body is
// byte-identical to the lines it occupied in sanctuary/page.tsx at 66ea400.
// Only the import mechanism changed. No token conversion, no hygiene, no
// feature — those are P3 and P5 and they do not ride a relocation commit (F-1).

import React, { useState, useRef, useEffect, useCallback } from 'react';
import EnquirySheet from '@/components/frost/EnquirySheet';
import { API_BASE, getCoupleSession, getAccessToken } from '@/lib/frost-api/_base';
import { vocabularyFor } from '@/lib/shared/tagVocabulary';
import { BUDGET_BANDS, bandLabelFor } from '@/lib/frost/budgetBands';
import { FT, FS, FI, getCoupleIdForFrost } from '@/lib/frost/tokens';
import { fetchDiscoverFeed, makeEnquireLink } from '@/lib/frost-api/discover';
import type { DiscoverVendor } from '@/lib/types/discover';
import { saveVendorToMuse } from '@/lib/frost-api/muse';
import VendorProfileView, { IgChip, FeaturedEyebrow } from '@/components/shared/VendorProfileView';
import ImageDots from '@/components/shared/ImageDots';
import { imgUrl, lqipUrl } from '@/lib/frost-api/img';
import {
  SWIPE_THRESHOLD, SWIPE_VELOCITY, TAP_MAX_MOVE, TAP_MAX_TIME, DOUBLE_TAP_MS,
  OVERLAY_DISMISS, haptic, usePhotoPager,
} from '@/lib/frost/photoPager';
import { waNumberFor } from '@/lib/waNumbers';
import { formatRs } from '@/lib/vendor/format';
import { usePress } from '@/components/frost/_shared/usePress';
import { coupleAccessToken } from '@/components/frost/_shared/coupleAccessToken';

// ── DISCOVER ROOM ──────────────────────────────────────────────────────────────
// Full-bleed cinematic feed.
// Swipe left  = next vendor
// Swipe right = prev vendor
// Single tap  = cycle photos of same vendor (dots at bottom)
// Double-tap  = save to Muse ♥
// Peek nav    = long glowing line at bottom → tap → vendor panel slides up
//               Panel: name, enquire (silent WA), lock date (beta), circle share

const DISC_CATEGORIES = ['Venues','Photographers','Makeup Artists','Designers','Jewellery','Choreographers','Content Creators','DJ & Music','Event Managers','Bridal Wellness'];
const DISC_CITIES     = ['Delhi NCR','Mumbai','Bangalore','Chennai','Hyderabad','Kolkata','Jaipur','Pune','Udaipur','Goa'];
// ── TDW_09 PHASE B · F-6 = (a) + F-5(a) — DISC_VIBES IS RETIRED ─────────────
// The capitalised ten that stood here were the COUPLE half of F-10.52: a
// made-up list, exact-matched by .overlaps against lowercase vendor terms —
// `Traditional` never met `traditional`, seven of ten met nothing at all. The
// vibe chips now come from THE one vocabulary home (lib/shared/tagVocabulary,
// parity-arbitered), scoped to the PICKED category; until one is picked the
// section shows the FOUNDER-VETOED honest line instead of chips that would
// filter across vocabularies that don't share words. Frost display names map
// to vocabulary keys below; categories without a vetoed list honestly show no
// chips (the 'other' law).
const DISC_CAT_TO_VOCAB: Record<string, string> = {
  'Venues': 'venue', 'Photographers': 'photography', 'Makeup Artists': 'makeup',
  'Choreographers': 'choreography', 'DJ & Music': 'music', 'Event Managers': 'planning',
};
// F-07.34 — one home (see lib/frost/budgetBands.ts). Vetoed labels, values untouched.
const DISC_BUDGETS    = BUDGET_BANDS;

// ── TDW_07 P6 · Fork 3(b) — THE GESTURE CONSTANTS LEFT THIS FILE ─────────────────
// They were `SWIPE_THRESHOLD 42 · TAP_MAX_MOVE 10 · TAP_MAX_TIME 240 · DOUBLE_TAP_MS
// 270`, and they are now imported from lib/frost/photoPager.ts AT EXACTLY THOSE VALUES.
// The re-pin ran in that direction — the home adopted THIS room's numbers, not the
// reverse — because §3 protects the mechanics couples have actually used, and this is the
// only Discover surface they reach. Zero feel change here by construction; the proof is
// the pager's own restated three-part cell set.
//
// `discHaptic` is likewise gone: `haptic` at the shared home has a byte-identical body.

interface DiscFilterState { category:string|null; city:string|null; vibes:string[]; budget:string|null; }

function spawnDiscHeart(accent:string){
  if(typeof document==='undefined') return;
  const el=document.createElement('div');
  el.style.cssText=`position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);font-size:88px;z-index:9999;pointer-events:none;animation:discHeartPop 700ms cubic-bezier(0.22,1,0.36,1) forwards;color:${accent};`;
  el.textContent='♥'; document.body.appendChild(el); setTimeout(()=>el.remove(),700); haptic(14);
}

function spawnDiscToast(msg:string){
  if(typeof document==='undefined') return;
  const ex=document.getElementById('disc-toast'); if(ex) ex.remove();
  const el=document.createElement('div'); el.id='disc-toast';
  el.style.cssText=`position:fixed;top:calc(env(safe-area-inset-top,0px) + 52px);left:50%;transform:translateX(-50%);background:rgba(8,6,8,0.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:0.5px solid rgba(255,255,255,0.14);color:rgba(248,247,245,0.9);font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;padding:8px 18px;border-radius:20px;z-index:9998;pointer-events:none;white-space:nowrap;`;
  el.textContent=msg; document.body.appendChild(el);
  setTimeout(()=>{el.style.opacity='0';el.style.transition='opacity 300ms';},1800);
  setTimeout(()=>el.remove(),2200);
}

// ── Filter sheet ──────────────────────────────────────────────────────────────
function DiscFilterSheet({visible,onClose,filters,accent,dark,onApply}:{
  visible:boolean; onClose:()=>void; filters:DiscFilterState;
  accent:string; dark:boolean; onApply:(f:DiscFilterState)=>void;
}) {
  const [local,setLocal] = React.useState<DiscFilterState>(filters);
  React.useEffect(()=>{ if(visible) setLocal(filters); },[visible,filters]);
  if(!visible) return null;

  const p = (active:boolean):React.CSSProperties => ({
    padding:'7px 14px', borderRadius:100,
    border:active?`0.5px solid ${accent}`:'0.5px solid rgba(255,255,255,.18)',
    background:active?`${accent}28`:'rgba(255,255,255,.07)',
    fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:'.22em',
    color:active?accent:'rgba(248,247,245,.65)',
    cursor:'pointer', whiteSpace:'nowrap' as any, touchAction:'manipulation' as any,
  });

  const [openSection,setOpenSection] = React.useState<string|null>(null);
  const toggle = (s:string) => setOpenSection(o=>o===s?null:s);

  const Section = ({id,label,hasVal,children}:{id:string;label:string;hasVal:boolean;children:React.ReactNode}) => (
    <div style={{borderBottom:'0.5px solid rgba(255,255,255,.08)'}}>
      <button onClick={()=>toggle(id)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 24px',background:'none',border:'none',cursor:'pointer',touchAction:'manipulation' as any}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:hasVal?accent:'rgba(248,247,245,.45)'}}>{label}{hasVal?' ·':''}</span>
        <span style={{color:'rgba(248,247,245,.35)',fontSize:16,transform:openSection===id?'rotate(90deg)':'rotate(0deg)',transition:'transform 200ms ease',display:'inline-block'}}>›</span>
      </button>
      {openSection===id&&<div style={{padding:'0 24px 20px'}}>{children}</div>}
    </div>
  );

  return (
    <div style={{position:'absolute',inset:0,zIndex:200}}
      onClick={onClose}
      onTouchStart={e=>e.stopPropagation()}
      onTouchEnd={e=>{e.stopPropagation();onClose();}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.3)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,background:'rgba(8,6,8,.82)',backdropFilter:'blur(28px) saturate(1.8)',WebkitBackdropFilter:'blur(28px) saturate(1.8)',borderTop:'0.5px solid rgba(255,255,255,.1)',borderRadius:'20px 20px 0 0',paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 24px)',maxHeight:'85vh',overflowY:'auto'}}
        onClick={e=>e.stopPropagation()}
        onTouchStart={e=>e.stopPropagation()}
        onTouchEnd={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'center',padding:'12px 0 4px'}}><div style={{width:36,height:4,borderRadius:2,background:'rgba(255,255,255,.2)'}}/></div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 24px 4px'}}>
          <span style={{fontFamily:"'Italianno',cursive",fontSize:46,color:'#F8F7F5',lineHeight:1}}>Discover</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(248,247,245,.4)',padding:4,fontSize:18}}>✕</button>
        </div>
        <Section id="cat" label="Category" hasVal={!!local.category}>
          <div style={{display:'flex',flexWrap:'wrap' as any,gap:8}}>
            {DISC_CATEGORIES.map(c=><button key={c} style={p(local.category===c)} onClick={()=>setLocal(f=>({...f,category:f.category===c?null:c,vibes:[]}))}>{c}</button>)}
          </div>
        </Section>
        <Section id="city" label="City" hasVal={!!local.city}>
          <div style={{display:'flex',flexWrap:'wrap' as any,gap:8}}>
            {DISC_CITIES.map(c=><button key={c} style={p(local.city===c)} onClick={()=>setLocal(f=>({...f,city:f.city===c?null:c}))}>{c}</button>)}
          </div>
        </Section>
        <Section id="vibe" label="Vibe" hasVal={local.vibes.length>0}>
          {(() => {
            const vlist = local.category ? vocabularyFor(DISC_CAT_TO_VOCAB[local.category] ?? local.category) : null;
            if (!local.category) return (
              /* FOUNDER-VETOED byte (relay #2 slate) — the honest single line. */
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:16,lineHeight:1.5,color:'rgba(248,247,245,.5)'}}>Pick a category to filter by vibe</div>
            );
            if (!vlist) return null; /* category without a vetoed list — honestly chip-free */
            return (
              <div style={{display:'flex',flexWrap:'wrap' as any,gap:8}}>
                {vlist.map(v=><button key={v} style={p(local.vibes.includes(v))} onClick={()=>setLocal(f=>({...f,vibes:f.vibes.includes(v)?f.vibes.filter(x=>x!==v):[...f.vibes,v]}))}>{v}</button>)}
              </div>
            );
          })()}
        </Section>
        <Section id="budget" label="Budget" hasVal={!!local.budget}>
          <div style={{display:'flex',flexWrap:'wrap' as any,gap:8}}>
            {DISC_BUDGETS.map(b=><button key={b.label} style={p(local.budget===b.value)} onClick={()=>setLocal(f=>({...f,budget:f.budget===b.value?null:b.value}))}>{b.label}</button>)}
          </div>
        </Section>
        <div style={{display:'flex',gap:12,padding:'24px 24px 0'}}>
          <button onClick={()=>{const e:DiscFilterState={category:null,city:null,vibes:[],budget:null};setLocal(e);onApply(e);onClose();}} style={{flex:1,padding:'13px 0',background:'transparent',border:'0.5px solid rgba(255,255,255,.2)',borderRadius:10,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(248,247,245,.45)',cursor:'pointer'}}>Clear</button>
          <button onClick={()=>{onApply(local);onClose();}} style={{flex:2,padding:'13px 0',background:accent,border:'none',borderRadius:10,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:dark?'#1A0810':'#FFFFFF',cursor:'pointer'}}>Apply</button>
        </div>
      </div>
    </div>
  );
}

// ── Vendor panel (slides up from peek nav tap) ────────────────────────────────
function DiscVendorPanel({vendor,visible,onClose,onEnquire,onCircleShare}:{
  vendor:DiscoverVendor; visible:boolean; onClose:()=>void;
  onEnquire:()=>void; onCircleShare:()=>void;
}) {
  const dragY   = React.useRef(0);
  const [delta, setDelta] = React.useState(0);
  const dragging = React.useRef(false);

  return (
    <div style={{
      position:'absolute',bottom:0,left:0,right:0,zIndex:60,
      transform:visible?`translateY(${delta}px)`:'translateY(100%)',
      transition:dragging.current?'none':'transform 340ms cubic-bezier(0.22,1,0.36,1)',
      opacity:visible?Math.max(.3,1-delta/200):0,
      background:'rgba(8,6,8,.88)',backdropFilter:'blur(32px) saturate(1.8)',WebkitBackdropFilter:'blur(32px) saturate(1.8)',
      borderTop:'0.5px solid rgba(255,255,255,.10)',borderRadius:'20px 20px 0 0',
      paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 28px)',
    }}
      onTouchStart={e=>{dragY.current=e.touches[0].clientY;dragging.current=true;setDelta(0);}}
      onTouchMove={e=>{const d=e.touches[0].clientY-dragY.current;if(d>0)setDelta(d);}}
      // TDW_07 P6 — the panel's dismiss threshold was an inline `80`, byte-equal to the
      // shared home's OVERLAY_DISMISS but not JOINED to it. The re-aimed §7 cell caught it
      // on first contact: a constant that merely agrees is not one home, it is two numbers
      // that happen to match until someone tunes one. Zero feel change; same number, now
      // the same source.
      onTouchEnd={()=>{dragging.current=false;if(delta>OVERLAY_DISMISS){setDelta(0);onClose();}else setDelta(0);}}
    >
      {/* Drag handle */}
      <div style={{display:'flex',justifyContent:'center',padding:'14px 0 18px'}}>
        <div style={{width:40,height:4,borderRadius:2,background:'rgba(255,255,255,.18)'}}/>
      </div>

      {/* ── TDW_07 P6 · F-07.68 CURED — THE CONTENT IS THE SHARED RENDERER'S ───────────
          WHAT STOOD HERE WAS THE SECOND IMPLEMENTATION. Spec §3 is absolute: "shared
          VendorProfileView is the only profile renderer — a second implementation anywhere
          is a failed session." P4b extracted that renderer out of `canvas/discover`'s
          GlassOverlay and proved, with identity cells, that one component sat over one
          shaper. Every cell was true. It could not see this file: the extraction was
          performed on a deck with ZERO inbound navigation while THIS panel — the profile
          couples actually open — went on rendering its own category line, its own name,
          its own price, its own buttons, and NO `about` at all. The guardrail has been
          broken on production since P4b sealed, and the bench that would have caught it
          was pointed at the unreachable twin.

          So the body becomes the shared renderer and the CHROME STAYS. The drag-to-dismiss
          handlers, the transform, the glass sheet and the grab handle above are deck
          mechanics under §3 and the surest way to keep a gesture byte-identical is not to
          move it. That boundary is P4b's own, applied to the surface it missed.

          ── THE onCircleTap RIDER (CE-mandated, its own both-ways cell) ────────────────
          The canvas mount raised `onCircleTap` to a TOAST — "Add someone to your Circle
          first" — and nothing else. THIS room's Circle button has always performed a real
          share: `saveVendorToMuse(vendor.id, photo, true)`. Threading the shared button to
          the canvas's toast would have regressed a working capability into a message while
          every identity cell stayed green, which is exactly the class CE-116 clause 2 was
          minted for. `onCircleTap` therefore carries THIS room's working share. */}
      <VendorProfileView
        vendor={vendor}
        mode="live"
        isBlind={false}
        enquireLink={vendor.enquire_link||(vendor.routing_handle?makeEnquireLink(vendor.routing_handle):null)}
        onEnquire={onEnquire}
        onCircleTap={onCircleShare}
      />
    </div>
  );
}

// ── TDW_07 P6 · TWO COMPONENTS DIED HERE, CENSUSED ───────────────────────────────
// `DiscImageDots` — a SECOND position indicator (cap 7, bottom, accent) beside
//   components/shared/ImageDots (cap 8, top, white). Two indicators, two caps, two
//   positions, and the shared file's own header called the 20-dot question "closed"
//   while this one answered it differently. The founder ruled ONE component carrying
//   sanctuary's bottom placement and room accent, cap 8, hairline. This is that deletion;
//   the survivor is imported at the top of this file.
//
// `DiscPeekNav` — a full glowing-line nav bar with Blind, peek and Filter affordances,
//   declared at :1344 and MOUNTED NOWHERE. Derived by command at 082117a: one occurrence
//   in the file, the declaration itself. Dead on a live gesture surface, F-07.1's class.
//   Deleted rather than left for the next reader to wonder about.

// ── TDW_13 · D-2 · THE DISCOVER BETA GATE (R-30.36) ───────────────────────────
// FOUNDER-AUTHORED BYTES. Veto pre-satisfied by authorship (Amendment One
// §2.13.vi); transcribed from the committed source at dream-os `792bd37`, never
// from memory, and pinned by the D-2 bench against this constant. The 「 」 in the
// charter are the governance document's own quotation marks and are NOT copy —
// the string below is the byte span between them.
//
// APPROVED-COPY-CARRIES-ITS-HASH — sha256 of this exact string:
//   6bd0e6fcc484078512652d9ce4b46cffddaf4b139d1b0a50205597587e0e4b6b
//   (161 bytes; proven equal to the committed span at dream-os `792bd37`)
// (the bench recomputes; a value that disagrees is the finding, not the fix)
const BETA_GATE_BODY = 'We are presently in Beta testing Phase. Someone from our team will reach out for your requirements. In the meantime, enjoy the other features the TDW app offers.';

// WHY IT CARRIES NO DISMISS COPY: the founder vetoed the body, not a button
// label. Inventing one would be a bride-facing byte no one approved, so the
// affordance is the ✕ glyph this file already uses in ten places, plus a scrim
// tap. A text button is a one-line change the moment a byte is ruled.
//
// WHY IT GATES THE MOUNT RATHER THAN OVERLAYING A LIVE FEED: the ruling's
// purpose is that no beta bride sees Discover content ungated. An overlay leaves
// the feed rendered and fetching underneath a translucent scrim, which is
// content seen. DiscoverRoom does not mount until she acknowledges.
export function BetaGate({ onAck }: { onAck: () => void }) {
  // Discover is a photo room — always dark, whatever the mode (see isPhotoRoom).
  // These are that palette's own values, not new ones.
  const ink     = '#F0EDE8';
  const inkMute = 'rgba(200,180,160,.40)';
  const line    = 'rgba(196,133,106,.16)';
  return (
    <div style={{position:'absolute',inset:0,zIndex:20}}>
      <div onClick={onAck} style={{position:'absolute',inset:0,background:'rgba(0,0,0,.55)'}}/>
      <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(180deg,#0C0A0C 0%,#080608 100%)',borderTop:`0.5px solid ${line}`,borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`}}>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:4}}>
          <button onClick={onAck} aria-label="Close" style={{background:'none',border:'none',cursor:'pointer',color:inkMute,fontSize:19,padding:0,lineHeight:1}}>✕</button>
        </div>
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ink,lineHeight:1.65,fontFeatureSettings:'"opsz" 9'}}>
          {BETA_GATE_BODY}
        </div>
      </div>
    </div>
  );
}

interface DiscoverRoomProps { dark:boolean; accent:string; signal:string; }

export function DiscoverRoom({ dark, accent }: DiscoverRoomProps) {
  const { press, pressed } = usePress();
  const [vendors,    setVendors]    = React.useState<DiscoverVendor[]>([]);
  const [vIdx,       setVIdx]       = React.useState(0);
  const [panelOpen,  setPanelOpen]  = React.useState(false);
  const [sheetOpen,  setSheetOpen]  = React.useState(false);
  const [enquiryToast, setEnquiryToast] = React.useState<string|null>(null);
  // THE SHARED CAROUSEL. The hook takes the COUNT, not the array, so it re-bounds when the
  // deck moves vendor without caring what the photos are; `dissolveKey` is the room's own
  // cross-fade key too, so vendor-change, photo-change and blind-advance all speak one
  // transition language — and the vendor's preview literally runs this deck's dissolve.
  const photoCount = vendors[vIdx]?.photos.length ?? 0;
  const {
    imageIdx: imgIdx, setImageIdx: setImgIdx,
    dissolveKey: dissolve, setDissolveKey: setDissolve,
    nextImage: nextImg, prevImage: prevImg,
  } = usePhotoPager(photoCount);
  const [isBlind,    setIsBlind]    = React.useState(false);
  const [loading,    setLoading]    = React.useState(true);
  const [page,       setPage]       = React.useState(0);
  const [hasMore,    setHasMore]    = React.useState(true);
  const [showFilter, setShowFilter] = React.useState(false);
  const [filters,    setFilters]    = React.useState<DiscFilterState>({category:null,city:null,vibes:[],budget:null});
  const [enquiring,  setEnquiring]  = React.useState(false);

  const touchStart  = React.useRef<{x:number;y:number;t:number}|null>(null);
  const tapTimer    = React.useRef<ReturnType<typeof setTimeout>|null>(null);
  const lastTap     = React.useRef(0);
  const tapCount    = React.useRef(0);

  const hasActiveFilters = !!(filters.category||filters.city||filters.vibes.length||filters.budget);

  // TDW_07 P6 · Fork 5(b) — the SERVER's substitution report, held verbatim. The room
  // never infers it: a thin result and a widened result look identical from here, and
  // only one of them may carry the founder's "the closest to you" line.
  const [coldStart,setColdStart] = React.useState<{substituted:boolean;city:string|null}|null>(null);

  React.useEffect(()=>{
    setLoading(true);
    fetchDiscoverFeed({page:0,category:filters.category??undefined,city:filters.city??undefined,budget:filters.budget??undefined,vibes:filters.vibes.length?filters.vibes.join(','):undefined})
      .then(({vendors:v,has_more,cold_start})=>{setVendors(v);setHasMore(has_more);setVIdx(0);setImgIdx(0);setPage(0);
        setColdStart(cold_start?{substituted:cold_start.substituted,city:cold_start.city}:null);})
      .catch(()=>{}).finally(()=>setLoading(false));
  },[filters]);

  // Paginate
  React.useEffect(()=>{
    if(!hasMore||!vendors.length||vIdx<vendors.length-3) return;
    const next=page+1;
    fetchDiscoverFeed({page:next,category:filters.category??undefined,city:filters.city??undefined,budget:filters.budget??undefined,vibes:filters.vibes.length?filters.vibes.join(','):undefined})
      .then(({vendors:more,has_more})=>{if(more.length){setVendors(p=>[...p,...more]);setPage(next);setHasMore(has_more);}else setHasMore(false);})
      .catch(()=>{});
  },[vIdx,vendors.length,hasMore,page,filters]);

  const vendor = vendors[vIdx];
  const photos = vendor?.photos||[];

  // Preload next images
  React.useEffect(()=>{
    if(!vendor) return;
    const toLoad:string[]=[];
    for(let i=imgIdx+1;i<Math.min(photos.length,imgIdx+3);i++) toLoad.push(photos[i]);
    if(vendors[vIdx+1]?.photos[0]) toLoad.push(vendors[vIdx+1].photos[0]);
    // TDW_07 P6 — preload the DELIVERED variant. Warming the raw original heated a cache
    // the render never reads, so this room paid full bytes twice on every advance.
    toLoad.forEach(s=>{const img=new Image();img.src=imgUrl(s,'card');});
  },[vIdx,imgIdx,vendor,vendors,photos]);

  // ── F-07.73 CURED · THE VIRTUAL END SLOT (fork C1, CE-ratified) ──────────────
  // THE STATE THE FOUNDER APPROVED COULD NOT BE REACHED. The empty state below
  // ("That's everyone, for now." + CHECK BACK SOON) gates on `!vendor`, and this
  // clamp read `vIdx >= vendors.length - 1` — so on a populated deck `vendors[vIdx]`
  // was NEVER undefined and the approved sentence had no path. She walked to the
  // last card and the deck simply stopped moving, which says nothing at all.
  //
  // THE CLAMP NOW DEPENDS ON `hasMore`, and that is the whole cure. `hasMore` is
  // the SERVER's word, not this room's inference: the prefetch effect above fires
  // three cards from the end and only sets it false when a page comes back empty.
  // So while the feed may still have pages, the clamp holds at the last card and
  // the end state cannot render over an unexhausted feed. Once the server has said
  // it is done, `vIdx` is allowed to reach `vendors.length` — a slot with no vendor
  // in it — and the existing branch renders the founder's approved pair unchanged.
  // ZERO new copy: the sentence was always written, it simply had no door.
  //
  // goPrevV needs nothing: from the virtual slot `vIdx <= 0` is false, so swipe-down
  // already walks her back onto the last card. The prefetch effect short-circuits on
  // `!hasMore` and the preload effect on `!vendor`, so neither runs at the slot.
  // Blind mode is a separate axis (`blindIdx`, clamped independently) and the empty
  // branch excludes it by `!isBlind` — the slot is invisible to blind by construction.
  const goNextV=React.useCallback(()=>{
    if(vIdx>=vendors.length-(hasMore?1:0))return;
    setVIdx(i=>i+1);setImgIdx(0);setPanelOpen(false);setDissolve(k=>k+1);haptic(5);
  },[vIdx,vendors.length,hasMore]);

  const goPrevV=React.useCallback(()=>{
    if(vIdx<=0)return;
    setVIdx(i=>i-1);setImgIdx(0);setPanelOpen(false);setDissolve(k=>k+1);haptic(5);
  },[vIdx]);

  // `undoSkip` DIED IN THE FOLD, censused: a full undo-the-skip verb with ZERO callers
  // (derived by command — one occurrence, its own declaration). `undoStack` was written
  // on every vendor advance and read ONLY by this unreachable function, so both go. A
  // couple has never been able to undo a skip on this deck; deleting the code that
  // pretended otherwise is not a feature loss, it is the removal of a false affordance's
  // corpse. If undo is wanted it is a product ruling, not a resurrection.

  // ── TDW_07 P6 · η(c) — THE PHOTO CURSOR IS THE SHARED PAGER'S ──────────────────
  // `nextImg`/`prevImg` and their `(i±1) % photos.length` wrap left this file for
  // lib/frost/photoPager.ts. The wrap went WITH them: η ruled the one home adopts THIS
  // room's behaviour, because §3 protects the mechanics couples have used and this room
  // is the surface they use. The vendor preview moves clamp→wrap instead — the
  // unprotected side, by the same precedent that re-pinned the thresholds.
  //
  // `cyclePhoto` DIED IN THE FOLD, censused: it was byte-identical to `nextImg` and had
  // ZERO callers (derived by command at 082117a — one occurrence, its own declaration).
  // Two names for one motion, one of them unreachable.

  const handleDoubleTap=React.useCallback(()=>{
    if(!vendor)return;
    spawnDiscHeart(accent);
    saveVendorToMuse(vendor.id,photos[imgIdx]||null).then(r=>spawnDiscToast(r.ok?'Saved to Muse ♥':'Already in Muse'));
  },[vendor,photos,imgIdx,accent]);

  // Blind mode: cycle through all vendor photos anonymously
  const [blindItems, setBlindItems] = React.useState<{vId:string;img:string}[]>([]);
  const [blindIdx,   setBlindIdx]   = React.useState(0);
  React.useEffect(()=>{
    const q:{vId:string;img:string}[]=[];
    vendors.forEach(v=>{
      if(!v.photos.length) q.push({vId:v.id,img:''});
      else v.photos.forEach(p=>q.push({vId:v.id,img:p}));
    });
    setBlindItems(q);
    setBlindIdx(0);
  },[vendors]);

  const onTouchStart=(e:React.TouchEvent<HTMLDivElement>)=>{
    const t=e.touches[0];
    touchStart.current={x:t.clientX,y:t.clientY,t:Date.now()};
  };

  const onTouchEnd=(e:React.TouchEvent<HTMLDivElement>)=>{
    if(!touchStart.current)return;
    const s=touchStart.current; touchStart.current=null;
    const end=e.changedTouches[0];
    const dx=end.clientX-s.x, dy=end.clientY-s.y, dt=Date.now()-s.t;
    const ax=Math.abs(dx), ay=Math.abs(dy);

    // ── Tap detection ─────────────────────────────────────────────────
    if(ax<TAP_MAX_MOVE&&ay<TAP_MAX_MOVE&&dt<TAP_MAX_TIME){
      const now=Date.now(),since=now-lastTap.current;
      if(since<DOUBLE_TAP_MS&&tapCount.current>=1){
        if(tapTimer.current)clearTimeout(tapTimer.current);
        tapCount.current=0;
        if(isBlind){
          const item=blindItems[blindIdx];
          if(item){spawnDiscHeart(accent);saveVendorToMuse(item.vId,item.img||null).then(r=>spawnDiscToast(r.ok?'Saved to Muse ♥':'Already in Muse'));}
        } else { handleDoubleTap(); }
      } else {
        tapCount.current=1; lastTap.current=now;
        tapTimer.current=setTimeout(()=>{
          if(tapCount.current===1){
            if(isBlind){
              setBlindIdx(i=>Math.min(i+1,blindItems.length-1));
              setDissolve(k=>k+1); haptic(5);
            } else {
              // Single tap — open the vendor panel (Enquire / Lock date / Circle)
              setPanelOpen(true); haptic(3);
            }
          }
          tapCount.current=0;
        },DOUBLE_TAP_MS);
      }
      return;
    }

    const vel=Math.max(ax,ay)/Math.max(dt,1);
    if(Math.max(ax,ay)<=SWIPE_THRESHOLD&&vel<=SWIPE_VELOCITY)return;

    // ── Swipe routing ──────────────────────────────────────────────────
    // Vertical = vendor nav | Horizontal = photo nav within vendor
    if(isBlind){
      if(ay>ax){
        if(dy<-SWIPE_THRESHOLD){setBlindIdx(i=>Math.min(i+1,blindItems.length-1));setDissolve(k=>k+1);haptic(5);}
        else if(dy>SWIPE_THRESHOLD){setBlindIdx(i=>Math.max(i-1,0));setDissolve(k=>k+1);haptic(5);}
      }
    } else {
      if(ay>ax){
        // Vertical — vendor navigation (Reels/Shorts muscle memory)
        if(dy<-SWIPE_THRESHOLD) goNextV();      // swipe UP = next vendor
        else if(dy>SWIPE_THRESHOLD) goPrevV();  // swipe DOWN = prev vendor
      } else {
        // Horizontal — photo navigation within same vendor
        if(dx<-SWIPE_THRESHOLD) nextImg();      // swipe LEFT = next photo
        else if(dx>SWIPE_THRESHOLD) prevImg();  // swipe RIGHT = prev photo
      }
    }
  };

  // ── F-07.73 v2 · THE GESTURE THAT WAS NEVER MOUNTED ───────────────────────
  // THE EXECUTOR'S OWN DEFECT, WITNESSED ON THE FOUNDER WALK (step 4, RED).
  // The virtual end slot shipped with a comment asserting "goPrevV needs
  // nothing: from the slot `vIdx <= 0` is false, so swipe-down already walks her
  // back." Every word of that was true about goPrevV AND IRRELEVANT, because the
  // end-state branch returns EARLY at its own <div> and the deck's handlers are
  // attached at the MAIN return below. goPrevV was never unreachable. It was
  // never CALLED. There is no gesture on that screen at all, and the bride's only
  // exit was the SANCTUARY chrome — she could walk to the end of the deck and not
  // walk back, which makes a "virtual slot" a dead end wearing a slot's clothes.
  //
  // THE PROOF PASSED OVER IT. Cell §8.5 asserted goPrevV's body and is true and
  // proves nothing, because the function it examines had no caller on the surface
  // in question. That is CE-119's inked law — A TRUE CELL AIMED ONE SURFACE OVER —
  // and it is why the v2 cell below asserts REACHABILITY (handler present on the
  // end-state mount) rather than correctness of the callee. Existence cells cannot
  // catch this class; only mount-site cells can.
  //
  // WHY THIS IS A DEDICATED HANDLER AND NOT `onTouchEnd` REUSED. The deck's
  // handler also routes TAPS (:1529 → setPanelOpen(true), a vendor panel opened
  // over no vendor) and HORIZONTAL swipes (nextImg/prevImg into a pager holding no
  // photos). Attaching it here would have cured the swipe and minted two new
  // defects on the same surface. This handler answers exactly one gesture — a
  // downward swipe — and is deliberately deaf to the rest. Swipe-UP is ignored on
  // purpose: there is nothing after the end slot, and a silent no-op is the honest
  // answer to a request the deck cannot satisfy.
  //
  // THRESHOLD PARITY IS LOAD-BEARING: it reuses SWIPE_THRESHOLD/SWIPE_VELOCITY, so
  // the wrist motion that moved her through the deck is the same one that carries
  // her off the end slot. A different threshold here would be a second gesture
  // language on the same journey.
  const endTouchStart = useRef<{x:number;y:number;t:number}|null>(null);
  const onEndTouchStart=(e:React.TouchEvent<HTMLDivElement>)=>{
    const t=e.touches[0];
    endTouchStart.current={x:t.clientX,y:t.clientY,t:Date.now()};
  };
  const onEndTouchEnd=(e:React.TouchEvent<HTMLDivElement>)=>{
    const s=endTouchStart.current; if(!s)return; endTouchStart.current=null;
    const end=e.changedTouches[0];
    const dx=end.clientX-s.x, dy=end.clientY-s.y, dt=Date.now()-s.t;
    const ax=Math.abs(dx), ay=Math.abs(dy);
    const vel=Math.max(ax,ay)/Math.max(dt,1);
    if(Math.max(ax,ay)<=SWIPE_THRESHOLD&&vel<=SWIPE_VELOCITY)return;
    // Vertical-down ONLY. goPrevV is already clamped at `vIdx<=0`, so on the
    // genuinely-empty and empty-filter arms this is a no-op by the callee's own
    // guard rather than by a condition duplicated here.
    if(ay>ax&&dy>SWIPE_THRESHOLD) goPrevV();
  };

  // ── F-07.39 CURED · THE SUCCESS TOAST THAT COULD NOT FAIL ─────────────────
  // THIS HANDLER READ: `await fetch(...)` with NO `res.ok` check, then
  // `spawnDiscToast('Vendor notified ✦ link saved in Vendors')` unconditionally.
  // `fetch` rejects only on NETWORK failure — a 400, 404 or 422 RESOLVES and fell
  // straight into the success toast. The door has exactly those three refusal
  // exits (enquire.js:29 no vendor_id · :41 not discover-eligible · :52 no vendor
  // phone), so a bride could be told "Vendor notified" when nothing was notified
  // and nothing was saved. It is the founding-lie family on the couple plane, and
  // it is the standing explanation for `couple_enquiries` holding ZERO rows while
  // this was the pipeline's only caller.
  //
  // THE SECOND HALF WAS ALSO FALSE. The toast promised two things — a notified
  // vendor AND a saved link — but the row only writes when `couple_id` is present
  // (enquire.js:99). A logged-out bride got the identical sentence and no row.
  // V6's split (founder-vetoed 2026-07-31) says the true thing in each case, and
  // the server now reports `sent` / `lead_created` / `enquiry_saved` field by
  // field so this surface can only ever repeat back what actually happened.
  //
  // ── THE TWO ADJACENT FACTS, BOUND AS ALREADY-LAW (CE-ruled) ───────────────
  // (1) THE HARDCODED BASE IS GONE. `API_BASE` is the one authority
  //     (lib/frost-api/_base.ts:34) and follows NEXT_PUBLIC_API_BASE.
  // (2) THE RAW localStorage READ IS GONE. `getCoupleSession()` (_base.ts:127) is
  //     the one session authority, and it carries the `tdw_couple_session` COOKIE
  //     FALLBACK that protocol §4 names settled for iOS Safari. The raw read this
  //     replaces had no fallback — so on the exact devices the fallback exists to
  //     rescue, this handler was silently posting as a logged-out bride and losing
  //     her enquiry row. That is a cure, not a tidy-up.
  // ── F1(a) ON THE LIVE SURFACE (CE-ruled F-A, 2026-07-31) ──────────────────
  // This handler USED to post to /enquire directly. That work now belongs to
  // EnquirySheet, which prefills from her profile, lets her correct it, posts
  // the four fields, and performs the wa.me handoff itself. Keeping a second
  // posting path here would be two implementations of one contract on the same
  // screen — the shape §3 exists to forbid.
  //
  // This surface is the one couples actually reach: /frost replaces to
  // /frost/canvas/sanctuary (frost/page.tsx:11), and /frost/canvas/discover has
  // ZERO inbound navigation (F-07.43). The canvas mount is the twin; the
  // two-mount upkeep is TEMPORARY and bounded by F-07.43's resolution, which is
  // the founder's product word at P6's opening.
  const handleEnquire=React.useCallback(()=>{
    if(!vendor)return;
    // THE PANEL STAYS OPEN, DELIBERATELY. Closing it started its own 340ms
    // slide-out while the sheet was rising — two animations disagreeing, which is
    // what the founder saw as the form "rising from behind the enquire card". The
    // sheet's scrim (z 120) already covers the panel (z 60), so leaving it is both
    // calmer and truer: dismissing the sheet returns her exactly where she was.
    setSheetOpen(true);
  },[vendor]);

  const handleCircleShare=React.useCallback(()=>{
    if(!vendor)return;
    setPanelOpen(false);
    saveVendorToMuse(vendor.id,photos[imgIdx]||null,true)
      .then(r=>spawnDiscToast(r.ok?'Shared to your Circle ✦':'Could not share'));
  },[vendor,photos,imgIdx]);

  const photo = isBlind?(blindItems[blindIdx]?.img||''):photos[imgIdx];

  if(loading) return (
    <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:'#080608'}}>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(245,240,232,.3)'}}>Loading…</span>
    </div>
  );

  // ── TDW_07 P6 · THE EMPTY STATES SPLIT — founder-vetoed bytes, frozen ──────────────
  // ONE SENTENCE SERVED TWO SITUATIONS AND WAS FALSE IN ONE OF THEM. "All seen." is true
  // at the end of a deck she has paged through. It is a LIE when her filters matched
  // nothing: she has seen none of them, and there are none to see. The founder ruled the
  // split and approved both pairs; the CLEAR FILTERS affordance is ADDED-BY-RULING and
  // enters the control inventory as such.
  if(!vendor&&!isBlind) return (
    <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#080608',gap:12,padding:'0 32px',touchAction:'none',userSelect:'none',WebkitUserSelect:'none' as any}}
      onTouchStart={onEndTouchStart} onTouchEnd={onEndTouchEnd}>
      {/* ── F-07.73 v2 — THE MOUNT. This div is the whole reason step 4 came back
           RED: it is an EARLY RETURN, and the deck's onTouchStart/onTouchEnd live
           on the main return below it. `touchAction:'none'` joins the handlers
           deliberately — without it the downward drag is eligible to be consumed
           as a scroll/pull gesture before the handler ever sees it, which would
           reproduce the same silence through a different mechanism. */}
      {/* ── F-07.73 · C′ (CE-ratified) — THE FALSE SENTENCE DIES AT ITS SECOND
           APPEARANCE. This arm used to fire on `hasActiveFilters` alone. With the
           virtual end slot above, a bride who FILTERS and then walks the whole
           filtered deck arrives here — and would have been told "Nothing matches
           those filters yet." about cards she had just looked at one by one. That
           is the same lie P6's split was vetoed to kill, wearing the other half's
           clothes. The arm now also requires the result to be actually empty. */}
      {hasActiveFilters && vendors.length === 0 ? (
        <>
          <span style={{fontFamily:"'Italianno',cursive",fontSize:52,color:accent,lineHeight:1,textAlign:'center'}}>Nothing matches those filters yet.</span>
          <button
            onClick={()=>{setFilters({category:null,city:null,vibes:[],budget:null});haptic(6);}}
            style={{background:'none',border:'none',cursor:'pointer',padding:'8px 4px',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:accent}}>
            Clear filters
          </button>
        </>
      ) : (
        <>
          <span style={{fontFamily:"'Italianno',cursive",fontSize:52,color:accent,lineHeight:1,textAlign:'center'}}>That&rsquo;s everyone, for now.</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(248,247,245,.3)'}}>Check back soon</span>
        </>
      )}
    </div>
  );

  return (
    <div style={{flex:1,position:'relative',background:'#080608',overflow:'hidden',touchAction:'none',userSelect:'none',WebkitUserSelect:'none' as any}}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      <style>{`
        @keyframes discHeartPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}45%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}70%{transform:translate(-50%,-50%) scale(.95)}100%{opacity:0;transform:translate(-50%,-50%) scale(1)}}
        @keyframes discDissolve{from{opacity:0}to{opacity:1}}
      `}</style>

      {/* Photo */}
      <div key={dissolve} style={{position:'absolute',inset:0,zIndex:1,animation:'discDissolve 240ms cubic-bezier(0.22,1,0.36,1)'}}>
        {/* TDW_07 P6 — LQIP BENEATH, THE CARD VARIANT OVER (spec P6: "LQIP + shimmer
            skeletons, zero spinners"). This room served the RAW Cloudinary original at
            full resolution on every card; the variants module has existed since P3 and
            this surface never called it. Both layers are pointerEvents:'none' exactly as
            the single layer was, so the deck's touch surface is byte-for-byte the surface
            it was — the gesture law is preserved by construction, not by inspection. */}
        {photo
          ? <>
              <img src={lqipUrl(photo)} alt="" aria-hidden draggable={false} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',pointerEvents:'none',filter:'blur(12px)',transform:'scale(1.08)'}}/>
              <img src={imgUrl(photo,'card')} alt="" draggable={false} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',pointerEvents:'none'}}/>
            </>
          : <div style={{position:'absolute',inset:0,background:'#1a1714',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:'rgba(248,247,245,.2)'}}>No photo yet</span></div>
        }
        {/* Vignette */}
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.2) 0%,transparent 20%,transparent 55%,rgba(0,0,0,.65) 100%)',pointerEvents:'none'}}/>
      </div>

      {/* Blind overlay — category only */}
      {isBlind&&vendor&&(
        <div style={{position:'absolute',inset:0,zIndex:5,pointerEvents:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'rgba(8,6,8,.45)',backdropFilter:'blur(2px)',WebkitBackdropFilter:'blur(2px)',borderRadius:8,padding:'8px 18px'}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(248,247,245,.7)'}}>
              {blindItems[blindIdx]?(vendors.find(v=>v.id===blindItems[blindIdx].vId)?.category||'vendor'):'–'}
            </span>
          </div>
        </div>
      )}

      {/* Persistent name · category line — bottom, always visible, tappable */}
      {!isBlind&&!panelOpen&&vendor&&(
        <div
          onClick={e=>{e.stopPropagation();setPanelOpen(true);haptic(3);}}
          onTouchStart={e=>e.stopPropagation()} onTouchEnd={e=>{e.stopPropagation();setPanelOpen(true);haptic(3);}}
          {...press('disc:namebar')}
          style={{
            position:'absolute',bottom:'calc(env(safe-area-inset-bottom,0px) + 28px)',
            left:0,right:0,zIndex:10,padding:'0 24px',
            cursor:'pointer',WebkitTapHighlightColor:'transparent',
            ...pressed('disc:namebar'),
          }}>
          {/* ── TDW_07 P6 · D-1's WHISPER, AND A P5 LAW THAT NEVER REACHED THIS SURFACE ──
              P5 ruled the closed frame render IDENTITY at t=0 — name, category·city, AND
              the starting price — so a couple knows who and how much before she taps. It
              was built on `canvas/discover` and proven there. This room, the one she
              opens, rendered category·city and name and NO price for the whole block.
              Same shape as F-07.67 and F-07.68: a true cell aimed one surface over.
              The b07_p5 re-aim caught it, which is the re-aim earning its keep.

              The string is the founder's vetoed byte through the estate's ONE money donor
              (`formatRs`, F-07.16) — Rs 1,50,000, never a k/L/Cr form, never the ₹ glyph.
              It renders only on a real number: a whispered price that guesses is worse
              than a card that stays quiet. */}
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(248,247,245,.55)',marginBottom:4}}>
            {vendor.category} · {vendor.city}
            {vendor.starting_price?<> · Starting at {formatRs(vendor.starting_price)}</>:null}
          </div>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:12}}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:22,color:'rgba(248,247,245,.97)',lineHeight:1.05,fontFeatureSettings:'"opsz" 9',textShadow:'0 1px 12px rgba(0,0,0,.4)'}}>
              {vendor.name}
            </div>
            <div style={{flexShrink:0,display:'flex',alignItems:'center',gap:5,paddingBottom:3,opacity:.6}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(248,247,245,.7)'}}>Tap</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 10l4-4 4 4" stroke="rgba(248,247,245,.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      )}

      {/* Top chrome — Blind toggle top-left, filter top-right */}
      {!panelOpen&&(
        <>
          {/* Blind pill — top-left */}
          <button
            onClick={e=>{e.stopPropagation();setIsBlind(b=>!b);setBlindIdx(0);setDissolve(k=>k+1);}}
            onTouchStart={e=>e.stopPropagation()} onTouchEnd={e=>e.stopPropagation()}
            {...press('disc:blind')}
            style={{
              position:'absolute',top:'calc(env(safe-area-inset-top,0px) + 12px)',left:16,zIndex:30,
              height:30,padding:'0 14px',borderRadius:100,
              border:`0.5px solid ${isBlind?accent:'rgba(255,255,255,.24)'}`,
              background:isBlind?`${accent}22`:'rgba(8,6,8,.5)',
              backdropFilter:'blur(14px)',WebkitBackdropFilter:'blur(14px)',
              fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
              textTransform:'uppercase' as any,
              color:isBlind?accent:'rgba(248,247,245,.7)',
              cursor:'pointer',touchAction:'manipulation' as any,WebkitTapHighlightColor:'transparent',
              ...pressed('disc:blind'),
            }}>
            Blind
          </button>
          {/* Filter pill — top-right */}
          <button
            onClick={e=>{e.stopPropagation();setShowFilter(true);}}
            onTouchStart={e=>e.stopPropagation()} onTouchEnd={e=>e.stopPropagation()}
            {...press('disc:filter')}
            style={{
              position:'absolute',top:'calc(env(safe-area-inset-top,0px) + 12px)',right:16,zIndex:30,
              width:36,height:30,borderRadius:100,
              border:`0.5px solid ${hasActiveFilters?accent:'rgba(255,255,255,.24)'}`,
              background:hasActiveFilters?`${accent}22`:'rgba(8,6,8,.5)',
              backdropFilter:'blur(14px)',WebkitBackdropFilter:'blur(14px)',
              display:'flex',alignItems:'center',justifyContent:'center',
              cursor:'pointer',touchAction:'manipulation' as any,WebkitTapHighlightColor:'transparent',
              ...pressed('disc:filter'),
            }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M4 8h8M6 12h4" stroke={hasActiveFilters?accent:'rgba(255,255,255,.8)'} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </>
      )}

      {/* ── TDW_07 P6 · THE COLD-START LINE — RENDERED ONLY ON THE SERVER'S WORD ──────
          Founder-vetoed bytes, slot 1 → B. It renders if and only if `cold_start
          .substituted` is TRUE: the handler widened the city filter and got rows back.
          A thin result alone never fires it, because from here a thin list and a
          substituted list are indistinguishable — and a sentence that says "the closest
          to you" over cards that were never substituted is a lie in a serif. */}
      {!isBlind&&!panelOpen&&coldStart?.substituted&&coldStart.city&&(
        <div style={{position:'absolute',top:'calc(env(safe-area-inset-top,0px) + 74px)',left:0,right:0,zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',gap:5,padding:'0 32px',pointerEvents:'none'}}>
          <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:'rgba(248,247,245,.92)',textAlign:'center',lineHeight:1.25,textShadow:'0 1px 12px rgba(0,0,0,.5)'}}>
            The {coldStart.city} list is still being curated.
          </span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(248,247,245,.5)'}}>
            Meanwhile — the closest to you
          </span>
        </div>
      )}

      {/* ── TDW_07 P6 · THE ACTIVE-FILTER BREADCRUMB ──────────────────────────────────
          Values only, never field names — she chose them and knows what they were.
          THE MONEY BAND IS THE ONE MIXED-CASE ELEMENT, deliberately: `bandLabelFor`
          returns the founder-vetoed byte `Rs 1,00,000 – 3,00,000`, and uppercasing the
          line would render it `RS 1,00,000 – 3,00,000`. The byte is unchanged either
          way, so the frozen-copy law is not violated — but a vetoed money byte reading
          back as RS is exactly the class the register law exists to police, so the band
          keeps its own case and the rest of the line keeps the label grammar.
          Chair-pre-ratified with this reason. */}
      {!isBlind&&!panelOpen&&hasActiveFilters&&(
        <div style={{position:'absolute',top:'calc(env(safe-area-inset-top,0px) + 52px)',left:0,right:0,zIndex:10,display:'flex',justifyContent:'center',padding:'0 56px',pointerEvents:'none'}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',color:'rgba(248,247,245,.45)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
            {[
              filters.city     ? filters.city.toUpperCase() : null,
              filters.category ? filters.category.toUpperCase() : null,
              filters.vibes.length
                ? filters.vibes[0].toUpperCase()+(filters.vibes.length>1?` +${filters.vibes.length-1}`:'')
                : null,
              filters.budget ? bandLabelFor(filters.budget) : null,
            ].filter(Boolean).join('  ·  ')}
          </span>
        </div>
      )}

      {/* ── TDW_07 P6 · THE CARD BAND — F-07.67 CURED + D-3's CHIP ARRIVES ────────────
          F-07.67: this feed interleaves FEATURED vendors (couple/discover.js ranks then
          interleaves, and the shaper ships `featured`) and has NEVER MARKED THEM. Spec §3
          is not a preference about it — "Featured always marked (Manual honesty law)" —
          so an unmarked promoted card on the only Discover surface couples reach is a live
          guardrail violation, and the fold is its cure. The eyebrow is the shared
          component; there is no second definition anywhere.

          D-3's chip likewise renders here for the first time on this surface. It reads
          `instagram_handle`, which the shaper normalises for both species — for a demo
          card it is the truest thing on it.

          THE CONTAINER IS pointerEvents:'none' so the swipe surface underneath is
          unchanged everywhere except the chip's own box; the chip consumes its own touches
          the way the panel's buttons already do. */}
      {!isBlind&&!panelOpen&&vendor&&(vendor.featured||vendor.instagram_handle)&&(
        <div style={{
          position:'absolute',
          bottom:'calc(env(safe-area-inset-bottom,0px) + 108px)',
          left:0,right:0,zIndex:11,
          display:'flex',flexDirection:'column',alignItems:'center',gap:8,
          pointerEvents:'none',
        }}>
          <FeaturedEyebrow featured={vendor.featured}/>
          {vendor.instagram_handle&&<IgChip handle={vendor.instagram_handle}/>}
        </div>
      )}

      {/* ── TDW_07 P6 · SAVE TO MUSE — THE HEART (Fork 6(a), CE-ruled) ─────────────────
          The pin was already wired; what did not exist was a way to SEE that it existed.
          Double-tap is a gesture nobody announces, so the deck's Muse save was reachable
          only by couples who guessed. The heart calls the IDENTICAL function on the
          IDENTICAL arguments — the provable-equivalent doctrine applied to an affordance
          rather than a gesture — so the double-tap survives as the enhancement and this
          is the discoverable path. Two doors, one room; there is no second save.
          It consumes its own touches so the swipe surface under it is unchanged. */}
      {!isBlind&&!panelOpen&&vendor&&(
        <button
          onClick={e=>{e.stopPropagation();spawnDiscHeart(accent);saveVendorToMuse(vendor.id,photos[imgIdx]||null).then(r=>spawnDiscToast(r.ok?'Saved to Muse ♥':'Already in Muse'));}}
          onTouchStart={e=>e.stopPropagation()} onTouchEnd={e=>e.stopPropagation()}
          aria-label="Save to Muse"
          {...press('disc:save')}
          style={{
            position:'absolute',
            bottom:'calc(env(safe-area-inset-bottom,0px) + 150px)', right:22, zIndex:12,
            width:40,height:40,borderRadius:20,
            background:'rgba(8,6,8,.42)',backdropFilter:'blur(14px)',WebkitBackdropFilter:'blur(14px)' as any,
            border:'0.5px solid rgba(248,247,245,.16)',
            display:'flex',alignItems:'center',justifyContent:'center',
            cursor:'pointer',WebkitTapHighlightColor:'transparent',padding:0,
            ...pressed('disc:save'),
          }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M12 20.5s-7.5-4.7-7.5-10a4.3 4.3 0 017.5-2.8 4.3 4.3 0 017.5 2.8c0 5.3-7.5 10-7.5 10z"
              stroke="rgba(248,247,245,.82)" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Image dots — bottom, above the name line */}
      {/* TDW_07 P6 — the estate's ONE position indicator, carrying the ROOM accent.
          NOT gold: sanctuary's accent is terracotta or slate (:4030 after the fold) and
          spec §3's "one gold per screen — cards carry none" is why it must stay that way. */}
      {!isBlind&&!panelOpen&&<ImageDots total={photos.length} current={imgIdx} accent={accent}/>}

      {/* Vendor panel + tap-outside scrim */}
      {!isBlind&&vendor&&panelOpen&&(
        <div
          onClick={()=>setPanelOpen(false)}
          onTouchStart={e=>e.stopPropagation()}
          onTouchEnd={e=>{e.stopPropagation();setPanelOpen(false);}}
          style={{position:'absolute',inset:0,zIndex:55,background:'rgba(0,0,0,0.001)'}}
        />
      )}
      {!isBlind&&vendor&&(
        <DiscVendorPanel
          vendor={vendor}
          // FORK B FOLLOW-ON (founder-caught on the walk): the panel used to be
          // hidden by the sheet's own height. The done-state is far shorter than
          // the form, so the panel's top re-emerged BELOW the sheet and the
          // surface read as two stacked cards with two drag handles. The panel
          // slides away while the sheet is up and returns when it closes —
          // `panelOpen` itself is untouched, so nothing about the card's own
          // open/close behaviour changes.
          visible={panelOpen && !sheetOpen}
          onClose={()=>setPanelOpen(false)}
          onEnquire={handleEnquire}
          onCircleShare={handleCircleShare}
        />
      )}

      {/* The sheet is a SIBLING of the panel, never a child — DiscVendorPanel's
          root carries `transform: translateY(...)`, which would make a fixed
          descendant resolve against that drawer instead of the viewport. The
          sheet's own gesture isolation handles this room's touch handlers. */}
      {sheetOpen&&vendor&&(
        <EnquirySheet
          vendor={{id:vendor.id,name:vendor.name,is_demo:(vendor as {is_demo?:boolean}).is_demo}}
          enquireLink={vendor.enquire_link||(vendor.routing_handle?makeEnquireLink(vendor.routing_handle):null)}
          onClose={()=>setSheetOpen(false)}
          onDone={(r)=>{
              // ── FORK B (CE-ruled) · THE SUCCESS TOAST DOES NOT FIRE HERE ──
              // The sheet's done-state is now the confirming surface and renders
              // the SAME frozen bytes. Firing this too would double-confirm, and
              // the toast (zIndex 130) sits inside the sheet's band (zIndex 121)
              // at bottom+96px — it would cover the affordance for its full
              // 2600ms, exactly when she would tap it. The FAILURE arm below is
              // byte-and-firing UNTOUCHED: it is F-07.45's arm, the sheet has
              // nothing good to say on that path, and it still closes and warns.
              if (r.ok) return;
            setSheetOpen(false);
            // F-07.45 SURFACE ARM. `r.ok` is now the SERVER's fact about whether
            // the enquiry EXISTS where the vendor will find it — until this
            // sitting the door returned ok:true unconditionally and this
            // failure branch was UNREACHABLE BY CONSTRUCTION. The vetoed copy
            // is unchanged: the toast claims the ROW, not the ping, and stays
            // true when the row landed and the WhatsApp ping was refused.
            // `vendor_notified` is read at ONE home (EnquirySheet's submit),
            // where the response arrives; duplicating the read here would be a
            // second reader of the same fact for no gain.
            setEnquiryToast('Could not send. Try again.');
            setTimeout(()=>setEnquiryToast(null),2600);
          }}
        />
      )}

      {enquiryToast&&(
        <div style={{position:'fixed',bottom:'calc(env(safe-area-inset-bottom,0px) + 96px)',left:0,right:0,display:'flex',justifyContent:'center',zIndex:130,pointerEvents:'none'}}>
          <span style={{background:'rgba(8,6,8,.88)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',border:'0.5px solid rgba(255,255,255,.12)',borderRadius:20,padding:'8px 18px',fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:300,color:'rgba(248,247,245,.88)',whiteSpace:'nowrap'}}>
            {enquiryToast}
          </span>
        </div>
      )}

      {/* Filter sheet */}
      {showFilter&&(
        <DiscFilterSheet visible={showFilter} onClose={()=>setShowFilter(false)} filters={filters} accent={accent} dark={dark}
          onApply={f=>{setFilters(f);setShowFilter(false);}}/>
      )}
    </div>
  );
}
