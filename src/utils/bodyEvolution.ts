import type { BodyMeasurementEntry, MeasurementKey, WeightEntry } from "@/storage/storage";

export interface TimeSeriesPoint {
  date: string; // ISO
  value: number;
}

export interface PeriodDelta {
  label: string;
  days: number;
  from: number | null;
  to: number | null;
  diff: number | null;
}

export const COMPARISON_PERIODS: { label: string; days: number }[] = [
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
  { label: "6 meses", days: 182 },
  { label: "1 ano", days: 365 },
];

/** Para cada período (7d, 30d, ...), compara o valor mais recente com o
 * registro mais próximo (igual ou anterior) a "hoje menos N dias". Períodos
 * sem histórico suficiente voltam com from/diff nulos. */
export function computePeriodDeltas(points: TimeSeriesPoint[]): PeriodDelta[] {
  const sorted = [...points].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  if (sorted.length === 0) {
    return COMPARISON_PERIODS.map((p) => ({ ...p, from: null, to: null, diff: null }));
  }

  const latest = sorted[sorted.length - 1];
  const now = new Date(latest.date);

  return COMPARISON_PERIODS.map(({ label, days }) => {
    const target = new Date(now);
    target.setDate(target.getDate() - days);

    let candidate: TimeSeriesPoint | null = null;
    for (const p of sorted) {
      if (+new Date(p.date) <= +target) candidate = p;
      else break;
    }

    if (!candidate || candidate.date === latest.date) {
      return { label, days, from: null, to: latest.value, diff: null };
    }
    return {
      label,
      days,
      from: candidate.value,
      to: latest.value,
      diff: +(latest.value - candidate.value).toFixed(1),
    };
  });
}

export interface WeightFullSummary {
  latest: number | null;
  initial: number | null;
  max: number | null;
  min: number | null;
  totalDiff: number | null;
  lastDate: string | null;
}

/** Resumo completo de peso: atual, inicial, maior, menor e variação total —
 * item 1 do módulo de Evolução Corporal. */
export function summarizeWeightFull(entries: WeightEntry[]): WeightFullSummary {
  const sorted = [...entries].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  if (sorted.length === 0) {
    return { latest: null, initial: null, max: null, min: null, totalDiff: null, lastDate: null };
  }
  const values = sorted.map((e) => e.weight);
  const latest = values[values.length - 1];
  const initial = values[0];
  return {
    latest,
    initial,
    max: Math.max(...values),
    min: Math.min(...values),
    totalDiff: +(latest - initial).toFixed(1),
    lastDate: sorted[sorted.length - 1].date,
  };
}

export function weightSeries(entries: WeightEntry[]): TimeSeriesPoint[] {
  return entries.map((e) => ({ date: e.date, value: e.weight }));
}

/** Extrai a série histórica de UMA medida específica a partir dos checkups
 * (cada checkup pode ter só algumas medidas preenchidas). */
export function measurementSeries(
  entries: BodyMeasurementEntry[],
  key: MeasurementKey,
): TimeSeriesPoint[] {
  return entries
    .filter((e) => e.values[key] !== undefined)
    .map((e) => ({ date: e.date, value: e.values[key]! }))
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

export function mostRecentMeasurementDate(entries: BodyMeasurementEntry[]): string | null {
  if (entries.length === 0) return null;
  return [...entries].sort((a, b) => +new Date(b.date) - +new Date(a.date))[0].date;
}

export function latestMeasurementValues(
  entries: BodyMeasurementEntry[],
): Partial<Record<MeasurementKey, number>> {
  const sorted = [...entries].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const merged: Partial<Record<MeasurementKey, number>> = {};
  for (const entry of sorted) Object.assign(merged, entry.values);
  return merged;
}
