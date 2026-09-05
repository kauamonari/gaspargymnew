import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Ruler, Trash2, TrendingDown, TrendingUp } from "lucide-react";
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
import {
  ALL_MEASUREMENT_KEYS,
  MEASUREMENT_LABELS,
  type BodyMeasurementEntry,
  type MeasurementKey,
} from "@/storage/storage";
import { computePeriodDeltas, measurementSeries } from "@/utils/bodyEvolution";
import { PeriodComparisonList } from "./PeriodComparisonList";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function MeasurementsSection({
  entries,
  trackedKeys,
  onAddEntry,
  onRemoveEntry,
  onChangeTracked,
}: {
  entries: BodyMeasurementEntry[];
  trackedKeys: MeasurementKey[];
  onAddEntry: (entry: BodyMeasurementEntry) => void;
  onRemoveEntry: (id: string) => void;
  onChangeTracked: (keys: MeasurementKey[]) => void;
}) {
  const [selectedKey, setSelectedKey] = useState<MeasurementKey | null>(trackedKeys[0] ?? null);

  useEffect(() => {
    if ((!selectedKey || !trackedKeys.includes(selectedKey)) && trackedKeys.length > 0) {
      setSelectedKey(trackedKeys[0]);
    }
  }, [trackedKeys, selectedKey]);

  function toggleTracked(key: MeasurementKey) {
    onChangeTracked(
      trackedKeys.includes(key) ? trackedKeys.filter((k) => k !== key) : [...trackedKeys, key],
    );
  }

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Quais medidas acompanhar?</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ALL_MEASUREMENT_KEYS.map((key) => {
            const active = trackedKeys.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleTracked(key)}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-background/40 text-muted-foreground"
                }`}
              >
                {MEASUREMENT_LABELS[key]}
              </button>
            );
          })}
        </div>
      </SurfaceCard>

      <AddMeasurementForm trackedKeys={trackedKeys} onAdd={onAddEntry} />

      {trackedKeys.length === 0 ? (
        <EmptyState
          icon={Ruler}
          title="Escolha o que acompanhar"
          description="Selecione ao menos uma medida acima para começar a registrar."
        />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={Ruler}
          title="Suas medidas começam aqui"
          description="Registre seu primeiro checkup acima para ver o histórico e o gráfico."
        />
      ) : (
        <>
          <SurfaceCard className="space-y-3">
            <select
              value={selectedKey ?? ""}
              onChange={(e) => setSelectedKey(e.target.value as MeasurementKey)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none ring-primary/40 focus:ring-2"
            >
              {trackedKeys.map((k) => (
                <option key={k} value={k}>
                  {MEASUREMENT_LABELS[k]}
                </option>
              ))}
            </select>
          </SurfaceCard>

          {selectedKey && <MeasurementDetail measurementKey={selectedKey} entries={entries} />}
        </>
      )}

      {entries.length > 0 && (
        <SurfaceCard className="space-y-1">
          <p className="mb-2 text-sm font-semibold">Histórico de checkups</p>
          <ul className="divide-y divide-border/60">
            {[...entries]
              .sort((a, b) => +new Date(b.date) - +new Date(a.date))
              .map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium">{formatDate(e.date)}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {Object.entries(e.values)
                        .map(([k, v]) => `${MEASUREMENT_LABELS[k as MeasurementKey]}: ${v}cm`)
                        .join(" · ")}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveEntry(e.id)}
                    className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
          </ul>
        </SurfaceCard>
      )}
    </div>
  );
}

function AddMeasurementForm({
  trackedKeys,
  onAdd,
}: {
  trackedKeys: MeasurementKey[];
  onAdd: (entry: BodyMeasurementEntry) => void;
}) {
  const [values, setValues] = useState<Partial<Record<MeasurementKey, string>>>({});

  if (trackedKeys.length === 0) return null;

  function save() {
    const parsed: Partial<Record<MeasurementKey, number>> = {};
    for (const key of trackedKeys) {
      const raw = values[key];
      const n = raw ? parseFloat(raw) : NaN;
      if (!isNaN(n) && n > 0) parsed[key] = n;
    }
    if (Object.keys(parsed).length === 0) return;
    onAdd({ id: crypto.randomUUID(), date: new Date().toISOString(), values: parsed });
    setValues({});
  }

  return (
    <SurfaceCard className="space-y-3">
      <h2 className="font-display text-lg font-semibold">Registrar medidas</h2>
      <div className="grid grid-cols-2 gap-3">
        {trackedKeys.map((key) => (
          <label key={key} className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {MEASUREMENT_LABELS[key]} (cm)
            </span>
            <input
              type="number"
              step="0.1"
              value={values[key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
              placeholder="ex: 32"
              className="mt-1 h-11 w-full rounded-xl border border-border bg-background/60 px-3 text-sm font-semibold outline-none ring-primary/40 focus:ring-2"
            />
          </label>
        ))}
      </div>
      <button
        onClick={save}
        className="shadow-glow flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" /> Salvar checkup
      </button>
    </SurfaceCard>
  );
}

function MeasurementDetail({
  measurementKey,
  entries,
}: {
  measurementKey: MeasurementKey;
  entries: BodyMeasurementEntry[];
}) {
  const series = useMemo(
    () => measurementSeries(entries, measurementKey),
    [entries, measurementKey],
  );
  const deltas = useMemo(() => computePeriodDeltas(series), [series]);
  const current = series[series.length - 1] ?? null;
  const previous = series[series.length - 2] ?? null;
  const diff = current && previous ? +(current.value - previous.value).toFixed(1) : null;

  const chartData = series.map((p) => ({
    date: new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    valor: p.value,
  }));

  return (
    <>
      <SurfaceCard className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {MEASUREMENT_LABELS[measurementKey]} atual
            </p>
            <p className="font-display text-3xl font-bold tabular-nums">
              {current ? current.value : "—"}
              {current && (
                <span className="ml-1 text-base font-medium text-muted-foreground">cm</span>
              )}
            </p>
          </div>
          {diff !== null && diff !== 0 && (
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                diff > 0 ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
              }`}
            >
              {diff > 0 ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {diff > 0 ? "+" : ""}
              {diff} cm
            </span>
          )}
          {diff === 0 && (
            <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              <Minus className="h-3.5 w-3.5" /> mantida
            </span>
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <p className="mb-3 text-sm font-semibold">Gráfico</p>
        {chartData.length < 2 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Registre pelo menos 2 medições para ver o gráfico.
          </p>
        ) : (
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
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
                  formatter={(v: number) => [`${v} cm`, MEASUREMENT_LABELS[measurementKey]]}
                />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="var(--color-primary)"
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
        <PeriodComparisonList deltas={deltas} unit="cm" />
      </SurfaceCard>
    </>
  );
}
