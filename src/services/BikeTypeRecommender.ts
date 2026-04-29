import { BikeTypes } from '../constants/bikeTypes';
import type { AssessmentProfile, BikeTypeId } from '../types';

/**
 * Determines the best bike TYPE for a given assessment profile.
 *
 * Handles two layers:
 * 1. Picks the ideal type based on needs, geography, fitness, and stability preference.
 * 2. When the ideal type is bulky and storage is constrained (not garage/outdoor),
 *    sets an alternateBikeType — a smaller bike the user could consider instead.
 *    The main recommendation always stays as the ideal bike.
 *
 * Usage:
 *   const recommender = new BikeTypeRecommender(profile);
 *   recommender.bikeType          // → 'cargo-ebike' (always the ideal)
 *   recommender.alternateBikeType // → 'commuter-ebike' (smaller option, or null)
 */
export default class BikeTypeRecommender {
  bikeType: BikeTypeId;
  alternateBikeType: BikeTypeId | null;

  constructor(profile: AssessmentProfile) {
    this.bikeType = this._determineBikeType(profile);
    this.alternateBikeType = this._findAlternate(profile);
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
      // Long tail for people transport only; any combo with bulk cargo → front-loader.
      const preferLongtail = (transportationNeeds.transportingKids || transportationNeeds.transportingAdults) &&
                             !transportationNeeds.cargo;
      if (preferLongtail) {
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

  private _findAlternate(profile: AssessmentProfile): BikeTypeId | null {
    const typeInfo = BikeTypes[this.bikeType];
    const hasEasyStorage = profile.storage === 'garage' || profile.storage === 'outdoor';
    if (!hasEasyStorage && typeInfo.bulky && typeInfo.storageDowngrade) {
      return typeInfo.storageDowngrade;
    }
    return null;
  }
}
