import type { ClockState } from '../types/game';

// レベルと速度倍率に応じた速度を返す
export function speedForLevel(level: number, multiplier: number = 1): number {
  // レベル1×1倍: 0.00133 (750フレーム/パネル ≒ 12秒@60fps)
  // レベルが1上がるごとに10%増速、最大0.00667×倍率
  return Math.min(0.00133 * multiplier * 1.1 ** (level - 1), 0.00667 * multiplier);
}

// スコアを更新（パネル通過ごとに +10、レベル×ボーナス）
export function calcScore(currentScore: number, level: number): number {
  return currentScore + 10 * level;
}

// 速度を現在のレベルに合わせて更新
export function updateSpeed(clock: ClockState, level: number): ClockState {
  return { ...clock, speed: speedForLevel(level) };
}
