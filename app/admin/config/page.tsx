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
  // ── TDW_10 · F-10.100 + F-10.87 — TWO GROUPS RETIRE INTO ONE HONEST ONE ───────────
  // WHAT STOOD HERE: a 「 Vendor WhatsApp 」 group of eight dials with ZERO readers, and a
  // 「 Vendor PWA 」 group of eight that were read but were named for one lane while
  // governing an allowance both lanes spent. The screen's own header promises 「 changes
  // take effect immediately 」. For eight of those sixteen dials that promise was false,
  // and its founder-witnessed victim was the founder.
  //
  // F-10.87 was first graded as a wiring gap — the WA keys needed a reader. It is
  // resolved instead by RETIREMENT, on this estate's own precedent: the Appearance
  // swatches were removed WHOLE rather than wired, because a switch on a pinned reader
  // lies (CE-209). A dial nobody reads is that switch. The reader these keys were waiting
  // for turned out not to exist, because there was never a second allowance to govern:
  // src/engine/src/core/loop.ts writes one usage row per turn with no lane column, so one
  // counter has always served both doors.
  //
  // ONE GROUP, ONE FAMILY, `vendor_ai_*`, seeded by db/migrations/0116 from the live
  // `vendor_pwa_*` values so nothing the founder tuned moves on deploy. The old rows are
  // LEFT IN THE DATABASE deliberately — deleting config is destructive and reversible only
  // from a backup, 0115's call and its reason — but they are no longer OFFERED here,
  // which is the honest state: the value is still readable if he wants it, and no longer
  // pretends to be a control.
  //
  // (Mechanism named in-comment per F-06.85: these key strings and the interpolation at
  // src/api/vendor-engine/chat.js::buildMeta are ONE fact with two homes. A sitting that
  // renames either must re-read the other, or the dial silently stops reaching the reader
  // — which is precisely the disease above, arriving a second time.)
  { label: 'Vendor AI — app chat and WhatsApp share one allowance',
    keys: ['vendor_ai_daily_basic','vendor_ai_daily_essential','vendor_ai_daily_signature','vendor_ai_daily_prestige',
           'vendor_ai_monthly_basic','vendor_ai_monthly_essential','vendor_ai_monthly_signature','vendor_ai_monthly_prestige'] },
  // ⚠ THESE TWO GROUPS HAVE ZERO READERS AND ARE LEFT STANDING ON PURPOSE.
  // Both `couple_wa_*` and `couple_pwa_*` were grepped by the same two independent methods
  // that convicted `vendor_wa_*` (literal, and an interpolation sweep across all of src/):
  // no reader, either family. The couple lane has no meter at all — src/api/couple/chat.js
  // reads no cap, counts no turns, and refuses nobody — so these dials govern nothing and
  // the header above promises they take effect immediately. They are the same lying control
  // this delivery just retired one lane over.
  //
  // THEY ARE NOT RETIRED HERE BECAUSE THE RULING DID NOT NAME THEM. The founder's word
  // covered the vendor lane; widening it to the couple lane would be an executor deciding
  // what a ruling meant to say. It is with him, and it retires by his word or gains a
  // reader by a later sitting's — but it does not get quietly extended by this one.
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
