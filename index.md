---
layout: default
title: Maminiaina "Mami" Ravaloarison — Product Engineer
description: "I'm a product engineer from Madagascar, based in New York. I build apps and games, and I've won 12 hackathons along the way. Outside of work, I draw and play bass. Right now, I'm looking for master's programs with scholarships."
homepage: true
seo:
  type: Person
---
{%- comment -%}
  Short About, laid out like the share card: PORTFOLIO (with Short | Long),
  the name, and the headline; then the profile links, two latest projects,
  one piece from each Arts subcategory and two latest posts. The long bio
  (Bio, photos, experience, education, awards) lives on /bio/. All the
  words are in _data/about.yml.
{%- endcomment %}


{% include page-header.html eyebrow="Portfolio" title="Maminiaina Ravaloarison" abstract=site.data.about.headline tabs="short" %}

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

{%- comment -%} One piece from each Arts subcategory (art-picks.html); the section hides itself while there's no art. {%- endcomment -%}
{%- capture art_row %}{% include art-picks.html %}{% endcapture %}
{%- if pick_count > 0 %}
## <a href="{{ '/arts/' | relative_url }}">Arts</a>

{{ art_row }}

<p class="see-more"><a href="{{ '/arts/' | relative_url }}">See all art</a></p>
{%- endif %}

{%- assign latest_posts = site.posts | sort: "date" | reverse | slice: 0, 2 %}
## <a href="{{ '/blog/' | relative_url }}">Blog</a>

{% include post-list.html posts=latest_posts descriptions=true %}

<p class="see-more"><a href="{{ '/blog/' | relative_url }}">See all blog posts</a></p>
