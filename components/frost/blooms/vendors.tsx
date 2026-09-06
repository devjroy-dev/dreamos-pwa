'use client';
// VendorsRoom — the vendor pipeline bloom.
//
// TDW_13 · D-4 · VERBATIM RELOCATION. This component's body is byte-identical to
// the lines it occupied in sanctuary/page.tsx at b1448c4. Only the import
// mechanism changed: the symbols it used to reach at module scope it now names
// at the top of its own file. No token conversion, no hygiene, no feature —
// those are P3 and P5 and they do not ride a relocation commit (F-1).

import React, { useState, useEffect } from 'react';
import { FS } from '@/lib/frost/tokens';
import { fetchBookings, createBooking, updateBooking, deleteBooking, recordPayment,
         fetchEnquiries, fetchEnvelopeCategories,
         type CoupleBooking, type CoupleEnquiry } from '@/lib/frost/journey';
import { labelFor } from '@/lib/frost/categoryLabels';
import { waNumberFor } from '@/lib/waNumbers';
import { formatRs } from '@/lib/vendor/format';


// ── VENDORS ROOM ──────────────────────────────────────────────────────────────
// Full CRUD: Add · Edit · Pay · Delete — mirrors journey/vendors/page.tsx exactly.

// ── THE TAXONOMY IS THE SERVER'S, NOT THIS FILE'S (F-15.10 · R-35.26/.28) ────
// A hardcoded `VENDOR_CATEGORIES` stood here carrying the pre-0123 eleven, and
// its default was `photographer` — a token migration 0126 RETIRES. Shipping the
// migration without this edit would have refused every add-booking that accepted
// the default picker value.
//
// R-34.34 is the law being followed: the SERVER'S `allowed[]` answers "which
// tokens exist", `labelFor` is only its display half. `Object.keys(CAT_LABEL)`
// is NOT the taxonomy — `lib/frost/categoryLabels.ts:22-25` rules that in ink,
// and `components/frost/blooms/expenses.tsx:656-657` is the committed reader
// following it. This is the third such reader.
//
// DEGRADED-BUT-FUNCTIONAL (R-35.28 rider). `category` is NOT NULL and this
// control is a select, so the empty-`allowed` posture expenses.tsx can afford —
// it still takes a typed name — is not available here. On a failed fetch the
// picker holds the single fallback below and reads `Something else` on her
// glass: no error copy, no new byte, indistinguishable from designed, and she
// can always complete a booking. `other` is the founder's own
// fold-everything-else token, it survives 0126, and the edit sheet reads the
// same door for her re-categorisation.
const CATEGORY_FALLBACK = ['other'];
type VendorCategory = string;
const PIPELINE_STATES = [{key:'paid',label:'PAID'},{key:'advance_paid',label:'ADVANCE PAID'},{key:'booked',label:'BOOKED'}];

interface VendorsRoomProps { dark:boolean; accent:string; }

