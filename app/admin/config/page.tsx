'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GoldBtn, Toast } from '../_components/AdminUI';
import { getConfig, patchConfig, type ConfigRow } from '../../../lib/admin-api/index';

type Group = {
  label: string;
  keys: string[];
  /** TDW_07 P1 — per-key display names. The token-cap groups derive theirs from the
   *  key's own shape (keyLabel below); the Discover ranking keys do not have that
   *  shape, so they carry their names explicitly rather than being force-parsed into
   *  a tier/period pair that means nothing for them. */
  labels?: Record<string, { tier: string; period: string }>;
  /** Optional non-integer input step. The caps are whole numbers; weights are not. */
  step?: string;
  note?: string;
};

const GROUPS: Group[] = [
  { label: 'Vendor WhatsApp',
    keys: ['vendor_wa_daily_trial','vendor_wa_daily_essential','vendor_wa_daily_signature','vendor_wa_daily_prestige',
           'vendor_wa_monthly_trial','vendor_wa_monthly_essential','vendor_wa_monthly_signature','vendor_wa_monthly_prestige'] },
  { label: 'Vendor PWA',
    keys: ['vendor_pwa_daily_trial','vendor_pwa_daily_essential','vendor_pwa_daily_signature','vendor_pwa_daily_prestige',
           'vendor_pwa_monthly_trial','vendor_pwa_monthly_essential','vendor_pwa_monthly_signature','vendor_pwa_monthly_prestige'] },
  { label: 'Couple WhatsApp',
    keys: ['couple_wa_daily_basic','couple_wa_daily_gold','couple_wa_daily_platinum',
           'couple_wa_monthly_basic','couple_wa_monthly_gold','couple_wa_monthly_platinum'] },
  { label: 'Couple PWA',
    keys: ['couple_pwa_daily_basic','couple_pwa_daily_gold','couple_pwa_daily_platinum',
           'couple_pwa_monthly_basic','couple_pwa_monthly_gold','couple_pwa_monthly_platinum'] },
  // ── TDW_07 P1 · D-5's "hand-tunable" weights ──────────────────────────────────
  // The three keys are seeded by db/migrations/0101_profile_controls.sql. They MUST
  // exist as rows before this group can do anything: the PATCH route 404s on a key
  // with no row (src/api/admin/config.js:31-32) and there is no insert route — so an
  // unseeded key shows blank here and refuses to save. That is the honest failure, not
  // a bug: run 0101 first.
  { label: 'Discover ranking',
    step: '0.05',
    note: 'Feed order = w_spotlight·spotlight + w_freshness·recency + w_completeness·profile. Weights need not sum to 1 — only their ratio decides the order. Takes effect on the next fetch (60s cache).',
    keys: ['discover.rank.w_spotlight','discover.rank.w_freshness','discover.rank.w_completeness'],
    labels: {
      'discover.rank.w_spotlight':    { tier: 'Spotlight',    period: 'active editorial card' },
      'discover.rank.w_freshness':    { tier: 'Freshness',    period: 'vendor activity recency' },
      'discover.rank.w_completeness': { tier: 'Completeness', period: 'profile fill' },
    } },
];

function keyLabel(key: string): { tier: string; period: string } {
  const parts = key.split('_');
  const tier   = parts[parts.length - 1];
  const period = key.includes('daily') ? 'Daily' : 'Monthly';
  return { tier: tier.charAt(0).toUpperCase() + tier.slice(1), period };
}

export default function ConfigPage() {
  const [rows, setRows]       = useState<ConfigRow[]>([]);
  const [edits, setEdits]     = useState<Record<string, string>>({});
  const [saving, setSaving]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState('');
  const [toastErr, setToastErr] = useState(false);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true);
    getConfig().then(d => { setRows(d.rows); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const getValue = (key: string) => edits[key] ?? rows.find(r => r.key === key)?.value ?? '';
  const isDirty  = (key: string) => edits[key] !== undefined && edits[key] !== rows.find(r => r.key === key)?.value;

  const save = async (key: string) => {
    const val = edits[key];
    if (!val) return;
    setSaving(key);
    try {
      await patchConfig(key, val);
      setRows(prev => prev.map(r => r.key === key ? { ...r, value: val } : r));
      setEdits(prev => { const n = { ...prev }; delete n[key]; return n; });
      showToast('Saved.');
    } catch { showToast('Failed.', true); }
    finally { setSaving(null); }
  };

  return (
    <div>
      <PageHeader title="AI Caps" sub="Daily and monthly message limits per tier — changes take effect immediately" />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
          {[1,2,3].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 180 }} />)}
        </div>
      ) : (
        GROUPS.map(group => (
          <div key={group.label} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: '20px', marginBottom: 16 }}>
            <p style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, color: T.gold, letterSpacing: '0.3em', textTransform: 'uppercase' as const, marginBottom: 16 }}>{group.label}</p>
            {group.note && (
              <p style={{ fontFamily: T.ff.body, fontSize: 11, color: T.muted, lineHeight: 1.5, marginTop: -8, marginBottom: 16 }}>{group.note}</p>
            )}
            {group.keys.map(key => {
              const { tier, period } = group.labels?.[key] ?? keyLabel(key);
              const val  = getValue(key);
              const dirty = isDirty(key);
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14, marginBottom: 14, borderBottom: `0.5px solid ${T.border}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.ink, marginBottom: 2 }}>{tier} <span style={{ color: T.soft, fontSize: 11 }}>· {period}</span></div>
                    <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted, letterSpacing: '0.08em' }}>{key}</div>
                  </div>
                  <input
                    type="number"
                    step={group.step ?? '1'}
                    value={val}
                    onChange={e => setEdits(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{ width: 70, background: 'rgba(255,255,255,0.06)', border: `0.5px solid ${dirty ? T.gold : T.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: T.ff.body, fontSize: 15, color: dirty ? T.gold : T.ink, textAlign: 'center', outline: 'none', minHeight: 44 }}
                  />
                  <button
                    onClick={() => save(key)}
                    disabled={!dirty || saving === key}
                    style={{ background: dirty ? T.gold : 'transparent', border: `0.5px solid ${dirty ? T.gold : T.border}`, borderRadius: 8, padding: '8px 14px', fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: dirty ? '#0A0908' : T.muted, minHeight: 44, minWidth: 52, cursor: dirty ? 'pointer' : 'default', transition: 'all 0.2s' }}
                  >
                    {saving === key ? '…' : 'Save'}
                  </button>
                </div>
              );
            })}
          </div>
        ))
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
