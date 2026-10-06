"use client";
// components/website/WebsiteRoom.tsx · CE-47 · WEB-6 · b172 · THE WEBSITE CUSTOMISER (the Your website room).
//
// ONE HOME (W6-e): both page files import this file and pass their own copy of today's screen; it is drawn in shell
// tokens only, so each layout's theme dresses it. Mock r1 approved in shape by CE-47; r2's items 1 to 8 built here.
// Bound to WEB-4's doors as landed (dream-os a0bfe02, ./client.ts). Words: ./copy.ts, nothing inline.
// THE RULES: one "?" per page (the shell's); destructive actions last and asked first; settings and sections join the
// pending changes and Publish puts them on the website (WEB-4 cut 5: the draft; a server without `changes` gets no pending
// line and no Publish); before her first Publish the room says visitors still see today's page; a look saves on its own, in its own draft or
// published state; prices are vendors.rate_display and work at once; only the ids GET /room offers are drawn; a null
// visitors answer is the plan's line, never a zero; no toast carries a result alone.
import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { WEB, KIND, SOURCE_NAME, FINISH_NAME, PAIR_NAME, clock, monthYear } from '@/lib/website/copy';
import { site, direction, previewToken, type Room, type Look, type Testimonial, type Visitors as Vis, type Section } from './client';
// WEB-8 (r2, MERGED): the real pill, FE-5's RoomHeadAdd (the new layout's head draws it); the classic shell has no provider, so it draws addInline.
import { RoomHeadAdd } from '@/v2/components/worklist/PageHelp';
import { useSettings } from '@/hooks/vendor/useSettings';
import { updateMe } from '@/lib/vendor/api/vendor';
import { publicUrlFor } from '@/lib/public/vendorHost';

/** Today's screens (the one-page site, the address, Google): each layout passes its own copy. */
export type TodayScreen = ComponentType<{ vendorId: string; start?: 'address' | 'google' | 'switches'; onBack?: () => void }>;
type Screen = 'room' | 'style' | 'stamp' | 'sections' | 'looks' | 'look' | 'kind' | 'visitors' | 'prices' | 'fix' | 'address' | 'google';
type SheetKind = null | 'changes' | 'discard' | 'publish' | 'pick' | { swap: string } | { del: string } | { delWords: string };
const EXAMPLES = ['example-portrait', 'example-couple', 'example-hands', 'example-bouquet'].map((k) => `/examples/ads/${k}.jpg`);
type Answer = { ok?: boolean; error?: string };

export default function WebsiteRoom({ vendorId, Today, addInline }: { vendorId: string; Today: TodayScreen; addInline?: boolean }) {
  const { current } = useSettings();
  const handle = (current.routing_handle || '').toLowerCase();
  const address = handle ? publicUrlFor(handle).replace(/^https?:\/\//, '') : '';
  const [room, setRoom] = useState<Room | null>(null);
  const [looks, setLooks] = useState<Look[] | null>(null);
  const [words, setWords] = useState<Testimonial[] | null>(null);
  const [visits, setVisits] = useState<Vis | undefined>(undefined);
  const [err, setErr] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>('room');
  const [lookId, setLookId] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [justPublished, setJustPublished] = useState<string | null>(null);
  // WEB-8 C2 (MERGED, CE-47): for ten minutes after a Publish the line says visitors will see it within about 10 minutes
  const [fresh, setFresh] = useState(false);
  useEffect(() => { if (!justPublished) { setFresh(false); return; } setFresh(true); const t = setTimeout(() => setFresh(false), 10 * 60 * 1000); return () => clearTimeout(t); }, [justPublished]);
  const [showPrices, setShowPrices] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    const [r, l, t, v] = await Promise.all([site.room(), site.looks(), site.testimonials(), site.visitors(7)].map((p) => p.catch(() => null)));
    const rr = r as { room?: Room } | null;
    if (rr && rr.room) { setRoom(rr.room); setErr(null); } else setErr(WEB.failed);
    setLooks(((l as { looks?: Look[] } | null)?.looks) || []);
    setWords(((t as { testimonials?: Testimonial[] } | null)?.testimonials) || []);
    const vv = v as { visitors?: Vis; ok?: boolean } | null; setVisits(vv && vv.ok !== false && 'visitors' in vv ? (vv.visitors ?? null) : null);
  }, []);
  useEffect(() => { void load(); }, [load]);
  // the preview token lives 30 minutes: the room reads itself again every 25, and when the phone comes back to it
  useEffect(() => {
    const t = setInterval(() => { void load(); }, 25 * 60 * 1000);
    const v = () => { if (document.visibilityState === 'visible') void load(); };
    document.addEventListener('visibilitychange', v);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', v); };
  }, [load]);
  useEffect(() => { if (showPrices === null && typeof current.rate_display === 'boolean') setShowPrices(current.rate_display); }, [current.rate_display, showPrices]);

  // every write: the door's own refusal line is shown as it is (R-45.30 lines, WEB-4's); then the room is read again
  const write = useCallback(async (fn: () => Promise<unknown>) => {
    try { const a = (await fn()) as Answer | null; if (a && a.ok === false) { setErr(a.error || WEB.failed); return false; } setErr(null); setJustPublished(null); await load(); return true; }
    catch { setErr(WEB.failed); return false; }
  }, [load]);

  if (!room) return <div className="wb"><style>{CSS}</style>{err && <p className="wb-err" role="alert">{err}</p>}</div>;
  const res = room.resolved;

  // BASIC keeps today's one-page site and today's screens, with the plain offer under them and no dead control
  if (res.v === 'classic') {
    return (
      <>
        <Today vendorId={vendorId} />
        <div className="wb"><style>{CSS}</style>
          <div className="wb-offer" data-website-offer="">
            <div className="wb-rl">{WEB.essAdds}</div>
            <ul>{WEB.essList.map((x) => <li key={x}>{x}</li>)}</ul>
            <a className="wb-sbtn wb-block" href="/vendor/billing">{WEB.seePlans}</a>
          </div>
        </div>
      </>
    );
  }
  const back = () => { setScreen('room'); setSheet(null); };
  if (screen === 'address' || screen === 'google') return <Today vendorId={vendorId} start={screen} onBack={back} />;

  // the draft, through its 30-minute token (cut 5); with no token, today's live page as today's room shows it
  const token = previewToken(room.preview);
  const preview = !handle ? '' : token ? withParam(publicUrlFor(handle), 'preview', token) : `${publicUrlFor(handle)}?in=shell`;
  const ctx: Ctx = { addInline: addInline === true, room, res, looks: looks || [], words: words || [], visits, address, preview, write, go: setScreen, back, sheet, setSheet,
    openLook: (id) => { setLookId(id); setScreen('look'); }, showPrices: !!showPrices,
    setPrices: async (v) => { setShowPrices(v); const a = (await updateMe({ rate_display: v })) as Answer; if (a && a.ok === false) { setShowPrices(!v); setErr(a.error || WEB.failed); } } };
  const body = (() => {
    switch (screen) {
      case 'style': return <StylePage {...ctx} />;
      case 'stamp': return <StampPage {...ctx} />;
      case 'sections': return <SectionsPage {...ctx} />;
      case 'looks': return <LooksPage {...ctx} />;
      case 'look': return <LookEditor key={lookId || 'new'} {...ctx} id={lookId} />;
      case 'kind': return <KindPage {...ctx} />;
      case 'visitors': return <VisitorsPage {...ctx} />;
      case 'prices': return <PricesPage {...ctx} />;
      case 'fix': return <FixPage {...ctx} />;
      default: return <RoomPage {...ctx} justPublished={justPublished} fresh={fresh} />;
    }
  })();
  const c = room.changes?.count || 0; const live = room.is_live !== false;
  return (
    <div className="wb" data-website-screen={screen}>
      <style>{CSS}</style>
      {err && <p className="wb-err" role="alert">{err}</p>}
      {body}
      {/* WEB-8 (MERGED): today's two enquiry switches (check a date, share approximate prices) stay reachable on the customiser's home */}
      {screen === 'room' && <Today vendorId={vendorId} start="switches" />}
      {sheet === 'changes' && room.changes && (
        <Sheet onClose={() => setSheet(null)} title={WEB.pendT}>
          <div>{room.changes.list.map((x, i) => <div key={i} className="wb-chg"><b>{x.line}</b></div>)}</div>
          <button className="wl-btn pri wb-plain" onClick={() => setSheet('publish')}>{WEB.publish}</button>
          <button className="wb-dlink" onClick={() => setSheet('discard')}>{WEB.discard}</button>
        </Sheet>
      )}
      {sheet === 'discard' && (
        <Sheet onClose={() => setSheet(null)} title={WEB.discardT(c)}>
          <p>{WEB.discardD}</p>
          <button className="wb-danger" onClick={() => { setSheet(null); void write(site.discard); }}>{WEB.discardGo}</button>
          <button className="wb-sbtn" onClick={() => setSheet(null)}>{WEB.keep}</button>
        </Sheet>
      )}
      {sheet === 'publish' && (
        <Sheet onClose={() => setSheet(null)} title={live ? WEB.pubT(c) : WEB.newPubT}>
          <p>{live ? WEB.pubD(address) : WEB.newPubD(address)}</p>
          <button className="wl-btn pri wb-plain" onClick={async () => { setSheet(null); if (await write(site.publish)) setJustPublished(clock(new Date())); }}>{WEB.publish}</button>
          <button className="wb-sbtn" onClick={() => setSheet(null)}>{WEB.cancel}</button>
        </Sheet>
      )}
    </div>
  );
}

