"use client";
// app/vendor/(shell)/wedding-pages/page.tsx
// BLOCK 19 · G1.1 — THE WEDDING PAGES ROOM.
//
// ═══════════════════════════════════════════════════════════════════════════
// IT IS A ROOM REACHED FROM A HUB, NOT A TILE
// ═══════════════════════════════════════════════════════════════════════════
// R-G11.12: the address lives in `lib/solutions/routes.ts` on the not-a-room
// precedent, `ROOM_COUNT_EXPECTED` stays 19, and the tile grid gains nothing.
// The vendor arrives from Business Solutions' first row.
//
// ── THE IDIOM IS THE LEADS CARD, AND NOT BY PREFERENCE ─────────────────────
// The ratified `W2-room` frame draws the same two-line card, the same whole-row
// target, the same section headers with a count. NOTHING ON THIS ROOM IS MONEY,
// so no `.wl-rfig` appears anywhere — the money register has no business here
// and a figure class borrowed from a money surface would drag one in.
//
// ── EVERY BYTE IS RATIFIED, NONE IS AUTHORED HERE ──────────────────────────
// Strings come from `lib/worklist/weddingPages.ts`, transcribed from the mock's
// W2/W3 frames. This file writes no user-facing text of its own; a word typed
// into a component is a word the founder's pass never saw.
//
// ── THE PUBLISH CONTROL IS ABSENT, NEVER GREYED (s-G11.2) ──────────────────
// The mock sitting's own correction: a refusal drawn as a control that looks
// tappable is worse than no control. On a draft whose couple has not consented,
// `Publish this page` DOES NOT RENDER and the waiting line stands alone.

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { getJson, postJson, deleteJson } from '@/lib/vendor/api/_base';
// ⚠ THE EVENTS READ GOES THROUGH THE ESTATE'S TYPED HELPER, NOT A HAND-WRITTEN
// PATH. `lib/vendor/api/vendor.ts:3` states the rule in its own header: screen
// components import from here, never raw fetch. e-8 in this sitting is what
// ignoring it costs — a hand-written `/api/v2/vendor/events` 404'd on the
// founder's walk, because the door is `GET /events/:vendorId` and always has
// been. The helper knew that; my path did not.
import { fetchEvents } from '@/lib/vendor/api/vendor';
// F-40.68 / R-G11c.11 — the estate's ONE IST day home. Imported rather than
// re-derived: `new Date().toISOString().slice(0,10)` is the UTC day and is
// wrong from midnight to 05:30 IST, which is the class this file exists on the
// right side of (see istDay.ts's own header).
import { istPlusDaysISO } from '@/lib/vendor/istDay';
import { API } from '@/lib/solutions/routes';
import { WP, ROLE_OPTIONS } from '@/lib/worklist/weddingPages';

// F-40.68 / R-G11c.11 · THE PICKER'S PAST FLOOR, one home, one reader.
// A constant rather than a literal at the call site because a bare `2000-01-01`
// inside an argument list is a number the next reader has to reverse-engineer,
// and this one carries a ruling. See the call site for why it is not computed.
const WP_PICKER_FROM = '2000-01-01';

type Wedding = {
  id: string; slug: string; title: string; venue: string | null; city: string | null;
  delivered_at: string | null; couple_consent: boolean; visibility: string;
  // Projected by `WEDDING_COLS` since G1.1c and never declared here — the room
  // had no use for it until the consent ask needed to know whether this page's
  // couple is on TDW. Read from the door, never inferred.
  couple_id: string | null;
};
type Credit = {
  id: string; role: string; name: string | null; phone: string | null;
  status: string; claim_url: string;
};
type EventRow = { id: string; title: string; event_date: string; state: string };
type Photo = { id: string; url: string; position: number };

export default function WeddingPagesPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <WeddingPagesScreen session={session} />;
}

