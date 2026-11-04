import { describe, it, expect } from 'vitest';
import {
  evaluateLevelUp,
  calculateLegacyScore,
  isOrthogonallyAdjacent,
  calculateFloorTransitionHeal,
} from '../utils/rules';

describe('Progression, Scoring & Navigation Hardening', () => {
  describe('evaluateLevelUp Boundary Testing', () => {
    it('does not level up before 10 XP', () => {
      const res = evaluateLevelUp(9, 1);
      expect(res.hasLeveledUp).toBe(false);
      expect(res.lvl).toBe(1);
      expect(res.nextXp).toBe(10);
    });

    it('levels up to Level 2 at exactly 10 XP', () => {
      const res = evaluateLevelUp(10, 1);
      expect(res.hasLeveledUp).toBe(true);
      expect(res.lvl).toBe(2);
      expect(res.hpBoost).toBe(5);
      expect(res.atkBoost).toBe(1);
      expect(res.defBoost).toBe(0);
      expect(res.nextXp).toBe(25);
    });

    it('levels up to Level 3 at 25 XP', () => {
      const res = evaluateLevelUp(25, 2);
      expect(res.hasLeveledUp).toBe(true);
      expect(res.lvl).toBe(3);
      expect(res.hpBoost).toBe(5);
      expect(res.defBoost).toBe(1);
      expect(res.atkBoost).toBe(0);
      expect(res.nextXp).toBe(45);
    });

    it('levels up to max Level 4 at 45 XP', () => {
      const res = evaluateLevelUp(45, 3);
      expect(res.hasLeveledUp).toBe(true);
      expect(res.lvl).toBe(4);
      expect(res.atkBoost).toBe(1);
    });

    it('does not re-trigger level up once already at Level 4', () => {
      const res = evaluateLevelUp(100, 4);
      expect(res.hasLeveledUp).toBe(false);
      expect(res.lvl).toBe(4);
    });
  });

  describe('calculateLegacyScore Hardening', () => {
    it('calculates full victory score including clear bonus (+200)', () => {
      const score = calculateLegacyScore({
        isVictory: true,
        hp: 15,
        gold: 24,
        level: 3,
        weaponBonus: 3,
        floor: 5,
      });

      // (15 * 10) + (24 * 5) + (3 * 50) + (3 * 20) + 200 = 150 + 120 + 150 + 60 + 200 = 680
      expect(score).toBe(680);
    });

    it('calculates defeat score based on floor, level and gold', () => {
      const score = calculateLegacyScore({
        isVictory: false,
        hp: 0,
        gold: 10,
        level: 2,
        weaponBonus: 1,
        floor: 3,
      });

      // (10 * 3) + (2 * 25) + (3 * 30) = 30 + 50 + 90 = 170
      expect(score).toBe(170);
    });

    it('clamps negative values to zero preventing corrupted scores', () => {
      const score = calculateLegacyScore({
        isVictory: false,
        hp: -10,
        gold: -5,
        level: 0,
        weaponBonus: -2,
        floor: 0,
      });

      // Gold: 0*3 + Level: 1*25 + Floor: 1*30 = 55
      expect(score).toBe(55);
    });
  });

  describe('isOrthogonallyAdjacent Navigation Rule', () => {
    it('returns true for all direct orthogonal neighbors (dr + dc === 1)', () => {
      expect(isOrthogonallyAdjacent(1, 1, 0, 1)).toBe(true); // Up
      expect(isOrthogonallyAdjacent(1, 1, 2, 1)).toBe(true); // Down
      expect(isOrthogonallyAdjacent(1, 1, 1, 0)).toBe(true); // Left
      expect(isOrthogonallyAdjacent(1, 1, 1, 2)).toBe(true); // Right
    });

    it('returns false for diagonal movements', () => {
      expect(isOrthogonallyAdjacent(0, 0, 1, 1)).toBe(false);
      expect(isOrthogonallyAdjacent(1, 1, 2, 2)).toBe(false);
      expect(isOrthogonallyAdjacent(1, 1, 0, 2)).toBe(false);
    });

    it('returns false for current tile or distant tiles', () => {
      expect(isOrthogonallyAdjacent(1, 1, 1, 1)).toBe(false); // Same tile
      expect(isOrthogonallyAdjacent(0, 0, 2, 2)).toBe(false); // Far tile
    });
  });

  describe('calculateFloorTransitionHeal Field Dressing Rules (+10 HP)', () => {
    it('restores up to +10 HP when descending into a new floor', () => {
      const res = calculateFloorTransitionHeal(8, 20);
      expect(res.newHp).toBe(18);
      expect(res.healed).toBe(10);
    });

    it('clamps heal to maxHp when within 10 HP of maximum', () => {
      const res = calculateFloorTransitionHeal(17, 20);
      expect(res.newHp).toBe(20);
      expect(res.healed).toBe(3);
    });

    it('does not overheal or report positive heal if already at full HP', () => {
      const res = calculateFloorTransitionHeal(20, 20);
      expect(res.newHp).toBe(20);
      expect(res.healed).toBe(0);
    });

    it('safely heals +10 on higher maxHp values from level ups and blessings without full-clearing damage', () => {
      const res = calculateFloorTransitionHeal(12, 34);
      expect(res.newHp).toBe(22);
      expect(res.healed).toBe(10);
    });

    it('handles negative or zero HP boundary conditions safely', () => {
      const res = calculateFloorTransitionHeal(-5, 20);
      expect(res.newHp).toBe(10);
      expect(res.healed).toBe(10);
    });
  });
});
