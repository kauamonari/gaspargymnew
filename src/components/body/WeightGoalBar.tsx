import { kgToDisplayWeight, type WeightUnit } from "@/utils/units";

export function WeightGoalBar({
  initial,
  current,
  meta,
  unit = "kg",
}: {
  initial: number | null;
  current: number | null;
  meta?: number;
  unit?: WeightUnit;
}) {
  if (!meta || current === null) return null;

  // Posição na barra é sempre calculada em kg (unidade canônica) — só os
  // números exibidos convertem pra unidade escolhida pelo usuário.
  const start = initial ?? current;
  const total = meta - start;
  const progressed = current - start;
  const pct = total !== 0 ? Math.min(100, Math.max(0, (progressed / total) * 100)) : 100;
  const remainingKg = +(meta - current).toFixed(1);
  const reached = Math.abs(remainingKg) < 0.05;

  const currentDisplay = kgToDisplayWeight(current, unit);
  const metaDisplay = kgToDisplayWeight(meta, unit);
  const remainingDisplay = kgToDisplayWeight(Math.abs(remainingKg), unit);

  return (
    <div className="space-y-2.5">
      <div className="relative h-2 w-full rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 animate-fill-bar rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-primary bg-background shadow-glow"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs font-semibold tabular-nums text-muted-foreground">
        <span>
          {currentDisplay} {unit}
        </span>
        <span>
          {metaDisplay} {unit}
        </span>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {reached ? (
          <span className="font-semibold text-success">Meta alcançada! 🎉</span>
        ) : (
          <>
            Faltam{" "}
            <span className="font-semibold text-foreground">
              {remainingDisplay} {unit}
            </span>{" "}
            para sua meta.
          </>
        )}
      </p>
    </div>
  );
}
