import type { PeriodDelta } from "@/utils/bodyEvolution";

export function PeriodComparisonList({ deltas, unit }: { deltas: PeriodDelta[]; unit: string }) {
  return (
    <div className="space-y-2">
      {deltas.map((d) => (
        <div
          key={d.label}
          className="flex items-center justify-between rounded-xl bg-background/40 px-3 py-2.5 text-sm"
        >
          <span className="text-muted-foreground">{d.label}</span>
          {d.from === null ? (
            <span className="text-xs text-muted-foreground">Sem dados suficientes</span>
          ) : (
            <span className="flex items-center gap-1.5 font-semibold tabular-nums">
              {d.from}
              {unit} → {d.to}
              {unit}
              <span
                className={
                  d.diff! > 0
                    ? "text-warning"
                    : d.diff! < 0
                      ? "text-success"
                      : "text-muted-foreground"
                }
              >
                ({d.diff! > 0 ? "+" : ""}
                {d.diff}
                {unit})
              </span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
