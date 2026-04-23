import { useState } from 'react';
import { useRotuloData } from '@/hooks/useRotuloData';
import { useCanastillaData } from '@/hooks/useCanastillaData';
import { DataTable } from '@/components/DataTable';
import { CanastillaDataTable } from '@/components/CanastillaDataTable';
import { RotuloPreview } from '@/components/RotuloPreview';
import { CanastillaPreview } from '@/components/CanastillaPreview';
import { NavigationControls } from '@/components/NavigationControls';
import { ValidationMessages } from '@/components/ValidationMessages';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Trash2, FileText } from 'lucide-react';
import { validateRotulos } from '@/utils/validation';
import { downloadRotulosPDF } from '@/utils/pdfGenerator';
import { generateSampleData } from '@/utils/excelParser';
import { toast } from 'sonner';
import { ValidationResult } from '@/types/rotulo';
import { CanastillaValidationResult } from '@/types/canastilla';
import { validateCanastillaRows } from '@/utils/canastillaValidation';
import { groupCanastillaByCaja } from '@/utils/canastilla';
import { downloadCanastillasPDF } from '@/utils/canastillaPdfGenerator';

type LabelType = 'muestra' | 'canastilla';

export default function Index() {
  const [labelType, setLabelType] = useState<LabelType>('muestra');

  const {
    rows,
    currentPreviewIndex,
    addRow,
    removeRow,
    updateCell,
    clearAll,
    pasteFromExcel,
    getRotulosData,
    goToNextPreview,
    goToPreviousPreview,
    goToPreview,
  } = useRotuloData();

  const {
    rows: canastillaRows,
    labels: canastillaLabels,
    currentPreviewIndex: currentCanastillaPreviewIndex,
    addRow: addCanastillaRow,
    removeRow: removeCanastillaRow,
    updateCell: updateCanastillaCell,
    clearAll: clearCanastillaRows,
    pasteFromExcel: pasteCanastillaFromExcel,
    loadSampleData: loadCanastillaSampleData,
    getCanastillaInputData,
    goToNextPreview: goToNextCanastillaPreview,
    goToPreviousPreview: goToPreviousCanastillaPreview,
    goToPreview: goToCanastillaPreview,
  } = useCanastillaData();

  const [isGenerating, setIsGenerating] = useState(false);
  const [validationResults, setValidationResults] = useState<Map<number, ValidationResult>>(new Map());
  const [canastillaValidationResults, setCanastillaValidationResults] = useState<
    Map<number, CanastillaValidationResult>
  >(new Map());

  // Validar datos cuando cambien
  const handleValidate = () => {
    const rotulos = getRotulosData();
    const results = validateRotulos(rotulos);
    setValidationResults(results);

    const validCount = Array.from(results.values()).filter((r) => r.isValid).length;
    const totalCount = results.size;

    if (validCount === totalCount) {
      toast.success(`Todos los ${totalCount} rótulos son válidos`);
    } else {
      toast.warning(`${validCount} de ${totalCount} rótulos son válidos`);
    }
  };

  const handleValidateCanastilla = () => {
    const inputs = getCanastillaInputData();
    const results = validateCanastillaRows(inputs);
    setCanastillaValidationResults(results);

    const validCount = Array.from(results.values()).filter((r) => r.isValid).length;
    const totalCount = results.size;

    if (validCount === totalCount) {
      toast.success(`Todas las ${totalCount} filas son válidas para canastilla`);
    } else {
      toast.warning(`${validCount} de ${totalCount} filas son válidas para canastilla`);
    }
  };

  // Generar y descargar PDF
  const handleGeneratePDF = async () => {
    const rotulos = getRotulosData();
    const results = validateRotulos(rotulos);

    // Filtrar solo rótulos válidos
    const validRotulos = rotulos.filter((_, index) => {
      const result = results.get(index);
      return result?.isValid;
    });

    if (validRotulos.length === 0) {
      toast.error('No hay rótulos válidos para generar el PDF');
      return;
    }

    setIsGenerating(true);
    try {
      await downloadRotulosPDF(validRotulos);
      toast.success(`PDF generado con ${validRotulos.length} rótulo(s)`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCanastillaPDF = async () => {
    const inputs = getCanastillaInputData();
    const results = validateCanastillaRows(inputs);

    const validRows = inputs.filter((_, index) => results.get(index)?.isValid);
    const labels = groupCanastillaByCaja(validRows);

    if (labels.length === 0) {
      toast.error('No hay canastillas válidas para generar el PDF');
      return;
    }

    setIsGenerating(true);
    try {
      await downloadCanastillasPDF(labels);
      toast.success(`PDF de canastilla generado con ${labels.length} rótulo(s)`);
    } catch (error) {
      console.error('Error al generar PDF de canastilla:', error);
      toast.error('Error al generar el PDF de canastilla');
    } finally {
      setIsGenerating(false);
    }
  };

  // Cargar datos de ejemplo
  const handleLoadSample = () => {
    const sampleData = generateSampleData();
    const sampleText = sampleData
      .map((r) => [
        r.igm,
        r.idMuestra,
        r.plancha,
        r.geologoColector,
        r.localizacion,
        r.datum,
        r.x,
        r.y,
        r.observaciones,
        r.unidadFormacion,
        r.contratoProyecto,
      ].join('\t'))
      .join('\n');
    pasteFromExcel(sampleText);
    toast.success('Datos de ejemplo cargados');
  };

  const handleLoadCanastillaSample = () => {
    loadCanastillaSampleData();
    toast.success('Datos de ejemplo de canastilla cargados');
  };

  // Limpiar todo
  const handleClearAll = () => {
    if (confirm('¿Está seguro de que desea limpiar todos los datos?')) {
      if (labelType === 'muestra') {
        clearAll();
        setValidationResults(new Map());
      } else {
        clearCanastillaRows();
        setCanastillaValidationResults(new Map());
      }
      toast.info('Tabla limpiada');
    }
  };

  const currentRotulo = rows[currentPreviewIndex];
  const currentCanastilla = canastillaLabels[currentCanastillaPreviewIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        {/* Encabezado */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Generador de Rótulos Geológicos
          </h1>
          <p className="text-slate-600">
            Ingrese los datos de las muestras y genere rótulos en formato PDF
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Tipo de Rótulo</CardTitle>
            <CardDescription>
              Seleccione el tipo de rótulo a generar: muestra refinado o canastilla
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setLabelType('muestra')}
                variant={labelType === 'muestra' ? 'default' : 'outline'}
              >
                Rótulo de Muestra
              </Button>
              <Button
                type="button"
                onClick={() => setLabelType('canastilla')}
                variant={labelType === 'canastilla' ? 'default' : 'outline'}
              >
                Rótulo Canastilla
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sección 1: Tabla de datos */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Entrada de Datos
                </CardTitle>
                <CardDescription className="mt-2">
                  Ingrese los datos manualmente o pegue desde Excel. Todos los campos marcados como
                  requeridos deben ser completados.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={labelType === 'muestra' ? handleLoadSample : handleLoadCanastillaSample}
                  variant="outline"
                  size="sm"
                >
                  Cargar Ejemplo
                </Button>
                <Button
                  onClick={handleClearAll}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpiar Todo
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {labelType === 'muestra' ? (
              <DataTable
                rows={rows}
                onUpdateCell={updateCell}
                onRemoveRow={removeRow}
                onAddRow={addRow}
                onPasteFromExcel={pasteFromExcel}
              />
            ) : (
              <CanastillaDataTable
                rows={canastillaRows}
                onUpdateCell={updateCanastillaCell}
                onRemoveRow={removeCanastillaRow}
                onAddRow={addCanastillaRow}
                onPasteFromExcel={pasteCanastillaFromExcel}
              />
            )}
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Sección 2: Vista previa */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Vista Previa del Rótulo</CardTitle>
            <CardDescription>
              Navegue entre los diferentes rótulos para verificar cómo se verán en el PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Controles de navegación */}
            <NavigationControls
              currentIndex={labelType === 'muestra' ? currentPreviewIndex : currentCanastillaPreviewIndex}
              totalCount={labelType === 'muestra' ? rows.length : canastillaLabels.length}
              onPrevious={labelType === 'muestra' ? goToPreviousPreview : goToPreviousCanastillaPreview}
              onNext={labelType === 'muestra' ? goToNextPreview : goToNextCanastillaPreview}
              onGoTo={labelType === 'muestra' ? goToPreview : goToCanastillaPreview}
            />

            {/* Mensajes de validación */}
            {labelType === 'muestra' && validationResults.size > 0 && (
              <ValidationMessages
                validationResults={validationResults}
                currentIndex={currentPreviewIndex}
              />
            )}

            {labelType === 'canastilla' && canastillaValidationResults.size > 0 && (
              <div className="rounded-lg border border-slate-200 p-4 bg-slate-50 text-sm text-slate-700">
                Filas válidas para canastilla:{' '}
                <span className="font-semibold">
                  {
                    Array.from(canastillaValidationResults.values()).filter((result) => result.isValid)
                      .length
                  }
                </span>{' '}
                de <span className="font-semibold">{canastillaValidationResults.size}</span>.
              </div>
            )}

            {/* Preview del rótulo */}
            {labelType === 'muestra' && currentRotulo && <RotuloPreview rotulo={currentRotulo} />}
            {labelType === 'canastilla' && currentCanastilla && (
              <CanastillaPreview canastilla={currentCanastilla} />
            )}
            {labelType === 'canastilla' && !currentCanastilla && (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-600">
                No hay canastillas agrupadas para vista previa. Verifique que CAJA sea un numero entero y
                que los campos requeridos esten completos.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sección 3: Generación de PDF */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Generar PDF</CardTitle>
            <CardDescription>
              Valide los datos y genere el archivo PDF con todos los rótulos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={labelType === 'muestra' ? handleValidate : handleValidateCanastilla}
                variant="outline"
                size="lg"
              >
                Validar Datos
              </Button>
              <Button
                onClick={labelType === 'muestra' ? handleGeneratePDF : handleGenerateCanastillaPDF}
                disabled={
                  isGenerating ||
                  (labelType === 'muestra' ? rows.length === 0 : canastillaRows.length === 0)
                }
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>Generando PDF...</>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Descargar PDF
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-slate-600">
              <p>
                El PDF se generará en formato carta (8.5" × 11").
              </p>
              <p className="mt-1">
                Solo se incluirán los rótulos que pasen la validación.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}