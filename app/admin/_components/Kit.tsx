'use client';
// ADM-1 · THE ADMIN'S BUILDING BLOCKS (redesign approved by CE-47, 1 Oct 2026).
// One look: the new vendor app's tokens and type rungs (v2/lib/worklist/theme via the shell's
// html.adm scope). Every tap target is at least 44. Times are "7:00 pm", dates full months.
// Destructive actions never sit on a list row: they are the last thing on a card and ask again.
import React, { useState, createContext } from 'react';
import Link from 'next/link';
import { waDialHref } from '@/lib/admin/waDial';

export const C = {
  card: 'var(--atelier-card-bg)', line: 'var(--atelier-card-border)', sheet: 'var(--atelier-sheet-bg)',
  ink: 'var(--atelier-ink)', soft: 'var(--atelier-ink-soft)', mute: 'var(--atelier-ink-mute)',
  accent: 'var(--atelier-accent-text)', primary: 'var(--role-primary)', onPrimary: 'var(--role-on-primary)',
  ok: 'var(--role-positive)', warn: 'var(--role-caution)', bad: 'var(--role-critical)', hover: 'var(--atelier-row-hover)',
  header: 'var(--atelier-header-bg)', input: 'var(--atelier-input-bg)', inputLine: 'var(--atelier-input-border)',
};
export const F = {
  t0: 'var(--wl-t0)', t1: 'var(--wl-t1)', t2: 'var(--wl-t2)', t3: 'var(--wl-t3)', t4: 'var(--wl-t4)', t5: 'var(--wl-t5)',
  tn: 'var(--wl-tn)', tb: 'var(--wl-tb)', brand: '500 24px/1 var(--font-brand), Georgia, serif',
};
const TAP = 44;

/** The open help-request count the shell already fetches for the Dreamers badge, shared so Home
 *  reads the same answer instead of asking the door again (CE-47, 2 Oct 2026). null = no answer. */
export const OpenHelpContext = createContext<number | null>(null);

