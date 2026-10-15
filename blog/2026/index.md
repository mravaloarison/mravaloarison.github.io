---
layout: default
title: "2026"
description: Maminiaina Ravaloarison's journal entries from 2026, in reverse-chronological order.
nav_slug: "2026"
---

{% include breadcrumb.html section_title="Blog" section_url="/blog/" current="2026" %}

<p class="eyebrow">Blog</p>

# 2026

{% assign year_groups = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% for group in year_groups %}
{% if group.name == page.nav_slug %}
{% include post-list.html posts=group.items descriptions=true %}
{% endif %}
{% endfor %}

{% include blog-browse.html %}
