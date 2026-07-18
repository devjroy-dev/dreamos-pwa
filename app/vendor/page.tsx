'use client';
// app/wedding/page.tsx — AI Hub · Atelier rebuild
//
// The Hub at dusk. Brass-lamp gradient bleeding in from upper-left.
// Greeting in italic Cormorant. Three-cell brass ledger above a ◆ printer's mark.
// Calling card with corner ornaments for new enquiries.
// DreamAi message styled as a whisper — italic Cormorant beside a luminous brass hairline.
//
// All hooks, primer/autoSend logic, streaming, and OnboardingOverlay are preserved.
// Only the visual layer changes.

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/vendor/Header';
import { VictorModeChip } from '@/components/vendor/VictorModeChip'; // TDW_06 P6d (R-2)
import { ChatThread } from '@/components/vendor/ChatThread';
import { FreshThreadControl } from '@/components/vendor/FreshThreadControl'; // TDW_06 D-7
import { InputBar } from '@/components/vendor/InputBar';
import { TierMeter } from '@/components/vendor/TierMeter'; // TDW_02 P5
import { CommandBar } from '@/components/vendor/CommandBar';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useCabinetData } from '@/hooks/vendor/useVendorData'; // TDW_04 A3: binder truth, already cached on this screen
import { deriveMoney, type MoneyDerivation } from '@/lib/vendor/derive'; // TDW_04 A3: THE derivation
import { setVendorSession } from '@/lib/vendor/session';

import { getJson } from '@/lib/vendor/api/_base';
import { useChat } from '@/hooks/vendor/useChat';
import { useToast } from '@/hooks/vendor/useToast';
import { Toast } from '@/components/vendor/Toast';
import { createNote } from '@/lib/vendor/api/vendor';

import { OnboardingOverlay } from '@/components/vendor/OnboardingOverlay';
import Cabinet from '@/components/vendor/Cabinet';
import { useT } from '@/lib/vendor/ThemeContext';
import type { VendorContextResponse } from '@/lib/vendor/types/vendor';

// ── Static Atelier tokens (non-theme-sensitive) ──────────────────
const A = {
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassDeep: '#B59548',
  brassLine: 'rgba(201,168,76,0.18)',
  brassSoft: 'rgba(201,168,76,0.28)',
  terracotta:'#E07B5C',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

// ── Quick action primers ────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: '+ Client',  primer: "What are the details of the new client? Give me their name and phone number to start." },
  { label: '+ Invoice', primer: "Give me the details for the invoice — client name, total amount, and any advance?" },
  { label: '+ Expense', primer: "What did you spend on? Give me the amount and what it was for." },
  { label: '+ Event',   primer: "What's the event? Give me a title, date, and time if you have it." },
  { label: '+ Lead',    primer: "Tell me about the new enquiry — paste it or describe it and I'll log it." },
];

