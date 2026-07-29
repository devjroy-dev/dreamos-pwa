'use client';
// hooks/useSettings.ts
// Profile state + per-section dirty tracking for the settings page.

import { useCallback, useEffect, useState } from 'react';
import { fetchMe } from '@/lib/vendor/api/vendor';

export interface SettingsState {
  name:              string;  // vendor's personal name — separate from business name
  business_name:     string;
  style_notes:       string;
  city:              string;
  open_to_travel:    boolean;
  travel_notes:      string;
  instagram_handle:  string;
  upi_id:            string;
  gstin:             string;
  rate_min:          string;
  rate_max:          string;
  aesthetic_tags:    string;  // comma-separated
  briefing_enabled:  boolean;
  // TDW_07 P2 — Discover Profile's three. `about` is F-07.8's cure (scored and
  // feed-rendered with zero writers until this sitting); the two booleans are 0101's.
  about:             string;
  rate_display:      boolean;
  discover_paused:   boolean;
  invoice_prefix:    string;
  routing_handle:    string;
  // TDW_04 B6-S1 (surfaces item 2): '' = NULL = category default; the number as a
  // string otherwise ('0' is a lawful posture, Q-SP-1 — never coerced away).
  slot_capacity:     string;
  // Read-only
  tier:              string;
  founding_cohort:   boolean;
  discover_preview:  boolean;
  // Read-only, computed backend-side from occupancy's one-home map (B6-S1):
  capacity_default:    number | null;
  capacity_applicable: boolean;
}

const EMPTY: SettingsState = {
  name: '', business_name: '', style_notes: '', city: '',
  open_to_travel: false, travel_notes: '', instagram_handle: '',
  upi_id: '', gstin: '', rate_min: '', rate_max: '',
  aesthetic_tags: '', briefing_enabled: true,
  about: '', rate_display: true, discover_paused: false,
  invoice_prefix: '', routing_handle: '',
  slot_capacity: '',
  tier: '', founding_cohort: false, discover_preview: false,
  capacity_default: null, capacity_applicable: false,
};

export function useSettings() {
  const [saved,   setSaved]   = useState<SettingsState>(EMPTY);
  const [current, setCurrent] = useState<SettingsState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchMe().then(res => {
      if (!active) return;
      if (!res.ok) { setError('Could not load settings.'); setLoading(false); return; }
      const v = res.vendor;
      const s: SettingsState = {
        name:             v.name ?? '',
        business_name:    v.business_name ?? '',
        // ── F-07.9 CURED (TDW_07 P2) ─────────────────────────────────────────
        // These five read '' / true regardless of what the vendor had stored. The
        // defect was WITNESSED live on the test account: the settings screen showed
        // its routing HANDLE populated two cards below an Instagram field rendering
        // its placeholder, while the column held 'Makeupbyswatiroy' — and GET /me
        // returned it. The fetch worked, the render worked, and the value was
        // dropped here. briefing_enabled was worse than a blank: hardcoded `true`
        // mis-rendered every opted-out vendor AND, because isDirty compares against
        // that same constant, made re-enabling impossible from this screen at all.
        // GET /me now carries all five (src/api/vendor/me.js), so all five arrive.
        style_notes:      v.style_notes ?? '',
        city:             v.city ?? '',
        open_to_travel:   v.open_to_travel ?? false,
        travel_notes:     v.travel_notes ?? '',
        instagram_handle: v.instagram_handle ?? '',
        upi_id:           v.upi_id ?? '',
        gstin:            v.gstin ?? '',
        rate_min:         v.rate_min != null ? String(v.rate_min) : '',
        rate_max:         v.rate_max != null ? String(v.rate_max) : '',
        aesthetic_tags:   (v.aesthetic_tags ?? []).join(', '),
        slot_capacity:    v.slot_capacity != null ? String(v.slot_capacity) : '',
        briefing_enabled: v.briefing_enabled ?? true,
        about:            v.about ?? '',
        // Both NOT NULL with defaults server-side, so `?? default` is exact.
        rate_display:     v.rate_display ?? true,
        discover_paused:  v.discover_paused ?? false,
        invoice_prefix:   v.invoice_prefix ?? '',
        routing_handle:   v.handle ?? '',
        tier:             v.tier ?? '',
        founding_cohort:  v.founding_cohort ?? false,
        discover_preview: v.discover_preview ?? false,
        capacity_default:    v.capacity_default ?? null,
        capacity_applicable: v.capacity_applicable ?? false,
      };
      setSaved(s);
      setCurrent(s);
      setLoading(false);
    }).catch(() => { if (active) { setError('Network error.'); setLoading(false); } });
    return () => { active = false; };
  }, []);

  const update = useCallback((patch: Partial<SettingsState>) => {
    setCurrent(prev => ({ ...prev, ...patch }));
  }, []);

  function isDirty(section: (keyof SettingsState)[]): boolean {
    return section.some(k => current[k] !== saved[k]);
  }

  function markSaved(patch: Partial<SettingsState>) {
    setSaved(prev => ({ ...prev, ...patch }));
    setCurrent(prev => ({ ...prev, ...patch }));
  }

  return { current, saved, loading, error, update, isDirty, markSaved };
}
