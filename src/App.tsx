import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { GameBoard } from './components/GameBoard';
import { GameOverlay } from './components/GameOverlay';
import './styles/game.css';

export default function App() {
  const { state, start, reset, tick, slide } = useGameState();

  useGameLoop(state.phase, tick);

  const level = Math.floor(state.score / 100) + 1;

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-title">チクタクバンバン</h1>
        <div className="app-stats">
          <div className="stat">
            <span className="stat-label">スコア</span>
            <span className="stat-value">{state.score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">レベル</span>
            <span className="stat-value">{level}</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="board-wrapper" style={{ position: 'relative' }}>
          <GameBoard state={state} onSlide={slide} />
          <GameOverlay
            phase={state.phase}
            score={state.score}
            onStart={start}
            onReset={reset}
          />
        </div>
      </main>

      <footer className="app-footer">
        パネルをクリックしてスライド｜道をつなぎ続けよう
      </footer>
    </div>
  );
}
