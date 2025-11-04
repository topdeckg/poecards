import { useGameStore } from '../store/gameStore';
import './TutorialModal.css';

export function TutorialModal() {
  const show = useGameStore(s => s.showTutorialModal);
  const setShow = useGameStore(s => s.setShowTutorialModal);
  const residents = useGameStore(s => s.residents);

  if (!show) return null;

  const first = residents[0];

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>Welcome aboard</h2>
        <p>
          An Engineer has just arrived at your station{first ? `: ${first.name}` : ''}. They have a request for
          basic resources to get started.
        </p>
        {first?.currentDemand && (
          <div className="callout">
            Current request: {first.currentDemand.amount} {first.currentDemand.resource}
          </div>
        )}
        <p>
          Check the right panel to find your Inventory. Install the Basic Forge into the first Factory Slot,
          then click Activate to produce resources and fulfill the request.
        </p>
        <div className="actions">
          <button className="primary" onClick={() => setShow(false)}>Got it</button>
        </div>
      </div>
    </div>
  );
}
