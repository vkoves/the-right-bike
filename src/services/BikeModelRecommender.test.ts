import { describe, it, expect } from 'vitest';
import BikeModelRecommender, { NumRecommendations } from './BikeModelRecommender';
import BikeTypeRecommender from './BikeTypeRecommender';
import type { AssessmentProfile, BikeTypeId } from '../types';

// Reusable profile factories
function makeProfile(overrides: Partial<AssessmentProfile> = {}): AssessmentProfile {
  return {
    transportationNeeds: {
      soloCommuting: true,
      cargo: false,
      transportingKids: false,
      transportingAdults: false
    },
    geography: { hilly: false, windy: false, flat: true },
    fitnessLevel: 'medium',
    prefersStability: false,
    storage: 'garage',
    ...overrides
  };
}

function makeCargoProfile(overrides: Partial<AssessmentProfile> = {}): AssessmentProfile {
  return makeProfile({
    transportationNeeds: {
      soloCommuting: false,
      cargo: true,
      transportingKids: false,
      transportingAdults: false
    },
    ...overrides
  });
}

function makeLongtailProfile(overrides: Partial<AssessmentProfile> = {}): AssessmentProfile {
  return makeProfile({
    transportationNeeds: {
      soloCommuting: false,
      cargo: false,
      transportingKids: true,
      transportingAdults: false
    },
    ...overrides
  });
}

// Helper: determine type then create a model recommender with it
function makeRecommender(profile: AssessmentProfile): BikeModelRecommender {
  const { bikeType } = new BikeTypeRecommender(profile);
  return new BikeModelRecommender(bikeType, profile);
}

