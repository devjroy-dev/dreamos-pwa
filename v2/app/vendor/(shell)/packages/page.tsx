"use client";
// app/vendor/(shell)/packages/page.tsx — CE-43 · LC-2 · THE PACKAGES ROOM (packet 2, live).
//
// C-43.16 (founder-approved design, final veto delegated to the chair):
//   · every package starts FOLDED; nothing opens on arrival. The fold control is lucide-react's
//     ChevronDown (already a dependency, imported in e.g. app/(frost)/frost/canvas/surprise/page.tsx).
//   · the fee leads, top right. Unset: "Fee not set" in the accent with a dashed underline, and it
//     IS a button that opens the edit sheet with Fee focused (condition 2). Set: the figure in the
//     display face, plain ink, no underline, not a button.
//   · the summary line is the first three detail values, joined: the vendor's own data, not copy.
//   · the payment bar draws the server's `split` (dream-os splitShares) with the accent and ink
//     tokens at reduced opacity; two parts when the middle payment is off; the numerals beside it
//     are shares until a fee is set and whole rupees after (F21). No date in the room.
//   · actions are outlined buttons (F-43.79, P2b, at the founder's request): Edit and Set as default
//     left in the accent, Delete right in the muted ink, and P7's Cancel and Delete in the same form.
//     The default carries an accent rule and the chip under its name.
//   · Add package is a dashed tile at the end of the list.
//   · tokens only (R-42.6): Chalk and Graphite both resolve through var(--atelier-*).
//
// ── THE CONTROL INVENTORY (CE-115, against packet 1's shell) ─────────────────
//   KEPT, now acting: Add package (opens the edit sheet), Edit, Set as default (not on the
//   default), Delete (P7 confirm, then soft delete). ADDED: the fold toggle per package; the fee
//   affordance on an unpriced package; the confirm's Delete and Cancel (P6 bytes).
//   REMOVED BY RULING (C-43.16): the boxed button style; the always-open card.
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';
import { RoomHeadAdd } from '@/v2/components/worklist/PageHelp';   // FE-5's pill, in the room head (FE-8)
import { PKG } from '@/v2/lib/worklist/packagesRoom';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { WlToast } from '@/v2/components/worklist/WlToast';
import { useToast } from '@/hooks/vendor/useToast';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { COPY } from '@/v2/lib/solutions/copy';
import { ROOMS } from '@/v2/lib/worklist/rooms';
import { PACKAGES, PACKAGE_FAILURES, splitNumerals } from '@/v2/lib/worklist/packages';
import {
  fetchPackages, deletePackage, setDefaultPackage, type VendorPackage,
} from '@/v2/lib/vendor/api/vendor';
import { formatRs } from '@/lib/vendor/format';
import { SolutionsStyles } from '@/v2/components/solutions/SolutionsPieces';
import { PackageEditSheet } from '@/v2/components/vendor/packages/PackageEditSheet';

/** The registry's own byte (P1), never typed here. */
const ROOM_LABEL = ROOMS.find((r) => r.id === 'packages')?.label ?? '';

/** The first three detail values, joined: the vendor's own data (C-43.16). */
function summaryOf(p: VendorPackage): string {
  // F-44.259 (CE-47): empty details are filtered BEFORE the join, so an empty list draws nothing, never "," or ", ,".
  return p.line_items.slice(0, 3).map((it) => it.detail).filter((d) => !!d && String(d).trim() !== '').join(', ');
}

/** THE TWO-LINE CAP, MEASURED ON GLASS (the chair's f): as many WHOLE item names as two rendered lines hold, then
 *  "and N more". A name is never cut. Nothing is drawn for a package with no items. */
function FitNames({ names }: { names: string[] }) {
  const list = names.filter((n) => !!n && String(n).trim() !== '');
  const ref = useRef<HTMLSpanElement>(null);
  const [k, setK] = useState(list.length);
  const text = (n: number) => list.slice(0, n).join(' \u00b7 ') + (n < list.length ? `${n ? ' ' : ''}${PKG.andMore(list.length - n)}` : '');
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const lh = parseFloat(getComputedStyle(el).lineHeight) || 20;
    let n = list.length;
    for (; n > 0; n -= 1) { el.textContent = text(n); if (el.clientHeight <= lh * 2 + 1) break; }
    el.textContent = text(n); setK(n); el.dataset.lines = String(Math.round(el.clientHeight / lh));
  });
  if (!list.length) return null;
  return <span className="pk-f" ref={ref} data-fit="">{text(k)}</span>;
}
function deliveryLine(p: VendorPackage): string {
  if (p.delivery_basis === 'on_the_day') return PACKAGES.dOnTheDay;
  if (p.delivery_basis === 'handover') return PACKAGES.dHandover;
  return p.delivery_days ? PKG.daysAfter(p.delivery_days) : PACKAGES.dDays;
}

