'use client';
// components/vendor/CollabPostForm.tsx
// CE-42 · SEAT R7 · 4c-1 — THE ONE COMPOSER, TWO ROOMS (ruling 4(b)).
//
// ── WHAT THIS REPLACES ─────────────────────────────────────────────────────────
// `PostCollabForm`, a local of app/vendor/(shell)/collab/screen.tsx. The Collab
// room's `+ Post` and the shoot board's `Post a shoot` (Referrals & partners) now
// open THIS form; `kind` is the only difference between them.
//
// ── WHAT THE VETO RULED (frames C1-sheet / S2-sheet, docs/mocks/shoot-board-mock.html)
//   · F-42.184 — the requirement pills are the ELEVEN, read off
//     GET /api/v2/vendor/collab/requirement-types and labelled by the founder-signed
//     map (lib/frost/categoryLabels.ts). The sixteen typed here before, ten of which
//     the server refused with a 400, are gone. A label map is not a taxonomy.
//   · CHANGED LOOK — the shell's standing sheet (StudioSheets `Sheet` + SHEET_CSS) at
//     the six-rung scale. F-42.186's brass literals do not survive the move.
//   · Labels, fields and order BYTE-KEPT, including the three my frame omitted
//     (the first-look line, the `{i} of {n}` counter with its × control, the details
//     placeholder) — departure 3, ruled.
//   · REMOVED-BY-RULING: the eyebrow `New Requirement`; and, for kind=collab, the
//     shoot pair from the event types (under 2(a)+3(ii) they would post into the
//     other room). kind=shoot offers ONLY the pair, as `Shoot type`, one always on.
//   · NEW CONTROL: a note per requirement — `collab_post_items.note` (0096), never
//     exposed before. It is how a shoot names its model ("Content Creator · Model").
//   · Event-type labels: sentence case from collabFormat.fmtType (departures 1 & 2).
//
// ⚠ F-42.190, FILED, NOT CURED HERE: the first-look line says 12 hours; the window
// is admin_config `collab.first_look_hours`, and no collab door returns it.
import { useEffect, useState } from 'react';
import { getJson, postJson } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { Sheet, SHEET_CSS } from '@/components/worklist/StudioSheets';
import { labelFor } from '@/lib/frost/categoryLabels';
import { CITIES, matchCity } from '@/lib/vendor/cityMatch';
import { fmtType, EVENT_TYPES, PAYMENT_PERIODS } from '@/lib/vendor/collabFormat';
import { SHOOTS } from '@/lib/worklist/shoots';

export type CollabKind = 'collab' | 'shoot';
export interface CollabPrefill { date?: string; city?: string; type?: string }

interface Types { requirement_types: string[]; shoot_event_types: string[] }
interface Item { requirement_type: string; note: string }

const MAX_ITEMS = 8;