type Ctx = {
  addInline: boolean;
  room: Room; res: Room['resolved']; looks: Look[]; words: Testimonial[]; visits: Vis | undefined; address: string; preview: string;
  write: (fn: () => Promise<unknown>) => Promise<boolean>; go: (x: Screen) => void; back: () => void; sheet: SheetKind; setSheet: (x: SheetKind) => void;
  openLook: (id: string | null) => void; showPrices: boolean; setPrices: (v: boolean) => Promise<void>;
};

// ── the pieces ───────────────────────────────────────────────────────────────────────────────────
function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  return (<><div className="wb-scrim" onClick={onClose} /><div className="wb-sheet" role="dialog" aria-modal="true" aria-label={title}><h3>{title}</h3>{children}</div></>);
}
function Row({ l, d, onClick, right }: { l: string; d?: string; onClick?: () => void; right?: ReactNode }) {
  const inner = (<><span className="wb-rt"><span className="wb-rl">{l}</span>{d && <span className="wb-rd">{d}</span>}</span>{right ?? (onClick && <span className="wb-chev" aria-hidden="true">›</span>)}</>);
  return onClick ? <button type="button" className="wb-row" onClick={onClick}>{inner}</button> : <div className="wb-row">{inner}</div>;
}
function Head({ t, back, add }: { t: string; back: () => void; add?: ReactNode }) {
  return (<div className="wb-head"><button type="button" className="wb-back" onClick={back}>‹ {WEB.back}</button><div className="wb-titleline"><h2 className="wb-sub">{t}</h2>{add}</div></div>);
}
function Toggle({ on, onChange, label, disabled }: { on: boolean; onChange?: (v: boolean) => void; label: string; disabled?: boolean }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} aria-disabled={disabled || undefined} className={'wb-tg' + (on ? ' on' : '') + (disabled ? ' lock' : '')} onClick={() => !disabled && onChange && onChange(!on)} />;
}
function Seg({ value, options, onChange, wide }: { value: string; options: Array<[string, string]>; onChange: (v: string) => void; wide?: boolean }) {
  return <div className={'wb-seg' + (wide ? ' wide' : '')} role="radiogroup">{options.map(([k, l]) => <button key={k} type="button" role="radio" aria-checked={value === k} className={value === k ? 'on' : ''} onClick={() => onChange(k)}>{l}</button>)}</div>;
}
function Preview({ url, mode, height }: { url: string; mode: 'phone' | 'desktop'; height: number }) {
  const box = useRef<HTMLDivElement>(null); const [w, setW] = useState(334);
  useEffect(() => { const el = box.current; if (!el) return; const ro = new ResizeObserver(() => setW(el.clientWidth)); ro.observe(el); return () => ro.disconnect(); }, []);
  // WEB-8 C2 (MERGED, CE-47 cure A): the phone preview draws a whole phone screen (374 x 760) shrunk to the window's height
  // and centred, so the window shows the first screen as a visitor sees it, her name included, photographs or not.
  const iw = mode === 'phone' ? 374 : 1280; const ih = mode === 'phone' ? 760 : 0;
  const k = ih ? Math.min(height / ih, w / iw) : w / iw; const left = ih ? Math.max(0, (w - iw * k) / 2) : 0;
  return <div ref={box} className="wb-win" style={{ height }} data-preview={mode}>{url && <iframe src={url} title={WEB.back} tabIndex={-1} style={{ width: iw, height: ih || height / k, left, transform: `scale(${k})` }} />}</div>;
}
const withParam = (u: string, k: string, v: string) => `${u}${u.includes('?') ? '&' : '?'}${k}=${encodeURIComponent(v)}`;
const styleName = (room: Room, id?: string) => room.styles.find((s) => s.id === id)?.label || '';

// ── the room ─────────────────────────────────────────────────────────────────────────────────────
function RoomPage({ room, res, looks, words, visits, address, preview, go, setSheet, showPrices, justPublished, fresh }: Ctx & { justPublished: string | null; fresh?: boolean }) {
  const [mode, setMode] = useState<'phone' | 'desktop'>('phone');
  const c = room.changes?.count || 0; const live = room.is_live !== false;
  const secs = (res.sections || []).filter((x) => x.allowed);
  const shown = secs.filter((x) => x.shown).length; const hidden = secs.length - shown;
  const liveN = looks.filter((l) => l.public_state === 'live').length; const draftN = looks.length - liveN;
  const waiting = words.filter((t) => t.state === 'pending' && t.from_client).length; const onSite = words.filter((t) => t.state === 'approved').length;
  const pal = room.styles.find((s) => s.id === res.style)?.palettes.find((p) => p.id === res.palette?.id)?.label;
  const pair = res.font_pair ? res.font_pair.display : null;
  const fixN = room.to_fix.packages_below_starting_price.length;
  return (
    <>
      <Preview url={preview} mode={mode} height={mode === 'phone' ? 330 : 210} />
      <div className="wb-under"><span className="wb-addr">{address}</span><Seg value={mode} options={[['phone', WEB.phone], ['desktop', WEB.desktop]]} onChange={(v) => setMode(v as 'phone' | 'desktop')} /></div>
      {looks.length === 0 && !live && <p className="wb-note wide">{WEB.newCover}</p>}
      {room.changes && (!live ? (
        // cut 5: POST /publish answers "There are no changes to publish." with no draft, so Publish shows once there is one
        <div className="wb-pend"><span>{WEB.notOnline}</span>{c > 0 && <button className="wl-btn pri wb-plain" onClick={() => setSheet('publish')}>{WEB.publish}</button>}</div>
      ) : c > 0 ? (
        <div className="wb-pend"><button type="button" className="wb-pendline" onClick={() => setSheet('changes')}>{WEB.pending(c)} ›</button><button className="wl-btn pri wb-plain" onClick={() => setSheet('publish')}>{WEB.publish}</button></div>
      ) : justPublished ? (
        <div className="wb-done" role="status"><i />{fresh ? WEB.publishedFresh : WEB.publishedAt(justPublished)}</div>
      ) : null)}
      <div className="wb-sect">{WEB.gDesign}</div>
      <Row l={WEB.style} d={WEB.styleD(styleName(room, res.style), (res.styles_open || []).length, res.can.styles)} onClick={() => go('style')} />
      <Row l={WEB.stamp} d={[pal, pair, WEB.motionIds[res.motion || 'lively']].filter(Boolean).join(' · ')} onClick={() => go('stamp')} />
      <Row l={WEB.sections} d={WEB.sectionsD(shown, hidden)} onClick={() => go('sections')} />
      <div className="wb-sect">{WEB.gContent}</div>
      {looks.length === 0 ? <Row l={WEB.firstLook(res.trade?.item || 'look')} d={WEB.firstLookD} onClick={() => go('looks')} />
        : <Row l={WEB.looks(res.trade?.items || 'Looks')} d={WEB.looksD(liveN, draftN)} onClick={() => go('looks')} />}
      <Row l={KIND} d={waiting || onSite ? WEB.kindWaiting(waiting) : WEB.kindNone} onClick={() => go('kind')} />
      <Row l={WEB.ig} d={WEB.igD} right={<button type="button" className="wb-soon" disabled>{WEB.soon}</button>} />
      <div className="wb-sect">{WEB.gResults}</div>
      <Row l={WEB.visitors} d={!live ? WEB.visitorsNew : visits === null ? WEB.vLocked : visits ? WEB.visitorsD(visits.visitors) : undefined} onClick={() => go('visitors')} />
      <Row l={WEB.prices} d={showPrices ? WEB.pricesOn : WEB.pricesOff} onClick={() => go('prices')} />
      <div className="wb-sect">{WEB.gAddr}</div>
      <Row l={WEB.fix} d={WEB.fixD(fixN)} onClick={() => go('fix')} />
      <Row l={WEB.addr} d={address} onClick={() => go('address')} />
      <Row l={WEB.seo} onClick={() => go('google')} />
    </>
  );
}

