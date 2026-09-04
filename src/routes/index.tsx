import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Settings2, Trash2, Check } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import { HomeHeader } from "@/components/home/HomeHeader";
import { DailySummaryCard } from "@/components/home/DailySummaryCard";
import { TodayWorkoutCard } from "@/components/home/TodayWorkoutCard";
import { WeightCard } from "@/components/home/WeightCard";
import { LastWorkoutCard } from "@/components/home/LastWorkoutCard";
import { WeeklyActivityCard } from "@/components/home/WeeklyActivityCard";
import { HighlightsCard, type Highlight } from "@/components/home/HighlightsCard";
import { SmartFeedback } from "@/components/home/SmartFeedback";
import {
  DEFAULT_PROFILE,
  DEFAULT_WORKOUT_BLOCKS,
  getMealTypes,
  getProfile,
  STORAGE_KEYS,
  storage,
  type Meal,
  type MealTypeDef,
  type Profile,
  type WeightEntry,
  type WorkoutBlock,
  type WorkoutSet,
} from "@/storage/storage";
import { calcMacroGoals, isSameDay, sumMeals } from "@/utils/nutrition";
import {
  activityStreak,
  dailySetsLast7,
  lastSession,
  lastSessionForBlock,
  monthlyPRs,
  suggestedBlock,
  summarizeWeights,
  trainingConsistency7,
  weekActivity,
} from "@/utils/dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gaspar Gym — Hoje" },
      { name: "description", content: "Seu centro de controle diário: dieta, treino e evolução." },
    ],
  }),
  component: Dashboard,
});

const EMOJI_OPTIONS = ["🍳", "🥗", "🍎", "🥤", "🍫", "🌮", "🍜", "🍇"];

