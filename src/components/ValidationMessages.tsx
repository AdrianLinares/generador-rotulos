import { ValidationResult } from '@/types/rotulo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ValidationMessagesProps {
  validationResults: Map<number, ValidationResult>;
  currentIndex: number;
}

export function ValidationMessages({ validationResults, currentIndex }: ValidationMessagesProps) {
  const currentResult = validationResults.get(currentIndex);

  if (!currentResult) return null;

  if (currentResult.isValid) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Rótulo válido</AlertTitle>
        <AlertDescription className="text-green-700">
          Este rótulo contiene todos los campos requeridos.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Errores de validación</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1 mt-2">
          {currentResult.errors.map((error, index) => (
            <li key={index} className="text-sm">
              {error.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
