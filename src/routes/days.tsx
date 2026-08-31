import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Dumbbell, TrendingUp } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  DEFAULT_PROFILE,
  getMealTypes,
  getProfile,
  STORAGE_KEYS,
  storage,
  type Meal,
  type MealTypeDef,
  type Profile,
  type WorkoutSet,
} from "@/storage/storage";
import { calcMacroGoals, sumMeals } from "@/utils/nutrition";
import { groupByExercise, maxCarga, totalVolume } from "@/utils/workout";
import { localDateKey } from "@/utils/date";

export const Route = createFileRoute("/days")({
  head: () => ({
    meta: [
      { title: "Gaspar Gym — Dias" },
      {
        name: "description",
        content: "Calendário com suas calorias e macros dos dias anteriores.",
      },
    ],
  }),
  component: DaysPage,
});

function dayKey(d: Date) {
  return localDateKey(d);
}

function DaysPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [mealTypes, setMealTypes] = useState<MealTypeDef[]>([]);
  const [selected, setSelected] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  useEffect(() => {
    setMeals(storage.get<Meal[]>(STORAGE_KEYS.meals, []));
    setWorkoutSets(storage.get<WorkoutSet[]>(STORAGE_KEYS.workoutSets, []));
    setProfile(getProfile());
    setMealTypes(getMealTypes());
  }, []);

  const goals = calcMacroGoals(profile);

  const byDay = useMemo(() => {
    const map = new Map<string, Meal[]>();
    for (const m of meals) {
      const k = localDateKey(m.date);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(m);
    }
    return map;
  }, [meals]);

  const workoutByDay = useMemo(() => {
    const map = new Map<string, WorkoutSet[]>();
    for (const s of workoutSets) {
      const k = localDateKey(s.date);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(s);
    }
    return map;
  }, [workoutSets]);

  const recordedDates = useMemo(() => {
    const keys = new Set([...byDay.keys(), ...workoutByDay.keys()]);
    return Array.from(keys).map((k) => new Date(k + "T00:00:00"));
  }, [byDay, workoutByDay]);

  const recordedTotals = useMemo(
    () => Array.from(byDay.values()).map((items) => sumMeals(items).calorias),
    [byDay],
  );
  const avg = recordedTotals.length
    ? Math.round(recordedTotals.reduce((a, b) => a + b, 0) / recordedTotals.length)
    : 0;

  const selectedKey = dayKey(selected);
  const selectedMeals = byDay.get(selectedKey) ?? [];
  const selectedTotals = sumMeals(selectedMeals);
  const diff = selectedTotals.calorias - goals.calorias;

  const selectedSets = workoutByDay.get(selectedKey) ?? [];
  const selectedExercises = groupByExercise(selectedSets);
  const selectedVolume = totalVolume(selectedSets);

  return (
    <div className="space-y-6 animate-slide-up">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Histórico</p>
          <h1 className="font-display text-3xl font-bold">Calendário</h1>
        </div>
        <div className="flex gap-2">
          <Link
            to="/workout"
            className="flex items-center gap-1.5 rounded-full border border-workout/30 bg-workout/10 px-3 py-1.5 text-xs font-medium text-workout transition-colors hover:bg-workout/15"
          >
            <Dumbbell className="h-3.5 w-3.5" /> Treino
          </Link>
          <Link
            to="/progress"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <TrendingUp className="h-3.5 w-3.5" /> Peso
          </Link>
        </div>
      </header>

      <SurfaceCard className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Média ({recordedTotals.length} dias)
          </p>
          <p className="font-display text-4xl font-bold tabular-nums">
            {avg}
            <span className="ml-1 text-sm font-medium text-muted-foreground">kcal</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Meta</p>
          <p className="font-display text-xl font-semibold tabular-nums text-muted-foreground">
            {goals.calorias}
          </p>
        </div>
      </SurfaceCard>

      <SurfaceCard className="px-2 py-3">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => d && setSelected(d)}
          disabled={(date) => date > new Date()}
          modifiers={{ recorded: recordedDates }}
          modifiersClassNames={{
            recorded:
              "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-foreground/70",
          }}
          showOutsideDays
          className={cn("p-2 pointer-events-auto mx-auto bg-transparent")}
        />
        <div className="mt-2 flex items-center justify-center gap-4 text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" /> com registro
          </span>
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {selected.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </p>
            <p className="font-display text-3xl font-bold tabular-nums">
              {selectedTotals.calorias}
              <span className="ml-1 text-sm font-medium text-muted-foreground">
                / {goals.calorias} kcal
              </span>
            </p>
          </div>
          {selectedMeals.length > 0 && (
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold tabular-nums",
                diff > 0
                  ? "border-destructive/40 text-destructive"
                  : "border-border text-muted-foreground",
              )}
            >
              {diff > 0 ? "+" : ""}
              {diff} kcal
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <MacroPill
            label="Proteína"
            value={selectedTotals.proteina}
            goal={goals.proteina}
            color="protein"
          />
          <MacroPill label="Carbo" value={selectedTotals.carbo} goal={goals.carbo} color="carbs" />
          <MacroPill
            label="Gordura"
            value={selectedTotals.gordura}
            goal={goals.gordura}
            color="fat"
          />
        </div>

        {selectedMeals.length > 0 ? (
          <ul className="space-y-1.5 border-t border-border/60 pt-3">
            {mealTypes.map((t) => {
              const items = selectedMeals.filter((m) => m.mealType === t.id);
              if (items.length === 0) return null;
              const s = sumMeals(items);
              return (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-lg bg-background/40 px-3 py-2 text-sm"
                >
                  <span className="text-muted-foreground">
                    {t.emoji} {t.label}
                    <span className="ml-2 text-[11px]">
                      · {items.length} {items.length === 1 ? "item" : "itens"}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">{s.calorias} kcal</span>
                </li>
              );
            })}
            {(() => {
              // Refeições registradas com uma seção que já foi removida —
              // continuam contando no total, só agrupadas aqui pra não sumir.
              const knownIds = new Set(mealTypes.map((t) => t.id));
              const orphan = selectedMeals.filter((m) => !knownIds.has(m.mealType));
              if (orphan.length === 0) return null;
              const s = sumMeals(orphan);
              return (
                <li className="flex items-center justify-between rounded-lg bg-background/40 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">
                    🗂️ Outros
                    <span className="ml-2 text-[11px]">
                      · {orphan.length} {orphan.length === 1 ? "item" : "itens"}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">{s.calorias} kcal</span>
                </li>
              );
            })()}
          </ul>
        ) : (
          <p className="border-t border-border/60 pt-4 text-center text-sm text-muted-foreground">
            Nenhum registro neste dia.
          </p>
        )}
      </SurfaceCard>

      <SurfaceCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Treino do dia</h2>
          {selectedSets.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {selectedVolume.toLocaleString("pt-BR")}kg de volume
            </span>
          )}
        </div>

        {selectedExercises.size > 0 ? (
          <ul className="space-y-1.5">
            {Array.from(selectedExercises.entries()).map(([name, items]) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-lg bg-background/40 px-3 py-2 text-sm"
              >
                <span className="text-muted-foreground">
                  {name}
                  <span className="ml-2 text-[11px]">
                    · {items.length} {items.length === 1 ? "série" : "séries"}
                  </span>
                </span>
                <span className="font-semibold tabular-nums">{maxCarga(items)}kg máx</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Nenhum treino registrado neste dia.
          </p>
        )}
      </SurfaceCard>
    </div>
  );
}

function MacroPill({
  label,
  value,
  goal,
  color,
}: {
  label: string;
  value: number;
  goal: number;
  color: "protein" | "carbs" | "fat";
}) {
  const colorVar =
    color === "protein"
      ? "var(--color-protein)"
      : color === "carbs"
        ? "var(--color-carbs)"
        : "var(--color-fat)";
  const pct = Math.min((value / Math.max(goal, 1)) * 100, 100);
  return (
    <div className="space-y-1.5 rounded-lg bg-background/40 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums" style={{ color: colorVar }}>
        {value.toFixed(0)}
        <span className="text-muted-foreground"> / {goal}g</span>
      </p>
      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, backgroundColor: colorVar }}
        />
      </div>
    </div>
  );
}
