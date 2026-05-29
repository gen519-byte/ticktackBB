import type { Board, ClockState, Direction } from '../types/game';
import { PATH_THROUGH, OPENINGS, DIR_DELTA, OPPOSITE } from '../data/panelDefinitions';
import { getCell } from './boardLogic';

// 時計が次のパネルへ移動できるか判定し、できれば新しいClockStateを返す
// 戻り値:
//   { ok: true, next } → 次パネルに移動可能
//   { ok: false }      → ゲームオーバー（道切れ or 盤面外）
export function resolveNextPanel(
  board: Board,
  clock: ClockState,
): { ok: true; next: ClockState } | { ok: false } {
  const { row, col, exitDir } = clock;
  const delta = DIR_DELTA[exitDir];
  const nextRow = row + delta.dr;
  const nextCol = col + delta.dc;

  // 盤面外チェック
  if (nextRow < 0 || nextRow >= 4 || nextCol < 0 || nextCol >= 4) {
    return { ok: false };
  }

  const nextCell = getCell(board, nextRow, nextCol);

  // 空きスペースへの進入 → ゲームオーバー
  if (!nextCell) return { ok: false };

  // 入り方向 = 出てきた辺の対辺
  const entryDir: Direction = OPPOSITE[exitDir];

  // 次パネルに入り口があるか
  if (!OPENINGS[nextCell.type].includes(entryDir)) {
    return { ok: false };
  }

  // 出口方向を決定
  const nextExitDir = PATH_THROUGH[nextCell.type][entryDir];
  if (!nextExitDir) return { ok: false };

  return {
    ok: true,
    next: {
      row: nextRow,
      col: nextCol,
      entryDir,
      exitDir: nextExitDir,
      progress: 0,
      speed: clock.speed,
    },
  };
}

// 現在のパネルで progress が 1.0 を超えたら次パネルへ遷移を試みる
// 戻り値:
//   { state: ClockState; gameover: boolean }
export function advanceClock(
  board: Board,
  clock: ClockState,
): { state: ClockState; gameover: boolean } {
  const newProgress = clock.progress + clock.speed;

  if (newProgress < 1.0) {
    return { state: { ...clock, progress: newProgress }, gameover: false };
  }

  // パネルを横断しきった → 次パネルへ
  const result = resolveNextPanel(board, clock);
  if (!result.ok) {
    return { state: clock, gameover: true };
  }

  // 繰り越し分を加算（progress が 1.0 を超えた余り）
  const overflow = newProgress - 1.0;
  return {
    state: { ...result.next, progress: overflow },
    gameover: false,
  };
}

// 時計のピクセル座標を計算する（パネルサイズ = panelPx）
// entryDir と exitDir からパネル内の軌跡を求める
export function calcClockPixelPos(
  clock: ClockState,
  panelPx: number,
): { x: number; y: number } {
  const { row, col, entryDir, exitDir, progress } = clock;
  const half = panelPx / 2;

  // パネル左上の絶対座標
  const originX = col * panelPx;
  const originY = row * panelPx;

  // エントリ点とエグジット点（パネル内ローカル座標）
  const entry = edgePoint(entryDir, half);
  const exit  = edgePoint(exitDir,  half);

  // 直線 or 曲線の補間
  let localX: number;
  let localY: number;

  const isStraight =
    entryDir === OPPOSITE[exitDir]; // 対辺ならば直線

  if (isStraight) {
    localX = lerp(entry.x, exit.x, progress);
    localY = lerp(entry.y, exit.y, progress);
  } else {
    // 四半円弧補間
    const arc = arcInterpolate(entry, exit, half, progress);
    localX = arc.x;
    localY = arc.y;
  }

  return {
    x: originX + localX,
    y: originY + localY,
  };
}

// 辺の中点ローカル座標
function edgePoint(dir: Direction, half: number): { x: number; y: number } {
  switch (dir) {
    case 'top':    return { x: half, y: 0      };
    case 'bottom': return { x: half, y: half*2 };
    case 'left':   return { x: 0,    y: half   };
    case 'right':  return { x: half*2, y: half };
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// 四半円弧補間：コーナー中心を求めて角度補間
function arcInterpolate(
  entry: { x: number; y: number },
  exit: { x: number; y: number },
  half: number,
  t: number,
): { x: number; y: number } {
  // コーナー中心 = entry と exit の各軸成分を入れ替えた点
  const cx = entry.x === half ? exit.x  : entry.x;
  const cy = entry.y === half ? exit.y  : entry.y;

  const startAngle = Math.atan2(entry.y - cy, entry.x - cx);
  const endAngle   = Math.atan2(exit.y  - cy, exit.x  - cx);

  // 最短回転方向（±π以内）
  let delta = endAngle - startAngle;
  if (delta > Math.PI)  delta -= 2 * Math.PI;
  if (delta < -Math.PI) delta += 2 * Math.PI;

  const angle = startAngle + delta * t;
  const radius = Math.sqrt((entry.x - cx) ** 2 + (entry.y - cy) ** 2);

  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}
