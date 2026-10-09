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
  publishedAt: (t: string) => `Your changes were published at ${t}. The website is up to date.`,
  // WEB-8 C2 (CE-47): the site's pages are kept up to about ten minutes after a Publish; for that time the room says so
  publishedFresh: 'Your changes are published. Visitors will see the new website within about 10 minutes.',
  notOnline: 'Visitors still see today’s page. The new website replaces it when you tap Publish for the first time.',
  gDesign: 'Design', gContent: 'Content', gResults: 'Results', gAddr: 'Address and Google',
  style: 'Style',
  styleD: (name: string, held: number, of: number) => (of >= 6 ? `${name} is in use. Your plan can use all 6 styles.` : of === 1 ? `${name} is in use.` : `${name} is in use. You have chosen ${held} of your ${of} styles.`),
  // WEB-8 (CE-47, Basic's one free style; the chair's accepted words, 6 October 2026; four lines reworded with the founder's yes, 9 October, R-47.1)
  availableOn: (plan: string) => `This is available on the ${plan} plan.`,
  basicOneAtATime: (plan: string) => `The Basic plan has one style at a time. The ${plan} plan lets you have more than one.`,
  useInstead: 'Use this style instead',
  clockEvery: 'You can change your style once every 30 days.',
  clockChanged: (on: string, next: string) => `You changed your style on ${on}. You can change it again on ${next}.`,
  clockAgain: (next: string) => `You can change your style again on ${next}.`,
  addrBasic: (addr: string, plan: string) => `Your website is at ${addr}. Your own domain is available on the ${plan} plan.`,
  stamp: 'Colours and type',
  sections: 'Sections', sectionsD: (shown: number, hidden: number) => `${shown === 1 ? '1 section is' : `${shown} sections are`} shown${hidden ? `, and ${hidden === 1 ? '1 is' : `${hidden} are`} hidden` : ''}.`,
  looks: (items: string) => items,
  looksD: (live: number, drafts: number) => `${live === 1 ? '1 look is' : `${n(live)} looks are`} published, and ${drafts === 1 ? '1 is a draft' : `${n(drafts)} are drafts`}.`,
  firstLook: (item: string) => `Add the first ${item}`,
  firstLookD: 'The pictures marked TDW are examples and are never published.',
  kind: KIND, kindWaiting: (c: number) => (c === 1 ? '1 review is waiting for your approval.' : c ? `${n(c)} reviews are waiting for your approval.` : 'No reviews are waiting for your approval.'), kindNone: 'You have no client reviews yet.',
  ig: 'Build from Instagram', igD: 'This builds looks from your Instagram posts.', soon: 'Coming soon',
  visitors: 'Visitors', visitorsD: (c: number) => `The website had ${c === 1 ? '1 visit' : `${n(c)} visits`} in the last 7 days.`, visitorsNew: 'Visits are counted after the new website is published.',
  prices: 'Prices on the website', pricesOn: 'Prices are shown.', pricesOff: 'Prices are not shown.',
  fix: 'What to fix', fixD: (c: number) => (c === 1 ? '1 problem needs fixing.' : c ? `${n(c)} problems need fixing.` : 'Nothing needs fixing.'),
  addr: 'Your address', seo: 'SEO: found on Google',
  newCover: 'Until photographs are added, the cover shows the studio name in the style’s own type.',
  back: 'Your website',

  // pending, publish, discard
  pendT: 'These changes are not on the website yet.',
  discard: 'Discard these changes',
  discardT: (c: number) => (c === 1 ? 'Discard 1 change?' : `Discard ${n(c)} changes?`),
  discardD: 'The website stays as it is now.', discardGo: 'Discard', keep: 'Keep them',
  pubT: (c: number) => (c === 1 ? 'Publish 1 change?' : `Publish ${n(c)} changes?`),
  pubD: (addr: string) => `The website at ${addr} changes for every visitor within about 10 minutes.`,   // WEB-8 C2 r2 (CE-47): matches the line after Publish
  newPubT: 'Publish the new website?',
  newPubD: (addr: string) => `Publishing replaces today’s page at ${addr} with the new website. Example pictures are never published.`,
  cancel: 'Cancel',
  failed: 'Your change was not saved. Nothing was changed. Please try again.',

  // style
  styleNote: (of: number) => (of >= 6 ? 'On the Prestige plan, you can use all 6 styles.' : `On the ${of === 2 ? 'Essential' : 'Signature'} plan, you can choose ${of} of the 6 styles. Visitors see the style that is in use.`),
  inUse: 'In use', use: 'Use', chosen: 'Chosen', choose: 'Choose', allSix: 'All 6 styles can be chosen on the Prestige plan.',
  swapT: (name: string) => `Which style should ${name} replace?`,
  swapInUse: (name: string) => `${name} is in use, so it is not offered here.`,
  swapKept: 'The colours, type and sections of the replaced style are kept. They come back if you choose that style again.',
  replace: 'Replace',
  pickT: (of: number) => `Choose ${of} styles`, pickD: (of: number) => `You can choose any ${of} of the 6 styles. You can change them later.`,
  pickGo: (c: number) => `Use these ${c}`,

  // colours and type
  pal: 'Palette', palD: (style: string) => `${style} has three palettes made for it.`,
  ownAccent: 'Own accent colour', ownAccentD: 'You can use one colour of your own in place of the palette’s accent colour.', ownAccentClear: 'Use the palette’s accent',
  adjusted: 'One colour was adjusted',
  adjustedD: (dir: 'darker' | 'lighter', before: string, after: string) => `TDW made your accent colour ${dir} so that text on it is easy to read. Its contrast was ${before} to 1 and is now ${after} to 1. The colour itself is the same.`,
  type: 'Type', typeD: (style: string) => `These are the type pairs made for ${style}.`,
  motion: 'Motion', motionIds: { calm: 'Calm', lively: 'Lively', cinematic: 'Cinematic' } as Record<string, string>,
  motionD: { calm: 'Pictures fade in slowly and softly. All parts of the page move together as visitors scroll.', lively: 'The style moves as it was designed to move.', cinematic: 'Pictures appear more slowly. Parts of the page move at different speeds as visitors scroll.' } as Record<string, string>,
  corners: 'Corners', buttons: 'Buttons', texture: 'Texture', textureNone: (style: string) => `${style} has no texture.`,
  mono: 'Monogram', monoD: 'The monogram is shown in the header when your full name does not fit. It can have up to 3 letters.',
  cover: 'Cover', coverIds: { slideshow: 'Slideshow', still: 'Still' } as Record<string, string>,
  coverD: { slideshow: 'The cover shows up to 3 photographs, and they change on their own.', still: 'The cover shows one photograph.' } as Record<string, string>,

  // sections
  secNote: 'Drag a section, or use its arrows, to change the order. The cover always stays first, and the footer always stays last.',
  secNoteFull: 'Drag a section, or use its arrows, to change the order.',
  alwaysFirst: 'Always first', alwaysLast: 'Always last', layout: 'Layout',
  addSection: '+ Add a section', addPage: '+ Add a page', onPrestige: 'On Prestige', onSignature: 'On Signature',
  credit: 'TDW credit in the footer', creditLocked: 'You can switch this off on the Prestige plan.',
  creditOpen: 'The footer shows the words Made with The Dream Wedding. Switch this off to remove them.',
  up: 'Move up', down: 'Move down', show: 'Show on the website',
  sectionName: {
    cover: 'Cover', looks: 'Looks', collections: 'Collections', band: 'Feature band', reviews: KIND, pricing: 'Pricing',
    studio: 'The studio', journal: 'Journal', faq: 'Questions', enquire: 'Footer',
  } as Record<string, string>,

  // looks
  newLook: '+ New look', untitled: 'New look', published: 'Published', drafts: 'Drafts',
  lookState: { live: 'Live', draft: 'Draft', waiting_for_photos: 'Waiting for photos' } as Record<string, string>,
  examples: 'Pictures marked TDW are examples. They are shown only here and never on the website. Your own photographs replace them when you add them.',
  collections: 'Collections', addColl: '+ Add a collection', collLooks: (c: number) => (c === 1 ? '1 look' : `${n(c)} looks`),
  from: (p: string) => `From ${p}`,
  // the look editor
  photos: 'Photographs', addPhotos: '+ Add from phone', removePhoto: 'Remove',
  // R-47.2 (WEB-4 cut 30): a look photo is 'shown' or 'held'. A shown photo has no line; a held one has the founder's line
  // (approved word for word, 8 October 2026), which the server also sends as the photo's notice.
  photoHeld: 'TDW is checking this picture. It is not shown yet.',
  uploading: 'The photograph is being added…',
  photoCover: 'Cover of the look', photoN: (i: number) => `Photograph ${i}`,
  focal: 'Tap the photograph to set the point that always stays in view.',
  lookTitle: 'Title', category: 'Category', included: 'What’s included', addLine: '+ Add a line',
  credits: 'Credits', creditsD: 'Write each name as it should appear under the look.', addCredit: '+ Add a credit', creditRole: 'Role', creditName: 'Name',
  fromPrice: 'From price', fromPriceD: 'Write the price as it should appear, for example Rs 45,000.',
  linkPkg: 'Linked package', noPkg: 'None', inColl: 'Collection', noColl: 'None', status: 'Status', draft: 'Draft',
  save: 'Save',
  saveRule: 'A look saves on its own. When a look is published, Save changes it on the website at once. A draft look stays off the website.',
  pendingRule: 'Changes to the style, colours, type and sections wait here until you tap Publish.',
  deleteLook: 'Delete this look',
  deleteT: (name: string) => `Delete ${name}?`,
  deleteD: 'The look and its photographs are removed from the website at once. A deleted look cannot be brought back.',
  deleteGo: 'Delete',

  // kind words
  ask: `Ask for ${KIND.toLowerCase()}`, askD: 'A link for one client. The client writes the words and can add a video link.',
  copyText: 'The message to send, with the link in it:',
  oldRows: 'Reviews written before client links',
  oldRowsD: 'These reviews were not sent by a client through a link, so they cannot be shown. Please delete them.',
  deleteRow: 'Delete', deleteRowT: 'Delete this review?', deleteRowD: 'The review is removed from this page. It was never on the website.',
  clientName: 'Client name', makeLink: 'Make the link', copy: 'Copy', copied: 'Copied',
  linkNote: 'The link can be used once. It stops working after 30 days.',
  sendTdw: 'Send by TDW on WhatsApp',
  waiting: 'Waiting for approval', approve: 'Approve', hide: 'Hide',
  noEdit: 'Reviews are shown exactly as the client wrote them. They cannot be edited.',
  onSite: 'On the website', hidden: 'Hidden',

  // visitors
  days7: '7 days', days28: '28 days',
  v1: (a: number, d: number) => `In the last ${d} days, ${n(a)} ${a === 1 ? 'person' : 'people'} visited the website.`,
  vViews: (v: number) => `The pages were opened ${n(v)} times.`,
  vSources: (s: Array<[string, number]>) => {
    const named = s.filter(([k, c]) => k !== 'direct' && c > 0).sort((x, y) => y[1] - x[1]);
    const direct = s.find(([k]) => k === 'direct');
    const parts = named.map(([k, v]) => `${SRC[k] || k} (${n(v)})`);
    const head = parts.length ? `Most visitors came from ${parts[0]}${parts.length > 1 ? `, then ${parts.slice(1).join(', then ')}` : ''}.` : '';
    return `${head}${direct && direct[1] ? ` ${direct[1] === 1 ? '1 visitor' : `${n(direct[1])} visitors`} came directly.` : ''}`.trim();
  },
  vTop: (title: string, c: number) => `The most opened look was ${title}, opened ${n(c)} times.`,
  vSaved: (c: number, title: string, t: number) => `Visitors saved looks ${n(c)} times. The most saved was ${title}, saved ${n(t)} times.`,
  vSavesLocked: 'The Prestige plan shows which looks visitors save.',
  vSourcesLocked: 'The Signature plan shows where visitors come from.',
  vLocked: 'The Essential plan shows how many people visit the website.',

  // prices
  showPrices: 'Show prices on the website',
  pOff: 'When this is off, packages show their names and what is included, with an Ask for a quote button. No price appears anywhere on the website.',
  pOn: 'When this is on, the website shows your starting price and the price of each package.',
  pNow: 'This switch works at once. It is not one of the changes waiting for Publish.',
  pSep: 'This setting covers the website only. The setting Share approximate prices in chat covers chat replies. You change that setting in Settings.',
  pChat: 'Share approximate prices in chat', on: 'On', off: 'Off', open: 'Open',

  // what to fix (WEB-4's card)
  fixBelowStart: 'This package costs less than your starting price, so its price is not shown on your site.',

  // Basic
  basicD: 'The Basic website is one page. It shows your photographs and an enquiry button. It also shows your starting price when prices are switched on.',
  essAdds: 'What Essential adds',
  essList: ['You can use 2 of the 6 styles, with their colours and type.', 'Each look gets its own page.', 'Clients can send reviews, and you approve each one before it shows.', 'You can see how many people visit the website.'],
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
