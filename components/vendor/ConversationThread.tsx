'use client';
// components/ConversationThread.tsx
// Read-only couple conversation thread for lead detail view.
// CE-43 LC-2 packet 3c: inbound messages are signed with the lead's name (fallback "Lead").
// No reply input — vendor continues on WhatsApp.

import { useState } from 'react';
import type { ConversationMessage } from '@/lib/vendor/types/vendor';
import { packageDate, istDateOf } from '@/lib/worklist/packages';

const D = { card: 'var(--atelier-sheet-bg)', border: 'var(--atelier-sheet-border)', muted: 'var(--atelier-ink-mute)', cream: 'var(--atelier-ink)', gold: 'var(--role-metal)' };
const F = { label: 'var(--font-jost), system-ui, sans-serif', body: 'var(--font-dm-sans), system-ui, sans-serif' };

function fmtTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch { return ''; }
}

interface Props {
  messages: ConversationMessage[];
  vendorSummary?: string | null;
  /** CE-43 LC-2 packet 3c · point 7 (chair-ruled): the inbound sender reads the lead's own
   *  name, falling back to "Lead". "Bride" is not a word for every couple's messages. */
  leadName?: string | null;
}

// CE-43 LC-2 packet 3d · F-43.93 point 6 (chair-ruled, two bytes vetoed under "go with your lean"):
// the thread opens on its last three messages; one control shows all, one shows fewer.
export const THREAD = {
  showAll: 'Show all messages',
  showFewer: 'Show fewer',
} as const;
export const COLLAPSED_COUNT = 3;

/** The messages to render: the last three while collapsed, every one once expanded. */
export function visibleMessages<T>(messages: T[], expanded: boolean): T[] {
  return expanded || messages.length <= COLLAPSED_COUNT ? messages : messages.slice(-COLLAPSED_COUNT);
}

// CE-43 LC-2 packet 3d · F-43.96 (chair-ruled): the stamp is the IST day in full month
// (R-42.13) and the clock time, never a bare time. Existing renderers only: istDateOf and
// packageDate (lib/worklist/packages.ts), and this file's fmtTime.
export function stampOf(iso: string): string {
  const day = packageDate(istDateOf(iso));
  const time = fmtTime(iso);
  return day ? `${day} · ${time}` : time;
}

/** The inbound sender's label: the lead's name, else "Lead" (the one vetoed byte, CE-43). */
export function inboundSender(leadName?: string | null): string {
  const n = (leadName ?? '').trim();
  return n || 'Lead';
}

// R-37.70 as amended at R-38.17 — the outbound speaker is 「TDW」, never a persona name.
// This component is reachable from all six crossed rooms (SliceShell imports it) and is
// ALSO mounted by app/admin/conversations/{vendors,brides}, so the founder sees the same
// word in the console that the vendor sees in a room. That is the correct direction: the
// product refers to itself as TDW everywhere (R-37.72), and a console that used the old
// name would be teaching the next reader a byte the estate has banned.
export function ConversationThread({ messages, vendorSummary, leadName }: Props) {
  const [expanded, setExpanded] = useState(false);
  const shown = visibleMessages(messages, expanded);
  const toggle = messages.length > COLLAPSED_COUNT ? (
    <button type="button" data-lc2="thread-toggle" onClick={() => setExpanded((e) => !e)} style={{
      alignSelf: 'flex-start', background: 'none', border: 'none', padding: '8px 0', minHeight: 36, cursor: 'pointer',
      fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase',
      color: 'var(--atelier-accent-text)',
    }}>{expanded ? THREAD.showFewer : THREAD.showAll}</button>
  ) : null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Summary card */}
      {vendorSummary && (
        <div style={{
          backgroundColor: 'rgba(201,168,76,0.08)',
          border: '0.5px solid rgba(201,168,76,0.25)',
          borderRadius: 10, padding: '10px 14px',
        }}>
          <p style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, color: D.gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 5 }}>Summary</p>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: D.cream, lineHeight: 1.5 }}>{vendorSummary}</p>
        </div>
      )}

      {/* Thread */}
      {messages.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <p style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, color: D.muted, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>Conversation</p>
          {!expanded && toggle}
          {shown.map((msg, idx) => {
            const isIn = msg.direction === 'inbound';
            return (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isIn ? 'flex-start' : 'flex-end',
                marginBottom: 6,
              }}>
                <div style={{
                  maxWidth: '82%',
                  backgroundColor: isIn ? 'var(--atelier-input-bg)' : 'rgba(201,168,76,0.12)',
                  border: `0.5px solid ${isIn ? 'var(--atelier-sheet-border)' : 'var(--atelier-card-border)'}`,
                  borderRadius: isIn ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                  padding: '8px 12px',
                }}>
                  <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: D.cream, lineHeight: 1.5, margin: 0 }}>{msg.body}</p>
                </div>
                {/* F-43.96: the stamp at the thread's own label size (the `Conversation` label above). */}
                <span data-lc2="thread-stamp" style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, lineHeight: 1.6, color: D.muted, letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 4, paddingLeft: isIn ? 2 : 0, paddingRight: isIn ? 0 : 2 }}>
                  {isIn ? inboundSender(leadName) : 'TDW'} · {stampOf(msg.created_at)}
                </span>
              </div>
            );
          })}
          {expanded && toggle}
        </div>
      )}

      {!vendorSummary && messages.length === 0 && (
        <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted, fontStyle: 'italic', textAlign: 'center', padding: '8px 0' }}>
          No conversation yet.
        </p>
      )}
    </div>
  );
}
