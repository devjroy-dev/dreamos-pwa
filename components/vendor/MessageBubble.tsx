'use client';
import { useState, type ReactNode } from 'react';
import type { ChatMessage } from '@/hooks/vendor/useChat';
import { useT } from '@/lib/vendor/ThemeContext';
import { TypingDots } from './TypingDots';

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


// (Draft-guessing removed — a plain Copy now lives on every AI message.)

// ── Myra's prose renderer ────────────────────────────────────────────────
// Ported from dreamai's desk renderer (paragraphs + **bold**), adapted for Myra:
// adds list rendering and auto-emphasis of Rs amounts in the theme accent.
// No dependency — a small hand-rolled inline parser, exactly how dreamai did it.
type Tok = ReturnType<typeof import('@/lib/vendor/ThemeContext').useT>;

// Inline: **bold**, *italic* / _italic_, `code`, and Rs amounts in the accent.
function emphasizeRs(seg: string, T: Tok, salt: string): ReactNode[] {
  // matches: Rs 1,00,000  /  Rs 75000  /  Rs 2.55 lakh  /  Rs 1.2 cr
  const parts = seg.split(/(Rs\.?\s?[\d,]+(?:\.\d+)?(?:\s?(?:lakh|cr|crore|k))?)/gi);
  return parts.map((p, i) => {
    if (/^Rs\.?\s?[\d,]/i.test(p)) {
      return <span key={`${salt}r${i}`} style={{ color: T.accent, fontStyle: 'italic', fontWeight: 500 }}>{p}</span>;
    }
    return <span key={`${salt}n${i}`}>{p}</span>;
  });
}
// Italic emphasis — founder-ruled WHOLE REGISTER (TDW_06 economics sitting open,
// verbatim: "it should be italics. thats victors voice reserved"): *word* / _word_
// stays in the italic register; WEIGHT alone (500) is the emphasis. The earlier
// upright-inversion rationale is retired with the ruling — same warrant as the
// **bold** branch below (ZIP 8), extended by his word to em, the Rs accent, and
// headings. `code` deliberately stays upright — not on his list, machine text.
function italicNodes(text: string, T: Tok, salt: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*(?!\s)([^*\n]+?)\*|_(?!\s)([^_\n]+?)_/g;
  let last = 0; let m: RegExpExecArray | null; let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(<span key={`${salt}t${k++}`}>{emphasizeRs(text.slice(last, m.index), T, `${salt}${k}`)}</span>);
    const inner = m[1] !== undefined ? m[1] : (m[2] as string);
    out.push(<em key={`${salt}i${k++}`} style={{ fontStyle: 'italic', fontWeight: 500 }}>{emphasizeRs(inner, T, `${salt}${k}`)}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(<span key={`${salt}t${k++}`}>{emphasizeRs(text.slice(last), T, `${salt}${k}`)}</span>);
  return out;
}
// Inline: split on **bold** and `code` first (strong delimiters), italics handled within
// the runs between them — so * inside ** is never mis-paired.
function inlineNodes(text: string, T: Tok, salt: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|`([^`]+?)`/g;
  let last = 0; let m: RegExpExecArray | null; let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(<span key={`${salt}t${k++}`}>{italicNodes(text.slice(last, m.index), T, `${salt}${k}`)}</span>);
    if (m[1] !== undefined) {
      // Founder-ruled (2026-07-18, the riders smoke): **bold** keeps the bubble's
      // italic register — WEIGHT alone is the emphasis. The dreamai-ported
      // inversion (upright bold) read as a second voice breaking Victor's serif
      // on the live screens. His word arrived at the economics sitting's open:
      // the WHOLE register is italic — em, Rs accent, and headings joined (this ZIP).
      out.push(<strong key={`${salt}b${k++}`} style={{ fontStyle: 'italic', fontWeight: 600 }}>{italicNodes(m[1], T, `${salt}${k}`)}</strong>);
    } else {
      out.push(<code key={`${salt}c${k++}`} style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontStyle: 'normal', fontSize: '0.86em', background: T.isLight ? 'rgba(26,15,8,0.06)' : 'rgba(233,228,217,0.08)', padding: '1px 5px', borderRadius: 3 }}>{m[2]}</code>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(<span key={`${salt}t${k++}`}>{italicNodes(text.slice(last), T, `${salt}${k}`)}</span>);
  return out;
}
// Block: blank-line-separated. A run of -/*/+/• lines is a bulleted list; a run of
// "1." / "1)" lines is numbered; a #/##/### line is a heading; else a paragraph.
const BULLET = /^\s*[-*+•]\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;
const HEADING = /^\s*#{1,3}\s+/;
function renderProse(text: string, T: Tok, F: Record<string, string>): ReactNode[] {
  const pStyle = {
    fontFamily: F.script, fontStyle: 'italic' as const, fontWeight: 400,
    fontSize: 18, color: T.ink, lineHeight: 1.42, letterSpacing: '0.005em',
    margin: 0, whiteSpace: 'pre-wrap' as const,
  };
  const blocks = (text || '').split(/\n\n+/);
  const out: ReactNode[] = [];
  blocks.forEach((block, bi) => {
    const lines = block.split('\n');
    const nonEmpty = lines.filter((l) => l.trim() !== '');
    const isBullet = nonEmpty.length > 0 && nonEmpty.every((l) => BULLET.test(l));
    const isNumbered = nonEmpty.length > 0 && nonEmpty.every((l) => NUMBERED.test(l));
    const isHeading = nonEmpty.length === 1 && HEADING.test(nonEmpty[0]);
    if (isBullet) {
      const items = nonEmpty.map((l) => l.replace(BULLET, ''));
      out.push(
        <ul key={`ul${bi}`} style={{ ...pStyle, margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((it, ii) => (
            <li key={`li${bi}-${ii}`} style={{ listStyleType: 'disc' }}>{inlineNodes(it, T, `${bi}-${ii}-`)}</li>
          ))}
        </ul>
      );
    } else if (isNumbered) {
      const items = nonEmpty.map((l) => l.replace(NUMBERED, ''));
      out.push(
        <ol key={`ol${bi}`} style={{ ...pStyle, margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((it, ii) => (
            <li key={`oli${bi}-${ii}`} style={{ listStyleType: 'decimal' }}>{inlineNodes(it, T, `${bi}-${ii}-`)}</li>
          ))}
        </ol>
      );
    } else if (isHeading) {
      const level = (nonEmpty[0].match(/^#{1,3}/) || ['#'])[0].length;
      out.push(
        <p key={`h${bi}`} style={{ ...pStyle, fontStyle: 'italic', fontWeight: 600, fontSize: level === 1 ? 21 : level === 2 ? 19 : 18 }}>
          {inlineNodes(nonEmpty[0].replace(HEADING, ''), T, `${bi}-h-`)}
        </p>
      );
    } else {
      out.push(<p key={`p${bi}`} style={pStyle}>{inlineNodes(block, T, `${bi}-`)}</p>);
    }
  });
  return out;
}

function AiMessageText({ text, streaming, T, F }: { text: string; streaming?: boolean; T: ReturnType<typeof import('@/lib/vendor/ThemeContext').useT>; F: Record<string, string> }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  // Before the first word lands, the blob breathes in place of the empty line
  // (the working mark); it gives way to the reply as soon as text arrives.
  if (streaming && !text) return <TypingDots />;

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {renderProse(text, T, F)}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy message"}
        title={copied ? "Copied" : "Copy"}
        style={{
          marginTop: 8,
          width: 24, height: 24, padding: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "transparent", border: "none", cursor: "pointer",
          color: copied
            ? (T.isLight ? T.accent : "#C9A84C")
            : (T.isLight ? T.inkMute : "rgba(240,230,210,0.45)"),
          transition: "color 200ms",
        }}
      >
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
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
          <AiMessageText text={message.text} streaming={message.streaming} T={T} F={F} />
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
