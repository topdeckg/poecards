// Core game types based on the design document

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Unique';

export type ResourceType = 
  | 'Iron' 
  | 'Energy' 
  | 'Water' 
  | 'Food' 
  | 'Credits'
  | 'Electronics'
  | 'Medicine';

export interface Resources {
  [key: string]: number;
}

// Factory Types (Offense)
export type FactoryBaseType = 
  | 'IronForge'
  | 'EnergyReactor'
  | 'WaterPurifier'
  | 'HydroponicFarm'
  | 'ElectronicsLab'
  | 'MedicalFacility';

export interface FactoryStats {
  successChance: number;       // 0-100%
  baseProduction: number;       // Base amount produced
  productionRange: number;      // ±X variation
  critChance: number;           // Critical success chance
  critMultiplier: number;       // Critical production multiplier
  activationSpeed: number;      // Seconds for manual click
  cooldown: number;             // Seconds between productions
  autoActivation: boolean;      // Can auto-produce
  autoInterval?: number;        // Seconds between auto-productions
}

export interface PortSlot {
  id: string;
  type: 'Prefix' | 'Suffix';
  modifier: PortModifier | null;
}

export interface PortModifier {
  id: string;
  name: string;
  type: 'Prefix' | 'Suffix';
  rarity: Rarity;
  effects: ModifierEffect[];
}

export interface ModifierEffect {
  stat: string;
  value: number;
  type: 'flat' | 'percentage';
}

export interface Factory {
  id: string;
  name: string;
  rarity: Rarity;
  level: number;
  baseType: FactoryBaseType;
  stats: FactoryStats;
  produces: ResourceType;
  consumes?: ResourceCost[];
  portSlots: PortSlot[];
  isActive: boolean;
  lastActivation: number;
}

export interface ResourceCost {
  resource: ResourceType;
  amount: number;
}

// Entertainment Types (Defense)
export type EntertainmentBaseType = 
  | 'Restaurant'
  | 'Theater'
  | 'Arcade'
  | 'Gym'
  | 'Park'
  | 'Library';

export interface EntertainmentStats {
  demandReduction: number;      // Flat reduction to demands
  demandReductionPercent: number; // % reduction to demands
  categoryBonus: Record<string, number>; // Specific category reductions
  rerollChance: number;         // Chance to reroll unfavorable demands
  qualityBonus: number;         // Increases resident satisfaction
}

export interface Entertainment {
  id: string;
  name: string;
  rarity: Rarity;
  level: number;
  baseType: EntertainmentBaseType;
  stats: EntertainmentStats;
  portSlots: PortSlot[];
  isActive: boolean;
}

// Resident Types
export interface ResidentDemand {
  id: string;
  resource: ResourceType;
  amount: number;
  deadline?: number;            // Timestamp, undefined = no deadline
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  fulfilled: boolean;
}

export interface Resident {
  id: string;
  name: string;
  role: string;
  level: number;
  currentDemand: ResidentDemand | null;
  satisfaction: number;         // 0-100
  demandHistory: ResidentDemand[];
}

// Game State
export interface GameState {
  // Resources
  resources: Resources;
  knownResources: ResourceType[]; // resources discovered/unlocked for display
  
  // Station
  factories: Factory[];
  entertainment: Entertainment[];
  factorySlots: number;
  entertainmentSlots: number;
  factoryInventory: Factory[]; // unused items
  entertainmentInventory: Entertainment[]; // unused items
  
  // Residents
  residents: Resident[];
  
  // Progression
  stationLevel: number;
  totalDemandsFulfilled: number;
  tutorialStarted: boolean;

  // Logs
  logs: LogEntry[];
  logSettings: LogSettings;

  // UI
  showTutorialModal: boolean;
  showUpgradeTutorialModal: boolean;
  // Crafting
  craftingMaterials: Record<CraftingMaterialId, number>;
  
  // Time
  gameTime: number;
  lastTick: number;
  
  // UI State
  selectedFactory: string | null;
  selectedEntertainment: string | null;
}

// Logging
export type LogSource = 'factory' | 'system' | 'demand';
export type LogSubtype =
  | 'manual'
  | 'auto'
  | 'success'
  | 'failure'
  | 'critical'
  | 'install'
  | 'info';

export interface LogEntry {
  id: string;
  timestamp: number;
  source: LogSource;
  subtype: LogSubtype[]; // multiple tags, e.g. ['factory','manual','success']
  message: string;
  factoryId?: string;
}

export interface LogSettings {
  showSuccess: boolean;
  showFailure: boolean;
  showCritical: boolean;
  showAuto: boolean;
  showManual: boolean;
}

// Crafting
export type CraftingMaterialId =
  | 'OrbOfTransmutation'
  | 'OrbOfAlteration'
  | 'OrbOfAugmentation'
  | 'OrbOfAnnulment'
  | 'IronScrap'
  | 'EnergyCell';

export type ItemRarity = Rarity; // alias for clarity

// Production Result
export interface ProductionResult {
  success: boolean;
  isCritical: boolean;
  amountProduced: number;
  factory: Factory;
  timestamp: number;
}

// Demand Generation
export interface DemandGenerationContext {
  residentLevel: number;
  stationLevel: number;
  entertainment: Entertainment[];
}
