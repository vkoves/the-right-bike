export default class Currency {
  /** Formats a number as USD with no decimal places (e.g. "$1,234"). */
  static format(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  }

  /** Rounds to the nearest $1k below $1M, or "$X.XM" at/above $1M. */
  static formatRounded(value: number): string {
    if (value >= 1_000_000) {
      const millions = Math.round(value / 100_000) / 10;
      const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
      return '$' + formatted + ' million';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(Math.round(value / 1000) * 1000);
  }

  /** Projects a value forward at a compound growth rate. */
  static investmentGrowth(amount: number, rate: number, years: number): number {
    return amount * Math.pow(1 + rate, years);
  }
}
