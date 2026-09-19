---
layout: default
title: Projects
description: Work, personal builds, and hackathon projects from Mami Ravaloarison, spanning iOS, web, data, and machine learning.
---

<p class="eyebrow">Projects</p>

# Projects

A collection of the projects I've built, at work, on my own time, and at hackathons across the East Coast. Each one taught me something new about technology, design, or how to think better.

{% assign work = site.projects | where: "category", "Work" | sort: "date" | reverse %}
{% assign personal = site.projects | where: "category", "Personal" | sort: "date" | reverse %}
{% assign hackathons = site.projects | where: "category", "Hackathon" | sort: "date" | reverse %}

## <a href="{{ '/projects/category/work/' | relative_url }}">Work</a>

{% include card-grid.html items=work %}

## <a href="{{ '/projects/category/personal/' | relative_url }}">Personal</a>

{% include card-grid.html items=personal %}

## <a href="{{ '/projects/category/hackathons/' | relative_url }}">Hackathons</a>

{% include card-grid.html items=hackathons %}
