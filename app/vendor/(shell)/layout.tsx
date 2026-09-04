// app/w/layout.tsx — THE SERVER HALF OF THE SHELL'S ROOT.
//
// ── R-38.1 AMENDED BY LABEL (CE-38 S3) · WHY THERE IS A SERVER LAYER ───────
//
// The whole of this file is: read one cookie, hand it down. It exists because the mode
// must be known BEFORE the first byte is emitted, and a client component cannot know that
// — `app/w/layout.tsx` carried `"use client"` and therefore could not call `cookies()`,
// which is precisely why its loading ground was pinned to a dark literal for two sittings.
//
// THE RULED PROPERTIES ARE UNTOUCHED. One root for `/w`, one session resolve. The client
// body moved wholesale to `WorklistBoot` and did not otherwise change; the reasoning that
// justifies it lives there, at the code it governs.
//
// `cookies()` OPTS THIS SUBTREE OUT OF STATIC RENDERING, and that is correct rather than a
// cost: every surface under `/w` is behind a session and none of it was ever cacheable.
import { cookies } from 'next/headers';
import { MODE_COOKIE, asMode } from '@/lib/worklist/mode';
import { WorklistBoot } from './WorklistBoot';
import { ServiceWorkerRegistrar } from '@/components/vendor/ServiceWorkerRegistrar';

// ── F-39.16 · THE IDENTITY IS COMPUTED PER BUILD, OUTSIDE ANY CACHED CHUNK ──
//
// IT WAS WRONG TWICE, IN THE SAME DIRECTION, AND THE WALKS PROCEEDED ANYWAY. At 79fc1db →
// f915b55 the stamp read 79fc1db; at f915b55 → 08a6dfe it read f915b55. Stale by exactly
// one build, both times, while the surface visibly ran the new one.
//
// THE MECHANISM, DERIVED RATHER THAN GUESSED. The stamp lived in WorklistShell.tsx, which
// is a CLIENT component, and read `process.env.NEXT_PUBLIC_TDW_COMMIT` — inlined at BUILD
// time by next.config.ts. `WorklistShell.tsx` has not changed since `08ecf78`, so it was
// absent from both diffs; Next's build cache keys modules on SOURCE CONTENT, not on env
// values, and restored that module from the previous build with the old commit already
// baked into it while the changed files recompiled. Build A's constant, build B's chunks.
// The service worker was innocent both times — it is network-first on navigations, caches
// no document, and its activate purges everything (F-19.36 refuted the same hypothesis
// once already).
//
// ⚠ THE CURE IS THE READ SITE, NOT THE VALUE. This file is a SERVER component and already
// calls `cookies()`, which opts the whole /w subtree out of static rendering — so
// `process.env.VERCEL_GIT_COMMIT_SHA` here is evaluated PER REQUEST on the deployment that
// is actually serving, and no build artifact can carry a stale copy. The id then travels
// to the shell as a PROP.
//
// ⚠ AND `NEXT_PUBLIC_TDW_COMMIT` IS DELETED FROM next.config.ts IN THIS SAME COMMIT.
// Leaving it would leave the trap: the next reader who wants a commit string finds a
// ready-made constant with the right name and re-creates the defect in one line.
//
// ⚠ THE CELL ASSERTS THE DYNAMIC PROPERTY, NOT THIS FILE'S NAME. A future seat removing
// the cookie read would make this subtree static again, the div would still be in the
// right place, and the stamp would silently go stale once more. Location is not the
// property; being computed per request is.
export default async function WorklistLayout({ children }: { children: React.ReactNode }) {
  const mode = asMode((await cookies()).get(MODE_COOKIE)?.value);
  const commit = (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || 'local';
  // F-19.36: the SW registrar mounts PER AUTHENTICATED SHELL. It used to sit in
  // the root layout with an origin-wide scope, so one visit to the landing page
  // claimed /v/ and /r/ for that browser. Chair-granted one-liner in this seat's
  // fence; no other byte of this file moves.
  // ⚠ c-LE-39.8, DISCLOSED, NOT SILENTLY ADAPTED. The ruling said 「WorklistShell receives
  // the id as a prop」. It cannot, at a radius worth paying: `WorklistShell` is mounted by
  // each of the nineteen room pages, not by this layout, so a prop would mean nineteen
  // call sites or a context provider threaded through `children` — both larger than the
  // ruling's substance, which is that the value be computed per request outside any cached
  // chunk. The element renders HERE, in the server layer, where that property is a fact of
  // the render rather than a convention. Both instruments query `[data-tdw-commit]` across
  // the whole document (`wl_audit.mjs`, `wl_render.cjs`), so neither reader moves.
  return (
    <WorklistBoot initialMode={mode}>
      <div hidden data-tdw-commit={commit} />
      <ServiceWorkerRegistrar />{children}
    </WorklistBoot>
  );
}
