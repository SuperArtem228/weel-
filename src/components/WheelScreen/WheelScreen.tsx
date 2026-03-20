import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import Wheel from '../Wheel/Wheel';
import type { WheelRef } from '../Wheel/Wheel';
import FloatingProps from '../FloatingProps/FloatingProps';
import type { GameState, AttemptOutcome } from '../../config/outcomes';
import './WheelScreen.css';

interface WheelScreenProps {
  gameState: GameState;
  currentAttempt: number;
  lastResult: AttemptOutcome | null;
  isSpinning: boolean;
  onSpin: () => void;
  onSpinComplete: () => void;
  onAcknowledge: () => void;
  currentOutcome: AttemptOutcome;
}

export default function WheelScreen({
  gameState,
  currentAttempt,
  lastResult,
  isSpinning,
  onSpin,
  onSpinComplete,
  onAcknowledge,
  currentOutcome,
}: WheelScreenProps) {
  const wheelRef = useRef<WheelRef>(null);
  const resultOverlayRef = useRef<HTMLDivElement>(null);

  const isReady = gameState.startsWith('ready_');
  const isResult = gameState.startsWith('result_');
  const canSpin = isReady && !isSpinning;

  const handleSpin = () => {
    if (!canSpin) return;
    onSpin();
  };

  // Trigger wheel animation when state enters spin
  useEffect(() => {
    if (!gameState.startsWith('spin_') || !wheelRef.current) return;
    wheelRef.current.spin(currentOutcome.sectorId, currentAttempt, onSpinComplete);
  }, [gameState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Animate result overlay appearance
  useEffect(() => {
    if (isResult && resultOverlayRef.current) {
      gsap.fromTo(
        resultOverlayRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.4)' }
      );
    }
  }, [isResult]);

  const attemptsRemaining = 3 - (currentAttempt + (isResult ? 1 : 0));

  return (
    <div className="wheel-screen">
      {/* Background diagonal lines */}
      <div className="ws-bg-lines" />

      <FloatingProps variant="wheel" />

      {/* Top tabs */}
      <div className="ws-tabs">
        <button className="ws-tab ws-tab-active">
          <span className="ws-tab-icon">🎰</span>
          КАЗИНО
        </button>
        <button className="ws-tab">
          <span className="ws-tab-icon">⚽</span>
          СПОРТ
        </button>
      </div>

      {/* Header */}
      <div className="ws-header">
        <p className="ws-header-sub">У вас 3 попытки</p>
        <h1 className="ws-header-title">Испытайте шанс на реванш</h1>
      </div>

      {/* Attempts indicator */}
      <div className="ws-attempts">
        {[0, 1, 2].map(i => {
          const isCompleted = i < currentAttempt || (i === currentAttempt && isResult);
          const isCurrent = i === currentAttempt && !isResult;
          return (
            <div
              key={i}
              className={`ws-attempt-dot ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''} ${isCurrent && isSpinning ? 'spinning' : ''}`}
            >
              {isCompleted ? '✓' : i + 1}
            </div>
          );
        })}
        <span className="ws-attempts-text">
          {isSpinning
            ? 'Крутим...'
            : isResult
            ? `+${lastResult?.rewardLabel}`
            : `Попытка ${currentAttempt + 1} из 3`}
        </span>
      </div>

      {/* The wheel */}
      <div className="ws-wheel-wrapper">
        <Wheel
          ref={wheelRef}
          disabled={!canSpin}
          onCenterClick={handleSpin}
        />
      </div>

      {/* Result overlay (after spin 1 or 2) */}
      {isResult && lastResult && (
        <div className="ws-result-overlay" ref={resultOverlayRef}>
          <div className="ws-result-card">
            <div className="ws-result-glow" />
            <div className="ws-result-label">Ваш выигрыш</div>
            <div className="ws-result-value">{lastResult.rewardLabel}</div>
            <div className="ws-result-type">
              {lastResult.rewardType === 'freespins' ? 'Фриспинов' : 'На депозит'}
            </div>
            <div className="ws-result-remaining">
              {attemptsRemaining === 1
                ? 'Осталась последняя попытка!'
                : `Осталось ${attemptsRemaining} попытки`}
            </div>
            <button className="ws-result-btn" onClick={onAcknowledge}>
              ПРОДОЛЖИТЬ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
