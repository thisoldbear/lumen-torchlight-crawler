import React from 'react';
import { PlayerState, Tile } from '../types';
import { RetroCard } from './RetroCard';
import { isOrthogonallyAdjacent } from '../utils/rules';

interface DungeonGridProps {
  grid: Tile[][];
  player: PlayerState;
  onEnterTile: (r: number, c: number, blind: boolean) => void;
  onScoutTile: (r: number, c: number) => void;
  onDescend: () => void;
}

export const DungeonGrid: React.FC<DungeonGridProps> = ({
  grid,
  player,
  onEnterTile,
  onScoutTile,
  onDescend,
}) => {
  const isAdjacent = (r: number, c: number) => {
    return isOrthogonallyAdjacent(player.position.r, player.position.c, r, c);
  };

  const isCurrent = (r: number, c: number) => {
    return player.position.r === r && player.position.c === c;
  };

  const currentTile = grid[player.position.r][player.position.c];
  const canDescend = currentTile.isStairs && currentTile.isCleared;

  return (
    <div className="pixel-panel yellow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '10px', fontSize: '9px', color: 'var(--c-yellow)', textAlign: 'center' }}>
        NAVIGATION: ORTHOGONAL 3x3 MAP (SELECT ADJACENT ROOM)
      </div>

      {/* 3x3 Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          justifyContent: 'center',
          maxWidth: '340px',
        }}
      >
        {grid.map((row, r) =>
          row.map((tile, c) => {
            const adjacent = isAdjacent(r, c);
            const current = isCurrent(r, c);

            return (
              <div key={`${r}-${c}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <RetroCard
                  card={tile.card}
                  isRevealed={tile.isRevealed}
                  isCleared={tile.isCleared}
                  isCurrent={current}
                  isAdjacent={adjacent}
                  onClick={() => {
                    if (adjacent) {
                      if (!tile.isRevealed) {
                        // Default to enter or scout
                        onEnterTile(r, c, true);
                      } else {
                        onEnterTile(r, c, false);
                      }
                    }
                  }}
                />

                {/* Tactical Actions for Adjacent Face-Down Tiles */}
                {adjacent && !tile.isRevealed && (
                  <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
                    <button
                      onClick={() => onScoutTile(r, c)}
                      disabled={player.torch <= 0}
                      className="pixel-btn btn-yellow"
                      style={{ padding: '3px 4px', fontSize: '6px' }}
                      title="Spend 1 Torch to peek"
                    >
                      👁️ SCOUT (-1🕯️)
                    </button>
                    <button
                      onClick={() => onEnterTile(r, c, true)}
                      className="pixel-btn btn-red"
                      style={{ padding: '3px 4px', fontSize: '6px' }}
                      title="Step blindly (Risk Ambush)"
                    >
                      🚪 BLIND
                    </button>
                  </div>
                )}

                {/* Tactical Action for Adjacent Revealed Unvisited Tile */}
                {adjacent && tile.isRevealed && !tile.isCleared && (
                  <button
                    onClick={() => onEnterTile(r, c, false)}
                    className="pixel-btn btn-green"
                    style={{ padding: '3px 6px', fontSize: '7px', marginTop: '4px' }}
                  >
                    ENTER ROOM
                  </button>
                )}

                {/* Tactical Action for Adjacent Cleared Tile */}
                {adjacent && tile.isCleared && (
                  <button
                    onClick={() => onEnterTile(r, c, false)}
                    className="pixel-btn"
                    style={{ padding: '3px 6px', fontSize: '7px', marginTop: '4px' }}
                  >
                    WALK THRU
                  </button>
                )}

                {/* Stairs Marker */}
                {tile.isStairs && (
                  <div style={{ fontSize: '7px', color: 'var(--c-cyan)', marginTop: '2px' }}>
                    ▼ STAIRS
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Descend to Next Floor Prompt */}
      {canDescend && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            onClick={onDescend}
            className="pixel-btn btn-green"
            style={{ fontSize: '11px', padding: '10px 18px', animation: 'pulseBorder 1s infinite' }}
          >
            🏰 DESCEND TO NEXT FLOOR ▼
          </button>
        </div>
      )}
    </div>
  );
};
