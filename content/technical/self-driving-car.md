---
title: "Self-Driving Car Simulation with Neural Networks in Pure JavaScript"
date: "2026-05-18"
summary: "A 2D autonomous vehicle simulation and physics engine built from scratch with genetic algorithm training."
tags: ["neural-networks", "javascript", "simulation"]
link: "https://github.com/rishi-msrit/self-driving-car"
linkLabel: "View on GitHub"
pinned: false
draft: false
---

# Neuro-Drive GT

A self-driving car simulation and arcade racing game built entirely from scratch with **Vanilla JavaScript, HTML5 Canvas, and Web Audio API**. No external libraries, no frameworks, and no build tools required.

The project combines real-time 2D vehicle physics with an unsupervised genetic algorithm (neuroevolution) to train cars to navigate highway traffic using simulated LIDAR sensors.

---

## Live Demo & Quick Start

Simply open **`index.html`** in any modern web browser.

Because all assets and logic are self-contained:
- Works directly via local file (`file:///`) or any static web server
- Ready for zero-config deployment on Vercel or GitHub Pages

---

## Game Modes

1. **Pilot Survival (Manual Mode)**
   - Take manual control of the car and dodge traffic on a 5-lane highway.
   - Live AI co-pilot telemetry: while you drive, the car's LIDAR sensors feed into the neural network in real time, displaying the AI's steering and throttle advice alongside your inputs.

2. **AI Evolution Lab (Training Mode)**
   - Train a swarm of AI cars simultaneously using a genetic algorithm.
   - Adjust population size, mutation rate, and simulation speed (1x, 2x, 5x warp).
   - The fittest car in each generation (longest distance traveled without crashing) serves as the genetic template for the next generation.

3. **The Duel (Human vs. AI)**
   - Race head-to-head against your trained AI champion on the same road.
   - Real-time lead distance telemetry shows who is ahead.

---

## Controls

| Action | Key / Input |
| :--- | :--- |
| **Accelerate / Reverse** | `W` / `S` or `Up` / `Down` |
| **Steer Left / Right** | `A` / `D` or `Left` / `Right` |
| **Nitro Boost** | `Space` |
| **Quick Repair** | `R` (resets damage if shield is compromised) |
| **Mute / Unmute Audio** | Audio toggle button in header |
| **Change Theme** | CYBER / SYNTH / DARK buttons in header |

---

## How the AI Works

- **Sensors:** 5 radial LIDAR rays cast from the vehicle. Each ray detects intersections with road borders and other vehicles, returning normalized distance values (0 = path clear, 1 = obstacle contact).
- **Architecture:** Multi-Layer Perceptron (MLP) with 5 inputs, 6 hidden neurons, and 4 outputs (`Forward`, `Left`, `Right`, `Reverse`).
- **Activation:** Binary threshold step activation (`sum > bias ? 1 : 0`).
- **Training Strategy:** Neuroevolution (Genetic Algorithm). Instead of backpropagation, the population explores synaptic weight combinations. Successful paths are preserved, mutated, and refined over generations.
- **Model Persistence:**
  - Best brain weights automatically persist across browser sessions in `localStorage`.
  - **Export JSON / Import JSON:** Save trained models to your disk or load community brains.
  - **Benchmark Model:** A pre-trained champion brain is embedded out-of-the-box for instant testing without waiting for training.

---

## Project Structure

```
├── index.html        # Main interface and dual-canvas layout
├── style.css         # Arcade UI styling and themes
├── main.js           # Game loop, state coordinator, and mode switching
├── car.js            # Vehicle physics, steering inertia, and collision logic
├── road.js           # 5-lane highway generation and guardrails
├── sensor.js         # 5-ray radial LIDAR calculation
├── network.js        # Neural network forward pass, mutation, and default brain
├── visualizer.js     # Real-time animated neural network canvas
├── traffic.js        # Procedural traffic spawner and wave management
├── controls.js       # Keyboard and AI input handling
├── sound.js          # Web Audio API sound synthesis (engine, nitro, crash)
├── effects.js        # Collision sparks, smoke particles, and visual feedback
├── utils.js          # Polygon math, intersection math, and interpolation
├── car.png           # Vehicle sprite asset
├── vercel.json       # Deployment configuration
└── .gitignore        # Git ignore rules
```

---

## Technical Details

- **Zero Dependencies:** Pure browser APIs (Canvas 2D context, Web Audio API, requestAnimationFrame).
- **Sound Synthesis:** All sound effects (engine pitch modulation, tire screeches, collision impacts, nitro hum) are procedurally generated via audio oscillators and gain nodes—no external audio files to load.
- **Dynamic Bounding Boxes:** Rotated collision polygons computed per frame via trigonometry and checked using the Separating Axis Theorem (SAT).
- **Damage & Elastic Collisions:** Collisions impart recoil displacement, deduct shielding, and allow recovery rather than instantly freezing the game loop.

---

## Credits

Inspired by Radu Mariescu-Istodor's educational self-driving car series, expanded into an interactive arcade racing and neuroevolution laboratory.