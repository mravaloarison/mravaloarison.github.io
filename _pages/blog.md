---
layout: default
permalink: /blog/
title: Lab
nav: true
nav_order: 1
---

<style>
  /* ===== Lab page filters ===== */

  .tag-category-list {
    border-bottom: 1px solid var(--global-divider-color);
    margin-bottom: 2.5rem;
  }

  .tag-category-list ul {
    padding: 0;
    margin: 0;
    display: flow-root;
  }

  .tag-category-list li,
  .tag-category-list p {
    list-style: none;
    display: inline-block;
    padding: 1rem 0.5rem;
    color: var(--global-text-color-light);
    cursor: pointer;
  }

  .tag-category-list li.active,
  .tag-category-list li:hover {
    color: var(--global-theme-color);
  }

  /* Mobile: horizontal scroll (ensure first item visible) */

  @media (max-width: 576px) {
    .header-bar h3 {
      font-size: 1.5rem;
      line-height: 1.6;
    }

    .tag-category-list {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .tag-category-list ul {
      display: flex;
      flex-wrap: nowrap;
      gap: 1rem;
      padding: 0.5rem 0.5rem 0.75rem 0.5rem;
      min-width: max-content;
    }

    .tag-category-list li {
      white-space: nowrap;
      padding: 0.5rem 0;
      flex: 0 0 auto;
    }

    .tag-category-list p {
      display: none;
    }
  }
</style>

<div class="post">

  {% if site.blog_description %}
    <div class="header-bar">
      <h3>{{ site.blog_description }}</h3>
    </div>
  {% endif %}

  <!-- Filters -->
  <div class="tag-category-list">
    <ul class="p-0 m-0">
      <li class="active" data-filter="all">
        <i class="fa-solid fa-hashtag fa-sm"></i> all
      </li>
      <p>&bull;</p>
      {% for tag in site.display_tags %}
        <li data-filter="{{ tag | downcase }}">
          <i class="fa-solid fa-hashtag fa-sm"></i> {{ tag }}
        </li>
        {% unless forloop.last %}
          <p>&bull;</p>
        {% endunless %}
      {% endfor %}
    </ul>
  </div>

  <ul class="post-list">
    {% for post in site.posts %}
      {% assign post_tags = post.tags | join: ' ' | downcase %}
      <li class="post-item" data-tags="{{ post_tags }}">
        <h3>
          <a class="post-title" href="{{ post.url | relative_url }}">
            {{ post.title }}
          </a>
        </h3>
        <p>{{ post.description }}</p>
        <p class="post-meta">
          {{ post.date | date: '%B %d, %Y' }}
        </p>
      </li>
    {% endfor %}
  </ul>

</div>

<script>
  const tagButtons = document.querySelectorAll('.tag-category-list li');
  const posts = document.querySelectorAll('.post-item');

  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      tagButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      posts.forEach(post => {
        const tags = post.dataset.tags;
        post.style.display =
          filter === 'all' || tags.includes(filter)
            ? ''
            : 'none';
      });
    });
  });
</script>
