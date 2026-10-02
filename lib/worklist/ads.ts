// lib/worklist/ads.ts · CE-46 · ADS-1 · cut 1 · THE ADS PAGE'S WORDS, ONE HOME (R-46.13: "lib/worklist/ads.ts is the one
// home of every word"). Base dreamos-pwa dc8dbdd1.
//
// ═══ EVERY BYTE BELOW IS THE FOUNDER'S OR THE CHAIR'S, APPROVED 27 AND 28 SEPTEMBER 2026 ═══════════════════════════
// The page and the Posts room's Ads card read this file and hold no string of their own. Sources, in order approved:
//   · the vendor-facing line (BS-1, relayed 27 Sept)            ledes.section
//   · S1 to S6 in sentences (R-46.10, his yes 28 Sept)           connect.*, draft.*, running.*, results.*
//   · the three gaps and their taps (R-46.11, his yes)           gaps.*
//   · the declined permission, the inactive account (his yes)    gaps.scopes, gaps.inactive
//   · the iPhone line (his "ok to the line", F-44.235)           connect.iphone
//   · Meta reviewing (chair's words, his yes)                    running.reviewing
//   · the likes fallback (his yes)                               draft.whyLikes
//   · S4 without the planning clause, "people in {places}" (his ok; chair's approval of the S5/S6 change)
//   · the nine lines of the 28-PNG sheet, all approved, "Let Meta find more people like these" (R-46.13)
// No dashes anywhere (R-45.30). Money reads "Rs {n}" with Indian grouping from the caller. {braces} are filled by the
// caller from Meta's answer; nothing is typed by TDW in their place.

