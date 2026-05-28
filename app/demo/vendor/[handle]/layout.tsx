'use client';
// app/demo/vendor/[handle]/layout.tsx
// Demo vendor shell — exact port of the real vendor layout swipe pager.
// Three panels (left → right): STUDIO(0) · AI(1) · DISCOVER(2)
//   Studio  → /demo/vendor/[handle]/calendar
//   AI      → /demo/vendor/[handle]/studio
//   Discover→ /demo/vendor/[handle]/discover
// Swipe enabled only on the three panel roots, not sub-pages.

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '@/lib/vendor/ThemeContext';
import { useT } from '@/lib/vendor/ThemeContext';

const F = { display:'var(--font-italiana), "GFS Didot", Georgia, serif', label:'var(--font-jost), system-ui, sans-serif' };
const A = { brassWarm:'var(--atelier-label)', inkMute:'var(--atelier-ink-mute)' };
const EASE = 'cubic-bezier(0.22,1,0.36,1)';

type DemoMode = 'ai' | 'studio' | 'discover';

function modeFromPath(path: string, base: string): DemoMode {
  if (path === `${base}/studio` || path === base) return 'ai';
  if (
    path.startsWith(`${base}/discover`) ||
    path.startsWith(`${base}/portfolio`) ||
    path.startsWith(`${base}/collab`) ||
    path.startsWith(`${base}/featured`) ||
    path.startsWith(`${base}/couture`)
  ) return 'discover';
  return 'studio';
}

// Returns panel index — mirrors real vendor layout
function panelIndexForPath(path: string, base: string): number {
  const mode = modeFromPath(path, base);
  if (mode === 'ai')       return 1;
  if (mode === 'discover') return 2;
  return 0;
}

// Swipe is only active on the three panel roots, not sub-pages
function isSwipeRoot(path: string, base: string): boolean {
  return (
    path === `${base}/studio`  ||
    path === `${base}/calendar` ||
    path === `${base}/discover`
  );
}

function shouldSuppressPager(el: HTMLElement | null, stopAt: HTMLElement | null, dx: number): boolean {
  let node: HTMLElement | null = el;
  while (node && node !== stopAt) {
    const tag = node.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    const styles = window.getComputedStyle(node);
    const overflowX = styles.overflowX;
    if ((overflowX === 'auto' || overflowX === 'scroll') && node.scrollWidth > node.clientWidth) {
      const atLeft  = node.scrollLeft <= 0;
      const atRight = node.scrollLeft >= node.scrollWidth - node.clientWidth - 1;
      if (dx < 0 && !atRight) return true;
      if (dx > 0 && !atLeft)  return true;
    }
    node = node.parentElement;
  }
  return false;
}

const HORIZONTAL_LOCK_PX       = 8;
const VERTICAL_CANCEL_RATIO    = 0.65;
const COMMIT_DISTANCE_RATIO    = 0.25;
const COMMIT_VELOCITY_PX_PER_MS = 0.5;
const MAX_DRAG_RUBBERBAND      = 0.35;
const SNAP_DURATION_MS         = 260;

interface SubItem { href: string; label: string; glyph: string; }

