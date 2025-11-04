# user prompt

Locally run incremental webgame. 

You begin with an empty space station. It orbits a planet undergoing terraforming. You have one resident. Each resident has requirements. Needs. Demands. Meeting resident needs functions similar to a research tree. Rewarded with equipment which will be used to meet future needs, quality of life gameplay, such as automated functions, and passive bonuses. 

Equipment is handled under the class of factories. Factories are like weapons and armor in an action role-playing game, see path of Exile. 

In the early game, when the user has a single basic factory, they will quick a button, this is an incremental game. After all. This is like an attack in an action game. The factory has a chance to succeed. And the amount of resources produced is within a range of values. Borrowing heavily from path of Exile, factories can be augmented with upgrade ports which come in two flavors. This mimics the prefix and suffix affix mechanic in path of Exile. A single Port effect might be something like a bonus chance to succeed or a bonus to production when there is a success. But it can go far beyond that. Critical success chance, critical success production bonus. Flat production bonus. Percentage production bonus. Chance to produce a different type of resource. Cool down rate. Activation speed when automated. 

Resource cost reduction. This would apply to tier 2 factories and above. Factories which produce advanced resources consuming lower tier resources. There can also be critical cost reduction modifiers, similar to success chance.

Passive production over time effects. This mumics combat game mechanics such as poison or bleed. 

But if all we focus on is production then that's a bit like being a glass Cannon in an action game. All attack and no defense. The challenge is the station residence demands. So to defend against that, this station manager needs a counterpart to the factories, entertainment. Leisure activities, restaurants, quotes, theaters. 

Entertainment provides the player with passive defense bonuses when the game rolls for new resident demands. Lessening the demands of specific goods if the player is weak in certain areas. Or reductions, this is similar to armor, evasion, shielding in path of Exile. 

Just like in an RPG where you have specific equipment slots, there are specific entertainment spots that can be built. If the player wants to put something else of the same category, they'll have to remove the existing one. This also goes for factories. Although it's probably not as restrictive as in an action RPG where you can only have mainhand offhand or a two-handed weapon.

---

# LLM Model response


# Station Master: Complete Game Design Document

## Core Concept

A locally-run incremental web game where you manage a space station, serve residents' needs, and balance production (factories) with defense (entertainment). Heavily inspired by Path of Exile's itemization and ARPG mechanics.

---

## The Core Loop

```
Resident Makes Demand
        ↓
Defense Roll (Entertainment reduces demand)
        ↓
Player Produces Resources (Factory activation)
        ↓
Fulfill Demand → Reward Equipment
        ↓
Install Equipment → Stronger Production/Defense
        ↓
Attract More Residents → Harder Demands
        ↓
REPEAT (with prestige system)
```

---

## Phase 1: The Lone Resident

### Starting State
- **Empty station wing**
- **One resident** (The Engineer, procedurally named)
- **One basic factory slot** (unlocked)
- **Zero entertainment slots** (locked initially)
- **Manual activation only** (click to produce)

### The Engineer's First Demand
```
"I need 50 Iron to repair the life support system."
Priority: CRITICAL
Deadline: None (tutorial, no time pressure)
```

### Tutorial Flow
1. **Click the factory** → Activation roll → Produce iron
2. **Success/failure feedback** → Show rolls and results
3. **Accumulate 50 iron** → Fulfill demand
4. **Reward: First equipment piece** → "Worn Production Module" (Common, +5% success chance)
5. **Install equipment** → Factory becomes stronger
6. **Engineer makes second demand** → Cycle continues

---

## Factories: The Offense

### Factory as Equipment

Factories are **items** with stats, just like weapons in Path of Exile.

```typescript
interface Factory {
  // Identity
  id: string;
  name: string;
  rarity: FactoryRarity; // Common, Uncommon, Rare, Unique
  level: number;
  
  // Base Type (like "Two-Handed Axe" in PoE)
  baseType: FactoryBaseType; // IronForge, EnergyReactor, etc.
  
  // Core Stats (like weapon damage in PoE)
  baseStats: {
    successChance: number;      // 0-100%
    baseProduction: number;      // Base amount produced
    criticalChance: number;      // 0-100%
    criticalMultiplier: number;  // 1.5x, 2.0x, etc.
    activationTime: number;      // Cooldown in milliseconds
  };
  
  // Affixes (Prefix/Suffix modifiers)
  affixes: {
    prefixes: Affix[];  // Max based on rarity
    suffixes: Affix[];  // Max based on rarity
  };
  
  // Upgrade Ports (Socket system)
  upgradePorts: {
    slots: UpgradeSlot[];      // Available slots
    installed: UpgradeModule[]; // Installed modules
  };
  
  // Advanced Stats (Tier 2+)
  resourceCosts?: ResourceCost[]; // For advanced factories
  passiveEffects?: PassiveEffect[]; // DoT-like production
  
  // Computed
  finalStats: ComputedFactoryStats;
}
```