// ── style ────────────────────────────────────────────────────────────────────────────────────────
function StylePage({ room, res, preview, write, back, sheet, setSheet }: Ctx) {
  const of = res.can.styles; const open = res.styles_open || []; const use = res.style || '';
  const ids = room.styles.map((s) => s.id);
  const full = of < 6 && open.length >= of;
  const [pick, setPick] = useState('');
  const [picks, setPicks] = useState<string[]>(open);
  const swap = typeof sheet === 'object' && sheet && 'swap' in sheet ? sheet.swap : null;
  return (
    <>
      <Head t={WEB.style} back={back} />
      <p className="wb-note">{WEB.styleNote(of)}</p>
      {of < 6 && open.length === 0 && <button className="wl-btn pri wb-plain wb-block" onClick={() => setSheet('pick')}>{WEB.pickT(of)}</button>}
      <div className="wb-grid">
        {ids.map((k) => { const inUse = k === use; const ch = of >= 6 || open.includes(k);
          return (
            <div key={k} className={'wb-card' + (inUse ? ' inuse' : '')} data-style={k}>
              <Preview url={preview ? withParam(preview, 'style', k) : ''} mode="phone" height={250} />
              <div className="wb-cb"><span className="wb-cn">{styleName(room, k)}</span>
                {inUse ? <span className="wb-tag acc">{WEB.inUse}</span>
                  : ch ? <><span className="wb-tag">{of >= 6 ? '\u00a0' : WEB.chosen}</span><button className="wb-sbtn" onClick={() => void write(() => site.settings({ style: k }))}>{WEB.use}</button></>
                    : <><span className="wb-tag">{of === 4 ? WEB.allSix : '\u00a0'}</span><button className="wb-sbtn" onClick={() => (full ? setSheet({ swap: k }) : void write(() => site.settings({ styles_picked: [...open, k] })))}>{WEB.choose}</button></>}
              </div>
            </div>);
        })}
      </div>
      {swap && (
        <Sheet onClose={() => setSheet(null)} title={WEB.swapT(styleName(room, swap))}>
          <div role="radiogroup">{open.filter((k) => k !== use).map((k) => <button key={k} type="button" role="radio" aria-checked={pick === k} className="wb-pair" onClick={() => setPick(k)}><span className="wb-rl">{styleName(room, k)}</span><span className={'wb-radio' + (pick === k ? ' on' : '')} /></button>)}</div>
          <p>{WEB.swapInUse(styleName(room, use))}</p><p>{WEB.swapKept}</p>
          <button className="wl-btn pri wb-plain" disabled={!pick} onClick={() => { setSheet(null); void write(() => site.settings({ styles_picked: [...open.filter((x) => x !== pick), swap] })); }}>{WEB.replace}</button>
          <button className="wb-sbtn" onClick={() => setSheet(null)}>{WEB.cancel}</button>
        </Sheet>
      )}
      {sheet === 'pick' && (
        <Sheet onClose={() => setSheet(null)} title={WEB.pickT(of)}>
          <p>{WEB.pickD(of)}</p>
          {ids.map((k) => { const on = picks.includes(k);
            return <button key={k} type="button" role="checkbox" aria-checked={on} className="wb-pair" onClick={() => setPicks(on ? picks.filter((x) => x !== k) : picks.length < of ? [...picks, k] : picks)}><span className="wb-rl">{styleName(room, k)}</span><span className={'wb-check' + (on ? ' on' : '')} /></button>; })}
          <button className="wl-btn pri wb-plain" disabled={picks.length !== of} onClick={() => { setSheet(null); void write(() => site.settings({ styles_picked: picks, style: picks[0] })); }}>{WEB.pickGo(picks.length)}</button>
        </Sheet>
      )}
    </>
  );
}

