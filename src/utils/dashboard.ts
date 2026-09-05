import { EXERCISES, MUSCLE_GROUPS, type Exercise, type MuscleGroup } from "@/data/exercises";
import type {
  CustomExercise,
  Meal,
  WeightEntry,
  WorkoutBlock,
  WorkoutSet,
} from "@/storage/storage";
import { localDateKey } from "@/utils/date";
import { setVolume } from "@/utils/workout";

/** Pool combinado de exercícios pré-definidos + criados pelo usuário. Mesma
 * lógica usada em /workout, centralizada aqui pra não duplicar. */
export function resolveExercisePool(customExercises: CustomExercise[]): Exercise[] {
  return [
    ...EXERCISES,
    ...customExercises.map((c) => ({ ...c, grupo: c.grupo as Exercise["grupo"] })),
  ];
}

export interface WorkoutSession {
  dateKey: string;
  isoDate: string;
  blockId: string;
  blockLabel: string;
  exerciseNames: string[];
  setCount: number;
  volume: number;
}

/** Agrupa séries em "sessões" (mesmo dia + mesmo treino) — a unidade natural
 * pra falar de "um treino realizado", já que a Fase 1 não grava sessões
 * explicitamente, só séries individuais. */
export function buildSessions(sets: WorkoutSet[]): WorkoutSession[] {
  const map = new Map<string, WorkoutSession>();
  for (const s of sets) {
    const dateKey = localDateKey(s.date);
    const blockId = s.blockId ?? "avulso";
    const key = `${dateKey}__${blockId}`;
    if (!map.has(key)) {
      map.set(key, {
        dateKey,
        isoDate: s.date,
        blockId,
        blockLabel: s.blockLabel ?? "Avulso",
        exerciseNames: [],
        setCount: 0,
        volume: 0,
      });
    }
    const session = map.get(key)!;
    if (!session.exerciseNames.includes(s.exerciseName)) session.exerciseNames.push(s.exerciseName);
    session.setCount += 1;
    session.volume += setVolume(s);
    if (s.date > session.isoDate) session.isoDate = s.date;
  }
  return Array.from(map.values()).sort((a, b) =>
    a.dateKey < b.dateKey ? 1 : a.dateKey > b.dateKey ? -1 : 0,
  );
}

export function lastSession(sets: WorkoutSet[]): WorkoutSession | null {
  return buildSessions(sets)[0] ?? null;
}

export function lastSessionForBlock(sets: WorkoutSet[], blockId: string): WorkoutSession | null {
  return buildSessions(sets).find((s) => s.blockId === blockId) ?? null;
}

/** Sugere o treino de hoje por rodízio simples: o próximo bloco depois do
 * usado na última sessão registrada. A Fase 1 não tem um "treino programado
 * por dia da semana", então isso é a aproximação mais honesta possível a
 * partir do histórico real. */
export function suggestedBlock(blocks: WorkoutBlock[], sets: WorkoutSet[]): WorkoutBlock | null {
  if (blocks.length === 0) return null;
  const last = lastSession(sets);
  if (!last) return blocks[0];
  const idx = blocks.findIndex((b) => b.id === last.blockId);
  if (idx === -1) return blocks[0];
  return blocks[(idx + 1) % blocks.length];
}

function daysAgoKey(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return localDateKey(d);
}

/** Sessões e séries totais numa janela de 7 dias — usado na Home como
 * "Atividade da semana". Propositalmente NÃO é volume (carga × reps): a
 * Home mostra quanto o usuário treinou, não a carga movimentada — isso
 * pertence à página de Evolução. */
export function weekActivity(sets: WorkoutSet[], weekOffset: number) {
  const startDaysAgo = weekOffset * 7;
  const endDaysAgo = startDaysAgo + 6;
  const keys = new Set<string>();
  for (let i = startDaysAgo; i <= endDaysAgo; i++) keys.add(daysAgoKey(i));

  const inWindow = sets.filter((s) => keys.has(localDateKey(s.date)));
  const sessionKeys = new Set(
    inWindow.map((s) => `${localDateKey(s.date)}__${s.blockId ?? "avulso"}`),
  );
  return { sessions: sessionKeys.size, setCount: inWindow.length };
}

const WEEKDAY_SHORT = ["D", "S", "T", "Q", "Q", "S", "S"]; // Date.getDay(): 0 = domingo

export interface DaySets {
  key: string;
  label: string;
  setCount: number;
  isToday: boolean;
}

