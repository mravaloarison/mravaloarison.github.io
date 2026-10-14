# Portfolio — Maminiaina "Mami" Ravaloarison

Personal portfolio and journal. Jekyll site deployed to GitHub Pages at
`https://mravaloarison.github.io/`. This file is the standing brief — read it
before making changes and follow it over your own defaults.

## Who this is for

- **Full name:** Maminiaina Ravaloarison
- **Display name:** Mami Ravaloarison
- **Role:** Software Engineer (currently Junior Data Analyst, Monroe University)
- **Based:** New York, USA. From Madagascar.
- **Links:** github.com/mravaloarison · linkedin.com/in/mravaloarison · devpost.com/mrava
- **Email:** mravaloarison@gmail.com

Both name forms matter for search. Use "Mami Ravaloarison" in visible UI, and
carry "Maminiaina Ravaloarison" in structured data, `<title>` on the homepage,
and the About page body so both spellings are indexable.

## Stack and constraints

- Jekyll, built and deployed via GitHub Actions (not the legacy branch build),
  so plugins outside the GitHub Pages allowlist are available.
- **Hand-written CSS** in one stylesheet, organized with custom properties.
  No Tailwind, no Bootstrap, no CSS framework.
- Vanilla JS only, `defer`ed, and only where a feature genuinely needs it
  (the theme toggle, the phone menu). The one exception is the inline theme snippet in
  `<head>`, which must run before first paint. All content renders
  server-side at build time — never fetch or render content client-side.
- No jQuery. No build step beyond Jekyll itself.
- Components live in `_includes/` as Liquid partials. Filenames kebab-case.

---

## Design language: warm, simple, single column

The visual target is a personal site in the spirit of leerob.com (plain,
text-first, one narrow column, nothing extra) with the warmth of
maggieappleton.com (paper-toned background, serif headings, a hand-made
feel). It should read like a well-set page in a book, not a marketing site
and not a docs portal. When in doubt, remove things.

This replaced an earlier Apple-documentation design (three columns, sliding
sidebar, on-this-page rail) in October 2026, at Mami's request. Don't bring
the sidebar, drawer, or on-this-page rail back.

Fonts are self-hosted in `assets/fonts/` (`font-display: swap`), and only
what's used is shipped:

- **Newsreader** (`--font-serif`, variable weight, upright only) — h1,
  h2, h3, the site name, post titles in lists, card titles, and the
  abstract under each page title. Weight 500 for headings.
- **Nunito 400/600/700** (`--font-sans`) — body, nav, labels, meta, UI.
  Code stays monospace.
- **Noto Color Emoji** (`--font-emoji`) — subset to 🌙 and ☀️ for the theme
  toggle.

Newsreader latin and Nunito latin are preloaded from the head include.

**Nothing is italic** — not the abstract, not blockquotes, not Markdown
`*emphasis*` (`em`, `i`, `cite` are reset to `font-style: normal`). No
italic font file is shipped.

### Color

Warm paper and ink. Tokens live on `:root` with a dark set under
`prefers-color-scheme: dark` (guarded by `:not([data-theme="light"])`) and
again under `[data-theme="dark"]`:

| Token              | Light     | Dark      |
| ------------------ | --------- | --------- |
| `--bg`             | `#fbf8f3` | `#171513` |
| `--surface`        | `#f3eee5` | `#211e1b` |
| `--text`           | `#24211d` | `#ede8e0` |
| `--text-secondary` | `#635c52` | `#a89f93` |
| `--accent`         | `#a64b22` | `#e9926a` |
| `--border`         | `#e3dccf` | `#312d29` |

All text pairs are at least 4.5:1. Links are ink-colored with a soft accent
underline that turns fully accent on hover. Use the accent sparingly:
links, the callout rule, award pills.

### Type

| Role                    | Size                      | Font / weight         |
| ----------------------- | ------------------------- | --------------------- |
| Eyebrow                 | 14px, uppercase, 0.06em   | Nunito 600            |
| Page title (h1)         | clamp(36px, 6vw, 48px)    | Newsreader 500        |
| Abstract under h1       | 22px                      | Newsreader            |
| Section (h2)            | 29px                      | Newsreader 500        |
| Subsection (h3)         | 22px                      | Newsreader 500        |
| Body                    | 18px, line-height 1.65    | Nunito 400            |
| Meta / caption          | 15px                      | Nunito 400            |

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96. Radii: 6px small, 10px
cards and images, pills fully rounded.

### Layout

- One centered column, `--measure` 680px of text width, 24px side padding
  (16px under 600px). No horizontal page scroll, ever.
- Header: "Mami Ravaloarison" in Newsreader on the left; plain text links
  on the right (About · Projects · Arts · Blog) and the theme toggle. The
  current section's link is bold and carries `aria-current`. The Arts link
  only appears once `_arts/` has a piece.
