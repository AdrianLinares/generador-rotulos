import { useState, useCallback } from 'react';
import { RotuloData, TableRow, EMPTY_ROTULO } from '@/types/rotulo';
import { parseExcelData } from '@/utils/excelParser';
import { v4 as uuidv4 } from 'uuid';

export function useRotuloData() {
  const [rows, setRows] = useState<TableRow[]>([{ ...EMPTY_ROTULO, id: uuidv4() }]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Agregar una nueva fila vacía
  const addRow = useCallback(() => {
    setRows((prev) => [...prev, { ...EMPTY_ROTULO, id: uuidv4() }]);
  }, []);

  // Eliminar una fila por ID
  const removeRow = useCallback((id: string) => {
    setRows((prev) => {
      const newRows = prev.filter((row) => row.id !== id);
      // Mantener al menos una fila
      return newRows.length === 0 ? [{ ...EMPTY_ROTULO, id: uuidv4() }] : newRows;
    });
  }, []);

  // Actualizar una celda específica
  const updateCell = useCallback((id: string, field: keyof RotuloData, value: string) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }, []);

  // Limpiar toda la tabla
  const clearAll = useCallback(() => {
    setRows([{ ...EMPTY_ROTULO, id: uuidv4() }]);
    setCurrentPreviewIndex(0);
  }, []);

  // Pegar datos desde Excel
  const pasteFromExcel = useCallback((pastedText: string) => {
    const parsedData = parseExcelData(pastedText);
    if (parsedData.length > 0) {
      const newRows = parsedData.map((data) => ({ ...data, id: uuidv4() }));
      setRows(newRows);
      setCurrentPreviewIndex(0);
    }
  }, []);

  // Obtener datos sin IDs para procesamiento
  const getRotulosData = useCallback((): RotuloData[] => {
    return rows.map(({ id, ...data }) => data);
  }, [rows]);

  // Navegación de preview
  const goToNextPreview = useCallback(() => {
    setCurrentPreviewIndex((prev) => Math.min(prev + 1, rows.length - 1));
  }, [rows.length]);

  const goToPreviousPreview = useCallback(() => {
    setCurrentPreviewIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToPreview = useCallback(
    (index: number) => {
      setCurrentPreviewIndex(Math.max(0, Math.min(index, rows.length - 1)));
    },
    [rows.length]
  );

  return {
    rows,
    currentPreviewIndex,
    addRow,
    removeRow,
    updateCell,
    clearAll,
    pasteFromExcel,
    getRotulosData,
    goToNextPreview,
    goToPreviousPreview,
    goToPreview,
  };
}
