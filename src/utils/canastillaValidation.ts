import {
    CANASTILLA_FIELD_LABELS,
    CANASTILLA_REQUIRED_FIELDS,
    CanastillaInput,
    CanastillaValidationError,
    CanastillaValidationResult,
} from '@/types/canastilla';

export function validateCanastillaRow(row: CanastillaInput): CanastillaValidationResult {
    const errors: CanastillaValidationError[] = [];

    CANASTILLA_REQUIRED_FIELDS.forEach((field) => {
        if (!row[field] || row[field].trim() === '') {
            errors.push({
                field,
                message: `${CANASTILLA_FIELD_LABELS[field]} es requerido`,
            });
        }
    });

    if (row.caja && !Number.isInteger(Number(row.caja))) {
        errors.push({
            field: 'caja',
            message: 'CAJA debe ser un numero entero',
        });
    }

    if (row.anio && !/^\d{4}$/.test(row.anio.trim())) {
        errors.push({
            field: 'anio',
            message: 'AÑO debe tener formato de 4 digitos',
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function validateCanastillaRows(rows: CanastillaInput[]): Map<number, CanastillaValidationResult> {
    const results = new Map<number, CanastillaValidationResult>();

    rows.forEach((row, index) => {
        results.set(index, validateCanastillaRow(row));
    });

    return results;
}
