'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { ChatThread } from '@/components/vendor/ChatThread';
import { InputBar } from '@/components/vendor/InputBar';
import { PeekNav } from '@/components/vendor/PeekNav';
import { useDemoContext } from '@/hooks/demo/useDemoContext';
import { useDemoChat } from '@/hooks/demo/useDemoChat';
import { useDemoLeadsData, useDemoEventsData } from '@/hooks/demo/useDemoVendorData';
import { useT } from '@/lib/vendor/ThemeContext';

// Exact tokens from real app
const A = {
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassLine: 'rgba(201,168,76,0.18)',
  brassSoft: 'rgba(201,168,76,0.28)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function spell(n: number): string {
  const w = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'];
  return n >= 0 && n <= 10 ? w[n] : String(n);
}
function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Good Evening';
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}
function fmtEventDate(iso: string): string {
  try {
    const d = new Date(iso); const today = new Date();
    const diff = Math.round((d.getTime() - today.setHours(0,0,0,0)) / 86400000);
    if (diff === 0) return 'today';
    if (diff === 1) return 'tomorrow';
    if (diff <= 6)  return d.toLocaleDateString('en-IN', { weekday: 'long' }).toLowerCase();
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch { return iso; }
}

// ── Mock CommandBar — exact visual match, no API calls ──────────────────────
function DemoCommandBar({ newLeads }: { newLeads: number }) {
  const T = useT();
  const [open, setOpen] = useState(false);

  const barBg       = T.isLight ? 'rgba(245,242,238,0.94)' : 'rgba(18,12,8,0.88)';
  const stripBorder = T.isLight ? 'rgba(122,56,40,0.09)'   : 'rgba(201,168,76,0.09)';
  const panelSep    = T.isLight ? 'rgba(122,56,40,0.07)'   : 'rgba(201,168,76,0.07)';
  const trackBg     = T.isLight ? 'rgba(26,15,8,0.07)'     : 'rgba(240,230,210,0.06)';
  const dotColor    = T.isLight ? T.accent                  : '#C9A84C';
  const chevColor   = T.isLight ? 'rgba(122,56,40,0.38)'   : 'rgba(201,168,76,0.36)';
  const dimColor    = T.isLight ? T.inkDim                  : 'rgba(240,230,210,0.35)';
  const brassWarm   = T.isLight ? T.accent                  : 'rgba(201,168,76,0.82)';

  // Mock metrics — demo data
  const enquiryPct  = newLeads === 0 ? 100 : 0;
  const discoverPct = 72; // mock — decent but not complete
  const hotPct      = 40; // mock — some hot dates open
  const profilePct  = 85; // mock — mostly complete

  const parts: { text: string; color: string }[] = [];
  if (newLeads > 0) parts.push({ text: `${newLeads} unread`, color: brassWarm });
  parts.push({ text: 'Discover 72%', color: dimColor });
  parts.push({ text: '3 hot dates open', color: T.isLight ? '#7A3828' : '#E07B5C' });

  function progressColor(pct: number): string {
    if (pct < 30) return T.isLight ? '#B02A1A' : '#C0392B';
    if (pct < 60) return T.isLight ? '#A8811A' : '#D4A017';
    return T.isLight ? '#2E6E38' : '#3E8B4A';
  }

  return (
    <div style={{ flexShrink: 0, background: barBg, backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)', borderBottom: `0.5px solid ${stripBorder}` }}>
      <style>{`
        @keyframes cbPulse { 0%,100%{opacity:1} 50%{opacity:0.38} }
        @keyframes cbSlide { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Collapsed strip */}
      <button type="button" onClick={() => setOpen(o => !o)} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', padding:'8px 15px', gap:9, background:'none', border:'none', cursor:'pointer' }}>
        <span style={{ width:5, height:5, borderRadius:'50%', background:dotColor, boxShadow:`0 0 6px ${dotColor}cc`, flexShrink:0, animation: newLeads > 0 ? 'cbPulse 2.2s ease-in-out infinite' : 'none' }} />
        <span style={{ flex:1, fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:13, lineHeight:1, color:T.inkSoft, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {parts.map((p, i) => (
            <span key={i}>
              {i > 0 && <span style={{ color: dimColor }}> · </span>}
              <span style={{ color: p.color }}>{p.text}</span>
            </span>
          ))}
        </span>
        {/* 4 mini bars */}
        <span style={{ display:'flex', gap:4, alignItems:'center', flexShrink:0 }}>
          {[enquiryPct, profilePct, discoverPct, hotPct].map((pct, i) => (
            <span key={i} style={{ display:'block', width:20, height:3, background:trackBg, borderRadius:2, overflow:'hidden' }}>
              <span style={{ display:'block', width:`${pct}%`, height:'100%', background:progressColor(pct), borderRadius:2, transition:`width 700ms ${EASE}` }} />
            </span>
          ))}
        </span>
        <span style={{ fontSize:13, color:chevColor, flexShrink:0, lineHeight:1, transform: open ? 'rotate(-90deg)' : 'rotate(90deg)', transition:`transform 300ms ${EASE}`, display:'inline-block' }}>›</span>
      </button>

      {/* Expanded panel */}
      {open && (
        <div style={{ borderTop:`0.5px solid ${panelSep}`, padding:'11px 13px 13px', display:'flex', flexDirection:'column', gap:9, animation:`cbSlide 220ms ${EASE} both` }}>
          {[
            { title:'Enquiry Follow-ups', aside: newLeads === 0 ? 'all replied' : `${newLeads} awaiting reply`, pct: enquiryPct, alert: newLeads > 0, route:'/leads' },
            { title:'Incomplete Profiles', aside:'1 of 10 need info', pct: profilePct, alert:false, route:'/leads' },
            { title:'Discover Profile', aside:'72% done', pct: discoverPct, alert:true, route:'/discover' },
            { title:'Hot Dates Locked In', aside:'3 of 8 open', pct: hotPct, alert:true, route:'/calendar' },
          ].map((bar, i, arr) => {
            const asideColor = bar.alert ? (T.isLight ? '#7A3828' : '#E07B5C') : T.inkDim;
            const routeColor = T.isLight ? 'rgba(26,15,8,0.18)' : 'rgba(240,230,210,0.14)';
            const borderColor = T.isLight ? 'rgba(122,56,40,0.12)' : 'rgba(201,168,76,0.1)';
            const bgColor = T.isLight ? 'rgba(26,15,8,0.02)' : 'rgba(245,235,212,0.02)';
            return (
              <div key={bar.title}>
                <div style={{ width:'100%', textAlign:'left', padding:'9px 11px', border:`0.5px solid ${borderColor}`, borderRadius:3, background:bgColor, display:'flex', flexDirection:'column', gap:6 }}>
                  <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:6 }}>
                    <span style={{ fontFamily:F.label, fontSize:7.5, fontWeight:300, letterSpacing:'0.36em', textTransform:'uppercase', color:T.isLight?'rgba(122,56,40,0.62)':'rgba(201,168,76,0.6)', lineHeight:1 }}>{bar.title}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                      <span style={{ fontFamily:F.label, fontSize:6.5, fontWeight:300, letterSpacing:'0.14em', textTransform:'uppercase', color:routeColor, padding:'1px 5px', border:`0.5px solid ${T.isLight?'rgba(26,15,8,0.07)':'rgba(240,230,210,0.07)'}`, borderRadius:2 }}>{bar.route}</span>
                      <span style={{ fontFamily:F.script, fontStyle:'italic', fontSize:10.5, color:asideColor }}>{bar.aside}</span>
                      <span style={{ fontSize:10, color:T.isLight?'rgba(122,56,40,0.38)':'rgba(201,168,76,0.35)' }}>→</span>
                    </span>
                  </div>
                  <div style={{ width:'100%', height:3.5, background:trackBg, borderRadius:3, overflow:'hidden' }}>
                    <div style={{ width:`${bar.pct}%`, height:'100%', background:progressColor(bar.pct), borderRadius:3, transition:`width 700ms ${EASE}` }} />
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ height:'0.5px', background:panelSep, marginTop:9 }} />}
              </div>
            );
          })}

          {/* Collapse */}
          <button type="button" onClick={() => setOpen(false)} style={{ width:'100%', padding:'4px 0 2px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <span style={{ display:'block', width:32, height:'0.5px', background: T.isLight?'rgba(122,56,40,0.15)':'rgba(201,168,76,0.15)' }} />
            <span style={{ fontSize:14, color: T.isLight?'rgba(122,56,40,0.35)':'rgba(201,168,76,0.35)', lineHeight:1, transform:'rotate(-90deg)', display:'inline-block' }}>›</span>
            <span style={{ display:'block', width:32, height:'0.5px', background: T.isLight?'rgba(122,56,40,0.15)':'rgba(201,168,76,0.15)' }} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── GreetingLine — exact copy from real app ─────────────────────────────────
function GreetingLine({ vendorName, newLeads, nextDate }: { vendorName: string | null; newLeads: number; nextDate: string | null }) {
  const T = useT();
  const greeting = timeOfDayGreeting();
  const tod = greeting.toLowerCase().includes('evening') ? 'evening' : greeting.toLowerCase().includes('afternoon') ? 'afternoon' : 'morning';
  let line: string;
  if (newLeads === 0) line = 'A quiet day. Everything in order.';
  else line = newLeads === 1 ? `One letter awaits you this ${tod}.` : `${spell(newLeads)} letters await you this ${tod}.`;
  return (
    <div style={{ textAlign: 'center', padding: '16px 24px 4px' }}>
      <div style={{ fontFamily: F.label, fontWeight: 200, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: T.isLight ? T.inkMute : 'rgba(201,168,76,0.7)', marginBottom: 10 }}>{greeting}</div>
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: T.inkSoft, lineHeight: 1.4, letterSpacing: '0.01em', maxWidth: 320, margin: '0 auto' }}>{line}</div>
    </div>
  );
}

// ── LedgerCell — exact copy ─────────────────────────────────────────────────
function LedgerCell({ big, label, sub, accent, bigSize = 32, bigColor, bigFamily, bigItalic, divider }: {
  big: string; label: string; sub: string; accent?: boolean;
  bigSize?: number; bigColor?: string; bigFamily?: string; bigItalic?: boolean; divider?: boolean;
}) {
  const T = useT();
  return (
    <div style={{ flex: 1, textAlign: 'center', padding: '0 4px', position: 'relative' }}>
      {divider && <span aria-hidden style={{ position:'absolute', left:0, top:'12%', bottom:'12%', width:'0.5px', background: T.isLight ? 'rgba(122,56,40,0.18)' : 'rgba(201,168,76,0.22)' }} />}
      <div style={{ fontFamily: bigFamily ?? F.display, fontWeight: 400, fontStyle: bigItalic ? 'italic' : 'normal', fontSize: bigSize, lineHeight: 1, color: bigColor ?? (accent ? 'var(--atelier-ink)' : 'var(--atelier-ink-dim)'), letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{big}</div>
      <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.34em', textTransform: 'uppercase', color: T.isLight ? T.inkMute : 'rgba(201,168,76,0.75)', marginTop: 6 }}>{label}</div>
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 10, color: T.inkDim, marginTop: 2, letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
    </div>
  );
}

// ── Ledger — exact copy ─────────────────────────────────────────────────────
function Ledger({ newLeads, nextEvent }: { newLeads: number; nextEvent: { title: string; event_date: string } | null }) {
  const T = useT();
  return (
    <div style={{ display:'flex', alignItems:'stretch', padding:'14px 8px 12px', margin:'10px 22px 0', borderTop:`0.5px solid ${T.isLight ? 'rgba(122,56,40,0.22)' : A.brassSoft}`, borderBottom:`0.5px solid ${T.isLight ? 'rgba(122,56,40,0.22)' : A.brassSoft}`, position:'relative' }}>
      <div style={{ position:'absolute', top:-7, left:'50%', transform:'translateX(-50%)', background:`linear-gradient(180deg, ${T.pageBg} 0%, ${T.pageBg} 60%, transparent 100%)`, padding:'0 14px', height:14, display:'flex', alignItems:'center', color: T.isLight ? T.accent : A.brass, fontSize:9, letterSpacing:'0.3em' }}>◆</div>
      <LedgerCell big={String(newLeads)} bigSize={32} label="Letters" sub={newLeads === 0 ? 'all replied' : 'awaiting reply'} accent={newLeads > 0} />
      <LedgerCell big="—" bigSize={32} label="Owed" sub="nothing pending" accent={false} divider />
      <LedgerCell big={nextEvent ? fmtEventDate(nextEvent.event_date) : '—'} bigSize={nextEvent ? 18 : 32} bigFamily={nextEvent ? F.script : undefined} bigItalic={!!nextEvent} label="Next" sub={nextEvent ? nextEvent.title : 'no engagements'} accent={!!nextEvent} divider />
    </div>
  );
}

// ── EnquiryCard — exact copy ────────────────────────────────────────────────
function EnquiryCard({ leads, onInject }: { leads: { name: string | null; wedding_date: string | null }[]; onInject: (t: string) => void }) {
  const T = useT();
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded]   = useState(false);
  if (dismissed || leads.length === 0) return null;
  const count   = leads.length;
  const accentC = T.isLight ? T.accent : A.brass;
  const borderC = T.isLight ? 'rgba(122,56,40,0.18)' : 'rgba(201,168,76,0.18)';
  return (
    <div style={{ margin: '8px 22px 0', position: 'relative' }}>
      <button type="button" onClick={() => setExpanded(e => !e)} style={{ width:'100%', display:'flex', alignItems:'center', padding:'9px 14px', background: T.isLight ? 'rgba(122,56,40,0.05)' : 'rgba(201,168,76,0.06)', border:`0.5px solid ${borderC}`, borderRadius: expanded ? '6px 6px 0 0' : 6, cursor:'pointer', textAlign:'left' as const }}>
        <span style={{ width:6, height:6, borderRadius:'50%', flexShrink:0, background:accentC, marginRight:10, boxShadow:`0 0 6px ${accentC}88` }} />
        <span style={{ fontFamily:F.label, fontWeight:300, fontSize:9, letterSpacing:'0.28em', textTransform:'uppercase' as const, color:accentC, flex:1 }}>{count === 1 ? '1 New Enquiry' : `${count} New Enquiries`}</span>
        <span style={{ fontFamily:F.label, fontSize:10, color:accentC, transform: expanded ? 'rotate(180deg)' : 'none', display:'inline-block', transition:'transform 220ms' }}>▾</span>
        <span role="button" onClick={e => { e.stopPropagation(); setDismissed(true); }} style={{ marginLeft:10, width:16, height:16, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:T.inkDim, fontSize:11, cursor:'pointer', flexShrink:0 }}>×</span>
      </button>
      {expanded && (
        <div style={{ border:`0.5px solid ${borderC}`, borderTop:'none', borderRadius:'0 0 6px 6px', overflow:'hidden' }}>
          {leads.map((l, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', padding:'8px 14px', borderTop: i === 0 ? 'none' : `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.08)' : 'rgba(201,168,76,0.08)'}`, background: T.isLight ? 'rgba(122,56,40,0.02)' : 'rgba(201,168,76,0.03)' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:F.display, fontWeight:400, fontSize:16, color:'var(--atelier-ink)', lineHeight:1.1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{l.name ?? 'Unnamed'}</div>
                {l.wedding_date && <div style={{ fontFamily:F.script, fontStyle:'italic', fontSize:10, color:'var(--atelier-ink-mute)', marginTop:1 }}>{l.wedding_date}</div>}
              </div>
              <button type="button" onClick={() => { onInject(`I'd like to reply to ${l.name ?? 'this enquiry'}. Draft something warm but not pushy.`); setDismissed(true); }} style={{ flexShrink:0, marginLeft:10, padding:'4px 10px', background:'none', border:`0.5px solid ${borderC}`, borderRadius:2, cursor:'pointer', fontFamily:F.label, fontWeight:400, fontSize:8, letterSpacing:'0.22em', textTransform:'uppercase' as const, color: T.isLight ? T.ink : A.brassWarm }}>Reply →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DemoStudioPage() {
  const params = useParams();
  const handle = typeof params.handle === 'string' ? params.handle : '';
  const { vendor, loading, vendorName } = useDemoContext(handle);
  if (loading) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <Suspense fallback={<div style={{ flex: 1 }} />}><ChatScreen handle={handle} vendorName={vendorName} category={vendor?.category ?? null} city={vendor?.city ?? null} /></Suspense>;
}

function ChatScreen({ handle, vendorName, category, city }: { handle: string; vendorName: string | null; category: string | null; city: string | null }) {
  const { messages, loading, send } = useDemoChat({ handle });
  const { data: leads }  = useDemoLeadsData(handle);
  const { data: events } = useDemoEventsData();
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const today     = new Date().toISOString().slice(0, 10);
  const newLeads  = (leads ?? []).filter(l => l.state === 'new');
  const nextEvent = (events ?? []).filter(e => e.event_date >= today && e.state === 'upcoming').sort((a, b) => a.event_date < b.event_date ? -1 : 1)[0] ?? null;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
      <DemoVendorHeader vendorName={vendorName} handle={handle} category={category} city={city} />
      <DemoCommandBar newLeads={newLeads.length} />
      <GreetingLine vendorName={vendorName} newLeads={newLeads.length} nextDate={nextEvent?.event_date ?? null} />
      <Ledger newLeads={newLeads.length} nextEvent={nextEvent} />
      <EnquiryCard leads={newLeads.map(l => ({ name: l.name, wedding_date: l.wedding_date }))} onInject={send} />
      <ChatThread messages={messages} loading={loading} onConfirm={() => {}} onCancel={() => {}} onChipTap={send} scrollRef={chatScrollRef} />
      <InputBar onSend={send} disabled={loading} />
      <PeekNav scrollRef={chatScrollRef} context={null} onSend={send} />
    </div>
  );
}
