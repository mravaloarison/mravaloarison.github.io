# Portfolio — Maminiaina "Mami" Ravaloarison

Personal portfolio and journal. Jekyll site deployed to GitHub Pages at
`https://mravaloarison.github.io/`. This file is the standing brief — read it
before making changes and follow it over your own defaults.

## Who this is for

- **Full name:** Maminiaina Ravaloarison
- **Display name:** Maminiaina Ravaloarison (goes by Mami)
- **Role:** Software Engineer (currently Junior Data Analyst, Monroe University)
- **Based:** New York, USA. From Madagascar.
- **Links:** github.com/mravaloarison · linkedin.com/in/mravaloarison · devpost.com/mrava
- **Email:** mravaloarison@gmail.com

Use the full name, **Maminiaina Ravaloarison**, everywhere visible: the
About h1, `<title>`s (via `site.title`), page descriptions, the footer.
"Mami" appears only where the bio says "I go by Mami" and as
`alternateName: "Mami Ravaloarison"` in the Person JSON-LD, so the short
form is still indexable.

## Stack and constraints

- Jekyll, built and deployed via GitHub Actions (not the legacy branch build),
  so plugins outside the GitHub Pages allowlist are available.
- **Hand-written CSS** in one stylesheet, organized with custom properties.
  No Tailwind, no Bootstrap, no CSS framework.
- Vanilla JS only, `defer`ed, and only where a feature genuinely needs it
  (the phone menu). The one exception is the tiny inline snippet in `<head>`
  that adds the `js` class before first paint. All content renders
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
the sliding sidebar back. The side nav on wide screens (see Layout) is
different: added later in October 2026 at Mami's request, it is only the
site nav, it never slides, and there is no on-this-page rail. A table of contents was tried again in October
2026 (left-margin list plus scroll highlight) and removed; don't re-add it
unless asked.

Fonts are self-hosted in `assets/fonts/` (`font-display: swap`), and only
what's used is shipped:

- **Newsreader** (`--font-serif`, variable weight, upright only) — h1,
  h2, h3, post titles in lists, card titles, and the
  abstract under each page title. Weight 500 for headings.
- **Nunito 400/600/700** (`--font-sans`) — body, nav, labels, meta, UI.
  Code stays monospace.
- **Noto Color Emoji** (`--font-emoji`) — subset to 🏆 (hackathon awards), 2.9 KB, `noto-color-emoji-theme.woff2`.
  Adding an emoji means re-fetching the subset from Google Fonts with
  `text=` set to all of them and updating `unicode-range`.

Newsreader latin and Nunito latin are preloaded from the head include.

**Nothing is italic** — not the abstract, not blockquotes, not Markdown
`*emphasis*` (`em`, `i`, `cite` are reset to `font-style: normal`). No
italic font file is shipped.

### Color

**Dark only.** There is no light theme and no theme toggle (removed October
2026 at Mami's request; don't bring either back unless asked). The tokens live
on `:root`, there is no `prefers-color-scheme` rule and no `data-theme`
attribute. The accent is **yellow** (`#f5c542`).

| Token              | Value     |
| ------------------ | --------- |
| `--bg`             | `#171513` |
| `--surface`        | `#211e1b` |
| `--text`           | `#ede8e0` |
| `--text-secondary` | `#a89f93` |
| `--accent`         | `#f5c542` |
| `--border`         | `#312d29` |

**Backgrounds are flat** `--bg`. A drawing-paper texture (grain, then an
embossed watercolor relief) was tried in October 2026 and removed at
Mami's request; don't bring it back unless asked.

All text pairs are at least 4.5:1 (accent: 11.2:1 on `--bg`, 4.7:1
on `--surface`). Links are ink-colored with a soft accent underline that
turns fully accent on hover. Use the accent sparingly: links, the callout and
award-box rule, the current-page dot in the nav.

### Type

| Role                    | Size                      | Font / weight         |
| ----------------------- | ------------------------- | --------------------- |
| Eyebrow                 | 14px, uppercase, 0.06em   | Nunito 600            |
| Page title (h1)         | clamp(36px, 6vw, 48px)    | Newsreader 500        |
| Abstract under h1       | 22px                      | Newsreader            |
| Bio text (short + long) | 22px, as the abstract     | Newsreader            |
| Section (h2)            | 29px                      | Newsreader 500        |
| Subsection (h3)         | 22px                      | Newsreader 500        |
| Body                    | 18px, line-height 1.65    | Nunito 400            |
| Meta / caption          | 15px                      | Nunito 400            |
| Nav link (side/drawer)  | 22px / 30px               | Newsreader 500        |
| Nav project type        | 16px / 18px               | Nunito 400            |

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96. Radii: 6px small, 10px
cards and images, pills fully rounded.

