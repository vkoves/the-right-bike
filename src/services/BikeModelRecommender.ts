import { BikeRecommendations } from '../constants/bike-recommendations';
import { BikeTypes } from '../constants/bikeTypes';
import type {
  AssessmentProfile,
  BikeModel,
  BikeTypeId,
  BikeModelWithReasons,
  TopPick
} from '../types';

const NumRecommendations = 3;

/**
 * Recommends specific bike models based on the user's full assessment profile.
 *
 * Encapsulates two layers of recommendation logic:
 * 1. Bike TYPE selection — given the user's needs, geography, fitness, and storage,
 *    determines the right category (e.g. "longtail-ebike" vs "cargo-bike").
 * 2. Bike MODEL recommendations — given the type, scores and ranks all candidates
 *    and returns the top 3 picks with reasons explaining why each suits the profile.
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
 *   // → [{ model, price, tier, image, review, reasons }, ...]
 *
 *   recommender.getTopPick()
 *   // → { model, price, tier, image, review, reasons }
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
   * Returns up to 3 recommended models, scored and ranked for this user's profile.
   * Filters out unsuitable models (e.g. single-speed on hills) and scores the rest
   * based on geography, storage, and tier fit.
   */
  getRecommendations(): BikeModelWithReasons[] {
    const candidates = BikeRecommendations[this.bikeType];
    const reasons = this._buildReasons();

    const suitable = candidates.filter(m => {
      if (this.profile.geography.hilly && m.singleSpeed) return false;
      return true;
    });

    const pool = suitable.length > 0 ? suitable : candidates;
    const scored = pool.map(m => ({ model: m, score: this._scoreCandidate(m) }));
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, NumRecommendations).map(s => ({
      ...s.model,
      reasons
    }));
  }

  /**
   * Returns the single best model for this user's profile.
   */
  getTopPick(): TopPick {
    const recs = this.getRecommendations();
    return { ...recs[0] };
  }

  /**
   * Scores a candidate model against the user's profile.
   * Higher score = better fit. Used to rank all candidates in the pool.
   */
  _scoreCandidate(model: BikeModel): number {
    const { geography, storage, fitnessLevel } = this.profile;
    let score = 0;

    // Tier baseline — midrange is the default sweet spot
    if (model.tier === 'midrange') score += 2;
    if (model.tier === 'budget') score += 1;

    // Low fitness or challenging terrain — favour premium (better assist, components)
    if (fitnessLevel === 'low' && model.tier === 'premium') score += 3;
    if (geography.hilly && model.tier === 'premium') score += 1;

    // Budget-conscious: upper-floor storage suggests smaller living situation
    if (storage === 'upper-floor' && model.tier === 'budget') score += 1;

    // Lightweight preference for upper-floor, penalty for hills
    if (model.lightweight && storage === 'upper-floor') score += 2;
    if (model.lightweight && geography.hilly) score -= 2;

    return score;
  }

  // --- Private methods ---

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
    if (storage === 'upper-floor') reasons.push('Lightweight options prioritized for carrying upstairs');
    if (geography.hilly) reasons.push('Single-speed bikes excluded — not suited for hills');

    return reasons;
  }
}
