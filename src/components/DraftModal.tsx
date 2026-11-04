import React, { useState } from 'react';
import { Card } from '../types';
import { RetroCard } from './RetroCard';

interface DraftModalProps {
  draftCards: Card[];
  onSelectCard: (card: Card) => void;
}

export const DraftModal: React.FC<DraftModalProps> = ({ draftCards, onSelectCard }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div className="pixel-panel cyan" style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--c-cyan)', marginBottom: '6px' }}>
          🕯️ ADVENTURER'S DRAFT 🕯️
        </div>
        <div style={{ fontSize: '8px', color: '#8b949e', marginBottom: '14px' }}>
          Select 1 starting boon to carry into the Catacombs. The other 2 will be lost to the void.
        </div>

        {/* 3 Starting Draft Cards */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {draftCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onSelectCard(card)}
              style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
            >
              <RetroCard card={card} isRevealed={true} size="md" />
              <button
                className="pixel-btn btn-cyan"
                style={{ width: '100%', marginTop: '6px', fontSize: '7px', padding: '4px' }}
              >
                CHOOSE
              </button>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '7px', color: '#9aa2b6', borderTop: '2px solid #232c42', paddingTop: '8px', marginBottom: '12px' }}>
          ♦ Diamonds = Starting Gear/Gold | ♥ Hearts = Potion/Heal | ♣ Clubs = Torch Timber
        </div>

        {/* Read the guide button at the bottom */}
        <div>
          <button
            onClick={() => setShowGuide(true)}
            className="pixel-btn"
            style={{
              backgroundColor: '#161c2c',
              borderColor: '#4d5b7c',
              fontSize: '7px',
              padding: '5px 12px',
              color: '#c5d1eb',
            }}
          >
            Read the guide
          </button>
        </div>
      </div>

      {/* Guide Overlay Modal */}
      {showGuide && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(5, 7, 12, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '16px',
          }}
        >
          <div
            className="pixel-panel yellow"
            style={{
              maxWidth: '440px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              textAlign: 'left',
              fontSize: '8px',
              lineHeight: '1.7',
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--c-yellow)', textAlign: 'center', marginBottom: '12px', letterSpacing: '2px' }}>
              🕯️ GUIDE 🕯️
            </div>

            {/* Objective */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: 'var(--c-cyan)', fontWeight: 'bold' }}>🎯 OBJECTIVE:</div>
              <div>Descend through 5 floors of 3x3 catacomb chambers. Reach the stairs on Floor 5 and slay <span style={{ color: 'var(--c-red)' }}>The Underlord (Ace of Spades ♠)</span> to escape!</div>
            </div>

            {/* Exploration & Torch */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: 'var(--c-yellow)', fontWeight: 'bold' }}>🕯️ NAVIGATION & TORCH:</div>
              <div>• Move orthogonally (Up, Down, Left, Right) starting from Entrance (0,0) to Stairs (2,2).</div>
              <div>• <span style={{ color: 'var(--c-yellow)' }}>SCOUT (-1 🕯️):</span> Reveal adjacent rooms safely before moving.</div>
              <div>• <span style={{ color: 'var(--c-red)' }}>BLIND STEP:</span> Conserve torch fuel, but if it's a Monster (♠), you are <span style={{ color: 'var(--c-red)' }}>AMBUSHED</span> (monster strikes first!).</div>
              <div>• If Torch hits 0, darkness consumes you: you cannot scout.</div>
            </div>

            {/* 4 Card Suits */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: 'var(--c-white)', fontWeight: 'bold' }}>🃏 THE 4 CARD SUITS:</div>
              <div>• <span style={{ color: 'var(--c-white)' }}>♠ SPADES (Monsters):</span> Turn-based battle. Deal ATK, take DMG reduced by Armor DEF. Slaying them grants XP.</div>
              <div>• <span style={{ color: 'var(--c-green)' }}>♣ CLUBS (Traps & Snare):</span> Suffer mitigated trap damage, but salvage wooden timber to gain <span style={{ color: 'var(--c-yellow)' }}>+2 Torch</span>!</div>
              <div>• <span style={{ color: 'var(--c-cyan)' }}>♦ DIAMONDS (Treasure):</span> Gold caches, Swords (+ATK), Shields (+DEF), and Wandering Merchants.</div>
              <div>• <span style={{ color: 'var(--c-red)' }}>♥ HEARTS (Sanctuaries):</span> Health potions, fairy blessings (+Max HP), campfires (+HP & +Torch), and Revive Tokens.</div>
            </div>

            {/* Combat System Clarity */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: 'var(--c-red)', fontWeight: 'bold' }}>⚔️ HOW COMBAT WORKS:</div>
              <div>• <span style={{ color: 'var(--c-yellow)' }}>NO CARD HAND:</span> Cards represent rooms & monsters. You attack directly using your Hero's stats (Starts at 3 Base ATK + Weapon)!</div>
              <div>• <span style={{ color: 'var(--c-cyan)' }}>HERO STRIKE:</span> Choosing <b>Attack</b> strikes the monster first. If the monster dies from your blow, it is slain instantly and cannot hit back!</div>
              <div>• <span style={{ color: 'var(--c-red)' }}>MONSTER POWER:</span> Monster ATK is scaled to ⌈Rank / 2⌉ (HP = full rank). Surviving foes counter-attack for Monster ATK − Your DEF (min 1).</div>
              <div>• <span style={{ color: 'var(--c-green)' }}>TACTICAL OPTIONS:</span> Drink a Potion (+8 HP without triggering retaliation), Flee (-1🕯️, -2 HP), or cast Torch Flare (Lvl 4).</div>
              <div>• <span style={{ color: 'var(--c-yellow)' }}>FIGHT VS. FLEE:</span> Fighting is your only path to XP, levels, and tile clearance. However, <b>Fleeing</b> costs a flat 1 Torch & 2 HP—an invaluable emergency brake if a high-rank foe would otherwise kill you!</div>
            </div>

            {/* Leveling */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ color: 'var(--c-cyan)', fontWeight: 'bold' }}>⭐ LEVELING UP:</div>
              <div>• <span style={{ color: 'var(--c-cyan)' }}>Lvl 1 (Start):</span> 3 Base ATK, 0 DEF, 20 Max HP</div>
              <div>• <span style={{ color: 'var(--c-cyan)' }}>Lvl 2 (10 XP):</span> +5 Max HP, heal 5 HP, Base ATK increases to 4</div>
              <div>• <span style={{ color: 'var(--c-cyan)' }}>Lvl 3 (25 XP):</span> +5 Max HP, Base DEF increases to 1</div>
              <div>• <span style={{ color: 'var(--c-cyan)' }}>Lvl 4 (45 XP):</span> Base ATK increases to 5, unlock <span style={{ color: 'var(--c-yellow)' }}>Torch Flare</span> (spend 2 Torch for 6 instant fire damage)</div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="pixel-btn btn-green"
              style={{ width: '100%', padding: '10px', fontSize: '9px' }}
            >
              GOT IT / RETURN TO DRAFT ▶
            </button>

            <div style={{ textAlign: 'center', fontSize: '6px', color: '#68789e', marginTop: '12px' }}>
              © 2026 Daniel Williams. All rights reserved.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
