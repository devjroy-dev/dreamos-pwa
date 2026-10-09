// lib/works/scenes.ts · CE-47 · LAND-1 · the 18 scenes of the tdw.works front page.
//
// Ported word for word from the chair's design file (tdw-works.html, 9 October 2026): the same helpers, the same scene
// order, the same words. Each scene is the vendor app's own room drawn in HTML and CSS (Graphite `g`, Chalk `c`), with
// invented names only. Only landed rooms appear; Quotes and Rebooking join when OFF lands them (PREVIEW_KEYS).
//
// One change the chair ordered (point 2): the two look tiles of her website carry TDW's landing photographs, and
// (ruling 5, 9 October) Discover's two tiles carry the same two. The
// tiles' markup comes in as `looks`, built on the server by getImageProps (next/image), so the strings below never
// name an image address themselves.

// `hi`: the floating tag sits above the screen's top edge (LAND-1 package 2's eight scenes, whose first lines are the
// point of the screen: her typed line, a crew date, the two ways to start).
export type Scene = { k: string; w: string; cap: string; tag: [string, string]; h: string; hi?: boolean };

const A = (th: string, title: string, sub: string, body: string, top?: string) =>
  '<div class="app ' + th + '">' + (top || '<div class="sb"><span>9:41 am</span><span>5G</span></div>') +
  '<div class="ah"><span class="at">' + title + '</span><span class="aq">?</span></div>' + (sub ? '<p class="as">' + sub + '</p>' : '') +
  '<div class="ab">' + body + '</div></div>';
const C = (x: string) => '<div class="ac">' + x + '</div>';
const R = (l: string, r: string) => '<div class="ar"><span>' + l + '</span><b class="n">' + r + '</b></div>';
const R1 = (l: string, r: string) => '<div class="r1"><span>' + l + '</span>' + r + '</div>';
const R2 = (x: string) => '<div class="r2">' + x + '</div>';
const CH = (t: string, k?: string) => '<span class="ch ' + (k || '') + '">' + t + '</span>';
const B = (t: string, f?: number) => '<span class="b' + (f ? ' f' : '') + '">' + t + '</span>';
const L = (t: string) => '<div class="lb">' + t + '</div>';
const T = (a: string, b: string) => '<div class="tick"><i>✓</i><span>' + a + '<small>' + b + '</small></span></div>';
// A build step still running (now) or waiting its turn (wait), for the website being made (LAND-1 package 2).
const P = (a: string, b: string, st: 'now' | 'wait') => '<div class="tick"><i class="' + st + '">' + (st === 'now' ? '•' : '') + '</i><span>' + a + '<small>' + b + '</small></span></div>';
const BUB = (dir: 'in' | 'out', text: string, small: string) => '<div class="bub ' + dir + '">' + text + '<small>' + small + '</small></div>';

