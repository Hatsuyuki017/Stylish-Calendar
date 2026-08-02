/* theme.js — the palette system.
 *
 * Hover a card to preview the whole app in that palette, click to keep it.
 * The choice is a single `data-theme` attribute on <html>; every colour in
 * app.css derives from the seven tokens that attribute selects, so there is
 * no per-component theming to keep in sync.
 */
(function (window) {
  'use strict';

  var U = window.U, Store = window.Store;
  var LIST = window.PALETTES || [];
  var chosen = 'warm';

  function byId(id) {
    for (var i = 0; i < LIST.length; i++) if (LIST[i].id === id) return LIST[i];
    return null;
  }

  function apply(id) {
    document.documentElement.setAttribute('data-theme', id);
  }

  function preview(id) { apply(id); }
  function restore() { apply(chosen); }

  function select(id) {
    if (!byId(id)) return;
    chosen = id;
    apply(id);
    Store.settings.theme = id;
    Store.save();
  }

  function init() {
    var saved = Store.settings.theme;
    chosen = byId(saved) ? saved : 'warm';
    apply(chosen);
  }

  function current() { return chosen; }

  /* ---------------- picker ---------------- */

  function render() {
    var cards = LIST.map(function (p, i) {
      var chips = [p.bg].concat(p.cats).map(function (c) {
        return '<i style="background:' + U.esc(c) + '"></i>';
      }).join('');
      var on = p.id === chosen;
      return '<button type="button" class="pcard' + (on ? ' is-on' : '') + '" data-pal="' + U.esc(p.id) + '"' +
             ' aria-pressed="' + on + '">' +
               '<span class="pcard__chips" aria-hidden="true">' + chips + '</span>' +
               '<span class="pcard__foot">' +
                 '<span class="pcard__n num">' + U.pad2(i) + '</span>' +
                 '<span class="pcard__name">' + U.esc(p.name) + '</span>' +
                 (on ? '<span class="pcard__tick" aria-hidden="true">✓</span>' : '') +
               '</span>' +
             '</button>';
    }).join('');

    var T = window.T;
    return '<div class="pad">' +
      '<section class="panel">' +
        '<div class="panel__head">' +
          '<h3 class="panel__title">' + U.esc(T('pal.title')) + '</h3>' +
          '<p class="panel__note">' + U.esc(T('pal.note', { n: LIST.length })) + '</p>' +
        '</div>' +
        '<p style="font-size:.88rem;color:var(--ink-52);margin-bottom:16px;max-width:66ch">' +
          U.esc(T('pal.intro')) +
        '</p>' +
        '<div class="pgrid" id="pgrid">' + cards + '</div>' +
      '</section>' +
    '</div>';
  }

  /** Wire hover-preview / click-select onto a freshly rendered picker. */
  function bind(root) {
    var grid = U.$('#pgrid', root);
    if (!grid) return;

    // pointerenter does not bubble, so preview off a delegated mouseover and
    // reset once the pointer leaves the grid entirely.
    grid.addEventListener('mouseover', function (e) {
      var card = e.target.closest('.pcard');
      if (card) preview(card.dataset.pal);
    });
    grid.addEventListener('mouseleave', restore);
    grid.addEventListener('focusin', function (e) {
      var card = e.target.closest('.pcard');
      if (card) preview(card.dataset.pal);
    });
    grid.addEventListener('focusout', restore);

    U.on(grid, 'click', '.pcard', function (e, card) {
      select(card.dataset.pal);
      window.App.render();
      window.App.toast(window.T('msg.palette', { name: byId(chosen).name }));
    });
  }

  window.Theme = {
    list: LIST, byId: byId, init: init, apply: apply, preview: preview,
    restore: restore, select: select, current: current, render: render, bind: bind
  };
})(window);
