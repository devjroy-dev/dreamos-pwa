'use client';
// app/vendor/(shell)/posts/ads/page.tsx · CE-46 · ADS-1 · cut 1 · THE ADS PAGE (R-46.10 to R-46.13).
//
// A control panel, not a service (R-46.12): every setting Meta provides for the messages ad, in the founder's words
// (lib/worklist/ads.ts, the one home; this file holds no vendor-facing string), and every ad she ran, managed here.
// The page draws what dream-os's doors answer (src/api/vendor/ads.js); it decides nothing about who sees her ad.
//
//   · the connect: a PRE-MINTED <a href> (no await between tap and navigation, F-44.235) and the iPhone line in iOS
//     standalone; the three gaps, each tap opening Meta's own screen, the re-read on return by itself (R-46.11).
//   · the draft's first screen (R-46.13 item 1): one sentence, the post WHOLE at its own aspect (never cropped; it gets
//     narrower when space is short), four rows with Change, Run above the Ask bar at 374.
//   · All settings (item 3): a full sheet; each row opens one question, the current answer marked.
//   · the confirm sheet echoes every setting; /run is sent the settings /prepare returned and the echo, nothing rebuilt.
//   · Your ads: every ad, its state in a sentence, and its sheet (pause, start again, amount, end date, end now, run
//     again as new, results by day), each change confirmed in words before it goes to Meta.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { getJson, postJson } from '@/lib/vendor/api/_base';
import { API, POSTS_HREF } from '@/lib/solutions/routes';
import { COPY, ROOM_ROWS } from '@/lib/solutions/copy';
import { ADS, fill } from '@/lib/worklist/ads';
import {
  type Door, type Gap, type Start, type Settings, type Media, type Prepared, type AdRow, type Place, type Pick, type Day,
  rs, rsBare, shortDate, days, whoLine, whereLine, placesLine, amountLine, datesLine, META_SCREENS,
} from '@/lib/worklist/adsWire';

const MINT_REFRESH_MS = 8 * 60 * 1000;
// The Posts room's name is ROOM_ROWS' own label (R-40.1), read by key so the back row and the room never disagree.
const ROOM_TITLE = ROOM_ROWS.find((r) => r.key === 'posts')?.label ?? '';
const isIosStandalone = () => typeof navigator !== 'undefined' && (navigator as Navigator & { standalone?: boolean }).standalone === true;

export default function AdsPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <AdsScreen />;
}

function AdsScreen() {
  const router = useRouter();
  const [door, setDoor] = useState<Door | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    getJson<Door>(API.ads()).then((d) => { setDoor(d); setFailed(false); }, () => setFailed(true));
  }, []);

  // R-46.11: back from Meta's screen, TDW re-reads by itself and advances; "Check again" is the quiet fallback.
  const recheck = useCallback(async () => {
    try { const r = await postJson<{ ok: boolean; gaps?: Gap }>(API.adsCheck(), {}); if (r && r.gaps) setDoor((d) => (d ? { ...d, gaps: r.gaps } : d)); } catch { /* quiet */ }
  }, []);
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === 'visible' && door && door.connected) void recheck(); };
    document.addEventListener('visibilitychange', onVis); window.addEventListener('focus', onVis);
    return () => { document.removeEventListener('visibilitychange', onVis); window.removeEventListener('focus', onVis); };
  }, [door, recheck]);

  let body: React.ReactNode;
  if (failed) body = <div className="ads-card"><p className="ads-state">{COPY.surfaceUnavailable}</p></div>;
  else if (!door) body = <div className="ads-card" aria-busy="true" />;
  // R-46.14: shut (flag.ads) or not configured, the page still opens with its real words; the action reads Coming soon.
  else if (!door.open || door.configured === false) body = <Connect live={false} />;
  else if (!door.connected) body = <Connect live />;
  else if (door.gaps && door.gaps.gap !== null) body = <Gaps gap={door.gaps} onCheck={recheck} />;
  else body = <Ready handle={door.gaps?.ig?.username || ''} onDisconnected={() => setDoor({ ...door, connected: false, gaps: undefined })} />;

  return (
    <WorklistShell title={ADS.card.label}>
      <div className="ads-room">
        <button type="button" className="ads-back" onClick={() => router.push(POSTS_HREF)}>
          <span aria-hidden="true">‹</span> {ROOM_TITLE}
        </button>
        {body}
      </div>
      <style>{ADS_CSS}</style>
    </WorklistShell>
  );
}

// ═══ THE CONNECT ════════════════════════════════════════════════════════════════════════════════════════════════
function Connect({ live }: { live: boolean }) {
  const [href, setHref] = useState<string | null>(null);
  const ios = isIosStandalone();   // client-only: this page renders after the session loads
  const mint = useCallback(() => {
    getJson<{ ok: boolean; authorize_url?: string }>(API.adsAuthorize()).then((r) => setHref(r && r.authorize_url ? r.authorize_url : null), () => setHref(null));
  }, []);
  useEffect(() => {
    if (!live) return undefined;   // shut: no request leaves (R-46.14)
    mint();
    const t = window.setInterval(() => { if (document.visibilityState === 'visible') mint(); }, MINT_REFRESH_MS);
    return () => window.clearInterval(t);
  }, [mint, live]);
  return (
    <div className="ads-card">
      <p className="ads-state">{ADS.connect.body1}</p>
      <p className="ads-state ads-gap">{ADS.connect.body2}</p>
      {!live
        ? <button type="button" className="ads-btn ads-primary ads-gap" disabled aria-disabled="true" data-soon>{ADS.comingSoon}</button>
        : href
          ? <a className="ads-btn ads-primary ads-gap" href={href}>{ADS.connect.cta}</a>
          : <button type="button" className="ads-btn ads-primary ads-gap" onClick={() => mint()}>{ADS.connect.cta}</button>}
      {live && ios && href ? <p className="ads-foot">{ADS.connect.iphone}</p> : null}
      <p className="ads-state ads-gap">{ADS.gaps.intro}</p>
    </div>
  );
}

