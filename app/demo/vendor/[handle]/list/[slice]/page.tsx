'use client';
export const dynamic = 'force-dynamic';

import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { AddSheet } from '@/components/vendor/AddSheet';
import { useDemoContext } from '@/hooks/demo/useDemoContext';
import { useDemoLeadsData, useDemoClientsData, useDemoInvoicesData, useDemoExpensesData, useDemoEventsData } from '@/hooks/demo/useDemoVendorData';
import type { Client, Lead, Invoice, Expense, VendorEvent } from '@/lib/vendor/types/vendor';
import type { ListSlice } from '@/hooks/vendor/useLastSlice';
import type { ToastKind } from '@/hooks/vendor/useToast';
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home

const A = { ink:'var(--atelier-ink)',inkSoft:'var(--atelier-ink-soft)',inkMute:'var(--atelier-ink-mute)',inkDim:'var(--atelier-ink-dim)',brass:'var(--atelier-accent-text)',brassWarm:'var(--atelier-label)',green:'#7FBE85',red:'#E07B5C' } as const;
const F = { display:'var(--font-italiana), "GFS Didot", Georgia, serif',script:'var(--font-cormorant), Georgia, serif',body:'var(--font-dm-sans), system-ui, sans-serif',label:'var(--font-jost), system-ui, sans-serif' } as const;
const LABELS: Record<ListSlice,string> = { clients:'Clients',leads:'Leads',invoices:'Invoices',events:'Events',expenses:'Expenses' };
const GLYPHS: Record<ListSlice,string> = { clients:'C',leads:'L',invoices:'I',events:'◐',expenses:'×' };

