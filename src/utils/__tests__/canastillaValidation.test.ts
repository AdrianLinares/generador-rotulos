import { describe, it, expect } from 'vitest';
import { validateCanastillaRow, validateCanastillaRows } from '@/utils/canastillaValidation';
import { EMPTY_CANASTILLA, CANASTILLA_REQUIRED_FIELDS } from '@/types/canastilla';

describe('validateCanastillaRow', () => {
  const validRow = {
    caja: '10',
    idMuestra: 'APN144',
    contratoProyecto: 'Investigación Geológica',
    anio: '2024',
    plancha: '560IVB',
  };

  it('returns valid for a complete row with all required fields', () => {
    const result = validateCanastillaRow(validRow);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns invalid when caja is empty', () => {
    const result = validateCanastillaRow({ ...validRow, caja: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.find((e) => e.field === 'caja')).toBeDefined();
  });

  it('returns invalid when caja is whitespace', () => {
    const result = validateCanastillaRow({ ...validRow, caja: '   ' });
    expect(result.isValid).toBe(false);
  });

  it('returns invalid when caja is not an integer', () => {
    const result = validateCanastillaRow({ ...validRow, caja: '10.5' });
    expect(result.isValid).toBe(false);
    expect(result.errors.find((e) => e.field === 'caja')!.message).toContain('entero');
  });

  it('returns invalid when anio does not have 4 digits', () => {
    const result = validateCanastillaRow({ ...validRow, anio: '24' });
    expect(result.isValid).toBe(false);
    expect(result.errors.find((e) => e.field === 'anio')!.message).toContain('4');
  });

  it('returns invalid when anio has non-numeric characters', () => {
    const result = validateCanastillaRow({ ...validRow, anio: 'ABCD' });
    expect(result.isValid).toBe(false);
  });

  it('allows valid 4-digit year', () => {
    const result = validateCanastillaRow({ ...validRow, anio: '2024' });
    expect(result.isValid).toBe(true);
  });

  it('returns multiple errors when multiple required fields are missing', () => {
    const result = validateCanastillaRow(EMPTY_CANASTILLA);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(CANASTILLA_REQUIRED_FIELDS.length);
  });

  it('allows integer string for caja', () => {
    const result = validateCanastillaRow({ ...validRow, caja: '1' });
    expect(result.isValid).toBe(true);
  });

  it('allows empty anio without error (it validates format, not required emptiness)', () => {
    // anio is required per CANASTILLA_REQUIRED_FIELDS, so empty anio should fail
    const result = validateCanastillaRow({ ...validRow, anio: '' });
    expect(result.isValid).toBe(false);
  });
});

describe('validateCanastillaRows', () => {
  it('returns a Map with results for each row', () => {
    const rows = [
      { caja: '10', idMuestra: 'A1', contratoProyecto: 'C1', anio: '2024', plancha: 'P1' },
      { caja: '', idMuestra: '', contratoProyecto: '', anio: '', plancha: '' },
    ];

    const results = validateCanastillaRows(rows);
    expect(results).toBeInstanceOf(Map);
    expect(results.size).toBe(2);
    expect(results.get(0)?.isValid).toBe(true);
    expect(results.get(1)?.isValid).toBe(false);
  });

  it('returns empty Map for empty array', () => {
    const results = validateCanastillaRows([]);
    expect(results.size).toBe(0);
  });
});