import { useEffect, useMemo, useState } from "react";
import { LineChart as LineChartIcon, Minus, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { WorkoutSet } from "@/storage/storage";
import { distinctExerciseNames } from "@/utils/workout";
import {
  allExerciseRecords,
  bestSetEver,
  compareLoad,
  exerciseSessions,
  exerciseWeeks,
  sessionsThisMonth,
  type ExerciseSession,
  type LoadChange,
} from "@/utils/loadEvolution";

function formatDate(iso: string): string {
  return new Date(iso.length <= 10 ? iso + "T00:00:00" : iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function ChangeBadge({ change }: { change: LoadChange | null }) {
  if (!change) {
    return <p className="text-xs text-muted-foreground">Registre mais um treino para comparar.</p>;
  }
  if (change.kind === "increase") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
        <TrendingUp className="h-3.5 w-3.5" /> +{change.deltaKg} kg
      </span>
    );
  }
  if (change.kind === "decrease") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-xs font-semibold text-warning">
        <TrendingDown className="h-3.5 w-3.5" /> -{change.deltaKg} kg
      </span>
    );
  }
  if (change.kind === "same-more-reps") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
        <TrendingUp className="h-3.5 w-3.5" /> +{change.deltaReps} reps
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
      <Minus className="h-3.5 w-3.5" /> mantida
    </span>
  );
}

function changeLabel(change: LoadChange | null): string {
  if (!change) return "";
  if (change.kind === "increase") return "Carga aumentou";
  if (change.kind === "decrease") return "Carga reduzida";
  if (change.kind === "same-more-reps") return "Carga mantida — repetições aumentaram";
  return "Carga mantida";
}

