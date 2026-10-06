// lib/website/copy.ts · CE-47 · WEB-6 · b172 · EVERY WORD THE WEBSITE CUSTOMISER DRAWS.
//
// One file, so the veto table is read from here and a word changes in one place. R-45.30: plain and literal. R-45.20: no
// prose about "her", no "couple". No long dash. No persona name in chrome. Clock times are 12-hour, lower case ("7:00 pm");
// months are written out. The room's word for testimonials is KIND and nothing else spells it (item 9, with the founder:
// "Kind words" or "Client reviews"); the public section's heading is WEB-5's and changes with it.

/** THE ONE KEY for the room's name for testimonials. */
export const KIND = 'Client reviews';

const n = (x: number) => x.toLocaleString('en-IN');

export const WEB = {
  // the room
  phone: 'Phone', desktop: 'Desktop',
  pending: (c: number) => (c === 1 ? '1 change is not on the website yet.' : `${n(c)} changes are not on the website yet.`),
  publish: 'Publish',
  publishedAt: (t: string) => `Published at ${t}. The website is up to date.`,
  // WEB-8 C2 (CE-47): the site's pages are kept up to about ten minutes after a Publish; for that time the room says so
  publishedFresh: 'Published. Visitors will see your new website within about 10 minutes.',
  notOnline: 'Visitors still see today’s page. The new website goes up at the first Publish.',
  gDesign: 'Design', gContent: 'Content', gResults: 'Results', gAddr: 'Address and Google',
  style: 'Style',
  styleD: (name: string, held: number, of: number) => (of >= 6 ? `${name} is in use. All 6 can be used.` : `${name} is in use. ${held} of ${of} styles chosen.`),
  stamp: 'Colours and type',
  sections: 'Sections', sectionsD: (shown: number, hidden: number) => (hidden ? `${shown} shown, ${hidden} hidden` : `${shown} shown`),
  looks: (items: string) => items,
  looksD: (live: number, drafts: number) => `${n(live)} published, ${n(drafts)} ${drafts === 1 ? 'draft' : 'drafts'}`,
  firstLook: (item: string) => `Add the first ${item}`,
  firstLookD: 'The pictures marked TDW are examples and are never published.',
  kind: KIND, kindWaiting: (c: number) => (c ? `${n(c)} waiting for approval` : 'None waiting'), kindNone: 'None yet',
  ig: 'Build from Instagram', igD: 'Makes looks from Instagram posts.', soon: 'Coming soon',
  visitors: 'Visitors', visitorsD: (c: number) => `${n(c)} visits in the last 7 days`, visitorsNew: 'Counted once the new website is up',
  prices: 'Prices on the website', pricesOn: 'Shown', pricesOff: 'Not shown',
  fix: 'What to fix', fixD: (c: number) => (c ? `${n(c)} open` : 'Nothing open'),
  addr: 'Your address', seo: 'SEO: found on Google',
  newCover: 'Until photographs are added, the cover shows the studio name in the style’s own type.',
  back: 'Your website',

  // pending, publish, discard
  pendT: 'Changes not on the website yet',
  discard: 'Discard these changes',
  discardT: (c: number) => (c === 1 ? 'Discard 1 change?' : `Discard ${n(c)} changes?`),
  discardD: 'The website stays as it is now.', discardGo: 'Discard', keep: 'Keep them',
  pubT: (c: number) => (c === 1 ? 'Publish 1 change?' : `Publish ${n(c)} changes?`),
  pubD: (addr: string) => `The website at ${addr} changes for every visitor within about 10 minutes.`,   // WEB-8 C2 r2 (CE-47): matches the line after Publish
  newPubT: 'Put the new website up?',
  newPubD: (addr: string) => `Publish puts the new website at ${addr} in place of today’s page. Example pictures are never published.`,
  cancel: 'Cancel',
  failed: 'That did not save. Nothing was changed. Try again.',

  // style
  styleNote: (of: number) => (of >= 6 ? 'Prestige: all 6 styles can be used.' : `${of === 2 ? 'Essential' : 'Signature'}: ${of} styles of the 6 can be chosen. The style in use is the one visitors see.`),
  inUse: 'In use', use: 'Use', chosen: 'Chosen', choose: 'Choose', allSix: 'All 6 can be chosen on Prestige.',
  swapT: (name: string) => `Which style should ${name} replace?`,
  swapInUse: (name: string) => `${name} is in use, so it is not offered here.`,
  swapKept: 'Colours, type and sections set for the replaced style are kept, and come back if it is chosen again.',
  replace: 'Replace',
  pickT: (of: number) => `Choose ${of} styles`, pickD: (of: number) => `Any ${of} of the 6. They can be changed later.`,
  pickGo: (c: number) => `Use these ${c}`,

  // colours and type
  pal: 'Palette', palD: (style: string) => `Three palettes made for ${style}.`,
  ownAccent: 'Own accent colour', ownAccentD: 'One colour of your own in place of the palette’s accent.', ownAccentClear: 'Use the palette’s accent',
  adjusted: 'One colour was adjusted',
  adjustedD: (dir: 'darker' | 'lighter', before: string, after: string) => `The accent was made ${dir} so text on it can be read. Before ${before} to 1, now ${after} to 1. The hue is the same.`,
  type: 'Type', typeD: (style: string) => `The pairs made for ${style}.`,
  motion: 'Motion', motionIds: { calm: 'Calm', lively: 'Lively', cinematic: 'Cinematic' } as Record<string, string>,
  motionD: { calm: 'Slower, soft fades, no parallax.', lively: 'The style as designed.', cinematic: 'Slower reveals, deeper parallax.' } as Record<string, string>,
  corners: 'Corners', buttons: 'Buttons', texture: 'Texture', textureNone: (style: string) => `${style} has no texture.`,
  mono: 'Monogram', monoD: 'Shown in the header when the full name does not fit. Up to 3 letters.',
  cover: 'Cover', coverIds: { slideshow: 'Slideshow', still: 'Still' } as Record<string, string>,
  coverD: { slideshow: 'Up to 3 photographs, changing on their own.', still: 'One photograph.' } as Record<string, string>,

  // sections
  secNote: 'Drag to reorder, or use the arrows. The cover stays first and the footer stays last.',
  secNoteFull: 'Drag to reorder, or use the arrows.',
  alwaysFirst: 'Always first', alwaysLast: 'Always last', layout: 'Layout',
  addSection: '+ Add a section', addPage: '+ Add a page', onPrestige: 'On Prestige', onSignature: 'On Signature',
  credit: 'TDW credit in the footer', creditLocked: 'Can be switched off on Prestige.',
  creditOpen: 'Shows Made with The Dream Wedding in the footer. Switch off to remove it.',
  up: 'Move up', down: 'Move down', show: 'Show on the website',
  sectionName: {
    cover: 'Cover', looks: 'Looks', collections: 'Collections', band: 'Feature band', reviews: KIND, pricing: 'Pricing',
    studio: 'The studio', journal: 'Journal', faq: 'Questions', enquire: 'Footer',
  } as Record<string, string>,

  // looks
  newLook: '+ New look', untitled: 'New look', published: 'Published', drafts: 'Drafts',
  lookState: { live: 'Live', draft: 'Draft', waiting_for_photos: 'Waiting for photos' } as Record<string, string>,
  examples: 'Pictures marked TDW are examples. They are shown only here, never on the website, and are replaced once photographs are added.',
  collections: 'Collections', addColl: '+ Add a collection', collLooks: (c: number) => (c === 1 ? '1 look' : `${n(c)} looks`),
  from: (p: string) => `From ${p}`,
  // the look editor
  photos: 'Photographs', addPhotos: '+ Add from phone', removePhoto: 'Remove',
  photoState: { waiting: 'Waiting for approval', approved: 'Approved', not_approved: 'Not approved' } as Record<string, string>,
  uploading: 'Adding the photograph…',
  photoCover: 'Cover of the look', photoN: (i: number) => `Photograph ${i}`,
  focal: 'Tap the photograph to set the point that always stays in view.',
  lookTitle: 'Title', category: 'Category', included: 'What’s included', addLine: '+ Add a line',
  credits: 'Credits', creditsD: 'The name as it should appear under the look.', addCredit: '+ Add a credit', creditRole: 'Role', creditName: 'Name',
  fromPrice: 'From price', fromPriceD: 'Written as it should appear, for example Rs 45,000.',
  linkPkg: 'Linked package', noPkg: 'None', inColl: 'Collection', noColl: 'None', status: 'Status', draft: 'Draft',
  save: 'Save',
  saveRule: 'A look saves on its own. While it is published, Save changes it on the website at once; a draft stays off the website.',
  pendingRule: 'Changes to style, colours, type and sections wait here until Publish.',
  deleteLook: 'Delete this look',
  deleteT: (name: string) => `Delete ${name}?`,
  deleteD: 'The look and its photographs leave the website now. A deleted look cannot be brought back.',
  deleteGo: 'Delete',

  // kind words
  ask: `Ask for ${KIND.toLowerCase()}`, askD: 'A link for one client. The client writes the words and can add a video link.',
  copyText: 'The message to send, with the link in it:',
  oldRows: 'Written before client links',
  oldRowsD: 'These were not sent by a client through a link, so they cannot be shown. Delete them.',
  deleteRow: 'Delete', deleteRowT: 'Delete these words?', deleteRowD: 'They are removed from the room. They were never on the website.',
  clientName: 'Client name', makeLink: 'Make the link', copy: 'Copy', copied: 'Copied',
  linkNote: 'The link works once and ends after 30 days.',
  sendTdw: 'Send by TDW on WhatsApp',
  waiting: 'Waiting for approval', approve: 'Approve', hide: 'Hide',
  noEdit: 'Words are shown exactly as the client wrote them. They cannot be edited.',
  onSite: 'On the website', hidden: 'Hidden',

  // visitors
  days7: '7 days', days28: '28 days',
  v1: (a: number, d: number) => `In the last ${d} days, ${n(a)} ${a === 1 ? 'person' : 'people'} visited the website.`,
  vViews: (v: number) => `The pages were opened ${n(v)} times.`,
  vSources: (s: Array<[string, number]>) => {
    const named = s.filter(([k, c]) => k !== 'direct' && c > 0).sort((x, y) => y[1] - x[1]);
    const direct = s.find(([k]) => k === 'direct');
    const parts = named.map(([k, v]) => `${SRC[k] || k} (${n(v)})`);
    const head = parts.length ? `Most came from ${parts[0]}${parts.length > 1 ? `, then ${parts.slice(1).join(', then ')}` : ''}.` : '';
    return `${head}${direct && direct[1] ? ` ${n(direct[1])} came directly.` : ''}`.trim();
  },
  vTop: (title: string, c: number) => `The most opened look was ${title}, opened ${n(c)} times.`,
  vSaved: (c: number, title: string, t: number) => `Visitors saved looks ${n(c)} times. The most saved was ${title}, saved ${n(t)} times.`,
  vSavesLocked: 'Which looks visitors save shows on Prestige.',
  vSourcesLocked: 'Where visitors come from shows on Signature.',
  vLocked: 'How many people visit the website shows on Essential.',

  // prices
  showPrices: 'Show prices on the website',
  pOff: 'Off: packages show their names and what is included, with Ask for a quote. No price appears anywhere on the website.',
  pOn: 'On: the starting price and each package’s price are shown.',
  pNow: 'This switch works at once. It is not one of the changes waiting for Publish.',
  pSep: 'This setting covers the website only. Share approximate prices in chat covers chat replies and is set separately in Settings.',
  pChat: 'Share approximate prices in chat', on: 'On', off: 'Off', open: 'Open',

  // what to fix (WEB-4's card)
  fixBelowStart: 'This package costs less than your starting price, so its price is not shown on your site.',

  // Basic
  basicD: 'The one-page website: photographs, the starting price when prices are shown, and an enquiry button.',
  essAdds: 'What Essential adds',
  essList: ['2 styles of the 6, with their colours and type', 'Looks, each on its own page', `${KIND} from clients, approved before they show`, 'How many people visit the website'],
  seePlans: 'See plans',
};

