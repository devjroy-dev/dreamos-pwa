'use client';
export const dynamic = 'force-dynamic';
// Business hub — exact copy of real app/vendor/studio/page.tsx
// All 5 list items + Team Hub (team, tasks, team-payments) — NO prestige gate in demo

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { useDemoContext } from '@/hooks/demo/useDemoContext';

const A = { ink:'var(--atelier-ink)', inkSoft:'var(--atelier-ink-soft)', inkMute:'var(--atelier-ink-mute)', brass:'var(--atelier-accent-text)', brassWarm:'var(--atelier-label)' } as const;
const F = { display:'var(--font-italiana), "GFS Didot", Georgia, serif', script:'var(--font-cormorant), Georgia, serif', label:'var(--font-jost), system-ui, sans-serif' } as const;

function Chevron() { return <span style={{ color:'var(--atelier-label)', fontFamily:F.display, fontSize:18, lineHeight:1, flexShrink:0 }}>›</span>; }

function SectionLabel({ label, first }: { label: string; first?: boolean }) {
  return (
    <div style={{ padding: first ? '24px 24px 14px' : '32px 24px 14px', display:'flex', alignItems:'center', gap:12 }}>
      <span style={{ fontFamily:F.label, fontWeight:300, fontSize:9, letterSpacing:'0.5em', textTransform:'uppercase', color:A.brass }}>{label}</span>
      <span style={{ flex:1, height:'0.5px', background:'rgba(201,168,76,0.22)' }} />
    </div>
  );
}

interface Item { href: string; label: string; desc: string; glyph: string; }

function Row({ item }: { item: Item }) {
  return (
    <Link href={item.href} style={{ display:'flex', alignItems:'center', padding:'16px 24px', gap:18, textDecoration:'none', borderBottom:'0.5px solid var(--atelier-card-border)', cursor:'pointer' }}>
      <span style={{ flexShrink:0, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F.display, fontWeight:400, fontSize:26, color:A.brassWarm, lineHeight:1 }}>{item.glyph}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:F.script, fontWeight:500, fontSize:19, color:A.ink, letterSpacing:'0.005em', lineHeight:1.15 }}>{item.label}</div>
        <div style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:12, color:A.inkMute, marginTop:2, letterSpacing:'0.01em' }}>{item.desc}</div>
      </div>
      <Chevron />
    </Link>
  );
}

export default function DemoBusinessPage() {
  const params = useParams();
  const handle = typeof params.handle === 'string' ? params.handle : '';
  const { vendorName } = useDemoContext(handle);
  const base = `/demo/vendor/${handle}`;

  const LISTS: Item[] = [
    { href:`${base}/list/clients`,  label:'Clients',  desc:'your people',           glyph:'C' },
    { href:`${base}/list/leads`,    label:'Leads',    desc:'who to follow up with', glyph:'L' },
    { href:`${base}/list/invoices`, label:'Invoices', desc:'who owes me money',     glyph:'I' },
    { href:`${base}/list/events`,   label:'Events',   desc:'schedule and shoots',   glyph:'◐' },
    { href:`${base}/list/expenses`, label:'Expenses', desc:'what went out',         glyph:'×' },
  ];
  const TEAM_ITEMS: Item[] = [
    { href:`${base}/studio/team`,          label:'Team',          desc:'roster and contact details', glyph:'T' },
    { href:`${base}/studio/tasks`,         label:'Tasks',         desc:'assignments and deadlines',  glyph:'✓' },
    { href:`${base}/studio/team-payments`, label:'Team Payments', desc:'what you owe your crew',     glyph:'◇' },
  ];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
      <DemoVendorHeader vendorName={vendorName} handle={handle} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden', paddingBottom:32 }}>
        <SectionLabel label="Your Studio" first />
        {LISTS.map(item => <div key={item.href}><Row item={item} /></div>)}
        <SectionLabel label="Team Hub" />
        {TEAM_ITEMS.map(item => <div key={item.href}><Row item={item} /></div>)}
      </div>
    </div>
  );
}