/** The 26 scenes. `looks` is the markup for the two photographs in her website's look tiles and Discover's two tiles. */
export function buildScenes(looks: [string, string] = ['', '']): Scene[] {
  return [
    // ── LAND-1 package 2 (CE-47, 10 Oct 2026): eight rooms that are live in the app, drawn with the app's own words
    //    (v2/lib/worklist/copy.ts headlines, the rooms' state words, v2/lib/vendor/startCopy.ts, the vendor lane's
    //    approval line). They join the shuffle; FIRST_POOL below names the five a visitor may land on first.
    {k:'leads',hi:true,w:'leads.',cap:'Every new enquiry in one list, with where it came from and what was asked.',tag:['New enquiry','From Instagram'],
     h:A('c','Enquiries','Enquiries \u00b7 4 open',C(R1('Tara Kapoor',CH('Instagram','t'))+R2('Wedding makeup \u00b7 14 December \u00b7 asked for the packages'))+C(R1('Rohan Malik',CH('WhatsApp','t'))+R2('Engagement shoot \u00b7 2 November \u00b7 asked the price'))+C(R1('Anya Bhatt',CH('Website','t'))+R2('Party makeup \u00b7 18 October \u00b7 asked if the date is free'))+C(R1('Ishaan Gupta',CH('WhatsApp','t'))+R2('Sangeet \u00b7 30 November \u00b7 asked for a trial')))},
    {k:'clients',hi:true,w:'clients.',cap:'Your clients and their events, with what is booked and what is still owed.',tag:['Still owed','Rs 40,000'],
     h:A('g','Clients','Booked \u00b7 3 clients',C(R1('Tara Kapoor','')+R2('Wedding \u00b7 14 December')+R('Booked','Rs 80,000')+R('Still owed','Rs 40,000'))+C(R1('Kabir Sethi',CH('Paid','ok'))+R2('Engagement \u00b7 8 October')+R('Booked','Rs 25,000'))+C(R1('Meera Arora','')+R2('Reception \u00b7 2 November')+R('Still owed','Rs 18,500')))},
    {k:'bookchat',hi:true,w:'bookings.',cap:'Type a booking in your chat. TDW blocks the date and raises the invoice.',tag:['Date blocked','14 December'],
     h:A('g','Ask TDW','',BUB('out','Book 14 December for Tara and raise the invoice','6:02 pm')+BUB('in','Booked. The client, the event and the invoice are ready.','6:02 pm')+C(R1('Date blocked',CH('14 December','t'))+R2('Monday \u00b7 Tara Kapoor'))+C(R1('INV-0143 \u00b7 Tara Kapoor','<b class="n">Rs 80,000</b>')+R2('Raised')))},
    {k:'draft',hi:true,w:'messages.',cap:'Your assistant drafts the message. Nothing goes to the client until you say yes.',tag:['Sent after your yes','6:14 pm'],
     h:A('c','Ask TDW','',BUB('out','Message Tara, confirm the booking for 14 December, and ask her to pay the 30% advance within 3 days.','6:12 pm')+BUB('in','Hi Tara, your booking for 14 December is confirmed. Please pay the advance of Rs 24,000 (30%) within 3 days to hold the date.','Draft \u00b7 not sent')+BUB('in','Send this to Tara? Reply YES or NO.','6:12 pm')+'<div class="bt" style="align-self:flex-end">'+B('YES',1)+B('NO')+'</div>'+'<div class="r2" style="align-self:center">Sent to Tara \u00b7 6:14 pm</div>')},
    {k:'contracts',hi:true,w:'contracts.',cap:'Send a contract for a booking and see when it is signed.',tag:['Signed','Deposit received'],
     h:A('g','Contracts','Agreements signed on WhatsApp; the date held on deposit',C(R1('Booking contract, Tara Kapoor',CH('Signed','ok'))+R2('Wedding \u00b7 14 December')+R('Deposit','Rs 24,000')+'<div class="bt">'+CH('Deposit received','ok')+'</div>')+C(R1('Booking contract, Rohan Malik',CH('Sent \u00b7 not signed yet','me'))+R2('Engagement \u00b7 2 November'))+C(R1('Booking contract, Anya Bhatt',CH('Draft'))+R2('Party \u00b7 18 October')))},
    {k:'crew',hi:true,w:'crew.',cap:'Your crew for each event, and who works which date.',tag:['On 14 December','3 crew'],
     h:A('c','Team','Crew, and who works which shoot',L('14 December \u00b7 Tara Kapoor')+C(R('Riya','Hair')+R('Sana','Draping')+R('Kunal','Assistant'))+L('18 October \u00b7 Anya Bhatt')+C(R('Riya','Hair'))+L('2 November \u00b7 Meera Arora')+C(R('Sana','Draping')+R('Kunal','Assistant')))},
    {k:'igdm',hi:true,w:'Instagram.',cap:'Instagram messages answered in your studio\u2019s name, day and night.',tag:['Instagram','Answered in your name'],
     h:A('g','Instagram messages','On. People who message your Instagram get a reply in your studio\u2019s name.',BUB('in','Hi! Do you do engagement makeup in Gurgaon?','Instagram \u00b7 10:12 pm')+BUB('out','Hi, this is Ilavari Studio. Yes, we do engagement makeup in Gurgaon. When is your event?','10:12 pm \u00b7 Ilavari Studio')+BUB('in','On 2 November, in the evening.','10:13 pm')+BUB('out','2 November is open. What time should the makeup be ready?','10:13 pm \u00b7 Ilavari Studio'))},
    {k:'sitebuild',hi:true,w:'photos.',cap:'Connect Instagram or add your own photos. TDW builds your website from them.',tag:['Building','Your website'],
     h:A('c','Building your business','TDW builds your website from your photos.','<div class="bt">'+CH('Connect Instagram','t')+CH('Add my own photos')+'</div>'+C(T('Your photos','Ready \u00b7 24 photos from Instagram')+P('Your website','Building','now')+P('Your packages','Setting up','wait')+P('Your storefront','Setting up','wait')+P('Eliza','Setting up','wait'))+'<div class="r2" style="padding:0 4px">Nothing is published until you say yes.</div>')},

    {k:'website',w:'website.',cap:'A website in your own style, built from your photos.',tag:['Your website','Published'],
     h:'<div class="app c"><div class="sb"><span>9:41 am</span><span>5G</span></div><div class="url">ilavari.thedreamwedding.in</div><div class="site"><div class="nm"><span>LOOKS</span><b>ILAVARI</b><span>ENQUIRE</span></div><h4>Looks for every occasion.</h4><div class="looks"><span class="lk">' + looks[0] + '<em>LOOK 01</em></span><span class="lk">' + looks[1] + '<em>LOOK 02</em></span></div><span class="cta">Enquire on WhatsApp</span></div></div>'},
    {k:'build',w:'launch.',cap:'Sign up, add your photos, and your business is online in about two minutes.',tag:['Ready in','1 min 52 sec'],
     h:A('g','Your business, from your photos','Four things are ready. Check each one.',C(T('Website published','ilavari.thedreamwedding.in')+T('3 packages drafted','Confirm each one before it is shown')+T('Storefront laid out','12 photos from your portfolio')+T('Eliza on WhatsApp','Answers new enquiries for you'))+'<div class="bt">'+B('See my website',1)+B('Review packages')+'</div>')},
    {k:'packages',w:'packages.',cap:'Your packages and prices, drafted from your posts. You confirm each one.',tag:['On your website','3 packages'],
     h:A('c','Packages','What clients can book, with prices.',C(R1('Wedding makeup','<b class="n">Rs 35,000</b>')+R2('Trial, makeup, hair, draping'))+C(R1('Party makeup','<b class="n">Rs 8,000</b>')+R2('Makeup and hair, one look'))+C(R1('Shoot look','<b class="n">Rs 12,000</b>')+R2('Two looks for a photo shoot')))},
    {k:'calendar',w:'calendar.',cap:'Every booking and event, on one calendar.',tag:['Next booking','Mon 12 Oct, 6:00 am'],
     h:A('g','Calendar','October',C('<div class="days"><span class="hd">M</span><span class="hd">T</span><span class="hd">W</span><span class="hd">T</span><span class="hd">F</span><span class="hd">S</span><span class="hd">S</span><span class="on">12</span><span>13</span><span class="on">14</span><span>15</span><span>16</span><span>17</span><span class="on">18</span><span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span></div>')+L('This week')+C(R1('Engagement · Tara Kapoor',CH('6:00 am','t'))+R2('Monday 12 October · Greater Kailash'))+C(R1('Studio shoot',CH('8:00 am','t'))+R2('Wednesday 14 October · Gurgaon')))},
    {k:'invoices',w:'invoices.',cap:'Invoices and instalments, with what is still owed.',tag:['Still owed','Rs 40,000'],
     h:A('c','Invoices','Every invoice, paid and owed.',C(R1('INV-0142 · Tara Kapoor','<b class="n">Rs 80,000</b>')+R('Paid','Rs 40,000')+R('Second instalment, 20 Oct','Rs 40,000'))+C(R1('INV-0139 · Kabir Sethi',CH('Paid','ok'))+R2('<span class="n">Rs 25,000</span> · 8 October'))+C(R1('INV-0137 · Meera Arora','<b class="n">Rs 18,500</b>')+R2('Due 2 November')))},
    {k:'payments',w:'payments.',cap:'Send a payment link with any invoice. It is marked paid when the money arrives.',tag:['Payment received','Rs 25,000'],
     h:A('g','Payment links','Marked paid when the money arrives.',L('Money owed')+C(R1('Tara Kapoor','<b class="n">Rs 40,000</b>')+R2('INV-0142 · second instalment')+'<div class="bt">'+B('Copy')+B('Send on WhatsApp',1)+'</div>')+L('Paid through links')+C(R1('Kabir Sethi',CH('Paid','ok'))+R2('<span class="n">Rs 25,000</span> · 8 October, 4:05 pm'))+C(R1('Anya Bhatt',CH('Paid','ok'))+R2('<span class="n">Rs 12,000</span> · 6 October, 7:30 pm')))},
    {k:'insurance',w:'cover.',cap:'Kinds of cover for your work, your saved policies, and a note when a policy needs renewing.',tag:['Needs renewing','In 30 days'],
     h:A('c','Insurance','Cover for your kit, your events and your work.',C(R1('Equipment cover',CH('Saved','t'))+R2('Kit and camera gear · renews 9 November'))+C(R1('Event cancellation','')+R2('If an event you are booked for is called off'))+C(R1('Public liability','')+R2('If a client or guest is hurt at your work')))},
    {k:'papers',w:'papers.',cap:'Your certificate, ID, business statement and a pack for your CA.',tag:['Ready for your CA','Pack for September'],
     h:A('g','Business papers','Your business papers, ready when asked.',C(R('Business certificate','Ready')+R('ID card','Ready')+R('Business statement','September')+R('Pack for your CA','Ready'))+'<div class="bt">'+B('Download pack',1)+B('Share')+'</div>')},
    {k:'supplies',w:'supplies.',cap:'Bills read and added to your expenses, and gear you can share with others.',tag:['Bill added','Rs 6,240 with GST'],
     h:A('c','Supplies','Bills, gear and where to buy.',L('Bills')+C(R1('Beauty supplies store','<b class="n">Rs 6,240</b>')+R2('GST Rs 952 · read from your photo')+'<div class="bt">'+CH('Added to expenses','ok')+'</div>')+L('Gear to share')+C(R1('Ring light, 18 inch',CH('Lend','t'))+R2('Free on 15 and 16 October')))},
    {k:'trends',w:'trends.',cap:'Every Monday, a brief on what clients ask for in your trade and your city.',tag:['This week','Soft pastel colours'],
     h:A('g','Trend room','A new brief every Monday at 9:00 am.',L('What clients asked for')+C(R('Soft pastel colours','12 enquiries')+R('Short reels under 30 sec','9 enquiries')+R('Same-day photo edits','6 enquiries'))+L('New in your trade')+C(R1('Lighter fabrics for daytime events','')+'<span class="r2" style="color:var(--t)">Read it at the source</span>'))},
    {k:'posts',w:'posts.',cap:'Posts, reels and ad briefs, drafted from your work and your calendar.',tag:['Drafted for you','3 posts this week'],
     h:A('c','Posts and ads','Drafts from your work. You post them.',C(R1('Reel: three looks from Saturday',CH('Draft','me'))+R2('From the Tara Kapoor engagement'))+C(R1('Post: October dates open',CH('Draft','me'))+R2('Three dates left this month'))+C(R1('Ad brief: festive season',CH('Ready','ok'))+R2('For Delhi NCR, 7 days')))},
    {k:'shop',w:'shop.',cap:'Sell gift vouchers, classes and workshops from your own website.',tag:['Sold','2 seats in the class'],
     h:A('g','Off-season shop','Sell more between bookings.',C(R1('Gift voucher','<b class="n">Rs 5,000</b>')+R2('Any service, valid for a year'))+C(R1('Makeup masterclass','<b class="n">Rs 3,500</b>')+R2('Sunday 1 November · 8 of 10 seats left'))+C(R1('Self-makeup kit session','<b class="n">Rs 2,000</b>')+R2('One hour, at your studio'))+'<div class="bt">'+B('Add an item',1)+'</div>')},
    {k:'discover',w:'profile.',cap:'A profile on TDW Discover, where clients look for professionals.',tag:['On Discover','Delhi NCR'],
     h:A('c','Discover','How clients see you on TDW.',C(R1('Ilavari Studio',CH('Shown','ok'))+R2('Makeup artist · Delhi NCR')+'<div class="looks" style="height:92px"><span class="lk">' + looks[0] + '</span><span class="lk">' + looks[1] + '</span></div>')+C(R('Looks shown','6')+R('Packages shown','3')))},
    {k:'collabs',w:'collabs.',cap:'Find photographers, models and stylists to hire or barter with for your next shoot.',tag:['New collab call','Outdoor shoot, Noida'],
     h:A('g','Collab Hub','Crew, models and partners to hire or trade with.',C(R1('Studio shoot in Gurgaon',CH('Paid','me'))+R2('14 October · Needs a model and a hair stylist')+'<div class="bt">'+B('Interested',1)+'</div>')+C(R1('Outdoor shoot in Noida',CH('Barter','t'))+R2('18 October · Needs a photographer')+'<div class="bt">'+B('Interested',1)+'</div>'))},
    {k:'brands',w:'brand deals.',cap:'Write pitches to brands with TDW, and send them yourself.',tag:['Pitch written','Ready to copy'],
     h:A('c','Brand collaborations','Pitches you write and send yourself.',C(R1('A skin care brand',CH('Pitch ready','t'))+R2('Open to makeup artists in Delhi NCR')+'<div class="bt">'+B('Copy pitch',1)+B('Open their page')+'</div>')+C(R1('A festive wear label','')+R2('Open to stylists and creators'))+'<div class="r2" style="padding:0 4px">2 of 3 pitches left today</div>')},
    {k:'kit',w:'media kit.',cap:'A page with your work and numbers, ready to send to any brand.',tag:['Your kit','Shared 4 times'],
     h:A('g','Media kit','A page to send to brands.','<div class="url" style="margin:0">thedreamwedding.in/v/ilavari/kit</div>'+C('<div class="r1"><span style="font-family:var(--display);font-size:22px">Ilavari Studio</span></div>'+R2('Makeup artist · Delhi NCR'))+'<div class="kit"><div><b>48.2k</b><span>followers</span></div><div><b>36</b><span>looks</span></div><div><b>120</b><span>events</span></div></div>'+'<div class="bt">'+B('Copy link',1)+'</div>')},
    {k:'partners',w:'partners.',cap:'Agencies and fashion houses send their calls to the professionals on TDW.',tag:['From an agency','Festive campaign'],
     h:A('c','Collab Hub','Calls from agencies and fashion houses.',C(R1('Festive campaign · Delhi',CH('Paid','me'))+R2('A model agency · needs two makeup artists')+'<div class="bt">'+B('Interested',1)+'</div>')+C(R1('Lookbook shoot · Mumbai',CH('Paid','me'))+R2('A fashion house · needs a stylist')))},
    {k:'eliza',w:'enquiries.',cap:'Eliza answers new enquiries on WhatsApp for you, day and night.',tag:['New enquiry','Answered by Eliza'],
     h:A('g','Eliza on WhatsApp','',  '<div class="bub in">Hi, is 14 December free for wedding makeup?<small>11:40 pm</small></div><div class="bub out">Hi Tara, 14 December is open. Wedding makeup with Ilavari starts at Rs 35,000. Here are the packages.<small>11:40 pm · Eliza</small></div><div class="bub in">Lovely, please share them.<small>11:41 pm</small></div>')}
  ];
}

