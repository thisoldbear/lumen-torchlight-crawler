# 🕯️ LUMEN: The Torchlight Catacombs (v1.0.0)
*A 3-Bit Retro 52-Card Dungeon Explorer built with Vite + React + TypeScript.*

---

## 🎮 How to Run

1. Navigate to the project directory in your terminal:
   ```bash
   cd ~/lumen-card-crawler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the local development server:
   ```bash
   npm run dev
   ```

4. Open the displayed URL (e.g. `http://localhost:5173`) in your browser!

---

## 🕹️ Game Features

- **3-Bit Retro Color Palette & CRT Aesthetics:** 8-color retro visual scheme, scanlines, and pixel-arcade fonts.
- **Synthesized 8-Bit Chiptune SFX:** Native Web Audio API procedural sound effects for hits, coins, level-ups, steps, and spells. Zero external audio downloads needed.
- **Mathematical 52-Card System:**
  - 5 Floors $\times 9$ cards ($3 \times 3$ grid) = 45 cards
  - 3-card Adventurer's Draft pick = 3 cards
  - 4-card Wandering Merchant stash = 4 cards
  - Exactly 52 standard cards utilized!
- **Torchlight & Shadow Ambush:**
  - Spend **1 Torch** to peek/scout an adjacent card safely.
  - Or step in blindly to conserve fuel — but beware: if you step onto a **Spade ♠ (Monster)** in the dark, you get **Ambushed** (free strike against you!).
- **Suit Ecology:**
  - **♠ Spades:** Monsters & Bosses (Fight turn-by-turn, earn XP).
  - **♣ Clubs:** Traps & Hazards (Take minor damage, but salvage timber for **+2 Torch**).
  - **♦ Diamonds:** Gold, Swords (+ATK), Shields (+DEF), and Merchants.
  - **♥ Hearts:** Potions, Fairy Blessings, Campfires (+HP & +Torch), and Revive Tokens.
- **Boss Encounter:** The **Ace of Spades ♠ (The Underlord)** guards the exit stairs on Floor 5!

---

## 📜 Copyright & Authorship

Created and authored by **Daniel Williams**.  
© 2026 Daniel Williams. All rights reserved.
