---
layout: default
title: "Posts tagged: life"
description: Blog posts tagged life — Mami Ravaloarison's journal entries on life outside of software.
tag: life
---

{% include breadcrumb.html section_title="Blog" section_url="/blog/" current="life" %}

<p class="eyebrow">Blog</p>

# Tagged: life

{% assign tagged_posts = site.posts | where_exp: "p", "p.tags contains page.tag" %}
<ul class="post-list">
  {% for post in tagged_posts %}
  <li>
    <h3><a href="{{ post.url | relative_url }}">Read: {{ post.title }}</a></h3>
    {% include post-meta.html post=post %}
    <p class="card-description">{{ post.description }}</p>
  </li>
  {% endfor %}
</ul>