// ═══ THE THREE GAPS (R-46.11) ═══════════════════════════════════════════════════════════════════════════════════
function Gaps({ gap, onCheck }: { gap: Gap; onCheck: () => void }) {
  const open = (u: string) => { window.open(u, '_blank', 'noopener,width=480,height=780'); };
  let line = ''; let tap = ''; let url = '';
  if (gap.gap === 'scopes' || gap.gap === 'expired') { line = gap.gap === 'scopes' ? ADS.gaps.scopes : ADS.connect.body1; }
  else if (gap.gap === 'page') { line = ADS.gaps.page; tap = ADS.gaps.pageTap; url = META_SCREENS.page; }
  else if (gap.gap === 'link') { line = fill(ADS.gaps.link, { page: gap.page?.name || '', ig: gap.ig?.username || '' }); tap = ADS.gaps.linkTap; url = META_SCREENS.link; }
  else if (gap.gap === 'ad_account') {
    if (gap.inactive) { line = fill(ADS.gaps.inactive, { name: gap.account?.name || '' }); tap = ADS.gaps.inactiveTap; }
    else { line = ADS.gaps.account; tap = ADS.gaps.accountTap; }
    url = META_SCREENS.account;
  } else line = COPY.surfaceUnavailable;
  if (gap.gap === 'scopes' || gap.gap === 'expired') return <Connect live />;
  return (
    <div className="ads-card">
      <p className="ads-state">{line}</p>
      {tap ? <button type="button" className="ads-btn ads-primary ads-gap" onClick={() => open(url)}>{tap}</button> : null}
      <button type="button" className="ads-quiet" onClick={onCheck}>{ADS.gaps.again}</button>
    </div>
  );
}

// ═══ READY: THE DRAFT, THE SETTINGS, THE CONFIRM, YOUR ADS ═══════════════════════════════════════════════════════
function Ready({ handle, onDisconnected }: { handle: string; onDisconnected: () => void }) {
  const [start, setStart] = useState<Start | null>(null);
  const [s, setS] = useState<Settings | null>(null);
  const [posts, setPosts] = useState<Media[]>([]);
  const [sheet, setSheet] = useState<null | 'all' | { q: string }>(null);
  const [prep, setPrep] = useState<Prepared | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [list, setList] = useState<AdRow[]>([]);
  const [manage, setManage] = useState<AdRow | null>(null);

  const loadList = useCallback(async () => { try { const r = await getJson<{ ok: boolean; ads?: AdRow[] }>(API.adsList()); setList(r && r.ads ? r.ads : []); } catch { /* quiet */ } }, []);
  useEffect(() => {
    getJson<Start>(API.adsStart()).then((st) => { setStart(st); if (st && st.settings) setS(st.settings); }, () => setStart({ ok: false }));
    getJson<{ ok: boolean; posts?: Media[] }>(API.adsPosts()).then((p) => setPosts(p && p.posts ? p.posts : []), () => { /* the draft still stands */ });
    getJson<{ ok: boolean; ads?: AdRow[] }>(API.adsList()).then((r) => setList(r && r.ads ? r.ads : []), () => { /* quiet */ });
  }, []);

  if (!start) return <div className="ads-card" aria-busy="true" />;
  if (!start.ok || !s) return <div className="ads-card"><p className="ads-state">{COPY.surfaceUnavailable}</p></div>;
  const media = posts.find((m) => m.id === s.media_id) || start.suggestion || null;
  const min = start.facts?.minDailyMinor || null;

  const why = media && start.suggestion && media.id === start.suggestion.id
    ? (media.insights ? fill(ADS.draft.whyShort, { saves: media.insights.saves.toLocaleString('en-IN'), reach: media.insights.reach.toLocaleString('en-IN') })
      : fill(ADS.draft.whyLikes, { post: firstLine(media.caption), date: shortDate(media.at), likes: media.likes, comments: media.comments }))
    : null;

  async function onRun() {
    setNotice(null);
    try {
      const r = await postJson<Prepared>(API.adsPrepare(), { settings: s });
      if (r && r.errors && r.errors.length) { setNotice(r.errors[0]); return; }
      if (r && r.confirm) setPrep(r);
    } catch { setNotice(COPY.surfaceUnavailable); }
  }
  async function onConfirm() {
    if (!prep) return;
    try {
      const r = await postJson<{ ok: boolean; ad?: { id: string; status: string }; error?: string }>(API.adsRun(), { settings: prep.settings, confirm: prep.confirm });
      setPrep(null);
      if (!r || !r.ok) { setNotice((r && r.error) || ADS.confirm.changed); return; }
      await loadList();
    } catch { setNotice(COPY.surfaceUnavailable); }
  }

  return (
    <>
      <div className="ads-card ads-draft">
        {/* R-46.13 as ruled (a): the post WHOLE on the left at a fixed width, its own aspect; the one sentence beside it. */}
        <div className="ads-lead">
          {media && media.url ? <Preview media={media} handle={handle} /> : null}
          {why ? <p className="ads-body ads-why">{why}</p> : null}
        </div>
        <Row k={ADS.draft.rows.who} v={whoLine(s)} onChange={() => setSheet({ q: 'places' })} />
        <Row k={ADS.draft.rows.where} v={whereLine(s)} onChange={() => setSheet({ q: 'instagram' })} />
        <Row k={ADS.draft.rows.amount} v={amountLine(s)} onChange={() => setSheet({ q: 'amount' })} />
        <Row k={ADS.draft.rows.dates} v={datesLine(s)} onChange={() => setSheet({ q: 'end' })} />
        <button type="button" className="ads-btn ads-primary ads-run" data-run onClick={() => void onRun()}>{ADS.draft.run}</button>
        <button type="button" className="ads-btn ads-ghost ads-two" onClick={() => setSheet('all')}>{ADS.draft.allSettings}</button>
        {min ? <p className="ads-foot">{fill(ADS.draft.minimum, { min: rsBare(min) })}</p> : null}
        {notice ? <p className="ads-foot" role="alert">{notice}</p> : null}
      </div>

      {list.length ? (
        <div className="ads-card">
          <span className="ads-lbl">{ADS.yours.label}</span>
          {list.map((a) => (
            <button type="button" key={a.id} className="ads-adrow" onClick={() => setManage(a)}>
              <span className="ads-adhead">
                {a.settings && a.settings.post && a.settings.post.url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img className="ads-adthumb" src={a.settings.post.url} alt="" /> : null}
                <span className="ads-who">{(a.settings && a.settings.post && a.settings.post.caption_line) || shortDate(a.created_at)}</span>
              </span>
              <span className="ads-body">{adSentence(a)}</span>
            </button>
          ))}
        </div>
      ) : null}

      {/* The approved S6 control (ADS.disconnect): the connection row goes; her ads on Meta are hers and untouched. */}
      <button type="button" className="ads-quiet" data-disconnect onClick={() => {
        postJson<{ ok: boolean }>(API.adsDisconnect(), {}).then((r) => { if (r && r.ok) onDisconnected(); }, () => setNotice(COPY.surfaceUnavailable));
      }}>{ADS.disconnect}</button>

      {sheet === 'all' ? <AllSettings s={s} posts={posts} onOpen={(q) => setSheet({ q })} onClose={() => setSheet(null)} /> : null}
      {sheet && sheet !== 'all' ? <Question q={sheet.q} s={s} posts={posts} onDone={(n) => { setS(n); setSheet(null); }} onBack={() => setSheet(null)} /> : null}
      {prep && prep.settings ? <ConfirmSheet p={prep} media={media} onBack={() => setPrep(null)} onGo={() => void onConfirm()} /> : null}
      {manage ? <ManageSheet ad={manage} onClose={() => setManage(null)} onDone={async (draft) => { setManage(null); if (draft) setS(draft); await loadList(); }} /> : null}
    </>
  );
}

