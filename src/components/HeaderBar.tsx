import './HeaderBar.css';
import { useGameStore } from '../store/gameStore';

export function HeaderBar() {
  const gameTime = useGameStore((s) => s.gameTime);
  const stationLevel = useGameStore((s) => s.stationLevel);

  // Simple time formatter
  const time = new Date(gameTime);
  const timeStr = time.toLocaleTimeString();

  return (
    <div className="header-bar">
      <div className="header-left">
        <span className="wing-name">Alpha Wing</span>
        <span className="wing-level">Lvl {stationLevel}</span>
      </div>
      <div className="header-center">
        <span className="status-dot online" />
        <span>systems nominal</span>
      </div>
      <div className="header-right">
        <span className="time-label">{timeStr}</span>
        <span className="events-label">No events</span>
      </div>
    </div>
  );
}
