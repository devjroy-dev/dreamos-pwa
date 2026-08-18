'use client';
// ExpensesRoom — the money bloom.
//
// TDW_13 · D-4 · VERBATIM RELOCATION. This component's body is byte-identical to
// the lines it occupied in sanctuary/page.tsx at b1448c4. Only the import
// mechanism changed: the symbols it used to reach at module scope it now names
// at the top of its own file. No token conversion, no hygiene, no feature —
// those are P3 and P5 and they do not ride a relocation commit (F-1).

import React, { useState, useEffect } from 'react';
import { FS, getCoupleIdForFrost } from '@/lib/frost/tokens';
import { fetchReceipts, deleteReceipt, fetchBookings, recordPayment, uploadReceiptImage,
         fetchEnvelopes, fetchUnfiledReceipts, fetchEnvelopeCategories,
         createEnvelope, deleteEnvelope, fileReceipt,
         type CoupleReceipt, type CoupleBooking, type BudgetEnvelope } from '@/lib/frost/journey';
import { formatRs } from '@/lib/vendor/format';
import { getAccessToken } from '@/lib/frost-api/_base';
// TDW_15 P2. Two imports, two ONE-HOME rules, and neither map is authored here:
// the eleven display labels MOVED verbatim out of the vendor form (R-34.33), and
// every user-facing word this room renders is one of nine founder-vetoed bytes
// (R-35.9). A string literal added below is a defect by construction.
import { labelFor } from '@/lib/frost/categoryLabels';
import { ENVELOPE_COPY } from '@/lib/frost/envelopeCopy';

// ── EXPENSES ROOM ──────────────────────────────────────────────────────────────
// Three slices: My Expenses (manual) | Vendors (bookings+pay) | Receipts (images)
// Full CRUD — mirrors the original journey/expenses/page.tsx exactly.

// TDW_15 P2 (R-35.4) — 'env' is the FOURTH slice: her envelopes and the unfiled
// tray, co-resident with the three that already read this table.
//
// THE DOUBLE APPEARANCE IS BY DESIGN, AND IT IS NAMED HERE SO NOBODY LATER
// "FIXES" IT. `myExpenses` and `imageReceipts` below partition ONE table
// (`couple_receipts`) on `image_url`. The tray partitions the SAME table on
// `envelope_id IS NULL`. Those axes cross, so an unfiled receipt renders twice
// on this surface: as vault ink in its own slice, and as a filing candidate in
// the tray. Same row, two honest roles. NO ROW LEAVES ANY EXISTING SLICE.
type ExpenseSlice = 'my'|'vendor'|'receipts'|'env';

interface ExpensesRoomProps { dark:boolean; accent:string; signal:string; }

