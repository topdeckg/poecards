import type { Factory, FactoryStats, ModifierEffect, PortModifier } from '../types';

// Simple sample modifier pools
const PREFIX_POOL: Omit<PortModifier, 'id'>[] = [
  {
    name: 'Precise',
    type: 'Prefix',
    rarity: 'Common',
    effects: [{ stat: 'successChance', value: 10, type: 'flat' }],
  },
  {
    name: 'Efficient',
    type: 'Prefix',
    rarity: 'Common',
    effects: [{ stat: 'baseProduction', value: 1, type: 'flat' }],
  },
  {
    name: 'Surgical',
    type: 'Prefix',
    rarity: 'Uncommon',
    effects: [
      { stat: 'successChance', value: 5, type: 'flat' },
      { stat: 'critChance', value: 5, type: 'flat' },
    ],
  },
];

const SUFFIX_POOL: Omit<PortModifier, 'id'>[] = [
  {
    name: 'of Power',
    type: 'Suffix',
    rarity: 'Common',
    effects: [{ stat: 'critChance', value: 10, type: 'flat' }],
  },
  {
    name: 'of Speed',
    type: 'Suffix',
    rarity: 'Common',
    effects: [{ stat: 'cooldown', value: -15, type: 'percentage' }],
  },
  {
    name: 'of Plenty',
    type: 'Suffix',
    rarity: 'Uncommon',
    effects: [{ stat: 'baseProduction', value: 15, type: 'percentage' }],
  },
];

function applyEffectsToStats(base: FactoryStats, effects: ModifierEffect[]): FactoryStats {
  const stats: FactoryStats = { ...base };
  for (const eff of effects) {
    const key = eff.stat as keyof FactoryStats;
    const current = (stats as any)[key];
    if (typeof current !== 'number') continue;
    if (eff.type === 'flat') {
      (stats as any)[key] = current + eff.value;
    } else {
      (stats as any)[key] = current + current * (eff.value / 100);
    }
  }
  // Clamp reasonable bounds
  stats.successChance = Math.max(0, Math.min(100, stats.successChance));
  stats.critChance = Math.max(0, Math.min(100, stats.critChance));
  stats.critMultiplier = Math.max(1, stats.critMultiplier);
  stats.cooldown = Math.max(0.1, stats.cooldown);
  return stats;
}

export function getEffectiveStats(factory: Factory): FactoryStats {
  let stats = { ...factory.stats } as FactoryStats;
  for (const slot of factory.portSlots) {
    if (slot.modifier) {
      stats = applyEffectsToStats(stats, slot.modifier.effects);
    }
  }
  return stats;
}

export function rollModifier(type: 'Prefix' | 'Suffix'): PortModifier {
  const pool = type === 'Prefix' ? PREFIX_POOL : SUFFIX_POOL;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return {
    id: `${type}-${picked.name}-${Math.random().toString(36).slice(2)}`,
    ...picked,
  } as PortModifier;
}

// Formatting helpers for UI
export function describeEffect(e: ModifierEffect): string {
  const labelMap: Record<string, string> = {
    successChance: 'Success Chance',
    baseProduction: 'Base Production',
    productionRange: 'Production Range',
    critChance: 'Critical Chance',
    critMultiplier: 'Critical Multiplier',
    activationSpeed: 'Activation Speed',
    cooldown: 'Cooldown',
    autoInterval: 'Auto Interval',
  } as any;
  const label = labelMap[e.stat] ?? e.stat;
  const sign = e.value >= 0 ? '+' : '';
  if (e.type === 'percentage') {
    return `${sign}${e.value}% ${label}`;
  }
  // For flat changes: some stats are best shown with % implicitly (like success/crit)
  if (e.stat === 'successChance' || e.stat === 'critChance') {
    return `${sign}${e.value}% ${label}`;
  }
  return `${sign}${e.value} ${label}`;
}

export function describeModifier(mod: PortModifier): string[] {
  return mod.effects.map(describeEffect);
}