### Factory Activation (The "Attack")

When player clicks factory (or it auto-activates):

```typescript
interface ActivationResult {
  success: boolean;
  critical: boolean;
  resourcesProduced: { [key: string]: number };
  resourcesConsumed: { [key: string]: number };
  passiveEffectsApplied: PassiveEffect[];
  displayMessage: string;
}

function activateFactory(factory: Factory): ActivationResult {
  // Step 1: Success Roll
  const successRoll = Math.random() * 100;
  if (successRoll > factory.finalStats.successChance) {
    return { 
      success: false, 
      critical: false,
      resourcesProduced: {},
      displayMessage: "Production failed!"
    };
  }
  
  // Step 2: Cost Check (Tier 2+ factories)
  if (factory.resourceCosts) {
    const costs = calculateCosts(factory);
    if (!canAfford(costs)) {
      return { 
        success: false, 
        critical: false,
        resourcesProduced: {},
        displayMessage: "Insufficient resources!"
      };
    }
    consumeResources(costs);
  }
  
  // Step 3: Critical Roll
  const critRoll = Math.random() * 100;
  const critical = critRoll <= factory.finalStats.criticalChance;
  
  // Step 4: Calculate Production
  let production = factory.finalStats.baseProduction;
  
  if (critical) {
    production *= factory.finalStats.criticalMultiplier;
  }
  
  // Apply flat bonuses
  production += factory.finalStats.flatBonus;
  
  // Apply percentage bonuses
  production *= (1 + factory.finalStats.percentageBonus / 100);
  
  // Apply variance (±10%)
  production *= (0.9 + Math.random() * 0.2);
  
  // Step 5: Apply Passive Effects
  applyPassiveEffects(factory);
  
  // Step 6: Return Result
  return {
    success: true,
    critical,
    resourcesProduced: { [factory.resourceType]: Math.floor(production) },
    resourcesConsumed: costs,
    passiveEffectsApplied: factory.passiveEffects,
    displayMessage: critical ? "CRITICAL SUCCESS!" : "Production successful"
  };
}
```

### Upgrade Ports (Socket System)

Factories have **upgrade ports** where you install **modules**.

```typescript
enum PortType {
  Universal = "universal",   // Any module
  Production = "production", // Production-specific modules
  Efficiency = "efficiency", // Success/crit modules
  Advanced = "advanced"      // Special effect modules
}

interface UpgradeSlot {
  type: PortType;
  occupied: boolean;
}

interface UpgradeModule {
  id: string;
  name: string;
  rarity: Rarity;
  portType: PortType;
  
  // Module effects
  modifiers: {
    successChance?: number;
    criticalChance?: number;
    criticalMultiplier?: number;
    flatProduction?: number;
    percentageProduction?: number;
    activationSpeed?: number;  // Reduces cooldown
    resourceCostReduction?: number;
    criticalCostReduction?: number; // Crit doesn't consume resources
    
    // Advanced effects
    chanceToProduceDifferentResource?: {
      resource: ResourceType;
      chance: number;
      amount: number;
    };
    passiveProductionOverTime?: {
      resource: ResourceType;
      amountPerSecond: number;
      duration: number;
    };
  };
}
```

### Example Factory Progression

**Stage 1: Basic Iron Forge (Common)**
```
Name: Iron Forge
Success Chance: 70%
Base Production: 5 iron
Critical Chance: 5%
Critical Multiplier: 1.5x
Activation Time: 1000ms (1 second)
Upgrade Ports: 0
```

**Stage 2: Augmented Iron Forge (Uncommon)**
```
Name: Efficient Iron Forge of Speed
Success Chance: 70%
Base Production: 5 iron
Critical Chance: 5%
Critical Multiplier: 1.5x
Activation Time: 1000ms

Affixes:
  [Prefix] Efficient: +20% production
  [Suffix] of Speed: -15% activation time

Upgrade Ports: 1 Universal
```

