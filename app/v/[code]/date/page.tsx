import type { Metadata } from 'next';
import { PUBLIC_MISS, PUBLIC_ENQUIRE_LABEL, PUBLIC_COLOPHON_LEAD, PUBLIC_DATE_CHECK, publicBackTo } from '@/lib/public/copy';

/**
 * app/v/[code]/date/page.tsx — THE ANSWER. TDW_19 G3.1, R-G31.3.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY THIS IS ITS OWN ADDRESS AND NOT `?d=` ON THE CARD
 * ═══════════════════════════════════════════════════════════════════════════
 * The read-first named three arms and refused to pick. The card leaf exports
 * `revalidate = 300`, bought deliberately so a couple arriving from a WhatsApp
 * forward on mobile data gets the storefront from the edge. **Reading
 * `searchParams` on that route makes the whole thing dynamic** and spends that
 * cache for every visitor, including the overwhelming majority who never check
 * a date. R-G31.3 ruled arm (b): the answer gets its own leaf, and the card is
 * untouched.
 *
 * ⚠ NO `revalidate` HERE, AND THAT IS NOT AN OMISSION. This page is an answer
 * about a calendar as it is right now. `fetch` is uncached by default from Next
 * 15 onward — derived from `package.json` (`next: 16.2.3`), the same derivation
 * the wedding leaf states — so the door is called per request. On Next 14 the
 * absence would have meant `force-cache` and a date answer cached forever,
 * which is the opposite of the intent; the version is why the absence is safe.
 *
 * ── NO SCRIPT, AND ONE CONSEQUENCE STATED RATHER THAN DISCOVERED ───────────
 * R-G12.10 keeps JavaScript off the public lane, so the form is a plain GET and
 * there is no pending state. A guest taps `Check` and the page sits still until
 * the next paint. That is F-40.108's shape and it is UNCLOSEABLE under the same
 * ruling — named here so a walk does not read it as a defect.
 *
 * ── WHAT NEVER APPEARS ON THIS PAGE ───────────────────────────────────────
 * A client's name, a title, a slot, the shape of the day, a phone number
 * (R-G11.6). The door sends three booleans; this renders one word from
 * `lib/public/copy.ts` and nothing it could infer beyond it.
 */

export const dynamic = 'force-dynamic';

/**
 * ⚠ `themeColor` IS DECLARED HERE, and F-40.167 is why it is not assumed.
 * The root layout's static meta is the app's near-black and only its inline
 * script rewrites it per lane — which runs after first paint. A public leaf
 * that declares nothing therefore serves app chrome to a stranger for the
 * length of one paint. The card leaf has always declared it; the wedding leaf
 * did not, and shipped that flash since G1.1. R-40.83's C38 walk now asserts
 * this per leaf rather than for two files it was told about.
 */
export const viewport = {
  themeColor: '#F8F7F5',
  colorScheme: 'light' as const,
};

/**
 * ⚠ `noindex`, ALWAYS AND ON EVERY BRANCH. This page is one couple's question
 * about one date. Indexed, it would put a vendor's occupancy for a named day
 * into a search engine's cache, outliving both the answer and the switch that
 * permitted it — and R-40.77's consent is to a door a guest opens, not to a
 * permanent public record. The card leaf's `noindex`-on-a-miss reasoning, with
 * the branch removed: there is no state in which this page should be indexed.
 */
