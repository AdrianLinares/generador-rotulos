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
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('LITOTECA', startX + rotuloWidth / 2, yPos + 0.3, { align: 'center' });
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('SERVICIO GEOLÓGICO COLOMBIANO', startX + rotuloWidth / 2, yPos + 0.6, { align: 'center' });
    yPos += 1.2;
  }

  // CONTRATO, PROYECTO O CONVENIO
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRATO, PROYECTO O CONVENIO', leftMargin, yPos);
  yPos += 0.35;

  doc.setFontSize(7);
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
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('ID MUESTRA:', leftMargin, yPos);
  doc.setFont('helvetica', 'normal');
  const idMuestraText = rotulo.idMuestra || '';
  doc.text(idMuestraText, leftMargin + 2.0, yPos);
  // Subrayar ID MUESTRA
  const idWidth = doc.getTextWidth(idMuestraText);
  doc.line(leftMargin + 2.0, yPos + 0.05, leftMargin + 2.0 + idWidth, yPos + 0.05);

  // IGM en la misma línea
  const igmX = leftMargin + 5.0;
  doc.setFont('helvetica', 'bold');
  doc.text('IGM:', igmX, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(rotulo.igm || '', igmX + 0.8, yPos);

  yPos += 0.4;

  // PLANCHA y DATUM (misma línea)
  doc.setFont('helvetica', 'bold');
  doc.text('PLANCHA:', leftMargin, yPos);
  doc.setFont('helvetica', 'normal');
  const planchaText = rotulo.plancha || '';
  doc.text(planchaText, leftMargin + 1.5, yPos);
  // Subrayar PLANCHA
  const planchaWidth = doc.getTextWidth(planchaText);
  doc.line(leftMargin + 1.5, yPos + 0.05, leftMargin + 1.5 + planchaWidth, yPos + 0.05);

  // DATUM en la misma línea
  const datumX = leftMargin + 4.0;
  doc.setFont('helvetica', 'bold');
  doc.text('DATUM:', datumX, yPos);
  doc.setFont('helvetica', 'normal');
  const datumText = rotulo.datum || '';
  doc.text(datumText, datumX + 1.2, yPos);
  // Subrayar DATUM
  const datumWidth = doc.getTextWidth(datumText);
  doc.line(datumX + 1.2, yPos + 0.05, datumX + 1.2 + datumWidth, yPos + 0.05);

  yPos += 0.4;

  // UNIDAD O FORMACIÓN - en la misma línea
  doc.setFont('helvetica', 'bold');
  doc.text('UNIDAD O FORMACIÓN:', leftMargin, yPos);
  doc.setFont('helvetica', 'normal');
  const unidadText = rotulo.unidadFormacion || '';
  const unidadX = leftMargin + 3.5;
  doc.text(unidadText, unidadX, yPos);
  // Subrayar UNIDAD O FORMACIÓN
  const unidadWidth = doc.getTextWidth(unidadText);
  doc.line(unidadX, yPos + 0.05, unidadX + unidadWidth, yPos + 0.05);

  yPos += 0.4;

  // COORDENADA: X e Y
  doc.setFont('helvetica', 'bold');
  doc.text('COORDENADAS:', leftMargin, yPos);
  doc.text('X:', leftMargin + 2.2, yPos);
  doc.setFont('helvetica', 'normal');
  const xText = rotulo.x || '';
  doc.text(xText, leftMargin + 2.6, yPos);
  // Subrayar X
  const xWidth = doc.getTextWidth(xText);
  doc.line(leftMargin + 2.6, yPos + 0.05, leftMargin + 2.6 + xWidth, yPos + 0.05);

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
  yPos += 0.35;
  doc.setFont('helvetica', 'normal');
  if (rotulo.localizacion) {
    const localizacionLines = doc.splitTextToSize(rotulo.localizacion, contentWidth);
    localizacionLines.forEach((line: string) => {
      doc.text(line, leftMargin, yPos);
      // Subrayar
      const lineWidth = doc.getTextWidth(line);
      doc.line(leftMargin, yPos + 0.05, leftMargin + lineWidth, yPos + 0.05);
      yPos += 0.35;
    });
  } else {
    yPos += 0.35;
  }

  yPos += 0.05;

  // GEÓLOGO O COLECTOR - en la misma línea
  doc.setFont('helvetica', 'bold');
  doc.text('GEÓLOGO O COLECTOR:', leftMargin, yPos);
  doc.setFont('helvetica', 'normal');
  const geologoText = rotulo.geologoColector || '';
  const geologoX = leftMargin + 3.8;
  doc.text(geologoText, geologoX, yPos);
  // Subrayar
  const geologoWidth = doc.getTextWidth(geologoText);
  doc.line(geologoX, yPos + 0.05, geologoX + geologoWidth, yPos + 0.05);

  yPos += 0.4;

  // OBSERVACIONES
  doc.setFont('helvetica', 'bold');
  doc.text('OBSERVACIONES:', leftMargin, yPos);
  yPos += 0.35;
  doc.setFont('helvetica', 'normal');
  if (rotulo.observaciones) {
    const observacionesLines = doc.splitTextToSize(rotulo.observaciones, contentWidth);
    observacionesLines.forEach((line: string) => {
      if (yPos < startY + rotuloHeight - 0.3) {
        doc.text(line, leftMargin, yPos);
        yPos += 0.35;
      }
    });
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
  const gridWidth = (rotuloWidth * cols) + (horizontalGap * (cols - 1));
  const gridHeight = (rotuloHeight * rows) + (verticalGap * (rows - 1));

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
    const startX = marginLeft + (col * (rotuloWidth + horizontalGap));
    const startY = marginTop + (row * (rotuloHeight + verticalGap));

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