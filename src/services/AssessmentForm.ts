import type { AssessmentProfile, FitnessLevel, StorageType } from '../types';

/**
 * Encodes an AssessmentProfile into a compact numeric string for use in query params.
 *
 * Format: 10-digit string, one digit per field:
 *   [0] soloCommuting    (0/1)
 *   [1] cargo            (0/1)
 *   [2] transportingKids (0/1)
 *   [3] transportingAdults (0/1)
 *   [4] windy            (0/1)
 *   [5] hilly            (0/1)
 *   [6] flat             (0/1)
 *   [7] fitnessLevel     (0=low, 1=medium, 2=high)
 *   [8] prefersStability (0/1)
 *   [9] storage          (0=garage, 1=basement, 2=upper-floor)
 */

const FitnessValues: FitnessLevel[] = ['low', 'medium', 'high'];
const StorageValues: StorageType[] = ['garage', 'basement', 'upper-floor'];

export function encodeProfile(profile: AssessmentProfile): string {
  const { transportationNeeds: t, geography: g } = profile;
  return [
    +t.soloCommuting,
    +t.cargo,
    +t.transportingKids,
    +t.transportingAdults,
    +g.windy,
    +g.hilly,
    +g.flat,
    FitnessValues.indexOf(profile.fitnessLevel),
    +profile.prefersStability,
    StorageValues.indexOf(profile.storage),
  ].join('');
}

export function decodeProfile(encoded: string): AssessmentProfile | null {
  if (!/^\d{10}$/.test(encoded)) return null;

  const d = encoded.split('').map(Number);

  const fitnessLevel = FitnessValues[d[7]];
  const storage = StorageValues[d[9]];
  if (!fitnessLevel || !storage) return null;

  return {
    transportationNeeds: {
      soloCommuting: d[0] === 1,
      cargo: d[1] === 1,
      transportingKids: d[2] === 1,
      transportingAdults: d[3] === 1,
    },
    geography: {
      windy: d[4] === 1,
      hilly: d[5] === 1,
      flat: d[6] === 1,
    },
    fitnessLevel,
    prefersStability: d[8] === 1,
    storage,
  };
}
