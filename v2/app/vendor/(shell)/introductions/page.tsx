"use client";
// app/vendor/(shell)/introductions/page.tsx — R9-J1 · THE INTRODUCTIONS ROOM.
// CE-42 seat E3, 4a packet 3b, under R-42.8. Base dreamos-pwa d22bdf2c.
// Frame: docs/mocks/j1-introductions-mock.html (E2, chair-vetoed 2026-09-10),
// banked in this ZIP — F-42.95, it had never been committed.
//
// ═══ THE DOORS DECIDE, THIS DRAWS ════════════════════════════════════════════
// `src/api/vendor/introductions.js` at dream-os 876cef2 forwards the ARM'S own
// refusals with distinct codes: 400 `missing_slot` carrying the founder-vetoed
// ask, 409 `already_introduced` carrying INTRO_ALREADY_SENT, 503 `dark`
// carrying `cap.reason()`'s sentence, 409 `name_mismatch` for E3, 502
// `not_delivered`. THIS SCREEN RE-IMPLEMENTS NONE OF THEM. It renders
// `body.error` — the estate's byte, arriving on the wire — and holds no local
// map of refusals at all.
//
// ⚠ AND IT DOES NOT EVEN CHECK FOR AN EMPTY FIELD, though the door's own
// comment allows it. Posting a blank costs one round trip and comes back with
// `INTRO_ASK_NUMBER` / `_NAME` / `_WHERE`, which are founder-vetoed sentences
// written for exactly this moment. A local `if (!phone)` would replace three
// vetoed bytes with silence or with a sixteenth string. One home wins.
//
// ⚠ THE REFUSAL SITS STILL UNTIL A FIELD CHANGES — F-42.74, and this is the
// same law, not a new one. It is cleared by the field wrapper below and never
// on a timer: a refusal that clears itself while the form still holds what it
// refused is a refusal that lies.
//
// ═══ NO SECOND HOME FOR THE ENVELOPE ═════════════════════════════════════════
// `lib/vendor/api/_base.ts`'s `handleResponse` DOES NOT THROW on a non-2xx — it
// returns the parsed body (:94-97). So every refusal arrives as data and is read
// off `ok`/`error`/`code`, and the try/catch below is for the network alone. A
// screen written to catch these would never see one.
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { getJson, postJson } from '@/lib/vendor/api/_base';
import { API } from '@/v2/lib/solutions/routes';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { RoomHeadAdd } from '@/v2/components/worklist/PageHelp';   // FE-5's pill, in the room head (FE-8)
import { dayInWords } from '@/v2/lib/worklist/dayInWords';
import { RECORD_CSS } from '@/v2/components/worklist/RecordPage';
import { Sheet, SHEET_CSS } from '@/v2/components/worklist/StudioSheets';
import {
  IN, BUTTON_LABEL, sendTo, introMeta, introSent, chipWord, pageLabel,
} from '@/lib/worklist/introductions';
import type { IntroRow, IntroStaged } from '@/lib/worklist/introductions';

type ListBody = { ok?: boolean; error?: string; introductions?: IntroRow[] };
type StageBody = { ok?: boolean; error?: string; code?: string } & Partial<IntroStaged>;
type SendBody = { ok?: boolean; error?: string; code?: string };

export default function IntroductionsPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <IntroductionsScreen />;
}