function stateColor(slice:ListSlice,state:string|undefined):string{
  if(!state)return A.inkMute; const s=state.toLowerCase();
  if(slice==='leads'){if(s==='new')return A.brassWarm;if(s==='contacted'||s==='quoted')return A.brass;if(s==='booked')return A.green;if(s==='lost')return A.red;}
  if(slice==='invoices'){if(s==='paid')return A.green;if(s==='unpaid')return A.brassWarm;if(s==='overdue')return A.red;if(s==='cancelled')return A.inkMute;}
  if(slice==='events'){if(s==='cancelled')return A.red;if(s==='completed')return A.green;return A.brassWarm;}
  return A.brassWarm;
}
interface Row{id:string;primary:string;secondary?:string;meta?:string;badge?:string;badgeAlert?:boolean;phone?:string;aiPrimer:string;deletePrimer:string;detail:{label:string;value:string}[];}
function fmtRs(n:number|null|undefined){return n==null?'Rs —':formatRs(n);} // TDW_09 R-U25
function fmtDate(iso:string|null|undefined){if(!iso)return'—';const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(iso);if(!m)return iso;return`${parseInt(m[3])} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m[2])-1]} ${m[1]}`;}
function fmtLeadDate(iso:string|null|undefined,precision?:'day'|'month'|'year'|null){if(!iso)return'—';const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(iso);if(!m)return iso;const ma=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m[2])-1];if(precision==='year')return m[1];if(precision==='month')return`${ma} ${m[1]}`;return`${parseInt(m[3])} ${ma} ${m[1]}`;}
function cap(s:string|null|undefined):string{if(!s||s==='—')return s??'—';return s.split(/[\s_-]+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');}
function toRows(slice:ListSlice,clients:Client[],leads:Lead[],invoices:Invoice[],expenses:Expense[],events:VendorEvent[]):Row[]{
  const today=new Date().toISOString().slice(0,10);
  if(slice==='clients')return clients.map(c=>({id:c.id,primary:c.name,secondary:c.phone??undefined,meta:c.email??undefined,phone:c.phone??undefined,aiPrimer:`What would you like to change about ${c.name}?`,deletePrimer:`Delete client ${c.name} (id:${c.id}).`,detail:[{label:'Phone',value:c.phone??'—'},{label:'Email',value:c.email??'—'},{label:'Notes',value:c.notes??'—'},{label:'Added',value:fmtDate(c.created_at)}]}));
  if(slice==='leads')return leads.map(l=>({id:l.id,primary:l.name??'Unknown',secondary:l.wedding_city??undefined,meta:l.wedding_date?fmtLeadDate(l.wedding_date,l.wedding_date_precision):undefined,badge:l.state,badgeAlert:l.state==='lost',phone:l.phone??undefined,aiPrimer:`What would you like to change about the ${l.name??'unnamed'} lead?`,deletePrimer:`Delete the lead for ${l.name??'unknown'} (id:${l.id}).`,detail:[{label:'State',value:l.state},{label:'Wedding date',value:fmtLeadDate(l.wedding_date,l.wedding_date_precision)},{label:'City',value:l.wedding_city??'—'},{label:'Budget',value:fmtRs(l.budget_total)},{label:'Source',value:l.source??'—'}]}));
  if(slice==='invoices')return invoices.map(inv=>({id:inv.id,primary:inv.client_name,secondary:inv.invoice_number,meta:inv.due_date?`due ${fmtDate(inv.due_date)}`:undefined,badge:inv.state,badgeAlert:inv.state==='unpaid'&&!!inv.due_date&&inv.due_date<today,aiPrimer:`What about invoice ${inv.invoice_number}?`,deletePrimer:`Delete invoice ${inv.invoice_number} (id:${inv.id}).`,detail:[{label:'Invoice #',value:inv.invoice_number},{label:'Total',value:fmtRs(inv.amount_total)},{label:'Paid',value:fmtRs(inv.amount_paid)},{label:'Owed',value:fmtRs(inv.amount_owed)},{label:'State',value:inv.state},{label:'Due',value:fmtDate(inv.due_date)}]}));
  if(slice==='expenses')return expenses.map(exp=>({id:exp.id,primary:exp.description??'Expense',secondary:exp.category??undefined,meta:exp.expense_date?fmtDate(exp.expense_date):undefined,badge:fmtRs(exp.amount),aiPrimer:`What about the expense "${exp.description??'this'}"?`,deletePrimer:`Delete expense (id:${exp.id}).`,detail:[{label:'Amount',value:fmtRs(exp.amount)},{label:'Category',value:exp.category??'—'},{label:'Description',value:exp.description??'—'},{label:'Date',value:fmtDate(exp.expense_date)},{label:'Client',value:exp.client_name??'—'}]}));
  return events.map(ev=>({id:ev.id,primary:ev.title,secondary:ev.kind,meta:fmtDate(ev.event_date)+(ev.event_time?` · ${ev.event_time.slice(0,5)}`:''),badge:ev.state,aiPrimer:`What about the event "${ev.title}"?`,deletePrimer:`Delete event (id:${ev.id}).`,detail:[{label:'Kind',value:ev.kind},{label:'Date',value:fmtDate(ev.event_date)},{label:'Time',value:ev.event_time?ev.event_time.slice(0,5):'—'},{label:'State',value:ev.state},{label:'Notes',value:ev.notes??'—'}]}));
}
const WaIcon=()=><svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M7.5 0C3.358 0 0 3.358 0 7.5c0 1.32.344 2.56.946 3.634L0 15l3.99-1.046A7.46 7.46 0 007.5 15C11.642 15 15 11.642 15 7.5S11.642 0 7.5 0zm0 13.75a6.21 6.21 0 01-3.17-.868l-.228-.135-2.357.557.584-2.296-.148-.235A6.21 6.21 0 011.25 7.5C1.25 4.048 4.048 1.25 7.5 1.25S13.75 4.048 13.75 7.5 10.952 13.75 7.5 13.75zM10.9 9.1c-.186-.093-1.1-.543-1.27-.604-.17-.062-.294-.093-.418.093-.124.186-.48.604-.588.728-.108.124-.217.14-.403.047-.186-.094-.786-.29-1.497-.924-.553-.494-.926-1.104-1.035-1.29-.108-.186-.011-.287.082-.38.084-.083.186-.217.279-.325.093-.108.124-.186.186-.31.062-.124.031-.233-.015-.326-.047-.093-.418-1.01-.573-1.382-.151-.364-.304-.315-.418-.321-.108-.006-.232-.007-.356-.007-.124 0-.326.047-.497.233-.17.186-.651.636-.651 1.551 0 .916.667 1.8.76 1.924.093.124 1.312 2.003 3.179 2.81.444.192.79.306.06.391.446.141.852.122.874.055.268-.053 1.1-.45.255-.886.155-.324.155-.81.108-.885.047-.062-.17-.124-.357-.217z"/></svg>;
function ListRow({row,slice,onSelect,_k}:{row:Row;slice:ListSlice;onSelect:()=>void;_k?:React.Key}){
  const detailParts=[row.secondary,row.meta].filter(Boolean) as string[];
  const detailLine=detailParts.length>0?detailParts.map(cap).join(' · '):'—';
  const pillColor=stateColor(slice,row.badge);
  return(
    <div style={{display:'flex',alignItems:'center',borderBottom:'0.5px solid var(--atelier-card-border)'}}>
      <button type="button" onClick={onSelect} style={{flex:1,minWidth:0,display:'flex',alignItems:'center',gap:16,padding:'15px 16px 15px 22px',background:'transparent',border:'none',cursor:'pointer',textAlign:'left' as const}}>
        <span style={{flexShrink:0,width:28,textAlign:'center',fontFamily:F.display,fontWeight:400,fontSize:22,color:A.brassWarm,lineHeight:1}}>{GLYPHS[slice]}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:F.script,fontWeight:500,fontSize:18,color:A.ink,letterSpacing:'0.005em',lineHeight:1.15,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{row.primary}</div>
          <div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:12,color:A.inkMute,letterSpacing:'0.01em',marginTop:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{detailLine}</div>
        </div>
        {row.badge&&<span style={{flexShrink:0,fontFamily:F.label,fontWeight:400,fontSize:8,color:pillColor,letterSpacing:'0.32em',textTransform:'uppercase' as const,border:`0.5px solid ${pillColor}`,borderRadius:2,padding:'4px 9px',minWidth:56,textAlign:'center' as const}}>{row.badge}</span>}
      </button>
      {slice==='clients'&&row.phone&&(
        <div style={{display:'flex',gap:6,paddingRight:16,flexShrink:0}}>
          <a href={`https://wa.me/${row.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{width:34,height:34,borderRadius:'50%',background:'rgba(127,190,133,0.10)',border:'0.5px solid rgba(127,190,133,0.42)',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',color:A.green}}><WaIcon/></a>
          <a href={`tel:${row.phone}`} onClick={e=>e.stopPropagation()} style={{width:34,height:34,borderRadius:'50%',background:'var(--atelier-input-bg)',border:'0.5px solid var(--atelier-sheet-border)',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',fontFamily:F.display,fontSize:14,color:A.brassWarm,lineHeight:1}}>☎</a>
        </div>
      )}
    </div>
  );
}
export default function DemoSlicePage(){
  const params=useParams();
  const handle=typeof params.handle==='string'?params.handle:'';
  const slice=(typeof params.slice==='string'?params.slice:'leads') as ListSlice;
  const router=useRouter();
  const{vendorName,vendorId}=useDemoContext(handle);
  const{toast,show:showToast}=useToast();
  const c=useDemoClientsData();const l=useDemoLeadsData(handle);const i=useDemoInvoicesData();const ex=useDemoExpensesData();const ev=useDemoEventsData();
  const rawRows=useMemo(()=>toRows(slice,c.data??[],l.data??[],i.data??[],ex.data??[],ev.data??[]),[slice,c.data,l.data,i.data,ex.data,ev.data]);
  const loading=l.loading;
  const[query,setQuery]=useState('');const[sel,setSel]=useState<Row|null>(null);const[confirmDel,setConfirmDel]=useState(false);const[addOpen,setAddOpen]=useState(false);const[editRow,setEditRow]=useState<Record<string,unknown>|null>(null);
  const rows=useMemo(()=>{if(!query.trim())return rawRows;const q=query.trim().toLowerCase();return rawRows.filter(r=>r.primary.toLowerCase().includes(q)||(r.secondary??'').toLowerCase().includes(q)||(r.meta??'').toLowerCase().includes(q));},[rawRows,query]);
  if(!['clients','leads','invoices','events','expenses'].includes(slice))return<div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontFamily:F.script,fontStyle:'italic',color:A.inkMute}}>Unknown.</div></div>;
  return(
    <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0,position:'relative'}}>
      <DemoVendorHeader vendorName={vendorName} handle={handle}/>
      <div style={{padding:'12px 22px 8px',display:'flex',alignItems:'center',gap:12,borderBottom:'0.5px solid var(--atelier-card-border)'}}>
        <button type="button" onClick={()=>router.back()} style={{background:'none',border:'none',cursor:'pointer',padding:0,color:A.brassWarm,fontFamily:F.display,fontSize:22,lineHeight:1}}>‹</button>
        <span style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass}}>{LABELS[slice]}</span>
      </div>
      <div style={{padding:'12px 22px 6px'}}>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontFamily:F.display,fontSize:14,color:A.inkMute,lineHeight:1,pointerEvents:'none'}}>⌕</span>
          <input type="text" placeholder={`Search ${LABELS[slice].toLowerCase()}…`} value={query} onChange={e=>setQuery(e.target.value)} style={{width:'100%',padding:'10px 12px 10px 32px',boxSizing:'border-box' as const,background:'var(--atelier-input-bg)',border:'0.5px solid var(--atelier-card-border)',borderRadius:2,fontFamily:F.body,fontWeight:300,fontSize:13,color:A.ink,outline:'none',caretColor:A.brass}}/>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',overflowX:'hidden',paddingBottom:110}}>
        {!loading&&rows.length===0&&<div style={{padding:'40px 24px',textAlign:'center',fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:16,color:A.inkMute,lineHeight:1.5}}>{query?<>Nothing matching <span style={{color:A.brassWarm}}>&ldquo;{query}&rdquo;</span></>:<>Nothing here yet.<br/><span style={{color:A.brassWarm}}>Tap + to add one.</span></>}</div>}
        {rows.map((row:Row)=><div key={row.id}><ListRow row={row} slice={slice} onSelect={()=>{setSel(row);setConfirmDel(false);}}/></div>)}
      </div>
      <button type="button" onClick={()=>{setEditRow(null);setAddOpen(true);}} aria-label={`Add ${LABELS[slice].toLowerCase()}`} className="atelier-fab" style={{position:'fixed',bottom:'calc(82px + env(safe-area-inset-bottom))',right:20,zIndex:30,width:46,height:46,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.body,fontSize:22,fontWeight:400,lineHeight:1,cursor:'pointer',border:'0.5px solid #E0BC6E'}}>+</button>
      <Toast toast={toast}/>
      <AddSheet open={addOpen} slice={slice} onClose={()=>{setAddOpen(false);setEditRow(null);}} onToast={(msg:string,kind?:ToastKind)=>showToast(msg,kind)} existing={editRow} existingId={editRow?.id as string|undefined}/>
      <>
        {sel&&<div onClick={()=>{setSel(null);setConfirmDel(false);}} style={{position:'fixed',inset:0,zIndex:40,background:'var(--atelier-overlay)'}}/>}
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:50,background:'var(--atelier-sheet-bg)',backdropFilter:'blur(40px) saturate(1.8)',WebkitBackdropFilter:'blur(40px) saturate(1.8)',borderTop:'0.5px solid var(--atelier-sheet-border)',padding:`0 0 calc(20px + env(safe-area-inset-bottom))`,transform:sel?'translateY(0)':'translateY(100%)',transition:'transform 320ms cubic-bezier(0.22,1,0.36,1)',maxHeight:'88dvh',display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',justifyContent:'center',padding:'12px 0 4px'}}><div style={{width:36,height:3,borderRadius:2,background:'var(--atelier-label)'}}/></div>
          <div style={{padding:'6px 24px 14px',borderBottom:'0.5px solid var(--atelier-card-border)'}}>
            <div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass,marginBottom:4}}>{LABELS[slice]}</div>
            <div style={{fontFamily:F.display,fontWeight:400,fontSize:24,color:'var(--atelier-ink)',letterSpacing:'0.005em',lineHeight:1.15}}>{sel?.primary??''}</div>
          </div>
          <div style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:'12px 24px'}}>
            {(sel?.detail??[]).map((f,ii)=>(
              <div key={ii} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',padding:'10px 0',gap:14,borderBottom:ii<(sel?.detail.length??0)-1?'0.5px solid var(--atelier-card-border)':'none'}}>
                <span style={{fontFamily:F.label,fontWeight:300,fontSize:8,color:A.inkMute,letterSpacing:'0.32em',textTransform:'uppercase',flexShrink:0,paddingTop:3}}>{f.label}</span>
                <span style={{fontFamily:F.script,fontWeight:500,fontSize:15,color:A.ink,letterSpacing:'0.005em',textAlign:'right'}}>{cap(f.value)}</span>
              </div>
            ))}
          </div>
          <div style={{padding:'12px 24px 0',display:'flex',flexDirection:'column',gap:8}}>
            {slice==='leads'&&sel?.phone&&!confirmDel&&(
              <div style={{display:'flex',gap:8,marginBottom:4}}>
                <a href={`https://wa.me/${sel.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'11px 0',background:'rgba(127,190,133,0.08)',border:'0.5px solid rgba(127,190,133,0.42)',borderRadius:2,textDecoration:'none'}}><WaIcon/><span style={{fontFamily:F.label,fontWeight:300,fontSize:9,color:A.green,letterSpacing:'0.32em',textTransform:'uppercase'}}>WhatsApp</span></a>
                <a href={`tel:${sel.phone}`} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'11px 0',background:'var(--atelier-input-bg)',border:'0.5px solid var(--atelier-sheet-border)',borderRadius:2,textDecoration:'none'}}><span style={{fontFamily:F.display,fontSize:14,color:A.brassWarm,lineHeight:1}}>☎</span><span style={{fontFamily:F.label,fontWeight:300,fontSize:9,color:A.brassWarm,letterSpacing:'0.32em',textTransform:'uppercase'}}>Call</span></a>
              </div>
            )}
            {!confirmDel?(
              <div style={{display:'flex',gap:8}}>
                <button type="button" onClick={()=>{if(sel){setSel(null);setEditRow({id:sel.id});setAddOpen(true);}}} className="atelier-fab" style={{flex:1,padding:'12px 16px',borderRadius:2,cursor:'pointer',border:'0.5px solid #E0BC6E',fontFamily:F.label,fontWeight:400,fontSize:9,color:'#1A120E',letterSpacing:'0.32em',textTransform:'uppercase'}}>Edit Here</button>
                <button type="button" onClick={()=>{setSel(null);router.push(`/demo/vendor/${handle}/studio`);}} style={{flex:1,padding:'12px 16px',background:'transparent',border:'0.5px solid var(--atelier-sheet-border)',borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:9,color:A.brassWarm,letterSpacing:'0.32em',textTransform:'uppercase'}}>Via Chat</button>
                <button type="button" onClick={()=>setConfirmDel(true)} style={{flex:1,padding:'12px 16px',background:'transparent',border:'0.5px solid rgba(224,123,92,0.4)',borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:9,color:A.red,letterSpacing:'0.32em',textTransform:'uppercase'}}>Delete</button>
              </div>
            ):(
              <>
                <div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:14,color:A.inkSoft,textAlign:'center',lineHeight:1.6,padding:'8px 0'}}>
                  {slice==='leads'?'Lead will be marked as lost.':slice==='invoices'?'Invoice will be marked cancelled.':slice==='events'?'Event will be cancelled.':'This will be permanently deleted.'}<br/>
                  <span style={{fontSize:12,color:A.inkMute}}>Available in your full studio after signup.</span>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button type="button" onClick={()=>setConfirmDel(false)} style={{flex:1,padding:'12px 16px',background:'transparent',border:'0.5px solid var(--atelier-sheet-border)',borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:9,color:A.brassWarm,letterSpacing:'0.32em',textTransform:'uppercase'}}>Back</button>
                  <button type="button" onClick={()=>{showToast('Sign up to manage your data','success');setSel(null);setConfirmDel(false);}} style={{flex:1,padding:'12px 16px',background:A.red,border:'none',borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:400,fontSize:9,color:'#1A120E',letterSpacing:'0.32em',textTransform:'uppercase'}}>Confirm</button>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    </div>
  );
}
