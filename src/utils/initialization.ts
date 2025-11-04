import type { GameState } from '../types';

export function createInitialGameState(): GameState {
  return {
    resources: {},
    knownResources: [],
    factories: [],
    entertainment: [],
    factorySlots: 0,
    entertainmentSlots: 0,
    factoryInventory: [],
    entertainmentInventory: [],
    residents: [],
    stationLevel: 1,
    totalDemandsFulfilled: 0,
    tutorialStarted: false,
    logs: [],
    logSettings: {
      showSuccess: true,
      showFailure: true,
      showCritical: true,
      showAuto: true,
      showManual: true,
    },
    showTutorialModal: false,
  showUpgradeTutorialModal: false,
    craftingMaterials: {
      OrbOfTransmutation: 0,
      OrbOfAlteration: 0,
      OrbOfAugmentation: 0,
      OrbOfAnnulment: 0,
      IronScrap: 0,
      EnergyCell: 0,
    },
    gameTime: Date.now(),
    lastTick: Date.now(),
    selectedFactory: null,
    selectedEntertainment: null,
  };
}
