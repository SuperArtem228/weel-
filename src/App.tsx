import WheelScreen from './components/WheelScreen/WheelScreen';
import FinalOffer from './components/FinalOffer/FinalOffer';
import { useWheelGame } from './hooks/useWheelGame';
import './global.css';

export default function App() {
  const game = useWheelGame();

  const isFinalOffer =
    game.gameState === 'final_offer_reveal' ||
    game.gameState === 'final_offer_hold';

  if (isFinalOffer) {
    return (
      <FinalOffer
        onRegister={() => {
          console.log('Register clicked');
        }}
        onReady={game.transitionToFinalHold}
      />
    );
  }

  return (
    <WheelScreen
      gameState={game.gameState}
      currentAttempt={game.currentAttempt}
      lastResult={game.lastResult}
      isSpinning={game.isSpinning}
      onSpin={game.startSpin}
      onSpinComplete={game.onSpinComplete}
      onAcknowledge={game.acknowledgeResult}
      currentOutcome={game.currentOutcome}
    />
  );
}
