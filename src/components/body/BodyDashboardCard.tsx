import { Ruler } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import {
  MEASUREMENT_LABELS,
  type BodyMeasurementEntry,
  type MeasurementKey,
} from "@/storage/storage";
import { latestMeasurementValues, mostRecentMeasurementDate } from "@/utils/bodyEvolution";
import { kgToDisplayWeight, type WeightUnit } from "@/utils/units";
import { WeightGoalBar } from "./WeightGoalBar";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function BodyDashboardCard({
  weightLatest,
  weightInitial,
  weightDiff,
  pesoMeta,
  measurements,
  trackedKeys,
  unit = "kg",
}: {
  weightLatest: number | null;
  weightInitial: number | null;
  weightDiff: number | null;
  pesoMeta?: number;
  measurements: BodyMeasurementEntry[];
  trackedKeys: MeasurementKey[];
  unit?: WeightUnit;
}) {
  const lastMeasurementDate = mostRecentMeasurementDate(measurements);
  const latestValues = latestMeasurementValues(measurements);
  const trackedWithValues = trackedKeys.filter((k) => latestValues[k] !== undefined);

  const lastUpdate = [lastMeasurementDate].filter(Boolean).sort().reverse()[0] ?? null;

  return (
    <SurfaceCard className="space-y-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
        <Ruler className="h-3.5 w-3.5" /> Dashboard corporal
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Peso atual</p>
          <p className="font-display text-2xl font-bold tabular-nums">
            {weightLatest !== null ? kgToDisplayWeight(weightLatest, unit) : "—"}
            {weightLatest !== null && (
              <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span>
            )}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Meta</p>
          <p className="font-display text-2xl font-bold tabular-nums">
            {pesoMeta ? kgToDisplayWeight(pesoMeta, unit) : "—"}
            {pesoMeta && (
              <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span>
            )}
          </p>
        </div>
      </div>

      {pesoMeta && weightLatest !== null && (
        <WeightGoalBar initial={weightInitial} current={weightLatest} meta={pesoMeta} unit={unit} />
      )}

      {weightDiff !== null && (
        <p className="text-xs text-muted-foreground">
          Variação total:{" "}
          <span className="font-semibold text-foreground">
            {weightDiff > 0 ? "+" : ""}
            {kgToDisplayWeight(weightDiff, unit)} {unit}
          </span>{" "}
          desde o início
        </p>
      )}

      {trackedWithValues.length > 0 && (
        <div className="border-t border-border/60 pt-3">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            Últimas medidas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {trackedWithValues.map((k) => (
              <span
                key={k}
                className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
              >
                {MEASUREMENT_LABELS[k]}: {latestValues[k]} cm
              </span>
            ))}
          </div>
        </div>
      )}

      {lastUpdate && (
        <p className="text-[11px] text-muted-foreground">
          Última atualização: {formatDate(lastUpdate)}
        </p>
      )}
    </SurfaceCard>
  );
}