function WeddingPagesScreen({ session }: { session: { id: string } }) {
  const [rows, setRows] = useState<Wedding[] | null>(null);
  const [sheet, setSheet] = useState<'none' | 'create' | 'credits'>('none');
  const [active, setActive] = useState<Wedding | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await getJson<{ ok: boolean; weddings: Wedding[] }>(API.weddings());
      setRows(r.weddings || []);
    } catch { setRows([]); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  // Published and draft are two sections, as the frame draws them. A page with
  // `visibility='published'` but no consent is still PUBLISHED here — it is the
  // vendor's own act, and the room tells her separately what it is waiting on.
  // Hiding it under Draft would make her publish twice.
  const published = (rows ?? []).filter((w) => w.visibility === 'published');
  const drafts    = (rows ?? []).filter((w) => w.visibility !== 'published');

  return (
    <WorklistShell title={WP.roomTitle}>
      {rows === null ? <div style={{ flex: 1 }} aria-busy="true" /> : null}

      {rows !== null && rows.length === 0 ? (
        // TWO LINES AND NO CONTROL. The FAB is already the way in, and a second
        // button here would be a second home for one action.
        <div className="wp-empty">
          <span className="wp-eh">{WP.emptyHead}</span>
          <span className="wp-ep">{WP.emptyBody}</span>
        </div>
      ) : null}

      {rows !== null && rows.length > 0 ? (
        <div className="wp-room">
          {published.length ? (
            <Section label={WP.sectionPublished} count={published.length}>
              {published.map((w) => <Row key={w.id} w={w} onOpen={() => { setActive(w); setSheet('credits'); }} />)}
            </Section>
          ) : null}
          {drafts.length ? (
            <Section label={WP.sectionDraft} count={drafts.length}>
              {drafts.map((w) => <Row key={w.id} w={w} onOpen={() => { setActive(w); setSheet('credits'); }} />)}
            </Section>
          ) : null}
        </div>
      ) : null}

      <button type="button" className="wl-fab" aria-label={WP.fabLabel} onClick={() => setSheet('create')}>+</button>

      {sheet === 'create' ? (
        <CreateSheet vendorId={session.id} onClose={() => setSheet('none')} onSaved={() => { setSheet('none'); void load(); }} />
      ) : null}
      {sheet === 'credits' && active ? (
        <CreditsSheet wedding={active} onClose={() => setSheet('none')} onChanged={() => { void load(); }} />
      ) : null}

      <WeddingPagesStyles />
    </WorklistShell>
  );
}

function Section({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <>
      <div className="wp-sec">{label}<span>{count}</span></div>
      {children}
    </>
  );
}

function Row({ w, onOpen }: { w: Wedding; onOpen: () => void }) {
  const live = w.visibility === 'published' && w.couple_consent;
  return (
    <button type="button" className="wp-row" onClick={onOpen}>
      <span>
        <span className="wp-rprimary">{w.title}</span>
        <span className="wp-rdetail">{[w.venue, w.city].filter(Boolean).join(' \u00b7 ')}</span>
      </span>
      {/* THE STATE WORD IS THE TRUTH, NOT THE INTENT. A page the vendor
          published but the couple has not consented to reads as waiting, because
          that is what a guest opening the link would find. */}
      <span className={live ? 'wp-rstate live' : 'wp-rstate'}>
        {live ? WP.stateLive : (w.visibility === 'published' ? WP.stateWaiting : WP.stateNotPublished)}
      </span>
    </button>
  );
}

