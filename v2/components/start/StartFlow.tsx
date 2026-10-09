'use client';
// v2/components/start/StartFlow.tsx · CE-47 · FE-9 · THE TWO-MINUTE START (package 1: S4 to S10; package 2: S2 and B1).
// Lives at /vendor/onboarding (G3): the page every unfinished vendor is already sent to, and (WEB-4 cut 20) where the
// Instagram connect started from S2 returns her, with ?ig=connected | cancelled | failed. Entered in one of four ways:
//   · she has a build (GET /latest)           -> S4 follows it (running) or shows how it ended, then S5 to S10;
//   · ?ig=connected and no build              -> the build starts (POST), then S4;
//   · no build                                -> S2: "Connect Instagram", or "Add my own photos" -> B1 (her phone's
//                                                photos into her portfolio), then the build starts, then S4;
//   · the build door cannot be read at all    -> S5 alone, exactly what the old form did (finish, then Home).
// S3 is Instagram's own screen: TDW draws nothing there.
// SERVER TRUTH, kept from the old form (OB-P 5): S5 shows only the fields in /vendor/me's onboarding.missing[] and the
// server's own refusal words; the app holds no copy of the list. Every step line in S4 is the server's.
// NOTHING SAYS "DONE" THAT WAS NOT DONE: each write waits on the server's ok; a refusal is shown in its own words.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getJson, postJson, deleteJson } from '@/lib/vendor/api/_base';
import { forgetVendorMe } from '@/hooks/vendor/useVendorHandle';
import { useT } from '@/lib/vendor/ThemeContext';
import { labelFor } from '@/lib/frost/categoryLabels';
import { scopeCss, typeCss } from '@/v2/lib/worklist/theme';
import { RECORD_CSS } from '@/v2/components/worklist/RecordPage';
import { formatRs } from '@/lib/vendor/format';
import DetailsForm from '@/v2/components/start/DetailsForm';
import { START, STYLES } from '@/v2/lib/vendor/startCopy';
import {
  type Build, type BuildStep, type ElizaState, latestFirstBuild, followBuild, readWaEliza, switchWaEliza,
  setSiteStyle, publishSite, markBuildChecked, patchSiteSettings, startFirstBuild, readFirstBuild, mintIgStart, fillWebsite,
} from '@/v2/lib/vendor/api/firstBuild';
import { fetchUploadUrl, registerPortfolioImage } from '@/v2/lib/vendor/api/vendor';

// the three service areas frozen at 0122 (the old form's own display half, unchanged)
const AREAS: { token: string; label: string }[] = [
  { token: 'pan_india', label: 'Across India' }, { token: 'worldwide', label: 'Worldwide' }, { token: 'select_cities', label: 'Select cities' },
];
type Step = 'loading' | 'connect' | 'phone' | 'build' | 'details' | 'style' | 'packages' | 'photos' | 'eliza' | 'ready';
interface Me {
  id: string; name?: string | null; business_name?: string | null; category?: string | null; city?: string | null;
  rate_min?: number | null; service_area?: string | null; service_cities?: string[] | null; instagram_handle?: string | null;
  handle?: string | null; onboarding?: { complete?: boolean; missing?: string[] };
}
interface Photo { id: string; image_url: string }
interface Pkg { id: string; name: string; total: number | null; is_default: boolean }

const digits = (s: string) => s.replace(/[^0-9]/g, '');

