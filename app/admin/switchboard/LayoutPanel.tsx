'use client';
// app/admin/switchboard/LayoutPanel.tsx · DESIGN-1 · THE SWITCHES (the founder and the chair). One card on the Switchboard:
// the master, "New layout for everyone", one tap each way; beside it, once it has first been turned on, "Classic layout
// kept until <date>"; under it, the vendors who see the new layout while the master is off, each with Remove, and a
// field to find a vendor by name or phone and Add her (CE-46 F3: her row's layout_v2, no Railway edit). Words:
// lib/admin-api/layoutSwitchCopy.ts. The two layout rows are drawn here only, never again in the gate groups.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { T, Toast } from '../_components/AdminUI';
import { getLayoutSwitch, setLayoutMaster, setLayoutVendor } from '../../../lib/admin-api/index';
import { adminSearch } from '../../../lib/admin-api/search';
import { LAYOUT_WORDS as W, keptDate, asLayoutState, asLayoutVendors, layoutCandidates, type LayoutState, type LayoutCandidate } from '../../../lib/admin-api/layoutSwitchCopy';

export default function LayoutPanel() {
  const [st, setSt] = useState<LayoutState | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);
  const [q, setQ] = useState('');
  const [found, setFound] = useState<LayoutCandidate[] | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    let live = true;
    // an older door (no master, no list) or an odd answer never breaks the Switchboard: it reads as unread
    getLayoutSwitch().then((d) => { if (live) { const x = asLayoutState(d); if (x) setSt(x); else setFailed(true); } }).catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, []);

  const on = !!st?.master?.on;
  const flip = async (to: 'on' | 'off') => {
    if (busy || (to === 'on') === on) return;
    setBusy(true);
    try {
      const d = await setLayoutMaster(to);
      setSt((s) => (s ? { ...s, default_on: d.master.on, master: d.master } : s));
      setToast({ msg: W.flipped(d.master.on) });
    } catch (e) { setToast({ msg: (e as Error).message || W.unread, error: true }); }
    setBusy(false);
  };

  // FIND: the admin search door (GET /api/v2/admin/search), its vendors group only, minus the vendors already listed.
  // The last question typed wins (a slow answer to an older one is dropped); fewer than two letters asks nothing.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) { setFound(null); return; }
    const mine = ++seq.current;
    const t = setTimeout(() => {
      adminSearch(term).then((d) => { if (mine === seq.current) setFound(layoutCandidates(d, st?.vendors ?? [])); })
        .catch(() => { if (mine === seq.current) setFound([]); });
    }, 250);
    return () => clearTimeout(t);
  }, [q, st?.vendors]);

  // ADD and REMOVE: one vendor's row, through its own door; the door answers with the list, which is drawn as sent.
  const setVendor = async (id: string, name: string, onV2: boolean) => {
    if (busy) return;
    setBusy(true);
    try {
      const d = await setLayoutVendor(id, onV2);
      const vendors = asLayoutVendors(d && d.vendors);
      if (!vendors) throw new Error(W.unread);
      setSt((s) => (s ? { ...s, vendors } : s));
      setToast({ msg: onV2 ? W.added(name) : W.removed(name) });
      if (onV2) { setQ(''); setFound(null); }
    } catch (e) { setToast({ msg: (e as Error).message || W.unread, error: true }); }
    setBusy(false);
  };

  const rowBtn = (label: string, attr: Record<string, string>, onClick: () => void) => (
    <button type="button" disabled={busy} onClick={onClick} {...attr}
      style={{ minHeight: 44, minWidth: 72, padding: '0 16px', border: `0.5px solid ${T.border}`, borderRadius: 3, background: 'transparent',
               fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.ink,
               cursor: busy ? 'not-allowed' : 'pointer', flex: 'none' }}>{label}</button>
  );
  const row = (key: string, title: string, sub: string | null | undefined, btn: ReactNode, attr: Record<string, string>) => (
    <div key={key} {...attr} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '6px 0' }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.ink, overflowWrap: 'anywhere' }}>{title}</div>
        {sub ? <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.muted, overflowWrap: 'anywhere' }}>{sub}</div> : null}
      </div>
      {btn}
    </div>
  );

  const seg = (label: string, active: boolean, to: 'on' | 'off') => (
    <button type="button" aria-pressed={active} disabled={busy} data-layout-master={to} onClick={() => void flip(to)}
      style={{ minHeight: 44, minWidth: 72, padding: '0 16px', border: 'none', fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.08em',
               textTransform: 'uppercase', background: active ? T.gold : 'transparent', color: active ? T.onAccent : T.muted,
               cursor: busy ? 'not-allowed' : active ? 'default' : 'pointer' }}>{label}</button>
  );

  return (
    <section data-layout-panel="" style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
      <h2 style={{ fontFamily: T.ff.body, fontWeight: 600, fontSize: 14, color: T.ink, margin: '0 0 4px' }}>{W.title}</h2>
      <p style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft, margin: '0 0 16px' }}>{W.sub}</p>
      {failed ? <p style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft, margin: 0 }}>{W.unread}</p> : !st ? (
        <div className="shimmer" style={{ height: 88, borderRadius: 12, background: T.card }} />
      ) : (<>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: T.ff.body, fontSize: 14, color: T.ink }}>{W.master}</div>
            <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft, marginTop: 4 }} data-layout-master-line="">{on ? W.masterOn : W.masterOff}</div>
          </div>
          <div role="group" aria-label={W.master} style={{ display: 'inline-flex', border: `0.5px solid ${T.border}`, borderRadius: 3, overflow: 'hidden' }}>
            {seg(W.off, !on, 'off')}{seg(W.on, on, 'on')}
          </div>
        </div>
        <div style={{ marginTop: 12 }} data-layout-kept="">
          {st.master?.classic_kept_until ? (<>
            <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.ink }}>{W.kept(keptDate(st.master.classic_kept_until))}</div>
            <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.muted, marginTop: 4 }}>{W.keptNote}</div>
          </>) : <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.muted }}>{W.neverOn}</div>}
        </div>
        <div style={{ borderTop: `0.5px solid ${T.border}`, marginTop: 16, paddingTop: 16 }} data-layout-list="">
          <div style={{ fontFamily: T.ff.body, fontSize: 14, color: T.ink }}>{W.list}</div>
          <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.muted, margin: '4px 0 8px' }}>{W.listNote}</div>
          {st.vendors.length ? st.vendors.map((v) => row(v.id, v.name, v.phone,
            rowBtn(W.remove, { 'data-layout-remove': v.id }, () => void setVendor(v.id, v.name, false)), { 'data-layout-vendor': v.id }))
            : <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft }}>{W.listNone}</div>}
          <label style={{ display: 'block', fontFamily: T.ff.body, fontSize: 13, color: T.ink, marginTop: 16 }}>
            {W.find}
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={W.findHint} data-layout-find=""
              autoComplete="off" style={{ display: 'block', width: '100%', boxSizing: 'border-box', minHeight: 44, marginTop: 6, padding: '0 12px',
                border: `0.5px solid ${T.border}`, borderRadius: 3, background: 'transparent', color: T.ink, fontFamily: T.ff.body, fontSize: 14 }} />
          </label>
          {found ? (found.length ? found.map((h) => row(h.id, h.label, h.sub,
            rowBtn(W.add, { 'data-layout-add': h.id }, () => void setVendor(h.id, h.label, true)), { 'data-layout-found': h.id }))
            : <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft, padding: '6px 0' }} data-layout-nomatch="">{W.noMatch}</div>) : null}
        </div>
      </>)}
      {toast && <Toast msg={toast.msg} error={toast.error} onDone={() => setToast(null)} />}
    </section>
  );
}
