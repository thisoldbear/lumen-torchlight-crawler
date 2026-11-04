import React from 'react';
import { PlayerState } from '../types';
import { calculateLegacyScore } from '../utils/rules';

interface GameOverModalProps {
  isVictory: boolean;
  player: PlayerState;
  floor: number;
  completedCycles?: number;
  onRestart: () => void;
  onDelveIntoAbyss?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isVictory,
  player,
  floor,
  completedCycles = 0,
  onRestart,
  onDelveIntoAbyss,
}) => {
  const effectiveCycles = Math.max(completedCycles, isVictory ? player.cycle : 0);
  const score = calculateLegacyScore({
    isVictory,
    hp: player.hp,
    gold: player.gold,
    level: player.level,
    weaponBonus: player.weapon?.bonus || 0,
    floor,
    completedCycles: effectiveCycles,
  });

  const nextCycle = (player.cycle || 1) + 1;
  const cycleMultiplier = isVictory ? (1 + Math.max(0, effectiveCycles - 1) * 0.5) : 1;

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
        style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}
      >
        <div
          style={{
            fontSize: '13px',
            color: isVictory ? 'var(--c-yellow)' : 'var(--c-red)',
            marginBottom: '8px',
            letterSpacing: '1px',
          }}
        >
          {isVictory ? '🏆 THE UNDERLORD IS SLAIN! 🏆' : '💀 DELVE FAILED 💀'}
        </div>

        <div style={{ fontSize: '9px', color: '#abb2bf', marginBottom: '14px', lineHeight: '1.6' }}>
          {isVictory
            ? `You have conquered Floor ${floor} (Cycle ${player.cycle})! An Abyssal Rift tears open before you.`
            : `Your light was snuffed out in the darkness of Floor ${floor}.`}
        </div>

        {/* Breakdown Panel */}
        <div
          style={{
            backgroundColor: '#161922',
            padding: '12px',
            border: '2px solid #333a4d',
            marginBottom: '14px',
            fontSize: '8px',
            textAlign: 'left',
            lineHeight: '2.1',
          }}
        >
          <div>• FINAL FLOOR: <span style={{ color: 'var(--c-yellow)' }}>Floor {floor}</span></div>
          <div>• CURRENT CYCLE: <span style={{ color: 'var(--c-cyan)' }}>Cycle {player.cycle}</span></div>
          {effectiveCycles > 0 && (
            <div>• COMPLETED CYCLES: <span style={{ color: 'var(--c-green)' }}>{effectiveCycles} Conquered</span></div>
          )}
          {isVictory && effectiveCycles > 1 && (
            <div>• ABYSSAL MULTIPLIER: <span style={{ color: 'var(--c-yellow)' }}>{cycleMultiplier}x SCORE</span></div>
          )}
          <div>• HERO LEVEL: <span style={{ color: 'var(--c-cyan)' }}>Level {player.level}</span></div>
          <div>• WEALTH EXTRACTED: <span style={{ color: 'var(--c-yellow)' }}>{player.gold} Gold</span></div>
          <div>• HEALTH REMAINING: <span style={{ color: 'var(--c-red)' }}>{player.hp} HP</span></div>
          <div style={{ borderTop: '2px solid #444c60', marginTop: '8px', paddingTop: '8px', fontSize: '10px' }}>
            TOTAL SCORE: <span style={{ color: 'var(--c-green)', fontWeight: 'bold' }}>{score} PTS</span>
          </div>
        </div>

        {isVictory && onDelveIntoAbyss ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={onDelveIntoAbyss}
              className="pixel-btn btn-yellow"
              style={{ width: '100%', padding: '12px', fontSize: '9px', color: 'var(--c-black)' }}
            >
              🌀 DELVE INTO THE ABYSS (ENTER CYCLE {nextCycle}) ▶
            </button>

            <button
              onClick={onRestart}
              className="pixel-btn btn-green"
              style={{ width: '100%', padding: '10px', fontSize: '9px' }}
            >
              🏆 RETIRE WITH GLORY (BANK SCORE)
            </button>
          </div>
        ) : (
          <button
            onClick={onRestart}
            className="pixel-btn btn-green"
            style={{ width: '100%', padding: '12px', fontSize: '10px' }}
          >
            🔄 EMBARK ON NEW EXPEDITION
          </button>
        )}
      </div>
    </div>
  );
};
