'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { selectStyle } from '@/lib/vendor/controls';
import { useParams, useRouter } from 'next/navigation';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { useDemoContext } from '@/hooks/demo/useDemoContext';

const A={ink:'var(--atelier-ink)',inkSoft:'var(--atelier-ink-soft)',inkMute:'var(--atelier-ink-mute)',brass:'var(--role-metal)',brassWarm:'var(--atelier-label)',red:'var(--role-critical)'} as const;
const F={display:'var(--font-italiana), "GFS Didot", Georgia, serif',script:'var(--font-cormorant), Georgia, serif',body:'var(--font-dm-sans), system-ui, sans-serif',label:'var(--font-jost), system-ui, sans-serif'} as const;
const inputStyle:React.CSSProperties={width:'100%',padding:'12px 14px',boxSizing:'border-box' as const,background:'var(--atelier-input-bg)',border:'0.5px solid var(--atelier-input-border)',borderRadius:2,fontFamily:F.body,fontWeight:300,fontSize:14,color:A.ink,outline:'none',caretColor:A.brass};
const labelStyle:React.CSSProperties={fontFamily:F.label,fontWeight:300,fontSize:8,color:A.inkMute,letterSpacing:'0.32em',textTransform:'uppercase' as const,marginBottom:6};
function currentFY(){const now=new Date();const m=now.getMonth()+1;const y=now.getFullYear();if(m>=4)return`FY${y}-${String(y+1).slice(2)}`;return`FY${y-1}-${String(y).slice(2)}`;}
function fyOptions(){const cur=currentFY();const year=parseInt(cur.slice(2,6));return[cur,`FY${year-1}-${String(year).slice(2)}`,`FY${year-2}-${String(year-1).slice(2)}`];}
interface TdsEntry{id:string;client_name:string;gross_amount:number;tds_amount:number;tds_rate:number;section:string;deduction_date:string;}
const DEMO_ENTRIES:TdsEntry[]=[
  {id:'t1',client_name:'Priya Sharma',gross_amount:150000,tds_amount:15000,tds_rate:10,section:'194J',deduction_date:'2026-03-15'},
  {id:'t2',client_name:'Riya & Dev',gross_amount:200000,tds_amount:20000,tds_rate:10,section:'194J',deduction_date:'2026-04-20'},
];
export default function DemoTdsPage(){
  const params=useParams();const handle=typeof params.handle==='string'?params.handle:'';
  const router=useRouter();const{vendorName}=useDemoContext(handle);const{toast,show}=useToast();
  const[fy,setFy]=useState(currentFY());const[entries,setEntries]=useState<TdsEntry[]>(DEMO_ENTRIES);const[addOpen,setAddOpen]=useState(false);
  const[clientName,setClientName]=useState('');const[grossAmt,setGrossAmt]=useState('');const[tdsRate,setTdsRate]=useState('10');const[section,setSection]=useState('194J');const[dedDate,setDedDate]=useState(new Date().toISOString().slice(0,10));const[pan,setPan]=useState('');const[tan,setTan]=useState('');const[certNo,setCertNo]=useState('');
  const canCreate=clientName.trim().length>0&&Number(grossAmt)>0;
  const tdsAmt=grossAmt?Math.round(Number(grossAmt)*Number(tdsRate)/100):0;const netAmt=grossAmt?Number(grossAmt)-tdsAmt:0;
  const summary={total_gross:entries.reduce((s,e)=>s+e.gross_amount,0),total_tds:entries.reduce((s,e)=>s+e.tds_amount,0),total_net:entries.reduce((s,e)=>s+e.gross_amount-e.tds_amount,0),entry_count:entries.length};
  function doCreate(){if(!canCreate)return;const e:TdsEntry={id:`t${Date.now()}`,client_name:clientName.trim(),gross_amount:Number(grossAmt),tds_amount:Math.round(Number(grossAmt)*Number(tdsRate)/100),tds_rate:Number(tdsRate),section,deduction_date:dedDate};setEntries(prev=>[e,...prev]);show('TDS entry logged','success');setAddOpen(false);setClientName('');setGrossAmt('');setPan('');setTan('');setCertNo('');}
  function doDelete(id:string){setEntries(prev=>prev.filter(e=>e.id!==id));show('Deleted','success');}
  return(<div style={{flex:1,display:'flex',flexDirection:'column',position:'relative'}}>
    <Toast toast={toast}/><DemoVendorHeader vendorName={vendorName} handle={handle}/>
    <div style={{padding:'12px 22px',display:'flex',alignItems:'center',gap:12,borderBottom:'0.5px solid var(--atelier-card-border)'}}>
      <button type="button" onClick={()=>router.back()} style={{background:'none',border:'none',cursor:'pointer',padding:0,color:A.brassWarm,fontFamily:F.display,fontSize:22,lineHeight:1}}>‹</button>
      <span style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass,flex:1}}>TDS</span>
      <button type="button" onClick={()=>show('CSV export available in full studio after signup','success')} style={{padding:'6px 12px',background:'transparent',border:'0.5px solid var(--atelier-input-border)',borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:8,color:A.brassWarm,letterSpacing:'0.32em',textTransform:'uppercase'}}>Export CSV</button>
    </div>
    <div style={{padding:'14px 22px 6px',display:'flex',gap:8,flexWrap:'wrap'}}>{fyOptions().map(f=>(<button key={f} type="button" onClick={()=>setFy(f)} style={{padding:'6px 12px',borderRadius:2,cursor:'pointer',background:fy===f?'rgba(201,168,76,0.18)':'transparent',border:`0.5px solid ${fy===f?'rgba(201,168,76,0.5)':'rgba(201,168,76,0.22)'}`,fontFamily:F.label,fontWeight:300,fontSize:9,color:fy===f?A.brassWarm:A.inkMute,letterSpacing:'0.28em',textTransform:'uppercase'}}>{f}</button>))}</div>
    <div style={{margin:'14px 22px 0'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}><span style={{fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass}}>{fy}</span><span style={{flex:1,height:'0.5px',background:'rgba(201,168,76,0.22)'}}/><span style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:12,color:A.inkMute}}>{summary.entry_count} entries</span></div>
      <div style={{display:'flex',alignItems:'stretch',padding:'22px 8px 18px',borderTop:'0.5px solid var(--atelier-card-border)',borderBottom:'0.5px solid var(--atelier-card-border)'}}>
        {[{label:'Gross',val:summary.total_gross,color:'var(--atelier-ink)'},{label:'TDS',val:summary.total_tds,color:A.red,divider:true},{label:'Net Received',val:summary.total_net,color:A.brassWarm,divider:true}].map(item=>(<div key={item.label} style={{flex:1,textAlign:'center',padding:'0 4px',position:'relative'}}>
          {item.divider&&<span aria-hidden style={{position:'absolute',left:0,top:'12%',bottom:'12%',width:'0.5px',background:'rgba(201,168,76,0.22)'}}/>}
          <div style={{fontFamily:F.display,fontWeight:400,fontSize:22,lineHeight:1,color:item.color,letterSpacing:'-0.005em'}}>Rs {item.val.toLocaleString('en-IN')}</div>
          <div style={{fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.32em',textTransform:'uppercase',color:'var(--atelier-label)',marginTop:10}}>{item.label}</div>
        </div>))}
      </div>
    </div>
    {entries.length===0?(<div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:40}}><div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:16,color:A.inkMute,textAlign:'center',lineHeight:1.5}}>No TDS entries for {fy}.<br/><span style={{color:A.brassWarm}}>Log your first below.</span></div></div>
    ):(<div style={{flex:1,overflowY:'auto',overflowX:'hidden',marginTop:14,paddingBottom:110}}>
      {entries.map(e=>(<div key={e.id} style={{padding:'14px 24px',borderBottom:'0.5px solid var(--atelier-card-border)',display:'flex',alignItems:'center',gap:14}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:F.script,fontWeight:500,fontSize:17,color:A.ink,letterSpacing:'0.005em'}}>{e.client_name}</div>
          <div style={{fontFamily:F.label,fontWeight:300,fontSize:8,color:'var(--atelier-label)',letterSpacing:'0.28em',textTransform:'uppercase',marginTop:3}}>{e.deduction_date} · {e.section} · {e.tds_rate}%</div>
          <div style={{display:'flex',gap:14,marginTop:5,fontFamily:F.script,fontStyle:'italic',fontSize:13}}>
            <span style={{color:A.inkSoft}}>Gross Rs {e.gross_amount.toLocaleString('en-IN')}</span>
            <span style={{color:A.red}}>TDS Rs {e.tds_amount.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <button type="button" onClick={()=>doDelete(e.id)} style={{padding:'6px 10px',background:'transparent',border:'0.5px solid rgba(224,123,92,0.4)',borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:8,color:A.red,letterSpacing:'0.28em',textTransform:'uppercase',flexShrink:0}}>Delete</button>
      </div>))}
    </div>)}
    <button type="button" onClick={()=>setAddOpen(true)} aria-label="Add TDS entry" className="atelier-fab" style={{position:'fixed',bottom:'calc(82px + env(safe-area-inset-bottom))',right:20,zIndex:10,width:54,height:54,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.display,fontSize:28,fontWeight:400,lineHeight:1,cursor:'pointer',border:'0.5px solid var(--atelier-label)'}}>+</button>
    {addOpen&&(<div style={{position:'fixed',inset:0,background:'var(--atelier-overlay)',zIndex:20,display:'flex',alignItems:'flex-end'}} onClick={()=>setAddOpen(false)}><div onClick={e=>e.stopPropagation()} style={{width:'100%',background:'var(--atelier-sheet-bg)',backdropFilter:'blur(40px) saturate(1.8)',WebkitBackdropFilter:'blur(40px) saturate(1.8)',borderTop:'0.5px solid var(--atelier-sheet-border)',padding:'20px 24px calc(24px + env(safe-area-inset-bottom))',display:'flex',flexDirection:'column',gap:12,maxHeight:'85vh',overflowY:'auto'}}>
      <div style={{display:'flex',justifyContent:'center',marginBottom:8}}><div style={{width:36,height:3,borderRadius:2,background:'var(--atelier-label)'}}/></div>
      <div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass,marginBottom:2}}>New Entry</div>
      <div style={{fontFamily:F.display,fontWeight:400,fontSize:22,color:'var(--atelier-ink)',lineHeight:1.15,marginBottom:6}}>Log TDS</div>
      <div><div style={labelStyle}>Client / Company *</div><input style={inputStyle} value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="ABC Corp Pvt Ltd"/></div>
      <div><div style={labelStyle}>Gross Amount (Rs) *</div><input style={inputStyle} type="number" value={grossAmt} onChange={e=>setGrossAmt(e.target.value)} placeholder="100000"/></div>
      <div><div style={labelStyle}>TDS Rate (%)</div><select value={tdsRate} onChange={e=>setTdsRate(e.target.value)} style={selectStyle(inputStyle)}><option value="1">1%</option><option value="2">2%</option><option value="5">5%</option><option value="10">10%</option><option value="20">20%</option></select></div>
      {grossAmt&&Number(grossAmt)>0&&(<div style={{padding:'10px 14px',background:'var(--atelier-input-bg)',border:'0.5px solid var(--atelier-card-border)',borderRadius:2,display:'flex',gap:18,fontFamily:F.script,fontStyle:'italic',fontSize:13}}><span style={{color:A.inkSoft}}>TDS: <strong style={{color:A.red,fontStyle:'normal'}}>Rs {tdsAmt.toLocaleString('en-IN')}</strong></span><span style={{color:A.inkSoft}}>Net: <strong style={{color:A.brassWarm,fontStyle:'normal'}}>Rs {netAmt.toLocaleString('en-IN')}</strong></span></div>)}
      <div><div style={labelStyle}>Section</div><select value={section} onChange={e=>setSection(e.target.value)} style={selectStyle(inputStyle)}><option value="194J">194J — Professional Services</option><option value="194C">194C — Contractors</option><option value="194I">194I — Rent</option><option value="194H">194H — Commission</option><option value="other">Other</option></select></div>
      <div><div style={labelStyle}>Deduction Date</div><input style={inputStyle} type="date" value={dedDate} onChange={e=>setDedDate(e.target.value)}/></div>
      <div><div style={labelStyle}>Client PAN</div><input style={inputStyle} value={pan} onChange={e=>setPan(e.target.value.toUpperCase())} placeholder="AABCS1234X"/></div>
      <div><div style={labelStyle}>Client TAN</div><input style={inputStyle} value={tan} onChange={e=>setTan(e.target.value.toUpperCase())} placeholder="DELS01234C"/></div>
      <div><div style={labelStyle}>Certificate / Form 16A No.</div><input style={inputStyle} value={certNo} onChange={e=>setCertNo(e.target.value)} placeholder="Optional"/></div>
      {!canCreate&&<div style={{fontFamily:F.script,fontStyle:'italic',fontSize:12,color:A.red,marginTop:2}}>Client name and gross amount are required.</div>}
      <button type="button" onClick={doCreate} disabled={!canCreate} className="atelier-fab" style={{padding:'14px 0',borderRadius:2,cursor:canCreate?'pointer':'default',border:'0.5px solid var(--atelier-label)',fontFamily:F.label,fontWeight:400,fontSize:10,color:'#1A120E',letterSpacing:'0.42em',textTransform:'uppercase',opacity:canCreate?1:0.5,marginTop:6}}>Log Entry</button>
    </div></div>)}
  </div>);
}
