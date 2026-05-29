import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import type { ClockState } from '../types/game';
import { calcClockPixelPos } from '../logic/pathLogic';

interface Props {
  clock: ClockState;
  panelPx: number; // 実際の表示上のパネルサイズ（px）
}

export function ClockPiece({ clock, panelPx }: Props) {
  const pos = calcClockPixelPos(clock, panelPx);

  const motionX = useMotionValue(pos.x);
  const motionY = useMotionValue(pos.y);

  // スプリングで滑らかに追従
  const springX = useSpring(motionX, { stiffness: 800, damping: 60 });
  const springY = useSpring(motionY, { stiffness: 800, damping: 60 });

  useEffect(() => {
    motionX.set(pos.x);
    motionY.set(pos.y);
  }, [pos.x, pos.y, motionX, motionY]);

  const size = panelPx * 0.38;

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* 時計SVG */}
      <svg viewBox="0 0 40 40" width="100%" height="100%">
        {/* 時計本体（円） */}
        <circle cx={20} cy={20} r={17} fill="#f5f0e0" stroke="#4a3a2a" strokeWidth={2.5} />
        {/* 文字盤 */}
        <circle cx={20} cy={20} r={14} fill="#fffdf5" stroke="#8a7050" strokeWidth={1} />
        {/* 時計の数字マーク（12,3,6,9時） */}
        <rect x={19} y={7} width={2} height={4} fill="#4a3a2a" rx={1} />
        <rect x={29} y={19} width={4} height={2} fill="#4a3a2a" rx={1} />
        <rect x={19} y={29} width={2} height={4} fill="#4a3a2a" rx={1} />
        <rect x={7} y={19} width={4} height={2} fill="#4a3a2a" rx={1} />
        {/* 時針 */}
        <line x1={20} y1={20} x2={20} y2={13} stroke="#2a1a0a" strokeWidth={2.5} strokeLinecap="round" />
        {/* 分針 */}
        <line x1={20} y1={20} x2={27} y2={18} stroke="#2a1a0a" strokeWidth={1.5} strokeLinecap="round" />
        {/* 中心点 */}
        <circle cx={20} cy={20} r={2} fill="#4a3a2a" />
        {/* アラームベル（上） */}
        <path d="M14 7 Q20 3 26 7" fill="none" stroke="#4a3a2a" strokeWidth={2} />
        <circle cx={14} cy={7} r={1.5} fill="#4a3a2a" />
        <circle cx={26} cy={7} r={1.5} fill="#4a3a2a" />
        {/* 足（下） */}
        <line x1={16} y1={36} x2={14} y2={39} stroke="#4a3a2a" strokeWidth={2} strokeLinecap="round" />
        <line x1={24} y1={36} x2={26} y2={39} stroke="#4a3a2a" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}
