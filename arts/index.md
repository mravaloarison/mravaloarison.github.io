---
layout: default
title: Arts
description: "Art by Maminiaina Ravaloarison: pencil drawings made by hand, digital pieces from Procreate, and animations."
---

{% include page-header.html eyebrow="Arts" title="Arts" abstract="I love drawing, and I recently started doing digital work in Procreate. I just really wanted them to be out here because they are also part of my work." %}

{% for g in site.data.categories.arts %}
{% include art-group-items.html slug=g.slug %}
{% assign group_url = "/arts/" | append: group.slug | append: "/" %}
{% assign group_see_all = "" %}
{% if group_items.size > 0 %}{% capture group_see_all %}See all {{ group_items.size }} {{ group.items_label }}{% endcapture %}{% endif %}

{% include section-head.html title=group.label url=group_url all=group_see_all %}

{% if group_items.size == 0 %}
<p class="meta">Working on it.</p>
{% else %}
{%- comment -%} Two samples per subcategory; its own page has the rest. {%- endcomment -%}
{% if group.collection == "animations" %}
{% include gallery-grid.html items=group_items limit=2 play=true %}
{% else %}
{% include gallery-grid.html items=group_items limit=2 viewer=group.slug %}
{% endif %}
{% endif %}
{% endfor %}

