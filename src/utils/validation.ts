import {
  RotuloData,
  ValidationResult,
  ValidationError,
  REQUIRED_FIELDS,
  FIELD_LABELS,
} from '@/types/rotulo';

/**
 * Valida los datos de un rótulo
 */
export function validateRotulo(data: RotuloData): ValidationResult {
  const errors: ValidationError[] = [];

  // Validar campos requeridos
  REQUIRED_FIELDS.forEach((field) => {
    if (!data[field] || data[field].trim() === '') {
      errors.push({
        field,
        message: `${FIELD_LABELS[field]} es requerido`,
      });
    }
  });

  // Validar formato de coordenadas (deben ser números)
  if (data.x && isNaN(Number(data.x))) {
    errors.push({
      field: 'x',
      message: 'La coordenada X debe ser un número válido',
    });
  }

  if (data.y && isNaN(Number(data.y))) {
    errors.push({
      field: 'y',
      message: 'La coordenada Y debe ser un número válido',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida múltiples rótulos
 */
export function validateRotulos(rotulos: RotuloData[]): Map<number, ValidationResult> {
  const results = new Map<number, ValidationResult>();

  rotulos.forEach((rotulo, index) => {
    results.set(index, validateRotulo(rotulo));
  });

  return results;
}

/**
 * Verifica si hay al menos un rótulo válido
 */
export function hasValidRotulos(rotulos: RotuloData[]): boolean {
  return rotulos.some((rotulo) => {
    const result = validateRotulo(rotulo);
    return result.isValid;
  });
}
