'use client';
// components/worklist/TodayHome.tsx — DESIGN-1 · STAGE 2 · HOME IS THE DAY'S WORK.
//
// docs/review/REPORT.md §3, "What a vendor sees first", in its order and nothing else:
//   1. Check a date: a box, always at the top, answering Free, Booked or Enquiry in words.
//   2. Reply to: the new enquiries, each with its last message and how long it has waited.
//   3. Today: each function with its time, place and crew, and a This week link.
//   4. Money due: one line.
// Every read is an existing door (the worklist feed, leads, lead detail, the day, the bands, events, invoices);
// nothing here writes. The rows are the one row (name, one line of facts, one thing on the right, 64 high).
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useTodayFeed } from '@/lib/worklist/feed';
import { roomHref } from '@/lib/worklist/rooms';
import { HOME, shortDate, longDate, dayHeading, agoWords, sentence, OPEN_ENQUIRY } from '@/lib/worklist/home';
import { useCrew, crewWords, CREW_WORDS, type CrewFunction } from '@/lib/worklist/crew';
import { fetchDay, fetchLeadsWhole, fetchLeadDetail, fetchEvents, fetchInvoices } from '@/lib/vendor/api/vendor';
import type { LeadsResponse, VendorDayResponse, VendorEvent, InvoicesResponse } from '@/lib/vendor/types/vendor';
import { istTodayISO, istPlusDaysISO } from '@/lib/vendor/istDay';
import { formatRs } from '@/lib/vendor/format';
import { COPY } from '@/lib/worklist/copy';

type LeadRow = LeadsResponse['leads'][number];
type Answer = { kind: 'free' | 'booked' | 'enquiry'; lines: string[]; hot: boolean };

/** The day's answer in words. Booked when anything occupies it (a function or a block); Enquiry when an open
 *  enquiry asked for it and nothing occupies it; Free otherwise. Who asked is said either way. */
export function answerFor(date: string, day: VendorDayResponse, leads: readonly LeadRow[]): Answer {
  const live = (day.events ?? []).filter((e) => e.state !== 'cancelled');
  const asked = leads.filter((l) => OPEN_ENQUIRY.has((l.state || '').toLowerCase()) && (l.wedding_date || '').slice(0, 10) === date);
  const names = asked.map((l) => l.name || 'A couple');
  const lines: string[] = [];
  for (const e of live) lines.push([e.event_time ? e.event_time.slice(0, 5) : '', e.title, e.binder_name || ''].filter(Boolean).join(' · '));
  const blocks = day.blocks ?? [];
  for (const b of blocks) lines.push(HOME.blocked(b.reason));
  if (live.length || blocks.length) {
    if (names.length) lines.push(HOME.alsoAsked(names.join(', ')));
    return { kind: 'booked', lines, hot: !!day.hot };
  }
  if (names.length) return { kind: 'enquiry', lines: names.map(HOME.askedBy), hot: !!day.hot };
  return { kind: 'free', lines: [], hot: !!day.hot };
}

function CheckDate({ vendorId, leads, today }: { vendorId: string; leads: readonly LeadRow[] | null; today: string }) {
  const [date, setDate] = useState(today);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const [res, setRes] = useState<{ date: string; answer: Answer } | null>(null);
  async function check() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    setBusy(true); setErr(false);
    try {
      const day = await fetchDay(vendorId, date);
      if (!day || !('events' in day)) { setErr(true); setRes(null); }
      else setRes({ date, answer: answerFor(date, day, leads ?? []) });
    } catch { setErr(true); setRes(null); }
    setBusy(false);
  }
  const head = res ? (res.answer.kind === 'free' ? HOME.answerFree : res.answer.kind === 'booked' ? HOME.answerBooked : HOME.answerEnquiry) : '';
  return (
    <section className="wl-home-sec" aria-labelledby="wl-home-check">
      <h2 id="wl-home-check" className="wl-home-h">{HOME.checkHead}</h2>
      <form className="wl-home-check" onSubmit={(e) => { e.preventDefault(); void check(); }}>
        <label className="wl-home-lab" htmlFor="wl-home-date">{HOME.checkLabel}</label>
        <input id="wl-home-date" className="wl-home-date" type="date" value={date}
               onChange={(e) => { setDate(e.target.value); setRes(null); }} />
        <button type="submit" className="wl-btn pri wl-home-go" disabled={busy}>{busy ? HOME.checkBusy : HOME.checkButton}</button>
      </form>
      {err && <p className="wl-home-err" role="alert">{HOME.checkFailed}</p>}
      {res && (
        <div className={'wl-home-answer ' + res.answer.kind} role="status" aria-live="polite">
          <div className="wl-home-word">{head}</div>
          <div className="wl-home-when">{longDate(res.date)}</div>
          {res.answer.lines.map((l, i) => <div key={i} className="wl-home-line">{l}</div>)}
          {res.answer.hot && <div className="wl-home-line">{HOME.goodDate}</div>}
          <Link className="wl-home-link" href={`${roomHref('calendar')}?day=${res.date}`}>{HOME.openCalendar}</Link>
        </div>
      )}
    </section>
  );
}

