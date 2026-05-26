import jsPDF from 'jspdf';
import { RotuloData } from '@/types/rotulo';

/**
 * Convierte imagen a base64 para incluir en el PDF
 */
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

/**
 * Dibuja un rótulo individual en una posición específica del PDF
 */
function drawRotulo(
  doc: jsPDF,
  rotulo: RotuloData,
  startX: number,
  startY: number,
  rotuloWidth: number,
  rotuloHeight: number,
  logoBase64: string,
  logoWidth: number,
  logoHeight: number
) {
  // Borde del rótulo
  doc.setLineWidth(0.05);
  doc.rect(startX, startY, rotuloWidth, rotuloHeight);

  // Posición inicial dentro del rótulo
  let yPos = startY + 0.3;
  const leftMargin = startX + 0.3;
  const contentWidth = rotuloWidth - 0.6;

  // Logo LITOTECA centrado
  if (logoBase64) {
    const logoX = startX + (rotuloWidth - logoWidth) / 2;
    doc.addImage(logoBase64, 'PNG', logoX, yPos, logoWidth, logoHeight);
    yPos += logoHeight + 0.4; // Espacio adicional después del logo
  } else {
    // Fallback: texto si no se carga el logo
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('LITOTECA', startX + rotuloWidth / 2, yPos + 0.3, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('SERVICIO GEOLÓGICO COLOMBIANO', startX + rotuloWidth / 2, yPos + 0.6, {
      align: 'center',
    });
    yPos += 1.2;
  }

  // CONTRATO, PROYECTO O CONVENIO
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRATO, PROYECTO O CONVENIO:', leftMargin, yPos);
  yPos += 0.35;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const contratoLines = doc.splitTextToSize(rotulo.contratoProyecto || '', contentWidth);
  contratoLines.forEach((line: string) => {
    doc.text(line, leftMargin, yPos);
    // Subrayar el texto del contrato
    const textWidth = doc.getTextWidth(line);
    doc.setLineWidth(0.01);
    doc.line(leftMargin, yPos + 0.05, leftMargin + textWidth, yPos + 0.05);
    yPos += 0.35;
  });

  yPos += 0.1;

  // ID MUESTRA e IGM (misma línea)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ID MUESTRA:', leftMargin, yPos);
  const idLabelWidth = doc.getTextWidth('ID MUESTRA:');
  doc.setFont('helvetica', 'normal');
  const idMuestraText = rotulo.idMuestra || '';
  const idSpaceWidth = doc.getTextWidth('  ');
  const idValueX = leftMargin + idLabelWidth + idSpaceWidth;
  doc.text(idMuestraText, idValueX, yPos);
  // Subrayar ID MUESTRA
  const idWidth = doc.getTextWidth(idMuestraText);
  doc.line(idValueX, yPos + 0.05, idValueX + idWidth, yPos + 0.05);

  // IGM en la misma línea
  const igmX = leftMargin + 5.0;
  doc.setFont('helvetica', 'bold');
  doc.text('IGM:', igmX, yPos);
  const igmLabelWidth = doc.getTextWidth('IGM:');
  doc.setFont('helvetica', 'normal');
  const igmSpaceWidth = doc.getTextWidth('  ');
  const igmValueX = igmX + igmLabelWidth + igmSpaceWidth;
  const igmText = rotulo.igm || '';
  doc.text(igmText, igmValueX, yPos);

  yPos += 0.4;

  // PLANCHA y DATUM (misma línea)
  doc.setFont('helvetica', 'bold');
  doc.text('PLANCHA:', leftMargin, yPos);
  const planchaLabelWidth = doc.getTextWidth('PLANCHA:');
  doc.setFont('helvetica', 'normal');
  const planchaText = rotulo.plancha || '';
  const planchaSpaceWidth = doc.getTextWidth('  ');
  const planchaX = leftMargin + planchaLabelWidth + planchaSpaceWidth;
  doc.text(planchaText, planchaX, yPos);
  // Subrayar PLANCHA
  const planchaWidth = doc.getTextWidth(planchaText);
  doc.line(planchaX, yPos + 0.05, planchaX + planchaWidth, yPos + 0.05);

  // DATUM en la misma línea
  const datumX = leftMargin + 4.0;
  doc.setFont('helvetica', 'bold');
  doc.text('DATUM:', datumX, yPos);
  const datumLabelWidth = doc.getTextWidth('DATUM:');
  doc.setFont('helvetica', 'normal');
  const datumText = rotulo.datum || '';
  const datumSpaceWidth = doc.getTextWidth('  ');
  const datumValueX = datumX + datumLabelWidth + datumSpaceWidth;
  doc.text(datumText, datumValueX, yPos);
  // Subrayar DATUM
  const datumWidth = doc.getTextWidth(datumText);
  doc.line(datumValueX, yPos + 0.05, datumValueX + datumWidth, yPos + 0.05);

  yPos += 0.4;

  // UNIDAD O FORMACIÓN - con wrapping para evitar desbordamiento
  doc.setFont('helvetica', 'bold');
  doc.text('UNIDAD O FORMACIÓN:', leftMargin, yPos);
  const unidadLabelWidth = doc.getTextWidth('UNIDAD O FORMACIÓN:');
  doc.setFont('helvetica', 'normal');
  const unidadText = rotulo.unidadFormacion || '';
  const unidadSpaceWidth = doc.getTextWidth('  ');
  const unidadX = leftMargin + unidadLabelWidth + unidadSpaceWidth;
  const availableWidthUnidad = contentWidth - (unidadLabelWidth + unidadSpaceWidth);
  const unidadLines = doc.splitTextToSize(unidadText, availableWidthUnidad);

  // Primera línea en la misma línea que el título
  if (unidadLines.length > 0) {
    doc.text(unidadLines[0], unidadX, yPos);
    const firstLineWidth = doc.getTextWidth(unidadLines[0]);
    doc.line(unidadX, yPos + 0.05, unidadX + firstLineWidth, yPos + 0.05);
    yPos += 0.35;
  }

  // Líneas adicionales con sangría
  for (let i = 1; i < unidadLines.length; i++) {
    doc.text(unidadLines[i], unidadX, yPos);
    const lineWidth = doc.getTextWidth(unidadLines[i]);
    doc.line(unidadX, yPos + 0.05, unidadX + lineWidth, yPos + 0.05);
    yPos += 0.35;
  }

  yPos += 0.05;

  // COORDENADA: X e Y
  doc.setFont('helvetica', 'bold');
  doc.text('COORDENADAS:', leftMargin, yPos);
  doc.text('X:', leftMargin + 2.6, yPos);
  doc.setFont('helvetica', 'normal');
  const xText = rotulo.x || '';
  doc.text(xText, leftMargin + 3, yPos);
  // Subrayar X
  const xWidth = doc.getTextWidth(xText);
  doc.line(leftMargin + 3, yPos + 0.05, leftMargin + 3 + xWidth, yPos + 0.05);

  // Y en la misma línea
  const yCoordX = leftMargin + 5.0;
  doc.setFont('helvetica', 'bold');
  doc.text('Y:', yCoordX, yPos);
  doc.setFont('helvetica', 'normal');
  const yText = rotulo.y || '';
  doc.text(yText, yCoordX + 0.4, yPos);
  // Subrayar Y
  const yWidth = doc.getTextWidth(yText);
  doc.line(yCoordX + 0.4, yPos + 0.05, yCoordX + 0.4 + yWidth, yPos + 0.05);

  yPos += 0.4;

  // LOCALIZACIÓN
  doc.setFont('helvetica', 'bold');
  doc.text('LOCALIZACIÓN:', leftMargin, yPos);
  const localLabelWidth = doc.getTextWidth('LOCALIZACIÓN:');
  doc.setFont('helvetica', 'normal');
  const localizacionText = rotulo.localizacion || '';
  const localSpaceWidth = doc.getTextWidth('  ');
  const localizacionX = leftMargin + localLabelWidth + localSpaceWidth;
  const availableWidth = contentWidth - (localLabelWidth + localSpaceWidth);
  const localizacionLines = doc.splitTextToSize(localizacionText, availableWidth);

  // Primera línea en la misma línea que el título
  if (localizacionLines.length > 0) {
    doc.text(localizacionLines[0], localizacionX, yPos);
    const firstLineWidth = doc.getTextWidth(localizacionLines[0]);
    doc.line(localizacionX, yPos + 0.05, localizacionX + firstLineWidth, yPos + 0.05);
    yPos += 0.35;
  }

  // Líneas adicionales con sangría
  for (let i = 1; i < localizacionLines.length; i++) {
    doc.text(localizacionLines[i], localizacionX, yPos);
    const lineWidth = doc.getTextWidth(localizacionLines[i]);
    doc.line(localizacionX, yPos + 0.05, localizacionX + lineWidth, yPos + 0.05);
    yPos += 0.35;
  }

  yPos += 0.05;

  // GEÓLOGO O COLECTOR - con wrapping para evitar desbordamiento
  doc.setFont('helvetica', 'bold');
  doc.text('GEÓLOGO O COLECTOR:', leftMargin, yPos);
  const geologoLabelWidth = doc.getTextWidth('GEÓLOGO O COLECTOR:');
  doc.setFont('helvetica', 'normal');
  const geologoText = rotulo.geologoColector || '';
  const geologoSpaceWidth = doc.getTextWidth('  ');
  const geologoX = leftMargin + geologoLabelWidth + geologoSpaceWidth;
  const availableWidthGeologo = contentWidth - (geologoLabelWidth + geologoSpaceWidth);
  const geologoLines = doc.splitTextToSize(geologoText, availableWidthGeologo);

  // Primera línea en la misma línea que el título
  if (geologoLines.length > 0) {
    doc.text(geologoLines[0], geologoX, yPos);
    const firstLineWidth = doc.getTextWidth(geologoLines[0]);
    doc.line(geologoX, yPos + 0.05, geologoX + firstLineWidth, yPos + 0.05);
    yPos += 0.35;
  }

  // Líneas adicionales con sangría
  for (let i = 1; i < geologoLines.length; i++) {
    doc.text(geologoLines[i], geologoX, yPos);
    const lineWidth = doc.getTextWidth(geologoLines[i]);
    doc.line(geologoX, yPos + 0.05, geologoX + lineWidth, yPos + 0.05);
    yPos += 0.35;
  }

  yPos += 0.05;

  // OBSERVACIONES
  doc.setFont('helvetica', 'bold');
  doc.text('OBSERVACIONES:', leftMargin, yPos);
  const observacionesLabelWidth = doc.getTextWidth('OBSERVACIONES:');
  doc.setFont('helvetica', 'normal');
  const observacionesText = rotulo.observaciones || '';
  const observacionesSpaceWidth = doc.getTextWidth('  ');
  const observacionesX = leftMargin + observacionesLabelWidth + observacionesSpaceWidth;
  const availableWidthObs = contentWidth - (observacionesLabelWidth + observacionesSpaceWidth);
  const observacionesLines = doc.splitTextToSize(observacionesText, availableWidthObs);

  // Calcular cuántas líneas caben sin sobrepasar el borde del rótulo
  const maxYPos = startY + rotuloHeight - 0.3;
  const lineHeight = 0.35;
  const maxLines = Math.max(1, Math.floor((maxYPos - yPos) / lineHeight));

  // Determinar líneas a renderizar, truncando con '...' si excede el espacio
  let linesToRender: string[];
  const overflow = observacionesLines.length > maxLines;
  if (overflow && maxLines > 0) {
    linesToRender = observacionesLines.slice(0, maxLines);
    // Truncar la última línea: quitar 3 caracteres y agregar '...'
    const lastLine = linesToRender[linesToRender.length - 1];
    const ellipsis = '...';
    if (lastLine.length > 3) {
      let truncated = lastLine.slice(0, -3) + ellipsis;
      // Asegurar que el truncado no exceda el ancho disponible
      while (doc.getTextWidth(truncated) > availableWidthObs && truncated.length > ellipsis.length) {
        truncated = truncated.slice(0, -ellipsis.length - 1) + ellipsis;
      }
      linesToRender[linesToRender.length - 1] = truncated;
    } else {
      linesToRender[linesToRender.length - 1] = lastLine.slice(0, lastLine.length) + ellipsis;
      while (
        doc.getTextWidth(linesToRender[linesToRender.length - 1]) > availableWidthObs &&
        linesToRender[linesToRender.length - 1].length > ellipsis.length
      ) {
        linesToRender[linesToRender.length - 1] =
          linesToRender[linesToRender.length - 1].slice(0, -ellipsis.length - 1) + ellipsis;
      }
    }
  } else {
    linesToRender = observacionesLines;
  }

  // Primera línea en la misma línea que el título
  if (linesToRender.length > 0) {
    doc.text(linesToRender[0], observacionesX, yPos);
    const firstLineWidth = doc.getTextWidth(linesToRender[0]);
    doc.line(observacionesX, yPos + 0.05, observacionesX + firstLineWidth, yPos + 0.05);
    yPos += 0.35;
  }

  // Líneas adicionales con sangría
  for (let i = 1; i < linesToRender.length; i++) {
    doc.text(linesToRender[i], observacionesX, yPos);
    const lineWidth = doc.getTextWidth(linesToRender[i]);
    doc.line(observacionesX, yPos + 0.05, observacionesX + lineWidth, yPos + 0.05);
    yPos += 0.35;
  }
}

/**
 * Genera un PDF con los rótulos geológicos
 * Distribución: 6 rótulos por página (2 columnas × 3 filas)
 * Dimensiones del marco: 9.182cm x 7.259cm
 * Logo: 4.4cm x 1.12cm
 */
export async function generateRotulosPDF(rotulos: RotuloData[]): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'cm',
    format: 'letter',
  });

  // Cargar logo
  const logoBase64 = await getImageBase64('/logo-litoteca.png');

  // Dimensiones del rótulo (en cm)
  const rotuloWidth = 9.182;
  const rotuloHeight = 7.259;
  const logoWidth = 4.4;
  const logoHeight = 1.12;

  // Dimensiones de la página
  const pageWidth = 21.59; // carta en cm
  const pageHeight = 27.94;

  // Configuración de la cuadrícula: 2 columnas × 3 filas
  const cols = 2;
  const rows = 3;
  const rotulosPorPagina = cols * rows; // 6 rótulos por página

  // Calcular espaciado entre rótulos
  const horizontalGap = 0.5; // espacio entre columnas
  const verticalGap = 0.5; // espacio entre filas

  // Calcular el ancho y alto total de la cuadrícula
  const gridWidth = rotuloWidth * cols + horizontalGap * (cols - 1);
  const gridHeight = rotuloHeight * rows + verticalGap * (rows - 1);

  // Calcular márgenes para centrar la cuadrícula
  const marginLeft = (pageWidth - gridWidth) / 2;
  const marginTop = (pageHeight - gridHeight) / 2;

  // Procesar rótulos en grupos de 6
  for (let i = 0; i < rotulos.length; i++) {
    const pageIndex = Math.floor(i / rotulosPorPagina);
    const positionInPage = i % rotulosPorPagina;

    // Agregar nueva página si es necesario (excepto para la primera)
    if (i > 0 && positionInPage === 0) {
      doc.addPage();
    }

    // Calcular posición en la cuadrícula (fila y columna)
    const col = positionInPage % cols;
    const row = Math.floor(positionInPage / cols);

    // Calcular posición X e Y para este rótulo
    const startX = marginLeft + col * (rotuloWidth + horizontalGap);
    const startY = marginTop + row * (rotuloHeight + verticalGap);

    // Dibujar el rótulo en la posición calculada
    drawRotulo(
      doc,
      rotulos[i],
      startX,
      startY,
      rotuloWidth,
      rotuloHeight,
      logoBase64,
      logoWidth,
      logoHeight
    );
  }

  return doc;
}

/**
 * Genera el nombre del archivo PDF con la fecha actual
 */
export function generatePDFFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `rotulos_geologicos_${year}${month}${day}.pdf`;
}

/**
 * Descarga el PDF generado
 */
export async function downloadRotulosPDF(rotulos: RotuloData[]): Promise<void> {
  const doc = await generateRotulosPDF(rotulos);
  const filename = generatePDFFilename();
  doc.save(filename);
}
