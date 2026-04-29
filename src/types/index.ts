// --- Bike Type IDs ---
export type BikeTypeId =
  | 'regular-bike'
  | 'commuter-ebike'
  | 'cargo-bike'
  | 'cargo-ebike'
  | 'longtail-bike'
  | 'longtail-ebike'
  | 'etrike'
  | 'cargo-etrike';

// --- Bike Type metadata (bikeTypes.ts) ---
export interface BikeType {
  /** Full display name shown in headings and the recommendation card (e.g. "Front-Loader Cargo eBike"). */
  title: string;
  /** Condensed name for space-constrained UI — dropdowns, labels, "Also Consider" tiles (e.g. "Front-Loader eBike"). */
  shortTitle: string;
  image: string;
  electric: boolean;
  /** True for large bikes that are hard to store indoors (cargo, longtail, trike). Triggers the storage-alternate flow. */
  bulky: boolean;
  /** Smaller bike to suggest when storage is constrained (e.g. commuter-ebike as a fallback for cargo-ebike). */
  storageDowngrade?: BikeTypeId;
  /** Related types shown in comparison UI. Order is significant — first entry is the primary alternative. */
  similarTypes?: BikeTypeId[];
  /** Recommendation-page body copy, written in second person ("A cargo eBike is perfect for your needs…"). */
  description: string;
  features: string[];
  priceRange: string;
  costs: BikeCost;
  /** Show the "Need To Haul More? Get A Trailer!" panel below the recommendation image. */
  showTrailerTip?: boolean;
  /** Sibling types shown in the "Also Consider" panel. Typically the people-vs-cargo counterpart plus a trike option. */
  alsoConsiderTypes?: BikeTypeId[];
  /** One-sentence prompt explaining why a user might prefer one of the alsoConsiderTypes. */
  alsoConsiderNote?: string;
}

// --- Costs (vehicleCosts.ts) ---
export interface BikeCost {
  purchase: number;
  maintenance: number;
  fuel: number;
  insurance: number;
}

export interface CarCostsConfig {
  purchase: number;
  purchaseSource: string;
  purchaseUpdatedAt: string;
  usedPurchase: number;
  usedPurchaseSource: string;
  usedPurchaseUpdatedAt: string;
  maintenance: number;
  maintenanceSource: string;
  fuel: number;
  fuelSource: string;
  insurance: number;
  insuranceSource: string;
  insuranceUpdatedAt: string;
  mileageInsuranceBase: number;
  mileageInsurancePerMile: number;
  mileageInsuranceSource: string;
  averageAnnualMiles: number;
}

export interface CostComparison {
  bike: BikeCost;
  car: BikeCost;
}

// --- Assessment Profile ---
export interface TransportationNeeds {
  soloCommuting: boolean;
  cargo: boolean;
  transportingKids: boolean;
  transportingAdults: boolean;
}

export interface Geography {
  windy: boolean;
  hilly: boolean;
  flat: boolean;
}

export type FitnessLevel = 'low' | 'medium' | 'high';
export type StorageType = 'garage' | 'basement' | 'upper-floor' | 'outdoor';

export interface AssessmentProfile {
  transportationNeeds: TransportationNeeds;
  geography: Geography;
  fitnessLevel: FitnessLevel;
  prefersStability: boolean;
  storage: StorageType;
}

// --- Bike Model Recommendations ---
export type RecommendationTier = 'budget' | 'midrange' | 'premium';

export interface BikeModel {
  model: string;
  price: string;
  tier: RecommendationTier;
  image: string;
  review: string | null;
  purchaseLink?: string;
  singleSpeed?: boolean;
  lightweight?: boolean;
  trike?: boolean;
}

export interface BikeModelWithReasons extends BikeModel {
  reasons: string[];
}

export interface TopPick extends BikeModelWithReasons {}

// --- Assessment Options (assessmentOptions.ts) ---
export interface AssessmentOption {
  label: string;
  icon: string | string[];
  description?: string;
}

// --- Gear (essentialGear.ts) ---
export interface GearLink {
  url: string;
  title: string;
  source?: string;
}

export interface GearItem {
  id: string;
  image?: string;
  images?: string[];
  imageClass?: string;
  emoji?: string;
  title: string;
  description: string;
  wirecutter?: Omit<GearLink, 'source'>;
  links?: GearLink[];
}

// --- Your Choices summary (used for sessionStorage persistence) ---
export interface ChoicePill {
  icon: string;
  label: string;
}

export interface ChoiceGroup {
  category: string;
  step: number;
  pills: ChoicePill[];
}
