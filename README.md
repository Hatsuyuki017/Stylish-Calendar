# Study Ledger

A calendar for keeping track of where study time actually goes — a timetable you
block sessions onto, a GitHub-style year heatmap, and a time-consumption report
for any day, week, month, year or semester.

Runs two ways: as a **native macOS app** with a desktop gadget and a menu-bar
readout, or as a plain web page with no build step at all. Eight interface
languages, twenty-five colour palettes, and a typographic plan per script.

---

## Running it

### macOS app

```sh
./macos/build.sh --run
```

That compiles a universal `Study Ledger.app` into `macos/build/` and opens it —
about 900 KB, no package manager, no Xcode project. The only requirement is the
Swift toolchain that comes with Xcode or the Command Line Tools. Drag the app to
`/Applications` and it stays put.

```sh
./macos/build.sh            # build only
./macos/build.sh --test     # build, then run the headless self-test
```

The app is ad-hoc signed, which is enough to run locally. To hand it to someone
else, swap the `codesign` line in `macos/build.sh` for a Developer ID identity
and notarise it.

Data lives in `~/Library/Application Support/Study Ledger/ledger.json` — a plain
file you can back up, sync or edit. **Reveal Data File in Finder** is in the app
menu.

### In a browser

Double-click `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

A local server is the safer option: browsers scope `localStorage` per file when
a page is opened over `file://`, so serving the folder keeps your records in one
place even if you move the directory.

In the browser everything is stored under the key `study-ledger-v1`. Either way
there is no account and nothing leaves the machine. **Settings → Export JSON**
writes a backup; **Import JSON** restores one, so you can move between the app
and the browser.

---

## The model

Three levels, and the calendar is the input method for all of them:

```
Course Work                          ← category: the kind of work
  ├ Advanced Optimisation            ← item: the actual course, project or book
  │   Lecture · Notetaking · …       ← activity: what you did
  └ Numerical Methods
Research Project
  ├ Medical Image Segmentation
  └ Market Prediction with Machine Learning
Reading · Skills & Languages · Other
```

- **Category** — the kind of work. Ships with *Course Work*, *Research Project*,
  *Reading*, *Skills & Languages* and *Other*. Only categories appear at the top
  level of the **Categories** view; click one to unfold the items inside it.
- **Item** — the actual thing you spent time on: a course, a project, a book.
  Items live *inside* a category, never beside one, and are the headline on every
  calendar block, because "Advanced Optimisation" says more at a glance than
  "Lecture". An item belongs to exactly one category, and carries it around:
  choosing the item in the editor answers the category on its behalf.
- **Activity** — how the time was spent. Activities belong to the *category*, so
  every course under Course Work draws on the same vocabulary — Lecture,
  Notetaking, Homework / Problem Set, Online Course, Textbook Reading, Lab,
  Tutorial, Revision, Exam Preparation, Group Project — rather than repeating it
  under each item.
- **Entry** — one block on the calendar: one category, one item, one activity.
  Its length *is* the time consumed, so every total in the app is a sum of blocks.

All three are editable in **Categories**: rename in place, recolour, add, delete.
Choosing **+ New item…** or **Custom…** in the editor folds the new name into
that category's list, so it is one click away next time. Renaming carries
already-recorded time along with it; deleting an item deletes the time filed
under it, and says so first. A category with no items shows no items list at
all — nothing is invented to fill the gap.

### Recording an entry

The editor asks for the **item first**, listing every item you have, grouped by
its category. Picking one fills the category in and locks it, so the only thing
left to choose is the activity. The lock opens on purpose — click the padlock —
and changing the category then re-files that item, taking its whole recorded
history with it. A brand-new item leaves the category open, since it has to be
filed somewhere.

An entry is stored as a date plus start/end minutes past midnight, never as a UTC
timestamp — a session cannot drift onto the wrong day when the clocks change. A
session that runs past midnight is saved as two entries split at 00:00.

---

## The views

**Calendar** — Day, Week and Month. On the day grid: drag an empty stretch to
block out a session, click once for a default hour, drag a block to move it
(sideways across days too), drag its bottom edge to change its length, click it
to edit. The hour window follows your Settings but always widens to contain
whatever is actually recorded, so nothing is ever clipped out of sight.

