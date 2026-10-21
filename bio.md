---
layout: default
title: Full bio
description: Full bio of Maminiaina "Mami" Ravaloarison, a software engineer from Madagascar in New York who has won 12 hackathons, plays bass and draws.
permalink: /bio/
---
{%- comment -%}
  Long About page. The Bio text, photos and resume sections are all in
  _data/about.yml and this file only lays them out. The short About
  (headline, links, latest projects and posts) is on the home page.
{%- endcomment %}


{% include page-header.html title="Maminiaina Ravaloarison" stacked=true %}

{% include bio-tabs.html current="long" %}

{% capture drawing_link %}{% if site.arts.size > 0 %}[drawing]({{ '/arts/' | relative_url }}){% else %}drawing{% endif %}{% endcapture %}
<div class="bio-text">
{{ site.data.about.bio | replace: "%email%", site.author.email | replace: "%drawing%", drawing_link | markdownify }}
</div>

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
        <a class="win-row" href="{{ p.url | relative_url }}">
          <img class="award-icon" src="{{ '/assets/emoji/trophy.svg' | relative_url }}" width="48" height="48" alt="">
          <span class="win-main">
            <span class="win-award">{{ p.award }}</span>
            <span class="win-project">{{ p.title }}{% if p.event %} · {{ p.event }}{% endif %}</span>
          </span>
          <span class="win-side">
            <span class="win-school">{{ p.organization }}</span>
            <span class="win-year">{{ p.date | date: "%Y" }}</span>
          </span>
        </a>
      </li>
      {% endfor %}
    </ul>
    {% endif %}
    {% if award.url %}<p class="win-more"><a href="{{ award.url }}" target="_blank" rel="noopener">{% if award.url contains "devpost.com" %}All {{ award.title | downcase }} on Devpost{% else %}{{ award.title }}{% endif %}</a></p>{% endif %}
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