/** The focus slot's sheet for one scene: the screen and its floating tag. */
export function sheetHtml(s: Scene): string {
  return s.h + '<div class="tag' + (s.hi ? ' hi' : '') + '"><small>' + s.tag[0] + '</small><b>' + s.tag[1] + '</b></div>';
}

/** One wall column: 7 scenes from `order`, drawn twice so the drift loops without a seam. */
export function columnHtml(scenes: Scene[], order: number[], c: number): string {
  const html = order.slice(0, 7).map((i) => '<div class="mini">' + scenes[i].h + '</div>').join('');
  return '<div class="colm"><div class="track" style="--dur:' + (70 + c * 9) + 's">' + html + html + '</div></div>';
}

/** The trades line, in the chair's order, drawn twice for the same reason. */
export const TRADES = ['Makeup artists', 'Photographers', 'Influencers', 'Content creators', 'Event planners', 'Talent management agencies',
  'Modelling agencies', 'Designers', 'Stylists', 'Decorators', 'Studios', 'Social media managers'];

/** Fisher-Yates over a copy. `rnd` is injectable so the bench can drive the order. */
export function shuffled<T>(a: T[], rnd: () => number = Math.random): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i -= 1) { const j = Math.floor(rnd() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t; }
  return b;
}

/**
 * The order rule, one home: random, no repeat until all have shown, and never the same scene twice in a row across
 * the turn of the bag. `bag` is consumed in place; `cur` is the scene on the glass now.
 */
