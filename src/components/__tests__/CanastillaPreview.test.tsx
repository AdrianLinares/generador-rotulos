import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CanastillaPreview } from '@/components/CanastillaPreview';
import { CanastillaLabelData } from '@/types/canastilla';

const label: CanastillaLabelData = {
  caja: 10,
  muestras: 3,
  idsMuestra: ['APN144', 'APN763A', 'APN0774'],
  contratoProyecto: 'Investigación Geológica',
  anio: '2024',
  planchas: ['560IVB', '560IID'],
};

describe('CanastillaPreview', () => {
  it('renders the canastilla fields from the fixture', () => {
    render(<CanastillaPreview canastilla={label} />);
    expect(screen.getByText('CAJA')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('MUESTRAS:')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('APN144 - APN763A - APN0774')).toBeInTheDocument();
    expect(screen.getByText('Investigación Geológica')).toBeInTheDocument();
    expect(screen.getByText('Planchas: 560IVB - 560IID')).toBeInTheDocument();
    expect(screen.getByText('Año 2024')).toBeInTheDocument();
  });

  it('renders em-dash placeholders when a label has no data', () => {
    const emptyLabel: CanastillaLabelData = {
      caja: 0,
      muestras: 0,
      idsMuestra: [],
      contratoProyecto: '',
      anio: '',
      planchas: [],
    };
    render(<CanastillaPreview canastilla={emptyLabel} />);
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });
});