export const metadata: Metadata = {
  title: PUBLIC_DATE_CHECK.label,
  robots: { index: false, follow: false },
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';

type Answer = {
  ok: boolean;
  date: string;
  blocked: boolean | null;
  sold: boolean;
  any_held: boolean;
  occupancy: 'on' | 'off';
};

type CardLite = { business_name: string | null; enquire_link: string | null };

async function fetchAnswer(code: string, date: string): Promise<Answer | null> {
  try {
    const r = await fetch(
      `${API_BASE}/api/v2/public/availability/${encodeURIComponent(code)}/${encodeURIComponent(date)}`,
    );
    if (!r.ok) return null;
    const j = await r.json();
    return j && j.ok ? (j as Answer) : null;
  } catch {
    return null;
  }
}

/**
 * Her name and her door, for the two controls at the foot. A failure here is not
 * a miss: the ANSWER is the page, and losing it because a second read hiccuped
 * would trade the thing the guest asked for. Both controls simply degrade.
 */
async function fetchCard(code: string): Promise<CardLite | null> {
  try {
    const r = await fetch(`${API_BASE}/api/v2/public/vendor-card/${encodeURIComponent(code)}`);
    if (!r.ok) return null;
    const j = await r.json();
    return j && j.ok && j.card ? (j.card as CardLite) : null;
  } catch {
    return null;
  }
}

/**
 * R-G31.1, and the ONLY place these four are chosen. `sold` and `any_held` are
 * the door's own arithmetic (`verdictOf`) — this function does not recompute
 * them, because R-G31.1's second limb has one home and it is not here.
 */
function wordFor(a: Answer): { word: string; note: string | null; failed: boolean } {
  if (a.blocked === null) return { word: PUBLIC_DATE_CHECK.unknown, note: null, failed: true };
  if (a.blocked === true || a.sold) return { word: PUBLIC_DATE_CHECK.booked, note: PUBLIC_DATE_CHECK.bookedNote, failed: false };
  if (a.any_held) return { word: PUBLIC_DATE_CHECK.held, note: PUBLIC_DATE_CHECK.heldNote, failed: false };
  return { word: PUBLIC_DATE_CHECK.free, note: PUBLIC_DATE_CHECK.freeNote, failed: false };
}

/**
 * The date, as a person writes it. `en-GB` gives `4 December 2026` — day first,
 * no ordinal, no comma — which is how the date was typed into the field and how
 * it is said aloud in the market this serves. UTC because the string is a
 * calendar date with no zone; parsing it locally would render 3 December for
 * anyone west of Greenwich.
 */
function humanDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export default async function PublicDateCheckPage(
  { params, searchParams }: {
    params: Promise<{ code: string }>;
    searchParams: Promise<{ d?: string }>;
  },
) {
  const { code } = await params;
  const q = await searchParams;
  const date = typeof q.d === 'string' ? q.d : '';

  // No date, or a shape the door would refuse anyway: the miss sentence, on the
  // same ground as a real answer. Not a 404 and not a form — a stranger who
  // reached here without a date has nothing to correct.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return (
      <main className="pv">
        <p className="pv-line">{PUBLIC_MISS}</p>
        <DateStyles />
      </main>
    );
  }

  const [answer, card] = await Promise.all([fetchAnswer(code, date), fetchCard(code)]);

  // ⚠ A DOOR THAT REFUSED IS THE MISS SENTENCE, NOT A GUESS. The door answers a
  // 404 for absent, paused, switch-off and wrong-trade alike — five states, one
  // body — and this page must not tell them apart either. It especially must not
  // fall through to `Free`.
  if (!answer) {
    return (
      <main className="pv">
        <p className="pv-line">{PUBLIC_MISS}</p>
        <DateStyles />
      </main>
    );
  }

  const { word, note, failed } = wordFor(answer);
  const wa = card?.enquire_link ?? null;

  return (
    <main className="pv pv-card">
      <div className="pv-top">
        <span className="pv-top-name">{(card?.business_name ?? '').toUpperCase()}</span>
      </div>

      <div className="pv-ans">
        <span className="pv-anslbl">{PUBLIC_DATE_CHECK.label}</span>
        <p className="pv-ansdate">{humanDate(answer.date)}</p>

        {/* C6 · the four words share one slot in MEANING and two in TYPE. The
            three answers take the display face at the size her NAME takes on the
            storefront; the failure takes the body face, because it is not an
            answer and dressing it as one makes a guest parse the sentence before
            she knows what kind of thing it is. */}
        {failed
          ? <p className="pv-ansfail">{word}</p>
          : <p className="pv-answord">{word}</p>}

        {note && <p className="pv-ansnote">{note}</p>}

        <div className="pv-ansacts">
          {/* C4 · NO ENQUIRE DOOR UNDER A FAILURE. She asked a question and got
              nothing back; a button here would be this estate converting its own
              fault into a lead. */}
          {!failed && wa && (
            <a className="pv-cta" href={wa} target="_blank" rel="noopener noreferrer">
              {PUBLIC_ENQUIRE_LABEL}
            </a>
          )}
          <a className="pv-back" href={`/v/${encodeURIComponent(code)}`}>
            {publicBackTo(card?.business_name ?? null)}
          </a>
        </div>
      </div>

      <footer className="pv-close">
        <span className="pv-colophon">
          {PUBLIC_COLOPHON_LEAD}{' '}
          <a className="pv-colophon-link" href="https://thedreamwedding.in" target="_blank" rel="noopener noreferrer">thedreamwedding.in</a>
        </span>
      </footer>

      <DateStyles />
    </main>
  );
}

