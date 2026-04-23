import jsPDF from 'jspdf';
import { CanastillaLabelData } from '@/types/canastilla';
import { formatIdsMuestra, formatPlanchas } from '@/utils/canastilla';

const ALPHANUMERIC_FONT_FAMILY = 'courier';

async function getImageBase64(imagePath: string): Promise<string> {
    try {
        const response = await fetch(imagePath);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error loading image:', error);
        return '';
    }
}

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

function drawFittedCenteredText(
    doc: jsPDF,
    text: string,
    centerX: number,
    topY: number,
    maxWidth: number,
    maxHeight: number,
    initialFontSize: number,
    minFontSize = 4.2,
    lineHeightFactor = 1.15
) {
    const fit = fitTextToBox(doc, text, maxWidth, maxHeight, initialFontSize, minFontSize, lineHeightFactor);
    const textHeight = fit.lines.length * fit.lineHeight;
    const startY = topY + (maxHeight - textHeight) / 2 + fit.lineHeight * 0.75;

    doc.setFontSize(fit.fontSize);
    fit.lines.forEach((line, index) => {
        doc.text(line, centerX, startY + index * fit.lineHeight, { align: 'center' });
    });
}

function drawCanastillaLabel(doc: jsPDF, label: CanastillaLabelData, logoBase64: string, frameX: number, frameY: number) {
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
    doc.text(String(label.caja), topLeftBoxX + topLeftBoxWidth / 2, topLeftBoxY + 0.95, { align: 'center' });

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
    doc.text(`MUESTRAS: ${label.muestras}`, muestrasBoxX + muestrasBoxWidth / 2, muestrasBoxY + 0.37, {
        align: 'center',
    });

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

    const projectAreaHeight = 0.43;
    const planchasAreaHeight = 0.56;
    const yearAreaHeight = 0.2;

    const projectAreaY = contentTopY;
    const planchasAreaY = projectAreaY + projectAreaHeight;
    const yearAreaY = planchasAreaY + planchasAreaHeight;

    doc.setFont('helvetica', 'normal');
    drawFittedCenteredText(
        doc,
        proyecto,
        bottomBoxX + bottomBoxWidth / 2,
        projectAreaY,
        contentMaxWidth,
        projectAreaHeight,
        6.2,
        4.6
    );

    doc.setFont(ALPHANUMERIC_FONT_FAMILY, 'strong');
    drawFittedCenteredText(
        doc,
        `Planchas: ${planchas}`,
        bottomBoxX + bottomBoxWidth / 2,
        planchasAreaY,
        contentMaxWidth,
        planchasAreaHeight,
        6.8,
        4.0
    );

    drawFittedCenteredText(
        doc,
        `Año ${anio}`,
        bottomBoxX + bottomBoxWidth / 2,
        yearAreaY,
        contentMaxWidth,
        yearAreaHeight,
        6.8,
        4.0
    );
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