**Heatmap** — one cell per day of the year in a five-step ramp of the palette's
primary hue, with streaks, a per-category filter, month totals and an average-
per-weekday breakdown. The daily total that reaches the darkest step is a
setting, not a guess about your data.

**Statistics** — headline tiles, hours per day/week/month (the bucket size
follows the range), then time **by category**, **by item** and **by activity**,
and a table three levels deep. A period still in progress is averaged and
compared over the days that have actually elapsed, so the 1st of the month does
not read as "−99%".

**Categories** — the taxonomy above, with lifetime totals on every category,
item and activity.

**Palette** — 25 colour schemes. Hover to preview the whole app, click to keep.

---

## The desktop gadget

A borderless panel that shows today against your goal, the week, what today
actually went into, and the shape of the last ten weeks. Toggle it with
**⌘G**, from the **View** menu, or from the menu-bar item.

It sits at one of two levels, switchable from the arrow in its corner or from
**View**:

- **Pin to Desktop** — among the desktop icons, behind every ordinary window.
  The classic gadget: there when you clear your screen, never in the way while
  you work. It also dims slightly, so it reads as scenery.
- **Float on Top** — above everything, for when you want the number in sight.

Drag it anywhere; it remembers where you left it and follows you across Spaces.
Resize it within limits. It wears the current palette and typographic plan, and
refreshes the moment anything is saved in the main window.

The **menu-bar item** carries today's total next to a small book glyph, in the
app's own language and duration format — `2h 30m`, `2時間30分`, `2 Std. 30 Min.`
Its menu opens the window, starts a new entry, or toggles the gadget. Closing the
main window leaves the gadget and the menu bar running.

---

## Languages

English · 简体中文 · 繁體中文 · 日本語 · Español · Deutsch · Français · Latina

Pick one in **Settings → Language**. On first run the browser's own preference is
used if it matches, otherwise English.

Changing language changes the interface only. Your category, item and activity
names are your data and are never rewritten — but the *presets* are seeded in
whatever language is active the first time the ledger runs, so starting in
Japanese gives you 講義 and 課題 rather than Lecture and Homework. **Restore
presets** adds the current language's presets to whatever you already have.

Dates, weekday and month names, clock format (12-hour in English, 24-hour
elsewhere), period titles and durations all follow the locale — `7月2日` and
`2小时15分` in Chinese, `2. Juli` and `2 Std. 15 Min.` in German. Month and
weekday names come from `Intl`; Latin, which `Intl` does not carry, has a
hand-written table in `js/i18n.js`.

To add a language: add an entry to `LOCALES`, a string table beside the others in
`S`, and a duration format in `FORMATS` — all in [js/i18n.js](js/i18n.js).
Missing keys fall back to English rather than showing a raw key.

---

## Typography

A language needs more than its words translated, so each script carries its own
set of typographic plans in **Settings → Typography**. Every plan shows a live
specimen and names the tradition it comes from; the choice is remembered *per
language*, so Japanese can sit in Mincho while English sits in Garamond.

