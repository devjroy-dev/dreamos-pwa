// docs/review/tools/findings.mjs · one screenshot per finding, the element in question outlined in pink.
import { browser, open, shot, sleep } from './harness.mjs';
const b = await browser();
const tapText = (p, src) => p.evaluate((src) => { const rx = new RegExp(src, 'i'); const c = [...document.querySelectorAll('a,button,[role=button],li,div,span')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && rx.test((e.innerText || '').trim()); }); c.sort((a, d) => (a.innerText || '').length - (d.innerText || '').length); const el = c[0]; if (!el) return false; const C = 'a,button,[role=button],[tabindex]'; (el.closest(C) || el.querySelector(C) || el).click(); return true; }, src);
// mark: a function body run in the page that returns the elements to outline
const mark = (p, fn) => p.evaluate((fn) => { const els = new Function('return (' + fn + ')()')(); for (const e of els) { e.style.outline = '3px solid #FF2D8A'; e.style.outlineOffset = '1px'; } return els.length; }, fn.toString());
const byText = (re) => `() => [...document.querySelectorAll('a,button,span,div,li')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && [...e.childNodes].some((n) => n.nodeType === 3 && ${re}.test(n.textContent.trim())); })`;
const J = [
  { name: 'home-pinned-first', route: '/vendor/today', mark: `() => [document.querySelector('.wl-pinned, [class*=pinned]')].filter(Boolean)` },
  { name: 'rooms-list', route: '/vendor/rooms' },
  { name: 'notch-header', route: '/vendor/today', notch: true },
  { name: 'light-fab-contrast', route: '/vendor/leads', mode: 'light', mark: `() => [document.querySelector('.wl-fab'), document.querySelector('.wl-docksend')]` },
  { name: 'light-primary-button', route: '/vendor/leads', mode: 'light', pre: async (p) => { await p.evaluate(() => document.querySelector('.wl-fab').click()); await sleep(900); }, mark: byText('/^Add lead$/') },
  { name: 'light-gold-text', route: '/vendor/settings', mode: 'light', mark: byText('/^(Where enquiries go|Business|Payments)$/i') },
  { name: 'light-white-grounds', route: '/vendor/invoices', mode: 'light', pre: async (p) => { await tapText(p, '^Meera and Kunal$'); await sleep(1200); } },
  { name: 'leads-chips-cut-android', route: '/vendor/leads', vp: 'android', mark: `() => [...document.querySelectorAll('button')].filter((e) => /^(BOOKED|LOST|QUOTED)/i.test(e.innerText.trim()))` },
  { name: 'leads-row-truncated', route: '/vendor/leads', mark: byText('/^(Aanya Kapo|In your books)/i') },
  { name: 'small-targets-calendar', route: '/vendor/calendar', mark: `() => [...document.querySelectorAll('button')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.top < innerHeight && (r.height < 44 || r.width < 44) && !e.classList.contains('wl-coin'); })` },
  { name: 'small-targets-invoices', route: '/vendor/invoices', mark: `() => [...document.querySelectorAll('button,a')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.top < 640 && r.top > 100 && (r.height < 44) && !e.closest('.wl-roomhead'); })` },
  { name: 'lead-sheet-actions', route: '/vendor/today', pre: async (p) => { await tapText(p, '^Aanya Kapoor$'); await sleep(1500); }, mark: byText('/^(Edit Here|Delete|Forward to a peer|Mark lost|WhatsApp|Call|Attach package|Booking confirmed|Advance paid)$/') },
  { name: 'whatsapp-icon-blue', route: '/vendor/today', pre: async (p) => { await tapText(p, '^Aanya Kapoor$'); await sleep(1500); }, mark: `() => [...document.querySelectorAll('a')].filter((e) => /WhatsApp/.test(e.innerText)).map((a) => a.querySelector('svg') || a)` },
  { name: 'today-event-raw-time', route: '/vendor/today', pre: async (p) => { await p.evaluate(() => document.querySelector('.wl-main').scrollBy(0, 560)); await sleep(500); }, mark: byText('/\\d\\d:\\d\\d:\\d\\d/') },
  { name: 'event-sheet-no-crew', route: '/vendor/today', pre: async (p) => { await tapText(p, 'Haldi'); await sleep(1500); } },
  { name: 'day-sheet-five-buttons', route: '/vendor/calendar', pre: async (p) => { await tapText(p, `^${new Date().getDate()}$`); await sleep(1500); }, mark: byText('/^(Move|Crew|Collab|Edit|Cancel)$/') },
  { name: 'weddings-initials', route: '/vendor/calendar', pre: async (p) => { await sleep(1500); await tapText(p, '^Weddings$'); await sleep(1200); }, mark: byText('/^(RS|AV|shoot|recce|Loose engagements)$/i') },
  { name: 'calendar-wording', route: '/vendor/calendar', mark: byText('/^(Anno · 2026|Next engagements|Hot dates)$/i') },
  { name: 'clients-fab-covers', route: '/vendor/clients', pre: async (p) => { await sleep(1000); await tapText(p, '^Aanya Kapoor$'); await sleep(1200); }, mark: `() => [document.querySelector('.wl-fab')]` },
  { name: 'clients-enquiry-in-booked', route: '/vendor/clients', mark: byText('/^(Booked · 3 clients|Enquiry)$/i') },
  { name: 'invoice-two-primaries', route: '/vendor/invoices', pre: async (p) => { await tapText(p, '^Meera and Kunal$'); await sleep(1500); }, mark: byText('/^(↓ Download PDF|Edit Here)$/') },
  { name: 'invoice-new-typed-name', route: '/vendor/invoices', pre: async (p) => { await p.evaluate(() => document.querySelector('.wl-fab').click()); await sleep(1000); }, mark: `() => [...document.querySelectorAll('input')].filter((e) => e.getBoundingClientRect().top > 400).slice(0, 1)` },
  { name: 'attach-package-form', route: '/vendor/today', pre: async (p) => { await tapText(p, '^Aanya Kapoor$'); await sleep(1500); await tapText(p, '^Attach package$'); await sleep(1500); } },
  { name: 'home-done-today-noise', route: '/vendor/today', pre: async (p) => { await p.evaluate(() => document.querySelector('.wl-main').scrollBy(0, 2000)); await sleep(500); }, mark: byText('/^(Done today|Counts cover)/i') },
  { name: 'packages-room', route: '/vendor/packages' },
  { name: 'team-tabs-small', route: '/vendor/team', mark: byText('/^(Team|Tasks|Payments)$/i') },
  { name: 'portfolio-tiny-labels', route: '/vendor/portfolio', mark: byText('/^(\\+ Upload|All|Approved|Pending|Rejected|See your profile as couples do)$/i') },
];
const only = process.argv[2];
for (const j of J) {
  if (only && !only.split(',').includes(j.name)) continue;
  const p = await open(b, j.route, { mode: j.mode || 'dark', vp: j.vp || 'ios' });
  if (j.pre) await j.pre(p);
  if (j.mark) { const n = await p.evaluate((src) => { const els = new Function('return (' + src + ')()')().filter(Boolean); for (const e of els) { e.style.outline = '3px solid #FF2D8A'; e.style.outlineOffset = '1px'; } return els.length; }, j.mark); if (!n) console.log('  (nothing marked)', j.name); }
  if (j.notch) await p.evaluate(() => { const d = document.createElement('div'); d.style.cssText = 'position:fixed;top:0;left:0;right:0;height:47px;z-index:9999;background:rgba(255,45,138,.35);border-bottom:2px solid #FF2D8A;display:flex;justify-content:space-between;align-items:center;padding:0 28px;font:600 16px system-ui;color:#fff'; d.innerHTML = '<span>9:41</span><span style="width:120px;height:32px;border-radius:20px;background:#000"></span><span>100%</span>'; document.body.appendChild(d); });
  await sleep(300);
  await shot(p, `screenshots/findings/${j.name}.png`);
  await p.close(); console.log(j.name);
}
await b.close();
