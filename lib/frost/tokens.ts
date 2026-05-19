// lib/frost/tokens.ts
// ─────────────────────────────────────────────────────────────────────────────
// Frost design system for the Next.js PWA. Single source of truth.
// Ported verbatim from:
//   tdw-2/constants/frost.ts
//   tdw-2/constants/museTokens.ts
//
// Two tone axes:
//   homeMode: 'E1A' (dark, warm-night) | 'E3' (light, warm paper)
//   contentMode: 'dream' (photos + inspiration) | 'sanctuary' (quiet planner)
//
// These persist in localStorage under the same keys as native AsyncStorage
// so a bride who's used the native app gets the same mode on web.
// ─────────────────────────────────────────────────────────────────────────────

export type HomeModeKey  = 'E1A' | 'E3';
export type ContentMode  = 'dream' | 'sanctuary';
export type MuseLook     = 'E1' | 'E3';

// localStorage keys — match native AsyncStorage keys exactly
export const MODE_STORAGE_KEY         = '@frost.home_mode';
export const CONTENT_MODE_STORAGE_KEY = '@frost.content_mode';

// ─── Mode descriptors ────────────────────────────────────────────────────────
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
    pagePaper:       '#1B1612',
    cardFill:        '#1B1612',
    stampFill:       '#1F1915',
    hairline:        'rgba(191,160,77,0.18)',
    hairlineStrong:  'rgba(191,160,77,0.22)',
    ink:             '#F5F0E8',
    soft:            'rgba(245,240,232,0.62)',
    brass:           '#BFA04D',
    brassMuted:      '#A8924B',
    heroGradient:    ['#1B1612', '#231D17'],
    dreamGradient:   ['#1F1915', '#1A1410'],
    circleGradient:  ['#1A1410', '#15110E'],
    museGradient:    ['#15110E', '#13100D'],
    momentsGradient: ['#13100D', '#110E0B'],
    pagesGradient:   ['#110E0B', '#100C0A'],
    journeyGradient: ['#15110E', '#100C0A'],
    statusBarStyle:  'light-content',
  },
  E3: {
    pagePaper:       '#D8D3CC',
    cardFill:        '#D8D3CC',
    stampFill:       '#C8C2BA',
    hairline:        'rgba(44,40,35,0.12)',
    hairlineStrong:  'rgba(44,40,35,0.18)',
    ink:             '#2C2823',
    soft:            '#5A5650',
    brass:           '#BFA04D',
    brassMuted:      '#A8924B',
    heroGradient:    ['#D8D3CC', '#CFC9C1'],
    dreamGradient:   ['#C8C2BA', '#BBB5AC'],
    circleGradient:  ['#BCB6AD', '#B0AAA1'],
    museGradient:    ['#B0AAA1', '#ACA69D'],
    momentsGradient: ['#ACA69D', '#A8A29A'],
    pagesGradient:   ['#A8A29A', '#A09A91'],
    journeyGradient: ['#A8A29A', '#948E86'],
    statusBarStyle:  'dark-content',
  },
};

// ─── MUSE_LOOKS — Muse/Journey canvas tokens ─────────────────────────────────
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
    pagePaper:           '#1B1612',
    cardFill:            '#2D2620',
    stampFill:           '#2D2620',
    hairline:            'rgba(191,160,77,0.18)',
    ink:                 '#F5F0E8',
    soft:                'rgba(245,240,232,0.62)',
    brass:               '#BFA04D',
    brassMuted:          '#A8924B',
    pillSecondaryBg:     'rgba(245,240,232,0.06)',
    pillSecondaryBorder: 'rgba(191,160,77,0.32)',
    pillSecondaryText:   'rgba(245,240,232,0.92)',
    closeColor:          'rgba(245,240,232,0.8)',
    scrimGradient:       ['rgba(15,12,10,0)', 'rgba(15,12,10,0.78)'],
    tileAspect:          1.18,
    statusBarStyle:      'light-content',
  },
  E3: {
    pagePaper:           '#D8D3CC',
    cardFill:            '#C8C2BA',
    stampFill:           '#C8C2BA',
    hairline:            'rgba(44,40,35,0.12)',
    ink:                 '#2C2823',
    soft:                '#5A5650',
    brass:               '#BFA04D',
    brassMuted:          '#A8924B',
    pillSecondaryBg:     'transparent',
    pillSecondaryBorder: 'rgba(44,40,35,0.22)',
    pillSecondaryText:   '#2C2823',
    closeColor:          '#5A5650',
    scrimGradient:       ['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)'],
    tileAspect:          1.08,
    statusBarStyle:      'dark-content',
  },
};

