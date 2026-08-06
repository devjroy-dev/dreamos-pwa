'use client';
// app/admin/_components/MintSheet.tsx — TDW_10 ADMIN P3 · one-tap birth.
//
// ── EVERY RENDERED BYTE IS FOUNDER-VETOED ───────────────────────────────────
// The copy inventory went to the founder whole before a byte was written and came
// back 「 2-all ok 」. Nothing here is improvised. Where a string names a mechanism
// (the handle line, the dark-gate refusal) the mechanism is named in-comment so
// the sitting that changes the mechanism is forced to re-read the sentence
// (F-06.85).
//
// ── COLOUR: TOKENS ONLY, ZERO HEX ───────────────────────────────────────────
// This is a new surface, so it consumes `var(--admin-*)` and nothing else. The
// espresso ground, the ink ladder and the metal come from
// `app/admin/_components/tokens.css`, whose values are diff-proven against
// `lib/vendor/theme.ts DARK`. `AdminUI`'s `T` map still carries the pre-P1 navy
// literals and falls to P6's sweep; structural components are borrowed from it,
// colours are not.

import { useState, useEffect } from 'react';
import { BottomSheet, FieldInput, FieldSelect, GhostBtn } from './AdminUI';
import {
  mintVendor, mintCouple, sendWelcome, getWelcomeStatus,
  type MintOutcome, type WelcomeStatus,
} from '../../../lib/admin-api/mint';

const CATEGORIES = [
  'photography', 'makeup', 'decor', 'catering', 'venue',
  'mehndi', 'choreography', 'music', 'planning', 'other',
];

type Kind = 'vendor' | 'couple';

type Result = {
  kind: Kind;
  outcome: MintOutcome;
  id: string | null;
  name: string | null;
  routing_handle: string | null;
};