// ── colours and type, and the finish (only the ids GET /room offers for her style and plan) ───────
function StampPage({ room, res, preview, write, back }: Ctx) {
  const st = room.styles.find((s) => s.id === res.style); const name = st?.label || '';
  const fin = room.finish[res.style || ''] || { corners: [], buttons: [], textures: [] };
  const moved = res.palette?.custom ? res.palette.moved.find((m) => m.role === 'accent') || res.palette.moved[0] : undefined;
  const set = (body: Record<string, unknown>) => void write(() => site.settings(body));
  const [mono, setMono] = useState(res.monogram);
  const [accent, setAccent] = useState(res.palette?.custom ? (res.palette.roles.accent || '#c2527a') : '#c2527a');
  const opts = (xs: string[]) => xs.map((k) => [k, FINISH_NAME[k] || k] as [string, string]);
  return (
    <>
      <Head t={WEB.stamp} back={back} />
      <Preview url={preview} mode="phone" height={230} />
      <div className="wb-sect first">{WEB.pal}</div>
      <p className="wb-note">{WEB.palD(name)}</p>
      <div className="wb-pals" role="radiogroup">
        {(st?.palettes || []).map((p) => { const on = res.palette?.id === p.id && !res.palette?.custom;
          return <button key={p.id} type="button" role="radio" aria-checked={on} className={'wb-pal' + (on ? ' on' : '')} onClick={() => set({ palette_id: p.id, palette_custom: {} })}>
            {p.swatch && <span className="wb-sw">{p.swatch.map((x, i) => <i key={i} style={{ background: x }} />)}</span>}<span>{p.label}</span></button>; })}
      </div>
      {res.can.custom_palette && (
        <div className="wb-row"><span className="wb-rt"><span className="wb-rl">{WEB.ownAccent}</span><span className="wb-rd">{WEB.ownAccentD}</span></span>
          <input type="color" className="wb-colour" aria-label={WEB.ownAccent} value={accent} onChange={(e) => setAccent(e.target.value)} onBlur={() => set({ palette_custom: { accent, base: res.palette?.id } })} /></div>)}
      {res.palette?.custom && <button type="button" className="wb-lnk" onClick={() => set({ palette_custom: {} })}>{WEB.ownAccentClear}</button>}
      {moved && (<div className="wb-adj" data-adjusted=""><b>{WEB.adjusted}</b><p>{WEB.adjustedD(direction(moved), moved.before.toFixed(1), moved.after.toFixed(1))}</p></div>)}
      <div className="wb-sect">{WEB.type}</div>
      <p className="wb-note">{WEB.typeD(name)}</p>
      <div role="radiogroup">{(st?.pairs || []).map((id) => { const [d, t] = PAIR_NAME[id] || [id, '']; const on = res.font_pair?.id === id;
        return (<button key={id} type="button" role="radio" aria-checked={on} className="wb-pair" onClick={() => set({ font_pair: id })}>
          <span><span className="s1" style={{ fontFamily: `"${d}", serif` }}>{res.site_name || name}</span><span className="s2">{d} · {t}</span></span><span className={'wb-radio' + (on ? ' on' : '')} /></button>); })}</div>
      <div className="wb-sect">{WEB.motion}</div>
      <Seg wide value={res.motion || 'lively'} options={['calm', 'lively', 'cinematic'].map((k) => [k, WEB.motionIds[k]] as [string, string])} onChange={(v) => set({ motion: v })} />
      <p className="wb-note">{WEB.motionD[res.motion || 'lively']}</p>
      {fin.corners.length > 1 && <><div className="wb-sect">{WEB.corners}</div><Seg wide value={res.corners || ''} options={opts(fin.corners)} onChange={(v) => set({ corners: v })} /></>}
      {fin.buttons.length > 1 && <><div className="wb-sect">{WEB.buttons}</div><Seg wide value={res.buttons || ''} options={opts(fin.buttons)} onChange={(v) => set({ button_style: v })} /></>}
      <div className="wb-sect">{WEB.texture}</div>
      {fin.textures.length > 1 ? <Seg wide value={res.texture || fin.textures[0]} options={opts(fin.textures)} onChange={(v) => set({ texture: v })} /> : <p className="wb-note">{WEB.textureNone(name)}</p>}
      <div className="wb-sect">{WEB.mono}</div>
      <div className="wb-mono"><span className="m">{mono}</span><input className="wb-fi" value={mono} maxLength={3} aria-label={WEB.mono} onChange={(e) => setMono(e.target.value.toUpperCase())} onBlur={() => mono !== res.monogram && set({ monogram: mono })} /></div>
      <p className="wb-note">{WEB.monoD}</p>
      <div className="wb-sect">{WEB.cover}</div>
      <Seg wide value={res.cover_mode || 'slideshow'} options={['slideshow', 'still'].map((k) => [k, WEB.coverIds[k]] as [string, string])} onChange={(v) => set({ cover_mode: v })} />
      <p className="wb-note">{WEB.coverD[res.cover_mode || 'slideshow']}</p>
    </>
  );
}

// ── sections: grip and arrows, one reorder for sections and photographs ─────────────────────────
export function useReorder<T>(items: T[], movable: (t: T) => boolean, commit: (next: T[]) => void) {
  const [list, setList] = useState(items);
  useEffect(() => setList(items), [items]);
  const listRef = useRef(list); listRef.current = list;
  const move = (i: number, d: -1 | 1) => { const j = i + d; if (j < 0 || j >= list.length || !movable(list[i]) || !movable(list[j])) return; const next = [...list]; [next[i], next[j]] = [next[j], next[i]]; setList(next); commit(next); };
  const drag = useRef<{ i: number; y: number; h: number; moved: boolean } | null>(null);
  const onGrip = (i: number) => (e: React.PointerEvent) => {
    const row = (e.currentTarget as HTMLElement).closest('[data-reorder-row]') as HTMLElement | null; if (!row) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); drag.current = { i, y: e.clientY, h: row.getBoundingClientRect().height, moved: false };
  };
  const onMove = (e: React.PointerEvent) => { const d = drag.current; if (!d) return; const dy = e.clientY - d.y; if (Math.abs(dy) < d.h * 0.6) return;
    const j = d.i + (dy > 0 ? 1 : -1); const cur = listRef.current; if (j < 0 || j >= cur.length || !movable(cur[d.i]) || !movable(cur[j])) return;
    const next = [...cur]; [next[d.i], next[j]] = [next[j], next[d.i]]; setList(next); d.i = j; d.y = e.clientY; d.moved = true; };
  const onUp = () => { const d = drag.current; drag.current = null; if (d && d.moved) commit(listRef.current); };
  return { list, move, onGrip, onMove, onUp };
}
function SectionsPage({ res, write, back }: Ctx) {
  const all = res.sections || [];
  const full = res.can.full_order;
  const fixedOf = (k: string) => (k === 'cover' ? 'first' : k === 'enquire' ? 'last' : null);
  const movable = (x: Section) => x.allowed && (full || !fixedOf(x.key));
  const put = (list: Section[], change?: Partial<Record<string, boolean>>) => site.sections(list.map((x, i) => ({ key: x.key, variant: x.variant, shown: change && x.key in change ? !!change[x.key] : x.shown, eyebrow: x.eyebrow, heading: x.heading, body: x.body, position: i * 10 })));
  const r = useReorder(all, movable, (next) => void write(() => put(next)));
  return (
    <>
      <Head t={WEB.sections} back={back} />
      <p className="wb-note">{full ? WEB.secNoteFull : WEB.secNote}</p>
      <div onPointerMove={r.onMove} onPointerUp={r.onUp}>
        {r.list.map((x, i) => { const nm = x.heading || WEB.sectionName[x.key] || x.key; const pinned = !full && fixedOf(x.key);
          return (
            <div key={x.key} className="wb-srow" data-reorder-row="" data-section={x.key}>
              <span className="wb-grip" onPointerDown={movable(x) ? r.onGrip(i) : undefined} aria-hidden="true">{movable(x) ? '⋮⋮' : ''}</span>
              <span className="wb-rt"><span className={'wb-rl' + (!x.allowed || !x.shown ? ' mute' : '')}>{nm}</span>{!x.allowed && <span className="wb-rd">{WEB.onSignature}</span>}</span>
              {pinned ? <span className="wb-fixed">{pinned === 'first' ? WEB.alwaysFirst : WEB.alwaysLast}</span>
                : x.allowed ? <><span className="wb-arw"><button type="button" aria-label={`${WEB.up}: ${nm}`} disabled={i === 0 || !movable(r.list[i - 1])} onClick={() => r.move(i, -1)}>▲</button><button type="button" aria-label={`${WEB.down}: ${nm}`} disabled={i === r.list.length - 1 || !movable(r.list[i + 1])} onClick={() => r.move(i, 1)}>▼</button></span>
                  <Toggle on={x.shown} label={`${WEB.show}: ${nm}`} disabled={x.key === 'enquire'} onChange={(v) => void write(() => put(r.list, { [x.key]: v }))} /></> : <span />}
            </div>);
        })}
      </div>
      <Row l={WEB.credit} d={res.can.credit_removable ? WEB.creditOpen : WEB.creditLocked}
        right={<Toggle on={res.credit} label={WEB.credit} disabled={!res.can.credit_removable} onChange={(v) => void write(() => site.settings({ credit_shown: v }))} />} />
    </>
  );
}

