---
title: DogDuckGo
seo:
  type: CreativeWork
description: A browser typing game on a pond. Golden retrievers disguised as ducks swim at you carrying words; type each one before it reaches you. PixiJS and TypeScript.
category: Personal
featured: true
status: ongoing # shows an "In progress" pill; remove when it ships
date: 2026-10-13
image: /assets/images/DogDuckGo.png
image_alt: Gameplay of DogDuckGo, a white duck in the middle of a teal pond with lily pads while golden retrievers wearing yellow shuttlecock beaks swim in from both sides, each with a word to type above it, and five hearts at the bottom
tech: [TypeScript, PixiJS, Vite, AssetPack]
---

## Overview

DogDuckGo is a typing game set on a pond. You're the duck in the middle. The pond's golden retrievers have put on yellow shuttlecock beaks and are paddling in from the left and right, pretending to be ducks, and each one carries a word. Type a dog's word before it reaches you and it swims away. Miss it, and it rises out of the water, the shuttlecock pops off, it barks, and you lose a heart.

You pick a version, then how hard (Easy, Medium or Hard), and the levels never run out: each one has more dogs, faster, with longer words, until you're out of hearts.

- **Version 1:** each dog carries a word, floating above it.
- **Version 2:** each dog carries a short sentence, shown as a block in a tray at the bottom of the screen. Every dog wears a small badge in its own shape and colour, and its block wears the same one. Each word you type right slows that dog down.

Once you've lost a heart, a frog pops up somewhere on the pond with a word of its own and a ring that drains over ten seconds. Type it in time and you win a heart back. When the run ends, the game-over card shows one of twelve pictures of the duck and the dogs, with your level, score and best, and you can redo the level once.

## What I built

I built the whole game in TypeScript with PixiJS 8, starting from the PixiJS creation template. There's no Enter key: a dog leaves the moment its last letter is typed, letters you've typed light up on every word they match, and a wrong letter just clears what you typed and makes the duck flinch.

The part I'm proudest of is how it's organized. The rules are plain TypeScript with no Pixi in them: one class owns the level's words, score and hearts, and only two events can change them, a word typed or a word missed. Everything you see on screen just reads that state and draws it. That made the edge cases easy to get right, like finishing a word in the same frame a dog arrives, or two dogs carrying the same word. It's also what let version 2 go in without touching the rules: the tray and the badges only read the dogs' state.

The game started in watercolour and is now flat art: the duck, the golden retriever (swim, caught, rise and bark), the pond and the lily pads were all redrawn, and the dogs are drawn from the side and mirrored, so they come in from the two sides and fan out around the duck instead of queuing in a line. The menus share one chalk look on a night pond with fireflies. Every tuning number, from dogs per level to speeds and gaps between dogs, lives in one constants file, and the word and sentence lists are checked in development builds so a bad one can't slip in.
