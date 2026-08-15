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
         type CoupleReceipt, type CoupleBooking } from '@/lib/frost/journey';
import { formatRs } from '@/lib/vendor/format';
import { getAccessToken } from '@/lib/frost-api/_base';

// ── EXPENSES ROOM ──────────────────────────────────────────────────────────────
// Three slices: My Expenses (manual) | Vendors (bookings+pay) | Receipts (images)
// Full CRUD — mirrors the original journey/expenses/page.tsx exactly.

type ExpenseSlice = 'my'|'vendor'|'receipts';

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

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(''),2500); };

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
  function fmtDate(d:string|null|undefined):string {
    if(!d) return '';
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

  const inpStyle:React.CSSProperties = {width:'100%',padding:'12px 14px',background:'rgba(255,255,255,.06)',border:`0.5px solid ${line}`,borderRadius:8,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:ink,outline:'none',boxSizing:'border-box',userSelect:'text'};
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

      {/* Slice tabs */}
      <div style={{display:'flex',gap:8,padding:'10px 16px',borderBottom:`0.5px solid ${line}`,flexShrink:0}}>
        <SliceBtn id="my"       label="My expenses"/>
        <SliceBtn id="vendor"   label="Vendors"/>
        <SliceBtn id="receipts" label="Receipts"/>
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
                {(r.tags||[]).length>0&&<div style={{display:'flex',gap:4,flexWrap:'wrap' as any,marginTop:6}}>{(r.tags||[]).slice(0,3).map((tag:string)=><span key={tag} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',color:ac,padding:'2px 6px',border:`0.5px solid ${ac}33`,borderRadius:100}}>{tag}</span>)}</div>}
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6,flexShrink:0}}>
                {r.amount&&<div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:16,color:ac}}>{fmtRs(r.amount)}</div>}
                <button onClick={()=>setConfirmId(r.id)} style={{background:'none',border:'none',cursor:'pointer',color:inkMute,fontSize:16,padding:4}}>✕</button>
              </div>
            </div>
          ))}
        </>}
        <div style={{height:40}}/>
      </div>

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
