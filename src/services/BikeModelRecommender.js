import { BIKE_RECOMMENDATIONS } from '../constants/bike-recommendations';
import { BikeTypes } from '../constants/bikeTypes';

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
  /**
   * @param {Object} profile - The user's complete assessment profile
   * @param {Object} profile.transportationNeeds - What the user is carrying
   * @param {Object} profile.geography - Terrain conditions (hilly, windy, flat)
   * @param {string} profile.fitnessLevel - 'low' | 'medium' | 'high'
   * @param {string} profile.storage - 'garage' | 'basement' | 'upper-floor'
   */
  constructor(profile) {
    this.profile = profile;
    this.bikeType = this._determineBikeType();
    this.idealBikeType = this._applyStorageDowngrade();
  }

  /**
   * Returns budget/midrange/premium recommendations tailored to the user's profile.
   * Each tier includes the model info plus an array of reasons explaining why
   * this model suits their specific needs.
   *
   * @returns {{ budget: Object, midrange: Object, premium: Object }}
   */
  getRecommendations() {
    const models = BIKE_RECOMMENDATIONS[this.bikeType];
    const reasons = this._buildReasons();

    const result = {};
    for (const tier of ['budget', 'midrange', 'premium']) {
      result[tier] = {
        ...models[tier],
        reasons
      };
    }
    return result;
  }

  /**
   * Returns the single best model across all tiers for this user's profile.
   * Includes a `tier` field ('budget' | 'midrange' | 'premium') indicating
   * which price tier it came from.
   *
   * @returns {{ tier: string, model: string, price: string, image: string, review: string, reasons: string[] }}
   */
  getTopPick() {
    const recs = this.getRecommendations();
    const tiers = ['budget', 'midrange', 'premium'];

    let bestTier = 'midrange';
    let bestScore = -Infinity;

    for (const tier of tiers) {
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
   *
   * @param {Object} model - A bike model object from bike-recommendations.js
   * @param {string} tier - 'budget' | 'midrange' | 'premium'
   * @returns {number} A relevance score (higher is better)
   */
  scoreModel(model, tier = 'midrange') {
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
   * Determines the bike type based on transportation needs, geography, and fitness.
   * Mirrors the logic previously in BikeAssessment.calculateRecommendation.
   */
  _determineBikeType() {
    const { transportationNeeds, geography, fitnessLevel } = this.profile;

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

  /**
   * Determines if the user needs electric assistance.
   * For high fitness, only if transporting adults or hauling cargo on hills.
   * Otherwise, cargo + not-high fitness, windy, hilly, or low fitness.
   */
  _needsAssistance(needsCargo) {
    const { geography, fitnessLevel } = this.profile;

    if (fitnessLevel === 'high') {
      return this.profile.transportationNeeds.transportingAdults ||
             (geography.hilly && needsCargo);
    }

    return (needsCargo && fitnessLevel !== 'high') ||
           geography.windy ||
           geography.hilly ||
           fitnessLevel === 'low';
  }

  /**
   * Applies storage downgrade if the recommended type is too bulky for
   * upper-floor storage. Returns the original type as idealBikeType, or null.
   */
  _applyStorageDowngrade() {
    const typeInfo = BikeTypes[this.bikeType];
    if (this.profile.storage === 'upper-floor' && typeInfo.bulky && typeInfo.storageDowngrade) {
      const ideal = this.bikeType;
      this.bikeType = typeInfo.storageDowngrade;
      return ideal;
    }
    return null;
  }

  /**
   * Builds human-readable reasons explaining why the recommended type
   * suits this user's profile.
   */
  _buildReasons() {
    const reasons = [];
    const { transportationNeeds, geography, fitnessLevel, storage } = this.profile;

    // Transportation need reasons
    if (transportationNeeds.transportingKids) reasons.push('Suited for carrying kids');
    if (transportationNeeds.transportingAdults) reasons.push('Can carry adult passengers');
    if (transportationNeeds.cargo) reasons.push('Built for heavy cargo loads');
    if (transportationNeeds.soloCommuting && !transportationNeeds.cargo &&
        !transportationNeeds.transportingKids && !transportationNeeds.transportingAdults) {
      reasons.push('Great for daily commuting');
    }

    // Geography reasons
    if (geography.hilly) reasons.push('Handles hilly terrain');
    if (geography.windy) reasons.push('Handles windy conditions');
    if (geography.flat && !geography.hilly) reasons.push('Well-suited for flat terrain');

    // Fitness reasons
    if (fitnessLevel === 'low') reasons.push('Electric assist makes riding accessible');
    if (fitnessLevel === 'high' && !BikeTypes[this.bikeType].electric) {
      reasons.push('No motor needed at your fitness level');
    }

    // Storage reasons
    if (this.idealBikeType) {
      reasons.push('Compact enough for upper-floor storage');
    }
    if (storage === 'garage') reasons.push('Plenty of storage space available');

    return reasons;
  }
}
