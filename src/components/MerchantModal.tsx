import React from 'react';
import { PlayerState } from '../types';

interface MerchantModalProps {
  player: PlayerState;
  onBuyItem: (type: 'torch' | 'potion' | 'weapon' | 'armor' | 'revive', cost: number) => void;
  onClose: () => void;
}

export const MerchantModal: React.FC<MerchantModalProps> = ({
  player,
  onBuyItem,
  onClose,
}) => {
  const shopItems = [
    { id: 'torch', name: 'Torch Tinder (+3 Torch)', cost: 4, canBuy: player.gold >= 4 && player.torch < player.maxTorch },
    { id: 'potion', name: 'Healing Potion (+1 Pack)', cost: 6, canBuy: player.gold >= 6 && player.potions < 2 },
    { id: 'weapon', name: 'Runic Blade (+3 ATK)', cost: 12, canBuy: player.gold >= 12 && (!player.weapon || player.weapon.bonus < 3) },
    { id: 'armor', name: 'Knight Armor (+2 DEF)', cost: 10, canBuy: player.gold >= 10 && (!player.armor || player.armor.bonus < 2) },
    { id: 'revive', name: 'Phoenix Amulet (1x Revive)', cost: 18, canBuy: player.gold >= 18 && !player.hasRevive },
  ] as const;

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
      <div className="pixel-panel yellow" style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: 'var(--c-yellow)', marginBottom: '4px' }}>
          🛒 WANDERING MERCHANT'S WAGON 🛒
        </div>
        <div style={{ fontSize: '8px', color: '#9aa2b6', marginBottom: '12px' }}>
          "Coins speak louder than steel down here, traveler."
        </div>

        <div style={{ fontSize: '9px', color: 'var(--c-yellow)', marginBottom: '12px' }}>
          YOUR PURSE: {player.gold} GOLD
        </div>

        {/* Shop Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {shopItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#161922',
                padding: '8px 10px',
                border: '2px solid #2d3446',
                fontSize: '8px',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'var(--c-white)' }}>{item.name}</div>
                <div style={{ color: 'var(--c-yellow)' }}>COST: {item.cost} GOLD</div>
              </div>

              <button
                onClick={() => {
                  onBuyItem(item.id, item.cost);
                }}
                disabled={!item.canBuy}
                className="pixel-btn btn-green"
                style={{ fontSize: '8px', padding: '4px 8px' }}
              >
                BUY
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="pixel-btn btn-green"
          style={{ width: '100%', padding: '10px', fontSize: '10px' }}
        >
          CONTINUE EXPEDITION ▶
        </button>
      </div>
    </div>
  );
};
