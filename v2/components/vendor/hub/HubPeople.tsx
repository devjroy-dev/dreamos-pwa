'use client';
// v2/components/vendor/hub/HubPeople.tsx · CE-47 · HUB-2 · THE PEOPLE TAB (approved pictures 2a and 2b, 7 Oct 2026).
// Reads GET /api/v2/vendor/hub/people. Chips: My people, a role, her city, a pay kind (one of each; tap again to clear).
// MY PEOPLE (CE-47 ruling, 7 Oct 2026): a vendor adds another vendor directly. An organisation or a person joins only
// through a credit they answered yes to. Nobody outside the vendor pool is on a list without having agreed. So "Add to
// my people" is drawn only when the server says can_add (a vendor not yet in); a person or an organisation gets the line
// that says how they join. Waiting requests are shown apart, never on the list, never in its count.
// No check label anywhere. Every handle, website and page is a link (linkProps). Actions are buttons, never underlined.
import { useEffect, useState } from 'react';
import { getJson } from '@/lib/vendor/api/_base';
import { labelFor } from '@/lib/frost/categoryLabels';
import { API } from '@/v2/lib/solutions/routes';
import {
  HUB, arr, fetchPeople, addToMyPeople, takeOffMyPeople, linkProps, siteWords,
  type HubPerson, type HubWaiting, type HubCard,
} from '@/v2/lib/vendor/hub';

const PAY: { v: string; label: string }[] = [{ v: 'paid', label: 'Paid' }, { v: 'barter', label: 'Barter' }, { v: 'credit_only', label: 'Credit only' }];
const FIRST_ROLES = 3;

export function HubPeople({ myCity }: { myCity: string | null }) {
  const [mine, setMine] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [pay, setPay] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [allRoles, setAllRoles] = useState(false);
  const [people, setPeople] = useState<HubPerson[] | null>(null);
  const [waiting, setWaiting] = useState<HubWaiting[]>([]);
  const [line, setLine] = useState('');
  const [mineLine, setMineLine] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [said, setSaid] = useState<{ id: string; text: string; bad: boolean } | null>(null);

  useEffect(() => {
    getJson<{ ok: boolean; requirement_types?: string[] }>(API.collabRequirementTypes())
      .then((d) => { if (d.ok && Array.isArray(d.requirement_types)) setRoles(d.requirement_types); })
      .catch(() => { /* the role chips stay absent; the list still loads */ });
  }, []);

  const [tick, setTick] = useState(0);
  const load = () => setTick((t) => t + 1);
  useEffect(() => {
    let live = true;
    fetchPeople({ mine, role, city, open_to: pay }).then((d) => {
      if (!live) return;
      if (!d.ok) { setPeople([]); setLine(d.error || ''); return; }
      setPeople(arr(d.people)); setWaiting(arr(d.waiting)); setLine(d.line || ''); setMineLine(d.mine_line || '');
    }).catch(() => { if (live) setPeople([]); });
    return () => { live = false; };
  }, [mine, role, city, pay, tick]);

  async function add(p: HubPerson) {
    if (busy) return; setBusy(p.id); setSaid(null);
    const r = await addToMyPeople(p.id).catch(() => ({ ok: false, error: 'Could not add. Try again.' } as { ok: boolean; error?: string; line?: string }));
    setBusy(null);
    setSaid({ id: p.id, text: r.ok ? (r.line || '') : (r.error || 'Could not add. Try again.'), bad: !r.ok });
    if (r.ok) load();
  }
  async function takeOff(p: HubPerson) {
    if (busy) return; setBusy(p.id); setSaid(null);
    const r = await takeOffMyPeople(p.id).catch(() => ({ ok: false, error: 'Could not take them off. Try again.' } as { ok: boolean; error?: string; line?: string }));
    setBusy(null);
    setSaid({ id: p.id, text: r.ok ? (r.line || '') : (r.error || 'Could not take them off. Try again.'), bad: !r.ok });
    if (r.ok) load();
  }

  const shownRoles = allRoles ? roles : roles.slice(0, FIRST_ROLES);
  const toggle = (cur: string | null, v: string, set: (x: string | null) => void) => set(cur === v ? null : v);

  return (
    <div className="hub-people" data-hub-people="">
      <style>{HUB_CSS}</style>
      {!mine && <p className="hub-note">{HUB.peopleNote}</p>}
      <div className="hub-chips" role="group" aria-label="Who to show">
        <button type="button" className={'hub-chip' + (mine ? ' on' : '')} aria-pressed={mine} data-hub-mine=""
          onClick={() => setMine((v) => !v)}>{mine && people ? HUB.myPeopleChipCount(people.length) : HUB.myPeopleChip}</button>
        {shownRoles.map((t) => (
          <button key={t} type="button" className={'hub-chip' + (role === t ? ' on' : '')} aria-pressed={role === t}
            onClick={() => toggle(role, t, setRole)}>{labelFor(t)}</button>))}
        {roles.length > FIRST_ROLES && (
          <button type="button" className="hub-chip" aria-expanded={allRoles} onClick={() => setAllRoles((v) => !v)}>
            {allRoles ? 'Fewer roles' : 'More roles'}</button>)}
      </div>
      {!mine && (
        <div className="hub-chips" role="group" aria-label="City and pay">
          {myCity && (
            <button type="button" className={'hub-chip' + (city === myCity ? ' on' : '')} aria-pressed={city === myCity}
              onClick={() => toggle(city, myCity, setCity)}>{myCity}</button>)}
          {PAY.map((k) => (
            <button key={k.v} type="button" className={'hub-chip' + (pay === k.v ? ' on' : '')} aria-pressed={pay === k.v}
              onClick={() => toggle(pay, k.v, setPay)}>{k.label}</button>))}
        </div>)}
      {mine && mineLine && <p className="hub-note" data-hub-mine-line="">{mineLine}</p>}

      {people === null ? <p className="hub-note">Loading…</p>
        : people.length === 0 && !(mine && waiting.length) ? <p className="hub-note">{mine ? HUB.emptyMine : HUB.emptyAll}</p>
        : people.map((p) => (
          <article key={p.id} className="hub-card" data-hub-card={p.kind}>
            <div className="hub-name">{p.name} <span className={'hub-pill' + (p.worked_with ? '' : ' grey')}>{p.worked_with_words}</span></div>
            <div className="hub-facts">{factLine(p, mine)}</div>
            <Links card={p} />
            <div className="hub-btns">
              <PageButton card={p} />
              {p.can_add && (
                <button type="button" className="hub-btn p" disabled={busy === p.id} data-hub-add="" onClick={() => void add(p)}>{HUB.add}</button>)}
              {!p.can_add && p.in_my_people && !mine && p.kind === 'vendor' && (
                <span className="hub-btn s state" data-hub-in="">{'✓ '}{HUB.inMine}</span>)}
              {mine && p.can_take_off && (
                <button type="button" className="hub-btn q" disabled={busy === p.id} data-hub-takeoff="" onClick={() => void takeOff(p)}>{HUB.takeOff}</button>)}
            </div>
            {p.kind !== 'vendor' && !p.in_my_people && <p className="hub-small">{HUB.notAddable}</p>}
            {said && said.id === p.id && <p className={'hub-small' + (said.bad ? ' bad' : '')} role="status">{said.text}</p>}
          </article>))}

      {mine && waiting.map((w) => (
        <article key={w.id} className="hub-card" data-hub-waiting="">
          <div className="hub-name">{w.name} <span className="hub-pill grey">{w.words}</span></div>
          <div className="hub-facts">{[roleWords(w), w.city, w.line].filter(Boolean).join(' · ')}</div>
          <Links card={w} />
        </article>))}

      {line && <p className="hub-note">{line}</p>}
    </div>
  );
}

