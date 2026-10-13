---
layout: default
title: Sketchbook
description: Sketchbook pages and quick studies by Mami Ravaloarison, newest first.
nav_slug: sketchbook
medium_name: Sketchbook
---

{% include breadcrumb.html section_title="Arts" section_url="/arts/" current="Sketchbook" %}

<p class="eyebrow">Arts</p>

# Sketchbook

Quick studies and pages from my sketchbook.

{% assign items = site.arts | where: "medium", "Sketchbook" | sort: "date" | reverse %}
{% if items.size > 0 %}
{% include gallery-grid.html items=items %}
{% else %}
<p class="meta">Nothing here yet.</p>
{% endif %}
