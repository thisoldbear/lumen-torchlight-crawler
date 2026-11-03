import React from 'react';
import { PlayerState } from '../types';

interface HUDProps {
  player: PlayerState;
  floor: number;
  onUsePotion: () => void;
}

const FLOOR_NAMES = [
  'The Sunken Crypts',
  'The Flooded Tombs',
  'The Iron Oubliette',
  'The Abyssal Rift',
  'The Underlord Sanctum',
];

export const HUD: React.FC<HUDProps> = ({
  player,
  floor,
  onUsePotion,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const torchPercent = Math.max(0, Math.min(100, (player.torch / player.maxTorch) * 100));
  const xpPercent = Math.max(0, Math.min(100, (player.xp / player.nextLevelXp) * 100));

  return (
    <div className="pixel-panel" style={{ marginBottom: '14px' }}>
      {/* Top Header: Floor Title */}
      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: 'var(--c-yellow)', fontSize: '10px' }}>FLOOR {floor}/5: </span>
        <span style={{ color: 'var(--c-white)', fontSize: '9px' }}>{FLOOR_NAMES[floor - 1]}</span>
      </div>

      {/* Main Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
        {/* Health */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'var(--c-red)' }}>
            <span>❤️ HEALTH</span>
            <span>{player.hp}/{player.maxHp}</span>
          </div>
          <div className="pixel-bar-track">
            <div className="pixel-bar-fill hp" style={{ width: `${hpPercent}%` }} />
          </div>
        </div>

        {/* Torch */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'var(--c-yellow)' }}>
            <span>🕯️ TORCH</span>
            <span>{player.torch}/{player.maxTorch}</span>
          </div>
          <div className="pixel-bar-track">
            <div className="pixel-bar-fill torch" style={{ width: `${torchPercent}%` }} />
          </div>
        </div>

        {/* XP */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'var(--c-cyan)' }}>
            <span>⭐ LVL {player.level}</span>
            <span>{player.xp}/{player.nextLevelXp} XP</span>
          </div>
          <div className="pixel-bar-track">
            <div className="pixel-bar-fill xp" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Equipment, Gold & Quick Items Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
          paddingTop: '8px',
          borderTop: '2px solid #2d3345',
          gap: '8px',
          fontSize: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: '#8892b0' }}>WEAPON: </span>
            <span style={{ color: 'var(--c-white)' }}>
              {player.weapon ? `${player.weapon.name} (+${player.weapon.bonus})` : 'Fists (+0)'}
            </span>
          </div>
          <div>
            <span style={{ color: '#8892b0' }}>ARMOR: </span>
            <span style={{ color: 'var(--c-white)' }}>
              {player.armor ? `${player.armor.name} (+${player.armor.bonus})` : 'Rags (+0)'}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--c-yellow)' }}>💰 GOLD: </span>
            <span style={{ color: 'var(--c-white)' }}>{player.gold}</span>
          </div>
        </div>

        {/* Potions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🧪 POTIONS: {player.potions}/2</span>
          <button
            onClick={() => {
              if (player.potions > 0 && player.hp < player.maxHp) {
                onUsePotion();
              }
            }}
            disabled={player.potions === 0 || player.hp >= player.maxHp}
            className="pixel-btn btn-green"
            style={{ padding: '4px 8px', fontSize: '8px' }}
          >
            DRINK (+8 HP)
          </button>
        </div>
      </div>
    </div>
  );
};
