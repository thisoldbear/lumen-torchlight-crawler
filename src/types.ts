export type Suit = 'spades' | 'clubs' | 'diamonds' | 'hearts';
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  numericValue: number;
  name: string;
  lore: string;
}

export interface Tile {
  r: number;
  c: number;
  card: Card;
  isRevealed: boolean;
  isCleared: boolean;
  isStairs: boolean;
}

export interface Equipment {
  name: string;
  bonus: number;
  type: 'weapon' | 'armor';
}

export interface PlayerState {
  hp: number;
  maxHp: number;
  torch: number;
  maxTorch: number;
  gold: number;
  xp: number;
  nextLevelXp: number;
  level: number;
  baseAtk: number;
  baseDef: number;
  weapon: Equipment | null;
  armor: Equipment | null;
  potions: number; // Consumable count (max 2)
  hasRevive: boolean;
  position: { r: number; c: number };
  cycle: number; // Current Abyssal Cycle (1 = Base, 2 = Floors 6-10, etc.)
}

export interface CombatState {
  monsterCard: Card;
  monsterHp: number;
  monsterMaxHp: number;
  monsterAtk: number;
  isAmbush: boolean;
  bossPhase?: 1 | 2;
  hasUsedTorchFlare?: boolean;
  cycle?: number;
  previousPosition: { r: number; c: number };
}

export type GameStage = 
  | 'DRAFT' 
  | 'EXPLORING' 
  | 'COMBAT' 
  | 'MERCHANT' 
  | 'GAME_OVER' 
  | 'VICTORY';

export interface LogMessage {
  id: string;
  text: string;
  type: 'neutral' | 'combat' | 'danger' | 'gain' | 'heal';
  timestamp: string;
}
