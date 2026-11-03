import { describe, it, expect } from 'vitest';
import {
  calculateHeroAttack,
  calculateMitigatedDamage,
  calculateTrapDamage,
  calculateXpGain,
} from '../utils/rules';

describe('Combat Engine Hardening & Math Boundaries', () => {
  describe('calculateHeroAttack', () => {
    it('calculates hero attack power with equipped weapons', () => {
      expect(calculateHeroAttack(2, 0)).toBe(2); // Fists
      expect(calculateHeroAttack(2, 3)).toBe(5); // Iron Blade
      expect(calculateHeroAttack(4, 4)).toBe(8); // Lvl 4 with Wyrm Blade
    });

    it('enforces minimum attack of 1 even under negative or zero inputs', () => {
      expect(calculateHeroAttack(0, 0)).toBe(1);
      expect(calculateHeroAttack(-5, 2)).toBe(1);
      expect(calculateHeroAttack(1, -10)).toBe(1);
    });
  });

  describe('calculateMitigatedDamage', () => {
    it('mitigates incoming damage with armor correctly', () => {
      expect(calculateMitigatedDamage(7, 2)).toBe(5);
      expect(calculateMitigatedDamage(12, 3)).toBe(9);
    });

    it('enforces minimum 1 damage rule when defense exceeds incoming attack', () => {
      expect(calculateMitigatedDamage(2, 3)).toBe(1);
      expect(calculateMitigatedDamage(1, 99)).toBe(1);
      expect(calculateMitigatedDamage(5, 5)).toBe(1);
    });

    it('handles negative defense safely without inflating damage', () => {
      expect(calculateMitigatedDamage(6, -2)).toBe(6);
      expect(calculateMitigatedDamage(10, 0)).toBe(10);
    });
  });

  describe('calculateTrapDamage', () => {
    it('calculates trap damage as floor(rank / 2) - defense', () => {
      // Rank 2: floor(2 / 2) = 1, def 0 -> 1
      expect(calculateTrapDamage(2, 0)).toBe(1);
      // Rank 7: floor(7 / 2) = 3, def 1 -> 2
      expect(calculateTrapDamage(7, 1)).toBe(2);
      // Rank 10: floor(10 / 2) = 5, def 2 -> 3
      expect(calculateTrapDamage(10, 2)).toBe(3);
    });

    it('always deals at least 1 damage on trap triggers', () => {
      expect(calculateTrapDamage(2, 5)).toBe(1);
      expect(calculateTrapDamage(5, 10)).toBe(1);
    });
  });

  describe('calculateXpGain', () => {
    it('correctly awards XP based on ceil(numericValue / 2)', () => {
      expect(calculateXpGain(2)).toBe(1);
      expect(calculateXpGain(7)).toBe(4);
      expect(calculateXpGain(10)).toBe(5);
      expect(calculateXpGain(11)).toBe(6);
      expect(calculateXpGain(15)).toBe(8); // Underlord Boss
    });

    it('guarantees at least 1 XP even for low or degenerate values', () => {
      expect(calculateXpGain(1)).toBe(1);
      expect(calculateXpGain(0)).toBe(1);
    });
  });
});
