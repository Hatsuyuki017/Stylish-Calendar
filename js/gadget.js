/* gadget.js — the desktop panel.
 *
 * Reads the same ledger the app does (the native host hands it over), and
 * shows the three things worth glancing at: today against the goal, the week,
 * and the shape of the last ten weeks. Everything else is one click away.
 */
(function (window) {
  'use strict';

  var U = window.U, Store = window.Store, I18n = window.I18n, T = window.T, Fonts = window.Fonts;
  var Native = window.LedgerNative || null;

  var WEEKS = 10;              // how much history the strip shows

  function send(command) {
    if (Native && Native.send) Native.send(command);
  }

  function level(mins, peak) {
    if (!mins) return 0;
    return U.clamp(Math.ceil(mins / peak * 4), 1, 4);
  }

  /** Consecutive days with any time, counting back from today. */
  function streak(byDay) {
    var n = 0;
    var cursor = U.key(new Date());
    if (!byDay[cursor]) cursor = U.key(U.addDays(new Date(), -1));
    while (byDay[cursor]) {
      n++;
      cursor = U.key(U.addDays(U.date(cursor), -1));
    }
    return n;
  }

  function ring(pct) {
    var r = 21, c = 2 * Math.PI * r;
    var off = c * (1 - U.clamp(pct, 0, 1));
    return '<svg class="g-ring" width="54" height="54" viewBox="0 0 54 54" aria-hidden="true">' +
      '<circle class="track" cx="27" cy="27" r="' + r + '"/>' +
      '<circle class="arc" cx="27" cy="27" r="' + r + '"' +
        ' stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + off.toFixed(2) + '"/>' +
      '<text x="27" y="30.5">' + Math.round(pct * 100) + '%</text>' +
    '</svg>';
  }

  function render() {
    var s = Store.settings;
    var today = U.key(new Date());

    // The strip runs to the end of this week so today never sits on the edge.
    var end = U.addDays(U.startOfWeek(new Date(), s.weekStart), 6);
    var start = U.addDays(end, -(WEEKS * 7 - 1));
    var byDay = Store.minutesByDay(U.key(start), U.key(end));

    var todayMins = byDay[today] || 0;
    var wkStart = U.key(U.startOfWeek(new Date(), s.weekStart));
    var wkEnd = U.key(U.addDays(U.date(wkStart), 6));
    var week = 0;
    U.eachDay(wkStart, wkEnd, function (k) { week += byDay[k] || 0; });

    var goal = s.goal || 0;
    var peak = s.heatPeak || 360;

    var cells = '';
    for (var i = 0; i < WEEKS * 7; i++) {
      var d = U.addDays(start, i);
      var k = U.key(d);
      var m = byDay[k] || 0;
      var future = k > today;
      cells += '<span class="g-cell' + (k === today ? ' is-today' : '') + (future ? ' is-void' : '') + '"' +
               ' data-lvl="' + (future ? 0 : level(m, peak)) + '"' +
               ' title="' + U.esc(U.fmtDay(k) + ' · ' + U.dur(m)) + '"></span>';
    }

    // What today actually went into, biggest first.
    var b = Store.breakdown(today, today);
    var rows = Store.itemRows(b).slice(0, 3).map(function (it) {
      return '<div class="g-row"><span class="g-row__k">' + U.esc(it.name) + '</span>' +
             '<span class="g-row__v">' + U.dur(it.minutes) + '</span></div>';
    }).join('');
    if (!rows) {
      rows = '<div class="g-row"><span class="g-row__k">' + U.esc(T('meter.week')) + '</span>' +
             '<span class="g-row__v">' + U.dur(week) + '</span></div>';
    }

    var run = streak(byDay);
    var pinned = document.documentElement.dataset.level === 'desktop';

    document.getElementById('g').innerHTML =
      '<div class="g__head">' +
        '<span class="g__mark">' + U.esc(T('app.name')) + '</span>' +
        '<span class="g__pin">' +
          '<button class="iconbtn" type="button" data-cmd="' + (pinned ? 'float-gadget' : 'pin-gadget') + '"' +
            ' title="' + U.esc(pinned ? 'Float on top' : 'Pin to desktop') + '">' +
            '<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">' +
              (pinned
                ? '<path d="M6 1.5v9M2.5 5 6 1.5 9.5 5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
                : '<path d="M6 10.5v-9M2.5 7 6 10.5 9.5 7" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>') +
            '</svg>' +
          '</button>' +
        '</span>' +
      '</div>' +

      '<div class="g__today">' +
        (goal ? ring(todayMins / goal) : '') +
        '<div class="g-today">' +
          '<div class="g-today__k">' + U.esc(T('meter.today')) + '</div>' +
          '<div class="g-today__v">' + U.dur(todayMins) + '</div>' +
          '<div class="g-today__s">' +
            U.esc(T('meter.week') + ' · ' + U.dur(week)) +
            (run ? ' · ' + U.esc(I18n.tn('hm.nDays', run)) : '') +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="g__rows">' + rows + '</div>' +

      '<div class="g__strip"><div class="g-grid">' + cells + '</div></div>' +

      '<div class="g__foot">' +
        '<button class="g-btn" type="button" data-cmd="new-entry">' + U.esc(T('ui.newEntry')) + '</button>' +
        '<button class="g-btn g-btn--ghost" type="button" data-cmd="open-main">' +
          U.esc(T('nav.calendar')) + '</button>' +
      '</div>';
  }

  function boot() {
    Store.load();
    I18n.set(Store.settings.lang);
    Fonts.apply(I18n.current(), (Store.settings.fonts || {})[I18n.current()]);
    document.documentElement.setAttribute('data-theme', Store.settings.theme || 'warm');
    document.documentElement.setAttribute('lang', I18n.locale(I18n.current()).bcp);
    render();
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cmd]');
    if (btn) send(btn.dataset.cmd);
  });

  // The native host calls Gadget.render() after any save; the timer is only a
  // backstop so the panel still rolls over at midnight on its own.
  window.Gadget = {
    render: function () {
      I18n.set(Store.settings.lang);
      Fonts.apply(I18n.current(), (Store.settings.fonts || {})[I18n.current()]);
      document.documentElement.setAttribute('data-theme', Store.settings.theme || 'warm');
      render();
    }
  };
  setInterval(function () { window.Gadget.render(); }, 60000);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
