---
layout: default
title: Traditional Drawings
description: Traditional drawings by Maminiaina Ravaloarison, made by hand on paper, newest first.
nav_slug: traditional
medium_name: Traditional
---

{% include breadcrumb.html section_title="Arts" section_url="/arts/" current="Traditional" %}

<p class="eyebrow">Arts</p>

# Traditional

Drawings made by hand, on paper.

{% assign items = site.arts | where: "medium", "Traditional" | sort: "date" | reverse %}
{% if items.size > 0 %}
{% include gallery-grid.html items=items %}
{% else %}
<p class="meta">Nothing here yet.</p>
{% endif %}
