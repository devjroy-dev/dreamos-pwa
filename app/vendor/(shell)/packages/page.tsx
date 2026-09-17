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
//   · actions are quiet text: Edit and Set as default left, Delete right in the muted ink, with
//     P7's confirm unchanged. The default carries an accent rule and the chip under its name.
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
import { ChevronDown } from 'lucide-react';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { WlToast } from '@/components/worklist/WlToast';
import { useToast } from '@/hooks/vendor/useToast';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { COPY } from '@/lib/solutions/copy';
import { ROOMS } from '@/lib/worklist/rooms';
import { PACKAGES, PACKAGE_FAILURES, splitNumerals } from '@/lib/worklist/packages';
import {
  fetchPackages, deletePackage, setDefaultPackage, type VendorPackage,
} from '@/lib/vendor/api/vendor';
import { formatRs } from '@/lib/vendor/format';
import { SolutionsStyles } from '@/components/solutions/SolutionsPieces';
import { PackageEditSheet } from '@/components/vendor/packages/PackageEditSheet';

/** The registry's own byte (P1), never typed here. */
const ROOM_LABEL = ROOMS.find((r) => r.id === 'packages')?.label ?? '';

/** The first three detail values, joined: the vendor's own data (C-43.16). */
function summaryOf(p: VendorPackage): string {
  return p.line_items.slice(0, 3).map((it) => it.detail).join(', ');
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

  return (
    <WorklistShell title={ROOM_LABEL}>
      <section className="sol-surface">
        <p className="sol-kicker">{PACKAGES.eyebrow}</p>
        <h1 className="sol-title">{ROOM_LABEL}</h1>
        {packages && <p className="sol-subhead">{PACKAGES.sub(packages.length)}</p>}
        {failed && <p className="sol-err">{COPY.surfaceUnavailable}</p>}
        {packages === null && !failed && <div className="pkg-wait" aria-busy="true" />}
        {packages && packages.length === 0 && <p className="sol-empty">{PACKAGES.empty}</p>}
        {packages && packages.length > 0 && (
          <ul className="pkg-list">
            {packages.map((p) => {
              const isOpen = !!open[p.id];
              const parts = p.split || [];
              return (
                <li key={p.id} className={`pkg-card${p.is_default ? ' pkg-card--default' : ''}`} data-package-id={p.id}>
                  <div className="pkg-top">
                    <button type="button" className="pkg-fold" aria-expanded={isOpen} onClick={() => toggle(p.id)}>
                      <span className="pkg-name">{p.name}</span>
                      {p.is_default && <span className="pkg-default">{PACKAGES.defaultMark}</span>}
                    </button>
                    {p.total == null
                      ? <button type="button" className="pkg-fee pkg-fee--unset" onClick={() => setSheet({ pkg: p, focusFee: true })}>{PACKAGES.feeUnset}</button>
                      : <span className="pkg-fee pkg-fee--set">{formatRs(p.total)}</span>}
                  </div>
                  <button type="button" className="pkg-fold pkg-fold--body" aria-expanded={isOpen} onClick={() => toggle(p.id)}>
                    {p.line_items.length > 0 && <span className="pkg-summary">{summaryOf(p)}</span>}
                    <span className="pkg-barrow">
                      <span className="pkg-bar" aria-hidden="true">
                        {parts.map((s) => <span key={s.kind} className={`pkg-seg pkg-seg--${s.kind}`} style={{ flexGrow: s.pct }} />)}
                      </span>
                      <span className="pkg-numerals">{splitNumerals(parts, formatRs)}</span>
                      <ChevronDown aria-hidden="true" size={18} className={`pkg-chev${isOpen ? ' pkg-chev--open' : ''}`} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pkg-more">
                      {p.description && <p className="pkg-desc">{p.description}</p>}
                      {p.line_items.length > 0 && (
                        <dl className="pkg-items">
                          {p.line_items.map((it, i) => (
                            <div key={`${p.id}-${i}`} className="pkg-item">
                              <dt>{it.label}</dt>
                              <dd>{it.detail}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {confirming === p.id ? (
                        <div className="pkg-confirm" role="alert">
                          <p>{PACKAGES.deleteConfirm}</p>
                          <div className="pkg-actions">
                            <button type="button" className="pkg-act pkg-act--quiet" onClick={() => setConfirming(null)}>{PACKAGES.cancel}</button>
                            <button type="button" className="pkg-act pkg-act--right" onClick={() => { void remove(p); }}>{PACKAGES.del}</button>
                          </div>
                        </div>
                      ) : (
                        <div className="pkg-actions">
                          <button type="button" className="pkg-act" onClick={() => setSheet({ pkg: p, focusFee: false })}>{PACKAGES.edit}</button>
                          {!p.is_default && <button type="button" className="pkg-act" onClick={() => { void makeDefault(p); }}>{PACKAGES.setDefault}</button>}
                          <button type="button" className="pkg-act pkg-act--quiet pkg-act--right" onClick={() => setConfirming(p.id)}>{PACKAGES.del}</button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {packages && (
          <button type="button" className="pkg-add" onClick={() => setSheet({ pkg: null, focusFee: false })}>{PACKAGES.add}</button>
        )}
      </section>
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
.pkg-wait{min-height:120px}
.pkg-list{list-style:none;margin:16px 0 0;padding:0;display:flex;flex-direction:column;gap:12px}
.pkg-card{background:var(--atelier-sheet-top);border:.5px solid var(--atelier-card-border);border-radius:2px;padding:14px 14px 12px}
.pkg-card--default{border-left:2px solid var(--atelier-accent-text);border-radius:0}
.pkg-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.pkg-fold{background:none;border:none;padding:0;margin:0;text-align:left;cursor:pointer;color:inherit;font:inherit;display:flex;flex-direction:column;min-width:0;flex:1 1 auto}
.pkg-fold:focus-visible,.pkg-fee--unset:focus-visible,.pkg-act:focus-visible,.pkg-add:focus-visible{outline:1.5px solid var(--atelier-accent-text);outline-offset:3px}
.pkg-name{font-family:var(--font-cormorant),Georgia,serif;font-weight:500;font-size:23px;line-height:1.15;color:var(--atelier-ink)}
.pkg-default{font-family:var(--font-jost),system-ui,sans-serif;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-accent-text);margin-top:4px}
.pkg-fee{white-space:nowrap;margin-top:4px}
.pkg-fee--unset{background:none;border:none;padding:2px 0;cursor:pointer;font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:14px;color:var(--atelier-accent-text);border-bottom:1px dashed var(--atelier-accent-text);border-radius:0}
.pkg-fee--set{font-family:var(--font-cormorant),Georgia,serif;font-size:22px;line-height:1.1;color:var(--atelier-ink)}
.pkg-fold--body{width:100%;margin-top:6px}
.pkg-summary{font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:13px;line-height:1.45;color:var(--atelier-ink-mute);margin-bottom:12px}
.pkg-barrow{display:flex;align-items:center;gap:10px;width:100%}
.pkg-bar{flex:1 1 auto;display:flex;gap:2px;height:5px;min-width:60px}
.pkg-seg{display:block;height:100%;flex-basis:0}
.pkg-seg--deposit{background:var(--atelier-accent-text)}
.pkg-seg--middle{background:var(--atelier-accent-text);opacity:.45}
.pkg-seg--final{background:var(--atelier-ink);opacity:.22}
.pkg-numerals{font-family:var(--font-jost),system-ui,sans-serif;font-size:11px;color:var(--atelier-ink-mute);white-space:nowrap}
.pkg-chev{color:var(--atelier-ink-mute);flex:none;transition:transform .2s}
.pkg-chev--open{transform:rotate(180deg)}
.pkg-more{border-top:.5px solid var(--atelier-card-border);margin-top:12px;padding-top:12px}
.pkg-desc{font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:14px;line-height:1.55;color:var(--atelier-ink-soft);margin:0 0 6px;max-width:52ch}
.pkg-items{margin:0;padding:0}
.pkg-item{margin-top:10px}
.pkg-item dt{font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:12px;color:var(--atelier-ink-mute)}
.pkg-item dd{margin:1px 0 0;font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:14px;line-height:1.45;color:var(--atelier-ink)}
.pkg-actions{display:flex;align-items:center;gap:18px;margin-top:16px}
.pkg-act{background:none;border:none;padding:8px 0;min-height:40px;cursor:pointer;font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:14px;color:var(--atelier-accent-text)}
.pkg-act--quiet{color:var(--atelier-ink-mute)}
.pkg-act--right{margin-left:auto}
.pkg-confirm p{margin:14px 0 0;font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:14px;line-height:1.5;color:var(--atelier-ink)}
.pkg-add{display:block;width:100%;margin:12px 0 4px;padding:16px;min-height:52px;background:none;cursor:pointer;border:1px dashed var(--atelier-input-border);border-radius:2px;font-family:var(--font-dm-sans),system-ui,sans-serif;font-size:15px;color:var(--atelier-accent-text)}
@media (prefers-reduced-motion: reduce){.pkg-chev{transition:none}}
`}</style>
    </WorklistShell>
  );
}
