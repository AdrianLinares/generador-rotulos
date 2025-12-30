import { TableRow, FIELD_LABELS, RotuloData } from '@/types/rotulo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Clipboard } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface DataTableProps {
  rows: TableRow[];
  onUpdateCell: (id: string, field: keyof RotuloData, value: string) => void;
  onRemoveRow: (id: string) => void;
  onAddRow: () => void;
  onPasteFromExcel: (text: string) => void;
}

export function DataTable({
  rows,
  onUpdateCell,
  onRemoveRow,
  onAddRow,
  onPasteFromExcel,
}: DataTableProps) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onPasteFromExcel(text);
    } catch (err) {
      console.error('Error al pegar desde el portapapeles:', err);
      alert('No se pudo acceder al portapapeles. Por favor, pegue manualmente en una celda.');
    }
  };

  const fields: (keyof RotuloData)[] = [
    'igm',
    'idMuestra',
    'plancha',
    'geologoColector',
    'localizacion',
    'datum',
    'x',
    'y',
    'observaciones',
    'unidadFormacion',
    'contratoProyecto',
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <Button onClick={handlePaste} variant="outline" size="sm">
          <Clipboard className="w-4 h-4 mr-2" />
          Pegar desde Excel
        </Button>
        <Button onClick={onAddRow} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Fila
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-slate-700 w-8">#</th>
              {fields.map((field) => (
                <th key={field} className="px-3 py-3 text-left font-semibold text-slate-700 min-w-[150px]">
                  {FIELD_LABELS[field]}
                </th>
              ))}
              <th className="px-3 py-3 text-center font-semibold text-slate-700 w-20">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-b hover:bg-slate-50 transition-colors">
                <td className="px-3 py-2 text-slate-500">{index + 1}</td>
                {fields.map((field) => (
                  <td key={field} className="px-3 py-2">
                    {field === 'localizacion' || field === 'observaciones' || field === 'contratoProyecto' ? (
                      <Textarea
                        value={row[field]}
                        onChange={(e) => onUpdateCell(row.id, field, e.target.value)}
                        className="min-h-[60px] text-xs"
                        placeholder={`Ingrese ${FIELD_LABELS[field].toLowerCase()}`}
                      />
                    ) : (
                      <Input
                        value={row[field]}
                        onChange={(e) => onUpdateCell(row.id, field, e.target.value)}
                        className="text-xs"
                        placeholder={`Ingrese ${FIELD_LABELS[field].toLowerCase()}`}
                      />
                    )}
                  </td>
                ))}
                <td className="px-3 py-2 text-center">
                  <Button
                    onClick={() => onRemoveRow(row.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={rows.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-slate-600">
        Total de rótulos: <span className="font-semibold">{rows.length}</span>
      </div>
    </div>
  );
}