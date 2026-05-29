export type Direction = 'top' | 'right' | 'bottom' | 'left';

export type PanelType =
  | 'straight_h'  // ─
  | 'straight_v'  // │
  | 'curve_tr'    // └  top + right
  | 'curve_tl'    // ┘  top + left
  | 'curve_br'    // ┌  bottom + right
  | 'curve_bl'    // ┐  bottom + left
  | 'tee_v'       // ├  top + right + bottom
  | 'tee_v_inv'   // ┤  top + left + bottom
  | 'tee_h'       // ┬  left + right + bottom
  | 'tee_h_inv'   // ┴  left + right + top
  | 'cross';      // ┼  all four

export interface Panel {
  id: number;
  type: PanelType;
}

// Board[row][col] — null は空きスペース
export type Cell = Panel | null;
export type Board = Cell[][];

export interface ClockState {
  row: number;
  col: number;
  entryDir: Direction;
  exitDir: Direction;
  progress: number; // 0.0 → 1.0（パネル内進行度）
  speed: number;    // 1フレームあたりの progress 増分
}

export type GamePhase = 'idle' | 'playing' | 'gameover';

export interface GameState {
  board: Board;
  emptyCell: { row: number; col: number };
  clock: ClockState;
  phase: GamePhase;
  score: number;
  speedMultiplier: number; // 速度倍率（1.0 = ふつう）
}
