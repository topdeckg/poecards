import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameState, Factory, ProductionResult, Resident, ResourceType, LogEntry } from '../types';
import { createInitialGameState } from '../utils/initialization';
import { calculateProductionResult } from '../utils/productionEngine';
import { getEffectiveStats, rollModifier } from '../utils/affixes';
// import { generateDemand } from '../utils/demandEngine';
import { createTutorialBasicFactory, createTutorialEngineer } from '../utils/tutorial';

interface GameStore extends GameState {
  // Actions
  activateFactory: (factoryId: string) => ProductionResult | null;
  fulfillDemand: (residentId: string, demandId: string) => boolean;
  addFactory: (factory: Factory) => void;
  removeFactory: (factoryId: string) => void;
  addResident: (resident: Resident) => void;
  addToFactoryInventory: (factory: Factory) => void;
  installFactoryToFirstSlot: (factoryId: string) => boolean;
  startTutorialIfNeeded: () => void;
  log: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  setLogSettings: (partial: Partial<GameState['logSettings']>) => void;
  setShowTutorialModal: (value: boolean) => void;
  setShowUpgradeTutorialModal: (value: boolean) => void;
  useOrbOfAlteration: (factoryId?: string) => boolean;
  useOrbOfTransmutation: (factoryId?: string) => boolean;
  selectFactory: (factoryId: string | null) => void;
  selectEntertainment: (entertainmentId: string | null) => void;
  gameTick: () => void;
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    // Initial state
    ...createInitialGameState(),

    // Actions
    activateFactory: (factoryId: string) => {
      const state = get();
      const factory = state.factories.find(f => f.id === factoryId);
      
      if (!factory) return null;
      
      // Check cooldown (effective stats after affixes)
      const now = Date.now();
      const eff = getEffectiveStats(factory);
      if (factory.lastActivation + eff.cooldown * 1000 > now) {
        return null;
      }

      // Check resource costs
      if (factory.consumes) {
        for (const cost of factory.consumes) {
          if (state.resources[cost.resource] < cost.amount) {
            return null; // Not enough resources
          }
        }
      }

      // Calculate production
  const result = calculateProductionResult(factory);

      // Update state
      set((draft) => {
        // Consume resources
        if (factory.consumes) {
          factory.consumes.forEach(cost => {
            draft.resources[cost.resource] = (draft.resources[cost.resource] || 0) - cost.amount;
            if (!draft.knownResources.includes(cost.resource as ResourceType)) {
              draft.knownResources.push(cost.resource as ResourceType);
            }
          });
        }

        // Add produced resources
        draft.resources[factory.produces] = (draft.resources[factory.produces] || 0) + result.amountProduced;
        if (!draft.knownResources.includes(factory.produces as ResourceType)) {
          draft.knownResources.push(factory.produces as ResourceType);
        }

        // Update factory
        const factoryIndex = draft.factories.findIndex(f => f.id === factoryId);
        if (factoryIndex !== -1) {
          draft.factories[factoryIndex].lastActivation = now;
        }

        // Log
        const subtypeManual: import('../types').LogSubtype[] = ['manual'];
        subtypeManual.push(result.success ? 'success' : 'failure');
        if (result.isCritical) subtypeManual.push('critical');
        draft.logs.push({
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: now,
          source: 'factory',
          subtype: subtypeManual,
          message: result.success
            ? `${factory.name}: produced ${result.amountProduced} ${factory.produces}${result.isCritical ? ' (CRIT)' : ''}`
            : `${factory.name}: production failed`,
          factoryId: factory.id,
        });
        });

      return result;
    },

