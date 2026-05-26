import { describe, it, expect } from 'vitest';
import {
  validateRotulo,
  validateRotulos,
  hasValidRotulos,
} from '@/utils/validation';
import { EMPTY_ROTULO, REQUIRED_FIELDS } from '@/types/rotulo';

describe('validateRotulo', () => {
  const validRotulo = {
    igm: '123',
    idMuestra: 'AMC1216',
    plancha: '18IVB',
    geologoColector: 'Ana Milena Cardozo',
    localizacion: 'Sector la Florida',
    datum: 'Magna Colombia Bogotá',
    x: '998909',
    y: '1697240',
    observaciones: '',
    unidadFormacion: 'Formación Girón',
    contratoProyecto: 'Investigación Marina',
  };

  it('returns valid for a complete rotulo with all required fields', () => {
    const result = validateRotulo(validRotulo);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns invalid when a required field is empty', () => {
    const result = validateRotulo({ ...validRotulo, idMuestra: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('idMuestra');
    expect(result.errors[0].message).toContain('ID MUESTRA');
  });

  it('returns invalid when a required field is whitespace only', () => {
    const result = validateRotulo({ ...validRotulo, plancha: '   ' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('plancha');
  });

  it('returns multiple errors when multiple required fields are missing', () => {
    const result = validateRotulo({
      ...validRotulo,
      idMuestra: '',
      plancha: '',
      datum: '',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(3);
  });

  it('ignores optional fields that are empty', () => {
    const result = validateRotulo({
      ...validRotulo,
      igm: '',
      observaciones: '',
      unidadFormacion: '',
      localizacion: '',
    });
    expect(result.isValid).toBe(true);
  });

  it('validates x coordinate must be a number when provided', () => {
    const result = validateRotulo({ ...validRotulo, x: 'abc' });
    expect(result.isValid).toBe(false);
    expect(result.errors.find((e) => e.field === 'x')).toBeDefined();
    expect(result.errors.find((e) => e.field === 'x')!.message).toContain('número');
  });

  it('validates y coordinate must be a number when provided', () => {
    const result = validateRotulo({ ...validRotulo, y: 'not-a-number' });
    expect(result.isValid).toBe(false);
    expect(result.errors.find((e) => e.field === 'y')).toBeDefined();
  });

  it('allows numeric strings for x and y', () => {
    const result = validateRotulo({ ...validRotulo, x: '998909.5', y: '-1697240' });
    expect(result.isValid).toBe(true);
  });

  it('allows empty x and y with no format error (they are not required)', () => {
    const result = validateRotulo({ ...validRotulo, x: '', y: '' });
    // x and y are required fields, so empty strings trigger "required" errors
    // but they don't trigger "must be a number" errors
    const numericErrors = result.errors.filter(
      (e) => e.field === 'x' && e.message.includes('número')
    );
    expect(numericErrors).toHaveLength(0);
  });

  it('the complete EMPTY_ROTULO is invalid (all required fields empty)', () => {
    const result = validateRotulo(EMPTY_ROTULO);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(REQUIRED_FIELDS.length);
  });
});

describe('validateRotulos', () => {
  it('returns a Map with results for each rotulo', () => {
    const rotulos = [
      {
        igm: '1',
        idMuestra: 'A1',
        plancha: 'P1',
        geologoColector: 'G1',
        localizacion: '',
        datum: 'D1',
        x: '1',
        y: '1',
        observaciones: '',
        unidadFormacion: '',
        contratoProyecto: 'C1',
      },
      {
        igm: '',
        idMuestra: '',
        plancha: 'P2',
        geologoColector: '',
        localizacion: '',
        datum: '',
        x: '',
        y: '',
        observaciones: '',
        unidadFormacion: '',
        contratoProyecto: '',
      },
    ];

    const results = validateRotulos(rotulos);
    expect(results).toBeInstanceOf(Map);
    expect(results.size).toBe(2);
    expect(results.get(0)?.isValid).toBe(true);
    expect(results.get(1)?.isValid).toBe(false);
  });

  it('returns empty Map for empty array', () => {
    const results = validateRotulos([]);
    expect(results.size).toBe(0);
  });
});

describe('hasValidRotulos', () => {
  it('returns true if at least one rotulo is valid', () => {
    const rotulos = [EMPTY_ROTULO, { ...EMPTY_ROTULO, idMuestra: 'A', plancha: 'P', geologoColector: 'G', datum: 'D', x: '1', y: '1', contratoProyecto: 'C' }];
    expect(hasValidRotulos(rotulos)).toBe(true);
  });

  it('returns false if no rotulos are valid', () => {
    expect(hasValidRotulos([EMPTY_ROTULO])).toBe(false);
  });

  it('returns false for empty array', () => {
    expect(hasValidRotulos([])).toBe(false);
  });
});