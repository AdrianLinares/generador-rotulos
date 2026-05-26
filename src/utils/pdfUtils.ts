/**
 * Convierte imagen a base64 para incluir en el PDF
 */
export async function getImageBase64(imagePath: string): Promise<string> {
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

const ELLIPSIS = '...';

/**
 * Trunca la última línea de un array de líneas, quitando caracteres y agregando '...'
 * Asegura que el resultado no exceda el maxWidth disponible.
 * @param lines - Array de líneas de texto
 * @param maxWidth - Ancho máximo disponible en la unidad del PDF
 * @param getTextWidth - Función que calcula el ancho de un string (ej: doc.getTextWidth)
 */
export function truncateLastLine(
  lines: string[],
  maxWidth: number,
  getTextWidth: (text: string) => number
): string[] {
  if (lines.length === 0) return lines;
  const result = [...lines];
  const lastLine = result[result.length - 1];

  if (lastLine.length > 3) {
    let truncated = lastLine.slice(0, -3) + ELLIPSIS;
    while (getTextWidth(truncated) > maxWidth && truncated.length > ELLIPSIS.length) {
      truncated = truncated.slice(0, -ELLIPSIS.length - 1) + ELLIPSIS;
    }
    result[result.length - 1] = truncated;
  } else {
    let truncated = lastLine + ELLIPSIS;
    while (getTextWidth(truncated) > maxWidth && truncated.length > ELLIPSIS.length) {
      truncated = truncated.slice(0, -ELLIPSIS.length - 1) + ELLIPSIS;
    }
    result[result.length - 1] = truncated;
  }
  return result;
}