function CreateSheet({ vendorId, onClose, onSaved }: { vendorId: string; onClose: () => void; onSaved: () => void }) {
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [eventId, setEventId] = useState('');
  // ⚠ THE NO-EVENT CREATE IS WITHHELD FROM THIS DELIVERY — F-40.99, raised here.
  // R-G12.6 ruled it in ("title, date, venue, city typed by hand"), and it does
  // not execute as worded: `public.weddings` carries THIRTEEN columns and not one
  // of them holds a wedding date. The season a page prints is derived from
  // `events.event_date` through the `event_id` join (`weddings.js:532`), so a
  // page with no event has no date, no season, and nowhere to put a typed one.
  // The banked create door also still refuses it outright
  // (`studio/weddings.js`, "An event is required."), so the arm would have
  // 400'd on its first tap.
  // Reported, never quietly adapted (protocol §9). The arms are in the handover;
  // whichever is ruled needs a dream-os change first, and 0134 belongs to the
  // G2 seat by R-40.44.
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity]   = useState('');
  const [busy, setBusy]   = useState(false);
  const [err, setErr]     = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // ── F-40.33, CORRECTED AT THE WALK ───────────────────────────────────
        // The first cut filtered `deleted_at` HERE. That was dead code twice
        // over: the door's read already carries `.is('deleted_at', null)`
        // (src/api/vendor/events.js:262) AND it does not project the column at
        // all, so the predicate tested a field that never arrives. Derived by
        // reading the handler, which is what the protocol asks for before any
        // frontend call is written. F-40.33's real protection lives where it
        // belongs — in the CREATE DOOR, which re-checks `deleted_at` on the id
        // it is handed and cannot be talked out of it by a stale picker.
        //
        // `state='all'` because a wedding page is finished work and a delivered
        // event may be `done`, while every DEV440 fixture row is `upcoming`;
        // one call covers both. CANCELLED is dropped — a cancelled event cannot
        // be a wedding, and offering one is a door that 404s on tap.
        //
        // ── F-40.68 · R-G11c.11 · THE WINDOW, WHICH `state='all'` NEVER TOUCHED
        // This call passed no `from`/`to` and inherited the door's default
        // window: `src/api/vendor/events.js:210-212` sets `from = istTodayISO()`
        // and `to = from + 400`, and `:258-263` applies `.gte`/`.lte` to BOTH
        // queries. `state='all'` drops the STATE filter and does nothing to the
        // DATE one, so the picker could only ever offer events dated today or
        // later — **the feature's own premise inverted**, a wedding page being
        // work that has already happened.
        //
        // Not hypothetical and not found by reading: on the founder's glass the
        // dropdown held ONE option out of DEV440's seven live events — the only
        // future-dated one — and it was the leadless one, so the only page it
        // could build was another `couple_id`-NULL page (F-40.66's shape). The
        // fixture the walk needs, `Verma - reception` (2026-07-31), was
        // structurally invisible. R-39.15: the rendered surface outranked two
        // seats' readings of the code, both of which had opened the POST create
        // door and the client and never the GET the picker actually calls.
        //
        // `from` is a floor, not a guess. `2000-01-01` predates every wedding
        // any Indian vendor on this estate could have shot and is deliberately
        // NOT computed — a back catalogue has no natural start, and a
        // subtracted number would be a second arithmetic nobody could account
        // for. Whether the picker should bound its past at all, and whether it
        // should PREFER past events, is F-40.68's remainder, chartered to G1.2.
        //
        // `to` uses `istPlusDaysISO`, the estate's one IST day home
        // (`lib/vendor/istDay.ts`), so no date arithmetic is authored here.
        // THE 400 IS A DECLARED MIRROR of the door's own `DEFAULT_WINDOW_DAYS`
        // (`events.js:81`) — it cannot be imported across the repo boundary, so
        // it is named here the way `waNumbers.ts` names its own drift pair,
        // rather than left as a bare number a reader would have to guess at.
        // Passing `to` is not optional: the helper sends the window only when
        // BOTH bounds are present (`lib/vendor/api/vendor.ts:327`).
        const r = await fetchEvents(vendorId, 'all', WP_PICKER_FROM, istPlusDaysISO(400));
        setEvents((r.events || []).filter((e) => e.state !== 'cancelled') as EventRow[]);
        // ── R-G12.8 / F-40.78 · THE TELL EXISTED; THE SURFACE DIDN'T ─────────
        // `truncated` has ridden this door since TDW_04 B6-S1 (`events.js:324`,
        // `(count||0) > events.length`) and `EventsResponse` has declared it
        // since — the seat's read-first found the door needed NOTHING and the
        // ruling for a new `has_more` key was withdrawn. What was missing was a
        // vendor ever being told, so a studio past 200 events silently lost the
        // oldest end of a 26-year window with no tell at all.
        setTruncated(r.truncated === true);
      } catch { setEvents([]); }
    })();
  }, [vendorId]);

  async function save() {
    if (busy || !eventId || !title.trim()) return;
    setBusy(true); setErr(null);
    try {
      await postJson(API.weddings(), { event_id: eventId, title: title.trim(), venue, city });
      onSaved();
    } catch (e) {
      // NEVER A FALSE DONE. The sheet stays open and says so; it does not close
      // on a write it cannot confirm.
      // F-40.56 CURED. This sheet authored no failure line because one was not
      // in the ratified mock; on a network error there was no message and none
      // was invented, so the sheet sat open with a live button and said nothing.
      // The byte is now vetoed (string 28) and stands in when the door has none.
      setErr(e instanceof Error && e.message ? e.message : WP.saveFailed);
      setBusy(false);
    }
  }

  return (
    <Sheet title={WP.createTitle} onClose={onClose}>
      <span className="wp-fl">{WP.fieldEvent}<Req /></span>
      <select className="wp-fi wp-pick" value={eventId} onChange={(e) => setEventId(e.target.value)}>
        {/* An EMPTY label, not a placeholder sentence. 「Choose an event」 was
            written and removed: it is not in the ratified mock. */}
        <option value="" />
        {/* ⚠ JSX TEXT IS NOT A JS STRING. A bare \u00b7 written as option text
            renders as six literal characters, and tsc cannot see it because it
            is perfectly valid text. The separator goes through an EXPRESSION so
            the escape is evaluated. */}
        {(events ?? []).map((e) => (
          <option key={e.id} value={e.id}>{e.title}{' \u00b7 '}{e.event_date}</option>
        ))}
      </select>
      {/* The tell, under the control it describes. */}
      {truncated ? <p className="wp-pickernote">{WP.pickerTruncated}</p> : null}


      <span className="wp-fl">{WP.fieldTitle}<Req /></span>
      <input className="wp-fi" value={title} onChange={(e) => setTitle(e.target.value)} />

      {/* ⚠ THE ADDRESS IS SHOWN, NEVER AUTHORED — and it is NOT derived here.
          The slug rule has ONE home, `slugify` in dream-os's
          src/lib/vendor/weddings.js, and the create door applies it. A JS twin
          in this sheet would be a second rule that agrees until the day one of
          them is edited. So the field is rendered dimmed and empty of promise
          until the row comes back with its real slug. */}
      <span className="wp-fl">{WP.fieldAddress}</span>
      <div className="wp-fi wp-derived" />

      <span className="wp-fl">{WP.fieldVenue}</span>
      <input className="wp-fi" value={venue} onChange={(e) => setVenue(e.target.value)} />
      <span className="wp-fl">{WP.fieldCity}</span>
      <input className="wp-fi" value={city} onChange={(e) => setCity(e.target.value)} />

      {err ? <p className="wp-err">{err}</p> : null}
      <button type="button" className="wp-btn" disabled={busy || !eventId || !title.trim()} onClick={save}>{WP.save}</button>
    </Sheet>
  );
}

