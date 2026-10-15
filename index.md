---
layout: default
title: Maminiaina "Mami" Ravaloarison — Software Engineer
description: Maminiaina "Mami" Ravaloarison is a Software Engineer from Madagascar, currently a Junior Data Analyst in New York. Experience, education, awards, and projects.
homepage: true
seo:
  type: Person
---
{%- comment -%}
  Layout only. All the words on this page — headline, Looking for, Bio,
  and the resume sections — are in _data/about.yml.
{%- endcomment %}


{% include page-header.html eyebrow="About" title="Maminiaina Ravaloarison" abstract=site.data.about.headline %}

<div class="profile-links">
  <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a>
  {% for link in site.social.links %}
  {% assign label = link %}
  {% if link contains "github.com" %}{% assign label = "GitHub" %}{% endif %}
  {% if link contains "linkedin.com" %}{% assign label = "LinkedIn" %}{% endif %}
  {% if link contains "devpost.com" %}{% assign label = "Devpost" %}{% endif %}
  <a href="{{ link }}" target="_blank" rel="noopener">{{ label }}</a>
  {% endfor %}
  <a href="{{ site.data.about.contact.resume | relative_url }}" target="_blank" rel="noopener">Resume</a>
</div>

{% if site.data.about.looking_for and site.data.about.looking_for != "" %}
{% assign looking_for = site.data.about.looking_for | replace: "%email%", site.author.email %}
{% include callout.html label="Looking for" text=looking_for %}
{% endif %}

## Bio

{% capture drawing_link %}{% if site.arts.size > 0 %}[drawing]({{ '/arts/' | relative_url }}){% else %}drawing{% endif %}{% endcapture %}
{{ site.data.about.bio | replace: "%email%", site.author.email | replace: "%drawing%", drawing_link | markdownify }}

{% include photo-grid.html %}

## Experience

<ul class="entry-list">
  {% for job in site.data.about.experience %}
  <li>
    <p class="entry-title">{{ job.position }}</p>
    <p class="meta">{{ job.company }} — {{ job.location }}</p>
    <p class="meta">{{ job.start_date }} – {{ job.end_date }}</p>
    <ul class="entry-highlights">
      {% for h in job.highlights %}<li>{{ h }}</li>{% endfor %}
    </ul>
  </li>
  {% endfor %}
</ul>

## Education

<ul class="entry-list">
  {% for edu in site.data.about.education %}
  <li>
    <p class="entry-title">{{ edu.studyType }}{% if edu.area %}, {{ edu.area }}{% endif %}</p>
    <p class="meta"><a href="{{ edu.url }}" target="_blank" rel="noopener">{{ edu.institution }}</a> — {{ edu.location }}</p>
    <p class="meta">
      {{ edu.start_date }} – {{ edu.end_date }}
      {% if edu.score %}· {{ edu.score }}{% endif %}
      {% if edu.minor %}· Minor: {{ edu.minor }}{% endif %}
    </p>
  </li>
  {% endfor %}
</ul>

## Awards

<ul class="entry-list">
  {% for award in site.data.about.awards %}
  <li>
    <p class="entry-title">{{ award.title }}</p>
    <p class="meta">{{ award.awarder }} · {{ award.date }}</p>
    <p>{{ award.summary }}</p>
    {% if award.show_wins %}
    {% assign wins = site.projects | where_exp: "p", "p.award" | sort: "date" | reverse %}
    <ul class="win-list">
      {% for p in wins %}
      <li>
        <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
        <span class="meta">{{ p.award }}{% if p.event %} · {{ p.event }}{% elsif p.organization %} · {{ p.organization }}{% endif %}</span>
      </li>
      {% endfor %}
    </ul>
    {% endif %}
    {% if award.url %}<a href="{{ award.url }}" target="_blank" rel="noopener">View: {{ award.title }}</a>{% endif %}
  </li>
  {% endfor %}
</ul>

## Certificates

<ul class="entry-list">
  {% for cert in site.data.about.certificates %}
  <li>
    <p class="entry-title">{{ cert.name }}</p>
    <p class="meta">{{ cert.issuer }} · {{ cert.date }}</p>
  </li>
  {% endfor %}
</ul>

## Languages

<ul class="entry-list">
  {% for lang in site.data.about.languages %}
  <li><p class="entry-title">{{ lang.name }}</p><p class="meta">{{ lang.summary }}</p></li>
  {% endfor %}
</ul>

## Interests

<ul class="entry-list">
  {% for interest in site.data.about.interests %}
  <li><p class="entry-title">{{ interest.name }}</p><p class="meta">{{ interest.keywords }}</p></li>
  {% endfor %}
</ul>