**Stage 3: Fully Modded Forge (Uncommon)**
```
Name: Efficient Iron Forge of Speed
Success Chance: 85%      [+15% from module]
Base Production: 5 iron
Critical Chance: 15%     [+10% from module]
Critical Multiplier: 1.5x
Activation Time: 850ms   [15% faster from affix]

Affixes:
  [Prefix] Efficient: +20% production
  [Suffix] of Speed: -15% activation time

Upgrade Ports: 1/1 occupied
  [Universal] Precision Module: +15% success, +10% crit
```

### Passive Production (DoT Mechanic)

Some modules grant **passive production over time**, like poison/bleed in ARPGs.

```typescript
interface PassiveEffect {
  id: string;
  resource: ResourceType;
  amountPerTick: number;
  tickInterval: number; // milliseconds
  duration: number;     // total duration in ms
  remainingTime: number;
  stackable: boolean;
  maxStacks?: number;
}

// Example: "Leaking Energy Core" module
{
  name: "Leaking Core",
  effect: {
    resource: "energy",
    amountPerTick: 0.5,
    tickInterval: 1000,  // Every 1 second
    duration: 10000,     // For 10 seconds
    stackable: true,
    maxStacks: 3
  }
}
```

When factory activates → Apply passive effect → Ticks over time → Produces resources

### Tier 2+ Factories (Resource Consumption)

Advanced factories consume resources to produce better resources.

```typescript
interface ResourceCost {
  resource: ResourceType;
  baseAmount: number;
  criticalCostReduction: number; // % chance to not consume on crit
}

// Example: Steel Forge (Tier 2)
{
  name: "Steel Forge",
  produces: "steel",
  baseProduction: 3,
  costs: [
    { resource: "iron", baseAmount: 10, criticalCostReduction: 0 },
    { resource: "energy", baseAmount: 5, criticalCostReduction: 0 }
  ]
}

// With "Efficient Smelting" module:
{
  costs: [
    { resource: "iron", baseAmount: 8, criticalCostReduction: 0 },  // 20% reduction
    { resource: "energy", baseAmount: 4, criticalCostReduction: 0 }
  ]
}

// With "Critical Efficiency" module:
{
  costs: [
    { resource: "iron", baseAmount: 10, criticalCostReduction: 50 },  // 50% chance to not consume on crit
    { resource: "energy", baseAmount: 5, criticalCostReduction: 50 }
  ]
}
```

---

## Entertainment: The Defense

### Entertainment as Armor/Evasion

Entertainment venues **reduce incoming demands** from residents, like armor reduces damage in ARPGs.

```typescript
interface Entertainment {
  // Identity
  id: string;
  name: string;
  category: EntertainmentCategory;
  rarity: Rarity;
  level: number;
  
  // Defense Stats
  defenseStats: {
    demandReduction: number;      // % reduction to demand amounts
    demandFrequency: number;      // % reduction to demand frequency
    specificResourceDefense: {    // Armor types (like fire/cold resistance)
      [resource: string]: number; // % reduction for specific resource demands
    };
    evasion: number;              // % chance to completely avoid a demand
    deflection: {                 // % chance to convert demand to different resource
      chance: number;
      targetResource: ResourceType;
    };
  };
  
  // Special Effects
  passiveEffects: {
    satisfactionBonus: number;    // Increases resident satisfaction
    attractionRate: number;       // Attracts new residents faster
    demandQuality: number;        // Better rewards for fulfilling demands
  };
  
  // Capacity (like equipment slots)
  capacity: number; // How many residents it serves
}
```

### Entertainment Categories (Equipment Slots)

Like having helmet, chest, gloves, boots, etc:

```typescript
enum EntertainmentCategory {
  Restaurant = "restaurant",     // Food/Water defense
  Bar = "bar",                   // Morale, general defense
  Theater = "theater",           // Entertainment, rare resource defense
  Gym = "gym",                   // Health, reduces demand frequency
  Park = "park",                 // General satisfaction, small all-around defense
  Library = "library",           // Education, advanced resource defense
  Arcade = "arcade",             // Fun, evasion-focused
  SocialHub = "social_hub"       // Community, deflection-focused
}
```

**Slot Restrictions:**
- Can only have **one of each category** at a time
- Must **uninstall existing** to place new one
- Different from factories: More restrictive

### Demand Defense Roll

When resident makes demand:

