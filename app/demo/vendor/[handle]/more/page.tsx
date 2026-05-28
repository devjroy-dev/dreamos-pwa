'use client';
export const dynamic = 'force-dynamic';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { useDemoContext } from '@/hooks/demo/useDemoContext';

const A={ink:'var(--atelier-ink)',inkSoft:'var(--atelier-ink-soft)',inkMute:'var(--atelier-ink-mute)',brass:'var(--atelier-accent-text)',brassWarm:'var(--atelier-label)',red:'#E07B5C'} as const;
const F={display:'var(--font-italiana), "GFS Didot", Georgia, serif',script:'var(--font-cormorant), Georgia, serif',label:'var(--font-jost), system-ui, sans-serif'} as const;
const Chevron=()=><span style={{color:'var(--atelier-label)',fontFamily:F.display,fontSize:18,lineHeight:1,flexShrink:0}}>›</span>;
function SL({label,first}:{label:string;first?:boolean}){return<div style={{padding:first?'24px 24px 14px':'32px 24px 14px',display:'flex',alignItems:'center',gap:12}}><span style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.5em',textTransform:'uppercase',color:A.brass}}>{label}</span><span style={{flex:1,height:'0.5px',background:'rgba(201,168,76,0.22)'}}/></div>;}
interface Item{href?:string;label:string;description:string;glyph:string;danger?:boolean;action?:()=>void;}
function MoreRow({item,_k}:{item:Item;_k?:React.Key}){
  const inner=<><span style={{flexShrink:0,width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.display,fontWeight:400,fontSize:24,color:item.danger?A.red:A.brassWarm,lineHeight:1}}>{item.glyph}</span><div style={{flex:1,minWidth:0}}><div style={{fontFamily:F.script,fontWeight:500,fontSize:19,color:item.danger?A.red:A.ink,letterSpacing:'0.005em',lineHeight:1.15}}>{item.label}</div>{item.description&&<div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:12,color:A.inkMute,marginTop:2,letterSpacing:'0.01em'}}>{item.description}</div>}</div>{!item.action&&<Chevron/>}</>;
  const rowStyle:React.CSSProperties={display:'flex',alignItems:'center',padding:'16px 24px',gap:18,textDecoration:'none',borderBottom:'0.5px solid var(--atelier-card-border)',background:'none',border:'none',width:'100%',cursor:'pointer',textAlign:'left' as const};
  if(item.action)return<button type="button" onClick={item.action} style={rowStyle as React.CSSProperties}>{inner}</button>;
  return<Link href={item.href!} style={{...rowStyle,borderBottom:'0.5px solid var(--atelier-card-border)'}}>{inner}</Link>;
}
export default function DemoMorePage(){
  const params=useParams();const handle=typeof params.handle==='string'?params.handle:'';
  const router=useRouter();const{vendorName}=useDemoContext(handle);const base=`/demo/vendor/${handle}`;
  const DISCOVER_ITEMS:Item[]=[
    {href:`${base}/discover`,  label:'Discover Status',description:'your profile on The Dream Wedding',glyph:'◐'},
    {href:`${base}/portfolio`, label:'Portfolio',      description:'images and photo library',         glyph:'▣'},
    {href:`${base}/couture`,   label:'Couture',        description:'appointments and availability',    glyph:'♡'},
    {href:`${base}/featured`,  label:'Featured',       description:'promoted slots and promos',         glyph:'✦'},
  ];
  const TEAM_ITEMS:Item[]=[
    {href:`${base}/business`,  label:'Team Hub',       description:'team, tasks, and briefing',        glyph:'T'},
  ];
  const FINANCE_ITEMS:Item[]=[
    {href:`${base}/tds`,       label:'TDS',            description:'tax deducted at source',           glyph:'%'},
    {href:`${base}/contracts`, label:'Contracts',      description:'signed agreements and PDFs',        glyph:'§'},
  ];
  const ACCOUNT_ITEMS:Item[]=[
    {href:`${base}/settings`,  label:'Settings',       description:'profile, billing, preferences',    glyph:'⚙'},
    {label:'Back to Demo',description:'return to landing',glyph:'→',action:()=>router.push(`${base}`)},
  ];
  return(<div style={{flex:1,display:'flex',flexDirection:'column',overflowY:'auto'}}>
    <DemoVendorHeader vendorName={vendorName} handle={handle}/>
    <div style={{flex:1,paddingBottom:40}}>
      <SL label="Discover" first/>{DISCOVER_ITEMS.map(item=><div key={item.label}><MoreRow item={item}/></div>)}
      <SL label="Team"/>{TEAM_ITEMS.map(item=><div key={item.label}><MoreRow item={item}/></div>)}
      <SL label="Finance"/>{FINANCE_ITEMS.map(item=><div key={item.label}><MoreRow item={item}/></div>)}
      <SL label="Account"/>{ACCOUNT_ITEMS.map(item=><div key={item.label}><MoreRow item={item}/></div>)}
    </div>
  </div>);
}