function roleWords(c: HubCard) { const r = arr(c.roles); return r.length ? r.map((x) => labelFor(x)).join(', ') : null; }
function kindFact(c: HubCard) { return c.kind === 'vendor' ? HUB.vendorFact : c.kind === 'org' ? HUB.orgFact : HUB.personFact; }
function factLine(p: HubPerson, mine: boolean) {
  return [roleWords(p), p.city, mine && p.why_words ? p.why_words : kindFact(p)].filter(Boolean).join(' · ');
}

export function Links({ card }: { card: HubCard }) {
  const ig = card.instagram ? linkProps(card.instagram.url) : null;
  const web = card.website ? linkProps(card.website.url) : null;
  if (!ig && !web) return null;
  return (
    <div className="hub-links">
      {ig && card.instagram && <a {...ig}>{HUB.instagram(card.instagram.handle)}</a>}
      {web && card.website && <a {...web}>{siteWords(card.website.url)}</a>}
    </div>
  );
}

function PageButton({ card }: { card: HubCard }) {
  const lp = linkProps(card.page_url);
  if (!lp) return null;
  return <a {...lp} className="hub-btn s">{HUB.seePage}</a>;
}

// The app's own pieces, matched: the chosen chip is .ob-chip.on (veto 54: filled with the primary); the filled button
// is .rp-next; the quiet one is actionButton('mute') (PackageFields). Tokens and rungs only.
export const HUB_CSS = `
.hub-note{margin:8px 0;font:var(--wl-t4);color:var(--atelier-ink-dim)}
.hub-small{margin:8px 0 0;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.hub-small.bad{color:var(--role-critical)}
.hub-chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.hub-chip{min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--atelier-card-border);background:transparent;color:var(--atelier-ink);font:var(--wl-t4);cursor:pointer}
.hub-chip.on{background:var(--role-primary);border-color:var(--role-primary);color:var(--role-on-primary)}
.hub-chip:focus-visible,.hub-btn:focus-visible,.hub-links a:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.hub-card{background:var(--atelier-card-bg);border:1px solid var(--atelier-card-border);border-radius:12px;padding:16px;margin:12px 0}
.hub-name{font:var(--wl-tn);color:var(--atelier-ink)}
.hub-pill{display:inline-block;margin-left:6px;padding:1px 8px;border-radius:12px;border:1px solid var(--atelier-accent-text);color:var(--atelier-accent-text);font:var(--wl-t5);vertical-align:1px}
.hub-pill.grey{border-color:var(--atelier-card-border);color:var(--atelier-ink-dim)}
.hub-facts{font:var(--wl-t4);color:var(--atelier-ink-dim)}
.hub-links{display:flex;flex-wrap:wrap;gap:4px 16px;margin:8px 0;font:var(--wl-t4)}
.hub-links a{color:var(--atelier-accent-text);text-decoration:underline;text-underline-offset:3px;min-height:24px}
.hub-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.hub-btn{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-height:48px;padding:0 16px;border-radius:12px;font:var(--wl-tb);text-decoration:none;cursor:pointer;background:transparent}
.hub-btn.p{border:0;background:var(--role-primary);color:var(--role-on-primary)}
.hub-btn.s{border:1px solid var(--atelier-card-border);color:var(--atelier-ink)}
.hub-btn.q{border:1px solid var(--atelier-ink-mute);color:var(--atelier-ink-mute)}
.hub-btn.state{cursor:default}
.hub-btn:disabled{opacity:.6;cursor:default}
`;
