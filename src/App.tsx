import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { GameBoard } from './components/GameBoard';
import { GameOverlay } from './components/GameOverlay';
import { SettingsOverlay } from './components/SettingsOverlay';
import './styles/game.css';

export default function App() {
  const { state, start, reset, tick, slide, setSpeed } = useGameState();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // 設定画面が開いている間はゲームループを一時停止
  useGameLoop(state.phase, settingsOpen, tick);

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
          <button
            className="settings-btn"
            onClick={() => setSettingsOpen(v => !v)}
            aria-label="設定"
          >
            <SettingsIcon />
          </button>
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
          <SettingsOverlay
            open={settingsOpen}
            speedMultiplier={state.speedMultiplier}
            onChangeSpeed={setSpeed}
            onClose={() => setSettingsOpen(false)}
          />
        </div>
      </main>

      <footer className="app-footer">
        パネルをクリックしてスライド｜道をつなぎ続けよう
      </footer>
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
