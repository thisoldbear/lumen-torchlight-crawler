import React from 'react';
import { Card, Suit } from '../types';

interface RetroCardProps {
  card: Card;
  isRevealed: boolean;
  isCleared?: boolean;
  isCurrent?: boolean;
  isAdjacent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const SUIT_ICONS: Record<Suit, string> = {
  spades: '♠',
  clubs: '♣',
  diamonds: '♦',
  hearts: '♥',
};

export const SUIT_NAMES: Record<Suit, string> = {
  spades: 'MONSTER',
  clubs: 'TRAP / WOOD',
  diamonds: 'TREASURE',
  hearts: 'SANCTUARY',
};

export const RetroCard: React.FC<RetroCardProps> = ({
  card,
  isRevealed,
  isCleared = false,
  isCurrent = false,
  isAdjacent = false,
  size = 'md',
  onClick,
}) => {
  const suitClass = `text-${card.suit}`;

  // Card back (hidden in fog)
  if (!isRevealed) {
    return (
      <div
        onClick={onClick}
        className={`retro-card card-back ${size} ${isAdjacent ? 'adjacent-pulse' : ''}`}
        style={{
          width: size === 'sm' ? '65px' : size === 'lg' ? '140px' : '92px',
          height: size === 'sm' ? '90px' : size === 'lg' ? '200px' : '132px',
          backgroundColor: isAdjacent ? '#1a233a' : '#141824',
          border: isCurrent 
            ? '3px solid var(--c-yellow)'
            : isAdjacent 
            ? '3px solid var(--c-yellow)' 
            : '3px solid #3c4866',
          boxShadow: isAdjacent ? '0 0 8px rgba(245, 183, 0, 0.4), 3px 3px 0 #000' : '3px 3px 0 #000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isAdjacent ? 'pointer' : 'default',
          position: 'relative',
          padding: '6px',
        }}
      >
        <div style={{ fontSize: size === 'lg' ? '28px' : '20px', filter: isAdjacent ? 'drop-shadow(0 0 6px #f5b700)' : 'none' }}>
          🕯️
        </div>
        <div
          style={{
            fontSize: '8px',
            color: isAdjacent ? 'var(--c-yellow)' : '#8fa2c7',
            marginTop: '8px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {isAdjacent ? 'EXPLORE' : 'FOG'}
        </div>
        {isAdjacent && (
          <div
            style={{
              position: 'absolute',
              top: 3,
              right: 3,
              width: 7,
              height: 7,
              backgroundColor: 'var(--c-yellow)',
              boxShadow: '0 0 4px var(--c-yellow)',
            }}
          />
        )}
      </div>
    );
  }

  // Card front (revealed)
  return (
    <div
      onClick={onClick}
      className={`retro-card ${size} ${isCurrent ? 'current-player' : ''} ${isCleared ? 'cleared' : ''}`}
      style={{
        width: size === 'sm' ? '65px' : size === 'lg' ? '140px' : '92px',
        height: size === 'sm' ? '90px' : size === 'lg' ? '200px' : '132px',
        backgroundColor: isCleared ? '#151b28' : '#21293d',
        border: isCurrent 
          ? '4px solid var(--c-yellow)' 
          : isCleared 
          ? '3px solid #4a5675' 
          : '3px solid var(--c-white)',
        boxShadow: isCurrent ? '0 0 12px var(--c-yellow), 4px 4px 0 #000' : '3px 3px 0 #000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '6px',
        position: 'relative',
        cursor: isAdjacent && !isCleared ? 'pointer' : 'default',
        opacity: isCleared ? 0.75 : 1,
      }}
    >
      {/* Top Header: Rank + Suit */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: size === 'lg' ? '14px' : '11px', fontWeight: 'bold', color: 'var(--c-white)' }}>
          {card.rank}
        </span>
        <span className={suitClass} style={{ fontSize: size === 'lg' ? '18px' : '14px' }}>
          {SUIT_ICONS[card.suit]}
        </span>
      </div>

      {/* Center Icon & Type */}
      <div style={{ textAlign: 'center', margin: '2px 0' }}>
        <div className={suitClass} style={{ fontSize: size === 'lg' ? '34px' : '22px' }}>
          {SUIT_ICONS[card.suit]}
        </div>
        <div style={{ fontSize: size === 'lg' ? '8px' : '6px', color: '#c5d1eb', marginTop: '2px', fontWeight: 'bold' }}>
          {SUIT_NAMES[card.suit]}
        </div>
      </div>

      {/* Bottom Name / Value */}
      <div style={{ borderTop: '2px solid #3c4866', paddingTop: '4px', fontSize: size === 'lg' ? '9px' : '7px' }}>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--c-white)', fontWeight: 'bold' }}>
          {card.name}
        </div>
        <div style={{ color: card.suit === 'spades' ? 'var(--c-red)' : 'var(--c-yellow)', fontSize: '7px', marginTop: '1px' }}>
          {card.suit === 'spades'
            ? (card.rank === 'A' ? 'BOSS (2-PHASE)' : `HP:${card.numericValue} ATK:${Math.ceil(card.numericValue / 2)}`)
            : card.suit === 'diamonds'
            ? `GOLD: ${card.numericValue}`
            : ''}
        </div>
      </div>

      {/* Cleared Stamp */}
      {isCleared && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-15deg)',
            backgroundColor: 'rgba(10, 12, 18, 0.92)',
            border: '2px solid #8fa2c7',
            color: 'var(--c-white)',
            fontSize: '8px',
            padding: '3px 7px',
            pointerEvents: 'none',
            fontWeight: 'bold',
          }}
        >
          CLEARED
        </div>
      )}

      {/* Player Token Overlay */}
      {isCurrent && (
        <div
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            backgroundColor: 'var(--c-yellow)',
            color: '#000',
            fontSize: '8px',
            padding: '3px 6px',
            border: '2px solid #000',
            fontWeight: 'bold',
            boxShadow: '0 0 6px var(--c-yellow)',
          }}
        >
          HERO
        </div>
      )}
    </div>
  );
};
