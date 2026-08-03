# Registre d’Étude · Study Ledger

[English](README.md) · [简体中文](README.zh-Hans.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · **Français** · [Deutsch](README.de.md)

Un calendrier pour savoir où passe réellement le temps d’étude : un emploi du temps
sur lequel on bloque ses séances, une carte de chaleur annuelle à la manière de
GitHub, et un relevé de temps consommé pour n’importe quel jour, semaine, mois,
année ou semestre.

Il tourne de deux façons : comme **application macOS native**, avec un widget de
bureau et un affichage dans la barre des menus, ou comme simple page web sans la
moindre étape de compilation. Huit langues d’interface, vingt-cinq palettes, et
un plan typographique par écriture.

---

## Le lancer

### Application macOS

```sh
./macos/build.sh --run
```

Cela compile un `Study Ledger.app` universel dans `macos/build/` et l’ouvre —
environ 900 Ko, sans gestionnaire de paquets ni projet Xcode. La seule exigence
est la chaîne d’outils Swift livrée avec Xcode ou les Command Line Tools. Glissez
l’application dans `/Applications` et elle y restera.

```sh
./macos/build.sh            # compiler seulement
./macos/build.sh --test     # compiler, puis lancer l’auto-test sans interface
```

L’application est signée en ad hoc, ce qui suffit pour l’exécuter sur sa propre
machine. Pour la remettre à quelqu’un d’autre, remplacez la ligne `codesign` de
`macos/build.sh` par une identité Developer ID et faites-la notariser.

Les données vivent dans `~/Library/Application Support/Study Ledger/ledger.json` —
un simple fichier que vous pouvez sauvegarder, synchroniser ou modifier.
**Afficher le fichier de données dans le Finder** se trouve dans le menu de
l’application.

### Dans un navigateur

Double-cliquez sur `index.html`, ou servez le dossier :

```sh
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

Un serveur local est le choix le plus sûr : les navigateurs cloisonnent le
`localStorage` par fichier lorsqu’une page est ouverte en `file://`, alors que
servir le dossier garde vos relevés au même endroit même si vous déplacez le
répertoire.

Dans le navigateur, tout est stocké sous la clé `study-ledger-v1`. Dans les deux
cas il n’y a pas de compte et rien ne quitte la machine. **Réglages → Exporter en
JSON** écrit une sauvegarde ; **Importer du JSON** la restaure, ce qui permet de
passer de l’application au navigateur et inversement.

---

## Le modèle

Trois niveaux, et le calendrier est le moyen de saisie de tous les trois :

```
Travail de cours                      ← catégorie : le genre de travail
  ├ Optimisation avancée              ← élément : le cours, projet ou livre concret
  │   Cours magistral · Prise de notes · …   ← activité : ce que vous avez fait
  └ Méthodes numériques
Projet de recherche
  ├ Segmentation d’images médicales
  └ Prévision de marché par apprentissage automatique
Lecture · Compétences et langues · Autre
```

- **Catégorie** — le genre de travail. Livrée avec *Travail de cours*, *Projet de
  recherche*, *Lecture*, *Compétences et langues* et *Autre*. Seules les catégories
  apparaissent au premier niveau de la vue **Catégories** ; cliquez sur l’une
  d’elles pour déplier les éléments qu’elle contient.
- **Élément** — la chose à laquelle vous avez consacré du temps : un cours, un
  projet, un livre. Les éléments vivent *à l’intérieur* d’une catégorie, jamais à
  côté, et servent de titre à chaque bloc du calendrier, parce qu’« Optimisation
  avancée » en dit plus d’un coup d’œil que « Cours magistral ». Un élément
  appartient à exactement une catégorie et l’emporte avec lui : choisir l’élément
  dans l’éditeur répond à la question de la catégorie.
- **Activité** — la manière dont le temps a été employé. Les activités appartiennent
  à la *catégorie*, si bien que tous les cours sous Travail de cours puisent dans le
  même vocabulaire — Cours magistral, Prise de notes, Devoirs / exercices, Cours en
  ligne, Lecture du manuel, TP, TD, Révision, Préparation d’examen, Projet de
  groupe — plutôt que de le répéter sous chaque élément.
- **Entrée** — un bloc sur le calendrier : une catégorie, un élément, une activité.
  Sa longueur *est* le temps consommé, si bien que chaque total de l’application
  n’est qu’une somme de blocs.

Les trois se modifient dans **Catégories** : renommer sur place, recolorer, ajouter,
supprimer. Choisir **+ Nouvel élément…** ou **Personnalisé…** dans l’éditeur verse
le nouveau nom dans la liste de la catégorie, à un clic la fois suivante. Renommer
emporte le temps déjà enregistré ; supprimer un élément supprime le temps classé
dessous, et le dit d’abord. Une catégorie sans élément n’affiche aucune liste
d’éléments — rien n’est inventé pour combler le vide.

### Consigner une entrée

L’éditeur demande **l’élément d’abord**, en listant tous vos éléments regroupés par
catégorie. En choisir un remplit la catégorie et la verrouille, si bien qu’il ne
reste qu’à choisir l’activité. Le verrou s’ouvre à dessein — cliquez sur le
cadenas — et changer alors de catégorie reclasse cet élément en emportant tout son
historique. Un élément tout neuf laisse la catégorie ouverte, puisqu’il faut bien
le ranger quelque part.

Une entrée est stockée comme une date plus des minutes de début et de fin après
minuit, jamais comme un horodatage UTC : une séance ne peut donc pas glisser sur le
mauvais jour lors d’un changement d’heure. Une séance qui dépasse minuit est
enregistrée en deux entrées séparées à 00:00.

---

## Les vues

**Calendrier** — Jour, Semaine et Mois. Sur la grille du jour : glissez sur une
plage vide pour réserver une séance, un simple clic donne une heure par défaut,
glissez un bloc pour le déplacer (latéralement d’un jour à l’autre aussi), glissez
son bord inférieur pour changer sa durée, cliquez dessus pour le modifier. La plage
horaire suit vos Réglages mais s’élargit toujours pour contenir ce qui est
réellement consigné : rien n’est jamais coupé hors de vue.

**Carte de chaleur** — une case par jour de l’année, sur une échelle à cinq degrés
de la teinte principale de la palette, avec les séries, un filtre par catégorie, les
totaux mensuels et une moyenne par jour de la semaine. Le total quotidien qui atteint
le degré le plus foncé est un réglage, pas une supposition sur vos données.

**Statistiques** — les nombres en tête, les heures par jour / semaine / mois (la
granularité suit la période), puis le temps **par catégorie**, **par élément** et
**par activité**, et un tableau à trois niveaux. Une période encore en cours est
moyennée et comparée sur les jours réellement écoulés : le 1er du mois ne se lit
donc pas « −99 % ».

**Catégories** — la taxonomie ci-dessus, avec les totaux cumulés de chaque
catégorie, élément et activité.

**Palette** — 25 jeux de couleurs. Survolez pour prévisualiser toute l’application,
cliquez pour garder.

---

## Le widget de bureau

Un panneau sans cadre qui montre la journée face à votre objectif, la semaine, ce à
quoi la journée est réellement passée, et la forme des dix dernières semaines.
Basculez-le avec **⌘G**, depuis le menu **Présentation**, ou depuis l’élément de la
barre des menus.

Il se place à l’un de deux niveaux, commutables depuis la flèche dans son coin ou
depuis **Présentation** :

- **Fixer au bureau** — parmi les icônes du bureau, derrière chaque fenêtre
  ordinaire. Le widget classique : présent quand vous dégagez l’écran, jamais dans
  vos jambes pendant le travail. Il s’estompe légèrement, pour se lire comme du
  décor.
- **Garder au premier plan** — au-dessus de tout, quand vous voulez le chiffre sous
  les yeux.

Glissez-le où vous voulez ; il retient l’endroit où vous l’avez laissé et vous suit
d’un Espace à l’autre. Redimensionnable entre certaines bornes. Il porte la palette
et le plan typographique courants, et se rafraîchit dès que quoi que ce soit est
enregistré dans la fenêtre principale.

L’**élément de la barre des menus** porte le total du jour à côté d’un petit livre,
dans la langue et le format de durée de l’application — `2h 30m`, `2時間30分`,
`2 Std. 30 Min.` Son menu ouvre la fenêtre, commence une entrée ou bascule le
widget. Fermer la fenêtre principale laisse tourner le widget et la barre des menus.

---

## Langues

English · 简体中文 · 繁體中文 · 日本語 · Español · Deutsch · Français · Latina

Choisissez dans **Réglages → Langue**. Au premier lancement, la préférence du
navigateur est utilisée si elle correspond, sinon l’anglais.

Changer de langue ne change que l’interface. Vos noms de catégories, d’éléments et
d’activités sont vos données et ne sont jamais réécrits — mais les *préréglages*
sont semés dans la langue active au tout premier lancement, si bien que commencer
en japonais donne 講義 et 課題 plutôt que Lecture et Homework. **Rétablir les
préréglages** ajoute ceux de la langue courante à ce que vous avez déjà.

Les dates, les noms de jours et de mois, le format horaire (12 heures en anglais,
24 ailleurs), les titres de période et les durées suivent tous la langue — `7月2日`
et `2小时15分` en chinois, `2. Juli` et `2 Std. 15 Min.` en allemand. Les noms de
mois et de jours viennent d’`Intl` ; le latin, qu’`Intl` ne porte pas, a une table
écrite à la main dans `js/i18n.js`.

Pour ajouter une langue : une entrée dans `LOCALES`, une table de chaînes à côté des
autres dans `S`, et un format de durée dans `FORMATS` — le tout dans
[js/i18n.js](js/i18n.js). Les clés manquantes retombent sur l’anglais plutôt que
d’afficher une clé brute.

---

## Typographie

Une langue a besoin de plus que la traduction de ses mots : chaque écriture porte
donc son propre jeu de plans typographiques dans **Réglages → Typographie**. Chaque
plan montre un spécimen vivant et nomme la tradition dont il vient ; le choix est
mémorisé *par langue*, si bien que le japonais peut s’installer en Mincho pendant
que l’anglais s’installe en Garamond.

| Écriture | Plans |
|---|---|
| Latine | **Ledger** (Fraunces / Spectral — le défaut actuel, d’esprit Tufte) · **Didone** (Playfair Display / Lora, d’après Bodoni et Didot) · **Renaissance** (EB Garamond, d’après les romains de Claude Garamont des années 1540) · **Grotesque** (Bricolage Grotesque / Work Sans, la lignée Akzidenz) |
| 简体中文 / 繁體中文 | **宋体** (Noto Serif SC/TC — la tradition xylographique des Song) · **楷体** (LXGW WenKai / Kai système — l’écriture régulière au pinceau courant) · **黑体** (Noto Sans SC/TC) · **书法** (titres en Ma Shan Zheng sur un corps en Song) |
| 日本語 | **明朝体** (Shippori Mincho) · **ゴシック体** (Zen Kaku Gothic New) · **丸ゴシック体** (Zen Maru Gothic) · **筆書体** (titres en Yuji Syuku sur un corps en Mincho) |

Chaque plan apparie délibérément un caractère latin et un caractère CJK, et les
piles sont ordonnées pour que les glyphes latins viennent toujours du caractère
latin — une ligne mêlant « Advanced Optimisation » et 高等最优化 garde une seule
voix. Seuls les caractères qu’un plan utilise vraiment sont chargés : en choisir un
ne réécrit qu’un unique `<link>`.

Pour ajouter un plan, ajoutez une entrée au tableau correspondant dans
[js/fonts.js](js/fonts.js), avec ses `families` (fragments de requête Google Fonts)
et ses piles `display` / `body` / `mono`.

---

## Palettes

Les 24 palettes du gabarit de livre à la Tufte de Thomas Shang, plus le chaud
d’origine, portées depuis
[26-Xi-quizbank](https://github.com/Hatsuyuki017/26-Xi-quizbank).

En changer pose un unique attribut `data-theme` sur `<html>`. Chaque palette ne
déclare que sept jetons bruts :

```css
[data-theme="kyoto"] {
  --p-bg:  #EAE2D4;   /* papier */
  --p-ink: #222842;   /* texte */
  --p-a … --p-e;      /* cinq teintes de catégorie */
}
```

Toutes les autres couleurs — les fonds, les filets, l’échelle de la carte de chaleur,
le remplissage des blocs — en dérivent dans `css/app.css` par `color-mix()`. Aucune
teinte n’est écrite en dur ailleurs, si bien qu’une palette ne peut jamais
s’appliquer à moitié.

Pour modifier ou ajouter des palettes, éditez la table `RAW` de
`tools/gen_palettes.py` et exécutez-le ; il régénère `css/themes.css` et
`js/palettes.js`, en tenant l’encre de chaque palette à 7:1 de contraste sur son
propre papier et chaque teinte de catégorie au plancher de 3:1 hors texte.

```sh
python3 tools/gen_palettes.py    # écrit dans tools/out/, à recopier dans css/ et js/
```

Les teintes de catégorie ne servent jamais que de remplissages et de filets, jamais
de texte : un bloc est une teinte pâle de sa couleur de catégorie, avec une barre
pleine à gauche et un texte à l’encre. C’est ce qui garde les 25 jeux lisibles, y
compris les plus bruyants. Chaque graphique associe la couleur à une étiquette
écrite pour la même raison.

---

## Clavier

| | |
|---|---|
| <kbd>←</kbd> <kbd>→</kbd> | période précédente / suivante |
| <kbd>T</kbd> | aujourd’hui |
| <kbd>D</kbd> <kbd>W</kbd> <kbd>M</kbd> | jour, semaine, mois |
| <kbd>N</kbd> | nouvelle entrée |
| <kbd>1</kbd>–<kbd>5</kbd> | changer de vue |
| <kbd>Esc</kbd> | fermer une boîte de dialogue |

---

## Organisation

```
index.html        l’application
gadget.html       le widget de bureau
css/
  themes.css      25 palettes — 7 jetons bruts chacune
  app.css         le système de design, toutes couleurs dérivées
  gadget.css      le panneau, sur les mêmes jetons
js/
  palettes.js     métadonnées de palette pour le sélecteur
  i18n.js         8 langues, noms des préréglages, formats de date et de durée
  fonts.js        plans typographiques par écriture
  util.js         dates, durées, aides DOM
  store.js        modèle de données, localStorage, agrégation
  theme.js        aperçu / application / persistance des palettes
  calendar.js     emploi du temps + grille mensuelle, interactions de glisser
  heatmap.js      grille annuelle, séries, panneaux de rythme
  stats.js        tuiles, tendance, barres catégorie/élément/activité, tableau
  categories.js   catégories, éléments et activités
  gadget.js       le panneau de bureau
  app.js          routage, barre supérieure, éditeur d’entrée, réglages
macos/
  Sources/        Swift : délégué d’app, hôte web, panneau du widget, fichier de données
  build.sh        swiftc + un bundle assemblé à la main -> Study Ledger.app
  make-icon.py    dessine l’icône sans aucune bibliothèque d’images
tools/
  gen_palettes.py régénère themes.css et palettes.js
```

Des scripts ordinaires chargés dans l’ordre — pas de modules, donc cela fonctionne
aussi en `file://`.

L’application macOS est la même application web dans un `WKWebView`, servie via un
schéma `ledger://` depuis l’intérieur du bundle. La seule différence est le
stockage : dans un navigateur, `js/store.js` utilise `localStorage` ; sous
l’application, il parle à `window.LedgerNative` et c’est Swift qui possède le
fichier JSON. C’est ce qui permet au widget, à la barre des menus et à la fenêtre
principale de lire les mêmes chiffres.

### Tests

```sh
./macos/build.sh --test     # 17 vérifications natives : pont, aller-retour sur disque, widget
```

La couche web est couverte par une suite jsdom (131 vérifications — calculs
d’agrégation, coupure à minuit, verrou élément/catégorie, migrations, les huit
langues) et une suite Playwright (83 vérifications — vrais glisser-créer et
glisser-déplacer, chaque vue dans chaque langue, aucun débordement à 430 px).

---

## Réglages

Langue d’interface, plan typographique, début de semaine, plage horaire sur laquelle
s’ouvre la grille, aimantation du glisser (5/10/15/30 min), objectif quotidien, point
de saturation de la carte de chaleur, et vos dates de semestre. Les semestres sont
une liste tenue à la main ; la portée **Semestre** de la vue Statistiques y puise et
les flèches ‹ › la parcourent.

---

## Migrer depuis un export antérieur

Un export réalisé avant l’existence des éléments (`"v": 1`) s’importe sans problème.
Chaque catégorie qui porte réellement des entrées reçoit un élément nommé d’après la
catégorie elle-même, et ces entrées y sont classées — aucun temps enregistré n’est
perdu ni orphelin, et aucun bouche-trou n’est inventé pour les catégories qui étaient
vides de toute façon. Renommez ensuite cet élément ou découpez-le à votre guise.
