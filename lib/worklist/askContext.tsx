"use client";
// lib/worklist/askContext.tsx — THE ASK DOOR. ONE INTERFACE, TWO IMPLEMENTATIONS.
//
// ── F-38.47 · FOUR DOORS OUT OF THE SHELL, AND WHY A CONTEXT AND NOT A PARAM ──
// Four controls carry a PREFILL into the chat: 「Send to Chat」 on a lead's wishbone, on a
// client's binder and on a note, and 「Ask TDW about this date」 on a calendar day. Every
// one of them was `router.push('/vendor?draft=…')` — the OLD HUB ROOT with a query string —
// so inside the shell each tap unmounted the shell entire: second layout, second Splash,
// second medallion, second session resolve. F-38.1, still live, behind four controls the
// founder uses. Declared at INTERIM_HUB_PRIMERS since §4-2 and priced as a design sitting;
// this is that sitting (CE-39 S2/6, R-39.3).
//
// THREE ARMS WERE WEIGHED AND ONE SURVIVED (CE-39, 04 §OPENER):
//   (b) a URL param on /w — REFUSED. NotesBody sends a whole note BODY as the prefill, and a
//       note body in a URL is a note body in the browser history, in the referrer, in the
//       server log. It also gives the ask a history entry the vendor never asked for.
//   (c) a module-level store — REFUSED as F-38.3's class: a writer outside React's tree,
//       with nothing to undo it when the surface that wrote it leaves.
//   (a) SHELL CONTEXT — this file. One provider holding { open, prefill }; the dock
//       consumes it and no longer owns `open`; the four doors call openAsk(text). No URL
//       surface, no history entry, note bodies never leave memory.
//
// ── DUAL-TREE, AND THAT IS WHY THE IMPLEMENTATION IS NOT HERE ──────────────
// The four doors are mounted by BOTH trees. BinderCard sits on app/vendor/page.tsx — the
// old hub itself — where `/vendor?draft=` primes the risen chat on the SAME page, a live
// control that deleting the push would regress. So the doors are tree-blind: they ask this
// context and push nothing. What openAsk DOES is the tree's business, stated at the tree:
//   · components/worklist/WorklistShell.tsx mounts the provider whose openAsk opens
//     AskSheet in place with the prefill — the shell stays mounted.
//   · app/vendor/layout.tsx mounts the provider whose openAsk is today's push, kept
//     byte-for-byte on the tree that dies whole at Phase 7 (INTERIM_BOTTOMNAV_MOUNTS).
// SliceDoor's precedent, one level up: one interface, two implementations, each with its
// reason at its site. With this, INTERIM_HUB_PRIMERS = [] is literally true of the shell.
//
// ── NO SILENT DEFAULT ───────────────────────────────────────────────────────
// `useAsk()` throws when no provider is above it. AskSheet's own F-38.3 note is the
// warrant: a context that defaults quietly renders a surface that LOOKS wired and is not,
// which is the hollow-green shape. A door with no tree to open into is a structural fault
// and the bench asserts both layouts mount the provider, so the throw is a tripwire on a
// path the estate has already closed — never a surprise on a vendor's screen.
import { createContext, useContext } from 'react';

export type AskApi = {
  /** True while the shell's ask sheet is on screen. Always false on the /vendor tree. */
  open: boolean;
  /** The text the sheet's input opens with. Prefill-not-fire: never sent on the door's behalf. */
  prefill: string;
  /** Open the ask surface, optionally with a prefill. F-04.9 grammar: a stem, never a question. */
  openAsk: (text?: string) => void;
  /** Close it and forget the prefill, so the next open starts clean. */
  closeAsk: () => void;
};

const AskContext = createContext<AskApi | null>(null);

export function AskProvider({ value, children }: { value: AskApi; children: React.ReactNode }) {
  return <AskContext.Provider value={value}>{children}</AskContext.Provider>;
}

export function useAsk(): AskApi {
  const ctx = useContext(AskContext);
  if (!ctx) throw new Error('useAsk() called outside an AskProvider — the tree has no ask door (lib/worklist/askContext.tsx)');
  return ctx;
}
