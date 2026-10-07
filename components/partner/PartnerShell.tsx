'use client';
// components/partner/PartnerShell.tsx · CE-47 · PTN-A1 app · the frame of every partner and request page (outsiders' pages):
// the new layout's own tokens and rungs (scopeCss, typeCss from v2/lib/worklist/theme), the app's faces, Business
// Solutions' pieces (sol-*), light or dark by the phone's own setting. No vendor shell, no vendor session.
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { useEffect, useState } from 'react';
import { scopeCss, typeCss } from '@/v2/lib/worklist/theme';
import { SolutionsStyles } from '@/v2/components/solutions/SolutionsPieces';
import { W } from '@/lib/partner/words';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });
const brand = Cormorant_Garamond({ subsets: ['latin'], weight: ['500'] });

export function PartnerShell({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const q = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const set = () => setMode(q && q.matches ? 'dark' : 'light'); set();
    q?.addEventListener?.('change', set); return () => q?.removeEventListener?.('change', set);
  }, []);
  return (
    <div className="wl ptnx" data-wl-mode={mode} style={{ ['--font-inter' as string]: inter.style.fontFamily, minHeight: '100vh', background: 'var(--atelier-page-bg)', color: 'var(--atelier-ink)', fontFamily: inter.style.fontFamily }}>
      <style>{scopeCss('.ptnx') + typeCss('.ptnx') + CSS}</style>
      <SolutionsStyles />
      <main>
        <a href="/" className="px-brand" style={{ fontFamily: brand.style.fontFamily }}>{W.brand}</a>
        {children}
      </main>
    </div>
  );
}

const CSS = `.ptnx *{box-sizing:border-box}.ptnx main{padding:24px 16px 48px;max-width:560px;margin:0 auto}
.px-brand{display:block;font-weight:500;font-size:1.375rem;line-height:1.2;color:var(--atelier-ink);margin:0 0 24px;text-decoration:none}
.px-choice{display:flex;flex-direction:column;gap:12px;margin:16px 0 0}
.px-opt{display:flex;flex-direction:column;gap:4px;text-align:left;padding:16px;border:.5px solid var(--atelier-input-border);border-radius:12px;background:var(--atelier-card-bg);color:var(--atelier-ink);cursor:pointer;font:inherit}
.px-seg{display:flex;border:1px solid var(--atelier-card-border);border-radius:12px;overflow:hidden;margin:8px 0 16px}
.px-seg button{flex:1;min-height:44px;border:0;background:transparent;font:var(--wl-tb);color:var(--atelier-ink-mute);cursor:pointer}
.px-seg button.on{background:var(--atelier-card-bg);color:var(--atelier-ink);box-shadow:inset 0 -2px 0 var(--atelier-accent-text)}
.px-card{display:flex;flex-direction:column;gap:6px;padding:12px;border:.5px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);margin:0 0 12px}
.px-tag{font:var(--wl-t5);letter-spacing:.06em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px}
.px-field{display:flex;flex-direction:column;gap:6px;margin:0 0 16px}
.px-label{font:var(--wl-t4);color:var(--atelier-ink-soft)}
.px-input{min-height:48px;padding:12px;border:.5px solid var(--atelier-input-border);border-radius:12px;background:var(--atelier-input-bg);font:var(--wl-t3);color:var(--atelier-ink);width:100%}
.px-hint{font:var(--wl-t5);color:var(--atelier-ink-mute)}
.px-chips{display:flex;gap:8px;flex-wrap:wrap}
.px-chip{min-height:40px;padding:8px 14px;border-radius:20px;border:.5px solid var(--atelier-card-border);font:var(--wl-t4);color:var(--atelier-ink-soft);background:transparent;cursor:pointer}
.px-chip.on{border-color:var(--atelier-accent-text);color:var(--atelier-accent-text)}
.sol-btn.sol-btn--fill{background:var(--role-primary);color:var(--role-on-primary);border-color:transparent}
.px-link{background:none;border:0;padding:0;font:inherit;color:var(--atelier-accent-text);text-decoration:underline;text-underline-offset:3px;cursor:pointer}`;
