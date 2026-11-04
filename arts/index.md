---
layout: default
title: Arts
description: "Art by Maminiaina Ravaloarison: pencil drawings made by hand, digital pieces from Procreate, and animations."
---

{% include page-header.html eyebrow="Arts" title="Arts" abstract="I love drawing, and I recently started doing digital work in Procreate. I just really wanted them to be out here because they are also part of my work." %}

{% for g in site.data.categories.arts %}
{% include art-group-items.html slug=g.slug %}
{% assign group_url = "/arts/" | append: group.slug | append: "/" %}

## <a href="{{ group_url | relative_url }}">{{ group.label }}</a>

{% if group_items.size == 0 %}
<p class="meta">Working on it.</p>
{% else %}
{%- comment -%} Two samples per subcategory; its own page has the rest. {%- endcomment -%}
{% if group.collection == "animations" %}
{% include gallery-grid.html items=group_items limit=2 play=true %}
{% else %}
{% include gallery-grid.html items=group_items limit=2 viewer=group.slug %}
{% endif %}
<p class="see-more"><a href="{{ group_url | relative_url }}">View all {{ group_items.size }} {{ group.items_label }}</a></p>
{% endif %}
{% endfor %}

