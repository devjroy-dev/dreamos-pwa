// v2/lib/vendor/startCopy.ts · CE-47 · FE-9 · THE TWO-MINUTE START's WORDS, in one home (every line approved by the chair
// for the founder, 4 to 6 Oct 2026; R-45.30). The build's step lines are NOT here: they are the server's, shown verbatim.
export const START = {
  setting: 'Setting up', building: 'Building', ready: 'Ready', of: (n: number) => `${n} of 8`,
  // S4
  buildHead: 'Building your business',
  buildSub: 'About two minutes. You can leave this screen. TDW keeps building. It will be here when you come back.',
  longSub: 'This is taking longer than usual. TDW keeps building while you carry on.',   // S4c (the chair, 6 Oct 2026)
  doneHead: 'Your business is ready to check', doneSub: 'Nothing is published until you say yes.',
  failSub: 'One part could not be done. The rest is ready to check.',
  stepName: { photos: 'Your photos', website: 'Your website', packages: 'Your packages', storefront: 'Your storefront', eliza: 'Eliza' } as const,
  available: (plan: string) => `Available on ${plan}`,
  cont: 'Continue', home: 'Go to Home',
  // the old form's done screen, kept EXACTLY for a vendor with no build (G-b; b183 1.3 and obp 5b.3b pin it)
  brand: 'The Dream Wedding', doneTitle: (first: string) => `You\u2019re all set, ${first}.`, doneLine: 'Share your TDW link. Clients message you there.',
  linkLabel: 'Your TDW link', copy: 'Copy', copied: 'Copied', open: 'Open your studio',
  // S5 (labels are today's form's own)
  detailsHead: 'Check your details', detailsSub: 'We need these to set up your storefront.',
  name: 'Your name', business: 'Studio or business name', craft: 'What you do', city: 'Based in',
  price: 'Your starting price, in Rs', priceHelp: (rs: string) => `Shown on your storefront as From Rs ${rs}. You can change it any time.`,
  area: 'Where you work', cities: 'Which cities', addCity: 'Add a city',
  // S6
  styleHead: 'Pick your website style', styleSub: 'All three are made from your photos. Your plan includes the one style you pick.',
  inDraft: 'In your draft', swipe: 'Swipe to see all three', use: (name: string) => `Use ${name}`,
  // S7
  pkgHead: 'Your packages', pkgSub: 'Your packages are drafted from your craft. Your website shows Price on request until you add a price.',
  onRequest: 'Price on request', mainPkg: 'Main package', tapPkg: 'Tap a package to add a price.', pkgOk: 'These look right',
  // S8
  photosHead: 'Your photos', photosSub: (n: number) => `${n} photos from your Instagram. Untick any you do not want on your website.`,
  photosOk: 'Use these photos',
  // S9 (IG.consent's words with WhatsApp named; P1 and P2 as ruled)
  elizaHead: 'Eliza on WhatsApp', elizaSub: 'Let us answer people who message your WhatsApp, in your studio\u2019s name.',
  whenOn: 'When it is on',
  whenOnText: 'When someone messages your WhatsApp, we reply in your studio\u2019s name within minutes: we answer the question, check your date the way your date check does, take the details, and add them to your enquiries.',
  never: 'Never', neverText: 'We never confirm a booking or quote a price you have not set. You can switch this off at any time.',
  offMeans: 'Off means nothing answers on your behalf.',
  waiting: 'Eliza is not answering yet. She starts when TDW switches her on. Your choice is kept.',
  on: 'On', off: 'Off', notNow: 'Not now', anyTime: 'You can turn Eliza on any time in WhatsApp and Instagram.',
  // S10
  readyHead: 'Your website is ready', goesLive: (addr: string) => `It goes live at ${addr} when you publish it.`,
  draftIn: (style: string) => `Website draft in ${style}`, pkgsSaved: (n: number) => `${n} packages saved`,
  photosOn: (n: number) => `${n} photos on your website`,
  elizaOn: 'Eliza on for WhatsApp', elizaOff: 'Eliza off for WhatsApp', elizaWaiting: 'Eliza: starts when TDW switches her on',
  publish: 'Publish my website', notYet: 'Not yet, go to Home',
  // S11 (Home)
  cardHead: 'Your business is ready to check',
  cardLine: 'Your website draft, packages and photos are ready. Nothing is published until you say yes.', cardGo: 'Check it',
  // plain failures (the screens' own; a server refusal is shown in its own words instead)
  noConnect: 'Could not connect. Try again.',
} as const;
export const STYLES = [
  { key: 'gallery', name: 'Gallery', line: 'Plain walls with your photographs framed one by one, like an art gallery.' },
  { key: 'noir', name: 'Noir', line: 'Dark pages with gold accents, so your photographs stand out.' },
  { key: 'couture', name: 'Couture', line: 'Ivory pages, large photographs and fine type, like a fashion magazine.' },
] as const;
