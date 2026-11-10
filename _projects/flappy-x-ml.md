---
title: Flappy x ML
seo:
  type: CreativeWork
description: Flappy Bird controlled by your nose — MediaPipe face detection drives the bird's position, built with Kaboom.js for the game mechanics.
category: Personal
date: 2024-10-04
image: /assets/images/Flappy-x-ML.png
image_alt: Screenshot of the Flappy x ML game controlled by face detection
tech: [Mediapipe, JavaScript, KaboomJS, Face detection]
links:
  github: https://github.com/mravaloarison/Flappy-x-ML
---

## Overview

A recreation of the classic Flappy Bird game with face detection. Using Mediapipe for face detection and Kaboom.js for the game mechanics, the bird's vertical position is controlled by the movement of your nose detected through your webcam.

<div class="ratio ratio-16x9 mb-4">
<iframe width="560" height="315" src="https://www.youtube.com/embed/6fLMEm1HIjQ?si=ho2iU7Nfr7hIAjLn" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## What I built

I built it because I was curious about what integrating a machine learning model with a prebuilt MediaPipe model would look like and what fun use cases it could have.

#### Demo Links

-   [Video Demo](https://youtu.be/6fLMEm1HIjQ){:target="_blank" rel="noopener"}
-   [Github code](https://github.com/mravaloarison/Flappy-x-ML){:target="_blank" rel="noopener"}

#### How It Works

1. **Face Detection**: The game uses **Mediapipe's face detection model** to detect the position of your nose in real time.

    ```js
    function getLandmarks(results) {
    	if (results.detections.length > 0) {
    		const newPos = results.detections[0].landmarks[4].y * 591;
    		const event = new CustomEvent("updatedPosition", {
    			detail: { newPos },
    		});
    		window.dispatchEvent(event);
    	}
    }
    ```

2. **Bird Movement**: The bird's movement is based on the nose's vertical position, and smooth transition is achieved using linear interpolation.

    ```js
    window.addEventListener("updatedPosition", (event) => {
    	targetY = event.detail.newPos;
    });

    function smoothMove() {
    	if (GAME_OVER) return;

    	const delta = targetY - currentY;
    	if (Math.abs(delta) > 0.1) {
    		currentY = currentY + delta * lerpFactor;
    		player.pos.y = currentY;
    	} else {
    		currentY = targetY;
    		player.pos.y = currentY;
    	}
    }
    ```

#### Technology used

-   Kaboom.js: For the game mechanics and gamification.
-   Mediapipe: For face detection and landmark tracking.
