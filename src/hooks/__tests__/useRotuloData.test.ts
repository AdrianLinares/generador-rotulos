/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRotuloData } from '@/hooks/useRotuloData';

describe('useRotuloData', () => {
  it('starts with one empty row', () => {
    const { result } = renderHook(() => useRotuloData());
    expect(result.current.rows).toHaveLength(1);
    expect(result.current.currentPreviewIndex).toBe(0);
  });

  it('adds a row', () => {
    const { result } = renderHook(() => useRotuloData());
    act(() => {
      result.current.addRow();
    });
    expect(result.current.rows).toHaveLength(2);
  });

  it('removes a row by id', () => {
    const { result } = renderHook(() => useRotuloData());
    act(() => {
      result.current.addRow();
    });
    const idToRemove = result.current.rows[0].id;
    act(() => {
      result.current.removeRow(idToRemove);
    });
    expect(result.current.rows).toHaveLength(1);
  });

  it('keeps at least one row when removing the last one', () => {
    const { result } = renderHook(() => useRotuloData());
    const idToRemove = result.current.rows[0].id;
    act(() => {
      result.current.removeRow(idToRemove);
    });
    expect(result.current.rows).toHaveLength(1);
  });

  it('updates a cell value', () => {
    const { result } = renderHook(() => useRotuloData());
    const rowId = result.current.rows[0].id;
    act(() => {
      result.current.updateCell(rowId, 'idMuestra', 'TEST-001');
    });
    expect(result.current.rows[0].idMuestra).toBe('TEST-001');
  });

  it('clears all rows and resets to one empty row', () => {
    const { result } = renderHook(() => useRotuloData());
    act(() => {
      result.current.addRow();
    });
    expect(result.current.rows).toHaveLength(2);
    act(() => {
      result.current.clearAll();
    });
    expect(result.current.rows).toHaveLength(1);
    expect(result.current.currentPreviewIndex).toBe(0);
  });

  it('parses pasted Excel data', () => {
    const { result } = renderHook(() => useRotuloData());
    const pastedText = [
      'IGM1\tID1\tP1\tG1\tL1\tD1\t1\t2\tO1\tU1\tC1',
      'IGM2\tID2\tP2\tG2\tL2\tD2\t3\t4\tO2\tU2\tC2',
    ].join('\n');
    act(() => {
      result.current.pasteFromExcel(pastedText);
    });
    expect(result.current.rows).toHaveLength(2);
    expect(result.current.rows[0].idMuestra).toBe('ID1');
    expect(result.current.rows[1].idMuestra).toBe('ID2');
    expect(result.current.currentPreviewIndex).toBe(0);
  });

  it('does not replace rows if parsed data is empty', () => {
    const { result } = renderHook(() => useRotuloData());
    act(() => {
      result.current.addRow();
    });
    expect(result.current.rows).toHaveLength(2);
    act(() => {
      result.current.pasteFromExcel('invalid data with no tabs');
    });
    // Should still have 2 rows because parseExcelData returns empty for < 11 columns
    expect(result.current.rows).toHaveLength(2);
  });

  it('navigates preview: next, previous, goTo', () => {
    const { result } = renderHook(() => useRotuloData());
    act(() => {
      result.current.addRow();
      result.current.addRow();
    });
    expect(result.current.rows).toHaveLength(3);

    act(() => {
      result.current.goToNextPreview();
    });
    expect(result.current.currentPreviewIndex).toBe(1);

    act(() => {
      result.current.goToNextPreview();
    });
    expect(result.current.currentPreviewIndex).toBe(2);

    // Can't go past the last
    act(() => {
      result.current.goToNextPreview();
    });
    expect(result.current.currentPreviewIndex).toBe(2);

    act(() => {
      result.current.goToPreviousPreview();
    });
    expect(result.current.currentPreviewIndex).toBe(1);

    // Can't go before 0
    act(() => {
      result.current.goToPreview(0);
    });
    expect(result.current.currentPreviewIndex).toBe(0);

    act(() => {
      result.current.goToPreviousPreview();
    });
    expect(result.current.currentPreviewIndex).toBe(0);
  });

  it('getRotulosData strips ids', () => {
    const { result } = renderHook(() => useRotuloData());
    const data = result.current.getRotulosData();
    expect(data).toHaveLength(1);
    expect(data[0]).not.toHaveProperty('id');
  });
});
