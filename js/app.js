/* app.js — the shell: routing, the top bar, the entry editor, settings.
 *
 * Views are plain modules with render(ctx) -> HTML and mount(root, ctx).
 * This file owns the only mutable UI state (which view, which scope, which
 * date we are anchored on) and hands each view a resolved range.
 */
(function (window) {
  'use strict';

  var U = window.U, Store = window.Store, Theme = window.Theme, I18n = window.I18n, T = window.T;
  var Fonts = window.Fonts;

  var VIEWS = {
    calendar:   { key: 'nav.calendar',   scopes: ['day', 'week', 'month'], mod: 'CalendarView' },
    heatmap:    { key: 'nav.heatmap',    scopes: ['year'],                 mod: 'HeatmapView' },
    stats:      { key: 'nav.stats',      scopes: ['day', 'week', 'month', 'year', 'semester'], mod: 'StatsView' },
    categories: { key: 'nav.categories', scopes: [],                       mod: 'CategoriesView' },
    palette:    { key: 'nav.palette',    scopes: [],                       mod: 'Theme' }
  };

  var state = {
    view: 'calendar',
    scope: { calendar: 'week', heatmap: 'year', stats: 'week' },
    anchor: new Date(),
    semesterId: null
  };

  /* ============================================================
     static strings
     ============================================================ */

  /** Fill everything in index.html that carries a data-t* attribute. */
  function applyStatic() {
    document.title = T('app.name');
    U.$$('[data-t]').forEach(function (el) { el.textContent = T(el.dataset.t); });
    U.$$('[data-t-html]').forEach(function (el) { el.innerHTML = T(el.dataset.tHtml); });
    U.$$('[data-t-label]').forEach(function (el) { el.setAttribute('aria-label', T(el.dataset.tLabel)); });
    U.$$('[data-t-placeholder]').forEach(function (el) { el.placeholder = T(el.dataset.tPlaceholder); });
  }

  function setLang(id) {
    I18n.set(id);
    Store.settings.lang = I18n.current();
    applyFonts();
    Store.save();
    applyStatic();
    render();
  }

  /** Put the plan this language remembers on the page. */
  function applyFonts() {
    var lang = I18n.current();
    var chosen = (Store.settings.fonts || {})[lang];
    return Fonts.apply(lang, chosen);
  }

  function setFontPlan(id) {
    var lang = I18n.current();
    if (!Store.settings.fonts) Store.settings.fonts = {};
    Store.settings.fonts[lang] = id;
    Store.save();
    Fonts.apply(lang, id);
  }

  /* ============================================================
     routing
     ============================================================ */

  function readHash() {
    var m = /^#\/([a-z]+)/.exec(window.location.hash || '');
    state.view = m && VIEWS[m[1]] ? m[1] : 'calendar';
  }

  function go(view) {
    if (window.location.hash === '#/' + view) render();
    else window.location.hash = '#/' + view;
  }

  function scope() {
    var def = VIEWS[state.view];
    if (!def.scopes.length) return null;
    var s = state.scope[state.view];
    return def.scopes.indexOf(s) >= 0 ? s : def.scopes[0];
  }

  function currentRange() {
    var s = scope();
    return s ? Store.periodRange(s, state.anchor, state.semesterId) : null;
  }

  /* ============================================================
     top bar
     ============================================================ */

  function paintTopbar() {
    var def = VIEWS[state.view];
    var s = scope();
    var range = currentRange();

    var title = U.$('#periodTitle'), sub = U.$('#periodSub');
    var nav = U.$('#periodNav'), sw = U.$('#scopeSwitch'), nw = U.$('#btnNew');

    if (!s) {
      title.textContent = T(def.key);
      sub.textContent = state.view === 'palette' ? T('nav.subPalette') : T('nav.subCategories');
      // Recording an entry is useful from anywhere; stepping a period is not.
      nav.hidden = true; sw.hidden = true; nw.hidden = false;
      sw.innerHTML = '';
      return;
    }

    nav.hidden = false; nw.hidden = false;
    title.textContent = range.label;
    sub.textContent = range.sub;

    sw.hidden = def.scopes.length < 2;
    sw.innerHTML = def.scopes.map(function (k) {
      return '<button type="button" role="tab" data-scope="' + k + '"' +
             ' aria-selected="' + (k === s) + '">' + U.esc(T('scope.' + k)) + '</button>';
    }).join('');
  }

  /** Move the anchor by `dir` periods (0 = jump to today). */
  function step(dir) {
    var s = scope();
    if (!s) return;

    if (dir === 0) {
      state.anchor = new Date();
      if (s === 'semester') {
        var here = Store.semesterAt(state.anchor);
        if (here) state.semesterId = here.id;
      }
      return;
    }

    if (s === 'day') state.anchor = U.addDays(state.anchor, dir);
    else if (s === 'week') state.anchor = U.addDays(state.anchor, 7 * dir);
    else if (s === 'month') state.anchor = U.addMonths(state.anchor, dir);
    else if (s === 'year') state.anchor = U.addMonths(state.anchor, 12 * dir);
    else {
      // Semesters are a hand-kept list, so walk it rather than the calendar.
      var list = Store.semesters();
      if (!list.length) return;
      var cur = currentRange();
      var idx = 0;
      for (var i = 0; i < list.length; i++) if (list[i].name === cur.label) idx = i;
      idx = U.clamp(idx + dir, 0, list.length - 1);
      state.semesterId = list[idx].id;
      state.anchor = U.date(list[idx].start);
    }
  }

  /* ============================================================
     render
     ============================================================ */

  var nowTimer = null;

  function render() {
    var def = VIEWS[state.view];
    var ctx = { view: state.view, scope: scope(), anchor: state.anchor, range: currentRange() };

    // Views bind delegated listeners to their root in mount(). Swap in a fresh
    // container each render so those listeners die with the old one — reusing
    // the node stacks up a duplicate handler per render, which is invisible for
    // idempotent actions and silently breaks anything that toggles.
    var stale = U.$('#view');
    var root = document.createElement('div');
    root.className = 'view';
    root.id = 'view';
    stale.replaceWith(root);

    U.$$('.nav__item').forEach(function (a) {
      a.classList.toggle('is-on', a.dataset.view === state.view);
      if (a.dataset.view === state.view) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    paintTopbar();

    var mod = window[def.mod];
    root.innerHTML = mod.render(ctx);
    if (mod.mount) mod.mount(root, ctx);
    if (mod.bind) mod.bind(root, ctx);

    paintMeter();

    // Keep the "now" line honest without re-rendering the world.
    clearInterval(nowTimer);
    if (state.view === 'calendar' && ctx.scope !== 'month') {
      nowTimer = setInterval(function () {
        if (state.view !== 'calendar') return;
        var line = U.$('.tt__now'), tt = U.$('.tt');
        if (!line || !tt) return;
        var n = new Date();
        var mins = n.getHours() * 60 + n.getMinutes();
        var lo = +tt.dataset.lo, span = +tt.dataset.span;
        line.style.top = ((mins - lo) / span * 100).toFixed(4) + '%';
      }, 60000);
    }
  }

  /* ---- the running total in the spine ---- */

  function paintMeter() {
    var today = U.key(new Date());
    var wkStart = U.key(U.startOfWeek(new Date(), Store.settings.weekStart));
    var wkEnd = U.key(U.addDays(U.date(wkStart), 6));

    var t = 0;
    Store.entriesOn(today).forEach(function (e) { t += Store.minutesOf(e); });
    var wk = 0;
    var byDay = Store.minutesByDay(wkStart, wkEnd);
    Object.keys(byDay).forEach(function (k) { wk += byDay[k]; });

    var goal = Store.settings.goal || 0;
    var pct = goal ? U.clamp(t / goal * 100, 0, 100) : 0;

    U.$('#spineMeter').innerHTML =
      '<div class="meter__row"><span class="meter__k">' + U.esc(T('meter.today')) + '</span>' +
        '<span class="meter__v num">' + U.dur(t) + '</span></div>' +
      (goal
        ? '<div class="meter__bar"><i style="width:' + pct.toFixed(1) + '%"></i></div>' +
          '<p class="meter__note num">' +
            U.esc(T('meter.goal', { pct: Math.round(pct), dur: U.dur(goal) })) + '</p>'
        : '') +
      '<div class="meter__row"><span class="meter__k">' + U.esc(T('meter.week')) + '</span>' +
        '<span class="meter__v num">' + U.dur(wk) + '</span></div>';
  }

  /* ============================================================
     entry editor
     ============================================================ */

  var sheet, editingId = null;
  var itemCatId = null;          // the category the chosen item currently lives in

  /* The item select lists every item in the ledger, grouped by its category,
     because choosing the item is what the user actually came to do. Picking one
     answers the category on its behalf. */
  function fillItems(selName, selCatId) {
    var sel = U.$('#fItem');
    var html = '', firstId = null, match = null;

    Store.categories().forEach(function (c) {
      if (!c.items.length) return;
      html += '<optgroup label="' + U.esc(c.name) + '">' + c.items.map(function (it) {
        if (!firstId) firstId = it.id;
        if (selName && c.id === selCatId && it.name === selName) match = it;
        return '<option value="' + U.esc(it.id) + '" data-cat="' + U.esc(c.id) + '"' +
               ' data-name="' + U.esc(it.name) + '">' + U.esc(it.name) + '</option>';
      }).join('') + '</optgroup>';
    });

    // An entry whose item was later deleted keeps its own name selectable, so
    // editing it never silently re-files the record.
    if (selName && !match) {
      html += '<option value="__orphan" data-cat="' + U.esc(selCatId || '') + '"' +
              ' data-name="' + U.esc(selName) + '">' + U.esc(selName) + ' ' +
              U.esc(T('ed.removed')) + '</option>';
    }
    html += '<option value="__custom">' + U.esc(T('ed.newItem')) + '</option>';

    sel.innerHTML = html;
    sel.value = match ? match.id : (selName ? '__orphan' : (firstId || '__custom'));
    syncFromItem(false);
  }

  /** Point the category at whatever the chosen item belongs to, and lock it. */
  function syncFromItem(focusCustom) {
    var sel = U.$('#fItem');
    var input = U.$('#fItemCustom');
    var custom = sel.value === '__custom';

    input.hidden = !custom;
    input.required = custom;
    if (custom && focusCustom) input.focus();

    if (!custom) {
      var opt = sel.selectedOptions[0];
      var cid = opt && opt.dataset.cat;
      if (cid && Store.category(cid)) U.$('#fCategory').value = cid;
      itemCatId = U.$('#fCategory').value;
    } else {
      itemCatId = null;
    }

    // A brand-new item has to be filed somewhere, so its category stays open.
    setLock(!custom);
    fillActivities(null);
    paintSwatch();
  }

  function setLock(locked) {
    var btn = U.$('#fLock'), cat = U.$('#fCategory'), hint = U.$('#fCatHint');
    var isNew = U.$('#fItem').value === '__custom';
    cat.disabled = locked;
    btn.hidden = isNew;
    btn.classList.toggle('is-locked', locked);
    btn.setAttribute('aria-pressed', String(locked));
    hint.hidden = isNew || !locked;
  }

  function fillCategories(selId) {
    var sel = U.$('#fCategory');
    sel.innerHTML = Store.categories().map(function (c) {
      return '<option value="' + U.esc(c.id) + '">' + U.esc(c.name) + '</option>';
    }).join('');
    if (selId && Store.category(selId)) sel.value = selId;
    return sel.value;
  }

  /**
   * Activities belong to the category, so this follows whatever the category
   * currently is. `selName` may be a name the category no longer offers.
   */
  function fillActivities(selName) {
    var selEl = U.$('#fActivity'), inputEl = U.$('#fActivityCustom');
    var cat = Store.category(U.$('#fCategory').value);
    var list = cat ? cat.activities : [];
    var known = list.some(function (a) { return a.name === selName; });

    selEl.innerHTML =
      list.map(function (a) {
        return '<option value="' + U.esc(a.name) + '">' + U.esc(a.name) + '</option>';
      }).join('') +
      (selName && !known
        ? '<option value="' + U.esc(selName) + '">' + U.esc(selName) + ' ' + U.esc(T('ed.removed')) + '</option>'
        : '') +
      '<option value="__custom">' + U.esc(T('ed.custom')) + '</option>';

    if (selName) selEl.value = selName;
    else if (list.length) selEl.value = list[0].name;
    else selEl.value = '__custom';

    toggleCustom(selEl, inputEl, false);
  }

  function toggleCustom(selEl, inputEl, focus) {
    var custom = selEl.value === '__custom';
    inputEl.hidden = !custom;
    inputEl.required = custom;
    if (custom && focus) inputEl.focus();
  }

  function paintSwatch() {
    U.$('#fSwatch').style.background = Store.categoryColor(Store.category(U.$('#fCategory').value));
  }

  /** The name of whatever the item select is currently pointing at. */
  function chosenItemName() {
    var sel = U.$('#fItem');
    if (sel.value === '__custom') return U.$('#fItemCustom').value.trim();
    var opt = sel.selectedOptions[0];
    return opt ? (opt.dataset.name || '') : '';
  }

  function paintDuration() {
    var a = U.mins(U.$('#fStart').value || '0:00');
    var b = U.mins(U.$('#fEnd').value || '0:00');
    var out = U.$('#fDuration');
    if (b === a) { out.textContent = T('ed.needDuration'); return; }
    if (b < a) { out.textContent = T('ed.pastMidnight', { dur: U.dur(U.MIN_PER_DAY - a + b) }); return; }
    out.textContent = T('ed.duration', { dur: U.dur(b - a) });
  }

  function openEditor(entry, draft) {
    editingId = entry ? entry.id : null;
    U.$('#entrySheetTitle').textContent = entry ? T('ed.edit') : T('ed.new');
    U.$('#fDelete').hidden = !entry;
    U.$('#fItemCustom').value = '';
    U.$('#fActivityCustom').value = '';

    fillCategories(entry ? entry.categoryId : null);
    fillItems(entry ? entry.itemName : null, entry ? entry.categoryId : null);
    if (entry) fillActivities(entry.activityName);

    var d = entry || draft || {};
    var now = new Date();
    var defStart = U.snap(now.getHours() * 60 + now.getMinutes(), Store.settings.snap || 15);

    U.$('#fDate').value = d.day || U.key(state.anchor);
    U.$('#fStart').value = U.hhmm(d.start !== undefined ? d.start : defStart);
    U.$('#fEnd').value = U.hhmm(d.end !== undefined ? d.end : Math.min(defStart + 60, U.MIN_PER_DAY));
    U.$('#fNote').value = (entry && entry.note) || '';

    paintDuration();
    sheet.returnValue = '';
    sheet.showModal();

    // Without this the dialog autofocuses its close button. Land on the item,
    // which is the first thing to decide.
    var ic = U.$('#fItemCustom');
    (ic.hidden ? U.$('#fItem') : ic).focus();
  }

  function commitEditor() {
    var itemSel = U.$('#fItem');
    var itemName = chosenItemName();
    if (!itemName) { toast(T('msg.nameItem'), true); return; }

    var catId = U.$('#fCategory').value;

    var actSel = U.$('#fActivity');
    var actName = actSel.value === '__custom' ? U.$('#fActivityCustom').value.trim() : actSel.value;
    if (!actName) { toast(T('msg.nameActivity'), true); return; }

    // A name typed in the editor is worth keeping: fold it into the category's
    // list so it is one click away next time.
    if (itemSel.value === '__custom') Store.addItem(catId, itemName);
    if (actSel.value === '__custom') Store.addActivity(catId, actName);

    var day = U.$('#fDate').value;
    var start = U.mins(U.$('#fStart').value);
    var end = U.mins(U.$('#fEnd').value);
    var note = U.$('#fNote').value.trim();

    if (!day) { toast(T('msg.pickDate'), true); return; }
    if (end === start) { toast(T('ed.needDuration'), true); return; }

    var base = { categoryId: catId, itemName: itemName, activityName: actName, note: note };

    if (end < start) {
      // Crossing midnight: keep the first half on its own day, spill the rest.
      var next = U.key(U.addDays(U.date(day), 1));
      Store.putEntry(Object.assign({ id: editingId }, base, { day: day, start: start, end: U.MIN_PER_DAY }));
      Store.putEntry(Object.assign({}, base, { day: next, start: 0, end: end }));
      toast(T('msg.splitMidnight'));
    } else {
      Store.putEntry(Object.assign({ id: editingId }, base, { day: day, start: start, end: end }));
      toast(editingId ? T('msg.entryUpdated') : T('msg.entryAdded'));
    }

    editingId = null;
    render();
  }

  function bindEditor() {
    sheet = U.$('#entrySheet');

    U.$$('[data-cancel]', sheet).forEach(function (b) {
      b.addEventListener('click', function () { editingId = null; sheet.close('cancel'); });
    });

    U.$('#fItem').addEventListener('change', function () { syncFromItem(true); });

    // The lock only opens on purpose: re-filing an item moves its whole history.
    U.$('#fLock').addEventListener('click', function () {
      setLock(false);
      U.$('#fCategory').focus();
    });

    U.$('#fCategory').addEventListener('change', function () {
      var sel = U.$('#fItem');
      var newCat = this.value;
      var real = sel.value !== '__custom' && sel.value !== '__orphan';

      if (real && itemCatId && itemCatId !== newCat) {
        var name = chosenItemName();
        Store.moveItem(itemCatId, name, newCat);
        toast(T('msg.itemMoved', { name: name, cat: Store.category(newCat).name }));
        fillCategories(newCat);
        fillItems(name, newCat);        // rebuilds under the new group, and re-locks
        render();
        return;
      }
      itemCatId = real ? newCat : null;
      fillActivities(null);
      paintSwatch();
    });

    U.$('#fActivity').addEventListener('change', function () {
      toggleCustom(this, U.$('#fActivityCustom'), true);
    });
    ['#fStart', '#fEnd'].forEach(function (s) {
      U.$(s).addEventListener('input', paintDuration);
    });

    U.$('#fDelete').addEventListener('click', function () {
      if (!editingId) return;
      if (!window.confirm(T('ask.deleteEntry'))) return;
      Store.removeEntry(editingId);
      editingId = null;
      sheet.close('cancel');
      render();
      toast(T('msg.entryDeleted'));
    });

    sheet.addEventListener('close', function () {
      if (sheet.returnValue === 'save') commitEditor();
      else editingId = null;
    });
  }

  /* ============================================================
     utility sheet (settings / help)
     ============================================================ */

  var util, sheetDismiss = null;

  /**
   * The shared sheet. `onDismiss` runs only when the sheet is closed by the
   * user (Esc, ✕, the backdrop) rather than by code, which is how the palette
   * editor knows to drop its live preview.
   */
  function openSheet(title, body, foot, onMount, onDismiss) {
    U.$('#utilSheetTitle').textContent = title;
    U.$('#utilSheetBody').innerHTML = body;
    U.$('#utilSheetFoot').innerHTML = foot || '<span class="spacer"></span>' +
      '<button class="btn btn--ghost" type="button" data-close>' + U.esc(T('ui.close')) + '</button>';
    sheetDismiss = onDismiss || null;
    if (!util.open) util.showModal();
    if (onMount) onMount(util);
  }

  function closeSheet() {
    sheetDismiss = null;      // closed deliberately; the caller cleans up itself
    util.close();
  }

  function section(title, inner) {
    return '<div class="sheet__section"><h4>' + U.esc(title) + '</h4>' + inner + '</div>';
  }

  function settingsHTML() {
    var s = Store.settings;

    var hourOpts = function (id, val) {
      var o = '';
      for (var h = 0; h <= 24; h++) {
        o += '<option value="' + h + '"' + (h === val ? ' selected' : '') + '>' +
             U.esc(U.clockLabel(h % 24) + (h === 24 ? ' ' + T('set.midnight') : '')) + '</option>';
      }
      return '<select id="' + id + '">' + o + '</select>';
    };

    var langOpts = I18n.LOCALES.map(function (L) {
      return '<option value="' + L.id + '"' + (L.id === I18n.current() ? ' selected' : '') + '>' +
             U.esc(L.endonym + (L.endonym === L.name ? '' : ' — ' + L.name)) + '</option>';
    }).join('');

    var sems = Store.semesters().map(function (m) {
      return '<div class="semrow" data-sem="' + U.esc(m.id) + '">' +
        '<input type="text" value="' + U.esc(m.name) + '" data-k="name" aria-label="' + U.esc(T('set.semName')) + '">' +
        '<input type="date" value="' + U.esc(m.start) + '" data-k="start" aria-label="' + U.esc(T('set.semStart')) + '">' +
        '<input type="date" value="' + U.esc(m.end) + '" data-k="end" aria-label="' + U.esc(T('set.semEnd')) + '">' +
        '<button class="iconbtn" type="button" data-rmsem="' + U.esc(m.id) + '"' +
          ' aria-label="' + U.esc(T('ui.delete')) + '">✕</button>' +
      '</div>';
    }).join('');

    var lang = I18n.current();
    var planId = (s.fonts || {})[lang];
    var here = Fonts.plan(lang, planId);
    var spec = Fonts.specimen(lang);
    var plans = Fonts.plansFor(lang).map(function (fp) {
      return '<button type="button" class="fplan' + (fp.id === here.id ? ' is-on' : '') + '"' +
        ' data-font="' + U.esc(fp.id) + '" aria-pressed="' + (fp.id === here.id) + '">' +
        '<span class="fplan__spec" style="font-family:' + fp.display + '">' + U.esc(spec) + '</span>' +
        '<span class="fplan__name" style="font-family:' + fp.body + '">' + U.esc(fp.name) + '</span>' +
        '<span class="fplan__note">' + U.esc(fp.note) + '</span>' +
      '</button>';
    }).join('');

    // The section heading already names this, so the select carries only an
    // accessible label rather than repeating it on screen.
    return section(T('set.language'),
        '<select id="sLang" aria-label="' + U.esc(T('set.language')) + '">' + langOpts + '</select>' +
        '<p class="field__hint" style="margin-top:8px">' + U.esc(T('set.languageHint')) + '</p>') +

      section(T('set.typography'),
        '<p class="field__hint" style="margin:0 0 12px">' + U.esc(T('set.typographyHint')) + '</p>' +
        '<div class="fplans">' + plans + '</div>') +

      section(T('set.week'),
        '<div class="grid3">' +
          '<div class="field"><label for="sWeekStart">' + U.esc(T('set.startsOn')) + '</label>' +
            '<select id="sWeekStart">' +
              '<option value="1"' + (s.weekStart === 1 ? ' selected' : '') + '>' + U.esc(T('set.monday')) + '</option>' +
              '<option value="0"' + (s.weekStart === 0 ? ' selected' : '') + '>' + U.esc(T('set.sunday')) + '</option>' +
            '</select></div>' +
          '<div class="field"><label for="sDayStart">' + U.esc(T('set.gridFrom')) + '</label>' + hourOpts('sDayStart', s.dayStart) + '</div>' +
          '<div class="field"><label for="sDayEnd">' + U.esc(T('set.gridTo')) + '</label>' + hourOpts('sDayEnd', s.dayEnd) + '</div>' +
        '</div>' +
        '<p class="field__hint">' + U.esc(T('set.gridHint')) + '</p>') +

      section(T('set.targets'),
        '<div class="grid3">' +
          '<div class="field"><label for="sGoal">' + U.esc(T('set.goalH')) + '</label>' +
            '<input type="number" id="sGoal" min="0" max="24" step="0.5" value="' + (s.goal / 60) + '"></div>' +
          '<div class="field"><label for="sPeak">' + U.esc(T('set.peakH')) + '</label>' +
            '<input type="number" id="sPeak" min="1" max="24" step="0.5" value="' + (s.heatPeak / 60) + '"></div>' +
          '<div class="field"><label for="sSnap">' + U.esc(T('set.snap')) + '</label>' +
            '<select id="sSnap">' + [5, 10, 15, 30].map(function (n) {
              return '<option value="' + n + '"' + (s.snap === n ? ' selected' : '') + '>' +
                     U.esc(T('set.minutes', { n: n })) + '</option>';
            }).join('') + '</select></div>' +
        '</div>' +
        '<p class="field__hint">' + U.esc(T('set.peakHint')) + '</p>') +

      section(T('set.semesters'),
        '<div id="semList">' + (sems || '<p class="field__hint">' + U.esc(T('set.noSemesters')) + '</p>') + '</div>' +
        '<button class="btn btn--ghost btn--sm" type="button" data-addsem style="margin-top:10px">' +
          U.esc(T('set.addSemester')) + '</button>') +

      section(T('set.data'),
        '<p style="font-size:.88rem;color:var(--ink-52)">' + U.esc(T('set.dataBlurb')) + '</p>' +
        '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">' +
          '<button class="btn btn--ghost btn--sm" type="button" data-export>' + U.esc(T('set.export')) + '</button>' +
          '<button class="btn btn--ghost btn--sm" type="button" data-import>' + U.esc(T('set.import')) + '</button>' +
          '<button class="btn btn--ghost btn--sm btn--danger" type="button" data-reset>' + U.esc(T('set.erase')) + '</button>' +
        '</div>' +
        '<p class="field__hint">' + U.esc(T('set.dataNote',
          { a: Store.data.entries.length, b: Store.categories().length })) + '</p>');
  }

  function openSettings() {
    openSheet(T('set.title'), settingsHTML(), null, function (root) {
      var s = Store.settings;
      var num = function (sel) { return parseFloat(U.$(sel, root).value); };

      U.$('#sLang', root).addEventListener('change', function () {
        var id = this.value;
        setLang(id);
        openSettings();                       // redraw the sheet in the new language
        toast(T('msg.language', { name: I18n.locale(id).endonym }));
      });

      Fonts.preloadAll(I18n.current());
      U.on(root, 'click', '[data-font]', function (e, btn) {
        setFontPlan(btn.dataset.font);
        openSettings();
      });

      U.$('#sWeekStart', root).addEventListener('change', function () {
        s.weekStart = +this.value; Store.save(); render();
      });
      U.$('#sSnap', root).addEventListener('change', function () { s.snap = +this.value; Store.save(); });
      U.$('#sGoal', root).addEventListener('change', function () {
        s.goal = Math.round(U.clamp(num('#sGoal') || 0, 0, 24) * 60); Store.save(); paintMeter();
      });
      U.$('#sPeak', root).addEventListener('change', function () {
        s.heatPeak = Math.round(U.clamp(num('#sPeak') || 6, 0.5, 24) * 60); Store.save(); render();
      });

      function setRange() {
        var a = +U.$('#sDayStart', root).value, b = +U.$('#sDayEnd', root).value;
        if (b <= a) { b = Math.min(24, a + 1); U.$('#sDayEnd', root).value = b; }
        s.dayStart = a; s.dayEnd = b;
        Store.save(); render();
      }
      U.$('#sDayStart', root).addEventListener('change', setRange);
      U.$('#sDayEnd', root).addEventListener('change', setRange);

      /* semesters */
      U.on(root, 'change', '.semrow input', function (e, input) {
        var row = input.closest('.semrow');
        var sem = Store.semesters().filter(function (m) { return m.id === row.dataset.sem; })[0];
        if (!sem) return;
        sem[input.dataset.k] = input.value;
        if (sem.end < sem.start) { sem.end = sem.start; row.querySelector('[data-k="end"]').value = sem.end; }
        Store.save(); render();
      });
      U.on(root, 'click', '[data-rmsem]', function (e, btn) {
        Store.data.semesters = Store.semesters().filter(function (m) { return m.id !== btn.dataset.rmsem; });
        Store.save();
        openSettings();
      });
      U.on(root, 'click', '[data-addsem]', function () {
        var y = state.anchor.getFullYear();
        Store.data.semesters.push({ id: U.id(), name: T('set.newTerm'),
                                    start: y + '-09-01', end: (y + 1) + '-01-15' });
        Store.save();
        openSettings();
      });

      /* data */
      U.on(root, 'click', '[data-export]', function () {
        var blob = new Blob([Store.exportJSON()], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'study-ledger-' + U.key(new Date()) + '.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
        toast(T('msg.exported'));
      });

      U.on(root, 'click', '[data-import]', function () {
        var inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = 'application/json,.json';
        inp.addEventListener('change', function () {
          var f = inp.files && inp.files[0];
          if (!f) return;
          var fr = new FileReader();
          fr.onload = function () {
            try {
              if (!window.confirm(T('ask.import'))) return;
              Store.importJSON(String(fr.result));
              I18n.set(Store.settings.lang);
              applyFonts();
              Theme.init();
              applyStatic();
              util.close();
              render();
              toast(T('msg.imported', { n: Store.data.entries.length }));
            } catch (err) {
              toast(err.message || T('set.importFailed'), true);
            }
          };
          fr.readAsText(f);
        });
        inp.click();
      });

      U.on(root, 'click', '[data-reset]', function () {
        if (!window.confirm(T('ask.erase'))) return;
        Store.reset();
        applyFonts();
        Theme.init();
        util.close();
        render();
        toast(T('msg.erased'));
      });
    });
  }

  function openHelp() {
    openSheet(T('help.title'),
      section(T('help.recording'),
        '<ul><li>' + T('help.r1') + '</li><li>' + T('help.r2') + '</li>' +
        '<li>' + T('help.r3') + '</li><li>' + T('help.r4') + '</li></ul>') +
      section(T('help.keyboard'),
        '<ul><li>' + T('help.k1') + '</li><li>' + T('help.k2') + '</li><li>' + T('help.k3') + '</li></ul>') +
      section(T('help.storage'),
        '<p style="font-size:.9rem">' + T('help.storageText') + '</p>'));
  }

  /* ============================================================
     tooltip & toast
     ============================================================ */

  var tipEl, toastEl, toastTimer;

  function tip(html, anchorEl) {
    tipEl = tipEl || U.$('#tip');
    if (!tipEl) return;
    tipEl.innerHTML = html;
    tipEl.classList.add('is-on');
    tipEl.setAttribute('aria-hidden', 'false');
    var r = anchorEl.getBoundingClientRect();
    var t = tipEl.getBoundingClientRect();
    var x = U.clamp(r.left + r.width / 2 - t.width / 2, 8, window.innerWidth - t.width - 8);
    var y = r.top - t.height - 9;
    if (y < 8) y = r.bottom + 9;
    tipEl.style.left = x + 'px';
    tipEl.style.top = y + 'px';
  }

  function tipOff() {
    if (!tipEl) return;
    tipEl.classList.remove('is-on');
    tipEl.setAttribute('aria-hidden', 'true');
  }

  function toast(msg, bad) {
    // Store.save() can report a storage failure before the shell has booted,
    // so resolve the node lazily rather than assuming boot() already ran.
    toastEl = toastEl || U.$('#toast');
    if (!toastEl) { (bad ? console.error : console.log)('Study Ledger: ' + msg); return; }
    toastEl.textContent = msg;
    toastEl.classList.toggle('is-bad', !!bad);
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, bad ? 4200 : 2400);
  }

  /* ============================================================
     boot
     ============================================================ */

  function bindShell() {
    U.on(U.$('#periodNav'), 'click', '[data-step]', function (e, btn) {
      step(+btn.dataset.step);
      render();
    });

    U.on(U.$('#scopeSwitch'), 'click', '[data-scope]', function (e, btn) {
      state.scope[state.view] = btn.dataset.scope;
      render();
    });

    U.$('#btnNew').addEventListener('click', function () { newEntry(); });
    U.$('#btnSettings').addEventListener('click', openSettings);
    U.$('#btnHelp').addEventListener('click', openHelp);

    U.on(util, 'click', '[data-close]', function () { closeSheet(); });
    util.addEventListener('close', function () {
      var fn = sheetDismiss;
      sheetDismiss = null;
      if (fn) fn();
    });

    window.addEventListener('hashchange', function () { readHash(); render(); });

    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && (t.closest('input, select, textarea') || t.isContentEditable)) return;
      if (sheet.open || util.open) return;

      var k = e.key.toLowerCase();
      var order = ['calendar', 'heatmap', 'stats', 'categories', 'palette'];

      if (k === 'arrowleft') { step(-1); render(); }
      else if (k === 'arrowright') { step(1); render(); }
      else if (k === 't') { step(0); render(); }
      else if (k === 'n') { e.preventDefault(); newEntry(); }
      else if (k === 'd' || k === 'w' || k === 'm') {
        var want = { d: 'day', w: 'week', m: 'month' }[k];
        if (VIEWS[state.view].scopes.indexOf(want) >= 0) { state.scope[state.view] = want; render(); }
      } else if (/^[1-5]$/.test(k)) {
        go(order[+k - 1]);
      }
    });
  }

  function newEntry(draft) { openEditor(null, draft); }

  function editEntry(id) {
    var e = Store.entry(id);
    if (e) openEditor(e);
  }

  function goDay(dayKey) {
    state.anchor = U.date(dayKey);
    state.scope.calendar = 'day';
    go('calendar');
  }

  function boot() {
    // A language must exist before the store seeds its presets, so read the
    // saved choice straight out of storage before anything else runs.
    var saved = null;
    try { saved = JSON.parse(window.localStorage.getItem('study-ledger-v1') || 'null'); }
    catch (err) { saved = null; }
    I18n.set((saved && saved.settings && saved.settings.lang) || I18n.detect());

    Store.load();
    I18n.set(Store.settings.lang);
    applyFonts();
    Theme.init();

    tipEl = U.$('#tip');
    toastEl = U.$('#toast');
    util = U.$('#utilSheet');

    var here = Store.semesterAt(new Date());
    state.semesterId = here ? here.id : (Store.semesters()[0] || {}).id || null;

    applyStatic();
    bindEditor();
    bindShell();
    readHash();
    render();

    Store.subscribe(paintMeter);
  }

  window.App = {
    render: render, go: go, goDay: goDay, setLang: setLang, setFontPlan: setFontPlan,
    newEntry: newEntry, editEntry: editEntry,
    tip: tip, tipOff: tipOff, toast: toast,
    openSheet: openSheet, closeSheet: closeSheet,
    state: state
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