// ── Rs formatter — keeps L/Cr suffixes for snapshot density ─────
// TDW_04 A3 (ST-4's acceptance, executor judgment — flagged for CE review):
// the compact form must not ROUND AWAY the agreement it exists to prove. The
// old one-decimal L (and whole-number K) printed Rs 1,25,000 as "1.3L" and
// Rs 65,400 as "65K" — while the Invoices masthead, reading the SAME
// derivation, printed the exact figure. A vendor comparing the two saw a
// disagreement that wasn't there. Compaction is a design need (this brass cell
// is ~120px wide); rounding is not. So: keep the compact scale, drop the lie —
// trailing zeros stripped, real precision kept (1.25L, 65.4K, 1.3L when it IS
// 1.3L). Only used by the Owed cell (verified: one call site, ln ~181).
function fmtRs(n: number): string {
  const compact = (v: number, suffix: string) => {
    const s = v.toFixed(2).replace(/\.?0+$/, '');
    return `${s}${suffix}`;
  };
  if (n >= 10000000) return compact(n / 10000000, 'Cr');
  if (n >= 100000)   return compact(n / 100000, 'L');
  if (n >= 1000)     return compact(n / 1000, 'K');
  return String(n);
}
function fmtEventDate(iso: string): string {
  try {
    const d = new Date(iso);
    const today = new Date();
    const diff  = Math.round((d.getTime() - today.setHours(0,0,0,0)) / 86400000);
    if (diff === 0) return 'today';
    if (diff === 1) return 'tomorrow';
    if (diff <= 6)  return d.toLocaleDateString('en-IN', { weekday: 'long' }).toLowerCase();
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch (_e) { return iso; }
}
function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Good Evening';
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// ── Greeting line — Cormorant italic. Reads as a butler announcing the moment ──
function GreetingLine({ context, money }: { context: VendorContextResponse | null; money: MoneyDerivation }) {
  const T = useT();
  const greeting = timeOfDayGreeting();
  const timeOfDay = greeting.toLowerCase().includes('evening') ? 'evening'
                  : greeting.toLowerCase().includes('afternoon') ? 'afternoon'
                  : 'morning';

  // TDW_04 A3 (ST-4/L-4): letters stay TYPED (enquiries are typed rows);
  // the money count is BINDER-derived — the same figure the Invoices page
  // shows, because it's the same function (lib/vendor/derive.ts). The old
  // read totalled public.invoices and could greet you with phantoms.
  const leads = context?.new_leads?.length ?? 0;
  const owedCount = money.owedCount;

  let line: string;
  if (!context) {
    line = `Welcome back.`;
  } else if (leads === 0 && owedCount === 0) {
    line = 'A quiet day. Everything in order.';
  } else if (leads > 0 && owedCount > 0) {
    const leadWord = leads === 1 ? 'One letter awaits' : `${spell(leads)} letters await you`;
    const invWord  = owedCount === 1 ? 'one invoice remains' : `${owedCount} invoices remain`;
    line = `${leadWord} this ${timeOfDay}, and ${invWord}.`;
  } else if (leads > 0) {
    line = leads === 1
      ? `One letter awaits you this ${timeOfDay}.`
      : `${spell(leads)} letters await you this ${timeOfDay}.`;
  } else {
    line = owedCount === 1
      ? `One invoice remains to be collected.`
      : `${owedCount} invoices remain to be collected.`;
  }

  return (
    <div style={{ textAlign: 'center', padding: '16px 24px 4px' }}>
      <div style={{
        fontFamily: F.label, fontWeight: 200, fontSize: 9,
        letterSpacing: '0.42em', textTransform: 'uppercase',
        color: T.isLight ? T.inkMute : 'rgba(201,168,76,0.7)', marginBottom: 10,
      }}>{greeting}</div>
      <div style={{
        fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
        fontSize: 19, color: T.inkSoft,
        lineHeight: 1.4, letterSpacing: '0.01em',
        maxWidth: 320, margin: '0 auto',
      }}>{line}</div>
    </div>
  );
}

// Spell small integers — keeps the greeting reading like prose, not data
function spell(n: number): string {
  const words = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'];
  return n >= 0 && n <= 10 ? words[n] : String(n);
}

// ── The Ledger — three brass cells with a ◆ printer's mark above ──
function Ledger({ context, money }: { context: VendorContextResponse | null; money: MoneyDerivation }) {
  const T = useT();
  // TDW_04 A3 (ST-4/L-4) — one derivation, two renderers: `owed` here and
  // `outstanding` on the Invoices masthead are the same call into
  // lib/vendor/derive.ts over the same binder rows. They cannot drift.
  const leads      = context?.new_leads?.length ?? 0;
  const owed       = money.outstanding;
  const owedCount  = money.owedCount;
  const nextEvent  = context?.upcoming_events?.[0] ?? null;

  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      padding: '14px 8px 12px',
      margin: '10px 22px 0',
      borderTop: `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.22)' : A.brassSoft}`,
      borderBottom: `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.22)' : A.brassSoft}`,
      position: 'relative',
    }}>
      {/* Printer's mark ◆ — small brass diamond floating above the rule.
          The bgWarm padding trick "cuts" the top border behind it. */}
      <div style={{
        position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
        background: `linear-gradient(180deg, ${T.pageBg} 0%, ${T.pageBg} 60%, transparent 100%)`,
        padding: '0 14px', height: 14, display: 'flex', alignItems: 'center',
        color: T.isLight ? T.accent : A.brass, fontSize: 9, letterSpacing: '0.3em',
      }}>◆</div>

      <LedgerCell
        big={String(leads)}
        bigSize={48}
        label="Letters"
        // L-4's lane clause: enquiries stay typed — the sub-line says whose plane.
        sub={leads === 0 ? 'enquiries · all replied' : 'enquiries · awaiting reply'}
        accent={leads > 0}
      />
      <LedgerCell
        big={owed > 0 ? fmtRs(owed) : '—'}
        bigSize={owed > 0 ? 34 : 48}
        label="Owed"
        // Lane honesty: this figure is your binders' truth, not a stale invoice table.
        sub={owedCount === 0 ? 'from your binders · settled' : owedCount === 1 ? 'from your binders · 1 open' : `from your binders · ${owedCount} open`}
        accent={owed > 0}
        bigColor={owed > 0 ? (T.isLight ? T.accent : A.brassWarm) : undefined}
        divider
      />
      <LedgerCell
        big={nextEvent ? fmtEventDate(nextEvent.event_date) : '—'}
        bigSize={nextEvent ? 22 : 48}
        bigFamily={nextEvent ? F.script : undefined}
        bigItalic={!!nextEvent}
        label="Next"
        sub={nextEvent ? nextEvent.title : 'no engagements'}
        accent={!!nextEvent}
        divider
      />
    </div>
  );
}

