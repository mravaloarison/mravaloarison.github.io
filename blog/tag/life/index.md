---
layout: default
title: "Posts tagged: life"
description: Blog posts tagged life — Maminiaina Ravaloarison's journal entries on life outside of software.
tag: life
---

{% include breadcrumb.html section_title="Blog" section_url="/blog/" current="life" %}

<p class="eyebrow">Blog</p>

# Tagged: life

{% assign tagged_posts = site.posts | where_exp: "p", "p.tags contains page.tag" %}
{% include post-list.html posts=tagged_posts descriptions=true %}

{% include blog-browse.html %}
