'use client';
export const dynamic = 'force-dynamic';

// app/demo/bride/dream/page.tsx
// Demo Dream Ai — real Claude streaming via /api/v2/demo/bride/chat, no auth.

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

const BACKEND = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';
const EASE = 'cubic-bezier(0.22,1,0.36,1)';
const FF = { italianno:"'Italianno',cursive", fraunces:"'Fraunces','Cormorant Garamond',serif", mono:"'JetBrains Mono',monospace", body:"'DM Sans',sans-serif" };
const T = { bg:'#1E0A0E', ink:'#F5E5DC', inkSoft:'rgba(245,229,220,0.72)', inkMute:'rgba(245,229,220,0.42)', accent:'#C4856A', accentSoft:'rgba(196,133,106,0.12)', line:'rgba(196,133,106,0.14)', userBubble:'rgba(196,133,106,0.15)', aiBubble:'rgba(30,10,14,0.7)' };

interface Msg { id:string; role:'user'|'assistant'; content:string; pending?:boolean; }
function uid() { return Math.random().toString(36).slice(2); }

const PROMPTS = [
  'How many days until my wedding?',
  "What's my biggest outstanding payment?",
  'What\'s happening this week?',
  'Who\'s in my Circle?',
  'I think I\'m in over my head. Guest list is at 600.',
];

export default function DemoBrideDream() {
  const router = useRouter();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<{role:'user'|'assistant';content:string}[]>([]);
  const abortRef = useRef<AbortController|null>(null);

  const scrollDown = () => setTimeout(() => scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 60);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setInput('');
    const userMsg: Msg = { id: uid(), role: 'user', content: trimmed };
    setMsgs(prev => [...prev, userMsg]);
    setLoading(true);
    const aiId = uid();
    setMsgs(prev => [...prev, { id: aiId, role: 'assistant', content: '', pending: true }]);
    scrollDown();

    try {
      const res = await fetch(`${BACKEND}/api/v2/demo/bride/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ message: trimmed, history: historyRef.current }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error('Stream failed');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') break;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === 'text_delta') {
              accumulated += evt.text;
              setMsgs(prev => prev.map(m => m.id === aiId ? { ...m, content: accumulated, pending: false } : m));
              scrollDown();
            }
          } catch {}
        }
      }

      historyRef.current = [...historyRef.current, { role: 'user' as const, content: trimmed }, { role: 'assistant' as const, content: accumulated }].slice(-10);
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setMsgs(prev => prev.map(m => m.id === aiId ? { ...m, content: 'Something went wrong. Try again.', pending: false } : m));
      }
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <div style={{ position:'fixed', inset:0, background:T.bg, display:'flex', flexDirection:'column' }}>
      <style>{`
        @keyframes dpulse{0%,80%,100%{opacity:.35}40%{opacity:1}}
        @keyframes dcursor{0%,100%{opacity:1}50%{opacity:0}}
        .d-cursor{animation:dcursor 1s ease-in-out infinite;}
        .dream-scroll::-webkit-scrollbar{display:none;}
        .dream-scroll{-ms-overflow-style:none;scrollbar-width:none;}
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        textarea{resize:none;outline:none;}
      `}</style>

      {/* Header */}
      <div style={{ flexShrink:0, display:'flex', alignItems:'center', gap:12, padding:'calc(env(safe-area-inset-top,0px) + 14px) 20px 14px', background:'rgba(30,10,14,0.88)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderBottom:`0.5px solid ${T.line}` }}>
        <button onClick={() => router.push('/demo/bride/sanctuary')} style={{ background:'none', border:'none', color:T.inkMute, cursor:'pointer', padding:0, fontSize:18, lineHeight:1 }}>←</button>
        <div>
          <div style={{ fontFamily:FF.fraunces, fontStyle:'italic', fontWeight:300, fontSize:20, color:T.ink }}>Dream Ai</div>
          <div style={{ fontFamily:FF.mono, fontSize:7, letterSpacing:'0.2em', textTransform:'uppercase', color:T.accent, marginTop:2 }}>Your wedding, your way</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="dream-scroll" style={{ flex:1, overflowY:'auto', padding:'20px 20px 8px' }}>
        {msgs.length === 0 && (
          <div style={{ paddingTop:24 }}>
            <div style={{ fontFamily:FF.italianno, fontSize:36, color:T.ink, textAlign:'center', marginBottom:8 }}>Hello, Ananya.</div>
            <div style={{ fontFamily:FF.fraunces, fontStyle:'italic', fontSize:15, color:T.inkMute, textAlign:'center', marginBottom:32 }}>14 December is {(() => { const d=new Date('2026-12-14'); const t=new Date(); t.setHours(0,0,0,0); return Math.max(0,Math.round((d.getTime()-t.getTime())/86400000)); })()} days away.</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {PROMPTS.map((p,i) => (
                <button key={i} onClick={() => send(p)} style={{ background:T.accentSoft, border:`0.5px solid ${T.line}`, borderRadius:12, padding:'10px 14px', fontFamily:FF.body, fontWeight:300, fontSize:13, color:T.inkSoft, cursor:'pointer', textAlign:'left' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map(m => (
          <div key={m.id} style={{ marginBottom:14, display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth:'82%', padding:'10px 14px', borderRadius: m.role==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.role==='user' ? T.userBubble : T.aiBubble, border:`0.5px solid ${m.role==='user' ? 'rgba(196,133,106,0.3)' : T.line}`, backdropFilter: m.role==='assistant' ? 'blur(8px)' : 'none', WebkitBackdropFilter: m.role==='assistant' ? 'blur(8px)' : 'none' }}>
              {m.pending ? (
                <span style={{ display:'inline-flex', gap:3, padding:'2px 0' }}>
                  {[0,1,2].map(i=><span key={i} style={{ width:4, height:4, borderRadius:'50%', background:T.accent, animation:`dpulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
                </span>
              ) : (
                <div style={{ fontFamily:FF.body, fontWeight:300, fontSize:14, color:T.ink, lineHeight:1.65, whiteSpace:'pre-wrap' }}>
                  {m.content}
                  {loading && m.role==='assistant' && m.id === msgs[msgs.length-1]?.id && <span className="d-cursor" style={{ display:'inline-block', width:2, height:14, background:T.accent, marginLeft:2, verticalAlign:'middle' }} />}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ flexShrink:0, padding:`10px 16px calc(env(safe-area-inset-bottom,0px) + 16px)`, background:'rgba(30,10,14,0.92)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderTop:`0.5px solid ${T.line}` }}>
        <div style={{ display:'flex', gap:10, alignItems:'flex-end', background:'rgba(245,229,220,0.05)', border:`0.5px solid ${T.line}`, borderRadius:20, padding:'10px 14px' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(input); } }}
            placeholder="Ask anything about your wedding…"
            rows={1}
            style={{ flex:1, background:'transparent', border:'none', fontFamily:FF.body, fontWeight:300, fontSize:14, color:T.ink, lineHeight:1.5, maxHeight:100, overflowY:'auto' }}
          />
          <button onClick={() => send(input)} disabled={!input.trim()||loading} style={{ flexShrink:0, width:32, height:32, borderRadius:'50%', background: input.trim()&&!loading ? T.accent : 'rgba(196,133,106,0.2)', border:'none', cursor: input.trim()&&!loading ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center', transition:`background 200ms ${EASE}` }}>
            <Send size={14} color={ input.trim()&&!loading ? '#1E0A0E' : 'rgba(196,133,106,0.4)'} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
