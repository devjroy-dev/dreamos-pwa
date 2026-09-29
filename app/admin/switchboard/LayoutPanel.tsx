'use client';
// app/admin/switchboard/LayoutPanel.tsx · DESIGN-1 · THE SWITCHES (the founder and the chair). One card on the Switchboard:
// the master, "New layout for everyone", one tap each way; beside it, once it has first been turned on, "Classic layout
// kept until <date>"; under it, the vendors who see the new layout while the master is off. Words: lib/admin-api/
// layoutSwitchCopy.ts. The two layout rows are drawn here only, never again in the gate groups.
import { useEffect, useState } from 'react';
import { T, Toast } from '../_components/AdminUI';
import { getLayoutSwitch, setLayoutMaster } from '../../../lib/admin-api/index';
import { LAYOUT_WORDS as W, keptDate, asLayoutState, type LayoutState } from '../../../lib/admin-api/layoutSwitchCopy';

export default function LayoutPanel() {
  const [st, setSt] = useState<LayoutState | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);

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
          <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.muted, margin: '4px 0 8px' }}>{W.listNote(st.env)}</div>
          {st.vendor_ids.length ? st.vendor_ids.map((id) => (
            <div key={id} style={{ fontFamily: T.ff.body, fontSize: 12, color: T.ink, padding: '4px 0', overflowWrap: 'anywhere' }}>{id}</div>
          )) : <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft }}>{W.listNone}</div>}
        </div>
      </>)}
      {toast && <Toast msg={toast.msg} error={toast.error} onDone={() => setToast(null)} />}
    </section>
  );
}
