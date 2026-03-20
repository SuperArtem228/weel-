import { useState, useCallback } from 'react';
import type { GameState, AttemptOutcome } from '../config/outcomes';
import { FIXED_OUTCOMES } from '../config/outcomes';

export interface WheelGameState {
  gameState: GameState;
  currentAttempt: number; // 0, 1, 2
  lastResult: AttemptOutcome | null;
  isSpinning: boolean;
}

export function useWheelGame() {
  const [state, setState] = useState<WheelGameState>({
    gameState: 'ready_attempt_1',
    currentAttempt: 0,
    lastResult: null,
    isSpinning: false,
  });

  const startSpin = useCallback(() => {
    const attemptIndex = state.currentAttempt;
    if (attemptIndex > 2 || state.isSpinning) return;

    const spinState = `spin_${attemptIndex + 1}` as GameState;
    setState(prev => ({
      ...prev,
      gameState: spinState,
      isSpinning: true,
      lastResult: FIXED_OUTCOMES[attemptIndex],
    }));
  }, [state.currentAttempt, state.isSpinning]);

  const onSpinComplete = useCallback(() => {
    const attemptIndex = state.currentAttempt;

    if (attemptIndex === 2) {
      // Third attempt -> final offer
      setState(prev => ({
        ...prev,
        gameState: 'final_offer_reveal',
        isSpinning: false,
      }));
      return;
    }

    const resultState = `result_${attemptIndex + 1}` as GameState;
    setState(prev => ({
      ...prev,
      gameState: resultState,
      isSpinning: false,
    }));
  }, [state.currentAttempt]);

  const acknowledgeResult = useCallback(() => {
    const nextAttempt = state.currentAttempt + 1;
    const readyState = `ready_attempt_${nextAttempt + 1}` as GameState;
    setState(prev => ({
      ...prev,
      gameState: readyState,
      currentAttempt: nextAttempt,
      lastResult: null,
    }));
  }, [state.currentAttempt]);

  const transitionToFinalHold = useCallback(() => {
    setState(prev => ({
      ...prev,
      gameState: 'final_offer_hold',
    }));
  }, []);

  return {
    ...state,
    startSpin,
    onSpinComplete,
    acknowledgeResult,
    transitionToFinalHold,
    currentOutcome: FIXED_OUTCOMES[state.currentAttempt],
  };
}
