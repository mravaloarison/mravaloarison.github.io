---
layout: default
title: Projects
permalink: /projects/
nav: true
nav_order: 3
display_categories: [work, fun, hackathons]
horizontal: false
---

<style>
  /* ===== Projects page (match Lab exactly) ===== */

  .projects {
    margin-top: 2rem;
  }

  /* Filter bar */

  .project-filter-list {
    border-bottom: 1px solid var(--global-divider-color);
    margin-bottom: 2.5rem;
  }

  .project-filter-list ul {
    padding: 0;
    margin: 0;
    display: flow-root;
  }

  .project-filter-list li,
  .project-filter-list p {
    list-style: none;
    display: inline-block;
    padding: 1rem 0.5rem;
    color: var(--global-text-color-light);
    cursor: pointer;
  }

  .project-filter-list li.active,
  .project-filter-list li:hover {
    color: var(--global-theme-color);
  }

  /* Hide category headers */

  .projects h2.category {
    display: none;
  }

  /* Cards */

  .projects .card {
    border: 1px solid var(--global-divider-color);
    border-radius: 0;
    box-shadow: none;
    transition: border-color 0.2s ease;
  }

  .projects .card:hover {
    border-color: var(--global-theme-color);
  }

  .projects .card-title {
    font-size: 1rem;
    font-weight: 500;
  }

  .projects .card-text {
    font-size: 0.9rem;
    color: var(--global-text-color-light);
    line-height: 1.6;
  }

  /* Mobile — IDENTICAL behavior to Lab */

  @media (max-width: 576px) {
    .header-bar h3 {
      font-size: 1.5rem;
      line-height: 1.6;
    }

    /* REMOVE extra vertical padding */
    .project-filter-list {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .project-filter-list ul {
      display: flex;
      flex-wrap: nowrap;
      gap: 1rem;
      padding: 0.5rem 0.5rem 0.75rem 0.5rem;
      min-width: max-content;
    }

    .project-filter-list li,
    .project-filter-list p {
      list-style: none;
      display: inline-block;
      padding: 1rem 0.5rem;
    }
  }

</style>

<div class="post">
  {% if site.projects_description %}
    <div class="header-bar">
      <h3>{{ site.projects_description }}</h3>
    </div>
  {% endif %}

  <!-- Filters -->
  <div class="project-filter-list">
    <ul class="p-0 m-0">
      <li class="active" data-filter="all">
        <i class="fa-solid fa-hashtag fa-sm"></i> all
      </li>
      <p>&bull;</p>
      {% for category in page.display_categories %}
        <li data-filter="{{ category }}">
          <i class="fa-solid fa-hashtag fa-sm"></i> {{ category }}
        </li>
        {% unless forloop.last %}
          <p>&bull;</p>
        {% endunless %}
      {% endfor %}
    </ul>
  </div>

  <article class="post-content">
    <div class="projects">

      <!-- ALL -->
      <section class="project-category" data-category="all">
        <div class="row row-cols-1 row-cols-md-3 g-3">
          {% assign all_projects = site.projects | sort: "title" %}
          {% for project in all_projects %}
            {% include projects.liquid %}
          {% endfor %}
        </div>
      </section>

      <!-- CATEGORIES -->
      {% for category in page.display_categories %}
        <section class="project-category" data-category="{{ category }}" style="display:none;">
          <div class="row row-cols-1 row-cols-md-3 g-3">
            {% assign categorized_projects = site.projects | where: "category", category | sort: "importance" %}
            {% for project in categorized_projects %}
              {% include projects.liquid %}
            {% endfor %}
          </div>
        </section>
      {% endfor %}

    </div>
  </article>
</div>

<script>
  const filters = document.querySelectorAll('.project-filter-list li');
  const sections = document.querySelectorAll('.project-category');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const value = filter.dataset.filter;

      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      sections.forEach(section => {
        section.style.display =
          section.dataset.category === value ? '' : 'none';
      });
    });
  });
</script>