// Map homeMode → MuseLook (E1A → E1, everything else → E3)
export function museLookFromHomeMode(homeMode: HomeModeKey): MuseLook {
  return homeMode === 'E1A' ? 'E1' : 'E3';
}

// ─── FrostedSurface CSS values ───────────────────────────────────────────────
// Web translation of FrostedSurface component.
// backdrop-filter is the CSS equivalent of expo-blur BlurView.
export const FROST_SURFACE = {
  button: {
    backdropFilter:       'blur(14px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
    background:           'rgba(255,253,248,0.18)',
    border:               '0.5px solid rgba(191,160,77,0.18)',
  },
  buttonDark: {
    backdropFilter:       'blur(14px) saturate(1.2)',
    WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
    background:           'rgba(255,253,248,0.08)',
    border:               '0.5px solid rgba(191,160,77,0.18)',
  },
  composer: {
    backdropFilter:       'blur(20px) saturate(1.6)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
    background:           'rgba(28,24,20,0.22)',
    border:               '0.5px solid rgba(168,146,75,0.30)',
  },
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────
export const FF = {
  display: "'Cormorant Garamond', serif",
  body:    "'DM Sans', sans-serif",
  label:   "'Jost', sans-serif",
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const SP = {
  xs:   4,
  s:    8,
  m:    12,
  l:    16,
  xl:   20,
  xxl:  24,
  huge: 48,
} as const;

// ─── Radius ──────────────────────────────────────────────────────────────────
export const FR = {
  box:  12,
  md:   10,
  sm:   6,
  pill: 100,
} as const;

export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// ─── Copy ────────────────────────────────────────────────────────────────────
export const FROST_COPY = {
  landing: {
    daysWord: 'days',
  },
  journeyCanvas: {
    eyebrow: 'Your wedding',
    title:   'Journey',
    sub:     'Everything you need, in one place.',
  },
  discoverCanvas: {
    blindSwipeEyebrow: 'Blind discovery',
  },
  dreamCanvas: {
    inputPlaceholder: 'Tell DreamAi anything…',
  },
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

// ─── Session helpers ─────────────────────────────────────────────────────────
export function getFrostMode(): HomeModeKey {
  if (typeof window === 'undefined') return 'E3';
  try {
    const stored = localStorage.getItem(MODE_STORAGE_KEY);
    return stored === 'E1A' ? 'E1A' : 'E3';
  } catch { return 'E3'; }
}

export function getContentMode(): ContentMode {
  if (typeof window === 'undefined') return 'dream';
  try {
    const stored = localStorage.getItem(CONTENT_MODE_STORAGE_KEY);
    return stored === 'sanctuary' ? 'sanctuary' : 'dream';
  } catch { return 'dream'; }
}

export function setFrostMode(m: HomeModeKey) {
  try { localStorage.setItem(MODE_STORAGE_KEY, m); } catch {}
}

export function setContentMode(c: ContentMode) {
  try { localStorage.setItem(CONTENT_MODE_STORAGE_KEY, c); } catch {}
}

export function getCoupleIdForFrost(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s?.coupleId || s?.id || null;
  } catch { return null; }
}

// Date helpers
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