const firstLine = (c: string) => (c || '').split(/[.\n]/)[0].slice(0, 60);

function adSentence(a: AdRow): string {
  const d: Day[] = a.last_insights || [];
  const reach = d.reduce((n, x) => n + x.reach, 0); const enq = d.reduce((n, x) => n + x.conversations, 0);
  const spentMinor = Math.round(d.reduce((n, x) => n + x.spend, 0) * 100);
  const v = { until: shortDate(a.ends_at), date: shortDate(a.ended_at || a.ends_at), reach: reach.toLocaleString('en-IN'), enquiries: enq,
    spent: rsBare(spentMinor), total: rsBare(a.total_minor), each: enq ? rsBare(Math.round(spentMinor / enq)) : '0' };
  if (a.status === 'running') return fill(ADS.yours.running, v);
  if (a.status === 'paused') return fill(ADS.yours.paused, v);
  if (a.status === 'ended') return fill(ADS.yours.ended, v);
  if (a.status === 'refused') return COPY.surfaceUnavailable;
  return ADS.running.reviewing;
}

// ═══ THE PREVIEW: THE POST WHOLE AT ITS OWN ASPECT (R-46.13) ═══════════════════════════════════════════════════════
// The image is never cropped: height fills the room the draft leaves, width follows the picture's own ratio, and the
// frame (the handle line, "Sponsored" on its own line, Send message) follows the picture's width and cannot widen it.
function Preview({ media, handle }: { media: Media; handle: string }) {
  return (
    <div className="ads-prev" data-preview>
      <div className="ads-prevhead"><span className="ads-dot" aria-hidden="true" /><span className="ads-handle">{handle}</span><span className="ads-sponsored">{ADS.preview.sponsored}</span></div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-media src={media.url || ''} alt="" className="ads-media" />
      <div className="ads-prevfoot">{ADS.preview.send}</div>
    </div>
  );
}


function Row({ k, v, onChange }: { k: string; v: string; onChange: () => void }) {
  return (
    <button type="button" className="ads-row" onClick={onChange}>
      <span className="ads-rowk">{k}</span>
      <span className="ads-rowv">{v} <span className="ads-change">{ADS.draft.change}</span></span>
    </button>
  );
}

