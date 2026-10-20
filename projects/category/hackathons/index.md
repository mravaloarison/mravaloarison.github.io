---
layout: default
title: Hackathon Projects
description: Award-winning projects Maminiaina Ravaloarison built at hackathons hosted by Princeton, Yale, Penn, RPI, Rutgers and Stony Brook universities.
nav_slug: hackathons
---

{% include breadcrumb.html section_title="Projects" section_url="/projects/" current="Hackathons" %}

{% include page-header.html eyebrow="Projects" title="Hackathons" abstract="Projects built at hackathons across the East Coast, most of which won an award." %}

{% assign hackathons = site.projects | where: "category", "Hackathon" | sort: "date" | reverse %}
{% include card-grid.html items=hackathons %}