```typescript
interface Demand {
  residentId: string;
  resource: ResourceType;
  baseAmount: number;
  priority: DemandPriority;
  deadline?: number;
}

function processDemand(demand: Demand, entertainment: Entertainment[]): Demand {
  let finalAmount = demand.baseAmount;
  let evaded = false;
  
  // Step 1: Evasion Roll (complete avoidance)
  const totalEvasion = entertainment.reduce((sum, e) => sum + e.defenseStats.evasion, 0);
  if (Math.random() * 100 < totalEvasion) {
    evaded = true;
    return { ...demand, baseAmount: 0, evaded: true };
  }
  
  // Step 2: Deflection Roll (convert to different resource)
  for (const venue of entertainment) {
    if (venue.defenseStats.deflection && Math.random() * 100 < venue.defenseStats.deflection.chance) {
      demand.resource = venue.defenseStats.deflection.targetResource;
      break;
    }
  }
  
  // Step 3: General Reduction
  const totalReduction = entertainment.reduce((sum, e) => sum + e.defenseStats.demandReduction, 0);
  finalAmount *= (1 - totalReduction / 100);
  
  // Step 4: Specific Resource Defense (like elemental resistance)
  const specificDefense = entertainment.reduce((sum, e) => {
    return sum + (e.defenseStats.specificResourceDefense[demand.resource] || 0);
  }, 0);
  finalAmount *= (1 - specificDefense / 100);
  
  // Step 5: Apply variance
  finalAmount *= (0.9 + Math.random() * 0.2);
  
  return { ...demand, baseAmount: Math.ceil(finalAmount) };
}
```

### Example Entertainment Progression

**Stage 1: No Defense**
```
Demand: 100 Iron
Player must produce full 100 iron
```

**Stage 2: Basic Restaurant**
```
Entertainment: Small Cafeteria
- Demand Reduction: 10%
- Food/Water Defense: +15%

Demand: 100 Iron → 90 Iron (10% reduction)
If demand was Food: 100 Food → 76 Food (10% general + 15% specific)
```

**Stage 3: Multiple Venues**
```
Entertainment Setup:
  - Restaurant: 10% general, 15% food/water
  - Theater: 5% general, 20% luxury goods
  - Gym: 8% demand frequency reduction

Demand: 100 Iron → 85 Iron (15% total reduction)
Demand: 100 Food → 72 Food (15% general + 15% food)
Demand frequency: Every 60 seconds → Every 55 seconds (8% reduction)
```

**Stage 4: High-End Build**
```
Entertainment Setup:
  - Elite Restaurant: 15% general, 25% food/water, +5% evasion
  - Grand Theater: 10% general, 30% luxury, +3% evasion
  - Premium Gym: 12% frequency reduction
  - Arcade: 8% evasion, 10% deflection to common resources

Total Evasion: 16% (chance to completely avoid demand)
Total Deflection: 10% (chance to convert to common resource)
Total Reduction: 25%

Demand: 100 Rare Metal
→ Roll evasion: 16% chance to avoid completely
→ Roll deflection: 10% chance to convert to Iron
→ If neither: 100 → 75 Rare Metal (25% reduction)
```

---

## Equipment Slot System

### Factory Slots

```typescript
interface FactorySlots {
  basic: FactorySlot[];      // 3 slots, unlocked early
  advanced: FactorySlot[];   // 2 slots, unlock mid-game
  specialized: FactorySlot[]; // 1 slot, unlock late-game
}

interface FactorySlot {
  id: string;
  unlocked: boolean;
  factory: Factory | null;
  restrictions?: {
    minLevel?: number;
    allowedTypes?: FactoryBaseType[];
  };
}
```

**Progression:**
- Start with 1 basic slot
- Unlock more through resident rewards
- Late game: 6 total factory slots

### Entertainment Slots

```typescript
interface EntertainmentSlots {
  [EntertainmentCategory.Restaurant]: Entertainment | null;
  [EntertainmentCategory.Bar]: Entertainment | null;
  [EntertainmentCategory.Theater]: Entertainment | null;
  [EntertainmentCategory.Gym]: Entertainment | null;
  [EntertainmentCategory.Park]: Entertainment | null;
  [EntertainmentCategory.Library]: Entertainment | null;
  [EntertainmentCategory.Arcade]: Entertainment | null;
  [EntertainmentCategory.SocialHub]: Entertainment | null;
}
```

**Rules:**
- One per category, period
- Must uninstall to replace
- Can leave empty (no penalty except no defense)

---

## Resident Demand System

### Demand as "Enemy Attack"

