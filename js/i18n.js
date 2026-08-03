/* i18n.js — interface language.
 *
 * Eight locales. Every visible string is a key here; nothing is hard-coded in
 * a view. Month and weekday names come from Intl where the browser has the
 * locale, with a hand-written table for Latin, which Intl does not carry.
 *
 * Preset category / item / activity names are translated too, but only at the
 * moment they are seeded: once created they are the user's own data and are
 * never rewritten by a later language change.
 */
(function (window) {
  'use strict';

  var LOCALES = [
    { id: 'en',      bcp: 'en',      name: 'English',               endonym: 'English' },
    { id: 'zh-Hans', bcp: 'zh-Hans', name: 'Chinese (Simplified)',  endonym: '简体中文' },
    { id: 'zh-Hant', bcp: 'zh-Hant', name: 'Chinese (Traditional)', endonym: '繁體中文' },
    { id: 'ja',      bcp: 'ja',      name: 'Japanese',              endonym: '日本語' },
    { id: 'es',      bcp: 'es',      name: 'Spanish',               endonym: 'Español' },
    { id: 'de',      bcp: 'de',      name: 'German',                endonym: 'Deutsch' },
    { id: 'fr',      bcp: 'fr',      name: 'French',                endonym: 'Français' },
    { id: 'la',      bcp: 'la',      name: 'Latin',                 endonym: 'Latina' }
  ];

  /* The five seeded categories, their example items, and their activities.
     Values are keys into each locale's `p` (preset) table. */
  var PRESETS = [
    { key: 'courseWork', slot: 0,
      items: ['advOptimisation', 'numericalMethods'],
      acts: ['lecture', 'notetaking', 'homework', 'onlineCourse', 'textbook', 'lab',
             'tutorial', 'revision', 'examPrep', 'groupProject'] },
    { key: 'research', slot: 1,
      items: ['medImageSeg', 'marketPrediction'],
      acts: ['litReview', 'experiment', 'dataAnalysis', 'coding', 'paperWriting',
             'supervisorMeeting', 'groupMeeting', 'presentationPrep', 'proposal', 'peerReview'] },
    { key: 'reading', slot: 2,
      items: ['papers', 'books'],
      acts: ['skim', 'closeReading', 'annotation', 'summaryWriting', 'readingGroup'] },
    { key: 'skills', slot: 3,
      items: ['aLanguage', 'programming'],
      acts: ['practiceDrill', 'onlineCourse', 'documentation', 'sideProject',
             'vocabulary', 'listeningSpeaking'] },
    { key: 'other', slot: 4,
      items: [],
      acts: ['planning', 'seminar', 'writing', 'misc'] }
  ];

  /* ==========================================================
     strings
     ========================================================== */

  var S = {};

  S.en = {
    'app.name': 'Study Ledger', 'app.tagline': 'time, kept',
    'nav.calendar': 'Calendar', 'nav.heatmap': 'Heatmap', 'nav.stats': 'Statistics',
    'nav.categories': 'Categories', 'nav.palette': 'Palette',
    'nav.subCategories': 'What you spend time on, and how',
    'nav.subPalette': 'Colour scheme for the whole ledger',

    'ui.settings': 'Settings', 'ui.help': 'Help', 'ui.today': 'Today',
    'ui.newEntry': 'New entry', 'ui.close': 'Close', 'ui.cancel': 'Cancel',
    'ui.save': 'Save', 'ui.delete': 'Delete', 'ui.optional': 'optional',
    'ed.categoryLocked': 'Set by the item. Unlock to re-file it.', 'ed.unlock': 'Unlock category',
    'ed.newItem': '+ New item…', 'msg.itemMoved': 'Moved “{name}” to {cat}',
    'cat.count': '{i} items · {a} activities',
    'set.typography': 'Typography',
    'set.typographyHint': 'A face for each written tradition. Remembered per language, so each keeps its own.',
    'cat.toggle': 'Show items and activities',
    'pal.edit': 'Edit', 'pal.builtin': 'Built-in', 'pal.yours': 'Your palettes', 'pal.about': 'About this palette',
    'pal.use': 'Use this palette', 'pal.inUse': 'In use', 'pal.paper': 'Paper', 'pal.ink': 'Ink',
    'pal.cats': 'Category colours', 'pal.newCustom': 'Make your own', 'pal.name': 'Name',
    'pal.customIntro': 'Seven colours make a palette: the paper, the ink, and five hues for your categories. Everything else is derived from them.',
    'pal.contrastInk': 'Ink on paper', 'pal.contrastLow': 'too close to the paper to read',
    'pal.contrastOk': 'good', 'pal.untitled': 'My palette',
    'pal.source': 'Descriptions adapted from the Tufte-Style Book Template.',
    'ask.deletePalette': 'Delete the palette “{name}”?', 'msg.paletteSaved': 'Saved “{name}”',
    'ui.hourUnit': 'h', 'ui.skip': 'Skip to content', 'ui.views': 'Views', 'ui.range': 'Range',
    'ui.prevPeriod': 'Previous period', 'ui.nextPeriod': 'Next period',

    'meter.today': 'Today', 'meter.week': 'This week', 'meter.goal': '{pct}% of a {dur} goal',

    'scope.day': 'Day', 'scope.week': 'Week', 'scope.month': 'Month',
    'scope.year': 'Year', 'scope.semester': 'Semester',
    'bucket.day': 'day', 'bucket.week': 'week', 'bucket.month': 'month',

    'range.weekOf': 'Week of {date}', 'range.nDays': '{n} days',
    'range.calendarYear': 'Calendar year', 'range.noSemester': 'No semester defined',
    'range.addInSettings': 'Add one in Settings',

    'ed.new': 'New entry', 'ed.edit': 'Edit entry',
    'ed.category': 'Category', 'ed.item': 'Item', 'ed.activity': 'Activity',
    'ed.date': 'Date', 'ed.from': 'From', 'ed.to': 'To', 'ed.note': 'Note',
    'ed.notePlaceholder': 'Chapter 4 problem set, §2 proofs…',
    'ed.custom': 'Custom…', 'ed.newItemPlaceholder': 'Name the item',
    'ed.newActivityPlaceholder': 'Name the activity',
    'ed.itemHint': 'The course, project or book this time went into.',
    'ed.activityHint': 'Pick a common one, or add your own with Custom…',
    'ed.removed': '(removed)',
    'ed.duration': '{dur} of recorded time.',
    'ed.needDuration': 'An entry needs a duration.',
    'ed.pastMidnight': '{dur} — runs past midnight, so it will be saved as two entries split at 00:00.',

    'msg.entryAdded': 'Entry added', 'msg.entryUpdated': 'Entry updated',
    'msg.entryDeleted': 'Entry deleted', 'msg.splitMidnight': 'Saved as two entries, split at midnight.',
    'msg.nameItem': 'Name the item.', 'msg.nameActivity': 'Name the activity.',
    'msg.pickDate': 'Pick a date.', 'msg.renamed': 'Renamed to “{name}”',
    'msg.added': 'Added “{name}”', 'msg.deleted': 'Deleted “{name}”',
    'msg.restored': 'Restored {n} preset(s)', 'msg.presetsPresent': 'Presets already present',
    'msg.exported': 'Exported', 'msg.imported': 'Imported {n} entries',
    'msg.erased': 'Ledger erased', 'msg.saveFailed': 'Could not save — browser storage is full or blocked.',
    'msg.palette': 'Palette: {name}', 'msg.language': 'Language: {name}',

    'ask.deleteEntry': 'Delete this entry?',
    'ask.deleteCategory': 'Delete “{name}”?',
    'ask.deleteCategoryTime': 'Delete “{name}”?\n\nThis also deletes its items and {dur} of recorded time. This cannot be undone.',
    'ask.deleteItem': 'Delete “{name}”?',
    'ask.deleteItemTime': 'Delete “{name}”?\n\nThis also deletes {dur} of recorded time under it. This cannot be undone.',
    'ask.restore': 'Add back any of the preset categories, items and activities that are missing?\n\nNothing already recorded is changed.',
    'ask.import': 'Replace everything currently in the ledger with this file?',
    'ask.erase': 'Erase every entry, category and setting?\n\nThis cannot be undone. Export first if you want a copy.',
    'prompt.newCategory': 'Name the new category', 'prompt.newItem': 'Name the new item under “{name}”',

    'hm.glance': '{year} at a glance', 'hm.item': 'Item', 'hm.all': 'Everything',
    'hm.recorded': 'Recorded', 'hm.activeDays': 'Active days', 'hm.avgActiveDay': 'Avg. active day',
    'hm.currentStreak': 'Current streak', 'hm.longestStreak': 'Longest streak',
    'hm.less': 'Less', 'hm.more': 'More', 'hm.nDays': '{n} days', 'hm.nDays_one': '{n} day',
    'hm.foot': 'Darkest step is {dur}+ in a day', 'hm.footBusy': 'busiest was {day} at {dur}',
    'hm.clickDay': 'click any day to open it', 'hm.nothing': 'No time recorded',
    'hm.monthByMonth': 'Month by month', 'hm.totalIn': 'total recorded in {year}',
    'hm.rhythm': 'Rhythm of the week', 'hm.avgWeekday': 'average per weekday',
    'hm.gridLabel': 'Study time per day in {year}',

    'st.recorded': 'Recorded', 'st.perDay': 'Per day', 'st.perActiveDay': 'Per active day',
    'st.sessions': 'Sessions', 'st.busiest': 'Busiest {bucket}',
    'st.acrossAll': 'across all {n} days', 'st.acrossSoFar': 'across {n} days so far',
    'st.ofRecorded': '{a} of {b} days recorded', 'st.avgSession': '{dur} average',
    'st.noneYet': 'none yet',
    'st.vsPrev': '{pct}% vs. the previous {n} days',
    'st.vsSame': '{pct}% vs. the same {n} days last period',
    'st.vsSame_one': '{pct}% vs. the same day last period',
    'st.noCompare': 'no comparable previous period',
    'st.hoursPer': 'Hours per {bucket}', 'st.byCategory': 'By category',
    'st.byItem': 'By item', 'st.byActivity': 'By activity',
    'st.nActive': '{n} active', 'st.topOf': 'top {a} of {b}',
    'st.fullFigures': 'Full figures', 'st.fullFiguresNote': 'every category, item and activity in the period',
    'st.thName': 'Category / item / activity', 'st.thTime': 'Time', 'st.thHours': 'Hours',
    'st.thShare': 'Share', 'st.nothingRecorded': 'Nothing recorded.',
    'st.emptyRange': 'No time recorded between {a} and {b}.',
    'st.recordSomething': 'Record something', 'st.goal': 'goal {v}',
    'st.removedItems': 'Removed categories',

    'cat.title': 'Categories, items &amp; activities',
    'cat.intro': 'A category is the kind of work; an item is the actual course, project or book; an activity is what you did. Every calendar block is one of each, and its length is the time consumed. Rename anything in place.',
    'cat.restore': 'Restore presets', 'cat.newCategory': '+ New category',
    'cat.newItem': '+ item', 'cat.newActivity': '+ activity',
    'cat.logged': '{dur} logged', 'cat.unused': 'unused',
    'cat.itemsLabel': 'Items', 'cat.activitiesLabel': 'Activities',
    'cat.noItems': 'No items yet — add the courses or projects this covers.',
    'cat.noCategories': 'No categories yet.',
    'cat.categoryName': 'Category name', 'cat.itemName': 'Item name',
    'cat.remove': 'Remove {name}', 'cat.colour': 'Colour {n}',

    'pal.title': 'Palette', 'pal.note': '{n} schemes · hover to preview, click to keep',
    'pal.intro': 'Twenty-four palettes from the Tufte-Style Book Template, plus the original warm default. The whole ledger re-inks itself — including the category colours and the heatmap ramp.',

    'set.title': 'Settings', 'set.language': 'Language',
    'set.languageHint': 'Changes the interface only. Your own category, item and activity names are left as you wrote them.',
    'set.week': 'The week', 'set.startsOn': 'Starts on', 'set.monday': 'Monday', 'set.sunday': 'Sunday',
    'set.gridFrom': 'Grid from', 'set.gridTo': 'Grid to', 'set.midnight': '(midnight)',
    'set.gridHint': 'The grid always widens past these hours if an entry falls outside them.',
    'set.targets': 'Targets &amp; snapping', 'set.goalH': 'Daily goal (h)',
    'set.peakH': 'Heatmap peak (h)', 'set.snap': 'Drag snap', 'set.minutes': '{n} min',
    'set.peakHint': 'Heatmap peak is the daily total that reaches the darkest step.',
    'set.semesters': 'Semesters', 'set.noSemesters': 'None defined yet.',
    'set.addSemester': '+ Add semester', 'set.newTerm': 'New term',
    'set.semName': 'Semester name', 'set.semStart': 'Start', 'set.semEnd': 'End',
    'set.data': 'Your data',
    'set.dataBlurb': 'Everything lives in this browser\'s local storage — nothing is uploaded. Export before clearing site data or switching machines.',
    'set.export': 'Export JSON', 'set.import': 'Import JSON', 'set.erase': 'Erase everything',
    'set.dataNote': '{a} entries · {b} categories',
    'set.importFailed': 'That file is not a Study Ledger export.',

    'help.title': 'How this works',
    'help.recording': 'Recording time',
    'help.r1': 'Drag on any empty part of the day grid to block out a session; click once for a default hour.',
    'help.r2': 'Drag a block to move it — sideways across days too. Drag its bottom edge to change how long it ran.',
    'help.r3': 'Click a block to edit it. A session that runs past midnight is saved as two entries, split at 00:00.',
    'help.r4': 'Every block is one <em>category</em>, one <em>item</em> and one <em>activity</em>; its length is the time consumed.',
    'help.keyboard': 'Keyboard',
    'help.k1': '<span class="kbd">←</span> <span class="kbd">→</span> previous / next period, <span class="kbd">T</span> today',
    'help.k2': '<span class="kbd">D</span> <span class="kbd">W</span> <span class="kbd">M</span> day, week, month',
    'help.k3': '<span class="kbd">N</span> new entry · <span class="kbd">1</span>–<span class="kbd">5</span> switch view · <span class="kbd">Esc</span> close',
    'help.storage': 'Where it is stored',
    'help.storageText': 'In this browser only, under <code>study-ledger-v1</code>. No account, no server. Use <em>Settings → Export JSON</em> to keep a copy or move it elsewhere.',

    p: {
      courseWork: 'Course Work', research: 'Research Project', reading: 'Reading',
      skills: 'Skills & Languages', other: 'Other',
      advOptimisation: 'Advanced Optimisation', numericalMethods: 'Numerical Methods',
      medImageSeg: 'Medical Image Segmentation', marketPrediction: 'Market Prediction with Machine Learning',
      papers: 'Papers', books: 'Books', aLanguage: 'Japanese', programming: 'Programming',
      general: 'General',
      lecture: 'Lecture', notetaking: 'Notetaking', homework: 'Homework / Problem Set',
      onlineCourse: 'Online Course', textbook: 'Textbook Reading', lab: 'Lab / Practical',
      tutorial: 'Tutorial / Office Hours', revision: 'Revision', examPrep: 'Exam Preparation',
      groupProject: 'Group Project',
      litReview: 'Literature Review', experiment: 'Experiment / Data Collection',
      dataAnalysis: 'Data Analysis', coding: 'Coding / Implementation', paperWriting: 'Paper Writing',
      supervisorMeeting: 'Supervisor Meeting', groupMeeting: 'Group Meeting',
      presentationPrep: 'Presentation Prep', proposal: 'Proposal Writing', peerReview: 'Peer Review',
      skim: 'Skim / First Pass', closeReading: 'Close Reading', annotation: 'Annotation & Notes',
      summaryWriting: 'Summary Writing', readingGroup: 'Reading Group',
      practiceDrill: 'Practice Drill', documentation: 'Documentation / Tutorial',
      sideProject: 'Side Project', vocabulary: 'Vocabulary', listeningSpeaking: 'Listening & Speaking',
      planning: 'Planning & Admin', seminar: 'Seminar / Talk', writing: 'Writing', misc: 'Miscellaneous'
    }
  };

  S['zh-Hans'] = {
    'app.name': '学习账簿', 'app.tagline': '时间，记录在案',
    'nav.calendar': '日历', 'nav.heatmap': '热力图', 'nav.stats': '统计',
    'nav.categories': '分类', 'nav.palette': '配色',
    'nav.subCategories': '你把时间花在什么上，以及怎么花的',
    'nav.subPalette': '整个账簿的配色方案',

    'ui.settings': '设置', 'ui.help': '帮助', 'ui.today': '今天',
    'ui.newEntry': '新建记录', 'ui.close': '关闭', 'ui.cancel': '取消',
    'ui.save': '保存', 'ui.delete': '删除', 'ui.optional': '可选',
    'ed.categoryLocked': '由条目决定。如需改归属，请先解锁。', 'ed.unlock': '解锁分类',
    'ed.newItem': '+ 新建条目……', 'msg.itemMoved': '已将「{name}」移至{cat}',
    'cat.count': '{i} 个条目 · {a} 个活动',
    'set.typography': '字体',
    'set.typographyHint': '为每种文字传统各备一套字体，按语言分别记忆。',
    'cat.toggle': '展开条目与活动',
    'pal.edit': '编辑', 'pal.builtin': '内置', 'pal.yours': '你的配色', 'pal.about': '关于这套配色',
    'pal.use': '使用这套配色', 'pal.inUse': '使用中', 'pal.paper': '纸色', 'pal.ink': '墨色',
    'pal.cats': '分类色', 'pal.newCustom': '自定义一套', 'pal.name': '名称',
    'pal.customIntro': '七种颜色构成一套配色：纸色、墨色，以及五种分类色。其余所有颜色都由它们推导而来。',
    'pal.contrastInk': '墨色对纸色', 'pal.contrastLow': '与纸色太接近，难以辨读',
    'pal.contrastOk': '良好', 'pal.untitled': '我的配色',
    'pal.source': '描述改写自 Tufte 风格书籍模板。',
    'ask.deletePalette': '删除配色「{name}」？', 'msg.paletteSaved': '已保存「{name}」',
    'ui.hourUnit': '小时', 'ui.skip': '跳到主要内容', 'ui.views': '视图', 'ui.range': '范围',
    'ui.prevPeriod': '上一段', 'ui.nextPeriod': '下一段',

    'meter.today': '今天', 'meter.week': '本周', 'meter.goal': '已完成目标 {dur} 的 {pct}%',

    'scope.day': '日', 'scope.week': '周', 'scope.month': '月',
    'scope.year': '年', 'scope.semester': '学期',
    'bucket.day': '日', 'bucket.week': '周', 'bucket.month': '月',

    'range.weekOf': '{date} 所在周', 'range.nDays': '{n} 天',
    'range.calendarYear': '自然年', 'range.noSemester': '尚未设定学期',
    'range.addInSettings': '请在设置中添加',

    'ed.new': '新建记录', 'ed.edit': '编辑记录',
    'ed.category': '分类', 'ed.item': '条目', 'ed.activity': '活动',
    'ed.date': '日期', 'ed.from': '从', 'ed.to': '到', 'ed.note': '备注',
    'ed.notePlaceholder': '第四章习题、§2 证明……',
    'ed.custom': '自定义……', 'ed.newItemPlaceholder': '为条目命名',
    'ed.newActivityPlaceholder': '为活动命名',
    'ed.itemHint': '这段时间投入的具体课程、项目或书籍。',
    'ed.activityHint': '选一个常用的，或用「自定义……」新增。',
    'ed.removed': '（已删除）',
    'ed.duration': '记录时长 {dur}。',
    'ed.needDuration': '记录必须有时长。',
    'ed.pastMidnight': '{dur} —— 跨过午夜，将在 00:00 拆分为两条记录保存。',

    'msg.entryAdded': '已添加记录', 'msg.entryUpdated': '已更新记录',
    'msg.entryDeleted': '已删除记录', 'msg.splitMidnight': '已在午夜拆分为两条记录保存。',
    'msg.nameItem': '请为条目命名。', 'msg.nameActivity': '请为活动命名。',
    'msg.pickDate': '请选择日期。', 'msg.renamed': '已重命名为「{name}」',
    'msg.added': '已添加「{name}」', 'msg.deleted': '已删除「{name}」',
    'msg.restored': '已恢复 {n} 项预设', 'msg.presetsPresent': '预设已存在',
    'msg.exported': '已导出', 'msg.imported': '已导入 {n} 条记录',
    'msg.erased': '账簿已清空', 'msg.saveFailed': '无法保存 —— 浏览器存储已满或被禁用。',
    'msg.palette': '配色：{name}', 'msg.language': '语言：{name}',

    'ask.deleteEntry': '删除这条记录？',
    'ask.deleteCategory': '删除「{name}」？',
    'ask.deleteCategoryTime': '删除「{name}」？\n\n其下的条目以及 {dur} 的记录时间也会一并删除，且无法撤销。',
    'ask.deleteItem': '删除「{name}」？',
    'ask.deleteItemTime': '删除「{name}」？\n\n其下 {dur} 的记录时间也会一并删除，且无法撤销。',
    'ask.restore': '把缺失的预设分类、条目与活动补回来？\n\n已有的记录不会改变。',
    'ask.import': '用这个文件替换账簿中现有的全部内容？',
    'ask.erase': '清除全部记录、分类与设置？\n\n此操作无法撤销。如需备份请先导出。',
    'prompt.newCategory': '为新分类命名', 'prompt.newItem': '为「{name}」下的新条目命名',

    'hm.glance': '{year} 年概览', 'hm.item': '筛选', 'hm.all': '全部',
    'hm.recorded': '累计记录', 'hm.activeDays': '有记录天数', 'hm.avgActiveDay': '日均（有记录）',
    'hm.currentStreak': '当前连续', 'hm.longestStreak': '最长连续',
    'hm.less': '少', 'hm.more': '多', 'hm.nDays': '{n} 天', 'hm.nDays_one': '{n} 天',
    'hm.foot': '最深一档为单日 {dur} 以上', 'hm.footBusy': '最忙的是 {day}，共 {dur}',
    'hm.clickDay': '点击任一天可打开', 'hm.nothing': '没有记录',
    'hm.monthByMonth': '逐月统计', 'hm.totalIn': '{year} 年合计',
    'hm.rhythm': '一周的节奏', 'hm.avgWeekday': '各星期平均',
    'hm.gridLabel': '{year} 年每日学习时间',

    'st.recorded': '累计记录', 'st.perDay': '日均', 'st.perActiveDay': '有记录日均',
    'st.sessions': '记录条数', 'st.busiest': '最忙的一{bucket}',
    'st.acrossAll': '按全部 {n} 天计', 'st.acrossSoFar': '按已过 {n} 天计',
    'st.ofRecorded': '{b} 天中有 {a} 天有记录', 'st.avgSession': '平均每条 {dur}',
    'st.noneYet': '暂无',
    'st.vsPrev': '较前 {n} 天 {pct}%',
    'st.vsSame': '较上一段同期 {n} 天 {pct}%',
    'st.vsSame_one': '较上一段同一天 {pct}%',
    'st.noCompare': '没有可比的上一段时间',
    'st.hoursPer': '每{bucket}小时数', 'st.byCategory': '按分类',
    'st.byItem': '按条目', 'st.byActivity': '按活动',
    'st.nActive': '{n} 项有记录', 'st.topOf': '{b} 项中的前 {a} 项',
    'st.fullFigures': '完整数据', 'st.fullFiguresNote': '本时段内的每个分类、条目与活动',
    'st.thName': '分类 / 条目 / 活动', 'st.thTime': '时长', 'st.thHours': '小时',
    'st.thShare': '占比', 'st.nothingRecorded': '没有记录。',
    'st.emptyRange': '{a} 至 {b} 之间没有记录。',
    'st.recordSomething': '记录一笔', 'st.goal': '目标 {v}',
    'st.removedItems': '已删除的分类',

    'cat.title': '分类、条目与活动',
    'cat.intro': '分类是工作的种类；条目是具体的课程、项目或书；活动是你做的事。每一个日历色块都由这三者构成，其长度即为消耗的时间。名称都可就地修改。',
    'cat.restore': '恢复预设', 'cat.newCategory': '+ 新建分类',
    'cat.newItem': '+ 条目', 'cat.newActivity': '+ 活动',
    'cat.logged': '已记录 {dur}', 'cat.unused': '未使用',
    'cat.itemsLabel': '条目', 'cat.activitiesLabel': '活动',
    'cat.noItems': '还没有条目 —— 添加这个分类下的课程或项目。',
    'cat.noCategories': '还没有分类。',
    'cat.categoryName': '分类名称', 'cat.itemName': '条目名称',
    'cat.remove': '移除 {name}', 'cat.colour': '颜色 {n}',

    'pal.title': '配色', 'pal.note': '共 {n} 套 · 悬停预览，点击确认',
    'pal.intro': '来自 Tufte 风格书籍模板的 24 套配色，加上原本的暖色默认方案。整个账簿会随之重新着色 —— 包括分类颜色与热力图色阶。',

    'set.title': '设置', 'set.language': '界面语言',
    'set.languageHint': '仅改变界面语言。你自己写的分类、条目与活动名称保持原样。',
    'set.week': '一周', 'set.startsOn': '起始于', 'set.monday': '星期一', 'set.sunday': '星期日',
    'set.gridFrom': '网格自', 'set.gridTo': '网格至', 'set.midnight': '（午夜）',
    'set.gridHint': '若有记录落在这个范围之外，网格会自动向外扩展。',
    'set.targets': '目标与吸附', 'set.goalH': '每日目标（小时）',
    'set.peakH': '热力图峰值（小时）', 'set.snap': '拖动吸附', 'set.minutes': '{n} 分钟',
    'set.peakHint': '热力图峰值是达到最深一档所需的单日总时长。',
    'set.semesters': '学期', 'set.noSemesters': '尚未设定。',
    'set.addSemester': '+ 添加学期', 'set.newTerm': '新学期',
    'set.semName': '学期名称', 'set.semStart': '开始', 'set.semEnd': '结束',
    'set.data': '你的数据',
    'set.dataBlurb': '所有内容都保存在此浏览器的本地存储中，不会上传。清理站点数据或更换设备前请先导出。',
    'set.export': '导出 JSON', 'set.import': '导入 JSON', 'set.erase': '清除全部',
    'set.dataNote': '{a} 条记录 · {b} 个分类',
    'set.importFailed': '这不是「学习账簿」导出的文件。',

    'help.title': '使用说明',
    'help.recording': '记录时间',
    'help.r1': '在日网格的空白处拖动即可划出一段时间；单击则默认为一小时。',
    'help.r2': '拖动色块可移动它 —— 也可横向跨天。拖动底边可改变时长。',
    'help.r3': '点击色块进行编辑。跨过午夜的时段会在 00:00 拆分为两条记录保存。',
    'help.r4': '每个色块对应一个<em>分类</em>、一个<em>条目</em>和一个<em>活动</em>；其长度即为消耗的时间。',
    'help.keyboard': '键盘',
    'help.k1': '<span class="kbd">←</span> <span class="kbd">→</span> 上一段 / 下一段，<span class="kbd">T</span> 今天',
    'help.k2': '<span class="kbd">D</span> <span class="kbd">W</span> <span class="kbd">M</span> 日、周、月',
    'help.k3': '<span class="kbd">N</span> 新建记录 · <span class="kbd">1</span>–<span class="kbd">5</span> 切换视图 · <span class="kbd">Esc</span> 关闭',
    'help.storage': '数据保存在哪里',
    'help.storageText': '仅保存在此浏览器中，键名为 <code>study-ledger-v1</code>。无需账号，也没有服务器。可用<em>设置 → 导出 JSON</em> 备份或迁移。',

    p: {
      courseWork: '课程作业', research: '科研项目', reading: '阅读',
      skills: '技能与语言', other: '其他',
      advOptimisation: '高等最优化', numericalMethods: '数值方法',
      medImageSeg: '医学图像分割', marketPrediction: '机器学习市场预测',
      papers: '论文', books: '书籍', aLanguage: '日语', programming: '编程',
      general: '常规',
      lecture: '听课', notetaking: '记笔记', homework: '作业 / 习题',
      onlineCourse: '网课', textbook: '教材阅读', lab: '实验 / 实践',
      tutorial: '辅导 / 答疑', revision: '复习', examPrep: '备考',
      groupProject: '小组项目',
      litReview: '文献综述', experiment: '实验 / 数据采集',
      dataAnalysis: '数据分析', coding: '编程实现', paperWriting: '论文写作',
      supervisorMeeting: '与导师会面', groupMeeting: '组会',
      presentationPrep: '汇报准备', proposal: '开题 / 申请书', peerReview: '同行评审',
      skim: '略读 / 初读', closeReading: '精读', annotation: '批注与笔记',
      summaryWriting: '写综述', readingGroup: '读书会',
      practiceDrill: '练习', documentation: '文档 / 教程',
      sideProject: '副项目', vocabulary: '词汇', listeningSpeaking: '听说',
      planning: '规划与杂务', seminar: '讲座 / 研讨', writing: '写作', misc: '其他'
    }
  };

  S['zh-Hant'] = {
    'app.name': '學習帳簿', 'app.tagline': '時間，記錄在案',
    'nav.calendar': '行事曆', 'nav.heatmap': '熱力圖', 'nav.stats': '統計',
    'nav.categories': '分類', 'nav.palette': '配色',
    'nav.subCategories': '你把時間花在什麼上，以及怎麼花的',
    'nav.subPalette': '整個帳簿的配色方案',

    'ui.settings': '設定', 'ui.help': '說明', 'ui.today': '今天',
    'ui.newEntry': '新增紀錄', 'ui.close': '關閉', 'ui.cancel': '取消',
    'ui.save': '儲存', 'ui.delete': '刪除', 'ui.optional': '選填',
    'ed.categoryLocked': '由項目決定。如需改歸屬，請先解鎖。', 'ed.unlock': '解鎖分類',
    'ed.newItem': '+ 新增項目……', 'msg.itemMoved': '已將「{name}」移至{cat}',
    'cat.count': '{i} 個項目 · {a} 個活動',
    'set.typography': '字體',
    'set.typographyHint': '為每種文字傳統各備一套字體，依語言分別記憶。',
    'cat.toggle': '展開項目與活動',
    'pal.edit': '編輯', 'pal.builtin': '內建', 'pal.yours': '你的配色', 'pal.about': '關於這套配色',
    'pal.use': '使用這套配色', 'pal.inUse': '使用中', 'pal.paper': '紙色', 'pal.ink': '墨色',
    'pal.cats': '分類色', 'pal.newCustom': '自訂一套', 'pal.name': '名稱',
    'pal.customIntro': '七種顏色構成一套配色：紙色、墨色，以及五種分類色。其餘所有顏色都由它們推導而來。',
    'pal.contrastInk': '墨色對紙色', 'pal.contrastLow': '與紙色太接近，難以辨讀',
    'pal.contrastOk': '良好', 'pal.untitled': '我的配色',
    'pal.source': '描述改寫自 Tufte 風格書籍範本。',
    'ask.deletePalette': '刪除配色「{name}」？', 'msg.paletteSaved': '已儲存「{name}」',
    'ui.hourUnit': '小時', 'ui.skip': '跳至主要內容', 'ui.views': '檢視', 'ui.range': '範圍',
    'ui.prevPeriod': '上一段', 'ui.nextPeriod': '下一段',

    'meter.today': '今天', 'meter.week': '本週', 'meter.goal': '已完成目標 {dur} 的 {pct}%',

    'scope.day': '日', 'scope.week': '週', 'scope.month': '月',
    'scope.year': '年', 'scope.semester': '學期',
    'bucket.day': '日', 'bucket.week': '週', 'bucket.month': '月',

    'range.weekOf': '{date} 所在週', 'range.nDays': '{n} 天',
    'range.calendarYear': '曆年', 'range.noSemester': '尚未設定學期',
    'range.addInSettings': '請在設定中新增',

    'ed.new': '新增紀錄', 'ed.edit': '編輯紀錄',
    'ed.category': '分類', 'ed.item': '項目', 'ed.activity': '活動',
    'ed.date': '日期', 'ed.from': '從', 'ed.to': '到', 'ed.note': '備註',
    'ed.notePlaceholder': '第四章習題、§2 證明……',
    'ed.custom': '自訂……', 'ed.newItemPlaceholder': '為項目命名',
    'ed.newActivityPlaceholder': '為活動命名',
    'ed.itemHint': '這段時間投入的具體課程、專案或書籍。',
    'ed.activityHint': '選一個常用的，或用「自訂……」新增。',
    'ed.removed': '（已刪除）',
    'ed.duration': '紀錄時長 {dur}。',
    'ed.needDuration': '紀錄必須有時長。',
    'ed.pastMidnight': '{dur} —— 跨過午夜，將在 00:00 拆分為兩筆紀錄儲存。',

    'msg.entryAdded': '已新增紀錄', 'msg.entryUpdated': '已更新紀錄',
    'msg.entryDeleted': '已刪除紀錄', 'msg.splitMidnight': '已在午夜拆分為兩筆紀錄儲存。',
    'msg.nameItem': '請為項目命名。', 'msg.nameActivity': '請為活動命名。',
    'msg.pickDate': '請選擇日期。', 'msg.renamed': '已更名為「{name}」',
    'msg.added': '已新增「{name}」', 'msg.deleted': '已刪除「{name}」',
    'msg.restored': '已還原 {n} 項預設', 'msg.presetsPresent': '預設已存在',
    'msg.exported': '已匯出', 'msg.imported': '已匯入 {n} 筆紀錄',
    'msg.erased': '帳簿已清空', 'msg.saveFailed': '無法儲存 —— 瀏覽器儲存空間已滿或被封鎖。',
    'msg.palette': '配色：{name}', 'msg.language': '語言：{name}',

    'ask.deleteEntry': '刪除這筆紀錄？',
    'ask.deleteCategory': '刪除「{name}」？',
    'ask.deleteCategoryTime': '刪除「{name}」？\n\n其下的項目以及 {dur} 的紀錄時間也會一併刪除，且無法復原。',
    'ask.deleteItem': '刪除「{name}」？',
    'ask.deleteItemTime': '刪除「{name}」？\n\n其下 {dur} 的紀錄時間也會一併刪除，且無法復原。',
    'ask.restore': '把缺少的預設分類、項目與活動補回來？\n\n已有的紀錄不會改變。',
    'ask.import': '用這個檔案取代帳簿中現有的全部內容？',
    'ask.erase': '清除全部紀錄、分類與設定？\n\n此操作無法復原。如需備份請先匯出。',
    'prompt.newCategory': '為新分類命名', 'prompt.newItem': '為「{name}」下的新項目命名',

    'hm.glance': '{year} 年概覽', 'hm.item': '篩選', 'hm.all': '全部',
    'hm.recorded': '累計紀錄', 'hm.activeDays': '有紀錄天數', 'hm.avgActiveDay': '日均（有紀錄）',
    'hm.currentStreak': '目前連續', 'hm.longestStreak': '最長連續',
    'hm.less': '少', 'hm.more': '多', 'hm.nDays': '{n} 天', 'hm.nDays_one': '{n} 天',
    'hm.foot': '最深一階為單日 {dur} 以上', 'hm.footBusy': '最忙的是 {day}，共 {dur}',
    'hm.clickDay': '點擊任一天可開啟', 'hm.nothing': '沒有紀錄',
    'hm.monthByMonth': '逐月統計', 'hm.totalIn': '{year} 年合計',
    'hm.rhythm': '一週的節奏', 'hm.avgWeekday': '各星期平均',
    'hm.gridLabel': '{year} 年每日學習時間',

    'st.recorded': '累計紀錄', 'st.perDay': '日均', 'st.perActiveDay': '有紀錄日均',
    'st.sessions': '紀錄筆數', 'st.busiest': '最忙的一{bucket}',
    'st.acrossAll': '按全部 {n} 天計', 'st.acrossSoFar': '按已過 {n} 天計',
    'st.ofRecorded': '{b} 天中有 {a} 天有紀錄', 'st.avgSession': '平均每筆 {dur}',
    'st.noneYet': '暫無',
    'st.vsPrev': '較前 {n} 天 {pct}%',
    'st.vsSame': '較上一段同期 {n} 天 {pct}%',
    'st.vsSame_one': '較上一段同一天 {pct}%',
    'st.noCompare': '沒有可比的上一段時間',
    'st.hoursPer': '每{bucket}小時數', 'st.byCategory': '按分類',
    'st.byItem': '按項目', 'st.byActivity': '按活動',
    'st.nActive': '{n} 項有紀錄', 'st.topOf': '{b} 項中的前 {a} 項',
    'st.fullFigures': '完整數據', 'st.fullFiguresNote': '本時段內的每個分類、項目與活動',
    'st.thName': '分類 / 項目 / 活動', 'st.thTime': '時長', 'st.thHours': '小時',
    'st.thShare': '占比', 'st.nothingRecorded': '沒有紀錄。',
    'st.emptyRange': '{a} 至 {b} 之間沒有紀錄。',
    'st.recordSomething': '記錄一筆', 'st.goal': '目標 {v}',
    'st.removedItems': '已刪除的分類',

    'cat.title': '分類、項目與活動',
    'cat.intro': '分類是工作的種類；項目是具體的課程、專案或書；活動是你做的事。每一個行事曆色塊都由這三者構成，其長度即為消耗的時間。名稱都可就地修改。',
    'cat.restore': '還原預設', 'cat.newCategory': '+ 新增分類',
    'cat.newItem': '+ 項目', 'cat.newActivity': '+ 活動',
    'cat.logged': '已記錄 {dur}', 'cat.unused': '未使用',
    'cat.itemsLabel': '項目', 'cat.activitiesLabel': '活動',
    'cat.noItems': '還沒有項目 —— 新增這個分類下的課程或專案。',
    'cat.noCategories': '還沒有分類。',
    'cat.categoryName': '分類名稱', 'cat.itemName': '項目名稱',
    'cat.remove': '移除 {name}', 'cat.colour': '顏色 {n}',

    'pal.title': '配色', 'pal.note': '共 {n} 套 · 停留預覽，點擊確認',
    'pal.intro': '來自 Tufte 風格書籍範本的 24 套配色，加上原本的暖色預設方案。整個帳簿會隨之重新著色 —— 包括分類顏色與熱力圖色階。',

    'set.title': '設定', 'set.language': '介面語言',
    'set.languageHint': '僅改變介面語言。你自己寫的分類、項目與活動名稱保持原樣。',
    'set.week': '一週', 'set.startsOn': '起始於', 'set.monday': '星期一', 'set.sunday': '星期日',
    'set.gridFrom': '網格自', 'set.gridTo': '網格至', 'set.midnight': '（午夜）',
    'set.gridHint': '若有紀錄落在這個範圍之外，網格會自動向外延伸。',
    'set.targets': '目標與吸附', 'set.goalH': '每日目標（小時）',
    'set.peakH': '熱力圖峰值（小時）', 'set.snap': '拖曳吸附', 'set.minutes': '{n} 分鐘',
    'set.peakHint': '熱力圖峰值是達到最深一階所需的單日總時長。',
    'set.semesters': '學期', 'set.noSemesters': '尚未設定。',
    'set.addSemester': '+ 新增學期', 'set.newTerm': '新學期',
    'set.semName': '學期名稱', 'set.semStart': '開始', 'set.semEnd': '結束',
    'set.data': '你的資料',
    'set.dataBlurb': '所有內容都儲存在此瀏覽器的本機儲存空間中，不會上傳。清除網站資料或更換裝置前請先匯出。',
    'set.export': '匯出 JSON', 'set.import': '匯入 JSON', 'set.erase': '清除全部',
    'set.dataNote': '{a} 筆紀錄 · {b} 個分類',
    'set.importFailed': '這不是「學習帳簿」匯出的檔案。',

    'help.title': '使用說明',
    'help.recording': '記錄時間',
    'help.r1': '在日網格的空白處拖曳即可劃出一段時間；單擊則預設為一小時。',
    'help.r2': '拖曳色塊可移動它 —— 也可橫向跨天。拖曳底邊可改變時長。',
    'help.r3': '點擊色塊進行編輯。跨過午夜的時段會在 00:00 拆分為兩筆紀錄儲存。',
    'help.r4': '每個色塊對應一個<em>分類</em>、一個<em>項目</em>和一個<em>活動</em>；其長度即為消耗的時間。',
    'help.keyboard': '鍵盤',
    'help.k1': '<span class="kbd">←</span> <span class="kbd">→</span> 上一段 / 下一段，<span class="kbd">T</span> 今天',
    'help.k2': '<span class="kbd">D</span> <span class="kbd">W</span> <span class="kbd">M</span> 日、週、月',
    'help.k3': '<span class="kbd">N</span> 新增紀錄 · <span class="kbd">1</span>–<span class="kbd">5</span> 切換檢視 · <span class="kbd">Esc</span> 關閉',
    'help.storage': '資料儲存在哪裡',
    'help.storageText': '僅儲存在此瀏覽器中，鍵名為 <code>study-ledger-v1</code>。無需帳號，也沒有伺服器。可用<em>設定 → 匯出 JSON</em> 備份或搬移。',

    p: {
      courseWork: '課程作業', research: '研究專案', reading: '閱讀',
      skills: '技能與語言', other: '其他',
      advOptimisation: '高等最佳化', numericalMethods: '數值方法',
      medImageSeg: '醫學影像分割', marketPrediction: '機器學習市場預測',
      papers: '論文', books: '書籍', aLanguage: '日語', programming: '程式設計',
      general: '一般',
      lecture: '聽課', notetaking: '做筆記', homework: '作業 / 習題',
      onlineCourse: '線上課程', textbook: '教科書閱讀', lab: '實驗 / 實作',
      tutorial: '輔導 / 答疑', revision: '複習', examPrep: '備考',
      groupProject: '小組專案',
      litReview: '文獻回顧', experiment: '實驗 / 資料蒐集',
      dataAnalysis: '資料分析', coding: '程式實作', paperWriting: '論文寫作',
      supervisorMeeting: '與指導教授會面', groupMeeting: '組會',
      presentationPrep: '簡報準備', proposal: '計畫書撰寫', peerReview: '同儕審查',
      skim: '略讀 / 初讀', closeReading: '精讀', annotation: '註記與筆記',
      summaryWriting: '撰寫摘要', readingGroup: '讀書會',
      practiceDrill: '練習', documentation: '文件 / 教學',
      sideProject: '副專案', vocabulary: '單字', listeningSpeaking: '聽說',
      planning: '規劃與雜務', seminar: '講座 / 研討', writing: '寫作', misc: '其他'
    }
  };

  S.ja = {
    'app.name': '学習台帳', 'app.tagline': '時間を、記録する',
    'nav.calendar': 'カレンダー', 'nav.heatmap': 'ヒートマップ', 'nav.stats': '統計',
    'nav.categories': 'カテゴリ', 'nav.palette': '配色',
    'nav.subCategories': '何に、どのように時間を使ったか',
    'nav.subPalette': '台帳全体の配色',

    'ui.settings': '設定', 'ui.help': 'ヘルプ', 'ui.today': '今日',
    'ui.newEntry': '新規記録', 'ui.close': '閉じる', 'ui.cancel': 'キャンセル',
    'ui.save': '保存', 'ui.delete': '削除', 'ui.optional': '任意',
    'ed.categoryLocked': '項目によって決まります。変えるにはロックを外してください。', 'ed.unlock': 'カテゴリのロックを解除',
    'ed.newItem': '+ 新しい項目…', 'msg.itemMoved': '「{name}」を{cat}へ移しました',
    'cat.count': '項目 {i} · 活動 {a}',
    'set.typography': '書体',
    'set.typographyHint': 'それぞれの文字文化にふさわしい書体を。言語ごとに記憶されます。',
    'cat.toggle': '項目と活動を表示',
    'pal.edit': '編集', 'pal.builtin': '内蔵', 'pal.yours': 'あなたの配色', 'pal.about': 'この配色について',
    'pal.use': 'この配色を使う', 'pal.inUse': '使用中', 'pal.paper': '紙', 'pal.ink': '墨',
    'pal.cats': 'カテゴリの色', 'pal.newCustom': '自分で作る', 'pal.name': '名前',
    'pal.customIntro': '七つの色で配色ができます。紙、墨、そしてカテゴリ用の五色。ほかの色はすべてそこから導かれます。',
    'pal.contrastInk': '紙に対する墨', 'pal.contrastLow': '紙に近すぎて読めません',
    'pal.contrastOk': '良好', 'pal.untitled': 'わたしの配色',
    'pal.source': '解説は Tufte 風書籍テンプレートより翻案。',
    'ask.deletePalette': '配色「{name}」を削除しますか？', 'msg.paletteSaved': '「{name}」を保存しました',
    'ui.hourUnit': '時間', 'ui.skip': '本文へスキップ', 'ui.views': 'ビュー', 'ui.range': '範囲',
    'ui.prevPeriod': '前の期間', 'ui.nextPeriod': '次の期間',

    'meter.today': '今日', 'meter.week': '今週', 'meter.goal': '目標 {dur} の {pct}%',

    'scope.day': '日', 'scope.week': '週', 'scope.month': '月',
    'scope.year': '年', 'scope.semester': '学期',
    'bucket.day': '日', 'bucket.week': '週', 'bucket.month': '月',

    'range.weekOf': '{date} の週', 'range.nDays': '{n} 日間',
    'range.calendarYear': '暦年', 'range.noSemester': '学期が未設定です',
    'range.addInSettings': '設定から追加してください',

    'ed.new': '新規記録', 'ed.edit': '記録を編集',
    'ed.category': 'カテゴリ', 'ed.item': '項目', 'ed.activity': '活動',
    'ed.date': '日付', 'ed.from': '開始', 'ed.to': '終了', 'ed.note': 'メモ',
    'ed.notePlaceholder': '第4章の演習、§2 の証明…',
    'ed.custom': 'カスタム…', 'ed.newItemPlaceholder': '項目名を入力',
    'ed.newActivityPlaceholder': '活動名を入力',
    'ed.itemHint': 'この時間を使った具体的な科目・プロジェクト・書籍。',
    'ed.activityHint': 'よく使うものを選ぶか、「カスタム…」で追加します。',
    'ed.removed': '（削除済み）',
    'ed.duration': '記録時間 {dur}。',
    'ed.needDuration': '記録には長さが必要です。',
    'ed.pastMidnight': '{dur} — 深夜0時をまたぐため、00:00 で 2 件に分けて保存されます。',

    'msg.entryAdded': '記録を追加しました', 'msg.entryUpdated': '記録を更新しました',
    'msg.entryDeleted': '記録を削除しました', 'msg.splitMidnight': '深夜0時で 2 件に分けて保存しました。',
    'msg.nameItem': '項目名を入力してください。', 'msg.nameActivity': '活動名を入力してください。',
    'msg.pickDate': '日付を選んでください。', 'msg.renamed': '「{name}」に変更しました',
    'msg.added': '「{name}」を追加しました', 'msg.deleted': '「{name}」を削除しました',
    'msg.restored': 'プリセットを {n} 件復元しました', 'msg.presetsPresent': 'プリセットは既にあります',
    'msg.exported': 'エクスポートしました', 'msg.imported': '{n} 件の記録をインポートしました',
    'msg.erased': '台帳を消去しました', 'msg.saveFailed': '保存できません — ブラウザの保存領域が満杯か、ブロックされています。',
    'msg.palette': '配色：{name}', 'msg.language': '言語：{name}',

    'ask.deleteEntry': 'この記録を削除しますか？',
    'ask.deleteCategory': '「{name}」を削除しますか？',
    'ask.deleteCategoryTime': '「{name}」を削除しますか？\n\n配下の項目と {dur} の記録も削除されます。元に戻せません。',
    'ask.deleteItem': '「{name}」を削除しますか？',
    'ask.deleteItemTime': '「{name}」を削除しますか？\n\n配下の {dur} の記録も削除されます。元に戻せません。',
    'ask.restore': '不足しているプリセットのカテゴリ・項目・活動を追加しますか？\n\n既存の記録は変更されません。',
    'ask.import': '台帳の内容をすべてこのファイルで置き換えますか？',
    'ask.erase': 'すべての記録・カテゴリ・設定を消去しますか？\n\n元に戻せません。控えが必要なら先にエクスポートしてください。',
    'prompt.newCategory': '新しいカテゴリ名', 'prompt.newItem': '「{name}」の新しい項目名',

    'hm.glance': '{year} 年の概観', 'hm.item': '絞り込み', 'hm.all': 'すべて',
    'hm.recorded': '記録合計', 'hm.activeDays': '記録した日数', 'hm.avgActiveDay': '記録日の平均',
    'hm.currentStreak': '現在の連続', 'hm.longestStreak': '最長の連続',
    'hm.less': '少', 'hm.more': '多', 'hm.nDays': '{n} 日', 'hm.nDays_one': '{n} 日',
    'hm.foot': '最も濃い段階は 1 日 {dur} 以上', 'hm.footBusy': '最多は {day} の {dur}',
    'hm.clickDay': '任意の日をクリックで開く', 'hm.nothing': '記録なし',
    'hm.monthByMonth': '月別', 'hm.totalIn': '{year} 年の合計',
    'hm.rhythm': '一週間のリズム', 'hm.avgWeekday': '曜日ごとの平均',
    'hm.gridLabel': '{year} 年の日別学習時間',

    'st.recorded': '記録合計', 'st.perDay': '1 日あたり', 'st.perActiveDay': '記録日あたり',
    'st.sessions': '記録件数', 'st.busiest': '最多の{bucket}',
    'st.acrossAll': '{n} 日すべてで換算', 'st.acrossSoFar': '経過した {n} 日で換算',
    'st.ofRecorded': '{b} 日中 {a} 日に記録', 'st.avgSession': '平均 {dur}',
    'st.noneYet': 'まだなし',
    'st.vsPrev': '前の {n} 日比 {pct}%',
    'st.vsSame': '前期間の同じ {n} 日比 {pct}%',
    'st.vsSame_one': '前期間の同じ日比 {pct}%',
    'st.noCompare': '比較できる前期間がありません',
    'st.hoursPer': '{bucket}ごとの時間', 'st.byCategory': 'カテゴリ別',
    'st.byItem': '項目別', 'st.byActivity': '活動別',
    'st.nActive': '{n} 件に記録', 'st.topOf': '{b} 件中の上位 {a} 件',
    'st.fullFigures': '全データ', 'st.fullFiguresNote': 'この期間のすべてのカテゴリ・項目・活動',
    'st.thName': 'カテゴリ / 項目 / 活動', 'st.thTime': '時間', 'st.thHours': '時間数',
    'st.thShare': '割合', 'st.nothingRecorded': '記録がありません。',
    'st.emptyRange': '{a} から {b} の間に記録がありません。',
    'st.recordSomething': '記録してみる', 'st.goal': '目標 {v}',
    'st.removedItems': '削除されたカテゴリ',

    'cat.title': 'カテゴリ・項目・活動',
    'cat.intro': 'カテゴリは仕事の種類、項目は実際の科目・プロジェクト・書籍、活動はやったことです。カレンダーの各ブロックはこの三つで構成され、その長さが消費した時間になります。名前はその場で変更できます。',
    'cat.restore': 'プリセットを復元', 'cat.newCategory': '+ 新しいカテゴリ',
    'cat.newItem': '+ 項目', 'cat.newActivity': '+ 活動',
    'cat.logged': '{dur} 記録済み', 'cat.unused': '未使用',
    'cat.itemsLabel': '項目', 'cat.activitiesLabel': '活動',
    'cat.noItems': 'まだ項目がありません — 該当する科目やプロジェクトを追加してください。',
    'cat.noCategories': 'まだカテゴリがありません。',
    'cat.categoryName': 'カテゴリ名', 'cat.itemName': '項目名',
    'cat.remove': '{name} を削除', 'cat.colour': '色 {n}',

    'pal.title': '配色', 'pal.note': '{n} 種 · ホバーでプレビュー、クリックで確定',
    'pal.intro': 'Tufte 風書籍テンプレートの 24 配色に、元のウォーム既定色を加えたもの。カテゴリの色もヒートマップの階調も含め、台帳全体が塗り替わります。',

    'set.title': '設定', 'set.language': '表示言語',
    'set.languageHint': '変わるのは画面表示だけです。自分で付けたカテゴリ・項目・活動の名前はそのまま残ります。',
    'set.week': '週', 'set.startsOn': '週の始まり', 'set.monday': '月曜日', 'set.sunday': '日曜日',
    'set.gridFrom': 'グリッド開始', 'set.gridTo': 'グリッド終了', 'set.midnight': '（深夜0時）',
    'set.gridHint': 'この範囲の外に記録があれば、グリッドは自動的に広がります。',
    'set.targets': '目標とスナップ', 'set.goalH': '1 日の目標（時間）',
    'set.peakH': 'ヒートマップの上限（時間）', 'set.snap': 'ドラッグの刻み', 'set.minutes': '{n} 分',
    'set.peakHint': '上限とは、最も濃い段階に達する 1 日の合計時間です。',
    'set.semesters': '学期', 'set.noSemesters': 'まだ設定されていません。',
    'set.addSemester': '+ 学期を追加', 'set.newTerm': '新しい学期',
    'set.semName': '学期名', 'set.semStart': '開始', 'set.semEnd': '終了',
    'set.data': 'あなたのデータ',
    'set.dataBlurb': 'すべてこのブラウザのローカルストレージに保存され、送信されません。サイトデータを消す前や端末を移る前にエクスポートしてください。',
    'set.export': 'JSON をエクスポート', 'set.import': 'JSON をインポート', 'set.erase': 'すべて消去',
    'set.dataNote': '記録 {a} 件 · カテゴリ {b} 件',
    'set.importFailed': 'これは学習台帳のエクスポートファイルではありません。',

    'help.title': '使い方',
    'help.recording': '時間を記録する',
    'help.r1': '日グリッドの空いているところをドラッグすると時間帯を確保できます。クリックだけなら既定の 1 時間になります。',
    'help.r2': 'ブロックをドラッグすると移動できます（横方向に日をまたぐことも可能）。下端をドラッグすると長さを変えられます。',
    'help.r3': 'ブロックをクリックすると編集できます。深夜0時をまたぐ時間帯は 00:00 で 2 件に分けて保存されます。',
    'help.r4': '各ブロックは<em>カテゴリ</em>・<em>項目</em>・<em>活動</em>を一つずつ持ち、その長さが消費した時間です。',
    'help.keyboard': 'キーボード',
    'help.k1': '<span class="kbd">←</span> <span class="kbd">→</span> 前 / 次の期間、<span class="kbd">T</span> 今日',
    'help.k2': '<span class="kbd">D</span> <span class="kbd">W</span> <span class="kbd">M</span> 日・週・月',
    'help.k3': '<span class="kbd">N</span> 新規記録 · <span class="kbd">1</span>–<span class="kbd">5</span> ビュー切替 · <span class="kbd">Esc</span> 閉じる',
    'help.storage': '保存場所',
    'help.storageText': 'このブラウザ内のみ、キー <code>study-ledger-v1</code> に保存されます。アカウントもサーバーもありません。<em>設定 → JSON をエクスポート</em>で控えを取ったり移したりできます。',

    p: {
      courseWork: '授業', research: '研究プロジェクト', reading: '読書',
      skills: 'スキルと語学', other: 'その他',
      advOptimisation: '発展最適化', numericalMethods: '数値解析',
      medImageSeg: '医用画像セグメンテーション', marketPrediction: '機械学習による市場予測',
      papers: '論文', books: '書籍', aLanguage: '英語', programming: 'プログラミング',
      general: '一般',
      lecture: '講義', notetaking: 'ノート作成', homework: '課題 / 演習',
      onlineCourse: 'オンライン講座', textbook: '教科書読解', lab: '実験 / 実習',
      tutorial: '演習 / オフィスアワー', revision: '復習', examPrep: '試験対策',
      groupProject: 'グループ課題',
      litReview: '文献調査', experiment: '実験 / データ収集',
      dataAnalysis: 'データ分析', coding: '実装', paperWriting: '論文執筆',
      supervisorMeeting: '指導教員との面談', groupMeeting: 'ゼミ',
      presentationPrep: '発表準備', proposal: '提案書作成', peerReview: '査読',
      skim: '流し読み', closeReading: '精読', annotation: '注釈とメモ',
      summaryWriting: '要約作成', readingGroup: '輪読会',
      practiceDrill: '練習', documentation: 'ドキュメント / チュートリアル',
      sideProject: '個人プロジェクト', vocabulary: '語彙', listeningSpeaking: 'リスニングと会話',
      planning: '計画と雑務', seminar: 'セミナー / 講演', writing: '執筆', misc: 'その他'
    }
  };

  S.es = {
    'app.name': 'Libro de Estudio', 'app.tagline': 'el tiempo, anotado',
    'nav.calendar': 'Calendario', 'nav.heatmap': 'Mapa de calor', 'nav.stats': 'Estadísticas',
    'nav.categories': 'Categorías', 'nav.palette': 'Paleta',
    'nav.subCategories': 'En qué inviertes el tiempo, y cómo',
    'nav.subPalette': 'Esquema de color de todo el libro',

    'ui.settings': 'Ajustes', 'ui.help': 'Ayuda', 'ui.today': 'Hoy',
    'ui.newEntry': 'Nueva entrada', 'ui.close': 'Cerrar', 'ui.cancel': 'Cancelar',
    'ui.save': 'Guardar', 'ui.delete': 'Eliminar', 'ui.optional': 'opcional',
    'ed.categoryLocked': 'La fija el elemento. Desbloquea para recolocarlo.', 'ed.unlock': 'Desbloquear categoría',
    'ed.newItem': '+ Nuevo elemento…', 'msg.itemMoved': '«{name}» movido a {cat}',
    'cat.count': '{i} elementos · {a} actividades',
    'set.typography': 'Tipografía',
    'set.typographyHint': 'Una letra para cada tradición escrita. Se recuerda por idioma.',
    'cat.toggle': 'Mostrar elementos y actividades',
    'pal.edit': 'Editar', 'pal.builtin': 'Incluidas', 'pal.yours': 'Tus paletas', 'pal.about': 'Sobre esta paleta',
    'pal.use': 'Usar esta paleta', 'pal.inUse': 'En uso', 'pal.paper': 'Papel', 'pal.ink': 'Tinta',
    'pal.cats': 'Colores de categoría', 'pal.newCustom': 'Crear la tuya', 'pal.name': 'Nombre',
    'pal.customIntro': 'Siete colores forman una paleta: el papel, la tinta y cinco tonos para tus categorías. Todo lo demás se deriva de ellos.',
    'pal.contrastInk': 'Tinta sobre papel', 'pal.contrastLow': 'demasiado cerca del papel para leerse',
    'pal.contrastOk': 'bien', 'pal.untitled': 'Mi paleta',
    'pal.source': 'Descripciones adaptadas de la plantilla de libro al estilo Tufte.',
    'ask.deletePalette': '¿Eliminar la paleta «{name}»?', 'msg.paletteSaved': '«{name}» guardada',
    'ui.hourUnit': 'h', 'ui.skip': 'Saltar al contenido', 'ui.views': 'Vistas', 'ui.range': 'Rango',
    'ui.prevPeriod': 'Periodo anterior', 'ui.nextPeriod': 'Periodo siguiente',

    'meter.today': 'Hoy', 'meter.week': 'Esta semana', 'meter.goal': '{pct}% de un objetivo de {dur}',

    'scope.day': 'Día', 'scope.week': 'Semana', 'scope.month': 'Mes',
    'scope.year': 'Año', 'scope.semester': 'Semestre',
    'bucket.day': 'día', 'bucket.week': 'semana', 'bucket.month': 'mes',

    'range.weekOf': 'Semana del {date}', 'range.nDays': '{n} días',
    'range.calendarYear': 'Año natural', 'range.noSemester': 'Ningún semestre definido',
    'range.addInSettings': 'Añade uno en Ajustes',

    'ed.new': 'Nueva entrada', 'ed.edit': 'Editar entrada',
    'ed.category': 'Categoría', 'ed.item': 'Elemento', 'ed.activity': 'Actividad',
    'ed.date': 'Fecha', 'ed.from': 'Desde', 'ed.to': 'Hasta', 'ed.note': 'Nota',
    'ed.notePlaceholder': 'Problemas del capítulo 4, demostraciones del §2…',
    'ed.custom': 'Personalizado…', 'ed.newItemPlaceholder': 'Nombra el elemento',
    'ed.newActivityPlaceholder': 'Nombra la actividad',
    'ed.itemHint': 'La asignatura, el proyecto o el libro al que fue este tiempo.',
    'ed.activityHint': 'Elige una habitual o añade la tuya con Personalizado…',
    'ed.removed': '(eliminado)',
    'ed.duration': '{dur} de tiempo registrado.',
    'ed.needDuration': 'Una entrada necesita una duración.',
    'ed.pastMidnight': '{dur} — pasa de la medianoche, así que se guardará como dos entradas divididas a las 00:00.',

    'msg.entryAdded': 'Entrada añadida', 'msg.entryUpdated': 'Entrada actualizada',
    'msg.entryDeleted': 'Entrada eliminada', 'msg.splitMidnight': 'Guardada como dos entradas, divididas a medianoche.',
    'msg.nameItem': 'Nombra el elemento.', 'msg.nameActivity': 'Nombra la actividad.',
    'msg.pickDate': 'Elige una fecha.', 'msg.renamed': 'Renombrado a «{name}»',
    'msg.added': 'Añadido «{name}»', 'msg.deleted': 'Eliminado «{name}»',
    'msg.restored': '{n} preajuste(s) restaurado(s)', 'msg.presetsPresent': 'Los preajustes ya están',
    'msg.exported': 'Exportado', 'msg.imported': '{n} entradas importadas',
    'msg.erased': 'Libro borrado', 'msg.saveFailed': 'No se pudo guardar: el almacenamiento del navegador está lleno o bloqueado.',
    'msg.palette': 'Paleta: {name}', 'msg.language': 'Idioma: {name}',

    'ask.deleteEntry': '¿Eliminar esta entrada?',
    'ask.deleteCategory': '¿Eliminar «{name}»?',
    'ask.deleteCategoryTime': '¿Eliminar «{name}»?\n\nTambién se eliminarán sus elementos y {dur} de tiempo registrado. Esto no se puede deshacer.',
    'ask.deleteItem': '¿Eliminar «{name}»?',
    'ask.deleteItemTime': '¿Eliminar «{name}»?\n\nTambién se eliminarán {dur} de tiempo registrado. Esto no se puede deshacer.',
    'ask.restore': '¿Volver a añadir las categorías, elementos y actividades predefinidos que falten?\n\nNo se cambia nada de lo ya registrado.',
    'ask.import': '¿Reemplazar todo el contenido actual del libro por este archivo?',
    'ask.erase': '¿Borrar todas las entradas, categorías y ajustes?\n\nEsto no se puede deshacer. Exporta antes si quieres una copia.',
    'prompt.newCategory': 'Nombra la nueva categoría', 'prompt.newItem': 'Nombra el nuevo elemento de «{name}»',

    'hm.glance': '{year} de un vistazo', 'hm.item': 'Filtro', 'hm.all': 'Todo',
    'hm.recorded': 'Registrado', 'hm.activeDays': 'Días activos', 'hm.avgActiveDay': 'Media por día activo',
    'hm.currentStreak': 'Racha actual', 'hm.longestStreak': 'Racha más larga',
    'hm.less': 'Menos', 'hm.more': 'Más', 'hm.nDays': '{n} días', 'hm.nDays_one': '{n} día',
    'hm.foot': 'El tono más oscuro son {dur} o más en un día', 'hm.footBusy': 'el día más cargado fue {day} con {dur}',
    'hm.clickDay': 'haz clic en cualquier día para abrirlo', 'hm.nothing': 'Sin tiempo registrado',
    'hm.monthByMonth': 'Mes a mes', 'hm.totalIn': 'total registrado en {year}',
    'hm.rhythm': 'Ritmo de la semana', 'hm.avgWeekday': 'media por día de la semana',
    'hm.gridLabel': 'Tiempo de estudio por día en {year}',

    'st.recorded': 'Registrado', 'st.perDay': 'Por día', 'st.perActiveDay': 'Por día activo',
    'st.sessions': 'Sesiones', 'st.busiest': '{bucket} más cargado',
    'st.acrossAll': 'sobre los {n} días', 'st.acrossSoFar': 'sobre los {n} días transcurridos',
    'st.ofRecorded': '{a} de {b} días registrados', 'st.avgSession': '{dur} de media',
    'st.noneYet': 'ninguna todavía',
    'st.vsPrev': '{pct}% frente a los {n} días anteriores',
    'st.vsSame': '{pct}% frente a los mismos {n} días del periodo anterior',
    'st.vsSame_one': '{pct}% frente al mismo día del periodo anterior',
    'st.noCompare': 'no hay periodo anterior comparable',
    'st.hoursPer': 'Horas por {bucket}', 'st.byCategory': 'Por categoría',
    'st.byItem': 'Por elemento', 'st.byActivity': 'Por actividad',
    'st.nActive': '{n} activas', 'st.topOf': '{a} de {b}',
    'st.fullFigures': 'Cifras completas', 'st.fullFiguresNote': 'cada categoría, elemento y actividad del periodo',
    'st.thName': 'Categoría / elemento / actividad', 'st.thTime': 'Tiempo', 'st.thHours': 'Horas',
    'st.thShare': 'Proporción', 'st.nothingRecorded': 'Nada registrado.',
    'st.emptyRange': 'No hay tiempo registrado entre {a} y {b}.',
    'st.recordSomething': 'Registra algo', 'st.goal': 'objetivo {v}',
    'st.removedItems': 'Categorías eliminadas',

    'cat.title': 'Categorías, elementos y actividades',
    'cat.intro': 'La categoría es el tipo de trabajo; el elemento es la asignatura, el proyecto o el libro concreto; la actividad es lo que hiciste. Cada bloque del calendario es uno de cada, y su longitud es el tiempo consumido. Renombra cualquier cosa sobre la marcha.',
    'cat.restore': 'Restaurar preajustes', 'cat.newCategory': '+ Nueva categoría',
    'cat.newItem': '+ elemento', 'cat.newActivity': '+ actividad',
    'cat.logged': '{dur} registrado', 'cat.unused': 'sin usar',
    'cat.itemsLabel': 'Elementos', 'cat.activitiesLabel': 'Actividades',
    'cat.noItems': 'Todavía no hay elementos: añade las asignaturas o proyectos que abarca.',
    'cat.noCategories': 'Todavía no hay categorías.',
    'cat.categoryName': 'Nombre de la categoría', 'cat.itemName': 'Nombre del elemento',
    'cat.remove': 'Quitar {name}', 'cat.colour': 'Color {n}',

    'pal.title': 'Paleta', 'pal.note': '{n} esquemas · pasa el ratón para ver, haz clic para fijar',
    'pal.intro': 'Veinticuatro paletas de la plantilla de libro al estilo Tufte, más el cálido original. Todo el libro se vuelve a entintar, incluidos los colores de categoría y la escala del mapa de calor.',

    'set.title': 'Ajustes', 'set.language': 'Idioma',
    'set.languageHint': 'Cambia solo la interfaz. Los nombres de tus categorías, elementos y actividades quedan como los escribiste.',
    'set.week': 'La semana', 'set.startsOn': 'Empieza en', 'set.monday': 'Lunes', 'set.sunday': 'Domingo',
    'set.gridFrom': 'Rejilla desde', 'set.gridTo': 'Rejilla hasta', 'set.midnight': '(medianoche)',
    'set.gridHint': 'La rejilla siempre se amplía más allá de estas horas si una entrada queda fuera.',
    'set.targets': 'Objetivos y ajuste', 'set.goalH': 'Objetivo diario (h)',
    'set.peakH': 'Pico del mapa de calor (h)', 'set.snap': 'Ajuste al arrastrar', 'set.minutes': '{n} min',
    'set.peakHint': 'El pico es el total diario que alcanza el tono más oscuro.',
    'set.semesters': 'Semestres', 'set.noSemesters': 'Ninguno definido todavía.',
    'set.addSemester': '+ Añadir semestre', 'set.newTerm': 'Nuevo semestre',
    'set.semName': 'Nombre del semestre', 'set.semStart': 'Inicio', 'set.semEnd': 'Fin',
    'set.data': 'Tus datos',
    'set.dataBlurb': 'Todo vive en el almacenamiento local de este navegador; no se sube nada. Exporta antes de borrar los datos del sitio o de cambiar de equipo.',
    'set.export': 'Exportar JSON', 'set.import': 'Importar JSON', 'set.erase': 'Borrarlo todo',
    'set.dataNote': '{a} entradas · {b} categorías',
    'set.importFailed': 'Ese archivo no es una exportación del Libro de Estudio.',

    'help.title': 'Cómo funciona',
    'help.recording': 'Registrar tiempo',
    'help.r1': 'Arrastra sobre cualquier parte vacía de la rejilla del día para reservar una sesión; un clic da una hora por defecto.',
    'help.r2': 'Arrastra un bloque para moverlo, también de lado entre días. Arrastra su borde inferior para cambiar su duración.',
    'help.r3': 'Haz clic en un bloque para editarlo. Una sesión que pasa de la medianoche se guarda como dos entradas divididas a las 00:00.',
    'help.r4': 'Cada bloque es una <em>categoría</em>, un <em>elemento</em> y una <em>actividad</em>; su longitud es el tiempo consumido.',
    'help.keyboard': 'Teclado',
    'help.k1': '<span class="kbd">←</span> <span class="kbd">→</span> periodo anterior / siguiente, <span class="kbd">T</span> hoy',
    'help.k2': '<span class="kbd">D</span> <span class="kbd">W</span> <span class="kbd">M</span> día, semana, mes',
    'help.k3': '<span class="kbd">N</span> nueva entrada · <span class="kbd">1</span>–<span class="kbd">5</span> cambiar de vista · <span class="kbd">Esc</span> cerrar',
    'help.storage': 'Dónde se guarda',
    'help.storageText': 'Solo en este navegador, bajo <code>study-ledger-v1</code>. Sin cuenta ni servidor. Usa <em>Ajustes → Exportar JSON</em> para guardar una copia o llevártelo.',

    p: {
      courseWork: 'Asignaturas', research: 'Proyecto de investigación', reading: 'Lectura',
      skills: 'Habilidades e idiomas', other: 'Otros',
      advOptimisation: 'Optimización avanzada', numericalMethods: 'Métodos numéricos',
      medImageSeg: 'Segmentación de imagen médica', marketPrediction: 'Predicción de mercado con aprendizaje automático',
      papers: 'Artículos', books: 'Libros', aLanguage: 'Inglés', programming: 'Programación',
      general: 'General',
      lecture: 'Clase', notetaking: 'Tomar apuntes', homework: 'Deberes / problemas',
      onlineCourse: 'Curso en línea', textbook: 'Lectura de manual', lab: 'Laboratorio / prácticas',
      tutorial: 'Tutoría', revision: 'Repaso', examPrep: 'Preparación de examen',
      groupProject: 'Trabajo en grupo',
      litReview: 'Revisión bibliográfica', experiment: 'Experimento / toma de datos',
      dataAnalysis: 'Análisis de datos', coding: 'Programación / implementación', paperWriting: 'Redacción del artículo',
      supervisorMeeting: 'Reunión con el director', groupMeeting: 'Reunión de grupo',
      presentationPrep: 'Preparar presentación', proposal: 'Redacción de propuesta', peerReview: 'Revisión por pares',
      skim: 'Lectura rápida', closeReading: 'Lectura atenta', annotation: 'Anotaciones y notas',
      summaryWriting: 'Redactar resumen', readingGroup: 'Grupo de lectura',
      practiceDrill: 'Ejercicios', documentation: 'Documentación / tutorial',
      sideProject: 'Proyecto propio', vocabulary: 'Vocabulario', listeningSpeaking: 'Comprensión y conversación',
      planning: 'Planificación y gestión', seminar: 'Seminario / charla', writing: 'Escritura', misc: 'Varios'
    }
  };

  S.de = {
    'app.name': 'Studienbuch', 'app.tagline': 'Zeit, festgehalten',
    'nav.calendar': 'Kalender', 'nav.heatmap': 'Heatmap', 'nav.stats': 'Statistik',
    'nav.categories': 'Kategorien', 'nav.palette': 'Farbschema',
    'nav.subCategories': 'Wofür du Zeit aufwendest — und wie',
    'nav.subPalette': 'Farbschema für das ganze Buch',

    'ui.settings': 'Einstellungen', 'ui.help': 'Hilfe', 'ui.today': 'Heute',
    'ui.newEntry': 'Neuer Eintrag', 'ui.close': 'Schließen', 'ui.cancel': 'Abbrechen',
    'ui.save': 'Speichern', 'ui.delete': 'Löschen', 'ui.optional': 'optional',
    'ed.categoryLocked': 'Vom Gegenstand vorgegeben. Zum Umhängen entsperren.', 'ed.unlock': 'Kategorie entsperren',
    'ed.newItem': '+ Neuer Gegenstand …', 'msg.itemMoved': '„{name}“ nach {cat} verschoben',
    'cat.count': '{i} Gegenstände · {a} Tätigkeiten',
    'set.typography': 'Typografie',
    'set.typographyHint': 'Eine Schrift für jede Schrifttradition. Wird je Sprache gemerkt.',
    'cat.toggle': 'Gegenstände und Tätigkeiten anzeigen',
    'pal.edit': 'Bearbeiten', 'pal.builtin': 'Mitgeliefert', 'pal.yours': 'Deine Farbschemata', 'pal.about': 'Über dieses Farbschema',
    'pal.use': 'Dieses Farbschema verwenden', 'pal.inUse': 'In Gebrauch', 'pal.paper': 'Papier', 'pal.ink': 'Tinte',
    'pal.cats': 'Kategoriefarben', 'pal.newCustom': 'Eigenes anlegen', 'pal.name': 'Name',
    'pal.customIntro': 'Sieben Farben ergeben ein Schema: das Papier, die Tinte und fünf Töne für deine Kategorien. Alles Übrige wird daraus abgeleitet.',
    'pal.contrastInk': 'Tinte auf Papier', 'pal.contrastLow': 'zu nah am Papier, um lesbar zu sein',
    'pal.contrastOk': 'gut', 'pal.untitled': 'Mein Schema',
    'pal.source': 'Beschreibungen nach der Buchvorlage im Tufte-Stil.',
    'ask.deletePalette': 'Farbschema „{name}“ löschen?', 'msg.paletteSaved': '„{name}“ gesichert',
    'ui.hourUnit': 'Std.', 'ui.skip': 'Zum Inhalt springen', 'ui.views': 'Ansichten', 'ui.range': 'Zeitraum',
    'ui.prevPeriod': 'Vorheriger Zeitraum', 'ui.nextPeriod': 'Nächster Zeitraum',

    'meter.today': 'Heute', 'meter.week': 'Diese Woche', 'meter.goal': '{pct} % eines Ziels von {dur}',

    'scope.day': 'Tag', 'scope.week': 'Woche', 'scope.month': 'Monat',
    'scope.year': 'Jahr', 'scope.semester': 'Semester',
    'bucket.day': 'Tag', 'bucket.week': 'Woche', 'bucket.month': 'Monat',

    'range.weekOf': 'Woche ab {date}', 'range.nDays': '{n} Tage',
    'range.calendarYear': 'Kalenderjahr', 'range.noSemester': 'Kein Semester festgelegt',
    'range.addInSettings': 'In den Einstellungen anlegen',

    'ed.new': 'Neuer Eintrag', 'ed.edit': 'Eintrag bearbeiten',
    'ed.category': 'Kategorie', 'ed.item': 'Gegenstand', 'ed.activity': 'Tätigkeit',
    'ed.date': 'Datum', 'ed.from': 'Von', 'ed.to': 'Bis', 'ed.note': 'Notiz',
    'ed.notePlaceholder': 'Übungsblatt Kapitel 4, Beweise §2 …',
    'ed.custom': 'Eigene …', 'ed.newItemPlaceholder': 'Gegenstand benennen',
    'ed.newActivityPlaceholder': 'Tätigkeit benennen',
    'ed.itemHint': 'Die Lehrveranstaltung, das Projekt oder das Buch, in das diese Zeit floss.',
    'ed.activityHint': 'Eine gängige wählen oder mit „Eigene …“ ergänzen.',
    'ed.removed': '(entfernt)',
    'ed.duration': '{dur} erfasste Zeit.',
    'ed.needDuration': 'Ein Eintrag braucht eine Dauer.',
    'ed.pastMidnight': '{dur} — reicht über Mitternacht hinaus und wird daher als zwei Einträge, getrennt um 00:00, gespeichert.',

    'msg.entryAdded': 'Eintrag hinzugefügt', 'msg.entryUpdated': 'Eintrag aktualisiert',
    'msg.entryDeleted': 'Eintrag gelöscht', 'msg.splitMidnight': 'Als zwei Einträge gespeichert, getrennt um Mitternacht.',
    'msg.nameItem': 'Bitte den Gegenstand benennen.', 'msg.nameActivity': 'Bitte die Tätigkeit benennen.',
    'msg.pickDate': 'Bitte ein Datum wählen.', 'msg.renamed': 'Umbenannt in „{name}“',
    'msg.added': '„{name}“ hinzugefügt', 'msg.deleted': '„{name}“ gelöscht',
    'msg.restored': '{n} Vorgabe(n) wiederhergestellt', 'msg.presetsPresent': 'Vorgaben sind bereits vorhanden',
    'msg.exported': 'Exportiert', 'msg.imported': '{n} Einträge importiert',
    'msg.erased': 'Buch gelöscht', 'msg.saveFailed': 'Speichern nicht möglich — der Browserspeicher ist voll oder blockiert.',
    'msg.palette': 'Farbschema: {name}', 'msg.language': 'Sprache: {name}',

    'ask.deleteEntry': 'Diesen Eintrag löschen?',
    'ask.deleteCategory': '„{name}“ löschen?',
    'ask.deleteCategoryTime': '„{name}“ löschen?\n\nDamit werden auch die zugehörigen Gegenstände und {dur} erfasste Zeit gelöscht. Das lässt sich nicht rückgängig machen.',
    'ask.deleteItem': '„{name}“ löschen?',
    'ask.deleteItemTime': '„{name}“ löschen?\n\nDamit werden auch {dur} erfasste Zeit gelöscht. Das lässt sich nicht rückgängig machen.',
    'ask.restore': 'Fehlende vorgegebene Kategorien, Gegenstände und Tätigkeiten wieder ergänzen?\n\nBereits Erfasstes bleibt unverändert.',
    'ask.import': 'Den gesamten Inhalt des Buches durch diese Datei ersetzen?',
    'ask.erase': 'Alle Einträge, Kategorien und Einstellungen löschen?\n\nDas lässt sich nicht rückgängig machen. Vorher exportieren, wenn du eine Kopie möchtest.',
    'prompt.newCategory': 'Neue Kategorie benennen', 'prompt.newItem': 'Neuen Gegenstand unter „{name}“ benennen',

    'hm.glance': '{year} auf einen Blick', 'hm.item': 'Filter', 'hm.all': 'Alles',
    'hm.recorded': 'Erfasst', 'hm.activeDays': 'Aktive Tage', 'hm.avgActiveDay': 'Ø aktiver Tag',
    'hm.currentStreak': 'Aktuelle Serie', 'hm.longestStreak': 'Längste Serie',
    'hm.less': 'Weniger', 'hm.more': 'Mehr', 'hm.nDays': '{n} Tage', 'hm.nDays_one': '{n} Tag',
    'hm.foot': 'Die dunkelste Stufe sind {dur} und mehr an einem Tag', 'hm.footBusy': 'am meisten am {day} mit {dur}',
    'hm.clickDay': 'einen Tag anklicken, um ihn zu öffnen', 'hm.nothing': 'Keine Zeit erfasst',
    'hm.monthByMonth': 'Monat für Monat', 'hm.totalIn': 'insgesamt erfasst {year}',
    'hm.rhythm': 'Rhythmus der Woche', 'hm.avgWeekday': 'Durchschnitt je Wochentag',
    'hm.gridLabel': 'Lernzeit pro Tag im Jahr {year}',

    'st.recorded': 'Erfasst', 'st.perDay': 'Pro Tag', 'st.perActiveDay': 'Pro aktivem Tag',
    'st.sessions': 'Einheiten', 'st.busiest': 'Stärkste(r) {bucket}',
    'st.acrossAll': 'über alle {n} Tage', 'st.acrossSoFar': 'über {n} bisherige Tage',
    'st.ofRecorded': '{a} von {b} Tagen erfasst', 'st.avgSession': '{dur} im Schnitt',
    'st.noneYet': 'noch keine',
    'st.vsPrev': '{pct} % gegenüber den vorigen {n} Tagen',
    'st.vsSame': '{pct} % gegenüber denselben {n} Tagen des Vorzeitraums',
    'st.vsSame_one': '{pct} % gegenüber demselben Tag des Vorzeitraums',
    'st.noCompare': 'kein vergleichbarer Vorzeitraum',
    'st.hoursPer': 'Stunden pro {bucket}', 'st.byCategory': 'Nach Kategorie',
    'st.byItem': 'Nach Gegenstand', 'st.byActivity': 'Nach Tätigkeit',
    'st.nActive': '{n} aktiv', 'st.topOf': 'Top {a} von {b}',
    'st.fullFigures': 'Vollständige Zahlen', 'st.fullFiguresNote': 'jede Kategorie, jeder Gegenstand und jede Tätigkeit im Zeitraum',
    'st.thName': 'Kategorie / Gegenstand / Tätigkeit', 'st.thTime': 'Zeit', 'st.thHours': 'Stunden',
    'st.thShare': 'Anteil', 'st.nothingRecorded': 'Nichts erfasst.',
    'st.emptyRange': 'Zwischen {a} und {b} wurde keine Zeit erfasst.',
    'st.recordSomething': 'Etwas erfassen', 'st.goal': 'Ziel {v}',
    'st.removedItems': 'Entfernte Kategorien',

    'cat.title': 'Kategorien, Gegenstände und Tätigkeiten',
    'cat.intro': 'Die Kategorie ist die Art der Arbeit, der Gegenstand die konkrete Lehrveranstaltung, das Projekt oder das Buch, die Tätigkeit das, was du getan hast. Jeder Block im Kalender ist je eines davon, und seine Länge ist die verbrauchte Zeit. Alles lässt sich direkt umbenennen.',
    'cat.restore': 'Vorgaben wiederherstellen', 'cat.newCategory': '+ Neue Kategorie',
    'cat.newItem': '+ Gegenstand', 'cat.newActivity': '+ Tätigkeit',
    'cat.logged': '{dur} erfasst', 'cat.unused': 'ungenutzt',
    'cat.itemsLabel': 'Gegenstände', 'cat.activitiesLabel': 'Tätigkeiten',
    'cat.noItems': 'Noch keine Gegenstände — trage die Lehrveranstaltungen oder Projekte ein.',
    'cat.noCategories': 'Noch keine Kategorien.',
    'cat.categoryName': 'Name der Kategorie', 'cat.itemName': 'Name des Gegenstands',
    'cat.remove': '{name} entfernen', 'cat.colour': 'Farbe {n}',

    'pal.title': 'Farbschema', 'pal.note': '{n} Schemata · zum Vorschauen darüberfahren, zum Übernehmen klicken',
    'pal.intro': 'Vierundzwanzig Paletten aus der Buchvorlage im Tufte-Stil, dazu das ursprüngliche warme Schema. Das ganze Buch wird neu eingefärbt — samt Kategoriefarben und Heatmap-Skala.',

    'set.title': 'Einstellungen', 'set.language': 'Sprache',
    'set.languageHint': 'Ändert nur die Oberfläche. Deine eigenen Namen für Kategorien, Gegenstände und Tätigkeiten bleiben, wie du sie geschrieben hast.',
    'set.week': 'Die Woche', 'set.startsOn': 'Beginnt am', 'set.monday': 'Montag', 'set.sunday': 'Sonntag',
    'set.gridFrom': 'Raster ab', 'set.gridTo': 'Raster bis', 'set.midnight': '(Mitternacht)',
    'set.gridHint': 'Das Raster erweitert sich stets über diese Stunden hinaus, wenn ein Eintrag außerhalb liegt.',
    'set.targets': 'Ziele und Raster', 'set.goalH': 'Tagesziel (Std.)',
    'set.peakH': 'Heatmap-Spitze (Std.)', 'set.snap': 'Einrasten beim Ziehen', 'set.minutes': '{n} Min.',
    'set.peakHint': 'Die Spitze ist die Tagessumme, die die dunkelste Stufe erreicht.',
    'set.semesters': 'Semester', 'set.noSemesters': 'Noch keines festgelegt.',
    'set.addSemester': '+ Semester hinzufügen', 'set.newTerm': 'Neues Semester',
    'set.semName': 'Name des Semesters', 'set.semStart': 'Beginn', 'set.semEnd': 'Ende',
    'set.data': 'Deine Daten',
    'set.dataBlurb': 'Alles liegt im lokalen Speicher dieses Browsers — nichts wird hochgeladen. Exportiere, bevor du Websitedaten löschst oder das Gerät wechselst.',
    'set.export': 'JSON exportieren', 'set.import': 'JSON importieren', 'set.erase': 'Alles löschen',
    'set.dataNote': '{a} Einträge · {b} Kategorien',
    'set.importFailed': 'Diese Datei ist kein Studienbuch-Export.',

    'help.title': 'So funktioniert es',
    'help.recording': 'Zeit erfassen',
    'help.r1': 'Ziehe über eine freie Stelle im Tagesraster, um eine Einheit einzutragen; ein Klick ergibt eine Stunde.',
    'help.r2': 'Ziehe einen Block, um ihn zu verschieben — auch seitlich über Tage hinweg. Ziehe die Unterkante, um die Dauer zu ändern.',
    'help.r3': 'Klicke einen Block an, um ihn zu bearbeiten. Eine Einheit über Mitternacht wird als zwei Einträge gespeichert, getrennt um 00:00.',
    'help.r4': 'Jeder Block ist eine <em>Kategorie</em>, ein <em>Gegenstand</em> und eine <em>Tätigkeit</em>; seine Länge ist die verbrauchte Zeit.',
    'help.keyboard': 'Tastatur',
    'help.k1': '<span class="kbd">←</span> <span class="kbd">→</span> voriger / nächster Zeitraum, <span class="kbd">T</span> heute',
    'help.k2': '<span class="kbd">D</span> <span class="kbd">W</span> <span class="kbd">M</span> Tag, Woche, Monat',
    'help.k3': '<span class="kbd">N</span> neuer Eintrag · <span class="kbd">1</span>–<span class="kbd">5</span> Ansicht wechseln · <span class="kbd">Esc</span> schließen',
    'help.storage': 'Wo es gespeichert wird',
    'help.storageText': 'Nur in diesem Browser, unter <code>study-ledger-v1</code>. Kein Konto, kein Server. Mit <em>Einstellungen → JSON exportieren</em> sicherst oder verschiebst du es.',

    p: {
      courseWork: 'Lehrveranstaltungen', research: 'Forschungsprojekt', reading: 'Lektüre',
      skills: 'Fertigkeiten & Sprachen', other: 'Sonstiges',
      advOptimisation: 'Höhere Optimierung', numericalMethods: 'Numerische Methoden',
      medImageSeg: 'Medizinische Bildsegmentierung', marketPrediction: 'Marktprognose mit maschinellem Lernen',
      papers: 'Aufsätze', books: 'Bücher', aLanguage: 'Englisch', programming: 'Programmieren',
      general: 'Allgemein',
      lecture: 'Vorlesung', notetaking: 'Mitschrift', homework: 'Übungsblatt',
      onlineCourse: 'Onlinekurs', textbook: 'Lehrbuchlektüre', lab: 'Praktikum',
      tutorial: 'Tutorium / Sprechstunde', revision: 'Wiederholung', examPrep: 'Prüfungsvorbereitung',
      groupProject: 'Gruppenarbeit',
      litReview: 'Literaturrecherche', experiment: 'Experiment / Datenerhebung',
      dataAnalysis: 'Datenauswertung', coding: 'Implementierung', paperWriting: 'Aufsatz schreiben',
      supervisorMeeting: 'Besprechung mit Betreuer', groupMeeting: 'Gruppenbesprechung',
      presentationPrep: 'Vortragsvorbereitung', proposal: 'Antrag schreiben', peerReview: 'Begutachtung',
      skim: 'Querlesen', closeReading: 'Genaue Lektüre', annotation: 'Anmerkungen & Notizen',
      summaryWriting: 'Zusammenfassung schreiben', readingGroup: 'Lesekreis',
      practiceDrill: 'Übung', documentation: 'Dokumentation / Tutorial',
      sideProject: 'Nebenprojekt', vocabulary: 'Vokabeln', listeningSpeaking: 'Hören & Sprechen',
      planning: 'Planung & Organisation', seminar: 'Seminar / Vortrag', writing: 'Schreiben', misc: 'Verschiedenes'
    }
  };

  S.fr = {
    'app.name': 'Registre d’Étude', 'app.tagline': 'le temps, consigné',
    'nav.calendar': 'Calendrier', 'nav.heatmap': 'Carte de chaleur', 'nav.stats': 'Statistiques',
    'nav.categories': 'Catégories', 'nav.palette': 'Palette',
    'nav.subCategories': 'À quoi passe votre temps, et comment',
    'nav.subPalette': 'Palette de tout le registre',

    'ui.settings': 'Réglages', 'ui.help': 'Aide', 'ui.today': 'Aujourd’hui',
    'ui.newEntry': 'Nouvelle entrée', 'ui.close': 'Fermer', 'ui.cancel': 'Annuler',
    'ui.save': 'Enregistrer', 'ui.delete': 'Supprimer', 'ui.optional': 'facultatif',
    'ed.categoryLocked': 'Déterminée par l’élément. Déverrouillez pour la changer.', 'ed.unlock': 'Déverrouiller la catégorie',
    'ed.newItem': '+ Nouvel élément…', 'msg.itemMoved': '« {name} » déplacé vers {cat}',
    'cat.count': '{i} éléments · {a} activités',
    'set.typography': 'Typographie',
    'set.typographyHint': 'Un caractère pour chaque tradition d’écriture. Mémorisé par langue.',
    'cat.toggle': 'Afficher les éléments et activités',
    'pal.edit': 'Modifier', 'pal.builtin': 'Fournies', 'pal.yours': 'Vos palettes', 'pal.about': 'À propos de cette palette',
    'pal.use': 'Utiliser cette palette', 'pal.inUse': 'En usage', 'pal.paper': 'Papier', 'pal.ink': 'Encre',
    'pal.cats': 'Couleurs de catégorie', 'pal.newCustom': 'Créer la vôtre', 'pal.name': 'Nom',
    'pal.customIntro': 'Sept couleurs font une palette : le papier, l’encre et cinq teintes pour vos catégories. Tout le reste en dérive.',
    'pal.contrastInk': 'Encre sur papier', 'pal.contrastLow': 'trop proche du papier pour être lisible',
    'pal.contrastOk': 'bien', 'pal.untitled': 'Ma palette',
    'pal.source': 'Descriptions adaptées du gabarit de livre à la Tufte.',
    'ask.deletePalette': 'Supprimer la palette « {name} » ?', 'msg.paletteSaved': '« {name} » enregistrée',
    'ui.hourUnit': 'h', 'ui.skip': 'Aller au contenu', 'ui.views': 'Vues', 'ui.range': 'Période',
    'ui.prevPeriod': 'Période précédente', 'ui.nextPeriod': 'Période suivante',

    'meter.today': 'Aujourd’hui', 'meter.week': 'Cette semaine', 'meter.goal': '{pct} % d’un objectif de {dur}',

    'scope.day': 'Jour', 'scope.week': 'Semaine', 'scope.month': 'Mois',
    'scope.year': 'Année', 'scope.semester': 'Semestre',
    'bucket.day': 'jour', 'bucket.week': 'semaine', 'bucket.month': 'mois',

    'range.weekOf': 'Semaine du {date}', 'range.nDays': '{n} jours',
    'range.calendarYear': 'Année civile', 'range.noSemester': 'Aucun semestre défini',
    'range.addInSettings': 'Ajoutez-en un dans les Réglages',

    'ed.new': 'Nouvelle entrée', 'ed.edit': 'Modifier l’entrée',
    'ed.category': 'Catégorie', 'ed.item': 'Élément', 'ed.activity': 'Activité',
    'ed.date': 'Date', 'ed.from': 'De', 'ed.to': 'À', 'ed.note': 'Note',
    'ed.notePlaceholder': 'Exercices du chapitre 4, démonstrations du §2…',
    'ed.custom': 'Personnalisé…', 'ed.newItemPlaceholder': 'Nommer l’élément',
    'ed.newActivityPlaceholder': 'Nommer l’activité',
    'ed.itemHint': 'Le cours, le projet ou le livre auquel ce temps a servi.',
    'ed.activityHint': 'Choisissez-en une courante, ou ajoutez la vôtre avec Personnalisé…',
    'ed.removed': '(supprimé)',
    'ed.duration': '{dur} de temps consigné.',
    'ed.needDuration': 'Une entrée doit avoir une durée.',
    'ed.pastMidnight': '{dur} — dépasse minuit, et sera donc enregistré en deux entrées séparées à 00:00.',

    'msg.entryAdded': 'Entrée ajoutée', 'msg.entryUpdated': 'Entrée mise à jour',
    'msg.entryDeleted': 'Entrée supprimée', 'msg.splitMidnight': 'Enregistré en deux entrées, séparées à minuit.',
    'msg.nameItem': 'Nommez l’élément.', 'msg.nameActivity': 'Nommez l’activité.',
    'msg.pickDate': 'Choisissez une date.', 'msg.renamed': 'Renommé en « {name} »',
    'msg.added': '« {name} » ajouté', 'msg.deleted': '« {name} » supprimé',
    'msg.restored': '{n} préréglage(s) restauré(s)', 'msg.presetsPresent': 'Les préréglages sont déjà là',
    'msg.exported': 'Exporté', 'msg.imported': '{n} entrées importées',
    'msg.erased': 'Registre effacé', 'msg.saveFailed': 'Enregistrement impossible — le stockage du navigateur est plein ou bloqué.',
    'msg.palette': 'Palette : {name}', 'msg.language': 'Langue : {name}',

    'ask.deleteEntry': 'Supprimer cette entrée ?',
    'ask.deleteCategory': 'Supprimer « {name} » ?',
    'ask.deleteCategoryTime': 'Supprimer « {name} » ?\n\nSes éléments et {dur} de temps consigné seront également supprimés. Irréversible.',
    'ask.deleteItem': 'Supprimer « {name} » ?',
    'ask.deleteItemTime': 'Supprimer « {name} » ?\n\n{dur} de temps consigné seront également supprimés. Irréversible.',
    'ask.restore': 'Rétablir les catégories, éléments et activités prédéfinis manquants ?\n\nRien de ce qui est déjà consigné n’est modifié.',
    'ask.import': 'Remplacer tout le contenu actuel du registre par ce fichier ?',
    'ask.erase': 'Effacer toutes les entrées, catégories et réglages ?\n\nIrréversible. Exportez d’abord si vous voulez une copie.',
    'prompt.newCategory': 'Nommez la nouvelle catégorie', 'prompt.newItem': 'Nommez le nouvel élément de « {name} »',

    'hm.glance': '{year} en un coup d’œil', 'hm.item': 'Filtre', 'hm.all': 'Tout',
    'hm.recorded': 'Consigné', 'hm.activeDays': 'Jours actifs', 'hm.avgActiveDay': 'Moy. par jour actif',
    'hm.currentStreak': 'Série en cours', 'hm.longestStreak': 'Plus longue série',
    'hm.less': 'Moins', 'hm.more': 'Plus', 'hm.nDays': '{n} jours', 'hm.nDays_one': '{n} jour',
    'hm.foot': 'Le ton le plus foncé vaut {dur} ou plus en un jour', 'hm.footBusy': 'le plus chargé fut {day} avec {dur}',
    'hm.clickDay': 'cliquez un jour pour l’ouvrir', 'hm.nothing': 'Aucun temps consigné',
    'hm.monthByMonth': 'Mois par mois', 'hm.totalIn': 'total consigné en {year}',
    'hm.rhythm': 'Rythme de la semaine', 'hm.avgWeekday': 'moyenne par jour de semaine',
    'hm.gridLabel': 'Temps d’étude par jour en {year}',

    'st.recorded': 'Consigné', 'st.perDay': 'Par jour', 'st.perActiveDay': 'Par jour actif',
    'st.sessions': 'Séances', 'st.busiest': '{bucket} le plus chargé',
    'st.acrossAll': 'sur les {n} jours', 'st.acrossSoFar': 'sur les {n} jours écoulés',
    'st.ofRecorded': '{a} jours sur {b} consignés', 'st.avgSession': '{dur} en moyenne',
    'st.noneYet': 'aucune pour l’instant',
    'st.vsPrev': '{pct} % par rapport aux {n} jours précédents',
    'st.vsSame': '{pct} % par rapport aux mêmes {n} jours de la période précédente',
    'st.vsSame_one': '{pct} % par rapport au même jour de la période précédente',
    'st.noCompare': 'aucune période précédente comparable',
    'st.hoursPer': 'Heures par {bucket}', 'st.byCategory': 'Par catégorie',
    'st.byItem': 'Par élément', 'st.byActivity': 'Par activité',
    'st.nActive': '{n} actives', 'st.topOf': '{a} sur {b}',
    'st.fullFigures': 'Chiffres complets', 'st.fullFiguresNote': 'chaque catégorie, élément et activité de la période',
    'st.thName': 'Catégorie / élément / activité', 'st.thTime': 'Temps', 'st.thHours': 'Heures',
    'st.thShare': 'Part', 'st.nothingRecorded': 'Rien de consigné.',
    'st.emptyRange': 'Aucun temps consigné entre le {a} et le {b}.',
    'st.recordSomething': 'Consigner quelque chose', 'st.goal': 'objectif {v}',
    'st.removedItems': 'Catégories supprimées',

    'cat.title': 'Catégories, éléments et activités',
    'cat.intro': 'La catégorie est le genre de travail ; l’élément est le cours, le projet ou le livre concret ; l’activité est ce que vous avez fait. Chaque bloc du calendrier en comporte un de chaque, et sa longueur est le temps consommé. Tout se renomme sur place.',
    'cat.restore': 'Rétablir les préréglages', 'cat.newCategory': '+ Nouvelle catégorie',
    'cat.newItem': '+ élément', 'cat.newActivity': '+ activité',
    'cat.logged': '{dur} consignées', 'cat.unused': 'inutilisée',
    'cat.itemsLabel': 'Éléments', 'cat.activitiesLabel': 'Activités',
    'cat.noItems': 'Pas encore d’éléments — ajoutez les cours ou projets concernés.',
    'cat.noCategories': 'Pas encore de catégories.',
    'cat.categoryName': 'Nom de la catégorie', 'cat.itemName': 'Nom de l’élément',
    'cat.remove': 'Retirer {name}', 'cat.colour': 'Couleur {n}',

    'pal.title': 'Palette', 'pal.note': '{n} schémas · survolez pour prévisualiser, cliquez pour garder',
    'pal.intro': 'Vingt-quatre palettes du modèle de livre à la Tufte, plus le chaud d’origine. Tout le registre se ré-encre — couleurs de catégorie et échelle de la carte de chaleur comprises.',

    'set.title': 'Réglages', 'set.language': 'Langue',
    'set.languageHint': 'Ne change que l’interface. Vos propres noms de catégories, d’éléments et d’activités restent tels quels.',
    'set.week': 'La semaine', 'set.startsOn': 'Commence le', 'set.monday': 'Lundi', 'set.sunday': 'Dimanche',
    'set.gridFrom': 'Grille de', 'set.gridTo': 'Grille à', 'set.midnight': '(minuit)',
    'set.gridHint': 'La grille s’étend toujours au-delà de ces heures si une entrée sort du cadre.',
    'set.targets': 'Objectifs et aimantation', 'set.goalH': 'Objectif quotidien (h)',
    'set.peakH': 'Pic de la carte (h)', 'set.snap': 'Pas du glisser', 'set.minutes': '{n} min',
    'set.peakHint': 'Le pic est le total quotidien qui atteint le ton le plus foncé.',
    'set.semesters': 'Semestres', 'set.noSemesters': 'Aucun défini pour l’instant.',
    'set.addSemester': '+ Ajouter un semestre', 'set.newTerm': 'Nouveau semestre',
    'set.semName': 'Nom du semestre', 'set.semStart': 'Début', 'set.semEnd': 'Fin',
    'set.data': 'Vos données',
    'set.dataBlurb': 'Tout réside dans le stockage local de ce navigateur — rien n’est envoyé. Exportez avant d’effacer les données du site ou de changer de machine.',
    'set.export': 'Exporter en JSON', 'set.import': 'Importer du JSON', 'set.erase': 'Tout effacer',
    'set.dataNote': '{a} entrées · {b} catégories',
    'set.importFailed': 'Ce fichier n’est pas un export du Registre d’Étude.',

    'help.title': 'Comment ça marche',
    'help.recording': 'Consigner du temps',
    'help.r1': 'Glissez sur une partie vide de la grille du jour pour réserver une séance ; un simple clic donne une heure par défaut.',
    'help.r2': 'Glissez un bloc pour le déplacer — latéralement d’un jour à l’autre aussi. Glissez son bord inférieur pour changer sa durée.',
    'help.r3': 'Cliquez un bloc pour le modifier. Une séance qui dépasse minuit est enregistrée en deux entrées séparées à 00:00.',
    'help.r4': 'Chaque bloc est une <em>catégorie</em>, un <em>élément</em> et une <em>activité</em> ; sa longueur est le temps consommé.',
    'help.keyboard': 'Clavier',
    'help.k1': '<span class="kbd">←</span> <span class="kbd">→</span> période précédente / suivante, <span class="kbd">T</span> aujourd’hui',
    'help.k2': '<span class="kbd">D</span> <span class="kbd">W</span> <span class="kbd">M</span> jour, semaine, mois',
    'help.k3': '<span class="kbd">N</span> nouvelle entrée · <span class="kbd">1</span>–<span class="kbd">5</span> changer de vue · <span class="kbd">Esc</span> fermer',
    'help.storage': 'Où c’est stocké',
    'help.storageText': 'Dans ce navigateur uniquement, sous <code>study-ledger-v1</code>. Pas de compte, pas de serveur. Utilisez <em>Réglages → Exporter en JSON</em> pour en garder une copie ou l’emporter.',

    p: {
      courseWork: 'Travail de cours', research: 'Projet de recherche', reading: 'Lecture',
      skills: 'Compétences et langues', other: 'Autre',
      advOptimisation: 'Optimisation avancée', numericalMethods: 'Méthodes numériques',
      medImageSeg: 'Segmentation d’images médicales', marketPrediction: 'Prévision de marché par apprentissage automatique',
      papers: 'Articles', books: 'Livres', aLanguage: 'Anglais', programming: 'Programmation',
      general: 'Général',
      lecture: 'Cours magistral', notetaking: 'Prise de notes', homework: 'Devoirs / exercices',
      onlineCourse: 'Cours en ligne', textbook: 'Lecture du manuel', lab: 'TP / pratique',
      tutorial: 'TD / permanence', revision: 'Révision', examPrep: 'Préparation d’examen',
      groupProject: 'Projet de groupe',
      litReview: 'Revue de littérature', experiment: 'Expérience / collecte de données',
      dataAnalysis: 'Analyse de données', coding: 'Développement', paperWriting: 'Rédaction d’article',
      supervisorMeeting: 'Réunion avec le directeur', groupMeeting: 'Réunion d’équipe',
      presentationPrep: 'Préparation d’exposé', proposal: 'Rédaction de projet', peerReview: 'Évaluation par les pairs',
      skim: 'Survol', closeReading: 'Lecture attentive', annotation: 'Annotations et notes',
      summaryWriting: 'Rédaction de synthèse', readingGroup: 'Groupe de lecture',
      practiceDrill: 'Exercices', documentation: 'Documentation / tutoriel',
      sideProject: 'Projet personnel', vocabulary: 'Vocabulaire', listeningSpeaking: 'Écoute et expression',
      planning: 'Organisation', seminar: 'Séminaire / conférence', writing: 'Rédaction', misc: 'Divers'
    }
  };

  S.la = {
    'app.name': 'Codex Studiorum', 'app.tagline': 'tempus, notatum',
    'nav.calendar': 'Calendarium', 'nav.heatmap': 'Tabula Anni', 'nav.stats': 'Statistica',
    'nav.categories': 'Genera', 'nav.palette': 'Colores',
    'nav.subCategories': 'In quibus tempus consumis, et quomodo',
    'nav.subPalette': 'Ratio colorum totius codicis',

    'ui.settings': 'Optiones', 'ui.help': 'Auxilium', 'ui.today': 'Hodie',
    'ui.newEntry': 'Nova nota', 'ui.close': 'Claudere', 'ui.cancel': 'Abicere',
    'ui.save': 'Servare', 'ui.delete': 'Delere', 'ui.optional': 'optionalis',
    'ed.categoryLocked': 'A re definitum. Resera ut mutes.', 'ed.unlock': 'Genus reserare',
    'ed.newItem': '+ Nova res…', 'msg.itemMoved': '«{name}» ad {cat} translata',
    'cat.count': 'res {i} · actiones {a}',
    'set.typography': 'Typographia',
    'set.typographyHint': 'Littera cuique scribendi more propria. Pro lingua servatur.',
    'cat.toggle': 'Res et actiones ostendere',
    'pal.edit': 'Emendare', 'pal.builtin': 'Inclusae', 'pal.yours': 'Colores tui', 'pal.about': 'De hac ratione colorum',
    'pal.use': 'Hac ratione uti', 'pal.inUse': 'In usu', 'pal.paper': 'Charta', 'pal.ink': 'Atramentum',
    'pal.cats': 'Colores generum', 'pal.newCustom': 'Tuam facere', 'pal.name': 'Nomen',
    'pal.customIntro': 'Septem colores rationem faciunt: charta, atramentum, et quinque colores generum. Cetera omnia inde derivantur.',
    'pal.contrastInk': 'Atramentum in charta', 'pal.contrastLow': 'chartae nimis simile ut legi possit',
    'pal.contrastOk': 'bene', 'pal.untitled': 'Ratio mea',
    'pal.source': 'Descriptiones ex exemplari libri more Tufteano adaptatae.',
    'ask.deletePalette': 'Rationem «{name}» delere?', 'msg.paletteSaved': '«{name}» servata',
    'ui.hourUnit': 'h', 'ui.skip': 'Ad contenta transilire', 'ui.views': 'Species', 'ui.range': 'Spatium',
    'ui.prevPeriod': 'Spatium prius', 'ui.nextPeriod': 'Spatium sequens',

    'meter.today': 'Hodie', 'meter.week': 'Hac hebdomade', 'meter.goal': '{pct}% metae {dur}',

    'scope.day': 'Dies', 'scope.week': 'Hebdomas', 'scope.month': 'Mensis',
    'scope.year': 'Annus', 'scope.semester': 'Semestre',
    'bucket.day': 'diem', 'bucket.week': 'hebdomadem', 'bucket.month': 'mensem',

    'range.weekOf': 'Hebdomas a die {date}', 'range.nDays': 'dies {n}',
    'range.calendarYear': 'Annus civilis', 'range.noSemester': 'Nullum semestre definitum',
    'range.addInSettings': 'Adde in Optionibus',

    'ed.new': 'Nova nota', 'ed.edit': 'Notam emendare',
    'ed.category': 'Genus', 'ed.item': 'Res', 'ed.activity': 'Actio',
    'ed.date': 'Dies', 'ed.from': 'Ab', 'ed.to': 'Ad', 'ed.note': 'Adnotatio',
    'ed.notePlaceholder': 'Exercitia capitis IV, demonstrationes §2…',
    'ed.custom': 'Proprium…', 'ed.newItemPlaceholder': 'Rem nomina',
    'ed.newActivityPlaceholder': 'Actionem nomina',
    'ed.itemHint': 'Schola, opus vel liber in quem hoc tempus impensum est.',
    'ed.activityHint': 'Elige usitatam, vel tuam adde per Proprium…',
    'ed.removed': '(deleta)',
    'ed.duration': '{dur} temporis notati.',
    'ed.needDuration': 'Nota spatium temporis requirit.',
    'ed.pastMidnight': '{dur} — mediam noctem transgreditur, itaque in duas notas ad 00:00 divisas servabitur.',

    'msg.entryAdded': 'Nota addita', 'msg.entryUpdated': 'Nota renovata',
    'msg.entryDeleted': 'Nota deleta', 'msg.splitMidnight': 'In duas notas ad mediam noctem divisas servata.',
    'msg.nameItem': 'Rem nomina.', 'msg.nameActivity': 'Actionem nomina.',
    'msg.pickDate': 'Diem elige.', 'msg.renamed': 'Nomen mutatum in «{name}»',
    'msg.added': '«{name}» addita', 'msg.deleted': '«{name}» deleta',
    'msg.restored': '{n} praescripta restituta', 'msg.presetsPresent': 'Praescripta iam adsunt',
    'msg.exported': 'Exportatum', 'msg.imported': '{n} notae importatae',
    'msg.erased': 'Codex deletus', 'msg.saveFailed': 'Servari non potuit — memoria navigatri plena aut impedita est.',
    'msg.palette': 'Colores: {name}', 'msg.language': 'Lingua: {name}',

    'ask.deleteEntry': 'Hanc notam delere?',
    'ask.deleteCategory': '«{name}» delere?',
    'ask.deleteCategoryTime': '«{name}» delere?\n\nEtiam res eius et {dur} temporis notati delebuntur. Hoc revocari non potest.',
    'ask.deleteItem': '«{name}» delere?',
    'ask.deleteItemTime': '«{name}» delere?\n\nEtiam {dur} temporis notati delebuntur. Hoc revocari non potest.',
    'ask.restore': 'Genera, res et actiones praescriptas quae desunt restituere?\n\nNihil iam notatum mutatur.',
    'ask.import': 'Omnia in codice hoc fasciculo substituere?',
    'ask.erase': 'Omnes notas, genera et optiones delere?\n\nHoc revocari non potest. Prius exporta si exemplar vis.',
    'prompt.newCategory': 'Novum genus nomina', 'prompt.newItem': 'Novam rem sub «{name}» nomina',

    'hm.glance': 'Annus {year} uno aspectu', 'hm.item': 'Cribrum', 'hm.all': 'Omnia',
    'hm.recorded': 'Notatum', 'hm.activeDays': 'Dies operosi', 'hm.avgActiveDay': 'Medium diei operosi',
    'hm.currentStreak': 'Series praesens', 'hm.longestStreak': 'Series longissima',
    'hm.less': 'Minus', 'hm.more': 'Plus', 'hm.nDays': '{n} dies', 'hm.nDays_one': '{n} dies',
    'hm.foot': 'Gradus obscurissimus est {dur} vel plus in die', 'hm.footBusy': 'operosissimus fuit {day} cum {dur}',
    'hm.clickDay': 'preme quemvis diem ut aperiatur', 'hm.nothing': 'Nihil notatum',
    'hm.monthByMonth': 'Mensis post mensem', 'hm.totalIn': 'summa notata anno {year}',
    'hm.rhythm': 'Numerus hebdomadis', 'hm.avgWeekday': 'medium per diem hebdomadis',
    'hm.gridLabel': 'Tempus studendi per diem anno {year}',

    'st.recorded': 'Notatum', 'st.perDay': 'In diem', 'st.perActiveDay': 'In diem operosum',
    'st.sessions': 'Sessiones', 'st.busiest': 'Operosissimus {bucket}',
    'st.acrossAll': 'per omnes dies {n}', 'st.acrossSoFar': 'per dies {n} adhuc actos',
    'st.ofRecorded': '{a} ex {b} diebus notati', 'st.avgSession': '{dur} medium',
    'st.noneYet': 'nondum ulla',
    'st.vsPrev': '{pct}% prae diebus {n} prioribus',
    'st.vsSame': '{pct}% prae iisdem diebus {n} spatii prioris',
    'st.vsSame_one': '{pct}% prae eodem die spatii prioris',
    'st.noCompare': 'nullum spatium prius comparabile',
    'st.hoursPer': 'Horae per {bucket}', 'st.byCategory': 'Per genus',
    'st.byItem': 'Per rem', 'st.byActivity': 'Per actionem',
    'st.nActive': '{n} operosa', 'st.topOf': 'prima {a} ex {b}',
    'st.fullFigures': 'Numeri pleni', 'st.fullFiguresNote': 'omne genus, res et actio huius spatii',
    'st.thName': 'Genus / res / actio', 'st.thTime': 'Tempus', 'st.thHours': 'Horae',
    'st.thShare': 'Pars', 'st.nothingRecorded': 'Nihil notatum.',
    'st.emptyRange': 'Nihil notatum inter {a} et {b}.',
    'st.recordSomething': 'Aliquid nota', 'st.goal': 'meta {v}',
    'st.removedItems': 'Genera deleta',

    'cat.title': 'Genera, res et actiones',
    'cat.intro': 'Genus est species operis; res est ipsa schola, opus vel liber; actio est quod fecisti. Quisque quadratus calendarii unum cuiusque habet, et longitudo eius tempus consumptum est. Omnia loco suo renominari possunt.',
    'cat.restore': 'Praescripta restituere', 'cat.newCategory': '+ Novum genus',
    'cat.newItem': '+ res', 'cat.newActivity': '+ actio',
    'cat.logged': '{dur} notata', 'cat.unused': 'inusitatum',
    'cat.itemsLabel': 'Res', 'cat.activitiesLabel': 'Actiones',
    'cat.noItems': 'Nullae adhuc res — adde scholas vel opera huc pertinentia.',
    'cat.noCategories': 'Nulla adhuc genera.',
    'cat.categoryName': 'Nomen generis', 'cat.itemName': 'Nomen rei',
    'cat.remove': '{name} removere', 'cat.colour': 'Color {n}',

    'pal.title': 'Colores', 'pal.note': 'rationes {n} · praetermitte ut videas, preme ut serves',
    'pal.intro': 'Viginti quattuor rationes colorum ex exemplari libri more Tufteano, addita ratione calida originali. Totus codex denuo tingitur — etiam colores generum et gradus tabulae.',

    'set.title': 'Optiones', 'set.language': 'Lingua',
    'set.languageHint': 'Solam interfaciem mutat. Nomina generum, rerum et actionum tua sicut scripsisti manent.',
    'set.week': 'Hebdomas', 'set.startsOn': 'Incipit die', 'set.monday': 'Lunae', 'set.sunday': 'Solis',
    'set.gridFrom': 'Cancelli ab', 'set.gridTo': 'Cancelli ad', 'set.midnight': '(media nox)',
    'set.gridHint': 'Cancelli semper ultra has horas extenduntur si nota extra cadit.',
    'set.targets': 'Metae et adhaesio', 'set.goalH': 'Meta cotidiana (h)',
    'set.peakH': 'Culmen tabulae (h)', 'set.snap': 'Adhaesio trahendi', 'set.minutes': '{n} min',
    'set.peakHint': 'Culmen est summa diurna quae gradum obscurissimum attingit.',
    'set.semesters': 'Semestria', 'set.noSemesters': 'Nulla adhuc definita.',
    'set.addSemester': '+ Semestre addere', 'set.newTerm': 'Novum semestre',
    'set.semName': 'Nomen semestris', 'set.semStart': 'Initium', 'set.semEnd': 'Finis',
    'set.data': 'Data tua',
    'set.dataBlurb': 'Omnia in memoria locali huius navigatri manent — nihil transmittitur. Exporta priusquam data loci deleas aut machinam mutes.',
    'set.export': 'JSON exportare', 'set.import': 'JSON importare', 'set.erase': 'Omnia delere',
    'set.dataNote': 'notae {a} · genera {b}',
    'set.importFailed': 'Hic fasciculus ex Codice Studiorum non est.',

    'help.title': 'Quomodo hoc operatur',
    'help.recording': 'Tempus notare',
    'help.r1': 'Trahe per partem vacuam cancellorum diei ut sessionem designes; unus ictus horam praebet.',
    'help.r2': 'Trahe quadratum ut moveatur — etiam in latus per dies. Trahe oram inferiorem ut longitudinem mutes.',
    'help.r3': 'Preme quadratum ut emendes. Sessio quae mediam noctem transit in duas notas ad 00:00 divisas servatur.',
    'help.r4': 'Quisque quadratus unum <em>genus</em>, unam <em>rem</em>, unam <em>actionem</em> habet; longitudo eius tempus consumptum est.',
    'help.keyboard': 'Claviatura',
    'help.k1': '<span class="kbd">←</span> <span class="kbd">→</span> spatium prius / sequens, <span class="kbd">T</span> hodie',
    'help.k2': '<span class="kbd">D</span> <span class="kbd">W</span> <span class="kbd">M</span> dies, hebdomas, mensis',
    'help.k3': '<span class="kbd">N</span> nova nota · <span class="kbd">1</span>–<span class="kbd">5</span> speciem mutare · <span class="kbd">Esc</span> claudere',
    'help.storage': 'Ubi servatur',
    'help.storageText': 'In hoc navigatro solo, sub <code>study-ledger-v1</code>. Nulla ratio, nullus servus. Utere <em>Optionibus → JSON exportare</em> ut exemplar serves aut transferas.',

    p: {
      courseWork: 'Opus Scholasticum', research: 'Opus Investigationis', reading: 'Lectio',
      skills: 'Artes et Linguae', other: 'Alia',
      advOptimisation: 'Optimizatio Provecta', numericalMethods: 'Methodi Numericae',
      medImageSeg: 'Divisio Imaginum Medicarum', marketPrediction: 'Praedictio Mercatus per Machinam Discentem',
      papers: 'Commentationes', books: 'Libri', aLanguage: 'Lingua Anglica', programming: 'Programmatio',
      general: 'Generale',
      lecture: 'Praelectio', notetaking: 'Adnotationes scribere', homework: 'Pensum domesticum',
      onlineCourse: 'Schola interretialis', textbook: 'Lectio libri scholastici', lab: 'Laboratorium',
      tutorial: 'Exercitatio / Colloquium', revision: 'Repetitio', examPrep: 'Praeparatio examinis',
      groupProject: 'Opus commune',
      litReview: 'Recensio litterarum', experiment: 'Experimentum / Collectio datorum',
      dataAnalysis: 'Analysis datorum', coding: 'Programmatio', paperWriting: 'Commentatio scribenda',
      supervisorMeeting: 'Colloquium cum moderatore', groupMeeting: 'Conventus gregis',
      presentationPrep: 'Praeparatio expositionis', proposal: 'Propositum scribendum', peerReview: 'Recensio parium',
      skim: 'Lectio cursoria', closeReading: 'Lectio accurata', annotation: 'Adnotationes',
      summaryWriting: 'Summarium scribendum', readingGroup: 'Circulus lectionis',
      practiceDrill: 'Exercitium', documentation: 'Documenta / Institutio',
      sideProject: 'Opus secundarium', vocabulary: 'Vocabula', listeningSpeaking: 'Audire et loqui',
      planning: 'Ordinatio et negotia', seminar: 'Seminarium / Oratio', writing: 'Scriptio', misc: 'Varia'
    }
  };

  /* ==========================================================
     Latin calendar names — Intl has no 'la' data.
     ========================================================== */

  var LA_MONTHS = ['Ianuarius', 'Februarius', 'Martius', 'Aprilis', 'Maius', 'Iunius',
                   'Iulius', 'Augustus', 'September', 'October', 'November', 'December'];
  var LA_MONTHS_SHORT = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun',
                         'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var LA_DAYS = ['dies Solis', 'dies Lunae', 'dies Martis', 'dies Mercurii',
                 'dies Iovis', 'dies Veneris', 'dies Saturni'];
  var LA_DAYS_SHORT = ['Sol', 'Lun', 'Mar', 'Mer', 'Iov', 'Ven', 'Sat'];

  /* How each locale writes a duration, and whether it uses a 12-hour clock. */
  var FORMATS = {
    'en':      { h: 'h', m: 'm', gap: ' ', pad: '',  clock12: true },
    'zh-Hans': { h: '小时', m: '分', gap: '', pad: '', clock12: false },
    'zh-Hant': { h: '小時', m: '分', gap: '', pad: '', clock12: false },
    'ja':      { h: '時間', m: '分', gap: '', pad: '', clock12: false },
    'es':      { h: 'h', m: 'min', gap: ' ', pad: ' ', clock12: false },
    'de':      { h: 'Std.', m: 'Min.', gap: ' ', pad: ' ', clock12: false },
    'fr':      { h: 'h', m: 'min', gap: ' ', pad: ' ', clock12: false },
    'la':      { h: 'h', m: 'm', gap: ' ', pad: ' ', clock12: false }
  };

  /* ==========================================================
     runtime
     ========================================================== */

  var lang = 'en';
  var intlCache = {};

  function bcp() {
    for (var i = 0; i < LOCALES.length; i++) if (LOCALES[i].id === lang) return LOCALES[i].bcp;
    return 'en';
  }

  function locale(id) {
    for (var i = 0; i < LOCALES.length; i++) if (LOCALES[i].id === id) return LOCALES[i];
    return LOCALES[0];
  }

  function has(id) {
    for (var i = 0; i < LOCALES.length; i++) if (LOCALES[i].id === id) return true;
    return false;
  }

  function set(id) {
    lang = has(id) ? id : 'en';
    intlCache = {};
    document.documentElement.setAttribute('lang', bcp());
    return lang;
  }

  function current() { return lang; }

  /** Guess a starting language from the browser, falling back to English. */
  function detect() {
    var want = (window.navigator.languages || [window.navigator.language || 'en']);
    for (var i = 0; i < want.length; i++) {
      var w = String(want[i]);
      if (/^zh\b/i.test(w)) {
        return /hant|tw|hk|mo/i.test(w) ? 'zh-Hant' : 'zh-Hans';
      }
      var base = w.split('-')[0].toLowerCase();
      if (has(base)) return base;
    }
    return 'en';
  }

  /** Look up a key, substitute {placeholders}. Falls back to English. */
  function t(key, vars) {
    var table = S[lang] || S.en;
    var s = table[key];
    if (s === undefined) s = S.en[key];
    if (s === undefined) return key;
    if (vars) {
      s = s.replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] === undefined ? m : String(vars[k]);
      });
    }
    return s;
  }

  /** t() with a `_one` variant when n is exactly 1. */
  function tn(key, n, vars) {
    var table = S[lang] || S.en;
    var one = key + '_one';
    var use = (n === 1 && (table[one] !== undefined || S.en[one] !== undefined)) ? one : key;
    vars = vars || {};
    if (vars.n === undefined) vars.n = n;
    return t(use, vars);
  }

  /** A preset name in the current language. */
  function preset(key) {
    var table = S[lang] || S.en;
    return (table.p && table.p[key]) || S.en.p[key] || key;
  }

  /* ---------- calendar names ---------- */

  function fmt(opts) {
    var k = JSON.stringify(opts);
    if (!intlCache[k]) {
      try { intlCache[k] = new Intl.DateTimeFormat(bcp(), opts); }
      catch (err) { intlCache[k] = new Intl.DateTimeFormat('en', opts); }
    }
    return intlCache[k];
  }

  function monthName(m, short) {
    if (lang === 'la') return short ? LA_MONTHS_SHORT[m] : LA_MONTHS[m];
    return fmt({ month: short ? 'short' : 'long' }).format(new Date(2021, m, 15, 12));
  }

  function dowName(d, short) {
    if (lang === 'la') return short ? LA_DAYS_SHORT[d] : LA_DAYS[d];
    // 2021-08-01 was a Sunday, so +d lands on weekday d.
    return fmt({ weekday: short ? 'short' : 'long' }).format(new Date(2021, 7, 1 + d, 12));
  }

  function clockLabel(hour) {
    var h = hour % 24;
    if (FORMATS[lang] && FORMATS[lang].clock12) {
      return (h % 12 === 0 ? 12 : h % 12) + ' ' + (h < 12 ? 'AM' : 'PM');
    }
    return (h < 10 ? '0' : '') + h + ':00';
  }

  /** '2026-08-01' -> a short, locale-appropriate day label. */
  function fmtDay(k) {
    var p = String(k).split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2], 12);
    if (lang === 'la') return LA_DAYS_SHORT[d.getDay()] + ' ' + d.getDate() + ' ' + LA_MONTHS_SHORT[d.getMonth()];
    return fmt({ weekday: 'short', day: 'numeric', month: 'short' }).format(d);
  }

  function fmtDayLong(k) {
    var p = String(k).split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2], 12);
    if (lang === 'la') {
      return LA_DAYS[d.getDay()] + ', ' + d.getDate() + ' ' + LA_MONTHS[d.getMonth()] + ' ' + d.getFullYear();
    }
    return fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  }

  /* ---------- period titles ----------
     Assembled by Intl rather than by concatenation, so the parts land in the
     order the language actually uses: "July 2", "2. Juli", "7月2日". */

  function fmtMonthDay(d) {
    if (lang === 'la') return d.getDate() + ' ' + LA_MONTHS[d.getMonth()];
    return fmt({ day: 'numeric', month: 'long' }).format(d);
  }

  function fmtMonthYear(d) {
    if (lang === 'la') return LA_MONTHS[d.getMonth()] + ' ' + d.getFullYear();
    return fmt({ month: 'long', year: 'numeric' }).format(d);
  }

  /** A compact "27 Jul – 2 Aug" that respects the locale's own range style. */
  function fmtDayRange(a, b) {
    if (lang !== 'la') {
      var f = fmt({ day: 'numeric', month: 'short' });
      if (typeof f.formatRange === 'function') {
        try { return f.formatRange(a, b); } catch (err) { /* fall through */ }
      }
      return f.format(a) + ' – ' + f.format(b);
    }
    var la = function (d) { return d.getDate() + ' ' + LA_MONTHS_SHORT[d.getMonth()]; };
    return a.getMonth() === b.getMonth()
      ? a.getDate() + '–' + la(b)
      : la(a) + ' – ' + la(b);
  }

  /** Minutes -> a duration in the current language. */
  function dur(mins) {
    var f = FORMATS[lang] || FORMATS.en;
    var m = Math.round(mins);
    if (!m) return '0' + f.pad + f.m;
    var h = Math.floor(m / 60), r = m % 60;
    if (!h) return r + f.pad + f.m;
    if (!r) return h + f.pad + f.h;
    return h + f.pad + f.h + f.gap + r + f.pad + f.m;
  }

  window.I18n = {
    LOCALES: LOCALES, PRESETS: PRESETS,
    set: set, current: current, detect: detect, locale: locale, has: has,
    t: t, tn: tn, preset: preset,
    monthName: monthName, dowName: dowName, clockLabel: clockLabel,
    fmtDay: fmtDay, fmtDayLong: fmtDayLong, dur: dur,
    fmtMonthDay: fmtMonthDay, fmtMonthYear: fmtMonthYear, fmtDayRange: fmtDayRange
  };
  window.T = t;
})(window);
