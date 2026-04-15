import { describe, it, expect } from 'vitest';
import BikeTypeRecommender from './BikeTypeRecommender';
import type { AssessmentProfile } from '../types';

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

describe('BikeTypeRecommender', () => {
  describe('bike type determination', () => {
    it('recommends regular-bike for solo commuter, flat, medium fitness', () => {
      const r = new BikeTypeRecommender(makeProfile());
      expect(r.bikeType).toBe('regular-bike');
    });

    it('recommends commuter-ebike for solo commuter, hilly terrain', () => {
      const r = new BikeTypeRecommender(makeProfile({
        geography: { hilly: true, windy: false, flat: false }
      }));
      expect(r.bikeType).toBe('commuter-ebike');
    });

    it('recommends commuter-ebike for solo commuter, windy conditions', () => {
      const r = new BikeTypeRecommender(makeProfile({
        geography: { hilly: false, windy: true, flat: false }
      }));
      expect(r.bikeType).toBe('commuter-ebike');
    });

    it('recommends commuter-ebike for solo commuter, low fitness', () => {
      const r = new BikeTypeRecommender(makeProfile({ fitnessLevel: 'low' }));
      expect(r.bikeType).toBe('commuter-ebike');
    });

    it('recommends regular-bike for solo commuter, high fitness, flat', () => {
      const r = new BikeTypeRecommender(makeProfile({ fitnessLevel: 'high' }));
      expect(r.bikeType).toBe('regular-bike');
    });

    it('recommends cargo-bike for cargo needs, flat, high fitness', () => {
      const r = new BikeTypeRecommender(makeCargoProfile({ fitnessLevel: 'high' }));
      expect(r.bikeType).toBe('cargo-bike');
    });

    it('recommends cargo-ebike for cargo needs, medium fitness', () => {
      const r = new BikeTypeRecommender(makeCargoProfile({ fitnessLevel: 'medium' }));
      expect(r.bikeType).toBe('cargo-ebike');
    });

    it('recommends longtail-bike for transporting kids, high fitness, flat', () => {
      const r = new BikeTypeRecommender(makeLongtailProfile({ fitnessLevel: 'high' }));
      expect(r.bikeType).toBe('longtail-bike');
    });

    it('recommends longtail-ebike for transporting kids, medium fitness', () => {
      const r = new BikeTypeRecommender(makeLongtailProfile({ fitnessLevel: 'medium' }));
      expect(r.bikeType).toBe('longtail-ebike');
    });

    it('recommends longtail-ebike for transporting adults regardless of fitness', () => {
      const r = new BikeTypeRecommender(makeProfile({
        transportationNeeds: {
          soloCommuting: false, cargo: false,
          transportingKids: false, transportingAdults: true
        },
        fitnessLevel: 'high'
      }));
      expect(r.bikeType).toBe('longtail-ebike');
    });
  });

  describe('needs assistance (electric)', () => {
    it('high fitness + cargo + hilly = needs assistance', () => {
      const r = new BikeTypeRecommender(makeCargoProfile({
        fitnessLevel: 'high',
        geography: { hilly: true, windy: false, flat: false }
      }));
      expect(r.bikeType).toBe('cargo-ebike');
    });

    it('high fitness + cargo + flat = no assistance', () => {
      const r = new BikeTypeRecommender(makeCargoProfile({
        fitnessLevel: 'high',
        geography: { hilly: false, windy: false, flat: true }
      }));
      expect(r.bikeType).toBe('cargo-bike');
    });

    it('high fitness + solo + hilly = no assistance (no cargo)', () => {
      const r = new BikeTypeRecommender(makeProfile({
        fitnessLevel: 'high',
        geography: { hilly: true, windy: false, flat: false }
      }));
      expect(r.bikeType).toBe('regular-bike');
    });

    it('medium fitness + hilly = needs assistance', () => {
      const r = new BikeTypeRecommender(makeProfile({
        fitnessLevel: 'medium',
        geography: { hilly: true, windy: false, flat: false }
      }));
      expect(r.bikeType).toBe('commuter-ebike');
    });
  });

  describe('storage alternate', () => {
    it('suggests commuter-ebike as alternate for cargo-ebike with upper-floor storage', () => {
      const r = new BikeTypeRecommender(makeCargoProfile({
        fitnessLevel: 'medium',
        storage: 'upper-floor'
      }));
      expect(r.bikeType).toBe('cargo-ebike');
      expect(r.alternateBikeType).toBe('commuter-ebike');
    });

    it('suggests commuter-ebike as alternate for longtail-ebike with upper-floor storage', () => {
      const r = new BikeTypeRecommender(makeLongtailProfile({
        fitnessLevel: 'medium',
        storage: 'upper-floor'
      }));
      expect(r.bikeType).toBe('longtail-ebike');
      expect(r.alternateBikeType).toBe('commuter-ebike');
    });

    it('suggests regular-bike as alternate for cargo-bike with upper-floor storage', () => {
      const r = new BikeTypeRecommender(makeCargoProfile({
        fitnessLevel: 'high',
        storage: 'upper-floor'
      }));
      expect(r.bikeType).toBe('cargo-bike');
      expect(r.alternateBikeType).toBe('regular-bike');
    });

    it('suggests alternate for basement storage', () => {
      const r = new BikeTypeRecommender(makeCargoProfile({
        fitnessLevel: 'medium',
        storage: 'basement'
      }));
      expect(r.bikeType).toBe('cargo-ebike');
      expect(r.alternateBikeType).toBe('commuter-ebike');
    });

    it('does not suggest alternate for garage storage', () => {
      const r = new BikeTypeRecommender(makeCargoProfile({
        fitnessLevel: 'medium',
        storage: 'garage'
      }));
      expect(r.bikeType).toBe('cargo-ebike');
      expect(r.alternateBikeType).toBeNull();
    });

    it('does not suggest alternate for outdoor storage', () => {
      const r = new BikeTypeRecommender(makeCargoProfile({
        fitnessLevel: 'medium',
        storage: 'outdoor'
      }));
      expect(r.bikeType).toBe('cargo-ebike');
      expect(r.alternateBikeType).toBeNull();
    });

    it('does not suggest alternate for non-bulky types with upper-floor', () => {
      const r = new BikeTypeRecommender(makeProfile({
        fitnessLevel: 'medium',
        storage: 'upper-floor'
      }));
      expect(r.bikeType).toBe('regular-bike');
      expect(r.alternateBikeType).toBeNull();
    });
  });
});
