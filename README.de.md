# Studienbuch · Study Ledger

[English](README.md) · [简体中文](README.zh-Hans.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [Français](README.fr.md) · **Deutsch**

Ein Kalender, um festzuhalten, wohin die Lernzeit tatsächlich geht: ein Stundenplan,
auf dem man Einheiten blockt, eine Jahres-Heatmap im Stil von GitHub und eine
Auswertung des Zeitverbrauchs für jeden Tag, jede Woche, jeden Monat, jedes Jahr
oder Semester.

Läuft auf zwei Arten: als **native macOS-App** mit Schreibtisch-Widget und einer
Anzeige in der Menüleiste, oder als schlichte Webseite ganz ohne Build-Schritt.
Acht Oberflächensprachen, fünfundzwanzig Farbschemata und ein typografischer Plan
je Schrift.

---

## Starten

### macOS-App

```sh
./macos/build.sh --run
```

Das baut ein universelles `Study Ledger.app` nach `macos/build/` und öffnet es —
rund 900 KB, ohne Paketmanager und ohne Xcode-Projekt. Vorausgesetzt wird allein
die Swift-Toolchain, die mit Xcode oder den Command Line Tools kommt. Zieh die App
nach `/Applications`, dort bleibt sie.

```sh
./macos/build.sh            # nur bauen
./macos/build.sh --test     # bauen, dann den Selbsttest ohne Fenster laufen lassen
```

Die App ist ad-hoc signiert, was zum lokalen Ausführen genügt. Um sie
weiterzugeben, ersetze die `codesign`-Zeile in `macos/build.sh` durch eine
Developer-ID-Identität und lass sie notarisieren.

Die Daten liegen in `~/Library/Application Support/Study Ledger/ledger.json` —
eine schlichte Datei, die sich sichern, synchronisieren und bearbeiten lässt.
**Datendatei im Finder zeigen** steht im App-Menü.

### Im Browser

`index.html` doppelklicken, oder den Ordner ausliefern:

```sh
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

Ein lokaler Server ist die sicherere Wahl: Browser trennen den `localStorage` pro
Datei, wenn eine Seite über `file://` geöffnet wird; ausgeliefert bleiben die
Aufzeichnungen an einem Ort, auch wenn du das Verzeichnis verschiebst.

Im Browser liegt alles unter dem Schlüssel `study-ledger-v1`. So oder so gibt es
kein Konto, und nichts verlässt den Rechner. **Einstellungen → JSON exportieren**
schreibt eine Sicherung, **JSON importieren** spielt sie zurück — damit kommst du
zwischen App und Browser hin und her.

---

## Das Modell

Drei Ebenen, und der Kalender ist die Eingabe für alle drei:

```
Lehrveranstaltungen                   ← Kategorie: die Art der Arbeit
  ├ Höhere Optimierung                ← Gegenstand: die konkrete Veranstaltung, das Projekt, das Buch
  │   Vorlesung · Mitschrift · …      ← Tätigkeit: was du getan hast
  └ Numerische Methoden
Forschungsprojekt
  ├ Medizinische Bildsegmentierung
  └ Marktprognose mit maschinellem Lernen
Lektüre · Fertigkeiten & Sprachen · Sonstiges
```

- **Kategorie** — die Art der Arbeit. Mitgeliefert werden *Lehrveranstaltungen*,
  *Forschungsprojekt*, *Lektüre*, *Fertigkeiten & Sprachen* und *Sonstiges*. In der
  Ansicht **Kategorien** stehen nur Kategorien auf der obersten Ebene; ein Klick
  klappt die Gegenstände darin auf.
- **Gegenstand** — das, wofür die Zeit tatsächlich draufging: eine Veranstaltung,
  ein Projekt, ein Buch. Gegenstände leben *innerhalb* einer Kategorie, nie daneben,
  und bilden die Überschrift jedes Kalenderblocks — „Höhere Optimierung“ sagt auf
  einen Blick mehr als „Vorlesung“. Ein Gegenstand gehört zu genau einer Kategorie
  und trägt sie mit sich: Wer im Editor den Gegenstand wählt, hat die Kategorie
  damit schon beantwortet.
- **Tätigkeit** — wie die Zeit verbracht wurde. Tätigkeiten gehören zur *Kategorie*,
  sodass jede Veranstaltung unter Lehrveranstaltungen aus demselben Wortschatz
  schöpft — Vorlesung, Mitschrift, Übungsblatt, Onlinekurs, Lehrbuchlektüre,
  Praktikum, Tutorium, Wiederholung, Prüfungsvorbereitung, Gruppenarbeit — statt
  ihn unter jedem Gegenstand zu wiederholen.
- **Eintrag** — ein Block im Kalender: eine Kategorie, ein Gegenstand, eine
  Tätigkeit. Seine Länge *ist* die verbrauchte Zeit, sodass jede Summe in der App
  nichts als eine Summe von Blöcken ist.

Alle drei lassen sich unter **Kategorien** bearbeiten: an Ort und Stelle umbenennen,
umfärben, hinzufügen, löschen. Wählt man im Editor **+ Neuer Gegenstand …** oder
**Eigene …**, wandert der neue Name in die Liste der Kategorie und ist beim nächsten
Mal einen Klick entfernt. Umbenennen nimmt die bereits erfasste Zeit mit; einen
Gegenstand zu löschen löscht auch die darunter abgelegte Zeit — und sagt das vorher.
Eine Kategorie ohne Gegenstände zeigt gar keine Gegenstandsliste; es wird nichts
erfunden, um die Lücke zu füllen.

### Einen Eintrag erfassen

Der Editor fragt **zuerst nach dem Gegenstand** und listet alle vorhandenen,
gruppiert nach ihrer Kategorie. Einen davon zu wählen füllt die Kategorie aus und
sperrt sie, sodass nur noch die Tätigkeit zu wählen bleibt. Die Sperre öffnet man
absichtlich — mit einem Klick auf das Schloss — und wer dann die Kategorie ändert,
hängt diesen Gegenstand samt seiner ganzen erfassten Geschichte um. Ein ganz neuer
Gegenstand lässt die Kategorie offen, denn irgendwo muss er ja hin.

Ein Eintrag wird als Datum plus Start- und Endminuten nach Mitternacht gespeichert,
nie als UTC-Zeitstempel — eine Einheit kann also bei einer Zeitumstellung nicht auf
den falschen Tag rutschen. Eine Einheit über Mitternacht wird als zwei Einträge
gespeichert, getrennt um 00:00.

---

## Die Ansichten

**Kalender** — Tag, Woche und Monat. Im Tagesraster: über eine freie Strecke ziehen,
um eine Einheit zu blocken; ein Klick ergibt die voreingestellte Stunde; einen Block
ziehen verschiebt ihn (auch seitlich über Tage hinweg); an der Unterkante ziehen
ändert die Dauer; ein Klick öffnet ihn zum Bearbeiten. Das Stundenfenster folgt
deinen Einstellungen, weitet sich aber stets so, dass alles Erfasste hineinpasst —
nichts wird je aus dem Blick geschnitten.

**Heatmap** — ein Feld pro Tag des Jahres, in fünf Stufen des Hauptfarbtons der
Palette, dazu Serien, ein Filter nach Kategorie, Monatssummen und ein Durchschnitt
je Wochentag. Welche Tagessumme die dunkelste Stufe erreicht, ist eine Einstellung
und keine Vermutung über deine Daten.

**Statistik** — die Kennzahlen oben, Stunden pro Tag/Woche/Monat (die Körnung folgt
dem Zeitraum), dann die Zeit **nach Kategorie**, **nach Gegenstand** und **nach
Tätigkeit**, sowie eine Tabelle über drei Ebenen. Ein noch laufender Zeitraum wird
über die tatsächlich vergangenen Tage gemittelt und verglichen, damit der Monatserste
nicht als „−99 %“ dasteht.

**Kategorien** — die obige Systematik, mit den Gesamtzeiten jeder Kategorie, jedes
Gegenstands und jeder Tätigkeit.

**Farbschema** — 25 Schemata. Zum Vorschauen der ganzen App darüberfahren, zum
Übernehmen klicken.

---

## Das Schreibtisch-Widget

Ein randloses Panel, das den heutigen Stand gegenüber deinem Ziel zeigt, die Woche,
worin der Tag tatsächlich geflossen ist und die Form der letzten zehn Wochen.
Umschalten mit **⌘G**, über das Menü **Darstellung** oder über die Menüleiste.

Es sitzt auf einer von zwei Ebenen, umschaltbar über den Pfeil in seiner Ecke oder
über **Darstellung**:

- **Am Schreibtisch anheften** — zwischen den Schreibtischsymbolen, hinter jedem
  gewöhnlichen Fenster. Das klassische Widget: da, wenn du den Bildschirm frei
  räumst, und nie im Weg, während du arbeitest. Es tritt zudem etwas zurück und
  liest sich als Kulisse.
- **Immer im Vordergrund** — über allem, wenn du die Zahl im Blick behalten willst.

Zieh es, wohin du magst; es merkt sich, wo du es abgestellt hast, und folgt dir über
Spaces hinweg. Innerhalb gewisser Grenzen lässt es sich in der Größe ändern. Es trägt
das aktuelle Farbschema und den aktuellen typografischen Plan und frischt sich in
dem Moment auf, in dem im Hauptfenster irgendetwas gesichert wird.

Der **Menüleisteneintrag** trägt die Tagessumme neben einem kleinen Buchzeichen, in
der Sprache und im Zeitformat der App — `2h 30m`, `2時間30分`, `2 Std. 30 Min.` Sein
Menü öffnet das Fenster, beginnt einen Eintrag oder schaltet das Widget um. Schließt
man das Hauptfenster, laufen Widget und Menüleiste weiter.

---

## Sprachen

English · 简体中文 · 繁體中文 · 日本語 · Español · Deutsch · Français · Latina

Auszuwählen unter **Einstellungen → Sprache**. Beim ersten Start wird die
Browsereinstellung übernommen, sofern sie passt, sonst Englisch.

Ein Sprachwechsel ändert nur die Oberfläche. Deine Namen für Kategorien, Gegenstände
und Tätigkeiten sind deine Daten und werden nie überschrieben — die *Vorgaben*
hingegen werden in der Sprache angelegt, die beim allerersten Start aktiv ist. Wer
auf Japanisch beginnt, bekommt also 講義 und 課題 statt Lecture und Homework.
**Vorgaben wiederherstellen** ergänzt die Vorgaben der aktuellen Sprache um das, was
schon da ist.

Datumsangaben, Wochentags- und Monatsnamen, das Uhrzeitformat (12 Stunden im
Englischen, sonst 24), Zeitraumtitel und Dauern folgen alle der Sprache — `7月2日`
und `2小时15分` im Chinesischen, `2. Juli` und `2 Std. 15 Min.` im Deutschen. Monats-
und Wochentagsnamen kommen von `Intl`; für Latein, das `Intl` nicht führt, liegt in
`js/i18n.js` eine handgeschriebene Tabelle.

Eine Sprache hinzufügen: ein Eintrag in `LOCALES`, eine Zeichenkettentabelle neben
den anderen in `S` und ein Dauerformat in `FORMATS` — alles in
[js/i18n.js](js/i18n.js). Fehlende Schlüssel fallen auf Englisch zurück, statt einen
rohen Schlüssel anzuzeigen.

---

## Typografie

Eine Sprache braucht mehr als übersetzte Wörter, deshalb bringt jede Schrift unter
**Einstellungen → Typografie** ihren eigenen Satz typografischer Pläne mit. Jeder
Plan zeigt ein lebendes Schriftmuster und nennt die Tradition, aus der er kommt; die
Wahl wird *je Sprache* gemerkt, sodass Japanisch in Mincho sitzen kann, während
Englisch in Garamond sitzt.

| Schrift | Pläne |
|---|---|
| Lateinisch | **Ledger** (Fraunces / Spectral — die derzeitige Voreinstellung im Geiste Tuftes) · **Didone** (Playfair Display / Lora, nach Bodoni und Didot) · **Renaissance** (EB Garamond, nach Claude Garamonts Antiqua der 1540er) · **Grotesque** (Bricolage Grotesque / Work Sans, die Linie der Akzidenz-Grotesk) |
| 简体中文 / 繁體中文 | **宋体** (Noto Serif SC/TC — die Holzschnitttradition der Song) · **楷体** (LXGW WenKai / System-Kai — die Regelschrift des laufenden Pinsels) · **黑体** (Noto Sans SC/TC) · **书法** (Überschriften in Ma Shan Zheng über einem Song-Textkörper) |
| 日本語 | **明朝体** (Shippori Mincho) · **ゴシック体** (Zen Kaku Gothic New) · **丸ゴシック体** (Zen Maru Gothic) · **筆書体** (Überschriften in Yuji Syuku über Mincho) |

Jeder Plan paart bewusst eine lateinische mit einer CJK-Schrift, und die Stapel sind
so geordnet, dass lateinische Glyphen immer aus der lateinischen Schrift kommen —
eine Zeile, die „Advanced Optimisation“ mit 高等最优化 mischt, bleibt in einer
Stimme. Geladen werden nur die Schriften, die ein Plan wirklich braucht: einen
auszuwählen schreibt genau ein `<link>` um.

Um einen Plan zu ergänzen, füge dem passenden Array in
[js/fonts.js](js/fonts.js) einen Eintrag hinzu, mit seinen `families`
(Google-Fonts-Abfragefragmente) und den Stapeln `display` / `body` / `mono`.

---

## Farbschemata

Die 24 Paletten aus Thomas Shangs Buchvorlage im Tufte-Stil, dazu das ursprüngliche
warme Schema, übernommen aus
[26-Xi-quizbank](https://github.com/Hatsuyuki017/26-Xi-quizbank).

Ein Wechsel setzt genau ein `data-theme`-Attribut auf `<html>`. Jede Palette
deklariert nur sieben rohe Tokens:

```css
[data-theme="kyoto"] {
  --p-bg:  #EAE2D4;   /* Papier */
  --p-ink: #222842;   /* Text */
  --p-a … --p-e;      /* fünf Kategoriefarben */
}
```

Jede andere Farbe — Flächen, Haarlinien, die Heatmap-Skala, die Füllung der Blöcke —
wird in `css/app.css` mit `color-mix()` aus diesen sieben abgeleitet. Nirgends sonst
steht ein fest verdrahteter Farbwert, ein Schema kann also nie halb greifen.

Um Paletten zu ändern oder zu ergänzen, bearbeite die `RAW`-Tabelle in
`tools/gen_palettes.py` und führe es aus; es erzeugt `css/themes.css` und
`js/palettes.js` neu und hält dabei die Tinte jeder Palette auf 7:1 Kontrast zum
eigenen Papier und jede Kategoriefarbe auf der 3:1-Grenze für Nicht-Text.

```sh
python3 tools/gen_palettes.py    # schreibt nach tools/out/, dann nach css/ und js/ kopieren
```

Kategoriefarben dienen ausschließlich als Flächen und Linien, nie als Text: ein Block
ist eine blasse Tönung seiner Kategoriefarbe mit einem satten Balken links und Text
in Tinte. Genau das hält alle 25 Schemata lesbar, auch die lauten. Jedes Diagramm
stellt der Farbe aus demselben Grund eine geschriebene Beschriftung zur Seite.

---

## Tastatur

| | |
|---|---|
| <kbd>←</kbd> <kbd>→</kbd> | voriger / nächster Zeitraum |
| <kbd>T</kbd> | heute |
| <kbd>D</kbd> <kbd>W</kbd> <kbd>M</kbd> | Tag, Woche, Monat |
| <kbd>N</kbd> | neuer Eintrag |
| <kbd>1</kbd>–<kbd>5</kbd> | Ansicht wechseln |
| <kbd>Esc</kbd> | Dialog schließen |

---

## Aufbau

```
index.html        die App
gadget.html       das Schreibtisch-Widget
css/
  themes.css      25 Paletten — je 7 rohe Tokens
  app.css         das Designsystem, alle Farben abgeleitet
  gadget.css      das Panel, auf denselben Tokens
js/
  palettes.js     Palettendaten für die Auswahl
  i18n.js         8 Sprachen, Vorgabenamen, Datums- und Dauerformate
  fonts.js        typografische Pläne je Schrift
  util.js         Datum, Dauer, DOM-Helfer
  store.js        Datenmodell, localStorage, Auswertung
  theme.js        Palette vorschauen / anwenden / sichern
  calendar.js     Stundenplan + Monatsraster, Ziehen
  heatmap.js      Jahresraster, Serien, Rhythmus-Panels
  stats.js        Kacheln, Verlauf, Balken für Kategorie/Gegenstand/Tätigkeit, Tabelle
  categories.js   Kategorien, Gegenstände und Tätigkeiten
  gadget.js       das Schreibtisch-Panel
  app.js          Routing, Kopfleiste, Eintragseditor, Einstellungen
macos/
  Sources/        Swift: App-Delegate, Web-Host, Widget-Panel, Datendatei
  build.sh        swiftc + ein von Hand gelegtes Bundle -> Study Ledger.app
  make-icon.py    zeichnet das Symbol ohne jede Bildbibliothek
tools/
  gen_palettes.py erzeugt themes.css und palettes.js neu
```

Gewöhnliche Skripte, der Reihe nach geladen — keine Module, also läuft es auch über
`file://`.

Die macOS-App ist dieselbe Web-App in einem `WKWebView`, über ein `ledger://`-Schema
aus dem Bundle heraus ausgeliefert. Der einzige Unterschied ist die Ablage: im
Browser nutzt `js/store.js` den `localStorage`; unter der App spricht es mit
`window.LedgerNative`, und Swift besitzt die JSON-Datei. Genau das lässt Widget,
Menüleiste und Hauptfenster dieselben Zahlen lesen.

### Tests

```sh
./macos/build.sh --test     # 17 native Prüfungen: Brücke, Hin und Zurück auf die Platte, Widget
```

Die Web-Schicht deckt eine jsdom-Suite ab (131 Prüfungen — Rechnen der Summen,
Trennung um Mitternacht, die Sperre Gegenstand/Kategorie, Migrationen, alle acht
Sprachen) sowie eine Playwright-Suite (83 Prüfungen — echtes Ziehen zum Anlegen und
Verschieben, jede Ansicht in jeder Sprache, kein Überlauf bei 430 px).

---

## Einstellungen

Oberflächensprache, typografischer Plan, Wochenbeginn, das Stundenfenster, mit dem
das Raster öffnet, das Einrasten beim Ziehen (5/10/15/30 Min.), ein Tagesziel, der
Sättigungspunkt der Heatmap und deine Semesterdaten. Semester sind eine von Hand
geführte Liste; der Bereich **Semester** der Statistik liest daraus, und die Pfeile
‹ › laufen hindurch.

---

## Umstieg von einem älteren Export

Ein Export aus der Zeit vor den Gegenständen (`"v": 1`) lässt sich problemlos
einlesen. Jede Kategorie, die tatsächlich Einträge trägt, bekommt einen Gegenstand,
der nach der Kategorie selbst benannt ist, und diese Einträge werden darunter
abgelegt — keine erfasste Zeit geht verloren oder verwaist, und für Kategorien, die
ohnehin leer waren, wird kein Platzhalter erfunden. Diesen Gegenstand kannst du
danach umbenennen oder aufteilen, wie du magst.
