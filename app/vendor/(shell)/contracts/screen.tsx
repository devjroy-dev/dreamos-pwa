// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock's screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// app/vendor/contracts/screen.tsx — THE CONTRACTS BODY, NO CHROME.
//
// ── §4-4 · CONTRACTS CROSSES · R-38.11 · R-38.12 ───────────────────────────
// Two routes render this module and neither owns it: `app/w/contracts/page.tsx` mounts it
// inside `WorklistShell`, and `app/vendor/contracts/page.tsx` survives as the untouched
// fallback and supplies the old `<Header/>` itself. IMPORTED by both, copied by neither.
//
// ── THE `Header` IMPORT IS GONE FROM THIS FILE AND ITS ABSENCE IS ASSERTED ──
// S2's `SliceShell` finding: a conditional does not remove a module from a bundle; only not
// importing it does. The mount lives at the fallback ROUTE.
//
// ── THE MASTHEAD ROW RETIRES WHOLE, WHICH IS DIFFERENT FROM ITS TWO SIBLINGS ─
// Portfolio's and Couture's rows kept their right halves because those carried the only way
// to add a photo and the only way to add a slot. THIS row is a chevron and the word
// 「CONTRACTS」 and nothing else — no action rides on it — so inside the shell it goes
// entirely, hairline included. F-38.18's kin: founder-vetoed prose retires WITH the surface
// it described, and a row kept for symmetry with its siblings would be chrome kept for the
// look of the diff.
//
// ── `vendorName` LEFT WITH THE MOUNT, AND SO DID EVERY PROP ────────────────
// It was the component's ONLY parameter and it fed only `<Header>`. Derived, not assumed:
// after the lift the signature was empty. This body reads its own data through the API
// client and needs nothing from either route.
//
// ── THE DECLARED GAPS ──────────────────────────────────────────────────────
// The body carries the rooms' older type register and F-38.22's colour literals (R-38.12).
// Its upload and detail sheets are full-cover `position:fixed` with live catchers, which
// R-38.22 has ruled the estate's standing sheet behaviour. The FAB reads the tree (F-38.59).

import { useEffect, useState, useRef } from 'react';
import { INK_DEEP } from '@/lib/vendor/theme';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Fab } from '@/components/worklist/Fab';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchContracts, fetchAllContracts, requestContractUpload, finalizeContract,
         updateContract, sendContract, fetchContractDownload, cancelContract,
         contractPreviewUrl, sendContractToCouple, markContractDeposit } from '@/lib/vendor/api/vendor';
// TDW_09 R-U25: the ONE money home. A second formatter here would be a second
// way to write Rs 18,000, and the estate has spent a finding on that already.
import { formatRs } from '@/lib/vendor/format';
import type { Contract } from '@/lib/vendor/types/vendor';

const A = {
  // R-37.74 arm (iii): the interactive half of the old `brass`. Buttons, chips, carets
  // and active states read this; the wordmark, section headers and hairlines keep `brass`.
  interactive:     'var(--atelier-accent-text)',
  interactiveWarm: 'var(--atelier-accent-text)',
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: 'var(--role-metal)', brassWarm: 'var(--atelier-label)', green: 'var(--role-positive)', red: 'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script: 'var(--font-dm-sans), system-ui, sans-serif' /* R-37.76 (3)+(7): Cormorant is RETIRED FROM PROSE. The rooms were setting body copy in Cormorant italic while the shell set it in DM Sans, and that — not size — is why they read as two font worlds. One family, one job. Cormorant's feature use survives where a surface deliberately calls for it. */,
  body: 'var(--font-dm-sans), system-ui, sans-serif',
  label: 'var(--font-jost), system-ui, sans-serif',
} as const;

const STATE_COLOR: Record<string, string> = {
  draft: A.inkMute, sent: A.brassWarm, signed: A.green, cancelled: A.red,
};

// ── F-40.116 · THE STATE WORD IS THE DATABASE'S, TITLE-CASED ────────────────
// This room printed `{c.state}` RAW, so it said `draft` in lowercase while the
// invoice document — the other paper the same couple receives — said `Unpaid`.
// One estate, two vocabularies for one kind of fact.
//
// ⚠ A POSITIVE LIST, for the reason `invoicePdf.js:57` gives for its own: an
// unknown fifth state must fall through to something HONEST rather than be
// captioned by a default that assumes. `contracts_state_check` allows exactly
// these four, so the fallback is unreachable today and is kept anyway — the
// day it becomes reachable is the day it matters.
// Veto sheet rows 1–4, founder-vetoed 2026-09-06.
const STATE_WORD: Record<string, string> = {
  draft: 'Draft', sent: 'Sent', signed: 'Signed', cancelled: 'Cancelled',
};
const stateWord = (s: string) => STATE_WORD[s] ?? s;

