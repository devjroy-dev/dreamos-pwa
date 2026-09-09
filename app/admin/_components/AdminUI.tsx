'use client';
// app/admin/_components/AdminUI.tsx
// TDW Control Room — Editorial design system.
// Every page imports only from here. Change here, changes everywhere.

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode, DragEvent as ReactDragEvent } from 'react';
import { TYPE_ROLE } from '@/lib/worklist/theme';

const EASE = 'cubic-bezier(0.22,1,0.36,1)';

// ── Design tokens ─────────────────────────────────────────────────────────────
// R-41.71/.72/.75 — THE VALUES ARE GONE; THE NAMES ARE NOT.
//
// `T` used to hold navy, oxblood and warm ivory as literals, read at 522 sites in
// 16 files. Every key below now resolves to a var() emitted by lib/worklist/theme.ts
// — the same emitter the vendor rooms mount — so all 522 sites take the shell's
// colour without one of them being edited. The keys keep their names ON PURPOSE:
// `gold` has meant "the primary accent" here since CE-10 and is a symbol, not
// chrome (R-41.75); renaming it would be a 522-site diff carrying no meaning.
//
// WHY A JS OBJECT OF var() STRINGS AND NOT A SECOND TOKEN FILE. R-41.72 ruled one
// home and one read-path: these are not values, they are POINTERS at the home. A
// site reading T.ink emits `color: var(--atelier-ink)` — the same string the
// vendor rooms write by hand. If the shell retints, this file changes nothing.
//
// THE FOUR THAT DIED (⊘-2, R-40.129 ①): goldSoft, dangerSoft, successSoft and the
// tinted disabled ground were role colours used as GROUNDS. A role is an ink and
// an edge, never a fill. They are kept as keys pointing at `transparent` rather
// than deleted, because deleting them is a 28-site diff in pages this rider does
// not open — and a key that renders nothing is honest, where a key that renders a
// pink slab is not. The pages that read them are re-tokened in E2 (iii)–(v) and
// the keys go when their last reader does.
export const T = {
  // Grounds
  bg:           'var(--atelier-page-bg)',
  surface:      'var(--atelier-card-bg)',
  card:         'var(--atelier-card-bg)',
  cardHover:    'var(--atelier-row-hover)',
  sheet:        'var(--atelier-sheet-bg)',

  // Hairlines, two weights. Focus is the shell's accent, not a third edge colour.
  border:       'var(--atelier-card-border)',
  borderStrong: 'var(--atelier-sheet-border)',
  borderFocus:  'var(--atelier-accent-text)',

  // The accent. `gold` is the key's name and teal is its value: the cockpit's
  // primary is the shell's primary, and the oxblood is gone with the navy.
  gold:         'var(--atelier-accent-text)',
  goldDim:      'var(--atelier-ink-mute)',
  goldSoft:     'transparent',

  // The ink ladder — five rungs, the shell's own.
  ink:          'var(--atelier-ink)',
  soft:         'var(--atelier-ink-soft)',
  muted:        'var(--atelier-ink-mute)',
  dim:          'var(--atelier-ink-fade)',

  // Roles. Inks and edges only.
  danger:       'var(--role-critical)',
  dangerSoft:   'transparent',
  success:      'var(--role-positive)',
  successSoft:  'transparent',
  warning:      'var(--role-caution)',
  metal:        'var(--role-metal)',
  onAccent:     'var(--role-ink-deep)',

  // Fonts. R-41.77 put type in scope: the shell runs two families and six rungs,
  // and Jost is retired (R-38.4). `label` is kept as a key and points at the body
  // family so the 211 call sites that name it do not each need editing in this
  // rider; the rungs replace the sizes group by group in E2 (ii)–(v).
  // TYPE_ROLE is imported, not transcribed: typeCss emits the rungs as whole font
  // shorthands (--wl-t0…t5), so there is no --wl-tN-family to read and a var() here
  // would have resolved to its fallback forever — a pointer that never points is a
  // hollow green. The two families come from the same export the rungs are built
  // from, so this file still holds no font name of its own.
  ff: {
    display: TYPE_ROLE.feature,
    body:    TYPE_ROLE.body,
    label:   TYPE_ROLE.body,
  },
};

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, sub, action }: {
  title: string; sub?: string; action?: ReactNode;
}) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32, gap:16 }}>
      <div>
        <h1 style={{ fontFamily:T.ff.body, fontWeight:700, fontSize:27, color:T.ink, lineHeight:1.1, margin:0, letterSpacing:'-0.015em' }}>{title}</h1>
        {/* R-B1 limb 2 — THE ROSE EYEBROW DIES HERE, at its one true site.
            Rose #C44058 measured 3.31:1 on the retiring navy and 3.84:1 on the
            espresso ground — better, and still under the 4.5 body bar both times.
            tokens.css's own P1 header convicted it once; R-B1's arithmetic
            convicts it again. `--atelier-ink-mute` measures 5.73:1.
            WIDENING DISCLOSED: PageHeader is shared by 16 admin screens, so this
            ONE PROPERTY moves the eyebrow on all of them. That is a strict gain
            everywhere and is why it was not localised to the Bridge — 15 screens
            wearing a sub-bar rose eyebrow on an espresso ground would fail the
            founder's own smoke test ("the same house as his vendor app"). It is
            a widening of the ruled scope and is RATIFY-OR-REVERT.
            NOT IN SCOPE, named so the silence is not misread: six other T.goldDim
            sites in this file (a disabled button, two field-focus labels, a select
            chevron, a section divider) are NOT eyebrows and are NOT touched. They
            belong to whatever sitting re-values T itself. */}
        {sub && (
          <p style={{ fontFamily:T.ff.label, fontWeight:600, fontSize:10, color:'var(--atelier-ink-mute)', letterSpacing:'0.14em', textTransform:'uppercase', marginTop:9, marginBottom:0 }}>{sub}</p>
        )}
      </div>
      {action && <div style={{ flexShrink:0, marginTop:4 }}>{action}</div>}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, accent }: {
  label: string; value: string | number; sub?: string; accent?: boolean;
}) {
  return (
    <div style={{ background:T.card, border:`0.5px solid ${accent ? T.borderStrong : T.border}`, borderRadius:14, padding:'20px 22px', position:'relative', overflow:'hidden' }}>
      {accent && <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:`linear-gradient(to right, ${T.gold}, transparent)` }} />}
      <div style={{ fontFamily:T.ff.label, fontWeight:600, fontSize:10, color:T.soft, letterSpacing:'0.13em', textTransform:'uppercase', marginBottom:12 }}>{label}</div>
      <div style={{ fontFamily:T.ff.body, fontWeight:700, fontSize:38, color:accent ? T.gold : T.ink, lineHeight:1, letterSpacing:'-0.03em' }}>{value}</div>
      {sub && <div style={{ fontFamily:T.ff.body, fontWeight:400, fontSize:12, color:T.muted, marginTop:9 }}>{sub}</div>}
    </div>
  );
}