export function VendorsRoom({ dark, accent }: VendorsRoomProps) {
  const bg      = dark
    ? 'radial-gradient(ellipse 80% 45% at 80% 0%,rgba(196,133,106,.12) 0%,transparent 52%),linear-gradient(160deg,#1A0A0E 0%,#120608 40%,#0C0404 100%)'
    : 'radial-gradient(ellipse 80% 45% at 20% 0%,rgba(42,95,130,.16) 0%,transparent 52%),linear-gradient(160deg,#EEF0F6 0%,#E4E8F2 40%,#D8DEEC 100%)';
  const ink     = dark ? '#F5E5DC'                : '#0C1830';
  const inkSoft = dark ? 'rgba(245,229,220,.72)'  : 'rgba(12,24,48,.72)';
  const inkMute = dark ? 'rgba(196,133,106,.50)'  : 'rgba(42,80,130,.55)';
  const line    = dark ? 'rgba(196,133,106,.12)'  : 'rgba(42,95,130,.14)';
  const paper   = dark ? '#1A0A0E'                : '#EEF0F6';
  const ac      = dark ? '#C4856A'                : '#2A5F82';

  const [bookings, setBookings] = React.useState<CoupleBooking[]>([]);
  const [loading,  setLoading]  = React.useState(true);
  const [toast,    setToast]    = React.useState('');
  const [showAdd,  setShowAdd]  = React.useState(false);
  const [action,   setAction]   = React.useState<CoupleBooking|null>(null);
  const [showEdit, setShowEdit] = React.useState(false);
  const [showPay,  setShowPay]  = React.useState(false);
  const [saving,   setSaving]   = React.useState(false);

  const [newName,  setNewName]  = React.useState('');
  const [newCat,   setNewCat]   = React.useState<VendorCategory>('other');
  const [newTotal, setNewTotal] = React.useState('');
  const [newAdv,   setNewAdv]   = React.useState('');
  const [newDue,   setNewDue]   = React.useState('');
  const [newNotes, setNewNotes] = React.useState('');

  const [editName,  setEditName]  = React.useState('');
  const [editCat,   setEditCat]   = React.useState<VendorCategory>('other');
  const [editTotal, setEditTotal] = React.useState('');
  const [editAdv,   setEditAdv]   = React.useState('');
  const [editDue,   setEditDue]   = React.useState('');
  const [editNotes, setEditNotes] = React.useState('');
  const [payAmount, setPayAmount] = React.useState('');
  // R-34.34 — the taxonomy, fetched. Fetching on OPEN rather than on mount keeps
  // the cost off every Vendors visit, mirroring expenses.tsx:222-228.
  const [allowed,   setAllowed]   = React.useState<string[]>(CATEGORY_FALLBACK);
  // HER OWN TOKEN IS ALWAYS AN OPTION. Without this, opening Edit on a
  // `jewellery` booking while `allowed` is still the fallback would leave the
  // select matching no option — the browser shows the first one, and Save would
  // silently re-categorise her booking to `other`. A picker that quietly
  // rewrites the row it was opened to edit is worse than one that failed to
  // load. The union is display-only; it adds no token to the server's taxonomy.
  const optionsFor = (current: string) =>
    allowed.includes(current) ? allowed : [current, ...allowed];

  const loadAllowed = async () => {
    if (allowed !== CATEGORY_FALLBACK) return;
    try {
      const a = await fetchEnvelopeCategories();
      if (a.length > 0) setAllowed(a);
    } catch { /* CATEGORY_FALLBACK stands — the sheet still saves */ }
  };
  const [payDate,   setPayDate]   = React.useState('');

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(''),2500); };

  const [enquiries, setEnquiries] = React.useState<CoupleEnquiry[]>([]);

  React.useEffect(()=>{
    fetchBookings().then(b=>{ setBookings(b); setLoading(false); }).catch(()=>setLoading(false));
    fetchEnquiries().then(setEnquiries).catch(()=>{});
  },[]);

  // TDW_07 P4b · F-07.16 — THE REGISTER. This was a local L/K/glyph formatter; it now
  // delegates to the estate's ONE money donor, which renders "Rs 1,50,000" — grouped Indian
  // digits, the word Rs, no glyph, no short form. Cured at the DONOR rather than at each of
  // its call sites: one edit moves every figure this screen renders, and a call site the
  // executor missed cannot keep rendering the old register.
  const fmtRs = (n:number) => formatRs(n);

  const openEdit = (b:CoupleBooking) => {
    setEditName(b.vendor_name); setEditCat(b.category as VendorCategory);
    setEditTotal(b.amount_total?String(b.amount_total):'');
    setEditAdv(b.amount_advance?String(b.amount_advance):'');
    setEditDue(b.balance_due_date||''); setEditNotes(b.notes||'');
    setAction(b); setShowEdit(true); loadAllowed();
  };

  const handleAdd = async () => {
    if(!newName.trim()) return;
    setSaving(true);
    try {
      const body:any={vendor_name:newName.trim(),category:newCat};
      if(newTotal) body.amount_total=parseInt(newTotal.replace(/,/g,''),10);
      if(newAdv)   body.amount_advance=parseInt(newAdv.replace(/,/g,''),10);
      if(newDue)   body.balance_due_date=newDue;
      if(newNotes.trim()) body.notes=newNotes.trim();
      const b=await createBooking(body);
      setBookings(prev=>[b,...prev]);
      setShowAdd(false);setNewName('');setNewCat('other');setNewTotal('');setNewAdv('');setNewDue('');setNewNotes('');
      showToast('Booking added.');
    } catch { showToast('Could not add. Try again.'); }
    setSaving(false);
  };

  const handleEdit = async () => {
    if(!action||!editName.trim()) return;
    setSaving(true);
    try {
      const patch:any={vendor_name:editName.trim(),category:editCat};
      patch.amount_total=editTotal?parseInt(editTotal.replace(/,/g,''),10):null;
      patch.amount_advance=editAdv?parseInt(editAdv.replace(/,/g,''),10):null;
      patch.balance_due_date=editDue||null;
      patch.notes=editNotes.trim()||null;
      const updated=await updateBooking(action.id,patch);
      setBookings(prev=>prev.map(b=>b.id===updated.id?updated:b));
      setShowEdit(false);setAction(null);
      showToast('Updated.');
    } catch { showToast('Could not update.'); }
    setSaving(false);
  };

  const handlePayment = async () => {
    if(!action||!payAmount) return;
    const amt=parseInt(payAmount.replace(/,/g,''),10);
    if(isNaN(amt)||amt<=0){showToast('Enter a valid amount.');return;}
    setSaving(true);
    try {
      const updated=await recordPayment(action.id,amt,payDate||undefined);
      setBookings(prev=>prev.map(b=>b.id===updated.id?updated:b));
      setShowPay(false);setAction(null);setPayAmount('');setPayDate('');
      showToast('Payment recorded.');
    } catch { showToast('Could not record payment.'); }
    setSaving(false);
  };

  const handleDelete = async (b:CoupleBooking) => {
    setAction(null);
    const prevBookings = bookings;
    setBookings(prev=>prev.filter(x=>x.id!==b.id));
    const ok = await deleteBooking(b.id);
    if(ok){
      showToast('Removed.');
    } else {
      setBookings(prevBookings);
      showToast('Could not remove. Try again.');
    }
  };

  const totalCommitted = bookings.reduce((s,b)=>s+(b.amount_total||0),0);
  const totalPaid      = bookings.reduce((s,b)=>s+(b.amount_paid||0),0);
  const groups = PIPELINE_STATES.map(p=>({label:p.label,items:bookings.filter(b=>b.state===p.key)})).filter(g=>g.items.length>0);

  const inpStyle:React.CSSProperties = {width:'100%',padding:'12px 14px',background:'rgba(255,255,255,.06)',border:`0.5px solid ${line}`,borderRadius:8,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:ink,outline:'none',boxSizing:'border-box',userSelect:'text'};

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',background:bg,overflow:'hidden'}}>
      {toast&&<div style={{position:'fixed',top:'calc(env(safe-area-inset-top,0px) + 16px)',left:'50%',transform:'translateX(-50%)',background:ink,color:paper,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,padding:'8px 18px',borderRadius:20,zIndex:400,pointerEvents:'none',whiteSpace:'nowrap'}}>{toast}</div>}

      {/* Header */}
      <div style={{padding:'16px 20px 12px',borderBottom:`0.5px solid ${line}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:4}}>My team</div>
          {bookings.length>0&&<div style={{display:'flex',gap:20}}>
            <div><span style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:19,color:ac}}>{fmtRs(totalCommitted)}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:inkMute,letterSpacing:'.22em',marginLeft:4}}>committed</span></div>
            <div><span style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:19,color:'#6B9E8F'}}>{fmtRs(totalPaid)}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:inkMute,letterSpacing:'.22em',marginLeft:4}}>paid</span></div>
          </div>}
        </div>
        <button onClick={()=>{setShowAdd(true);loadAllowed();}} style={{display:'flex',alignItems:'center',gap:4,padding:'6px 12px',borderRadius:100,border:`0.5px solid ${ac}44`,background:'transparent',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:ac,cursor:'pointer'}}>+ Add</button>
      </div>

      {/* List */}
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any}}>
        {loading&&<div style={{padding:32,textAlign:'center' as any,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>loading…</div>}

        {/* ── Enquired — vendors she reached out to from Discover ── */}
        {enquiries.length>0&&(
          <div>
            <div style={{padding:`14px ${FS.gutter}px 6px`,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>Enquired</div>
            {enquiries.map(e=>{
              // ── F-07.58 CURED · TDW_07 P6, fork (i) ratified ──────────────────────
              // TWO DEFECTS IN ONE TEMPLATE LITERAL, both F-07.54's family on the REAL
              // species. (1) The number was hardcoded against lib/waNumbers.ts:45's one
              // home — F-07.69, the last raw copy on a couple surface. (2) The fallback
              // `e.vendor_id` minted `TDW-<uuid>` as a ROUTING TOKEN, and the inbound
              // resolver matches `vendors.routing_handle` ONLY (vendorInbound.js:723-725).
              // A uuid reaches nothing: she taps, WhatsApp opens, and her message lands in
              // a dead end or — at one thread — in an unrelated vendor's.
              //
              // FORK (i): handle-only. No handle ⇒ NO LINK, and the row still renders, so
              // she keeps the information she owns (whom she enquired with) and loses only
              // the affordance that was lying. That is F-07.54's geometry one plane over:
              // the token and its link go null TOGETHER, never one without the other.
              const waLink = e.routing_handle
                ? `https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('TDW-' + e.routing_handle)}`
                : null;
              const meta=[e.category&&labelFor(e.category),e.city].filter(Boolean).join(' · ');
              return(
                <div key={e.id} style={{display:'flex',alignItems:'center',gap:14,padding:`12px ${FS.gutter}px`,borderBottom:`0.5px solid ${line}`}}>
                  <div style={{width:36,height:36,borderRadius:18,border:`0.5px solid ${line}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:inkMute}}>{(e.vendor_name?.[0]||e.category?.[0]||'·').toUpperCase()}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ink,fontFeatureSettings:'"opsz" 9',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.vendor_name||'Vendor'}</div>
                    {meta&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginTop:2}}>{meta}</div>}
                    {/* ── TDW_07 P5 · THE JOURNEY'S STATE (CE-ruled 2026-07-31, §D) ──────
                        SENT ships alone, and it is not a placeholder for a pair.
                        `couple_enquiries` has NO state column (9 columns, witnessed
                        PUBLIC_SCHEMA.md) and no writer of "replied" exists anywhere in
                        the estate — so THE ROW'S EXISTENCE IS THE STATE, and this label
                        is the honest whole of what we know.

                        The spec's §P5.4 asked this surface to "read sent/replied from
                        existing enquiries routes". It was reading a ghost: the route
                        (`/api/v2/couple/enquiries`, mounted at couple/core.js:49) serves
                        rows that have never carried a reply state. REPLIED is chartered
                        to the bride blocks, where reply-detection actually lives.

                        Rendered as its own element rather than folded into `meta`,
                        because `PHOTOGRAPHY · DELHI · SENT` reads as a third attribute
                        of the vendor rather than the status of her enquiry. */}
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginTop:3,opacity:.72}}>Sent</div>
                  </div>
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    onClick={e2=>e2.stopPropagation()}
                    style={{width:34,height:34,borderRadius:17,background:'rgba(37,211,102,.10)',border:'0.5px solid rgba(37,211,102,.25)',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',flexShrink:0}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.118 1.528 5.845L0 24l6.335-1.652A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" fill="#25D366"/></svg>
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {!loading&&bookings.length===0&&<div style={{padding:`${FS.s5}px ${FS.gutter}px`,textAlign:'center' as any,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>No one yet. Add your first booking.</div>}
        {groups.map(g=>(
          <div key={g.label}>
            <div style={{padding:`14px ${FS.gutter}px 6px`,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>{g.label}</div>
            {g.items.map(b=>{
              const balance=(b.amount_total||0)-(b.amount_paid||0);
              const meta=[b.category&&labelFor(b.category),b.amount_total?fmtRs(b.amount_total):null,b.balance_due_date?`Due ${new Date(b.balance_due_date).toLocaleDateString('en-IN',{month:'short',day:'numeric'})}`:null].filter(Boolean).join(' · ');
              return(
                <div key={b.id} onClick={()=>setAction(b)} style={{display:'flex',alignItems:'center',gap:14,padding:`12px ${FS.gutter}px`,borderBottom:`0.5px solid ${line}`,cursor:'pointer'}}>
                  <div style={{width:36,height:36,borderRadius:18,border:`0.5px solid ${line}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:inkMute}}>{(b.category?.[0]||b.vendor_name?.[0]||'·').toUpperCase()}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ink,fontFeatureSettings:'"opsz" 9',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.vendor_name}</div>
                    {meta&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',color:inkMute,marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{meta}</div>}
                  </div>
                  {b.amount_total&&b.amount_paid<b.amount_total&&<div style={{textAlign:'right' as any,flexShrink:0}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:inkMute}}>Bal</div>
                    <div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:16,color:ink}}>{fmtRs(balance)}</div>
                  </div>}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{height:40}}/>
      </div>

      {/* Add sheet */}
      {showAdd&&<>
        <div onClick={()=>setShowAdd(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:200}}/>
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:201,background:paper,borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`,maxHeight:'90vh',overflowY:'auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:22,color:ink,fontFeatureSettings:'"opsz" 9'}}>Add a booking</div>
            <button onClick={()=>setShowAdd(false)} style={{background:'none',border:'none',cursor:'pointer',color:inkMute,fontSize:20}}>✕</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Vendor name</div><input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Aanya Studio" style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Category</div>
              <select value={newCat} onChange={e=>setNewCat(e.target.value as VendorCategory)} style={{...inpStyle,appearance:'none' as any,WebkitAppearance:'none' as any}}>
                {allowed.map(c=><option key={c} value={c}>{labelFor(c)}</option>)}
              </select></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Total amount (Rs, optional)</div><input value={newTotal} onChange={e=>setNewTotal(e.target.value)} placeholder="450000" inputMode="numeric" style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Advance agreed (Rs, optional)</div><input value={newAdv} onChange={e=>setNewAdv(e.target.value)} placeholder="50000" inputMode="numeric" style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Balance due date (optional)</div><input type="date" value={newDue} onChange={e=>setNewDue(e.target.value)} style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Notes (optional)</div><input value={newNotes} onChange={e=>setNewNotes(e.target.value)} placeholder="What’s included, terms…" style={inpStyle}/></div>
            <button onClick={handleAdd} disabled={saving||!newName.trim()} style={{padding:'14px 0',background:ac,border:'none',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:dark?'#1A0810':'#FFFFFF',cursor:'pointer',opacity:(saving||!newName.trim())?.5:1}}>
              {saving?'Adding…':'Add booking'}
            </button>
          </div>
        </div>
      </>}

      {/* Action sheet */}
      {action&&!showEdit&&!showPay&&<>
        <div onClick={()=>setAction(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:200}}/>
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:201,background:paper,borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`}}>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:ink,marginBottom:2,fontFeatureSettings:'"opsz" 9'}}>{action.vendor_name}</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',color:inkMute,textTransform:'uppercase' as any,marginBottom:16}}>{labelFor(action.category)} · {action.state.replace(/_/g,' ')}</div>
          {action.amount_total&&<div style={{display:'flex',gap:24,marginBottom:20}}>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:inkMute,letterSpacing:'.22em'}}>TOTAL</div><div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:19,color:ink}}>{fmtRs(action.amount_total)}</div></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:inkMute,letterSpacing:'.22em'}}>PAID</div><div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:19,color:'#6B9E8F'}}>{fmtRs(action.amount_paid)}</div></div>
            {action.amount_paid<(action.amount_total||0)&&<div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:inkMute,letterSpacing:'.22em'}}>BALANCE</div><div style={{fontFamily:"'Fraunces',serif",fontWeight:400,fontSize:19,color:ink}}>{fmtRs((action.amount_total||0)-action.amount_paid)}</div></div>}
          </div>}
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <button onClick={()=>{setShowPay(true);setPayAmount('');setPayDate('');}} style={{padding:14,background:`${ac}18`,border:`0.5px solid ${ac}44`,borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:ac,cursor:'pointer'}}>Record a payment</button>
            <button onClick={()=>openEdit(action)} style={{padding:14,background:'rgba(255,255,255,.04)',border:`0.5px solid ${line}`,borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:ink,cursor:'pointer'}}>Edit</button>
            <button onClick={()=>handleDelete(action)} style={{padding:14,background:'rgba(184,69,62,.12)',border:'0.5px solid rgba(184,69,62,.3)',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'#B8453E',cursor:'pointer'}}>Remove</button>
            <button onClick={()=>setAction(null)} style={{padding:14,background:'rgba(255,255,255,.02)',border:`0.5px solid ${line}`,borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,cursor:'pointer'}}>Cancel</button>
          </div>
        </div>
      </>}

      {/* Edit sheet */}
      {showEdit&&action&&<>
        <div onClick={()=>{setShowEdit(false);setAction(null);}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:202}}/>
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:203,background:paper,borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`,maxHeight:'90vh',overflowY:'auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:22,color:ink,fontFeatureSettings:'"opsz" 9'}}>Edit booking</div>
            <button onClick={()=>{setShowEdit(false);setAction(null);}} style={{background:'none',border:'none',cursor:'pointer',color:inkMute,fontSize:20}}>✕</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Vendor name</div><input value={editName} onChange={e=>setEditName(e.target.value)} style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Category</div>
              <select value={editCat} onChange={e=>setEditCat(e.target.value as VendorCategory)} style={{...inpStyle,appearance:'none' as any,WebkitAppearance:'none' as any}}>
                {optionsFor(editCat).map(c=><option key={c} value={c}>{labelFor(c)}</option>)}
              </select></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Total (Rs)</div><input value={editTotal} onChange={e=>setEditTotal(e.target.value)} placeholder="450000" inputMode="numeric" style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Advance (Rs)</div><input value={editAdv} onChange={e=>setEditAdv(e.target.value)} placeholder="50000" inputMode="numeric" style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Balance due date</div><input type="date" value={editDue} onChange={e=>setEditDue(e.target.value)} style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Notes</div><input value={editNotes} onChange={e=>setEditNotes(e.target.value)} style={inpStyle}/></div>
            <button onClick={handleEdit} disabled={saving||!editName.trim()} style={{padding:'14px 0',background:ac,border:'none',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:dark?'#1A0810':'#FFFFFF',cursor:'pointer',opacity:(saving||!editName.trim())?.5:1}}>
              {saving?'Saving…':'Save changes'}
            </button>
          </div>
        </div>
      </>}

      {/* Payment sheet */}
      {showPay&&action&&<>
        <div onClick={()=>setShowPay(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:202}}/>
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:203,background:paper,borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:ink,fontFeatureSettings:'"opsz" 9'}}>Record payment</div>
            <button onClick={()=>setShowPay(false)} style={{background:'none',border:'none',cursor:'pointer',color:inkMute,fontSize:20}}>✕</button>
          </div>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,marginBottom:20,fontFeatureSettings:'"opsz" 9'}}>{action.vendor_name} · paid so far: {fmtRs(action.amount_paid)}</div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Amount paid (Rs)</div><input value={payAmount} onChange={e=>setPayAmount(e.target.value)} placeholder="50000" inputMode="numeric" style={inpStyle}/></div>
            <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:6}}>Payment date (optional)</div><input type="date" value={payDate} onChange={e=>setPayDate(e.target.value)} style={inpStyle}/></div>
            <button onClick={handlePayment} disabled={saving||!payAmount} style={{padding:'14px 0',background:ac,border:'none',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:dark?'#1A0810':'#FFFFFF',cursor:'pointer',opacity:(saving||!payAmount)?.5:1}}>
              {saving?'Recording…':'Record payment'}
            </button>
          </div>
        </div>
      </>}
    </div>
  );
}
