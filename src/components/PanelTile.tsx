import { motion } from 'framer-motion';
import type { Panel } from '../types/game';
import { TRACK_PATHS, PANEL_SIZE } from '../data/panelDefinitions';

const TILE_SIZE = PANEL_SIZE; // 100px（SVG座標系）

interface Props {
  panel: Panel;
  row: number;
  col: number;
  isActive: boolean; // 時計が乗っているパネル
  onClick: () => void;
}

export function PanelTile({ panel, row, col, isActive, onClick }: Props) {
  const paths = TRACK_PATHS[panel.type];

  return (
    <motion.div
      layout
      layoutId={`panel-${panel.id}`}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      onClick={onClick}
      style={{
        gridRow: row + 1,
        gridColumn: col + 1,
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <svg
        viewBox={`0 0 ${TILE_SIZE} ${TILE_SIZE}`}
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      >
        {/* パネル背景 */}
        <rect
          x={0}
          y={0}
          width={TILE_SIZE}
          height={TILE_SIZE}
          fill={isActive ? '#f0e8c0' : '#e8ddb0'}
          stroke="#b09060"
          strokeWidth={2}
          rx={4}
        />

        {/* 道（トラック） */}
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="#a0784a"
            stroke="#7a5830"
            strokeWidth={1}
          />
        ))}

        {/* 道の中心線（デコレーション） */}
        {paths.map((d, i) => (
          <path
            key={`center-${i}`}
            d={d}
            fill="none"
            stroke="#c8a464"
            strokeWidth={2}
            strokeDasharray="4 4"
            opacity={0.5}
          />
        ))}
      </svg>
    </motion.div>
  );
}
