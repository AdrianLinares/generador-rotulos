import { useCallback, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CanastillaInput,
  CanastillaLabelData,
  CanastillaTableRow,
  EMPTY_CANASTILLA,
} from '@/types/canastilla';
import { groupCanastillaByCaja } from '@/utils/canastilla';
import { parseCanastillaExcelData } from '@/utils/canastillaExcelParser';

export function generateSampleCanastillaData(): CanastillaInput[] {
  return [
    {
      caja: '10',
      idMuestra: 'APN144',
      contratoProyecto:
        'Investigacion en Cartografia Geologica y Geomorfologica en el Territorio Colombiano',
      anio: '2024',
      plancha: '560IVB',
    },
    {
      caja: '10',
      idMuestra: 'APN763A',
      contratoProyecto:
        'Investigacion en Cartografia Geologica y Geomorfologica en el Territorio Colombiano',
      anio: '2024',
      plancha: '560IID',
    },
    {
      caja: '10',
      idMuestra: 'APN0774',
      contratoProyecto:
        'Investigacion en Cartografia Geologica y Geomorfologica en el Territorio Colombiano',
      anio: '2024',
      plancha: '560IIC',
    },
  ];
}

export function useCanastillaData() {
  const [rows, setRows] = useState<CanastillaTableRow[]>([{ ...EMPTY_CANASTILLA, id: uuidv4() }]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, { ...EMPTY_CANASTILLA, id: uuidv4() }]);
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => {
      const newRows = prev.filter((row) => row.id !== id);
      return newRows.length === 0 ? [{ ...EMPTY_CANASTILLA, id: uuidv4() }] : newRows;
    });
  }, []);

  const updateCell = useCallback((id: string, field: keyof CanastillaInput, value: string) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }, []);

  const clearAll = useCallback(() => {
    setRows([{ ...EMPTY_CANASTILLA, id: uuidv4() }]);
    setCurrentPreviewIndex(0);
  }, []);

  const pasteFromExcel = useCallback((pastedText: string) => {
    const parsed = parseCanastillaExcelData(pastedText);
    if (parsed.length > 0) {
      setRows(parsed.map((row) => ({ ...row, id: uuidv4() })));
      setCurrentPreviewIndex(0);
    }
  }, []);

  const loadSampleData = useCallback(() => {
    const sample = generateSampleCanastillaData();
    setRows(sample.map((row) => ({ ...row, id: uuidv4() })));
    setCurrentPreviewIndex(0);
  }, []);

  const getCanastillaInputData = useCallback((): CanastillaInput[] => {
    return rows.map(({ id, ...row }) => row);
  }, [rows]);

  const labels = useMemo<CanastillaLabelData[]>(() => {
    return groupCanastillaByCaja(getCanastillaInputData());
  }, [getCanastillaInputData]);

  const goToNextPreview = useCallback(() => {
    setCurrentPreviewIndex((prev) => Math.min(prev + 1, Math.max(0, labels.length - 1)));
  }, [labels.length]);

  const goToPreviousPreview = useCallback(() => {
    setCurrentPreviewIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToPreview = useCallback(
    (index: number) => {
      setCurrentPreviewIndex(Math.max(0, Math.min(index, Math.max(0, labels.length - 1))));
    },
    [labels.length]
  );

  return {
    rows,
    labels,
    currentPreviewIndex,
    addRow,
    removeRow,
    updateCell,
    clearAll,
    pasteFromExcel,
    loadSampleData,
    getCanastillaInputData,
    goToNextPreview,
    goToPreviousPreview,
    goToPreview,
  };
}
