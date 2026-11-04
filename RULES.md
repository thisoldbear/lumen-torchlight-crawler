# 🕯️ LUMEN: The Torchlight Catacombs (v1.3.0)
## Complete Physical Tabletop Rules (52-Card Solitaire Crawl)

---

### 1. Physical Components Required

1. **One Standard 52-Card Playing Deck** (No Jokers).
2. **One Token / Coin** (Your Player Adventurer marker on the grid).
3. **Pencil & Scrap Paper / Index Card** (Or dice / counters) to track:
   - **HP:** Starts at `20` (Max `20`)
   - **Torch:** Starts at `6` (Max `8`)
   - **Gold:** Starts at `0`
   - **Level & XP:** Starts at `Level 1` (`0 / 10 XP`)
   - **Base ATK:** Starts at `3`
   - **Equipped Weapon:** Starts at `None` (+0 ATK)
   - **Equipped Armor:** Starts at `None` (+0 DEF)
   - **Potions in Pack:** Starts with `1` (Max `2`)
   - **Revive Ward:** `No`

---

### 2. Deck Partition & Setup (Exact 52-Card Math)

1. **Find and Set Aside the Ace of Spades ♠ (The Underlord).**
2. **Shuffle the remaining 51 cards thoroughly.**
3. **Draft Hand (3 Cards):**
   - Deal 3 cards face-up in front of you.
   - Choose **1 card** to keep as your starting boon:
     - **♦ Diamond:** If number, gain that much starting Gold. If Face card, gain a starting weapon (+1 ATK).
     - **♥ Heart:** Start with an extra Potion (+1 to pack).
     - **♣ Club:** Start with +2 Torch (8/8).
     - **♠ Spade:** Start with +1 ATK Bone Dagger.
   - Place the 2 unchosen cards into the Discard / Void pile.
