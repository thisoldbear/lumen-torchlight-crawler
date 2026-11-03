import { describe, it, expect } from 'vitest';
import {
  createStandardDeck,
  getRankValue,
  generateCampaign,
  buildFloorGrid,
  SUITS,
  RANKS,
} from '../utils/deck';

describe('Deck Engine & Card Math (52-Card Solitaire Crawl)', () => {
  it('generates a standard 52-card deck with no duplicates', () => {
    const deck = createStandardDeck();
    expect(deck.length).toBe(52);

    const ids = new Set(deck.map((c) => c.id));
    expect(ids.size).toBe(52);

    // Verify 13 ranks and 13 cards per suit
    expect(RANKS.length).toBe(13);
    for (const suit of SUITS) {
      const suitCards = deck.filter((c) => c.suit === suit);
      expect(suitCards.length).toBe(13);
    }
  });

  it('correctly maps ranks to numeric encounter values', () => {
    expect(getRankValue(2)).toBe(2);
    expect(getRankValue(10)).toBe(10);
    expect(getRankValue('J')).toBe(11);
    expect(getRankValue('Q')).toBe(12);
    expect(getRankValue('K')).toBe(13);
    expect(getRankValue('A')).toBe(15);
  });

  it('partitions the entire 52-card deck with exact math', () => {
    const campaign = generateCampaign();

    // 1. Draft Cards: exactly 3
    expect(campaign.draftCards.length).toBe(3);

    // 2. Floors: exactly 5 floors of 9 cards each (3x3 grid)
    expect(campaign.floors.length).toBe(5);
    let totalFloorCards = 0;
    campaign.floors.forEach((floor) => {
      expect(floor.length).toBe(9);
      totalFloorCards += floor.length;
    });
    expect(totalFloorCards).toBe(45);

    // 3. Merchant Reserve: exactly 4 cards
    expect(campaign.merchantCards.length).toBe(4);

    // 4. Exact 52-card validation
    const allUsedCardIds = [
      ...campaign.draftCards.map((c) => c.id),
      ...campaign.floors.flat().map((c) => c.id),
      ...campaign.merchantCards.map((c) => c.id),
    ];
    expect(allUsedCardIds.length).toBe(52);
    expect(new Set(allUsedCardIds).size).toBe(52);

    // 5. Boss presence: Floor 5 must contain Ace of Spades
    const floor5SpadeAce = campaign.floors[4].find(
      (c) => c.suit === 'spades' && c.rank === 'A'
    );
    expect(floor5SpadeAce).toBeDefined();
  });

  it('builds a 3x3 floor grid with correct entrance and stairs coordinates', () => {
    const campaign = generateCampaign();
    const grid = buildFloorGrid(campaign.floors[0], 1);

    expect(grid.length).toBe(3);
    expect(grid[0].length).toBe(3);
    expect(grid[1].length).toBe(3);
    expect(grid[2].length).toBe(3);

    // Entrance at (0, 0) starts revealed
    expect(grid[0][0].isRevealed).toBe(true);
    expect(grid[0][0].isStairs).toBe(false);

    // Stairs at (2, 2)
    expect(grid[2][2].isStairs).toBe(true);

    // Other tiles start unrevealed
    expect(grid[0][1].isRevealed).toBe(false);
    expect(grid[1][1].isRevealed).toBe(false);
  });
});
