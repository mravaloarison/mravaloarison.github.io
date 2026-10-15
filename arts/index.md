---
layout: default
title: Arts
description: Drawings by Maminiaina Ravaloarison, from digital pieces made in Procreate to traditional work and sketchbook pages.
---

{% include page-header.html eyebrow="Arts" title="Arts" abstract="I love drawing, and I recently started doing digital work in Procreate. This is where those pieces live." %}

{% assign mediums = site.data.categories.arts %}
{% if site.arts.size == 0 %}
{% include callout.html label="Coming soon" text="No pieces are up yet. The first ones are on the way." %}
{% else %}
{% for m in mediums %}
{% assign items = site.arts | where: "medium", m.name | sort: "date" | reverse %}
{% if items.size > 0 %}

## <a href="{{ '/arts/medium/' | append: m.slug | append: '/' | relative_url }}">{{ m.label }}</a>

{% include gallery-grid.html items=items %}
{% endif %}
{% endfor %}
{% endif %}
