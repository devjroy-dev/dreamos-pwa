'use client';
// app/(frost)/frost/canvas/surprise/page.tsx
// Surprise Me — taste quiz on first open, full-bleed reveal after.
//
// First open: 10 curated images, like or skip.
// After quiz: full-bleed show of liked saves. Tap → tags + source.
// When Muse is empty post-quiz: empty state with Dream Ai prompt.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFrostMode } from '../../../layout';
import { MUSE_LOOKS, FF, SP, FR, EASE } from '../../../../../lib/frost/tokens';

declare const process: { env: { NEXT_PUBLIC_API_BASE?: string } };
const API_BASE = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) || 'https://dream-os-production.up.railway.app';

interface QuizImage {
  id: string;
  image_url: string;
  caption: string | null;
  aesthetic_tags: string[];
}

interface MuseSave {
  id: string;
  image_url: string | null;
  caption: string | null;
  aesthetic_tags: string[];
  source_url: string | null;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem('access_token'); } catch { return null; }
}
function getCoupleId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    return raw ? JSON.parse(raw)?.id : null;
  } catch { return null; }
}

export default function SurpriseMe() {
  const router = useRouter();
  const { look } = useFrostMode();
  const t = MUSE_LOOKS[look];

  // ── State ──────────────────────────────────────────────────────────────────
  const [phase, setPhase]           = useState<'loading'|'quiz'|'reveal'|'empty'>('loading');
  const [quizImages, setQuizImages] = useState<QuizImage[]>([]);
  const [quizIdx, setQuizIdx]       = useState(0);
  const [likedIds, setLikedIds]     = useState<string[]>([]);
  const [saves, setSaves]           = useState<MuseSave[]>([]);
  const [revealIdx, setRevealIdx]   = useState(0);
  const [showInfo, setShowInfo]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // ── Load on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      const token    = getToken();
      const coupleId = getCoupleId();
      if (!token || !coupleId) { setPhase('empty'); return; }

      try {
        const res  = await fetch(`${API_BASE}/api/v2/couple/quiz/images`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.quiz_done) {
          // Quiz done — load her Muse saves with images
          await loadSaves(token, coupleId);
        } else {
          setQuizImages(data.images || []);
          setPhase('quiz');
        }
      } catch {
        setPhase('empty');
      }
    }
    init();
  }, []);

  const loadSaves = useCallback(async (token: string, coupleId: string) => {
    try {
      const res  = await fetch(`${API_BASE}/api/v2/couple/muse/${coupleId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      const withImages = (data.saves || []).filter((s: MuseSave) => s.image_url);
      if (withImages.length === 0) {
        setPhase('empty');
      } else {
        // Shuffle for the surprise feel
        const shuffled = [...withImages].sort(() => Math.random() - 0.5);
        setSaves(shuffled);
        setRevealIdx(0);
        setPhase('reveal');
      }
    } catch {
      setPhase('empty');
    }
  }, []);

  // ── Quiz actions ───────────────────────────────────────────────────────────
  const handleLike = useCallback(() => {
    const img = quizImages[quizIdx];
    if (!img) return;
    setLikedIds(prev => [...prev, img.id]);
    next();
  }, [quizImages, quizIdx]);

  const handleSkip = useCallback(() => { next(); }, [quizIdx]);

  const next = useCallback(() => {
    if (quizIdx < quizImages.length - 1) {
      setQuizIdx(q => q + 1);
    } else {
      submitQuiz();
    }
  }, [quizIdx, quizImages.length]);

  const submitQuiz = useCallback(async () => {
    setSubmitting(true);
    const token    = getToken();
    const coupleId = getCoupleId();
    if (!token || !coupleId) { setPhase('empty'); return; }

    try {
      await fetch(`${API_BASE}/api/v2/couple/quiz/done`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked_ids: likedIds }),
      });
      await loadSaves(token, coupleId);
    } catch {
      setPhase('empty');
    }
    setSubmitting(false);
  }, [likedIds, loadSaves]);

  // ── Reveal swipe ───────────────────────────────────────────────────────────
  const prevReveal = useCallback(() => {
    setShowInfo(false);
    setRevealIdx(i => Math.max(0, i - 1));
  }, []);
  const nextReveal = useCallback(() => {
    setShowInfo(false);
    setRevealIdx(i => Math.min(saves.length - 1, i + 1));
  }, [saves.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) { setShowInfo(s => !s); return; }
    if (dx < 0) nextReveal();
    else prevReveal();
  };

  const bg = `linear-gradient(to bottom, ${t.dreamGradient[0]}, ${t.dreamGradient[1]})`;

  // ── Back button (shared) ───────────────────────────────────────────────────
  const BackBtn = () => (
    <button onClick={() => router.push('/frost')}
      style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 16px)', left: 16, zIndex: 50, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: 'none', borderRadius: FR.pill, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FF.label, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.9)', cursor: 'pointer' }}>
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      Back
    </button>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // LOADING
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === 'loading') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 24, color: 'rgba(245,240,232,0.6)', letterSpacing: 4 }}>…</div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // QUIZ
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === 'quiz') {
    const img      = quizImages[quizIdx];
    const progress = ((quizIdx) / quizImages.length) * 100;

    return (
      <div style={{ position: 'fixed', inset: 0, background: '#0C0A09', userSelect: 'none' }}>
        <BackBtn />

        {/* Progress bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.1)', zIndex: 10 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: t.brass, transition: `width 300ms ${EASE}` }} />
        </div>

        {/* Counter */}
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 16px)', right: 16, zIndex: 20, fontFamily: FF.label, fontSize: 9, letterSpacing: '0.2em', color: 'rgba(245,240,232,0.6)' }}>
          {quizIdx + 1} / {quizImages.length}
        </div>

        {/* Full-bleed image */}
        {img && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src={img.image_url} alt={img.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {/* Dark gradient overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />
          </div>
        )}

        {/* Caption + hint */}
        <div style={{ position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom,0px) + 120px)', left: 24, right: 24, zIndex: 20 }}>
          {img?.caption && (
            <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 20, color: 'rgba(245,240,232,0.9)', marginBottom: 8, lineHeight: 1.3 }}>{img.caption}</div>
          )}
          <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.2em', color: 'rgba(245,240,232,0.4)', textTransform: 'uppercase' }}>
            Tell us what moves you
          </div>
        </div>

        {/* Like / Skip buttons */}
        <div style={{ position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom,0px) + 32px)', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 32, zIndex: 20 }}>
          {/* Skip */}
          <button onClick={handleSkip} disabled={submitting}
            style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={24} color="rgba(245,240,232,0.8)" strokeWidth={1.5} />
          </button>
          {/* Like */}
          <button onClick={handleLike} disabled={submitting}
            style={{ width: 64, height: 64, borderRadius: 32, background: `rgba(191,160,77,0.25)`, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: `1px solid ${t.brass}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Heart size={24} color={t.brass} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // REVEAL — full-bleed saves, tap to show info, swipe to next
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === 'reveal') {
    const save = saves[revealIdx];

    return (
      <div style={{ position: 'fixed', inset: 0, background: '#0C0A09', userSelect: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setShowInfo(s => !s)}>

        <BackBtn />

        {/* Full-bleed image */}
        {save?.image_url && (
          <img src={save.image_url} alt={save.caption || ''} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        )}

        {/* Subtle vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />

        {/* Counter dots */}
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 20px)', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 20 }}>
          {saves.slice(0, Math.min(saves.length, 12)).map((_, i) => (
            <div key={i} style={{ width: i === revealIdx ? 16 : 4, height: 4, borderRadius: 2, background: i === revealIdx ? t.brass : 'rgba(255,255,255,0.3)', transition: `all 250ms ${EASE}` }} />
          ))}
        </div>

        {/* Info overlay — shown on tap */}
        {showInfo && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)', padding: `24px 24px calc(24px + env(safe-area-inset-bottom,0px))`, zIndex: 20 }}>
            {save?.caption && (
              <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 22, color: 'rgba(245,240,232,0.95)', marginBottom: 10, lineHeight: 1.3 }}>{save.caption}</div>
            )}
            {save?.aesthetic_tags && save.aesthetic_tags.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {save.aesthetic_tags.map((tag: string) => (
                  <span key={tag} style={{ fontFamily: FF.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.brass, padding: '3px 8px', border: `0.5px solid rgba(191,160,77,0.4)`, borderRadius: FR.pill }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {save?.source_url && (
              <a href={save.source_url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', textDecoration: 'none' }}>
                View source ↗
              </a>
            )}
          </div>
        )}

        {/* Prev / Next chevrons */}
        {revealIdx > 0 && (
          <button onClick={e => { e.stopPropagation(); prevReveal(); }}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 30, background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: 24, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft size={20} color="rgba(245,240,232,0.8)" strokeWidth={1.5} />
          </button>
        )}
        {revealIdx < saves.length - 1 && (
          <button onClick={e => { e.stopPropagation(); nextReveal(); }}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 30, background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: 24, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronRight size={20} color="rgba(245,240,232,0.8)" strokeWidth={1.5} />
          </button>
        )}

        {/* Hint — first load only */}
        {!showInfo && (
          <div style={{ position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom,0px) + 24px)', left: 0, right: 0, textAlign: 'center', zIndex: 20, pointerEvents: 'none' }}>
            <div style={{ fontFamily: FF.label, fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)' }}>Tap to reveal · Swipe to browse</div>
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EMPTY — Muse board empty after quiz, or not logged in
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', userSelect: 'none' }}>
      <BackBtn />
      <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 28, color: 'rgba(245,240,232,0.9)', textAlign: 'center', lineHeight: 1.3, marginBottom: SP.xl }}>
        Nothing to surprise you with yet.
      </div>
      <div style={{ fontFamily: FF.body, fontSize: 14, color: 'rgba(245,240,232,0.5)', textAlign: 'center', lineHeight: 1.7, marginBottom: SP.huge }}>
        Save images to Muse — from WhatsApp or the Muse canvas — and Surprise Me will curate them back to you.
      </div>
      <button onClick={() => router.push('/frost/canvas/dream?primer=Surprise+me+—+show+me+something+I+would+love&autoSend=1')}
        style={{ padding: '12px 28px', background: t.brass, border: 'none', borderRadius: FR.pill, fontFamily: FF.label, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1B1612', cursor: 'pointer' }}>
        Ask Dream Ai instead
      </button>
    </div>
  );
}
