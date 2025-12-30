import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationControlsProps {
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

export function NavigationControls({
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  onGoTo,
}: NavigationControlsProps) {
  if (totalCount === 0) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        variant="outline"
        size="sm"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Anterior
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">Rótulo</span>
        <select
          value={currentIndex}
          onChange={(e) => onGoTo(Number(e.target.value))}
          className="px-3 py-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Array.from({ length: totalCount }, (_, i) => (
            <option key={i} value={i}>
              {i + 1}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-600">de {totalCount}</span>
      </div>

      <Button
        onClick={onNext}
        disabled={currentIndex === totalCount - 1}
        variant="outline"
        size="sm"
      >
        Siguiente
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}