// ── words and times ─────────────────────────────────────────────────────────
const IST = 'Asia/Kolkata';
/** 12-hour, lower case, no leading zero: "7:00 pm". */
export function clock(iso: string): string {
  const s = new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: IST });
  return s.replace(/\s*(am|pm|AM|PM)$/, (_m, x: string) => ' ' + x.toLowerCase());
}
/** Full month: "21 October 2026" (or "21 October" without the year). */
export function fullDate(iso: string, year = true): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', ...(year ? { year: 'numeric' } : {}), timeZone: IST });
}
/** "10 minutes ago" under an hour; "at 2:14 pm" today; "on 29 September at 2:14 pm" before. */
export function when(iso: string | null | undefined): string {
  if (!iso) return '';
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
  return fullDate(iso) === fullDate(new Date().toISOString()) ? `at ${clock(iso)}` : `on ${fullDate(iso, false)} at ${clock(iso)}`;
}
export const cap = (s: string | null | undefined) => (s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ') : '');
/**
 * The WhatsApp link for a person row, through the estate's one dial rule (lib/admin/waDial.ts),
 * which renders NOTHING for digits with a country code but no "+" (absent beats a guess), and
 * that is what every users.phone row gets (Vendors joined, Dreamers, enquiries).
 * `bare` is passed ONLY by the WhatsApp lanes whose numbers the server itself writes in the
 * metaCloud normalizeTo shape, country code always present and the "+" always stripped
 * (prospects, demo claims, demo WhatsApp numbers; src/api/admin/prospects.js normalizeTo):
 * there the "+" is known to be missing, not guessed, so it is put back before the same rule.
 */
export function waLink(phone: string | null | undefined, bare = false): string | null {
  if (!phone) return null;
  const direct = waDialHref(phone);
  if (direct || !bare) return direct;
  const t = phone.trim();
  return /^\d{11,15}$/.test(t) ? waDialHref('+' + t) : null;
}
/** The call link, only where the WhatsApp link is safe: the same digits, with a "+". */
export function telLink(phone: string | null | undefined, bare = false): string | null {
  const wa = waLink(phone, bare);
  return wa ? 'tel:+' + wa.replace('https://wa.me/', '') : null;
}

// ── icons (stroke-only, current colour) ─────────────────────────────────────
export function Ico({ n, s = 20 }: { n: string; s?: number }) {
  const p: Record<string, React.ReactNode> = {
    home: <><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></>,
    demo: <><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7.5 17a5 5 0 019 0"/></>,
    vendors: <><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9h18"/></>,
    dreamers: <path d="M12 20s-7-4.3-7-9.5A3.5 3.5 0 0112 7a3.5 3.5 0 017 3.5C19 15.7 12 20 12 20z"/>,
    more: <><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></>,
    wa: <><path d="M4 20l1.3-3.8A8 8 0 1112 20a8 8 0 01-4-1z"/><path d="M9 9.5c.3 2 1.8 3.8 4.2 4.6l1-1.1 1.8.8"/></>,
    call: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z"/>,
    chev: <path d="M9 6l6 6-6 6"/>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></>,
    photo: <><rect x="3" y="5" width="18" height="15" rx="2"/><circle cx="12" cy="12.5" r="3.2"/></>,
    chat: <path d="M4 5h16v11H9l-5 4z"/>,
    star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></>,
    help: <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z"/>,
    chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>,
    out: <><path d="M12 3v9"/><path d="M6.3 7a8 8 0 1011.4 0"/></>,
    cal: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    alert: <><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/></>,
    sliders: <><path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h6M14 18h6"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="12" cy="18" r="2"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden>{p[n] ?? null}</svg>;
}

// ── page furniture ──────────────────────────────────────────────────────────
export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ padding: '6px 0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ font: F.t0, color: C.ink, margin: 0, flex: '1 1 auto', minWidth: 0, overflowWrap: 'anywhere' }}>{title}</h1>
        {action}
      </div>
      {sub && <div style={{ font: F.t4, color: C.mute, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

const pillStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: TAP, padding: '0 16px', borderRadius: 12, background: C.primary, color: C.onPrimary, font: F.tb, border: 'none', textDecoration: 'none', whiteSpace: 'nowrap', cursor: 'pointer' };
export function Pill({ children, onClick, href, disabled }: { children: React.ReactNode; onClick?: () => void; href?: string; disabled?: boolean }) {
  return href ? <Link href={href} style={pillStyle}>{children}</Link>
    : <button type="button" onClick={onClick} disabled={disabled} style={{ ...pillStyle, opacity: disabled ? 0.55 : 1 }}>{children}</button>;
}

/** Two pages shown as one, a tab each (Vendors: Joined · Being reached; Dreamers: All · Asked for help). */
export function RouteTabs({ items, active }: { items: { href: string; label: string; n?: number | null }[]; active: string }) {
  return (
    <nav style={tabsWrap}>
      {items.map(t => {
        const on = t.href === active;
        return <Link key={t.href} href={t.href} aria-current={on ? 'page' : undefined} style={tabStyle(on)}>{t.label}{typeof t.n === 'number' ? ` · ${t.n}` : ''}</Link>;
      })}
    </nav>
  );
}
export function Tabs({ items, value, onChange }: { items: { key: string; label: string; n?: number | null }[]; value: string; onChange: (k: string) => void }) {
  return (
    <div role="tablist" style={tabsWrap}>
      {items.map(t => <button key={t.key} type="button" role="tab" aria-selected={value === t.key} onClick={() => onChange(t.key)} style={tabStyle(value === t.key)}>{t.label}{typeof t.n === 'number' ? ` · ${t.n}` : ''}</button>)}
    </div>
  );
}
const tabsWrap: React.CSSProperties = { display: 'flex', gap: 4, padding: 4, borderRadius: 14, border: `0.5px solid ${C.line}`, background: C.card, marginBottom: 14 };
const tabStyle = (on: boolean): React.CSSProperties => ({ flex: 1, minHeight: TAP, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, border: 'none', background: on ? C.primary : 'transparent', color: on ? C.onPrimary : C.soft, font: F.t5, fontWeight: on ? 600 : 500, textAlign: 'center', textDecoration: 'none', padding: '0 6px', cursor: 'pointer' });

export function Chips({ items, value, onChange }: { items: { key: string; label: string; n?: number }[]; value: string; onChange: (k: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 12 }}>
      {items.map(t => (
        <button key={t.key} type="button" aria-pressed={value === t.key} onClick={() => onChange(t.key)} style={{ minHeight: TAP, padding: '0 14px', borderRadius: 999, border: `1px solid ${value === t.key ? C.accent : C.line}`, background: 'transparent', color: value === t.key ? C.accent : C.soft, font: F.t4, cursor: 'pointer' }}>
          {t.label}{typeof t.n === 'number' ? ` ${t.n}` : ''}
        </button>
      ))}
    </div>
  );
}

export function SearchField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: TAP, padding: '0 14px', borderRadius: 12, border: `1px solid ${C.inputLine}`, background: C.input, color: C.mute, marginBottom: 12 }}>
      <Ico n="search" s={18} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder}
        style={{ flex: 1, minWidth: 0, minHeight: TAP - 2, background: 'transparent', border: 'none', outline: 'none', color: C.ink, font: F.t3 }} />
    </label>
  );
}