function DemoBottomNav({ handle }: { handle: string }) {
  const pathname = usePathname() ?? '';
  const router   = useRouter();
  const T        = useT();
  const base     = `/demo/vendor/${handle}`;
  const mode     = modeFromPath(pathname, base);

  // No bottom nav on AI page or landing — PeekNav/landing handles it
  if (mode === 'ai') return null;
  const handlePathNav = `/vendor/${handle}`;
  if (pathname === base || pathname === base + '/' ||
      pathname === handlePathNav || pathname === handlePathNav + '/') return null;

  const STUDIO_ITEMS: SubItem[] = [
    { href:`${base}/calendar`, label:'Calendar',  glyph:'◐' },
    { href:`${base}/business`, label:'Business',  glyph:'≡' },
    { href:`${base}/more`,     label:'More',      glyph:'⋯' },
  ];
  const DISCOVER_ITEMS: SubItem[] = [
    { href:`${base}/portfolio`,      label:'Portfolio', glyph:'▣' },
    { href:`${base}/discover/leads`, label:'Leads',     glyph:'✉' },
    { href:`${base}/collab`,         label:'Collab',    glyph:'◇' },
  ];

  const items = mode === 'studio' ? STUDIO_ITEMS : DISCOVER_ITEMS;

  return (
    <nav style={{ position:'sticky', bottom:0, zIndex:9, background:T.headerBg, backdropFilter:'blur(28px) saturate(1.6)', WebkitBackdropFilter:'blur(28px) saturate(1.6)', borderTop:'0.5px solid rgba(201,168,76,0.18)', boxShadow:'0 -1px 0 rgba(255,235,200,0.04)', padding:'10px 8px calc(12px + env(safe-area-inset-bottom))', display:'flex', justifyContent:'space-around', alignItems:'flex-end' }}>
      {items.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        const color = active ? A.brassWarm : A.inkMute;
        return (
          <button key={item.label} type="button" onClick={() => router.push(item.href)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, background:'none', border:'none', cursor:'pointer', padding:'4px 8px', minWidth:56 }}>
            <span style={{ fontFamily:F.display, fontSize:22, lineHeight:1, color, transition:`color 200ms ${EASE}`, textShadow:active?'0 0 12px rgba(224,188,110,0.4)':'none' }}>{item.glyph}</span>
            <span style={{ fontFamily:F.label, fontWeight:300, fontSize:8, letterSpacing:'0.28em', textTransform:'uppercase', color, transition:`color 200ms ${EASE}` }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function DemoShell({ children }: { children: React.ReactNode }) {
  const params   = useParams();
  const handle   = typeof params.handle === 'string' ? params.handle : '';
  const pathname = usePathname() ?? '';
  const router   = useRouter();
  const base     = `/demo/vendor/${handle}`;
  // usePathname() returns the browser URL path (before middleware rewrite).
  // On demo.thedreamwedding.in/vendor/makeupbyswatiroy, pathname = /vendor/makeupbyswatiroy
  // but base = /demo/vendor/makeupbyswatiroy. Check both forms.
  const handlePath = `/vendor/${handle}`;
  const isLanding = pathname === base || pathname === base + '/' ||
                    pathname === handlePath || pathname === handlePath + '/';

  const PANEL_ROOTS = [
    `${base}/calendar`,
    `${base}/studio`,
    `${base}/discover`,
  ] as const;

  const currentPanelIdx = panelIndexForPath(pathname, base);
  const swipeEnabled    = !isLanding && isSwipeRoot(pathname, base);

  // Room classes for discover dark mode
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    [html, body].forEach(el => el.classList.remove('room-studio', 'room-discover'));
    if (currentPanelIdx === 0) [html, body].forEach(el => el.classList.add('room-studio'));
    if (currentPanelIdx === 2) [html, body].forEach(el => el.classList.add('room-discover'));
    return () => { [html, body].forEach(el => el.classList.remove('room-studio', 'room-discover')); };
  }, [currentPanelIdx]);

  const stageRef        = useRef<HTMLDivElement>(null);
  const startX          = useRef(0);
  const startY          = useRef(0);
  const startTime       = useRef(0);
  const isDragging      = useRef(false);
  const directionLocked = useRef(false);
  const touchTarget     = useRef<HTMLElement | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [transition,  setTransition] = useState('');

  useEffect(() => {
    setTransition('none');
    setDragOffset(0);
    isDragging.current = false;
    directionLocked.current = false;
  }, [pathname]);

  function onTouchStart(e: React.TouchEvent) {
    if (!swipeEnabled) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    startTime.current = performance.now();
    isDragging.current = false;
    directionLocked.current = false;
    touchTarget.current = e.target as HTMLElement;
    setTransition('none');
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!swipeEnabled) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (!directionLocked.current) {
      if (Math.abs(dx) < HORIZONTAL_LOCK_PX && Math.abs(dy) < HORIZONTAL_LOCK_PX) return;
      directionLocked.current = true;
      if (Math.abs(dy) > Math.abs(dx) * VERTICAL_CANCEL_RATIO) { isDragging.current = false; return; }
      if (shouldSuppressPager(touchTarget.current, stageRef.current, dx)) { isDragging.current = false; return; }
      isDragging.current = true;
    }
    if (!isDragging.current) return;
    const idx = currentPanelIdx;
    let offset = dx;
    if (dx < 0 && idx === PANEL_ROOTS.length - 1) offset = dx * MAX_DRAG_RUBBERBAND;
    if (dx > 0 && idx === 0)                       offset = dx * MAX_DRAG_RUBBERBAND;
    setDragOffset(offset);
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!swipeEnabled || !isDragging.current) { isDragging.current = false; directionLocked.current = false; return; }
    const dx       = e.changedTouches[0].clientX - startX.current;
    const dt       = Math.max(1, performance.now() - startTime.current);
    const velocity = Math.abs(dx) / dt;
    const width    = stageRef.current?.clientWidth ?? window.innerWidth;
    const idx      = currentPanelIdx;
    const pastDistance = Math.abs(dx) > width * COMMIT_DISTANCE_RATIO;
    const fastFlick    = velocity > COMMIT_VELOCITY_PX_PER_MS && Math.abs(dx) > 40;
    const shouldCommit = pastDistance || fastFlick;
    let targetIdx = idx;
    if (shouldCommit) {
      if (dx < 0 && idx < PANEL_ROOTS.length - 1) targetIdx = idx + 1;
      if (dx > 0 && idx > 0)                       targetIdx = idx - 1;
    }
    setTransition(`transform ${SNAP_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`);
    if (targetIdx !== idx) {
      const exitOffset = dx < 0 ? -width : width;
      setDragOffset(exitOffset);
      router.push(PANEL_ROOTS[targetIdx]);
    } else {
      setDragOffset(0);
    }
    isDragging.current = false;
    directionLocked.current = false;
  }

  const hasLeftNeighbour  = currentPanelIdx > 0;
  const hasRightNeighbour = currentPanelIdx < PANEL_ROOTS.length - 1;
  const dragProgress      = stageRef.current ? Math.abs(dragOffset) / stageRef.current.clientWidth : 0;
  const leftHintOpacity   = hasLeftNeighbour  && dragOffset > 0 ? Math.min(1, dragProgress * 3) : 0;
  const rightHintOpacity  = hasRightNeighbour && dragOffset < 0 ? Math.min(1, dragProgress * 3) : 0;

  // Landing page — no shell, position:fixed works freely
  if (isLanding) return <>{children}</>;

  return (
    <div style={{ height:'100dvh', width:'100%', overflowX:'clip', overflowY:'hidden', userSelect:'none', WebkitUserSelect:'none', background:'transparent', display:'flex', flexDirection:'column' }}>
      <div
        ref={stageRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={{
          flex:1, display:'flex', flexDirection:'column', minHeight:0, position:'relative',
          ...(dragOffset !== 0 ? { transform:`translateX(${dragOffset}px)` } : {}),
          transition,
          willChange: swipeEnabled && dragOffset !== 0 ? 'transform' : 'auto',
        }}
      >
        <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0, overflowY:'auto', overflowX:'hidden' }}>
          {children}
        </div>
        <DemoBottomNav handle={handle} />

        {/* Edge hints */}
        {swipeEnabled && (
          <>
            <div aria-hidden style={{ position:'fixed', left:0, top:0, bottom:0, width:3, background:'linear-gradient(90deg, rgba(201,168,76,0.55) 0%, transparent 100%)', opacity:leftHintOpacity, pointerEvents:'none', zIndex:50, transition:dragOffset===0?'opacity 200ms':'none' }} />
            <div aria-hidden style={{ position:'fixed', right:0, top:0, bottom:0, width:3, background:'linear-gradient(-90deg, rgba(201,168,76,0.55) 0%, transparent 100%)', opacity:rightHintOpacity, pointerEvents:'none', zIndex:50, transition:dragOffset===0?'opacity 200ms':'none' }} />
          </>
        )}
      </div>
    </div>
  );
}

export default function DemoVendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DemoShell>{children}</DemoShell>
    </ThemeProvider>
  );
}
