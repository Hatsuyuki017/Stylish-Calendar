/* calendar.js — the timetable.
 *
 * Day and Week draw an Apple-Calendar-style time grid: an hour gutter, one
 * column per day, entries positioned by their start/end minutes. Month draws
 * a six-row grid of day cells with chips and a daily total.
 *
 * Every block on the grid is time consumed by its parent item, so the daily
 * totals in the headers are just the sum of the blocks beneath them.
 */
(function (window) {
  'use strict';

  var U = window.U, Store = window.Store;

  /* ---------------- geometry ---------------- */

  /**
   * Hour window to draw. Starts from the user's preferred range but always
   * widens to contain the entries actually present, so nothing is ever
   * clipped out of sight.
   */
  function window_(dayKeys) {
    var s = Store.settings;
    var lo = s.dayStart * 60, hi = s.dayEnd * 60;
    dayKeys.forEach(function (k) {
      Store.entriesOn(k).forEach(function (e) {
        if (e.start < lo) lo = e.start;
        if (e.end > hi) hi = e.end;
      });
    });
    lo = Math.floor(lo / 60) * 60;
    hi = Math.ceil(hi / 60) * 60;
    if (hi - lo < 240) hi = lo + 240;         // never narrower than four hours
    return { lo: lo, hi: hi, span: hi - lo, hours: (hi - lo) / 60 };
  }

  /**
   * Side-by-side placement for overlapping entries.
   * Returns [{ e, col, cols }] without touching the stored objects.
   */
  function layout(list) {
    var sorted = list.slice().sort(function (a, b) {
      return a.start - b.start || b.end - a.end;
    });
    var out = [], group = [], groupEnd = -1;

    function flush() {
      if (!group.length) return;
      var colEnds = [];
      group.forEach(function (vm) {
        var placed = false;
        for (var i = 0; i < colEnds.length; i++) {
          if (vm.e.start >= colEnds[i]) { colEnds[i] = vm.e.end; vm.col = i; placed = true; break; }
        }
        if (!placed) { vm.col = colEnds.length; colEnds.push(vm.e.end); }
      });
      group.forEach(function (vm) { vm.cols = colEnds.length; });
      out.push.apply(out, group);
      group = []; groupEnd = -1;
    }

    sorted.forEach(function (e) {
      if (group.length && e.start >= groupEnd) flush();
      group.push({ e: e, col: 0, cols: 1 });
      groupEnd = Math.max(groupEnd, e.end);
    });
    flush();
    return out;
  }

  /* ---------------- entry blocks ---------------- */

  function eventHTML(vm, win) {
    var e = vm.e;
    var cat = Store.category(e.categoryId);
    var color = Store.categoryColor(cat);
    var top = (e.start - win.lo) / win.span * 100;
    var height = (e.end - e.start) / win.span * 100;
    var w = 100 / vm.cols;
    var mins = e.end - e.start;
    var tight = mins < 34;

    var pos = 'top:' + top.toFixed(4) + '%;height:' + height.toFixed(4) + '%;';
    if (vm.cols > 1) {
      pos += 'left:calc(' + (vm.col * w).toFixed(4) + '% + 2px);' +
             'width:calc(' + w.toFixed(4) + '% - 4px);right:auto;';
    }

    // The item is the headline — "Advanced Optimisation" says more at a glance
    // than "Lecture" — with the activity beneath it when there is room.
    var item = e.itemName || (cat ? cat.name : '');
    var act = e.activityName || '';
    var time = U.hhmm(e.start) + '–' + U.hhmm(e.end);
    var body;

    if (tight) {
      body = '<span class="ev__t num">' + U.hhmm(e.start) + '</span>' +
             '<span class="ev__a">' + U.esc(item) + '</span>';
    } else {
      body = '<div class="ev__t num">' + time + ' · ' + U.dur(mins) + '</div>' +
             '<div class="ev__a">' + U.esc(item) + '</div>' +
             (mins >= 45 && act ? '<div class="ev__c">' + U.esc(act) + '</div>' : '') +
             (mins >= 90 && e.note ? '<div class="ev__n">' + U.esc(e.note) + '</div>' : '');
    }

    var read = [cat ? cat.name : null, item, act, time].filter(Boolean).join(' · ');

    return '<article class="ev' + (tight ? ' ev--tight' : '') + '" data-ev="' + U.esc(e.id) + '"' +
           ' style="--c:' + color + ';' + pos + '"' +
           ' tabindex="0" role="button"' +
           ' aria-label="' + U.esc(read) + '">' +
           body + '<span class="ev__grip" data-grip></span></article>';
  }

  /* ---------------- timetable (day / week) ---------------- */

  function dayTotal(k) {
    var t = 0;
    Store.entriesOn(k).forEach(function (e) { t += Store.minutesOf(e); });
    return t;
  }

  function timetable(dayKeys) {
    var win = window_(dayKeys);
    var s = Store.settings;

    var heads = dayKeys.map(function (k) {
      var d = U.date(k), total = dayTotal(k);
      var off = d.getDay() === 0 || d.getDay() === 6;
      return '<div class="tt__day' + (U.isToday(k) ? ' is-today' : '') + (off ? ' is-off' : '') + '"' +
             ' data-goday="' + k + '" role="button" tabindex="0">' +
               '<span class="tt__dow">' + U.dowName(d.getDay(), true) + '</span>' +
               '<span class="tt__date num">' + d.getDate() + '</span>' +
               (total ? '<span class="tt__daysum num">' + U.dur(total) + '</span>' : '') +
             '</div>';
    }).join('');

    var gutter = '';
    for (var h = 0; h < win.hours; h++) {
      gutter += '<div class="tt__hour"><span>' + U.clockLabel(win.lo / 60 + h) + '</span></div>';
    }

    var now = new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes();

    var cols = dayKeys.map(function (k) {
      var d = U.date(k);
      var off = d.getDay() === 0 || d.getDay() === 6;
      var blocks = layout(Store.entriesOn(k)).map(function (vm) {
        return eventHTML(vm, win);
      }).join('');
      var nowLine = '';
      if (U.isToday(k) && nowMin >= win.lo && nowMin <= win.hi) {
        nowLine = '<div class="tt__now" style="top:' +
                  ((nowMin - win.lo) / win.span * 100).toFixed(4) + '%"><i></i></div>';
      }
      return '<div class="tt__col' + (U.isToday(k) ? ' is-today' : '') + (off ? ' is-off' : '') + '"' +
             ' data-day="' + k + '">' + nowLine + blocks + '</div>';
    }).join('');

    return '<div class="tt" style="--days:' + dayKeys.length + '" data-days="' + dayKeys.length + '"' +
             ' data-lo="' + win.lo + '" data-span="' + win.span + '">' +
             '<div class="tt__head"><div class="tt__corner"></div><div class="tt__days">' + heads + '</div></div>' +
             '<div class="tt__body">' +
               '<div class="tt__gutter">' + gutter + '</div>' +
               '<div class="tt__cols" style="height:calc(var(--hr) * ' + win.hours + ')">' + cols + '</div>' +
             '</div>' +
           '</div>';
  }

  /* ---------------- month ---------------- */

  function month(anchor) {
    var ws = Store.settings.weekStart;
    var first = U.startOfMonth(anchor);
    var gridStart = U.startOfWeek(first, ws);
    var last = U.endOfMonth(anchor);
    var weeks = Math.ceil((U.daysBetween(U.key(gridStart), U.key(last)) + 1) / 7);

    var dows = '';
    for (var i = 0; i < 7; i++) {
      dows += '<div class="mv__dow">' + U.dowName((ws + i) % 7, true) + '</div>';
    }

    var grid = '';
    for (var w = 0; w < weeks; w++) {
      var cells = '';
      for (var d = 0; d < 7; d++) {
        var day = U.addDays(gridStart, w * 7 + d);
        var k = U.key(day);
        var out = day.getMonth() !== anchor.getMonth();
        var list = Store.entriesOn(k);
        var total = dayTotal(k);

        var chips = list.slice(0, 3).map(function (e) {
          var cat = Store.category(e.categoryId);
          return '<div class="chip" style="--c:' + Store.categoryColor(cat) + '"' +
                   ' title="' + U.esc((e.itemName || '') + ' · ' + (e.activityName || '')) + '">' +
                   '<span class="chip__t num">' + U.hhmm(e.start) + '</span>' +
                   '<span class="chip__a">' + U.esc(e.itemName || (cat ? cat.name : '')) + '</span>' +
                 '</div>';
        }).join('');
        if (list.length > 3) {
          chips += '<div class="chip chip--more num">+' + (list.length - 3) + '</div>';
        }

        cells += '<div class="mv__cell' + (out ? ' is-out' : '') + (U.isToday(k) ? ' is-today' : '') + '"' +
                 ' data-goday="' + k + '" role="button" tabindex="0">' +
                   '<div class="mv__top"><span class="mv__n num">' + day.getDate() + '</span>' +
                   (total ? '<span class="mv__sum num">' + U.dur(total) + '</span>' : '') + '</div>' +
                   chips +
                 '</div>';
      }
      grid += '<div class="mv__week">' + cells + '</div>';
    }

    return '<div class="mv"><div class="mv__dows">' + dows + '</div>' +
           '<div class="mv__grid">' + grid + '</div></div>';
  }

  /* ---------------- view ---------------- */

  function render(ctx) {
    if (ctx.scope === 'month') return month(ctx.anchor);
    if (ctx.scope === 'day') return timetable([U.key(ctx.anchor)]);
    var s = U.startOfWeek(ctx.anchor, Store.settings.weekStart);
    var keys = [];
    for (var i = 0; i < 7; i++) keys.push(U.key(U.addDays(s, i)));
    return timetable(keys);
  }

  /* ---------------- interaction ---------------- */

  var drag = null;

  function colOf(x, colsEl) {
    var kids = colsEl.children;
    for (var i = 0; i < kids.length; i++) {
      var r = kids[i].getBoundingClientRect();
      if (x >= r.left && x <= r.right) return kids[i];
    }
    // Outside the grid: clamp to the nearest edge column.
    return x < colsEl.getBoundingClientRect().left ? kids[0] : kids[kids.length - 1];
  }

  function minutesAt(colEl, y, win) {
    var r = colEl.getBoundingClientRect();
    var frac = (y - r.top) / r.height;
    return win.lo + frac * win.span;
  }

  function place(el, start, end, win) {
    el.style.top = ((start - win.lo) / win.span * 100).toFixed(4) + '%';
    el.style.height = ((end - start) / win.span * 100).toFixed(4) + '%';
  }

  function mount(root, ctx) {
    // Day headers and month cells jump to that day.
    U.on(root, 'click', '[data-goday]', function (e, el) {
      window.App.goDay(el.dataset.goday);
    });
    U.on(root, 'keydown', '[data-goday]', function (e, el) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.App.goDay(el.dataset.goday); }
    });
    U.on(root, 'keydown', '[data-ev]', function (e, el) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.App.editEntry(el.dataset.ev); }
    });

    var tt = U.$('.tt', root);
    if (!tt) return;

    var colsEl = U.$('.tt__cols', tt);
    var win = { lo: +tt.dataset.lo, span: +tt.dataset.span };
    win.hi = win.lo + win.span;
    var step = Store.settings.snap || 15;

    colsEl.addEventListener('pointerdown', function (ev) {
      if (ev.button !== 0) return;
      var evEl = ev.target.closest('.ev');
      var colEl = ev.target.closest('.tt__col');
      if (!colEl) return;

      if (evEl) {
        var entry = Store.entry(evEl.dataset.ev);
        if (!entry) return;
        drag = {
          kind: ev.target.hasAttribute('data-grip') ? 'resize' : 'move',
          el: evEl, entry: entry, colEl: colEl,
          day: entry.day, start: entry.start, end: entry.end,
          grab: minutesAt(colEl, ev.clientY, win) - entry.start,
          x0: ev.clientX, y0: ev.clientY, moved: false
        };
      } else {
        var m = U.clamp(U.snap(minutesAt(colEl, ev.clientY, win), step), 0, U.MIN_PER_DAY - step);
        var ghost = document.createElement('div');
        ghost.className = 'ghost';
        colEl.appendChild(ghost);
        drag = {
          kind: 'create', el: ghost, colEl: colEl, day: colEl.dataset.day,
          anchor: m, start: m, end: m + step,
          x0: ev.clientX, y0: ev.clientY, moved: false
        };
        place(ghost, drag.start, drag.end, win);
        ghost.textContent = U.hhmm(drag.start) + '–' + U.hhmm(drag.end);
      }

      colsEl.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });

    colsEl.addEventListener('pointermove', function (ev) {
      if (!drag) return;
      if (Math.abs(ev.clientX - drag.x0) > 3 || Math.abs(ev.clientY - drag.y0) > 3) drag.moved = true;
      if (!drag.moved) return;

      var m = minutesAt(drag.colEl, ev.clientY, win);

      if (drag.kind === 'create') {
        var a = U.snap(m, step);
        drag.start = U.clamp(Math.min(drag.anchor, a), 0, U.MIN_PER_DAY - step);
        drag.end = U.clamp(Math.max(drag.anchor + step, a), drag.start + step, U.MIN_PER_DAY);
        place(drag.el, drag.start, drag.end, win);
        drag.el.textContent = U.hhmm(drag.start) + '–' + U.hhmm(drag.end) + '  ' + U.dur(drag.end - drag.start);

      } else if (drag.kind === 'resize') {
        drag.end = U.clamp(U.snap(m, step), drag.start + step, U.MIN_PER_DAY);
        place(drag.el, drag.start, drag.end, win);
        drag.el.classList.add('is-dragging');

      } else { // move
        var len = drag.entry.end - drag.entry.start;
        var target = colOf(ev.clientX, colsEl);
        if (target && target !== drag.colEl) {
          drag.colEl = target;
          drag.day = target.dataset.day;
          target.appendChild(drag.el);
        }
        drag.start = U.clamp(U.snap(m - drag.grab, step), 0, U.MIN_PER_DAY - len);
        drag.end = drag.start + len;
        place(drag.el, drag.start, drag.end, win);
        drag.el.classList.add('is-dragging');
      }
    });

    function finish(ev) {
      if (!drag) return;
      var d = drag;
      drag = null;
      try { colsEl.releasePointerCapture(ev.pointerId); } catch (err) { /* already gone */ }

      if (d.kind === 'create') {
        d.el.remove();
        if (!d.moved) {
          // A plain click: offer a one-hour block starting at that slot.
          d.end = Math.min(d.start + 60, U.MIN_PER_DAY);
        }
        window.App.newEntry({ day: d.day, start: d.start, end: d.end });
        return;
      }

      d.el.classList.remove('is-dragging');
      if (!d.moved) { window.App.editEntry(d.entry.id); return; }
      Store.moveEntry(d.entry.id, d.day, d.start, d.end);
      window.App.render();
    }

    colsEl.addEventListener('pointerup', finish);
    colsEl.addEventListener('pointercancel', function (ev) {
      if (drag && drag.kind === 'create') drag.el.remove();
      if (drag) drag.el.classList.remove('is-dragging');
      drag = null;
      try { colsEl.releasePointerCapture(ev.pointerId); } catch (err) { /* already gone */ }
      window.App.render();
    });

    // Open the grid on something useful rather than at midnight.
    var scroller = tt;
    var firstEntry = null;
    U.$$('.tt__col', tt).forEach(function (c) {
      var e = Store.entriesOn(c.dataset.day)[0];
      if (e && (!firstEntry || e.start < firstEntry)) firstEntry = e.start;
    });
    var focusMin = firstEntry !== null ? firstEntry - 30 : (new Date()).getHours() * 60 - 90;
    var headH = U.$('.tt__head', tt).offsetHeight;
    var bodyH = U.$('.tt__cols', tt).offsetHeight;
    scroller.scrollTop = Math.max(0, (focusMin - win.lo) / win.span * bodyH - headH);
  }

  window.CalendarView = { render: render, mount: mount, layout: layout, dayTotal: dayTotal };
})(window);
