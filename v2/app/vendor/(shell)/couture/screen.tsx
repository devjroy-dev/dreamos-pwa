'use client';
// v2/app/vendor/(shell)/couture/screen.tsx · CE-47 · FE-6 L3 · THE COUTURE ROOM, REWORKED.
// The founder's verdict on FE-6's mock (CE-46, 30 Sept 2026; W3, W10) and the sprint's standing rules: the add is the
// room head's pill ("+ New slot"); one switch for Open slots and Appointments; slots and appointments as rows (a full
// date with its day, then time, minutes and fee; one pill); a tap on an open slot opens a small sheet whose one action,
// Remove, is last and asks first; the add sheet shows the date in words under its native field; the locked state is one
// plain line and one button to Billing. Every time through the 12-hour clock ("4:00 pm"). Doors unchanged:
// fetchMe (couture_eligible), fetchCoutureSlots, fetchCoutureAppointments, addCoutureSlot, removeCoutureSlot.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { roomHref } from '@/v2/lib/worklist/rooms';
import { Toast } from '@/v2/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchMe, fetchCoutureSlots, addCoutureSlot, removeCoutureSlot, fetchCoutureAppointments } from '@/v2/lib/vendor/api/vendor';
import type { CoutureSlot, CoutureAppointment } from '@/lib/vendor/types/vendor';
import { CO } from '@/v2/lib/worklist/couture';
import { clockAt, clockWords, dayDateWords } from '@/v2/lib/worklist/home';   // FE-5's clock words; the weekday date beside them (FE-8)
import { RoomHeadAdd } from '@/v2/components/worklist/PageHelp';   // FE-5's pill, in the room head (FE-8)

const rs = (n: number) => 'Rs\u00a0' + Number(n).toLocaleString('en-IN');
const TONE: Record<string, string> = { open: 'new', booked: 'done', blocked: 'off' };

