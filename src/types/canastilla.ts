export interface CanastillaInput {
    caja: string;
    idMuestra: string;
    contratoProyecto: string;
    anio: string;
    plancha: string;
}

export interface CanastillaTableRow extends CanastillaInput {
    id: string;
}

export interface CanastillaLabelData {
    caja: number;
    muestras: number;
    idsMuestra: string[];
    contratoProyecto: string;
    anio: string;
    planchas: string[];
}

export interface CanastillaValidationError {
    field: keyof CanastillaInput;
    message: string;
}

export interface CanastillaValidationResult {
    isValid: boolean;
    errors: CanastillaValidationError[];
}

export const EMPTY_CANASTILLA: CanastillaInput = {
    caja: '',
    idMuestra: '',
    contratoProyecto: '',
    anio: '',
    plancha: '',
};

export const CANASTILLA_FIELD_LABELS: Record<keyof CanastillaInput, string> = {
    caja: 'CAJA',
    idMuestra: 'ID MUESTRA',
    contratoProyecto: 'PROYECTO, CONTRATO O CONVENIO',
    anio: 'AÑO',
    plancha: 'PLANCHA',
};

export const CANASTILLA_REQUIRED_FIELDS: (keyof CanastillaInput)[] = [
    'caja',
    'idMuestra',
    'contratoProyecto',
    'anio',
    'plancha',
];
