'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { ChatThread } from '@/components/vendor/ChatThread';
import { InputBar } from '@/components/vendor/InputBar';
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

// ── TDW_08 P3 · DemoCommandBar IS DELETED, AND THIS NOTE IS WHY ──────────────
// The real `CommandBar` was deleted by founder ruling 2026-07-31 —「 delete completely 」
// (F-07.31) — because it was a control that looked live and changed nothing. This demo
// re-implementation survived that deletion, so the DEMO app showed a vendor a bar the
// REAL app no longer has: the mirror drifting away from the thing it mirrors, which is
// F-08.1's whole disease. Founder ruling, this block:「 kill command bar and other extra
// things which are not there in tdw 」.
//
// A SEALED BENCH ASSERTED ITS SURVIVAL and rides this deletion as a LABELLED AMENDMENT
// in the same act, never as a silent count movement: `scripts/tdw07_p4b_body.proof.mjs`
// §7.4 read "DemoCommandBar is UNTOUCHED and separate". It was correct when written —
// P4b's charter had no authority over the demo tree — and it is retired here by the
// sitting that gained that authority.
//
// F-08.1's OTHER FOUR re-implementations (`GreetingLine`, `LedgerCell`, `Ledger`,
// `EnquiryCard`) SURVIVE, and that is a decision rather than a stopping point: each has
// a real-app twin with an INCOMPATIBLE SIGNATURE, so they cannot converge by import
// without a shape ruling nobody has made. Named so the next sitting finds the reason.
//
// ── RE-POINTED TDW_09 O-2 (F-09.52, R-O14-AMENDED) ─────────────────────────────
// THREE, NOT FOUR. `EnquiryCard`'s real-app twin is GONE — deleted at
// app/vendor/page.tsx by the O-2 home build, where a full 611-line control census
// found its render count on the real plane was ZERO: defined, never mounted. So the
// mirror below was ALIVE while the thing it mirrored was DEAD — F-08.1's disease
// inverted, and the reason this comment's own premise no longer holds for it.
// `EnquiryCard` here is now demo-ORIGINAL, not a re-implementation of anything: it
// has no twin to converge with and no shape ruling to wait for. Its real-plane job
// passed to zone 2, WHAT'S WAITING. The other three re-implementations are unchanged
// and their reason above still stands.

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
              <button type="button" onClick={() => { onInject(`I’d like to reply to ${l.name ?? 'this enquiry'}. Draft something warm but not pushy.`); setDismissed(true); }} style={{ flexShrink:0, marginLeft:10, padding:'4px 10px', background:'none', border:`0.5px solid ${borderC}`, borderRadius:2, cursor:'pointer', fontFamily:F.label, fontWeight:400, fontSize:8, letterSpacing:'0.22em', textTransform:'uppercase' as const, color: T.isLight ? T.ink : A.brassWarm }}>Reply →</button>
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
      <GreetingLine vendorName={vendorName} newLeads={newLeads.length} nextDate={nextEvent?.event_date ?? null} />
      <Ledger newLeads={newLeads.length} nextEvent={nextEvent} />
      <EnquiryCard leads={newLeads.map(l => ({ name: l.name, wedding_date: l.wedding_date }))} onInject={send} />
      <ChatThread messages={messages} loading={loading} onConfirm={() => {}} onCancel={() => {}} onChipTap={send} scrollRef={chatScrollRef} />
      <InputBar onSend={send} disabled={loading} />
      {/* ── TDW_08 P3 · PeekNav DELETED — 「 kill command bar and other extra things
          which are not there in tdw 」, the same founder ruling that took DemoCommandBar.
          Derived before removal, not assumed: an unrestricted grep of app/ and components/
          found `PeekNav` imported at exactly ONE site — this one. The real vendor app
          mounts it nowhere. So the demo studio was showing a CREATE/ASK panel the product
          does not have, which is F-08.1's disease in its second costume: not a
          re-implementation of something real, but a surface the real app never had.
          The component file survives untouched; only this mount is gone, so a future
          sitting that wants it in the REAL app finds it whole. */}
    </div>
  );
}