describe('BikeModelRecommender', () => {
  // --- getRecommendations ---

  describe('getRecommendations', () => {
    it('returns an array of up to 4 recommendations', () => {
      const r = makeRecommender(makeProfile());
      const recs = r.getRecommendations();

      expect(Array.isArray(recs)).toBe(true);
      expect(recs.length).toBeGreaterThanOrEqual(1);
      expect(recs.length).toBeLessThanOrEqual(4);
    });

    it('each recommendation includes model, price, tier, image, review, and reasons', () => {
      const r = makeRecommender(makeProfile());
      const recs = r.getRecommendations();

      for (const rec of recs) {
        expect(rec).toHaveProperty('model');
        expect(rec).toHaveProperty('price');
        expect(rec).toHaveProperty('tier');
        expect(rec).toHaveProperty('image');
        expect(rec).toHaveProperty('review');
        expect(rec).toHaveProperty('reasons');
        expect(Array.isArray(rec.reasons)).toBe(true);
      }
    });

    it('returns valid results for every bike type', () => {
      const profiles = [
        makeProfile(),                                           // regular-bike
        makeProfile({ fitnessLevel: 'low' }),                    // commuter-ebike
        makeCargoProfile({ fitnessLevel: 'high' }),              // cargo-bike
        makeCargoProfile({ fitnessLevel: 'medium' }),            // cargo-ebike
        makeLongtailProfile({ fitnessLevel: 'high' }),           // longtail-bike
        makeLongtailProfile({ fitnessLevel: 'medium' }),         // longtail-ebike
      ];

      for (const profile of profiles) {
        const r = makeRecommender(profile);
        const recs = r.getRecommendations();
        expect(recs.length).toBeGreaterThanOrEqual(1);
        expect(recs[0].model).toBeTruthy();
      }
    });

    it('includes at least one reason for every recommendation', () => {
      const r = makeRecommender(makeCargoProfile({
        geography: { hilly: true, windy: true, flat: false },
        fitnessLevel: 'low',
        storage: 'upper-floor'
      }));
      const recs = r.getRecommendations();

      for (const rec of recs) {
        expect(rec.reasons.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  // --- getTopPick ---

  describe('getTopPick', () => {
    it('returns a single recommendation with a tier field', () => {
      const r = makeRecommender(makeProfile());
      const pick = r.getTopPick();

      expect(pick).toHaveProperty('tier');
      expect(['budget', 'midrange', 'premium']).toContain(pick.tier);
      expect(pick).toHaveProperty('model');
      expect(pick).toHaveProperty('reasons');
    });

    it('top pick is the first recommendation', () => {
      const r = makeRecommender(makeCargoProfile());
      const recs = r.getRecommendations();
      const pick = r.getTopPick();

      expect(pick.model).toBe(recs[0].model);
    });
  });

  // --- Reasons ---

  describe('reasons', () => {
    it('mentions kids when transporting kids', () => {
      const r = makeRecommender(makeLongtailProfile());
      const recs = r.getRecommendations();
      expect(recs[0].reasons).toContain('Suited for carrying kids');
    });

    it('mentions adults when transporting adults', () => {
      const r = makeRecommender(makeProfile({
        transportationNeeds: {
          soloCommuting: false, cargo: false,
          transportingKids: false, transportingAdults: true
        }
      }));
      const recs = r.getRecommendations();
      expect(recs[0].reasons).toContain('Can carry adult passengers');
    });

    it('mentions hilly terrain', () => {
      const r = makeRecommender(makeProfile({
        geography: { hilly: true, windy: false, flat: false }
      }));
      const recs = r.getRecommendations();
      expect(recs[0].reasons).toContain('Handles hilly terrain');
    });

    it('mentions storage alternate', () => {
      const r = makeRecommender(makeCargoProfile({
        fitnessLevel: 'medium',
        storage: 'upper-floor'
      }));
      const recs = r.getRecommendations();
      expect(recs[0].reasons).toContain('Easier-to-store alternative available');
    });

    it('mentions commuting for solo commuter with no cargo', () => {
      const r = makeRecommender(makeProfile());
      const recs = r.getRecommendations();
      expect(recs[0].reasons).toContain('Great for daily commuting');
    });

    it('mentions no motor needed for high fitness non-electric', () => {
      const r = makeRecommender(makeProfile({ fitnessLevel: 'high' }));
      const recs = r.getRecommendations();
      expect(recs[0].reasons).toContain('No motor needed at your fitness level');
    });

    it('mentions lightweight prioritized for upper-floor storage', () => {
      const r = makeRecommender(makeProfile({ storage: 'upper-floor' }));
      const recs = r.getRecommendations();
      expect(recs[0].reasons).toContain('Lightweight options prioritized for carrying upstairs');
    });

    it('mentions single-speed excluded on hilly terrain', () => {
      const r = makeRecommender(makeProfile({
        geography: { hilly: true, windy: false, flat: false }
      }));
      const recs = r.getRecommendations();
      expect(recs[0].reasons).toContain('Single-speed bikes excluded — not suited for hills');
    });
  });

  // --- Model filtering and scoring ---

  describe('model filtering and scoring', () => {
    it('excludes singleSpeed models on hilly terrain', () => {
      const r = makeRecommender(makeProfile({
        fitnessLevel: 'high',
        geography: { hilly: true, windy: false, flat: false }
      }));
      const recs = r.getRecommendations();
      for (const rec of recs) {
        expect(rec.singleSpeed).toBeFalsy();
      }
    });

    it('allows singleSpeed models on flat terrain', () => {
      const r = makeRecommender(makeProfile({
        fitnessLevel: 'high',
        geography: { hilly: false, windy: false, flat: true }
      }));
      const recs = r.getRecommendations();
      expect(recs[0].model).toBeTruthy();
    });

    it('prefers lightweight models for upper-floor storage', () => {
      const r = makeRecommender(makeProfile({
        fitnessLevel: 'high',
        storage: 'upper-floor'
      }));
      const recs = r.getRecommendations();
      expect(recs.some(rec => rec.lightweight)).toBe(true);
    });

    it('deprioritizes lightweight models on hilly terrain', () => {
      const r = makeRecommender(makeProfile({
        geography: { hilly: true, windy: false, flat: false }
      }));
      const recs = r.getRecommendations();
      const budgetPicks = recs.filter(rec => rec.tier === 'budget');
      expect(budgetPicks.some(rec => !rec.lightweight)).toBe(true);
    });

    it('shows non-lightweight regular bikes with garage storage', () => {
      const r = makeRecommender(makeProfile({
        fitnessLevel: 'high',
        storage: 'garage'
      }));
      const recs = r.getRecommendations();
      const models = recs.map(rec => rec.model);
      expect(models).toContain('Gazelle Tour Populair');
      expect(models).toContain('Retrospec Beaumont City Bike');
    });
  });

  // --- getDefaultRecommendations (no profile fallback) ---

  describe('getDefaultRecommendations', () => {
    it('returns up to NumRecommendations results', () => {
      const recs = BikeModelRecommender.getDefaultRecommendations('commuter-ebike');
      expect(recs.length).toBeLessThanOrEqual(NumRecommendations);
      expect(recs.length).toBeGreaterThanOrEqual(1);
    });

    it('includes one model from each available tier', () => {
      const recs = BikeModelRecommender.getDefaultRecommendations('commuter-ebike');
      const tiers = recs.map(r => r.tier);
      expect(tiers).toContain('budget');
      expect(tiers).toContain('midrange');
      expect(tiers).toContain('premium');
    });

    it('sorts by tier (budget → midrange → premium) then by price within tier', () => {
      const recs = BikeModelRecommender.getDefaultRecommendations('commuter-ebike');
      const tierOrder: Record<string, number> = { budget: 0, midrange: 1, premium: 2 };

      for (let i = 1; i < recs.length; i++) {
        const prevTier = tierOrder[recs[i - 1].tier];
        const currTier = tierOrder[recs[i].tier];
        if (prevTier === currTier) {
          const prevPrice = Number(recs[i - 1].price.replace(/[^0-9.]/g, ''));
          const currPrice = Number(recs[i].price.replace(/[^0-9.]/g, ''));
          expect(prevPrice).toBeLessThanOrEqual(currPrice);
        } else {
          expect(prevTier).toBeLessThan(currTier);
        }
      }
    });

    it('prefers non-lightweight models per tier', () => {
      const recs = BikeModelRecommender.getDefaultRecommendations('commuter-ebike');
      const budgetPicks = recs.filter(r => r.tier === 'budget');
      expect(budgetPicks.some(r => !r.lightweight)).toBe(true);
    });

    it('returns empty reasons array for each model', () => {
      const recs = BikeModelRecommender.getDefaultRecommendations('regular-bike');
      for (const rec of recs) {
        expect(rec.reasons).toEqual([]);
      }
    });

    it('returns empty array for unknown bike type', () => {
      const recs = BikeModelRecommender.getDefaultRecommendations('nonexistent' as BikeTypeId);
      expect(recs).toEqual([]);
    });

    it('works for every bike type', () => {
      const types: BikeTypeId[] = [
        'regular-bike', 'commuter-ebike', 'cargo-bike',
        'cargo-ebike', 'longtail-bike', 'longtail-ebike',
        'etrike', 'cargo-etrike'
      ];
      for (const type of types) {
        const recs = BikeModelRecommender.getDefaultRecommendations(type);
        expect(recs.length).toBeGreaterThanOrEqual(1);
        expect(recs[0].model).toBeTruthy();
      }
    });
  });

  // --- Tier diversity ---

  describe('tier diversity', () => {
    it('includes one model per available tier for commuter-ebike', () => {
      const r = makeRecommender(makeProfile({
        geography: { hilly: false, windy: true, flat: false },
        storage: 'upper-floor'
      }));
      const recs = r.getRecommendations();
      const tiers = recs.map(rec => rec.tier);
      expect(tiers).toContain('budget');
      expect(tiers).toContain('midrange');
      expect(tiers).toContain('premium');
    });

    it('includes lightweight Ride1Up Roadster for upper-floor commuter-ebike', () => {
      const r = makeRecommender(makeProfile({
        geography: { hilly: false, windy: true, flat: false },
        storage: 'upper-floor'
      }));
      const recs = r.getRecommendations();
      const models = recs.map(rec => rec.model);
      expect(models).toContain('Ride1Up Roadster V3');
    });
  });

  // --- Warnings ---

  describe('getWarnings', () => {
    it('warns about single-speed exclusion on hilly terrain', () => {
      const r = makeRecommender(makeProfile({
        fitnessLevel: 'high',
        geography: { hilly: true, windy: false, flat: false }
      }));
      const warnings = r.getWarnings();
      expect(warnings.some(w => w.includes('Single-speed'))).toBe(true);
    });

    it('warns about lightweight priority for upper-floor on flat terrain', () => {
      const r = makeRecommender(makeProfile({
        geography: { hilly: false, windy: true, flat: false },
        storage: 'upper-floor'
      }));
      const warnings = r.getWarnings();
      expect(warnings.some(w => w.includes('Lightweight'))).toBe(true);
    });

    it('warns about lightweight vs hills conflict for upper-floor on hilly terrain', () => {
      const r = makeRecommender(makeProfile({
        geography: { hilly: true, windy: false, flat: false },
        storage: 'upper-floor'
      }));
      const warnings = r.getWarnings();
      expect(warnings.some(w => w.includes('hills'))).toBe(true);
    });

    it('returns no warnings for simple garage + flat profile', () => {
      const r = makeRecommender(makeProfile({
        geography: { hilly: false, windy: false, flat: true },
        storage: 'garage',
        fitnessLevel: 'high'
      }));
      const warnings = r.getWarnings();
      expect(warnings.every(w => !w.includes('Single-speed'))).toBe(true);
      expect(warnings.every(w => !w.includes('Lightweight'))).toBe(true);
      expect(warnings.every(w => !w.includes('hills'))).toBe(true);
    });
  });

  // --- getAllModels ---

  describe('getAllModels', () => {
    it('returns all candidates for the bike type without cap', () => {
      const r = makeRecommender(makeProfile({
        geography: { hilly: false, windy: true, flat: false }
      }));
      const all = r.getAllModels();
      const recs = r.getRecommendations();
      expect(all.length).toBeGreaterThanOrEqual(recs.length);
    });

    it('includes models that getRecommendations may have dropped', () => {
      const r = makeRecommender(makeProfile({
        geography: { hilly: false, windy: true, flat: false },
        storage: 'garage'
      }));
      const all = r.getAllModels();
      const recs = r.getRecommendations();
      if (all.length > recs.length) {
        const recModels = new Set(recs.map(m => m.model));
        const extra = all.filter(m => !recModels.has(m.model));
        expect(extra.length).toBeGreaterThan(0);
      }
    });

    it('does not filter out single-speed models', () => {
      const r = makeRecommender(makeProfile({
        fitnessLevel: 'high',
        geography: { hilly: true, windy: false, flat: false }
      }));
      const all = r.getAllModels();
      expect(all.some(m => m.singleSpeed)).toBe(true);
    });
  });

  // --- Explicit bikeType override ---

  describe('explicit bikeType (comparison mode)', () => {
    it('returns models for the specified type, not the profile-determined type', () => {
      const profile = makeProfile();
      const r = new BikeModelRecommender('cargo-ebike', profile);
      const recs = r.getRecommendations();
      expect(recs.length).toBeGreaterThanOrEqual(1);
      expect(r.bikeType).toBe('cargo-ebike');
    });

    it('still applies profile-based scoring to the overridden type', () => {
      const profile = makeProfile({
        fitnessLevel: 'high',
        storage: 'upper-floor'
      });
      const r = new BikeModelRecommender('commuter-ebike', profile);
      const recs = r.getRecommendations();
      expect(recs.some(rec => rec.lightweight)).toBe(true);
    });
  });
});
