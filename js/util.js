/* util.js — dates, formatting and tiny DOM helpers.
 *
 * Dates are handled as plain 'YYYY-MM-DD' keys and times as minutes past
 * midnight. Nothing is ever stored as a UTC timestamp, so a study session
 * never drifts across a day boundary when the clocks change or the user
 * travels. Date objects are only ever built at local noon for the same reason.
 */
(function (window) {
  'use strict';

  var MIN_PER_DAY = 1440;
  var DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MON = ['January', 'February', 'March', 'April', 'May', 'June',
             'July', 'August', 'September', 'October', 'November', 'December'];

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- dates ---------- */

  function today() { return new Date(); }

  /** Date -> 'YYYY-MM-DD' (local). */
  function key(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  /** 'YYYY-MM-DD' -> Date at local noon. */
  function date(k) {
    var p = String(k).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2], 12, 0, 0, 0);
  }

  function addDays(d, n) {
    var c = new Date(d.getTime());
    c.setDate(c.getDate() + n);
    return c;
  }

  function addMonths(d, n) {
    var c = new Date(d.getFullYear(), d.getMonth() + n, 1, 12);
    // Keep the day-of-month where the target month is long enough for it.
    c.setDate(Math.min(d.getDate(), daysInMonth(c.getFullYear(), c.getMonth())));
    return c;
  }

  function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }

  function startOfWeek(d, weekStart) {
    var diff = (d.getDay() - (weekStart || 0) + 7) % 7;
    return addDays(d, -diff);
  }

  function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1, 12); }
  function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0, 12); }
  function startOfYear(d) { return new Date(d.getFullYear(), 0, 1, 12); }
  function endOfYear(d) { return new Date(d.getFullYear(), 11, 31, 12); }

  function sameDay(a, b) { return key(a) === key(b); }
  function isToday(k) { return k === key(new Date()); }

  /** Inclusive whole-day span between two 'YYYY-MM-DD' keys. */
  function daysBetween(a, b) {
    return Math.round((date(b) - date(a)) / 86400000);
  }

  function eachDay(fromKey, toKey, fn) {
    var d = date(fromKey), end = date(toKey);
    while (d <= end) { fn(key(d), d); d = addDays(d, 1); }
  }

  /* ---------- labels ---------- */

  /* Anything a locale can change is delegated to I18n at call time. The
     English tables below are only the fallback for the moment before i18n.js
     has loaded. */

  function monthName(m, short) {
    if (window.I18n) return window.I18n.monthName(m, short);
    return short ? MON[m].slice(0, 3) : MON[m];
  }

  function dowName(i, short) {
    if (window.I18n) return window.I18n.dowName(i, short);
    return short ? DOW[i].slice(0, 3) : DOW[i];
  }

  function fmtDay(k) {
    if (window.I18n) return window.I18n.fmtDay(k);
    var d = date(k);
    return dowName(d.getDay(), true) + ' ' + d.getDate() + ' ' + monthName(d.getMonth(), true);
  }

  function fmtDayLong(k) {
    if (window.I18n) return window.I18n.fmtDayLong(k);
    var d = date(k);
    return dowName(d.getDay()) + ', ' + d.getDate() + ' ' + monthName(d.getMonth()) + ' ' + d.getFullYear();
  }

  /* ---------- times ---------- */

  /** minutes past midnight -> '09:30' */
  function hhmm(mins) {
    var m = Math.max(0, Math.min(MIN_PER_DAY, Math.round(mins)));
    return pad2(Math.floor(m / 60) % 24) + ':' + pad2(m % 60);
  }

  /** '09:30' -> 570 */
  function mins(str) {
    var p = String(str).split(':');
    return (+p[0]) * 60 + (+p[1] || 0);
  }

  /** Clock label for the time gutter: '9 AM' in English, '09:00' elsewhere. */
  function clockLabel(hour) {
    if (window.I18n) return window.I18n.clockLabel(hour);
    var h = hour % 24;
    var suffix = h < 12 ? 'AM' : 'PM';
    var display = h % 12 === 0 ? 12 : h % 12;
    return display + ' ' + suffix;
  }

  /** minutes -> '3h 20m' / '3小时20分' / '3 Std. 20 Min.', per locale. */
  function dur(m) {
    if (window.I18n) return window.I18n.dur(m);
    m = Math.round(m);
    if (!m) return '0m';
    var h = Math.floor(m / 60), r = m % 60;
    if (!h) return r + 'm';
    if (!r) return h + 'h';
    return h + 'h ' + r + 'm';
  }

  /** minutes -> '3.4' decimal hours, for axes and tables. */
  function hours(m, dp) {
    var v = m / 60;
    return v.toFixed(dp === undefined ? 1 : dp);
  }

  /* ---------- misc ---------- */

  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function id() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  /** Round to the nearest `step` minutes. */
  function snap(v, step) { return Math.round(v / step) * step; }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function on(node, type, sel, fn) {
    // Delegated listener: on(root, 'click', '.thing', handler)
    if (typeof sel === 'function') { node.addEventListener(type, sel); return; }
    node.addEventListener(type, function (e) {
      var hit = e.target.closest(sel);
      if (hit && node.contains(hit)) fn.call(hit, e, hit);
    });
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }

  window.U = {
    MIN_PER_DAY: MIN_PER_DAY,
    pad2: pad2, today: today, key: key, date: date,
    addDays: addDays, addMonths: addMonths, daysInMonth: daysInMonth,
    startOfWeek: startOfWeek, startOfMonth: startOfMonth, endOfMonth: endOfMonth,
    startOfYear: startOfYear, endOfYear: endOfYear,
    sameDay: sameDay, isToday: isToday, daysBetween: daysBetween, eachDay: eachDay,
    monthName: monthName, dowName: dowName, fmtDay: fmtDay, fmtDayLong: fmtDayLong,
    hhmm: hhmm, mins: mins, clockLabel: clockLabel, dur: dur, hours: hours,
    esc: esc, id: id, clamp: clamp, snap: snap,
    $: $, $$: $$, on: on, debounce: debounce
  };
})(window);
