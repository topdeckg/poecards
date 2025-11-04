import './CraftingMaterials.css';
import { useGameStore } from '../store/gameStore';

const LABELS: Record<string, string> = {
  OrbOfTransmutation: 'Orb of Transmutation',
  OrbOfAlteration: 'Orb of Alteration',
  OrbOfAugmentation: 'Orb of Augmentation',
  OrbOfAnnulment: 'Orb of Annulment',
  IronScrap: 'Iron Scrap',
  EnergyCell: 'Energy Cell',
};

export function CraftingMaterials() {
  const mats = useGameStore(s => s.craftingMaterials);
  const selectedFactory = useGameStore(s => s.selectedFactory);
  const useOrb = useGameStore(s => s.useOrbOfAlteration);
  const useTransmute = useGameStore(s => s.useOrbOfTransmutation);
  const entries = Object.entries(mats).filter(([, qty]) => qty > 0);
  if (entries.length === 0) return null; // hidden until first material is earned

  return (
    <div className="panel crafting-materials">
      <div className="panel-title">Crafting Materials</div>
      <ul className="mat-list">
        {entries.map(([id, qty]) => (
          <li key={id}>
            <span className="name">{LABELS[id] ?? id}</span>
            <span className="qty">x {qty}</span>
          </li>
        ))}
      </ul>
      {/* Transmutation: upgrades Normal(Common) to Magic(Uncommon) and rolls affixes */}
      {mats.OrbOfTransmutation > 0 && (
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            className="small"
            onClick={() => selectedFactory && useTransmute(selectedFactory)}
            disabled={!selectedFactory}
            title={selectedFactory ? 'Use on selected factory' : 'Select a factory first'}
          >
            Use Orb of Transmutation
          </button>
          {!selectedFactory && <span className="hint" style={{ color: '#8b92a8' }}>Select a factory to use the orb.</span>}
        </div>
      )}

      {/* Alteration: rerolls existing magic affixes */}
      {mats.OrbOfAlteration > 0 && (
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            className="small"
            onClick={() => selectedFactory && useOrb(selectedFactory)}
            disabled={!selectedFactory}
            title={selectedFactory ? 'Use on selected factory' : 'Select a factory first'}
          >
            Use Orb of Alteration
          </button>
          {!selectedFactory && <span className="hint" style={{ color: '#8b92a8' }}>Select a factory to use the orb.</span>}
        </div>
      )}
    </div>
  );
}