// ── GoldBtn ───────────────────────────────────────────────────────────────────
export function GoldBtn({ label, onClick, disabled, small }: {
  label: string; onClick: () => void; disabled?: boolean; small?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        // R-41.75 — the shell's `.wl-btn.pri` (components/worklist/WorklistShell.tsx:251,257),
        // carried by value because that rule lives in a room's CSS and cannot be
        // imported. A digest cell holds the donor honest.
        // DISABLED IS THE GHOST SHAPE, NOT THE FILLED ONE AT HALF OPACITY. F-41.66:
        // the shell's own `:disabled{opacity:.5}` over an accent ground gives a muddy
        // slab that still reads as the page's main action. The shell's cure is the
        // shell seat's; the cockpit does not wait for it.
        background: disabled ? 'transparent' : T.gold,
        border: disabled ? `0.5px solid ${T.border}` : '0.5px solid transparent',
        borderRadius: 3,
        padding: small ? '0 12px' : '0 16px',
        font: small ? 'var(--wl-t5)' : 'var(--wl-t4)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: disabled ? T.muted : T.onAccent,
        minHeight: small ? 36 : 44,
        cursor: disabled ? 'not-allowed' : 'pointer',
        whiteSpace: 'nowrap',
        transform: pressed && !disabled ? 'scale(0.97)' : 'scale(1)',
        transition: `all 120ms ${EASE}`,
        // The oxblood glow dies with the oxblood (⊘-3, R-40.60): a shadow in an
        // accent colour is decoration, and the shell draws none.
        boxShadow: 'none',
      }}
    >
      {label}
    </button>
  );
}

