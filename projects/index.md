---
layout: default
title: Projects
description: Work, personal builds, and hackathon projects from Mami Ravaloarison, spanning iOS, web, data, and machine learning.
---

<p class="eyebrow">Projects</p>

# Projects

A collection of the projects I've built, at work, on my own time, and at hackathons across the East Coast. Each one taught me something new about technology, design, or how to think better.

{%- comment -%} Two most recent per type; the category page has the rest. {%- endcomment -%}
{% for cat in site.data.categories.projects %}
{% assign cat_items = site.projects | where: "category", cat.name | sort: "date" | reverse %}
{% assign cat_url = "/projects/category/" | append: cat.slug | append: "/" %}

## <a href="{{ cat_url | relative_url }}">{{ cat.label }}</a>

{% assign cat_preview = cat_items | slice: 0, 2 %}
{% include card-grid.html items=cat_preview %}

{% if cat_items.size > 2 %}
<p class="see-more"><a href="{{ cat_url | relative_url }}">See all {{ cat_items.size }} {{ cat.name | downcase }} projects</a></p>
{% endif %}
{% endfor %}
