---
layout: default
title: Arts
description: "Art by Maminiaina Ravaloarison: pencil drawings made by hand, digital pieces from Procreate, and animations."
---

{% include page-header.html eyebrow="Arts" title="Arts" abstract="I love drawing, and I recently started doing digital work in Procreate. This is where those pieces live." %}

{% for g in site.data.categories.arts %}
{% include art-group-items.html slug=g.slug %}
{% assign group_url = "/arts/" | append: group.slug | append: "/" %}

## <a href="{{ group_url | relative_url }}">{{ group.label }}</a>

{% if group_items.size == 0 %}
<p class="meta">Working on it.</p>
{% else %}
{% assign shown = group_items | slice: 0, 4 %}
{% if group.collection == "animations" %}
{% include gallery-grid.html items=shown play=true %}
{% else %}
{% include gallery-grid.html items=shown viewer=group.slug %}
{% endif %}
{% if group_items.size > 4 %}
<p class="see-more"><a href="{{ group_url | relative_url }}">See all {{ group_items.size }} {{ group.items_label }}</a></p>
{% endif %}
{% endif %}
{% endfor %}
