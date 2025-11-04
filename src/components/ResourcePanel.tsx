import { useGameStore } from '../store/gameStore';
import './ResourcePanel.css';

export function ResourcePanel() {
  const resources = useGameStore(state => state.resources);

  return (
    <div className="resource-panel panel">
      <h3>Resources</h3>
      <div className="resource-grid">
        {Object.entries(resources).map(([resource, amount]) => (
          <div key={resource} className="resource-item">
            <span className="resource-name">{resource}</span>
            <span className="resource-amount">{Math.floor(amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
