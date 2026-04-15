/**
 * Constants for bike and vehicle costs used in the cost comparison calculator
 * All values are in USD and represent annual costs unless otherwise specified
 */

import type { CarCostsConfig } from '../types';

// Base costs for different vehicle types with source URLs
export const CarCosts: CarCostsConfig = {
  // Initial purchase price average for a new car
  purchase: 49000,
  purchaseSource: "https://www.coxautoinc.com/insights/feb-2026-atp-report/",
  purchaseUpdatedAt: "Mar 2026",

  // Initial purchase price average for a used car
  usedPurchase: 25250,
  usedPurchaseSource: "https://www.coxautoinc.com/insights/used-vehicle-inventory-february-2026",
  usedPurchaseUpdatedAt: "Mar 2026",

  // Annual maintenance including oil changes, tires, and regular service
  maintenance: 900, // Range from $583 - $1,623 per year, average at $900
  maintenanceSource: "https://www.consumeraffairs.com/automotive/average-car-maintenance-costs.html",

  // Annual fuel costs based on average usage
  fuel: 2500, // Mid-range estimate from $500 - $8,250 per year
  fuelSource: "https://www.energy.gov/eere/vehicles/articles/fotw-1245-july-4-2022-epa-estimated-annual-fuel-cost-model-year-2022-light",

  // Annual insurance premium
  insurance: 2324,
  insuranceSource: "https://www.nerdwallet.com/insurance/auto/average-car-insurance-cost",
  insuranceUpdatedAt: "Mar 2026",

  // Pay-per-mile insurance for "already own a car" mode
  // Base rate: ~$45/mo ($540/yr) + per-mile: ~$0.065/mi
  // Source: MoneyGeek — range $58–$150/mo
  mileageInsuranceBase: 540,       // annual base rate (mid of $30–$60/mo)
  mileageInsurancePerMile: 0.065,  // average of $0.06–$0.07
  mileageInsuranceSource: "https://www.moneygeek.com/insurance/auto/pay-per-mile-car-insurance/",

  // Average annual miles driven (US), used to calculate per-mile savings
  averageAnnualMiles: 13500
};

