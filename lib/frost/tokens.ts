// lib/frost/tokens.ts
// ─────────────────────────────────────────────────────────────────────────────
// Frost design system — V2
//
// Two complete worlds:
//   WINE NIGHT  — dark, intimate, candlelit. #1E0A0E lifted wine-black.
//   SKY & IVORY — light, airy, confident.   #F0EEE8 cool bone.
//
// The bride toggles between them. Same app. Same room. Two lights.
//
// Token families:
//   V2        — the new Frost sanctuary + bloom rooms
//   MODES     — legacy (kept for old surfaces during transition)
//   MUSE_LOOKS — legacy (kept for Muse, Surprise Me during transition)
// ─────────────────────────────────────────────────────────────────────────────

export type HomeModeKey  = 'E1A' | 'E3';
export type ContentMode  = 'dream' | 'sanctuary';
export type MuseLook     = 'E1' | 'E3';

export const MODE_STORAGE_KEY         = '@frost.home_mode';
export const CONTENT_MODE_STORAGE_KEY = '@frost.content_mode';

// ─── V2 — Wine Night & Sky Ivory ─────────────────────────────────────────────
//
// Wine Night (dark):
//   bg:       #1E0A0E — lifted wine-black. Warm enough for the red radial to glow.
//   accent:   #C4856A — terracotta-rose. The arc, the name, the rules.
//   signal:   #6B9E8F — patinated teal. Candle on Circle. Since-you-said-yes.
//   ghost:    #3A0C18 — deep rose. The numeral behind the hero.
//   ink:      #F5E5DC — warm ivory. All primary text.
//   inkSoft:  rgba(245,229,220,0.72) — secondary text.
//   inkMute:  rgba(245,229,220,0.42) — hints, dates, labels.
//   line:     rgba(196,133,106,0.14) — hairlines.
//
// Sky & Ivory (light):
//   bg:       #F0EEE8 — cool bone. Not white. Not cream. Considered.
//   accent:   #4A7A9B — slate blue. The arc, the name, the rules.
//   signal:   #8B6E52 — cognac. Candle on Circle. Since-you-said-yes.
//   ghost:    #A8C4D8 — muted sky. The numeral behind the hero.
//   ink:      #16243A — deep navy ink. All primary text.
//   inkSoft:  rgba(22,36,58,0.72) — secondary text.
//   inkMute:  rgba(22,36,58,0.42) — hints, dates, labels.
//   line:     rgba(74,122,155,0.14) — hairlines.

export interface V2Tokens {
  // surfaces
  bg:              string;
  bg2:             string;
  bgDeep:          string;
  bgRadial:        string;   // radial gradient top glow
  // glass bands
  glassBandBg:     string;
  glassBandBlur:   string;
  // ghost numeral
  ghost:           string;
  ghostOpacity:    number;
  // arc
  arc:             string;
  arcRail:         string;
  // text
  ink:             string;
  inkSoft:         string;
  inkMute:         string;
  // accent
  accent:          string;
  accentSoft:      string;   // for rules, hairlines
  // signal (candle, since-you-said-yes)
  signal:          string;
  // chrome
  pillBg:          string;
  pillBorder:      string;
  pillText:        string;
  // hairlines
  line:            string;
  lineStrong:      string;
  // journey sub
  journeyRowBg:    string;
  // bloom rooms — the surface rooms expand into
  bloomBg:         string;
  bloomBg2:        string;
  // discover — always dark, always cinematic, regardless of mode
  discoverBg:      string;
  // status bar
  statusBar:       'dark-content' | 'light-content';
}

