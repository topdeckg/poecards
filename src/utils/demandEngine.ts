import type { Resident, ResidentDemand, GameState, ResourceType } from '../types';

const resourcePool: ResourceType[] = [
  'Iron', 'Energy', 'Water', 'Food', 'Electronics', 'Medicine'
];

export function generateDemand(resident: Resident, gameState: GameState): ResidentDemand {
  // Base demand scales with resident and station level
  const baseAmount = 20 + (resident.level * 10) + (gameState.stationLevel * 5);
  
  // Apply entertainment defense
  let demandReduction = 0;
  gameState.entertainment.forEach(ent => {
    demandReduction += ent.stats.demandReduction;
    demandReduction += ent.stats.demandReductionPercent * baseAmount / 100;
  });
  
  const finalAmount = Math.max(10, Math.floor(baseAmount - demandReduction));
  
  // Select random resource
  const resource = resourcePool[Math.floor(Math.random() * resourcePool.length)];
  
  // Determine priority based on current resources
  let priority: ResidentDemand['priority'] = 'Medium';
  const currentResource = gameState.resources[resource] || 0;
  
  if (currentResource < finalAmount / 2) {
    priority = 'High';
  } else if (currentResource >= finalAmount * 2) {
    priority = 'Low';
  }
  
  return {
    id: `demand-${Date.now()}-${Math.random()}`,
    resource,
    amount: finalAmount,
    priority,
    fulfilled: false,
  };
}
