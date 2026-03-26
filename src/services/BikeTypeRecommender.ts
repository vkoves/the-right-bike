import { BikeTypes } from '../constants/bikeTypes';
import type { AssessmentProfile, BikeTypeId } from '../types';

/**
 * Determines the best bike TYPE for a given assessment profile.
 *
 * Handles two layers:
 * 1. Picks the ideal type based on needs, geography, fitness, and stability preference.
 * 2. Applies a storage downgrade when the ideal type is too bulky for upper-floor storage.
 *
 * Usage:
 *   const recommender = new BikeTypeRecommender(profile);
 *   recommender.bikeType       // → 'commuter-ebike'
 *   recommender.idealBikeType  // → null (or original type if storage-downgraded)
 */
export default class BikeTypeRecommender {
  bikeType: BikeTypeId;
  idealBikeType: BikeTypeId | null;

  constructor(profile: AssessmentProfile) {
    this.bikeType = this._determineBikeType(profile);
    this.idealBikeType = this._applyStorageDowngrade(profile);
  }

  private _determineBikeType(profile: AssessmentProfile): BikeTypeId {
    const { transportationNeeds, prefersStability } = profile;

    const needsCargo = transportationNeeds.cargo ||
                       transportationNeeds.transportingKids ||
                       transportationNeeds.transportingAdults;

    if (prefersStability) {
      return needsCargo ? 'cargo-etrike' : 'etrike';
    }

    const needsAssistance = this._needsAssistance(profile, needsCargo);

    if (needsCargo) {
      if (transportationNeeds.transportingKids || transportationNeeds.transportingAdults) {
        return needsAssistance ? 'longtail-ebike' : 'longtail-bike';
      }
      return needsAssistance ? 'cargo-ebike' : 'cargo-bike';
    }

    return needsAssistance ? 'commuter-ebike' : 'regular-bike';
  }

  private _needsAssistance(profile: AssessmentProfile, needsCargo: boolean): boolean {
    const { geography, fitnessLevel } = profile;

    if (fitnessLevel === 'high') {
      return profile.transportationNeeds.transportingAdults ||
             (geography.hilly && needsCargo);
    }

    return needsCargo ||
           geography.windy ||
           geography.hilly ||
           fitnessLevel === 'low';
  }

  private _applyStorageDowngrade(profile: AssessmentProfile): BikeTypeId | null {
    const typeInfo = BikeTypes[this.bikeType];
    if (profile.storage === 'upper-floor' && typeInfo.bulky && typeInfo.storageDowngrade) {
      const ideal = this.bikeType;
      this.bikeType = typeInfo.storageDowngrade;
      return ideal;
    }
    return null;
  }
}
