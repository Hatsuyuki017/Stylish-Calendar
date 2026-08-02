/* heatmap.js — the GitHub-style contribution calendar.
 *
 * One cell per day of the year, one column per week. Colour is a five-step
 * sequential ramp of a single hue (--heat-0 … --heat-4, all derived from the
 * palette's primary), so darkness reads as "more time studied" and nothing
 * else. The saturation point is a setting, not a guess about the data.
 */
(function (window) {
  'use strict';

  var U = window.U, Store = window.Store, T = window.T;
  var filterCat = 'all';

  function level(mins, peak) {
    if (!mins) return 0;
    return U.clamp(Math.ceil(mins / peak * 4), 1, 4);
  }

  /** Minutes per day for the year, optionally narrowed to one item. */
  function series(year) {
    var from = year + '-01-01', to = year + '-12-31';
    if (filterCat === 'all') return Store.minutesByDay(from, to);
    var out = Object.create(null);
    Store.entriesBetween(from, to).forEach(function (e) {
      if (e.categoryId !== filterCat) return;
      out[e.day] = (out[e.day] || 0) + Store.minutesOf(e);
    });
    return out;
  }

  function streaks(map, year) {
    var best = 0, run = 0, bestDay = null, bestMins = 0, total = 0, days = 0;

    U.eachDay(year + '-01-01', year + '-12-31', function (k) {
      var m = map[k] || 0;
      if (m > 0) {
        run++; days++; total += m;
        if (run > best) best = run;
        if (m > bestMins) { bestMins = m; bestDay = k; }
      } else {
        run = 0;
      }
    });

    // Current streak counts back from today. A day that simply has not been
    // studied *yet* does not break it, so start from yesterday when today is
    // still empty. Streaks are only meaningful for the year in progress.
    var current = 0;
    var now = new Date();
    if (year === now.getFullYear()) {
      var cursor = U.key(now);
      if (!map[cursor]) cursor = U.key(U.addDays(now, -1));
      while (map[cursor] && cursor >= year + '-01-01') {
        current++;
        cursor = U.key(U.addDays(U.date(cursor), -1));
      }
    }

    return { best: best, current: current, bestDay: bestDay, bestMins: bestMins, total: total, days: days };
  }

  function render(ctx) {
    var year = ctx.anchor.getFullYear();
    var ws = Store.settings.weekStart;
    var peak = Store.settings.heatPeak || 360;
    var map = series(year);
    var st = streaks(map, year);
    var r = rhythm(map, year);

    var jan1 = new Date(year, 0, 1, 12), dec31 = new Date(year, 11, 31, 12);
    var start = U.startOfWeek(jan1, ws);
    var weeks = Math.ceil((U.daysBetween(U.key(start), U.key(dec31)) + 1) / 7);

    var months = '', cells = '', lastLabel = -1;

    for (var w = 0; w < weeks; w++) {
      // Month label sits over the first column that opens a new month.
      var label = '';
      for (var probe = 0; probe < 7; probe++) {
        var pd = U.addDays(start, w * 7 + probe);
        if (pd.getFullYear() === year && pd.getDate() <= 7 && pd.getMonth() !== lastLabel) {
          lastLabel = pd.getMonth();
          label = U.monthName(pd.getMonth(), true);
          break;
        }
      }
      months += '<span class="hm__month">' + label + '</span>';

      for (var d = 0; d < 7; d++) {
        var day = U.addDays(start, w * 7 + d);
        var k = U.key(day);
        if (day.getFullYear() !== year) {
          cells += '<span class="hm__cell is-void" aria-hidden="true"></span>';
          continue;
        }
        var m = map[k] || 0;
        cells += '<span class="hm__cell' + (U.isToday(k) ? ' is-today' : '') + '"' +
                 ' data-lvl="' + level(m, peak) + '" data-day="' + k + '" data-mins="' + m + '"' +
                 ' role="button" tabindex="' + (m ? '0' : '-1') + '"' +
                 ' aria-label="' + U.esc(U.fmtDay(k) + ': ' + (m ? U.dur(m) : T('hm.nothing'))) + '"></span>';
      }
    }

    var dows = '';
    for (var i = 0; i < 7; i++) {
      var dow = (ws + i) % 7;
      // Label every other row, as GitHub does, to keep the axis quiet.
      dows += '<span class="hm__dowlabel">' + (i % 2 === 1 ? U.dowName(dow, true) : '') + '</span>';
    }

    var legend = '';
    for (var L = 0; L <= 4; L++) legend += '<i style="background:var(--heat-' + L + ')"></i>';

    var opts = ['<option value="all">' + U.esc(T('hm.all')) + '</option>'].concat(
      Store.categories().map(function (c) {
        return '<option value="' + U.esc(c.id) + '"' + (filterCat === c.id ? ' selected' : '') + '>' +
               U.esc(c.name) + '</option>';
      })).join('');

    var avgActive = st.days ? st.total / st.days : 0;

    var foot = [T('hm.foot', { dur: U.dur(peak) })];
    if (st.bestDay) foot.push(T('hm.footBusy', { day: U.fmtDay(st.bestDay), dur: U.dur(st.bestMins) }));
    foot.push(T('hm.clickDay'));

    return '<div class="pad">' +
      '<section class="panel">' +
        '<div class="panel__head">' +
          '<h3 class="panel__title">' + U.esc(T('hm.glance', { year: year })) + '</h3>' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<label class="eyebrow" for="hmFilter">' + U.esc(T('hm.item')) + '</label>' +
            '<select id="hmFilter" style="width:auto;padding:4px 8px;font-size:.78rem">' + opts + '</select>' +
          '</div>' +
        '</div>' +

        '<div class="hm">' +
          '<div class="hm__scroll">' +
            '<div class="hm__inner">' +
              '<div class="hm__months" aria-hidden="true">' + months + '</div>' +
              '<div class="hm__dows" aria-hidden="true">' + dows + '</div>' +
              '<div class="hm__grid" role="grid" aria-label="' +
                U.esc(T('hm.gridLabel', { year: year })) + '">' + cells + '</div>' +
            '</div>' +
          '</div>' +

          '<div class="hm__foot">' +
            '<div class="hm__stats">' +
              stat(T('hm.recorded'), U.dur(st.total)) +
              stat(T('hm.activeDays'), st.days +
                   ' <small style="font-size:.68rem;color:var(--ink-38)">/ ' + daysSoFar(year) + '</small>') +
              stat(T('hm.avgActiveDay'), U.dur(Math.round(avgActive))) +
              stat(T('hm.currentStreak'), U.esc(window.I18n.tn('hm.nDays', st.current))) +
              stat(T('hm.longestStreak'), U.esc(window.I18n.tn('hm.nDays', st.best))) +
            '</div>' +
            '<div class="hm__legend"><span>' + U.esc(T('hm.less')) + '</span>' + legend +
              '<span>' + U.esc(T('hm.more')) + '</span></div>' +
          '</div>' +

          '<p class="panel__note" style="margin-top:14px">' + U.esc(foot.join(' · ')) + '</p>' +
        '</div>' +
      '</section>' +

      '<div class="cols2">' +
        '<section class="panel" style="margin-top:18px">' +
          '<div class="panel__head">' +
            '<h3 class="panel__title">' + U.esc(T('hm.monthByMonth')) + '</h3>' +
            '<p class="panel__note">' + U.esc(T('hm.totalIn', { year: year })) + '</p>' +
          '</div>' + miniBars(r.mons) +
        '</section>' +
        '<section class="panel" style="margin-top:18px">' +
          '<div class="panel__head">' +
            '<h3 class="panel__title">' + U.esc(T('hm.rhythm')) + '</h3>' +
            '<p class="panel__note">' + U.esc(T('hm.avgWeekday')) + '</p>' +
          '</div>' + miniBars(r.dows) +
        '</section>' +
      '</div>' +
    '</div>';
  }

  /**
   * Magnitude bars for a single series. One hue, direct-labelled, values on
   * the right — no legend, because the panel title names the series.
   */
  function miniBars(rows) {
    var max = rows.reduce(function (a, r) { return Math.max(a, r.v); }, 0) || 1;
    return '<div class="bars">' + rows.map(function (r, i) {
      return '<div class="bar' + (r.v ? '' : ' is-zero') + '">' +
        '<div class="bar__label"><span>' + U.esc(r.k) + '</span></div>' +
        '<div class="bar__track"><div class="bar__fill" style="--c:var(--accent);width:' +
          (r.v / max * 100).toFixed(2) + '%;animation-delay:' + (i * 40) + 'ms"></div></div>' +
        '<div class="bar__val num">' + U.dur(Math.round(r.v)) + '</div>' +
      '</div>';
    }).join('') + '</div>';
  }

  /** Average per weekday and total per month, both for the shown year. */
  function rhythm(map, year) {
    var ws = Store.settings.weekStart;
    var dowSum = [0, 0, 0, 0, 0, 0, 0], dowN = [0, 0, 0, 0, 0, 0, 0];
    var months = new Array(12).fill(0);
    var todayKey = U.key(new Date());

    U.eachDay(year + '-01-01', year + '-12-31', function (k, d) {
      var m = map[k] || 0;
      months[d.getMonth()] += m;
      // Averaging over days that have not happened yet would flatten the
      // current year's rhythm, so only count elapsed days.
      if (k <= todayKey) { dowSum[d.getDay()] += m; dowN[d.getDay()]++; }
    });

    var dows = [];
    for (var i = 0; i < 7; i++) {
      var dow = (ws + i) % 7;
      dows.push({ k: U.dowName(dow), v: dowN[dow] ? dowSum[dow] / dowN[dow] : 0 });
    }
    var mons = months.map(function (v, m) { return { k: U.monthName(m), v: v }; });
    return { dows: dows, mons: mons };
  }

  function stat(k, v) {
    return '<div class="hm__stat"><div class="eyebrow">' + k + '</div><b class="num">' + v + '</b></div>';
  }

  function daysSoFar(year) {
    var now = new Date();
    if (year < now.getFullYear()) return U.daysBetween(year + '-01-01', year + '-12-31') + 1;
    if (year > now.getFullYear()) return 0;
    return U.daysBetween(year + '-01-01', U.key(now)) + 1;
  }

  function mount(root) {
    var sel = U.$('#hmFilter', root);
    if (sel) {
      sel.addEventListener('change', function () {
        filterCat = sel.value;
        window.App.render();
      });
    }

    U.on(root, 'click', '.hm__cell[data-day]', function (e, cell) {
      window.App.goDay(cell.dataset.day);
    });

    U.on(root, 'mouseover', '.hm__cell[data-day]', function (e, cell) {
      var m = +cell.dataset.mins;
      var k = cell.dataset.day;
      var html = '<b>' + U.esc(m ? U.dur(m) : T('hm.nothing')) + '</b><br><em>' +
                 U.esc(U.fmtDayLong(k)) + '</em>';
      if (m && filterCat === 'all') {
        var lines = Store.itemRows(Store.breakdown(k, k))
          .map(function (it) { return U.esc(it.name) + ' — ' + U.dur(it.minutes); });
        if (lines.length) html += '<br>' + lines.join('<br>');
      }
      window.App.tip(html, cell);
    });
    U.on(root, 'mouseout', '.hm__cell', function () { window.App.tipOff(); });
  }

  window.HeatmapView = { render: render, mount: mount, level: level };
})(window);
