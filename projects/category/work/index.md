---
layout: default
title: Work Projects
description: Data analytics, dashboards, and internal tools Mami Ravaloarison has built as part of her day job at Monroe University.
---

{% include breadcrumb.html section_title="Projects" section_url="/projects/" current="Work" %}

<p class="eyebrow">Projects</p>

# Work

Projects built as part of my day-to-day role at Monroe University.

{% assign work = site.projects | where: "category", "Work" | sort: "date" | reverse %}
{% include card-grid.html items=work %}
