// v2/lib/vendor/startCopy.ts · CE-47 · FE-9 · THE TWO-MINUTE START's WORDS, in one home (every line approved by the chair
// for the founder, 4 to 6 Oct 2026; R-45.30). The build's step lines are NOT here: they are the server's, shown verbatim.
export const START = {
  setting: 'Setting up', building: 'Building', ready: 'Ready', of: (n: number) => `${n} of 8`,
  // S2 (approved 5 Oct 2026; no step count, as S5 to S10)
  // THE FOUNDER'S RULE (8 Oct 2026): Instagram is one way in, not the only way. The two choices' words: the founder's,
  // approved 8 Oct 2026. The title and sub line: working words, with the plain-descriptions pass below.
  // PLAIN DESCRIPTIONS (the founder, 8 Oct 2026): every line read as a first-time vendor would read it once; the lines
  // rewritten are marked PLAIN, each with its old line in the handover.
  connectHead: 'Build your business from your photos',
  connectSub: 'Connect your Instagram or add your own photos. TDW then builds your website from your photos and writes your first packages. Nothing goes live until you check it and say yes.',
  connectRows: ['TDW builds your website from your photos.', 'TDW writes your first packages for you.', 'Nothing is published until you say yes.'],
  connect: 'Connect Instagram', noInstagram: 'Add my own photos',
  // S2 after Instagram sent her back without a connection (?ig=cancelled or ?ig=failed): Q1 RULED (7 Oct 2026), no B2 screen;
  // we cannot know the account is personal, so we never say it. One card: this line, then B2's approved sentence unchanged.
  igCancelled: 'Instagram did not connect. You can try again, or you can add your own photos instead.',
  igPersonal: 'Instagram connects only professional accounts, which are business accounts and creator accounts. If your account is personal, you can switch it to a professional account for free in Instagram\u2019s settings.',
  // B1 (approved 5 Oct 2026); the upload lines are the Portfolio room's own (COPY.F2_1, COPY.B3)
  phoneHead: 'Add your photos', phoneSub: 'Choose photos of your work from your phone. Six or more photos make a good website.',
  phoneSmall: 'TDW writes your first packages from the kind of work you do. The prices stay empty until you add them.',   // R-47.1
  choose: 'Choose from your phone', withPhotos: (n: number) => `Continue with ${n} photos`,
  withNone: 'Continue without photos',   // Q2 (b) RULED, 7 Oct 2026
  uploading: (i: number, n: number) => `TDW is uploading photo ${i} of ${n}.`, uploadFailed: 'The photo did not upload. Please try again.',
  // S4
  buildHead: 'Building your business',
  buildSub: 'This takes about two minutes. You can leave this screen while TDW builds. Your business will be here when you come back.',
  longSub: 'This is taking longer than usual. TDW keeps building while you continue.',   // S4c (the chair, 6 Oct 2026)
  // WEB-4's contract: the website filled again from her portfolio (S4 and the Home card). The founder's words, approved
  // 8 Oct 2026.
  fillLine: 'Your portfolio has photos that your website draft does not use yet.', fillGo: 'Use my photos on my website',
  doneHead: 'Your business is ready to check', doneSub: 'Nothing is published until you say yes.',
  failSub: 'TDW could not finish one part. The rest is ready for you to check.',
  stepName: { photos: 'Your photos', website: 'Your website', packages: 'Your packages', storefront: 'Your storefront', eliza: 'Eliza' } as const,
  cont: 'Continue', home: 'Go to Home',
  // the old form's done screen, kept EXACTLY for a vendor with no build (G-b; b183 1.3 and obp 5b.3b pin it)
  brand: 'The Dream Wedding', doneTitle: (first: string) => `You\u2019re all set, ${first}.`, doneLine: 'Share your TDW link. Clients message you there.',
  linkLabel: 'Your TDW link', copy: 'Copy', copied: 'Copied', open: 'Open your studio',
  // S5 (labels are today's form's own)
  detailsHead: 'Check your details', detailsSub: 'TDW needs these details to set up your storefront.',
  name: 'Your name', business: 'Studio or business name', craft: 'What you do', city: 'Based in',
  price: 'Your starting price, in Rs', priceHelp: (rs: string) => `Your storefront shows this as From Rs ${rs}. You can change it at any time.`,
  area: 'Where you work', cities: 'Which cities', addCity: 'Add a city',
  // S6
  styleHead: 'Pick your website style', styleSub: 'All three styles use your photos. Your plan includes the one style that you pick.',
  inDraft: 'In use',   // R-47.1, the chair: a tag is a name
  swipe: 'Swipe to see all three styles.', use: (name: string) => `Use ${name}`,
  // S7
  pkgHead: 'Your packages', pkgSub: 'TDW wrote your first packages from the kind of work you do. Until you add a price, your website shows Price on request.',   // R-47.1
 
  onRequest: 'Price on request', mainPkg: 'Main package', tapPkg: 'Tap a package to add a price.', pkgOk: 'These look right',
  // S8
  photosHead: 'Your photos', photosSub: (n: number) => `TDW added ${n} photos from your Instagram. Untick any photo that you do not want on your website.`,
  photosOk: 'Use these photos',
  // S9 (IG.consent's words with WhatsApp named; P1 and P2 as ruled)
  elizaHead: 'Eliza on WhatsApp', elizaSub: 'Eliza is TDW\u2019s assistant. She can answer people who message your WhatsApp, in your studio\u2019s name.',   // PLAIN
  whenOn: 'What Eliza does when she is on',
  whenOnText: 'When someone messages your WhatsApp, Eliza replies in your studio\u2019s name within minutes. She answers their question, checks whether your date is free, takes their details and adds them to your enquiries.',   // PLAIN
  never: 'What Eliza never does', neverText: 'Eliza never confirms a booking and never quotes a price you have not set. You can switch her off at any time.',   // PLAIN
  offMeans: 'Off means Eliza does not reply. You answer your messages yourself.',   // PLAIN
  waiting: 'Eliza is not answering yet. She starts when TDW switches her on. TDW has saved your choice.',
  on: 'On', off: 'Off', notNow: 'Not now', anyTime: 'You can turn Eliza on later, on the WhatsApp and Instagram page.',   // R-47.1
 
  // S10
  readyHead: 'Your website is ready', goesLive: (addr: string) => `It goes live at ${addr} when you publish it.`,
  draftIn: (style: string) => `Your website uses the ${style} style.`,   // R-47.1
  pkgsSaved: (n: number) => `TDW saved ${n} packages.`,
  photosOn: (n: number) => `Your website shows ${n} photos.`,
  elizaOn: 'Eliza answers your WhatsApp messages.', elizaOff: 'Eliza does not answer your WhatsApp messages.', elizaWaiting: 'Eliza starts when TDW switches her on.',
  publish: 'Publish my website', notYet: 'Not yet, go to Home',
  // S11 (Home)
  cardHead: 'Your business is ready to check',
  cardLine: 'Your website draft, packages and photos are ready. Nothing is published until you say yes.', cardGo: 'Check it',
  // plain failures (the screens' own; a server refusal is shown in its own words instead)
  noConnect: 'TDW could not connect. Please try again.',
} as const;
export const STYLES = [
  { key: 'gallery', name: 'Gallery', line: 'Gallery shows your photographs one at a time on a plain background.' },
  { key: 'noir', name: 'Noir', line: 'Noir uses dark pages with gold accents, so your photographs stand out.' },
  { key: 'couture', name: 'Couture', line: 'Couture uses ivory pages, large photographs and fine type, like a fashion magazine.' },
] as const;
