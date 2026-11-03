# 🕯️ LUMEN: The Torchlight Catacombs (v1.0.0)
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
- **Monster HP** = Card Value ($2–10 = \text{Rank}, J=11, Q=12, K=13, A=15$).
- **Monster Attack** = Card Value.
- **Combat Turns:**
  1. *Ambush Check:* If you stepped blindly, take:
     $$\text{Ambush Damage} = \max(1, \text{Monster Attack} - \text{Equipped Armor DEF})$$
  2. *Hero Strike:* Deal damage equal to $\text{Base ATK} + \text{Equipped Weapon ATK}$. Deduct from Monster HP.
     - If Monster HP $\le 0$, the monster dies! Collect XP equal to $\lceil \text{Rank} / 2 \rceil$. Face cards give 6 XP. Ace gives 8 XP.
  3. *Monster Counter-Attack:* If alive, the monster deals:
     $$\text{Damage Taken} = \max(1, \text{Monster Attack} - \text{Equipped Armor DEF})$$
  4. *Repeat* rounds until one falls.
  5. *Tactical Retreat:* You may spend 1 Torch and take 2 direct recoil damage to flee back to your previous tile.

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
| **Level 1** | 0 XP | Base ATK: 2, Base DEF: 0, Max HP: 20, Max Torch: 8 |
| **Level 2** | 10 XP | +5 Max HP, Instant +5 Heal, Base ATK increases to 3 |
| **Level 3** | 25 XP | +5 Max HP, Base DEF increases to 1 |
| **Level 4** | 45 XP | Base ATK increases to 4, Unlock **Torch Flare** (Spend 2 Torch for 6 instant fire damage) |

---

### 6. Wandering Merchant Price List

When visiting the merchant (Jack ♦ or between floors):
- **Torch Tinder (+3 Torch):** 4 Gold
- **Healing Potion (+1 Pack):** 6 Gold
- **Knight Armor (+2 DEF):** 10 Gold
- **Runic Blade (+3 ATK):** 12 Gold
- **Phoenix Amulet (Revive Token):** 18 Gold

---

### 7. Descending Floors & Game End

1. Clear or defeat the tile at **Stairs `(2,2)`**.
2. Advance to the next Floor pile (gather the previous floor cards into the discard pile).
3. **Floor 5 Boss:** On Floor 5, the **Ace of Spades ♠ (The Underlord: 15 HP, 15 DMG)** is waiting.
4. **Victory:** Defeat The Underlord on Floor 5!
5. **Legacy Score Calculation:**
   $$\text{Final Score} = (\text{HP} \times 10) + (\text{Gold} \times 5) + (\text{Level} \times 50) + (\text{Weapon ATK} \times 20) + 200 \text{ (Clear Bonus)}$$

---

## 📜 Copyright & Attribution

*LUMEN: The Torchlight Catacombs* is created and authored by **Daniel Williams**.  
© 2026 Daniel Williams. All rights reserved.  
Permission is granted for personal, non-commercial tabletop play.
