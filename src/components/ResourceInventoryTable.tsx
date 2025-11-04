import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import './ResourceInventoryTable.css';

const DEFAULT_CAP = 1000;

export function ResourceInventoryTable() {
  const resources = useGameStore((s) => s.resources);
  const known = useGameStore((s) => s.knownResources);

  const rows = useMemo(() => {
    const entries = Object.entries(resources).filter(([, amount]) => amount > 0);
    // If none have amount > 0, show only "known" ones (which may be empty initially)
    const toShow = entries.length > 0 ? entries : known.map((k) => [k, resources[k] || 0] as const);
    return toShow.map(([name, amount]) => {
      const cap = DEFAULT_CAP;
      const pct = Math.min(100, (amount / cap) * 100);
      let level: 'low' | 'mid' | 'high' = 'low';
      if (pct >= 50) level = 'high';
      else if (pct >= 25) level = 'mid';
      return { name, amount, cap, pct, level };
    });
  }, [resources]);

  if (rows.length === 0) {
    return (
      <div className="panel resource-inventory">
        <div className="panel-title">Resource Inventory</div>
        <div className="table-body empty">No known resources</div>
      </div>
    );
  }

  return (
    <div className="panel resource-inventory">
      <div className="panel-title">Resource Inventory</div>
      <div className="table-header">
        <span>Name</span>
        <span>stock / max</span>
        <span>prod</span>
      </div>
      <div className="table-body">
        {rows.map((r) => (
          <div key={r.name} className={`table-row ${r.level}`}>
            <span className="col name">{r.name}</span>
            <span className="col amount">{Math.floor(r.amount)} / {r.cap}</span>
            <span className="col prod">+0/s</span>
          </div>
        ))}
      </div>
    </div>
  );
}
