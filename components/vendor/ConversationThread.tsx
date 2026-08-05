'use client';
// components/ConversationThread.tsx
// Read-only couple conversation thread for lead detail view.
// No reply input — vendor continues on WhatsApp.

import type { ConversationMessage } from '@/lib/vendor/types/vendor';

const D = { card: '#1C1C1C', border: 'rgba(226,222,216,0.1)', muted: 'var(--atelier-ink-mute)', cream: 'var(--atelier-ink)', gold: 'var(--role-metal)' };
const F = { label: 'var(--font-jost), system-ui, sans-serif', body: 'var(--font-dm-sans), system-ui, sans-serif' };

function fmtTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch { return ''; }
}

interface Props {
  messages: ConversationMessage[];
  vendorSummary?: string | null;
}

export function ConversationThread({ messages, vendorSummary }: Props) {
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
          {messages.map((msg, idx) => {
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
                  border: `0.5px solid ${isIn ? 'rgba(226,222,216,0.1)' : 'rgba(201,168,76,0.2)'}`,
                  borderRadius: isIn ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                  padding: '8px 12px',
                }}>
                  <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: D.cream, lineHeight: 1.5, margin: 0 }}>{msg.body}</p>
                </div>
                <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: D.muted, letterSpacing: '0.1em', marginTop: 2, paddingLeft: isIn ? 2 : 0, paddingRight: isIn ? 0 : 2 }}>
                  {isIn ? 'Bride' : 'DreamAi'} · {fmtTime(msg.created_at)}
                </span>
              </div>
            );
          })}
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