export const V2_WINE_NIGHT: V2Tokens = {
  bg:           '#1E0A0E',
  bg2:          '#180608',
  bgDeep:       '#100404',
  bgRadial:     'radial-gradient(ellipse 110% 55% at 50% -8%, rgba(196,133,106,0.22) 0%, transparent 58%), radial-gradient(ellipse 70% 50% at 85% 110%, rgba(55,10,20,0.55) 0%, transparent 55%)',
  glassBandBg:  'rgba(30,10,14,0.65)',
  glassBandBlur:'blur(22px) saturate(1.1)',
  ghost:        '#3A0C18',
  ghostOpacity: 0.82,
  arc:          '#C4856A',
  arcRail:      'rgba(196,133,106,0.14)',
  ink:          '#F5E5DC',
  inkSoft:      'rgba(245,229,220,0.75)',
  inkMute:      'rgba(245,229,220,0.45)',
  accent:       '#C4856A',
  accentSoft:   'rgba(196,133,106,0.18)',
  signal:       '#6B9E8F',
  pillBg:       'rgba(30,10,14,0.58)',
  pillBorder:   'rgba(196,133,106,0.32)',
  pillText:     'rgba(245,229,220,0.88)',
  line:         'rgba(196,133,106,0.14)',
  lineStrong:   'rgba(196,133,106,0.22)',
  journeyRowBg: 'rgba(196,133,106,0.05)',
  bloomBg:      '#1E0A0E',
  bloomBg2:     '#180608',
  discoverBg:   '#080608',
  statusBar:    'light-content',
};

export const V2_SKY_IVORY: V2Tokens = {
  bg:           '#F0EEE8',
  bg2:          '#E8E5DE',
  bgDeep:       '#DDD9D0',
  bgRadial:     'radial-gradient(ellipse 110% 55% at 50% -8%, rgba(168,196,216,0.32) 0%, transparent 58%), radial-gradient(ellipse 70% 50% at 85% 110%, rgba(170,160,145,0.14) 0%, transparent 55%)',
  glassBandBg:  'rgba(240,238,232,0.72)',
  glassBandBlur:'blur(22px) saturate(1.1)',
  ghost:        '#A8C4D8',
  ghostOpacity: 0.22,
  arc:          '#4A7A9B',
  arcRail:      'rgba(74,122,155,0.14)',
  ink:          '#16243A',
  inkSoft:      'rgba(22,36,58,0.75)',
  inkMute:      'rgba(22,36,58,0.45)',
  accent:       '#4A7A9B',
  accentSoft:   'rgba(74,122,155,0.12)',
  signal:       '#8B6E52',
  pillBg:       'rgba(240,238,232,0.75)',
  pillBorder:   'rgba(74,122,155,0.28)',
  pillText:     'rgba(22,36,58,0.78)',
  line:         'rgba(74,122,155,0.13)',
  lineStrong:   'rgba(74,122,155,0.22)',
  journeyRowBg: 'rgba(74,122,155,0.05)',
  bloomBg:      '#F0EEE8',
  bloomBg2:     '#E8E5DE',
  discoverBg:   '#080608',
  statusBar:    'dark-content',
};

// ─── THE ATELIER LANGUAGE (TDW_09 · founder-approved at Gate 1, 2026-08-07) ───
//
// The bride canvas declared THIRTY-THREE type sizes. It declares EIGHT rungs now.
// Approved against docs/mocks/tdw09_atelier_language.html — that file is the veto
// carrier; a surface that stops matching it must report the delta, not drift.
//
// DECLARED DELTA against the mock's own token table: the table's prose said seven
// rungs and folded every Italianno size into type/room, but the mock DRAWS the
// empty-state head at 52px Italianno (class 5) and says so in its note. The drawing
// is the veto carrier, so `head` ships as an eighth rung and the "33 -> 7" sentence
// is corrected to "33 -> 8" wherever it is repeated. Reported, not silently resolved.
//
// The ENGRAVED rungs sit below the body floor BY RULING — the founder's standing
// 「 keep engraved 」 exempts the mono register from the floor exactly as it did on
// the vendor instrument at T-1. They are still normalised: seven mono steps
// (5.5/6/6.5/7/7.5/8/9) collapse to `engravedSm`, three (10/11/12) to `engraved`.
export const FT = {
  numeral:    150,  // Fraunces 700 opsz144 · the countdown. ONE per screen.
  head:        52,  // Italianno · empty-state heads, room heroes.
  greeting:    46,  // Italianno · the masthead greeting. ONE per screen.
  room:        22,  // Fraunces italic 300 · rail labels, room + sheet titles.
  lead:        19,  // Fraunces italic 300 · the one line per surface that leads.
  body:        16,  // Fraunces italic 300 · ALL body prose. THE FLOOR.
  engraved:    11,  // JetBrains Mono · actions, primary labels.
  engravedSm:   9,  // JetBrains Mono · the one permitted sub-floor rung.
} as const;