function Tick({ state }: { state: BuildStep['state'] }) {
  if (state === 'done' || state === 'skipped') return <svg className="st-ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="none" stroke="var(--role-primary)" strokeWidth="1.5" /><path d="M6 10.2l2.6 2.6L14 7.4" fill="none" stroke="var(--role-primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (state === 'failed') return <svg className="st-ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="none" stroke="var(--atelier-ink-mute)" strokeWidth="1.5" /><path d="M7 7l6 6M13 7l-6 6" stroke="var(--atelier-ink-mute)" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  if (state === 'running') return <svg className="st-ic st-spin" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="none" stroke="var(--atelier-card-border)" strokeWidth="1.5" /><path d="M10 1a9 9 0 0 1 9 9" fill="none" stroke="var(--role-primary)" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  return <svg className="st-ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="none" stroke="var(--atelier-card-border)" strokeWidth="1.5" /></svg>;
}
function Top({ label, n }: { label: string; n: number | null }) {
  return (<><div className="st-top"><span>{label}</span><span>{n ? START.of(n) : ''}</span></div><div className="st-bar"><span style={{ width: `${n ? Math.round((n / 8) * 100) : 100}%` }} /></div></>);
}

export default function StartFlow() {
  const router = useRouter();
  const T = useT();
  const [step, setStep] = useState<Step>('loading');
  const [me, setMe] = useState<Me | null>(null);
  const [build, setBuild] = useState<Build | null>(null);
  const [tooLong, setTooLong] = useState(false);
  const [err, setErr] = useState('');           // a server's refusal, verbatim, or the plain connect line
  const [busy, setBusy] = useState(false);
  const withBuild = useRef(false);
  const follow = useRef<{ stop: () => void } | null>(null);

  const [photos, setPhotos] = useState<Photo[]>([]); const [off, setOff] = useState<Set<string>>(new Set());
  const [pkgs, setPkgs] = useState<Pkg[]>([]);
  const [style, setStyle] = useState('gallery');
  const [eliza, setEliza] = useState<ElizaState | null>(null);
  const [igBack, setIgBack] = useState(false);              // S2 after Instagram sent her back without a connection
  const [igUrl, setIgUrl] = useState<string | null>(null);  // S2's destination, minted BEFORE she taps (F-07.22)
  const [upload, setUpload] = useState('');                 // B1's progress line

  const loadMe = useCallback(async (): Promise<Me | null> => {
    const r = await getJson<{ ok: boolean; vendor?: Me }>('/api/v2/vendor/me', true);
    return r && r.ok && r.vendor ? r.vendor : null;
  }, []);
  const loadPhotos = useCallback(async (vid: string) => {
    const r = await getJson<{ ok: boolean; images?: Photo[] }>(`/api/v2/vendor/portfolio/${vid}?state=all`);
    if (r && r.ok && Array.isArray(r.images)) setPhotos(r.images.map((i) => ({ id: i.id, image_url: i.image_url })));
  }, []);

  // ── entry ──────────────────────────────────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const m = await loadMe(); if (!live) return;
        if (!m) { setErr(START.noConnect); setStep('details'); return; }
        setMe(m);
        // WEB-4 cut 20: Instagram's return. Read once, then taken off the address so a reload does not read it again.
        const ig = new URLSearchParams(window.location.search).get('ig');
        if (ig) window.history.replaceState(null, '', window.location.pathname);
        const b = await latestFirstBuild(); if (!live) return;
        if (b) { withBuild.current = true; void loadPhotos(m.id); showBuild(b, () => live); return; }
        if (b === null && ig === 'connected') { void loadPhotos(m.id); await begin(() => live); return; }
        if (m.onboarding?.complete) { forgetVendorMe(); router.replace('/vendor'); return; }
        if (b === null) { setIgBack(ig === 'cancelled' || ig === 'failed'); setStep('connect'); return; }
        setStep('details');   // the build door could not be read: S5 alone, the old form's own screen and its done screen
      } catch { if (live) { setErr(START.noConnect); setStep('details'); } }
    })();
    return () => { live = false; if (follow.current) follow.current.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMe, loadPhotos, router]);

  // S4 for a build: follow it while it runs (each follow clears only its own handle).
  function showBuild(b: Build, alive: () => boolean) {
    setBuild(b); setStep('build');
    if (b.state !== 'running') return;
    const f = followBuild(b.build_id, (nb) => { if (alive()) setBuild(nb); });
    follow.current = f;
    void f.done.then((how) => { if (follow.current === f) follow.current = null; if (alive() && how === 'too_long') setTooLong(true); });
  }
  // The build starts (POST; a second POST returns the same build), then S4. A refusal stays on the screen she is on.
  async function begin(alive: () => boolean = () => true): Promise<void> {
    setBusy(true); setErr('');
    try {
      const r = await startFirstBuild();
      if (!alive()) return;
      if (!r || !r.ok) { setErr((r && 'error' in r && r.error) || START.noConnect); setStep((s) => (s === 'loading' ? 'connect' : s)); setBusy(false); return; }
      withBuild.current = true;
      const b = (await readFirstBuild(r.build_id)) || { build_id: r.build_id, state: 'running' as const, steps: [], site_ready: false };
      if (!alive()) return;
      showBuild(b, alive);
    } catch { if (alive()) { setErr(START.noConnect); setStep((s) => (s === 'loading' ? 'connect' : s)); } }
    setBusy(false);
  }

  // S2 · the destination is minted before she taps and the control is a real <a href> (F-07.22: no await between her
  // finger and the navigation). /ig/authorize arms one state per vendor and each mint replaces the last, so it is minted
  // again only while this tab is VISIBLE (she is not on Instagram's screen), 8 minutes after the last (the TTL is 10).
  const mintIg = useCallback(async () => {
    try {
      const r = await mintIgStart();
      if (r && r.ok && r.authorize_url) { setIgUrl(r.authorize_url); return true; }
      setIgUrl(null); setErr((r && 'error' in r && r.error) || START.noConnect); return false;
    } catch { setIgUrl(null); setErr(START.noConnect); return false; }
  }, []);
  useEffect(() => {
    if (step !== 'connect') return;
    void mintIg();
    const t = setInterval(() => { if (document.visibilityState === 'visible') void mintIg(); }, 8 * 60 * 1000);
    return () => clearInterval(t);
  }, [step, mintIg]);

  // B1 · her phone's photos go into her portfolio through the Portfolio room's own doors (sign, upload, register), one
  // at a time (each register takes the next position); a refusal is shown in the server's words.
  const addPhotos = useCallback(async (files: File[]) => {
    if (!files.length || !me || busy) return;
    setBusy(true); setErr('');
    try {
      for (let i = 0; i < files.length; i += 1) {
        setUpload(START.uploading(i + 1, files.length));
        const u = await fetchUploadUrl(files[i].name);
        if (!u || !u.ok) { setErr((u as { error?: string }).error || START.uploadFailed); break; }
        const form = new FormData();
        Object.entries((u as { params: Record<string, unknown> }).params).forEach(([k, v]) => form.append(k, String(v)));
        form.append('file', files[i]);
        const c = await fetch((u as { upload_url: string }).upload_url, { method: 'POST', body: form });
        if (!c.ok) { setErr(START.uploadFailed); break; }
        const d = await c.json() as { secure_url?: string };
        const reg = await registerPortfolioImage({ image_url: String(d.secure_url || '') });
        if (!reg || !reg.ok) { setErr((reg as { error?: string }).error || START.uploadFailed); break; }
        await loadPhotos(me.id);
      }
    } catch { setErr(START.uploadFailed); }
    setUpload(''); setBusy(false);
  }, [busy, loadPhotos, me]);

  // S8 is shown only when the build's photos step brought photos from her Instagram; otherwise (B1, or that step not
  // done) its words would not be true, so S7 goes straight to S9.
  // WEB-4's contract: the website step alone, again (her own photos into TDW's untouched draft). Offered only while
  // GET /latest said website_can_fill; the server's refusal is shown as it is; the build is then followed as today.
  const fill = useCallback(async () => {
    if (busy || !build) return; setBusy(true); setErr('');
    try {
      const r = await fillWebsite();
      if (!r || !r.ok) { setErr((r && 'error' in r && r.error) || START.noConnect); setBusy(false); return; }
      const b = (await readFirstBuild(r.build_id)) || { ...build, state: 'running' as const };
      showBuild({ ...b, website_can_fill: false }, () => true);
    } catch { setErr(START.noConnect); }
    setBusy(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, build]);

  // S8 says "TDW added N photos from your Instagram", so it is shown only when the photos step is done AND brought photos
  // from Instagram (counts.imported > 0). Her own photos (WEB-4's "Your portfolio has N photos. We used them...") do not.
  const afterPackages = useCallback(async () => {
    const ph = build ? build.steps.find((x) => x.key === 'photos') : undefined;
    const imported = ph && ph.counts && typeof ph.counts.imported === 'number' ? ph.counts.imported : 0;
    if (ph && ph.state === 'done' && imported > 0) { setStep('photos'); return; }
    setEliza(await readWaEliza().catch(() => null)); setStep('eliza');
  }, [build]);

  // S4c (the chair, 6 Oct 2026): she may carry on while the build goes on. Reaching S6 reads it again, and follows it
  // while it still runs, so the screens after it never claim a step done that is not.
  useEffect(() => {
    if (step !== 'style' || !build || build.state !== 'running' || follow.current) return;
    const f = followBuild(build.build_id, (nb) => setBuild(nb)); follow.current = f;
    void f.done.then(() => { if (follow.current === f) follow.current = null; });
  }, [step, build]);

  const afterBuild = useCallback(() => { setErr(''); setStep('details'); }, []);   // S5 moves her on at once if nothing is missing

  const useStyle = useCallback(async () => {
    if (busy) return; setBusy(true); setErr('');
    try {
      const r = await setSiteStyle(style);
      if (!r || !r.ok) { setErr((r && r.error) || START.noConnect); setBusy(false); return; }
      const p = await getJson<{ ok: boolean; packages?: Pkg[] }>('/api/v2/vendor/packages');
      setPkgs(p && p.ok && Array.isArray(p.packages) ? p.packages : []);
      setStep('packages');
    } catch { setErr(START.noConnect); }
    setBusy(false);
  }, [busy, style]);

  // S8 · "Untick any you do not want on your website" is made TRUE (the chair, 6 Oct 2026): an untick removes the photo
  // from her portfolio AND from her website draft. The build copied each portfolio photo into its draft looks and cover
  // slides by its image_url (firstBuild.js website step: vendor_look_photos.image_url = vendor_portfolio.image_url;
  // cover[].photo.url = image_url), so the same url is what ties them. Through the room's own doors only:
  //   DELETE /portfolio/:id · GET site/looks -> DELETE site/looks/:id/photos/:pid for that url, and DELETE site/looks/:id
  //   when a look is left with no photo · GET site/room -> PATCH site/settings { cover } without that url's slides.
  // Each removal waits on the server's ok; a refusal stops the step in the server's words, and a retry carries on
  // from where it stopped (what is gone is gone from the screen too).
  const keepPhotos = useCallback(async () => {
    if (busy) return; setBusy(true); setErr('');
    const fail = (r: { ok?: boolean; error?: string } | null) => { setErr((r && r.error) || START.noConnect); setBusy(false); };
    try {
      const gone = photos.filter((p) => off.has(p.id));
      const urls = new Set(gone.map((p) => p.image_url));
      for (const p of gone) {
        const r = await deleteJson<{ ok: boolean; error?: string }>(`/api/v2/vendor/portfolio/${p.id}`);
        if (!r || !r.ok) return fail(r);
        setPhotos((ps) => ps.filter((x) => x.id !== p.id));
        setOff((o) => { const n = new Set(o); n.delete(p.id); return n; });
      }
      if (urls.size) {
        const L = await getJson<{ ok: boolean; error?: string; looks?: { id: string; photos: { id: string; url: string }[] }[] }>('/api/v2/vendor/solutions/site/looks');
        if (!L || !L.ok) return fail(L);
        for (const look of L.looks || []) {
          const hit = look.photos.filter((ph) => urls.has(ph.url));
          if (!hit.length) continue;
          if (hit.length === look.photos.length) {
            const r = await deleteJson<{ ok: boolean; error?: string }>(`/api/v2/vendor/solutions/site/looks/${look.id}`);
            if (!r || !r.ok) return fail(r);
          } else {
            for (const ph of hit) {
              const r = await deleteJson<{ ok: boolean; error?: string }>(`/api/v2/vendor/solutions/site/looks/${look.id}/photos/${ph.id}`);
              if (!r || !r.ok) return fail(r);
            }
          }
        }
        const R = await getJson<{ ok: boolean; error?: string; room?: { stored?: { cover?: { photo?: { url?: string } }[] } } }>('/api/v2/vendor/solutions/site/room');
        if (!R || !R.ok) return fail(R);
        const cover = (R.room && R.room.stored && Array.isArray(R.room.stored.cover)) ? R.room.stored.cover : [];
        const kept = cover.filter((c) => !urls.has(String((c.photo && c.photo.url) || '')));
        if (kept.length !== cover.length) {
          const r = await patchSiteSettings({ cover: kept });
          if (!r || !r.ok) return fail(r);
        }
      }
      setEliza(await readWaEliza().catch(() => null));
      setStep('eliza');
    } catch { setErr(START.noConnect); }
    setBusy(false);
  }, [busy, off, photos]);

  const chooseEliza = useCallback(async (on: boolean) => {
    if (busy) return; setBusy(true); setErr('');
    try {
      const r = await switchWaEliza(on);
      if (!r || !r.ok) { setErr((r && r.error) || START.noConnect); setBusy(false); return; }
      setEliza(await readWaEliza().catch(() => null));   // S10 reads GET only
      setStep('ready');
    } catch { setErr(START.noConnect); }
    setBusy(false);
  }, [busy]);

  const finish = useCallback(async (publish: boolean) => {
    if (busy) return; setBusy(true); setErr('');
    try {
      if (publish) {
        const r = await publishSite();
        if (!r || !r.ok) { setErr((r && r.error) || START.noConnect); setBusy(false); return; }
      }
      if (build) markBuildChecked(build.build_id);
      router.replace('/vendor');
    } catch { setErr(START.noConnect); setBusy(false); }
  }, [busy, build, router]);

  const mode = T.isLight ? 'light' : 'dark';
  const css = useMemo(() => scopeCss('.st') + typeCss('.st') + RECORD_CSS + `
/* the light blanket (globals.css: html.theme-light, color inherit, 0-3-1) outranks every class here, so in light mode
   the flow's muted lines, tags and links read plain ink (found on the built screens' pictures, 7 Oct 2026). Each of
   this scope's own colours is held !important, the shell's own answer (WorklistShell .wl .wl-btn.pri). */
.st{min-height:100dvh;background:var(--atelier-page-bg);color:var(--atelier-ink)!important;padding:24px 16px 32px;box-sizing:border-box}
.st-in{max-width:420px;margin:0 auto;min-height:calc(100dvh - 56px);display:flex;flex-direction:column}
.st-top{display:flex;justify-content:space-between;font:var(--wl-t5);color:var(--atelier-ink-mute)!important}
.st-bar{height:3px;border-radius:2px;background:var(--atelier-card-border);margin:10px 0 20px;overflow:hidden}
.st-bar span{display:block;height:3px;background:var(--role-primary)}
.st-h{margin:0 0 6px;font:var(--wl-t1);color:var(--atelier-ink)!important}
.st-sub{margin:0 0 16px;font:var(--wl-t4);color:var(--atelier-ink-mute)!important}
.st-grow{flex:1;display:flex;flex-direction:column;gap:12px}
.st-card{border:1px solid var(--atelier-card-border);background:var(--atelier-card-bg);border-radius:14px;padding:14px}
.st-rows{display:flex;flex-direction:column;gap:14px}
.st-row{display:flex;gap:10px;align-items:flex-start;font:var(--wl-t4);color:var(--atelier-ink)!important}
.st-ic{width:20px;height:20px;flex:none}
.st-spin{animation:st-r 1s linear infinite}@keyframes st-r{to{transform:rotate(360deg)}}
.st-small{font:var(--wl-t5);color:var(--atelier-ink-mute)!important;margin-top:2px}
.st-lbl{margin:8px 0 6px;font:var(--wl-t5);color:var(--atelier-ink-mute)!important}
.st-f{box-sizing:border-box;width:100%;min-height:48px;padding:12px 16px;border:1px solid var(--atelier-input-border);border-radius:12px;background:var(--atelier-input-bg);color:var(--atelier-ink)!important;font:var(--wl-t3)}
.st-chips{display:flex;flex-wrap:wrap;gap:8px}
.st-chip{min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--atelier-card-border);background:transparent;color:var(--atelier-ink)!important;font:var(--wl-t4)}
.st-chip.on{background:var(--role-primary);border-color:var(--role-primary);color:var(--role-on-primary)!important}   /* veto 54: the chosen chip is filled */
.st-brand{margin:0 0 24px;font:500 1.25rem/1.2 var(--font-brand),Georgia,serif;color:var(--atelier-ink)!important}
.st-err{margin:0 0 12px;padding:12px 16px;border:1px solid var(--role-caution);border-radius:12px;font:var(--wl-t4);color:var(--role-caution)!important}
.st-ghost{display:block;width:100%;min-height:44px;margin-top:10px;border:1px solid var(--atelier-card-border);border-radius:12px;background:transparent;color:var(--atelier-ink)!important;font:var(--wl-t4)}
.st-foot{margin-top:16px}
.st .st-handle{color:var(--role-primary)!important}
.st .st-ink{color:var(--atelier-ink)!important}
/* the filled controls (found on the built screens' pictures, 7 Oct 2026): a full-width button, and its on-primary ink.
   globals.css's light blanket (html.theme-light, color inherit, 0-3-1) outranks a class; the shell's own answer
   (WorklistShell: .wl .wl-btn.pri) is the one used here, so a filled control never reads ink on primary in light. */
.st .rp-next{width:100%}
.st-two{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:stretch}
.st-two .rp-next{margin:0;padding:0 8px;text-align:center}
.st .rp-next,.st .st-chip.on{color:var(--role-on-primary)!important}
.st-foot label.rp-next{cursor:pointer}
.st-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.st-grid button{position:relative;aspect-ratio:1/1;border:0;padding:0;border-radius:8px;overflow:hidden;background:none}
.st-grid img{width:100%;height:100%;object-fit:cover;display:block}
.st-dot{position:absolute;right:6px;top:6px;width:22px;height:22px;border-radius:11px;background:var(--role-primary);border:1.5px solid #FFFFFF;box-sizing:border-box}
.st-dot.off{background:rgba(0,0,0,0.45)}
.st-styles{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;margin-right:-16px;padding-bottom:4px}
.st-style{flex:none;width:240px;scroll-snap-align:start;padding:0;overflow:hidden;text-align:left;border:1px solid var(--atelier-card-border);border-radius:14px;background:var(--atelier-card-bg);color:var(--atelier-ink)!important}
.st-style.on{border:2px solid var(--role-primary)}
.st-style img{width:100%;height:260px;object-fit:cover;display:block}
.st-style div{padding:12px 14px;display:flex;flex-direction:column;gap:6px}
.st-tag{align-self:flex-start;font:var(--wl-t5);color:var(--role-primary)!important;border:1px solid var(--role-primary);border-radius:10px;padding:2px 8px}
.st-pkg{display:flex;justify-content:space-between;gap:10px;font:var(--wl-t3);color:var(--atelier-ink)!important;text-decoration:none}
.st-mono{width:44px;height:44px;flex:none;border-radius:22px;display:flex;align-items:center;justify-content:center;background:var(--atelier-card-bg);border:1px solid var(--atelier-card-border);font:var(--wl-t2);color:var(--atelier-ink)!important}
.st-hero{width:100%;height:220px;object-fit:cover;border-radius:14px;display:block;margin-bottom:16px}
`, []);

  const body = (() => {
    if (step === 'loading') return <div aria-busy="true" />;

    if (step === 'connect') {
      return (<>
        <Top label={START.setting} n={1} />
        <h1 className="st-h">{START.connectHead}</h1><p className="st-sub">{START.connectSub}</p>
        {igBack ? <div className="st-card" data-ig-back="" role="status" style={{ marginBottom: 12 }}><p className="st-small st-ink" style={{ margin: 0 }}>{START.igCancelled}</p><p className="st-small">{START.igPersonal}</p></div> : null}
        {err ? <p className="st-err" role="alert">{err}</p> : null}
        <div className="st-grow">{START.connectRows.map((t) => <div key={t} className="st-card st-row"><Tick state="done" />{t}</div>)}</div>
        <div className="st-foot">
          {/* the founder's rule (8 Oct 2026): her own photos are a way in of EQUAL standing: the same filled control, the
              same size, side by side */}
          <div className="st-two">
            {igUrl ? <a className="rp-next" href={igUrl} data-ig-connect="">{START.connect}</a>
              : <button type="button" className="rp-next" disabled={busy} onClick={() => { setErr(''); void mintIg(); }} data-ig-connect="">{START.connect}</button>}
            <button type="button" className="rp-next" disabled={busy} onClick={() => { setErr(''); if (me) void loadPhotos(me.id); setStep('phone'); }} data-own-photos="">{START.noInstagram}</button>
          </div>
        </div>
      </>);
    }

    if (step === 'phone') {
      const n = photos.length;
      return (<>
        <Top label={START.setting} n={2} />
        <h1 className="st-h">{START.phoneHead}</h1><p className="st-sub">{START.phoneSub}</p>
        {err ? <p className="st-err" role="alert">{err}</p> : null}
        <div className="st-grow">
          {n ? <div className="st-grid">{photos.map((p) => <button key={p.id} type="button" tabIndex={-1}><img src={p.image_url} alt="" /><span className="st-dot" /></button>)}</div> : null}
          {upload ? <p className="st-small" role="status" data-upload="">{upload}</p> : null}
          <p className="st-small">{START.phoneSmall}</p>
        </div>
        <div className="st-foot">
          <label className="rp-next" htmlFor="st-file" aria-disabled={busy} data-choose="">{START.choose}</label>
          <input id="st-file" type="file" accept="image/*" multiple disabled={busy} style={{ display: 'none' }}
            onChange={(e) => { const f = Array.from(e.target.files || []); e.target.value = ''; void addPhotos(f); }} />
          <button type="button" className="st-ghost" disabled={busy} onClick={() => void begin()}>{n ? START.withPhotos(n) : START.withNone}</button>
        </div>
      </>);
    }

    if (step === 'build' && build) {
      const ended = build.state !== 'running';
      const failed = build.steps.some((s) => s.state === 'failed');
      const head = ended && !failed ? START.doneHead : START.buildHead;
      const sub = !ended ? (tooLong ? START.longSub : START.buildSub) : failed ? START.failSub : START.doneSub;
      return (<>
        <Top label={START.building} n={3} />
        {me && (me.business_name || me.instagram_handle) ? (
          <div className="st-row" style={{ alignItems: 'center', marginBottom: 12 }} data-who="">
            <span className="st-mono" aria-hidden="true">{(me.business_name || me.instagram_handle || '').trim().charAt(0).toUpperCase()}</span>
            <span><strong>{me.business_name}</strong>{me.instagram_handle ? <a className="st-small st-handle" style={{ display: 'block', margin: 0 }} href={`https://instagram.com/${encodeURIComponent(me.instagram_handle)}`} target="_blank" rel="noopener noreferrer" data-ig-link="">@{me.instagram_handle}</a> : null}</span>
          </div>) : null}
        <h1 className="st-h">{head}</h1><p className="st-sub">{sub}</p>
        <div className="st-grow">
          <div className="st-card st-rows" data-build-steps="">
            {build.steps.map((s) => (
              <div key={s.key} className="st-row" data-step={s.key} data-state={s.state}>
                <Tick state={s.state} />
                <div><div>{s.state === 'waiting' || s.state === 'running' || !s.line ? START.stepName[s.key] : s.line}</div>
                  {(s.opens || []).map((o, i) => <div key={i} className="st-small" data-opens="">{o.line}</div>)}   {/* the server's sentence, whole (the chair, 8 Oct 2026) */}
                </div>
              </div>
            ))}
          </div>
          {!ended && photos.length ? <div className="st-grid">{photos.slice(0, 6).map((p) => <button key={p.id} type="button" tabIndex={-1}><img src={p.image_url} alt="" /></button>)}</div> : null}
        </div>
        {ended && build.website_can_fill ? (
          <div className="st-card" data-fill-offer="" style={{ marginTop: 12 }}>
            <p className="st-small" style={{ margin: '0 0 10px' }}>{START.fillLine}</p>
            <button type="button" className="st-ghost" style={{ marginTop: 0 }} disabled={busy} onClick={() => void fill()}>{START.fillGo}</button>
          </div>) : null}
        {err ? <p className="st-err" role="alert" style={{ marginTop: 12 }}>{err}</p> : null}
        <div className="st-foot">
          {ended ? <button type="button" className="rp-next" onClick={() => afterBuild()}>{START.cont}</button>
            : tooLong ? <button type="button" className="rp-next" onClick={() => afterBuild()}>{START.cont}</button> : null}
        </div>
      </>);
    }

    if (step === 'style') {
      const webRow = build ? build.steps.find((x) => x.key === 'website') : undefined;
      const webWaiting = !!webRow && (webRow.state === 'running' || webRow.state === 'waiting');
      const imgs = photos.length ? photos.map((p) => p.image_url) : [];
      return (<>
        <Top label={START.setting} n={5} />
        <h1 className="st-h">{START.styleHead}</h1><p className="st-sub">{START.styleSub}</p>
        {err ? <p className="st-err" role="alert">{err}</p> : null}
        <div className="st-grow">
          {webRow && webRow.state === 'running' ? (<div className="st-card st-rows" data-build-steps=""><div className="st-row" data-step="website" data-state="running"><Tick state="running" /><div>{START.stepName.website}</div></div></div>) : null}
          <div className="st-styles">{STYLES.map((s, i) => (
            <button key={s.key} type="button" className={'st-style' + (style === s.key ? ' on' : '')} aria-pressed={style === s.key} onClick={() => setStyle(s.key)}>
              {imgs.length ? <img src={imgs[i % imgs.length]} alt="" /> : null}
              <div>{s.key === 'gallery' ? <span className="st-tag">{START.inDraft}</span> : null}<strong>{s.name}</strong><span className="st-small">{s.line}</span></div>
            </button>))}</div>
          <p className="st-small">{START.swipe}</p>
        </div>
        <div className="st-foot"><button type="button" className="rp-next" disabled={busy || webWaiting} onClick={() => void useStyle()}>{START.use(STYLES.find((s) => s.key === style)!.name)}</button></div>
      </>);
    }

    if (step === 'packages') {
      return (<>
        <Top label={START.setting} n={6} />
        <h1 className="st-h">{START.pkgHead}</h1><p className="st-sub">{START.pkgSub}</p>
        <div className="st-grow">
          {pkgs.map((p) => (
            <Link key={p.id} href={`/vendor/packages?package=${encodeURIComponent(p.id)}`} className="st-card st-pkg" data-package="">
              <span>{p.is_default ? <><span className="st-tag" style={{ display: 'inline-block', marginBottom: 6 }}>{START.mainPkg}</span><br /></> : null}<strong>{p.name}</strong></span>
              <strong style={{ whiteSpace: 'nowrap' }}>{p.total ? formatRs(p.total) : START.onRequest}</strong>
            </Link>))}
          <p className="st-small">{START.tapPkg}</p>
        </div>
        <div className="st-foot"><button type="button" className="rp-next" onClick={() => void afterPackages()}>{START.pkgOk}</button></div>
      </>);
    }

    if (step === 'photos') {
      return (<>
        <Top label={START.setting} n={7} />
        <h1 className="st-h">{START.photosHead}</h1><p className="st-sub">{START.photosSub(photos.length)}</p>
        {err ? <p className="st-err" role="alert">{err}</p> : null}
        <div className="st-grow"><div className="st-grid">{photos.map((p) => {
          const isOff = off.has(p.id);
          return (<button key={p.id} type="button" aria-pressed={!isOff} onClick={() => setOff((o) => { const n = new Set(o); if (n.has(p.id)) n.delete(p.id); else n.add(p.id); return n; })}>
            <img src={p.image_url} alt="" /><span className={'st-dot' + (isOff ? ' off' : '')} /></button>);
        })}</div></div>
        <div className="st-foot"><button type="button" className="rp-next" disabled={busy} onClick={() => void keepPhotos()}>{START.photosOk}</button></div>
      </>);
    }

    if (step === 'eliza') {
      return (<>
        <Top label={START.setting} n={8} />
        <h1 className="st-h">{START.elizaHead}</h1><p className="st-sub">{START.elizaSub}</p>
        {err ? <p className="st-err" role="alert">{err}</p> : null}
        <div className="st-grow">
          <div className="st-card"><strong>{START.whenOn}</strong><p className="st-small">{START.whenOnText}</p><strong>{START.never}</strong><p className="st-small">{START.neverText}</p></div>
          <p className="st-small">{START.offMeans}</p>
          {eliza === 'waiting' ? <div className="st-card" data-eliza-waiting=""><p className="st-small" style={{ margin: 0 }}>{START.waiting}</p></div> : null}
        </div>
        <div className="st-foot">
          <button type="button" className="rp-next" disabled={busy} onClick={() => void chooseEliza(true)}>{START.on}</button>
          <button type="button" className="st-ghost" disabled={busy} onClick={() => void chooseEliza(false)}>{START.off}</button>
          <button type="button" className="st-ghost" disabled={busy} onClick={() => void chooseEliza(false)}>{START.notNow}</button>
          <p className="st-small" style={{ textAlign: 'center', marginTop: 10 }}>{START.anyTime}</p>
        </div>
      </>);
    }

    if (step === 'ready') {
      const photosStep = build?.steps.find((s) => s.key === 'photos');
      const stepDone = (k: string) => { const st = build?.steps.find((s) => s.key === k); return !!st && (st.state === 'done' || st.state === 'skipped'); };
      const n = photos.length;
      const styleName = STYLES.find((s) => s.key === style)!.name;
      const addr = me && me.handle ? `${me.handle}.thedreamwedding.in` : '';
      const elizaLine = eliza === 'on' ? START.elizaOn : eliza === 'off' ? START.elizaOff : eliza === 'waiting' ? START.elizaWaiting : null;
      return (<>
        <Top label={START.ready} n={null} />
        {photos[0] ? <img className="st-hero" src={photos[0].image_url} alt="" /> : null}
        <h1 className="st-h">{START.readyHead}</h1>{addr ? <p className="st-sub">{START.goesLive(addr)}</p> : null}
        {err ? <p className="st-err" role="alert">{err}</p> : null}
        <div className="st-grow"><div className="st-card st-rows" data-ready-rows="">
          {stepDone('website') ? <div className="st-row"><Tick state="done" />{START.draftIn(styleName)}</div> : null}
          {stepDone('packages') && pkgs.length ? <div className="st-row"><Tick state="done" />{START.pkgsSaved(pkgs.length)}</div> : null}
          {photosStep && photosStep.state === 'done' && n ? <div className="st-row"><Tick state="done" />{START.photosOn(n)}</div> : null}
          {elizaLine ? <div className="st-row" data-eliza-row={eliza || ''}><Tick state={eliza === 'on' ? 'done' : 'waiting'} />{elizaLine}</div> : null}
        </div></div>
        <div className="st-foot">
          <button type="button" className="rp-next" disabled={busy} onClick={() => void finish(true)}>{START.publish}</button>
          <button type="button" className="st-ghost" disabled={busy} onClick={() => void finish(false)}>{START.notYet}</button>
        </div>
      </>);
    }
    return null;
  })();

  if (step === 'details') {
    // S5 is the old form's own component (ruling A): its screen, its server truth, and, with no build, its done screen
    return (<div data-start-step="details"><style>{css}</style>
      <DetailsForm withBuild={withBuild.current} top={withBuild.current ? <Top label={START.setting} n={4} /> : null}
        onSaved={() => { forgetVendorMe(); void loadMe().then((m) => { if (m) setMe(m); }); setStep('style'); }} /></div>);
  }
  return (<div className="st" data-wl-mode={mode} data-start-step={step}><style>{css}</style><div className="st-in">{body}</div></div>);
}