function CreditsSheet(
  { wedding, onClose, onChanged }: { wedding: Wedding; onClose: () => void; onChanged: () => void },
) {
  const [credits, setCredits] = useState<Credit[] | null>(null);
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [w, setW] = useState<Wedding>(wedding);
  const [role, setRole] = useState(ROLE_OPTIONS[0].key);
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  // F-40.77: `add()` and `publish()` caught and rendered NOTHING — F-40.53's
  // class one layer in. Silence is not the same as honesty.
  const [err, setErr] = useState<string | null>(null);
  // The upload's own state, separate from `busy`: a photograph uploading must
  // not disable the credit form beside it, and a failed upload must not read as
  // a failed credit.
  const [upBusy, setUpBusy] = useState<{ done: number; total: number } | null>(null);
  const [upErr, setUpErr] = useState(false);
  // The consent ask's own state. Separate from `busy`'s subjects because the link
  // must survive on screen after the request settles — it is the thing she pastes.
  const [consentPhone, setConsentPhone] = useState('');
  const [consentUrl, setConsentUrl] = useState<string | null>(null);
  const [consentSent, setConsentSent] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await getJson<{ ok: boolean; wedding: Wedding; credits: Credit[]; photos: Photo[] }>(API.wedding(wedding.id));
      setCredits(r.credits || []); setW(r.wedding); setPhotos(r.photos || []);
    } catch { setCredits([]); setPhotos([]); }
  }, [wedding.id]);
  useEffect(() => { void load(); }, [load]);

  async function add() {
    if (busy || (!handle.trim() && !name.trim())) return;
    setBusy(true);
    try {
      await postJson(API.weddingCredits(wedding.id), {
        role, handle: handle.trim(), name: name.trim(),
        phone: /^[+0-9][0-9 ()-]{6,}$/.test(handle.trim()) ? handle.trim() : '',
      });
      setHandle(''); setName(''); setErr(null); await load(); onChanged();
    } catch (e) {
      // F-40.77 CURED. The first cut caught and rendered NOTHING: the row was
      // not added, the fields kept what she typed, and the room said so
      // nowhere. That satisfied never-a-false-done and was the whole of what it
      // got right. The door's own message wins when it has one; the ratified
      // line stands in when it does not.
      setErr(e instanceof Error && e.message ? e.message : WP.addFailed);
    }
    setBusy(false);
  }

  /**
   * THE UPLOAD — two doors per photograph, and the ORDER is the contract.
   * `POST /upload-url` signs a direct browser PUT to Cloudinary (the bytes never
   * pass through Railway), then `POST /photos` records what came back. The door
   * re-checks that the URL is an estate asset, so a browser cannot post a
   * stranger's CDN link into a couple's page.
   *
   * ⚠ SEQUENTIAL, NOT `Promise.all`. A wedding is a hundred photographs and a
   * phone on venue wifi; firing them at once is how a browser drops half of them
   * and reports success. The counter is the vendor's only honest progress signal,
   * and it cannot exist at all under a parallel fan-out.
   */
  async function upload(picked: FileList | null) {
    // ── A FileList IS LIVE, NOT A COPY — F-40.101, owned ──────────────────────
    // The call site resets the input (`e.target.value = ''`) so the same file can
    // be chosen twice. That reset runs the MOMENT this function first awaits, and
    // it EMPTIES the FileList this loop is still walking: iteration two read
    // `files.length === 0`, the loop exited, and exactly one photograph landed
    // with no error and no complaint. The founder walked it — four picked, one
    // saved, three gone silently — and it is the worst shape a bug can take,
    // because the surface reported success.
    //
    // The snapshot is taken BEFORE any await. `Array.from` copies the entries out
    // of the live list, so resetting the input afterwards cannot reach them.
    const files = picked ? Array.from(picked) : [];
    if (!files.length || upBusy) return;
    setUpErr(false);
    setUpBusy({ done: 0, total: files.length });
    let failed = false;
    for (let i = 0; i < files.length; i += 1) {
      const f = files[i];
      try {
        const sig = await postJson<{ ok: boolean; upload_url: string; params: Record<string, string> }>(
          API.weddingUploadUrl(wedding.id), { filename: f.name },
        );
        const fd = new FormData();
        Object.entries(sig.params).forEach(([k, v]) => fd.append(k, String(v)));
        fd.append('file', f);
        const up = await fetch(sig.upload_url, { method: 'POST', body: fd });
        // THE STATUS IS THE VERDICT. Cloudinary answers a rejected signature with
        // a 401 carrying JSON; a check keyed on the body alone reads it as a
        // successful upload with odd fields (F-40.53's class, third instance).
        if (!up.ok) { failed = true; break; }
        const j = await up.json();
        await postJson(API.weddingPhotos(wedding.id), { url: j.secure_url, public_id: j.public_id });
        setUpBusy({ done: i + 1, total: files.length });
      } catch { failed = true; break; }
    }
    setUpBusy(null);
    if (failed) setUpErr(true);
    await load(); onChanged();
  }

  /** REMOVE — the row goes, then the asset. The door owns that order and the
   *  reason; this only reports what it answered. No confirm dialog: the estate
   *  has no confirm idiom on this shell, and inventing one here would be a
   *  second grammar for a destructive tap. */
  async function removePhoto(photoId: string) {
    if (upBusy) return;
    setUpErr(false);
    try { await deleteJson(API.weddingPhoto(wedding.id, photoId)); await load(); onChanged(); }
    catch { setUpErr(true); }
  }

  /**
   * THE CONSENT ASK — F-40.103's cure, and the door has had no caller since it
   * shipped. `POST /:id/consent` mints a token, records the number, and sends one
   * Utility template (Approved 2026-09-05) behind its own flag. Until the flag is
   * set the send is REPORTED as skipped and the link is shown so it can be pasted
   * by hand — exactly how the claim path is walked today.
   *
   * ⚠ IT IS ONLY OFFERED WHEN THE PAGE HAS NO COUPLE ON TDW. A page whose couple
   * has an account is governed by HER SWITCH; minting a token beside it would give
   * one decision two doors. The door refuses with a 409 and this room does not
   * even show the field — the refusal is the ruling, not a fallback.
   */
  async function askConsent() {
    if (busy || !consentPhone.trim()) return;
    setBusy(true); setErr(null);
    try {
      const r = await postJson<{ ok: boolean; consent_url: string; invite: { sent: boolean; reason?: string } }>(
        API.weddingConsent(wedding.id), { phone: consentPhone.trim() },
      );
      // NEVER A FALSE DONE. The link is shown whether or not the send went, and
      // the send's own answer is reported rather than assumed — `sendConsentInvite`
      // returns `{sent, skipped, reason}` and the room says which.
      setConsentUrl(r.consent_url || null);
      setConsentSent(Boolean(r.invite && r.invite.sent));
      setConsentPhone('');
    } catch (e) {
      setErr(e instanceof Error && e.message ? e.message : WP.consentFailed);
    }
    setBusy(false);
  }

  async function publish() {
    if (busy) return;
    setBusy(true);
    try { setErr(null); await postJson(API.weddingPublish(wedding.id), {}); await load(); onChanged(); }
    catch (e) {
      // F-40.77's second half. Nothing is claimed that was not confirmed AND the
      // vendor is told — publishing is the act this whole room exists for.
      setErr(e instanceof Error && e.message ? e.message : WP.publishFailed);
    }
    setBusy(false);
  }

  const live = w.visibility === 'published' && w.couple_consent;

  return (
    <Sheet title={WP.creditsTitle} onClose={onClose}>
      {/* ── PHOTOGRAPHS — F-40.57's cure ────────────────────────────────────
          The room mounted no upload control though both doors existed. This
          sheet IS the wedding record — a row's only action opens it, and there
          is no second screen — so the strip joins it ABOVE the roll rather than
          opening a third surface for one object.

          ⚠ CELL ONE IS THE HERO AND THE ROOM SAYS SO. `photosFor` orders by
          `position` then `created_at`, and the public leaf takes `photos[0]` as
          its hero — so the first cell IS what a guest sees first, and leaving
          the vendor to discover that on a walk would be the room withholding a
          fact it holds.

          ⚠ NO DRAG HANDLES, BY RULING. A drag inside a scrolling sheet fights
          the scroll on a phone and the estate has no drag idiom to inherit;
          R-G12.12 was narrowed so no order door ships without a caller. Order
          changes by remove-and-re-add until a gesture is ruled (F-40.83). */}
      <span className="wp-fl">{WP.photos}</span>
      {photos !== null && photos.length === 0 && !upBusy
        ? <div className="wp-upempty">{WP.photosEmpty}</div> : null}
      <div className="wp-upgrid">
        {(photos ?? []).map((p, i) => (
          <div className="wp-upcell" key={p.id}>
            <img className="wp-upimg" src={p.url} alt="" />
            {i === 0 ? <span className="wp-uphero">{WP.photoHero}</span> : null}
            <button type="button" className="wp-upx" aria-label={WP.photoRemove}
                    disabled={Boolean(upBusy)} onClick={() => void removePhoto(p.id)}>&times;</button>
          </div>
        ))}
        {/* The label IS the control — a hidden input plus a styled label is the
            estate's own file idiom (components/vendor/AddSheet.tsx), and it keeps
            the tap target the same size as a cell. */}
        <label className="wp-upadd">
          +
          <input type="file" accept="image/*" multiple
                 style={{ display: 'none' }}
                 onChange={(e) => { void upload(e.target.files); e.target.value = ''; }} />
        </label>
      </div>
      {upBusy ? <p className="wp-upbusy">{WP.photosAdding(upBusy.done + 1, upBusy.total)}</p> : null}
      {upErr ? <p className="wp-uperr" role="status">{WP.photoFailed}</p> : null}

      <span className="wp-fl">{WP.fieldRole}</span>
      <select className="wp-fi wp-pick" value={role} onChange={(e) => setRole(e.target.value)}>
        {ROLE_OPTIONS.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
      </select>
      <span className="wp-fl">{WP.fieldHandleOrNumber}<Req /></span>
      <input className="wp-fi" value={handle} onChange={(e) => setHandle(e.target.value)} />
      <span className="wp-fl">{WP.fieldName}</span>
      <input className="wp-fi" value={name} onChange={(e) => setName(e.target.value)} />
      <button type="button" className="wp-btn" disabled={busy} onClick={add}>{WP.add}</button>

      <div className="wp-clist">
        {(credits ?? []).map((c) => (
          <div className="wp-crow" key={c.id}>
            <span>
              <span className="wp-crole">{ROLE_OPTIONS.find((r) => r.key === c.role)?.label ?? c.role}</span>
              <span className="wp-cname">{c.name}</span>
            </span>
            {/* NO EDIT CONTROL ON ANOTHER VENDOR'S CREDIT — absent, not disabled.
                master §4 G1.1's own refusal, and s-G11.2's shape. */}
            <span className={c.status === 'claimed' ? 'wp-cstate on' : c.status === 'declined' ? 'wp-cstate no' : 'wp-cstate'}>
              {c.status === 'claimed' ? WP.stateClaimed : c.status === 'declined' ? WP.stateDeclined : WP.stateInvited}
            </span>
          </div>
        ))}
      </div>

      {/* ── THE CONSENT ASK — F-40.49's whole reason, F-40.103's cure ──────
          Offered ONLY when this page has no couple on TDW. A page whose couple
          has an account is governed by her switch in her own Settings room, and
          a second door onto one decision is the disease the writer-set census
          exists to prevent — so the field is ABSENT, not disabled. */}
      {w.couple_id ? null : (
        <div className="wp-consent">
          <span className="wp-fl">{WP.consentLabel}</span>
          <input className="wp-fi" value={consentPhone} inputMode="tel"
                 onChange={(e) => setConsentPhone(e.target.value)} />
          <button type="button" className="wp-btn" disabled={busy || !consentPhone.trim()}
                  onClick={() => void askConsent()}>{WP.consentSend}</button>
          {/* The link is shown whether or not the message went — it is the thing
              she pastes while the send is dark, and it is the honest artefact
              either way. `consentSent` reports the door's own answer, never an
              assumption about it. */}
          {consentUrl ? (
            <>
              <p className="wp-consentnote">{consentSent ? WP.consentSentLine : WP.consentDarkLine}</p>
              <p className="wp-consenturl">{consentUrl}</p>
            </>
          ) : null}
        </div>
      )}

      {/* F-40.77's byte, under the controls it belongs to. */}
      {err ? <p className="wp-err" role="status">{err}</p> : null}

      <div className="wp-pubrow">
        {live ? <div className="wp-live">{WP.pageIsLive}</div> : null}
        {/* THE THREE FOOT STATES, AND THE ABSENCES ARE THE RULING.
            live            -> #26 「This page is live.」
            published, no   -> #25 「Waiting on the couple's permission.」 ALONE;
              consent          the publish control is ABSENT, not greyed.
            draft           -> #24 「Publish this page」 */}
        {!live && w.visibility === 'published' ? <div className="wp-wait">{WP.waitingOnCouple}</div> : null}
        {!live && w.visibility !== 'published' ? (
          <button type="button" className="wp-btn" disabled={busy} onClick={publish}>{WP.publish}</button>
        ) : null}
      </div>
    </Sheet>
  );
}