function place(ev: VendorEvent | undefined, leadCity: Map<string, string>): string {
  const note = (ev?.notes || '').split('\n')[0].trim();
  if (note) return note;
  const city = ev?.lead_id ? leadCity.get(ev.lead_id) : undefined;
  return city || HOME.placeUnset;
}

function FunctionRow({ f, ev, leadCity }: { f: CrewFunction; ev: VendorEvent | undefined; leadCity: Map<string, string> }) {
  const crew = crewWords(f.crew);
  return (
    <Link className="wl-home-row" href={`${roomHref('events')}?event=${encodeURIComponent(f.event_id)}`}>
      <span className="wl-home-main">
        <span className="wl-home-name">{f.title}</span>
        <span className="wl-home-facts">
          {[sentence(f.kind), place(ev, leadCity)].filter(Boolean).join(' · ')}
          {' · '}
          {crew ? <span>{crew}</span> : <span className="wl-home-nocrew">{CREW_WORDS.none}</span>}
        </span>
      </span>
      <span className="wl-home-right">{f.event_time ? f.event_time.slice(0, 5) : ''}</span>
    </Link>
  );
}

export function TodayHome() {
  const { session } = useVendorSession();
  const vendorId = session?.id ?? null;
  const feed = useTodayFeed();
  const today = feed.today?.today || istTodayISO();
  const weekEnd = istPlusDaysISO(7);
  const crew = useCrew(vendorId, today, weekEnd);
  const [leads, setLeads] = useState<LeadRow[] | null>(null);
  const [events, setEvents] = useState<VendorEvent[]>([]);
  const [money, setMoney] = useState<InvoicesResponse | null>(null);
  const [last, setLast] = useState<Record<string, { body: string; at: string } | null>>({});
  const [week, setWeek] = useState(false);

  useEffect(() => {
    if (!vendorId) return;
    let live = true;
    fetchLeadsWhole(vendorId, 'all').then((r) => { if (live && r && r.ok && Array.isArray(r.leads)) setLeads(r.leads); }).catch(() => {});
    fetchEvents(vendorId, 'upcoming', today, weekEnd).then((r) => { if (live && r && r.ok && Array.isArray(r.events)) setEvents(r.events); }).catch(() => {});
    fetchInvoices(vendorId, 'all').then((r) => { if (live && r && r.ok && Array.isArray(r.invoices)) setMoney(r); }).catch(() => {});
    return () => { live = false; };
  }, [vendorId, today, weekEnd]);

  // The wire's own order (D-4's ranking), re-sorted by nothing; a capped list says so with the register's tell.
  const unanswered = useMemo(() => feed.today?.needs_attention?.lead_unanswered ?? [], [feed.today]);
  const capped = feed.today?.truncated?.lead_unanswered === true;
  // The last message of each new enquiry: the conversation's last line, else the enquiry's own first words.
  useEffect(() => {
    let live = true;
    for (const l of unanswered) {
      if (l.id in last) continue;
      fetchLeadDetail(l.id).then((r) => {
        if (!live) return;
        const conv = r && 'conversation' in r && Array.isArray(r.conversation) ? r.conversation : [];
        const m = conv.length ? conv[conv.length - 1] : null;
        setLast((p) => ({ ...p, [l.id]: m ? { body: m.body, at: m.created_at } : null }));
      }).catch(() => { if (live) setLast((p) => ({ ...p, [l.id]: null })); });
    }
    return () => { live = false; };
  }, [unanswered, last]);

  const leadById = useMemo(() => new Map((leads ?? []).map((l) => [l.id, l])), [leads]);
  const leadCity = useMemo(() => new Map((leads ?? []).filter((l) => l.wedding_city).map((l) => [l.id, l.wedding_city as string])), [leads]);
  const eventById = useMemo(() => new Map(events.map((e) => [e.id, e])), [events]);
  const todays = crew.functions.filter((f) => f.date === today);
  const later = crew.functions.filter((f) => f.date > today && f.date <= weekEnd);
  const byDay = useMemo(() => {
    const m = new Map<string, CrewFunction[]>();
    for (const f of later) m.set(f.date, [...(m.get(f.date) ?? []), f]);
    return [...m.entries()];
  }, [later]);

  const owedRows = (money?.invoices ?? []).filter((i) => (i.amount_owed ?? 0) > 0);
  const owedClients = new Set(owedRows.map((i) => i.client_name || i.id)).size;
  // The earliest due date, found by walking (Home re-orders nothing it draws; b40 C61).
  const nextDue = owedRows.reduce<string | null>((m, i) => (i.due_date && (!m || i.due_date < m) ? i.due_date : m), null);
  const owed = money?.summary?.total_outstanding ?? owedRows.reduce((a, i) => a + (i.amount_owed ?? 0), 0);

  if (!vendorId) return null;
  return (
    <div className="wl-home">
      <style>{HOME_CSS}</style>
      <CheckDate vendorId={vendorId} leads={leads} today={today} />

      <section className="wl-home-sec" aria-labelledby="wl-home-reply">
        <h2 id="wl-home-reply" className="wl-home-h">{HOME.replyHead}{unanswered.length ? <span className="wl-home-count">{unanswered.length}{capped ? COPY.todayTruncatedSuffix : ''}</span> : null}</h2>
        {feed.responded && unanswered.length === 0 && <p className="wl-home-empty">{HOME.replyNone}</p>}

        {unanswered.map((l) => {
          const m = last[l.id];
          const words = m?.body || leadById.get(l.id)?.raw_message || HOME.replyNoMessage;
          return (
            <Link key={l.id} className="wl-home-row" href={`${roomHref('leads')}?lead=${encodeURIComponent(l.id)}`}>
              <span className="wl-home-main">
                <span className="wl-home-name">{l.name || HOME.answerEnquiry}</span>
                <span className="wl-home-facts wl-home-msg">{words}</span>
              </span>
              <span className="wl-home-right wl-home-ago">{agoWords(m?.at || l.created_at)}</span>
            </Link>
          );
        })}
        {capped && <Link className="wl-home-link" href={roomHref('leads')}>{HOME.replyAll}</Link>}
      </section>

      <section className="wl-home-sec" aria-labelledby="wl-home-today">
        <div className="wl-home-hrow">
          <h2 id="wl-home-today" className="wl-home-h">{HOME.todayHead}</h2>
          <button type="button" className="wl-home-week" aria-expanded={week} onClick={() => setWeek((w) => !w)}>
            {week ? HOME.weekHide : HOME.weekButton}
          </button>
        </div>
        {crew.loaded && todays.length === 0 && <p className="wl-home-empty">{HOME.todayNone}</p>}
        {todays.map((f) => <FunctionRow key={f.event_id} f={f} ev={eventById.get(f.event_id)} leadCity={leadCity} />)}
        {week && (
          <div className="wl-home-weeklist">
            {crew.loaded && byDay.length === 0 && <p className="wl-home-empty">{HOME.weekNone}</p>}
            {byDay.map(([d, fs]) => (
              <div key={d}>
                <h3 className="wl-home-day">{dayHeading(d)}</h3>
                {fs.map((f) => <FunctionRow key={f.event_id} f={f} ev={eventById.get(f.event_id)} leadCity={leadCity} />)}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="wl-home-sec" aria-labelledby="wl-home-money">
        <h2 id="wl-home-money" className="wl-home-h">{HOME.moneyHead}</h2>
        {money && (owed > 0 ? (
          <Link className="wl-home-row wl-home-moneyrow" href={roomHref('invoices')}>
            <span className="wl-home-main"><span className="wl-home-name">{HOME.moneyLine(formatRs(owed), owedClients, nextDue ? shortDate(nextDue) : null)}</span></span>
          </Link>
        ) : <p className="wl-home-empty">{HOME.moneyNone}</p>)}
      </section>
    </div>
  );
}

// NO BACKTICKS INSIDE THIS LITERAL (the estate's standing warning). Rungs and tokens only; spacing on the scale.
const HOME_CSS = `
.wl-home{padding-top:8px;padding-bottom:32px}
.wl-home-sec{padding-top:24px}
.wl-home-hrow{display:flex;align-items:center;justify-content:space-between;gap:12px}
.wl-home-h{font:var(--wl-t2);color:var(--atelier-ink);margin:0 0 8px;display:flex;align-items:center;gap:8px}
.wl-home-hrow .wl-home-h{margin:0}
.wl-home-count{font:var(--wl-t5);color:var(--role-on-primary);background:var(--role-primary);border-radius:999px;padding:0 8px;min-width:24px;text-align:center}
/* DESIGN-1 stage 3: Home’s one figure site (b40 C66); after the shorthand, which resets the figure style. */
.wl-home-count{font-variant-numeric:lining-nums tabular-nums}
.wl-home-check{display:grid;grid-template-columns:1fr auto;gap:8px 12px;align-items:end;background:var(--atelier-card-bg);border:1px solid var(--atelier-card-border);border-radius:12px;padding:16px}
.wl-home-lab{grid-column:1/-1;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.wl-home-date{min-width:0;min-height:48px;padding:0 12px;border-radius:12px;border:1px solid var(--atelier-input-border);background:var(--atelier-input-bg);color:var(--atelier-ink);font:var(--wl-t3);color-scheme:inherit}
.wl[data-wl-mode="dark"] .wl-home-date{color-scheme:dark}
.wl[data-wl-mode="light"] .wl-home-date{color-scheme:light}
.wl-home-go{flex:none;padding:0 24px}
.wl-home-err{font:var(--wl-t4);color:var(--role-critical);margin:8px 0 0}
.wl-home-answer{margin-top:12px;border-radius:12px;padding:16px;border:1px solid var(--atelier-card-border);background:var(--atelier-card-bg);display:flex;flex-direction:column;gap:4px}
.wl-home-answer.free{border-color:var(--role-positive)}
.wl-home-answer.booked{border-color:var(--role-critical)}
.wl-home-answer.enquiry{border-color:var(--role-caution)}
.wl-home-word{font:var(--wl-t1)}
.wl-home-answer.free .wl-home-word{color:var(--role-positive)}
.wl-home-answer.booked .wl-home-word{color:var(--role-critical)}
.wl-home-answer.enquiry .wl-home-word{color:var(--role-caution)}
.wl-home-when{font:var(--wl-t4);color:var(--atelier-ink-mute);margin-bottom:4px}
.wl-home-line{font:var(--wl-t3);color:var(--atelier-ink)}
.wl-home-link{align-self:flex-start;display:inline-flex;align-items:center;margin-top:8px;font:var(--wl-tb);color:var(--atelier-accent-text);text-decoration:none}
.wl-home-row{display:flex;align-items:center;gap:12px;min-height:64px;padding:12px 16px;margin-bottom:8px;background:var(--atelier-card-bg);border:1px solid var(--atelier-card-border);border-radius:12px;text-decoration:none;color:inherit}
.wl-home-row:active{background:var(--atelier-row-hover)}
.wl-home-row:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.wl-home-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.wl-home-name{font:var(--wl-tn);color:var(--atelier-ink);overflow-wrap:anywhere}
.wl-home-facts{font:var(--wl-t4);color:var(--atelier-ink-mute);overflow-wrap:anywhere}
.wl-home-msg{color:var(--atelier-ink-soft)}
.wl-home-nocrew{color:var(--role-critical)}
.wl-home-right{flex:none;font:var(--wl-t4);color:var(--atelier-ink);text-align:right}
.wl-home-ago{color:var(--atelier-ink-mute)}
.wl-home-week{flex:none;background:none;border:none;padding:0 4px;font:var(--wl-tb);color:var(--atelier-accent-text);cursor:pointer}
.wl-home-weeklist{margin-top:8px}
.wl-home-day{font:var(--wl-t5);color:var(--atelier-ink-mute);margin:12px 0 8px}
.wl-home-empty{font:var(--wl-t3);color:var(--atelier-ink-mute);margin:0}
`;