// ── GhostBtn ──────────────────────────────────────────────────────────────────
export function GhostBtn({ label, onClick, danger, small, disabled }: {
  label: string; onClick: () => void; danger?: boolean; small?: boolean; disabled?: boolean;
}) {
  const [hov, setHov] = useState(false);
  const col = danger ? T.danger : T.soft;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        // The shell's `.gho` / `.dan` (components/worklist/StudioSheets.tsx:468-469).
        // They live in a room's SHEET_CSS rather than the shell's own register —
        // F-41.47, the P7.2 hoist missed two classes — so they are carried by value
        // here and the hoist stays the shell seat's to cut.
        background: hov && !disabled ? 'var(--atelier-row-hover)' : 'transparent',
        border: `0.5px solid ${danger ? T.danger : T.border}`,
        borderRadius: 3,
        padding: small ? '0 12px' : '0 16px',
        font: small ? 'var(--wl-t5)' : 'var(--wl-t4)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: col, minHeight: small ? 36 : 44,
        whiteSpace: 'nowrap', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: `all 150ms ${EASE}`,
      }}
    >
      {label}
    </button>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
// ── ActionChip ────────────────────────────────────────────────────────────────
// One-tap on-card action. Replaces slide-up sheets for approve/deny/revoke.
export function ActionChip({ label, tone, onClick, disabled }: {
  label: string; tone: 'ok' | 'no' | 'neutral'; onClick: () => void; disabled?: boolean;
}) {
  // ⊘-2, R-40.129 ① — THE TINTED GROUND DIES. `successSoft` / `dangerSoft` /
  // `goldSoft` were role colours used as fills; a role is an ink and an edge. The
  // tone now reaches the edge and the label only, which is the shape the vendor
  // rooms' own verbs already draw.
  const map = { ok: T.success, no: T.danger, neutral: T.gold } as const;
  const c = map[tone];
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); if (!disabled) onClick(); }}
      disabled={disabled}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
      style={{
        flex: 1, background: 'transparent',
        border: `0.5px solid ${disabled ? T.border : c}`,
        color: disabled ? T.muted : c,
        font: 'var(--wl-t5)', letterSpacing: '0.08em', textTransform: 'uppercase',
        borderRadius: 3, minHeight: 44, cursor: disabled ? 'not-allowed' : 'pointer',
        transform: pressed && !disabled ? 'scale(0.97)' : 'scale(1)',
        transition: `all 120ms ${EASE}`,
      }}
    >{label}</button>
  );
}

// ── ActionLink ────────────────────────────────────────────────────────────────
// ActionChip's twin for a destination that LEAVES THE APP.
//
// WHY A SECOND PRIMITIVE AND NOT A PROP ON THE FIRST (CE-225, FORK C ruled).
// ActionChip is a <button>. A button cannot carry `target` or `rel`; opening a
// new context from one means an onClick calling window.open, which a phone's
// popup blocker may swallow and which loses the anchor's native long-press,
// copy-link and open-in-app affordances. So the element itself has to change,
// and an element swap is a new component, not a flag.
//
// The alternative ruled against was an inline <a> in each consuming page. Two
// copies of a security-relevant attribute pair is how one of them later drifts
// without the other: `rel="noopener noreferrer"` lives HERE, once, and no
// consumer is trusted to remember it.
//
// STYLE IS ActionChip's, DELIBERATELY BYTE-FOR-BYTE — same tone map, same
// fontSize/letterSpacing/borderRadius, the same 44px minHeight tap target and
// the same press-scale. It sits in the same verb row as `Send welcome` and
// `Delete` and must be indistinguishable from them; a founder should not be
// able to tell that one of his three chips is a different HTML element.
// The three additions an anchor needs and a button does not are display/align/
// justify (a button centres its own text, an anchor does not) and
// textDecoration: 'none'.
//
// stopPropagation matches ActionChip's: these live inside rows whose own
// onClick toggles expansion, so a tap that reaches the parent would collapse
// the drawer out from under the founder's thumb as he leaves for WhatsApp.
export function ActionLink({ label, tone, href }: {
  label: string; tone: 'ok' | 'no' | 'neutral'; href: string;
}) {
  // ⊘-2, R-40.129 ① — THE TINTED GROUND DIES. `successSoft` / `dangerSoft` /
  // `goldSoft` were role colours used as fills; a role is an ink and an edge. The
  // tone now reaches the edge and the label only, which is the shape the vendor
  // rooms' own verbs already draw.
  const map = { ok: T.success, no: T.danger, neutral: T.gold } as const;
  const c = map[tone];
  const [pressed, setPressed] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => { e.stopPropagation(); }}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
      style={{
        flex: 1, background: 'transparent',
        border: `0.5px solid ${c}`,
        color: c,
        font: 'var(--wl-t5)', letterSpacing: '0.08em', textTransform: 'uppercase',
        borderRadius: 3, minHeight: 44, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: `all 120ms ${EASE}`,
      }}
    >{label}</a>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
