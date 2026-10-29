<div align="center">

# 🚗 Akshat Vats — 3D Interactive Portfolio

An exploratory, real-time 3D web experience powered by **Three.js (WebGPU & WebGL2)**, **TSL (Three Shading Language)**, and **Rapier3D Physics**. Drive, explore projects, test your skills on the racing circuit, and discover interactive creative installations.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cloudflare%20Edge-0070f3?style=for-the-badge&logo=cloudflare&logoColor=white)](https://brawnsterdam.akshatavs1122.workers.dev/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-akaAkshat246%2FCrazy-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/akaAkshat246/Crazy)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./license.md)

</div>

---

## 🌟 Highlights & Core Features

* **🏎️ Physics-Driven Vehicle Dynamics**: Full rigid-body vehicle simulation with raycast suspensions, drift mechanics, tire skid marks, particle smoke, and dynamic body roll.
* **⚡ Dual WebGPU & WebGL2 Backend**: Built with Three.js WebGPURenderer using TSL nodes with automatic, performant fallback for devices running WebGL2.
* **🚀 Universal Shader Pre-Warming**: Pre-compiles all scene materials, environment reflections, and post-processing passes (Bloom, Depth of Field) during the initial percentage loader to guarantee **true 60/120 FPS** with zero frame stutter from the very first drive.
* **📱 Ultra-Responsive Across All Devices**:
  * **Adaptive DPR Limiting**: Clamps mobile pixel ratio to 1.5x, cutting GPU fill-rate load by 40–50% on dense Retina screens while preserving razor-sharp visuals.
  * **Virtual Touch Joystick**: Integrated 3D on-screen joystick (`Nipple.js`) and tactile action buttons with auto-detection for mobile and tablet browsers.
  * **Dynamic Orientation**: Dual-tick listener adjusts aspect ratio and viewport boundaries across device rotations and mobile URL bar transitions.
* **⛅ Dynamic Atmospheric Cycles & Weather**:
  * Smooth day-and-night cycles with realistic sun angles, dynamic shadows, and celestial lighting shifts.
  * Procedural wind affecting tree foliage and vegetation sway.
  * Real-time weather effects: fog, rain, snow, lightning strikes, and an interactive particle tornado.
* **🎵 In-Game Soundtrack & Audio Engine**:
  * Powered by Howler.js with spatial 3D audio for engine sounds, skid friction, and water waves.
  * Integrated music player loaded with 10 CC0 background songs and HTTP Range streaming.
* **🌐 Multiplayer Presence & Real-Time Sync**:
  * Non-blocking WebSocket client connecting to live backend servers for cataclysm counters, global racing leaderboards, and persistent player whispers.

---

## 🗺️ Interactive World Map & Areas

| Area | Description | Interactive Element |
| :--- | :--- | :--- |
| **Landing** | Spawn point overlooking the central arena | Billboard controls guide & reset pad |
| **Projects Pavilion** | 3D display pedestals showcasing featured engineering builds | Interactive project modals & live preview links |
| **Tech Arsenal** | Developer skill columns (Frontend, Backend, AI/ML, Cloud, Databases) | Floating 3D badges with official brand tiles |
| **Career Timeline** | Professional history, university milestones, and achievements | High-contrast timeline plaques & experience cards |
| **Lab Experiments** | Experimental web projects, research papers, and creative writing | Interactive file viewer and direct PDF downloads |
| **Racing Circuit** | High-speed time trial track with checkpoint timing | Global leaderboard & arcade tag submission |
| **Bowling Minigame** | Physics-based bowling alley | Drive into pins for knockdown scoring |
| **Cookie Clicker** | Massive interactive 3D cookie | Click to trigger particle explosions & server counters |
| **Cataclysm Altar** | Ancient monument with energy pillar | Global community cataclysm trigger |
| **Time Machine** | Sci-Fi portal linking across creative journeys | Jump in to open developer archives & repositories |

---

## 🛠️ Tech Stack & Architecture

```
Crazy (Portfolio)
 ├── Three.js (r174+)       → WebGPU Renderer, TSL Shader Nodes, Post-Processing
 ├── Rapier3D (@dimforge)   → WebAssembly Physics, Rigid Bodies, Raycast Vehicle
 ├── Vite 7                 → Ultra-fast HMR, Top-Level Await, WASM Plugin
 ├── Howler.js              → Spatial 3D Audio, Background Soundtrack Queue
 ├── GSAP                   → Camera Transitions, Tweens, Modal Animations
 ├── Msgpack-Lite           → High-efficiency binary serialization for WebSockets
 └── Stylus                 → Responsive, modular UI styling
```

---

## 🎮 Controls

### Desktop (Keyboard & Mouse)
| Action | Key / Input |
| :--- | :--- |
| **Steer & Accelerate** | `W`, `A`, `S`, `D` or `Arrow Keys` |
| **Brake / Reverse** | `S` or `Down Arrow` |
| **Handbrake / Drift** | `Spacebar` |
| **Boost / Nitro** | `Shift` |
| **Honk Horn** | `H` |
| **Respawn Vehicle** | `R` |
| **Toggle Minimap** | `M` |
| **Switch Camera Mode** | `C` |
| **Free-Roam Camera** | `V` (in debug mode) |

### Gamepad (Xbox / PlayStation)
* **Steer**: Left Analog Stick
* **Accelerate / Brake**: Right & Left Triggers (`RT` / `LT`)
* **Handbrake**: `A` / `Cross`
* **Honk**: `B` / `Circle`
* **Respawn**: `Y` / `Triangle`

### Mobile & Tablet
* **Drive & Steer**: Touch and drag anywhere on the left screen for the 3D Virtual Joystick.
* **Actions**: On-screen buttons for Accelerate, Brake, Horn, and Map.

---

## 💻 Featured Projects

| Project | Description | Live Link |
| :--- | :--- | :--- |
| **Brawnsterdam** | Real-time 3D interactive web environment & creative platform | [Launch](https://brawnsterdam.akshatavs1122.workers.dev/) |
| **ABES Nexus** | Academic & community portal for campus resources | [Launch](https://abes-nexus.onrender.com) |
| **Debug Assistant** | AI-assisted code diagnostics and intelligent error resolution | [Launch](https://debug-assistant-5g7p.onrender.com) |
| **Aarogya Grid AI** | Healthcare telemetry and patient routing platform | [Launch](https://aarogya-grid-ai-alpha.vercel.app/) |
| **WaterMap** | Geospatial water resource tracking and environmental analytics | [Launch](https://watermap-frontend-120030173066.us-central1.run.app) |
| **Ha-X Baby** | Interactive creative web application with responsive animations | [Launch](https://koko-talks.ai.studio/) |
| **Janamashtami** | Cultural festival interactive 3D web experience | [Launch](https://janamashtamii.netlify.app) |
| **My Project** | Personal portfolio showcase and creative sandbox | [Launch](https://akaakshat246.github.io/my-project/) |

---

## 🎓 Education & Career Milestones

| Year | Milestone | Details |
| :--- | :--- | :--- |
| **2006** | **The Journey Begins** | Born in 2006; lifelong tech enthusiast & software craftsman |
| **2023** | **Class 10th Board Examinations** | Completed with **95.6%** score |
| **2025** | **Class 12th Board Examinations** | Completed with **90.0%** score |
| **2025** | **Governor Awardee** | State Governor Award Honoree for academic & extracurricular excellence |
| **2025 – Present** | **B.Tech in Computer Science & Engineering** | Pursuing undergraduate engineering in Computer Science |

---

## 🌐 Connect With Akshat Vats

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-akaAkshat246-181717?style=for-the-badge&logo=github)](https://github.com/akaAkshat246)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Akshat_Vats-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/akshat-vats-b6b1692b6/)
[![Email](https://img.shields.io/badge/Mail-akshatavs1122%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:akshatavs1122@gmail.com)
[![LeetCode](https://img.shields.io/badge/LeetCode-Akshat__avs-FFA116?style=for-the-badge&logo=leetcode&logoColor=black)](https://leetcode.com/u/Akshat_avs/)
[![CodeChef](https://img.shields.io/badge/CodeChef-akshat__vats963-5B4638?style=for-the-badge&logo=codechef&logoColor=white)](https://www.codechef.com/users/akshat_vats963)
[![Codolio](https://img.shields.io/badge/Codolio-akaAkshat246-00C49F?style=for-the-badge)](https://codolio.com/profile/akaAkshat246)
[![HackerRank](https://img.shields.io/badge/HackerRank-akshat__25b010103-2EC866?style=for-the-badge&logo=hackerrank&logoColor=white)](https://www.hackerrank.com/profile/akshat_25b010103)
[![GeeksforGeeks](https://img.shields.io/badge/GeeksforGeeks-akshatadz0l-2F8D46?style=for-the-badge&logo=geeksforgeeks&logoColor=white)](https://www.geeksforgeeks.org/profile/akshatadz0l)
[![Instagram](https://img.shields.io/badge/Instagram-who__akshatvats-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/who_akshatvats)

</div>

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
* `npm` (comes bundled with Node.js)

### Installation
```bash
# Clone the repository
git clone https://github.com/akaAkshat246/Crazy.git

# Enter the project directory
cd Crazy

# Install dependencies
npm install --force
```

### Running Locally
```bash
# Start development server
npm run dev
```
Open **`http://localhost:5173/`** in your browser (Google Chrome, Microsoft Edge, Brave, or Safari).

### Production Build & Zero-Latency Preview
```bash
# Compile and optimize for production
npm run build

# Preview production build locally on port 8080
npm run serve
```

### Deploy to Cloudflare Pages (Instant Zero-Latency Edge)
```bash
# Deploy pre-built dist folder directly to Cloudflare's global edge network
npx wrangler pages deploy dist --project-name akshat-vats-portfolio
```

---

## ⚙️ Deterministic Game Loop

The engine executes on an ordered priority tick cycle to eliminate physics jitter:

```
Priority 0   : Inputs (Keyboard, Gamepad, Touch, Pointer)
Priority 1   : Player Pre-Physics Input Mapping
Priority 2   : Vehicle Raycast Suspension Calculation
Priority 3   : Rapier3D Simulation Step
Priority 4   : Rigid Body Transforms & Wireframe Sync
Priority 5   : Physical Vehicle Transforms Post-Physics
Priority 6   : Player Position Smoothing
Priority 7   : Chase Camera Matrix Interpolation
Priority 8   : Day/Night Cycle, Weather & Atmosphere Updates
Priority 9   : Foliage Wind Displacements & Dynamic Lighting
Priority 10  : Particle Systems (Trails, Skid Dust, Smoke, Fog, Rain, Snow)
Priority 13  : Instanced Mesh Groups Sync
Priority 14  : Spatial Audio Positioning & UI Overlays
Priority 998 : Post-Processing Pipeline Execution & Bloom Composition
```

---

## 📄 License

This project is open-source under the [MIT License](./license.md).

Copyright (c) 2026 **Akshat Vats**. All rights reserved.
