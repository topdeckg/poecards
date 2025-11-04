import './EntertainmentSpace.css';
import { useGameStore } from '../store/gameStore';

const categories = ['Restaurant', 'Bar', 'Theater', 'Gym'] as const;

export function EntertainmentSpace() {
  const entertainment = useGameStore((s) => s.entertainment);
  const slotsUnlocked = useGameStore((s) => s.entertainmentSlots);

  if (slotsUnlocked <= 0) {
    return (
      <div className="panel entertainment-space">
        <div className="panel-title">Entertainment Space</div>
        <div className="label">[Locked]</div>
      </div>
    );
  }

  return (
    <div className="panel entertainment-space">
      <div className="panel-title">Entertainment Space</div>
      <div className="slots-grid">
        {categories.slice(0, Math.max(0, slotsUnlocked)).map((cat) => {
          const venue = entertainment.find((e) => e.baseType === cat);

          if (!venue) {
            return (
              <div key={cat} className={`ent-card ${cat.toLowerCase()}`}>
                <div className="ent-title">{cat.toUpperCase()}</div>
                <div className="ent-empty">[Empty]</div>
                <button className="install-btn">Install</button>
              </div>
            );
          }

          return (
            <div key={cat} className={`ent-card ${cat.toLowerCase()} filled`}>
              <div className="ent-title">{venue.name}</div>
              <div className="ent-stats">Reduction {venue.stats.demandReduction}%</div>
              <button className="install-btn">Manage</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
