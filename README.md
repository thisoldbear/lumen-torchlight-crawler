# 🕯️ LUMEN: The Torchlight Catacombs (v1.1.0)
*A 3-Bit Retro 52-Card Spatial Dungeon Crawler built with Vite + React + TypeScript.*

[![Repository](https://img.shields.io/badge/GitHub-thisoldbear%2Flumen--torchlight--crawler-1c62e8?style=flat&logo=github)](https://github.com/thisoldbear/lumen-torchlight-crawler)
[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-f02538)](#-copyright--authorship)
[![Tests: Vitest](https://img.shields.io/badge/Tests-Vitest%20Passed-00cc44?logo=vitest)](./src/tests/)

---

## 📖 Overview

**LUMEN: The Torchlight Catacombs** is a solo spatial RPG dungeon crawler played with a standard 52-card deck.

Unlike traditional card games that simply draw cards from a deck in a line, *LUMEN* lays cards out as a **2D $3 \times 3$ maze** representing dungeon chambers. Light is your most precious resource: spend torch charges to scout rooms ahead, or conserve fuel and step into the unknown—at the risk of being ambushed in the dark.

The game is playable in two formats:
1. **In the Browser:** A high-contrast 3-bit retro web application built with React & TypeScript.
2. **On the Tabletop:** With a standard physical 52-card deck, pen, and paper (see [**`RULES.md`**](./RULES.md)).

---

## 🕹️ Game Features

- **High-Contrast 3-Bit Retro Graphics:** Vibrant 8-color palette (`#ffcc00`, `#00e5e5`, `#f02538`, `#00cc44`, `#1c62e8`, `#e028a0`, `#0a0d14`, `#ffffff`) with solid arcade buttons and crisp pixel typography.
- **Silent & Distraction-Free:** Pure visual gameplay with zero sound effects.
- **Mathematical 52-Card Partition:**
  - 5 Floors $\times 9$ rooms ($3 \times 3$ grid) = 45 cards
  - 3-card opening Adventurer's Draft = 3 cards
  - 4-card Wandering Merchant reserve = 4 cards
  - Exactly 52 standard playing cards utilized with zero waste.
- **The Torchlight & Vision System:**
  - **Scout (-1 🕯️):** Spend 1 Torch to peek into adjacent face-down rooms before entering.
  - **Blind Step:** Move into an unrevealed room without spending fuel. If it's a **Spade ♠ (Monster)**, you suffer a free **Ambush Strike**!
  - **Pitch Black:** If your torch dies (0 charges), you can no longer scout.
- **Card Suit Ecology:**
  - **♠ Spades (Monsters & Bosses):** Turn-based combat where hero strikes first (unless ambushed). Slaying foes awards XP.
  - **♣ Clubs (Traps & Timber):** Disarm hazards to salvage wood for **+2 Torch**.
  - **♦ Diamonds (Treasure & Armory):** Collect Gold, equip Swords (+ATK), Shields (+DEF), and visit Wandering Merchants.
  - **♥ Hearts (Sanctuaries & Potions):** Drink or pocket potions (+HP), rest at Campfires (+HP & +Torch), and discover Revive Wards.
- **RPG Progression:** Defeat monsters to earn XP and level up (Lvl 1 $\to$ 4), permanently increasing Max HP, Base ATK, Base DEF, and unlocking the *Torch Flare* spell.
- **In-Game Guide:** Click the **"Read the guide"** button on the starting draft screen at any time to open the in-game `🕯️ GUIDE 🕯️` overlay.
- **Final Boss:** The **Ace of Spades ♠ (The Underlord)** waits at the exit stairs of Floor 5.

---

## 🎮 How to Run Locally

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Startup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/thisoldbear/lumen-torchlight-crawler.git
   cd lumen-torchlight-crawler
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Launch the development server:**
   ```bash
   npm run dev
   ```

4. Open the displayed URL (typically `http://localhost:5173`) in your browser.

---

## 🧪 Testing (TDD with Vitest)

All game rules, card distribution mathematics, combat mitigation formulas, and progression thresholds are verified with **Vitest**:

```bash
# Run test suite once
npm run test

# Run tests in watch mode
npm run test:watch
```

Test coverage includes:
- **`src/tests/deck.test.ts`:** Exact 52-card distribution, unique IDs, suit breakdown, and $3 \times 3$ grid coordinates.
- **`src/tests/combat.test.ts`:** Hero attack scaling, armor mitigation (minimum 1 damage), ambush strikes, and XP yield calculations.
- **`src/tests/progression.test.ts`:** Leveling thresholds, stat boosts, pouch limits, and legacy scoring formulas.

---

## 📂 Project Structure

```text
├── RULES.md                   # Full standalone tabletop rules for physical deck play
├── AGENTS.md                  # Developer & AI synchronization protocols
├── LICENSE                    # Copyright & licensing terms
├── index.html                 # Retro HTML shell & pixel font loading
├── src/
│   ├── App.tsx                # Main game orchestrator & stage router
│   ├── index.css              # 3-bit palette tokens & pixel styling
│   ├── types.ts               # Core TypeScript definitions
│   ├── utils/
│   │   ├── rules.ts           # Pure math & combat rules engine (Single Source of Truth)
│   │   └── deck.ts            # 52-card generator, shuffle, and floor dealing
│   ├── components/
│   │   ├── DungeonGrid.tsx    # 3x3 spatial room grid & movement controls
│   │   ├── RetroCard.tsx      # Pixel card rendering (revealed, cleared, & fog states)
│   │   ├── HUD.tsx            # Character status bar (HP, Torch, Gold, XP, Equipment)
│   │   ├── CombatModal.tsx    # Turn-based battle screen
│   │   ├── DraftModal.tsx     # Opening 3-card draft & in-game GUIDE overlay
│   │   ├── MerchantModal.tsx  # Wandering merchant shop between floors
│   │   ├── GameOverModal.tsx  # Victory/Defeat screen & final score breakdown
│   │   └── LogView.tsx        # Scrolling expedition chronicle
│   └── tests/                 # Vitest test suites
```

---

## 📜 Copyright & Authorship

Created and authored by **Daniel Williams**.  
© 2026 Daniel Williams. All rights reserved.  

*Permission is granted for personal, non-commercial tabletop play using a standard deck of cards.*
