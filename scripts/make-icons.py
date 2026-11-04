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
  assets/social/og-default.png   the logo in the share image's top-left
                                 corner, where the old "M" was
"""
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required:  python3 -m pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "_brand" / "logo.png"
PAPER = (247, 242, 234)        # warm paper behind the iPhone icon
OG = ROOT / "assets" / "social" / "og-default.png"
OG_BOX = (93, 72, 88)          # left, top, size of the logo in the share image
OG_OLD_MARK = (96, 80, 168, 152)  # the old 72 px "M" tile, painted over first


def fit(img, size):
    return img.resize((size, size), Image.LANCZOS)


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

    og = Image.open(OG).convert("RGBA")
    og.paste((255, 255, 255, 255), OG_OLD_MARK)
    left, top, size = OG_BOX
    og.paste((255, 255, 255, 255), (left, top, left + size, top + size))
    og.alpha_composite(fit(logo, size), (left, top))
    og.convert("RGB").save(OG, optimize=True)

    for f in ("favicon.ico", "icon-192.png", "apple-touch-icon.png", "assets/social/og-default.png"):
        print(f"wrote {f} ({(ROOT / f).stat().st_size // 1024 or 1} KB)")


if __name__ == "__main__":
    main()