// ═══ ALL SETTINGS (a full sheet; each row opens one question) ════════════════════════════════════════════════════
function AllSettings({ s, posts, onOpen, onClose }: { s: Settings; posts: Media[]; onOpen: (q: string) => void; onClose: () => void }) {
  const T = ADS.settings; const Q = ADS.q;
  const r = (k: string, v: string, q: string) => (
    <button type="button" className="ads-srow" onClick={() => onOpen(q)} key={q}><span className="ads-rowk">{k}</span><span className="ads-rowv">{v} <span aria-hidden="true">›</span></span></button>);
  const pl = s.placements;
  const post = posts.find((m) => m.id === s.media_id);
  return (
    <div className="ads-full" role="dialog" aria-modal="true">
      <button type="button" className="ads-back" onClick={onClose}><span aria-hidden="true">‹</span> {ADS.draft.allSettings}</button>
      <span className="ads-lbl">{T.groups.who}</span>
      {r(T.who.places, s.places.map((p) => (p.radius_km ? fill(ADS.fmt.placeKm, { name: p.name.split(',')[0], km: p.radius_km }) : p.name.split(',')[0])).join(', '), 'places')}
      {r(T.who.leaveOut, s.exclude.length ? s.exclude.map((p) => p.name.split(',')[0]).join(', ') : Q.none, 'exclude')}
      {r(T.who.age, fill(ADS.fmt.ages, { min: s.age_min, max: s.age_max }), 'age')}
      {r(T.who.gender, s.genders.length ? (s.genders[0] === 1 ? Q.gender.men : Q.gender.women) : Q.gender.all, 'gender')}
      {r(T.who.languages, s.locales.length ? String(s.locales.length) : Q.any, 'languages')}
      {r(T.who.interests, s.interests.length + s.life_events.length ? [...s.interests, ...s.life_events].map((i) => i.name).join(', ') : Q.none, 'interests')}
      {r(T.who.widen, s.advantage_audience ? Q.on : Q.off, 'widen')}
      <span className="ads-lbl">{T.groups.where}</span>
      {r(T.where.instagram, pl === 'auto' ? T.where.auto : pl.instagram.map((x) => Q.positions[x as keyof typeof Q.positions] || x).join(', ') || Q.off, 'instagram')}
      {r(T.where.facebook, pl === 'auto' ? T.where.auto : pl.facebook.map((x) => Q.positions[x as keyof typeof Q.positions] || x).join(', ') || Q.off, 'facebook')}
      {r(T.where.auto, pl === 'auto' ? Q.on : Q.off, 'auto')}
      <span className="ads-lbl">{T.groups.money}</span>
      {r(T.money.amount, s.budget.kind === 'daily' ? fill(ADS.fmt.dailyShort, { daily: rs(s.budget.minor) }) : Q.off, 'amount')}
      {r(T.money.total, s.budget.kind === 'lifetime' ? rs(s.budget.minor) : Q.off, 'total')}
      {r(T.money.start, shortDate(s.start), 'start')}
      {r(T.money.end, shortDate(s.end), 'end')}
      {r(T.money.more, fill(ADS.fmt.spendRow, { label: T.money.spend, value: Q.spend[s.bid.strategy as keyof typeof Q.spend] || '' }), 'spend')}
      <span className="ads-lbl">{T.groups.see}</span>
      {r(T.see.post, post ? firstLine(post.caption) : '', 'post')}
      {r(T.see.greeting, s.welcome.text || Q.none, 'greeting')}
      {r(T.see.questions, s.welcome.icebreakers.length ? String(s.welcome.icebreakers.length) : Q.none, 'questions')}
      <p className="ads-foot">{T.lists}</p>
    </div>
  );
}

