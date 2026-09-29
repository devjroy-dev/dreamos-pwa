"use client";
// components/worklist/SearchBox.tsx · DESIGN-1 · STAGE 3 · THE UNIVERSAL SEARCH (lib/worklist/search.ts).
// One box, pinned under the header on every tab, never scrolled away. Typing lists what matches, grouped and labelled by
// kind: the tools first (a room opens), then her records from the search door. A question gets one more row, last,
// "Ask TDW about this", which opens the assistant with her words. An empty box shows her recent searches.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { getJson } from '@/lib/vendor/api/_base';
import { useAsk } from '@/lib/worklist/askContext';
import { HelpButton } from '@/v2/components/worklist/PageHelp'; // DESIGN-1: the search's "?"
import { SHEET_HELP } from '@/v2/lib/worklist/pageHelp';
import {
  SEARCH_WORDS as W, MIN_CHARS, matchTools, isQuestion, recordHref, readRecent, saveRecent, type ResultKind,
} from '@/v2/lib/worklist/search';

type Group = { kind: Exclude<ResultKind, 'tools'>; total: number; items: { id: string; title: string; sub: string | null }[] };
type Wire = { ok?: boolean; groups?: Group[] };

export function SearchBox({ canAsk }: { canAsk: boolean }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  // read once, on the client: the list is only drawn once she has opened the box, so the server's empty read never shows
  const [recent, setRecent] = useState<string[]>(() => (typeof window === 'undefined' ? [] : readRecent()));
  // the door's answer, kept with the query it answers: a stale answer is never shown for newer text
  const [answer, setAnswer] = useState<{ q: string; groups: Group[]; failed: boolean } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openAsk } = useAsk();
  const text = q.trim();

  // the door, after she pauses; a newer query supersedes an older answer
  useEffect(() => {
    if (text.length < MIN_CHARS) return;
    let live = true;
    const t = setTimeout(() => {
      getJson<Wire>('/api/v2/vendor/search?q=' + encodeURIComponent(text))
        .then((r) => { if (live) setAnswer(r && r.ok && Array.isArray(r.groups) ? { q: text, groups: r.groups, failed: false } : { q: text, groups: [], failed: true }); })
        .catch(() => { if (live) setAnswer({ q: text, groups: [], failed: true }); });
    }, 250);
    return () => { live = false; clearTimeout(t); };
  }, [text]);

  // a tap outside closes the list
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const found = useMemo(() => (text.length >= MIN_CHARS ? matchTools(text) : []), [text]);
  const question = canAsk && isQuestion(text);
  const chose = useCallback(() => { setRecent(saveRecent(text)); setOpen(false); }, [text]);
  const ask = useCallback(() => { setRecent(saveRecent(text)); setOpen(false); openAsk(text); }, [text, openAsk]);

  const current = answer && answer.q === text ? answer : null;
  const records = current ? current.groups : [];
  const failed = !!current && current.failed;
  const nothing = text.length >= MIN_CHARS && current !== null && !found.length && !records.length && !question;

  return (
    <div className="wl-search" ref={boxRef} role="search">
      <style>{SEARCH_CSS}</style>
      <div className="wl-srow0">
      <div className="wl-sfield">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        <input ref={inputRef} type="search" className="wl-sinput" aria-label={W.label} placeholder={W.placeholder}
               value={q} enterKeyHint="search" autoComplete="off"
               onChange={(e) => { setQ(e.target.value); setOpen(true); }}
               onFocus={() => setOpen(true)}
               onKeyDown={(e) => { if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); } if (e.key === 'Enter' && question) ask(); }} />
        {q && <button type="button" className="wl-sclear" aria-label={W.clear} onClick={() => { setQ(''); inputRef.current?.focus(); }}>{'×'}</button>}
      </div>
      {/* DESIGN-1: the search's own "?" (lib/worklist/pageHelp.ts SHEET_HELP.search) */}
      <HelpButton id="surface:search" title={SHEET_HELP.search.title} help={SHEET_HELP.search.help} />
      </div>

      {open && (text.length < MIN_CHARS ? recent.length > 0 : true) && (
        <div className="wl-sresults" data-search-results="">
          {text.length < MIN_CHARS ? (
            <section aria-label={W.recent}>
              <h3 className="wl-skind">{W.recent}</h3>
              {recent.map((r) => (
                <button key={r} type="button" className="wl-srow" data-kind="recent" onClick={() => { setQ(r); inputRef.current?.focus(); }}>{r}</button>
              ))}
            </section>
          ) : (
            <>
              {found.length > 0 && (
                <section aria-label={W.kinds.tools} data-group="tools">
                  <h3 className="wl-skind">{W.kinds.tools}</h3>
                  {found.map((t) => <Link key={t.href} href={t.href} className="wl-srow" data-kind="tools" onClick={chose}>{t.label}</Link>)}
                </section>
              )}
              {records.map((g) => (
                <section key={g.kind} aria-label={W.kinds[g.kind]} data-group={g.kind}>
                  <h3 className="wl-skind">{W.kinds[g.kind]}</h3>
                  {g.items.map((it) => (
                    <Link key={it.id} href={recordHref(g.kind, it.id)} className="wl-srow" data-kind={g.kind} onClick={chose}>
                      <span className="wl-stitle">{it.title}</span>
                      {it.sub && <span className="wl-ssub">{it.sub}</span>}
                    </Link>
                  ))}
                  {g.total > g.items.length && <p className="wl-smore">{W.more(g.total - g.items.length)}</p>}
                </section>
              ))}
              {failed && <p className="wl-snote">{W.unavailable}</p>}
              {nothing && !failed && <p className="wl-snote">{W.none}</p>}
              {question && (
                <button type="button" className="wl-srow wl-sask" data-kind="ask" onClick={ask}>{W.ask}</button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

const SEARCH_CSS = `
.wl-search{position:relative;padding:8px var(--wl-gutter, 16px);flex:0 0 auto;z-index:4}
.wl-srow0{display:flex;align-items:center;gap:4px}
.wl-sfield{flex:1;min-width:0;display:flex;align-items:center;gap:8px;min-height:44px;padding:0 12px;border-radius:12px;border:1px solid var(--atelier-input-border);background:var(--atelier-card-bg);color:var(--atelier-ink-mute)}
.wl-sfield:focus-within{border-color:var(--atelier-accent-text)}
.wl-sinput{flex:1;min-width:0;min-height:44px;border:0;background:transparent;color:var(--atelier-ink);font:var(--wl-tb);outline:none;-webkit-appearance:none;appearance:none}
.wl-sinput::-webkit-search-cancel-button{display:none}
.wl-sinput::placeholder{color:var(--atelier-ink-mute)}
.wl-sclear{min-width:44px;min-height:44px;margin-right:-12px;border:0;background:transparent;color:var(--atelier-ink-mute);font:var(--wl-tb);touch-action:manipulation}
.wl-sresults{position:absolute;left:16px;right:16px;top:100%;max-height:min(70dvh,560px);overflow-y:auto;overscroll-behavior:contain;padding:8px 0;border-radius:12px;border:1px solid var(--atelier-card-border);background:var(--atelier-page-bg)}
.wl-skind{margin:8px 16px 4px;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.wl-srow{display:flex;flex-direction:column;justify-content:center;width:100%;min-height:44px;padding:8px 16px;border:0;background:transparent;text-align:left;text-decoration:none;color:var(--atelier-ink);font:var(--wl-tb);touch-action:manipulation}
.wl-srow:active{background:var(--atelier-row-hover)}
.wl-srow:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
.wl-ssub{font:var(--wl-t5);color:var(--atelier-ink-mute)}
.wl-smore,.wl-snote{margin:4px 16px 8px;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.wl-sask{color:var(--atelier-accent-text);border-top:1px solid var(--atelier-card-border);margin-top:8px}
`;
