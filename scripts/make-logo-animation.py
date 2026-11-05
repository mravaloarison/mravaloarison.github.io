#!/usr/bin/env python3
"""Turn Mami's logo animation (a Procreate export) into the frame strips the
site plays: in the first-visit intro, on the logo when a page is reloaded,
and in the viewer when the logo is open (its replay button).

    python3 scripts/make-logo-animation.py                    # _brand/logo-animation.*
    python3 scripts/make-logo-animation.py path/to/Logo.mp4   # a new export

Needs Pillow (python3 -m pip install pillow), and ffmpeg for an MP4.
Not part of the Jekyll build.

The export: the same 2048x2048 canvas as the logo (_brand/logo.png), with
the dog drawn in the same place, frame 1 at rest (the logo itself) and the
last frame leading back into it, so it plays from and back to the still
logo without a jump. Best is Procreate's Animated PNG with the background
layer hidden (see-through, any shape). An MP4 works too: it has a black
background, so the logo's own outline is used to cut the dog out, which
means everything has to stay inside the sticker edge. A drawing that sits a
little off on the canvas is moved back onto the logo automatically.

A new export is copied to _brand/ (not published) so it can be redone. The
script writes:

  assets/brand/logo-anim-512.webp    the frames side by side, 512 px each,
                                     see-through: the intro and the logo
                                     at the top of every page
  assets/brand/logo-anim-1024.webp   the same at 1024 px: the viewer
  _data/logo_animation.yml           frame count, length and the strips,
                                     which the layout hands to main.js
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    from PIL import Image, ImageChops, ImageFilter, ImageSequence
except ImportError:
    sys.exit("Pillow is required:  python3 -m pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
LOGO = ROOT / "_brand" / "logo.png"
SOURCE_STEM = ROOT / "_brand" / "logo-animation"
OUT = ROOT / "assets" / "brand"
DATA = ROOT / "_data" / "logo_animation.yml"
SIZES = (512, 1024)


def frames_from_video(path):
    """Every frame of an MP4/MOV as RGB, and each one's length in ms."""
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "frame=pts_time", "-of", "json", str(path)],
        check=True, capture_output=True, text=True)
    times = [float(f["pts_time"]) for f in json.loads(probe.stdout)["frames"]]
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(
            ["ffmpeg", "-v", "error", "-i", str(path), "-vsync", "0", "-vf",
             "scale=in_color_matrix=bt709:in_range=tv:out_range=pc:"
             "flags=accurate_rnd+full_chroma_int,format=rgb24",
             str(Path(tmp) / "f%04d.png")], check=True)
        frames = [Image.open(p).convert("RGB") for p in sorted(Path(tmp).glob("f*.png"))]
    step = (times[-1] - times[0]) / max(1, len(times) - 1) if len(times) > 1 else 1 / 12
    lengths = [round((b - a) * 1000) for a, b in zip(times, times[1:])] + [round(step * 1000)]
    return frames, lengths, False


def frames_from_image(path):
    """Every frame of an animated PNG/WebP/GIF as RGBA, and their lengths."""
    im = Image.open(path)
    frames, lengths = [], []
    for frame in ImageSequence.Iterator(im):
        frames.append(frame.convert("RGBA"))
        lengths.append(int(frame.info.get("duration", 83)) or 83)
    return frames, lengths, True


def silhouette(frame, has_alpha):
    """Where the drawing is: its alpha, or (on black) anything not black."""
    if has_alpha:
        return frame.getchannel("A").point(lambda v: 255 if v > 128 else 0)
    r, g, b = frame.split()
    brightest = ImageChops.lighter(ImageChops.lighter(r, g), b)
    return brightest.point(lambda v: 255 if v > 40 else 0)


def offset_to(logo_mask, mask):
    """The shift that puts the frame's drawing on the logo's (bounding boxes
    first, then a few pixels either way for the best overlap)."""
    lb, fb = logo_mask.getbbox(), mask.getbbox()
    dx0 = round(((lb[0] - fb[0]) + (lb[2] - fb[2])) / 2)
    dy0 = round(((lb[1] - fb[1]) + (lb[3] - fb[3])) / 2)
    small_logo = logo_mask.resize((512, 512))
    best = None
    for dx in range(dx0 - 4, dx0 + 5):
        for dy in range(dy0 - 4, dy0 + 5):
            moved = ImageChops.offset(mask, dx, dy).resize((512, 512))
            miss = sum(ImageChops.difference(moved, small_logo).point(lambda v: 255 if v > 127 else 0).histogram()[255:])
            if best is None or miss < best[0]:
                best = (miss, dx, dy)
    return best[1], best[2]


def main():
    if len(sys.argv) > 1:
        src = Path(sys.argv[1]).expanduser()
        SOURCE_STEM.parent.mkdir(exist_ok=True)
        for old in SOURCE_STEM.parent.glob(SOURCE_STEM.name + ".*"):
            old.unlink()
        kept = SOURCE_STEM.with_suffix(src.suffix.lower())
        shutil.copyfile(src, kept)
        src = kept
    else:
        found = sorted(SOURCE_STEM.parent.glob(SOURCE_STEM.name + ".*"))
        if not found:
            sys.exit("No animation yet: pass the exported file, e.g. "
                     "python3 scripts/make-logo-animation.py ~/Downloads/Logo.mp4")
        src = found[0]

    if src.suffix.lower() in (".mp4", ".mov", ".m4v", ".webm"):
        frames, lengths, has_alpha = frames_from_video(src)
    else:
        frames, lengths, has_alpha = frames_from_image(src)
    if len(frames) < 2:
        sys.exit("That file has only one frame.")

    logo = Image.open(LOGO).convert("RGBA")
    if frames[0].size != logo.size:
        frames = [f.resize(logo.size, Image.LANCZOS) for f in frames]
    logo_alpha = logo.getchannel("A")
    logo_mask = logo_alpha.point(lambda v: 255 if v > 128 else 0)
    dx, dy = offset_to(logo_mask, silhouette(frames[0], has_alpha))
    print(f"{src.name}: {len(frames)} frames, {sum(lengths)} ms; moved {dx:+d}, {dy:+d} px onto the logo")

    # On black (an MP4) the dog is cut out with the logo's own outline; the
    # last few pixels inside it come from the logo itself, so no black
    # fringe shows on the page.
    core = logo_alpha.filter(ImageFilter.MinFilter(7)).point(lambda v: 255 if v == 255 else 0)
    cut = []
    for f in frames:
        moved = ImageChops.offset(f, dx, dy)
        if has_alpha:
            cut.append(moved)
            continue
        frame = Image.composite(moved.convert("RGBA"), logo, core)
        frame.putalpha(logo_alpha)
        cut.append(frame)

    for size in SIZES:
        strip = Image.new("RGBA", (size * len(cut), size), (0, 0, 0, 0))
        for i, f in enumerate(cut):
            strip.paste(f.resize((size, size), Image.LANCZOS), (i * size, 0))
        path = OUT / f"logo-anim-{size}.webp"
        strip.save(path, "WEBP", quality=75, method=6)
        print(f"wrote {path.relative_to(ROOT)}  ({path.stat().st_size // 1024} KB)")

    DATA.write_text(
        "# Written by scripts/make-logo-animation.py from Mami's animation; don't edit by hand.\n"
        f"frames: {len(cut)}\n"
        f"duration: {sum(lengths)}   # ms, the whole animation once\n"
        "strips:\n"
        + "".join(f"  - size: {s}\n    src: /assets/brand/logo-anim-{s}.webp\n" for s in SIZES))
    print(f"wrote {DATA.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
