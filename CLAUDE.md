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
  (drawer toggle, theme toggle, scroll spy). The nav-direction snippet is the
  one exception — it is inline in `<head>` and not deferred, because it must
  run before first paint. All content renders server-side at build time —
  never fetch or render content client-side.
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

| Role                                | Size                   | Weight                | Tracking |
| ----------------------------------- | ---------------------- | --------------------- | -------- |
| Eyebrow (section label above title) | 12px, uppercase        | 600                   | 0.08em   |
| Page title (h1)                     | clamp(32px, 5vw, 40px) | 700                   | -0.015em |
| Section (h2)                        | 28px                   | 600                   | -0.01em  |
| Subsection (h3)                     | 21px                   | 600                   | normal   |
| Body                                | 17px, line-height 1.6  | 400                   | normal   |
| Meta / caption                      | 14px                   | 400                   | normal   |
| Sidebar row                         | 14px                   | 400 (600 when active) | normal   |

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
Radii: 8px small, 12px cards, 18px large panels.

### Layout

Three columns on wide screens, which is the signature of the reference:

```
[ sidebar 260px ][ content max 800px ][ on-this-page 200px ]
```

- Container max 1400px, centered.
- Sidebar is persistent and sticky, and uses push navigation — see the next
  section, which is the most detailed part of this brief.
- Below 1024px the sidebar collapses to a slide-out drawer behind a menu
  button; the on-this-page rail disappears into a collapsible summary at the
  top of the article.
- 16px side gutter at phone width. No horizontal page scroll, ever.

---

## Sidebar navigation

The sidebar is **push navigation** — a drill-down, the pattern Facebook's
account menu uses — not a flat list and not disclosure groups. Selecting a
row slides the panel left to reveal a deeper panel; a back row at the top
slides it right.

### Three levels

```
Level 0   /                          About me · Projects › · Arts › · Blog ›

Level 1   /projects/                 ← Projects            → /
                                     Work (2) ›            → /projects/category/work/
                                     Personal (3) ›        → /projects/category/personal/
                                     Hackathons (6) ›      → /projects/category/hackathons/

Level 2   /projects/category/work/   ← Work                → /projects/
                                     ARAP SharePoint
                                     ARAP Databook
```

