"use client";
// app/vendor/(shell)/packages/page.tsx — CE-43 · LC-2 · THE PACKAGES ROOM (packet 1, the shell).
//
// R-42.14, SHELL FIRST AND WHOLE. The room is navigable and READS for real: the first open
// seeds the vendor's category options once (dream-os ensureSeeded) and the list shows them
// with the default marked. Every ACT on the room answers `COPY.launchingSoon` until packet 2
// lands the writes behind it. Package creation and editing are PWA acts (R-42.8).
//
// ── THE CONTROL INVENTORY (protocol §10 part 4) ─────────────────────────────
// A NEW surface; nothing is KEPT, MOVED or REMOVED from a predecessor. ADDED:
//   · `Add package`      (P6) — ACKNOWLEDGE in packet 1 (Launching soon.)
//   · per package `Edit`, `Delete`, `Set as default` (P6) — ACKNOWLEDGE in packet 1.
//     `Set as default` is not offered on the package that already is the default.
// Plus the shell's own chrome (coin, dock, nav), unchanged.
//
// ── THE BYTES ───────────────────────────────────────────────────────────────
// Founder-vetoed 2026-09-17 (LC-2 §6): P1 is the registry label, P2 P3 P4 P5 P6 P11 live in
// lib/worklist/packages.ts. The failed-read line is the estate's existing
// `COPY.surfaceUnavailable`; no new byte. Seed names keep their vetoed capitals (R-43.10).
// Tokens only (R-42.6): Graphite and Chalk through the atelier variables.
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { WlToast } from '@/components/worklist/WlToast';
import { useToast } from '@/hooks/vendor/useToast';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { COPY } from '@/lib/solutions/copy';
import { ROOMS } from '@/lib/worklist/rooms';
import { PACKAGES } from '@/lib/worklist/packages';
import { fetchPackages, type VendorPackage } from '@/lib/vendor/api/vendor';
import { formatRs } from '@/lib/vendor/format';
import { SolutionsStyles } from '@/components/solutions/SolutionsPieces';

/** The registry's own byte (P1), never typed here. */
const ROOM_LABEL = ROOMS.find((r) => r.id === 'packages')?.label ?? '';

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

  const load = useCallback(async () => {
    try {
      const r = await fetchPackages();
      if (r && r.ok) { setPackages(r.packages); setFailed(false); }
      else { setFailed(true); }
    } catch { setFailed(true); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const soon = () => show(COPY.launchingSoon);

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
            {packages.map((p) => (
              <li key={p.id} className="pkg-card" data-package-id={p.id}>
                <div className="pkg-head">
                  <span className="pkg-name">{p.name}</span>
                  {p.is_default && <span className="sol-chip sol-chip--open">{PACKAGES.defaultMark}</span>}
                </div>
                {p.description && <p className="pkg-desc">{p.description}</p>}
                {p.line_items.length > 0 && (
                  <ul className="pkg-items">
                    {p.line_items.map((li, i) => (
                      <li key={`${p.id}-${i}`}>
                        <span className="pkg-itemlabel">{li.label}</span>
                        <span className="pkg-itemdetail">{li.detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="pkg-fee">{p.total == null ? PACKAGES.feeUnset : formatRs(p.total)}</p>
                <div className="pkg-actions">
                  <button type="button" className="sol-btn" onClick={soon}>{PACKAGES.edit}</button>
                  {!p.is_default && <button type="button" className="sol-btn" onClick={soon}>{PACKAGES.setDefault}</button>}
                  <button type="button" className="sol-btn" onClick={soon}>{PACKAGES.del}</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="sol-actions">
          <button type="button" className="sol-btn" onClick={soon}>{PACKAGES.add}</button>
        </div>
      </section>
      <WlToast toast={toast} />
      <SolutionsStyles />
      <style>{`
.pkg-wait{min-height:120px}
.pkg-list{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column}
.pkg-card{padding:18px 0;border-bottom:.5px solid var(--atelier-card-border)}
.pkg-card:last-child{border-bottom:none}
.pkg-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
.pkg-name{font:var(--wl-t3);color:var(--atelier-ink);min-width:0;flex:1 1 auto}
.pkg-desc{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:8px 0 0;max-width:52ch}
.pkg-items{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}
.pkg-items li{display:flex;flex-direction:column;gap:1px}
.pkg-itemlabel{font:var(--wl-t5);letter-spacing:.06em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.pkg-itemdetail{font:var(--wl-t4);color:var(--atelier-ink)}
.pkg-fee{font:var(--wl-t4);color:var(--atelier-ink-mute);margin:12px 0 0}
.pkg-actions{display:flex;gap:10px;margin:14px 0 0;flex-wrap:wrap}
`}</style>
    </WorklistShell>
  );
}