/**
 * THE REQUIRED MARK — the estate's own idiom, not a new one.
 * `components/vendor/AddSheet.tsx:451` renders `{f.label}{f.required && <span
 * style={{color: D.gold}}> *</span>}` and validates with the word `Required`.
 * The founder asked for the same language here, so this is that mark carried
 * across, with one change that is not a change of language: the colour comes
 * from `--role-metal`, the SHELL's own gold token, rather than the Espresso
 * lane's `D.gold` literal. AddSheet lives in the old tree; a hex literal inside
 * the shell's scope is F-38.22's class.
 *
 * The asterisk is punctuation in an existing pattern, not a new product byte,
 * so it needs no veto. Which fields wear it is derived from the DOOR, never
 * guessed: `POST /studio/weddings` refuses without `event_id` and `title`;
 * `POST /:id/credits` refuses without a handle or a number. Venue, City and
 * Name are genuinely optional and are left unmarked — marking everything is the
 * same as marking nothing.
 */
function Req() { return <span className="wp-req"> *</span>; }

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div className="wp-scrim" onClick={onClose} />
      <div className="wp-sheet" role="dialog" aria-label={title}>
        <div className="wp-shhead">
          <span className="wp-shtitle">{title}</span>
          {/* `aria-label="Close"` inline is the shell's own shipped idiom
              (components/worklist/AskSheet.tsx, three sites). It is an
              accessible name, not product copy, and it does not join a copy
              home where a bench would read it as a vetoed byte. */}
          <button type="button" className="wp-shx" aria-label="Close" onClick={onClose}>&times;</button>
        </div>
        {children}
      </div>
    </>
  );
}

