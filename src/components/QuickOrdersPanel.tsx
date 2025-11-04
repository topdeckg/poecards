import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import './QuickOrdersPanel.css';

export function QuickOrdersPanel() {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const residents = useGameStore((s) => s.residents);
  const resources = useGameStore((s) => s.resources);
  const fulfillDemand = useGameStore((s) => s.fulfillDemand);

  const handleFulfill = (residentId: string, demandId: string) => {
    fulfillDemand(residentId, demandId);
  };

  return (
    <div className="panel quick-orders">
      <div className="panel-title">Quick Orders Interface</div>
      <div className="tabs">
        <button className={`tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>Active</button>
        <button className={`tab ${tab === 'completed' ? 'active' : ''}`} onClick={() => setTab('completed')}>Completed</button>
      </div>

      {tab === 'active' ? (
        <div className="orders">
          {residents.map((r) => (
            <div key={r.id} className="order-card">
              <div className="order-header">
                <div className="name">{r.name} <span className="role">({r.role})</span></div>
                <div className="satisfaction">{r.satisfaction}%</div>
              </div>
              {r.currentDemand && !r.currentDemand.fulfilled ? (
                <>
                  <div className="demand-line">
                    DEMAND: <strong>{r.currentDemand.amount} {r.currentDemand.resource}</strong>
                  </div>
                  <div className="sub-line">
                    You have: {Math.floor(resources[r.currentDemand.resource] || 0)}
                  </div>
                  <button
                    className="fulfill"
                    disabled={(resources[r.currentDemand.resource] || 0) < r.currentDemand.amount}
                    onClick={() => handleFulfill(r.id, r.currentDemand!.id)}
                  >
                    FULFILL
                  </button>
                </>
              ) : (
                <div className="sub-line">No active demand</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="orders empty">[Locked]</div>
      )}
    </div>
  );
}
