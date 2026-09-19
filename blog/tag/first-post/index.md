---
layout: default
title: "Posts tagged: first-post"
description: Blog posts tagged first-post — Mami Ravaloarison's journal entries introducing the blog itself.
tag: first-post
---

{% include breadcrumb.html section_title="Blog" section_url="/blog/" current="first-post" %}

<p class="eyebrow">Blog</p>

# Tagged: first-post

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