// ── F-08.42 LIMB 2 · CE-RULED FORK 2(D) ──────────────────────────────────────
// WAS: `useEffect(() => { const t = setTimeout(onDone, 3000); ... }, [onDone])`
// with every call site passing an INLINE ARROW. A new arrow identity on every
// parent render meant the effect tore down and re-armed on every render — so on
// a surface that re-renders at all often, the three seconds never elapsed and
// the toast did not dismiss; and where it did, it expired three seconds after
// the LAST unrelated render rather than after the message appeared.
//
// NOW: the timer is keyed on MESSAGE IDENTITY and `onDone` is read through a
// ref, so the callback's identity cannot restart the clock. Visibility is a
// prop — an empty message renders nothing — so this component is safe to mount
// UNCONDITIONALLY, which is the shape this sitting's own surface adopts.
//
// WHAT THIS DOES NOT CURE, STATED HERE RATHER THAN DISCOVERED LATER:
// the React equal-value bail lives in the PAGE's `useState`, not here. When a
// second identical action writes the same string inside the window, `Object.is`
// bails and NO render occurs — this component receives no signal and cannot.
// What changes is that the toast is now reliably on screen for its full three
// seconds (and, with LIMB 1 cured, on screen AT ALL), which was the symptom.
// Closing the bail itself means touching the call sites — F-08.48's arc.
//
// REACH: fifteen of thirty-one admin toast surfaces. Ten shadow this component
// with a local `function Toast` carrying this same defect, and six more render
// their own chrome. F-08.48 holds the rest; see the handover.
export function Toast({ msg, onDone, error }: { msg: string; onDone: () => void; error?: boolean }) {
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const shown = !!msg;
  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => doneRef.current(), 3000);
    return () => clearTimeout(t);
  }, [msg, shown]);
  if (!shown) return null;
  return (
    <div style={{
      // ── F-10.55 CURED · EVERY ADMIN CONFIRMATION HID BEHIND THE DOMAIN BAR ──
      // THIS READ: `bottom: calc(env(safe-area-inset-bottom,0px) + 28px)`.
      // The mobile domain bar (app/admin/layout.tsx, `#m-domains`) is
      // `position:fixed; bottom:0` and stands ~60px tall plus its own safe-area
      // inset — more than twice this reserve. So on a phone the toast rendered
      // UNDER the bar and the founder saw a faint line where his confirmation
      // should have been. Witnessed twice on his own handset: once on a deck
      // rejection, once on an approval.
      //
      // IDENTICAL ARITHMETIC TO THE MINT SHEET'S BUTTON, which the P3 rider had
      // already cured in MintSheet.tsx — and the executor fixed the caller
      // without asking where else the same 28px was standing. One site cured, a
      // shared component left carrying the same defect for every other screen.
      //
      // WIDENING DISCLOSED, RATIFY-OR-REVERT: `Toast` is used across the admin,
      // so this ONE property moves every admin confirmation on mobile. That is a
      // strict gain everywhere — no screen wants its toast under the nav — and it
      // is why it was cured here rather than localised again. Desktop is
      // unaffected: `#m-domains` is display:none above 768px, and the extra
      // offset simply lifts the toast a little.
      position:'fixed', bottom:'calc(env(safe-area-inset-bottom,0px) + 76px)',
      left:'50%', transform:'translateX(-50%)',
      background: error ? 'var(--atelier-sheet-bg)' : 'var(--atelier-sheet-bg)',
      border:`0.5px solid ${error ? T.danger : T.success}`,
      color: error ? T.danger : T.success,
      fontFamily:T.ff.label, fontSize:11, fontWeight:300, letterSpacing:'0.14em',
      padding:'11px 22px', borderRadius:100, zIndex:9999,
      whiteSpace:'nowrap', boxShadow:'0 8px 40px var(--role-scrim)',
      animation:`toastIn 240ms ${EASE} both`,
    }}>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
      {msg}
    </div>
  );
}

