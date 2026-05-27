'use client';
// /wedding/settings — Settings · Atelier rebuild
// All PATCH-able vendor fields. Per-section save. Hooks and logic untouched.

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useSettings } from '@/hooks/vendor/useSettings';
import { useToast } from '@/hooks/vendor/useToast';
import { Toast } from '@/components/vendor/Toast';
import { Header } from '@/components/vendor/Header';
import { updateMe, updateRoutingHandle, updateInvoicePrefix } from '@/lib/vendor/api/vendor';
import { clearVendorSession, getVendorSession, setVendorSession } from '@/lib/vendor/session';

const A = {
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: '#C9A84C', brassWarm: 'var(--atelier-label)', red: '#E07B5C',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script: 'var(--font-cormorant), Georgia, serif',
  body: 'var(--font-dm-sans), system-ui, sans-serif',
  label: 'var(--font-jost), system-ui, sans-serif',
} as const;

export default function SettingsPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/vendor/login'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <SettingsScreen vendorName={session.name ?? null} />;
}

function SettingsScreen({ vendorName }: { vendorName: string | null }) {
  const router = useRouter();
  const { current, loading, error, update, isDirty, markSaved } = useSettings();
  const { toast, show } = useToast();
  const [saving, setSaving] = useState<string | null>(null);
  const [handleSaved, setHandleSaved] = useState<string | null>(null);
  const [prefixCounter, setPrefixCounter] = useState<number | null>(null);

  async function saveMe(section: string, fields: (keyof typeof current)[], patch: Record<string, unknown>) {
    setSaving(section);
    try {
      const res = await updateMe(patch);
      if (!res.ok) { show((res as { error?: string }).error ?? 'Save failed.', 'error'); return; }
      markSaved(Object.fromEntries(fields.map(f => [f, current[f]])) as Parameters<typeof markSaved>[0]);
      // If name was saved, update the session so the Header reflects it immediately
      if (patch.name && typeof patch.name === 'string') {
        const existing = getVendorSession();
        if (existing) setVendorSession({ ...existing, name: patch.name });
      }
      show('Saved', 'success');
    } catch { show('Network error.', 'error'); }
    finally { setSaving(null); }
  }

  async function saveHandle() {
    setSaving('tdwlink');
    try {
      const h = current.routing_handle.trim().toUpperCase();
      const res = await updateRoutingHandle({ routing_handle: h });
      if (!res.ok) { show((res as { error?: string }).error ?? 'Save failed.', 'error'); return; }
      setHandleSaved(res.routing_handle);
      markSaved({ routing_handle: res.routing_handle });
      show('Handle updated', 'success');
    } catch { show('Network error.', 'error'); }
    finally { setSaving(null); }
  }

  async function savePrefix() {
    setSaving('invoiceprefix');
    try {
      const res = await updateInvoicePrefix({ prefix: current.invoice_prefix.trim() });
      if (!res.ok) { show((res as { error?: string }).error ?? 'Save failed.', 'error'); return; }
      setPrefixCounter(res.current_counter);
      markSaved({ invoice_prefix: res.prefix });
      show('Prefix updated', 'success');
    } catch { show('Network error.', 'error'); }
    finally { setSaving(null); }
  }

  function signOut() { clearVendorSession(); router.replace('/vendor/login'); }

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: A.inkMute }}>Loading…</div>
    </div>
  );
  if (error) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.red }}>{error}</div>
    </div>
  );

  const handle = handleSaved ?? current.routing_handle;
  const waLink = `https://wa.me/917982159047?text=TDW-${handle.toUpperCase()}`;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
        <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.brassWarm, fontFamily: F.display, fontSize: 22, lineHeight: 1 }}>‹</button>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>Settings</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 22px calc(40px + env(safe-area-inset-bottom))' }}>

        <SCard title="Business">
          <SField label="Your Name" value={current.name} onChange={v => update({ name: v })} placeholder="Dev Roy" />
          <SField label="Business name" value={current.business_name} onChange={v => update({ business_name: v })} />
          <SField label="City" value={current.city} onChange={v => update({ city: v })} />
          <SField label="Style notes" value={current.style_notes} onChange={v => update({ style_notes: v })} multiline />
          <SaveBtn
            dirty={isDirty(['name', 'business_name', 'city', 'style_notes'])}
            loading={saving === 'business'}
            onSave={() => saveMe('business', ['name', 'business_name', 'city', 'style_notes'], {
              name: current.name || undefined,
              business_name: current.business_name || undefined,
              city: current.city || undefined,
              style_notes: current.style_notes || undefined,
            })}
          />
        </SCard>

        <SCard title="Travel">
          <SToggle label="Open to travel" value={current.open_to_travel} onChange={v => update({ open_to_travel: v })} />
          <SField label="Travel notes" value={current.travel_notes} onChange={v => update({ travel_notes: v })} multiline />
          <SaveBtn
            dirty={isDirty(['open_to_travel', 'travel_notes'])}
            loading={saving === 'travel'}
            onSave={() => saveMe('travel', ['open_to_travel', 'travel_notes'], {
              open_to_travel: current.open_to_travel,
              travel_notes: current.travel_notes || undefined,
            })}
          />
        </SCard>

        <SCard title="Contact">
          <SField label="Instagram handle" value={current.instagram_handle} onChange={v => update({ instagram_handle: v })} placeholder="@yourhandle" />
          <SaveBtn
            dirty={isDirty(['instagram_handle'])}
            loading={saving === 'contact'}
            onSave={() => saveMe('contact', ['instagram_handle'], { instagram_handle: current.instagram_handle || undefined })}
          />
        </SCard>

        <SCard title="Payments">
          <SField label="UPI ID" value={current.upi_id} onChange={v => update({ upi_id: v })} placeholder="name@bank" />
          <SField label="GSTIN" value={current.gstin} onChange={v => update({ gstin: v })} placeholder="22AAAAA0000A1Z5" />
          <SaveBtn
            dirty={isDirty(['upi_id', 'gstin'])}
            loading={saving === 'payments'}
            onSave={() => saveMe('payments', ['upi_id', 'gstin'], {
              upi_id: current.upi_id || undefined,
              gstin: current.gstin || undefined,
            })}
          />
        </SCard>

        <SCard title="Rate Range">
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <SField label="Min (Rs)" value={current.rate_min} onChange={v => update({ rate_min: v })} inputMode="numeric" />
            </div>
            <div style={{ flex: 1 }}>
              <SField label="Max (Rs)" value={current.rate_max} onChange={v => update({ rate_max: v })} inputMode="numeric" />
            </div>
          </div>
          <SaveBtn
            dirty={isDirty(['rate_min', 'rate_max'])}
            loading={saving === 'rates'}
            onSave={() => saveMe('rates', ['rate_min', 'rate_max'], {
              rate_min: current.rate_min ? Number(current.rate_min) : undefined,
              rate_max: current.rate_max ? Number(current.rate_max) : undefined,
            })}
          />
        </SCard>

        <SCard title="Aesthetic Tags">
          <SField label="Tags (comma-separated)" value={current.aesthetic_tags} onChange={v => update({ aesthetic_tags: v })} placeholder="moody, editorial, film" />
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute, marginTop: 4 }}>Used in Discover recommendations.</div>
          <SaveBtn
            dirty={isDirty(['aesthetic_tags'])}
            loading={saving === 'tags'}
            onSave={() => saveMe('tags', ['aesthetic_tags'], {
              aesthetic_tags: current.aesthetic_tags.split(',').map(t => t.trim()).filter(Boolean),
            })}
          />
        </SCard>

        <SCard title="TDW Enquiry Link">
          <SField label="Handle" value={current.routing_handle} onChange={v => update({ routing_handle: v.toUpperCase().replace(/[^A-Z0-9]/g, '') })} placeholder="YOURHANDLE" />
          {handle && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 12, color: A.inkMute, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{waLink}</div>
              <button type="button" onClick={() => navigator.clipboard.writeText(waLink).then(() => show('Link copied', 'success'))}
                style={{
                  background: 'transparent', border: '0.5px solid var(--atelier-sheet-border)', borderRadius: 2,
                  padding: '5px 10px', cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.brassWarm,
                  letterSpacing: '0.28em', textTransform: 'uppercase', flexShrink: 0,
                }}>Copy</button>
            </div>
          )}
          <SaveBtn dirty={isDirty(['routing_handle'])} loading={saving === 'tdwlink'} onSave={saveHandle} />
        </SCard>

        <SCard title="Invoice Settings">
          <SField label="Invoice prefix" value={current.invoice_prefix} onChange={v => update({ invoice_prefix: v })} placeholder="TDW/DEV550" />
          {prefixCounter != null && (
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 12, color: A.inkMute, marginTop: 4 }}>
              Next invoice: {current.invoice_prefix}/{String(prefixCounter + 1).padStart(2, '0')}
            </div>
          )}
          <SaveBtn
            dirty={isDirty(['invoice_prefix']) && !!current.invoice_prefix.trim()}
            loading={saving === 'invoiceprefix'}
            onSave={savePrefix}
          />
        </SCard>

        <SCard title="Morning Briefing">
          <SToggle label="Enable WhatsApp briefing" value={current.briefing_enabled} onChange={v => update({ briefing_enabled: v })} />
          <SaveBtn
            dirty={isDirty(['briefing_enabled'])}
            loading={saving === 'briefing'}
            onSave={() => saveMe('briefing', ['briefing_enabled'], { briefing_enabled: current.briefing_enabled })}
          />
        </SCard>

        <SCard title="Account">
          <SReadRow label="Tier" value={current.tier.charAt(0).toUpperCase() + current.tier.slice(1)} />
          {current.founding_cohort && <SReadRow label="Status" value="Founding cohort" />}
        </SCard>

        <button type="button" onClick={signOut} style={{
          width: '100%', padding: '14px 0', marginTop: 24,
          background: 'transparent', border: '0.5px solid rgba(224,123,92,0.4)', borderRadius: 2,
          cursor: 'pointer',
          fontFamily: F.label, fontWeight: 300, fontSize: 10, color: A.red,
          letterSpacing: '0.42em', textTransform: 'uppercase',
        }}>Sign Out</button>
      </div>
    </div>
  );
}