export function CountLine({ n, one, many }: { n: number; one: string; many: string }) {
  return <div style={{ font: F.t5, color: C.mute, padding: '0 4px 8px' }}>{n} {n === 1 ? one : many}</div>;
}

export function List({ children }: { children: React.ReactNode }) {
  return <div style={{ background: C.card, border: `0.5px solid ${C.line}`, borderRadius: 14 }}>{children}</div>;
}
export function Empty({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 16, font: F.t4, color: C.mute }}>{children}</div>;
}

// ── people ──────────────────────────────────────────────────────────────────
/** WhatsApp and Call, on every person row. Real links; nothing on the server. */
export function Reach({ phone, bare = false }: { phone: string | null | undefined; bare?: boolean }) {
  const wa = waLink(phone, bare), tel = telLink(phone, bare);
  if (!wa || !tel) return <span style={{ font: F.t5, color: C.mute, flexShrink: 0 }}>No number</span>;
  const cell = (href: string, icon: string, word: string, tone: string, blank: boolean) => (
    <a href={href} {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})} aria-label={word}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', width: 58, minHeight: TAP }}>
      <span style={{ width: TAP, height: TAP, borderRadius: 999, border: `1px solid ${tone}`, color: tone, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico n={icon} s={19} /></span>
      <span style={{ font: F.t5, color: C.soft }}>{word}</span>
    </a>
  );
  return <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>{cell(wa, 'wa', 'WhatsApp', C.ok, true)}{cell(tel, 'call', 'Call', C.soft, false)}</div>;
}