export function draw(bag: number[], n: number, cur: number | null, rnd: () => number = Math.random): number {
  if (!bag.length) {
    const fresh = shuffled(Array.from({ length: n }, (_, i) => i), rnd);
    if (fresh[0] === cur && fresh.length > 1) fresh.push(fresh.shift() as number);
    bag.push(...fresh);
  }
  return bag.shift() as number;
}

/** The doors, by exact address (point 3). */
export const DOORS = {
  signIn: 'https://thedreamwedding.in/?role=vendor-signin',
  start: 'https://thedreamwedding.in/?role=vendor',
  agency: 'https://thedreamwedding.in/partner/join',
  privacy: 'https://thedreamwedding.in/privacy',
  terms: 'https://thedreamwedding.in/terms',
} as const;

/** The storefront's two photographs, in this order: her website's two look tiles and Discover's two tiles (the chair's
 *  two addresses, LAND-1 package 2, 10 Oct 2026). The one place they are named. */
export const LOOK_PHOTOS = [
  'https://res.cloudinary.com/dccso5ljv/image/upload/c_fill,g_auto,ar_9:8,w_720,q_auto/v1788328622/vendor_portfolio/a8c52506-d363-4a36-9cec-09b50cc32c4c/ig-5a637b957f1d.jpg',
  'https://res.cloudinary.com/dccso5ljv/image/upload/c_fill,g_auto,ar_9:8,w_720,q_auto/v1788328616/vendor_portfolio/a8c52506-d363-4a36-9cec-09b50cc32c4c/ig-eca46f60edfc.jpg',
] as const;

/** The first scene a visitor sees on landing is drawn at random from these five (the chair, 10 Oct 2026; the founder to
 *  confirm). Every scene after it is fully random, as before. */
export const FIRST_POOL = ['leads', 'clients', 'bookchat', 'draft', 'contracts'] as const;

/** The landing scene's index: one of FIRST_POOL, at random. */
export function pickFirst(scenes: Scene[], rnd: () => number = Math.random): number {
  const pool = scenes.map((s, i) => [s.k, i] as const).filter(([k]) => (FIRST_POOL as readonly string[]).includes(k)).map(([, i]) => i);
  return pool[Math.floor(rnd() * pool.length)];
}