// ═══ ONE QUESTION AT A TIME (the current answer marked; Done returns the changed settings) ═══════════════════════
function Question({ q, s, posts, onDone, onBack }: { q: string; s: Settings; posts: Media[]; onDone: (n: Settings) => void; onBack: () => void }) {
  const Q = ADS.q; const T = ADS.settings;
  const [n, setN] = useState<Settings>(() => JSON.parse(JSON.stringify(s)));
  const [text, setText] = useState('');
  const [found, setFound] = useState<(Place | Pick)[]>([]);
  const timer = useRef<number | null>(null);
  const kind = q === 'places' || q === 'exclude' ? 'places' : q === 'languages' ? 'languages' : q === 'interests' ? 'interests' : null;
  useEffect(() => {
    if (!kind || !text.trim()) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try { const r = await getJson<{ ok: boolean; options?: (Place | Pick)[] }>(API.adsSearch(kind, text.trim())); setFound(r && r.options ? r.options : []); } catch { setFound([]); }
    }, 300);
  }, [text, kind]);
  const shown = text.trim() ? found : [];
  const pl = n.placements === 'auto' ? { instagram: [] as string[], facebook: [] as string[] } : n.placements;

  const title: Record<string, string> = { places: Q.placesQ, exclude: Q.leaveOutQ, age: Q.ageQ, gender: T.who.gender, languages: T.who.languages,
    interests: T.who.interests, widen: T.who.widen, instagram: T.where.instagram, facebook: T.where.facebook, auto: T.where.auto,
    amount: T.money.amount, total: T.money.total, start: T.money.start, end: T.money.end, spend: T.money.spend, post: T.see.post,
    greeting: T.see.greeting, questions: T.see.questions };
  const mark = (on: boolean) => <span className={`ads-mark${on ? ' ads-on' : ''}`} aria-hidden="true">{on ? '✓' : ''}</span>;
  const opt = (label: string, sub: string | null, on: boolean, act: () => void, key: string) => (
    <button type="button" className="ads-opt" onClick={act} key={key} aria-pressed={on}><span><span className="ads-optt">{label}</span>{sub ? <span className="ads-note">{sub}</span> : null}</span>{mark(on)}</button>);
  const toggleList = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  let inner: React.ReactNode = null;
  if (q === 'places' || q === 'exclude') {
    const list = q === 'places' ? n.places : n.exclude;
    const set = (next: Place[]) => setN({ ...n, [q === 'places' ? 'places' : 'exclude']: next });
    inner = (<>
      <input className="ads-input" placeholder={Q.placesHint} value={text} onChange={(e) => setText(e.target.value)} />
      {list.map((p) => (<div key={p.key}>
        {opt(p.name.split(',')[0], p.name.split(',').slice(1).join(',').trim() || null, true, () => set(list.filter((x) => x.key !== p.key)), `on-${p.key}`)}
        {q === 'places' && p.type === 'city' ? <div className="ads-chips">{[10, 25, 50, 80].map((km) => (
          <button type="button" key={km} className={`ads-chip${p.radius_km === km ? ' ads-chipon' : ''}`} onClick={() => set(list.map((x) => (x.key === p.key ? { ...x, radius_km: km } : x)))}>{fill(ADS.fmt.km, { km })}</button>))}</div> : null}
      </div>))}
      {(shown as Place[]).filter((f) => !list.some((x) => x.key === f.key)).map((f) => opt(f.name.split(',')[0], f.name.split(',').slice(1).join(',').trim() || null, false,
        () => { set([...list, { ...f, radius_km: q === 'places' && f.type === 'city' ? 25 : undefined }]); setText(''); }, `f-${f.key}`))}
    </>);
  } else if (q === 'age') {
    const ages = Array.from({ length: 48 }, (_, i) => 18 + i);
    inner = (<div className="ads-two">
      <label className="ads-field"><span className="ads-note">{Q.ageFrom}</span><select className="ads-input" value={n.age_min} onChange={(e) => setN({ ...n, age_min: Number(e.target.value) })}>{ages.map((a) => <option key={a} value={a}>{a}</option>)}</select></label>
      <label className="ads-field"><span className="ads-note">{Q.ageTo}</span><select className="ads-input" value={n.age_max} onChange={(e) => setN({ ...n, age_max: Number(e.target.value) })}>{ages.map((a) => <option key={a} value={a}>{a}</option>)}</select></label>
    </div>);
  } else if (q === 'gender') {
    inner = (<>{opt(Q.gender.all, null, !n.genders.length, () => setN({ ...n, genders: [] }), 'g0')}{opt(Q.gender.men, null, n.genders[0] === 1, () => setN({ ...n, genders: [1] }), 'g1')}{opt(Q.gender.women, null, n.genders[0] === 2, () => setN({ ...n, genders: [2] }), 'g2')}</>);
  } else if (q === 'languages' || q === 'interests') {
    const hint = q === 'languages' ? Q.languagesHint : Q.interestsHint;
    const chosen: Pick[] = q === 'languages' ? n.locales.map((id) => ({ id: String(id), name: String(id) })) : n.interests;
    inner = (<>
      <input className="ads-input" placeholder={hint} value={text} onChange={(e) => setText(e.target.value)} />
      {chosen.map((c) => opt(c.name, null, true, () => (q === 'languages' ? setN({ ...n, locales: n.locales.filter((x) => String(x) !== c.id) }) : setN({ ...n, interests: n.interests.filter((x) => x.id !== c.id) })), `c-${c.id}`))}
      {(shown as Pick[]).filter((f) => !chosen.some((c) => c.id === String(f.id))).map((f) => opt(f.name, null, false,
        () => { if (q === 'languages') setN({ ...n, locales: [...n.locales, Number(f.id)] }); else setN({ ...n, interests: [...n.interests, { id: String(f.id), name: f.name }] }); setText(''); }, `f-${f.id}`))}
    </>);
  } else if (q === 'widen' || q === 'auto') {
    const on = q === 'widen' ? n.advantage_audience : n.placements === 'auto';
    const set = (v: boolean) => (q === 'widen' ? setN({ ...n, advantage_audience: v }) : setN({ ...n, placements: v ? 'auto' : { instagram: ['stream', 'story', 'reels'], facebook: [] } }));
    inner = (<>{opt(Q.on, null, on, () => set(true), 'on')}{opt(Q.off, null, !on, () => set(false), 'off')}</>);
  } else if (q === 'instagram' || q === 'facebook') {
    const keys = q === 'instagram' ? ['stream', 'story', 'reels', 'explore', 'explore_home', 'profile_feed'] : ['feed', 'story', 'facebook_reels', 'marketplace', 'video_feeds', 'search'];
    const cur = pl[q];
    inner = <>{keys.map((k) => opt(Q.positions[k as keyof typeof Q.positions] || k, null, cur.includes(k), () => setN({ ...n, placements: { ...pl, [q]: toggleList(cur, k) } }), k))}</>;
  } else if (q === 'amount' || q === 'total') {
    const isTotal = q === 'total';
    inner = (<label className="ads-field"><span className="ads-note">{isTotal ? Q.totalHint : Q.amountHint}</span>
      <input className="ads-input" inputMode="numeric" value={n.budget.minor ? String(Math.round(n.budget.minor / 100)) : ''}
        onChange={(e) => setN({ ...n, budget: { kind: isTotal ? 'lifetime' : 'daily', minor: Number(e.target.value.replace(/[^0-9]/g, '')) * 100 || null } })} /></label>);
  } else if (q === 'start' || q === 'end') {
    const v = (iso: string) => new Date(Date.parse(iso) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    inner = <input className="ads-input" type="datetime-local" value={v(n[q])} onChange={(e) => setN({ ...n, [q]: new Date(e.target.value).toISOString() })} />;
  } else if (q === 'spend') {
    inner = (<>{Object.entries(Q.spend).map(([k, label]) => opt(label, null, n.bid.strategy === k, () => setN({ ...n, bid: { strategy: k, amount_minor: k === 'LOWEST_COST_WITHOUT_CAP' ? null : n.bid.amount_minor || null } }), k))}
      {n.bid.strategy !== 'LOWEST_COST_WITHOUT_CAP' ? <label className="ads-field"><span className="ads-note">{Q.capHint}</span><input className="ads-input" inputMode="numeric"
        value={n.bid.amount_minor ? String(Math.round(n.bid.amount_minor / 100)) : ''} onChange={(e) => setN({ ...n, bid: { ...n.bid, amount_minor: Number(e.target.value.replace(/[^0-9]/g, '')) * 100 || null } })} /></label> : null}</>);
  } else if (q === 'post') {
    inner = <PostChooser posts={posts} current={n.media_id} onPick={(id) => setN({ ...n, media_id: id })} />;
  } else if (q === 'greeting') {
    inner = <textarea className="ads-input" rows={3} maxLength={300} placeholder={Q.greetingHint} value={n.welcome.text} onChange={(e) => setN({ ...n, welcome: { ...n.welcome, text: e.target.value } })} />;
  } else if (q === 'questions') {
    const qs = [0, 1, 2].map((i) => n.welcome.icebreakers[i] || '');
    inner = <>{qs.map((v, i) => <input key={i} className="ads-input ads-gapsm" maxLength={80} placeholder={Q.questionHint} value={v}
      onChange={(e) => { const next = qs.slice(); next[i] = e.target.value; setN({ ...n, welcome: { ...n.welcome, icebreakers: next.filter((x) => x.trim()) } }); }} />)}</>;
  }

  return (
    <div className="ads-over" role="dialog" aria-modal="true">
      <div className="ads-sheet">
        <p className="ads-q">{title[q] || ''}</p>
        {inner}
        <div className="ads-two ads-gap"><button type="button" className="ads-btn ads-ghost" onClick={onBack}>{Q.back}</button><button type="button" className="ads-btn ads-primary" onClick={() => onDone(n)}>{Q.done}</button></div>
      </div>
    </div>
  );
}