export default function MintSheet({ visible, kind, onClose, onMinted }: {
  visible: boolean;
  kind: Kind;
  onClose: () => void;
  onMinted?: () => void;
}) {
  const [phone, setPhone]     = useState('');
  const [name, setName]       = useState('');
  const [category, setCat]    = useState('photography');
  const [city, setCity]       = useState('');
  const [wedding, setWedding] = useState('');

  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState('');
  const [result, setResult]   = useState<Result | null>(null);

  const [welcome, setWelcome] = useState<WelcomeStatus | null>(null);
  const [welcomeMsg, setWelcomeMsg] = useState('');
  // ── F-10.56 CURED · A REFUSAL AND A SEND LOOKED IDENTICAL ──────────────────
  // The pre-tap line and the post-tap refusal were the SAME BYTES — 「 Welcome
  // template is not approved by Meta yet. 」 — so the screen did not change when
  // the button was pressed, and the founder reported it as "just clicking, not
  // getting sent". It WAS working: three clean refusals landed in the audit log
  // while the screen said nothing new.
  //
  // WHY THIS IS NOT COSMETIC. The same line is what will report a REAL send to a
  // real vendor's phone the day Meta approves. If `refused` and `nothing
  // happened` are indistinguishable today, then `sent` and `nothing happened`
  // are indistinguishable tomorrow — and a surface that claims a send it cannot
  // evidence is the founding-lie family, on the one surface that touches a
  // vendor's number. The outcome is now a typed state with its own wording and
  // its own colour, and the pre-tap notice hides the moment a result exists.
  const [welcomeOutcome, setWelcomeOutcome] = useState<'sent' | 'refused' | null>(null);
  const [welcomeBusy, setWelcomeBusy] = useState(false);

  // The server carries the verdict on the welcome template, so this screen never
  // holds a second opinion about what Meta has approved.
  useEffect(() => {
    if (!visible || kind !== 'vendor') return;
    getWelcomeStatus().then(setWelcome).catch(() => setWelcome(null));
  }, [visible, kind]);

  function reset() {
    setPhone(''); setName(''); setCat('photography'); setCity(''); setWedding('');
    setError(''); setResult(null); setWelcomeMsg(''); setWelcomeOutcome(null); setBusy(false);
  }

  async function submit() {
    setError('');
    if (!phone.trim()) { setError('Phone is required.'); return; }
    if (kind === 'couple' && !name.trim()) { setError('Names are required.'); return; }
    setBusy(true);
    try {
      if (kind === 'vendor') {
        const r = await mintVendor({
          phone: phone.trim(),
          business_name: name.trim() || undefined,
          category, city: city.trim() || undefined,
        });
        setResult({ kind, outcome: r.outcome, id: r.vendor_id, name: r.owner_name, routing_handle: r.routing_handle });
      } else {
        const r = await mintCouple({
          phone: phone.trim(), name: name.trim(),
          wedding_date: wedding.trim() || undefined,
        });
        setResult({ kind, outcome: r.outcome, id: r.couple_id, name: r.owner_name, routing_handle: null });
      }
      if (onMinted) onMinted();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create the account.');
    } finally {
      setBusy(false);
    }
  }

  async function welcomeTap() {
    if (!result || !result.id) return;
    setWelcomeBusy(true);
    try {
      const r = await sendWelcome(result.id);
      // NEVER "sent" unless the server said sent. The refusal message is the
      // server's own words — this screen does not compose a second one, because
      // two authors for one sentence is how a screen starts disagreeing with the
      // transport that produced it.
      setWelcomeOutcome(r.sent ? 'sent' : 'refused');
      setWelcomeMsg(r.sent
        ? `Sent to ${result.name || 'this vendor'} on WhatsApp.`
        : (r.message || 'Could not send the welcome message.'));
    } catch {
      setWelcomeOutcome('refused');
      setWelcomeMsg('Could not send the welcome message.');
    } finally {
      setWelcomeBusy(false);
    }
  }

  const title = kind === 'vendor' ? 'New vendor' : 'New couple';

  return (
    <BottomSheet visible={visible} title={title} onClose={() => { reset(); onClose(); }}>
      {/* ── §0.2 · THE BUTTON THE FOUNDER COULD NOT SEE (A-4) ─────────────────
          `BottomSheet` ends with `paddingBottom: calc(env(safe-area-inset-bottom)
          + 28px)`. The mobile domain bar (app/admin/layout.tsx, `#m-domains`) is
          `position:fixed; bottom:0` and stands ~60px tall plus its own safe-area
          inset — more than twice the sheet's reserve. So the last control in the
          sheet lands UNDERNEATH the bar on a real handset, which is exactly where
          the primary action was.
          DERIVED, AND ONE THING NOT DERIVED: the arithmetic above is certain. What
          I could NOT witness from this container is whether z-index also plays a
          part — the sheet is z-301 and the bar z-195, so the sheet should paint
          over it, yet the founder's frame shows the bar on top, which implies an
          ancestor stacking context capping the sheet. Reserving the bar's height
          cures the founder's symptom under EITHER cause, and is the right shape
          regardless: a primary action should never sit over a nav bar even when it
          paints above one. The stacking question is filed, not guessed at.
          FIXED HERE, NOT IN BottomSheet: that component is shared by other admin
          screens whose content is short, and widening a shared component to cure
          one caller's overflow is a change nobody ruled. */}
      {!result ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}>
          <FieldInput
            label="Phone" value={phone} onChange={setPhone}
            placeholder="+91…" type="tel"
            hint="A phone with no existing TDW account."
          />
          {kind === 'vendor' ? (
            <>
              <FieldInput label="Business name" value={name} onChange={setName} placeholder="Make Up by …" />
              <FieldSelect
                label="Category" value={category} onChange={setCat}
                options={CATEGORIES.map(c => ({ value: c, label: c }))}
              />
              <FieldInput label="City" value={city} onChange={setCity} placeholder="Delhi" />
            </>
          ) : (
            <>
              {/* ONE name field, and the label says what it stores. `couples.partner_name`
                  is NOT written here: `captureField` refuses it by name, and giving the
                  admin plane a second writer for a column one module deliberately guards
                  is an architecture choice nobody ruled. Declared in the handover. */}
              <FieldInput label="Names" value={name} onChange={setName} placeholder="Priya &amp; Arjun" />
              <FieldInput label="Wedding date" value={wedding} onChange={setWedding} placeholder="2027-02-14" />
            </>
          )}

          {error && (
            <p style={{
              fontFamily: '"Jost", sans-serif', fontSize: 12, lineHeight: 1.5,
              color: 'var(--admin-critical)', margin: '10px 0 0',
            }}>{error}</p>
          )}

          {/* ── §0.2 · THE CTA WAS ROSE, AND MY OWN GATE COULD NOT SEE IT ────────
              This read `<GoldBtn …>`. `AdminUI`'s `T.gold` is `#C44058` — the ROSE
              that CE-199 retired from the rebuilt set on the founder's word
              (「 GOld ratified/. 」). So a NEW P3 surface rendered a rose primary
              button on the espresso ground, and the hex-zero cell passed, because
              the literal lives one import away in a file this bench does not read.
              A gate that only inspects the file it was pointed at cannot see a
              colour arriving through a component — the CE-115 clause-2 shape, one
              layer up. The bench now walks the imports too.
              Founder-witnessed on his own handset before any cell caught it. */}
          <div style={{ marginTop: 18 }}>
            <button
              onClick={submit}
              disabled={busy}
              style={{
                width: '100%', minHeight: 48, padding: '14px 22px',
                background: busy ? 'var(--admin-metal-wash)' : 'var(--admin-metal)',
                border: 'none', borderRadius: 10,
                fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: 10,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: busy ? 'var(--admin-ink-mute)' : 'var(--admin-shell)',
                cursor: busy ? 'not-allowed' : 'pointer',
              }}
            >{busy ? 'Working…' : (kind === 'vendor' ? 'Create vendor' : 'Create couple')}</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}>
          {/* ── F-10.47 · TWO CARD VARIANTS, BECAUSE THERE ARE TWO OUTCOMES ─────
              The retired handler answered `{created:true}` for both, and on a
              collision it also renamed the person it had not created. The card
              now says which happened, in the founder's own words. */}
          <div style={{
            padding: '16px 18px',
            background: 'var(--admin-card-bg)',
            border: '0.5px solid var(--admin-card-border)',
            borderLeft: `2px solid ${result.outcome === 'created' ? 'var(--admin-positive)' : 'var(--admin-caution)'}`,
            borderRadius: 10,
          }}>
            <div style={{
              fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: 9,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: result.outcome === 'created' ? 'var(--admin-positive)' : 'var(--admin-caution)',
              marginBottom: 8,
            }}>
              {result.outcome === 'created'
                ? (result.kind === 'vendor' ? 'Vendor created' : 'Couple created')
                : 'Already on TDW'}
            </div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 15,
              color: 'var(--admin-ink)', marginBottom: 6,
            }}>{result.name || phone}</div>
            <div style={{
              fontFamily: '"Jost", sans-serif', fontSize: 12, lineHeight: 1.6,
              color: 'var(--admin-ink-soft)',
            }}>
              {result.outcome === 'created'
                ? (result.kind === 'vendor'
                    // MECHANISM NAMED (F-06.85): this sentence is true because
                    // `routing_handle` is written by `src/agent/onboarding.js` at the
                    // END of conversational onboarding, never at provision. If a
                    // sitting ever mints the handle earlier, this byte is wrong and
                    // must be re-vetoed.
                    ? 'Handle is minted when they finish onboarding on WhatsApp.'
                    : 'They can sign in with this number whenever they like.')
                : 'This number already had an account. Nothing was overwritten.'}
            </div>
            {result.routing_handle && (
              <div style={{
                fontFamily: '"Jost", sans-serif', fontSize: 12, letterSpacing: '0.16em',
                color: 'var(--admin-metal)', marginTop: 10,
              }}>{result.routing_handle}</div>
            )}
          </div>

          {result.kind === 'vendor' && result.id && (
            <div>
              <GhostBtn
                label={welcomeBusy ? 'Sending…' : 'Send welcome'}
                onClick={welcomeTap}
                disabled={welcomeBusy}
              />
              {/* THE DARK GATE, RENDERED BEFORE THE TAP. The button is NOT hidden and
                  NOT disabled: the refusal is the proof the gate works, and a founder
                  who taps it gets the transport's own sentence back. `sendWa`'s
                  isApproved check is the mechanism; this line only reports it. */}
              {/* BEFORE the tap: the server's standing verdict, in muted ink and
                  with no eyebrow. It is a NOTICE, not a result. */}
              {welcome && !welcome.approved && !welcomeOutcome && (
                <p style={{
                  fontFamily: '"Jost", sans-serif', fontSize: 11, lineHeight: 1.6,
                  color: 'var(--admin-ink-mute)', margin: '10px 0 0',
                }}>Welcome template is not approved by Meta yet.</p>
              )}
              {/* AFTER the tap: a RESULT — eyebrow, colour, and a sentence that
                  names what happened. It cannot be mistaken for the notice above,
                  which is the entire point of the cure. */}
              {welcomeOutcome && (
                <div style={{
                  marginTop: 12, paddingLeft: 12,
                  borderLeft: `2px solid ${welcomeOutcome === 'sent' ? 'var(--admin-positive)' : 'var(--admin-caution)'}`,
                }}>
                  <div style={{
                    fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: 9,
                    letterSpacing: '0.28em', textTransform: 'uppercase',
                    color: welcomeOutcome === 'sent' ? 'var(--admin-positive)' : 'var(--admin-caution)',
                    marginBottom: 5,
                  }}>{welcomeOutcome === 'sent' ? 'Sent' : 'Not sent'}</div>
                  <p style={{
                    fontFamily: '"Jost", sans-serif', fontSize: 11, lineHeight: 1.6,
                    color: 'var(--admin-ink-soft)', margin: 0,
                  }}>{welcomeMsg}</p>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <GhostBtn label="Add another" onClick={reset} small />
            <GhostBtn label="Done" onClick={() => { reset(); onClose(); }} small />
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
