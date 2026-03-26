import { BikeRecommendations } from '../constants/bike-recommendations';
import { BikeTypes } from '../constants/bikeTypes';
import BikeTypeRecommender from './BikeTypeRecommender';
import type {
  AssessmentProfile,
  BikeModel,
  BikeTypeId,
  BikeModelWithReasons,
  TopPick
} from '../types';

export const NumRecommendations = 4;

/**
 * Recommends specific bike models for a given bike type, optionally personalised
 * with the user's assessment profile.
 *
 * Usage:
 *   // With profile — scored, filtered, with reasons
 *   const recommender = new BikeModelRecommender('cargo-ebike', profile);
 *   recommender.getRecommendations();
 *
 *   // Without profile — default tier-balanced picks
 *   BikeModelRecommender.getDefaultRecommendations('cargo-ebike');
 */
export default class BikeModelRecommender {
  bikeType: BikeTypeId;
  profile: AssessmentProfile;

  constructor(bikeType: BikeTypeId, profile: AssessmentProfile) {
    this.bikeType = bikeType;
    this.profile = profile;
  }

  /**
   * Returns up to 4 recommended models, scored and ranked for this user's profile.
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

    // Ensure tier diversity: pick the best-scored model per tier first
    const picked: typeof scored = [];
    const seen = new Set<string>();
    for (const tier of ['budget', 'midrange', 'premium'] as const) {
      const best = scored.find(s => s.model.tier === tier);
      if (best) {
        picked.push(best);
        seen.add(best.model.model);
      }
    }
    // Fill remaining slots with highest-scored models not yet picked
    for (const s of scored) {
      if (picked.length >= NumRecommendations) break;
      if (!seen.has(s.model.model)) {
        picked.push(s);
        seen.add(s.model.model);
      }
    }
    // Sort by tier (budget → midrange → premium), then price asc within tier
    const TierOrder: Record<string, number> = { budget: 0, midrange: 1, premium: 2 };
    const parsePrice = (p: string) => Number(p.replace(/[^0-9.]/g, '')) || 0;
    picked.sort((a, b) =>
      (TierOrder[a.model.tier] ?? 9) - (TierOrder[b.model.tier] ?? 9)
      || parsePrice(a.model.price) - parsePrice(b.model.price)
    );

    return picked.map(s => ({
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
   * Returns all models for the current bike type, scored and sorted but not filtered or capped.
   */
  getAllModels(): BikeModelWithReasons[] {
    const candidates = BikeRecommendations[this.bikeType];
    const reasons = this._buildReasons();
    const TierOrder: Record<string, number> = { budget: 0, midrange: 1, premium: 2 };
    const parsePrice = (p: string) => Number(p.replace(/[^0-9.]/g, '')) || 0;
    const sorted = [...candidates].sort((a, b) =>
      (TierOrder[a.tier] ?? 9) - (TierOrder[b.tier] ?? 9)
      || parsePrice(a.price) - parsePrice(b.price)
    );
    return sorted.map(m => ({ ...m, reasons }));
  }

  /**
   * Returns warnings about trade-offs in the current recommendations.
   */
  getWarnings(): string[] {
    const warnings: string[] = [];
    const { geography, storage } = this.profile;
    const candidates = BikeRecommendations[this.bikeType];
    const recs = this.getRecommendations();
    const electric = BikeTypes[this.bikeType]?.electric ?? false;
    const hasLightweight = recs.some(r => r.lightweight);

    // Filtered out single-speed bikes due to hilly terrain
    const filteredSingleSpeed = geography.hilly && candidates.some(m => m.singleSpeed);
    if (filteredSingleSpeed) {
      warnings.push(
        "Single-speed models have been excluded because they're not suited for hilly terrain."
      );
    }

    // Lightweight + hilly + upper-floor conflict
    if (hasLightweight && geography.hilly && storage === 'upper-floor' && electric) {
      warnings.push(
        "We're prioritizing lightweight e-bikes for easier carrying upstairs, " +
        "but tackling hills usually requires stronger motors that tend to be heavier. " +
        "Consider test-riding on hills before buying."
      );
    }

    // Lightweight prioritized for upper-floor (without hill conflict)
    if (hasLightweight && storage === 'upper-floor' && !geography.hilly) {
      warnings.push(
        "Lightweight models are prioritized since you need to carry your bike upstairs."
      );
    }

    return warnings;
  }

