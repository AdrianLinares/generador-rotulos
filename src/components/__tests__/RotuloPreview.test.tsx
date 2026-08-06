import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RotuloPreview } from '@/components/RotuloPreview';
import { RotuloData } from '@/types/rotulo';

const validRotulo: RotuloData = {
  igm: 'IGM-001',
  idMuestra: 'AMC1216',
  plancha: '18IVB',
  geologoColector: 'Ana Milena Cardozo',
  localizacion: 'Sector la Florida',
  datum: 'Magna Colombia Bogotá',
  x: '998909',
  y: '1697240',
  observaciones: 'Observación de prueba',
  unidadFormacion: 'Formación Girón',
  contratoProyecto: 'Investigación Marina',
};

describe('RotuloPreview', () => {
  it('renders the key rotulo fields', () => {
    render(<RotuloPreview rotulo={validRotulo} />);
    expect(screen.getByText('ID MUESTRA:')).toBeInTheDocument();
    expect(screen.getByText('AMC1216')).toBeInTheDocument();
    expect(screen.getByText('18IVB')).toBeInTheDocument();
    expect(screen.getByText('Magna Colombia Bogotá')).toBeInTheDocument();
    expect(screen.getByText('998909')).toBeInTheDocument();
    expect(screen.getByText('1697240')).toBeInTheDocument();
    expect(screen.getByText('Formación Girón')).toBeInTheDocument();
    expect(screen.getByText('Ana Milena Cardozo')).toBeInTheDocument();
  });

  it('renders the em-dash placeholder for empty fields', () => {
    render(<RotuloPreview rotulo={{ ...validRotulo, idMuestra: '', plancha: '' }} />);
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });
});
