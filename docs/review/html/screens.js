// docs/review/html/screens.js · the proposed screens, written once.
//
// Read in two places: the in-app prototype page (docs/review/proto/page.tsx, mounted inside the real WorklistShell for
// the screenshots) and the standalone HTML mock-ups (docs/review/html/*.html). Everything is drawn with the shell's
// own tokens (--atelier-*, --role-*) and two proposed ones (--atelier-primary, --atelier-on-primary). A mock-up only;
// no production file reads this.
/* eslint-disable */
(function (root) {
  // Lucide icon paths (the icon set the app already ships as lucide-react), 24 grid, 2px stroke
  var ICON = {
    back: '<path d="m15 18-6-6 6-6"/>',
    chev: '<path d="m9 18 6-6-6-6"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    today: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
  };
  function ic(name, size) { return '<svg class="p-ic" width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + '</svg>'; }
  function go(id, label, cls, icon) { return '<button type="button" class="' + (cls || 'p-btn') + '" data-go="' + id + '">' + (icon ? ic(icon, 18) : '') + '<span>' + label + '</span></button>'; }
  function row(o) {
    return '<button type="button" class="p-row"' + (o.go ? ' data-go="' + o.go + '"' : '') + '>' +
      (o.time ? '<span class="p-rowtime">' + o.time + '</span>' : '') +
      '<span class="p-rowmain"><span class="p-rowtitle">' + o.title + '</span>' + (o.meta ? '<span class="p-rowmeta">' + o.meta + '</span>' : '') + (o.extra || '') + '</span>' +
      (o.right ? '<span class="p-rowright">' + o.right + '</span>' : '') + '<span class="p-rowchev">' + ic('chev', 18) + '</span></button>';
  }
  function pill(text, kind) { return '<span class="p-pill p-pill-' + (kind || 'plain') + '">' + text + '</span>'; }
  function crew(list) {
    return '<span class="p-crew">' + list.map(function (c) { return '<span class="p-crewone ' + (c[1] ? 'ok' : 'wait') + '">' + (c[1] ? ic('check', 14) : ic('clock', 14)) + c[0] + '</span>'; }).join('') + '</span>';
  }
  function section(title, body, action) { return '<section class="p-sec"><div class="p-sechead"><h2 class="p-sectitle">' + title + '</h2>' + (action || '') + '</div>' + body + '</section>'; }
  function card(body, cls) { return '<div class="p-card ' + (cls || '') + '">' + body + '</div>'; }
  function bar(buttons) { return '<div class="p-bar">' + buttons + '</div>'; }
  function back(to, label) { return '<button type="button" class="p-back" data-go="' + to + '">' + ic('back', 20) + '<span>' + label + '</span></button>'; }
  function sheet(title, body, foot) { return '<div class="p-scrim" data-go="@back"></div><div class="p-sheet" role="dialog" aria-label="' + title + '"><div class="p-grab"></div><div class="p-sheethead"><h2 class="p-sheettitle">' + title + '</h2><button type="button" class="p-iconbtn" aria-label="Close" data-go="@back">' + ic('x', 20) + '</button></div><div class="p-sheetbody">' + body + '</div>' + (foot ? '<div class="p-sheetfoot">' + foot + '</div>' : '') + '</div>'; }
  function money(paid, total) { var pct = Math.round(paid / total * 100); return '<div class="p-meter" role="img" aria-label="' + pct + ' percent paid"><span style="width:' + pct + '%"></span></div>'; }
  function fact(k, v) { return '<div class="p-fact"><span class="p-factk">' + k + '</span><span class="p-factv">' + v + '</span></div>'; }

  // ── THE SCREENS. `tab` is the bottom bar seat; `under` is the screen a sheet sits over. ────────────────────────────
  var S = {};

  S.today = { tab: 'today', title: 'Today', html: function () {
    return '<p class="p-date">Monday 28 September</p>' +
      '<button type="button" class="p-check" data-go="date">' + ic('search', 18) + '<span>Check a date</span></button>' +
      section('Reply to', row({ go: 'lead', title: 'Aanya Kapoor', meta: '“Please do, and the Sangeet too.” · 3 hours ago', extra: '<span class="p-rowmeta">14 Feb 2027 · Jaipur · Rs 15 to 25 lakh</span>', right: pill('New', 'accent') }), '<span class="p-count">1</span>') +
      section('Today', row({ go: 'event', time: '10:00', title: 'Haldi · Meera and Kunal', meta: 'Hyatt Regency, Delhi', extra: crew([['Rhea', true]]) }) +
        row({ go: 'event', time: '19:00', title: 'Sangeet · Meera and Kunal', meta: 'Hyatt Regency, Delhi', extra: crew([['Rhea', true], ['Arjun', false]]) }),
        go('week', 'This week', 'p-link')) +
      section('Money due', row({ go: 'money', title: 'Rs 3,40,000 owed', meta: '2 clients · next due 1 Oct, Meera and Kunal', right: '' })) ;
  } };

  S.week = { tab: 'today', title: 'This week', html: function () {
    return back('today', 'Today') +
      '<div class="p-seg" role="tablist"><button class="on" role="tab" type="button">This week</button><button type="button" role="tab" data-go="calendar">Month</button></div>' +
      '<h3 class="p-day">Mon 28 Sep · today</h3>' +
      row({ go: 'event', time: '10:00', title: 'Haldi · Meera and Kunal', meta: 'Hyatt Regency, Delhi', extra: crew([['Rhea', true]]) }) +
      row({ go: 'event', time: '19:00', title: 'Sangeet · Meera and Kunal', meta: 'Hyatt Regency, Delhi', extra: crew([['Rhea', true], ['Arjun', false]]) }) +
      '<h3 class="p-day">Tue 29 Sep</h3>' +
      row({ go: 'event', time: '20:00', title: 'Wedding · Meera and Kunal', meta: 'Hyatt Regency, Delhi', extra: '<span class="p-gap">' + ic('users', 14) + 'No crew yet</span>' }) +
      '<h3 class="p-day">Wed 30 Sep</h3>' +
      row({ go: 'event', time: '11:00', title: 'Recce · ITC Grand', meta: 'Delhi', extra: '<span class="p-rowmeta">Just you</span>' }) +
      '<h3 class="p-day">Thu 1 Oct to Sun 4 Oct</h3><p class="p-quiet">Nothing booked.</p>';
  } };

  S.event = { tab: 'today', title: 'Sangeet', html: function () {
    return back('today', 'Today') +
      '<h2 class="p-title">Sangeet · Meera and Kunal</h2>' +
      card(fact('When', 'Today, 28 Sep · 19:00') + fact('Where', 'Hyatt Regency, Delhi') + fact('Client', '<button type="button" class="p-inlink" data-go="client">Meera and Kunal</button>')) +
      section('Crew', row({ title: 'Rhea Sharma', meta: 'Second shooter · Rs 6,000', right: pill('Confirmed', 'ok') }) +
        row({ title: 'Arjun Verma', meta: 'Cinematographer · Rs 9,000', right: pill('Not yet replied', 'warn') }), go('event', 'Change crew', 'p-link')) +
      section('Notes', '<p class="p-body">Sangeet starts after dinner. Family photos first.</p>') +
      bar(go('event', 'Message crew', 'p-btn p-primary', 'chat') + '<button type="button" class="p-btn p-more" aria-label="More">' + ic('more', 20) + '</button>');
  } };

  S.date = { tab: 'today', under: 'today', title: 'Check a date', html: function () {
    return sheet('Check a date',
      '<label class="p-label">Date<input class="p-input" value="Sunday 14 February 2027" readonly></label>' +
      '<div class="p-answer ok">' + ic('check', 22) + '<div><strong>Free all day</strong><span>Nothing booked or blocked.</span></div></div>' +
      '<div class="p-answernote"><p>1 enquiry asks for this date: <button type="button" class="p-inlink" data-go="lead">Aanya Kapoor</button>.</p><p>13 Feb is booked: Sangeet for Aanya Kapoor, if confirmed.</p></div>',
      go('date', 'Hold this date', 'p-btn') + go('calendar', 'Open in calendar', 'p-btn p-primary'));
  } };

  S.calendar = { tab: 'calendar', title: 'Calendar', html: function () {
    var days = ''; var start = 1; // Feb 2027 starts on a Monday
    days += '<span class="p-cal-empty"></span>';
    for (var d = 1; d <= 28; d += 1) {
      var cls = d === 13 ? 'booked' : d === 14 ? 'asked' : d === 20 || d === 21 ? 'booked' : d === 6 ? 'blocked' : '';
      days += '<button type="button" class="p-calday ' + cls + (d === 14 ? ' sel' : '') + '">' + d + '</button>';
    }
    return '<div class="p-calhead"><button type="button" class="p-iconbtn" aria-label="Previous month">' + ic('back', 20) + '</button><button type="button" class="p-calmonth">February 2027 ' + ic('chev', 16) + '</button><button type="button" class="p-iconbtn" aria-label="Next month">' + ic('chev', 20) + '</button></div>' +
      '<div class="p-calgrid"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>' + days + '</div>' +
      '<div class="p-legend"><span><i class="booked"></i>Booked</span><span><i class="asked"></i>Enquiry</span><span><i class="blocked"></i>Blocked</span></div>' +
      section('Sunday 14 February', '<div class="p-answer ok small">' + ic('check', 18) + '<div><strong>Free</strong><span>1 enquiry: Aanya Kapoor</span></div></div>', '') +
      bar(go('calendar', 'Block this date', 'p-btn') + go('calendar', 'Add a booking', 'p-btn p-primary', 'plus'));
  } };

  S.leads = { tab: 'leads', title: 'Enquiries', html: function () {
    return '<div class="p-search">' + ic('search', 18) + '<span>Search by name or number</span></div>' +
      '<div class="p-seg" role="tablist"><button class="on" type="button">New 1</button><button type="button">Replied 1</button><button type="button">Quoted</button><button type="button">All</button></div>' +
      row({ go: 'lead', title: 'Aanya Kapoor', meta: '14 Feb 2027 · Jaipur · Rs 15 to 25 lakh', extra: '<span class="p-rowmeta">“Please do, and the Sangeet too.”</span>', right: '<span class="p-ago">3h</span>' }) +
      row({ go: 'lead', title: '+91 98111 00002', meta: 'March 2027 · city not given', right: '<span class="p-ago">10d</span>' }) +
      '<p class="p-quiet">Booked enquiries move to Clients.</p>';
  } };

  S.lead = { tab: 'leads', title: 'Enquiry', html: function () {
    return back('leads', 'Enquiries') +
      '<h2 class="p-title">Aanya Kapoor</h2>' +
      '<p class="p-sub">14 Feb 2027 · Jaipur · Rs 15 to 25 lakh · from TDW</p>' +
      '<div class="p-answer ok small">' + ic('check', 18) + '<div><strong>You are free on 14 Feb</strong><span>13 Feb is also free for the Sangeet.</span></div></div>' +
      section('Conversation',
        '<div class="p-msg in">Hi, are you free on 14 Feb 2027 in Jaipur?<small>20 Sep, 12:01</small></div>' +
        '<div class="p-msg out">Yes, that date is open. Shall I share the packages?<small>20 Sep, 12:10 · TDW replied for you</small></div>' +
        '<div class="p-msg in">Please do, and the Sangeet too.<small>20 Sep, 12:32</small></div>') +
      section('Quick replies', '<div class="p-chips"><button type="button" class="p-chip">Share packages</button><button type="button" class="p-chip">Ask for a call time</button><button type="button" class="p-chip">Date is free</button></div>') +
      bar(go('lead', 'Reply', 'p-btn', 'chat') + go('book', 'Book', 'p-btn p-primary', 'check') + '<button type="button" class="p-btn p-more" aria-label="More: call, forward, mark lost, delete">' + ic('more', 20) + '</button>');
  } };

  S.book = { tab: 'leads', under: 'lead', title: 'Book Aanya Kapoor', html: function () {
    return sheet('Book Aanya Kapoor',
      '<p class="p-label">Package</p>' +
      '<div class="p-radio"><button type="button" class="p-radioone">Wedding day<span>Rs 1,50,000 · one day, two shooters</span></button><button type="button" class="p-radioone on">Full wedding<span>Rs 3,80,000 · three functions, film, album</span></button></div>' +
      '<label class="p-label">Fee for this couple<input class="p-input" value="Rs 3,80,000"></label>' +
      '<label class="p-label">Dates<input class="p-input" value="13 and 14 Feb 2027, Jaipur"></label>' +
      '<label class="p-label">Advance received<input class="p-input" value="Rs 1,14,000 (30 percent)"></label>' +
      '<p class="p-hint">Booking adds the two days to your calendar and makes the invoice with the payment plan: 30 percent now, 40 percent on 14 Jan, the rest on delivery.</p>',
      go('client', 'Book and make invoice', 'p-btn p-primary p-wide'));
  } };

  S.client = { tab: 'clients', title: 'Client', html: function () {
    return back('clients', 'Clients') +
      '<h2 class="p-title">Meera and Kunal</h2>' +
      '<p class="p-sub">Full wedding · 28 and 29 Sep 2026 · Delhi</p>' +
      card('<div class="p-moneyline"><span><strong>Rs 1,90,000</strong> paid of Rs 3,80,000</span><span class="p-owed">Rs 1,90,000 due 1 Oct</span></div>' + money(190000, 380000) +
        '<div class="p-cardacts">' + go('invoice', 'Send reminder', 'p-btn') + go('money', 'Record payment', 'p-btn') + '</div>') +
      section('Functions', row({ go: 'event', time: 'Today', title: 'Haldi · 10:00', meta: 'Hyatt Regency', extra: crew([['Rhea', true]]) }) +
        row({ go: 'event', time: 'Today', title: 'Sangeet · 19:00', meta: 'Hyatt Regency', extra: crew([['Rhea', true], ['Arjun', false]]) }) +
        row({ go: 'event', time: '29 Sep', title: 'Wedding · 20:00', meta: 'Hyatt Regency', extra: '<span class="p-gap">' + ic('users', 14) + 'No crew yet</span>' })) +
      section('Invoices', row({ go: 'invoice', title: 'TDW 0003', meta: 'Rs 3,80,000 · sent 1 Sep', right: pill('Part paid', 'warn') })) +
      section('Notes', '<p class="p-body">Haldi, Sangeet, Wedding. Delhi. Kunal’s sister is the contact on the day.</p>') +
      bar(go('client', 'WhatsApp', 'p-btn', 'chat') + go('client', 'Call', 'p-btn', 'phone') + '<button type="button" class="p-btn p-more" aria-label="More">' + ic('more', 20) + '</button>');
  } };

  S.clients = { tab: 'clients', title: 'Clients', html: function () {
    return '<div class="p-search">' + ic('search', 18) + '<span>Search clients</span></div>' +
      row({ go: 'client', title: 'Meera and Kunal', meta: '28 Sep 2026 · Delhi', extra: money(190000, 380000), right: '<span class="p-amt">Rs 1,90,000<small>due</small></span>' }) +
      row({ go: 'client', title: 'Aanya Kapoor', meta: '13 Feb 2027 · Jaipur', extra: money(100000, 250000), right: '<span class="p-amt">Rs 1,50,000<small>due</small></span>' }) +
      row({ go: 'client', title: 'Rohan Mehta', meta: '12 Dec 2026 · Udaipur', right: '<span class="p-amt ok">Paid</span>' });
  } };

  S.money = { tab: 'money', title: 'Money', html: function () {
    return card('<p class="p-kicker">Owed to you</p><p class="p-big">Rs 3,40,000</p><p class="p-sub">2 clients · Rs 4,10,000 collected this year</p>') +
      '<div class="p-seg" role="tablist"><button class="on" type="button">Owed</button><button type="button">Paid</button><button type="button">Expenses</button></div>' +
      row({ go: 'client', title: 'Meera and Kunal', meta: 'TDW 0003 · due 1 Oct, in 3 days', right: '<span class="p-amt">Rs 1,90,000</span>' }) +
      row({ go: 'client', title: 'Aanya Kapoor', meta: 'TDW 0001 · due 15 Jan 2027', right: '<span class="p-amt">Rs 1,50,000</span>' }) +
      bar(go('invoice', 'New invoice', 'p-btn p-primary p-wide', 'plus'));
  } };

  S.invoice = { tab: 'clients', under: 'client', title: 'Send invoice', html: function () {
    return sheet('Send to Meera and Kunal',
      '<div class="p-invoice"><div class="p-invhead"><strong>TDW 0003</strong><span>Probe Studio</span></div>' +
      fact('Full wedding', 'Rs 3,80,000') + fact('Paid', 'Rs 1,90,000') + fact('Due 1 Oct 2026', '<strong>Rs 1,90,000</strong>') + '</div>' +
      '<label class="p-label">Message<textarea class="p-input" rows="3">Hi Meera and Kunal, here is the invoice for the Full wedding. Rs 1,90,000 is due on 1 Oct. You can pay by UPI from the link.</textarea></label>',
      go('invoice', 'PDF', 'p-btn', 'file') + go('money', 'Send on WhatsApp', 'p-btn p-primary', 'send'));
  } };

  // ── THE PROPOSED BOTTOM BAR: five seats, the five daily jobs ─────────────────────────────────────────────────────
  var TABS = [['today', 'Today', 'today'], ['leads', 'Enquiries', 'inbox'], ['calendar', 'Calendar', 'cal'], ['clients', 'Clients', 'users'], ['money', 'Money', 'money']];
  function nav(active) {
    return '<nav class="p-nav" aria-label="Sections">' + TABS.map(function (t) { return '<button type="button" class="p-seat' + (t[0] === active ? ' on' : '') + '" data-go="' + t[0] + '"' + (t[0] === active ? ' aria-current="page"' : '') + '>' + ic(t[2], 22) + '<span>' + t[1] + '</span></button>'; }).join('') + '</nav>';
  }

  // ── THE PROPOSED TYPE, as rungs (Inter; see REPORT.md, Type). rem, so the phone's text size setting scales them ─
  var TYPE = {
    inter: { family: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", brand: "'Inter', system-ui, sans-serif" },
    plex: { family: "'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", brand: "'Cormorant Garamond', Georgia, serif" },
    today: { family: "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif", brand: "var(--font-dm-sans), 'DM Sans', sans-serif" },
  };
  function typeVars(k) {
    var f = TYPE[k || 'inter'].family;
    return '--p-font:' + f + ';--p-brand:' + TYPE[k || 'inter'].brand + ';' +
      '--p-t1:600 1.375rem/1.27 ' + f + ';' +   // 22px page title
      '--p-t2:600 1.0625rem/1.35 ' + f + ';' +  // 17px section title
      '--p-t3:400 1rem/1.5 ' + f + ';' +        // 16px body
      '--p-t3m:500 1rem/1.4 ' + f + ';' +       // 16px row title
      '--p-t4:400 0.875rem/1.43 ' + f + ';' +   // 14px second line
      '--p-t4b:600 0.9375rem/1.33 ' + f + ';' + // 15px buttons
      '--p-t5:500 0.8125rem/1.38 ' + f + ';' +  // 13px small, the floor
      '--p-big:600 1.75rem/1.15 ' + f + ';';    // 28px the one big figure
  }

  var CSS = [
    // the shell's own rungs follow the proposed type, so the real chrome reads in it too
    '.p-skin{--wl-t0:var(--p-big);--wl-t1:var(--p-t1);--wl-t2:var(--p-t2);--wl-t3:var(--p-t3);--wl-t4:var(--p-t4);--wl-t5:var(--p-t5);font-family:var(--p-font)}',
    '.p-skin .wl-house{font:600 1.0625rem/1.2 var(--p-brand);letter-spacing:0}',
    '.p-skin .wl-lbl,.p-skin .wl-beta{letter-spacing:0;text-transform:none;font:var(--p-t5)}',
    '.p-skin .wl-roomtitle{font:var(--p-t1)}',
    '.p-skin .wl-dockfield{font:var(--p-t4)}',
    '.p-skin .wl-docksend{background:var(--atelier-primary,var(--atelier-accent-text));color:var(--atelier-on-primary,var(--role-ink-deep));width:36px;height:36px}',
    '.p-skin .wl-fab{display:none}',
    '.p-skin .wl-nav{display:none}',
    '.p-skin .wl-dock{display:none}',
    '.p-screen{padding:0 var(--wl-gutter,16px) 120px;color:var(--atelier-ink);font:var(--p-t3)}',
    '.p-ic{flex-shrink:0;display:block}',
    '.p-date{font:var(--p-t4);color:var(--atelier-ink-mute);margin:0 0 12px}',
    '.p-check{display:flex;align-items:center;gap:10px;width:100%;min-height:48px;padding:0 14px;border-radius:12px;border:1px solid var(--atelier-card-border);background:var(--atelier-card-bg);color:var(--atelier-ink-mute);font:var(--p-t3);text-align:left;cursor:pointer}',
    '.p-sec{margin-top:24px}',
    '.p-sechead{display:flex;align-items:center;justify-content:space-between;min-height:32px;margin-bottom:8px}',
    '.p-sectitle{font:var(--p-t2);margin:0;color:var(--atelier-ink)}',
    '.p-count{font:var(--p-t5);color:var(--atelier-ink-mute)}',
    '.p-link{background:none;border:0;padding:0 4px;min-height:44px;color:var(--atelier-accent-text);font:var(--p-t4b);cursor:pointer}',
    '.p-inlink{background:none;border:0;padding:0;color:var(--atelier-accent-text);font:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}',
    '.p-row{display:flex;align-items:flex-start;gap:12px;width:100%;min-height:64px;padding:12px 12px 12px 14px;margin:0 0 8px;border-radius:12px;border:1px solid var(--atelier-card-border);background:var(--atelier-card-bg);color:var(--atelier-ink);text-align:left;cursor:pointer;font:var(--p-t3)}',
    '.p-row:active{background:var(--atelier-row-hover)}',
    '.p-rowtime{font:var(--p-t3m);font-variant-numeric:tabular-nums;min-width:48px;color:var(--atelier-ink)}',
    '.p-rowmain{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
    '.p-rowtitle{font:var(--p-t3m);color:var(--atelier-ink)}',
    '.p-rowmeta{font:var(--p-t4);color:var(--atelier-ink-mute)}',
    '.p-rowright{align-self:center;flex-shrink:0}',
    '.p-rowchev{align-self:center;color:var(--atelier-ink-mute)}',
    '.p-pill{display:inline-block;font:var(--p-t5);padding:3px 10px;border-radius:999px;border:1px solid currentColor;white-space:nowrap}',
    '.p-pill-accent{color:var(--atelier-accent-text)}.p-pill-ok{color:var(--role-positive)}.p-pill-warn{color:var(--role-caution)}.p-pill-plain{color:var(--atelier-ink-dim)}',
    '.p-crew{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}',
    '.p-crewone{display:inline-flex;align-items:center;gap:4px;font:var(--p-t5);padding:3px 8px 3px 6px;border-radius:999px;background:var(--atelier-section-bg);border:1px solid var(--atelier-card-border)}',
    '.p-crewone.ok{color:var(--role-positive)}.p-crewone.wait{color:var(--role-caution)}',
    '.p-gap{display:inline-flex;align-items:center;gap:6px;margin-top:6px;font:var(--p-t5);color:var(--role-critical)}',
    '.p-ago{font:var(--p-t5);color:var(--atelier-ink-mute)}',
    '.p-amt{display:flex;flex-direction:column;align-items:flex-end;font:var(--p-t3m);font-variant-numeric:tabular-nums}.p-amt small{font:var(--p-t5);color:var(--atelier-ink-mute)}.p-amt.ok{color:var(--role-positive)}',
    '.p-back{display:inline-flex;align-items:center;gap:4px;min-height:44px;margin:-4px 0 4px -8px;padding:0 8px;background:none;border:0;color:var(--atelier-accent-text);font:var(--p-t4b);cursor:pointer}',
    '.p-title{font:var(--p-t1);margin:4px 0 4px;color:var(--atelier-ink)}',
    '.p-sub{font:var(--p-t4);color:var(--atelier-ink-mute);margin:0 0 16px}',
    '.p-card{border-radius:12px;border:1px solid var(--atelier-card-border);background:var(--atelier-card-bg);padding:4px 14px;margin-bottom:8px}',
    '.p-fact{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid var(--atelier-card-border);font:var(--p-t3)}.p-fact:last-child{border-bottom:0}',
    '.p-factk{color:var(--atelier-ink-mute)}.p-factv{text-align:right;color:var(--atelier-ink)}',
    '.p-body{font:var(--p-t3);color:var(--atelier-ink-soft);margin:0}',
    '.p-quiet{font:var(--p-t4);color:var(--atelier-ink-mute);margin:16px 0}',
    '.p-bar{position:fixed;left:0;right:0;bottom:calc(64px + env(safe-area-inset-bottom));display:flex;gap:8px;padding:10px var(--wl-gutter,16px);background:var(--atelier-page-bg);border-top:1px solid var(--atelier-card-border);z-index:15}',
    '.p-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:0 14px;border-radius:12px;border:1px solid var(--atelier-card-border);background:var(--atelier-card-bg);color:var(--atelier-ink);font:var(--p-t4b);cursor:pointer;white-space:nowrap}',
    '.p-primary{background:var(--atelier-primary,var(--atelier-accent-text));border-color:var(--atelier-primary,var(--atelier-accent-text));color:var(--atelier-on-primary,var(--role-ink-deep))}',
    '.p-more{flex:0 0 48px;padding:0}',
    '.p-wide{flex:1 1 100%}',
    '.p-iconbtn{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:none;border:0;color:var(--atelier-ink-dim);cursor:pointer}',
    '.p-nav{position:fixed;left:0;right:0;bottom:0;display:flex;background:var(--atelier-header-bg);border-top:1px solid var(--atelier-card-border);padding-bottom:env(safe-area-inset-bottom);z-index:16}',
    '.p-seat{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:64px;background:none;border:0;color:var(--atelier-ink-mute);font:var(--p-t5);cursor:pointer}',
    '.p-seat.on{color:var(--atelier-accent-text)}',
    // the bar's labels are capped (as iOS caps its own tab bar), so five seats still fit at the largest text size
    '.p-seat span{font-size:min(0.8125rem,14px);line-height:1.2;max-width:100%;overflow-wrap:anywhere;text-align:center}',
    '.p-scrim{position:fixed;inset:0;background:var(--role-scrim);z-index:30}',
    '.p-sheet{position:fixed;left:0;right:0;bottom:0;max-height:88dvh;display:flex;flex-direction:column;background:var(--atelier-sheet-bg);border-radius:16px 16px 0 0;border-top:1px solid var(--atelier-sheet-border);z-index:31;padding-bottom:env(safe-area-inset-bottom)}',
    '.p-grab{width:40px;height:4px;border-radius:2px;background:var(--atelier-ink-mute);opacity:.5;margin:8px auto 0}',
    '.p-sheethead{display:flex;align-items:center;justify-content:space-between;padding:4px 8px 4px var(--wl-gutter,16px)}',
    '.p-sheettitle{font:var(--p-t2);margin:0}',
    '.p-sheetbody{overflow:auto;padding:4px var(--wl-gutter,16px) 12px}',
    '.p-sheetfoot{display:flex;flex-wrap:wrap;gap:8px;padding:12px var(--wl-gutter,16px) 16px;border-top:1px solid var(--atelier-sheet-border)}',
    '.p-label{display:block;font:var(--p-t5);color:var(--atelier-ink-dim);margin:14px 0 6px}',
    '.p-label .p-input{margin-top:6px}',
    '.p-input{display:block;width:100%;box-sizing:border-box;min-height:48px;padding:12px 14px;border-radius:10px;border:1px solid var(--atelier-input-border);background:var(--atelier-input-bg);color:var(--atelier-ink);font:var(--p-t3);resize:none}',
    '.p-hint{font:var(--p-t4);color:var(--atelier-ink-mute);margin:14px 0 0}',
    '.p-answer{display:flex;gap:12px;align-items:flex-start;margin-top:16px;padding:14px;border-radius:12px;border:1px solid var(--role-positive);color:var(--role-positive)}',
    '.p-answer div{display:flex;flex-direction:column;gap:2px}.p-answer strong{font:var(--p-t2)}.p-answer span{font:var(--p-t4);color:var(--atelier-ink-soft)}',
    '.p-answer.small{margin:0 0 8px;padding:12px}.p-answer.small strong{font:var(--p-t3m)}',
    '.p-answernote{font:var(--p-t4);color:var(--atelier-ink-soft)}.p-answernote p{margin:12px 0 0}',
    '.p-msg{max-width:84%;padding:10px 12px;border-radius:14px;margin:0 0 8px;font:var(--p-t3);background:var(--atelier-card-bg);border:1px solid var(--atelier-card-border)}',
    '.p-msg small{display:block;margin-top:4px;font:var(--p-t5);color:var(--atelier-ink-mute)}',
    '.p-msg.out{margin-left:auto;background:var(--atelier-section-bg)}',
    '.p-chips{display:flex;flex-wrap:wrap;gap:8px}',
    '.p-chip{min-height:40px;padding:0 14px;border-radius:999px;border:1px solid var(--atelier-card-border);background:var(--atelier-card-bg);color:var(--atelier-ink);font:var(--p-t4);cursor:pointer}',
    '.p-seg{display:flex;gap:4px;padding:4px;margin:0 0 12px;border-radius:12px;background:var(--atelier-section-bg);border:1px solid var(--atelier-card-border)}',
    '.p-seg button{flex:1;min-height:40px;border-radius:9px;border:0;background:none;color:var(--atelier-ink-dim);font:var(--p-t4b);cursor:pointer;white-space:nowrap}',
    '.p-seg button.on{background:var(--atelier-card-bg);color:var(--atelier-ink);box-shadow:0 1px 2px var(--atelier-card-shadow)}',
    '.p-search{display:flex;align-items:center;gap:10px;min-height:48px;padding:0 14px;margin-bottom:12px;border-radius:12px;background:var(--atelier-input-bg);border:1px solid var(--atelier-card-border);color:var(--atelier-ink-mute);font:var(--p-t3)}',
    '.p-day{font:var(--p-t5);color:var(--atelier-ink-dim);margin:18px 0 8px}',
    '.p-radio{display:flex;flex-direction:column;gap:8px}',
    '.p-radioone{display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-height:56px;padding:10px 14px;border-radius:12px;border:1px solid var(--atelier-card-border);background:var(--atelier-card-bg);color:var(--atelier-ink);font:var(--p-t3m);text-align:left;cursor:pointer}',
    '.p-radioone span{font:var(--p-t4);color:var(--atelier-ink-mute)}',
    '.p-radioone.on{border:2px solid var(--atelier-primary,var(--atelier-accent-text))}',
    '.p-moneyline{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 12px;padding-top:12px;font:var(--p-t4);color:var(--atelier-ink-soft)}.p-moneyline strong{font:var(--p-t3m);color:var(--atelier-ink)}',
    '.p-owed{color:var(--role-caution)}',
    '.p-meter{height:6px;border-radius:3px;background:var(--atelier-section-bg);overflow:hidden;margin:10px 0 4px}.p-meter span{display:block;height:100%;background:var(--role-positive)}',
    '.p-cardacts{display:flex;gap:8px;padding:10px 0 12px}',
    '.p-kicker{font:var(--p-t5);color:var(--atelier-ink-dim);margin:12px 0 0}',
    '.p-big{font:var(--p-big);margin:4px 0;font-variant-numeric:tabular-nums}',
    '.p-calhead{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}',
    '.p-calmonth{display:inline-flex;align-items:center;gap:6px;min-height:44px;background:none;border:0;color:var(--atelier-ink);font:var(--p-t2);cursor:pointer}',
    '.p-calgrid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center}',
    '.p-calgrid>span{font:var(--p-t5);color:var(--atelier-ink-mute);padding:6px 0}',
    '.p-calday{height:44px;border-radius:10px;border:0;background:none;color:var(--atelier-ink);font:var(--p-t3);cursor:pointer;position:relative}',
    '.p-calday.booked{background:var(--atelier-primary,var(--atelier-accent-text));color:var(--atelier-on-primary,var(--role-ink-deep));font-weight:600}',
    '.p-calday.asked{box-shadow:inset 0 0 0 2px var(--role-caution)}',
    '.p-calday.blocked{color:var(--atelier-ink-mute);text-decoration:line-through}',
    '.p-calday.sel{outline:2px solid var(--atelier-ink);outline-offset:1px}',
    '.p-legend{display:flex;gap:16px;margin:12px 0 0;font:var(--p-t5);color:var(--atelier-ink-dim)}',
    '.p-legend i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:6px;vertical-align:-1px}',
    '.p-legend i.booked{background:var(--atelier-primary,var(--atelier-accent-text))}.p-legend i.asked{box-shadow:inset 0 0 0 2px var(--role-caution)}.p-legend i.blocked{background:var(--atelier-ink-mute);opacity:.5}',
    '.p-invoice{border:1px solid var(--atelier-card-border);border-radius:12px;padding:4px 14px;background:var(--atelier-card-bg);margin-top:4px}',
    '.p-invhead{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--atelier-card-border);font:var(--p-t4);color:var(--atelier-ink-mute)}.p-invhead strong{font:var(--p-t3m);color:var(--atelier-ink)}',
  ].join('\n');

  // palette → CSS that sets the shell's own variables on its own scope (the same names theme.ts emits)
  function skinCss(palettes, key, sel) {
    var p = palettes[key]; if (!p) return '';
    var ROLE = ['metal', 'ink-on-metal', 'ink-deep', 'positive', 'caution', 'critical', 'scrim', 'sheet', 'today-coin-ink'];
    var emit = function (m) { return Object.keys(m).map(function (k) { return (ROLE.indexOf(k) >= 0 ? '--role-' : '--atelier-') + k + ':' + m[k] + '!important;'; }).join(''); };
    return (sel || '.wl') + '[data-wl-mode="dark"]{' + emit(p.dark) + '}' + (sel || '.wl') + '[data-wl-mode="light"]{' + emit(p.light) + '}';
  }

  root.TDW_PROTO = { SCREENS: S, CSS: CSS, nav: nav, typeVars: typeVars, skinCss: skinCss, TABS: TABS };
})(typeof window !== 'undefined' ? window : globalThis);
