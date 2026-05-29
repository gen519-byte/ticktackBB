# ticktackBB-app

名作ボードゲーム「チクタクバンバン」をベースにした、ブラウザで遊べるスライドパズルゲーム。

## 技術スタック

- **フレームワーク**: React + TypeScript (Vite)
- **アニメーション**: Framer Motion（時計の滑らかな移動・パネルのスライド）
- **ロジック**: 行列を用いた経路判定アルゴリズム

## ゲーム概要

### ルール
- 4×4のスライドパズル（15枚のパネル＋1つの空きスペース）
- パネルには直線・カーブ・十字など道が描かれている
- 「目覚まし時計」の駒が道に沿って一定速度で進み続ける
- 時計が道の切れ目や盤面外に出るとゲームオーバー
- プレイヤーはパネルをスライドさせて道をつなぎ続ける

### パネル種別

| 種別 | 記号 | 開口辺 |
|------|------|--------|
| `straight_h` | ─ | left, right |
| `straight_v` | │ | top, bottom |
| `curve_tr`   | └ | top, right |
| `curve_tl`   | ┘ | top, left |
| `curve_br`   | ┌ | bottom, right |
| `curve_bl`   | ┐ | bottom, left |
| `tee_v`      | ├ | top, right, bottom |
| `tee_v_inv`  | ┤ | top, left, bottom |
| `tee_h`      | ┬ | left, right, bottom |
| `tee_h_inv`  | ┴ | left, right, top |
| `cross`      | ┼ | top, right, bottom, left |

## ファイル構成

```
src/
├── types/
│   └── game.ts              # 全型定義（Panel, ClockState, GameState など）
├── data/
│   ├── panelDefinitions.ts  # OPENINGS / PATH_THROUGH テーブル
│   └── initialBoard.ts      # 初期盤面レイアウト
├── logic/
│   ├── boardLogic.ts        # スライド可否判定・盤面更新
│   ├── pathLogic.ts         # 経路判定・ゲームオーバー判定
│   └── clockLogic.ts        # 時計の進行・ピクセル座標変換
├── hooks/
│   ├── useGameState.ts      # useReducer によるゲーム状態管理
│   └── useGameLoop.ts       # requestAnimationFrame ループ
└── components/
    ├── GameBoard.tsx         # 4×4グリッド・クリックイベント配信
    ├── PanelTile.tsx         # SVGで道を描画、Framer Motion スライド
    ├── ClockPiece.tsx        # 時計アイコン、Framer Motion 位置補間
    └── GameOverlay.tsx       # スタート / ゲームオーバー画面
```

## 主要な型定義

```typescript
type Direction = 'top' | 'right' | 'bottom' | 'left';

interface Panel {
  id: number;
  type: PanelType;
  openings: Set<Direction>;
}

interface ClockState {
  row: number;        // 現在のパネル行 (0–3)
  col: number;        // 現在のパネル列 (0–3)
  entryDir: Direction;
  exitDir: Direction;
  progress: number;   // パネル内進行度 0.0 → 1.0
  speed: number;
}

type GamePhase = 'idle' | 'playing' | 'gameover';
```

## 経路判定アルゴリズム

`PATH_THROUGH[panel.type][entryDir]` を参照して exitDir を決定する。
`undefined` が返った場合は道なし → ゲームオーバー。

- **直線・カーブ**: 1対1マッピング（決定的）
- **T字路**: 対辺が開口していれば直進、なければ直角の開口辺へ
- **十字**: 常に直進

## コマンド

```bash
npm install       # 依存関係インストール
npm run dev       # 開発サーバー起動 (http://localhost:5173)
npm run build     # プロダクションビルド
npm run preview   # ビルド結果のプレビュー
npm run typecheck # 型チェック
```

## 開発メモ

- パネルの道は SVG の `<path>` で描画する
- 時計のピクセル座標計算: 直線は線形補間、カーブは円弧補間（`progress` を角度に変換）
- スライド操作は空きスペースと同行または同列のパネルのみ許可
- `useGameLoop` は `playing` フェーズ中のみ RAF を走らせる
