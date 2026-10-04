// lib/site/enquirePanelBoot.ts · TDW · CE-47 · WEB-7 · how WEB-5's server-drawn page takes the enquiry panel.
//
// The page puts two things in its HTML, after the cover:
//   1. panelCardJson(card) inside <script type="application/json" id="tdw-site-card">…</script>
//   2. PANEL_BOOT as an inline <script> at the end of <body>.
// PANEL_BOOT waits for the load event, then for two animation frames (a frame has been painted), then for an idle moment, and only then adds the panel's CSS and script. The
// first paint never waits on the panel; b170 proves it (the panel's files are not requested before `load`).
// Entry points on the page: any element with data-enquire opens the panel; a look's WhatsApp link carries
// data-look-request="<look title>"; a look page marks its title with data-look-title="<look title>".

export type PanelCard = {
  code: string;                         // the vendor's public code (vendor-card's key)
  handle: string;
  studio_name: string;
  monogram?: string;
  category: string | null;              // from WEB-4's card
  date_check_enabled: boolean;
  eliza: { live_booking: 'not_in_plan' | 'coming_soon' | 'on'; own_voice: 'not_in_plan' | 'coming_soon' | 'on' };
  enquire_link: string | null;          // the card's link, never built by hand
  page?: { kind: 'home' | 'look' | 'collection' | 'journal' | 'other'; title?: string };
  api_base?: string;
};

/** JSON safe inside a <script> element: no "</script" can close it early. */
export function panelCardJson(card: PanelCard): string {
  return JSON.stringify(card).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

export const PANEL_CSS = '/site/enquire-panel.css';
export const PANEL_JS = '/site/enquire-panel.js';

export const PANEL_BOOT =
  "(function(){function go(){var l=document.createElement('link');l.rel='stylesheet';l.href='" + PANEL_CSS + "';" +
  "document.head.appendChild(l);var s=document.createElement('script');s.src='" + PANEL_JS + "';s.async=true;" +
  "document.body.appendChild(s)}function idle(){requestAnimationFrame(function(){requestAnimationFrame(function(){" +
  "(window.requestIdleCallback||function(f){setTimeout(f,1)})(go,{timeout:2000})})})}" +
  "if(document.readyState==='complete')idle();else addEventListener('load',idle,{once:true})})();";
