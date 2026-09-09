'use client';
// Admin Discovery Approval Queue
// This is the single place where vendor discovery is controlled.
// Pending tab: vendors who submitted for review.
// Live tab: vendors currently in the couple feed (with Revoke option).
// Drawer: full profile view with per-photo approve/reject.
import { useEffect, useState, useCallback } from 'react';
import { API_BASE } from '../../../lib/api';
import { adminHeaders, API_BASE as _AB } from '@/lib/admin-api/_base';
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home


// ─── Types ───────────────────────────────────────────────────────────────────
interface Vendor {
  id: string;
  name: string;
  category: string;
  city: string;
  phone: string;
  tier: string;
  is_approved: boolean;
  discover_listed: boolean;
  vendor_discover_enabled: boolean;
  discover_submitted_at: string | null;
  discover_approved_at: string | null;
  discover_rejected_reason: string | null;
  about: string | null;
  starting_price: number | null;
  vibe_tags: string[] | null;
  instagram_url: string | null;
  portfolio_images: string[] | null;
  featured_photos: string[] | null;
}
interface VendorImage {
  id: string;
  url: string;
  tags: string[];
  approved: boolean;
  rejection_reason?: string | null;
}
interface MakerDetail {
  vendor: Vendor;
  images: VendorImage[];
  subscription: { tier: string } | null;
  clients: { id: string }[];
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}
function fmtINR(n: number | null) {
  if (!n) return '—';
  return formatRs(Number(n)); // TDW_09 R-U25
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--atelier-sheet-bg)', color: 'var(--atelier-page-bg)',
      fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 300,
      padding: '10px 20px', borderRadius: 100, zIndex: 9999, whiteSpace: 'nowrap',
    }}>{msg}</div>
  );
}

function TierChip({ tier }: { tier: string }) {
  // ⊘-2 — the tier chip was ink-on-wash, and prestige was near-black fill with cream ink.
  // One map now, the tier's ink; the chip is transparent with that ink on its edge.
  // (The pass cannot see these: an object literal has no CSS property in front of it.)
  const col: Record<string, string>  = {
    essential: 'var(--atelier-ink-mute)',
    signature: 'var(--role-metal)',
    prestige:  'var(--atelier-accent-text)',
  };
  return (
    <span style={{
      fontFamily: "'Jost',sans-serif", fontSize: 8, fontWeight: 300,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      padding: '2px 8px', borderRadius: 100,
      background: 'transparent', border: `0.5px solid ${col[tier] || 'var(--atelier-card-border)'}`, color: col[tier] || 'var(--atelier-ink-mute)',
    }}>{tier}</span>
  );
}

// ─── Vendor row in the table ──────────────────────────────────────────────────
function VendorRow({
  vendor, onOpen,
}: {
  vendor: Vendor;
  onOpen: () => void;
}) {
  const isLive = vendor.is_approved && vendor.discover_listed && vendor.vendor_discover_enabled;
  return (
    <tr
      onClick={onOpen}
      style={{ cursor: 'pointer', borderBottom: '0.5px solid var(--atelier-card-border)' }}
    >
      <td style={{ padding: '12px 14px' }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 300, color: 'var(--atelier-ink)', margin: '0 0 2px' }}>{vendor.name}</p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 300, color: 'var(--atelier-ink-mute)', margin: 0 }}>{vendor.category} · {vendor.city}</p>
      </td>
      <td style={{ padding: '12px 14px' }}><TierChip tier={vendor.tier} /></td>
      <td style={{ padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--atelier-ink-mute)' }}>{fmtDate(vendor.discover_submitted_at)}</td>
      <td style={{ padding: '12px 14px' }}>
        <span style={{
          fontFamily: "'Jost',sans-serif", fontSize: 8, fontWeight: 300,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: 100,
          background: isLive ? 'var(--atelier-row-hover)' : 'var(--atelier-row-hover)',
          color: isLive ? 'var(--role-positive)' : 'var(--role-metal)',
        }}>{isLive ? '● Live' : '○ Pending'}</span>
      </td>
      <td style={{ padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--role-metal)' }}>Review →</td>
    </tr>
  );
}

