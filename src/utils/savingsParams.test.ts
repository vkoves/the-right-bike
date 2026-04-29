import { describe, it, expect } from 'vitest';
import { parseSavingsParams, applySavingsParams, CarMode } from './savingsParams';

describe('parseSavingsParams', () => {
  describe('new car (default)', () => {
    it('defaults to new when no params', () => {
      expect(parseSavingsParams({})).toEqual({ carMode: CarMode.New, replacementPercent: 50 });
    });

    it('reads car=new explicitly', () => {
      expect(parseSavingsParams({ car: 'new' })).toEqual({ carMode: CarMode.New, replacementPercent: 50 });
    });

    it('treats unknown car value as new', () => {
      expect(parseSavingsParams({ car: 'spaceship' })).toEqual({ carMode: CarMode.New, replacementPercent: 50 });
    });
  });

  describe('used car', () => {
    it('reads car=used', () => {
      expect(parseSavingsParams({ car: 'used' })).toEqual({ carMode: CarMode.Used, replacementPercent: 50 });
    });

    it('ignores replace when car=used', () => {
      expect(parseSavingsParams({ car: 'used', replace: '80' })).toEqual({ carMode: CarMode.Used, replacementPercent: 50 });
    });
  });

  describe('own car', () => {
    it('reads car=own with replace', () => {
      expect(parseSavingsParams({ car: 'own', replace: '75' })).toEqual({ carMode: CarMode.Own, replacementPercent: 75 });
    });

    it('defaults replace to 50 when missing', () => {
      expect(parseSavingsParams({ car: 'own' })).toEqual({ carMode: CarMode.Own, replacementPercent: 50 });
    });

    it('clamps replace below 25 up to 25', () => {
      expect(parseSavingsParams({ car: 'own', replace: '10' })).toEqual({ carMode: CarMode.Own, replacementPercent: 25 });
    });

    it('clamps replace above 100 down to 100', () => {
      expect(parseSavingsParams({ car: 'own', replace: '150' })).toEqual({ carMode: CarMode.Own, replacementPercent: 100 });
    });

    it('defaults replace to 50 on non-numeric value', () => {
      expect(parseSavingsParams({ car: 'own', replace: 'abc' })).toEqual({ carMode: CarMode.Own, replacementPercent: 50 });
    });
  });

});

describe('applySavingsParams', () => {
  it('car=new removes car and replace params', () => {
    const qs = applySavingsParams('car=used&replace=80', { carMode: CarMode.New, replacementPercent: 50 });
    expect(qs.has('car')).toBe(false);
    expect(qs.has('replace')).toBe(false);
  });

  it('car=used sets car=used and removes replace', () => {
    const qs = applySavingsParams('', { carMode: CarMode.Used, replacementPercent: 50 });
    expect(qs.get('car')).toBe('used');
    expect(qs.has('replace')).toBe(false);
  });

  it('car=own sets car=own and replace', () => {
    const qs = applySavingsParams('', { carMode: CarMode.Own, replacementPercent: 75 });
    expect(qs.get('car')).toBe('own');
    expect(qs.get('replace')).toBe('75');
  });

  it('preserves unrelated params like form and ideal', () => {
    const qs = applySavingsParams('form=abc123&ideal=commuter-ebike', { carMode: CarMode.Used, replacementPercent: 50 });
    expect(qs.get('form')).toBe('abc123');
    expect(qs.get('ideal')).toBe('commuter-ebike');
    expect(qs.get('car')).toBe('used');
  });

});
