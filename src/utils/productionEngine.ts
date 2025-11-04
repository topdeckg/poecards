import type { Factory, ProductionResult } from '../types';
import { getEffectiveStats } from './affixes';

export function calculateProductionResult(factory: Factory): ProductionResult {
  const stats = getEffectiveStats(factory);
  
  // Roll for success
  const successRoll = Math.random() * 100;
  const success = successRoll <= stats.successChance;
  
  if (!success) {
    return {
      success: false,
      isCritical: false,
      amountProduced: 0,
      factory,
      timestamp: Date.now(),
    };
  }
  
  // Roll for critical
  const critRoll = Math.random() * 100;
  const isCritical = critRoll <= stats.critChance;
  
  // Calculate amount produced
  const variance = Math.random() * stats.productionRange * 2 - stats.productionRange;
  let amountProduced = Math.max(1, Math.floor(stats.baseProduction + variance));
  
  if (isCritical) {
    amountProduced = Math.floor(amountProduced * stats.critMultiplier);
  }
  
  return {
    success: true,
    isCritical,
    amountProduced,
    factory,
    timestamp: Date.now(),
  };
}
