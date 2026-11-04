// Pure Game Engine Rules & Formulas (Single Source of Truth)

import { PlayerState } from '../types';

export function calculateHeroAttack(baseAtk: number, weaponBonus: number = 0): number {
  return Math.max(1, baseAtk + weaponBonus);
}

export function calculateMonsterHp(cardNumericValue: number, cycle: number = 1): number {
  const cycleBonus = Math.max(0, cycle - 1) * 5;
  return Math.max(1, cardNumericValue + cycleBonus);
}

export function calculateMonsterAttack(
  cardNumericValue: number,
  isPitchBlack: boolean = false,
  cycle: number = 1
): number {
  const cycleBonus = Math.max(0, cycle - 1) * 2;
  const baseAtk = Math.max(1, Math.ceil(cardNumericValue / 2) + cycleBonus);
  return baseAtk + (isPitchBlack ? cycle : 0);
}

export function calculateMitigatedDamage(incomingAtk: number, defense: number = 0): number {
  return Math.max(1, incomingAtk - Math.max(0, defense));
}

export function calculateTrapDamage(
  cardValue: number,
  defense: number = 0,
  cycle: number = 1
): number {
  const cycleBonus = Math.max(0, cycle - 1);
  const baseTrap = Math.floor(cardValue / 2) + cycleBonus;
  return Math.max(1, baseTrap - Math.max(0, defense));
}

export function calculateXpGain(cardNumericValue: number): number {
  return Math.max(1, Math.ceil(cardNumericValue / 2));
}

export interface LevelUpResult {
  lvl: number;
  nextXp: number;
  hpBoost: number;
  atkBoost: number;
  defBoost: number;
  hasLeveledUp: boolean;
}

export function evaluateLevelUp(currentXp: number, currentLvl: number): LevelUpResult {
  let lvl = currentLvl;
  let nextXp = currentLvl === 1 ? 8 : currentLvl === 2 ? 18 : 30;
  let hpBoost = 0;
  let atkBoost = 0;
  let defBoost = 0;
  let hasLeveledUp = false;

  if (lvl === 1 && currentXp >= 8) {
    lvl = 2;
    hpBoost = 5;
    atkBoost = 1;
    nextXp = 18;
    hasLeveledUp = true;
  } else if (lvl === 2 && currentXp >= 18) {
    lvl = 3;
    hpBoost = 5;
    defBoost = 1;
    nextXp = 30;
    hasLeveledUp = true;
  } else if (lvl === 3 && currentXp >= 30) {
    lvl = 4;
    atkBoost = 1;
    nextXp = 999;
    hasLeveledUp = true;
  }

  return { lvl, nextXp, hpBoost, atkBoost, defBoost, hasLeveledUp };
}

export interface LegacyScoreParams {
  isVictory: boolean;
  hp: number;
  gold: number;
  level: number;
  weaponBonus: number;
  floor: number;
  completedCycles?: number;
}

export function calculateLegacyScore(params: LegacyScoreParams): number {
  const safeHp = Math.max(0, params.hp);
  const safeGold = Math.max(0, params.gold);
  const safeLevel = Math.max(1, params.level);
  const safeWeapon = Math.max(0, params.weaponBonus);
  const safeFloor = Math.max(1, params.floor);
  const completedCycles = Math.max(0, params.completedCycles ?? (params.isVictory ? 1 : 0));

  if (params.isVictory) {
    const cycleBonus = Math.max(0, completedCycles - 1) * 500;
    const baseVictory = (
      safeHp * 10 +
      safeGold * 5 +
      safeLevel * 50 +
      safeWeapon * 20 +
      200 +
      cycleBonus
    );
    const multiplier = 1 + Math.max(0, completedCycles - 1) * 0.5;
    return Math.round(baseVictory * multiplier);
  }

  const baseDefeat = safeGold * 3 + safeLevel * 25 + safeFloor * 30;
  return baseDefeat + completedCycles * 400;
}