### Layout

- One text column, `--measure` 680px of text width, 24px side padding
  (16px under 600px). From 1040px the nav sits in a `--nav-width` (160px)
  column to its left with a 32px gap, and the two are centered together.
  No horizontal page scroll, ever.
- **Nav** (no logo, no site name): About · Projects · Arts · Blog, with the
  project types (Work · Personal · Hackathons, from `_data/categories.yml`)
  indented under Projects. The look Mami liked in the phone drawer:
  Newsreader links with a hairline between items (none after the last), the
  types in Nunito, indented. All links are `--text-secondary`; hover and the
  current page go to `--text`, and the current page also gets a 6px accent
  dot hanging in the margin, so it isn't marked by colour alone
  (`aria-current` for screen readers). Only the most specific item gets the
  dot: on a project page it's on the type and Projects just brightens
  (`:has()`). The Arts link only appears once `_arts/` has a piece. About is
  current on both `/` and `/bio/`.
- **1040px and up**: the nav is a sticky column on the left, 88px from the
  top so "About" lines up with the h1 (`main` has 96px top padding). Links
  are 22px and types 16px, below the 29px h2, so the page leads and the nav
  stays quiet. Pure CSS, works with JS off.
- **Below 1040px**: a burger at the top right (drawer links 30px, types 18px). It morphs into an × and slides
  the nav in from the right as a drawer (360ms,
  `cubic-bezier(0.32, 0.72, 0, 1)`), links fading in one after another, with
  a dim overlay behind. Escape, the overlay, or the × closes it; focus stays
  inside while open. This only applies when `html.js` is set by the head
  script — with JS off the nav is a plain row of small links instead.
- **Photo grid** (`photo-grid.html`): personal photos, leerob.com style, at
  the end of the full bio (`/bio/`). Listed in `_data/photos.yml`, files in
  `assets/images/photos/`, run through `optimize-images.py`. First photo
  large, up to five. Hidden until the list has an entry.
- Footer: a hairline, then Email · GitHub · LinkedIn · Devpost · RSS and
  the copyright line.
- Post lists are quiet rows: serif title on the left, date on the right,
  hairline between rows (`post-list.html`).
- Project cards: image first (rounded, hairline border), serif title, then
  on award projects one line "🏆 university · year", then the description.
  No tech stack on cards — it's on each project page. Cards in a row line up
  part by part (CSS subgrid: image, title, award, description rows), so an
  award line never knocks a neighbour's description out of line; the award
  line never wraps. No boxes around cards, no shadows. On hover the
  card never moves (no lift); the cover image zooms to 1.04 inside its
  frame (`overflow: hidden`, 300ms) and the title turns accent.

### Components in `_includes/`

- `breadcrumb.html` — on every page below the top level, including the group,
  starting at the section (there is no home page, only About):
  Projects / Hackathons / Better. Same in the BreadcrumbList JSON-LD.
- `page-header.html` — eyebrow, h1, serif abstract. Every page opens with
  it — About, section indexes, category/medium/tag/year pages, and detail
  pages — so titles and intros are the same size everywhere. Never write a
  page's eyebrow/h1/intro by hand in Markdown.
- `post-list.html` — title/date rows; `descriptions=true` adds a line under each
- `blog-browse.html` — By year / By tag links, on the blog index and every year/tag page
- `metadata-row.html` — the "In progress" pill (when `status: ongoing`),
  then the tech stack as a boxless row: 24px icon + name, each
  linking to the tech's official site (new tab, `rel="noopener"`, since the
  reader is mid-article). Tech without a `url` renders unlinked.
- `tech-icon.html` — one tech icon (`px` sets the size; not `size`, which
  Liquid reserves). Icons are Icons8 "Color" 48px PNGs in
  `assets/icons/tech/`; icon and link per exact tech name live in
  `_data/tech_icons.yml` (fallback `source-code.png`). Every tech gets its
  own icon where Icons8 has one (Firebase and Firestore differ). The free
  Icons8 licence needs the "Icons by Icons8" footer link — never remove it.
- `card-grid.html` — project cards: image, title (plus the "In progress"
  pill on ongoing projects), `award.html size="card"` on award projects,
  description. Nothing on the cover image, no tech row.
