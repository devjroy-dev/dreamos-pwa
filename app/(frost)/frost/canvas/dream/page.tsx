'use client';

// app/(frost)/frost/canvas/dream/page.tsx
// Dream Ai — V4 reskin. Same SSE logic, same engine wiring.
// Styled to match Sanctuary V4: Wine Night / Sky Ivory tokens,
// Italianno greeting, Fraunces prose, dark panel aesthetic.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { useFrostMode } from '../../../layout';
import { FROST_COPY, EASE } from '../../../../../lib/frost/tokens';
import { streamBrideChat } from '../../../../../lib/frost-api/couple';

interface UIMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
  error?: boolean;
}

function uid() { return Math.random().toString(36).slice(2); }

const PROMPTS = [
  'How many days until my wedding?',
  'What\'s on my calendar this week?',
  'Who\'s in my Circle?',
  'What have I saved to Muse?',
  'How much have I spent so far?',
];

const CSS = `
@keyframes dreamPulse{0%,80%,100%{opacity:.35}40%{opacity:1}}
@keyframes dreamCursor{0%,100%{opacity:1}50%{opacity:0}}
.dream-cursor{animation:dreamCursor 1s ease-in-out infinite;}
.dream-scroll::-webkit-scrollbar{display:none;}
.dream-scroll{-ms-overflow-style:none;scrollbar-width:none;}
`;

