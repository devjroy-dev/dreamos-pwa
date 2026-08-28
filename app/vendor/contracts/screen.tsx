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
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useInShell } from '@/hooks/vendor/useInShell';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchContracts, requestContractUpload, finalizeContract,
         updateContract, sendContract, fetchContractDownload, cancelContract } from '@/lib/vendor/api/vendor';
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
  const inShell = useInShell();
  const router = useRouter();
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
    fetchContracts().then(r => { if (r.ok) setContracts((r as { contracts: Contract[] }).contracts); })
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
      {!inShell && (
        <div style={{ padding: '12px var(--slice-inset, 22px)', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
          <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.interactiveWarm, fontFamily: F.display, fontSize: 20, lineHeight: 1 }}>‹</button>
          <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, flex: 1 }}>Contracts</span>
        </div>
      )}

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
              }}>{c.state}</span>
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={() => { setUploadOpen(true); setTitle(''); setFile(null); }}
        aria-label="Upload contract" className="atelier-fab"
        style={{
        // F-38.59: the offset reads the tree. 82 clears the OLD shell's BottomNav; the
          // worklist shell's chrome is the dock (8+44+8, AiDock.tsx:82-83) plus the nav seat
          // (52, WorklistShell.tsx:188) = 112.5, and 120 is that plus one step of the
          // 8-scale. Two numbers, each read from the file that owns the chrome it clears —
          // and neither invented here: `SliceShell` derived them when the list family
          // crossed, and this crossing inherits rather than re-deriving.
          position: 'fixed', bottom: inShell ? 'calc(120px + env(safe-area-inset-bottom))' : 'calc(82px + env(safe-area-inset-bottom))', right: 20, zIndex: 10,
          width: 46, height: 46, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: F.body, fontSize: 20, fontWeight: 400, lineHeight: 1,
          cursor: 'pointer', border: '0.5px solid var(--atelier-label)',
        }}>+</button>

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
              }}>{selected.state}</span>
              {selected.file_size && <span style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>{Math.round(selected.file_size/1024)} KB</span>}
              {selected.sent_at && <span style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Sent {new Date(selected.sent_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
              {selected.signed_at && <span style={{ fontFamily: F.script, fontSize: 16, lineHeight: 1.5, color: A.green }}>Signed {new Date(selected.signed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
            </div>
            {selected.notes && <div style={{ fontFamily: F.script, fontSize: 16, color: A.inkSoft, lineHeight: 1.5 }}>{selected.notes}</div>}

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
              {selected.state === 'sent' && (
                <button type="button" onClick={() => doMarkSigned(selected)} disabled={saving} style={{
                  flex: 1, padding: '12px 0', background: 'transparent',
                  border: `0.5px solid ${A.green}`, borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.green,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>Mark Signed</button>
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
