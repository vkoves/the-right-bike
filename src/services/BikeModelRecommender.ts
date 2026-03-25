import { BikeRecommendations } from '../constants/bike-recommendations';
import { BikeTypes } from '../constants/bikeTypes';
import type {
  AssessmentProfile,
  BikeTypeId,
  BikeModelWithReasons,
  RecommendationTier,
  TieredRecommendations,
  TopPick
} from '../types';

const Tiers: RecommendationTier[] = ['budget', 'midrange', 'premium'];

/**
 * Recommends specific bike models based on the user's full assessment profile.
 *
 * Encapsulates two layers of recommendation logic:
 * 1. Bike TYPE selection — given the user's needs, geography, fitness, and storage,
 *    determines the right category (e.g. "longtail-ebike" vs "cargo-bike").
 * 2. Bike MODEL recommendations — given the type, returns budget/midrange/premium
 *    picks with reasons explaining why each suits the user's profile.
 *
 * Usage:
 *   const recommender = new BikeModelRecommender({
 *     transportationNeeds: { cargo: true, transportingKids: true, ... },
 *     geography: { hilly: true, windy: false, flat: false },
 *     fitnessLevel: 'medium',
 *     storage: 'garage'
 *   });
 *
 *   recommender.bikeType        // → 'longtail-ebike'
 *   recommender.idealBikeType   // → null (or original type if storage-downgraded)
 *
 *   recommender.getRecommendations()
 *   // → { budget: { model, price, image, review, reasons }, ... }
 *
 *   recommender.getTopPick()
 *   // → { tier, model, price, image, review, reasons }
 */
export default class BikeModelRecommender {
  profile: AssessmentProfile;
  bikeType: BikeTypeId;
  idealBikeType: BikeTypeId | null;

  constructor(profile: AssessmentProfile) {
    this.profile = profile;
    this.bikeType = this._determineBikeType();
    this.idealBikeType = this._applyStorageDowngrade();
  }

  /**
   * Returns budget/midrange/premium recommendations tailored to the user's profile.
   * Filters out models that don't suit the user's geography (e.g. single-speed on hills).
   */
  getRecommendations(): TieredRecommendations {
    const allModels = BikeRecommendations[this.bikeType];
    const reasons = this._buildReasons();

    const result = {} as TieredRecommendations;
    for (const tier of Tiers) {
      const best = this._pickBestModel(allModels[tier]);
      result[tier] = {
        ...best,
        reasons
      };
    }
    return result;
  }

  /**
   * Returns the single best model across all tiers for this user's profile.
   */
  getTopPick(): TopPick {
    const recs = this.getRecommendations();

    let bestTier: RecommendationTier = 'midrange';
    let bestScore = -Infinity;

    for (const tier of Tiers) {
      const score = this.scoreModel(recs[tier], tier);
      if (score > bestScore) {
        bestScore = score;
        bestTier = tier;
      }
    }

    return { tier: bestTier, ...recs[bestTier] };
  }

  /**
   * Scores a specific bike model against the user's profile.
   * Used internally to rank models but exposed for testing and debugging.
   */
  scoreModel(_model: BikeModelWithReasons | Record<string, never>, tier: RecommendationTier = 'midrange'): number {
    let score = 0;

    // Midrange is the default best pick for most users
    if (tier === 'midrange') score += 2;
    if (tier === 'budget') score += 1;

    // Low fitness or challenging terrain — favour premium (better assist, components)
    if (this.profile.fitnessLevel === 'low') score += tier === 'premium' ? 3 : 0;
    if (this.profile.geography.hilly) score += tier === 'premium' ? 1 : 0;

    // Budget-conscious: upper-floor storage suggests smaller living situation
    if (this.profile.storage === 'upper-floor' && tier === 'budget') score += 1;

    return score;
  }

  // --- Private methods ---

  /**
   * Given an array of candidate models for a tier, filters out unsuitable ones
   * based on the user's profile and returns the best match.
   * Falls back to the first model if all are filtered out.
   */
  private _pickBestModel(candidates: BikeModel[]): BikeModel {
    const { geography, storage } = this.profile;

    const suitable = candidates.filter(m => {
      // Single-speed bikes are unsuitable on hilly terrain
      if (geography.hilly && m.singleSpeed) return false;
      return true;
    });

    // Score remaining candidates — prefer lightweight for upper-floor storage
    const scored = (suitable.length > 0 ? suitable : candidates).map(m => {
      let score = 0;
      if (m.lightweight && storage === 'upper-floor') score += 2;
      return { model: m, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].model;
  }

  private _determineBikeType(): BikeTypeId {
    const { transportationNeeds } = this.profile;

    const needsCargo = transportationNeeds.cargo ||
                       transportationNeeds.transportingKids ||
                       transportationNeeds.transportingAdults;

    const needsAssistance = this._needsAssistance(needsCargo);

    if (needsCargo) {
      if (transportationNeeds.transportingKids || transportationNeeds.transportingAdults) {
        return needsAssistance ? 'longtail-ebike' : 'longtail-bike';
      }
      return needsAssistance ? 'cargo-ebike' : 'cargo-bike';
    }

    return needsAssistance ? 'commuter-ebike' : 'regular-bike';
  }

  private _needsAssistance(needsCargo: boolean): boolean {
    const { geography, fitnessLevel } = this.profile;

    if (fitnessLevel === 'high') {
      return this.profile.transportationNeeds.transportingAdults ||
             (geography.hilly && needsCargo);
    }

    return needsCargo ||
           geography.windy ||
           geography.hilly ||
           fitnessLevel === 'low';
  }

  private _applyStorageDowngrade(): BikeTypeId | null {
    const typeInfo = BikeTypes[this.bikeType];
    if (this.profile.storage === 'upper-floor' && typeInfo.bulky && typeInfo.storageDowngrade) {
      const ideal = this.bikeType;
      this.bikeType = typeInfo.storageDowngrade;
      return ideal;
    }
    return null;
  }

  private _buildReasons(): string[] {
    const reasons: string[] = [];
    const { transportationNeeds, geography, fitnessLevel, storage } = this.profile;

    if (transportationNeeds.transportingKids) reasons.push('Suited for carrying kids');
    if (transportationNeeds.transportingAdults) reasons.push('Can carry adult passengers');
    if (transportationNeeds.cargo) reasons.push('Built for heavy cargo loads');
    if (transportationNeeds.soloCommuting && !transportationNeeds.cargo &&
        !transportationNeeds.transportingKids && !transportationNeeds.transportingAdults) {
      reasons.push('Great for daily commuting');
    }

    if (geography.hilly) reasons.push('Handles hilly terrain');
    if (geography.windy) reasons.push('Handles windy conditions');
    if (geography.flat && !geography.hilly) reasons.push('Well-suited for flat terrain');

    if (fitnessLevel === 'low') reasons.push('Electric assist makes riding accessible');
    if (fitnessLevel === 'high' && !BikeTypes[this.bikeType].electric) {
      reasons.push('No motor needed at your fitness level');
    }

    if (this.idealBikeType) {
      reasons.push('Compact enough for upper-floor storage');
    }
    if (storage === 'garage') reasons.push('Plenty of storage space available');

    return reasons;
  }
}
