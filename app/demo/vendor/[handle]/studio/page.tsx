'use client';
// app/demo/vendor/[handle]/studio/page.tsx
// Demo DreamAi studio — EXACT real vendor app UI.
// Real components, real styles, real fonts.
// NO session. NO auth. Handle = identity.

export const dynamic = 'force-dynamic';

import { useParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { Header } from '@/components/vendor/Header';
import { ChatThread } from '@/components/vendor/ChatThread';
import { InputBar } from '@/components/vendor/InputBar';
import { CommandBar } from '@/components/vendor/CommandBar';
import { PeekNav } from '@/components/vendor/PeekNav';
import { useDemoContext } from '@/hooks/demo/useDemoContext';
import { useDemoChat } from '@/hooks/demo/useDemoChat';
import { useT } from '@/lib/vendor/ThemeContext';

const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
};

function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Good Evening';
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function GreetingLine({ vendorName }: { vendorName: string | null }) {
  const T = useT();
  const greeting = timeOfDayGreeting();
  return (
    <div style={{ textAlign: 'center', padding: '16px 24px 4px' }}>
      <div style={{ fontFamily: F.label, fontWeight: 200, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: T.isLight ? T.inkMute : 'rgba(201,168,76,0.7)', marginBottom: 10 }}>
        {greeting}
      </div>
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: T.inkSoft, lineHeight: 1.4, letterSpacing: '0.01em', maxWidth: 320, margin: '0 auto' }}>
        {vendorName ? `Welcome, ${vendorName}. Your leads await.` : 'Welcome back.'}
      </div>
    </div>
  );
}

function DemoLedger({ newLeads }: { newLeads: number }) {
  const T = useT();
  const brass = 'rgba(201,168,76,0.18)';
  const brassWarm = 'var(--atelier-label)';
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', padding: '14px 8px 12px', margin: '10px 22px 0', borderTop: `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.22)' : brass}`, borderBottom: `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.22)' : brass}`, position: 'relative' }}>
      <div style={{ position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(180deg, ${T.pageBg} 0%, ${T.pageBg} 60%, transparent 100%)`, padding: '0 14px', height: 14, display: 'flex', alignItems: 'center', color: T.isLight ? T.accent : '#C9A84C', fontSize: 9, letterSpacing: '0.3em' }}>◆</div>
      <div style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
        <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 32, lineHeight: 1, color: newLeads > 0 ? 'var(--atelier-ink)' : 'var(--atelier-ink-dim)', letterSpacing: '-0.01em' }}>{newLeads}</div>
        <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.34em', textTransform: 'uppercase', color: T.isLight ? T.inkMute : 'rgba(201,168,76,0.75)', marginTop: 6 }}>Letters</div>
        <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 10, color: T.inkDim, marginTop: 2 }}>{newLeads === 0 ? 'all replied' : 'awaiting reply'}</div>
      </div>
      <div style={{ flex: 1, textAlign: 'center', padding: '0 4px', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 0, top: '12%', bottom: '12%', width: '0.5px', background: T.isLight ? 'rgba(122,56,40,0.18)' : 'rgba(201,168,76,0.22)' }} />
        <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 32, lineHeight: 1, color: 'var(--atelier-ink-dim)', letterSpacing: '-0.01em' }}>—</div>
        <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.34em', textTransform: 'uppercase', color: T.isLight ? T.inkMute : 'rgba(201,168,76,0.75)', marginTop: 6 }}>Owed</div>
        <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 10, color: T.inkDim, marginTop: 2 }}>nothing pending</div>
      </div>
      <div style={{ flex: 1, textAlign: 'center', padding: '0 4px', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 0, top: '12%', bottom: '12%', width: '0.5px', background: T.isLight ? 'rgba(122,56,40,0.18)' : 'rgba(201,168,76,0.22)' }} />
        <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 18, lineHeight: 1, color: 'var(--atelier-ink)', letterSpacing: '-0.01em' }}>tomorrow</div>
        <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.34em', textTransform: 'uppercase', color: T.isLight ? T.inkMute : 'rgba(201,168,76,0.75)', marginTop: 6 }}>Next</div>
        <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 10, color: T.inkDim, marginTop: 2 }}>Bridal Trial</div>
      </div>
    </div>
  );
}

export default function DemoStudioPage() {
  const params = useParams();
  const handle = typeof params.handle === 'string' ? params.handle : '';
  const { vendorId, vendorName, loading } = useDemoContext(handle);

  if (loading) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <Suspense fallback={<div style={{ flex: 1 }} aria-busy="true" />}>
      <ChatScreen handle={handle} vendorId={vendorId} vendorName={vendorName} />
    </Suspense>
  );
}

function ChatScreen({ handle, vendorId, vendorName }: { handle: string; vendorId: string; vendorName: string | null }) {
  const { messages, loading, send } = useDemoChat({ handle });
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [justDoIt, setJustDoIt] = useState(false);

  // Build a minimal context shape for components that need it
  const mockContext = {
    vendor:           { name: vendorName, category: null, city: null, tier: 'signature', routing_handle: null },
    new_leads:        [],
    upcoming_events:  [],
    pending_invoices: [],
    open_leads_count: 0,
  };

  // Count new leads for ledger
  const newLeadsCount = messages.length > 1 ? 0 : 0; // will update once context loads

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
      <Header vendorName={vendorName} />

      <CommandBar
        context={null}
        vendorId={vendorId}
        justDoIt={justDoIt}
        onJustDoItChange={setJustDoIt}
      />

      <GreetingLine vendorName={vendorName} />
      <DemoLedger newLeads={0} />

      {/* Demo banner */}
      <div style={{ margin: '10px 22px 0', padding: '9px 14px', background: 'rgba(201,168,76,0.06)', border: '0.5px solid rgba(201,168,76,0.18)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', boxShadow: '0 0 6px rgba(201,168,76,0.6)', flexShrink: 0 }} />
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C', flex: 1 }}>Demo Studio — WhatsApp access after signup</span>
      </div>

      <ChatThread
        messages={messages}
        loading={loading}
        onConfirm={() => {}}
        onCancel={() => {}}
        onChipTap={send}
        scrollRef={chatScrollRef}
      />

      <InputBar onSend={send} disabled={loading} />
      <PeekNav scrollRef={chatScrollRef} context={null} onSend={send} />
    </div>
  );
}