// ── looks ────────────────────────────────────────────────────────────────────────────────────────
function LooksPage({ res, looks, back, openLook, addInline }: Ctx) {
  const [tab, setTab] = useState<'live' | 'draft'>('live');
  const items = res.trade?.items || 'Looks';
  const liveN = looks.filter((l) => l.public_state === 'live').length;
  const shown = looks.filter((l) => (tab === 'live' ? l.public_state === 'live' : l.public_state !== 'live'));
  return (
    <>
      {addInline ? null : <RoomHeadAdd addKey="website:new-look" label={WEB.newLook} onAdd={() => openLook(null)} />}
      <Head t={items} back={back} add={addInline ? <button type="button" className="wb-pill" data-add-key="website:new-look" onClick={() => openLook(null)}>{WEB.newLook}</button> : undefined} />
      <button type="button" className="wb-soon wb-block" disabled>{WEB.ig} · {WEB.soon}</button>
      {looks.length === 0 ? (<>
        <div className="wb-grid" data-examples="">{EXAMPLES.map((src) => <div key={src} className="wb-card wb-look"><span className="ph"><img src={src} alt="" /><span className="wb-wm">TDW</span></span></div>)}</div>
        <p className="wb-note">{WEB.examples}</p>
      </>) : (<>
        <Seg wide value={tab} options={[['live', `${WEB.published} · ${liveN}`], ['draft', `${WEB.drafts} · ${looks.length - liveN}`]]} onChange={(v) => setTab(v as 'live' | 'draft')} />
        <div className="wb-grid">
          {shown.map((l) => { const cover = l.photos[0];
            return (
              <button key={l.id} type="button" className="wb-card wb-look" data-look={l.id} onClick={() => openLook(l.id)}>
                <span className="ph">{cover && <img src={cover.url} alt="" style={{ objectPosition: `${cover.focal_portrait.x}% ${cover.focal_portrait.y}%` }} />}{l.public_state !== 'live' && <span className="wb-badge">{WEB.lookState[l.public_state]}</span>}</span>
                <span className="wb-cb"><span className="wb-cn">{l.title}</span>{l.from_price && <span className="wb-tag">{WEB.from(l.from_price)}</span>}</span>
              </button>); })}
        </div>
      </>)}
    </>
  );
}
function LookEditor({ id, looks, go, write, sheet, setSheet, openLook }: Ctx & { id: string | null }) {
  const look = id ? looks.find((l) => l.id === id) || null : null;
  const [title, setTitle] = useState(look?.title || ''); const [price, setPrice] = useState(look?.from_price || '');
  const [included, setIncluded] = useState<string[]>(look?.included || []);
  const [credits, setCredits] = useState<Array<{ role: string; text: string }>>((look?.credits || []).map((c) => ({ role: c.role || '', text: c.name || c.handle || '' })));
  const [focal, setFocal] = useState<[number, number]>(look?.photos[0] ? [look.photos[0].focal_portrait.x, look.photos[0].focal_portrait.y] : [50, 30]);
  const [busy, setBusy] = useState(false);
  const photos = look?.photos || [];
  const r = useReorder(photos, () => true, (next) => void write(async () => { for (const [i, p] of next.entries()) { const a = await site.photo(look!.id, p.id, { position: i }); if ((a as Answer).ok === false) return a; } return { ok: true }; }));
  const file = useRef<HTMLInputElement>(null);
  const save = () => void write(async () => {
    let lid = look?.id;
    if (!lid) { const c = await site.newLook(title.trim() || WEB.untitled); if ((c as Answer).ok === false || !c.look) return c; lid = c.look.id; }
    const a = await site.saveLook(lid, { title: title.trim() || WEB.untitled, from_price: price.trim() || null, included: included.filter((x) => x.trim()), credits: credits.filter((c) => c.role.trim() && c.text.trim()) });
    if ((a as Answer).ok === false) return a;
    if (photos[0] && (focal[0] !== photos[0].focal_portrait.x || focal[1] !== photos[0].focal_portrait.y)) await site.photo(lid, photos[0].id, { focal_portrait: { x: focal[0], y: focal[1] } });
    if (!look) openLook(lid);
    return a;
  });
  const del = typeof sheet === 'object' && sheet && 'del' in sheet;
  return (
    <>
      <Head t={look?.title || WEB.untitled} back={() => go('looks')} />
      <label className="wb-fl" htmlFor="wb-title">{WEB.lookTitle}</label><input id="wb-title" className="wb-fi" value={title} onChange={(e) => setTitle(e.target.value)} />
      {look && (<>
        <label className="wb-fl">{WEB.photos}</label>
        <div onPointerMove={r.onMove} onPointerUp={r.onUp}>
          {r.list.map((p, i) => (
            <div key={p.id} className="wb-prow" data-reorder-row="" data-photo={p.id}>
              <span className="wb-grip" onPointerDown={r.onGrip(i)} aria-hidden="true">⋮⋮</span>
              <span className="t"><img src={p.url} alt={p.alt || ''} /></span>
              <span className="wb-rt"><span className="wb-rd">{i === 0 ? WEB.photoCover : WEB.photoN(i + 1)}</span><span className={'wb-rd st-' + p.review}>{WEB.photoState[p.review]}{p.review === 'not_approved' && p.reason ? `: ${p.reason}` : ''}</span></span>
              <span className="wb-arw"><button type="button" aria-label={WEB.up} disabled={i === 0} onClick={() => r.move(i, -1)}>▲</button><button type="button" aria-label={WEB.down} disabled={i === r.list.length - 1} onClick={() => r.move(i, 1)}>▼</button></span>
              <button type="button" className="wb-rm" onClick={() => void write(() => site.removePhoto(look.id, p.id))}>{WEB.removePhoto}</button>
            </div>))}
        </div>
        <input ref={file} type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setBusy(true); await write(() => site.upload(look.id, f)); setBusy(false); e.target.value = ''; }} />
        <button type="button" className="wb-lnk" disabled={busy} onClick={() => file.current?.click()}>{busy ? WEB.uploading : WEB.addPhotos}</button>
        {photos[0] && (
          <button type="button" className="wb-focal" aria-label={WEB.focal} onClick={(e) => { const b = (e.currentTarget as HTMLElement).getBoundingClientRect(); setFocal([Math.round((e.clientX - b.left) / b.width * 100), Math.round((e.clientY - b.top) / b.height * 100)]); }}>
            <img src={photos[0].url} alt="" style={{ objectPosition: `${focal[0]}% ${focal[1]}%` }} /><span className="dot" style={{ left: `${focal[0]}%`, top: `${focal[1]}%` }} />
          </button>)}
        {photos[0] && <p className="wb-note">{WEB.focal}</p>}
      </>)}
      <label className="wb-fl" htmlFor="wb-price">{WEB.fromPrice}</label><input id="wb-price" className="wb-fi" value={price} onChange={(e) => setPrice(e.target.value)} />
      <p className="wb-note">{WEB.fromPriceD}</p>
      <label className="wb-fl">{WEB.included}</label>
      {included.map((x, i) => <input key={i} className="wb-fi wb-gap" aria-label={WEB.included} value={x} onChange={(e) => setIncluded(included.map((y, j) => (j === i ? e.target.value : y)))} />)}
      <button type="button" className="wb-lnk" onClick={() => setIncluded([...included, ''])}>{WEB.addLine}</button>
      <label className="wb-fl">{WEB.credits}</label>
      {credits.map((c, i) => (<div key={i} className="wb-two tight">
        <input className="wb-fi" aria-label={WEB.creditRole} placeholder={WEB.creditRole} value={c.role} onChange={(e) => setCredits(credits.map((y, j) => (j === i ? { ...y, role: e.target.value } : y)))} />
        <input className="wb-fi" aria-label={WEB.creditName} placeholder={WEB.creditName} value={c.text} onChange={(e) => setCredits(credits.map((y, j) => (j === i ? { ...y, text: e.target.value } : y)))} /></div>))}
      <button type="button" className="wb-lnk" onClick={() => setCredits([...credits, { role: '', text: '' }])}>{WEB.addCredit}</button>
      <p className="wb-note">{WEB.creditsD}</p>
      {look && (<>
        <label className="wb-fl">{WEB.status}</label>
        <Seg wide value={look.status} options={[['draft', WEB.draft], ['published', WEB.published]]} onChange={(v) => void write(() => site.publishLook(look.id, v === 'published'))} />
        {look.public_state === 'waiting_for_photos' && <p className="wb-note wide">{WEB.lookState.waiting_for_photos}</p>}
      </>)}
      <p className="wb-note wide">{WEB.saveRule}</p>
      <div className="wb-two"><button className="wl-btn pri wb-plain" onClick={save}>{WEB.save}</button></div>
      {look && <button type="button" className="wb-dlink" onClick={() => setSheet({ del: look.id })}>{WEB.deleteLook}</button>}
      {del && look && (
        <Sheet onClose={() => setSheet(null)} title={WEB.deleteT(look.title)}>
          <p>{WEB.deleteD}</p>
          <button className="wb-danger" onClick={() => { setSheet(null); void write(async () => { const a = await site.deleteLook(look.id); go('looks'); return a; }); }}>{WEB.deleteGo}</button>
          <button className="wb-sbtn" onClick={() => setSheet(null)}>{WEB.cancel}</button>
        </Sheet>)}
    </>
  );
}