/** Quantidade de séries por dia dos últimos 7 dias — alimenta o mini gráfico
 * de barras da Home (contagem de séries, não kg). */
export function dailySetsLast7(sets: WorkoutSet[]): DaySets[] {
  const days: DaySets[] = [];
  const todayKey = daysAgoKey(0);
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = localDateKey(d);
    days.push({ key, label: WEEKDAY_SHORT[d.getDay()], setCount: 0, isToday: key === todayKey });
  }
  const byKey = new Map(days.map((d) => [d.key, d]));
  for (const s of sets) {
    const day = byKey.get(localDateKey(s.date));
    if (day) day.setCount += 1;
  }
  return days;
}

/** Quantos dos últimos 7 dias tiveram pelo menos uma série registrada. */
export function trainingConsistency7(sets: WorkoutSet[]) {
  const days = dailySetsLast7(sets);
  const trained = days.filter((d) => d.setCount > 0).length;
  return { trained, total: 7, pct: Math.round((trained / 7) * 100) };
}

export interface ExercisePR {
  exerciseName: string;
  from: number;
  to: number;
}

/** Maior carga deste mês x maior carga em meses anteriores, por exercício —
 * base compartilhada por monthlyPRs e averageLoadGrowthPercent, pra não
 * duplicar a mesma varredura duas vezes. */
