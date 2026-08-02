#!/usr/bin/env python3
"""Generate css/themes.css and js/palettes.js from the Tufte-template palette set.

Source: Hatsuyuki017/26-Xi-quizbank THEME_LIST (24 Tufte-Style Book Template
palettes + the original "warm" default).

Each palette exposes seven tokens:
  --p-bg   page paper colour
  --p-ink  darkest colour, used for text
  --p-a .. --p-e   five category / accent hues
"""
import os

# (id, name, bg, c2, c3, c4, c5(dark), c6)
RAW = [
    ('warm', 'Warm (default)', '#f5f0eb', '#8b1a1a', '#1a5c8b', '#1565c0', '#e65100', '#c41230'),
    ('ouc-default', 'OUC Default', '#EFF6FF', '#1E3A8A', '#2563EB', '#60A5FA', '#1E293B', '#DBEAFE'),
    ('brunneophobia', 'Brunneophobia', '#EED3B4', '#564335', '#B4240F', '#D5944F', '#2A170E', '#D5944F'),
    ('van-dyke', 'Van Dyke', '#ECC2BC', '#443C5E', '#BF7185', '#A99FBF', '#3D2B27', '#A99FBF'),
    ('back-in-black', 'Back in Black', '#F0D9E4', '#4A3F4B', '#806C79', '#C1A0AC', '#161315', '#C1A0AC'),
    ('belle-of-the-ball', 'Belle of the Ball', '#E2CBC0', '#76762C', '#E54A39', '#D2876A', '#354D04', '#CEAB96'),
    ('pine-tree', 'Pine Tree', '#EEC86F', '#A7581A', '#B17885', '#DEA620', '#2B2F22', '#DEA620'),
    ('provence-blue', 'Provence Blue', '#AABCAF', '#525C79', '#6E7C8B', '#899C9A', '#35425E', '#899C9A'),
    ('fresco-blue', 'Fresco Blue', '#A6E0F4', '#044B66', '#09799E', '#47A9CF', '#021F2E', '#47A9CF'),
    ('monet', 'Monet', '#F7F4D5', '#105666', '#839958', '#D3968C', '#0A3323', '#D3968C'),
    ('narcissus', 'Narcissus', '#DDD5C8', '#BE6C1A', '#C79548', '#B99590', '#6E3C1F', '#B99590'),
    ('roman-empire', 'Roman Empire', '#ECE8E1', '#781428', '#B41E1E', '#4A6E41', '#581C5A', '#D4AF37'),
    ('greece', 'Greece', '#F5F0E4', '#3069AF', '#BC5226', '#628030', '#5A2A5C', '#D4AF37'),
    ('kanagawa', 'Kanagawa', '#EDE9DE', '#0D264C', '#1A4E84', '#96BAD2', '#1D1923', '#D0E0EE'),
    ('starry-night', 'Starry Night', '#F0D044', '#16321E', '#3060A5', '#699BC8', '#142248', '#C68C34'),
    ('a-thousand-li', 'A Thousand Li', '#DACBAA', '#30694C', '#60946E', '#6EA5C3', '#234E70', '#B7762D'),
    ('and-quiet-flows-the-don', 'And Quiet Flows the Don', '#8E7846', '#34465A', '#7A4224', '#765634', '#581A18', '#6E6C68'),
    ('cyberpunk-edgerunners', 'Cyberpunk Edgerunners', '#E1FF08', '#0F2062', '#CD1423', '#EE1278', '#0E081C', '#0AEE64'),
    ('grand-budapest-hotel', 'Grand Budapest Hotel', '#F7EBD7', '#805894', '#B0883C', '#ED949E', '#8F3441', '#A8B2C4'),
    ('renaissance-florence', 'Renaissance Florence', '#EEE4D0', '#2E4676', '#36503C', '#AC5432', '#553622', '#BE9434'),
    ('soviet-avant-garde', 'Soviet Avant-Garde', '#E1D6CD', '#C41C1C', '#32508A', '#76726C', '#181412', '#C89620'),
    ('constantinople', 'Constantinople', '#ECE1CF', '#662041', '#324C3A', '#AA7032', '#1E3248', '#C3962A'),
    ('france', 'France', '#E8DECD', '#B42028', '#8F6C94', '#7A7E84', '#2C4A8A', '#8E853A'),
    ('kyoto', 'Kyoto', '#EAE2D4', '#505E44', '#6E5440', '#747E78', '#222842', '#CCB8B2'),
    ('siamese-dream', 'Siamese Dream', '#EEE2D0', '#BC6928', '#969187', '#C69E41', '#2A4430', '#B6B4C1'),
]


def rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def hexs(t):
    return '#' + ''.join(f'{max(0, min(255, round(v))):02X}' for v in t)


def mix(h1, h2, w):
    """Blend h1 into h2 by weight w (0..1 = share of h1)."""
    a, b = rgb(h1), rgb(h2)
    return hexs(tuple(a[i] * w + b[i] * (1 - w) for i in range(3)))


def lum(h):
    """WCAG relative luminance."""
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(v) for v in rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(h1, h2):
    a, b = lum(h1), lum(h2)
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)


def dist(h1, h2):
    a, b = rgb(h1), rgb(h2)
    return sum(abs(a[i] - b[i]) for i in range(3))


def dedupe(slots, ink, bg):
    """Guarantee five distinguishable category hues.

    Several source palettes repeat a colour across slots (c4 == c6). Nudge any
    repeat toward ink or paper until it separates, trying a fixed ladder of
    candidates so this can never spin.
    """
    out = []
    for c in slots:
        if any(dist(c, p) < 24 for p in out):
            for cand in (mix(c, ink, .55), mix(c, bg, .5), mix(c, ink, .3),
                         mix(c, bg, .3), mix(c, '#000000', .55)):
                if all(dist(cand, p) >= 24 for p in out):
                    c = cand
                    break
        out.append(c)
    return out


def darken_for_text(c, bg, floor):
    """Push a colour toward black until it is legible as text on `bg`."""
    guard = 0
    while contrast(c, bg) < floor and guard < 40:
        c = mix(c, '#000000', 0.9)
        guard += 1
    return c


css = ["""/* ============================================================
   themes.css — 25 palettes for the Study Ledger
   Switch the whole app with <html data-theme="kyoto">.
   Source: Thomas Shang's Tufte-Style Book Template (24 palettes)
           + the original "warm" default, ported from 26-Xi-quizbank.

   A palette declares only seven raw tokens. Every other colour in
   the app is derived from them in app.css via color-mix(), so a
   palette can never be half-applied.
   ============================================================ */
"""]
js = ["""/* palettes.js — palette metadata for the picker. Generated; edit gen_palettes.py. */
window.PALETTES = ["""]

for i, (pid, name, bg, c2, c3, c4, c5, c6) in enumerate(RAW):
    ink = '#2C2C2C' if pid == 'warm' else c5
    # A palette's `ink` is the app's body text, so it must clear 7:1 on its
    # own paper. Everything else stays exactly as the source palette drew it:
    # category hues are only ever used as fills and rules, never as text.
    ink = darken_for_text(ink, bg, 7.0)
    # Category hues are drawn as 3px rules and swatches, so hold each to the
    # 3:1 non-text contrast floor against its own paper — a few palettes ship a
    # near-white accent that would otherwise vanish.
    slots = dedupe([darken_for_text(c, bg, 3.0) for c in (c2, c3, c4, c6, c5)], ink, bg)

    css.append(f'/* {i}. {name} */\n[data-theme="{pid}"] {{\n'
               f'  --p-bg:  {bg};\n  --p-ink: {ink};\n'
               f'  --p-a:   {slots[0]};\n  --p-b:   {slots[1]};\n  --p-c:   {slots[2]};\n'
               f'  --p-d:   {slots[3]};\n  --p-e:   {slots[4]};\n}}\n')
    js.append('  {id:%-27s name:%-28s bg:%r, ink:%r, cats:[%s]},'
              % ("'%s'," % pid, "'%s'," % name, bg, ink,
                 ','.join(repr(s) for s in slots)))

# `warm` is also the fallback when no data-theme is set at all.
warm = css[1].split('{', 1)[1]
css.insert(1, ':root {' + warm)

js.append('];\n')

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
os.makedirs(root, exist_ok=True)
open(os.path.join(root, 'themes.css'), 'w').write('\n'.join(css))
open(os.path.join(root, 'palettes.js'), 'w').write('\n'.join(js).replace("'", "'"))
print('wrote', len(RAW), 'palettes')