// ── THE DEPOSIT LINE — veto rows 5-8 ───────────────────────────────────────
// ⚠ `deposit_pct === null` MEANS NOT SET AND NEVER ZERO. The CHECK forbids zero
// precisely so the two cannot be confused; the room says `No deposit set` rather
// than drawing `Rs 0`, which would be a figure nobody entered.
//
// ⚠ AND A CANCELLED CONTRACT'S DEPOSIT IS `not taken`, NOT `cancelled`. Saying
// cancelled twice on one row tells a vendor nothing; the money under clause 5 is
// a question for her, and the row states the fact rather than the verdict.
function depositLine(c: Contract, fee: number | null): string {
  if (c.deposit_pct === null || c.deposit_pct === undefined) return 'No deposit set';
  const amount = fee === null ? null : Math.round((fee * c.deposit_pct) / 100);
  const money = amount === null ? `${c.deposit_pct}%` : `Rs ${formatRs(amount)}`;
  if (c.state === 'cancelled') return `Deposit ${money} \u00b7 not taken`;
  if (c.deposit_received_at) {
    const d = new Date(c.deposit_received_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `Deposit ${money} \u00b7 received ${d}`;
  }
  return `Deposit ${money} \u00b7 awaiting`;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', boxSizing: 'border-box',
  background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-input-border)', borderRadius: 2,
  fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink, outline: 'none',
  caretColor: A.interactive,
};
const labelStyle: React.CSSProperties = {
  fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute,
  letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6,
};