- `award.html` — a hackathon award as one unit: 🏆 hanging on the left, the
  award in bold `--text`, then **university · event · year** in
  `--text-secondary` (university first: it's the name people recognise).
  Lines only break between parts, never inside a name. `size="large"` on
  project pages puts it in a callout-style box (`--surface`, 3px accent
  rule). `size="card"` is a single line, "🏆 university · year" (all six
  fit a 303px card; ellipsis is only a safety net), with the award name in
  `sr-only` text — the card descriptions already name the award. No foil,
  nothing over the image, no animation.
- `see-also.html` — trailing block of related links (details below)
- `callout.html` — Note / Tip / Looking for aside with a left accent rule
- `figure.html` — image plus caption, used heavily on Arts
- `picture.html` — every content image goes through this: `<picture>` with the
  WebP variants from `_data/image_dimensions.yml`, original as fallback
- `gallery-grid.html` — the dense square grid used on Arts
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

### About (`/`) and full bio (`/bio/`)

**All About text lives in `_data/about.yml`** — the headline under the name,
the "Looking for" box, the Bio (Markdown), and every resume section
(experience, education, awards, certificates, languages, interests).
`index.md` and `bio.md` are layout only. In the YAML, `%email%` becomes the
site email and `%drawing%` becomes the Arts link once art exists. Edit
content there, never in the layout files.

Both About pages use the same format, modelled on leerob.com's Default | Long
bio: the name as the h1, then a "Bio" row (`bio-tabs.html`): "Bio" on the
left and **Short | Long** on the right, 15px Nunito in `--text-secondary`,
one hairline under the row, the current tab in `--text` with a 1px underline
sitting on the hairline. No eyebrow, no abstract. The bio text under the row
is `.bio-text` on both pages, which shares its font with `.abstract`
(Newsreader 22px, `--text-secondary`; Mami wants this serif for both). Only
the content under the tabs differs:

- **Short (`/`, `index.md`)**: the headline (in `.bio-text`), the profile
  links (email, GitHub, LinkedIn, Devpost, Resume), the "Looking for" callout
  (off while `looking_for:` is empty), then **Projects** (the two most recent
  projects by date, with "See all N projects") and **Blog** (the two most
  recent posts, with "See all blog posts").
- **Long (`/bio/`, `bio.md`)**: the Bio text (Markdown from `about.yml`, in
  `.bio-text`), the personal photo grid, then Experience, Education, Awards,
  Certificates, Languages and Interests. The hackathon award lists every project with an
  `award` as rows like the post list (🏆, award and project on the left,
  university and year on the right; each row links to the project), then
  "All 12 hackathon wins on Devpost". Existing copy is good — keep its voice, don't
  corporate-ize it.

`featured: true` in the front matter is still unused.

### Projects

Thirteen items, grouped **Work (2) · Personal (5) · Hackathons (6)**. Each
already has a detail page and a screenshot in `assets/images/`. Discover
Nature was removed on purpose — don't bring it back from the old site.
MyTime has no public code or screenshots yet; its image is a placeholder
cover to replace with real screens. MyTime and DogDuckGo are ongoing
(`status: ongoing` in front matter → "In progress" pill on cards and the
detail page, `creativeWorkStatus` in JSON-LD); drop the field when one ships. DogDuckGo's repo (mravaloarison/save)
is private, so it has no GitHub link.

The index at `/projects/` shows the two most recent projects per type
under each heading, then "See all N … projects" to the category page when
there are more. Each category page shows all of its own.

Detail page order: breadcrumb → eyebrow (category) → title → abstract →
award box (award, university, event, year) → metadata row (tech stack) →
Overview →
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
`{% seo %}` is in the head include, with its JSON-LD stripped (see below).

Plus the site's own plugins in `_plugins/` (fine, since it builds with
GitHub Actions — `.github/workflows/pages.yml`, Pages source "GitHub Actions"):

- `structured_data.rb` — the `{% structured_data %}` tag in `head.html`:
  one JSON-LD `@graph` per page. The only JSON-LD on the site besides
  `breadcrumb.html`'s BreadcrumbList — don't add a second one.
- `sitemap_and_llms.rb` — writes `/sitemap.xml` (with an image entry for
  every screenshot, artwork and About photo; replaces jekyll-sitemap's, which
  then skips itself), `/llms.txt` and `/llms-full.txt` (everything on the
  site as plain Markdown for AI assistants, built from the raw content).
