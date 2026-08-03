/* store.js — the data model.
 *
 * Three levels:
 *   category  the kind of work        Course Work, Research Project
 *   item      the actual thing        Advanced Optimisation, Numerical Methods
 *   activity  what you did to it      Lecture, Notetaking, Data Analysis
 *
 * Items and activities both hang off the category: every course shares the
 * same activity vocabulary, so the list is defined once per category rather
 * than repeated under each item.
 *
 * Shape of a saved database:
 *   { v, settings, semesters[], categories[], entries[] }
 *
 * category : { id, name, slot, color?, items:[{id,name}], activities:[{id,name}] }
 * entry    : { id, categoryId, itemName, activityName, note, day, start, end }
 *              day   = 'YYYY-MM-DD'
 *              start = minutes past midnight, end = minutes past midnight
 *
 * Item and activity are stored by name as well as being chosen from a list, so
 * renaming or deleting one later never silently rewrites what was recorded.
 * An entry never spans midnight: the editor splits a late-night session into
 * two entries at 00:00 so every view can treat a day as a closed interval.
 */
(function (window) {
  'use strict';

  var U = window.U;
  var KEY = 'study-ledger-v1';

  /* ---------------- where the bytes live ----------------
   * In a browser that is localStorage. Inside the macOS app the native side
   * owns ~/Library/Application Support/Study Ledger/ledger.json and hands the
   * contents over at startup, which keeps the data in a real file the user can
   * back up, and lets the desktop gadget read the same source.
   */
  var Native = window.LedgerNative || null;

  function readRaw() {
    if (Native) return Native.initialData || null;
    try { return window.localStorage.getItem(KEY); } catch (err) { return null; }
  }

  function writeRaw(text) {
    if (Native) { Native.save(text); return; }
    window.localStorage.setItem(KEY, text);      // throws on quota; save() reports it
  }

  /* ---------------- defaults ---------------- */

  function seedCategories() {
    var I = window.I18n;
    return I.PRESETS.map(function (p) {
      return {
        id: U.id(), name: I.preset(p.key), slot: p.slot, color: null,
        items: p.items.map(function (k) { return { id: U.id(), name: I.preset(k) }; }),
        activities: p.acts.map(function (k) { return { id: U.id(), name: I.preset(k) }; })
      };
    });
  }

  /** Two terms around today, so the Semester scope works out of the box. */
  function seedSemesters() {
    var now = new Date(), y = now.getFullYear();
    // Before July we are in the spring term of this academic year.
    var base = now.getMonth() < 6 ? y - 1 : y;
    return [
      { id: U.id(), name: 'Fall ' + base, start: base + '-09-01', end: (base + 1) + '-01-15' },
      { id: U.id(), name: 'Spring ' + (base + 1), start: (base + 1) + '-02-16', end: (base + 1) + '-06-30' }
    ];
  }

  function defaults() {
    return {
      v: 2,
      settings: {
        lang: window.I18n.current(),
        fonts: {},           // language id -> font plan id
        theme: 'warm',
        weekStart: 1,        // 0 Sunday, 1 Monday
        dayStart: 7,         // first hour drawn on the timetable
        dayEnd: 24,          // last hour drawn (exclusive end of grid)
        snap: 15,            // minutes the drag interactions round to
        heatPeak: 360,       // minutes/day that saturates the darkest heat step
        goal: 240            // daily target, minutes
      },
      semesters: seedSemesters(),
      palettes: [],          // the user's own palettes
      categories: seedCategories(),
      entries: []
    };
  }

  /* ---------------- persistence ---------------- */

  var db = null;
  var index = Object.create(null);   // 'YYYY-MM-DD' -> [entry]
  var listeners = [];
  var saveFailed = false;

  function reindex() {
    index = Object.create(null);
    db.entries.forEach(function (e) {
      (index[e.day] || (index[e.day] = [])).push(e);
    });
    Object.keys(index).forEach(function (k) {
      index[k].sort(function (a, b) { return a.start - b.start || a.end - b.end; });
    });
  }

  function load() {
    var raw = readRaw();
    db = defaults();
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.categories && parsed.entries) db = migrate(parsed);
      } catch (err) {
        console.warn('Study Ledger: saved data was unreadable, starting fresh.', err);
      }
    }
    reindex();
    return db;
  }

  function migrate(d) {
    var base = defaults();
    d.settings = Object.assign(base.settings, d.settings || {});
    if (!Array.isArray(d.semesters) || !d.semesters.length) d.semesters = base.semesters;
    if (!Array.isArray(d.palettes)) d.palettes = [];

    d.categories = (d.categories || []).map(function (c) {
      c.activities = c.activities || [];
      if (typeof c.slot !== 'number') c.slot = 0;
      if (!Array.isArray(c.items)) c.items = [];
      return c;
    });

    d.entries = (d.entries || []).filter(function (e) {
      return e && e.day && typeof e.start === 'number' && typeof e.end === 'number';
    });

    // v1 had no item level. Rather than invent a placeholder, file each
    // category's old entries under an item named after the category itself —
    // which is exactly what that flat data meant — and only for categories
    // that actually carry entries.
    if (!d.v || d.v < 2) {
      d.entries.forEach(function (e) {
        if (e.itemName) return;
        var c = null;
        for (var i = 0; i < d.categories.length; i++) {
          if (d.categories[i].id === e.categoryId) { c = d.categories[i]; break; }
        }
        if (!c) { e.itemName = ''; return; }
        if (!c.items.length) c.items = [{ id: U.id(), name: c.name }];
        e.itemName = c.items[0].name;
      });
    }

    d.v = 2;
    return d;
  }

  function save() {
    reindex();
    try {
      writeRaw(JSON.stringify(db));
      saveFailed = false;
    } catch (err) {
      // Quota, or Safari private browsing. Say so once rather than silently
      // dropping the user's records.
      if (!saveFailed) {
        saveFailed = true;
        console.error('Study Ledger: could not save.', err);
        if (window.App && window.App.toast) window.App.toast(window.T('msg.saveFailed'), true);
      }
    }
    listeners.forEach(function (fn) { fn(); });
  }

  function subscribe(fn) { listeners.push(fn); }

  /** Reload from storage — used when the native host reports an outside change. */
  function reload() {
    var raw = readRaw();
    if (!raw) return;
    try {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.categories && parsed.entries) { db = migrate(parsed); reindex(); }
    } catch (err) { /* keep what we have */ }
  }

  /* ---------------- categories ---------------- */

  function categories() { return db.categories; }

  function category(id) {
    for (var i = 0; i < db.categories.length; i++) {
      if (db.categories[i].id === id) return db.categories[i];
    }
    return null;
  }

  function categoryColor(cat) {
    if (!cat) return 'var(--ink-45)';
    return cat.color || 'var(--cat-' + ((cat.slot % 5) + 1) + ')';
  }

  function addCategory(name, slot) {
    var c = { id: U.id(), name: name, slot: slot || 0, color: null, items: [], activities: [] };
    db.categories.push(c);
    save();
    return c;
  }

  function removeCategory(id) {
    db.categories = db.categories.filter(function (c) { return c.id !== id; });
    db.entries = db.entries.filter(function (e) { return e.categoryId !== id; });
    save();
  }

  /* ---------------- items & activities ---------------- */

  /** Add to `list` (a category's items or activities), reusing any duplicate. */
  function addNamed(catId, listKey, name) {
    var c = category(catId);
    if (!c) return null;
    name = String(name).trim();
    if (!name) return null;
    var list = c[listKey];
    for (var i = 0; i < list.length; i++) {
      if (list[i].name.toLowerCase() === name.toLowerCase()) return list[i];
    }
    var made = { id: U.id(), name: name };
    list.push(made);
    save();
    return made;
  }

  function addItem(catId, name) { return addNamed(catId, 'items', name); }
  function addActivity(catId, name) { return addNamed(catId, 'activities', name); }

  function removeItem(catId, itemId) {
    var c = category(catId);
    if (!c) return;
    var gone = c.items.filter(function (a) { return a.id === itemId; })[0];
    c.items = c.items.filter(function (a) { return a.id !== itemId; });
    // Entries recorded against it go too — the time belonged to that item.
    if (gone) {
      db.entries = db.entries.filter(function (e) {
        return !(e.categoryId === catId && e.itemName === gone.name);
      });
    }
    save();
  }

  function removeActivity(catId, actId) {
    var c = category(catId);
    if (!c) return;
    c.activities = c.activities.filter(function (a) { return a.id !== actId; });
    save();
  }

  /**
   * Re-file an item under a different category, taking its recorded time with
   * it. Used when the editor's category lock is opened.
   */
  function moveItem(fromCatId, itemName, toCatId) {
    var from = category(fromCatId), to = category(toCatId);
    if (!from || !to || from === to) return null;

    var row = from.items.filter(function (a) { return a.name === itemName; })[0];
    if (!row) return null;
    from.items = from.items.filter(function (a) { return a !== row; });

    var already = to.items.filter(function (a) {
      return a.name.toLowerCase() === itemName.toLowerCase();
    })[0];
    if (!already) to.items.push(row); else row = already;

    db.entries.forEach(function (e) {
      if (e.categoryId === fromCatId && e.itemName === itemName) {
        e.categoryId = toCatId;
        e.itemName = row.name;
      }
    });
    save();
    return row;
  }

  /** Every item in the ledger, tagged with the category it belongs to. */
  function allItems() {
    var out = [];
    db.categories.forEach(function (c) {
      c.items.forEach(function (it) {
        out.push({ id: it.id, name: it.name, categoryId: c.id, categoryName: c.name,
                   color: categoryColor(c) });
      });
    });
    return out;
  }

  /** The category an item name belongs to, or null when it is new. */
  function categoryOfItem(name) {
    if (!name) return null;
    for (var i = 0; i < db.categories.length; i++) {
      var c = db.categories[i];
      for (var j = 0; j < c.items.length; j++) {
        if (c.items[j].name === name) return c;
      }
    }
    return null;
  }

  function renameNamed(catId, listKey, id, name) {
    var c = category(catId);
    if (!c) return;
    var row = c[listKey].filter(function (a) { return a.id === id; })[0];
    if (!row) return;
    var was = row.name;
    row.name = name;
    // Keep already-recorded entries pointing at the thing they were filed under.
    var field = listKey === 'items' ? 'itemName' : 'activityName';
    db.entries.forEach(function (e) {
      if (e.categoryId === catId && e[field] === was) e[field] = name;
    });
    save();
  }

  /* ---------------- entries ---------------- */

  function entriesOn(dayKey) { return index[dayKey] || []; }

  function entriesBetween(fromKey, toKey) {
    var out = [];
    U.eachDay(fromKey, toKey, function (k) {
      var list = index[k];
      if (list) out.push.apply(out, list);
    });
    return out;
  }

  function entry(id) {
    for (var i = 0; i < db.entries.length; i++) {
      if (db.entries[i].id === id) return db.entries[i];
    }
    return null;
  }

  function putEntry(e) {
    var existing = e.id ? entry(e.id) : null;
    if (existing) {
      Object.assign(existing, e);
    } else {
      e.id = e.id || U.id();
      db.entries.push(e);
    }
    save();
    return e;
  }

  function removeEntry(id) {
    db.entries = db.entries.filter(function (e) { return e.id !== id; });
    save();
  }

  /** Move/resize helper used by the calendar's drag handlers. */
  function moveEntry(id, dayKey, start, end) {
    var e = entry(id);
    if (!e) return;
    e.day = dayKey;
    e.start = U.clamp(start, 0, U.MIN_PER_DAY - 5);
    e.end = U.clamp(end, e.start + 5, U.MIN_PER_DAY);
    save();
  }

  /* ---------------- aggregation ---------------- */

  function minutesOf(e) { return Math.max(0, e.end - e.start); }

  /** { 'YYYY-MM-DD': minutes } across an inclusive span. Absent days are absent. */
  function minutesByDay(fromKey, toKey) {
    var out = Object.create(null);
    U.eachDay(fromKey, toKey, function (k) {
      var list = index[k];
      if (!list) return;
      var t = 0;
      for (var i = 0; i < list.length; i++) t += minutesOf(list[i]);
      if (t) out[k] = t;
    });
    return out;
  }

  /**
   * Time consumption over a span: total, then category → item → activity.
   * Categories come back in the app's fixed order — never sorted by size — so
   * a colour always means the same category from one chart to the next.
   */
  function breakdown(fromKey, toKey) {
    var list = entriesBetween(fromKey, toKey);
    var byCat = Object.create(null);
    var total = 0;

    list.forEach(function (e) {
      var m = minutesOf(e);
      total += m;
      var row = byCat[e.categoryId] ||
        (byCat[e.categoryId] = { minutes: 0, items: Object.create(null), acts: Object.create(null) });
      row.minutes += m;
      var iname = e.itemName || window.T('ed.removed');
      var aname = e.activityName || window.T('ed.removed');
      var it = row.items[iname] || (row.items[iname] = { minutes: 0, acts: Object.create(null) });
      it.minutes += m;
      it.acts[aname] = (it.acts[aname] || 0) + m;
      row.acts[aname] = (row.acts[aname] || 0) + m;
    });

    function nameSort(a, b) { return b.minutes - a.minutes; }

    var cats = db.categories.map(function (c) {
      var row = byCat[c.id];
      var mins = row ? row.minutes : 0;
      return {
        id: c.id,
        name: c.name,
        color: categoryColor(c),
        minutes: mins,
        share: total ? mins / total : 0,
        items: row ? Object.keys(row.items).map(function (n) {
          return {
            name: n, minutes: row.items[n].minutes,
            share: total ? row.items[n].minutes / total : 0,
            acts: Object.keys(row.items[n].acts).map(function (a) {
              return { name: a, minutes: row.items[n].acts[a] };
            }).sort(nameSort)
          };
        }).sort(nameSort) : [],
        acts: row ? Object.keys(row.acts).map(function (n) {
          return { name: n, minutes: row.acts[n] };
        }).sort(nameSort) : []
      };
    });

    // Entries whose category was deleted mid-life still hold real time.
    var orphan = 0;
    Object.keys(byCat).forEach(function (cid) {
      if (!category(cid)) orphan += byCat[cid].minutes;
    });
    if (orphan) {
      cats.push({ id: '_orphan', name: window.T('st.removedItems'), color: 'var(--ink-45)',
                  minutes: orphan, share: total ? orphan / total : 0, items: [], acts: [] });
    }

    return { total: total, cats: cats, count: list.length, from: fromKey, to: toKey };
  }

  /** Flatten a breakdown to one row per item, tagged with its category colour. */
  function itemRows(b) {
    var out = [];
    b.cats.forEach(function (c) {
      c.items.forEach(function (it) {
        out.push({ name: it.name, category: c.name, color: c.color,
                   minutes: it.minutes, share: it.share });
      });
    });
    return out.sort(function (a, b2) { return b2.minutes - a.minutes; });
  }

  /** Flatten a breakdown to one row per activity name, across categories. */
  function activityRows(b) {
    var out = [];
    b.cats.forEach(function (c) {
      c.acts.forEach(function (a) {
        out.push({ name: a.name, category: c.name, color: c.color,
                   minutes: a.minutes, share: b.total ? a.minutes / b.total : 0 });
      });
    });
    return out.sort(function (a, b2) { return b2.minutes - a.minutes; });
  }

  /** Days in the span that have any recorded time. */
  function activeDays(fromKey, toKey) {
    return Object.keys(minutesByDay(fromKey, toKey)).length;
  }

  /* ---------------- custom palettes ---------------- */

  /**
   * A palette the user made: seven raw tokens, exactly what themes.css
   * declares for a built-in one.
   *   { id, name, bg, ink, cats: [5 hex] }
   */
  function palettes() { return db.palettes; }

  function palette(id) {
    for (var i = 0; i < db.palettes.length; i++) {
      if (db.palettes[i].id === id) return db.palettes[i];
    }
    return null;
  }

  function putPalette(p) {
    var existing = p.id ? palette(p.id) : null;
    if (existing) Object.assign(existing, p);
    else { p.id = p.id || 'own-' + U.id(); db.palettes.push(p); }
    save();
    return p;
  }

  function removePalette(id) {
    db.palettes = db.palettes.filter(function (p) { return p.id !== id; });
    // Fall back to the default rather than leaving the app pointing at a
    // palette that no longer exists.
    if (db.settings.theme === id) db.settings.theme = 'warm';
    save();
  }

  /* ---------------- periods ---------------- */

  function semesters() { return db.semesters; }

  function semesterAt(d) {
    var k = U.key(d);
    return db.semesters.filter(function (s) { return k >= s.start && k <= s.end; })[0] || null;
  }

  /**
   * Resolve a scope + anchor date into { from, to, label, sub }.
   * `extra` carries the chosen semester id when scope is 'semester'.
   */
  function periodRange(scope, anchor, extra) {
    var ws = db.settings.weekStart;
    var T = window.T;
    var from, to, label, sub;

    var I = window.I18n;

    if (scope === 'day') {
      from = to = U.key(anchor);
      label = I.fmtMonthDay(anchor);
      sub = U.dowName(anchor.getDay()) + ' · ' + anchor.getFullYear();

    } else if (scope === 'week') {
      var s = U.startOfWeek(anchor, ws), e = U.addDays(s, 6);
      from = U.key(s); to = U.key(e);
      label = I.fmtDayRange(s, e);
      sub = T('range.weekOf', { date: U.fmtDayLong(from) });

    } else if (scope === 'month') {
      from = U.key(U.startOfMonth(anchor)); to = U.key(U.endOfMonth(anchor));
      label = I.fmtMonthYear(anchor);
      sub = T('range.nDays', { n: U.daysInMonth(anchor.getFullYear(), anchor.getMonth()) });

    } else if (scope === 'year') {
      from = U.key(U.startOfYear(anchor)); to = U.key(U.endOfYear(anchor));
      label = String(anchor.getFullYear());
      sub = T('range.calendarYear');

    } else { // semester
      var sem = null;
      if (extra) sem = db.semesters.filter(function (s2) { return s2.id === extra; })[0];
      if (!sem) sem = semesterAt(anchor) || db.semesters[0];
      if (!sem) {
        from = to = U.key(anchor); label = T('range.noSemester'); sub = T('range.addInSettings');
      } else {
        from = sem.start; to = sem.end;
        label = sem.name;
        sub = U.fmtDay(sem.start) + ' – ' + U.fmtDay(sem.end) + ' · ' +
              T('range.nDays', { n: U.daysBetween(sem.start, sem.end) + 1 });
      }
    }

    return { scope: scope, from: from, to: to, label: label, sub: sub };
  }

  /** The span immediately before `range`, of the same length — for deltas. */
  function previousRange(range) {
    var span = U.daysBetween(range.from, range.to) + 1;
    return {
      from: U.key(U.addDays(U.date(range.from), -span)),
      to: U.key(U.addDays(U.date(range.from), -1))
    };
  }

  /* ---------------- import / export ---------------- */

  function exportJSON() { return JSON.stringify(db, null, 2); }

  function importJSON(text) {
    var parsed = JSON.parse(text);
    if (!parsed || !Array.isArray(parsed.categories) || !Array.isArray(parsed.entries)) {
      throw new Error(window.T('set.importFailed'));
    }
    db = migrate(parsed);
    save();
  }

  function reset() { db = defaults(); save(); }

  window.Store = {
    load: load, save: save, subscribe: subscribe, reload: reload,
    isNative: !!Native,
    get settings() { return db.settings; },
    get data() { return db; },
    categories: categories, category: category, categoryColor: categoryColor,
    addCategory: addCategory, removeCategory: removeCategory,
    addItem: addItem, removeItem: removeItem, moveItem: moveItem,
    allItems: allItems, categoryOfItem: categoryOfItem,
    addActivity: addActivity, removeActivity: removeActivity,
    renameNamed: renameNamed,
    entriesOn: entriesOn, entriesBetween: entriesBetween, entry: entry,
    putEntry: putEntry, removeEntry: removeEntry, moveEntry: moveEntry,
    minutesOf: minutesOf, minutesByDay: minutesByDay, breakdown: breakdown,
    itemRows: itemRows, activityRows: activityRows, activeDays: activeDays,
    semesters: semesters, semesterAt: semesterAt,
    palettes: palettes, palette: palette, putPalette: putPalette, removePalette: removePalette,
    periodRange: periodRange, previousRange: previousRange,
    exportJSON: exportJSON, importJSON: importJSON, reset: reset
  };
})(window);
