import { describe, expect, it } from 'vitest';
import {
  formatDui,
  formatNit,
  normalizeDui,
  normalizeNit,
} from './PersonMemory';

describe('PersonMemory', () => {
  it('formats DUI values while the user types digits', () => {
    expect(formatDui('12345678')).toBe('12345678');
    expect(formatDui('123456789')).toBe('12345678-9');
    expect(formatDui('12345678-999')).toBe('12345678-9');
  });

  it('normalizes DUI values for saved-person matching', () => {
    expect(normalizeDui(' 12345678-9 ')).toBe('123456789');
    expect(normalizeDui('a123-456')).toBe('A123456');
  });
});

describe('NIT de sociedad', () => {
  it('limita y aplica la máscara oficial', () => {
    expect(formatNit('06140101010011')).toBe('0614-010101-001-1');
    expect(normalizeNit('0614-010101-001-1')).toBe('06140101010011');
  });
});
