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
const PRIORITY_COLOR:Record<string,string>={low:'var(--atelier-ink-fade)',normal:D.muted,high:'var(--role-caution)',urgent:D.red};
  // TDW_09 R-S2/R-S3 — the FIELD boundary, not the card hairline. `card-border`
  // is a panel edge (1.79:1 espresso / 1.40:1 paper); a control's edge has to
  // clear WCAG 1.4.11's 3:1 or the control is not identifiable as one. On paper
  // the fill cannot help — inputBg over the white sheet is 1.09:1 — so this edge
  // is the only thing that says `field`.
const inputStyle:React.CSSProperties={width:'100%',padding:'11px 14px',backgroundColor:'var(--atelier-input-bg)',border:'0.5px solid var(--atelier-input-border)',borderRadius:8,color:D.cream,fontFamily:F.body,fontWeight:300,fontSize:14,outline:'none',boxSizing:'border-box' as const};
const labelStyle:React.CSSProperties={fontFamily:F.label,fontWeight:300,fontSize:9,color:D.muted,letterSpacing:'0.2em',textTransform:'uppercase' as const,marginBottom:6};
type TabState='open'|'in_progress'|'done';
interface Task{id:string;title:string;description?:string;priority:string;state:TabState;due_date?:string;}
const DEMO_TASKS:Task[]=[
  {id:'t1',title:'Edit Ananya highlights reel',description:'30-60 second reel for Instagram',priority:'high',state:'open',due_date:'2026-06-10'},
  {id:'t2',title:'Send Priya Sharma contract',description:'Final booking contract PDF',priority:'urgent',state:'open'},
  {id:'t3',title:'Back up June shoot',priority:'normal',state:'in_progress'},
  {id:'t4',title:'Reply to Riya enquiry',priority:'normal',state:'done'},
];
const TAB_LABELS:{key:TabState;label:string}[]=[{key:'open',label:'Open'},{key:'in_progress',label:'In Progress'},{key:'done',label:'Done'}];
export default function DemoTasksPage(){
  const params=useParams();const handle=typeof params.handle==='string'?params.handle:'';
  const{vendorName}=useDemoContext(handle);const{toast,show}=useToast();
  const[tab,setTab]=useState<TabState>('open');const[tasks,setTasks]=useState<Task[]>(DEMO_TASKS);const[selected,setSelected]=useState<Task|null>(null);const[addOpen,setAddOpen]=useState(false);const[saving,setSaving]=useState(false);
  const[title,setTitle]=useState('');const[desc,setDesc]=useState('');const[dueDate,setDueDate]=useState('');const[priority,setPriority]=useState('normal');
  const filtered=tasks.filter(t=>t.state===tab);
  function doCreate(){if(!title.trim())return;const t:Task={id:`t${Date.now()}`,title:title.trim(),description:desc||undefined,priority,state:'open',due_date:dueDate||undefined};setTasks(prev=>[t,...prev]);show('Task created','success');setAddOpen(false);setTitle('');setDesc('');setDueDate('');setPriority('normal');}
  function advanceState(task:Task,nextState:TabState|'cancelled'){if(nextState==='cancelled'){setTasks(prev=>prev.filter(t=>t.id!==task.id));setSelected(null);show('Task cancelled','success');return;}setTasks(prev=>prev.map(t=>t.id===task.id?{...t,state:nextState as TabState}:t));setSelected(null);show('Updated','success');}
  function doDelete(task:Task){setTasks(prev=>prev.filter(t=>t.id!==task.id));setSelected(null);show('Task deleted','success');}
  const canCreate=title.trim().length>0;
  return(<div style={{flex:1,display:'flex',flexDirection:'column',background:'transparent',position:'relative'}}>
    <Toast toast={toast}/><DemoVendorHeader vendorName={vendorName} handle={handle}/>
    <div style={{display:'flex',borderBottom:`1px solid var(--atelier-card-border)`,flexShrink:0}}>{TAB_LABELS.map(t=>(<button key={t.key} type="button" onClick={()=>setTab(t.key)} style={{flex:1,padding:'14px 0',backgroundColor:'transparent',border:'none',cursor:'pointer',fontFamily:F.label,fontWeight:tab===t.key?400:300,fontSize:10,color:tab===t.key?D.gold:D.muted,letterSpacing:'0.15em',textTransform:'uppercase',borderBottom:tab===t.key?`1.5px solid ${D.gold}`:'1.5px solid transparent'}}>{t.label}</button>))}</div>
    {filtered.length===0?(<div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontFamily:F.body,fontWeight:300,fontSize:14,color:D.muted}}>No {tab.replace('_',' ')} tasks</span></div>
    ):(<div style={{flex:1,overflowY:'auto'}}>{filtered.map(task=>(<div key={task.id} onClick={()=>setSelected(task)} style={{padding:'16px 24px',borderBottom:`1px solid var(--atelier-card-border)`,cursor:'pointer'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
        <div style={{flex:1,minWidth:0}}><div style={{fontFamily:F.body,fontWeight:400,fontSize:15,color:D.cream}}>{task.title}</div>{task.description&&<div style={{fontFamily:F.body,fontWeight:300,fontSize:12,color:D.muted,marginTop:3,lineHeight:1.5}}>{task.description}</div>}{task.due_date&&<div style={{fontFamily:F.label,fontSize:9,color:task.due_date<new Date().toISOString().slice(0,10)?D.red:D.muted,letterSpacing:'0.1em',textTransform:'uppercase',marginTop:6}}>Due {task.due_date}</div>}</div>
        <span style={{fontFamily:F.label,fontSize:8,color:PRIORITY_COLOR[task.priority],letterSpacing:'0.15em',textTransform:'uppercase',flexShrink:0,paddingTop:2}}>{task.priority}</span>
      </div>
    </div>))}</div>)}
    <button type="button" onClick={()=>setAddOpen(true)} style={{position:'fixed',bottom:32,right:24,width:52,height:52,borderRadius:'50%',backgroundColor:'var(--atelier-accent-text)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10,boxShadow:'0 4px 20px var(--atelier-overlay-bg)'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
    {selected&&(<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',zIndex:20,display:'flex',alignItems:'flex-end'}} onClick={()=>setSelected(null)}><div onClick={e=>e.stopPropagation()} style={{width:'100%',background:D.card,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderRadius:'16px 16px 0 0',padding:'24px 24px 40px',display:'flex',flexDirection:'column',gap:12}}>
      <div style={{fontFamily:F.display,fontWeight:300,fontSize:22,color:D.cream}}>{selected.title}</div>
      {selected.description&&<p style={{fontFamily:F.body,fontWeight:300,fontSize:14,color:D.muted,margin:0,lineHeight:1.5}}>{selected.description}</p>}
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:4}}>{selected.due_date&&<span style={{fontFamily:F.label,fontSize:9,color:D.muted,letterSpacing:'0.1em',textTransform:'uppercase'}}>Due {selected.due_date}</span>}<span style={{fontFamily:F.label,fontSize:9,color:PRIORITY_COLOR[selected.priority],letterSpacing:'0.1em',textTransform:'uppercase'}}>{selected.priority}</span></div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {selected.state==='open'&&<button type="button" onClick={()=>advanceState(selected,'in_progress')} style={{flex:1,padding:'12px 0',backgroundColor:'transparent',border:`0.5px solid ${D.gold}`,borderRadius:8,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:10,color:D.gold,letterSpacing:'0.15em',textTransform:'uppercase'}}>Start</button>}
        {(selected.state==='open'||selected.state==='in_progress')&&<button type="button" onClick={()=>advanceState(selected,'done')} style={{flex:1,padding:'12px 0',backgroundColor:D.gold,border:'none',borderRadius:8,cursor:'pointer',fontFamily:F.label,fontWeight:400,fontSize:10,color:'#111',letterSpacing:'0.15em',textTransform:'uppercase'}}>Mark Done</button>}
        {(selected.state==='open'||selected.state==='in_progress')&&<button type="button" onClick={()=>advanceState(selected,'cancelled')} style={{flex:1,padding:'12px 0',backgroundColor:'transparent',border:`0.5px solid ${D.red}`,borderRadius:8,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:10,color:D.red,letterSpacing:'0.15em',textTransform:'uppercase'}}>Cancel</button>}
        {selected.state==='done'&&<button type="button" onClick={()=>doDelete(selected)} style={{flex:1,padding:'12px 0',backgroundColor:'transparent',border:`0.5px solid ${D.red}`,borderRadius:8,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:10,color:D.red,letterSpacing:'0.15em',textTransform:'uppercase'}}>Delete</button>}
      </div>
    </div></div>)}
    {addOpen&&(<div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',zIndex:20,display:'flex',alignItems:'flex-end'}} onClick={()=>setAddOpen(false)}><div onClick={e=>e.stopPropagation()} style={{width:'100%',background:D.card,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderRadius:'16px 16px 0 0',padding:'24px 24px 40px',display:'flex',flexDirection:'column',gap:14,maxHeight:'85vh',overflowY:'auto'}}>
      <div style={{fontFamily:F.display,fontWeight:300,fontSize:22,color:D.cream}}>New Task</div>
      <div><div style={labelStyle}>Title *</div><input style={inputStyle} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Edit highlight reel"/></div>
      <div><div style={labelStyle}>Description</div><input style={inputStyle} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Optional details"/></div>
      <div><div style={labelStyle}>Due Date</div><input style={inputStyle} type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}/></div>
      <div><div style={labelStyle}>Priority</div><select value={priority} onChange={e=>setPriority(e.target.value)} style={{...inputStyle,appearance:'none' as const}}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
      {!canCreate&&<p style={{fontFamily:F.body,fontWeight:300,fontSize:12,color:D.red,margin:0}}>Title is required to save.</p>}
      <button type="button" onClick={doCreate} disabled={!canCreate} style={{padding:'13px 0',backgroundColor:canCreate?D.gold:'var(--atelier-input-border)',border:'none',borderRadius:8,cursor:canCreate?'pointer':'not-allowed',fontFamily:F.label,fontWeight:400,fontSize:10,color:'#111',letterSpacing:'0.2em',textTransform:'uppercase'}}>Create Task</button>
    </div></div>)}
  </div>);
}