function IntroductionsScreen() {
  const [phone, setPhone] = useState('');
  const [name, setName]   = useState('');
  const [where, setWhere] = useState('');
  const [staged, setStaged]   = useState<IntroStaged | null>(null);
  const [refusal, setRefusal] = useState<string | null>(null);
  const [busy, setBusy]       = useState(false);
  const [rows, setRows]       = useState<IntroRow[] | null>(null);

  const load = useCallback(async () => {
    try {
      const body = await getJson<ListBody>(API.introductions());
      setRows(body?.ok ? (body.introductions ?? []) : []);
    } catch {
      // R-38.2: the room renders its frame either way. An unreadable list is an
      // empty Sent section above a working form, never a spinner where her room
      // should be and never a page that refuses to let her send.
      setRows([]);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  // ── THE ONE WRAPPER THAT CLEARS THE REFUSAL ──────────────────────────────
  // Every field goes through it, so a fourth field cannot forget. D5c's own
  // shape, and a cell counts fields against wrapped fields.
  const edit = (set: (v: string) => void) => (v: string) => { setRefusal(null); set(v); };

  async function onReview() {
    setBusy(true);
    setRefusal(null);
    try {
      const body = await postJson<StageBody>(API.introductions(), {
        recipient_phone: phone,
        recipient_name:  name,
        where_met:       where,
      });
      if (body?.ok && body.id && body.body_filled) {
        setStaged({
          id:             body.id,
          recipient_name: body.recipient_name ?? name,
          body_filled:    body.body_filled,
          page_url:       body.page_url ?? '',
        });
      } else {
        // THE DOOR'S SENTENCE, WHICHEVER REFUSAL IT WAS. `missing_slot`,
        // `already_introduced` and `dark` all land here and all speak in the
        // estate's own vetoed words. The code is not branched on: three
        // branches printing one field is three chances to print the wrong one.
        setRefusal(body?.error || null);
      }
    } catch {
      setRefusal(null);
    } finally {
      setBusy(false);
    }
  }

  async function onSend() {
    if (!staged) return;
    setBusy(true);
    setRefusal(null);
    try {
      // ⚠ THE NAME FROM THE FIELD, NOT THE ROW'S ECHO. E3 lives on the server
      // and compares the approval to ITS OWN row (`approvalNames`). Posting
      // `staged.recipient_name` back would be the client answering its own
      // question, and the guard would pass by construction on every request
      // including a wrong one.
      const body = await postJson<SendBody>(API.introductionSend(staged.id), {
        recipient_name: name,
      });
      if (body?.ok) {
        setStaged(null);
        setPhone(''); setName(''); setWhere('');
        await load();
      } else {
        setRefusal(body?.error || null);
      }
    } catch {
      setRefusal(null);
    } finally {
      setBusy(false);
    }
  }

  const sent = introSent(rows ?? []);

  // ── #15 · ABOVE THE FORM, NEVER INSTEAD OF IT ────────────────────────────
  // Chair-ruled. With nothing sent, the `Sent` eyebrow and `No introductions
  // yet.` sit ABOVE the form; with rows, the Sent section takes the frame's own
  // position BELOW it. Both authorities are honoured and neither is bent: the
  // empty room says what is true and then offers the one thing to do, and a
  // working room puts the action first and the history under it.
  const isEmpty = sent.length === 0;

  // CE-47 L4 (FE-7): the pill opens the form as a sheet; the preview is the sheet's second step; Sent is one group.
  const [sheet, setSheet] = useState(false);
  const meta = (r: IntroRow) => [r.where_met ? IN.metAt(r.where_met) : '', dayInWords(r.sent_at || r.created_at)].filter(Boolean).join(' \u00B7 ');
  const tone = (c: IntroRow['chip']) => (c === 'delivered' || c === 'read' ? 'ok' : c === 'not_delivered' ? 'bad' : 'plain') as 'ok' | 'bad' | 'plain';
  const closeSheet = () => { setSheet(false); setStaged(null); setRefusal(null); };
  return (
    <WorklistShell title={IN.title}>
      <Body>
        <p className="fr-lede">{IN.lede}</p>
        <RoomHeadAdd addKey="introduction" label={IN.addPill} onAdd={() => setSheet(true)} />
        <Head text={IN.sectionSent} count={sent.length} />
        {isEmpty ? <p className="fr-empty">{IN.empty}</p> : (
          <Group>
            {sent.map((r) => (
              <Row key={r.id}
                title={r.recipient_name || (r.recipient_phone_last4 ? `\u2022\u2022\u2022\u2022 ${r.recipient_phone_last4}` : '')}
                facts={meta(r)} pill={{ text: chipWord(r.chip) || '', tone: tone(r.chip) }} />
            ))}
          </Group>
        )}
      </Body>
      {sheet ? (
        <Sheet title={staged ? IN.previewEyebrow : IN.newIntro} onClose={closeSheet}>
          {!staged ? (
            <div className="itr-form">
              <label className="itr-lbl" htmlFor="itr-phone">{IN.labelNumber}</label>
              <input id="itr-phone" className="itr-field" type="tel" inputMode="tel" autoComplete="off" value={phone} onChange={(e) => edit(setPhone)(e.target.value)} />
              <label className="itr-lbl" htmlFor="itr-name">{IN.labelName}</label>
              <input id="itr-name" className="itr-field" type="text" autoComplete="off" value={name} onChange={(e) => edit(setName)(e.target.value)} />
              <label className="itr-lbl" htmlFor="itr-where">{IN.labelWhere}</label>
              <input id="itr-where" className="itr-field" type="text" autoComplete="off" value={where} onChange={(e) => edit(setWhere)(e.target.value)} />
              {refusal ? <p className="itr-refusal">{refusal}</p> : null}
              <button type="button" className="rp-next itr-go" disabled={busy} onClick={() => void onReview()}>{IN.review}</button>
            </div>
          ) : (
            <div className="itr-form">
              <div className="itr-card itr-preview">
                <p className="itr-body">{staged.body_filled}</p>
                <div className="itr-btnchip">{BUTTON_LABEL}</div>
                {staged.page_url ? <div className="itr-link">{pageLabel(staged.page_url)}</div> : null}
              </div>
              {refusal ? <p className="itr-refusal">{refusal}</p> : null}
              <button type="button" className="rp-next itr-go itr-send" disabled={busy} onClick={() => void onSend()}>{sendTo(staged.recipient_name)}</button>
              <button type="button" className="itr-back" disabled={busy} onClick={() => { setStaged(null); setRefusal(null); }}>{'\u2039'} {IN.back}</button>
            </div>
          )}
        </Sheet>
      ) : null}
      <style>{FR_CSS + RECORD_CSS + SHEET_CSS + '.itr-form{display:flex;flex-direction:column}.itr-go{margin-top:16px}'}</style>
      <style>{`
/* THE LEADS-CARD IDIOM, SHARED WITH REFERRALS, GOOGLE REVIEWS AND WEDDING PAGES.
   Every rule is transcribed from those rooms’ own blocks, property for property.
   NOT ONE COLOUR IS INVENTED: every value is an --atelier-* or --role-* token
   emitted by lib/worklist/theme.ts (R-41.140, R-42.6).

   ⚠ AND NOT ONE IS TRANSCRIBED FROM THE FRAME — F-42.113. The frame’s stylesheet
   spells the nine ROLE tokens with the --atelier- prefix (metal, ink-on-metal,
   ink-deep, positive, caution, critical, scrim, sheet, today-coin-ink), because
   tools/advisor_frame_emit.mjs reads prefixFor into a variable at :48 and then
   hardcodes the prefix at :51 without consulting it. In the shipped app those
   names resolve to nothing. Every role colour below is named from theme.ts’s
   own prefixFor branch instead. FILED, NOT CURED: curing the emitter would
   change every frame in docs/mocks and re-cut a ratified one mid-sitting.

   NEW HERE: .itr-field, .itr-send and .itr-btnchip. The estate had no room with
   a typed three-field compose above a preview, so the field rule is the frame’s
   own, and .itr-send carries the one-line clamp correction 1 exists for.

   The two-up confirm row of the frame is GONE and there is no .itr-two rule to
   inherit it back.

   No backtick appears in this block. It is a template literal and a backtick in
   a CSS comment closes the string. */
.itr-room{padding-top:24px;padding-bottom:32px}
.itr-lede{font:var(--wl-t3);color:var(--atelier-ink-soft);line-height:1.5;margin:0 0 16px}
.itr-sec{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px}
.itr-secgap{margin-top:24px}
.itr-empty{font:var(--wl-t3);color:var(--atelier-ink-mute);margin:0 0 16px}
.itr-card{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:12px;padding:16px;margin-bottom:var(--wl-step)}
.itr-preview{background:var(--atelier-section-bg)}
.itr-lbl{display:block;font:var(--wl-t5);letter-spacing:.07em;text-transform:uppercase;color:var(--atelier-label);margin-bottom:4px}
.itr-field{display:block;width:100%;background:var(--atelier-input-bg);border:.5px solid var(--atelier-input-border);border-radius:12px;padding:12px;min-height:44px;font:var(--wl-t3);color:var(--atelier-ink);margin-bottom:12px}
.itr-field:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.itr-btn{width:100%;padding:12px;min-height:44px;border-radius:12px;font:var(--wl-t3);cursor:pointer;touch-action:manipulation}
.itr-primary{background:var(--role-primary);color:var(--role-on-primary);border:1px solid var(--role-primary)}
.itr-primary:active{background:var(--atelier-row-hover)}
.itr-primary:disabled{cursor:default;opacity:.6}
.itr-primary:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
/* CORRECTION 1. One line, and the overflow is an ellipsis rather than a wrap or
   a name cut in TypeScript: she is approving a message TO that person. */
.itr-send{margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.itr-back{display:block;width:100%;margin-top:16px;padding:12px;min-height:44px;background:transparent;border:none;cursor:pointer;font:var(--wl-t4);color:var(--atelier-accent-text);text-align:center;touch-action:manipulation}
.itr-back:active{background:var(--atelier-row-hover)}
.itr-back:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.itr-eyebrow{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin-bottom:8px}
.itr-body{font:var(--wl-t3);color:var(--atelier-ink);line-height:1.55;margin:0}
.itr-btnchip{margin-top:12px;text-align:center;padding:8px;border:.5px solid var(--atelier-card-border);border-radius:12px;color:var(--atelier-accent-text);font:var(--wl-t4)}
.itr-link{margin-top:8px;font:var(--wl-t5);color:var(--atelier-ink-fade);text-align:center;word-break:break-all}
.itr-refusal{font:var(--wl-t5);color:var(--role-critical);line-height:1.5;margin:4px 0 12px;max-width:40ch}
.itr-row{display:grid;grid-template-columns:1fr auto;align-items:start;column-gap:12px}
.itr-rowtext{min-width:0}
.itr-who{font:var(--wl-t3);color:var(--atelier-ink);display:block}
.itr-meta{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:4px}
.itr-chip{font:var(--wl-t5);padding:4px 8px;border:.5px solid var(--atelier-card-border);border-radius:12px;color:var(--atelier-ink-mute);white-space:nowrap}
.itr-ok{color:var(--role-positive);border-color:var(--role-positive)}
.itr-bad{color:var(--role-critical);border-color:var(--role-critical)}
      `}</style>
    </WorklistShell>
  );
}
