import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GameState } from '../types/game';
import { PanelTile } from './PanelTile';
import { ClockPiece } from './ClockPiece';

interface Props {
  state: GameState;
  onSlide: (row: number, col: number) => void;
}

const GRID_SIZE = 4;

export function GameBoard({ state, onSlide }: Props) {
  const { board, clock, phase } = state;
  const containerRef = useRef<HTMLDivElement>(null);
  const [panelPx, setPanelPx] = useState(100);

  // パネルの実際のピクセルサイズを取得
  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPanelPx(rect.width / GRID_SIZE);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        width: '100%',
        aspectRatio: '1 / 1',
        backgroundColor: '#6b4f2a',
        borderRadius: 8,
        padding: 4,
        gap: 3,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* パネルタイル */}
      {board.map((rowArr, r) =>
        rowArr.map((cell, c) => {
          if (!cell) {
            // 空きスペース
            return (
              <div
                key={`empty-${r}-${c}`}
                style={{
                  gridRow: r + 1,
                  gridColumn: c + 1,
                  backgroundColor: '#3a2a1a',
                  borderRadius: 4,
                }}
              />
            );
          }
          return (
            <PanelTile
              key={cell.id}
              panel={cell}
              row={r}
              col={c}
              isActive={phase === 'playing' && clock.row === r && clock.col === c}
              onClick={() => onSlide(r, c)}
            />
          );
        }),
      )}

      {/* 時計駒（playing中のみ） */}
      {phase === 'playing' && (
        <ClockPiece clock={clock} panelPx={panelPx} />
      )}

      {/* ゲームオーバー時の時計（最後の位置で点滅） */}
      {phase === 'gameover' && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(180,0,0,0.2)',
            borderRadius: 8,
            pointerEvents: 'none',
          }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
}
