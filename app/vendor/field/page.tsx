'use client';
// app/vendor/field/page.tsx
// Dedicated field/category step in vendor signup. Shown after OTP verify, BEFORE
// PIN setup (OTP -> field -> PIN -> /vendor), so the category is written before the
// first /vendor call that births the engine agent. This is what lets the agent be
// born knowing its craft: resolvePreset() has the category in hand at agent-birth,
// so profession_preset lands correctly and the soul is bound to a real field.
//
// Mandatory: a vendor cannot proceed without choosing. Constrained to the six
// categories that map to an authored Codex/preset; the value POSTed is the exact
// preset-map key.
//
// Guard: needs a vendor session (id). No session -> '/'. On success (or if the
// category was already set) -> '/vendor/pin'.

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '../../../lib/api';

const SESSION_COOKIE = 'tdw_vendor_session';
const GOLD = '#C9A84C';

function readVendorSession(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem('vendor_web_session') || localStorage.getItem('vendor_session');
    if (raw) return JSON.parse(raw);
  } catch { /* fall through */ }
  try {
    const m = document.cookie.split('; ').find(r => r.startsWith(SESSION_COOKIE + '='));
    if (m) return JSON.parse(decodeURIComponent(m.split('=').slice(1).join('=')));
  } catch { /* ignore */ }
  return {};
}

function writeVendorSession(session: Record<string, unknown>): void {
  try {
    localStorage.setItem('vendor_web_session', JSON.stringify(session));
    localStorage.setItem('vendor_session',     JSON.stringify(session));
  } catch { /* iOS storage blocked — cookie covers it */ }
  try {
    document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(JSON.stringify(session))}; max-age=${7 * 24 * 60 * 60}; path=/; SameSite=Lax; Secure`;
  } catch { /* ignore */ }
}

// Label shown -> value stored. The value MUST be a categoryPreset.js key, so the
// engine resolves it to the right profession_preset / Codex.
const FIELDS: { label: string; value: string }[] = [
  { label: 'Makeup Artist',           value: 'makeup' },
  { label: 'Photographer',            value: 'photography' },
  { label: 'Event & Wedding Planner', value: 'planning' },
  { label: 'Bridal Fashion / Designer', value: 'designer' },
  { label: 'Venue & Décor',           value: 'venue & decor' },
  { label: 'Jeweller',                value: 'jewellery' },
];

export default function VendorFieldPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState('');

  useEffect(() => {
    try {
      const s = readVendorSession();
      if (!s?.id) { router.replace('/'); return; }
    } catch { router.replace('/'); return; }
  }, [router]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const choose = useCallback(async (value: string) => {
    if (loading) return;
    setSelected(value);
    setLoading(true);
    try {
      const session = readVendorSession();
      const r = await fetch(API_BASE + '/api/v2/vendor/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ category: value }),
      });
      const d = await r.json();
      // Success, OR category was already set (locked) — either way the field is
      // recorded, so continue to PIN setup.
      if (d.ok || d.code === 'CATEGORY_LOCKED' || r.status === 409) {
        const updated = { ...session, category: value };
        writeVendorSession(updated);
        router.replace('/vendor/pin');
        return;
      }
      setSelected(null);
      showToast(d.error || 'Could not save. Try again.');
    } catch {
      setSelected(null);
      showToast('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }, [loading, router]);

  return (
    <div style={{
      minHeight: '100dvh', background: '#0C0A09', color: '#F8F7F5',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '32px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{
          fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
          color: 'rgba(248,247,245,0.45)', textAlign: 'center', marginBottom: 12,
        }}>
          Your craft
        </div>
        <h1 style={{
          fontSize: 24, fontWeight: 500, textAlign: 'center', margin: '0 0 8px',
          fontFamily: 'Georgia, serif',
        }}>
          What do you do?
        </h1>
        <p style={{
          fontSize: 14, lineHeight: 1.5, textAlign: 'center',
          color: 'rgba(248,247,245,0.55)', margin: '0 0 28px',
        }}>
          So we set up your studio for the right field from the start.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FIELDS.map(f => {
            const active = selected === f.value;
            return (
              <button
                key={f.value}
                onClick={() => choose(f.value)}
                disabled={loading}
                style={{
                  width: '100%', textAlign: 'left', cursor: loading ? 'default' : 'pointer',
                  padding: '16px 18px', borderRadius: 14,
                  border: `1px solid ${active ? GOLD : 'rgba(255,255,255,0.10)'}`,
                  background: active ? GOLD : 'rgba(255,255,255,0.04)',
                  color: active ? '#0C0A09' : 'rgba(248,247,245,0.85)',
                  fontSize: 16, fontWeight: 500,
                  transition: 'background 140ms ease, border-color 140ms ease, color 140ms ease',
                  opacity: loading && !active ? 0.5 : 1,
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(20,18,16,0.95)', color: '#F8F7F5',
          padding: '12px 18px', borderRadius: 12, fontSize: 14,
          border: '1px solid rgba(255,255,255,0.10)', maxWidth: 'calc(100% - 48px)',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
