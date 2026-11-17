import * as XLSX from 'xlsx';
import { CanastillaInput } from '@/types/canastilla';
import { RotuloData } from '@/types/rotulo';

type Cell = string | number | boolean | Date | null | undefined;

const SAMPLE_SHEET = 'Rótulos Muestras';
const CANASTILLA_SHEET = 'Rótulos Canastillas';

function normalizeHeader(value: Cell): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function cellToString(value: Cell): string {
  return String(value ?? '').trim();
}

function readSheet(file: File, sheetName: string): Promise<string[][]> {
  return file.arrayBuffer().then((buffer) => {
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error(`No se encontró la hoja "${sheetName}"`);
    }

    return XLSX.utils.sheet_to_json<Cell[]>(worksheet, {
      header: 1,
      defval: '',
      raw: false,
    }).map((row) => row.map(cellToString));
  });
}

function findHeaderRow(rows: string[][], requiredHeaders: string[]): [string[], number] {
  const required = requiredHeaders.map(normalizeHeader);
  const headerIndex = rows.findIndex((row) => {
    const headers = row.map(normalizeHeader);
    return required.every((header) => headers.includes(header));
  });

  if (headerIndex < 0) {
    throw new Error('No se encontró una fila de encabezados válida en la plantilla');
  }

  return [rows[headerIndex].map(normalizeHeader), headerIndex];
}

function readColumn(row: string[], headers: string[], aliases: string[]): string {
  const columnIndex = aliases.map(normalizeHeader).map((alias) => headers.indexOf(alias)).find((index) => index >= 0);
  return columnIndex === undefined ? '' : row[columnIndex] ?? '';
}

export async function parseRotulosWorkbook(file: File): Promise<RotuloData[]> {
  const rows = await readSheet(file, SAMPLE_SHEET);
  const [headers, headerIndex] = findHeaderRow(rows, [
    'igm',
    'idmuestra',
    'plancha',
    'geologoocolector',
    'datum',
    'x',
    'y',
  ]);

  return rows
    .slice(headerIndex + 1)
    .map((row) => ({
      igm: readColumn(row, headers, ['igm']),
      idMuestra: readColumn(row, headers, ['id muestra']),
      plancha: readColumn(row, headers, ['plancha']),
      geologoColector: readColumn(row, headers, ['geólogo o colector', 'geologo colector']),
      localizacion: readColumn(row, headers, ['localización', 'localizacion']),
      datum: readColumn(row, headers, ['datum']),
      x: readColumn(row, headers, ['x']),
      y: readColumn(row, headers, ['y']),
      observaciones: readColumn(row, headers, ['observaciones']),
      unidadFormacion: readColumn(row, headers, ['unidad o formación', 'unidad formacion']),
      contratoProyecto: readColumn(row, headers, [
        'contrato proyecto o convenio',
        'proyecto contrato o convenio',
        'contrato proyecto',
      ]),
    }))
    .filter((data) => Object.values(data).some((value) => value !== ''));
}

export async function parseCanastillaWorkbook(file: File): Promise<CanastillaInput[]> {
  const rows = await readSheet(file, CANASTILLA_SHEET);
  const [headers, headerIndex] = findHeaderRow(rows, [
    'caja',
    'idmuestra',
    'ano',
    'plancha',
  ]);

  return rows
    .slice(headerIndex + 1)
    .map((row) => ({
      caja: readColumn(row, headers, ['caja']),
      idMuestra: readColumn(row, headers, ['id muestra']),
      contratoProyecto: readColumn(row, headers, [
        'proyecto contrato o convenio',
        'contrato proyecto o convenio',
        'proyecto contrato',
      ]),
      anio: readColumn(row, headers, ['año', 'ano']),
      plancha: readColumn(row, headers, ['plancha']),
    }))
    .filter((data) => Object.values(data).some((value) => value !== ''));
}
