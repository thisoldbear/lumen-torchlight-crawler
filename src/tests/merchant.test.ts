import { describe, it, expect } from 'vitest';
import { PlayerState } from '../types';
import {
  MERCHANT_ITEMS,
  calculateMerchantTotalCost,
  isMerchantItemEligible,
  applyMerchantPurchases,
  getMerchantItemById,
} from '../utils/rules';

const createTestPlayer = (overrides?: Partial<PlayerState>): PlayerState => ({
  hp: 20,
  maxHp: 20,
  torch: 6,
  maxTorch: 8,
  gold: 30,
  xp: 0,
  nextLevelXp: 10,
  level: 1,
  baseAtk: 3,
  baseDef: 0,
  weapon: null,
  armor: null,
  potions: 1,
  hasRevive: false,
  position: { r: 0, c: 0 },
  ...overrides,
});

describe('Wandering Merchant Rules & Cart Mechanics', () => {
  describe('Catalog & Price List Invariants', () => {
    it('defines exactly the 5 canonical merchant items with correct costs', () => {
      expect(MERCHANT_ITEMS.length).toBe(5);
      expect(getMerchantItemById('torch')?.cost).toBe(4);
      expect(getMerchantItemById('potion')?.cost).toBe(6);
      expect(getMerchantItemById('armor')?.cost).toBe(10);
      expect(getMerchantItemById('weapon')?.cost).toBe(12);
      expect(getMerchantItemById('revive')?.cost).toBe(18);
    });
  });

  describe('calculateMerchantTotalCost', () => {
    it('returns 0 for empty selection', () => {
      expect(calculateMerchantTotalCost([])).toBe(0);
    });

    it('calculates individual and multi-item cart costs correctly', () => {
      expect(calculateMerchantTotalCost(['torch'])).toBe(4);
      expect(calculateMerchantTotalCost(['torch', 'potion'])).toBe(10);
      expect(calculateMerchantTotalCost(['torch', 'potion', 'armor'])).toBe(20);
      expect(calculateMerchantTotalCost(['weapon', 'revive'])).toBe(30);
    });
  });

  describe('isMerchantItemEligible Eligibility Rules', () => {
    it('disallows torch when torch is already at or above maxTorch', () => {
      const torchItem = getMerchantItemById('torch')!;
      const fullTorchPlayer = createTestPlayer({ torch: 8, maxTorch: 8 });
      const eligiblePlayer = createTestPlayer({ torch: 5, maxTorch: 8 });

      expect(isMerchantItemEligible(torchItem, fullTorchPlayer).eligible).toBe(false);
      expect(isMerchantItemEligible(torchItem, eligiblePlayer).eligible).toBe(true);
    });

    it('disallows potions when player already holds max (2) potions', () => {
      const potionItem = getMerchantItemById('potion')!;
      const fullPotionsPlayer = createTestPlayer({ potions: 2 });
      const eligiblePlayer = createTestPlayer({ potions: 1 });

      expect(isMerchantItemEligible(potionItem, fullPotionsPlayer).eligible).toBe(false);
      expect(isMerchantItemEligible(potionItem, eligiblePlayer).eligible).toBe(true);
    });

    it('disallows armor if player already has Knight Armor or Aegis Shield (+2 or +3 DEF)', () => {
      const armorItem = getMerchantItemById('armor')!;
      const knightArmorPlayer = createTestPlayer({ armor: { name: 'Knight Armor', bonus: 2, type: 'armor' } });
      const aegisShieldPlayer = createTestPlayer({ armor: { name: 'Aegis Shield', bonus: 3, type: 'armor' } });
      const noArmorPlayer = createTestPlayer({ armor: null });

      expect(isMerchantItemEligible(armorItem, knightArmorPlayer).eligible).toBe(false);
      expect(isMerchantItemEligible(armorItem, aegisShieldPlayer).eligible).toBe(false);
      expect(isMerchantItemEligible(armorItem, noArmorPlayer).eligible).toBe(true);
    });

    it('disallows weapon if player already has Runic Blade or Dragon Wyrm Blade (+3 or +4 ATK)', () => {
      const weaponItem = getMerchantItemById('weapon')!;
      const runicBladePlayer = createTestPlayer({ weapon: { name: 'Runic Blade', bonus: 3, type: 'weapon' } });
      const boneDaggerPlayer = createTestPlayer({ weapon: { name: 'Bone Dagger', bonus: 1, type: 'weapon' } });

      expect(isMerchantItemEligible(weaponItem, runicBladePlayer).eligible).toBe(false);
      expect(isMerchantItemEligible(weaponItem, boneDaggerPlayer).eligible).toBe(true);
    });

    it('disallows revive amulet if player already has an active revive ward', () => {
      const reviveItem = getMerchantItemById('revive')!;
      const hasRevivePlayer = createTestPlayer({ hasRevive: true });
      const noRevivePlayer = createTestPlayer({ hasRevive: false });

      expect(isMerchantItemEligible(reviveItem, hasRevivePlayer).eligible).toBe(false);
      expect(isMerchantItemEligible(reviveItem, noRevivePlayer).eligible).toBe(true);
    });
  });

  describe('applyMerchantPurchases Transaction & State Lock-in', () => {
    it('aborts transaction if total cost exceeds available gold', () => {
      const player = createTestPlayer({ gold: 10 });
      const result = applyMerchantPurchases(player, ['weapon']); // costs 12
      expect(result.totalCost).toBe(0);
      expect(result.updatedPlayer.gold).toBe(10);
      expect(result.updatedPlayer.weapon).toBeNull();
      expect(result.itemNames.length).toBe(0);
    });

    it('applies multiple purchases atomically upon continuing expedition', () => {
      const player = createTestPlayer({
        gold: 30,
        torch: 4,
        maxTorch: 8,
        potions: 0,
        weapon: null,
      });

      const result = applyMerchantPurchases(player, ['torch', 'potion', 'weapon']);
      // 4 + 6 + 12 = 22 Gold
      expect(result.totalCost).toBe(22);
      expect(result.updatedPlayer.gold).toBe(8);
      expect(result.updatedPlayer.torch).toBe(7); // 4 + 3
      expect(result.updatedPlayer.potions).toBe(1); // 0 + 1
      expect(result.updatedPlayer.weapon?.name).toBe('Runic Blade');
      expect(result.updatedPlayer.weapon?.bonus).toBe(3);
      expect(result.itemNames).toEqual(['Torch Tinder', 'Healing Potion', 'Runic Blade']);
    });

    it('clamps torch restoration to maxTorch', () => {
      const player = createTestPlayer({ gold: 10, torch: 7, maxTorch: 8 });
      const result = applyMerchantPurchases(player, ['torch']);
      expect(result.updatedPlayer.torch).toBe(8);
    });

    it('clamps potion count to max 2', () => {
      const player = createTestPlayer({ gold: 10, potions: 1 });
      const result = applyMerchantPurchases(player, ['potion']);
      expect(result.updatedPlayer.potions).toBe(2);
    });

    it('grants revive ward when Phoenix Amulet is locked in', () => {
      const player = createTestPlayer({ gold: 20, hasRevive: false });
      const result = applyMerchantPurchases(player, ['revive']);
      expect(result.totalCost).toBe(18);
      expect(result.updatedPlayer.gold).toBe(2);
      expect(result.updatedPlayer.hasRevive).toBe(true);
    });
  });
});
