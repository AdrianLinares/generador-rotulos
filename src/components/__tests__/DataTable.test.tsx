import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '@/components/DataTable';
import { EMPTY_ROTULO, TableRow } from '@/types/rotulo';

const makeRow = (overrides: Partial<TableRow> = {}): TableRow => ({
  ...EMPTY_ROTULO,
  id: 'row-1',
  ...overrides,
});

const defaultProps = {
  onUpdateCell: vi.fn(),
  onRemoveRow: vi.fn(),
  onAddRow: vi.fn(),
  onPasteFromExcel: vi.fn(),
};

describe('DataTable', () => {
  it('renders the table with one row and the required-field labels', () => {
    render(<DataTable rows={[makeRow()]} {...defaultProps} />);
    expect(screen.getByText('ID MUESTRA')).toBeInTheDocument();
    expect(screen.getByText('PLANCHA')).toBeInTheDocument();
    expect(screen.getByText('DATUM')).toBeInTheDocument();
    expect(screen.getByText('GEÓLOGO O COLECTOR')).toBeInTheDocument();
    expect(screen.getByText('CONTRATO, PROYECTO O CONVENIO')).toBeInTheDocument();
    expect(screen.getByText('Total de rótulos:')).toBeInTheDocument();
  });

  it('calls onAddRow when "Agregar Fila" is clicked', () => {
    const onAddRow = vi.fn();
    render(<DataTable rows={[makeRow()]} {...defaultProps} onAddRow={onAddRow} />);
    fireEvent.click(screen.getByRole('button', { name: /agregar fila/i }));
    expect(onAddRow).toHaveBeenCalledTimes(1);
  });

  it('calls onRemoveRow with the row id when the delete button is clicked', () => {
    const onRemoveRow = vi.fn();
    render(
      <DataTable
        rows={[makeRow({ id: 'row-abc' }), makeRow({ id: 'row-def' })]}
        {...defaultProps}
        onRemoveRow={onRemoveRow}
      />
    );
    const deleteButtons = screen.getAllByRole('button', { name: /eliminar fila/i });
    fireEvent.click(deleteButtons[0]);
    expect(onRemoveRow).toHaveBeenCalledWith('row-abc');
  });

  it('disables the delete button when there is a single row', () => {
    render(<DataTable rows={[makeRow()]} {...defaultProps} />);
    expect(screen.getByRole('button', { name: /eliminar fila/i })).toBeDisabled();
  });
});
