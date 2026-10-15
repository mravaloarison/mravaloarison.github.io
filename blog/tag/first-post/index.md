---
layout: default
title: "Posts tagged: first-post"
description: Blog posts tagged first-post — Maminiaina Ravaloarison's journal entries introducing the blog itself.
tag: first-post
---

{% include breadcrumb.html section_title="Blog" section_url="/blog/" current="first-post" %}

{% include page-header.html eyebrow="Blog" title="Tagged: first-post" %}
{% assign tagged_posts = site.posts | where_exp: "p", "p.tags contains page.tag" %}
{% include post-list.html posts=tagged_posts descriptions=true %}

{% include blog-browse.html %}