export default function PackagesPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <PackagesScreen />;
}

function PackagesScreen() {
  const { toast, show } = useToast();
  const [packages, setPackages] = useState<VendorPackage[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState<string | null>(null);
  const [sheet, setSheet] = useState<{ pkg: VendorPackage | null; focusFee: boolean } | null>(null);
  const [pick, setPick] = useState<string | null>(null);   // CE-47 FE-6 L5: the package whose sheet is open

  const load = useCallback(async () => {
    try {
      const r = await fetchPackages();
      if (r && r.ok) { setPackages(r.packages); setFailed(false); } else setFailed(true);
    } catch { setFailed(true); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  async function makeDefault(p: VendorPackage) {
    try {
      const r = await setDefaultPackage(p.id);
      if (r && r.ok) { show(PACKAGES.defaultSet); await load(); return; }
      const race = !!r && !r.ok && 'error' in r && r.error === 'default_race';
      show(race ? PACKAGE_FAILURES.defaultRace : PACKAGE_FAILURES.defaultFailed, 'error');
      if (race) await load();
    } catch { show(PACKAGE_FAILURES.defaultFailed, 'error'); }
  }

  async function remove(p: VendorPackage) {
    setConfirming(null);
    try {
      const r = await deletePackage(p.id);
      if (r && r.ok) { show(PACKAGES.deleted); await load(); return; }
      show(PACKAGE_FAILURES.deleteFailed, 'error');
    } catch { show(PACKAGE_FAILURES.deleteFailed, 'error'); }
  }

  // CE-47 FE-6 L5 · THE ROOM REWORKED (the founder's verdict on FE-6's mock 12, with the chair's changes f to h): the add is
  // the head's pill ("+ New package"); the packages as rows (name / the items' NAMES, at most two lines MEASURED, then
  // "and N more" / the price on the right); the default said once under the list; a tap opens the package's sheet
  // (Price, Deposit, Delivery; What's included with each item's detail under its name; Edit, Set as default, then
  // Delete last and asked first). A package with no items draws no second line (F-44.259).
  const picked = packages && pick ? packages.find((x) => x.id === pick) || null : null;
  const def = packages ? packages.find((x) => x.is_default) : undefined;
  return (
    <WorklistShell title={ROOM_LABEL}>
      <RoomHeadAdd addKey="packages" label={PKG.add} onAdd={() => setSheet({ pkg: null, focusFee: false })} />
      <section className="pk-room" data-packages="">
        {packages && <p className="pk-big" data-packages-line="">{PACKAGES.sub(packages.length)}</p>}
        {failed && <p className="pk-line">{COPY.surfaceUnavailable}</p>}
        {packages === null && !failed && <div className="pk-list" aria-busy="true" style={{ minHeight: 64 }} />}
        {packages && packages.length === 0 && <p className="pk-line">{PKG.empty}</p>}
        {packages && packages.length > 0 && (
          <div className="pk-list">
            {packages.map((p) => (
              <button type="button" key={p.id} className="pk-row" data-package-id={p.id} onClick={() => { if (p.total == null) { setSheet({ pkg: p, focusFee: true }); return; } setPick(p.id); setConfirming(null); }}>
                <span className="pk-rt"><span className="pk-n">{p.name}</span><FitNames names={p.line_items.map((it) => it.label)} /></span>
                {/* a package with no fee opens straight onto Fee in its edit sheet (b81's condition 2, kept) */}
                <span className={'pk-amt' + (p.total == null ? ' pk-unset' : '')}>{p.total == null ? PACKAGES.feeUnset : formatRs(p.total).replace(' ', '\u00a0')}</span>
                <span className="pk-chev" aria-hidden="true">{'\u203a'}</span>
              </button>
            ))}
          </div>
        )}
        {def ? <p className="pk-line" style={{ marginTop: 8 }} data-default-line="">{PKG.defaultLine(def.name)}</p> : null}
      </section>
      {picked && (
        <div className="pk-over" role="dialog" aria-modal="true" aria-label={picked.name} onClick={() => setPick(null)} data-package-sheet={picked.id}>
          <div className="pk-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="pk-sh"><h2>{picked.name}</h2><button type="button" className="pk-x" aria-label={PACKAGES.cancel} onClick={() => setPick(null)}>{'\u00d7'}</button></div>
            <div className="pk-facts">
              <div className="pk-fact"><span>{PKG.price}</span><b>{picked.total == null ? PACKAGES.feeUnset : formatRs(picked.total)}</b></div>
              <div className="pk-fact"><span>{PKG.deposit}</span><b>{picked.deposit_pct}%</b></div>
              <div className="pk-fact"><span>{PKG.delivery}</span><b>{deliveryLine(picked)}</b></div>
            </div>
            {picked.line_items.length > 0 && (<>
              <h3 className="pk-h">{PACKAGES.fIncluded}</h3>
              <div className="pk-list">{picked.line_items.map((it, i) => (
                <div className="pk-row pk-dead" key={i}><span className="pk-rt"><span className="pk-n">{it.label}</span>{it.detail && String(it.detail).trim() ? <span className="pk-f">{it.detail}</span> : null}</span></div>
              ))}</div>
            </>)}
            <div className="pk-jobs">
              <button type="button" className="pk-job" onClick={() => { const pp = picked; setPick(null); setSheet({ pkg: pp, focusFee: false }); }}>{PACKAGES.edit}</button>
              {!picked.is_default ? <button type="button" className="pk-job" onClick={() => { void makeDefault(picked); }}>{PACKAGES.setDefault}</button> : null}
              {confirming === picked.id ? (
                <div className="pk-ask" role="alert" data-delete-ask="">
                  <p>{PACKAGES.deleteConfirm}</p>
                  <div className="pk-two">
                    <button type="button" className="pk-job" onClick={() => setConfirming(null)}>{PACKAGES.cancel}</button>
                    <button type="button" className="pk-job pk-warn" onClick={() => { const pp = picked; setPick(null); void remove(pp); }}>{PACKAGES.del}</button>
                  </div>
                </div>
              ) : <button type="button" className="pk-job pk-warn" onClick={() => setConfirming(picked.id)}>{PACKAGES.del}</button>}
            </div>
          </div>
        </div>
      )}
      <PackageEditSheet
        open={sheet !== null}
        pkg={sheet ? sheet.pkg : null}
        focusFee={sheet ? sheet.focusFee : false}
        onClose={() => setSheet(null)}
        onSaved={() => { void load(); }}
        onToast={show}
      />
      <WlToast toast={toast} />
      <SolutionsStyles />
      <style>{`
.pk-room{padding:8px 16px 32px;display:flex;flex-direction:column}
.pk-big{margin:0 0 12px;font:var(--wl-t2);color:var(--atelier-ink)}
.pk-line{margin:0 0 12px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.pk-list,.pk-facts{border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);overflow:hidden}
.pk-row{display:flex;align-items:center;gap:12px;width:100%;min-height:64px;padding:10px 16px;box-sizing:border-box;background:transparent;border:0;text-align:left;color:inherit;font:inherit;cursor:pointer}
.pk-row + .pk-row{border-top:1px solid var(--atelier-card-border)}
.pk-dead{cursor:default}
.pk-rt{flex:1;min-width:0;display:flex;flex-direction:column}
.pk-n{font:var(--wl-tb);color:var(--atelier-ink)}
.pk-f{font:var(--wl-t4);color:var(--atelier-ink-mute);margin-top:2px}
.pk-amt{font:var(--wl-tb);color:var(--atelier-ink);white-space:nowrap;font-variant-numeric:tabular-nums}
.pk-unset{color:var(--atelier-accent-text)}
.pk-chev{color:var(--atelier-ink-mute);font:var(--wl-t2)}
.pk-over{position:fixed;inset:0;z-index:60;background:var(--role-scrim);display:flex;align-items:flex-end}
.pk-sheet{width:100%;box-sizing:border-box;max-height:85vh;overflow-y:auto;background:var(--atelier-card-bg);border-top-left-radius:16px;border-top-right-radius:16px;padding:16px 16px calc(24px + env(safe-area-inset-bottom))}
.pk-sh{display:flex;justify-content:space-between;align-items:center;margin:0 0 12px}.pk-sh h2{margin:0;font:var(--wl-t2);color:var(--atelier-ink)}
.pk-x{min-width:44px;min-height:44px;border:0;background:transparent;color:var(--atelier-ink-mute);font:var(--wl-t2);cursor:pointer}
.pk-fact{display:flex;justify-content:space-between;gap:12px;min-height:48px;align-items:center;padding:8px 16px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.pk-fact + .pk-fact{border-top:1px solid var(--atelier-card-border)}.pk-fact b{font:var(--wl-tb);color:var(--atelier-ink)}
.pk-h{margin:20px 0 8px;font:var(--wl-t2);color:var(--atelier-ink)}
.pk-jobs{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.pk-job{min-height:48px;padding:0 16px;border-radius:12px;border:1px solid var(--atelier-card-border);background:transparent;color:var(--atelier-accent-text);font:var(--wl-tb);cursor:pointer}
.pk-warn{color:var(--role-critical);border-color:var(--role-critical)}
.pk-ask{width:100%}.pk-ask p{margin:0 0 8px;font:var(--wl-t3);color:var(--atelier-ink)}.pk-two{display:flex;gap:8px}
.pkg-wait{min-height:120px}
.pkg-list{list-style:none;margin:16px 0 0;padding:0;display:flex;flex-direction:column;gap:12px}
.pkg-card{background:var(--atelier-sheet-top);border:.5px solid var(--atelier-card-border);border-radius:12px;padding:16px 16px 12px}
.pkg-card--default{border-left:2px solid var(--atelier-accent-text);border-radius:0}
.pkg-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.pkg-fold{background:none;border:none;padding:0;margin:0;text-align:left;cursor:pointer;color:inherit;font:inherit;display:flex;flex-direction:column;min-width:0;flex:1 1 auto}
.pkg-fold:focus-visible,.pkg-fee--unset:focus-visible,.pkg-act:focus-visible,.pkg-add:focus-visible{outline:1.5px solid var(--atelier-accent-text);outline-offset:3px}
.pkg-name{font-family:var(--font-cormorant),Georgia,serif;font-weight:500;font-size:1.375rem;line-height:1.15;color:var(--atelier-ink)}
.pkg-default{font-family:var(--font-jost),system-ui,sans-serif;font-size:0.8125rem;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-accent-text);margin-top:4px}
.pkg-fee{white-space:nowrap;margin-top:4px}
.pkg-fee--unset{background:none;border:none;padding:4px 0;cursor:pointer;font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:0.875rem;color:var(--atelier-accent-text);border-bottom:1px dashed var(--atelier-accent-text);border-radius:0}
.pkg-fee--set{font-family:var(--font-cormorant),Georgia,serif;font-size:1.375rem;line-height:1.1;color:var(--atelier-ink)}
.pkg-fold--body{width:100%;margin-top:8px}
.pkg-summary{font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:0.8125rem;line-height:1.45;color:var(--atelier-ink-mute);margin-bottom:12px}
.pkg-barrow{display:flex;align-items:center;gap:12px;width:100%}
.pkg-bar{flex:1 1 auto;display:flex;gap:4px;height:5px;min-width:60px}
.pkg-seg{display:block;height:100%;flex-basis:0}
.pkg-seg--deposit{background:var(--atelier-accent-text)}
.pkg-seg--middle{background:var(--atelier-accent-text);opacity:.45}
.pkg-seg--final{background:var(--atelier-ink);opacity:.22}
.pkg-numerals{font-family:var(--font-jost),system-ui,sans-serif;font-size:0.8125rem;color:var(--atelier-ink-mute);white-space:nowrap}
.pkg-chev{color:var(--atelier-ink-mute);flex:none;transition:transform .2s}
.pkg-chev--open{transform:rotate(180deg)}
.pkg-more{border-top:.5px solid var(--atelier-card-border);margin-top:12px;padding-top:12px}
.pkg-desc{font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:0.875rem;line-height:1.55;color:var(--atelier-ink-soft);margin:0 0 8px;max-width:52ch}
.pkg-items{margin:0;padding:0}
.pkg-item{margin-top:12px}
.pkg-item dt{font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:0.8125rem;color:var(--atelier-ink-mute)}
.pkg-item dd{margin:0px 0 0;font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:0.875rem;line-height:1.45;color:var(--atelier-ink)}
.pkg-actions{display:flex;align-items:center;gap:12px;margin-top:16px;flex-wrap:wrap}
.pkg-act{background:transparent;border:1px solid var(--atelier-accent-text);border-radius:12px;padding:0 16px;min-height:48px;cursor:pointer;font:var(--wl-tb);color:var(--atelier-accent-text)}
.pkg-act--quiet{color:var(--atelier-ink-mute);border-color:var(--atelier-ink-mute)}
.pkg-act--right{margin-left:auto}
.pkg-confirm p{margin:16px 0 0;font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:0.875rem;line-height:1.5;color:var(--atelier-ink)}
.pkg-add{display:block;width:100%;margin:12px 0 4px;padding:16px;min-height:52px;background:none;cursor:pointer;border:1px dashed var(--atelier-input-border);border-radius:12px;font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:0.9375rem;color:var(--atelier-accent-text)}
@media (prefers-reduced-motion: reduce){.pkg-chev{transition:none}}
`}</style>
    </WorklistShell>
  );
}