/**
 * ⚠ THE GROUND IS THE CARD'S, TRANSCRIBED, AND THE DUPLICATION IS DELIBERATE.
 * The card leaf's `PublicStyles` is a function inside that file carrying its
 * gallery's generated index rules, and importing it would drag a stylesheet
 * built for a photograph stack onto a page with no photographs. What is copied
 * is the GROUND ONLY — the same cream, the same ink, the same masthead — so a
 * guest cannot feel she left the page she came from.
 *
 * ⚠ AND `:root{color-scheme:light}` IS HERE FOR THE REASON C38 STATES: the
 * viewport export alone reads well and does not reach the cascade, because a
 * meta tag is not a CSS property and `getComputedStyle` returns `normal` —
 * which is exactly the state Chrome's auto-dark inverts. Two homes, one intent,
 * and the one that does the work is this one.
 */
function DateStyles() {
  return (
    <style>{`
:root{color-scheme:light}
.pv{min-height:100vh;background:#F8F7F5;color:#0C0A09;
  font:400 14px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
.pv:not(.pv-card){display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;padding:32px 24px;text-align:center}
.pv-card{max-width:430px;margin:0 auto;padding:0 0 8px}
.pv-line{font-weight:400;font-size:14px;line-height:1.45;color:#403B36;margin:0;max-width:34ch}
.pv-top{height:40px;display:flex;align-items:center;justify-content:center;
  padding:0 24px;background:#F8F7F5;border-bottom:.5px solid rgba(12,10,9,.07)}
.pv-top-name{font:300 11px/1 "Cormorant Garamond",Georgia,serif;color:#403B36;
  letter-spacing:.08em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pv-ans{padding:34px 24px 0}
.pv-anslbl{font:300 9px/1 "Jost",system-ui,sans-serif;letter-spacing:.22em;text-transform:uppercase;
  color:rgba(12,10,9,.55);display:block}
.pv-ansdate{font-weight:400;font-size:14px;line-height:1.45;color:#403B36;margin:8px 0 0;
  font-variant-numeric:lining-nums tabular-nums}
.pv-answord{font:300 28px/1.15 "Cormorant Garamond",Georgia,serif;color:#0C0A09;
  letter-spacing:-.01em;margin:26px 0 0;max-width:20ch}
.pv-ansfail{font-weight:400;font-size:15px;line-height:1.5;color:#403B36;margin:26px 0 0;max-width:30ch}
.pv-ansnote{font-weight:400;font-size:13px;line-height:1.55;color:#6B6560;margin:12px 0 0;max-width:32ch}
.pv-ansacts{margin-top:30px;padding-top:18px;border-top:.5px solid rgba(12,10,9,.14);
  display:flex;flex-direction:column;gap:14px;align-items:flex-start}
.pv-cta{display:inline-flex;align-items:center;min-height:44px;padding:12px 22px;
  border:.5px solid #C9A84C;border-radius:2px;color:#7A621C;text-decoration:none;
  font:300 10px/1 "Jost",system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase}
.pv-cta:active{background:#F2EFE9}
.pv-cta:focus-visible{outline:2px solid #C9A84C;outline-offset:2px}
.pv-back{font-weight:400;font-size:13px;line-height:1.4;color:#6B6560;
  text-decoration:underline;text-underline-offset:3px;min-height:44px;display:inline-flex;align-items:center}
.pv-close{margin-top:40px;padding:0 24px 32px;text-align:center;
  display:flex;flex-direction:column;gap:9px}
.pv-colophon{font-weight:400;font-size:9px;line-height:1.4;color:#6B6560}
.pv-colophon-link{color:#6B6560;text-decoration:underline;text-underline-offset:2px}
`}</style>
  );
}
