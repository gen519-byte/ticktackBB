import type { Board, ClockState } from '../types/game';
import { PANEL_POOL } from './panelDefinitions';
import type { PanelType } from '../types/game';

// Fisher-Yates シャッフル
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let _nextId = 1;

// 初期盤面を生成する
// - 空きスペースは右下 (3,3)
// - (0,0) は時計のスタートパネル（水平直線）固定
// - それ以外はシャッフルしたプールから配置
export function createInitialBoard(): Board {
  _nextId = 1;
  const pool = shuffle([...PANEL_POOL]);

  const board: Board = Array.from({ length: 4 }, () => Array(4).fill(null));

  // (0,0) にスタートパネル（水平直線）を固定配置
  board[0][0] = { id: _nextId++, type: 'straight_h' };

  let poolIdx = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (r === 0 && c === 0) continue; // スタートパネル済み
      if (r === 3 && c === 3) continue; // 空きスペース
      const type = pool[poolIdx++ % pool.length] as PanelType;
      board[r][c] = { id: _nextId++, type };
    }
  }

  return board;
}

// 初期時計状態
// (0,0) の水平直線パネルを左端から進む
export const INITIAL_CLOCK: ClockState = {
  row: 0,
  col: 0,
  entryDir: 'left',
  exitDir: 'right',
  progress: 0,
  speed: 0.00133, // 1フレームあたり0.133% 進む（~750フレームでパネル横断）
};

export const INITIAL_EMPTY_CELL = { row: 3, col: 3 };