- Phones (≤600px): burger · name · theme toggle spread across the header
  (`justify-content: space-between`). The burger morphs into an × and slides
  the links in from the left as a drawer (360ms,
  `cubic-bezier(0.32, 0.72, 0, 1)`), links fading in one after another, with
  a dim overlay behind. Escape, the overlay, or the × closes it; focus stays
  inside while open. This only applies when `html.js` is set by the head
  script — with JS off the links wrap onto their own line under the name.
- The theme toggle has no box: 🌙 and ☀️ sit on a "day/night wheel"
  pivoting below the button. Clicking turns it — the moon swings out right
  while the sun swings in from the left (450ms), and back. The transition is
  only enabled after a click (`.is-switching`) so it never plays on load.
- **Art rail** (`art-rail.html`): pages with `art_rail: true` (About, Blog
  index) show the three latest pieces from `_arts/` in a 220px sticky rail
  beside the column at ≥1100px (header and footer widen to match), and as a
  row of three under the content on smaller screens. Hidden — layout stays
  single column — until `_arts/` has a piece.
- **Photo grid** (`photo-grid.html`): personal photos, leerob.com style, at
  the end of the About Overview. Listed in `_data/photos.yml`, files in
  `assets/images/photos/`, run through `optimize-images.py`. First photo
  large, up to five. Hidden until the list has an entry.
- Footer: a hairline, then Email · GitHub · LinkedIn · Devpost · RSS and
  the copyright line.
- Post lists are quiet rows: serif title on the left, date on the right,
  hairline between rows (`post-list.html`).
- Project cards: image first (rounded, hairline border), serif title, one
  line of description. No boxes around cards, no shadows.

### Components in `_includes/`

- `breadcrumb.html` — on every page below the top level, including the group:
  Home / Projects / Hackathons / Better
- `page-header.html` — eyebrow, h1, serif abstract
- `post-list.html` — title/date rows; `descriptions=true` adds a line under each
- `blog-browse.html` — By year / By tag links, on the blog index and every year/tag page
- `metadata-row.html` — "In progress" (when `status: ongoing`) and award
  pills, then the tech stack as a boxless row: 24px icon + name, each
  linking to the tech's official site (new tab, `rel="noopener"`, since the
  reader is mid-article). Tech without a `url` renders unlinked.
- `tech-icon.html` — one tech icon (`px` sets the size; not `size`, which
  Liquid reserves). Icons are Icons8 "Color" 48px PNGs in
  `assets/icons/tech/`; icon and link per exact tech name live in
  `_data/tech_icons.yml` (fallback `source-code.png`). Every tech gets its
  own icon where Icons8 has one (Firebase and Firestore differ). The free
  Icons8 licence needs the "Icons by Icons8" footer link — never remove it.
- `card-grid.html` — project cards; tech shows as 22px icon + name, wrapping
  (plain text, not links — the whole card is already a link),
  plus the "In progress" pill on ongoing projects
- `see-also.html` — trailing block of related links (details below)
- `callout.html` — Note / Tip / Looking for aside with a left accent rule
- `figure.html` — image plus caption, used heavily on Arts
- `picture.html` — every content image goes through this: `<picture>` with the
  WebP variants from `_data/image_dimensions.yml`, original as fallback
- `gallery-grid.html` — the dense square grid used on Arts
- `art-rail.html` — latest arts beside the content (see Layout)
- `photo-grid.html` — personal photos from `_data/photos.yml`
- `prev-next.html` — sibling navigation within a collection

Transitions are 150–200ms ease, color and small transforms only. Nothing
bouncy. Honor `prefers-reduced-motion: reduce`. Visible focus rings on every
interactive element.

---

## Site architecture

Four top-level sections. Every one has an index, category pages, and per-item
detail pages.

```
/                                   About me
/projects/                          Projects index
/projects/category/:category/       Work · Personal · Hackathons
/projects/:slug/                    Project detail
/arts/                              Arts index
/arts/medium/:medium/               Procreate · Traditional · Sketchbook
/arts/:slug/                        Art detail
/blog/                              Blog & Journal index
/blog/tag/:tag/                     Tag pages
/blog/:year/:month/:day/:slug/      Post
```

### About (`/`)

A long-form page, not a landing page. Structure it as:
Overview (the bio) → Topics: Experience, Education, Awards, Certificates,
Languages, Interests. A "Looking for" callout (currently: graduate programs
and scholarships) sits between the profile links and the Overview, and the
hackathon award lists every project with an `award` in its front matter. A "Latest work"
card grid shows projects marked `featured: true` (MyTime and DogDuckGo). Existing copy is good — keep
its voice, don't corporate-ize it.