// ─── Full-screen drawer ───────────────────────────────────────────────────────
function ReviewDrawer({
  detail,
  onClose,
  onApproved,
  onRevoked,
  onRejected,
  showToast,
}: {
  detail: MakerDetail;
  onClose: () => void;
  onApproved: (id: string) => void;
  onRevoked: (id: string) => void;
  onRejected: (id: string, reason: string) => void;
  showToast: (msg: string) => void;
}) {
  const { vendor, images } = detail;
  const [localImages, setLocalImages] = useState<VendorImage[]>(images);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [denyReason, setDenyReason] = useState('');
  const [showDenyForm, setShowDenyForm] = useState(false);
  const [working, setWorking] = useState(false);

  const isLive = vendor.is_approved && vendor.discover_listed && vendor.vendor_discover_enabled;
  const approvedPhotoCount = localImages.filter(i => i.approved).length;
  const hasHero = localImages.some(i => i.tags?.includes('hero') && i.approved);
  // Approve for Discovery requires min 5 approved photos + hero approved
  const canApprove = approvedPhotoCount >= 5 && hasHero;

  // ── Per-photo approve ─────────────────────────────────────────────────────
  async function approvePhoto(imgId: string) {
    setWorking(true);
    try {
      await fetch(`${API_BASE}/api/v3/admin/images/${imgId}`, {
        method: 'PATCH', headers: adminHeaders(),
        body: JSON.stringify({ approved: true }),
      });
      setLocalImages(prev => prev.map(i => i.id === imgId ? { ...i, approved: true, rejection_reason: null } : i));
    } catch { showToast('Failed to approve photo'); }
    setWorking(false);
  }

  // ── Per-photo reject ──────────────────────────────────────────────────────
  async function rejectPhoto(imgId: string, note: string) {
    if (!note.trim()) return;
    setWorking(true);
    try {
      await fetch(`${API_BASE}/api/v3/admin/images/${imgId}`, {
        method: 'PATCH', headers: adminHeaders(),
        body: JSON.stringify({ approved: false, rejection_reason: note }),
      });
      setLocalImages(prev => prev.map(i => i.id === imgId ? { ...i, approved: false, rejection_reason: note } : i));
      setRejectTarget(null);
      setRejectNote('');
    } catch { showToast('Failed to reject photo'); }
    setWorking(false);
  }

  // ── Approve for Discovery — sets all 3 flags atomically ──────────────────
  // This is the moment a vendor goes live on the couple feed.
  async function approveForDiscovery() {
    if (!canApprove || working) return;
    setWorking(true);
    try {
      await fetch(`${API_BASE}/api/v3/admin/makers/${vendor.id}`, {
        method: 'PATCH', headers: adminHeaders(),
        body: JSON.stringify({
          is_approved: true,
          discover_listed: true,
          vendor_discover_enabled: true,
        }),
      });
      showToast(`✓ ${vendor.name} is now live on couple discovery`);
      onApproved(vendor.id);
      onClose();
    } catch { showToast('Failed to approve for Discovery'); }
    setWorking(false);
  }

  // ── Deny profile ──────────────────────────────────────────────────────────
  async function denyProfile() {
    if (!denyReason.trim() || working) return;
    setWorking(true);
    try {
      await fetch(`${API_BASE}/api/v3/admin/makers/${vendor.id}`, {
        method: 'PATCH', headers: adminHeaders(),
        body: JSON.stringify({
          is_approved: false,
          discover_listed: false,
          vendor_discover_enabled: false,
        }),
      });
      // Set rejection reason on vendors row
      await fetch(`${API_BASE}/api/vendors/${vendor.id}`, {
        method: 'PATCH', headers: adminHeaders(),
        body: JSON.stringify({ discover_rejected_reason: denyReason }),
      });
      showToast(`Profile denied — ${vendor.name} notified`);
      onRejected(vendor.id, denyReason);
      onClose();
    } catch { showToast('Failed to deny profile'); }
    setWorking(false);
  }

  // ── Revoke (remove live vendor from feed) ─────────────────────────────────
  async function revokeFromFeed() {
    if (working) return;
    setWorking(true);
    try {
      await fetch(`${API_BASE}/api/v2/admin/vendors/${vendor.id}/revoke`, {
        method: 'PATCH', headers: adminHeaders(),
      });
      showToast(`${vendor.name} removed from feed`);
      onRevoked(vendor.id);
      onClose();
    } catch { showToast('Failed to revoke'); }
    setWorking(false);
  }

  const heroImage = localImages.find(i => i.tags?.includes('hero'));
  const otherImages = localImages.filter(i => !i.tags?.includes('hero'));

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'var(--role-scrim)', zIndex: 300,
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: 560,
        background: 'var(--atelier-card-bg)', zIndex: 301,
        overflowY: 'auto', padding: '0 0 80px',
        boxShadow: '-4px 0 24px var(--atelier-card-shadow)',
        animation: 'slideInRight 300ms cubic-bezier(0.22,1,0.36,1)',
      }}>
        {/* Header */}
        <div style={{
          position: 'sticky', top: 0, background: 'var(--atelier-card-bg)',
          borderBottom: '0.5px solid transparent', padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10,
        }}>
          <div>
            <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 8, fontWeight: 200, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--atelier-ink-mute)', margin: '0 0 2px' }}>REVIEWING</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, color: 'var(--atelier-ink)', margin: 0 }}>{vendor.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--atelier-ink-mute)', padding: 4 }}>✕</button>
        </div>

        <div style={{ padding: '20px' }}>

          {/* Key info strip */}
          <div style={{
            display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20,
            padding: '12px 14px', background: 'var(--atelier-page-bg)', borderRadius: 10,
          }}>
            <TierChip tier={vendor.tier} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--atelier-ink-mute)' }}>{vendor.category}</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--atelier-ink-mute)' }}>·</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--atelier-ink-mute)' }}>{vendor.city}</span>
            {vendor.starting_price && (
              <>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--atelier-ink-mute)' }}>·</span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--role-metal)' }}>from {fmtINR(vendor.starting_price)}</span>
              </>
            )}
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--atelier-ink-mute)' }}>·</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--atelier-ink-mute)' }}>{vendor.phone}</span>
          </div>

          {/* Bio */}
          {vendor.about && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 8, fontWeight: 200, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--atelier-ink-mute)', margin: '0 0 8px' }}>BIO</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 300, color: 'var(--atelier-ink-soft)', lineHeight: 1.6, margin: 0 }}>{vendor.about}</p>
            </div>
          )}

          {/* Vibe tags */}
          {vendor.vibe_tags && vendor.vibe_tags.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 8, fontWeight: 200, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--atelier-ink-mute)', margin: '0 0 8px' }}>VIBE TAGS</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {vendor.vibe_tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300,
                    letterSpacing: '0.1em', padding: '3px 10px', borderRadius: 100,
                    background: 'var(--atelier-section-bg)', color: 'var(--atelier-ink-soft)',
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Instagram */}
          {vendor.instagram_url && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 8, fontWeight: 200, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--atelier-ink-mute)', margin: '0 0 4px' }}>INSTAGRAM</p>
              <a href={`https://instagram.com/${vendor.instagram_url.replace('@','')}`} target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'var(--role-metal)' }}>
                @{vendor.instagram_url.replace('@','')}
              </a>
            </div>
          )}

          {/* ── Photos section ─────────────────────────────────────────────── */}
          <div style={{ borderTop: '0.5px solid var(--atelier-card-border)', paddingTop: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 8, fontWeight: 200, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--atelier-ink-mute)', margin: 0 }}>
                PHOTOS ({approvedPhotoCount} approved of {localImages.length})
              </p>
              {!canApprove && (
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'var(--role-critical)', margin: 0 }}>
                  Need {Math.max(0, 5 - approvedPhotoCount)} more approved{!hasHero ? ' + hero' : ''}
                </p>
              )}
            </div>

            {/* Hero photo */}
            {heroImage && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--role-metal)', margin: '0 0 6px' }}>HERO</p>
                <PhotoCard img={heroImage} onApprove={approvePhoto} onReject={setRejectTarget} working={working} />
              </div>
            )}

            {/* Portfolio grid */}
            {otherImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {otherImages.map(img => (
                  <PhotoCard key={img.id} img={img} onApprove={approvePhoto} onReject={setRejectTarget} working={working} />
                ))}
              </div>
            )}

            {localImages.length === 0 && (
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'var(--atelier-ink-mute)', fontStyle: 'italic' }}>No photos uploaded yet.</p>
            )}
          </div>

          {/* ── Action buttons ─────────────────────────────────────────────── */}
          <div style={{ borderTop: '0.5px solid var(--atelier-card-border)', paddingTop: 20 }}>

            {isLive ? (
              // Already live — only option is revoke
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'var(--role-positive)', margin: '0 0 16px' }}>
                  ● This vendor is live on couple discovery.
                </p>
                <button onClick={revokeFromFeed} disabled={working} style={{
                  height: 44, padding: '0 20px',
                  background: 'transparent', border: '1px solid transparent',
                  borderRadius: 100, cursor: working ? 'default' : 'pointer',
                  fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300,
                  letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--role-critical)',
                }}>Remove from Feed</button>
              </div>
            ) : (
              // Pending — approve or deny
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Approve */}
                <button
                  onClick={approveForDiscovery}
                  disabled={!canApprove || working}
                  title={!canApprove ? `Need ${Math.max(0,5-approvedPhotoCount)} more approved photos${!hasHero?' + hero photo':''}` : ''}
                  style={{
                    height: 52, background: canApprove ? 'var(--role-metal)' : 'transparent',
                    border: 'none', borderRadius: 100,
                    cursor: canApprove && !working ? 'pointer' : 'default',
                    fontFamily: "'Jost',sans-serif", fontSize: 10, fontWeight: 400,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: canApprove ? 'var(--role-ink-on-metal)' : 'var(--atelier-ink-mute)',
                  }}
                >
                  {canApprove ? 'Approve for Discovery →' : `Approve (need ${Math.max(0,5-approvedPhotoCount)} more approved photos)`}
                </button>

                {/* Deny */}
                {!showDenyForm ? (
                  <button onClick={() => setShowDenyForm(true)} style={{
                    height: 44, background: 'transparent',
                    border: '0.5px solid transparent', borderRadius: 100, cursor: 'pointer',
                    fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300,
                    letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--atelier-ink-mute)',
                  }}>Deny Profile</button>
                ) : (
                  <div style={{ background: 'var(--atelier-row-hover)', border: '1px solid transparent', borderRadius: 12, padding: 16 }}>
                    <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--role-critical)', margin: '0 0 8px' }}>DENIAL REASON (shown to vendor)</p>
                    <textarea
                      value={denyReason}
                      onChange={e => setDenyReason(e.target.value)}
                      maxLength={200}
                      rows={3}
                      placeholder="e.g. Portfolio quality doesn't meet our current standard. Please add more editorial photos and resubmit."
                      style={{
                        width: '100%', border: '0.5px solid var(--role-critical)', borderRadius: 8,
                        padding: '10px 12px', fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13, fontWeight: 300, color: 'var(--atelier-ink)', outline: 'none',
                        resize: 'none', background: 'var(--atelier-card-bg)',
                      }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button onClick={denyProfile} disabled={!denyReason.trim() || working} style={{
                        flex: 1, height: 40, background: denyReason.trim() ? 'transparent' : 'transparent',
                        border: 'none', borderRadius: 100,
                        cursor: denyReason.trim() ? 'pointer' : 'default',
                        fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300,
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: denyReason.trim() ? 'var(--atelier-ink)' : 'var(--atelier-ink-mute)',
                      }}>Confirm Denial</button>
                      <button onClick={() => { setShowDenyForm(false); setDenyReason(''); }} style={{
                        height: 40, padding: '0 16px', background: 'transparent',
                        border: '0.5px solid transparent', borderRadius: 100, cursor: 'pointer',
                        fontFamily: "'Jost',sans-serif", fontSize: 9, color: 'var(--atelier-ink-mute)',
                      }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo reject modal */}
      {rejectTarget && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--role-scrim)',
          zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{ background: 'var(--atelier-card-bg)', borderRadius: 16, padding: 24, maxWidth: 360, width: '100%' }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, color: 'var(--atelier-ink)', margin: '0 0 12px' }}>Reject Photo</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300, color: 'var(--atelier-ink-mute)', margin: '0 0 12px' }}>Leave a short note for the vendor (max 200 chars).</p>
            {[
              'Too dark — please upload a well-lit version',
              'Image quality too low — minimum 1080px width',
              'Does not showcase your work — use a client photo',
              'Please crop to portrait orientation',
            ].map(r => (
              <button key={r} onClick={() => setRejectNote(r)} style={{
                display: 'block', width: '100%', padding: '8px 12px', marginBottom: 6, textAlign: 'left',
                background: rejectNote === r ? 'var(--atelier-sheet-bg)' : 'var(--atelier-section-bg)',
                color: rejectNote === r ? 'var(--atelier-ink)' : 'var(--atelier-ink)',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300,
              }}>{r}</button>
            ))}
            <textarea
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              maxLength={200}
              placeholder="Or write a custom note..."
              rows={2}
              style={{
                width: '100%', border: '0.5px solid var(--atelier-card-border)', borderRadius: 8,
                padding: '8px 12px', fontFamily: "'DM Sans',sans-serif",
                fontSize: 12, fontWeight: 300, color: 'var(--atelier-ink)', outline: 'none',
                resize: 'none', marginTop: 8, marginBottom: 12,
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => rejectPhoto(rejectTarget, rejectNote)}
                disabled={!rejectNote.trim() || working}
                style={{
                  flex: 1, height: 40, background: rejectNote.trim() ? 'transparent' : 'transparent',
                  border: 'none', borderRadius: 100, cursor: rejectNote.trim() ? 'pointer' : 'default',
                  fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: rejectNote.trim() ? 'var(--atelier-ink)' : 'var(--atelier-ink-mute)',
                }}>Reject</button>
              <button onClick={() => { setRejectTarget(null); setRejectNote(''); }} style={{
                height: 40, padding: '0 16px', background: 'transparent',
                border: '0.5px solid transparent', borderRadius: 100, cursor: 'pointer',
                fontFamily: "'Jost',sans-serif", fontSize: 9, color: 'var(--atelier-ink-mute)',
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Photo card in the drawer ─────────────────────────────────────────────────
function PhotoCard({
  img, onApprove, onReject, working,
}: {
  img: VendorImage;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  working: boolean;
}) {
  return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden' }}>
      <img src={img.url} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
      {/* Status overlay */}
      <div style={{
        position: 'absolute', top: 6, left: 6,
        fontFamily: "'Jost',sans-serif", fontSize: 8, fontWeight: 300,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        padding: '2px 7px', borderRadius: 100,
        background: img.approved ? 'var(--atelier-row-hover)' : 'var(--role-scrim)',
        color: 'var(--atelier-ink)',
      }}>{img.approved ? '✓ Approved' : 'Pending'}</div>
      {/* Action buttons */}
      <div style={{ position: 'absolute', bottom: 6, right: 6, display: 'flex', gap: 4 }}>
        <button
          onClick={() => onApprove(img.id)}
          disabled={img.approved || working}
          style={{
            width: 28, height: 28, borderRadius: '50%', border: 'none',
            background: img.approved ? 'var(--atelier-row-hover)' : 'var(--atelier-row-hover)',
            color: 'var(--atelier-ink)', cursor: img.approved ? 'default' : 'pointer',
            fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✓</button>
        <button
          onClick={() => onReject(img.id)}
          disabled={working}
          style={{
            width: 28, height: 28, borderRadius: '50%', border: 'none',
            background: 'var(--role-scrim)', color: 'var(--atelier-page-bg)',
            cursor: 'pointer', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✗</button>
      </div>
      {/* Rejection reason */}
      {img.rejection_reason && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'var(--atelier-row-hover)', padding: '4px 8px',
        }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: 'var(--atelier-ink)', margin: 0 }}>{img.rejection_reason}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ApprovalsPage() {
  const [vendors, setVendors]       = useState<Vendor[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<'pending' | 'live'>('pending');
  const [selected, setSelected]     = useState<MakerDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [toast, setToast]           = useState('');
  const [search, setSearch]         = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  // ── Load all vendors with discovery flags
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/v3/admin/makers?limit=200`, { headers: adminHeaders() });
      const d = await r.json();
      if (d.success) setVendors(d.data || []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Open drawer for a vendor
  async function openDrawer(vendorId: string) {
    setLoadingDetail(true);
    try {
      const r = await fetch(`${API_BASE}/api/v3/admin/makers/${vendorId}`, { headers: adminHeaders() });
      const d = await r.json();
      if (d.success) setSelected(d.data);
    } catch { showToast('Failed to load vendor detail'); }
    setLoadingDetail(false);
  }

  // ── Callback: vendor just approved → update local list
  function handleApproved(vendorId: string) {
    setVendors(prev => prev.map(v =>
      v.id === vendorId
        ? { ...v, is_approved: true, discover_listed: true, vendor_discover_enabled: true }
        : v
    ));
  }

  // ── Callback: vendor revoked from feed
  function handleRevoked(vendorId: string) {
    setVendors(prev => prev.map(v =>
      v.id === vendorId
        ? { ...v, is_approved: false, discover_listed: false, vendor_discover_enabled: false }
        : v
    ));
  }

  // ── Callback: vendor denied
  function handleRejected(vendorId: string, reason: string) {
    setVendors(prev => prev.map(v =>
      v.id === vendorId
        ? { ...v, discover_rejected_reason: reason }
        : v
    ));
  }

  // ── Filtered lists
  const pending = vendors.filter(v =>
    v.discover_submitted_at && !v.is_approved &&
    (search ? v.name?.toLowerCase().includes(search.toLowerCase()) : true)
  );
  const live = vendors.filter(v =>
    v.is_approved && v.discover_listed && v.vendor_discover_enabled &&
    (search ? v.name?.toLowerCase().includes(search.toLowerCase()) : true)
  );
  const shown = tab === 'pending' ? pending : live;

  const th: React.CSSProperties = {
    fontFamily: "'Jost',sans-serif", fontSize: 8, fontWeight: 200,
    letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--atelier-ink-mute)',
    padding: '10px 14px', textAlign: 'left', borderBottom: '0.5px solid var(--atelier-card-border)',
  };

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>

      {toast && <Toast msg={toast} onDone={() => setToast('')} />}

      {selected && (
        <ReviewDrawer
          detail={selected}
          onClose={() => setSelected(null)}
          onApproved={handleApproved}
          onRevoked={handleRevoked}
          onRejected={handleRejected}
          showToast={showToast}
        />
      )}

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontFamily: "'Jost',sans-serif", fontWeight: 200, fontSize: 9, color: 'var(--atelier-ink-mute)', letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 4px' }}>PLATFORM</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: 32, color: 'var(--atelier-ink)', margin: 0 }}>
            Discovery Approvals
            <span style={{ fontSize: 18, color: pending.length > 0 ? 'var(--role-metal)' : 'var(--atelier-ink-mute)', marginLeft: 10 }}>
              ({pending.length} pending)
            </span>
          </p>
          <button onClick={load} style={{
            height: 36, padding: '0 16px', background: 'transparent',
            border: '0.5px solid transparent', borderRadius: 8,
            fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--atelier-ink-mute)', cursor: 'pointer',
          }}>Refresh</button>
        </div>
      </div>

      {/* Tabs + search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {(['pending', 'live'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              height: 34, padding: '0 16px', border: 'none', borderRadius: 6,
              background: tab === t ? 'var(--atelier-sheet-bg)' : 'transparent',
              color: tab === t ? 'var(--atelier-ink)' : 'var(--atelier-ink-mute)',
              fontFamily: "'Jost',sans-serif", fontSize: 9, fontWeight: 300,
              letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
            }}>
              {t === 'pending' ? `Pending (${pending.length})` : `Live (${live.length})`}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name..."
          style={{
            height: 34, padding: '0 12px', border: '0.5px solid var(--atelier-card-border)',
            borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 13,
            color: 'var(--atelier-ink)', outline: 'none', minWidth: 180,
          }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'var(--atelier-ink-mute)', margin: '40px 0', textAlign: 'center' }}>Loading...</p>
      ) : shown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 300, color: 'var(--atelier-ink-mute)', margin: '0 0 8px' }}>
            {tab === 'pending' ? 'No pending submissions' : 'No live vendors yet'}
          </p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'var(--atelier-ink-fade)' }}>
            {tab === 'pending' ? 'Vendors appear here when they hit Submit for Discovery.' : 'Approve vendors from the Pending tab.'}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Maker</th>
                <th style={th}>Tier</th>
                <th style={th}>{tab === 'pending' ? 'Submitted' : 'Approved'}</th>
                <th style={th}>Status</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {shown.map(v => (
                <VendorRow
                  key={v.id}
                  vendor={v}
                  onOpen={() => openDrawer(v.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loadingDetail && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--role-scrim)',
          zIndex: 290, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: 'var(--atelier-ink)' }}>Loading profile...</p>
        </div>
      )}
    </>
  );
}