// Base 8, five steps, nothing between them. `gutter` is every surface's side margin
// (it was 0 / 18 / 20 / 24 / 28 by surface). `track` is the ONE engraved tracking
// (it was eleven values from .01em to .3em).
export const FS = {
  s1: 8, s2: 16, s3: 24, s4: 40, s5: 64,
  gutter: 24,
  hair: '0.5px',
  track: '.22em',
} as const;

// Imagery. A photograph is not a card: it takes the full measure, one portrait
// ratio, no radius. Chrome (fields, chips, avatars) may still curve — FI.chrome.
export const FI = {
  plateRatio:  '4 / 5',
  plateRadius: 0,
  chrome:      8,
  sheet:       20,
} as const;

// Helper — get V2 tokens from homeMode
export function getV2Tokens(_homeMode: HomeModeKey): V2Tokens {
  // SINGLE-THEME RULING (see getFrostMode): Wine Night unconditionally — the
  // belt beneath the braces, so even a stray direct 'E3' call renders dark.
  return V2_WINE_NIGHT;
}

// ─── Font families — single source of truth ───────────────────────────────────
export const FF = {
  // New V2 fonts
  italianno:  "'Italianno', cursive",                           // greeting only
  fraunces:   "'Fraunces', 'Cormorant Garamond', serif",       // number + prose
  mono:       "'JetBrains Mono', ui-monospace, monospace",     // all micro-labels
  // Legacy fonts (kept for old surfaces)
  display:    "'Cormorant Garamond', serif",
  body:       "'DM Sans', sans-serif",
  label:      "'Jost', sans-serif",
  aubade:     "'Fraunces', 'Cormorant Garamond', serif",
} as const;

// ─── Animation easing ─────────────────────────────────────────────────────────
export const EASE    = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const SP = { xs:4, s:8, m:12, l:16, xl:20, xxl:24, huge:48 } as const;
export const FR = { box:12, md:10, sm:6, pill:100 } as const;

// ─── Legacy MODES (kept for old surfaces) ────────────────────────────────────
export interface ModeDescriptor {
  pagePaper:        string;
  cardFill:         string;
  stampFill:        string;
  hairline:         string;
  hairlineStrong:   string;
  ink:              string;
  soft:             string;
  brass:            string;
  brassMuted:       string;
  heroGradient:     [string, string];
  dreamGradient:    [string, string];
  circleGradient:   [string, string];
  journeyGradient:  [string, string];
  museGradient:     [string, string];
  momentsGradient:  [string, string];
  pagesGradient:    [string, string];
  statusBarStyle:   'dark-content' | 'light-content';
}