const SRC: Record<string, string> = { instagram: 'Instagram', google: 'Google', facebook: 'Facebook', whatsapp: 'WhatsApp', direct: 'Direct', other: 'Other' };

/** The names she sees for WEB-4's finish ids (FINISH, dream-os src/lib/site/styles.js at a0bfe02); every id it can send is named. */
export const FINISH_NAME: Record<string, string> = {
  square: 'Square', rounded: 'Rounded', arch: 'Arched', postcard: 'Postcard',
  solid_ink: 'Solid', outline: 'Outline', gold_outline: 'Gold outline', gold_solid: 'Gold', hairline: 'Hairline', vermilion_framed: 'Framed',
  glow: 'Glow', solid: 'Solid', glass: 'Glass', text_link: 'Text link', round_arrow: 'Round arrow',
  clean: 'Clean', grain: 'Film grain', paper: 'Paper', sunlight: 'Moving sunlight',
};
/** The names she sees for the eight approved pairs (design system Day 1 §3). */
export const PAIR_NAME: Record<string, [string, string]> = {
  bodoni_inter_tight: ['Bodoni Moda', 'Inter Tight'], cormorant_manrope: ['Cormorant Garamond', 'Manrope'], italiana_jost: ['Italiana', 'Jost'],
  marcellus_mulish: ['Marcellus', 'Mulish'], fraunces_jakarta: ['Fraunces', 'Plus Jakarta Sans'], instrument_serif_sans: ['Instrument Serif', 'Instrument Sans'],
  gilda_figtree: ['Gilda Display', 'Figtree'], cormorant_figtree: ['Cormorant Garamond', 'Figtree'],
};
export const SOURCE_NAME = SRC;

/** 12-hour, lower case, no leading zero: "7:00 pm" (the founder, 30 September). */
export function clock(d: Date): string {
  const h = d.getHours(); const m = d.getMinutes();
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
}
/** A month written out: "February 2026". */
export function monthYear(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso); if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}
