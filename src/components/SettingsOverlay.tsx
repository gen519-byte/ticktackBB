import { motion, AnimatePresence } from 'framer-motion';

// スライダーの段階と対応する倍率・ラベル
const SPEED_STEPS = [
  { multiplier: 0.33, label: 'ゆっくり' },
  { multiplier: 0.67, label: 'すこしゆっくり' },
  { multiplier: 1.0,  label: 'ふつう' },
  { multiplier: 1.67, label: 'はやい' },
  { multiplier: 2.5,  label: 'とても速い' },
];

// 倍率から最も近いステップインデックスを返す
export function multiplierToStep(m: number): number {
  let closest = 0;
  let minDist = Infinity;
  SPEED_STEPS.forEach(({ multiplier }, i) => {
    const d = Math.abs(multiplier - m);
    if (d < minDist) { minDist = d; closest = i; }
  });
  return closest;
}

interface Props {
  open: boolean;
  speedMultiplier: number;
  onChangeSpeed: (multiplier: number) => void;
  onClose: () => void;
}

export function SettingsOverlay({ open, speedMultiplier, onChangeSpeed, onClose }: Props) {
  const currentStep = multiplierToStep(speedMultiplier);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="settings"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.2 }}
          style={styles.backdrop}
        >
          <div style={styles.panel}>
            <div style={styles.title}>設定</div>

            <div style={styles.section}>
              <div style={styles.sectionLabel}>時計の移動速度</div>

              {/* スライダー */}
              <input
                type="range"
                min={0}
                max={SPEED_STEPS.length - 1}
                step={1}
                value={currentStep}
                onChange={e => onChangeSpeed(SPEED_STEPS[Number(e.target.value)].multiplier)}
                style={styles.slider}
              />

              {/* 段階ラベル */}
              <div style={styles.stepLabels}>
                {SPEED_STEPS.map(({ label }, i) => (
                  <span
                    key={i}
                    style={{
                      ...styles.stepLabel,
                      color: i === currentStep ? '#f5e0a0' : '#7a6040',
                      fontWeight: i === currentStep ? 'bold' : 'normal',
                    }}
                    onClick={() => onChangeSpeed(SPEED_STEPS[i].multiplier)}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <button style={styles.closeBtn} onClick={onClose}>
              とじる
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 12, 4, 0.85)',
    borderRadius: 8,
    zIndex: 30,
  },
  panel: {
    background: 'linear-gradient(160deg, #2d1c08, #1a0f04)',
    border: '1px solid #5a3a18',
    borderRadius: 12,
    padding: '28px 28px 24px',
    width: '85%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f5e0a0',
    letterSpacing: 4,
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#a08050',
    letterSpacing: 2,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    accentColor: '#c87830',
    cursor: 'pointer',
    height: 6,
  },
  stepLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  stepLabel: {
    fontSize: 10,
    cursor: 'pointer',
    letterSpacing: 0.5,
    userSelect: 'none',
    transition: 'color 0.15s',
    textAlign: 'center',
    flex: 1,
  },
  closeBtn: {
    marginTop: 4,
    padding: '8px 28px',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#c87830',
    color: '#fff8e8',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    letterSpacing: 2,
  },
};
