---
layout: default
title: Maminiaina "Mami" Ravaloarison — Software Engineer
description: Maminiaina "Mami" Ravaloarison is a Software Engineer from Madagascar, currently a Junior Data Analyst in New York. Latest projects, writing, and contact links.
homepage: true
seo:
  type: Person
---
{%- comment -%}
  Short About. The headline, profile links, two latest projects and two
  latest posts. The long bio (Bio, photos, experience, education, awards)
  lives on /bio/. All the words are in _data/about.yml.
{%- endcomment %}


{% include page-header.html title="Maminiaina Ravaloarison" %}

{% include bio-tabs.html current="short" %}

<p class="bio-lead">{{ site.data.about.headline }}</p>

<div class="profile-links">
  <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a>
  {% for link in site.social.links %}
  {% assign label = link %}
  {% if link contains "github.com" %}{% assign label = "GitHub" %}{% endif %}
  {% if link contains "linkedin.com" %}{% assign label = "LinkedIn" %}{% endif %}
  {% if link contains "devpost.com" %}{% assign label = "Devpost" %}{% endif %}
  <a href="{{ link }}" target="_blank" rel="me noopener">{{ label }}</a>
  {% endfor %}
  <a href="{{ site.data.about.contact.resume | relative_url }}" target="_blank" rel="noopener">Resume</a>
</div>

{% if site.data.about.looking_for and site.data.about.looking_for != "" %}
{% assign looking_for = site.data.about.looking_for | replace: "%email%", site.author.email %}
{% include callout.html label="Looking for" text=looking_for %}
{% endif %}

{%- assign latest_projects = site.projects | sort: "date" | reverse | slice: 0, 2 %}
## <a href="{{ '/projects/' | relative_url }}">Projects</a>

{% include card-grid.html items=latest_projects %}

<p class="see-more"><a href="{{ '/projects/' | relative_url }}">See all {{ site.projects.size }} projects</a></p>

{%- assign latest_posts = site.posts | sort: "date" | reverse | slice: 0, 2 %}
## <a href="{{ '/blog/' | relative_url }}">Blog</a>

{% include post-list.html posts=latest_posts descriptions=true %}

<p class="see-more"><a href="{{ '/blog/' | relative_url }}">See all blog posts</a></p>
