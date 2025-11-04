import { useGameStore } from '../store/gameStore';
import './GameControls.css';

export function GameControls() {
  const saveGame = useGameStore(state => state.saveGame);
  const loadGame = useGameStore(state => state.loadGame);
  const resetGame = useGameStore(state => state.resetGame);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the game? This cannot be undone.')) {
      resetGame();
    }
  };

  return (
    <div className="game-controls panel">
      <button className="control-btn" onClick={saveGame}>
        💾 Save
      </button>
      <button className="control-btn" onClick={loadGame}>
        📂 Load
      </button>
      <button className="control-btn danger" onClick={handleReset}>
        🔄 Reset
      </button>
    </div>
  );
}
