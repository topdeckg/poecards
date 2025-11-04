import { useGameStore } from '../store/gameStore';
import './ResidentPanel.css';

export function ResidentPanel() {
  const residents = useGameStore(state => state.residents);
  const resources = useGameStore(state => state.resources);
  const fulfillDemand = useGameStore(state => state.fulfillDemand);

  const canFulfill = (demand: any) => {
    return resources[demand.resource] >= demand.amount;
  };

  const handleFulfill = (residentId: string, demandId: string) => {
    const success = fulfillDemand(residentId, demandId);
    if (!success) {
      alert('Not enough resources!');
    }
  };

  return (
    <div className="resident-panel panel">
      <h3>Residents</h3>
      
      <div className="resident-list">
        {residents.map(resident => (
          <div key={resident.id} className="resident-card">
            <div className="resident-header">
              <div>
                <h4>{resident.name}</h4>
                <p className="resident-role">{resident.role}</p>
              </div>
              <div className="resident-level">Lvl {resident.level}</div>
            </div>

            <div className="satisfaction-bar">
              <div 
                className="satisfaction-fill"
                style={{ width: `${resident.satisfaction}%` }}
              />
              <span className="satisfaction-text">
                Satisfaction: {resident.satisfaction}%
              </span>
            </div>

            {resident.currentDemand && !resident.currentDemand.fulfilled && (
              <div className={`demand-card priority-${resident.currentDemand.priority.toLowerCase()}`}>
                <div className="demand-header">
                  <span className="priority-badge">{resident.currentDemand.priority}</span>
                  <span>Demand</span>
                </div>
                
                <div className="demand-info">
                  <span className="demand-resource">{resident.currentDemand.resource}</span>
                  <span className="demand-amount">
                    {Math.floor(resources[resident.currentDemand.resource] || 0)} / {resident.currentDemand.amount}
                  </span>
                </div>

                <div className="demand-progress">
                  <div 
                    className="demand-progress-fill"
                    style={{ 
                      width: `${Math.min(100, ((resources[resident.currentDemand.resource] || 0) / resident.currentDemand.amount) * 100)}%` 
                    }}
                  />
                </div>

                <button
                  className="fulfill-btn"
                  onClick={() => handleFulfill(resident.id, resident.currentDemand!.id)}
                  disabled={!canFulfill(resident.currentDemand)}
                >
                  {canFulfill(resident.currentDemand) ? '✓ Fulfill Demand' : '✗ Insufficient Resources'}
                </button>
              </div>
            )}

            <div className="demand-history">
              <p>Fulfilled: {resident.demandHistory.length}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
