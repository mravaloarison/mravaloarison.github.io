#!/usr/bin/env python3
"""Make web-sized WebP copies of the site's images and record their sizes.

Run from anywhere after adding or replacing an image in assets/images/:

    python3 scripts/optimize-images.py

Needs Pillow (python3 -m pip install pillow). Not part of the Jekyll build.

For every PNG/JPG under assets/images/ (including assets/images/arts/) it
writes <name>-800w.webp and <name>-1600w.webp, never wider than the original,
then rewrites _data/image_dimensions.yml with each image's width, height and
WebP variants. _includes/picture.html reads that file to build <picture> tags,
and keeps the original as the fallback (and as the social-preview image).
WebP files whose original no longer exists are deleted.
"""
import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is required:  python3 -m pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "assets" / "images"
DATA = ROOT / "_data" / "image_dimensions.yml"
WIDTHS = (800, 1600)
QUALITY = 80
SOURCE_TYPES = {".png", ".jpg", ".jpeg"}
VARIANT = re.compile(r"^(?P<stem>.+)-(?P<w>\d+)w\.webp$")


def variant_widths(width):
    widths = [w for w in WIDTHS if w < width]
    if width <= max(WIDTHS):
        widths.append(width)
    return sorted(set(widths))


def site_path(path):
    return "/" + path.relative_to(ROOT).as_posix()


def main():
    entries = []
    sources = sorted(p for p in IMAGES.rglob("*") if p.suffix.lower() in SOURCE_TYPES)

    for src in sources:
        with Image.open(src) as opened:
            im = ImageOps.exif_transpose(opened)  # phone photos of drawings
            width, height = im.size
            variants = []
            for w in variant_widths(width):
                out = src.with_name(f"{src.stem}-{w}w.webp")
                if not out.exists() or out.stat().st_mtime < src.stat().st_mtime:
                    frame = im if im.mode in ("RGB", "RGBA") else im.convert("RGBA")
                    h = round(height * w / width)
                    frame.resize((w, h), Image.LANCZOS).save(out, "WEBP", quality=QUALITY, method=6)
                    print(f"wrote   {site_path(out)}  ({out.stat().st_size // 1024} KB)")
                variants.append((w, site_path(out)))
        entries.append((site_path(src), width, height, variants))

    # Delete WebP variants whose original is gone (e.g. a removed project).
    stems = {(s.parent, s.stem) for s in sources}
    for webp in IMAGES.rglob("*.webp"):
        m = VARIANT.match(webp.name)
        if m and (webp.parent, m.group("stem")) not in stems:
            webp.unlink()
            print(f"removed {site_path(webp)}")

    lines = [
        "# Written by scripts/optimize-images.py. Re-run it after adding or replacing an image.",
    ]
    for path, w, h, variants in entries:
        lines += [f"{path}:", f"  width: {w}", f"  height: {h}", "  webp:"]
        for vw, vpath in variants:
            lines += [f"    - src: {vpath}", f"      w: {vw}"]
    DATA.write_text("\n".join(lines) + "\n")
    print(f"updated {DATA.relative_to(ROOT)} ({len(entries)} images)")


if __name__ == "__main__":
    main()
