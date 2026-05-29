import { useReducer, useCallback } from 'react';
import type { GameState } from '../types/game';
import { createInitialBoard, INITIAL_CLOCK, INITIAL_EMPTY_CELL } from '../data/initialBoard';
import { slidePanel, canSlide } from '../logic/boardLogic';
import { advanceClock } from '../logic/pathLogic';
import { calcScore, speedForLevel } from '../logic/clockLogic';

type Action =
  | { type: 'START' }
  | { type: 'SLIDE'; targetRow: number; targetCol: number }
  | { type: 'TICK' }
  | { type: 'RESET' }
  | { type: 'SET_SPEED'; multiplier: number };

function makeInitialState(): GameState {
  return {
    board: createInitialBoard(),
    emptyCell: INITIAL_EMPTY_CELL,
    clock: INITIAL_CLOCK,
    phase: 'idle',
    score: 0,
    speedMultiplier: 1,
  };
}

// スコアに応じてレベルを計算
function levelFromScore(score: number): number {
  return Math.floor(score / 100) + 1;
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START': {
      return { ...makeInitialState(), phase: 'playing', speedMultiplier: state.speedMultiplier };
    }

    case 'SLIDE': {
      if (state.phase !== 'playing') return state;
      const { targetRow, targetCol } = action;
      const { emptyCell, board } = state;

      if (!canSlide(board, targetRow, targetCol, emptyCell.row, emptyCell.col)) {
        return state;
      }

      const { board: newBoard, emptyCell: newEmpty } = slidePanel(
        board,
        targetRow,
        targetCol,
        emptyCell.row,
        emptyCell.col,
      );

      return { ...state, board: newBoard, emptyCell: newEmpty };
    }

    case 'TICK': {
      if (state.phase !== 'playing') return state;

      const level = levelFromScore(state.score);
      const clockWithSpeed = { ...state.clock, speed: speedForLevel(level, state.speedMultiplier) };
      const { state: newClock, gameover } = advanceClock(state.board, clockWithSpeed);

      if (gameover) {
        return { ...state, clock: newClock, phase: 'gameover' };
      }

      // パネルを横断したかどうか（row か col が変わった）
      const crossed =
        newClock.row !== state.clock.row || newClock.col !== state.clock.col;

      const newScore = crossed ? calcScore(state.score, level) : state.score;

      return { ...state, clock: newClock, score: newScore };
    }

    case 'RESET': {
      return { ...makeInitialState(), speedMultiplier: state.speedMultiplier };
    }

    case 'SET_SPEED': {
      return { ...state, speedMultiplier: action.multiplier };
    }
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState);

  const start    = useCallback(() => dispatch({ type: 'START' }), []);
  const reset    = useCallback(() => dispatch({ type: 'RESET' }), []);
  const tick     = useCallback(() => dispatch({ type: 'TICK'  }), []);
  const slide    = useCallback(
    (targetRow: number, targetCol: number) =>
      dispatch({ type: 'SLIDE', targetRow, targetCol }),
    [],
  );
  const setSpeed = useCallback(
    (multiplier: number) => dispatch({ type: 'SET_SPEED', multiplier }),
    [],
  );

  return { state, start, reset, tick, slide, setSpeed };
}
