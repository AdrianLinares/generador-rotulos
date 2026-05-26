import { describe, it, expect } from 'vitest';
import { groupCanastillaByCaja, formatIdsMuestra, formatPlanchas } from '@/utils/canastilla';
import { CanastillaInput } from '@/types/canastilla';

describe('groupCanastillaByCaja', () => {
  it('groups rows by caja number', () => {
    const rows: CanastillaInput[] = [
      { caja: '10', idMuestra: 'A1', contratoProyecto: 'C1', anio: '2024', plancha: 'P1' },
      { caja: '10', idMuestra: 'A2', contratoProyecto: 'C1', anio: '2024', plancha: 'P2' },
      { caja: '20', idMuestra: 'B1', contratoProyecto: 'C2', anio: '2023', plancha: 'P3' },
    ];

    const result = groupCanastillaByCaja(rows);
    expect(result).toHaveLength(2);
    expect(result.find((l) => l.caja === 10)?.muestras).toBe(2);
    expect(result.find((l) => l.caja === 20)?.muestras).toBe(1);
  });

  it('collects unique idsMuestra per caja', () => {
    const rows: CanastillaInput[] = [
      { caja: '10', idMuestra: 'A1', contratoProyecto: 'C1', anio: '2024', plancha: 'P1' },
      { caja: '10', idMuestra: 'A2', contratoProyecto: 'C1', anio: '2024', plancha: 'P2' },
    ];

    const result = groupCanastillaByCaja(rows);
    expect(result[0].idsMuestra).toEqual(['A1', 'A2']);
    expect(result[0].muestras).toBe(2);
  });

  it('deduplicates identical idsMuestra within the same caja', () => {
    const rows: CanastillaInput[] = [
      { caja: '10', idMuestra: 'A1', contratoProyecto: 'C1', anio: '2024', plancha: 'P1' },
      { caja: '10', idMuestra: 'A1', contratoProyecto: 'C1', anio: '2024', plancha: 'P2' },
    ];

    const result = groupCanastillaByCaja(rows);
    expect(result[0].idsMuestra).toEqual(['A1']);
    expect(result[0].muestras).toBe(1);
  });

  it('collects unique planchas (case-insensitive)', () => {
    const rows: CanastillaInput[] = [
      { caja: '10', idMuestra: 'A1', contratoProyecto: 'C1', anio: '2024', plancha: '560ivb' },
      { caja: '10', idMuestra: 'A2', contratoProyecto: 'C1', anio: '2024', plancha: '560IVB' },
    ];

    const result = groupCanastillaByCaja(rows);
    expect(result[0].planchas).toEqual(['560IVB']);
  });

  it('takes the first contratoProyecto for each caja', () => {
    const rows: CanastillaInput[] = [
      { caja: '10', idMuestra: 'A1', contratoProyecto: 'First', anio: '2024', plancha: 'P1' },
      { caja: '10', idMuestra: 'A2', contratoProyecto: 'Second', anio: '2024', plancha: 'P2' },
    ];

    const result = groupCanastillaByCaja(rows);
    expect(result[0].contratoProyecto).toBe('First');
  });

  it('sorts results by caja number', () => {
    const rows: CanastillaInput[] = [
      { caja: '30', idMuestra: 'A1', contratoProyecto: 'C1', anio: '2024', plancha: 'P1' },
      { caja: '10', idMuestra: 'A2', contratoProyecto: 'C2', anio: '2023', plancha: 'P2' },
      { caja: '20', idMuestra: 'A3', contratoProyecto: 'C3', anio: '2022', plancha: 'P3' },
    ];

    const result = groupCanastillaByCaja(rows);
    expect(result.map((l) => l.caja)).toEqual([10, 20, 30]);
  });

  it('skips rows with invalid (non-numeric) caja', () => {
    const rows: CanastillaInput[] = [
      { caja: 'abc', idMuestra: 'A1', contratoProyecto: 'C1', anio: '2024', plancha: 'P1' },
      { caja: '10', idMuestra: 'A2', contratoProyecto: 'C2', anio: '2023', plancha: 'P2' },
    ];

    const result = groupCanastillaByCaja(rows);
    expect(result).toHaveLength(1);
    expect(result[0].caja).toBe(10);
  });

  it('handles empty rows array', () => {
    const result = groupCanastillaByCaja([]);
    expect(result).toHaveLength(0);
  });

  it('trims whitespace from field values', () => {
    const rows: CanastillaInput[] = [
      {
        caja: '10',
        idMuestra: '  A1  ',
        contratoProyecto: '  C1  ',
        anio: ' 2024 ',
        plancha: ' P1 ',
      },
    ];

    const result = groupCanastillaByCaja(rows);
    expect(result[0].idsMuestra).toEqual(['A1']);
    expect(result[0].contratoProyecto).toBe('C1');
    expect(result[0].anio).toBe('2024');
  });
});

describe('formatIdsMuestra', () => {
  it('joins ids with " - "', () => {
    expect(formatIdsMuestra(['A1', 'A2', 'A3'])).toBe('A1 - A2 - A3');
  });

  it('returns single id without separator', () => {
    expect(formatIdsMuestra(['A1'])).toBe('A1');
  });

  it('returns empty string for empty array', () => {
    expect(formatIdsMuestra([])).toBe('');
  });
});

describe('formatPlanchas', () => {
  it('joins planchas with " - "', () => {
    expect(formatPlanchas(['P1', 'P2'])).toBe('P1 - P2');
  });

  it('returns single plancha without separator', () => {
    expect(formatPlanchas(['P1'])).toBe('P1');
  });

  it('returns empty string for empty array', () => {
    expect(formatPlanchas([])).toBe('');
  });
});
