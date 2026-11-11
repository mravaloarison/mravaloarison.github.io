# Portfolio — Maminiaina "Mami" Ravaloarison

Personal portfolio and journal. Jekyll site deployed to GitHub Pages at
`https://mravaloarison.github.io/`. This file is the standing brief — read it
before making changes and follow it over your own defaults.

## Who this is for

- **Full name:** Maminiaina Ravaloarison
- **Display name:** Maminiaina Ravaloarison (goes by Mami)
- **Role:** Product Engineer (Mami's title since November 2026, in place of
  "software engineer and data analyst"; the day job is still Junior Data
  Analyst at Monroe University, under Experience and in the bio)
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
  (the phone menu, the menu dropdowns, the Arts picture viewer, the
  first-visit intro, content coming in as it scrolls into view). The one exception is the tiny inline snippet in
  `<head>` that adds the `js` class (and `intro`, see Intro) before first
  paint. All content renders
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

Newsreader latin and Nunito latin are preloaded from the head include.

**Emoji are images, not a font** (an emoji font failed on iPhone, see
"Things that have already gone wrong"). The one the site uses, 🏆 on
awards, is Google's Noto Emoji artwork as an SVG in `assets/emoji/`
(`trophy.svg`), copied unchanged from github.com/googlefonts/noto-emoji
(`2D/svg/`, Apache 2.0, with `LICENSE` beside it — keep it). To add one,
copy `2D/svg/emoji_u<codepoint>.svg` in under a plain name, list it at the
top of `LICENSE`, and use it as an `<img>` with `width`, `height` and
`alt=""` (the text beside it carries the meaning). (A 🔗 after list titles
was removed in November 2026: Mami found it ugly.)