| Script | Plans |
|---|---|
| Latin | **Ledger** (Fraunces / Spectral — the current Tufte-ish default) · **Didone** (Playfair Display / Lora, after Bodoni and Didot) · **Renaissance** (EB Garamond, after Claude Garamont's 1540s romans) · **Grotesque** (Bricolage Grotesque / Work Sans, the Akzidenz lineage) |
| 简体中文 / 繁體中文 | **宋体** (Noto Serif SC/TC — the Song woodblock tradition) · **楷体** (LXGW WenKai / system Kai — running-brush regular script) · **黑体** (Noto Sans SC/TC) · **书法** (Ma Shan Zheng headlines over a Song body) |
| 日本語 | **明朝体** (Shippori Mincho) · **ゴシック体** (Zen Kaku Gothic New) · **丸ゴシック体** (Zen Maru Gothic) · **筆書体** (Yuji Syuku headlines over Mincho) |

Each plan pairs a Latin face with a CJK one deliberately, and the stacks are
ordered so Latin glyphs always come from the Latin face — a line mixing
"Advanced Optimisation" with 高等最优化 stays in one voice. Only the faces a
plan actually uses are fetched: choosing one rewrites a single `<link>`.

To add a plan, add an entry to the relevant array in [js/fonts.js](js/fonts.js)
with its `families` (Google Fonts query fragments) and `display` / `body` /
`mono` stacks.

---

## Palettes

The 24 palettes from Thomas Shang's Tufte-Style Book Template, plus the original
warm default, ported from [26-Xi-quizbank](https://github.com/Hatsuyuki017/26-Xi-quizbank).

Switching one sets a single `data-theme` attribute on `<html>`. Each palette
declares only seven raw tokens:

```css
[data-theme="kyoto"] {
  --p-bg:  #EAE2D4;   /* paper */
  --p-ink: #222842;   /* text */
  --p-a … --p-e;      /* five category hues */
}
```

Every other colour — surfaces, hairlines, the heatmap ramp, event fills — is
derived from those seven in `css/app.css` with `color-mix()`. There are no
hard-coded hues anywhere else, so a palette can never be half-applied.

To change or add palettes, edit the `RAW` table in `tools/gen_palettes.py` and
run it; it regenerates both `css/themes.css` and `js/palettes.js`, holding each
palette's ink to 7:1 contrast on its own paper and each category hue to the 3:1
non-text floor.

```sh
python3 tools/gen_palettes.py    # writes to tools/out/, copy over css/ and js/
```

Category hues are only ever used as fills and rules, never as text: an event
block is a pale tint of its category colour with a solid bar down the left and
ink-coloured text. That is what keeps all 25 schemes legible, including the loud
ones. Every chart pairs colour with a written label for the same reason.

---

## Keyboard

| | |
|---|---|
| <kbd>←</kbd> <kbd>→</kbd> | previous / next period |
| <kbd>T</kbd> | today |
| <kbd>D</kbd> <kbd>W</kbd> <kbd>M</kbd> | day, week, month |
| <kbd>N</kbd> | new entry |
| <kbd>1</kbd>–<kbd>5</kbd> | switch view |
| <kbd>Esc</kbd> | close a dialog |

---

## Layout

```
index.html        the app
gadget.html       the desktop gadget
css/
  themes.css      25 palettes — 7 raw tokens each
  app.css         the design system, all colours derived
  gadget.css      the panel, on the same tokens
js/
  palettes.js     palette metadata for the picker
  i18n.js         8 locales, preset names, date & duration formats
  fonts.js        typographic plans per script
  util.js         dates, durations, DOM helpers
  store.js        data model, localStorage, aggregation
  theme.js        palette preview / apply / persist
  calendar.js     timetable + month grid, drag interactions
  heatmap.js      year grid, streaks, rhythm panels
  stats.js        tiles, trend, category/item/activity bars, table
  categories.js   categories, items & activities
  gadget.js       the desktop panel
  app.js          routing, top bar, entry editor, settings
macos/
  Sources/        Swift: app delegate, web host, gadget panel, data file
  build.sh        swiftc + a hand-laid bundle -> Study Ledger.app
  make-icon.py    draws the icon with no image libraries
tools/
  gen_palettes.py regenerates themes.css and palettes.js
```

Plain scripts loaded in order — no modules, so it works from `file://` too.

The macOS app is the same web app in a `WKWebView`, served over a `ledger://`
scheme from inside the bundle. The one thing that differs is storage: in a
browser `js/store.js` uses `localStorage`; under the app it talks to
`window.LedgerNative`, and Swift owns the JSON file. That is what lets the
gadget, the menu bar and the main window all read the same numbers.

### Testing

```sh
./macos/build.sh --test     # 17 native checks: bridge, round-trip to disk, gadget
```

The web layer is covered by a jsdom suite (131 checks — aggregation maths,
midnight splits, the item/category lock, migrations, all eight locales) and a
Playwright suite (83 checks — real drag-to-create, drag-to-move, every view in
every language, no overflow at 430 px).

---

## Settings

Interface language, typographic plan, week start, the hour window the grid opens
on, drag snapping
(5/10/15/30 min), a daily goal, the heatmap's saturation point, and your semester
dates. Semesters are a hand-kept list; the Statistics view's **Semester** scope
reads from it and the ‹ › arrows walk through it.

---

## Upgrading from an earlier export

An export made before items existed (`"v": 1`) imports fine. Each category that
actually holds entries gains one item named after the category itself, and those
entries are filed under it — no recorded time is lost or orphaned, and no
placeholder is invented for categories that were empty anyway. Rename that item
or split it up as you like.
