import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { ProductionResult } from '../types';
import './FactoryPanel.css';

export function FactoryPanel() {
  const factories = useGameStore(state => state.factories);
  const activateFactory = useGameStore(state => state.activateFactory);
  const [lastResult, setLastResult] = useState<ProductionResult | null>(null);

  const handleActivate = (factoryId: string) => {
    const result = activateFactory(factoryId);
    if (result) {
      setLastResult(result);
      setTimeout(() => setLastResult(null), 2000);
    }
  };

  const canActivate = (factory: any) => {
    const now = Date.now();
    return factory.lastActivation + factory.stats.cooldown * 1000 <= now;
  };

  return (
    <div className="factory-panel panel">
      <h3>Factories</h3>
      
      {lastResult && (
        <div className={`production-result ${lastResult.isCritical ? 'critical' : ''}`}>
          {lastResult.success ? (
            <>
              {lastResult.isCritical && '⚡ CRITICAL! '}
              Produced {lastResult.amountProduced} {lastResult.factory.produces}!
            </>
          ) : (
            'Production failed!'
          )}
        </div>
      )}

      <div className="factory-list">
        {factories.map(factory => (
          <div key={factory.id} className={`factory-card rarity-${factory.rarity.toLowerCase()}`}>
            <div className="factory-header">
              <h4>{factory.name}</h4>
              <span className="factory-rarity">{factory.rarity}</span>
            </div>
            
            <div className="factory-info">
              <div className="stat-row">
                <span>Produces:</span>
                <strong>{factory.produces}</strong>
              </div>
              <div className="stat-row">
                <span>Success Chance:</span>
                <strong>{factory.stats.successChance}%</strong>
              </div>
              <div className="stat-row">
                <span>Production:</span>
                <strong>
                  {factory.stats.baseProduction - factory.stats.productionRange} - 
                  {factory.stats.baseProduction + factory.stats.productionRange}
                </strong>
              </div>
              <div className="stat-row">
                <span>Crit Chance:</span>
                <strong>{factory.stats.critChance}%</strong>
              </div>
              <div className="stat-row">
                <span>Crit Multi:</span>
                <strong>{factory.stats.critMultiplier}x</strong>
              </div>
              <div className="stat-row">
                <span>Cooldown:</span>
                <strong>{factory.stats.cooldown}s</strong>
              </div>
            </div>

            <button
              className="activate-btn"
              onClick={() => handleActivate(factory.id)}
              disabled={!canActivate(factory)}
            >
              {canActivate(factory) ? '⚙️ Activate' : '⏳ Cooling down...'}
            </button>

            {factory.stats.autoActivation && (
              <div className="auto-indicator">🤖 Auto-producing</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
