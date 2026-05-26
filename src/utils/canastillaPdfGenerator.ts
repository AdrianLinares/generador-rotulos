import jsPDF from 'jspdf';
import { CanastillaLabelData } from '@/types/canastilla';
import { formatIdsMuestra, formatPlanchas } from '@/utils/canastilla';
import { getImageBase64 } from '@/utils/pdfUtils';

const ALPHANUMERIC_FONT_FAMILY = 'courier';

function fitTextToBox(
  doc: jsPDF,
  text: string,
  maxWidth: number,
  maxHeight: number,
  initialFontSize: number,
  minFontSize = 4.2,
  lineHeightFactor = 1.15
) {
  const lineHeightCm = (fontSize: number) => fontSize * 0.0352778 * lineHeightFactor;

  for (let fontSize = initialFontSize; fontSize >= minFontSize; fontSize -= 0.2) {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    const requiredHeight = lines.length * lineHeightCm(fontSize);

    if (requiredHeight <= maxHeight) {
      return { fontSize, lines, lineHeight: lineHeightCm(fontSize) };
    }
  }

  doc.setFontSize(minFontSize);
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  return {
    fontSize: minFontSize,
    lines,
    lineHeight: lineHeightCm(minFontSize),
  };
}

function fitTextsToSharedFont(
  doc: jsPDF,
  texts: string[],
  maxWidth: number,
  maxHeights: number[],
  initialFontSize: number,
  minFontSize = 4.2,
  lineHeightFactor = 1.02
) {
  const lineHeightCm = (fontSize: number) => fontSize * 0.0352778 * lineHeightFactor;

  for (let fontSize = initialFontSize; fontSize >= minFontSize; fontSize -= 0.2) {
    doc.setFontSize(fontSize);
    const linesPerText = texts.map((text) => doc.splitTextToSize(text, maxWidth) as string[]);
    const lineHeight = lineHeightCm(fontSize);

    const allFit = linesPerText.every(
      (lines, index) => lines.length * lineHeight <= maxHeights[index]
    );
    if (allFit) {
      return { fontSize, lineHeight, linesPerText };
    }
  }

  doc.setFontSize(minFontSize);
  const linesPerText = texts.map((text) => doc.splitTextToSize(text, maxWidth) as string[]);
  return {
    fontSize: minFontSize,
    lineHeight: lineHeightCm(minFontSize),
    linesPerText,
  };
}

