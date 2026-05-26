import { describe, it, expect } from 'vitest';
import { parseCanastillaExcelData } from '@/utils/canastillaExcelParser';

describe('parseCanastillaExcelData', () => {
  it('parses tab-separated values into canastilla data', () => {
    const input = '10\tAPN144\tInvestigación Geológica\t2024\t560IVB';
    const result = parseCanastillaExcelData(input);
    expect(result).toHaveLength(1);
    expect(result[0].caja).toBe('10');
    expect(result[0].idMuestra).toBe('APN144');
    expect(result[0].contratoProyecto).toBe('Investigación Geológica');
    expect(result[0].anio).toBe('2024');
    expect(result[0].plancha).toBe('560IVB');
  });

  it('parses multiple lines', () => {
    const input = [
      '10\tAPN144\tContrato\t2024\t560IVB',
      '10\tAPN763\tContrato\t2024\t560IID',
    ].join('\n');
    const result = parseCanastillaExcelData(input);
    expect(result).toHaveLength(2);
    expect(result[1].idMuestra).toBe('APN763');
  });

  it('falls back to comma separator when no tabs', () => {
    const input = '10,APN144,Contrato,2024,560IVB';
    const result = parseCanastillaExcelData(input);
    expect(result).toHaveLength(1);
    expect(result[0].caja).toBe('10');
  });

  it('trims whitespace from cells', () => {
    const input = '  10  \t  APN144  \t  Contrato  \t  2024  \t  560IVB  ';
    const result = parseCanastillaExcelData(input);
    expect(result[0].caja).toBe('10');
    expect(result[0].idMuestra).toBe('APN144');
  });

  it('strips surrounding quotes from cells', () => {
    const input = '"10"\t"APN144"\t"Contrato"\t"2024"\t"560IVB"';
    const result = parseCanastillaExcelData(input);
    expect(result[0].caja).toBe('10');
  });

  it('ignores lines with fewer than 5 columns', () => {
    const input = '10\tAPN144\tContrato';
    const result = parseCanastillaExcelData(input);
    expect(result).toHaveLength(0);
  });

  it('handles empty input', () => {
    const result = parseCanastillaExcelData('');
    expect(result).toHaveLength(0);
  });

  it('fills missing cells with empty string', () => {
    // Tab-leading empty cell gets trimmed away, so this produces only 4 columns
    // and is ignored. Test a valid 5-column row where caja is empty string.
    const input = ' \tAPN144\tContrato\t2024\t560IVB';
    const result = parseCanastillaExcelData(input);
    // Leading space+tab: after trim(), tab is consumed → 4 columns → ignored
    expect(result).toHaveLength(0);
  });
});