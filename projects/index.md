---
layout: default
title: Projects
description: Work, personal builds, and hackathon projects from Maminiaina Ravaloarison, spanning iOS, web, data, and machine learning.
---

{% include page-header.html eyebrow="Projects" title="Projects" abstract="A collection of the projects I've built, at work, on my own time, and at hackathons across the East Coast. Each one taught me something new about technology, design, or how to think better." %}

{%- comment -%}
  Two most recent per type; the category page has the rest, linked from
  the type's title row ("See all 6 projects", plus "in Hackathons" for
  screen readers: the full words don't fit beside the title on a phone).
{%- endcomment -%}
{% for cat in site.data.categories.projects %}
{% assign cat_items = site.projects | where: "category", cat.name | sort: "date" | reverse %}
{% assign cat_url = "/projects/category/" | append: cat.slug | append: "/" %}
{% assign cat_all = "" %}
{% if cat_items.size > 2 %}{% capture cat_all %}See all {{ cat_items.size }} projects{% endcapture %}{% endif %}
{% capture cat_hidden %}in {{ cat.label }}{% endcapture %}

{% include section-head.html title=cat.label url=cat_url all=cat_all all_hidden=cat_hidden %}

{% assign cat_preview = cat_items | slice: 0, 2 %}
{% include card-grid.html items=cat_preview %}
{% endfor %}
