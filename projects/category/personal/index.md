---
layout: default
title: Personal Projects
description: Self-directed projects Mami Ravaloarison has built outside of work and hackathons, from an iOS time tracker and a typing game to computer-vision experiments.
nav_slug: personal
---

{% include breadcrumb.html section_title="Projects" section_url="/projects/" current="Personal" %}

<p class="eyebrow">Projects</p>

# Personal

Projects I've built on my own time, out of curiosity more than anything else.

{% assign personal = site.projects | where: "category", "Personal" | sort: "date" | reverse %}
{% include card-grid.html items=personal %}
