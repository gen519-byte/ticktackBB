import { motion, AnimatePresence } from 'framer-motion';
import type { GamePhase } from '../types/game';

interface Props {
  phase: GamePhase;
  score: number;
  onStart: () => void;
  onReset: () => void;
}

export function GameOverlay({ phase, score, onStart, onReset }: Props) {
  const visible = phase === 'idle' || phase === 'gameover';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(30, 20, 10, 0.82)',
            borderRadius: 8,
            zIndex: 20,
            gap: 16,
          }}
        >
          {phase === 'idle' ? (
            <>
              <div style={styles.title}>チクタクバンバン</div>
              <div style={styles.sub}>
                時計が道の切れ目に到達する前に
                <br />
                パネルをスライドして道をつなごう！
              </div>
              <button style={styles.btn} onClick={onStart}>
                ゲームスタート
              </button>
            </>
          ) : (
            <>
              <motion.div
                style={styles.gameoverTitle}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                チン！チン！チン！
              </motion.div>
              <div style={styles.scoreLabel}>スコア</div>
              <div style={styles.scoreValue}>{score}</div>
              <button style={styles.btn} onClick={onReset}>
                もう一度
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f5e0a0',
    textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
    letterSpacing: 4,
  },
  sub: {
    fontSize: 13,
    color: '#d0c090',
    textAlign: 'center',
    lineHeight: 1.8,
  },
  btn: {
    marginTop: 8,
    padding: '10px 32px',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#c87830',
    color: '#fff8e8',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
    letterSpacing: 2,
  },
  gameoverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6040',
    textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
    letterSpacing: 2,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#d0c090',
    letterSpacing: 2,
  },
  scoreValue: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#f5e0a0',
    lineHeight: 1,
  },
};
