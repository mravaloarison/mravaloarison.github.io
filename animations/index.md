---
layout: default
title: Animations
description: Animations by Maminiaina Ravaloarison, drawings brought to life.
---

{% include page-header.html eyebrow="Animations" title="Animations" abstract="My drawings, but moving." %}

{% assign items = site.animations | sort: "date" | reverse %}
{% if items.size == 0 %}
{% include callout.html label="Coming soon" text="No animations are up yet. The first ones are on the way." %}
{% else %}
{% include gallery-grid.html items=items play=true %}
{% endif %}
