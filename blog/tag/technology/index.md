---
layout: default
title: "Posts tagged: technology"
description: Blog posts tagged technology — Mami Ravaloarison's journal entries on software, AI, and building things.
tag: technology
---

{% include breadcrumb.html section_title="Blog" section_url="/blog/" current="technology" %}

<p class="eyebrow">Blog</p>

# Tagged: technology

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
