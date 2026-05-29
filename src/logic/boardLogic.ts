import type { Board, Cell } from '../types/game';

// 指定セルが空きスペースと同行または同列かを判定
export function canSlide(
  board: Board,
  targetRow: number,
  targetCol: number,
  emptyRow: number,
  emptyCol: number,
): boolean {
  if (board[targetRow][targetCol] === null) return false; // 空きスペース自身
  return targetRow === emptyRow || targetCol === emptyCol;
}

// スライド実行：targetCell → emptyCell 方向にパネル群を移動
// 戻り値：新しい盤面と新しい emptyCell 座標
export function slidePanel(
  board: Board,
  targetRow: number,
  targetCol: number,
  emptyRow: number,
  emptyCol: number,
): { board: Board; emptyCell: { row: number; col: number } } {
  const newBoard: Board = board.map(row => [...row]);

  if (targetRow === emptyRow) {
    // 同じ行 → 水平スライド
    const dir = targetCol < emptyCol ? -1 : 1; // 空きスペースから target 方向へ順に引き寄せる
    let c = emptyCol;
    while (c !== targetCol) {
      newBoard[targetRow][c] = newBoard[targetRow][c + dir];
      c += dir;
    }
    newBoard[targetRow][targetCol] = null;
  } else {
    // 同じ列 → 垂直スライド
    const dir = targetRow < emptyRow ? -1 : 1;
    let r = emptyRow;
    while (r !== targetRow) {
      newBoard[r][targetCol] = newBoard[r + dir][targetCol];
      r += dir;
    }
    newBoard[targetRow][targetCol] = null;
  }

  return {
    board: newBoard,
    emptyCell: { row: targetRow, col: targetCol },
  };
}

// スライド操作によって時計が乗っているパネルが動くかどうかを判定
// 水平スライド: 同じ行で target〜empty の範囲内に時計がいれば true
// 垂直スライド: 同じ列で target〜empty の範囲内に時計がいれば true
export function wouldMoveClock(
  targetRow: number,
  targetCol: number,
  emptyRow: number,
  emptyCol: number,
  clockRow: number,
  clockCol: number,
): boolean {
  if (targetRow === emptyRow) {
    if (clockRow !== targetRow) return false;
    const lo = Math.min(targetCol, emptyCol);
    const hi = Math.max(targetCol, emptyCol);
    return clockCol >= lo && clockCol <= hi;
  } else {
    if (clockCol !== targetCol) return false;
    const lo = Math.min(targetRow, emptyRow);
    const hi = Math.max(targetRow, emptyRow);
    return clockRow >= lo && clockRow <= hi;
  }
}

// 指定セルのパネルを取得（範囲外は undefined を返す）
export function getCell(board: Board, row: number, col: number): Cell | undefined {
  if (row < 0 || row >= 4 || col < 0 || col >= 4) return undefined;
  return board[row][col];
}

// 深いコピー（テスト用）
export function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)));
}