// ── kind words ───────────────────────────────────────────────────────────────────────────────────
function KindPage({ words, back, write, sheet, setSheet }: Ctx) {
  const [name, setName] = useState(''); const [text, setText] = useState<string | null>(null); const [copied, setCopied] = useState(false);
  const waiting = words.filter((t) => t.state === 'pending' && t.from_client); const onSite = words.filter((t) => t.state === 'approved');
  const old = words.filter((t) => t.to_delete);
  const who = (t: Testimonial) => [t.name, t.place].filter(Boolean).join(' · ');
  const when = (t: Testimonial) => monthYear(t.month ? `${t.month}-01` : null);
  const delId = typeof sheet === 'object' && sheet && 'delWords' in sheet ? sheet.delWords : null;
  return (
    <>
      <Head t={KIND} back={back} />
      <div className="wb-sect first">{WEB.ask}</div>
      <p className="wb-note">{WEB.askD}</p>
      <label className="wb-fl" htmlFor="wb-client">{WEB.clientName}</label><input id="wb-client" className="wb-fi" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="wb-two"><button className="wb-sbtn" disabled={!name.trim()} onClick={() => void write(async () => { const a = await site.request(name.trim()); if ((a as Answer).ok !== false) { setText(a.copy_text || a.link); setCopied(false); } return a; })}>{WEB.makeLink}</button></div>
      {text && (<><p className="wb-note">{WEB.copyText}</p><div className="wb-copybox" data-copy-box=""><code>{text}</code>
        <button className="wl-btn pri wb-plain" onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* the text stays selectable in its box */ } }}>{copied ? WEB.copied : WEB.copy}</button></div>
        <p className="wb-note">{WEB.linkNote}</p></>)}
      <div className="wb-two"><button className="wb-sbtn" disabled>{WEB.sendTdw} · {WEB.soon}</button></div>
      <div className="wb-sect">{WEB.waiting} · {waiting.length}</div>
      {waiting.map((t) => (
        <div key={t.id} className="wb-quote"><p>{t.words}</p><div className="by">{[who(t), when(t)].filter(Boolean).join(', ')}</div>
          <div className="wb-two"><button className="wl-btn pri wb-plain" onClick={() => void write(() => site.approve(t.id))}>{WEB.approve}</button><button className="wb-sbtn" onClick={() => void write(() => site.hide(t.id))}>{WEB.hide}</button></div></div>))}
      {waiting.length > 0 && <p className="wb-note">{WEB.noEdit}</p>}
      <div className="wb-sect">{WEB.onSite} · {onSite.length}</div>
      {onSite.map((t) => <Row key={t.id} l={who(t)} d={when(t)} right={<button className="wb-lnk" onClick={() => void write(() => site.hide(t.id))}>{WEB.hide}</button>} />)}
      {old.length > 0 && (<>
        <div className="wb-sect">{WEB.oldRows} · {old.length}</div>
        <p className="wb-note">{WEB.oldRowsD}</p>
        {old.map((t) => <Row key={t.id} l={who(t) || t.words.slice(0, 40)} right={<button className="wb-lnk danger" onClick={() => setSheet({ delWords: t.id })}>{WEB.deleteRow}</button>} />)}
      </>)}
      {delId && (
        <Sheet onClose={() => setSheet(null)} title={WEB.deleteRowT}>
          <p>{WEB.deleteRowD}</p>
          <button className="wb-danger" onClick={() => { setSheet(null); void write(() => site.deleteTestimonial(delId)); }}>{WEB.deleteGo}</button>
          <button className="wb-sbtn" onClick={() => setSheet(null)}>{WEB.cancel}</button>
        </Sheet>)}
    </>
  );
}

// ── visitors: the sentences, then one quiet bar per source ──────────────────────────────────────
function VisitorsPage({ visits, back }: Ctx) {
  const [days, setDays] = useState<7 | 28>(7);
  const [v, setV] = useState<Vis | undefined>(visits);
  useEffect(() => { if (days === 7) { setV(visits); return; } setV(undefined); site.visitors(days).then((a) => setV(a && a.ok !== false ? a.visitors ?? null : null)).catch(() => setV(null)); }, [days, visits]);
  const src = v && v.by_source ? Object.entries(v.by_source).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]) : [];
  const max = Math.max(1, ...src.map(([, c]) => c));
  const top = v && v.saved_looks && v.saved_looks[0];
  return (
    <>
      <Head t={WEB.visitors} back={back} />
      {v === null ? <p className="wb-sent mute">{WEB.vLocked}</p> : (<>
        <Seg value={String(days)} options={[['7', WEB.days7], ['28', WEB.days28]]} onChange={(x) => setDays(x === '28' ? 28 : 7)} />
        {v && (<>
          <p className="wb-sent">{WEB.v1(v.visitors, v.days)}</p>
          <p className="wb-sent">{WEB.vViews(v.views)}</p>
          {v.by_source ? (src.length > 0 && <p className="wb-sent">{WEB.vSources(src)}</p>) : <p className="wb-sent mute">{WEB.vSourcesLocked}</p>}
          {v.top_look && <p className="wb-sent">{WEB.vTop(v.top_look.title, v.top_look.views)}</p>}
          {v.saved_looks ? (top && <p className="wb-sent">{WEB.vSaved(v.saved_looks.reduce((a, x) => a + x.hearts, 0), top.title, top.hearts)}</p>) : <p className="wb-sent mute">{WEB.vSavesLocked}</p>}
          {src.length > 0 && (<div className="wb-bars" aria-hidden="true" data-bars="">
            {src.map(([k, c]) => <div key={k} className="wb-bar"><span>{SOURCE_NAME[k] || k}</span><i style={{ width: `${(c / max) * 100}%` }} /><b>{c}</b></div>)}
          </div>)}
        </>)}
      </>)}
    </>
  );
}

// ── prices (vendors.rate_display: works at once, not drafted), what to fix ──────────────────────
function PricesPage({ back, showPrices, setPrices }: Ctx) {
  return (
    <>
      <Head t={WEB.prices} back={back} />
      <Row l={WEB.showPrices} right={<Toggle on={showPrices} label={WEB.showPrices} onChange={(v) => void setPrices(v)} />} />
      <p className="wb-note wide">{WEB.pNow}</p>
      <p className="wb-sent mute">{WEB.pOff}</p><p className="wb-sent mute">{WEB.pOn}</p>
      <div className="wb-adj acc"><p>{WEB.pSep}</p></div>
      <Row l={WEB.pChat} right={<a className="wb-lnk" href="/vendor/settings">{WEB.open}</a>} />
    </>
  );
}
function FixPage({ room, back }: Ctx) {
  const list = room.to_fix.packages_below_starting_price;
  return (
    <>
      <Head t={WEB.fix} back={back} />
      {list.length === 0 ? <p className="wb-sent mute">{WEB.fixD(0)}</p>
        : list.map((p, i) => <Row key={i} l={typeof p === 'string' ? p : (p.name || '')} d={WEB.fixBelowStart} />)}
    </>
  );
}

