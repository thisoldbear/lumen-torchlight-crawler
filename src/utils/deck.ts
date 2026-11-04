import { Card, Rank, Suit, Tile } from '../types';

export const SUITS: Suit[] = ['spades', 'clubs', 'diamonds', 'hearts'];
export const RANKS: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

export function getRankValue(rank: Rank): number {
  if (typeof rank === 'number') return rank;
  if (rank === 'J') return 11;
  if (rank === 'Q') return 12;
  if (rank === 'K') return 13;
  if (rank === 'A') return 15;
  return 2;
}

export function getCardLore(suit: Suit, rank: Rank): { name: string; lore: string } {
  if (suit === 'spades') {
    if (rank === 'A') return { name: 'The Underlord', lore: 'Final Boss of the Necropolis. Slumbering below.' };
    if (rank === 'K') return { name: 'Grave Sovereign', lore: 'Ancient undead warlord with crushing mace.' };
    if (rank === 'Q') return { name: 'Banshee Queen', lore: 'Ethereal wailing specter draining life essence.' };
    if (rank === 'J') return { name: 'Crypt Berserker', lore: 'Frenzied skeleton wielding rusted cleavers.' };
    if (rank >= 8) return { name: 'Ghoul Ravager', lore: 'Ravenous denizen feeding on tomb dust.' };
    if (rank >= 5) return { name: 'Shadow Stalker', lore: 'Leaping spider-fiend hiding in ceiling crevices.' };
    return { name: 'Bone Scuttler', lore: 'Clicking skeletal vermin rattling with hate.' };
  }

  if (suit === 'clubs') {
    if (rank === 'A') return { name: 'Trial of the Ancients', lore: 'Sacred fire pit. Test of grit or great ruin.' };
    if (rank === 'K') return { name: 'Collapsing Vault', lore: 'Crumbling stone pillars and crushing boulders.' };
    if (rank === 'Q') return { name: 'Poison Gas Vents', lore: 'Green noxious fumes seeping through flagstones.' };
    if (rank === 'J') return { name: 'Spike Pit Trap', lore: 'Iron spears beneath loose stone tiles.' };
    return { name: 'Timber & Snare Trap', lore: 'Tripwire rigged to wooden logs. Can salvage +2 Torch.' };
  }

  if (suit === 'diamonds') {
    if (rank === 'A') return { name: 'Sun Ring (Relic)', lore: 'Holy artifact radiating passive warm light.' };
    if (rank === 'K') return { name: 'Dragon Wyrm Blade', lore: 'Legendary +4 ATK Greatsword in stone.' };
    if (rank === 'Q') return { name: 'Aegis Tower Shield', lore: 'Ornate +3 DEF heavy fortification.' };
    if (rank === 'J') return { name: 'Dungeon Merchant', lore: 'Cloaked trader offering weapons & supplies.' };
    return { name: `${rank} Gold Cache`, lore: 'Bag of imperial gold sovereigns.' };
  }

  // Hearts
  if (rank === 'A') return { name: 'Fountain of Rebirth', lore: 'Sacred water granting a Revive Ward.' };
  if (rank === 'K') return { name: 'Knight Sanctuary', lore: 'Holy bonfire. Full heal & restores Torch.' };
  if (rank === 'Q') return { name: 'Fairy Shrine', lore: 'Restores 8 HP and permanently boosts Max HP +4.' };
  if (rank === 'J') return { name: 'Warm Campfire', lore: 'Rest and cooking pit. Heals 6 HP, +3 Torch.' };
  return { name: `Health Draught (+${rank} HP)`, lore: 'Red bubbling restorative potion.' };
}

export function createStandardDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      const { name, lore } = getCardLore(suit, rank);
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        numericValue: getRankValue(rank),
        name,
        lore,
      });
    }
  }
  return deck;
}

export function shuffleDeck(cards: Card[]): Card[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export interface DungeonCampaign {
  draftCards: Card[];
  floors: Card[][]; // 5 floors of 9 cards
  merchantCards: Card[]; // 4 reserve cards
}

export function generateCampaign(): DungeonCampaign {
  const fullDeck = createStandardDeck();
  
  // Isolate Ace of Spades (Underlord Boss)
  const aceOfSpades = fullDeck.find(c => c.suit === 'spades' && c.rank === 'A')!;
  const restOfDeck = shuffleDeck(fullDeck.filter(c => c.id !== aceOfSpades.id));

  // 1. Character Draft: 3 cards
  const draftCards = restOfDeck.splice(0, 3);

  // 2. Floors 1 to 4: 9 cards each
  const floor1 = restOfDeck.splice(0, 9);
  const floor2 = restOfDeck.splice(0, 9);
  const floor3 = restOfDeck.splice(0, 9);
  const floor4 = restOfDeck.splice(0, 9);

  // 3. Floor 5: 8 cards + Ace of Spades
  const floor5Rest = restOfDeck.splice(0, 8);
  // Ensure Ace of Spades is placed at the final tile (2,2) or shuffled
  const floor5 = [...floor5Rest, aceOfSpades];

  // 4. Merchant reserve: remaining 4 cards
  const merchantCards = restOfDeck.splice(0, 4);

  return {
    draftCards,
    floors: [floor1, floor2, floor3, floor4, floor5],
    merchantCards,
  };
}

export function buildFloorGrid(floorCards: Card[], floorNum: number): Tile[][] {
  const grid: Tile[][] = [];
  let cardIdx = 0;

  for (let r = 0; r < 3; r++) {
    const row: Tile[] = [];
    for (let c = 0; c < 3; c++) {
      const isEntrance = r === 0 && c === 0;
      const isStairs = r === 2 && c === 2;
      
      let card: Card;
      if (floorNum % 5 === 0 && isStairs) {
        // Guarantee Boss is at Stairs in the final floor of every Cycle
        const boss = floorCards.find(card => card.suit === 'spades' && card.rank === 'A') || floorCards[cardIdx++];
        card = boss;
      } else {
        card = floorCards[cardIdx++];
      }

      row.push({
        r,
        c,
        card,
        isRevealed: isEntrance, // Entrance starts face-up
        isCleared: false,
        isStairs,
      });
    }
    grid.push(row);
  }

  return grid;
}
