import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { HeaderBar } from './HeaderBar';
import { ResourceInventoryTable } from './ResourceInventoryTable';
import { StationStats } from './StationStats';
import { FactorySpace } from './FactorySpace';
import { EntertainmentSpace } from './EntertainmentSpace';
import { QuickOrdersPanel } from './QuickOrdersPanel';
import { GameControls } from './GameControls';
import { InventoryPanel } from './InventoryPanel';
import { TutorialModal } from './TutorialModal';
import { UpgradeTutorialModal } from './UpgradeTutorialModal';
import { LogPanel } from './LogPanel';
import { CraftingMaterials } from './CraftingMaterials';
import './GameContainer.css';

export function GameContainer() {
  const gameTick = useGameStore(state => state.gameTick);

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      gameTick();
    }, 100); // Tick every 100ms

    return () => clearInterval(interval);
  }, [gameTick]);

  return (
    <div className="game-container">
      <div className="game-header">
        <HeaderBar />
        <GameControls />
      </div>
      
      <div className="game-main">
        <div className="left-panel">
          <ResourceInventoryTable />
          <StationStats />
        </div>
        
        <div className="center-panel">
          <FactorySpace />
          <EntertainmentSpace />
        </div>
        
        <div className="right-panel">
          <QuickOrdersPanel />
          <InventoryPanel />
          <CraftingMaterials />
          <LogPanel />
        </div>
      </div>
      <TutorialModal />
      <UpgradeTutorialModal />
    </div>
  );
}
