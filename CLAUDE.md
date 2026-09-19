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
  (nav drawer, theme toggle, on-this-page scroll spy). All content renders
  server-side at build time — never fetch or render content client-side.
- No jQuery. No build step beyond Jekyll itself.
- Components live in `_includes/` as Liquid partials. Filenames kebab-case.

---

## Design language: Apple developer documentation

The visual target is Apple's developer documentation — quiet, dense with
information, structured, high-contrast text on near-white, hairline rules
instead of boxes and shadows. It should feel like a reference manual for a
person, not a marketing page.

**This is an aesthetic direction, not a clone.** Never use Apple's logo,
wordmark, icons, or any Apple branding. Never self-host SF Pro or SF Mono —
they're licensed fonts. Use the system font stack, which renders as SF on
Apple devices and degrades cleanly elsewhere, and costs zero network requests.

### Tokens

Define all of these on `:root`, redefine under
`@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`,
and again under `:root[data-theme="dark"]` so the manual toggle works.

```
Light                          Dark
--bg:              #ffffff     #000000
--bg-elevated:     #fbfbfd     #1d1d1f
--fill:            #f5f5f7     #2c2c2e
--text:            #1d1d1f     #f5f5f7
--text-secondary:  #6e6e73     #a1a1a6
--text-tertiary:   #86868b     #86868b
--link:            #0066cc     #2997ff
--border:          #d2d2d7     #424245
--border-subtle:   #e8e8ed     #333336
```

Give `body` an explicit background. Ship a theme toggle that defaults to
system preference and remembers the choice in `localStorage` inside a
try/catch — the page must render correctly if storage throws.

### Type

```
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             Helvetica, Arial, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
```

| Role                                | Size                   | Weight | Tracking |
| ----------------------------------- | ---------------------- | ------ | -------- |
| Eyebrow (section label above title) | 12px, uppercase        | 600    | 0.08em   |
| Page title (h1)                     | clamp(32px, 5vw, 40px) | 700    | -0.015em |
| Section (h2)                        | 28px                   | 600    | -0.01em  |
| Subsection (h3)                     | 21px                   | 600    | normal   |
| Body                                | 17px, line-height 1.6  | 400    | normal   |
| Meta / caption                      | 14px                   | 400    | normal   |

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
Radii: 8px small, 12px cards, 18px large panels.

### Layout

Three columns on wide screens, which is the signature of the reference:

```
[ sidebar 260px ][ content max 800px ][ on-this-page 200px ]
```

- Container max 1400px, centered.
- Sidebar is persistent and sticky. It lists **every item** in the current
  section with disclosure groups — this is how the site guarantees nothing is
  orphaned. Current item highlighted.
- Below 1024px the sidebar collapses to a slide-out drawer behind a menu
  button; the on-this-page rail disappears into a collapsible summary at the
  top of the article.
- 16px side gutter at phone width. No horizontal page scroll, ever.

### Components to build in `_includes/`

- `breadcrumb.html` — on every page below the top level. Home › Projects › Better
- `page-header.html` — eyebrow, h1, one-paragraph abstract in `--text-secondary`
- `metadata-row.html` — pill badges for tech stack, styled like availability
  badges: small, hairline border, no fill, `--text-secondary`
- `card-grid.html` — a "Topics" grid. Hairline border, 12px radius, subtle
  hover lift only, no drop shadows
- `see-also.html` — trailing block of related links (details below)
- `on-this-page.html` — builds from h2/h3 in the article, with scroll spy
- `callout.html` — Note / Tip aside with a left accent rule
- `figure.html` — image plus caption, used heavily on Arts
- `prev-next.html` — sibling navigation within a collection

Transitions are 150–200ms ease, opacity and small transforms only. Nothing
bouncy. Honor `prefers-reduced-motion: reduce`. Visible focus rings on every
interactive element.

---

## Site architecture

Four top-level sections. Every one has an index and per-item detail pages.