    fulfillDemand: (residentId: string, demandId: string) => {
      const state = get();
      const resident = state.residents.find(r => r.id === residentId);
      
      if (!resident || !resident.currentDemand || resident.currentDemand.id !== demandId) {
        return false;
      }

      const demand = resident.currentDemand;
      
      // Check if we have enough resources
      if ((state.resources[demand.resource] || 0) < demand.amount) {
        return false;
      }

      // Fulfill demand
      const preFulfilled = state.totalDemandsFulfilled;
      set((draft) => {
        draft.resources[demand.resource] = (draft.resources[demand.resource] || 0) - demand.amount;
        if (!draft.knownResources.includes(demand.resource as ResourceType)) {
          draft.knownResources.push(demand.resource as ResourceType);
        }
        
        const residentIndex = draft.residents.findIndex(r => r.id === residentId);
        if (residentIndex !== -1) {
          draft.residents[residentIndex].currentDemand!.fulfilled = true;
          draft.residents[residentIndex].satisfaction = Math.min(100, 
            draft.residents[residentIndex].satisfaction + 10);
          
          // Move to history; do not generate a new demand yet per onboarding flow
          draft.residents[residentIndex].demandHistory.push(demand);
          draft.residents[residentIndex].currentDemand = null;
        }
        
        draft.totalDemandsFulfilled += 1;

        // Log demand fulfillment
        draft.logs.push({
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          source: 'demand',
          subtype: ['success', 'manual'],
          message: `Fulfilled demand: ${demand.amount} ${demand.resource}`,
        });

        // First-demand reward: grant 1 Orb of Transmutation and show upgrade tutorial
        if (preFulfilled === 0) {
          draft.craftingMaterials['OrbOfTransmutation'] = (draft.craftingMaterials['OrbOfTransmutation'] || 0) + 1;
          draft.showUpgradeTutorialModal = true;
          draft.logs.push({
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
            source: 'system',
            subtype: ['info'],
            message: 'Reward received: Orb of Transmutation x1',
          });
        }
      });

      return true;
    },

    addFactory: (factory: Factory) => {
      set((draft) => {
        draft.factories.push(factory);
      });
    },

    removeFactory: (factoryId: string) => {
      set((draft) => {
        draft.factories = draft.factories.filter(f => f.id !== factoryId);
      });
    },

    addResident: (resident: Resident) => {
      set((draft) => {
        draft.residents.push(resident);
      });
    },

    addToFactoryInventory: (factory: Factory) => {
      set((draft) => {
        draft.factoryInventory.push(factory);
      });
    },

    installFactoryToFirstSlot: (factoryId: string) => {
      let installed = false;
      set((draft) => {
        const idx = draft.factoryInventory.findIndex(f => f.id === factoryId);
        if (idx === -1) return;
        const item = draft.factoryInventory[idx];

        // Ensure at least 1 slot unlocked
        if (draft.factorySlots <= 0) {
          draft.factorySlots = 1;
        }

        // Find first empty slot
        const emptyIndex = draft.factories.length < draft.factorySlots
          ? draft.factories.length
          : draft.factories.findIndex(() => false); // no-op

        if (emptyIndex !== -1 && draft.factories.length < draft.factorySlots) {
          draft.factories.push(item);
          draft.factoryInventory.splice(idx, 1);
          installed = true;
          draft.logs.push({
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
            source: 'factory',
            subtype: ['install', 'manual'],
            message: `Installed ${item.name} into Slot ${draft.factories.length}`,
            factoryId: item.id,
          });
        }
      });
      return installed;
    },

    selectFactory: (factoryId: string | null) => {
      set((draft) => {
        draft.selectedFactory = factoryId;
      });
    },

    selectEntertainment: (entertainmentId: string | null) => {
      set((draft) => {
        draft.selectedEntertainment = entertainmentId;
      });
    },

    startTutorialIfNeeded: () => {
      set((draft) => {
        if (draft.tutorialStarted || draft.residents.length > 0) return;
        draft.tutorialStarted = true;
        const eng = createTutorialEngineer();
        draft.residents.push(eng);
        draft.factoryInventory.push(createTutorialBasicFactory());
        draft.factorySlots = Math.max(draft.factorySlots, 1);
        draft.showTutorialModal = true;
        draft.logs.push({
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          source: 'system',
          subtype: ['info'],
          message: `A new resident (${eng.name}, ${eng.role}) has arrived with a demand for ${eng.currentDemand?.amount} ${eng.currentDemand?.resource}.`,
        });
      });
    },

    log: (entry) => {
      const now = Date.now();
      set((draft) => {
        draft.logs.push({ id: `log-${now}-${Math.random()}`, timestamp: now, ...entry });
      });
    },

    clearLogs: () => {
      set((draft) => { draft.logs = []; });
    },

    setLogSettings: (partial) => {
      set((draft) => { draft.logSettings = { ...draft.logSettings, ...partial }; });
    },

    setShowTutorialModal: (value: boolean) => {
      set((draft) => { draft.showTutorialModal = value; });
    },

    setShowUpgradeTutorialModal: (value: boolean) => {
      set((draft) => { draft.showUpgradeTutorialModal = value; });
    },