### Projects

Thirteen items, grouped **Work (2) · Personal (5) · Hackathons (6)**. Each
already has a detail page and a screenshot in `assets/images/`. Discover
Nature was removed on purpose — don't bring it back from the old site.
MyTime has no public code or screenshots yet; its image is a placeholder
cover to replace with real screens. MyTime and DogDuckGo are ongoing
(`status: ongoing` in front matter → "In progress" pill on cards and the
detail page, `creativeWorkStatus` in JSON-LD); drop the field when one ships. DogDuckGo's repo (mravaloarison/save)
is private, so it has no GitHub link.

The index at `/projects/` shows all thirteen under category headings. Each
category page shows only its own.

Detail page order: breadcrumb → eyebrow (category) → title → abstract →
metadata row (tech stack) + award badges + host university → Overview →
screenshots → "What I built" → outbound links (live demo, GitHub, Devpost) →
See Also → prev/next.

### Arts

New section. Mami draws, and recently started digital work in Procreate.
Grouped by medium: **Procreate**, **Traditional**, **Sketchbook**.

Built and waiting for the first piece. Until `_arts/` has at least one item,
the Arts nav link and the "drawing" link in the About bio stay hidden, and
the Arts pages render a short note with `noindex`. All of that switches on by
itself when the first piece is added — copy `_arts/_TEMPLATE.md` (ignored by
Jekyll because of the underscore) and follow the steps in it.

Index is a gallery grid, denser than the projects grid. Detail page shows the
full piece large, then medium, tools, date, and a short note about the piece.
Art is image-heavy — this is where performance and alt text matter most. See
the image rules below; do not skip them here.

### Blog / Journal

Reverse-chronological. Two posts exist. Tags: `first-post`, `life`,
`technology`. Show date and reading time. The blog index links to the year pages
and the tag pages under "Browse" (`blog-browse.html`). The same block sits
at the bottom of every year and tag page too, with the current one
highlighted, so you can hop between tags without going back.

---

## Content model

Jekyll collections, all with `output: true`.

```yaml
collections:
    projects:
        output: true
        permalink: /projects/:name/
    arts:
        output: true
        permalink: /arts/:name/
```

Posts stay in `_posts`. **Preserve the existing post URLs**
(`/2026/02/08/AI-post.html`) using `jekyll-redirect-from` if the permalink
style changes, so nothing already indexed 404s.

### Front matter — `_projects/*.md`

```yaml
title: # required
description: # required, 120–160 chars, written for a search snippet
category: # Work | Personal | Hackathon — drives the category page and breadcrumb
date: # YYYY-MM-DD
image: # /assets/images/*.png — required, used for OG card
image_alt: # required
tech: [] # array of strings
award: # optional, e.g. "Best Use of Knot API"
event: # optional, e.g. "HackPrinceton"
organization: # optional, e.g. "Princeton University"
links:
    demo:
    github:
    devpost:
related: [] # optional slugs; auto-fill from category when absent
status: # optional; "ongoing" shows an In progress pill
```

### Front matter — `_arts/*.md`

```yaml
title:
description:
medium: # Procreate | Traditional | Sketchbook — drives the medium page and breadcrumb
date:
image:
image_alt: # required — describe the artwork, not "drawing"
tools: [] # e.g. [Procreate, iPad, Apple Pencil]
```

### Front matter — `_posts/*.md`

```yaml
title:
description:
date:
tags: []
image: # optional
last_modified_at: # when edited
```

---

## Linking rules (non-negotiable)

Every project, post, and artwork must be reachable and individually
linkable. Enforce all of these:

1. **Every collection item renders its own page** at a stable permalink.
   No item exists only as a card on an index.
2. **Every item is reachable in at most two clicks from its section index**
   (section index → item, or section index → category page → item). This
   is the guarantee that nothing is orphaned.
3. **Category, medium, and tag pages are real pages**, generated at build
   time — `/projects/category/hackathons/`, `/arts/medium/procreate/`,
   `/blog/tag/technology/`, and the section index links to each of them. The
   old site linked these to `#`, which meant search engines saw zero of them.
4. **`see-also.html` renders on every detail page and is never empty.** Use
   `related` when set; otherwise fall back to same category/tag, then to most
   recent in the collection.
5. **Prev/next** sibling links at the bottom of every detail page.
6. **Descriptive anchor text.** Use the post or project title. Never "read
   more", "click here", "view", or a bare URL.
7. Outbound links to GitHub/Devpost/demos open in the same tab unless the
   user is mid-article; if `target="_blank"`, always pair with
   `rel="noopener"`.
8. Add a build-time check: fail the build if any collection item lacks
   `title`, `description`, `image_alt`, or its grouping field (`category`
   or `medium`).

---

## SEO requirements