```
/                         About me       (the person as a reference page)
/projects/                Projects       → /projects/:slug/
/arts/                    Arts           → /arts/:slug/
/blog/                    Blog & Journal → /blog/:year/:month/:day/:slug/
```

### About (`/`)

A long-form documentation page, not a landing page. Structure it as:
Overview (the bio) → Topics: Experience, Education, Awards, Certificates,
Languages, Interests. On-this-page rail active. Existing copy is good — keep
its voice, don't corporate-ize it.

### Projects

Grouped by category: **Work**, **Personal**, **Hackathons**. Twelve items
exist today; each already has a detail page and a screenshot in
`assets/images/`.

Detail page order: breadcrumb → eyebrow (category) → title → abstract →
metadata row (tech stack) + award badges + host university → Overview →
screenshots → "What I built" → outbound links (live demo, GitHub, Devpost) →
See Also → prev/next.

### Arts

New section. Mami draws, and recently started digital work in Procreate.
Group by medium: **Procreate**, **Traditional**, **Sketchbook**.

Index is a gallery grid, denser than the projects grid. Detail page shows the
full piece large, then medium, tools, date, and a short note about the piece.
Art is image-heavy — this is where performance and alt text matter most. See
the image rules below; do not skip them here.

### Blog / Journal

Reverse-chronological. Two posts exist. Tag facets: `first-post`, `life`,
`technology`. Show date and reading time. Post pages get the on-this-page rail
when they have three or more h2s.

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
category: # Work | Personal | Hackathon
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
```

### Front matter — `_arts/*.md`

```yaml
title:
description:
medium: # Procreate | Traditional | Sketchbook
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
2. **The sidebar lists every item in the current section**, grouped by
   category/medium/tag. This is the guarantee that nothing is orphaned.
3. **Category and tag facets are real pages**, generated at build time —
   `/projects/category/hackathons/`, `/blog/tag/technology/`,
   `/arts/medium/procreate/`. The current site links these to `#`, which
   means search engines see zero of them. Fix this.
4. **`see-also.html` renders on every detail page and is never empty.** Use
   `related` when set; otherwise fall back to same category/tag, then to most
   recent in the collection.
5. **Prev/next** sibling links at the bottom of every detail page.
6. **Descriptive anchor text.** Replace "Read more" with the post title, or
   "Read: {{ title }}". Never "click here", "view", or a bare URL.
7. Outbound links to GitHub/Devpost/demos open in the same tab unless the
   user is mid-article; if `target="_blank"`, always pair with
   `rel="noopener"`.
8. Add a build-time check: fail the build if any collection item lacks
   `title`, `description`, or `image_alt`.

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

- Unique `title` and `description` on every single page. No page inherits a
  generic site description.
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
- Every page below root → `BreadcrumbList`.

Validate output against Google's Rich Results Test before considering a page
done.

### Crawlability

- `sitemap.xml` generated and referenced from `robots.txt`.
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
- Serve WebP or AVIF with a fallback, and provide `srcset` for anything
  displayed wider than 600px. Uncompressed Procreate exports will destroy
  Largest Contentful Paint if dropped in raw.

---

## Accessibility and performance

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.
- Skip-to-content link as the first focusable element.
- Text contrast at least 4.5:1 in both themes. Check `--text-secondary`.
- Nav drawer traps focus while open and closes on Escape.
- The site must be fully usable with JavaScript disabled — JS enhances, never
  delivers, content.
- Target: no render-blocking requests beyond the single stylesheet, and a
  Lighthouse score of 95+ on all four categories.

---

## Working conventions

- Make one section work end to end before starting the next. Order:
  design system → layout shell → Projects → About → Blog → Arts → SEO pass.
- When migrating existing content, preserve Mami's wording. The voice is
  first-person, plain, and a little wry. Don't inflate it.
- Run `bundle exec jekyll serve` and check a page before saying it's done.
- Don't add dependencies without asking.
