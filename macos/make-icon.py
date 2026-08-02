#!/usr/bin/env python3
"""Draw the app icon as a PNG, with no image libraries involved.

The mark is the ledger itself: three ruled entries of decreasing length on a
warm paper field, inside the rounded square macOS expects. Everything is plain
arithmetic over a pixel buffer, then a minimal PNG encoder.
"""
import struct, zlib, sys, os

S = 1024                       # master size; macOS downsamples the rest
PAD = int(S * 0.086)           # the transparent margin every macOS icon carries
BOX = S - 2 * PAD
RADIUS = int(BOX * 0.2237)     # Apple's continuous-corner ratio, near enough

PAPER = (0x8B, 0x1A, 0x1A)     # the warm palette's primary — the tile
RULE = (0xF5, 0xF0, 0xEB)      # its paper colour — the ruled lines


def rounded_alpha(x, y):
    """Coverage of the rounded square at a pixel, sampled 3x3 for smooth edges."""
    hits = 0
    for sy in range(3):
        for sx in range(3):
            px = x + (sx + 0.5) / 3.0 - PAD
            py = y + (sy + 0.5) / 3.0 - PAD
            if px < 0 or py < 0 or px > BOX or py > BOX:
                continue
            # Distance into a corner, if we are in one.
            cx = RADIUS - px if px < RADIUS else (px - (BOX - RADIUS) if px > BOX - RADIUS else 0)
            cy = RADIUS - py if py < RADIUS else (py - (BOX - RADIUS) if py > BOX - RADIUS else 0)
            if cx * cx + cy * cy <= RADIUS * RADIUS:
                hits += 1
    return hits / 9.0


def bars():
    """The three ruled entries: (top, height, left, width) in master pixels."""
    left = PAD + int(BOX * 0.20)
    full = int(BOX * 0.60)
    h = int(BOX * 0.088)
    gap = int(BOX * 0.105)
    top = PAD + int(BOX * 0.27)
    return [
        (top, h, left, full),
        (top + h + gap, int(h * 0.72), left, int(full * 0.82)),
        (top + 2 * (h + gap), int(h * 0.72), left, int(full * 0.52)),
    ]


def build():
    rows = []
    bar_list = bars()
    for y in range(S):
        row = bytearray()
        for x in range(S):
            a = rounded_alpha(x, y)
            if a <= 0:
                row += b"\x00\x00\x00\x00"
                continue
            r, g, b = PAPER
            for (by, bh, bx, bw) in bar_list:
                if by <= y < by + bh and bx <= x < bx + bw:
                    # Round the bar ends a little so they match the tile's language.
                    rr = bh / 2.0
                    ex = 0.0
                    if x < bx + rr:
                        ex = (bx + rr) - x
                    elif x > bx + bw - rr:
                        ex = x - (bx + bw - rr)
                    ey = abs(y - (by + bh / 2.0))
                    if ex * ex + ey * ey <= rr * rr or ex == 0.0:
                        r, g, b = RULE
                    break
            av = int(round(a * 255))
            row += bytes((r, g, b, av))
        rows.append(bytes(row))
    return rows


def write_png(path, rows):
    raw = b"".join(b"\x00" + r for r in rows)

    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", S, S, 8, 6, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(raw, 9))
           + chunk(b"IEND", b""))
    with open(path, "wb") as f:
        f.write(png)


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "icon.png"
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    write_png(out, build())
    print("wrote", out, os.path.getsize(out), "bytes")
