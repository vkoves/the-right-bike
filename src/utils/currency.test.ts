import { describe, it, expect } from 'vitest';
import Currency from './currency';

describe('Currency.format', () => {
  it('formats a round number', () => {
    expect(Currency.format(1234)).toBe('$1,234');
  });

  it('truncates decimals', () => {
    expect(Currency.format(1234.56)).toBe('$1,235');
  });

  it('formats zero', () => {
    expect(Currency.format(0)).toBe('$0');
  });

  it('formats negative values', () => {
    expect(Currency.format(-500)).toBe('-$500');
  });
});

describe('Currency.formatRounded', () => {
  it('rounds to nearest $1k for values under $1M', () => {
    expect(Currency.formatRounded(54_321)).toBe('$54,000');
  });

  it('rounds small values to nearest $1k', () => {
    expect(Currency.formatRounded(1_500)).toBe('$2,000');
  });

  it('formats values at exactly $1M', () => {
    expect(Currency.formatRounded(1_000_000)).toBe('$1 million');
  });

  it('formats values over $1M with one decimal', () => {
    expect(Currency.formatRounded(1_500_000)).toBe('$1.5 million');
  });

  it('drops decimal when millions is whole', () => {
    expect(Currency.formatRounded(2_000_000)).toBe('$2 million');
  });
});

describe('Currency.investmentGrowth', () => {
  it('returns the original amount at 0 years', () => {
    expect(Currency.investmentGrowth(1000, 0.07, 0)).toBe(1000);
  });

  it('compounds correctly over 1 year', () => {
    expect(Currency.investmentGrowth(1000, 0.07, 1)).toBeCloseTo(1070);
  });

  it('compounds correctly over 3 years', () => {
    // 1000 × 1.07 × 1.07 × 1.07 = 1000 × 1.225043 = 1225.043
    expect(Currency.investmentGrowth(1000, 0.07, 3)).toBeCloseTo(1225.04, 1);
  });

  it('returns 0 when amount is 0', () => {
    expect(Currency.investmentGrowth(0, 0.07, 40)).toBe(0);
  });
});
