// Tipos para la aplicación de rótulos geológicos

export interface RotuloData {
  igm: string;
  idMuestra: string;
  plancha: string;
  geologoColector: string;
  localizacion: string;
  datum: string;
  x: string;
  y: string;
  observaciones: string;
  unidadFormacion: string;
  contratoProyecto: string;
}

export interface TableRow extends RotuloData {
  id: string;
}

export interface ValidationError {
  field: keyof RotuloData;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const EMPTY_ROTULO: RotuloData = {
  igm: '',
  idMuestra: '',
  plancha: '',
  geologoColector: '',
  localizacion: '',
  datum: '',
  x: '',
  y: '',
  observaciones: '',
  unidadFormacion: '',
  contratoProyecto: '',
};

export const FIELD_LABELS: Record<keyof RotuloData, string> = {
  igm: 'IGM',
  idMuestra: 'ID MUESTRA',
  plancha: 'PLANCHA',
  geologoColector: 'GEÓLOGO O COLECTOR',
  localizacion: 'LOCALIZACIÓN',
  datum: 'DATUM',
  x: 'X',
  y: 'Y',
  observaciones: 'OBSERVACIONES',
  unidadFormacion: 'UNIDAD O FORMACIÓN',
  contratoProyecto: 'CONTRATO, PROYECTO O CONVENIO',
};

// Campos requeridos para validación
export const REQUIRED_FIELDS: (keyof RotuloData)[] = [
  'idMuestra',
  'plancha',
  'geologoColector',
  'datum',
  'x',
  'y',
  'contratoProyecto',
];
