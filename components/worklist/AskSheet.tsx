"use client";
// components/worklist/AskSheet.tsx — R-37.84 ⑦ Arm A: the risen chat, in branch tokens.
//
// THE COSTUME TELLS THE TRUTH AGAIN. R-37.83 stripped the field shape because tapping it
// teleported to WhatsApp. Now the tap opens the chat, so the shape may promise what it
// delivers: the vendor types where he was invited to type, and DreamAi answers there.
//
// D-2 THROUGHOUT: ChatThread, InputBar, useChat and reportGlitch are all imported at their
// single homes. Nothing here is a copy of anything. The one thing this component adds is the
// ThemeProvider mount — which is not a shim: it is the estate's own provider, and on this
// branch it hands out Graphite and Chalk because ZIP 3 rewrote its token source.
import { useEffect, useRef } from 'react';
import { ThemeProvider } from '@/lib/vendor/ThemeContext';
import { ChatThread } from '@/components/vendor/ChatThread';
import { InputBar } from '@/components/vendor/InputBar';
import { useChat } from '@/hooks/vendor/useChat';
import { reportGlitch } from '@/lib/vendor/api/vendor';

export function AskSheet({ vendorId, mode, onClose }: { vendorId: string; mode: 'dark' | 'light'; onClose: () => void }) {
  const { messages, loading, send } = useChat({ vendorId });
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragFrom = useRef<number | null>(null);

  // Escape closes, and the scrim closes. A sheet with no way out is a trap.
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  return (
    <ThemeProvider pinned={mode}>
      <div className="wl-asksheet" role="dialog" aria-modal="true" aria-label="Ask TDW">
        <button type="button" className="wl-askscrim" aria-label="Close" onClick={onClose} />
        <div className="wl-askpanel">
          {/* R-37.89: the drag-down affordance. A sheet this tall needs a dismissal the thumb
              finds without aiming for a 44px x in the corner. Pointer-drag past 60px closes;
              the grabber is also a button, so keyboard and screen-reader users get the same exit. */}
          <button type="button" className="wl-askgrab" aria-label="Close" onClick={onClose}
                  onPointerDown={(e) => { dragFrom.current = e.clientY; }}
                  onPointerUp={(e) => { if (dragFrom.current !== null && e.clientY - dragFrom.current > 60) onClose();
                                        dragFrom.current = null; }} />
          <div className="wl-askhead"><span className="wl-asktitle">Ask TDW</span>
            <button type="button" className="wl-askclose" aria-label="Close" onClick={onClose}>&times;</button></div>
          <div className="wl-askbody" ref={scrollRef}>
            <ChatThread messages={messages} loading={loading} onChipTap={send} scrollRef={scrollRef}
              /* onConfirm/onCancel are required by Props and no-op'd by every caller,
                 including app/vendor/page.tsx:1149-1150 — a contract that has drifted from
                 its component. Matched here rather than papered over; Phase 2 owns the cure. */
              onConfirm={() => {}} onCancel={() => {}}
              onReportGlitch={async () => { await reportGlitch(); }}
              onRetryLast={() => { const last = [...messages].reverse().find((m) => m.role === 'user');
                                   if (last?.text) send(last.text); }} />
          </div>
          <InputBar onSend={send} />
        </div>
      </div>
      <style>{ASK_CSS}</style>
    </ThemeProvider>
  );
}

const ASK_CSS = `
.wl-asksheet{position:fixed;inset:0;z-index:40;display:flex;flex-direction:column;justify-content:flex-end}
.wl-askscrim{position:absolute;inset:0;background:var(--role-scrim);border:none;cursor:pointer}
/* R-37.89 · THE CHAT IS A WORK SURFACE, NOT A PEEK.
   This rule used to read "max-height:82dvh" — a CAP, not a height. A cap only bites when
   the content is tall, and a fresh thread is empty, so the sheet opened at whatever the
   head + an empty body + the input happened to measure: the render arm caught it at ~35%
   of the viewport. A work surface does not resize itself to how little you have said yet.
   "height" is the fix; the cap stays beneath it as the safety it always was. */
.wl-askpanel{position:relative;display:flex;flex-direction:column;height:85dvh;max-height:85dvh;background:var(--atelier-sheet-bg);border:.5px solid var(--atelier-sheet-border);border-bottom:none;border-radius:12px 12px 0 0;overflow:hidden;padding-bottom:env(safe-area-inset-bottom)}
/* R-37.82's gutter, INSIDE the sheet — the sheet is its own scroll column and owns its inset. */
.wl-askpanel > *{padding-left:var(--wl-gutter);padding-right:var(--wl-gutter)}
.wl-askgrab{flex-shrink:0;align-self:center;width:38px;height:4px;margin:8px 0 2px;padding:0;border:none;border-radius:2px;background:var(--atelier-ink-fade);cursor:grab;touch-action:none}
.wl-askhead{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:14px 16px 12px;border-bottom:.5px solid var(--atelier-card-border)}
.wl-asktitle{font-family:var(--wl-label);font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-accent-text)}
.wl-askclose{width:44px;height:44px;margin:-10px -10px -10px 0;background:none;border:none;color:var(--atelier-ink-mute);font-size:22px;line-height:1;cursor:pointer}
.wl-askbody{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;min-height:180px}
`;
