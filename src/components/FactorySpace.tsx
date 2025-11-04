import { useGameStore } from '../store/gameStore';
import { getEffectiveStats, describeEffect } from '../utils/affixes';
import './FactorySpace.css';

export function FactorySpace() {
  const factories = useGameStore((s) => s.factories);
  const slots = useGameStore((s) => s.factorySlots);
  const activateFactory = useGameStore((s) => s.activateFactory);
  const selectFactory = useGameStore((s) => s.selectFactory);
  const selectedFactory = useGameStore((s) => s.selectedFactory);
  // Subscribe to gameTime to refresh cooldown UI
  useGameStore((s) => s.gameTime);

  if (slots <= 0) {
    return (
      <div className="panel factory-space">
        <div className="panel-title">Factory Space</div>
        <div className="locked-label">[Locked]</div>
      </div>
    );
  }

  const cards = Array.from({ length: Math.max(0, slots) }, (_, i) => {
    const factory = factories[i];
    const unlocked = i < slots;

    if (!unlocked) return null;

    if (!factory) {
      return (
        <div key={i} className="slot-card empty">
          <div className="slot-title">[Empty] Slot {i + 1}</div>
          <button className="install-btn">Install</button>
        </div>
      );
    }

  const now = Date.now();
  // Use effective cooldown if affixes modify it: recompute via store output
  const effectiveCooldown = factory.stats.cooldown; // display approximation; real gate is in store using lastActivation
  const cdEnds = factory.lastActivation + effectiveCooldown * 1000;
    const cdReady = cdEnds <= now;
    const remaining = Math.max(0, cdEnds - now);
    const remainingSec = (remaining / 1000).toFixed(1);
    const isSelected = selectedFactory === factory.id;
    const eff = getEffectiveStats(factory);
    const prefix = factory.portSlots.find(s => s.type === 'Prefix' && s.modifier)?.modifier?.name;
    const suffix = factory.portSlots.find(s => s.type === 'Suffix' && s.modifier)?.modifier?.name;
    const displayName = prefix && suffix
      ? `${prefix} ${factory.name} ${suffix}`
      : prefix
        ? `${prefix} ${factory.name}`
        : suffix
          ? `${factory.name} ${suffix}`
          : factory.name;
    return (
      <div key={factory.id} className={`slot-card filled rarity-border rarity-${factory.rarity.toLowerCase()} ${isSelected ? 'selected' : ''}`}>
        <div className="slot-title">{displayName}</div>
        <div className="slot-stats">
          <div>Success {eff.successChance}%</div>
          <div>Crit {eff.critChance}%</div>
          <div>Prod {Math.max(1, Math.floor(eff.baseProduction - eff.productionRange))}–{Math.floor(eff.baseProduction + eff.productionRange)}</div>
        </div>
        {factory.portSlots.some(s => s.modifier) && (
          <div className="affixes" style={{ color: '#cde9ff', fontSize: '0.85rem' }}>
            {factory.portSlots.map((s) => (
              s.modifier ? (
                <div key={s.id}>
                  <div style={{ fontWeight: 600 }}>{s.modifier.name}</div>
                  {s.modifier.effects.map((e, idx) => (
                    <div key={idx} style={{ color: '#a7d5ff' }}>{describeEffect(e)}</div>
                  ))}
                </div>
              ) : null
            ))}
          </div>
        )}
        <button
          className="install-btn"
          disabled={!cdReady}
          onClick={() => activateFactory(factory.id)}
        >
          {cdReady ? 'Activate' : `Cooling ${remainingSec}s`}
        </button>
        <button className="install-btn" onClick={() => selectFactory(factory.id)}>
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    );
  });

  return (
    <div className="panel factory-space">
      <div className="panel-title">Factory Space</div>
      <div className="slots-grid">{cards.filter(Boolean)}</div>
    </div>
  );
}