function PostChooser({ posts, current, onPick }: { posts: Media[]; current: string | null; onPick: (id: string) => void }) {
  const Q = ADS.q;
  const [f, setF] = useState<'all' | 'posts' | 'reels'>('all');
  const isReel = (m: Media) => m.type === 'VIDEO' || m.type === 'REELS';
  const shown = posts.filter((m) => (f === 'all' ? true : f === 'reels' ? isReel(m) : !isReel(m)));
  return (<>
    <div className="ads-chips">{(['all', 'posts', 'reels'] as const).map((k) => <button type="button" key={k} className={`ads-chip${f === k ? ' ads-chipon' : ''}`} onClick={() => setF(k)}>{Q.postFilter[k]}</button>)}</div>
    <div className="ads-grid">{shown.map((m) => (
      <button type="button" key={m.id} className={`ads-tile${m.id === current ? ' ads-tileon' : ''}`} disabled={!m.eligible} onClick={() => onPick(m.id)} aria-pressed={m.id === current}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {m.url ? <img src={m.url} alt="" /> : null}
        {isReel(m) ? <span className="ads-reel">{Q.reel}</span> : null}
        {!m.eligible ? <span className="ads-note ads-inel">{Q.notEligible}</span> : null}
      </button>))}</div>
  </>);
}

// ═══ THE CONFIRM SHEET: EVERY SETTING ECHOED, THE POST WHOLE ═════════════════════════════════════════════════════
function ConfirmSheet({ p, media, onBack, onGo }: { p: Prepared; media: Media | null; onBack: () => void; onGo: () => void }) {
  const s = p.settings as Settings; const C = ADS.confirm;
  const kv = (k: string, v: string) => <div className="ads-kv" key={k}><span className="ads-rowk">{k}</span><span className="ads-rowv">{v}</span></div>;
  return (
    <div className="ads-over" role="dialog" aria-modal="true">
      <div className="ads-sheet">
        <p className="ads-q">{C.q}</p>
        <p className="ads-body ads-gapsm">{fill(C.body, { total: rsBare(p.total_minor) })}</p>
        {kv(C.rows.post, media ? firstLine(media.caption) : '')}
        {kv(C.rows.who, fill(ADS.fmt.confirmWho, { places: placesLine(s), min: s.age_min, max: s.age_max }) + (s.genders.length ? `, ${s.genders[0] === 1 ? ADS.q.gender.men : ADS.q.gender.women}` : ''))}
        {kv(C.rows.where, whereLine(s))}
        {kv(C.rows.amount, s.budget.kind === 'daily' ? fill(ADS.fmt.confirmAmountDaily, { daily: rs(s.budget.minor), days: days(s), total: rs(p.total_minor) }) : fill(ADS.fmt.confirmAmountTotal, { total: rs(p.total_minor), days: days(s) }))}
        {kv(C.rows.dates, datesLine(s))}
        {s.welcome.text ? kv(C.rows.greeting, s.welcome.text) : null}
        <div className="ads-two ads-gap"><button type="button" className="ads-btn ads-ghost" onClick={onBack}>{C.back}</button><button type="button" className="ads-btn ads-primary" onClick={onGo}>{C.run}</button></div>
      </div>
    </div>
  );
}

