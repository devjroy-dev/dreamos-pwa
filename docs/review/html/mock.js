// docs/review/html/mock.js · the runtime of the clickable mock-ups. No build step, no server: open any .html here.
//
// Draws a phone with the app's own shell (the header and room head copied out of the running app into shell/, the
// shell's own CSS in shell/shell.css), sets the shell's token variables to a proposed palette (tokens.js, generated from
// the same values as palettes/palettes.json), and puts the proposed screens (screens.js) inside it. Every button that
// carries data-go moves to that screen. Mock-ups only: nothing here touches the app.
(function () {
  var P = window.TDW_PROTO, C = window.TDW_CHROME, PAL = window.TDW_PALETTES;
  var cfg = window.TDW_MOCK || {};
  var qs = new URLSearchParams(location.search);
  var st = {
    screen: qs.get('screen') || cfg.start || 'today',
    palette: qs.get('palette') || cfg.palette || 'ledger',
    mode: qs.get('mode') || cfg.mode || (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
    type: qs.get('type') || cfg.type || 'inter',
    history: [],
  };

  var style = document.createElement('style'); document.head.appendChild(style);
  var phone = document.getElementById('phone');

  function paint() {
    var s = P.SCREENS[st.screen] || P.SCREENS.today;
    var base = s.under ? P.SCREENS[s.under] : s;
    var detail = !P.TABS.some(function (t) { return t[0] === (s.under || st.screen); });
    style.textContent = P.CSS.replace(/\.p-skin/g, '.wl') + P.skinCss(PAL, st.palette, '#phone .wl') +
      '#phone .wl{' + P.typeVars(st.type) + '}' + (detail ? '#phone .wl-roomhead{display:none}' : '');
    var header = C.header.replace(/(<span class="wl-lbl">)[^<]*(<\/span>)/, '$1' + base.title + '$2');
    var head = C.roomhead.replace(/(<h1[^>]*>)[^<]*(<\/h1>)/, '$1' + base.title + '$2');
    phone.innerHTML = '<div class="wl" data-wl-mode="' + st.mode + '" style="' + C.wlStyle.replace('100dvh', '100%') + '">' + header +
      '<main class="wl-main">' + head + '<div class="p-screen">' + base.html() + (s.under ? s.html() : '') + '</div></main>' + P.nav(s.tab) + '</div>';
    document.documentElement.setAttribute('data-mode', st.mode);
    document.querySelectorAll('[data-set]').forEach(function (b) { var kv = b.getAttribute('data-set').split('='); b.setAttribute('aria-pressed', String(st[kv[0]] === kv[1])); });
    document.querySelectorAll('[data-step]').forEach(function (li) { li.classList.toggle('now', li.getAttribute('data-step').split(' ').indexOf(st.screen) >= 0); });
    var cap = document.getElementById('where'); if (cap) cap.textContent = s.title;
  }

  phone.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go]'); if (!t) return;
    var to = t.getAttribute('data-go');
    if (to === '@back') to = (P.SCREENS[st.screen] && P.SCREENS[st.screen].under) || st.history.pop() || 'today';
    else st.history.push(st.screen);
    if (!P.SCREENS[to]) return;
    st.screen = to; paint();
    var m = phone.querySelector('.wl-main'); if (m) m.scrollTop = 0;
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-set]'); if (b) { var kv = b.getAttribute('data-set').split('='); st[kv[0]] = kv[1]; paint(); }
    var r = e.target.closest('[data-restart]'); if (r) { st.screen = cfg.start || 'today'; st.history = []; paint(); }
    var j = e.target.closest('[data-jump]'); if (j) { st.history.push(st.screen); st.screen = j.getAttribute('data-jump'); paint(); }
  });
  paint();
})();