export function PersonRow({ name, line, tag, tagTone, phone, bare, onOpen, children, last }: {
  name: string; line?: string; tag?: string | null; tagTone?: string; phone?: string | null; bare?: boolean; onOpen?: () => void; children?: React.ReactNode; last?: boolean;
}) {
  return (
    <div style={{ borderBottom: last ? 'none' : `0.5px solid ${C.line}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px 12px 14px' }}>
        <button type="button" onClick={onOpen} disabled={!onOpen} style={{ flex: 1, minWidth: 0, minHeight: TAP, textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: onOpen ? 'pointer' : 'default', color: 'inherit' }}>
          <div style={{ font: F.tb, color: C.ink, overflowWrap: 'anywhere' }}>{name}</div>
          {(tag || line) && (
            <div style={{ font: F.t4, color: C.mute, marginTop: 3, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              {tag && <span style={{ font: F.t5, color: tagTone || C.accent, border: `1px solid ${tagTone || C.accent}`, borderRadius: 999, padding: '1px 8px', whiteSpace: 'nowrap' }}>{tag}</span>}
              {line && <span style={{ overflowWrap: 'anywhere' }}>{line}</span>}
            </div>
          )}
        </button>
        {phone !== undefined && <Reach phone={phone} bare={bare} />}
      </div>
      {children}
    </div>
  );
}

export function ActionStrip({ items }: { items: ({ label: string; primary?: boolean; onClick?: () => void; busy?: boolean; soon?: boolean; href?: string } | null | false)[] }) {
  const list = items.filter(Boolean) as { label: string; primary?: boolean; onClick?: () => void; busy?: boolean; soon?: boolean; href?: string }[];
  if (!list.length) return null;
  return (
    <div style={{ display: 'flex', gap: 8, padding: '0 14px 12px', flexWrap: 'wrap' }}>
      {list.map(a => {
        const st: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', minHeight: TAP, padding: '0 14px', borderRadius: 12, font: F.t5, fontWeight: 600, border: `1px solid ${a.primary ? C.primary : C.line}`, background: a.primary ? C.primary : 'transparent', color: a.primary ? C.onPrimary : C.soft, opacity: a.soon || a.busy ? 0.55 : 1, textDecoration: 'none', cursor: a.soon ? 'default' : 'pointer' };
        if (a.href && !a.soon) return <Link key={a.label} href={a.href} style={st}>{a.label}</Link>;
        return <button key={a.label} type="button" onClick={a.onClick} disabled={a.soon || a.busy} style={st}>{a.soon ? `${a.label} · Coming soon` : a.busy ? `${a.label}…` : a.label}</button>;
      })}
    </div>
  );
}

// ── the centred card ────────────────────────────────────────────────────────
export function Sheet({ title, sub, onClose, children }: { title: string; sub?: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'var(--role-scrim)', zIndex: 400 }} />
      <div role="dialog" aria-modal aria-label={title} style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'min(460px, calc(100% - 32px))', maxHeight: 'calc(100% - 120px)', overflowY: 'auto', background: C.sheet, border: `0.5px solid ${C.line}`, borderRadius: 18, zIndex: 401, padding: '18px 0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '0 10px 10px 18px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: F.t2, color: C.ink, overflowWrap: 'anywhere' }}>{title}</div>
            {sub && <div style={{ font: F.t4, color: C.mute, marginTop: 2 }}>{sub}</div>}
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: C.mute, font: F.t4, minWidth: TAP, minHeight: TAP, cursor: 'pointer' }}>Close</button>
        </div>
        {children}
      </div>
    </>
  );
}
export function SheetRow({ label, sub, right, onClick, busy, href }: { label: string; sub?: string; right?: React.ReactNode; onClick?: () => void; busy?: boolean; href?: string }) {
  const inner = (
    <>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', font: F.t3, color: C.ink }}>{busy ? `${label}…` : label}</span>
        {sub && <span style={{ display: 'block', font: F.t4, color: C.mute }}>{sub}</span>}
      </span>
      {right}
    </>
  );
  const st: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: 'none', border: 'none', borderTop: `0.5px solid ${C.line}`, padding: '12px 18px', minHeight: 52, textDecoration: 'none', color: 'inherit', cursor: onClick || href ? 'pointer' : 'default' };
  if (href) return <Link href={href} style={st}>{inner}</Link>;
  return onClick ? <button type="button" onClick={onClick} disabled={busy} style={st}>{inner}</button> : <div style={st}>{inner}</div>;
}
export function SheetNote({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return <div style={{ borderTop: `0.5px solid ${C.line}`, padding: '12px 18px', font: F.t4, color: tone || C.mute }}>{children}</div>;
}

/** The last thing on a card: names what is lost, then asks again. Never on a list row. */
export function DangerLast({ label, lost, extra, confirmWord, onConfirm, blockedBy }: {
  label: string; lost: string; extra?: string | null; confirmWord: string; onConfirm: () => Promise<void> | void; blockedBy?: string | null;
}) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  if (blockedBy) return <SheetNote>{blockedBy}</SheetNote>;
  return (
    <div style={{ borderTop: `0.5px solid ${C.line}`, padding: '12px 18px' }}>
      {!asking ? (
        <button type="button" onClick={() => setAsking(true)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, minHeight: TAP, cursor: 'pointer' }}>
          <span style={{ display: 'block', font: F.t3, color: C.bad }}>{label}</span>
          <span style={{ display: 'block', font: F.t4, color: C.mute, marginTop: 2 }}>{lost}</span>
          {extra && <span style={{ display: 'block', font: F.t4, color: C.warn, marginTop: 4 }}>{extra}</span>}
        </button>
      ) : (
        <div>
          <div style={{ font: F.t3, color: C.ink, marginBottom: 4 }}>Are you sure?</div>
          <div style={{ font: F.t4, color: C.mute }}>{lost}</div>
          {extra && <div style={{ font: F.t4, color: C.warn, marginTop: 4 }}>{extra}</div>}
          {err && <div style={{ font: F.t4, color: C.bad, marginTop: 6 }}>{err}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <button type="button" disabled={busy} onClick={async () => { setBusy(true); setErr(null); try { await onConfirm(); } catch (e) { setErr(e instanceof Error ? e.message : 'That did not work. Try again.'); setBusy(false); } }}
              style={{ minHeight: TAP, padding: '0 16px', borderRadius: 12, border: 'none', background: C.bad, color: 'var(--role-on-primary)', font: F.tb, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>{busy ? 'Working…' : confirmWord}</button>
            <button type="button" disabled={busy} onClick={() => setAsking(false)} style={{ minHeight: TAP, padding: '0 16px', borderRadius: 12, border: `1px solid ${C.line}`, background: 'transparent', color: C.soft, font: F.tb, cursor: 'pointer' }}>Keep</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── home and more ───────────────────────────────────────────────────────────
export function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 18 }}>
      <h2 style={{ font: F.t5, color: C.mute, padding: '0 4px 8px', margin: 0 }}>{title}</h2>
      <List>{children}</List>
    </section>
  );
}
export function NavRow({ icon, label, sub, n, href, last, soon }: { icon: string; label: string; sub?: string; n?: number | null; href?: string; last?: boolean; soon?: boolean }) {
  const inner = (
    <>
      <span style={{ color: C.accent }}><Ico n={icon} s={20} /></span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', font: F.t3, color: C.ink }}>{label}</span>
        {sub && <span style={{ display: 'block', font: F.t4, color: C.mute, marginTop: 1 }}>{sub}</span>}
      </span>
      {soon ? <span style={{ font: F.t5, color: C.mute }}>Coming soon</span>
        : typeof n === 'number' && n > 0 ? <span style={{ minWidth: 26, height: 24, borderRadius: 999, background: C.primary, color: C.onPrimary, font: F.t5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>{n}</span>
        : typeof n === 'number' ? <span style={{ font: F.t4, color: C.mute }}>0</span> : null}
      {!soon && <span style={{ color: C.mute }}><Ico n="chev" s={18} /></span>}
    </>
  );
  const st: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', minHeight: 56, borderBottom: last ? 'none' : `0.5px solid ${C.line}`, textDecoration: 'none', color: 'inherit', opacity: soon ? 0.6 : 1 };
  return soon || !href ? <div style={st}>{inner}</div> : <Link href={href} style={st}>{inner}</Link>;
}
export function Stat({ label, value, sub, href }: { label: string; value: string | number; sub?: string; href?: string }) {
  const body = (
    <div style={{ background: C.card, border: `0.5px solid ${C.line}`, borderRadius: 14, padding: '14px 14px 12px', height: '100%' }}>
      <div style={{ font: F.t4, color: C.soft }}>{label}</div>
      <div style={{ font: F.t0, color: C.ink, margin: '6px 0 4px', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ font: F.t5, color: C.mute }}>{sub}</div>}
    </div>
  );
  return href ? <Link href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>{body}</Link> : body;
}
