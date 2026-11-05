---
# HOW TO ADD AN ANIMATION
# 1. Export it from Procreate. A video is best: MP4 (Share → Animated MP4, or
#    the export in Procreate Dreams). A GIF works too, but it's bigger and blurrier.
# 2. Put it in /assets/animations/ as <slug>.mp4 (or <slug>.gif). A silent MP4
#    loops by itself on the site while it's on screen, like a GIF. Optional:
#    the same video as <slug>.webm next to it, for browsers without H.264.
# 3. Save one still frame as a PNG or JPG in /assets/images/animations/<slug>.png.
#    It's the thumbnail, the share image, and what shows before the video plays.
# 4. Copy this file to _animations/<slug>.md (no leading underscore); the slug
#    becomes /arts/animated/<slug>/. Fill in the fields below, then run
#      python3 scripts/optimize-images.py
#    which makes the still frame's WebP versions and records its size.
# The Animated page in Arts (/arts/animated/) shows "Working on it" until
# the first one is here, then switches on by itself.
title: The dog and the duck
description: One or two sentences about the animation, 120–160 characters, written so it reads well as a search result snippet.
# order: 4   # optional: its place on the Animated page (1 comes first); without one, after the numbered ones, newest first
date: 2026-11-04
video: /assets/animations/the-dog-and-the-duck.mp4   # or, instead:  gif: /assets/animations/the-dog-and-the-duck.gif
image: /assets/images/animations/the-dog-and-the-duck.png
image_alt: Describe what happens in it, e.g. "A white dog in a fake duck bill paddles across a pond and quacks at a real duck"
tools: [Procreate, iPad, Apple Pencil]
# sound: true   # only if it has sound worth hearing: then it gets controls and waits for play instead of looping by itself
---

A short note about it: what it's for (a game, a story), how long it took, what you'd do differently.
