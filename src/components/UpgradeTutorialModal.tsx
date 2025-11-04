import { useGameStore } from '../store/gameStore';
import './TutorialModal.css';

export function UpgradeTutorialModal() {
  const show = useGameStore(s => s.showUpgradeTutorialModal);
  const setShow = useGameStore(s => s.setShowUpgradeTutorialModal);
  const selectedFactory = useGameStore(s => s.selectedFactory);

  if (!show) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>New crafting currency</h2>
        <p>You received your first Orb of Alteration.</p>
        <ol>
          <li>Select a factory in the Factory Space.</li>
          <li>Open the Crafting Materials panel (right column).</li>
          <li>Click “Use Orb of Alteration” to reroll its affixes.</li>
        </ol>
        <p className="subtle">Tip: Affixes can improve success chance, production, crits, or cooldown.</p>
        <div className="actions">
          <button className="primary" onClick={() => setShow(false)}>{selectedFactory ? 'Got it' : 'I will select a factory'}</button>
        </div>
      </div>
    </div>
  );
}
