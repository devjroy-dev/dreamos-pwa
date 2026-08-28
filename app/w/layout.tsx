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

export default async function WorklistLayout({ children }: { children: React.ReactNode }) {
  const mode = asMode((await cookies()).get(MODE_COOKIE)?.value);
  return <WorklistBoot initialMode={mode}>{children}</WorklistBoot>;
}
