import { CanastillaLabelData } from '@/types/canastilla';
import { formatIdsMuestra, formatPlanchas } from '@/utils/canastilla';

interface CanastillaPreviewProps {
    canastilla: CanastillaLabelData;
}

export function CanastillaPreview({ canastilla }: CanastillaPreviewProps) {
    const idsMuestraText = formatIdsMuestra(canastilla.idsMuestra) || '—';
    const planchasText = formatPlanchas(canastilla.planchas) || '—';
    const proyecto = canastilla.contratoProyecto || '—';
    const anio = canastilla.anio || '—';

    return (
        <div className="bg-white mx-auto" style={{ width: '454px', height: '189px' }}>
            <div className="h-full border-2 border-black relative p-[8px] flex flex-col gap-[8px] overflow-hidden">
                <div className="flex items-start justify-between px-[2px]">
                    <div className="border border-black w-[92px] h-[52px] flex flex-col items-center justify-center leading-tight">
                        <span className="text-[15px] font-semibold">CAJA</span>
                        <span className="text-[24px] font-semibold">{canastilla.caja}</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-[4px]">
                        <img
                            src="/logo-litoteca.png"
                            alt="LITOTECA"
                            className="object-contain"
                            style={{ width: '210px', height: '38px' }}
                        />
                        <div className="border border-black px-[14px] py-[2px] text-[11px] leading-tight">
                            <span className="font-semibold">MUESTRAS:</span> {canastilla.muestras}
                        </div>
                    </div>

                    <div className="w-[92px]" />
                </div>

                <div className="border border-black px-[10px] py-[6px] text-[8px] leading-tight text-center min-h-[58px] flex items-center justify-center">
                    <p className="break-words">{idsMuestraText}</p>
                </div>

                <div className="border border-black px-[10px] py-[1px] text-[7px] leading-tight text-center flex-1 flex flex-col items-center justify-around">
                    <p>{proyecto}</p>
                    <p>Planchas: {planchasText}</p>
                    <p>Año {anio}</p>
                </div>
            </div>
        </div>
    );
}
