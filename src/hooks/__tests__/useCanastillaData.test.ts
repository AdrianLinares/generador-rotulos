import { describe, it, expect } from 'vitest';
import { generateSampleCanastillaData } from '@/hooks/useCanastillaData';

describe('generateSampleCanastillaData', () => {
  it('returns an array of canastilla data', () => {
    const data = generateSampleCanastillaData();
    expect(data.length).toBeGreaterThan(0);
  });

  it('each sample has all required fields', () => {
    const data = generateSampleCanastillaData();
    data.forEach((row) => {
      expect(row.caja).toBeTruthy();
      expect(row.idMuestra).toBeTruthy();
      expect(row.contratoProyecto).toBeTruthy();
      expect(row.anio).toBeTruthy();
      expect(row.plancha).toBeTruthy();
    });
  });

  it('caja is a valid integer string', () => {
    const data = generateSampleCanastillaData();
    data.forEach((row) => {
      expect(Number.isInteger(Number(row.caja))).toBe(true);
    });
  });

  it('anio is a 4-digit string', () => {
    const data = generateSampleCanastillaData();
    data.forEach((row) => {
      expect(row.anio).toMatch(/^\d{4}$/);
    });
  });
});