Residents periodically make demands. These are **attacks** on your resources.

```typescript
interface Resident {
  id: string;
  name: string;
  role: ResidentRole;
  satisfaction: number; // 0-100
  
  // Demand behavior
  demandPattern: {
    baseFrequency: number;        // ms between demands
    resources: WeightedResource[]; // What they demand
    amountScaling: number;         // Increases over time
    priorityDistribution: {       // How often each priority
      critical: number;
      high: number;
      normal: number;
      low: number;
    };
  };
  
  // Rewards they give
  rewardPool: RewardDefinition[];
}

interface WeightedResource {
  resource: ResourceType;
  weight: number; // Higher = more likely
}
```

### Demand Generation

```typescript
function generateDemand(resident: Resident, gameTime: number): Demand {
  // Step 1: Select resource based on weights
  const resource = selectWeightedResource(resident.demandPattern.resources);
  
  // Step 2: Calculate amount (scales with time/satisfaction)
  const baseAmount = calculateBaseAmount(resident, gameTime);
  const scaledAmount = baseAmount * resident.demandPattern.amountScaling;
  
  // Step 3: Select priority
  const priority = rollPriority(resident.demandPattern.priorityDistribution);
  
  // Step 4: Set deadline (if applicable)
  const deadline = priority === 'critical' ? gameTime + 60000 : undefined; // 1 minute for critical
  
  // Step 5: Apply entertainment defense
  const finalDemand = processDemand({
    residentId: resident.id,
    resource,
    baseAmount: scaledAmount,
    priority,
    deadline
  }, getActiveEntertainment());
  
  return finalDemand;
}
```

### Fulfillment and Rewards

```typescript
function fulfillDemand(demand: Demand): Reward | null {
  const resident = getResident(demand.residentId);
  
  // Check if player has resources
  if (!hasResources(demand.resource, demand.baseAmount)) {
    // Failure: Reduce satisfaction
    resident.satisfaction -= 10;
    
    if (resident.satisfaction <= 0) {
      // Resident leaves!
      removeResident(resident.id);
    }
    
    return null;
  }
  
  // Success: Consume resources
  consumeResources(demand.resource, demand.baseAmount);
  
  // Increase satisfaction
  resident.satisfaction = Math.min(100, resident.satisfaction + 15);
  
  // Roll for reward
  const reward = rollReward(resident.rewardPool, demand.priority);
  
  // Bonus rewards for high satisfaction
  if (resident.satisfaction >= 90) {
    reward.bonusModifier = 1.5; // 50% better rewards
  }
  
  return reward;
}

interface Reward {
  type: RewardType;
  item?: Factory | Entertainment | UpgradeModule;
  unlocks?: string[]; // New slots, features, etc.
  bonusModifier?: number;
}
```

---

## Progression: Research Tree via Demands

Fulfilling demands **unlocks new capabilities** like a research tree.

```typescript
interface ProgressionNode {
  id: string;
  name: string;
  description: string;
  
  // Requirements
  requirements: {
    demandsFulfilled?: number;
    specificResidents?: string[];
    satisfactionThreshold?: number;
    resourcesProducedTotal?: { [resource: string]: number };
  };
  
  // What it unlocks
  rewards: {
    factorySlots?: number;
    entertainmentSlots?: EntertainmentCategory[];
    automation?: AutomationFeature;
    passiveBonuses?: PassiveBonus[];
    newResidents?: ResidentRole[];
    factoryTypes?: FactoryBaseType[];
    modules?: UpgradeModule[];
  };
  
  // State
  unlocked: boolean;
  progress: number; // 0-100%
}
```

### Example Progression Path

```
Start
  ↓
[Fulfill Engineer's first demand]
  ↓
Unlock: Second factory slot
  ↓
[Fulfill 5 demands total]
  ↓
Unlock: First entertainment slot (Restaurant)
  ↓
[Produce 1000 total iron]
  ↓
Unlock: Automation - Auto-activate factories
  ↓
[Fulfill 10 demands, 80%+ satisfaction]
  ↓
Unlock: Second resident arrives (Farmer)
  ↓
[Fulfill Engineer + Farmer demands]
  ↓
Unlock: Tier 2 factory (Steel Forge)
  ↓
...continues...
```

---

## Automation & Quality of Life

### Automation Unlocks

