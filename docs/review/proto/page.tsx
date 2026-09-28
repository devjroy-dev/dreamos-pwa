// @ts-nocheck
// docs/review/proto/page.tsx · THE PROTOTYPE PAGE for the review's screenshots. Not a production file and not built
// into the app: docs/review/tools/mocks.mjs copies it to app/vendor/(shell)/review-proto/page.tsx for the length of a
// screenshot run and deletes it after. It mounts the app's own WorklistShell (header, room head, profile coin), sets
// the shell's own token variables to a proposed palette, and draws the proposed screens from docs/review/html/screens.js (the same file the HTML mock-ups load).
//   /vendor/review-proto?screen=today&palette=ledger&type=inter   (the theme is the shell's cookie, as everywhere)
"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import '@/docs/review/html/screens.js';
import PAL from '@/docs/review/palettes/palettes.json';

function Proto() {
  const q = useSearchParams(); const router = useRouter();
  const P = globalThis.TDW_PROTO;
  const id = q.get('screen') || 'today'; const palette = q.get('palette') || ''; const type = q.get('type') || 'inter';
  const s = P.SCREENS[id] || P.SCREENS.today;
  const base = s.under ? P.SCREENS[s.under] : s;
  const detail = !P.TABS.some((t) => t[0] === (s.under || id));
  const css = P.CSS.replace(/\.p-skin/g, '.wl') + (palette ? P.skinCss(PAL.palettes, palette, 'html body .wl') : '') +
    `.wl{${P.typeVars(type)}}` + (detail ? '.wl-roomhead{display:none}' : '') + '.wl-main{padding-bottom:0}';
  const onClick = (e) => { const t = e.target.closest('[data-go]'); if (!t) return; const to = t.getAttribute('data-go') === '@back' ? (s.under || 'today') : t.getAttribute('data-go');
    const n = new URLSearchParams(q.toString()); n.set('screen', to); router.replace('?' + n.toString()); };
  return (
    <WorklistShell title={base.title}>
      <style>{css}</style>
      <div className="p-screen" onClick={onClick} dangerouslySetInnerHTML={{ __html: base.html() + (s.under ? s.html() : '') + P.nav(s.tab) }} />
    </WorklistShell>
  );
}
export default function Page() { return <Suspense><Proto /></Suspense>; }
