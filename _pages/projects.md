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
  /* ===== Projects ===== */

  .projects {
    margin-top: 2rem;
  }

  /* Reuse blog hashtag design */

  .project-filters li {
    cursor: pointer;
  }

  .project-filters li.active,
  .project-filters li:hover {
    color: var(--global-theme-color);
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

  .projects .row {
    row-gap: 1rem;      /* vertical spacing */
  }
  /* Mobile — identical to Blog */

  @media (max-width: 576px) {
    .projects .row {
      row-gap: .4rem;      /* vertical spacing */
    }

    .header-bar h3 {
      font-size: 1.5rem;
      line-height: 1.6;
    }
    
    .project-filters {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .project-filters ul {
      display: flex;
      flex-wrap: nowrap;
      gap: 1rem;
      padding: 0.5rem 0.5rem 0.75rem;
      min-width: max-content;
    }

    .project-filters p {
      display: none;
    }
  }
</style>

<div class="post">
  {% if site.projects_description %}
    <div class="header-bar">
      <h3>{{ site.projects_description }}</h3>
    </div>
  {% endif %}

  <!-- Filters (shared blog style) -->
  <div class="tag-category-list project-filters">
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

      <section class="project-category" data-category="all">
        <div class="row row-cols-1 row-cols-md-3 g-3">
          {% assign all_projects = site.projects | sort: "title" %}
          {% for project in all_projects %}
            {% include projects.liquid %}
          {% endfor %}
        </div>
      </section>

      {% for category in page.display_categories %}
        <section class="project-category" data-category="{{ category }}" style="display:none;">
          <div class="row row-cols-1 row-cols-md-3">
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
  const filters = document.querySelectorAll('.project-filters li');
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