// ═══ ONE AD'S SHEET: EVERY CHANGE CONFIRMED IN WORDS BEFORE IT GOES TO META ══════════════════════════════════════
function ManageSheet({ ad, onClose, onDone }: { ad: AdRow; onClose: () => void; onDone: (draft?: Settings) => void }) {
  const Y = ADS.yours;
  const [step, setStep] = useState<null | { action: string; values: Record<string, unknown>; confirm: string; line: string; body: string }>(null);
  const [amount, setAmount] = useState('');
  const [results, setResults] = useState<Day[] | null>(null);
  async function ask(action: string, values: Record<string, unknown> = {}) {
    const r = await postJson<{ ok: boolean; values?: Record<string, unknown>; confirm?: string; errors?: string[] }>(API.adsManagePrepare(), { id: ad.id, action, values });
    if (!r || !r.confirm) return;
    let line = ''; let body = '';
    if (action === 'budget') { line = fill(Y.amountQ, { new: rsBare(Number(values.minor)) }); body = fill(Y.amountBody, { new: rsBare(Number(values.minor)), old: rsBare(ad.settings.budget.minor), end: shortDate(ad.ends_at) }); }
    else line = ({ pause: Y.actions.pause, resume: Y.actions.resume, end_now: Y.actions.endNow, end_date: Y.actions.end, duplicate: Y.actions.again } as Record<string, string>)[action] + '?';
    setStep({ action, values: r.values || {}, confirm: r.confirm, line, body });
  }
  async function go() {
    if (!step) return;
    const r = await postJson<{ ok: boolean; draft?: Settings }>(API.adsManage(), { id: ad.id, action: step.action, values: step.values, confirm: step.confirm });
    onDone(r && r.draft ? r.draft : undefined);
  }
  async function showResults() { try { const r = await getJson<{ ok: boolean; ad?: { by_day?: Day[] } }>(API.adsResults(ad.id)); setResults(r && r.ad && r.ad.by_day ? r.ad.by_day : []); } catch { setResults([]); } }
  return (
    <div className="ads-over" role="dialog" aria-modal="true">
      <div className="ads-sheet">
        {step ? (<>
          <p className="ads-q">{step.line}</p>{step.body ? <p className="ads-body ads-gapsm">{step.body}</p> : null}
          <div className="ads-two ads-gap"><button type="button" className="ads-btn ads-ghost" onClick={() => setStep(null)}>{ADS.confirm.back}</button><button type="button" className="ads-btn ads-primary" onClick={() => void go()}>{Y.changeIt}</button></div>
        </>) : results ? (<>
          <p className="ads-q">{Y.actions.results}</p>
          {results.map((d) => <div className="ads-kv" key={d.day}><span className="ads-rowk">{shortDate(d.day)}</span><span className="ads-rowv">{fill(ADS.fmt.resultDay, { reach: d.reach.toLocaleString('en-IN'), enquiries: d.conversations, spent: rs(Math.round(d.spend * 100)) })}</span></div>)}
          <button type="button" className="ads-btn ads-ghost ads-gap" onClick={() => setResults(null)}>{ADS.q.back}</button>
        </>) : (<>
          <p className="ads-q">{adSentence(ad)}</p>
          {ad.status === 'running' ? <button type="button" className="ads-btn ads-ghost ads-gapsm" onClick={() => void ask('pause')}>{Y.actions.pause}</button> : null}
          {ad.status === 'paused' ? <button type="button" className="ads-btn ads-ghost ads-gapsm" onClick={() => void ask('resume')}>{Y.actions.resume}</button> : null}
          {ad.status === 'running' || ad.status === 'paused' ? (<>
            <div className="ads-two ads-gapsm"><input className="ads-input" inputMode="numeric" placeholder={ADS.q.amountHint} value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))} />
              <button type="button" className="ads-btn ads-ghost" disabled={!amount} onClick={() => void ask('budget', { minor: Number(amount) * 100 })}>{Y.actions.amount}</button></div>
            <button type="button" className="ads-btn ads-ghost ads-gapsm" onClick={() => void ask('end_now')}>{Y.actions.endNow}</button>
          </>) : null}
          <button type="button" className="ads-btn ads-ghost ads-gapsm" onClick={() => void ask('duplicate')}>{Y.actions.again}</button>
          <button type="button" className="ads-btn ads-primary ads-gapsm" onClick={() => void showResults()}>{Y.actions.results}</button>
          <button type="button" className="ads-quiet" onClick={onClose}>{ADS.q.back}</button>
        </>)}
      </div>
    </div>
  );
}