function LoadChart({ data }: { data: { label: string; carga: number }[] }) {
  if (data.length < 2) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Ainda não temos dados suficientes para mostrar sua evolução.
      </p>
    );
  }
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="loadEvoG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.6} />
              <stop offset="100%" stopColor="var(--color-primary)" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
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
            domain={["dataMin - 2", "dataMax + 2"]}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--color-muted-foreground)" }}
            formatter={(v: number) => [`${v} kg`, "Carga"]}
          />
          <Line
            type="monotone"
            dataKey="carga"
            stroke="url(#loadEvoG)"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "var(--color-primary)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LoadEvolutionSection({ sets }: { sets: WorkoutSet[] }) {
  const exerciseNames = useMemo(() => distinctExerciseNames(sets), [sets]);
  const [exerciseName, setExerciseName] = useState<string | null>(exerciseNames[0] ?? null);
  const [tab, setTab] = useState<"diario" | "semanal" | "mensal">("diario");

  useEffect(() => {
    if ((!exerciseName || !exerciseNames.includes(exerciseName)) && exerciseNames.length > 0) {
      setExerciseName(exerciseNames[0]);
    }
  }, [exerciseNames, exerciseName]);

  if (exerciseNames.length === 0) {
    return (
      <EmptyState
        icon={LineChartIcon}
        title="Sua evolução de cargas começa aqui"
        description='Registre uma série na aba "Registrar" para começar a acompanhar sua evolução.'
      />
    );
  }

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          Evolução de cargas
        </p>

        <select
          value={exerciseName ?? ""}
          onChange={(e) => setExerciseName(e.target.value)}
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none ring-primary/40 focus:ring-2"
        >
          {exerciseNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          {(
            [
              ["diario", "Diário"],
              ["semanal", "Semanal"],
              ["mensal", "Mensal"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition-colors ${
                tab === id
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </SurfaceCard>

      {exerciseName && <ExerciseLoadDetail exerciseName={exerciseName} sets={sets} tab={tab} />}

      <ExerciseRecords sets={sets} />
    </div>
  );
}

function ExerciseLoadDetail({
  exerciseName,
  sets,
  tab,
}: {
  exerciseName: string;
  sets: WorkoutSet[];
  tab: "diario" | "semanal" | "mensal";
}) {
  const sessions = useMemo(() => exerciseSessions(sets, exerciseName), [sets, exerciseName]);
  const current = sessions[sessions.length - 1];
  const previous = sessions[sessions.length - 2];
  const change = compareLoad(current, previous);
  const best = useMemo(() => bestSetEver(sets, exerciseName), [sets, exerciseName]);

  const weeks = useMemo(() => exerciseWeeks(sessions), [sessions]);
  const monthSessions = useMemo(() => sessionsThisMonth(sessions), [sessions]);

  const chartData = useMemo(() => {
    if (tab === "diario")
      return sessions.map((s) => ({ label: formatDate(s.isoDate), carga: s.bestCarga }));
    if (tab === "semanal") return weeks.map((w) => ({ label: w.label, carga: w.bestCarga }));
    return monthSessions.map((s) => ({ label: formatDate(s.isoDate), carga: s.bestCarga }));
  }, [tab, sessions, weeks, monthSessions]);

  return (
    <>
      {/* Resumo — sempre compara a sessão mais recente com a anterior, independente da aba */}
      <SurfaceCard className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Carga atual
            </p>
            <p className="font-display text-3xl font-bold tabular-nums">
              {current.bestCarga}
              <span className="ml-1 text-base font-medium text-muted-foreground">kg</span>
            </p>
            <p className="text-xs text-muted-foreground">{current.bestCargaReps} reps</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Carga anterior
            </p>
            <p className="font-display text-3xl font-bold tabular-nums text-muted-foreground">
              {previous ? previous.bestCarga : "—"}
              {previous && (
                <span className="ml-1 text-base font-medium text-muted-foreground">kg</span>
              )}
            </p>
            {previous && (
              <p className="text-xs text-muted-foreground">{previous.bestCargaReps} reps</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <ChangeBadge change={change} />
          {change && <span className="text-xs text-muted-foreground">{changeLabel(change)}</span>}
        </div>
      </SurfaceCard>

      {/* Conteúdo específico da aba */}
      {tab === "diario" && (
        <SurfaceCard className="space-y-3">
          <p className="text-sm font-semibold">Sessões</p>
          {[...sessions].reverse().map((s) => (
            <div
              key={s.dateKey}
              className="space-y-1.5 border-t border-border/60 pt-3 first:border-t-0 first:pt-0"
            >
              <p className="text-xs font-medium text-muted-foreground">{formatDate(s.isoDate)}</p>
              <ul className="space-y-1">
                {s.sets.map((set, i) => (
                  <li key={i} className="text-sm">
                    {set.carga} kg × {set.reps}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </SurfaceCard>
      )}

      {tab === "semanal" && (
        <SurfaceCard className="space-y-3">
          <p className="text-sm font-semibold">Semanas</p>
          {weeks.length < 2 ? (
            <p className="text-sm text-muted-foreground">
              Registre treinos em mais de uma semana pra ver essa comparação.
            </p>
          ) : (
            <>
              <ul className="space-y-2">
                {[...weeks].reverse().map((w) => (
                  <li key={w.weekKey} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{w.label}</span>
                    <span className="font-semibold tabular-nums">
                      {w.bestCarga} kg × {w.bestCargaReps}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                <span className="text-muted-foreground">
                  {weeks[0].label} → {weeks[weeks.length - 1].label}
                </span>
                <ChangeBadge change={compareLoad(weeks[weeks.length - 1], weeks[0])} />
              </div>
            </>
          )}
        </SurfaceCard>
      )}

      {tab === "mensal" && (
        <SurfaceCard className="space-y-3">
          <p className="text-sm font-semibold">Este mês</p>
          {monthSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum registro deste exercício neste mês.
            </p>
          ) : (
            <>
              <ul className="space-y-2">
                {monthSessions.map((s) => (
                  <li key={s.dateKey} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{formatDate(s.isoDate)}</span>
                    <span className="font-semibold tabular-nums">
                      {s.bestCarga} kg × {s.bestCargaReps}
                    </span>
                  </li>
                ))}
              </ul>
              {monthSessions.length >= 2 && (
                <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">Início do mês → atual</span>
                  <ChangeBadge
                    change={compareLoad(monthSessions[monthSessions.length - 1], monthSessions[0])}
                  />
                </div>
              )}
            </>
          )}
        </SurfaceCard>
      )}

      <SurfaceCard>
        <p className="mb-3 text-sm font-semibold">Evolução da carga</p>
        <LoadChart data={chartData} />
      </SurfaceCard>

      {best && (
        <SurfaceCard className="flex items-center justify-between">
          <p className="text-sm font-semibold">Melhor desempenho</p>
          <p className="font-display text-lg font-bold tabular-nums text-primary">
            {best.carga} kg × {best.reps}
          </p>
        </SurfaceCard>
      )}

      <FullHistory sessions={sessions} />
    </>
  );
}

function FullHistory({ sessions }: { sessions: ExerciseSession[] }) {
  if (sessions.length === 0) return null;
  return (
    <SurfaceCard className="space-y-1">
      <p className="mb-2 text-sm font-semibold">Histórico de carga</p>
      <div className="hidden grid-cols-3 gap-2 border-b border-border pb-2 text-xs uppercase tracking-wider text-muted-foreground md:grid">
        <span>Data</span>
        <span>Carga</span>
        <span>Repetições</span>
      </div>
      <ul className="divide-y divide-border/60">
        {[...sessions].reverse().map((s) => (
          <li
            key={s.dateKey}
            className="flex items-center justify-between py-2 text-sm md:grid md:grid-cols-3"
          >
            <span className="text-muted-foreground">{formatDate(s.isoDate)}</span>
            <span className="font-semibold tabular-nums">{s.bestCarga} kg</span>
            <span className="text-muted-foreground md:text-foreground">{s.bestCargaReps} reps</span>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}

function ExerciseRecords({ sets }: { sets: WorkoutSet[] }) {
  const records = useMemo(() => allExerciseRecords(sets).slice(0, 6), [sets]);
  if (records.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="Nenhum recorde ainda"
        description="Bata seu primeiro recorde de carga para vê-lo listado aqui."
      />
    );
  }

  return (
    <SurfaceCard className="space-y-3">
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <Trophy className="h-4 w-4 text-primary" /> Seus recordes
      </p>
      <ul className="space-y-2">
        {records.map((r) => (
          <li key={r.exerciseName} className="flex items-center justify-between text-sm">
            <span>{r.exerciseName}</span>
            <span className="font-semibold tabular-nums text-primary">
              {r.carga} kg × {r.reps}
            </span>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
