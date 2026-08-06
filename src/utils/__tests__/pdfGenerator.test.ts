import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateRotulosPDF } from '@/utils/pdfGenerator';
import { RotuloData } from '@/types/rotulo';

function makeValidRotulo(overrides: Partial<RotuloData> = {}): RotuloData {
  return {
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
    ...overrides,
  };
}

beforeEach(() => {
  // No network in tests: logo fetch rejects -> getImageBase64 returns '' -> text fallback.
  vi.stubGlobal(
    'fetch',
    vi.fn().mockRejectedValue(new TypeError('Failed to fetch (no network in tests)'))
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('generateRotulosPDF', () => {
  it('produces a single page for up to 6 rotulos', async () => {
    const rotulos = Array.from({ length: 6 }, (_, i) =>
      makeValidRotulo({ idMuestra: `MUESTRA-${i}` })
    );
    const doc = await generateRotulosPDF(rotulos);
    expect(doc.getNumberOfPages()).toBe(1);
  });

  it('adds a second page when exceeding 6 rotulos', async () => {
    const rotulos = Array.from({ length: 7 }, (_, i) =>
      makeValidRotulo({ idMuestra: `MUESTRA-${i}` })
    );
    const doc = await generateRotulosPDF(rotulos);
    expect(doc.getNumberOfPages()).toBe(2);
  });

  it('falls back to the text logo when the logo fetch fails', async () => {
    // fetch('/logo-litoteca.png') is rejected (stubbed above), so
    // getImageBase64 returns '' and the generator draws the text
    // fallback instead of throwing.
    const rotulos = Array.from({ length: 2 }, (_, i) =>
      makeValidRotulo({ idMuestra: `MUESTRA-${i}` })
    );
    const doc = await generateRotulosPDF(rotulos);
    expect(doc.getNumberOfPages()).toBe(1);
  });

  it('uses the text fallback when the logo response is not OK', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;
    vi.stubGlobal('fetch', fetchMock);
    const doc = await generateRotulosPDF([makeValidRotulo()]);
    expect(doc.getNumberOfPages()).toBe(1);
    expect(fetchMock).toHaveBeenCalled();
  });

  it('handles an empty rotulos array', async () => {
    const doc = await generateRotulosPDF([]);
    expect(doc.getNumberOfPages()).toBe(1);
  });
});