const CSS = `
.wb{padding-bottom:40px}
.wb-err{font:var(--wl-t4);color:var(--role-critical,#E0736B);margin:10px 0}
.wb-head{padding-top:2px}
.wb-back{font:var(--wl-t5);letter-spacing:.14em;text-transform:uppercase;color:var(--role-metal);background:none;border:0;padding:6px 0;min-height:32px}
.wb-titleline{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.wb-sub{font:var(--wl-t1);color:var(--atelier-ink);margin:0;min-width:0}
.wb-pill{flex:none;display:inline-flex;align-items:center;min-height:36px;padding:0 14px;border-radius:18px;border:0;background:var(--atelier-accent-text);color:var(--role-ink-deep);font:var(--wl-t4);margin-left:auto}
.wb-sect{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);padding:22px 0 6px;margin-top:10px}
.wb-sect.first{margin-top:6px}
.wb-note{font:var(--wl-t5);line-height:1.5;color:var(--atelier-ink-mute);padding-top:6px;margin:0;max-width:36ch}.wb-note.wide{max-width:none}
.wb-row{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:56px;padding:11px 0;border:0;border-bottom:.5px solid var(--atelier-card-border);width:100%;background:none;text-align:left;color:inherit}
.wb-rt{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
.wb-rl{font:var(--wl-t3);color:var(--atelier-ink)}.wb-rl.mute{color:var(--atelier-ink-mute)}
.wb-rd{font:var(--wl-t5);color:var(--atelier-ink-mute)}.wb-rd.st-rejected{color:var(--role-critical,#E0736B)}.wb-rd.st-approved{color:var(--atelier-accent-text)}
.wb-chev{font-size:16px;color:var(--atelier-ink-mute)}
.wb-win{position:relative;overflow:hidden;border:.5px solid var(--atelier-card-border);border-radius:3px;background:var(--atelier-card-bg);margin-top:12px}
.wb-win iframe{position:absolute;left:0;top:0;border:0;transform-origin:0 0;pointer-events:none}
.wb-under{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;padding-top:8px}
.wb-addr{font:var(--wl-t5);color:var(--atelier-ink-mute);flex:1 1 100%}
.wb-under .wb-seg{margin-left:auto}
.wb-seg{display:inline-flex;border:.5px solid var(--atelier-input-border);border-radius:3px;overflow:hidden;flex:none;margin-top:8px}
.wb-seg button{font:var(--wl-t4);padding:8px 12px;min-height:40px;background:transparent;border:0;color:var(--atelier-ink-mute)}
.wb-seg button.on{background:var(--atelier-accent-text);color:var(--role-ink-deep)}
.wb-seg.wide{display:flex;width:100%}.wb-seg.wide button{flex:1}
.wb-pend{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px;padding:12px 14px;border:.5px solid var(--atelier-card-border);border-radius:3px;background:var(--atelier-card-bg)}
.wb-pend>span,.wb-pendline{font:var(--wl-t4);color:var(--atelier-ink-soft);background:none;border:0;text-align:left;padding:0;min-height:40px}
.wb-pend>span,.wb-pendline{flex:1 1 auto;min-width:0}.wb-pend>.wl-btn{flex:none;white-space:nowrap}
.wb button,.wb-sheet button{flex-shrink:0}.wb-two>button,.wb-pend>.wb-pendline{flex-shrink:1;min-width:0}
.wb-plain{text-transform:none!important;letter-spacing:0!important;padding:10px 20px;min-width:100px}
.wb-done{display:flex;align-items:center;gap:10px;margin-top:14px;padding:12px 14px;border:.5px solid var(--atelier-card-border);border-radius:3px;font:var(--wl-t4);color:var(--atelier-ink-soft)}
.wb-done i{width:8px;height:8px;border-radius:50%;background:var(--role-positive,#6FC98C);flex:none}
.wb-soon{font:var(--wl-t4);padding:8px 12px;min-height:40px;border:.5px dashed var(--atelier-card-border);border-radius:3px;color:var(--atelier-ink-fade);background:transparent;flex:none}
.wb-block{display:block;width:100%;margin-top:12px;text-align:center}
.wb-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
.wb-card{border:.5px solid var(--atelier-card-border);border-radius:3px;overflow:hidden;background:var(--atelier-card-bg);padding:0;text-align:left;color:inherit;display:flex;flex-direction:column}
.wb-card.inuse{border-color:var(--atelier-accent-text);box-shadow:0 0 0 1px var(--atelier-accent-text) inset}
.wb-card .wb-win{margin:0;border:0;border-radius:0}
.wb-cb{padding:8px 10px 10px;display:flex;flex-direction:column;gap:6px}
.wb-cn{font:var(--wl-t3);color:var(--atelier-ink)}
.wb-tag{font:var(--wl-t5);color:var(--atelier-ink-mute)}.wb-tag.acc{color:var(--atelier-accent-text)}
.wb-sbtn{font:var(--wl-t4);min-height:44px;padding:0 12px;border:.5px solid var(--atelier-input-border);border-radius:3px;background:transparent;color:var(--atelier-accent-text);text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
.wb-sbtn[disabled]{color:var(--atelier-ink-fade);border-style:dashed;border-color:var(--atelier-card-border)}
.wb-pals{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}
.wb-pal{border:.5px solid var(--atelier-card-border);border-radius:3px;padding:8px;background:transparent;text-align:left;display:flex;flex-direction:column;gap:6px;color:inherit}
.wb-pal.on{border-color:var(--atelier-accent-text);box-shadow:0 0 0 1px var(--atelier-accent-text) inset}
.wb-sw{display:flex;height:34px;border-radius:2px;overflow:hidden}.wb-sw i{flex:1}
.wb-pal span{font:var(--wl-t5);color:var(--atelier-ink-soft)}
.wb-adj{margin-top:14px;padding:12px 14px;border-left:2px solid var(--role-metal);background:var(--atelier-card-bg);display:flex;flex-direction:column;gap:8px}.wb-adj.acc{border-left-color:var(--atelier-accent-text)}
.wb-adj b{font:var(--wl-t4);color:var(--atelier-ink);font-weight:500}
.wb-adj p{margin:0;font:var(--wl-t5);line-height:1.5;color:var(--atelier-ink-soft)}
.wb-lnk{font:var(--wl-t4);color:var(--atelier-accent-text);background:none;border:0;padding:10px 0;text-align:left;text-decoration:none;min-height:40px}
.wb-pair{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 0;border:0;border-bottom:.5px solid var(--atelier-card-border);width:100%;background:none;text-align:left;color:inherit}
.wb-pair .s1{display:block;font-size:24px;line-height:1.1;color:var(--atelier-ink)}
.wb-pair .s2{display:block;font:var(--wl-t5);color:var(--atelier-ink-mute);margin-top:4px}
.wb-radio{width:20px;height:20px;border-radius:50%;border:1.5px solid var(--atelier-ink-mute);flex:none;position:relative}
.wb-radio.on{border-color:var(--atelier-accent-text)}.wb-radio.on::after{content:"";position:absolute;inset:4px;border-radius:50%;background:var(--atelier-accent-text)}
.wb-check{width:22px;height:22px;border-radius:3px;border:1.5px solid var(--atelier-ink-mute);flex:none;position:relative}
.wb-check.on{background:var(--atelier-accent-text);border-color:var(--atelier-accent-text)}.wb-check.on::after{content:"";position:absolute;left:6px;top:2px;width:6px;height:11px;border:solid var(--role-ink-deep);border-width:0 2px 2px 0;transform:rotate(45deg)}
.wb-mono{display:flex;gap:12px;align-items:center;margin-top:10px}
.wb-mono .m{width:56px;height:56px;border-radius:50%;border:.5px solid var(--role-metal);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--atelier-ink);flex:none}
.wb-fi{width:100%;background:var(--atelier-input-bg);border:.5px solid var(--atelier-input-border);border-radius:3px;padding:11px 12px;font:var(--wl-t3);color:var(--atelier-ink);box-sizing:border-box}
.wb-fl{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);display:block;margin:14px 0 6px}
.wb-srow{display:grid;grid-template-columns:22px 1fr auto auto;align-items:center;gap:8px;min-height:60px;padding:8px 0;border-bottom:.5px solid var(--atelier-card-border)}
.wb-grip{color:var(--atelier-ink-fade);font-size:14px;letter-spacing:-2px;text-align:center;touch-action:none;cursor:grab;min-height:40px;display:flex;align-items:center;justify-content:center}
.wb-arw{display:flex;gap:2px}.wb-arw button{width:36px;height:40px;background:transparent;border:.5px solid var(--atelier-card-border);border-radius:2px;color:var(--atelier-ink-soft);font-size:13px}
.wb-arw button[disabled]{color:var(--atelier-ink-fade);opacity:.5}
.wb-tg{width:46px;height:27px;border-radius:14px;position:relative;background:var(--atelier-input-bg);border:.5px solid var(--atelier-card-border);flex:none;padding:0}
.wb-tg::after{content:"";position:absolute;top:2px;left:2px;width:21px;height:21px;border-radius:50%;background:var(--atelier-ink-fade)}
.wb-tg.on{background:var(--atelier-accent-text);border-color:var(--atelier-accent-text)}.wb-tg.on::after{left:auto;right:2px;background:var(--role-ink-deep)}
.wb-tg.lock{opacity:.45}
.wb-fixed{font:var(--wl-t5);color:var(--atelier-ink-fade);grid-column:3/5;text-align:right}
.wb-look .ph{position:relative;aspect-ratio:4/5;overflow:hidden;display:block}
.wb-look img{width:100%;height:100%;object-fit:cover;display:block}
.wb-wm{position:absolute;right:6px;bottom:5px;font:var(--wl-t5);letter-spacing:.12em;line-height:1;color:var(--role-metal);opacity:.78;text-shadow:0 0 3px var(--atelier-overlay);pointer-events:none}
.wb-badge{position:absolute;left:6px;top:6px;font:var(--wl-t5);padding:3px 6px;border-radius:2px;background:var(--atelier-overlay);color:var(--atelier-ink)}
.wb-prow{display:grid;grid-template-columns:22px 48px 1fr auto auto;gap:8px;align-items:center;padding:8px 0;border-bottom:.5px solid var(--atelier-card-border)}
.wb-prow .t{position:relative;width:48px;height:60px;border-radius:2px;overflow:hidden}.wb-prow .t img{width:100%;height:100%;object-fit:cover}
.wb-prow .wb-wm{right:2px;bottom:2px}
.wb-rm{font:var(--wl-t5);color:var(--atelier-ink-mute);background:none;border:0;min-height:40px;padding:0 4px}
.wb-focal{position:relative;display:block;width:100%;margin-top:10px;border:0;padding:0;border-radius:3px;overflow:hidden;aspect-ratio:4/3}
.wb-focal img{width:100%;height:100%;object-fit:cover;display:block}
.wb-focal .dot{position:absolute;width:28px;height:28px;margin:-14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.5)}
.wb-focal .dot::after{content:"";position:absolute;inset:10px;border-radius:50%;background:#fff}
.wb-li{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:.5px solid var(--atelier-card-border);font:var(--wl-t3);color:var(--atelier-ink)}
.wb-li span:last-child{font:var(--wl-t5);color:var(--atelier-ink-mute);align-self:center}
.wb-copybox{margin-top:12px;border:.5px solid var(--atelier-card-border);border-radius:3px;background:var(--atelier-input-bg);padding:12px;display:flex;flex-direction:column;gap:10px}
.wb-copybox code{font:var(--wl-t3);color:var(--atelier-ink);overflow-wrap:anywhere;font-family:inherit;user-select:all}
.wb-copybox .wl-btn{align-self:flex-start}
.wb-quote{padding:14px;border:.5px solid var(--atelier-card-border);border-radius:3px;margin-top:12px;background:var(--atelier-card-bg)}
.wb-quote p{margin:0;font:var(--wl-t3);line-height:1.55;color:var(--atelier-ink)}
.wb-quote .by{font:var(--wl-t5);color:var(--atelier-ink-mute);margin-top:8px}
.wb-two{display:flex;gap:8px;margin-top:12px}.wb-two>*{flex:1}
.wb-sent{font:var(--wl-t3);line-height:1.55;color:var(--atelier-ink);margin:12px 0 0}.wb-sent.mute{color:var(--atelier-ink-mute);font:var(--wl-t4)}
.wb-bars{margin-top:16px;display:flex;flex-direction:column;gap:10px}.wb-bars.sep{border-top:.5px solid var(--atelier-card-border);padding-top:14px}
.wb-bar{display:grid;grid-template-columns:92px 1fr 34px;gap:10px;align-items:center;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.wb-bar i{display:block;height:8px;border-radius:4px;background:var(--atelier-accent-text);min-width:4px}.wb-bar i.prev{background:var(--atelier-ink-fade)}
.wb-bar b{font:var(--wl-t5);color:var(--atelier-ink);text-align:right;font-weight:500;font-variant-numeric:tabular-nums}
.wb-colour{width:48px;height:40px;border:.5px solid var(--atelier-input-border);border-radius:3px;background:transparent;padding:2px;flex:none}
.wb-gap{margin-bottom:8px}.wb-two.tight{margin-top:0;margin-bottom:8px}.wb-lnk.danger{color:var(--role-critical,#E0736B)}
.wb-offer{margin-top:16px;padding:14px;border:.5px solid var(--atelier-card-border);border-radius:3px;background:var(--atelier-card-bg)}
.wb-offer ul{margin:8px 0 12px;padding-left:18px}.wb-offer li{font:var(--wl-t4);line-height:1.6;color:var(--atelier-ink-soft)}
.wb-chg{display:flex;flex-direction:column;gap:2px;padding:10px 0;border-bottom:.5px solid var(--atelier-card-border)}
.wb-chg b{font:var(--wl-t3);color:var(--atelier-ink);font-weight:400}.wb-chg span{font:var(--wl-t5);color:var(--atelier-ink-mute)}
.wb-scrim{position:fixed;inset:0;background:var(--atelier-overlay);z-index:40}
.wb-sheet{position:fixed;left:0;right:0;bottom:0;z-index:41;background:var(--role-sheet,var(--atelier-card-bg));border-top:.5px solid var(--atelier-card-border);border-radius:3px 3px 0 0;padding:20px var(--wl-gutter,20px) calc(28px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:12px;max-height:85dvh;overflow:auto}
.wb-sheet h3{margin:0;font:var(--wl-t2);color:var(--atelier-ink)}
.wb-sheet p{margin:0;font:var(--wl-t4);line-height:1.5;color:var(--atelier-ink-soft)}
.wb-danger{font:var(--wl-t4);min-height:44px;border:.5px solid var(--role-critical,#E0736B);color:var(--role-critical,#E0736B);background:transparent;border-radius:3px;width:100%}
.wb-dlink{font:var(--wl-t4);color:var(--role-critical,#E0736B);background:none;border:0;border-top:.5px solid var(--atelier-card-border);padding:14px 0;text-align:left;width:100%;margin-top:14px}
.wb-sheet .wb-dlink{margin-top:0}
`;
