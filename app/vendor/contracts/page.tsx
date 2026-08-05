'use client';
// /wedding/contracts — Contracts · Atelier rebuild
// PDF storage. List + upload + detail sheet with state transitions.

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchContracts, requestContractUpload, finalizeContract,
         updateContract, sendContract, fetchContractDownload, cancelContract } from '@/lib/vendor/api/vendor';
import type { Contract } from '@/lib/vendor/types/vendor';

const A = {
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: 'var(--role-metal)', brassWarm: 'var(--atelier-label)', green: 'var(--role-positive)', red: 'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script: 'var(--font-cormorant), Georgia, serif',
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
  caretColor: A.brass,
};
const labelStyle: React.CSSProperties = {
  fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute,
  letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6,
};

export default function ContractsPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} />;
  return <ContractsScreen vendorName={session.name ?? null} />;
}

function ContractsScreen({ vendorName }: { vendorName: string | null }) {
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
      <Header vendorName={vendorName} />

      <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
        <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.brassWarm, fontFamily: F.display, fontSize: 20, lineHeight: 1 }}>‹</button>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, flex: 1 }}>Contracts</span>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Loading…</div>
        </div>
      ) : contracts.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', gap: 6 }}>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.2 }}>No contracts yet.</div>
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Tap the + to upload your first.</div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 110 }}>
          {contracts.map(c => (
            <div key={c.id} onClick={() => setSelected(c)} style={{
              padding: '16px 24px', cursor: 'pointer',
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
          position: 'fixed', bottom: 'calc(82px + env(safe-area-inset-bottom))', right: 20, zIndex: 10,
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
                fontFamily: F.script, fontStyle: file ? 'normal' : 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5,
                color: file ? A.ink : A.inkMute, textAlign: 'left',
              }}>
                {file ? file.name : 'Choose a PDF…'}
              </button>
            </div>
            {(!canUpload && !uploading) && <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: A.red, marginTop: 2 }}>Title and PDF are required.</div>}
            {uploading && <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: A.brassWarm }}>{uploadProgress}</div>}

            <button type="button" onClick={doUpload} disabled={!canUpload || uploading} className="atelier-fab" style={{
              padding: '14px 0', borderRadius: 2, cursor: (canUpload && !uploading) ? 'pointer' : 'default',
              border: '0.5px solid var(--atelier-label)',
              fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
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
              {selected.file_size && <span style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>{Math.round(selected.file_size/1024)} KB</span>}
              {selected.sent_at && <span style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Sent {new Date(selected.sent_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
              {selected.signed_at && <span style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: A.green }}>Signed {new Date(selected.signed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
            </div>
            {selected.notes && <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, color: A.inkSoft, lineHeight: 1.5 }}>{selected.notes}</div>}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              <button type="button" onClick={() => doDownload(selected)} className="atelier-fab" style={{
                flex: '1 1 100%', padding: '13px 0', borderRadius: 2, cursor: 'pointer',
                border: '0.5px solid var(--atelier-label)',
                fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
                letterSpacing: '0.42em', textTransform: 'uppercase',
              }}>Download</button>
              {selected.state === 'draft' && (
                <button type="button" onClick={() => doSend(selected)} disabled={saving} style={{
                  flex: 1, padding: '12px 0', background: 'transparent',
                  border: '0.5px solid rgba(201,168,76,0.5)', borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.brassWarm,
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
