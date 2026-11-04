import { describe, it, expect } from 'vitest';
import {
  calculateHeroAttack,
  calculateMonsterAttack,
  calculateMitigatedDamage,
  calculateTrapDamage,
  calculateXpGain,
  UNDERLORD_BOSS_CONFIG,
  isUnderlordBoss,
  calculateUnderlordDamage,
  canCastTorchFlare,
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

  describe('calculateMonsterAttack', () => {
    it('scales monster attack power to ceil(numericValue / 2)', () => {
      expect(calculateMonsterAttack(2)).toBe(1); // Rank 2
      expect(calculateMonsterAttack(3)).toBe(2); // Rank 3
      expect(calculateMonsterAttack(7)).toBe(4); // Rank 7
      expect(calculateMonsterAttack(10)).toBe(5); // Rank 10
      expect(calculateMonsterAttack(11)).toBe(6); // Jack
      expect(calculateMonsterAttack(12)).toBe(6); // Queen
      expect(calculateMonsterAttack(13)).toBe(7); // King
      expect(calculateMonsterAttack(15)).toBe(8); // Underlord Ace
    });

    it('adds +1 bonus attack when the dungeon is in pitch black (torch = 0)', () => {
      expect(calculateMonsterAttack(2, true)).toBe(2);
      expect(calculateMonsterAttack(7, true)).toBe(5);
      expect(calculateMonsterAttack(15, true)).toBe(9);
    });

    it('guarantees minimum attack of 1 for edge or negative values', () => {
      expect(calculateMonsterAttack(0)).toBe(1);
      expect(calculateMonsterAttack(-4)).toBe(1);
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

  describe('The Underlord (Ace of Spades Boss) Rebalance', () => {
    it('identifies Ace of Spades as the Underlord Boss', () => {
      expect(isUnderlordBoss('spades', 'A')).toBe(true);
      expect(isUnderlordBoss('spades', 'K')).toBe(false);
      expect(isUnderlordBoss('hearts', 'A')).toBe(false);
    });

    it('defines canonical Two-Phase Underlord stats', () => {
      expect(UNDERLORD_BOSS_CONFIG.phase1Hp).toBe(20);
      expect(UNDERLORD_BOSS_CONFIG.phase1Atk).toBe(8);
      expect(UNDERLORD_BOSS_CONFIG.phase2Hp).toBe(20);
      expect(UNDERLORD_BOSS_CONFIG.phase2Atk).toBe(10);
      expect(UNDERLORD_BOSS_CONFIG.phaseTransitionDmg).toBe(3);
      expect(UNDERLORD_BOSS_CONFIG.minPierceDmg).toBe(3);
    });

    it('calculates Phase 1 mitigated damage normally with armor', () => {
      // 8 ATK vs 3 DEF = 5 DMG
      expect(calculateUnderlordDamage(1, 8, 3)).toBe(5);
      // 8 ATK vs 10 DEF = 1 DMG minimum
      expect(calculateUnderlordDamage(1, 8, 10)).toBe(1);
    });

    it('enforces Crushing Ruin (minimum 3 pierce damage) in Phase 2', () => {
      // 10 ATK vs 4 DEF = 6 DMG
      expect(calculateUnderlordDamage(2, 10, 4)).toBe(6);
      // 10 ATK vs 8 DEF = max(3, 10 - 8) = 3 DMG
      expect(calculateUnderlordDamage(2, 10, 8)).toBe(3);
      // 10 ATK vs 99 DEF = max(3, 10 - 99) = 3 DMG
      expect(calculateUnderlordDamage(2, 10, 99)).toBe(3);
    });
  });

  describe('canCastTorchFlare Tactical Restrictions', () => {
    it('disallows casting before Level 4', () => {
      const res = canCastTorchFlare({ level: 3, torch: 4 });
      expect(res.canCast).toBe(false);
      expect(res.reason).toBe('REQUIRES LVL 4');
    });

    it('disallows casting with fewer than 2 torch fuel', () => {
      const res = canCastTorchFlare({ level: 4, torch: 1 });
      expect(res.canCast).toBe(false);
      expect(res.reason).toBe('NEED 2 TORCH');
    });

    it('enforces 1 cast per combat encounter limit', () => {
      const res = canCastTorchFlare({ level: 4, torch: 4, hasUsedInCombat: true });
      expect(res.canCast).toBe(false);
      expect(res.reason).toBe('1X PER BATTLE');
    });

    it('disallows casting against Underlord Phase 1 (Void Shielded)', () => {
      const res = canCastTorchFlare({ level: 4, torch: 4, bossPhase: 1 });
      expect(res.canCast).toBe(false);
      expect(res.reason).toBe('VOID SHIELDED');
    });

    it('permits casting against regular foes or Underlord Phase 2 once per combat', () => {
      const regularRes = canCastTorchFlare({ level: 4, torch: 4, hasUsedInCombat: false });
      expect(regularRes.canCast).toBe(true);

      const bossP2Res = canCastTorchFlare({ level: 4, torch: 4, hasUsedInCombat: false, bossPhase: 2 });
      expect(bossP2Res.canCast).toBe(true);
    });
  });
});
