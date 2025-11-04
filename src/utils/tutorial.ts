import type { Factory, Resident, ResidentDemand } from '../types';
import { generateRandomName } from './nameGenerator';

export function createTutorialEngineer(): Resident {
  const firstDemand: ResidentDemand = {
    id: `demand-${Date.now()}`,
    resource: 'Iron',
    amount: 50,
    priority: 'Critical',
    fulfilled: false,
  };

  return {
    id: `resident-${Date.now()}`,
    name: generateRandomName(),
    role: 'Station Engineer',
    level: 1,
    currentDemand: firstDemand,
    satisfaction: 50,
    demandHistory: [],
  };
}

export function createTutorialBasicFactory(): Factory {
  return {
    id: `factory-basic-${Date.now()}`,
    name: 'Basic Iron Forge',
    rarity: 'Common',
    level: 1,
    baseType: 'IronForge',
    stats: {
      successChance: 70,
      baseProduction: 5,
      productionRange: 2,
      critChance: 5,
      critMultiplier: 2,
      activationSpeed: 1,
      cooldown: 1,
      autoActivation: false,
    },
    produces: 'Iron',
    portSlots: [
      { id: 'port-1', type: 'Prefix', modifier: null },
      { id: 'port-2', type: 'Suffix', modifier: null },
    ],
    isActive: true,
    lastActivation: 0,
  };
}