function exerciseMonthComparisons(
  sets: WorkoutSet[],
): Map<string, { thisMonthMax: number; beforeMax: number }> {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const byExercise = new Map<string, { thisMonthMax: number; beforeMax: number }>();

  for (const s of sets) {
    const d = new Date(s.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const entry = byExercise.get(s.exerciseName) ?? { thisMonthMax: 0, beforeMax: 0 };
    if (key === monthKey) entry.thisMonthMax = Math.max(entry.thisMonthMax, s.carga);
    else if (key < monthKey) entry.beforeMax = Math.max(entry.beforeMax, s.carga);
    byExercise.set(s.exerciseName, entry);
  }
  return byExercise;
}

/** PRs do mês: exercícios cuja maior carga registrada neste mês supera a
 * maior carga registrada em meses anteriores. Só conta como PR quando existe
 * histórico anterior pra comparar (senão é só "primeira vez", não recorde). */
export function monthlyPRs(sets: WorkoutSet[]): ExercisePR[] {
  const byExercise = exerciseMonthComparisons(sets);
  const prs: ExercisePR[] = [];
  for (const [exerciseName, { thisMonthMax, beforeMax }] of byExercise) {
    if (beforeMax > 0 && thisMonthMax > beforeMax) {
      prs.push({ exerciseName, from: beforeMax, to: thisMonthMax });
    }
  }
  return prs.sort((a, b) => b.to - b.from - (a.to - a.from));
}

/** Variação média de carga (%) deste mês vs meses anteriores, entre os
 * exercícios com histórico nos dois períodos — alimenta o "📈 +8% cargas" do
 * dashboard. Retorna null sem dado suficiente (evita mostrar 0% enganoso). */
export function averageLoadGrowthPercent(sets: WorkoutSet[]): number | null {
  const byExercise = exerciseMonthComparisons(sets);
  const pcts: number[] = [];
  for (const { thisMonthMax, beforeMax } of byExercise.values()) {
    if (beforeMax > 0 && thisMonthMax > 0)
      pcts.push(((thisMonthMax - beforeMax) / beforeMax) * 100);
  }
  if (pcts.length === 0) return null;
  return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
}

/** Estimativa grosseira de duração de um treino, a partir de quantas séries
 * e exercícios ele tem — usada só como referência no card "Treino de hoje",
 * não como cronômetro exato. */
export function estimateWorkoutMinutes(exerciseCount: number, setCount: number): number {
  if (exerciseCount === 0) return 0;
  const perSetSeconds = 130; // execução + descanso médio
  const perExerciseOverheadSeconds = 60; // trocar de aparelho, ajustar carga
  return Math.max(
    10,
    Math.round((setCount * perSetSeconds + exerciseCount * perExerciseOverheadSeconds) / 60),
  );
}

/** Rótulo tipo "Peito + Tríceps" a partir dos grupos musculares dos
 * exercícios de um treino — usado como subtítulo do card "Treino de hoje". */
export function blockMuscleGroupsLabel(exerciseIds: number[], pool: Exercise[]): string | null {
  const groups = new Set<MuscleGroup>();
  for (const id of exerciseIds) {
    const ex = pool.find((e) => e.id === id);
    if (ex) groups.add(ex.grupo);
  }
  if (groups.size === 0) return null;
  return Array.from(groups)
    .map((g) => MUSCLE_GROUPS.find((m) => m.id === g)?.label ?? g)
    .join(" + ");
}

/** Sequência de dias consecutivos com alguma atividade (refeição registrada
 * ou série de treino), contando de hoje pra trás. Se hoje ainda não teve
 * nenhum registro, considera a sequência "viva" enquanto ontem teve. */
export function activityStreak(meals: Meal[], sets: WorkoutSet[]): number {
  const activeDays = new Set<string>();
  for (const m of meals) activeDays.add(localDateKey(m.date));
  for (const s of sets) activeDays.add(localDateKey(s.date));

  const hasToday = activeDays.has(daysAgoKey(0));
  const hasYesterday = activeDays.has(daysAgoKey(1));
  if (!hasToday && !hasYesterday) return 0;

  let streak = 0;
  const startOffset = hasToday ? 0 : 1;
  for (let i = startOffset; ; i++) {
    if (activeDays.has(daysAgoKey(i))) streak++;
    else break;
  }
  return streak;
}

export interface WeightSummary {
  latest: WeightEntry | null;
  previous: WeightEntry | null;
  diff: number | null;
  series: { date: string; peso: number }[];
}

export function summarizeWeights(entries: WeightEntry[]): WeightSummary {
  const sorted = [...entries].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const latest = sorted[sorted.length - 1] ?? null;
  const previous = sorted[sorted.length - 2] ?? null;
  const diff = latest && previous ? +(latest.weight - previous.weight).toFixed(1) : null;
  const series = sorted.slice(-8).map((e) => ({
    date: new Date(e.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    peso: e.weight,
  }));
  return { latest, previous, diff, series };
}

/** Quantos treinos foram feitos neste mês — base pra "Treinos este mês" nas
 * Estatísticas do Perfil. */
export function sessionsThisCalendarMonth(sets: WorkoutSet[]): number {
  const now = new Date();
  return buildSessions(sets).filter((s) => {
    const d = new Date(s.isoDate);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
}

/** Quantas vezes, ao longo de toda a história, uma carga nova superou o
 * recorde anterior de algum exercício (o primeiro registro de um exercício
 * não conta como "recorde batido", só o normal início do histórico). */
export function lifetimePRCount(sets: WorkoutSet[]): number {
  const sorted = [...sets].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const maxByExercise = new Map<string, number>();
  let count = 0;
  for (const s of sorted) {
    const prevMax = maxByExercise.get(s.exerciseName) ?? 0;
    if (s.carga > prevMax) {
      if (prevMax > 0) count++;
      maxByExercise.set(s.exerciseName, s.carga);
    }
  }
  return count;
}

/** Maior sequência de dias consecutivos com atividade já alcançada, não só
 * a sequência atual (ver activityStreak) — usada nas Estatísticas do Perfil. */
export function bestStreakEver(meals: Meal[], sets: WorkoutSet[]): number {
  const activeDays = new Set<string>();
  for (const m of meals) activeDays.add(localDateKey(m.date));
  for (const s of sets) activeDays.add(localDateKey(s.date));
  if (activeDays.size === 0) return 0;

  const sortedKeys = Array.from(activeDays).sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < sortedKeys.length; i++) {
    const diffDays = Math.round(
      (+new Date(sortedKeys[i]) - +new Date(sortedKeys[i - 1])) / 86400000,
    );
    if (diffDays === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}

export interface BestEvolutionExercise {
  exerciseName: string;
  from: number;
  to: number;
}

/** Exercício com a maior evolução de carga desde o primeiro registro até o
 * recorde atual — usado nas Estatísticas do Perfil. */
export function bestEvolutionExercise(sets: WorkoutSet[]): BestEvolutionExercise | null {
  const sorted = [...sets].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const byExercise = new Map<string, { first: number; max: number }>();
  for (const s of sorted) {
    const entry = byExercise.get(s.exerciseName);
    if (!entry) byExercise.set(s.exerciseName, { first: s.carga, max: s.carga });
    else entry.max = Math.max(entry.max, s.carga);
  }

  let best: BestEvolutionExercise | null = null;
  for (const [exerciseName, { first, max }] of byExercise) {
    if (max > first && (!best || max - first > best.to - best.from)) {
      best = { exerciseName, from: first, to: max };
    }
  }
  return best;
}