// ── FieldInput ────────────────────────────────────────────────────────────────
export function FieldInput({ label, value, onChange, placeholder, type = 'text', hint }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:7 }}>
        <label style={{ fontFamily:T.ff.label, fontWeight:300, fontSize:8, color: focused ? T.goldDim : T.soft, letterSpacing:'0.26em', textTransform:'uppercase', transition:`color 200ms ${EASE}` }}>{label}</label>
        {hint && <span style={{ fontFamily:T.ff.body, fontSize:10, color:T.dim }}>{hint}</span>}
      </div>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width:'100%',
          background: focused ? 'var(--atelier-input-bg)' : 'var(--atelier-card-bg)',
          border:`0.5px solid ${focused ? T.borderFocus : T.border}`,
          borderRadius:9, padding:'12px 14px',
          fontFamily:T.ff.body, fontSize:14, fontWeight:300, color:T.ink,
          outline:'none', minHeight:46,
          transition:`all 200ms ${EASE}`,
          boxShadow: focused ? `0 0 0 3px var(--atelier-row-hover)` : 'none',
        }}
      />
    </div>
  );
}

// ── FieldSelect ───────────────────────────────────────────────────────────────
// `hint` JOINS THE SIGNATURE (V1). `FieldInput` has carried a hint slot since it
// was written; this component never did — so a required-field affordance could
// reach three of the create form's four required fields and not the fourth.
// The slot renders right of the label in the same geometry FieldInput uses, so
// the two read as one form rather than as two components.
export function FieldSelect({ label, value, onChange, options, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:18, position:'relative' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:7 }}>
        <label style={{ fontFamily:T.ff.label, fontWeight:300, fontSize:8, color: focused ? T.goldDim : T.soft, letterSpacing:'0.26em', textTransform:'uppercase', transition:`color 200ms ${EASE}` }}>{label}</label>
        {hint && <span style={{ fontFamily:T.ff.body, fontSize:10, color:T.dim }}>{hint}</span>}
      </div>
      <div style={{ position:'relative' }}>
        <select
          value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width:'100%',
            background: focused ? 'var(--atelier-input-bg)' : 'var(--atelier-sheet-bg)',
            border:`0.5px solid ${focused ? T.borderFocus : T.border}`,
            borderRadius:9, padding:'12px 36px 12px 14px',
            fontFamily:T.ff.body, fontSize:14, fontWeight:300, color:T.ink,
            outline:'none', minHeight:46, appearance:'none',
            transition:`all 200ms ${EASE}`,
            boxShadow: focused ? `0 0 0 3px var(--atelier-row-hover)` : 'none',
            cursor:'pointer',
          }}
        >
          {options.map(o => <option key={o.value} value={o.value} style={{ background:'var(--atelier-sheet-bg)' }}>{o.label}</option>)}
        </select>
        {/* Custom chevron */}
        <span style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:T.goldDim, fontSize:11, fontFamily:T.ff.label }}>▾</span>
      </div>
    </div>
  );
}

