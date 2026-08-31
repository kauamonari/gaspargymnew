import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Trash2,
  Plus,
  Dumbbell,
  CalendarDays,
} from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import {
  STORAGE_KEYS,
  storage,
  DEFAULT_PROFILE,
  getProfile,
  type Profile,
  type WeightEntry,
} from "@/storage/storage";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Gaspar Gym — Evolução" },
      { name: "description", content: "Acompanhe sua evolução de peso semana a semana." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [newWeight, setNewWeight] = useState("");

  useEffect(() => {
    setEntries(storage.get<WeightEntry[]>(STORAGE_KEYS.weights, []));
    setProfile(getProfile());
  }, []);

  function persist(next: WeightEntry[]) {
    storage.set(STORAGE_KEYS.weights, next);
    setEntries(next);
  }

  function add() {
    const w = parseFloat(newWeight);
    if (!w || w <= 0) return;
    persist([...entries, { id: crypto.randomUUID(), weight: w, date: new Date().toISOString() }]);
    // Mantém o peso do Perfil (usado no cálculo de calorias) sempre em dia
    // com o último registro de evolução, pra não ficar desconexo.
    const nextProfile = { ...profile, peso: w };
    storage.set(STORAGE_KEYS.profile, nextProfile);
    setProfile(nextProfile);
    setNewWeight("");
  }

  function remove(id: string) {
    persist(entries.filter((e) => e.id !== id));
  }

  const sorted = [...entries].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const chartData = sorted.map((e) => ({
    date: new Date(e.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    peso: e.weight,
  }));

  const first = sorted[0]?.weight;
  const last = sorted[sorted.length - 1]?.weight;
  const diff = first !== undefined && last !== undefined ? +(last - first).toFixed(1) : 0;
  const trend = diff > 0 ? "up" : diff < 0 ? "down" : "flat";

  return (
    <div className="space-y-6 animate-slide-up">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Acompanhamento</p>
          <h1 className="font-display text-3xl font-bold">Evolução</h1>
        </div>
        <div className="flex gap-2">
          <Link
            to="/workout"
            className="flex items-center gap-1.5 rounded-full border border-workout/30 bg-workout/10 px-3 py-1.5 text-xs font-medium text-workout transition-colors hover:bg-workout/15"
          >
            <Dumbbell className="h-3.5 w-3.5" /> Treino
          </Link>
          <Link
            to="/days"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <CalendarDays className="h-3.5 w-3.5" /> Dias
          </Link>
        </div>
      </header>

      <SurfaceCard className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Peso atual</span>
          <span className="text-xs text-muted-foreground">{entries.length} registros</span>
        </div>
        <div className="flex items-end justify-between">
          <p className="font-display text-5xl font-bold tabular-nums">
            {last !== undefined ? last.toFixed(1) : "—"}
            <span className="ml-1 text-base font-medium text-muted-foreground">kg</span>
          </p>
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold ${
              trend === "up"
                ? "bg-[color-mix(in_oklab,var(--protein)_25%,transparent)] text-[color:var(--protein)]"
                : trend === "down"
                  ? "bg-[color-mix(in_oklab,var(--primary)_25%,transparent)] text-primary"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4" />
            ) : trend === "down" ? (
              <TrendingDown className="h-4 w-4" />
            ) : (
              <Minus className="h-4 w-4" />
            )}
            <span className="tabular-nums">
              {diff > 0 ? "+" : ""}
              {diff} kg
            </span>
          </div>
        </div>
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
        <h2 className="font-display text-lg font-semibold">Registrar peso</h2>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="ex: 72.5"
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
                      {e.weight.toFixed(1)} kg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(e.id)}
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