export function ContractsScreen() {
  const { toast, show } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contract | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // ── ALL FOUR STATES — F-40.115, R-G32.15 ──────────────────────────────
    // `fetchAllContracts` is `fetchContracts` with `include_cancelled=1`. The
    // door's default still hides cancelled rows and every other caller keeps it;
    // only this room asks for the whole set, because only this room draws the
    // cancelled section at the foot.
    fetchAllContracts().then(r => { if (r.ok) setContracts((r as { contracts: Contract[] }).contracts); })
      .finally(() => setLoading(false));
  }, []);

  async function doUpload() {
    if (!title.trim() || !file || uploading) return;
    setUploading(true); setUploadProgress('Getting upload URL…');
    try {
      const urlRes = await requestContractUpload(title.trim(), file.name);
      if (!urlRes.ok) { show((urlRes as { error?: string }).error ?? 'Failed', 'error'); setUploading(false); return; }
      const { contract_id, upload_url } = urlRes as { contract_id: string; upload_url: string };
      setUploadProgress('Uploading file…');
      const uploadRes = await fetch(upload_url, { method: 'PUT', body: file, headers: { 'Content-Type': 'application/pdf' } });
      if (!uploadRes.ok) { show('Upload failed — check file is a valid PDF', 'error'); setUploading(false); return; }
      setUploadProgress('Finalizing…');
      const finalRes = await finalizeContract(contract_id);
      if (!finalRes.ok) { show((finalRes as { error?: string }).error ?? 'Finalize failed', 'error'); setUploading(false); return; }
      show('Contract saved', 'success');
      setContracts(prev => [(finalRes as { contract: Contract }).contract, ...prev]);
      setUploadOpen(false); setTitle(''); setFile(null);
    } catch { show('Upload failed', 'error'); }
    setUploading(false); setUploadProgress('');
  }

  async function doDownload(contract: Contract) {
    const res = await fetchContractDownload(contract.id);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    window.open((res as { download_url: string }).download_url, '_blank');
  }
  async function doSend(contract: Contract) {
    setSaving(true);
    const res = await sendContract(contract.id);
    if (!res.ok) show((res as { error?: string }).error ?? 'Failed', 'error');
    else { show('Marked as sent', 'success'); setContracts(prev => prev.map(c => c.id === contract.id ? (res as { contract: Contract }).contract : c)); setSelected(null); }
    setSaving(false);
  }
  async function doMarkSigned(contract: Contract) {
    setSaving(true);
    const res = await updateContract(contract.id, { state: 'signed', signed_at: new Date().toISOString() });
    if (!res.ok) show((res as { error?: string }).error ?? 'Failed', 'error');
    else { show('Marked as signed', 'success'); setContracts(prev => prev.map(c => c.id === contract.id ? (res as { contract: Contract }).contract : c)); setSelected(null); }
    setSaving(false);
  }
  /** ⚠ A FACT, NOT A HEURISTIC. A contract this room COMPOSED carries a deposit
   *  percentage; one a vendor UPLOADED carries none, and cannot — `composeContract`
   *  is the only writer that sets it. Guessing from the title or the storage path
   *  would be a heuristic, and the first row it guessed wrong about would be one
   *  where a vendor could assert a signature she has no witness for. */
  function isComposed(c: Contract) {
    return c.deposit_pct !== null && c.deposit_pct !== undefined;
  }

  async function doSendToCouple(contract: Contract) {
    setSaving(true);
    const res = await sendContractToCouple(contract.id);
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    const r = res as { sign_url: string; sent: boolean };
    // ⚠ NEVER A FALSE DONE. The template is dark by two gates, so nothing was
    // sent and the toast does not say it was. The link goes to the clipboard so
    // the founder can paste it by hand — exactly how `/consent/` is walked today,
    // and the honest shape until `CONTRACT_SIGN_SEND_ENABLED` opens.
    if (r.sent) show('Sent to the couple', 'success');
    else {
      try { await navigator.clipboard.writeText(r.sign_url); show('Link copied \u2014 sending is not open yet', 'success'); }
      catch { show(r.sign_url, 'success'); }
    }
    setSelected(null);
    const list = await fetchAllContracts();
    if (list.ok) setContracts((list as { contracts: Contract[] }).contracts);
  }

  async function doDeposit(contract: Contract) {
    setSaving(true);
    const res = await markContractDeposit(contract.id, true);
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    const updated = (res as { contract: Contract }).contract;
    setContracts(prev => prev.map(c => (c.id === contract.id ? updated : c)));
    setSelected(updated);
  }

  async function doCancel(contract: Contract) {
    setSaving(true);
    const res = await cancelContract(contract.id);
    if (!res.ok) show((res as { error?: string }).error ?? 'Failed', 'error');
    else { show('Contract cancelled', 'success'); setContracts(prev => prev.filter(c => c.id !== contract.id)); setSelected(null); }
    setSaving(false);
  }
  const canUpload = title.trim().length > 0 && file !== null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Toast toast={toast} />

      {/* ── THE ROW RETIRES WHOLE INSIDE THE SHELL, HAIRLINE INCLUDED ────────
          Chevron plus the word 「CONTRACTS」 and nothing else. WorklistShell already prints
          the room's word and the two nav seats are the way back, so every byte in this row
          is said better one element above it. Portfolio and Couture kept their rows because
          an ACTION rode on each; nothing rides on this one, and keeping it for symmetry
          with its siblings would be chrome kept for the look of the diff. */}
      

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Loading…</div>
        </div>
      ) : contracts.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', gap: 6 }}>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.2 }}>No contracts yet.</div>
          <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Tap the + to upload your first.</div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 110 }}>
          {contracts.map(c => (
            <div key={c.id} onClick={() => setSelected(c)} style={{
              padding: '16px var(--slice-inset, 24px)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 16,
              borderBottom: '0.5px solid var(--atelier-card-border)',
            }}>
              <span style={{
                flexShrink: 0, width: 32, textAlign: 'center',
                fontFamily: F.display, fontWeight: 400, fontSize: 20, color: A.brassWarm, lineHeight: 1,
              }}>§</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, color: A.ink, letterSpacing: '0.005em', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, color: 'var(--atelier-label)', letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: 4 }}>
                  {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {c.file_size ? ` · ${Math.round(c.file_size / 1024)} KB` : ''}
                </div>
              </div>
              <span style={{
                fontFamily: F.label, fontWeight: 400, fontSize: 8, color: STATE_COLOR[c.state],
                letterSpacing: '0.28em', textTransform: 'uppercase',
                border: `0.5px solid ${STATE_COLOR[c.state]}`, borderRadius: 2, padding: '4px 9px', flexShrink: 0,
              }}>{stateWord(c.state)}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── CE-39 S2/8 · F-39.4 · A FIFTH AND SIXTH SEAT, FOUND BY RETIRING A SKIP ──
          This file inherited SliceShell's 46-at-120 when it crossed, and that was correct at
          F-38.59. F-39.4 gave the estate ONE seat — 56 at GRID.fab.bottom, reached through
          components/worklist/Fab.tsx — so an inherited number is now a second home for a
          fact that has one. NOT FOUND BY A WALK AND NOT BY THE HOTFIX: found the moment
          C39's inShell skip was retired, which is the ruling that let the cell see its own
          exemption. The founder saw Calendar; the cell then named these two.
          The /vendor arm keeps its 82 and DECLARES itself, so the exemption is claimed in
          the markup rather than inferred from proximity. */}
      {<Fab label="Upload contract" onClick={() => { setUploadOpen(true); setTitle(''); setFile(null); }} />}

      {uploadOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--atelier-overlay)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => !uploading && setUploadOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%',
            background: 'var(--atelier-sheet-bg)',
            backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderTop: '0.5px solid var(--atelier-sheet-border)',
            padding: '20px 24px calc(24px + env(safe-area-inset-bottom))',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
            </div>
            <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>New Contract</div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.15, marginBottom: 4 }}>Upload PDF</div>

            <div><div style={labelStyle}>Title *</div><input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Booking contract — Priya Sharma" /></div>
            <div>
              <div style={labelStyle}>PDF File *</div>
              <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] || null)} />
              <button type="button" onClick={() => fileRef.current?.click()} style={{
                width: '100%', padding: '12px 14px',
                background: 'var(--atelier-input-bg)',
                border: '0.5px solid var(--atelier-input-border)', borderRadius: 2, cursor: 'pointer',
                // R-37.86 per-site verdict: KEEP. Italic here marks an EMPTY field and normal a filled
                // one — that is STATE, the job a placeholder colour does, not the prose voice the
                // mock's screen four killed. Converting it would delete a signal.
                fontFamily: F.script, fontStyle: file ? 'normal' : 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5,
                color: file ? A.ink : A.inkMute, textAlign: 'left',
              }}>
                {file ? file.name : 'Choose a PDF…'}
              </button>
            </div>
            {(!canUpload && !uploading) && <div style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.red, marginTop: 2 }}>Title and PDF are required.</div>}
            {uploading && <div style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.brassWarm }}>{uploadProgress}</div>}

            <button type="button" onClick={doUpload} disabled={!canUpload || uploading} className="atelier-fab" style={{
              padding: '14px 0', borderRadius: 2, cursor: (canUpload && !uploading) ? 'pointer' : 'default',
              border: '0.5px solid var(--atelier-label)',
              fontFamily: F.label, fontWeight: 400, fontSize: 10, color: INK_DEEP,
              letterSpacing: '0.42em', textTransform: 'uppercase',
              opacity: (canUpload && !uploading) ? 1 : 0.5, marginTop: 6,
            }}>{uploading ? uploadProgress || 'Uploading…' : 'Upload'}</button>
          </div>
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--atelier-overlay)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%',
            background: 'var(--atelier-sheet-bg)',
            backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderTop: '0.5px solid var(--atelier-sheet-border)',
            padding: '20px 24px calc(24px + env(safe-area-inset-bottom))',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
            </div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.2 }}>{selected.title}</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                fontFamily: F.label, fontWeight: 400, fontSize: 8, color: STATE_COLOR[selected.state],
                letterSpacing: '0.28em', textTransform: 'uppercase',
                border: `0.5px solid ${STATE_COLOR[selected.state]}`, borderRadius: 2, padding: '4px 9px',
              }}>{stateWord(selected.state)}</span>
              {selected.file_size && <span style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>{Math.round(selected.file_size/1024)} KB</span>}
              {selected.sent_at && <span style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Sent {new Date(selected.sent_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
              {selected.signed_at && <span style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.green }}>Signed {new Date(selected.signed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
            </div>
            {selected.notes && <div style={{ fontFamily: F.script, fontSize: 16, color: A.inkSoft, lineHeight: 1.5 }}>{selected.notes}</div>}

            {/* ── THE COMPOSED CONTRACT'S OWN CONTROLS ────────────────────────
                Preview goes through `renderContract`, the ONE call site, so what
                she sees is what the couple will see — rendered from the row, never
                served from a stored draft that could predate her last edit. */}
            {isComposed(selected) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
                {selected.state === 'signed' && (
                  <div style={{ ...labelStyle, marginBottom: 0, color: A.green }}>
                    {selected.deposit_received_at
                      ? `Received ${new Date(selected.deposit_received_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                      : depositLine(selected, null).replace(/^Deposit /, 'Awaiting ').replace(/ \u00b7 awaiting$/, '')}
                  </div>
                )}
                {/* Veto row 51 — master §7 said to a vendor in her own room, rather
                    than left to be inferred from the absence of a pay button. */}
                {selected.state === 'signed' && !selected.deposit_received_at && (
                  <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>
                    She pays you directly \u2014 UPI or bank, as printed on the agreement. Nothing comes through this platform.
                  </div>
                )}
                {selected.state === 'signed' && !selected.deposit_received_at && (
                  <button type="button" onClick={() => doDeposit(selected)} disabled={saving} style={{
                    padding: '12px 0', background: 'transparent',
                    border: `0.5px solid ${A.green}`, borderRadius: 2, cursor: 'pointer',
                    fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.green,
                    letterSpacing: '0.32em', textTransform: 'uppercase',
                  }}>Mark the deposit received</button>
                )}
                {selected.state === 'signed' && selected.deposit_received_at && (
                  <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkSoft }}>
                    The date is held.
                  </div>
                )}
                <button type="button" onClick={() => window.open(contractPreviewUrl(selected.id), '_blank')} style={{
                  padding: '12px 0', background: 'transparent',
                  border: '0.5px solid var(--atelier-accent-text)', borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.interactive,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Preview the PDF</button>
                {selected.state !== 'signed' && selected.state !== 'cancelled' && (
                  <button type="button" onClick={() => doSendToCouple(selected)} disabled={saving} style={{
                    padding: '12px 0', background: 'var(--atelier-accent-text)',
                    border: 'none', borderRadius: 2, cursor: 'pointer',
                    fontFamily: F.label, fontWeight: 400, fontSize: 9, color: INK_DEEP,
                    letterSpacing: '0.32em', textTransform: 'uppercase',
                  }}>Send to the couple</button>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              <button type="button" onClick={() => doDownload(selected)} className="atelier-fab" style={{
                flex: '1 1 100%', padding: '13px 0', borderRadius: 2, cursor: 'pointer',
                border: '0.5px solid var(--atelier-label)',
                fontFamily: F.label, fontWeight: 400, fontSize: 10, color: INK_DEEP,
                letterSpacing: '0.42em', textTransform: 'uppercase',
              }}>Download</button>
              {selected.state === 'draft' && (
                <button type="button" onClick={() => doSend(selected)} disabled={saving} style={{
                  flex: 1, padding: '12px 0', background: 'transparent',
                  border: '0.5px solid rgba(201,168,76,0.5)', borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.interactiveWarm,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Mark Sent</button>
              )}
              {/* ── R-G32.14 / F12 · `MARK SIGNED` IS FOR AN UPLOADED CONTRACT ──
                  KEPT, because clause 12's last line is that a couple who would
                  rather sign on paper can, and the vendor is the only witness to
                  that. REFUSED on a COMPOSED one, because a vendor asserting a
                  signature with no OTP witness and no digest is the estate's own
                  F-04.71 costume class wearing a button — the sealed PDF's
                  fingerprint would be a claim about a signing that never
                  happened.
                  `isComposed` is the test and it is a FACT, not a heuristic: a
                  composed contract has a deposit percentage and an uploaded one
                  has none. */}
              {selected.state === 'sent' && !isComposed(selected) && (
                <button type="button" onClick={() => doMarkSigned(selected)} disabled={saving} style={{
                  flex: 1, padding: '12px 0', background: 'transparent',
                  border: `0.5px solid ${A.green}`, borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.green,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Mark Signed</button>
              )}
              {/* ⚠ A SENTENCE, NOT A GREYED BUTTON. s-G11.2's shape for the fifth
                  time in this arc: a refusal drawn as something tappable is worse
                  than no control. Veto row 47. */}
              {selected.state === 'sent' && isComposed(selected) && (
                <div style={{
                  flex: '1 1 100%', padding: 12, borderRadius: 2,
                  border: `0.5px solid ${A.red}`,
                  fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.red,
                }}>This one was filled here and is signed by the couple. Mark signed is for a contract you uploaded.</div>
              )}
              {selected.state !== 'cancelled' && (
                <button type="button" onClick={() => doCancel(selected)} disabled={saving} style={{
                  flex: 1, padding: '12px 0', background: 'transparent',
                  border: '0.5px solid rgba(224,123,92,0.4)', borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.red,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Cancel</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
