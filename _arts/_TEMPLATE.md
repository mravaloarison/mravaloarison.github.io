---
# HOW TO ADD A PIECE
# 1. Put the image in /assets/images/arts/ (PNG or JPG export is fine).
# 2. Copy this file to _arts/<slug>.md — no leading underscore; the slug becomes /arts/<slug>/.
#    (Files starting with "_" are ignored by Jekyll, which is why this one never shows up.)
# 3. Fill in the fields below, then run:  python3 scripts/optimize-images.py
#    That writes the WebP versions and the image's width/height.
# The piece shows up by itself in its subcategory (Hand drawn or Procreate:
# /arts/hand-drawn/ or /arts/procreate/) and on /arts/. A subcategory with no
# pieces shows "Working on it" until its first one.
title: Morning light over the bay
description: One or two sentences about the piece, 120–160 characters, written so it reads well as a search result snippet.
medium: Procreate # Procreate | Hand drawn
# order: 8   # optional: its place in its gallery (1 comes first; 2.5 fits between 2 and 3).
#             Pieces without one come after the numbered ones, newest first.
date: 2026-10-13
image: /assets/images/arts/morning-light.png
image_alt: Describe what the artwork shows, e.g. "Pastel sunrise over a calm bay with two small sailboats"
tools: [Procreate, iPad, Apple Pencil]
---

A short note about the piece: what inspired it, what you were practicing, what you'd do differently next time.
