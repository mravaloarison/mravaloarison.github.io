---
title: SlayTheInterview
seo:
  type: CreativeWork
description: A mock-interview app built at HackSBU where we won Best Overall; I built the backend, MongoDB integration, voice-to-text, and AI question generation.
category: Hackathon
date: 2021-04-01
award: Best Overall
event: HackSBU
organization: Stony Brook University
image: /assets/images/SlayTheInterview.png
image_alt: Screenshot of the SlayTheInterview app's mock interview recording screen
tech: [Flask, MongoDB, Speech Recognition, Python, OpenAI, React]
links:
  devpost: https://devpost.com/software/hackyourinterview
redirect_from:
  - /projects/slaytheinveterview/
---

## Overview

We built a classic interview preparation app at Stony Brook University during HackSBU, where we won Best Overall for execution and functionality. I worked on implementing voice-to-text on the frontend, setting up the backend, integrating AI features, and connecting the app to MongoDB for data storage.

<div class="ratio ratio-16x9 mb-4">
<iframe width="560" height="315" src="https://www.youtube.com/embed/Q6GH9J05LaM?si=ylAborTilKTgUDXm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## What I built

Although this type of app is very popular now, it wasn't as well known when we built it. It's a platform for mock interviews tailored to the jobs users plan to apply for. The idea came from [Nelson Wang](https://www.linkedin.com/in/nelson-wang-yang/?locale=en_US){:target="_blank" rel="noopener"}, who also orchestrated the app's core logic.

The concept is straightforward: users enter the job they're preparing for and can even paste the job description. The AI then generates mock interview questions, and users respond by recording their answers. Afterward, the app analyzes their responses and provides feedback on what they could improve.

We worked as a team of four, and my role was connecting the backend to MongoDB, setting up the database, implementing speech-to-text on the frontend, and integrating the OpenAI API to generate questions.
