---
layout: default
art_rail: true
title: Blog
description: Mami Ravaloarison's journal — writing on technology, AI, and life, in reverse-chronological order.
---

<p class="eyebrow">Blog</p>

# Blog

This is just a space where I write about whatever I'm thinking through, my honest thoughts on different subjects.

{% include post-list.html posts=site.posts descriptions=true %}

## Browse

<div class="browse">
  <div>
    <p class="browse-label">By year</p>
    <ul class="tag-index">
      {% assign year_groups = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
      {% for group in year_groups %}
      {% assign year_url = "/blog/" | append: group.name | append: "/" %}
      {% assign year_page = site.pages | where: "url", year_url | first %}
      {% if year_page %}<li><a href="{{ year_url | relative_url }}">{{ group.name }}</a></li>{% endif %}
      {% endfor %}
    </ul>
  </div>
  <div>
    <p class="browse-label">By tag</p>
    <ul class="tag-index">
      {% assign all_tags = site.tags | sort %}
      {% for tag in all_tags %}
      <li><a href="{{ '/blog/tag/' | append: tag[0] | append: '/' | relative_url }}">{{ tag[0] }}</a></li>
      {% endfor %}
    </ul>
  </div>
</div>