**The header row is a single row** — back chevron plus the current panel's
name — and the whole row links to the parent, Facebook style. There is no
separate title row and no row that links to the page you're already on. Its
accessible name states the destination ("Back to all sections", "Back to
Projects"), not just the arrow.

Because the category page is not linked from the panel while you're on a
detail page, the breadcrumb carries it: Home › Projects › Work › ARAP
SharePoint.

Arts mirrors this with **mediums** (Procreate, Traditional, Sketchbook), Blog
with **years**, newest first.

On a detail page — `/projects/better/` — the sidebar renders **level 2 for
that item's group**, with the item highlighted. The group comes from front
matter (`category`, `medium`, or the post's year). Counts are derived from the
collection at build time; never hardcode them.

### Rules that are not negotiable

1. **The open panel is server-rendered by Jekyll from the current URL.** No JS
   decides it. Hard refresh, JS disabled, and a crawler all get the correct
   panel in the HTML.
2. **Every row is a real `<a href>`.** Selecting "Projects" navigates to
   `/projects/` — the URL changes and the content column renders the Projects
   index. Never a JS-only panel switch that leaves the URL alone.
3. **The nav hierarchy and the URL hierarchy are the same thing.** Level 1 is
   the section index, level 2 is a category page. Those category pages are
   required anyway (see Linking rules) — the drill-down is just a view of
   them.
4. **Only the sidebar panel animates.** The content column, header, and
   on-this-page rail stay completely still during a navigation. No fade, no
   transform on the container.

### The slide

**Do not use the View Transitions API.** It was tried twice and failed both
times — once animating the whole container, once not firing at all. The
approach below is settled: a CSS keyframe on the panel, played on page load,
with direction derived from nav depth. It works in every browser and cannot
leak onto the content column.

Nav depth goes on `<html>`, rendered by Jekyll: `0` for `/`, `1` for a section
index (`/projects/`, `/arts/`, `/blog/`), `2` for a category page or any
detail page.

```html
<html lang="en" data-nav-depth="2"></html>
```

An **inline, non-deferred** script in `<head>` compares it to the previous
page's depth. This is the one exception to the defer-everything rule — it has
to run before first paint.

```html
<script>
	(function () {
		var el = document.documentElement;
		var depth = Number(el.dataset.navDepth || 0);
		var prev = null;
		try {
			prev = sessionStorage.getItem("navDepth");
		} catch (e) {}
		if (prev !== null) {
			var p = Number(prev);
			if (depth > p) el.dataset.navDir = "forward";
			else if (depth < p) el.dataset.navDir = "back";
		}
		try {
			sessionStorage.setItem("navDepth", String(depth));
		} catch (e) {}
	})();
</script>
```

```css
.sidebar {
	overflow-x: clip;
}

@media (prefers-reduced-motion: no-preference) {
	:root[data-nav-dir="forward"] .sidebar-panel {
		animation: panel-from-right 260ms cubic-bezier(0.32, 0.72, 0, 1) both;
	}
	:root[data-nav-dir="back"] .sidebar-panel {
		animation: panel-from-left 260ms cubic-bezier(0.32, 0.72, 0, 1) both;
	}
}

@keyframes panel-from-right {
	from {
		transform: translateX(100%);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}
@keyframes panel-from-left {
	from {
		transform: translateX(-100%);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}
```

Rules around it:

- The animation selector targets `.sidebar-panel` and nothing else. If the
  content column moves, the selector is wrong.
- `overflow-x: clip` on `.sidebar` keeps the incoming panel from flying across
  the content column. Don't drop it, and don't swap it for `overflow: hidden`,
  which breaks sticky positioning.
- Depth 2 → depth 2 (a category page to a detail page in the same category)
  produces no animation. That's correct — the panel didn't change, only the
  highlighted row.
- With JS off, `data-nav-dir` is never set, no rule matches, and the panel
  renders normally at full opacity.
- Only the new panel slides in; the outgoing one is gone with the old
  document. That is accepted, not a bug to fix.

Mobile: the same drill-down inside the existing drawer. Don't change how the
drawer opens or closes.

### Components to build in `_includes/`

- `sidebar.html` — picks the panel from `page.url` and the collection
- `sidebar-panel.html` — one panel: back row, title, rows
- `sidebar-back-row.html` — ← chevron plus parent label
- `breadcrumb.html` — on every page below the top level, including the group:
  Home › Projects › Hackathons › Better
- `page-header.html` — eyebrow, h1, one-paragraph abstract in `--text-secondary`
- `metadata-row.html` — pill badges for tech stack, styled like availability
  badges: small, hairline border, no fill, `--text-secondary`
- `card-grid.html` — a "Topics" grid. Hairline border, 12px radius, subtle
  hover lift only, no drop shadows
- `see-also.html` — trailing block of related links (details below)
- `on-this-page.html` — builds from h2/h3 in the article, with scroll spy
- `callout.html` — Note / Tip aside with a left accent rule
- `figure.html` — image plus caption, used heavily on Arts
- `picture.html` — every content image goes through this: `<picture>` with the
  WebP variants from `_data/image_dimensions.yml`, original as fallback
- `gallery-grid.html` — the dense square grid used on Arts
- `prev-next.html` — sibling navigation within a collection

Transitions elsewhere are 150–200ms ease, opacity and small transforms only.
Nothing bouncy. Honor `prefers-reduced-motion: reduce`. Visible focus rings on
every interactive element.

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

A long-form documentation page, not a landing page. Structure it as:
Overview (the bio) → Topics: Experience, Education, Awards, Certificates,
Languages, Interests. A "Looking for" callout (currently: graduate programs
and scholarships) sits between the profile links and the Overview, and the
hackathon award lists every project with an `award` in its front matter. On-this-page rail active. Existing copy is good — keep
its voice, don't corporate-ize it.

### Projects

Eleven items, grouped **Work (2) · Personal (3) · Hackathons (6)**. Each
already has a detail page and a screenshot in `assets/images/`. Discover
Nature was removed on purpose — don't bring it back from the old site.

The index at `/projects/` shows all eleven under category headings. Each
category page shows only its own.

Detail page order: breadcrumb → eyebrow (category) → title → abstract →
metadata row (tech stack) + award badges + host university → Overview →
screenshots → "What I built" → outbound links (live demo, GitHub, Devpost) →
See Also → prev/next.

### Arts

New section. Mami draws, and recently started digital work in Procreate.
Grouped by medium: **Procreate**, **Traditional**, **Sketchbook**.

Built and waiting for the first piece. Until `_arts/` has at least one item,
the Arts sidebar row and the "drawing" link in the About bio stay hidden, and
the Arts pages render a short note with `noindex`. All of that switches on by
itself when the first piece is added — copy `_arts/_TEMPLATE.md` (ignored by
Jekyll because of the underscore) and follow the steps in it.

Index is a gallery grid, denser than the projects grid. Detail page shows the
full piece large, then medium, tools, date, and a short note about the piece.
Art is image-heavy — this is where performance and alt text matter most. See
the image rules below; do not skip them here.

### Blog / Journal

Reverse-chronological. Two posts exist. Tags: `first-post`, `life`,
`technology`. Show date and reading time. The sidebar groups posts by year;
the tag pages are separate facets. Post pages get the on-this-page rail when
they have three or more h2s.

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
category: # Work | Personal | Hackathon — drives the sidebar panel
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
medium: # Procreate | Traditional | Sketchbook — drives the sidebar panel
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
2. **Every item is reachable from the sidebar in at most two selections**
   from its section panel. This is the guarantee that nothing is orphaned.
3. **Category, medium, and tag pages are real pages**, generated at build
   time — `/projects/category/hackathons/`, `/arts/medium/procreate/`,
   `/blog/tag/technology/`. They double as the level-2 sidebar panels. The
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
- The sidebar back row is a link, reachable by keyboard, with an accessible
  name that says where it goes ("Back to Projects"), not just "←".
- Nav drawer traps focus while open and closes on Escape.
- The site must be fully usable with JavaScript disabled — JS enhances, never
  delivers, content or navigation state.
- Target: no render-blocking requests beyond the single stylesheet, and a
  Lighthouse score of 95+ on all four categories.

---

## Things that have already gone wrong

Read this before touching the sidebar.

- **View Transitions failed twice and are now banned for this feature.** First
  attempt: `@view-transition` without a scoped name, so the default root
  transition slid the whole content container. Second attempt: the panels were
  correct but nothing animated at all. Use the keyframe approach in "The
  slide" — do not reintroduce the API, even as an enhancement.
- **The sidebar stayed a flat list while the animation was added.** Structure
  first, motion second — an animation has nothing to slide between until the
  panels exist. If asked for both at once, build and verify the panels
  before writing a line of animation CSS.
- **The level-1 panel had a "Projects" row that linked to `/projects/`** while
  already on `/projects/`. A panel never contains a link to the page it is
  currently showing.
- **Category filters linked to `#`** on the old site, making every facet
  invisible to search engines. They are real pages now, and they are also the
  level-2 panels.

---

## Working conventions

- One change at a time. When a request bundles structure and animation, or
  layout and content, do the structural half, verify it, then continue.
- Make one section work end to end before starting the next. Order:
  design system → layout shell → sidebar → Projects → About → Blog → Arts →
  SEO pass.
- When migrating existing content, preserve Mami's wording. The voice is
  first-person, plain, and a little wry. Don't inflate it.
- Run `bundle exec jekyll serve` and click through a page before saying it's
  done. For sidebar work, check `/`, `/projects/`,
  `/projects/category/work/`, and `/projects/better/`.
- Don't add dependencies without asking.
