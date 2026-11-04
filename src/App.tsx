import React, { useState } from 'react';
import { Card, CombatState, GameStage, LogMessage, PlayerState, Tile } from './types';
import { buildFloorGrid, generateCampaign } from './utils/deck';
import {
  calculateHeroAttack,
  calculateMonsterAttack,
  calculateMitigatedDamage,
  calculateTrapDamage,
  calculateXpGain,
  evaluateLevelUp,
  calculateFloorTransitionHeal,
  MerchantItemId,
  applyMerchantPurchases,
  isUnderlordBoss,
  UNDERLORD_BOSS_CONFIG,
  calculateUnderlordDamage,
  canCastTorchFlare,
} from './utils/rules';
import { HUD } from './components/HUD';
import { DungeonGrid } from './components/DungeonGrid';
import { CombatModal } from './components/CombatModal';
import { DraftModal } from './components/DraftModal';
import { MerchantModal } from './components/MerchantModal';
import { GameOverModal } from './components/GameOverModal';
import { LogView } from './components/LogView';
import packageInfo from '../package.json';

export const App: React.FC = () => {
  const [campaign, setCampaign] = useState(() => generateCampaign());
  const [floorNum, setFloorNum] = useState<number>(1);
  const [grid, setGrid] = useState<Tile[][]>(() => buildFloorGrid(campaign.floors[0], 1));
  const [stage, setStage] = useState<GameStage>('DRAFT');

  const [player, setPlayer] = useState<PlayerState>({
    hp: 20,
    maxHp: 20,
    torch: 6,
    maxTorch: 8,
    gold: 0,
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
  });

  const [combat, setCombat] = useState<CombatState | null>(null);
  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: 'init-1',
      text: 'You ignite your torch at the crypt gates. Select a starting boon...',
      type: 'neutral',
      timestamp: '00:00',
    },
  ]);

  const addLog = (text: string, type: LogMessage['type'] = 'neutral') => {
    const timestamp = new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [...prev, { id: Math.random().toString(36).substring(7), text, type, timestamp }]);
  };

  // Draft Selection
  const handleSelectDraft = (card: Card) => {
    let newGold = player.gold;
    let newTorch = player.torch;
    let newWeapon = player.weapon;
    let newPotions = player.potions;

    if (card.suit === 'diamonds') {
      if (typeof card.rank === 'number') {
        newGold += card.numericValue;
        addLog(`Drafted ${card.name}: Pocketed +${card.numericValue} starting Gold!`, 'gain');
      } else {
        newWeapon = { name: 'Rusty Shortsword', bonus: 1, type: 'weapon' };
        addLog(`Drafted ${card.name}: Equipped Rusty Shortsword (+1 ATK)!`, 'gain');
      }
    } else if (card.suit === 'hearts') {
      newPotions = Math.min(2, newPotions + 1);
      addLog(`Drafted ${card.name}: Packed an extra Healing Potion!`, 'heal');
    } else if (card.suit === 'clubs') {
      newTorch = Math.min(player.maxTorch, newTorch + 2);
      addLog(`Drafted ${card.name}: Salvaged pitch & wood for +2 Torch!`, 'gain');
    } else {
      newWeapon = { name: 'Bone Dagger', bonus: 1, type: 'weapon' };
      addLog(`Drafted ${card.name}: Fashioned a Bone Dagger (+1 ATK)!`, 'gain');
    }

    setPlayer((p) => ({
      ...p,
      gold: newGold,
      torch: newTorch,
      weapon: newWeapon,
      potions: newPotions,
    }));

    setStage('EXPLORING');
    addLog(`Descending into Floor 1: The Sunken Crypts...`, 'neutral');
  };

  // Scout Tile
  const handleScoutTile = (r: number, c: number) => {
    if (player.torch <= 0) {
      addLog('No torch fuel left! You must step in blindly.', 'danger');
      return;
    }

    setPlayer((p) => ({ ...p, torch: p.torch - 1 }));

    setGrid((prevGrid) => {
      const next = prevGrid.map((row) => row.map((tile) => ({ ...tile })));
      next[r][c].isRevealed = true;
      return next;
    });

    const card = grid[r][c].card;
    addLog(`Scouted Room (${r + 1}, ${c + 1}): Revealed ${card.name}!`, 'neutral');
  };

  // Enter Tile
  const handleEnterTile = (r: number, c: number, blind: boolean) => {
    // Reveal tile & update player pos
    setGrid((prevGrid) => {
      const next = prevGrid.map((row) => row.map((tile) => ({ ...tile })));
      next[r][c].isRevealed = true;
      return next;
    });

    setPlayer((p) => ({ ...p, position: { r, c } }));

    const tile = grid[r][c];
    if (tile.isCleared) {
      addLog(`Traversed already-cleared room (${r + 1}, ${c + 1}).`, 'neutral');
      return;
    }

    const card = tile.card;

    // Encounter Resolution based on Suit
    if (card.suit === 'spades') {
      // Monster / Boss Encounter
      const isBoss = floorNum === 5 && isUnderlordBoss(card.suit, card.rank);
      const monsterHp = isBoss ? UNDERLORD_BOSS_CONFIG.phase1Hp : card.numericValue;
      const monsterAtk = isBoss
        ? UNDERLORD_BOSS_CONFIG.phase1Atk + (player.torch === 0 ? 1 : 0)
        : calculateMonsterAttack(card.numericValue, player.torch === 0);
      const isAmbush = blind;

      if (isAmbush) {
        const armorDef = player.baseDef + (player.armor?.bonus || 0);
        const ambushDmg = calculateMitigatedDamage(monsterAtk, armorDef);
        const remainingHp = player.hp - ambushDmg;

        addLog(`💥 AMBUSH! ${card.name} lunges from the dark dealing ${ambushDmg} damage!`, 'combat');

        if (remainingHp <= 0) {
          handlePlayerDeath();
          return;
        }

        setPlayer((p) => ({ ...p, hp: remainingHp }));
      } else {
        if (isBoss) {
          addLog(`💀 THE FINAL SHOWDOWN! ${card.name}: Phase 1 (Slumbering Sovereign - ${monsterHp} HP, ${monsterAtk} ATK)!`, 'danger');
        } else {
          addLog(`Encountered ${card.name} (HP: ${monsterHp}, ATK: ${monsterAtk})! Ready your weapon!`, 'combat');
        }
      }

      setCombat({
        monsterCard: card,
        monsterHp,
        monsterMaxHp: monsterHp,
        monsterAtk,
        isAmbush,
        bossPhase: isBoss ? 1 : undefined,
        hasUsedTorchFlare: false,
      });
      setStage('COMBAT');
    } else if (card.suit === 'clubs') {
      // Trap / Hazard
      handleClubTrap(card, r, c);
    } else if (card.suit === 'diamonds') {
      // Treasure / Shop / Weapon
      handleDiamondLoot(card, r, c);
    } else if (card.suit === 'hearts') {
      // Sanctuary / Potion
      handleHeartSanctuary(card, r, c);
    }
  };

  // Handle Clubs (Traps & Timber)
  const handleClubTrap = (card: Card, r: number, c: number) => {
    const armorDef = player.baseDef + (player.armor?.bonus || 0);
    const trapDmg = calculateTrapDamage(card.numericValue, armorDef);
    const newHp = player.hp - trapDmg;

    addLog(`⚠️ Sprung ${card.name}! Took ${trapDmg} damage!`, 'danger');

    // Salvage timber for +2 Torch
    const salvagedTorch = Math.min(player.maxTorch, player.torch + 2);
    addLog(`🪵 Salvaged wooden debris from the trap: +2 Torch restored!`, 'gain');

    markTileCleared(r, c);

    if (newHp <= 0) {
      handlePlayerDeath();
    } else {
      setPlayer((p) => ({ ...p, hp: newHp, torch: salvagedTorch }));
    }
  };

  // Handle Diamonds (Gold, Gear, Merchant)
  const handleDiamondLoot = (card: Card, r: number, c: number) => {
    markTileCleared(r, c);

    if (card.rank === 'J') {
      addLog(`Met a Wandering Merchant deep in the ruins!`, 'gain');
      setStage('MERCHANT');
      return;
    }

    if (card.rank === 'K') {
      setPlayer((p) => ({
        ...p,
        weapon: { name: 'Dragon Wyrm Blade', bonus: 4, type: 'weapon' },
        gold: p.gold + 10,
      }));
      addLog(`🗡️ Acquired legendary Dragon Wyrm Blade (+4 ATK) and 10 Gold!`, 'gain');
      return;
    }

    if (card.rank === 'Q') {
      setPlayer((p) => ({
        ...p,
        armor: { name: 'Aegis Tower Shield', bonus: 3, type: 'armor' },
      }));
      addLog(`🛡️ Equipped Aegis Tower Shield (+3 DEF)!`, 'gain');
      return;
    }

    if (card.rank === 'A') {
      setPlayer((p) => ({
        ...p,
        gold: p.gold + 25,
        maxHp: p.maxHp + 5,
        hp: p.hp + 5,
      }));
      addLog(`✨ Discovered Sun Ring Relic! +25 Gold and +5 Max HP!`, 'gain');
      return;
    }

    // Numbered Cards: Direct Gold
    setPlayer((p) => ({ ...p, gold: p.gold + card.numericValue }));
    addLog(`💰 Found ${card.name}! Added +${card.numericValue} Gold.`, 'gain');
  };

  // Handle Hearts (Healing, Campfire, Sanctuary)
  const handleHeartSanctuary = (card: Card, r: number, c: number) => {
    markTileCleared(r, c);

    if (card.rank === 'J') {
      // Warm Campfire
      setPlayer((p) => ({
        ...p,
        hp: Math.min(p.maxHp, p.hp + 8),
        torch: Math.min(p.maxTorch, p.torch + 3),
      }));
      addLog(`🔥 Rested at Warm Campfire: Healed 8 HP & Restored +3 Torch!`, 'heal');
      return;
    }

    if (card.rank === 'Q') {
      // Fairy Blessing
      setPlayer((p) => ({
        ...p,
        maxHp: p.maxHp + 4,
        hp: Math.min(p.maxHp + 4, p.hp + 8),
      }));
      addLog(`🧚 Received Fairy Blessing: +4 Max HP and healed 8 HP!`, 'heal');
      return;
    }

    if (card.rank === 'A') {
      // Fountain of Rebirth
      setPlayer((p) => ({
        ...p,
        hasRevive: true,
        hp: p.maxHp,
      }));
      addLog(`💧 Drank from Fountain of Rebirth! Fully restored HP and gained Revive Token!`, 'heal');
      return;
    }

    // Numbered cards: Potion
    if (player.hp < player.maxHp) {
      const healAmt = card.numericValue;
      setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + healAmt) }));
      addLog(`🧪 Drank ${card.name}: Restored +${healAmt} HP!`, 'heal');
    } else {
      if (player.potions < 2) {
        setPlayer((p) => ({ ...p, potions: p.potions + 1 }));
        addLog(`🧪 Pocketed Health Draught (+1 Potion in pack).`, 'gain');
      } else {
        setPlayer((p) => ({ ...p, hp: p.maxHp }));
        addLog(`Health already full, draught consumed.`, 'heal');
      }
    }
  };

  const markTileCleared = (r: number, c: number) => {
    setGrid((prevGrid) => {
      const next = prevGrid.map((row) => row.map((tile) => ({ ...tile })));
      next[r][c].isCleared = true;
      return next;
    });
  };

  const handleMonsterDefeat = (monsterCard: Card) => {
    const xpGain = calculateXpGain(monsterCard.numericValue);
    addLog(`💀 Vanquished ${monsterCard.name}! Gained +${xpGain} XP.`, 'gain');

    const totalXp = player.xp + xpGain;
    const { lvl, nextXp, hpBoost, atkBoost, defBoost, hasLeveledUp } = evaluateLevelUp(totalXp, player.level);

    if (hasLeveledUp) {
      addLog(`⭐ LEVEL UP! Reached Level ${lvl}!`, 'gain');
    }

    setPlayer((p) => ({
      ...p,
      xp: totalXp,
      level: lvl,
      nextLevelXp: nextXp,
      maxHp: p.maxHp + hpBoost,
      hp: p.hp + hpBoost,
      baseAtk: p.baseAtk + atkBoost,
      baseDef: p.baseDef + defBoost,
    }));

    markTileCleared(player.position.r, player.position.c);
    setCombat(null);
    setStage('EXPLORING');

    // Boss Victory: Defeating Ace of Spades on Floor 5
    if (floorNum === 5 && monsterCard.suit === 'spades' && monsterCard.rank === 'A') {
      setStage('VICTORY');
    }
  };

  // Combat Attack
  const handleCombatAttack = () => {
    if (!combat) return;

    const heroAtk = calculateHeroAttack(player.baseAtk, player.weapon?.bonus);
    const newMonsterHp = combat.monsterHp - heroAtk;

    addLog(`⚔️ You struck ${combat.monsterCard.name} for ${heroAtk} damage!`, 'combat');

    if (newMonsterHp <= 0) {
      if (combat.bossPhase === 1) {
        // Transition to Phase 2: The Void Unleashed
        const transitionDmg = UNDERLORD_BOSS_CONFIG.phaseTransitionDmg;
        const newHeroHp = player.hp - transitionDmg;

        addLog(`💥 THE SLUMBERING SOVEREIGN SHATTERS!`, 'combat');
        addLog(`⚠️ PHASE 2: THE VOID UNLEASHED! The Underlord awakens with ${UNDERLORD_BOSS_CONFIG.phase2Hp} HP, ${UNDERLORD_BOSS_CONFIG.phase2Atk} ATK & Crushing Ruin!`, 'danger');
        addLog(`⚡ Abyssal Shockwave deals ${transitionDmg} unavoidable damage!`, 'danger');

        const phase2Atk = UNDERLORD_BOSS_CONFIG.phase2Atk + (player.torch === 0 ? 1 : 0);
        setCombat((c) => (c ? {
          ...c,
          bossPhase: 2,
          monsterHp: UNDERLORD_BOSS_CONFIG.phase2Hp,
          monsterMaxHp: UNDERLORD_BOSS_CONFIG.phase2Hp,
          monsterAtk: phase2Atk,
        } : null));

        if (newHeroHp <= 0) {
          handlePlayerDeath();
        } else {
          setPlayer((p) => ({ ...p, hp: newHeroHp }));
        }
        return;
      }

      handleMonsterDefeat(combat.monsterCard);
      return;
    }

    // Monster strikes back
    const armorDef = player.baseDef + (player.armor?.bonus || 0);
    const monsterDmg = combat.bossPhase === 2
      ? calculateUnderlordDamage(2, combat.monsterAtk, armorDef)
      : calculateMitigatedDamage(combat.monsterAtk, armorDef);
    const newHeroHp = player.hp - monsterDmg;

    addLog(`🩸 ${combat.monsterCard.name} hit back for ${monsterDmg} damage!`, 'combat');

    setCombat((c) => (c ? { ...c, monsterHp: newMonsterHp } : null));

    if (newHeroHp <= 0) {
      handlePlayerDeath();
    } else {
      setPlayer((p) => ({ ...p, hp: newHeroHp }));
    }
  };

  // Torch Flare (Lvl 4 skill)
  const handleTorchFlare = () => {
    if (!combat) return;

    const flareCheck = canCastTorchFlare({
      level: player.level,
      torch: player.torch,
      hasUsedInCombat: combat.hasUsedTorchFlare,
      bossPhase: combat.bossPhase,
    });
    if (!flareCheck.canCast) return;

    addLog(`🔥 Unleashed Torch Flare! Blasted 6 instant fire damage!`, 'combat');
    setPlayer((p) => ({ ...p, torch: p.torch - 2 }));

    const newMonsterHp = combat.monsterHp - 6;
    if (newMonsterHp <= 0) {
      handleMonsterDefeat(combat.monsterCard);
    } else {
      setCombat((c) => (c ? { ...c, monsterHp: newMonsterHp, hasUsedTorchFlare: true } : null));
    }
  };

  // Combat Flee
  const handleCombatFlee = () => {
    if (player.torch < 1) {
      addLog(`Cannot flee in pitch dark!`, 'danger');
      return;
    }

    const newHp = player.hp - 2;
    addLog(`🏃 Fled in panic! Expended 1 Torch and took 2 recoil damage.`, 'danger');

    setPlayer((p) => ({ ...p, torch: p.torch - 1, hp: Math.max(1, newHp) }));
    setCombat(null);
    setStage('EXPLORING');

    if (newHp <= 0) {
      handlePlayerDeath();
    }
  };

  // Potion Use
  const handleUsePotion = () => {
    if (player.potions <= 0 || player.hp >= player.maxHp) return;

    const healed = Math.min(player.maxHp - player.hp, 8);
    setPlayer((p) => ({
      ...p,
      potions: p.potions - 1,
      hp: p.hp + healed,
    }));
    addLog(`🧪 Chugged Healing Potion: Restored +${healed} HP!`, 'heal');
  };

  // Death handler
  const handlePlayerDeath = () => {
    if (player.hasRevive) {
      setPlayer((p) => ({ ...p, hp: 10, hasRevive: false }));
      addLog(`✨ PHOENIX REVIVE ACTIVATED! Death was averted, HP restored to 10!`, 'heal');
      return;
    }

    addLog(`💀 Your soul was consumed by the dark catacombs...`, 'danger');
    setStage('GAME_OVER');
  };

  // Descend to Next Floor
  const handleDescend = () => {
    if (floorNum >= 5) {
      setStage('VICTORY');
      return;
    }

    const nextFloor = floorNum + 1;
    setFloorNum(nextFloor);
    setGrid(buildFloorGrid(campaign.floors[nextFloor - 1], nextFloor));

    const { newHp, healed } = calculateFloorTransitionHeal(player.hp, player.maxHp);
    setPlayer((p) => ({ ...p, hp: newHp, position: { r: 0, c: 0 } }));

    addLog(`▼ Descended into Floor ${nextFloor}! Light fades further...`, 'neutral');
    if (healed > 0) {
      addLog(`🌿 Caught your breath on the stairs: Field dressing restored +${healed} HP!`, 'heal');
    }

    // Wandering Merchant chance between floors
    if (nextFloor === 3) {
      setStage('MERCHANT');
    }
  };

  // Wandering Merchant Purchases - locked in upon continuing expedition
  const handleContinueFromMerchant = (selectedItemIds: MerchantItemId[]) => {
    if (selectedItemIds.length === 0) {
      addLog(`Departed the Wandering Merchant without making purchases.`, 'neutral');
      setStage('EXPLORING');
      return;
    }

    const { updatedPlayer, totalCost, itemNames } = applyMerchantPurchases(player, selectedItemIds);
    setPlayer(updatedPlayer);
    addLog(`🛒 Purchased ${itemNames.join(', ')} from Wandering Merchant for ${totalCost} Gold.`, 'gain');
    setStage('EXPLORING');
  };

  // Restart Game
  const handleRestart = () => {
    const newCamp = generateCampaign();
    setCampaign(newCamp);
    setFloorNum(1);
    setGrid(buildFloorGrid(newCamp.floors[0], 1));
    setPlayer({
      hp: 20,
      maxHp: 20,
      torch: 6,
      maxTorch: 8,
      gold: 0,
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
    });
    setCombat(null);
    setStage('DRAFT');
    setLogs([
      {
        id: 'restart-1',
        text: 'A new delve begins. Choose your starting draft...',
        type: 'neutral',
        timestamp: '00:00',
      },
    ]);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '12px', minHeight: '100vh' }}>
      {/* Main Game Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        <h1
          style={{
            fontSize: '15px',
            color: 'var(--c-yellow)',
            letterSpacing: '2px',
            textShadow: '0 0 8px rgba(245, 183, 0, 0.8), 2px 2px 0 #000',
          }}
        >
          🕯️ LUMEN 🕯️
        </h1>
        <div style={{ fontSize: '9px', color: 'var(--c-cyan)', marginTop: '4px', letterSpacing: '1px' }}>
          THE TORCHLIGHT CATACOMBS
        </div>
        <p style={{ fontSize: '7px', color: 'var(--c-white)', marginTop: '4px' }}>
          3-BIT RETRO 52-CARD DUNGEON EXPLORER
        </p>
      </div>

      {/* Persistent Character HUD */}
      <HUD
        player={player}
        floor={floorNum}
        onUsePotion={handleUsePotion}
      />

      {/* 3x3 Spatial Dungeon Grid */}
      <DungeonGrid
        grid={grid}
        player={player}
        onEnterTile={handleEnterTile}
        onScoutTile={handleScoutTile}
        onDescend={handleDescend}
      />

      {/* Chronicle Event Console */}
      <LogView logs={logs} />

      {/* Modals & Stage Overlays */}
      {stage === 'DRAFT' && (
        <DraftModal
          draftCards={campaign.draftCards}
          onSelectCard={handleSelectDraft}
        />
      )}

      {stage === 'COMBAT' && combat && (
        <CombatModal
          combat={combat}
          player={player}
          onAttack={handleCombatAttack}
          onTorchFlare={handleTorchFlare}
          onUsePotion={handleUsePotion}
          onFlee={handleCombatFlee}
        />
      )}

      {stage === 'MERCHANT' && (
        <MerchantModal
          player={player}
          onContinueExpedition={handleContinueFromMerchant}
        />
      )}

      {(stage === 'GAME_OVER' || stage === 'VICTORY') && (
        <GameOverModal
          isVictory={stage === 'VICTORY'}
          player={player}
          floor={floorNum}
          onRestart={handleRestart}
        />
      )}

      {/* Subtle Copyright & Version Footer */}
      <div style={{ textAlign: 'center', fontSize: '6px', color: '#445170', marginTop: '16px', letterSpacing: '1px', lineHeight: '1.6' }}>
        <div>© 2026 DANIEL WILLIAMS. ALL RIGHTS RESERVED.</div>
        <div style={{ color: '#55668a', marginTop: '2px' }}>v{packageInfo.version}</div>
      </div>
    </div>
  );
};

export default App;
