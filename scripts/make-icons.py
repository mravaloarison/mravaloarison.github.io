#!/usr/bin/env python3
"""Make the site's icons from one square logo drawing.

    python3 scripts/make-icons.py                     # uses _brand/logo.png
    python3 scripts/make-icons.py path/to/drawing.png  # a new drawing

Needs Pillow (python3 -m pip install pillow). Not part of the Jekyll build.

The drawing: a square PNG with a transparent background, ideally 2048×2048
(at least 1024×1024). It's mostly seen 16–32 px wide in a browser tab, so
bold shapes and thick outlines read best. A new drawing is saved to
_brand/logo.png without its metadata (the source everything is made from;
_brand/ isn't published, but the repo is), then the script writes:

  favicon.ico                    16, 32 and 48 px, transparent (browser tabs)
  icon-192.png                   192 px, transparent (sharper tabs, and the
                                 icon Google shows beside the site in results)
  apple-touch-icon.png           180 px on warm paper (iPhone home screen;
                                 iOS needs it opaque and rounds the corners)
  assets/social/og-default.png   the share card (1200x630): the logo, then the
                                 name and CARD_LINE below in the site's own
                                 fonts and colours (edit CARD_LINE to change it)
  assets/brand/logo.webp, .png   168 px, transparent: the logo at the top of
                                 every page (shown at 44-56 px, so 3x sharp)
  assets/brand/logo-512.webp     512 px, transparent: the logo in the first-visit
                                 intro, before it glides into place
  assets/brand/logo-1024.webp    1024 px, transparent: the logo when someone
                                 clicks it and it opens big in the viewer

Not made here: Mami's logo animation (assets/brand/logo-anim-*.webp, from
her Procreate export, by scripts/make-logo-animation.py). It's drawn on the
same canvas as the logo and starts on it at rest, so after a new drawing it
needs a new export to match (or delete those strips and
_data/logo_animation.yml: the intro then shows the still logo, and the
reload and replay animations are off).
"""
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow is required:  python3 -m pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "_brand" / "logo.png"
PAPER = (247, 242, 234)        # warm paper behind the iPhone icon
OG = ROOT / "assets" / "social" / "og-default.png"
FONTS = ROOT / "assets" / "fonts"
CARD_NAME = "Maminiaina Ravaloarison"
CARD_LINE = ("Product engineer in New York. iOS developer, "
             "12 hackathon wins, and I draw and play bass on the side.")
CARD_URL = "mravaloarison.github.io"
# the site's colours (--bg, --text, --text-secondary, --accent)
BG, TEXT, MUTED, ACCENT = (23, 21, 19), (237, 232, 224), (168, 159, 147), (245, 197, 66)
PAGE_LOGO = ROOT / "assets" / "brand" / "logo"   # .webp and .png
PAGE_LOGO_SIZE = 168


def fit(img, size):
    return img.resize((size, size), Image.LANCZOS)


def font(name, size, weight):
    """One of the site's own fonts (variable weight), from assets/fonts."""
    f = ImageFont.truetype(str(FONTS / name), size)
    try:
        f.set_variation_by_axes([weight])
    except (OSError, AttributeError):
        pass
    return f


def wrap(draw, text, f, width):
    lines, line = [], ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=f) <= width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    return lines + [line]


def make_card(logo):
    """The share card, drawn at 2x and scaled down: dark like the site, Newsreader
    for the name and line, Nunito for the small text, the logo top left."""
    k = 2
    W, H, M = 1200 * k, 630 * k, 80 * k
    card = Image.new("RGBA", (W, H), BG + (255,))
    card.alpha_composite(fit(logo, 116 * k), (M - 8 * k, 58 * k))
    d = ImageDraw.Draw(card)

    eyebrow = font("nunito-latin.woff2", 22 * k, 600)
    x, y = M, 214 * k
    for ch in "PORTFOLIO":                      # letter-spaced like the site's eyebrows
        d.text((x, y), ch, font=eyebrow, fill=MUTED)
        x += d.textlength(ch, font=eyebrow) + 0.07 * 22 * k

    size = 80
    while True:                                 # the name on one line
        name = font("newsreader-latin.woff2", size * k, 500)
        if d.textlength(CARD_NAME, font=name) <= W - 2 * M or size <= 56:
            break
        size -= 2
    d.text((M, 246 * k), CARD_NAME, font=name, fill=TEXT)

    body = font("newsreader-latin.woff2", 36 * k, 400)
    y = 356 * k
    for line in wrap(d, CARD_LINE, body, W - 2 * M - 40 * k):
        d.text((M, y), line, font=body, fill=MUTED)
        y += 51 * k

    url = font("nunito-latin.woff2", 25 * k, 400)
    uy = 540 * k
    d.text((M, uy), CARD_URL, font=url, fill=TEXT)
    uw = d.textlength(CARD_URL, font=url)
    d.rectangle((M, uy + 36 * k, M + uw, uy + 38 * k), fill=ACCENT + (150,))   # a link's accent underline
    return card.resize((1200, 630), Image.LANCZOS).convert("RGB")


def main():
    if len(sys.argv) > 1:
        new = Path(sys.argv[1]).expanduser().resolve()
        if new != SOURCE:
            # Keep the pixels and colour profile only: Procreate and phones add
            # metadata (titles, devices, sometimes a location) the repo doesn't need.
            with Image.open(new) as drawing:
                icc = drawing.info.get("icc_profile")
                extra = {"icc_profile": icc} if icc else {}
                drawing.convert("RGBA").save(SOURCE, optimize=True, **extra)
            print(f"saved {new.name} -> {SOURCE.relative_to(ROOT)} (metadata removed)")

    logo = Image.open(SOURCE).convert("RGBA")
    w, h = logo.size
    if w != h:
        sys.exit(f"The drawing must be square (it's {w}×{h}).")
    if w < 1024:
        print(f"Note: the drawing is only {w}px wide; 2048 px gives the sharpest icons.")

    logo.save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    fit(logo, 192).save(ROOT / "icon-192.png", optimize=True)

    touch = Image.new("RGBA", (180, 180), PAPER + (255,))
    inner = fit(logo, 148)       # iOS rounds the corners; keep the drawing clear of them
    touch.alpha_composite(inner, (16, 16))
    touch.convert("RGB").save(ROOT / "apple-touch-icon.png", optimize=True)

    make_card(logo).save(OG, optimize=True)

    PAGE_LOGO.parent.mkdir(parents=True, exist_ok=True)
    page = fit(logo, PAGE_LOGO_SIZE)
    page.save(PAGE_LOGO.with_suffix(".webp"), "WEBP", quality=88, method=6)
    page.save(PAGE_LOGO.with_suffix(".png"), optimize=True)
    fit(logo, 512).save(PAGE_LOGO.parent / "logo-512.webp", "WEBP", quality=88, method=6)
    fit(logo, 1024).save(PAGE_LOGO.parent / "logo-1024.webp", "WEBP", quality=86, method=6)

    for f in ("favicon.ico", "icon-192.png", "apple-touch-icon.png", "assets/social/og-default.png",
              "assets/brand/logo.webp", "assets/brand/logo.png", "assets/brand/logo-512.webp",
              "assets/brand/logo-1024.webp"):
        print(f"wrote {f} ({(ROOT / f).stat().st_size // 1024 or 1} KB)")


if __name__ == "__main__":
    main()
