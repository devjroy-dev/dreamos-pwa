// app/works/page.tsx · CE-47 · LAND-1 · the tdw.works front page, served at tdw.works by host (middleware.ts).
//
// THE CHAIR'S FILE, BUILT UNCHANGED IN LOOK AND BEHAVIOUR (tdw-works.html, 9 October 2026). Its markup is below as JSX,
// its CSS is app/works/works.css under .tdww, its scenes are lib/works/scenes.ts, its script is WorksMotion.tsx.
//
// DRAWN ON THE SERVER, SO THE FIRST FULL VIEW NEEDS NO SCRIPT (point 5: under 2.5 s on 4G). The file built the wall and
// the first screen in the browser; here the server draws both, with the order picked per request (connection(): each
// visit gets its own random order, never one frozen at build). The script then takes over from the scene on the glass.
//
// The four changes the chair ordered: faces by next/font (fonts.ts); TDW's landing photographs in her two look tiles
// through next/image (getImageProps, so the scene strings stay strings); the mark reads "TDW" with "The Delegated
// Workspace" beside it (ruling 4: the line reads "tdw.works · The Delegated Workspace™"); four wall columns on a
// phone (works.css). The doors are DOORS in lib/works/scenes.ts.
import type { Metadata, Viewport } from 'next';
import { connection } from 'next/server';
import { buildScenes, sheetHtml, pickFirst, TRADES, DOORS } from '@/lib/works/scenes';
import { worksLooks, wallHtml } from '@/lib/works/wall';
import { worksFontClasses } from './fonts';
import WorksMotion from './WorksMotion';
import WorksWall from './WorksWall';
import './works.css';

export const metadata: Metadata = {
  title: 'tdw.works · The Delegated Workspace',
  description: 'One app for the business behind your work: your website, packages, calendar, payments, collaborations and more.',
  alternates: { canonical: 'https://tdw.works' },
  openGraph: { title: 'tdw.works · The Delegated Workspace', description: 'One app for the business behind your work.', url: 'https://tdw.works', siteName: 'tdw.works' },
  // tdw.works's own tab icon (ruled by the founder, 9 Oct 2026; files from the chair, TDW_CE47_tdw_works_icon_A). These
  // replace the root layout's D for this page only; /favicon.ico on the tdw.works host is the same family (next.config.ts).
  icons: {
    icon: [
      { url: '/works/icon.svg', type: 'image/svg+xml' },
      { url: '/works/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/works/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/works/apple-icon-180.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E7EAE6' },
    { media: '(prefers-color-scheme: dark)', color: '#0E1112' },
  ],
};

// The photographs and the wall are drawn by lib/works/wall.ts, the one home the sign-in screens draw from too (package 2).

const FIT_NOW = "(function(){var f=document.getElementById('focus'),s=document.getElementById('slot');if(f&&s){var k=Math.min(f.clientWidth/440,f.clientHeight/560,1.25);s.style.setProperty('--k',Math.max(k,.5).toFixed(3))}})()";

const ARROW = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" /></svg>
);

