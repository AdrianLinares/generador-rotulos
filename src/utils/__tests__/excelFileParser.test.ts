import { describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';
import { parseCanastillaWorkbook, parseRotulosWorkbook } from '@/utils/excelFileParser';

function createWorkbook(sheetName: string, rows: unknown[][]): File {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const bytes = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  return new File([bytes], 'datos.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

describe('excelFileParser', () => {
  it('parses sample labels from the template sheet and skips the header', async () => {
    const file = createWorkbook('Rótulos Muestras', [
      ['Información de muestras'],
      [],
      ['IGM', 'ID MUESTRA', 'PLANCHA', 'GEÓLOGO O COLECTOR', 'LOCALIZACIÓN', 'DATUM', 'X', 'Y', 'OBSERVACIONES', 'UNIDAD O FORMACIÓN', 'CONTRATO, PROYECTO O CONVENIO'],
      ['IGM001', 'AMC1216', '18IVB', 'Ana Milena', 'Sector Florida', 'Magna', 998909, 1697240, '', 'Girón', 'Contrato 123'],
    ]);

    await expect(parseRotulosWorkbook(file)).resolves.toEqual([
      {
        igm: 'IGM001',
        idMuestra: 'AMC1216',
        plancha: '18IVB',
        geologoColector: 'Ana Milena',
        localizacion: 'Sector Florida',
        datum: 'Magna',
        x: '998909',
        y: '1697240',
        observaciones: '',
        unidadFormacion: 'Girón',
        contratoProyecto: 'Contrato 123',
      },
    ]);
  });

  it('parses canastilla rows from the template sheet', async () => {
    const file = createWorkbook('Rótulos Canastillas', [
      ['CAJA', 'ID MUESTRA', 'PROYECTO, CONTRATO O CONVENIO', 'AÑO', 'PLANCHA'],
      [10, 'APN144', 'Proyecto 2024', 2024, '560IVB'],
    ]);

    await expect(parseCanastillaWorkbook(file)).resolves.toEqual([
      {
        caja: '10',
        idMuestra: 'APN144',
        contratoProyecto: 'Proyecto 2024',
        anio: '2024',
        plancha: '560IVB',
      },
    ]);
  });

  it('rejects workbooks without the expected template sheet', async () => {
    const file = createWorkbook('Otra hoja', [['dato']]);

    await expect(parseRotulosWorkbook(file)).rejects.toThrow(
      'No se encontró la hoja "Rótulos Muestras"'
    );
  });
});
