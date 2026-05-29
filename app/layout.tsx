'use client';

import './globals-v2.css';
import type { Metadata } from 'next';
import './globals.css';
import { useEffect } from 'react';

function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Cormorant + DM Sans + Jost — existing surfaces */}
        {/* Italianno — Sanctuary greeting (copperplate script) */}
        {/* Italiana — dreamai vendor display font */}
        {/* Italiana — dreamai vendor display font */}
        {/* Fraunces — countdown number + prose (variable optical size) */}
        {/* JetBrains Mono — all micro-labels, dates, hints */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,300;1,9..144,400&family=Italianno&family=JetBrains+Mono:wght@300;400&family=Jost:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E0A0E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TDW" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
        {/* Pre-hydration Frost theme — runs before React paints to prevent a
            dark↔light flash. Mirrors getFrostMode() + the time-based auto rule
            in sanctuary (dark before 7am / after 7pm when never manually set). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
  var DARK='#1E0A0E', LIGHT='#F0EEE8';
  var stored=null, manual=null;
  try{stored=localStorage.getItem('@frost.home_mode');}catch(e){}
  try{manual=localStorage.getItem('@frost.home_mode_manual');}catch(e){}
  var path=location.pathname||'';
  var isFrost=path.indexOf('/frost')===0||path.indexOf('/coplanner')===0||path.indexOf('/circle')===0;
  var bg=DARK;
  if(isFrost){
    var mode;
    if(stored==='E3'||stored==='E1A'){mode=stored;}
    else if(!manual){var h=new Date().getHours();mode=(h<7||h>=19)?'E1A':'E3';}
    else{mode='E1A';}
    bg=(mode==='E3')?LIGHT:DARK;
  }
  document.documentElement.style.background=bg;
  if(document.body){document.body.style.background=bg;}
  var tc=document.querySelector('meta[name="theme-color"]');
  if(tc){tc.setAttribute('content',bg);}
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
