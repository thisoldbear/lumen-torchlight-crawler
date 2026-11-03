# 🤖 AGENTS.md — Developer & AI Agent Guidelines

> **Project:** *LUMEN: The Torchlight Catacombs*  
> **Author & Creator:** Daniel Williams  
> **Tech Stack:** Vite + React 18 + TypeScript + Vitest (3-Bit Retro Arcade Aesthetics)

---

## 1. Project Overview & Core Philosophy

*LUMEN: The Torchlight Catacombs* is a solo spatial RPG dungeon crawler played with a standard 52-card deck. It exists in two synchronized forms:
1. **The Physical Tabletop Game:** Played with a physical 52-card deck, pen & paper, and a player token (documented in [`RULES.md`](./RULES.md)).
2. **The Web Application:** A retro 3-bit browser implementation built with Vite, React, and TypeScript.

---

## 2. Mandatory Rule Synchronization Protocol ⚠️

**Whenever any rule, stat, formula, card effect, or mechanic is modified, added, or rebalanced, agents MUST keep all of the following in strict synchronization:**

1. **[`RULES.md`](./RULES.md):** The physical tabletop rulebook must always be updated to reflect exact physical play instructions.
2. **In-Game Guide Modal ([`src/components/DraftModal.tsx`](./src/components/DraftModal.tsx)):** The `🕯️ GUIDE 🕯️` overlay accessible via the `"Read the guide"` button on the draft screen must accurately describe the current rules to players.
3. **Core Engine ([`src/utils/rules.ts`](./src/utils/rules.ts)):** Pure rules and formulas must live here as the single source of truth for the codebase.
4. **Unit Tests ([`src/tests/`](./src/tests/)):** All development must follow **TDD (Test-Driven Development)** using **Vitest**. Update and expand tests in `src/tests/` to guarantee math boundaries, clamp logic, and edge cases.
5. **Version Number:** Incremented in [`package.json`](./package.json), and reflected across [`RULES.md`](./RULES.md) and [`README.md`](./README.md).

---

## 3. Architecture & Directory Layout

```
lumen-card-crawler/
├── AGENTS.md                  <-- This developer/agent guide
├── RULES.md                   <-- Complete physical tabletop rulebook
├── README.md                  <-- Project setup and overview
├── LICENSE                    <-- Copyright (c) 2026 Daniel Williams
├── package.json               <-- Project manifest & versioning
├── vite.config.ts             <-- Vite & Vitest configuration
├── index.html                 <-- Retro web mount with pixel fonts
└── src/
    ├── main.tsx               <-- React entrypoint
    ├── App.tsx                <-- Main game loop & screen orchestration
    ├── index.css              <-- 3-bit palette tokens & pixel styling
    ├── types.ts               <-- TypeScript domain types (Card, Tile, Player, etc.)
    ├── utils/
    │   ├── deck.ts            <-- 52-card generator, shuffle, 3x3 floor partitions
    │   └── rules.ts           <-- Pure game mechanics & math formulas (Single Source of Truth)
    ├── components/
    │   ├── RetroCard.tsx      <-- Pixel card rendering (revealed & fog states)
    │   ├── DungeonGrid.tsx    <-- 3x3 orthogonal map traversal & actions
    │   ├── HUD.tsx            <-- Top status bar (HP, Torch, XP, Gold, Gear)
    │   ├── CombatModal.tsx    <-- Battle screen (ambush, attack, flare, flee)
    │   ├── DraftModal.tsx     <-- 3-card opening draft & in-game GUIDE overlay
    │   ├── MerchantModal.tsx  <-- Wandering merchant shop between floors
    │   ├── GameOverModal.tsx  <-- Win/loss summary & legacy score calculation
    │   └── LogView.tsx        <-- Scrolling chronicle console
    └── tests/
        ├── deck.test.ts       <-- 52-card partition math & 3x3 layout tests
        ├── combat.test.ts     <-- Attack formulas, armor mitigation & ambush tests
        └── progression.test.ts<-- Level thresholds, inventory limits & scoring tests
```

---

## 4. Key Design Invariants

- **Exact 52-Card Math:** 
  $$\text{Total} = (5 \text{ floors} \times 9 \text{ cards}) + 3 \text{ draft cards} + 4 \text{ merchant cards} = 52 \text{ cards}$$
- **Ace of Spades (♠):** Always reserved as **The Underlord** (Final Boss) on Floor 5.
- **Visual Aesthetic:** Strict **3-bit retro styling** (vibrant 8-color palette, solid flat arcade buttons with no scanline stripes, pixel fonts).
- **Silent Operation:** No audio or sound effects per user specification.
- **Authorship:** All copyright notices attribute to **Daniel Williams (2026)**.

---

## 5. Verification Commands

Run unit tests to verify rules integrity before finishing any task:
```bash
npm run test
```
