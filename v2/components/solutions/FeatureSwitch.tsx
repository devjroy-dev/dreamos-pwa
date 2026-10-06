'use client';
// CE-47 · ADS-2 · ONE SWITCH (or the list) for a vendor's Meta features: On / Off, and under it "Live" or the waiting line.
// `only` shows one feature (the Instagram room, the ads room); without it, every switchable feature (the list).
import { useEffect, useState } from 'react';
import { FEATURE_WORDS, fetchFeatures, lineFor, saveChoice, shown, type MetaFeature } from '@/v2/lib/worklist/features';

export function FeatureSwitch({ only }: { only?: string }) {
  const [list, setList] = useState<MetaFeature[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  useEffect(() => { let live = true; fetchFeatures().then((l) => { if (live) setList(l); }, () => { if (live) setList([]); }); return () => { live = false; }; }, []);
  if (!list) return null;
  const rows = shown(list, only);
  if (!rows.length) return null;
  const choose = async (key: string, choice: 'on' | 'off') => {
    const before = list;
    setList(list.map((f) => (f.key === key ? { ...f, choice } : f)));
    setBusy(key);
    try { await saveChoice(key, choice); } catch { setList(before); } finally { setBusy(null); }
  };
  return (
    <div data-feature-switches>
      {rows.map((f) => (
        <div key={f.key} className="fs-row" data-feature={f.key} data-live={f.live ? '1' : '0'} style={{ padding: '10px 0', borderBottom: '1px solid var(--line, rgba(255,255,255,0.08))' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span className="fs-name" style={{ fontWeight: 500 }}>{f.feature}</span>
            <span role="group" aria-label={f.feature} style={{ display: 'inline-flex', gap: 6 }}>
              {(['on', 'off'] as const).map((c) => (
                <button key={c} type="button" data-choice={c} aria-pressed={f.choice === c} disabled={busy === f.key}
                  onClick={() => { if (f.choice !== c) void choose(f.key, c); }}
                  style={{ minHeight: 32, minWidth: 48, borderRadius: 16, padding: '0 12px', border: '1px solid currentColor', opacity: f.choice === c ? 1 : 0.55, background: 'transparent', color: 'inherit' }}>
                  {c === 'on' ? FEATURE_WORDS.on : FEATURE_WORDS.off}
                </button>
              ))}
            </span>
          </div>
          <p className="fs-line" style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.75 }}>{lineFor(f)}</p>
        </div>
      ))}
    </div>
  );
}