export const MODES: Record<HomeModeKey, ModeDescriptor> = {
  E1A: {
    pagePaper:       '#1E0A0E',
    cardFill:        '#1E0A0E',
    stampFill:       '#240E12',
    hairline:        'rgba(196,133,106,0.14)',
    hairlineStrong:  'rgba(196,133,106,0.22)',
    ink:             '#F5E5DC',
    // F-09.159 (TDW_09 atelier, chair-ruled): was 0.65a. CanvasShell paints its page
    // from THIS family, not from V2 — so every standalone journey route ran a
    // secondary ink ten points darker than the canvas it returns to. One secondary
    // ink lane-wide: this is now byte-equal to V2_WINE_NIGHT.inkSoft, and a bench
    // cell pins the equality so the two cannot drift apart again silently.
    soft:            'rgba(245,229,220,0.75)',
    brass:           '#C4856A',
    brassMuted:      '#A8724E',
    heroGradient:    ['#1E0A0E', '#180608'],
    dreamGradient:   ['#1A0808', '#140606'],
    circleGradient:  ['#140606', '#100404'],
    museGradient:    ['#100404', '#0E0303'],
    momentsGradient: ['#0E0303', '#0C0202'],
    pagesGradient:   ['#0C0202', '#0A0101'],
    journeyGradient: ['#140606', '#0A0101'],
    statusBarStyle:  'light-content',
  },
  E3: {
    pagePaper:       '#F0EEE8',
    cardFill:        '#E8E5DE',
    stampFill:       '#DDD9D0',
    hairline:        'rgba(74,122,155,0.13)',
    hairlineStrong:  'rgba(74,122,155,0.22)',
    ink:             '#16243A',
    soft:            'rgba(22,36,58,0.65)',
    brass:           '#4A7A9B',
    brassMuted:      '#3D6682',
    heroGradient:    ['#F0EEE8', '#E8E5DE'],
    dreamGradient:   ['#E8E5DE', '#DDD9D0'],
    circleGradient:  ['#DDD9D0', '#D5D1C8'],
    museGradient:    ['#D5D1C8', '#CCC8BE'],
    momentsGradient: ['#CCC8BE', '#C4C0B6'],
    pagesGradient:   ['#C4C0B6', '#BDBAB0'],
    journeyGradient: ['#CCC8BE', '#B8B4AA'],
    statusBarStyle:  'dark-content',
  },
};

// ─── Legacy MUSE_LOOKS (kept for Muse, Surprise Me) ─────────────────────────
export interface MuseLookTokens {
  pagePaper:           string;
  cardFill:            string;
  stampFill:           string;
  hairline:            string;
  hairlineStrong:      string;
  ink:                 string;
  soft:                string;
  brass:               string;
  brassMuted:          string;
  pillSecondaryBg:     string;
  pillSecondaryBorder: string;
  pillSecondaryText:   string;
  closeColor:          string;
  scrimGradient:       [string, string];
  tileAspect:          number;
  statusBarStyle:      'dark-content' | 'light-content';
}

export const MUSE_LOOKS: Record<MuseLook, MuseLookTokens> = {
  E1: {
    pagePaper:           '#1E0A0E',
    cardFill:            '#2D1218',
    stampFill:           '#2D1218',
    hairline:            'rgba(196,133,106,0.14)',
    ink:                 '#F5E5DC',
    soft:                'rgba(245,229,220,0.65)',
    brass:               '#C4856A',
    brassMuted:          '#A8724E',
    pillSecondaryBg:     'rgba(245,229,220,0.06)',
    pillSecondaryBorder: 'rgba(196,133,106,0.32)',
    pillSecondaryText:   'rgba(245,229,220,0.92)',
    closeColor:          'rgba(245,229,220,0.8)',
    scrimGradient:       ['rgba(15,5,8,0)', 'rgba(15,5,8,0.78)'],
    tileAspect:          1.18,
    hairlineStrong:      'rgba(196,133,106,0.22)',
    statusBarStyle:      'light-content',
  },
  E3: {
    pagePaper:           '#F0EEE8',
    cardFill:            '#E8E5DE',
    stampFill:           '#E8E5DE',
    hairline:            'rgba(74,122,155,0.13)',
    ink:                 '#16243A',
    soft:                'rgba(22,36,58,0.65)',
    brass:               '#4A7A9B',
    brassMuted:          '#3D6682',
    pillSecondaryBg:     'transparent',
    pillSecondaryBorder: 'rgba(74,122,155,0.22)',
    pillSecondaryText:   '#16243A',
    closeColor:          'rgba(22,36,58,0.65)',
    scrimGradient:       ['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)'],
    tileAspect:          1.08,
    hairlineStrong:      'rgba(74,122,155,0.22)',
    statusBarStyle:      'dark-content',
  },
};

export function museLookFromHomeMode(_homeMode: HomeModeKey): MuseLook {
  // SINGLE-THEME RULING (see getFrostMode): the muse look follows the one theme.
  return 'E1';
}