// ── BottomSheet ───────────────────────────────────────────────────────────────
// Fully fixed. Scroll lock, drag-to-dismiss, correct z stacking, no content jump.
export function BottomSheet({ visible, onClose, title, children }: {
  visible: boolean; onClose: () => void; title: string; children: ReactNode;
}) {
  const sheetRef  = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);
  const [dragY,   setDragY]   = useState(0);
  const isDragging = useRef(false);

  // Body scroll lock
  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [visible]);

  // Drag to dismiss
  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientY;
    isDragging.current = true;
    setDragY(0);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dy = e.touches[0].clientY - dragStart.current;
    if (dy > 0) { e.preventDefault(); setDragY(dy); }
  };
  const onTouchEnd = () => {
    isDragging.current = false;
    if (dragY > 100) { setDragY(0); onClose(); }
    else setDragY(0);
  };

  const translateY = visible
    ? dragY > 0 ? `translateY(${dragY}px)` : 'translateY(0)'
    : 'translateY(105%)';

  const opacity = dragY > 0 ? Math.max(0, 1 - dragY / 300) : 1;

  // ── F-41.40 · THE SHEET GOES THROUGH A PORTAL, ESTATE-WIDE ─────────────────
  // `position:fixed` is positioned against the nearest ancestor with a transform,
  // not against the viewport. The admin content wrapper animates with `fade-up`,
  // so it CREATES A STACKING CONTEXT and every fixed child of it — this sheet and
  // its scrim — was trapped under the bottom bar (zIndex 195) no matter what
  // zIndex the sheet declared. A9 shipped a padding cure and it did not hold on
  // the founder's glass; seat A named the true cause in the same handover and
  // shipped the weaker fix anyway (its own close note, §3.6).
  // A portal to document.body takes the sheet OUT of that ancestor, which is the
  // only thing that actually removes the trap. No zIndex value changes here.
  // SSR: document does not exist during the server render, so the portal waits
  // for mount. Before mount the sheet renders nothing — it is only ever open in
  // response to a tap, which cannot happen on the server.
  const body = typeof document === 'undefined' ? null : document.body;

  const sheet = (
    <>
      <style>{`@keyframes sheetIn{from{transform:translateY(105%)}to{transform:translateY(0)}}`}</style>

      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0, zIndex:300,
          background:'var(--atelier-overlay)',
          backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
          opacity: visible ? opacity : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: dragY > 0 ? 'none' : `opacity 300ms ${EASE}`,
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position:'fixed', bottom:0, left:0, right:0, zIndex:301,
          // ⊘-3 — THE SHEET'S GRADIENT DIES. The shell is flat: one sheet ground, and the
          // shell's own sheet draws sheet-top → sheet-bot only where it lifts off the
          // page. Here it was two espresso stops nobody could name apart on a phone.
          background:'var(--atelier-sheet-bg)',
          border:`0.5px solid ${T.border}`,
          borderTop:`0.5px solid ${T.borderStrong}`,
          borderRadius:'20px 20px 0 0',
          maxHeight:'92vh', overflowY:'auto', overflowX:'hidden',
          scrollbarWidth:'none',
          transform: translateY,
          transition: isDragging.current ? 'none' : `transform 380ms ${EASE}`,
          paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 28px)',
          touchAction:'pan-y',
        }}
      >
        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', paddingTop:14, paddingBottom:4, flexShrink:0 }}>
          <div style={{ width:40, height:4, borderRadius:2, background:T.border }} />
        </div>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 24px 20px', borderBottom:`0.5px solid ${T.border}`, marginBottom:24 }}>
          <span style={{ fontFamily:T.ff.display, fontStyle:'italic', fontSize:24, fontWeight:300, color:T.ink, letterSpacing:'-0.01em' }}>{title}</span>
          <button
            onClick={onClose}
            style={{ background:'var(--atelier-card-bg)', border:`0.5px solid ${T.border}`, borderRadius:'50%', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:T.soft, fontSize:14, flexShrink:0, transition:`all 150ms ${EASE}` }}
          >✕</button>
        </div>

        {/* Content */}
        <div style={{ padding:'0 24px' }}>{children}</div>
      </div>
    </>
  );

  return body ? createPortal(sheet, body) : null;
}