function LedgerCell({
  big, label, sub, accent, bigSize = 46, bigColor, bigFamily, bigItalic, divider,
}: {
  big: string; label: string; sub: string; accent?: boolean;
  bigSize?: number; bigColor?: string; bigFamily?: string; bigItalic?: boolean;
  divider?: boolean;
}) {
  const T = useT();
  return (
    <div style={{
      flex: 1, textAlign: 'center', padding: '0 4px',
      position: 'relative',
    }}>
      {divider && (
        <span aria-hidden style={{
          position: 'absolute', left: 0, top: '12%', bottom: '12%',
          width: '0.5px', background: T.isLight ? 'rgba(122,56,40,0.18)' : 'rgba(201,168,76,0.22)',
        }} />
      )}
      <div style={{
        fontFamily: bigFamily ?? F.display,
        fontWeight: 400,
        fontStyle: bigItalic ? 'italic' : 'normal',
        fontSize: bigSize,
        lineHeight: 1,
        color: bigColor ?? (accent ? 'var(--atelier-ink)' : 'var(--atelier-ink-dim)'),
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>{big}</div>
      <div style={{
        fontFamily: F.label, fontWeight: 300, fontSize: 8,
        letterSpacing: '0.34em', textTransform: 'uppercase',
        color: T.isLight ? T.inkMute : 'rgba(201,168,76,0.75)', marginTop: 6,
      }}>{label}</div>
      <div style={{
        fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
        fontSize: 10, color: T.inkDim,
        marginTop: 2, letterSpacing: '0.02em',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{sub}</div>
    </div>
  );
}

// ── Calling Card — new enquiry, with corner ornaments ──────────
function EnquiryCard({ context, onInject }: {
  context: VendorContextResponse | null;
  onInject: (text: string) => void;
}) {
  const T = useT();
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded]   = useState(false);
  const newLeads = context?.new_leads ?? [];

  const prevCount = useRef(0);
  useEffect(() => {
    if (newLeads.length > prevCount.current) { setDismissed(false); setExpanded(false); }
    prevCount.current = newLeads.length;
  }, [newLeads.length]);

  if (dismissed || newLeads.length === 0) return null;

  const count   = newLeads.length;
  const accentC = T.isLight ? T.accent : A.brass;
  const borderC = T.isLight ? 'rgba(122,56,40,0.18)' : 'rgba(201,168,76,0.18)';

  return (
    <div style={{ margin: '8px 22px 0', position: 'relative' }}>

      {/* ── Collapsed pill — always visible ── */}
      <button type="button" onClick={() => setExpanded(e => !e)} style={{
        width: '100%', display: 'flex', alignItems: 'center',
        padding: '9px 14px',
        background: T.isLight ? 'rgba(122,56,40,0.05)' : 'rgba(201,168,76,0.06)',
        border: `0.5px solid ${borderC}`,
        borderRadius: expanded ? '6px 6px 0 0' : 6,
        cursor: 'pointer', textAlign: 'left' as const,
        transition: 'border-radius 200ms',
      }}>
        {/* Dot indicator */}
        <span style={{
          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
          background: accentC, marginRight: 10,
          boxShadow: `0 0 6px ${accentC}88`,
        }} />
        <span style={{
          fontFamily: F.label, fontWeight: 300, fontSize: 9,
          letterSpacing: '0.28em', textTransform: 'uppercase' as const,
          color: accentC, flex: 1,
        }}>{count === 1 ? '1 New Enquiry' : `${count} New Enquiries`}</span>
        <span style={{
          fontFamily: F.label, fontSize: 10, color: accentC,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 220ms cubic-bezier(0.22,1,0.36,1)',
          display: 'inline-block',
        }}>▾</span>

        {/* Dismiss × inside pill */}
        <span
          role="button"
          onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
          onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); setDismissed(true); }}
          style={{
            marginLeft: 10, width: 16, height: 16, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.inkDim, fontSize: 11, cursor: 'pointer', flexShrink: 0,
          }}>×</span>
      </button>

      {/* ── Expanded list ── */}
      {expanded && (
        <div style={{
          border: `0.5px solid ${borderC}`,
          borderTop: 'none',
          borderRadius: '0 0 6px 6px',
          overflow: 'hidden',
          animation: 'expandDown 200ms cubic-bezier(0.22,1,0.36,1) both',
        }}>
          <style>{`@keyframes expandDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
          {newLeads.map((l, i) => {
            const det: string[] = [];
            if (l.wedding_date) {
              try { det.push(new Date(l.wedding_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })); }
              catch { det.push(l.wedding_date); }
            }
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                padding: '8px 14px',
                borderTop: i === 0 ? 'none' : `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.08)' : 'rgba(201,168,76,0.08)'}`,
                background: T.isLight ? 'rgba(122,56,40,0.02)' : 'rgba(201,168,76,0.03)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: F.display, fontWeight: 400, fontSize: 16,
                    color: 'var(--atelier-ink)', lineHeight: 1.1,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{l.name ?? 'Unnamed'}</div>
                  {det.length > 0 && (
                    <div style={{
                      fontFamily: F.script, fontStyle: 'italic',
                      fontSize: 10, color: 'var(--atelier-ink-mute)', marginTop: 1,
                    }}>{det.join(' · ')}</div>
                  )}
                </div>
                <button type="button"
                  onClick={() => { onInject(`I'd like to reply to ${l.name ?? 'this enquiry'}. Draft something warm but not pushy.`); setDismissed(true); }}
                  style={{
                    flexShrink: 0, marginLeft: 10, padding: '4px 10px',
                    background: 'none',
                    border: `0.5px solid ${borderC}`,
                    borderRadius: 2, cursor: 'pointer',
                    fontFamily: F.label, fontWeight: 400, fontSize: 8,
                    letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                    color: T.isLight ? T.ink : A.brassWarm,
                  }}>Reply →</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Page root ───────────────────────────────────────────────────
export default function WeddingChatPage() {
  const router = useRouter();
  const [seeded, setSeeded] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const fromStorage = localStorage.getItem('vendor_session') || localStorage.getItem('vendor_web_session');
      if (!fromStorage) {
        const cookieMatch = document.cookie.split('; ').find(r => r.startsWith('tdw_vendor_session='));
        if (cookieMatch) {
          const cookieVal = decodeURIComponent(cookieMatch.split('=').slice(1).join('='));
          const parsed = JSON.parse(cookieVal);
          if (parsed?.access_token) {
            setVendorSession(parsed);
            // demo flag removed — vendor demo system deleted
          }
        }
      }
    } catch (_e) { /* ignore */ }
    setSeeded(true);
  }, []);

  const { session, loading: sessionLoading } = useVendorSession();

  useEffect(() => {
    if (seeded === null) return;
    if (!sessionLoading && !session) { router.replace('/'); return; }
    if (!sessionLoading && session) {
      // Verify JWT against backend — catches expired tokens and wrong accounts.
      // If the stored session points to the wrong vendor (e.g. stale mock),
      // the /me response will have a different vendor ID — force re-login.
      getJson<{ ok: boolean; vendor?: Record<string, unknown> }>('/api/v2/vendor/me', true)
        .then(data => {
          if (!data.ok) {
            // 401 / bad token — clear and redirect
            import('@/lib/vendor/session').then(({ clearVendorSession }) => {
              clearVendorSession();
              router.replace('/');
            });
            return;
          }
          if (data.vendor) {
            const remoteId  = data.vendor.id as string;
            const sessionId = session.id;
            if (remoteId && sessionId && remoteId !== sessionId) {
              // Session ID doesn't match what backend says — stale/wrong account
              console.warn('[vendor/page] session ID mismatch — clearing');
              import('@/lib/vendor/session').then(({ clearVendorSession }) => {
                clearVendorSession();
                router.replace('/');
              });
              return;
            }
            // Check onboarding state
            const state = data.vendor.onboarding_state as string | null;
            if (state && state !== 'complete') {
              router.replace('/vendor/onboarding');
            }
          }
        })
        .catch(() => { /* non-fatal — network error, stay on chat */ });
    }
  }, [seeded, sessionLoading, session, router]);

  if (seeded === null) return <div style={{ flex: 1 }} aria-busy="true" />;
  if (sessionLoading) return <div style={{ flex: 1 }} aria-busy="true" />;
  if (!session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <Suspense fallback={<div style={{ flex: 1 }} aria-busy="true" />}>
      <ChatScreen vendorId={session.id} vendorName={session.name} />
    </Suspense>
  );
}

function ChatScreen({ vendorId, vendorName }: { vendorId: string; vendorName: string | null }) {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();
  const T            = useT();

  const autoSendPrimer = searchParams?.get('primer') ?? '';
  const autoSend       = searchParams?.get('autoSend') === '1';
  const aiPrimer       = searchParams?.get('aiPrimer') ?? '';
  const draft          = searchParams?.get('draft') ?? '';

  const { messages, loading, context, send, injectAiMessage, meta, freshThread, markFreshThread } = useChat({ vendorId }); // TDW_02 P5: +meta · TDW_06 D-7: +freshThread
  // TDW_04 A3 (ST-4/L-4): the hub's money leaves the typed plane. The cabinet
  // is already on this screen (the YOUR BOOKS drawer reads it through the same
  // cached hook — no new network call), and deriveMoney is the same function
  // the Invoices page runs. That is the repoint: not new numbers, the SAME ones.
  const cab = useCabinetData(vendorId);
  const money = useMemo(() => deriveMoney(cab.data), [cab.data]);
  const [justDoIt, setJustDoIt] = useState(false);
  const { toast: noteToast, show: showNote } = useToast();
  async function sendNote(text: string) {
    const r = await createNote(text);
    if (r.ok) showNote('Noted', 'success');
    else showNote((r as { error?: string }).error ?? 'Could not save note', 'error');
  }

  const autoSentRef = useRef(false);
  const sendRef     = useRef(send);     sendRef.current = send;
  const injectRef   = useRef(injectAiMessage); injectRef.current = injectAiMessage;

  useEffect(() => {
    if (autoSend && autoSendPrimer && !autoSentRef.current) {
      autoSentRef.current = true;
      sendRef.current(autoSendPrimer);
      const t = setTimeout(() => { router.replace(pathname ?? '/vendor'); }, 300);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSend, autoSendPrimer]);

  const aiInjectedRef = useRef(false);
  useEffect(() => {
    if (aiPrimer && !aiInjectedRef.current) {
      aiInjectedRef.current = true;
      const t = setTimeout(() => { injectRef.current(aiPrimer); router.replace(pathname ?? '/vendor'); }, 80);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiPrimer]);

  // Hub top stack (greeting + ledger + enquiry) is ALWAYS visible.
  // The vendor's house — they should see it every time they arrive.
  // Use the vendor's business name from context when available; fall back to session name.
  const displayName = context?.vendor?.name ?? vendorName ?? null;

  // Scroll ref for ChatThread (the scroll surface).
  const chatScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
      <Cabinet vendorId={vendorId} />

      {/* ── Header ── */}
      <Header vendorName={displayName} />

      {/* ── Victor mode (Business·Advisor) — TDW_06 P6d (R-2); placement rides the founder's veto ── */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 2px' }}>
        <VictorModeChip onThreadReset={markFreshThread} />
      </div>

      {/* ── CommandBar — sticky accountability bar ── */}
      <CommandBar
        context={context}
        vendorId={vendorId}
        justDoIt={justDoIt}
        onJustDoItChange={setJustDoIt}
      />

      {/* ── Hub top stack ── */}
      <GreetingLine context={context} money={money} />
      <Ledger context={context} money={money} />

      {/* ── Fresh thread (TDW_06 D-7) — one button; the divider in the thread
             below is its confirmation, the scrollback visibly persisting. ── */}
      <FreshThreadControl onConfirm={freshThread} disabled={loading} />

      {/* ── Conversation thread ── */}
      <ChatThread
        messages={messages}
        loading={loading}
        onConfirm={() => {}}
        onCancel={() => {}}
        onChipTap={send}
        scrollRef={chatScrollRef}
        onRetryLast={() => { const last = [...messages].reverse().find((m) => m.role === 'user'); if (last?.text) send(last.text); }}
      />

      {/* ── Input bar ── */}
      <Toast toast={noteToast} />
      <TierMeter meta={meta} />
      <InputBar onSend={send} onSendNote={sendNote} disabled={loading || (meta && meta.state === 'capped')}
        initialValue={draft || undefined}
        onPrimerApplied={() => router.replace(pathname ?? '/vendor')} />

      <OnboardingOverlay onSend={send} />
    </div>
  );
}