// ─── Legacy AUBADE (kept for discover, dream) ─────────────────────────────────
export const AUBADE = {
  paper:        '#1E0A0E',
  paper2:       '#180608',
  paperDeep:    '#100404',
  ink:          '#F5E5DC',
  inkSoft:      'rgba(245,229,220,0.65)',
  inkMute:      'rgba(245,229,220,0.38)',
  line:         'rgba(196,133,106,0.14)',
  lineStrong:   'rgba(196,133,106,0.22)',
  aubade:       '#C4856A',
  aubadeDeep:   '#A8724E',
  nocturne:     '#6B9E8F',
  nocturneDeep: '#5A8A7A',
  ember:        '#C46863',
  indigo:       '#1A1A2E',
  copper:       '#C4856A',
} as const;

export const AUBADE_GLASS = {
  blur:       'blur(22px) saturate(1.1)',
  webkitBlur: 'blur(22px) saturate(1.1)',
  bg:         'rgba(30,10,14,0.62)',
} as const;

// ─── FROST_SURFACE (legacy glass surface tokens) ─────────────────────────────
export const FROST_SURFACE = {
  button: {
    backdropFilter:       'blur(14px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
    background:           'rgba(255,253,248,0.18)',
    border:               '0.5px solid rgba(196,133,106,0.18)',
  },
  buttonDark: {
    backdropFilter:       'blur(14px) saturate(1.2)',
    WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
    background:           'rgba(255,253,248,0.08)',
    border:               '0.5px solid rgba(196,133,106,0.18)',
  },
  composer: {
    backdropFilter:       'blur(20px) saturate(1.6)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
    background:           'rgba(28,10,14,0.22)',
    border:               '0.5px solid rgba(196,133,106,0.30)',
  },
} as const;

// ─── Session helpers ──────────────────────────────────────────────────────────
export function getFrostMode(): HomeModeKey {
  // ── SINGLE THEME — FOUNDER RULING (2026-08-07, the chair's own hand) ──────
  // The bride app carries ONE theme for now: Wine Night ('E1A'). Sky & Ivory is
  // RETIRED-NOT-DELETED (its token set stays below for the day a second theme
  // returns by ruling). This is the mode's ONE reader; pinning here covers every
  // consumer (layout.tsx:45 seeds context from this function). The stored key is
  // deliberately ignored, not migrated — no write happens on read.
  return 'E1A';
}

export function getContentMode(): ContentMode {
  if (typeof window === 'undefined') return 'dream';
  try {
    const stored = localStorage.getItem(CONTENT_MODE_STORAGE_KEY);
    return stored === 'sanctuary' ? 'sanctuary' : 'dream';
  } catch { return 'dream'; }
}

export function setFrostMode(_m: HomeModeKey) {
  // SINGLE-THEME RULING (see getFrostMode above): the writer is a no-op — a
  // value nothing reads must not be written, or the day the reader un-pins it
  // would resurrect a preference the vendor of this preference never re-chose.
}

export function setContentMode(c: ContentMode) {
  try { localStorage.setItem(CONTENT_MODE_STORAGE_KEY, c); } catch {}
}

export function getCoupleIdForFrost(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) {
      const s = JSON.parse(raw);
      const id = s?.coupleId || s?.id;
      if (id) return id;
    }
  } catch { /* fall through to cookie */ }
  try {
    const m = document.cookie.split('; ').find(r => r.startsWith('tdw_couple_session='));
    if (m) {
      const s = JSON.parse(decodeURIComponent(m.split('=').slice(1).join('=')));
      return s?.coupleId || s?.id || null;
    }
  } catch { /* ignore */ }
  return null;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════