// Every value an --atelier-* or --role-* token (R-41.140). No apostrophe, no backtick (a template literal, R-40.57).
const ADS_CSS = `
.ads-room{padding-top:0;padding-bottom:24px;--ads-pw:120px}   /* the fixed width of the post, ruling (a) */   /* the room head of the shell (FE-4) now gives the top its space */
.ads-back{display:flex;align-items:center;gap:8px;background:transparent;border:0;padding:0;margin:-8px 0 4px;min-height:44px;color:var(--atelier-accent-text);font:var(--wl-t3);cursor:pointer}
.ads-back span{font-size:1.375rem;line-height:1}
.ads-card{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:12px;padding:12px 16px;margin-bottom:var(--wl-step);min-height:20px}
.ads-draft{display:flex;flex-direction:column;padding-top:12px;padding-bottom:12px}
.ads-state{font:var(--wl-t3);color:var(--atelier-ink-soft);line-height:1.5;margin:0}
.ads-body{font:var(--wl-t3);color:var(--atelier-ink);line-height:1.5;margin:0 0 8px}
.ads-foot{font:var(--wl-t5);color:var(--atelier-ink-dim);margin:12px 0 0;line-height:1.5}
.ads-lbl{display:block;font:var(--wl-t5);letter-spacing:.07em;text-transform:uppercase;color:var(--atelier-label);margin:16px 0 4px}
.ads-gap{margin-top:12px}.ads-gapsm{margin-top:8px}
.ads-lead{display:flex;gap:12px;align-items:flex-start;margin:0 0 4px}
.ads-why{margin:0;flex:1 1 auto;min-width:0}
.ads-prev{flex:none;width:var(--ads-pw);display:flex;flex-direction:column}
.ads-prev>*{max-width:100%}
.ads-media{display:block;width:var(--ads-pw);height:auto;background:var(--atelier-section-bg)}
.ads-prev{position:relative}
.ads-prevhead,.ads-prevfoot{box-sizing:border-box;width:var(--ads-pw);border:.5px solid var(--atelier-card-border);background:var(--atelier-section-bg);padding:4px 8px;font:var(--wl-t5)}
.ads-prevhead{display:grid;grid-template-columns:16px 1fr;column-gap:8px;border-bottom:0;border-radius:12px 3px 0 0}
.ads-dot{grid-row:1/3;width:16px;height:16px;border-radius:50%;background:var(--role-metal);align-self:center}
.ads-handle{color:var(--atelier-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.ads-sponsored{color:var(--atelier-ink-soft);font-size:.92em}
.ads-prevfoot{border-top:0;border-radius:0 0 3px 3px;color:var(--atelier-accent-text)}
.ads-row,.ads-srow,.ads-adrow,.ads-opt{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;min-height:40px;padding:8px 0;background:transparent;border:0;border-top:.5px solid var(--atelier-card-border);font:var(--wl-t5);color:var(--atelier-ink);text-align:left;cursor:pointer}
.ads-srow,.ads-opt{font:var(--wl-t4);min-height:48px}
.ads-adrow{flex-direction:column;align-items:flex-start;gap:4px}
.ads-rowk{color:var(--atelier-ink-soft);white-space:nowrap}
.ads-rowv{text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.ads-change{color:var(--atelier-accent-text);margin-left:4px}
.ads-btn{width:100%;padding:12px;min-height:44px;border-radius:12px;font:var(--wl-t3);cursor:pointer;touch-action:manipulation;text-align:center;text-decoration:none;display:block;box-sizing:border-box}
.ads-primary{background:var(--role-primary);color:var(--role-on-primary);border:1px solid var(--role-primary)}
.ads-btn:disabled{opacity:.55;cursor:default}
.ads-ghost{background:transparent;color:var(--atelier-ink-soft);border:.5px solid var(--atelier-card-border)}
.ads-btn:focus-visible,.ads-row:focus-visible,.ads-srow:focus-visible,.ads-opt:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.ads-run{margin-top:8px}.ads-two{display:flex;gap:8px;margin-top:8px}
.ads-quiet{display:block;margin:12px auto 0;background:transparent;border:0;color:var(--atelier-ink-dim);font:var(--wl-t5);min-height:44px;cursor:pointer}
.ads-who{font:var(--wl-t4);color:var(--atelier-ink)}
.ads-adhead{display:flex;align-items:center;gap:12px}
.ads-adthumb{width:44px;height:44px;flex:none;object-fit:cover;object-position:50% 50%;border-radius:12px}
.ads-over{position:fixed;inset:0;background:var(--atelier-overlay);display:flex;align-items:flex-end;z-index:50}
.ads-sheet{width:100%;max-height:86dvh;overflow:auto;padding:24px 16px 24px;background:linear-gradient(180deg,var(--atelier-sheet-top),var(--atelier-sheet-bot));border-top:.5px solid var(--atelier-sheet-border)}
.ads-full{position:fixed;inset:0;z-index:50;overflow:auto;padding:16px 16px 32px;background:var(--atelier-card-bg)}
.ads-q{font:var(--wl-t2);color:var(--atelier-ink);line-height:1.4;margin:0 0 12px}
.ads-kv{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-top:.5px solid var(--atelier-card-border);font:var(--wl-t4);color:var(--atelier-ink)}
.ads-kv .ads-rowv{white-space:normal}
.ads-input{width:100%;box-sizing:border-box;padding:12px 12px;min-height:44px;border:.5px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-section-bg);color:var(--atelier-ink);font:var(--wl-t3)}
.ads-field{display:flex;flex-direction:column;gap:4px;flex:1}
.ads-note{display:block;font:var(--wl-t5);color:var(--atelier-ink-dim);margin-top:4px}
.ads-optt{display:block;color:var(--atelier-ink)}
.ads-mark{flex:none;width:22px;height:22px;border-radius:50%;border:1px solid var(--atelier-card-border);display:inline-flex;align-items:center;justify-content:center;color:var(--atelier-accent-text)}
.ads-on{border-color:var(--atelier-accent-text)}
.ads-chips{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 8px}
.ads-chip{padding:8px 12px;min-height:36px;border-radius:14px;border:.5px solid var(--atelier-card-border);background:transparent;color:var(--atelier-ink-soft);font:var(--wl-t5);cursor:pointer}
.ads-chipon{border-color:var(--atelier-accent-text);color:var(--atelier-accent-text)}
.ads-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ads-tile{position:relative;aspect-ratio:1/1;padding:0;border:.5px solid var(--atelier-card-border);background:var(--atelier-section-bg);overflow:hidden;cursor:pointer}
.ads-tile img{width:100%;height:100%;object-fit:cover;object-position:50% 50%;display:block}
.ads-tileon{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
.ads-tile:disabled{opacity:.45;cursor:default}
.ads-reel{position:absolute;top:4px;right:4px;font:var(--wl-t5);padding:0px 8px;border-radius:12px;background:var(--atelier-overlay);color:var(--atelier-ink)}
.ads-inel{position:absolute;left:4px;right:4px;bottom:4px}
`;
