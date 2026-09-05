import { useMemo, useState } from "react";
import { Plus, Scale, Target, Trash2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { EmptyState } from "@/components/EmptyState";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { WeightEntry } from "@/storage/storage";
import { computePeriodDeltas, summarizeWeightFull, weightSeries } from "@/utils/bodyEvolution";
import { displayWeightToKg, kgToDisplayWeight, type WeightUnit } from "@/utils/units";
import { PeriodComparisonList } from "./PeriodComparisonList";
import { WeightGoalBar } from "./WeightGoalBar";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function WeightSection({
  entries,
  pesoMeta,
  unit = "kg",
  onAdd,
  onRemove,
  onChangeMeta,
}: {
  entries: WeightEntry[];
  pesoMeta?: number;
  unit?: WeightUnit;
  onAdd: (weight: number) => void;
  onRemove: (id: string) => void;
  onChangeMeta: (meta: number | undefined) => void;
}) {
  const [newWeight, setNewWeight] = useState("");
  const [metaInput, setMetaInput] = useState(
    pesoMeta ? String(kgToDisplayWeight(pesoMeta, unit)) : "",
  );

  const summary = useMemo(() => summarizeWeightFull(entries), [entries]);
  const series = useMemo(() => weightSeries(entries), [entries]);
  const deltasKg = useMemo(() => computePeriodDeltas(series), [series]);
  const deltas = useMemo(
    () =>
      deltasKg.map((d) => ({
        ...d,
        from: d.from !== null ? kgToDisplayWeight(d.from, unit) : null,
        to: d.to !== null ? kgToDisplayWeight(d.to, unit) : null,
        diff: d.diff !== null ? kgToDisplayWeight(d.diff, unit) : null,
      })),
    [deltasKg, unit],
  );

  const sorted = [...entries].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const chartData = sorted.map((e) => ({
    date: new Date(e.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    peso: kgToDisplayWeight(e.weight, unit),
  }));

  function add() {
    const w = parseFloat(newWeight);
    if (!w || w <= 0) return;
    onAdd(displayWeightToKg(w, unit));
    setNewWeight("");
  }

  function saveMeta() {
    const m = parseFloat(metaInput);
    onChangeMeta(!metaInput || isNaN(m) || m <= 0 ? undefined : displayWeightToKg(m, unit));
  }

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <EmptyState
          icon={Scale}
          title="Sua evolução de peso começa aqui"
          description="Registre seu primeiro peso abaixo para acompanhar sua evolução, definir uma meta e ver seu gráfico."
        />
      ) : (
        <>
          <SurfaceCard className="space-y-3">
            <h2 className="font-display text-lg font-semibold">Resumo</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Atual" value={summary.latest} unit={unit} />
              <Stat label="Inicial" value={summary.initial} unit={unit} />
              <Stat label="Maior peso" value={summary.max} unit={unit} />
              <Stat label="Menor peso" value={summary.min} unit={unit} />
            </div>
            {summary.totalDiff !== null && (
              <p className="border-t border-border/60 pt-3 text-sm text-muted-foreground">
                Variação total:{" "}
                <span className="font-semibold text-foreground">
                  {summary.totalDiff > 0 ? "+" : ""}
                  {kgToDisplayWeight(summary.totalDiff, unit)} {unit}
                </span>
              </p>
            )}
          </SurfaceCard>

          <SurfaceCard className="space-y-3">
            <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold">
              <Target className="h-4 w-4 text-primary" /> Meta de peso
            </h2>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={metaInput}
                onChange={(e) => setMetaInput(e.target.value)}
                onBlur={saveMeta}
                placeholder="ex: 80"
                className="h-11 flex-1 rounded-xl border border-border bg-background/60 px-3 text-sm font-semibold outline-none ring-primary/40 focus:ring-2"
              />
              <button
                onClick={saveMeta}
                className="rounded-xl border border-primary/40 bg-primary/10 px-4 text-sm font-semibold text-primary"
              >
                Salvar
              </button>
            </div>
            {pesoMeta && summary.latest !== null && (
              <WeightGoalBar
                initial={summary.initial}
                current={summary.latest}
                meta={pesoMeta}
                unit={unit}
              />
            )}
          </SurfaceCard>

          <SurfaceCard>
            <h2 className="mb-3 font-display text-lg font-semibold">Gráfico</h2>
            {chartData.length < 2 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Registre pelo menos 2 medições para ver o gráfico.
              </p>
            ) : (
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="var(--color-primary)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="var(--color-border)"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="var(--color-muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      domain={["dataMin - 1", "dataMax + 1"]}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "var(--color-muted-foreground)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="peso"
                      stroke="url(#lineG)"
                      strokeWidth={2.5}
                      dot={{ r: 3.5, fill: "var(--color-primary)" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </SurfaceCard>

          <SurfaceCard className="space-y-3">
            <p className="text-sm font-semibold">Evolução por período</p>
            <PeriodComparisonList deltas={deltas} unit={unit} />
          </SurfaceCard>
        </>
      )}

      <SurfaceCard className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Registrar peso</h2>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder={unit === "kg" ? "ex: 72.5" : "ex: 160"}
            className="h-12 flex-1 rounded-xl border border-border bg-background/60 px-4 text-base outline-none ring-primary/40 focus:ring-2"
          />
          <button
            onClick={add}
            className="shadow-glow flex h-12 items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> Salvar
          </button>
        </div>
      </SurfaceCard>

      {sorted.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-display text-lg font-semibold">Histórico</h2>
          <ul className="space-y-2">
            {[...sorted].reverse().map((e) => (
              <li key={e.id}>
                <SurfaceCard className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-display text-lg font-bold tabular-nums">
                      {kgToDisplayWeight(e.weight, unit).toFixed(1)} {unit}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(e.date)}</p>
                  </div>
                  <button
                    onClick={() => onRemove(e.id)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </SurfaceCard>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: number | null; unit: WeightUnit }) {
  const display = value !== null ? kgToDisplayWeight(value, unit) : null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-bold tabular-nums">
        {display !== null ? display.toFixed(1) : "—"}
        {display !== null && (
          <span className="ml-1 text-xs font-medium text-muted-foreground">{unit}</span>
        )}
      </p>
    </div>
  );
}
