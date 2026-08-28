import type { Metadata } from 'next';
import { Italiana, Cormorant_Garamond, DM_Sans, Jost } from 'next/font/google';
import './globals.css';
import './globals-v2.css';

// ── Atelier typography stack ─────────────────────────────────────────────────
//   Italiana           — display: numerals, month names, glyphs (C L I ◐ ×)
//   Cormorant Garamond — script:  italic captions, greeting line, detail rows
//   DM Sans            — body:    subtitles, meta, chat prose
//   Jost               — label:   micro-labels, eyebrows, nav labels

const italiana = Italiana({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-italiana',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Dream Wedding',
  description: 'The Wedding OS',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${italiana.variable} ${cormorant.variable} ${dmSans.variable} ${jost.variable}`}
    >
      <head>
        {/* Fraunces + JetBrains Mono + Italianno — Frost/Sanctuary only (not vendor) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,300;1,9..144,400&family=Italianno&family=JetBrains+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
        {/* M-WORKLIST branch only — R-37.42: the branch PWA installs as its own app beside
            the real one, so it advertises its own manifest. Production main keeps
            /manifest.json; this line is one of exactly two edits this arc makes to a
            pre-existing file, and it never travels to main. */}
        <link rel="manifest" href="/worklist-manifest.json" />
        <meta name="theme-color" content="#1E0A0E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TDW" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
        {/* Pre-hydration theme — prevents dark↔light flash before React paints */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
  var path=location.pathname||'';
  var FROST_DARK='#1E0A0E', FROST_LIGHT='#F0EEE8';
  var VENDOR_LIGHT='#F5F2EE';
  var LANDING_BG='#0C0A09';
  var isFrost=path.indexOf('/frost')===0||path.indexOf('/coplanner')===0||path.indexOf('/circle')===0;
  var isVendor=path.indexOf('/vendor')===0;
  var isAdmin=path.indexOf('/admin')===0;
  var isLanding=path==='/'||path.indexOf('/discover')===0||path.indexOf('/about')===0;
  var bg=null;
  if(isFrost){
    var stored=null, manual=null;
    try{stored=localStorage.getItem('@frost.home_mode');}catch(e){}
    try{manual=localStorage.getItem('@frost.home_mode_manual');}catch(e){}
    var mode;
    if(stored==='E3'||stored==='E1A'){mode=stored;}
    else if(!manual){var h=new Date().getHours();mode=(h<7||h>=19)?'E1A':'E3';}
    else{mode='E1A';}
    bg=(mode==='E3')?FROST_LIGHT:FROST_DARK;
  } else if(isVendor){
    var vt=null;
    try{vt=localStorage.getItem('dreamai_theme');}catch(e){}
    // TDW_09 R-U19: the retired theme migrates HERE TOO, and first — this script
    // runs before React and would otherwise paint a navy page for one frame on
    // every launch before the provider corrected it. Rewritten in storage so the
    // migration fires once per device.
    if(vt==='flair'){ try{localStorage.setItem('dreamai_theme','dark');}catch(e){} vt='dark'; }
    if(vt==='light'){
      document.documentElement.classList.add('theme-light');
      bg=VENDOR_LIGHT;
    }
  } else if(isAdmin){
    bg='#18293E';
  } else if(isLanding){
    // TDW_09 O-1 - R-O7 (F-09.39(b), R-T6). The public landing stands on #0C0A09 and
    // wore Frost's Wine Night in the browser chrome, because none of the three branches
    // above matches the root path. The cure is a landing BRANCH, deliberately NOT a
    // change to the static default on the theme-color meta tag: that default is what
    // four other lanes inherit (demo, circle, crew, privacy) and this sitting charters
    // one lane.
    //
    // NAMED GAP, FILED NOT CURED - F-09.41: the demo lane still inherits #1E0A0E while
    // its pinned-dark page is #1F1612. Pre-existing, outside this charter's radius,
    // homed to the demo lane's next touch.
    //
    // NOTE FOR ANYONE EDITING THIS COMMENT: it lives inside a template literal. A
    // backtick, or a dollar sign followed by a brace, breaks the build from inside a
    // comment. tsc caught exactly that on this comment's first two drafts.
    bg=LANDING_BG;
  }
  if(bg){
    document.documentElement.style.background=bg;
    if(document.body){document.body.style.background=bg;}
    var tc=document.querySelector('meta[name="theme-color"]');
    if(tc){tc.setAttribute('content',bg);}
  }
}catch(e){}})();`,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
