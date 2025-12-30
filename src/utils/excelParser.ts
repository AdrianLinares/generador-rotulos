import { RotuloData } from '@/types/rotulo';

/**
 * Parsea datos pegados desde Excel/CSV
 * Espera datos separados por tabuladores o comas
 */
export function parseExcelData(pastedText: string): RotuloData[] {
  const lines = pastedText.trim().split('\n');
  const rotulos: RotuloData[] = [];

  lines.forEach((line) => {
    // Intentar separar por tabulador primero, luego por coma
    let cells = line.split('\t');
    if (cells.length === 1) {
      cells = line.split(',');
    }

    // Limpiar cada celda
    cells = cells.map((cell) => cell.trim().replace(/^"|"$/g, ''));

    // Si hay al menos 11 columnas, crear un rótulo
    if (cells.length >= 11) {
      rotulos.push({
        igm: cells[0] || '',
        idMuestra: cells[1] || '',
        plancha: cells[2] || '',
        geologoColector: cells[3] || '',
        localizacion: cells[4] || '',
        datum: cells[5] || '',
        x: cells[6] || '',
        y: cells[7] || '',
        observaciones: cells[8] || '',
        unidadFormacion: cells[9] || '',
        contratoProyecto: cells[10] || '',
      });
    }
  });

  return rotulos;
}

/**
 * Genera datos de ejemplo para testing
 */
export function generateSampleData(): RotuloData[] {
  return [
    {
      igm: '',
      idMuestra: 'AMC1216',
      plancha: '18IVB',
      geologoColector: 'Ana Milena Cardozo',
      localizacion: 'Sector la Florida _ Via San Pedro de la Sierra',
      datum: 'Magna Colombia Bogotá',
      x: '998909',
      y: '1697240',
      observaciones: '',
      unidadFormacion: '',
      contratoProyecto: 'Investigación Maritima, Costera e Insular',
    },
    {
      igm: '',
      idMuestra: 'AMC1219',
      plancha: '18IVB',
      geologoColector: 'Ana Milena Cardozo',
      localizacion: 'Cauce de la Q. Santa Clara',
      datum: 'Magna Colombia Bogotá',
      x: '998918',
      y: '1698006',
      observaciones: '',
      unidadFormacion: '',
      contratoProyecto: 'Investigación Maritima, Costera e Insular',
    },
  ];
}