```typescript
enum AutomationFeature {
  AutoActivate = "auto_activate",           // Factories auto-activate on cooldown
  AutoFulfill = "auto_fulfill",             // Auto-deliver resources to demands
  BatchProduction = "batch_production",     // Activate multiple factories at once
  SmartPriority = "smart_priority",         // Auto-prioritize critical demands
  ResourceAlert = "resource_alert",         // Alert when low on resources
  QuickCraft = "quick_craft",               // One-click crafting
  AutoInstall = "auto_install",             // Auto-install best modules
}
```

### Passive Bonuses (Prestige Rewards)

```typescript
interface PassiveBonus {
  id: string;
  name: string;
  description: string;
  
  effects: {
    globalSuccessChance?: number;
    globalCriticalChance?: number;
    globalProduction?: number;
    globalDemandReduction?: number;
    startingResources?: { [resource: string]: number };
    fasterUnlocks?: number; // % faster progression
  };
  
  stackable: boolean;
  maxStacks?: number;
}
```

---

## Prestige: Wing Promotion System

### How It Works

When you complete a wing (reach certain milestones), you can **promote** to a new wing.

```typescript
interface Wing {
  id: string;
  name: string; // "Alpha Wing", "Beta Wing", etc.
  tier: number;
  
  // Starting bonuses (from prestige)
  bonuses: PassiveBonus[];
  
  // Progression
  residents: Resident[];
  factories: Factory[];
  entertainment: Entertainment[];
  
  // Milestones for promotion
  promotionRequirements: {
    totalDemandsFulfilled: number;
    averageSatisfaction: number;
    totalResourcesProduced: { [resource: string]: number };
    residentsServed: number;
  };
}
```

### Promotion Flow

```typescript
function checkPromotionEligibility(wing: Wing): boolean {
  const req = wing.promotionRequirements;
  
  return (
    wing.totalDemandsFulfilled >= req.totalDemandsFulfilled &&
    wing.averageSatisfaction >= req.averageSatisfaction &&
    wing.residentsServed >= req.residentsServed
    // ... other checks
  );
}

function promote(currentWing: Wing): Wing {
  // Calculate commendations earned
  const commendations = calculateCommendations(currentWing);
  
  // Add to total prestige currency
  addCommendations(commendations);
  
  // Create new wing
  const newWing = createWing({
    tier: currentWing.tier + 1,
    bonuses: getActivePermanentBonuses(), // From commendation shop
    difficulty: currentWing.tier + 1
  });
  
  // Archive old wing (can revisit later?)
  archiveWing(currentWing);
  
  return newWing;
}
```

---

## Complete TypeScript Architecture

### Core Classes

```typescript
// src/game/types.ts
export enum ResourceType {
  Iron = "iron",
  Energy = "energy",
  Food = "food",
  Water = "water",
  Steel = "steel",
  RareMetals = "rare_metals",
  // ... more
}

export enum FactoryRarity {
  Common = "common",
  Uncommon = "uncommon",
  Rare = "rare",
  Unique = "unique"
}

export enum EntertainmentCategory {
  Restaurant = "restaurant",
  Bar = "bar",
  Theater = "theater",
  Gym = "gym",
  Park = "park",
  Library = "library",
  Arcade = "arcade",
  SocialHub = "social_hub"
}

// src/game/Factory.ts
export class Factory {
  // Your existing Factory class, enhanced with:
  // - Affix system
  // - Upgrade port system
  // - Resource costs
  // - Passive effects
}

// src/game/Entertainment.ts
export class Entertainment {
  private stats: EntertainmentStats;
  
  constructor(stats: EntertainmentStats) {
    this.stats = stats;
  }
  
  public calculateDefense(demand: Demand): Demand {
    // Apply defense calculations
  }
}

// src/game/Resident.ts
export class Resident {
  private demandTimer: number;
  
  public generateDemand(gameTime: number): Demand {
    // Generate demands based on patterns
  }
  
  public fulfillDemand(demand: Demand): Reward | null {
    // Handle fulfillment logic
  }
}

// src/game/GameState.ts
export class GameState {
  public wing: Wing;
  public resources: ResourcePool;
  public factories: Factory[];
  public entertainment: Entertainment[];
  public residents: Resident[];
  public progression: ProgressionTree;
  public prestige: PrestigeData;
  
  public tick(deltaTime: number): void {
    // Main game loop
    this.updateFactories(deltaTime);
    this.updatePassiveEffects(deltaTime);
    this.updateDemands(deltaTime);
    this.checkProgressionUnlocks();
  }
}
```
