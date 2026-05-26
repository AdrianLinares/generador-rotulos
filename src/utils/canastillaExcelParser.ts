import { CanastillaInput } from '@/types/canastilla';

/**
 * Parsea datos pegados desde Excel/CSV para canastilla
 * Espera datos separados por tabuladores o comas
 */
export function parseCanastillaExcelData(pastedText: string): CanastillaInput[] {
  const lines = pastedText.trim().split('\n');
  const rows: CanastillaInput[] = [];

  lines.forEach((line) => {
    let cells = line.split('\t');
    if (cells.length === 1) {
      cells = line.split(',');
    }

    cells = cells.map((cell) => cell.trim().replace(/^"|"$/g, ''));

    if (cells.length >= 5) {
      rows.push({
        caja: cells[0] || '',
        idMuestra: cells[1] || '',
        contratoProyecto: cells[2] || '',
        anio: cells[3] || '',
        plancha: cells[4] || '',
      });
    }
  });

  return rows;
}