function Dashboard() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealTypes, setMealTypes] = useState<MealTypeDef[]>([]);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [blocks, setBlocks] = useState<WorkoutBlock[]>([]);
  const [managing, setManaging] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newEmoji, setNewEmoji] = useState(EMOJI_OPTIONS[0]);

  useEffect(() => {
    setProfile(getProfile());
    setMeals(storage.get<Meal[]>(STORAGE_KEYS.meals, []));
    setMealTypes(getMealTypes());
    setWeights(storage.get<WeightEntry[]>(STORAGE_KEYS.weights, []));
    setSets(storage.get<WorkoutSet[]>(STORAGE_KEYS.workoutSets, []));
    setBlocks(storage.get<WorkoutBlock[]>(STORAGE_KEYS.workoutBlocks, DEFAULT_WORKOUT_BLOCKS));
  }, []);

  // ---------- Dieta ----------
  const today = new Date().toISOString();
  const todayMeals = meals.filter((m) => isSameDay(m.date, today));
  const totals = sumMeals(todayMeals);
  const goals = calcMacroGoals(profile);

  // ---------- Treino de hoje ----------
  const todayBlock = useMemo(() => suggestedBlock(blocks, sets), [blocks, sets]);
  const todayEstimatedSets = useMemo(
    () => (todayBlock ? (lastSessionForBlock(sets, todayBlock.id)?.setCount ?? null) : null),
    [todayBlock, sets],
  );

  // ---------- Peso ----------
  const weightSummary = useMemo(() => summarizeWeights(weights), [weights]);

  // ---------- Último treino ----------
  const last = useMemo(() => lastSession(sets), [sets]);

  // ---------- Atividade semanal ----------
  const thisWeekActivity = useMemo(() => weekActivity(sets, 0), [sets]);
  const dailySets = useMemo(() => dailySetsLast7(sets), [sets]);

  // ---------- Destaques ----------
  const prs = useMemo(() => monthlyPRs(sets), [sets]);
  const consistency = useMemo(() => trainingConsistency7(sets), [sets]);
  const streak = useMemo(() => activityStreak(meals, sets), [meals, sets]);

  const highlights = useMemo(() => {
    const items: Highlight[] = [];
    if (prs.length > 0) {
      items.push({
        icon: "🏆",
        value: `${prs.length}`,
        label: `${prs.length === 1 ? "PR" : "PRs"} este mês`,
      });
    }
    if (consistency.trained > 0) {
      items.push({ icon: "🔥", value: `${consistency.pct}%`, label: "Consistência (7 dias)" });
    }
    if (profile.pesoMeta && weightSummary.latest) {
      const falta = +(profile.pesoMeta - weightSummary.latest.weight).toFixed(1);
      if (falta !== 0) {
        items.push({
          icon: "🎯",
          value: `${Math.abs(falta)} kg`,
          label: falta > 0 ? "Faltam para a meta" : "Acima da meta",
        });
      }
    } else if (prs[0]) {
      const gain = +(prs[0].to - prs[0].from).toFixed(1);
      items.push({ icon: "📈", value: `+${gain} kg`, label: `no ${prs[0].exerciseName}` });
    }
    return items.slice(0, 3);
  }, [prs, consistency, profile.pesoMeta, weightSummary.latest]);

  // ---------- Feedback inteligente ----------
  const feedback = useMemo(() => {
    const remaining = Math.round(goals.calorias - totals.calorias);
    if (todayMeals.length > 0 && remaining >= 50) {
      return (
        <>
          🔥 Você está <strong className="font-semibold text-primary">{remaining} kcal</strong>{" "}
          abaixo da sua meta hoje.
        </>
      );
    }
    if (prs.length > 0) {
      const p = prs[0];
      return (
        <>
          💪 Novo recorde no{" "}
          <strong className="font-semibold text-primary">{p.exerciseName}</strong>: {p.from}kg →{" "}
          {p.to}kg.
        </>
      );
    }
    if (todayMeals.length > 0 && remaining <= -50) {
      return (
        <>
          ⚠️ Você passou da meta de calorias hoje em{" "}
          <strong className="font-semibold text-primary">{Math.abs(remaining)} kcal</strong>.
        </>
      );
    }
    if (consistency.trained >= 4) {
      return (
        <>
          🎯 Continue assim! Você treinou{" "}
          <strong className="font-semibold text-primary">{consistency.trained}x</strong> esta
          semana.
        </>
      );
    }
    return null;
  }, [goals.calorias, totals.calorias, todayMeals.length, prs, consistency.trained]);

  // ---------- Gestão de seções de refeição (Fase 1, já existia) ----------
  function removeMeal(id: string) {
    const next = meals.filter((m) => m.id !== id);
    setMeals(next);
    storage.set(STORAGE_KEYS.meals, next);
  }

  function persistMealTypes(next: MealTypeDef[]) {
    storage.set(STORAGE_KEYS.mealTypes, next);
    setMealTypes(next);
  }

  function removeSection(id: string) {
    if (mealTypes.length <= 1) return;
    persistMealTypes(mealTypes.filter((t) => t.id !== id));
  }

  function addSection() {
    const label = newLabel.trim();
    if (!label) return;
    const id =
      label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || crypto.randomUUID();
    const hour = mealTypes.length > 0 ? (mealTypes[mealTypes.length - 1].hour + 2) % 24 : 8;
    persistMealTypes([...mealTypes, { id, label, emoji: newEmoji, hour }]);
    setNewLabel("");
    setNewEmoji(EMOJI_OPTIONS[0]);
  }

  return (
    <div className="space-y-4 animate-slide-up">
      <HomeHeader nome={profile.nome} streak={streak} />

      <DailySummaryCard
        calorias={{ value: totals.calorias, goal: goals.calorias }}
        proteina={{ value: totals.proteina, goal: goals.proteina }}
        carbo={{ value: totals.carbo, goal: goals.carbo }}
        gordura={{ value: totals.gordura, goal: goals.gordura }}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <WeightCard summary={weightSummary} pesoMeta={profile.pesoMeta} />
        <TodayWorkoutCard
          block={todayBlock}
          exerciseCount={todayBlock?.exerciseIds.length ?? 0}
          estimatedSets={todayEstimatedSets}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <LastWorkoutCard session={last} />
        <WeeklyActivityCard
          sessions={thisWeekActivity.sessions}
          setCount={thisWeekActivity.setCount}
          days={dailySets}
        />
      </div>

      <HighlightsCard highlights={highlights} />

      <SmartFeedback message={feedback} />

      {/* ---------- Refeições de hoje (detalhe + gestão de seções) ---------- */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Refeições de hoje</h2>
          <button
            onClick={() => setManaging((v) => !v)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              managing
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {managing ? <Check className="h-3.5 w-3.5" /> : <Settings2 className="h-3.5 w-3.5" />}
            {managing ? "Concluir" : "Editar seções"}
          </button>
        </div>

        {managing && (
          <SurfaceCard className="space-y-3 border-primary/30">
            <p className="text-xs text-muted-foreground">
              Remova seções que você não usa ou adicione uma nova (ex: "Pré-treino").
            </p>
            <ul className="space-y-1.5">
              {mealTypes.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-lg bg-background/40 px-3 py-2"
                >
                  <span className="text-sm font-medium">
                    {t.emoji} {t.label}
                  </span>
                  <button
                    onClick={() => removeSection(t.id)}
                    disabled={mealTypes.length <= 1}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                    aria-label={`Remover ${t.label}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 border-t border-border/60 pt-3">
              <select
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value)}
                className="h-10 rounded-lg border border-border bg-background/60 px-2 text-lg outline-none"
              >
                {EMOJI_OPTIONS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Nome da nova seção"
                className="h-10 flex-1 rounded-lg border border-border bg-background/60 px-3 text-sm outline-none ring-primary/40 focus:ring-2"
              />
              <button
                onClick={addSection}
                disabled={!newLabel.trim()}
                className="flex h-10 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </SurfaceCard>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {mealTypes.map((t) => {
            const items = todayMeals.filter((m) => m.mealType === t.id);
            const sub = sumMeals(items);
            return (
              <MealSection
                key={t.id}
                type={t.id}
                label={t.label}
                emoji={t.emoji}
                items={items}
                kcal={sub.calorias}
                onRemove={removeMeal}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MealSection({
  type,
  label,
  emoji,
  items,
  kcal,
  onRemove,
}: {
  type: string;
  label: string;
  emoji: string;
  items: Meal[];
  kcal: number;
  onRemove: (id: string) => void;
}) {
  return (
    <SurfaceCard className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{emoji}</span>
          <div>
            <p className="font-display font-semibold leading-tight">{label}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "itens"} · {kcal} kcal
            </p>
          </div>
        </div>
        <Link
          to="/add"
          search={{ type }}
          className="shadow-glow flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95"
          aria-label={`Adicionar em ${label}`}
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>

      {items.length > 0 && (
        <ul className="space-y-1.5 border-t border-border/60 pt-3">
          {items.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-xl bg-background/40 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{m.nome}</p>
                <p className="text-[11px] text-muted-foreground">
                  {m.gramas}g · P{m.proteina} · C{m.carbo} · G{m.gordura}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="font-display text-sm font-bold tabular-nums text-primary">
                    {m.calorias}
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">kcal</p>
                </div>
                <button
                  onClick={() => onRemove(m.id)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remover"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SurfaceCard>
  );
}
