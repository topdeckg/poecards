import { useGameStore } from '../store/gameStore';
import './StationStats.css';

export function StationStats() {
  const residents = useGameStore((s) => s.residents);
  const stationLevel = useGameStore((s) => s.stationLevel);

  return (
    <div className="panel station-stats">
      <div className="stat-line">
        <span>Residents:</span>
        <strong>{residents.length}</strong>
      </div>
      <div className="stat-line">
        <span>Station Level:</span>
        <strong>{stationLevel}</strong>
      </div>
    </div>
  );
}