**Logo**: Mami's own Procreate drawing (November 2026) of a yellow
Labrador's head in profile, in sunglasses, with a brown collar and a yellow
paw-print tag (Mami loves the tag), textured like crayon, with a cream
sticker-style edge that keeps it readable on dark browser tabs. It's the
browser-tab icon, the iPhone home-screen icon, the corner of the share
image, and, since November 2026 at Mami's request, on every page (see Nav).
It replaced a placeholder Claude drew
the same day from a reference Mami liked. Source: `_brand/logo.png`
(2048×2048, transparent background; `_brand/` isn't published).
`python3 scripts/make-icons.py [new-drawing.png]` saves a new drawing to
`_brand/logo.png` without its metadata and writes `favicon.ico`
(16/32/48), `icon-192.png`, `apple-touch-icon.png` (180, on warm paper,
since iOS needs it opaque), `assets/brand/logo.webp` / `.png` (168 px,
the on-page logo), `assets/brand/logo-512.webp` (the intro's still),
`assets/brand/logo-1024.webp` (the logo big in the viewer) and the share
card `assets/social/og-default.png`. The logo animation (below) isn't made
by that script: a new drawing needs a new animation to match (or delete the
strips and `_data/logo_animation.yml`, and the still logo is used
everywhere). A new version: a 2048×2048 px square
canvas, transparent background (background layer hidden), exported as
PNG, with bold shapes and thick outlines, because it's mostly seen 16–32 px
wide. There's no SVG favicon on purpose, so a PNG drawing drops in with no
other change.

**Logo animation** (Mami's own, drawn in Procreate, November 2026): 10
frames at 14 fps, 0.72 s: a glint sweeps across the sunglasses, then the
ear flicks; it starts on the logo at rest and its last frame leads back
into it. It replaced a hello clip Claude had rendered from the logo. Mami's
export is kept as `_brand/logo-animation.mp4`; `python3
scripts/make-logo-animation.py [new-export]` (Pillow, plus ffmpeg for an
MP4) lines the frames up with `_brand/logo.png` (this export sat 53 px
higher on its canvas), cuts the dog out of the MP4's black background with
the logo's own outline (so anything animated has to stay inside the sticker
edge; Procreate's Animated PNG with the background hidden avoids that), and
writes the frames side by side as `assets/brand/logo-anim-512.webp`
(~170 KB) and `logo-anim-1024.webp` (~570 KB), plus
`_data/logo_animation.yml` (frames, length, strips). The layout puts that on
the logo link (`data-anim-*`) and `main.js` steps through the strip with a
`steps()` animation over the still (`.logo-anim`), picking the smallest
strip that's sharp at the size shown. It plays in three places, all at
Mami's request: the first-visit intro (see Intro); **on a reload**, the
logo plays it once where it sits (not on ordinary page-to-page clicks, not
with reduced motion); and **in the viewer**: when the logo opens big it
plays once right after the zoom, and a replay button (↻, left of ⓘ, only
for the logo) plays it again, reduced motion or not.

**Share card** (`og-default.png`, 1200×630, the image link previews show
for About, Blog and every page without its own): since November 2026 it's
drawn by `make-icons.py` in the site's look, because Mami found the old
card's font too far from the site's: dark `--bg`, the logo top left, a
PORTFOLIO eyebrow in Nunito, the full name in Newsreader 500, then
`CARD_LINE` in Newsreader (Mami's points: product engineer, 12 hackathon
wins, draws and plays bass on the side; "iOS developer" was taken out at
Mami's request, November 2026, here and in the short line), and the
address in Nunito with an accent underline. Edit `CARD_NAME`
/ `CARD_LINE` in the script and run it to change the card.

**Intro** (Mami's request, November 2026): the first page someone opens
in a tab starts with the dog in the middle of the screen, just the dog,
nothing under it: it fades in, plays Mami's logo animation (above) about
0.56 s in, and a beat after its last frame glides into its place as the
logo; just as it gets there the page comes in the way iOS brings in a
screen: the blocks on screen (the nav items or the burger, each child of
`main`, the footer) rise 16px into place one after another, top to bottom,
fading in from a light blur (700ms each, 55ms apart, no bounce). About 3 s
in all. The inline `<head>` script decides it before the first paint
(`html.intro`, which covers the page; `sessionStorage` `intro-seen` so it
plays once per tab) and starts loading the still and the 512 strip right
away; it skips the intro when the device asks for reduced motion, storage
is off, or the first page is a piece of art (a shared link shows the
picture at once; the tab then counts as seen); `initIntro` in `main.js`
runs it. If the strip hasn't arrived by 1.5 s the still dog just glides;
it glides by 3 s whatever happens; and if `main.js` itself only runs after
2.5 s (a very slow connection, the cover already lifted) there's no intro.
Any tap, key, scroll or wheel ends it at once, the page shown as it is; if
the script never runs, the cover lifts itself after 3 s. Search engines
and no-JS visitors never see it.

**Nothing is italic** — not the abstract, not blockquotes, not Markdown
`*emphasis*` (`em`, `i`, `cite` are reset to `font-style: normal`). No
italic font file is shipped.

### Color

**Dark, and light on devices set to light** (Mami's request, 11 November
2026: "by default switch from light screen to dark screen depending on
user's default theme"). It follows `prefers-color-scheme` only: there is
**no toggle** and no `data-theme` attribute (a toggle existed until October
2026 and was removed at Mami's request; don't bring it back unless asked).
The dark tokens are on `:root`; `@media (prefers-color-scheme: light)`
swaps them for warm paper and dark ink: `--bg` `#faf6ef`, `--surface`
`#f2ece1`, `--text` `#2a2521`, `--text-secondary` `#655c52`, `--border`
`#e2d9c9`, and a deeper gold `--accent` `#8a5d00`, because the yellow can't
be read as text on paper (5.3:1 on `--bg`, 4.9:1 on `--surface`). Use the
tokens, never a hard-coded colour, so both themes follow. A few things stay
dark in both: the picture viewer and art pages, and anything written over
a picture (gallery names, play marks, a post picture's hover); those
re-declare the dark tokens (`.viewer, .viewer-body, .gallery-item, ...`
near the top of `styles.css`). The accent is **yellow** (`#f5c542`) in
dark. Dark values:

| Token              | Value     |
| ------------------ | --------- |
| `--bg`             | `#171513` |
| `--surface`        | `#211e1b` |
| `--text`           | `#ede8e0` |
| `--text-secondary` | `#a89f93` |
| `--accent`         | `#f5c542` |
| `--accent-tint`    | `rgb(245 197 66 / 0.13)` (the square behind the trophy) |
| `--border`         | `#312d29` |

**Backgrounds are flat** `--bg`. A drawing-paper texture (grain, then an
embossed watercolor relief) was tried in October 2026 and removed at
Mami's request; don't bring it back unless asked.

All text pairs are at least 4.5:1 (accent: 11.2:1 on `--bg`, 4.7:1
on `--surface`). Links are ink-colored with a soft accent underline that
turns fully accent on hover. Use the accent sparingly: links, the callout and
award-box rule, the current-page dot in the nav, and (as `--accent-tint`)
the square behind the trophy.

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

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96. **No rounded corners**
(Mami's request, November 2026; it was 6px, and 10px before that):
`--radius-sm` and `--radius-md` are 0, and the pills, tags, buttons, focus
rings and inline code are square too. Only true circles stay round: the
nav's current-page dot, the round buttons (burger, viewer), the play mark
and the status dot in the "In progress" tag. Two exceptions, both Mami's
requests (November 2026): pictures inside cards (a post's small square, a
project's screenshot when it has no cover) have `--radius-thumb` (5px;
"just a little corner radius, enough to make it feel better, not too
much"), and the project and post cards themselves `--radius-card` (8px,
after a card Mami liked). Everything else stays square.

### Layout

- One text column, `--measure` 680px of text width, 24px side padding
  (16px under 600px). From 1040px the nav sits in a `--nav-width` (240px)
  column to its left with a 32px gap, and the two are centered together.
  No horizontal page scroll, ever.
- **Logo** on every page (`.site-logo`; it tilts 6° on hover). Clicking it
  opens it big in the picture viewer, titled "Logo", info "Created November
  2026", no arrows, the address unchanged (Mami's request, November 2026:
  not a link to About). Without JS it links to the big image
  (`logo-1024.webp`). Below 1040px it sits at the top left,
  opposite the burger (44px); from 1040px it's at the top of the nav column
  (56px), level with the page's title (see below), with the links below
  it. No site name next to it.
- **Nav**: About · Projects · Arts · Blog, with the project types (Work ·
  Personal · Hackathons) indented under Projects and the Arts subcategories
  (Hand drawn · Procreate · Animated) under Arts, both from
  `_data/categories.yml`. Each of those two groups folds into a dropdown
  (Mami's request, November 2026): a chevron button beside the link,
  closed by default and open on the pages inside the group (a project, a
  type page, an Arts subcategory or piece); while a group is closed, the
  dot for a page inside it sits on the group's link. Without JS the
  chevrons are hidden and every item is listed. The look Mami liked in the phone drawer:
  Newsreader links with a hairline between items (none after the last), the
  types in Nunito, indented. All links are `--text-secondary`; hover and the
  current page go to `--text`, and the current page also gets a 6px accent
  dot hanging in the margin, so it isn't marked by colour alone
  (`aria-current` for screen readers). (On 11 November 2026 the dot was
  swapped for the paw-print tag from the logo's collar, landing with a
  small stamp on each page; Mami asked for "the tiny little dot" back the
  same day. Don't bring the tag back unless asked.) Only the most specific
  item gets the dot: on a project page it's on the type and Projects just brightens
  (`:has()`). About is current on both `/` and `/bio/`.
- **1040px and up**: the nav is a sticky column on the left. **The dog is
  level with the page's title and the first link (About) with the first
  sentence under it** (Mami's request, 11 November 2026): `initNavAlign`
  in `main.js` measures the h1's first line and the abstract's (the Long
  bio's first paragraph on `/bio/`) and sets `--logo-top` and `--nav-gap`,
  on load, once fonts are in, and on resize, because titles sit lower on
  pages with a breadcrumb. Without JS the column keeps the place that's
  right for a page with no breadcrumb. The links sit below the logo, with no hairlines between the items on wide screens
  (Mami's request; the phone drawer keeps them) and no box (a box like the cards, on `--surface`, was
  tried on 11 November 2026 and Mami had it removed the same day, keeping
  the column wider: `--nav-width` went from 160px to 240px). Links
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
- **Project and post cards** (Mami's request, November 2026, after a card
  Mami liked in a screen recording; until then they were bare rows that
  only lit up on hover): every project and post in a list is a card on
  `--surface` with a `--border` hairline and `--radius-card` (8px) corners,
  `--card-pad` inside (14px on phones, 20px from 601px) and `--card-gap`
  between cards (14px / 16px: Mami asked for "good space between them").
  **Titles** (`.title-text`; Mami's request, November 2026, "very simple",
  in place of the 🔗 emoji): a soft accent line under the title; on hover
  or keyboard focus the title and its line just brighten. Nothing moves.
  All one link.
- **Project cards** (`card-grid.html`): **one under another at every
  width, like the post cards** (Mami's request, 11 November 2026; two to a
  row was tried the day before), and **all uniform, no picture**.
  Top to bottom: the underlined serif title (and the "In progress" pill);
  the description, three lines at most (all of
  it is on the project's page); and "Category · year" muted at the bottom. The award's name
  ("Most Creative...", "Best...") isn't on cards (Mami's request, November
  2026: "keep them for when they open it"); winners only wear the medal,
  and the award box is on the project's page. No tech stack in lists. Covers were tried twice on 10 November
  2026 (a `cardImg` PNG per project in `assets/covers/`, first flat
  placeholders, then hand-drawn-style ones with a drawn badge) and Mami
  took them all out the same day: "maybe it's best we keep them all with no
  pic". Don't bring pictures back to project cards unless asked.
- **Winner's medal** (Mami's request, November 2026: keep a hackathon
  winner badge, "just more shinier ... attached to the card"): every
  project with an `award` has `assets/brand/winner-medal.svg` on its card,
  a gold medal with a star and a sheen on a strap that hangs from the
  card's top edge, top right (32×46 on the card, so it ends above the description; `alt="Hackathon winner"`, a soft drop shadow; the title and award keep clear of it). It never
  moves or animates.
- Post cards (`post-list.html`; Mami: "the blog seems to be perfect, no
  change"): the underlined serif title, the description, then the date
  and reading time, muted ("Feb 8, 2026 · 2 min read"). A post gets a
  picture only when it has its own `image`: a small square on the left
  (`--thumb-size`: 72px on phones, 112px from 601px, 56px under 360px;
  `--radius-thumb`, a hairline) that darkens under an open-link icon and
  "Read post" on hover (`card-hover.html`; icon only on phones). The share
  card every page gets by default (`_config.yml`) doesn't count, so
  today's posts are text-only cards.

### Components in `_includes/`

- `breadcrumb.html` — on every page below the top level, including the group,
  starting at the section (there is no home page, only About):
  Projects / Hackathons / Better. Same in the BreadcrumbList JSON-LD.
- `page-header.html` — eyebrow, h1, serif abstract. Every page opens with
  it — About, section indexes, category/medium/tag/year pages, and detail
  pages — so titles and intros are the same size everywhere. `tabs="short"`
  / `"long"` (the About pages) puts `bio-tabs.html` (Short | Long) on the
  eyebrow's row. Never write a
  page's eyebrow/h1/intro by hand in Markdown. The About name just wraps
  where it doesn't fit (two lines below about 428px, one line on a Pro
  Max). Forcing two lines on every phone was tried in October 2026 and
  dropped at Mami's request; don't bring it back unless asked.
- `post-list.html` — post cards (see Layout); `descriptions=true` adds each
  post's description
- `card-hover.html` — what shows over a post card's picture on hover: the
  open-link icon and "Read post", decorative (`aria-hidden`)
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
- `card-grid.html` — the project cards: per project the winner's medal on
  award projects, the underlined title (plus the "In progress" pill on
  ongoing projects), the description and
  "Category · year" (see "Project cards"). No picture, no tech row.
- `award.html` — a hackathon award as one unit: on the left, Google's 🏆
  (`assets/emoji/trophy.svg`) centred in a soft yellow square
  (`--accent-tint`, square corners) as tall as the two lines beside it, the cup
  about half the square's height. Mami asked for the cup to cover both
  lines, then found a cup that big too much; the square covers the lines and
  keeps the cup small. Beside it the award in bold `--text`, with
  **university · event · year** in `--text-secondary` under it
  (university first: it's the name people recognise). Lines only break
  between parts, never inside a name, unless one name alone is wider than
  the line (a long university on a small phone): then it wraps instead of
  running off the page (`.award-part` is `inline-block`). Wrapped award
  names and lines are balanced (`text-wrap: balance`), so no "Add-" / "On"
  or lone year. `size="large"` on project pages puts it in a callout-style
  box (`--surface`, 3px accent rule) with a 48px square (a 26px and a 22px
  line). Project cards don't use it. No foil, nothing over the image, no animation.
- `see-also.html` — trailing block of related links (details below);
  `verb=` sets the word before each title ("Read" by default, "Watch" on
  animations)
- `callout.html` — Note / Tip / Looking for aside with a left accent rule
- `figure.html` — image plus caption, used heavily on Arts
- `picture.html` — every content image goes through this: `<picture>` with the
  WebP variants from `_data/image_dimensions.yml`, original as fallback
- `gallery-grid.html` — the Arts gallery: two columns, same-size squares,
  square corners, the name on each picture; `viewer=<subcategory>` adds the
  data the picture viewer reads, `play=true` (Animated) adds a small round
  play mark to each thumbnail. Each square is `gallery-item.html`.
- `art-picks.html` — the Short About's Arts section: the three most recent
  pieces (by date) from Hand drawn and from Procreate, each set in its
  gallery order, three to a row so each row is one subcategory (it showed
  one piece per subcategory, the duck included, until Mami asked for these
  six). A piece opens in the viewer and steps through its whole subcategory
  (hidden `data-viewer` entries for the rest, as on `/arts/`; Markdown
  writes that wrapper as `<div hidden="">`). An empty subcategory is
  skipped, and the section hides itself if there's no art at all.
- `art-group-items.html` — looks up one Arts subcategory and its pieces
  (sets `group` and `group_items`); `art-group-page.html` — the page for one
- `viewer-dialog.html`, `viewer-icon.html`, `viewer-attrs.html` — the
  picture viewer (see Arts; the dialog is on every page, in `default.html`,
  because the logo opens in it too, with its replay button, see Logo
  animation); `viewer-attrs.html` writes the data-* a piece needs;
  `_layouts/art.html` is the same view as a page
- `animation-media.html` — one animation, large: the MP4 player, the GIF, or
  the still frame (see Animations)
- `photo-grid.html` — personal photos from `_data/photos.yml`
- `prev-next.html` — sibling navigation within a collection

Transitions are 150–200ms ease, color and small transforms only. Nothing
bouncy. Honor `prefers-reduced-motion: reduce`. Visible focus rings on every
interactive element. The exceptions are the intro, the viewer's zoom and
content coming in (below), all at Mami's request.

**Content coming in** (Mami's request, November 2026: "content should
appear as user scroll ... very smooth, same for all contents"): everything
after a page's title comes in as it's seen, and all of it the same way:
fading in while rising 28px into place (`--reveal-rise`), 1.1s,
`cubic-bezier(0.25, 1, 0.5, 1)`. That's headings, text, project and post
cards, pictures, gallery squares, the bio's paragraphs, the resume entries
and the footer. Rows sliding in from the right were tried first; Mami
wanted every piece to come up from below instead, so keep one motion. The
title block (breadcrumb, eyebrow, h1, abstract) and the nav stay put, so a
page's title is there at once. What's on screen
when a page opens comes in with CSS alone (`reveal-*` keyframes, a beat
apart by place after the h1 and within a list); `initReveal` in `main.js`
holds back what's further down (`.reveal-wait`, hidden) and lets each piece
in with the same animation once it's 6% into the screen, up to six a beat
(90ms) apart. The selectors are in both `styles.css` and `REVEAL` in
`main.js`; keep them the same. Without JS everything comes in on load;
with reduced motion, in print, or in a browser without `:is()` nothing
moves. Keyboard focus and the viewer closing onto a square that hasn't come
in yet show it at once (`settleReveal`). Content coming in must never
change the page's size: `body` has `overflow: clip` (so the footer, still
28px low while it comes in, is cut inside its own bottom padding instead of
making the page longer for a moment, and nothing can scroll sideways) and
`html` has `overflow-x: clip`, which keeps `body`'s value its own; without
it `body`'s clip would pass to the page's scrolling and the page couldn't
scroll at all. Clip, not hidden, so `body` isn't a scroll box and the side
nav stays sticky. It's also why the drawer's scroll lock is on
`html.menu-open`, not `body`.

---

## Site architecture

Four top-level sections. Every one has an index and per-item detail pages,
and category pages (Arts calls them subcategories).

```
/                                   About me
/projects/                          Projects index
/projects/category/:category/       Work · Personal · Hackathons
/projects/:slug/                    Project detail
/arts/                              Arts index
/arts/:subcategory/                 Hand drawn · Procreate · Animated
/arts/:slug/                        Art piece (the full-screen viewer)
/arts/animated/:slug/               Animation detail
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

Both About pages open the same way, laid out like the share card (Mami's
request, November 2026; it replaced a "Bio" row under the name with a
hairline): a **PORTFOLIO** eyebrow on the left with **Short | Long** on the
right of the same row (`page-header.html tabs=…`, `bio-tabs.html`: 15px
Nunito, the current one in `--text` and underlined, the other muted, a
`--border` bar between them), then the name as the h1. The Short | Long
switch is modelled on leerob.com's Default | Long bio. The text under the
name shares its font with `.abstract` (Newsreader 22px, `--text-secondary`;
Mami wants this serif for both):

- **Short (`/`, `index.md`)**: the headline as the abstract, and the home
  page's meta description is the same text, so Google shows it too (keep
  the two the same; the `description:` in `index.md` is a copy). Mami
  found the first version ("Product engineer from Madagascar, based in New
  York. 12 hackathon wins, and I draw...") not worded right and wanted full
  sentences like leerob.com's, with the same facts: "I'm a product
  engineer from Madagascar, based in New York. I build apps and games, and
  I've won 12 hackathons along the way. Outside of work, I draw and play
  bass. Right now, I'm looking for master's programs with scholarships."
  The share card keeps its own shorter line (`CARD_LINE`). Abstracts go
  through `smartify`, so apostrophes come out curly. Then the profile
  links (email, GitHub, LinkedIn, Devpost, Resume), the "Looking for" callout
  (off while `looking_for:` is empty), then **Projects** (the two most recent
  projects by date, with "See all N projects"), **Arts** (Mami's request,
  November 2026: six pieces, the three most recent by date from Hand drawn
  and the three most recent from Procreate, each set in its gallery order,
  three to a row (two on phones, Mami's request), with "See all art"; no animations; `art-picks.html`) and
  **Blog** (the two most recent posts, with "See all blog posts"). The
  sections follow the nav's order.
- **Long (`/bio/`, `bio.md`)**: the long Bio text (Markdown from `about.yml`,
  in `.bio-text`), the personal photo grid, then Experience, Education, Awards,
  Certificates, Languages and Interests. The hackathon award lists every project with an
  `award` as rows like the post list (the trophy in its 48px square,
  covering the award and project lines, on the left; university and year on
  the right; each row links to the project), then
  "All 12 hackathon wins on Devpost". Existing copy is good — keep its voice, don't
  corporate-ize it.

  The Bio text was rewritten with Mami in October 2026, in this order: the
  name line ("I know the full name is really long, but I go by Mami"),
  Madagascar and Monroe, the analyst job, the apps and games and how AI fits
  in, hackathons, then "Besides work, music is also a big part of me, and so
  is drawing" leading into a music paragraph (piano, guitar, bass, NYPC) and
  two drawing paragraphs (Mami's mum's Mickey Mouse, Procreate, DogDuckGo as
  the first product of putting the drawings into the software), everything
  else, and what's next (more school or work that does some good) last.
  Mami wants music and drawing to read as much a part of the bio as the
  career and technical skills. Headings (Code / Music / Drawing) were tried
  and Mami preferred plain paragraphs with that transition. The bio
  links MyTime, DogDuckGo and the blog internally; `%drawing%` in the
  drawing paragraph turns into the Arts link once art exists. Music and
  drawing are also in `profile.knows_about` and `one_liner`, so search
  engines and AI assistants see them too.

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

To add a project, copy `_projects/_TEMPLATE.md` (ignored by Jekyll because
of the underscore) and follow the steps in it.

DogDuckGo's page follows the game's repo (mravaloarison/save, private). It
was rewritten on 10 November 2026 from the `flat-art-and-learn-screens`
branch (pull request 1, not merged yet): flat art instead of watercolour,
golden retrievers from the left and right, Version 1 (words) and Version 2
(sentences in a tray), Easy / Medium / Hard, endless levels, the heart
frog, one game-over card. The Learn mode is gone. Its screenshot is a
frame of that branch run locally (Version 1, Easy).

The index at `/projects/` shows the two most recent projects per type
under each heading, then "See all N … projects" to the category page when
there are more. Each category page shows all of its own.

Detail page order: breadcrumb → eyebrow (category) → title → abstract →
award box (award, university, event, year) → metadata row (tech stack) →
Overview →
screenshots → "What I built" → outbound links (live demo, GitHub, Devpost) →
See Also → prev/next.

### Arts

Mami draws, and recently started digital work in Procreate and animating.
Three subcategories (November 2026, at Mami's request), in this order in the
menu and on `/arts/`, defined in `_data/categories.yml` under `arts`:

- **Hand drawn** (`/arts/hand-drawn/`): pencil on paper, art with
  `medium: Hand drawn`. Its page opens with Mami's story: "I started drawing
  with just a pencil, not as a professional or anything like that. I just
  loved doing it." (Was "Traditional" until November 2026.)
- **Procreate** (`/arts/procreate/`): art with `medium: Procreate`. Its
  page opens with Mami's words (November 2026): "I'm just learning to
  transition from traditional to digital right now."
- **Animated** (`/arts/animated/`): the `animations` collection (see
  Animations).

Each subcategory page (`arts/<slug>/index.md`, all built by
`art-group-page.html`) shows its gallery, or a "Working on it" note while it's
empty; an empty one is `noindex` and out of the sitemap and switches on by
itself with its first piece. `/arts/` opens with "I love drawing, and I
recently started doing digital work in Procreate. I just really wanted them
to be out here because they are also part of my work." (Mami's words), then
each subcategory under its h2 with two samples and "View all N …" to its
page (Mami's request: samples, not everything), or "Working on it." The
viewer there still steps through the whole subcategory (the pieces past the
samples are hidden `data-viewer` entries). The old
`/arts/medium/*` and `/animations/` URLs redirect (`redirect_from`).

The first six pieces went up in November 2026, all under Hand drawn
(pencil on paper; Mami calls these the "raw" ones): Mulan and Shang (fan
art of Disney's Mulan), Panda, Kestrel, Chickadee, Sparrow on a branch and
Two dogs (a sketchbook page). They're photos Mami first posted on Instagram
(@mamisdrawing), which has six posts so far, all of them here, and each
`date` is the day it was posted there, in New York time (the kestrel,
chickadee and panda all went up on July 18, 2026). A post's time is in its
link: read the first 11 characters after `/p/` as a base64url number, shift
it right 23 bits and add 1314220021721 to get Unix milliseconds. Kestrel and
Chickadee are Instagram's 1080 px copies, so they're smaller than the
others. Panda and Two dogs are hidden for now at Mami's request
(`published: false` at the top of their files; delete that line to bring
one back). Later in November Mami added three dogs, from new photos:
Fluffy dog and Labrador are the two drawings on the Two dogs page,
photographed one at a time (so their `date` is that post's, August 11,
2026, and Two dogs stays hidden), and German shepherd is new, not on
Instagram; its `date` is the day it went up (November 4, 2026) until Mami
gives the real one. Their titles are plain names, like the birds'; "Fluffy
dog" because the breed isn't certain. The same evening Mami hid the three
dogs again "for now" (`published: false`, like Panda and Two dogs), so the
site shows the three birds, then Mulan and Shang; their `order` (4–6) is
kept for when they come back.

The first Procreate pieces went up on November 10, 2026: **Honey jar,
Coffee cup and Layered cake** (`order` 1–3, the order Mami sent the
finished drawings), each drawn from life: Mami also sent a photo of each
with the iPad beside the real thing (a small hexagonal jar on the couch
arm, a reusable cup with a green silicone lid, a wrapped slice of layered
cake at a café). Those photos aren't on the site. Their `date` is the day
they went up until Mami gives the real ones, and "Layered cake" is a plain
name until Mami says what the cake is (its top may read "ube").
To add a piece, copy `_arts/_TEMPLATE.md` (ignored by Jekyll because of the
underscore) and follow the steps in it.

**Order** (Mami's request, November 2026: "the birds should remain the
first to be seen, then the dogs, then Mulan"): `order:` in a piece's front
matter (1 comes first; 2.5 fits between 2 and 3) sets its place in its
gallery, on `/arts/`, in the viewer's ‹ › and in JSON-LD; pieces without
one come after the numbered ones, newest first. Hand drawn is Kestrel 1,
Chickadee 2, Sparrow 3, Fluffy dog 4, Labrador 5, German shepherd 6, Mulan
and Shang 7. `art-group-items.html` (Liquid) and
`PortfolioSEO.art_group_items` (Ruby) both apply it; keep them the same.

**Galleries** (`gallery-grid.html`): two columns at every width, square
pictures all the same size, square corners, like a photo grid, 12px apart
(8px on phones). (Mami tried uncropped shapes and went back to squares.)
Each name sits on the bottom of its picture (Mami's request, November
2026) in Newsreader 500, `--text`, 18px (15px on phones), over a soft
fading shadow: a warm near-black gradient, 0.78 at the bottom to clear
about 80px up, plus a light text shadow, so it reads on white paper. On
Animated the play mark sits in the top corner, clear of the name.

**The viewer** (Mami's request, November 2026: "like when you look at a
picture on Instagram or Facebook"): clicking a picture opens it full screen
over the gallery (`viewer-dialog.html`, a `<dialog>`, run by `main.js`).
**Zoom** (Mami's request, November 2026: "it should get bigger … then
the close it just gets smaller to go back to its position"): opening, the
square grows into the picture, its crop opening out to the picture's full
shape (a copy of the thumbnail flies: transform plus a `clip-path` inset,
`.viewer-ghost`), while the dark comes up behind it and the buttons and
name fade in; the sharp picture takes over once it's decoded (it starts
loading on the press). Closing reverses it into the square of the piece
on view, scrolled into view first (behind the viewer) if the arrows moved
on to one further down; a piece the page doesn't show (past `/arts/`'s
samples) just fades. 420ms open, 360ms close, the drawer's
`cubic-bezier(0.32, 0.72, 0, 1)`, no bounce. The logo zooms from and back
into its corner the same way. The picture's size is set from its known
dimensions before it loads, so the zoom knows where it lands. Escape, ×,
Back and a tap outside all close with the zoom; any arrow or close during
an opening finishes it first. With reduced motion it opens and closes at
once. Close top left, an info button top right (shows when it was
made: "Created July 18, 2026", plus the piece's note if it has one), ‹ ›
at the sides that wrap around the pieces in that gallery, the arrow keys
and swiping too, the name under the picture; Escape, ×, Back or a tap on
the dark space around it close it. No date, medium or tools on view
otherwise. While it's open the address is the piece's own URL, so Back
closes it and a reload or a shared link opens that piece's page, which is
the same view built server-side (`_layouts/art.html`: links for ‹ › and ×, a
`<details>` for info, its title as the page's one h1, no site header or
footer). Without JS the thumbnails link to those pages, so nothing depends
on the script. Art pages have no breadcrumb trail on view (its JSON-LD is
still written, `breadcrumb.html json_only=true`) and no See Also: the
arrows are their prev/next (an exception to linking rules 4 and 5, at
Mami's request). Art is image-heavy — this is where performance and alt
text matter most. See the image rules below; do not skip them here.

### Animations

Added in November 2026, at Mami's request, for drawings that move, and
moved under Arts as **Animated** the same month (`/arts/animated/`; pieces
at `/arts/animated/:slug/`). The first three went up on November 5, 2026:
**Idle duck, Happy duck and Scared duck**, the duck you play in DogDuckGo,
each a 10-frame Procreate loop (512×640 on black, about a second, 8 or 11
fps), in that `order` (1–3); their `date` is the day Mami exported them.
Before that the page said "Working on it" (`noindex`, out of the sitemap
and `llms.txt`), which comes back by itself if they're ever all gone. To
add one, copy `_animations/_TEMPLATE.md` and follow it. The picture viewer
doesn't play videos yet, so Animated's thumbnails link to each animation's
page.

Each one is an MP4 video (`video:`) or a GIF (`gif:`), plus a still frame
(`image:`, required: the thumbnail, the share image and the poster) that
goes through `optimize-images.py` like any image. Videos live in
`assets/animations/`, still frames in `assets/images/animations/`. Prefer
MP4 (H.264, which is what Procreate exports): in a test the same 2-second
loop was 44 KB as an MP4 and 882 KB as a GIF at half the size. Mami wasn't
sure yet which format the animations would be, so both work.

Playback (Mami's request, November 2026: "those videos should loop over
and over"): a silent video loops by itself, like a GIF, but only while it's
on screen (`initLoops` in `main.js`, an IntersectionObserver; at least 20%
in view). That goes for the squares on the Animated page and the samples
on `/arts/` (each square is the video itself, `object-fit: cover`, the
play mark fading out while it moves) and the big one on its page, which
shows at its own size at most and has a round pause/play button over its
bottom corner (WCAG 2.2.2: moving things need a way to stop). With reduced
motion they all stay on the still frame (the page's button plays it on
request); with JS off the squares are still frames and the page has a
plain player with controls. A video with `sound: true` keeps the old
behaviour: controls, and it waits for play. The MP4 comes first, and a
`.webm` of the same name next to it is offered too (for browsers without
H.264; the ducks have one). A GIF plays by itself, so a device asking for
reduced motion gets the still frame instead (`<picture>` with a
`prefers-reduced-motion` source). Detail page: breadcrumb
(Arts / Animated / title) → eyebrow ("Animation") → title → abstract → the
animation → Format / Tools / Date → note → See Also ("Watch: …") → prev/next.

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
medium: # Procreate | Hand drawn — its Arts subcategory (page, gallery, ‹ ›)
order: # optional — its place in the gallery (1 first); unordered come after, newest first
date:
image:
image_alt: # required — describe the artwork, not "drawing"
tools: [] # e.g. [Procreate, iPad, Apple Pencil]
```

### Front matter — `_animations/*.md`

```yaml
title:
description:
date:
video: # /assets/animations/<slug>.mp4, or instead:
gif: # /assets/animations/<slug>.gif
image: # the still frame, /assets/images/animations/<slug>.png (required)
image_alt: # required; describe what happens in it
tools: []
sound: # optional; true leaves the video's sound on
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
   time — `/projects/category/hackathons/`, `/arts/hand-drawn/`,
   `/blog/tag/technology/`, and the section index links to each of them. The
   old site linked these to `#`, which meant search engines saw zero of them.
4. **`see-also.html` renders on every detail page and is never empty.** Use
   `related` when set; otherwise fall back to same category/tag, then to most
   recent in the collection. (Exception: art pieces, which are the
   full-screen viewer; see Arts.)
5. **Prev/next** sibling links at the bottom of every detail page (on art
   pieces they're the viewer's ‹ › arrows, named "Previous: …" / "Next: …").
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
"Mami Ravaloarison product engineer" (or software engineer) lands here, and that individual projects
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
- `content_check.rb` — the build-time check from linking rule 8 (animations
  also need a `video` or a `gif`).
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
tagline: Product Engineer
description: >-
    Maminiaina "Mami" Ravaloarison — Product Engineer in New York.
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

- About → both About pages (`/` and `/bio/`) are `ProfilePage`, with the
  Person nested in `mainEntity` (Google requires its `name`). The `Person`
  has `name: "Maminiaina Ravaloarison"`,
  `alternateName: "Mami Ravaloarison"`, `jobTitle`, `alumniOf`, `sameAs`
  array of all profile URLs, `knowsLanguage`, `award`.
- Project detail → `CreativeWork` (or `SoftwareApplication` where it's a real
  app), with `author`, `datePublished`, `image`, `keywords` from `tech`.
- Post → `BlogPosting` with `headline`, `datePublished`, `dateModified`,
  `author`, `image`, `wordCount`.
- Art detail → `VisualArtwork` with `artMedium`, `creator`, `dateCreated`.
- Animation detail → `VideoObject` (`contentUrl`, `thumbnailUrl`,
  `uploadDate`) for a video, or `VisualArtwork` with `artform: Animation`
  for a GIF.
- Category, Arts subcategory and tag pages → `CollectionPage`.
- Every page below root → `BreadcrumbList`.

Validate output against Google's Rich Results Test before considering a page
done. That test only lists types Google turns into rich results — here
**Profile page** (`/`, `/bio/`), **Breadcrumbs** (every inner page) and
**Article** (blog posts). Projects, awards and the Person never show there
("No items detected" on them is normal); check those in the Schema Markup
Validator (validator.schema.org). Every reference to the Person carries
`@type`, `name` and `url` (`PortfolioSEO.person_ref`), because the Rich
Results Test doesn't follow `@id` links — a bare `{"@id": …}` reference
in the About page's `mainEntity` is the likely reason a test in October
2026 reported "No items detected".

### Crawlability

- `sitemap.xml` generated and referenced from `robots.txt`, including every
  category, Arts subcategory (once it has a piece) and tag page.
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
  page loads eagerly. So do the emoji in `assets/emoji/`: one tiny file
  repeated down a list, read as part of the text, so it shouldn't pop in.
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
  delivers, content or navigation state. The only JS is `main.js`
  (deferred: the phone menu, the menu dropdowns, the Arts picture viewer,
  the intro, holding content back until it scrolls into view), plus a tiny inline head script that adds the `js` class (and
  decides the intro) before first paint.
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
- **The trophy emoji font didn't show on iPhones** (October 2026): the 🏆
  came from a 2.9 KB Noto Color Emoji subset, but that font is COLRv1, which
  Safari and every iOS browser (all WebKit) can't read, so they showed
  Apple's trophy instead. Google's own emoji artwork as SVG images
  (`assets/emoji/`) looks the same everywhere. Don't go back to an emoji
  font.
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
- **A light theme with a toggle existed** until October 2026 (a day/night
  button in the header, `sessionStorage` to carry the choice). Mami asked
  for dark only and it was all removed. In November 2026 Mami asked for
  light again, but only following the device's setting; there is still no
  toggle (see Color).
- **Category filters linked to `#`** on the old site, making every facet
  invisible to search engines. They are real pages now, linked from each
  section index.
- **A drawings column beside the About Bio was tried and removed** (October
  2026): stacked, then fixed, then a sideways carousel with placeholder
  art. Mami didn't like it. In November 2026 Mami asked for art on the
  Short About after all, in the page's flow (Arts, between Projects and
  Blog: the three most recent hand-drawn and Procreate pieces); keep it to
  that section and don't put art beside the bio.
- **A logo in the header** (the M mark) was tried in October 2026 and removed
  when the nav moved to the side. In November 2026 the M was replaced
  everywhere it was left (tab icon, iPhone icon, share image) by the dog,
  see "Logo". Later that month Mami asked for the dog on every page, so it's
  back, at the top of the nav column and opposite the burger. It also sat
  beside the × in the picture viewer for a while; Mami found it unneeded
  there, so the viewer's bar is just × and ⓘ.
- **"Hellouu" typed under the dog in the intro** (November 2026) didn't
  work the way Mami pictured it; three drawn pencil dots replaced it, and
  then Mami had those removed too the same day: "just the dog is enough".
  Don't put anything under the dog in the intro unless asked.
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
