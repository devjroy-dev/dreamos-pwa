'use client';
// app/(frost)/frost/canvas/assistance/page.tsx — BLOCK 20 · CONCIERGE s1 · THE SHEET.
//
// One sheet (R-41.2): date · city · area · the categories with a `Rs` each · the
// look · Send. After Send, S2 (§6.3 as drawn, #30–#31 struck).
//
// ── THE SHEET ITSELF LEFT THIS FILE AT CE-42 D3 s2 (FORK A, ruled a) ────────
// It lives at app/components/couple/AssistanceSheet.tsx and `/plan` (R-41.94)
// calls it too. This page is now the BRIDE LANE'S ARGUMENTS and nothing else:
// Wine Night, CanvasShell, signedIn, and a submit that POSTs to the bride door.
// Every vetoed byte, every field, the eleven rows and the sent card stayed with
// the component — none of them is spelled twice, and this file spells none.
//
// Tokens: the couple lane is pinned to Wine Night (lib/frost/tokens.ts:194); the
// values below are the sanctuary's own (sanctuary/page.tsx:788–:794) and
// settings.tsx:33–:40, TRANSCRIBED INTO THIS FILE UNCHANGED — they were consts
// in this module before the extraction and they are a palette argument now.
//
// NO `requireCity` HERE, AND THAT IS FORK 4's OTHER HALF. R-41.25's profile
// coalesce stands on this lane: a signed-in bride who leaves the field blank still
// files a request carrying her profile's city, so a guard would refuse a form that
// was never going to produce a cityless row. `/plan` sets it; this page does not.

import React from 'react';
import CanvasShell from '../../../../../components/frost/CanvasShell';
import AssistanceSheet, { SHEET_BYTES, type SheetPalette } from '@/app/components/couple/AssistanceSheet';
import { submitAssistanceRequest } from '@/lib/frost-api/assistance';

// Wine Night, transcribed
const WINE: SheetPalette = {
  bg:      'radial-gradient(ellipse 80% 45% at 80% 0%,rgba(196,133,106,.12) 0%,transparent 52%),linear-gradient(160deg,#1A0A0E 0%,#120608 40%,#0C0404 100%)',
  ink:     '#F5E5DC',
  inkSoft: 'rgba(245,229,220,.72)',
  inkMute: 'rgba(196,133,106,.50)',
  line:    'rgba(196,133,106,.14)',
  rowBg:   'rgba(196,133,106,.05)',
  rowBdr:  'rgba(196,133,106,.12)',
  checkOn: '#C4856A',
  refusalInk: '#C4856A',
  onTdwInk:   '#6B9E8F',
  colorScheme: 'dark',
  cta: {
    marginTop: 18, background: '#C4856A', color: '#1E0A0E', borderRadius: 999, padding: 14,
    textAlign: 'center', fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 11,
    letterSpacing: '.14em', textTransform: 'uppercase', cursor: 'pointer',
  },
  // The pill has never had a pressed state on this lane and does not grow one here.
  ctaPress: {},
  outlineBtn: {
    display: 'block', marginTop: 10, border: '1px solid rgba(196,133,106,.12)', borderRadius: 999,
    padding: 14, textAlign: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: 11,
    letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(245,229,220,.72)', textDecoration: 'none',
  },
};

export default function AssistanceCanvas() {
  return (
    <AssistanceSheet
      palette={WINE}
      copy={{
        title:       SHEET_BYTES.title,      // #7
        lede:        SHEET_BYTES.lede,       // #8
        sentHeading: SHEET_BYTES.title,      // #7 again — this lane's heading does not change on send
        sentLede:    SHEET_BYTES.sentLede,   // #22
        sentCard:    SHEET_BYTES.sentTitle,  // #23
      }}
      signedIn
      submit={async (body) => {
        const out = await submitAssistanceRequest(body);
        return out && out.ok ? 'sent' : 'error';
      }}
      chrome={(inner) => (
        <CanvasShell eyebrow="Sanctuary" backTo="/frost/canvas/sanctuary">{inner}</CanvasShell>
      )}
    />
  );
}