The point of this site is that someone searching "Maminiaina Ravaloarison" or
"Mami Ravaloarison software engineer" lands here, and that individual projects
and posts rank on their own.

### Plugins

`jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-feed`, `jekyll-redirect-from`.
Add `{% seo %}` to the head include.

### `_config.yml`

```yaml
title: Mami Ravaloarison
tagline: Software Engineer
description: >-
    Maminiaina "Mami" Ravaloarison — Software Engineer in New York.
    Projects, writing, and drawings.
url: https://mravaloarison.github.io
author:
    name: Maminiaina Ravaloarison
    email: mravaloarison@gmail.com
social:
    name: Mami Ravaloarison
    links:
        - https://github.com/mravaloarison
        - https://www.linkedin.com/in/mravaloarison/
        - https://devpost.com/mrava
lang: en-US
```

### Per-page

- Unique `title` and `description` on every single page, category and tag
  pages included. No page inherits a generic site description.
- Exactly one `<h1>` per page. Heading levels never skip.
- `<link rel="canonical">` on every page (jekyll-seo-tag handles this).
- Open Graph and Twitter card tags with a real image per item. Projects and
  arts already have images; give the About and Blog index pages a default
  OG image.

### Structured data (JSON-LD)

Emit per page type:

- About → `Person` with `name: "Maminiaina Ravaloarison"`,
  `alternateName: "Mami Ravaloarison"`, `jobTitle`, `alumniOf`, `sameAs`
  array of all profile URLs, `knowsLanguage`, `award`.
- Project detail → `CreativeWork` (or `SoftwareApplication` where it's a real
  app), with `author`, `datePublished`, `image`, `keywords` from `tech`.
- Post → `BlogPosting` with `headline`, `datePublished`, `dateModified`,
  `author`, `image`, `wordCount`.
- Art detail → `VisualArtwork` with `artMedium`, `creator`, `dateCreated`.
- Category, medium, and tag pages → `CollectionPage`.
- Every page below root → `BreadcrumbList`.

Validate output against Google's Rich Results Test before considering a page
done.

### Crawlability

- `sitemap.xml` generated and referenced from `robots.txt`, including every
  category, medium, and tag page.
- `robots.txt` at root, allowing everything, pointing at the sitemap.
- RSS feed at `/feed.xml` for the blog.
- A real `404.html`.
- Leave a placeholder comment in the head include for the Google Search
  Console verification meta tag.

### Images (matters most on Arts)

- `width` and `height` on every `<img>` to prevent layout shift.
- `loading="lazy"` on everything below the fold; the hero image on a detail
  page loads eagerly.
- Meaningful `alt` on every image. For artwork, describe the piece.
- How it works here: put the original in `assets/images/` (Arts in
  `assets/images/arts/`), then run `python3 scripts/optimize-images.py`
  (needs Pillow). It writes `<name>-800w.webp` / `-1600w.webp` and rewrites
  `_data/image_dimensions.yml`, which `picture.html` reads. Never hand-edit
  that data file.
- Serve WebP or AVIF with a fallback, and provide `srcset` for anything
  displayed wider than 600px. Uncompressed Procreate exports will destroy
  Largest Contentful Paint if dropped in raw.

---

## Accessibility and performance

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.
- Skip-to-content link as the first focusable element.
- Text contrast at least 4.5:1 in both themes. Check `--text-secondary`.
- The site must be fully usable with JavaScript disabled — JS enhances, never
  delivers, content or navigation state. The only JS is the theme toggle
  and the phone menu (deferred), plus a tiny inline head script that applies
  the saved theme and the `js` class before first paint.
- Target: no render-blocking requests beyond the single stylesheet, and a
  Lighthouse score of 95+ on all four categories.

---

## Things that have already gone wrong

- **Category filters linked to `#`** on the old site, making every facet
  invisible to search engines. They are real pages now, linked from each
  section index.
- **The sidebar design was dropped** (October 2026) for the single-column
  layout above. The View Transitions API was tried twice for its slide
  animation and failed both times; if page-to-page motion ever comes back,
  don't reach for it first.

---

## Working conventions

- One change at a time. When a request bundles structure and animation, or
  layout and content, do the structural half, verify it, then continue.
- Make one section work end to end before starting the next.
- When migrating existing content, preserve Mami's wording. The voice is
  first-person, plain, and a little wry. Don't inflate it.
- Run `bundle exec jekyll serve` and click through a page before saying it's
  done. For layout work, check `/`, `/projects/`,
  `/projects/category/work/`, `/projects/better/`, and `/blog/`, at phone
  width and in dark mode.
- Don't add dependencies without asking.
- Mami's workflow: commit and push changes straight to `main`, then send
  screenshots of every page (phone and desktop) once a change is done.
