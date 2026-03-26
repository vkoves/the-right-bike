import { describe, it, expect } from 'vitest';
import { encodeProfile, decodeProfile } from './AssessmentForm';
import type { AssessmentProfile } from '../types';

const DefaultProfile: AssessmentProfile = {
  transportationNeeds: {
    soloCommuting: true,
    cargo: false,
    transportingKids: false,
    transportingAdults: false,
  },
  geography: { windy: false, hilly: false, flat: true },
  fitnessLevel: 'medium',
  prefersStability: false,
  storage: 'garage',
};

describe('AssessmentForm encoding', () => {
  it('encodes a default profile to a 10-digit string', () => {
    const encoded = encodeProfile(DefaultProfile);
    expect(encoded).toMatch(/^\d{10}$/);
    expect(encoded).toBe('1000001100');
  });

  it('round-trips a default profile', () => {
    const encoded = encodeProfile(DefaultProfile);
    const decoded = decodeProfile(encoded);
    expect(decoded).toEqual(DefaultProfile);
  });

  it('encodes all boolean flags correctly', () => {
    const profile: AssessmentProfile = {
      transportationNeeds: {
        soloCommuting: true,
        cargo: true,
        transportingKids: true,
        transportingAdults: true,
      },
      geography: { windy: true, hilly: true, flat: true },
      fitnessLevel: 'high',
      prefersStability: true,
      storage: 'upper-floor',
    };
    const encoded = encodeProfile(profile);
    expect(encoded).toBe('1111111212');
  });

  it('round-trips a complex profile', () => {
    const profile: AssessmentProfile = {
      transportationNeeds: {
        soloCommuting: false,
        cargo: true,
        transportingKids: true,
        transportingAdults: false,
      },
      geography: { windy: true, hilly: false, flat: false },
      fitnessLevel: 'low',
      prefersStability: true,
      storage: 'basement',
    };
    expect(decodeProfile(encodeProfile(profile))).toEqual(profile);
  });

  it('round-trips all fitness levels', () => {
    for (const level of ['low', 'medium', 'high'] as const) {
      const profile = { ...DefaultProfile, fitnessLevel: level };
      expect(decodeProfile(encodeProfile(profile))!.fitnessLevel).toBe(level);
    }
  });

  it('round-trips all storage types', () => {
    for (const type of ['garage', 'basement', 'upper-floor'] as const) {
      const profile = { ...DefaultProfile, storage: type };
      expect(decodeProfile(encodeProfile(profile))!.storage).toBe(type);
    }
  });
});

describe('AssessmentForm decoding', () => {
  it('returns null for too-short string', () => {
    expect(decodeProfile('12345')).toBeNull();
  });

  it('returns null for too-long string', () => {
    expect(decodeProfile('12345678901')).toBeNull();
  });

  it('returns null for non-digit characters', () => {
    expect(decodeProfile('abcdefghij')).toBeNull();
  });

  it('returns null for invalid fitness digit', () => {
    expect(decodeProfile('1000001300')).toBeNull();
  });

  it('returns null for invalid storage digit', () => {
    expect(decodeProfile('1000001103')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(decodeProfile('')).toBeNull();
  });
});
