import { useEffect, useRef } from 'react';
import type { GamePhase } from '../types/game';

// requestAnimationFrame ループを管理する
// playing フェーズ中かつ paused=false のときのみループを走らせる
export function useGameLoop(phase: GamePhase, paused: boolean, onTick: () => void): void {
  const rafRef = useRef<number>(0);
  const onTickRef = useRef(onTick);

  // 最新の onTick を ref に保持（古いクロージャの問題を回避）
  useEffect(() => {
    onTickRef.current = onTick;
  });

  useEffect(() => {
    if (phase !== 'playing' || paused) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    let running = true;

    function loop() {
      if (!running) return;
      onTickRef.current();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [phase, paused]);
}
