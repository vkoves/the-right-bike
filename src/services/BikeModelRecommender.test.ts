import { describe, it, expect } from 'vitest';
import BikeModelRecommender from './BikeModelRecommender';
import type { AssessmentProfile, RecommendationTier } from '../types';

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

describe('BikeModelRecommender', () => {
  // --- Bike type determination ---

  describe('bike type determination', () => {
    it('recommends regular-bike for solo commuter, flat, medium fitness', () => {
      const r = new BikeModelRecommender(makeProfile());
      expect(r.bikeType).toBe('regular-bike');
    });

    it('recommends commuter-ebike for solo commuter, hilly terrain', () => {
      const r = new BikeModelRecommender(makeProfile({
        geography: { hilly: true, windy: false, flat: false }
      }));
      expect(r.bikeType).toBe('commuter-ebike');
    });

    it('recommends commuter-ebike for solo commuter, windy conditions', () => {
      const r = new BikeModelRecommender(makeProfile({
        geography: { hilly: false, windy: true, flat: false }
      }));
      expect(r.bikeType).toBe('commuter-ebike');
    });

    it('recommends commuter-ebike for solo commuter, low fitness', () => {
      const r = new BikeModelRecommender(makeProfile({ fitnessLevel: 'low' }));
      expect(r.bikeType).toBe('commuter-ebike');
    });

    it('recommends regular-bike for solo commuter, high fitness, flat', () => {
      const r = new BikeModelRecommender(makeProfile({ fitnessLevel: 'high' }));
      expect(r.bikeType).toBe('regular-bike');
    });

    it('recommends cargo-bike for cargo needs, flat, medium fitness', () => {
      const r = new BikeModelRecommender(makeCargoProfile({ fitnessLevel: 'high' }));
      expect(r.bikeType).toBe('cargo-bike');
    });

    it('recommends cargo-ebike for cargo needs, medium fitness', () => {
      const r = new BikeModelRecommender(makeCargoProfile({ fitnessLevel: 'medium' }));
      expect(r.bikeType).toBe('cargo-ebike');
    });

    it('recommends longtail-bike for transporting kids, high fitness, flat', () => {
      const r = new BikeModelRecommender(makeLongtailProfile({ fitnessLevel: 'high' }));
      expect(r.bikeType).toBe('longtail-bike');
    });

    it('recommends longtail-ebike for transporting kids, medium fitness', () => {
      const r = new BikeModelRecommender(makeLongtailProfile({ fitnessLevel: 'medium' }));
      expect(r.bikeType).toBe('longtail-ebike');
    });

    it('recommends longtail-ebike for transporting adults regardless of fitness', () => {
      const r = new BikeModelRecommender(makeProfile({
        transportationNeeds: {
          soloCommuting: false, cargo: false,
          transportingKids: false, transportingAdults: true
        },
        fitnessLevel: 'high'
      }));
      expect(r.bikeType).toBe('longtail-ebike');
    });
  });

  // --- Needs assistance logic ---

  describe('needs assistance (electric)', () => {
    it('high fitness + cargo + hilly = needs assistance', () => {
      const r = new BikeModelRecommender(makeCargoProfile({
        fitnessLevel: 'high',
        geography: { hilly: true, windy: false, flat: false }
      }));
      expect(r.bikeType).toBe('cargo-ebike');
    });

    it('high fitness + cargo + flat = no assistance', () => {
      const r = new BikeModelRecommender(makeCargoProfile({
        fitnessLevel: 'high',
        geography: { hilly: false, windy: false, flat: true }
      }));
      expect(r.bikeType).toBe('cargo-bike');
    });

    it('high fitness + solo + hilly = no assistance (no cargo)', () => {
      const r = new BikeModelRecommender(makeProfile({
        fitnessLevel: 'high',
        geography: { hilly: true, windy: false, flat: false }
      }));
      expect(r.bikeType).toBe('regular-bike');
    });

    it('medium fitness + hilly = needs assistance', () => {
      const r = new BikeModelRecommender(makeProfile({
        fitnessLevel: 'medium',
        geography: { hilly: true, windy: false, flat: false }
      }));
      expect(r.bikeType).toBe('commuter-ebike');
    });
  });

  // --- Storage downgrade ---

  describe('storage downgrade', () => {
    it('downgrades cargo-ebike to commuter-ebike for upper-floor storage', () => {
      const r = new BikeModelRecommender(makeCargoProfile({
        fitnessLevel: 'medium',
        storage: 'upper-floor'
      }));
      expect(r.bikeType).toBe('commuter-ebike');
      expect(r.idealBikeType).toBe('cargo-ebike');
    });

    it('downgrades longtail-ebike to commuter-ebike for upper-floor storage', () => {
      const r = new BikeModelRecommender(makeLongtailProfile({
        fitnessLevel: 'medium',
        storage: 'upper-floor'
      }));
      expect(r.bikeType).toBe('commuter-ebike');
      expect(r.idealBikeType).toBe('longtail-ebike');
    });

    it('downgrades cargo-bike to regular-bike for upper-floor storage', () => {
      const r = new BikeModelRecommender(makeCargoProfile({
        fitnessLevel: 'high',
        storage: 'upper-floor'
      }));
      expect(r.bikeType).toBe('regular-bike');
      expect(r.idealBikeType).toBe('cargo-bike');
    });

    it('does not downgrade for garage storage', () => {
      const r = new BikeModelRecommender(makeCargoProfile({
        fitnessLevel: 'medium',
        storage: 'garage'
      }));
      expect(r.bikeType).toBe('cargo-ebike');
      expect(r.idealBikeType).toBeNull();
    });

    it('does not downgrade non-bulky types for upper-floor', () => {
      const r = new BikeModelRecommender(makeProfile({
        fitnessLevel: 'medium',
        storage: 'upper-floor'
      }));
      expect(r.bikeType).toBe('regular-bike');
      expect(r.idealBikeType).toBeNull();
    });
  });

  // --- getRecommendations ---

  describe('getRecommendations', () => {
    it('returns budget, midrange, and premium tiers', () => {
      const r = new BikeModelRecommender(makeProfile());
      const recs = r.getRecommendations();

      expect(recs).toHaveProperty('budget');
      expect(recs).toHaveProperty('midrange');
      expect(recs).toHaveProperty('premium');
    });

    it('each tier includes model, price, image, review, and reasons', () => {
      const r = new BikeModelRecommender(makeProfile());
      const recs = r.getRecommendations();

      for (const tier of ['budget', 'midrange', 'premium'] as const) {
        expect(recs[tier]).toHaveProperty('model');
        expect(recs[tier]).toHaveProperty('price');
        expect(recs[tier]).toHaveProperty('image');
        expect(recs[tier]).toHaveProperty('review');
        expect(recs[tier]).toHaveProperty('reasons');
        expect(Array.isArray(recs[tier].reasons)).toBe(true);
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
        const r = new BikeModelRecommender(profile);
        const recs = r.getRecommendations();
        expect(recs.budget.model).toBeTruthy();
        expect(recs.midrange.model).toBeTruthy();
        expect(recs.premium.model).toBeTruthy();
      }
    });

    it('includes at least one reason for every recommendation', () => {
      const r = new BikeModelRecommender(makeCargoProfile({
        geography: { hilly: true, windy: true, flat: false },
        fitnessLevel: 'low',
        storage: 'upper-floor'
      }));
      const recs = r.getRecommendations();

      for (const tier of ['budget', 'midrange', 'premium'] as const) {
        expect(recs[tier].reasons.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  // --- getTopPick ---

  describe('getTopPick', () => {
    it('returns a single recommendation with a tier field', () => {
      const r = new BikeModelRecommender(makeProfile());
      const pick = r.getTopPick();

      expect(pick).toHaveProperty('tier');
      expect(['budget', 'midrange', 'premium']).toContain(pick.tier);
      expect(pick).toHaveProperty('model');
      expect(pick).toHaveProperty('reasons');
    });

    it('pick matches one of the tiers from getRecommendations', () => {
      const r = new BikeModelRecommender(makeCargoProfile());
      const recs = r.getRecommendations();
      const pick = r.getTopPick();

      expect(pick.model).toBe(recs[pick.tier].model);
    });

    it('defaults to midrange for a typical profile', () => {
      const r = new BikeModelRecommender(makeProfile());
      const pick = r.getTopPick();
      expect(pick.tier).toBe('midrange');
    });

    it('favours premium for low fitness + hilly terrain', () => {
      const r = new BikeModelRecommender(makeProfile({
        fitnessLevel: 'low',
        geography: { hilly: true, windy: false, flat: false }
      }));
      const pick = r.getTopPick();
      expect(pick.tier).toBe('premium');
    });
  });

  // --- scoreModel ---

  describe('scoreModel', () => {
    it('returns a number', () => {
      const r = new BikeModelRecommender(makeProfile());
      const score = r.scoreModel({} as any);
      expect(typeof score).toBe('number');
    });

    it('scores midrange higher than budget for a typical profile', () => {
      const r = new BikeModelRecommender(makeProfile());
      const mid = r.scoreModel({}, 'midrange');
      const budget = r.scoreModel({}, 'budget');
      expect(mid).toBeGreaterThan(budget);
    });

    it('boosts premium for low fitness', () => {
      const r = new BikeModelRecommender(makeProfile({ fitnessLevel: 'low' }));
      const premium = r.scoreModel({}, 'premium');
      const mid = r.scoreModel({}, 'midrange');
      expect(premium).toBeGreaterThan(mid);
    });
  });

  // --- Reasons ---

  describe('reasons', () => {
    it('mentions kids when transporting kids', () => {
      const r = new BikeModelRecommender(makeLongtailProfile());
      const recs = r.getRecommendations();
      expect(recs.budget.reasons).toContain('Suited for carrying kids');
    });

    it('mentions adults when transporting adults', () => {
      const r = new BikeModelRecommender(makeProfile({
        transportationNeeds: {
          soloCommuting: false, cargo: false,
          transportingKids: false, transportingAdults: true
        }
      }));
      const recs = r.getRecommendations();
      expect(recs.budget.reasons).toContain('Can carry adult passengers');
    });

    it('mentions hilly terrain', () => {
      const r = new BikeModelRecommender(makeProfile({
        geography: { hilly: true, windy: false, flat: false }
      }));
      const recs = r.getRecommendations();
      expect(recs.budget.reasons).toContain('Handles hilly terrain');
    });

    it('mentions storage downgrade', () => {
      const r = new BikeModelRecommender(makeCargoProfile({
        fitnessLevel: 'medium',
        storage: 'upper-floor'
      }));
      const recs = r.getRecommendations();
      expect(recs.budget.reasons).toContain('Compact enough for upper-floor storage');
    });

    it('mentions commuting for solo commuter with no cargo', () => {
      const r = new BikeModelRecommender(makeProfile());
      const recs = r.getRecommendations();
      expect(recs.budget.reasons).toContain('Great for daily commuting');
    });

    it('mentions no motor needed for high fitness non-electric', () => {
      const r = new BikeModelRecommender(makeProfile({ fitnessLevel: 'high' }));
      const recs = r.getRecommendations();
      expect(recs.budget.reasons).toContain('No motor needed at your fitness level');
    });
  });
});
