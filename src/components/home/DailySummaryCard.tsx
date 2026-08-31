import { SurfaceCard } from "@/components/SurfaceCard";

interface MacroValue {
  value: number;
  goal: number;
}

interface Props {
  calorias: MacroValue;
  proteina: MacroValue;
  carbo: MacroValue;
  gordura: MacroValue;
}

function pct(v: number, g: number) {
  if (g <= 0) return 0;
  return Math.min(Math.round((v / g) * 100), 999);
}

function Bar({ value, goal, color }: { value: number; goal: number; color: string }) {
  const p = Math.min(pct(value, goal), 100);
  return (
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div
        className="animate-fill-bar h-full rounded-full"
        style={{ width: `${p}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function DailySummaryCard({ calorias, proteina, carbo, gordura }: Props) {
  return (
    <SurfaceCard className="space-y-5">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
        Resumo de hoje
      </p>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-3xl font-bold tabular-nums">
            {Math.round(calorias.value).toLocaleString("pt-BR")}
            <span className="ml-1 text-sm font-medium text-muted-foreground">
              / {Math.round(calorias.goal).toLocaleString("pt-BR")} kcal
            </span>
          </span>
          <span className="font-display text-sm font-bold tabular-nums text-primary">
            {pct(calorias.value, calorias.goal)}%
          </span>
        </div>
        <Bar value={calorias.value} goal={calorias.goal} color="var(--color-primary)" />
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold">
            Proteína{" "}
            <span className="font-normal text-muted-foreground">
              {Math.round(proteina.value)} / {Math.round(proteina.goal)} g
            </span>
          </span>
          <span className="text-xs font-bold tabular-nums text-info">
            {pct(proteina.value, proteina.goal)}%
          </span>
        </div>
        <Bar value={proteina.value} goal={proteina.goal} color="var(--color-info)" />
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-carbs" /> Carboidratos
          </p>
          <p className="mt-1 font-display text-lg font-bold tabular-nums">
            {Math.round(carbo.value)}
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              / {Math.round(carbo.goal)} g
            </span>
          </p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-fat" /> Gorduras
          </p>
          <p className="mt-1 font-display text-lg font-bold tabular-nums">
            {Math.round(gordura.value)}
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              / {Math.round(gordura.goal)} g
            </span>
          </p>
        </div>
      </div>
    </SurfaceCard>
  );
}
