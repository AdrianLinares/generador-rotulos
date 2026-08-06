import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ValidationMessages } from '@/components/ValidationMessages';
import { ValidationResult } from '@/types/rotulo';

const invalidResult: ValidationResult = {
  isValid: false,
  errors: [
    { field: 'idMuestra', message: 'ID MUESTRA es requerido' },
    { field: 'plancha', message: 'PLANCHA es requerido' },
  ],
};

describe('ValidationMessages', () => {
  it('renders the errors for the current row id from the id-keyed Map', () => {
    const results = new Map<string, ValidationResult>([
      ['row-1', invalidResult],
      ['row-2', { isValid: true, errors: [] }],
    ]);
    render(<ValidationMessages validationResults={results} currentId="row-1" />);
    expect(screen.getByText('Errores de validación')).toBeInTheDocument();
    expect(screen.getByText('ID MUESTRA es requerido')).toBeInTheDocument();
    expect(screen.getByText('PLANCHA es requerido')).toBeInTheDocument();
  });

  it('renders the valid state for a valid row id', () => {
    const results = new Map<string, ValidationResult>([['row-2', { isValid: true, errors: [] }]]);
    render(<ValidationMessages validationResults={results} currentId="row-2" />);
    expect(screen.getByText('Rótulo válido')).toBeInTheDocument();
    expect(screen.getByText('Este rótulo contiene todos los campos requeridos.')).toBeInTheDocument();
  });

  it('renders nothing when the current id has no result', () => {
    const results = new Map<string, ValidationResult>([]);
    const { container } = render(
      <ValidationMessages validationResults={results} currentId="unknown-id" />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