// ── Sub-components · Atelier ────────────────────────────────────

function SCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass }}>{title}</span>
        <span style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.22)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function SField({ label, value, onChange, multiline, placeholder, inputMode }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  const base: React.CSSProperties = {
    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
    background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-card-border)', borderRadius: 2,
    fontFamily: F.body, fontWeight: 300, fontSize: 14, color: A.ink, outline: 'none',
    caretColor: A.brass, resize: 'none' as const, colorScheme: 'dark',
  };
  return (
    <div>
      <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={2} style={base} placeholder={placeholder} />
        : <input value={value} onChange={e => onChange(e.target.value)} style={base} placeholder={placeholder} inputMode={inputMode} />
      }
    </div>
  );
}

function SToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: F.script, fontWeight: 400, fontSize: 15, color: A.ink, letterSpacing: '0.005em' }}>{label}</span>
      <button type="button" onClick={() => onChange(!value)} style={{
        width: 44, height: 24, borderRadius: 999, border: '0.5px solid var(--atelier-input-border)',
        cursor: 'pointer', flexShrink: 0,
        background: value ? 'linear-gradient(180deg, #D4B86A 0%, #B59548 100%)' : 'var(--atelier-input-bg)',
        position: 'relative', transition: 'background 200ms',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: value ? 22 : 2, width: 18, height: 18, borderRadius: '50%',
          background: value ? 'var(--atelier-ink)' : 'var(--atelier-ink-mute)',
          transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}

function SReadRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
      <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontFamily: F.script, fontWeight: 500, fontSize: 14, color: A.ink, letterSpacing: '0.005em' }}>{value}</span>
    </div>
  );
}

function SaveBtn({ dirty, loading, onSave }: { dirty: boolean; loading: boolean; onSave: () => void }) {
  if (!dirty && !loading) return null;
  return (
    <button type="button" onClick={onSave} disabled={loading || !dirty} className={dirty && !loading ? 'atelier-fab' : undefined} style={{
      alignSelf: 'flex-end', padding: '8px 16px', borderRadius: 2,
      border: '0.5px solid #E0BC6E',
      cursor: loading || !dirty ? 'default' : 'pointer',
      fontFamily: F.label, fontWeight: 400, fontSize: 9, color: '#1A120E',
      letterSpacing: '0.36em', textTransform: 'uppercase',
      background: !dirty || loading ? 'rgba(201,168,76,0.18)' : undefined,
      opacity: loading || !dirty ? 0.6 : 1,
    }}>{loading ? 'Saving…' : 'Save'}</button>
  );
}
