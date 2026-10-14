---
title: DogDuckGo
seo:
  type: CreativeWork
description: A browser typing game on a watercolour pond. Dogs disguised as ducks swim at you carrying words; type each one before it reaches you. PixiJS and TypeScript.
category: Personal
featured: true
status: ongoing # shows an "In progress" pill; remove when it ships
date: 2026-10-13
image: /assets/images/DogDuckGo.png
image_alt: Gameplay of DogDuckGo, a white duck in the middle of a watercolour pond while dogs wearing yellow shuttlecock beaks swim toward it, each labeled with a word to type
tech: [TypeScript, PixiJS, Vite, AssetPack]
---

## Overview

DogDuckGo is a typing game set on a watercolour pond. You're the duck in the middle. The pond dogs have put on yellow shuttlecock beaks and are paddling in from every side, pretending to be ducks, and each one carries a word. Type a dog's word before it reaches you and it swims away. Miss it, and it rises out of the water, barks, and you lose a heart.

There are two ways to play:

- **Learn something:** pick a topic (Science, History, Nature, Physics, Space, Geography or Animals). Each topic has three levels of six words. You see the words before a level starts, and afterwards a "What you learned" card explains each one.
- **Just have fun:** endless levels with more dogs, more speed and longer words each time, until you run out of hearts. Your best score is saved in the browser.

## What I built

I built the whole game in TypeScript with PixiJS 8, starting from the PixiJS creation template. There's no Enter key: a dog leaves the moment its last letter is typed, letters you've typed light up on every word they match, and a wrong letter just clears what you typed and makes the duck flinch.

The part I'm proudest of is how it's organized. The rules are plain TypeScript with no Pixi in them: one class owns the level's words, score and hearts, and only two events can change them, a word typed or a word missed. Everything you see on screen just reads that state and draws it. That made the edge cases easy to get right, like finishing a word in the same frame a dog arrives, or two dogs carrying the same word.

Around the game there's an opening story, the mode and topic screens, pause and settings menus with volume sliders, a game-over screen, and sharing through the device's share sheet. Every tuning number, from dogs per level to speeds and gaps between dogs, lives in one constants file, and the word lists are checked in development builds so a bad word can't slip in.
