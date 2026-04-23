import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CANASTILLA_FIELD_LABELS, CanastillaInput, CanastillaTableRow } from '@/types/canastilla';
import { Clipboard, Plus, Trash2 } from 'lucide-react';

interface CanastillaDataTableProps {
    rows: CanastillaTableRow[];
    onUpdateCell: (id: string, field: keyof CanastillaInput, value: string) => void;
    onRemoveRow: (id: string) => void;
    onAddRow: () => void;
    onPasteFromExcel: (text: string) => void;
}

export function CanastillaDataTable({
    rows,
    onUpdateCell,
    onRemoveRow,
    onAddRow,
    onPasteFromExcel,
}: CanastillaDataTableProps) {
    const fields: (keyof CanastillaInput)[] = ['caja', 'idMuestra', 'contratoProyecto', 'anio', 'plancha'];

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            onPasteFromExcel(text);
        } catch (error) {
            console.error('Error al pegar desde el portapapeles:', error);
            alert('No se pudo acceder al portapapeles. Pegue manualmente en una celda.');
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end gap-2">
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
                                <th key={field} className="px-3 py-3 text-left font-semibold text-slate-700 min-w-[170px]">
                                    {CANASTILLA_FIELD_LABELS[field]}
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
                                        {field === 'contratoProyecto' ? (
                                            <Textarea
                                                value={row[field]}
                                                onChange={(event) => onUpdateCell(row.id, field, event.target.value)}
                                                className="min-h-[60px] text-xs"
                                                placeholder={`Ingrese ${CANASTILLA_FIELD_LABELS[field].toLowerCase()}`}
                                            />
                                        ) : (
                                            <Input
                                                value={row[field]}
                                                onChange={(event) => onUpdateCell(row.id, field, event.target.value)}
                                                className="text-xs"
                                                placeholder={`Ingrese ${CANASTILLA_FIELD_LABELS[field].toLowerCase()}`}
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
                Total de filas: <span className="font-semibold">{rows.length}</span>
            </div>
        </div>
    );
}
