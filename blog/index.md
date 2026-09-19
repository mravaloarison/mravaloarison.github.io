---
layout: default
title: Blog
description: Mami Ravaloarison's journal — writing on technology, AI, and life, in reverse-chronological order.
---

<p class="eyebrow">Blog</p>

# Blog

This is just a space where I write about whatever I'm thinking through, my honest thoughts on different subjects.

{% assign posts = site.posts %}
<ul class="post-list">
  {% for post in posts %}
  <li>
    <h3><a href="{{ post.url | relative_url }}">Read: {{ post.title }}</a></h3>
    {% include post-meta.html post=post %}
    <p class="card-description">{{ post.description }}</p>
    {% include tag-list.html tags=post.tags %}
  </li>
  {% endfor %}
</ul>

## Browse by tag

<ul class="tag-index">
  {% assign all_tags = site.tags | sort %}
  {% for tag in all_tags %}
  <li><a href="{{ '/blog/tag/' | append: tag[0] | append: '/' | relative_url }}">{{ tag[0] }}</a></li>
  {% endfor %}
</ul>