export const ADS = {
  comingSoon: 'Coming soon',

  // cut1e 2 · the chooser (e2), approved 29 September 2026. {n} is Meta's own count on her login.
  choose: {
    funds: 'Funds: {amount}',   // CE-47 ADS-2 item 4: drawn only for INR, through formatRs
    // CE-47 (the founder's words, 1 Oct 2026): a non-INR account names its currency and is not pickable for now.
    currencyLine: 'This account pays in {name}.',
    rupeesOnly: 'TDW runs ads on rupee accounts for now.',
    currencyNames: { USD: 'US dollars', EUR: 'euros', GBP: 'pounds', AED: 'UAE dirhams' } as Record<string, string>,
    accountQ: 'Which ad account should your ads use?',
    pageQ: 'Which Page should your ads come from?',
    accountBody: 'Meta shows {n} ad accounts on your login. Pick the one to use for TDW. You can change it later in All settings.',
    pageBody: 'Meta shows {n} Pages on your login. Pick the one to use for TDW. You can change it later in All settings.',   // the Pages twin of the approved line, for the chair
    useAccount: 'Use this ad account',
    usePage: 'Use this Page',
  },
  // R-46.16 · with no posts of her own (the founder's yes, 29 September 2026)
  examples: {
    mark: 'TDW',   // R-46.16's watermark, set as type (R-41.134); the house name, no new word
    previewLine: 'This is how your post will look as an ad.',
    noPosts: 'Post a photo or reel on Instagram first. It will appear here.',
    sampleResult: 'A post like this could reach people in your city and bring messages to you.',   // proposed to the chair
  },
  // R-46.14, the founder's: an action that cannot run yet, disabled, never hidden

  ledes: {
    section: 'Run your Instagram and Facebook ads yourself, right here in TDW.',
  },

  card: {                                   // the Posts room's one Ads card (R-46.13 item 2)
    label: 'Ads',
    none: 'You have not run an ad yet. Your ads run from your own Meta ad account.',   // cut1e: "and your own card" dropped (prepaid accounts), for the chair
    gap: 'One step is left before your first ad: {step}.',
    running: '{post} is running. {reach} people have seen it today.',          // the approved shape (gap 1, the chair's yes)
    runningNoName: 'Your ad is running. {reach} people have seen it today.',  // only when her post had no caption
    last: 'Your last ad reached {reach} people and {enquiries} wrote to you.',
    open: 'Open Ads',
  },

  connect: {
    body1: 'Your ads run from your own Meta ad account. Meta takes the amount from your ad account\u2019s payment method. Every result is yours, and TDW never adds a charge of its own.',   // cut1e 5, for the chair
    body2: 'Meta will show you what TDW asks for. Keep every switch on.',   // cut1e 5, approved
    cta: 'Connect ad account',
    iphone: 'Press and hold Connect ad account, then choose \u201cOpen in New Tab\u201d. A normal tap gets caught by the Facebook app.',
    sheetQ: 'Connect your Meta ad account to TDW?',
    sheetBody: 'Meta will show you what TDW asks for. Keep every switch on. On the Pages screen, keep your business Page ticked.',   // e1, approved
    sheetGo: 'Continue to Meta',
    back: 'Back',
  },

  gaps: {
    intro: 'Before your first ad, Meta needs three things from you. We check them all when you connect.',
    page: 'Connected, but your Facebook account has no Page yet. Make one in about two minutes, then come back and tap Check again.',
    pageTap: 'Make my Page',
    link: 'Your Page {page} is not linked to your Instagram yet.',   // e3, approved
    linkSwitch: 'On Facebook, switch into your Page first (tap your picture at the top right, then the Page), then tap Link my Instagram again.',   // e3, approved
    linkTap: 'Link my Instagram',
    account: 'Your Page and Instagram are ready. The last thing is an ad account with your card. Make it in Meta Business Suite in about three minutes, then tap Check again.',
    accountTap: 'Make my ad account',
    inactive: 'Your ad account {name} is not active on Meta yet. Finish its setup in Meta Business Suite, then come back.',
    inactiveTap: 'Finish my ad account',
    scopes: 'Meta did not give TDW everything it needs to run your ads. Tap Connect again and leave all four permissions on.',
    again: 'Check again',
  },

  draft: {
    whySaves: '{post}, posted {date}, is your most saved post this month: {saves} saves and {reach} reach with no money behind it. Posts that couples save are the ones that bring enquiries, so this is the one to boost first.',
    whyNewest: 'Your newest post.',   // the chair's ruling 2, approved
    whyLikes: '{post}, posted {date}, is your most liked post this month: {likes} likes and {comments} comments with no money behind it. Posts couples respond to are the ones that bring enquiries, so this is the one to boost first.',
    whyShort: 'Your most saved post this month: {saves} saves and {reach} people reached, with no money behind it.',   // R-46.13 item 2
    preview: 'How couples will see it',
    plan: 'For Rs {daily} a day over {days} days, Meta shows this post to people in {places}, aged {min} to {max}. Meta takes up to Rs {total} in all from your ad account\u2019s payment method, never more.',   // cut1e 5 spliced, for the chair
    minimum: 'Rs {min} a day is the least Meta allows on your account.',
    rows: { who: 'Who sees it', where: 'Where it appears', amount: 'Amount', dates: 'Dates' },
    change: 'Change',
    run: 'Run this ad',
    allSettings: 'All settings',
  },

  settings: {
    groups: { who: 'Who sees it', where: 'Where it appears', money: 'Money and time', see: 'What couples see' },
    who: { places: 'Places', leaveOut: 'Leave out', age: 'Age', gender: 'Gender', languages: 'Languages',
      interests: 'Interests and life events', widen: 'Let Meta find more people like these' },
    where: { instagram: 'Instagram', facebook: 'Facebook', auto: 'Let Meta choose' },
    money: { amount: 'Amount', total: 'Or a total for the whole ad', start: 'Start', end: 'End', more: 'More', spend: 'How Meta spends it' },
    see: { post: 'Post', greeting: 'Greeting when they tap Send message', questions: 'Quick questions' },
    lists: 'Every place, interest and language comes from Meta\u2019s own lists.',
  },

  confirm: {
    q: 'Run this ad?',
    body: 'Meta takes up to Rs {total} in all from your ad account\u2019s payment method. You can pause it any time from here.',   // cut1e 5 spliced, for the chair
    rows: { post: 'Post', who: 'Who sees it', where: 'Where', amount: 'Amount', dates: 'Dates', greeting: 'Greeting' },
    run: 'Run this ad',
    back: 'Back',
    changed: 'Something changed. Look at the settings again and tap Run.',
  },

  running: {
    reviewing: 'Meta is checking your ad. It usually starts within a day.',
    notCharged: 'Nothing is charged until Meta starts showing it.',
    line: 'Running since {since}, until {until}. So far {reach} people in {places} have seen this post, and {enquiries} of them wrote to you. {inLeads}',
    spent: 'Meta has charged Rs {spent} of the Rs {total} so far. These numbers update every hour from Meta.',
    seeLeads: 'See the {n} enquiries',
    pause: 'Pause this ad',
  },

  yours: {
    label: 'Your ads',
    newAd: 'Run a new ad',
    running: 'Running until {until}. {reach} people have seen it, {enquiries} wrote to you, Rs {spent} of Rs {total} spent.',
    paused: 'Paused on {date} by you. {reach} people saw it, {enquiries} wrote to you, Rs {spent} spent.',
    ended: 'Ended on {date}. {reach} people saw it, {enquiries} wrote to you, Rs {spent} spent. That is Rs {each} for each enquiry.',
    actions: { pause: 'Pause this ad', resume: 'Start it again', amount: 'Change the amount', end: 'Change the end date',
      endNow: 'End it now', again: 'Run it again as a new ad', results: 'See results by day' },
    amountQ: 'Change the amount to Rs {new} a day?',
    amountBody: 'From now until {end}, Meta charges your card up to Rs {new} a day instead of Rs {old}. What is already spent stays as it is.',
    changeIt: 'Change it',
  },

  results: {
    label: 'Your last ad',
    story: 'Meta showed this ad {impressions} times to {reach} people in {places}. {clicks} of them tapped it, and {enquiries} wrote to you. Meta took Rs {spent} from your ad account\u2019s payment method. That is Rs {each} for each person who wrote.',   // e4 (G3), approved
    inLeads: 'All {enquiries} are in Leads.',
    days: 'Day by day: {days}.',
    next: 'What to try next: {next}',
    another: 'Run another ad',
    again: 'Run this one again',
  },

  disconnect: 'Disconnect ad account',

  // The screens' number shapes, from the approved PNGs (d1, d4, m1, n2): the words around a figure, one home.
  fmt: {
    who: '{place}, {min} to {max}',
    placeKm: '{name} {km} km',
    km: '{km} km',
    placeAround: '{name} and {km} km around',
    more: '+{n}',
    whereAuto: 'Let Meta choose',
    platforms: { instagram: 'Instagram', facebook: 'Facebook' },
    amountDaily: '{daily} a day, up to {total}',
    amountTotal: '{total} in all',
    dates: '{from} to {to}',
    confirmWho: '{places}, aged {min} to {max}',
    confirmAmountDaily: '{daily} a day, {days} days, up to {total}',
    confirmAmountTotal: '{total} in all, {days} days',
    dailyShort: '{daily} a day',
    ages: '{min} to {max}',
    spendRow: '{label}: {value}',
    resultDay: '{reach} reached, {enquiries} wrote, {spent}',
  },
  preview: { sponsored: 'Sponsored', send: 'Send message' },

  // ═══ NEW, NOT YET APPROVED (the question sheets' words; listed to the chair with the component) ═══
  q: {
    placesQ: 'Where should Meta show this ad?',                 // approved (R-46.13)
    placesHint: 'Type a city, state or pin code',                // approved (R-46.13)
    leaveOutQ: 'Where should Meta not show it?',
    ageQ: 'Which ages?',
    ageFrom: 'From', ageTo: 'To',
    gender: { all: 'Everyone', men: 'Men', women: 'Women' },
    languagesHint: 'Type a language',
    interestsHint: 'Type an interest, like weddings or bridal makeup',
    lifeEvents: 'Life events',
    any: 'Any', none: 'None', on: 'On', off: 'Off',
    positions: { stream: 'Feed', story: 'Stories', reels: 'Reels', explore: 'Explore', explore_home: 'Explore home', profile_feed: 'Profile feed',
      feed: 'Feed', facebook_reels: 'Reels', marketplace: 'Marketplace', video_feeds: 'Video feeds', search: 'Search' },
    amountHint: 'Rs a day',
    totalHint: 'Rs for the whole ad',
    spend: { LOWEST_COST_WITHOUT_CAP: 'Lowest cost, no cap', LOWEST_COST_WITH_BID_CAP: 'A cap on each result', COST_CAP: 'An average cost you want' },
    capHint: 'Rs for each result',
    postFilter: { all: 'All', instagram: 'Instagram', facebook: 'Facebook' },   // e5, approved
    postKinds: 'Your Instagram posts and your Facebook Page posts. A Facebook post sends people to Messenger; an Instagram post sends them to your Instagram messages.',   // e5, approved
    markInstagram: 'Instagram', markFacebook: 'Facebook',
    greetingHint: 'What couples see first when they tap Send message',
    questionHint: 'A question couples can tap',
    done: 'Done',                                                  // approved (R-46.13)
    back: 'Back',
    reel: 'Reel',
    notEligible: 'Meta does not allow this one as an ad.',
  },
} as const;

/** Fill {braces} from Meta's answer. A missing value leaves the brace visible so a bench can never miss it. */
export function fill(s: string, v: Record<string, string | number>): string {
  return s.replace(/\{([a-zA-Z]+)\}/g, (m, k) => (v[k] === undefined || v[k] === null ? m : String(v[k])));
}