export function CoutureScreen({ vendorId }: { vendorId: string }) {
  void vendorId;
  const router = useRouter();
  const { toast, show } = useToast();
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [tab, setTab] = useState<'open' | 'appointments'>('open');
  const [slots, setSlots] = useState<CoutureSlot[]>([]);
  const [appointments, setAppointments] = useState<CoutureAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [day, setDay] = useState('');
  const [at, setAt] = useState('');
  const [fee, setFee] = useState('');
  const [saving, setSaving] = useState(false);
  const [picked, setPicked] = useState<CoutureSlot | null>(null);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    fetchMe().then((res) => { if (res.ok) setEligible((res.vendor as unknown as { couture_eligible?: boolean }).couture_eligible ?? false); }).catch(() => setEligible(false));
  }, []);
  useEffect(() => {
    if (!eligible) return;
    Promise.all([fetchCoutureSlots('all'), fetchCoutureAppointments('all')])
      .then(([sRes, aRes]) => { if (sRes.ok) setSlots(sRes.slots); if (aRes.ok) setAppointments(aRes.appointments); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [eligible]);

  async function doAdd() {
    if (!day || !at || !fee || saving) return;
    setSaving(true);
    const res = await addCoutureSlot({ slot_at: `${day}T${at}`, fee_inr: Number(fee) });
    if (!res.ok) show((res as { error?: string }).error ?? CO.failed, 'error');
    else { show(CO.added, 'success'); setAddOpen(false); setDay(''); setAt(''); setFee(''); setSlots((prev) => [res.slot, ...prev]); }
    setSaving(false);
  }
  async function doRemove(id: string) {
    setSaving(true);
    const res = await removeCoutureSlot(id);
    setSaving(false);
    if (!res.ok) { show((res as { error?: string }).error ?? CO.failed, 'error'); return; }
    show(CO.removed, 'success'); setSlots((prev) => prev.filter((s) => s.id !== id)); setPicked(null); setAsking(false);
  }

  if (eligible === false) {
    return (
      <div className="cou-room" data-couture="locked">
        <p className="cou-line">{CO.lockedLine}</p>
        <button type="button" className="cou-btn cou-pri" onClick={() => router.push(roomHref('billing'))}>{CO.lockedButton}</button>
        <style>{CSS}</style>
      </div>
    );
  }
  if (eligible === null || loading) return <div className="cou-room" aria-busy="true"><style>{CSS}</style></div>;

  const open = slots.filter((s) => s.state === 'open');
  const shown = tab === 'open' ? slots : [];
  // the date typed into the native field, said in words under it (the sprint's rule)
  const typed = day ? dayDateWords(`${day}T${at || '12:00'}:00+05:30`) : '';

  return (
    <div className="cou-room" data-couture="room">
      <RoomHeadAdd addKey="couture" label={CO.add} onAdd={() => setAddOpen(true)} />
      <p className="cou-big" data-couture-line="">{tab === 'open' ? CO.openCount(open.length) : CO.apptCount(appointments.length)}</p>
      <div className="cou-seg" role="group">
        <button type="button" aria-pressed={tab === 'open'} className={tab === 'open' ? 'on' : ''} onClick={() => setTab('open')}>{CO.tabs.open}</button>
        <button type="button" aria-pressed={tab === 'appointments'} className={tab === 'appointments' ? 'on' : ''} onClick={() => setTab('appointments')}>{CO.tabs.appointments}</button>
      </div>

      {tab === 'open' ? (
        shown.length === 0 ? <p className="cou-line">{CO.noSlots}</p> : (
          <div className="cou-list">{shown.map((s) => {
            const live = s.state === 'open';
            const inner = (<>
              <span className="cou-rt"><span className="cou-n">{dayDateWords(s.slot_at)}</span>
                <span className="cou-f">{clockAt(Date.parse(s.slot_at))} {'\u00b7'} {CO.minutes(s.duration_minutes)} {'\u00b7'} {rs(s.fee_inr)}</span></span>
              <span className={'cou-pill ' + (TONE[s.state] ?? 'off')} data-pill="">{CO.state[s.state] ?? s.state}</span>
              {live ? <span className="cou-chev" aria-hidden="true">{'\u203a'}</span> : null}
            </>);
            return live
              ? <button type="button" key={s.id} className="cou-row" data-slot={s.id} onClick={() => { setPicked(s); setAsking(false); }}>{inner}</button>
              : <div key={s.id} className="cou-row" data-slot={s.id} data-dead="">{inner}</div>;
          })}</div>
        )
      ) : (
        appointments.length === 0 ? <p className="cou-line">{CO.noAppointments}</p> : (
          <div className="cou-list">{appointments.map((a) => (
            <div key={a.id} className="cou-row" data-appt={a.id} data-dead="">
              <span className="cou-rt"><span className="cou-n">{dayDateWords(a.appointment_at)}</span>
                <span className="cou-f">{clockAt(Date.parse(a.appointment_at))} {'\u00b7'} {CO.minutes(a.duration_minutes)} {'\u00b7'} {rs(a.fee_inr)}</span></span>
              <span className={'cou-pill ' + (TONE[a.state] ?? 'off')} data-pill="">{CO.state[a.state] ?? a.state}</span>
            </div>
          ))}</div>
        )
      )}

      {addOpen && (
        <div className="cou-over" role="dialog" aria-modal="true" aria-label={CO.addTitle} onClick={() => !saving && setAddOpen(false)} data-couture-sheet="add">
          <div className="cou-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="cou-sh"><h2>{CO.addTitle}</h2><button type="button" className="cou-x" aria-label="Close" onClick={() => setAddOpen(false)}>{'\u00d7'}</button></div>
            <label className="cou-lbl" htmlFor="cou-day">{CO.date}</label>
            <input id="cou-day" className="cou-in" type="date" value={day} onChange={(e) => setDay(e.target.value)} />
            {typed ? <p className="cou-words" data-date-words="">{typed}</p> : null}
            <label className="cou-lbl" htmlFor="cou-at">{CO.time}</label>
            <input id="cou-at" className="cou-in" type="time" value={at} onChange={(e) => setAt(e.target.value)} />
            {at ? <p className="cou-words" data-time-words="">{clockWords(at)}</p> : null}
            <label className="cou-lbl" htmlFor="cou-fee">{CO.fee}</label>
            <input id="cou-fee" className="cou-in" type="number" inputMode="numeric" min={0} value={fee} onChange={(e) => setFee(e.target.value)} placeholder="Rs" />
            <button type="button" className="cou-btn cou-pri" disabled={saving || !day || !at || !fee} onClick={() => void doAdd()}>{CO.addButton}</button>
          </div>
        </div>
      )}

      {picked && (
        <div className="cou-over" role="dialog" aria-modal="true" aria-label={dayDateWords(picked.slot_at)} onClick={() => !saving && setPicked(null)} data-couture-sheet="slot">
          <div className="cou-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="cou-sh"><h2>{dayDateWords(picked.slot_at)}</h2><button type="button" className="cou-x" aria-label="Close" onClick={() => setPicked(null)}>{'\u00d7'}</button></div>
            <p className="cou-line">{clockAt(Date.parse(picked.slot_at))} {'\u00b7'} {CO.minutes(picked.duration_minutes)} {'\u00b7'} {rs(picked.fee_inr)}</p>
            {asking ? (
              <>
                <p className="cou-q">{CO.removeAsk}</p>
                <div className="cou-two">
                  <button type="button" className="cou-btn" disabled={saving} onClick={() => setAsking(false)}>{CO.keep}</button>
                  <button type="button" className="cou-btn cou-warn" disabled={saving} onClick={() => void doRemove(picked.id)}>{CO.removeYes}</button>
                </div>
              </>
            ) : (
              <button type="button" className="cou-btn cou-warn" onClick={() => setAsking(true)}>{CO.remove}</button>
            )}
          </div>
        </div>
      )}
      <Toast toast={toast} />
      <style>{CSS}</style>
    </div>
  );
}

const CSS = `
.cou-room{padding:8px 0 32px;display:flex;flex-direction:column}
.cou-big{margin:0 0 12px;font:var(--wl-t2);color:var(--atelier-ink)}
.cou-line{margin:0 0 16px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.cou-q{margin:0 0 12px;font:var(--wl-t3);color:var(--atelier-ink)}
.cou-seg{display:flex;border:1px solid var(--atelier-card-border);border-radius:12px;overflow:hidden;margin:0 0 12px}
.cou-seg button{flex:1;min-height:44px;border:0;background:transparent;color:var(--atelier-ink-mute);font:var(--wl-tb);cursor:pointer}
.cou-seg button.on{background:var(--atelier-card-bg);color:var(--atelier-ink);box-shadow:inset 0 -2px 0 var(--atelier-accent-text)}
.cou-list{border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);overflow:hidden}
.cou-row{display:flex;align-items:center;gap:12px;width:100%;min-height:64px;padding:10px 16px;box-sizing:border-box;background:transparent;border:0;text-align:left;color:inherit;font:inherit}
button.cou-row{cursor:pointer;touch-action:manipulation}
.cou-row + .cou-row{border-top:1px solid var(--atelier-card-border)}
.cou-rt{flex:1;min-width:0;display:flex;flex-direction:column}
.cou-n{font:var(--wl-tb);color:var(--atelier-ink)}
.cou-f{font:var(--wl-t4);color:var(--atelier-ink-mute);margin-top:2px}
.cou-pill{font:var(--wl-t5);padding:4px 10px;border-radius:999px;border:1px solid currentColor;white-space:nowrap;color:var(--atelier-ink-mute)}
.cou-pill.new{color:var(--atelier-accent-text)}.cou-pill.done{color:var(--role-positive)}
.cou-chev{color:var(--atelier-ink-mute);font:var(--wl-t2)}
.cou-over{position:fixed;inset:0;z-index:60;background:var(--role-scrim);display:flex;align-items:flex-end}
.cou-sheet{width:100%;box-sizing:border-box;max-height:85vh;overflow-y:auto;background:var(--atelier-card-bg);border-top-left-radius:16px;border-top-right-radius:16px;padding:16px 16px calc(24px + env(safe-area-inset-bottom))}
.cou-sh{display:flex;justify-content:space-between;align-items:center;margin:0 0 12px}
.cou-sh h2{margin:0;font:var(--wl-t2);color:var(--atelier-ink)}
.cou-x{min-width:44px;min-height:44px;border:0;background:transparent;color:var(--atelier-ink-mute);font:var(--wl-t2);cursor:pointer}
.cou-lbl{display:block;font:var(--wl-t4);color:var(--atelier-ink-mute);margin:0 0 6px}
.cou-in{width:100%;box-sizing:border-box;min-height:48px;padding:0 14px;border-radius:12px;border:1px solid var(--atelier-input-border);background:var(--atelier-input-bg);color:var(--atelier-ink);font:var(--wl-tb);margin:0 0 6px}
.cou-words{margin:0 0 12px;font:var(--wl-t4);color:var(--atelier-ink-soft)}
.cou-btn{width:100%;min-height:48px;border-radius:12px;font:var(--wl-tb);border:1px solid var(--atelier-card-border);background:transparent;color:var(--atelier-accent-text);cursor:pointer;margin-top:8px}
.cou-pri{background:var(--role-primary);color:var(--role-on-primary);border:0}
.cou-warn{color:var(--role-critical);border-color:var(--role-critical)}
.cou-two{display:flex;gap:8px}.cou-two > .cou-btn{flex:1}
`;
