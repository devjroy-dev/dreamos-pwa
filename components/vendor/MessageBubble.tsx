'use client';
import { useState } from 'react';
import type { ChatMessage } from '@/hooks/vendor/useChat';
import { useT } from '@/lib/vendor/ThemeContext';

const A = { brass: '#C9A84C', brassWarm: '#E0BC6E' } as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

function toE164(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return '91' + digits;
  return digits;
}


// Detects if an AI message contains a draft reply — shows copy button if so
function isDraft(text: string): boolean {
  const lower = text.toLowerCase();
  // Contains common draft indicators
  if ((lower.includes('dear ') || lower.includes('hi ') || lower.includes('hello ')) && text.length > 120) return true;
  if (lower.includes('here\'s a draft') || lower.includes('here is a draft') || lower.includes('draft reply') || lower.includes('draft:')) return true;
  if (lower.includes('subject:') || lower.includes('warm regards') || lower.includes('best regards')) return true;
  return false;
}

// Extract just the draft text — remove the AI preamble before the draft
function extractDraft(text: string): string {
  // Common preamble patterns
  const patterns = [
    /here['\'s is]+ (?:a |the )?draft[:\n]+/i,
    /draft[:\n]+/i,
    /reply[:\n]+/i,
  ];
  for (const p of patterns) {
    const match = text.match(p);
    if (match && match.index !== undefined) {
      return text.slice(match.index + match[0].length).trim();
    }
  }
  return text;
}

function AiMessageText({ text, T, F }: { text: string; T: ReturnType<typeof import('@/lib/ThemeContext').useT>; F: Record<string, string> }) {
  const [copied, setCopied] = useState(false);
  const hasDraft = isDraft(text);
  const draftText = hasDraft ? extractDraft(text) : '';

  function copy() {
    try {
      navigator.clipboard.writeText(draftText || text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <>
      <p style={{
        fontFamily: F.script, fontStyle: 'italic', fontWeight: 400,
        fontSize: 18, color: T.ink, lineHeight: 1.42,
        letterSpacing: '0.005em', margin: 0, whiteSpace: 'pre-wrap',
      }}>{text}</p>
      {hasDraft && (
        <button
          type="button"
          onClick={copy}
          style={{
            marginTop: 10,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px',
            background: copied
              ? T.isLight ? 'rgba(122,56,40,0.10)' : 'rgba(201,168,76,0.12)'
              : 'transparent',
            border: `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.28)' : 'rgba(201,168,76,0.30)'}`,
            borderRadius: 4, cursor: 'pointer',
            fontFamily: 'var(--font-jost), system-ui, sans-serif',
            fontWeight: 300, fontSize: 9,
            letterSpacing: '0.22em', textTransform: 'uppercase' as const,
            color: copied
              ? T.isLight ? T.accent : '#C9A84C'
              : T.isLight ? T.inkMute : 'rgba(240,230,210,0.50)',
            transition: 'all 200ms',
          }}
        >
          <span style={{ fontSize: 10 }}>{copied ? '✓' : '⎘'}</span>
          {copied ? 'Copied' : 'Copy draft'}
        </button>
      )}
    </>
  );
}


interface MessageBubbleProps { message: ChatMessage; }

export function MessageBubble({ message }: MessageBubbleProps) {
  const T = useT();
  const isUser  = message.role === 'user';
  const contact = message.contact;

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 22px' }}>
        <div style={{
          maxWidth: '80%', padding: '10px 14px',
          borderRadius: '14px 14px 4px 14px',
          background: T.isLight
            ? 'rgba(122,56,40,0.08)'
            : 'linear-gradient(180deg, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.12) 100%)',
          border: `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.25)' : 'rgba(201,168,76,0.32)'}`,
          boxShadow: T.isLight ? 'none' : 'inset 0 1px 0 rgba(255,235,200,0.08)',
        }}>
          <p style={{
            fontFamily: F.body, fontWeight: 300, fontSize: 14,
            color: T.ink, lineHeight: 1.45, margin: 0,
            whiteSpace: 'pre-wrap', letterSpacing: '0.005em',
          }}>{message.text}</p>
        </div>
      </div>
    );
  }

  const hairline = T.isLight
    ? 'linear-gradient(180deg, transparent 0%, rgba(122,56,40,0.4) 25%, rgba(122,56,40,0.65) 50%, rgba(122,56,40,0.4) 75%, transparent 100%)'
    : 'linear-gradient(180deg, transparent 0%, rgba(201,168,76,0.5) 25%, rgba(201,168,76,0.75) 50%, rgba(201,168,76,0.5) 75%, transparent 100%)';

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '8px 22px' }}>
      <div style={{ maxWidth: '92%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ padding: '8px 18px 4px 16px', position: 'relative' }}>
          <span aria-hidden style={{
            position: 'absolute', left: 4, top: 12, bottom: 12,
            width: 1, background: hairline,
          }} />
          <div style={{
            fontFamily: F.label, fontWeight: 300, fontSize: 7,
            letterSpacing: '0.5em', textTransform: 'uppercase',
            color: T.isLight ? T.accent : 'rgba(201,168,76,0.65)', marginBottom: 6,
          }}>DreamAi</div>
          <AiMessageText text={message.text} T={T} F={F} />
        </div>
        {contact?.phone && (
          <div style={{ display: 'flex', gap: 8, paddingLeft: 16 }}>
            <a href={`https://wa.me/${toE164(contact.phone)}${contact.draft ? `?text=${encodeURIComponent(contact.draft)}` : ''}`}
              target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px',
                background: 'rgba(37,211,102,0.10)', border: '0.5px solid rgba(37,211,102,0.4)',
                borderRadius: 2, textDecoration: 'none',
                fontFamily: F.label, fontWeight: 300, fontSize: 9,
                letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5BD68A',
              }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#5BD68A"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.849L0 24l6.318-1.658A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.371l-.359-.213-3.72.976.994-3.634-.234-.374A9.818 9.818 0 1112 21.818z"/></svg>
              WhatsApp {contact.name.split(' ')[0]}
            </a>
            <a href={`tel:${contact.phone}`} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px',
              background: T.inputBg, border: `0.5px solid ${T.inputBorder}`,
              borderRadius: 2, textDecoration: 'none',
              fontFamily: F.label, fontWeight: 300, fontSize: 9,
              letterSpacing: '0.22em', textTransform: 'uppercase', color: T.inkMute,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.67a16 16 0 006.29 6.29l1.03-1.34a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              Call
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
