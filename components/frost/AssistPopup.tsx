'use client';
// components/frost/AssistPopup.tsx — BLOCK 20 · CONCIERGE s1 · THE POPUP (P1-popup).
//
// Mounted once in the sanctuary (the surface `/frost` resolves to). The RULE is
// lib/frost/assistPopup.ts (§6.1: once per login, dismissable, never after her
// first request, never after her second dismissal); this file only draws it.
// Shape: a bottom sheet over the sanctuary (R-41.28). Strings #1–#5 as vetoed
// 2026-09-08 (#3, #4 in the founder's words). No persona name in chrome.

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/frost-api/_base';
import { readAssistPopupFacts, shouldShowAssistPopup, markAssistPopupShown, markAssistPopupDismissed } from '@/lib/frost/assistPopup';

export const ASSIST_POPUP_STRINGS = {
  eyebrow: 'The Dream Wedding',                                                                          // #1
  title:   'Let us find your vendors.',                                                                  // #2
  body:    'Tell us your date, your city and what you need. We find and book your vendors for you \u2014 planners included.', // #3 (ruled)
  primary: 'Find my vendors',                                                                            // #4 (ruled)
  secondary: 'Not now',                                                                                  // #5
} as const;

export const ASSIST_SHEET_PATH = '/frost/canvas/assistance';

export default function AssistPopup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const facts = readAssistPopupFacts(getAccessToken());
    if (shouldShowAssistPopup(facts) && facts.loginKey) {
      markAssistPopupShown(facts.loginKey);
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const ink = '#F5E5DC', inkSoft = 'rgba(245,229,220,.72)', rowBdr = 'rgba(196,133,106,.12)', accent = '#C4856A';
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(10,4,5,.66)', display: 'flex', alignItems: 'flex-end' }}
      onClick={() => { markAssistPopupDismissed(); setOpen(false); }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-label={ASSIST_POPUP_STRINGS.title}
        style={{ width: '100%', background: '#1A0A0E', borderTop: `1px solid ${rowBdr}`, borderRadius: '22px 22px 0 0', padding: '26px 22px 30px' }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: accent }}>{ASSIST_POPUP_STRINGS.eyebrow}</div>
        <div style={{ fontFamily: "'Italianno',cursive", fontSize: 46, color: ink, lineHeight: 1, marginTop: 8 }}>{ASSIST_POPUP_STRINGS.title}</div>
        <div style={{ fontFamily: "'Fraunces',serif", fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: inkSoft, lineHeight: 1.6, marginTop: 6, fontFeatureSettings: '"opsz" 9' }}>{ASSIST_POPUP_STRINGS.body}</div>
        <div onClick={() => { setOpen(false); router.push(ASSIST_SHEET_PATH); }} role="button"
          style={{ marginTop: 20, background: accent, color: '#1E0A0E', borderRadius: 999, padding: 14, textAlign: 'center', fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', cursor: 'pointer' }}>
          {ASSIST_POPUP_STRINGS.primary}
        </div>
        <div onClick={() => { markAssistPopupDismissed(); setOpen(false); }} role="button"
          style={{ marginTop: 10, border: `1px solid ${rowBdr}`, borderRadius: 999, padding: 14, textAlign: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: inkSoft, cursor: 'pointer' }}>
          {ASSIST_POPUP_STRINGS.secondary}
        </div>
      </div>
    </div>
  );
}
