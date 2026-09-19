---
layout: default
title: "2026"
description: Mami Ravaloarison's journal entries from 2026, in reverse-chronological order.
nav_slug: "2026"
---

{% include breadcrumb.html section_title="Blog" section_url="/blog/" current="2026" %}

<p class="eyebrow">Blog</p>

# 2026

{% assign year_groups = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
<ul class="post-list">
  {% for group in year_groups %}
  {% if group.name == page.nav_slug %}
  {% for post in group.items %}
  <li>
    <h3><a href="{{ post.url | relative_url }}">Read: {{ post.title }}</a></h3>
    {% include post-meta.html post=post %}
    <p class="card-description">{{ post.description }}</p>
    {% include tag-list.html tags=post.tags %}
  </li>
  {% endfor %}
  {% endif %}
  {% endfor %}
</ul>
