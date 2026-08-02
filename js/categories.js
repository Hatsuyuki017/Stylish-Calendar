/* categories.js — the taxonomy: categories, their items, their activities.
 *
 * category   the kind of work   Course Work
 *   item     the actual thing   Advanced Optimisation, Numerical Methods
 *   activity what you did       Lecture, Notetaking, Homework
 *
 * Only categories are listed at the top level. An item is never a sibling of
 * Course Work — it lives inside it, and the panel opens when you click the
 * category. Items and activities are both per-category: every course under
 * Course Work draws on the same activity vocabulary, so it is defined once.
 */
(function (window) {
  'use strict';

  var U = window.U, Store = window.Store, T = window.T;

  // Which categories are expanded, kept across re-renders.
  var open = Object.create(null);
  var known = Object.create(null);   // category ids rendered at least once

  /** Lifetime minutes per category, per item and per activity. */
  function totals() {
    var cat = Object.create(null), item = Object.create(null), act = Object.create(null);
    Store.data.entries.forEach(function (e) {
      var m = Store.minutesOf(e);
      cat[e.categoryId] = (cat[e.categoryId] || 0) + m;
      item[e.categoryId + ' ' + (e.itemName || '')] = (item[e.categoryId + ' ' + (e.itemName || '')] || 0) + m;
      act[e.categoryId + ' ' + (e.activityName || '')] = (act[e.categoryId + ' ' + (e.activityName || '')] || 0) + m;
    });
    return { cat: cat, item: item, act: act };
  }

  /** An input sized to its own text, so a tag hugs the word inside it. */
  function sizedInput(cls, value, extra) {
    var w = Math.max(6, Math.min(38, value.length + 1));
    return '<input class="' + cls + '" value="' + U.esc(value) + '" style="width:' + w + 'ch" ' +
           extra + ' autocomplete="off" spellcheck="false">';
  }

  function render() {
    var t = totals();
    var cats = Store.categories();

    // On a first visit — or after a reset or import replaces the lot — open the
    // first category so the page shows what it is. Once the user has folded
    // them shut they stay shut.
    var fresh = cats.filter(function (c) { return !known[c.id]; });
    cats.forEach(function (c) { known[c.id] = true; });
    if (cats.length && fresh.length === cats.length) open[cats[0].id] = true;

    var body = cats.map(function (c) {
      var color = Store.categoryColor(c);
      var used = t.cat[c.id] || 0;
      var isOpen = !!open[c.id];
      var bodyId = 'catbody-' + c.id;

      var slots = '';
      for (var s = 0; s < 5; s++) {
        slots += '<button type="button" data-slot="' + s + '" data-cat="' + U.esc(c.id) + '"' +
                 ' style="background:var(--cat-' + (s + 1) + ')"' +
                 ' aria-pressed="' + (c.slot === s && !c.color) + '"' +
                 ' aria-label="' + U.esc(T('cat.colour', { n: s + 1 })) + '"></button>';
      }

      var items = c.items.map(function (it) {
        var m = t.item[c.id + ' ' + it.name] || 0;
        return '<div class="itemrow">' +
          '<span class="itemrow__dot" aria-hidden="true"></span>' +
          '<input class="itemrow__name" value="' + U.esc(it.name) + '"' +
            ' data-renameitem="' + U.esc(it.id) + '" data-cat="' + U.esc(c.id) + '"' +
            ' aria-label="' + U.esc(T('cat.itemName')) + '" autocomplete="off">' +
          '<span class="itemrow__t num">' + (m ? U.dur(m) : '') + '</span>' +
          '<button class="tag__x" type="button" data-rmitem="' + U.esc(it.id) + '"' +
            ' data-cat="' + U.esc(c.id) + '"' +
            ' aria-label="' + U.esc(T('cat.remove', { name: it.name })) + '">✕</button>' +
        '</div>';
      }).join('');

      var acts = c.activities.map(function (a) {
        var m = t.act[c.id + ' ' + a.name] || 0;
        return '<span class="tag">' +
          sizedInput('tag__in', a.name,
            'data-renameact="' + U.esc(a.id) + '" data-cat="' + U.esc(c.id) + '"') +
          (m ? '<b class="num">' + U.dur(m) + '</b>' : '') +
          '<button class="tag__x" type="button" data-rmact="' + U.esc(a.id) + '"' +
            ' data-cat="' + U.esc(c.id) + '"' +
            ' aria-label="' + U.esc(T('cat.remove', { name: a.name })) + '">✕</button>' +
        '</span>';
      }).join('');

      return '<article class="subject' + (isOpen ? ' is-open' : '') + '" style="--c:' + color + '">' +
        '<div class="subject__head" data-toggle="' + U.esc(c.id) + '">' +
          '<button class="subject__chev" type="button" aria-expanded="' + isOpen + '"' +
            ' aria-controls="' + bodyId + '" aria-label="' + U.esc(T('cat.toggle')) + '">' +
            '<svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">' +
              '<path d="M3 1.5 L7 5 L3 8.5" fill="none" stroke="currentColor" stroke-width="1.6"' +
              ' stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
          '<span class="swatch" style="background:' + color + '"></span>' +
          '<input class="subject__name" value="' + U.esc(c.name) + '" data-renamecat="' + U.esc(c.id) + '"' +
            ' aria-label="' + U.esc(T('cat.categoryName')) + '">' +
          '<span class="subject__count">' +
            U.esc(T('cat.count', { i: c.items.length, a: c.activities.length })) + '</span>' +
          '<span class="subject__meta num">' +
            (used ? U.esc(T('cat.logged', { dur: U.dur(used) })) : U.esc(T('cat.unused'))) + '</span>' +
          '<div class="subject__tools">' +
            '<div class="slotpick">' + slots + '</div>' +
            '<button class="btn btn--ghost btn--sm btn--danger" type="button"' +
              ' data-rmcat="' + U.esc(c.id) + '">' + U.esc(T('ui.delete')) + '</button>' +
          '</div>' +
        '</div>' +

        '<div class="subject__body" id="' + bodyId + '"' + (isOpen ? '' : ' hidden') + '>' +
          // A category with no items shows no items block at all — only the
          // way to add the first one.
          (items
            ? '<h4 class="eyebrow subject__lbl">' + U.esc(T('cat.itemsLabel')) + '</h4>' +
              '<div class="items">' + items + '</div>'
            : '') +
          '<button class="tag tag--add" type="button" data-additem="' + U.esc(c.id) + '">' +
            U.esc(T('cat.newItem')) + '</button>' +

          '<h4 class="eyebrow subject__lbl" style="margin-top:16px">' +
            U.esc(T('cat.activitiesLabel')) + '</h4>' +
          '<div class="tags">' + acts +
            '<button class="tag tag--add" type="button" data-addact="' + U.esc(c.id) + '">' +
              U.esc(T('cat.newActivity')) + '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');

    return '<div class="pad">' +
      '<section class="panel">' +
        '<div class="panel__head">' +
          '<h3 class="panel__title">' + T('cat.title') + '</h3>' +
          '<div style="display:flex;gap:8px">' +
            '<button class="btn btn--ghost btn--sm" type="button" data-restore>' +
              U.esc(T('cat.restore')) + '</button>' +
            '<button class="btn btn--solid btn--sm" type="button" data-addcat>' +
              U.esc(T('cat.newCategory')) + '</button>' +
          '</div>' +
        '</div>' +
        '<p style="font-size:.88rem;color:var(--ink-52);margin-bottom:18px;max-width:72ch">' +
          U.esc(T('cat.intro')) + '</p>' +
        (body || '<div class="empty"><div class="empty__mark">∅</div><p>' +
                 U.esc(T('cat.noCategories')) + '</p></div>') +
      '</section>' +
    '</div>';
  }

  /* ---------------- interaction ---------------- */

  function mount(root) {
    /* ---- expand / collapse ---- */

    U.on(root, 'click', '[data-toggle]', function (e, head) {
      // The header also carries the name field, colour chips and Delete;
      // only bare clicks on the row itself should fold it.
      if (e.target.closest('input, select, .subject__tools')) return;
      var id = head.dataset.toggle;
      open[id] = !open[id];
      var art = head.closest('.subject');
      var body = U.$('#catbody-' + id, root);
      art.classList.toggle('is-open', open[id]);
      body.hidden = !open[id];
      U.$('.subject__chev', head).setAttribute('aria-expanded', String(!!open[id]));
    });

    /* ---- renaming, in place ---- */

    U.on(root, 'change', '[data-renamecat]', function (e, input) {
      var c = Store.category(input.dataset.renamecat);
      var name = input.value.trim();
      if (!c) return;
      if (!name) { input.value = c.name; return; }
      if (name === c.name) return;
      c.name = name;
      Store.save();
      window.App.toast(T('msg.renamed', { name: name }));
    });

    U.on(root, 'change', '[data-renameitem]', function (e, input) {
      commitRename(input, 'items', input.dataset.renameitem);
    });
    U.on(root, 'change', '[data-renameact]', function (e, input) {
      commitRename(input, 'activities', input.dataset.renameact);
    });

    function commitRename(input, listKey, id) {
      var c = Store.category(input.dataset.cat);
      if (!c) return;
      var row = c[listKey].filter(function (a) { return a.id === id; })[0];
      if (!row) return;
      var name = input.value.trim();
      if (!name) { input.value = row.name; return; }
      if (name === row.name) return;
      Store.renameNamed(c.id, listKey, id, name);
      window.App.render();
      window.App.toast(T('msg.renamed', { name: name }));
    }

    U.on(root, 'keydown', 'input[data-renamecat], input[data-renameitem], input[data-renameact]',
      function (e, input) {
        if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
        if (e.key === 'Escape') { input.value = input.defaultValue; input.blur(); }
      });

    /* ---- colour ---- */

    U.on(root, 'click', '[data-slot]', function (e, btn) {
      var c = Store.category(btn.dataset.cat);
      if (!c) return;
      c.slot = +btn.dataset.slot;
      c.color = null;
      Store.save();
      window.App.render();
    });

    /* ---- deleting ---- */

    U.on(root, 'click', '[data-rmcat]', function (e, btn) {
      var c = Store.category(btn.dataset.rmcat);
      if (!c) return;
      var used = totals().cat[c.id] || 0;
      var msg = used
        ? T('ask.deleteCategoryTime', { name: c.name, dur: U.dur(used) })
        : T('ask.deleteCategory', { name: c.name });
      if (!window.confirm(msg)) return;
      Store.removeCategory(c.id);
      window.App.render();
      window.App.toast(T('msg.deleted', { name: c.name }));
    });

    U.on(root, 'click', '[data-rmitem]', function (e, btn) {
      var c = Store.category(btn.dataset.cat);
      if (!c) return;
      var it = c.items.filter(function (a) { return a.id === btn.dataset.rmitem; })[0];
      if (!it) return;
      var used = totals().item[c.id + ' ' + it.name] || 0;
      var msg = used
        ? T('ask.deleteItemTime', { name: it.name, dur: U.dur(used) })
        : T('ask.deleteItem', { name: it.name });
      if (!window.confirm(msg)) return;
      Store.removeItem(c.id, it.id);
      window.App.render();
      window.App.toast(T('msg.deleted', { name: it.name }));
    });

    U.on(root, 'click', '[data-rmact]', function (e, btn) {
      Store.removeActivity(btn.dataset.cat, btn.dataset.rmact);
      window.App.render();
    });

    /* ---- adding ---- */

    // "+ item" / "+ activity" swap themselves for an input.
    function inlineAdd(btn, add, placeholder) {
      var catId = btn.dataset.additem || btn.dataset.addact;
      open[catId] = true;
      var input = document.createElement('input');
      input.type = 'text';
      input.placeholder = placeholder;
      input.className = 'tag';
      input.style.cssText = 'width:210px;padding:4px 11px;border-radius:20px;font-size:.82rem';
      btn.replaceWith(input);
      input.focus();

      var done = false;
      function commit(keep) {
        if (done) return;
        done = true;
        var v = input.value.trim();
        if (keep && v) add(catId, v);
        window.App.render();
      }
      input.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); commit(true); }
        if (ev.key === 'Escape') commit(false);
      });
      input.addEventListener('blur', function () { commit(true); });
    }

    U.on(root, 'click', '[data-additem]', function (e, btn) {
      inlineAdd(btn, Store.addItem, T('ed.newItemPlaceholder'));
    });
    U.on(root, 'click', '[data-addact]', function (e, btn) {
      inlineAdd(btn, Store.addActivity, T('ed.newActivityPlaceholder'));
    });

    U.on(root, 'click', '[data-addcat]', function () {
      var name = window.prompt(T('prompt.newCategory'), '');
      if (!name || !name.trim()) return;
      var made = Store.addCategory(name.trim(), Store.categories().length % 5);
      open[made.id] = true;                 // a new, empty category opens itself
      window.App.render();
      window.App.toast(T('msg.added', { name: name.trim() }));
    });

    U.on(root, 'click', '[data-restore]', function () {
      if (!window.confirm(T('ask.restore'))) return;
      var I = window.I18n, added = 0;
      I.PRESETS.forEach(function (p) {
        var wanted = I.preset(p.key);
        var existing = Store.categories().filter(function (c) {
          return c.name.toLowerCase() === wanted.toLowerCase();
        })[0];
        var cat = existing || Store.addCategory(wanted, p.slot);
        if (!existing) added++;
        p.items.forEach(function (k) { Store.addItem(cat.id, I.preset(k)); });
        p.acts.forEach(function (k) { Store.addActivity(cat.id, I.preset(k)); });
      });
      window.App.render();
      window.App.toast(added ? T('msg.restored', { n: added }) : T('msg.presetsPresent'));
    });
  }

  window.CategoriesView = { render: render, mount: mount, totals: totals };
})(window);
