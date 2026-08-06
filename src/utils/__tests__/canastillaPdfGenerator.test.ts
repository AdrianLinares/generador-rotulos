import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import zlib from 'zlib';
import jsPDF from 'jspdf';
import {
  fitTextToBox,
  fitTextsToSharedFont,
  generateCanastillasPDF,
} from '@/utils/canastillaPdfGenerator';
import { CanastillaLabelData } from '@/types/canastilla';

function makeLabel(caja: number): CanastillaLabelData {
  return {
    caja,
    muestras: 1,
    idsMuestra: [`APN${caja}`],
    contratoProyecto: 'Investigación en Cartografía Geológica',
    anio: '2024',
    planchas: ['560IVB'],
  };
}

beforeEach(() => {
  // No network in tests: logo fetch rejects -> getImageBase64 returns '' -> text fallback.
  vi.stubGlobal(
    'fetch',
    vi.fn().mockRejectedValue(new TypeError('Failed to fetch (no network in tests)'))
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('generateCanastillasPDF', () => {
  it('produces a single page for up to 5 labels', async () => {
    const labels = Array.from({ length: 5 }, (_, i) => makeLabel(i + 1));
    const doc = await generateCanastillasPDF(labels);
    expect(doc.getNumberOfPages()).toBe(1);
  });

  it('adds a second page when exceeding 5 labels', async () => {
    const labels = Array.from({ length: 6 }, (_, i) => makeLabel(i + 1));
    const doc = await generateCanastillasPDF(labels);
    expect(doc.getNumberOfPages()).toBe(2);
  });

  it('handles an empty labels array', async () => {
    const doc = await generateCanastillasPDF([]);
    expect(doc.getNumberOfPages()).toBe(1);
  });
});

describe('fitTextToBox', () => {
  it('keeps the initial font size when the text fits the box', () => {
    const doc = new jsPDF({ unit: 'cm', format: 'letter' });
    const result = fitTextToBox(doc, 'Texto corto', 10, 2, 12);
    expect(result.fontSize).toBe(12);
    expect(result.lines).toEqual(['Texto corto']);
  });

  it('reduces the font size until the text fits the max height', () => {
    const doc = new jsPDF({ unit: 'cm', format: 'letter' });
    const result = fitTextToBox(doc, 'A'.repeat(200), 10, 1.5, 12, 4.2);
    expect(result.fontSize).toBeLessThan(12);
    // Contrato real: leading entre baselines + altura de glifos de la primera línea
    const requiredHeight =
      (result.lines.length - 1) * result.lineHeight + result.fontSize * 0.0352778;
    expect(requiredHeight).toBeLessThanOrEqual(1.5);
  });

  it('respects the minFontSize floor', () => {
    const doc = new jsPDF({ unit: 'cm', format: 'letter' });
    const result = fitTextToBox(doc, 'A'.repeat(500), 1, 0.1, 12, 4.2);
    expect(result.fontSize).toBe(4.2);
    expect(result.lines.length).toBeGreaterThan(1);
  });

  it('keeps 60 long litoteca ids inside the production ids box', () => {
    const doc = new jsPDF({ unit: 'cm', format: 'letter' });
    // Mismo contrato que el render real: idsBoxWidth 11.6 (-0.12 de margen),
    // idsBoxHeight 1.65 (-0.06 de padding) y minFontSize 4.4.
    const idsText = Array.from({ length: 60 }, (_, i) => `CMA_CVA_${String(14 + i).padStart(3, '0')}_A_1`).join(' - ');
    const result = fitTextToBox(doc, idsText, 11.6 - 0.12, 1.65 - 0.06, 11.5, 4.4);
    const requiredHeight =
      (result.lines.length - 1) * result.lineHeight + result.fontSize * 0.0352778;
    expect(requiredHeight).toBeLessThanOrEqual(1.65 - 0.06);
  });
});

describe('fitTextsToSharedFont', () => {
  it('picks a single font size shared by all texts', () => {
    const doc = new jsPDF({ unit: 'cm', format: 'letter' });
    const result = fitTextsToSharedFont(doc, ['abc', 'defghijklm'], 8, [1, 1], 14, 5);
    expect(result.linesPerText).toHaveLength(2);
    expect(result.fontSize).toBeLessThanOrEqual(14);
  });

  it('floors at minFontSize when nothing fits', () => {
    const doc = new jsPDF({ unit: 'cm', format: 'letter' });
    const result = fitTextsToSharedFont(doc, ['A'.repeat(300), 'B'.repeat(300)], 1, [0.1, 0.1], 14, 5);
    expect(result.fontSize).toBe(5);
  });
});

describe('generateCanastillasPDF with real production data (20 ids per box)', () => {
  // Real case reported by the user: ~20 muestras per caja, ids of 11-12 chars.
  // splitTextToSize used to leave the " - " separator dangling at line ends ("...ID -"),
  // which reads as text overflowing the ids box by about two spaces.
  const CONTRATO = 'Investigación en cartografía aplicada geológica y geomorfológica (ID 1001654)';
  const REAL_IDS: string[] = [
    'CMACVA014A1', 'SVFCVA207A1', 'SVFCVA200A1', 'IZMCVA108A1', 'SNACVA163E1',
    'YCTCVA149A1', 'YCTCVA150A1', 'LAACVA148A1', 'LAACVA150A1', 'LAACVA157A1',
    'LAACVA165A1', 'MTACVA148C1', 'MTACVA147A1', 'MTACVA133A1', 'LAACVA164A1',
    'MLCCVA102A1', 'LAACVA011A1', 'EVGCVA046A1', 'MLCCVA032B1', 'IZMCVA055A2P1',
  ];

  it('keeps every ids line inside the box with no dangling separators', async () => {
    const label: CanastillaLabelData = {
      caja: 1,
      muestras: REAL_IDS.length,
      idsMuestra: REAL_IDS,
      contratoProyecto: CONTRATO,
      anio: '2022',
      planchas: ['794IIC', '794IVA', '794IVB', '794IVC', '794IVD', '794ID'],
    };
    const doc = await generateCanastillasPDF([label]);

    // extract per-page content streams (they may be zlib-compressed)
    const buf = Buffer.from(doc.output('arraybuffer'));
    const text = buf.toString('latin1');
    const pages: string[] = [];
    const re = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const data = Buffer.from(m[1], 'latin1');
      try {
        pages.push(zlib.inflateSync(data).toString('latin1'));
      } catch {
        pages.push(data.toString('latin1'));
      }
    }
    const page = pages.find((p) => p.includes('BT'));
    expect(page).toBeDefined();

    const rects = [...page!.matchAll(/([\d.]+) ([\d.]+) ([\d.]+) (-?[\d.]+) re/g)].map((x) => ({
      x: parseFloat(x[1]), y: parseFloat(x[2]), w: parseFloat(x[3]), h: parseFloat(x[4]),
    }));
    const idsRect = rects.find((r) => Math.abs(r.w - 328.82) < 1 && Math.abs(r.h + 46.77) < 1);
    expect(idsRect).toBeDefined();
    const right = idsRect!.x + idsRect!.w;
    const bottom = idsRect!.y + idsRect!.h;
    const top = idsRect!.y;

    const textOps = [...page!.matchAll(/BT\n\/F\d+ ([\d.]+) Tf\n([\d.]+) TL\n0 g\n([\d.]+) ([\d.]+) Td\n\(([^)]*)\) Tj\nET/g)].map((x) => ({
      font: parseFloat(x[1]), x: parseFloat(x[3]), y: parseFloat(x[4]), s: x[5],
    }));
    const lines = textOps
      .filter((t) => t.y < top + 3 && t.y > bottom - 3)
      .sort((a, b) => b.y - a.y);
    expect(lines.length).toBeGreaterThanOrEqual(4);

    for (const line of lines) {
      // no dangling " - " separator at the start or end of a rendered line
      expect(line.s).not.toMatch(/-\s*$/);
      expect(line.s).not.toMatch(/^\s*-/);
      // horizontal fit measured with the same metrics jsPDF uses to render
      const probe = new jsPDF({ unit: 'cm', format: 'letter' });
      probe.setFont('helvetica', 'normal');
      probe.setFontSize(line.font);
      const widthPt = probe.getTextWidth(line.s) * 28.3465;
      expect(line.x + widthPt).toBeLessThanOrEqual(right + 0.5);
      // vertical fit: glyphs must stay inside the ids box
      const fontCm = line.font * 0.0352778;
      const topCm = (792 - top) / 28.3465;
      const botCm = (792 - bottom) / 28.3465;
      const yCm = (792 - line.y) / 28.3465;
      expect(yCm - 0.755 * fontCm).toBeGreaterThanOrEqual(topCm - 0.01);
      expect(yCm + 0.245 * fontCm).toBeLessThanOrEqual(botCm + 0.01);
    }
  });
});
