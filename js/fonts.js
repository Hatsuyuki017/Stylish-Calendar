/* fonts.js — typographic plans, one set per script.
 *
 * A language does not just need its words translated; it needs a face that
 * belongs to its own written tradition. Each plan names a real one — Song-
 * dynasty woodblock, running-script brush, Mincho, Garamond's romans, the
 * Swiss grotesques — and supplies a full stack for display, body and data.
 *
 * Latin glyphs always come from the Latin face named in the plan, and CJK
 * glyphs from the CJK face, so a page that mixes "Advanced Optimisation" with
 * 高等最优化 stays in one voice.
 *
 * Web fonts are fetched only when a plan is actually used: `apply` rewrites a
 * single <link>, and the settings sheet loads every plan for the current
 * script in one go so the specimens render truthfully.
 */
(function (window) {
  'use strict';

  var GF = 'https://fonts.googleapis.com/css2?';

  /* Shared fallbacks. The CJK tails are only ever reached by CJK codepoints. */
  var SC = "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei'";
  var TC = "'PingFang TC', 'Hiragino Sans CNS', 'Microsoft JhengHei'";
  var JP = "'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho'";
  var JPG = "'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo'";
  var MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

  var F = {
    fraunces: 'Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700',
    spectral: 'Spectral:wght@300;400;500;600',
    plexMono: 'IBM+Plex+Mono:wght@400;500;600',
    playfair: 'Playfair+Display:wght@400;600;700',
    lora: 'Lora:wght@400;500;600',
    garamond: 'EB+Garamond:wght@400;500;600',
    cutive: 'Cutive+Mono',
    bricolage: 'Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700',
    workSans: 'Work+Sans:wght@300;400;500;600',
    notoSerifSC: 'Noto+Serif+SC:wght@400;600;700',
    notoSansSC: 'Noto+Sans+SC:wght@300;400;500;700',
    notoSerifTC: 'Noto+Serif+TC:wght@400;600;700',
    notoSansTC: 'Noto+Sans+TC:wght@300;400;500;700',
    zcool: 'ZCOOL+XiaoWei',
    maShan: 'Ma+Shan+Zheng',
    wenkai: 'LXGW+WenKai+TC',
    notoSerifJP: 'Noto+Serif+JP:wght@400;600;700',
    shippori: 'Shippori+Mincho:wght@400;600;700',
    zenKaku: 'Zen+Kaku+Gothic+New:wght@400;500;700',
    zenMaru: 'Zen+Maru+Gothic:wght@400;500;700',
    yuji: 'Yuji+Syuku'
  };

  var PLANS = {

    /* ---------------- Latin: en, es, de, fr, la ---------------- */
    latin: [
      { id: 'ledger', name: 'Ledger', note: 'Tufte-style editorial — an optical-size serif over a screen-tuned book face.',
        families: [F.fraunces, F.spectral, F.plexMono],
        display: "'Fraunces', 'Iowan Old Style', Georgia, serif",
        body: "'Spectral', Georgia, 'Iowan Old Style', serif",
        mono: "'IBM Plex Mono', " + MONO },

      { id: 'didone', name: 'Didone', note: 'The high-contrast moderns of Bodoni and Didot, c. 1790.',
        families: [F.playfair, F.lora, F.plexMono],
        display: "'Playfair Display', Didot, 'Bodoni 72', Georgia, serif",
        body: "'Lora', Georgia, serif",
        mono: "'IBM Plex Mono', " + MONO },

      { id: 'renaissance', name: 'Renaissance', note: 'After Claude Garamont’s French romans of the 1540s.',
        families: [F.garamond, F.cutive],
        display: "'EB Garamond', 'Adobe Garamond Pro', Garamond, serif",
        body: "'EB Garamond', Garamond, Georgia, serif",
        mono: "'Cutive Mono', " + MONO },

      { id: 'grotesque', name: 'Grotesque', note: 'The Swiss grotesque lineage of Akzidenz and Helvetica, recut.',
        families: [F.bricolage, F.workSans, F.plexMono],
        display: "'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif",
        body: "'Work Sans', 'Helvetica Neue', Arial, sans-serif",
        mono: "'IBM Plex Mono', " + MONO }
    ],

    /* ---------------- 简体中文 ---------------- */
    'zh-Hans': [
      { id: 'song', name: '宋体', note: '承宋代刻本传统，横细竖粗，是书籍正文的标准字形。',
        families: [F.notoSerifSC, F.spectral, F.fraunces, F.plexMono],
        display: "'Fraunces', 'Noto Serif SC', " + SC + ", serif",
        body: "'Spectral', 'Noto Serif SC', " + SC + ", serif",
        mono: "'IBM Plex Mono', 'Noto Serif SC', " + MONO },

      { id: 'kai', name: '楷体', note: '楷书笔意，起收有锋，取法钟繇、王羲之一路的正书。',
        families: [F.wenkai, F.zcool, F.garamond],
        display: "'EB Garamond', 'ZCOOL XiaoWei', 'LXGW WenKai TC', 'Kaiti SC', STKaiti, serif",
        body: "'EB Garamond', 'LXGW WenKai TC', 'Kaiti SC', STKaiti, " + SC + ", serif",
        mono: "'LXGW WenKai TC', 'Kaiti SC', " + MONO },

      { id: 'hei', name: '黑体', note: '现代无衬线，笔画等粗，清晰醒目，宜于屏幕。',
        families: [F.notoSansSC, F.workSans],
        display: "'Work Sans', 'Noto Sans SC', " + SC + ", sans-serif",
        body: "'Work Sans', 'Noto Sans SC', " + SC + ", sans-serif",
        mono: "'IBM Plex Mono', 'Noto Sans SC', " + MONO },

      { id: 'brush', name: '书法', note: '标题取行书笔法，正文仍用宋体，动静相济。',
        families: [F.maShan, F.notoSerifSC, F.spectral, F.plexMono],
        display: "'Ma Shan Zheng', 'Fraunces', 'Noto Serif SC', cursive, serif",
        body: "'Spectral', 'Noto Serif SC', " + SC + ", serif",
        mono: "'IBM Plex Mono', 'Noto Serif SC', " + MONO }
    ],

    /* ---------------- 繁體中文 ---------------- */
    'zh-Hant': [
      { id: 'song', name: '宋體', note: '承宋代刻本傳統，橫細豎粗，是書籍正文的標準字形。',
        families: [F.notoSerifTC, F.spectral, F.fraunces, F.plexMono],
        display: "'Fraunces', 'Noto Serif TC', " + TC + ", serif",
        body: "'Spectral', 'Noto Serif TC', " + TC + ", serif",
        mono: "'IBM Plex Mono', 'Noto Serif TC', " + MONO },

      { id: 'kai', name: '楷體', note: '楷書筆意，起收有鋒，取法鍾繇、王羲之一路的正書。',
        families: [F.wenkai, F.zcool, F.garamond],
        display: "'EB Garamond', 'ZCOOL XiaoWei', 'LXGW WenKai TC', 'Kaiti TC', BiauKai, serif",
        body: "'EB Garamond', 'LXGW WenKai TC', 'Kaiti TC', BiauKai, " + TC + ", serif",
        mono: "'LXGW WenKai TC', 'Kaiti TC', " + MONO },

      { id: 'hei', name: '黑體', note: '現代無襯線，筆畫等粗，清晰醒目，宜於螢幕。',
        families: [F.notoSansTC, F.workSans],
        display: "'Work Sans', 'Noto Sans TC', " + TC + ", sans-serif",
        body: "'Work Sans', 'Noto Sans TC', " + TC + ", sans-serif",
        mono: "'IBM Plex Mono', 'Noto Sans TC', " + MONO },

      { id: 'brush', name: '書法', note: '標題取行書筆法，正文仍用宋體，動靜相濟。',
        families: [F.maShan, F.notoSerifTC, F.spectral, F.plexMono],
        display: "'Ma Shan Zheng', 'Fraunces', 'Noto Serif TC', cursive, serif",
        body: "'Spectral', 'Noto Serif TC', " + TC + ", serif",
        mono: "'IBM Plex Mono', 'Noto Serif TC', " + MONO }
    ],

    /* ---------------- 日本語 ---------------- */
    ja: [
      { id: 'mincho', name: '明朝体', note: '築地体以来の書籍用書体。横画は細く、縦画は太く。',
        families: [F.shippori, F.spectral, F.fraunces, F.plexMono],
        display: "'Fraunces', 'Shippori Mincho', " + JP + ", serif",
        body: "'Spectral', 'Shippori Mincho', " + JP + ", serif",
        mono: "'IBM Plex Mono', 'Shippori Mincho', " + MONO },

      { id: 'gothic', name: 'ゴシック体', note: '線幅の均一な現代的書体。画面上でもっとも読みやすい。',
        families: [F.zenKaku, F.workSans],
        display: "'Work Sans', 'Zen Kaku Gothic New', " + JPG + ", sans-serif",
        body: "'Work Sans', 'Zen Kaku Gothic New', " + JPG + ", sans-serif",
        mono: "'IBM Plex Mono', 'Zen Kaku Gothic New', " + MONO },

      { id: 'maru', name: '丸ゴシック体', note: '角を丸めたゴシック。やわらかく、親しみのある調子。',
        families: [F.zenMaru, F.workSans],
        display: "'Zen Maru Gothic', 'Work Sans', " + JPG + ", sans-serif",
        body: "'Zen Maru Gothic', 'Work Sans', " + JPG + ", sans-serif",
        mono: "'IBM Plex Mono', 'Zen Maru Gothic', " + MONO },

      { id: 'fude', name: '筆書体', note: '見出しは筆の運びで、本文は明朝のまま。楷書の骨格。',
        families: [F.yuji, F.shippori, F.spectral, F.plexMono],
        display: "'Yuji Syuku', 'Fraunces', 'Shippori Mincho', " + JP + ", serif",
        body: "'Spectral', 'Shippori Mincho', " + JP + ", serif",
        mono: "'IBM Plex Mono', 'Shippori Mincho', " + MONO }
    ]
  };

  /* A line for the settings specimens. The CJK ones open Wang Xizhi's Orchid
     Pavilion Preface and the iroha, with Latin and figures alongside so the
     pairing in each plan is visible. */
  var SPECIMEN = {
    latin: 'Aa Bb Qq 123',
    'zh-Hans': '永和九年 Aa 123',
    'zh-Hant': '永和九年 Aa 123',
    ja: '永いろは Aa 123'
  };

  /** Which plan set a language draws on. */
  function scriptFor(lang) {
    return PLANS[lang] ? lang : 'latin';
  }

  function specimen(lang) { return SPECIMEN[scriptFor(lang)]; }

  function plansFor(lang) { return PLANS[scriptFor(lang)]; }

  function plan(lang, id) {
    var list = plansFor(lang);
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0];
  }

  function url(families) {
    var seen = Object.create(null), parts = [];
    families.forEach(function (f) {
      if (seen[f]) return;
      seen[f] = 1;
      parts.push('family=' + f);
    });
    return GF + parts.join('&') + '&display=swap';
  }

  function linkTag(id) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('link');
      el.id = id;
      el.rel = 'stylesheet';
      document.head.appendChild(el);
    }
    return el;
  }

  /** Put a plan on the page. Returns the plan actually applied. */
  function apply(lang, id) {
    var p = plan(lang, id);
    var link = linkTag('fontPlan');
    var href = url(p.families);
    if (link.getAttribute('href') !== href) link.setAttribute('href', href);

    var s = document.documentElement.style;
    s.setProperty('--display', p.display);
    s.setProperty('--body', p.body);
    s.setProperty('--mono', p.mono);
    // Fraunces' optical-size and "wonk" settings are meaningless on any other
    // face, so only ask for them when Fraunces is the one being drawn.
    s.setProperty('--display-vf', /Fraunces/.test(p.display) ? "'SOFT' 30, 'WONK' 1, 'opsz' 90" : 'normal');
    return p;
  }

  /** Preload every plan for a script, so the settings specimens are honest. */
  function preloadAll(lang) {
    var all = [];
    plansFor(lang).forEach(function (p) { all = all.concat(p.families); });
    linkTag('fontSpecimens').setAttribute('href', url(all));
  }

  window.Fonts = {
    PLANS: PLANS, scriptFor: scriptFor, plansFor: plansFor, specimen: specimen,
    plan: plan, apply: apply, preloadAll: preloadAll
  };
})(window);
