import { describe, it, expect } from 'vitest';
import { parseExcelData, generateSampleData } from '@/utils/excelParser';
import { validateRotulo } from '@/utils/validation';

describe('parseExcelData', () => {
  it('parses tab-separated values into rotulo data', () => {
    const input = 'IGM001\tAMC1216\t18IVB\tAna Milena\tSector Florida\tMagna\t998909\t1697240\tobs\tFormación Girón\tContrato 123';
    const result = parseExcelData(input);
    expect(result).toHaveLength(1);
    expect(result[0].igm).toBe('IGM001');
    expect(result[0].idMuestra).toBe('AMC1216');
    expect(result[0].plancha).toBe('18IVB');
    expect(result[0].contratoProyecto).toBe('Contrato 123');
  });

  it('parses multiple lines', () => {
    const input = [
      'IGM1\tID1\tP1\tG1\tL1\tD1\t1\t2\tO1\tU1\tC1',
      'IGM2\tID2\tP2\tG2\tL2\tD2\t3\t4\tO2\tU2\tC2',
    ].join('\n');
    const result = parseExcelData(input);
    expect(result).toHaveLength(2);
    expect(result[1].idMuestra).toBe('ID2');
  });

  it('falls back to comma separator when no tabs', () => {
    const input = 'IGM1,ID1,P1,G1,L1,D1,1,2,O1,U1,C1';
    const result = parseExcelData(input);
    expect(result).toHaveLength(1);
    expect(result[0].idMuestra).toBe('ID1');
  });

  it('trims whitespace from cells', () => {
    const input = '  IGM1  \t  ID1  \tP1\tG1\tL1\tD1\t1\t2\tO1\tU1\tC1';
    const result = parseExcelData(input);
    expect(result[0].igm).toBe('IGM1');
  });

  it('strips surrounding quotes from cells', () => {
    const input = '"IGM1"\t"ID1"\t"P1"\t"G1"\t"L1"\t"D1"\t"1"\t"2"\t"O1"\t"U1"\t"C1"';
    const result = parseExcelData(input);
    expect(result[0].igm).toBe('IGM1');
    expect(result[0].idMuestra).toBe('ID1');
  });

  it('ignores lines with fewer than 11 columns', () => {
    const input = 'only\tthree\tcolumns';
    const result = parseExcelData(input);
    expect(result).toHaveLength(0);
  });

  it('fills missing columns beyond 11 with empty strings', () => {
    const input = 'IGM1\tID1\tP1\tG1\tL1\tD1\t1\t2\tO1\tU1'; // 10 columns
    const result = parseExcelData(input);
    expect(result).toHaveLength(0); // less than 11, ignored
  });

  it('handles empty input', () => {
    const result = parseExcelData('');
    expect(result).toHaveLength(0);
  });

  it('handles whitespace-only input', () => {
    const result = parseExcelData('   \n   \n');
    expect(result).toHaveLength(0);
  });

  it('fills missing columns with empty strings when row is too short', () => {
    // Rows with fewer than 11 columns are ignored
    const input = 'only\tthree\tcolumns';
    const result = parseExcelData(input);
    expect(result).toHaveLength(0);
  });
});

describe('generateSampleData', () => {
  it('returns an array of rotulo data', () => {
    const data = generateSampleData();
    expect(data.length).toBeGreaterThan(0);
  });

  it('each sample has all required fields present', () => {
    const data = generateSampleData();
    data.forEach((rotulo) => {
      expect(rotulo.idMuestra).toBeTruthy();
      expect(rotulo.plancha).toBeTruthy();
      expect(rotulo.geologoColector).toBeTruthy();
      expect(rotulo.datum).toBeTruthy();
      expect(rotulo.x).toBeTruthy();
      expect(rotulo.y).toBeTruthy();
      expect(rotulo.contratoProyecto).toBeTruthy();
    });
  });

  it('sample data passes validation', () => {
    const data = generateSampleData();
    data.forEach((rotulo) => {
      const result = validateRotulo(rotulo);
      expect(result.isValid).toBe(true);
    });
  });
});