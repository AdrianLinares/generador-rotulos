import { describe, it, expect, vi, beforeAll } from 'vitest';
import { generatePDFFilename } from '@/utils/pdfGenerator';
import { generateCanastillaPDFFilename } from '@/utils/canastillaPdfGenerator';

describe('generatePDFFilename', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-15T10:30:00'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('generates filename with correct date format', () => {
    const filename = generatePDFFilename();
    expect(filename).toBe('rotulos_geologicos_20240315.pdf');
  });

  it('starts with expected prefix', () => {
    const filename = generatePDFFilename();
    expect(filename).toMatch(/^rotulos_geologicos_\d{8}\.pdf$/);
  });

  it('pads month and day with zeros', () => {
    vi.setSystemTime(new Date('2024-01-05T00:00:00'));
    const filename = generatePDFFilename();
    expect(filename).toBe('rotulos_geologicos_20240105.pdf');
  });
});

describe('generateCanastillaPDFFilename', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-15T10:30:00'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('generates filename with correct date format', () => {
    const filename = generateCanastillaPDFFilename();
    expect(filename).toBe('rotulos_canastilla_20240315.pdf');
  });

  it('starts with expected prefix', () => {
    const filename = generateCanastillaPDFFilename();
    expect(filename).toMatch(/^rotulos_canastilla_\d{8}\.pdf$/);
  });
});
