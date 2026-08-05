'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { useDemoContext } from '@/hooks/demo/useDemoContext';

const D={card:'var(--role-sheet)',muted:'var(--atelier-ink-mute)',cream:'var(--atelier-ink)',gold:'var(--atelier-accent-text)',red:'var(--role-critical)'};
const F={display:'var(--font-cormorant), Georgia, serif',label:'var(--font-jost), system-ui, sans-serif',body:'var(--font-dm-sans), system-ui, sans-serif'};
  // TDW_09 R-S2/R-S3 — the FIELD boundary, not the card hairline. `card-border`
  // is a panel edge (1.79:1 espresso / 1.40:1 paper); a control's edge has to
  // clear WCAG 1.4.11's 3:1 or the control is not identifiable as one. On paper
  // the fill cannot help — inputBg over the white sheet is 1.09:1 — so this edge
  // is the only thing that says `field`.
const inputStyle:React.CSSProperties={width:'100%',padding:'11px 14px',backgroundColor:'var(--atelier-input-bg)',border:'0.5px solid var(--atelier-input-border)',borderRadius:8,color:D.cream,fontFamily:F.body,fontWeight:300,fontSize:14,outline:'none',boxSizing:'border-box' as const};
const labelStyle:React.CSSProperties={fontFamily:F.label,fontWeight:300,fontSize:9,color:D.muted,letterSpacing:'0.2em',textTransform:'uppercase' as const,marginBottom:6};
interface Payment{id:string;member_name:string;amount_inr:number;description?:string;state:'owed'|'paid';}
const DEMO_PAYMENTS:Payment[]=[
  {id:'p1',member_name:'Priya Mehta',amount_inr:16000,description:'2-day shoot at Jai Vilas Palace',state:'owed'},
  {id:'p2',member_name:'Arjun Kapoor',amount_inr:10000,description:'Video editing — May deliverables',state:'owed'},
  {id:'p3',member_name:'Priya Mehta',amount_inr:8000,description:'Engagement shoot — April',state:'paid'},
];
const DEMO_MEMBERS=['Priya Mehta','Arjun Kapoor'];
export default function DemoTeamPaymentsPage(){
  const params=useParams();const handle=typeof params.handle==='string'?params.handle:'';
  const{vendorName}=useDemoContext(handle);const{toast,show}=useToast();
  const[payments,setPayments]=useState<Payment[]>(DEMO_PAYMENTS);const[addSheet,setAddSheet]=useState(false);const[paySheet,setPaySheet]=useState<Payment|null>(null);
  const[memberId,setMemberId]=useState('');const[amount,setAmount]=useState('');const[desc,setDesc]=useState('');
  const owed=payments.filter(p=>p.state==='owed');const paid=payments.filter(p=>p.state==='paid');const totalOwed=owed.reduce((s,p)=>s+p.amount_inr,0);
  function doLog(){if(!memberId||!amount)return;const p:Payment={id:`p${Date.now()}`,member_name:memberId,amount_inr:Number(amount),description:desc||undefined,state:'owed'};setPayments(prev=>[p,...prev]);show('Payment logged','success');setAddSheet(false);setMemberId('');setAmount('');setDesc('');}
  function doMarkPaid(p:Payment){setPayments(prev=>prev.map(x=>x.id===p.id?{...x,state:'paid'}:x));setPaySheet(null);show('Marked as paid','success');}
  return(<div style={{flex:1,display:'flex',flexDirection:'column',background:'transparent',position:'relative'}}>
    <Toast toast={toast}/><DemoVendorHeader vendorName={vendorName} handle={handle}/>
    <div style={{padding:'20px 24px 12px',borderBottom:'0.5px solid var(--atelier-card-border)'}}>
      <div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:D.gold,marginBottom:6}}>Team · Payments</div>
      <div style={{fontFamily:F.display,fontWeight:300,fontSize:36,color:totalOwed>0?D.gold:D.muted,letterSpacing:'-0.01em',lineHeight:1}}>Rs {totalOwed.toLocaleString('en-IN')}</div>
      <div style={{fontFamily:F.label,fontWeight:300,fontSize:9,color:D.muted,letterSpacing:'0.2em',textTransform:'uppercase',marginTop:8}}>Total owed to crew</div>
    </div>
    <div style={{flex:1,overflowY:'auto',paddingBottom:100}}>
      {owed.length>0&&(<div><div style={{padding:'14px 24px 8px',fontFamily:F.label,fontWeight:300,fontSize:9,color:D.muted,letterSpacing:'0.2em',textTransform:'uppercase'}}>Outstanding</div>{owed.map(p=>(<div key={p.id} onClick={()=>setPaySheet(p)} style={{display:'flex',alignItems:'center',padding:'14px 24px',borderBottom:'0.5px solid var(--atelier-card-border)',cursor:'pointer',gap:14}}>
        <div style={{flex:1,minWidth:0}}><div style={{fontFamily:F.body,fontWeight:400,fontSize:15,color:D.cream}}>{p.member_name}</div>{p.description&&<div style={{fontFamily:F.body,fontWeight:300,fontSize:12,color:D.muted,marginTop:3}}>{p.description}</div>}</div>
        <div style={{textAlign:'right',flexShrink:0}}><div style={{fontFamily:F.label,fontWeight:400,fontSize:14,color:D.gold}}>Rs {p.amount_inr.toLocaleString('en-IN')}</div><div style={{fontFamily:F.label,fontWeight:300,fontSize:8,color:D.muted,letterSpacing:'0.15em',textTransform:'uppercase',marginTop:2}}>Owed</div></div>
      </div>))}</div>)}
      {paid.length>0&&(<div><div style={{padding:'14px 24px 8px',fontFamily:F.label,fontWeight:300,fontSize:9,color:D.muted,letterSpacing:'0.2em',textTransform:'uppercase'}}>Paid</div>{paid.map(p=>(<div key={p.id} style={{display:'flex',alignItems:'center',padding:'14px 24px',borderBottom:'0.5px solid var(--atelier-card-border)',gap:14,opacity:0.6}}>
        <div style={{flex:1,minWidth:0}}><div style={{fontFamily:F.body,fontWeight:400,fontSize:15,color:D.cream}}>{p.member_name}</div>{p.description&&<div style={{fontFamily:F.body,fontWeight:300,fontSize:12,color:D.muted,marginTop:3}}>{p.description}</div>}</div>
        <div style={{textAlign:'right',flexShrink:0}}><div style={{fontFamily:F.label,fontWeight:400,fontSize:14,color:D.muted}}>Rs {p.amount_inr.toLocaleString('en-IN')}</div><div style={{fontFamily:F.label,fontWeight:300,fontSize:8,color:D.muted,letterSpacing:'0.15em',textTransform:'uppercase',marginTop:2}}>Paid</div></div>
      </div>))}</div>)}
      {payments.length===0&&<div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:40,textAlign:'center'}}><p style={{fontFamily:F.body,fontWeight:300,fontSize:14,color:D.muted}}>No payments logged yet.</p></div>}
    </div>
    <button type="button" onClick={()=>setAddSheet(true)} style={{position:'fixed',bottom:32,right:24,width:52,height:52,borderRadius:'50%',backgroundColor:D.gold,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10,boxShadow:'0 4px 20px var(--atelier-overlay-bg)'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
    {addSheet&&(<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',zIndex:20,display:'flex',alignItems:'flex-end'}} onClick={()=>setAddSheet(false)}><div onClick={e=>e.stopPropagation()} style={{width:'100%',background:D.card,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderRadius:'16px 16px 0 0',padding:'24px 24px 40px',display:'flex',flexDirection:'column',gap:14}}>
      <div style={{fontFamily:F.display,fontWeight:300,fontSize:22,color:D.cream,marginBottom:4}}>Log Payment</div>
      <div><div style={labelStyle}>Team Member</div><select value={memberId} onChange={e=>setMemberId(e.target.value)} style={{...inputStyle,appearance:'none' as const}}><option value="">Select member</option>{DEMO_MEMBERS.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
      <div><div style={labelStyle}>Amount (Rs) *</div><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="8000" style={inputStyle}/></div>
      <div><div style={labelStyle}>Description</div><input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="2-day shoot at venue" style={inputStyle}/></div>
      <button type="button" onClick={doLog} disabled={!memberId||!amount} style={{padding:'13px 0',backgroundColor:memberId&&amount?D.gold:'var(--atelier-input-border)',border:'none',borderRadius:8,cursor:memberId&&amount?'pointer':'not-allowed',fontFamily:F.label,fontWeight:400,fontSize:10,color:'#111',letterSpacing:'0.2em',textTransform:'uppercase',marginTop:4}}>Log Payment</button>
    </div></div>)}
    {paySheet&&(<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',zIndex:20,display:'flex',alignItems:'flex-end'}} onClick={()=>setPaySheet(null)}><div onClick={e=>e.stopPropagation()} style={{width:'100%',background:D.card,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderRadius:'16px 16px 0 0',padding:'24px 24px 40px',display:'flex',flexDirection:'column',gap:14}}>
      <div style={{fontFamily:F.display,fontWeight:300,fontSize:22,color:D.cream}}>{paySheet.member_name}</div>
      {paySheet.description&&<p style={{fontFamily:F.body,fontWeight:300,fontSize:14,color:D.muted,margin:0}}>{paySheet.description}</p>}
      <div style={{fontFamily:F.label,fontWeight:400,fontSize:18,color:D.gold}}>Rs {paySheet.amount_inr.toLocaleString('en-IN')}</div>
      <button type="button" onClick={()=>doMarkPaid(paySheet)} style={{padding:'13px 0',backgroundColor:D.gold,border:'none',borderRadius:8,cursor:'pointer',fontFamily:F.label,fontWeight:400,fontSize:10,color:'#111',letterSpacing:'0.2em',textTransform:'uppercase'}}>Mark as Paid</button>
    </div></div>)}
  </div>);
}
