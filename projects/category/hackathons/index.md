---
layout: default
title: Hackathon Projects
description: Award-winning hackathon projects Mami Ravaloarison has built across East Coast universities, including Princeton, Yale, and Stony Brook.
---

{% include breadcrumb.html section_title="Projects" section_url="/projects/" current="Hackathons" %}

<p class="eyebrow">Projects</p>

# Hackathons

Projects built at hackathons across the East Coast, most of which won an award.

{% assign hackathons = site.projects | where: "category", "Hackathon" | sort: "date" | reverse %}
{% include card-grid.html items=hackathons %}
