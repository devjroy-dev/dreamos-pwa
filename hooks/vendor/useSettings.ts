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
  invoice_prefix:    string;
  routing_handle:    string;
  // Read-only
  tier:              string;
  founding_cohort:   boolean;
  discover_preview:  boolean;
}

const EMPTY: SettingsState = {
  name: '', business_name: '', style_notes: '', city: '',
  open_to_travel: false, travel_notes: '', instagram_handle: '',
  upi_id: '', gstin: '', rate_min: '', rate_max: '',
  aesthetic_tags: '', briefing_enabled: true,
  invoice_prefix: '', routing_handle: '',
  tier: '', founding_cohort: false, discover_preview: false,
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
        style_notes:      '',
        city:             v.city ?? '',
        open_to_travel:   v.open_to_travel ?? false,
        travel_notes:     '',
        instagram_handle: '',
        upi_id:           v.upi_id ?? '',
        gstin:            v.gstin ?? '',
        rate_min:         v.rate_min != null ? String(v.rate_min) : '',
        rate_max:         v.rate_max != null ? String(v.rate_max) : '',
        aesthetic_tags:   (v.aesthetic_tags ?? []).join(', '),
        briefing_enabled: true,
        invoice_prefix:   '',
        routing_handle:   v.handle ?? '',
        tier:             v.tier ?? '',
        founding_cohort:  v.founding_cohort ?? false,
        discover_preview: v.discover_preview ?? false,
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
