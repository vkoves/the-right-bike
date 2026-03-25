// --- Bike Type IDs ---
export type BikeTypeId =
  | 'regular-bike'
  | 'commuter-ebike'
  | 'cargo-bike'
  | 'cargo-ebike'
  | 'longtail-bike'
  | 'longtail-ebike';

// --- Bike Type metadata (bikeTypes.ts) ---
export interface BikeType {
  title: string;
  label: string;
  image: string;
  electric: boolean;
  bulky: boolean;
  storageDowngrade?: BikeTypeId;
  description: string;
  features: string[];
  priceRange: string;
}

// --- Costs (bikeCosts.ts) ---
export interface BikeCost {
  purchase: number;
  maintenance: number;
  fuel: number;
  insurance: number;
}

export interface CarCosts {
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
export type StorageType = 'garage' | 'basement' | 'upper-floor';

export interface AssessmentProfile {
  transportationNeeds: TransportationNeeds;
  geography: Geography;
  fitnessLevel: FitnessLevel;
  storage: StorageType;
}

// --- Bike Model Recommendations ---
export type RecommendationTier = 'budget' | 'midrange' | 'premium';

export interface BikeModel {
  model: string;
  price: string;
  image: string;
  review: string;
}

export interface BikeModelWithReasons extends BikeModel {
  reasons: string[];
}

export interface TieredRecommendations {
  budget: BikeModelWithReasons;
  midrange: BikeModelWithReasons;
  premium: BikeModelWithReasons;
}

export interface TopPick extends BikeModelWithReasons {
  tier: RecommendationTier;
}

// --- Assessment Options (assessmentOptions.ts) ---
export interface AssessmentOption {
  label: string;
  icon: string;
  description?: string;
}

// --- Gear (essentialGear.ts) ---
export interface GearItem {
  id: string;
  image?: string;
  images?: string[];
  imageClass?: string;
  emoji?: string;
  title: string;
  description: string;
  wirecutter?: {
    url: string;
    title: string;
  };
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
