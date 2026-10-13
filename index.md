---
layout: default
title: Maminiaina "Mami" Ravaloarison — Software Engineer
description: Maminiaina "Mami" Ravaloarison is a Software Engineer from Madagascar, currently a Junior Data Analyst in New York. Experience, education, awards, and projects.
homepage: true
seo:
  type: Person
---

{% include page-header.html eyebrow="About" title="Mami Ravaloarison" abstract="Software engineer and data analyst in New York, from Madagascar. I build iOS apps, AI-powered web tools, and Power BI dashboards, and I've won 12 hackathons along the way." %}

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

{% capture looking_for %}Graduate programs and scholarships. If you know of one that might be a good fit, I'd love to hear about it at [{{ site.author.email }}](mailto:{{ site.author.email }}).{% endcapture %}
{% include callout.html label="Looking for" text=looking_for %}

## Latest work

The two projects that best show what I'm working on right now.

{% assign latest = site.projects | where: "featured", true | sort: "date" | reverse %}
{% include card-grid.html items=latest %}

## Overview

My name is Maminiaina Ravaloarison, though I go by Mami — I'm a Software Engineer from Madagascar. I came to the United States in 2021 to study Computer Information Systems at [Monroe University](https://www.monroeu.edu/){:target="_blank" rel="noopener"} and graduated in June 2025 with a Bachelor of Science and a minor in Mathematics.

Currently, I work as a Junior Data Analyst in New York City. My tasks are very broad, and I learn a lot from them. At work, I recreate legacy dashboards in Power BI, build and maintain SharePoint sites for my department, and was recently assigned to redesign my old university's library website using [SpringShare's LibGuides](https://www.springshare.com/libguides/){:target="_blank" rel="noopener"} platform as a side project.

I chose Software Engineer because building software makes me feel like I am a magician doing a bunch of tricks behind the scenes, and then my users go "wow." I think it is fun, and I also believe that right now is a very exciting time to be a developer because of AI. It reduces a lot of development time and makes it easy to build things much faster.

As an international student, I could only work on campus, so I started going to hackathons instead to get more exposure building software, working with different teams and under deadlines, experimenting with many APIs, SDKs, and new frameworks.

At one point I was honestly obsessed with hackathons, because during my academic years I won 12 of them across different U.S. Eastern universities like [Yale](https://www.yale.edu/){:target="_blank" rel="noopener"}, [Princeton](https://www.princeton.edu/){:target="_blank" rel="noopener"}, [Stony Brook](https://www.stonybrook.edu/){:target="_blank" rel="noopener"}, and more.

Outside of tech, I used to hate reading and writing, but I recently started pushing myself to do both more often. I also try to consistently cook healthy meals and go to the gym, though I'm still working on making those habits stick. Other things I love: dogs, piano, guitar and bass, chess, video games, {% if site.arts.size > 0 %}[drawing]({{ '/arts/' | relative_url }}){% else %}drawing{% endif %} (lately in Procreate), the beach, the sun, and Malibu.

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