export default async function WorksPage() {
  await connection();
  const looks: [string, string] = worksLooks();
  const scenes = buildScenes(looks);
  // The first scene on the glass: the first draw of a fresh bag, exactly as the file's script does it.
  // The landing scene: one of FIRST_POOL (leads, clients, book by chat, the assistant's draft, contracts), at random.
  // Every scene after it is fully random (WorksMotion.tsx's bag).
  const first = pickFirst(scenes);
  const wall = wallHtml(scenes);
  const trades = TRADES.map((x) => '<span>' + x + '</span>').join('');

  return (
    <div className={'tdww ' + worksFontClasses}>
      <WorksWall html={wall} />

      <div className="page">
        <header className="top">
          <a className="mark" href="/" aria-label="tdw.works, The Delegated Workspace"><b>TDW</b><span>tdw.works · The Delegated Workspace™</span></a>
          <nav className="nav" aria-label="TDW">
            {/* LAND-1 package 2: About, Privacy and Terms were not legible over the wall. One "More" beside Sign in opens
                a small menu on a solid ground; it closes on Esc, a tap outside, or a choice (WorksMotion.tsx). */}
            <div className="more">
              <button className="morebtn" type="button" id="moreBtn" aria-haspopup="menu" aria-expanded="false" aria-controls="moreMenu">More</button>
              <div className="menu" id="moreMenu" role="menu" aria-labelledby="moreBtn" hidden>
                <button type="button" role="menuitem" id="aboutOpen">About</button>
                <a role="menuitem" href={DOORS.privacy}>Privacy</a>
                <a role="menuitem" href={DOORS.terms}>Terms</a>
              </div>
            </div>
            <a className="signin" href={DOORS.signIn} data-door="signin">Sign in</a>
          </nav>
        </header>

        <main className="main">
          <section className="copy" aria-label="What TDW does">
            <p className="kicker">One app for the business behind your work</p>
            <h1>Your<span className="w"><i id="word">{scenes[first].w}</i><span className="meter" aria-hidden="true"><u id="meter" /></span></span></h1>
            <p className="cap" id="cap">{scenes[first].cap}</p>
            <div className="doors">
              <a className="start" href={DOORS.start} data-door="start">Start free{ARROW}</a>
              <a className="agency" href={DOORS.agency} data-door="agency"><b>Agency or brand? Send your calls here.</b><span>Post casting and collab calls to the professionals on TDW.</span></a>
            </div>
          </section>

          <div className="focus" id="focus" role="button" tabIndex={0} aria-label="Pause the screens" data-first={first} data-scene={scenes[first].k}>
            <div className="slot" id="slot" dangerouslySetInnerHTML={{ __html: '<div class="sheet">' + sheetHtml(scenes[first]) + '</div>' }} />
            <span className="paused" id="paused" hidden>Paused · tap to play</span>
          </div>
          {/* The screen's scale before any bundle arrives, so the first full view is right without waiting for the script. */}
          <script dangerouslySetInnerHTML={{ __html: FIT_NOW }} />
        </main>

        <footer>
          <div className="trades" aria-label="Who TDW is for"><div className="run" id="trades" dangerouslySetInnerHTML={{ __html: trades + trades }} /></div>
          <div className="dock">
            <a className="start" href={DOORS.start} data-door="start">Start free{ARROW}</a>
            <a className="agency" href={DOORS.agency} data-door="agency"><b>Agency or brand? Send your calls here.</b></a>
          </div>
        </footer>
      </div>

      <div className="about" id="about" role="dialog" aria-modal="true" aria-labelledby="abTitle" hidden>
        <div className="ab-in">
          <div className="ab-top"><span className="mark"><b>TDW</b><span>tdw.works · The Delegated Workspace™</span></span><button className="ab-close" type="button" id="aboutClose">Close</button></div>

          {/* LAND-1 package 3 r2: the founder's approved About text, word for word (apostrophes and quotes typographic, R-40.19).
              The layout's style is kept: kicker, headline, intro, four promises, grouped lines, Made for, Start free, the footer. */}
          <header className="ab-head">
            <p className="kicker">About TDW</p>
            <h2 id="abTitle">Your business, <em>in one app.</em></h2>
            <p>TDW is an app for creative professionals and their businesses: makeup artists, photographers, designers, stylists, event planners, influencers, content creators, studios, and talent and modelling agencies. It holds your clients, bookings, money and collaborations in one place, and does routine work for you.</p>
          </header>

          <div className="promises">
            <div><b>No commission.</b><span>TDW takes no cut of your bookings. Payments go to your own account.</span></div>
            <div><b>Two-minute start.</b><span>Add your photos or connect Instagram. Your website, packages and shop are set up for you.</span></div>
            <div><b>Replies at any hour.</b><span>New messages on WhatsApp and Instagram get a reply in your business’s name.</span></div>
            <div><b>Run it from WhatsApp.</b><span>Type what you need in plain words, for example “Book Tara for 14 December and ask for the 30% advance”. TDW blocks the date, raises the invoice and drafts the message. Nothing is sent until you approve it.</span></div>
          </div>

          <div className="chaps">
            <section className="chap"><h3>Clients and bookings</h3>
              <div className="item"><b>Leads.</b><span>Every new enquiry in one list, with what was asked and where it came from.</span></div>
              <div className="item"><b>Clients.</b><span>Each client’s events, bookings and amount still owed.</span></div>
              <div className="item"><b>Packages.</b><span>Your services and prices, drafted for you to check and confirm.</span></div>
              <div className="item"><b>Calendar.</b><span>All bookings, shoots and events in one calendar.</span></div>
              <div className="item"><b>Contracts.</b><span>Send a contract with a booking and see when it is signed.</span></div>
              <div className="item"><b>Team and crew.</b><span>Who is working on which date.</span></div>
            </section>
            <section className="chap"><h3>Website and marketing</h3>
              <div className="item"><b>Website.</b><span>Choose a style, customize and put it on your own domain. Enquiries come to your WhatsApp.</span></div>
              <div className="item"><b>Google.</b><span>Your business name, work and city show in Google search.</span></div>
              <div className="item"><b>Instagram messages.</b><span>Enquiries on Instagram are answered in your name and saved as leads.</span></div>
              <div className="item"><b>Posts and ads.</b><span>Posts, reels and ads made from your own photos, with saves, shares, reach and enquiries.</span></div>
              <div className="item"><b>Discover.</b><span>Your profile on TDW Discover, where people look for professionals.</span></div>
            </section>
            <section className="chap"><h3>Business Solutions</h3>
              <div className="item"><b>Payment links.</b><span>A link with any invoice. The money goes to your own account. TDW takes no fee.</span></div>
              <div className="item"><b>Off-season shop.</b><span>Sell gift vouchers, classes and workshops from your website.</span></div>
              <div className="item"><b>Supplies.</b><span>Bills read from a photo and added to your expenses. Lend or borrow gear.</span></div>
              <div className="item"><b>Business papers.</b><span>Certificate, ID, business statement and a pack for your CA.</span></div>
              <div className="item"><b>Insurance.</b><span>Cover for your kit and your events, with renewal reminders.</span></div>
              <div className="item"><b>Brand collaborations.</b><span>Pitch brands and send the pitches yourself.</span></div>
              <div className="item"><b>Media kit.</b><span>One page with your work and your numbers, to send to brands.</span></div>
              <div className="item"><b>Trends.</b><span>Every Monday, what clients in your field and your city are asking for.</span></div>
            </section>
            <section className="chap"><h3>Collaborations and hiring</h3>
              <div className="item"><b>Collab Hub.</b><span>Post what you need for a shoot or an event, or answer other people’s posts. Paid or barter.</span></div>
              <div className="item"><b>Hire other artists.</b><span>Find photographers, makeup artists, models and stylists, see their work and hire them.</span></div>
              <div className="item"><b>Shoot directory.</b><span>Photographers, models and locations, with their Instagram.</span></div>
              <div className="item"><b>Agencies and brands.</b><span>Talent agencies, modelling agencies and fashion houses send casting and collab calls to professionals on TDW.</span></div>
              <a className="item" href={DOORS.agency} data-door="agency"><b>For agencies and brands.</b><span>Post casting and collab calls, and reach the professionals on TDW.</span></a>
            </section>
          </div>

          <div className="forwho">
            <p className="kicker">Made for</p>
            <p>makeup artists, photographers, influencers, content creators, event planners, talent agencies, modelling agencies, designers, stylists, decorators, studios and social media managers.</p>
          </div>

          <div className="ab-end">
            <a className="start" href={DOORS.start} data-door="start">Start free{ARROW}</a>
          </div>
          <div className="ab-foot"><span>© 2026 tdw.works · The Delegated Workspace™</span><a href={DOORS.privacy}>Privacy</a><a href={DOORS.terms}>Terms</a></div>
        </div>
      </div>

      <WorksMotion looks={looks} first={first} />
    </div>
  );
}