function drawCanastillaLabel(
  doc: jsPDF,
  label: CanastillaLabelData,
  logoBase64: string,
  frameX: number,
  frameY: number
) {
  const frameWidth = 12.0;
  const frameHeight = 5.0;

  doc.setLineWidth(0.03);
  doc.rect(frameX, frameY, frameWidth, frameHeight);

  const topLeftBoxX = frameX + 0.2;
  const topLeftBoxY = frameY + 0.3;
  const topLeftBoxWidth = 2.4;
  const topLeftBoxHeight = 1.2;
  doc.rect(topLeftBoxX, topLeftBoxY, topLeftBoxWidth, topLeftBoxHeight);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('CAJA', topLeftBoxX + topLeftBoxWidth / 2, topLeftBoxY + 0.4, { align: 'center' });

  doc.setFontSize(14);
  doc.text(String(label.caja), topLeftBoxX + topLeftBoxWidth / 2, topLeftBoxY + 0.95, {
    align: 'center',
  });

  const logoWidth = 4.6;
  const logoHeight = 0.9;
  const logoX = frameX + (frameWidth - logoWidth) / 2;
  const logoY = frameY + 0.2;

  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('LITOTECA', frameX + frameWidth / 2, logoY + 0.5, { align: 'center' });
  }

  const muestrasBoxX = frameX + 4.35;
  const muestrasBoxY = frameY + 1.1;
  const muestrasBoxWidth = 3.3;
  const muestrasBoxHeight = 0.55;
  doc.rect(muestrasBoxX, muestrasBoxY, muestrasBoxWidth, muestrasBoxHeight);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    `MUESTRAS: ${label.muestras}`,
    muestrasBoxX + muestrasBoxWidth / 2,
    muestrasBoxY + 0.37,
    {
      align: 'center',
    }
  );

  const idsBoxX = frameX + 0.2;
  const idsBoxY = frameY + 1.8;
  const idsBoxWidth = 11.6;
  const idsBoxHeight = 1.45;
  doc.rect(idsBoxX, idsBoxY, idsBoxWidth, idsBoxHeight);

  doc.setFont('helvetica', 'normal');
  const idsText = formatIdsMuestra(label.idsMuestra) || '—';
  const idsMaxTextWidth = idsBoxWidth - 0.12;
  doc.setFont(ALPHANUMERIC_FONT_FAMILY, 'strong');
  const idsFit = fitTextToBox(doc, idsText, idsMaxTextWidth, idsBoxHeight - 0.06, 11.5, 4.4, 1.02);
  const idsTextHeight = idsFit.lines.length * idsFit.lineHeight;
  const idsTextStartY = idsBoxY + (idsBoxHeight - idsTextHeight) / 2 + idsFit.lineHeight * 0.82;
  doc.setFontSize(idsFit.fontSize);
  idsFit.lines.forEach((line, index) => {
    doc.text(line, idsBoxX + idsBoxWidth / 2, idsTextStartY + index * idsFit.lineHeight, {
      align: 'center',
    });
  });

  const bottomBoxX = frameX + 0.2;
  const bottomBoxY = frameY + 3.45;
  const bottomBoxWidth = 11.6;
  const bottomBoxHeight = 1.35;
  doc.rect(bottomBoxX, bottomBoxY, bottomBoxWidth, bottomBoxHeight);

  const proyecto = label.contratoProyecto || '—';
  const anio = label.anio || '—';
  const planchas = formatPlanchas(label.planchas) || '—';

  const bottomPadding = 0.08;
  const contentTopY = bottomBoxY + bottomPadding;
  const contentMaxWidth = bottomBoxWidth - 0.3;

  const contentHeight = bottomBoxHeight - bottomPadding * 2;
  const rowAreaHeight = contentHeight / 3;

  const projectAreaHeight = rowAreaHeight;
  const planchasAreaHeight = rowAreaHeight;
  const yearAreaHeight = rowAreaHeight;

  const projectAreaY = contentTopY;
  const planchasAreaY = projectAreaY + projectAreaHeight;
  const yearAreaY = planchasAreaY + planchasAreaHeight;

  const bottomTexts = [proyecto, `Planchas: ${planchas}`, `Año ${anio}`];
  doc.setFont(ALPHANUMERIC_FONT_FAMILY, 'strong');
  const sharedFit = fitTextsToSharedFont(
    doc,
    bottomTexts,
    contentMaxWidth,
    [projectAreaHeight, planchasAreaHeight, yearAreaHeight],
    14,
    5,
    0.9
  );

  const rowTopYs = [projectAreaY, planchasAreaY, yearAreaY];
  doc.setFontSize(sharedFit.fontSize);
  sharedFit.linesPerText.forEach((lines, rowIndex) => {
    const textHeight = lines.length * sharedFit.lineHeight;
    const textStartY =
      rowTopYs[rowIndex] +
      ([projectAreaHeight, planchasAreaHeight, yearAreaHeight][rowIndex] - textHeight) / 2 +
      sharedFit.lineHeight * 0.82;

    lines.forEach((line, lineIndex) => {
      doc.text(
        line,
        bottomBoxX + bottomBoxWidth / 2,
        textStartY + lineIndex * sharedFit.lineHeight,
        {
          align: 'center',
        }
      );
    });
  });
}

export async function generateCanastillasPDF(labels: CanastillaLabelData[]): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'cm',
    format: 'letter',
  });

  const logoBase64 = await getImageBase64('/logo-litoteca.png');

  const labelsPerPage = 5;
  const frameX = 4.58;
  const firstFrameY = 1.13;
  const frameHeight = 5.0;
  const verticalGap = 0.2;

  labels.forEach((label, index) => {
    const positionInPage = index % labelsPerPage;

    if (index > 0 && positionInPage === 0) {
      doc.addPage();
    }

    const frameY = firstFrameY + positionInPage * (frameHeight + verticalGap);
    drawCanastillaLabel(doc, label, logoBase64, frameX, frameY);
  });

  return doc;
}

export function generateCanastillaPDFFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `rotulos_canastilla_${year}${month}${day}.pdf`;
}

export async function downloadCanastillasPDF(labels: CanastillaLabelData[]): Promise<void> {
  const doc = await generateCanastillasPDF(labels);
  doc.save(generateCanastillaPDFFilename());
}
