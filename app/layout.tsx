import type { Metadata } from 'next';
import { Italiana, Cormorant_Garamond, DM_Sans, Jost } from 'next/font/google';
import './globals.css';
import './globals-v2.css';
import { ServiceWorkerRegistrar } from '@/components/vendor/ServiceWorkerRegistrar';

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
  description: "India's First Wedding OS",
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
        <link rel="manifest" href="/manifest.json" />
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
  var isFrost=path.indexOf('/frost')===0||path.indexOf('/coplanner')===0||path.indexOf('/circle')===0;
  var isVendor=path.indexOf('/vendor')===0;
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
    if(vt==='light'){
      document.documentElement.classList.add('theme-light');
      bg=VENDOR_LIGHT;
    }
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
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