4. **Build the 5 Floor Piles (9 Cards Each):**
   - **Floors 1, 2, 3, 4:** Deal 9 face-down cards into 4 separate piles.
   - **Floor 5 (The Underlord's Sanctum):** Deal 8 cards from the deck, add the **Ace of Spades ♠**, and shuffle this 9-card pile together.
5. **Wandering Merchant Reserve:**
   - The remaining **4 cards** form the Merchant's Stash, placed to the side.

$$\text{Deck Total: } 3 \text{ (Draft)} + (5 \times 9 \text{ Floors}) + 4 \text{ (Merchant)} = 52 \text{ cards}$$

---

### 3. Exploring a Floor (The 3x3 Grid)

Take the 9 cards for the current floor and lay them out in a **3x3 face-down grid**:

```
[ Entrance (0,0) ] --- [ Room (0,1) ] --- [ Room (0,2) ]
        |                     |                  |
[ Room (1,0) ]     --- [ Room (1,1) ] --- [ Room (1,2) ]
        |                     |                  |
[ Room (2,0) ]     --- [ Room (2,1) ] --- [ Stairs (2,2) ]
```

1. **Entrance `(0,0)`:** Flip this top-left card **face-up immediately** and place your Player Token on it. Resolve this card without risk of ambush.
2. **Movement:** You may move your token **1 room orthogonally** (Up, Down, Left, Right). No diagonal movement.
3. **Vision & Movement Choices (Adjacent Face-Down Room):**
   - **A. Scout Ahead (Costs 1 Torch):**
     - Deduct 1 Torch from your tracker.
     - Flip the adjacent card face-up. You now know what lies ahead before deciding to step in!
   - **B. Blind Step (Conserve Torch):**
     - Move your token into the face-down room without spending Torch.
     - Flip the card face-up upon entry.
     - ⚠️ **DANGER:** If this card is a **Spade ♠ (Monster)**, you are **AMBUSHED**! The monster immediately strikes you once for free before combat starts!
4. **Pitch Black (Torch = 0):**
   - You cannot scout ahead. You must step blindly into every room.
   - All monsters gain +1 Attack.

---

### 4. Resolving Encounters

#### ♠ Spades — Monsters & Combat
> **Important Note:** You do **not** hold or play cards to attack! The 52-card deck represents the dungeon chambers and hazards. Your Hero strikes directly using your character's current stats ($\text{Base ATK} + \text{Equipped Weapon ATK}$).

- **Monster HP** = Card Value ($2–10 = \text{Rank}, J=11, Q=12, K=13$).
- **Monster Attack** = $\lceil \text{Card Value} / 2 \rceil$ (+1 if Torch = 0 / Pitch Black).
  *(e.g., Rank 2 = 1 ATK, Rank 3 = 2 ATK, Rank 10 = 5 ATK, Face cards = 6–7 ATK).*
- **Floor 5 Final Boss — Ace of Spades ♠ (The Underlord Awakened):**
  The Underlord is a menacing two-phase encounter (track on paper as `[20] | [20]`):
  - **Phase 1: Slumbering Sovereign (20 HP, 8 ATK):** The mortal vessel. Protected by a *Void Shroud* that absorbs fire (immune to Torch Flare).
  - **Phase 2: The Void Unleashed (20 HP, 10 ATK):** Triggered when Phase 1 reaches 0 HP. The Underlord unleashes an abyssal roar dealing **3 unavoidable direct damage**, and gains *Crushing Ruin* ($\max(3, 10 - \text{Equipped Armor DEF})$)—strikes deal a minimum of 3 damage even through heavy plate!
- **Combat Turns:**
  1. *Ambush Check:* If you stepped blindly into an unrevealed room, take:
     $$\text{Ambush Damage} = \max(1, \text{Monster Attack} - \text{Equipped Armor DEF})$$
  2. *Hero Strike:* You strike first (unless ambushed above). Deal damage equal to $\text{Base ATK} + \text{Equipped Weapon ATK}$ directly to Monster HP.
     - **Instant Slay:** If Monster HP $\le 0$, the monster dies immediately and does **not** counter-attack (or triggers Phase 2 for The Underlord)! Collect XP equal to $\lceil \text{Rank} / 2 \rceil$ (Face cards: 6 XP, Ace: 8 XP).
  3. *Monster Counter-Attack:* Only if the monster survived your strike, it strikes back:
     $$\text{Damage Taken} = \max(1, \text{Monster Attack} - \text{Equipped Armor DEF})$$
     *(Note: Phase 2 Underlord uses Crushing Ruin minimum 3 damage).*
  4. *Tactical Actions:* Drink a potion (+8 HP without enemy retaliation), cast Torch Flare at Lvl 4 (6 damage, limited to 1x per battle), or flee.
  5. *Tactical Retreat:* You may spend 1 Torch and take 2 direct recoil damage to flee back to your previous tile.
  6. *Strategy — Fight vs. Flee:*
     - **Fight for Growth:** Monsters are your only source of XP to level up, gain Max HP, unlock natural DEF, and prepare for The Underlord. Defeating a monster also clears the chamber for safe transit.
     - **Flee as an Emergency Brake:** Fleeing incurs a fixed $-1\text{ Torch}$ and $-2\text{ HP}$ penalty. If you blunder into a lethal high-rank monster early on (e.g. King ♠), taking the flat recoil to retreat and find alternate routes (potions, equipment, or timber) is far better than losing your run.

#### ♣ Clubs — Hazards & Timber Salvage
- **Trap Damage:** Take $\max(1, \lfloor \text{Rank} / 2 \rfloor - \text{Armor DEF})$ direct damage.
- **Timber Salvage:** Disarming/surviving the trap yields dry wood: **Add +2 to your Torch tracker** (up to Max 8)!

#### ♦ Diamonds — Treasure & Armory
- **Ranks 2–10:** Add Gold to your purse equal to the card rank.
- **Jack ♦ (Merchant):** You may visit the Wandering Merchant (see shop table below).
- **Queen ♦ (Aegis Shield):** Equip as Armor (+3 DEF).
- **King ♦ (Dragon Blade):** Equip as Weapon (+4 ATK) and gain +10 Gold.
- **Ace ♦ (Sun Ring):** +25 Gold and permanently increase Max HP by +5.

#### ♥ Hearts — Healing & Sanctuaries
- **Ranks 2–10 (Potion):** Restore HP equal to the rank (up to Max HP). If already at full HP, store 1 Potion in your pack (Max 2).
- **Jack ♥ (Campfire):** Rest and recover. Heal 8 HP AND restore +3 Torch!
- **Queen ♥ (Fairy Blessing):** Gain +4 Max HP and heal 8 HP.
- **King ♥ (Knight Sanctuary):** Holy barrier: completely negates the next damage instance you take.
- **Ace ♥ (Fountain of Rebirth):** Full heal + gain a **Revive Token** (if HP hits 0, revive once at 10 HP).

---

### 5. Leveling Progression Table

Defeating Spades awards XP. When XP reaches the threshold, level up immediately:

| Level | XP Threshold | Level Perks |
| :--- | :--- | :--- |
| **Level 1** | 0 XP | Base ATK: 3, Base DEF: 0, Max HP: 20, Max Torch: 8 |
| **Level 2** | 10 XP | +5 Max HP, Instant +5 Heal, Base ATK increases to 4 |
| **Level 3** | 25 XP | +5 Max HP, Base DEF increases to 1 |
| **Level 4** | 45 XP | Base ATK increases to 5, Unlock **Torch Flare** (Spend 2 Torch for 6 instant fire damage; 1x per battle) |

---

### 6. Wandering Merchant Price List

When visiting the merchant (Jack ♦ or between floors):
- **Torch Tinder (+3 Torch):** 4 Gold
- **Healing Potion (+1 Pack):** 6 Gold
- **Knight Armor (+2 DEF):** 10 Gold
- **Runic Blade (+3 ATK):** 12 Gold
- **Phoenix Amulet (Revive Token):** 18 Gold

*(You may select multiple items to buy in a single transaction as long as you have sufficient Gold. Deduct the total cost from your tracker and update your gear before continuing your expedition).*

---

### 7. Descending Floors & Game End

1. Clear or defeat the tile at **Stairs `(2,2)`**.
2. **Catch Your Breath (Field Dressing):** When descending the stairs into a new floor, apply field dressing to restore **+10 HP** (up to your Max HP)!
3. Advance to the next Floor pile (gather the previous floor cards into the discard pile).
4. **Floor 5 Boss:** On Floor 5, the **Ace of Spades ♠ (The Underlord: Two Phases, 20 HP / 8 ATK $\to$ 20 HP / 10 ATK)** is waiting.
5. **Victory:** Defeat The Underlord on Floor 5!
6. **Legacy Score Calculation:**
   $$\text{Final Score} = (\text{HP} \times 10) + (\text{Gold} \times 5) + (\text{Level} \times 50) + (\text{Weapon ATK} \times 20) + 200 \text{ (Clear Bonus)}$$

---

### 8. The Abyssal Cycles (Infinite Playability & Push-Your-Luck Ascension)

When you vanquish The Underlord on Floor 5 (or the final floor of any cycle), you reach a high-tension crossroad:

#### Option A: Retire with Glory (Cash Out)
Conclude the expedition, claim victory, and tally your final Legacy Score.

#### Option B: Delve into the Abyss (Enter Cycle $C + 1$)
Plunge deeper into the catacombs with scaled hazards, escalating bosses, and an increasing Legacy Score multiplier!

1. **The 30-Second Reset Ritual:**
   - **Retain Hero State:** Keep your current Level, Base ATK, Base DEF, equipped Weapon, Armor, Gold purse, remaining Potions, and active Revive Ward. Record `Cycle = Cycle + 1`.
   - **Gather All 52 Cards:** Collect all floor cards, discard piles, and merchant cards.
   - **Extract The Underlord:** Find and set aside the **Ace of Spades ♠**.
   - **Shuffle & Partition:** Shuffle the remaining 51 cards. Deal the 3-card Draft (choose 1 boon), deal 4 floor piles of 9 cards (Floors 6–9), shuffle the Ace of Spades into the 5th floor pile (Floor 10 Sanctum), and set aside 4 merchant cards.
   - **Field Dressing:** Restore **+10 HP** (up to Max HP) as you cross the threshold into the new Cycle!
2. **Mental-Math Tabletop Scaling ($C$ = Current Cycle Number):**
   - **Monster HP:** $\text{Rank} + (C - 1) \times 5$
   - **Monster ATK:** $\lceil \text{Rank} / 2 \rceil + (C - 1) \times 2$ (+Cycle in Pitch Black)
   - **Trap Damage (Clubs ♣):** $+(C - 1)$ direct hazard damage before DEF
   - **The Underlord:** Gains $+10\text{ HP}$ per phase and $+2\text{ ATK}$ per cycle ($30\text{ HP}$ / $10\text{ ATK}$ in Cycle 2, $40\text{ HP}$ / $12\text{ ATK}$ in Cycle 3). Crushing Ruin pierce increases by $+1$ per cycle.
3. **Abyssal Legacy Multiplier:**
   - **Cycle 1 Victory:** Base Score ($\times 1.0$)
   - **Cycle 2 Victory:** Base Score $+ 500 \text{ pts} \times 1.5$ multiplier
   - **Cycle 3 Victory:** Base Score $+ 1000 \text{ pts} \times 2.0$ multiplier
   - **Fallen in the Abyss:** If defeated in Cycle $C > 1$, add **+400 PTS** for every previously completed cycle so risking the Abyss is never unrewarded!

---

## 📜 Copyright & Attribution

*LUMEN: The Torchlight Catacombs* is created and authored by **Daniel Williams**.  
© 2026 Daniel Williams. All rights reserved.  
Permission is granted for personal, non-commercial tabletop play.
