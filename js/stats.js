/* stats.js — time consumption, per day / week / month / year / semester.
 *
 * Chart choices follow the job each one does:
 *   · headline numbers      -> stat tiles, no plot
 *   · magnitude by category -> horizontal bars, one hue per category
 *   · magnitude by item     -> the same bars, inheriting the parent's hue
 *   · change over time      -> vertical bars on a shared baseline, one series
 *   · the exact figures     -> a real table, three levels deep
 * Categories keep their colour and their order across every panel, so a hue
 * always means the same category. Text never wears a series colour.
 */
(function (window) {
  'use strict';

  var U = window.U, Store = window.Store, T = window.T;

  /* ---------------- time buckets for the trend ---------------- */

  function buckets(range) {
    var days = U.daysBetween(range.from, range.to) + 1;
    var mode = days <= 31 ? 'day' : days <= 122 ? 'week' : 'month';
    var perDay = Store.minutesByDay(range.from, range.to);
    var out = [];

    if (mode === 'day') {
      U.eachDay(range.from, range.to, function (k, d) {
        out.push({ key: k, label: U.fmtDay(k), tick: String(d.getDate()), minutes: perDay[k] || 0 });
      });

    } else if (mode === 'week') {
      var ws = Store.settings.weekStart;
      var cur = U.startOfWeek(U.date(range.from), ws);
      var last = U.date(range.to);
      while (cur <= last) {
        var end = U.addDays(cur, 6);
        var sum = 0;
        for (var i = 0; i < 7; i++) {
          var k2 = U.key(U.addDays(cur, i));
          if (k2 >= range.from && k2 <= range.to) sum += perDay[k2] || 0;
        }
        out.push({
          key: U.key(cur), minutes: sum,
          label: T('range.weekOf', { date: U.fmtDay(U.key(cur)) }),
          tick: cur.getDate() + '/' + (cur.getMonth() + 1)
        });
        cur = U.addDays(end, 1);
      }

    } else {
      var m = U.startOfMonth(U.date(range.from));
      var stop = U.date(range.to);
      while (m <= stop) {
        var mEnd = U.endOfMonth(m);
        var from = U.key(m) < range.from ? range.from : U.key(m);
        var to = U.key(mEnd) > range.to ? range.to : U.key(mEnd);
        var total = 0;
        U.eachDay(from, to, function (k3) { total += perDay[k3] || 0; });
        out.push({
          key: U.key(m), minutes: total,
          label: window.I18n.fmtMonthYear(m),
          tick: U.monthName(m.getMonth(), true)
        });
        m = U.addMonths(m, 1);
      }
    }

    return { mode: mode, rows: out };
  }

  /* ---------------- pieces ---------------- */

  function tile(k, v, unit, delta) {
    return '<div class="tile"><div class="tile__k">' + U.esc(k) + '</div>' +
           '<div class="tile__v num">' + v + (unit ? '<small>' + unit + '</small>' : '') + '</div>' +
           (delta ? '<div class="tile__d ' + delta.dir + '">' + U.esc(delta.text) + '</div>' : '') +
           '</div>';
  }

  /**
   * Horizontal magnitude bars. `sub` puts a quiet second line under the label,
   * used to name an item's parent category.
   */
  function barsHTML(rows, max, showSub) {
    return rows.map(function (r, i) {
      var pct = max ? (r.minutes / max * 100) : 0;
      return '<div class="bar' + (r.minutes ? '' : ' is-zero') + '">' +
        '<div class="bar__label">' +
          '<span class="swatch swatch--sq" style="background:' + r.color + '"></span>' +
          '<span class="bar__names">' +
            '<span title="' + U.esc(r.name) + '">' + U.esc(r.name) + '</span>' +
            (showSub && r.category ? '<em>' + U.esc(r.category) + '</em>' : '') +
          '</span>' +
        '</div>' +
        '<div class="bar__track"><div class="bar__fill" style="--c:' + r.color + ';width:' +
          pct.toFixed(2) + '%;animation-delay:' + Math.min(i * 45, 500) + 'ms"></div></div>' +
        '<div class="bar__val num">' + U.dur(r.minutes) +
          '<span class="bar__pct">' + (r.share * 100).toFixed(0) + '%</span></div>' +
      '</div>';
    }).join('');
  }

  function trendHTML(b, goal) {
    var rows = b.rows;
    var max = rows.reduce(function (a, r) { return Math.max(a, r.minutes); }, 0);
    if (!max) max = 60;
    // Round the top of the scale up to a whole hour so the gridline reads cleanly.
    var top = Math.ceil(max / 60) * 60;
    var step = Math.max(1, Math.ceil(rows.length / 14));

    // Axis labels drop the decimal when the value lands on a whole hour.
    var unit = T('ui.hourUnit');
    var axis = function (m) { return U.hours(m, m % 60 === 0 ? 0 : 1) + unit; };

    var cols = rows.map(function (r, i) {
      var h = r.minutes / top * 100;
      return '<div class="trend__col" data-label="' + U.esc(r.label) + '" data-mins="' + r.minutes + '"' +
             ' data-key="' + U.esc(r.key) + '" tabindex="-1">' +
               '<div class="trend__bar" style="height:' + h.toFixed(2) + '%;animation-delay:' +
                 Math.min(i * 22, 500) + 'ms"></div>' +
             '</div>';
    }).join('');

    var ticks = rows.map(function (r, i) {
      return '<div class="trend__tick">' + (i % step === 0 ? U.esc(r.tick) : '') + '</div>';
    }).join('');

    var goalLine = '';
    if (b.mode === 'day' && goal && goal < top) {
      goalLine = '<div class="trend__grid" style="bottom:' + (goal / top * 100).toFixed(2) + '%;border-top-style:solid;' +
                 'border-top-color:var(--rule-firm)"><span>' +
                 U.esc(T('st.goal', { v: axis(goal) })) + '</span></div>';
    }

    return '<div class="trend">' +
      '<div class="trend__plot">' +
        '<div class="trend__grid" style="bottom:100%"><span>' + axis(top) + '</span></div>' +
        '<div class="trend__grid" style="bottom:50%"><span>' + axis(top / 2) + '</span></div>' +
        goalLine + cols +
      '</div>' +
      '<div class="trend__axis">' + ticks + '</div>' +
    '</div>';
  }

  /** Category → item → activity, indented three deep. */
  function tableHTML(b) {
    var rows = '';
    var pc = function (m) { return b.total ? (m / b.total * 100).toFixed(1) : '0.0'; };

    b.cats.forEach(function (c) {
      if (!c.minutes) return;
      rows += '<tr class="is-cat"><td>' + U.esc(c.name) + '</td>' +
              '<td class="n">' + U.dur(c.minutes) + '</td>' +
              '<td class="n">' + U.hours(c.minutes) + '</td>' +
              '<td class="n">' + pc(c.minutes) + '%</td></tr>';
      c.items.forEach(function (it) {
        rows += '<tr class="is-item"><td>' + U.esc(it.name) + '</td>' +
                '<td class="n">' + U.dur(it.minutes) + '</td>' +
                '<td class="n">' + U.hours(it.minutes) + '</td>' +
                '<td class="n">' + pc(it.minutes) + '%</td></tr>';
        it.acts.forEach(function (a) {
          rows += '<tr class="is-act"><td>' + U.esc(a.name) + '</td>' +
                  '<td class="n">' + U.dur(a.minutes) + '</td>' +
                  '<td class="n">' + U.hours(a.minutes) + '</td>' +
                  '<td class="n">' + pc(a.minutes) + '%</td></tr>';
        });
      });
    });
    if (!rows) {
      rows = '<tr><td colspan="4" style="color:var(--ink-38);font-style:italic">' +
             U.esc(T('st.nothingRecorded')) + '</td></tr>';
    }

    return '<table class="dtable"><thead><tr>' +
             '<th>' + U.esc(T('st.thName')) + '</th>' +
             '<th class="n">' + U.esc(T('st.thTime')) + '</th>' +
             '<th class="n">' + U.esc(T('st.thHours')) + '</th>' +
             '<th class="n">' + U.esc(T('st.thShare')) + '</th>' +
           '</tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function panel(title, note, inner, extraStyle) {
    return '<section class="panel"' + (extraStyle ? ' style="' + extraStyle + '"' : '') + '>' +
      '<div class="panel__head">' +
        '<h3 class="panel__title">' + U.esc(title) + '</h3>' +
        (note ? '<p class="panel__note">' + U.esc(note) + '</p>' : '') +
      '</div>' + inner + '</section>';
  }

  /* ---------------- view ---------------- */

  function render(ctx) {
    var range = ctx.range;
    var b = Store.breakdown(range.from, range.to);
    var span = U.daysBetween(range.from, range.to) + 1;
    var active = Store.activeDays(range.from, range.to);
    var trend = buckets(range);
    var bucket = T('bucket.' + trend.mode);

    // A period still in progress is only fair to average over — and compare
    // against — the days that have actually happened. Otherwise the first of
    // the month always reads as "-99% vs. the previous 31 days".
    var todayKey = U.key(new Date());
    var partial = range.from <= todayKey && range.to > todayKey;
    var elapsed = partial ? U.daysBetween(range.from, todayKey) + 1 : span;

    var prevR = Store.previousRange(range);
    var prevTo = partial ? U.key(U.addDays(U.date(prevR.from), elapsed - 1)) : prevR.to;
    var prev = Store.breakdown(prevR.from, prevTo);
    var delta = null;
    if (prev.total) {
      var pct = (b.total - prev.total) / prev.total * 100;
      var sign = pct >= 0 ? '+' : '';
      delta = {
        dir: pct >= 0 ? 'up' : 'down',
        text: partial
          ? window.I18n.tn('st.vsSame', elapsed, { pct: sign + pct.toFixed(0) })
          : T('st.vsPrev', { pct: sign + pct.toFixed(0), n: span })
      };
    } else if (b.total) {
      // No arrow: there is nothing to have gone up or down against.
      delta = { dir: '', text: T('st.noCompare') };
    }

    var ranked = b.cats.slice().sort(function (x, y) { return y.minutes - x.minutes; });
    var maxCat = b.cats.reduce(function (a, c) { return Math.max(a, c.minutes); }, 0);

    var items = Store.itemRows(b);
    var topItems = items.slice(0, 10);
    var acts = Store.activityRows(b);
    var topActs = acts.slice(0, 8);

    var busiest = trend.rows.reduce(function (a, r) { return r.minutes > a.minutes ? r : a; },
                                    { minutes: 0, label: '—' });

    var head = '<div class="tiles">' +
      tile(T('st.recorded'), U.dur(b.total), '', delta) +
      tile(T('st.perDay'), U.hours(b.total / elapsed), ' ' + T('ui.hourUnit'),
           { dir: '', text: partial ? T('st.acrossSoFar', { n: elapsed }) : T('st.acrossAll', { n: span }) }) +
      tile(T('st.perActiveDay'), U.hours(active ? b.total / active : 0), ' ' + T('ui.hourUnit'),
           { dir: '', text: T('st.ofRecorded', { a: active, b: elapsed }) }) +
      tile(T('st.sessions'), String(b.count), '',
           { dir: '', text: b.count ? T('st.avgSession', { dur: U.dur(Math.round(b.total / b.count)) })
                                    : T('st.noneYet') }) +
      tile(T('st.busiest', { bucket: bucket }), U.dur(busiest.minutes), '',
           { dir: '', text: busiest.label }) +
    '</div>';

    if (!b.total) {
      return '<div class="pad">' + head +
        '<section class="panel"><div class="empty"><div class="empty__mark">∅</div>' +
        '<p>' + U.esc(T('st.emptyRange', { a: U.fmtDay(range.from), b: U.fmtDay(range.to) })) + '</p>' +
        '<p style="margin-top:14px"><button class="btn btn--solid" data-act="new">' +
          U.esc(T('st.recordSomething')) + '</button></p>' +
        '</div></section></div>';
    }

    var legend = '<div class="legend">' + b.cats.filter(function (c) { return c.minutes; })
      .map(function (c) {
        return '<span class="legend__i"><span class="swatch swatch--sq" style="background:' +
               c.color + '"></span>' + U.esc(c.name) + '</span>';
      }).join('') + '</div>';

    return '<div class="pad">' + head +

      '<div class="cols2" style="margin-top:18px">' +
        panel(T('st.hoursPer', { bucket: bucket }),
              U.fmtDay(range.from) + ' – ' + U.fmtDay(range.to),
              trendHTML(trend, Store.settings.goal), 'margin-top:0') +
        panel(T('st.byCategory'),
              T('st.nActive', { n: ranked.filter(function (c) { return c.minutes; }).length }),
              '<div class="bars">' + barsHTML(ranked, maxCat, false) + '</div>', 'margin-top:0') +
      '</div>' +

      panel(T('st.byItem'), T('st.topOf', { a: topItems.length, b: items.length }),
            '<div class="bars">' + barsHTML(topItems, topItems.length ? topItems[0].minutes : 0, true) +
            '</div>' + legend) +

      panel(T('st.byActivity'), T('st.topOf', { a: topActs.length, b: acts.length }),
            '<div class="bars">' + barsHTML(topActs, topActs.length ? topActs[0].minutes : 0, true) +
            '</div>') +

      '<section class="panel">' +
        '<details' + (span <= 7 ? ' open' : '') + '>' +
          '<summary style="cursor:pointer;list-style:revert">' +
            '<span class="panel__title">' + U.esc(T('st.fullFigures')) + '</span> ' +
            '<span class="panel__note">' + U.esc(T('st.fullFiguresNote')) + '</span>' +
          '</summary>' +
          '<div style="margin-top:14px;overflow-x:auto">' + tableHTML(b) + '</div>' +
        '</details>' +
      '</section>' +

    '</div>';
  }

  function mount(root) {
    U.on(root, 'mouseover', '.trend__col', function (e, col) {
      var m = +col.dataset.mins;
      window.App.tip('<b>' + U.esc(m ? U.dur(m) : T('hm.nothing')) + '</b><br><em>' +
                     U.esc(col.dataset.label) + '</em>', col);
    });
    U.on(root, 'mouseout', '.trend__col', function () { window.App.tipOff(); });
    U.on(root, 'click', '.trend__col', function (e, col) {
      if (col.dataset.key && col.dataset.key.length === 10) window.App.goDay(col.dataset.key);
    });
    U.on(root, 'click', '[data-act="new"]', function () { window.App.newEntry(); });
  }

  window.StatsView = { render: render, mount: mount, buckets: buckets };
})(window);
