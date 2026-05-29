import type { Direction, PanelType } from '../types/game';

// 各パネル種別の開口辺
export const OPENINGS: Record<PanelType, Direction[]> = {
  straight_h:  ['left', 'right'],
  straight_v:  ['top', 'bottom'],
  curve_tr:    ['top', 'right'],
  curve_tl:    ['top', 'left'],
  curve_br:    ['bottom', 'right'],
  curve_bl:    ['bottom', 'left'],
  tee_v:       ['top', 'right', 'bottom'],
  tee_v_inv:   ['top', 'left', 'bottom'],
  tee_h:       ['left', 'right', 'bottom'],
  tee_h_inv:   ['left', 'right', 'top'],
  cross:       ['top', 'right', 'bottom', 'left'],
};

// entryDir（入った辺）→ exitDir（出る辺）のマッピング
// T字路は「対辺優先で直進、対辺がなければ最初の分岐辺へ」ルール
export const PATH_THROUGH: Record<PanelType, Partial<Record<Direction, Direction>>> = {
  straight_h:  { left: 'right',  right: 'left'   },
  straight_v:  { top: 'bottom',  bottom: 'top'   },
  curve_tr:    { top: 'right',   right: 'top'    }, // └
  curve_tl:    { top: 'left',    left: 'top'     }, // ┘
  curve_br:    { bottom: 'right', right: 'bottom' }, // ┌
  curve_bl:    { bottom: 'left',  left: 'bottom'  }, // ┐
  tee_v:       { top: 'bottom',  bottom: 'top',   right: 'top'    }, // ├ 右から→上へ
  tee_v_inv:   { top: 'bottom',  bottom: 'top',   left: 'bottom'  }, // ┤ 左から→下へ
  tee_h:       { left: 'right',  right: 'left',   top: 'right'    }, // ┬ 上から→右へ
  tee_h_inv:   { left: 'right',  right: 'left',   bottom: 'left'  }, // ┴ 下から→左へ
  cross:       { top: 'bottom',  bottom: 'top',   left: 'right',  right: 'left' },
};

// SVGパス文字列（パネルサイズ = 100×100 座標系）
// 道幅は中心線から±8px
const R = 100;   // パネルサイズ
const C = R / 2; // パネル中心 = 50
const W = 8;     // 道の半幅
const CR = 28;   // カーブ内径（コーナー半径 = C - W = 42、以降 SVG arc で表現）

