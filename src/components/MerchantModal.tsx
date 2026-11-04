import React, { useState } from 'react';
import { PlayerState } from '../types';
import {
  MERCHANT_ITEMS,
  MerchantItemId,
  calculateMerchantTotalCost,
  isMerchantItemEligible,
} from '../utils/rules';

interface MerchantModalProps {
  player: PlayerState;
  onContinueExpedition: (selectedItemIds: MerchantItemId[]) => void;
}

export const MerchantModal: React.FC<MerchantModalProps> = ({
  player,
  onContinueExpedition,
}) => {
  const [selectedItemIds, setSelectedItemIds] = useState<MerchantItemId[]>([]);

  const totalCost = calculateMerchantTotalCost(selectedItemIds);
  const remainingGold = player.gold - totalCost;

  const handleToggleItem = (itemId: MerchantItemId) => {
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
      return;
    }

    const item = MERCHANT_ITEMS.find((i) => i.id === itemId);
    if (!item) return;

    const { eligible } = isMerchantItemEligible(item, player);
    if (!eligible) return;

    if (remainingGold < item.cost) return;

    setSelectedItemIds([...selectedItemIds, itemId]);
  };

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
      <div className="pixel-panel yellow" style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--c-yellow)', marginBottom: '4px', letterSpacing: '1px' }}>
          🛒 WANDERING MERCHANT 🛒
        </div>
        <div style={{ fontSize: '8px', color: '#9aa2b6', marginBottom: '8px' }}>
          "Coins speak louder than steel down here, traveler."
        </div>
        <div style={{ fontSize: '7px', color: '#77849e', marginBottom: '12px' }}>
          Select items to purchase. Choices lock in upon continuing.
        </div>

        {/* Purse & Cost Calculation Ledger */}
        <div
          style={{
            backgroundColor: '#121622',
            border: '2px solid #2d3446',
            padding: '8px 10px',
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '8px',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#9aa2b6', marginBottom: '2px' }}>PURSE</div>
            <div style={{ color: 'var(--c-yellow)', fontWeight: 'bold' }}>{player.gold} GOLD</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#9aa2b6', marginBottom: '2px' }}>TOTAL COST</div>
            <div style={{ color: totalCost > 0 ? 'var(--c-cyan)' : 'var(--c-white)', fontWeight: 'bold' }}>
              {totalCost} GOLD
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#9aa2b6', marginBottom: '2px' }}>REMAINING</div>
            <div
              style={{
                color: remainingGold === 0 && totalCost > 0 ? 'var(--c-green)' : 'var(--c-yellow)',
                fontWeight: 'bold',
              }}
            >
              {remainingGold} GOLD
            </div>
          </div>
        </div>

        {/* Shop Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {MERCHANT_ITEMS.map((item) => {
            const isSelected = selectedItemIds.includes(item.id);
            const { eligible, reason } = isMerchantItemEligible(item, player);
            const canAfford = remainingGold >= item.cost;
            const isSelectable = !isSelected && eligible && canAfford;
            const isInteractive = isSelected || isSelectable;

            let buttonLabel = '+ SELECT';
            let buttonClass = 'pixel-btn';
            let isDisabled = false;

            if (isSelected) {
              buttonLabel = '✓ SELECTED';
              buttonClass = 'pixel-btn btn-green';
            } else if (!eligible) {
              buttonLabel = reason || 'UNAVAILABLE';
              isDisabled = true;
            } else if (!canAfford) {
              buttonLabel = `NEED ${item.cost}G`;
              isDisabled = true;
            }

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isInteractive) {
                    handleToggleItem(item.id);
                  }
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: isSelected ? '#15261d' : '#161922',
                  padding: '8px 10px',
                  border: isSelected ? '2px solid var(--c-green)' : '2px solid #2d3446',
                  boxShadow: isSelected ? '0 0 6px rgba(0, 204, 68, 0.4)' : 'none',
                  fontSize: '8px',
                  cursor: isInteractive ? 'pointer' : 'default',
                  opacity: !eligible ? 0.5 : !isSelected && !canAfford ? 0.75 : 1,
                  transition: 'all 0.1s ease',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: isSelected ? 'var(--c-green)' : 'var(--c-white)', fontWeight: 'bold' }}>
                    {isSelected ? '✓ ' : ''}{item.name} ({item.detail})
                  </div>
                  <div style={{ color: 'var(--c-yellow)', marginTop: '2px' }}>
                    COST: {item.cost} GOLD
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isInteractive) {
                      handleToggleItem(item.id);
                    }
                  }}
                  disabled={isDisabled}
                  className={buttonClass}
                  style={{
                    fontSize: '8px',
                    padding: '5px 8px',
                    minWidth: '84px',
                  }}
                >
                  {buttonLabel}
                </button>
              </div>
            );
          })}
        </div>

        {/* Clear Selection helper if items selected */}
        {selectedItemIds.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <button
              onClick={() => setSelectedItemIds([])}
              style={{
                background: 'none',
                border: 'none',
                color: '#9aa2b6',
                fontSize: '7px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Continue Expedition - Locks in purchases */}
        <button
          onClick={() => onContinueExpedition(selectedItemIds)}
          className="pixel-btn btn-green"
          style={{ width: '100%', padding: '10px', fontSize: '9px' }}
        >
          {selectedItemIds.length > 0
            ? `CONTINUE EXPEDITION (BUY ${selectedItemIds.length} FOR ${totalCost}G) ▶`
            : `CONTINUE EXPEDITION ▶`}
        </button>
      </div>
    </div>
  );
};