export function isOrthogonallyAdjacent(r1: number, c1: number, r2: number, c2: number): boolean {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

export interface FloorHealResult {
  newHp: number;
  healed: number;
}

export function calculateFloorTransitionHeal(
  currentHp: number,
  maxHp: number,
  healAmount: number = 10
): FloorHealResult {
  const safeHp = Math.max(0, currentHp);
  const safeMax = Math.max(0, maxHp);
  const newHp = Math.min(safeMax, safeHp + Math.max(0, healAmount));
  return {
    newHp,
    healed: newHp - safeHp,
  };
}

// The Underlord (Floor 5 Ace of Spades) Boss Configuration & Mechanics
export interface UnderlordBossConfig {
  phase1Hp: number;
  phase1Atk: number;
  phase2Hp: number;
  phase2Atk: number;
  phaseTransitionDmg: number;
  minPierceDmg: number;
}

export const UNDERLORD_BOSS_CONFIG: UnderlordBossConfig = {
  phase1Hp: 20,
  phase1Atk: 8,
  phase2Hp: 20,
  phase2Atk: 10,
  phaseTransitionDmg: 3,
  minPierceDmg: 3,
};

export function isUnderlordBoss(cardSuit: string, cardRank: string | number): boolean {
  return cardSuit === 'spades' && cardRank === 'A';
}

export function getUnderlordStatsForCycle(cycle: number = 1): UnderlordBossConfig {
  const c = Math.max(1, cycle);
  const cycleMultiplier = c - 1;
  return {
    phase1Hp: UNDERLORD_BOSS_CONFIG.phase1Hp + cycleMultiplier * 10,
    phase1Atk: UNDERLORD_BOSS_CONFIG.phase1Atk + cycleMultiplier * 2,
    phase2Hp: UNDERLORD_BOSS_CONFIG.phase2Hp + cycleMultiplier * 10,
    phase2Atk: UNDERLORD_BOSS_CONFIG.phase2Atk + cycleMultiplier * 2,
    phaseTransitionDmg: UNDERLORD_BOSS_CONFIG.phaseTransitionDmg + cycleMultiplier,
    minPierceDmg: UNDERLORD_BOSS_CONFIG.minPierceDmg + cycleMultiplier,
  };
}

export function calculateUnderlordDamage(
  phase: 1 | 2,
  incomingAtk: number,
  defense: number = 0,
  cycle: number = 1
): number {
  if (phase === 2) {
    const stats = getUnderlordStatsForCycle(cycle);
    // Crushing Ruin: Attacks bypass armor with scaled minimum unmitigated damage
    return Math.max(stats.minPierceDmg, incomingAtk - Math.max(0, defense));
  }
  return calculateMitigatedDamage(incomingAtk, defense);
}

export function canCastTorchFlare(params: {
  level: number;
  torch: number;
  hasUsedInCombat?: boolean;
  bossPhase?: 1 | 2;
}): { canCast: boolean; reason?: string } {
  if (params.level < 4) {
    return { canCast: false, reason: 'REQUIRES LVL 4' };
  }
  if (params.torch < 2) {
    return { canCast: false, reason: 'NEED 2 TORCH' };
  }
  if (params.hasUsedInCombat) {
    return { canCast: false, reason: '1X PER BATTLE' };
  }
  if (params.bossPhase === 1) {
    return { canCast: false, reason: 'VOID SHIELDED' };
  }
  return { canCast: true };
}

// Wandering Merchant Catalog & Cart Logic
export type MerchantItemId = 'torch' | 'potion' | 'weapon' | 'armor' | 'revive';

export interface MerchantItemConfig {
  id: MerchantItemId;
  name: string;
  detail: string;
  cost: number;
}

export const MERCHANT_ITEMS: readonly MerchantItemConfig[] = [
  { id: 'torch', name: 'Torch Tinder', detail: '+3 Torch', cost: 4 },
  { id: 'potion', name: 'Healing Potion', detail: '+1 Pack', cost: 6 },
  { id: 'armor', name: 'Knight Armor', detail: '+2 DEF', cost: 10 },
  { id: 'weapon', name: 'Runic Blade', detail: '+3 ATK', cost: 12 },
  { id: 'revive', name: 'Phoenix Amulet', detail: '1x Revive', cost: 18 },
] as const;

export function getMerchantItemById(id: MerchantItemId): MerchantItemConfig | undefined {
  return MERCHANT_ITEMS.find((item) => item.id === id);
}

export function calculateMerchantTotalCost(itemIds: MerchantItemId[]): number {
  return itemIds.reduce((sum, id) => {
    const item = getMerchantItemById(id);
    return sum + (item ? item.cost : 0);
  }, 0);
}

export function isMerchantItemEligible(
  item: MerchantItemConfig,
  player: PlayerState
): { eligible: boolean; reason?: string } {
  if (item.id === 'torch' && player.torch >= player.maxTorch) {
    return { eligible: false, reason: 'MAX TORCH' };
  }
  if (item.id === 'potion' && player.potions >= 2) {
    return { eligible: false, reason: 'PACK FULL' };
  }
  if (item.id === 'armor' && player.armor && player.armor.bonus >= 2) {
    return { eligible: false, reason: 'OWNED' };
  }
  if (item.id === 'weapon' && player.weapon && player.weapon.bonus >= 3) {
    return { eligible: false, reason: 'OWNED' };
  }
  if (item.id === 'revive' && player.hasRevive) {
    return { eligible: false, reason: 'ACTIVE' };
  }
  return { eligible: true };
}

export function applyMerchantPurchases(
  player: PlayerState,
  itemIds: MerchantItemId[]
): {
  updatedPlayer: PlayerState;
  totalCost: number;
  itemNames: string[];
} {
  const totalCost = calculateMerchantTotalCost(itemIds);
  if (totalCost > player.gold) {
    return { updatedPlayer: player, totalCost: 0, itemNames: [] };
  }

  const updatedPlayer = { ...player, gold: player.gold - totalCost };
  const itemNames: string[] = [];

  for (const id of itemIds) {
    const config = getMerchantItemById(id);
    if (config) {
      itemNames.push(config.name);
    }
    if (id === 'torch') {
      updatedPlayer.torch = Math.min(updatedPlayer.maxTorch, updatedPlayer.torch + 3);
    } else if (id === 'potion') {
      updatedPlayer.potions = Math.min(2, updatedPlayer.potions + 1);
    } else if (id === 'armor') {
      updatedPlayer.armor = { name: 'Knight Armor', bonus: 2, type: 'armor' };
    } else if (id === 'weapon') {
      updatedPlayer.weapon = { name: 'Runic Blade', bonus: 3, type: 'weapon' };
    } else if (id === 'revive') {
      updatedPlayer.hasRevive = true;
    }
  }

  return { updatedPlayer, totalCost, itemNames };
}

export interface FleeOutcome {
  canFlee: boolean;
  newTorch: number;
  newHp: number;
  isFatal: boolean;
}

export function calculateFleeOutcome(torch: number, hp: number): FleeOutcome {
  if (torch < 1) {
    return { canFlee: false, newTorch: torch, newHp: hp, isFatal: false };
  }
  const newTorch = torch - 1;
  const newHp = hp - 2;
  return {
    canFlee: true,
    newTorch,
    newHp: Math.max(0, newHp),
    isFatal: newHp <= 0,
  };
}

