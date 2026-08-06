'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, Toast, FieldInput, ActionChip, GhostBtn } from '../_components/AdminUI';
import MintSheet from '../_components/MintSheet';
import { getVendors, patchVendorTier, patchVendorDiscover, type AdminVendor } from '../../../lib/admin-api/index';
import { sendWelcome } from '../../../lib/admin-api/mint';
import { adminHeaders, API_BASE as _AB } from '@/lib/admin-api/_base';

const API_BASE  = process.env.NEXT_PUBLIC_API_BASE  || 'https://dream-os-production.up.railway.app';

const TIERS = ['trial','essential','signature','prestige'];

function fmt(d: string) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }); }

export default function MakersPage() {
  const [vendors, setVendors]   = useState<AdminVendor[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [toast, setToast]       = useState('');
  // TDW_10 P3 — People -> + New -> one sheet. The mint lives in ONE component;
  // this screen owns only the door and the reload after a birth.
  const [minting, setMinting]   = useState(false);
  const [toastErr, setToastErr] = useState(false);
  const [openId, setOpenId]     = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  // ── F-10.57 CURED · THE WELCOME WAS REACHABLE FOR THIRTY SECONDS ───────────
  // `Send welcome` lived ONLY on the mint's success card. Close the sheet and it
  // was gone: no door existed to welcome a vendor who already existed. The
  // founder found it the expensive way — he DELETED a vendor and re-minted her
  // to get the button back, which is a far larger act than the one he needed.
  // (Re-minting alone would have done it: the button renders on the `existing`
  // card too. That is a workaround, not a design.)
  //
  // The row already carries Add to Discover / Revoke Access / Delete, so this is
  // where the verb belongs. Same endpoint the sheet calls — no second door.
  //
  // TAP-TO-CONFIRM, MATCHING `Delete` ON THIS SAME ROW. Until this evening the
  // button was harmless because the gate refused everything; `vendor_welcome` is
  // now APPROVED, so one tap sends a real WhatsApp message to a real number. On
  // the mint card a bare tap is defensible — you just created the account. In a
  // list of every vendor you have, one mis-tap messages a stranger. Founder-ruled.
  const [confirmWelcome, setConfirmWelcome] = useState<string | null>(null);
  const [welcomeBusy, setWelcomeBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getVendors().then(d => { setVendors(d.vendors); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };
  const toggleOpen = (id: string) => { setConfirmDel(null); setConfirmWelcome(null); setOpenId(o => o === id ? null : id); };

  // The result is the SERVER'S, never the tap's. `sent:false` is a correct outcome
  // of a working gate — it is reported with the transport's own sentence and as an
  // error tone, never swallowed into a success toast.
  const welcome = async (v: AdminVendor) => {
    setWelcomeBusy(v.id);
    try {
      const r = await sendWelcome(v.id);
      showToast(r.sent ? `Welcome sent to ${v.name} on WhatsApp.`
                       : (r.message || 'Could not send the welcome message.'), !r.sent);
    } catch {
      showToast('Could not send the welcome message.', true);
    } finally {
      setWelcomeBusy(null);
      setConfirmWelcome(null);
    }
  };

  const setTier = async (id: string, tier: string) => {
    try { await patchVendorTier(id, tier); setVendors(v => v.map(x => x.id === id ? { ...x, tier } : x)); showToast('Tier updated.'); }
    catch { showToast('Failed to update tier.', true); }
  };

  const toggleDiscover = async (v: AdminVendor) => {
    try {
      await patchVendorDiscover(v.id);
      // The row's OWN copy of the pair moves together too — a list that showed
      // eligibility flipping while the standing chip stayed put would be F-10.59
      // reproduced in local state.
      setVendors(vs => vs.map(x => x.id === v.id
        // F-10.61 — the STORED word is 'revoked' (0039's CHECK constraint knows no
        // 'hidden'); every rendered word is HIDDEN. The optimistic row must mirror
        // what the server actually writes, or the chip lies until the next load.
        ? { ...x, discover_eligible: !v.discover_eligible,
                  discover_request_state: v.discover_eligible ? 'revoked' : 'approved' }
        : x));
      showToast(v.discover_eligible ? 'Hidden from Discover.' : 'Added to Discover.');
    }
    catch { showToast('Failed.', true); }
  };

  // ── RETIRED · `revoke` (founder-ruled) ──────────────────────────────────────
  // IT READ: `await patchVendorRevoke(id); … showToast('Access revoked.');`
  // 「 Revoke Access 」 revoked no access — `vendors.status` is read only by the
  // morning-briefing cron, so the button took a vendor off Discover and stopped
  // her good-morning message while she kept her account, leads, portfolio and AI.
  // 「 why suspend any vendor. i can delete the vendor 」 · 「 revoke doesnt serve
  // any purpose 」. Deleted, not renamed: Delete is one row below and means it.

  const deleteVendor = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/v2/admin/vendors/${id}`, {
        method: 'DELETE',
        headers: adminHeaders(),
        body: JSON.stringify({ confirm: true }),
      });
      if (!res.ok) throw new Error('Failed');
      setVendors(v => v.filter(x => x.id !== id));
      showToast('Vendor deleted.');
      setOpenId(null); setConfirmDel(null);
    } catch { showToast('Failed to delete.', true); }
  };

  const filtered = vendors.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !search || v.name?.toLowerCase().includes(q) || v.phone?.includes(search);
    const matchFilter = filter === 'all' || v.tier === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <PageHeader title="Makers" sub={`${vendors.length} total vendors`}
        action={<GhostBtn label="+ New" onClick={() => setMinting(true)} small />} />
      <MintSheet visible={minting} kind="vendor" onClose={() => setMinting(false)} onMinted={load} />

      <FieldInput label="Search" value={search} onChange={setSearch} placeholder="Name or phone…" />

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto' as const, paddingBottom: 4, scrollbarWidth: 'none' as const }}>
        {['all', ...TIERS].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 20, border: `0.5px solid ${filter === f ? T.gold : T.border}`, background: filter === f ? T.goldSoft : 'transparent', fontFamily: T.ff.label, fontWeight: filter === f ? 600 : 400, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: filter === f ? T.gold : T.soft, minHeight: 36 }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {[1,2,3].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 72 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 18 }}>No vendors found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {filtered.map(v => {
            const open = openId === v.id;
            return (
              <div key={v.id} style={{ background: T.card, border: `0.5px solid ${open ? T.borderStrong : T.border}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 150ms' }}>
                {/* Header row — tap to expand */}
                <div onClick={() => toggleOpen(v.id)} style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', minHeight: 72 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
                    <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.08em' }}>{v.category || '—'} · {v.city || '—'} · {v.phone}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontFamily: T.ff.label, fontSize: 8, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: T.gold, background: T.goldSoft, border: `0.5px solid ${T.gold}`, borderRadius: 20, padding: '3px 10px' }}>{v.tier}</span>
                    {/* ── THE STANDING CHIP (founder-ruled) ─────────────────────
                        THIS READ: `{v.discover_eligible && <span>● DISCOVER</span>}`
                        — one boolean, so a vendor WAITING on the founder looked
                        identical to one who never applied, and an approved-then-
                        hidden vendor looked identical to both. Three standings
                        collapsed into one blank. 「 the screen tells the truth but
                        is speaking the half truth 」.
                        The data was already in hand: the list endpoint returns
                        `discover_request_state`. No backend change; the row simply
                        stopped reading a field it was already being sent. */}
                    {(() => {
                      const st = v.discover_request_state;
                      // Legacy rows: 'approved' with eligibility off is the pair
                      // split by the doors that used to write halves. It reads as
                      // HIDDEN because that is what a couple experiences.
                      const chip =
                        st === 'approved' && v.discover_eligible ? ['● DISCOVER',    T.success]
                      : st === 'approved'                        ? ['● HIDDEN',      T.warning]
                      : st === 'revoked' || st === 'hidden'      ? ['● HIDDEN',      T.warning]
                      : st === 'requested' || st === 'under_review' ? ['● PENDING',  T.gold]
                      : st === 'denied'                          ? ['● NOT APPROVED', T.danger]
                      : null;   // not_requested — never applied is an honest blank
                      return chip && (
                        <span style={{ fontFamily: T.ff.label, fontSize: 7, fontWeight: 600, color: chip[1], letterSpacing: '0.1em' }}>{chip[0]}</span>
                      );
                    })()}
                  </div>
                  <span style={{ color: T.soft, fontSize: 13, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 180ms', flexShrink: 0 }}>›</span>
                </div>

                {/* Expanded actions — inline, no sheet */}
                {open && (
                  <div style={{ padding: '4px 16px 18px', borderTop: `0.5px solid ${T.border}` }}>
                    <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.12em', margin: '14px 0 12px' }}>Joined {fmt(v.created_at)}</div>

                    <div style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 9, color: T.soft, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 10 }}>Tier</div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' as const }}>
                      {TIERS.map(t => (
                        <button key={t} onClick={() => setTier(v.id, t)} style={{ flex: 1, minWidth: 72, padding: '11px 0', borderRadius: 9, border: `0.5px solid ${v.tier === t ? T.gold : T.border}`, background: v.tier === t ? T.goldSoft : 'transparent', fontFamily: T.ff.label, fontWeight: v.tier === t ? 600 : 400, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: v.tier === t ? T.gold : T.soft, minHeight: 44, cursor: 'pointer' }}>{t}</button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      {/* ONE VERB. 'Hide', not 'Pause' — `vendors.discover_paused`
                          is the VENDOR's own switch (migration 0101, hers via
                          PATCH /vendor/me), and one word may not carry two
                          mechanisms. Tapping again unhides. */}
                      <ActionChip label={v.discover_eligible ? 'Hide from Discover' : 'Add to Discover'} tone="neutral" onClick={() => toggleDiscover(v)} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      {confirmWelcome === v.id
                        ? <ActionChip label={welcomeBusy === v.id ? 'Sending…' : 'Tap again to send on WhatsApp'} tone="ok" disabled={welcomeBusy === v.id} onClick={() => welcome(v)} />
                        : <ActionChip label="Send welcome" tone="ok" onClick={() => setConfirmWelcome(v.id)} />}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {confirmDel === v.id
                        ? <ActionChip label="Tap again to delete permanently" tone="no" onClick={() => deleteVendor(v.id)} />
                        : <ActionChip label="Delete" tone="no" onClick={() => setConfirmDel(v.id)} />}
                    </div>
                    {confirmDel === v.id && <p style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted, letterSpacing: '0.08em', marginTop: 8 }}>Deletes all vendor data — leads, invoices, events, portfolio. Cannot be undone.</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