- `content_check.rb` — the build-time check from linking rule 8.
- `seo_helpers.rb` — shared helpers, including `award_text`, the one wording
  for a hackathon award wherever search engines and AI assistants look:
  "Best Use of Knot API at HackPrinceton (Princeton University, 2025)" —
  always with the university and the year. JSON-LD (`award` on the project
  and on the Person) and `llms.txt` / `llms-full.txt` all use it.
- `seo_award_description.rb` — on award projects, the meta, Open Graph and
  Twitter descriptions start with "Won <award_text>." and then the project's
  description, so Google's snippet shows the award, university and year
  even though the page abstract (Mami's wording) doesn't repeat them. Other
  pages keep jekyll-seo-tag's normal description.

All of it is generated from existing content, so new projects, posts, art
and photos are picked up with no extra work. Facts that aren't visible on the
page (full/given/family name, other names, job titles, employer, location,
country, extra topics) live under `profile:` in `_data/about.yml`.

### `_config.yml`

```yaml
title: Maminiaina Ravaloarison
tagline: Software Engineer
description: >-
    Maminiaina "Mami" Ravaloarison — Software Engineer in New York.
    Projects, writing, and drawings.
url: https://mravaloarison.github.io
author:
    name: Maminiaina Ravaloarison
    email: mravaloarison@gmail.com
social:
    name: Maminiaina Ravaloarison
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

Implemented in `_plugins/structured_data.rb`. Every page carries the full
`Person` (fixed `@id` `/#person`) and the `WebSite`, then its own node, all
pointing back to that `@id`:

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
- RSS feed at `/feed.xml` for the blog, `/feed/projects.xml` for projects.
- `robots.txt` names the AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, …) as allowed, and points at `/llms.txt`.
- Every page: `<meta name="robots">` with `max-image-preview:large` (or
  `noindex` on the 404 and empty Arts pages), `og:image:alt`, `rel="me"`
  links to the profiles, and a link to `/llms.txt`.
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
- Text contrast at least 4.5:1. Check `--text-secondary`.
- The site must be fully usable with JavaScript disabled — JS enhances, never
  delivers, content or navigation state. The only JS is the phone menu
  (deferred), plus a tiny inline head script that adds the `js` class before
  first paint.
- Target: no render-blocking requests beyond the single stylesheet, and a
  Lighthouse score of 95+ on all four categories.

---

## Things that have already gone wrong

- **A colon in front matter broke a page silently** (October 2026): a
  `description:` containing ": " is invalid YAML, and Jekyll only warns
  ("YAML Exception") and publishes the page without its front matter (no
  layout, no permalink). Avoid ": " in unquoted values or quote them, and
  check the build output for "YAML Exception".
- **A gold-foil award band with looping confetti** sat over the bottom of
  each hackathon card's screenshot until October 2026. It hid the image,
  moved forever (WCAG 2.2.2), outshouted the project titles, and split the
  award from its university on project pages. Replaced by `award.html`.
- **Pages jumped sideways between each other** (October 2026): with a mouse
  or "always show scroll bars", short pages that don't scroll (`/blog/`,
  `/projects/category/work/`) had no scrollbar, so the centred layout sat
  7px off from every long page. `html { scrollbar-gutter: stable; }` keeps
  the scrollbar's space on every page. Keep it.
- **Stale CSS after a deploy** (October 2026): GitHub Pages lets browsers
  cache assets for 10 minutes and a normal reload keeps them, so new markup
  showed up with the old stylesheet and looked broken. The stylesheet and
  script links carry `?v={{ site.time | date: '%s' }}` so every build gets a
  new URL. Keep it.
- **A light theme existed** until October 2026, with a day/night toggle in the
  header and `sessionStorage` to carry the choice. Mami asked for dark only;
  the toggle, light tokens and their script were all removed.
- **Category filters linked to `#`** on the old site, making every facet
  invisible to search engines. They are real pages now, linked from each
  section index.
- **A drawings column beside the About Bio was tried and removed** (October
  2026): stacked, then fixed, then a sideways carousel with placeholder
  art. Mami didn't like it. Don't bring back art on the About page unless
  asked.
- **A logo in the header** (the M mark) was tried in October 2026 and removed
  when the nav moved to the side; the favicon still uses the mark.
- **The sidebar design was dropped** (October 2026) for the single-column
  layout above (the later wide-screen side nav is the site nav only). The View Transitions API was tried twice for its slide
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
  width, a tablet width (burger) and 1040px+ (side nav).
- Don't add dependencies without asking.
- Mami's workflow: commit and push changes straight to `main`, then send
  screenshots of every page (phone and desktop) once a change is done.