    gameTick: () => {
      const now = Date.now();
      set((draft) => {
        // Tutorial trigger
        if (!draft.tutorialStarted && draft.residents.length === 0) {
          draft.tutorialStarted = true;
          // Give first resident and basic factory (in inventory)
          const eng = createTutorialEngineer();
          draft.residents.push(eng);
          draft.factoryInventory.push(createTutorialBasicFactory());
          // Unlock the first slot but leave it empty for the tutorial
          draft.factorySlots = Math.max(draft.factorySlots, 1);
          draft.showTutorialModal = true;
          draft.logs.push({
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: now,
            source: 'system',
            subtype: ['info'],
            message: `A new resident (${eng.name}, ${eng.role}) has arrived with a demand for ${eng.currentDemand?.amount} ${eng.currentDemand?.resource}.`,
          });
        }

        draft.gameTime = now;
        
        // Auto-activate factories
        draft.factories.forEach((factory, index) => {
          if (factory.stats.autoActivation && factory.stats.autoInterval) {
            if (factory.lastActivation + factory.stats.autoInterval * 1000 <= now) {
              // Check resources and produce
              const canProduce = !factory.consumes || 
                factory.consumes.every(cost => 
                  draft.resources[cost.resource] >= cost.amount
                );
              
              if (canProduce) {
                const result = calculateProductionResult(factory);
                
                if (factory.consumes) {
                  factory.consumes.forEach(cost => {
                    draft.resources[cost.resource] -= cost.amount;
                  });
                }
                
                draft.resources[factory.produces] = 
                  (draft.resources[factory.produces] || 0) + result.amountProduced;
                
                draft.factories[index].lastActivation = now;

                // Log auto production
                const subtypeAuto: import('../types').LogSubtype[] = ['auto'];
                subtypeAuto.push(result.success ? 'success' : 'failure');
                if (result.isCritical) subtypeAuto.push('critical');
                draft.logs.push({
                  id: `log-${Date.now()}-${Math.random()}`,
                  timestamp: now,
                  source: 'factory',
                  subtype: subtypeAuto,
                  message: result.success
                    ? `${factory.name} auto-produced ${result.amountProduced} ${factory.produces}${result.isCritical ? ' (CRIT)' : ''}`
                    : `${factory.name} auto-production failed`,
                  factoryId: factory.id,
                });
              }
            }
          }
        });
      });
    },

    useOrbOfAlteration: (factoryId?: string) => {
      const state = get();
      const targetId = factoryId ?? state.selectedFactory ?? undefined;
      if (!targetId) return false;
      if ((state.craftingMaterials['OrbOfAlteration'] || 0) <= 0) return false;
      const f = state.factories.find(ff => ff.id === targetId);
      if (!f) return false;
      set((draft) => {
        const df = draft.factories.find(ff => ff.id === targetId)!;
        df.portSlots = df.portSlots.map(slot => ({ ...slot, modifier: rollModifier(slot.type) }));
        draft.craftingMaterials['OrbOfAlteration'] -= 1;
        draft.logs.push({
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          source: 'system',
          subtype: ['info'],
          message: `Used Orb of Alteration on ${df.name}.`,
          factoryId: df.id,
        });
      });
      return true;
    },

    useOrbOfTransmutation: (factoryId?: string) => {
      const state = get();
      const targetId = factoryId ?? state.selectedFactory ?? undefined;
      if (!targetId) return false;
      if ((state.craftingMaterials['OrbOfTransmutation'] || 0) <= 0) return false;
      const f = state.factories.find(ff => ff.id === targetId);
      if (!f) return false;
      set((draft) => {
        const df = draft.factories.find(ff => ff.id === targetId)!;
        // Upgrade rarity if still Common -> Uncommon and roll 1-2 modifiers
        if (df.rarity === 'Common') {
          df.rarity = 'Uncommon';
        }
        const count = 1 + Math.round(Math.random()); // 1 or 2 affixes
        const slots = df.portSlots.slice();
        for (let i = 0; i < Math.min(count, slots.length); i++) {
          const slot = slots[i];
          slot.modifier = rollModifier(slot.type);
        }
        draft.craftingMaterials['OrbOfTransmutation'] -= 1;
        draft.logs.push({
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          source: 'system',
          subtype: ['info'],
          message: `Used Orb of Transmutation on ${df.name}.`,
          factoryId: df.id,
        });
      });
      return true;
    },

    saveGame: () => {
      const state = get();
      localStorage.setItem('stationMasterSave', JSON.stringify(state));
    },

    loadGame: () => {
      const saved = localStorage.getItem('stationMasterSave');
      if (saved) {
        try {
          const loadedState = JSON.parse(saved);
          set(loadedState);
        } catch (error) {
          console.error('Failed to load game:', error);
        }
      }
    },

    resetGame: () => {
      set(createInitialGameState());
      localStorage.removeItem('stationMasterSave');
    },
  }))
);
