import { RotuloData } from '@/types/rotulo';

interface RotuloPreviewProps {
  rotulo: RotuloData;
}

export function RotuloPreview({ rotulo }: RotuloPreviewProps) {
  return (
    <div className="bg-white mx-auto" style={{ width: '347px', height: '274px' }}>
      {/* Borde del rótulo - dimensiones exactas 9.182cm x 7.259cm a escala */}
      <div className="border-2 border-black h-full flex flex-col p-2 overflow-hidden">
        {/* Logo LITOTECA */}
        <div className="flex justify-center mb-3">
          <img 
            src="/logo-litoteca.png" 
            alt="LITOTECA" 
            className="h-8"
            style={{ width: '133px', height: '34px' }}
          />
        </div>

        {/* Contenido del rótulo */}
        <div className="space-y-1 text-[9px] flex-1 overflow-hidden">
          {/* CONTRATO, PROYECTO O CONVENIO */}
          <div>
            <div className="font-bold leading-tight">CONTRATO, PROYECTO O CONVENIO</div>
            <div className="underline leading-tight truncate">
              {rotulo.contratoProyecto || '—'}
            </div>
          </div>

          {/* ID MUESTRA e IGM */}
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <span className="font-bold">ID MUESTRA: </span>
              <span className="underline truncate">{rotulo.idMuestra || '—'}</span>
            </div>
            <div className="flex-shrink-0">
              <span className="font-bold">IGM: </span>
              <span>{rotulo.igm || '—'}</span>
            </div>
          </div>

          {/* PLANCHA y DATUM */}
          <div className="flex gap-3">
            <div>
              <span className="font-bold">PLANCHA: </span>
              <span className="underline">{rotulo.plancha || '—'}</span>
            </div>
            <div>
              <span className="font-bold">DATUM: </span>
              <span className="underline">{rotulo.datum || '—'}</span>
            </div>
          </div>

          {/* UNIDAD O FORMACIÓN - en la misma línea */}
          <div className="leading-tight">
            <span className="font-bold">UNIDAD O FORMACIÓN </span>
            <span className="truncate">{rotulo.unidadFormacion || '—'}</span>
          </div>

          {/* COORDENADA */}
          <div className="flex gap-2">
            <span className="font-bold">COORDENADA:</span>
            <div className="flex gap-3">
              <div>
                <span className="font-bold">X: </span>
                <span className="underline">{rotulo.x || '—'}</span>
              </div>
              <div>
                <span className="font-bold">Y: </span>
                <span className="underline">{rotulo.y || '—'}</span>
              </div>
            </div>
          </div>

          {/* LOCALIZACIÓN */}
          <div>
            <div className="font-bold leading-tight">LOCALIZACIÓN</div>
            <div className="underline leading-tight truncate">
              {rotulo.localizacion || '—'}
            </div>
          </div>

          {/* GEÓLOGO O COLECTOR - en la misma línea */}
          <div className="leading-tight">
            <span className="font-bold">GEÓLOGO O COLECTOR </span>
            <span className="underline truncate">{rotulo.geologoColector || '—'}</span>
          </div>

          {/* OBSERVACIONES */}
          <div className="flex-1 overflow-hidden">
            <div className="font-bold leading-tight">OBSERVACIONES</div>
            <div className="leading-tight text-[8px] break-words overflow-hidden" style={{ maxHeight: '24px' }}>
              {rotulo.observaciones || ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}