// ── UploadZone ────────────────────────────────────────────────────────────────
export function UploadZone({ onFile, onUrl, loading, accept = 'image/*' }: {
  onFile: (file: File) => Promise<void>;
  onUrl:  (url: string) => Promise<void>;
  loading: boolean;
  accept?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab,      setTab]      = useState<'file'|'url'>('file');
  const [url,      setUrl]      = useState('');
  const [dragging, setDragging] = useState(false);
  const [urlFocus, setUrlFocus] = useState(false);

  const handleDrop = (e: ReactDragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <div style={{ background:T.card, border:`0.5px solid ${T.border}`, borderRadius:14, padding:20, marginBottom:24 }}>
      {/* Tab switcher */}
      <div style={{ display:'flex', gap:8, marginBottom:16, background:'var(--atelier-card-bg)', borderRadius:9, padding:3 }}>
        {(['file','url'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'9px 0', background: tab===t ? T.card : 'transparent', border: tab===t ? `0.5px solid ${T.border}` : 'none', borderRadius:7, fontFamily:T.ff.label, fontSize:9, fontWeight: tab===t ? 300 : 200, letterSpacing:'0.2em', textTransform:'uppercase', color: tab===t ? T.gold : T.muted, cursor:'pointer', minHeight:36, transition:`all 150ms ${EASE}` }}>
            {t === 'file' ? 'From Device' : 'From URL'}
          </button>
        ))}
      </div>

      {tab === 'file' ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{ border:`1px dashed ${dragging ? T.gold : T.borderStrong}`, borderRadius:11, padding:'32px 20px', textAlign:'center', cursor:'pointer', background: dragging ? T.goldSoft : 'transparent', transition:`all 200ms ${EASE}`, minHeight:120, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}
        >
          {loading ? (
            <div style={{ fontFamily:T.ff.label, fontSize:10, color:T.gold, letterSpacing:'0.2em' }} className="shimmer">Uploading…</div>
          ) : (
            <>
              <div style={{ fontSize:22, opacity:0.4, color:T.ink }}>↑</div>
              <div style={{ fontFamily:T.ff.body, fontSize:13, color:T.soft }}>Tap to choose or drag & drop</div>
              <div style={{ fontFamily:T.ff.label, fontSize:8, color:T.muted, letterSpacing:'0.18em' }}>JPG · PNG · WEBP</div>
            </>
          )}
          <input ref={fileRef} type="file" accept={accept} style={{ display:'none' }} onChange={e => { const f=e.target.files?.[0]; if(f)onFile(f); e.target.value=''; }} />
        </div>
      ) : (
        <div style={{ display:'flex', gap:10 }}>
          <input
            value={url} onChange={e => setUrl(e.target.value)}
            onFocus={() => setUrlFocus(true)}
            onBlur={() => setUrlFocus(false)}
            placeholder="https://res.cloudinary.com/…"
            style={{ flex:1, background: urlFocus ? 'var(--atelier-input-bg)' : 'var(--atelier-card-bg)', border:`0.5px solid ${urlFocus ? T.borderFocus : T.border}`, borderRadius:9, padding:'12px 14px', fontFamily:T.ff.body, fontSize:13, color:T.ink, outline:'none', minHeight:46, transition:`all 200ms ${EASE}` }}
          />
          <GoldBtn label={loading ? '…' : 'Add'} onClick={() => { if(url.trim()){onUrl(url.trim());setUrl('');} }} disabled={!url.trim()||loading} />
        </div>
      )}
    </div>
  );
}

// ── ImageGrid ─────────────────────────────────────────────────────────────────
export type ImageGridItem = {
  id: string; image_url: string; caption?: string | null;
  active: boolean; display_order?: number; sort_order?: number;
  extra?: ReactNode;
};

