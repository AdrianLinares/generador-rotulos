import { describe, it, expect } from 'vitest';
import { EMPTY_ROTULO, FIELD_LABELS, REQUIRED_FIELDS, RotuloData, ValidationResult } from '@/types/rotulo';
import { EMPTY_CANASTILLA, CANASTILLA_FIELD_LABELS, CANASTILLA_REQUIRED_FIELDS } from '@/types/canastilla';

describe('Rotulo types and constants', () => {
  describe('EMPTY_ROTULO', () => {
    it('has all fields as empty strings', () => {
      Object.values(EMPTY_ROTULO).forEach((value) => {
        expect(value).toBe('');
      });
    });

    it('has all RotuloData keys', () => {
      const keys = Object.keys(EMPTY_ROTULO) as (keyof RotuloData)[];
      const expectedKeys: (keyof RotuloData)[] = [
        'igm', 'idMuestra', 'plancha', 'geologoColector', 'localizacion',
        'datum', 'x', 'y', 'observaciones', 'unidadFormacion', 'contratoProyecto',
      ];
      expect(keys.sort()).toEqual(expectedKeys.sort());
    });
  });

  describe('FIELD_LABELS', () => {
    it('has a label for every RotuloData field', () => {
      const keys = Object.keys(FIELD_LABELS) as (keyof RotuloData)[];
      const expectedKeys = Object.keys(EMPTY_ROTULO) as (keyof RotuloData)[];
      expect(keys.sort()).toEqual(expectedKeys.sort());
    });

    it('all labels are non-empty strings', () => {
      Object.values(FIELD_LABELS).forEach((label) => {
        expect(label).toBeTruthy();
        expect(typeof label).toBe('string');
      });
    });
  });

  describe('REQUIRED_FIELDS', () => {
    it('includes exactly the expected required fields', () => {
      expect(REQUIRED_FIELDS.sort()).toEqual(
        ['idMuestra', 'plancha', 'geologoColector', 'datum', 'x', 'y', 'contratoProyecto'].sort()
      );
    });

    it('all required fields are valid RotuloData keys', () => {
      REQUIRED_FIELDS.forEach((field) => {
        expect(field in EMPTY_ROTULO).toBe(true);
      });
    });

    it('igm is NOT a required field', () => {
      expect(REQUIRED_FIELDS).not.toContain('igm');
    });

    it('observaciones is NOT a required field', () => {
      expect(REQUIRED_FIELDS).not.toContain('observaciones');
    });

    it('unidadFormacion is NOT a required field', () => {
      expect(REQUIRED_FIELDS).not.toContain('unidadFormacion');
    });
  });

  describe('ValidationResult type', () => {
    it('can create a valid result', () => {
      const result: ValidationResult = { isValid: true, errors: [] };
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('can create an invalid result with errors', () => {
      const result: ValidationResult = {
        isValid: false,
        errors: [{ field: 'idMuestra', message: 'ID MUESTRA es requerido' }],
      };
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });
  });
});

describe('Canastilla types and constants', () => {
  describe('EMPTY_CANASTILLA', () => {
    it('has all fields as empty strings', () => {
      Object.values(EMPTY_CANASTILLA).forEach((value) => {
        expect(value).toBe('');
      });
    });
  });

  describe('CANASTILLA_FIELD_LABELS', () => {
    it('has a label for every CanastillaInput field', () => {
      const keys = Object.keys(CANASTILLA_FIELD_LABELS);
      const expectedKeys = ['caja', 'idMuestra', 'contratoProyecto', 'anio', 'plancha'];
      expect(keys.sort()).toEqual(expectedKeys.sort());
    });
  });

  describe('CANASTILLA_REQUIRED_FIELDS', () => {
    it('includes all canastilla fields as required', () => {
      expect(CANASTILLA_REQUIRED_FIELDS.sort()).toEqual(
        ['caja', 'idMuestra', 'contratoProyecto', 'anio', 'plancha'].sort()
      );
    });
  });
});