// THE DAY BOUNDARY: ONE SEMANTIC, ONE HOME (pwa side) — R-35.23, F-15.17 CURED
// ═════════════════════════════════════════════════════════════════════════════
// THE RULED SEMANTIC: the estate serves THE WEDDING'S TIMEZONE, WHICH IS IST.
// `couples.wedding_date` is a bare `date` — witnessed at its column LINE in
// dream-os `docs/db/PUBLIC_SCHEMA.md`, block `## public.couples · 23 columns`,
// line `4. wedding_date date` (F-SW.9 standing: headers are untrusted, column
// LINES are the witness). A bare `date` carries no timezone, so there is no
// "her local" to serve and none to guess at: the number she wakes to counts
// mornings until an IST calendar day, wherever she happens to be standing.
//
// THE REFERENCE IMPLEMENTATION IS dream-os `src/agent/brideNudge.js` · symbol
// `buildNudge`. It has been IST-correct since it was written and it is W-1's:
// READ-ONLY by ruling, mirrored here and never folded. Its dream-os sibling of
// this cure is `src/lib/istDay.js`, banked at `2a4c320`; that file's header
// carries the same mechanism in full and is the long-form of the paragraph
// below. If the three ever disagree, `buildNudge` is right.
//
// ONE DELIBERATE DIVERGENCE FROM THE REFERENCE, so no reader files it as a
// mirroring error: `buildNudge` returns null for a wedding already past; both
// cured doors CLAMP TO 0, because that is what they have always returned and
// R-35.23 preserved it ("past-wedding clamps 0 in both, as today").
//
// ── WHAT STOOD HERE, AND WHY IT WAS WRONG (F-15.17) ─────────────────────────
// `daysUntil` flattened BOTH operands with `.setHours(0,0,0,0)` — DEVICE-LOCAL
// midnight — while the caller had built the target from a date-only string,
// which ECMAScript parses as UTC midnight:
//
//     new Date('2027-02-14')           →  2027-02-14T00:00:00Z   (UTC midnight)
//     new Date('2027-02-14T00:00:00')  →  local midnight          (host TZ)
//
// On an IST device the two happened to agree and the number was accidentally
// right. WEST OF GREENWICH IT IS NOT: UTC midnight on the 14th is the evening
// of the 13th in New York, so `.setHours(0,0,0,0)` flattened the target onto
// the PREVIOUS local day and the count silently lost a day. Three copies of
// this shape were live (this one, `app/coplanner/page.tsx`, and the zero-inbound
// `app/components/couple/TodayHero.tsx`) and a fourth, `daysUntilEvent` in the
// events bloom, is a DIFFERENT SUBJECT and correctly left alone.
//
// ── THE CURE, NAMED SO NOBODY SIMPLIFIES IT BACK ────────────────────────────
// The cure is NOT to avoid the UTC parse. It is to reduce BOTH operands to an
// IST CALENDAR-DAY KEY and then parse BOTH KEYS THE SAME WAY, so the shared UTC
// basis CANCELS in the subtraction and what survives is a pure count of days
// between two IST dates:
//
//     targetKey = istDayKey(<the wedding instant>)     'YYYY-MM-DD' in IST
//     originKey = istDayKey(new Date())                'YYYY-MM-DD' in IST
//     diff      = new Date(targetKey) − new Date(originKey)   both UTC midnight
//
// THE ANSWER THEREFORE DEPENDS ONLY ON THE WALL INSTANT, NEVER ON THE DEVICE'S
// TIMEZONE. That is the ruled semantic stated as a property, and it is the
// property the bench proves by running the same instant under several TZs.
//
// THREE "SIMPLIFICATIONS" PUT THE BUG STRAIGHT BACK, and all three have been
// written in this estate before:
//   1. Replacing an `istDayKey(...)` operand with a raw Date, or reintroducing
//      `.setHours(0,0,0,0)` on either side — that is a local midnight measured
//      against a UTC one, and the bases stop cancelling.
//   2. Appending a time to a date-only string (`value + 'T00:00:00'`) — that
//      flips one operand to local parsing and breaks the cancellation from the
//      far end.
//   3. "Optimising" `new Date(originKey)` to the `now` it was derived from.
//      The key is the point: it is what strips the clock off the instant.
//
// [F-06.85 class: the paragraph above is conditioned on a MECHANICAL fact — that
//  `couples.wedding_date` is a `date` and not a `timestamptz`. `istDayKey` takes
//  the IST calendar day of whatever instant it is handed, so a widened column
//  would keep working but would start meaning something subtly different. If
//  that column moves, re-derive this header rather than trusting it.]
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** The IST calendar day of an instant, as a 'YYYY-MM-DD' key. Null if unparseable. */
export function istDayKey(instant: Date): string | null {
  const t = instant.getTime();
  if (Number.isNaN(t)) return null;
  return new Date(t + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * MORNINGS TO GO, counted in IST calendar days — THE ONE HOME.
 *
 * Returns null when there is no usable date. An ABSENT date and a wedding that
 * has PASSED are different answers and are never conflated: absent is null (she
 * has not told us), past is 0 (it is here or behind her). R-34.22's
 * two-emptinesses discipline, one plane over.
 *
 * `Math.round` is carried from `buildNudge`. Both operands are exact UTC
 * midnights so the quotient is already integral and the rounding mode cannot
 * change the answer; it is mirrored for fidelity, not to correct anything.
 */
export function daysUntilIst(target: Date | string | null | undefined): number | null {
  if (target === null || target === undefined || target === '') return null;
  const asDate = target instanceof Date ? target : new Date(target);
  const targetKey = istDayKey(asDate);
  if (!targetKey) return null;
  const originKey = istDayKey(new Date());
  if (!originKey) return null;
  const diff = Math.round(
    (new Date(targetKey).getTime() - new Date(originKey).getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff > 0 ? diff : 0;
}

/**
 * The masthead's reader. Signature preserved byte-for-byte for its callers in
 * `app/(frost)/frost/canvas/sanctuary/page.tsx`, which pass a Date from
 * `getWeddingDate()` — either a session `wedding_date` or the `DEMO_WEDDING`
 * constant, both of which `istDayKey` reduces correctly.
 *
 * ONE BEHAVIOUR CHANGE, STATED RATHER THAN SLIPPED IN: an unparseable target
 * used to yield NaN (`Math.max(0, NaN)` is NaN) and now yields 0. It is not
 * reachable from `getWeddingDate`, which always returns a valid Date — but a
 * masthead rendering "NaN" is worse than one rendering "0", and a silent
 * improvement is still a change.
 */
export function daysUntil(target: Date): number {
  return daysUntilIst(target) ?? 0;
}

export function dayNumberToWords(n: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if (n === 0) return 'Zero';
  if (n < 20) return ones[n];
  if (n % 10 === 0) return tens[Math.floor(n / 10)];
  return tens[Math.floor(n / 10)] + '-' + ones[n % 10].toLowerCase();
}

// ─── Copy pool ────────────────────────────────────────────────────────────────
export const FROST_COPY = {
  landing: { daysWord: 'days' },
  journeyCanvas: {
    eyebrow: 'Your wedding',
    title:   'Journey',
    sub:     'Everything you need, in one place.',
  },
  discoverCanvas: { blindSwipeEyebrow: 'Blind discovery' },
  dreamCanvas:    { inputPlaceholder: 'Tell DreamAi anything…' },
  idlePool: [
    'The light in October will be the colour of old letters.',
    'A bride is not made. She arrives.',
    'Some days the counting is a comfort.',
    'Everything you love about flowers is also true of weddings.',
    'The dress does not make the bride. The bride makes the dress.',
    'Beauty is patient. Your day will come.',
    'Every detail is a small act of love.',
    'The morning of your wedding will feel like no other morning.',
    'What you plan now, you will barely remember planning.',
    'The people who matter will cry. That is how you will know.',
    'Your grandmother wore something borrowed too.',
    'The music you choose will play in your memory for decades.',
    'A wedding is a beginning, not an ending.',
    'The photographs are for your children.',
    'Some things only happen once. This is one of them.',
    'You will be nervous. That is correct.',
    'The flowers will die. The love will not.',
    'Something will go wrong. It will become the story you tell.',
    'The people watching you will see something you cannot.',
    'You are already the bride. You have been for weeks.',
    'The countdown makes time strange.',
    'Every bride thinks she is not ready. Every bride is wrong.',
    'Your florist knows something about beauty that is worth trusting.',
  ],
} as const;
