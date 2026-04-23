import { CanastillaInput, CanastillaLabelData } from '@/types/canastilla';

function normalizeValue(value: string): string {
    return value.trim();
}

function pushUnique(target: string[], value: string) {
    if (!target.includes(value)) {
        target.push(value);
    }
}

function pushUniqueCaseInsensitive(target: string[], value: string) {
    const normalized = value.toUpperCase();
    const exists = target.some((item) => item.toUpperCase() === normalized);
    if (!exists) {
        target.push(normalized);
    }
}

export function groupCanastillaByCaja(rows: CanastillaInput[]): CanastillaLabelData[] {
    const grouped = new Map<number, CanastillaLabelData>();

    rows.forEach((row) => {
        const caja = Number.parseInt(normalizeValue(row.caja), 10);
        if (Number.isNaN(caja)) {
            return;
        }

        const idMuestra = normalizeValue(row.idMuestra);
        const contratoProyecto = normalizeValue(row.contratoProyecto);
        const anio = normalizeValue(row.anio);
        const plancha = normalizeValue(row.plancha);

        if (!grouped.has(caja)) {
            grouped.set(caja, {
                caja,
                muestras: 0,
                idsMuestra: [],
                contratoProyecto,
                anio,
                planchas: [],
            });
        }

        const current = grouped.get(caja)!;

        if (idMuestra) {
            pushUnique(current.idsMuestra, idMuestra);
            current.muestras = current.idsMuestra.length;
        }

        if (plancha) {
            pushUniqueCaseInsensitive(current.planchas, plancha);
        }

        if (!current.contratoProyecto && contratoProyecto) {
            current.contratoProyecto = contratoProyecto;
        }

        if (!current.anio && anio) {
            current.anio = anio;
        }
    });

    return Array.from(grouped.values()).sort((a, b) => a.caja - b.caja);
}

export function formatIdsMuestra(idsMuestra: string[]): string {
    return idsMuestra.join(' - ');
}

export function formatPlanchas(planchas: string[]): string {
    return planchas.join(' - ');
}
