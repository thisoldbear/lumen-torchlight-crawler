// Pure Game Engine Rules & Formulas (Single Source of Truth)

import { PlayerState } from '../types';

export function calculateHeroAttack(baseAtk: number, weaponBonus: number = 0): number {
  return Math.max(1, baseAtk + weaponBonus);
}

export function calculateMonsterAttack(cardNumericValue: number, isPitchBlack: boolean = false): number {
  const baseAtk = Math.max(1, Math.ceil(cardNumericValue / 2));
  return baseAtk + (isPitchBlack ? 1 : 0);
}

export function calculateMitigatedDamage(incomingAtk: number, defense: number = 0): number {
  return Math.max(1, incomingAtk - Math.max(0, defense));
}

export function calculateTrapDamage(cardValue: number, defense: number = 0): number {
  return Math.max(1, Math.floor(cardValue / 2) - Math.max(0, defense));
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
  let nextXp = currentLvl === 1 ? 10 : currentLvl === 2 ? 25 : 45;
  let hpBoost = 0;
  let atkBoost = 0;
  let defBoost = 0;
  let hasLeveledUp = false;

  if (lvl === 1 && currentXp >= 10) {
    lvl = 2;
    hpBoost = 5;
    atkBoost = 1;
    nextXp = 25;
    hasLeveledUp = true;
  } else if (lvl === 2 && currentXp >= 25) {
    lvl = 3;
    hpBoost = 5;
    defBoost = 1;
    nextXp = 45;
    hasLeveledUp = true;
  } else if (lvl === 3 && currentXp >= 45) {
    lvl = 4;
    atkBoost = 1;
    nextXp = 999;
    hasLeveledUp = true;
  }

  return { lvl, nextXp, hpBoost, atkBoost, defBoost, hasLeveledUp };
}

export function calculateLegacyScore(params: {
  isVictory: boolean;
  hp: number;
  gold: number;
  level: number;
  weaponBonus: number;
  floor: number;
}): number {
  const safeHp = Math.max(0, params.hp);
  const safeGold = Math.max(0, params.gold);
  const safeLevel = Math.max(1, params.level);
  const safeWeapon = Math.max(0, params.weaponBonus);
  const safeFloor = Math.max(1, params.floor);

  if (params.isVictory) {
    return (
      safeHp * 10 +
      safeGold * 5 +
      safeLevel * 50 +
      safeWeapon * 20 +
      200
    );
  }
  return safeGold * 3 + safeLevel * 25 + safeFloor * 30;
}

export function isOrthogonallyAdjacent(r1: number, c1: number, r2: number, c2: number): boolean {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

export interface FloorHealResult {
  newHp: number;
  healed: number;
}

export function calculateFloorTransitionHeal(currentHp: number, maxHp: number): FloorHealResult {
  const safeHp = Math.max(0, currentHp);
  const safeMax = Math.max(0, maxHp);
  return {
    newHp: safeMax,
    healed: Math.max(0, safeMax - safeHp),
  };
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

