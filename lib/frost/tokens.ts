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
    soft:            'rgba(245,229,220,0.65)',
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
export function daysUntil(target: Date): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const t = new Date(target); t.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((t.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
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
