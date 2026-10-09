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

export type Scene = { k: string; w: string; cap: string; tag: [string, string]; h: string };

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

/** The 18 scenes. `looks` is the markup for the two photographs in her website's look tiles and Discover's two tiles. */
export function buildScenes(looks: [string, string] = ['', '']): Scene[] {
  return [
    {k:'website',w:'website.',cap:'A website in your own style, built from your photos.',tag:['Your website','Published'],
     h:'<div class="app c"><div class="sb"><span>9:41 am</span><span>5G</span></div><div class="url">ilavari.thedreamwedding.in</div><div class="site"><div class="nm"><span>LOOKS</span><b>ILAVARI</b><span>ENQUIRE</span></div><h4>Looks for every occasion.</h4><div class="looks"><span class="lk">' + looks[0] + '<em>LOOK 01</em></span><span class="lk">' + looks[1] + '<em>LOOK 02</em></span></div><span class="cta">Enquire on WhatsApp</span></div></div>'},
    {k:'build',w:'launch.',cap:'Sign up, add your photos, and your business is online in about two minutes.',tag:['Ready in','1 min 52 sec'],
     h:A('g','Your business, from your photos','Four things are ready. Check each one.',C(T('Website published','ilavari.thedreamwedding.in')+T('3 packages drafted','Confirm each one before it is shown')+T('Storefront laid out','12 photos from your portfolio')+T('Eliza on WhatsApp','Answers new enquiries for you'))+'<div class="bt">'+B('See my website',1)+B('Review packages')+'</div>')},
    {k:'packages',w:'packages.',cap:'Your packages and prices, drafted from your posts. You confirm each one.',tag:['On your website','3 packages'],
     h:A('c','Packages','What clients can book, with prices.',C(R1('Wedding makeup','<b class="n">Rs 35,000</b>')+R2('Trial, makeup, hair, draping'))+C(R1('Party makeup','<b class="n">Rs 8,000</b>')+R2('Makeup and hair, one look'))+C(R1('Shoot look','<b class="n">Rs 12,000</b>')+R2('Two looks for a photo shoot')))},
    {k:'calendar',w:'calendar.',cap:'Every booking and event, on one calendar.',tag:['Next booking','Sat 12 Oct, 6:00 am'],
     h:A('g','Calendar','October',C('<div class="days"><span class="hd">M</span><span class="hd">T</span><span class="hd">W</span><span class="hd">T</span><span class="hd">F</span><span class="hd">S</span><span class="hd">S</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span class="on">12</span><span>13</span><span class="on">14</span><span>15</span><span>16</span><span>17</span><span class="on">18</span><span>19</span><span>20</span></div>')+L('This week')+C(R1('Engagement · Tara Kapoor',CH('6:00 am','t'))+R2('Saturday 12 October · Greater Kailash'))+C(R1('Studio shoot',CH('8:00 am','t'))+R2('Monday 14 October · Gurgaon')))},
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
     h:A('g','Off-season shop','Sell more between bookings.',C(R1('Gift voucher','<b class="n">Rs 5,000</b>')+R2('Any service, valid for a year'))+C(R1('Makeup masterclass','<b class="n">Rs 3,500</b>')+R2('Sunday 2 November · 8 of 10 seats left'))+C(R1('Self-makeup kit session','<b class="n">Rs 2,000</b>')+R2('One hour, at your studio'))+'<div class="bt">'+B('Add an item',1)+'</div>')},
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
  return s.h + '<div class="tag"><small>' + s.tag[0] + '</small><b>' + s.tag[1] + '</b></div>';
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

/** TDW's landing photographs (app/(landing)/page.tsx FALLBACK_SLIDES, the first two), for her two look tiles. */
export const LOOK_PHOTOS = [
  'https://res.cloudinary.com/dccso5ljv/image/upload/IMG_2544.PNG_cyeqlj',
  'https://res.cloudinary.com/dccso5ljv/image/upload/Facetune_14-05-2026-11-06-49_qs4dg6',
] as const;