export const TRACK_PATHS: Record<PanelType, string[]> = {
  // 外側輪郭と内側輪郭を 2本の path で表現（fill で塗りつぶす）
  straight_h: [
    `M 0 ${C - W} L ${R} ${C - W} L ${R} ${C + W} L 0 ${C + W} Z`,
  ],
  straight_v: [
    `M ${C - W} 0 L ${C + W} 0 L ${C + W} ${R} L ${C - W} ${R} Z`,
  ],
  // curve_tr: └ 形  top + right
  curve_tr: [
    `M ${C - W} 0 L ${C + W} 0 L ${C + W} ${C - W} L ${R} ${C - W} L ${R} ${C + W} L ${C - W} ${C + W} Z`,
  ],
  // curve_tl: ┘ 形  top + left
  curve_tl: [
    `M ${C - W} 0 L ${C + W} 0 L ${C + W} ${C + W} L ${R} ${C + W} L ${R} ${C - W}`,
    // 左から閉じる
    `M ${C - W} 0 L ${C - W} ${C + W} L 0 ${C + W} L 0 ${C - W} L ${C + W} ${C - W} L ${C + W} 0 Z`,
  ],
  // curve_br: ┌ 形  bottom + right
  curve_br: [
    `M ${C - W} ${R} L ${C + W} ${R} L ${C + W} ${C + W} L ${R} ${C + W} L ${R} ${C - W} L ${C - W} ${C - W} Z`,
  ],
  // curve_bl: ┐ 形  bottom + left
  curve_bl: [
    `M ${C - W} ${R} L ${C + W} ${R} L ${C + W} ${C - W} L 0 ${C - W} L 0 ${C + W} L ${C - W} ${C + W} Z`,
  ],
  // tee_v: ├  top + right + bottom
  tee_v: [
    `M ${C - W} 0 L ${C + W} 0 L ${C + W} ${C - W} L ${R} ${C - W} L ${R} ${C + W} L ${C + W} ${C + W} L ${C + W} ${R} L ${C - W} ${R} Z`,
  ],
  // tee_v_inv: ┤  top + left + bottom
  tee_v_inv: [
    `M ${C - W} 0 L ${C + W} 0 L ${C + W} ${R} L ${C - W} ${R} L ${C - W} ${C + W} L 0 ${C + W} L 0 ${C - W} L ${C - W} ${C - W} Z`,
  ],
  // tee_h: ┬  left + right + bottom
  tee_h: [
    `M 0 ${C - W} L ${C - W} ${C - W} L ${C - W} 0 L ${C + W} 0 L ${C + W} ${C - W} L ${R} ${C - W} L ${R} ${C + W} L 0 ${C + W} Z`,
  ],
  // tee_h_inv: ┴  left + right + top
  tee_h_inv: [
    `M 0 ${C - W} L ${R} ${C - W} L ${R} ${C + W} L ${C + W} ${C + W} L ${C + W} ${R} L ${C - W} ${R} L ${C - W} ${C + W} L 0 ${C + W} Z`,
  ],
  // cross: ┼
  cross: [
    `M ${C - W} 0 L ${C + W} 0 L ${C + W} ${C - W} L ${R} ${C - W} L ${R} ${C + W} L ${C + W} ${C + W} L ${C + W} ${R} L ${C - W} ${R} L ${C - W} ${C + W} L 0 ${C + W} L 0 ${C - W} L ${C - W} ${C - W} Z`,
  ],
};

// 対辺マップ
export const OPPOSITE: Record<Direction, Direction> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

// 方向 → 数値（行列の差分）
export const DIR_DELTA: Record<Direction, { dr: number; dc: number }> = {
  top:    { dr: -1, dc:  0 },
  bottom: { dr:  1, dc:  0 },
  left:   { dr:  0, dc: -1 },
  right:  { dr:  0, dc:  1 },
};

// パネルごとの曲線パスを生成するパラメータ（アニメーション用）
// straight: 直線補間  curve: 四半円弧補間
export type PathShape = 'straight' | 'curve_cw' | 'curve_ccw';

export const PATH_SHAPE: Record<PanelType, PathShape> = {
  straight_h:  'straight',
  straight_v:  'straight',
  curve_tr:    'curve_cw',   // └
  curve_tl:    'curve_ccw',  // ┘
  curve_br:    'curve_ccw',  // ┌
  curve_bl:    'curve_cw',   // ┐
  tee_v:       'straight',
  tee_v_inv:   'straight',
  tee_h:       'straight',
  tee_h_inv:   'straight',
  cross:       'straight',
};

// T字・十字で entryDir が直線方向か否か
export function isStraightThrough(type: PanelType, entry: Direction): boolean {
  const exit = PATH_THROUGH[type][entry];
  if (!exit) return false;
  return exit === OPPOSITE[entry];
}

// 各パネルのラベル（デバッグ用）
export const PANEL_LABEL: Record<PanelType, string> = {
  straight_h: '─', straight_v: '│',
  curve_tr: '└', curve_tl: '┘', curve_br: '┌', curve_bl: '┐',
  tee_v: '├', tee_v_inv: '┤', tee_h: '┬', tee_h_inv: '┴',
  cross: '┼',
};

// ゲームで使用するパネルプール（枚数バランス）
export const PANEL_POOL: PanelType[] = [
  'straight_h', 'straight_h', 'straight_h',
  'straight_v', 'straight_v', 'straight_v',
  'curve_tr', 'curve_tr',
  'curve_tl', 'curve_tl',
  'curve_br', 'curve_br',
  'curve_bl', 'curve_bl',
  'cross',
];

// R, C, W, CR を他モジュールでも使えるようエクスポート
export { R as PANEL_SIZE, C as PANEL_CENTER, W as TRACK_HALF_WIDTH, CR as CURVE_INNER_R };
