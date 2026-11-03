import React from 'react';
import { PlayerState } from '../types';
import { calculateLegacyScore } from '../utils/rules';

interface GameOverModalProps {
  isVictory: boolean;
  player: PlayerState;
  floor: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isVictory,
  player,
  floor,
  onRestart,
}) => {
  const score = calculateLegacyScore({
    isVictory,
    hp: player.hp,
    gold: player.gold,
    level: player.level,
    weaponBonus: player.weapon?.bonus || 0,
    floor,
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '16px',
      }}
    >
      <div
        className={`pixel-panel ${isVictory ? 'yellow' : 'red'}`}
        style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}
      >
        <div
          style={{
            fontSize: '14px',
            color: isVictory ? 'var(--c-yellow)' : 'var(--c-red)',
            marginBottom: '8px',
          }}
        >
          {isVictory ? '🏆 VICTORY ACHIEVED! 🏆' : '💀 DELVE FAILED 💀'}
        </div>

        <div style={{ fontSize: '9px', color: '#abb2bf', marginBottom: '16px' }}>
          {isVictory
            ? 'You have vanquished The Underlord and escaped the sunken catacombs alive!'
            : `Your light was snuffed out in the darkness of Floor ${floor}.`}
        </div>

        {/* Breakdown Panel */}
        <div
          style={{
            backgroundColor: '#161922',
            padding: '12px',
            border: '2px solid #333a4d',
            marginBottom: '16px',
            fontSize: '8px',
            textAlign: 'left',
            lineHeight: '2',
          }}
        >
          <div>• FINAL FLOOR: <span style={{ color: 'var(--c-yellow)' }}>{floor}/5</span></div>
          <div>• HERO LEVEL: <span style={{ color: 'var(--c-cyan)' }}>Level {player.level}</span></div>
          <div>• WEALTH EXTRACTED: <span style={{ color: 'var(--c-yellow)' }}>{player.gold} Gold</span></div>
          <div>• HEALTH REMAINING: <span style={{ color: 'var(--c-red)' }}>{player.hp} HP</span></div>
          <div style={{ borderTop: '2px solid #444c60', marginTop: '8px', paddingTop: '8px', fontSize: '10px' }}>
            TOTAL SCORE: <span style={{ color: 'var(--c-green)', fontWeight: 'bold' }}>{score} PTS</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="pixel-btn btn-green"
          style={{ width: '100%', padding: '12px', fontSize: '10px' }}
        >
          🔄 EMBARK ON NEW EXPEDITION
        </button>
      </div>
    </div>
  );
};