  /**
   * Returns default recommendations for a bike type when no user profile is available.
   * Picks one model per tier (preferring non-lightweight), fills remaining slots,
   * and sorts by tier then price.
   */
  static getDefaultRecommendations(bikeType: BikeTypeId): BikeModelWithReasons[] {
    const allModels = BikeRecommendations[bikeType];
    if (!allModels) return [];

    const picked: BikeModel[] = [];
    const seen = new Set<string>();

    for (const tier of ['budget', 'midrange', 'premium'] as const) {
      const inTier = allModels.filter(m => m.tier === tier);
      const best = inTier.find(m => !m.lightweight) || inTier[0];
      if (best) {
        picked.push(best);
        seen.add(best.model);
      }
    }

    const remaining = allModels
      .filter(m => !seen.has(m.model))
      .sort((a, b) => (a.lightweight ? 1 : 0) - (b.lightweight ? 1 : 0));
    for (const m of remaining) {
      if (picked.length >= NumRecommendations) break;
      picked.push(m);
    }

    const TierOrder: Record<string, number> = { budget: 0, midrange: 1, premium: 2 };
    const parsePrice = (p: string) => Number(p.replace(/[^0-9.]/g, '')) || 0;
    picked.sort((a, b) => (TierOrder[a.tier] ?? 9) - (TierOrder[b.tier] ?? 9)
      || parsePrice(a.price) - parsePrice(b.price));

    return picked.map(m => ({ ...m, reasons: [] }));
  }

  /**
   * Scores a candidate model against the user's profile.
   * Higher score = better fit. Used to rank all candidates in the pool.
   */
  _scoreCandidate(model: BikeModel): number {
    const { geography, storage } = this.profile;
    let score = 0;

    // Lightweight preference for upper-floor, penalty for hills
    if (model.lightweight && storage === 'upper-floor') score += 2;
    if (model.lightweight && geography.hilly) score -= 2;

    return score;
  }

  // --- Private methods ---

  private _buildReasons(): string[] {
    const reasons: string[] = [];
    const { transportationNeeds, geography, fitnessLevel, prefersStability, storage } = this.profile;

    if (transportationNeeds.transportingKids) reasons.push('Suited for carrying kids');
    if (transportationNeeds.transportingAdults) reasons.push('Can carry adult passengers');
    if (transportationNeeds.cargo) reasons.push('Built for heavy cargo loads');
    if (transportationNeeds.soloCommuting && !transportationNeeds.cargo &&
        !transportationNeeds.transportingKids && !transportationNeeds.transportingAdults) {
      reasons.push('Great for daily commuting');
    }

    if (prefersStability) reasons.push('Three-wheel design for extra stability');

    if (geography.hilly) reasons.push('Handles hilly terrain');
    if (geography.windy) reasons.push('Handles windy conditions');
    if (geography.flat && !geography.hilly) reasons.push('Well-suited for flat terrain');

    if (fitnessLevel === 'low') reasons.push('Electric assist makes riding accessible');
    if (fitnessLevel === 'high' && !BikeTypes[this.bikeType].electric) {
      reasons.push('No motor needed at your fitness level');
    }

    const { idealBikeType } = new BikeTypeRecommender(this.profile);
    if (idealBikeType) {
      reasons.push('Compact enough for upper-floor storage');
    }
    if (storage === 'garage') reasons.push('Plenty of storage space available');
    if (storage === 'upper-floor') reasons.push('Lightweight options prioritized for carrying upstairs');
    if (geography.hilly) reasons.push('Single-speed bikes excluded — not suited for hills');

    return reasons;
  }
}
