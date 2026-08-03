/* theme.js — the palette system.
 *
 * Hover a card to preview the whole app in that palette, click to keep it, or
 * open its description page to read where it comes from. Built-in palettes are
 * `data-theme` attributes selecting a block in themes.css; a palette the user
 * made sets the same seven tokens inline instead. Either way nothing else in
 * the app knows the difference — every other colour is derived from those
 * seven in app.css.
 */
(function (window) {
  'use strict';

  var U = window.U, Store = window.Store;
  var LIST = window.PALETTES || [];
  var TOKENS = ['--p-bg', '--p-ink', '--p-a', '--p-b', '--p-c', '--p-d', '--p-e'];

  var chosen = 'warm';
  var editing = null;      // the custom palette open in the editor, if any

  function T(k, v) { return window.T(k, v); }

  /* ---------------- lookup ---------------- */

  function builtin(id) {
    for (var i = 0; i < LIST.length; i++) if (LIST[i].id === id) return LIST[i];
    return null;
  }

  /** Built-in or custom, in one shape: { id, name, bg, ink, cats, own }. */
  function byId(id) {
    var b = builtin(id);
    if (b) return { id: b.id, name: b.name, bg: b.bg, ink: b.ink, cats: b.cats, own: false };
    var c = Store.palettes ? Store.palette(id) : null;
    if (c) return { id: c.id, name: c.name, bg: c.bg, ink: c.ink, cats: c.cats, own: true };
    return null;
  }

  function all() {
    var own = (Store.palettes ? Store.palettes() : []).map(function (c) {
      return { id: c.id, name: c.name, bg: c.bg, ink: c.ink, cats: c.cats, own: true };
    });
    return { builtin: LIST, own: own };
  }

  /* ---------------- applying ---------------- */

  /**
   * Tell the stylesheet which way the derived surfaces should step. The
   * threshold sits below every built-in paper (the darkest, And Quiet Flows
   * the Don, is 0.196) so only a genuinely dark custom palette flips.
   */
  function markPaper(bg) {
    if (bg && U.luminance(bg) < 0.15) document.documentElement.setAttribute('data-paper', 'dark');
    else document.documentElement.removeAttribute('data-paper');
  }

  function apply(id) {
    var p = byId(id);
    var style = document.documentElement.style;
    TOKENS.forEach(function (t) { style.removeProperty(t); });
    markPaper(p ? p.bg : null);

    if (p && p.own) {
      // Keep a real theme underneath so anything not overridden still resolves,
      // then set the seven tokens on top of it.
      document.documentElement.setAttribute('data-theme', 'warm');
      style.setProperty('--p-bg', p.bg);
      style.setProperty('--p-ink', p.ink);
      ['--p-a', '--p-b', '--p-c', '--p-d', '--p-e'].forEach(function (t, i) {
        style.setProperty(t, p.cats[i]);
      });
    } else {
      document.documentElement.setAttribute('data-theme', p ? p.id : 'warm');
    }
  }

  /** Paint a palette that is not saved anywhere — the live editor preview. */
  function previewRaw(draft) {
    var style = document.documentElement.style;
    document.documentElement.setAttribute('data-theme', 'warm');
    markPaper(draft.bg);
    style.setProperty('--p-bg', draft.bg);
    style.setProperty('--p-ink', draft.ink);
    ['--p-a', '--p-b', '--p-c', '--p-d', '--p-e'].forEach(function (t, i) {
      style.setProperty(t, draft.cats[i]);
    });
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

  /* ---------------- the grid ---------------- */

  function chips(p) {
    return [p.bg].concat(p.cats).map(function (c) {
      return '<i style="background:' + U.esc(c) + '"></i>';
    }).join('');
  }

  /** First sentence of the note, as a one-line teaser on the card. */
  function teaser(id) {
    var note = window.paletteNote ? window.paletteNote(id) : '';
    var cut = note.search(/[.。！!?？]\s|[.。]$/);
    return cut > 0 ? note.slice(0, cut + 1) : note;
  }

  function card(p, index) {
    var on = p.id === chosen;
    return '<div class="pcard-wrap' + (on ? ' is-on' : '') + '">' +
      '<button type="button" class="pcard" data-pal="' + U.esc(p.id) + '"' +
        ' aria-pressed="' + on + '">' +
        '<span class="pcard__chips" aria-hidden="true">' + chips(p) + '</span>' +
        '<span class="pcard__foot">' +
          (index === null ? '' : '<span class="pcard__n num">' + U.pad2(index) + '</span>') +
          '<span class="pcard__name">' + U.esc(p.name) + '</span>' +
          (on ? '<span class="pcard__tick" aria-hidden="true">✓</span>' : '') +
        '</span>' +
        '<span class="pcard__teaser">' + U.esc(p.own ? '' : teaser(p.id)) + '</span>' +
      '</button>' +
      '<button type="button" class="pcard__info" data-about="' + U.esc(p.id) + '"' +
        ' title="' + U.esc(T('pal.about')) + '" aria-label="' + U.esc(T('pal.about')) + '">i</button>' +
    '</div>';
  }

  function render() {
    var sets = all();
    var made = sets.own.map(function (p) { return card(p, null); }).join('');

    return '<div class="pad">' +
      '<section class="panel">' +
        '<div class="panel__head">' +
          '<h3 class="panel__title">' + U.esc(T('pal.title')) + '</h3>' +
          '<p class="panel__note">' + U.esc(T('pal.note', { n: sets.builtin.length + sets.own.length })) + '</p>' +
        '</div>' +
        '<p style="font-size:.88rem;color:var(--ink-52);margin-bottom:18px;max-width:66ch">' +
          U.esc(T('pal.intro')) + '</p>' +

        '<h4 class="eyebrow" style="margin-bottom:10px">' + U.esc(T('pal.yours')) + '</h4>' +
        '<div class="pgrid" style="margin-bottom:24px">' + made +
          '<button type="button" class="pcard pcard--new" data-newpal>' +
            '<span class="pcard--new__plus" aria-hidden="true">+</span>' +
            '<span class="pcard__name">' + U.esc(T('pal.newCustom')) + '</span>' +
            '<span class="pcard__teaser">' + U.esc(T('pal.customIntro')) + '</span>' +
          '</button>' +
        '</div>' +

        '<h4 class="eyebrow" style="margin-bottom:10px">' + U.esc(T('pal.builtin')) + '</h4>' +
        '<div class="pgrid" id="pgrid">' +
          sets.builtin.map(function (p, i) { return card(p, i); }).join('') +
        '</div>' +

        '<p class="panel__note" style="margin-top:16px">' + U.esc(T('pal.source')) + '</p>' +
      '</section>' +
    '</div>';
  }

  /* ---------------- the description page ---------------- */

  function swatchRow(label, hex, note) {
    return '<tr><td><span class="pswatch" style="background:' + U.esc(hex) + '"></span>' +
      U.esc(label) + '</td>' +
      '<td class="n">' + U.esc(U.hex(hex)) + '</td>' +
      '<td class="n">' + (note || '') + '</td></tr>';
  }

  function contrastCell(ratio, floor) {
    var ok = ratio >= floor;
    return '<span class="pratio' + (ok ? '' : ' is-low') + '">' + ratio.toFixed(1) + ':1</span>';
  }

  function openAbout(id) {
    var p = byId(id);
    if (!p) return;
    var note = window.paletteNote ? window.paletteNote(p.id) : '';
    var idx = LIST.map(function (x) { return x.id; }).indexOf(p.id);

    // Each of the five hues is some category's colour, so name that category
    // rather than printing "Category colours 3".
    function slotLabel(i) {
      var owner = Store.categories().filter(function (c) {
        return !c.color && (c.slot % 5) === i;
      })[0];
      return owner ? owner.name : T('pal.cats') + ' ' + (i + 1);
    }

    var rows = swatchRow(T('pal.paper'), p.bg, '') +
      swatchRow(T('pal.ink'), p.ink, contrastCell(U.contrast(p.ink, p.bg), 7)) +
      p.cats.map(function (c, i) {
        return swatchRow(slotLabel(i), c, contrastCell(U.contrast(c, p.bg), 3));
      }).join('');

    window.App.openSheet(
      p.name,
      (idx >= 0 ? '<p class="eyebrow" style="margin-bottom:10px">' + T('pal.builtin') + ' · ' + U.pad2(idx) + '</p>' : '') +
      '<div class="pstrip" aria-hidden="true">' +
        [p.bg].concat(p.cats).concat([p.ink]).map(function (c) {
          return '<i style="background:' + U.esc(c) + '"></i>';
        }).join('') +
      '</div>' +
      (note ? '<p class="pnote">' + U.esc(note) + '</p>' : '') +
      '<table class="dtable ptable"><tbody>' + rows + '</tbody></table>' +
      '<p class="field__hint" style="margin-top:12px">' + U.esc(T('pal.source')) + '</p>',

      '<span class="spacer"></span>' +
      (p.own ? '<button class="btn btn--ghost" type="button" data-editpal="' + U.esc(p.id) + '">' +
                 U.esc(T('pal.edit')) + '</button>' : '') +
      (p.id === chosen
        ? '<button class="btn btn--ghost" type="button" disabled>' + U.esc(T('pal.inUse')) + '</button>'
        : '<button class="btn btn--solid" type="button" data-usepal="' + U.esc(p.id) + '">' +
            U.esc(T('pal.use')) + '</button>'),

      function (root) {
        U.on(root, 'click', '[data-usepal]', function (e, b) {
          select(b.dataset.usepal);
          window.App.closeSheet();
          window.App.render();
          window.App.toast(T('msg.palette', { name: p.name }));
        });
        U.on(root, 'click', '[data-editpal]', function (e, b) {
          window.App.closeSheet();
          openEditor(Store.palette(b.dataset.editpal));
        });
      });
  }

  /* ---------------- the custom palette editor ---------------- */

  var FIELDS = [
    { key: 'bg', label: 'pal.paper' },
    { key: 'ink', label: 'pal.ink' },
    { key: 'c0', label: 'pal.cats', n: 1 },
    { key: 'c1', label: 'pal.cats', n: 2 },
    { key: 'c2', label: 'pal.cats', n: 3 },
    { key: 'c3', label: 'pal.cats', n: 4 },
    { key: 'c4', label: 'pal.cats', n: 5 }
  ];

  /** Start from whatever is on screen, so the editor opens somewhere sensible. */
  function draftFrom(p) {
    return {
      id: p && p.id, name: (p && p.name) || T('pal.untitled'),
      bg: U.hex(p ? p.bg : '#F5F0EB'), ink: U.hex(p ? p.ink : '#2C2C2C'),
      cats: (p ? p.cats : ['#8B1A1A', '#1A5C8B', '#1565C0', '#C41230', '#E65100']).map(U.hex)
    };
  }

  function valueOf(draft, key) {
    if (key === 'bg' || key === 'ink') return draft[key];
    return draft.cats[+key.slice(1)];
  }

  function setValue(draft, key, hex) {
    if (key === 'bg' || key === 'ink') draft[key] = hex;
    else draft.cats[+key.slice(1)] = hex;
  }

  function editorBody(draft) {
    var rows = FIELDS.map(function (f) {
      var v = valueOf(draft, f.key);
      var floor = f.key === 'bg' ? 0 : (f.key === 'ink' ? 7 : 3);
      var ratio = f.key === 'bg' ? null : U.contrast(v, draft.bg);
      return '<div class="prow" data-field="' + f.key + '">' +
        '<input type="color" value="' + U.esc(v) + '" data-color="' + f.key + '"' +
          ' aria-label="' + U.esc(T(f.label) + (f.n ? ' ' + f.n : '')) + '">' +
        '<span class="prow__k">' + U.esc(T(f.label)) + (f.n ? ' ' + f.n : '') + '</span>' +
        '<input type="text" class="prow__hex num" value="' + U.esc(v) + '" data-hex="' + f.key + '"' +
          ' spellcheck="false" maxlength="7" aria-label="' + U.esc(T(f.label)) + '">' +
        (ratio === null ? '<span class="prow__r"></span>'
          : '<span class="prow__r ' + (ratio >= floor ? '' : 'is-low') + '">' +
              ratio.toFixed(1) + ':1</span>') +
      '</div>';
    }).join('');

    var inkRatio = U.contrast(draft.ink, draft.bg);
    var weak = FIELDS.filter(function (f) {
      return f.key !== 'bg' && U.contrast(valueOf(draft, f.key), draft.bg) < (f.key === 'ink' ? 7 : 3);
    });

    return '<p class="field__hint" style="margin:0 0 14px">' + U.esc(T('pal.customIntro')) + '</p>' +
      '<div class="field"><label for="palName">' + U.esc(T('pal.name')) + '</label>' +
        '<input type="text" id="palName" value="' + U.esc(draft.name) + '" maxlength="40"></div>' +
      '<div class="prows">' + rows + '</div>' +
      '<p class="field__hint" id="palWarn">' +
        (weak.length
          ? '⚠ ' + U.esc(T('pal.contrastLow'))
          : '✓ ' + U.esc(T('pal.contrastInk') + ' ' + inkRatio.toFixed(1) + ':1 — ' + T('pal.contrastOk'))) +
      '</p>';
  }

  function openEditor(existing) {
    var draft = draftFrom(existing ? byId(existing.id) : byId(chosen));
    if (!existing) draft.id = null;
    editing = draft;
    previewRaw(draft);

    window.App.openSheet(
      existing ? draft.name : T('pal.newCustom'),
      editorBody(draft),
      (existing ? '<button class="btn btn--ghost btn--danger" type="button" data-delpal>' +
                    U.esc(T('ui.delete')) + '</button>' : '') +
      '<span class="spacer"></span>' +
      '<button class="btn btn--ghost" type="button" data-cancelpal>' + U.esc(T('ui.cancel')) + '</button>' +
      '<button class="btn btn--solid" type="button" data-savepal>' + U.esc(T('ui.save')) + '</button>',

      function (root) {
        function repaint() {
          previewRaw(draft);
          // Only the readouts change; rebuilding the inputs would steal focus
          // from the colour well the user is dragging in.
          FIELDS.forEach(function (f) {
            if (f.key === 'bg') return;
            var floor = f.key === 'ink' ? 7 : 3;
            var r = U.contrast(valueOf(draft, f.key), draft.bg);
            var el = root.querySelector('[data-field="' + f.key + '"] .prow__r');
            if (el) {
              el.textContent = r.toFixed(1) + ':1';
              el.classList.toggle('is-low', r < floor);
            }
          });
          var weak = FIELDS.some(function (f) {
            return f.key !== 'bg' &&
              U.contrast(valueOf(draft, f.key), draft.bg) < (f.key === 'ink' ? 7 : 3);
          });
          var warn = root.querySelector('#palWarn');
          if (warn) {
            warn.textContent = weak
              ? '⚠ ' + T('pal.contrastLow')
              : '✓ ' + T('pal.contrastInk') + ' ' + U.contrast(draft.ink, draft.bg).toFixed(1) +
                ':1 — ' + T('pal.contrastOk');
          }
        }

        U.on(root, 'input', '[data-color]', function (e, input) {
          var key = input.dataset.color;
          setValue(draft, key, U.hex(input.value));
          var hexIn = root.querySelector('[data-hex="' + key + '"]');
          if (hexIn) hexIn.value = U.hex(input.value);
          repaint();
        });

        U.on(root, 'input', '[data-hex]', function (e, input) {
          if (!/^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(input.value.trim())) return;
          var key = input.dataset.hex;
          setValue(draft, key, U.hex(input.value.trim()));
          var well = root.querySelector('[data-color="' + key + '"]');
          if (well) well.value = valueOf(draft, key);
          repaint();
        });

        U.on(root, 'input', '#palName', function (e, input) { draft.name = input.value; });

        U.on(root, 'click', '[data-cancelpal]', function () {
          editing = null;
          window.App.closeSheet();
          restore();
        });

        U.on(root, 'click', '[data-savepal]', function () {
          draft.name = (draft.name || '').trim() || T('pal.untitled');
          var saved = Store.putPalette({
            id: draft.id || undefined, name: draft.name,
            bg: draft.bg, ink: draft.ink, cats: draft.cats.slice()
          });
          editing = null;
          select(saved.id);
          window.App.closeSheet();
          window.App.render();
          window.App.toast(T('msg.paletteSaved', { name: saved.name }));
        });

        U.on(root, 'click', '[data-delpal]', function () {
          if (!window.confirm(T('ask.deletePalette', { name: draft.name }))) return;
          Store.removePalette(draft.id);
          editing = null;
          chosen = Store.settings.theme;
          apply(chosen);
          window.App.closeSheet();
          window.App.render();
        });
      },
      function onDismiss() {
        // Closed with Esc or the ✕ while still editing: drop the preview.
        if (editing) { editing = null; restore(); }
      });
  }

  /* ---------------- wiring ---------------- */

  function bind(root) {
    var grids = U.$$('.pgrid', root);

    grids.forEach(function (grid) {
      // pointerenter does not bubble, so preview off a delegated mouseover and
      // reset once the pointer leaves the grid entirely.
      grid.addEventListener('mouseover', function (e) {
        if (editing) return;
        var card = e.target.closest('.pcard[data-pal]');
        if (card) preview(card.dataset.pal);
      });
      grid.addEventListener('mouseleave', function () { if (!editing) restore(); });
      grid.addEventListener('focusin', function (e) {
        if (editing) return;
        var card = e.target.closest('.pcard[data-pal]');
        if (card) preview(card.dataset.pal);
      });
      grid.addEventListener('focusout', function () { if (!editing) restore(); });
    });

    U.on(root, 'click', '.pcard[data-pal]', function (e, card) {
      select(card.dataset.pal);
      window.App.render();
      window.App.toast(T('msg.palette', { name: byId(chosen).name }));
    });

    U.on(root, 'click', '[data-about]', function (e, btn) {
      e.stopPropagation();
      restore();
      openAbout(btn.dataset.about);
    });

    U.on(root, 'click', '[data-newpal]', function () { openEditor(null); });
  }

  window.Theme = {
    list: LIST, byId: byId, init: init, apply: apply, preview: preview,
    restore: restore, select: select, current: current, markPaper: markPaper,
    render: render, bind: bind, openAbout: openAbout, openEditor: openEditor
  };
})(window);