export default function CanvasDream() {
  const router = useRouter();
  const { homeMode } = useFrostMode();
  const dark = homeMode === 'E1A';

  const [messages, setMessages] = useState<UIMsg[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLTextAreaElement>(null);
  const cancelRef  = useRef<(() => void) | null>(null);

  // Inject CSS once
  useEffect(() => {
    if (!document.getElementById('dream-v4-css')) {
      const s = document.createElement('style');
      s.id = 'dream-v4-css'; s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.style.height = 'auto';
    textRef.current.style.height = Math.min(textRef.current.scrollHeight, 120) + 'px';
  }, [input]);

  // Cancel stream on unmount
  useEffect(() => () => { cancelRef.current?.(); }, []);

  const send = useCallback(async (text: string) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { id: uid(), role: 'user', content: msg }]);
    setLoading(true);
    const aiId = uid();
    setMessages(prev => [...prev, { id: aiId, role: 'assistant', content: '', pending: true }]);

    const cancel = streamBrideChat(
      msg,
      (delta) => {
        setMessages(prev => prev.map(m =>
          m.id === aiId ? { ...m, content: m.content + delta, pending: false } : m
        ));
      },
      () => {
        setMessages(prev => prev.map(m =>
          m.id === aiId ? { ...m, pending: false } : m
        ));
        setLoading(false);
        cancelRef.current = null;
      },
      (err) => {
        console.error('[dream canvas] stream error:', err);
        setMessages(prev => prev.map(m =>
          m.id === aiId
            ? { ...m, content: 'Something went wrong. Try again.', error: true, pending: false }
            : m
        ));
        setLoading(false);
        cancelRef.current = null;
      },
    );
    cancelRef.current = cancel;
  }, [loading]);

  // ── Tokens — exact from V4 sanctuary ─────────────────────────────────────
  const bg = dark
    ? `radial-gradient(ellipse 110% 60% at 50% -8%,rgba(196,133,106,.14) 0%,transparent 58%),linear-gradient(180deg,#14080C 0%,#0C0405 100%)`
    : `radial-gradient(ellipse 110% 60% at 50% -8%,rgba(168,196,216,.25) 0%,transparent 58%),linear-gradient(180deg,#F0EEE8 0%,#DDD9D0 100%)`;

  const topBarBg     = dark ? 'rgba(20,8,12,.80)'  : 'rgba(240,238,232,.88)';
  const topBarBorder = dark ? 'rgba(196,133,106,.16)' : 'rgba(42,95,130,.16)';
  const accent       = dark ? '#C4856A' : '#2A5F82';
  const ink          = dark ? '#F5E5DC' : '#0A1628';
  const inkSoft      = dark ? 'rgba(245,229,220,.65)' : 'rgba(10,22,40,.60)';
  const inkMute      = dark ? 'rgba(196,133,106,.42)' : 'rgba(10,22,40,.45)';
  const line         = dark ? 'rgba(196,133,106,.14)' : 'rgba(42,95,130,.14)';

  // User bubble — accent colored, warm
  const userBubbleBg  = accent;
  const userBubbleTxt = dark ? '#1A0810' : '#FFFFFF';

  // AI bubble — glass surface
  const aiBubbleBg  = dark ? 'rgba(196,133,106,.08)' : 'rgba(42,95,130,.06)';
  const aiBubbleBdr = dark ? 'rgba(196,133,106,.18)' : 'rgba(42,95,130,.18)';

  // Compose bar
  const composeBg  = dark ? 'rgba(20,8,12,.85)' : 'rgba(240,238,232,.90)';
  const inputBg    = dark ? 'rgba(196,133,106,.06)' : 'rgba(42,95,130,.05)';
  const inputBdr   = dark ? 'rgba(196,133,106,.22)' : 'rgba(42,95,130,.22)';
  const sendActive = accent;
  const sendInk    = dark ? '#1A0810' : '#FFFFFF';

  // Prompt chip
  const chipBg  = dark ? 'rgba(196,133,106,.06)' : 'rgba(42,95,130,.05)';
  const chipBdr = dark ? 'rgba(196,133,106,.20)' : 'rgba(42,95,130,.20)';

  return (
    <div style={{
      position:'fixed', inset:0, background:bg,
      display:'flex', flexDirection:'column',
      userSelect:'none', WebkitUserSelect:'none' as any,
    }}>

      {/* Grain */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize:'160px', opacity:dark?.4:.2,
      }}/>

      {/* ── Top bar ── */}
      <div style={{
        position:'relative', zIndex:10,
        background:topBarBg,
        backdropFilter:'blur(22px) saturate(1.1)',
        WebkitBackdropFilter:'blur(22px) saturate(1.1)',
        borderBottom:`0.5px solid ${topBarBorder}`,
        paddingTop:'calc(env(safe-area-inset-top,0px) + 12px)',
        paddingBottom:12, paddingLeft:18, paddingRight:18,
        display:'flex', alignItems:'center',
        flexShrink:0,
      }}>
        {/* Back */}
        <button
          onClick={() => router.push('/frost/canvas/sanctuary')}
          style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,padding:0,
            fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sanctuary
        </button>

        {/* Title */}
        <div style={{flex:1,textAlign:'center',
          fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,
          fontSize:19,color:accent,fontFeatureSettings:'"opsz" 9'}}>
          Dream Ai
        </div>

        {/* Clear */}
        <button
          onClick={() => { cancelRef.current?.(); setMessages([]); setLoading(false); }}
          style={{background:'none',border:'none',cursor:'pointer',padding:0,
            fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
            textTransform:'uppercase' as any,color:inkMute}}
        >
          Clear
        </button>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="dream-scroll" style={{
        flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch' as any,
        padding:'20px 18px',
        position:'relative', zIndex:1,
      }}>
        {messages.length === 0 ? (
          // Empty state — "Tell me what's on your mind"
          <div style={{display:'flex',flexDirection:'column',gap:24,paddingTop:8}}>
            <div>
              <div style={{
                fontFamily:"'Italianno',cursive",
                fontSize:52,lineHeight:.95,color:ink,marginBottom:8,
              }}>
                Tell me what's<br/>on your mind.
              </div>
              <div style={{
                fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,
                fontSize:16,color:inkSoft,lineHeight:1.65,
                fontFeatureSettings:'"opsz" 9',
              }}>
                I know your timeline, vendors,<br/>Muse board, and Circle.
              </div>
            </div>

            {/* Prompt chips */}
            <div>
              <div style={{
                fontFamily:"'JetBrains Mono',monospace",fontSize:9,
                letterSpacing:'.22em',textTransform:'uppercase' as any,
                color:inkMute,marginBottom:12,
              }}>
                Try asking
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {PROMPTS.map(p => (
                  <button key={p} onClick={() => send(p)} style={{
                    textAlign:'left',
                    background:chipBg,
                    border:`0.5px solid ${chipBdr}`,
                    borderRadius:8,
                    padding:'12px 14px',
                    fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,
                    fontSize:16,color:ink,cursor:'pointer',
                    fontFeatureSettings:'"opsz" 9',
                    backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',
                  }}>
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Message thread
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {messages.map(m => (
              <div key={m.id} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                {m.role === 'user' ? (
                  // Her message — accent bubble
                  <div style={{
                    maxWidth:'82%',
                    background:userBubbleBg,
                    color:userBubbleTxt,
                    padding:'10px 14px',
                    borderRadius:'20px 20px 4px 20px',
                    fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,
                    fontSize:16,lineHeight:1.55,
                    fontFeatureSettings:'"opsz" 9',
                    userSelect:'text',
                  }}>
                    {m.content}
                  </div>
                ) : m.pending && m.content === '' ? (
                  // Thinking state
                  <div style={{
                    background:aiBubbleBg,
                    border:`0.5px solid ${aiBubbleBdr}`,
                    padding:'10px 16px',
                    borderRadius:'20px 20px 20px 4px',
                    backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',
                  }}>
                    <span style={{
                      fontFamily:"'JetBrains Mono',monospace",fontSize:9,
                      letterSpacing:'.22em',textTransform:'uppercase' as any,
                      color:accent,animation:'dreamPulse 1.4s infinite ease-in-out',
                    }}>
                      ✦ thinking
                    </span>
                  </div>
                ) : (
                  // AI reply — glass bubble
                  <div style={{
                    maxWidth:'90%',
                    background:aiBubbleBg,
                    border:`0.5px solid ${aiBubbleBdr}`,
                    padding:'12px 16px',
                    borderRadius:'20px 20px 20px 4px',
                    backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',
                    fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,
                    fontSize:16,lineHeight:1.65,
                    color:m.error ? '#C4534A' : ink,
                    whiteSpace:'pre-wrap',
                    fontFeatureSettings:'"opsz" 9',
                    userSelect:'text',
                  }}>
                    {m.content}
                    {m.pending && <span className="dream-cursor" style={{opacity:.5,color:accent}}>▌</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Compose bar ── */}
      <div style={{
        position:'relative', zIndex:10,
        background:composeBg,
        backdropFilter:'blur(22px) saturate(1.1)',
        WebkitBackdropFilter:'blur(22px) saturate(1.1)',
        borderTop:`0.5px solid ${line}`,
        padding:`12px 18px calc(12px + env(safe-area-inset-bottom,0px))`,
        flexShrink:0,
      }}>
        <div style={{
          display:'flex', gap:10, alignItems:'flex-end',
          background:inputBg,
          border:`0.5px solid ${inputBdr}`,
          borderRadius:20,
          padding:'8px 10px 8px 16px',
        }}>
          <textarea
            ref={textRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder={FROST_COPY.dreamCanvas.inputPlaceholder}
            disabled={loading}
            rows={1}
            style={{
              flex:1, background:'transparent', border:'none', outline:'none',
              color:ink,
              fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,
              fontSize:16,lineHeight:1.5,
              resize:'none',maxHeight:120,
              fontFeatureSettings:'"opsz" 9',
              userSelect:'text',
              WebkitUserSelect:'text',
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            style={{
              background: input.trim() && !loading ? sendActive : 'rgba(128,128,128,.12)',
              color: input.trim() && !loading ? sendInk : inkMute,
              border:'none', borderRadius:'50%',
              width:34, height:34,
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              transition:`background 200ms ${EASE}`,
              flexShrink:0,
            }}
          >
            <Send size={14} strokeWidth={1.5}/>
          </button>
        </div>
      </div>
    </div>
  );
}
