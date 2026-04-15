import { describe, it, expect } from 'vitest';
import StorageTip from './storageTip';

describe('StorageTip.shouldShowBuyingTip', () => {
  it('shows for bulky bike with basement storage', () => {
    expect(StorageTip.shouldShowBuyingTip('cargo-ebike', 'basement')).toBe(true);
  });

  it('shows for bulky bike with upper-floor storage', () => {
    expect(StorageTip.shouldShowBuyingTip('longtail-ebike', 'upper-floor')).toBe(true);
  });

  it('shows for bulky bike with outdoor storage', () => {
    expect(StorageTip.shouldShowBuyingTip('cargo-ebike', 'outdoor')).toBe(true);
  });

  it('does not show for bulky bike with garage storage', () => {
    expect(StorageTip.shouldShowBuyingTip('cargo-ebike', 'garage')).toBe(false);
  });

  it('does not show for non-bulky bike with any storage', () => {
    expect(StorageTip.shouldShowBuyingTip('regular-bike', 'upper-floor')).toBe(false);
    expect(StorageTip.shouldShowBuyingTip('commuter-ebike', 'basement')).toBe(false);
  });
});

describe('StorageTip.shouldShowAlternateNote', () => {
  it('shows for bulky bike with basement storage', () => {
    expect(StorageTip.shouldShowAlternateNote('cargo-ebike', 'basement')).toBe(true);
  });

  it('shows for bulky bike with upper-floor storage', () => {
    expect(StorageTip.shouldShowAlternateNote('longtail-ebike', 'upper-floor')).toBe(true);
  });

  it('does not show for bulky bike with outdoor storage', () => {
    expect(StorageTip.shouldShowAlternateNote('cargo-ebike', 'outdoor')).toBe(false);
  });

  it('does not show for bulky bike with garage storage', () => {
    expect(StorageTip.shouldShowAlternateNote('cargo-ebike', 'garage')).toBe(false);
  });

  it('does not show for non-bulky bike', () => {
    expect(StorageTip.shouldShowAlternateNote('regular-bike', 'upper-floor')).toBe(false);
  });
});