export function CollabPostForm({ kind, prefill, onClose, onSuccess }: {
  kind: CollabKind;
  prefill?: CollabPrefill;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [types, setTypes] = useState<Types | null>(null);
  const [items, setItems] = useState<Item[]>([{ requirement_type: prefill?.type || '', note: '' }]);
  const [form, setForm] = useState({
    event_date: prefill?.date || '', city: matchCity(prefill?.city || ''),
    budget_inr: '', payment_period: 'per_shoot',
    event_type: '', details: '', open_to_other_cities: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getJson<{ ok: boolean } & Types>(API.collabRequirementTypes())
      .then(d => {
        if (!d.ok) { setError('Something went wrong. Try again.'); return; }
        setTypes({ requirement_types: d.requirement_types, shoot_event_types: d.shoot_event_types });
        // A prefilled type the server does not list is dropped, never posted into a 400.
        setItems(prev => prev.map((it, n) => (n === 0 && it.requirement_type && !d.requirement_types.includes(it.requirement_type)) ? { ...it, requirement_type: '' } : it));
        // kind=shoot: one shoot type is always on, so the post can never be a collab by omission.
        if (kind === 'shoot') setForm(f => ({ ...f, event_type: f.event_type || d.shoot_event_types[0] || '' }));
      })
      .catch(() => setError('Something went wrong. Try again.'));
  }, [kind]);

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) { setForm(f => ({ ...f, [key]: value })); }
  function setItem(i: number, patch: Partial<Item>) { setItems(prev => prev.map((it, n) => (n === i ? { ...it, ...patch } : it))); }
  function addItem() { setItems(prev => (prev.length >= MAX_ITEMS ? prev : [...prev, { requirement_type: '', note: '' }])); }
  function removeItem(i: number) { setItems(prev => (prev.length <= 1 ? prev : prev.filter((_, n) => n !== i))); }

  const shootTypes = types?.shoot_event_types ?? [];
  const eventChoices = kind === 'shoot' ? shootTypes : EVENT_TYPES.filter(t => !shootTypes.includes(t));

  async function handleSubmit() {
    const chosen = items.filter(i => i.requirement_type);
    if (chosen.length === 0 || !form.event_date || !form.city) {
      setError('Please fill in what you need, the date, and the city.'); return;
    }
    if (new Date(form.event_date) < new Date(new Date().toDateString())) {
      setError('This date has passed. Collab posts need a future date.'); return;
    }
    if (!form.city.trim()) { setError('Add a city to your profile before posting.'); return; }
    setSubmitting(true); setError('');
    try {
      const payload: Record<string, unknown> = {
        items: chosen.map(i => ({ requirement_type: i.requirement_type, note: i.note.trim() || undefined })),
        event_date:           form.event_date,
        city:                 form.city,
        open_to_other_cities: form.open_to_other_cities,
        payment_period:       form.payment_period || undefined,
        event_type:           form.event_type     || undefined,
        details:              form.details        || undefined,
      };
      if (form.budget_inr) payload.budget_inr = parseInt(form.budget_inr);
      const data = await postJson<{ ok: boolean; error?: string; message?: string }>(API.collabCreate(), payload);
      if (data.ok) onSuccess();
      // F-04.110's second half: the refusal sentence travels in `error`, not `message`.
      else setError(data.message || data.error || 'Something went wrong. Try again.');
    } catch { setError('Something went wrong. Try again.'); }
    finally { setSubmitting(false); }
  }

  return (
    <>
      <style>{SHEET_CSS + FORM_CSS}</style>
      <Sheet title={kind === 'shoot' ? SHOOTS.postAction : 'Post a requirement'} onClose={onClose}>
        {kind === 'shoot' && (
          <div className="wl-fld">
            <span className="wl-fl">{SHOOTS.shootType}</span>
            <div className="cp-chips">
              {shootTypes.map(t => (
                <button key={t} type="button" className={'cp-chip' + (form.event_type === t ? ' on' : '')}
                  aria-pressed={form.event_type === t} onClick={() => set('event_type', t)}>{fmtType(t)}</button>
              ))}
            </div>
          </div>
        )}

        <div className="wl-fld">
          <span className="wl-fl">What you need</span>
          {items.map((item, i) => (
            <div key={i} className="cp-item">
              {items.length > 1 && (
                <div className="cp-count">
                  <span>{i + 1} of {items.length}</span>
                  <button type="button" className="cp-x" aria-label={`${i + 1} of ${items.length}`} onClick={() => removeItem(i)}>{'\u00D7'}</button>
                </div>
              )}
              {item.requirement_type ? (
                <div className="cp-row">
                  {/* Tapping the chosen craft reopens the eleven — the pill it replaced was a toggle. */}
                  <button type="button" className="cp-rlabel" onClick={() => setItem(i, { requirement_type: '' })}>{labelFor(item.requirement_type)}</button>
                  <input className="wl-fi cp-note" value={item.note} maxLength={200} aria-label={labelFor(item.requirement_type)}
                    onChange={e => setItem(i, { note: e.target.value.slice(0, 200) })} />
                </div>
              ) : (
                <div className="cp-chips">
                  {(types?.requirement_types ?? []).map(t => (
                    <button key={t} type="button" className="cp-chip" onClick={() => setItem(i, { requirement_type: t })}>{labelFor(t)}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {items.length < MAX_ITEMS && (
            <button type="button" className="cp-add" onClick={addItem}>Add another</button>
          )}
        </div>

        {/* First look — stated before the post exists, not discovered afterwards. */}
        <p className="wl-shnote">Your roster sees this first. Open to everyone in 12 hours.</p>

        <div className="cp-two">
          <label className="wl-fld">
            <span className="wl-fl">Date needed</span>
            <input className="wl-fi" type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} />
          </label>
          <label className="wl-fld">
            <span className="wl-fl">City</span>
            <select className="wl-fi" value={form.city} onChange={e => set('city', e.target.value)}>
              <option value="">Select city</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <label className="cp-tick">
          <input type="checkbox" checked={form.open_to_other_cities} onChange={e => set('open_to_other_cities', e.target.checked)} />
          <span>Also open to vendors who travel</span>
        </label>

        <div className="wl-fld">
          <span className="wl-fl">Budget offered (optional)</span>
          <div className="wl-brow">
            <input className="wl-fi wl-fnum cp-budget" type="number" placeholder="Rs" value={form.budget_inr} onChange={e => set('budget_inr', e.target.value)} />
            <select className="wl-fi cp-period" value={form.payment_period} onChange={e => set('payment_period', e.target.value)}>
              {PAYMENT_PERIODS.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        {kind === 'collab' && (
          <div className="wl-fld">
            <span className="wl-fl">Event type (optional)</span>
            <div className="cp-chips">
              {eventChoices.map(t => (
                <button key={t} type="button" className={'cp-chip' + (form.event_type === t ? ' on' : '')}
                  aria-pressed={form.event_type === t} onClick={() => set('event_type', form.event_type === t ? '' : t)}>{fmtType(t)}</button>
              ))}
            </div>
          </div>
        )}

        <label className="wl-fld">
          <span className="wl-fl">Details (optional {'\u00B7'} {200 - form.details.length} left)</span>
          <textarea className="wl-fi cp-area" rows={3} value={form.details}
            placeholder={'Describe what you\u2019re looking for\u2026'}
            onChange={e => set('details', e.target.value.slice(0, 200))} />
        </label>

        {error && <p className="wl-shnote wl-shbad">{error}</p>}
        <div className="wl-brow">
          <button type="button" className="wl-btn pri" disabled={submitting || !types} onClick={handleSubmit}>{submitting ? 'Posting\u2026' : 'Post'}</button>
        </div>
      </Sheet>
    </>
  );
}

// Tokens only — every colour a var() the shell's scope already declares (R-42.6);
// every size a rung (R-38.4). No literal, no new rung.
const FORM_CSS = `
.cp-chips{display:flex;flex-wrap:wrap;gap:6px}
.cp-chip{font:var(--wl-t5);color:var(--atelier-ink-soft);background:transparent;border:.5px solid var(--atelier-card-border);
         border-radius:3px;padding:9px 10px;min-height:36px;cursor:pointer}
.cp-chip.on{color:var(--atelier-accent-text);border-color:var(--atelier-input-border)}
.cp-chip:focus-visible,.cp-add:focus-visible,.cp-x:focus-visible,.cp-rlabel:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.cp-item{margin-bottom:8px}
.cp-count{display:flex;justify-content:space-between;align-items:center;font:var(--wl-t5);color:var(--atelier-ink-mute);margin-bottom:6px}
.cp-x{width:44px;height:32px;background:transparent;border:none;cursor:pointer;font:var(--wl-t2);line-height:1;color:var(--atelier-ink-mute)}
.cp-row{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center}
.cp-rlabel{font:var(--wl-t3);color:var(--atelier-ink);background:transparent;border:none;padding:0;cursor:pointer;text-align:left}
.cp-note{padding:8px 10px}
.cp-add{align-self:flex-start;font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-accent-text);
        background:transparent;border:none;padding:6px 0;cursor:pointer}
.cp-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.cp-tick{display:flex;align-items:center;gap:8px;font:var(--wl-t3);color:var(--atelier-ink-soft);cursor:pointer}
.cp-tick input{width:16px;height:16px;accent-color:var(--atelier-accent-text)}
.cp-budget{flex:2}.cp-period{flex:1}
.cp-area{resize:none}
`;