function WeddingPagesStyles() {
  return (
    <style>{`
.wp-room{padding-top:20px;padding-bottom:28px}
.wp-sec{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px;display:flex;justify-content:space-between}
.wp-sec+.wp-row{margin-bottom:var(--wl-step)}
.wp-row{display:grid;grid-template-columns:1fr auto;align-items:start;column-gap:12px;width:100%;text-align:left;
        background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;
        padding:13px 14px;margin-bottom:var(--wl-step);cursor:pointer;min-height:44px}
.wp-rprimary{font:var(--wl-t3);color:var(--atelier-ink);display:block}
.wp-rdetail{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:3px}
.wp-rstate{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);white-space:nowrap;padding-top:2px}
.wp-rstate.live{color:var(--atelier-accent-text)}
.wp-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding-bottom:80px}
.wp-eh{font:var(--wl-t2);color:var(--atelier-ink)}
.wp-ep{font:var(--wl-t3);color:var(--atelier-ink-mute);max-width:250px}
.wp-scrim{position:fixed;inset:0;background:var(--atelier-overlay);z-index:20}
.wp-sheet{position:fixed;left:0;right:0;bottom:0;z-index:21;border-radius:14px 14px 0 0;max-width:520px;margin:0 auto;
          background:linear-gradient(180deg,var(--atelier-sheet-top) 0%,var(--atelier-sheet-bot) 100%);
          border-top:.5px solid var(--atelier-sheet-border);padding:18px var(--wl-gutter) 22px;max-height:92%;overflow-y:auto}
.wp-shhead{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
.wp-shtitle{font:var(--wl-t1);color:var(--atelier-ink)}
.wp-shx{font:var(--wl-t2);color:var(--atelier-ink-fade);line-height:1;background:none;border:none;cursor:pointer;min-width:44px;min-height:44px}
.wp-fl{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);display:block;margin-bottom:5px}
/* AddSheet's gold asterisk, in the shell's own token rather than a hex literal. */
.wp-req{color:var(--role-metal)}
.wp-fi{background:var(--atelier-input-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;
       padding:10px 12px;font:var(--wl-t3);color:var(--atelier-ink);margin-bottom:12px;width:100%;min-height:44px;display:block}
.wp-pick{border-color:var(--atelier-input-border)}
.wp-derived{color:var(--atelier-ink-mute)}
.wp-btn{width:100%;min-height:48px;display:flex;align-items:center;justify-content:center;
        background:var(--atelier-accent-text);color:var(--role-ink-deep);border:none;border-radius:3px;
        font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
.wp-btn[disabled]{opacity:.55}
.wp-err{font:var(--wl-t5);color:var(--role-critical);margin-bottom:10px}
/* ── G1.2 · THE PHOTOGRAPH STRIP ────────────────────────────────────────────
   Four across, square, inside the sheet the vendor already has open. The remove
   affordance is ON THE CELL and always present rather than a "manage" mode the
   whole grid enters: a mode is a second state for the same objects and she would
   have to learn which one she is in.
   NO BACKTICKS IN THIS BLOCK — it lives inside a template literal, and a pair of
   them closes it silently (e-7/e-8, twice in one sitting). */
.wp-upgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:16px}
.wp-upcell{position:relative;aspect-ratio:1;border-radius:2px;overflow:hidden}
.wp-upimg{width:100%;height:100%;object-fit:cover;display:block}
.wp-upx{position:absolute;top:3px;right:3px;width:22px;height:22px;border:none;border-radius:50%;
        background:var(--atelier-overlay-bg);color:var(--atelier-ink);opacity:.88;
        font:400 13px/1 "DM Sans",system-ui;cursor:pointer;padding:0}
.wp-upx[disabled]{opacity:.4}
.wp-uphero{position:absolute;left:3px;bottom:3px;padding:2px 5px;border-radius:1px;
           background:var(--role-metal);color:var(--role-ink-on-metal);
           font:500 8px/1.2 "DM Sans",system-ui;letter-spacing:.10em;text-transform:uppercase}
.wp-upadd{aspect-ratio:1;border-radius:2px;border:.5px dashed var(--atelier-card-border);
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          color:var(--atelier-ink-mute);font:400 20px/1 "DM Sans",system-ui}
.wp-upempty{padding:14px 0;text-align:center;color:var(--atelier-ink-mute);font:var(--wl-t3)}
.wp-upbusy{font:var(--wl-t5);color:var(--atelier-ink-dim);margin-bottom:10px}
.wp-uperr{font:var(--wl-t5);color:var(--role-critical);margin-bottom:10px}
/* ── THE CONSENT ASK ────────────────────────────────────────────────────────
   Set off from the credit form above it by a rule, because it addresses a
   different person: the credits reach vendors, this reaches the couple.
   NO BACKTICKS IN THIS BLOCK — it lives inside a template literal (e-7/e-8). */
.wp-consent{margin-top:18px;padding-top:16px;border-top:.5px solid var(--atelier-card-border)}
.wp-consentnote{font:var(--wl-t5);color:var(--atelier-ink-dim);margin-top:10px}
/* The link is long and must be selectable whole — a truncated address a vendor
   cannot copy is worse than no link at all. */
.wp-consenturl{font:var(--wl-t5);color:var(--atelier-accent-text);margin-top:6px;
               word-break:break-all;user-select:all}
/* The picker's truncation tell (R-G12.8). Quiet: it is a fact about the list,
   not a warning about her data. */
.wp-pickernote{font:var(--wl-t5);color:var(--atelier-ink-mute);margin:-2px 0 12px;line-height:1.45}
.wp-clist{margin-top:14px}
.wp-crow{display:grid;grid-template-columns:1fr auto;align-items:center;column-gap:12px;
         border-top:.5px solid var(--atelier-card-border);padding:9px 0}
.wp-crole{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);display:block}
.wp-cname{font:var(--wl-t3);color:var(--atelier-ink);display:block;margin-top:2px}
.wp-cstate{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);white-space:nowrap}
.wp-cstate.on{color:var(--atelier-accent-text)}
.wp-cstate.no{color:var(--atelier-ink-fade)}
.wp-pubrow{border-top:.5px solid var(--atelier-card-border);margin-top:14px;padding-top:14px}
.wp-live{font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-accent-text);text-align:center;padding:6px 0}
.wp-wait{font:var(--wl-t5);color:var(--atelier-ink-fade);line-height:1.5;text-align:center;padding:6px 0}
    `}</style>
  );
}
