import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Factory } from '../types';
import './InventoryPanel.css';

export function InventoryPanel() {
  const [tab, setTab] = useState<'factories' | 'entertainment'>('factories');
  const factoryInventory = useGameStore((s) => s.factoryInventory);
  const installFactoryToFirstSlot = useGameStore((s) => s.installFactoryToFirstSlot);

  const onInstall = (f: Factory) => {
    const ok = installFactoryToFirstSlot(f.id);
    if (!ok) alert('No available factory slot to install.');
  };

  return (
    <div className="panel inventory-panel">
      <div className="panel-title">Unused Factory/Entertainment</div>
      <div className="tabs">
        <button className={`tab ${tab === 'factories' ? 'active' : ''}`} onClick={() => setTab('factories')}>Factories</button>
        <button className={`tab ${tab === 'entertainment' ? 'active' : ''}`} onClick={() => setTab('entertainment')}>Entertainment</button>
      </div>

      {tab === 'factories' ? (
        <div className="inv-list">
          {factoryInventory.length === 0 ? (
            <div className="empty">None</div>
          ) : (
            factoryInventory.map((f) => (
              <div key={f.id} className={`inv-card rarity-${f.rarity.toLowerCase()}`} title={`${f.name}\nSuccess ${f.stats.successChance}% | Crit ${f.stats.critChance}% | Base ${f.stats.baseProduction} (+/-${f.stats.productionRange})`}>
                <div className="inv-title">{f.name}</div>
                <div className="rarity">{f.rarity} • Lvl {f.level}</div>
                <div className="mini-stats">
                  <span>Success {f.stats.successChance}%</span>
                  <span>Crit {f.stats.critChance}%</span>
                  <span>Base {f.stats.baseProduction}</span>
                </div>
                <div className="actions">
                  <button className="btn" onClick={() => onInstall(f)}>Install</button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="inv-list"><div className="empty">None</div></div>
      )}
    </div>
  );
}
