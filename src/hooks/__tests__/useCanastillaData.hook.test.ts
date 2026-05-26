/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCanastillaData } from '@/hooks/useCanastillaData';

describe('useCanastillaData', () => {
  it('starts with one empty row', () => {
    const { result } = renderHook(() => useCanastillaData());
    expect(result.current.rows).toHaveLength(1);
    expect(result.current.currentPreviewIndex).toBe(0);
  });

  it('adds a row', () => {
    const { result } = renderHook(() => useCanastillaData());
    act(() => {
      result.current.addRow();
    });
    expect(result.current.rows).toHaveLength(2);
  });

  it('removes a row by id', () => {
    const { result } = renderHook(() => useCanastillaData());
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
    const { result } = renderHook(() => useCanastillaData());
    const idToRemove = result.current.rows[0].id;
    act(() => {
      result.current.removeRow(idToRemove);
    });
    expect(result.current.rows).toHaveLength(1);
  });

  it('updates a cell value', () => {
    const { result } = renderHook(() => useCanastillaData());
    const rowId = result.current.rows[0].id;
    act(() => {
      result.current.updateCell(rowId, 'caja', '10');
    });
    expect(result.current.rows[0].caja).toBe('10');
  });

  it('clears all rows and resets', () => {
    const { result } = renderHook(() => useCanastillaData());
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

  it('parses pasted Excel data for canastilla', () => {
    const { result } = renderHook(() => useCanastillaData());
    const pastedText = '10\tAPN144\tContrato1\t2024\t560IVB\n20\tAPN763\tContrato2\t2023\t560IID';
    act(() => {
      result.current.pasteFromExcel(pastedText);
    });
    expect(result.current.rows).toHaveLength(2);
    expect(result.current.rows[0].caja).toBe('10');
    expect(result.current.rows[1].idMuestra).toBe('APN763');
    expect(result.current.currentPreviewIndex).toBe(0);
  });

  it('loads sample data', () => {
    const { result } = renderHook(() => useCanastillaData());
    act(() => {
      result.current.loadSampleData();
    });
    expect(result.current.rows).toHaveLength(3);
    expect(result.current.currentPreviewIndex).toBe(0);
  });

  it('groups labels by caja', () => {
    const { result } = renderHook(() => useCanastillaData());
    act(() => {
      result.current.loadSampleData();
    });
    // 3 rows all in caja 10, should produce 1 label
    expect(result.current.labels).toHaveLength(1);
    expect(result.current.labels[0].caja).toBe(10);
    expect(result.current.labels[0].muestras).toBe(3);
  });

  it('getCanastillaInputData strips ids', () => {
    const { result } = renderHook(() => useCanastillaData());
    const data = result.current.getCanastillaInputData();
    expect(data).toHaveLength(1);
    expect(data[0]).not.toHaveProperty('id');
  });
});
