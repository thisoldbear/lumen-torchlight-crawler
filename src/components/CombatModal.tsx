import React from 'react';
import { CombatState, PlayerState } from '../types';
import { RetroCard } from './RetroCard';
import { canCastTorchFlare } from '../utils/rules';

interface CombatModalProps {
  combat: CombatState;
  player: PlayerState;
  onAttack: () => void;
  onTorchFlare: () => void;
  onUsePotion: () => void;
  onFlee: () => void;
}

export const CombatModal: React.FC<CombatModalProps> = ({
  combat,
  player,
  onAttack,
  onTorchFlare,
  onUsePotion,
  onFlee,
}) => {
  const monsterHpPercent = Math.max(0, (combat.monsterHp / combat.monsterMaxHp) * 100);
  const playerAtk = player.baseAtk + (player.weapon?.bonus || 0);
  const playerDef = player.baseDef + (player.armor?.bonus || 0);
  const flareStatus = canCastTorchFlare({
    level: player.level,
    torch: player.torch,
    hasUsedInCombat: combat.hasUsedTorchFlare,
    bossPhase: combat.bossPhase,
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '12px',
      }}
    >
      <div className="pixel-panel red" style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        {/* Ambush Banner */}
        {combat.isAmbush && (
          <div
            style={{
              backgroundColor: 'var(--c-red)',
              color: '#fff',
              fontSize: '8px',
              padding: '4px',
              marginBottom: '8px',
              fontWeight: 'bold',
            }}
          >
            ⚠️ AMBUSHED IN THE DARK! MONSTER STRIKES FIRST!
          </div>
        )}

        {/* Boss Phase Banner */}
        {combat.bossPhase === 1 && (
          <div
            style={{
              backgroundColor: '#162233',
              border: '2px solid var(--c-cyan)',
              color: 'var(--c-cyan)',
              fontSize: '8px',
              padding: '5px',
              marginBottom: '8px',
              fontWeight: 'bold',
              letterSpacing: '1px',
            }}
          >
            🛡️ THE UNDERLORD: PHASE 1 (SLUMBERING SOVEREIGN)
          </div>
        )}

        {combat.bossPhase === 2 && (
          <div
            style={{
              backgroundColor: '#2e1216',
              border: '2px solid var(--c-red)',
              color: 'var(--c-red)',
              fontSize: '8px',
              padding: '5px',
              marginBottom: '8px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              boxShadow: '0 0 8px rgba(240, 37, 56, 0.4)',
            }}
          >
            ⚠️ THE UNDERLORD: PHASE 2 (THE VOID UNLEASHED)
          </div>
        )}

        <div style={{ fontSize: '12px', color: 'var(--c-red)', marginBottom: '8px' }}>
          ⚔️ COMBAT ENGAGED ⚔️
        </div>

        {/* Center: Monster Card & Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center', margin: '12px 0' }}>
          <RetroCard card={combat.monsterCard} isRevealed={true} size="lg" />

          <div style={{ textAlign: 'left', minWidth: '140px' }}>
            <div style={{ color: 'var(--c-white)', fontSize: '10px', marginBottom: '4px' }}>
              {combat.monsterCard.name}
            </div>
            
            <div style={{ fontSize: '7px', color: '#9aa2b6', marginBottom: '6px' }}>
              {combat.monsterCard.lore}
            </div>

            {/* Monster HP */}
            <div style={{ fontSize: '8px', color: 'var(--c-red)' }}>
              HP: {combat.monsterHp} / {combat.monsterMaxHp}
            </div>
            <div className="pixel-bar-track" style={{ marginBottom: '6px' }}>
              <div className="pixel-bar-fill hp" style={{ width: `${monsterHpPercent}%` }} />
            </div>

            <div style={{ fontSize: '8px', color: 'var(--c-yellow)' }}>
              STRIKE POWER: {combat.monsterAtk} DMG
              {combat.bossPhase === 2 && (
                <span style={{ color: 'var(--c-red)', display: 'block', fontSize: '7px', marginTop: '2px' }}>
                  ⚔️ CRUSHING RUIN (MIN 3 DMG)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hero Combat Status */}
        <div
          style={{
            backgroundColor: '#181c28',
            padding: '8px',
            border: '2px solid #333a4d',
            marginBottom: '12px',
            fontSize: '8px',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div>❤️ HP: <span style={{ color: 'var(--c-red)' }}>{player.hp}/{player.maxHp}</span></div>
          <div>⚔️ ATK: <span style={{ color: 'var(--c-cyan)' }}>{playerAtk}</span></div>
          <div>🛡️ DEF: <span style={{ color: 'var(--c-green)' }}>{playerDef}</span></div>
        </div>

        {/* Combat Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={onAttack}
            className="pixel-btn btn-red"
            style={{ padding: '10px 4px', fontSize: '9px' }}
          >
            ⚔️ ATTACK ({playerAtk} DMG)
          </button>

          <button
            onClick={onUsePotion}
            disabled={player.potions === 0 || player.hp >= player.maxHp}
            className="pixel-btn btn-green"
            style={{ padding: '10px 4px', fontSize: '8px' }}
          >
            🧪 POTION (+8 HP) [{player.potions}]
          </button>

          <button
            onClick={onTorchFlare}
            disabled={!flareStatus.canCast}
            className="pixel-btn btn-yellow"
            style={{ padding: '10px 4px', fontSize: '8px' }}
            title={flareStatus.canCast ? 'Unleash burst of flame' : flareStatus.reason}
          >
            {flareStatus.canCast
              ? '🔥 TORCH FLARE (-2🕯️)'
              : `🔥 FLARE (${flareStatus.reason})`}
          </button>

          <button
            onClick={onFlee}
            className="pixel-btn"
            style={{ padding: '10px 4px', fontSize: '8px' }}
          >
            🏃 FLEE (-1🕯️, -2 HP)
          </button>
        </div>
      </div>
    </div>
  );
};