export function ImageGrid({ items, onToggle, onDelete }: {
  items: ImageGridItem[];
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmId, setConfirmId] = useState<string|null>(null);

  if (items.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'52px 24px', color:T.muted }}>
        <div style={{ fontFamily:T.ff.display, fontStyle:'italic', fontSize:20, marginBottom:8, color:T.soft }}>No images yet</div>
        <div style={{ fontFamily:T.ff.label, fontSize:9, letterSpacing:'0.22em' }}>Upload above to get started</div>
      </div>
    );
  }

  return (
    <>
      {confirmId && (
        <div onClick={() => setConfirmId(null)} style={{ position:'fixed', inset:0, background:'var(--atelier-overlay)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:24, backdropFilter:'blur(8px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'var(--atelier-sheet-bg)', border:`0.5px solid ${T.border}`, borderRadius:18, padding:28, maxWidth:320, width:'100%' }}>
            <div style={{ fontFamily:T.ff.display, fontStyle:'italic', fontSize:22, color:T.ink, marginBottom:8 }}>Delete image?</div>
            <div style={{ fontFamily:T.ff.body, fontSize:13, color:T.soft, marginBottom:24, lineHeight:1.6 }}>This also removes it from Cloudinary. Cannot be undone.</div>
            <div style={{ display:'flex', gap:10 }}>
              <GhostBtn label="Cancel" onClick={() => setConfirmId(null)} />
              <GhostBtn label="Delete" onClick={() => { onDelete(confirmId); setConfirmId(null); }} danger />
            </div>
          </div>
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
        {items.map(item => (
          <div key={item.id} style={{ background:T.card, border:`0.5px solid ${item.active ? T.borderStrong : T.border}`, borderRadius:13, overflow:'hidden', opacity:item.active ? 1 : 0.45, transition:`all 200ms ${EASE}` }}>
            <div style={{ aspectRatio:'3/4', position:'relative', overflow:'hidden', background:'var(--atelier-section-bg)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} loading="lazy" />
              {!item.active && (
                <div style={{ position:'absolute', inset:0, background:'var(--role-scrim)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontFamily:T.ff.label, fontSize:8, letterSpacing:'0.22em', color:'var(--atelier-ink-mute)', textTransform:'uppercase' }}>Inactive</span>
                </div>
              )}
            </div>
            {item.caption && <div style={{ padding:'8px 10px 4px', fontFamily:T.ff.body, fontSize:11, color:T.soft }}>{item.caption}</div>}
            {item.extra && <div style={{ padding:'4px 10px' }}>{item.extra}</div>}
            <div style={{ display:'flex', borderTop:`0.5px solid ${T.border}` }}>
              <button onClick={() => onToggle(item.id, item.active)} style={{ flex:1, padding:'11px 0', background:'transparent', border:'none', borderRight:`0.5px solid ${T.border}`, fontFamily:T.ff.label, fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', color:item.active ? T.gold : T.soft, minHeight:42, cursor:'pointer', transition:`color 150ms ${EASE}` }}>
                {item.active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => setConfirmId(item.id)} style={{ flex:1, padding:'11px 0', background:'transparent', border:'none', fontFamily:T.ff.label, fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', color:T.danger, minHeight:42, cursor:'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── LoadingGrid ───────────────────────────────────────────────────────────────
export function LoadingGrid() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
      {[1,2,3,4].map(i => (
        <div key={i} className="shimmer" style={{ background:T.card, border:`0.5px solid ${T.border}`, borderRadius:13, aspectRatio:'3/4' }} />
      ))}
    </div>
  );
}

// ── SectionDivider ────────────────────────────────────────────────────────────
export function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, margin:'32px 0 22px' }}>
      <div style={{ flex:1, height:'0.5px', background:`linear-gradient(to right, transparent, ${T.border})` }} />
      <span style={{ fontFamily:T.ff.label, fontWeight:200, fontSize:8, color:T.goldDim, letterSpacing:'0.34em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{label}</span>
      <div style={{ flex:1, height:'0.5px', background:`linear-gradient(to left, transparent, ${T.border})` }} />
    </div>
  );
}

// ── Counter ───────────────────────────────────────────────────────────────────
export function Counter({ current, max }: { current: number; max: number }) {
  const pct  = Math.min(100, (current / max) * 100);
  const full = current >= max;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, background:T.card, border:`0.5px solid ${full ? T.gold : T.border}`, borderRadius:10, padding:'12px 16px', marginBottom:20 }}>
      <div style={{ flex:1, height:3, background:T.border, borderRadius:2, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background: full ? T.gold : T.muted, borderRadius:2, transition:`width 500ms ${EASE}` }} />
      </div>
      <span style={{ fontFamily:T.ff.label, fontSize:10, fontWeight:200, color: full ? T.gold : T.soft, letterSpacing:'0.12em', whiteSpace:'nowrap', flexShrink:0 }}>{current} / {max}</span>
    </div>
  );
}

// ── SearchBar ─────────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Search…' }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position:'relative', marginBottom:20 }}>
      <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:T.muted, fontSize:14, pointerEvents:'none' }}>⌕</span>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ width:'100%', background: focused ? 'var(--atelier-input-bg)' : 'var(--atelier-card-bg)', border:`0.5px solid ${focused ? T.borderFocus : T.border}`, borderRadius:10, padding:'11px 14px 11px 38px', fontFamily:T.ff.body, fontSize:14, fontWeight:300, color:T.ink, outline:'none', minHeight:44, transition:`all 200ms ${EASE}` }}
      />
      {value && (
        <button onClick={() => onChange('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:T.muted, fontSize:16, cursor:'pointer', padding:4 }}>×</button>
      )}
    </div>
  );
}

// ── FilterPills ───────────────────────────────────────────────────────────────
export function FilterPills({ options, value, onChange }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{ padding:'7px 14px', borderRadius:20, border:`0.5px solid ${value===o.value ? T.borderStrong : T.border}`, background: value===o.value ? T.goldSoft : 'transparent', fontFamily:T.ff.label, fontSize:9, fontWeight:300, letterSpacing:'0.14em', textTransform:'uppercase', color: value===o.value ? T.gold : T.soft, cursor:'pointer', transition:`all 150ms ${EASE}` }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────
// Standard list row with hover state — for makers, couples, etc.
export function Row({ children, onClick, danger }: {
  children: ReactNode; onClick?: () => void; danger?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: hov && onClick ? 'var(--atelier-row-hover)' : 'transparent', border:`0.5px solid ${danger ? 'var(--role-critical)' : T.border}`, borderRadius:12, padding:'14px 18px', marginBottom:8, cursor:onClick?'pointer':'default', transition:`all 150ms ${EASE}` }}
    >
      {children}
    </div>
  );
}
