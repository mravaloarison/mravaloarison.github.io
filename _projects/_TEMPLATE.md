---
# HOW TO ADD A PROJECT
# 1. Copy this file to _projects/<name>.md (no "_" at the start). <name> becomes
#    its address: /projects/<name>/. (Files starting with "_" are ignored, which
#    is why this one never shows up on the site.)
# 2. The screenshot for the project's own page and for link previews: put it in
#    assets/images/, write its path in image and a sentence saying what it
#    shows in image_alt. Then, if you can, run  python3 scripts/optimize-images.py
#    (it makes lighter copies; the page works without them, just slower).
# 3. Fill in the rest, write the page under the second ---, and save. The project
#    shows up by itself on Projects, on its type's page, and on About when it's
#    one of the two newest.
title: My new project
seo:
  type: CreativeWork   # or SoftwareApplication, for an app people can use
description: One or two sentences, 120–160 characters, written so they read well as a search result.
category: Personal   # Work | Personal | Hackathon
date: 2026-11-10
# For a hackathon win (delete these three lines if it isn't one). Its card
# gets the gold winner's medal by itself:
award: Best Use of Something
event: SomeHacks
organization: Some University
image: /assets/images/my-new-project.png
image_alt: What the screenshot shows, in a sentence
tech: [Swift, SwiftUI]   # names as in _data/tech_icons.yml get their icon and link
links:   # delete the ones you don't have
  demo: https://example.com
  github: https://github.com/mravaloarison/my-new-project
  devpost: https://devpost.com/software/my-new-project
# related: [better, green]   # optional: projects to show under "See also" (their file names)
# status: ongoing   # delete the "# " at the start to show the "In progress" pill
---

## Overview

What it is, and why you made it.

## What I built

What you did on it.