export function ExpensesRoom({ dark, accent }: ExpensesRoomProps) {
  const bg      = dark
    ? 'radial-gradient(ellipse 80% 45% at 80% 0%,rgba(196,133,106,.12) 0%,transparent 52%),linear-gradient(160deg,#1A0A0E 0%,#120608 40%,#0C0404 100%)'
    : 'radial-gradient(ellipse 80% 45% at 20% 0%,rgba(42,95,130,.16) 0%,transparent 52%),linear-gradient(160deg,#EEF0F6 0%,#E4E8F2 40%,#D8DEEC 100%)';
  const ink     = dark ? '#F5E5DC'                : '#0C1830';
  const inkSoft = dark ? 'rgba(245,229,220,.72)'  : 'rgba(12,24,48,.72)';
  const inkMute = dark ? 'rgba(196,133,106,.50)'  : 'rgba(42,80,130,.55)';
  const line    = dark ? 'rgba(196,133,106,.12)'  : 'rgba(42,95,130,.14)';
  const cardBg  = dark ? 'rgba(196,133,106,.05)'  : 'rgba(42,95,130,.05)';
  const cardBdr = dark ? 'rgba(196,133,106,.12)'  : 'rgba(42,95,130,.12)';
  const paper   = dark ? '#1A0A0E'                : '#EEF0F6';
  const brass   = '#C9A84C';
  const ac      = dark ? '#C4856A'                : '#2A5F82';

  const [uploading, setUploading] = React.useState(false);   // TDW_15 P1 β1
  const [slice,     setSlice]     = React.useState<ExpenseSlice>('my');
  const [receipts,  setReceipts]  = React.useState<CoupleReceipt[]>([]);
  const [bookings,  setBookings]  = React.useState<CoupleBooking[]>([]);
  const [loading,   setLoading]   = React.useState(true);
  const [toast,     setToast]     = React.useState('');
  const [fullImg,   setFullImg]   = React.useState<string|null>(null);
  const [showAdd,   setShowAdd]   = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string|null>(null);
  const [payBooking,setPayBooking]= React.useState<CoupleBooking|null>(null);
  const [newVendor, setNewVendor] = React.useState('');
  const [newAmount, setNewAmount] = React.useState('');
  const [newDate,   setNewDate]   = React.useState('');
  const [newDesc,   setNewDesc]   = React.useState('');
  const [payAmount, setPayAmount] = React.useState('');
  const [payDate,   setPayDate]   = React.useState('');
  const [saving,    setSaving]    = React.useState(false);

  // ── TDW_15 P2 · the envelope room's state ────────────────────────────────
  const [envelopes,  setEnvelopes]  = React.useState<BudgetEnvelope[]>([]);
  const [unfiled,    setUnfiled]    = React.useState<CoupleReceipt[]>([]);
  const [allowed,    setAllowed]    = React.useState<string[]>([]);
  const [showNewEnv, setShowNewEnv] = React.useState(false);
  const [newEnvName, setNewEnvName] = React.useState('');
  const [newEnvAmt,  setNewEnvAmt]  = React.useState('');
  const [confirmEnv, setConfirmEnv] = React.useState<BudgetEnvelope|null>(null);
  // The receipt currently being filed. Non-null opens the file sheet; the sheet
  // lists her envelopes and a press files it. There is deliberately no unfile
  // control (R-35.5) — re-filing into another envelope IS the misfile cure.
  const [filing,     setFiling]     = React.useState<CoupleReceipt|null>(null);

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(''),2500); };

  // Envelopes and the tray load on MOUNT rather than on first entry to the
  // slice, because the file affordance renders on receipt rows in the OTHER
  // slices too and it cannot offer a list it has not fetched. Failure is quiet
  // and non-blocking: an envelope read that 500s must not take the receipt
  // vault down with it, so the room degrades to its pre-P2 self.
  const reloadEnvelopes = React.useCallback(async ()=>{
    try {
      const [e,u] = await Promise.all([fetchEnvelopes(),fetchUnfiledReceipts()]);
      setEnvelopes(e); setUnfiled(u);
    } catch { /* the three original slices are unaffected; nothing is claimed */ }
  },[]);

  React.useEffect(()=>{ reloadEnvelopes(); },[reloadEnvelopes]);

  React.useEffect(()=>{
    Promise.all([fetchReceipts(),fetchBookings()]).then(([r,b])=>{
      setReceipts(r); setBookings(b); setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);

  // TDW_07 P4b · F-07.16 — THE REGISTER. This was a local L/K/glyph formatter; it now
  // delegates to the estate's ONE money donor, which renders "Rs 1,50,000" — grouped Indian
  // digits, the word Rs, no glyph, no short form. Cured at the DONOR rather than at each of
  // its call sites: one edit moves every figure this screen renders, and a call site the
  // executor missed cannot keep rendering the old register.
  const fmtRs = (n:number) => formatRs(n); // TDW_09 R-U25: the file's SECOND identical declaration — both are pass-throughs to the one home // TDW_09 R-U25: a pass-through; the home is lib/vendor/format
  // ── F-15.8's CURE (R-35.14, CE-35, 2026-08-18) ───────────────────────────
  // TWO COLUMN SHAPES REACH THIS FUNCTION, and the old body could only read one.
  // Every caller passes `r.receipt_date || r.created_at`:
  //   · `receipt_date` is a `date`      -> '2026-08-18'
  //   · `created_at`   is a `timestamptz` -> '2026-08-15T09:33:49.781224+00:00'
  // A photo receipt has NO `receipt_date` (nothing sets it — there is no OCR on
  // any plane), so the fallback fires and the timestamptz shape is the NORMAL
  // case for the tray, not an edge one. The old body appended 'T00:00:00'
  // unconditionally, producing '…+00:00T00:00:00' — an invalid Date — and the
  // isNaN guard then handed the RAW DATABASE STRING to the surface. Live and
  // visible: the founder walked it. ALL FOUR timestamptz spellings failed, not
  // just the microsecond one ('…Z' and '…+05:30' too).
  //
  // ── THE SUFFIX SURVIVES FOR THE DATE-ONLY SHAPE, AND HERE IS WHY ─────────
  // DO NOT "SIMPLIFY" THIS BY DROPPING THE CONCAT. A bare date string parses as
  // UTC MIDNIGHT; the suffix forces LOCAL midnight. Derived by command:
  //     TZ=America/New_York  new Date('2026-08-18')          -> 17 Aug 2026  WRONG
  //                          new Date('2026-08-18T00:00:00')  -> 18 Aug 2026  right
  // In IST the two agree, so the bug would be invisible to every seat testing
  // from India and would shift a day for every bride west of Greenwich.
  //
  // ── AND THE TIMESTAMPTZ BRANCH RENDERS IN HER TIMEZONE, DELIBERATELY ─────
  // '2026-08-15T21:00:00Z' reads 16 Aug in IST. That is the honest answer — the
  // row shows the date SHE filed it, in her time — and it means a server-side
  // report may legitimately differ from this row by one day. Not a defect.
  //
  // NO READER BYTE MOVED. The fallback was already wired at all three call
  // sites before this cure, so the whole fix lives in this body.
  //
  // ── THE TIMESTAMPTZ BRANCH IS AN EARLY RETURN, AND THAT SHAPE IS DELIBERATE.
  // A first draft folded both shapes into one ternary on the existing line —
  // and `tdw13_d4_extraction`'s canary convicted it, because that line is
  // RELOCATED CORPUS from the D-4 extraction and editing it would have wanted a
  // NINTH ruled allowlist entry, unchartered by this micro. Branching above it
  // leaves the date-only path BYTE-IDENTICAL to the tree it was extracted from,
  // which is both true and useful: the old behaviour is provably unchanged for
  // the shape that always worked.
  function fmtDate(d:string|null|undefined):string {
    if(!d) return '';
    if(!/^\d{4}-\d{2}-\d{2}$/.test(d)){
      const ts=new Date(d);
      return isNaN(ts.getTime()) ? d : ts.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
    }
    const dt=new Date(d+'T00:00:00');
    if(isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  }

  const totalCommitted  = bookings.reduce((s,b)=>s+(b.amount_total||0),0);
  const totalPaid       = bookings.reduce((s,b)=>s+(b.amount_paid||0),0);
  const totalBalance    = totalCommitted-totalPaid;
  const myExpenses      = receipts.filter(r=>!r.image_url);
  const imageReceipts   = receipts.filter(r=>!!r.image_url);
  const totalMySpend    = myExpenses.reduce((s,r)=>s+(r.amount||0),0);

  const handleAddExpense = async () => {
    if(!newVendor.trim()||!newAmount) return;
    setSaving(true);
    try {
      const token    = getAccessToken();
      const coupleId = getCoupleIdForFrost();
      if(token&&coupleId){
        const res = await fetch(`https://dream-os-production.up.railway.app/api/v2/couple/expenses/${coupleId}`,{
          method:'POST',headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json'},
          body:JSON.stringify({vendor_name:newVendor.trim(),amount:parseInt(newAmount.replace(/,/g,''),10),receipt_date:newDate||new Date().toISOString().slice(0,10),description:newDesc.trim()||null}),
        });
        const data=await res.json();
        if(data.ok&&data.expense) setReceipts(prev=>[data.expense,...prev]);
      }
      setShowAdd(false);setNewVendor('');setNewAmount('');setNewDate('');setNewDesc('');
      showToast('Expense added.');
    } catch { showToast('Could not add. Try again.'); }
    setSaving(false);
  };

  const handleDeleteReceipt = async (id:string) => {
    const prevReceipts = receipts;
    const removed = receipts.find(r=>r.id===id);
    setReceipts(prev=>prev.filter(r=>r.id!==id));
    setConfirmId(null);
    const ok = await deleteReceipt(id);
    if(ok){
      showToast('Removed.');
    } else {
      // Restore on failure
      setReceipts(prevReceipts);
      showToast('Could not remove. Try again.');
    }
  };

  const handlePayment = async () => {
    if(!payBooking||!payAmount) return;
    const amt=parseInt(payAmount.replace(/,/g,''),10);
    if(isNaN(amt)||amt<=0){showToast('Enter a valid amount.');return;}
    setSaving(true);
    try {
      const updated=await recordPayment(payBooking.id,amt,payDate||undefined);
      setBookings(prev=>prev.map(b=>b.id===updated.id?updated:b));
      setPayBooking(null);setPayAmount('');setPayDate('');
      showToast('Payment recorded.');
    } catch { showToast('Could not record.'); }
    setSaving(false);
  };

  // ── TDW_15 P2 · the envelope handlers ────────────────────────────────────

  // The picker opens with the canonical eleven fetched fresh (R-34.34): the
  // response is the taxonomy, `labelFor` is only its display half. Fetching on
  // OPEN rather than on mount keeps the cost off every Expenses visit, and a
  // failed fetch leaves `allowed` empty — the sheet still takes a typed name,
  // so the door never becomes unreachable because a list did not arrive.
  const openNewEnvelope = async () => {
    setNewEnvName(''); setNewEnvAmt(''); setShowNewEnv(true);
    if (allowed.length===0) {
      try { setAllowed(await fetchEnvelopeCategories()); } catch { /* typed name still works */ }
    }
  };

  const handleCreateEnvelope = async () => {
    const name = newEnvName.trim();
    if(!name) return;
    // Whole rupees. `amount_inr` is an integer column with CHECK >= 0, and an
    // empty field is a legal zero — an envelope with no ceiling yet is a real
    // state, not an incomplete form.
    const amt = newEnvAmt.trim() ? parseInt(newEnvAmt.replace(/,/g,''),10) : 0;
    if(isNaN(amt)||amt<0){showToast('Enter a valid amount.');return;}
    setSaving(true);
    try {
      const made = await createEnvelope(name, amt);
      setEnvelopes(prev=>[...prev, made]);   // the SERVER's row, never a local guess
      setShowNewEnv(false); setNewEnvName(''); setNewEnvAmt('');
    } catch { showToast('Could not add. Try again.'); }
    setSaving(false);
  };

  // Her receipts UNFILE rather than dying (ON DELETE SET NULL, F-b), so the
  // tray must be re-read after a delete or it will be short by exactly the rows
  // the cascade just returned to it. That is why this refetches both.
  const handleDeleteEnvelope = async (env:BudgetEnvelope) => {
    setConfirmEnv(null);
    const okDel = await deleteEnvelope(env.id);
    if(!okDel){ showToast('Could not remove. Try again.'); return; }
    await reloadEnvelopes();
    showToast('Removed.');
  };

  // FILING. The receipt leaves the tray and the envelope's spend floor moves,
  // and BOTH of those are the server's arithmetic — `spent` is a COALESCE sum
  // it computes per read (R-34.22), so a local increment would be a guess that
  // silently disagrees with the next refresh. Refetch, never patch.
  const handleFile = async (receiptId:string, envelopeId:string) => {
    setFiling(null);
    setSaving(true);
    try {
      const updated = await fileReceipt(receiptId, envelopeId);
      setReceipts(prev=>prev.map(r=>r.id===updated.id?updated:r));
      await reloadEnvelopes();
    } catch { showToast('Could not add. Try again.'); }
    setSaving(false);
  };

  const inpStyle:React.CSSProperties = {width:'100%',padding:'12px 14px',background:'rgba(255,255,255,.06)',border:`0.5px solid ${line}`,borderRadius:8,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:ink,outline:'none',boxSizing:'border-box',userSelect:'text'};
  // ── THE HAIRLINE (R-34.29, R-34.22) ──────────────────────────────────────
  // THE FILL IS `inkSoft` BELOW THE THRESHOLD AND `ac` AT FULL STRENGTH ABOVE;
  // THE RAIL STAYS `line`. No new token is minted, and the crossing is
  // deliberately NOT ink -> accent: `ac` is already the arc of this room — the
  // figures, the tabs, the tags — and the rail is that same hue at low alpha,
  // so an ink-to-accent crossing would have read as a brightness wobble on a
  // decorative colour rather than as a signal.
  //
  // THE SIGNAL IS WORDLESS, BY RULING, AND THE MECHANISM IS WHY IT HAS TO BE.
  // `spent` is a COALESCE sum over TYPED amounts on FILED receipts. A receipt
  // can be FILED and UNTYPED (`amount IS NULL` — no OCR exists on any plane),
  // so it contributes zero and the figure is an honest FLOOR, never a total.
  // Two emptinesses, never conflated: unfiled is `envelope_id IS NULL`, untyped
  // is `amount IS NULL`. A percentage label would claim a precision this number
  // does not have; a hue does not.
  //
  // A ZERO CEILING RENDERS THE RAIL AND NOTHING ELSE. There is no ratio to
  // draw, and a full bar over a ceiling she has not set yet would invent alarm.
  const HAIR_THRESHOLD = 0.9;
  const Hairline = ({spent,ceiling}:{spent:number;ceiling:number}) => {
    const ratio = ceiling>0 ? spent/ceiling : 0;
    const past  = ceiling>0 && ratio>=HAIR_THRESHOLD;
    return (
      <div style={{height:2,borderRadius:2,background:line,overflow:'hidden',marginTop:8}}>
        {ceiling>0&&<div style={{height:'100%',width:`${Math.min(ratio,1)*100}%`,
          background:past?ac:inkSoft,borderRadius:2}}/>}
      </div>
    );
  };

  // ── THE FILE AFFORDANCE (R-35.5 · PRESS, NEVER DRAG) ─────────────────────
  // DRAG IS DEFERRED AND CHARTERED SEPARATELY (R-34.28). HTML5 drag-and-drop
  // does not fire on touch, the bride plane is a phone, and the estate's one
  // drag surface is admin/desktop and ships a press fallback beside its drop
  // precisely because its author knew the same thing. So the press IS the
  // interaction here, not a fallback behind one.
  //
  // It renders on receipt rows in EVERY slice that shows receipts, including
  // the tray. On the `my` rows it sits inside a row whose own tap opens the
  // delete confirm; that tap ships BYTE-UNTOUCHED and keeps its meaning, so
  // this control stops the event rather than sharing it. A file gesture that
  // also armed a delete would be the worst control on the surface.
  //
  // There is NO UNFILE CONTROL in this delivery. Re-filing into another
  // envelope is the misfile cure; the door's legal `envelope_id: null` body has
  // no caller here and that gap is declared in the handover, not hidden.
  const FileBtn = ({r}:{r:CoupleReceipt}) => {
    const home = envelopes.find(e=>e.id===r.envelope_id);
    return (
      // ── F-15.15's CURE (R-35.15, ARM P3) ─────────────────────────────────
      // THE INVARIANT THIS STYLE HOLDS, and the reason each byte is what it is:
      //   1 · THE VENDOR NAME IS NEVER FULLY CONSUMED BY THE PILL.
      //   2 · THE PILL NEVER VANISHES ENTIRELY — it may ellipsise, because
      //       `PHOTOG…` still names her envelope while `Ana…` named nothing.
      //       That second failure WAS the disease, walked on device at 374px.
      //
      // WHAT WENT WRONG: this pill shipped `flexShrink:0` beside a text block
      // that is `flex:1,minWidth:0`. A flex item with `flex-basis:0` has a
      // SCALED shrink factor of zero, so the text block absorbed none of the
      // overflow and ALL of it — the row's whole identity — while the pill kept
      // every pixel of its 140. `Ananya Studio` became `Ana…` and the date
      // wrapped to three lines the moment a long envelope name arrived.
      //
      // WHY BOTH BYTES, AND NOT EITHER ALONE:
      //   · `maxWidth:96` alone (cap only) pins a pixel and holds at 374px by
      //     arithmetic rather than by construction — it says nothing about 320.
      //   · `flexShrink:1` alone is UNBOUNDED here: `overflow:hidden` makes this
      //     item's `min-width:auto` resolve to 0, so the pill can shrink to
      //     literally nothing and invariant 2 dies silently.
      //   · Together with a floor, both invariants hold at every width.
      //
      // THE FLOOR IS DERIVED, NOT CHOSEN. Worst case is the `my` row at 320px:
      // 320 − 2×24 gutter − 40 icon − 3×14 gaps − ~62 amount = 128px for
      // [text | pill]. At the 96 cap the text keeps only 32px; at this 64 floor
      // it keeps 64px — enough for an ellipsised name rather than none. The
      // tray row carries no icon and is 40px better off everywhere.
      //
      // THE BENCH PINS THE INVARIANTS, NEVER THESE NUMBERS (F-15.12's doctrine):
      // it asserts the pill can shrink AND has a nonzero floor AND is capped —
      // structurally. It must never assert 96, 64, 320 or 374, or it becomes a
      // tripwire against ever tuning this row again.
      <button onClick={(e)=>{e.stopPropagation();setFiling(r);}}
        style={{background:home?`${ac}14`:'transparent',border:`0.5px solid ${home?ac:line}`,
          borderRadius:100,padding:'3px 10px',cursor:'pointer',
          flexShrink:1,minWidth:64,maxWidth:96,
          fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
          textTransform:'uppercase' as any,color:home?ac:inkMute,
          overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
        {home?home.name:ENVELOPE_COPY.file}
      </button>
    );
  };

  const SliceBtn = ({id,label}:{id:ExpenseSlice;label:string}) => (
    <button onClick={()=>setSlice(id)} style={{flex:1,padding:'9px 0',borderRadius:8,border:`0.5px solid ${slice===id?ac:line}`,background:slice===id?`${ac}14`:'transparent',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:slice===id?ac:inkMute,cursor:'pointer'}}>
      {label}
    </button>
  );

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',background:bg,overflow:'hidden'}}>
      {toast&&<div style={{position:'fixed',top:'calc(env(safe-area-inset-top,0px) + 16px)',left:'50%',transform:'translateX(-50%)',background:ink,color:paper,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,padding:'8px 18px',borderRadius:20,zIndex:400,pointerEvents:'none',whiteSpace:'nowrap'}}>{toast}</div>}

      {/* Full-screen receipt image viewer */}
      {fullImg&&<div onClick={()=>setFullImg(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.92)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <img src={fullImg} alt="Receipt" style={{maxWidth:'94vw',maxHeight:'88vh',objectFit:'contain',borderRadius:8}}/>
        <button onClick={()=>setFullImg(null)} style={{position:'absolute',top:24,right:24,background:'rgba(255,255,255,.12)',border:'none',borderRadius:20,width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'rgba(245,240,232,.8)',fontSize:18}}>✕</button>
      </div>}

      {/* THE SNAPSHOT STRIP DOES NOT RENDER FOR 'env', and that is a ruling
          rather than an omission. Every snapshot below carries a LABEL, and this
          room's copy set is CLOSED at nine founder-vetoed bytes (R-35.9): an
          envelope headline would need a tenth. It is also the honest choice —
          `spent` is a floor and not a total (R-34.22), so one aggregate figure
          at the top of this room would read as a total and be wrong by every
          untyped receipt. The hairlines say it per envelope, wordlessly.

          THE GATE IS A WRAPPER, NOT AN EDIT. The two lines below are relocated
          bytes under `tdw13_d4_extraction`'s canary, and editing one to add a
          condition would have EATEN it — an unruled eighth allowlist entry for
          a presentational gate. Wrapping costs two new lines and keeps the
          canary's teeth exactly where they were. */}
      {slice!=='env'&&<>
      {/* Snapshot */}
      <div style={{padding:'16px 20px 10px',borderBottom:`0.5px solid ${line}`,flexShrink:0}}>
        {slice==='my'&&<div style={{display:'flex',alignItems:'baseline',gap:8}}>
          <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:22,color:ac,lineHeight:1,fontFeatureSettings:'"opsz" 144'}}>{loading?'…':fmtRs(totalMySpend)}</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>total spent</div>
        </div>}
        {slice==='vendor'&&<div style={{display:'flex',gap:24}}>
          <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:3}}>Committed</div><div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:22,color:ac}}>{fmtRs(totalCommitted)}</div></div>
          <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:3}}>Paid</div><div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:22,color:'#6B9E8F'}}>{fmtRs(totalPaid)}</div></div>
          <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:3}}>Balance</div><div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:22,color:ink}}>{fmtRs(totalBalance)}</div></div>
        </div>}
        {slice==='receipts'&&<div style={{display:'flex',alignItems:'baseline',gap:8}}>
          <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:22,color:ac,lineHeight:1,fontFeatureSettings:'"opsz" 144'}}>{imageReceipts.length}</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>receipt image{imageReceipts.length!==1?'s':''}</div>
        </div>}
      </div>
      </>}

      {/* Slice tabs */}
      <div style={{display:'flex',gap:8,padding:'10px 16px',borderBottom:`0.5px solid ${line}`,flexShrink:0}}>
        <SliceBtn id="my"       label="My expenses"/>
        <SliceBtn id="vendor"   label="Vendors"/>
        <SliceBtn id="receipts" label="Receipts"/>
        <SliceBtn id="env"      label={ENVELOPE_COPY.tab}/>
      </div>

      {/* Content */}
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any}}>
        {loading&&<div style={{padding:32,textAlign:'center' as any,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>loading…</div>}

        {/* MY EXPENSES */}
        {!loading&&slice==='my'&&<>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:`14px ${FS.gutter}px 8px`}}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:ink,fontFeatureSettings:'"opsz" 9'}}>What I've spent.</div>
            <button onClick={()=>setShowAdd(true)} style={{display:'flex',alignItems:'center',gap:4,padding:'6px 12px',borderRadius:100,border:`0.5px solid ${ac}44`,background:'transparent',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:ac,cursor:'pointer'}}>+ Add</button>
          </div>
          {myExpenses.length===0&&<div style={{padding:`${FS.s5}px ${FS.gutter}px`,textAlign:'center' as any,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>No expenses yet. Tap Add to log one.</div>}
          {myExpenses.map(r=>(
            <div key={r.id} onClick={()=>setConfirmId(r.id)} style={{display:'flex',alignItems:'center',gap:14,padding:`12px ${FS.gutter}px`,borderBottom:`0.5px solid ${line}`,cursor:'pointer'}}>
              <div style={{width:40,height:40,borderRadius:8,background:cardBg,border:`0.5px solid ${cardBdr}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:inkMute}}>EXP</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ink,fontFeatureSettings:'"opsz" 9',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.vendor_name||r.description||'Expense'}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginTop:2}}>{fmtDate(r.receipt_date||r.created_at)}</div>
              </div>
              {r.amount&&<div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:16,color:ac,flexShrink:0}}>{fmtRs(r.amount)}</div>}
              <FileBtn r={r}/>
            </div>
          ))}
        </>}

        {/* VENDOR EXPENSES */}
        {!loading&&slice==='vendor'&&<>
          <div style={{padding:`14px ${FS.gutter}px 8px`,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:ink,fontFeatureSettings:'"opsz" 9'}}>My team.</div>
          {bookings.length===0&&<div style={{padding:`${FS.s5}px ${FS.gutter}px`,textAlign:'center' as any,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>No bookings yet. Add vendors in the Vendors room.</div>}
          {bookings.map(b=>{
            const balance=(b.amount_total||0)-(b.amount_paid||0);
            return(
              <div key={b.id} style={{display:'flex',alignItems:'center',gap:14,padding:`12px ${FS.gutter}px`,borderBottom:`0.5px solid ${line}`}}>
                <div style={{width:36,height:36,borderRadius:18,border:`0.5px solid ${line}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:inkMute}}>{(b.category?.[0]||b.vendor_name?.[0]||'·').toUpperCase()}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ink,fontFeatureSettings:'"opsz" 9',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.vendor_name}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',color:inkMute,marginTop:2}}>
                    {b.category}{b.amount_paid>0?` · paid ${fmtRs(b.amount_paid)}`:''}
                    {balance>0?` · bal ${fmtRs(balance)}`:''}
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0}}>
                  {b.amount_total&&<div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:16,color:ink}}>{fmtRs(b.amount_total)}</div>}
                  <button onClick={()=>{setPayBooking(b);setPayAmount('');setPayDate('');}} style={{padding:'4px 10px',borderRadius:100,border:`0.5px solid ${ac}44`,background:'transparent',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:ac,cursor:'pointer'}}>Pay</button>
                </div>
              </div>
            );
          })}
        </>}

        {/* RECEIPTS */}
        {!loading&&slice==='receipts'&&<>
          <div style={{padding:`14px ${FS.gutter}px 4px`,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:ink,fontFeatureSettings:'"opsz" 9'}}>Receipt vault.</div>
          <div style={{padding:`0 ${FS.gutter}px 12px`,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>Forward receipt images to Dream Ai on WhatsApp — they land here automatically.</div>
          {/* ── TDW_15 · P1 · β1 — SHE CAN FILE A RECEIPT PHOTO HERE ─────────
              Until ZIP 1 built `POST /couple/receipts/:coupleId/image`, NOTHING
              on the http plane could write `couple_receipts.image_url`: the
              typed POST omits the column, `expenses.js` nulls it, and the only
              writer in the estate was `brideEngine`'s `save_receipt` — reachable
              only by forwarding a photo to Mira on WhatsApp. That is the parity
              matrix's G-3, image half, and this control is its door.

              NO OCR (R-34.7). She files the photo; the amount stays hers to
              type. Nothing in the estate extracts a figure from a receipt on any
              plane, and a button that implied otherwise would be promising a
              capability that does not exist.

              THE INPUT IS HIDDEN AND THE LABEL DRIVES IT. `<input type="file">`
              cannot be styled into this house, so the estate's own pattern
              applies: a label element owning the input, which is one tap on a
              handset and opens the camera or the roll by the OS's choice. */}
          <div style={{padding:`0 ${FS.gutter}px 14px`}}>
            <label style={{display:'inline-flex',alignItems:'center',gap:5,padding:'7px 14px',borderRadius:100,
              border:`0.5px solid ${ac}`,background:`${ac}22`,
              fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
              textTransform:'uppercase' as any,color:ac,
              cursor:uploading?'default':'pointer',opacity:uploading?.5:1}}>
              {uploading?'Adding…':'Add a photo'}
              {/* ACCEPT IS AN EXPLICIT LIST, AND THAT IS A FINDING'S CURE, NOT
                  A PREFERENCE. An accept value of image-slash-wildcard carries
                  slash then star, and every source-scanning instrument in this
                  estate strips block comments with a naive non-greedy regex
                  before it counts anything. That wildcard OPENS a comment the
                  scanner
                  never closes until the next comment-close — and it silently ate two
                  live controls out of the receipt list below (the thumbnail tap
                  and the delete ✕) the first time this control was written.
                  The sealed census would have moved by the wrong number, in the
                  wrong direction, with nothing to say so.

                  The real cure is the stripper, which FROST_BLOOMS already
                  files as wanting its own micro; it is not a UI sitting's. The
                  list below is equivalent for every image a handset produces —
                  HEIC and HEIF are there because an iPhone's own camera writes
                  them — and `tdw15_p1_events.proof.mjs` §6 now asserts no JSX
                  attribute on this surface carries the sequence again. */}
              <input type="file" accept="image/jpeg,image/png,image/heic,image/heif,image/webp" disabled={uploading}
                style={{display:'none'}}
                onChange={async (e)=>{
                  const file=e.target.files&&e.target.files[0];
                  e.target.value='';                       // so the same file can be picked twice
                  if(!file||uploading) return;
                  setUploading(true);
                  try {
                    const made=await uploadReceiptImage(file);
                    setReceipts(prev=>[made,...prev]);     // the SERVER's row, never a local guess
                  } catch { showToast('Could not add that photo. Try again.'); }
                  setUploading(false);
                }}/>
            </label>
          </div>
          {imageReceipts.length===0&&<div style={{padding:`${FS.s5}px ${FS.gutter}px`,textAlign:'center' as any,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>No receipts yet.</div>}
          {imageReceipts.map(r=>(
            <div key={r.id} style={{display:'flex',alignItems:'flex-start',gap:14,padding:`12px ${FS.gutter}px`,borderBottom:`0.5px solid ${line}`}}>
              <div onClick={()=>r.image_url&&setFullImg(r.image_url)} style={{width:56,height:72,borderRadius:8,overflow:'hidden',flexShrink:0,background:cardBg,border:`0.5px solid ${cardBdr}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:r.image_url?'zoom-in':'default'}}>
                {r.image_url?<img src={r.image_url} alt="Receipt" style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy"/>:<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:inkMute}}>REC</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ink,fontFeatureSettings:'"opsz" 9'}}>{r.vendor_name||r.description||'Receipt'}</div>
                {r.description&&r.vendor_name&&<div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,marginTop:2,lineHeight:1.4,fontFeatureSettings:'"opsz" 9'}}>{r.description}</div>}
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginTop:4}}>{fmtDate(r.receipt_date||r.created_at)}</div>
                {/* S3 · ON THE RECEIPT ROW, ONCE, AND NEVER AT THE ENVELOPE
                    (R-34.30). It is a STATE, not an error: no OCR exists on any
                    plane (R-34.7), so she files the photo and types the amount
                    when she has it. `amount === null` is UNTYPED and is a
                    different emptiness from unfiled (R-34.22) — this line reads
                    the amount, never `envelope_id`. */}
                {r.amount===null&&<div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,marginTop:2,fontFeatureSettings:'"opsz" 9'}}>{ENVELOPE_COPY.photoUntyped}</div>}
                {(r.tags||[]).length>0&&<div style={{display:'flex',gap:4,flexWrap:'wrap' as any,marginTop:6}}>{(r.tags||[]).slice(0,3).map((tag:string)=><span key={tag} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',color:ac,padding:'2px 6px',border:`0.5px solid ${ac}33`,borderRadius:100}}>{tag}</span>)}</div>}
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6,flexShrink:0}}>
                {r.amount&&<div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:16,color:ac}}>{fmtRs(r.amount)}</div>}
                <FileBtn r={r}/>
                <button onClick={()=>setConfirmId(r.id)} style={{background:'none',border:'none',cursor:'pointer',color:inkMute,fontSize:16,padding:4}}>✕</button>
              </div>
            </div>
          ))}
        </>}
        {/* ENVELOPES — the fourth slice: her envelopes, then the unfiled tray.
            NO SECTION HEADINGS, and that is the copy ruling rather than a
            design shortcut: the set is closed at nine bytes and a heading pair
            would be the tenth and eleventh. The two collections are separated
            by the tray's own rule line instead. RAISED IN THE HANDOVER as a
            fork for the chair, never authored here. */}
        {!loading&&slice==='env'&&<>
          <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',padding:`14px ${FS.gutter}px 8px`}}>
            <button onClick={openNewEnvelope} style={{display:'flex',alignItems:'center',gap:4,padding:'6px 12px',borderRadius:100,border:`0.5px solid ${ac}44`,background:'transparent',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:ac,cursor:'pointer'}}>+ Add</button>
          </div>

          {envelopes.length===0&&<div style={{padding:`${FS.s5}px ${FS.gutter}px`,textAlign:'center' as any,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>{ENVELOPE_COPY.emptyEnvelopes}</div>}

          {envelopes.map(env=>(
            <div key={env.id} style={{padding:`12px ${FS.gutter}px`,borderBottom:`0.5px solid ${line}`}}>
              <div style={{display:'flex',alignItems:'baseline',gap:10}}>
                <div style={{flex:1,minWidth:0,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ink,fontFeatureSettings:'"opsz" 9',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{env.name}</div>
                <div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:16,color:ac,flexShrink:0}}>{fmtRs(env.spent)}</div>
                {env.amount_inr>0&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',color:inkMute,flexShrink:0}}>{fmtRs(env.amount_inr)}</div>}
                <button onClick={()=>setConfirmEnv(env)} style={{background:'none',border:'none',cursor:'pointer',color:inkMute,fontSize:16,padding:4,flexShrink:0}}>✕</button>
              </div>
              <Hairline spent={env.spent} ceiling={env.amount_inr}/>
            </div>
          ))}

          {/* THE TRAY. A DOOR, not a filter over the list above: the receipt
              read is paginated upstream and a tray that silently truncates is
              worse than no tray. These same rows also render in their own slice
              — vault ink there, filing candidates here. */}
          <div style={{marginTop:18,borderTop:`0.5px solid ${line}`}}/>
          {unfiled.length===0&&<div style={{padding:`${FS.s5}px ${FS.gutter}px`,textAlign:'center' as any,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>{ENVELOPE_COPY.emptyTray}</div>}
          {unfiled.map(r=>(
            <div key={r.id} style={{display:'flex',alignItems:'center',gap:14,padding:`12px ${FS.gutter}px`,borderBottom:`0.5px solid ${line}`}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ink,fontFeatureSettings:'"opsz" 9',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.vendor_name||r.description||'Receipt'}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginTop:2}}>{fmtDate(r.receipt_date||r.created_at)}</div>
              </div>
              {r.amount&&<div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:16,color:ac,flexShrink:0}}>{fmtRs(r.amount)}</div>}
              <FileBtn r={r}/>
            </div>
          ))}
        </>}

        <div style={{height:40}}/>
      </div>

      {/* New envelope sheet — scrim + bottom sheet, the surface's own idiom, THIRD
          use (Add Expense and Record payment are the other two). */}
      {showNewEnv&&<>
        <div onClick={()=>setShowNewEnv(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:200}}/>
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:201,background:paper,borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`,maxHeight:'85vh',overflowY:'auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:22,color:ink,fontFeatureSettings:'"opsz" 9'}}>{ENVELOPE_COPY.sheetTitle}</div>
            <button onClick={()=>setShowNewEnv(false)} style={{background:'none',border:'none',cursor:'pointer',color:inkMute,fontSize:20,padding:4}}>✕</button>
          </div>

          {/* THE PICKER · R-34.31 + R-34.34. The canonical eleven are THE PICKER,
              never seeded rows — the room opens empty and she chooses. This maps
              the SERVER'S `allowed[]` response, NEVER `Object.keys(CAT_LABEL)`:
              a token dream-os adds later must render through `labelFor`'s
              fallback instead of silently vanishing from her choices. Pressing
              one fills the name field, which she may then overwrite — the
              picker proposes, it does not decide. */}
          {allowed.length>0&&<div style={{display:'flex',flexWrap:'wrap' as any,gap:6,marginBottom:14}}>
            {allowed.map(token=>(
              <button key={token} onClick={()=>setNewEnvName(labelFor(token))}
                style={{borderRadius:100,padding:'8px 14px',cursor:'pointer',
                  border:`0.5px solid ${newEnvName===labelFor(token)?ac:line}`,
                  background:newEnvName===labelFor(token)?`${ac}14`:'transparent',
                  fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,
                  color:newEnvName===labelFor(token)?ac:inkSoft,fontFeatureSettings:'"opsz" 9'}}>
                {labelFor(token)}
              </button>
            ))}
          </div>}

          <div style={{marginBottom:14}}>
            <input value={newEnvName} onChange={e=>setNewEnvName(e.target.value)} placeholder={ENVELOPE_COPY.namePlaceholder} style={inpStyle}/>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>{ENVELOPE_COPY.amountLabel}</div>
            <input value={newEnvAmt} onChange={e=>setNewEnvAmt(e.target.value)} placeholder="150000" inputMode="numeric" style={inpStyle}/>
          </div>
          <button onClick={handleCreateEnvelope} disabled={saving||!newEnvName.trim()}
            style={{width:'100%',padding:14,borderRadius:8,border:'none',background:newEnvName.trim()?ac:`${ac}44`,color:paper,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,cursor:newEnvName.trim()?'pointer':'default'}}>
            {saving?'Recording…':ENVELOPE_COPY.sheetTitle}
          </button>
        </div>
      </>}

      {/* File sheet — the press-to-file destination picker (R-35.5). It lists the
          envelopes she has made; it does NOT offer the canonical eleven, because
          filing into a bucket that does not exist yet would be a create wearing
          a file's clothes. If she has none, the empty line says so and the sheet
          is a dead end by design rather than a silent no-op. */}
      {filing&&<>
        <div onClick={()=>setFiling(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:200}}/>
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:201,background:paper,borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`,maxHeight:'85vh',overflowY:'auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:22,color:ink,fontFeatureSettings:'"opsz" 9'}}>{filing.vendor_name||filing.description||'Receipt'}</div>
            <button onClick={()=>setFiling(null)} style={{background:'none',border:'none',cursor:'pointer',color:inkMute,fontSize:20,padding:4}}>✕</button>
          </div>
          {envelopes.length===0&&<div style={{padding:`${FS.s5}px 0`,textAlign:'center' as any,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>{ENVELOPE_COPY.emptyEnvelopes}</div>}
          {envelopes.map(env=>(
            <button key={env.id} onClick={()=>handleFile(filing.id,env.id)} disabled={saving}
              style={{display:'block',width:'100%',textAlign:'left' as any,padding:'14px 0',borderBottom:`0.5px solid ${line}`,background:'none',border:'none',cursor:'pointer',
                fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,
                color:env.id===filing.envelope_id?ac:ink,fontFeatureSettings:'"opsz" 9'}}>
              {env.name}
            </button>
          ))}
        </div>
      </>}

      {/* Delete-envelope confirm. S4 states the TRUE consequence before she
          confirms: the FK is ON DELETE SET NULL, so her receipts unfile and land
          back in the tray rather than dying with the bucket. */}
      {confirmEnv&&<>
        <div onClick={()=>setConfirmEnv(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:200}}/>
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:201,background:paper,borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`}}>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:22,color:ink,marginBottom:8,fontFeatureSettings:'"opsz" 9'}}>{confirmEnv.name}</div>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,marginBottom:20,fontFeatureSettings:'"opsz" 9'}}>{ENVELOPE_COPY.deleteConsequence}</div>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>handleDeleteEnvelope(confirmEnv)} style={{flex:1,padding:14,background:'rgba(184,69,62,.15)',border:'0.5px solid rgba(184,69,62,.4)',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'#B8453E',cursor:'pointer'}}>Remove</button>
            <button onClick={()=>setConfirmEnv(null)} style={{flex:1,padding:14,background:'rgba(255,255,255,.06)',border:`0.5px solid ${line}`,borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,cursor:'pointer'}}>Keep</button>
          </div>
        </div>
      </>}

      {/* Add Expense sheet */}
      {showAdd&&<>
        <div onClick={()=>setShowAdd(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:200}}/>
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:201,background:paper,borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`,maxHeight:'85vh',overflowY:'auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:22,color:ink,fontFeatureSettings:'"opsz" 9'}}>Add an expense</div>
            <button onClick={()=>setShowAdd(false)} style={{background:'none',border:'none',cursor:'pointer',color:inkMute,fontSize:20}}>✕</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Where / who</div>
              <input value={newVendor} onChange={e=>setNewVendor(e.target.value)} placeholder="Sabya showroom, Carma…" style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Amount (Rs)</div>
              <input value={newAmount} onChange={e=>setNewAmount(e.target.value)} placeholder="15000" inputMode="numeric" style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Date (optional)</div>
              <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Notes (optional)</div>
              <input value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder="Trial deposit, transport…" style={inpStyle}/></div>
            <button onClick={handleAddExpense} disabled={saving||!newVendor.trim()||!newAmount}
              style={{marginTop:4,padding:'14px 0',background:ac,border:'none',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:dark?'#1A0810':'#FFFFFF',cursor:'pointer',opacity:(saving||!newVendor.trim()||!newAmount)?.5:1}}>
              {saving?'Adding…':'Add expense'}
            </button>
          </div>
        </div>
      </>}

      {/* Confirm delete */}
      {confirmId&&<>
        <div onClick={()=>setConfirmId(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:200}}/>
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:201,background:paper,borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`}}>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:ink,marginBottom:8,fontFeatureSettings:'"opsz" 9'}}>Remove this?</div>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,marginBottom:24,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>It will be removed from your list.</div>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>handleDeleteReceipt(confirmId)} style={{flex:1,padding:14,background:'rgba(184,69,62,.15)',border:'0.5px solid rgba(184,69,62,.4)',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'#B8453E',cursor:'pointer'}}>Remove</button>
            <button onClick={()=>setConfirmId(null)} style={{flex:1,padding:14,background:'rgba(255,255,255,.06)',border:`0.5px solid ${line}`,borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,cursor:'pointer'}}>Keep</button>
          </div>
        </div>
      </>}

      {/* Pay vendor sheet */}
      {payBooking&&<>
        <div onClick={()=>setPayBooking(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:200}}/>
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:201,background:paper,borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:ink,fontFeatureSettings:'"opsz" 9'}}>Record payment</div>
            <button onClick={()=>setPayBooking(null)} style={{background:'none',border:'none',cursor:'pointer',color:inkMute,fontSize:20}}>✕</button>
          </div>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,marginBottom:20,fontFeatureSettings:'"opsz" 9'}}>{payBooking.vendor_name} · paid so far: {fmtRs(payBooking.amount_paid)}</div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Amount (Rs)</div>
              <input value={payAmount} onChange={e=>setPayAmount(e.target.value)} placeholder="50000" inputMode="numeric" style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Date (optional)</div>
              <input type="date" value={payDate} onChange={e=>setPayDate(e.target.value)} style={inpStyle}/></div>
            <button onClick={handlePayment} disabled={saving||!payAmount}
              style={{padding:'14px 0',background:ac,border:'none',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:dark?'#1A0810':'#FFFFFF',cursor:'pointer',opacity:(saving||!payAmount)?.5:1}}>
              {saving?'Recording…':'Record payment'}
            </button>
          </div>
        </div>
      </>}
    </div>
  );
}
